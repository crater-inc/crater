# -*- coding: utf-8 -*-
"""
SEOキーワード自動抽出エンジン（クレーター / APOLLOS）
- ラッコキーワードAPIで各サイトの関連キーワード＋検索ボリューム＋SEO難易度を取得
- ルール（2026-07-13確定）: 1サイト8個/回・ボリューム100以上・重複除去・誤解属性NG・幅広く・定番/トレンド区分・C=クロコ発案
- Googleスプレッドシートにサイト別タブへ日付つきで追記
仕様書: docs/superpowers/specs/2026-07-13-SEOキーワード自動抽出システム-design.md
"""
import json, re, time, datetime, os, tempfile, urllib.request, pathlib

# 鍵は環境変数（クラウド/GitHub Actions用）優先、なければローカルファイル（Mac用）
RAKKO_KEY = os.environ.get("RAKKO_KEY") or \
    pathlib.Path("~/.seo-keyword/rakko.txt").expanduser().read_text().strip()

if os.environ.get("GOOGLE_SA_JSON"):
    _tmp = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False)
    _tmp.write(os.environ["GOOGLE_SA_JSON"]); _tmp.close()
    SA_KEY = _tmp.name
else:
    SA_KEY = str(pathlib.Path("~/.seo-keyword/key.json").expanduser())
SHEET_ID  = "1R5ChrlAgXvco7WzKkyP9ZB3Pno-U2XLQ2GMAp0yjcL4"
MCP_URL   = "https://api.rakkokeyword.com/mcp"
MIN_VOLUME = 100     # 検索ボリューム下限
MAX_VOLUME = 10000   # 上限（これ以上はビッグすぎ＝激戦区なので除外）
PER_SITE   = 8       # 1サイト/回の採用数

# 各サイトの設計（種＝切り口／誤解NGワード）。クロコが買い手の行動導線から発案。
SITES = {
    "APOLLOS KW": {
        "seeds": ["認知拡大", "ブランド認知", "知名度 上げる方法", "集客 方法", "SNS 集客", "口コミ 増やす",
                   "広報 とは", "PR会社", "ブランディング会社", "広報 コンサル"],
        # 「広報代行」「PR会社 選び方」等の直球比較検討語はボリューム100未満で採用不可のため
        # 同じ狙い（サービス比較検討層）で実際に検索されている言い回しに置き換え（2026-08-21）
        "ng": ["pixel", "iphone", "スマホ", "安く買う", "格安", "#", "楽天", "amazon",
                "運動家", "mbti", "警視庁", "斎藤知事", "生徒会", "学校"],
    },
    "CHICS KW": {
        "per_run": 30,  # CHICSだけ1回30件（ケイスケ指定 2026-07-17）
        # 切り口を広く分散（法人設立に偏らないよう18種。法人系は1本のみ・キャップで独占防止）
        "seeds": ["ロゴ制作", "会社 ロゴ", "起業 準備", "法人設立", "屋号 決め方",
                   "ロゴ 商標登録", "名刺 デザイン", "会社名 決め方", "ブランディング とは", "開業届",
                   "ロゴ 意味", "フリーランス 名刺", "独立 開業", "起業 女性",
                   "会社設立 お祝い", "ショップカード", "看板 デザイン", "肩書き 一覧",
                   "起業 補助金", "創業 補助金", "退職届", "退職 起業"],
        # 他社ロゴ画像が必要になる「一覧・事例・有名企業ロゴ」系は画像集めが大変なので除外（テキストの◯選はOK）
        "ng": ["フリー素材", "無料 ダウンロード", "作り方 illustrator",
                "ロゴ一覧", "有名企業 ロゴ", "企業ロゴ 一覧", "ロゴ 事例", "ロゴ集", "有名 ロゴ", "かっこいいロゴ",
                "toha", "スタバ", "スターバックス", "ナイキ", "アディダス", "アップル", "マクドナルド", "結婚"],
    },
    "YEARS KW": {
        # 周年の主体を広く（企業だけでなく神社/スポーツ/ブランド/商品/アーティスト/イベント）
        "seeds": ["周年ロゴ", "周年記念 ロゴ", "会社 周年", "周年 デザイン", "社史", "記念品 会社",
                   "神社 周年", "スポーツチーム 周年", "ブランド 周年", "商品 周年",
                   "アーティスト 周年", "イベント 周年"],
        # 他人のIP・消費者向け・別ジャンルの「記念」を除外
        "ng": ["ポケモン", "アイナナ", "有馬記念", "日本大学", "文理学部", "記念館", "卒業",
                 "声優", "アニメ", "ゲーム", "アイドル", "ライブ", "推し", "写真", "google", "任天堂",
                 "ロゴ一覧", "有名 ロゴ", "ロゴ 事例", "ロゴ集",
                 "ミセス", "green apple", "ジャニーズ", "スヌーピー", "サンリオ", "ディズニー", "阪神", "巨人"],
    },
    "A CURRY KW": {
        # 商品の食材まわりの知識・雑学まで広げる（レシピに縛らない）。柚子胡椒/牡蠣/肉じゃが。レトルトカレー直球は下げる
        "seeds": ["柚子胡椒 とは", "柚子胡椒 産地", "柚子胡椒 辛い",
                   "牡蠣 栄養", "牡蠣 旨味", "肉じゃが 由来"],
        "ng": ["無添加", "葉山牛", "無印", "業務スーパー", "カルディ", "ファミマ", "セブン"],
    },
    "BIRTH KW": {
        "seeds": ["新規事業", "事業 多角化", "第二の柱", "中小企業 新規事業",
                   "新規事業 アイデア", "自社製品 作りたい"],
        # 補助金の事後事務（受給済みの人＝客でない）を除外
        "ng": ["状況報告", "交付申請", "実績報告", "返還", "不正"],
    },
}


def rakko(tool, args):
    """ラッコMCPをHTTP(JSON-RPC/SSE)で呼ぶ"""
    body = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/call",
                       "params": {"name": tool, "arguments": args}}).encode()
    req = urllib.request.Request(MCP_URL, data=body, headers={
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "X-API-Key": RAKKO_KEY,
    })
    raw = urllib.request.urlopen(req, timeout=90).read().decode()
    for line in raw.splitlines():
        if line.startswith("data: "):
            d = json.loads(line[6:])
            return json.loads(d["result"]["content"][0]["text"])
    raise RuntimeError("no data: " + raw[:200])


def norm(s):
    """重複判定用の正規化（空白除去・小文字化）"""
    return re.sub(r"\s+", "", s).lower()


# ラッコのサジェストは助詞もスペース区切りで返るため、単独の助詞トークンを除去して
# 「東京 ロゴ デザイン」のような単語だけの形に整える（ケイスケさんの表記に合わせる）
PARTICLES = {"の", "を", "が", "は", "に", "で", "と", "も", "へ", "や", "か", "な", "ね", "し",
             "て", "た", "ら", "り", "ながら", "もらい", "という", "する", "こと"}

def clean_kw(kw):
    toks = re.split(r"[\s　]+", kw.strip())
    toks = [t for t in toks if t and t not in PARTICLES]
    return " ".join(toks)


def collect_candidates(seeds, ng, seen):
    """種ごとにGoogleサジェスト（スペース入り・生の検索語）を取り、
    ボリューム100以上・誤解NG除外・重複除去した候補を集める。
    スペース有り/無しの重複はスペース有りを優先して残す。"""
    by_seed = []
    for seed in seeds:
        try:
            j = rakko("suggest-keywords", {"keyword": seed, "modes": ["google"],
                                            "increaseKeyword": True, "sortBy": "searchVolume",
                                            "orderBy": "desc",
                                            "filter": {"searchVolume": {"min": MIN_VOLUME}}, "limit": 40})
        except Exception as e:
            print("  ! seed失敗", seed, e); by_seed.append([]); continue
        picked = {}  # norm -> item
        for it in j.get("data", {}).get("items", []):
            kw = clean_kw(it["keyword"]); m = it.get("metrics", {})
            vol = m.get("searchVolume") or 0; diff = m.get("seoDifficulty")
            n = norm(kw)
            if not kw or vol < MIN_VOLUME or vol >= MAX_VOLUME: continue
            if any(norm(w) in n for w in ng): continue
            if n in seen: continue
            if n in picked: continue
            picked[n] = {"kw": kw, "vol": vol, "diff": diff, "fresh": False, "norm": n}
        by_seed.append(list(picked.values()))
        time.sleep(0.3)
    return by_seed


def score(it):
    """ボリューム大 × 難易度低 のバランス（難易度不明は50扱い）"""
    diff = it["diff"] if it["diff"] is not None else 50
    return it["vol"] * (100 - diff) / 100.0


def pick(by_seed, n=PER_SITE):
    """切り口の幅を保ちつつ、スコア順に各種から拾う（ラウンドロビン）。
    偏り防止：1つの切り口からは均等割＋α までしか採らない（深い井戸の独占を防ぐ）"""
    import math
    cap = max(2, math.ceil(n / max(1, len(by_seed))))  # 例: 8個/10種→2, 30個/10種→3
    for lst in by_seed:
        lst.sort(key=score, reverse=True)
    chosen, used = [], set()
    idx = [0] * len(by_seed)
    taken = [0] * len(by_seed)
    while len(chosen) < n:
        progressed = False
        for i, lst in enumerate(by_seed):
            if len(chosen) >= n: break
            if taken[i] >= cap: continue
            while idx[i] < len(lst) and lst[idx[i]]["norm"] in used:
                idx[i] += 1
            if idx[i] < len(lst):
                it = lst[idx[i]]; idx[i] += 1
                used.add(it["norm"]); chosen.append(it); taken[i] += 1; progressed = True
        if not progressed: break
    return chosen


def main(sites=None, dry=False):
    import gspread
    from google.oauth2.service_account import Credentials
    creds = Credentials.from_service_account_file(SA_KEY, scopes=[
        "https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"])
    gc = gspread.authorize(creds); sh = gc.open_by_key(SHEET_ID)
    today = datetime.date.today().isoformat()

    for tab, cfg in (sites or SITES).items():
        try:
            ws = sh.worksheet(tab)
            existing_vals = ws.get_all_values()[1:]  # ヘッダー除く
            seen = {norm(r[2]) for r in existing_vals if len(r) > 2 and r[2]}
            max_no = max([int(r[0]) for r in existing_vals if r and r[0].isdigit()] or [0])

            cands = collect_candidates(cfg["seeds"], cfg["ng"], seen)
            chosen = pick(cands, n=cfg.get("per_run", PER_SITE))
            if not chosen:
                print(f"[{tab}] 新規KWなし（井戸が枯れ気味／要・切り口追加）"); continue

            rows = []
            for k, it in enumerate(chosen, 1):
                ku = "トレンド" if it["fresh"] else "定番"
                # 列: No./抽出日/キーワード/区分/検索ボリューム/SEO難易度/ステータス/ブログカテゴリ/校正チェック日/アップ日/記事URL/アクセス数
                rows.append([max_no + k, today, it["kw"], ku, it["vol"], it["diff"],
                             "", "", "", "", "", ""])
            print(f"[{tab}] {len(rows)}個採用: " + ", ".join(f"{r[2]}({r[4]})" for r in rows))
            if not dry:
                start = len(existing_vals) + 2
                end = start + len(rows) - 1
                if end > ws.row_count:  # シートの行数上限を超える分は自動で拡張
                    ws.add_rows(end - ws.row_count)
                ws.update(rows, f"A{start}:L{end}", value_input_option="USER_ENTERED")
        except Exception as e:
            # 1サイトの失敗で他サイトの処理まで止まらないようにする
            print(f"[{tab}] エラーでスキップ: {e}")
    print("完了", today)


if __name__ == "__main__":
    import sys
    dry = "--dry" in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    sel = {k: SITES[k] for k in only} if only else None
    main(sel, dry=dry)
