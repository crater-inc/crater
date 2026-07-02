/* APOLLOS テーマ JS：ヒーロー文字フィット／ヘッダー／モバイルメニュー／パララックス／フェードアップ */
(function () {
  // ヒーロー・フッターの大文字を横幅ぴったりに（比率保持）
  function fitWord(id) {
    var wrap = document.getElementById(id); if (!wrap) return;
    var span = wrap.firstElementChild; if (!span) return;
    var base = 100;
    span.style.fontSize = base + 'px';
    var natural = span.getBoundingClientRect().width;
    if (natural > 0) { span.style.fontSize = (base * ((wrap.clientWidth + 6) / natural)) + 'px'; }
  }
  function fitAll() {
    fitWord('heroWord'); fitWord('footWord');
    // KVコピーの出現をトリガー
    var h = document.querySelector('.hero');
    if (h) h.classList.add('reveal-go');
  }
  if (document.fonts && document.fonts.load) {
    Promise.all([
      document.fonts.load('500 100px "Roboto Condensed"')
    ]).then(fitAll).catch(fitAll);
    document.fonts.ready.then(fitAll);
  }
  window.addEventListener('load', fitAll);
  window.addEventListener('resize', fitAll);
  setTimeout(fitAll, 300);

  // ヘッダー背景＋モバイルメニュー
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('open', open);
      toggle.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  // パララックス（PC・SP両方で有効。reduced-motionのみ無効）
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function onScroll() {
    if (header) { if (window.scrollY > 40) header.classList.add('scrolled'); else header.classList.remove('scrolled'); }
    if (!reduce) {
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        var center = r.top + r.height / 2;
        var offset = (center - vh / 2) * parseFloat(el.getAttribute('data-parallax'));
        el.style.transform = 'translateY(' + (-offset) + 'px)';
      });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  // 一行ごとパラパラ出現：同じ親の中の.reveal兄弟を順番にずらす
  document.querySelectorAll('.reveal').forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
    var idx = sibs.indexOf(el);
    if (idx > 0) el.style.transitionDelay = (idx * 0.12) + 's';
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.16 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }
})();
