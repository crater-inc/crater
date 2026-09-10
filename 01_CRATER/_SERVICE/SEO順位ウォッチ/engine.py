#!/usr/bin/env python3
"""週1で回るSEO順位ウォッチの本体。

やること:
  1. 全対象サイトの順位をSearch Consoleから取得して順位履歴.jsonに追記
  2. 観察期間が明けた改善の効果を実測で判定する
  3. 「改善」モードのサイトについて、次に改善すべき候補を洗い出す
  4. スパム語での表示など、異常を検知する
  5. Claudeに渡すサマリー（summary.txt）を書き出す

判断そのもの（どれを選ぶか・どう直すか）はClaudeが行う。ここは材料を揃えるだけ。
"""
import datetime
import json
import os
import re
import subprocess
import sys

ここ = os.path.dirname(os.path.abspath(__file__))
データ置き場 = os.path.join(ここ, "data")
順位履歴ファイル = os.path.join(データ置き場, "順位履歴.json")
改善ログファイル = os.path.join(データ置き場, "改善ログ.json")
サマリーファイル = os.path.join(ここ, "summary.txt")

# サイトごとの扱い
#   改善   … 測定して、候補を選び、タイトル等を自動で直す
#   測定のみ … 順位を記録して異常を見るだけ。記事には触らない
対象サイト = {
    "chics.top": "改善",
    "years.design": "測定のみ",      # WPのアプリケーションパスワードが揃ったら「改善」へ
    "crater.co.jp": "測定のみ",      # 会社サイト。実績ページの改善は人の確認を挟む
    "apollos.jp": "測定のみ",        # 記事が溜まったら「改善」を検討
    "birth.business": "測定のみ",
    "acurry.jp": "測定のみ",         # EC。順位より購入率の話なので測定だけ
}

# 検索順位ごとの平均的なクリック率（％）。これを大きく下回る＝タイトルで選ばれていない可能性が高い
期待CTR = {1: 28.0, 2: 15.0, 3: 11.0, 4: 8.0, 5: 6.0,
           6: 4.5, 7: 3.5, 8: 3.0, 9: 2.5, 10: 2.2}

# スパム・無関係な検索語。候補から外し、まとまって出たら異常として知らせる
スパム語 = re.compile(
    r"escort|eskort|escoet|eacort|bayan|casino|slot|viagra|cialis|porn|xxx|"
    r"kocaeli|izmit|derince|kartepe|gebze|kandıra|maşukiye",
    re.I,
)
異常の目安 = 50   # スパム語の表示回数がこれを超えたら報告する


def 今日():
    return datetime.date.today()


def 読む(パス, 初期値):
    if not os.path.exists(パス):
        return 初期値
    with open(パス, encoding="utf-8") as f:
        return json.load(f)


def 書く(パス, 中身):
    with open(パス, "w", encoding="utf-8") as f:
        json.dump(中身, f, ensure_ascii=False, indent=2)


def スパムか(キーワード):
    return bool(スパム語.search(キーワード))


def 順位を取得する(サイト, 日数):
    """gsc.pyを呼んで最新の順位を取り込む。"""
    cmd = [sys.executable, os.path.join(ここ, "gsc.py"),
           "--site", サイト, "--days", str(日数), "--append"]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"[警告] {サイト} の取得に失敗しました:\n{r.stdout}\n{r.stderr}")
        return False
    return True


def サイトの測定(サイト):
    履歴 = 読む(順位履歴ファイル, {"測定": []})
    return [m for m in 履歴["測定"] if m["サイト"] == サイト]


def 最新の結果(サイト):
    該当 = サイトの測定(サイト)
    return 該当[-1]["結果"] if 該当 else []


def 前回の結果(サイト):
    """今回より前の測定結果（比較用）。"""
    該当 = サイトの測定(サイト)
    return 該当[-2]["結果"] if len(該当) >= 2 else []


def 探す(結果, キーワード, ページ=None):
    for r in 結果:
        if r["キーワード"] == キーワード and (ページ is None or r["ページ"] == ページ):
            return r
    return None


def 期待との差(r):
    """順位から期待されるCTRに対して、実際どれだけ下回っているか（％ポイント）。"""
    順位 = int(round(r["順位"]))
    if 順位 not in 期待CTR:
        return 0.0
    return round(期待CTR[順位] - r["CTR"], 2)


def レビューする(ログ, 行く先):
    """観察期間が明けた改善を実測で判定する。"""
    判定結果 = []
    for 改善 in ログ["改善"]:
        if 改善["状態"] != "観察中":
            continue
        if 改善["次回レビュー日"] > 今日().isoformat():
            continue

        最新 = 探す(行く先.get(改善["サイト"], []), 改善["キーワード"], 改善["対象ページ"])
        直近 = 改善["施策"][-1]
        if not 最新:
            改善["状態"] = "要確認"
            判定結果.append({
                "キーワード": 改善["キーワード"],
                "判定": "データなし",
                "詳細": "今回の測定に出てこなかった。表示回数が落ちた可能性があるため要確認。",
            })
            continue

        前順位, 後順位 = 直近["実施時の順位"], 最新["順位"]
        前CTR, 後CTR = 直近["実施時のCTR"], 最新["CTR"]
        順位差 = round(前順位 - 後順位, 1)   # プラス＝順位が上がった

        if 後順位 <= 1.5:
            状態, 判定 = "達成", "1位（達成）"
        elif 順位差 >= 0.5 or 後CTR > 前CTR:
            状態, 判定 = "改善候補", "効果あり（まだ1位ではない）"
        elif 順位差 <= -1.0:
            状態, 判定 = "要ロールバック", "悪化（元に戻すことを検討）"
        else:
            状態, 判定 = "改善候補", "変化なし（次は別の方法を試す）"

        改善["状態"] = 状態
        改善.setdefault("判定履歴", []).append({
            "日付": 今日().isoformat(),
            "判定": 判定,
            "順位": f"{前順位} → {後順位}",
            "CTR": f"{前CTR}% → {後CTR}%",
        })
        判定結果.append({
            "キーワード": 改善["キーワード"],
            "対象ページ": 改善["対象ページ"],
            "判定": 判定,
            "順位": f"{前順位} → {後順位}",
            "CTR": f"{前CTR}% → {後CTR}%",
            "前回やったこと": 直近["実施した改善"],
        })
    return 判定結果


def 候補を洗い出す(サイト, ログ, 上限=12):
    """次に改善すべきキーワードの候補を、機械的な基準で並べる。"""
    観察中 = {(c["サイト"], c["キーワード"]) for c in ログ["改善"] if c["状態"] == "観察中"}
    達成 = {(c["サイト"], c["キーワード"]) for c in ログ["改善"] if c["状態"] == "達成"}
    # 同じ記事が表記違いの別キーワード（例：「10周年ロゴ」と「10周年 ロゴ」）で出てくるため、
    # 観察中かどうかは記事（ページ）単位でも判定する
    観察中ページ = {(c["サイト"], c["対象ページ"]) for c in ログ["改善"] if c["状態"] == "観察中"}

    候補 = []
    for r in 最新の結果(サイト):
        鍵 = (サイト, r["キーワード"])
        if 鍵 in 観察中 or 鍵 in 達成:
            continue
        if (サイト, r["ページ"]) in 観察中ページ:
            continue
        if スパムか(r["キーワード"]):
            continue
        if r["表示回数"] < 20 or r["順位"] > 20:
            continue
        差 = 期待との差(r)
        # 表示回数が多く、期待CTRとの乖離が大きいものほど「惜しい」
        点数 = r["表示回数"] * max(差, 0.1)
        候補.append({**r, "期待CTRとの差": 差, "点数": round(点数)})

    候補.sort(key=lambda c: -c["点数"])
    return 候補[:上限]


def 変動を出す(サイト):
    """前回測定からの大きな順位変動を拾う。"""
    今 = {(r["キーワード"], r["ページ"]): r for r in 最新の結果(サイト)}
    前 = {(r["キーワード"], r["ページ"]): r for r in 前回の結果(サイト)}
    動き = []
    for 鍵, r in 今.items():
        if 鍵 not in 前 or スパムか(r["キーワード"]):
            continue
        差 = round(前[鍵]["順位"] - r["順位"], 1)
        if abs(差) >= 3.0 and r["表示回数"] >= 20:
            動き.append({
                "キーワード": r["キーワード"],
                "変化": f"{前[鍵]['順位']} → {r['順位']}",
                "向き": "上昇" if 差 > 0 else "下降",
                "幅": abs(差),
            })
    動き.sort(key=lambda x: -x["幅"])
    return 動き[:8]


def 異常を探す(サイト):
    """スパム語での表示がまとまって出ていないかを見る。"""
    該当 = [r for r in 最新の結果(サイト) if スパムか(r["キーワード"])]
    合計 = sum(r["表示回数"] for r in 該当)
    if 合計 < 異常の目安:
        return None
    ページ別 = {}
    for r in 該当:
        ページ別[r["ページ"]] = ページ別.get(r["ページ"], 0) + r["表示回数"]
    return {
        "合計表示": 合計,
        "語の例": [r["キーワード"] for r in sorted(該当, key=lambda r: -r["表示回数"])[:3]],
        "ページ": sorted(ページ別.items(), key=lambda x: -x[1])[:3],
    }


def サマリーを書く(判定結果, 候補群, 変動群, 異常群):
    改善サイト = [s for s, m in 対象サイト.items() if m == "改善"]
    行 = [f"■ SEO順位ウォッチ {今日().isoformat()}", "",
          f"【改善してよいサイト】{', '.join(改善サイト)}（それ以外は測定のみ。記事に触らないこと）", ""]

    行.append("【観察期間が明けた改善の実測結果】")
    if 判定結果:
        for j in 判定結果:
            行.append(f"・{j['キーワード']}: {j['判定']}")
            if "順位" in j:
                行.append(f"    順位 {j['順位']} / CTR {j['CTR']}")
                行.append(f"    前回やったこと: {j['前回やったこと']}")
    else:
        行.append("・今回レビュー対象の改善はなし（観察期間中）")
    行.append("")

    異常あり = {s: a for s, a in 異常群.items() if a}
    行.append("【異常検知（スパム語での表示）】")
    if 異常あり:
        for s, a in 異常あり.items():
            行.append(f"・{s}: スパム語で{a['合計表示']}回表示（例: {' / '.join(a['語の例'])}）")
            for p, n in a["ページ"]:
                行.append(f"    {n}回 → {p}")
    else:
        行.append("・なし")
    行.append("")

    for サイト, 変動 in 変動群.items():
        if not 変動:
            continue
        行.append(f"【{サイト} 前回からの大きな順位変動】")
        for m in 変動:
            行.append(f"・{m['向き']} {m['キーワード']}: {m['変化']}")
        行.append("")

    for サイト, 候補 in 候補群.items():
        行.append(f"【{サイト} 次に改善する候補（惜しい順）】")
        if not 候補:
            行.append("・候補なし（無理に対象を作らないこと）")
        for c in 候補:
            行.append(
                f"・{c['キーワード']}｜{c['順位']}位 表示{c['表示回数']} "
                f"クリック{c['クリック数']} CTR{c['CTR']}% "
                f"(順位相応より{c['期待CTRとの差']}ポイント低い)"
            )
            行.append(f"    {c['ページ']}")
        行.append("")

    文 = "\n".join(行)
    with open(サマリーファイル, "w", encoding="utf-8") as f:
        f.write(文)
    return 文


def main():
    ログ = 読む(改善ログファイル, {"観察期間の日数": 14, "改善": []})

    行く先 = {}
    for サイト in 対象サイト:
        if 順位を取得する(サイト, 28):
            行く先[サイト] = 最新の結果(サイト)

    判定結果 = レビューする(ログ, 行く先)
    書く(改善ログファイル, ログ)

    候補群 = {s: 候補を洗い出す(s, ログ) for s in 行く先 if 対象サイト[s] == "改善"}
    変動群 = {s: 変動を出す(s) for s in 行く先}
    異常群 = {s: 異常を探す(s) for s in 行く先}

    print(サマリーを書く(判定結果, 候補群, 変動群, 異常群))


if __name__ == "__main__":
    main()
