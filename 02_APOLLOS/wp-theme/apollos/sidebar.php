<?php if (!defined('ABSPATH')) exit; ?>
<aside class="sidebar">

  <div class="widget widget-search">
    <div class="widget-title">SEARCH</div>
    <?php get_search_form(); ?>
  </div>

  <div class="widget widget-category">
    <div class="widget-title">CATEGORY</div>
    <div class="cat-list">
      <?php
      $cats = get_categories(array('hide_empty' => false, 'orderby' => 'count', 'order' => 'DESC'));
      foreach ($cats as $c) :
        if ($c->slug === 'uncategorized') continue; ?>
        <a href="<?php echo esc_url(get_category_link($c->term_id)); ?>">
          <span><?php echo esc_html($c->name); ?></span>
          <span class="count"><?php echo intval($c->count); ?></span>
        </a>
      <?php endforeach; ?>
    </div>
  </div>

  <div class="widget widget-ranking">
    <div class="widget-title">RANKING</div>
    <?php
    $ranked = new WP_Query(array(
      'posts_per_page' => 5,
      'meta_key' => 'apollos_views',
      'orderby' => 'meta_value_num',
      'order' => 'DESC',
      'ignore_sticky_posts' => true,
    ));
    // 閲覧数がまだ無い場合は新着で代替
    if (!$ranked->have_posts()) {
      $ranked = new WP_Query(array('posts_per_page' => 5, 'ignore_sticky_posts' => true));
    }
    $rank = 0;
    if ($ranked->have_posts()) : while ($ranked->have_posts()) : $ranked->the_post(); $rank++; ?>
      <a class="rank-item" href="<?php the_permalink(); ?>">
        <span class="rank-num"><?php echo $rank; ?></span>
        <span>
          <span class="rank-title"><?php the_title(); ?></span>
          <span class="rank-date" style="display:block;"><?php echo esc_html(get_the_date('Y.m.d')); ?></span>
        </span>
      </a>
    <?php endwhile; endif; wp_reset_postdata(); ?>
  </div>

</aside>
