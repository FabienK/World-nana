// Éléments d'interface communs à toutes les pages.

import { applySettings, renderSettingsPanel } from "./settings.js";
import { getSettings, saveSettings } from "./storage.js";

// Les `id` servent de clés de progression : ne pas les renommer.
export const MODULES = [
  { id: "codeur", num: 1, title: "Puzzle de phrases", page: "modules/puzzle.html",
    accroche: "Assemble des blocs pour fabriquer une phrase qui tient debout." },
  { id: "lexique", num: 2, title: "Chasse au mot", page: "modules/chasse-au-mot.html",
    accroche: "Un mot se cache. Trois indices pour le retrouver." },
  { id: "explorateur", num: 3, title: "Détective", page: "modules/detective.html",
    accroche: "Ce qu'on dit et ce qu'on pense vraiment : à toi de décoder." },
  { id: "organiseur", num: 4, title: "Dans la bonne case", page: "modules/bonne-case.html",
    accroche: "Range la chambre en suivant la voix : à gauche, sur, sous, entre…" },
  { id: "liseuse", num: 5, title: "Histoires à écouter", page: "modules/histoires.html",
    accroche: "Des histoires courtes à lire et à écouter, une phrase à la fois." },
];

// ----- Icônes (inline SVG, 24×24, trait) -----------------------------------

const ICONS = {
  speaker: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
  stop: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 5"/><path d="m21 9-5 5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
  pin: '<path d="M12 17v4"/><path d="M8 3h8l-1 7 2 3H7l2-3z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  back: '<path d="m15 6-6 6 6 6"/>',
  home: '<path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  next: '<path d="M4 12h16"/><path d="m13 5 7 7-7 7"/>',
};

export function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

/**
 * Initialise une page : applique les réglages, injecte le header et le
 * panneau réglages (replié). `moduleId` = null pour l'accueil.
 */
export function initPage(moduleId) {
  applySettings();
  const isHome = !moduleId;
  const root = isHome ? "" : "../";
  const mod = MODULES.find((m) => m.id === moduleId);

  const header = document.createElement("header");
  header.className = "app-header";
  header.innerHTML = `
    <span class="brand" translate="no"><span>World’s Nana</span><span class="brand-short" aria-hidden="true">WN</span></span>
    ${mod ? `<h1 class="app-title">${mod.title}</h1>` : `<span></span>`}
    <span class="app-actions">
    ${isHome ? "" : `<a class="btn btn-secondary btn-icon" id="lnk-home" href="${root}index.html" aria-label="Accueil" title="Accueil">${icon("home")}</a>`}
    <button class="btn btn-secondary btn-icon" id="btn-settings" title="Réglages" aria-label="Réglages" aria-expanded="false" aria-controls="settings-host">${icon("settings")}</button>
    </span>`;
  document.body.prepend(header);

  const settingsHost = document.createElement("div");
  settingsHost.id = "settings-host";
  settingsHost.className = "page hidden";
  header.after(settingsHost);
  renderSettingsPanel(settingsHost);

  const btnSettings = header.querySelector("#btn-settings");
  const setSettingsOpen = (open) => {
    settingsHost.classList.toggle("hidden", !open);
    btnSettings.setAttribute("aria-expanded", String(open));
  };
  btnSettings.addEventListener("click", () => setSettingsOpen(settingsHost.classList.contains("hidden")));
  // Fermeture par Échap ou par un clic hors du panneau.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !settingsHost.classList.contains("hidden")) { setSettingsOpen(false); btnSettings.focus(); }
  });
  document.addEventListener("pointerdown", (e) => {
    if (settingsHost.classList.contains("hidden")) return;
    if (!settingsHost.contains(e.target) && !btnSettings.contains(e.target)) setSettingsOpen(false);
  });

  if (mod) {
    document.body.classList.add("module");
    document.title = `${mod.title} — World’s Nana`;
  }
  // Remplace les <button data-icon="x"> par leur icône.
  document.querySelectorAll("[data-icon]").forEach((el) => el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon)));
  return mod;
}

/**
 * Bascule « couleurs qui / fait quoi / quoi » : réglage propre aux jeux qui
 * colorent la grammaire (Puzzle, Histoires), pas aux réglages généraux.
 * Mémorisé dans settings.blockColors.enabled ; `onChange` pour re-rendre.
 */
export function renderColorToggle(host, onChange) {
  if (!host) return;
  const on = getSettings().blockColors.enabled;
  host.insertAdjacentHTML("beforeend", `<label class="toggle toggle-couleurs"><input type="checkbox" id="toggle-couleurs" ${on ? "checked" : ""}> <span class="swatches" aria-hidden="true"><i class="sw-sujet"></i><i class="sw-verbe"></i><i class="sw-comp"></i></span> Couleurs qui / fait quoi / quoi</label>`);
  host.querySelector("#toggle-couleurs").addEventListener("change", (e) => {
    const c = { ...getSettings().blockColors, enabled: e.target.checked };
    applySettings(saveSettings({ blockColors: c }));
    onChange?.(e.target.checked);
  });
}

/**
 * Repère discret « 3 sur 8 » (réussis / total) dans `.module-head`.
 * Ne pose rien s'il n'y a qu'un exercice.
 */
export function renderCount(host, { done, total }) {
  if (!host || total < 2) return;
  host.querySelector(".count")?.remove();
  host.insertAdjacentHTML("beforeend", `<span class="count" aria-label="${done} réussis sur ${total}">${done}\u00a0sur\u00a0${total}</span>`);
}

/**
 * Bouton « Suivant » (flèche seule) posé dans `.actions` après une
 * validation : principal après réussite, discret après erreur — elle n'est
 * jamais bloquée. `target` = lien (`?ex=…`, nouvel exercice) ou fonction
 * (enchaînement dans la page, ex. question suivante d'une histoire) ;
 * null (rien d'autre à proposer) : rien.
 */
export function renderNext(host, target, ok) {
  if (!host) return;
  host.querySelector(".btn-next")?.remove();
  // Une seule action principale : quand Suivant est plein, les autres boutons pleins de la ligne passent en secondaire.
  host.classList.toggle("has-next", Boolean(target && ok));
  if (!target) return;
  const isLink = typeof target === "string";
  const el = document.createElement(isLink ? "a" : "button");
  el.className = `btn btn-icon btn-next ${ok ? "" : "btn-ghost"}`;
  if (isLink) el.href = target;
  else { el.type = "button"; el.addEventListener("click", target); }
  el.setAttribute("aria-label", "Suivant");
  el.title = "Suivant";
  el.innerHTML = icon("next");
  host.append(el);
  if (ok) el.focus();
}

/**
 * Validation « B + C » : marquer l'élément (contour or / pointillé terracotta)
 * et poser un tampon manuscrit sur son conteneur.
 */
export function mark(el, ok) {
  if (!el) return;
  el.classList.toggle("is-right", ok === true);
  el.classList.toggle("is-wrong", ok === false);
}

export function clearMarks(root = document) {
  root.querySelectorAll(".is-right, .is-wrong").forEach((el) => el.classList.remove("is-right", "is-wrong"));
  root.querySelectorAll(".stamp").forEach((el) => el.remove());
}

/** Pose (ou remplace) le tampon « Réussi » / « À revoir » sur `host`. */
export function stamp(host, ok, text) {
  if (!host) return;
  host.classList.add("stamp-host");
  host.querySelector(".stamp")?.remove();
  const el = document.createElement("span");
  el.className = `stamp ${ok ? "ok" : "ko"}`;
  el.setAttribute("role", "status");
  el.textContent = text ?? (ok ? "Réussi" : "À revoir");
  host.append(el);
}

/** Affiche un message dans une boîte de feedback. kind : info | success | warn | ok (ligne discrète) */
export function feedbackBox(container, html, kind = "info") {
  container.className = kind === "ok" ? "note-ok" : `feedback-box ${kind}`;
  container.innerHTML = html;
  container.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

export function clearFeedback(container) {
  container.className = "feedback-box";
  container.innerHTML = "";
}


let toastEl;
export function toast(msg, ms = 2500) {
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.setAttribute("role", "status");
    document.body.append(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove("show"), ms);
}

/** Onglets accessibles : boutons [role=tab] + panneaux [role=tabpanel]. */
/**
 * Onglets accessibles. initial = index ouvert au départ (-1 : aucun) ;
 * toggle = un clic sur l'onglet ouvert le referme (indices à la demande).
 */
export function setupTabs(tablist, { initial = 0, toggle = false } = {}) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
  let current = initial;
  const select = (idx) => {
    current = idx;
    tabs.forEach((t, i) => {
      t.setAttribute("aria-selected", String(i === idx));
      t.tabIndex = i === idx || (idx < 0 && i === 0) ? 0 : -1;
      panels[i].hidden = i !== idx;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(toggle && current === i ? -1 : i));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { select((i + 1) % tabs.length); tabs[(i + 1) % tabs.length].focus(); }
      if (e.key === "ArrowLeft") { select((i - 1 + tabs.length) % tabs.length); tabs[(i - 1 + tabs.length) % tabs.length].focus(); }
    });
  });
  select(initial);
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
