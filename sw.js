const CACHE_VERSION = 'v1';
const CACHE_NAME = `bladeculator-${CACHE_VERSION}`;
const ASSETS = [
  './bladeculator.html',
  './style.css',
  './calculator.js',
  './localization.js',
  './select-localize.js',
  './pwa.js',
  './manifest.webmanifest',
  './images/blade.svg',
  './images/blade-color.svg',
  './images/soap.svg',
  './images/soap-color.svg',
  './images/check.svg',
  './images/question.svg',
  './images/language.svg',
  './images/left-arrow.svg',
  './images/right-arrow.svg',
  './images/favicon/favicon.ico',
  './images/favicon/icon.svg',
  './images/favicon/icon-192.png',
  './images/favicon/icon-512.png',
  './images/favicon/apple-touch-icon.png'
];

const CORE_ASSETS = [
  './bladeculator.html',
  './style.css',
  './calculator.js',
  './localization.js',
  './select-localize.js',
  './pwa.js',
  './manifest.webmanifest'
];

const baseUrl = new URL('./', self.location);
const coreAssetPaths = new Set(
  CORE_ASSETS.map((asset) => new URL(asset, baseUrl).pathname)
);

const areBuffersEqual = (a, b) => {
  if (a.byteLength !== b.byteLength) return false;
  const aView = new Uint8Array(a);
  const bView = new Uint8Array(b);
  for (let i = 0; i < aView.length; i += 1) {
    if (aView[i] !== bView[i]) return false;
  }
  return true;
};

const notifyClients = async () => {
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach((client) => client.postMessage({ type: 'CACHE_UPDATED' }));
};

const cacheFirstWithRevalidate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const updatePromise = (async () => {
    try {
      const response = await fetch(request);
      if (!response || !response.ok) return;
      let shouldNotify = false;
      if (cached) {
        const [cachedBuffer, networkBuffer] = await Promise.all([
          cached.clone().arrayBuffer(),
          response.clone().arrayBuffer()
        ]);
        shouldNotify = !areBuffersEqual(cachedBuffer, networkBuffer);
      } else {
        shouldNotify = true;
      }
      await cache.put(request, response.clone());
      if (shouldNotify) {
        console.info('[SW] Cache updated:', request.url);
        await notifyClients();
      }
    } catch (error) {
      // Ignore update errors; cached response is still served.
    }
  })();

  return { cached, updatePromise };
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isCoreAsset = request.mode === 'navigate' || coreAssetPaths.has(url.pathname);

  if (isSameOrigin && isCoreAsset) {
    event.respondWith(
      (async () => {
        const { cached, updatePromise } = await cacheFirstWithRevalidate(request);
        event.waitUntil(updatePromise);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (!response || !response.ok) {
            if (request.mode === 'navigate') {
              return caches.match('./bladeculator.html');
            }
            return cached;
          }
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
          return response;
        } catch (error) {
          if (request.mode === 'navigate') {
            return caches.match('./bladeculator.html');
          }
          return cached;
        }
      })()
    );
    return;
  }

  if (!isSameOrigin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
