// 各ステージのJSON成果物を1つのHTMLブロックにまとめ、ダッシュボードに追記する
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

function main() {
  const [
    ,
    ,
    makuakeCandidatesPath, // scrape-makuake.mjsの出力
    selectionPath, // select-candidates.md の出力(JSON)
    alibabaResultsPath, // scrape-alibaba.mjsの出力
    reportTextPath, // write-report.md の出力(JSON)
    dashboardPath, // 追記先のダッシュボードHTML
    logPath, // 提案ログ.md
    dateStr, // YYYY-MM-DD (JST)
  ] = process.argv;

  const makuakeData = loadJson(makuakeCandidatesPath);
  const selection = loadJson(selectionPath);
  const alibabaData = loadJson(alibabaResultsPath);
  const reportText = loadJson(reportTextPath);

  const makuakeByUrl = new Map(makuakeData.candidates.map((c) => [c.url, c]));
  const reportByTitle = new Map(reportText.selections.map((s) => [s.title, s]));

  const cards = selection.selections
    .map((sel) => {
      const mk = makuakeByUrl.get(sel.url);
      const text = reportByTitle.get(sel.title);
      if (!mk || !text) return null;

      // Alibaba照合は日次の発掘段階では表示しない（本命が決まってから個別に確認する運用のため）。
      // データ自体はdata/alibaba-*.jsonに残しておき、後で参照できるようにする。

      return `<div class="product-row">
        <img class="thumb" src="${esc(mk.thumbnailUrl)}" alt="${esc(mk.title)}" loading="lazy">
        <div class="product-body">
          <h3><a href="${esc(mk.url)}" target="_blank" rel="noopener">${esc(mk.title)}</a></h3>
          <p class="stat-line">支援額 <strong>${yen(mk.collectedMoney)}</strong>（達成率${mk.achievementPercent ?? '?'}%）／ 単価帯 ${yen(mk.priceMin)}〜${yen(mk.priceMax)}</p>
          <p>${esc(text.psychologicalNeed)}</p>
          <p class="block-label">競合状況</p>
          <p>${esc(text.competitiveNote)}</p>
        </div>
      </div>`;
    })
    .filter(Boolean);

  const dayHtml = `<section class="day">
  <h2>${esc(dateStr)}</h2>
  <p class="daily-note">${esc(reportText.dailyNote)}</p>
  <div class="products">
    ${cards.join('\n')}
  </div>
</section>
`;

  const dashboard = fs.readFileSync(dashboardPath, 'utf-8');
  const marker = '<!-- NEW_ENTRY_MARKER -->';
  if (!dashboard.includes(marker)) throw new Error('ダッシュボードにマーカーが見つかりません');
  const updated = dashboard.replace(marker, `${marker}\n${dayHtml}`);
  fs.writeFileSync(dashboardPath, updated);

  const logLines = selection.selections.map((s) => `- ${s.title} (${s.url})`).join('\n');
  fs.appendFileSync(logPath, `\n## ${dateStr}\n${logLines}\n`);

  console.log(`${cards.length}件のカードをダッシュボードに追記しました`);
}

main();
