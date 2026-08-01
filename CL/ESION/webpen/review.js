/* ===================================================================
   CRATER テストアップ 修正コメント機能（クライアントレビュー用・汎用）
   - ページ上の要素をクリック → その場にピン＋コメント
   - ピンを打った要素の「セクション名＋近くのテキスト」を自動で拾う
     → クロコが「何を→どうする」を曖昧なく読める（Figma矢印の代替）
   - localStorageにページURL単位で保存（ラウンドをまたいで残る）
   - COMMENT ALLCOPY で全部テキストコピー → クロコに貼る
   任意のテストアップHTMLの </body> 直前に <script src="review.js"></script> で読み込むだけ
=================================================================== */
(function () {
  "use strict";
  var comments = [], curKey = "";
  var mode = false, popup = null;

  /* ---- スタイル注入 ---- */
  var css = document.createElement("style");
  css.textContent = [
    "#rv-open{position:fixed;right:16px;bottom:16px;width:48px;height:48px;border:none;border-radius:50%;background:#2563eb;color:#fff;cursor:pointer;z-index:2147483000;box-shadow:0 4px 14px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;transition:right .3s,background .2s;font-size:20px;}",
    "#rv-open:hover{background:#1d4ed8;}",
    "#rv-open.shifted{right:316px;}",
    "#rv-panel{position:fixed;top:0;right:0;width:300px;height:100vh;background:#1a1a1a;border-left:1px solid #333;display:flex;flex-direction:column;z-index:2147483001;font-family:'Zen Kaku Gothic New','Noto Sans JP',sans-serif;transform:translateX(300px);transition:transform .3s ease;}",
    "#rv-panel.open{transform:none;}",
    "#rv-ph{padding:16px;border-bottom:1px solid #2a2a2a;background:#111;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}",
    "#rv-ph .t{font-size:11px;color:#aaa;letter-spacing:.14em;}",
    "#rv-ph .r{display:flex;align-items:center;gap:8px;}",
    "#rv-count{font-size:11px;color:#ccc;background:#333;padding:2px 8px;border-radius:8px;}",
    "#rv-x{background:none;border:none;color:#666;font-size:20px;cursor:pointer;line-height:1;}",
    "#rv-act{padding:12px 16px;border-bottom:1px solid #2a2a2a;flex-shrink:0;}",
    "#rv-add{width:100%;background:#2563eb;border:none;color:#fff;padding:10px;font-size:12px;cursor:pointer;border-radius:999px;letter-spacing:.08em;font-family:inherit;}",
    "#rv-add:hover{background:#1d4ed8;}",
    "#rv-add.on{background:#ef4444;}",
    "#rv-list{flex:1;overflow-y:auto;padding:12px 16px;}",
    "#rv-empty{font-size:12px;color:#555;text-align:center;padding:40px 0;}",
    ".rv-item{background:#242424;padding:12px;margin-bottom:10px;border:1px solid #2a2a2a;border-radius:6px;}",
    ".rv-ih{display:flex;align-items:center;gap:8px;margin-bottom:6px;}",
    ".rv-n{width:20px;height:20px;background:#2563eb;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0;}",
    ".rv-sec{font-size:10px;color:#7c8cff;letter-spacing:.04em;}",
    ".rv-hint{font-size:10px;color:#777;margin:2px 0 6px;line-height:1.4;}",
    ".rv-tx{font-size:12.5px;color:#e6e6e6;line-height:1.6;white-space:pre-wrap;}",
    ".rv-btns{display:flex;gap:6px;margin-top:8px;}",
    ".rv-e,.rv-d{background:none;border:1px solid #374151;color:#aaa;padding:3px 9px;font-size:11px;cursor:pointer;border-radius:4px;font-family:inherit;}",
    ".rv-d{border-color:#5a1a1a;color:#f87171;}",
    ".rv-e:hover{background:#374151;color:#fff;}.rv-d:hover{background:#5a1a1a;}",
    ".rv-ta{width:100%;background:#111;border:1px solid #2563eb;color:#e6e6e6;font-size:12.5px;padding:7px;resize:vertical;font-family:inherit;line-height:1.5;outline:none;margin-top:6px;border-radius:4px;box-sizing:border-box;}",
    "#rv-copy{width:100%;background:#2C2C2C;border:1px solid #444;color:#e6e6e6;padding:11px;font-size:11px;letter-spacing:.14em;cursor:pointer;font-family:inherit;border-radius:4px;}",
    "#rv-copy:hover{background:#111;}",
    "#rv-cw{padding:12px 16px;border-top:1px solid #2a2a2a;flex-shrink:0;}",
    "#rv-layer{position:absolute;top:0;left:0;width:100%;pointer-events:none;z-index:2147482000;}",
    ".rv-pin{position:absolute;z-index:2147483000;width:28px;height:28px;border-radius:50% 50% 50% 2px;transform:translate(-50%,-100%);background:#2563eb;box-shadow:0 3px 10px rgba(0,0,0,.45);cursor:grab;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;pointer-events:all;transition:transform .15s;}",
    ".rv-pin:hover{transform:translate(-50%,-100%) scale(1.15);}",
    ".rv-pop{position:fixed;background:#1f2937;border:1px solid #374151;border-radius:10px;padding:14px;box-shadow:0 10px 30px rgba(0,0,0,.55);width:280px;z-index:2147483002;}",
    ".rv-pop .ctx{font-size:10.5px;color:#9fb0d0;margin-bottom:8px;line-height:1.4;}",
    ".rv-pop textarea{width:100%;background:#111827;border:1px solid #374151;border-radius:6px;color:#e5e7eb;font-size:13px;padding:9px;resize:vertical;font-family:inherit;line-height:1.5;outline:none;box-sizing:border-box;}",
    ".rv-pop textarea:focus{border-color:#2563eb;}",
    ".rv-pr{display:flex;gap:8px;margin-top:10px;justify-content:flex-end;}",
    ".rv-send{background:#2563eb;color:#fff;border:none;border-radius:6px;padding:8px 16px;font-size:12px;cursor:pointer;font-family:inherit;}",
    ".rv-cancel{background:#374151;color:#9ca3af;border:none;border-radius:6px;padding:8px 12px;font-size:12px;cursor:pointer;font-family:inherit;}",
    "body.rv-mode{cursor:crosshair;}"
  ].join("");
  document.head.appendChild(css);

  /* ---- UI 生成 ---- */
  var openBtn = el("button", { id: "rv-open", title: "修正コメント" }, "💬");
  var panel = el("div", { id: "rv-panel" });
  panel.innerHTML =
    '<div id="rv-ph"><span class="t">修正コメント</span><div class="r"><span id="rv-count">0件</span><button id="rv-x">×</button></div></div>' +
    '<div id="rv-act"><button id="rv-add">💬 コメントを追加</button></div>' +
    '<div id="rv-list"><div id="rv-empty">コメントなし</div></div>' +
    '<div id="rv-cw"><button id="rv-copy">COMMENT ALLCOPY</button></div>';
  document.body.appendChild(openBtn);
  document.body.appendChild(panel);
  // 拡大コンテナ（zoom基準）を掴む＝この中に%でピンを置くと正確
  function getRoot() {
    var ids = ["pageRoot", "pdpRoot", "spRoot"];
    for (var i = 0; i < ids.length; i++) { var n = document.getElementById(ids[i]); if (n && n.offsetParent !== null && n.getBoundingClientRect().width > 0) return n; }
    var z = document.querySelectorAll('[style*="zoom"]');
    for (var j = 0; j < z.length; j++) { if (z[j].offsetParent !== null && z[j].getBoundingClientRect().width > 0) return z[j]; }
    return document.body;
  }
  function rootZoom(r) { var z = parseFloat((r.style && r.style.zoom) || "1"); return z > 0 ? z : 1; }

  function el(tag, attrs, txt) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (txt != null) n.textContent = txt;
    return n;
  }
  function $(id) { return document.getElementById(id); }
  function save() { try { localStorage.setItem(curKey, JSON.stringify(comments)); } catch (e) {} }
  // 表示中のビュー(PC=pageRoot / SP=spRoot / 商品=pdpRoot / 誕生秘話=storyRoot)ごとにコメントを分離
  function syncComments() {
    var r = getRoot();
    var k = "crater_review_" + location.pathname + (r && r.id ? "_" + r.id : "");
    if (k !== curKey) {
      curKey = k;
      try { comments = JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { comments = []; }
    }
  }

  /* ---- パネル開閉 ---- */
  function toggle() {
    var open = panel.classList.toggle("open");
    openBtn.classList.toggle("shifted");
    window.rvPanelOpen = open;              // build側zoomがこれを見てコンテンツを縮小し重なりを回避
    window.dispatchEvent(new Event("resize"));
  }
  openBtn.addEventListener("click", toggle);
  $("rv-x").addEventListener("click", toggle);

  /* ---- コメントモード ---- */
  $("rv-add").addEventListener("click", function () {
    mode = !mode;
    document.body.classList.toggle("rv-mode", mode);
    this.classList.toggle("on", mode);
    this.textContent = mode ? "✕ 追加をやめる" : "💬 コメントを追加";
    if (!mode) closePop();
  });

  /* ---- クリックした要素の文脈を拾う ---- */
  function contextOf(target) {
    var sec = "", el = target;
    while (el && el !== document.body) {
      var nm = el.getAttribute && el.getAttribute("data-pencil-name");
      if (nm && !sec) { sec = nm; break; }
      el = el.parentElement;
    }
    var hint = (target.innerText || target.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40);
    if (!hint && target.tagName === "IMG") hint = "[画像]";
    if (!hint) {
      var bg = target.style && target.style.backgroundImage;
      if (bg && bg.indexOf("url") > -1) hint = "[画像/背景]";
    }
    return { section: sec || "(不明)", hint: hint };
  }

  /* ---- クリックでピン ---- */
  document.addEventListener("click", function (e) {
    if (!mode) return;
    if (e.target.closest("#rv-panel,#rv-open,.rv-pin,.rv-pop")) return;
    e.preventDefault(); e.stopPropagation();
    closePop();
    var ctx = contextOf(e.target);
    var root = getRoot(), rr = root.getBoundingClientRect();
    var xp = (((e.clientX - rr.left) / rr.width) * 100).toFixed(2);
    var yp = (((e.clientY - rr.top) / rr.height) * 100).toFixed(2);
    popup = el("div", { class: "rv-pop" });
    popup.style.left = Math.min(e.clientX + 12, window.innerWidth - 296) + "px";
    popup.style.top = Math.min(e.clientY + 12, window.innerHeight - 170) + "px";
    popup.innerHTML =
      '<div class="ctx">📍 <b>' + esc(ctx.section) + "</b>" + (ctx.hint ? " ／ 「" + esc(ctx.hint) + "」" : "") + "</div>" +
      '<textarea rows="3" placeholder="修正内容を入力…"></textarea>' +
      '<div class="rv-pr"><button class="rv-cancel">キャンセル</button><button class="rv-send">送信</button></div>';
    document.body.appendChild(popup);
    var ta = popup.querySelector("textarea");
    ta.focus();
    popup.querySelector(".rv-cancel").addEventListener("click", closePop);
    popup.querySelector(".rv-send").addEventListener("click", function () {
      var t = ta.value.trim(); if (!t) return;
      comments.push({ id: Date.now(), section: ctx.section, hint: ctx.hint, x: xp, y: yp, text: t, date: new Date().toLocaleDateString("ja-JP") });
      save(); closePop(); render();
      $("rv-add").click();
    });
    var ime = false;
    ta.addEventListener("compositionstart", function () { ime = true; });
    ta.addEventListener("compositionend", function () { ime = false; });
    ta.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" && !ev.shiftKey && !ime) { ev.preventDefault(); popup.querySelector(".rv-send").click(); }
    });
  }, true);

  function closePop() { if (popup) { popup.remove(); popup = null; } }
  function esc(s) { return (s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  window.rvDel = function (id) { comments = comments.filter(function (c) { return c.id !== id; }); save(); render(); };
  window.rvEdit = function (id) {
    var c = find(id); if (!c) return;
    var box = $("tx-" + id);
    box.innerHTML = '<textarea class="rv-ta" id="ta-' + id + '" rows="3"></textarea><div class="rv-btns"><button class="rv-e" onclick="rvSave(' + id + ')">保存</button><button class="rv-d" onclick="render()">やめる</button></div>';
    $("ta-" + id).value = c.text; $("ta-" + id).focus();
  };
  window.rvSave = function (id) {
    var ta = $("ta-" + id); if (!ta) return; var t = ta.value.trim(); if (!t) return;
    var c = find(id); if (c) c.text = t; save(); render();
  };
  window.render = render;
  function find(id) { for (var i = 0; i < comments.length; i++) if (comments[i].id === id) return comments[i]; }

  /* ---- 描画 ---- */
  function render() {
    syncComments();
    var root = getRoot();
    Array.prototype.slice.call(document.querySelectorAll(".rv-pin")).forEach(function (p) { p.remove(); });
    comments.forEach(function (c, i) {
      var pin = el("div", { class: "rv-pin" }, i + 1);
      pin.style.left = c.x + "%"; pin.style.top = c.y + "%";
      drag(pin, c.id);
      root.appendChild(pin);
    });
    // panel
    $("rv-count").textContent = comments.length + "件";
    var list = $("rv-list");
    if (!comments.length) { list.innerHTML = '<div id="rv-empty">コメントなし</div>'; return; }
    list.innerHTML = comments.map(function (c, i) {
      return '<div class="rv-item"><div class="rv-ih"><div class="rv-n">' + (i + 1) + '</div><span class="rv-sec">' + esc(c.section) + '</span></div>' +
        (c.hint ? '<div class="rv-hint">「' + esc(c.hint) + '」</div>' : "") +
        '<div class="rv-tx" id="tx-' + c.id + '">' + esc(c.text) + "</div>" +
        '<div class="rv-btns"><button class="rv-e" onclick="rvEdit(' + c.id + ')">編集</button><button class="rv-d" onclick="rvDel(' + c.id + ')">削除</button></div></div>';
    }).join("");
  }

  function drag(pin, id) {
    pin.addEventListener("mousedown", function (e) {
      e.stopPropagation(); e.preventDefault();
      var moved = false, sx = e.clientX, sy = e.clientY;
      var rr = getRoot().getBoundingClientRect(), docW = rr.width, docH = rr.height;
      var sl = parseFloat(pin.style.left), st = parseFloat(pin.style.top);
      function mv(ev) {
        var dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved && Math.abs(dx) + Math.abs(dy) > 4) moved = true;
        if (!moved) return;
        pin.style.left = Math.max(0, Math.min(100, sl + dx / docW * 100)) + "%";
        pin.style.top = Math.max(0, Math.min(100, st + dy / docH * 100)) + "%";
      }
      function up() {
        document.removeEventListener("mousemove", mv); document.removeEventListener("mouseup", up);
        if (!moved) return;
        var c = find(id); if (c) { c.x = parseFloat(pin.style.left).toFixed(2); c.y = parseFloat(pin.style.top).toFixed(2); save(); }
      }
      document.addEventListener("mousemove", mv); document.addEventListener("mouseup", up);
    });
  }

  /* ---- ALLCOPY ---- */
  $("rv-copy").addEventListener("click", function () {
    if (!comments.length) { alert("コメントがありません"); return; }
    var out = ["=== 修正コメント（" + location.pathname + "）===",
      new Date().toLocaleString("ja-JP") + " / " + comments.length + "件", ""];
    comments.forEach(function (c, i) {
      out.push("[" + (i + 1) + "] 【" + c.section + "】" + (c.hint ? " 「" + c.hint + "」付近" : ""));
      out.push("　修正：" + c.text);
      out.push("");
    });
    var txt = out.join("\n");
    navigator.clipboard.writeText(txt).then(function () {
      var b = $("rv-copy"); b.textContent = "コピーしました！"; setTimeout(function () { b.textContent = "COMMENT ALLCOPY"; }, 2000);
    }, function () { prompt("以下をコピーしてクロコに貼ってください：", txt); });
  });

  window.addEventListener("resize", render);
  window.addEventListener("load", render);
  render();
})();
