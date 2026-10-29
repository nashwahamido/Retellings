/* =====================================================================
   book.js — the interactive book
   Renders a chapter table of contents from CHAPTERS, shows the locations
   for the selected Dubliners story, and opens an accessible modal "card"
   for any location the reader selects. Reads data from locations-data.js.
   ===================================================================== */
(function () {
  "use strict";

  var chapters = window.CHAPTERS || [];
  var locations = window.LOCATIONS || [];
  if (!chapters.length || !locations.length) {
    console.warn("book.js: location data not found.");
    return;
  }

  // quick lookup by id
  var byId = {};
  locations.forEach(function (l) { byId[l.id] = l; });

  // roman numerals for chapter numbers (1-15)
  var ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX",
               "X", "XI", "XII", "XIII", "XIV", "XV"];

  var tocList = document.getElementById("toc-list");
  var content = document.getElementById("book-content");
  var modal = document.getElementById("loc-modal");
  var modalDialog = modal.querySelector(".loc-modal__dialog");
  var modalBody = modal.querySelector(".loc-modal__body-slot");
  var modalFigure = modal.querySelector(".loc-modal__figure");
  var closeBtn = modal.querySelector(".loc-modal__close");

  var lastFocused = null;
  var ALL = "all";
  var state = { chapter: ALL };

  // ---------- helpers ----------
  function slugifyStory(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function chapterByTitle(title) {
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].title === title) return chapters[i];
    }
    return null;
  }
  function locationsForChapter(title) {
    if (title === ALL) return locations.slice();
    return locations.filter(function (l) { return l.stories.indexOf(title) !== -1; });
  }

  // ---------- table of contents ----------
  function buildTOC() {
    tocList.innerHTML = "";

    // "All locations" entry
    tocList.appendChild(tocEntry({
      key: ALL,
      num: "—",            // em dash
      title: "All Locations",
      count: locations.length
    }));

    var divider = document.createElement("li");
    divider.className = "toc-divider";
    divider.setAttribute("aria-hidden", "true");
    tocList.appendChild(divider);

    chapters.forEach(function (ch) {
      tocList.appendChild(tocEntry({
        key: ch.title,
        num: ROMAN[ch.number] || ch.number,
        title: ch.title,
        count: ch.count
      }));
    });
  }

  function tocEntry(opts) {
    var li = document.createElement("li");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "toc-entry";
    btn.dataset.key = opts.key;
    if (opts.count === 0) {
      btn.disabled = true;
      btn.title = "No mapped locations for this story yet";
    }
    btn.innerHTML =
      '<span class="toc-num" aria-hidden="true">' + opts.num + "</span>" +
      '<span class="toc-title">' + escapeHtml(opts.title) + "</span>" +
      '<span class="toc-count">' + opts.count + "</span>";
    btn.addEventListener("click", function () { selectChapter(opts.key, true); });
    li.appendChild(btn);
    return li;
  }

  function highlightTOC() {
    var entries = tocList.querySelectorAll(".toc-entry");
    entries.forEach(function (e) {
      e.setAttribute("aria-current", e.dataset.key === state.chapter ? "true" : "false");
    });
  }

  // ---------- chapter content ----------
  function selectChapter(key, updateHash) {
    state.chapter = key;
    highlightTOC();
    renderChapter(key);
    if (updateHash) {
      var hash = key === ALL ? "all" : slugifyStory(key);
      if (("#" + hash) !== window.location.hash) {
        history.replaceState(null, "", "#" + hash);
      }
    }
    // move focus/scroll to the content heading for context
    var head = content.querySelector(".chapter-head");
    if (head) head.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderChapter(key) {
    var isAll = key === ALL;
    var ch = isAll ? null : chapterByTitle(key);
    var locs = locationsForChapter(key);

    var head = document.createElement("div");
    head.className = "chapter-head";
    if (isAll) {
      head.innerHTML =
        '<span class="chapter-eyebrow">The complete gazetteer</span>' +
        "<h2>All Locations</h2>" +
        '<p class="chapter-count">' + locs.length + " places across Dublin</p>";
    } else {
      head.innerHTML =
        '<span class="chapter-eyebrow">Chapter ' + (ROMAN[ch.number] || ch.number) + "</span>" +
        "<h2>" + escapeHtml(key) + "</h2>" +
        '<p class="chapter-count">' + locs.length +
        (locs.length === 1 ? " location" : " locations") + "</p>";
    }

    content.innerHTML = "";
    content.appendChild(head);

    if (!locs.length) {
      var empty = document.createElement("p");
      empty.className = "chapter-empty";
      empty.textContent = "No mapped locations from this story yet.";
      content.appendChild(empty);
      return;
    }

    var grid = document.createElement("div");
    grid.className = "location-grid";
    locs.forEach(function (l) { grid.appendChild(locationCard(l)); });
    content.appendChild(grid);
  }

  function locationCard(l) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "loc-card";
    btn.dataset.id = l.id;
    btn.setAttribute("aria-haspopup", "dialog");
    var storiesText = l.stories.join(" · ");
    btn.innerHTML =
      '<img loading="lazy" src="' + escapeAttr(l.image) + '" alt="' + escapeAttr(l.alt) + '">' +
      '<span class="loc-card-body">' +
        '<span class="loc-tag">' + escapeHtml(l.categoryLabel) + "</span>" +
        "<h3>" + escapeHtml(l.name) + "</h3>" +
        '<span class="loc-stories">' + escapeHtml(storiesText) + "</span>" +
      "</span>";
    btn.addEventListener("click", function () { openModal(l.id, btn); });
    return btn;
  }

  // ---------- modal ----------
  function openModal(id, trigger) {
    var l = byId[id];
    if (!l) return;
    lastFocused = trigger || document.activeElement;

    // figure (image + caption)
    modalFigure.innerHTML =
      '<img class="loc-modal__img" src="' + escapeAttr(l.image) + '" alt="' + escapeAttr(l.alt) + '">' +
      '<figcaption class="loc-modal__caption">' + escapeHtml(l.alt) + "</figcaption>";

    // body
    var storiesHtml = '<span class="label">Appears in:</span>' +
      l.stories.map(function (s) {
        return '<button type="button" class="story-chip" data-story="' +
          escapeAttr(s) + '">' + escapeHtml(s) + "</button>";
      }).join("");

    var mapHtml = "";
    if (l.mapLink) {
      mapHtml =
        '<a class="loc-modal__maplink" href="' + escapeAttr(l.mapLink) +
        '" target="_blank" rel="noopener noreferrer">Map it out ' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"/>' +
        "</svg></a>";
    }

    modalBody.innerHTML =
      '<p class="loc-modal__tag">' + escapeHtml(l.categoryLabel) + "</p>" +
      '<h2 class="loc-modal__title" id="loc-modal-title">' + escapeHtml(l.name) + "</h2>" +
      '<div class="loc-modal__stories">' + storiesHtml + "</div>" +
      '<p class="loc-modal__desc">' + escapeHtml(l.description) + "</p>" +
      (mapHtml ? '<div class="loc-modal__actions">' + mapHtml + "</div>" : "");

    // story chips jump to that chapter
    modalBody.querySelectorAll(".story-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        closeModal();
        selectChapter(chip.dataset.story, true);
      });
    });

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeydown);
    closeBtn.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key === "Tab") trapFocus(e);
  }

  function trapFocus(e) {
    var focusable = modalDialog.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  // ---------- escaping ----------
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escapeAttr(s) { return escapeHtml(s); }

  // ---------- init ----------
  function initFromHash() {
    var hash = (window.location.hash || "").replace(/^#/, "");
    if (!hash || hash === "all") return selectChapter(ALL, false);
    var match = null;
    chapters.forEach(function (ch) {
      if (slugifyStory(ch.title) === hash) match = ch.title;
    });
    selectChapter(match || ALL, false);
  }

  buildTOC();
  closeBtn.addEventListener("click", closeModal);
  modal.querySelector(".loc-modal__backdrop").addEventListener("click", closeModal);
  initFromHash();
})();
