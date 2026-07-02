<?php
/**
 * Template Name: CONTACT
 * お問い合わせ独立ページ（BowNowフォーム）。
 */
if (!defined('ABSPATH')) exit;
get_header();
?>
<main class="page-main">

  <section class="page-hero">
    <div class="wrap">
      <div class="label reveal"><span class="dash"></span><span class="cat">CONTACT</span></div>
      <div class="page-word reveal">CONTACT</div>
      <p class="lead reveal">次の世界へ行けるように、<br>まずはお話しましょう。</p>
    </div>
  </section>

  <section class="page-sec contact" style="padding-top:20px;">
    <div class="wrap">
      <p class="sub reveal">ご相談・お見積もりは無料です。2営業日以内にご返信いたします。</p>

      <!-- BowNow 問い合わせフォーム -->
      <div class="bownow-form reveal">
        <script id="_bownow_cs_sid_de55ffdeafd2615a2906">
          var _bownow_cs_sid_de55ffdeafd2615a2906 = document.createElement('script');
          _bownow_cs_sid_de55ffdeafd2615a2906.charset = 'utf-8';
          _bownow_cs_sid_de55ffdeafd2615a2906.src = 'https://contents.bownow.jp/forms/sid_de55ffdeafd2615a2906/trace.js';
          document.getElementsByTagName('head')[0].appendChild(_bownow_cs_sid_de55ffdeafd2615a2906);
        </script>
      </div>

      <div class="meta reveal">
        <span>APOLLOS</span>
        <span>TOKYO, JAPAN</span>
        <span>apollos.jp</span>
      </div>
    </div>
  </section>

</main>
<?php get_footer(); ?>
