// Parcours : quel exercice montrer, et lequel vient ensuite. Un exercice =
// un chargement de page (`?ex=<id>`). Sans paramètre, la règle est fixe et
// prévisible : premier jamais vu (l'ordre du JSON est la progression voulue),
// sinon le raté le plus récent, sinon le réussi le plus ancien (rotation).

import { getProgress } from "./storage.js";

/**
 * Résumé de progression d'un exercice à partir de ses clés de stockage
 * (une par défaut, plusieurs pour une histoire à questions ou une série).
 * null = jamais vu ; success = toutes les clés réussies ; date = la plus récente.
 */
function statusOf(progress, keys) {
  const seen = keys.map((k) => progress[k]).filter(Boolean);
  if (!seen.length) return null;
  const success = seen.length === keys.length && seen.every((r) => r.success);
  const date = seen.map((r) => r.date).sort().at(-1);
  return { success, date };
}

const keysOf = (item, keys) => (keys ? keys(item) : [item.id]);

/** Exercice à présenter après `currentId` (null : premier de la session). */
export function nextExercise(moduleId, items, currentId = null, { keys } = {}) {
  const progress = getProgress(moduleId);
  const candidates = items.filter((i) => i.id !== currentId).map((i) => ({ item: i, st: statusOf(progress, keysOf(i, keys)) }));
  if (!candidates.length) return null;
  const unseen = candidates.find((c) => !c.st);
  if (unseen) return unseen.item;
  const failed = candidates.filter((c) => !c.st.success).sort((a, b) => b.st.date.localeCompare(a.st.date));
  if (failed.length) return failed[0].item;
  return candidates.sort((a, b) => a.st.date.localeCompare(b.st.date))[0].item;
}

/** Exercice de la page : `?ex=<id>` s'il existe, sinon la règle automatique. */
export function pickExercise(moduleId, items, opts) {
  const wanted = new URLSearchParams(location.search).get("ex");
  return (wanted && items.find((i) => i.id === wanted)) || nextExercise(moduleId, items, null, opts);
}

/** Lien « Suivant » (même page), ou null s'il n'y a rien d'autre à proposer. */
export function nextLink(moduleId, items, currentId, opts) {
  const n = nextExercise(moduleId, items, currentId, opts);
  return n ? `?ex=${encodeURIComponent(n.id)}` : null;
}

/** Réussis / total, pour le repère discret de l'en-tête. */
export function progressCount(moduleId, items, { keys } = {}) {
  const progress = getProgress(moduleId);
  const done = items.filter((i) => statusOf(progress, keysOf(i, keys))?.success).length;
  return { done, total: items.length };
}
