# 人と空間 デザインシステム
> HUMAN AND SPACE — Web Design System v1.0

---

## コンセプト

**「動線の可視化」**

ロゴは「人（円）」と「空間（四角）」をクロスで結ぶ幾何学構造。
このサイトは、その哲学を継承し、**人がどう動き、空間がどう変わるか**を視覚的に語る。

- モチーフ：線・経路・フロー・格子
- 空気感：建築的・構造的・清潔・信頼
- 余白を広く取り、情報を詰め込まない
- 装飾は「線」のみ。色より形で語る

---

## カラーシステム

### ベースカラー
```
--color-white:    #FFFFFF   /* ページ背景・カード背景 */
--color-black:    #0D0D0D   /* テキスト・ロゴ・アクセント（純黒でなく微かに温かい黒） */
--color-navy:     #1A2E42   /* ヘッダー・フッター・CTAボタン・強調背景 */
```

### グレースケール（情報の階層を作る）
```
--color-gray-05:  #F5F5F5   /* セクション背景・交互カラー */
--color-gray-10:  #E8E8E8   /* ボーダー・区切り線 */
--color-gray-30:  #B0B0B0   /* プレースホルダー・補足テキスト */
--color-gray-50:  #777777   /* サブテキスト・キャプション */
--color-gray-80:  #333333   /* 本文テキスト */
```

### アクセントカラー（最小限使用）
```
--color-accent:   #2B5FA0   /* リンクホバー・データハイライト（ネイビーより明るい青） */
--color-line:     #C8D0D8   /* 動線モチーフの線（薄いスレートブルー） */
```

### カラー使用ルール
- 背景は必ず白（#FFFFFF）かグレー（#F5F5F5）のみ
- ネイビー（#1A2E42）は面積を絞って使う（ヘッダー・フッター・強調CTA）
- アクセントカラーは1ページに3箇所以内
- グラデーション禁止（単色のみ）

---

## タイポグラフィ

### フォント定義
```css
/* 日本語 */
font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;

/* 英字・数字（数値データに使用） */
font-family: 'Inter', 'DM Sans', Arial, sans-serif;
```

> Webフォント読込（Google Fonts）
> `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap');`

### タイプスケール
```
--text-xs:    11px / line-height: 1.6  / letter-spacing: 0.08em  → ラベル・キャプション
--text-sm:    13px / line-height: 1.7  / letter-spacing: 0.04em  → 本文（小）・補足
--text-base:  15px / line-height: 1.8  / letter-spacing: 0.03em  → 本文
--text-md:    18px / line-height: 1.65 / letter-spacing: 0.02em  → リード文・カード見出し
--text-lg:    24px / line-height: 1.45 / letter-spacing: 0.01em  → H3・セクション小見出し
--text-xl:    32px / line-height: 1.35 / letter-spacing: 0em     → H2・ページ見出し
--text-2xl:   44px / line-height: 1.2  / letter-spacing: -0.01em → H1・ヒーローコピー
--text-3xl:   60px / line-height: 1.1  / letter-spacing: -0.02em → KPI数値・インパクト数字
```

### ウェイト定義
```
font-weight: 300  → キャプション・補足（軽い）
font-weight: 400  → 本文
font-weight: 500  → 強調本文・ラベル
font-weight: 700  → 見出し・ボタン・KPI数値
```

### タイポグラフィルール
- 日本語はトラッキング（letter-spacing）を微量入れる（0.03em〜）
- 英字・数値は Inter を使い、タイトに詰める
- 行間（line-height）は本文 1.8 以上を確保する
- 見出しは 2 行以内に収める

---

## スペーシング

### スペースユニット（8pxグリッドベース）
```
--space-1:   4px
--space-2:   8px
--space-3:  12px
--space-4:  16px
--space-5:  24px
--space-6:  32px
--space-7:  48px
--space-8:  64px
--space-9:  80px
--space-10: 120px
```

### セクション余白
```
padding: var(--space-9) var(--space-6);  /* デスクトップ */
padding: var(--space-7) var(--space-5);  /* モバイル */
```

### コンテナ幅
```
--container-max:  1080px   /* メインコンテンツ */
--container-text:  720px   /* テキスト中心のセクション */
margin: 0 auto;
padding: 0 var(--space-6);
```

---

## 動線モチーフ（ビジュアル言語）

ロゴの「クロス（×）」= 人と空間が交差する瞬間。
このサイトでは**線**をビジュアルモチーフとして随所に使う。

### 線の使い方
```css
/* 水平区切り線（セクション間） */
border-top: 1px solid var(--color-gray-10);

/* 強調線（見出し横・ナビアクティブ） */
border-bottom: 2px solid var(--color-black);

/* 動線を示す薄い線（背景装飾） */
background: var(--color-line);  /* #C8D0D8 */
```

### グリッド背景（オプション）
特定セクションで使用可。**透過度10%以下**に抑える。
```css
background-image: 
  linear-gradient(var(--color-line) 1px, transparent 1px),
  linear-gradient(90deg, var(--color-line) 1px, transparent 1px);
background-size: 40px 40px;
opacity: 0.08;
```

---

## コンポーネント定義

### ボタン
```css
/* プライマリ（CTA） */
.btn-primary {
  background: var(--color-navy);
  color: #fff;
  padding: 14px 36px;
  border-radius: 2px;          /* 角丸は最小限。建築的に */
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.08em;
  transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.82; }

/* セカンダリ（アウトライン） */
.btn-secondary {
  background: transparent;
  color: var(--color-navy);
  border: 1.5px solid var(--color-navy);
  padding: 13px 36px;
  border-radius: 2px;
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.08em;
}
.btn-secondary:hover {
  background: var(--color-navy);
  color: #fff;
}

/* テキストリンク */
.btn-text {
  color: var(--color-navy);
  font-size: var(--text-sm);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-text::after { content: '→'; }
```

### カード
```css
.card {
  background: #fff;
  border: 1px solid var(--color-gray-10);
  padding: var(--space-6);
  border-radius: 0;             /* カードは角丸なし。構造的に */
  transition: box-shadow 0.25s;
}
.card:hover {
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}
```

### セクション見出しパターン
```html
<!-- 標準見出し -->
<div class="sec-label">SECTION NAME</div>    <!-- 小文字英字ラベル -->
<h2 class="sec-heading">日本語の見出し</h2>
<p class="sec-lead">リード文が入ります</p>
```
```css
.sec-label {
  font-family: 'Inter', sans-serif;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--color-gray-50);
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}
.sec-heading {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: var(--space-4);
  line-height: 1.35;
}
.sec-lead {
  font-size: var(--text-md);
  color: var(--color-gray-50);
  line-height: 1.8;
  max-width: var(--container-text);
}
```

### KPI数値カード
```css
.kpi-number {
  font-family: 'Inter', sans-serif;
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-black);
  line-height: 1;
  letter-spacing: -0.02em;
}
.kpi-unit {
  font-size: var(--text-lg);
  color: var(--color-gray-50);
  margin-left: 4px;
}
.kpi-label {
  font-size: var(--text-xs);
  color: var(--color-gray-50);
  margin-top: var(--space-2);
  letter-spacing: 0.06em;
}
```

### ナビゲーション
```css
.site-header {
  background: #fff;
  border-bottom: 1px solid var(--color-gray-10);
  padding: 0 var(--space-6);
  height: 64px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-link {
  font-size: var(--text-sm);
  color: var(--color-gray-80);
  letter-spacing: 0.04em;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.nav-link:hover,
.nav-link.active {
  color: var(--color-black);
  border-bottom-color: var(--color-black);
}
```

### フォーム
```css
.form-input,
.form-textarea,
.form-select {
  background: var(--color-gray-05);
  border: 1px solid var(--color-gray-10);
  border-radius: 2px;
  padding: 12px 16px;
  font-size: var(--text-sm);
  color: var(--color-black);
  width: 100%;
  transition: border-color 0.2s;
}
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-navy);
  background: #fff;
}
```

---

## ページ背景パターン

| セクション種別 | 背景 | 用途例 |
|---|---|---|
| 標準 | `#FFFFFF` | ほとんどのセクション |
| グレー | `#F5F5F5` | 交互セクション・カード背景 |
| ダーク | `#1A2E42` | フッター・強調CTA・インパクトエリア |
| ライン | `#0D0D0D` ＋ 白テキスト | キャッチコピーのみのフルスクリーン |

---

## モーション・アニメーション

テーマ：**流れるような水平移動**（人の動線 = 左→右へ流れる）

```css
/* 基本トランジション */
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

/* スクロール表示アニメーション */
/* 下から静かにフェードイン */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.reveal {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}

/* KPI数値カウントアップ → JSで実装 */
/* ホバー時の線の伸び → width: 0 → 100% transition */
```

### アニメーションルール
- 速度は 0.2s〜0.6s の範囲内
- イージングは `cubic-bezier(0.4, 0, 0.2, 1)` 統一
- 派手なエフェクト禁止（バウンス・回転・拡大縮小は使わない）
- スクロールアニメーションは控えめに（1方向・上から下のみ）

---

## 禁止事項

- グラデーション背景（単色のみ）
- 丸みの強いボタン（border-radius: 20px 以上）
- カラフルな色の多用（3色以内）
- 影の多用（box-shadow は hover 時のみ）
- フォントサイズ 11px 以下の本文
- アイコンフォント（SVGで実装すること）
- アニメーションのループ再生

---

## CSS変数まとめ（コピペ用）

```css
:root {
  /* カラー */
  --color-white:   #FFFFFF;
  --color-black:   #0D0D0D;
  --color-navy:    #1A2E42;
  --color-accent:  #2B5FA0;
  --color-line:    #C8D0D8;
  --color-gray-05: #F5F5F5;
  --color-gray-10: #E8E8E8;
  --color-gray-30: #B0B0B0;
  --color-gray-50: #777777;
  --color-gray-80: #333333;

  /* タイポ */
  --text-xs:    11px;
  --text-sm:    13px;
  --text-base:  15px;
  --text-md:    18px;
  --text-lg:    24px;
  --text-xl:    32px;
  --text-2xl:   44px;
  --text-3xl:   60px;

  /* スペース */
  --space-1:    4px;
  --space-2:    8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   24px;
  --space-6:   32px;
  --space-7:   48px;
  --space-8:   64px;
  --space-9:   80px;
  --space-10: 120px;

  /* コンテナ */
  --container-max:  1080px;
  --container-text:  720px;
}
```
