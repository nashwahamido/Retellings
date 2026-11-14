/* =====================================================================
   tour.js — the My Tour planner
   The visitor's saved places (TourStore) as an ordered list beside a
   Leaflet map: numbered pins and a route line for saved stops, faint pins
   for every other place. List and map highlight each other; stops can be
   reordered (drag, or the arrow buttons) and removed; distance and walking
   time are estimated. The suggested walk can be loaded in one click.
   Needs: tour-store.js, loc-windows.js, leaflet.js, tour-data.js.
   ===================================================================== */
(function () {
  "use strict";
  if (!window.L || !window.TourStore || !window.Places) return;

  var WALK_KMH = 4.5;        // easy walking pace
  var STREET_FACTOR = 1.3;   // straight line -> street distance, roughly
  var DUBLIN = [53.3455, -6.2615];

  var listEl = document.getElementById("stop-list");
  var emptyEl = document.getElementById("planner-empty");
  var totalsEl = document.getElementById("planner-totals");
  var countEl = document.getElementById("planner-count");
  var distEl = document.getElementById("pt-distance");
  var timeEl = document.getElementById("pt-time");
  var addEl = document.getElementById("add-place");
  var tabMine = document.getElementById("tab-mine");
  var tabSuggested = document.getElementById("tab-suggested");

  // which tour is on screen: the visitor's own ("mine") or our suggested walk.
  // Viewing the suggested walk never changes the visitor's saved tour.
  var VIEW_KEY = "retellings.tour.view";
  var view = "mine";
  try { if (localStorage.getItem(VIEW_KEY) === "suggested") view = "suggested"; } catch (e) {}
  function suggestedIds() { return (window.SUGGESTED_TOUR && SUGGESTED_TOUR.stops) || []; }
  function editable() { return view === "mine"; }

  // ---- on-page dialog (replaces the browser's confirm) ----
  function confirmDialog(opts) {
    return new Promise(function (resolve) {
      var opener = document.activeElement;
      var back = document.createElement("div");
      back.className = "deco-dialog-backdrop";
      back.innerHTML =
        '<div class="deco-dialog" role="alertdialog" aria-modal="true" aria-labelledby="dd-title" aria-describedby="dd-msg">' +
          '<h2 class="dd-title" id="dd-title">' + esc(opts.title) + "</h2>" +
          '<p class="dd-msg" id="dd-msg">' + esc(opts.message) + "</p>" +
          '<div class="dd-actions">' +
            '<button type="button" class="book-btn" data-dd="cancel">' + esc(opts.cancel || "Cancel") + "</button>" +
            '<button type="button" class="book-btn dd-danger" data-dd="ok">' + esc(opts.confirm || "OK") + "</button>" +
          "</div>" +
        "</div>";
      document.body.appendChild(back);
      var btns = back.querySelectorAll("[data-dd]");
      function done(v) {
        document.removeEventListener("keydown", onKey, true);
        back.remove();
        if (opener && opener.focus && document.contains(opener)) opener.focus();
        resolve(v);
      }
      function onKey(e) {
        if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); done(false); }
        else if (e.key === "Tab") { // keep focus inside the dialog
          e.preventDefault();
          (document.activeElement === btns[0] ? btns[1] : btns[0]).focus();
        }
      }
      document.addEventListener("keydown", onKey, true);
      back.addEventListener("click", function (e) {
        var b = e.target.closest("[data-dd]");
        if (b) done(b.dataset.dd === "ok");
        else if (e.target === back) done(false);
      });
      btns[0].focus(); // the safe choice has focus
    });
  }

  // ---- brief notice, optionally with an action (e.g. Undo) ----
  var toastTimer = null;
  function toast(message, actionLabel, action) {
    var t = document.getElementById("deco-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "deco-toast"; t.className = "deco-toast";
      t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite");
      document.body.appendChild(t);
    }
    t.innerHTML = '<span>' + esc(message) + "</span>" +
      (actionLabel ? '<button type="button" class="dt-action">' + esc(actionLabel) + "</button>" : "");
    if (actionLabel) t.querySelector(".dt-action").addEventListener("click", function () { hide(); action(); });
    t.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hide, actionLabel ? 7000 : 3500);
    function hide() { t.classList.remove("is-shown"); }
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ---- distances ----
  function km(a, b) {
    var R = 6371, toR = Math.PI / 180;
    var dLat = (b.lat - a.lat) * toR, dLng = (b.lng - a.lng) * toR;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h)) * STREET_FACTOR;
  }
  function fmtDist(k) { return k < 1 ? Math.round(k * 1000 / 10) * 10 + " m" : k.toFixed(k < 10 ? 1 : 0) + " km"; }
  function fmtTime(k) {
    var mins = Math.max(1, Math.round(k / WALK_KMH * 60));
    if (mins < 60) return mins + " min";
    var h = Math.floor(mins / 60), m = mins % 60;
    return h + " h" + (m ? " " + m + " min" : "");
  }

  // ---- map ----
  var map = L.map("tour-map", { scrollWheelZoom: false, zoomControl: true }).setView(DUBLIN, 14);
  var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  // wheel-zoom only after the visitor engages with the map (so the page scrolls normally)
  map.on("focus click", function () { map.scrollWheelZoom.enable(); });
  map.getContainer().addEventListener("mouseleave", function () { map.scrollWheelZoom.disable(); });

  var placeLayer = L.layerGroup().addTo(map);
  var stopLayer = L.layerGroup().addTo(map);
  var route = L.polyline([], { className: "tour-route", weight: 3, dashArray: "2 8", lineCap: "round" }).addTo(map);
  var stopMarkers = {}; // id -> marker
  var hot = null;

  function placeIcon() {
    return L.divIcon({ className: "pin-place", html: "<span></span>", iconSize: [14, 14], iconAnchor: [7, 7] });
  }
  function stopIcon(n) {
    return L.divIcon({ className: "pin-stop", html: "<span>" + n + "</span>", iconSize: [34, 34], iconAnchor: [17, 17] });
  }

  // ---- highlight list <-> map ----
  function setHot(id, scroll) {
    if (hot === id) return;
    if (hot) {
      var oldRow = listEl.querySelector('[data-id="' + hot + '"]');
      if (oldRow) oldRow.classList.remove("is-hot");
      if (stopMarkers[hot] && stopMarkers[hot]._icon) stopMarkers[hot]._icon.classList.remove("is-hot");
    }
    hot = id;
    if (!id) return;
    var row = listEl.querySelector('[data-id="' + id + '"]');
    if (row) {
      row.classList.add("is-hot");
      if (scroll) row.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    var m = stopMarkers[id];
    if (m && m._icon) { m._icon.classList.add("is-hot"); m.setZIndexOffset(1000); }
  }

  // ---- render ----
  var lastIds = null;
  function render(fit) {
    var ids = (editable() ? TourStore.list() : suggestedIds()).filter(function (id) { return Places.get(id); });
    var stops = ids.map(function (id) { return Places.get(id); });
    currentStops = stops;

    // list
    listEl.innerHTML = "";
    var total = 0;
    stops.forEach(function (p, i) {
      if (i > 0) {
        var leg = km(stops[i - 1], p); total += leg;
        var legEl = document.createElement("li");
        legEl.className = "stop-leg";
        legEl.setAttribute("aria-hidden", "true");
        legEl.textContent = fmtDist(leg) + " · " + fmtTime(leg) + " walk";
        listEl.appendChild(legEl);
      }
      var li = document.createElement("li");
      li.className = "stop";
      li.dataset.id = p.id;
      li.dataset.index = i;
      li.draggable = editable();
      li.innerHTML =
        '<span class="stop-num" aria-hidden="true">' + (i + 1) + "</span>" +
        '<span class="stop-main">' +
          '<button type="button" class="stop-name">' + esc(p.name) + "</button>" +
          '<span class="stop-sub">' + esc(p.categoryLabel) + (p.stories && p.stories.length ? " · " + esc(p.stories[0]) : "") + "</span>" +
          (p.description ? '<span class="stop-print-desc">' + esc(shorten(p.description, 170)) + "</span>" : "") +
        "</span>" +
        (editable() ? '<span class="stop-tools">' +
          '<button type="button" class="stop-tool" data-act="up" aria-label="Move ' + esc(p.name) + ' earlier"' + (i === 0 ? " disabled" : "") + ">&#9650;</button>" +
          '<button type="button" class="stop-tool" data-act="down" aria-label="Move ' + esc(p.name) + ' later"' + (i === stops.length - 1 ? " disabled" : "") + ">&#9660;</button>" +
          '<button type="button" class="stop-tool stop-remove" data-act="remove" aria-label="Remove ' + esc(p.name) + ' from your tour">&times;</button>' +
        "</span>" : "");
      listEl.appendChild(li);
    });
    emptyEl.hidden = stops.length > 0 || !editable();
    syncViewChrome(ids);
    totalsEl.hidden = stops.length < 2;
    countEl.textContent = stops.length ? stops.length + (stops.length === 1 ? " stop" : " stops") : "";
    distEl.textContent = fmtDist(total);
    timeEl.textContent = fmtTime(total);

    // map: faint pins for unsaved places, numbered pins for stops, route line
    placeLayer.clearLayers(); stopLayer.clearLayers(); stopMarkers = {};
    Places.all().forEach(function (p) {
      if (p.lat == null || ids.indexOf(p.id) !== -1) return;
      L.marker([p.lat, p.lng], { icon: placeIcon(), title: p.name, keyboard: true })
        .on("click", function () { LocWindows.open(p.id); })
        .addTo(placeLayer);
    });
    stops.forEach(function (p, i) {
      if (p.lat == null) return;
      var m = L.marker([p.lat, p.lng], { icon: stopIcon(i + 1), title: (i + 1) + ". " + p.name, keyboard: true, riseOnHover: true })
        .on("mouseover", function () { setHot(p.id, false); })
        .on("mouseout", function () { setHot(null); })
        .on("click", function () { setHot(p.id, true); LocWindows.open(p.id); })
        .addTo(stopLayer);
      stopMarkers[p.id] = m;
    });
    route.setLatLngs(stops.filter(function (p) { return p.lat != null; }).map(function (p) { return [p.lat, p.lng]; }));
    hot = null;

    // fit the view when the set of stops changes (not on a simple reorder)
    var key = ids.slice().sort().join("|");
    if (fit || key !== lastIds) {
      var pts = stops.filter(function (p) { return p.lat != null; }).map(function (p) { return [p.lat, p.lng]; });
      if (pts.length > 1) map.fitBounds(pts, { padding: [40, 40], maxZoom: 16 });
      else if (pts.length === 1) map.setView(pts[0], 16);
      else map.setView(DUBLIN, 14);
    }
    lastIds = key;
    drawNearby();
    syncTakeAway();
    fillAddSelect(TourStore.list());
  }

  // ---- "add a place" list (every place not yet saved) ----
  function fillAddSelect(ids) {
    var opts = Places.all()
      .filter(function (p) { return ids.indexOf(p.id) === -1; })
      .sort(function (a, b) { return a.name.localeCompare(b.name); })
      .map(function (p) { return '<option value="' + esc(p.id) + '">' + esc(p.name) + "</option>"; });
    addEl.innerHTML = '<option value="">Choose a place…</option>' + opts.join("");
  }
  addEl.addEventListener("change", function () {
    if (this.value) TourStore.add(this.value);
  });

  // ---- list interactions ----
  listEl.addEventListener("click", function (e) {
    var row = e.target.closest(".stop"); if (!row) return;
    var i = parseInt(row.dataset.index, 10), id = row.dataset.id;
    var tool = e.target.closest("[data-act]");
    if (tool) {
      var act = tool.dataset.act;
      if (act === "up") TourStore.move(i, i - 1);
      else if (act === "down") TourStore.move(i, i + 1);
      else if (act === "remove") TourStore.remove(id);
      // keep keyboard focus on the moved stop's same control
      if (act !== "remove") requestAnimationFrame(function () {
        var moved = listEl.querySelector('[data-id="' + id + '"] [data-act="' + act + '"]');
        (moved && !moved.disabled ? moved : listEl.querySelector('[data-id="' + id + '"] .stop-name')).focus();
      });
      return;
    }
    // the row itself: show it on the map; the name also opens its window
    var m = stopMarkers[id];
    if (m) map.panTo(m.getLatLng());
    setHot(id, false);
    if (e.target.closest(".stop-name")) LocWindows.open(id, e.target.closest(".stop-name"));
  });
  listEl.addEventListener("mouseover", function (e) {
    var row = e.target.closest(".stop"); if (row) setHot(row.dataset.id, false);
  });
  listEl.addEventListener("mouseleave", function () { setHot(null); });
  listEl.addEventListener("focusin", function (e) {
    var row = e.target.closest(".stop"); if (row) setHot(row.dataset.id, false);
  });

  // drag to reorder (mouse); the arrow buttons cover touch and keyboard
  var dragFrom = null;
  listEl.addEventListener("dragstart", function (e) {
    var row = e.target.closest(".stop"); if (!row) return;
    dragFrom = parseInt(row.dataset.index, 10);
    row.classList.add("is-dragging");
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", row.dataset.id); } catch (err) {}
  });
  listEl.addEventListener("dragover", function (e) {
    if (dragFrom === null) return;
    var row = e.target.closest(".stop"); if (!row) return;
    e.preventDefault();
    listEl.querySelectorAll(".drop-before, .drop-after").forEach(function (r) { r.classList.remove("drop-before", "drop-after"); });
    var r = row.getBoundingClientRect();
    row.classList.add(e.clientY < r.top + r.height / 2 ? "drop-before" : "drop-after");
  });
  listEl.addEventListener("drop", function (e) {
    if (dragFrom === null) return;
    var row = e.target.closest(".stop"); if (!row) return;
    e.preventDefault();
    var to = parseInt(row.dataset.index, 10);
    if (row.classList.contains("drop-after")) to += 1;
    if (to > dragFrom) to -= 1;
    var from = dragFrom; dragFrom = null;
    TourStore.move(from, to);
  });
  listEl.addEventListener("dragend", function () {
    dragFrom = null;
    listEl.querySelectorAll(".is-dragging, .drop-before, .drop-after").forEach(function (r) {
      r.classList.remove("is-dragging", "drop-before", "drop-after");
    });
  });

  // ---- tabs: my tour / suggested walk ----
  var noteEl = document.getElementById("planner-note");
  var headingEl = document.getElementById("planner-heading");
  function syncViewChrome(ids) {
    var mine = editable();
    tabMine.setAttribute("aria-selected", String(mine));
    tabSuggested.setAttribute("aria-selected", String(!mine));
    tabMine.tabIndex = mine ? 0 : -1; tabSuggested.tabIndex = mine ? -1 : 0;
    var n = TourStore.count();
    tabMine.textContent = "My tour" + (n ? " (" + n + ")" : "");
    headingEl.textContent = mine ? "Your stops" : "The suggested walk";
    noteEl.textContent = mine
      ? "Saved automatically in this browser — come back any time."
      : "Our route from the James Joyce Centre to Kennedy’s. Looking at it doesn’t change your own tour.";
    document.getElementById("planner-add").hidden = !mine;
    document.getElementById("actions-mine").hidden = !mine;
    document.getElementById("clear-tour").disabled = !n;
    document.getElementById("best-order").disabled = n < 3;
    document.getElementById("actions-suggested").hidden = mine;
    document.getElementById("suggested-card").hidden = mine;
    var missing = suggestedIds().filter(function (id) { return !TourStore.has(id); }).length;
    var copy = document.getElementById("copy-suggested");
    copy.disabled = !missing;
    copy.textContent = missing ? "Add " + (missing === suggestedIds().length ? "these stops" : "the " + missing + " missing stops") + " to my tour" : "All in your tour";
  }
  function setView(v) {
    view = v;
    try { localStorage.setItem(VIEW_KEY, v); } catch (e) {}
    render(true);
  }
  tabMine.addEventListener("click", function () { setView("mine"); });
  tabSuggested.addEventListener("click", function () { setView("suggested"); });
  [tabMine, tabSuggested].forEach(function (t) {
    t.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      var other = t === tabMine ? tabSuggested : tabMine;
      other.focus(); other.click();
    });
  });
  document.addEventListener("click", function (e) {
    var g = e.target.closest("[data-goto]");
    if (g) { e.preventDefault(); setView(g.dataset.goto); tabSuggested.focus(); }
  });

  // ---- buttons ----
  document.getElementById("copy-suggested").addEventListener("click", function () {
    var before = TourStore.list();
    var added = suggestedIds().filter(function (id) { return before.indexOf(id) === -1; });
    if (!added.length) return;
    TourStore.set(before.concat(added)); // appended after the visitor's own stops
    setView("mine");
    toast("Added " + added.length + (added.length === 1 ? " stop" : " stops") + " from the suggested walk to your tour.", "Undo", function () {
      TourStore.set(before);
    });
  });
  document.getElementById("clear-tour").addEventListener("click", function () {
    var before = TourStore.list();
    if (!before.length) return;
    confirmDialog({
      title: "Clear your tour?",
      message: "This removes all " + before.length + (before.length === 1 ? " stop" : " stops") + " from your tour.",
      confirm: "Clear tour",
      cancel: "Keep my tour"
    }).then(function (ok) {
      if (!ok) return;
      TourStore.clear();
      toast("Your tour was cleared.", "Undo", function () { TourStore.set(before); });
    });
  });

  // ---- the suggested walk's intro text + welcome audio ----
  (function () {
    var tour = window.SUGGESTED_TOUR; if (!tour) return;
    document.getElementById("suggested-summary").textContent = tour.summary;
    var a = tour.intro && tour.intro.audio;
    if (a && a.length) {
      document.getElementById("suggested-audio").innerHTML =
        '<p class="win-guide-label">Welcome to the walk</p><audio controls preload="none">' +
        a.map(function (s) { return '<source src="' + esc(s.src) + '" type="' + esc(s.type) + '">'; }).join("") +
        "</audio>" +
        (tour.intro.transcript && tour.intro.transcript.length
          ? '<details class="win-transcript"><summary>Read transcript</summary>' +
            tour.intro.transcript.map(function (p) { return "<p>" + p + "</p>"; }).join("") + "</details>" : "");
    }
  })();

  // ================= best order =================
  // Shortest walk that keeps the visitor's first stop as the start:
  // nearest-neighbour, then 2-opt improvement on the open path.
  function pathKm(list) {
    var t = 0; for (var i = 1; i < list.length; i++) t += km(list[i - 1], list[i]); return t;
  }
  function bestOrder(list) {
    var pts = list.filter(function (p) { return p.lat != null; });
    var rest = list.filter(function (p) { return p.lat == null; });
    if (pts.length < 3) return list.slice();
    var route = [pts[0]], left = pts.slice(1);
    while (left.length) {
      var last = route[route.length - 1], bi = 0, bd = Infinity;
      left.forEach(function (p, i) { var d = km(last, p); if (d < bd) { bd = d; bi = i; } });
      route.push(left.splice(bi, 1)[0]);
    }
    var improved = true, guard = 0;
    while (improved && guard++ < 200) {
      improved = false;
      for (var i = 1; i < route.length - 1; i++) {
        for (var j = i + 1; j < route.length; j++) {
          var a = route[i - 1], b = route[i], c = route[j], d = route[j + 1];
          var before = km(a, b) + (d ? km(c, d) : 0);
          var after = km(a, c) + (d ? km(b, d) : 0);
          if (after + 1e-9 < before) {
            route = route.slice(0, i).concat(route.slice(i, j + 1).reverse(), route.slice(j + 1));
            improved = true;
          }
        }
      }
    }
    return route.concat(rest);
  }
  document.getElementById("best-order").addEventListener("click", function () {
    var before = TourStore.list();
    var list = before.map(function (id) { return Places.get(id); }).filter(Boolean);
    var sorted = bestOrder(list);
    var saved = pathKm(list) - pathKm(sorted);
    if (saved < 0.01) { toast("Your stops are already in the shortest order."); return; }
    TourStore.set(sorted.map(function (p) { return p.id; }));
    toast("Reordered for the shortest walk — " + fmtDist(saved) + " shorter, starting from " + sorted[0].name + ".", "Undo", function () {
      TourStore.set(before);
    });
  });

  // ================= eat & rest nearby =================
  var NEAR_KM = 0.25;
  var PINS_PER_KIND = 3;
  var KIND_LABEL = { cafe: "Café", food: "Food", pub: "Pub", wc: "Public toilets", water: "Drinking water", park: "Park" };
  var KIND_FILTER = { cafe: "cafe", food: "food", pub: "pub", wc: "wc", water: "wc", park: "park" };
  var GLYPH = {
    cafe: '<path d="M3 5h8v3a4 4 0 0 1-4 4 4 4 0 0 1-4-4z M11 6h1.5a1.5 1.5 0 0 1 0 3H11" />',
    food: '<path d="M4 2v4a1.5 1.5 0 0 0 3 0V2 M5.5 2v12 M11 2c-1.5 1-2 3-2 5h2v7" />',
    pub: '<path d="M4 3h7l-1 11H5z M4.5 6h6" />',
    wc: '<text x="7.5" y="11" text-anchor="middle" font-size="7" font-weight="700" stroke="none" fill="currentColor" font-family="Epilogue, sans-serif">WC</text>',
    water: '<path d="M7.5 2c2 3 4 5 4 7.5a4 4 0 0 1-8 0C3.5 7 5.5 5 7.5 2z" />',
    park: '<path d="M7.5 2l4 6H9.5l3 4h-10l3-4H3.5z M7.5 12v2.5" />'
  };
  var nearbyOn = false;
  var kindsOn = { cafe: true, food: true, pub: true, wc: true, park: true };
  var nearbyLayer = L.layerGroup();
  var currentStops = [];
  var toggleBtn = document.getElementById("toggle-nearby");
  var filtersEl = document.getElementById("nearby-filters");

  function nearbyIcon(kind) {
    return L.divIcon({
      className: "pin-near pin-near--" + kind,
      html: '<span><svg viewBox="0 0 15 15" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + GLYPH[kind] + "</svg></span>",
      iconSize: [22, 22], iconAnchor: [11, 11]
    });
  }
  function popupHtml(item, stopName) {
    var x = item[4] || {};
    return '<div class="near-pop"><p class="np-kind">' + esc(KIND_LABEL[item[2]]) + "</p>" +
      '<p class="np-name">' + esc(item[3] || KIND_LABEL[item[2]]) + "</p>" +
      (x.h ? '<p class="np-meta">Hours: ' + esc(x.h) + "</p>" : "") +
      (x.w ? '<p class="np-meta">Wheelchair access: ' + esc(x.w) + "</p>" : "") +
      (x.f ? '<p class="np-meta">Fee: ' + esc(x.f) + "</p>" : "") +
      '<p class="np-near">Near ' + esc(stopName) + "</p></div>";
  }
  function drawNearby() {
    nearbyLayer.clearLayers();
    listEl.querySelectorAll(".stop-nearby").forEach(function (n) { n.remove(); });
    if (!nearbyOn || !window.NEARBY) return;
    var stops = currentStops.filter(function (p) { return p.lat != null; });
    var perStop = {}, picks = {};
    NEARBY.items.forEach(function (it) {
      var f = KIND_FILTER[it[2]]; if (!kindsOn[f]) return;
      var best = null, bd = Infinity;
      stops.forEach(function (p) { var d = km({ lat: it[0], lng: it[1] }, p) / STREET_FACTOR; if (d < bd) { bd = d; best = p; } });
      if (!best || bd > NEAR_KM) return;
      var c = perStop[best.id] = perStop[best.id] || {};
      c[it[2]] = (c[it[2]] || 0) + 1;
      var key = best.id + "|" + it[2];
      (picks[key] = picks[key] || []).push({ it: it, d: bd, stop: best });
    });
    // only the closest few of each kind per stop go on the map, so it stays legible
    Object.keys(picks).forEach(function (key) {
      picks[key].sort(function (a, b) { return a.d - b.d; }).slice(0, PINS_PER_KIND).forEach(function (o) {
        var it = o.it;
        L.marker([it[0], it[1]], { icon: nearbyIcon(it[2]), zIndexOffset: -1000, title: (it[3] || KIND_LABEL[it[2]]) + " (" + KIND_LABEL[it[2]] + ")", keyboard: true })
          .bindPopup(popupHtml(it, o.stop.name), { className: "near-popup", closeButton: true })
          .addTo(nearbyLayer);
      });
    });
    // a short "nearby" line under each stop in the list
    var ORDER = ["cafe", "food", "pub", "wc", "water", "park"];
    var WORD = { cafe: ["café", "cafés"], food: ["eatery", "eateries"], pub: ["pub", "pubs"], wc: ["toilets", "toilets"], water: ["water", "water"], park: ["park", "parks"] };
    Object.keys(perStop).forEach(function (id) {
      var row = listEl.querySelector('.stop[data-id="' + id + '"] .stop-main'); if (!row) return;
      var parts = ORDER.filter(function (k) { return perStop[id][k]; }).map(function (k) {
        var n = perStop[id][k]; return (k === "wc" || k === "water") ? WORD[k][0] : n + " " + WORD[k][n === 1 ? 0 : 1];
      });
      var line = document.createElement("span");
      line.className = "stop-nearby";
      line.textContent = "Nearby: " + parts.join(" · ");
      row.appendChild(line);
    });
  }
  function setNearby(on) {
    nearbyOn = on;
    toggleBtn.setAttribute("aria-pressed", String(on));
    filtersEl.hidden = !on;
    if (on) nearbyLayer.addTo(map); else map.removeLayer(nearbyLayer);
    drawNearby();
  }
  toggleBtn.addEventListener("click", function () { setNearby(!nearbyOn); });
  filtersEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-kind]"); if (!b) return;
    kindsOn[b.dataset.kind] = !kindsOn[b.dataset.kind];
    b.setAttribute("aria-pressed", String(kindsOn[b.dataset.kind]));
    drawNearby();
  });
  if (window.NEARBY) {
    map.attributionControl.addAttribution("Eat &amp; rest data &copy; OpenStreetMap contributors (ODbL), " + esc(NEARBY.updated));
  } else {
    toggleBtn.hidden = true;
  }


  // ================= take it with you: print / Google Maps / KML / GPX =================
  var takeEl = document.getElementById("take-away");
  var gmapsEl = document.getElementById("ta-gmaps");
  function shorten(t, n) {
    t = String(t || "").replace(/\s+/g, " ").trim();
    if (t.length <= n) return t;
    return t.slice(0, t.lastIndexOf(" ", n)).replace(/[,;:.]$/, "") + "…";
  }
  function mapped() { return currentStops.filter(function (p) { return p.lat != null; }); }
  function tourTitle() { return editable() ? "My Tour" : "The suggested walk"; }
  function ll(p) { return p.lat.toFixed(6) + "," + p.lng.toFixed(6); }

  // Google Maps takes an origin, a destination and a handful of waypoints per link,
  // so long tours are split into parts that join up (each part starts where the last ended)
  var PER_LINK = 10;
  function gmapsLinks(stops) {
    var parts = [], i = 0;
    while (i < stops.length - 1) {
      var chunk = stops.slice(i, i + PER_LINK);
      var q = "https://www.google.com/maps/dir/?api=1&travelmode=walking" +
        "&origin=" + ll(chunk[0]) + "&destination=" + ll(chunk[chunk.length - 1]);
      if (chunk.length > 2) q += "&waypoints=" + chunk.slice(1, -1).map(ll).join("%7C");
      parts.push({ url: q, from: i + 1, to: i + chunk.length });
      i += PER_LINK - 1;
    }
    return parts;
  }
  function syncTakeAway() {
    var stops = mapped();
    takeEl.hidden = !stops.length;
    if (!stops.length) return;
    var PIN = '<span class="ta-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.3"/></svg></span>';
    var row = function (href, main, sub) {
      return '<a class="ta-btn" target="_blank" rel="noopener" href="' + esc(href) + '">' + PIN +
        '<span class="ta-text"><span class="ta-btn-main">' + main + '</span><span class="ta-btn-sub">' + sub + "</span></span>" +
        '<span class="ta-arrow" aria-hidden="true">&rsaquo;</span></a>';
    };
    var html;
    if (stops.length === 1) {
      html = row("https://www.google.com/maps/search/?api=1&query=" + ll(stops[0]), "Open in Google Maps", esc(stops[0].name));
    } else {
      var parts = gmapsLinks(stops);
      html = parts.map(function (pt, k) {
        return parts.length > 1
          ? row(pt.url, "Google Maps, part " + (k + 1), "Walking directions, stops " + pt.from + "–" + pt.to)
          : row(pt.url, "Open in Google Maps", "Walking directions, all " + stops.length + " stops");
      }).join("");
    }
    gmapsEl.innerHTML = html;
  }

  // ---- files ----
  function xml(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function fileName(ext) {
    var d = new Date();
    return "retellings-" + (editable() ? "my-tour" : "suggested-walk") + "-" + d.toISOString().slice(0, 10) + "." + ext;
  }
  function download(text, name, type) {
    var blob = new Blob([text], { type: type });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function stopNote(p) {
    return [p.categoryLabel, p.stories && p.stories.length ? "In “" + p.stories.join("”, “") + "”" : "", p.description || ""]
      .filter(Boolean).join("\n\n");
  }
  function kml(stops) {
    var marks = stops.map(function (p, i) {
      return "    <Placemark>\n      <name>" + xml((i + 1) + ". " + p.name) + "</name>\n" +
        "      <description>" + xml(stopNote(p)) + "</description>\n      <styleUrl>#stop</styleUrl>\n" +
        "      <Point><coordinates>" + p.lng.toFixed(6) + "," + p.lat.toFixed(6) + ",0</coordinates></Point>\n    </Placemark>";
    }).join("\n");
    var line = stops.length > 1 ? "    <Placemark>\n      <name>Walking route</name>\n      <styleUrl>#route</styleUrl>\n" +
      "      <LineString><tessellate>1</tessellate><coordinates>" +
      stops.map(function (p) { return p.lng.toFixed(6) + "," + p.lat.toFixed(6) + ",0"; }).join(" ") +
      "</coordinates></LineString>\n    </Placemark>\n" : "";
    return '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n  <Document>\n' +
      "    <name>" + xml("Retellings — " + tourTitle()) + "</name>\n" +
      "    <description>" + xml("A walk through the Dublin of James Joyce’s Dubliners, planned on Retellings. Distances are approximate.") + "</description>\n" +
      '    <Style id="stop"><IconStyle><color>ff5e4637</color><scale>1.1</scale></IconStyle></Style>\n' +
      '    <Style id="route"><LineStyle><color>ff23288f</color><width>4</width></LineStyle></Style>\n' +
      line + marks + "\n  </Document>\n</kml>\n";
  }
  function gpx(stops) {
    var w = function (tag, p, i) {
      return "  <" + tag + ' lat="' + p.lat.toFixed(6) + '" lon="' + p.lng.toFixed(6) + '">\n' +
        "    <name>" + xml((i + 1) + ". " + p.name) + "</name>\n    <desc>" + xml(stopNote(p)) + "</desc>\n  </" + tag + ">";
    };
    return '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Retellings" xmlns="http://www.topografix.com/GPX/1/1">\n' +
      "  <metadata><name>" + xml("Retellings — " + tourTitle()) + "</name></metadata>\n" +
      stops.map(function (p, i) { return w("wpt", p, i); }).join("\n") + "\n" +
      "  <rte>\n    <name>" + xml("Retellings — " + tourTitle()) + "</name>\n" +
      stops.map(function (p, i) { return w("rtept", p, i).replace(/^/gm, "  "); }).join("\n") + "\n  </rte>\n</gpx>\n";
  }
  document.getElementById("ta-kml").addEventListener("click", function () {
    var st = mapped(); if (!st.length) return;
    download(kml(st), fileName("kml"), "application/vnd.google-earth.kml+xml");
    toast("Saved " + fileName("kml") + ". Import it in Google My Maps to see it in the Google Maps app.");
  });
  document.getElementById("ta-gpx").addEventListener("click", function () {
    var st = mapped(); if (!st.length) return;
    download(gpx(st), fileName("gpx"), "application/gpx+xml");
    toast("Saved " + fileName("gpx") + ".");
  });

  // ---- print: size the map for the page, wait for its tiles, then print ----
  var printBtn = document.getElementById("ta-print");
  function fitStops(tight) {
    var pts = mapped().map(function (p) { return [p.lat, p.lng]; });
    map.options.zoomSnap = tight ? 0.25 : 1;
    if (pts.length > 1) map.fitBounds(pts, { padding: tight ? [28, 28] : [36, 36], maxZoom: 16 });
    else if (pts.length === 1) map.setView(pts[0], 16);
  }
  function fillPrintHead() {
    var st = mapped(), total = 0;
    for (var i = 1; i < st.length; i++) total += km(st[i - 1], st[i]);
    document.getElementById("print-title").textContent = tourTitle();
    document.getElementById("print-meta").textContent = st.length + (st.length === 1 ? " stop" : " stops") +
      (st.length > 1 ? " · about " + fmtDist(total) + " · " + fmtTime(total) + " on foot" : "") +
      " · planned " + new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
  }
  function endPrint() {
    document.body.classList.remove("print-prep");
    printBtn.disabled = false;
    map.invalidateSize();
    fitStops();
  }
  printBtn.addEventListener("click", function () {
    if (!mapped().length) return;
    printBtn.disabled = true;
    fillPrintHead();
    document.body.classList.add("print-prep");
    setHot(null);
    map.invalidateSize();
    fitStops(true);
    var done = false;
    function go() {
      if (done) return; done = true;
      tiles.off("load", go);
      setTimeout(function () {
        window.print();
        // some mobile browsers never send "afterprint": tidy up when the page is back in focus
        setTimeout(function () {
          window.addEventListener("focus", function () { if (document.body.classList.contains("print-prep")) endPrint(); }, { once: true });
        }, 600);
      }, 150);
    }
    tiles.on("load", go);
    setTimeout(go, 2500); // print anyway if some tiles are slow
  });
  window.addEventListener("afterprint", function () { if (document.body.classList.contains("print-prep")) endPrint(); });
  // a print started from the browser menu still gets the header filled in
  window.addEventListener("beforeprint", function () { if (!document.body.classList.contains("print-prep")) fillPrintHead(); });

  document.addEventListener("tour:change", function () { render(false); });
  render(true);
  // the map may have been laid out before the fonts settled
  setTimeout(function () { map.invalidateSize(); }, 300);
})();
