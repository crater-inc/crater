<?php
/**
 * APOLLOS 初回セットアップ（1回だけ実行・冪等）
 * カテゴリー・固定ページ(Home/INFO)・表示設定・パーマリンクを自動構成する。
 */
if (!defined('ABSPATH')) exit;

if (!function_exists('apollos_run_setup')) {
    function apollos_run_setup() {
        if (get_option('apollos_setup_done')) return;

        // カテゴリー
        $cats = array('認知' => 'ninchi', '事例' => 'jirei', 'お知らせ' => 'news');
        foreach ($cats as $name => $slug) {
            if (!term_exists($name, 'category')) {
                wp_insert_term($name, 'category', array('slug' => $slug));
            }
        }

        // 固定ページ Home / INFO
        $home = get_page_by_path('home');
        if ($home) { $home_id = $home->ID; }
        else { $home_id = wp_insert_post(array('post_title' => 'Home', 'post_name' => 'home', 'post_type' => 'page', 'post_status' => 'publish')); }

        $info = get_page_by_path('info');
        if ($info) { $info_id = $info->ID; }
        else { $info_id = wp_insert_post(array('post_title' => 'INFO', 'post_name' => 'info', 'post_type' => 'page', 'post_status' => 'publish')); }

        // 表示設定：フロント=Home、投稿ページ=INFO
        update_option('show_on_front', 'page');
        if ($home_id) update_option('page_on_front', $home_id);
        if ($info_id) update_option('page_for_posts', $info_id);

        // パーマリンクを「投稿名」に
        update_option('permalink_structure', '/%postname%/');
        global $wp_rewrite;
        if ($wp_rewrite) {
            $wp_rewrite->set_permalink_structure('/%postname%/');
            $wp_rewrite->flush_rules(true);
        }

        update_option('apollos_setup_done', 1);
    }
}
