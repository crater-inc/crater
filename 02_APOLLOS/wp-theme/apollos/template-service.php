<?php
/**
 * Template Name: SERVICE
 * 提供サービスの詳細ページ。
 */
if (!defined('ABSPATH')) exit;
get_header();

$services = array(
  array('no'=>'01','t'=>'認知戦略設計','en'=>'AWARENESS STRATEGY',
        'desc'=>'誰に・何を・どこで伝えるか。ターゲット・競合・市場を分析し、認知が広がる戦略の地図を描きます。すべての施策の出発点として、目的から逆算した設計を行います。',
        'tags'=>array('戦略立案','チャネル選定','KPI設計','競合分析')),
  array('no'=>'02','t'=>'広告・デジタル施策','en'=>'ADVERTISING',
        'desc'=>'Meta・Google等のデジタル広告で、精度の高いターゲティングと認知を実現します。クリエイティブから運用・改善までを一貫し、データドリブンに成果を最大化します。',
        'tags'=>array('Meta広告','Google広告','運用改善','クリエイティブ')),
  array('no'=>'03','t'=>'SNS・PR支援','en'=>'PR & SOCIAL',
        'desc'=>'SNS運用からPR・メディア掲載、インフルエンサー活用まで。第三者に「語られる」状態をつくり、広告だけに頼らない持続的な認知を育てます。',
        'tags'=>array('SNS運用','PR・メディア','インフルエンサー','コンテンツ')),
);
?>
<main class="page-main">

  <section class="page-hero">
    <div class="wrap">
      <div class="label reveal"><span class="dash"></span><span class="cat">SERVICE</span></div>
      <div class="page-word reveal">SERVICE</div>
      <p class="lead reveal">手段から考えない。目的から逆算し、最適な打ち手を組み合わせます。</p>
    </div>
  </section>

  <section class="svc2">
    <div class="wrap">
      <?php foreach ($services as $s): ?>
        <div class="svc2-row reveal">
          <div class="no"><?php echo esc_html($s['no']); ?></div>
          <div class="mid">
            <div class="t"><?php echo esc_html($s['t']); ?></div>
            <span class="en"><?php echo esc_html($s['en']); ?></span>
          </div>
          <div class="rt">
            <div class="desc"><?php echo esc_html($s['desc']); ?></div>
            <div class="tags"><?php foreach ($s['tags'] as $tag): ?><span><?php echo esc_html($tag); ?></span><?php endforeach; ?></div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </section>

  <section class="cta-band alt">
    <div class="wrap reveal">
      <h2>認知の設計から、はじめませんか。</h2>
      <a class="btn" href="<?php echo esc_url(home_url('/#contact')); ?>">お問い合わせ <span>→</span></a>
    </div>
  </section>

</main>
<?php get_footer(); ?>
