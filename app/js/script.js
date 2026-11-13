console.log("HELLO");

/* past-present image slider script. reference code: https://codepen.io/Coding-in-Public/pen/NWyjZwO */
document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', e => {
        e.target.closest('.img-column').style.setProperty('--position', `${e.target.value}%`);
    });
})

/* jump-to-top btn */
let toTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', e => {
    if (window.scrollY > 300) {
        toTopBtn.classList.add('show');
    } else {
        toTopBtn.classList.remove('show');
    }
});

toTopBtn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

//light mode + dark mode toggle
const body = document.querySelector("body");
toggle = document.querySelectorAll(".toggle");

//setting what color mode it's in
let getMode = localStorage.getItem("mode");
console.log(getMode);
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


hamburger.addEventListener('click', () => {
    if(!menu.classList.contains('shown')){ 
    menu.classList.add('shown');
    console.log('mobile menu shown');
    } 
});

closeMenu.addEventListener('click', () => {
    if(menu.classList.contains('shown')){
         menu.classList.remove('shown');
         
        console.log('mobile menu hidden');
    }
});



// mark the current page in the navigation (used by the deco nav styling)
(function () {
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("header nav a, .mobile-menu a").forEach(function (a) {
        if ((a.getAttribute("href") || "").split("#")[0] === here) a.setAttribute("aria-current", "page");
    });
})();
