// ---- localStorage管理 ----
function getProgress() {
  return JSON.parse(localStorage.getItem('kr-progress') || '{}');
}
function saveProgress(data) {
  localStorage.setItem('kr-progress', JSON.stringify(data));
}
function getHistory() {
  return JSON.parse(localStorage.getItem('kr-history') || '[]');
}
function saveHistory(data) {
  localStorage.setItem('kr-history', JSON.stringify(data));
}

// ---- タブ切り替え ----
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
    if (tab === 'words') renderWords(currentCategory);
    if (tab === 'phrases') renderPhrases();
    if (tab === 'history') renderHistory();
  });
});

// ---- 単語タブ ----
let currentCategory = 'すべて';

function renderWords(category) {
  const progress = getProgress();
  const container = document.getElementById('words-list');

  // カテゴリ一覧
  const categories = ['すべて', ...new Set(words.map(w => w.category))];
  const filterBar = `<div class="filter-bar">${
    categories.map(c => `<button class="filter-btn${c === category ? ' active' : ''}" data-cat="${c}">${c}</button>`).join('')
  }</div>`;

  // フィルター済み単語
  const filtered = category === 'すべて' ? words : words.filter(w => w.category === category);

  const cards = filtered.map(w => {
    const p = progress[w.id] || {};
    const learned = p.learned ? 'learned' : '';
    const learnedLabel = p.learned ? '✓ 覚えた' : '覚えた';
    return `
      <div class="card">
        <div class="card-hangul">${w.hangul}</div>
        <div class="card-reading">${w.reading}</div>
        <div class="card-japanese">${w.japanese}</div>
        <button class="btn-learned ${learned}" data-id="${w.id}">${learnedLabel}</button>
      </div>`;
  }).join('');

  container.innerHTML = filterBar + cards;

  // フィルターボタン
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.cat;
      renderWords(currentCategory);
    });
  });

  // 覚えたボタン
  container.querySelectorAll('.btn-learned').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const progress = getProgress();
      if (!progress[id]) progress[id] = { correct:0, wrong:0, lastStudied:'' };
      progress[id].learned = !progress[id].learned;
      saveProgress(progress);
      renderWords(currentCategory);
    });
  });
}

// ---- フレーズタブ ----
function renderPhrases() {
  const progress = getProgress();
  const container = document.getElementById('phrases-list');

  const cards = phrases.map(p => {
    const prog = progress[p.id] || {};
    const learned = prog.learned ? 'learned' : '';
    const learnedLabel = prog.learned ? '✓ 覚えた' : '覚えた';
    const badge = p.kchoice ? '<span class="badge-kchoice">K CHOICE!</span>' : '';
    return `
      <div class="card">
        <div class="card-hangul">${p.hangul}${badge}</div>
        <div class="card-reading">${p.reading}</div>
        <div class="card-japanese">${p.japanese}</div>
        <button class="btn-learned ${learned}" data-id="${p.id}">${learnedLabel}</button>
      </div>`;
  }).join('');

  container.innerHTML = cards;

  container.querySelectorAll('.btn-learned').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const progress = getProgress();
      if (!progress[id]) progress[id] = { correct:0, wrong:0, lastStudied:'' };
      progress[id].learned = !progress[id].learned;
      saveProgress(progress);
      renderPhrases();
    });
  });
}

// ---- 履歴タブ（placeholder - Task 9で実装） ----
function renderHistory() {}

// 初期表示
renderWords('すべて');
