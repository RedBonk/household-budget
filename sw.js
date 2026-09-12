/* 가계부 PWA 서비스워커
   - 앱 껍데기(HTML/manifest/아이콘)를 캐시해서 오프라인에서도 열리게 함
   - 거래 데이터는 Supabase와 동기화하며 localStorage에도 로컬 백업으로 저장됨
   - 캐시 이름의 버전(v1)을 올리면 예전 캐시를 정리하고 새로 받아옴 */
const CACHE_NAME = 'household-dashboard-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* 네트워크 우선, 실패하면 캐시로 (오프라인 대비). 야후/코인게코 등 외부 시세 API 호출은 그대로 통과시킴 */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // 외부 API는 서비스워커가 관여하지 않음

  event.respondWith(
    fetch(event.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
  );
});
