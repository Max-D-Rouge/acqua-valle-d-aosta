// Cache dell'app (non di mappe e tile: la policy OSM vieta il download massivo, vedi D26).
const V = "acquavda-v9";
const FILE = ["./", "index.html", "style.css", "app.js", "geo.js", "data.js", "labels.js", "manifest.webmanifest", "icon.svg", "vendor/maplibre-gl-csp.js", "vendor/maplibre-gl-csp-worker.js", "vendor/maplibre-gl.css"];
self.addEventListener("install", (e) => e.waitUntil(caches.open(V).then((c) => c.addAll(FILE))));
self.addEventListener("activate", (e) => e.waitUntil(
  caches.keys().then((k) => Promise.all(k.filter((x) => x !== V).map((x) => caches.delete(x))))));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(V).then((x) => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
