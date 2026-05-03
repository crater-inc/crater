/* ═══════════════════════════════════════
   CRATER コメント機能 — comment-feature.js
   ローカル専用。push前にscriptタグ1行を削除する。
═══════════════════════════════════════ */
(function(){

/* ── スタイル注入 ── */
const css=`
#cm-toggle{position:fixed;bottom:28px;right:28px;z-index:8000;background:#1a1a1a;color:#fff;font-family:'Oswald',sans-serif;font-size:11px;letter-spacing:0.2em;border:none;border-radius:100px;padding:11px 20px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.25);display:flex;align-items:center;gap:8px;transition:background 0.2s;}
#cm-toggle.active{background:#8F7AAA;}
#cm-toggle-dot{width:8px;height:8px;border-radius:50%;background:#fff;opacity:0.5;}
#cm-toggle.active #cm-toggle-dot{opacity:1;}
body.cm-mode,body.cm-mode *{cursor:crosshair!important;}
.cm-pin{position:absolute;z-index:7000;width:26px;height:26px;border-radius:50%;background:#8F7AAA;color:#fff;font-family:'Oswald',sans-serif;font-size:11px;font-weight:500;display:flex;align-items:center;justify-content:center;cursor:pointer;transform:translate(-50%,-50%);box-shadow:0 2px 8px rgba(143,122,170,0.5);border:2px solid #fff;transition:transform 0.15s;user-select:none;}
.cm-pin:hover{transform:translate(-50%,-50%) scale(1.15);}
.cm-bubble{position:absolute;z-index:7500;background:#fff;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,0.15);width:260px;padding:16px;border:1px solid #e4e0d8;}
.cm-bubble-num{font-family:'Oswald',sans-serif;font-size:10px;letter-spacing:0.25em;color:#8F7AAA;margin-bottom:8px;}
.cm-bubble-text{font-family:'Noto Sans JP',sans-serif;font-size:12px;font-weight:400;color:#1a1a1a;line-height:1.7;white-space:pre-wrap;word-break:break-all;}
.cm-bubble-textarea{width:100%;font-family:'Noto Sans JP',sans-serif;font-size:12px;color:#1a1a1a;line-height:1.7;border:1px solid #D4C9E2;border-radius:4px;padding:8px;resize:vertical;min-height:72px;outline:none;background:#F5F1E8;box-sizing:border-box;}
.cm-bubble-actions{display:flex;gap:8px;margin-top:10px;}
.cm-btn{font-family:'Oswald',sans-serif;font-size:10px;letter-spacing:0.15em;border:none;border-radius:4px;padding:6px 12px;cursor:pointer;}
.cm-btn-save{background:#8F7AAA;color:#fff;}
.cm-btn-edit{background:#EDE9DF;color:#555;}
.cm-btn-delete{background:#fff;color:#C0392B;border:1px solid #f0d0cc;}
#cm-export-wrap{position:fixed;bottom:28px;right:180px;z-index:8000;display:none;}
#cm-export{background:#fff;color:#1a1a1a;font-family:'Oswald',sans-serif;font-size:11px;letter-spacing:0.2em;border:1px solid #D4C9E2;border-radius:100px;padding:11px 20px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.1);}
#cm-export:hover{background:#8F7AAA;color:#fff;border-color:#8F7AAA;}
#cm-copied{position:fixed;bottom:80px;right:28px;z-index:9000;background:#1a1a1a;color:#fff;font-family:'Oswald',sans-serif;font-size:11px;letter-spacing:0.2em;padding:10px 20px;border-radius:100px;opacity:0;transition:opacity 0.3s;pointer-events:none;}
#cm-layer .cm-pin,#cm-layer .cm-bubble{pointer-events:auto;}
`;
const styleEl=document.createElement('style');
styleEl.textContent=css;
document.head.appendChild(styleEl);

/* ── UI注入 ── */
document.addEventListener('DOMContentLoaded',()=>{
  document.body.insertAdjacentHTML('beforeend',`
    <div id="cm-toggle" onclick="cmToggleMode()"><div id="cm-toggle-dot"></div><span id="cm-toggle-label">コメントモード</span></div>
    <div id="cm-export-wrap"><button id="cm-export" onclick="cmExport()">📋 Claudeに渡す</button></div>
    <div id="cm-copied">コピーしました</div>
  `);
  const l=document.createElement('div');
  l.id='cm-layer';
  l.style.cssText='position:absolute;top:0;left:0;width:100%;pointer-events:none;z-index:6999;';
  document.body.appendChild(l);
  renderAll();
  document.addEventListener('click',onPageClick);
});

/* ── 状態 ── */
const FILE_KEY = location.pathname.split('/').pop().replace('.html','') || 'cm';
let currentTab='overview';
function getKey(tab){return FILE_KEY+'_'+tab;}

/* ── バージョン管理：HTML更新時にコメントをリセット ── */
const VER_KEY = FILE_KEY+'_version';
const htmlVersion = document.querySelector('meta[name="cm-version"]')?.content || '';
const storedVersion = localStorage.getItem(VER_KEY);
if(htmlVersion && htmlVersion !== storedVersion){
  /* バージョンが変わったら全タブのコメントを削除 */
  Object.keys(localStorage).forEach(k=>{ if(k.startsWith(FILE_KEY+'_') && k!==VER_KEY) localStorage.removeItem(k); });
  localStorage.setItem(VER_KEY, htmlVersion);
}
function getComments(tab){return JSON.parse(localStorage.getItem(getKey(tab))||'[]');}
function saveComments(tab,data){localStorage.setItem(getKey(tab),JSON.stringify(data));}
let mode=false,comments=getComments('overview'),bubble=null;

/* ── タブ切り替え連携（ブランドボードのswitchTabから呼ばれる） ── */
window.switchToTab=function(tab){
  currentTab=tab;
  comments=getComments(tab);
  renderAll();
};

function save(){saveComments(currentTab,comments);}

function renderAll(){
  document.querySelectorAll('.cm-pin,.cm-bubble').forEach(e=>e.remove());
  comments.forEach((c,i)=>{
    const p=document.createElement('div');
    p.className='cm-pin';p.textContent=i+1;
    p.style.left=c.x+'px';p.style.top=c.y+'px';
    document.getElementById('cm-layer').appendChild(p);
    p.addEventListener('click',e=>{e.stopPropagation();showBubble(c,i);});
  });
  const expWrap=document.getElementById('cm-export-wrap');
  if(expWrap) expWrap.style.display=comments.length?'block':'none';
}

function showBubble(c,i){
  if(bubble){bubble.remove();bubble=null;}
  const b=document.createElement('div');b.className='cm-bubble';
  b.style.left=(c.x+16)+'px';b.style.top=(c.y-20)+'px';
  b.innerHTML=`<div class="cm-bubble-num">PIN ${i+1}</div><div class="cm-bubble-text">${c.text||'（コメントなし）'}</div><div class="cm-bubble-actions"><button class="cm-btn cm-btn-edit" onclick="cmEdit(${i})">編集</button><button class="cm-btn cm-btn-delete" onclick="cmDelete(${i})">削除</button></div>`;
  document.getElementById('cm-layer').appendChild(b);
  bubble=b;
  document.addEventListener('click',function h(e){if(bubble&&!bubble.contains(e.target)){bubble.remove();bubble=null;}document.removeEventListener('click',h);});
}

window.cmEdit=function(i){
  if(bubble){bubble.remove();bubble=null;}
  const c=comments[i],b=document.createElement('div');
  b.className='cm-bubble';b.style.left=(c.x+16)+'px';b.style.top=(c.y-20)+'px';
  b.innerHTML=`<div class="cm-bubble-num">PIN ${i+1} 編集</div><textarea class="cm-bubble-textarea" id="cbe${i}">${c.text||''}</textarea><div class="cm-bubble-actions"><button class="cm-btn cm-btn-save" onclick="cmSave(${i})">保存</button><button class="cm-btn cm-btn-edit" onclick="cmCancel()">キャンセル</button></div>`;
  document.getElementById('cm-layer').appendChild(b);bubble=b;
  document.getElementById('cbe'+i).focus();
  b.addEventListener('click',e=>e.stopPropagation());
};
window.cmSave=function(i){comments[i].text=document.getElementById('cbe'+i).value.trim();save();renderAll();};
window.cmCancel=function(){if(bubble){bubble.remove();bubble=null;}renderAll();};
window.cmDelete=function(i){comments.splice(i,1);save();renderAll();if(bubble){bubble.remove();bubble=null;}};

window.cmToggleMode=function(){
  mode=!mode;
  document.body.classList.toggle('cm-mode',mode);
  document.getElementById('cm-toggle').classList.toggle('active',mode);
  document.getElementById('cm-toggle-label').textContent=mode?'モード ON':'コメントモード';
};

window.cmExport=function(){
  if(!comments.length)return;
  let t=`【${document.title} コメント — ${currentTab}】\n\n`;
  comments.forEach((c,i)=>{t+=`[ピン${i+1}] (${Math.round(c.x)}, ${Math.round(c.y)})\n→ ${c.text||'（コメントなし）'}\n\n`;});
  t+='上記を反映してください。';
  navigator.clipboard.writeText(t).then(()=>{
    const el=document.getElementById('cm-copied');
    el.style.opacity='1';setTimeout(()=>el.style.opacity='0',2000);
  });
};

function onPageClick(e){
  if(!mode)return;
  if(e.target.closest('#cm-toggle,#cm-export-wrap,.cm-pin,.cm-bubble'))return;
  const x=e.clientX,y=e.clientY+(window.scrollY||0);
  if(bubble){bubble.remove();bubble=null;}
  const ni=comments.length,b=document.createElement('div');
  b.className='cm-bubble';b.style.left=(x+16)+'px';b.style.top=(y-20)+'px';
  b.innerHTML=`<div class="cm-bubble-num">PIN ${ni+1} 新規</div><textarea class="cm-bubble-textarea" id="cbn" placeholder="コメントを入力…"></textarea><div class="cm-bubble-actions"><button class="cm-btn cm-btn-save" onclick="cmAdd(${x},${y})">追加</button><button class="cm-btn cm-btn-edit" onclick="cmCancel()">キャンセル</button></div>`;
  document.getElementById('cm-layer').appendChild(b);bubble=b;
  document.getElementById('cbn').focus();
  b.addEventListener('click',e=>e.stopPropagation());
}
window.cmAdd=function(x,y){
  const t=document.getElementById('cbn').value.trim();
  comments.push({x,y,text:t});save();renderAll();
  if(bubble){bubble.remove();bubble=null;}
};

})();
