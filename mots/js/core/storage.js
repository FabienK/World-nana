// Persistance locale (une seule utilisatrice) : tout tient dans une clé
// localStorage versionnée. Chaque lecture/écriture est protégée : en
// navigation privée ou si le stockage est bloqué, l'app fonctionne sans.

const KEY = "wn-tdl";
const VERSION = 2; // v2 : nouveaux réglages (police Lexend, voix, couleurs des blocs)

const DEFAULTS = {
  version: VERSION,
  settings: {
    font: "Lexend",
    size: 18,
    lineHeight: 1.7,
    bg: "papier",          // papier | blanc
    rate: 0.9,
    voiceURI: "",          // vide = meilleure voix française détectée
    blockColors: { enabled: true, sujet: true, verbe: true, complement: true },
    voiceAuto: false,      // lecture automatique des consignes et retours (tous les jeux)
  },
  progress: {},   // { [moduleId]: { [exerciseId]: { success, hints, date } } }
  carnet: [],     // [{ mot, definition, emoji }]
  surlignages: {},// { [texteId]: [phraseId, ...] }
};

let cache = null;

function load() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : null;
    cache = data && data.version === VERSION ? { ...structuredClone(DEFAULTS), ...data } : structuredClone(DEFAULTS);
  } catch {
    cache = structuredClone(DEFAULTS);
  }
  return cache;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* stockage indisponible : on garde seulement l'état en mémoire */
  }
}

export function getSettings() {
  const s = load().settings;
  return {
    ...DEFAULTS.settings,
    ...s,
    blockColors: { ...DEFAULTS.settings.blockColors, ...(s.blockColors || {}) },
  };
}

export function saveSettings(patch) {
  const data = load();
  data.settings = { ...getSettings(), ...patch };
  if (patch.blockColors) data.settings.blockColors = { ...getSettings().blockColors, ...patch.blockColors };
  persist();
  return getSettings();
}

export function getProgress(moduleId) {
  return load().progress[moduleId] || {};
}

export function saveResult(moduleId, exerciseId, { success, hints = 0 }) {
  const data = load();
  data.progress[moduleId] ??= {};
  data.progress[moduleId][exerciseId] = { success, hints, date: new Date().toISOString() };
  persist();
}

/** Dernier résultat enregistré pour un module (pour l'accueil). */
export function lastResult(moduleId) {
  const entries = Object.entries(getProgress(moduleId));
  if (!entries.length) return null;
  entries.sort((a, b) => (a[1].date < b[1].date ? 1 : -1));
  const [exerciseId, r] = entries[0];
  return { exerciseId, ...r };
}

export function getCarnet() {
  return load().carnet;
}

export function addToCarnet(entry) {
  const data = load();
  if (!data.carnet.some((e) => e.mot.toLowerCase() === entry.mot.toLowerCase())) {
    data.carnet.push(entry);
    persist();
  }
  return data.carnet;
}

export function getSurlignages(texteId) {
  return load().surlignages[texteId] || [];
}

export function toggleSurlignage(texteId, phraseId) {
  const data = load();
  const list = (data.surlignages[texteId] ??= []);
  const i = list.indexOf(phraseId);
  if (i >= 0) list.splice(i, 1);
  else list.push(phraseId);
  persist();
  return list;
}


export function resetAll() {
  cache = structuredClone(DEFAULTS);
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
