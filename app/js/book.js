/* =====================================================================
   book.js — the interactive flip-book
   Builds a page-turning book (StPageFlip) from the retellings in
   book-text.js, flows the prose into book-sized leaves, turns every place
   token into a clickable mention that opens its card (reusing the modal),
   and offers an accessible plain-reading mode. Falls back to plain mode if
   the flip library is unavailable.
   ===================================================================== */
(function () {
  "use strict";

  var BOOK = window.BOOK;
  var LOCATIONS = window.LOCATIONS || [];
  var CHAPTERS = window.CHAPTERS || [];
  if (!BOOK || !LOCATIONS.length) { console.warn("book.js: data missing"); return; }

  // lookups ----------------------------------------------------------------
  var byId = {}, byName = {};
  function norm(s) { return String(s).toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim(); }
  LOCATIONS.forEach(function (l) { byId[l.id] = l; byName[norm(l.name)] = l; });
  var chapterByTitle = {};
  CHAPTERS.forEach(function (c) { chapterByTitle[c.title] = c; });

  var ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX",
               "X", "XI", "XII", "XIII", "XIV", "XV"];

  // DOM refs ---------------------------------------------------------------
  var stage = document.getElementById("book-stage");
  var flipEl = document.getElementById("flipbook");
  var plainEl = document.getElementById("book-plain");
  var elPrev = document.getElementById("book-prev");
  var elNext = document.getElementById("book-next");
  var elContents = document.getElementById("book-contents");
  var elMode = document.getElementById("book-mode");
  var elProgress = document.getElementById("book-progress");

  var modal = document.getElementById("loc-modal");
  var modalDialog = modal.querySelector(".loc-modal__dialog");
  var modalBody = modal.querySelector(".loc-modal__body-slot");
  var modalFigure = modal.querySelector(".loc-modal__figure");
  var modalClose = modal.querySelector(".loc-modal__close");

  var pageFlip = null;
  var contentsIndex = 0;     // StPageFlip index of the contents page
  var storyStartIndex = {};  // story.number -> StPageFlip index of its first leaf

  // ---------------------------------------------------------------- escaping
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Turn [[display|Name]] / [[Name]] tokens into clickable mentions.
  function renderProse(text) {
    return text.replace(/\[\[([^\]]+)\]\]/g, function (_, inner) {
      var parts = inner.split("|");
      var display = parts[0];
      var key = parts.length > 1 ? parts[1] : parts[0];
      var loc = byName[norm(key)];
      if (!loc) return esc(display);
      return '<button type="button" class="loc-mention" data-id="' + esc(loc.id) +
        '" aria-haspopup="dialog">' + esc(display) + "</button>";
    });
  }

  // element factories ------------------------------------------------------
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function chapterOpenEl(story) {
    var d = el("div", "chapter-open");
    d.innerHTML =
      '<span class="ch-num">Chapter ' + (ROMAN[story.number] || story.number) + "</span>" +
      "<h2>" + esc(story.title) + "</h2>";
    return d;
  }
  function proseEl(text, dropcap) {
    var p = el("p", "prose" + (dropcap ? " has-dropcap" : ""), renderProse(text));
    return p;
  }
  function placesStripEl(story) {
    var ch = chapterByTitle[story.title];
    var ids = ch ? ch.locationIds.slice() : [];
    // also include any location named in the prose but tagged under another story
    var tokenRe = /\[\[([^\]]+)\]\]/g, m;
    story.paragraphs.forEach(function (para) {
      while ((m = tokenRe.exec(para))) {
        var parts = m[1].split("|");
        var loc = byName[norm(parts.length > 1 ? parts[1] : parts[0])];
        if (loc && ids.indexOf(loc.id) === -1) ids.push(loc.id);
      }
    });
    if (!ids.length) return null;
    var chips = ids.map(function (id) {
      var l = byId[id];
      if (!l) return "";
      return '<button type="button" class="place-chip" data-id="' + esc(id) + '">' + esc(l.name) + "</button>";
    }).join("");
    var d = el("div", "places-strip",
      '<span class="ps-label">Places in this story</span>' +
      '<div class="places-chips">' + chips + "</div>");
    return d;
  }

  // ---- measurer for pagination ----
  var measurer = null, measureBody = null, availH = 0, pageW = 0, pageH = 0;

  function computePageSize() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var h = Math.max(420, Math.min(Math.round(vh * 0.72), 700));
    var w = Math.round(h / 1.45);
    // ensure a two-page spread (or single) fits the stage width
    var avail = Math.min(vw - 48, 1100);
    if (vw > 760 && w * 2 > avail) { w = Math.floor(avail / 2); h = Math.round(w * 1.45); }
    else if (vw <= 760 && w > avail) { w = avail; h = Math.round(w * 1.45); }
    pageW = w; pageH = h;
  }

  function buildMeasurer() {
    if (measurer) measurer.remove();
    measurer = el("div", "page page--text");
    measurer.style.cssText = "position:absolute;left:-10000px;top:0;width:" + pageW + "px;height:" + pageH + "px;";
    var inner = el("div", "page-inner");
    measureBody = el("div", "page-body");
    measureBody.style.flex = "1";
    measureBody.style.minHeight = "0";
    measureBody.style.overflow = "hidden";
    var folio = el("div", "page-folio", '<span>&nbsp;</span><span class="folio-num">0</span>');
    inner.appendChild(measureBody);
    inner.appendChild(folio);
    measurer.appendChild(inner);
    document.body.appendChild(measurer);
    availH = measureBody.clientHeight;
  }
  function fits() { return measureBody.scrollHeight <= availH + 1; }

  // Greedy-paginate an array of block elements into leaves (arrays of nodes).
  // Blocks that overflow alone are placed alone (CSS hides any slight spill).
  function paginate(blocks) {
    var leaves = [], cur = [];
    measureBody.innerHTML = "";
    blocks.forEach(function (b) {
      measureBody.appendChild(b);
      if (fits()) { cur.push(b); return; }
      measureBody.removeChild(b);
      if (cur.length === 0) { cur.push(b); measureBody.appendChild(b); return; } // alone
      leaves.push(cur);
      cur = [b];
      measureBody.innerHTML = "";
      measureBody.appendChild(b);
    });
    if (cur.length) leaves.push(cur);
    return leaves;
  }

  // Build all story leaves; returns array of {title, nodes:[...] }
  function buildStoryLeaves() {
    var out = [];
    BOOK.stories.forEach(function (story) {
      var blocks = [chapterOpenEl(story)];
      story.paragraphs.forEach(function (p, i) { blocks.push(proseEl(p, i === 0)); });
      var leaves = paginate(blocks);

      // places strip: append to last leaf if it fits, else its own leaf
      var strip = placesStripEl(story);
      if (strip) {
        var last = leaves[leaves.length - 1];
        measureBody.innerHTML = "";
        last.forEach(function (n) { measureBody.appendChild(n); });
        measureBody.appendChild(strip);
        if (fits()) { last.push(strip); }
        else { leaves.push([strip]); }
      }
      leaves.forEach(function (nodes, idx) {
        out.push({ title: story.title, number: story.number, first: idx === 0, nodes: nodes });
      });
    });
    return out;
  }

  // ---- final page element builders ----
  function pageShell(kind) {
    var p = el("div", "page page--" + kind);
    var inner = el("div", "page-inner");
    p.appendChild(inner);
    return { page: p, inner: inner };
  }
  function coverPage() {
    var s = pageShell("cover");
    s.inner.innerHTML =
      '<div class="cover-wrap">' +
        '<span class="cover-kicker">Retellings</span>' +
        "<h2>" + esc(BOOK.title) + "</h2>" +
        '<div class="cover-rule"></div>' +
        '<span class="cover-author">' + esc(BOOK.author) + "</span>" +
        '<div class="cover-rule"></div>' +
        '<p class="cover-sub">' + esc(BOOK.subtitle) + "</p>" +
      "</div>";
    return s.page;
  }
  function blurbPage() {
    var s = pageShell("text");
    s.inner.innerHTML =
      '<div class="leaf-centered">' +
        '<p class="ornament">&#10087;</p>' +
        "<h2>" + esc(BOOK.title) + "</h2>" +
        "<p>" + esc(BOOK.blurb) + "</p>" +
        '<p class="ornament">&#10087;</p>' +
      "</div>";
    return s.page;
  }
  function contentsPage(entries) {
    var s = pageShell("text");
    var rows = entries.map(function (e) {
      return '<li><button type="button" class="toc-link" data-flip="' + e.index + '">' +
        '<span class="tl-num">' + (ROMAN[e.number] || e.number) + "</span>" +
        '<span class="tl-title">' + esc(e.title) + "</span>" +
        '<span class="tl-folio">' + e.folio + "</span></button></li>";
    }).join("");
    s.inner.innerHTML =
      '<h2 class="toc-title">Contents</h2>' +
      '<ul class="toc-entries">' + rows + "</ul>";
    return s.page;
  }
  function colophonPage() {
    var s = pageShell("back");
    s.inner.innerHTML =
      '<div class="leaf-centered">' +
        '<p class="ornament">&#10059;</p>' +
        "<p>" + esc(BOOK.colophon) + "</p>" +
      "</div>";
    return s.page;
  }
  function textLeafPage(leaf, folioNum) {
    var s = pageShell("text");
    var body = el("div", "page-body");
    body.style.flex = "1";
    body.style.minHeight = "0";
    body.style.overflow = "hidden";
    leaf.nodes.forEach(function (n) { body.appendChild(n); });
    var folio = el("div", "page-folio",
      '<span class="run-head"><em>' + esc(leaf.title) + "</em></span>" +
      '<span class="folio-num">' + folioNum + "</span>");
    s.inner.appendChild(body);
    s.inner.appendChild(folio);
    return s.page;
  }

  // plain (accessible) mode ------------------------------------------------
  function buildPlain() {
    plainEl.innerHTML = "";
    BOOK.stories.forEach(function (story) {
      var art = el("article", "plain-story");
      var h =
        '<span class="ch-num">Chapter ' + (ROMAN[story.number] || story.number) + "</span>" +
        "<h2>" + esc(story.title) + "</h2>";
      var ps = story.paragraphs.map(function (p) { return '<p class="prose">' + renderProse(p) + "</p>"; }).join("");
      art.innerHTML = h + ps;
      var strip = placesStripEl(story);
      if (strip) art.appendChild(strip);
      plainEl.appendChild(art);
    });
  }

  // ---- assemble & init the flip book ----
  function build() {
    computePageSize();
    buildMeasurer();

    var storyLeaves = buildStoryLeaves();

    // contents entries need StPageFlip indices + folio numbers
    var FRONT = 3; // cover, blurb, contents
    var entries = [];
    storyStartIndex = {};
    var folio = 0;
    storyLeaves.forEach(function (leaf, i) {
      folio += 1;
      leaf.folio = folio;
      if (leaf.first) {
        var idx = FRONT + i;
        storyStartIndex[leaf.number] = idx;
        entries.push({ number: leaf.number, title: leaf.title, index: idx, folio: folio });
      }
    });

    // final page order
    flipEl.innerHTML = "";
    var pages = [];
    pages.push(coverPage());
    pages.push(blurbPage());
    pages.push(contentsPage(entries));
    contentsIndex = 2;
    storyLeaves.forEach(function (leaf) { pages.push(textLeafPage(leaf, leaf.folio)); });
    pages.push(colophonPage());
    pages.forEach(function (p) { flipEl.appendChild(p); });

    measurer.remove(); measurer = null;

    // init StPageFlip
    if (pageFlip) { try { pageFlip.destroy(); } catch (e) {} pageFlip = null; }
    pageFlip = new St.PageFlip(flipEl, {
      width: pageW, height: pageH, size: "fixed",
      showCover: true, usePortrait: true, mobileScrollSupport: false,
      maxShadowOpacity: 0.5, drawShadow: true, flippingTime: 650,
      clickEventForward: true, useMouseEvents: true, swipeDistance: 30,
      showPageCorners: true, disableFlipByClick: true
    });
    pageFlip.loadFromHTML(flipEl.querySelectorAll(".page"));
    pageFlip.on("flip", updateProgress);
    pageFlip.on("changeState", function () { updateNav(); });
    updateProgress();
  }

  function pageCount() { return pageFlip ? pageFlip.getPageCount() : 0; }
  function current() { return pageFlip ? pageFlip.getCurrentPageIndex() : 0; }

  function updateProgress() {
    if (!pageFlip) return;
    var c = current(), n = pageCount();
    elProgress.textContent = "Leaf " + (c + 1) + " of " + n;
    updateNav();
  }
  function updateNav() {
    if (!pageFlip) return;
    elPrev.disabled = current() <= 0;
    elNext.disabled = current() >= pageCount() - 1;
  }

  // navigation
  function goPrev() { if (pageFlip) pageFlip.flipPrev(); }
  function goNext() { if (pageFlip) pageFlip.flipNext(); }
  function flipTo(i) { if (pageFlip) pageFlip.flip(i); }

  // plain / book mode toggle ----------------------------------------------
  var plainMode = false;
  function setMode(plain) {
    plainMode = plain;
    stage.hidden = plain;
    plainEl.hidden = !plain;
    elMode.textContent = plain ? "Read as a flip-book" : "Read as plain text";
    elMode.setAttribute("aria-pressed", String(plain));
    // disable flip-only controls in plain mode
    [elPrev, elNext, elContents].forEach(function (b) { b.disabled = plain; });
    if (!plain) updateNav();
  }

  // ---- location modal (reused) ----
  var lastFocused = null;
  function openModal(id, trigger) {
    var l = byId[id];
    if (!l) return;
    lastFocused = trigger || document.activeElement;

    modalFigure.innerHTML =
      '<img class="loc-modal__img" src="' + esc(l.image) + '" alt="' + esc(l.alt) + '">' +
      '<figcaption class="loc-modal__caption">' + esc(l.alt) + "</figcaption>";

    var storiesHtml = '<span class="label">Appears in:</span>' +
      l.stories.map(function (s) {
        return '<button type="button" class="story-chip" data-story="' + esc(s) + '">' + esc(s) + "</button>";
      }).join("");
    var mapHtml = l.mapLink
      ? '<a class="loc-modal__maplink" href="' + esc(l.mapLink) + '" target="_blank" rel="noopener noreferrer">Map it out ' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"/></svg></a>'
      : "";

    modalBody.innerHTML =
      '<p class="loc-modal__tag">' + esc(l.categoryLabel) + "</p>" +
      '<h2 class="loc-modal__title" id="loc-modal-title">' + esc(l.name) + "</h2>" +
      '<div class="loc-modal__stories">' + storiesHtml + "</div>" +
      '<p class="loc-modal__desc">' + esc(l.description) + "</p>" +
      (mapHtml ? '<div class="loc-modal__actions">' + mapHtml + "</div>" : "");

    modalBody.querySelectorAll(".story-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var num = null;
        CHAPTERS.forEach(function (c) { if (c.title === chip.dataset.story) num = c.number; });
        closeModal();
        if (!plainMode && num != null && storyStartIndex[num] != null) flipTo(storyStartIndex[num]);
      });
    });

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onModalKey);
    modalClose.focus();
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onModalKey);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  function onModalKey(e) {
    if (e.key === "Escape") return closeModal();
    if (e.key !== "Tab") return;
    var f = modalDialog.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // ---- global click delegation (mentions, chips, contents) ----
  document.addEventListener("click", function (e) {
    var mention = e.target.closest(".loc-mention, .place-chip");
    if (mention) { e.preventDefault(); openModal(mention.dataset.id, mention); return; }
    var tl = e.target.closest(".toc-link");
    if (tl) { e.preventDefault(); flipTo(parseInt(tl.dataset.flip, 10)); }
  });

  // keyboard arrows flip the book (when not typing / modal closed)
  document.addEventListener("keydown", function (e) {
    if (!modal.hidden || plainMode) return;
    if (e.key === "ArrowLeft") goPrev();
    else if (e.key === "ArrowRight") goNext();
  });

  // controls
  elPrev.addEventListener("click", goPrev);
  elNext.addEventListener("click", goNext);
  elContents.addEventListener("click", function () { flipTo(contentsIndex); });
  elMode.addEventListener("click", function () { setMode(!plainMode); });
  modalClose.addEventListener("click", closeModal);
  modal.querySelector(".loc-modal__backdrop").addEventListener("click", closeModal);

  // resize: rebuild if the page size changed meaningfully
  var rt = null, lastW = 0, lastH = 0;
  window.addEventListener("resize", function () {
    if (plainMode) return;
    clearTimeout(rt);
    rt = setTimeout(function () {
      var pw = pageW, ph = pageH;
      computePageSize();
      if (Math.abs(pageW - pw) > 16 || Math.abs(pageH - ph) > 16) build();
    }, 300);
  });

  // ---- boot ----
  buildPlain();
  function boot() {
    if (typeof St === "undefined" || !St.PageFlip) {
      console.warn("book.js: StPageFlip unavailable, using plain mode.");
      elMode.hidden = true;
      setMode(true);
      stage.hidden = true;
      return;
    }
    build();
    setMode(false);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(boot).catch(boot);
  } else {
    boot();
  }
})();
