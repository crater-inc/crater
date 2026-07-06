#!/usr/bin/env python3
# ESIONトップ ビルド: Pencil書き出し(export)→本番HTML
# 使い方: python3 build.py <export.html>
# 挙動: 画像圧縮(a/)・zoom拡大・KVズーム・ボトル浮遊・FAQアコーディオン・セクション単位パララックス
import re,urllib.parse,os,subprocess,sys

SRC=sys.argv[1] if len(sys.argv)>1 else 'export.html'
s=open(SRC).read()
ALPHA=['KV2_0001','esionLOGO']  # 透過必要→png維持

# --- 画像を a/ へ圧縮＆パス差し替え ---
for u in set(re.findall(r"url\('([^']+)'\)",s)):
    if u.startswith('data:'):continue
    fn=urllib.parse.unquote(u);stem=re.sub(r'[^A-Za-z0-9._-]','_',os.path.basename(fn))
    if any(k in fn for k in ALPHA): out='a/'+stem
    else: out='a/'+re.sub(r'\.(png|jpg|jpeg|PNG|JPG)$','',stem)+'.jpg'
    if not os.path.exists(out):
        if any(k in fn for k in ALPHA): subprocess.run(['sips','-Z','1000',fn,'--out',out],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        else: subprocess.run(['sips','-s','format','jpeg','-s','formatOptions','80','-Z','2000',fn,'--out',out],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    s=s.replace("url('%s')"%u,"url('%s')"%out.replace(' ','%20'))

s=s.replace('<html lang="en">','<html lang="ja">')
s=s.replace('data-pencil-name="ESION Top v1"','id="pageRoot" data-pencil-name="ESION Top v1"',1)

# KV=kvzoom / ボトル=bottle クラス付与
def tag(m):
    t=m.group(0);mm=re.search(r"url\('([^']+)'\)",t)
    if not mm:return t
    u=mm.group(1)
    c='kvzoom' if 'Image_6' in u or 'Image%206' in u else ('bottle' if 'KV2_0001' in u else None)
    if c: t=t.replace('<div','<div class="%s"'%c,1) if 'class="' not in t else re.sub(r'class="','class="%s '%c,t,1)
    return t
s=re.sub(r'<div\b[^>]*background-image: url\([^>]*>',tag,s)
s=re.sub(r'(data-pencil-name="CTA"\s*\n?\s*style=)','class="ctabtn" \\1',s,1)

# ボトルの実rotationを抽出
rot='-2.56deg'
mb=re.search(r"<div[^>]*a/KV2_0001[^>]*?style=(\"|')(.*?)\1",s,re.S)
if mb:
    mr=re.search(r'rotate\(([-\d.]+deg)\)',mb.group(2))
    if mr: rot=mr.group(1)

css='''
<style>
html,body{margin:0;background:#fff;overflow-x:hidden;}
#pageRoot{position:relative;transform-origin:top left;}
.kvzoom{animation:kvZoom 9s ease-in-out infinite;transform-origin:center center;}
@keyframes kvZoom{0%,100%{transform:scale(1.0);}50%{transform:scale(1.05);}}
.bottle{animation:bottleFloat 4.2s ease-in-out infinite;transform-origin:center center;}
@keyframes bottleFloat{0%,100%{transform:rotate(%ROT%) translateY(0);}50%{transform:rotate(%ROT%) translateY(-15px);}}
.ctabtn{cursor:pointer;}
[data-pencil-name="q0"],[data-pencil-name="q1"],[data-pencil-name="q2"],[data-pencil-name="q3"]{cursor:pointer;gap:0 !important;padding-top:16px !important;padding-bottom:16px !important;}
[data-pencil-name="q0"]>[data-pencil-name="a"],[data-pencil-name="q1"]>[data-pencil-name="a"],[data-pencil-name="q2"]>[data-pencil-name="a"],[data-pencil-name="q3"]>[data-pencil-name="a"]{max-height:0;overflow:hidden;opacity:0;margin-top:0;transition:max-height .4s ease,opacity .3s ease,margin-top .3s ease;}
[data-pencil-name="q0"].open>[data-pencil-name="a"],[data-pencil-name="q1"].open>[data-pencil-name="a"],[data-pencil-name="q2"].open>[data-pencil-name="a"],[data-pencil-name="q3"].open>[data-pencil-name="a"]{max-height:240px;opacity:1;margin-top:12px;}
</style>'''.replace('%ROT%',rot)
s=s.replace('</head>',css+'\n</head>')

js='''
<script>
(function(){
 var root=document.getElementById('pageRoot'),DW=1199,pageH=8200,sc=1;
 function q(x){return document.querySelector(x);}
 var faq=q('[data-pencil-name="FAQ"]'),news=q('[data-pencil-name="News"]'),contact=q('[data-pencil-name="Contact"]'),footer=q('[data-pencil-name="Footer"]');
 var faqTop=faq?faq.offsetTop:0, faqList=faq?faq.querySelector('[data-pencil-name="list"]'):null;
 if(faq)faq.style.overflow='visible';
 function relayout(){if(!faq)return;var h=56+(faqList?faqList.offsetHeight:0)+56;faq.style.height=h+'px';var y=faqTop+h;news.style.top=y+'px';y+=news.offsetHeight;contact.style.top=y+'px';y+=contact.offsetHeight;footer.style.top=y+'px';y+=footer.offsetHeight;pageH=y;}
 function apply(){sc=window.innerWidth/DW;root.style.zoom=sc;root.style.height=pageH+'px';}
 // セクション単位パララックス（大きな背景写真のみ）。画像は元々縦にはみ出しているので基本は拡大せず平行移動。
 // s=基準スケール(1.0=拡大なし=トリミングそのまま), lim=移動量の上限(px, はみ出し内に収め隙間を防ぐ)
 var TSEC={Statement:{k:0.065,s:1.0,lim:22},Story:{k:0.045,s:1.0,lim:15},Foam:{k:0.045,s:1.0,lim:18},Voices:{k:0.045,s:1.0,lim:16},Subscription:{k:0.045,s:1.06,lim:18}};
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
 window.addEventListener('load',fit);
 fit();
})();
</script>'''
s=s.replace('</body>',js+'\n</body>')
open('index.html','w').write(s)
print('built index.html', len(s), 'bytes | bottle rot', rot)
