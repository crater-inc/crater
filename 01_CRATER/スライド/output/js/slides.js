// ============================================
// CRATER 会社概要スライド — slides.js
// 1スライド1関数。window.slideFactories に登録
// ============================================

// SLIDE 01: 表紙 | F5 イメージフル | cover
function slide01Cover() {
  return `<section class="slide" data-section="cover" data-notes="本日はお時間をいただきありがとうございます。株式会社クレーターの会社概要をご説明させていただきます。クレーターは「この星に、つめあとを残せ」というブランドコンセプトのもと、デザインの力でブランドの価値を伝えることを使命としています。まずは私たちがどんな会社かをご紹介します。">
    <div class="s01-wrap">
      <div class="s01-left">
        <div class="s01-logo">CR<span class="hl-a">A</span>TER</div>
        <p class="s01-sub">株式会社クレーター</p>
      </div>
      <div class="s01-right">
        <p class="s01-tagline">この星に、<br><span class="hl">つめあとを</span><br><span class="hl">残せ。</span></p>
        <span class="badge s01-est">Est. 2013 — Tokyo, Japan</span>
      </div>
    </div>
  </section>`;
}

// SLIDE 02: ミッション | F1 ステートメント | mission
function slide02Mission() {
  return `<section class="slide" data-section="mission" data-notes="クレーターのミッションはシンプルです。価値あるブランドを、必要な人に届ける。メッセージとストーリーを視覚化し、ブランドの価値を正確に伝えることが私たちの仕事です。どれほど優れた商品・サービスであっても、伝わらなければ存在しないのと同じ。だからこそデザインに本質があります。">
    <div class="s02-wrap">
      <div class="divider"></div>
      <p class="s02-statement">価値あるブランドを、<br><span class="hl">必要な人に届ける</span>。<br>それがデザインの本質。</p>
      <p class="s02-body">メッセージとストーリーを視覚化し、<br>ブランドの価値を正確に伝えることが、<br>クレーターの仕事です。</p>
    </div>
  </section>`;
}

// SLIDE 03: 数字で語る | F4 データビジュアル | numbers
function slide03Numbers() {
  return `<section class="slide" data-section="numbers" data-notes="私たちの実績を3つの数字でご覧ください。2013年の創業から12年、長年にわたり幅広い業界のクライアントとデザインを手がけてきました。国際デザイン賞は4冠で、その実力は世界に認められています。そして5つの事業領域をカバーしている点が、クレーターの大きな強みです。">
    <div class="s03-wrap">
      <div class="s03-cell">
        <div class="s03-divider"></div>
        <div class="s03-num">12<span class="unit">年</span></div>
        <p class="s03-label">創業からの実績</p>
      </div>
      <div class="s03-cell">
        <div class="s03-divider"></div>
        <div class="s03-num"><span class="s03-num-accent">4</span><span class="unit">冠</span></div>
        <p class="s03-label">国際デザイン賞受賞</p>
      </div>
      <div class="s03-cell">
        <div class="s03-divider"></div>
        <div class="s03-num">5<span class="unit">領域</span></div>
        <p class="s03-label">カバーする事業領域</p>
      </div>
    </div>
  </section>`;
}

// SLIDE 04: 会社概要 | F2 図解+テキスト | overview
function slide04Overview() {
  return `<section class="slide" data-section="overview" data-notes="会社概要をご説明します。株式会社クレーターは2013年に創業し、2019年4月に法人設立した東京・下北沢のデザイン事務所です。代表の明里圭修がアートディレクターとして、ブランディングからWeb、パッケージまで幅広いデザインを一貫して担当しています。">
    <div class="s04-wrap">
      <div class="s04-left">
        <span class="s04-left-label">Overview</span>
        <div class="s04-left-num">概<br>要</div>
      </div>
      <div class="s04-right">
        <table class="s04-table">
          <tr>
            <th>社名</th>
            <td><strong>株式会社クレーター</strong> / CRATER Inc.</td>
          </tr>
          <tr>
            <th>代表</th>
            <td>明里 圭修（KEISUKE AKARI）</td>
          </tr>
          <tr>
            <th>設立</th>
            <td>2013年創業 / 2019年4月26日 法人設立</td>
          </tr>
          <tr>
            <th>事業内容</th>
            <td>ブランディング、ロゴ、グラフィック、Web、パッケージデザイン</td>
          </tr>
          <tr>
            <th>所在地</th>
            <td>〒155-0031 東京都世田谷区北沢3丁目20-18<br>北沢宝ビル3F</td>
          </tr>
          <tr>
            <th>アクセス</th>
            <td>下北沢駅より徒歩4分（京王井の頭線 / 小田急線）</td>
          </tr>
          <tr>
            <th>営業時間</th>
            <td>10:00 – 19:00（土・日・祝 定休）</td>
          </tr>
        </table>
      </div>
    </div>
  </section>`;
}

// SLIDE 05: 事業内容 | F2 放射図解 | services
function slide05Services() {
  return `<section class="slide" data-section="services" data-notes="クレーターの強みは、領域を限定しないデザインです。この図のとおり、ブランディング・ロゴ・グラフィック・Web・パッケージと、5つの領域すべてをカバーしています。窓口が一つなので、ブランドの世界観を複数の媒体で統一できます。認識のズレが起きないのも大きなメリットです。">
    <div class="s05-wrap">
      <div class="s05-left">
        <p class="section-tag">Services</p>
        <h2 class="slide-h1">領域を<br>限定しない<br><span class="hl">デザイン。</span></h2>
        <p class="slide-body" style="color:var(--c-text-sub)">幅広く・深く。<br>ブランドに必要なすべてを<br>一貫して担います。</p>
      </div>
      <div class="s05-right">
        <svg class="s05-diagram" viewBox="0 0 320 320" style="overflow:visible;">
          <!-- 放射線 -->
          <line x1="160" y1="160" x2="160" y2="28"  stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
          <line x1="160" y1="160" x2="278" y2="91"  stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
          <line x1="160" y1="160" x2="254" y2="252" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
          <line x1="160" y1="160" x2="66"  y2="252" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
          <line x1="160" y1="160" x2="42"  y2="91"  stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
          <!-- 中心（ビビッド黄） -->
          <circle cx="160" cy="160" r="44" fill="#FFE500"/>
          <text x="160" y="155" text-anchor="middle" font-family="'Noto Sans JP',sans-serif" font-size="13" font-weight="900" fill="#111111" letter-spacing="1.5">CRATER</text>
          <text x="160" y="172" text-anchor="middle" font-family="'Noto Sans JP',sans-serif" font-size="9.5" fill="#444444">デザイン事務所</text>
          <!-- ブランディング（上） -->
          <circle cx="160" cy="28" r="32" fill="#D8D8D8" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
          <text x="160" y="23" text-anchor="middle" font-family="'Noto Sans JP',sans-serif" font-size="9.5" font-weight="700" fill="#111111">ブランド</text>
          <text x="160" y="36" text-anchor="middle" font-family="'Noto Sans JP',sans-serif" font-size="9.5" font-weight="700" fill="#111111">ディング</text>
          <!-- ロゴデザイン（右上） -->
          <circle cx="278" cy="91" r="32" fill="#ADADAD" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
          <text x="278" y="86" text-anchor="middle" font-family="'Noto Sans JP',sans-serif" font-size="9.5" font-weight="700" fill="#111111">ロゴ</text>
          <text x="278" y="99" text-anchor="middle" font-family="'Noto Sans JP',sans-serif" font-size="9.5" font-weight="700" fill="#111111">デザイン</text>
          <!-- パッケージ（右下） -->
          <circle cx="254" cy="252" r="32" fill="#D8D8D8" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
          <text x="254" y="247" text-anchor="middle" font-family="'Noto Sans JP',sans-serif" font-size="9.5" font-weight="700" fill="#111111">パッケージ</text>
          <text x="254" y="260" text-anchor="middle" font-family="'Noto Sans JP',sans-serif" font-size="9.5" font-weight="700" fill="#111111">デザイン</text>
          <!-- Web（左下） -->
          <circle cx="66" cy="252" r="32" fill="#D8D8D8" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
          <text x="66" y="247" text-anchor="middle" font-family="'Noto Sans JP',sans-serif" font-size="9.5" font-weight="700" fill="#111111">Web</text>
          <text x="66" y="260" text-anchor="middle" font-family="'Noto Sans JP',sans-serif" font-size="9.5" font-weight="700" fill="#111111">デザイン</text>
          <!-- グラフィック（左上） -->
          <circle cx="42" cy="91" r="32" fill="#ADADAD" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
          <text x="42" y="86" text-anchor="middle" font-family="'Noto Sans JP',sans-serif" font-size="9.5" font-weight="700" fill="#111111">グラフィック</text>
          <text x="42" y="99" text-anchor="middle" font-family="'Noto Sans JP',sans-serif" font-size="9.5" font-weight="700" fill="#111111">デザイン</text>
        </svg>
      </div>
    </div>
  </section>`;
}

// SLIDE 06: 受賞歴 | F4 タイムライン | awards
function slide06Awards() {
  return `<section class="slide" data-section="awards" data-notes="受賞歴をご紹介します。2023年にはA' Design Award銀賞、German Design Award、Asia Design Prize金賞を受賞し、K-Design Awardでは複数年にわたり金賞・銀賞を受賞しています。デザイン専門誌「デザインノート」での10ページ特集掲載など、業界からも高く評価されています。">
    <div class="s06-inner">
      <div class="s06-header">
        <p class="section-tag">Awards</p>
        <div style="height:10px"></div>
        <h2 class="slide-h2">国際デザイン賞<span class="hl">4冠</span>。世界が認めた実力。</h2>
      </div>
      <div class="s06-grid">
        <div class="s06-card">
          <span class="badge">2023</span>
          <div class="s06-award-name">A' Design<br>Award</div>
          <div class="s06-result">Silver Award</div>
        </div>
        <div class="s06-card">
          <span class="badge">2023</span>
          <div class="s06-award-name">German<br>Design Award</div>
          <div class="s06-result">受賞</div>
        </div>
        <div class="s06-card">
          <span class="badge">2023</span>
          <div class="s06-award-name">Asia Design<br>Prize</div>
          <div class="s06-result">Gold Award</div>
        </div>
        <div class="s06-card">
          <span class="badge">複数年</span>
          <div class="s06-award-name">K-Design<br>Award</div>
          <div class="s06-result">Gold / Silver 複数受賞</div>
        </div>
      </div>
      <div class="s06-footer">
        <p class="slide-small" style="color:var(--c-text-sub)">
          デザインノート 特集掲載（10ページ）　／　全国対応・オンライン完全対応
        </p>
      </div>
    </div>
  </section>`;
}

// SLIDE 07: クライアント | F3 グリッド対比 | clients
function slide07Clients() {
  return `<section class="slide" data-section="clients" data-notes="クライアント実績をご紹介します。亀田製菓、西武ライオンズ、日本中央競馬会、日東紡績など、食品・スポーツ・エンターテインメント・製造業と多様な業界の大手企業とデザイン案件を手がけてきました。業界を問わずブランドの価値を伝えることがクレーターの強みです。">
    <div class="s07-inner">
      <div class="s07-header">
        <p class="section-tag">Clients</p>
        <div style="height:10px"></div>
        <h2 class="slide-h2">大手から専門ブランドまで。<br><span class="hl">信頼が積み重なる実績。</span></h2>
      </div>
      <div class="s07-grid">
        <div class="s07-cell">
          <div class="s07-client-name">亀田製菓</div>
          <div class="s07-client-industry">食品メーカー</div>
        </div>
        <div class="s07-cell">
          <div class="s07-client-name">西武ライオンズ</div>
          <div class="s07-client-industry">プロスポーツ</div>
        </div>
        <div class="s07-cell">
          <div class="s07-client-name">日本中央競馬会</div>
          <div class="s07-client-industry">エンターテインメント</div>
        </div>
        <div class="s07-cell">
          <div class="s07-client-name">日東紡績</div>
          <div class="s07-client-industry">製造業</div>
        </div>
      </div>
    </div>
  </section>`;
}

// SLIDE 08: 連絡先 | F8 ブリッジ・黒面 | contact
function slide08Contact() {
  return `<section class="slide" data-section="contact" data-notes="ご覧いただきありがとうございました。デザインのご相談はお気軽にどうぞ。電話・メール・オンラインどちらでも対応いたします。まずは一度お話を聞かせていただければと思います。引き続きどうぞよろしくお願いいたします。">
    <div class="s08-wrap">
      <div class="s08-left">
        <div class="s08-logo">CR<span class="hl-a">A</span>TER</div>
        <p class="s08-company">株式会社クレーター</p>
        <p class="s08-url">crater.co.jp</p>
      </div>
      <div class="s08-right">
        <div class="s08-row">
          <span class="s08-row-label">TEL</span>
          <span class="s08-row-val">03-6665-0846</span>
        </div>
        <div class="s08-row">
          <span class="s08-row-label">FAX</span>
          <span class="s08-row-val">03-6800-3608</span>
        </div>
        <div class="s08-row">
          <span class="s08-row-label">所在地</span>
          <span class="s08-row-val">〒155-0031<br>東京都世田谷区北沢3丁目20-18<br>北沢宝ビル3F</span>
        </div>
        <div class="s08-row">
          <span class="s08-row-label">営業時間</span>
          <span class="s08-row-val">10:00 – 19:00（土・日・祝 定休）</span>
        </div>
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
  slide05Services,
  slide06Awards,
  slide07Clients,
  slide08Contact,
];

window.agendaItems = [
  { id: 'cover',    label: '表紙' },
  { id: 'mission',  label: 'ミッション' },
  { id: 'numbers',  label: '実績数字' },
  { id: 'overview', label: '会社概要' },
  { id: 'services', label: '事業内容' },
  { id: 'awards',   label: '受賞歴' },
  { id: 'clients',  label: 'クライアント' },
  { id: 'contact',  label: '連絡先' },
];
