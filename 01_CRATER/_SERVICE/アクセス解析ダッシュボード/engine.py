import os
import json
from datetime import datetime, timezone, timedelta

from google.oauth2 import service_account
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest, DateRange, Dimension, Metric, FilterExpression, Filter,
)

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(HERE, "output", "data", "日次データ.json")
SUMMARY_PATH = os.path.join(HERE, "summary.txt")

SITES = [
    {"id": "crater",  "name": "CRATER",  "pid": "353705241"},
    {"id": "acurry",  "name": "A CURRY", "pid": "506973253"},
    {"id": "chics",   "name": "CHICS",   "pid": "259441420"},
    {"id": "years",   "name": "YEARS",   "pid": "431033867"},
    {"id": "apollos", "name": "APOLLOS", "pid": "545852964"},
    {"id": "birth",   "name": "BIRTH",   "pid": "547744931"},
]

WINDOW = "90daysAgo"


def load_credentials():
    raw = os.environ.get("GOOGLE_SA_JSON")
    if raw:
        info = json.loads(raw)
        return service_account.Credentials.from_service_account_info(
            info, scopes=["https://www.googleapis.com/auth/analytics.readonly"]
        )
    key_path = os.path.expanduser("~/.access-dashboard/key.json")
    return service_account.Credentials.from_service_account_file(
        key_path, scopes=["https://www.googleapis.com/auth/analytics.readonly"]
    )


client = BetaAnalyticsDataClient(credentials=load_credentials())


def to_iso(raw_date):
    return f"{raw_date[0:4]}-{raw_date[4:6]}-{raw_date[6:8]}"


def daily_report(pid):
    req = RunReportRequest(
        property=f"properties/{pid}",
        dimensions=[Dimension(name="date")],
        metrics=[Metric(name="sessions"), Metric(name="activeUsers"), Metric(name="screenPageViews")],
        date_ranges=[DateRange(start_date=WINDOW, end_date="today")],
        order_bys=[{"dimension": {"dimension_name": "date"}}],
    )
    res = client.run_report(req)
    daily = []
    for row in res.rows:
        daily.append({
            "date": to_iso(row.dimension_values[0].value),
            "sessions": int(row.metric_values[0].value),
            "users": int(row.metric_values[1].value),
            "pageviews": int(row.metric_values[2].value),
        })
    return daily


def breakdown_report(pid):
    out = {}

    req = RunReportRequest(
        property=f"properties/{pid}",
        dimensions=[Dimension(name="pagePath")],
        metrics=[Metric(name="screenPageViews")],
        date_ranges=[DateRange(start_date=WINDOW, end_date="today")],
        order_bys=[{"metric": {"metric_name": "screenPageViews"}, "desc": True}],
        limit=8,
    )
    res = client.run_report(req)
    top_paths = [r.dimension_values[0].value for r in res.rows]

    pages_daily = []
    if top_paths:
        req = RunReportRequest(
            property=f"properties/{pid}",
            dimensions=[Dimension(name="date"), Dimension(name="pagePath")],
            metrics=[Metric(name="screenPageViews")],
            date_ranges=[DateRange(start_date=WINDOW, end_date="today")],
            dimension_filter=FilterExpression(
                filter=Filter(field_name="pagePath", in_list_filter=Filter.InListFilter(values=top_paths))
            ),
            limit=100000,
        )
        res = client.run_report(req)
        for r in res.rows:
            pages_daily.append({
                "date": to_iso(r.dimension_values[0].value),
                "path": r.dimension_values[1].value,
                "pageviews": int(r.metric_values[0].value),
            })
    out["pages"] = pages_daily

    req = RunReportRequest(
        property=f"properties/{pid}",
        dimensions=[Dimension(name="date"), Dimension(name="sessionDefaultChannelGroup")],
        metrics=[Metric(name="sessions")],
        date_ranges=[DateRange(start_date=WINDOW, end_date="today")],
        limit=100000,
    )
    res = client.run_report(req)
    out["sources"] = [{
        "date": to_iso(r.dimension_values[0].value),
        "channel": r.dimension_values[1].value,
        "sessions": int(r.metric_values[0].value),
    } for r in res.rows]

    req = RunReportRequest(
        property=f"properties/{pid}",
        dimensions=[Dimension(name="date"), Dimension(name="deviceCategory")],
        metrics=[Metric(name="sessions")],
        date_ranges=[DateRange(start_date=WINDOW, end_date="today")],
        limit=100000,
    )
    res = client.run_report(req)
    out["devices"] = [{
        "date": to_iso(r.dimension_values[0].value),
        "category": r.dimension_values[1].value,
        "sessions": int(r.metric_values[0].value),
    } for r in res.rows]

    return out


def main():
    # 既存JSONがあれば insight/suggestion/comment/history を引き継ぐ(無ければ空で開始)
    prev = {}
    if os.path.exists(OUT_PATH):
        with open(OUT_PATH, encoding="utf-8") as f:
            prev = json.load(f)
    prev_history = prev.get("history", [])
    prev_comments = {s["id"]: s.get("comment", "") for s in prev.get("sites", [])}

    sites_out = []
    summary_lines = []

    for s in SITES:
        daily = daily_report(s["pid"])
        bd = breakdown_report(s["pid"])

        last7 = daily[-7:] if len(daily) >= 7 else daily
        prev7 = daily[-14:-7] if len(daily) >= 14 else []
        sessions_7d = sum(d["sessions"] for d in last7)
        sessions_prev7d = sum(d["sessions"] for d in prev7)
        delta_pct = None
        if sessions_prev7d > 0:
            delta_pct = round((sessions_7d - sessions_prev7d) / sessions_prev7d * 100)

        sites_out.append({
            "id": s["id"],
            "name": s["name"],
            "ga4_property_id": s["pid"],
            "comment": prev_comments.get(s["id"], ""),
            "daily": daily,
            "breakdown": bd,
        })

        delta_txt = f"前週比{delta_pct:+d}%" if delta_pct is not None else "比較データなし（計測開始間もない）"
        summary_lines.append(f"- {s['name']}: 直近7日sessions={sessions_7d}（{delta_txt}）")

    now = datetime.now(timezone(timedelta(hours=9))).strftime("%Y-%m-%dT%H:%M:%S+09:00")

    data = {
        "is_sample": False,
        "updated_at": now,
        "insight": prev.get("insight", ""),
        "suggestion": prev.get("suggestion", ""),
        "sites": sites_out,
        "history": prev_history,
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    with open(SUMMARY_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(summary_lines))

    print("\n".join(summary_lines))
    print("書き出し完了:", OUT_PATH)


if __name__ == "__main__":
    main()
