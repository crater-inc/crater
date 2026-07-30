<?php
/**
 * Plugin Name: BIRTH Bootstrap
 * Description: birthテーマの自動有効化＋初回セットアップ（APOLLOS方式）。
 * Version: 1.0.0
 */
if (!defined('ABSPATH')) exit;

/* birthテーマを自動で有効化 */
add_action('after_setup_theme', function(){
  if (wp_get_theme()->get_stylesheet() === 'birth') return;
  $birth = wp_get_theme('birth');
  if ($birth->exists() && !$birth->errors()){
    switch_theme('birth');
  }
}, 1);

/* 初回セットアップを1回だけ実行 */
add_action('init', function(){
  if (get_option('birth_setup_v1')) return;
  if (wp_get_theme()->get_stylesheet() !== 'birth') return;
  $file = get_theme_root().'/birth/inc/setup.php';
  if (file_exists($file)){
    require_once $file;
    if (function_exists('birth_run_setup')){
      birth_run_setup();
      update_option('birth_setup_v1', 1);
    }
  }
}, 20);
