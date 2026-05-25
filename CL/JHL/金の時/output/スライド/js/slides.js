window.slideFactories = [];

/* stage = 1920×1080px固定 */

// ─── P1: オープニング ───
window.slideFactories[0] = () => `
<div class="slide slide-flex" id="s1" style="background:#FAF7F2;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 220px;position:relative;">
  <div style="position:absolute;top:50%;right:-100px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.14) 0%,transparent 62%);transform:translateY(-50%);pointer-events:none;"></div>
  <div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;margin-bottom:40px;position:relative;z-index:2;">Brand Proposal</div>
  <div style="font-family:'Zen Old Mincho',serif;font-size:68px;font-weight:500;color:#2C2C2C;letter-spacing:0.05em;line-height:1.3;position:relative;z-index:2;">JHL+金時草製品のブランド設計</div>
  <div style="position:absolute;bottom:160px;left:220px;z-index:2;">
    <svg viewBox="120 235 640 135" width="160" height="34" xmlns="http://www.w3.org/2000/svg">
      <path d="M204.5,323.6c-10.4,10.4-25.7,13.1-39.8,6.9-7.3-3.2-13-8.9-16.2-16.3-5-11.7-4.1-24.1,2.5-34.1,6.5-9.8,17.3-15.7,29-15.7s18,3.6,24.5,10.2l.4.4,16.9-16.9-.4-.4c-16.5-16.5-40.8-21.5-63.5-13.1-14.8,5.5-26.6,17.1-32.2,31.8-7.3,19.2-5.2,39.6,6,55.8,11,15.9,29,25.4,48.3,25.4s30.3-6.1,41.4-17.2l.4-.4-16.9-16.9-.4.4Z" fill="#B8B3A8"/>
      <path d="M324.3,276.3c-1.3-19.4-18-34.2-37.4-34.2h-46.1s0,114,0,114h22.3v-38.6c0-1,.8-1.9,1.9-1.9h12.4c2.9,0,5.6,1.7,6.9,4.3l17.4,36.2h24.8l-21.5-44.7c0,0,0-.1,0-.1,12.2-6.6,20.4-19.9,19.3-34.9ZM289.5,293.2h-24.6c-1,0-1.9-.8-1.9-1.9v-24.9c0-1,.8-1.9,1.9-1.9h22.7c10.9,0,19.1,12.3,11.3,23.8-2.1,3.1-5.7,5-9.4,5Z" fill="#B8B3A8"/>
      <path d="M720.4,276.3c-1.3-19.4-18-34.2-37.4-34.2h-46.1s0,114,0,114h22.3v-38.6c0-1,.8-1.9,1.9-1.9h12.4c2.9,0,5.6,1.7,6.9,4.3l17.4,36.2h24.8l-21.5-44.7c0,0,0-.1,0-.1,12.2-6.6,20.4-19.9,19.3-34.9ZM685.6,293.2h-24.6c-1,0-1.9-.8-1.9-1.9v-24.9c0-1,.8-1.9,1.9-1.9h22.7c10.9,0,19.1,12.3,11.3,23.8-2.1,3.1-5.7,5-9.4,5Z" fill="#B8B3A8"/>
      <path d="M544.7,242.1v114h71.8v-22.3h-47.1c-1.3,0-2.3-1-2.3-2.3v-19.8c0-1.3,1-2.3,2.3-2.3h42.9v-22.3h-42.9c-1.3,0-2.3-1-2.3-2.3v-17.9c0-1.3,1-2.3,2.3-2.3h47.1v-22.3h-71.8Z" fill="#B8B3A8"/>
      <path d="M440.9,264.4h29.2c1,0,1.9.8,1.9,1.9v89.7h22.3v-89.7c0-1,.8-1.9,1.9-1.9h29.2v-22.3h-84.5v22.3Z" fill="#B8B3A8"/>
      <path d="M377.4,242.1l-38.8,114h23.6l6.3-18.6c.7-2,2.6-3.3,4.7-3.3h33.3c2.1,0,4,1.3,4.7,3.3l6.3,18.6h23.6l-38.8-114h-24.9ZM377.7,310.5l12.1-35.6,12.1,35.6c.2.6-.3,1.3-.9,1.3h-22.4c-.7,0-1.2-.7-.9-1.3Z" fill="#B8B3A8"/>
    </svg>
    </div>
</div>
`;

// ─── P2: タグライン ───
window.slideFactories[1] = () => `
<div class="slide slide-flex" id="s2" style="background:#F5F2EC;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 220px;position:relative;">
  <div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;margin-bottom:48px;">Tagline</div>
  <div style="font-family:'Zen Old Mincho',serif;font-size:148px;font-weight:500;color:#2C2C2C;letter-spacing:0.07em;line-height:1.4;position:relative;z-index:2;">輝きは、<br>準備から始まる。</div>
  <div style="font-family:'Crimson Pro',serif;font-size:26px;color:#9A7B2E;letter-spacing:0.2em;margin-top:40px;opacity:0.7;position:relative;z-index:2;">Brilliance begins with preparation.</div>
</div>
`;

// ─── P3: ブランドストーリー ───
window.slideFactories[2] = () => `
<div class="slide slide-flex" id="s3" style="background:#FAF7F2;flex-direction:row;position:relative;">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:80px 100px 80px 160px;position:relative;z-index:2;">
    <div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;margin-bottom:48px;">Story</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:72px;font-weight:500;color:#2C2C2C;letter-spacing:0.06em;line-height:1.4;margin-bottom:56px;">今この瞬間以降の<br>人生が元気で輝くように。</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:24px;font-weight:300;color:#5C5956;line-height:2.2;letter-spacing:0.06em;">
      加賀の地で4000年の歴史を持つ金時草。<br>その自然の恵みを届けることで、<br>今この瞬間から先の人生を、元気に・輝くように。<br><br>
      金の時とは、あなたの黄金時代。それは今日から始まっている。
    </div>
  </div>
  <div style="width:680px;flex-shrink:0;position:relative;overflow:hidden;">
    <img src="img/p3_story.jpg" style="width:100%;height:100%;object-fit:cover;object-position:center 30%;" alt="">
  </div>
</div>
`;

// ─── P4: コアコード ───
window.slideFactories[3] = () => `
<div class="slide slide-flex" id="s4" style="background:#FAF7F2;flex-direction:row;position:relative;">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:80px 80px 80px 160px;position:relative;z-index:2;">
    <div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;margin-bottom:40px;">Brand Core Code</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:96px;font-weight:500;color:#2C2C2C;letter-spacing:0.06em;line-height:1.2;">不老長寿と<br>呼ばれる野菜。</div>
    <div style="font-family:'Crimson Pro',serif;font-size:26px;color:#9A7B2E;letter-spacing:0.2em;margin-top:16px;opacity:0.65;">The Vegetable of Eternal Youth</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:24px;font-weight:300;color:#5C5956;line-height:2.2;margin-top:48px;letter-spacing:0.05em;">
      古来より「不老長寿の野菜」と呼ばれてきた加賀の伝統野菜。<br>
      アントシアニン・GABA・鉄分・カルシウムを豊富に含む。
    </div>
  </div>
  <div style="width:640px;flex-shrink:0;position:relative;overflow:hidden;">
    <img src="img/p4_core.jpg" style="width:100%;height:100%;object-fit:cover;" alt="">
  </div>
</div>
`;

// ─── P5: ブランド4原則 ───
window.slideFactories[4] = () => `
<div class="slide slide-flex" id="s5" style="background:#F5F2EC;flex-direction:column;justify-content:center;padding:80px 160px;">
  <div style="margin-bottom:56px;">
    <span style="font-family:'Crimson Pro',serif;font-size:22px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;">Brand Principles</span>
    <span style="font-family:'Noto Sans JP',sans-serif;font-size:18px;font-weight:300;color:#5C5956;letter-spacing:0.15em;margin-left:24px;">ブランド原則</span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:28px;">
    <div style="background:#fff;border-radius:16px;padding:48px 36px;border:1px solid #E4E0D8;">
      <div style="font-family:'Crimson Pro',serif;font-size:80px;color:#E8D5A3;line-height:1;margin-bottom:20px;">01</div>
      <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;margin-bottom:10px;">Silence</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:42px;font-weight:600;color:#2C2C2C;margin-bottom:16px;">静寂</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;font-weight:300;color:#5C5956;line-height:1.9;">語りすぎない。効能を語らず、人生を語る。静かな確信を纏う。</div>
    </div>
    <div style="background:#fff;border-radius:16px;padding:48px 36px;border:1px solid #E4E0D8;">
      <div style="font-family:'Crimson Pro',serif;font-size:80px;color:#E8D5A3;line-height:1;margin-bottom:20px;">02</div>
      <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;margin-bottom:10px;">Radiance</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:42px;font-weight:600;color:#2C2C2C;margin-bottom:16px;">輝き</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;font-weight:300;color:#5C5956;line-height:1.9;">内側から滲み出る輝き。派手さとは無縁の、白金のような光。</div>
    </div>
    <div style="background:#fff;border-radius:16px;padding:48px 36px;border:1px solid #E4E0D8;">
      <div style="font-family:'Crimson Pro',serif;font-size:80px;color:#E8D5A3;line-height:1;margin-bottom:20px;">03</div>
      <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;margin-bottom:10px;">Tradition</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:42px;font-weight:600;color:#2C2C2C;margin-bottom:16px;">伝統</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;font-weight:300;color:#5C5956;line-height:1.9;">加賀・金沢の歴史。その蓄積を纏う。4000年の知恵を現代へ。</div>
    </div>
    <div style="background:#fff;border-radius:16px;padding:48px 36px;border:1px solid #E4E0D8;">
      <div style="font-family:'Crimson Pro',serif;font-size:80px;color:#E8D5A3;line-height:1;margin-bottom:20px;">04</div>
      <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;margin-bottom:10px;">Preparation</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:42px;font-weight:600;color:#2C2C2C;margin-bottom:16px;">準備</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;font-weight:300;color:#5C5956;line-height:1.9;">「治す」でも「予防する」でもない。輝く人生のための準備。</div>
    </div>
  </div>
</div>
`;

// ─── P6: ネーミング ───
window.slideFactories[5] = () => `
<div class="slide slide-flex" id="s6" style="background:#FAF7F2;flex-direction:column;justify-content:center;padding:0 220px;gap:56px;">
  <!-- 上：ブランド名 -->
  <div>
    <div style="font-family:'Crimson Pro',serif;font-size:22px;letter-spacing:0.5em;color:#9A7B2E;text-transform:uppercase;margin-bottom:20px;">Naming</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:120px;font-weight:500;color:#2C2C2C;letter-spacing:0.04em;line-height:1;">金の時</div>
    <div style="font-family:'Crimson Pro',serif;font-size:28px;letter-spacing:0.45em;color:#C9A84C;margin-top:12px;">Golden Moments</div>
  </div>
  <!-- 下：3つの金 -->
  <div>
    <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;margin-bottom:32px;">3つの「金」</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:48px;">
      <div style="border-left:3px solid #E8D5A3;padding-left:28px;">
        <div style="font-family:'Crimson Pro',serif;font-size:52px;color:#E8D5A3;line-height:1;margin-bottom:8px;">01</div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:34px;font-weight:600;color:#2C2C2C;margin-bottom:12px;">金時草から</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:22px;font-weight:300;color:#5C5956;line-height:1.9;">加賀野菜「金時草」の「金」。成分の由来と産地を同時に伝える。</div>
      </div>
      <div style="border-left:3px solid #E8D5A3;padding-left:28px;">
        <div style="font-family:'Crimson Pro',serif;font-size:52px;color:#E8D5A3;line-height:1;margin-bottom:8px;">02</div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:28px;font-weight:600;color:#2C2C2C;margin-bottom:12px;">金箔シェア100%の<br>金沢の金</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:22px;font-weight:300;color:#5C5956;line-height:1.9;">金沢は「金箔」の都市。伝統・信頼・上質さを一字で表す。</div>
      </div>
      <div style="border-left:3px solid #E8D5A3;padding-left:28px;">
        <div style="font-family:'Crimson Pro',serif;font-size:52px;color:#E8D5A3;line-height:1;margin-bottom:8px;">03</div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:34px;font-weight:600;color:#2C2C2C;margin-bottom:12px;">黄金の時間</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:22px;font-weight:300;color:#5C5956;line-height:1.9;">名前そのものがコンセプト。輝く人生への準備という文脈。</div>
      </div>
    </div>
  </div>
</div>
`;

// ─── P7: Do's & Don'ts ───
window.slideFactories[6] = () => `
<div class="slide slide-flex" id="s7" style="background:#F5F2EC;flex-direction:column;justify-content:center;padding:80px 160px;">
  <div style="margin-bottom:56px;">
    <span style="font-family:'Crimson Pro',serif;font-size:22px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;">Do's & Don'ts</span>
    <span style="font-family:'Noto Sans JP',sans-serif;font-size:18px;font-weight:300;color:#5C5956;letter-spacing:0.15em;margin-left:24px;">このブランドがすること・しないこと</span>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;">
    <div>
      <div style="font-family:'Crimson Pro',serif;font-size:36px;letter-spacing:0.2em;color:#9A7B2E;text-transform:uppercase;padding-bottom:20px;border-bottom:1px solid #E8D5A3;margin-bottom:16px;">Do's</div>
      <div style="display:flex;align-items:flex-start;gap:20px;font-family:'Noto Sans JP',sans-serif;font-size:24px;font-weight:300;color:#2C2C2C;line-height:1.8;padding:20px 0;border-bottom:1px solid rgba(0,0,0,0.05);"><span style="font-family:'Crimson Pro',serif;font-size:28px;color:#C9A84C;flex-shrink:0;line-height:1.4;">✦</span>人生・時間・輝きを語る言葉を使う</div>
      <div style="display:flex;align-items:flex-start;gap:20px;font-family:'Noto Sans JP',sans-serif;font-size:24px;font-weight:300;color:#2C2C2C;line-height:1.8;padding:20px 0;border-bottom:1px solid rgba(0,0,0,0.05);"><span style="font-family:'Crimson Pro',serif;font-size:28px;color:#C9A84C;flex-shrink:0;line-height:1.4;">✦</span>産地「加賀・金沢」を文脈として使う</div>
      <div style="display:flex;align-items:flex-start;gap:20px;font-family:'Noto Sans JP',sans-serif;font-size:24px;font-weight:300;color:#2C2C2C;line-height:1.8;padding:20px 0;border-bottom:1px solid rgba(0,0,0,0.05);"><span style="font-family:'Crimson Pro',serif;font-size:28px;color:#C9A84C;flex-shrink:0;line-height:1.4;">✦</span>静かで品のある余白を大切にする</div>
      <div style="display:flex;align-items:flex-start;gap:20px;font-family:'Noto Sans JP',sans-serif;font-size:24px;font-weight:300;color:#2C2C2C;line-height:1.8;padding:20px 0;"><span style="font-family:'Crimson Pro',serif;font-size:28px;color:#C9A84C;flex-shrink:0;line-height:1.4;">✦</span>ゴールド・ベージュ・オフホワイトで統一</div>
    </div>
    <div>
      <div style="font-family:'Crimson Pro',serif;font-size:36px;letter-spacing:0.2em;color:#B8B3A8;text-transform:uppercase;padding-bottom:20px;border-bottom:1px solid #E4E0D8;margin-bottom:16px;">Don'ts</div>
      <div style="display:flex;align-items:flex-start;gap:20px;font-family:'Noto Sans JP',sans-serif;font-size:24px;font-weight:300;color:#2C2C2C;line-height:1.8;padding:20px 0;border-bottom:1px solid rgba(0,0,0,0.05);"><span style="font-family:'Crimson Pro',serif;font-size:28px;color:#B8B3A8;flex-shrink:0;line-height:1.4;">×</span>「効く」「治る」「予防」などの効能訴求</div>
      <div style="display:flex;align-items:flex-start;gap:20px;font-family:'Noto Sans JP',sans-serif;font-size:24px;font-weight:300;color:#2C2C2C;line-height:1.8;padding:20px 0;border-bottom:1px solid rgba(0,0,0,0.05);"><span style="font-family:'Crimson Pro',serif;font-size:28px;color:#B8B3A8;flex-shrink:0;line-height:1.4;">×</span>「最高品質」「No.1」などの誇大表現</div>
      <div style="display:flex;align-items:flex-start;gap:20px;font-family:'Noto Sans JP',sans-serif;font-size:24px;font-weight:300;color:#2C2C2C;line-height:1.8;padding:20px 0;border-bottom:1px solid rgba(0,0,0,0.05);"><span style="font-family:'Crimson Pro',serif;font-size:28px;color:#B8B3A8;flex-shrink:0;line-height:1.4;">×</span>緑×白の一般サプリデザインに近づく</div>
      <div style="display:flex;align-items:flex-start;gap:20px;font-family:'Noto Sans JP',sans-serif;font-size:24px;font-weight:300;color:#2C2C2C;line-height:1.8;padding:20px 0;"><span style="font-family:'Crimson Pro',serif;font-size:28px;color:#B8B3A8;flex-shrink:0;line-height:1.4;">×</span>ポップすぎる・安売り感のある表現</div>
    </div>
  </div>
</div>
`;

// ─── P8: カラーパレット（5色）───
window.slideFactories[7] = () => `
<div class="slide slide-flex" id="s8" style="background:#FAF7F2;flex-direction:column;justify-content:center;padding:80px 160px;">
  <div style="margin-bottom:64px;">
    <span style="font-family:'Crimson Pro',serif;font-size:22px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;">Color Palette</span>
    <span style="font-family:'Noto Sans JP',sans-serif;font-size:18px;font-weight:300;color:#5C5956;letter-spacing:0.15em;margin-left:24px;">カラーパレット</span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:36px;">
    <div><div style="background:#C9A84C;border-radius:12px;height:320px;margin-bottom:20px;"></div><div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.2em;color:#2C2C2C;margin-bottom:6px;">Gold</div><div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;">#C9A84C</div></div>
    <div><div style="background:#E8D5A3;border-radius:12px;height:320px;margin-bottom:20px;border:1px solid rgba(0,0,0,0.06);"></div><div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.2em;color:#2C2C2C;margin-bottom:6px;">Gold Light</div><div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;">#E8D5A3</div></div>
    <div><div style="background:#9A7B2E;border-radius:12px;height:320px;margin-bottom:20px;"></div><div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.2em;color:#2C2C2C;margin-bottom:6px;">Gold Dark</div><div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;">#9A7B2E</div></div>
    <div><div style="background:#FAF7F2;border-radius:12px;height:320px;margin-bottom:20px;border:1px solid #E4E0D8;"></div><div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.2em;color:#2C2C2C;margin-bottom:6px;">Off White</div><div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;">#FAF7F2</div></div>
    <div><div style="background:#2C2C2C;border-radius:12px;height:320px;margin-bottom:20px;"></div><div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.2em;color:#2C2C2C;margin-bottom:6px;">Charcoal</div><div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;">#2C2C2C</div></div>
  </div>
</div>
`;

// ─── P9: ブリッジ「Brand Design」Section 01 ───
window.slideFactories[8] = () => `
<div class="slide slide-flex" id="s9" style="background:#C9A84C;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 220px;position:relative;">
  <div style="position:absolute;top:0;left:0;width:6px;height:100%;background:#2C2C2C;"></div>
  <div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.5em;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-bottom:24px;">Section 01</div>
  <div style="font-family:'Zen Old Mincho',serif;font-size:96px;font-weight:500;color:#FAF7F2;letter-spacing:0.06em;line-height:1.3;">ブランドデザイン</div>
  <div style="font-family:'Crimson Pro',serif;font-size:28px;letter-spacing:0.4em;color:rgba(255,255,255,0.8);margin-top:20px;">Brand Design System</div>
</div>
`;

// ─── P10: ビジュアルコンセプト QUIET GOLD ───
window.slideFactories[9] = () => `
<div class="slide slide-flex" id="s10" style="background:#F5F2EC;flex-direction:column;justify-content:center;padding:80px 160px;">
  <div style="margin-bottom:56px;">
    <span style="font-family:'Crimson Pro',serif;font-size:22px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;">Visual Concept</span>
    <span style="font-family:'Noto Sans JP',sans-serif;font-size:18px;font-weight:300;color:#5C5956;letter-spacing:0.15em;margin-left:24px;">ビジュアルコンセプト</span>
  </div>
  <div>
    <div style="font-family:'Crimson Pro',serif;font-size:160px;letter-spacing:0.12em;color:#C9A84C;line-height:1;margin-bottom:48px;">QUIET GOLD</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:28px;font-weight:300;color:#5C5956;line-height:2.1;letter-spacing:0.05em;margin-bottom:48px;">騒がしくない金。語りすぎない美。<br>静謐な余白の中に宿る、本物の輝き。<br>加賀の伝統から生まれた、現代の品格。</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:36px;color:#2C2C2C;letter-spacing:0.12em;">黄金の静けさが、人生を整える。</div>
  </div>
</div>
`;

// ─── P11: ロゴタイプ 扉 ───
window.slideFactories[10] = () => `
<div class="slide slide-flex" id="s11" style="background:#C9A84C;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 220px;position:relative;">
  <div style="position:absolute;top:0;right:0;bottom:0;width:6px;background:#2C2C2C;"></div>
  <div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.5em;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-bottom:24px;">Logotype</div>
  <div style="font-family:'Zen Old Mincho',serif;font-size:96px;font-weight:500;color:#fff;letter-spacing:0.08em;line-height:1.2;">金の時<br>ロゴタイプ</div>
  <div style="font-family:'Crimson Pro',serif;font-size:28px;letter-spacing:0.4em;color:rgba(255,255,255,0.8);margin-top:20px;">Brand Identity</div>
</div>
`;

// ─── P12: ロゴタイプ 画像 ───
window.slideFactories[11] = () => `
<div class="slide slide-flex" id="s12" style="background:#FAF7F2;flex-direction:column;justify-content:center;align-items:center;position:relative;">
  <img src="img/logo.png" style="max-width:70%;max-height:70%;object-fit:contain;mix-blend-mode:multiply;" alt="金の時 ロゴタイプ">
</div>
`;

// ─── P13: パッケージデザイン 扉 ───
window.slideFactories[12] = () => `
<div class="slide slide-flex" id="s11" style="background:#C9A84C;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 220px;position:relative;">
  <div style="position:absolute;top:0;left:0;width:6px;height:100%;background:#2C2C2C;"></div>
  <div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.5em;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-bottom:24px;">Package Design</div>
  <div style="font-family:'Zen Old Mincho',serif;font-size:96px;font-weight:500;color:#FAF7F2;letter-spacing:0.06em;line-height:1.3;">パッケージ<br>デザイン</div>
</div>
`;

// ─── P12: パッケージデザイン（画像）───
window.slideFactories[13] = () => `
<div class="slide" id="s12" style="background:#fff;position:relative;overflow:hidden;">
  <img src="img/きんじ.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;" alt="金の時 パッケージデザイン">
</div>
`;

// ─── P13: パッケージコンセプト ───
window.slideFactories[14] = () => `
<div class="slide slide-flex" id="s13" style="background:#FAF7F2;flex-direction:row;position:relative;">
  <div style="width:640px;flex-shrink:0;position:relative;overflow:hidden;">
    <img src="img/package.jpg" style="width:100%;height:100%;object-fit:cover;object-position:center top;" alt="">
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:80px 120px 80px 80px;position:relative;z-index:2;">
    <div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;margin-bottom:48px;">Package Concept</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:64px;font-weight:500;color:#2C2C2C;letter-spacing:0.06em;line-height:1.4;margin-bottom:48px;">金の輝きを、<br>手のひらに。</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:22px;font-weight:300;color:#5C5956;line-height:2.2;letter-spacing:0.05em;">
      上半面をゴールドで大きく染め上げたシンプルな構成。<br>
      余白を贅沢に使うことで、素材への誠実さを表現します。<br><br>
      ゴールドの大きな面を展開に活かし、<br>ブランドらしさを一目で伝えるデザイン。<br><br>
      「金の時」のロゴは、固くなりすぎないよう<br>手書きの温もりをほのかに宿した書体で。<br>
      愛され続けるためのシンプルさを、ここに。
    </div>
  </div>
</div>
`;

// ─── P14: ブリッジ「販売戦略」Section 02 ───
window.slideFactories[15] = () => `
<div class="slide slide-flex" id="s14" style="background:#C9A84C;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 220px;position:relative;">
  <div style="position:absolute;top:0;left:0;width:6px;height:100%;background:#2C2C2C;"></div>
  <div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.5em;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-bottom:24px;">Section 02</div>
  <div style="font-family:'Zen Old Mincho',serif;font-size:96px;font-weight:500;color:#FAF7F2;letter-spacing:0.06em;line-height:1.3;">販売戦略</div>
  <div style="font-family:'Crimson Pro',serif;font-size:28px;letter-spacing:0.4em;color:rgba(255,255,255,0.8);margin-top:20px;">Sales Strategy</div>
</div>
`;

// ─── P15: 定期購読モデルの提案 ───
window.slideFactories[16] = () => `
<div class="slide slide-flex" id="s15" style="background:#FAF7F2;flex-direction:row;position:relative;">
  <div style="width:50%;flex-shrink:0;position:relative;overflow:hidden;">
    <img src="img/p13_sub.jpg" style="width:100%;height:100%;object-fit:cover;object-position:60% center;" alt="">
  </div>
  <div style="width:50%;display:flex;flex-direction:column;justify-content:center;padding:60px 100px 60px 80px;">
    <div style="margin-bottom:40px;">
      <span style="font-family:'Crimson Pro',serif;font-size:22px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;">Subscription Model</span>
      <span style="font-family:'Noto Sans JP',sans-serif;font-size:18px;font-weight:300;color:#5C5956;letter-spacing:0.15em;margin-left:20px;">定期購読モデルのご提案</span>
    </div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:88px;font-weight:500;color:#2C2C2C;letter-spacing:0.06em;line-height:1.5;margin-bottom:32px;">続けることで、<br>輝きは深まる。</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;line-height:2.0;margin-bottom:32px;">金の時の価値は「継続」にあります。毎月届く安心感と習慣化によって顧客のLTVを最大化します。</div>
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div style="background:#fff;border-radius:12px;padding:24px 32px;border:1px solid #E4E0D8;border-left:4px solid #C9A84C;display:flex;gap:20px;align-items:center;">
        <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;min-width:90px;">Point 01</div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:26px;color:#2C2C2C;">離脱率の最小化</div>
      </div>
      <div style="background:#fff;border-radius:12px;padding:24px 32px;border:1px solid #E4E0D8;border-left:4px solid #C9A84C;display:flex;gap:20px;align-items:center;">
        <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;min-width:90px;">Point 02</div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:26px;color:#2C2C2C;">ブランドとの接点を増やす</div>
      </div>
      <div style="background:#fff;border-radius:12px;padding:24px 32px;border:1px solid #E4E0D8;border-left:4px solid #C9A84C;display:flex;gap:20px;align-items:center;">
        <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;min-width:90px;">Point 03</div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:26px;color:#2C2C2C;">収益の安定化</div>
      </div>
    </div>
  </div>
</div>
`;

// ─── P16: LINEを軸としたファン化フロー ───
window.slideFactories[17] = () => `
<div class="slide slide-flex" id="s16" style="background:#F5F2EC;flex-direction:column;justify-content:center;padding:80px 160px;">
  <div style="margin-bottom:52px;">
    <span style="font-family:'Crimson Pro',serif;font-size:22px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;">Fan Building</span>
    <span style="font-family:'Noto Sans JP',sans-serif;font-size:18px;font-weight:300;color:#5C5956;letter-spacing:0.15em;margin-left:24px;">LINEを軸としたファン化設計</span>
  </div>
  <div style="display:flex;gap:32px;align-items:stretch;">
    <div style="flex:1;background:#fff;border-radius:16px;padding:44px 36px;border:1px solid #E4E0D8;display:flex;flex-direction:column;align-items:center;text-align:center;">
      <div style="font-family:'Crimson Pro',serif;font-size:64px;color:#E8D5A3;line-height:1;margin-bottom:20px;">01</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:34px;color:#2C2C2C;margin-bottom:16px;">認知</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;font-weight:300;color:#5C5956;line-height:1.8;">Instagram・PRで<br>「不老長寿の野菜」<br>として認知拡大</div>
    </div>
    <div style="display:flex;align-items:center;color:#C9A84C;font-size:36px;">→</div>
    <div style="flex:1;background:#fff;border-radius:16px;padding:44px 36px;border:1px solid #E4E0D8;display:flex;flex-direction:column;align-items:center;text-align:center;">
      <div style="font-family:'Crimson Pro',serif;font-size:64px;color:#E8D5A3;line-height:1;margin-bottom:20px;">02</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:34px;color:#2C2C2C;margin-bottom:16px;">初回購入</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;font-weight:300;color:#5C5956;line-height:1.8;">ECサイトから<br>単品・お試しで<br>ファーストタッチ</div>
    </div>
    <div style="display:flex;align-items:center;color:#C9A84C;font-size:36px;">→</div>
    <div style="flex:1;background:#C9A84C;border-radius:16px;padding:44px 36px;display:flex;flex-direction:column;align-items:center;text-align:center;">
      <div style="font-family:'Crimson Pro',serif;font-size:64px;color:rgba(255,255,255,0.4);line-height:1;margin-bottom:20px;">03</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:34px;color:#fff;margin-bottom:16px;">LINE登録</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;font-weight:300;color:rgba(255,255,255,0.85);line-height:1.8;">購入後にLINE誘導。<br>コンテンツ配信・<br>継続サポートを提供</div>
    </div>
    <div style="display:flex;align-items:center;color:#C9A84C;font-size:36px;">→</div>
    <div style="flex:1;background:#2C2C2C;border-radius:16px;padding:44px 36px;display:flex;flex-direction:column;align-items:center;text-align:center;">
      <div style="font-family:'Crimson Pro',serif;font-size:64px;color:rgba(201,168,76,0.4);line-height:1;margin-bottom:20px;">04</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:34px;color:#FAF7F2;margin-bottom:16px;">定期購読</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;font-weight:300;color:#B8B3A8;line-height:1.8;">LINEで定期への<br>切り替えを促し<br>LTVを最大化</div>
    </div>
  </div>
</div>
`;

// ─── P17: ブリッジ「製品ライン拡張」Section 03 ───
window.slideFactories[18] = () => `
<div class="slide slide-flex" id="s17" style="background:#C9A84C;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 220px;position:relative;">
  <div style="position:absolute;top:0;left:0;width:6px;height:100%;background:#2C2C2C;"></div>
  <div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.5em;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-bottom:24px;">Section 03</div>
  <div style="font-family:'Zen Old Mincho',serif;font-size:96px;font-weight:500;color:#FAF7F2;letter-spacing:0.06em;line-height:1.3;">製品ライン<br>拡張提案</div>
  <div style="font-family:'Crimson Pro',serif;font-size:28px;letter-spacing:0.4em;color:rgba(255,255,255,0.8);margin-top:20px;">Product Line Expansion</div>
</div>
`;

// ─── P18: 製品ライン — 金の時（フラッグシップ）───
window.slideFactories[19] = () => `
<div class="slide slide-flex" id="s18" style="background:#FAF7F2;flex-direction:row;position:relative;">
  <div style="width:640px;flex-shrink:0;position:relative;overflow:hidden;">
    <img src="img/k17_product.jpg" style="width:100%;height:100%;object-fit:cover;object-position:center center;" alt="">
    <div style="position:absolute;bottom:48px;left:48px;background:rgba(44,44,44,0.85);padding:12px 28px;border-radius:40px;">
      <span style="font-family:'Crimson Pro',serif;font-size:16px;letter-spacing:0.3em;color:#E8D5A3;text-transform:uppercase;">Current — Flagship</span>
    </div>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:80px 120px 80px 80px;position:relative;z-index:2;">
    <div style="margin-bottom:32px;">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M36 10 C22 10 12 22 12 38 C12 50 20 58 32 62" stroke="#C9A84C" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M36 10 C50 10 60 22 60 38 C60 50 52 58 40 62" stroke="#C9A84C" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="M36 10 L36 62" stroke="#C9A84C" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M36 28 L24 22" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        <path d="M36 38 L48 30" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        <path d="M36 48 L26 44" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
      </svg>
    </div>
    <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;margin-bottom:12px;">Pure Powder — Core Product</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:72px;font-weight:500;color:#2C2C2C;letter-spacing:0.06em;line-height:1.2;margin-bottom:8px;">金の時</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;color:#9A7B2E;margin-bottom:36px;letter-spacing:0.1em;">金時草 純粉末　2g × 30包 スティックタイプ</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;line-height:2.1;letter-spacing:0.05em;margin-bottom:40px;">
      加賀・金沢の伝統野菜「金時草」だけを原料とした<br>シンプルで誠実な粉末サプリメント。<br>素材そのものの力をスティック1包に凝縮。<br>全製品ラインの出発点となるフラッグシップ。
    </div>
    <div style="display:flex;gap:16px;flex-wrap:wrap;">
      <div style="background:#F5F2EC;border:1px solid #E4E0D8;border-radius:8px;padding:12px 24px;">
        <span style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#5C5956;">既存販売中</span>
      </div>
      <div style="background:#F5F2EC;border:1px solid #E4E0D8;border-radius:8px;padding:12px 24px;">
        <span style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#5C5956;">JHL+ EC展開</span>
      </div>
      <div style="background:#F5F2EC;border:1px solid #E4E0D8;border-radius:8px;padding:12px 24px;">
        <span style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#5C5956;">ラインの礎</span>
      </div>
    </div>
  </div>
</div>
`;

// ─── P19: きんじ粉 ───
window.slideFactories[20] = () => `
<div class="slide slide-flex" id="s19" style="background:#FAF7F2;flex-direction:row;position:relative;">
  <div style="width:680px;flex-shrink:0;position:relative;overflow:hidden;">
    <img src="img/p20_kinako.jpg" style="width:100%;height:100%;object-fit:cover;object-position:center 40%;" alt="">
    <div style="position:absolute;bottom:48px;left:48px;background:rgba(201,168,76,0.9);padding:12px 28px;border-radius:40px;">
      <span style="font-family:'Crimson Pro',serif;font-size:16px;letter-spacing:0.3em;color:#fff;text-transform:uppercase;">New Product 01</span>
    </div>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:80px 120px 80px 80px;position:relative;z-index:2;">
    <div style="margin-bottom:32px;">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="36" cy="52" rx="22" ry="10" stroke="#C9A84C" stroke-width="2" fill="none"/>
        <path d="M14 52 L14 58 Q36 68 58 58 L58 52" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="28" cy="38" r="3" fill="#C9A84C" opacity="0.7"/>
        <circle cx="36" cy="33" r="3" fill="#C9A84C" opacity="0.7"/>
        <circle cx="44" cy="38" r="3" fill="#C9A84C" opacity="0.7"/>
        <circle cx="32" cy="44" r="2.5" fill="#C9A84C" opacity="0.5"/>
        <circle cx="40" cy="44" r="2.5" fill="#C9A84C" opacity="0.5"/>
        <path d="M30 20 Q36 12 42 20 Q36 28 30 20Z" stroke="#C9A84C" stroke-width="1.8" fill="none" stroke-linejoin="round"/>
        <path d="M36 28 L36 32" stroke="#C9A84C" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </div>
    <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;margin-bottom:12px;">Golden Kinako Powder</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:72px;font-weight:500;color:#2C2C2C;letter-spacing:0.06em;line-height:1.2;margin-bottom:8px;">きんじ粉</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;color:#9A7B2E;margin-bottom:36px;letter-spacing:0.1em;">金時草×きな粉　黄金の粉末</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;line-height:2.1;letter-spacing:0.05em;margin-bottom:32px;">
      きなこのような風味に、ほのかな苦みと甘み。<br>砂糖を少量加えることで食べやすく仕上げた<br>日常使いの粉末シリーズ。豆乳・ヨーグルト・<br>トーストなど幅広い食シーンに溶け込む。
    </div>
    <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:32px;">
      <div style="background:#F5F2EC;border:1px solid #E4E0D8;border-radius:8px;padding:10px 20px;">
        <span style="font-family:'Noto Sans JP',sans-serif;font-size:17px;color:#5C5956;">きなこ市場参入</span>
      </div>
      <div style="background:#F5F2EC;border:1px solid #E4E0D8;border-radius:8px;padding:10px 20px;">
        <span style="font-family:'Noto Sans JP',sans-serif;font-size:17px;color:#5C5956;">毎日の食卓に</span>
      </div>
      <div style="background:#F5F2EC;border:1px solid #E4E0D8;border-radius:8px;padding:10px 20px;">
        <span style="font-family:'Noto Sans JP',sans-serif;font-size:17px;color:#5C5956;">和のギフト需要</span>
      </div>
    </div>
    <div style="border-top:1px solid #E4E0D8;padding-top:24px;">
      <div style="font-family:'Crimson Pro',serif;font-size:13px;letter-spacing:0.3em;color:#C9A84C;text-transform:uppercase;margin-bottom:12px;">Global Kinako Demand</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
        <div>
          <div style="font-family:'Noto Sans JP',sans-serif;font-size:13px;font-weight:500;color:#2C2C2C;margin-bottom:4px;">🌎 欧米</div>
          <div style="font-family:'Noto Sans JP',sans-serif;font-size:12px;font-weight:300;color:#5C5956;line-height:1.7;">スーパーフードとして注目。スムージー・ヨーグルトへの混合需要が拡大中。</div>
        </div>
        <div>
          <div style="font-family:'Noto Sans JP',sans-serif;font-size:13px;font-weight:500;color:#2C2C2C;margin-bottom:4px;">🌏 アジア</div>
          <div style="font-family:'Noto Sans JP',sans-serif;font-size:12px;font-weight:300;color:#5C5956;line-height:1.7;">高たんぱく・食物繊維の認知が高く、健康志向層を中心に日系食材として浸透。</div>
        </div>
        <div>
          <div style="font-family:'Noto Sans JP',sans-serif;font-size:13px;font-weight:500;color:#2C2C2C;margin-bottom:4px;">🎁 お土産需要</div>
          <div style="font-family:'Noto Sans JP',sans-serif;font-size:12px;font-weight:300;color:#5C5956;line-height:1.7;">「香ばしい魔法のパウダー」として海外旅行者に人気。和スイーツとの融合も拡大。</div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

// ─── P20: ゴールドプロテイン ───
window.slideFactories[21] = () => `
<div class="slide slide-flex" id="s20" style="background:#FAF7F2;flex-direction:row;position:relative;">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:80px 80px 80px 160px;position:relative;z-index:2;">
    <div style="margin-bottom:32px;">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M36 8 L42 30 L62 30 L46 44 L52 66 L36 52 L20 66 L26 44 L10 30 L30 30 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round" fill="none"/>
        <path d="M36 20 L39 30 L50 30 L41 37 L44 48 L36 42 L28 48 L31 37 L22 30 L33 30 Z" fill="#C9A84C" opacity="0.15"/>
      </svg>
    </div>
    <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;margin-bottom:12px;">Gold Protein Series</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:72px;font-weight:500;color:#2C2C2C;letter-spacing:0.06em;line-height:1.2;margin-bottom:8px;">ゴールド<br>プロテイン</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;color:#9A7B2E;margin-bottom:36px;letter-spacing:0.1em;">金時草×タンパク質　機能美のプロテイン</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;line-height:2.1;letter-spacing:0.05em;margin-bottom:40px;">
      「美しさを鍛える」コンセプトで、金時草の<br>植物性栄養素とタンパク質を組み合わせる。<br>一般的なプロテインとは一線を画す、<br>白金のような静謐さをもったウェルネス製品。
    </div>
    <div style="background:#F5F2EC;border-radius:16px;padding:28px 32px;border:1px solid #E4E0D8;">
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#9A7B2E;margin-bottom:12px;letter-spacing:0.1em;">フレーバー候補</div>
      <div style="display:flex;gap:12px;">
        <div style="flex:1;background:#fff;border-radius:10px;padding:14px 16px;border:1px solid #E4E0D8;text-align:center;">
          <div style="font-family:'Zen Old Mincho',serif;font-size:24px;color:#2C2C2C;margin-bottom:4px;">抹茶</div>
          <div style="font-family:'Noto Sans JP',sans-serif;font-size:14px;color:#5C5956;">和の落ち着き</div>
        </div>
        <div style="flex:1;background:#fff;border-radius:10px;padding:14px 16px;border:1px solid #E4E0D8;text-align:center;">
          <div style="font-family:'Zen Old Mincho',serif;font-size:24px;color:#2C2C2C;margin-bottom:4px;">ほうじ茶</div>
          <div style="font-family:'Noto Sans JP',sans-serif;font-size:14px;color:#5C5956;">香ばしい甘み</div>
        </div>
        <div style="flex:1;background:#fff;border-radius:10px;padding:14px 16px;border:1px solid #E4E0D8;text-align:center;">
          <div style="font-family:'Zen Old Mincho',serif;font-size:24px;color:#2C2C2C;margin-bottom:4px;">きなこ</div>
          <div style="font-family:'Noto Sans JP',sans-serif;font-size:14px;color:#5C5956;">和の香ばしさ</div>
        </div>
        <div style="flex:1;background:#fff;border-radius:10px;padding:14px 16px;border:1px solid #E4E0D8;text-align:center;">
          <div style="font-family:'Zen Old Mincho',serif;font-size:24px;color:#2C2C2C;margin-bottom:4px;">プレーン</div>
          <div style="font-family:'Noto Sans JP',sans-serif;font-size:14px;color:#5C5956;">素材そのまま</div>
        </div>
      </div>
    </div>
  </div>
  <div style="width:640px;flex-shrink:0;position:relative;overflow:hidden;">
    <img src="img/p21_protein.jpg" style="width:100%;height:100%;object-fit:cover;object-position:25% center;" alt="">
    <div style="position:absolute;bottom:48px;right:48px;background:rgba(201,168,76,0.9);padding:12px 28px;border-radius:40px;">
      <span style="font-family:'Crimson Pro',serif;font-size:16px;letter-spacing:0.3em;color:#fff;text-transform:uppercase;">New Product 02</span>
    </div>
  </div>
</div>
`;

// ─── P21: 金抹茶（海外向け）───
window.slideFactories[22] = () => `
<div class="slide slide-flex" id="s21" style="background:#FAF7F2;flex-direction:row;position:relative;">
  <div style="width:640px;flex-shrink:0;position:relative;overflow:hidden;">
    <img src="img/p22_matcha.jpg" style="width:100%;height:100%;object-fit:cover;object-position:55% center;" alt="">
    <div style="position:absolute;bottom:48px;left:48px;background:rgba(201,168,76,0.9);padding:12px 28px;border-radius:40px;">
      <span style="font-family:'Crimson Pro',serif;font-size:16px;letter-spacing:0.3em;color:#fff;text-transform:uppercase;">New Product 03</span>
    </div>
    <div style="position:absolute;top:48px;left:48px;background:rgba(44,44,44,0.8);padding:10px 20px;border-radius:6px;">
      <span style="font-family:'Crimson Pro',serif;font-size:16px;letter-spacing:0.3em;color:#C9A84C;text-transform:uppercase;">Global Edition</span>
    </div>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:80px 120px 80px 80px;position:relative;z-index:2;">
    <div style="margin-bottom:32px;">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="36" cy="48" rx="20" ry="10" stroke="#C9A84C" stroke-width="2" fill="none"/>
        <path d="M16 48 L16 54 Q36 64 56 54 L56 48" stroke="#C9A84C" stroke-width="2" fill="none"/>
        <path d="M24 36 Q36 28 48 36" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M28 28 Q36 18 44 28" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M30 20 Q36 10 42 20" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.5"/>
        <path d="M36 36 L36 48" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;margin-bottom:12px;">Gold Matcha — Global</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:72px;font-weight:500;color:#2C2C2C;letter-spacing:0.06em;line-height:1.2;margin-bottom:8px;">金抹茶</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;color:#9A7B2E;margin-bottom:36px;letter-spacing:0.1em;">金時草×抹茶　海外展開フラッグシップ</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;line-height:2.1;letter-spacing:0.05em;margin-bottom:40px;">
      世界的に需要が高まる「Matcha」と、<br>日本固有の希少野菜「金時草」を掛け合わせた<br>海外展開フラッグシップ製品。<br>JAPAN・TRADITION・WELLNESSを一包に凝縮。
    </div>
    <div style="display:flex;gap:20px;">
      <div style="flex:1;background:#F5F2EC;border-radius:12px;padding:24px;border:1px solid #E4E0D8;text-align:center;">
        <div style="font-family:'Crimson Pro',serif;font-size:32px;color:#C9A84C;margin-bottom:8px;">🇹🇼</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;color:#5C5956;">台湾・香港</div>
      </div>
      <div style="flex:1;background:#F5F2EC;border-radius:12px;padding:24px;border:1px solid #E4E0D8;text-align:center;">
        <div style="font-family:'Crimson Pro',serif;font-size:32px;color:#C9A84C;margin-bottom:8px;">🇺🇸</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;color:#5C5956;">北米</div>
      </div>
      <div style="flex:1;background:#F5F2EC;border-radius:12px;padding:24px;border:1px solid #E4E0D8;text-align:center;">
        <div style="font-family:'Crimson Pro',serif;font-size:32px;color:#C9A84C;margin-bottom:8px;">🇪🇺</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;color:#5C5956;">欧州</div>
      </div>
    </div>
  </div>
</div>
`;

// ─── P22: 金茶 ───
window.slideFactories[23] = () => `
<div class="slide slide-flex" id="s22" style="background:#FAF7F2;flex-direction:row;position:relative;">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:80px 80px 80px 160px;position:relative;z-index:2;">
    <div style="margin-bottom:32px;">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 28 L18 58 Q18 62 22 62 L44 62 Q48 62 48 58 L52 28 Z" stroke="#C9A84C" stroke-width="2" stroke-linejoin="round" fill="none"/>
        <path d="M52 36 Q62 36 62 44 Q62 52 52 52" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M10 28 L56 28" stroke="#C9A84C" stroke-width="2" stroke-linecap="round"/>
        <path d="M27 14 Q27 8 33 8" stroke="#C9A84C" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.6"/>
        <path d="M33 14 Q33 8 39 8" stroke="#C9A84C" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.6"/>
        <path d="M39 14 Q39 8 45 8" stroke="#C9A84C" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.4"/>
      </svg>
    </div>
    <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;margin-bottom:12px;">Gold Tea Series</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:72px;font-weight:500;color:#2C2C2C;letter-spacing:0.06em;line-height:1.2;margin-bottom:8px;">金茶</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;color:#9A7B2E;margin-bottom:36px;letter-spacing:0.1em;">金時草×茶葉ブレンド　日常の一杯に</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;line-height:2.1;letter-spacing:0.05em;margin-bottom:40px;">
      茶葉と金時草粉末をブレンドした粉末茶。<br>お湯を注ぐだけで、4000年の歴史が一杯に宿る。<br>毎日の習慣として、静かに飲み続けられる<br>ウェルネスティーシリーズ。
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;">
      <div style="background:#F5F2EC;border-radius:12px;padding:20px 24px;border:1px solid #E4E0D8;">
        <div style="font-family:'Zen Old Mincho',serif;font-size:28px;color:#2C2C2C;margin-bottom:6px;">緑茶ブレンド</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:17px;color:#5C5956;">スタンダード・定番の一杯</div>
      </div>
      <div style="background:#F5F2EC;border-radius:12px;padding:20px 24px;border:1px solid #E4E0D8;">
        <div style="font-family:'Zen Old Mincho',serif;font-size:28px;color:#2C2C2C;margin-bottom:6px;">ほうじ茶ブレンド</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:17px;color:#5C5956;">香ばしく・夜にも合う</div>
      </div>
      <div style="background:#F5F2EC;border-radius:12px;padding:20px 24px;border:1px solid #E4E0D8;">
        <div style="font-family:'Zen Old Mincho',serif;font-size:28px;color:#2C2C2C;margin-bottom:6px;">玄米茶ブレンド</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:17px;color:#5C5956;">食事との相性・和食に</div>
      </div>
      <div style="background:#F5F2EC;border-radius:12px;padding:20px 24px;border:1px solid #E4E0D8;">
        <div style="font-family:'Zen Old Mincho',serif;font-size:28px;color:#2C2C2C;margin-bottom:6px;">ハーブブレンド</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:17px;color:#5C5956;">海外向け・カフェインレス</div>
      </div>
    </div>
  </div>
  <div style="width:640px;flex-shrink:0;position:relative;overflow:hidden;">
    <img src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=640&h=1080&fit=crop&q=80" style="width:100%;height:100%;object-fit:cover;" alt="">
    <div style="position:absolute;bottom:48px;right:48px;background:rgba(201,168,76,0.9);padding:12px 28px;border-radius:40px;">
      <span style="font-family:'Crimson Pro',serif;font-size:16px;letter-spacing:0.3em;color:#fff;text-transform:uppercase;">New Product 04</span>
    </div>
  </div>
</div>
`;

// ─── P23: 粉末展開ロードマップ ───
window.slideFactories[24] = () => `
<div class="slide slide-flex" id="s23" style="background:#F5F2EC;flex-direction:column;justify-content:center;padding:72px 160px;">
  <div style="margin-bottom:40px;">
    <div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;margin-bottom:8px;">Future Expansion</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:40px;font-weight:500;color:#2C2C2C;letter-spacing:0.05em;">粉末ライン展開ロードマップ</div>
  </div>

  <div style="background:#2C2C2C;border-radius:16px;padding:28px 48px;border:2px solid #C9A84C;margin-bottom:20px;display:flex;align-items:center;gap:80px;">
    <div style="flex-shrink:0;">
      <div style="font-family:'Crimson Pro',serif;font-size:13px;letter-spacing:0.3em;color:#C9A84C;text-transform:uppercase;margin-bottom:6px;">現行 — 販売中</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:44px;color:#FAF7F2;letter-spacing:0.06em;">金の時</div>
    </div>
    <div style="width:1px;height:60px;background:#444;flex-shrink:0;"></div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:18px;color:#B8B3A8;line-height:1.9;flex:1;">金時草 純粉末サプリメント（2g×30包）。全製品ラインの礎となるフラッグシップ。JHL+ ECにて展開中。</div>
    <div style="flex-shrink:0;background:rgba(201,168,76,0.15);border:1px solid #C9A84C;border-radius:8px;padding:10px 28px;">
      <span style="font-family:'Crimson Pro',serif;font-size:15px;letter-spacing:0.25em;color:#C9A84C;text-transform:uppercase;">Flagship</span>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:24px;">
    <div style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid #C9A84C;">
      <div style="font-family:'Crimson Pro',serif;font-size:13px;letter-spacing:0.3em;color:#C9A84C;text-transform:uppercase;margin-bottom:8px;">Phase 1 — 確定</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:32px;color:#2C2C2C;margin-bottom:8px;">きんじ粉</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:15px;color:#5C5956;line-height:1.8;">きなこ市場。甘み+金時草の苦み。和スイーツ需要。</div>
    </div>
    <div style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid #E4E0D8;">
      <div style="font-family:'Crimson Pro',serif;font-size:13px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;margin-bottom:8px;">Phase 1 — 検討</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:32px;color:#2C2C2C;margin-bottom:8px;">ゴールドプロテイン</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:15px;color:#5C5956;line-height:1.8;">美・健康軸。抹茶/ほうじ茶フレーバー。女性ウェルネス。</div>
    </div>
    <div style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid #E4E0D8;">
      <div style="font-family:'Crimson Pro',serif;font-size:13px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;margin-bottom:8px;">Phase 2 — 海外</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:32px;color:#2C2C2C;margin-bottom:8px;">金抹茶</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:15px;color:#5C5956;line-height:1.8;">台湾・北米・欧州。Matcha×金時草。越境EC主力。</div>
    </div>
    <div style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid #E4E0D8;">
      <div style="font-family:'Crimson Pro',serif;font-size:13px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;margin-bottom:8px;">Phase 2 — 国内</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:32px;color:#2C2C2C;margin-bottom:8px;">金茶</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:15px;color:#5C5956;line-height:1.8;">毎日の習慣。緑茶/ほうじ茶/玄米茶ブレンド。定期購入。</div>
    </div>
  </div>

  <div style="background:#fff;border-radius:14px;padding:20px 32px;border:1px solid #E4E0D8;">
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:15px;color:#9A7B2E;margin-bottom:10px;letter-spacing:0.1em;">+ 将来的な粉末展開候補</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <span style="background:#F5F2EC;border-radius:8px;padding:7px 16px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:#5C5956;">コラーゲン配合（美容）</span>
      <span style="background:#F5F2EC;border-radius:8px;padding:7px 16px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:#5C5956;">黒ごまブレンド（香り・栄養）</span>
      <span style="background:#F5F2EC;border-radius:8px;padding:7px 16px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:#5C5956;">生姜ミックス（温め・代謝）</span>
      <span style="background:#F5F2EC;border-radius:8px;padding:7px 16px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:#5C5956;">MCTオイルパウダー（エネルギー）</span>
      <span style="background:#F5F2EC;border-radius:8px;padding:7px 16px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:#5C5956;">ビタミンC配合（免疫・美白）</span>
      <span style="background:#F5F2EC;border-radius:8px;padding:7px 16px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:#5C5956;">ゴールドコーンスープ</span>
      <span style="background:#F5F2EC;border-radius:8px;padding:7px 16px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:#5C5956;">金時塩</span>
      <span style="background:#F5F2EC;border-radius:8px;padding:7px 16px;font-family:'Noto Sans JP',sans-serif;font-size:14px;color:#5C5956;">金時味噌汁</span>
    </div>
  </div>
</div>
`;

// ─── P24: 粉を混ぜるだけ（背景ライトに変更）───
window.slideFactories[25] = () => `
<div class="slide slide-flex" id="s24" style="background:#FAF7F2;flex-direction:column;justify-content:center;padding:80px 180px;position:relative;overflow:hidden;">
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 80% 50%,rgba(201,168,76,0.08) 0%,transparent 60%);pointer-events:none;"></div>
  <div style="position:relative;z-index:2;">
    <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.5em;color:#C9A84C;text-transform:uppercase;margin-bottom:32px;">The Power of Powder</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:80px;font-weight:500;color:#2C2C2C;letter-spacing:0.06em;line-height:1.3;margin-bottom:48px;">混ぜるだけで、<br>新しい製品になる。</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;line-height:2.2;margin-bottom:64px;">
      金の時のすべての製品ラインは「粉末を混ぜる」という<br>シンプルな製法で成立する。設備投資を最小化しながら、<br>一つの素材から多様な市場へアプローチできる。<br>これが金時草粉末ビジネスの本質的な強みです。
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:28px;">
      <div style="border:1px solid rgba(201,168,76,0.4);border-radius:16px;padding:36px 28px;background:#fff;">
        <div style="margin-bottom:20px;">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="#C9A84C" stroke-width="1.5" fill="none"/>
            <path d="M14 24 L22 32 L34 16" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:28px;color:#2C2C2C;margin-bottom:10px;">低コスト展開</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:17px;color:#5C5956;line-height:1.9;">既存の製造ラインを活用。新設備なしに製品ラインを拡張できる。</div>
      </div>
      <div style="border:1px solid rgba(201,168,76,0.4);border-radius:16px;padding:36px 28px;background:#fff;">
        <div style="margin-bottom:20px;">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M8 24 L24 8 L40 24 L24 40 Z" stroke="#C9A84C" stroke-width="1.5" fill="none"/>
            <path d="M16 24 L24 16 L32 24 L24 32 Z" fill="#C9A84C" opacity="0.2"/>
          </svg>
        </div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:28px;color:#2C2C2C;margin-bottom:10px;">素材の一貫性</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:17px;color:#5C5956;line-height:1.9;">全製品に金時草が入ることでブランドの一体感と訴求軸が統一される。</div>
      </div>
      <div style="border:1px solid rgba(201,168,76,0.4);border-radius:16px;padding:36px 28px;background:#fff;">
        <div style="margin-bottom:20px;">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 6 L28 18 L42 18 L31 26 L35 38 L24 30 L13 38 L17 26 L6 18 L20 18 Z" stroke="#C9A84C" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
          </svg>
        </div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:28px;color:#2C2C2C;margin-bottom:10px;">市場の多角化</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:17px;color:#5C5956;line-height:1.9;">サプリ・食品・お茶・海外と異なる市場を同時攻略できる。</div>
      </div>
    </div>
  </div>
</div>
`;

// ─── P25: ブリッジ「海外展開戦略」Section 04 ───
window.slideFactories[26] = () => `
<div class="slide slide-flex" id="s25" style="background:#C9A84C;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 220px;position:relative;">
  <div style="position:absolute;top:0;left:0;width:6px;height:100%;background:#2C2C2C;"></div>
  <div style="font-family:'Crimson Pro',serif;font-size:20px;letter-spacing:0.5em;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-bottom:24px;">Section 04</div>
  <div style="font-family:'Zen Old Mincho',serif;font-size:96px;font-weight:500;color:#FAF7F2;letter-spacing:0.06em;line-height:1.3;">海外展開戦略</div>
  <div style="font-family:'Crimson Pro',serif;font-size:28px;letter-spacing:0.4em;color:rgba(255,255,255,0.8);margin-top:20px;">Global Strategy — Taiwan</div>
</div>
`;

// ─── P26: 台湾インフルエンサーEC戦略 ───
window.slideFactories[27] = () => `
<div class="slide slide-flex" id="s26" style="background:#FAF7F2;flex-direction:row;position:relative;">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:60px 80px 60px 160px;">
    <div style="margin-bottom:40px;">
      <span style="font-family:'Crimson Pro',serif;font-size:22px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;">Taiwan Market</span>
      <span style="font-family:'Noto Sans JP',sans-serif;font-size:18px;font-weight:300;color:#5C5956;letter-spacing:0.15em;margin-left:20px;">台湾市場への展開</span>
    </div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:88px;font-weight:500;color:#2C2C2C;letter-spacing:0.06em;line-height:1.5;margin-bottom:32px;">日本の美しさを、<br>台湾へ届ける。</div>
    <div style="font-family:'Noto Sans JP',sans-serif;font-size:16px;font-weight:300;color:#5C5956;line-height:2.0;margin-bottom:32px;">台湾では日本のブランド・品質への信頼が高く、健康・美容市場も成長中です。インフルエンサーを起用した定期購読ECでブランドの世界観ごと届けます。</div>
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div style="background:#fff;border-radius:12px;padding:24px 32px;border:1px solid #E4E0D8;border-left:4px solid #C9A84C;display:flex;gap:20px;align-items:center;">
        <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;min-width:120px;">Strategy 01</div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:26px;color:#2C2C2C;">インフルエンサー起用</div>
      </div>
      <div style="background:#fff;border-radius:12px;padding:24px 32px;border:1px solid #E4E0D8;border-left:4px solid #C9A84C;display:flex;gap:20px;align-items:center;">
        <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;min-width:120px;">Strategy 02</div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:26px;color:#2C2C2C;">越境EC × 定期購読</div>
      </div>
      <div style="background:#fff;border-radius:12px;padding:24px 32px;border:1px solid #E4E0D8;border-left:4px solid #C9A84C;display:flex;gap:20px;align-items:center;">
        <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.3em;color:#9A7B2E;text-transform:uppercase;min-width:120px;">Strategy 03</div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:26px;color:#2C2C2C;">日本ブランドの信頼を武器に</div>
      </div>
    </div>
  </div>
  <div style="width:580px;flex-shrink:0;position:relative;overflow:hidden;">
    <img src="https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=580&h=1080&fit=crop&q=80" style="width:100%;height:100%;object-fit:cover;" alt="">
  </div>
</div>
`;

// ─── P27: 海外定期購読の購買フロー ───
window.slideFactories[28] = () => `
<div class="slide slide-flex" id="s27" style="background:#F5F2EC;flex-direction:column;justify-content:center;padding:80px 160px;">
  <div style="margin-bottom:52px;">
    <span style="font-family:'Crimson Pro',serif;font-size:22px;letter-spacing:0.35em;color:#9A7B2E;text-transform:uppercase;">Purchase Flow</span>
    <span style="font-family:'Noto Sans JP',sans-serif;font-size:18px;font-weight:300;color:#5C5956;letter-spacing:0.15em;margin-left:24px;">台湾向け購買フロー</span>
  </div>
  <div style="display:flex;gap:28px;align-items:stretch;">
    <div style="flex:1;background:#fff;border-radius:16px;padding:44px 32px;border:1px solid #E4E0D8;display:flex;flex-direction:column;align-items:center;text-align:center;">
      <div style="font-family:'Crimson Pro',serif;font-size:56px;color:#E8D5A3;line-height:1;margin-bottom:16px;">01</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:30px;color:#2C2C2C;margin-bottom:14px;">インフルエンサーが発信</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:19px;font-weight:300;color:#5C5956;line-height:1.8;">SNS・動画で「金の時」の世界観と体験をPR。フォロワーへの信頼をベースに認知拡大</div>
    </div>
    <div style="display:flex;align-items:center;color:#C9A84C;font-size:32px;flex-shrink:0;">→</div>
    <div style="flex:1;background:#fff;border-radius:16px;padding:44px 32px;border:1px solid #E4E0D8;display:flex;flex-direction:column;align-items:center;text-align:center;">
      <div style="font-family:'Crimson Pro',serif;font-size:56px;color:#E8D5A3;line-height:1;margin-bottom:16px;">02</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:30px;color:#2C2C2C;margin-bottom:14px;">越境ECサイトへ誘導</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:19px;font-weight:300;color:#5C5956;line-height:1.8;">専用URLから越境ECへ。台湾語対応のランディングページで購入を促進</div>
    </div>
    <div style="display:flex;align-items:center;color:#C9A84C;font-size:32px;flex-shrink:0;">→</div>
    <div style="flex:1;background:#C9A84C;border-radius:16px;padding:44px 32px;display:flex;flex-direction:column;align-items:center;text-align:center;">
      <div style="font-family:'Crimson Pro',serif;font-size:56px;color:rgba(255,255,255,0.4);line-height:1;margin-bottom:16px;">03</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:30px;color:#fff;margin-bottom:14px;">定期購読に申込</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:19px;font-weight:300;color:rgba(255,255,255,0.85);line-height:1.8;">毎月自動で届く定期購読プランへ。継続することが輝きへの準備になる</div>
    </div>
    <div style="display:flex;align-items:center;color:#C9A84C;font-size:32px;flex-shrink:0;">→</div>
    <div style="flex:1;background:#2C2C2C;border-radius:16px;padding:44px 32px;display:flex;flex-direction:column;align-items:center;text-align:center;">
      <div style="font-family:'Crimson Pro',serif;font-size:56px;color:rgba(201,168,76,0.4);line-height:1;margin-bottom:16px;">04</div>
      <div style="font-family:'Zen Old Mincho',serif;font-size:30px;color:#FAF7F2;margin-bottom:14px;">継続・ファン化</div>
      <div style="font-family:'Noto Sans JP',sans-serif;font-size:19px;font-weight:300;color:#B8B3A8;line-height:1.8;">インフルエンサーとの継続的な関係でブランドへの愛着を醸成。口コミで拡散</div>
    </div>
  </div>
</div>
`;

// ─── P28: 議題 ───
window.slideFactories[29] = () => `
<div class="slide slide-flex" id="s28" style="background:#FAF7F2;flex-direction:column;justify-content:center;padding:80px 160px;position:relative;">
  <div style="position:absolute;top:0;left:0;width:6px;height:100%;background:#C9A84C;"></div>
  <div style="margin-bottom:64px;">
    <div style="font-family:'Crimson Pro',serif;font-size:18px;letter-spacing:0.5em;color:#B8B3A8;text-transform:uppercase;margin-bottom:16px;">Agenda</div>
    <div style="font-family:'Zen Old Mincho',serif;font-size:64px;font-weight:500;color:#2C2C2C;letter-spacing:0.06em;">今日話し合いたいこと。</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:28px;">
    <div style="display:flex;align-items:flex-start;gap:48px;padding:36px 48px;background:#fff;border-radius:16px;border:1px solid #E4E0D8;">
      <div style="font-family:'Crimson Pro',serif;font-size:56px;color:#E8D5A3;line-height:1;flex-shrink:0;margin-top:-4px;">01</div>
      <div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:32px;font-weight:500;color:#2C2C2C;margin-bottom:10px;">既存ブランドとの関係性</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;font-weight:300;color:#5C5956;line-height:1.9;">現状の金時草ブランド（JHL+）と金の時は、同化させるか・差別化するか。<br>ブランドとしての立ち位置を決める。</div>
      </div>
    </div>
    <div style="display:flex;align-items:flex-start;gap:48px;padding:36px 48px;background:#fff;border-radius:16px;border:1px solid #E4E0D8;">
      <div style="font-family:'Crimson Pro',serif;font-size:56px;color:#E8D5A3;line-height:1;flex-shrink:0;margin-top:-4px;">02</div>
      <div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:32px;font-weight:500;color:#2C2C2C;margin-bottom:10px;">ECの設計方針</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;font-weight:300;color:#5C5956;line-height:1.9;">同化ならJHL+ECへどう関わるか・関わらないか。<br>差別化なら金の時独自ECを構築するかどうか。</div>
      </div>
    </div>
    <div style="display:flex;align-items:flex-start;gap:48px;padding:36px 48px;background:#fff;border-radius:16px;border:1px solid #E4E0D8;">
      <div style="font-family:'Crimson Pro',serif;font-size:56px;color:#E8D5A3;line-height:1;flex-shrink:0;margin-top:-4px;">03</div>
      <div>
        <div style="font-family:'Zen Old Mincho',serif;font-size:32px;font-weight:500;color:#2C2C2C;margin-bottom:10px;">クレーターの関わり方</div>
        <div style="font-family:'Noto Sans JP',sans-serif;font-size:20px;font-weight:300;color:#5C5956;line-height:1.9;">制作会社としての単発関与か、ブランドパートナーとしての継続関与か、<br>代理販売など販売系か、それとも複合型かなど。<br>双方にとって最良の形を話し合えればと。</div>
      </div>
    </div>
  </div>
</div>
`;
