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
/* App-Dateien in Ladereihenfolge (aus index.html) */
const jsFiles = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
{ let bad = 0;
  if (!jsFiles.length) { fail("index.html lädt keine Skripte"); bad++; }
  for (const f of jsFiles) { try { new vm.Script(fs.readFileSync(path.join(ROOT, f), "utf8"), { filename: f }); } catch (e) { fail(`JS-Syntax ${f}: ${e.message}`); bad++; } }
  if (!bad) ok(`JS-Syntax (${jsFiles.length} Dateien)`); }
const inhalteSrc = fs.readFileSync(path.join(ROOT, "js/inhalte.js"), "utf8");

/* Hover-Effekte nur für Maus/Touchpad (am Handy bleibt sonst die zuletzt getippte Stelle eingefärbt) */
{ const css = fs.readFileSync(path.join(ROOT, "app.css"), "utf8").replace(/@media \(hover:hover\)\{[^{}]*\{[^}]*\}\}/g, "");
  if (/:hover/.test(css)) fail("CSS: :hover außerhalb von @media (hover:hover)"); else ok("Hover-Effekte nur mit Maus"); }

/* ---------- 2. Lektionen ---------- */
/* BASE_TOPICS aus js/inhalte.js (neu) oder aus einer alten Einzeldatei-index.html */
const baseTopics = src => { if (/<script/.test(src)) { const m = src.match(/const BASE_TOPICS = (\[[\s\S]*?\n\]);/); return m ? vm.runInNewContext(m[1]) : []; }
  return vm.runInNewContext(src + "\n;BASE_TOPICS"); };
let lessons = [];
try { lessons = JSON.parse(fs.readFileSync(path.join(ROOT, "lektionen/lektionen.json"), "utf8")); if (!Array.isArray(lessons)) throw new Error("kein Array"); ok(`lektionen.json gültig (${lessons.length} Themen)`); }
catch (e) { fail("lektionen.json: " + e.message); }
const all = [...baseTopics(inhalteSrc), ...lessons];
const ids = all.map(t => t && t.id);
ids.forEach((id, i) => { if (ids.indexOf(id) !== i) fail("Themen-ID doppelt: " + id); });
all.forEach(t => (t.req || []).forEach(r => { if (!ids.includes(r)) fail(`${t.id}: Voraussetzung ${r} gibt es nicht`); }));

/* Hinweistexte, wo die Aufgabe sonst missverständlich wäre (Regel für alle Themen) */
{ const miss = [];
  all.forEach(t => (t.ex || []).forEach((e, i) => {
    const gapCols = e.t === "tab" ? Math.max(0, ...((e.r || []).map(r => r.filter(c => /^\[.*\]$/.test(String(c).trim())).length))) : 0;
    if (e.h) return;
    if (e.t === "gap" && /[\wäöåÄÖÅ]___|___[\wäöåÄÖÅ]/.test(e.q)) miss.push(`${t.id}/${i}: Lücke mitten im Wort (nur Endung?)`);
    if (e.t === "tab" && gapCols >= 2) miss.push(`${t.id}/${i}: Tabelle mit ${gapCols} Lückenspalten`);
    if (e.t === "tr" && e.dir === "de" && /^\d+$/.test(String(e.q).trim())) miss.push(`${t.id}/${i}: Zahl als Wort?`);
  }));
  if (miss.length) miss.forEach(m => fail("Hinweistext fehlt – " + m)); else ok("Hinweistexte bei missverständlichen Aufgaben vorhanden"); }

/* ---------- 3. Nur hinten anhängen ---------- */
const git = c => execSync(c, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString();
let basis = process.env.BASIS;
if (!basis) try { git("git rev-parse --verify origin/main"); basis = "origin/main"; } catch (e) {}
if (basis && !/^0+$/.test(basis)) {
  try {
    let oldHtml; try { oldHtml = git(`git show ${basis}:js/inhalte.js`); } catch (e) { oldHtml = git(`git show ${basis}:index.html`); }
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
  const type = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".webmanifest": "application/manifest+json" }[path.extname(f)] || "application/octet-stream";
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
    // Neues Thema: zuerst die Wörter (beide Richtungen), dann die Übungen
    { const t = T("t01"), N = t.v.length, d0 = JSON.stringify(S.daily);
      if (S.topics.t01.status !== "new") E("Testannahme: t01 ist neu");
      A.topic("t01");
      if (!document.querySelector('[data-act="tvocab"]') || document.querySelector('[data-act="learn"]')) E("Neues Thema: Schritt „Wörter lernen“ fehlt oder Übungen schon frei");
      A.tvocab("t01");
      if (!SESSION || SESSION.queue.length !== 2 * N) E(`Wörter lernen: ${SESSION && SESSION.queue.length} statt ${2 * N} Karten`);
      const firstRev = SESSION.queue.findIndex(id => id.endsWith("-r"));
      if (firstRev !== N || SESSION.queue.slice(N).some(id => !id.endsWith("-r"))) E("Wörter lernen: Richtungen nicht getrennt (erst fi→de, dann de→fi)");
      // zwei Karten bewerten, dann abbrechen → beim Weiterlernen nur der Rest
      flipCard(); rateCard("good"); flipCard(); rateCard("good"); SESSION = null;
      A.tvocab("t01");
      if (SESSION.queue.length !== 2 * N - 2) E("Wörter lernen: Weiterlernen beginnt nicht beim Rest");
      let n = 0, again = false;
      while (SESSION && SESSION.topicVocab && n++ < 200) { flipCard(); if (!again) { again = true; rateCard("again"); } else rateCard("good"); }
      if (!S.topics.t01.vocabDone) E("Wörter lernen: Thema nicht als „Wörter sitzen“ markiert");
      if (!document.querySelector('[data-act="learn"][data-id="t01"]')) E("Wörter lernen: „Weiter zu den Übungen“ fehlt");
      if (JSON.stringify(S.daily) !== d0) E("Wörter des Themas zählen gegen das Tageslimit");
      if (!topicVocabIds("t01").every(id => S.cards[id] && S.cards[id].tv && !S.cards[id].isNew)) E("Wörter lernen: nicht alle Karten gelernt");
      A.topic("t01"); if (!document.querySelector('[data-act="learn"]')) E("Nach den Wörtern: Übungen nicht frei");
      // Überspringen für Vorlerner
      const s2 = S.topics.t02.status; S.topics.t02.status = "new"; A.topic("t02"); document.querySelector('[data-act="tvskip"]').click();
      if (!document.querySelector('[data-act="learn"][data-id="t02"]')) E("„Wörter kenne ich schon“ schaltet die Übungen nicht frei");
      S.topics.t02.status = s2;
      // Sync behält „Wörter sitzen“
      const other = JSON.parse(JSON.stringify(S)); other.topics.t01.vocabDone = null;
      if (!mergeStates(S, other).topics.t01.vocabDone) E("Sync verliert „Wörter sitzen“");
      out.info.push(`Neues Thema: erst ${2 * N} Wortkarten, dann Übungen`); }
    // Gesperrte Themen: Voraussetzungen in Liste und auf der Themenseite sichtbar
    { const lockedT = TOPICS.find(t => S.topics[t.id].status === "locked" && t.req.length);
      if (lockedT) {
        A.tab("topics"); await wait(10);
        const line = [...document.querySelectorAll(".titem")].find(b => b.dataset.id === lockedT.id);
        if (!line || !line.querySelector(".req") || !lockedT.req.every(r => line.textContent.includes(T(r).title))) E("Themenliste: Voraussetzungen fehlen bei " + lockedT.id);
        line.click(); await wait(10);
        if (document.querySelectorAll(".reqrow").length !== lockedT.req.length) E("Gesperrte Themenseite: Voraussetzungen fehlen bei " + lockedT.id);
        wide("gesperrtes Thema");
      } }
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
      if (t.req.length && !document.querySelector("#app").textContent.includes("Baut auf:")) E(t.id + ": „Baut auf“ fehlt");
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
    // Freischaltversuch: Thema unter 80 % blockiert ein anderes → alle Übungen, danach frei
    { const t = TOPICS.find(x => TOPICS.some(y => y.req.includes(x.id)));
      const dep = TOPICS.filter(y => y.req.includes(t.id));
      S.topics[t.id].last = 0.5; dep.forEach(y => (S.topics[y.id].status = "locked")); save();
      A.topic(dep[0].id); await wait(5);
      if (!document.querySelector(`.reqrow [data-act="unlock"][data-id="${t.id}"]`)) E("Gesperrtes Thema: Knopf „Freischaltversuch“ fehlt");
      A.topic(t.id); await wait(5);
      if (!document.querySelector('[data-act="unlock"]')) E("Themenseite: Knopf „Freischaltversuch starten“ fehlt");
      A.unlock(t.id);
      if (SESSION.items.length !== t.ex.length) E(`Freischaltversuch: ${SESSION.items.length} statt ${t.ex.length} Übungen`);
      let n = 0; while (SESSION && SESSION.idx < SESSION.items.length && n++ < 200) { await solve(SESSION.items[SESSION.idx]); nextEx(); }
      await rateTopic("good");
      if (S.topics[t.id].last !== 1) E("Freischaltversuch: Ergebnis nicht übernommen");
      if (!dep.every(y => S.topics[y.id].status !== "locked")) E("Freischaltversuch: abhängiges Thema bleibt gesperrt");
      else out.info.push("Freischaltversuch schaltet " + dep.map(y => y.id).join(", ") + " frei"); }
    // Zusätzliche Vokabeln: Einstellung gilt für neue UND gelernte Wörter
    { const keep = JSON.stringify(S.cards); S.settings.extraCards = 20;
      Object.values(S.cards).forEach(c => (c.isNew = true)); startExtraVocab();
      const nNew = SESSION && SESSION.extra === "new" ? SESSION.queue.length : -1;
      Object.values(S.cards).forEach(c => (c.isNew = false)); startExtraVocab();
      const nOld = SESSION && SESSION.extra === "practice" ? SESSION.queue.length : -1;
      const total = Object.keys(S.cards).length;
      if (nNew !== Math.min(20, total) || nOld !== Math.min(20, total)) E(`Zusätzliche Vokabeln: neu ${nNew}, gelernt ${nOld}, erwartet je ${Math.min(20, total)}`);
      A.tab("today"); await wait(5);
      if (!document.querySelector("#app").textContent.includes(Math.min(20, total) + " gelernte Wörter extra üben")) E("Heute: Text zu zusätzlichen Vokabeln stimmt nicht");
      // Extra-Üben wirkt auf den Plan: Nochmal = morgen, Schwer = halbe Restzeit, Gut = nur kurz vor Fälligkeit
      { const ids = Object.keys(S.cards).slice(0, 4), far = addDays(10), near = addDays(1);
        ids.forEach((id, i) => Object.assign(S.cards[id], { isNew: false, reps: 3, interval: 10, ease: 2.5, lapses: 0, due: i === 3 ? near : far }));
        SESSION = { kind: "vocab", queue: ids.slice(), done: 0, again: 0, shown: true, extra: "practice" };
        const rate = k => { SESSION.shown = true; rateCard(k); if (SESSION) SESSION.shown = true; };
        rate("again"); rate("hard"); rate("good"); rate("good"); // Karten 0–3
        const [c0, c1, c2, c3] = ids.map(id => S.cards[id]);
        if (!(c0.due === addDays(1) && c0.lapses === 1)) E("Extra-Üben „Nochmal“ wirkt nicht wie ein Fehler");
        if (!(c1.due === addDays(5) && c1.ease < 2.5)) E("Extra-Üben „Schwer“ zieht den Termin nicht vor: " + new Date(c1.due));
        if (c2.due !== far) E("Extra-Üben „Gut“ verschiebt einen weit entfernten Termin");
        if (!(c3.due > near && c3.reps === 4)) E("Extra-Üben „Gut“ kurz vor Fälligkeit zählt nicht als Wiederholung");
        SESSION.shown = true; rateCard("good"); // Karte 0 kommt als Wiederholung in der Runde – darf nicht nochmal zählen
        if (S.cards[ids[0]].due !== addDays(1) || S.cards[ids[0]].reps !== 0) E("Extra-Üben: Wiederholung in der Runde zählt doppelt");
        // Anrechnung nach echter Pause: zuletzt vor 3 Tagen, fällig in 5 Tagen, Ease 2,5
        const setc = (id, last) => Object.assign(S.cards[id], { isNew: false, reps: 3, interval: 8, ease: 2.5, lapses: 0, due: addDays(5), last, xp: 0 });
        const three = startOfDay() - 3 * DAY + 3600e3;
        setc(ids[0], three); setc(ids[1], three); setc(ids[2], Date.now());
        SESSION = { kind: "vocab", queue: ids.slice(0, 3), done: 0, again: 0, shown: true, extra: "practice" };
        rate("good"); rate("easy"); rate("easy");
        if (S.cards[ids[0]].due !== addDays(8)) E("Extra-Üben „Gut“ nach 3 Tagen Pause: erwartet in 8 Tagen, ist " + Math.round((S.cards[ids[0]].due - startOfDay()) / DAY));
        if (S.cards[ids[1]].due !== addDays(10)) E("Extra-Üben „Einfach“ nach 3 Tagen Pause: erwartet in 10 Tagen, ist " + Math.round((S.cards[ids[1]].due - startOfDay()) / DAY));
        if (S.cards[ids[2]].due !== addDays(5)) E("Extra-Üben „Einfach“ am selben Tag darf nicht verlängern");
        // Keine Dauerschleife: heute schon extra Geübtes kommt erst, wenn alle anderen dran waren
        { const keepN = S.settings.extraCards, keepC = JSON.stringify(S.cards); S.settings.extraCards = 2;
          const keys = Object.keys(S.cards); keys.forEach((id, i) => { S.cards[id].isNew = i >= 8; S.cards[id].xp = 0; S.cards[id].last = Date.now() - 2 * DAY; });
          keys.slice(0, 4).forEach(id => (S.cards[id].xp = Date.now())); // 2 Wörter heute schon geübt, 2 noch nicht
          for (let i = 0; i < 4; i++) S.cards[keys[i]].isNew = false;
          const wantWords = new Set(keys.slice(4, 8).map(id => cardParse(id).base));
          S.cards = Object.fromEntries(keys.slice(0, 8).map(id => [id, S.cards[id]]));
          startExtraVocab();
          if (SESSION.extra !== "practice" || SESSION.queue.length !== 2) E("Dauerschleifen-Test: falscher Modus " + SESSION.extra + " " + SESSION.queue.length);
          else if (!SESSION.queue.every(id => wantWords.has(cardParse(id).base))) E("Heute schon extra geübte Wörter kommen vor den anderen");
          else if (SESSION.queue.some(id => (S.cards[id].xp || 0) >= startOfDay())) E("Heute schon extra geübte Wörter kommen sofort wieder");
          // Dauerschleife sichtbar: Schild auf der Karte + Hinweis, wenn alles heute schon geübt ist
          SESSION = null; Object.values(S.cards).forEach(c => { c.xp = Date.now(); c.xpd = todayKey(); c.xpn = 2; });
          if (!/heute schon extra geübt – jetzt kommen Wiederholungen/.test(extraVocabText())) E("Hinweis „alles heute schon geübt“ fehlt");
          startExtraVocab(); if (!/heute schon 2× geübt/.test(document.querySelector("#app").textContent)) E("Schild „heute schon 2× geübt“ fehlt");
          SESSION = null; S.settings.extraCards = keepN; S.cards = JSON.parse(keepC); } }
      SESSION = null; S.cards = JSON.parse(keep); S.settings.extraCards = 10; }
    // Vokabeln „↶ Zurück“: jede Bewertung exakt rückgängig, neue Wahl zählt; auch nach dem Rundenende
    { const ids = Object.keys(S.cards).slice(0, 3);
      ids.forEach(id => Object.assign(S.cards[id], { isNew: false, reps: 2, interval: 4, ease: 2.5, lapses: 0, due: Date.now() - 1000 }));
      const snap = () => JSON.stringify({ c: ids.map(id => S.cards[id]), n: S.daily.newCards, r: S.stats.reviews });
      for (const k of ["again", "hard", "good", "easy"]) {
        SESSION = { kind: "vocab", queue: ids.slice(), done: 0, again: 0, shown: false }; renderCard(); flipCard();
        const before = snap(); rateCard(k);
        if (!document.querySelector('[data-act="cundo"]')) E("Vokabeln: Knopf „↶ Zurück“ fehlt nach Bewertung " + k);
        A.cundo();
        if (snap() !== before || SESSION.queue.join() !== ids.join() || !SESSION.shown || SESSION.hist.length) E("Vokabeln: „Zurück“ stellt den Stand nach „" + k + "“ nicht exakt her");
        rateCard("good");
        if (S.cards[ids[0]].reps !== 3) E("Vokabeln: neue Wahl nach „Zurück“ zählt nicht"); 
        ids.forEach(id => Object.assign(S.cards[id], { isNew: false, reps: 2, interval: 4, ease: 2.5, lapses: 0, due: Date.now() - 1000 }));
      }
      SESSION = { kind: "vocab", queue: ids.slice(0, 1), done: 0, again: 0, shown: false }; renderCard(); flipCard();
      const b2 = snap(); rateCard("easy");
      if (SESSION || !document.querySelector('[data-act="cundo"]')) E("Vokabeln: „Letzte Bewertung ändern“ fehlt am Rundenende");
      else { A.cundo(); if (!SESSION || snap() !== b2) E("Vokabeln: „Zurück“ nach Rundenende stellt nicht her"); }
      SESSION = null; }
    // Rundenende: „Weitere Vokabeln lernen“ startet direkt die nächste Runde mit der eingestellten Anzahl
    { S.settings.extraCards = 15; startExtraVocab(); SESSION.queue = SESSION.queue.slice(0, 1); flipCard(); rateCard("good");
      const btn = document.querySelector('[data-act="extravocab"]');
      if (!btn || !/Weitere Vokabeln lernen/.test(btn.textContent)) E("Rundenende: „Weitere Vokabeln lernen“ fehlt");
      else { btn.click(); const want = Math.min(15, extraNewCards().length || learnedCardIds().length);
        if (!SESSION || SESSION.kind !== "vocab" || SESSION.queue.length !== want) E(`„Weitere Vokabeln lernen“: ${SESSION && SESSION.queue.length} statt ${want} Wörter`); }
      SESSION = null; S.settings.extraCards = 10; }
    // Vokabeln in zwei getrennten Richtungen
    { const keep = JSON.stringify(S.cards), kd = JSON.stringify(S.daily);
      // Umstieg: alter Stand (nur eine Karte je Wort) → Gegenrichtung übernimmt den Stand
      S.cards = { "t01-0": { ease: 2.3, interval: 7, reps: 3, lapses: 1, due: addDays(7), isNew: false, last: Date.now() - 5 * DAY } };
      migrate();
      const r0 = S.cards["t01-0-r"];
      if (!r0 || r0.isNew || r0.interval !== 7 || r0.ease !== 2.3 || r0.due !== addDays(7)) E("Umstieg: Gegenrichtung übernimmt den Stand nicht: " + JSON.stringify(r0));
      if (cardDir("t01-0") !== "fi" || cardDir("t01-0-r") !== "de" || cardWord("t01-0-r")[0] !== cardWord("t01-0")[0]) E("Richtung/Wort der Karten falsch");
      // Deutsch → Finnisch falsch: nur diese Karte fällt zurück, Wiederholung bleibt in dieser Richtung
      const fBefore = JSON.stringify(S.cards["t01-0"]);
      S.cards["t01-0-r"].due = Date.now() - 1000;
      SESSION = { kind: "vocab", queue: ["t01-0-r"], done: 0, again: 0, shown: false }; renderCard();
      if (SESSION.dir !== "de") E("Karte de→fi wird nicht auf Deutsch gefragt");
      flipCard(); rateCard("again");
      if (JSON.stringify(S.cards["t01-0"]) !== fBefore) E("Fehler in de→fi verändert die Karte fi→de");
      if (S.cards["t01-0-r"].lapses !== 2 || SESSION.queue[0] !== "t01-0-r" || SESSION.dir !== "de") E("Wiederholung nach „Nochmal“ nicht in derselben Richtung");
      SESSION = null;
      // Geschwister: am selben Tag nur eine Richtung je Wort
      S.cards["t01-0"].due = Date.now() - 1000; S.cards["t01-0-r"].due = Date.now() - 1000; S.cards["t01-0-r"].last = Date.now() - 3 * DAY; S.cards["t01-0"].last = Date.now() - 3 * DAY;
      if (onePerWord(dueCards()).length !== 1) E("Beide Richtungen eines Wortes in derselben Runde");
      S.cards["t01-0"].last = Date.now();
      if (dueCards().includes("t01-0-r")) E("Gegenrichtung am selben Tag nicht zurückgestellt");
      // Neue Gegenrichtung erst am Tag nach der ersten Richtung
      S.cards = {}; S.daily = { date: todayKey(), newCards: 0, newTopics: 0 }; addCards(T("t01"));
      if (newCardsAvail().some(id => id.endsWith("-r"))) E("Neue Gegenrichtung schon vor der ersten Richtung");
      S.cards["t01-0"].isNew = false; S.cards["t01-0"].last = Date.now();
      if (newCardsAvail().includes("t01-0-r")) E("Neue Gegenrichtung am selben Tag");
      S.cards["t01-0"].last = Date.now() - DAY;
      if (!newCardsAvail().includes("t01-0-r")) E("Neue Gegenrichtung am Folgetag fehlt");
      if (learnedWords() !== 1) E("„Wörter gelernt“ zählt Karten statt Wörter");
      S.cards = JSON.parse(keep); S.daily = JSON.parse(kd); }
    // Vokabelhilfe bei Übersetzungen ins Finnische: Grundformen, Vermerk, Karte de→fi kommt früher
    { const t = TOPICS.find(x => x.ex.some(e => e.t === "tr" && e.dir === "de" && vocabHint(e, x.id).length)), ei = t.ex.findIndex(e => e.t === "tr" && e.dir === "de" && vocabHint(e, t.id).length);
      const ex = t.ex[ei], L = vocabHint(ex, t.id);
      const rid = L[0].id + "-r"; addCards(T(L[0].id.replace(/-\d+$/, "")));
      Object.assign(S.cards[rid], { isNew: false, interval: 10, ease: 2.5, due: addDays(10), hintd: null });
      S.active = { id: t.id, mode: "learn", idxs: [ei], rt: [0], idx: 0, results: [], d: Date.now() }; openSession();
      const link = document.querySelector('[data-act="vhint"]');
      if (!link) E("Vokabelhilfe-Link fehlt bei „" + ex.q + "“");
      else { link.click();
        const box = document.querySelector("#vhint").textContent;
        if (!L.every(e => box.includes(e.fi))) E("Vokabelhilfe zeigt nicht alle Grundformen: " + box);
        if (S.cards[rid].due !== addDays(5) || !(S.cards[rid].ease < 2.5)) E("Vokabelhilfe: Karte de→fi kommt nicht früher");
        if (!(S.vhelp[0] && S.vhelp[0].words.length === L.length)) E("Vokabelhilfe nicht im Bericht vermerkt");
        await solve(ex); nextEx();
        if (!/Mit Vokabelhilfe gelöst/.test(document.querySelector("#app").textContent)) E("Auswertung: Vermerk „mit Vokabelhilfe“ fehlt");
        if (!/VOKABELHILFE genutzt/.test(buildReport())) E("Bericht: Vokabelhilfe fehlt");
        out.info.push("Vokabelhilfe: " + L.map(e => e.fi).join(", ")); }
      SESSION = null; S.active = null;
      // verrät nie die Lösung unverändert
      TOPICS.forEach(x => x.ex.filter(e => e.t === "tr" && e.dir === "de").forEach(e => { const g = new Set(vocabHint(e, x.id).flatMap(v => norm(v.fi).split(" "))); if (g.size && norm(e.a[0]).split(" ").every(w => g.has(w))) E("Vokabelhilfe verrät die Lösung: " + e.q); })); }
    // Fehler in einer Ansicht: Hinweis mit Rückweg statt kaputter Seite; App bleibt bedienbar
    { const orig = renderTopics; renderTopics = () => { throw new Error("Testfehler"); };
      A.tab("topics"); const t1 = document.querySelector("#app").textContent;
      renderTopics = orig;
      if (!/Fehler in dieser Ansicht/.test(t1) || !/Testfehler/.test(t1)) E("Ansichtsfehler: kein Hinweis");
      document.querySelector('#app [data-act="tab"][data-id="today"]').click();
      if (!/Hyvää|Matthias/.test(document.querySelector("#app").textContent)) E("Ansichtsfehler: Rückweg zu Heute klappt nicht");
      A.__boom = () => { throw new Error("Klickfehler"); }; const bt = document.createElement("button"); bt.dataset.act = "__boom"; document.querySelector("#app").appendChild(bt); bt.click(); delete A.__boom;
      if (!/Klickfehler/.test(document.querySelector("#app").textContent)) E("Fehler beim Antippen: kein Hinweis"); A.tab("today"); }
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
    A.tab("vocab"); { const tx = document.querySelector("#app").textContent; if (/\blernt ·|fi→de lernt|de→fi lernt/.test(tx) || !tx.includes("frisch = Abstand unter 4 Tagen")) E("Vokabelliste: alte Begriffe oder Legende fehlt"); }
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
  // Löschen und Wiederherstellen über die Cloud auf zwei Geräten
  { await a.evaluate(() => pullCloud()); await b.evaluate(() => pullCloud());
    const before = await a.evaluate(() => Object.keys(S.cards).length);
    await a.evaluate(async () => { safeCopy("-vor-loeschen", S); S = defaultState(); migrate(); save(); clearTimeout(PUSH_TIMER); await pushCloud(); });
    await b.evaluate(() => pullCloud());
    const bEmpty = await b.evaluate(() => Object.keys(S.cards).length === 0);
    await a.evaluate(async () => { undoDelete(); clearTimeout(PUSH_TIMER); await pushCloud(); });
    await b.evaluate(() => pullCloud());
    const bBack = await b.evaluate(() => Object.keys(S.cards).length);
    if (bEmpty && bBack === before && cloudCards().length === before) ok("Löschen und Wiederherstellen kommen über die Cloud auf dem zweiten Gerät an");
    else fail(`Cloud-Wiederherstellung: zweites Gerät leer=${bEmpty}, danach ${bBack}/${before} Karten, Cloud ${cloudCards().length}`); }
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

  // KI-Protokoll mit simuliertem Gemini: Einträge, Token, „KI lag falsch?“, Bericht, Sync
  { const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); const aiBodies = [];
    await ctx.addInitScript(() => { if (!localStorage.getItem("opi-suomea-config")) localStorage.setItem("opi-suomea-config", JSON.stringify({ setupDone: true, ai: { provider: "gemini", key: "test" } })); });
    await ctx.route("https://generativelanguage.googleapis.com/**", route => {
      const body = route.request().postData() || ""; aiBodies.push(body);
      const text = body.includes("intervalDays") ? '{"feedback":"Gut gemacht.","tips":["Weiter so"],"intervalDays":3,"reason":"solide"}'
        : body.includes("Vokabelkarte") ? '{"correct":true,"feedback":"Passt."}'
        : '{"correct":false,"feedback":"Endung falsch.","correction":"olen"}';
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }], usageMetadata: { promptTokenCount: 120, candidatesTokenCount: 30, thoughtsTokenCount: 10 } }) });
    });
    const g = await device(null, ctx);
    const r = await g.evaluate(async () => {
      const E = []; S.topics.t04.status = "new"; startSession("t04", "learn"); let n = 0, judged = false;
      while (!judged && SESSION.idx < SESSION.items.length && n++ < 100) {
        const ex = SESSION.items[SESSION.idx];
        if (ex.t === "gap" || ex.t === "tr") { document.querySelector("#ans").value = "zzz"; await checkAnswer(); judged = true;
          const fl = document.querySelector("#fb .aiflag"); if (!fl) E.push("„KI lag falsch?“ fehlt nach KI-Prüfung"); else fl.click(); }
        else { SESSION.idx++; renderEx(); }
      }
      SESSION.idx = SESSION.items.length - 1; nextEx();
      await rateTopic("good");
      if (!document.querySelector("#ratebox .aiflag")) E.push("„KI lag falsch?“ fehlt bei der Rundenauswertung");
      await vocabJudge(["talo", "Haus"], "fi", "Gebäude");
      const kinds = [...new Set(S.aiAudit.map(e => e.k))].sort().join(",");
      if (kinds !== "auswertung,pruefung,vokabel") E.push("Protokoll-Arten: " + kinds);
      const pr = S.aiAudit.find(e => e.k === "pruefung");
      if (!pr || !pr.flag || pr.tok.join("/") !== "120/30/10" || !pr.m) E.push("Prüfungs-Eintrag unvollständig: " + JSON.stringify(pr));
      // „Frag Opettaja“ in der Übung: vor dem Prüfen nur Hinweise (Anweisung im Prompt), Eintrag im Protokoll
      S.active = { id: "t06", mode: "learn", idxs: [0], rt: [0], idx: 0, results: [], d: Date.now() }; openSession();
      document.querySelector('[data-act="askex"]').click(); document.querySelector("#askexq").value = "Warum diese Endung?";
      window.__lastAiBody = null; await askExercise();
      if (!document.querySelector("#askexres .teacher")) E("Frag Opettaja (Übung): keine Antwort angezeigt");
      if (!document.querySelector("#askexres .aiflag")) E("Frag Opettaja (Übung): „KI lag falsch?“ fehlt");
      const fq = S.aiAudit.find(e => e.k === "frage");
      if (!fq || !/vor dem Prüfen/.test(fq.q)) E("Frag Opettaja (Übung): Protokolleintrag fehlt");
      dunno(); document.querySelector("#askexq").value = "Und jetzt?"; await askExercise();
      SESSION = null; S.active = null;
      const rep = buildReport();
      if (!/KI-PROTOKOLL/.test(rep) || !/Antwortprüfung: 1 \(0\) \| 120\/30\/10/.test(rep) || !/⚑/.test(rep)) E.push("Bericht ohne korrektes KI-Protokoll:\n" + rep.slice(rep.indexOf("KI-PROTOKOLL"), rep.indexOf("KI-PROTOKOLL") + 400));
      // Sync: Markierung und Gerätezähler bleiben beim Zusammenführen erhalten
      const other = JSON.parse(JSON.stringify(S)); other.aiAudit.forEach(e => (e.flag = false)); other.aiStats = { fremd: { since: 1, k: { wort: { n: 2, err: 0, i: 50, o: 5, t: 0, ms: 900, m: {} } } } };
      const M = mergeStates(S, other);
      if (!M.aiAudit.find(e => e.id === pr.id).flag) E.push("Sync verliert die Markierung");
      if (!M.aiStats.fremd || !M.aiStats[devId()]) E.push("Sync verliert Gerätezähler");
      return { E, rep };
    });
    r.E.forEach(fail); g.errs.forEach(e => fail("JS-Fehler im KI-Protokoll: " + e));
    if (!aiBodies.some(b => b.includes("Warum diese Endung?") && b.includes("NOCH NICHT beantwortet") && b.includes("Verrate die Lösung NICHT"))) fail("Frag Opettaja (Übung): Hinweis-Anweisung vor dem Prüfen fehlt im Prompt");
    if (!aiBodies.some(b => b.includes("Und jetzt?") && b.includes("schon beantwortet") && !b.includes("Verrate die Lösung NICHT"))) fail("Frag Opettaja (Übung): nach dem Prüfen keine volle Erklärung");
    if (!r.E.length) ok("KI-Protokoll: Einträge, Token, „KI lag falsch?“, Bericht und Sync");
    await ctx.close(); }

  // Notfall-Version: eine einzige Datei, die ohne Server und ohne Internet startet
  { const nf = await device({ setupDone: true });
    const single = await nf.evaluate(() => buildOfflineHTML());
    await nf.context().close();

    const tmp = path.join(fs.mkdtempSync("/tmp/opi-"), "notfall.html"); fs.writeFileSync(tmp, single);
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, offline: true });
    await ctx.addInitScript(() => localStorage.setItem("opi-suomea-config", JSON.stringify({ setupDone: true })));
    const pg = await ctx.newPage(); const errs = []; pg.on("pageerror", e => errs.push(e.message));
    await pg.goto("file://" + tmp); await pg.waitForTimeout(600);
    if (await pg.evaluate(() => document.querySelectorAll("script[src],link[rel=stylesheet]").length)) fail("Notfall-Version lädt noch externe Dateien");
    const okNf = await pg.evaluate(() => typeof BASE_TOPICS !== "undefined" && TOPICS.length >= 8 && document.querySelector("#app").innerText.length > 50 && getComputedStyle(document.querySelector("nav.tabs")).position !== "static");
    if (okNf && !errs.length) ok(`Notfall-Version: eine Datei (${Math.round(single.length / 1024)} KB), startet offline mit Design`); else fail("Notfall-Version startet nicht: " + errs.join("; "));
    await ctx.close(); }
  // Fortschritt löschen: Eintipp-Bestätigung, Sicherungsdatei, Wiederherstellen (auch nach Neuladen); Thema zurücksetzen
  { const d = await device({ setupDone: true });
    const prep = await d.evaluate(() => { ["t01", "t02"].forEach(id => { const s = S.topics[id]; s.status = "learning"; s.last = 0.9; s.reps = 2; s.due = addDays(3); s.hist = [{ d: Date.now(), sc: 90 }]; addCards(T(id)); });
      Object.values(S.cards).forEach(c => { c.isNew = false; c.reps = 2; c.interval = 4; c.due = addDays(4); c.last = Date.now(); }); S.stats.sessions = 3; save(); refreshUnlocks(); A.tab("progress");
      return { cards: Object.keys(S.cards).length, json: JSON.stringify({ t: S.topics, c: S.cards }) }; });
    await d.click('[data-act="reset"]');
    const go = d.locator("#delgo");
    if (!(await go.isDisabled())) fail("Löschen: Knopf ohne Bestätigung aktiv");
    await d.fill("#delconf", "löschen bitte"); if (!(await go.isDisabled())) fail("Löschen: falsche Eingabe wird akzeptiert");
    await d.fill("#delconf", "löschen"); if (await go.isDisabled()) fail("Löschen: korrekte Eingabe wird nicht akzeptiert");
    const [dlf] = await Promise.all([d.waitForEvent("download", { timeout: 5000 }), go.click()]);
    const bak = JSON.parse(fs.readFileSync(await dlf.path(), "utf8"));
    if (!/^opi-suomea-vor-dem-loeschen-/.test(dlf.suggestedFilename()) || Object.keys(bak.cards).length !== prep.cards) fail("Löschen: Sicherungsdatei fehlt oder unvollständig");
    if (await d.evaluate(() => hasProgress(S))) fail("Löschen: Fortschritt nicht gelöscht");
    await d.evaluate(() => A.tab("progress"));
    if (!(await d.locator('[data-act="undodelete"]').count())) fail("Löschen: „Gelöschten Stand wiederherstellen“ fehlt");
    else {
      await d.click('[data-act="undodelete"]'); await d.reload(); await d.waitForTimeout(500);
      const after = await d.evaluate(() => JSON.stringify({ t: S.topics, c: S.cards }));
      if (after !== prep.json) fail("Wiederherstellen: Stand nach Neuladen nicht identisch");
      else ok("Fortschritt löschen: Bestätigung, Sicherungsdatei, Wiederherstellung (identisch nach Neuladen)");
      await d.evaluate(() => A.tab("progress"));
      if (await d.locator('[data-act="undodelete"]').count()) fail("Wiederherstellen-Knopf bleibt nach Wiederherstellung sichtbar");
    }
    // Sicherungsdatei lässt sich auch über „Sicherung einspielen“ zurückholen
    await d.evaluate(() => { S = defaultState(); migrate(); save(); });
    await d.evaluate(txt => importText(txt), JSON.stringify(bak));
    if (await d.evaluate(() => JSON.stringify({ t: S.topics, c: S.cards })) !== prep.json) fail("Sicherungsdatei einspielen: Stand nicht identisch");
    else ok("Sicherungsdatei vom Löschen lässt sich wieder einspielen");
    // Thema zurücksetzen mit Eintipp-Bestätigung
    await d.evaluate(() => A.topic("t01"));
    await d.click('[data-act="resettopic"]');
    if (!(await d.locator("#topgo").isDisabled())) fail("Thema zurücksetzen: Knopf ohne Bestätigung aktiv");
    await d.fill("#topconf", "zuruecksetzen");
    const [dl2] = await Promise.all([d.waitForEvent("download", { timeout: 5000 }), d.click("#topgo")]);
    const st = await d.evaluate(() => S.topics.t01.status);
    if (st !== "new" || !/vor-zuruecksetzen-t01/.test(dl2.suggestedFilename())) fail("Thema zurücksetzen: " + st + " " + dl2.suggestedFilename());
    else ok("Thema zurücksetzen: Bestätigung + Sicherungsdatei");
    d.errs.forEach(e => fail("JS-Fehler beim Löschen/Wiederherstellen: " + e));
    await d.context().close(); }
} catch (e) { fail("Test abgebrochen: " + (e.stack || e.message)); }
finally { await browser.close(); server.close(); }

console.log(`\n${fehler.length ? "FEHLER: " + fehler.length : "Alles in Ordnung"}${hinweise.length ? ` · ${hinweise.length} Hinweis(e)` : ""}`);
process.exit(fehler.length ? 1 : 0);
