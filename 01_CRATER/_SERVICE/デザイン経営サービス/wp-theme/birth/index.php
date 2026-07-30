<?php if (!defined('ABSPATH')) exit; get_header(); ?>

<main>
  <div class="wrap">
    <div class="jhead">
      <span class="eyebrow">Journal</span>
      <?php if (is_category()): ?>
        <h1><?php single_cat_title(); ?>の記事。</h1>
        <p class="lead"><?php echo esc_html(category_description()); ?></p>
      <?php elseif (is_search()): ?>
        <h1>「<?php echo esc_html(get_search_query()); ?>」の検索結果。</h1>
      <?php else: ?>
        <h1><?php echo esc_html(get_bloginfo('description') ?: '新しい事業の、考え方。'); ?></h1>
        <p class="lead">会社の資産から、新しい事業をつくる。その考え方・事例・視点を綴っていきます。</p>
      <?php endif; ?>
    </div>

    <?php if (have_posts()): ?>
      <div class="articles">
        <?php while (have_posts()): the_post(); ?>
          <?php get_template_part('template-parts/card'); ?>
        <?php endwhile; ?>
      </div>

      <div class="pager">
        <?php echo paginate_links(array('mid_size'=>1,'prev_text'=>'‹','next_text'=>'›')); ?>
      </div>
    <?php else: ?>
      <p class="lead" style="padding:0 0 120px;">まだ記事がありません。準備中です。</p>
    <?php endif; ?>
  </div>
</main>

<?php get_footer(); ?>
