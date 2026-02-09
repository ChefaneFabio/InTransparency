// InTransparency Service Worker
const CACHE_NAME = 'intransparency-v3';

// Only cache static assets that won't redirect
const urlsToCache = [
  '/manifest.json'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, cache fallback for static assets only
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Skip API requests - never cache these
  if (event.request.url.includes('/api/')) {
    return;
  }

  // For navigation requests (HTML pages), always go to network
  if (event.request.mode === 'navigate') {
    return;
  }

  // For static assets only (JS, CSS, images, fonts), use cache-first
  event.respondWith(
    caches.match(event.request)
      .then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful, opaque, or redirected responses
            if (!response || response.status !== 200 || response.type !== 'basic' || response.redirected) {
              return response;
            }

            // Only cache static assets
            const url = new URL(event.request.url);
            const isStaticAsset = url.pathname.startsWith('/_next/static/') ||
              url.pathname.startsWith('/icons/') ||
              url.pathname.endsWith('.js') ||
              url.pathname.endsWith('.css') ||
              url.pathname.endsWith('.woff2') ||
              url.pathname.endsWith('.png') ||
              url.pathname.endsWith('.jpg') ||
              url.pathname.endsWith('.svg');

            if (isStaticAsset) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }

            return response;
          })
          .catch(() => {
            return new Response('Network error', {
              status: 408,
              statusText: 'Request timeout'
            });
          });
      })
  );
});

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('InTransparency', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
