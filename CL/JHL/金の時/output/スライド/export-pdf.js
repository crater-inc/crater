const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  const filePath = path.resolve(__dirname, 'index.html');
  await page.goto('file://' + filePath, { waitUntil: 'networkidle0', timeout: 30000 });

  // スライド枚数を取得
  const total = await page.evaluate(() => window.slideFactories.length);
  console.log(`スライド枚数: ${total}`);

  const pages = [];

  for (let i = 0; i < total; i++) {
    // スライドを切り替え
    await page.evaluate((idx) => {
      window.currentSlide = idx;
      const stage = document.getElementById('stage');
      stage.innerHTML = '';
      const el = document.createElement('div');
      el.innerHTML = window.slideFactories[idx]();
      const slide = el.firstElementChild;
      slide.style.display = 'flex';
      stage.appendChild(slide);
      const counter = document.getElementById('slide-counter');
      if (counter) counter.textContent = `${idx + 1} / ${window.slideFactories.length}`;
    }, i);

    await new Promise(r => setTimeout(r, 200));

    const screenshot = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    pages.push(screenshot);
    console.log(`P${i + 1} キャプチャ完了`);
  }

  await browser.close();

  // 画像をPDFに変換（pdfkitが不要なシンプルな方法）
  // 別ページで印刷用HTMLを生成してPDF化
  const browser2 = await puppeteer.launch({ headless: 'new' });
  const page2 = await browser2.newPage();

  const base64Pages = pages.map(p => p.toString('base64'));
  const html = `<!DOCTYPE html><html><head><style>
    @page { size: 1920px 1080px; margin: 0; }
    body { margin: 0; padding: 0; }
    .pg { width: 1920px; height: 1080px; page-break-after: always; page-break-inside: avoid; }
    .pg img { width: 1920px; height: 1080px; display: block; }
  </style></head><body>
    ${base64Pages.map(b64 => `<div class="pg"><img src="data:image/png;base64,${b64}"></div>`).join('\n')}
  </body></html>`;

  await page2.setContent(html, { waitUntil: 'load' });
  await page2.pdf({
    path: path.resolve(__dirname, '金の時_スライド.pdf'),
    width: '1920px',
    height: '1080px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser2.close();
  console.log('PDF書き出し完了：金の時_スライド.pdf');
})();
