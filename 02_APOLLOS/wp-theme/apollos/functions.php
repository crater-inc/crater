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
