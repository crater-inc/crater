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

## 2026-08-15 追記：商品詳細ギャラリー調整＋DAY PACK実原稿を反映（`epe-product.liquid`）
- **ギャラリーの比率調整**：メイン画像を一回り小さく（ギャラリー列を`flex:1`→`width:42%`）、情報パネル列をその分広げた（固定460px→`flex:1`可変）
- **サムネイル**：4列→6列グリッドに変更、枚数上限も撤廃（`product.images limit:4`→全件ループ、プレースホルダーも12枚に）。5枚以降は自動で2段目・3段目に折り返す
- **左カラム固定スクロール**：`.epe-pdp__gallery{position:sticky;top:24px}`を追加。右の情報パネルだけがスクロールし、左の画像は画面内に留まる仕様に（スマホは`position:static`で従来通り縦積み）。Playwrightで1600px幅の静的プレビューを作りスクロール前後のスクショで動作確認済み
- **DAY PACK実原稿を投入**：`CL/エペナイロン/brief/商品詳細情報/デイパック原稿案.docx`から抽出した実コピーを`templates/product.json`のセクション設定に反映（schemaのデフォルト値は汎用のまま維持し、product.json側だけ上書き）
  - Description本文：CORDURA® RE/COR™素材の説明
  - SPECテーブル：Item Number/Name/Color/Material/Size/Capacity/Weight/Country Of Origin の8項目（実データ：epe201・¥25,300は商品自体の価格なので実商品登録時にShopify側で設定）
  - アコーディオン5本：Fabric/Zipper・Pocket & Storage・Chest Belt/Details・Gift Wrapping・Shipping & Returns（原稿の全項目を分類して格納）
- 商品タイトル・価格自体（`product.title`/`product.price`）はShopify側の実商品レコードに依存するため、商品登録時に「DAY PACK」「¥25,300」で登録すれば自動反映される

## 2026-08-15 追記：Pencil/Liquid同時反映を標準ルール化、アコーディオン→長いページ化
- ケイスケさんから「pencilは毎回やってください」「というかわからなくなるのでどちらも毎回よろ」と明確な指示。以後、Liquidのデザイン変更は聞かれなくても毎回Pencil側にも反映する（[[feedback_pencil_liquid_同時反映必須]]として記録）
- 上記の商品詳細ギャラリー調整（画像縮小・6列サムネイル・sticky）とDAY PACK実データを、Pencil側の商品詳細ページ(`L4tc6Y`)にも反映。ギャラリー列472px固定＋情報パネルfill_container、サムネイル6列×2段、商品名/価格/SPEC8項目/コンテンツをDAY PACK実データに統一
- ケイスケさんがPencilを直接見ていて発覚したバグ2件を修正：①ジャーナル一覧ページのヒーロー(`BbWXb`)が`layout`未指定でパンくずとタイトルが横並びになっていた→`layout:"vertical"`を追加 ②記事詳細ページ(`rYLEK`)でタイトルと画像の間にgapがなく密着していた→タイトルブロック(`USezG`)にpadding-bottom 32を追加
- ヘッダーの左右余白について確認依頼があったが、Pencil(`r4yvFI`/`AlAat`)とLiquid(`epe-header.liquid`)のpadding・gap値はPC/SP含め既に完全一致していたため変更なし
- **アコーディオン→常時表示の「長いページ」に変更**：商品詳細の詳細情報（Fabric/Zipper・Pocket & Storage・Chest Belt/Details・Gift Wrapping・Shipping & Returns）は、クリックで開く方式をやめて全て常時展開の縦積みセクションに変更。Liquidは`section.blocks`のtype名を`accordion`→`detail_section`にリネームし、JSのトグル処理を削除。Pencil側もアコーディオン風の行(`EVTMi`)を削除し、見出し+本文の`DetailsSection`を新設して同内容を反映
- **同日追記：長いページ化した詳細セクションを右カラム（スクロール側）に移動**。ギャラリー左固定＋右パネルスクロールの構成にした意図（右側をスクロールしてもらう流れ）に合わせて、Fabric/Zipper等の詳細セクションはDescription/SPECより下の全幅エリアではなく、右の情報パネル内（Add to Cart / Wishlistの直下）に配置し直した。Description見出し・本文・SPECテーブルは従来通りSPECテーブルは全幅エリアに残す。Liquid: `.epe-pdp__details`をInfoPanel内に移動しwidth:700px→100%に変更。Pencil: `DetailsSection`を`EgrxB`(DescriptionSection)から`SV7Mo`(InfoPanel)のWishRowの後ろにMoveしwidth:fill_containerに変更
- **同日再追記：デイパック原稿案.docxの構成通りに9〜11項目へ分割し、各項目に画像エリアを追加**。ケイスケさんから「ワードにあるように、画像を入れる領域をちゃんととってください。ワードは指示なので」と明確な指示。元原稿は【FABRIC】【FABRIC】【ZIPPER】【FRONT POCKET】【SIDE POCKET】【PC ROOM】【MAIN ROOM】【CHEST BELT】【PISNAME】と9つの見出しブロックに分かれており、それぞれが写真1枚とセットになる想定（GIFTセクションも原稿に「ギフト写真（準備中）」と明記あり）。それに合わせて詳細セクションを5個の統合ブロックから11個（FABRIC×2・ZIPPER・FRONT POCKET・SIDE POCKET・PC ROOM・MAIN ROOM・CHEST BELT・PISNAME・GIFT・Shipping & Returns）に分割し直し、各項目の先頭に画像プレースホルダーを追加。Shipping & Returnsのみ画像なし（原稿に写真の言及なし）。Liquid: `detail_section`ブロックに`image`(image_picker)と`hide_image`(checkbox)設定を追加。

## 2026-08-15 追記：ダミー画像の比率を全ページ16:9に統一（グローバルルール化）
ケイスケさんから「画像の比率が毎回ページごとに違うのが気になる。他の案件でも。一旦16:9で統一しませんか」と明確な指示。**グローバルCLAUDE.md（`~/.claude/CLAUDE.md`）の「画像・ビジュアル配置のルール」に反映済み**：ダミー・プレースホルダー画像枠は指示がなくても16:9をデフォルトにする。KV・既に確定済みの画像枠（今回は商品詳細ページ左のメイン商品写真）は対象外。

エペナイロン内の該当箇所を全て16:9に修正（商品詳細の左ギャラリー＝メイン画像＋サムネイルのみ、ケイスケさんの明示的な指示により対象外・4:5のまま維持）：
- 商品詳細の詳細セクション画像（4:3→16:9）
- 商品一覧/TOP商品ラインナップ/関連商品/Stylingの商品カード画像（`epe-image-card`スニペット、旧280px固定→`aspect-ratio:16/9`に変更。未使用だった`height`パラメータも削除）
- Journal一覧/TOPジャーナルプレビューのカード画像（`epe-blog-card`、旧240px固定→`aspect-ratio:16/9`）
- 記事詳細のメイン画像（旧420px固定→`aspect-ratio:16/9`）
- Pencil側も全ページ同数値で追従：dPk87(ImageCard)参照インスタンス・Wzi8pマスターの内部画像・Shop/Journal一覧の個別カード・About/Contact写真・記事詳細メイン画像・商品詳細の詳細セクション画像を、それぞれの実測幅×9/16で計算した高さに一括更新（layout問題なし確認済み）
- 対象外にしたもの：Hero/KV（1340/793、CLAUDE.mdの790px基準ルールが優先）、Material全幅バナー（KVに準じる雰囲気の全画面ビジュアルのため据え置き）、カート内の商品サムネイル（110×110、UI要素であり content画像ではないため）

## 2026-08-15 追記：商品詳細ギャラリー110%拡大／TOP ProductをPickup Product化
- **商品詳細の左ギャラリー**：比率(4:5)は維持したまま110%に拡大。Liquid `.epe-pdp__gallery{width:42%→46%}`、右の情報パネルは`flex:1`で自動的に幅が縮む。Pencilはgallery幅472→519、メイン画像高さ590→649、サムネイル高さ90→100（すべて実測比率から計算）
- **TOPのProductセクション→Pickup Productに改称**：実装を確認したところ、コレクション連動だが`limit:3`で常に3点固定表示（無限スクロールを組んでも常に3点しか出ないため意味がない——技術的に無限スクロールが作れないという意味ではなく、現状`limit:3`のせいで作っても意味がないという説明だった。誤解されたので明示的に補足済み）。カレクション未登録数に依存せず「TOPは厳選3点、全商品は別途Shopページで見せる」という設計判断のもと、無限スクロール化はせず**Pickup Product**に改称して据え置き。カード比率は商品詳細ページと揃えて4:5の縦長に変更（`epe-image-card`スニペットに`ratio`パラメータを追加、デフォルト16:9・Pickup Productのみ4:5指定）。Pencil側は見出しテキストとフレーム名を「Pickup Product」に変更、カード画像を472(=377.33×5/4)に変更

## 2026-08-15 追記：Pickup Product・Stylingにキャプション追加
確認したところPencil側でPickup ProductとStylingのカードにはキャプション用テキストノードが存在しなかった（Stylingは元々「キャプションなしのルックブック風」として意図的に設計）。ケイスケさんの指示で両方に追加：
- **Pickup Product**：商品名＋価格キャプションを追加（Liquidは元々`epe-image-card`にname/price渡していたため表示済みだったが、Pencilには無かったので追加。プレースホルダーは他ページと同じ「商品名が入ります」「¥0,000（税込）」に統一）
- **Styling**：新たに`caption`フィールドをブロックスキーマに追加（Liquid: `epe-styling.liquid`のblocks設定に`caption`(text)追加、`epe-image-card`のname引数に渡す）。プレースホルダーは「Look 01」「Look 02」「Look 03」
- Pencil側はどちらも各カードをCardラッパーフレーム(vertical, gap14)に組み替え、画像refをその中にMoveしてから名前/価格またはキャプションのテキストノードを追加

## 2026-08-16 追記：商品詳細の詳細セクション画像、Pencilだけ16:9になってなかったバグを修正
ケイスケさんの実測指摘（Pencil上で605×367＝比率1.65を確認、イラレでも検証）で発覚。Liquid側`.epe-pdp__detail-img`は8/15の16:9統一時点で`aspect-ratio:16/9`に正しくなっていたが、**Pencil側だけ605×367のまま取り残されていた**（原稿docx分割作業とタイミングがズレて16:9統一パスから漏れた）。該当10箇所（FABRIC×2/ZIPPER/FRONT POCKET/SIDE POCKET/PC ROOM/MAIN ROOM/CHEST BELT/PISNAME/GIFT。Shippingは元々hide_imageで画像なし）を605×340.3125（16:9）に修正。
- **教訓**：Liquid⇄Pencilの一括統一作業は、後から追加されたセクション（今回でいう詳細セクションの11分割）が漏れやすい。全ページ一括系の修正をした後は、後発で追加された領域が対象に含まれているか個別に再確認する。

## 2026-08-16 追記：商品詳細ページ SP版をPencilに新規作成
これまで商品詳細ページはPencil上にPC版（`Product Detail Page (PC)` = L4tc6Y）しかなく、SP版が存在しなかった（TOPページはPC/SP両方あるが、商品詳細を含む他の下層ページは軒並みPC版のみ）。ケイスケさんの指示で新規作成：`Product Detail Page (SP)`（幅390、L4tc6Yの下に配置）。
- Liquidのモバイルブレークポイント（`@media(max-width:900px)`）に忠実：ギャラリー→情報パネルの縦積み、メイン画像・サムネイルは4:5のまま（PC同様に対象外）、サムネイル4列×3段、詳細セクション画像は16:9（342幅×9/16=192.375）、Description/SPECテーブル/関連商品は幅100%・関連商品は1カラム縦積み
- 詳細セクション10項目は原稿docxの実文言（FABRIC〜GIFT）をそのまま使用
- Color/Size/Quantity/Add to Cart/Wishlistは構造のみ再現（実バリエーション未登録のためプレースホルダー）
- **未対応で気づいた点（今回のスコープ外・要確認）**：TOPページSP版のPickup Product/Styling（`BHSNu`/`HVE8i`内の`dPk87`参照、height:300）も実は4:5(342幅なら427.5)になっておらず、詳細セクションと同種のズレが残っている可能性。指摘があれば次回修正。

## 2026-08-16 追記：Shopifyストア接続完了（下書きテーマとしてpush済み）
- ストアURL：`prwybv-g4.myshopify.com`（epe | nylon）。オーナーはkskakari@gmail.com（株式会社クレーターが「組織のオーナー」＝A CURRYなど他ストアと同じShopify組織配下）
- **コラボレーター招待・Theme Accessアプリは不要と判明**：オーナー本人のアカウントでCLIから直接OAuthログインすれば繋がる。ユーザー枠の上限エラーは無関係で、単にBasicプラン等の仕様（プラン改定でスタッフ0人枠）が原因だった可能性が高い（組織全体でユーザー枠がプールされる、という仮説は調査の結果誤りと判明。Shopify公式ヘルプによれば上限はストアごとに独立）
- ケイスケさん本人のターミナルで`shopify theme push --unpublished --store=prwybv-g4.myshopify.com`を実行→デバイス認証コードでログイン→テーマ名「EPE NYLON - Draft」で下書きとしてpush成功（**Bash直接実行はClaude Codeの自動モード分類器にブロックされるため、本番外部サービスへの書き込み系コマンドは毎回ケイスケさん本人のターミナル実行が必要**）
- 下書きテーマID：`160914014393`。プレビューURL：`https://prwybv-g4.myshopify.com?preview_theme_id=160914014393`（本番非公開・関係者のみ閲覧可）。エディタ：`https://prwybv-g4.myshopify.com/admin/themes/160914014393/editor`
- **次のアクション**：プレビュー内容の確認（実装ズレ・文字化け等がないか）→ 問題なければ商品登録・実画像差し替え → 最終的に「このテーマを公開する」で本番切り替え（要ケイスケさん確認、無断で公開しない）
- **未対応で見つけたもの**：商品詳細ページの関連商品（Related Products）もPencil側にキャプションが無い状態（Liquidにはname/price渡し済み）。今回のスコープ外だったため未着手。次に触るときはここも要確認
