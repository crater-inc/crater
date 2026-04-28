// ============================================
// CRATER 会社概要スライド — app.js v8
// ============================================

(function () {

  var stage       = document.getElementById('slide-stage');
  var statusBar   = document.getElementById('status-bar');
  var menuBtn     = document.getElementById('menu-btn');
  var overlay     = document.getElementById('sidebar-overlay');
  var sideClose   = document.getElementById('sidebar-close');
  var sideList    = document.getElementById('sidebar-list');
  var progress    = document.getElementById('progress-bar');
  var navPrev     = document.getElementById('nav-prev');
  var navNext     = document.getElementById('nav-next');
  var scriptTrig  = document.getElementById('script-trigger');
  var scriptPanel = document.getElementById('script-panel');
  var pagination  = document.getElementById('pagination');

  var current = 0;
  var total   = slideFactories.length;
  var rendered = {};

  // ===== 1920×1080 固定スケーリング =====
  var currentScale = 1;
  function scaleSlides() {
    currentScale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    document.querySelectorAll('.slide').forEach(function (s) {
      s.style.transform = 'translate(-50%, -50%) scale(' + currentScale + ')';
    });
  }
  window.addEventListener('resize', scaleSlides);

  // ===== スライドレンダリング（遅延） =====
  function ensureRendered(i) {
    if (rendered[i] || i < 0 || i >= total) return;
    var frag = document.createRange().createContextualFragment(slideFactories[i]());
    stage.appendChild(frag);
    rendered[i] = true;
    // 追加後に全スライドへスケールを再適用（インデックスズレを防ぐ）
    scaleSlides();
  }

  // ===== スライド移動 =====
  function goTo(i, skipHash) {
    if (i < 0 || i >= total) return;
    [i - 1, i, i + 1].forEach(function (j) { ensureRendered(j); });

    var slides = stage.querySelectorAll('.slide');
    slides.forEach(function (s) { s.classList.remove('active'); });
    if (slides[i]) slides[i].classList.add('active');

    current = i;

    if (!skipHash) history.replaceState(null, '', '#' + (i + 1));

    // ステータスバー
    statusBar.textContent = agendaItems[i].label + '  ' + (i + 1) + ' / ' + total;

    // プログレス
    progress.style.width = ((i + 1) / total * 100) + '%';

    // サイドバーのハイライト
    document.querySelectorAll('.sidebar-item').forEach(function (el, idx) {
      el.classList.toggle('active', idx === i);
    });

    // ページネーションのハイライト
    document.querySelectorAll('.pagination-item').forEach(function (el, idx) {
      el.classList.toggle('active', idx === i);
    });

    // トークスクリプト
    var slide = slides[i];
    var notes = slide ? slide.getAttribute('data-notes') : '';
    scriptPanel.textContent = notes || '';
    scriptPanel.classList.remove('visible');
  }

  // ===== 初期化（URLハッシュ復元） =====
  var initPage = 0;
  var hash = window.location.hash.replace('#', '');
  if (hash && !isNaN(hash)) {
    var p = parseInt(hash, 10) - 1;
    if (p >= 0 && p < total) initPage = p;
  }
  scaleSlides(); // スケール値を確定してから
  [0, 1, 2].forEach(function (i) { ensureRendered(i); });
  goTo(initPage, true);

  // ===== キーボード =====
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ')        { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft'  || e.key === 'Backspace') { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'Home')  { e.preventDefault(); goTo(0); }
    if (e.key === 'End')   { e.preventDefault(); goTo(total - 1); }
    if (e.key === 'Escape') { closeSidebar(); }
  });

  // ===== 左右クリック =====
  navPrev.addEventListener('click', function () { goTo(current - 1); });
  navNext.addEventListener('click', function () { goTo(current + 1); });

  // ===== サイドバー =====
  function openSidebar()  { overlay.classList.add('open'); }
  function closeSidebar() { overlay.classList.remove('open'); }

  menuBtn.addEventListener('click', function () {
    overlay.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  sideClose.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', function (e) {
    if (!e.target.closest('.sidebar')) closeSidebar();
  });

  agendaItems.forEach(function (item, i) {
    // サイドバー
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
    sideList.appendChild(btn);

    // ページネーション
    var pBtn = document.createElement('button');
    pBtn.className = 'pagination-item';
    pBtn.innerHTML =
      '<span class="pagination-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span>' + item.label + '</span>';
    pBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(i);
    });
    pagination.appendChild(pBtn);
  });

  // ===== トークスクリプト（下ホバー） =====
  var scriptTimeout = null;

  scriptTrig.addEventListener('mouseenter', function () {
    if (scriptPanel.textContent.trim()) {
      clearTimeout(scriptTimeout);
      scriptPanel.classList.add('visible');
    }
  });
  scriptTrig.addEventListener('mouseleave', function () {
    scriptTimeout = setTimeout(function () { scriptPanel.classList.remove('visible'); }, 300);
  });
  scriptPanel.addEventListener('mouseenter', function () { clearTimeout(scriptTimeout); });
  scriptPanel.addEventListener('mouseleave', function () {
    scriptTimeout = setTimeout(function () { scriptPanel.classList.remove('visible'); }, 300);
  });

})();
