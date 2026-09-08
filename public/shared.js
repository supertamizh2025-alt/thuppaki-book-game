/* =========================================================
   shared.js — Tamil Games common components
   ========================================================= */

function navLink(href, label, page) {
  return '<li><a href="' + href + '">' + label + '</a></li>';
}

// ── Nav ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

  var navEl = document.querySelector('nav');
  if (navEl) {
    navEl.innerHTML =
      '<a href="https://tamilgames.net/" class="nav-logo">Tamil<span>Games</span>.net</a>' +
      '<ul class="nav-links">' +
        navLink('https://tamilgames.net/', 'Games', 'home') +
        navLink('https://tamilgames.net/feedback.html', 'Feedback', 'feedback') +
      '</ul>';
  }

});