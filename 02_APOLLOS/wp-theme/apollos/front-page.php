<?php if (!defined('ABSPATH')) exit;
get_header();
$img = get_template_directory_uri() . '/images';
?>

<!-- ヒーロー -->
<section class="hero" id="top">
  <div class="hero-bg" data-parallax="0.45" style="background-image:url('<?php echo esc_url($img); ?>/hero.jpg');"></div>
  <div class="hero-inner">
    <div id="heroWord" class="hero-word"><span>APOLLOS</span></div>
    <div class="hero-taglines">
      <span class="hero-jp-sm">埋もれている価値を、次の世界へ</span>
      <span class="hero-en-sm">Bring buried value to the next world.</span>
    </div>
  </div>
  <div class="scroll-ind"><span>SCROLL</span><i></i></div>
</section>

<!-- Philosophy -->
<section class="philosophy sec-pad" id="philosophy">
  <div class="wrap">
    <div class="label reveal"><span class="idx">(01)</span><span class="dash"></span><span class="cat">PHILOSOPHY</span></div>
    <div class="phil-grid">
      <div class="phil-head reveal">
        <h2>
          <span class="l1">知られていなければ、</span><br>
          <span class="l2"><span class="buried">存在しない</span>のと同じ</span>
        </h2>
        <span class="en">Unseen value does not exist.</span>
        <p>良いものをつくっても、その価値が正しく届かなければ選ばれない。アポロスは「認知」を軸に、価値が届き・理解され・選ばれる状態をつくります。</p>
        <a class="view-more" href="<?php echo esc_url(apollos_page_url('philosophy')); ?>">VIEW MORE <span class="ar">→</span></a>
      </div>
      <div class="phil-img reveal"><div class="pbg" data-parallax="0.32" style="background-image:url('<?php echo esc_url($img); ?>/philosophy.png');"></div></div>
    </div>
  </div>
</section>

<!-- Service -->
<section class="service sec-pad" id="service">
  <div class="wrap">
    <div class="svc-head reveal">
      <div>
        <div class="label" style="margin-bottom:22px;"><span class="idx">(02)</span><span class="dash"></span><span class="cat">SERVICE</span></div>
        <h2>価値を、届くかたちに。</h2>
      </div>
      <p class="note">手段から考えない。目的から逆算し、最適な打ち手を組み合わせます。</p>
    </div>
    <div class="svc-list">
      <div class="svc-row reveal">
        <div class="no">01</div>
        <div class="mid"><div class="t">認知戦略設計</div><span class="en">AWARENESS STRATEGY</span></div>
        <div class="rt">
          <div class="desc">誰に・何を・どこで伝えるか。ターゲット・競合・市場を分析し、認知が広がる戦略の地図を描きます。</div>
          <div class="tags"><span>戦略立案</span><span>チャネル選定</span><span>KPI設計</span></div>
        </div>
      </div>
      <div class="svc-row reveal">
        <div class="no">02</div>
        <div class="mid"><div class="t">広告・デジタル施策</div><span class="en">ADVERTISING</span></div>
        <div class="rt">
          <div class="desc">Meta・Google等のデジタル広告で精度の高いターゲティングと認知を実現。データドリブンに改善します。</div>
          <div class="tags"><span>Meta広告</span><span>Google広告</span><span>運用改善</span></div>
        </div>
      </div>
      <div class="svc-row reveal">
        <div class="no">03</div>
        <div class="mid"><div class="t">SNS・PR支援</div><span class="en">PR &amp; SOCIAL</span></div>
        <div class="rt">
          <div class="desc">SNS運用からPR・メディア掲載、インフルエンサー活用まで。語られる状態をつくります。</div>
          <div class="tags"><span>SNS運用</span><span>PR・メディア</span><span>インフルエンサー</span></div>
        </div>
      </div>
    </div>
    <a class="view-more reveal" href="<?php echo esc_url(apollos_page_url('service')); ?>">VIEW MORE <span class="ar">→</span></a>
  </div>
</section>

<!-- About -->
<section class="about sec-pad" id="about">
  <div class="wrap">
    <div class="about-grid">
      <div class="about-img reveal"><div class="abg" data-parallax="0.30" style="background-image:url('https://images.unsplash.com/photo-1514810771018-276192729582?auto=format&fit=crop&w=1080&q=80');"></div></div>
      <div class="about-right reveal">
        <div class="label" style="margin-bottom:24px;"><span class="idx">(03)</span><span class="dash"></span><span class="cat">ABOUT</span></div>
        <h2>認知を起点に、<br>事業を動かす。</h2>
        <div class="body">
          <p>APOLLOSは2026年7月設立、認知特化のクリエイティブ会社です。価値が届き・理解され・選ばれる状態をつくることを専門とし、広告・SNS・PR・認知戦略の設計から実行までを一貫して支援します。</p>
          <p>手段から考えません。まずビジネス・ターゲット・競合環境を深く理解し、最も効果的な認知経路を設計します。デザイン・制作はグループ会社のクレーターと連携します。</p>
        </div>
        <div class="stats">
          <div class="stat"><div class="num">2026</div><div class="lab">ESTABLISHED</div></div>
          <div class="stat"><div class="num">3+</div><div class="lab">CORE SERVICES</div></div>
          <div class="stat"><div class="num">1way</div><div class="lab">目的から逆算</div></div>
        </div>
        <a class="view-more" href="<?php echo esc_url(apollos_page_url('about')); ?>">VIEW MORE <span class="ar">→</span></a>
      </div>
    </div>
  </div>
</section>

<!-- INFO ニュース（最新6件） -->
<section class="info-news" id="info-news">
  <div class="wrap">
    <div class="info-head reveal">
      <div class="hl">
        <div class="label"><span class="dash"></span><span class="cat">INFO</span></div>
        <h2>認知にまつわる、思考と実例。</h2>
      </div>
      <a class="view-all" href="<?php echo esc_url(apollos_info_url()); ?>">VIEW ALL <span class="ar">→</span></a>
    </div>
    <div class="card-grid">
      <?php
      $news = new WP_Query(array('posts_per_page' => 6, 'ignore_sticky_posts' => true));
      if ($news->have_posts()) :
        while ($news->have_posts()) : $news->the_post();
          get_template_part('template-parts/card');
        endwhile;
        wp_reset_postdata();
      else : ?>
        <p style="color:var(--body);">記事は準備中です。</p>
      <?php endif; ?>
    </div>
  </div>
</section>

<!-- Statement -->
<section class="statement">
  <div class="statement-window"><div class="sbg" data-parallax="0.30" style="background-image:url('<?php echo esc_url($img); ?>/statement.png');"></div></div>
  <div class="inner reveal">
    <div class="kicker">BRAND STATEMENT</div>
    <h2>埋もれている価値を、<br>次の世界へ。</h2>
    <div class="attr">APOLLOS / EST. 2026 / TOKYO</div>
  </div>
</section>

<!-- Contact -->
<section class="contact sec-pad" id="contact">
  <div class="wrap">
    <div class="label reveal" style="margin-bottom:24px;"><span class="idx">(04)</span><span class="dash"></span><span class="cat">CONTACT</span></div>
    <h2 class="reveal">広めるために、<br>まずお話しましょう。</h2>
    <p class="sub reveal">ご相談・お見積もりは無料です。2営業日以内にご返信いたします。</p>

    <!-- BowNow 問い合わせフォーム -->
    <div class="bownow-form reveal">
      <script id="_bownow_cs_sid_de55ffdeafd2615a2906">
        var _bownow_cs_sid_de55ffdeafd2615a2906 = document.createElement('script');
        _bownow_cs_sid_de55ffdeafd2615a2906.charset = 'utf-8';
        _bownow_cs_sid_de55ffdeafd2615a2906.src = 'https://contents.bownow.jp/forms/sid_de55ffdeafd2615a2906/trace.js';
        document.getElementsByTagName('head')[0].appendChild(_bownow_cs_sid_de55ffdeafd2615a2906);
      </script>
    </div>

    <div class="meta reveal">
      <span>APOLLOS</span>
      <span>TOKYO, JAPAN</span>
      <span>apollos.jp</span>
    </div>
  </div>
</section>

<?php get_footer(); ?>
