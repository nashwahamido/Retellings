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
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
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

  document.addEventListener("tour:change", function () { render(false); });
  render(true);
  // the map may have been laid out before the fonts settled
  setTimeout(function () { map.invalidateSize(); }, 300);
})();
