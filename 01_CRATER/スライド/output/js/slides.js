// ============================================
// CRATER 会社概要 — slides.js v4
// 最初の4枚
// ============================================

// SLIDE 01 | 表紙 | F5 cover
function slide01Cover() {
  return `<section class="slide" data-section="cover" data-notes="本日はお時間をいただきありがとうございます。株式会社クレーターの会社概要をご覧ください。クレーターは「この星に、つめあとを残せ」をブランドコンセプトに、デザインの力でブランドの価値を伝えることを使命としています。">
  <div class="s01">
    <div class="s01-left">
      <div class="slide-hero s01-logo">CRATER</div>
      <p class="slide-caption s01-company">株式会社クレーター</p>
    </div>
    <div class="s01-right">
      <span class="accent-line"></span>
      <p class="slide-h2 s01-tagline">この星に、<br><span class="hl">つめあとを残せ。</span></p>
      <span class="s01-est">Est. 2013 — Tokyo, Japan</span>
    </div>
  </div>
</section>`;
}

// SLIDE 02 | ミッション | F1 statement
function slide02Mission() {
  return `<section class="slide" data-section="mission" data-notes="クレーターのミッションはシンプルです。価値あるブランドを、必要な人に届ける。メッセージとストーリーを視覚化し、ブランドの価値を正確に伝えることが私たちの仕事です。">
  <div class="s02">
    <span class="accent-line"></span>
    <h2 class="slide-h1 s02-statement">価値あるブランドを、<br>必要な人に届ける。<br>それがデザインの本質。</h2>
    <p class="slide-body s02-body">メッセージとストーリーを視覚化し、<br>ブランドの価値を正確に伝えることが、<br>クレーターの仕事です。</p>
  </div>
</section>`;
}

// SLIDE 03 | 実績数字 | F4 big-number
function slide03Numbers() {
  return `<section class="slide" data-section="numbers" data-notes="私たちの実績を3つの数字でご覧ください。創業12年、国際デザイン賞4冠、5つの事業領域。この数字が私たちの実力を語っています。">
  <div class="s03">
    <div class="s03-col">
      <div class="s03-num-row">
        <span class="slide-number">12</span>
        <span class="s03-unit">年</span>
      </div>
      <p class="slide-body s03-label">創業からの実績</p>
    </div>
    <div class="s03-col">
      <div class="s03-num-row">
        <span class="slide-number">4</span>
        <span class="s03-unit">冠</span>
      </div>
      <p class="slide-body s03-label">国際デザイン賞受賞</p>
    </div>
    <div class="s03-col">
      <div class="s03-num-row">
        <span class="slide-number">5</span>
        <span class="s03-unit">領域</span>
      </div>
      <p class="slide-body s03-label">カバーする事業領域</p>
    </div>
  </div>
</section>`;
}

// SLIDE 04 | 会社概要 | F2 left-right
function slide04Overview() {
  return `<section class="slide" data-section="overview" data-notes="会社概要をご説明します。株式会社クレーターは2013年創業、2019年法人設立の東京・下北沢のデザイン事務所です。代表の明里圭修がアートディレクターとして、ブランディングからWebまで幅広いデザインを一貫して担当しています。">
  <div class="s04">
    <div class="s04-left">
      <span class="s04-label-top">Overview</span>
      <span class="s04-label-main">概要</span>
    </div>
    <div class="s04-right">
      <table class="s04-table">
        <tr>
          <th>Company</th>
          <td class="slide-body"><strong>株式会社クレーター</strong> / CRATER Inc.</td>
        </tr>
        <tr>
          <th>CEO</th>
          <td class="slide-body">明里 圭修（Keisuke Akari）</td>
        </tr>
        <tr>
          <th>Founded</th>
          <td class="slide-body">2013年創業 / 2019年4月26日 法人設立</td>
        </tr>
        <tr>
          <th>Services</th>
          <td class="slide-body">ブランディング、ロゴ、グラフィック、Web、パッケージデザイン</td>
        </tr>
        <tr>
          <th>Location</th>
          <td class="slide-body">〒155-0031 東京都世田谷区北沢3丁目20-18 北沢宝ビル3F</td>
        </tr>
        <tr>
          <th>Access</th>
          <td class="slide-body">下北沢駅より徒歩4分（京王井の頭線 / 小田急線）</td>
        </tr>
        <tr>
          <th>Hours</th>
          <td class="slide-body">10:00 – 19:00（土・日・祝 定休）</td>
        </tr>
      </table>
    </div>
  </div>
</section>`;
}

// ===== グローバル登録 =====
window.slideFactories = [
  slide01Cover,
  slide02Mission,
  slide03Numbers,
  slide04Overview,
];

window.agendaItems = [
  { id: 'cover',    label: '表紙' },
  { id: 'mission',  label: 'ミッション' },
  { id: 'numbers',  label: '実績数字' },
  { id: 'overview', label: '会社概要' },
];
