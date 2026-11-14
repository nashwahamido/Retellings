/* =====================================================================
   book3d.js — the 3D book shown before reading (three.js)
   Renders pages/assets/book.glb into the "Open the book" button on the
   Locations page. Clicking the button is handled by book.js. If WebGL or the
   model is unavailable, the SVG illustration in the button stays visible.
   ===================================================================== */
import * as THREE from "three";
import { GLTFLoader } from "./vendor/three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "./vendor/three/addons/environments/RoomEnvironment.js";

const hero = document.getElementById("book-hero");
const mount = document.getElementById("book3d-mount");
const stage = document.getElementById("book-stage");

if (hero && mount && stage) init();

function init() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return; // no WebGL: keep the SVG fallback
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

  // warm key light from above-left, soft fill, gold rim from behind
  const key = new THREE.DirectionalLight(0xfff1d6, 2.2);
  key.position.set(-2.5, 4, 3);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xfff4e0, 0x2a1d10, 0.6));
  const rim = new THREE.DirectionalLight(0xcfae6b, 1.2);
  rim.position.set(3, 2, -3);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
  camera.position.set(0, 2.6, 3.4);
  camera.lookAt(0, 0, 0);

  const pivot = new THREE.Group(); // gentle motion is applied here
  scene.add(pivot);

  // soft contact shadow under the book
  const shadowTex = makeShadowTexture();
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 1.9),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  new GLTFLoader().load(
    "assets/book.glb",
    (gltf) => {
      const model = gltf.scene;
      // centre the model and scale its longest side to 2 units, resting on y=0
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const centre = box.getCenter(new THREE.Vector3());
      const s = 2 / Math.max(size.x, size.y, size.z);
      model.position.sub(centre).multiplyScalar(s);
      model.scale.multiplyScalar(s);
      model.position.y += (size.y * s) / 2;
      model.traverse((o) => {
        if (o.isMesh && o.material) {
          o.material.envMapIntensity = 0.6;
          if ("metalness" in o.material) o.material.metalness = Math.min(o.material.metalness, 0.2);
        }
      });
      pivot.add(model);
      shadow.position.y = 0.001;
      mount.appendChild(renderer.domElement);
      hero.classList.add("has-3d");
      resize();
      start();
    },
    undefined,
    () => { /* load failed: keep the SVG fallback */ }
  );

  // ---- sizing ----
  function resize() {
    const w = mount.clientWidth || 1;
    const h = mount.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // pull the camera back on narrow (portrait) frames so the book fits
    const dist = w / h < 1 ? 4.3 : 2.7;
    camera.position.set(0, dist * 0.76, dist);
    camera.lookAt(0, 0.15, 0);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(mount);

  // ---- motion: slow sway + float, tilt toward the pointer ----
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    targetY = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
    targetX = ((e.clientY - r.top) / r.height - 0.5) * 0.25;
  });
  hero.addEventListener("pointerleave", () => { targetX = 0; targetY = 0; });

  let running = false, raf = 0;
  const clock = new THREE.Clock();
  function frame() {
    if (!running) return;
    const t = clock.getElapsedTime();
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;
    const sway = reduced ? 0 : Math.sin(t * 0.5) * 0.18;
    const float = reduced ? 0 : Math.sin(t * 1.1) * 0.04;
    pivot.rotation.set(curX, -0.35 + sway + curY, 0);
    pivot.position.y = float;
    shadow.material.opacity = 0.85 - float * 4;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running || stage.classList.contains("is-open") || stage.hidden) return;
    running = true; clock.start(); raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  // only animate while the 3D book is actually on screen
  const sync = () => (stage.classList.contains("is-open") || stage.hidden ? stop() : start());
  new MutationObserver(sync).observe(stage, { attributes: true, attributeFilter: ["class", "hidden"] });
  new IntersectionObserver(([e]) => (e.isIntersecting ? sync() : stop())).observe(hero);
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
