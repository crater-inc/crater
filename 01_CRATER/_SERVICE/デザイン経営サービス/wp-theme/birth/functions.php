<?php
/**
 * BIRTH テーマ functions
 */

if (!defined('ABSPATH')) exit;

/* テーマサポート */
function birth_setup(){
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('automatic-feed-links');
  add_theme_support('html5', array('search-form','comment-form','comment-list','gallery','caption','style','script'));
  register_nav_menus(array('primary' => 'ヘッダーメニュー'));
}
add_action('after_setup_theme', 'birth_setup');

/* CSS・フォント読み込み */
function birth_assets(){
  wp_enqueue_style('birth-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Poppins:wght@300;400;500&display=swap', array(), null);
  $ver = wp_get_theme()->get('Version');
  wp_enqueue_style('birth-style', get_stylesheet_uri(), array('birth-fonts'), $ver);
  wp_enqueue_script('birth-js', get_template_directory_uri().'/assets/theme.js', array(), $ver, true);
}
add_action('wp_enqueue_scripts', 'birth_assets');

/* 抜粋の調整 */
function birth_excerpt_length($len){ return 60; }
add_filter('excerpt_length', 'birth_excerpt_length');
function birth_excerpt_more($more){ return '…'; }
add_filter('excerpt_more', 'birth_excerpt_more');

/* 投稿の第一カテゴリ名 */
function birth_primary_cat($post_id = null){
  $cats = get_the_category($post_id);
  if (!empty($cats)) return $cats[0]->name;
  return '';
}

/* AI検索対策（GEO/AIO）：meta description・OGP・構造化データ */
function birth_ai_seo_head(){
  $site = get_bloginfo('name');
  if (is_singular('post')) {
    $desc = wp_strip_all_tags(get_the_excerpt());
    $desc = mb_substr($desc, 0, 120);
    $url  = get_permalink();
    $img  = get_the_post_thumbnail_url(null, 'large');
    echo "\n<meta name=\"description\" content=\"".esc_attr($desc)."\">\n";
    echo "<meta property=\"og:type\" content=\"article\">\n";
    echo "<meta property=\"og:title\" content=\"".esc_attr(get_the_title())."\">\n";
    echo "<meta property=\"og:description\" content=\"".esc_attr($desc)."\">\n";
    echo "<meta property=\"og:url\" content=\"".esc_url($url)."\">\n";
    if ($img) echo "<meta property=\"og:image\" content=\"".esc_url($img)."\">\n";
    echo "<meta name=\"twitter:card\" content=\"summary_large_image\">\n";
    $ld = array(
      '@context' => 'https://schema.org',
      '@type'    => 'Article',
      'headline' => get_the_title(),
      'description' => $desc,
      'datePublished' => get_the_date('c'),
      'dateModified'  => get_the_modified_date('c'),
      'mainEntityOfPage' => $url,
      'author' => array('@type'=>'Organization','name'=>'BIRTH / CRATER'),
      'publisher' => array('@type'=>'Organization','name'=>'BIRTH')
    );
    if ($img) $ld['image'] = $img;
    echo '<script type="application/ld+json">'.wp_json_encode($ld, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE).'</script>'."\n";
  } else {
    $desc = wp_strip_all_tags(get_bloginfo('description'));
    echo "\n<meta name=\"description\" content=\"".esc_attr($desc)."\">\n";
    echo "<meta property=\"og:type\" content=\"website\">\n";
    echo "<meta property=\"og:title\" content=\"".esc_attr($site)."\">\n";
    echo "<meta property=\"og:url\" content=\"".esc_url(home_url('/'))."\">\n";
    $ld = array(
      '@context'=>'https://schema.org','@type'=>'WebSite',
      'name'=>$site,'url'=>home_url('/')
    );
    echo '<script type="application/ld+json">'.wp_json_encode($ld, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE).'</script>'."\n";
  }
}
add_action('wp_head', 'birth_ai_seo_head', 5);
