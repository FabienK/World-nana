// Histoires à écouter : texte court, voix phrase par phrase, épingles, question.

import { loadJSON } from "../core/content.js";
import { speak, say, stop } from "../core/speech.js";
import { saveResult, getProgress, getSurlignages, toggleSurlignage, getSettings } from "../core/storage.js";
import { initPage, feedbackBox, clearFeedback, escapeHtml, icon, mark, clearMarks, stamp, renderColorToggle, renderCount, renderNext } from "../core/ui.js";
import { pickExercise, nextLink, progressCount } from "../core/parcours.js";

initPage("liseuse");

const { textes } = await loadJSON("../data/textes.json");
// Un exercice = une histoire ; elle est réussie quand toutes ses questions le sont.
const PARCOURS = { keys: (t) => t.questions.map((q) => `${t.id}-${q.id}`) };
const texte = pickExercise("liseuse", textes, PARCOURS);
const head = document.querySelector(".module-head");
const LETTERS = ["A", "B", "C", "D"];

document.getElementById("titre-texte").textContent = texte.titre;

const phrasesHost = document.getElementById("phrases");

function phraseHtml(p) {
  if (!getSettings().blockColors.enabled) return escapeHtml(p.text);
  return `<span class="gram-sujet">${escapeHtml(p.subject)}</span> <span class="gram-verbe">${escapeHtml(p.verb)}</span> <span class="gram-comp">${escapeHtml(p.object)}</span>.`;
}

function renderPhrases() {
  const marked = getSurlignages(texte.id);
  phrasesHost.innerHTML = texte.phrases
    .map((p) => `
      <div class="phrase-row ${marked.includes(p.id) ? "surlignee" : ""}" data-id="${p.id}">
        <div class="texte">${phraseHtml(p)}</div>
        <button class="btn btn-ghost btn-icon" data-speak="${p.id}" aria-label="Écouter la phrase ${p.id}">${icon("speaker")}</button>
        <button class="btn btn-ghost btn-icon" data-mark="${p.id}" aria-label="Épingler la phrase ${p.id}" aria-pressed="${marked.includes(p.id)}">${icon("pin")}</button>
      </div>`)
    .join("");
  phrasesHost.querySelectorAll("[data-speak]").forEach((b) =>
    b.addEventListener("click", () => {
      const p = texte.phrases.find((x) => x.id === Number(b.dataset.speak));
      if (session) stopReading();
      highlightReading(p.id);
      speak(p.text, { onEnd: () => highlightReading(null) });
    })
  );
  phrasesHost.querySelectorAll("[data-mark]").forEach((b) =>
    b.addEventListener("click", () => {
      // Mise à jour en place : le focus reste sur le bouton d'épingle.
      const id = Number(b.dataset.mark);
      toggleSurlignage(texte.id, id);
      const on = getSurlignages(texte.id).includes(id);
      b.setAttribute("aria-pressed", String(on));
      b.closest(".phrase-row").classList.toggle("surlignee", on);
      renderSynthese();
    })
  );
}

function highlightReading(id) {
  phrasesHost.querySelectorAll(".phrase-row").forEach((r) => r.classList.toggle("lecture", Number(r.dataset.id) === id));
}

function renderSynthese() {
  const marked = getSurlignages(texte.id);
  const host = document.getElementById("synthese");
  if (!marked.length) {
    host.innerHTML = `<p class="counter">Épingle une phrase importante pour la garder ici.</p>`;
    return;
  }
  host.innerHTML = texte.phrases.filter((p) => marked.includes(p.id)).map((p) => `<p>${escapeHtml(p.text)}</p>`).join("");
}

renderColorToggle(head, renderPhrases);
renderCount(head, progressCount("liseuse", textes, PARCOURS));
renderPhrases();
renderSynthese();

// Lecture continue : phrase par phrase, la phrase en cours est encadrée. Le
// même bouton arrête la lecture. `session` protège la chaîne : synth.cancel()
// déclenche onEnd dans certains navigateurs, on ignore alors l'ancien enchaînement.
const btnLireTout = document.getElementById("btn-lire-tout");
let session = null;

function setReading(on) {
  btnLireTout.setAttribute("aria-pressed", String(on));
  btnLireTout.innerHTML = on ? icon("stop") : icon("speaker");
  const label = on ? "Arrêter la lecture" : "Lire toute l’histoire";
  btnLireTout.setAttribute("aria-label", label);
  btnLireTout.title = label;
}

function stopReading() {
  session = null;
  stop();
  highlightReading(null);
  setReading(false);
}

btnLireTout.addEventListener("click", () => {
  if (session) { stopReading(); return; }
  stop();
  const mine = (session = {});
  let i = 0;
  setReading(true);
  const next = () => {
    if (session !== mine) return;
    if (i >= texte.phrases.length) { stopReading(); return; }
    const p = texte.phrases[i++];
    highlightReading(p.id);
    speak(p.text, { onEnd: next });
  };
  next();
});

// ----- Questions ---------------------------------------------------------------
// Les questions s'enchaînent dans la page (l'histoire et les épingles restent) ;
// après la dernière, « Suivant » mène à l'histoire suivante. On reprend à la
// première question pas encore réussie (toutes réussies : on rejoue depuis le début).

const feedback = document.getElementById("feedback");
const form = document.getElementById("form-choix");
const actions = document.querySelector("aside .actions");
const questionEl = document.getElementById("question");
const progress = getProgress("liseuse");
let qi = Math.max(0, texte.questions.findIndex((q) => !progress[`${texte.id}-${q.id}`]?.success));
let q = null;

function renderQuestion(focus = false) {
  q = texte.questions[qi];
  const n = texte.questions.length;
  questionEl.innerHTML = (n > 1 ? `<span class="discret">Question ${qi + 1} sur ${n}\u00a0—\u00a0</span>` : "") + escapeHtml(q.question);
  form.innerHTML = q.choix
    .map((c, i) => `
    <label class="choice">
      <input type="radio" name="choix" value="${i}">
      <span><strong>${LETTERS[i]}.</strong> ${escapeHtml(c.texte)}</span>
    </label>`)
    .join("");
  clearMarks(form);
  clearFeedback(feedback);
  highlightReading(null);
  renderNext(actions, null);
  if (focus) form.querySelector("input")?.focus();
}

/** Après validation : question suivante dans la page, ou histoire suivante. */
function nextTarget() {
  if (qi + 1 < texte.questions.length) return () => { qi += 1; renderQuestion(true); };
  return nextLink("liseuse", textes, texte.id, PARCOURS);
}

form.addEventListener("change", () => { clearMarks(form); clearFeedback(feedback); highlightReading(null); });
// Le bouton Vérifier est le submit du formulaire : Entrée sur un choix valide aussi.
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const checked = document.querySelector('input[name="choix"]:checked');
  if (!checked) { feedbackBox(feedback, "Choisis une réponse avant de vérifier.", "info"); return; }
  const ok = q.choix[Number(checked.value)].correct;
  clearMarks(form);
  mark(checked.closest(".choice"), ok);
  stamp(checked.closest(".choice"), ok);
  if (ok) {
    feedbackBox(feedback, escapeHtml(q.reussite), "ok");
    say(q.reussite);
    saveResult("liseuse", `${texte.id}-${q.id}`, { success: true });
  } else {
    feedbackBox(feedback, q.aide, "info");
    if (q.phraseSource) {
      highlightReading(q.phraseSource);
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.querySelector(`.phrase-row[data-id="${q.phraseSource}"]`)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" });
    }
    saveResult("liseuse", `${texte.id}-${q.id}`, { success: false });
  }
  renderCount(head, progressCount("liseuse", textes, PARCOURS));
  renderNext(actions, nextTarget(), ok);
});

renderQuestion();
