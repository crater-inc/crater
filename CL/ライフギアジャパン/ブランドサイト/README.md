# HEEKES ブランドサイト（STUDIO → 静的HTML 移植）

heekes.jp をSTUDIOから静的HTMLへ丸ごと移植したもの。

## フォルダ構成

```
ブランドサイト/
├ heekes-html/            ← 制作物（このフォルダをそのままサーバーに上げる）
│  ├ index.html           トップ
│  ├ about.html           ABOUT
│  ├ products.html        PRODUCTS
│  ├ news.html            NEWS一覧
│  ├ news-heekes-site-release.html  NEWS記事（1本目）
│  ├ contact.html         CONTACT
│  ├ policy.html          プライバシーポリシー
│  ├ 404.html             404ページ
│  └ assets/
│     ├ css/style.css     全ページ共通のスタイル
│     ├ js/main.js        スクロール出現アニメ＋スマホメニュー
│     └ img/              画像一式（STUDIOから原寸で回収）
└ 参考_現行STUDIO/         移植元の見た目を記録したスクリーンショット
```

## 移植のやり方

STUDIOの設計データ（page-views JSON）が公開状態で取得できたため、
見た目を目分量でコピーするのではなく、**STUDIOが内部で持っていた実数値**
（色・書体・文字サイズ・余白・ブレークポイント・アニメーションの秒数と
イージング）をそのまま移植している。

- カラー：`#dc121e`（本文・KV・ボタン）／`#d32f2f`（ヘッダーナビ・フッター背景）
- 欧文：Montserrat（500 / 600 / 700）※STUDIO版と同じGoogle Fonts v1 APIで読み込み
- 和文：Mac / iPhone は端末内蔵のヒラギノ角ゴ、それ以外は Noto Sans JP
- ブレークポイント：1140px（タブレット）／840px（スマホ）／540px

### 和文書体について

STUDIO版はモリサワのWebフォント「ヒラギノ角ゴ W3 / W6」を使っていた。
これはSTUDIOの契約に含まれるもので、**STUDIOを離れると使えなくなる**。
そのため以下のフォールバックにしている。

- Mac / iPhone → 端末内蔵のヒラギノ角ゴ ProN（＝ほぼ同じ見た目）
- Windows / Android → Noto Sans JP

全端末で完全に同じ見た目にしたい場合は、モリサワ TypeSquare の
直接契約（年額）が必要。

## お問い合わせフォーム

`contact.html` の中に、BowNowのタグを貼る場所を用意してある。

```html
<div class="bownow-form">
  <!-- ここにBowNowのタグを貼る -->
</div>
```

BowNowでHEEKES用のフォームを作成し、発行されたタグをこの中に貼れば動く。
貼ったら、そのすぐ下にある「見た目確認用フォーム」の `<form>〜</form>` を
丸ごと削除する。

## NEWSの更新方法

`news.html` の中の `<a class="news-card">` のかたまりをコピーして、
リンク先・画像・タイトル・日付を差し替える。新しい記事ほど上に置く。

記事ページは `news-heekes-site-release.html` をコピーして中身を書き換える。

## 現行STUDIO版で見つかった不具合（移植時に対応済み）

| # | 内容 | 対応 |
|---|------|------|
| 1 | スマホでグローバルメニューが消え、ナビにアクセスできない | ハンバーガーメニューを実装 |
| 2 | プライバシーポリシーの本文がKECELUNの商品説明文のまま | 一般的なポリシーのたたき台を作成（**要ライフギアジャパン確認**） |
| 3 | トップのタイトルが「消化用具」（正しくは消火用具） | 修正 |
| 4 | `/products` のタイトルが「PRODUTS」 | 修正 |
| 5 | `/news` `/contact` `/posts` のタイトルが「SMARTCOMPANY \| 〜」 | 修正 |
| 6 | ABOUTの「スマートカンパニーの4つの行動指針」 | 「HEEKESの4つの行動指針」に修正 |
| 7 | モバイルメニューの「PRAVACY POLICY」 | 「PRIVACY POLICY」に修正 |
| 8 | 記事本文「さらに今後、や資料ダウンロード機能も」（脱字） | 「お問い合わせフォームや資料ダウンロード機能も」に修正 |
| 9 | PRODUCTSの2本目のYouTubeが埋め込み禁止設定で巨大な空白になる | いったん止めた（**要YouTube側の設定変更**） |
| 10 | 入力欄のfont-sizeが15pxでiOSが自動ズームする | 16pxに変更 |

## 残っている対応（クライアント側）

- **プライバシーポリシーの内容確認**（`policy.html` のたたき台をライフギアジャパン様に確認）
- **YouTube「KECELUN動画撮影［字幕］」の埋め込み許可**
  （YouTube Studio → 動画の詳細 → その他のオプション → 埋め込みを許可する）
- 1本目の動画タイトルが「索材別実証実験」（正しくは素材別）。YouTube側で修正が必要
- BowNowフォームの作成とタグの発行
