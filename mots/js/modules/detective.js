// Détective : décoder ce qu'un personnage veut vraiment dire.

import { loadJSON } from "../core/content.js";
import { speak, say } from "../core/speech.js";
import { saveResult } from "../core/storage.js";
import { initPage, feedbackBox, clearFeedback, escapeHtml, mark, clearMarks, stamp, renderCount, renderNext } from "../core/ui.js";
import { pickExercise, nextLink, progressCount } from "../core/parcours.js";

initPage("explorateur");

const { scenarios } = await loadJSON("../data/scenarios.json");
const sc = pickExercise("explorateur", scenarios);
const head = document.querySelector(".module-head");
renderCount(head, progressCount("explorateur", scenarios));
const LETTERS = ["A", "B", "C", "D"];

document.getElementById("contexte").textContent = sc.contexte;
document.getElementById("replique").textContent = `«\u00a0${sc.replique}\u00a0»`;
document.getElementById("question").textContent = sc.question;

document.getElementById("form-choix").innerHTML = sc.choix
  .map((c, i) => `
    <label class="choice">
      <input type="radio" name="choix" value="${i}">
      <span><strong>${LETTERS[i]}.</strong> ${escapeHtml(c.texte)}</span>
    </label>`)
  .join("");

// Le contexte est lu normalement, la réplique avec un ton un peu plus marqué :
// c'est l'intonation qui porte l'ironie.
document.getElementById("btn-speak-replique").addEventListener("click", () =>
  speak(sc.contexte, { onEnd: () => speak(sc.replique, { pitch: 1.15, rate: 0.85 }) })
);

const feedback = document.getElementById("feedback");
const pensee = document.getElementById("pensee");
const form = document.getElementById("form-choix");
form.addEventListener("change", () => { clearMarks(); clearFeedback(feedback); pensee.innerHTML = ""; });

// Le bouton Vérifier est le submit du formulaire : Entrée sur un choix valide aussi.
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const checked = document.querySelector('input[name="choix"]:checked');
  pensee.innerHTML = "";
  if (!checked) { feedbackBox(feedback, "Choisis une réponse avant de vérifier.", "info"); return; }
  const choice = sc.choix[Number(checked.value)];
  clearMarks();
  mark(checked.closest(".choice"), choice.correct);
  stamp(checked.closest(".choice"), choice.correct);
  if (choice.correct) {
    feedbackBox(feedback, escapeHtml(sc.reussite), "ok");
    pensee.innerHTML = `<div class="pensee"><span class="discret">Ce que pense vraiment le personnage\u00a0:</span><br>«\u00a0${escapeHtml(sc.penseeReelle)}\u00a0»</div>`;
    say(sc.reussite);
    saveResult("explorateur", sc.id, { success: true });
  } else {
    feedbackBox(feedback, sc.explication, "info");
    saveResult("explorateur", sc.id, { success: false });
  }
  renderCount(head, progressCount("explorateur", scenarios));
  renderNext(document.querySelector(".reponse .actions"), nextLink("explorateur", scenarios, sc.id), choice.correct);
});
