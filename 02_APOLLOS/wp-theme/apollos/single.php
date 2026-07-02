<?php if (!defined('ABSPATH')) exit;
get_header();
while (have_posts()) : the_post();
  $cat = apollos_primary_cat();
?>

<article class="article">

  <header class="article-head reveal">
    <div class="crumb">INFO<?php if ($cat) echo '&nbsp;&nbsp;/&nbsp;&nbsp;' . esc_html($cat->name); ?></div>
    <div class="meta">
      <?php if ($cat) : ?><span class="cat"><?php echo esc_html($cat->name); ?></span><?php endif; ?>
      <span class="date"><?php echo esc_html(get_the_date('Y.m.d')); ?></span>
    </div>
    <h1 class="title"><?php the_title(); ?></h1>
    <div class="byline">APOLLOS 編集部</div>
  </header>

  <?php if (has_post_thumbnail()) : ?>
  <div class="eyecatch reveal">
    <div class="inner"><?php the_post_thumbnail('apollos-eyecatch', array('alt' => get_the_title())); ?></div>
  </div>
  <?php endif; ?>

  <div class="article-body">
    <div class="article-main reveal">
      <?php the_content(); ?>
    </div>
    <?php get_sidebar(); ?>
  </div>

  <?php
  // 関連記事（同カテゴリー・最新3・自分を除く）
  $related_args = array('posts_per_page' => 3, 'post__not_in' => array(get_the_ID()), 'ignore_sticky_posts' => true);
  if ($cat) $related_args['cat'] = $cat->term_id;
  $related = new WP_Query($related_args);
  if ($related->have_posts()) : ?>
  <section class="related">
    <div class="label"><span class="dash"></span><span class="cat">RELATED</span></div>
    <h2>関連記事</h2>
    <div class="card-grid">
      <?php while ($related->have_posts()) : $related->the_post();
        get_template_part('template-parts/card');
      endwhile; wp_reset_postdata(); ?>
    </div>
  </section>
  <?php endif; ?>

</article>

<?php
endwhile;
get_footer();
