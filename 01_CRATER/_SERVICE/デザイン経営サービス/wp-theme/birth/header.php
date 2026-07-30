<?php if (!defined('ABSPATH')) exit; ?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php $lp = 'https://birth.business/'; ?>
<header class="site-header">
  <div class="bar">
    <a href="<?php echo esc_url($lp); ?>" class="logo">BIRTH</a>
    <nav class="hnav">
      <a href="<?php echo esc_url($lp.'#service'); ?>">SERVICE</a>
      <a href="<?php echo esc_url($lp.'#cases'); ?>">CASES</a>
      <a href="<?php echo esc_url($lp.'#plans'); ?>">PLANS</a>
      <a href="<?php echo esc_url($lp.'#works'); ?>">WORKS</a>
      <a href="<?php echo esc_url(home_url('/')); ?>" class="current">JOURNAL</a>
      <a href="<?php echo esc_url($lp.'#cta'); ?>" class="pill">無料で相談する</a>
    </nav>
  </div>
</header>
