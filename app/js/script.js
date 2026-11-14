
/* past-present image slider script. reference code: https://codepen.io/Coding-in-Public/pen/NWyjZwO */
document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', e => {
        e.target.closest('.img-column').style.setProperty('--position', `${e.target.value}%`);
    });
})

/* jump-to-top btn */
let toTopBtn = document.querySelector('.back-to-top');

if (toTopBtn) window.addEventListener('scroll', e => {
    if (window.scrollY > 300) {
        toTopBtn.classList.add('show');
    } else {
        toTopBtn.classList.remove('show');
    }
});

if (toTopBtn) toTopBtn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

//light mode + dark mode toggle
const body = document.querySelector("body");
toggle = document.querySelectorAll(".toggle");

//setting what color mode it's in
// dark is the default; light only when the visitor has chosen it
let getMode = null;
try { getMode = localStorage.getItem("mode"); } catch (e) {}
if (getMode !== "light") {
    body.classList.add("dark");
    toggle.forEach(t => t.classList.add("active"));
}

//toggling light vs dark mode
toggle.forEach(t => {
    t.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (!body.classList.contains("dark")) {
        return localStorage.setItem("mode", "light");
    }
    localStorage.setItem("mode", "dark");
    });
});

// activating toggle on click
toggle.forEach(t => t.addEventListener("click", () => toggle.forEach(t => t.classList.toggle("active"))));
// tell assistive technology whether dark mode is on
function syncToggleState() {
    const on = document.body.classList.contains("dark");
    toggle.forEach(t => t.setAttribute("aria-checked", on ? "true" : "false"));
}
syncToggleState();
toggle.forEach(t => t.addEventListener("click", syncToggleState));

//hamburger-menu trigger: a small dialog with the contents
const hamburger = document.querySelector('.nav-hamburger');
const menu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');

function openMobileMenu() {
    if (!menu || menu.classList.contains('shown')) return;
    menu.classList.add('shown');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    const first = menu.querySelector('a, button');
    if (first) first.focus();
}
function closeMobileMenu() {
    if (!menu || !menu.classList.contains('shown')) return;
    menu.classList.remove('shown');
    if (hamburger) { hamburger.setAttribute('aria-expanded', 'false'); hamburger.focus(); }
}
if (hamburger) hamburger.addEventListener('click', openMobileMenu);
if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);
if (menu) {
    // Esc closes; Tab stays inside the open menu
    menu.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.preventDefault(); closeMobileMenu(); return; }
        if (e.key !== 'Tab') return;
        const items = [...menu.querySelectorAll('a, button, .toggle')].filter(el => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // choosing a link closes the menu
    menu.addEventListener('click', e => { if (e.target.closest('a')) menu.classList.remove('shown'); });
}

// mark the current page in the navigation (used by the deco nav styling)
(function () {
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("header nav a, .mobile-menu a, .endpaper-toc a").forEach(function (a) {
        if (a.hasAttribute("data-sources")) return;
        if ((a.getAttribute("href") || "").split("#")[0] === here) a.setAttribute("aria-current", "page");
    });
})();

// "My Tour" badge: how many places the visitor has saved (shared via localStorage)
(function () {
    function count() {
        try { var v = JSON.parse(localStorage.getItem("retellings.tour.v1") || "[]"); return Array.isArray(v) ? v.length : 0; }
        catch (e) { return 0; }
    }
    function paint() {
        var n = count();
        document.querySelectorAll('header nav a[href="walking-tour.html"], .mobile-menu a[href="walking-tour.html"]').forEach(function (a) {
            var b = a.querySelector(".nav-badge");
            if (!n) { if (b) b.remove(); a.removeAttribute("aria-label"); return; }
            if (!b) { b = document.createElement("span"); b.className = "nav-badge"; b.setAttribute("aria-hidden", "true"); a.appendChild(b); }
            b.textContent = n;
            a.setAttribute("aria-label", "My Tour, " + n + (n === 1 ? " place" : " places") + " saved");
        });
    }
    paint();
    document.addEventListener("tour:change", paint);
    window.addEventListener("storage", function (e) { if (e.key === "retellings.tour.v1") paint(); });
})();
