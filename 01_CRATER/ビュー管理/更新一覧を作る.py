# VIEW管理のトップ「最近の更新」に出す一覧を作るスクリプト
# ・viewの全HTMLについて「最後に更新された日時・そのときのコミットの一言・ページのタイトル」を集め、JSONで標準出力に出す
# ・データだけ毎日入れ替わるダッシュボード（アクセス解析など）も拾えるよう、ページの近くの data フォルダの更新も見る
# ・GitHub Actions（.github/workflows/VIEW更新一覧.yml）から呼ばれる。ローカルでも試せる：
#     python3 01_CRATER/ビュー管理/更新一覧を作る.py > /tmp/更新一覧.json
import html
import json
import os
import re
import subprocess
from datetime import datetime, timezone

# 一覧に出さないページ（バックアップ・書き出し用・404・VIEW管理そのもの）
除外 = re.compile(r"(バックアップ|_旧|_bk\.|backup|export|(^|/)404\.html$|^01_CRATER/ビュー管理/)", re.IGNORECASE)

# フォルダ名 → 一覧に出す案件名（フォルダ名のままで分かりにくいものだけ）
案件名の読みかえ = {"MU": "能登マロン堂", "acurry": "A CURRY", "02_APOLLOS": "APOLLOS"}


def git(*args):
    return subprocess.run(
        ["git", "-c", "core.quotepath=false", *args],
        capture_output=True, text=True, check=True,
    ).stdout


def 案件名(path):
    parts = path.split("/")
    if len(parts) == 1:
        名前 = "VIEW"
    elif parts[0] == "CL":
        名前 = parts[1]
    elif parts[0] == "01_CRATER":
        名前 = parts[2] if parts[1] == "_SERVICE" and len(parts) > 3 else parts[1]
    elif parts[0] == "02_APOLLOS":
        名前 = "02_APOLLOS"
    else:
        名前 = parts[0]
    名前 = 案件名の読みかえ.get(名前, 名前)
    return re.sub(r"^\d+_", "", 名前)


def タイトル(path):
    try:
        本文 = open(path, encoding="utf-8", errors="replace").read()
    except OSError:
        return None, False
    転送ページ = re.search(r'http-equiv=["\']refresh', 本文, re.IGNORECASE) is not None
    m = re.search(r"<title[^>]*>(.*?)</title>", 本文, re.IGNORECASE | re.DOTALL)
    t = re.sub(r"\s+", " ", html.unescape(m.group(1))).strip() if m else ""
    return t or os.path.basename(path), 転送ページ


def main():
    # 全コミットを新しい順に見て、ファイルごとに「最後に変わったコミット」を覚える
    最新 = {}
    日時 = 一言 = None
    for line in git("log", "--format=@@%cI\t%s", "--name-only").splitlines():
        if line.startswith("@@"):
            日時, 一言 = line[2:].split("\t", 1)
        elif line and line not in 最新:
            最新[line] = (datetime.fromisoformat(日時).astimezone(timezone.utc), 一言)

    def フォルダの最新(prefix):
        候補 = [v for k, v in 最新.items() if k.startswith(prefix + "/")]
        return max(候補, key=lambda v: v[0]) if 候補 else None

    ページ = []
    for path in git("ls-files", "*.html").splitlines():
        if 除外.search(path) or path not in 最新:
            continue
        t, 転送ページ = タイトル(path)
        if t is None or 転送ページ:
            continue

        # ページ本体＋そのページが読むデータ置き場（同じ階層の data/、output の隣の data/）で一番新しい更新
        候補 = [最新[path]]
        d = os.path.dirname(path)
        for データ置き場 in (os.path.join(d, "data"), os.path.join(os.path.dirname(d), "data") if os.path.basename(d) == "output" else None):
            if データ置き場:
                v = フォルダの最新(データ置き場)
                if v:
                    候補.append(v)
        いつ, なに = max(候補, key=lambda v: v[0])

        ページ.append({
            "タイトル": t,
            "案件": 案件名(path),
            "URL": "/" + path,
            "日時": いつ.isoformat(),
            "内容": なに,
        })

    ページ.sort(key=lambda p: p["日時"], reverse=True)
    print(json.dumps({"作成日時": datetime.now(timezone.utc).isoformat(), "ページ": ページ}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
