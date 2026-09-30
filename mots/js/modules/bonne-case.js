// Dans la bonne case : une scène dessinée (chambre, cuisine, salon, jardin) et
// des objets à déplacer selon une consigne lue à voix haute (sur, sous, entre…).

import { loadJSON } from "../core/content.js";
import { SHAPES } from "./formes.js";
import { speak, say } from "../core/speech.js";
import { saveResult, getSettings } from "../core/storage.js";
import { makeDraggable, dropTargetAt } from "../core/drag.js";
import { initPage, feedbackBox, clearFeedback, escapeHtml, mark, clearMarks, stamp, renderCount, renderNext } from "../core/ui.js";
import { pickExercise, nextLink, progressCount } from "../core/parcours.js";

initPage("organiseur");

const { scenes, series } = await loadJSON("../data/scene.json");
// Un exercice = une série de consignes ; réussie quand chaque consigne l'est.
const PARCOURS = { keys: (s) => s.consignes.map((c) => `${s.id}-${c.id}`) };
const serie = pickExercise("organiseur", series, PARCOURS);
// Chaque série se joue dans sa scène : c'est elle qui choisit le décor.
const scene = scenes.find((s) => s.id === serie.scene) || scenes[0];
const consignes = serie.consignes;
const head = document.querySelector(".module-head");
renderCount(head, progressCount("organiseur", series, PARCOURS));
// Positions de départ : celles de la scène, ou celles propres à la série.
const depart = (o) => ({ ...o, ...(serie.depart?.[o.id] || {}) });
const sceneEl = document.getElementById("scene");
sceneEl.setAttribute("aria-label", scene.nom);
for (const [cle, valeur] of Object.entries(scene.decor || {})) {
  sceneEl.style.setProperty(`--${cle}`, valeur);
}
const feedback = document.getElementById("feedback");
const consigneEl = document.getElementById("consigne");
const compteurEl = document.getElementById("compteur");

// La voix est optionnelle (case commune « Lire à voix haute automatiquement ») :
// say() ne parle que si elle est cochée ; le bouton « Écouter » parle toujours.

// ----- Construction de la scène -------------------------------------------------

const pos = (el, r) => Object.assign(el.style, { left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` });

for (const r of scene.reperes) {
  const el = document.createElement("div");
  el.className = `repere${r.labelPos ? ` label-${r.labelPos}` : ""}`;
  el.dataset.id = r.id;
  pos(el, r);
  el.innerHTML = `${SHAPES[r.forme] || ""}<span class="label">${escapeHtml(r.label)}</span>`;
  sceneEl.append(el);
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
  // Pendant la sélection, seules les cases comptent : Tab depuis l'objet choisi
  // mène aux cases, pas aux autres objets.
  for (const s of Object.values(spots)) s.tabIndex = selected ? 0 : -1;
  for (const o of Object.values(objets)) o.tabIndex = selected && o !== selected ? -1 : 0;
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
      feedbackBox(feedback, `${escapeHtml(scene.reussite)}\u00a0: les ${consignes.length} consignes sont suivies.`, "ok");
      say(`${scene.reussite} Bien joué.`);
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
