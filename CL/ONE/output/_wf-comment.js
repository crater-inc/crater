// ONE ワイヤーフレーム コメントシステム
// 各ページで var WF_PAGE_ID = 'one-wf-xxx'; を先に定義してから読み込む
// URLに ?client=1 をつけると「クロードに渡す」ボタンが非表示になる（クライアント公開モード）
(function(){
  try{firebase.initializeApp({apiKey:"AIzaSyArq3B1YkeiBv-PgpBkMrRGWsOkuXx4fxo",authDomain:"view-crater.firebaseapp.com",projectId:"view-crater",storageBucket:"view-crater.firebasestorage.app",messagingSenderId:"523845906687",appId:"1:523845906687:web:b5b6612eabe1af9544dcca"});}catch(e){}
  var db=firebase.firestore();
  var PAGE_ID=window.WF_PAGE_ID||'one-wf-unknown';
  var PAGE_NAME=window.WF_PAGE_NAME||(document.querySelector('.wf-bar-page')?document.querySelector('.wf-bar-page').textContent:'このページ');
  var CLIENT_MODE=(new URLSearchParams(window.location.search)).get('client')==='1';

  var commentMode=false,showResolved=true,comments=[],activePopupId=null,inputPopup=null,viewPopup=null;
  var overlay=document.getElementById('wf-overlay');

  // クロードに渡すボタンをパネルに追加
  var panel=document.getElementById('wf-panel');
  if(panel&&!CLIENT_MODE){
    var claudeBtn=document.createElement('div');
    claudeBtn.id='wf-claude-wrap';
    claudeBtn.style.cssText='margin-top:24px;border-top:1px solid #222;padding-top:16px;';
    claudeBtn.innerHTML='<button id="wf-claude-btn" style="width:100%;background:#1a3a2a;border:1px solid #2a6a4a;color:#4ade80;padding:10px 16px;border-radius:6px;font-size:12px;letter-spacing:0.15em;cursor:pointer;font-family:inherit;text-align:left;">COMMENT ALLCOPY</button>';
    panel.appendChild(claudeBtn);
    document.getElementById('wf-claude-btn').addEventListener('click',showClaudeModal);
  }

  // コメントモード
  document.getElementById('wf-comment-btn').addEventListener('click',function(){
    commentMode=!commentMode;
    overlay.style.pointerEvents=commentMode?'auto':'none';
    overlay.style.cursor=commentMode?'crosshair':'default';
    this.classList.toggle('wf-active',commentMode);
    this.textContent=commentMode?'✕ 完了':'💬 コメント追加';
    if(!commentMode)closeInput();
  });

  // 解決済みトグル
  document.getElementById('wf-toggle-resolved').addEventListener('click',function(){
    showResolved=!showResolved;
    this.textContent=showResolved?'解決済みを隠す':'解決済みを表示';
    renderPins();
  });

  // クリックでコメント入力
  overlay.addEventListener('click',function(e){
    if(e.target.closest('.c-pin')||e.target.closest('.c-input-popup'))return;
    closeInput();closeView();
    var rect=overlay.getBoundingClientRect();
    var x=((e.clientX-rect.left)/rect.width*100).toFixed(2);
    var pageEl=document.querySelector('.page');
    var pageRect=pageEl.getBoundingClientRect();
    var y=((e.clientY-pageRect.top+window.pageYOffset)/pageEl.offsetHeight*100).toFixed(2);
    inputPopup=document.createElement('div');
    inputPopup.className='c-input-popup';
    inputPopup.style.cssText='position:fixed;left:'+Math.min(e.clientX+12,window.innerWidth-290)+'px;top:'+Math.min(e.clientY+12,window.innerHeight-160)+'px;z-index:10000;';
    inputPopup.innerHTML='<textarea id="c-text" rows="3" placeholder="コメントを入力…"></textarea><div class="c-input-row"><input class="c-input-name" id="c-name" type="text" placeholder="名前（任意）"><button class="c-cancel-btn" id="c-cancel">キャンセル</button><button class="c-send-btn" id="c-send">送信</button></div>';
    document.body.appendChild(inputPopup);
    document.getElementById('c-text').focus();
    document.getElementById('c-cancel').addEventListener('click',closeInput);
    document.getElementById('c-send').addEventListener('click',function(){
      var text=document.getElementById('c-text').value.trim();
      var name=document.getElementById('c-name').value.trim()||'匿名';
      if(!text)return;
      db.collection('comments').doc(PAGE_ID).collection('items').add({x:parseFloat(x),y:parseFloat(y),text:text,name:name,resolved:false,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
      closeInput();
    });
    document.getElementById('c-text').addEventListener('keydown',function(ev){if(ev.key==='Enter'&&!ev.shiftKey){ev.preventDefault();document.getElementById('c-send').click();}});
  });

  function renderPins(){
    overlay.querySelectorAll('.c-pin').forEach(function(p){p.remove();});
    var visible=comments.filter(function(c){return showResolved||!c.resolved;}).sort(function(a,b){return(a.createdAt?a.createdAt.seconds:0)-(b.createdAt?b.createdAt.seconds:0);});
    visible.forEach(function(c,i){
      var pin=document.createElement('div');
      pin.className='c-pin'+(c.resolved?' resolved':'');
      pin.style.left=c.x+'%';pin.style.top=c.y+'%';
      pin.innerHTML='<span class="c-pin-num">'+(i+1)+'</span>';
      pin.dataset.id=c.id;
      pin.addEventListener('click',function(e){e.stopPropagation();if(activePopupId===c.id){closeView();return;}closeView();closeInput();showView(c,pin,i+1);});
      overlay.appendChild(pin);
    });
    renderPanel(visible);
    document.getElementById('wf-count').textContent=comments.length+'件';
  }

  function showView(c,pin,num){
    activePopupId=c.id;
    var pr=pin.getBoundingClientRect();
    viewPopup=document.createElement('div');
    viewPopup.className='c-view-popup';
    viewPopup.style.cssText='position:fixed;left:'+Math.min(pr.right+8,window.innerWidth-320)+'px;top:'+Math.max(pr.top-40,60)+'px;z-index:10001;';
    var date=c.createdAt?new Date(c.createdAt.seconds*1000).toLocaleDateString('ja-JP'):'';
    viewPopup.innerHTML='<div class="c-view-popup-header"><span class="c-view-num">#'+num+' '+esc(c.name||'匿名')+'</span><div class="c-view-actions"><button class="c-view-btn edit">編集</button><button class="c-view-btn resolve">'+(c.resolved?'再開':'解決')+'</button><button class="c-view-btn delete">削除</button></div></div><div class="c-view-text" id="pvt-'+c.id+'">'+esc(c.text)+'</div>'+(c.resolved?'<span class="c-view-resolved-badge">✓ 解決済み</span>':'')+(date?'<div class="c-view-meta">'+date+'</div>':'');
    document.body.appendChild(viewPopup);
    viewPopup.querySelector('.edit').addEventListener('click',function(){startEditPopup(c,viewPopup);});
    viewPopup.querySelector('.resolve').addEventListener('click',function(){db.collection('comments').doc(PAGE_ID).collection('items').doc(c.id).update({resolved:!c.resolved});closeView();});
    viewPopup.querySelector('.delete').addEventListener('click',function(){if(!confirm('削除しますか？'))return;db.collection('comments').doc(PAGE_ID).collection('items').doc(c.id).delete();closeView();});
  }

  function startEditPopup(c,popup){
    var el=popup.querySelector('#pvt-'+c.id);
    el.outerHTML='<textarea class="c-edit-textarea" id="pve-'+c.id+'">'+esc(c.text)+'</textarea><div class="c-input-row" style="margin-top:8px"><button class="c-cancel-btn" id="ec-'+c.id+'">キャンセル</button><button class="c-send-btn" id="es-'+c.id+'">保存</button></div>';
    popup.querySelector('#ec-'+c.id).addEventListener('click',closeView);
    popup.querySelector('#es-'+c.id).addEventListener('click',function(){var t=popup.querySelector('#pve-'+c.id).value.trim();if(!t)return;db.collection('comments').doc(PAGE_ID).collection('items').doc(c.id).update({text:t});closeView();});
  }

  function renderPanel(visible){
    var list=document.getElementById('wf-panel-list');
    list.querySelectorAll('.panel-item').forEach(function(el){el.remove();});
    var empty=document.getElementById('wf-panel-empty');
    if(!visible.length){empty.style.display='block';return;}
    empty.style.display='none';
    visible.forEach(function(c,i){
      var item=document.createElement('div');
      item.className='panel-item'+(c.resolved?' resolved':'');
      item.innerHTML='<div class="panel-item-header"><div class="panel-num'+(c.resolved?' resolved':'')+'">'+( i+1)+'</div><span class="panel-name">'+esc(c.name||'匿名')+'</span></div><div class="panel-text" id="pt-'+c.id+'">'+esc(c.text)+'</div><div class="panel-actions"><button class="panel-edit-btn">編集</button><button class="panel-resolve-btn">'+(c.resolved?'再開':'解決')+'</button><button class="panel-delete-btn">削除</button></div>';
      item.querySelector('.panel-edit-btn').addEventListener('click',function(e){e.stopPropagation();startEditPanel(c,item);});
      item.querySelector('.panel-resolve-btn').addEventListener('click',function(e){e.stopPropagation();db.collection('comments').doc(PAGE_ID).collection('items').doc(c.id).update({resolved:!c.resolved});});
      item.querySelector('.panel-delete-btn').addEventListener('click',function(e){e.stopPropagation();if(!confirm('削除？'))return;db.collection('comments').doc(PAGE_ID).collection('items').doc(c.id).delete();});
      item.addEventListener('click',function(e){if(e.target.closest('button'))return;var pin=overlay.querySelector('.c-pin[data-id="'+c.id+'"]');if(pin){pin.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(function(){pin.click();},400);}});
      list.appendChild(item);
    });
  }

  function startEditPanel(c,item){
    var el=item.querySelector('#pt-'+c.id);
    el.outerHTML='<textarea class="c-edit-textarea" id="pe-'+c.id+'">'+esc(c.text)+'</textarea><div class="c-input-row" style="margin-top:6px"><button class="c-cancel-btn" id="pec-'+c.id+'">キャンセル</button><button class="c-send-btn" id="pes-'+c.id+'">保存</button></div>';
    item.querySelector('#pec-'+c.id).addEventListener('click',function(e){e.stopPropagation();renderPins();});
    item.querySelector('#pes-'+c.id).addEventListener('click',function(e){e.stopPropagation();var t=item.querySelector('#pe-'+c.id).value.trim();if(!t)return;db.collection('comments').doc(PAGE_ID).collection('items').doc(c.id).update({text:t});});
  }

  // ===== クロードに渡すモーダル =====
  function showClaudeModal(){
    var sorted=comments.slice().sort(function(a,b){return(a.createdAt?a.createdAt.seconds:0)-(b.createdAt?b.createdAt.seconds:0);});
    var open=sorted.filter(function(c){return!c.resolved;});
    var resolved=sorted.filter(function(c){return c.resolved;});
    var now=new Date();
    var dateStr=now.getFullYear()+'/'+(now.getMonth()+1)+'/'+(now.getDate())+' '+now.getHours()+':'+String(now.getMinutes()).padStart(2,'0');

    var lines=[];
    lines.push('【ONE ワイヤーフレーム コメントまとめ】');
    lines.push('ページ：'+PAGE_NAME);
    lines.push('出力日時：'+dateStr);
    lines.push('合計：'+comments.length+'件（未解決：'+open.length+'件 / 解決済み：'+resolved.length+'件）');
    lines.push('');

    if(open.length){
      lines.push('━━ 未解決コメント（'+open.length+'件） ━━');
      open.forEach(function(c,i){
        lines.push('');
        lines.push('#'+(i+1)+' 【'+esc2(c.name||'匿名')+'】');
        lines.push(esc2(c.text));
      });
    }

    if(resolved.length){
      lines.push('');
      lines.push('━━ 解決済みコメント（'+resolved.length+'件） ━━');
      resolved.forEach(function(c,i){
        lines.push('');
        lines.push('#'+(open.length+i+1)+' 【'+esc2(c.name||'匿名')+'】✓解決済み');
        lines.push(esc2(c.text));
      });
    }

    if(!comments.length){
      lines.push('（コメントはまだありません）');
    }

    var text=lines.join('\n');

    // モーダル
    var modal=document.createElement('div');
    modal.id='wf-claude-modal';
    modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:99999;display:flex;align-items:center;justify-content:center;';
    modal.innerHTML=
      '<div style="background:#1a1a1a;border:1px solid #333;border-radius:10px;padding:32px;width:90%;max-width:600px;max-height:80vh;display:flex;flex-direction:column;gap:16px;">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;">'+
          '<div style="font-size:14px;font-weight:bold;color:#fff;letter-spacing:0.1em;">📋 クロードに渡す</div>'+
          '<button id="wf-claude-close" style="background:none;border:none;color:#666;font-size:20px;cursor:pointer;line-height:1;">✕</button>'+
        '</div>'+
        '<div style="font-size:11px;color:#555;line-height:1.7;">以下のテキストをコピーして、クロードのチャットに貼り付けてください。<br>「このコメントを元にワイヤーを修正して」と一言添えるだけでOKです。</div>'+
        '<textarea id="wf-claude-text" style="flex:1;min-height:240px;background:#111;border:1px solid #333;border-radius:6px;color:#ccc;font-size:12px;padding:14px;line-height:1.8;font-family:monospace;resize:vertical;outline:none;" readonly>'+escHtml(text)+'</textarea>'+
        '<div style="display:flex;gap:10px;">'+
          '<button id="wf-claude-copy" style="flex:1;background:#2563eb;border:none;color:#fff;padding:12px;border-radius:6px;font-size:13px;cursor:pointer;font-family:inherit;letter-spacing:0.1em;">コピーする</button>'+
          '<button id="wf-claude-close2" style="background:#333;border:none;color:#aaa;padding:12px 20px;border-radius:6px;font-size:13px;cursor:pointer;font-family:inherit;">閉じる</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(modal);

    modal.addEventListener('click',function(e){if(e.target===modal)modal.remove();});
    document.getElementById('wf-claude-close').addEventListener('click',function(){modal.remove();});
    document.getElementById('wf-claude-close2').addEventListener('click',function(){modal.remove();});

    // テキスト全選択
    var ta=document.getElementById('wf-claude-text');
    ta.addEventListener('focus',function(){this.select();});

    document.getElementById('wf-claude-copy').addEventListener('click',function(){
      ta.select();
      try{
        navigator.clipboard.writeText(text).then(function(){
          document.getElementById('wf-claude-copy').textContent='✓ コピーしました！';
          document.getElementById('wf-claude-copy').style.background='#059669';
          setTimeout(function(){
            if(document.getElementById('wf-claude-copy')){
              document.getElementById('wf-claude-copy').textContent='コピーする';
              document.getElementById('wf-claude-copy').style.background='#2563eb';
            }
          },2000);
        });
      }catch(err){
        document.execCommand('copy');
        document.getElementById('wf-claude-copy').textContent='✓ コピーしました！';
        document.getElementById('wf-claude-copy').style.background='#059669';
      }
    });
  }

  // Firebase リアルタイム購読
  db.collection('comments').doc(PAGE_ID).collection('items').onSnapshot(function(snap){
    comments=snap.docs.map(function(doc){var d=doc.data();d.id=doc.id;return d;});
    renderPins();
  },function(err){console.error(err);});

  document.addEventListener('click',function(e){
    if(viewPopup&&!e.target.closest('.c-view-popup')&&!e.target.closest('.c-pin'))closeView();
  });

  function closeInput(){if(inputPopup){inputPopup.remove();inputPopup=null;}}
  function closeView(){if(viewPopup){viewPopup.remove();viewPopup=null;}activePopupId=null;}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function esc2(s){return String(s);}
  function escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
})();
