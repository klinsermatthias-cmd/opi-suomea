// Offline-Unterstützung: immer zuerst die neueste Version aus dem Netz, sonst die gespeicherte Kopie.
// Bei sehr langsamem Netz (> 6 s) wird die gespeicherte Kopie genommen, die neue Version landet trotzdem im Cache.
// Eigener Cache je App: Opi suomea und Deutsch-Trainer liegen auf demselben Origin (github.io) und teilen sich den
// Cache-Speicher. Name = Pfad der App; fremde Caches werden nie angefasst oder gelöscht.
const CACHE = "lern-" + new URL(self.registration.scope).pathname;
const FILES = [
  "./",
  "./index.html",
  "./farben.css",
  "./app.css",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./js/app.js",
  "./js/inhalte.js",
  "./js/sprache.js",
  "./js/daten.js",
  "./js/lernen.js",
  "./js/ki.js",
  "./js/einstufung.js",
  "./js/ansichten.js",
  "./js/woerterbuch.js",
  "./js/uebungen.js",
  "./js/vokabeln.js",
  "./js/formate.js",
  "./js/wortschatz.js",
  "./js/ueberblick.js",
  "./js/ki-ueben.js",
  "./js/verwaltung.js",
  "./js/start.js"
];
/* Neue Startseite geladen: alle Dateien dieser Version (?v=…) in den Cache holen – so ist offline immer ein
   vollständiger, zusammenpassender Satz da – und erst danach ältere Versionen derselben Dateien entfernen. */
async function syncVersion(c, html) {
  const urls = [...html.matchAll(/(?:src|href)="([^"]+\?v=[^"]+)"/g)].map(
    m => new URL(m[1], self.registration.scope).href
  );
  if (!urls.length) return;
  const want = new Set(urls),
    missing = [];
  for (const u of want) if (!(await c.match(u))) missing.push(u);
  if (missing.length) await c.addAll(missing);
  for (const k of await c.keys()) {
    const ku = new URL(k.url);
    if (ku.search.startsWith("?v=") && !want.has(k.url)) await c.delete(k);
  }
}
self.addEventListener("install", e => {
  /* Grunddateien und gleich auch die Fassungen mit Versionsnummer, die die aktuelle Startseite lädt (offline-fest) */
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      await c.addAll(FILES);
      try {
        await syncVersion(c, await (await fetch("./index.html", { cache: "no-store" })).text());
      } catch (x) {}
    })
  );
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  let saving = null;
  const net = fetch(r).then(res => {
    if (res.ok) {
      const copy = res.clone(),
        page = r.mode === "navigate" ? res.clone() : null;
      saving = caches.open(CACHE).then(async c => {
        await c.put(r, copy);
        if (page) await syncVersion(c, await page.text());
      });
    }
    return res;
  });
  e.waitUntil(net.then(() => saving).catch(() => {}));
  /* Ohne Netz und ohne Kopie: nur Seitenaufrufe bekommen die Startseite – eine fehlende Skriptdatei darf nie als
     HTML ausgeliefert werden (das gäbe einen Syntaxfehler statt eines klaren Ladefehlers). */
  const fallback = () =>
    caches
      .match(r)
      .then(m => m || (r.mode === "navigate" ? caches.match("./index.html") : Response.error()))
      .then(m => m || Response.error());
  e.respondWith(
    new Promise(resolve => {
      let done = false;
      const finish = p => {
        if (!done) {
          done = true;
          resolve(p);
        }
      };
      const t = setTimeout(
        () =>
          caches.match(r).then(m => {
            if (m) finish(m);
          }),
        6000
      );
      net.then(
        res => {
          clearTimeout(t);
          finish(res);
        },
        () => {
          clearTimeout(t);
          finish(fallback());
        }
      );
    })
  );
});
