<?php
/* BIRTH デモ記事シード（一度きり・実行後に必ず削除する） */
define('BIRTH_SEED_KEY', 'croco-seed-8871');
if (!isset($_GET['k']) || $_GET['k'] !== BIRTH_SEED_KEY) { http_response_code(403); die('forbidden'); }

require_once dirname(__FILE__) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

header('Content-Type: text/plain; charset=utf-8');

function birth_cat_id($name){
  $t = term_exists($name, 'category');
  if ($t) return (int)$t['term_id'];
  $r = wp_insert_term($name, 'category');
  return is_wp_error($r) ? 0 : (int)$r['term_id'];
}

$posts = array(
  array(
    'slug'  => 'tech-to-business',
    'title' => '会社の技術を「事業」に変える、最初の一歩。',
    'cat'   => '視点',
    'date'  => '2026-06-30 10:00:00',
    'img'   => 'https://birth.business/lp-img/1783427208967.jpg',
    'body'  => "<p>技術も設備もある。人も、販路もある。それなのに「事業」にはなっていない——そんな会社は少なくありません。持っているものと、事業のあいだには、意外と大きな距離があります。その距離を縮める最初の一歩は、いまある資産を一度ていねいに棚卸しし、外の目で見つめ直すことです。</p>\n<h2>まず、当たり前を疑う</h2>\n<p>自社では当たり前になっている技術ほど、外から見ると価値の塊だったりします。「これは普通」と思っている工程が、別の市場では誰も持っていない強みになる。社内の常識を一度手放して、他業種の目線で自分たちを眺めてみる。ここに、新しい事業の芽が眠っています。</p>\n<h2>一本に絞らず、まず並べる</h2>\n<p>最初から「これだ」と一本に決めないことも大切です。生まれうる事業の候補をいくつも描き出し、収支や実現性を並べて比べる。選ぶのはそのあとで十分です。可能性を先に広げるほど、選んだ一本の確度は上がります。</p>\n<h2>まとめ</h2>\n<p>最初の一歩は、大きくなくていい。まずは自社の資産を棚卸しして、外から見つめ直すこと。そこから、まだ名前のない事業がはじまります。</p>"
  ),
  array(
    'slug'  => 'keep-new-business',
    'title' => '新規事業が続かない理由と、続ける仕組み。',
    'cat'   => '設計',
    'date'  => '2026-06-18 10:00:00',
    'img'   => 'https://birth.business/lp-img/1783427208968.jpg',
    'body'  => "<p>新規事業は、立ち上げること以上に「続けること」が難しい。勢いで走り出したものの、半年もすると社内で誰も見なくなる——よくある話です。続かないのには、たいてい構造的な理由があります。</p>\n<h2>属人化と、目的の曖昧さ</h2>\n<p>担当者ひとりに乗っかった事業は、その人が忙しくなった瞬間に止まります。そして「何のためにやるのか」が曖昧なままだと、既存事業の忙しさに簡単に負けてしまう。続かないのは根性の問題ではなく、仕組みの問題です。</p>\n<h2>小さく回し、伴走者を置く</h2>\n<p>いきなり大きく始めず、小さく試して学びながら育てる。そして、社内だけで抱えず、外に「一緒に考え続ける頭脳」を置く。この二つがあるだけで、事業は驚くほど続きやすくなります。</p>\n<h2>まとめ</h2>\n<p>続ける仕組みは、始める前から設計できます。属人化を避け、目的を言語化し、小さく回して伴走者を持つ。それが、二本目の柱を育てる土台になります。</p>"
  ),
  array(
    'slug'  => 'factory-second-pillar',
    'title' => '町工場から生まれた、もう一本の柱。',
    'cat'   => '事例',
    'date'  => '2026-06-05 10:00:00',
    'img'   => 'https://birth.business/lp-img/1783427210948.jpg',
    'body'  => "<p>精密加工を得意とするある町工場。長年、大手の下請けとして高い技術を積み上げてきました。けれど受注は景気に左右され、「自分たちの名前で残るものをつくりたい」という思いがずっとありました。</p>\n<h2>技術を、生活の中へ</h2>\n<p>そこで着目したのが、加工技術そのものではなく「その技術でしか出せない手ざわり」でした。図面通りに削る力を、生活の中に置きたくなるプロダクトへ。用途を変えるだけで、同じ技術がまったく別の価値になりました。</p>\n<h2>つくって終わりにしない</h2>\n<p>試作を重ね、ブランドとして仕立て、売り先まで一緒に設計する。つくって終わりではなく、売れ続ける形まで伴走する。こうして、下請けだけだった会社に、自分たちの名前を掲げた「もう一本の柱」が生まれました。</p>\n<h2>まとめ</h2>\n<p>特別な設備を新しく買う必要はありませんでした。いまある技術の見方を変えるだけで、事業は生まれます。あなたの会社にも、きっと原石が眠っています。</p>"
  ),
);

$out = array();
foreach ($posts as $p){
  $existing = get_page_by_path($p['slug'], OBJECT, 'post');
  if ($existing){ $out[] = "skip(exists): ".$p['slug']; continue; }
  $pid = wp_insert_post(array(
    'post_title'   => $p['title'],
    'post_name'    => $p['slug'],
    'post_content' => $p['body'],
    'post_status'  => 'publish',
    'post_type'    => 'post',
    'post_date'    => $p['date'],
  ));
  if (is_wp_error($pid) || !$pid){ $out[] = "ERR insert: ".$p['slug']; continue; }
  $cid = birth_cat_id($p['cat']);
  if ($cid) wp_set_post_categories($pid, array($cid));
  // アイキャッチ（LP画像を取り込む）
  $img_id = media_sideload_image($p['img'], $pid, $p['title'], 'id');
  if (!is_wp_error($img_id)) set_post_thumbnail($pid, $img_id);
  else $out[] = "img err ".$p['slug'].": ".$img_id->get_error_message();
  $out[] = "OK: ".$p['slug']." (post ".$pid.")";
}
echo implode("\n", $out)."\n=== done ===\n";
