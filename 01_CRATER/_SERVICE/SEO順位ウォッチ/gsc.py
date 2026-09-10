#!/usr/bin/env python3
"""Search Consoleから検索クエリ別の順位・表示回数・クリック数を取得する。

使い方:
  python3 gsc.py --list                       登録されているプロパティ一覧
  python3 gsc.py --site chics.top             直近28日の上位クエリ
  python3 gsc.py --site chics.top --days 14   期間を指定
  python3 gsc.py --site chics.top --append    順位履歴.json に追記して保存
"""
import argparse
import datetime
import json
import os
import sys
import warnings

warnings.simplefilter("ignore", FutureWarning)

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# 鍵ファイル（アクセス解析ダッシュボードと共用・Git管理対象外）
鍵ファイル = os.path.expanduser("~/.access-dashboard/key.json")
データ置き場 = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
順位履歴ファイル = os.path.join(データ置き場, "順位履歴.json")

# Search Consoleのデータは2〜3日遅れて確定するため、直近3日は集計に含めない
反映待ち日数 = 3


def 接続する():
    """サービスアカウントでSearch Console APIに接続する。

    GitHub Actions上では鍵ファイルが無いため、環境変数 GOOGLE_SA_JSON を優先して読む。
    """
    権限 = ["https://www.googleapis.com/auth/webmasters.readonly"]
    生JSON = os.environ.get("GOOGLE_SA_JSON")
    if 生JSON:
        creds = service_account.Credentials.from_service_account_info(
            json.loads(生JSON), scopes=権限
        )
    else:
        creds = service_account.Credentials.from_service_account_file(鍵ファイル, scopes=権限)
    return build("searchconsole", "v1", credentials=creds, cache_discovery=False)


def プロパティを探す(svc, サイト):
    """指定したドメインに一致するSearch Consoleプロパティを返す。"""
    一覧 = svc.sites().list().execute().get("siteEntry", [])
    if not サイト:
        return None, 一覧
    候補 = [s["siteUrl"] for s in 一覧 if サイト in s["siteUrl"]]
    if not 候補:
        return None, 一覧
    # sc-domain:（ドメインプロパティ）を優先する。サブドメインもまとめて拾えるため
    候補.sort(key=lambda u: (not u.startswith("sc-domain:"), len(u)))
    return 候補[0], 一覧


def 期間を決める(日数):
    終わり = datetime.date.today() - datetime.timedelta(days=反映待ち日数)
    始まり = 終わり - datetime.timedelta(days=日数 - 1)
    return 始まり.isoformat(), 終わり.isoformat()


def クエリを取得する(svc, プロパティ, 始まり, 終わり, 件数=250):
    """クエリ×ページ単位で検索パフォーマンスを取得する。"""
    body = {
        "startDate": 始まり,
        "endDate": 終わり,
        "dimensions": ["query", "page"],
        "rowLimit": 件数,
        "dataState": "final",
    }
    res = svc.searchanalytics().query(siteUrl=プロパティ, body=body).execute()
    行 = []
    for r in res.get("rows", []):
        キーワード, ページ = r["keys"]
        行.append({
            "キーワード": キーワード,
            "ページ": ページ,
            "順位": round(r["position"], 1),
            "表示回数": r["impressions"],
            "クリック数": r["clicks"],
            "CTR": round(r["ctr"] * 100, 2),
        })
    return 行


def 履歴に追記する(サイト, 始まり, 終わり, 行):
    """順位履歴.jsonに1回分の測定結果を追記する。過去のデータは書き換えない。"""
    os.makedirs(データ置き場, exist_ok=True)
    if os.path.exists(順位履歴ファイル):
        with open(順位履歴ファイル, encoding="utf-8") as f:
            履歴 = json.load(f)
    else:
        履歴 = {"測定": []}

    履歴["測定"].append({
        "測定日": datetime.date.today().isoformat(),
        "サイト": サイト,
        "集計期間": {"開始": 始まり, "終了": 終わり},
        "結果": 行,
    })
    with open(順位履歴ファイル, "w", encoding="utf-8") as f:
        json.dump(履歴, f, ensure_ascii=False, indent=2)
    return 順位履歴ファイル


def 表で出す(行, 上限=40):
    print(f"{'順位':>6}  {'表示':>7}  {'クリック':>7}  キーワード")
    print("-" * 78)
    for r in 行[:上限]:
        print(f"{r['順位']:>6}  {r['表示回数']:>7}  {r['クリック数']:>7}  {r['キーワード']}")


def わかりやすく伝える(e):
    """APIエラーを日本語の対処法に翻訳する。"""
    中身 = str(e)
    if "has not been used in project" in 中身 or "accessNotConfigured" in 中身:
        print("Search Console APIがまだ有効化されていません。")
        print("下のページで「有効にする」を押してから、数分待って再実行してください。")
        print()
        print("https://console.cloud.google.com/apis/library/searchconsole.googleapis.com?project=crater-dashboard")
    elif "403" in 中身 or "does not have sufficient permission" in 中身:
        print("プロパティへのアクセス権がありません。")
        print("Search Consoleの「設定 → ユーザーと権限」で下記を追加してください（権限は制限付きでOK）。")
        print()
        print("  analytics-reader@crater-dashboard.iam.gserviceaccount.com")
    else:
        print("APIエラーが発生しました:")
        print(中身)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--site", help="対象サイト（例: chics.top）")
    p.add_argument("--days", type=int, default=28, help="集計日数（既定28日）")
    p.add_argument("--append", action="store_true", help="順位履歴.jsonに追記する")
    p.add_argument("--list", action="store_true", help="プロパティ一覧を表示する")
    args = p.parse_args()

    try:
        svc = 接続する()
        走る(svc, args)
    except HttpError as e:
        わかりやすく伝える(e)
        sys.exit(1)


def 走る(svc, args):
    if args.list or not args.site:
        _, 一覧 = プロパティを探す(svc, None)
        if not 一覧:
            print("このサービスアカウントに権限のあるプロパティがありません。")
            print("Search Console側でユーザー追加が済んでいるか確認してください。")
            return
        print("参照できるプロパティ:")
        for s in 一覧:
            print(f"  {s['siteUrl']}  ({s['permissionLevel']})")
        return

    プロパティ, 一覧 = プロパティを探す(svc, args.site)
    if not プロパティ:
        print(f"'{args.site}' に一致するプロパティが見つかりません。")
        print("参照できるのは以下です:")
        for s in 一覧:
            print(f"  {s['siteUrl']}")
        sys.exit(1)

    始まり, 終わり = 期間を決める(args.days)
    行 = クエリを取得する(svc, プロパティ, 始まり, 終わり)
    行.sort(key=lambda r: (-r["表示回数"], r["順位"]))

    print(f"■ {プロパティ}  {始まり} 〜 {終わり}（{args.days}日）  {len(行)}件")
    print()
    表で出す(行)

    if args.append:
        場所 = 履歴に追記する(args.site, 始まり, 終わり, 行)
        print(f"\n→ 追記しました: {場所}")


if __name__ == "__main__":
    main()
