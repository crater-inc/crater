# Slide Web Standards

## Table Of Contents

- When To Read
- Output Modes
- Viewport And Aspect Ratio
- Safe Area
- Alignment
- Typography
- Copy Fitting
- Color
- Content Density
- Layout Patterns
- Visual Elements
- CRAP Principles
- Slide Types
- Motion And Interaction
- Responsive Scaling
- Code Quality
- Validation
- Final Checklist

## When To Read

- Read this file whenever you generate HTML-mode slides.
- Read it before outputting `single-file mode`.
- Use this as the detailed standard for slide-style websites. Keep `SKILL.md` focused on workflow and mode selection.
- When the deck is in Japanese, read `references/slide-copy-fitting.md` before inserting manual line breaks.

## Output Modes

### Multi-file Mode

Default mode.

```text
slides/
├── index.html
├── css/style.css
├── js/app.js
├── js/slides.js
└── assets/
```

- Prefer this mode for maintainability.
- Use when the deck will be edited later.
- Use when the user asks for a seminar deck, webinar site, or reusable slide website.

### Single-file Mode

Use only when the user explicitly asks for:

- `single html`
- `1ファイル`
- `コピペ用`
- `単体配布`
- `一枚のHTML`

Rules:

- Output a single HTML file with embedded CSS and JS.
- Use semantic HTML5.
- Each slide is a `<section class="slide">`.
- Include navigation, slide counter or progress bar, and responsive scaling.
- Do not force single-file mode by default.

## Viewport And Aspect Ratio

- Every slide must maintain a `16:9` aspect ratio.
- Base resolution is `1920 x 1080` logical pixels.
- Center the slide area both horizontally and vertically.
- The outer browser background must match `var(--c-base)` or another light neutral to avoid black flash during opacity transitions.

Recommended CSS baseline:

```css
.slide-stage {
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  background: var(--c-base);
}

.slide {
  width: 100vw;
  height: 100vh;
  max-width: calc(100vh * 16 / 9);
  max-height: calc(100vw * 9 / 16);
  margin: auto;
  position: relative;
  overflow: hidden;
}
```

## Safe Area

- Apply uniform inner padding on all sides.
- Safe area is `80px` on a `1920px`-wide slide, equivalent to about `4.2cqw`.
- Nothing important touches the edges.
- Use wider horizontal padding than vertical padding for content-heavy business decks.

Recommended content wrapper:

```css
.slide-content {
  padding: 4.2cqw 7cqw;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
```

## Grid System

すべての要素配置は **12カラムグリッド** を基準にする。

```css
.slide-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2cqw;
  padding: 4.2cqw 7cqw;
  box-sizing: border-box;
}
```

| カラム数 | 用途 |
|---|---|
| 12 | 全幅（表紙・ステートメント） |
| 8 / 4 | 左右分割（テキスト左＋図右、2:1比） |
| 6 / 6 | 均等2カラム |
| 4 / 4 / 4 | 均等3カラム |
| 3 / 3 / 3 / 3 | 均等4カラム |

- すべてのオブジェクトはカラム境界線にスナップさせる
- `grid-column: span N` で幅を指定し、任意の中途半端なインデントは禁止
- 揃え方は **中央揃え** または **左揃え** のみ。混在させない

## Alignment

- Center the content block as a whole inside the safe area.
- Left-align text inside the content block when readability matters.
- Title slides may center everything.
- Content slides should usually center the block and left-align text within it.
- Do not mix center and left alignment arbitrarily on the same slide.

## Typography

- Use `1 primary font family + fallbacks`.
- Default recommendation: `"Noto Sans JP", "Inter", sans-serif`.
- Load fonts via Google Fonts only when needed.
- Create hierarchy with size and weight, not with many font families.
- **Tailwindの固定テキストサイズ（text-xl等）はスライド内で使用禁止**。必ずcqwで指定する。
- Use the same class scale in generated decks and in `slide-layout-catalog.html`. Do not redefine these sizes per deck.

### タイポグラフィ倍率体系

1書体に限定し、以下の**倍率スケール**で階層を構築する。pt値は印刷・参照用の参考値（96dpi換算）。

| 役割 | 倍率（Base比） | pt参考値 | cqwクラス |
|---|---:|---:|---|
| 本文 Base | × 1.0 | 36pt | `slide-body` |
| 小見出し | × 1.2 | 44pt | `slide-h3` / `slide-title` |
| 見出し（黄金比） | × 1.6 | 60pt | `slide-h2` |
| スライドタイトル | × 2.2 | 80pt | `slide-h1` |
| 表紙主張文 | × 3.0+ | 110pt+ | `slide-hero` |

- この倍率から逸脱した中間サイズを作らない
- Baseから逆算すると `slide-body = 1.6cqw`（1920px幅基準）

### フォントサイズ（cqw基準）

スライド内の文字サイズはすべて以下のカスタムクラスで統一する（1920px幅基準）:

| クラス名 | cqw値 | 用途 | weight |
|---|---:|---|---:|
| `slide-hero` | `7.2cqw` | 表紙・中表紙の主張文 | 900 |
| `slide-h1` | `4.8cqw` | 強い主張の見出し | 700 |
| `slide-h2` | `3.2cqw` | スライドタイトル | 700 |
| `slide-h3` | `2.2cqw` | 小見出し・サブタイトル | 600 |
| `slide-title` | `2cqw` | リード文・補助見出し | 400 |
| `slide-body` | `1.6cqw` | 本文・箇条書き | 400 |
| `slide-caption` | `1.1cqw` | 注記・ラベル・日付 | 300 |
| `slide-micro` | `0.9cqw` | 補助ラベル・脚注 | 300 |
| `slide-number` | `9.6cqw` | 統計数値・big-numberスライド | 900 |

**ルール:**
- この9段階以外のフォントサイズは作らない（スタイルファイルで明示許可されたものを除く）
- `slide-number` は数値本体のみ。単位ラベルは `slide-body` で添える
- フォントサイズで階層を作る。色や装飾で代替しない
- タイトルは原則2行まで。3行目に落ちるならコピー短文化またはレイアウト変更を優先する

### 行間・字間

- タイトル系（hero〜h3）: `line-height: 1.15〜1.25`
- 本文・箇条書き: `line-height: 1.6`（固定。1.55〜1.7の範囲で最もバランスが良い）
- 日本語本文: `letter-spacing: 0.02em`（日本語組版の標準。0.05emは詰まり感がなくなりすぎる）
- ラベル・キャプション・英数字: `letter-spacing: 0.05em`

### Text Wrap Baseline

```css
:lang(ja) {
  line-break: strict;
}

.slide-hero,
.slide-h1,
.slide-h2,
.slide-h3 {
  word-break: normal;
  overflow-wrap: normal;
  text-wrap: balance;
  line-break: strict;
}

.slide-title,
.slide-body,
.slide-caption,
.slide-micro,
li,
blockquote {
  word-break: normal;
  overflow-wrap: normal;
  text-wrap: pretty;
  line-break: strict;
}

.break-token {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.nowrap-label {
  white-space: nowrap;
}
```

- `word-break: keep-all` を日本語の本文・見出し全体に使わない。行送り不能になりやすい
- `white-space: nowrap` は短いバッジ、数値単位、日付などに限定する
- 英数字やURLなど長いトークンだけを折りたい場合は `.break-token` を使う

## Copy Fitting

- Copy first, layout second. 改行は最後に入れる
- 手動改行は `references/slide-copy-fitting.md` の文字数予算と禁則ルールに従う
- 改行位置が不自然なら、**フォント縮小より先に** コピー短文化、レイアウト変更、カラム幅調整で解決する

### テキスト行幅

- 本文テキストブロックは `max-width: 80cqw`（全幅に広げない）
- 左右分割レイアウトの各カラム内テキストは `max-width: 100%`（カラム幅で自動制限）
- 日本語は **本文1行18〜24文字、見出し1行12〜18文字**を目安にする
- `left-right` レイアウトの強調文は **1行8〜10文字** を超えたら body ブロックへ落とす
- 改行は意味の切れ目で入れる。助詞、句読点、単位、括弧閉じを行頭に置かない
- Prefer bold for emphasis instead of changing typefaces

## Color

- Use `3 core colors` at most.
- Define them as CSS custom properties.
- Meet `WCAG AA` contrast ratio (`4.5:1` or higher).
- Opacity variations are allowed.
- Do not introduce a fourth distinct hue unless functionally required.

Recommended structure:

```css
:root {
  --c-primary: #0a1628;
  --c-secondary: #3b82f6;
  --c-bg: #f8fafc;
  --c-text: #0f172a;
}
```

Topic-based defaults:

- Tech / AI: deep navy + electric blue + off-white
- Nature / Eco: forest green + warm beige + off-white
- Business: charcoal + accent blue + light gray
- Creative: bold primary + one accent + neutral
- Medical / Health: clean blue + soft green + white

Always derive from the user's theme or the target brand.

## Content Density

- `1 slide = 1 message`
- **最大文字数: 1枚あたり100文字以内**（タイトル・本文・箇条書きの合計）
- **1行の長さ: 25文字以内**（日本語。超える場合は改行）
- **最大行数: 5行まで**（タイトル含む全テキスト行の合計）
- 情報過多の場合はスライドを分割する
- Prefer visuals over text.
- Lists should stay within `4 items`.
- Do not write paragraphs on slides.

## Layout Patterns

全レイアウトの実装例は `references/slide-layout-catalog.html` を参照。ブラウザで開けばビジュアル確認できる。

### 構造スライド
- `cover` — 表紙（タイトル+登壇者+日付）
- `toc` — 目次（アジェンダ一覧+時間）
- `section` — 中表紙・セクション区切り（ダーク/アクセント背景）
- `closing` — 裏表紙（Thank You+連絡先）

### コンテンツスライド
- `center` — 中央1メッセージ（メッセージ、まとめ）
- `left-right` — 左右分割（テキスト+画像/図）
- `top-bottom` — 上下分割（見出し+コンテンツ領域）
- `split-2` — 2カラム均等
- `split-3` — 3カラム均等
- `split-4` — 4カラムアイコングリッド
- `quote` — 引用（大引用符+発言者）
- `big-number` — 大数字・統計（3列数値）
- `self-intro` — 自己紹介（写真+経歴）
- `team` — メンバー紹介（4人グリッド）
- `testimonial` — お客様の声（3列カード）
- `case-study` — 事例紹介（ロゴ+概要+成果）
- `pricing` — 料金プラン（3列カード）
- `qa` — Q&A
- `comparison` — 競合比較テーブル
- `cta` — CTA（なぜ今/次のステップ）

### 図解スライド
- `table` — テーブル
- `flow-h` — 横フロー（ステップ）
- `flow-v` — 縦フロー（タイムライン/沿革）
- `pyramid` — ピラミッド
- `cycle` — サイクル（PDCA等）
- `matrix` — 2x2マトリクス
- `before-after` — ビフォーアフター
- `ranking` — ランキング
- `bullets-v` — 箇条書き（縦）
- `bullets-h` — 箇条書き（横カード）
- `steps` — ステップ・階段
- `bar-chart` — 棒グラフ
- `gantt` — ガントチャート
- `venn` — ベン図

### 写真スライド
- `photo-full` — 全面写真+オーバーレイ
- `photo-bottom-bar` — 全面写真+下部テキストバー
- `photo-left` — 半面写真左+テキスト右
- `photo-right` — テキスト左+半面写真右
- `photo-cards` — カード内写真（3列）
- `photo-top-band` — 上部帯写真+下部テキスト
- `photo-blur-card` — 背景ぼかし+前面カード
- `photo-grid` — グリッドギャラリー（メイン+サブ）

Utility examples:

```css
.layout-1col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.layout-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.layout-3col {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

.layout-2row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
}
```

## Visual Elements

- Prefer visuals over text on content slides.
- Use inline SVG for icons, arrows, diagrams, process flows, and simple charts.
- Do not rely on external image URLs.
- Local assets are allowed when the user already has them.
- If imagery is not available, use geometric placeholders or SVG blocks.
- Keep all visuals inside the same 3-color system.

## CRAP Principles

### Contrast

- Title vs body should differ clearly.
- Highlight key words with color or weight.
- Large numbers should be `3x to 5x` the body size.

### Repetition

- Reuse the same grid, margin, spacing rhythm, title placement, and accent treatment.
- Repeat a small number of visual motifs.

### Alignment

- Use Grid or Flexbox.
- Align elements to shared edges or center lines.
- Avoid approximate spacing with random margins.

### Proximity

- Keep related items close.
- Give unrelated items larger separation.
- spacing hierarchy → 「余白・スペーシング」セクション参照（cqw基準）

## ボーダー仕様

ドロップシャドウ禁止の代替として `border` で要素を区切る。

| 用途 | 指定値 | pt換算参考 |
|---|---|---|
| カード・セル外枠（通常） | `border: 0.1cqw solid rgba(0,0,0,0.12)` | ≈ 2pt |
| カード・セル外枠（強調） | `border: 0.2cqw solid var(--c-accent)` | ≈ 4pt |
| 区切り線（水平） | `border-top: 0.1cqw solid rgba(0,0,0,0.1)` | ≈ 2pt |
| アクセントバー（左） | `border-left: 0.3cqw solid var(--c-accent)` | ≈ 6pt（例外） |

- **border-width は 0.1cqw（≈2pt）または 0.2cqw（≈4pt）の2種のみ**。それ以外は使わない（アクセントバーの太い左線は除く）
- **border-radius: 0.8cqw（≈16px at 1920px）または 0 のみ**。中途半端な値（0.4cqw, 1cqw等）を作らない
- `border-color`に直接HEXを書かない。CSS変数 or rgba透明度で統一

## グラフ・データビジュアル

- **使用色は最大3色**: `--c-main`（背景・軸）/ `--c-accent`（注目データ）/ `--c-base`（補助）のみ
- 強調したいデータ系列のみアクセントカラーを当て、それ以外は `--c-main` の低透明度（opacity: 0.25〜0.4）
- グラデーション禁止（単色 or 2値のみ）
- グリッド線は `rgba(0,0,0,0.08)` の細線（0.05cqw）

## アイコン

- サイズは参照する本文クラスの **1.5〜2倍** を目安
  - 本文（slide-body: 1.6cqw）に添えるアイコン: `2.5〜3cqw`
  - 小見出し（slide-h3: 2cqw）に添えるアイコン: `3〜4cqw`
- アイコンのみのグリッドスライド: `6〜8cqw`
- SVGアイコンは `fill: currentColor` にして CSS変数で色を制御する

## Slide Types

Use these when appropriate:

1. Title slide
2. Section divider
3. Content + visual
4. Icon grid
5. Big number / statistic
6. Quote
7. Process / flow
8. Comparison
9. Full-image emphasis
10. Closing / CTA

## Motion And Interaction

- Transitions should be subtle.
- Use fade or short slide transitions within `300ms`.
- Entrance motion should stay under `500ms`.
- Respect `prefers-reduced-motion`.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

Interaction baseline:

- Left / right arrow keys
- Click or tap to advance
- Swipe on touch devices
- `f` key for fullscreen
- Slide counter such as `3 / 12`
- Optional progress bar

## Responsive Scaling

- Preserve `16:9` while fitting the viewport.
- **CSS Container Query Units (`cqw`) を使った完全相対値スケーリングを推奨する。JS不要。**

### cqw スケーリング（推奨）

`.slide` に `container-type: inline-size` を設定し、スライド内の全サイズを `cqw`（コンテナ幅の1%）で指定する。画面幅が変わっても全要素が比例してスケールし、レイアウトが崩れない。

```css
.slide {
  container-type: inline-size;
}
```

**変換ルール（1920px幅基準）:**
- フォントサイズ: `rem` の clamp → 純粋な `cqw` 値に（例: `clamp(2.8rem, 5.8cqw, 5.4rem)` → `5.8cqw`）
- gap / padding / margin: `rem` → `cqw`（例: `2.5rem` → `2.5cqw`）
- border-radius: `px` → `cqw`（例: `12px` → `0.6cqw`）
- border-width: `px` → `cqw`（例: `3px` → `0.15cqw`）
- アニメーション translateY: `px` → `cqw`（例: `24px` → `1.2cqw`）
- 影は変換しない。`box-shadow` は原則使わず、境界は `border`, `background`, `outline` で作る

**cqw にしないもの（px のまま）:**
- UI オーバーレイ（サイドバー・ステータスバー・メニューボタン・台本パネル）はビューポート固定要素なのでスライドコンテナの外。`px` のまま
- `border: 1px solid` の極細線はそのまま（0.05cqw だと消える場合がある）

**実績:** AI未来会議スライド（260324）で全面適用。どの画面幅でもレイアウト崩れゼロ。

### JS-based scaling（フォールバック）

cqw非対応環境のみ。ルートフォントサイズをスケールする方式。

```js
function scaleSlides() {
  const slide = document.querySelector('.slide');
  if (!slide) return;
  const scaleX = window.innerWidth / 1920;
  const scaleY = window.innerHeight / 1080;
  const scale = Math.min(scaleX, scaleY);
  slide.style.fontSize = (scale * 16) + 'px';
}
```

## Code Quality

- Valid HTML5
- Proper `lang` attribute
- Single `<style>` and `<script>` block in single-file mode
- No framework dependency unless the user asked for it
- Use comments only where structure is not obvious
- Keep visible UI copy in Japanese unless brand/source wording requires another language
- Remove all placeholders such as `LAYOUT`, `PHOTO`, `CATEGORY`, `Section 01`, `Lorem ipsum` before delivery

## Validation

- Run `scripts/validate-slide-deck.mjs <url-or-file>` after implementation
- The validator requires the `playwright` package or an equivalent Playwright runtime
- Fix overflow, placeholder text, and line-start particle issues before screenshots
- After automated validation passes, review representative slides at `320px` and `1920px`
- If manual `<br>` was inserted, verify that each break matches the rules in `references/slide-copy-fitting.md`

## Final Checklist

- Every slide has one key message
- `16:9` is preserved
- Safe area is respected
- Alignment is consistent
- One primary font family is used
- Three colors or fewer are used
- Visual hierarchy is obvious in three seconds
- Most content slides include a visual
- Navigation works
- Resize behavior works
- Text is concise
- Contrast meets `WCAG AA`
- No placeholders remain
- Validator passes with zero blocking issues

---

## Implementation Architecture

### 成果物構成

```
slides/
├── index.html          # エントリーポイント
├── css/
│   └── style.css       # 全スタイル
├── js/
│   ├── app.js          # メインロジック（ナビ・サイドバー・スクリプト表示）
│   └── slides.js       # スライドデータ定義（全スライドの内容をここに集約）
└── assets/             # 画像等（必要な場合のみ）
```

フレームワーク不使用。バニラHTML/CSS/JSのみ。
追加ライブラリも原則不使用（アイコンにCDN利用は可）。
single-file modeでは上記を1本にまとめた `slides.html` を出力する。

### 共通シェル（index.html + app.js + style.css）

以下は全スライド共通。スライドごとに書かない。

- **スライド表示エリア**: 16:9固定、viewport中央配置
- **ナビゲーション**: 左右クリック・矢印キーでページ移動
- **アジェンダサイドバー**: 右上メニューボタンで右から開閉
- **トークスクリプト**: 画面下部ホバーで表示
- **ステータス表示**: 右上に現在のアジェンダ名＋予定時間

### スライドデータ（slides.js）

全スライドの内容をJS配列で一元管理する。

```js
const PRESENTATION = {
  title: "プレゼンタイトル",
  colors: {
    base: "#FFFFFF",
    main: "#1A1A2E",
    accent: "#E94560"
  },
  agenda: [
    { id: "intro", label: "はじめに", time: "5min" },
    { id: "main",  label: "本題",     time: "20min" },
    { id: "close", label: "まとめ",   time: "5min" }
  ],
  slides: [
    {
      agendaId: "intro",
      layout: "center",
      headline: "キーメッセージ",
      body: "補足テキスト",
      notes: "トークスクリプト...",
    },
  ]
};
```

app.jsがこのデータを読み、共通シェルの中にスライドを動的レンダリングする。
**スライド追加・変更はslides.jsだけを編集すれば完結する**設計にする。

## UI仕様

### ナビゲーション

| 操作 | 動作 |
|------|------|
| 画面右半分クリック / → / Space | 次スライド |
| 画面左半分クリック / ← / Backspace | 前スライド |
| Home | 最初のスライドへ |
| End | 最後のスライドへ |
| 数字キー + Enter | 指定番号のスライドへジャンプ |

- 現在のスライド番号をURLハッシュ（`#3`等）に反映する
- ブラウザリロードでもスライド位置を維持する
- ページ遷移アニメーションはフェードのみ（200ms以内）。派手なトランジション禁止

### アジェンダサイドバー

- **トリガー**: 右上のハンバーガーメニューボタン
- **開閉**: 右からスライドイン（300ms ease）
- **内容**: アジェンダ一覧。各アジェンダに属するスライドのサムネイルまたはタイトルリスト
- **現在位置**: 今いるアジェンダ・スライドをハイライト
- **ジャンプ**: 任意のスライドをクリックで直接移動
- **閉じる**: 背景クリック / Escキー / ボタン
- **閉じる実装の注意**: overlayのclickハンドラでは `e.target === overlay` ではなく `!e.target.closest(".sidebar")` で判定する
- **オーバーレイ**: 半透明黒背景でスライドを暗くする

### トークスクリプト

- **トリガー**: 画面下端にマウスホバー（下から48px以内の領域）
- **表示**: 下からスライドアップ（200ms）
- **高さ**: 画面の最大30%まで。スクロール可能
- **内容**: 現在スライドの`notes`フィールド
- **非表示**: マウスが領域外に出たら200msで閉じる
- **notesが空のスライド**: ホバーしても何も出さない

### ステータス表示（右上）

- 現在のアジェンダ名 + 予定時間 + スライド番号
- フォントサイズは小さめ（12〜14px）、控えめな色
- サイドバーのメニューボタンの左隣に配置

## 配色詳細

3色構成。slides.jsの`colors`で一元定義し、CSS変数で全体に適用する。
**色はテーマのブランドカラー調査に基づいて決定する。**

| 役割 | 用途 | 面積比 |
|------|------|--------|
| `--color-base` | 背景 | 70% |
| `--color-main` | 見出し、強調、枠線 | 25% |
| `--color-accent` | 最重要ポイント、数字 | 5% |

- WCAG AA（4.5:1）以上のコントラストを確保
- ブランドカラーがコントラスト不足の場合は明度を調整して使う

## テキスト設計（登壇用）

会場登壇（数十〜数百名規模）を前提。後方席でも読める大きさを優先する。

- 文字サイズは本ファイル上部の Typography テーブルに固定する
- **見出し** は `slide-h1` / `slide-h2` を基準にし、3行目に落ちる前にコピーを短くする
- **本文** は `slide-body` 基準、後方席向けでも 18px 相当を下回らない
- **注釈** は `slide-caption` 以上、補助ラベルは `slide-micro` まで
- 1スライドのテキスト量は最大40文字×5行
- 箇条書きは3〜5項目まで
- フォント: ブランド調査で特定したフォントをGoogle Fontsから読み込む。日本語は `"Noto Sans JP"` をフォールバックとして必ず含める
- 文字サイズ: コンテナクエリ単位（cqw）のカスタムクラスのみ使用（`slide-hero`, `slide-h1`, `slide-h2`, `slide-h3`, `slide-title`, `slide-body`, `slide-caption`, `slide-micro`, `slide-number`）
- **gap・padding・border-radius 等もすべて `cqw` で指定する（Responsive Scalingセクション参照）**
- **Tailwindの固定テキストサイズ（text-xl等）はスライド内で使用禁止**
- 見出しや本文の主要ノードには、必要に応じて `data-copy-role` を付けて検証対象を明示する

## 改行位置

- 詳細ルールは `references/slide-copy-fitting.md` を基準にする
- headlineの`\n`や `<br>` は意味の切れ目で入れる。単語、助詞、句読点、単位の途中で切らない
- 見出しは 1行 12〜18文字、本文は 1行 18〜24文字を目安にする
- left-right レイアウトの強調文は 1行 8〜10文字を超えたら body に逃がす
- 声に出して読んだときの息継ぎ位置、1文字だけの末尾行、行頭助詞を最終確認する

## 余白・スペーシング

スライド内のすべてのspacing値は`cqw`で統一する（1cqw = スライド幅の1%）。

### スライドパディング
- 基本: `padding: 4cqw 7cqw`（上下4cqw / 左右7cqw）
- タイトルバー付きレイアウト: タイトルバーの高さ分`padding-top`を減算する

### 要素間gap（基準値）

**最小gap: 2cqw（≈40px at 1920px）**。これを下回るとコンテンツが詰まりすぎる。

| 用途 | gap値 | px換算参考 |
|---|---|---|
| 同グループ内の密接な要素（箇条書き行間、アイコン+ラベル等） | `2cqw` | ≈ 40px |
| グループ内の標準間隔（テキストブロック間、カード間） | `2.5cqw` | ≈ 48px |
| タイトルと本文の間 | `3cqw` | ≈ 58px |
| 異なるセクション間 | `4cqw` | ≈ 77px |

### margin運用ルール
- `margin: auto`（中央寄せ）以外の固定marginは禁止。gapで制御する
- 要素ごとにばらばらな`margin-top`を設定しない（spacing rhythmを破壊する）

### 上下中央揃え
- 全レイアウトで `justify-content: center`（flex縦方向）を基本
- 空白が浮かないよう`gap`で調整し、`padding-top`の微調整で補う

## 実装手順

### 0. テーマのブランド調査（必須）

スライドデータを作る前に、プレゼンの主題となるサービス・製品・企業のブランドアイデンティティを調査する。

**調査項目:**
- ブランドカラー（プライマリ、セカンダリ、アクセント）のHex値
- フォントファミリー（Webフォント名）
- 全体の印象（モダン / プレイフル / コーポレート / ミニマル等）
- ダーク/ライトモードの傾向

**調査方法:**
1. WebSearchで `{サービス名} brand colors` `{サービス名} brand identity` 等を検索
2. WebFetchで公式サイトのCSS変数やカラーコードを確認
3. Brandfetch等のブランドアセットサービスも参照

**適用ルール:**
- ブランドのプライマリカラーは `accent`（5%面積）として使い、主張しすぎない
- `base` はブランドの背景色傾向に合わせる
- `main` はテキスト・見出しに使い、ブランドの文字色傾向に合わせる
- WCAG AAコントラストは必ず維持。ブランドカラーがコントラスト不足の場合は明度を調整

### 1. slides.jsを先に作る

- ブランド調査結果を反映した配色を決める
- アジェンダ構成を決める
- 各スライドのメッセージを1つに絞る
- レイアウトを選定する
- トークスクリプトを記述する
- 見出し・本文は改行なしで起草し、最後に `references/slide-copy-fitting.md` で整形する

### 2. 共通シェルを構築する

index.html、style.css、app.jsで共通UIを構築する。

### 3. レイアウトレンダラーを実装する

slides.jsの`layout`値に応じてHTML要素を動的生成する関数群。

### 4. 動作確認

- 全スライドが正しく表示されるか
- ナビゲーションが全操作で動くか
- サイドバーの開閉が正常か
- トークスクリプトのホバー表示が機能するか
- URLハッシュが同期しているか
- 16:9が崩れていないか
- 配色・コントラストが十分か

### 5. 納品前検証

- `scripts/validate-slide-deck.mjs` を実行し、overflow・プレースホルダー・改行違反を潰す
- 320px / 1920px の両幅で主要スライドを確認する
- 行頭助詞、1文字だけの末尾行、単位だけの独立行がないかを目視で再確認する

## コピーボタン（プロンプト表示スライド）

プロンプトを表示するスライドでは、プロンプトボックスに「コピー」ボタンを必ず付ける。

### 実装要件

- ボタンは `.prompt-box` 内の右上に `position: absolute` で配置
- `.prompt-box` に `position: relative` を付与
- `z-index` はナビゲーションエリア（`.nav-area`）より上にする
  - `.nav-area` の z-index を `90` に下げる
  - `.slide` の z-index を `95` にする
  - `.copy-btn` の z-index を `150` にする
- クリックハンドラで `event.stopPropagation()` を呼び、ページ送りを防止する
- `navigator.clipboard.writeText()` でコピー。失敗時は `execCommand('copy')` にフォールバック
- コピー成功時はボタンテキストを「コピー完了!」に変更し、2秒後に「コピー」に戻す
- `data-copy` 属性にプレーンテキストのプロンプトを格納する
