<?php if (!defined('ABSPATH')) exit; get_header(); ?>

<main>
  <article class="single-wrap">
    <?php while (have_posts()): the_post(); ?>
      <div class="single-head">
        <div class="meta">
          <span class="cat"><?php echo esc_html(birth_primary_cat()); ?></span>
          <span class="date"><?php echo esc_html(get_the_date('Y.m.d')); ?></span>
        </div>
        <h1><?php the_title(); ?></h1>
      </div>

      <?php if (has_post_thumbnail()): ?>
        <div class="single-thumb"><?php the_post_thumbnail('large'); ?></div>
      <?php endif; ?>

      <div class="article-body">
        <?php the_content(); ?>
      </div>

      <a class="back" href="<?php echo esc_url(home_url('/')); ?>">← ジャーナル一覧へ</a>
    <?php endwhile; ?>
  </article>
</main>

<?php get_footer(); ?>
