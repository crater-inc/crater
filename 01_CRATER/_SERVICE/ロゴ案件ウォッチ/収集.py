# 収集.py
# ロゴ案件ウォッチ：行政・団体の「ロゴ／VI・ブランディング」の募集を毎日集めて、HTML一覧とLINEに出す。
# 流れ：集める（国のAPI・役所の新着RSS・JDN・公募ナビ）→ タイトルで候補を絞る → 中身を取る
#       → AIで判定・読み取り → data/案件.json に貯める → HTML一覧を作る → 新着をLINEで送る
import json, os, re, io, time, html, hashlib, datetime, subprocess, tempfile, unicodedata
import urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from urllib.parse import urljoin, quote
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
案件JSON = HERE / "data" / "案件.json"
役所RSS = HERE / "data" / "役所RSS.json"
HTML出力 = HERE / "output" / "ロゴ案件一覧.html"
一覧URL = "https://view.crater.co.jp/" + quote("01_CRATER/_SERVICE/ロゴ案件ウォッチ/output/ロゴ案件一覧.html")
JST = datetime.timezone(datetime.timedelta(hours=9))
今 = datetime.datetime.now(JST)
今日 = 今.date()
UA = "Mozilla/5.0 (compatible; CraterLogoWatch/1.0; +https://crater.co.jp/)"
DRY = os.environ.get("DRY_RUN") == "1"           # 1 なら LINE を送らず画面に出すだけ（手元での確認用）
AI上限 = int(os.environ.get("AI_LIMIT", "40"))    # 1回にAIで読む候補の上限（使いすぎ防止）
AIモデル = os.environ.get("AI_MODEL", "sonnet")

# ---------------------------------------------------------------- 絞り込みの言葉
対象語 = re.compile(
    r"ロゴ|シンボルマーク|シンボル・マーク|記念マーク|校章|マーク(の)?(デザイン|募集|制作|作成|公募)"
    r"|ブランディング|ブランド(デザイン|戦略|構築|開発|ロゴ|アイデンティティ|コンセプト)"
    r"|(?<![A-Za-z])(VI|CI)(?![A-Za-z])|ビジュアル・?アイデンティティ|コーポレート・?アイデンティティ")
除外語 = re.compile(
    r"ベンチマーク|マークカード|マタニティマーク|プライバシーマーク|Pマーク|ランドマーク|マークシート|エコマーク"
    r"|ロゴ掲出|使用承認|使用申請|使用許可|決定しました|結果発表|選考結果|審査結果|入賞作品|受賞作品")

JDNのRSS = ["https://compe.japandesign.ne.jp/category/character/feed/",
           "https://compe.japandesign.ne.jp/category/graphic/feed/",
           "https://compe.japandesign.ne.jp/category/idea/feed/"]
公募ナビのRSS = ["https://kobonabi.com/category/logo/feed/", "https://kobonabi.com/feed/"]
国のAPIの言葉 = ["ロゴ", "ロゴマーク", "シンボルマーク", "校章", "ブランディング", "ブランドデザイン", "VI", "CI"]

項目 = ["種類", "分野", "周年", "案件名", "主催", "都道府県", "金額", "金額_円", "募集開始日", "締切",
        "締切の種類", "その他の締切", "応募資格", "応募点数", "同一キー", "ひとこと", "除外理由"]


def n(s):
    return unicodedata.normalize("NFKC", s or "")


# ---------------------------------------------------------------- 取得まわり
def get(url, timeout=20, limit=8_000_000):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "ja"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(limit), r.geturl(), r.headers.get("Content-Type", "")


def decode(b, ctype=""):
    encs = []
    m = re.search(r"charset=([\w-]+)", ctype or "", re.I) or re.search(rb'charset=["\']?([\w-]+)', b[:3000], re.I)
    if m:
        encs.append(m.group(1) if isinstance(m.group(1), str) else m.group(1).decode())
    for enc in encs + ["utf-8", "cp932", "euc-jp"]:
        try:
            return b.decode(enc)
        except (UnicodeDecodeError, LookupError):
            pass
    return b.decode("utf-8", "ignore")


def html_text(t):
    t = re.sub(r"(?is)<(script|style|noscript|header|footer|nav|aside)[^>]*>.*?</\1>", " ", t)
    m = re.search(r"(?is)<main[^>]*>(.*?)</main>", t) or re.search(r'(?is)<article[^>]*>(.*?)</article>', t)
    if m:
        t = m.group(1)
    t = re.sub(r"(?i)<br\s*/?>|</(p|div|tr|li|h\d|dt|dd|th|td|section)>", "\n", t)
    t = html.unescape(re.sub(r"<[^>]+>", " ", t))
    lines = [re.sub(r"[ \t　]+", " ", l).strip() for l in t.split("\n")]
    return "\n".join(l for l in lines if l)


def pdf_text(b, pages=6):
    from pypdf import PdfReader
    r = PdfReader(io.BytesIO(b))
    return "\n".join((p.extract_text() or "") for p in r.pages[:pages])


def pdfリンク(t, base):
    out = []
    for m in re.finditer(r'(?is)<a[^>]+href=["\']([^"\']+\.pdf)["\'][^>]*>(.*?)</a>', t):
        out.append((urljoin(base, html.unescape(m.group(1))), html.unescape(re.sub(r"<[^>]+>", "", m.group(2))).strip()))
    out.sort(key=lambda x: 0 if re.search(r"募集|要項|要領|仕様|公告|公募|実施", x[1]) else 1)
    return out


def 日付(s):
    s = (s or "").strip()
    if not s:
        return ""
    try:
        return parsedate_to_datetime(s).astimezone(JST).date().isoformat()
    except Exception:
        pass
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", s)
    return m.group(0) if m else ""


def rss_items(b):
    root = ET.fromstring(b)
    items = []
    for it in root.iter():
        if it.tag.split("}")[-1] not in ("item", "entry"):
            continue
        kids = {}
        cats = []
        for c in it:
            name = c.tag.split("}")[-1]
            if name == "category" and c.text:
                cats.append(c.text.strip())
            kids.setdefault(name, c)
        link = kids.get("link")
        link = (link.get("href") or link.text or "").strip() if link is not None else ""
        date = next((kids[k].text for k in ("pubDate", "date", "updated", "published", "issued") if k in kids and kids[k].text), "")
        desc = kids.get("description") if "description" in kids else kids.get("summary")
        desc = html.unescape(re.sub(r"<[^>]+>", " ", desc.text or "")) if desc is not None else ""
        title = (kids["title"].text or "").strip() if "title" in kids else ""
        items.append({"title": title, "link": link, "date": 日付(date), "desc": re.sub(r"\s+", " ", desc).strip(), "cats": cats})
    return items


# ---------------------------------------------------------------- ① 集める
def 国のAPI():
    s, e = 今日 - datetime.timedelta(days=21), 今日
    out = {}
    for q in 国のAPIの言葉:
        try:
            b, _, _ = get("https://www.kkj.go.jp/api/?" + urllib.parse.urlencode(
                {"Query": q, "CFT_Issue_Date": f"{s}/{e}", "Count": 500}), timeout=90, limit=80_000_000)
            root = ET.fromstring(b)
        except Exception as ex:
            print("  国のAPI失敗", q, ex)
            continue
        for r in root.iter("SearchResult"):
            g = lambda t: (r.findtext(t) or "").strip()
            url = g("ExternalDocumentURI")
            out[url or g("Key")] = {"出どころ": "国の官公需API", "タイトル": g("ProjectName"), "機関": g("OrganizationName"),
                                    "都道府県": g("PrefectureName"), "URL": url, "公開日": g("CftIssueDate")[:10],
                                    "本文": g("ProjectDescription")[:7000]}
        time.sleep(1)
    return list(out.values())


def 役所サイト():
    if not 役所RSS.exists():
        return []
    orgs = json.loads(役所RSS.read_text())["機関"]
    jobs = [(e, f) for e in orgs for f in e["RSS"]]
    境 = str(今日 - datetime.timedelta(days=30))

    def one(job):
        e, f = job
        try:
            b, _, _ = get(f)
            return [(e, it) for it in rss_items(b)]
        except Exception:
            return []

    out = []
    with ThreadPoolExecutor(24) as ex:
        for res in ex.map(one, jobs):
            for e, it in res:
                if it["date"] and it["date"] < 境:
                    continue
                out.append({"出どころ": "役所サイト", "タイトル": it["title"], "機関": e["機関"], "都道府県": e["都道府県"],
                            "URL": it["link"], "公開日": it["date"], "本文": ""})
    print(f"  役所のRSS {len(jobs)}本を確認")
    return out


def JDN():
    out = []
    for f in JDNのRSS:
        try:
            b, _, _ = get(f)
        except Exception as ex:
            print("  JDN失敗", f, ex)
            continue
        for it in rss_items(b):
            out.append({"出どころ": "JDN 登竜門", "タイトル": it["title"], "機関": "", "都道府県": "", "URL": it["link"],
                        "公開日": it["date"], "本文": ""})
    return out


def 公募ナビ():
    out = []
    for f in 公募ナビのRSS:
        try:
            b, _, _ = get(f)
        except Exception as ex:
            print("  公募ナビ失敗", f, ex)
            continue
        for it in rss_items(b):
            # 公募ナビは記事ページを読みに行かず、RSSに載っている範囲（タイトル・紹介文・カテゴリ）だけ使う
            out.append({"出どころ": "公募ナビ", "タイトル": it["title"], "機関": "", "都道府県": "", "URL": it["link"],
                        "公開日": it["date"], "本文": f"{it['title']}\n{it['desc']}\nカテゴリ：{'、'.join(it['cats'])}"})
    return out


# ---------------------------------------------------------------- ② 候補を絞る・③ 中身を取る
def 候補か(it):
    # 国のAPIは案件名がPDFのファイル名（%E5…の形）のことがあるので、日本語に戻してから見る
    if re.search(r"%[0-9A-Fa-f]{2}", it["タイトル"]):
        it["タイトル"] = urllib.parse.unquote(it["タイトル"])
    t = n(it["タイトル"])
    # 国のAPIはタイトルが当てにならないことがあるので、本文の冒頭（件名が書かれているところ）も見る
    見る = t + (" " + n(it.get("本文", ""))[:400] if it["出どころ"] == "国の官公需API" else "")
    return bool(対象語.search(見る)) and not 除外語.search(t)


def 案件ID(it):
    key = it["URL"] or (it["出どころ"] + n(it["タイトル"]))
    return hashlib.sha1(key.encode()).hexdigest()[:12]


def 本文を取る(it):
    if it.get("本文"):
        return it
    try:
        b, final, ct = get(it["URL"], timeout=25, limit=15_000_000)
        if final.lower().split("?")[0].endswith(".pdf") or "pdf" in ct.lower():
            it["本文"] = pdf_text(b)[:8000]
        else:
            t = decode(b, ct)
            body = html_text(t)[:6000]
            if it["出どころ"] == "役所サイト":
                for url, label in pdfリンク(t, final)[:1]:
                    try:
                        pb, _, _ = get(url, timeout=30, limit=15_000_000)
                        body += f"\n\n【添付PDF：{label}】\n" + pdf_text(pb)[:5000]
                    except Exception:
                        pass
            it["本文"] = body
    except Exception as ex:
        it["本文"] = ""
        print("  本文の取得失敗", it["URL"][:80], str(ex)[:80])
    return it


# ---------------------------------------------------------------- ④ AIで判定・読み取り
AI指示 = """あなたは、ロゴ・VI・ブランディングが専門のデザイン会社のために、行政・団体の募集情報を仕分けるアシスタントです。
ツールは使わず、下に書いてある本文だけで判断してください。今日は __TODAY__ です。「候補」それぞれについて、次の項目をJSONで返してください。

判定の基準
- 対象 = true：新しくロゴ・シンボルマーク・校章・記念マーク、またはVI・ブランディング（ロゴを含むデザイン開発）を「作る人を募集している」もの。
  業務委託（入札・公募型プロポーザル・企画競争・見積合わせなど、お金を払って制作を頼むもの）も、デザイン公募・コンテスト（賞金・賞品・採用）も対象。
  締切が過ぎていても、募集そのものなら対象にする（受付中かどうかは締切の日付でこちらが判断する）。
- 対象 = false：ロゴの使い方の案内、既存ロゴ入りグッズの製造・印刷だけ、ロゴの掲出・広告枠、キャラクターだけの募集、決定・結果のお知らせ、ロゴと関係ない業務。

書き方のルール
- 本文に書いていないことは推測しない（null または "記載なし"）。
- 日付は西暦の YYYY-MM-DD にする（令和8年＝2026年）。年が書いていなければ公開日から判断する。
- 締切は、これから来る締切のうち一番早いもの（参加申込・質問・提案書提出・応募・入札）。ほかの締切は「その他の締切」に短く。
- 金額は、業務委託なら上限額・予定価格、公募なら最高賞金（賞品なら「◯◯相当」）。金額_円 はその数値（なければ null）。
- 応募点数は「1人何点まで応募できるか」。書いてあればそのまま（例：1人3点まで／複数応募可／1人1点）、なければ "記載なし"。
- 同一キーは「主催者名|何のロゴか」の形で短く書く。下の「すでにある案件」と同じ募集なら、そのキーをそのまま使う。

返す形（JSONの配列だけを返す。前後に説明文やコードブロックを付けない）
[{"id":"候補のid","対象":true,"除外理由":null,"種類":"業務委託 または 公募・コンペ","分野":"ロゴ または VI・ブランディング","周年":false,
  "案件名":"短く整えた名前","主催":"発注機関・主催者","都道府県":"都道府県名（全国なら全国）",
  "金額":"表示用（例：上限2,200,000円（税込）／最優秀賞 10万円／記載なし）","金額_円":null,
  "募集開始日":null,"締切":null,"締切の種類":null,"その他の締切":null,
  "応募資格":"短く（例：法人のみ・県の入札参加資格が必要／不問／市内在住・在勤）","応募点数":"記載なし",
  "同一キー":"主催|何のロゴか","ひとこと":"どんなロゴ・案件か1行"}]
"""


def AIで読む(batch, 既存キー):
    parts = []
    for it in batch:
        parts.append(f"### id: {it['id']}\n出どころ: {it['出どころ']}\nタイトル: {it['タイトル']}\n機関: {it['機関']}\n"
                     f"都道府県: {it['都道府県']}\n公開日: {it['公開日']}\nURL: {it['URL']}\n本文:\n{it.get('本文') or '（取得できず。タイトルだけで判断）'}")
    prompt = (AI指示.replace("__TODAY__", str(今日)) + "\n\nすでにある案件（同一キー）:\n" + ("\n".join(既存キー[-200:]) or "なし")
              + "\n\n候補:\n\n" + "\n\n".join(parts))
    # 余計なものを読ませず軽く動かす：リポジトリの外で実行（CLAUDE.mdを読まない）・短い役割指示・道具なし
    cmd = ["claude", "-p", "--model", AIモデル, "--max-turns", "2", "--output-format", "json",
           "--system-prompt", "あなたは、行政・団体の募集情報を読んで、指定されたJSONだけを返す仕分け係です。ツールは使いません。",
           "--disallowedTools", "Bash", "Edit", "Write", "Read", "Glob", "Grep", "WebFetch", "WebSearch", "Task",
           "NotebookEdit", "TodoWrite", "--strict-mcp-config", "--no-session-persistence"]
    r = subprocess.run(cmd, input=prompt, capture_output=True, text=True, timeout=900, cwd=tempfile.gettempdir())
    if r.returncode != 0:
        raise RuntimeError(f"claude 失敗: {r.stderr[:300]} {r.stdout[:300]}")
    out = json.loads(r.stdout)
    u = out.get("usage", {})
    print(f"  AI {len(batch)}件：入力{u.get('input_tokens', 0) + u.get('cache_creation_input_tokens', 0) + u.get('cache_read_input_tokens', 0)}"
          f"・出力{u.get('output_tokens', 0)}トークン（API換算 ${out.get('total_cost_usd', 0):.3f}）")
    text = out.get("result", "")
    m = re.search(r"\[.*\]", text, re.S)
    if not m:
        raise RuntimeError("JSONが見つからない: " + text[:300])
    return json.loads(m.group(0))


# ---------------------------------------------------------------- 表示用の小道具
def 受付中(c):
    if c.get("締切"):
        return c["締切"] >= str(今日)
    return c.get("発見日", "") >= str(今日 - datetime.timedelta(days=45))


def 残り日数(c):
    try:
        return (datetime.date.fromisoformat(c["締切"]) - 今日).days
    except Exception:
        return None


def 締切表示(c):
    if not c.get("締切"):
        return "記載なし"
    d = datetime.date.fromisoformat(c["締切"])
    s = f"{d.month}/{d.day}"
    if c.get("締切の種類"):
        s = f"{c['締切の種類']} {s}"
    r = 残り日数(c)
    if r is not None and r >= 0:
        s += "（今日まで）" if r == 0 else f"（あと{r}日）"
    return s


def 並び順(c):
    return (0 if c.get("種類") == "業務委託" else 1, c.get("締切") or "9999", -(c.get("金額_円") or 0))


def e(s):
    return html.escape(str(s or ""))


# ---------------------------------------------------------------- ⑤ HTML一覧
HTMLひな形 = """<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>ロゴ案件ウォッチ</title>
<style>
:root { --ink:#1a1a1a; --sub:#444; --meta:#777; --line:#e4e4e4; --bg:#f6f6f4; --card:#fff;
        --itaku:#1f3fa8; --itaku-bg:#eef2ff; --kobo:#c2410c; --kobo-bg:#fff4ec; }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--ink); font-size:16px; line-height:1.7; overflow-x:hidden;
       font-family:"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Yu Gothic",sans-serif; }
a { color:inherit; }
.site-header { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:18px 24px;
               background:#111; color:#fff; }
.site-title { margin:0; font-size:18px; letter-spacing:.08em; font-weight:700; }
.site-status { font-size:13px; color:rgba(255,255,255,.75); text-align:right; }
.wrap { max-width:980px; margin:0 auto; padding:24px; }
.lead { margin:0 0 16px; color:var(--sub); font-size:14px; }
.filters { display:flex; flex-wrap:wrap; gap:8px; margin:0 0 20px; }
.chip { border:1px solid #ccc; background:#fff; color:var(--ink); border-radius:999px; padding:6px 14px; font-size:14px; cursor:pointer; }
.chip.is-on { background:var(--ink); color:#fff; border-color:var(--ink); }
.section-title { font-size:15px; letter-spacing:.06em; margin:28px 0 12px; color:var(--sub); }
.cards { display:grid; gap:14px; }
.card { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:18px 20px; }
.card.is-itaku { border-left:5px solid var(--itaku); }
.card.is-kobo { border-left:5px solid var(--kobo); }
.card.is-closed { opacity:.55; }
.card-head { display:flex; flex-wrap:wrap; align-items:center; gap:6px 8px; margin-bottom:6px; }
.badge { font-size:12px; padding:2px 8px; border-radius:4px; background:#efefef; color:var(--sub); }
.badge.type-itaku { background:var(--itaku-bg); color:var(--itaku); font-weight:700; }
.badge.type-kobo { background:var(--kobo-bg); color:var(--kobo); font-weight:700; }
.money { margin-left:auto; font-weight:700; font-size:16px; }
.card-title { margin:4px 0 2px; font-size:18px; line-height:1.5; }
.card-title a { text-decoration:none; }
.card-title a:hover { text-decoration:underline; }
.org { margin:0; color:var(--sub); font-size:14px; }
.summary { margin:8px 0 0; font-size:14px; color:var(--sub); }
.meta { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px 20px; margin:12px 0 0; }
.meta div { display:flex; gap:10px; font-size:14px; }
.meta dt { flex:0 0 5.5em; color:var(--meta); }
.meta dd { margin:0; color:var(--ink); }
.deadline-soon { color:#b91c1c; font-weight:700; }
.source { margin:12px 0 0; font-size:12px; color:var(--meta); }
.source a { color:var(--meta); }
.empty { color:var(--sub); font-size:14px; }
.note { margin:32px 0 0; font-size:12px; color:var(--meta); }
@media (max-width: 768px) {
  .site-header { padding:14px 20px; }
  .wrap { width:100%; padding:20px 32px; }
  .card { padding:16px; }
  .meta { grid-template-columns:1fr; }
  .money { margin-left:0; width:100%; }
}
</style>
</head>
<body>
<header class="site-header">
  <h1 class="site-title">ロゴ案件ウォッチ</h1>
  <div class="site-status">受付中 __OPEN__件<br>更新 __UPDATED__</div>
</header>
<main class="wrap">
  <p class="lead">行政・団体のロゴ／VI・ブランディングの募集を毎日集めています（業務委託を上に表示）。</p>
  <div class="filters" role="group" aria-label="絞り込み">
    <button class="chip is-on" data-f="all">すべて</button>
    <button class="chip" data-f="is-itaku">業務委託</button>
    <button class="chip" data-f="is-kobo">公募・コンペ</button>
    <button class="chip" data-f="is-anniv">周年</button>
    <button class="chip" data-f="is-vi">VI・ブランディング</button>
  </div>
  <h2 class="section-title">受付中</h2>
  <div class="cards">__OPEN_CARDS__</div>
  <h2 class="section-title">締切を過ぎたもの（直近60日）</h2>
  <div class="cards">__CLOSED_CARDS__</div>
  <p class="note">出どころ：国の官公需情報ポータルサイト検索API（中小企業庁）／各役所サイトの新着情報／JDN「登竜門」／公募ナビ。内容は必ず掲載元で確認してください。</p>
</main>
<script>
document.querySelectorAll('.chip').forEach(function (chip) {
  chip.addEventListener('click', function () {
    document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-on'); });
    chip.classList.add('is-on');
    var f = chip.dataset.f;
    document.querySelectorAll('.card').forEach(function (card) {
      card.hidden = !(f === 'all' || card.classList.contains(f));
    });
  });
});
</script>
</body>
</html>
"""


def カード(c, closed=False):
    itaku = c.get("種類") == "業務委託"
    cls = ["card", "is-itaku" if itaku else "is-kobo"]
    badges = ['<span class="badge {}">{}</span>'.format("type-itaku" if itaku else "type-kobo", e(c.get("種類") or "種類不明"))]
    if c.get("周年"):
        cls.append("is-anniv")
        badges.append('<span class="badge">周年</span>')
    if c.get("分野") == "VI・ブランディング":
        cls.append("is-vi")
        badges.append('<span class="badge">VI・ブランディング</span>')
    if closed:
        cls.append("is-closed")
    money = c.get("金額") if c.get("金額") not in (None, "", "記載なし") else ""
    if money:
        badges.append('<span class="money">{}</span>'.format(e(money)))
    dl = e(締切表示(c))
    r = 残り日数(c)
    if r is not None and 0 <= r <= 7 and not closed:
        dl = '<span class="deadline-soon">{}</span>'.format(dl)
    rows = [("締切", dl)]
    for key, label in (("その他の締切", "その他の締切"), ("募集開始日", "募集開始"), ("応募資格", "応募資格"), ("応募点数", "応募点数")):
        v = c.get(key)
        if v and v != "記載なし":
            rows.append((label, e(v)))
    meta = "".join("<div><dt>{}</dt><dd>{}</dd></div>".format(k, v) for k, v in rows)
    others = "".join('／<a href="{}" target="_blank" rel="noopener">{}</a>'.format(e(o["URL"]), e(o["出どころ"]))
                     for o in c.get("他の掲載", []))
    place = "・".join(x for x in (c.get("主催"), c.get("都道府県")) if x)
    summary = '<p class="summary">{}</p>'.format(e(c["ひとこと"])) if c.get("ひとこと") else ""
    return ('<article class="{cls}"><div class="card-head">{badges}</div>'
            '<h3 class="card-title"><a href="{url}" target="_blank" rel="noopener">{name}</a></h3>'
            '<p class="org">{place}</p>{summary}<dl class="meta">{meta}</dl>'
            '<p class="source">出どころ：{src}{others}／見つけた日：{found}</p></article>').format(
        cls=" ".join(cls), badges="".join(badges), url=e(c["URL"]), name=e(c.get("案件名") or c["タイトル"]),
        place=e(place), summary=summary, meta=meta, src=e(c["出どころ"]), others=others, found=e(c.get("発見日")))


def HTMLを書く(data):
    対象 = [c for c in data["案件"] if c.get("判定") == "対象"]
    open_ = sorted([c for c in 対象 if 受付中(c)], key=並び順)
    境 = str(今日 - datetime.timedelta(days=60))
    closed = sorted([c for c in 対象 if not 受付中(c) and (c.get("締切") or c.get("発見日", "")) >= 境],
                    key=lambda c: c.get("締切") or "", reverse=True)
    page = (HTMLひな形.replace("__OPEN__", str(len(open_))).replace("__UPDATED__", 今.strftime("%-m/%-d %H:%M"))
            .replace("__OPEN_CARDS__", "".join(カード(c) for c in open_) or '<p class="empty">いま受付中の案件はありません。</p>')
            .replace("__CLOSED_CARDS__", "".join(カード(c, True) for c in closed) or '<p class="empty">ありません。</p>'))
    HTML出力.parent.mkdir(parents=True, exist_ok=True)
    HTML出力.write_text(page)
    return open_


# ---------------------------------------------------------------- ⑥ LINE
def LINE文(cases, 見出し, 残り=0):
    parts = [見出し]
    for c in cases:
        icon = "💰" if c.get("種類") == "業務委託" else "🏆"
        parts.append(f"{icon}{c.get('種類') or ''}｜{c.get('主催') or c.get('機関') or ''}\n{c.get('案件名') or c['タイトル']}\n"
                     f"金額：{c.get('金額') or '記載なし'}\n締切：{締切表示(c)}\n{c['URL']}")
    if 残り:
        parts.append(f"ほか{残り}件は一覧で")
    parts.append(f"一覧\n{一覧URL}")
    return "\n\n".join(parts)


def LINEに送る(text):
    tok, uid = os.environ.get("LINE_CHANNEL_ACCESS_TOKEN"), os.environ.get("LINE_USER_ID")
    if DRY or not tok or not uid:
        print("---- LINE（送らずに表示）----\n" + text)
        return
    body = json.dumps({"to": uid, "messages": [{"type": "text", "text": text[:4900]}]}).encode()
    req = urllib.request.Request("https://api.line.me/v2/bot/message/push", data=body,
                                 headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        print("LINE送信", r.status)


# ---------------------------------------------------------------- 本体
def main():
    初回 = not 案件JSON.exists()
    data = {"案件": []} if 初回 else json.loads(案件JSON.read_text())
    index = {c["id"]: c for c in data["案件"]}

    # ① 集める
    items = []
    for name, fn in (("国のAPI", 国のAPI), ("役所サイト", 役所サイト), ("JDN", JDN), ("公募ナビ", 公募ナビ)):
        try:
            got = fn()
            print(f"{name}: {len(got)}件")
            items += got
        except Exception as ex:
            print(f"{name}: 失敗 {ex}")

    # ② 候補（まだ判定していないものだけ）
    cands = {}
    for it in items:
        if not it["タイトル"] or not 候補か(it):
            continue
        it["id"] = 案件ID(it)
        if it["id"] in index and index[it["id"]].get("判定") != "未判定":
            continue
        cands.setdefault(it["id"], it)
    for c in data["案件"]:  # 前回AIで読めなかったものを再挑戦
        if c.get("判定") == "未判定" and c["id"] not in cands:
            cands[c["id"]] = {k: c.get(k, "") for k in ("id", "出どころ", "タイトル", "機関", "都道府県", "URL", "公開日")}
    todo = sorted(cands.values(), key=lambda it: it.get("公開日") or "", reverse=True)
    todo, 後回し = todo[:AI上限], todo[AI上限:]
    print(f"候補 {len(cands)}件（今回AIで読む {len(todo)}件・後回し {len(後回し)}件）")

    # ③ 中身を取る
    with ThreadPoolExecutor(8) as ex:
        todo = list(ex.map(本文を取る, todo))

    # ④ AIで判定・読み取り（8件ずつ）
    既存キー = [c["同一キー"] for c in data["案件"] if c.get("判定") == "対象" and c.get("同一キー")]
    結果 = {}
    for i in range(0, len(todo), 8):
        batch = todo[i:i + 8]
        try:
            for r in AIで読む(batch, 既存キー):
                結果[str(r.get("id"))] = r
                if r.get("対象") and r.get("同一キー"):
                    既存キー.append(r["同一キー"])
        except Exception as ex:
            print("  AI失敗（次回に再挑戦）", str(ex)[:300])

    # ⑤ 貯める（同じ募集は1件にまとめる）
    新着 = []
    for it in todo + 後回し:
        old = index.get(it["id"], {})
        c = {k: it.get(k, "") for k in ("id", "出どころ", "タイトル", "機関", "都道府県", "URL", "公開日")}
        c["発見日"] = old.get("発見日") or str(今日)
        r = 結果.get(it["id"])
        if r:
            c.update({k: r.get(k) for k in 項目})
            c["判定"] = "対象" if r.get("対象") else "除外"
        else:
            c["判定"] = "未判定"
        if c["判定"] == "対象":
            same = next((x for x in index.values() if x.get("判定") == "対象" and x["id"] != c["id"]
                         and x.get("同一キー") and x.get("同一キー") == c.get("同一キー")), None)
            if same:
                c["判定"] = "重複"
                if all(o["URL"] != c["URL"] for o in same.get("他の掲載", [])) and same["URL"] != c["URL"]:
                    same.setdefault("他の掲載", []).append({"出どころ": c["出どころ"], "URL": c["URL"]})
            elif old.get("判定") != "対象":
                新着.append(c)
        index[c["id"]] = c
    data["案件"] = sorted(index.values(), key=lambda c: c.get("発見日", ""), reverse=True)
    data["更新"] = 今.isoformat(timespec="minutes")
    案件JSON.parent.mkdir(parents=True, exist_ok=True)
    案件JSON.write_text(json.dumps(data, ensure_ascii=False, indent=1))

    # ⑥ HTML一覧
    open_ = HTMLを書く(data)
    判定 = {}
    for c in data["案件"]:
        判定[c.get("判定")] = 判定.get(c.get("判定"), 0) + 1
    print("判定の内訳:", 判定, "／受付中:", len(open_), "／今回の新着:", len(新着))

    # ⑦ LINE（初回は「はじめました」のまとめ、2回目以降は受付中の新着だけ）
    if 初回:
        itaku = sum(1 for c in open_ if c.get("種類") == "業務委託")
        head = f"【ロゴ案件ウォッチ】はじめました\n受付中のロゴ案件 {len(open_)}件（業務委託 {itaku}件・公募 {len(open_) - itaku}件）"
        LINEに送る(LINE文(open_[:6], head, max(0, len(open_) - 6)))
    else:
        new_open = sorted([c for c in 新着 if 受付中(c)], key=並び順)
        if new_open:
            LINEに送る(LINE文(new_open[:8], f"【ロゴ案件ウォッチ】新着 {len(new_open)}件", max(0, len(new_open) - 8)))
        else:
            print("新着なし（LINEは送らない）")


if __name__ == "__main__":
    main()
