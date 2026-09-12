---
name: SEO順位ウォッチ
description: クレーターグループ各サイトの既存記事を、Search Consoleの実測順位を見てサイトごとの週の上限まで改善し、14日後に実測で判定するループを回すスキル。「SEO順位ウォッチ」「順位見て」「順位どう？」「SEO改善して」「惜しい記事」などで起動する。週1でGitHub Actionsが自動実行しているので、手動で回すのは前倒しで見たいときや、自動実行が失敗したときだけでよい。
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
| `wp.py` | WordPress記事のタイトル・meta descriptionを確認・変更（`--site` でサイト指定、`--url` か `--id` で記事指定）。サイトごとの「触ってよい種類・description可否・自動可否」はファイル内の `サイト設定` |
| `指示.md` | 自動実行時にClaudeが読む指示書。**判断基準の本体はここ** |
| `data/順位履歴.json` | 測定結果（追記専用・過去は書き換えない） |
| `data/改善ログ.json` | 何をいつ直したか・判定結果・次回レビュー日 |
| `output/dashboard.html` | 閲覧用の1ページ（パスワード `view`）。上のタブで「いまの状況」と「この仕組みについて」（コーダー向けの説明）を切り替える。URL末尾に `#about` を付けると説明タブが直接開く |
| `output/概要.html` | 旧URLの互換用。`dashboard.html#about` に転送するだけ（2026-09-11に統合） |

## 自動実行

`.github/workflows/SEO順位ウォッチ.yml` が**毎週月曜7:00(JST)**に実行し、
順位取得 → レビュー判定 → サイトごとの上限まで改善 → コミット → LINE通知 まで自動で回る。
判断はワークフロー内でClaude Code（opus）が`指示.md`に従って行う。

手動で回したいときはGitHubのActionsから`workflow_dispatch`、
またはローカルで `python3 engine.py` を実行して`summary.txt`を読む。

## 絶対に守るルール

1. **週の本数はサイトごとの上限まで**（CHICS・YEARS週5本、APOLLOS週2本、CRATERは提案のみ最大2件。`engine.py` の `対象サイト` で管理）。上限は最大値で、事業につながる候補がなければ少なくてよい。
   **1つの記事で変えるのは1か所だけ**（タイトルと本文を同時に変えると、どちらが効いたか分からない）。別々の記事なら同じ週に複数直しても測定は混ざらない。
   （元ネタのプロンプトは「1回1キーワード」だったが、週1本では年50本にしかならず遅すぎるため、2026-09-11にケイスケ判断で変更）
2. **観察期間は14日。** 観察中のキーワードは次回レビュー日まで絶対に触らない。
   （元ネタのプロンプトは7日だが、Googleの反映に2〜4週かかるため誤判定を避けて延長した）
3. **自動で変更していいのはタイトルとmeta descriptionだけ。**（descriptionを書き換えられるのは years.design と apollos.jp。chics・craterはタイトルのみ）
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
- **crater.co.jpの実績（works）のタイトルは、実績一覧と詳細ページに「作品名」としてそのまま表示される。**
  検索向けに書き換えると作品名が変わってしまうので「提案のみ」にしている（wp.pyも `--approved` なしでは変更しない）。
  GitHubの `WP_KEYS_JSON` にもcraterはあえて入れていない（Actionsからは書き込めない）。
  承認後に反映するときは、このMacから `python3 wp.py --site crater.co.jp --url <URL> --title "..." --approved`。
- **Yoastの説明文（`_yoast_wpseo_metadesc`）をREST APIで書き換えられるのは years.design と apollos.jp だけ。**
  chics・craterはREST APIに項目が出ていないので、タイトルしか変えられない。
- **apollos.jpは、テーマ（`02_APOLLOS/wp-theme/apollos/functions.php` の `apollos_ai_seo_head()`）とYoastがdescription・OGPを二重に出していた。**
  2026-09-12にテーマ側を「Yoastが出しているタグは出さない」形に修正（トップ・固定ページではYoastがdescriptionと画像を出さないので、そこだけテーマが補う）。
  テーマの反映は手動（Actions「Deploy APOLLOS WP Theme」）。
  wp.py は `--desc` の前に公開ページのdescriptionタグを数え、2つ以上なら変更しない（重複が再発しても誤判定しない）。
- **認証情報の置き場所。** このMacは `~/.<chics|years|apollos|crater>-wp/credentials.json`（chmod 600・Git管理外）。
  GitHubは chics が `CHICS_WP_APP_PASSWORD`、years・apollos が `WP_KEYS_JSON`（ログイン名とパスワードをまとめたJSON）。
  **リポジトリ crater-inc/crater はPUBLIC**なので、ログイン名もワークフローに直書きしない。
- **WordPressの認証情報が見つからない週は、engine.py がそのサイトを自動で「鍵待ち」（測定のみ）にする。** Secretが未登録でも壊れない。
- **トップページと固定ページは、どのサイトでも自動では変えない。** engine.py の `対象URL` で候補から外し、wp.py でも投稿タイプで止めている。
- **WebFetchはmeta descriptionを拾い落とすことがある。**
  title/descriptionの現物確認は必ず `curl -sL <URL>` の生HTMLで行う。
- **Yoastがタイトル末尾に「 ｜ VI専門チームCHICS」を自動で足す。**
  タイトル自体にブランド名を入れると重複して長くなる。全角30字前後に収める。
- **観察中の判定はキーワードではなく記事単位。**
  「10周年ロゴ」と「10周年 ロゴ」のように、同じ記事が表記違いの別キーワードで候補に出る。
  観察中の記事は、どのキーワード経由でも次回レビュー日まで触らない。
- **スパム語での表示に注意。** crater.co.jpで2026年7〜8月に、トルコの風俗系スパム語（kocaeli escort等）で
  約8,000回表示された（ページ自体の改ざんは確認されず、外部スパムリンク由来と推定）。
  engine.py とダッシュボードはスパム語を候補から除外し、まとまって出たら【異常検知】として報告する。
  語のリストは `engine.py` と `output/dashboard.html` の `スパム語` の2か所。

## 対象サイトを増やすとき

1. Search Consoleで対象サイトのプロパティに
   `analytics-reader@crater-dashboard.iam.gserviceaccount.com` を「制限付き」で追加
2. `engine.py` の `対象サイト` と `output/dashboard.html` の `サイト一覧` の**両方**に追加（扱い・週の上限・候補条件を揃える）。説明タブの「対象サイトと本数」は `サイト一覧` から自動で表示される
3. WordPressなら `wp.py` の `サイト設定` にも追加し（触ってよい種類・description可否・自動可否）、アプリケーションパスワードを用意する
4. WordPress以外のサイトは `wp.py` が使えないので、更新手段を別途用意する

2026-09-12時点：6サイトを毎週測定。**自動改善は chics.top（週5本・タイトルのみ）・years.design（週5本・タイトルとdescription）・apollos.jp（週2本・タイトルとdescription）**。crater.co.jp は「提案のみ」（実績ページ・週最大2件）。
- years.design … 記事（`/info/<ID>/`）のみ。検索データが少なく、週5本に届かない週が多い見込み
- apollos.jp … 記事のみ（固定ページは不可）。13〜29位のものが中心で、タイトルより中身の改善が効く段階
- crater.co.jp … 実績ページ（WORKS 187本）は画像だけでテキストがほぼ無い。本命は、業種で語れる実績に短い説明を足すこと（本文なので承認が要る）。大手ブランド案件は検索では勝てないので狙わない
- birth.business … WordPressではない・まだ検索データなし
- acurry.jp … ECなので測定のみ
- heekes.jp … ブログも実績ページも無いので対象外

関連メモリ：[[MEMORY_SEO順位ウォッチ]] [[MEMORY_CHICS_LP計測]] [[MEMORY_CHICS記事量産]]
