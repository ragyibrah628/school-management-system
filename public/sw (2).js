// Nambawala Sec service worker.
// - Hashed files in /assets/ never change, so they are served from the cache first (instant opening).
// - Pages and other files: network first, but if the network takes more than 4 seconds the
//   saved copy is used, so the app never hangs on a weak connection.
// - Supabase and every other website are never touched.
const CACHE = 'nambawala-shell-v2';
const NETWORK_WAIT_MS = 4000;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function store(request, response) {
  if (response && response.ok && response.type === 'basic') {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
  }
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(hit => hit || fetch(request).then(response => store(request, response)))
    );
    return;
  }

  event.respondWith(
    new Promise(resolve => {
      let settled = false;
      const finish = response => { if (!settled && response) { settled = true; resolve(response); } };
      const fromCache = () => caches.match(request).then(hit => hit || (request.mode === 'navigate' ? caches.match('/') : undefined));
      const timer = setTimeout(() => { fromCache().then(finish); }, NETWORK_WAIT_MS);
      fetch(request)
        .then(response => { clearTimeout(timer); finish(store(request, response)); })
        .catch(() => { clearTimeout(timer); fromCache().then(hit => { if (hit) finish(hit); else if (!settled) { settled = true; resolve(Response.error()); } }); });
    })
  );
});
