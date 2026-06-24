# APOLLOS FV 実装プラン

> **For agentic workers:** 静的ユニットテストではなく「ブラウザで目視確認」を検証手段とする視覚実装。各タスクはチェックボックス（`- [ ]`）で進捗管理。

**Goal:** スクロール連動で「雲（地上）→大気圏→宇宙（地球・月・星）」へ昇る映画的FVをapollos.jpトップに実装する。

**Architecture:** 4幕のスクロール演出をレイヤー視差（パララックス）で構成。各景色を別レイヤー（最初は仮のCSSグラデ、後で本番PNGに差し替え）にし、スクロール量に応じてフェード・拡大・移動。仕上げはCLAUDE.mdルール（暗背景コントラスト・SP対応）に従う。

**Tech Stack:** HTML / CSS / JavaScript（素のJS・スクロール連動）。Pencilで静的レイアウト骨子（任意）、画像はAI生成（Lovart/KV制作）。

---

## ファイル構成

- 作り直し対象：`02_APOLLOS/output/website/index.html`（既存を退避してゼロから）
- 退避：`02_APOLLOS/output/website/index_旧.html`（元ファイルのバックアップ）
- 画像：`02_APOLLOS/output/website/images/fv/`（雲・大気圏・地球・月・星のPNG）
- 第一弾はFVのみ。CSS/JSはindex.html内に内包（1ファイル完結）でスタートし、肥大化したら分離検討。

---

### Task 1: 既存サイトを退避してFV骨組みを作る

**Files:**
- Modify: `02_APOLLOS/output/website/index.html`（ゼロから書き直し）
- Create: `02_APOLLOS/output/website/index_旧.html`（バックアップ）

- [ ] **Step 1: 既存indexをバックアップ**

```bash
cp 02_APOLLOS/output/website/index.html 02_APOLLOS/output/website/index_旧.html
```

- [ ] **Step 2: FVの土台HTMLを作る（仮レイヤー＝CSSグラデで代用）**

4幕分の高さ（縦長スクロール領域）と、固定背景レイヤー（雲・大気圏・地球・月・星を表すdiv）、ロゴ・タグライン・ナビ・スクロール誘導を配置。背景は本番画像が来るまでCSSグラデ/単色で代用。黒ベース・文字は白〜淡光。

- [ ] **Step 3: ブラウザで開いて骨組み確認**

```bash
open 02_APOLLOS/output/website/index.html
```

Expected: 黒背景・中央にAPOLLOSロゴ・縦に長くスクロールできる空間があること（演出はまだ無くてよい）。

- [ ] **Step 4: コミット**

```bash
git add 02_APOLLOS/output/website/index.html 02_APOLLOS/output/website/index_旧.html
git commit -m "APOLLOS FV: 骨組みと旧サイト退避"
```

---

### Task 2: スクロール演出（4幕）を仮レイヤーで実装

**Files:**
- Modify: `02_APOLLOS/output/website/index.html`

- [ ] **Step 1: スクロール連動JSを書く**

スクロール進捗（0〜1）を取得し、各レイヤーの opacity / transform（scale・translateY）を区間ごとに制御。
- 0〜0.25（雲の中）：雲レイヤー濃く・ロゴのみ
- 0.25〜0.5（雲が割れる）：雲レイヤーを左右にtranslate＆フェード、光増す
- 0.5〜0.75（大気圏）：大気圏グラデfade in、タグラインfade in
- 0.75〜1（宇宙着地）：地球・月・星fade in＆軽くscale、タグライン定着、ヘッダー＆スクロール誘導出現

- [ ] **Step 2: ブラウザでスクロール演出を確認**

```bash
open 02_APOLLOS/output/website/index.html
```

Expected: スクロールで「雲→割れる→大気圏の光→地球＋月＋星」と段階的に切り替わり、タグラインとナビが終盤に現れる。仮レイヤーでも流れが体感できること。

- [ ] **Step 3: ケイスケさん確認（演出の流れ・タイミング）**

動きのテンポ・各幕の長さを目視で調整。ここで演出を固める。

- [ ] **Step 4: コミット**

```bash
git add 02_APOLLOS/output/website/index.html
git commit -m "APOLLOS FV: 4幕スクロール演出（仮レイヤー）"
```

---

### Task 3: 本番画像レイヤーを生成して差し込む

**Files:**
- Create: `02_APOLLOS/output/website/images/fv/*.png`
- Modify: `02_APOLLOS/output/website/index.html`

- [ ] **Step 1: 各レイヤーの画像生成プロンプトを用意**

クロコが5レイヤー分のプロンプトを作成（黒い雲／大気圏の青い光の弧／大気圏越しの地球の輪郭／奥の月／星空）。KV制作スキル参照。透過PNG前提・APOLLOSの黒基調・上質トーン。

- [ ] **Step 2: 画像を生成（Lovart等）→ images/fv/ に配置**

ケイスケさんが生成 or クロコの画像生成手段で用意。2MB超はJPEG圧縮（`sips -s format jpeg -s formatOptions 75`）。

- [ ] **Step 3: 仮レイヤーを本番画像に差し替え**

CSSグラデのbackgroundを実画像に置換。視差の動き量を画像に合わせて微調整。

- [ ] **Step 4: ブラウザで確認**

```bash
open 02_APOLLOS/output/website/index.html
```

Expected: 本番画像で雲→大気圏→宇宙の流れが破綻なく見える。

- [ ] **Step 5: コミット**

```bash
git add 02_APOLLOS/output/website/images/fv 02_APOLLOS/output/website/index.html
git commit -m "APOLLOS FV: 本番画像レイヤー差し込み"
```

---

### Task 4: SP対応・仕上げ・デプロイ

**Files:**
- Modify: `02_APOLLOS/output/website/index.html`

- [ ] **Step 1: スマホレスポンシブ対応**

`@media(max-width:768px)`追加。`overflow-x:hidden`はベースCSS。重い視差はSPで簡略化（レイヤー数減・動き量減）し破綻防止。タグライン・ナビのサイズ調整。

- [ ] **Step 2: CLAUDE.mdルール最終チェック**

暗背景の文字は`rgba(255,255,255,0.65)`以上。本文14px以上。画像容量2MB以下。

- [ ] **Step 3: ブラウザ（PC・スマホ幅）で確認**

```bash
open 02_APOLLOS/output/website/index.html
```

Expected: PC・スマホ幅どちらでも演出が破綻せず、文字が読めること。

- [ ] **Step 4: デプロイ**

```bash
git add 02_APOLLOS/output/website/index.html
git commit -m "APOLLOS FV: SP対応・仕上げ"
git push
```

Expected: GitHub Actions（Deploy APOLLOS）が自動FTP → https://apollos.jp に反映。push後View URLを返す。

---

## スコープ外（次フェーズ）
- philosophy / service / about / contact 等の以降セクション。FV確定後に同トンマナで展開。

## Pencilの位置づけ
- Task 1〜2の静的レイアウト（ロゴ・タグライン・ナビ・スクロール誘導の配置・タイポ階層）はPencilで骨子を作ってもよい。ただし本FVは動的演出が主体のため、クロコ直書きの方が速い場合が多い。Pencilは「静的な決め画④の組版」を試す用途で任意活用。
