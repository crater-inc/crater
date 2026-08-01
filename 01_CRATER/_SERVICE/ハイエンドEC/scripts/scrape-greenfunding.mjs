// GREENFUNDINGのトップページから注目プロジェクトを収集し、単価・支援額でフィルタする
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const MIN_FUNDING_YEN = 2_000_000;
const MIN_UNIT_PRICE_YEN = 10_000;

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

async function collectCandidates(page) {
  await page.goto('https://greenfunding.jp/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  return page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href*="/projects/"]'));
    const seen = new Set();
    const out = [];
    for (const a of anchors) {
      let href = a.getAttribute('href');
      if (!href) continue;
      if (href.includes('/activities/')) continue; // 更新記事は対象外、プロジェクト本体のみ
      href = href.startsWith('http') ? href : `https://greenfunding.jp${href}`;
      if (seen.has(href)) continue;

      const text = (a.innerText || '').trim();
      if (!text) continue;
      seen.add(href);

      const fundingMatch = text.match(/¥\s*([\d,]+)/);
      if (!fundingMatch) continue;
      const collectedMoney = parseInt(fundingMatch[1].replace(/,/g, ''), 10);

      const rateMatch = text.match(/(\d{1,6})\s*%/);
      const achievementPercent = rateMatch ? parseInt(rateMatch[1], 10) : null;

      // タイトルの前後についたNEW/SUCCESS等のバッジ文言を取り除く
      const withoutLeadingBadge = text.replace(/^(?:NEW|SUCCESS\s*!?)\n/i, '');
      const titleRaw = withoutLeadingBadge.split(/\n(?:SUCCESS\s*!?|NEW)\b|\bsuccess\b/i)[0];
      const title = titleRaw.split('\n')[0].trim();

      const img = a.querySelector('img');
      const thumbnailUrl = img ? img.getAttribute('src') : null;

      out.push({ url: href, title, collectedMoney, achievementPercent, thumbnailUrl });
    }
    return out;
  });
}

async function extractPriceRange(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(600);
  const prices = await page.evaluate(() => {
    // 個別プランの価格は「◯◯円」形式（目標額・支援総額は「¥」表記なのでここでは対象外）
    const text = document.body.textContent;
    return [...text.matchAll(/(\d{1,3}(?:,\d{3})*)\s*円/g)].map((m) => parseInt(m[1].replace(/,/g, ''), 10));
  });
  const plausible = prices.filter((p) => p >= 3000 && p <= 500000);
  return {
    priceMin: plausible.length ? Math.min(...plausible) : null,
    priceMax: plausible.length ? Math.max(...plausible) : null,
    priceMedian: plausible.length ? median(plausible) : null,
  };
}

async function main() {
  const outPath = process.argv[2] || 'greenfunding-candidates.json';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ locale: 'ja-JP' });

  const all = await collectCandidates(page);
  const byUrl = new Map();
  for (const item of all) if (!byUrl.has(item.url)) byUrl.set(item.url, item);

  const candidates = Array.from(byUrl.values()).filter((c) => c.collectedMoney >= MIN_FUNDING_YEN && c.title);
  console.log(`ホームページから資金調達額2,000,000円以上の候補：${candidates.length}件。単価を確認します...`);

  const highEnd = [];
  for (const c of candidates) {
    try {
      const { priceMin, priceMax, priceMedian } = await extractPriceRange(page, c.url);
      if (priceMin && priceMin >= MIN_UNIT_PRICE_YEN) {
        highEnd.push({ ...c, priceMin, priceMax, priceMedian });
      }
    } catch (e) {
      console.error(`価格取得失敗: ${c.url} (${e.message})`);
    }
  }

  await browser.close();

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify({ scrapedAt: new Date().toISOString(), candidates: highEnd }, null, 2)
  );
  console.log(`単価1万円以上の候補 ${highEnd.length}件を ${outPath} に保存しました`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
