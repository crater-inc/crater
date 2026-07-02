<?php
/**
 * Template Name: PHILOSOPHY
 * 認知＝ものの見方を伝える下層ページ。
 */
if (!defined('ABSPATH')) exit;
get_header();
$img = get_template_directory_uri() . '/images';
?>
<main class="page-main">

  <section class="page-hero">
    <div class="wrap">
      <div class="label reveal"><span class="dash"></span><span class="cat">PHILOSOPHY</span></div>
      <div class="page-word reveal">PHILOSOPHY</div>
      <p class="lead reveal">私たちの、ものの見方。</p>
    </div>
  </section>

  <section class="phil-statement">
    <div class="wrap">
      <div class="big reveal">知られていなければ、<br>存在しないのと同じ。</div>
      <span class="en reveal">Unseen value does not exist.</span>
      <p class="body reveal">私たちが扱うのは、単なる商品やサービスではありません。それらが持つ「価値」が、正しく認識されていない状態と向き合います。</p>
      <p class="body reveal">どれだけ優れたものでも、知られていなければ、存在しないのと同じです。埋もれているのは、能力ではなく「認知」です。</p>
      <p class="body reveal">アポロスは、認知を軸に、価値が届き、理解され、選ばれる状態をつくります。まだ知られていないものを、「知っている」「理解している」世界へ引き上げる。</p>
    </div>
  </section>

  <section class="phil-visual">
    <div class="pvbg" data-parallax="0.24" style="background-image:url('<?php echo esc_url($img); ?>/statement.png');"></div>
    <div class="cap reveal">
      <div class="k">PHILOSOPHY</div>
      <h2>埋もれている価値を、<br>次の世界へ。</h2>
      <p>それは、まだ知らないを、知っているに変えていくこと。</p>
    </div>
  </section>

  <section class="cta-band">
    <div class="wrap reveal">
      <h2>その価値、まだ埋もれていませんか。</h2>
      <a class="btn" href="<?php echo esc_url(apollos_page_url('contact')); ?>">お問い合わせ <span>→</span></a>
    </div>
  </section>

</main>
<?php get_footer(); ?>
