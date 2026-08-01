#!/usr/bin/env python3
# ESION 誕生秘話（グレー版）ビルド：story-export.html → story.html
# 静的1カラム・zoom追従（innerWidth/1199）・パスワードゲート・フッターリンク・コメント機能(review.js)
# 使い方: python3 build_story.py
import re

SRC = 'story-export.html'
ROOT_NAME = 'ESION 誕生秘話 (画像グレー版)'

s = open(SRC).read()
body = re.search(r'<body>(.*)</body>', s, re.S).group(1)

# ルートフレームに id="storyRoot" を付与（zoom追従の対象）
body = body.replace(
    'data-pencil-name="%s"' % ROOT_NAME,
    'id="storyRoot" data-pencil-name="%s"' % ROOT_NAME, 1)

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
 function z(){root.style.zoom=window.innerWidth/1199;}
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

out = head + css + '''
  </head>
  <body>
''' + pw + '''
''' + body + zoomjs + flinks + '''
<script src="review.js"></script>
  </body>
</html>'''

open('story.html', 'w').write(out)
print('built story.html', len(out), 'bytes')
