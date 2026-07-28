<?php
/**
 * APOLLOS テーマ functions
 */

if (!defined('ABSPATH')) exit;

/* 初回セットアップ処理を読み込み（有効化時に自動構成） */
require_once get_template_directory() . '/inc/setup.php';
add_action('after_switch_theme', 'apollos_run_setup');

/* テーマサポート */
function apollos_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    add_theme_support('html5', array('search-form', 'gallery', 'caption', 'style', 'script'));
    register_nav_menus(array('primary' => 'グローバルナビ'));
    // カード用サムネイルサイズ
    add_image_size('apollos-card', 760, 440, true);
    add_image_size('apollos-eyecatch', 1600, 920, true);
}
add_action('after_setup_theme', 'apollos_setup');

/* CSS・JS・フォントの読み込み */
function apollos_assets() {
    wp_enqueue_style('apollos-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Roboto+Condensed:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap', array(), null);
    wp_enqueue_style('apollos-style', get_stylesheet_uri(), array('apollos-fonts'), wp_get_theme()->get('Version'));
    wp_enqueue_script('apollos-main', get_template_directory_uri() . '/assets/theme.js', array(), wp_get_theme()->get('Version'), true);
}
add_action('wp_enqueue_scripts', 'apollos_assets');

/* 閲覧数カウント（人気記事ランキング用） */
function apollos_get_views($post_id) {
    $count = get_post_meta($post_id, 'apollos_views', true);
    return $count ? intval($count) : 0;
}
function apollos_track_views() {
    if (is_singular('post')) {
        $post_id = get_queried_object_id();
        $count = apollos_get_views($post_id);
        update_post_meta($post_id, 'apollos_views', $count + 1);
    }
}
add_action('wp_head', 'apollos_track_views');

/* カテゴリー名を1件取得（カード用） */
function apollos_primary_cat($post_id = null) {
    $cats = get_the_category($post_id);
    return !empty($cats) ? $cats[0] : null;
}

/* ナビリンク（フロントはアンカー、他ページは絶対URL） */
function apollos_nav_link($anchor) {
    return (is_front_page() ? '' : home_url('/')) . $anchor;
}

/* 下層ページ（固定ページ）のURL。スラッグ固定運用 */
function apollos_page_url($slug) {
    return home_url('/' . $slug . '/');
}

/* INFO（投稿一覧）ページのURL */
function apollos_info_url() {
    $blog = get_option('page_for_posts');
    return $blog ? get_permalink($blog) : home_url('/');
}

/* 抜粋を短く */
function apollos_excerpt_length($length) { return 60; }
add_filter('excerpt_length', 'apollos_excerpt_length');
function apollos_excerpt_more($more) { return '…'; }
add_filter('excerpt_more', 'apollos_excerpt_more');

/* =====================================================================
 * AI検索対策（GEO / AIO / LLMO）
 * meta description・OGP・構造化データ(JSON-LD)を <head> 内に出力する。
 * すべて画面に表示されない裏方の要素。レイアウト・動作には一切影響しない。
 * ===================================================================== */
function apollos_ai_seo_head() {
    $site_name = '株式会社アポロス';
    $base_desc = 'APOLLOS（アポロス）は「認知」に特化し、価値が届き・理解され・選ばれる状態をつくる会社です。';
    $tagline   = '埋もれている価値を、次の世界へ。';
    $home      = home_url('/');
    $ogimg     = get_template_directory_uri() . '/images/hero.jpg';

    // ページ別 description / URL
    if (is_front_page()) {
        $desc = $tagline . $base_desc;
        $url  = $home;
        $type = 'website';
    } elseif (is_singular('post')) {
        $desc = wp_strip_all_tags(get_the_excerpt());
        $url  = get_permalink();
        $type = 'article';
    } elseif (is_page()) {
        $ex   = wp_strip_all_tags(get_the_excerpt());
        $desc = $ex ? $ex : (get_the_title() . '｜' . $base_desc);
        $url  = get_permalink();
        $type = 'website';
    } else {
        $desc = $base_desc;
        $url  = $home;
        $type = 'website';
    }
    $desc  = trim(preg_replace('/\s+/u', ' ', $desc));
    if (mb_strlen($desc) > 120) { $desc = mb_substr($desc, 0, 118) . '…'; }
    $title = wp_get_document_title();

    // --- meta description ---
    echo "\n" . '<meta name="description" content="' . esc_attr($desc) . '">' . "\n";

    // --- OGP / Twitter Card ---
    echo '<meta property="og:site_name" content="' . esc_attr($site_name) . '">' . "\n";
    echo '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
    echo '<meta property="og:description" content="' . esc_attr($desc) . '">' . "\n";
    echo '<meta property="og:type" content="' . esc_attr($type) . '">' . "\n";
    echo '<meta property="og:url" content="' . esc_url($url) . '">' . "\n";
    echo '<meta property="og:image" content="' . esc_url($ogimg) . '">' . "\n";
    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";

    // --- Organization 構造化データ（全ページ共通）---
    $org = array(
        '@context'      => 'https://schema.org',
        '@type'         => 'Organization',
        'name'          => '株式会社アポロス',
        'alternateName' => 'APOLLOS',
        'url'           => $home,
        'logo'          => $ogimg,
        'description'   => $base_desc,
        'foundingDate'  => '2026-07-02',
        'address'       => array(
            '@type'           => 'PostalAddress',
            'postalCode'      => '155-0031',
            'addressRegion'   => '東京都',
            'addressLocality' => '世田谷区',
            'streetAddress'   => '北沢3-20-18 北沢宝ビル3F',
            'addressCountry'  => 'JP',
        ),
        'sameAs'        => array('https://x.com/apollos_jp'),
    );
    echo '<script type="application/ld+json">' . wp_json_encode($org, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\n";

    // --- WebSite 構造化データ（サイト実体の認識用）---
    $ws = array(
        '@context' => 'https://schema.org',
        '@type'    => 'WebSite',
        'name'     => 'APOLLOS',
        'url'      => $home,
        'inLanguage' => 'ja',
    );
    echo '<script type="application/ld+json">' . wp_json_encode($ws, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\n";
}
add_action('wp_head', 'apollos_ai_seo_head', 5);
