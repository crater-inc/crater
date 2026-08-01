// ============================================================
// CRATER 修正コメントツール（汎用・クラウド版）
// 使い方：テストアップHTMLの </body> 直前に  <script src="/comment.js"></script>  を1行入れるだけ。
//   - Firestore(view-crater)にリアルタイム保存 → 複数端末・クライアントと即共有
//   - ページ×ビュー(PC/SP)ごとに自動でコメントを分離（zoomコンテナを自動判定）
//   - 解決(完了)フラグ → 「解決済みを隠す」で非表示
//   - ?client=1 でクライアント公開モード（「クロコに渡す」ボタンを隠す）
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
    var comments = [], mode = false, showResolved = true;
    var input = null, view = null, activeId = null, curPid = "", unsub = null;

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
    // ページ×ビューごとに一意のFirestoreドキュメントID（doc IDにできる文字だけ）
    function pageId() { var r = getRoot(); return ("v" + location.pathname + "_" + (r.id || "body")).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 180); }
    function col() { return db.collection("comments").doc(curPid).collection("items"); }

    // ---- CSS ----
    var css = document.createElement("style");
    css.textContent = [
      "#cr-open{position:fixed;right:16px;bottom:16px;width:48px;height:48px;border:none;border-radius:50%;background:#2563eb;color:#fff;font-size:20px;cursor:pointer;z-index:2147483000;box-shadow:0 4px 14px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;transition:right .3s;}",
      "#cr-open.shift{right:316px;}",
      "#cr-panel{position:fixed;top:0;right:0;width:300px;height:100vh;background:#1a1a1a;border-left:1px solid #333;display:flex;flex-direction:column;z-index:2147483001;font-family:'Zen Kaku Gothic New',sans-serif;transform:translateX(300px);transition:transform .3s ease;}",
      "#cr-panel.open{transform:none;}",
      "#cr-ph{padding:14px 16px;border-bottom:1px solid #2a2a2a;display:flex;align-items:center;justify-content:space-between;background:#111;}",
      "#cr-ph .t{font-size:12px;color:#aaa;letter-spacing:.1em;}",
      "#cr-ph .r{display:flex;align-items:center;gap:8px;}",
      "#cr-count{font-size:11px;color:#ccc;background:#333;padding:2px 8px;border-radius:8px;}",
      "#cr-x{background:none;border:none;color:#666;font-size:18px;cursor:pointer;}",
      "#cr-act{padding:10px 14px;border-bottom:1px solid #2a2a2a;display:flex;gap:8px;}",
      "#cr-add{flex:1;background:#2563eb;border:none;color:#fff;padding:8px;font-size:11px;cursor:pointer;letter-spacing:.08em;border-radius:999px;font-family:inherit;}",
      "#cr-add.on{background:#ef4444;}",
      "#cr-toggle{background:none;border:1px solid #374151;color:#99aabb;padding:8px 10px;font-size:10px;cursor:pointer;border-radius:999px;font-family:inherit;white-space:nowrap;}",
      "#cr-list{flex:1;overflow-y:auto;padding:10px 14px;}",
      "#cr-empty{font-size:12px;color:#555;text-align:center;padding:40px 0;}",
      ".cr-item{background:#242424;padding:10px 12px;margin-bottom:8px;border:1px solid #2a2a2a;border-radius:6px;cursor:pointer;}",
      ".cr-item.res{opacity:.5;}",
      ".cr-ih{display:flex;align-items:center;gap:8px;margin-bottom:5px;}",
      ".cr-n{width:20px;height:20px;background:#2563eb;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0;}",
      ".cr-n.res{background:#6b7280;}",
      ".cr-nm{font-size:11px;color:#888;}",
      ".cr-sec{font-size:10px;color:#5b6b8c;margin-bottom:2px;}",
      ".cr-tx{font-size:12px;color:#e0e0e0;line-height:1.6;}",
      ".cr-hint{font-size:10px;color:#6b7280;margin:2px 0 6px;}",
      ".cr-ba{display:flex;gap:6px;margin-top:8px;}",
      ".cr-ba button{background:none;border:1px solid #374151;color:#aaa;padding:3px 8px;font-size:10px;cursor:pointer;border-radius:4px;font-family:inherit;}",
      "#cr-cw{padding:12px 14px;border-top:1px solid #2a2a2a;}",
      "#cr-copy{width:100%;background:#1a3a2a;border:1px solid #2a6a4a;color:#4ade80;padding:10px;border-radius:6px;font-size:11px;letter-spacing:.1em;cursor:pointer;font-family:inherit;}",
      ".cr-pin{position:absolute;z-index:2147482000;width:28px;height:28px;border-radius:50% 50% 50% 2px;transform:translate(-50%,-100%);background:#2563eb;box-shadow:0 3px 10px rgba(0,0,0,.45);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;}",
      ".cr-pin.res{background:#6b7280;}",
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
      "@media(max-width:768px){#cr-panel{width:100%;height:62vh;top:auto;bottom:0;transform:translateY(100%);border-left:none;border-top:1px solid #333;}#cr-panel.open{transform:none;}#cr-open.shift{right:16px;bottom:calc(62vh + 12px);}}"
    ].join("");
    document.head.appendChild(css);

    // ---- UI ----
    var openBtn = elm("button", { id: "cr-open", title: "修正コメント" }, "💬");
    var panel = elm("div", { id: "cr-panel" });
    panel.innerHTML =
      '<div id="cr-ph"><span class="t">修正コメント</span><div class="r"><span id="cr-count">0件</span><button id="cr-x">×</button></div></div>' +
      '<div id="cr-act"><button id="cr-add">💬 コメント追加</button><button id="cr-toggle">解決済みを隠す</button></div>' +
      '<div id="cr-list"><div id="cr-empty">コメントなし</div></div>' +
      (CLIENT ? "" : '<div id="cr-cw"><button id="cr-copy">クロコに渡す（コピー）</button></div>');
    document.body.appendChild(openBtn);
    document.body.appendChild(panel);

    // パネル開閉：開くとページ側zoomが window.rvPanelOpen を見てコンテンツを縮小→パネルと重ならず全部見える（PCのみ・SPはボトムシート）
    function toggle() { var o = panel.classList.toggle("open"); openBtn.classList.toggle("shift"); window.rvPanelOpen = o; window.dispatchEvent(new Event("resize")); }
    openBtn.addEventListener("click", toggle);
    $("cr-x").addEventListener("click", toggle);

    $("cr-add").addEventListener("click", function () {
      mode = !mode; document.body.classList.toggle("cr-mode", mode);
      this.classList.toggle("on", mode);
      this.textContent = mode ? "✕ 追加をやめる" : "💬 コメント追加";
      if (!mode) closeInput();
    });
    $("cr-toggle").addEventListener("click", function () {
      showResolved = !showResolved; this.textContent = showResolved ? "解決済みを隠す" : "解決済みを表示"; renderPins();
    });

    // クリックした要素の文脈（どのセクション・近傍テキスト）を拾う
    function contextOf(t) {
      var sec = "", el = t;
      while (el && el !== document.body) { var nm = el.getAttribute && el.getAttribute("data-pencil-name"); if (nm) { sec = nm; break; } el = el.parentElement; }
      var hint = (t.innerText || t.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40);
      if (!hint && t.tagName === "IMG") hint = "[画像]";
      return { section: sec || "(不明)", hint: hint };
    }

    // クリックでピン
    document.addEventListener("click", function (e) {
      if (!mode) return;
      if (e.target.closest("#cr-panel,#cr-open,.cr-pin,.cr-input,.cr-view")) return;
      e.preventDefault(); e.stopPropagation();
      closeInput(); closeView();
      var ctx = contextOf(e.target);
      var r = getRoot(), rr = r.getBoundingClientRect();
      var xp = (((e.clientX - rr.left) / rr.width) * 100).toFixed(2);
      var yp = (((e.clientY - rr.top) / rr.height) * 100).toFixed(2);
      input = elm("div", { class: "cr-input" });
      input.style.left = Math.min(e.clientX + 12, window.innerWidth - 296) + "px";
      input.style.top = Math.min(e.clientY + 12, window.innerHeight - 190) + "px";
      input.innerHTML = '<div class="cr-meta">📍 ' + esc(ctx.section) + (ctx.hint ? " ／ 「" + esc(ctx.hint) + "」" : "") + '</div>' +
        '<textarea rows="3" placeholder="修正内容を入力…"></textarea>' +
        '<input type="text" placeholder="名前（任意）">' +
        '<div class="cr-row"><button class="cr-cancel">キャンセル</button><button class="cr-send">送信</button></div>';
      document.body.appendChild(input);
      var ta = input.querySelector("textarea"); ta.focus();
      input.querySelector(".cr-cancel").addEventListener("click", closeInput);
      input.querySelector(".cr-send").addEventListener("click", function () {
        var text = ta.value.trim(); if (!text) return;
        var name = input.querySelector("input").value.trim() || "匿名";
        col().add({ x: parseFloat(xp), y: parseFloat(yp), text: text, name: name, section: ctx.section, hint: ctx.hint, resolved: false, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
        closeInput();
      });
      var ime = false;
      ta.addEventListener("compositionstart", function () { ime = true; });
      ta.addEventListener("compositionend", function () { ime = false; });
      ta.addEventListener("keydown", function (ev) { if (ev.key === "Enter" && !ev.shiftKey && !ime) { ev.preventDefault(); input.querySelector(".cr-send").click(); } });
    }, true);

    function renderPins() {
      var r = getRoot();
      Array.prototype.slice.call(document.querySelectorAll(".cr-pin")).forEach(function (p) { p.remove(); });
      var vis = comments.filter(function (c) { return showResolved || !c.resolved; });
      vis.forEach(function (c, i) {
        var pin = elm("div", { class: "cr-pin" + (c.resolved ? " res" : "") }, String(i + 1));
        pin.style.left = c.x + "%"; pin.style.top = c.y + "%"; pin.dataset.id = c.id;
        pin.addEventListener("click", function (e) { e.stopPropagation(); if (activeId === c.id) { closeView(); return; } closeView(); showView(c, pin, i + 1); });
        r.appendChild(pin);
      });
      renderPanel(vis);
      $("cr-count").textContent = comments.length + "件";
    }

    function showView(c, pin, num) {
      activeId = c.id; var pr = pin.getBoundingClientRect();
      view = elm("div", { class: "cr-view" });
      view.style.left = Math.min(pr.right + 8, window.innerWidth - 296) + "px";
      view.style.top = Math.max(pr.top - 10, 60) + "px";
      var date = c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleDateString("ja-JP") : "";
      view.innerHTML = '<div class="cr-vh"><span class="cr-vnum">#' + num + ' ' + esc(c.name || "匿名") + '</span><div class="cr-va"><button class="e">編集</button><button class="r">' + (c.resolved ? "再開" : "解決") + '</button><button class="d">削除</button></div></div>' +
        (c.section ? '<div class="cr-hint">📍 ' + esc(c.section) + (c.hint ? " ／ 「" + esc(c.hint) + "」" : "") + '</div>' : "") +
        '<div class="cr-vtx" id="crv-' + c.id + '">' + esc(c.text) + '</div>' +
        (c.resolved ? '<span class="cr-badge">✓ 解決済み</span>' : "") + (date ? '<div class="cr-meta">' + date + '</div>' : "");
      document.body.appendChild(view);
      view.querySelector(".e").addEventListener("click", function () { editView(c); });
      view.querySelector(".r").addEventListener("click", function () { col().doc(c.id).update({ resolved: !c.resolved }); closeView(); });
      view.querySelector(".d").addEventListener("click", function () { if (!confirm("削除しますか？")) return; col().doc(c.id).delete(); closeView(); });
    }
    function editView(c) {
      var el = $("crv-" + c.id);
      el.outerHTML = '<textarea id="cre-' + c.id + '" rows="3">' + esc(c.text) + '</textarea><div class="cr-row"><button class="cr-cancel">やめる</button><button class="cr-send">保存</button></div>';
      var box = view.querySelector("#cre-" + c.id); box.focus();
      view.querySelector(".cr-cancel").addEventListener("click", closeView);
      view.querySelector(".cr-send").addEventListener("click", function () { var t = box.value.trim(); if (!t) return; col().doc(c.id).update({ text: t }); closeView(); });
    }

    function renderPanel(vis) {
      var list = $("cr-list");
      Array.prototype.slice.call(list.querySelectorAll(".cr-item")).forEach(function (el) { el.remove(); });
      var empty = $("cr-empty");
      if (!vis.length) { empty.style.display = "block"; return; }
      empty.style.display = "none";
      vis.forEach(function (c, i) {
        var it = elm("div", { class: "cr-item" + (c.resolved ? " res" : "") });
        it.innerHTML = '<div class="cr-ih"><div class="cr-n' + (c.resolved ? " res" : "") + '">' + (i + 1) + '</div><span class="cr-nm">' + esc(c.name || "匿名") + '</span></div>' +
          (c.section ? '<div class="cr-sec">' + esc(c.section) + '</div>' : "") +
          '<div class="cr-tx">' + esc(c.text) + '</div>' +
          '<div class="cr-ba"><button class="r">' + (c.resolved ? "再開" : "解決") + '</button><button class="d">削除</button></div>';
        it.querySelector(".r").addEventListener("click", function (e) { e.stopPropagation(); col().doc(c.id).update({ resolved: !c.resolved }); });
        it.querySelector(".d").addEventListener("click", function (e) { e.stopPropagation(); if (!confirm("削除？")) return; col().doc(c.id).delete(); });
        it.addEventListener("click", function (e) { if (e.target.closest("button")) return; var pin = getRoot().querySelector('.cr-pin[data-id="' + c.id + '"]'); if (pin) { pin.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { pin.click(); },400); } });
        list.appendChild(it);
      });
    }

    // クロコに渡す（未解決/解決済みを整形コピー）
    if (!CLIENT) $("cr-copy").addEventListener("click", function () {
      var open = comments.filter(function (c) { return !c.resolved; });
      var res = comments.filter(function (c) { return c.resolved; });
      var L = ["=== 修正コメント（" + location.pathname + "）===",
        new Date().toLocaleString("ja-JP") + " / 計" + comments.length + "件（未解決" + open.length + "・解決済" + res.length + "）", ""];
      open.forEach(function (c, i) { L.push("[未" + (i + 1) + "] 【" + (c.section || "") + "】" + (c.hint ? "「" + c.hint + "」付近" : "") + " ／ " + (c.name || "匿名")); L.push("　修正：" + c.text); L.push(""); });
      if (res.length) { L.push("── 解決済み ──"); res.forEach(function (c, i) { L.push("[済" + (i + 1) + "] " + c.text); }); }
      var txt = L.join("\n");
      navigator.clipboard.writeText(txt).then(function () { var b = $("cr-copy"); b.textContent = "✓ コピーしました！"; setTimeout(function () { b.textContent = "クロコに渡す（コピー）"; }, 2000); }, function () { prompt("コピーしてクロコに貼ってください：", txt); });
    });

    // Firestore購読（ビュー切替でPAGE_ID張り替え＝PC/SP自動分離）
    function subscribe() {
      var pid = pageId(); if (pid === curPid) return;
      curPid = pid; if (unsub) unsub();
      unsub = col().onSnapshot(function (snap) {
        comments = snap.docs.map(function (d) { var o = d.data(); o.id = d.id; return o; });
        comments.sort(function (a, b) { return (a.createdAt ? a.createdAt.seconds : 0) - (b.createdAt ? b.createdAt.seconds : 0); });
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
