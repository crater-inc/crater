// ONE ワイヤー 内部リンク（data-pencil-name → 遷移先）
(function () {
  var MAP = {
    // グローバルメニュー（英字）
    "ABOUT": "about.html",
    "PROPERTY": "property.html",
    "COMPANY": "company.html",
    "RECRUIT": "recruit.html",
    "CONTACT": "contact.html",
    // ロゴ → トップ
    "ロゴ画像": "index.html",
    // TOP 物件4バナー
    "売買": "property.html",
    "賃貸": "property.html",
    "査定": "assessment.html",
    "リフォーム": "reform.html",
    // 追従CV
    "cv 無料査定": "assessment.html",
    "cv 物件を探す": "property.html",
    // フッターナビ（日本語）
    "売買を探す": "property.html",
    "わたしたちについて": "about.html",
    "会社案内": "company.html",
    "採用情報": "recruit.html",
    "お問い合わせ": "contact.html",
    "無料査定": "assessment.html",
    "プライバシーポリシー": "privacy.html",
    // お知らせ
    "お知らせ": "news.html",
    "ニュース": "news.html"
  };
  function bind() {
    document.querySelectorAll("[data-pencil-name]").forEach(function (el) {
      var n = el.getAttribute("data-pencil-name");
      if (MAP[n] && !el.__oneLinked) {
        el.__oneLinked = true;
        el.style.cursor = "pointer";
        el.setAttribute("role", "link");
        el.addEventListener("click", function (e) {
          e.stopPropagation();
          location.href = MAP[n];
        });
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
