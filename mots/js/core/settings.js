// Réglages globaux : appliqués à <html> via variables CSS / attributs data-*
// et mémorisés. Le panneau (renderSettingsPanel) est le même sur toutes les pages.

import { getSettings, resetAll, saveSettings } from "./storage.js";
import { onVoicesReady, speak, ttsAvailable } from "./speech.js";

const FONTS = {
  Lexend: '"Lexend", "Atkinson Hyperlegible", Verdana, sans-serif',
  OpenDyslexic: '"OpenDyslexic", "Lexend", Verdana, sans-serif',
  "Atkinson Hyperlegible": '"Atkinson Hyperlegible", "Lexend", Verdana, sans-serif',
  Arial: "Arial, Helvetica, sans-serif",
  Verdana: "Verdana, Tahoma, sans-serif",
};

export function applySettings(s = getSettings()) {
  const root = document.documentElement;
  root.style.setProperty("--font-family", FONTS[s.font] || FONTS.Lexend);
  root.style.setProperty("--font-size", `${s.size}px`);
  root.style.setProperty("--line-height", String(s.lineHeight));
  root.dataset.bg = s.bg === "blanc" ? "blanc" : "papier";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", s.bg === "blanc" ? "#fbf9f4" : "#f6efe1");
  const c = s.blockColors;
  for (const type of ["sujet", "verbe", "complement"]) {
    root.dataset[`col${type[0].toUpperCase()}${type.slice(1)}`] = c.enabled && c[type] ? "1" : "0";
  }
}

const EXEMPLE = "Bonjour, je suis la voix qui lira les textes.";

export function renderSettingsPanel(container) {
  const s = getSettings();
  container.innerHTML = `
    <section class="settings-panel" aria-label="Réglages">
      <h2>Réglages</h2>
      <div class="grid grid-3">
        <div>
          <label for="set-font">Police</label>
          <select id="set-font">
            ${Object.keys(FONTS).map((f) => `<option value="${f}" ${f === s.font ? "selected" : ""}>${f}</option>`).join("")}
          </select>
        </div>
        <div>
          <label for="set-size">Taille du texte<output id="out-size">${s.size} px</output></label>
          <input id="set-size" type="range" min="14" max="26" step="1" value="${s.size}">
        </div>
        <div>
          <label for="set-lh">Interligne<output id="out-lh">${s.lineHeight}</output></label>
          <input id="set-lh" type="range" min="1.2" max="2.5" step="0.1" value="${s.lineHeight}">
        </div>
        <div>
          <label for="set-bg">Fond</label>
          <select id="set-bg">
            <option value="papier" ${s.bg !== "blanc" ? "selected" : ""}>Papier</option>
            <option value="blanc" ${s.bg === "blanc" ? "selected" : ""}>Blanc</option>
          </select>
        </div>
        <div>
          <label for="set-voice">Voix</label>
          <select id="set-voice" ${ttsAvailable ? "" : "disabled"}><option value="">Automatique</option></select>
          <p class="note" id="voice-note"></p>
        </div>
        <div>
          <label for="set-rate">Vitesse de la voix<output id="out-rate">${s.rate}</output></label>
          <input id="set-rate" type="range" min="0.6" max="1.3" step="0.1" value="${s.rate}">
          <button class="btn btn-secondary" id="btn-voice-test" type="button" style="margin-top:8px">Écouter un exemple</button>
        </div>
      </div>
      <p class="row" style="margin-top:16px">
        <label class="toggle"><input type="checkbox" id="set-voice-auto" ${s.voiceAuto ? "checked" : ""}> Lire à voix haute automatiquement les consignes et les retours</label>
      </p>
      <p class="row" style="margin-top:20px">
        <button class="btn btn-ghost" id="btn-reset-all" type="button">Effacer ma progression et mes réglages</button>
      </p>
    </section>`;

  const $ = (id) => container.querySelector(`#${id}`);
  const update = (patch) => applySettings(saveSettings(patch));

  $("set-font").addEventListener("change", (e) => update({ font: e.target.value }));
  $("set-bg").addEventListener("change", (e) => update({ bg: e.target.value }));
  $("set-size").addEventListener("input", (e) => { $("out-size").textContent = `${e.target.value} px`; update({ size: Number(e.target.value) }); });
  $("set-lh").addEventListener("input", (e) => { $("out-lh").textContent = e.target.value; update({ lineHeight: Number(e.target.value) }); });
  $("set-rate").addEventListener("input", (e) => { $("out-rate").textContent = e.target.value; update({ rate: Number(e.target.value) }); });
  $("btn-voice-test").addEventListener("click", () => speak(EXEMPLE));
  $("btn-reset-all").addEventListener("click", () => {
    if (confirm("Effacer toute la progression et les réglages ?")) { resetAll(); location.reload(); }
  });

  // Voix : la liste peut arriver après le chargement (voiceschanged).
  const voiceSel = $("set-voice");
  onVoicesReady((voices) => {
    const current = getSettings().voiceURI;
    voiceSel.innerHTML = `<option value="">Automatique${voices[0] ? ` (${voices[0].name})` : ""}</option>` +
      voices.map((v) => `<option value="${v.voiceURI}" ${v.voiceURI === current ? "selected" : ""}>${v.name} — ${v.lang}</option>`).join("");
    $("voice-note").textContent = !ttsAvailable
      ? "La lecture à voix haute n'est pas disponible sur ce navigateur."
      : voices.length ? "" : "Aucune voix française installée sur cet appareil. Sur iPad ou Mac : Réglages › Accessibilité › Contenu énoncé › Voix.";
  });
  voiceSel.addEventListener("change", (e) => { update({ voiceURI: e.target.value }); speak(EXEMPLE); });

  $("set-voice-auto").addEventListener("change", (e) => saveSettings({ voiceAuto: e.target.checked }));
}
