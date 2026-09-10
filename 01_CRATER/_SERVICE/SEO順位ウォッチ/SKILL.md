---
name: SEO順位ウォッチ
description: chics.top等の既存記事を、Search Consoleの実測順位を見て1回1キーワードだけ改善し、14日後に実測で判定するループを回すスキル。「SEO順位ウォッチ」「順位見て」「順位どう？」「SEO改善して」「惜しい記事」などで起動する。週1でGitHub Actionsが自動実行しているので、手動で回すのは前倒しで見たいときや、自動実行が失敗したときだけでよい。
---

# SEO順位ウォッチ

作りっぱなしだった既存記事を、実測順位を見て1本ずつ育てるループ。
**新しく作るのではなく、既にあるものを拾って伸ばす**のがこのスキルの役割。

## 置き場所

`01_CRATER/_SERVICE/SEO順位ウォッチ/`

| ファイル | 役割 |
|---|---|
| `engine.py` | 週1の本体。順位取得→レビュー判定→候補洗い出し→`summary.txt`出力 |
| `gsc.py` | Search Consoleから順位・表示回数・クリックを取得 |
| `wp.py` | WordPress記事のタイトル等を更新 |
| `指示.md` | 自動実行時にClaudeが読む指示書。**判断基準の本体はここ** |
| `data/順位履歴.json` | 測定結果（追記専用・過去は書き換えない） |
| `data/改善ログ.json` | 何をいつ直したか・判定結果・次回レビュー日 |
| `output/dashboard.html` | 履歴の閲覧用（パスワード `view`） |

## 自動実行

`.github/workflows/SEO順位ウォッチ.yml` が**毎週月曜7:00(JST)**に実行し、
順位取得 → レビュー判定 → 1本改善 → コミット → LINE通知 まで自動で回る。
判断はワークフロー内でClaude Code（opus）が`指示.md`に従って行う。

手動で回したいときはGitHubのActionsから`workflow_dispatch`、
またはローカルで `python3 engine.py` を実行して`summary.txt`を読む。

## 絶対に守るルール

1. **1回に改善するのは1キーワードだけ。** まとめてやると何が効いたか分からなくなる。
2. **観察期間は14日。** 観察中のキーワードは次回レビュー日まで絶対に触らない。
   （元ネタのプロンプトは7日だが、Googleの反映に2〜4週かかるため誤判定を避けて延長した）
3. **自動で変更していいのはタイトルとmeta descriptionだけ。**
   本文・見出し・URL・内部リンクの変更はケイスケさんの承認が要る。
   ここを自動にするとRISING社と同じ「AIが薄い文章を勝手に量産」になる。
4. **順位が取れても事業にならないキーワードは追わない。**
   「企業ロゴ一覧」等の他社ロゴ目当て、「〜になるには」等のデザイナー志望者向けは、
   1位を取っても受注ゼロ。SERPを見て「上位は誰向けのページか」を必ず確認する。
5. **改善対象がなければ何もしない。** 無理に対象を作らない。
6. **効果を予測で断定しない。** やったことを報告し、判定は次回の実測で行う。
7. `data/順位履歴.json` の過去データは書き換えない。追記のみ。

## つまずきやすい点（実際に踏んだもの）

- **GCPプロジェクト `crater-dashboard` の持ち主は `crater.analytics@gmail.com`。**
  kskakari@gmail.com で開くと別プロジェクトに勝手にフォールバックして
  「有効化したのに繋がらない」事故になる。GCPを触るときは必ずアカウントを確認する。
- **Search Consoleはドメインプロパティ（`chics.top`）を使う。**
  `https://chics.top/` のURLプレフィックス版は一部しか拾えない。
- **chics.topの記事はカスタム投稿タイプ `news`。** REST APIは `/wp-json/wp/v2/news/<ID>`。
  `posts` で叩くと404になる。
- **chics.topのWP管理画面URLは変更されている**（`/wp-admin/`は403）。
  ログインURLとアプリケーションパスワードは `~/.chics-wp/credentials.json`（chmod 600・Git管理外）。
- **WebFetchはmeta descriptionを拾い落とすことがある。**
  title/descriptionの現物確認は必ず `curl -sL <URL>` の生HTMLで行う。
- **Yoastがタイトル末尾に「 ｜ VI専門チームCHICS」を自動で足す。**
  タイトル自体にブランド名を入れると重複して長くなる。全角30字前後に収める。

## 対象サイトを増やすとき

1. Search Consoleで対象サイトのプロパティに
   `analytics-reader@crater-dashboard.iam.gserviceaccount.com` を「制限付き」で追加
2. `engine.py` の `対象サイト` リストに追加
3. WordPress以外のサイトは `wp.py` が使えないので、更新手段を別途用意する

現時点でループに乗せる価値があるのは chics.top と years.design。
APOLLOS/BIRTHは記事が薄く改善対象がない。A CURRYはECなので順位より購入率の話になる。

関連メモリ：[[MEMORY_SEO順位ウォッチ]] [[MEMORY_CHICS_LP計測]] [[MEMORY_CHICS記事量産]]
