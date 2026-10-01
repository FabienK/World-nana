// Chargement des fichiers de contenu (data/*.json). Tout le contenu
// pédagogique vit dans ces fichiers, jamais en dur dans le JS.

const cache = new Map();

export async function loadJSON(path) {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Impossible de charger ${path} (${res.status})`);
  const data = await res.json();
  cache.set(path, data);
  return data;
}
