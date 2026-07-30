<?php if (!defined('ABSPATH')) exit; $lp = 'https://birth.business/'; ?>
<footer class="site-footer">
  <div class="wrap">
    <div class="ft-top">
      <a href="<?php echo esc_url($lp); ?>" class="logo">BIRTH</a>
      <nav class="fnav">
        <a href="<?php echo esc_url($lp); ?>">HOME</a>
        <a href="<?php echo esc_url($lp.'#service'); ?>">SERVICE</a>
        <a href="<?php echo esc_url($lp.'#cases'); ?>">CASES</a>
        <a href="<?php echo esc_url($lp.'#plans'); ?>">PLANS</a>
        <a href="<?php echo esc_url(home_url('/')); ?>">JOURNAL</a>
        <a href="<?php echo esc_url($lp.'#works'); ?>">WORKS</a>
      </nav>
    </div>
    <div class="ft-div"></div>
    <div class="ft-bottom">
      <div class="ft-links">
        <a href="<?php echo esc_url($lp.'#works'); ?>">COMPANY</a>
        <a href="<?php echo esc_url($lp); ?>">PRIVACY</a>
      </div>
      <div class="ft-copy">© BIRTH</div>
    </div>
  </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
