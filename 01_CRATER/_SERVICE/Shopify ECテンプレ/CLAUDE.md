# Shopify ECテンプレ（案件専用ルール）

## これは何か
Shopify EC案件が来たときに毎回ゼロから作らないための、クレーターのベース資産。
- `theme/` … Liquidテーマ（コード層）。A CURRY本番テーマ（`01_CRATER/_SERVICE/acurry/release-theme/`）を2026-08-14にコピーし、A CURRY固有の内容（コピー・ロジック・画像）を全て汎用化したもの。**本番acurryとは無関係の別ファイル**（コピー後は同期しない）。
- デザインワイヤー（構造層）は `Pencil参考/リファレンス.pen` に格納（ケイスケさん指定）。theme/の実セクション構成に合わせて組んである。Header/Footer/HeaderSP/FooterSP・TOP/商品一覧/商品詳細/カート/会社概要（PC+SP）・「セクション集（差し替え用）」カタログ（36セクション、差し替え用に随時追加）。

新規Shopify案件が来たら、このフォルダの`theme/`をコピーしてそのまま案件用テーマにする。「どのページがあるか」を毎回聞き直さない・毎回ゼロから汗をかいて組まないためのテンプレ。

## 使い方（新規案件が来たとき）
1. `theme/`を案件フォルダにコピー
2. Pencilで`Pencil参考/リファレンス.pen`内のワイヤーを案件のKV・世界観に合わせて作り直す（構造は変えない。指示があれば変える）
3. `layout/theme.liquid`内の`:root{--ec-...}`トークンを案件のブランドカラー・フォントに差し替える
4. `assets/ec-*.jpg`・`ec-logo-*.png`のグレープレースホルダーを、確定した実画像に差し替える（Shopify管理画面のセクション設定からでも、ファイル差し替えでもどちらでも可）
5. 各セクションのスキーマ設定（見出し・本文・価格等）をShopify管理画面またはtemplates/*.jsonで編集

## セクション構成（`theme/sections/ec-*.liquid`）
全16セクション。命名は`ec-`プレフィックスで統一（旧A CURRY版は`acurry-`だったが汎用化のため改名済み）。

| ファイル | 役割 |
|---|---|
| `ec-header.liquid` | 透過グローバルヘッダー（KVの上に重ねる。ロゴ左端・ナビ右端） |
| `ec-footer.liquid` | フッター（ニュースレター・ナビ3列・ロゴ・SNS） |
| `ec-hero.liquid` | TOPのKVヒーロー |
| `ec-product-lineup.liquid` | 商品ラインナップ（コレクション自動表示 or 手動ブロック） |
| `ec-bundle-tiles.liquid` | セット/バンドル訴求の2枚タイル |
| `ec-statement.liquid` | ブランドステートメント帯（ダーク背景・2カラム） |
| `ec-craft.liquid` | こだわり・製法（画像左/テキスト右） |
| `ec-story.liquid` | ブランドストーリー |
| `ec-pickup.liquid` | イチオシ商品の深掘り（テキスト左/画像右） |
| `ec-voice.liquid` | お客様の声（星評価カード） |
| `ec-trust.liquid` | 信頼アイコン帯（4項目） |
| `ec-faq.liquid` | FAQアコーディオン |
| `ec-blog.liquid` | ジャーナル（Shopifyブログ連動 or ダミー） |
| `ec-cta.liquid` | 締めの大バナー |
| `ec-collection.liquid` | 商品一覧ページ全体（パンくず・ソート・グリッド） |
| `ec-product.liquid` | 商品詳細ページ全体（ギャラリー・購入パネル・エディトリアル帯・ストーリー・使い方ステップ・詳細情報テーブル・関連商品） |

`snippets/ec-motion.liquid`：パララックス＆スクロール登場アニメ（共通）。

## テンプレート（`theme/templates/`）
- `index.json` = TOP（hero〜cta の12セクション構成）
- `collection.json` = 商品一覧（ec-collection）
- `product.json` = 商品詳細（ec-product）
- `page.about-us.json` = 会社概要（statement/story/craft/trust/cta）
- `cart.json` / `page.contact.json` / ポリシー系 = Shopify標準セクション（`main-cart`等）のまま。案件ごとに大きく作り直す必要は基本ない

`ec-product.liquid`はブロック駆動（`spec`=購入パネルのクイックスペック行、`step`=使い方ステップ、`detail`=詳細情報テーブル行）。商品によって内容が変わる項目はブロックの追加・編集で対応する。

## デザイントークン
`layout/theme.liquid`の`:root{--ec-...}`に集約。案件ごとにここだけ差し替えれば全セクションに反映される。
- `--ec-ink` / `--ec-paper` / `--ec-paper2` / `--ec-dark1` / `--ec-dark2` / `--ec-footer` / `--ec-sub` / `--ec-line` / `--ec-white`
- `--ec-en`（英字フォント）/ `--ec-jp`（和文フォント）：現在は`Inter` + `Noto Sans JP`のニュートラル仮値
- 非TOPページの背景は`linear-gradient(160deg,#b4b4b4,#a0a0a0)`（グレーのちょいグラデ）で統一

## 画像プレースホルダー
`assets/ec-*.jpg`・`ec-logo-*.png`は全てグレーのちょいグラデ（ImageMagickで生成）。実画像未確定の間はこれを使う。差し替えは元画像と同じファイル名で上書きするか、Shopify管理画面の該当セクション設定（image_picker）に実画像をアップロードする。

## 注意
- 本番A CURRYのテーマ（`01_CRATER/_SERVICE/acurry/release-theme/`）とは完全に独立。こちらを編集してもA CURRYの本番には一切影響しない
- 逆に、A CURRY側の今後の改善（新セクション追加など）はこちらに自動反映されない。汎用性が高い改善があれば手動でこちらにも移植する
