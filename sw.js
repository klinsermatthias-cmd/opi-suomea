// Offline-Unterstützung: immer zuerst die neueste Version aus dem Netz, sonst die gespeicherte Kopie.
// Bei sehr langsamem Netz (> 6 s) wird die gespeicherte Kopie genommen, die neue Version landet trotzdem im Cache.
const CACHE = "opi-suomea";
const FILES = ["./", "./index.html", "./app.css", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png",
  "./js/inhalte.js", "./js/daten.js", "./js/lernen.js", "./js/ki.js", "./js/ansichten.js", "./js/uebungen.js", "./js/verwaltung.js", "./js/start.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  const net = fetch(r).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); } return res; });
  e.waitUntil(net.catch(() => {}));
  const fallback = () => caches.match(r).then(m => m || caches.match("./index.html"));
  e.respondWith(new Promise(resolve => {
    let done = false;
    const finish = p => { if (!done) { done = true; resolve(p); } };
    const t = setTimeout(() => caches.match(r).then(m => { if (m) finish(m); }), 6000);
    net.then(res => { clearTimeout(t); finish(res); }, () => { clearTimeout(t); finish(fallback()); });
  }));
});
