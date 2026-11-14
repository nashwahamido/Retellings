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

  // every card shows six lines; where the text is longer, "Read more" opens it in a window
  var cards = Array.prototype.slice.call(root.querySelectorAll(".tg-card"));
  cards.forEach(function (card, i) {
    var title = card.querySelector(".tg-card-title");
    var text = card.querySelector(".tg-card-text");
    var tag = card.querySelector(".tg-card-tag");
    if (!title || !text) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tg-more";
    btn.textContent = "Read more";
    btn.hidden = true;
    btn.setAttribute("aria-label", "Read more about " + title.textContent.trim());
    btn.addEventListener("click", function () {
      if (!window.LocWindows || !LocWindows.openCustom) { card.classList.add("is-open"); return; }
      var link = title.querySelector("a[href]");
      var body = '<div class="tg-win">' + (tag && tag.textContent.trim() ? '<p class="tg-win-tag">' + tag.innerHTML + "</p>" : "") +
        "<p>" + text.innerHTML + "</p>" +
        (link ? '<p class="tg-win-link"><a href="' + link.getAttribute("href") + '" target="_blank" rel="noopener noreferrer">Visit the ' + title.textContent.trim() + " website &rarr;</a></p>" : "") +
        "</div>";
      LocWindows.openCustom("tg-card-" + i, title.textContent.trim(), body, btn);
    });
    card.appendChild(btn);
  });
  // offer "Read more" only where the six lines cut the text off
  function measure() {
    cards.forEach(function (card) {
      var text = card.querySelector(".tg-card-text"), btn = card.querySelector(".tg-more");
      if (text && btn) btn.hidden = !(text.scrollHeight > text.clientHeight + 2);
    });
  }
  measure();
  window.addEventListener("resize", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  tabs.forEach(function (t) { t.addEventListener("click", function () { setTimeout(measure, 0); }); });

  // initialise: first tab (or one already marked selected)
  var initial = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
  select(initial, false);
})();
