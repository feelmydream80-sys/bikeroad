const CACHE_NAME = 'bike-road-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon.svg',
  '/manifest.json',
  '/src/main.js',
  '/src/map/init.js',
  '/src/map/route.js',
  '/src/map/draw.js',
  '/src/db/indexeddb.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // OpenStreetMap 타일 캐싱
  if (request.url.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open('osm-tiles').then((cache) => {
        return cache.match(request).then((response) => {
          if (response) return response;
          return fetch(request).then((fetchResponse) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // 정적 자원: Cache First
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) return response;
      return fetch(request).catch(() => {
        // 오프라인 폴백 (필요시)
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
