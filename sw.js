/* 가계부 PWA 서비스워커 v11
   - 온라인에서는 index.html/navigation을 항상 네트워크에서 새로 확인
   - 오프라인일 때만 캐시된 앱 화면을 사용
   - 이전 캐시는 activate 시 삭제 */
const CACHE_NAME = 'household-dashboard-v11';
const APP_SHELL = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith('/version.json')) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }));
    return;
  }

  const isNavigation = event.request.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/household-budget/');
  if (isNavigation) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(res => {
          if (res && res.ok) caches.open(CACHE_NAME).then(cache => cache.put('./index.html', res.clone()));
          return res;
        })
        .catch(() => caches.match('./index.html').then(cached => cached || Response.error()))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res && res.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, res.clone()));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
