# slide-builder

Claude Code でウェビナー・プレゼン用の HTML スライドを自動生成するスキルです。

---

## 全体像

```
ユーザー
  ↓ /slide-builder [テーマ・brief]
  ↓
① インテーク（brief 不足を確認）
  ↓
② 構成承認ドラフト（枚数・1メッセージ・レイアウト型を提示）
  ↓ OK
③ HTML/CSS/JS 生成
  ↓
④ 自動品質チェック（validator → スクリーンショット → 修正）
  ↓
slides/index.html ← ブラウザで開くだけで動くスライド
```

---

## インストール

```bash
git clone https://github.com/<your-repo>/slide-builder.git ~/.claude/skills/slide-builder
cd ~/.claude/skills/slide-builder
npm install   # validator（Playwright）の依存
```

Claude Code を再起動すると `/slide-builder` が使えます。

---

## 使い方

```
/slide-builder 営業提案書を作って
/slide-builder AI研修のウェビナースライドを20枚、スマートなデザインで
/slide-builder テーマ:新規事業提案 対象者:経営陣 目的:予算承認 持ち帰り:今期着手すべき
```

### 標準フロー

1. **インテーク** — テーマ・対象者・目的・持ち帰りを揃える
2. **構成承認** — 全体枚数・セクション・各ページの1メッセージ・推奨レイアウト型を提示
3. **承認後に生成** — HTML/CSS/JS を出力（承認前には書かない）
4. **品質チェック** — validator 自動実行 → 問題があれば即修正

`確認不要` / `すぐ生成` を明示した場合のみ、構成承認フェーズをスキップします。

---

## 出力ファイル

```
slides/
  index.html        ← ブラウザで開くだけで動くスライド
css/
  style.css         ← デザインシステム変数・共通スタイル
js/
  app.js            ← ナビゲーション・サイドバー・キーボード操作
  slides.js         ← スライドコンテンツ（1スライド = 1関数）
```

### slides.js の構造（1スライド = 1関数）

```js
// js/slides.js
// ⚠️ ES modules（export/import）は file:// では動かない。window グローバルを使う

// SLIDE 01: 表紙 | F5 | cover
function slide01Cover() {
  return `<section class="slide" data-section="cover" data-notes="トークスクリプト...">
    ...
  </section>`;
}

// SLIDE 02: 問題提起 | F2 | problem
function slide02Problem() {
  return `<section class="slide" data-section="problem" data-notes="...">
    ...
  </section>`;
}

window.slideFactories = [slide01Cover, slide02Problem, ...];
window.agendaItems = [{ id: 'cover', label: '表紙' }, ...];
```

`index.html` では slides.js → app.js の順で通常 `<script>` タグで読み込む（`type="module"` 禁止）:

```html
<script src="js/slides.js?v=1"></script>
<script src="js/app.js?v=1"></script>
```

**1スライド = 1関数**なので、特定のスライドだけ修正したい・別デッキに流用したいときに関数をコピーするだけで済みます。

---

## 機能

- キーボード（←→）またはクリックでスライド送り
- ☰ハンバーガーボタン → アジェンダサイドバー（オーバーレイ式）
- トークスクリプト表示パネル（`data-notes` 属性から自動生成）
- 全サイズが `cqw` 相対値なのでウィンドウ幅が変わってもレイアウト崩れなし
- 30枚超でも軽快に動く Lazy rendering（表示スライド + 前後1枚だけ DOM に展開）

---

## デザインシステム

### カラー変数（css/style.css で定義）

```css
:root {
  --c-base:   #FFFFFF;  /* 背景（70%）*/
  --c-main:   #1A1A1A;  /* 文字・図形（25%）*/
  --c-accent: #2563EB;  /* 強調・データポイント（5%）*/
}
```

テイストを変えるにはこの3色を差し替えるだけです。

### フォントサイズクラス

| クラス | 相当pt | 用途 |
|---|---|---|
| `slide-h1` / `slide-title` | 80pt | スライドタイトル |
| `slide-h2` | 60pt | 大見出し |
| `slide-h3` | 44pt | 小見出し |
| `slide-body` | 36pt | 本文（最小 24pt）|
| `slide-caption` | 28pt | 注釈・ラベル |

### スライドレイアウト型（F1〜F8）

| 型 | 名前 | 使う場面 |
|---|---|---|
| F1 | ステートメント | コアメッセージ・問いかけ |
| F2 | 図解+テキスト | プロセス・構造の視覚化 |
| F3 | 対比 | Before/After・A vs B |
| F4 | データビジュアル | グラフ・数値・統計 |
| F5 | イメージフル | 感情喚起・事例リアリティ |
| F6 | ステップ | 手順・How-to |
| F7 | 引用 | 権威引用・参加者の声 |
| F8 | ブリッジ | セクション切替 |

---

## カスタマイズ方法

### テイストを変える

`references/design-styles/` に10テイスト分のCSSファイルが用意されています。該当ファイルをコピーするだけで適用できます:

```bash
# 例: スタイリッシュを適用
cp references/design-styles/stylish.css css/style.css
```

| ファイル | テイスト | 用途 |
|---|---|---|
| `minimal.css` | ミニマル・シンプル | スタートアップ / プロダクト / LT |
| `stylish.css` | スタイリッシュ | テック / デザイン会社 / BtoB提案 |
| `futuristic.css` | 近未来 | AI / SaaS / 研究開発 / テックビジョン |
| `cute.css` | かわいい | 子ども向け / 教育 / ウェルネス / SNS |
| `friendly.css` | やさしい | 食品 / 教育 / 人材 / ESG |
| `fresh.css` | 爽やか | 医療 / 金融 / コーポレート（明るめ） |
| `pop.css` | ポップ | エンタメ / 食品 / 採用 / 若年層向け |
| `dynamic.css` | ダイナミック | ビジョン発表 / 変革宣言 / 大型数値 |
| `trust.css` | 信頼感 | IR / 決算説明 / 中期経営計画 |
| `luxury.css` | 高級感 | ラグジュアリー / ブランド / 高単価 |

配色・雰囲気を確認したい場合は `references/slide-taste-catalog.html` をブラウザで開いてください。全10テイストを同じレイアウトで並べて比較できます。

独自配色にしたい場合は、最も近いテイストのCSSをコピー後、以下の変数だけ差し替えます:

```css
:root {
  --c-base:   /* 背景色 */;
  --c-main:   /* テキスト・図形色 */;
  --c-accent: /* 強調色 */;
}
```

### 特定スライドを修正する

`js/slides.js` を開いて、対象の関数だけ編集します:

```js
// SLIDE 03: ソリューション | F2 | solution
export function slide03Solution() {
  return `<section class="slide" data-section="solution" data-notes="...">
    <!-- ここだけ編集すればよい -->
  </section>`;
}
```

### 別デッキにスライドを流用する

流用したいスライドの関数をコピーして、新しい `slides.js` の `slideFactories` に追加するだけです。

### スライドを追加・削除する

1. `slides.js` に関数を追加（または削除）
2. `slideFactories` 配列に追加（または削除）
3. `app.js` の `agendaItems` に対応エントリを追加（または削除）

---

## 品質チェック

```bash
node scripts/validate-slide-deck.mjs slides/index.html
```

以下を自動検査します:

| チェック項目 | 基準 |
|---|---|
| テキストはみ出し | スライド境界からのはみ出し検出 |
| 行頭禁則 | 助詞・句読点・閉じ括弧が行頭に出ていないか |
| 行末禁則 | 開き括弧・中点が行末に出ていないか |
| 1行文字数 | 役割別バジェット（見出し18文字、本文24文字など）|
| 最大行数 | 1テキストブロック5行以内 |
| 文字数密度 | 1スライド100文字以内 |
| コントラスト比 | WCAG AA（4.5:1以上） |
| プレースホルダー残存 | LAYOUT / PHOTO / LOREM IPSUM 等の除去確認 |

---

## ファイル構成

```
slide-builder/
  package.json                       ← validator 用依存（Playwright）
  SKILL.md                           ← スキル定義（Claude Code が自動読み込み）
  README.md                          ← このファイル
  references/
    slide-web-standards.md           ← HTML実装仕様（アーキテクチャ・UI仕様）
    slide-copy-fitting.md            ← 日本語コピーの改行・短文化ルール
    slide-design-principles.md       ← 普遍的デザイン原則（CRAP・余白・ビジュアルファースト）
    slide-layout-catalog.html        ← レイアウトテンプレート集（56パターン）
    slide-diagram-catalog.html       ← 図解・グラフテンプレート集（D01〜D30）
  scripts/
    validate-slide-deck.mjs          ← Playwright 品質検査スクリプト
```

### 参照ファイルの役割

| ファイル | いつ参照するか |
|---|---|
| `slide-web-standards.md` | HTML生成時に必読。アーキテクチャ・UI仕様の全詳細 |
| `slide-copy-fitting.md` | 見出し・本文の文字数調整・改行位置の判断時 |
| `slide-design-principles.md` | 全スライド制作で必読。デザイン原則・ビジュアルファースト |
| `slide-layout-catalog.html` | レイアウト選定時にコピー元として使う（56パターン） |
| `slide-diagram-catalog.html` | F2/F4型スライドの図解コピー元（D01〜D30）|

---

## ビジュアルファースト原則

良いスライドは「文字の流し込み」ではなく「ビジュアルコミュニケーション」で設計します。

各スライドを設計するとき、必ずこの順で考えます:

1. **このメッセージを図解・グラフ・表・写真で伝えられないか？** → 伝えられるならそれを主役にする
2. 図解を選んだら `slide-diagram-catalog.html`（D01〜D30）から最適パターンをコピーする
3. テキストは「主役を補足する最小限」に絞る

**デッキ全体の目標比率**:

| スライド種別 | 目標 |
|---|---|
| 図解・フロー・マトリクス・ベン図が主役 | 30%以上 |
| グラフ・チャート・数値が主役 | 15%以上 |
| 写真・キービジュアルが主役 | 10%以上 |
| テキスト主体（箇条書き・ステートメント） | 45%以下 |

---

## 動作要件

- [Claude Code](https://claude.ai/code)（CLI / VS Code 拡張 / デスクトップアプリ）
- Chrome などのモダンブラウザ（生成したスライドの表示・検証用）
- Node.js（`validate-slide-deck.mjs` を使う場合）
