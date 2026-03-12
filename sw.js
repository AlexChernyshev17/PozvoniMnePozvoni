const CACHE = 'lesha-ariana-v2';
const ASSETS = ['/', '/index.html', '/manifest.json'];
const VAPID_KEY = 'BIv-h5biJfGCkCtpLpBuNRerlPGD2KSWzVRyFZ04p0MfK3Vva11RNDYtEiTBuJ8CxApsd6IOZs9DQOXEWZCvR8k';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// Push notification received
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.notification?.title || '💌 Вас зовут на свидание!';
  const body  = data.notification?.body  || 'Открой приложение';
  e.waitUntil(
    self.registration.showNotification(title, {
      body, icon: '/apple-touch-icon.png', badge: '/apple-touch-icon.png',
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,
      data: { url: 'https://alexchernyshev17.github.io/PozvoniMnePozvoni/' }
    })
  );
});

// Tap on notification — open app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const app = list.find(c => c.url.includes('PozvoniMnePozvoni'));
      if (app) return app.focus();
      return clients.openWindow('https://alexchernyshev17.github.io/PozvoniMnePozvoni/');
    })
  );
});
