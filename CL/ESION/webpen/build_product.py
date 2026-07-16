#!/usr/bin/env python3
# ESION 商品詳細ページ（PC）ビルド
# 使い方: python3 build_product.py （product-export.html を読む → product.html を出力）
# 挙動: 画像圧縮(a/)・幅いっぱいにzoom・左画像スティッキー固定・メイン画像ふわっとクロスフェード
#       ・サムネのアクティブふわふわ＆切替・カード横スライド・ネイビーテキスト#002677・パスワード保護
import re,urllib.parse,os,subprocess

SRC='product-export.html'
OUT='product.html'
ALPHA=['KV2_0001','esionLOGO']

def compress(s):
    for u in set(re.findall(r"url\('([^']+)'\)",s)):
        if u.startswith('data:'):continue
        fn=urllib.parse.unquote(u);stem=re.sub(r'[^A-Za-z0-9._-]','_',os.path.basename(fn))
        if any(k in fn for k in ALPHA): out='a/'+stem
        else: out='a/'+re.sub(r'\.(png|jpg|jpeg|PNG|JPG)$','',stem)+'.jpg'
        if not os.path.exists(out) and os.path.exists(fn):
            if any(k in fn for k in ALPHA): subprocess.run(['sips','-Z','1000',fn,'--out',out],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
            else: subprocess.run(['sips','-s','format','jpeg','-s','formatOptions','80','-Z','2000',fn,'--out',out],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        s=s.replace("url('%s')"%u,"url('%s')"%out.replace(' ','%20'))
    return s

def navy_text(s):
    s=re.sub(r'(color:\s*)#081[Bb]52',r'\g<1>#002677',s)
    s=re.sub(r'(color:\s*)#071[Cc]52([Ff]{2})?',r'\g<1>#002677',s)
    return s

s=compress(open(SRC).read())
body=re.search(r'<body>(.*)</body>',s,re.S).group(1)
body=body.replace('data-pencil-name="ESION 商品詳細 PC"','id="pdpRoot" data-pencil-name="ESION 商品詳細 PC"',1)
body=navy_text(body)

css='''
<style>
html,body{margin:0;background:#fff;overflow-x:hidden;}
#pdpRoot{position:relative!important;overflow:visible!important;transform-origin:top left;}
[data-pencil-name="left-fixed"]{overflow:visible!important;}
/* 左画像＝完全固定（position:fixed・カクつき無し）。右だけスクロール */
[data-pencil-name="photo-mask"]{position:fixed!important;top:0!important;left:0!important;z-index:1;}
/* 全幅セクションは固定画像の上に重ねてスクロールで覆う */
[data-pencil-name="Voices"],[data-pencil-name="こだわりバナー"],[data-pencil-name="Footer"]{z-index:3;}
/* ヘッダー＝固定（ロゴ・メニュー）。白帯なし・透明 */
[data-pencil-name="Header"]{position:fixed!important;top:0!important;left:0!important;z-index:20;background:transparent!important;}
[data-pencil-name="thumbs"]{top:auto!important;bottom:40px!important;z-index:6;}
/* サムネ：クリック可（跳ねる動作なし） */
[data-pencil-name="thumbs"]>div{cursor:pointer;transition:opacity .5s ease;}
/* カード横スライド */
[data-pencil-name="cardrow"]{cursor:grab;will-change:transform;}
[data-pencil-name="cardrow"].grab{cursor:grabbing;}
[data-pencil-name="btn"],[data-pencil-name="cart"],[data-pencil-name="buy"],[data-pencil-name="こだわりバナー"]{cursor:pointer;}
</style>'''

js='''
<script>
(function(){
 var root=document.getElementById('pdpRoot');
 var S=1;
 var mask=document.querySelector('[data-pencil-name="photo-mask"]');
 function z(){ S=window.innerWidth/1199; root.style.zoom=S; if(mask){ mask.style.width='600px'; mask.style.height=(window.innerHeight/S)+'px'; } }
 window.addEventListener('resize',z); z();

 // ---- 左メイン画像 ふわっとクロスフェード ＋ サムネ切替 ----
 var thumbs=[].slice.call(document.querySelectorAll('[data-pencil-name="thumbs"] > div'));
 var main=null;
 [].slice.call(mask.children).forEach(function(c){ if(c.style.backgroundImage && c.getAttribute('data-pencil-name')!=='thumbs' && !main){ main=c; } });
 function baseUrl(el){ var m=el.style.backgroundImage.match(/url\\((["']?)([^"')]+)\\1\\)/g)||[]; if(!m.length)return ''; var last=m[m.length-1]; return last.match(/url\\((["']?)([^"')]+)/)[2]; }
 var gallery=thumbs.map(baseUrl);
 var cur=0, timer;
 function setActive(i){
   thumbs.forEach(function(t,j){
     var u=gallery[j];
     t.style.backgroundImage = (j===i) ? "url('"+u+"')" : "linear-gradient(#FFFFFFB3, #FFFFFFB3), url('"+u+"')";
     t.classList.toggle('active', j===i);
   });
 }
 // 2枚のレイヤーを交互にクロスフェード（初期ズレ・逆戻りが起きない堅牢方式）
 var layers=[], vis=0;
 if(main){
   main.style.left='0';main.style.top='0';main.style.width='100%';main.style.height='100%';
   main.style.zIndex='1';main.style.transition='opacity .9s ease';main.style.opacity='1';
   if(gallery[0]) main.style.backgroundImage="url('"+gallery[0]+"')";
   var L2=main.cloneNode(false); L2.removeAttribute('data-pencil-name');
   L2.style.left='0';L2.style.top='0';L2.style.width='100%';L2.style.height='100%';
   L2.style.zIndex='1';L2.style.transition='opacity .9s ease';L2.style.opacity='0';L2.style.pointerEvents='none';
   main.parentNode.insertBefore(L2, main.nextSibling);
   layers=[main,L2];
 }
 function show(i){
   if(i===cur||!layers.length)return;
   cur=i;
   var hidden=layers[1-vis];
   hidden.style.backgroundImage="url('"+gallery[i]+"')";
   hidden.style.opacity='1';
   layers[vis].style.opacity='0';
   vis=1-vis;
   setActive(i);
 }
 function tick(){ show((cur+1)%gallery.length); }
 function restart(){ clearInterval(timer); timer=setInterval(tick,5000); }
 thumbs.forEach(function(t,i){ t.addEventListener('click',function(){ show(i); restart(); }); });
 if(gallery.length){ setActive(0); restart(); }

 // ---- カード横スライド（ドラッグ） ----
 var row=document.querySelector('[data-pencil-name="cardrow"]');
 if(row){
   var down=false,sx=0,base=0,tx=0,moved=false;
   function maxT(){ return Math.min(0, (1199-72-40) - row.scrollWidth); }
   function setT(v){ tx=Math.max(maxT(),Math.min(0,v)); row.style.transform='translateX('+tx+'px)'; }
   row.addEventListener('pointerdown',function(e){ down=true;moved=false;sx=e.clientX;base=tx;row.classList.add('grab');row.style.transition='none';row.setPointerCapture(e.pointerId); });
   row.addEventListener('pointermove',function(e){ if(!down)return; var d=(e.clientX-sx)/(root.style.zoom||1); if(Math.abs(d)>4)moved=true; setT(base+d); });
   function up(){ down=false;row.classList.remove('grab');row.style.transition='transform .3s ease'; }
   row.addEventListener('pointerup',up); row.addEventListener('pointercancel',up);
   row.addEventListener('click',function(e){ if(moved){e.preventDefault();e.stopPropagation();} },true);
   row.addEventListener('wheel',function(e){ if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){ e.preventDefault(); setT(tx-e.deltaX); } },{passive:false});
 }
})();
</script>'''

pw='''
<div id="pw-lock" style="position:fixed;inset:0;background:#002677;display:flex;align-items:center;justify-content:center;z-index:99999;font-family:'Zen Kaku Gothic New',sans-serif;">
  <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;letter-spacing:.15em;color:#fff;font-weight:600;">ESION</div>
    <input id="pw-input" type="password" placeholder="PASSWORD" autofocus
      style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.25);border-radius:6px;padding:13px 16px;font-size:16px;color:#fff;width:240px;text-align:center;letter-spacing:.1em;outline:none;"
      onkeydown="if(event.key==='Enter')pwCheck()">
    <button onclick="pwCheck()" style="background:#fff;color:#002677;border:none;border-radius:100px;padding:12px 0;width:240px;font-size:13px;font-weight:700;letter-spacing:.15em;cursor:pointer;">ENTER</button>
    <div id="pw-error" style="font-size:12px;color:#ff9b9b;display:none;">パスワードが違います</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:.3em;color:rgba(255,255,255,.4);">CRATER INC.</div>
  </div>
</div>
<script>
(function(){if(sessionStorage.getItem('cv_auth')==='1'){document.getElementById('pw-lock').style.display='none';}})();
function pwCheck(){if(document.getElementById('pw-input').value==='view'){document.getElementById('pw-lock').style.display='none';sessionStorage.setItem('cv_auth','1');}else{document.getElementById('pw-error').style.display='block';}}
</script>'''

head='''<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ESION｜商品詳細</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Hina+Mincho&family=Jost:wght@100..900&family=Playfair+Display:wght@400..900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>*,::before,::after{box-sizing:border-box;}body{margin:0;}</style>'''

out=head+css+'''
  </head>
  <body>
'''+pw+'''
'''+body+js+'''
  </body>
</html>'''
open(OUT,'w').write(out)
print('built',OUT,len(out),'bytes')
