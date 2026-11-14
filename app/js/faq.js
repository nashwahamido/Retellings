/* =====================================================================
   faq.js — sidebar help panel (tablist) for the Navigating Dublin guide
   Click or arrow-key a question to show its answer; one open at a time.
   Progressive enhancement: without JS, all panels are visible (readable).
   ===================================================================== */
(function () {
  "use strict";
  var root = document.querySelector(".transit-guide");
  if (!root) return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  if (!tabs.length) return;

  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p) {
      p.hidden = p.id !== tab.getAttribute("aria-controls");
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var idx = i;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") idx = (i + 1) % tabs.length;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") idx = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") idx = 0;
      else if (e.key === "End") idx = tabs.length - 1;
      else return;
      e.preventDefault();
      select(tabs[idx], true);
    });
  });

  // phones: clamp long cards to a few lines with a "Read more" toggle
  var narrow = window.matchMedia("(max-width: 640px)");
  var cards = Array.prototype.slice.call(root.querySelectorAll(".tg-card"));
  cards.forEach(function (card) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tg-more";
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = "Read more";
    btn.addEventListener("click", function () {
      var open = card.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Show less" : "Read more";
    });
    card.appendChild(btn);
  });
  // only offer the toggle where the text is actually cut off
  function measure() {
    cards.forEach(function (card) {
      var p = card.querySelector("p");
      if (!p || card.classList.contains("is-open")) return;
      card.classList.toggle("is-clamped", narrow.matches && p.scrollHeight > p.clientHeight + 2);
    });
  }
  measure();
  if (narrow.addEventListener) narrow.addEventListener("change", measure);
  window.addEventListener("resize", measure);
  tabs.forEach(function (t) { t.addEventListener("click", function () { setTimeout(measure, 0); }); });

  // initialise: first tab (or one already marked selected)
  var initial = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
  select(initial, false);
})();
