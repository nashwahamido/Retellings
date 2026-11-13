/* =====================================================================
   folio.js — small behaviours for the book-styled pages:
   the rotating epigraph on the Preface and "More plates" on the Cover.
   ===================================================================== */
(function () {
  // ---- epigraph: a different line every few seconds ----
  var q = document.getElementById("quote"), c = document.getElementById("quote-cite");
  var QUOTES = [
    ["Life is too short to read a bad book.", "James Joyce"],
    ["Why is it that words like these seem dull and cold? Is it because there is no word tender enough to be your name?", "James Joyce, “The Dead”"],
    ["Better pass boldly into that other world, in the full glory of some passion, than fade and wither dismally with age.", "James Joyce, “The Dead”"],
    ["I want to give a picture of Dublin so complete that if the city suddenly disappeared from the earth it could be reconstructed out of my book.", "James Joyce to Frank Budgen, 1918"],
    ["People are trapped in history and history is trapped in them.", "James Baldwin, Notes of a Native Son"]
  ];
  if (q && c) {
    var i = 0;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var show = function () { q.textContent = "“" + QUOTES[i][0] + "”"; c.textContent = QUOTES[i][1]; };
    show();
    if (!reduce) setInterval(function () {
      q.classList.add("is-fading");
      setTimeout(function () { i = (i + 1) % QUOTES.length; show(); q.classList.remove("is-fading"); }, 400);
    }, 9000);
  }

  // ---- the Cover's plates: show six, then the rest on request ----
  var plates = document.getElementById("plates"), more = document.getElementById("more-plates");
  if (plates && more) {
    if (!plates.querySelector(".is-extra")) more.hidden = true;
    more.addEventListener("click", function () {
      plates.classList.add("show-all");
      more.hidden = true;
      var first = plates.querySelector(".is-extra a, .is-extra");
      if (first && first.focus) { first.setAttribute("tabindex", "-1"); first.focus({ preventScroll: true }); }
    });
  }
})();
