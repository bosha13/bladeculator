const CACHE_VERSION = 'v7';
const CACHE_NAME = `bladeculator-${CACHE_VERSION}`;
const ASSETS = [
  './bladeculator.html',
  './style.css',
  './haptics.js',
  './core.js',
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
  './images/close.svg',
  './images/question.svg',
  './images/reset.svg',
  './images/language.svg',
  './images/left-arrow.svg',
  './images/right-arrow.svg',
  './images/icon-about.png',
  './images/favicon/favicon.ico',
  './images/favicon/icon.svg',
  './images/favicon/icon-192.png',
  './images/favicon/icon-512.png',
  './images/favicon/apple-touch-icon.png'
];

const CORE_ASSETS = [
  './bladeculator.html',
  './style.css',
  './haptics.js',
  './core.js',
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

// Core assets are revalidated as one set: either all of them are replaced or none,
// so a reload never mixes old and new files and clients are notified only once.
let revalidation = null;
const revalidateCoreAssets = () => {
  if (revalidation) return revalidation;
  revalidation = (async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const fresh = await Promise.all(CORE_ASSETS.map(async (asset) => {
        const response = await fetch(asset, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`${asset}: HTTP ${response.status}`);
        return [asset, response];
      }));

      let changed = false;
      for (const [asset, response] of fresh) {
        const cached = await cache.match(asset);
        if (!cached || !areBuffersEqual(
          await cached.arrayBuffer(),
          await response.clone().arrayBuffer()
        )) {
          changed = true;
          break;
        }
      }
      if (!changed) return;

      await Promise.all(fresh.map(([asset, response]) => cache.put(asset, response)));
      console.info('[SW] Core assets updated');
      await notifyClients();
    } catch (error) {
      // Offline or partial failure: keep the current consistent cache.
    } finally {
      revalidation = null;
    }
  })();
  return revalidation;
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // Bypass the HTTP cache (GitHub Pages sends max-age=600): otherwise a new
      // worker can install stale files next to fresh ones.
      .then((cache) => cache.addAll(ASSETS.map((asset) => new Request(asset, { cache: 'reload' }))))
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

// The page asks for revalidation after its load event, when all of its core assets
// are already served, so a fresh set in the cache can never mix with an old page.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'REVALIDATE') {
    event.waitUntil(revalidateCoreAssets());
  }
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
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok || request.mode !== 'navigate') return response;
        } catch (error) {
          if (request.mode !== 'navigate') throw error;
        }
        return cache.match('./bladeculator.html');
      })()
    );
    return;
  }

  if (!isSameOrigin) return;

  const updatePromise = fetch(request).then(async (response) => {
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  });

  event.waitUntil(updatePromise.then(() => undefined).catch(() => undefined));
  event.respondWith(
    caches.match(request).then((cached) => cached || updatePromise)
  );
});
