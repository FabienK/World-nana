// Puzzle de phrases : blocs « qui / fait quoi / quoi-où » à placer dans
// trois cases. Glisser (pointer events) ou tap-tap (bloc puis case).

import { loadJSON } from "../core/content.js";
import { speak, say } from "../core/speech.js";
import { saveResult } from "../core/storage.js";
import { makeDraggable, dropTargetAt } from "../core/drag.js";
import { initPage, feedbackBox, clearFeedback, escapeHtml, mark, clearMarks, stamp, renderColorToggle, renderCount, renderNext } from "../core/ui.js";
import { pickExercise, nextLink, progressCount } from "../core/parcours.js";

initPage("codeur");
const head = document.querySelector(".module-head");
renderColorToggle(head);

const TYPES = ["sujet", "verbe", "complement"];
const CLASS_BY_TYPE = { sujet: "block-sujet", verbe: "block-verbe", complement: "block-complement" };
const LABELS = { sujet: "qui", verbe: "fait quoi", complement: "quoi ou où" };

const bank = document.getElementById("bank");
const zones = Object.fromEntries(TYPES.map((t) => [t, document.querySelector(`.zone[data-type="${t}"]`)]));
const sentenceEl = document.getElementById("sentence");
const feedback = document.getElementById("feedback");

const { puzzles } = await loadJSON("../data/codeur.json");
const exo = pickExercise("codeur", puzzles);
document.getElementById("consigne").textContent = exo.consigne;
renderCount(head, progressCount("codeur", puzzles));

// ----- Blocs ----------------------------------------------------------------

let selected = null; // bloc sélectionné en mode tap-tap
let currentTarget = null;

for (const type of TYPES) {
  exo.blocs[type].forEach((text, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `block draggable ${CLASS_BY_TYPE[type]}`;
    b.textContent = text;
    b.dataset.type = type;
    b.dataset.text = text;
    b.id = `b-${type}-${i}`;
    b.setAttribute("aria-label", `Bloc ${LABELS[type]}\u00a0: ${text}`);
    bank.append(b);

    makeDraggable(b, {
      onTap: () => tapBlock(b),
      onDragStart: () => setSelected(null),
      onDragMove: (x, y) => highlightTarget(dropTargetAt(x, y, ".zone, .bank")),
      onDrop: (x, y, cancelled) => {
        highlightTarget(null);
        const target = cancelled ? null : dropTargetAt(x, y, ".zone, .bank");
        if (target === bank) sendToBank(b);
        else if (target) placeInZone(b, target);
        else afterMove();
      },
    });
    // Le tap passe par les pointer events (drag.js) : au clavier on intercepte
    // Entrée/Espace nous-mêmes pour ne pas déclencher un second « click ».
    b.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tapBlock(b); }
    });
  });
}

// Réserve mélangée à chaque chargement : l'œil ne mémorise pas des positions.
for (const b of [...bank.children].sort(() => Math.random() - 0.5)) bank.append(b);

function highlightTarget(target) {
  if (target === currentTarget) return;
  currentTarget?.classList.remove("drop-target");
  currentTarget = target;
  currentTarget?.classList.add("drop-target");
}

// ----- Placement --------------------------------------------------------------

const blockIn = (zone) => zone.querySelector(".block");

function placeInZone(block, zone) {
  const existing = blockIn(zone);
  if (existing && existing !== block) bank.append(existing);
  zone.append(block);
  afterMove();
}

function sendToBank(block) {
  bank.append(block);
  afterMove();
}

function afterMove() {
  for (const zone of Object.values(zones)) zone.querySelector(".placeholder").hidden = Boolean(blockIn(zone));
  setSelected(null);
  updateSentence();
  clearFeedback(feedback);
  clearMarks();
}

function setSelected(block) {
  selected?.classList.remove("selected");
  selected = block;
  selected?.classList.add("selected");
  for (const zone of Object.values(zones)) zone.classList.toggle("selectable", Boolean(selected));
}

// Tap sur un bloc : dans une case → retour réserve ; dans la réserve → sélection + lecture.
function tapBlock(block) {
  if (block.parentElement !== bank) sendToBank(block);
  else if (selected === block) setSelected(null);
  else { setSelected(block); say(block.dataset.text); }
}

for (const zone of Object.values(zones)) {
  zone.addEventListener("click", () => { if (selected) placeInZone(selected, zone); });
  zone.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && selected) { e.preventDefault(); placeInZone(selected, zone); }
  });
}

// ----- Phrase -------------------------------------------------------------------

const parts = () => TYPES.map((t) => blockIn(zones[t])?.dataset.text ?? null);
const sentenceText = () => parts().filter(Boolean).join(" ");

function updateSentence() {
  const p = parts();
  if (p.every((x) => !x)) {
    sentenceEl.innerHTML = `<span class="empty">Ta phrase apparaîtra ici.</span>`;
    return;
  }
  sentenceEl.innerHTML = TYPES.map((t, i) =>
    p[i] ? `<span class="block ${CLASS_BY_TYPE[t]}">${escapeHtml(p[i])}${i === 2 ? "." : ""}</span>` : ""
  ).join("");
}

// ----- Boutons -------------------------------------------------------------------

document.getElementById("btn-speak").addEventListener("click", () => {
  const text = sentenceText();
  if (!text) { feedbackBox(feedback, "Place au moins un bloc pour écouter la phrase.", "info"); return; }
  speak(text + ".");
});

document.getElementById("btn-validate").addEventListener("click", () => {
  const blocks = TYPES.map((t) => blockIn(zones[t]));
  if (blocks.some((b) => !b)) {
    feedbackBox(feedback, "Il manque un bloc\u00a0: remplis les trois cases.", "info");
    return;
  }
  const ok = blocks.every((b, i) => b.dataset.type === TYPES[i]);
  clearMarks();
  blocks.forEach((b, i) => mark(b, b.dataset.type === TYPES[i]));
  updateSentence();
  sentenceEl.querySelectorAll(".block").forEach((b, i) => mark(b, blocks[i].dataset.type === TYPES[i]));
  stamp(sentenceEl, ok);
  if (ok) {
    const text = sentenceText() + ".";
    feedbackBox(feedback, escapeHtml(exo.feedbackReussite), "ok");
    say(text);
    saveResult("codeur", exo.id, { success: true });
  } else {
    const wrong = blocks.map((b, i) => (b.dataset.type !== TYPES[i] ? i : -1)).filter((i) => i >= 0);
    const names = wrong.map((i) => `«\u00a0${LABELS[TYPES[i]]}\u00a0»`).join(" et ");
    feedbackBox(feedback, `Le bloc en pointillés ne répond pas à la question ${names}. Écoute-le et essaie une autre case.`, "info");
    saveResult("codeur", exo.id, { success: false });
  }
  renderCount(head, progressCount("codeur", puzzles));
  renderNext(document.querySelector(".actions"), nextLink("codeur", puzzles, exo.id), ok);
});

document.getElementById("btn-reset").addEventListener("click", () => {
  document.querySelectorAll(".zone .block").forEach((b) => bank.append(b));
  afterMove();
});

afterMove();
