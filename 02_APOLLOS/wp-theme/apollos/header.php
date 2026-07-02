<?php if (!defined('ABSPATH')) exit; ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="profile" href="https://gmpg.org/xfn/11">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" id="siteHeader">
  <a href="<?php echo esc_url(home_url('/')); ?>" class="logo">APOLLOS</a>
  <button class="nav-toggle" id="navToggle" aria-label="メニュー"><span></span><span></span><span></span></button>
  <nav class="nav" id="nav">
    <a href="<?php echo esc_url(apollos_page_url('philosophy')); ?>">PHILOSOPHY</a>
    <a href="<?php echo esc_url(apollos_page_url('service')); ?>">SERVICE</a>
    <a href="<?php echo esc_url(apollos_page_url('about')); ?>">ABOUT</a>
    <a href="<?php echo esc_url(apollos_page_url('company')); ?>">COMPANY</a>
    <a href="<?php echo esc_url(apollos_info_url()); ?>">INFO</a>
    <a href="<?php echo esc_url(apollos_nav_link('#contact')); ?>">CONTACT</a>
  </nav>
</header>
