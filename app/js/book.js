/* =====================================================================
   book.js — the interactive flip-book ("A Book of Records")
   Builds a realistic hardcover, page-turning book (StPageFlip) whose pages
   are a ledger of the exact lines from Dubliners where each Dublin place is
   named (data in book-text.js). Place names are clickable and open the
   location's card (data in locations-data.js). Also offers an accessible
   plain-reading mode and falls back to it if the flip library is missing.
   ===================================================================== */
(function () {
  "use strict";

  var BOOK = window.BOOK;
  var LOCATIONS = window.LOCATIONS || [];
  var LOC_CHAPTERS = window.CHAPTERS || []; // location->chapter tags (for "also mentioned")
  if (!BOOK || !LOCATIONS.length) { console.warn("book.js: data missing"); return; }

  var byId = {}, byName = {};
  function norm(s) { return String(s).toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim(); }
  LOCATIONS.forEach(function (l) { byId[l.id] = l; byName[norm(l.name)] = l; });
  var locChapterByTitle = {};
  LOC_CHAPTERS.forEach(function (c) { locChapterByTitle[c.title] = c; });

  var ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX",
               "X", "XI", "XII", "XIII", "XIV", "XV"];

  var stage = document.getElementById("book-stage");
  var bookCase = document.getElementById("book-case");
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

  var pageFlip = null, contentsIndex = 0, chapterStartIndex = {}, portrait = false;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // [[display|Name]] -> clickable mention (escapes everything else)
  function renderProse(text) {
    var out = "", last = 0, re = /\[\[([^\]]+)\]\]/g, m;
    while ((m = re.exec(text))) {
      out += esc(text.slice(last, m.index));
      var parts = m[1].split("|");
      var display = parts[0], key = parts.length > 1 ? parts[1] : parts[0];
      var loc = byName[norm(key)];
      out += loc
        ? '<button type="button" class="loc-mention" data-id="' + esc(loc.id) + '" aria-haspopup="dialog">' + esc(display) + "</button>"
        : esc(display);
      last = m.index + m[0].length;
    }
    out += esc(text.slice(last));
    return out;
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  // ---- block builders for a chapter ----
  function chapterHeadEl(ch) {
    var d = el("div", "chapter-open");
    d.innerHTML =
      '<span class="ch-kicker">Dubliners &middot; Chapter ' + (ROMAN[ch.number] || ch.number) + "</span>" +
      "<h2>" + esc(ch.title) + "</h2>" +
      '<span class="ch-sub">The places, in Joyce’s own words</span>';
    return d;
  }
  // wrap a line in curly quotes, but strip an existing outer quote mark first
  // so dialogue lines don't end up double-quoted
  function quoted(raw) {
    var t = String(raw).trim();
    if (/^[“"]/.test(t)) t = t.slice(1);
    if (/[”"]$/.test(t)) t = t.slice(0, -1);
    return "“" + renderProse(t) + "”";
  }
  function recordEl(entry, n) {
    var d = el("div", "record");
    d.innerHTML =
      '<span class="rec-no" aria-hidden="true">' + n + "</span>" +
      '<p class="rec-quote">' + quoted(entry.text) + "</p>";
    return d;
  }
  // chips for chapter locations that got no quote line in this chapter
  function alsoStripEl(ch, linkedIds) {
    var lc = locChapterByTitle[ch.title];
    if (!lc) return null;
    var extra = lc.locationIds.filter(function (id) { return linkedIds.indexOf(id) === -1; });
    if (!extra.length) return null;
    var chips = extra.map(function (id) {
      var l = byId[id]; if (!l) return "";
      return '<button type="button" class="place-chip" data-id="' + esc(id) + '">' + esc(l.name) + "</button>";
    }).join("");
    return el("div", "places-strip",
      '<span class="ps-label">Also in this story</span>' +
      '<div class="places-chips">' + chips + "</div>");
  }

  // ---- measurer / pagination ----
  var measurer = null, measureBody = null, availH = 0, pageW = 0, pageH = 0;
  function computePageSize() {
    var vw = window.innerWidth, vh = window.innerHeight;
    portrait = vw <= 760;
    var h = Math.max(440, Math.min(Math.round(vh * 0.74), 720));
    var w = Math.round(h / 1.46);
    var edge = portrait ? 18 : 30;
    var availW = Math.min(vw - 32, 1180) - edge * 2;
    if (!portrait && w * 2 > availW) { w = Math.floor(availW / 2); h = Math.round(w * 1.46); }
    else if (portrait && w > availW) { w = availW; h = Math.round(w * 1.46); }
    pageW = w; pageH = h;
  }
  function buildMeasurer() {
    if (measurer) measurer.remove();
    measurer = el("div", "page page--text");
    measurer.style.cssText = "position:absolute;left:-10000px;top:0;width:" + pageW + "px;height:" + pageH + "px;";
    var inner = el("div", "page-inner");
    measureBody = el("div", "page-body");
    measureBody.style.cssText = "flex:1;min-height:0;overflow:hidden;";
    var folio = el("div", "page-folio", '<span>&nbsp;</span><span class="folio-num">0</span>');
    inner.appendChild(measureBody); inner.appendChild(folio);
    measurer.appendChild(inner); document.body.appendChild(measurer);
    availH = measureBody.clientHeight;
  }
  function fits() { return measureBody.scrollHeight <= availH + 1; }
  function paginate(blocks) {
    var leaves = [], cur = [];
    measureBody.innerHTML = "";
    blocks.forEach(function (b) {
      measureBody.appendChild(b);
      if (fits()) { cur.push(b); return; }
      measureBody.removeChild(b);
      if (cur.length === 0) { cur.push(b); measureBody.appendChild(b); return; }
      leaves.push(cur); cur = [b];
      measureBody.innerHTML = ""; measureBody.appendChild(b);
    });
    if (cur.length) leaves.push(cur);
    return leaves;
  }
  function buildChapterLeaves() {
    var out = [];
    BOOK.chapters.forEach(function (ch) {
      var linked = [];
      var blocks = [chapterHeadEl(ch)];
      ch.entries.forEach(function (entry, i) {
        (entry.placeIds || []).forEach(function (id) { if (linked.indexOf(id) === -1) linked.push(id); });
        blocks.push(recordEl(entry, i + 1));
      });
      var leaves = paginate(blocks);
      var strip = alsoStripEl(ch, linked);
      if (strip) {
        var last = leaves[leaves.length - 1];
        measureBody.innerHTML = "";
        last.forEach(function (n) { measureBody.appendChild(n); });
        measureBody.appendChild(strip);
        if (fits()) last.push(strip); else leaves.push([strip]);
      }
      leaves.forEach(function (nodes, idx) {
        out.push({ title: ch.title, number: ch.number, first: idx === 0, nodes: nodes });
      });
    });
    return out;
  }

  // ---- final pages ----
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
    s.inner.innerHTML = '<h2 class="toc-title">Contents</h2><ul class="toc-entries">' + rows + "</ul>";
    return s.page;
  }
  function colophonPage() {
    var s = pageShell("back");
    s.inner.innerHTML =
      '<div class="leaf-centered"><p class="ornament">&#10059;</p><p>' + esc(BOOK.colophon) + "</p></div>";
    return s.page;
  }
  function textLeafPage(leaf, folioNum) {
    var s = pageShell("text");
    var body = el("div", "page-body");
    body.style.cssText = "flex:1;min-height:0;overflow:hidden;";
    leaf.nodes.forEach(function (n) { body.appendChild(n); });
    var folio = el("div", "page-folio",
      '<span class="run-head"><em>' + esc(leaf.title) + "</em></span>" +
      '<span class="folio-num">' + folioNum + "</span>");
    s.inner.appendChild(body); s.inner.appendChild(folio);
    return s.page;
  }

  // ---- plain (accessible) mode ----
  function buildPlain() {
    plainEl.innerHTML = "";
    BOOK.chapters.forEach(function (ch) {
      var art = el("article", "plain-story");
      var html =
        '<span class="ch-kicker">Chapter ' + (ROMAN[ch.number] || ch.number) + "</span>" +
        "<h2>" + esc(ch.title) + "</h2>" +
        '<span class="ch-sub">The places, in Joyce’s own words</span>';
      var linked = [];
      ch.entries.forEach(function (e, i) {
        (e.placeIds || []).forEach(function (id) { if (linked.indexOf(id) === -1) linked.push(id); });
        html += '<p class="rec-quote plain"><span class="rec-no">' + (i + 1) + "</span>" + quoted(e.text) + "</p>";
      });
      art.innerHTML = html;
      var strip = alsoStripEl(ch, linked);
      if (strip) art.appendChild(strip);
      plainEl.appendChild(art);
    });
  }

  // ---- assemble & init ----
  function sizeCase() {
    var edge = portrait ? 18 : 30;
    var w = (portrait ? pageW : pageW * 2) + edge * 2;
    var h = pageH + edge * 2;
    bookCase.style.width = w + "px";
    bookCase.style.height = h + "px";
    bookCase.style.setProperty("--edge", edge + "px");
    bookCase.classList.toggle("is-portrait", portrait);
  }

  function build() {
    computePageSize();
    buildMeasurer();
    var leaves = buildChapterLeaves();

    var FRONT = 3; // cover, blurb, contents
    var entries = [], folio = 0;
    chapterStartIndex = {};
    leaves.forEach(function (leaf, i) {
      folio += 1; leaf.folio = folio;
      if (leaf.first) {
        var idx = FRONT + i;
        chapterStartIndex[leaf.number] = idx;
        entries.push({ number: leaf.number, title: leaf.title, index: idx, folio: folio });
      }
    });

    flipEl.innerHTML = "";
    var pages = [coverPage(), blurbPage(), contentsPage(entries)];
    contentsIndex = 2;
    leaves.forEach(function (leaf) { pages.push(textLeafPage(leaf, leaf.folio)); });
    pages.push(colophonPage());
    pages.forEach(function (p) { flipEl.appendChild(p); });

    measurer.remove(); measurer = null;
    sizeCase();

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
    pageFlip.on("changeState", updateNav);
    updateProgress();
  }

  function pageCount() { return pageFlip ? pageFlip.getPageCount() : 0; }
  function current() { return pageFlip ? pageFlip.getCurrentPageIndex() : 0; }
  function updateProgress() {
    if (!pageFlip) return;
    elProgress.textContent = "Leaf " + (current() + 1) + " of " + pageCount();
    updateNav();
  }
  function updateNav() {
    if (!pageFlip) return;
    elPrev.disabled = current() <= 0;
    elNext.disabled = current() >= pageCount() - 1;
  }
  function goPrev() { if (pageFlip) pageFlip.flipPrev(); }
  function goNext() { if (pageFlip) pageFlip.flipNext(); }
  function flipTo(i) { if (pageFlip) pageFlip.flip(i); }

  // plain / book toggle
  var plainMode = false;
  function setMode(plain) {
    plainMode = plain;
    stage.hidden = plain;
    plainEl.hidden = !plain;
    elMode.textContent = plain ? "Read as a flip-book" : "Read as plain text";
    elMode.setAttribute("aria-pressed", String(plain));
    [elPrev, elNext, elContents].forEach(function (b) { b.disabled = plain; });
    if (!plain) updateNav();
  }

  // ---- modal (reused) ----
  var lastFocused = null;
  function openModal(id, trigger) {
    var l = byId[id]; if (!l) return;
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
        '<path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"/></svg></a>' : "";
    modalBody.innerHTML =
      '<p class="loc-modal__tag">' + esc(l.categoryLabel) + "</p>" +
      '<h2 class="loc-modal__title" id="loc-modal-title">' + esc(l.name) + "</h2>" +
      '<div class="loc-modal__stories">' + storiesHtml + "</div>" +
      '<p class="loc-modal__desc">' + esc(l.description) + "</p>" +
      (mapHtml ? '<div class="loc-modal__actions">' + mapHtml + "</div>" : "");
    modalBody.querySelectorAll(".story-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var num = null;
        BOOK.chapters.forEach(function (c) { if (c.title === chip.dataset.story) num = c.number; });
        closeModal();
        if (!plainMode && num != null && chapterStartIndex[num] != null) flipTo(chapterStartIndex[num]);
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

  // delegation
  document.addEventListener("click", function (e) {
    var mention = e.target.closest(".loc-mention, .place-chip");
    if (mention) { e.preventDefault(); openModal(mention.dataset.id, mention); return; }
    var tl = e.target.closest(".toc-link");
    if (tl) { e.preventDefault(); flipTo(parseInt(tl.dataset.flip, 10)); }
  });
  document.addEventListener("keydown", function (e) {
    if (!modal.hidden || plainMode) return;
    if (e.key === "ArrowLeft") goPrev();
    else if (e.key === "ArrowRight") goNext();
  });

  elPrev.addEventListener("click", goPrev);
  elNext.addEventListener("click", goNext);
  elContents.addEventListener("click", function () { flipTo(contentsIndex); });
  elMode.addEventListener("click", function () { setMode(!plainMode); });
  modalClose.addEventListener("click", closeModal);
  modal.querySelector(".loc-modal__backdrop").addEventListener("click", closeModal);

  var rt = null;
  window.addEventListener("resize", function () {
    if (plainMode) return;
    clearTimeout(rt);
    rt = setTimeout(function () {
      var pw = pageW, ph = pageH;
      computePageSize();
      if (Math.abs(pageW - pw) > 16 || Math.abs(pageH - ph) > 16) build();
    }, 300);
  });

  buildPlain();
  function boot() {
    if (typeof St === "undefined" || !St.PageFlip) {
      console.warn("book.js: StPageFlip unavailable, using plain mode.");
      elMode.hidden = true; setMode(true); stage.hidden = true; return;
    }
    build(); setMode(false);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot).catch(boot);
  else boot();
})();
