<?php if (!defined('ABSPATH')) exit;
/* 記事カード（ループ内で使用） */
$cat = apollos_primary_cat();
?>
<a class="card reveal" href="<?php the_permalink(); ?>">
  <div class="card-thumb">
    <?php if (has_post_thumbnail()) {
      the_post_thumbnail('apollos-card', array('alt' => get_the_title()));
    } else { ?>
      <img src="<?php echo esc_url(get_template_directory_uri() . '/images/statement.png'); ?>" alt="">
    <?php } ?>
  </div>
  <div class="card-meta">
    <?php if ($cat) : ?><span class="cat"><?php echo esc_html($cat->name); ?></span><span class="dot">·</span><?php endif; ?>
    <span class="date"><?php echo esc_html(get_the_date('Y.m.d')); ?></span>
  </div>
  <div class="card-title"><?php the_title(); ?></div>
</a>
