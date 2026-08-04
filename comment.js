// ============================================================
// CRATER 修正コメントツール（汎用・クラウド版）  v1.4.0 (2026-08-04)
// 要件定義・変更履歴：01_CRATER/_TOOL/修正コメントツール/
// ★このファイルが唯一の最新の正。改善したら冒頭バージョンを上げ、変更履歴.md/SKILLも更新。
// 使い方：テストアップHTMLの </body> 直前に  <script src="/comment.js"></script>  を1行入れるだけ。
//   - Firestore(view-crater)にリアルタイム保存 → URLを渡すだけでクロコ／他端末と即共有（コピペ不要）
//   - 1ページ＝1ドキュメント。PC/SPのコメントは同じ所に貯まり、ヘッダーで件数を分けて表示
//   - ピンは「今見ているビュー(PC/SP)」の分だけ表示。リストは両方まとめて表示
//   - ステータスで絞り込み：全部 / 未対応 / 修正済のみ。戻すで差し戻し
//   - 「修正済」にした瞬間、ピン位置の今の文言を自動スナップショットしBefore/Afterで比較できる
//   - 追加モード中は既存ピンをドラッグして位置を動かせる（誤配置の微調整）
//   - ?client=1 でクライアント公開モード
//   - firebase SDK もこのファイルが動的に読み込む＝HTML側は<script>1行だけでOK
// ============================================================
(function () {
  "use strict";
  var CLIENT = /[?&]client=1/.test(location.search);

  function need(src, cb) { var s = document.createElement("script"); s.src = src; s.onload = cb; s.onerror = cb; document.head.appendChild(s); }
  function boot() {
    try {
      firebase.initializeApp({
        apiKey: "AIzaSyArq3B1YkeiBv-PgpBkMrRGWsOkuXx4fxo",
        authDomain: "view-crater.firebaseapp.com",
        projectId: "view-crater",
        storageBucket: "view-crater.firebasestorage.app",
        messagingSenderId: "523845906687",
        appId: "1:523845906687:web:b5b6612eabe1af9544dcca"
      });
    } catch (e) {}
    init(firebase.firestore());
  }
  if (window.firebase && window.firebase.firestore) boot();
  else need("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js", function () {
    need("https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js", boot);
  });

  function init(db) {
    var comments = [], mode = false, statusFilter = "ALL", filter = "ALL";
    var input = null, view = null, activeId = null, curPid = "", unsub = null, curRoot = "";

    function $(id) { return document.getElementById(id); }
    function elm(t, a, x) { var n = document.createElement(t); if (a) for (var k in a) n.setAttribute(k, a[k]); if (x != null) n.textContent = x; return n; }
    function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

    // 表示中の拡大コンテナ（zoom基準）を掴む＝この中に%でピンを置くと正確
    function getRoot() {
      var ids = ["pageRoot", "pdpRoot", "spRoot", "storyRoot", "wf-overlay"];
      for (var i = 0; i < ids.length; i++) { var n = $(ids[i]); if (n && n.offsetParent !== null && n.getBoundingClientRect().width > 0) return n; }
      var z = document.querySelectorAll('[style*="zoom"]');
      for (var j = 0; j < z.length; j++) { if (z[j].offsetParent !== null && z[j].getBoundingClientRect().width > 0) return z[j]; }
      return document.body;
    }
    // ルートのidからビュー名（PC/SP）を判定。SP用コンテナ(spRoot等)は "sp" を含む前提
    function viewOf(id) { return /sp/i.test(id || "") ? "SP" : "PC"; }
    // 1ページ＝1ドキュメント（PC/SPを同じ所に貯める）。doc IDにできる文字だけ
    function pageId() { return ("v" + location.pathname).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180); }
    function col() { return db.collection("comments").doc(curPid).collection("items"); }

    // ---- CSS ----
    var css = document.createElement("style");
    css.textContent = [
      "#cr-open{position:fixed;right:20px;bottom:20px;width:44px;height:44px;border:none;border-radius:50%;background:#111;color:#fff;cursor:pointer;z-index:2147483000;display:flex;align-items:center;justify-content:center;transition:right .25s,background .2s;}",
      "#cr-open:hover{background:#333;}",
      "#cr-open svg{width:19px;height:19px;display:block;}",
      "#cr-open.shift{right:316px;}",
      "#cr-panel{position:fixed;top:0;right:0;width:300px;height:100vh;background:#1a1a1a;border-left:1px solid #333;display:flex;flex-direction:column;z-index:2147483001;font-family:'Zen Kaku Gothic New',sans-serif;transform:translateX(300px);transition:transform .3s ease;}",
      "#cr-panel.open{transform:none;}",
      "#cr-ph{padding:14px 16px;border-bottom:1px solid #2a2a2a;display:flex;align-items:center;justify-content:space-between;background:#111;}",
      "#cr-ph .t{font-size:12px;color:#aaa;letter-spacing:.1em;}",
      "#cr-ph .r{display:flex;align-items:center;gap:8px;}",
      "#cr-count{font-size:11px;color:#ccc;background:#333;padding:2px 8px;border-radius:8px;white-space:nowrap;}",
      "#cr-x{background:none;border:none;color:#666;font-size:18px;cursor:pointer;}",
      "#cr-act{padding:10px 14px;border-bottom:1px solid #2a2a2a;display:flex;gap:8px;flex-wrap:wrap;}",
      "#cr-add{flex:1;background:#2563eb;border:none;color:#fff;padding:8px;font-size:11px;cursor:pointer;letter-spacing:.08em;border-radius:999px;font-family:inherit;}",
      "#cr-add.on{background:#ef4444;}",
      "#cr-hide{background:none;border:1px solid #374151;color:#99aabb;padding:8px 10px;font-size:10px;cursor:pointer;border-radius:999px;font-family:inherit;white-space:nowrap;}",
      "#cr-hide.on{background:#2a3346;color:#dfe7f2;border-color:#3b4a63;}",
      "#cr-status{display:flex;gap:6px;padding:2px 14px 8px;}",
      "#cr-status button{flex:1;background:none;border:1px solid #374151;color:#8896a8;padding:6px;font-size:10px;letter-spacing:.08em;cursor:pointer;border-radius:999px;font-family:inherit;}",
      "#cr-status button.on{background:#2a3346;color:#dfe7f2;border-color:#3b4a63;}",
      "#cr-filter{display:flex;gap:6px;padding:0 14px 10px;}",
      "#cr-filter button{flex:1;background:none;border:1px solid #374151;color:#8896a8;padding:6px;font-size:10px;letter-spacing:.08em;cursor:pointer;border-radius:999px;font-family:inherit;}",
      "#cr-filter button.on{background:#2a3346;color:#dfe7f2;border-color:#3b4a63;}",
      "#cr-list{flex:1;overflow-y:auto;padding:10px 14px;}",
      "#cr-empty{font-size:12px;color:#555;text-align:center;padding:40px 0;}",
      ".cr-item{background:#242424;padding:10px 12px;margin-bottom:8px;border:1px solid #2a2a2a;border-radius:6px;cursor:pointer;}",
      ".cr-item.res{opacity:.5;}",
      ".cr-ih{display:flex;align-items:center;gap:8px;margin-bottom:5px;}",
      ".cr-n{width:20px;height:20px;background:#2563eb;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0;}",
      ".cr-n.res{background:#6b7280;}",
      ".cr-bdg{font-size:9px;color:#9fb4d6;border:1px solid #33465e;border-radius:4px;padding:1px 6px;letter-spacing:.06em;flex-shrink:0;}",
      ".cr-nm{font-size:11px;color:#888;}",
      ".cr-sec{font-size:10px;color:#5b6b8c;margin-bottom:2px;}",
      ".cr-tx{font-size:12px;color:#e0e0e0;line-height:1.6;}",
      ".cr-hint{font-size:10px;color:#6b7280;margin:2px 0 6px;}",
      ".cr-after{font-size:10px;color:#4ade80;margin:0 0 6px;}",
      ".cr-ba{display:flex;gap:6px;margin-top:8px;}",
      ".cr-ba button{background:none;border:1px solid #374151;color:#aaa;padding:3px 8px;font-size:10px;cursor:pointer;border-radius:4px;font-family:inherit;}",
      ".cr-ein{width:100%;background:#111827;border:1px solid #374151;border-radius:6px;color:#e5e7eb;font-size:13px;padding:8px;box-sizing:border-box;font-family:inherit;line-height:1.5;outline:none;resize:vertical;margin-top:6px;}",
      ".cr-pin{position:absolute;z-index:2147482000;width:28px;height:28px;border-radius:50% 50% 50% 2px;transform:translate(-50%,-100%);background:rgba(37,99,235,.72);box-shadow:0 3px 10px rgba(0,0,0,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;transition:opacity .15s;touch-action:none;}",
      ".cr-pin:hover{opacity:1;background:#2563eb;}",
      ".cr-pin.res{background:rgba(107,114,128,.72);}",
      ".cr-pin.res:hover{background:#6b7280;}",
      "body.cr-mode .cr-pin{cursor:move;}",
      ".cr-pin.dragging{opacity:1;cursor:grabbing;box-shadow:0 4px 16px rgba(0,0,0,.5);}",
      "body.cr-pins-hidden .cr-pin{display:none;}",
      ".cr-input,.cr-view{position:fixed;background:#1f2937;border:1px solid #374151;border-radius:10px;padding:14px;box-shadow:0 10px 30px rgba(0,0,0,.55);width:280px;z-index:2147483002;font-family:'Zen Kaku Gothic New',sans-serif;box-sizing:border-box;}",
      ".cr-input textarea,.cr-view textarea{width:100%;background:#111827;border:1px solid #374151;border-radius:6px;color:#e5e7eb;font-size:13px;padding:9px;box-sizing:border-box;font-family:inherit;line-height:1.5;outline:none;resize:vertical;}",
      ".cr-input input{width:100%;background:#111827;border:1px solid #374151;border-radius:6px;color:#e5e7eb;font-size:13px;padding:7px 9px;box-sizing:border-box;margin-top:6px;font-family:inherit;outline:none;}",
      ".cr-row{display:flex;gap:8px;margin-top:8px;justify-content:flex-end;}",
      ".cr-row button{border:none;border-radius:6px;padding:7px 14px;font-size:12px;cursor:pointer;font-family:inherit;}",
      ".cr-send{background:#2563eb;color:#fff;}",
      ".cr-cancel{background:#374151;color:#9ca3af;}",
      ".cr-vh{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;gap:8px;}",
      ".cr-vnum{font-size:12px;color:#93b0e0;font-weight:700;}",
      ".cr-va{display:flex;gap:4px;}",
      ".cr-va button{background:none;border:1px solid #374151;color:#aaa;padding:3px 7px;font-size:10px;cursor:pointer;border-radius:4px;font-family:inherit;}",
      ".cr-vtx{font-size:13px;color:#e5e7eb;line-height:1.6;}",
      ".cr-badge{display:inline-block;margin-top:6px;font-size:10px;color:#4ade80;}",
      ".cr-meta{font-size:10px;color:#6b7280;margin-top:6px;}",
      "body.cr-mode{cursor:crosshair;}",
      "@media(max-width:768px){#cr-panel{width:100%;height:auto;max-height:62vh;top:auto;bottom:0;transform:translateY(110%);border-left:none;border-top:1px solid #333;}#cr-panel.open{transform:none;}#cr-list{max-height:calc(62vh - 148px);transition:max-height .3s ease,opacity .25s,padding .3s;}#cr-panel.adding #cr-list{max-height:0;opacity:0;padding-top:0;padding-bottom:0;overflow:hidden;}body.cr-open-on #cr-open{display:none;}}"
    ].join("");
    document.head.appendChild(css);

    // ---- UI ----
    var openBtn = elm("button", { id: "cr-open", title: "修正コメント" });
    openBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4.5H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3v3l3.8-3H20a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1z"/></svg>';
    var panel = elm("div", { id: "cr-panel" });
    panel.innerHTML =
      '<div id="cr-ph"><span class="t">修正コメント</span><div class="r"><span id="cr-count">0</span><button id="cr-x">×</button></div></div>' +
      '<div id="cr-act"><button id="cr-add">💬 コメント追加</button><button id="cr-hide">ピンを隠す</button></div>' +
      '<div id="cr-status"><button data-s="ALL" class="on">全部</button><button data-s="OPEN">未対応</button><button data-s="DONE">修正済</button></div>' +
      '<div id="cr-filter"><button data-f="ALL" class="on">ALL</button><button data-f="PC">PC</button><button data-f="SP">SP</button></div>' +
      '<div id="cr-list"><div id="cr-empty">コメントなし</div></div>';
    document.body.appendChild(openBtn);
    document.body.appendChild(panel);

    // パネル開閉：開くとページ側zoomが window.rvPanelOpen を見てコンテンツを縮小→パネルと重ならず全部見える（PCのみ・SPはボトムシート）
    function toggle() { var o = panel.classList.toggle("open"); openBtn.classList.toggle("shift"); document.body.classList.toggle("cr-open-on", o); window.rvPanelOpen = o; window.dispatchEvent(new Event("resize")); }
    openBtn.addEventListener("click", toggle);
    $("cr-x").addEventListener("click", toggle);

    $("cr-add").addEventListener("click", function () {
      mode = !mode; document.body.classList.toggle("cr-mode", mode);
      this.classList.toggle("on", mode);
      this.textContent = mode ? "✕ 追加をやめる" : "💬 コメント追加";
      panel.classList.toggle("adding", mode); // SP：追加中はリストを畳んで下のデザインを触れるようにする
      if (!mode) closeInput();
    });
    // ステータス絞り込み：全部 / 未対応 / 修正済のみ
    function matchStatus(c) { return statusFilter === "OPEN" ? !c.resolved : statusFilter === "DONE" ? !!c.resolved : true; }
    Array.prototype.slice.call(panel.querySelectorAll("#cr-status button")).forEach(function (b) {
      b.addEventListener("click", function () {
        statusFilter = b.getAttribute("data-s");
        Array.prototype.slice.call(panel.querySelectorAll("#cr-status button")).forEach(function (x) { x.classList.toggle("on", x === b); });
        renderPins();
      });
    });
    // ピンが指してる場所の下のデザインを直接見たい時に、ピンだけ一時的に消す（半透明化はCSS側で常時対応済み）
    var pinsHidden = false;
    $("cr-hide").addEventListener("click", function () {
      pinsHidden = !pinsHidden;
      document.body.classList.toggle("cr-pins-hidden", pinsHidden);
      this.classList.toggle("on", pinsHidden);
      this.textContent = pinsHidden ? "ピンを表示" : "ピンを隠す";
    });
    // PC/SP絞り込み（ALL＝両方）。PCビューで見てもSPのコメントが混ざる→クリックで飛べない問題の対策
    Array.prototype.slice.call(panel.querySelectorAll("#cr-filter button")).forEach(function (b) {
      b.addEventListener("click", function () {
        filter = b.getAttribute("data-f");
        Array.prototype.slice.call(panel.querySelectorAll("#cr-filter button")).forEach(function (x) { x.classList.toggle("on", x === b); });
        renderPanel();
      });
    });

    // クリックした要素の文脈（どのセクション・近傍テキスト）を拾う
    // selText があれば「ドラッグ選択／長押しで選んだ文字そのもの」を優先＝段落全体でなくピンポイントで対象を記録できる
    // section は直近の名前1個だけでなく祖先の名前を最大4階層パンくずで拾う。
    // "nt"や"btn"のように同じ名前が複数箇所（価格カードごと等）にあるレイアウトでも
    // 「card1-text ▸ nt」のように一意に特定できるようにするため（単独名だとクロコが後で場所を探せない）。
    function contextOf(t, selText) {
      var chain = [], el = t, hops = 0;
      while (el && el !== document.body && hops < 4) {
        var nm = el.getAttribute && el.getAttribute("data-pencil-name");
        if (nm) { chain.unshift(nm); hops++; }
        el = el.parentElement;
      }
      var exact = !!selText;
      var hint = exact ? selText : (t.innerText || t.textContent || "").replace(/\s+/g, " ").trim();
      if (!hint && t.tagName === "IMG") hint = "[画像]";
      return { section: chain.length ? chain.join(" ▸ ") : "(不明)", hint: hint.slice(0, 40), exact: exact };
    }
    // 現在の選択範囲（ドラッグ選択・モバイル長押し＋ハンドル）を文字列で取得。選択が無ければ空文字
    function selectedText() {
      var s = window.getSelection ? window.getSelection() : null;
      if (!s || s.isCollapsed || s.rangeCount === 0) return "";
      return s.toString().replace(/\s+/g, " ").trim();
    }

    // クリックでピン
    document.addEventListener("click", function (e) {
      if (!mode) return;
      if (e.target.closest("#cr-panel,#cr-open,.cr-pin,.cr-input,.cr-view")) return;
      e.preventDefault(); e.stopPropagation();
      var selText = selectedText(); // 段落クリックより先に読む（popup操作でクリアされる前に確定）
      closeInput(); closeView();
      var ctx = contextOf(e.target, selText);
      var r = getRoot(), rr = r.getBoundingClientRect();
      var xp = (((e.clientX - rr.left) / rr.width) * 100).toFixed(2);
      var yp = (((e.clientY - rr.top) / rr.height) * 100).toFixed(2);
      input = elm("div", { class: "cr-input" });
      input.style.left = Math.min(e.clientX + 12, window.innerWidth - 296) + "px";
      input.style.top = Math.min(e.clientY + 12, window.innerHeight - 190) + "px";
      input.innerHTML = '<div class="cr-meta">📍 ' + esc(ctx.section) + (ctx.hint ? " ／ " + (ctx.exact ? "選択：" : "") + "「" + esc(ctx.hint) + "」" : "") + '</div>' +
        '<textarea rows="3" placeholder="修正内容を入力…"></textarea>' +
        '<input type="text" placeholder="名前（任意）">' +
        '<div class="cr-row"><button class="cr-cancel">キャンセル</button><button class="cr-send">送信</button></div>';
      document.body.appendChild(input);
      var ta = input.querySelector("textarea"); ta.focus();
      input.querySelector(".cr-cancel").addEventListener("click", closeInput);
      input.querySelector(".cr-send").addEventListener("click", function () {
        var text = ta.value.trim(); if (!text) return;
        var name = input.querySelector("input").value.trim() || "匿名";
        col().add({ x: parseFloat(xp), y: parseFloat(yp), text: text, name: name, section: ctx.section, hint: ctx.hint, hintExact: ctx.exact, root: r.id || "body", view: viewOf(r.id), resolved: false, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
        closeInput();
      });
      var ime = false;
      ta.addEventListener("compositionstart", function () { ime = true; });
      ta.addEventListener("compositionend", function () { ime = false; });
      ta.addEventListener("keydown", function (ev) { if (ev.key === "Enter" && !ev.shiftKey && !ime) { ev.preventDefault(); input.querySelector(".cr-send").click(); } });
    }, true);

    // 「修正済」にする瞬間、ピン座標に今ある文言を自動スナップショット＝Before(hint)/Afterの比較に使う
    // elementFromPointはビューポート外だとnullを返すため、対象位置へ一瞬スクロールして取得し元へ戻す
    function captureAfter(c) {
      var r = $(c.root);
      if (!r) return "";
      var origX = window.pageXOffset, origY = window.pageYOffset;
      var rr = r.getBoundingClientRect();
      var targetY = origY + rr.top + rr.height * c.y / 100 - window.innerHeight / 2;
      window.scrollTo(0, Math.max(0, targetY));
      rr = r.getBoundingClientRect();
      var px = rr.left + rr.width * c.x / 100;
      var py = rr.top + rr.height * c.y / 100;
      var el = document.elementFromPoint(px, py);
      window.scrollTo(origX, origY);
      if (!el) return "";
      return (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
    }
    function toggleResolved(c) {
      var next = !c.resolved, patch = { resolved: next };
      if (next) { var a = captureAfter(c); if (a) patch.afterHint = a; }
      col().doc(c.id).update(patch);
    }

    // ビューごと（PC/SP）に 1..n の連番を振る（修正済も含めて番号は固定）
    function assignNums() {
      var cnt = {};
      comments.forEach(function (c) { var v = viewOf(c.root); cnt[v] = (cnt[v] || 0) + 1; c._num = cnt[v]; c._view = v; });
    }

    function renderPins() {
      curRoot = getRoot().id;
      var r = getRoot();
      Array.prototype.slice.call(document.querySelectorAll(".cr-pin")).forEach(function (p) { p.remove(); });
      // ピンは「今見ているビュー」の分だけ
      var visPins = comments.filter(function (c) { return c.root === curRoot && matchStatus(c); });
      visPins.forEach(function (c) {
        var pin = elm("div", { class: "cr-pin" + (c.resolved ? " res" : "") }, String(c._num));
        pin.style.left = c.x + "%"; pin.style.top = c.y + "%"; pin.dataset.id = c.id;
        pin.addEventListener("click", function (e) {
          e.stopPropagation();
          if (pin._dragged) { pin._dragged = false; return; } // ドラッグ直後に発火するclickは無視（開かない）
          if (activeId === c.id) { closeView(); return; }
          closeView(); showView(c, pin, c._num);
        });
        pin.addEventListener("pointerdown", function (e) { dragPin(e, pin, c); });
        r.appendChild(pin);
      });
      renderPanel();
      updateCount();
    }

    // 追加モード中だけピンをドラッグで動かせる（誤配置の微調整用）。閾値未満の動きはただのクリック扱い＝ view が開く
    // move/upはdocument側で拾う（要素外に出ても追従。setPointerCaptureに依存しない）
    function dragPin(e, pin, c) {
      if (!mode) return;
      e.stopPropagation(); e.preventDefault();
      var root = getRoot(), rr = root.getBoundingClientRect(), moved = false;
      function onMove(ev) {
        if (!moved && Math.abs(ev.clientX - e.clientX) + Math.abs(ev.clientY - e.clientY) > 4) { moved = true; pin.classList.add("dragging"); }
        if (!moved) return;
        var xp = Math.min(100, Math.max(0, ((ev.clientX - rr.left) / rr.width) * 100));
        var yp = Math.min(100, Math.max(0, ((ev.clientY - rr.top) / rr.height) * 100));
        pin.style.left = xp + "%"; pin.style.top = yp + "%";
        pin._nx = xp; pin._ny = yp;
      }
      function onUp() {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        document.removeEventListener("pointercancel", onUp);
        pin.classList.remove("dragging");
        if (moved && pin._nx != null) {
          col().doc(c.id).update({ x: parseFloat(pin._nx.toFixed(2)), y: parseFloat(pin._ny.toFixed(2)) });
          pin._dragged = true;
        }
      }
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
      document.addEventListener("pointercancel", onUp);
    }

    // ヘッダー件数：PC ○・SP ○（数字は未対応の残数）
    function updateCount() {
      var order = ["PC", "SP"], g = {};
      comments.forEach(function (c) { var v = c._view || viewOf(c.root); if (!g[v]) g[v] = { open: 0, total: 0 }; g[v].total++; if (!c.resolved) g[v].open++; });
      var parts = [];
      order.forEach(function (v) { if (g[v] && g[v].total) parts.push(v + " " + g[v].open); });
      Object.keys(g).forEach(function (v) { if (order.indexOf(v) < 0 && g[v].total) parts.push(v + " " + g[v].open); });
      $("cr-count").textContent = parts.length ? parts.join("・") : "0";
    }

    function showView(c, pin, num) {
      activeId = c.id; var pr = pin.getBoundingClientRect();
      view = elm("div", { class: "cr-view" });
      view.style.left = Math.min(pr.right + 8, window.innerWidth - 296) + "px";
      view.style.top = Math.max(pr.top - 10, 60) + "px";
      var date = c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleDateString("ja-JP") : "";
      view.innerHTML = '<div class="cr-vh"><span class="cr-vnum">#' + num + ' ' + esc(c.name || "匿名") + '</span><div class="cr-va"><button class="e">編集</button><button class="r">' + (c.resolved ? "戻す" : "修正済") + '</button><button class="d">削除</button></div></div>' +
        (c.section ? '<div class="cr-hint">📍 ' + esc(c.section) + (c.hint ? " ／ 修正前：" + (c.hintExact ? "選択：" : "") + "「" + esc(c.hint) + "」" : "") + '</div>' : "") +
        (c.afterHint ? '<div class="cr-after">✓ 修正後：「' + esc(c.afterHint) + '」</div>' : "") +
        '<div class="cr-vtx" id="crv-' + c.id + '">' + esc(c.text) + '</div>' +
        (c.resolved ? '<span class="cr-badge">✓ 修正済み</span>' : "") + (date ? '<div class="cr-meta">' + date + '</div>' : "");
      document.body.appendChild(view);
      view.querySelector(".e").addEventListener("click", function () { editView(c); });
      view.querySelector(".r").addEventListener("click", function () { toggleResolved(c); closeView(); });
      view.querySelector(".d").addEventListener("click", function () { if (!confirm("削除しますか？")) return; col().doc(c.id).delete(); closeView(); });
    }
    function editView(c) {
      var el = $("crv-" + c.id);
      el.outerHTML = '<textarea id="cre-' + c.id + '" rows="3">' + esc(c.text) + '</textarea><div class="cr-row"><button class="cr-cancel">やめる</button><button class="cr-send">保存</button></div>';
      var box = view.querySelector("#cre-" + c.id); box.focus();
      view.querySelector(".cr-cancel").addEventListener("click", closeView);
      view.querySelector(".cr-send").addEventListener("click", function () { var t = box.value.trim(); if (!t) return; col().doc(c.id).update({ text: t }); closeView(); });
    }

    function renderPanel() {
      var list = $("cr-list");
      Array.prototype.slice.call(list.querySelectorAll(".cr-item")).forEach(function (el) { el.remove(); });
      var empty = $("cr-empty");
      // リストはステータス(全部/未対応/修正済)とビュー(ALL/PC/SP)で絞り込み
      var vis = comments.filter(function (c) {
        if (!matchStatus(c)) return false;
        if (filter !== "ALL" && c._view !== filter) return false;
        return true;
      });
      if (!vis.length) { empty.style.display = "block"; return; }
      empty.style.display = "none";
      vis.forEach(function (c) {
        var it = elm("div", { class: "cr-item" + (c.resolved ? " res" : "") });
        it.innerHTML = '<div class="cr-ih"><div class="cr-n' + (c.resolved ? " res" : "") + '">' + c._num + '</div><span class="cr-bdg">' + c._view + '</span><span class="cr-nm">' + esc(c.name || "匿名") + '</span></div>' +
          (c.section ? '<div class="cr-sec">' + esc(c.section) + '</div>' : "") +
          (c.hint ? '<div class="cr-hint">修正前：「' + esc(c.hint) + '」</div>' : "") +
          (c.afterHint ? '<div class="cr-after">✓ 修正後：「' + esc(c.afterHint) + '」</div>' : "") +
          '<div class="cr-tx">' + esc(c.text) + '</div>' +
          '<div class="cr-ba"><button class="e">編集</button><button class="r">' + (c.resolved ? "戻す" : "修正済") + '</button><button class="d">削除</button></div>';
        var txEl = it.querySelector(".cr-tx");
        it.querySelector(".e").addEventListener("click", function (e) { e.stopPropagation(); inlineEdit(it, txEl, c); });
        it.querySelector(".r").addEventListener("click", function (e) { e.stopPropagation(); toggleResolved(c); });
        it.querySelector(".d").addEventListener("click", function (e) { e.stopPropagation(); if (!confirm("削除？")) return; col().doc(c.id).delete(); });
        it.addEventListener("click", function (e) {
          if (e.target.closest("button") || e.target.closest("textarea")) return;
          if (c.root !== curRoot) return; // 別ビューのコメントはこのビューにピンが無い
          var pin = getRoot().querySelector('.cr-pin[data-id="' + c.id + '"]'); if (pin) { pin.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { pin.click(); }, 400); }
        });
        list.appendChild(it);
      });
    }

    // リスト行のインライン編集
    function inlineEdit(item, txEl, c) {
      if (item.querySelector(".cr-ein")) return;
      var ba = item.querySelector(".cr-ba");
      txEl.style.display = "none"; ba.style.display = "none";
      var box = elm("textarea", { class: "cr-ein", rows: "3" }); box.value = c.text;
      var row = elm("div", { class: "cr-row" });
      row.innerHTML = '<button class="cr-cancel">やめる</button><button class="cr-send">保存</button>';
      item.appendChild(box); item.appendChild(row); box.focus();
      row.querySelector(".cr-cancel").addEventListener("click", function (e) { e.stopPropagation(); box.remove(); row.remove(); txEl.style.display = ""; ba.style.display = ""; });
      row.querySelector(".cr-send").addEventListener("click", function (e) { e.stopPropagation(); var t = box.value.trim(); if (!t) return; col().doc(c.id).update({ text: t }); /* onSnapshotで再描画される */ });
    }

    // Firestore購読（1ページ＝1ドキュメント。PC/SPは中で分けて扱う）
    function subscribe() {
      var pid = pageId(); if (pid === curPid) return;
      curPid = pid; if (unsub) unsub();
      unsub = col().onSnapshot(function (snap) {
        comments = snap.docs.map(function (d) { var o = d.data(); o.id = d.id; return o; });
        comments.sort(function (a, b) { return (a.createdAt ? a.createdAt.seconds : 0) - (b.createdAt ? b.createdAt.seconds : 0); });
        assignNums();
        window.__crComments = comments; // クロコがURLで見に来た時に一括取得できるように（非表示）
        renderPins();
      }, function (err) { console.error("[comment]", err); });
    }

    document.addEventListener("click", function (e) { if (view && !e.target.closest(".cr-view") && !e.target.closest(".cr-pin")) closeView(); });
    function closeInput() { if (input) { input.remove(); input = null; } }
    function closeView() { if (view) { view.remove(); view = null; } activeId = null; }

    window.addEventListener("resize", function () { subscribe(); renderPins(); });
    window.addEventListener("load", function () { subscribe(); renderPins(); });
    subscribe(); renderPins();
  }
})();
