// Makuakeの公開ランキングAPIを直接叩いて候補を抽出する（ブラウザ不要）
import fs from 'node:fs';
import path from 'node:path';

const RANKING_URL =
  'https://api.makuake.com/v2/rankings?limit=50&before_expire=false&return_not_sold_out=false&with_returns=true&with_user=false';

const MIN_FUNDING_YEN = 2_000_000;
const MIN_UNIT_PRICE_YEN = 10_000;

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

async function main() {
  const outPath = process.argv[2] || 'makuake-candidates.json';

  const res = await fetch(RANKING_URL, {
    headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
  });
  if (!res.ok) throw new Error(`Makuake API failed: ${res.status}`);
  const data = await res.json();

  const candidates = [];
  for (const entry of data.rankings || []) {
    const p = entry.project;
    if (!p || p.collected_money < MIN_FUNDING_YEN) continue;

    const prices = (p.returns || [])
      .map((r) => r.price)
      .filter((price) => typeof price === 'number' && price >= 3000 && price <= 500000);

    if (!prices.length) continue;
    const priceMedian = median(prices);
    if (priceMedian < MIN_UNIT_PRICE_YEN) continue;

    candidates.push({
      rank: entry.rank,
      title: p.title,
      url: p.url,
      thumbnailUrl: p.thumbnail_url,
      collectedMoney: p.collected_money,
      collectedSupporter: p.collected_supporter,
      achievementPercent: p.percent,
      priceMin: Math.min(...prices),
      priceMax: Math.max(...prices),
      priceMedian,
    });
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify({ scrapedAt: new Date().toISOString(), candidates }, null, 2)
  );
  console.log(`単価1万円以上・支援額200万円以上の候補 ${candidates.length}件を ${outPath} に保存しました`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
