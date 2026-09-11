# 収集.py
# ロゴ案件ウォッチ：行政・団体の「ロゴ／VI・ブランディング」の募集を毎日集めて、HTML一覧とLINEに出す。
# 流れ：集める（国のAPI・役所の新着RSS・JDN・公募ナビ）→ タイトルで候補を絞る → 中身を取る
#       → AIで判定・読み取り → data/案件.json に貯める → HTML一覧を作る → 新着をLINEで送る
import json, os, re, io, sys, time, html, hashlib, datetime, subprocess, tempfile, unicodedata
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
        "締切の種類", "提出締切", "その他の締切", "応募資格", "応募点数", "同一キー", "ひとこと", "除外理由"]
読み取り版 = 3  # AIへの指示を変えたら上げる。受付中の案件は、次に掲載元に出てきたときに1回読み直す
短い期間 = 14  # 募集開始から提出締切までがこの日数以下なら「期間短め」
参加の言葉 = ("参加表明", "参加申込", "参加申し込み", "参加申請", "参加資格", "エントリー")


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
        body = kids["encoded"] if "encoded" in kids else kids.get("content")  # RSSに入っている記事本文
        body = html.unescape(re.sub(r"<[^>]+>", " ", body.text or "")) if body is not None else ""
        title = (kids["title"].text or "").strip() if "title" in kids else ""
        items.append({"title": title, "link": link, "date": 日付(date), "desc": re.sub(r"\s+", " ", desc).strip(),
                      "content": re.sub(r"\s+", " ", body).strip()[:5000], "cats": cats})
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
            # 公募ナビは記事ページを読みに行かず、RSSに載っている範囲（タイトル・記事本文・カテゴリ）だけ使う
            # 紹介文はほかの募集の文と入れ違っていることがある（東浦町の件）ので、記事本文があればそちらを使う
            本文 = it["content"] or it["desc"]
            out.append({"出どころ": "公募ナビ", "タイトル": it["title"], "機関": "", "都道府県": "", "URL": it["link"],
                        "公開日": it["date"], "本文": f"{it['title']}\n{本文}\nカテゴリ：{'、'.join(it['cats'])}"})
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
    if it.get("本文") or it["出どころ"] == "公募ナビ":  # 公募ナビの記事ページは読みに行かない
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
- 案件名は、それだけで何の募集か分かるように、主催やイベントの名前を入れて短くする（例：人形劇団プーク100周年記念シンボルマーク募集）。
- 日付は西暦の YYYY-MM-DD にする（令和8年＝2026年）。年が書いていなければ公開日から判断する。
- 締切は、参加するために最初に守る締切（参加申込・参加表明・参加資格の申請・エントリー・応募・入札・提案書提出のうち一番早いもの）。
  質問の締切は入れない。今日より前でもそのまま書く。
- 提出締切は、企画提案書・作品・入札書を最後に出す締切。締切と同じ日ならその日を書く。
- ほかの締切（質問など）は「その他の締切」に短く。
- 募集開始日は、募集・受付が始まる日（募集期間の初日・公告日）。書いていなければ null。
- 金額は、業務委託なら上限額・予定価格、公募なら最高賞金（賞品なら「◯◯相当」）。金額_円 はその数値（なければ null）。
- 応募点数は「1人何点まで応募できるか」。書いてあればそのまま（例：1人3点まで／複数応募可／1人1点）、なければ "記載なし"。
- 同一キーは「主催者名|何のロゴか」の形で短く書く。下の「すでにある案件」と同じ募集なら、そのキーをそのまま使う。

返す形（JSONの配列だけを返す。前後に説明文やコードブロックを付けない）
[{"id":"候補のid","対象":true,"除外理由":null,"種類":"業務委託 または 公募・コンペ","分野":"ロゴ または VI・ブランディング","周年":false,
  "案件名":"何の募集か分かる短い名前","主催":"発注機関・主催者","都道府県":"都道府県名（全国なら全国）",
  "金額":"表示用（例：上限2,200,000円（税込）／最優秀賞 10万円／記載なし）","金額_円":null,
  "募集開始日":null,"締切":null,"締切の種類":null,"提出締切":null,"その他の締切":null,
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
    return AIに聞く(prompt, len(batch))


おすすめ指示 = """あなたは、ロゴ・VIが専門のデザイン会社（代表はアートディレクター）のために、募集案件の「おすすめ度」を付けるアシスタントです。
ツールは使わず、あなたの知識と下の情報だけで判断してください。

基準は2つだけ
1. 実績としての価値：できたロゴが、実績として人に見せたときに意味を持つか。
   主催の知名度（一般の人も知っている／その業界で有名）、規模（国際大会・全国大会・大きな自治体・歴史ある団体の節目の周年など）、
   ロゴがどれだけ長く・広く使われるか。
2. 金額：業務委託ならおおむね100万円以上、公募なら賞金10万円以上は高い。
金額は低いことが多いので、主に1で判断する。

おすすめ度
- 0：ふつう。ほとんどはこれ。毎回おすすめを付けなくてよい。
- 1：おすすめ。実績として見せたときに伝わるもの。
- 2：特におすすめ。めったに付けない（誰でも知っている主催・国際的な大舞台・高額など）。
- 知らない団体や判断がつかないものは0。推測で持ち上げない。

おすすめ理由は、なぜ実績になるか（またはなぜ高いか）を短く1行で具体的に。0なら null。

返す形（JSONの配列だけを返す。前後に説明文やコードブロックを付けない）
[{"id":"案件のid","おすすめ度":0,"おすすめ理由":null}]
"""


def AIでおすすめ(cases):
    parts = []
    for c in cases:
        parts.append("### id: {}\n種類: {}\n分野: {}\n周年: {}\n案件名: {}\n主催: {}\n都道府県: {}\n金額: {}\n応募資格: {}\nひとこと: {}".format(
            c["id"], c.get("種類"), c.get("分野"), "はい" if c.get("周年") else "いいえ", c.get("案件名") or c["タイトル"],
            c.get("主催") or c.get("機関"), c.get("都道府県"), c.get("金額"), c.get("応募資格"), c.get("ひとこと")))
    return AIに聞く(おすすめ指示 + "\n\n案件:\n\n" + "\n\n".join(parts), len(cases))


def AIに聞く(prompt, 件数):
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
    print(f"  AI {件数}件：入力{u.get('input_tokens', 0) + u.get('cache_creation_input_tokens', 0) + u.get('cache_read_input_tokens', 0)}"
          f"・出力{u.get('output_tokens', 0)}トークン（API換算 ${out.get('total_cost_usd', 0):.3f}）")
    text = out.get("result", "")
    m = re.search(r"\[.*\]", text, re.S)
    if not m:
        raise RuntimeError("JSONが見つからない: " + text[:300])
    return json.loads(m.group(0))


# ---------------------------------------------------------------- 表示用の小道具
def 締切を整える(c):
    # 参加表明などの締切が、表示中の締切より前にあればそちらを締切にする（遅い日付で受付中に見せない）
    if not c.get("締切"):
        return
    c["提出締切"] = c.get("提出締切") or c["締切"]
    for part in re.split(r"[／、;；\n]", c.get("その他の締切") or ""):
        m = re.search(r"\d{4}-\d{2}-\d{2}", part)
        if m and m.group(0) < c["締切"] and any(w in part for w in 参加の言葉):
            c["締切"], c["締切の種類"] = m.group(0), part[:m.start()].strip(" ：:") or "参加申込"


def 募集期間(c):
    # 本文に書いてあった募集開始日から提出締切までの日数。掲載日では測らない（載るのが遅れただけで短く見えるため）
    try:
        return (datetime.date.fromisoformat(c.get("提出締切") or c["締切"])
                - datetime.date.fromisoformat(c["募集開始日"][:10])).days
    except Exception:
        return None


def 受付中(c):
    if c.get("締切"):
        return c["締切"] >= str(今日)
    return c.get("発見日", "") >= str(今日 - datetime.timedelta(days=45))


def 読み直す(c):
    # AIへの指示が新しくなった後、受付中の案件が掲載元にまた出てきたら1回だけ読み直す
    return c.get("判定") == "対象" and c.get("読み取り版", 1) < 読み取り版 and 受付中(c)


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


# ---------------------------------------------------------------- ⑤ HTML一覧（表の形：1行1案件）
HTMLひな形 = """<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>ロゴ案件ウォッチ</title>
<style>
:root { --ink:#202226; --sub:#50555c; --meta:#7a7f87; --line:#e8eaee; --hover:#f6f7f9;
        --paid:#2b4acb; --urgent:#c62828; --bg:#ffffff; }
* { box-sizing:border-box; }
[hidden] { display:none !important; }
html { -webkit-text-size-adjust:100%; }
body { margin:0; background:var(--bg); color:var(--ink); font-size:16px; line-height:1.6; overflow-x:hidden;
       font-family:"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Yu Gothic",sans-serif; }
a { color:inherit; }
a:focus-visible, .chip:focus-visible, summary:focus-visible { outline:2px solid var(--paid); outline-offset:2px; }
.site-header { display:flex; justify-content:space-between; align-items:flex-end; gap:16px;
               padding:20px 24px 16px; border-bottom:1px solid var(--line); }
.site-title { margin:0; font-size:20px; font-weight:700; letter-spacing:.04em; }
.site-status { margin:0; font-size:13px; color:var(--sub); text-align:right; line-height:1.5; }
.site-status strong { color:var(--ink); font-size:15px; }
.wrap { max-width:1240px; margin:0 auto; padding:20px 24px 48px; }
.lead { margin:0 0 16px; font-size:14px; color:var(--sub); }
.filters { display:flex; flex-wrap:wrap; gap:8px; }
.chip { font:inherit; font-size:14px; line-height:1.4; border:1px solid #cfd3d9; background:#fff; color:var(--ink);
        border-radius:6px; padding:6px 12px; cursor:pointer; }
.chip[aria-pressed="true"] { background:var(--ink); border-color:var(--ink); color:#fff; }
.group { margin-top:36px; }
.group-head { display:flex; flex-wrap:wrap; align-items:center; gap:6px 12px; margin:0; padding:0 0 10px;
              border-bottom:2px solid var(--ink); }
.group--paid .group-head { border-bottom-color:var(--paid); }
details.group .group-head { border-bottom:1px solid var(--line); }
.group-title { order:0; margin:0; font-size:20px; font-weight:700; line-height:1.4; }
.group-count { order:1; font-size:14px; font-weight:700; line-height:1.6; padding:1px 11px; border-radius:999px;
               background:var(--ink); color:#fff; font-variant-numeric:tabular-nums; }
.group--paid .group-count { background:var(--paid); }
details.group .group-count, .group-count.is-zero, .group--paid .group-count.is-zero { background:#eceef1; color:var(--sub); }
.group-desc { order:3; flex-basis:100%; margin:0; font-size:13px; color:var(--sub); }
details.group > summary { cursor:pointer; list-style:none; }
details.group > summary::-webkit-details-marker { display:none; }
details.group > summary::after { content:"＋"; order:2; font-weight:400; color:var(--meta); margin-left:auto; }
details.group[open] > summary::after { content:"−"; }
table { width:100%; border-collapse:collapse; font-size:14px; }
thead th { text-align:left; font-weight:400; font-size:12px; color:var(--meta); padding:8px 12px; border-bottom:1px solid var(--line); }
tbody td { padding:14px 12px; border-bottom:1px solid var(--line); vertical-align:top; }
tbody tr.row:hover { background:var(--hover); }
.col-title { width:34%; } .col-deadline { width:13%; } .col-money { width:17%; }
.col-count { width:11%; } .col-qual { width:17%; } .col-src { width:8%; }
td.title a { font-size:15px; font-weight:700; line-height:1.5; text-decoration:none; }
td.title a:hover { text-decoration:underline; }
td.title .org { display:block; margin-top:3px; font-size:13px; color:var(--sub); }
.tags { display:inline-flex; flex-wrap:wrap; gap:4px; margin-left:6px; vertical-align:2px; }
.tag { font-size:11px; line-height:1.6; padding:0 6px; border:1px solid #cfd3d9; border-radius:3px; color:var(--sub); }
.tag--pick { background:var(--ink); border-color:var(--ink); color:#fff; font-weight:700; }
td.title .why { display:block; margin-top:8px; padding-left:8px; border-left:2px solid var(--ink); font-size:13px; line-height:1.5; }
td.deadline { font-variant-numeric:tabular-nums; }
td.deadline .date { display:block; font-size:15px; font-weight:700; }
td.deadline .kind, td.deadline .left, td.deadline .due2 { display:block; font-size:12px; color:var(--sub); }
td.deadline.is-urgent .date, td.deadline.is-urgent .left { color:var(--urgent); }
td.deadline .start { display:block; margin-top:6px; font-size:12px; color:var(--meta); }
td.deadline .start .term { display:inline-block; }
td.money { font-variant-numeric:tabular-nums; }
.group--paid td.money { color:var(--paid); font-weight:700; font-size:15px; }
.clamp { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
.none { color:var(--meta); font-weight:400; font-size:13px; }
td.src { font-size:12px; color:var(--sub); }
td.src a { color:var(--sub); }
td.src .found { display:block; margin-top:2px; color:var(--meta); }
tr.empty td, tr.no-match td { color:var(--sub); }
details.group tbody td { color:var(--sub); }
.note { margin-top:44px; font-size:12px; color:var(--meta); }
.amt-note { display:block; font-size:12px; font-weight:400; color:var(--sub); }
.col-title { width:33%; } .col-deadline { width:12%; } .col-src { width:10%; }
@media (max-width: 768px) {
  .site-header { padding:16px 20px 12px; }
  .site-title { font-size:18px; }
  .wrap { width:100%; padding:16px 32px 40px; }
  .group { margin-top:28px; }
  .group-title { font-size:18px; }
  table, tbody, tr, td { display:block; width:100%; }
  thead { display:none; }
  tbody tr.row { border:1px solid var(--line); border-radius:8px; padding:14px 16px 10px; margin-bottom:10px; }
  tbody tr.row:hover { background:transparent; }
  tbody td { border:0; padding:0; }
  td.title { margin-bottom:8px; }
  td.title a { font-size:16px; }
  td[data-label] { display:grid; grid-template-columns:4.8em minmax(0, 1fr); gap:10px; padding:6px 0; border-top:1px solid #f0f1f3; }
  td[data-label]::before { content:attr(data-label); font-size:12px; font-weight:400; color:var(--meta); padding-top:2px; }
  td.deadline .date, td.deadline .kind, td.deadline .left, td.deadline .due2 { display:inline; margin-right:6px; }
  td.deadline .start { margin-top:2px; }
  td.money .amt-note { display:inline; margin-left:4px; }
  .clamp { -webkit-line-clamp:4; }
  td.src .found { display:inline; margin-left:8px; }
  tr.empty td, tr.no-match td { padding:14px 0; }
}
</style>
</head>
<body>
<header class="site-header">
  <h1 class="site-title">ロゴ案件ウォッチ</h1>
  <p class="site-status"><strong>受付中 __OPEN__件</strong><br>更新 __UPDATED__</p>
</header>
<main class="wrap">
  <p class="lead">行政・団体のロゴとVI・ブランディングの募集です。毎日9時と17時に更新しています。</p>
  <div class="filters" role="group" aria-label="絞り込み">
    <button type="button" class="chip" data-f="all" aria-pressed="true">すべて</button>
    <button type="button" class="chip" data-f="is-pick" aria-pressed="false">おすすめ</button>
    <button type="button" class="chip" data-f="is-urgent" aria-pressed="false">締切まで7日以内</button>
    <button type="button" class="chip" data-f="is-anniv" aria-pressed="false">周年</button>
    <button type="button" class="chip" data-f="is-vi" aria-pressed="false">VI・ブランディング</button>
  </div>
  <section class="group group--paid">
    <div class="group-head">
      <h2 class="group-title">業務委託</h2><span class="group-count__PAID_Z__">__PAID_COUNT__件</span>
      <p class="group-desc">入札・プロポーザルで受注する、制作費が出る仕事</p>
    </div>
    __PAID_TABLE__
  </section>
  <section class="group">
    <div class="group-head">
      <h2 class="group-title">公募・コンペ</h2><span class="group-count__KOBO_Z__">__KOBO_COUNT__件</span>
      <p class="group-desc">作品を応募して、賞金・採用をねらう募集</p>
    </div>
    __KOBO_TABLE__
  </section>
  <details class="group">
    <summary class="group-head"><span class="group-title">締切を過ぎたもの</span><span class="group-count">__CLOSED_COUNT__件</span><span class="group-desc">直近60日の分です。押すと開きます</span></summary>
    __CLOSED_TABLE__
  </details>
  <p class="note">出どころ：国の官公需情報ポータルサイト検索API（中小企業庁）／各役所サイトの新着情報／JDN「登竜門」／公募ナビ。応募する前に、必ず掲載元で内容を確認してください。</p>
</main>
<script>
var chips = document.querySelectorAll('.chip');
chips.forEach(function (chip) {
  chip.addEventListener('click', function () {
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
    var f = chip.dataset.f;
    document.querySelectorAll('tbody').forEach(function (tb) {
      var shown = 0;
      tb.querySelectorAll('tr.row').forEach(function (tr) {
        var ok = f === 'all' || tr.classList.contains(f);
        tr.hidden = !ok;
        if (ok) shown++;
      });
      var none = tb.querySelector('tr.no-match');
      if (none) none.hidden = shown > 0;
      var count = tb.closest('.group').querySelector('.group-count');
      if (count && tb.querySelector('tr.row')) { count.textContent = shown + '件'; count.classList.toggle('is-zero', shown === 0); }
    });
  });
});
</script>
</body>
</html>
"""

表の見出し = ('<thead><tr><th class="col-title" scope="col">案件名</th><th class="col-deadline" scope="col">締切</th>'
          '<th class="col-money" scope="col">金額</th><th class="col-count" scope="col">応募点数</th>'
          '<th class="col-qual" scope="col">応募資格</th><th class="col-src" scope="col">掲載元</th></tr></thead>')


def 日付表示(s):
    d = datetime.date.fromisoformat(s)
    return f"{d.month}/{d.day}" if d.year == 今日.year else f"{d.year}/{d.month}/{d.day}"


def 開始表示(c):
    # 締切の下に小さく出す開始日。募集開始日が読めたものはそれと募集期間、読めなかったものは掲載元に載った日
    try:
        s = "募集開始 " + 日付表示(c["募集開始日"][:10])
        p = 募集期間(c)
        term = '<span class="term">（期間{}日）</span>'.format(p) if p is not None and p >= 0 else ""
        return '<span class="start">{}{}</span>'.format(s, term)
    except (KeyError, TypeError, ValueError):
        pass
    try:
        return '<span class="start">掲載 {}</span>'.format(日付表示(c["公開日"][:10]))
    except (KeyError, TypeError, ValueError):
        return ""


def 値(v):
    return e(v) if v and v != "記載なし" else '<span class="none">記載なし</span>'


def 金額HTML(v):
    if not v or v == "記載なし":
        return '<span class="none">記載なし</span>'
    m = re.match(r"^(.+?)\s*([（(][^（）()]*[）)])$", v)
    if m:
        return '<span class="amt">{}</span><span class="amt-note">{}</span>'.format(e(m.group(1)), e(m.group(2)))
    return '<span class="amt">{}</span>'.format(e(v))


def 行(c, closed=False):
    r = 残り日数(c)
    urgent = (not closed) and r is not None and 0 <= r <= 7
    cls = ["row"]
    tags = []
    if urgent:
        cls.append("is-urgent")
    if closed and c.get("種類") == "業務委託":
        tags.append("業務委託")
    if c.get("周年"):
        cls.append("is-anniv")
        tags.append("周年")
    if c.get("分野") == "VI・ブランディング":
        cls.append("is-vi")
        tags.append("VI・ブランディング")
    p = 募集期間(c)
    if p is not None and 0 <= p <= 短い期間:
        cls.append("is-short")
        tags.append("期間短め")
    pick = c.get("おすすめ度") or 0
    pick_tag = ""
    why = ""
    if pick >= 1:
        cls.append("is-pick")
        pick_tag = '<span class="tag tag--pick">{}</span>'.format("特におすすめ" if pick >= 2 else "おすすめ")
        if c.get("おすすめ理由"):
            why = '<span class="why">{}</span>'.format(e(c["おすすめ理由"]))
    tag_html = ('<span class="tags">' + pick_tag + "".join('<span class="tag">{}</span>'.format(t) for t in tags)
                + "</span>") if (tags or pick_tag) else ""
    place = "・".join(x for x in (c.get("主催"), c.get("都道府県")) if x)
    title = ('<td class="title"><a href="{url}" target="_blank" rel="noopener" title="{hint}">{name}</a>{tags}'
             '<span class="org">{place}</span>{why}</td>').format(
        url=e(c["URL"]), hint=e(c.get("ひとこと")), name=e(c.get("案件名") or c["タイトル"]), tags=tag_html,
        place=e(place), why=why)
    if c.get("締切"):
        left = "終了" if closed else ("今日まで" if r == 0 else "あと{}日".format(r))
        dl = '<span class="date">{}</span><span class="kind">{}</span><span class="left">{}</span>'.format(
            日付表示(c["締切"]), e(c.get("締切の種類")), left)
        if c.get("提出締切") and c["提出締切"] != c["締切"]:
            dl += '<span class="due2">提出 {}</span>'.format(日付表示(c["提出締切"]))
    else:
        dl = '<span class="none">記載なし</span>'
    dl += 開始表示(c)
    others ="".join('<br><a href="{}" target="_blank" rel="noopener">{}</a>'.format(e(o["URL"]), e(o["出どころ"]))
                     for o in c.get("他の掲載", []))
    found = "見つけた日 " + 日付表示(c["発見日"]) if c.get("発見日") else ""

    def セル(name, label, inner):
        return '<td class="{}" data-label="{}"><div class="v">{}</div></td>'.format(name, label, inner)

    return '<tr class="{}">{}{}{}{}{}{}</tr>'.format(
        " ".join(cls), title,
        セル("deadline" + (" is-urgent" if urgent else ""), "締切", dl),
        セル("money", "金額", 金額HTML(c.get("金額"))),
        セル("count", "応募点数", 値(c.get("応募点数"))),
        セル("qual", "応募資格", '<span class="clamp" title="{}">{}</span>'.format(e(c.get("応募資格")), 値(c.get("応募資格")))),
        セル("src", "掲載元", '<a href="{}" target="_blank" rel="noopener">{}</a>{}<span class="found">{}</span>'.format(
            e(c["URL"]), e(c["出どころ"]), others, found)))


def テーブル(rows, 空の文):
    if rows:
        body = "".join(rows) + '<tr class="no-match" hidden><td colspan="6">この条件に合う案件はありません。</td></tr>'
    else:
        body = '<tr class="empty"><td colspan="6">{}</td></tr>'.format(空の文)
    return '<div class="table-wrap"><table>{}<tbody>{}</tbody></table></div>'.format(表の見出し, body)


def HTMLを書く(data):
    対象 = [c for c in data["案件"] if c.get("判定") == "対象"]
    for c in 対象:
        締切を整える(c)
    open_ = sorted([c for c in 対象 if 受付中(c)], key=並び順)
    paid = [c for c in open_ if c.get("種類") == "業務委託"]
    kobo = [c for c in open_ if c.get("種類") != "業務委託"]
    境 = str(今日 - datetime.timedelta(days=60))
    closed = sorted([c for c in 対象 if not 受付中(c) and (c.get("締切") or c.get("発見日", "")) >= 境],
                    key=lambda c: c.get("締切") or "", reverse=True)
    try:
        更新 = datetime.datetime.fromisoformat(data.get("更新", "")).astimezone(JST)
    except Exception:
        更新 = 今
    page = (HTMLひな形.replace("__OPEN__", str(len(open_)))
            .replace("__UPDATED__", "{}/{} {:%H:%M}".format(更新.month, 更新.day, 更新))
            .replace("__PAID_Z__", "" if paid else " is-zero").replace("__KOBO_Z__", "" if kobo else " is-zero")
            .replace("__PAID_COUNT__", str(len(paid)))
            .replace("__PAID_TABLE__", テーブル([行(c) for c in paid], "いま受付中の業務委託はありません。"))
            .replace("__KOBO_COUNT__", str(len(kobo)))
            .replace("__KOBO_TABLE__", テーブル([行(c) for c in kobo], "いま受付中の公募・コンペはありません。"))
            .replace("__CLOSED_COUNT__", str(len(closed)))
            .replace("__CLOSED_TABLE__", テーブル([行(c, True) for c in closed], "ありません。")))
    HTML出力.parent.mkdir(parents=True, exist_ok=True)
    HTML出力.write_text(page)
    return open_


# ---------------------------------------------------------------- ⑥ LINE
def LINE文(cases, 見出し, 残り=0):
    parts = [見出し]
    for c in cases:
        icon = "💰" if c.get("種類") == "業務委託" else "🏆"
        pick = c.get("おすすめ度") or 0
        why = "{}：{}\n".format("★特におすすめ" if pick >= 2 else "★おすすめ", c.get("おすすめ理由") or "") if pick >= 1 else ""
        parts.append(f"{icon}{c.get('種類') or ''}｜{c.get('主催') or c.get('機関') or ''}\n{c.get('案件名') or c['タイトル']}\n{why}"
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
        if it["id"] in index and index[it["id"]].get("判定") != "未判定" and not 読み直す(index[it["id"]]):
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
        r = 結果.get(it["id"])
        if not r and old.get("判定") == "対象":  # 読み直しできなかったものは前のまま
            continue
        c = {k: it.get(k, "") for k in ("id", "出どころ", "タイトル", "機関", "都道府県", "URL", "公開日")}
        c["発見日"] = old.get("発見日") or str(今日)
        if old.get("他の掲載"):
            c["他の掲載"] = old["他の掲載"]
        if r:
            c.update({k: r.get(k) for k in 項目})
            c["判定"] = "対象" if r.get("対象") else "除外"
            c["読み取り版"] = 読み取り版
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
    for c in index.values():
        if c.get("判定") == "対象":
            締切を整える(c)

    # ⑤' おすすめ度（受付中で、まだ付けていないものだけ）
    まだ = [c for c in index.values() if c.get("判定") == "対象" and 受付中(c) and "おすすめ度" not in c]
    if まだ and AI上限 > 0:
        try:
            for r in AIでおすすめ(まだ[:30]):
                c = index.get(str(r.get("id")))
                if c:
                    c["おすすめ度"] = int(r.get("おすすめ度") or 0)
                    c["おすすめ理由"] = r.get("おすすめ理由")
        except Exception as ex:
            print("  おすすめ失敗（次回に再挑戦）", str(ex)[:300])
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
    if "--html" in sys.argv:  # 集め直さずに、今あるデータから一覧だけ作り直す
        HTMLを書く(json.loads(案件JSON.read_text()))
        print("一覧を作り直しました:", HTML出力)
    else:
        main()
