// Chasse au mot : retrouver un mot à partir d'une phrase et de trois indices.

import { loadJSON } from "../core/content.js";
import { speak, say, listen, sttAvailable } from "../core/speech.js";
import { saveResult, getCarnet, addToCarnet } from "../core/storage.js";
import { initPage, feedbackBox, clearFeedback, setupTabs, toast, escapeHtml, icon, mark, clearMarks, stamp, renderCount, renderNext } from "../core/ui.js";
import { pickExercise, nextLink, progressCount } from "../core/parcours.js";

initPage("lexique");

const data = await loadJSON("../data/lexique.json");
const mot = pickExercise("lexique", data.mots);
const head = document.querySelector(".module-head");
renderCount(head, progressCount("lexique", data.mots));

document.getElementById("situation").textContent = mot.situation;
document.getElementById("ind-semantique").textContent = mot.indices.semantique;
const picto = document.getElementById("ind-picto");
picto.textContent = mot.indices.picto;
picto.setAttribute("aria-label", `Indice en image\u00a0: ${mot.indices.picto}`);
document.getElementById("ind-syllabe").textContent = `«\u00a0${mot.indices.syllabe}…\u00a0»`;
// Indices à la demande : aucun ouvert au départ, un second clic referme.
setupTabs(document.getElementById("tabs-indices"), { initial: -1, toggle: true });

document.getElementById("btn-speak-situation").addEventListener("click", () => speak(mot.situation));
document.getElementById("btn-speak-syllabe").addEventListener("click", () => speak(mot.indices.syllabe));

const input = document.getElementById("reponse");
const feedback = document.getElementById("feedback");

// ----- Dictée vocale (masquée si le navigateur ne la gère pas) -------------

const mic = document.getElementById("btn-mic");
if (!sttAvailable) {
  mic.hidden = true;
  document.getElementById("label-reponse").textContent = "Écris le mot";
} else {
  let session = null;
  mic.addEventListener("click", () => {
    if (session) { session.stop(); return; }
    mic.classList.add("listening");
    mic.setAttribute("aria-pressed", "true");
    session = listen({
      // Même effet qu'une saisie clavier : efface le tampon et le feedback précédents.
      onResult: (text) => { input.value = text.trim(); input.dispatchEvent(new Event("input", { bubbles: true })); },
      onError: (err) => toast(err === "not-allowed" ? "Le micro n’est pas autorisé." : "Je n’ai pas bien entendu, réessaie."),
      onEnd: () => { mic.classList.remove("listening"); mic.setAttribute("aria-pressed", "false"); session = null; },
    });
  });
}

// ----- Vérification -----------------------------------------------------------

const normalize = (s) => s.toLowerCase().trim().replace(/\s+/g, " ").replace(/[.!?]$/, "");

function check() {
  const answer = normalize(input.value);
  if (!answer) { feedbackBox(feedback, "Écris ou dicte un mot avant de vérifier.", "info"); return; }
  const accepted = [mot.mot, ...(mot.variantes || [])].map(normalize);
  const ok = accepted.includes(answer);
  mark(input, ok);
  // Tampon sur le champ lui-même (`.field`), pas sur la ligne : la ligne porte aussi le micro, Vérifier et Suivant.
  stamp(input.parentElement, ok, ok ? "Trouvé" : "À revoir");
  if (ok) {
    feedbackBox(feedback, `C’est bien <strong>${escapeHtml(mot.mot)}</strong>. Il est ajouté à ton carnet.`, "ok");
    say(`C’est bien ${mot.mot}.`);
    saveResult("lexique", mot.id, { success: true });
    addToCarnet({ mot: mot.mot[0].toLocaleUpperCase("fr") + mot.mot.slice(1), definition: mot.definition, emoji: mot.emoji });
    renderCarnet();
  } else {
    feedbackBox(feedback, escapeHtml(mot.aide), "info");
    saveResult("lexique", mot.id, { success: false });
  }
  renderCount(head, progressCount("lexique", data.mots));
  renderNext(input.closest(".input-row"), nextLink("lexique", data.mots, mot.id), ok);
}

document.getElementById("btn-check").addEventListener("click", check);
input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
input.addEventListener("input", () => { clearMarks(); clearFeedback(feedback); });

// ----- Carnet -------------------------------------------------------------------

function renderCarnet() {
  // Mots trouvés en tête, du plus récent au plus ancien, puis le carnet de départ :
  // le mot qu'on vient de trouver est visible sans faire défiler.
  const saved = getCarnet().filter((s) => !data.carnetInitial.some((c) => c.mot.toLowerCase() === s.mot.toLowerCase()));
  const entries = [...saved.reverse(), ...data.carnetInitial];
  const host = document.getElementById("carnet");
  host.scrollTop = 0;
  host.innerHTML = entries
    .map((e) => `<li><strong>${escapeHtml(e.mot)}</strong><span class="def">${escapeHtml(e.definition)}</span>
      <button class="btn btn-ghost btn-icon" data-speak="${escapeHtml(`${e.mot}. ${e.definition}`)}" aria-label="Écouter ${escapeHtml(e.mot)}">${icon("speaker")}</button></li>`)
    .join("");
  document.querySelectorAll("#carnet [data-speak]").forEach((b) => b.addEventListener("click", () => speak(b.dataset.speak)));
}
renderCarnet();
// Dès la tablette (portrait compris) le carnet est ouvert : il occupe le bas de la page.
if (matchMedia("(min-width: 700px)").matches) document.querySelector("details.repli").open = true;
