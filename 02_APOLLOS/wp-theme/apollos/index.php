<?php if (!defined('ABSPATH')) exit;
get_header();

// 見出しの出し分け
$is_cat = is_category();
$is_search = is_search();
$heading = 'INFO';
$sub = '認知にまつわる、思考と実例。';
if ($is_cat) { $heading = single_cat_title('', false); $sub = 'カテゴリー'; }
elseif ($is_search) { $heading = 'SEARCH'; $sub = '「' . get_search_query() . '」の検索結果'; }
?>

<main class="page-top">
  <div class="wrap">

    <div class="pagehead reveal">
      <div class="label" style="margin-bottom:20px;"><span class="idx">(05)</span><span class="dash"></span><span class="cat">INFO</span></div>
      <div class="big"><?php echo esc_html($heading); ?></div>
      <div class="sub"><?php echo esc_html($sub); ?></div>
    </div>

    <?php if (!$is_search) : ?>
    <nav class="filter reveal">
      <a href="<?php echo esc_url(apollos_info_url()); ?>" class="<?php echo (is_home() ? 'active' : ''); ?>">ALL</a>
      <?php
      $cats = get_categories(array('hide_empty' => true));
      $current = $is_cat ? get_queried_object_id() : 0;
      foreach ($cats as $c) :
        if ($c->slug === 'uncategorized') continue; ?>
        <a href="<?php echo esc_url(get_category_link($c->term_id)); ?>" class="<?php echo ($current === $c->term_id ? 'active' : ''); ?>"><?php echo esc_html($c->name); ?></a>
      <?php endforeach; ?>
    </nav>
    <?php endif; ?>

    <div class="card-grid">
      <?php if (have_posts()) : while (have_posts()) : the_post();
        get_template_part('template-parts/card');
      endwhile; else : ?>
        <p style="color:var(--body);">記事が見つかりませんでした。</p>
      <?php endif; ?>
    </div>

    <?php
    $links = paginate_links(array(
      'type' => 'array',
      'prev_text' => '←',
      'next_text' => '→',
      'mid_size' => 1,
    ));
    if ($links) : ?>
      <nav class="pagination">
        <?php foreach ($links as $l) { echo str_replace('page-numbers current', 'page-numbers current', $l); } ?>
      </nav>
    <?php endif; ?>

  </div>
</main>

<?php get_footer(); ?>
