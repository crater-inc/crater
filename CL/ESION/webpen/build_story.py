#!/usr/bin/env python3
# ESION 誕生秘話（グレー版）ビルド：story-export.html + story-export-sp.html → story.html
# レスポンシブ1ファイル版（build.pyと同方式）：PC=zoom追従(1199基準) / SP=縦1カラムzoom追従(390基準)
# パスワードゲート・フッターリンク・コメント機能(review.js)は共通
# 使い方: python3 build_story.py
import re, urllib.parse, os, subprocess

PC = 'story-export.html'
SP = 'story-export-sp.html'
ALPHA = ['esionLOGO']  # 透過ロゴはpng維持

# 画像を a/ の圧縮版へパス差し替え（build.pyと同方式）。
# 日本語ファイル名はexportがNFD(分解形)でURLエンコードするが、GitHub上の登録名はNFC＝
# バイト不一致で404になる。ASCII名(a/)に逃がして正規化ズレを根絶する。
def compress(s):
    for u in set(re.findall(r"url\('([^']+)'\)", s)):
        if u.startswith('data:'):
            continue
        fn = urllib.parse.unquote(u)
        stem = re.sub(r'[^A-Za-z0-9._-]', '_', os.path.basename(fn))
        if any(k in fn for k in ALPHA):
            out = 'a/' + stem
        else:
            out = 'a/' + re.sub(r'\.(png|jpg|jpeg|PNG|JPG)$', '', stem) + '.jpg'
        if not os.path.exists(out) and os.path.exists(fn):
            if any(k in fn for k in ALPHA):
                subprocess.run(['sips', '-Z', '1000', fn, '--out', out],
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '-Z', '2000', fn, '--out', out],
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        s = s.replace("url('%s')" % u, "url('%s')" % out.replace(' ', '%20'))
    return s

def body_inner(s):
    return re.search(r'<body>(.*)</body>', s, re.S).group(1)

# ネイビーのテキスト色を $c-navy-deep（#081B52）に統一（テキストのcolor:のみ）
def navy_text(s):
    s = re.sub(r'(color:\s*)#002677([Ff]{2})?', r'\g<1>#081B52', s)
    s = re.sub(r'(color:\s*)#071[Cc]52([Ff]{2})?', r'\g<1>#081B52', s)
    return s

# コンテンツ幅ガイド（📏 guide-L / guide-R）は本番に不要なので除去
def strip_guides(s):
    return re.sub(
        r'<div\s+data-pencil-name="📏 guide[^"]*"\s+style="[^"]*"\s*></div>\s*',
        '', s)

pc = compress(open(PC).read())
sp = compress(open(SP).read())

# PC body（ルート＝bodyの最初のdivに id="storyRoot"。フレーム名非依存＝Pencilで改名されても壊れない）
pcb = navy_text(strip_guides(body_inner(pc)))
pcb = re.sub(r'<div\b', '<div id="storyRoot"', pcb, 1)

# SP body（同様にルートへ id="spStoryRoot"）
spb = navy_text(strip_guides(body_inner(sp)))
spb = re.sub(r'<div\b', '<div id="spStoryRoot"', spb, 1)

head = '''<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ESION｜誕生秘話</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Hina+Mincho&family=Jost:wght@100..900&family=Playfair+Display:wght@400..900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>*,::before,::after{box-sizing:border-box;}body{margin:0;}</style>'''

css = '''
<style>
html,body{margin:0;background:#fff;overflow-x:hidden;}
#storyRoot,#spStoryRoot{position:relative;transform-origin:top left;}
.lyt-sp{display:none;}
@media (max-width:768px){ .lyt-pc{display:none;} .lyt-sp{display:block;} }
/* SP ハンバーガーメニュー（トップと同じ全面ネイビー・フェード） */
#sp-menu{display:none;}
@media (max-width:768px){
 #sp-menu{display:flex;position:fixed;inset:0;z-index:4900;flex-direction:column;justify-content:center;align-items:flex-start;background:linear-gradient(135deg,#071b52 0%,#0d41a8 100%);opacity:0;visibility:hidden;transition:opacity .5s ease,visibility .5s ease;padding:0 44px;}
 #sp-menu.open{opacity:1;visibility:visible;}
 #sp-close{position:absolute;top:16px;right:18px;width:44px;height:44px;background:none;border:none;cursor:pointer;}
 #sp-close span{position:absolute;top:50%;left:50%;width:26px;height:2px;background:#fff;border-radius:2px;}
 #sp-close span:nth-child(1){transform:translate(-50%,-50%) rotate(45deg);}
 #sp-close span:nth-child(2){transform:translate(-50%,-50%) rotate(-45deg);}
 #sp-menu nav{display:flex;flex-direction:column;gap:24px;width:100%;}
 #sp-menu nav a{display:flex;flex-direction:column;gap:3px;text-decoration:none;cursor:pointer;opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;}
 #sp-menu.open nav a{opacity:1;transform:none;}
 #sp-menu nav a em{font-family:'Barlow Condensed',sans-serif;font-style:normal;font-weight:600;font-size:29px;letter-spacing:.05em;color:#fff;line-height:1;}
 #sp-menu nav a i{font-family:'Zen Kaku Gothic New',sans-serif;font-style:normal;font-size:11.5px;letter-spacing:.08em;color:#9FB6CC;}
 #sp-menu.open nav a:nth-child(1){transition-delay:.10s}
 #sp-menu.open nav a:nth-child(2){transition-delay:.15s}
 #sp-menu.open nav a:nth-child(3){transition-delay:.20s}
 #sp-menu.open nav a:nth-child(4){transition-delay:.25s}
 #sp-menu.open nav a:nth-child(5){transition-delay:.30s}
}
</style>'''

# PC用JS（storyRoot=zoom拡大。1199基準／パネル開でrvPanelOpen分300px引く＝コメント機能と連動）
jspc = '''
<script>
(function(){
 var root=document.getElementById('storyRoot');if(!root)return;
 function z(){root.style.zoom=(window.innerWidth-((window.rvPanelOpen&&window.innerWidth>768)?300:0))/1199;}
 window.addEventListener('resize',z);window.addEventListener('load',z);z();
})();
</script>'''

# SP用JS（spStoryRoot=zoom拡大。390基準）
jssp = '''
<script>
(function(){
 var root=document.getElementById('spStoryRoot');if(!root)return;
 function z(){root.style.zoom=window.innerWidth/390;}
 window.addEventListener('resize',z);window.addEventListener('load',z);z();
})();
</script>'''

# SP ハンバーガーメニュー（誕生秘話ページ用：主要ページへのリンク）
spmenu = '''
<div id="sp-menu">
  <button id="sp-close" aria-label="閉じる" onclick="spMenu(0)"><span></span><span></span></button>
  <nav>
    <a href="index.html"><em>LINEUP</em><i>商品ラインナップ</i></a>
    <a href="kodawari.html"><em>COMMITMENT</em><i>こだわり</i></a>
    <a href="story.html"><em>STORY</em><i>誕生秘話</i></a>
    <a href="index.html#FAQ"><em>FAQ</em><i>よくある質問</i></a>
    <a href="index.html#Contact"><em>CONTACT</em><i>お問い合わせ</i></a>
  </nav>
</div>
<script>
function spMenu(o){var m=document.getElementById('sp-menu');if(o){m.classList.add('open');document.body.style.overflow='hidden';}else{m.classList.remove('open');document.body.style.overflow='';}}
document.querySelectorAll('.lyt-sp [data-icon-name="menu"]').forEach(function(b){b.style.cursor='pointer';b.addEventListener('click',function(){spMenu(1);});});
</script>'''

# パスワード保護（クライアント共有用: view / sessionStorage）※トップ・商品詳細と共通
pw = '''
<div id="pw-lock" style="position:fixed;inset:0;background:#071C52;display:flex;align-items:center;justify-content:center;z-index:99999;font-family:'Zen Kaku Gothic New',sans-serif;">
  <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;letter-spacing:.15em;color:#fff;font-weight:600;">ESION</div>
    <input id="pw-input" type="password" placeholder="PASSWORD" autofocus
      style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.25);border-radius:6px;padding:13px 16px;font-size:16px;color:#fff;width:240px;text-align:center;letter-spacing:.1em;outline:none;"
      onkeydown="if(event.key==='Enter')pwCheck()">
    <button onclick="pwCheck()" style="background:#fff;color:#071C52;border:none;border-radius:100px;padding:12px 0;width:240px;font-size:13px;font-weight:700;letter-spacing:.15em;cursor:pointer;">ENTER</button>
    <div id="pw-error" style="font-size:12px;color:#ff9b9b;display:none;">パスワードが違います</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:.3em;color:rgba(255,255,255,.4);">CRATER INC.</div>
  </div>
</div>
<script>
(function(){if(sessionStorage.getItem('cv_auth')==='1'){document.getElementById('pw-lock').style.display='none';}})();
function pwCheck(){if(document.getElementById('pw-input').value==='view'){document.getElementById('pw-lock').style.display='none';sessionStorage.setItem('cv_auth','1');}else{document.getElementById('pw-error').style.display='block';}}
</script>'''

# フッターの各リンク項目を<a href="#">で包む（全部#仮リンク・ホバー付き）※トップと共通・PC/SP両方に効く
flinks = '''<style>.esion-flink{cursor:pointer;text-decoration:none;color:inherit;display:block;transition:opacity .2s;}.esion-flink:hover{opacity:.6;}</style>
<script>(function(){['PRODUCTS','MEMBER','SERVICE','ABOUT'].forEach(function(cn){document.querySelectorAll('[data-pencil-name="'+cn+'"]').forEach(function(col){Array.prototype.slice.call(col.children).slice(1).forEach(function(item){if(item.closest('a'))return;var a=document.createElement('a');a.className='esion-flink';a.href='#';item.parentNode.insertBefore(a,item);a.appendChild(item);});});});})();</script>'''

navlinks = '''<script>(function(){
 var MAP={"PRODUCTS":"product.html","COMMITMENT":"kodawari.html","STORY":"story.html"};
 document.querySelectorAll('[data-pencil-name="Nav"] > [data-pencil-name]').forEach(function(el){
   var t=(el.textContent||"").trim(); var href=MAP[t]; if(!href) return;
   if(el.closest("a")) return;
   var a=document.createElement("a"); a.href=href; a.style.cssText="text-decoration:none;color:inherit;cursor:pointer;";
   el.parentNode.insertBefore(a,el); a.appendChild(el);
 });
})();</script>'''

# 写真要素（background-size:coverの実写・生成画像）にスクロール連動パララックスを付与。
# scrim/overlay等の色調補正レイヤーやロゴ等の小要素は対象外。
# background-size/positionを毎フレーム書き換える方式は、細かい泡等の高周波テクスチャの
# 写真で再デコードが間に合わずモアレ状の乱れが出ることがあったため使わない。
# 実画像の縦横比からbackground-sizeを一度だけpx指定で拡大（歪みなし）しておき、
# スクロールでは既に描画済みのレイヤーをtransform:translateYで動かすだけにする
# （GPU合成のみで完結し再デコードが走らないため乱れない）。
parallax = '''
<script>
(function(){
 function ready(fn){if(document.readyState!=="loading")fn();else document.addEventListener("DOMContentLoaded",fn);}
 ready(function(){
  var ZOOM=1.35,items=[];
  function resize(it){
   var cw=it.el.offsetWidth,ch=it.el.offsetHeight;
   if(!cw||!ch)return;
   var scale=Math.max(cw/it.iw,ch/it.ih)*ZOOM;
   it.el.style.backgroundSize=(it.iw*scale).toFixed(1)+'px '+(it.ih*scale).toFixed(1)+'px';
   it.maxShift=ch*(ZOOM-1)/2*0.85;
  }
  document.querySelectorAll('div[style*="background-size: cover"]').forEach(function(el){
   var st=el.getAttribute('style')||'';
   if(st.indexOf('mix-blend-mode')!==-1)return;
   if(st.indexOf('rotate(')!==-1)return;
   if(el.offsetHeight<100)return;
   var m=st.match(/background-image:\\s*url\\('([^']+)'\\)/);
   if(!m)return;
   var img=new Image();
   img.onload=function(){
    if(!img.naturalWidth||!img.naturalHeight)return;
    var base=el.style.transform||'';
    var it={el:el,iw:img.naturalWidth,ih:img.naturalHeight,maxShift:0,base:base};
    el.style.willChange='transform';
    items.push(it);
    resize(it);
    update();
   };
   img.src=m[1];
  });
  var ticking=false;
  function update(){
   var vh=window.innerHeight;
   items.forEach(function(it){
    var r=it.el.getBoundingClientRect();
    if(r.height<=0)return;
    var progress=(vh-r.top)/(vh+r.height);
    if(progress<0)progress=0;if(progress>1)progress=1;
    var shift=(progress-0.5)*2*it.maxShift;
    it.el.style.transform=(it.base?it.base+' ':'')+'translateY('+shift.toFixed(1)+'px)';
   });
   ticking=false;
  }
  function onScroll(){if(!ticking){ticking=true;window.requestAnimationFrame(update);}}
  function onResize(){items.forEach(resize);update();}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onResize);
 });
})();
</script>'''

out = head + css + '''
  </head>
  <body>
''' + pw + '''
    <div class="lyt-pc">''' + pcb + '''</div>
    <div class="lyt-sp">''' + spb + '''</div>
''' + spmenu + jspc + jssp + flinks + navlinks + parallax + '''
<script src="/comment.js"></script>
  </body>
</html>'''

open('story.html', 'w').write(out)
print('built story.html', len(out), 'bytes')
