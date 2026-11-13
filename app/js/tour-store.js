/* =====================================================================
   tour-store.js — the visitor's own tour, shared by every page
   window.Places     : lookup across the book's places (LOCATIONS) and the
                       tour-only stops (TOUR_PLACES), whichever are loaded.
   window.TourStore  : the saved list, kept in this browser (localStorage),
                       in visiting order. Fires "tour:change" on document
                       whenever it changes, including from another tab.
   ===================================================================== */
(function () {
  "use strict";

  // ---- places ----
  var byId = null;
  function index() {
    if (byId) return byId;
    byId = {};
    (window.LOCATIONS || []).forEach(function (l) { byId[l.id] = l; });
    (window.TOUR_PLACES || []).forEach(function (l) { byId[l.id] = l; });
    return byId;
  }
  window.Places = {
    get: function (id) { return index()[id] || null; },
    all: function () { var m = index(); return Object.keys(m).map(function (k) { return m[k]; }); }
  };

  // ---- saved tour ----
  var KEY = "retellings.tour.v1";
  var memory = []; // fallback when storage is unavailable (private mode etc.)

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(v) ? v.filter(function (x) { return typeof x === "string"; }) : [];
    } catch (e) { return memory.slice(); }
  }
  function write(ids) {
    memory = ids.slice();
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch (e) {}
    emit();
  }
  function emit() {
    document.dispatchEvent(new CustomEvent("tour:change", { detail: { ids: read() } }));
  }

  window.TourStore = {
    list: read,
    count: function () { return read().length; },
    has: function (id) { return read().indexOf(id) !== -1; },
    add: function (id) { var ids = read(); if (ids.indexOf(id) === -1) { ids.push(id); write(ids); } },
    remove: function (id) { write(read().filter(function (x) { return x !== id; })); },
    toggle: function (id) { this.has(id) ? this.remove(id) : this.add(id); return this.has(id); },
    move: function (from, to) {
      var ids = read();
      if (from < 0 || from >= ids.length || to < 0 || to >= ids.length || from === to) return;
      ids.splice(to, 0, ids.splice(from, 1)[0]);
      write(ids);
    },
    set: function (ids) { write(ids.filter(function (x, i) { return ids.indexOf(x) === i; })); },
    clear: function () { write([]); }
  };

  // another tab changed the list
  window.addEventListener("storage", function (e) { if (e.key === KEY) emit(); });
})();
