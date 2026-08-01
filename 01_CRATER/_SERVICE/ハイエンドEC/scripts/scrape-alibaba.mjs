// 指定キーワードでAlibabaを検索し、中級OEM候補（既存金型・ロゴ+1点カスタム向け）をスクレイピングする
// Alibabaは短時間の連続アクセスでCAPTCHAブロックされることがあるため、キーワード間に間隔を空け、
// ブロックを検知したらエラーにせず「取得失敗（要手動確認）」として記録する。
import { chromium } from 'playwright';
import fs from 'node:fs';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeKeyword(page, keyword) {
  const url = `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(keyword)}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);

  const title = await page.title();
  if (/captcha/i.test(title)) {
    return { blocked: true, items: [] };
  }

  const items = await page.evaluate((kw) => {
    const seen = new Set();
    const out = [];
    const headingLinks = Array.from(document.querySelectorAll('h2 a[href*="/product-detail/"]'));

    for (const link of headingLinks) {
      const href = link.getAttribute('href');
      if (!href || seen.has(href)) continue;
      seen.add(href);

      const title = (link.textContent || '').trim();
      if (!title) continue;

      // 商品カード全体のテキストから価格・MOQ・サプライヤー情報を拾う
      const card = link.closest('div[class]')?.parentElement?.parentElement;
      const cardText = card ? card.innerText : '';
      const img = card ? card.querySelector('img[src*="alicdn"]') : null;

      const priceMatch = cardText.match(/[\d,]+(?:\.\d+)?(?:[\s-]*[\d,]+(?:\.\d+)?)?円/);
      const moqMatch = cardText.match(/最低発注数[：:]\s*([\d,]+)\s*([^\s]+)/);
      const ratingMatch = cardText.match(/(\d\.\d)\/5\.0\s*\((\d+)\)/);
      const yearsMatch = cardText.match(/(\d+)年\s*CN/);

      out.push({
        keyword: kw,
        title,
        url: href.startsWith('http') ? href : `https:${href}`,
        thumbnailUrl: img ? img.getAttribute('src') : null,
        priceRaw: priceMatch ? priceMatch[0] : null,
        moq: moqMatch ? `${moqMatch[1]} ${moqMatch[2]}` : null,
        supplierRating: ratingMatch ? `${ratingMatch[1]}/5.0 (${ratingMatch[2]})` : null,
        supplierYears: yearsMatch ? `${yearsMatch[1]}年` : null,
      });
    }
    return out;
  }, keyword);

  return { blocked: false, items };
}

async function main() {
  const [, , inPath, outPath] = process.argv;
  if (!inPath || !outPath) {
    console.error('使い方: node scrape-alibaba.mjs <keywords.json> <output.json>');
    process.exit(1);
  }

  // keywords.json = { "keywords": ["...", "..."] }
  const { keywords } = JSON.parse(fs.readFileSync(inPath, 'utf-8'));

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const page = await browser.newPage({ locale: 'ja-JP' });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const results = {};
  for (const [i, kw] of keywords.entries()) {
    try {
      const { blocked, items } = await scrapeKeyword(page, kw);
      if (blocked) {
        console.error(`「${kw}」: Bot対策でブロックされました（要手動確認）`);
        results[kw] = { blocked: true, items: [] };
      } else {
        console.log(`「${kw}」: ${items.length}件ヒット`);
        results[kw] = { blocked: false, items: items.slice(0, 8) };
      }
    } catch (e) {
      console.error(`検索失敗: ${kw} (${e.message})`);
      results[kw] = { blocked: false, items: [], error: e.message };
    }
    // 連続アクセスによるBotブロックを避けるため、キーワード間に間隔を空ける
    if (i < keywords.length - 1) await sleep(4000 + Math.random() * 3000);
  }

  await browser.close();
  fs.writeFileSync(outPath, JSON.stringify({ scrapedAt: new Date().toISOString(), results }, null, 2));
  console.log(`Alibaba検索結果を ${outPath} に保存しました`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
