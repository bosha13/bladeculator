(() => {
  if (!('serviceWorker' in navigator)) return;
  let hasRefreshed = false;

  const triggerReload = () => {
    if (hasRefreshed) return;
    hasRefreshed = true;
    console.info('[PWA] Update applied, reloading...');
    window.location.reload();
  };

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      return registration.update();
    }).catch((error) => {
      console.warn('[PWA] Service Worker registration/update failed:', error);
    });
  });

  navigator.serviceWorker.addEventListener('controllerchange', triggerReload);
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      triggerReload();
    }
  });
})();
