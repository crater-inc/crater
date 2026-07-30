<?php
/**
 * BIRTH テーマ 初回セットアップ（mu-pluginから1回だけ実行）
 * - サイト名・キャッチフレーズ
 * - パーマリンク /%postname%/
 * - サンプル投稿/ページ/コメント削除
 * - カテゴリ作成（視点／設計／事例）
 * - 記事テンプレ（下書き）を用意 ＝ 複製して使う運用
 */
if (!defined('ABSPATH')) exit;

function birth_run_setup(){

  // サイト基本情報
  update_option('blogname', 'BIRTH JOURNAL');
  update_option('blogdescription', '新しい事業の、考え方。');
  update_option('posts_per_page', 9);
  update_option('timezone_string', 'Asia/Tokyo');

  // パーマリンク /%postname%/
  global $wp_rewrite;
  if ($wp_rewrite) {
    update_option('permalink_structure', '/%postname%/');
    $wp_rewrite->set_permalink_structure('/%postname%/');
    $wp_rewrite->flush_rules(true);
  }

  // サンプル削除
  $hello = get_page_by_path('hello-world', OBJECT, 'post');
  if ($hello) wp_delete_post($hello->ID, true);
  $sample = get_page_by_path('sample-page', OBJECT, 'page');
  if ($sample) wp_delete_post($sample->ID, true);
  // 既定コメント削除
  $c = get_comments(array('number'=>10));
  foreach ($c as $cm){ wp_delete_comment($cm->comment_ID, true); }

  // カテゴリ
  $cats = array(
    '視点' => '新規事業の見方・考え方。',
    '設計' => 'つくり方・仕組み・進め方。',
    '事例' => '資産が事業に変わった実例。',
  );
  foreach ($cats as $name => $desc){
    if (!term_exists($name, 'category')){
      wp_insert_term($name, 'category', array('description'=>$desc));
    }
  }

  // 記事テンプレ（下書き）＝複製して使う
  $exists = get_page_by_path('kiji-template', OBJECT, 'post');
  if (!$exists){
    $tpl_cat = get_cat_ID('視点');
    $content = ''
      ."<!-- wp:paragraph --><p>【リード：2〜3行】この記事で何が分かるかを結論から。読み手の状況に触れつつ、続きを読む理由をつくる。</p><!-- /wp:paragraph -->\n\n"
      ."<!-- wp:heading --><h2>見出し1（結論・要点）</h2><!-- /wp:heading -->\n"
      ."<!-- wp:paragraph --><p>本文。1段落＝1メッセージ。</p><!-- /wp:paragraph -->\n\n"
      ."<!-- wp:heading --><h2>見出し2（理由・具体）</h2><!-- /wp:heading -->\n"
      ."<!-- wp:paragraph --><p>本文。</p><!-- /wp:paragraph -->\n\n"
      ."<!-- wp:heading --><h2>見出し3（事例・手順）</h2><!-- /wp:heading -->\n"
      ."<!-- wp:paragraph --><p>本文。</p><!-- /wp:paragraph -->\n\n"
      ."<!-- wp:heading --><h2>まとめ</h2><!-- /wp:heading -->\n"
      ."<!-- wp:paragraph --><p>結論の再確認＋次の一歩（相談・ヒアリングシートへの導線）。</p><!-- /wp:paragraph -->";
    $tpl_id = wp_insert_post(array(
      'post_title'   => '【テンプレ】記事タイトルをここに（複製して使う）',
      'post_name'    => 'kiji-template',
      'post_content' => $content,
      'post_status'  => 'draft',
      'post_type'    => 'post',
    ));
    if ($tpl_id && !is_wp_error($tpl_id) && $tpl_cat){
      wp_set_post_categories($tpl_id, array($tpl_cat));
    }
  }
}
