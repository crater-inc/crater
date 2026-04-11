// ============================================
// CRATER 会社概要 — slides.js v6
// ============================================

// SLIDE 01 | 表紙 | フルブリード写真 × エディトリアルカバー
function slide01Cover() {
  return `<section class="slide" data-section="cover" data-notes="本日はお時間をいただきありがとうございます。株式会社クレーターの会社概要をご覧ください。クレーターは「この星に、つめあとを残せ」をブランドコンセプトに、デザインの力でブランドの価値を伝えることを使命としています。">
  <div class="s01-photo"></div>
  <div class="s01-overlay"></div>
  <div class="s01-content">

    <div class="s01-top">
      <span class="s01-logo">CRATER</span>
      <span class="s01-year">Est. 2013</span>
    </div>

    <div class="s01-center">
      <div class="s01-accent-bar"></div>
      <h1 class="s01-tagline">
        この星に、<br>
        <span class="s01-hl">つめあとを残せ。</span>
      </h1>
    </div>

    <div class="s01-bottom">
      <span class="s01-company">株式会社クレーター / CRATER Inc.</span>
      <span class="s01-category">Company Profile</span>
    </div>

  </div>
</section>`;
}

// SLIDE 02 | ミッション | 黒左パネル × グレー右ステートメント
function slide02Mission() {
  return `<section class="slide" data-section="mission" data-notes="クレーターのミッションはシンプルです。価値あるブランドを、必要な人に届ける。メッセージとストーリーを視覚化し、ブランドの価値を正確に伝えることが私たちの仕事です。">
  <div class="s02">

    <div class="s02-left">
      <span class="s02-label-en">Mission</span>
      <span class="s02-label-ja">使命</span>
      <div class="s02-yellow-bar"></div>
    </div>

    <div class="s02-right">
      <div class="s02-inner">
        <div class="s02-accent-line"></div>
        <h2 class="s02-statement">
          価値あるブランドを、<br>
          必要な人に届ける。<br>
          それがデザインの本質。
        </h2>
        <p class="s02-body">
          メッセージとストーリーを視覚化し、<br>
          ブランドの価値を正確に伝えることが、<br>
          クレーターの仕事です。
        </p>
      </div>
    </div>

  </div>
</section>`;
}

// SLIDE 03 | 実績数字 | 全黒背景 × 白数字 × 黄色アクセント
function slide03Numbers() {
  return `<section class="slide s03-dark" data-section="numbers" data-notes="私たちの実績を3つの数字でご覧ください。創業12年、国際デザイン賞4冠、5つの事業領域。この数字が私たちの実力を語っています。">
  <div class="s03">

    <div class="s03-col">
      <div class="s03-bar-wrap">
        <div class="s03-bar" style="width:80%;"></div>
      </div>
      <div class="s03-num-row">
        <span class="s03-number">12</span>
        <span class="s03-unit">年</span>
      </div>
      <div class="s03-divider"></div>
      <p class="s03-label">創業からの実績</p>
    </div>

    <div class="s03-sep"></div>

    <div class="s03-col">
      <div class="s03-bar-wrap">
        <div class="s03-bar" style="width:45%;"></div>
      </div>
      <div class="s03-num-row">
        <span class="s03-number">4</span>
        <span class="s03-unit">冠</span>
      </div>
      <div class="s03-divider"></div>
      <p class="s03-label">国際デザイン賞受賞</p>
    </div>

    <div class="s03-sep"></div>

    <div class="s03-col">
      <div class="s03-bar-wrap">
        <div class="s03-bar" style="width:55%;"></div>
      </div>
      <div class="s03-num-row">
        <span class="s03-number">5</span>
        <span class="s03-unit">領域</span>
      </div>
      <div class="s03-divider"></div>
      <p class="s03-label">カバーする事業領域</p>
    </div>

  </div>
</section>`;
}

// SLIDE 04 | 会社概要 | 左テーブル × 右スタジオ写真
function slide04Overview() {
  return `<section class="slide" data-section="overview" data-notes="会社概要をご説明します。株式会社クレーターは2013年創業、2019年法人設立の東京・下北沢のデザイン事務所です。代表の明里圭修がアートディレクターとして、ブランディングからWebまで幅広いデザインを一貫して担当しています。">
  <div class="s04">

    <div class="s04-left">
      <div class="s04-header">
        <span class="s04-en">Overview</span>
        <h2 class="s04-ja">会社概要</h2>
        <div class="s04-accent-bar"></div>
      </div>
      <table class="s04-table">
        <tr>
          <th>Company</th>
          <td><strong>株式会社クレーター</strong><br><span class="s04-sub">CRATER Inc.</span></td>
        </tr>
        <tr>
          <th>CEO</th>
          <td>明里 圭修<span class="s04-sub"> Keisuke Akari</span></td>
        </tr>
        <tr>
          <th>Founded</th>
          <td>2013年創業 / 2019年4月 法人設立</td>
        </tr>
        <tr>
          <th>Services</th>
          <td>ブランディング・ロゴ・グラフィック・Web・パッケージ</td>
        </tr>
        <tr>
          <th>Location</th>
          <td>東京都世田谷区北沢3丁目20-18<br><span class="s04-sub">下北沢駅より徒歩4分</span></td>
        </tr>
        <tr>
          <th>Hours</th>
          <td>10:00 – 19:00（土・日・祝 定休）</td>
        </tr>
      </table>
    </div>

    <div class="s04-right">
      <div class="s04-photo"></div>
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
