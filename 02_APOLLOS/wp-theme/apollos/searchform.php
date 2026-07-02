<?php if (!defined('ABSPATH')) exit; ?>
<form class="search-box" role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>">
  <input type="search" name="s" placeholder="記事を検索" value="<?php echo get_search_query(); ?>" aria-label="記事を検索">
</form>
