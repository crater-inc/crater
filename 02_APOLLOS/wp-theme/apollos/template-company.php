<?php
/**
 * Template Name: COMPANY
 * 会社案内（会社概要）ページ。
 */
if (!defined('ABSPATH')) exit;
get_header();

$cards = array(
  array('n'=>'01','t'=>'認知戦略設計','en'=>'AWARENESS STRATEGY','d'=>'ターゲット・競合・市場を分析し、認知が広がる戦略の地図を描きます。'),
  array('n'=>'02','t'=>'広告・デジタル施策','en'=>'ADVERTISING','d'=>'Meta・Google等のデジタル広告で、精度の高いターゲティングと認知を実現します。'),
  array('n'=>'03','t'=>'SNS・PR支援','en'=>'PR & SOCIAL','d'=>'SNS運用からPR・メディア掲載、インフルエンサー活用まで。語られる状態をつくります。'),
);
$outline = array(
  '会社名'   => '株式会社アポロス（APOLLOS Inc.）',
  '設立'     => '2026年7月2日',
  '事業内容' => '認知戦略設計 / 広告・デジタル施策 / SNS・PR支援',
  '所在地'   => '〒155-0031 東京都世田谷区北沢3丁目20-18 北沢宝ビル3F クレーター内',
  '連絡先'   => 'apollos.jp / お問い合わせフォーム',
);
?>
<main class="page-main">

  <section class="page-hero">
    <div class="wrap">
      <div class="label reveal"><span class="dash"></span><span class="cat">COMPANY</span></div>
      <div class="page-word reveal">COMPANY</div>
      <p class="lead reveal">埋もれている価値を、次の世界へ。</p>
    </div>
  </section>

  <section class="page-sec alt msg-band">
    <div class="wrap">
      <div class="label reveal k"><span class="idx">(01)</span><span class="dash"></span><span class="cat">MESSAGE</span></div>
      <div class="big reveal">知られていなければ、<br>存在しないのと同じ。</div>
      <p class="body reveal">どれだけ優れたものでも、その価値が正しく認識されていなければ、選ばれることはありません。埋もれているのは、能力ではなく「認知」です。</p>
      <p class="body reveal">APOLLOSは、認知に特化し、まだ知られていない価値を世の中に届けるチームです。価値が届き、理解され、選ばれる状態をつくる。まだ知らないを、知っているに変えていく。それが私たちの仕事です。</p>
    </div>
  </section>

  <section class="page-sec">
    <div class="wrap">
      <div class="label reveal"><span class="idx">(02)</span><span class="dash"></span><span class="cat">SERVICE</span></div>
      <h2 class="head reveal">提供するサービス</h2>
      <div class="svc-cards">
        <?php foreach ($cards as $c): ?>
          <div class="card reveal">
            <div class="n"><?php echo esc_html($c['n']); ?></div>
            <div class="ct"><?php echo esc_html($c['t']); ?></div>
            <div class="en"><?php echo esc_html($c['en']); ?></div>
            <p class="cd"><?php echo esc_html($c['d']); ?></p>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section class="page-sec alt">
    <div class="wrap">
      <div class="label reveal"><span class="idx">(03)</span><span class="dash"></span><span class="cat">OUTLINE</span></div>
      <h2 class="head reveal">会社概要</h2>
      <div class="outline reveal">
        <?php foreach ($outline as $th => $td): ?>
          <div class="row"><div class="th"><?php echo esc_html($th); ?></div><div class="td"><?php echo esc_html($td); ?></div></div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section class="cta-band">
    <div class="wrap reveal">
      <div class="kick">BRAND STATEMENT</div>
      <h2>まだ知らないを、知っているへ。</h2>
      <a class="btn" href="<?php echo esc_url(home_url('/#contact')); ?>">お問い合わせ <span>→</span></a>
    </div>
  </section>

</main>
<?php get_footer(); ?>
