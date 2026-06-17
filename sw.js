const C = "kwacha-v2";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(["./"])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== C).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => { const cl = res.clone(); caches.open(C).then(c => c.put(req, cl)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match("./")))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req)
        .then(res => { const cl = res.clone(); caches.open(C).then(c => c.put(req, cl)); return res; })
        .catch(() => cached);
      return cached || net;
    })
  );
});
