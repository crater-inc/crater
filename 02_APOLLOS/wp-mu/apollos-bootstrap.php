<?php
/**
 * APOLLOS Bootstrap (mu-plugin)
 * APOLLOSテーマを自動で有効化し、初回セットアップを実行する。
 * これにより wp-admin を触らずにサイトが完成する。1回実行後は何もしない。
 */
if (!defined('ABSPATH')) exit;

add_action('init', function () {
    if (get_option('apollos_bootstrap_done')) return;

    // APOLLOSテーマが存在すれば自動で有効化（まだ有効でない場合のみ）
    $theme = wp_get_theme('apollos');
    if ($theme->exists() && get_option('stylesheet') !== 'apollos') {
        switch_theme('apollos');
    }

    // 初回セットアップ（カテゴリー・ページ・表示設定・パーマリンク）
    $setup = WP_CONTENT_DIR . '/themes/apollos/inc/setup.php';
    if (file_exists($setup)) {
        require_once $setup;
        if (function_exists('apollos_run_setup')) {
            apollos_run_setup();
        }
    }

    update_option('apollos_bootstrap_done', 1);
}, 5);
