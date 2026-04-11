// ============================================
// CRATER 会社概要スライド — app.js
// slides.js が先に読み込まれている前提（window.slideFactories / agendaItems）
// ============================================

(function () {

  var stage      = document.getElementById('slide-stage');
  var counter    = document.getElementById('nav-counter');
  var btnPrev    = document.getElementById('btn-prev');
  var btnNext    = document.getElementById('btn-next');
  var progress   = document.getElementById('progress-bar');
  var sidebar    = document.getElementById('sidebar');
  var backdrop   = document.getElementById('backdrop');
  var hamburger  = document.getElementById('hamburger-btn');
  var agendaCont = document.getElementById('sidebar-agenda');

  var current  = 0;
  var total    = slideFactories.length;
  var rendered = {};

  // ===== スライドのレンダリング（遅延） =====
  function ensureRendered(i) {
    if (rendered[i] || i < 0 || i >= total) return;
    var frag = document.createRange().createContextualFragment(slideFactories[i]());
    stage.appendChild(frag);
    rendered[i] = true;
  }

  // ===== スライド移動 =====
  function goTo(i) {
    if (i < 0 || i >= total) return;

    // 当該スライドと前後1枚を先読み
    [i - 1, i, i + 1].forEach(function (j) { ensureRendered(j); });

    // active 切替
    var slides = stage.querySelectorAll('.slide');
    slides.forEach(function (s) { s.classList.remove('active'); });
    if (slides[i]) slides[i].classList.add('active');

    current = i;

    // ナビ更新
    counter.textContent  = (i + 1) + ' / ' + total;
    btnPrev.disabled     = i === 0;
    btnNext.disabled     = i === total - 1;
    progress.style.width = ((i + 1) / total * 100) + '%';

    // サイドバーのアクティブ状態
    document.querySelectorAll('.sidebar-item').forEach(function (el, idx) {
      el.classList.toggle('active', idx === i);
    });
  }

  // ===== 初期化 =====
  [0, 1, 2].forEach(function (i) { ensureRendered(i); });
  goTo(0);

  // ===== ボタン =====
  btnPrev.addEventListener('click', function () { goTo(current - 1); });
  btnNext.addEventListener('click', function () { goTo(current + 1); });

  // ===== キーボード =====
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft')                   { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'Escape')                       { closeSidebar(); }
  });

  // ===== サイドバー =====
  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('open');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  }

  hamburger.addEventListener('click', function () {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  backdrop.addEventListener('click', closeSidebar);

  // ===== サイドバーのアジェンダ項目を動的生成 =====
  agendaItems.forEach(function (item, i) {
    var btn = document.createElement('button');
    btn.className = 'sidebar-item';
    btn.innerHTML =
      '<span class="sidebar-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span>' + item.label + '</span>';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(i);
      closeSidebar();
    });
    agendaCont.appendChild(btn);
  });

})();
