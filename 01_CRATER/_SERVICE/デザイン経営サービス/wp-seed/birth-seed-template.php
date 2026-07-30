<?php
/* BIRTH 記事テンプレ見本 投入（一度きり・実行後に必ず削除） */
define('BIRTH_SEED_KEY', 'croco-seed-tpl-4412');
if (!isset($_GET['k']) || $_GET['k'] !== BIRTH_SEED_KEY) { http_response_code(403); die('forbidden'); }

require_once dirname(__FILE__) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
header('Content-Type: text/plain; charset=utf-8');

$slug = 'article-template';
$title = '記事テンプレート｜見出し・リード・表などの見本';
$img = 'https://birth.business/lp-img/1783430780891.jpg';

$body = <<<HTML
<p>これは記事の「型」を確認するためのテンプレート記事です。リード文はここに2〜3行。この記事で何が分かるかを結論から書き、続きを読む理由をつくります。以下に、記事で使う要素（見出し・本文・リスト・表・引用・図）を一通り並べています。<strong>この記事を複製して、中身を差し替えれば1本書けます。</strong></p>

<h2>見出し2（H2）｜大きな区切り</h2>
<p>本文はこのサイズ・行間で表示されます。1段落＝1メッセージを意識すると読みやすくなります。文中に<a href="https://birth.business/">リンク</a>や<code>コード表記</code>、<strong>強調</strong>を入れるとこう見えます。</p>

<h3>見出し3（H3）｜中くらいの区切り</h3>
<p>H2の下の小見出しです。話題を細かく分けるときに使います。</p>

<h4>見出し4（H4）｜小さな区切り</h4>
<p>さらに細かい見出し。使う頻度は少なめでOKです。</p>

<h2>リスト</h2>
<p>箇条書き（順不同）：</p>
<ul>
<li>資産を棚卸しする</li>
<li>候補を複数描く</li>
<li>一本を選んで育てる</li>
</ul>
<p>番号付き（手順）：</p>
<ol>
<li>ヒアリングシートを書く</li>
<li>選定面談で方向性を確かめる</li>
<li>構想フェーズで事業案をまとめる</li>
</ol>

<h2>表（テーブル）</h2>
<p>比較や料金など、整理して見せたいときに。スマホでは横スクロールで崩れません。</p>
<figure class="wp-block-table"><table>
<thead><tr><th>フェーズ</th><th>内容</th><th>費用</th></tr></thead>
<tbody>
<tr><td>STEP 00</td><td>相談・選定面談</td><td>¥0</td></tr>
<tr><td>STEP 01</td><td>構想フェーズ（事業構想書3案）</td><td>¥200,000〜</td></tr>
<tr><td>STEP 02</td><td>協業フェーズ（試作〜販売まで伴走）</td><td>ASK</td></tr>
</tbody>
</table><figcaption>表のキャプション（任意）</figcaption></figure>

<h2>引用</h2>
<blockquote><p>まだ名前のない事業を、一緒に。会社の資産から、もう一本の柱をつくる。</p></blockquote>

<h2>図（画像＋キャプション）</h2>
<figure><img src="https://birth.business/lp-img/1783427199750.jpg" alt="サンプル画像"><figcaption>画像のキャプション（任意）</figcaption></figure>

<hr>

<h2>まとめ</h2>
<p>結論の再確認と、次の一歩（相談・ヒアリングシートへの導線）で締めます。テンプレはここまで。</p>
HTML;

$existing = get_page_by_path($slug, OBJECT, 'post');
if ($existing){ echo "skip(exists): $slug\n=== done ===\n"; exit; }

$pid = wp_insert_post(array(
  'post_title'   => $title,
  'post_name'    => $slug,
  'post_content' => $body,
  'post_status'  => 'publish',
  'post_type'    => 'post',
  'post_date'    => '2026-07-08 12:00:00',
));
if (is_wp_error($pid) || !$pid){ echo "ERR insert\n"; exit; }

$t = term_exists('設計','category');
if (!$t){ $t = wp_insert_term('設計','category'); }
if ($t && !is_wp_error($t)) wp_set_post_categories($pid, array((int)$t['term_id']));

$img_id = media_sideload_image($img, $pid, $title, 'id');
if (!is_wp_error($img_id)) set_post_thumbnail($pid, $img_id);
else echo "img err: ".$img_id->get_error_message()."\n";

echo "OK: $slug (post $pid)\n=== done ===\n";
