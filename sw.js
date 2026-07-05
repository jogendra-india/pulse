// App-shell cache: stale-while-revalidate. Every load is served from cache
// instantly, while a background fetch refreshes that cache for next time —
// so a new deploy shows up on the following visit automatically, with no
// manual cache-version bump required.
const CACHE = 'pulse-shell';

const SHELL_ABS = ['./', './index.html', './support.js', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png']
  .map((p) => new URL(p, self.location).href)
  .concat([
    'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  ]);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL_ABS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Web Push: the backend's nudge task sends a JSON payload ({title, body,
// url, icon}); show it as a notification even when no tab is open.
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}
  const title = data.title || 'Pulse';
  const options = {
    body: data.body || '',
    icon: data.icon || './icon-192.png',
    badge: './icon-192.png',
    vibrate: [80, 40, 80],
    data: { url: data.url || './' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Tapping the notification focuses an existing Pulse tab if one's open,
// otherwise opens the app.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isShellAsset = SHELL_ABS.includes(req.url) || new URL(req.url).origin === self.location.origin;
  if (!isShellAsset) return; // API calls etc. — untouched, handled by the app's own online/offline logic

  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
