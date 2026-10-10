/* Prüfskript – hilfen.mjs (S-1008-102): Hilfen für alle Teile: Meldungen (ok/fail/warn), Wortprüfung im Browser (newWordsCheck), Server mit der App und
   nachgebauter Supabase, Service-Worker-Test, Playwright/Chromium und device() (ein Gerät = eine Browserseite in 390 px).
   Aufgerufen von tools/pruefen.mjs; gemeinsame Werte und Ergebnisse früherer Teile stehen im Objekt P. */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

export const P = {};
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const fehler = [], hinweise = [];
const ok = m => console.log("✓ " + m);
const fail = m => { fehler.push(m); console.log("✗ " + m); };
const warn = m => { hinweise.push(m); console.log("! " + m); };
/* S-1008-73: Wörter, die eine Übung in der Lernsprache verlangt, die aber bis zu diesem Thema in keiner Wortliste stehen.
   Läuft im Browser (page.evaluate) mit der Logik des Antipp-Wörterbuchs der App (buildDict/glossLocal: Wortlisten,
   GLOSS_EXTRA, Tabellenformen, SP.derive, SP.ends …), begrenzt auf die Themen bis zum aktuellen in App-Reihenfolge.
   Geprüft wird die erste Musterlösung von gap (das Wort mit der Lücke), sch, tr (dir "de"), ord sowie Lücken in tab und
   dlg. Wörter aus der Aufgabe selbst (sch: w, Hinweis h) gelten als gegeben, großgeschriebene Wörter mitten im Satz als
   Namen. ids = zu prüfende Themen (null = alle), extra = zusätzliches Thema am Ende (Selbsttest). Nur Warnung. */
function newWordsCheck({ ids, extra }) {
  const keepT = TOPICS, keepOwn = S.own, keepGl = S.gloss, out = [];
  const toks = s => [...String(s || "").matchAll(/\p{L}[\p{L}'’-]*/gu)].map(m => ({ w: m[0], i: m.index }));
  try {
    S.own = {}; S.gloss = {};
    const list = extra ? [...keepT, extra] : keepT;
    list.forEach((t, n) => {
      if (ids && !ids.includes(t.id)) return;
      TOPICS = list.slice(0, n + 1); DICT = null;
      const miss = new Map(),
        stems = [...new Set(TOPICS.flatMap(x => x.v.map(([fi]) => gkey(fi))).filter(x => x.length >= 5 && !x.includes(" ")).map(x => x.slice(0, -1)))];
      t.ex.forEach((ex, k) => {
        const given = [...(ex.w || []).flatMap(x => toks(x)), ...toks(ex.h)].map(x => gkey(x.w));
        const parts = []; // [Text, nur Wörter ab/bis Position]
        const a0 = Array.isArray(ex.a) ? ex.a[0] : ex.a;
        if (ex.t === "gap" && a0 != null) {
          const at = String(ex.q).indexOf("___"), txt = String(ex.q).replace("___", a0);
          parts.push([txt, at, at + String(a0).length]);
        } else if (ex.t === "sch" || (ex.t === "tr" && ex.dir === "de")) parts.push([a0]);
        else if (ex.t === "ord") parts.push([ordSols(ex)[0]]);
        else if (ex.t === "tab") tabGaps(ex).forEach(g => parts.push([g[0]]));
        else if (ex.t === "dlg") dlgGaps(ex).forEach(g => parts.push([g[0]]));
        parts.forEach(([txt, from, to]) =>
          toks(txt).forEach(({ w, i }) => {
            if (from != null && (i + w.length < from || i > to)) return;
            const before = String(txt).slice(0, i).trim();
            if (w.length < 2 || (w[0] !== w[0].toLowerCase() && before && !/[.!?:;„“"«»–-]$/.test(before))) return;
            const key = gkey(w);
            if (given.some(g => g === key || (g.length >= 4 && key.slice(0, 4) === g.slice(0, 4)))) return;
            if (glossLocal(w, txt)) return;
            /* Beugungsform eines Wortes aus der Wortliste (Stamm = Grundform ohne letzten Buchstaben, ab 4 Buchstaben) */
            if (stems.some(st => key.startsWith(st))) return;
            if (!miss.has(key)) miss.set(key, new Set());
            miss.get(key).add(k);
          })
        );
      });
      if (miss.size) out.push(`${t.id}: Wort ohne frühere Wortliste: ${[...miss].map(([w, ks]) => `${w} (Übung ${[...ks].join(", ")})`).join(", ")}`);
    });
  } finally { TOPICS = keepT; DICT = null; S.own = keepOwn; S.gloss = keepGl; }
  return out;
}

Object.assign(P, { ROOT, fehler, hinweise, ok, fail, warn, newWordsCheck });

/* Server, Service-Worker-Test und Browser starten – nach den statischen Prüfungen (gleiche Reihenfolge wie früher) */
export async function starten() {
/* ---------- Server: App + nachgebaute Supabase ---------- */
const db = { progress: new Map() };
/* Engine-Tests: feste Test-Inhalte statt der Inhalte dieser App */
P.MODE = "engine";
const FIXTURE = { "/js/app.js": "tools/test-app.js", "/js/inhalte.js": "tools/test-inhalte.js", "/lektionen/lektionen.json": "tools/test-lektionen.json" };
const pgTime = ms => new Date(ms).toISOString().replace("Z", "+00:00");
/* echte Supabase speichert Mikrosekunden (E-1010-3): db.micro = true hängt beim Schreiben 3 Stellen an */
const pgTimeUs = row => row.us ? pgTime(row.at).replace(/(\.\d{3})/, "$1" + String(row.us).padStart(3, "0")) : pgTime(row.at);
const usOf = t => { const m = String(t).match(/\.(\d+)/); return Date.parse(t) * 1000 + (m ? Number((m[1] + "000000").slice(3, 6)) : 0); };
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname.startsWith("/sb/")) {
    if (db.hang) return; // Cloud antwortet nie (sehr schlechtes Netz)
    let body = ""; req.on("data", c => (body += c)); req.on("end", () => {
      const send = (code, obj) => { res.writeHead(code, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }); res.end(obj === undefined ? "" : JSON.stringify(obj)); };
      if (u.pathname.startsWith("/sb/auth/")) return send(200, { access_token: "t", refresh_token: "r", expires_in: 3600, user: { id: "u1" } });
      if (u.pathname === "/sb/rest/v1/snapshots") return send(req.method === "DELETE" ? 204 : 201);
      if (u.pathname !== "/sb/rest/v1/progress") return send(404, {});
      const user = (u.searchParams.get("user_id") || "").replace("eq.", ""), row = db.progress.get(user);
      const rowUs = row ? row.at * 1000 + (row.us || 0) : 0;
      const pass = row && u.searchParams.getAll("updated_at").every(f => {
        const [op, ...v] = f.split("."), t = usOf(v.join("."));
        return op === "eq" ? rowUs === t : op === "gte" ? rowUs >= t : op === "lt" ? rowUs < t : false;
      });
      if (req.method === "GET") return send(200, pass ? [{ user_id: user, data: row.data, updated_at: pgTimeUs(row) }] : []);
      if (req.method === "PATCH") {
        if (db.noCas) return send(400, { message: "Vergleich nicht unterstützt" });
        /* db.casSilent: Änderung kommt nie an, ohne Fehler (E-1010-4, wie am PC des Deutsch-Trainers) */
        if (!pass || db.casSilent) return send(200, []);
        const b = JSON.parse(body); row.data = b.data; row.at = Date.parse(b.updated_at); row.us = db.micro ? 123 : 0; return send(200, [{ user_id: user }]);
      }
      if (req.method === "POST") {
        const b = JSON.parse(body); if (db.progress.has(b.user_id) && !u.searchParams.get("on_conflict")) return send(409, {});
        db.progress.set(b.user_id, { data: b.data, at: Date.parse(b.updated_at), us: db.micro ? 456 : 0 }); return send(201);
      }
      send(405, {});
    });
    return;
  }
  const p0 = u.pathname === "/" ? "/index.html" : u.pathname;
  const fx = P.MODE === "de" && p0 === "/js/app.js" ? "tools/test-app-de.js" : P.MODE !== "app" && FIXTURE[p0];
  const f = path.join(ROOT, decodeURIComponent(fx ? "/" + fx : p0));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  const type = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".webmanifest": "application/manifest+json" }[path.extname(f)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type + "; charset=utf-8" }); fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, r));
const URL0 = `http://localhost:${server.address().port}/`;

/* ---------- Playwright laden (lokal, global oder CI) ---------- */
let pw;
/* Service Worker: zur Startseite passende Dateien (?v=…) werden geholt, ältere Versionen entfernt, Grunddateien bleiben */
await (async () => {
  const ctx = { self: { registration: { scope: "https://x.test/app/" }, addEventListener() {}, skipWaiting() {}, clients: { claim() {} } }, caches: {}, location: { origin: "https://x.test" }, URL, Response: { error: () => null }, fetch: async () => ({}) };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "sw.js"), "utf8") + "\n;self.__sync = syncVersion;", ctx);
  const store = new Map([["https://x.test/app/js/a.js", 1], ["https://x.test/app/js/a.js?v=alt", 1], ["https://x.test/app/js/b.js?v=neu", 1]]);
  const c = { match: async u => store.has(u), addAll: async us => us.forEach(u => store.set(u, 1)), keys: async () => [...store.keys()].map(url => ({ url })), delete: async k => store.delete(k.url) };
  await ctx.self.__sync(c, '<script src="js/a.js?v=neu"></script><script src="js/b.js?v=neu"></script><link rel="stylesheet" href="app.css?v=neu">');
  const keys = [...store.keys()].sort().join(" ");
  if (keys !== "https://x.test/app/app.css?v=neu https://x.test/app/js/a.js https://x.test/app/js/a.js?v=neu https://x.test/app/js/b.js?v=neu") fail("Service Worker: Versionen im Cache falsch: " + keys);
  else ok("Service Worker: Dateien der aktuellen Version geholt, ältere entfernt");
})();
try { pw = createRequire(path.join(ROOT, "x.js"))("playwright"); }
catch (e) { pw = createRequire(path.join(execSync("npm root -g").toString().trim(), "x.js"))("playwright"); }
const exe = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});

/* Musterlösung einer Übung eintragen (gemeinsam für Engine-Test und Inhalts-Test). Rückgabe true = schon ausgewertet (mc) */
const FILL_MODEL = () => {
  window.fillModel = (ex, E) => {
    if (ex.t === "mc") { document.querySelector(`.opt[data-id="${SESSION.cur.opts.findIndex(o => o.ok)}"]`).click(); return true; }
    if (ex.t === "tab") { const g = tabGaps(ex); document.querySelectorAll(".tcell").forEach((inp, k) => (inp.value = g[k][0])); }
    else if (ex.t === "ord") {
      const chips = SESSION.cur.chips, used = new Set(); let rest = norm(ordSols(ex)[0]);
      while (rest) { const i = chips.findIndex((c, j) => !used.has(j) && (rest === norm(c) || rest.startsWith(norm(c) + " "))); if (i < 0) { E(`Satz ordnen: „${ex.a}“ lässt sich aus ${JSON.stringify(ex.w)} nicht bilden`); return true; } used.add(i); SESSION.cur.picked.push(i); rest = rest.slice(norm(chips[i]).length).trim(); }
      if (used.size !== chips.length) E(`Satz ordnen: „${ex.a}“ nutzt nicht alle Wörter ${JSON.stringify(ex.w)}`);
    }
    else if (ex.t === "les") SESSION.cur.qs.forEach((q, qi) => document.querySelector(`[data-act="lpick"][data-id="${qi}:${q.findIndex(o => o.ok)}"]`).click());
    else if (ex.t === "dlg") { const g = dlgGaps(ex); document.querySelectorAll(".dcell").forEach((inp, k) => (inp.value = g[k][0])); }
    else document.querySelector("#ans").value = ex.a[0];
    return false;
  };
};
async function device(cfg, ctx, init, id = "opi-suomea") {
  if (!ctx) {
    ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(([c, raw, id]) => {
      window.OPI_SB_TIMEOUT = 1500;
      if (!localStorage.getItem(id + "-config")) localStorage.setItem(id + "-config", JSON.stringify(c));
      if (raw != null && !sessionStorage.getItem("x")) { sessionStorage.setItem("x", 1); localStorage.setItem(id + "-v1", raw); }
    }, [cfg, init == null ? null : init, id]);
  }
  const page = await ctx.newPage();
  /* Gleiche Schrift wie auf GitHub (Ubuntu-Runner: DejaVu Sans), damit die Breitenprüfung (390 px) lokal genauso misst
     wie dort – sonst fiel eine zu breite Tabelle erst nach dem Push auf (t13b, E-1008-21) */
  await page.addInitScript(() => document.addEventListener("DOMContentLoaded", () => {
    const st = document.createElement("style");
    st.textContent = 'html,body,button,input,textarea,select{font-family:"DejaVu Sans",sans-serif!important}';
    document.head.appendChild(st);
  }));
  page.errs = [];
  page.on("pageerror", e => page.errs.push(e.message));
  page.on("dialog", d => d.dismiss());
  await page.goto(URL0);
  await page.waitForFunction(() => typeof S !== "undefined" && S && document.querySelector("#app").innerHTML.length > 0);
  await page.waitForTimeout(300);
  await page.evaluate(FILL_MODEL);
  return page;
}
  Object.assign(P, { db, FIXTURE, pgTime, server, URL0, pw, exe, browser, FILL_MODEL, device });
}
