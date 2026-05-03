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

// ---- テストタブ ----
let currentTestMode = 'ja-to-ko';
let testItems = [];
let testIndex = 0;
let testCorrect = 0;

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTestMode = btn.dataset.mode;
    startTest();
  });
});

function startTest() {
  const all = [...words, ...phrases];
  testItems = shuffle(all).slice(0, 10);
  testIndex = 0;
  testCorrect = 0;
  renderTestQuestion();
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function renderTestQuestion() {
  const area = document.getElementById('test-area');
  if (testIndex >= testItems.length) {
    showTestResult();
    return;
  }
  if (currentTestMode === 'handwrite') {
    renderHandwrite();
    return;
  }

  const item = testItems[testIndex];
  const isJaToKo = currentTestMode === 'ja-to-ko';
  const question = isJaToKo ? item.japanese : item.hangul;
  const answerKey = isJaToKo ? 'hangul' : 'japanese';

  // 選択肢（正解1＋ランダム3）
  const all = [...words, ...phrases];
  const wrongs = shuffle(all.filter(i => i.id !== item.id)).slice(0, 3);
  const choices = shuffle([item, ...wrongs]);

  const badge = item.kchoice ? '<span class="badge-kchoice">K CHOICE!</span>' : '';

  area.innerHTML = `
    <div class="test-question">
      ${question}${badge}
      <div class="sub">${testIndex + 1} / ${testItems.length}</div>
    </div>
    <div class="choices">
      ${choices.map(c => `<button class="choice-btn" data-id="${c.id}" data-correct="${c.id === item.id}">${c[answerKey]}</button>`).join('')}
    </div>`;

  area.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.dataset.correct === 'true';
      area.querySelectorAll('.choice-btn').forEach(b => {
        b.disabled = true;
        if (b.dataset.correct === 'true') b.classList.add('correct');
        else if (b === btn && !isCorrect) b.classList.add('wrong');
      });
      recordResult(item.id, isCorrect);
      if (isCorrect) testCorrect++;
      setTimeout(() => {
        testIndex++;
        renderTestQuestion();
      }, 1000);
    });
  });
}

function recordResult(id, isCorrect) {
  const progress = getProgress();
  if (!progress[id]) progress[id] = { correct:0, wrong:0, lastStudied:'' };
  if (isCorrect) progress[id].correct++;
  else progress[id].wrong++;
  progress[id].lastStudied = new Date().toLocaleDateString('ja-JP');
  saveProgress(progress);
}

function showTestResult() {
  const area = document.getElementById('test-area');
  const modeLabel = { 'ja-to-ko':'日→韓', 'ko-to-ja':'韓→日', 'handwrite':'手書き' }[currentTestMode];
  area.innerHTML = `
    <div class="test-result">
      <div class="result-score">${testCorrect} / ${testItems.length}</div>
      <div class="result-label">${modeLabel} テスト結果</div>
      <button class="btn-primary" id="retry-btn">もう一度</button>
    </div>`;

  // 履歴に保存
  const history = getHistory();
  history.unshift({
    date: new Date().toLocaleDateString('ja-JP'),
    mode: modeLabel,
    score: testCorrect,
    total: testItems.length
  });
  saveHistory(history.slice(0, 50));

  document.getElementById('retry-btn').addEventListener('click', startTest);
}

// ---- 手書きモード ----
function renderHandwrite() {
  const area = document.getElementById('test-area');
  const item = testItems[testIndex];
  const badge = item.kchoice ? '<span class="badge-kchoice">K CHOICE!</span>' : '';

  area.innerHTML = `
    <div class="test-question">
      ${item.japanese}${badge}
      <div class="sub">${testIndex + 1} / ${testItems.length} — ハングルで書いてみよう</div>
    </div>
    <div id="canvas-wrap">
      <canvas id="handwrite-canvas" width="300" height="200"></canvas>
      <div class="canvas-btns">
        <button class="btn-secondary" id="clear-canvas">消す</button>
        <button class="btn-primary" id="show-answer">答えを見る</button>
      </div>
    </div>
    <div id="answer-area"></div>`;

  // キャンバス描画
  const canvas = document.getElementById('handwrite-canvas');
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  let drawing = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  canvas.addEventListener('mousedown',  e => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); });
  canvas.addEventListener('mousemove',  e => { if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
  canvas.addEventListener('mouseup',    () => drawing = false);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); }, { passive:false });
  canvas.addEventListener('touchmove',  e => { e.preventDefault(); if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }, { passive:false });
  canvas.addEventListener('touchend',   () => drawing = false);

  document.getElementById('clear-canvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  document.getElementById('show-answer').addEventListener('click', () => {
    const answerArea = document.getElementById('answer-area');
    answerArea.innerHTML = `
      <div style="text-align:center; padding:16px; background:#fff; border-radius:12px; margin-top:12px;">
        <div style="font-size:36px; font-weight:700;">${item.hangul}</div>
        <div style="font-size:14px; color:#888; margin-top:4px;">${item.reading}</div>
        <div class="self-grade">
          <button class="grade-btn ok" data-correct="true">○</button>
          <button class="grade-btn ng" data-correct="false">✕</button>
        </div>
      </div>`;

    answerArea.querySelectorAll('.grade-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.correct === 'true';
        recordResult(item.id, isCorrect);
        if (isCorrect) testCorrect++;
        testIndex++;
        renderTestQuestion();
      });
    });
  });
}

// ---- 履歴タブ ----
function renderHistory() {
  const history = getHistory();
  const progress = getProgress();
  const area = document.getElementById('history-area');

  // 全体統計
  const allIds = [...words, ...phrases].map(i => i.id);
  let totalCorrect = 0, totalWrong = 0;
  allIds.forEach(id => {
    const p = progress[id] || {};
    totalCorrect += p.correct || 0;
    totalWrong += p.wrong || 0;
  });
  const total = totalCorrect + totalWrong;
  const rate = total > 0 ? Math.round(totalCorrect / total * 100) : 0;
  const learnedCount = allIds.filter(id => (progress[id] || {}).learned).length;

  const summary = `
    <div class="history-card">
      <div style="font-size:13px; color:#999; margin-bottom:8px;">累計成績</div>
      <div style="font-size:28px; font-weight:700; color:#111;">${rate}%</div>
      <div style="font-size:13px; color:#777; margin-bottom:8px;">${totalCorrect}問正解 / ${total}問</div>
      <div class="progress-bar-wrap"><div class="progress-bar" style="width:${rate}%"></div></div>
      <div style="font-size:13px; color:#777; margin-top:10px;">覚えた単語・フレーズ：${learnedCount}件</div>
    </div>`;

  const logs = history.length === 0
    ? '<p style="padding:16px; color:#999;">まだテスト履歴がありません</p>'
    : history.map(h => `
      <div class="history-card">
        <div class="history-date">${h.date}</div>
        <div class="history-score">${h.score} / ${h.total}</div>
        <div class="history-mode">${h.mode}</div>
        <div class="progress-bar-wrap" style="margin-top:8px;">
          <div class="progress-bar" style="width:${Math.round(h.score/h.total*100)}%"></div>
        </div>
      </div>`).join('');

  area.innerHTML = summary + '<div style="height:8px;"></div>' + logs;
}

// 初期表示
renderWords('すべて');

// テストタブ初期起動
startTest();
