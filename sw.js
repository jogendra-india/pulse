// App-shell cache: makes the page itself load instantly (and work fully
// offline, not just "API down") by serving index.html/support.js/React from
// cache first. Bump CACHE whenever index.html or support.js changes, or
// returning visitors keep the stale shell until it falls out of cache.
const CACHE = 'pulse-shell-v2';

const SHELL_ABS = ['./', './index.html', './support.js']
  .map((p) => new URL(p, self.location).href)
  .concat([
    'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  ]);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL_ABS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isShellAsset = SHELL_ABS.includes(req.url) || new URL(req.url).origin === self.location.origin;
  if (!isShellAsset) return; // API calls etc. — untouched, handled by the app's own online/offline logic

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});
