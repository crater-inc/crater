/* ==========================================================================
   HEEKES ブランドサイト 共通スクリプト
   ・スクロールで要素を出現させる
   ・スマホのハンバーガーメニュー開閉
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. スクロール出現アニメーション
     画面に入った要素に .is-in を付ける。一度出たら戻さない。
     ------------------------------------------------------------------ */
  var targets = document.querySelectorAll(
    "[data-anim], .curtain, .kv-curtain, .zoom, .footer"
  );

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // 少し手前で発火させる（下から15%入ったら動き始める）
        rootMargin: "0px 0px -15% 0px",
        threshold: 0
      }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // 古いブラウザ向け：アニメーションなしで最初から表示する
    targets.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* ------------------------------------------------------------------
     2. ファーストビューの要素は読み込み直後に動かす
     画面内にあるものはIntersectionObserverの初回判定に任せるが、
     ヘッダーだけは確実に出したいのでここで付ける。
     ------------------------------------------------------------------ */
  window.addEventListener("load", function () {
    var header = document.querySelector(".header[data-anim]");
    if (header) {
      header.classList.add("is-in");
    }
  });

  /* ------------------------------------------------------------------
     3. スマホのハンバーガーメニュー
     ------------------------------------------------------------------ */
  var burger = document.querySelector(".header__burger");
  var menu = document.querySelector(".menu");
  var closeBtn = document.querySelector(".menu__close");

  function openMenu() {
    menu.classList.add("is-open");
    document.body.style.overflow = "hidden";
    burger.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    document.body.style.overflow = "";
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger && menu) {
    burger.addEventListener("click", openMenu);

    if (closeBtn) {
      closeBtn.addEventListener("click", closeMenu);
    }

    // メニュー内のリンクを押したら閉じる
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Escキーでも閉じる
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }
})();
