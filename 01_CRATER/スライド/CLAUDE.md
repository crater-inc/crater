# スライド 案件ルール

## クライアント情報
- 会社名：株式会社クレーター（自社）
- 案件種類：会社概要スライド・提案スライド
- 納期：-

---

## トンマナ・世界観
エディトリアル。ミニマルで余白を大きく取り、情報密度を絞る。
グレー背景に黒テキスト。装飾を極力排除し、フォントサイズと余白だけで階層を作る。
「この星に、つめあとを残せ」のブランドイメージ。

---

## カラーシステム

| 役割 | 色 | 使用場面 |
|---|---|---|
| 背景（ベース） | `#C8C8C8`（ミディアムグレー） | 全スライドの背景。統一感が命 |
| テキスト | `#111111`（ほぼ黒） | 見出し・本文すべて |
| テキストサブ | `#555555` | キャプション・補足・ラベル |
| 黒バッジ | `#111111` 背景 + `#FFFFFF` 文字 | 日付・カテゴリラベル・セクション名 |
| ダーク背景 | `#111111`（全黒） | NUMBERスライドなど数字インパクト系のみ |
| アクセント黄 | `#FFE500` | **原則使わない**。本当に核心の1フレーズのみ（1デッキに1〜2箇所まで） |

**黄色の使い方（厳守）**
- 表紙のキャッチコピー核心フレーズに使う場合がある程度
- 数字スライドの強調やラベルには使わない
- テンプレ参照スライドの多くに黄色はない。デフォルトは「使わない」

---

## レイアウト原則

### 余白（確定値）
- **全スライド共通：`padding: 5cqw`（上下左右すべて均一）**
- 上下・左右で差をつけない。`5cqw 7cqw` のような非対称は禁止
- コンテンツは全体の50〜60%の面積に収める。残りは余白
- 「スカスカに見える」くらいがちょうどよい

### テキスト配置
- **左揃え基本**。中央揃えは表紙・ステートメント系のみ
- 本文の最大行幅：`max-width: 60cqw`（全幅に広げない）
- タイトルは左下〜左中央に配置することが多い

### 縦方向の配置（確定ルール・全スライド共通）

**黒バッジは左上固定。バッジ以外のコンテンツは必ず上下センター。**

```css
/* 全スライド共通の構造 */
.sXX {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 5cqw;
  position: relative; /* コピーライトのabsolute基準 */
}
.sXX-top {
  flex-shrink: 0; /* バッジは縮まず左上に固定 */
}
.sXX-main {
  flex: 1;                    /* 残りの高さをすべて使う */
  display: flex;
  flex-direction: column;
  justify-content: center;    /* 上下センター */
  gap: 任意;
}
```

```html
<div class="sXX">
  <div class="sXX-top"><span class="badge">LABEL</span></div>
  <div class="sXX-main">
    <!-- ロゴ・テキスト・テーブルなど -->
  </div>
  <p class="sXX-copy">©CRATER Inc. 20XX</p>
</div>
```

コピーライトは `position: absolute; right: 5cqw; bottom: 5cqw` で右下固定（フレックスアイテムにしない）。

### フッター（全スライド共通）
- 右下に `©CRATER Inc. 20XX` を小さく（`slide-micro`クラス相当）
- フッターは常にグレー背景上に黒テキストで

### セクションラベル
- スライド左上または右上に小さくカテゴリ名を英字で（例: `NUMBER`, `CONCEPT`, `OVERVIEW`）
- フォント: urw-din、サイズ: `0.9〜1.0cqw`、letter-spacing広め

---

## スライドタイプ別デザイン指針

### 表紙（Cover）
- グレー背景 or 写真フルブリード（グレースケール処理）
- クライアント名（小）→ タイトル（大） → 日付バッジ（黒ベタ）の構成
- CRATER ロゴ + ©CRATER Inc. を左下に
- 余白を広く取り、文字は左下〜左中央に集める

### ステートメント（Statement）
- グレー背景のみ
- 大きなキーメッセージ1文を中央〜左寄りに配置
- 補足テキストは小さく下部に
- 黒バッジでセクション名を左上に

### NUMBERスライド（数字インパクト）
- **背景は黒（`#111111`）**で他と差別化
- 数字は白で大きく（`slide-number`クラス: 9.6cqw）
- 左側に縦書きの細いラベル
- 右側に数字 + 説明文の横組み
- 右上に `©CRATER` 白文字

### テキスト+写真（Split）
- 左60〜65%にテキスト、右35〜40%に写真フルブリード
- 写真はグレースケール or カラー維持（内容による）
- 写真エリアは上下端まで伸ばす（セーフゾーンなし）

### 会社概要（Overview）
- グレー背景
- 左上に CRATER SVGロゴ（`assets/logo.svg`）を `14cqw` で表示
- シンプルな2カラムテーブル（ラベル + 内容）
- **水平罫線は行間のみ。最初の行の上線・最後の行の下線は入れない**
- 装飾なし。フォントサイズの差だけで情報整理
- コピーライトは `position: absolute; right: 5cqw; bottom: 5cqw` で右下固定

---

## フォント

| 用途 | フォント |
|---|---|
| 英字・数字・ロゴ | `urw-din`（Adobe Fonts: `fwj5xdw`）|
| 日本語 | `Noto Sans JP`（Google Fonts）|

- 英字ラベル・数値には必ず urw-din を使う
- 日本語本文は Noto Sans JP weight: 400
- 見出しは Noto Sans JP weight: 700〜900

---

## ページタイトル（黒バッジ）— 全スライド共通ルール

**全スライドの左上に必ず黒バッジでページ名を入れる。**

```html
<div class="s0X-top">
  <span class="badge">SECTION NAME</span>
</div>
```

```css
.badge {
  display: inline-block;
  background: #111111;
  color: #ffffff;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.9cqw;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.3cqw 0.8cqw;
  border-radius: 0;
}
```

- **配置**: スライド左上。セーフゾーン内の最上部
- **テキスト**: 英字大文字 or 日本語（例: `MISSION` `NUMBER` `OVERVIEW` `2026.03.19`）
- **1スライドに1つのみ**
- 表紙は日付バッジ、コンテンツスライドはセクション名バッジ
- 角丸なし（border-radius: 0）

---

## 禁止事項

- ドロップシャドウ禁止（`box-shadow`）
- グラデーション背景禁止（単色のみ）
- フチ文字禁止（`-webkit-text-stroke`）
- アイコン + カードの羅列禁止（AIっぽくなる）
- 均一な3カラム・4カラムカード並びを多用しない
- 英語ラベルのみの見出し禁止（必ず日本語を主にする）
- 黄色の多用禁止（1デッキ1〜2箇所まで）
- 角丸（border-radius）禁止。すべて直角

---

## 参考スライド（実テンプレ）から読み取ったポイント

1. **余白が命**。テキストは少なく、スペースを大きく使う
2. **黒バッジ**でセクション名・日付を左上に小さく置く
3. **NUMBERスライドは全黒背景**。他スライドとの差で数字が映える
4. **写真は右半面フルブリード**または表紙フルブリード。中途半端なサイズにしない
5. **フッター右下**に `©CRATER Inc. 20XX` を必ず入れる
6. テーブル系スライドは **水平罫線のみ**。枠線や背景色なし
7. **ロゴはテキストロゴ**（urw-din で `CRATER`）。画像ファイル不使用

---

## ファイル構成（multi-file）

```
output/
├── index.html        # HTMLシェル（スライド本体はJSで動的生成）
├── css/style.css     # 全スタイル（バージョン ?v=N でキャッシュ回避）
├── js/slides.js      # 1スライド = 1関数。window.slideFactories[] に登録
├── js/app.js         # スケーリング・ナビ・サイドバー・トークスクリプト
└── assets/           # ロゴ・画像（外部URL禁止。file://だと読み込めないため）
```

---

## スケーリング実装（確定版）

### 設計方針
- スライドは **1920×1080px 固定**。ブラウザ幅に関係なくレイアウトが崩れない
- `transform: translate(-50%, -50%) scale(N)` でビューポートに収まるよう拡縮
- `container-type: inline-size` + `cqw` 単位で文字サイズ・余白を指定（1cqw = 1920px の 1% = 19.2px 固定）

### CSS
```css
.slide-stage {
  width: 100vw;
  height: 100vh;
  background: #FFFFFF;   /* 黒にすると遷移中に黒フラッシュが出る */
  overflow: hidden;
  position: relative;
}

.slide {
  width: 1920px;
  height: 1080px;
  position: absolute;
  top: 50%;
  left: 50%;
  overflow: hidden;
  background: var(--c-base);   /* #C8C8C8 */
  container-type: inline-size;
  display: none;
  transform-origin: center center;
}
.slide.active {
  display: flex;
  flex-direction: column;
}
```

### JS（app.js の実装順序）
```js
// 1. スケール値を保持する変数
var currentScale = 1;

// 2. スケール関数（スライドが存在すれば全件に適用）
function scaleSlides() {
  currentScale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  document.querySelectorAll('.slide').forEach(function (s) {
    s.style.transform = 'translate(-50%, -50%) scale(' + currentScale + ')';
  });
}
window.addEventListener('resize', scaleSlides);

// 3. ensureRendered でスライドをDOMに追加したら即スケール適用
function ensureRendered(i) {
  if (rendered[i] || i < 0 || i >= total) return;
  var frag = document.createRange().createContextualFragment(slideFactories[i]());
  stage.appendChild(frag);
  rendered[i] = true;
  var slides = stage.querySelectorAll('.slide');
  if (slides[i]) {
    slides[i].style.transform = 'translate(-50%, -50%) scale(' + currentScale + ')';
  }
}

// 4. 初期化：scaleSlides() でスケール値を確定してから ensureRendered を呼ぶ
scaleSlides();
[0, 1, 2].forEach(function (i) { ensureRendered(i); });
goTo(initPage, true);
```

**NG パターン①**：`scaleSlides()` より先に `ensureRendered()` を呼ぶ → `currentScale` 未確定で適用されない。  
**NG パターン②**：`ensureRendered` 内で `slides[i]` を使う → スライドが順不同で描画されるとDOMインデックスとスライド番号がズレて未適用になる。  
**正解**：`ensureRendered` 内では `scaleSlides()` を呼んで全件再適用する。

---

## ロゴ SVG

- ファイル：`output/assets/logo.svg`
- 元ファイル（A4サイズ）のviewBoxを変更してロゴ部分だけ切り出す
- 確定 viewBox：`viewBox="110 238 615 124"`
- 表示サイズ：`.s01-logo { width: 8cqw; height: auto; }`
- 表紙フッターの構成：ロゴ（img）→ コピーライト（p）。gap: 0.8cqw

---

## 進行メモ
- 会社概要スライド：`output/` フォルダで制作中（multi-file構成）
- ローカル確認：`file://` 直アクセスでOK（画像はassetsフォルダにDL済み）
- GitHub Pages：`https://view.crater.co.jp/01_CRATER/スライド/output/index.html`
- パスワード：`view`
