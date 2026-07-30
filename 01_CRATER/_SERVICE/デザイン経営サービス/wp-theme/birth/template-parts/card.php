<?php if (!defined('ABSPATH')) exit; ?>
<a class="card reveal" href="<?php the_permalink(); ?>">
  <div class="thumb">
    <?php if (has_post_thumbnail()): ?>
      <?php the_post_thumbnail('large', array('alt' => esc_attr(get_the_title()))); ?>
    <?php endif; ?>
  </div>
  <div class="meta">
    <span class="cat"><?php echo esc_html(birth_primary_cat()); ?></span>
    <span class="date"><?php echo esc_html(get_the_date('Y.m.d')); ?></span>
  </div>
  <h2><?php the_title(); ?></h2>
</a>
