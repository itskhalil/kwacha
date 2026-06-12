// Kwacha offline cache — caches the app (and fonts) on first visit, serves from cache forever after.
const C = "kwacha-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(["./"])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r =>
      r || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(C).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match("./"))
    )
  );
});
