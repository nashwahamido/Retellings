
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
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark"){
    body.classList.toggle("dark");
    toggle.forEach(t=>t.classList.toggle("active"));
};

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

//hamburger-menu trigger
const hamburger = document.querySelector('.nav-hamburger');
const menu = document.querySelector('.mobile-menu'); 
const closeMenu = document.querySelector('.close-menu'); 


if (hamburger) hamburger.addEventListener('click', () => {
    if(!menu.classList.contains('shown')){ 
    menu.classList.add('shown');
    } 
});

if (closeMenu) closeMenu.addEventListener('click', () => {
    if(menu.classList.contains('shown')){
         menu.classList.remove('shown');
         
    }
});



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
