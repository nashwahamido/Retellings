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
  var elChapter = document.getElementById("book-chapter");
  var elHero = document.getElementById("book-hero");
  var elToggle = document.getElementById("book-toggle");
  var elControls = document.getElementById("book-controls");
  var elProgress = document.getElementById("book-progress");


  var pageFlip = null, contentsIndex = 0, chapterStartIndex = {}, portrait = false;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // [[display|Name]] -> clickable mention (escapes everything else)
  // escape running text; Gutenberg marks italics as _word_
  function prose(t) { return esc(t).replace(/_([^_]+)_/g, "<em>$1</em>"); }
  function renderProse(text) {
    var out = "", last = 0, re = /\[\[([^\]]+)\]\]/g, m;
    while ((m = re.exec(text))) {
      out += prose(text.slice(last, m.index));
      var parts = m[1].split("|");
      var display = parts[0], key = parts.length > 1 ? parts[1] : parts[0];
      var loc = byName[norm(key)];
      out += loc
        ? '<button type="button" class="loc-mention" data-id="' + esc(loc.id) + '" aria-haspopup="dialog">' + esc(display) + "</button>"
        : esc(display);
      last = m.index + m[0].length;
    }
    out += prose(text.slice(last));
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
        '<span class="tl-main"><span class="tl-title">' + esc(e.title) + '</span><span class="tl-leader" aria-hidden="true"></span></span>' +
        '<span class="tl-folio">' + e.folio + "</span></button></li>";
    }).join("");
    s.inner.innerHTML =
      '<div class="toc-head">' +
        '<span class="toc-kicker">' + esc(BOOK.title) + "</span>" +
        '<h2 class="toc-title">Contents</h2>' +
        '<div class="toc-orn" aria-hidden="true"><span></span><i></i><span></span></div>' +
      "</div>" +
      '<ol class="toc-entries">' + rows + "</ol>";
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
    var toc = el("article", "plain-story plain-toc");
    toc.id = "plain-ch-0";
    toc.innerHTML =
      '<span class="ch-kicker">' + esc(BOOK.title) + "</span><h2>Contents</h2>" +
      '<span class="ch-sub">Choose a story to read the places it names</span>' +
      '<ol class="plain-toc-list">' + BOOK.chapters.map(function (c) {
        return '<li><button type="button" class="plain-toc-link" data-ch="' + c.number + '">' +
          '<span class="tl-num">' + (ROMAN[c.number] || c.number) + "</span>" +
          '<span class="tl-title">' + esc(c.title) + "</span>" +
          '<span class="tl-count">' + c.entries.length + (c.entries.length === 1 ? " passage" : " passages") + "</span></button></li>";
      }).join("") + "</ol>";
    plainEl.appendChild(toc);
    BOOK.chapters.forEach(function (ch) {
      var art = el("article", "plain-story");
      art.id = "plain-ch-" + ch.number;
      var html =
        '<span class="ch-kicker">Chapter ' + (ROMAN[ch.number] || ch.number) + "</span>" +
        "<h2>" + esc(ch.title) + "</h2>" +
        '<span class="ch-sub">The places, in Joyce’s own words</span>';
      var linked = [];
      ch.entries.forEach(function (e, i) {
        (e.placeIds || []).forEach(function (id) { if (linked.indexOf(id) === -1) linked.push(id); });
        html += '<p class="rec-quote plain"><span class="rec-no">' + (i + 1) + '</span><span class="rec-text">' + quoted(e.text) + "</span></p>";
      });
      art.innerHTML = html;
      var strip = alsoStripEl(ch, linked);
      if (strip) art.appendChild(strip);
      plainEl.appendChild(art);
    });
    plainEl.addEventListener("click", function (e) {
      var b = e.target.closest(".plain-toc-link");
      if (b) showPlain(parseInt(b.dataset.ch, 10));
    });
    if (window.LocWindows) LocWindows.sync();
  }

  // plain mode shows one chapter (or the contents, 0) at a time, like the book
  var plainCurrent = 1;
  var LAST = BOOK.chapters.length;
  function showPlain(n) {
    plainCurrent = Math.max(0, Math.min(LAST, n));
    plainEl.querySelectorAll(".plain-story").forEach(function (a) {
      a.hidden = a.id !== "plain-ch-" + plainCurrent;
    });
    elPrev.disabled = plainCurrent <= 0;
    elNext.disabled = plainCurrent >= LAST;
    elContents.disabled = plainCurrent === 0;
    elProgress.textContent = plainCurrent === 0 ? "Contents" : "Chapter " + ROMAN[plainCurrent] + " of " + ROMAN[LAST];
    if (elChapter && plainCurrent > 0) elChapter.value = String(plainCurrent);
    var top = plainEl.getBoundingClientRect().top + window.scrollY - 24;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
    var h = plainEl.querySelector("#plain-ch-" + plainCurrent + " h2");
    if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
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

    var FRONT = 2; // blurb, contents (no closed cover — the 3D book is the cover)
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
    var pages = [blurbPage(), contentsPage(entries)];
    contentsIndex = 1;
    leaves.forEach(function (leaf) { pages.push(textLeafPage(leaf, leaf.folio)); });
    pages.forEach(function (p) { flipEl.appendChild(p); });

    measurer.remove(); measurer = null;
    sizeCase();

    if (pageFlip) { try { pageFlip.destroy(); } catch (e) {} pageFlip = null; }
    pageFlip = new St.PageFlip(flipEl, {
      width: pageW, height: pageH, size: "fixed",
      showCover: false, usePortrait: true, mobileScrollSupport: false,
      maxShadowOpacity: 0.5, drawShadow: true, flippingTime: 650,
      clickEventForward: true, useMouseEvents: true, swipeDistance: 30,
      showPageCorners: true, disableFlipByClick: true
    });
    pageFlip.loadFromHTML(flipEl.querySelectorAll(".page"));
    if (window.LocWindows) LocWindows.sync(); // mark saved places on the new pages
    pageFlip.on("flip", updateProgress);
    pageFlip.on("changeState", updateNav);
    updateProgress();
  }

  function pageCount() { return pageFlip ? pageFlip.getPageCount() : 0; }
  function current() { return pageFlip ? pageFlip.getCurrentPageIndex() : 0; }
  function updateProgress() {
    if (!pageFlip || plainMode) return;
    elProgress.textContent = "Leaf " + (current() + 1) + " of " + pageCount();
    syncChapterSelect();
    updateNav();
  }
  function updateNav() {
    if (!pageFlip || plainMode) return;
    if (!plainMode && !isOpen()) { setReadingControls(false); return; } // 3D view: controls greyed out
    elPrev.disabled = current() <= 0;
    elNext.disabled = current() >= pageCount() - 1;
  }
  // page-turning controls only act on the open book; grey them out otherwise
  function setReadingControls(on) {
    [elPrev, elNext, elContents].forEach(function (b) { b.disabled = !on; });
    if (elChapter) elChapter.disabled = !on && !plainMode;
    if (elControls) elControls.classList.toggle("is-closed", !on && !plainMode);
  }
  function goPrev() { if (plainMode) showPlain(plainCurrent - 1); else if (pageFlip) pageFlip.flipPrev(); }
  function goNext() { if (plainMode) showPlain(plainCurrent + 1); else if (pageFlip) pageFlip.flipNext(); }
  function flipTo(i) {
    if (!pageFlip) return;
    // single-page (phone) mode ignores animated jumps to distant pages: go directly
    if (portrait) { try { pageFlip.turnToPage(i); } catch (e) {} updateProgress(); }
    else pageFlip.flip(i);
  }

  // ---- chapter navigator (works in book and plain mode) ----
  function populateChapters() {
    if (!elChapter) return;
    elChapter.innerHTML = BOOK.chapters.map(function (c) {
      return '<option value="' + c.number + '">' + (ROMAN[c.number] || c.number) + ". " + esc(c.title) + "</option>";
    }).join("");
  }
  function chapterForIndex(i) {
    var best = null;
    BOOK.chapters.forEach(function (c) {
      var idx = chapterStartIndex[c.number];
      if (idx != null && idx <= i && (best === null || idx > chapterStartIndex[best])) best = c.number;
    });
    return best;
  }
  function syncChapterSelect() {
    if (!elChapter || plainMode) return;
    var num = chapterForIndex(current());
    if (num != null) elChapter.value = String(num);
  }
  function jumpToChapter(num) {
    if (plainMode) {
      showPlain(num);
    } else if (chapterStartIndex[num] != null) {
      flipTo(chapterStartIndex[num]);
    }
  }

  // plain / book toggle
  var plainMode = false;
  function setMode(plain) {
    plainMode = plain;
    stage.hidden = plain;
    plainEl.hidden = !plain;
    elMode.textContent = plain ? "Read as a flip-book" : "Read as plain text";
    elMode.setAttribute("aria-pressed", String(plain));
    if (elToggle) elToggle.hidden = plain;
    if (elChapter) elChapter.disabled = false;
    if (elControls) elControls.classList.remove("is-closed");
    if (plain) {
      var from = (pageFlip && isOpen()) ? chapterForIndex(current()) : null;
      showPlain(from || plainCurrent || 1);
    } else {
      [elPrev, elNext, elContents].forEach(function (b) { b.disabled = false; });
      if (elChapter && plainCurrent > 0 && chapterStartIndex[plainCurrent] != null && isOpen()) flipTo(chapterStartIndex[plainCurrent]);
      updateProgress();
      updateNav();
    }
  }

  // place windows live in loc-windows.js; story chips flip the book here
  if (window.LocWindows) {
    LocWindows.onStory = function (title) {
      var num = null;
      BOOK.chapters.forEach(function (c) { if (c.title === title) num = c.number; });
      if (num == null) return;
      if (plainMode) { jumpToChapter(num); return; }
      if (!isOpen()) openBook();
      if (chapterStartIndex[num] != null) flipTo(chapterStartIndex[num]);
    };
  }
  function windowsOpen() { return window.LocWindows ? LocWindows.count() : 0; }

  // delegation
  document.addEventListener("click", function (e) {
    var mention = e.target.closest(".loc-mention, .place-chip");
    if (mention) { e.preventDefault(); if (window.LocWindows) LocWindows.open(mention.dataset.id, mention); return; }
    var tl = e.target.closest(".toc-link");
    if (tl) { e.preventDefault(); flipTo(parseInt(tl.dataset.flip, 10)); }
  });
  document.addEventListener("keydown", function (e) {
    if (windowsOpen()) return;
    if (plainMode && /^(INPUT|SELECT|TEXTAREA|BUTTON|SUMMARY|AUDIO)$/.test((e.target.tagName || ""))) return;
    if (e.key === "ArrowLeft") goPrev();
    else if (e.key === "ArrowRight") goNext();
  });

  elPrev.addEventListener("click", goPrev);
  elNext.addEventListener("click", goNext);
  elContents.addEventListener("click", function () { if (plainMode) showPlain(0); else flipTo(contentsIndex); });
  elMode.addEventListener("click", function () { setMode(!plainMode); });
  if (elChapter) elChapter.addEventListener("change", function () {
    var num = parseInt(this.value, 10);
    if (!plainMode && !isOpen()) {
      // opening from the 3D view: go straight to the chapter (an animated
      // turn requested in the same moment as opening gets dropped)
      openBook();
      if (pageFlip && chapterStartIndex[num] != null) { try { pageFlip.turnToPage(chapterStartIndex[num]); } catch (e) {} updateProgress(); }
      return;
    }
    jumpToChapter(num);
  });

  // 3D book object <-> flat reading view; one toggle button reads Open/Close
  function isOpen() { return stage.classList.contains("is-open"); }
  function openBook() {
    stage.classList.add("is-open");
    setReadingControls(true);
    if (elToggle) { elToggle.textContent = "Put it down"; elToggle.setAttribute("aria-pressed", "true"); }
    // go straight into the stories: open on Chapter I (no closed-cover view)
    if (pageFlip && chapterStartIndex[1] != null && current() < chapterStartIndex[1]) {
      try { pageFlip.turnToPage(chapterStartIndex[1]); } catch (e) {}
    }
    updateProgress();
  }
  function closeBook() {
    document.documentElement.classList.remove("read-now");
    stage.classList.remove("is-open");
    setReadingControls(false);
    if (elToggle) { elToggle.textContent = "View the book"; elToggle.setAttribute("aria-pressed", "false"); }
  }
  if (elHero) elHero.addEventListener("click", openBook);
  if (elToggle) elToggle.addEventListener("click", function () { isOpen() ? closeBook() : openBook(); });

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
  populateChapters();
  function boot() {
    if (typeof St === "undefined" || !St.PageFlip) {
      console.warn("book.js: StPageFlip unavailable, using plain mode.");
      elMode.hidden = true; setMode(true); stage.hidden = true; return;
    }
    build(); setMode(false);
    // arriving from the Cover ("Open the book") or embedded: open straight into the stories
    var root = document.documentElement;
    if (location.hash === "#read" || root.classList.contains("embed")) {
      openBook();
      if (!root.classList.contains("embed")) {
        var top = stage.getBoundingClientRect().top + window.scrollY - 16;
        window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
      }
    }
    root.classList.remove("read-now");
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot).catch(boot);
  else boot();
})();
