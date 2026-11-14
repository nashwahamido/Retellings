/* =====================================================================
   sources.js — the Sources window
   Opens the references (sources-data.js) in a draggable window, like the
   place windows, with one tab per part of the site and a search field.
     - any element with [data-sources] opens it: data-sources="" (first
       tab), a group key ("transport") or a reference ("ref-13")
     - links to credits.html#ref-N / about.html#ref-N open it at that entry
     - arriving with #sources or #ref-N in the address opens it too
   Needs loc-windows.js (window.LocWindows.openCustom).
   ===================================================================== */
(function () {
  "use strict";
  var KEY = "sources";
  var DATA = window.SOURCES || [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function groupOfRef(n) {
    for (var i = 0; i < DATA.length; i++) {
      for (var j = 0; j < DATA[i].items.length; j++) if (DATA[i].items[j].n === n) return i;
    }
    return 0;
  }
  function itemsHtml(items, withGroup) {
    return items.map(function (it) {
      return '<li id="src-' + it.n + '" value="' + it.n + '">' +
        (withGroup ? '<span class="src-from">' + esc(withGroup(it)) + "</span> " : "") + it.html + "</li>";
    }).join("");
  }

  function body() {
    var tabs = DATA.map(function (g, i) {
      return '<button type="button" role="tab" class="src-tab" id="src-tab-' + g.key + '" data-i="' + i + '"' +
        ' aria-controls="src-panel" aria-selected="false" tabindex="-1">' +
        '<span class="src-letter">' + esc(g.letter) + "</span>" + esc(g.short) + "</button>";
    }).join("");
    return '<div class="src-wrap">' +
      '<p class="src-intro">Every reference used in researching Retellings. Numbers in the text link here.</p>' +
      '<div class="src-tabs" role="tablist" aria-label="Parts of the site">' + tabs + "</div>" +
      '<label class="src-search"><span class="visually-hidden">Search the sources</span>' +
        '<input type="search" placeholder="Search the sources&hellip;" autocomplete="off"></label>' +
      '<div class="src-panel" id="src-panel" role="tabpanel" tabindex="0"></div>' +
      "</div>";
  }

  function wire(win) {
    var tabs = [].slice.call(win.querySelectorAll(".src-tab"));
    var panel = win.querySelector(".src-panel");
    var search = win.querySelector(".src-search input");
    var current = 0;

    function show(i, focusTab) {
      current = i;
      var g = DATA[i];
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      if (focusTab) tabs[i].focus();
      panel.setAttribute("aria-labelledby", tabs[i].id);
      panel.innerHTML = '<h3 class="src-head"><span class="src-letter">' + esc(g.letter) + "</span>" + esc(g.title) + "</h3>" +
        '<ol class="src-list">' + itemsHtml(g.items) + "</ol>";
      panel.scrollTop = 0;
    }
    function find(q) {
      q = q.trim().toLowerCase();
      if (!q) { tabs.forEach(function (t) { t.classList.remove("is-dim"); }); show(current); return; }
      var hits = [];
      DATA.forEach(function (g) {
        g.items.forEach(function (it) {
          var text = it.html.replace(/<[^>]+>/g, "").toLowerCase();
          if (text.indexOf(q) !== -1) hits.push({ n: it.n, html: it.html, g: g });
        });
      });
      tabs.forEach(function (t) { t.classList.add("is-dim"); t.setAttribute("aria-selected", "false"); });
      panel.removeAttribute("aria-labelledby");
      panel.innerHTML = '<h3 class="src-head">' + hits.length + (hits.length === 1 ? " source" : " sources") + " found</h3>" +
        (hits.length ? '<ol class="src-list">' + itemsHtml(hits, function (h) { return h.g.letter; }) + "</ol>"
                     : '<p class="src-none">Nothing matches &ldquo;' + esc(q) + "&rdquo;.</p>");
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { search.value = ""; tabs.forEach(function (x) { x.classList.remove("is-dim"); }); show(i); });
      t.addEventListener("keydown", function (e) {
        var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (e.key === "Home") k = -i; else if (e.key === "End") k = tabs.length - 1 - i;
        if (k == null) return;
        e.preventDefault();
        search.value = "";
        show((i + k + tabs.length) % tabs.length, true);
      });
    });
    search.addEventListener("input", function () { find(search.value); });

    win._srcShow = function (target) {
      search.value = "";
      tabs.forEach(function (t) { t.classList.remove("is-dim"); });
      var m = /^ref-(\d+)$/.exec(target || "");
      if (m) {
        var n = +m[1];
        show(groupOfRef(n));
        var li = panel.querySelector("#src-" + n);
        if (li) {
          li.classList.add("is-target");
          panel.scrollTop = Math.max(0, li.offsetTop - panel.offsetTop - 12);
        }
        return;
      }
      var gi = 0;
      DATA.forEach(function (g, i) { if (g.key === target) gi = i; });
      show(gi);
    };
  }

  function open(target, trigger) {
    if (!window.LocWindows || !LocWindows.openCustom || !DATA.length) {
      location.href = "about.html#sources";
      return;
    }
    var win = LocWindows.get(KEY);
    if (!win) {
      win = LocWindows.openCustom(KEY, "Sources", body(), trigger, "win--sources");
      if (!win) return;
      wire(win);
    } else {
      LocWindows.openCustom(KEY); // brings it to the front
    }
    win._srcShow(target || "");
  }
  window.Sources = { open: open };

  // ---- triggers ----
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-sources]");
    var ref = null;
    if (!t) {
      var a = e.target.closest('a[href*="#ref-"]');
      if (a && /(?:^|\/)(credits|about)\.html#ref-\d+$/.test(a.getAttribute("href"))) { t = a; ref = a.getAttribute("href").split("#")[1]; }
    }
    if (!t) return;
    e.preventDefault();
    var menu = t.closest(".mobile-menu");
    if (menu) menu.classList.remove("shown");
    open(ref || t.getAttribute("data-sources") || "", t);
  });

  // ---- arriving with #sources or #ref-N ----
  function fromHash() {
    var h = location.hash.slice(1);
    if (h === "sources" || /^ref-\d+$/.test(h)) open(h === "sources" ? "" : h);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fromHash);
  else fromHash();
  window.addEventListener("hashchange", fromHash);
})();
