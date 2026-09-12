#!/usr/bin/env python3
"""WordPress記事のタイトル・meta descriptionを確認・変更する（SEO順位ウォッチ用）。

対応サイトと、触ってよいページの種類は下の「サイト設定」で決めている。
トップページ・固定ページ（会社概要・お問い合わせ等）は、どのサイトでも対象外。

認証情報（WordPressのアプリケーションパスワード）は、上から順に探す:
  1. 環境変数 WP_KEYS_JSON（GitHub Actions用）
       {"years": {"user": "ログイン名", "app_password": "xxxx xxxx ..."}, "apollos": {...}}
  2. 環境変数 WP_APP_PASSWORD（chics.top専用。以前からのGitHub Actions設定）
  3. ~/.<鍵の名前>-wp/credentials.json（このMac用・Git管理外・chmod 600）
       {"site": "https://...", "user": "ログイン名", "app_password": "xxxx xxxx ..."}

使い方:
  python3 wp.py --site years.design --url https://years.design/info/616/   現在の内容を表示（確認用）
  python3 wp.py --site years.design --url <URL> --title "新しいタイトル"    記事タイトルを変更
  python3 wp.py --site years.design --url <URL> --desc "新しい説明文"      meta descriptionを変更
  python3 wp.py --id 1581 --title "新しいタイトル"                         --site 省略時は chics.top
"""
import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

# サイトごとの設定
#   鍵               … 認証情報の名前（WP_KEYS_JSON のキー / ~/.<鍵>-wp/credentials.json）
#   触ってよい種類    … 変更してよい投稿タイプ（REST APIでの名前）。それ以外のページは表示だけ
#   説明文を変えられる … meta description（Yoastの _yoast_wpseo_metadesc）をREST APIで書き換えられるか
#   自動で変えてよい  … False のサイトは、承認を得て --approved を付けたときだけ変更できる
サイト設定 = {
    "chics.top": {
        "url": "https://chics.top", "鍵": "chics", "触ってよい種類": ["news"],
        "説明文を変えられる": False,   # Yoastの項目がREST APIに出ていない
        "自動で変えてよい": True,
    },
    "years.design": {
        "url": "https://years.design", "鍵": "years", "触ってよい種類": ["posts"],
        "説明文を変えられる": True,
        "自動で変えてよい": True,
    },
    "apollos.jp": {
        "url": "https://apollos.jp", "鍵": "apollos", "触ってよい種類": ["posts"],
        # テーマとYoastがdescriptionを二重に出していたのを、2026-09-12にテーマ側で修正した。
        # 重複が残っているページは、下の「説明文タグの数」で止まる
        "説明文を変えられる": True,
        "自動で変えてよい": True,
    },
    "crater.co.jp": {
        "url": "https://crater.co.jp", "鍵": "crater", "触ってよい種類": ["works"],
        "説明文を変えられる": False,   # Yoastの項目がREST APIに出ていない
        # 実績（works）のタイトルは、実績一覧と詳細ページに「作品名」としてそのまま表示される。
        # 検索向けに書き換えると作品名まで変わるので、自動では変えない（提案→承認後に反映）
        "自動で変えてよい": False,
    },
}


class APIエラー(Exception):
    def __init__(self, コード, 中身):
        super().__init__(f"HTTP {コード}")
        self.コード, self.中身 = コード, 中身


def 認証情報を探す(サイト):
    """認証情報を返す。見つからなければ None。"""
    設定 = サイト設定[サイト]
    鍵 = 設定["鍵"]

    まとめ = os.environ.get("WP_KEYS_JSON")
    if まとめ:
        try:
            中身 = json.loads(まとめ).get(鍵)
        except (ValueError, AttributeError):
            中身 = None
        if 中身 and 中身.get("app_password"):
            return {"site": 設定["url"], "user": 中身["user"], "app_password": 中身["app_password"]}

    if サイト == "chics.top" and os.environ.get("WP_APP_PASSWORD"):
        return {
            "site": os.environ.get("WP_SITE", 設定["url"]),
            "user": os.environ.get("WP_USER", "chics"),
            "app_password": os.environ["WP_APP_PASSWORD"],
        }

    ファイル = os.path.expanduser(f"~/.{鍵}-wp/credentials.json")
    if os.path.exists(ファイル):
        with open(ファイル, encoding="utf-8") as f:
            中身 = json.load(f)
        return {"site": 設定["url"], "user": 中身["user"], "app_password": 中身["app_password"]}
    return None


def URL候補(サイト, パス, パラメータ=None):
    """REST APIのURLを2形式で返す。

    chics.topのWAFは環境によって /wp-json/ へのアクセスを403で弾く
    （GitHub ActionsのIPからは弾かれ、社内からは通る）。
    弾かれた場合に備えて、クエリ形式（?rest_route=）も候補として持つ。
    """
    サイト = サイト.rstrip("/")
    q = ("&" if パラメータ else "") + urllib.parse.urlencode(パラメータ or {})
    綺麗 = f"{サイト}/wp-json{パス}" + (f"?{q[1:]}" if パラメータ else "")
    クエリ = f"{サイト}/?rest_route={urllib.parse.quote(パス)}{q}"
    return [綺麗, クエリ]


def 叩く(サイト, パス, 認証, データ=None, パラメータ=None):
    """REST APIを呼ぶ。WAFに403で弾かれたら、もう一方のURL形式で再試行する。"""
    合言葉 = f"{認証['user']}:{認証['app_password']}"
    頭 = "Basic " + base64.b64encode(合言葉.encode()).decode()
    最後のエラー = None

    for url in URL候補(サイト, パス, パラメータ):
        req = urllib.request.Request(url, method="POST" if データ else "GET")
        req.add_header("Authorization", 頭)
        req.add_header("Content-Type", "application/json")
        req.add_header("User-Agent", "CRATER-SEO-Watch/1.0")
        body = json.dumps(データ).encode() if データ else None
        try:
            with urllib.request.urlopen(req, body, timeout=30) as res:
                return json.loads(res.read().decode())
        except urllib.error.HTTPError as e:
            中身 = e.read().decode(errors="replace")
            最後のエラー = APIエラー(e.code, 中身)
            # WAFのエラーページ（HTML）で403なら、次のURL形式を試す。
            # WordPress自身の403（JSON・権限不足）は形式を変えても同じなので試さない
            if e.code == 403 and not 中身.lstrip().startswith("{"):
                continue
            break
    raise 最後のエラー


def エラーを伝えて終わる(e):
    try:
        wpの説明 = json.loads(e.中身).get("message", "")
    except (ValueError, AttributeError):
        wpの説明 = ""
    if e.コード == 401:
        print("認証に失敗しました。ログイン名かアプリケーションパスワードが違います。")
    elif e.コード == 403 and wpの説明:
        print(f"権限がないため拒否されました（WordPressの返答: {wpの説明}）")
    elif e.コード == 403:
        print("403で拒否されました。2種類のURL形式を試しましたが、どちらもサーバ側で弾かれています。")
    else:
        print(f"エラー HTTP {e.コード}: {wpの説明 or e.中身[:300]}")
    sys.exit(1)


def 記事を特定する(url):
    """記事ページのURLから（投稿タイプ, 記事ID）を調べる。

    WordPressは記事ページのHTMLに
      <link rel="alternate" type="application/json" href=".../wp-json/wp/v2/<種類>/<ID>">
    を出しているので、それを読む。無ければbodyのclass（postid-123）から拾う。
    """
    url = urllib.parse.quote(url, safe=":/?&=%#+~")   # 日本語URLもそのまま渡せるように
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (CRATER-SEO-Watch)"})
    with urllib.request.urlopen(req, timeout=30) as res:
        html = res.read().decode(errors="replace")
    for タグ in re.findall(r"<link[^>]+>", html):
        if "application/json" in タグ:
            m = re.search(r"/wp/v2/([\w-]+)/(\d+)", タグ)
            if m:
                return m.group(1), int(m.group(2))
    m = re.search(r"\bpostid-(\d+)", html)
    if m:
        return None, int(m.group(1))   # 種類はあとでREST APIに聞く
    m = re.search(r"\bpage-id-(\d+)", html)
    if m:
        return "pages", int(m.group(1))
    return None, None


def 説明文タグの数(url):
    """公開ページに <meta name="description"> がいくつ出ているかを数える。

    テーマとSEOプラグインの両方が出していると2つ並び、どちらが検索結果に使われるか分からない。
    その状態でdescriptionを変えても効果が読めないので、変更前に確かめる。
    """
    url = urllib.parse.quote(url, safe=":/?&=%#+~")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (CRATER-SEO-Watch)"})
    with urllib.request.urlopen(req, timeout=30) as res:
        html = res.read().decode(errors="replace")
    head = html.split("</head>")[0]
    return len(re.findall(r"""<meta[^>]+name=["']description["']""", head))


def 種類を探す(サイト, 認証, 記事ID):
    """記事IDから投稿タイプを調べる（触ってよい種類の中から順に試す）。"""
    設定 = サイト設定[サイト]
    for 種類 in 設定["触ってよい種類"]:
        try:
            叩く(設定["url"], f"/wp/v2/{種類}/{記事ID}", 認証, パラメータ={"_fields": "id"})
            return 種類
        except APIエラー as e:
            if e.コード != 404:
                raise
    return None


def main():
    p = argparse.ArgumentParser(description="WordPress記事のタイトル・meta descriptionを確認・変更する")
    p.add_argument("--site", default="chics.top", choices=list(サイト設定), help="対象サイト（省略時は chics.top）")
    どれ = p.add_mutually_exclusive_group(required=True)
    どれ.add_argument("--url", help="記事のURL")
    どれ.add_argument("--id", type=int, help="記事ID")
    何を = p.add_mutually_exclusive_group()   # 1回に変えるのは1か所だけ
    何を.add_argument("--title", help="新しい記事タイトル")
    何を.add_argument("--desc", help="新しいmeta description")
    p.add_argument("--approved", action="store_true", help="自動では変えない設定のサイトを、承認を得て変更するとき")
    args = p.parse_args()

    設定 = サイト設定[args.site]
    認証 = 認証情報を探す(args.site)
    if not 認証:
        print(f"{args.site} の認証情報がありません。WordPressのアプリケーションパスワードを登録してください。")
        sys.exit(1)

    try:
        if args.url:
            ドメイン = urllib.parse.urlparse(args.url).netloc.removeprefix("www.")
            if ドメイン != args.site:
                print(f"URL（{ドメイン}）と --site（{args.site}）が一致しません。")
                sys.exit(1)
            種類, 記事ID = 記事を特定する(args.url)
            if 記事ID is None:
                print("このURLからは記事を特定できませんでした（トップページや一覧ページの可能性）。対象外です。")
                sys.exit(2)
        else:
            種類, 記事ID = None, args.id
        if 種類 is None:
            種類 = 種類を探す(args.site, 認証, 記事ID)
        if 種類 not in 設定["触ってよい種類"]:
            print(f"このページ（種類: {種類 or '不明'}）は対象外です。"
                  f"{args.site} で触ってよいのは「{'・'.join(設定['触ってよい種類'])}」の記事だけです。")
            sys.exit(2)

        パス = f"/wp/v2/{種類}/{記事ID}"
        今 = 叩く(設定["url"], パス, 認証, パラメータ={"context": "edit", "_fields": "id,link,title,meta"})
        meta = 今["meta"] if isinstance(今.get("meta"), dict) else {}
        print(f"記事ID  : {記事ID}（{種類}）")
        print(f"URL     : {今['link']}")
        print(f"タイトル: {今['title']['raw']}")
        if "_yoast_wpseo_metadesc" in meta:
            print(f"説明文  : {meta['_yoast_wpseo_metadesc'] or '（未設定。Yoastが本文から自動で作る）'}")

        if args.title is None and args.desc is None:
            return
        if args.title is not None and not args.title.strip():
            print("空のタイトルにはできません。")
            sys.exit(1)
        if not 設定["自動で変えてよい"] and not args.approved:
            print(f"{args.site} は自動では変更しない設定です（改善案を提案し、承認後に反映する）。")
            sys.exit(2)
        if args.desc is not None and not 設定["説明文を変えられる"]:
            print(f"{args.site} ではmeta descriptionを変更できません。タイトルで対応してください。")
            sys.exit(2)
        if args.desc is not None:
            数 = 説明文タグの数(今["link"])
            if 数 > 1:
                print(f"このページにはmeta descriptionが{数}つ出ています（テーマとSEOプラグインの重複など）。"
                      "直るまでは変えても効果が読めないため、変更しません。タイトルで対応してください。")
                sys.exit(2)
        if args.title is not None and meta.get("_yoast_wpseo_title"):
            # Yoastで検索用タイトルが個別に決められている記事は、記事タイトルを変えても検索結果に出ない
            print(f"この記事はYoastの検索用タイトルが個別に設定されています（{meta['_yoast_wpseo_title']}）。"
                  "記事タイトルを変えても検索結果は変わらないため、変更しません。")
            sys.exit(2)

        if args.title is not None:
            後 = 叩く(設定["url"], パス, 認証, データ={"title": args.title})
            print(f"変更後タイトル: {後['title'].get('raw', 後['title']['rendered'])}")
        else:
            後 = 叩く(設定["url"], パス, 認証, データ={"meta": {"_yoast_wpseo_metadesc": args.desc}})
            print(f"変更後の説明文: {(後.get('meta') or {}).get('_yoast_wpseo_metadesc')}")
        print("→ 更新しました。")
    except APIエラー as e:
        エラーを伝えて終わる(e)
    except urllib.error.URLError as e:
        print(f"ページを取得できませんでした: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
