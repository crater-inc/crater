# エペナイロン（ブランド：エペ）案件専用ルール

## 概要
- ブランド名：エペ（ナイロン製品ブランド「エペナイロン」）
- 制作範囲：
  1. Shopifyでのサイト構築
  2. キービジュアル・商品写真の制作

## 進行状況
- 2026-07-29 案件キックオフ。詳細ヒアリング中。

## 決定事項
- Shopifyサイトは「動かないサイト」（静的、モーションは装飾程度）
- 素材状況：ロゴのみあり。商品写真・KVはこれから制作
- 商品写真・KVは実写撮影なし。**ケイスケさん本人が制作**（クロコがKive等を運転するのではなく、本人が作ったものを受け取って差し替える）

## 制作フロー
1. Shopifyサイトのデザインを**写真なし**でPencilにて先行（ワイヤー〜デザイン）
2. それとは別ラインでKV・商品写真をAI生成（Kive等）で制作
3. 完成した写真を①のPencilデザインに反映 → Shopifyへ実装

## Pencil正ファイル
- `CL/エペナイロン/pencil/01pencil.pen`
- TOPページ(PC)ルートフレーム：`jrJlz`「TOP page (PC)」
- 別ツール製の参考デザイン（元の選択オブジェクト`qpmKj`＝`01 トップページ_pc.jpg`）を全セクション同一構成で再現済み（2026-07-29）
- 構成：Header(コンポーネント`r4yvFI`)／Hero／About／Product(カード共通コンポーネント`dPk87` ImageCard)／Material／Styling／Contact／Blog(カードコンポーネント`Wzi8p` BlogCard)／Footer(コンポーネント`bRR5P`、正式デザイン済み)
- ロゴは`brief/logo/SVG`から採用、`pencil/assets/`にコピー＋白抜き横組み(`logo-horizontal-white.svg`)をヘッダーに使用
- 写真は参考スクショから該当箇所を切り出して`pencil/assets/`に配置（実写真ではなく参考流用の仮素材。後日AI生成KVに差し替え予定）
- フォントはPoppins(英字)+Noto Sans JP(和文)を仮採用（参考画像からの目視推定。実フォント未確定なら要確認）
- カラー：section-bg `#3B393A` / footer-bg `#000000` / text-white `#FFFFFF` / text-body `#E4E4E4` / text-muted `#ADADAD`（変数として.penに登録済み）

## 要確認・既知の注意点
- Contact欄の住所・電話・店舗写真は参考デザインに元から入っていた**別の実在店舗（千葉県茂原市の「Baracca」というかばん店）のダミー情報**。エペナイロンの実データではないため、そのまま公開しないこと。実データ確定後に差し替え必須
- Blogセクションも同一のダミー投稿（日付「2026年5月04日」/タイトル「直営店舗におけるGW営業日のご案内」）が6件とも同じ内容で入っていたダミー。実記事に差し替え必須
- Contactテーブルの罫線は元デザインでは点線だが、Pencilのschemaが破線(dash array)非対応のため実線で代替
- Material文中の本文は元から「テキストテキスト…」のダミー文（未確定コピー）のまま踏襲
- 2026-07-29 画像は全てグレープレースホルダーに変更済み（写真はまだ確定していないため）。カード/単体写真は`$epe-img-placeholder`(#C7C7C7)、Hero・Materialの文字が乗る全面背景は視認性のため`$epe-img-placeholder-dark`(#4D4D4D)を使用。写真確定後にfillを実画像へ差し替える
- **画像は今後も新規ページ含め常にグレープレースホルダーで作成する（標準ルール）**
- Hero見出し「Redefining / high specifications.」は2行を別テキストにして太さを分けている（1行目300 Regular寄り細字、2行目700 Bold）。1つのtextノードで太さを混在できないため

## ロードマップ
- `CL/エペナイロン/ロードマップ.html`（2026-08-14作成）にフェーズ・タスク・要確認事項をまとめ済み。進捗はこことCLAUDE.md/MEMORYを連動更新する

## 決定事項（2026-08-14）
- **Shopifyテーマ＝フルカスタムLiquidで構築**（既存テーマ改造ではない）。この「Pencilで参考精読→フルカスタムLiquid化」の型は他案件にも使う想定でテンプレ化しておく
- Shopifyは**本番契約済み**。アクセス方法は「Theme Access」アプリのパスワード発行（推奨・CLI直push可）またはコラボレーター招待（kurotachroco@gmail.com）で受領予定
- 独自ドメイン取得済み
- 決済・配送・税設定は**epe側（クライアント）が担当**。クレーターは基本サイト制作の代理運用のみ

## 親ブランド「epe」との関係
- `CL/epe/`は別プロジェクト＝バッグブランド「epe」本体（エペナイロンはそのナイロン素材ライン）。ロゴ意匠は共通ファミリー（フラッグ/ウェーブ+「epe」ワードマーク）で一貫している
- **デザイン・写真トーンを寄せる意図ではない**（誤読して確認したが訂正済み）。**見た目のトーンは現行の暗い都市コンクリート路線を継続**でOK
- 「epeに合わせたい」の実際の意味＝**Shopify管理画面・設定（支払い等）をepe本体のストアに揃えたいという運用面の話**。epe本体のShopify管理画面へのアクセスも別途もらう想定（要確認：クロコ用アカウント招待 or Theme Access）

## TOPページ（SP）
- ルートフレーム：`P1TxHU`「TOP page (SP)」。幅390px基準
- ヘッダーはPC版と別コンポーネント`AlAat`「HeaderSP」（ロゴ＋検索/カート/ハンバーガーメニューの3アイコン。ナビ項目はハンバーガー内想定でこの段階では未展開）
- Product/Styling/Blogのグリッドは横3列→**縦1列積み**に変更（Pencilのflexboxが単軸でwrap非対応のため、SPは列を組まず単純に縦積みが安全）
- Contactのテーブル行はラベル+値の横並び→**縦積み**に変更（横幅不足のため）
- Hero/Materialは`layout:"none"`の絶対配置なので、テキスト量に応じてブロック同士がぶつからないよう毎回snapshot_layoutで実寸を確認してから座標を詰めること（実際にHeroで本文とスライダーが重なる事故があり、座標調整で解消済み）
- 画像は全てPC版と同じくグレープレースホルダー

## 2026-08-14 追加修正
- **ヘッダーはロゴ左端／ナビ+アイコンをまとめて右端寄せに修正**（グローバルCLAUDE.mdの「両端寄せ」ルールを反映）。Headerコンポーネント(`r4yvFI`)内に`RightGroup`フレームを作りNav+Rightアイコンをそこにまとめ、Header直下は[Logo, RightGroup]の2要素space_betweenに変更。TOP(PC)・商品詳細(PC)両方に自動反映済み
- **Footerを正式デザインに変更**（旧プレースホルダー"Footer"文字から差し替え）。PC=`bRR5P`（ブランドブロック+3カラムナビ(Navigation/Information/Legal)+区切り線+コピーライト）、SP=新規コンポーネント`FooterSP`(`PPRop`、縦積み版)。TOP(SP)のFooterインスタンスは`PPRop`参照に張り替え済み。Legal列（プライバシーポリシー/利用規約/特定商取引法に基づく表記）はダミーリンク、実ページは今後作成
- Materialのグレー写真化はPC(`XvYc0`)/SP(`FBrz8`)とも対応済み（確認のみ、変更なし）

## 商品詳細ページ（PC）
- ルートフレーム：`L4tc6Y`「Product Detail Page (PC)」
- Pencilの参考画像2枚（`CleanShot 2026-05-11 at 11.28.59 2.png`＝OAQtN、`CleanShot 2026-05-11 at 11.48.07 2.png`＝fm1IU）はエペナイロン専用デザインではなく、**Shopifyテーマ本体のデモページ**（雑貨/アパレルのダミー商品ページとContactページテンプレ）と判明。ブランド固有の参考ではないため、他ページは都度トップの世界観を踏襲して新規設計する方針
- 構成：Header(コンポーネント`r4yvFI`使い回し)／パンくず／メイン(ギャラリー+商品情報パネル：カラー・サイズ・数量・カートボタン・アコーディオン)／Description(説明文+スペック表)／You may also like(`dPk87`ImageCard使い回し)／Footer
- **Footerを`bRR5P`で reusable化**（TOPページのFooterをそのままコンポーネント化し、他ページはref instanceで使い回す）
- 商品名・価格・スペック等は全てダミー内容（実データ未確定）。実商品情報が来たら差し替え必須

## 素材・参考
- brief/ に素材（ロゴ・商品写真・参考等）を格納
- output/ に成果物を格納

## 2026-08-15：Shopifyフルカスタム実装（theme/）
`01_CRATER/_SERVICE/Shopify ECテンプレ/theme/` をフォークし、`CL/エペナイロン/theme/` に構築。Pencil正ファイル（`pencil/01pencil.pen`）を精読してそのまま忠実にLiquid化した。

**デザイントークン**：`layout/theme.liquid`の`:root{--epe-*}`に集約（Pencilの変数をそのまま反映）。
`--epe-section-bg:#3B393A` / `--epe-footer-bg:#000000` / `--epe-text-white:#FFFFFF` / `--epe-text-body:#E4E4E4` / `--epe-text-muted:#ADADAD` / `--epe-line:#6B6B6B` / `--epe-button-bg:#000000` / `--epe-img-placeholder:#C7C7C7` / `--epe-img-placeholder-dark:#4D4D4D`。フォントは`--epe-en:Poppins` / `--epe-jp:Noto Sans JP`。全ページ共通でこのダークトーン背景に統一（Dawn標準ページ＝カート/ポリシー/404/検索/コレクション一覧/会員ページも色変数を上書きしてダーク化）。

**新規セクション**（`sections/epe-*.liquid`、全て`@media(max-width:768px)`でSP対応済み）：
| ファイル | 内容 | Pencil対応 |
|---|---|---|
| `epe-header.liquid` | 透過ヘッダー。ロゴ左/Nav+SNS+検索+カート右。SPはハンバーガードロワー（Pencil未設計のため新規実装） | `r4yvFI`/`AlAat` |
| `epe-footer.liquid` | Brand+3カラム(Navigation/Information/Legal)+コピーライト | `bRR5P` |
| `epe-hero.liquid` | KVスライダー（ブロック=スライド、自前JS。矢印/カウンター/ドット付き） | `shArn`/`ZftXC` |
| `epe-about.liquid` | テキスト+写真の2カラム（SPは縦積み） | `Wld2W`/`y6OdP` |
| `epe-product-lineup.liquid` | TOP商品プレビュー3点（コレクション連動、未選択時ブロック） | `E6kRUw`/`BHSNu` |
| `epe-material.liquid` | 全面写真+テキストオーバーレイ（絶対配置） | `XvYc0`/`FBrz8` |
| `epe-styling.liquid` | ルックブック風3点グリッド（キャプションなし） | `E5kL2`/`HVE8i` |
| `epe-contact.liquid` | 店舗情報テーブル+写真 | `pWtSp`/`BYVdi` |
| `epe-blog.liquid` | TOPブログプレビュー6点（ブログ連動、未選択時ブロック） | `dPbwv`/`N06AT` |
| `epe-product.liquid` | 商品詳細フルページ。パンくず/ギャラリー/カラー・サイズ選択(実バリアント連動JS)/数量/カート追加/アコーディオン/説明/スペック表/関連商品 | `L4tc6Y` |
| `epe-collection.liquid` | 商品一覧（Pencil未着手のため既存トーンで新規デザイン） | 新規 |
| `epe-blog-list.liquid` / `epe-article.liquid` | ブログ一覧・記事詳細（Pencil未着手のため新規デザイン） | 新規 |
| `epe-legal.liquid` | 特定商取引法など法定ページ用テーブルレイアウト | 新規 |

**スニペット**：`snippets/epe-image-card.liquid`（Pencilの`dPk87`ImageCard相当。image/link/name/price受け取り）、`snippets/epe-blog-card.liquid`（`Wzi8p`BlogCard相当）。

**テンプレート組み立て済み**：`index.json`(TOP)／`product.json`(商品詳細)／`collection.json`(商品一覧)／`blog.json`／`article.json`／`page.legal-notice.json`(特定商取引法。Shopify管理画面でhandle=`legal-notice`のページを作成しこのテンプレを割り当てる必要あり)。プライバシーポリシー・利用規約はShopify標準の自動生成ポリシーページ（管理画面 設定＞法律 で入力）をそのままダーク配色で使う方針。

**ダミーデータに関する重要な注意（据え置き）**：
- Contact欄の住所電話・Blog記事は元Pencilが別の実在店舗（Baracca）のダミーだったため、Liquid化にあたり**汎用プレースホルダー文言に置き換え済み**（実データ確定後は管理画面から設定するだけでよい設計）
- 商品のカラー展開（Black/Gray/Navy等の英語カラー名）は`epe-product.liquid`内にswatch色マッピングを実装済み。実際の商品オプション値がこの想定と異なる名称になる場合は`epe-product.liquid`のcase/whenブロックに追記が必要

## 2026-08-15：追加4ページ、Pencilにも反映
Liquidを先に組んだ4種のページ（商品一覧・ブログ一覧・ブログ記事詳細・カート・特定商取引法＝5ページ）を、後追いでPencil(`01pencil.pen`)にも同一構成で作成。Pencilが正、の原則を維持。
- 商品一覧 (PC)：`hg9gi`
- ブログ一覧 (PC)：`eokQx`
- ブログ記事詳細 (PC)：`rYLEK`
- カート (PC)：`PFpV8`
- 特定商取引法 (PC)：`y5HRb`

いずれもHeader(`r4yvFI`)/Footer(`bRR5P`)を使い回し、Liquid実装（`epe-collection.liquid`/`epe-blog-list.liquid`/`epe-article.liquid`/カート標準画面のダーク化/`epe-legal.liquid`）と同一内容。SP版は未着手（Liquid側は`@media(max-width:768px)`で対応済みだが、Pencilでの正式なSPワイヤーは今後）。

## 2026-08-15 追記：Journalリネーム・ページヒーロー統一・ギャラリー比率修正
- **Blog→Journal**：Header/Footerのナビ表示、TOPのBlogセクション見出し、ブログ一覧タイトル、記事詳細の戻るリンクなど、表示文言を全て「Journal」に統一（PencilとLiquid両方）。内部的なファイル名・Shopifyの`blog`オブジェクト名はそのまま（Shopify側の仕様用語のため）
- **ページヒーロー（パンくず+タイトル）統一**：商品一覧(Shop)のパンくず(12px)+タイトル(48px)パターンを共通CSS化（`theme.liquid`の`.epe-pagehero`）し、Journal一覧・特定商取引法・カートページにも同一適用。カートはDawn標準の`main-cart`を使うのをやめ、`epe-cart.liquid`を新規に完全自作（実カート機能：数量更新・削除・チェックアウト）に切り替え
- **商品詳細ギャラリーの比率統一**：メイン画像とサムネイルを同じ縦横比(4:5)に統一。サムネイルは4列グリッドにしたので、5枚目以降は自動で2段目に折り返す仕様（Pencilでは2段の例を実際に作成）
- **Pencil側の不具合修正**：新規5ページ作成時に誤って存在しない変数`$epe-en`/`$epe-jp`を指定していたため、フォントが変数参照されずリテラル値に固定されていた（表示は偶然崩れなかったが、トークン一元管理の仕組みから外れていた）。正しい変数`$epe-font-en`/`$epe-font-jp`に全78ノード一括修正済み

**未対応・次のアクション**：
- ロゴ以外の実画像（KV・商品写真）は未反映。ケイスケさん制作分が届き次第、各セクションの`image_picker`設定に差し替え
- 商品登録（バリエーション・在庫）はまだ。商品マスタ確定後にShopify管理画面で登録
- Shopifyストアへの実デプロイ（Theme Access等でのpush）は未実施。ロードマップPhase 5の残タスク
- コンテンツ確定（About/Material本文、Contact実データ、Tokushoho実データ）は`ロードマップ.html` Phase 3のまま未着手
