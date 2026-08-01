#!/usr/bin/env python3
# ESION 誕生秘話（グレー版）ビルド：story-export.html → story.html
# 静的1カラム・zoom追従（innerWidth/1199）・パスワードゲート・フッターリンク・コメント機能(review.js)
# 使い方: python3 build_story.py
import re, urllib.parse, os, subprocess

SRC = 'story-export.html'
ROOT_NAME = 'ESION 誕生秘話 (画像グレー版)'
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

s = open(SRC).read()
body = re.search(r'<body>(.*)</body>', s, re.S).group(1)
body = compress(body)

# ルート（bodyの最初のdiv＝ページ全体）に id="storyRoot"（フレーム名に依存しない＝Pencilで改名されても壊れない）
body = re.sub(r'<div\b', '<div id="storyRoot"', body, 1)

# コンテンツ幅ガイド（📏 guide-L / guide-R）は本番に不要なので除去
body = re.sub(
    r'<div\s+data-pencil-name="📏 guide[^"]*"\s+style="[^"]*"\s*></div>\s*',
    '', body)

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
#storyRoot{position:relative;transform-origin:top left;}
</style>'''

# zoom追従（PC/SP共通：画面幅に合わせて1199基準を拡縮）
zoomjs = '''
<script>
(function(){
 var root=document.getElementById('storyRoot');if(!root)return;
 function z(){root.style.zoom=(window.innerWidth-((window.rvPanelOpen&&window.innerWidth>768)?300:0))/1199;}
 window.addEventListener('resize',z);window.addEventListener('load',z);z();
})();
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

# フッターの各リンク項目を<a href="#">で包む（全部#仮リンク・ホバー付き）※トップと共通
flinks = '''<style>.esion-flink{cursor:pointer;text-decoration:none;color:inherit;display:block;transition:opacity .2s;}.esion-flink:hover{opacity:.6;}</style>
<script>(function(){['PRODUCTS','MEMBER','SERVICE','ABOUT'].forEach(function(cn){document.querySelectorAll('[data-pencil-name="'+cn+'"]').forEach(function(col){Array.prototype.slice.call(col.children).slice(1).forEach(function(item){if(item.closest('a'))return;var a=document.createElement('a');a.className='esion-flink';a.href='#';item.parentNode.insertBefore(a,item);a.appendChild(item);});});});})();</script>'''

navlinks = '''<script>(function(){
 var MAP={"PRODUCTS":"product.html","STORY":"story.html"};
 document.querySelectorAll('[data-pencil-name="Nav"] > [data-pencil-name]').forEach(function(el){
   var t=(el.textContent||"").trim(); var href=MAP[t]; if(!href) return;
   if(el.closest("a")) return;
   var a=document.createElement("a"); a.href=href; a.style.cssText="text-decoration:none;color:inherit;cursor:pointer;";
   el.parentNode.insertBefore(a,el); a.appendChild(el);
 });
})();</script>'''

out = head + css + '''
  </head>
  <body>
''' + pw + '''
''' + body + zoomjs + flinks + navlinks + '''
<script src="/comment.js"></script>
  </body>
</html>'''

open('story.html', 'w').write(out)
print('built story.html', len(out), 'bytes')
