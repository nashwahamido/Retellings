/* =====================================================================
   loc-windows.js — draggable place windows, shared by every page
   window.LocWindows.open(id, trigger)  opens (or focuses) a place's window
   window.LocWindows.onStory = fn(title) what a "story" chip does
   Each window has an "Add to my tour" toggle (TourStore), a small Google
   Maps link when the place has one, and an audio guide for stops of the
   suggested walk. Any element with data-id and class .loc-mention,
   .place-chip or .tour-mark gets .is-saved while that place is saved.
   Needs: tour-store.js (Places, TourStore); tour-data.js for audio guides.
   ===================================================================== */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  var layer = null;
  function getLayer() {
    if (layer) return layer;
    layer = document.getElementById("window-layer");
    if (!layer) {
      layer = el("div", "window-layer");
      layer.id = "window-layer";
    }
    // keep the windows inside the page's main region (they are fixed-position, so this is invisible)
    var main = document.querySelector("main") || document.body;
    if (layer.parentNode !== main) main.appendChild(layer);
    return layer;
  }

  var openWins = {};   // id -> window element
  var winOrder = [];   // focus stack (last = topmost)
  var zTop = 2000;
  var cascade = 0;

  var ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"/></svg>';

  function saveLabel(saved) { return saved ? "✓ In my tour" : "+ Add to my tour"; }

  function guideHtml(id) {
    var g = (window.TOUR_GUIDES || {})[id];
    if (!g || !g.audio || !g.audio.length) return "";
    var sources = g.audio.map(function (a) {
      return '<source src="' + esc(a.src) + '" type="' + esc(a.type) + '">';
    }).join("");
    var transcript = (g.transcript || []).map(function (p) { return "<p>" + p + "</p>"; }).join("");
    return '<div class="win-guide">' +
      '<p class="win-guide-label">Audio guide</p>' +
      '<audio controls preload="none">' + sources + "</audio>" +
      (transcript ? '<details class="win-transcript"><summary>Read transcript</summary>' + transcript + "</details>" : "") +
      (g.sideQuest ? '<details class="win-transcript"><summary>Side quest</summary><p>' + g.sideQuest + "</p></details>" : "") +
      "</div>";
  }

  function windowBody(l) {
    var stories = (l.stories || []);
    var storiesHtml = stories.length
      ? '<div class="win-stories"><span class="label">Appears in:</span>' +
        stories.map(function (s) {
          return '<button type="button" class="story-chip" data-story="' + esc(s) + '">' + esc(s) + "</button>";
        }).join("") + "</div>"
      : "";
    var saved = window.TourStore && TourStore.has(l.id);
    var saveBtn = window.TourStore
      ? '<button type="button" class="win-maplink win-save' + (saved ? " is-saved" : "") + '" data-save="' + esc(l.id) +
        '" aria-pressed="' + saved + '">' + saveLabel(saved) + "</button>"
      : "";
    var gmaps = l.mapLink
      ? '<a class="win-gmaps" href="' + esc(l.mapLink) + '" target="_blank" rel="noopener noreferrer">Open in Google Maps ' + ARROW + "</a>"
      : "";
    return (
      '<figure class="win-figure">' +
        '<img class="win-img" src="' + esc(l.image) + '" alt="' + esc(l.alt) + '">' +
        '<figcaption class="win-caption">' + esc(l.alt) + "</figcaption>" +
      "</figure>" +
      '<div class="win-content">' +
        '<p class="win-tag">' + esc(l.categoryLabel) + "</p>" +
        storiesHtml +
        '<p class="win-desc">' + esc(l.description) + "</p>" +
        guideHtml(l.id) +
        '<div class="win-actions">' + saveBtn + gmaps + "</div>" +
      "</div>"
    );
  }

  function focusWindow(win) {
    win.style.zIndex = ++zTop;
    var i = winOrder.indexOf(win);
    if (i !== -1) winOrder.splice(i, 1);
    winOrder.push(win);
    winOrder.forEach(function (w) { w.classList.toggle("is-active", w === win); });
  }

  function closeWindow(win) {
    var i = winOrder.indexOf(win);
    if (i !== -1) winOrder.splice(i, 1);
    delete openWins[win.dataset.id];
    var opener = win._opener;
    win.querySelectorAll("audio").forEach(function (a) { a.pause(); });
    win.remove();
    if (winOrder.length) focusWindow(winOrder[winOrder.length - 1]);
    else if (opener && opener.focus && document.contains(opener)) opener.focus();
  }

  // a framed, draggable window; `key` identifies it so it can be reused/focused
  function createWindow(key, title, bodyHtml, trigger, extraClass) {
    if (openWins[key]) { focusWindow(openWins[key]); openWins[key].focus(); return null; }
    var host = getLayer();

    var win = el("div", "loc-window" + (extraClass ? " " + extraClass : ""));
    win.dataset.id = key;
    win.setAttribute("role", "dialog");
    win.tabIndex = -1;
    win._opener = trigger || document.activeElement;

    var titleId = "win-title-" + String(key).replace(/[^a-z0-9_-]/gi, "-");
    win.innerHTML =
      '<div class="win-bar">' +
        '<span class="win-orn" aria-hidden="true">&#10087;</span>' +
        '<h2 class="win-title" id="' + titleId + '">' + esc(title) + "</h2>" +
        '<button type="button" class="win-close" aria-label="Close ' + esc(title) + '">&times;</button>' +
      "</div>" +
      '<div class="win-body">' + bodyHtml + "</div>";
    win.setAttribute("aria-labelledby", titleId);

    // position: centred-ish with a cascade offset; phones = pinned
    var mobile = window.innerWidth <= 640;
    win.classList.toggle("is-mobile", mobile);
    host.appendChild(win);
    if (!mobile) {
      var lw = win.offsetWidth, lh = win.offsetHeight;
      var baseX = Math.max(12, (host.clientWidth - lw) / 2 - 80);
      var baseY = Math.max(12, (host.clientHeight - lh) / 2 - 60);
      var off = (cascade % 6) * 26;
      cascade++;
      win.style.left = Math.min(baseX + off, Math.max(12, host.clientWidth - lw - 12)) + "px";
      win.style.top = Math.min(baseY + off, Math.max(12, host.clientHeight - lh - 12)) + "px";
    }

    openWins[key] = win;
    focusWindow(win);
    win.querySelector(".win-close").addEventListener("click", function () { closeWindow(win); });
    win.addEventListener("pointerdown", function () { focusWindow(win); }, true);
    makeDraggable(win, win.querySelector(".win-bar"));
    win.focus();
    return win;
  }

  function openWindow(id, trigger) {
    var l = window.Places && Places.get(id);
    if (!l) return;
    var win = createWindow(id, l.name, windowBody(l), trigger);
    if (!win) return;
    win.querySelectorAll(".story-chip").forEach(function (chip) {
      chip.addEventListener("click", function () { api.onStory(chip.dataset.story); });
    });
    var save = win.querySelector("[data-save]");
    if (save) save.addEventListener("click", function () { TourStore.toggle(id); });
  }

  function makeDraggable(win, handle) {
    handle.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".win-close")) return;
      if (win.classList.contains("is-mobile")) return;
      focusWindow(win);
      var host = getLayer();
      var r = win.getBoundingClientRect(), lr = host.getBoundingClientRect();
      var offX = e.clientX - r.left, offY = e.clientY - r.top;
      handle.classList.add("dragging");
      function move(ev) {
        var x = ev.clientX - lr.left - offX, y = ev.clientY - lr.top - offY;
        x = Math.max(0, Math.min(x, host.clientWidth - 56));
        y = Math.max(0, Math.min(y, host.clientHeight - 30));
        win.style.left = x + "px"; win.style.top = y + "px";
      }
      function up() {
        handle.classList.remove("dragging");
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
      }
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
      e.preventDefault();
    });
  }

  // keep every save button and saved-marker on the page in step with the list
  function syncSaved() {
    if (!window.TourStore) return;
    var ids = TourStore.list();
    document.querySelectorAll("[data-save]").forEach(function (b) {
      var on = ids.indexOf(b.dataset.save) !== -1;
      b.classList.toggle("is-saved", on);
      b.setAttribute("aria-pressed", String(on));
      b.textContent = saveLabel(on);
    });
    document.querySelectorAll(".loc-mention[data-id], .place-chip[data-id], .tour-mark[data-id]").forEach(function (m) {
      var on = ids.indexOf(m.dataset.id) !== -1;
      m.classList.toggle("is-saved", on);
      if (m.classList.contains("loc-mention") || m.classList.contains("place-chip")) {
        var base = m.dataset.label || (m.dataset.label = m.getAttribute("aria-label") || m.textContent.trim());
        m.setAttribute("aria-label", on ? base + " (in your tour)" : base);
      }
    });
  }
  document.addEventListener("tour:change", syncSaved);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && winOrder.length) { closeWindow(winOrder[winOrder.length - 1]); e.stopPropagation(); }
  }, true);

  var api = {
    open: openWindow,
    // any other window (e.g. the sources): returns the new window, or null if it was already open
    openCustom: createWindow,
    get: function (key) { return openWins[key] || null; },
    close: function (key) { if (openWins[key]) closeWindow(openWins[key]); },
    count: function () { return winOrder.length; },
    sync: syncSaved,
    // default: story chips take you to the book; book.js replaces this to flip to the chapter
    onStory: function () { window.location.href = "locations.html"; }
  };
  window.LocWindows = api;
})();
