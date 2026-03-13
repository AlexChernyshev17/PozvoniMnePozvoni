const CACHE = 'lesha-ariana-v6';
const BASE = '/PozvoniMnePozvoni';

self.addEventListener('install', e => {
  // Don't cache anything — always fetch fresh
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Always network-first, no caching
  e.respondWith(fetch(e.request));
});

// Push notification received
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.notification?.title || '💌 Вас зовут на свидание!';
  const body  = data.notification?.body  || 'Открой приложение';
  e.waitUntil(
    self.registration.showNotification(title, {
      body, icon: BASE + '/apple-touch-icon.png', badge: BASE + '/apple-touch-icon.png',
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,
      data: { url: 'https://alexchernyshev17.github.io' + BASE + '/' }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const app = list.find(c => c.url.includes('PozvoniMnePozvoni'));
      if (app) return app.focus();
      return clients.openWindow('https://alexchernyshev17.github.io' + BASE + '/');
    })
  );
});
