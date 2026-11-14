/* =====================================================================
   cover3d.js — the closed Dubliners on the Cover (three.js)
   Renders pages/assets/closed-book.glb (leather, gold-foil title) into
   the Cover's book stage. Clicking it, or "Open the book", plays a short
   transition — the book lifts, turns to face you and comes close while
   the page darkens — then opens the Places page with the book open.
   Without WebGL the still picture in the stage stays, and links work
   as normal.
   ===================================================================== */
import * as THREE from "three";
import { GLTFLoader } from "./vendor/three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "./vendor/three/addons/environments/RoomEnvironment.js";

const hero = document.getElementById("book-hero");
const mount = document.getElementById("book3d-mount");
const DEST = "locations.html#read";
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let playOpen = null; // set once the model is ready
let resetOpen = null; // puts the book back on the table

// the page-darkening veil used by the transition
const veil = document.createElement("div");
veil.className = "cover-veil";
veil.setAttribute("aria-hidden", "true");
document.body.appendChild(veil);

function go() {
  try { sessionStorage.setItem("retellings.arrive", "1"); } catch (e) {}
  window.location.href = DEST;
}
// coming back with the browser's Back button: undo the dark veil
window.addEventListener("pageshow", () => {
  veil.classList.remove("is-on");
  document.body.classList.remove("is-opening");
  if (resetOpen) resetOpen();
});

// both the 3D book and the "Open the book" button play the transition
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-open-book]");
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  if (document.body.classList.contains("is-opening")) return;
  document.body.classList.add("is-opening");
  if (playOpen && !reduced) playOpen();
  else { veil.classList.add("is-on"); setTimeout(go, reduced ? 0 : 450); }
});

if (hero && mount) init();

function init() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return; // no WebGL: the still picture stays
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = "book3d-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  // warm lamplight from above-left, soft fill, a gold rim from behind
  const key = new THREE.DirectionalLight(0xfff1d6, 2.4);
  key.position.set(-2.5, 4, 3);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xfff4e0, 0x2a1d10, 0.55));
  const rim = new THREE.DirectionalLight(0xcfae6b, 1.3);
  rim.position.set(3, 2, -3);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
  const pivot = new THREE.Group();
  scene.add(pivot);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 3.0),
    new THREE.MeshBasicMaterial({ map: makeShadowTexture(), transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.001;
  scene.add(shadow);

  let baseDist = 2.7;
  function placeCamera(dist, lift) {
    camera.position.set(0, dist * 0.76 + lift, dist);
    camera.lookAt(0, 0.2 + lift, 0);
  }
  function resize() {
    const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    baseDist = w / h < 1 ? 4.6 : 3.1;
    if (!opening) placeCamera(baseDist, 0);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(mount);

  // ---- motion: slow sway and float, tilting toward the pointer ----
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    targetY = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
    targetX = ((e.clientY - r.top) / r.height - 0.5) * 0.25;
  });
  hero.addEventListener("pointerleave", () => { targetX = 0; targetY = 0; });

  let running = false, raf = 0, opening = null;
  const clock = new THREE.Clock();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function frame() {
    if (!running) return;
    const t = clock.getElapsedTime();
    if (opening) {
      // 0 -> 1 over the transition
      const k = Math.min(1, (performance.now() - opening.t0) / opening.ms);
      const e = ease(k);
      const from = opening.from;
      pivot.rotation.set(
        from.rx + (0.95 - from.rx) * e,          // stand up to face the camera
        from.ry + (0 - from.ry) * e,             // square on
        0
      );
      pivot.position.y = from.py + (0.75 - from.py) * e;   // lift off the table
      placeCamera(baseDist - (baseDist - 1.55) * e, 0.55 * e); // come close
      shadow.material.opacity = 0.85 * (1 - e);
      if (k > 0.55) veil.classList.add("is-on");
      renderer.render(scene, camera);
      if (k >= 1) { running = false; setTimeout(go, 120); return; }
    } else {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      const sway = reduced ? 0 : Math.sin(t * 0.5) * 0.16;
      const float = reduced ? 0 : Math.sin(t * 1.1) * 0.04;
      pivot.rotation.set(curX, -0.35 + sway + curY, 0);
      pivot.position.y = float;
      shadow.material.opacity = 0.85 - float * 4;
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running) return;
    running = true; clock.start(); raf = requestAnimationFrame(frame);
  }
  function stop() { if (opening) return; running = false; cancelAnimationFrame(raf); }

  new GLTFLoader().load(
    "assets/closed-book.glb",
    (gltf) => {
      const model = gltf.scene;
      // centre the model, longest side 2 units, resting on y = 0
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const centre = box.getCenter(new THREE.Vector3());
      const s = 2 / Math.max(size.x, size.y, size.z);
      model.position.sub(centre).multiplyScalar(s);
      model.scale.multiplyScalar(s);
      model.position.y += (size.y * s) / 2;
      model.traverse((o) => { if (o.isMesh && o.material) o.material.envMapIntensity = 0.7; });
      pivot.add(model);
      mount.appendChild(renderer.domElement);
      hero.classList.add("has-3d");
      resize();
      start();
      resetOpen = () => {
        opening = null;
        hero.classList.remove("is-opening");
        pivot.rotation.set(0, -0.35, 0);
        pivot.position.y = 0;
        shadow.material.opacity = 0.85;
        placeCamera(baseDist, 0);
        camera.updateProjectionMatrix();
        running = false;
        start();
      };
      playOpen = () => {
        opening = { t0: performance.now(), ms: 1350, from: { rx: pivot.rotation.x, ry: pivot.rotation.y, py: pivot.position.y } };
        hero.classList.add("is-opening");
        start();
      };
    },
    undefined,
    () => { /* load failed: keep the still picture */ }
  );

  // only animate while the book is on screen
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(hero);
}

function makeShadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  grad.addColorStop(0, "rgba(0,0,0,0.6)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
