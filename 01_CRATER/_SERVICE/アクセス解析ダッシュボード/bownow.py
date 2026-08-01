import os
import json
import time
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(HERE, "output", "data", "日次データ.json")

API_BASE = "https://api.bownow.jp/v1"
PER_PAGE = 200
DAILY_SCAN_PAGES = 5     # 通常運用：直近1000件(約11日分)。1日の増分を拾えれば十分
BACKFILL_SCAN_PAGES = 45  # 初回のみ：直近9000件(約100日分)まで遡って発掘

SITES_COVERED = ["crater", "chics", "years", "apollos"]


def load_credentials():
    tracking_id = os.environ.get("BOWNOW_TRACKING_ID")
    api_key = os.environ.get("BOWNOW_API_KEY")
    if tracking_id and api_key:
        return tracking_id, api_key
    cred_path = os.path.expanduser("~/.access-dashboard/bownow.json")
    with open(cred_path, encoding="utf-8") as f:
        cred = json.load(f)
    return cred["tracking_id"], cred["api_key"]


def call(method, path, tracking_id, headers_extra=None, body=None):
    url = f"{API_BASE}{path}"
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Tracking-ID", tracking_id)
    req.add_header("Content-Type", "application/json")
    for k, v in (headers_extra or {}).items():
        req.add_header(k, v)
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.loads(res.read().decode("utf-8"))


def get_token(tracking_id, api_key):
    res = call("POST", "/auth/token", tracking_id, body={"api_key": api_key})
    return res["access_token"], res["client_token"]


def fetch_recent_leads(tracking_id, headers, pages):
    leads = []
    for page in range(1, pages + 1):
        res = call(
            "POST", "/leads/search", tracking_id,
            headers_extra=headers,
            body={"page": page, "per_page": PER_PAGE, "sort": "desc"},
        )
        page_leads = res.get("leads", [])
        leads.extend(page_leads)
        if len(page_leads) < PER_PAGE:
            break
        time.sleep(0.3)
    return leads


def fetch_corporate(tracking_id, headers, cid):
    res = call("GET", f"/corporates/{cid}", tracking_id, headers_extra=headers)
    return res.get("corporate")


def main():
    tracking_id, api_key = load_credentials()
    access_token, client_token = get_token(tracking_id, api_key)
    headers = {"Client-Token": client_token, "Authorization": f"Bearer {access_token}"}

    # 既存の蓄積データを読み込む(cidをキーに保持。無ければ初回=深掘りバックフィル)
    with open(OUT_PATH, encoding="utf-8") as f:
        data = json.load(f)
    prev_companies = {
        c["cid"]: c for c in data.get("bownow", {}).get("companies", []) if c.get("cid")
    }

    pages = DAILY_SCAN_PAGES if prev_companies else BACKFILL_SCAN_PAGES
    leads = fetch_recent_leads(tracking_id, headers, pages)

    # 企業(cid)ごとに、今回のスキャン内で一番新しい訪問日時だけ残す
    latest_by_cid = {}
    for l in leads:
        cid = l.get("cid")
        if not cid:
            continue
        created = l.get("created_at", "")
        if cid not in latest_by_cid or created > latest_by_cid[cid]:
            latest_by_cid[cid] = created

    # 今回新たに見つかった/再訪問があった企業だけ詳細を取り直す(既知で今回動きが無い企業はそのまま保持)
    for cid, last_visit in latest_by_cid.items():
        try:
            corp = fetch_corporate(tracking_id, headers, cid)
        except urllib.error.HTTPError:
            continue
        if not corp or not corp.get("name"):
            continue
        info = corp.get("leads_info", {})
        prev_companies[cid] = {
            "cid": cid,
            "name": corp.get("name"),
            "pref_name": corp.get("pref_name"),
            "city_name": corp.get("city_name"),
            "session_count": info.get("session_count", 0),
            "uu_count": info.get("uu_count", 0),
            "last_visit_at": last_visit,
        }
        time.sleep(0.2)

    companies = sorted(prev_companies.values(), key=lambda c: c["last_visit_at"], reverse=True)

    now = datetime.now(timezone(timedelta(hours=9))).strftime("%Y-%m-%dT%H:%M:%S+09:00")

    data["bownow"] = {
        "updated_at": now,
        "sites_covered": SITES_COVERED,
        "note": "BowNowは4サイト(CRATER/CHICS/YEARS/APOLLOS)共通の1トラッキングコードのため、サイト別の内訳は取得できません。IPアドレスから識別できた企業を日々蓄積して一覧表示しています（識別できるのは全訪問のうち一部）。",
        "scanned_leads_this_run": len(leads),
        "companies_total": len(companies),
        "companies": companies,
    }

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"今回スキャンしたリード数: {len(leads)}（{pages}ページ）")
    print(f"累計の企業識別数: {len(companies)}")
    print("書き出し完了:", OUT_PATH)


if __name__ == "__main__":
    main()
