<?php if (!defined('ABSPATH')) exit; get_header(); ?>

<main>
  <article class="single-wrap">
    <?php while (have_posts()): the_post(); ?>
      <div class="single-head">
        <h1><?php the_title(); ?></h1>
      </div>
      <div class="article-body">
        <?php the_content(); ?>
      </div>
      <a class="back" href="<?php echo esc_url(home_url('/')); ?>">← ジャーナル一覧へ</a>
    <?php endwhile; ?>
  </article>
</main>

<?php get_footer(); ?>
