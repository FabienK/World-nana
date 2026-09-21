// Dans la bonne case : une chambre dessinée, des objets à déplacer selon une
// consigne lue à voix haute (sur, sous, à gauche de, entre…).

import { loadJSON } from "../core/content.js";
import { speak, say } from "../core/speech.js";
import { saveResult, getSettings } from "../core/storage.js";
import { makeDraggable, dropTargetAt } from "../core/drag.js";
import { initPage, feedbackBox, clearFeedback, escapeHtml, mark, clearMarks, stamp, renderCount, renderNext } from "../core/ui.js";
import { pickExercise, nextLink, progressCount } from "../core/parcours.js";

initPage("organiseur");

const { scene, series } = await loadJSON("../data/scene.json");
// Un exercice = une série de consignes ; réussie quand chaque consigne l'est.
const PARCOURS = { keys: (s) => s.consignes.map((c) => `${s.id}-${c.id}`) };
const serie = pickExercise("organiseur", series, PARCOURS);
const consignes = serie.consignes;
const head = document.querySelector(".module-head");
renderCount(head, progressCount("organiseur", series, PARCOURS));
// Positions de départ : celles de la scène, ou celles propres à la série.
const depart = (o) => ({ ...o, ...(serie.depart?.[o.id] || {}) });
const sceneEl = document.getElementById("scene");
const feedback = document.getElementById("feedback");
const consigneEl = document.getElementById("consigne");
const compteurEl = document.getElementById("compteur");

// La voix est optionnelle (case commune « Lire à voix haute automatiquement ») :
// say() ne parle que si elle est cochée ; le bouton « Écouter » parle toujours.

// ----- Dessins plats (SVG) ------------------------------------------------------

const INK = "#3b2f24", WOOD = "#b89a6e", WOOD_D = "#8a6f4e", CREAM = "#fffaf0", GOLD = "#c9a227";
const SHAPES = {
  lit: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="2" y="10" width="14" height="70" rx="3" fill="${WOOD}"/>
    <rect x="10" y="40" width="88" height="34" rx="4" fill="${CREAM}" stroke="${WOOD_D}" stroke-width="1.5"/>
    <rect x="10" y="40" width="88" height="12" rx="4" fill="#e7d9bd"/>
    <rect x="12" y="74" width="6" height="18" fill="${WOOD_D}"/><rect x="90" y="74" width="6" height="18" fill="${WOOD_D}"/>
  </svg>`,
  tapis: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <ellipse cx="50" cy="50" rx="48" ry="46" fill="#d9c3a5"/>
    <ellipse cx="50" cy="50" rx="34" ry="32" fill="none" stroke="${WOOD_D}" stroke-width="2" stroke-dasharray="4 4"/>
  </svg>`,
  /* Petite console basse contre le mur (croquis utilisateur) : plateau, pieds courts posés sur la plinthe. */
  table: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="100" height="14" rx="3" fill="${WOOD}"/>
    <rect x="7" y="14" width="8" height="86" fill="${WOOD_D}"/><rect x="85" y="14" width="8" height="86" fill="${WOOD_D}"/>
  </svg>`,
  lampe: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M20 40 L80 40 L66 4 L34 4 Z" fill="${GOLD}"/>
    <rect x="46" y="40" width="8" height="52" fill="${INK}"/>
    <rect x="26" y="90" width="48" height="10" rx="4" fill="${INK}"/>
  </svg>`,
  etagere: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="100" height="100" rx="6" fill="${WOOD}"/>
    <rect x="4" y="100" width="6" height="30" fill="${WOOD_D}"/><rect x="90" y="100" width="6" height="30" fill="${WOOD_D}"/>
  </svg>`,
  coussin: `<svg viewBox="0 0 100 100">
    <path d="M12 18 Q50 8 88 18 Q98 50 88 82 Q50 92 12 82 Q2 50 12 18 Z" fill="#c88f78" stroke="#5a2a1c" stroke-width="2"/>
    <circle cx="50" cy="50" r="5" fill="#5a2a1c"/>
  </svg>`,
  livre: `<svg viewBox="0 0 100 100">
    <rect x="18" y="12" width="64" height="76" rx="4" fill="#7d9bb5" stroke="#233a4d" stroke-width="2"/>
    <rect x="18" y="12" width="12" height="76" rx="3" fill="#233a4d"/>
    <rect x="40" y="26" width="30" height="4" fill="${CREAM}"/><rect x="40" y="36" width="24" height="4" fill="${CREAM}"/>
  </svg>`,
  chat: `<svg viewBox="0 0 100 100">
    <ellipse cx="50" cy="66" rx="32" ry="24" fill="#7a6350"/>
    <circle cx="50" cy="38" r="20" fill="#7a6350"/>
    <path d="M34 26 L30 6 L46 20 Z" fill="#7a6350"/><path d="M66 26 L70 6 L54 20 Z" fill="#7a6350"/>
    <circle cx="43" cy="38" r="3" fill="${CREAM}"/><circle cx="57" cy="38" r="3" fill="${CREAM}"/>
    <path d="M82 66 Q98 60 92 44" stroke="#7a6350" stroke-width="7" fill="none" stroke-linecap="round"/>
  </svg>`,
  boite: `<svg viewBox="0 0 100 100">
    <rect x="14" y="30" width="72" height="58" rx="4" fill="#93ad83" stroke="#2d4a23" stroke-width="2"/>
    <rect x="8" y="18" width="84" height="16" rx="3" fill="#2d4a23"/>
    <rect x="46" y="18" width="8" height="70" fill="${GOLD}"/>
  </svg>`,
};

// ----- Construction de la scène -------------------------------------------------

const pos = (el, r) => Object.assign(el.style, { left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` });

for (const r of scene.reperes) {
  const el = document.createElement("div");
  el.className = "repere";
  el.dataset.id = r.id;
  pos(el, r);
  el.innerHTML = `${SHAPES[r.forme] || ""}<span class="label">${escapeHtml(r.label)}</span>`;
  sceneEl.append(el);
}

// Les cases sont des boutons : au clavier, on sélectionne un objet (Entrée)
// puis on tabule jusqu'à une case et on valide. Hors sélection, elles sortent
// de l'ordre de tabulation (voir setSelected).
const spots = {};
for (const s of scene.spots) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "spot";
  el.dataset.id = s.id;
  el.tabIndex = -1;
  el.setAttribute("aria-label", s.label);
  pos(el, s);
  el.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && selected) { e.preventDefault(); placeAt(selected, el); }
  });
  sceneEl.append(el);
  spots[s.id] = el;
}

const objets = {};
let selected = null;
for (const o of scene.objets) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "objet";
  el.dataset.id = o.id;
  el.setAttribute("aria-label", o.label);
  el.style.left = `${depart(o).x0}%`;
  el.style.top = `${depart(o).y0}%`;
  el.innerHTML = SHAPES[o.forme] || "";
  sceneEl.append(el);
  objets[o.id] = el;

  let before = null;
  let currentSpot = null;
  let frame = null; // géométrie mesurée une fois au début du glisser
  makeDraggable(el, {
    ghost: false,
    onTap: () => tapObjet(el),
    onDragStart: () => {
      setSelected(null);
      before = { left: el.style.left, top: el.style.top };
      frame = measure(el);
      el.classList.add("dragging");
    },
    onDragMove: (x, y) => {
      moveTo(el, x, y, frame);
      const spot = dropTargetAt(x, y, ".spot");
      if (spot !== currentSpot) { currentSpot?.classList.remove("drop-target"); currentSpot = spot; spot?.classList.add("drop-target"); }
    },
    onDrop: (x, y, cancelled) => {
      el.classList.remove("dragging");
      currentSpot?.classList.remove("drop-target");
      currentSpot = null;
      if (cancelled) { Object.assign(el.style, before); return; }
      resolve(el, dropTargetAt(x, y, ".spot"), before);
    },
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tapObjet(el); }
  });
}

/** Rectangle de la scène et taille de l'objet, en px. */
function measure(el) {
  return { r: sceneEl.getBoundingClientRect(), w: el.offsetWidth, h: el.offsetHeight };
}

/** Place le centre de l'objet sous le pointeur (coordonnées viewport → %). */
function moveTo(el, x, y, { r, w, h } = measure(el)) {
  const left = Math.min(Math.max(x - r.left - w / 2, 0), r.width - w);
  const top = Math.min(Math.max(y - r.top - h / 2, 0), r.height - h);
  el.style.left = `${(left / r.width) * 100}%`;
  el.style.top = `${(top / r.height) * 100}%`;
}

function centerOn(el, spotEl) {
  const s = scene.spots.find((x) => x.id === spotEl.dataset.id);
  const { r, w, h } = measure(el);
  const wPct = (w / r.width) * 100, hPct = (h / r.height) * 100;
  el.style.left = `${s.x + s.w / 2 - wPct / 2}%`;
  el.style.top = `${s.y + s.h / 2 - hPct / 2}%`;
}

// ----- Mode tap-tap ---------------------------------------------------------------

function setSelected(el) {
  selected?.classList.remove("selected");
  selected = el;
  selected?.classList.add("selected");
  sceneEl.classList.toggle("selecting", Boolean(selected));
  for (const s of Object.values(spots)) s.tabIndex = selected ? 0 : -1;
}

/** Dépose l'objet sélectionné au centre d'une case (clavier ou tap sur la case). */
function placeAt(el, spotEl) {
  const before = { left: el.style.left, top: el.style.top };
  setSelected(null);
  centerOn(el, spotEl);
  resolve(el, spotEl, before);
}

function tapObjet(el) {
  if (selected === el) { setSelected(null); return; }
  setSelected(el);
  say(el.getAttribute("aria-label"));
}

sceneEl.addEventListener("click", (e) => {
  if (!selected || e.target.closest(".objet")) return;
  const el = selected;
  const before = { left: el.style.left, top: el.style.top };
  setSelected(null);
  moveTo(el, e.clientX, e.clientY);
  resolve(el, dropTargetAt(e.clientX, e.clientY, ".spot"), before);
});

// ----- Déroulé des consignes ------------------------------------------------------

let index = 0;
let done = false;

function current() { return consignes[index]; }

function showConsigne(read = true) {
  const c = current();
  compteurEl.textContent = `${index + 1}\u00a0/\u00a0${consignes.length}`;
  consigneEl.textContent = c.texte;
  clearFeedback(feedback);
  if (read) say(c.texte);
}

function resolve(el, spotEl, before) {
  if (done) { Object.assign(el.style, before); return; }
  const c = current();
  if (el.dataset.id !== c.objet) {
    Object.assign(el.style, before);
    flashWrong(el);
    const label = scene.objets.find((o) => o.id === c.objet).label;
    feedbackBox(feedback, `Ce n’est pas cet objet\u00a0: la consigne parle de <strong>${escapeHtml(label)}</strong>.`, "info");
    say(`Ce n’est pas cet objet. Il faut déplacer ${label}.`);
    return;
  }
  if (spotEl && spotEl.dataset.id === c.spot) {
    centerOn(el, spotEl);
    mark(el, true);
    setTimeout(() => mark(el, null), 1600);
    saveResult("organiseur", `${serie.id}-${c.id}`, { success: true });
    if (index + 1 < consignes.length) {
      feedbackBox(feedback, "C’est ça. Consigne suivante…", "ok");
      const next = () => { index += 1; showConsigne(true); };
      if (getSettings().voiceAuto) speak("C’est ça.", { onEnd: next });
      else setTimeout(next, 900);
    } else {
      done = true;
      stamp(sceneEl, true, "Réussi");
      feedbackBox(feedback, "La chambre est rangée\u00a0: les cinq consignes sont suivies.", "ok");
      say("La chambre est rangée. Bien joué.");
      compteurEl.textContent = `${consignes.length}\u00a0/\u00a0${consignes.length}`;
      renderCount(head, progressCount("organiseur", series, PARCOURS));
      renderNext(document.querySelector(".actions"), nextLink("organiseur", series, serie.id, PARCOURS), true);
    }
  } else {
    Object.assign(el.style, before);
    flashWrong(el);
    feedbackBox(feedback, escapeHtml(c.aide), "info");
    say(c.aide);
    saveResult("organiseur", `${serie.id}-${c.id}`, { success: false });
  }
}

function flashWrong(el) {
  mark(el, false);
  setTimeout(() => mark(el, null), 1400);
}

document.getElementById("btn-speak").addEventListener("click", () => speak(current().texte));
document.getElementById("btn-reset").addEventListener("click", () => {
  index = 0;
  done = false;
  setSelected(null);
  clearMarks(sceneEl);
  for (const o of scene.objets) Object.assign(objets[o.id].style, { left: `${depart(o).x0}%`, top: `${depart(o).y0}%` });
  renderNext(document.querySelector(".actions"), null);
  showConsigne(true);
});

showConsigne(false);
