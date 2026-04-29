// ============================================================
// sw.js — Service Worker per Trasporti LIVE v3.7.0
// Strategia: Cache-first per asset locali, fallback network.
// Aggiornare CACHE_NAME ad ogni release per forzare un reload.
// NOTA BENE: Il bump di versione DEVE esserci ad ogni update
// per garantire che la cache venga invalidata sui client!
// ============================================================

const CACHE_NAME = 'trasporti-bg-v3.7.0';

// Asset da pre-cachare all'installazione
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './js/app.js',
  './data/config.js',
  './data/z649.js',
  './data/z627.js',
  './data/z644.js',
  './data/z625.js',
  './data/z647.js',
  './data/z642.js',
  './manifest.json'
];

// ── Install: pre-cacha tutti gli asset locali ─────────────────
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(function() {
        // Attiva immediatamente senza aspettare che le tab vengano chiuse
        return self.skipWaiting();
      })
  );
});

// ── Activate: elimina cache vecchie ──────────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) { return name !== CACHE_NAME; })
          .map(function(name) { return caches.delete(name); })
      );
    }).then(function() {
      // Prende controllo di tutte le tab aperte subito
      return self.clients.claim();
    })
  );
});

// ── Fetch: cache-first per risorse locali ────────────────────
self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // Ignora richieste cross-origin (Google Fonts, ecc.)
  if (!url.startsWith(self.location.origin)) return;

  // Ignora metodi non-GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached; // Risposta dalla cache → offline-ready

      // Non in cache: scarica dalla rete e aggiungi alla cache
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        var toCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, toCache);
        });
        return response;
      });
    })
  );
});
