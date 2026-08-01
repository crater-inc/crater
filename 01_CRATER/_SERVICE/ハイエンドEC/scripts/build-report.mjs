// 複数ソース（Makuake・GREENFUNDING等）のJSON成果物を1つのHTMLブロックにまとめ、ダッシュボードに追記する
// 使い方: node build-report.mjs <dashboardPath> <logPath> <dateStr> <sourceName> <candidatesPath> <selectionPath> <reportTextPath> [<sourceName> <candidatesPath> <selectionPath> <reportTextPath> ...]
import fs from 'node:fs';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function yen(n) {
  return typeof n === 'number' ? `¥${n.toLocaleString('ja-JP')}` : '不明';
}

// Claudeの出力にMarkdownのコードフェンス(```json ... ```)が付くことがあるので剥がしてから読む
function loadJson(path) {
  const raw = fs.readFileSync(path, 'utf-8').trim();
  const stripped = raw.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  return JSON.parse(stripped);
}

function buildCardsForBatch(sourceName, candidatesPath, selectionPath, reportTextPath) {
  const candidatesData = loadJson(candidatesPath);
  const selection = loadJson(selectionPath);
  const reportText = loadJson(reportTextPath);

  const byUrl = new Map(candidatesData.candidates.map((c) => [c.url, c]));
  const reportByTitle = new Map(reportText.selections.map((s) => [s.title, s]));

  const cards = selection.selections
    .map((sel) => {
      const item = byUrl.get(sel.url);
      const text = reportByTitle.get(sel.title);
      if (!item || !text) return null;

      const keywordChips = (sel.alibabaKeywords || [])
        .map((kw) => `<span class="keyword-chip">${esc(kw)}</span>`)
        .join('');

      return `<div class="product-row">
        <img class="thumb" src="${esc(item.thumbnailUrl)}" alt="${esc(item.title)}" loading="lazy">
        <div class="product-body">
          <p class="source-tag">${esc(sourceName)}</p>
          <h3><a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.title)}</a></h3>
          <p class="stat-line">支援額 <strong>${yen(item.collectedMoney)}</strong>（達成率${item.achievementPercent ?? '?'}%）／ 単価帯 ${yen(item.priceMin)}〜${yen(item.priceMax)}</p>
          <p>${esc(text.psychologicalNeed)}</p>
          <p class="block-label">競合状況</p>
          <p>${esc(text.competitiveNote)}</p>
          ${keywordChips ? `<p class="block-label">Alibaba検索キーワード案</p><div class="keyword-list">${keywordChips}</div>` : ''}
        </div>
      </div>`;
    })
    .filter(Boolean);

  return { cards, dailyNote: reportText.dailyNote, logLines: selection.selections.map((s) => `- [${sourceName}] ${s.title} (${s.url})`) };
}

function main() {
  const [, , dashboardPath, logPath, dateStr, ...rest] = process.argv;
  if (rest.length % 4 !== 0 || rest.length === 0) {
    throw new Error('ソースごとに sourceName candidatesPath selectionPath reportTextPath の4引数セットで渡してください');
  }

  const allCards = [];
  const allNotes = [];
  const allLogLines = [];

  for (let i = 0; i < rest.length; i += 4) {
    const [sourceName, candidatesPath, selectionPath, reportTextPath] = rest.slice(i, i + 4);
    const { cards, dailyNote, logLines } = buildCardsForBatch(sourceName, candidatesPath, selectionPath, reportTextPath);
    allCards.push(...cards);
    if (dailyNote) allNotes.push(`【${sourceName}】${dailyNote}`);
    allLogLines.push(...logLines);
  }

  const dayHtml = `<section class="day">
  <h2>${esc(dateStr)}</h2>
  ${allNotes.map((n) => `<p class="daily-note">${esc(n)}</p>`).join('\n  ')}
  <div class="products">
    ${allCards.join('\n')}
  </div>
</section>
`;

  const dashboard = fs.readFileSync(dashboardPath, 'utf-8');
  const marker = '<!-- NEW_ENTRY_MARKER -->';
  if (!dashboard.includes(marker)) throw new Error('ダッシュボードにマーカーが見つかりません');
  const updated = dashboard.replace(marker, `${marker}\n${dayHtml}`);
  fs.writeFileSync(dashboardPath, updated);

  fs.appendFileSync(logPath, `\n## ${dateStr}\n${allLogLines.join('\n')}\n`);

  console.log(`${allCards.length}件のカードをダッシュボードに追記しました`);
}

main();
