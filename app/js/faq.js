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

  // initialise: first tab (or one already marked selected)
  var initial = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
  select(initial, false);
})();
