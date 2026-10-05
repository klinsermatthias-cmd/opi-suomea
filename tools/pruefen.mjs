// Prüft die App vor jedem Livegang: node tools/pruefen.mjs
// 1. JS-Syntax von index.html  2. lektionen.json gültig  3. nur hinten angehängt (Vergleich mit BASIS)
// 4. Headless-Browser (390 px): alle Themen mit den Musterlösungen lösen, Vokabeln, Hörtraining,
//    Fehler-Training, alle Ansichten  5. Cloud-Sync mit zwei Geräten gegen eine nachgebaute Supabase.
// BASIS = Git-Stand zum Vergleichen (Standard: origin/main bzw. env BASIS).
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const fehler = [], hinweise = [];
const ok = m => console.log("✓ " + m);
const fail = m => { fehler.push(m); console.log("✗ " + m); };
const warn = m => { hinweise.push(m); console.log("! " + m); };

/* ---------- 1. Syntax ---------- */
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const main = scripts.reduce((a, b) => (b.length > a.length ? b : a), "");
try { new vm.Script(main, { filename: "index.html" }); ok("JS-Syntax"); } catch (e) { fail("JS-Syntax: " + e.message); }

/* ---------- 2. Lektionen ---------- */
const baseTopics = src => { const m = src.match(/const BASE_TOPICS = (\[[\s\S]*?\n\]);/); return m ? vm.runInNewContext(m[1]) : []; };
let lessons = [];
try { lessons = JSON.parse(fs.readFileSync(path.join(ROOT, "lektionen/lektionen.json"), "utf8")); if (!Array.isArray(lessons)) throw new Error("kein Array"); ok(`lektionen.json gültig (${lessons.length} Themen)`); }
catch (e) { fail("lektionen.json: " + e.message); }
const all = [...baseTopics(main), ...lessons];
const ids = all.map(t => t && t.id);
ids.forEach((id, i) => { if (ids.indexOf(id) !== i) fail("Themen-ID doppelt: " + id); });
all.forEach(t => (t.req || []).forEach(r => { if (!ids.includes(r)) fail(`${t.id}: Voraussetzung ${r} gibt es nicht`); }));

/* ---------- 3. Nur hinten anhängen ---------- */
const git = c => execSync(c, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString();
let basis = process.env.BASIS;
if (!basis) try { git("git rev-parse --verify origin/main"); basis = "origin/main"; } catch (e) {}
if (basis && !/^0+$/.test(basis)) {
  try {
    const oldHtml = git(`git show ${basis}:index.html`);
    let oldLessons = []; try { oldLessons = JSON.parse(git(`git show ${basis}:lektionen/lektionen.json`)); } catch (e) {}
    const old = [...baseTopics(oldHtml), ...oldLessons];
    const exSig = e => e && e.t + "|" + (e.q || e.de || "");
    for (const o of old) {
      const n = all.find(t => t.id === o.id);
      if (!n) { fail(`${o.id} wurde gelöscht oder umbenannt`); continue; }
      if (n.v.length < o.v.length) fail(`${o.id}: Vokabeln entfernt (${o.v.length} → ${n.v.length})`);
      if (n.ex.length < o.ex.length) fail(`${o.id}: Übungen entfernt (${o.ex.length} → ${n.ex.length})`);
      o.v.forEach((w, i) => {
        if (!n.v[i] || n.v[i][0] === w[0]) return;
        const j = n.v.findIndex(x => x[0] === w[0]);
        if (j >= 0) fail(`${o.id}: Vokabel „${w[0]}“ verschoben (${i} → ${j})`); else warn(`${o.id}: Vokabel ${i} geändert „${w[0]}“ → „${n.v[i][0]}“`);
      });
      o.ex.forEach((e, i) => {
        if (!n.ex[i]) return;
        if (n.ex[i].t !== e.t) fail(`${o.id}: Übung ${i} hat jetzt einen anderen Typ (${e.t} → ${n.ex[i].t})`);
        else if (exSig(n.ex[i]) !== exSig(e)) {
          const j = n.ex.findIndex(x => exSig(x) === exSig(e));
          if (j >= 0) fail(`${o.id}: Übung ${i} verschoben (→ ${j})`); else warn(`${o.id}: Übung ${i} umformuliert`);
        }
      });
    }
    ok(`Nur-anhängen-Regel gegen ${basis} geprüft`);
  } catch (e) { warn("Vergleich mit " + basis + " nicht möglich: " + e.message); }
} else warn("Kein Vergleichsstand – Nur-anhängen-Regel übersprungen");

/* ---------- Server: App + nachgebaute Supabase ---------- */
const db = { progress: new Map() };
const pgTime = ms => new Date(ms).toISOString().replace("Z", "+00:00");
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
      if (req.method === "GET") return send(200, row ? [{ data: row.data, updated_at: pgTime(row.at) }] : []);
      if (req.method === "PATCH") {
        if (db.noCas) return send(400, { message: "Vergleich nicht unterstützt" });
        const f = (u.searchParams.get("updated_at") || "").replace("eq.", "");
        if (!row || row.at !== Date.parse(f)) return send(200, []);
        const b = JSON.parse(body); row.data = b.data; row.at = Date.parse(b.updated_at); return send(200, [{ user_id: user }]);
      }
      if (req.method === "POST") {
        const b = JSON.parse(body); if (db.progress.has(b.user_id) && !u.searchParams.get("on_conflict")) return send(409, {});
        db.progress.set(b.user_id, { data: b.data, at: Date.parse(b.updated_at) }); return send(201);
      }
      send(405, {});
    });
    return;
  }
  const f = path.join(ROOT, decodeURIComponent(u.pathname === "/" ? "/index.html" : u.pathname));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  const type = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".webmanifest": "application/manifest+json" }[path.extname(f)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type + "; charset=utf-8" }); fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, r));
const URL0 = `http://localhost:${server.address().port}/`;

/* ---------- Playwright laden (lokal, global oder CI) ---------- */
let pw;
try { pw = createRequire(path.join(ROOT, "x.js"))("playwright"); }
catch (e) { pw = createRequire(path.join(execSync("npm root -g").toString().trim(), "x.js"))("playwright"); }
const exe = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});

async function device(cfg, ctx, init) {
  if (!ctx) {
    ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(([c, raw]) => {
      window.OPI_SB_TIMEOUT = 1500;
      if (!localStorage.getItem("opi-suomea-config")) localStorage.setItem("opi-suomea-config", JSON.stringify(c));
      if (raw != null && !sessionStorage.getItem("x")) { sessionStorage.setItem("x", 1); localStorage.setItem("opi-suomea-v1", raw); }
    }, [cfg, init == null ? null : init]);
  }
  const page = await ctx.newPage();
  page.errs = [];
  page.on("pageerror", e => page.errs.push(e.message));
  page.on("dialog", d => d.dismiss());
  await page.goto(URL0);
  await page.waitForFunction(() => typeof S !== "undefined" && S && document.querySelector("#app").innerHTML.length > 0);
  await page.waitForTimeout(300);
  return page;
}

try {
  /* ---------- 4. App-Durchlauf ---------- */
  const page = await device({ setupDone: true });
  const r = await page.evaluate(async () => {
    const out = { err: [], info: [] }, E = m => out.err.push(m);
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const click = sel => { const b = document.querySelector(sel); if (!b) throw new Error("Knopf fehlt: " + sel); b.click(); };
    const wide = name => { if (document.documentElement.scrollWidth > 392) E(`${name}: zu breit für 390 px (${document.documentElement.scrollWidth} px)`); };
    await loadRepoLessons();
    // Lektionen aus der Datei müssen alle (streng) gültig sein
    const raw = await (await fetch("lektionen/lektionen.json", { cache: "no-store" })).json();
    raw.forEach(t => { const c = JSON.parse(JSON.stringify(t)); if (!validTopic(c)) E(`${t.id}: ungültig (Pflichtfelder oder fehlerhafte Übung/Vokabel)`); if (!T(t.id)) E(`${t.id}: nicht geladen`); });
    BASE_TOPICS.forEach(t => { if (!validTopic(JSON.parse(JSON.stringify(t)))) E(`${t.id}: ungültig`); });
    out.info.push(TOPICS.length + " Themen");
    // Theorie-HTML: Schadcode wird entfernt, erlaubte Formatierung bleibt
    const san = sanitizeHTML('<p class="rule">x <i>olla</i> <s>a</s></p><img src=x onerror=alert(1)><script>alert(1)</script><a href="javascript:alert(1)">l</a><iframe src="//x"></iframe>');
    if (/onerror|<script|javascript:|<iframe|<img|<a /i.test(san) || !san.includes('<p class="rule">') || !san.includes("<s>")) E("sanitizeHTML unsicher oder zu streng: " + san);
    // Ansichten
    for (const tab of ["today", "topics", "vocab", "progress"]) { A.tab(tab); await wait(30); if (!document.querySelector("#app").innerHTML.trim()) E("Leere Ansicht: " + tab); wide(tab); }
    // Jedes Thema mit den Musterlösungen lösen
    const solve = async (ex) => {
      if (ex.t === "mc") { const i = SESSION.cur.opts.findIndex(o => o.ok); click(`.opt[data-id="${i}"]`); return; }
      if (ex.t === "tab") { const g = tabGaps(ex); document.querySelectorAll(".tcell").forEach((inp, k) => (inp.value = g[k][0])); }
      else if (ex.t === "ord") {
        const chips = SESSION.cur.chips, used = new Set(); let rest = norm(ex.a);
        while (rest) { const i = chips.findIndex((c, j) => !used.has(j) && (rest === norm(c) || rest.startsWith(norm(c) + " "))); if (i < 0) { E(`Satz ordnen: „${ex.a}“ lässt sich aus ${JSON.stringify(ex.w)} nicht bilden`); return; } used.add(i); SESSION.cur.picked.push(i); rest = rest.slice(norm(chips[i]).length).trim(); }
        if (used.size !== chips.length) E(`Satz ordnen: „${ex.a}“ nutzt nicht alle Wörter ${JSON.stringify(ex.w)}`);
      }
      else document.querySelector("#ans").value = ex.a[0];
      await checkAnswer(); solved++;
    };
    let solved = 0;
    for (const t of TOPICS) {
      S.topics[t.id].status = "learning"; addCards(t);
      A.topic(t.id); await wait(5); if (!document.querySelector("#app").innerHTML.trim()) E(t.id + ": Themenseite leer"); wide(t.id);
      startSession(t.id, "learn");
      let first = true, n = 0;
      while (SESSION && SESSION.idx < SESSION.items.length && n++ < 200) {
        const ex = SESSION.items[SESSION.idx];
        if (first) { first = false; dunno(); } // erzeugt einen Fehler + Wiederholung
        else { await solve(ex); const fb = document.querySelector("#fb .fb"); if (!fb || !fb.classList.contains("ok")) E(`${t.id}: Musterlösung wird nicht akzeptiert: ${JSON.stringify(ex).slice(0, 160)}`); }
        wide(t.id + " Übung");
        nextEx();
      }
      if (!document.querySelector("#ratebox")) { E(t.id + ": keine Auswertung am Ende"); continue; }
      await rateTopic("good");
    }
    out.info.push(solved + " Übungen mit Musterlösung gelöst");
    // Fehler-Training
    if (!openErrors().length) E("Fehler-Training: keine offenen Fehler");
    startErrors(); let n = 0;
    while (SESSION && SESSION.idx < SESSION.items.length && n++ < 50) { await solve(SESSION.items[SESSION.idx]); nextEx(); }
    if (openErrors().length) E("Fehler-Training: Fehler nicht gelöst");
    // Vokabeln
    startVocab(); n = 0;
    while (SESSION && SESSION.kind === "vocab" && n++ < 2000) { const w = cardWord(SESSION.queue[0]); document.querySelector("#ans").value = SESSION.dir === "fi" ? w[1] : w[0]; flipCard(); rateCard("good"); }
    if (SESSION) E("Vokabeln: Runde endet nicht"); out.info.push(S.stats.reviews + " Vokabeln wiederholt");
    // Hörtraining
    startListen(); n = 0;
    while (SESSION && SESSION.kind === "listen" && SESSION.idx < SESSION.queue.length && n++ < 50) { document.querySelector("#ans").value = cardWord(SESSION.queue[SESSION.idx])[0]; checkListen(); A.lnext(); }
    if (SESSION) E("Hörtraining endet nicht");
    startListenS(); n = 0;
    while (SESSION && SESSION.kind === "listenS" && SESSION.idx < SESSION.queue.length && n++ < 50) { document.querySelector("#ans").value = SESSION.queue[SESSION.idx].de[0]; await checkListenS(false); A.lsnext(); }
    for (const tab of ["today", "topics", "vocab", "progress"]) { A.tab(tab); await wait(30); wide(tab + " (nach dem Lernen)"); }
    // Sicherung: exportieren und wieder laden
    const before = JSON.stringify(S.cards); S = JSON.parse(JSON.stringify(S)); migrate(); if (JSON.stringify(S.cards) !== before) E("Sicherung: Karten ändern sich beim Neuladen");
    return out;
  });
  r.info.forEach(i => ok(i));
  r.err.forEach(fail);
  page.errs.forEach(e => fail("JS-Fehler in der App: " + e));
  if (!r.err.length && !page.errs.length) ok("App-Durchlauf: alle Themen, Fehler-Training, Vokabeln, Hörtraining, Ansichten (390 px)");
  await page.context().close();

  /* ---------- 5. Cloud-Sync mit zwei Geräten ---------- */
  const cfg = { setupDone: true, sbUrl: URL0 + "sb", sbKey: "k", session: { access_token: "t", refresh_token: "r", expires_at: Date.now() + 36e5, user: { id: "u1" } } };
  const a = await device(cfg), b = await device(cfg);
  const mark = (p, id) => p.evaluate(async id => { S.cards[id] = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; save(); await pushCloud(); }, id);
  const cloudCards = () => Object.keys((db.progress.get("u1") || { data: { cards: {} } }).data.cards);
  await a.evaluate(() => pullCloud()); await b.evaluate(() => pullCloud());
  await mark(a, "syncA");
  await mark(b, "syncB"); // B kennt A's Stand noch nicht → muss zusammenführen statt überschreiben
  const c1 = cloudCards();
  if (c1.includes("syncA") && c1.includes("syncB")) ok("Sync: zwei Geräte – nichts überschrieben"); else fail("Sync: Änderung eines Geräts ging verloren " + JSON.stringify(c1));
  const bHas = await b.evaluate(() => !!S.cards.syncA);
  if (!bHas) fail("Sync: Gerät B hat den Stand von A nicht übernommen");
  await a.evaluate(() => pullCloud());
  if (!(await a.evaluate(() => !!S.cards.syncB))) fail("Sync: Gerät A hat den Stand von B nicht geholt");
  // Während einer Übung wird nicht zusammengeführt, danach schon
  await a.evaluate(() => { SESSION = { kind: "vocab", queue: [] }; });
  await mark(b, "syncB2"); await mark(a, "syncA2");
  if (cloudCards().includes("syncA2")) fail("Sync: Konflikt während einer Übung hätte warten müssen");
  await a.evaluate(async () => { SESSION = null; await pushCloud(); });
  const c2 = cloudCards();
  if (c2.includes("syncA2") && c2.includes("syncB2")) ok("Sync: Konflikt während einer Übung wird danach zusammengeführt"); else fail("Sync nach Übung: " + JSON.stringify(c2));
  // Ausweichweg: Cloud lehnt den Vergleich ab → trotzdem nichts überschreiben
  db.noCas = true;
  await mark(a, "syncA3"); await mark(b, "syncB3");
  const c3 = cloudCards();
  if (c3.includes("syncA3") && c3.includes("syncB3")) ok("Sync-Ausweichweg: nichts überschrieben"); else fail("Sync-Ausweichweg: " + JSON.stringify(c3));
  // Großer Stand (> 64 KB) beim Schließen der App
  db.noCas = false;
  await b.evaluate(() => pullCloud());
  await b.evaluate(async () => { S.gloss = S.gloss || {}; for (let i = 0; i < 3000; i++) S.gloss["w" + i] = { de: "x".repeat(20) }; S.cards.syncBig = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; S.updated = Date.now(); writeLocal(); DIRTY = true; await pushCloud(true); });
  if (cloudCards().includes("syncBig")) ok("Sync beim Schließen auch bei großem Stand"); else fail("Sync beim Schließen: großer Stand nicht hochgeladen");
  // Cloud hängt: App startet trotzdem sofort, Sync blockiert nicht dauerhaft
  db.hang = true;
  const t0 = Date.now(); const h = await device(cfg); const dt = Date.now() - t0;
  if (dt < 1400) ok(`Start bei hängender Cloud ohne Warten (${dt} ms)`); else fail(`Start wartet auf die Cloud (${dt} ms)`);
  await h.evaluate(async () => { S.cards.syncHang = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; save(); clearTimeout(PUSH_TIMER); await pushCloud(); });
  db.hang = false;
  await h.evaluate(async () => { DIRTY = true; await pushCloud(); });
  if (cloudCards().includes("syncHang")) ok("Sync erholt sich nach hängender Verbindung"); else fail("Sync bleibt nach hängender Verbindung blockiert");
  [...a.errs, ...b.errs, ...h.errs].forEach(e => fail("JS-Fehler beim Sync: " + e));

  // Zwei Tabs auf demselben Gerät (ohne Cloud): kein Tab überschreibt den anderen
  const t1 = await device({ setupDone: true }), t2 = await device(null, t1.context());
  await t1.evaluate(() => { S.cards.tabA = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; save(); });
  await t2.waitForTimeout(200);
  await t2.evaluate(() => { S.cards.tabB = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; save(); });
  await t1.waitForTimeout(200);
  await t2.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  const stored = await t1.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("opi-suomea-v1")).cards));
  const inT1 = await t1.evaluate(() => !!S.cards.tabB);
  if (stored.includes("tabA") && stored.includes("tabB") && inT1) ok("Zwei Tabs: Änderungen beider Tabs bleiben erhalten"); else fail("Zwei Tabs: Daten überschrieben " + JSON.stringify(stored));
  [...t1.errs, ...t2.errs].forEach(e => fail("JS-Fehler mit zwei Tabs: " + e));
  await t1.context().close();

  // Kaputter Speicherinhalt: App startet, alter Inhalt bleibt als Kopie erhalten
  const k = await device({ setupDone: true }, null, "{kaputt");
  const kept = await k.evaluate(() => Object.keys(localStorage).some(x => x.startsWith("opi-suomea-v1-defekt-")));
  const shown = await k.evaluate(() => document.querySelector("#app").innerText.length > 50);
  if (kept && shown) ok("Kaputte Daten: App startet, Originaldaten bleiben als Kopie"); else fail(`Kaputte Daten: Kopie ${kept}, Ansicht ${shown}`);
  k.errs.forEach(e => fail("JS-Fehler bei kaputten Daten: " + e));
  // Startfehler: Rettungsansicht statt weißer Seite, Daten unverändert
  const rz = await device({ setupDone: true }, null, '{"topics":{},"daily":null}');
  const rText = await rz.evaluate(() => document.querySelector("#app").innerText);
  const rKept = await rz.evaluate(() => localStorage.getItem("opi-suomea-v1"));
  if (/konnte nicht starten/.test(rText) && rKept === '{"topics":{},"daily":null}') ok("Startfehler: Rettungsansicht, Daten unangetastet"); else fail("Startfehler ohne Rettungsansicht: " + rText.slice(0, 80));
} catch (e) { fail("Test abgebrochen: " + (e.stack || e.message)); }
finally { await browser.close(); server.close(); }

console.log(`\n${fehler.length ? "FEHLER: " + fehler.length : "Alles in Ordnung"}${hinweise.length ? ` · ${hinweise.length} Hinweis(e)` : ""}`);
process.exit(fehler.length ? 1 : 0);
