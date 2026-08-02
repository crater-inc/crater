#!/usr/bin/env python3
# ESION こだわりページ ビルド：kodawari-export.html → kodawari.html
# 静的1カラム・zoom追従（innerWidth/1199）・パスワードゲート・フッターリンク・CTAボタンリンク・コメント機能(review.js)
# 使い方: python3 build_kodawari.py
import re, urllib.parse, os, subprocess

SRC = 'kodawari-export.html'
ALPHA = ['esionLOGO']  # 透過ロゴはpng維持

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

s = open(SRC).read()
body = re.search(r'<body>(.*)</body>', s, re.S).group(1)
body = compress(body)

body = re.sub(r'<div\b', '<div id="kodawariRoot"', body, 1)

head = '''<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ESION｜こだわり</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Hina+Mincho&family=Jost:wght@100..900&family=Playfair+Display:wght@400..900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>*,::before,::after{box-sizing:border-box;}body{margin:0;}</style>'''

css = '''
<style>
html,body{margin:0;background:#fff;overflow-x:hidden;}
#kodawariRoot{position:relative;transform-origin:top left;}
[data-pencil-name="btn-product"],[data-pencil-name="btn-story"]{cursor:pointer;}

/* ---- SP（〜768px）：zoom縮小をやめて実レイアウトを1カラムに再フロー ---- */
#sp-hamburger{display:none;}
@media (max-width:768px){
  #kodawariRoot{width:100% !important;}

  /* バンド共通の左右余白をSP用に詰める */
  [data-pencil-name="Hero"],[data-pencil-name="Intro"],[data-pencil-name="ProductDesign"],
  [data-pencil-name^="Commitment"],[data-pencil-name="DailyLife"],[data-pencil-name="CTA"]
  { padding:56px 24px !important; }

  /* 固定px幅のテキスト・コンテナを親幅いっぱいに解放 */
  [data-pencil-name="Hero"] [data-pencil-name="eyebrow"],
  [data-pencil-name="Hero"] [data-pencil-name="title"],
  [data-pencil-name="Hero"] [data-pencil-name="lead"],
  [data-pencil-name="Hero"] [data-pencil-name="body"],
  [data-pencil-name="Intro"] [data-pencil-name="p"],
  [data-pencil-name="Intro"] [data-pencil-name="emph"],
  [data-pencil-name="ProductDesign"] [data-pencil-name="body"],
  [data-pencil-name^="Commitment"] [data-pencil-name="ttl"],
  [data-pencil-name^="Commitment"] [data-pencil-name="intro"],
  [data-pencil-name^="Commitment"] [data-pencil-name="body"] [data-pencil-name="p"],
  [data-pencil-name^="Commitment"] [data-pencil-name="closing"],
  [data-pencil-name="DailyLife"] [data-pencil-name="ttl"],
  [data-pencil-name="DailyLife"] [data-pencil-name="intro"],
  [data-pencil-name="DailyLife"] [data-pencil-name="list"] [data-pencil-name="t"],
  [data-pencil-name="CTA"] [data-pencil-name="ttl"],
  [data-pencil-name="CTA"] [data-pencil-name="body"]
  { width:100% !important; height:auto !important; white-space:normal !important; }

  /* Heroはlayout:noneの絶対配置なのでcontentのleftオフセットも詰める（後勝ちさせるため一番下に置く） */
  [data-pencil-name="Hero"] [data-pencil-name="content"]
  { left:24px !important; width:calc(100% - 48px) !important; height:auto !important; }

  [data-pencil-name="Hero"] [data-pencil-name="title"]{ font-size:38px !important; letter-spacing:1px !important; }
  [data-pencil-name="Intro"] [data-pencil-name="emph"]{ font-size:19px !important; }
  [data-pencil-name^="Commitment"] [data-pencil-name="ttl"]{ font-size:22px !important; }
  [data-pencil-name="DailyLife"] [data-pencil-name="ttl"]{ font-size:24px !important; }
  [data-pencil-name="CTA"] [data-pencil-name="ttl"]{ font-size:24px !important; }

  /* 3カラムのカード・アイテムグリッドは縦積みに */
  [data-pencil-name="grid"]{ flex-direction:column !important; gap:28px !important; }

  /* CTAボタンは縦積み・全幅 */
  [data-pencil-name="btns"]{ flex-direction:column !important; width:100% !important; }
  [data-pencil-name="btn-product"],[data-pencil-name="btn-story"]
  { width:100% !important; justify-content:center !important; }
  [data-pencil-name="CTA"] [data-pencil-name="note"]{ width:100% !important; }

  /* 13の無添加タグ：はみ出さずに折り返す */
  [data-pencil-name="tagrow"]{ flex-wrap:wrap !important; row-gap:10px !important; }

  /* 全成分テーブル：横スクロールにせず、行ごとに縦積みカード化（役割列が消えないように） */
  [data-pencil-name="Commitment05"] [data-pencil-name="headrow"]{ display:none !important; }
  [data-pencil-name="Commitment05"] [data-pencil-name="cells"]{
    flex-direction:column !important; align-items:flex-start !important; gap:4px !important;
  }
  [data-pencil-name="Commitment05"] [data-pencil-name="cat"],
  [data-pencil-name="Commitment05"] [data-pencil-name="num"],
  [data-pencil-name="Commitment05"] [data-pencil-name="role"]
  { width:100% !important; }
  [data-pencil-name="Commitment05"] [data-pencil-name="num"]{ color:#0D41A8 !important; font-weight:700 !important; font-size:12px !important; }

  /* フッター：絶対配置(1199px前提)を解いて縦積み・2×2カラムに再構成 */
  [data-pencil-name="Footer"]{
    display:flex !important; flex-direction:column !important;
    width:100% !important; height:auto !important; overflow:visible !important;
    padding:48px 24px 32px !important; position:relative !important;
  }
  [data-pencil-name="Footer"] > div{ position:static !important; left:auto !important; top:auto !important; }
  [data-pencil-name="Footer"] [data-pencil-name="logo"]{ order:1; margin-bottom:14px; }
  [data-pencil-name="Footer"] [data-pencil-name="catch"]{ order:2; width:100% !important; margin-bottom:28px; }
  [data-pencil-name="Footer"] [data-pencil-name="cols"]{ order:3; flex-wrap:wrap !important; gap:28px 24px !important; width:100% !important; margin-bottom:32px; }
  [data-pencil-name="Footer"] [data-pencil-name="cols"] > div{ width:calc(50% - 12px) !important; }
  [data-pencil-name="Footer"] [data-pencil-name="social"]{ order:4; margin-bottom:28px; }
  [data-pencil-name="Footer"] [data-pencil-name="line"]{ order:5; width:100% !important; margin-bottom:16px; }
  [data-pencil-name="Footer"] [data-pencil-name="copy"]{ order:6; }

  /* ヘッダー：ナビ文字列と検索/ユーザーアイコンは畳み、ハンバーガーのみ表示 */
  [data-pencil-name="Header"]{ padding:0 24px !important; }
  [data-pencil-name="Nav"],
  [data-pencil-name="H-Right"] [data-icon-name="search"],
  [data-pencil-name="H-Right"] [data-icon-name="user"]
  { display:none !important; }
  #sp-hamburger{
    display:flex !important;align-items:center;justify-content:center;
    width:24px;height:24px;cursor:pointer;
  }
  #sp-hamburger span{position:relative;width:20px;height:2px;background:#fff;}
  #sp-hamburger span::before,#sp-hamburger span::after{content:"";position:absolute;left:0;width:20px;height:2px;background:#fff;}
  #sp-hamburger span::before{top:-6px;}
  #sp-hamburger span::after{top:6px;}

  #sp-nav-drawer{
    position:fixed;inset:0;z-index:5000;
    background:linear-gradient(135deg,#071b52 0%,#0d41a8 100%);
    display:flex;flex-direction:column;justify-content:center;padding:0 40px;
    opacity:0;visibility:hidden;transition:opacity .4s ease,visibility .4s ease;
  }
  #sp-nav-drawer.open{opacity:1;visibility:visible;}
  #sp-nav-close{position:absolute;top:20px;right:24px;width:40px;height:40px;background:none;border:none;cursor:pointer;}
  #sp-nav-close span{position:absolute;top:50%;left:50%;width:22px;height:2px;background:#fff;}
  #sp-nav-close span:nth-child(1){transform:translate(-50%,-50%) rotate(45deg);}
  #sp-nav-close span:nth-child(2){transform:translate(-50%,-50%) rotate(-45deg);}
  #sp-nav-drawer a{
    display:block;padding:14px 0;font-family:'Barlow Condensed',sans-serif;
    font-size:26px;letter-spacing:.05em;color:#fff;text-decoration:none;font-weight:600;
    border-bottom:1px solid rgba(255,255,255,.15);
  }
}
</style>'''

zoomjs = '''
<script>
(function(){
 var root=document.getElementById('kodawariRoot');if(!root)return;
 function z(){
   if(window.innerWidth<=768){ root.style.zoom=1; return; }
   root.style.zoom=(window.innerWidth-((window.rvPanelOpen&&window.innerWidth>768)?300:0))/1199;
 }
 window.addEventListener('resize',z);window.addEventListener('load',z);z();
})();
</script>'''

spnavjs = '''
<script>
(function(){
 var hr=document.querySelector('[data-pencil-name="H-Right"]');
 if(!hr)return;
 var btn=document.createElement('div'); btn.id='sp-hamburger'; btn.innerHTML='<span></span>';
 hr.appendChild(btn);
 var drawer=document.createElement('div'); drawer.id='sp-nav-drawer';
 drawer.innerHTML='<button id="sp-nav-close" aria-label="閉じる"><span></span><span></span></button>'+
   '<a href="product.html">PRODUCTS</a>'+
   '<a href="kodawari.html">COMMITMENT</a>'+
   '<a href="story.html">STORY</a>';
 document.body.appendChild(drawer);
 btn.addEventListener('click',function(){drawer.classList.add('open');document.body.style.overflow='hidden';});
 drawer.querySelector('#sp-nav-close').addEventListener('click',function(){drawer.classList.remove('open');document.body.style.overflow='';});
})();
</script>'''

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

# フッターの各リンク項目を<a href="#">で包む（全部#仮リンク・ホバー付き）※他ページと共通
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

# CTAボタン（エシオンを見る／誕生秘話を読む）のリンク化
ctalinks = '''<script>(function(){
 var btns={"btn-product":"product.html","btn-story":"story.html"};
 Object.keys(btns).forEach(function(name){
  var el=document.querySelector('[data-pencil-name="'+name+'"]');
  if(!el||el.closest("a"))return;
  var a=document.createElement("a"); a.href=btns[name]; a.style.cssText="text-decoration:none;color:inherit;";
  el.parentNode.insertBefore(a,el); a.appendChild(el);
 });
})();</script>'''

out = head + css + '''
  </head>
  <body>
''' + pw + '''
''' + body + zoomjs + spnavjs + flinks + navlinks + ctalinks + '''
<script src="/comment.js"></script>
  </body>
</html>'''

open('kodawari.html', 'w').write(out)
print('built kodawari.html', len(out), 'bytes')
