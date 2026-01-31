(() => {
  if (!('serviceWorker' in navigator)) return;
  const triggerReload = () => {
    if (hasRefreshed) return;
    hasRefreshed = true;
    sessionStorage.setItem('swReloaded', 'true');
    console.info('[PWA] Update applied, reloading...');
    window.location.reload();
  };

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      registration.update();
    });
  });

  let hasRefreshed = sessionStorage.getItem('swReloaded') === 'true';
  navigator.serviceWorker.addEventListener('controllerchange', triggerReload);
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      triggerReload();
    }
  });
})();
