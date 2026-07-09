#!/usr/bin/env python3
# ESIONトップ ビルド（レスポンシブ1ファイル版）
# 使い方: python3 build.py        （pc-export.html と sp-export.html を読む）
# 挙動: 画像圧縮(a/)・PC=zoom拡大+パララックス・SP=縦1カラム(zoom)・KVズーム・ボトル浮遊・FAQアコーディオン・フェード(PCのみ)
import re,urllib.parse,os,subprocess,sys

PC='pc-export.html'
SP='sp-export.html'
ALPHA=['KV2_0001','esionLOGO']  # 透過必要→png維持

def compress(s):
    # 画像を a/ へ圧縮＆パス差し替え（PC/SPで共有・既存はスキップ）
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

def body_inner(s):
    return re.search(r'<body>(.*)</body>',s,re.S).group(1)

# KV=kvzoom / ボトル=bottle クラス付与
def tag_media(s):
    def tag(m):
        t=m.group(0);mm=re.search(r"url\('([^']+)'\)",t)
        if not mm:return t
        u=mm.group(1)
        c='kvzoom' if 'Image_6' in u or 'Image%206' in u else ('bottle' if 'KV2_0001' in u else None)
        if c: t=t.replace('<div','<div class="%s"'%c,1) if 'class="' not in t else re.sub(r'class="','class="%s '%c,t,1)
        return t
    return re.sub(r'<div\b[^>]*background-image: url\([^>]*>',tag,s)

# 見出し・ラベル・本文にrvtext（1行ずつフェード用／PCのみ効く）
RVNAMES={'h','lab','eyebrow','sub','subh','d','catch'}
def tag_rv(s):
    def rvtag(m):
        t=m.group(0); nm=re.search(r'data-pencil-name="([^"]*)"',t)
        if nm and nm.group(1) in RVNAMES:
            t=re.sub(r'class="','class="rvtext ',t,1) if 'class="' in t else t.replace('<div','<div class="rvtext"',1)
        return t
    return re.sub(r'<div\b[^>]*>',rvtag,s)

def tag_cta(s):
    return re.sub(r'(data-pencil-name="CTA"\s*\n?\s*style=)','class="ctabtn" \\1',s,1)

# VOICEの星：lucideのアウトライン星（線）を塗りつぶしの星に差し替え（PC/SP両方）
STAR_PATH='M12 1.5l3.09 6.26 6.91 1.005-5 4.867 1.18 6.876L12 17.25l-6.18 3.258 1.18-6.876-5-4.867 6.91-1.005z'
def solid_stars(s):
    def rep(m):
        svg=m.group(0)
        svg=re.sub(r'viewBox="[^"]*"','viewBox="0 0 24 24"',svg,1)
        svg=re.sub(r'<path.*?</path>','<path d="%s" fill="#F5B301"></path>'%STAR_PATH,svg,1,flags=re.S)
        return svg
    return re.sub(r'<svg[^>]*data-icon-name="star".*?</svg>',rep,s,flags=re.S)

# KV裏の透明グリッド（空shaderのdata-URI）を除去し空色で塗る（PC用）
def fixfv(s):
    def f(m):
        t=m.group(0)
        t=re.sub(r"background-image: url\('data:[^']*'\);?\s*","",t)
        if 'background-color' not in t:
            t=re.sub(r'(style=")','\\1background-color:#bfe0f5;',t,1)
        return t
    return re.sub(r'<div[^>]*data-pencil-name="FV"[^>]*>',f,s)

pc=compress(open(PC).read())
sp=compress(open(SP).read())

# ボトルの実rotationを抽出（PCから）
rot='-2.56deg'
mb=re.search(r"<div[^>]*a/KV2_0001[^>]*?style=(\"|')(.*?)\1",pc,re.S)
if mb:
    mr=re.search(r'rotate\(([-\d.]+deg)\)',mb.group(2))
    if mr: rot=mr.group(1)

# PC body
pcb=body_inner(pc)
pcb=pcb.replace('data-pencil-name="ESION Top v1"','id="pageRoot" data-pencil-name="ESION Top v1"',1)
pcb=tag_media(pcb); pcb=fixfv(pcb); pcb=tag_cta(pcb); pcb=tag_rv(pcb); pcb=solid_stars(pcb)

# SP body
spb=body_inner(sp)
spb=spb.replace('data-pencil-name="ESION Top SP"','id="spRoot" data-pencil-name="ESION Top SP"',1)
spb=tag_media(spb); spb=tag_cta(spb); spb=tag_rv(spb); spb=solid_stars(spb)

css='''
<style>
html,body{margin:0;background:#fff;overflow-x:hidden;}
#pageRoot,#spRoot{position:relative;transform-origin:top left;}
/* PC/SP 切替 */
.lyt-sp{display:none;}
@media (max-width:768px){ .lyt-pc{display:none;} .lyt-sp{display:block;} }
/* アニメーション */
.kvzoom{animation:kvZoom 9s ease-in-out infinite;transform-origin:center center;}
@keyframes kvZoom{0%,100%{transform:scale(1.0);}50%{transform:scale(1.05);}}
.bottle{animation:bottleFloat 4.2s ease-in-out infinite;transform-origin:center center;}
@keyframes bottleFloat{0%,100%{transform:rotate(%ROT%) translateY(0);}50%{transform:rotate(%ROT%) translateY(-15px);}}
.ctabtn,[data-pencil-name="btn"],[data-pencil-name="link"],[data-pencil-name="cta"]{cursor:pointer;}
/* 価格の行高を統一（¥200〜の全角チルダで下ズレするのを防ぐ） */
[data-pencil-name="pr"]{line-height:1 !important;}
/* VOICEの星を塗り(ソリッド)に */
[data-icon-name="star"],[data-icon-name="star"] *{fill:#F5B301 !important;stroke:none !important;}
/* 明朝見出しの左サイドベアリングを詰めて頭揃え（Story） */
[data-pencil-name="Story"] [data-pencil-name="h"]{margin-left:-5px;}
/* FAQアコーディオン（PC/SP共通） */
[data-pencil-name="q0"],[data-pencil-name="q1"],[data-pencil-name="q2"],[data-pencil-name="q3"]{cursor:pointer;gap:0 !important;padding-top:16px !important;padding-bottom:16px !important;}
[data-pencil-name="q0"]>[data-pencil-name="a"],[data-pencil-name="q1"]>[data-pencil-name="a"],[data-pencil-name="q2"]>[data-pencil-name="a"],[data-pencil-name="q3"]>[data-pencil-name="a"]{max-height:0;overflow:hidden;opacity:0;margin-top:0;transition:max-height .4s ease,opacity .3s ease,margin-top .3s ease;}
[data-pencil-name="q0"].open>[data-pencil-name="a"],[data-pencil-name="q1"].open>[data-pencil-name="a"],[data-pencil-name="q2"].open>[data-pencil-name="a"],[data-pencil-name="q3"].open>[data-pencil-name="a"]{max-height:400px;opacity:1;margin-top:12px;}
/* SPはFAQを常時表示（セクション高さ固定で開閉すると崩れるため） */
.lyt-sp [data-pencil-name="q0"]>[data-pencil-name="a"],.lyt-sp [data-pencil-name="q1"]>[data-pencil-name="a"],.lyt-sp [data-pencil-name="q2"]>[data-pencil-name="a"],.lyt-sp [data-pencil-name="q3"]>[data-pencil-name="a"]{max-height:none !important;opacity:1 !important;margin-top:12px !important;}
.lyt-sp [data-pencil-name="q0"],.lyt-sp [data-pencil-name="q1"],.lyt-sp [data-pencil-name="q2"],.lyt-sp [data-pencil-name="q3"]{cursor:default !important;}
/* スクロールで柔らかくフェード（PCのみ／見出し・本文＝1行ずつ、タグ・カード＝順番に） */
.lyt-pc .rvtext,
.lyt-pc [data-pencil-name="13Free"] [data-pencil-name="grid"] > div > div,
.lyt-pc [data-pencil-name="ForWhom"] [data-pencil-name="grid"] > div > div,
.lyt-pc [data-pencil-name="Voices"] [data-pencil-name="row"] > div{opacity:0;transform:translateY(16px);transition:opacity 1s cubic-bezier(.2,.7,.2,1),transform 1s cubic-bezier(.2,.7,.2,1);transition-delay:0.2s;}
.lyt-pc .rvtext.shown,
.lyt-pc [data-pencil-name="13Free"] [data-pencil-name="grid"] > div > div.shown,
.lyt-pc [data-pencil-name="ForWhom"] [data-pencil-name="grid"] > div > div.shown,
.lyt-pc [data-pencil-name="Voices"] [data-pencil-name="row"] > div.shown{opacity:1;transform:none;}
</style>'''.replace('%ROT%',rot)

# PC用JS（pageRoot=最初の出現＝PC。zoom拡大・セクション別パララックス・FAQ・フェード）
jspc='''
<script>
(function(){
 var root=document.getElementById('pageRoot');if(!root)return;
 var DW=1199,pageH=8200,sc=1;
 function q(x){return document.querySelector('.lyt-pc '+x);}
 var faq=q('[data-pencil-name="FAQ"]'),news=q('[data-pencil-name="News"]'),contact=q('[data-pencil-name="Contact"]'),footer=q('[data-pencil-name="Footer"]');
 var faqTop=faq?faq.offsetTop:0, faqList=faq?faq.querySelector('[data-pencil-name="list"]'):null;
 if(faq)faq.style.overflow='visible';
 function relayout(){if(!faq)return;var h=56+(faqList?faqList.offsetHeight:0)+56;faq.style.height=h+'px';var y=faqTop+h;news.style.top=y+'px';y+=news.offsetHeight;contact.style.top=y+'px';y+=contact.offsetHeight;footer.style.top=y+'px';y+=footer.offsetHeight;pageH=y;}
 function apply(){sc=window.innerWidth/DW;root.style.zoom=sc;root.style.height=pageH+'px';}
 var TSEC={Statement:{k:0.065,s:1.0,lim:22},Story:{k:0.045,s:1.0,lim:15},Foam:{k:0.1,s:1.15,lim:45},Voices:{k:0.045,s:1.0,lim:16},Subscription:{k:0.12,s:1.18,lim:50}};
 var layers=[],ks=[],ss=[],lims=[];
 Object.keys(TSEC).forEach(function(name){var se=q('[data-pencil-name="'+name+'"]');if(!se)return;var cfg=TSEC[name];
   [].slice.call(se.querySelectorAll('div')).forEach(function(d){var bg=d.style.backgroundImage||'';if(bg.indexOf('a/')>-1){layers.push(d);ks.push(cfg.k);ss.push(cfg.s);lims.push(cfg.lim);}});});
 var cache=[];
 function recache(){var y=window.pageYOffset;cache=layers.map(function(el,i){el.style.transform='scale('+ss[i]+') translate3d(0,0,0)';var r=el.getBoundingClientRect();return {top:r.top+y,h:r.height};});}
 function onScroll(){var vh=window.innerHeight,y=window.pageYOffset;for(var i=0;i<layers.length;i++){var c=cache[i],top=c.top-y;if(top+c.h<-400||top>vh+400)continue;var ctr=top+c.h/2-vh/2;var ty=-(ctr/sc)*ks[i];var L=lims[i];if(ty>L)ty=L;if(ty<-L)ty=-L;layers[i].style.transform='scale('+ss[i]+') translate3d(0,'+ty+'px,0)';}}
 var ticking=false;
 function fit(){relayout();apply();recache();onScroll();}
 window.addEventListener('resize',fit);
 window.addEventListener('scroll',function(){if(!ticking){requestAnimationFrame(function(){onScroll();ticking=false;});ticking=true;}},{passive:true});
 ['q0','q1','q2','q3'].forEach(function(id){var el=faq&&faq.querySelector('[data-pencil-name="'+id+'"]');if(!el)return;el.addEventListener('click',function(){el.classList.toggle('open');setTimeout(fit,60);setTimeout(fit,460);});});
 var tio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('shown');tio.unobserve(e.target);}});},{threshold:0.2,rootMargin:'0px 0px -6% 0px'});
 document.querySelectorAll('.lyt-pc .rvtext').forEach(function(el){tio.observe(el);});
 function stagGroup(cs,is,step,base){var c=q(cs);if(!c)return;var items=c.querySelectorAll(is);var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){[].slice.call(items).forEach(function(it,i){it.style.transitionDelay=((base||0.2)+i*step)+'s';it.classList.add('shown');});io.disconnect();}},{threshold:0.15});io.observe(c);}
 stagGroup('[data-pencil-name="13Free"]','[data-pencil-name="grid"] > div > div',0.05,0.6);
 stagGroup('[data-pencil-name="ForWhom"]','[data-pencil-name="grid"] > div > div',0.07);
 stagGroup('[data-pencil-name="Voices"]','[data-pencil-name="row"] > div',0.12);
 window.addEventListener('load',fit);
 fit();
})();
</script>'''

# SP用JS（spRoot zoom・FAQアコーディオン。縦フローなので再レイアウト不要）
jssp='''
<script>
(function(){
 var sp=document.getElementById('spRoot');
 function z(){if(sp)sp.style.zoom=window.innerWidth/390;}
 window.addEventListener('resize',z);window.addEventListener('load',z);z();
 ['q0','q1','q2','q3'].forEach(function(id){
   document.querySelectorAll('.lyt-sp [data-pencil-name="'+id+'"]').forEach(function(el){
     el.addEventListener('click',function(){el.classList.toggle('open');});
   });
 });
})();
</script>'''

# パスワード保護（クライアント共有用: view / sessionStorage）
pw='''
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

head='''<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Hina+Mincho:wght@400&family=Jost:wght@100..900&family=Playfair+Display:wght@400..900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>*,::before,::after{box-sizing:border-box;}body{margin:0;}</style>'''

out=head+css+'''
  </head>
  <body>
'''+pw+'''
    <div class="lyt-pc">'''+pcb+'''</div>
    <div class="lyt-sp">'''+spb+'''</div>
'''+jspc+jssp+'''
  </body>
</html>'''

open('index.html','w').write(out)
print('built index.html', len(out), 'bytes | bottle rot', rot)
