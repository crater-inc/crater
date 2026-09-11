# 役所RSSさがし.py
# 役所・団体サイトの「新着RSS」を探して data/役所RSS.json に保存する。
# 発注機関のサイトは、国の官公需APIに載っている掲載元URLから集める（月1回くらい回せば十分）。
import json, re, time, datetime, html, urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from urllib.parse import urlparse, urljoin
from concurrent.futures import ThreadPoolExecutor
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "data" / "役所RSS.json"
UA = "Mozilla/5.0 (compatible; CraterLogoWatch/1.0; +https://crater.co.jp/)"
JST = datetime.timezone(datetime.timedelta(hours=9))


def get(url, timeout=15, limit=3_000_000):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(limit), r.geturl()


def decode(b):
    for enc in ("utf-8", "cp932", "euc-jp"):
        try:
            return b.decode(enc)
        except UnicodeDecodeError:
            pass
    return b.decode("utf-8", "ignore")


# ① 国の官公需APIから、発注機関ごとの掲載元ドメインを集める（直近60日）
def 機関ドメイン():
    today = datetime.datetime.now(JST).date()
    windows = [(today - datetime.timedelta(days=d + 30), today - datetime.timedelta(days=d)) for d in (0, 30)]
    dom, pref = defaultdict(Counter), {}
    for code in range(1, 48):
        for s, e in windows:
            q = urllib.parse.urlencode({"Query": "", "LG_Code": f"{code:02d}", "CFT_Issue_Date": f"{s}/{e}", "Count": 1000})
            try:
                b, _ = get("https://www.kkj.go.jp/api/?" + q, timeout=90, limit=80_000_000)
                root = ET.fromstring(b)
            except Exception as ex:
                print("API失敗", code, s, ex, flush=True)
                time.sleep(3)
                continue
            for r in root.iter("SearchResult"):
                org = (r.findtext("OrganizationName") or "").strip()
                host = urlparse((r.findtext("ExternalDocumentURI") or "").strip()).netloc.lower()
                if org and host:
                    dom[org][host] += 1
                    pref[org] = (r.findtext("PrefectureName") or "").strip()
            time.sleep(0.5)
        print("県コード", code, "機関数", len(dom), flush=True)
    return dom, pref


# ② 入札システムのサブドメイン（keiyaku.city.xxx.jp など）から本体サイト（www.city.xxx.jp）も候補にする
def 候補サイト(host):
    hosts = [host]
    parts = host.split(".")
    for i in range(1, len(parts) - 2):
        rest = ".".join(parts[i:])
        if re.match(r"(city|pref|town|vill|metro)\.", rest):
            hosts.append("www." + rest)
            break
    if not host.startswith("www.") and re.match(r"(city|pref|town|vill|metro)\.", host):
        hosts.append("www." + host)
    return list(dict.fromkeys(hosts))


FEED_TYPE = re.compile(r"application/(rss|atom|rdf)\+xml", re.I)


def 記事数(b):
    root = ET.fromstring(b)
    return (len(root.findall(".//item")) + len(root.findall(".//{http://www.w3.org/2005/Atom}entry"))
            + len(root.findall(".//{http://purl.org/rss/1.0/}item")))


# ③ トップページの <link rel="alternate"> と、よくあるCMSの新着RSSの場所を試す
def RSSを探す(host):
    try:
        b, final = get(f"https://{host}/")
    except Exception:
        try:
            b, final = get(f"http://{host}/")
        except Exception:
            return host, None, []
    t = decode(b)
    cands = []
    for m in re.finditer(r"<link[^>]+>", t, re.I):
        tag = m.group(0)
        if re.search(r"alternate", tag, re.I) and FEED_TYPE.search(tag):
            h = re.search(r'href=["\']([^"\']+)', tag)
            if h:
                cands.append(urljoin(final, html.unescape(h.group(1))))
    cands.append(urljoin(final, "/rss/10/list1.xml"))
    ok = []
    for f in dict.fromkeys(cands):
        try:
            fb, _ = get(f)
            if 記事数(fb) > 0:
                ok.append(f)
        except Exception:
            pass
        if len(ok) >= 4:
            break
    return host, final, ok


def main():
    dom, pref = 機関ドメイン()
    jobs = {}
    for org, c in dom.items():
        for host, _ in c.most_common(2):
            for h in 候補サイト(host):
                jobs.setdefault(h, org)
    print("候補サイト", len(jobs), flush=True)
    by_org, seen = {}, set()
    with ThreadPoolExecutor(24) as ex:
        for host, final, feeds in ex.map(RSSを探す, list(jobs)):
            org = jobs[host]
            feeds = [f for f in feeds if f not in seen]
            seen.update(feeds)
            if not feeds:
                continue
            e = by_org.setdefault(org, {"機関": org, "都道府県": pref.get(org, ""), "サイト": final, "RSS": []})
            e["RSS"].extend(feeds)
    data = sorted(by_org.values(), key=lambda e: (e["都道府県"], e["機関"]))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"作成日": str(datetime.datetime.now(JST).date()), "機関": data}, ensure_ascii=False, indent=1))
    print(f"発注機関 {len(dom)} → RSSが見つかった機関 {len(data)}・RSS {sum(len(e['RSS']) for e in data)}本", flush=True)


if __name__ == "__main__":
    main()
