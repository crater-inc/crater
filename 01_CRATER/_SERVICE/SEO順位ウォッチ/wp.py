#!/usr/bin/env python3
"""chics.topのWordPress記事を更新する（タイトル等）。

認証情報は ~/.chics-wp/credentials.json に置く（Git管理対象外・chmod 600）。
  {"site": "https://chics.top", "user": "ログイン名", "app_password": "xxxx xxxx ..."}

使い方:
  python3 wp.py --id 1581                        現在のタイトルを表示（確認用）
  python3 wp.py --id 1581 --title "新しいタイトル"  タイトルを変更
"""
import argparse
import base64
import json
import os
import sys
import urllib.request
import urllib.error

認証ファイル = os.path.expanduser("~/.chics-wp/credentials.json")
投稿タイプ = "news"


def 認証情報を読む():
    """認証情報を返す。GitHub Actions上では環境変数を優先する。"""
    if os.environ.get("WP_APP_PASSWORD"):
        return {
            "site": os.environ.get("WP_SITE", "https://chics.top"),
            "user": os.environ.get("WP_USER", "chics"),
            "app_password": os.environ["WP_APP_PASSWORD"],
        }
    if not os.path.exists(認証ファイル):
        print(f"認証情報がありません: {認証ファイル}")
        print("WordPressのアプリケーションパスワードを登録してください。")
        sys.exit(1)
    with open(認証ファイル, encoding="utf-8") as f:
        return json.load(f)


def 叩く(url, 認証, データ=None):
    req = urllib.request.Request(url, method="POST" if データ else "GET")
    合言葉 = f"{認証['user']}:{認証['app_password']}"
    req.add_header("Authorization", "Basic " + base64.b64encode(合言葉.encode()).decode())
    req.add_header("Content-Type", "application/json")
    body = json.dumps(データ).encode() if データ else None
    try:
        with urllib.request.urlopen(req, body, timeout=30) as res:
            return json.loads(res.read().decode())
    except urllib.error.HTTPError as e:
        中身 = e.read().decode()
        if e.code in (401, 403):
            print("認証に失敗しました。ログイン名かアプリケーションパスワードが違います。")
        else:
            print(f"エラー HTTP {e.code}: {中身[:300]}")
        sys.exit(1)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--id", type=int, required=True, help="記事ID")
    p.add_argument("--title", help="新しいタイトル（省略すると現在の内容を表示するだけ）")
    args = p.parse_args()

    認証 = 認証情報を読む()
    url = f"{認証['site'].rstrip('/')}/wp-json/wp/v2/{投稿タイプ}/{args.id}"

    今 = 叩く(url + "?_fields=id,link,title", 認証)
    print(f"変更前: {今['title']['rendered']}")
    print(f"URL   : {今['link']}")

    if not args.title:
        return

    後 = 叩く(url, 認証, {"title": args.title})
    print(f"変更後: {後['title']['rendered']}")
    print("→ 更新しました。")


if __name__ == "__main__":
    main()
