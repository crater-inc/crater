<?php
/**
 * Template Name: ABOUT
 * 会社の思想・ビジョン・アプローチ。
 */
if (!defined('ABSPATH')) exit;
get_header();
$img = get_template_directory_uri() . '/images';
?>
<main class="page-main">

  <section class="page-hero">
    <div class="wrap">
      <div class="label reveal"><span class="dash"></span><span class="cat">ABOUT</span></div>
      <div class="page-word reveal">ABOUT</div>
      <p class="lead reveal">認知に特化し、価値が届く状態をつくる。</p>
    </div>
  </section>

  <section class="page-sec alt msg-band">
    <div class="wrap">
      <div class="label reveal k"><span class="idx">(01)</span><span class="dash"></span><span class="cat">MESSAGE</span></div>
      <div class="big reveal">知られていなければ、<br>存在しないのと同じ。</div>
      <p class="body reveal">私たちが扱うのは、単なる商品やサービスではありません。それらが持つ「価値」が、正しく認識されていない状態と向き合います。</p>
      <p class="body reveal">どれだけ優れたものでも、知られていなければ、存在しないのと同じです。埋もれているのは、能力ではなく「認知」です。アポロスは、認知を軸に、価値が届き、理解され、選ばれる状態をつくります。</p>
    </div>
  </section>

  <section class="page-sec">
    <div class="wrap">
      <div class="vision-grid">
        <div class="vision-photo reveal" style="background-image:url('https://images.unsplash.com/photo-1514810771018-276192729582?auto=format&fit=crop&w=1080&q=80');"></div>
        <div class="reveal">
          <div class="label k"><span class="idx">(02)</span><span class="dash"></span><span class="cat">VISION</span></div>
          <div class="big">認知を起点に、<br>事業を動かす。</div>
          <p class="desc">APOLLOSは認知特化のクリエイティブ会社です。価値が届き・理解され・選ばれる状態をつくることを専門とし、広告・SNS・PR・認知戦略の設計から実行までを一貫して支援します。デザイン・制作はグループ会社のクレーターと連携します。</p>
          <div class="stats">
            <div><div class="num">2026</div><div class="lab">ESTABLISHED</div></div>
            <div><div class="num">3+</div><div class="lab">CORE SERVICES</div></div>
            <div><div class="num">1way</div><div class="lab">目的から逆算</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="page-sec alt">
    <div class="wrap">
      <div class="label reveal"><span class="idx">(03)</span><span class="dash"></span><span class="cat">APPROACH</span></div>
      <h2 class="head reveal">目的から、逆算する。</h2>
      <div class="steps">
        <div class="step reveal"><div class="n">01</div><div class="st">理解</div><div class="en">UNDERSTAND</div><p class="sd">ビジネス・ターゲット・競合環境を深く理解する。手段から考えない。</p></div>
        <div class="step reveal"><div class="n">02</div><div class="st">設計</div><div class="en">DESIGN</div><p class="sd">最も効果的な認知経路を設計する。誰に・どの順番で・どこで届けるか。</p></div>
        <div class="step reveal"><div class="n">03</div><div class="st">実行</div><div class="en">EXECUTE</div><p class="sd">広告・SNS・PRを統合的に実行し、データドリブンに改善し続ける。</p></div>
      </div>
    </div>
  </section>

  <section class="cta-band">
    <div class="wrap reveal">
      <h2>まだ知らないを、知っているへ。</h2>
      <a class="btn" href="<?php echo esc_url(apollos_page_url('contact')); ?>">お問い合わせ <span>→</span></a>
    </div>
  </section>

</main>
<?php get_footer(); ?>
