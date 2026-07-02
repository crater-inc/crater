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
  function fitAll() { fitWord('heroWord'); fitWord('heroJp'); fitWord('footWord'); }
  if (document.fonts && document.fonts.load) {
    Promise.all([
      document.fonts.load('500 100px "Roboto Condensed"'),
      document.fonts.load('800 80px "Zen Kaku Gothic New"')
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
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); toggle.classList.toggle('open'); });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); toggle.classList.remove('open'); });
    });
  }

  // パララックス
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width:768px)').matches;
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function onScroll() {
    if (header) { if (window.scrollY > 40) header.classList.add('scrolled'); else header.classList.remove('scrolled'); }
    if (!reduce && !isMobile) {
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
  window.addEventListener('resize', function () { isMobile = window.matchMedia('(max-width:768px)').matches; });
  onScroll();

  // フェードアップ
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.16 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }
})();
