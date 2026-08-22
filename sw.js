/* ============================================================
   Service worker — cache l'app shell pour un Home utilisable
   hors ligne (voir backend.md, section V1 / Mode offline).
   ============================================================ */

const CACHE_NAME = 'world-nana-shell-v1';
const APP_SHELL = [
  './index.html',
  './home-grid-mono.html',
  './home-grid-color.html',
  './home-grid-bento.html',
  './home-story-hotspots.html',
  './home-story-hero.html',
  './home-story-triptych.html',
  './manifest.webmanifest',
  './icon.svg',
  './assets/portal-full.jpg',
  './assets/portal-hero.jpg',
  './assets/portal-left.jpg',
  './assets/portal-center.jpg',
  './assets/portal-right.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  const isSameOrigin = url.origin === self.location.origin;
  if (!isSameOrigin && !isFont) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
