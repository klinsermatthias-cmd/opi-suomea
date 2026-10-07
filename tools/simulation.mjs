// Langzeit-Simulation der App (beide Apps der Lern-Engine): node tools/simulation.mjs
// Simuliert DAYS Tage (Standard 90) Lernen mit echten Inhalten, verschobener Uhr, nachgebautem Gemini, nachgebautem
// Claude (Urteile zu KI-Übungen) und zwei Geräten (PC täglich, Handy jeden 5. Tag) mit nachgebauter Supabase.
// Bedient wird die App wie von einem Menschen: über die Knöpfe (data-act), nicht über interne Funktionen.
// Optionen (Umgebungsvariablen): DAYS=90, WEAK_TOPIC=<Themen-ID> (Standard: 7. Thema), NOMIX=<Tag> (ab diesem Tag keine
// gemischte Wiederholung → Langzeit-Check wird geprüft), GAP=<von>-<bis> (Lernpause, Standard 120-133 bei ≥ 150 Tagen),
// OUT=<Datei> (Ergebnis als JSON, Standard: Temp-Ordner).
// Ändert keine Dateien im Repository. Ergebnis: Tagesprotokoll in der Konsole + „Probleme: N“.
//
// ABDECKUNGS-KONTROLLE (E-1007-83): Am Ende muss jede Aktion der App (jeder Knopf, const A in start.js), jede
// Ansicht (alle Funktionen render…), jede Übungsart der Inhalte, jede KI-Art (AI_KINDS) und jede Einstellung (change-
// Handler in start.js) mindestens einmal vorgekommen sein – sonst meldet die Simulation ein Problem. Neue Funktionen
// fallen dadurch automatisch auf. Ausnahmen nur mit Begründung in EXEMPT (unten).
// REGEL: Vor jeder neuen Simulation kritisch prüfen, ob wirklich alle Funktionen abgedeckt sind (auch neue) – und die
// Simulation sonst zuerst erweitern.
//
// Eingebaute Schwächen und Störungen:
//  W1 WEAK_TOPIC: Übungen bis Tag 40 meist falsch, danach gut
//  W2 fünf feste Vokabeln werden bis Tag 45 vergessen (in der Runde nach 2× gemerkt), danach gewusst
//  W3 freies Schreiben/Rollenspiel: KI ordnet Fehler WEAK_TOPIC zu
//  W4 Vergessen: Themen, die > 40 Tage nicht geübt wurden, sitzen schlechter
//  W5 Gerät B (Handy) lernt jeden 5. Tag zuerst, jeden 10. Tag auch eine Themenrunde → Abgleich darf nichts verlieren
//  W6 Störungen: Cloud hängt an Tag 33, Gemini überlastet an Tag 50–51, Skriptfehler-Probe an Tag 60,
//     keine Stimme an Tag 44/89, Sicherungsdatei braucht Freigabe an Tag 71
//  W7 Lernpause (GAP): Rückstand, Tageslimit, neue Themen pausieren
//  W8 Die letzten 2 Themen erscheinen erst an Tag 25 (neue Lektionen von Claude), Claude ändert an Tag 100 zwei Urteile
//  W9 Rundgang: Pause/Fortsetzen/Verwerfen, Paare, Hören, eigene Wörter, Fragen, Sicherung/Einspielen, Löschen +
//     Wiederherstellen, Thema zurücksetzen, Einstellungen, Ab-/Anmelden, Tagesstände, Lektionspaket …
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import os from "node:os";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const APPX = vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8") + "\n;APP");
const KEYID = APPX.id;
const PLACE = !!(APPX.features && APPX.features.placement);
const DAYS = +(process.env.DAYS || 90);
const DAY = 86400000;
const [GAP_FROM, GAP_TO] = (process.env.GAP || (DAYS >= 150 ? "120-133" : "")).split("-").map(Number);
const inGap = d => GAP_FROM >= 0 && GAP_TO >= GAP_FROM && d >= GAP_FROM && d <= GAP_TO;
const REVEAL_DAY = 25;
const log = [], problems = [];
const P = m => { problems.push(m); console.log("✗ " + m); };

/* Ausnahmen der Abdeckungs-Kontrolle – nur mit Begründung */
const EXEMPT = {
  reload: "„Jetzt neu laden“ erscheint nur bei einer neuen Version; das Neuladen selbst passiert jeden Tag (openDay)"
};
if (!PLACE) Object.assign(EXEMPT, Object.fromEntries(["pt", "ptpart", "ptu", "ptcheck", "ptrf", "ptself", "ptfinish", "ptreport", "ptimport", "renderPlacement", "KI:einstufung"].map(k => [k, "Einstufungstest gibt es nur im Deutsch-Trainer"])));

/* ---------- Server: App (echte Inhalte) + Supabase-Nachbau ---------- */
const db = { progress: new Map(), snaps: new Map(), hang: false };
const pgTime = ms => new Date(ms).toISOString().replace("Z", "+00:00");
let verdicts = {}, simDayNow = 0;
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname === "/lektionen/ki-pruefung.json") { res.writeHead(200, { "Content-Type": "application/json" }); return res.end(JSON.stringify(verdicts)); }
  if (u.pathname === "/lektionen/lektionen.json" && simDayNow < REVEAL_DAY) {
    // W8: die letzten 2 Themen kommen erst später (wie neue Lektionen von Claude)
    let L = []; try { L = JSON.parse(fs.readFileSync(path.join(ROOT, "lektionen/lektionen.json"), "utf8")); } catch (e) {}
    res.writeHead(200, { "Content-Type": "application/json" }); return res.end(JSON.stringify(L.length > 4 ? L.slice(0, -2) : L));
  }
  if (u.pathname.startsWith("/sb/")) {
    if (db.hang) return;
    let body = ""; req.on("data", c => (body += c)); req.on("end", () => {
      const send = (code, obj) => { res.writeHead(code, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }); res.end(obj === undefined ? "" : JSON.stringify(obj)); };
      if (u.pathname.startsWith("/sb/auth/")) return send(200, { access_token: "t", refresh_token: "r", expires_in: 3600, user: { id: "u1", email: "sim@example.invalid" } });
      if (u.pathname === "/sb/rest/v1/snapshots") {
        if (req.method === "POST") { try { const b = JSON.parse(body); db.snaps.set(b.day, b.data); } catch (e) {} return send(201); }
        if (req.method === "DELETE") return send(204);
        const day = (u.searchParams.get("day") || "").replace("eq.", "");
        if (day) return send(200, db.snaps.has(day) ? [{ data: db.snaps.get(day) }] : []);
        return send(200, [...db.snaps.keys()].sort().reverse().map(d => ({ day: d })));
      }
      if (u.pathname !== "/sb/rest/v1/progress") return send(404, {});
      const user = (u.searchParams.get("user_id") || "").replace("eq.", ""), row = db.progress.get(user);
      if (req.method === "GET") return send(200, row ? [{ data: row.data, updated_at: pgTime(row.at) }] : []);
      if (req.method === "PATCH") {
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
  const p0 = u.pathname === "/" ? "/index.html" : u.pathname;
  const f = path.join(ROOT, decodeURIComponent(p0));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  const type = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".webmanifest": "application/manifest+json" }[path.extname(f)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type + "; charset=utf-8" }); fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, r));
const URL0 = `http://localhost:${server.address().port}/`;

let pw;
try { pw = createRequire(path.join(ROOT, "x.js"))("playwright"); }
catch (e) { pw = createRequire(path.join(execSync("npm root -g").toString().trim(), "x.js"))("playwright"); }
const exe = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});

/* ---------- simuliertes Gemini ---------- */
let WEAK = process.env.WEAK_TOPIC || "";
let geminiDown = false, gemCalls = {}, genCounter = 0;
function gemini(body) {
  const k = (n) => (gemCalls[n] = (gemCalls[n] || 0) + 1);
  const has = s => body.includes(s);
  if (has("reschedule")) { k("gesamtanalyse"); return { level: "A1.1", summary: "Sim.", strengths: ["x"], weaknesses: ["Verneinung"], tips: ["t"], reschedule: [{ topicId: WEAK, days: 1, reason: "Verneinung schwach" }, { topicId: "t01", days: 200, reason: "Sim: zu lang" }], skills: {}, nextFocus: "Verneinung üben", basicsSolid: true, basicsReason: "Sim" }; }
  if (has("Erstelle 7 NEUE")) {
    k("generieren"); genCounter++;
    const ex = [];
    for (let i = 0; i < 5; i++) ex.push({ t: "gap", q: `Simulation ${genCounter}-${i}: Minä ___ kotona.`, h: "olla", a: ["olen"] });
    ex.push({ t: "mc", q: `Regelfrage ${genCounter}?`, o: ["a", "b", "c"], a: 0, x: "weil" });
    return { ex };
  }
  if (has("intervalDays")) { k("rundenauswertung"); return { feedback: "Gut.", tips: ["Weiter"], intervalDays: 90, reason: "Simulation: absichtlich zu lang" }; }
  if (has("Korrigiere den Text wie")) { k("schreiben-korrektur"); return { correct: false, corrected: "En ole kotona.", errors: [{ wrong: "Minä ei", right: "En", why: "Verneinung" }], feedback: "Verneinung beachten.", topics: [WEAK, "t99"] }; }
  if (has("kurze Schreibaufgabe")) { k("schreiben-aufgabe"); return { task: "Schreib, dass du nicht zu Hause bist.", words: ["koti"], sample: "En ole kotona." }; }
  if (has("Prüfe streng als")) { k("schreiben-gegenpruefung"); return { ok: true, taskClear: true, fixed: "" }; }
  if (has("Starte ein kurzes Rollenspiel")) { k("rollenspiel-start"); return { scene: "Im Café " + Math.random().toString(36).slice(2, 5), role: "Kellner", goal: "bestellen", opener: "Hei! Mitä saisi olla?", opener_tr: "Hallo!" }; }
  if (has("Neue Antwort von")) { k("rollenspiel-zug"); return { ok: false, fix: "En halua kahvia.", note: "Verneinung", reply: "Selvä.", reply_tr: "OK", end: false, topics: [WEAK] }; }
  if (has("Ziel erreicht? Was war gut?")) { k("rollenspiel-ende"); return { goal: true, summary: "Gut.", tips: ["Verneinung"] }; }
  if (has("Bewerte jede markierte ZEILE")) { k("dialog"); return { lines: [{ n: 1, correct: false, correction: "En ole." }], feedback: "Fehler.", topics: [WEAK] }; }
  if (has("Aufgabentyp: Schreibaufgabe")) { k("schreibaufgabe"); return { correct: false, feedback: "Fehler", correction: "En ole.", topics: [WEAK] }; }
  if (has("Vokabelkarte")) { k("vokabel"); return { correct: false, feedback: "Nein." }; }
  if (has("Grundform (Wörterbuchform)")) { k("wort"); return { de: "Sim-Bedeutung", base: "sim", note: "" }; }
  if (has("höchstens 1 kurzer Satz")) { k("eigenes-wort"); return { fi: "simsana", de: "Simwort", note: "" }; }
  if (has('\\"results\\":[')) {
    k("einstufung-pruefung");
    const ids = [...body.matchAll(/\\"id\\": ?\\"([A-D]\d+\.\d+)\\"/g)].map(m => m[1]);
    return { results: ids.map((id, i) => ({ id, correct: i % 3 !== 0, gaps: [i % 3 !== 0], correction: "Sim.", explanation: i % 3 ? "" : "Sim-Regel." })) };
  }
  if (has('\\"mistakes\\":[')) { k("einstufung-text"); return { corrected: "Sim-Text.", mistakes: [{ wrong: "a", right: "b", why: "Sim" }], feedback: "Sim." }; }
  if (has('\\"focus\\":')) { k("einstufung-ergebnis"); return { level: "B1", summary: "Sim.", strengths: ["x"], weaknesses: ["y"], focus: "Sim" }; }
  k("sonst"); return { correct: false, feedback: "Leider falsch.", correction: "–" };
}

/* ---------- Geräte ---------- */
const SB = "https://sim-cloud.supabase.test"; // https wie in echt (die Einrichtung verlangt https), umgeleitet auf den Nachbau
const CFG = { setupDone: true, sbUrl: SB, sbKey: "k", ai: { provider: "gemini", key: "sim" }, session: { access_token: "t", refresh_token: "r", expires_at: Date.now() + 36e5, user: { id: "u1" } } };
async function makeDevice(name) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: URL0.replace(/\/$/, "") });
  await ctx.addInitScript(([cfg, key, weak]) => {
    window.__simWeak = weak;
    const off = +localStorage.getItem("__simOff") || 0, RD = Date, now = () => RD.now() + off;
    class D extends RD { constructor(...a) { super(...(a.length ? a : [now()])); } static now() { return now(); } }
    window.Date = D;
    window.OPI_SB_TIMEOUT = 1500;
    if (!localStorage.getItem(key + "-config")) localStorage.setItem(key + "-config", JSON.stringify(cfg));
    // Stimme: eine Stimme der Lernsprache, außer an „ohne Stimme“-Tagen (W6)
    if (window.speechSynthesis && !localStorage.getItem("__simNoVoice")) {
      const voices = [{ name: "Sim fi", lang: "fi-FI", localService: true }, { name: "Sim de", lang: "de-AT", localService: true }, { name: "Sim en", lang: "en-GB", localService: true }];
      speechSynthesis.getVoices = () => voices;
      speechSynthesis.speak = () => {};
      speechSynthesis.cancel = () => {};
      window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
    } else if (window.speechSynthesis) speechSynthesis.getVoices = () => [];
    // Teilen (Handy) und Sicherungsdatei (PC, echtes Dateisystem des Browsers über OPFS)
    navigator.canShare = () => true;
    navigator.share = async () => { window.__simShared = (window.__simShared || 0) + 1; };
    window.showSaveFilePicker = async () => (await navigator.storage.getDirectory()).getFileHandle("sim-sicherung.json", { create: true });
    if (localStorage.getItem("__simFilePrompt") && window.FileSystemHandle) {
      const q = FileSystemHandle.prototype.queryPermission;
      FileSystemHandle.prototype.queryPermission = async function () { return localStorage.getItem("__simFilePrompt") ? "prompt" : q.apply(this, arguments); };
      FileSystemHandle.prototype.requestPermission = async function () { localStorage.removeItem("__simFilePrompt"); return "granted"; };
    }
  }, [CFG, KEYID, process.env.WEAK_TOPIC || ""]);
  await ctx.route(SB + "/**", async route => {
    const rq = route.request();
    try {
      const r = await fetch(URL0 + "sb" + rq.url().slice(SB.length), { method: rq.method(), headers: { "Content-Type": "application/json" }, body: ["GET", "HEAD"].includes(rq.method()) ? undefined : rq.postData() || "" });
      route.fulfill({ status: r.status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: await r.text() });
    } catch (e) { route.abort().catch(() => {}); }
  });
  await ctx.route("https://generativelanguage.googleapis.com/**", route => {
    if (route.request().method() === "GET") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ models: ["gemini-flash-latest", "gemini-2.5-flash", "gemini-flash-lite-latest", "gemini-2.5-flash-lite"].map(m => ({ name: "models/" + m, supportedGenerationMethods: ["generateContent"] })) }) });
    if (geminiDown) return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: { message: "overloaded" } }) });
    const text = JSON.stringify(gemini(route.request().postData() || ""));
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }], usageMetadata: { promptTokenCount: 500, candidatesTokenCount: 80, thoughtsTokenCount: 10 } }) });
  });
  const page = await ctx.newPage();
  page.errs = [];
  page.on("pageerror", e => page.errs.push(e.message));
  page.on("dialog", d => d.dismiss());
  page.on("download", d => d.delete().catch(() => {}));
  page.name = name;
  return page;
}

async function openDay(page, day, flags = {}) {
  await page.goto(URL0);
  await page.evaluate(([o, f]) => {
    localStorage.setItem("__simOff", String(o));
    if (f.noVoice) localStorage.setItem("__simNoVoice", "1"); else localStorage.removeItem("__simNoVoice");
    if (f.filePrompt) localStorage.setItem("__simFilePrompt", "1");
  }, [day * DAY, flags]);
  await page.goto(URL0);
  await page.waitForFunction(() => typeof S !== "undefined" && S && document.querySelector("#app").innerHTML.length > 0, null, { timeout: 15000 });
  await page.waitForTimeout(700);
  await page.evaluate(LEARNER);
}

/* ---------- Lernende/r im Browser ---------- */
const LEARNER = () => {
  const WEAK_WORDS_UNTIL = 45, WEAK_TOPIC = window.__simWeak || (TOPICS[6] || TOPICS[TOPICS.length - 1] || {}).id, WEAK_TOPIC_UNTIL = 40;
  window.__simWeakId = WEAK_TOPIC;
  window.SIM = window.SIM || {};
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const waitFor = async (f, ms = 30000) => { const t = performance.now(); while (performance.now() - t < ms) { try { if (f()) return true; } catch (e) {} await sleep(15); } return false; };
  window.simSleep = sleep; window.simWait = waitFor;

  /* Abdeckung: jede Aktion (Knopf) und jede Ansicht (render…) zählt mit */
  window.__cov = window.__cov || { act: {}, view: {}, ex: {}, chg: {} };
  for (const k of Object.keys(A)) if (!A[k].__sim) { const f = A[k]; A[k] = function (...x) { __cov.act[k] = (__cov.act[k] || 0) + 1; return f.apply(this, x); }; A[k].__sim = 1; }
  for (const k of Object.keys(window)) {
    if (!/^render[A-Z]/.test(k) || typeof window[k] !== "function" || window[k].__sim) continue;
    const f = window[k]; window[k] = function (...x) { __cov.view[k] = (__cov.view[k] || 0) + 1; return f.apply(this, x); }; window[k].__sim = 1;
  }

  /* Knopf suchen und antippen wie ein Mensch (eingeklappte Bereiche vorher aufklappen). Fehlt er: Problem. */
  window.simErr = window.simErr || [];
  const findBtn = (act, id) => [...document.querySelectorAll(`[data-act="${act}"]`)].find(b => (id == null || b.dataset.id === String(id)) && !b.disabled);
  window.simHas = (act, id) => !!findBtn(act, id);
  window.clk = (act, id, why) => {
    const b = findBtn(act, id);
    if (!b) { simErr.push(`Knopf fehlt: ${act}${id != null ? " " + id : ""}${why ? " (" + why + ")" : ""} – Ansicht ${CUR.tab}/${CUR.arg || "-"}${SESSION ? " Runde " + SESSION.kind : ""}: „${(document.querySelector("#app").textContent || "").replace(/\s+/g, " ").slice(0, 90)}“`); return false; }
    const d = b.closest("details"); if (d && !d.open) d.querySelector("summary").click();
    b.click(); return true;
  };
  window.typeIn = (sel, v) => { const f = document.querySelector(sel); if (!f) { simErr.push("Feld fehlt: " + sel); return false; } f.focus(); f.value = v; f.dispatchEvent(new Event("input", { bubbles: true })); return true; };
  window.setSel = (id, v) => { const f = document.getElementById(id); if (!f) { simErr.push("Einstellung fehlt: " + id); return false; } f.value = String(v); f.dispatchEvent(new Event("change", { bubbles: true })); __cov.chg[id] = 1; return true; };

  window.simP = (tid, simDay) => {
    let p = 0.9;
    if (tid === WEAK_TOPIC && simDay < WEAK_TOPIC_UNTIL) p = 0.3;
    const lp = typeof lastPracticed === "function" ? lastPracticed(tid) : Date.now();
    if (lp && Date.now() - lp > 40 * 86400000) p -= 0.3; // vergessen
    return p;
  };
  window.simWeakWord = id => {
    const base = cardParse(id).base;
    const all = Object.keys(S.cards).filter(x => cardWord(x)).map(x => cardParse(x).base);
    const uniq = [...new Set(all)].sort();
    return uniq.slice(0, 5).includes(base);
  };
  /* Musterlösung über die Bedienelemente eingeben (Satz ordnen: Wörter antippen) */
  window.fillModel = ex => {
    if (ex.t === "mc") { clk("mc", SESSION.cur.opts.findIndex(o => o.ok)); return true; }
    if (ex.t === "tab") { const g = tabGaps(ex); document.querySelectorAll(".tcell").forEach((inp, k) => (inp.value = g[k][0])); }
    else if (ex.t === "ord") {
      const used = new Set(); let rest = norm(ex.a), g = 0;
      if (SESSION.cur.chips.length > 2) { clk("pick", SESSION.cur.chips.findIndex((c, j) => true)); clk("unpick", 0); } // einmal antippen und zurücknehmen
      while (rest && g++ < 40) {
        const chips = SESSION.cur.chips, i = chips.findIndex((c, j) => !used.has(j) && !SESSION.cur.picked.includes(j) && (rest === norm(c) || rest.startsWith(norm(c) + " ")));
        if (i < 0) return false; used.add(i); clk("pick", i); rest = rest.slice(norm(chips[i]).length).trim();
      }
    }
    else if (ex.t === "les") SESSION.cur.qs.forEach((q, qi) => clk("lpick", `${qi}:${q.findIndex(o => o.ok)}`));
    else if (ex.t === "dlg") { const g = dlgGaps(ex); document.querySelectorAll(".dcell").forEach((inp, k) => (inp.value = g[k][0])); }
    else if (document.querySelector("#ans")) document.querySelector("#ans").value = ex.a[0];
    return false;
  };
  window.simWrong = ex => {
    const r = Math.random();
    if (ex.t === "mc") { clk("mc", SESSION.cur.opts.findIndex(o => !o.ok)); return; }
    if (ex.t === "les") { SESSION.cur.qs.forEach((q, qi) => clk("lpick", `${qi}:${q.findIndex(o => !o.ok)}`)); return clk("check"); }
    if (r < 0.6 || ex.t === "ord") return clk("dunno");
    if (ex.t === "tab") document.querySelectorAll(".tcell").forEach(i => (i.value = "zzz"));
    else if (ex.t === "dlg") document.querySelectorAll(".dcell").forEach(i => (i.value = "Minä ei ole zzz"));
    else if (document.querySelector("#ans")) document.querySelector("#ans").value = "Minä ei zzz";
    else return clk("dunno");
    return clk("check");
  };
  /* eine Übungsrunde über die Knöpfe spielen; gibt Stats zurück. opt.stopAfter: nach n Aufgaben pausieren */
  window.simRound = async (simDay, rate = true, opt = {}) => {
    const st = { n: 0, wrong: 0 };
    let guard = 0;
    while (SESSION && SESSION.kind === "topic" && SESSION.idx < SESSION.items.length && guard++ < 200) {
      if (opt.stopAfter && st.n >= opt.stopAfter) { clk("abort", null, "Pause"); st.paused = true; return st; }
      const ex = SESSION.items[SESSION.idx], src = srcOf(S.active, SESSION.idx), retry = S.active.rt[SESSION.idx];
      __cov.ex[ex.t] = (__cov.ex[ex.t] || 0) + 1;
      const ok = retry ? Math.random() < 0.95 || guard > 120 : Math.random() < simP(src.tid, simDay);
      st.n++;
      if (opt.extras && st.n === 1) await opt.extras(ex);
      if (!SIM.vhintUsed && simHas("vhint")) { clk("vhint"); SIM.vhintUsed = 1; } // Vokabelhilfe (nur Übersetzung in die Lernsprache)
      if (ok) { if (!fillModel(ex)) clk("check"); }
      else { st.wrong++; simWrong(ex); }
      if (!(await waitFor(() => !SESSION || document.querySelector("#nextbtn"), 45000))) { simErr.push("Antwort wird nicht ausgewertet: " + ex.t); clk("dunno"); await waitFor(() => !SESSION || document.querySelector("#nextbtn"), 5000); }
      if (!SESSION) break;
      if (opt.afterCheck && st.n === 1) await opt.afterCheck(ex);
      if (!clk("next")) break;
    }
    if (guard >= 200) st.stuck = true;
    if (rate && document.querySelector("#ratebox")) {
      const sc = SESSION ? SESSION.score : 1;
      clk("rate", sc >= 0.9 ? "easy" : sc >= 0.75 ? "good" : sc >= 0.5 ? "hard" : "again");
      if (!(await waitFor(() => !SESSION, 45000))) simErr.push("Bewertung schließt die Runde nicht ab");
    }
    st.score = st.n ? 1 - st.wrong / st.n : 1;
    return st;
  };
  /* Vokabelrunde über die Knöpfe (Aufdecken, Bewerten, einmal „↶ Zurück“, ab und zu fragen) */
  window.simVocab = async (simDay, limitN, opt = {}) => {
    let n = 0, again = 0, undone = !opt.undo;
    while (SESSION && SESSION.kind === "vocab" && SESSION.queue.length && n++ < (limitN || 400)) {
      const id = SESSION.queue[0], w = cardWord(id), c = S.cards[id];
      SIM.tries = SIM.tries || {}; const tk = id + "@" + simDay; SIM.tries[tk] = (SIM.tries[tk] || 0) + 1;
      const weak = simWeakWord(id) && simDay < WEAK_WORDS_UNTIL && SIM.tries[tk] < 3; // in der Runde nach 2× gemerkt, am nächsten Tag wieder vergessen
      const sinceLast = c.last ? (Date.now() - c.last) / 86400000 : 0;
      const pKnow = weak ? 0.05 : c.isNew ? 0.7 : Math.max(0.5, 0.97 - Math.max(0, sinceLast - (c.interval || 1)) * 0.02);
      const know = Math.random() < pKnow;
      const inp = document.querySelector("#ans");
      if (inp) inp.value = know ? (SESSION.dir === "fi" ? w[1] : w[0]) : Math.random() < 0.3 ? "väärin" : "";
      clk("flip");
      if (opt.ask && n === 2 && simHas("askex")) { clk("askex"); typeIn("#askexq", "Woher kommt das Wort?"); clk("askexgo"); await waitFor(() => !/prüft|denkt/.test(document.querySelector("#askex").textContent), 20000); }
      if (inp && inp.value && document.querySelector("#vjudge")) await waitFor(() => !/prüft/.test(document.querySelector("#vjudge").textContent), 20000);
      const k = !know ? "again" : Math.random() < 0.15 ? "hard" : Math.random() < 0.8 ? "good" : "easy";
      if (k === "again") again++;
      clk("crate", k);
      if (!undone && n === 3 && simHas("cundo")) { undone = true; clk("cundo"); clk("crate", k); }
    }
    if (SESSION && SESSION.kind === "vocab") SESSION = null;
    return { n, again };
  };
};

/* ---------- Rundgang (W9): alle übrigen Funktionen, verteilt über die Tage ----------
   Jeder Schritt gibt „ok“, „skip“ (Voraussetzung fehlt noch → später erneut) oder einen Fehlertext zurück. */
const TOUR = [
  ["Pause, Fortsetzen", async day => {
    const t = learningTopics().find(x => S.topics[x.id].due > endOfDay()); if (!t || S.active) return "skip";
    A.tab("topics"); clk("topic", t.id); clk("extra", t.id);
    const r = await simRound(day, false, { stopAfter: 2 }); if (!r.paused || !S.active) return "Pause hat nicht geklappt";
    A.tab("today"); if (!document.querySelector('#app [data-act="resume"]')) return "Heute zeigt die pausierte Runde nicht";
    clk("resume"); await simRound(day, false); return S.active ? "Runde nach Fortsetzen nicht beendet" : "ok";
  }],
  ["Verwerfen + trotzdem starten", async day => {
    const t = learningTopics()[0]; if (!t || S.active || learningTopics().length < 2) return "skip";
    A.tab("topics"); clk("topic", t.id); clk("extra", t.id); await simRound(day, false, { stopAfter: 1 });
    A.tab("today"); clk("mix"); if (!simHas("startanyway")) return "Hinweis auf pausierte Runde fehlt";
    clk("startanyway"); await simRound(day, false);
    A.tab("topics"); clk("topic", t.id); clk("extra", t.id); await simRound(day, false, { stopAfter: 1 });
    A.tab("today"); clk("discard"); return S.active ? "Verwerfen hat nicht geklappt" : "ok";
  }],
  ["Fragen, Wort antippen, Vokabelhilfe, KI lag falsch", async day => {
    const t = learningTopics().find(x => T(x.id).ex.some(e => e.t === "tr" || e.t === "gap")); if (!t || S.active) return "skip";
    A.tab("topics"); clk("topic", t.id);
    typeIn("#askq", "Warum ist das so?"); clk("ask", t.id); await simWait(() => !/denkt|prüft/.test(document.querySelector("#askres").textContent), 20000);
    clk("extra", t.id);
    await simRound(day, false, {
      extras: async () => {
        const g = document.querySelector('#app [data-act="gloss"]'); if (g) { g.click(); await simWait(() => document.querySelector("#gloss"), 5000); }
        clk("askex"); typeIn("#askexq", "Warum diese Form?"); clk("askexgo"); await simWait(() => !/denkt|prüft/.test(document.querySelector("#askex").textContent), 20000);
      },
      afterCheck: async () => { if (simHas("aiflag")) clk("aiflag"); const g = document.querySelector('#fb [data-act="gloss"]'); if (g) g.click(); }
    });
    return "ok";
  }],
  ["Zusätzliche Vokabeln (mit Zurück und Frage)", async day => {
    if (!Object.keys(S.cards).length) return "skip";
    A.tab("today"); if (!simHas("extravocab")) return "skip";
    clk("extravocab"); await simVocab(day, 25, { undo: true, ask: true }); return "ok";
  }],
  ["Problemwörter üben", async day => {
    A.tab("vocab"); if (!simHas("leech")) return "skip";
    clk("leech"); await simVocab(day, 30); return "ok";
  }],
  ["Paare zuordnen", async () => {
    A.tab("vocab"); if (!simHas("pairs")) return "skip";
    clk("pairs"); let g = 0;
    if (SESSION && SESSION.kind === "pairs") { clk("pair", "L:" + SESSION.L[0]); clk("pair", "R:" + SESSION.R.find(i => i !== SESSION.L[0])); }
    while (SESSION && SESSION.kind === "pairs" && g++ < 20) { const i = SESSION.ws.findIndex((_, j) => !SESSION.done.includes(j)); clk("pair", "L:" + i); clk("pair", "R:" + i); }
    if (SESSION) return "Paare: Spiel endet nicht";
    clk("pairs"); A.tab("vocab"); return "ok";
  }],
  ["Hören: Wörter diktieren und Sätze verstehen", async () => {
    A.tab("vocab"); if (!simHas("listen")) return document.querySelector('[data-act="listen"]') ? "Diktat trotz Stimme ausgegraut" : "skip";
    clk("listen"); let i = 0;
    while (SESSION && SESSION.kind === "listen" && SESSION.idx < SESSION.queue.length && i++ < 12) {
      const w = cardWord(SESSION.queue[SESSION.idx]);
      if (i === 2) clk("ldunno"); else { typeIn("#ans", i === 3 ? "zzz" : w[0]); clk("lcheck"); }
      clk("lnext");
    }
    clk("tab", "vocab");
    if (simHas("listens")) {
      clk("listens"); i = 0;
      while (SESSION && SESSION.kind === "listenS" && SESSION.idx < SESSION.queue.length && i++ < 10) {
        const x = SESSION.queue[SESSION.idx];
        if (i === 2) clk("lsreveal"); else { typeIn("#ans", i === 3 ? "etwas ganz anderes" : x.de[0]); clk("lscheck"); }
        await simWait(() => document.querySelector('[data-act="lsnext"]'), 20000); clk("lsnext");
      }
    }
    return "ok";
  }],
  ["Eigene Wörter", async () => {
    A.tab("vocab"); typeIn("#ownfi", "simsana" + Date.now() % 1000); typeIn("#ownde", "Simwort");
    if (simHas("ownai")) { clk("ownai"); await simWait(() => !/prüft|denkt/.test((document.querySelector("#ownaires") || {}).textContent || ""), 20000); }
    clk("ownsave"); const n = ownKeys()[ownKeys().length - 1]; if (!n) return "Eigenes Wort nicht gespeichert";
    A.tab("vocab"); clk("allwords"); clk("ownedit", n); typeIn("#ownde", "Simwort (geändert)"); clk("ownsave", n);
    if (S.own[n].de !== "Simwort (geändert)") return "Eigenes Wort nicht geändert";
    A.tab("vocab"); clk("allwords"); clk("owndel", n); clk("owndel", n); if (!S.own[n].del) return "Eigenes Wort nicht gelöscht";
    A.tab("vocab"); clk("allwords"); const s = document.querySelector("#app .spk"); if (s) s.click(); clk("allwords"); return "ok";
  }],
  ["Grammatik-Übersicht, Themenliste, Zurück", async () => {
    A.tab("topics"); clk("grammar"); const d = document.querySelector("details.gram summary"); if (d) d.click();
    clk("back"); A.tab("topics"); const t = learningTopics()[0]; if (t) { clk("topic", t.id); clk("back"); } return "ok";
  }],
  ["Neue Übungen anfordern", async () => {
    const t = learningTopics()[0]; if (!t || !genUnlocked() || S.active) return "skip";
    A.tab("topics"); clk("topic", t.id); if (!simHas("gen", t.id)) return "Knopf „Neue Übungen anfordern“ fehlt trotz Freigabe";
    clk("gen", t.id); await simWait(() => !document.querySelector('#app [data-act="gen"][disabled]'), 30000); return "ok";
  }],
  ["Bericht, Kopieren, Analyse", async () => {
    A.tab("settings"); clk("report"); clk("copy"); A.tab("progress"); clk("global"); await simWait(() => !GLOBAL_RUNNING, 30000);
    A.tab("today"); if (simHas("reportnow")) clk("reportnow"); return "ok";
  }],
  ["Sicherung: Backup-Text kopieren und einspielen", async () => {
    A.tab("settings"); const before = JSON.stringify(S.cards);
    clk("export"); const txt = document.querySelector("#outta").value; clk("copy");
    clk("importopen"); typeIn("#impta", txt); clk("importdo");
    await simSleep(300); if (JSON.stringify(S.cards) !== before) return "Backup einspielen verändert die Karten";
    // dasselbe als Datei (Dateiauswahl)
    A.tab("settings"); clk("importopen"); const fi = document.querySelector("#impfile");
    if (!fi) return "Dateiauswahl für die Sicherung fehlt";
    const dt = new DataTransfer(); dt.items.add(new File([txt], "sicherung.json", { type: "application/json" })); fi.files = dt.files;
    fi.dispatchEvent(new Event("change", { bubbles: true })); __cov.chg.impfile = 1; await simSleep(800);
    if (JSON.stringify(S.cards) !== before) return "Sicherungsdatei einspielen verändert die Karten";
    A.tab("today"); if (simHas("pasteimport")) { clk("pasteimport"); A.tab("today"); } return "ok";
  }],
  ["Sicherungsdateien", async () => {
    A.tab("settings"); clk("download"); clk("offline"); await simSleep(500);
    // Erinnerung an die Gerätesicherung (nur ohne automatische Sicherungsdatei; „Später“ schiebt sie einen Tag)
    if (!CFG.autoFile) {
      CFG.lastDevBackup = 0; CFG.backupSnooze = 0; saveCfg(); A.tab("today");
      if (simHas("sharebackup")) clk("sharebackup"); else if (simHas("download")) clk("download"); else return "Sicherungs-Hinweis fehlt";
      await simSleep(300); CFG.lastDevBackup = 0; saveCfg(); A.tab("today"); if (simHas("backuplater")) clk("backuplater"); else return "„Später“ fehlt";
      A.tab("today"); if (simHas("backuplater")) return "„Später“ wirkt nicht";
    } else { CFG.lastDevBackup = 0; saveCfg(); A.tab("today"); if (simHas("backuplater")) return "Sicherungs-Hinweis trotz automatischer Sicherungsdatei"; }
    // Rohdaten aus der Fehleransicht
    const orig = window.renderProgress; window.renderProgress = () => { throw new Error("Sim-Ansichtsfehler"); };
    A.tab("progress"); window.renderProgress = orig; clk("rescuedl"); clk("tab", "today"); return "ok";
  }],
  ["Automatische Sicherungsdatei", async () => {
    if (!HAS_FSA) return "skip";
    A.tab("settings"); if (CFG.autoFile) { clk("autofilechange"); await simSleep(300); return "ok"; }
    clk("autofile"); await simWait(() => CFG.autoFile, 5000);
    if (!CFG.autoFile) { let why = ""; try { const h = await window.showSaveFilePicker({}); why = "Datei ok: " + h.name; await idbSet("fileHandle", h); why += ", idb ok"; } catch (e) { why += " " + e.message; } return "Sicherungsdatei nicht eingerichtet (" + why + ")"; }
    return "ok";
  }],
  ["Sicherungsdatei ausschalten", async () => {
    if (!HAS_FSA || !CFG.autoFile || !SIM.fileOkDone) return "skip";
    A.tab("settings"); clk("autofileoff"); await simSleep(300); return CFG.autoFile ? "Sicherungsdatei bleibt an" : "ok";
  }],
  ["Einstellungen", async () => {
    A.tab("settings"); const keep = JSON.stringify(S.settings);
    for (const th of ["dark", "light", "auto"]) clk("theme", th);
    clk("toggleauto"); clk("toggleauto"); clk("toggleslow"); clk("toggleslow"); clk("toggleai"); clk("toggleai");
    for (const id of ["newper", "extranum", "maxrev", "newtop"]) { const el = document.getElementById(id); if (!el) { simErr.push("Einstellung fehlt: " + id); continue; } const v = el.value; setSel(id, el.options[0].value); setSel(id, v); }
    if (JSON.stringify(S.settings) !== keep) return "Einstellungen nicht wiederhergestellt";
    clk("aidiag"); await simWait(() => !/prüft|Prüfe/.test((document.querySelector("#aidiagbox") || {}).textContent || ""), 20000);
    return "ok";
  }],
  ["Tagesstände der Cloud", async () => {
    A.tab("settings"); clk("snaps"); await simWait(() => document.querySelector('[data-act="loadsnap"]'), 8000);
    const b = document.querySelector('[data-act="loadsnap"]'); if (!b) return "skip";
    const before = Object.keys(S.cards).length; clk("loadsnap", b.dataset.id); clk("loadsnap", b.dataset.id); await simSleep(800);
    return Object.keys(S.cards).length < before * 0.8 ? "Tagesstand von heute verliert Karten" : "ok";
  }],
  ["Einrichtung: KI speichern, ab- und anmelden", async () => {
    A.tab("settings"); if (CUR.tab !== "setup") clk("setup", null, "setupDone=" + CFG.setupDone + " Ansicht " + CUR.tab); clk("aisave"); await simSleep(800);
    clk("logout"); clk("logout"); await simSleep(300); if (cloudOn()) return "Abmelden hat nicht geklappt";
    typeIn("#sbmail", "sim@example.invalid"); typeIn("#sbpw", "simsim1"); clk("signup"); await simWait(() => cloudOn(), 8000);
    if (cloudOn()) { A.tab("settings"); clk("setup"); clk("logout"); clk("logout"); await simSleep(300); }
    typeIn("#sbmail", "sim@example.invalid"); typeIn("#sbpw", "simsim1"); clk("login"); await simWait(() => cloudOn(), 8000);
    if (!cloudOn()) return "Anmelden hat nicht geklappt";
    await simSleep(1500); A.tab("settings"); clk("setup"); clk("setupdone"); return "ok";
  }],
  ["Lektionspaket einspielen", async () => {
    const t = TOPICS.find(x => !BASE_TOPICS.some(b => b.id === x.id)); if (!t) return "skip";
    A.tab("settings"); const d = document.querySelector("#packta"); if (!d) return "Feld für Lektionspaket fehlt";
    const n = TOPICS.length; typeIn("#packta", JSON.stringify([t])); clk("importpack"); await simSleep(300);
    return TOPICS.length !== n ? "Lektionspaket mit vorhandenem Thema ändert die Themenzahl" : "ok";
  }],
  ["Thema zurücksetzen", async day => {
    const t = learningTopics().find(x => x.id !== window.__simWeakId && S.topics[x.id].last >= 0.8); if (!t || S.active || SIM.resetDone) return "skip";
    A.tab("topics"); clk("topic", t.id); clk("resettopic", t.id); clk("topresetno");
    clk("resettopic", t.id); typeIn("#topconf", "ZURÜCKSETZEN"); clk("topresetgo", t.id);
    await simWait(() => S.topics[t.id].status === "new", 8000); SIM.resetDone = 1;
    return S.topics[t.id].status === "new" ? "ok" : "Thema nicht zurückgesetzt";
  }],
  ["Alles löschen und wiederherstellen", async () => {
    if (SIM.wipeDone || S.active) return "skip";
    const keep = JSON.stringify({ t: S.topics, c: Object.keys(S.cards).length });
    A.tab("settings"); clk("reset"); clk("resetno"); clk("reset"); typeIn("#delconf", "LÖSCHEN"); clk("resetgo");
    await simWait(() => !hasProgress(S), 8000); if (hasProgress(S)) return "Löschen hat nicht geklappt";
    await simSleep(1500); A.tab("settings"); clk("undodelete"); await simWait(() => hasProgress(S), 8000);
    SIM.wipeDone = 1;
    return JSON.stringify({ t: S.topics, c: Object.keys(S.cards).length }) === keep ? "ok" : "Wiederherstellen nicht vollständig";
  }],
  ["Sicherungsdatei freigeben", async () => {
    if (!NEED_FILE_PERM) return "skip";
    A.tab("today"); clk("fileperm"); await simSleep(500); SIM.fileOkDone = 1; return NEED_FILE_PERM ? "Freigabe hat nicht geklappt" : "ok";
  }],
  ["Freies Schreiben, Rollenspiel, fertige Aufgaben", async day => {
    const L = learningTopics().filter(x => (S.topics[x.id].last || 0) >= 0.8), t = L.find(x => fixedPool(x.id).length) || L[0]; if (!t || !aiReady() || S.active) return "skip";
    A.tab("topics"); clk("topic", t.id); clk("pwrite", t.id); await simWait(() => simHas("pwcheck") || /nicht erreichbar/.test(document.querySelector("#app").textContent), 30000);
    if (simHas("pwcheck")) { typeIn("#ans", "Minä ei ole kotona."); clk("pwcheck"); await simWait(() => !SESSION.busy && document.querySelector("#fb .fb, #fb .card"), 30000); }
    clk("topic", t.id); clk("pchat", t.id); await simWait(() => document.querySelector("#chatin") || /nicht erreichbar/.test(document.querySelector("#app").textContent), 30000);
    if (document.querySelector("#chatin")) { typeIn("#chatin", "Minä ei halua kahvia."); clk("pcsend"); await simWait(() => !SESSION.busy, 30000); clk("pcend"); await simWait(() => !SESSION || !SESSION.busy, 30000); }
    A.tab("topics"); clk("topic", t.id); if (simHas("pfixed", t.id)) { clk("pfixed", t.id); await simRound(day, false); }
    return "ok";
  }]
];

/* ---------- Einstufungstest (nur Deutsch-Trainer) ---------- */
async function placementRun(page) {
  return page.evaluate(async () => {
    const E = [];
    try {
      A.tab("today"); if (!simHas("pt")) { E.push("Einstufungstest: Knopf fehlt"); return E; }
      clk("pt");
      for (const part of PT) {
        clk("ptpart", part.id);
        for (const sec of part.sections) {
          document.querySelectorAll(`input.pgap[data-pid^="${sec.id}."]`).forEach((f, i) => { f.focus(); f.value = i % 4 ? "ist" : ""; f.dispatchEvent(new Event("input", { bubbles: true })); });
          document.querySelectorAll(`textarea[data-pid^="${sec.id}."]`).forEach(f => { f.focus(); f.value = "Ich habe gestern einen langen Satz geschrieben."; f.dispatchEvent(new Event("input", { bubbles: true })); });
          [...document.querySelectorAll('[data-act="ptrf"]')].filter(b => b.dataset.id.startsWith(sec.id + ".") && b.dataset.id.endsWith("|richtig")).forEach(b => b.click());
          const u = document.querySelector(`[data-act="ptu"][data-id^="${sec.id}."]`); if (u) { u.click(); }
          if (simHas("ptcheck", sec.id)) { clk("ptcheck", sec.id); await simWait(() => !document.querySelector(".pres.busy, .pres.wait.busy"), 30000); await simSleep(200); }
          const s = [...document.querySelectorAll('[data-act="ptself"]')].find(b => b.dataset.id.startsWith(sec.id + ".")); if (s) s.click();
        }
      }
      const exp = JSON.stringify({ type: "dt-placement", a: {}, c: {} });
      clk("pt"); typeIn("#ptimp", exp); clk("ptimport");
      clk("pt"); if (simHas("ptfinish")) { clk("ptfinish"); clk("ptfinish"); await simWait(() => S.placement.done, 30000); }
      if (!S.placement.done) E.push("Einstufungstest: Abschließen klappt nicht");
      clk("pt"); clk("ptreport");
      if (!/EINSTUFUNGSTEST/.test(buildReport())) E.push("Einstufungstest fehlt im Bericht");
    } catch (e) { E.push("Einstufungstest: Ausnahme " + (e && e.stack || e)); }
    return E.concat(simErr.splice(0));
  });
}

/* ---------- ein Tag ---------- */
const daily = [];
async function dayA(page, day, tourSteps) {
  return page.evaluate(async ([day, tour, NOMIX]) => {
    const out = { day, did: [], err: [], tour: {} };
    const E = m => out.err.push(m);
    const TOUR = tour.map(([n, src]) => [n, eval("(" + src + ")")]);
    try {
      A.tab("today");
      if (simHas("pasteimport")) { clk("pasteimport"); if (!document.querySelector("#impta")) E("„Schon gelernt? Sicherung einspielen“ öffnet das Einspielen nicht"); A.tab("today"); }
      // 0. pausierte Runde fortsetzen
      if (S.active) { if (!clk("resume")) openSession(); const r = await simRound(day); out.did.push("Fortsetzung " + Math.round(r.score * 100) + "%"); }
      // Tagesplan muss vorhanden sein, sobald gelernt wird
      A.tab("today");
      if ((learningTopics().length || Object.keys(S.cards).length) && !/Tagesplan/.test(document.querySelector("#app").textContent)) E("Heute: Tagesplan fehlt");
      // 1. fällige Themen (über den Tagesplan bzw. die Themenseite)
      for (const t of dueTopics().slice(0, 3)) {
        A.tab("topics"); clk("topic", t.id); clk("review", t.id);
        if (!SESSION) { E("Wiederholung startet nicht: " + t.id); continue; }
        if (SESSION.items.length > 8) E("Wiederholung mit " + SESSION.items.length + " Übungen");
        const r = await simRound(day); out.did.push(`Wdh ${t.id} ${Math.round(r.score * 100)}%`);
        if (r.stuck) E("Runde hängt: " + t.id);
      }
      // 2. Vokabeln über den Tagesplan
      A.tab("today");
      if (dueToday().length + newCardsAvail().length > 0) {
        clk("vocab"); if (SESSION && SESSION.kind === "vocab") { const v = await simVocab(day); out.did.push(`Vok ${v.n} (${v.again} nochmal)`); }
      }
      if (dueCards().length > (S.settings.maxReviews || 1e9) && dueToday().length > S.settings.maxReviews) E("Tageslimit überschritten: " + dueToday().length);
      // 3. neues Thema: Themenseite → Wörter → Übungen
      const nt = nextNewTopic();
      if (nt && S.daily.newTopics < S.settings.newTopicsPerDay && !(dueCards().length > (S.settings.maxReviews || 150))) {
        let g = 0; A.tab("topics"); clk("topic", nt.id);
        if (day >= 20 && !SIM.tvskip && !vocabReady(nt.id) && simHas("tvskip", nt.id)) { clk("tvskip", nt.id); SIM.tvskip = 1; out.did.push("Wörter übersprungen " + nt.id); }
        while (!vocabReady(nt.id) && g++ < 6) { A.topic(nt.id); clk("tvocab", nt.id); await simVocab(day, 300); }
        if (vocabReady(nt.id)) { A.topic(nt.id); clk("learn", nt.id); const r = await simRound(day); out.did.push(`Neu ${nt.id} ${Math.round(r.score * 100)}%`); }
        else E("Themenwörter nach 6 Runden nicht fertig: " + nt.id);
      }
      // 4. gesperrtes Thema mit schwacher Voraussetzung: „Zeigen, dass ich es kann“ (alle 3 Tage); Wörter vorab
      if (day % 3 === 0) {
        const lk = TOPICS.find(t => S.topics[t.id].status === "locked");
        if (lk) {
          const weak = lk.req.find(r => S.topics[r].status === "learning" && (S.topics[r].last || 0) < 0.8);
          if (weak && !S.active) { A.tab("topics"); clk("topic", lk.id); clk("unlock", weak); const r = await simRound(day); out.did.push(`Freischalt ${weak} ${Math.round(r.score * 100)}%`); }
          A.tab("topics"); A.topic(lk.id); if (simHas("prevocab", lk.id)) { clk("prevocab", lk.id); await simVocab(day, 60); out.did.push("Vorab " + lk.id); }
        }
      }
      // 5. Fehler-Training über den Tagesplan
      if (openErrors().length && day % 2 === 0 && !S.active) { const before = openErrors().length; A.tab("today"); clk("errtrain"); await simRound(day, false); out.did.push(`Fehler ${before}→${openErrors().length}`); }
      // 6. gemischte Wiederholung (Mehr üben), Langzeit-Check über den Tagesplan
      if (learningTopics().length >= 2 && day % 2 === 1 && !(NOMIX && day >= NOMIX) && !S.active) { A.tab("today"); clk("mix"); const r = await simRound(day, false); out.did.push(`Mix ${SESSION ? "?" : Math.round(r.score * 100) + "%"}`); if (S.mixDay !== todayKey()) E("Mix nicht als erledigt markiert"); }
      if (checkDue() && !S.active) { const ct = checkTopics().map(t => t.id); A.tab("today"); clk("longcheck"); await simRound(day, false); out.did.push("Langzeit-Check " + ct.join(",")); out.check = ct; if (checkDue()) E("Langzeit-Check bleibt fällig"); }
      // 7. Rundgang: die nächsten Schritte
      for (const [n, f] of TOUR) {
        try { const r = await f(day); out.tour[n] = r; if (r !== "ok" && r !== "skip") E("Rundgang „" + n + "“: " + r); } catch (e) { out.tour[n] = "Fehler"; E("Rundgang „" + n + "“: " + (e && e.stack || e)); }
        if (SESSION) { SESSION = null; }
        A.tab("today");
      }
      // 8. alle Ansichten (Absturz-Probe, 390 px)
      const rep = buildReport(); out.repLen = rep.length;
      for (const tb of ["today", "topics", "vocab", "progress", "settings"]) { clk("tab", tb); if (document.body.scrollWidth > 392) E("Ansicht " + tb + " breiter als 390 px"); }
      A.tab("today");
    } catch (e) { E("Ausnahme: " + (e && e.stack || e)); }
    out.err.push(...simErr.splice(0));
    await new Promise(r => setTimeout(r, 300));
    flushSave && flushSave();
    out.cov = __cov;
    out.snap = {
      learning: TOPICS.filter(t => S.topics[t.id].status === "learning").map(t => t.id).join(","),
      topics: Object.fromEntries(TOPICS.filter(t => S.topics[t.id].status === "learning").map(t => [t.id, { iv: S.topics[t.id].interval, last: S.topics[t.id].last, reps: S.topics[t.id].reps, due: Math.round((S.topics[t.id].due - Date.now()) / 86400000) }])),
      basics: basicsStatus(), lastRep: (S.reports[0] || {}).basicsSolid, nTopics: TOPICS.length,
      cards: Object.keys(S.cards).length, learned: learnedWords(), dueCards: dueCards().length, dueToday: dueToday().length, leech: weakCards().length,
      leechIds: weakCards().map(([id]) => id), errors: openErrors().length, weak: (S.weak || []).length,
      weakT: (S.weak || []).filter(x => x.g.includes(window.__simWeakId)).length, appErr: (S.appErr || []).map(x => x.w + ": " + x.m),
      gen: (S.genReview || []).length, unrev: genUnreviewed().length, approvedUnseen: learningTopics().reduce((a, t) => a + approvedGen(t.id).length, 0),
      exLog: Object.keys(S.exLog || {}).length, size: JSON.stringify(S).length, reviews: S.stats.reviews, streak: streakNow(), genOn: genUnlocked(),
      aiKinds: Object.keys(Object.values(S.aiStats || {}).reduce((a, d) => Object.assign(a, d.k || {}), {})),
      longCheck: S.longCheck, sync: document.querySelector("#sync") ? document.querySelector("#sync").className : ""
    };
    return out;
  }, [day, tourSteps.map(([n, f]) => [n, f.toString()]), +process.env.NOMIX || 0]);
}
async function dayB(page, day) {
  return page.evaluate(async day => {
    const out = { err: [] };
    try {
      A.tab("today");
      // jeden 10. Tag auch eine Themenrunde auf dem Handy (Abgleich von Themenergebnissen)
      if (day % 10 === 7 && !S.active) { const t = learningTopics()[0]; if (t) { A.tab("topics"); clk("topic", t.id); if (simHas("review", t.id)) clk("review", t.id); else clk("extra", t.id); await simRound(day); out.round = t.id; } }
      A.tab("today");
      if (dueToday().length + newCardsAvail().length > 0) { clk("vocab"); if (SESSION && SESSION.kind === "vocab") { const v = await simVocab(day, 60); out.n = v.n; } }
      await new Promise(r => setTimeout(r, 300)); flushSave && flushSave();
      await simWait(() => !PUSH_TIMER && !PUSHING, 8000); // so wie ein Mensch, der danach das Handy weglegt
      out.reviews = S.stats.reviews; out.cards = Object.keys(S.cards).length;
      out.diag = { updated: S.updated, dirty: DIRTY, remoteAt: CFG.remoteAt, syncedAt: CFG.syncedAt, sync: (document.querySelector("#sync") || {}).textContent };
      out.sample = Object.fromEntries(Object.entries(S.cards).filter(([, c]) => c.last && c.last > Date.now() - 3600e3).slice(0, 8).map(([id, c]) => [id, c.due]));
      out.cov = __cov;
    } catch (e) { out.err.push("B: " + (e && e.stack || e)); }
    out.err.push(...simErr.splice(0).map(x => "B: " + x));
    return out;
  }, day);
}

/* ---------- Ablauf ---------- */
const A = await makeDevice("PC"), B = await makeDevice("Handy");
const t0 = Date.now();
const COV = { act: {}, view: {}, ex: {}, chg: {}, ai: {} };
const addCov = c => { if (!c) return; for (const g of ["act", "view", "ex", "chg"]) for (const k in c[g] || {}) COV[g][k] = (COV[g][k] || 0) + c[g][k]; };
const tourDone = {};
let tourIdx = 0, bSample = null, bDiag = null, lastSnap = null;
if (PLACE) {
  await openDay(A, 0);
  const pe = await placementRun(A);
  pe.forEach(e => P("Tag 0: " + e));
  addCov(await A.evaluate(() => __cov));
  console.log("Einstufungstest durchlaufen" + (pe.length ? ` (${pe.length} Probleme)` : ""));
}
for (let day = 0; day < DAYS; day++) {
  simDayNow = day;
  if (inGap(day)) { if (day === GAP_FROM) console.log(`T${day} | Lernpause bis Tag ${GAP_TO}`); continue; }
  db.hang = day === 33;
  geminiDown = day === 50 || day === 51;
  // simulierter Claude: jede Woche Bericht → Urteile (jede 5. KI-Übung fehlerhaft); Tag 100: zwei Urteile geändert
  if (day % 7 === 6) {
    const un = await A.evaluate(() => genUnreviewed().map(x => x.ex.gid)).catch(() => []);
    un.forEach((g, i) => (verdicts[g] = i % 5 === 4 ? { ok: false, korrektur: "olen", grund: "Sim" } : { ok: true }));
  }
  if (day === 100) {
    const ok = Object.keys(verdicts).find(g => verdicts[g].ok), bad = Object.keys(verdicts).find(g => !verdicts[g].ok);
    if (ok) verdicts[ok] = { ok: false, korrektur: "olen", grund: "Sim: nachträglich" };
    if (bad) verdicts[bad] = { ok: true };
  }
  const flags = { noVoice: day === 44 || day === 89, filePrompt: day === 71 };
  let bRes = null;
  if (day % 5 === 2 && day > 0) {
    await openDay(B, day, flags);
    bRes = await dayB(B, day);
    bRes.err.forEach(e => P(`Tag ${day}: ${e}`));
    addCov(bRes.cov);
    if (bRes.sample && Object.keys(bRes.sample).length) { bSample = bRes.sample; bDiag = bRes.diag; }
  }
  await openDay(A, day, flags);
  if (!WEAK) WEAK = await A.evaluate(() => window.__simWeakId);
  if (bSample) {
    // Abgleich-Kontrolle: Karten, die das Handy eben geübt hat, müssen auf dem PC angekommen sein
    const got = await A.evaluate(s => Object.entries(s).filter(([id, due]) => !S.cards[id] || S.cards[id].due < due).map(([id]) => id), bSample);
    if (got.length) {
      const id = got[0], cloud = ((db.progress.get("u1") || {}).data || {}).cards || {};
      const pc = await A.evaluate(id => ({ card: S.cards[id], updated: S.updated, remoteAt: CFG.remoteAt, syncedAt: CFG.syncedAt }), id);
      P(`Tag ${day}: Abgleich verloren – Handy-Wiederholungen fehlen am PC: ${got.join(", ")} | ${id}: Handy due ${bSample[id]}, Cloud ${JSON.stringify(cloud[id])}, PC ${JSON.stringify(pc)}, Handy-Diag ${JSON.stringify(bDiag)}`);
    }
    bSample = null;
  }
  if (day === REVEAL_DAY) { const n = await A.evaluate(() => TOPICS.length); if (lastSnap && n <= lastSnap.nTopics) P(`Tag ${day}: neue Lektionen von Claude nicht geladen (${n} Themen)`); }
  if (day === 60) await A.evaluate(() => setTimeout(() => { throw new Error("Absturz-Probe Tag 60"); }, 0));
  if (flags.noVoice) {
    const nv = await A.evaluate(() => { A.tab("vocab"); const b = document.querySelector('[data-act="listen"]'); return { dis: !b || b.disabled, warn: CFG.voiceWarnDay }; });
    if (!nv.dis) P(`Tag ${day}: ohne Stimme ist das Diktat nicht ausgegraut`);
  }
  // Rundgang: pro Tag 2 Schritte, offene („skip“) bleiben in der Warteschlange; ab Tag 6, wenn es Inhalte gibt
  const steps = [];
  if (day >= 6) for (let i = 0; i < TOUR.length && steps.length < 2; i++) { const s = TOUR[(tourIdx + i) % TOUR.length]; steps.push(s); }
  tourIdx = (tourIdx + 2) % TOUR.length;
  const r = await dayA(A, day, steps);
  for (const [n, v] of Object.entries(r.tour || {})) if (v === "ok") tourDone[n] = (tourDone[n] || 0) + 1;
  addCov(r.cov);
  await A.waitForTimeout(db.hang ? 2500 : 1500); // Hochladen abwarten
  if (bRes) r.b = bRes.n;
  r.err.forEach(e => P(`Tag ${day}: ${e}`));
  [...A.errs.splice(0), ...B.errs.splice(0)].forEach(e => { if (!/Absturz-Probe|Sim-Ansichtsfehler/.test(e)) P(`Tag ${day}: JS-Fehler ${e}`); });
  const s = r.snap;
  if (GAP_TO && day === GAP_TO + 1) { if (s.dueToday > 150 && s.dueToday > s.dueCards) P(`Tag ${day}: nach der Pause mehr als das Tageslimit fällig`); console.log(`   nach der Pause: ${s.dueCards} Karten überfällig, heute ${s.dueToday}`); }
  s.aiKinds.forEach(k => (COV.ai[k] = 1));
  delete r.cov; daily.push(r); lastSnap = s;
  console.log(`T${String(day).padStart(2)} | ${r.did.join("; ").slice(0, 150)}${r.b ? " | Handy " + r.b : ""} | lernt ${s.learning ? s.learning.split(",").length : 0} Themen, Karten fällig ${s.dueCards}, ⚠${s.leech}, Fehler ${s.errors}, KI ${s.unrev}u/${s.approvedUnseen}✓, ${Math.round(s.size / 1024)} KB${Object.keys(r.tour).length ? " | Rundgang: " + Object.entries(r.tour).map(([n, v]) => n.split(/[ ,:]/)[0] + "=" + v).join(" ") : ""}`);
}

/* ---------- Abdeckungs-Kontrolle ---------- */
const need = await A.evaluate(() => ({
  act: Object.keys(A),
  view: Object.keys(window).filter(k => /^render[A-Z]/.test(k) && typeof window[k] === "function"),
  ex: [...new Set(TOPICS.flatMap(t => t.ex.map(e => e.t)))],
  allEx: Object.keys(FMT),
  ai: Object.keys(AI_KINDS)
}));
const startSrc = fs.readFileSync(path.join(ROOT, "js/start.js"), "utf8");
const chgIds = [...(startSrc.match(/document\.addEventListener\("change"[\s\S]*?\n\}\);/) || [""])[0].matchAll(/e\.target\.id === "([a-z]+)"/g)].map(m => m[1]);
const miss = [
  ...need.act.filter(k => !COV.act[k] && !EXEMPT[k]).map(k => "Aktion " + k),
  ...need.view.filter(k => !COV.view[k] && !EXEMPT[k]).map(k => "Ansicht " + k),
  ...need.ex.filter(k => !COV.ex[k]).map(k => "Übungsart " + k),
  ...need.ai.filter(k => !COV.ai[k] && !EXEMPT["KI:" + k]).map(k => "KI-Art " + k),
  ...chgIds.filter(k => !COV.chg[k]).map(k => "Einstellung " + k)
];
if (miss.length) P("Abdeckung: nicht geprüft – " + miss.join(", "));
const exNoContent = need.allEx.filter(k => !need.ex.includes(k));
const tourMiss = TOUR.map(([n]) => n).filter(n => !tourDone[n]);
if (tourMiss.length) P("Rundgang nie erfolgreich: " + tourMiss.join(" | "));
console.log(`\nAbdeckung: ${need.act.length - need.act.filter(k => !COV.act[k]).length}/${need.act.length} Aktionen, ${need.view.filter(k => COV.view[k]).length}/${need.view.length} Ansichten, ${need.ex.filter(k => COV.ex[k]).length}/${need.ex.length} Übungsarten, ${need.ai.filter(k => COV.ai[k]).length}/${need.ai.length} KI-Arten, ${chgIds.filter(k => COV.chg[k]).length}/${chgIds.length} Einstellungen` +
  (Object.keys(EXEMPT).length ? `\nAusnahmen: ${Object.entries(EXEMPT).map(([k, v]) => k + " (" + v + ")").filter((x, i, a) => a.indexOf(x) === i).join("; ")}` : "") +
  (exNoContent.length ? `\nÜbungsarten ohne Inhalte in dieser App (nur in pruefen.mjs geprüft): ${exNoContent.join(", ")}` : "") +
  `\nRundgang: ${Object.entries(tourDone).map(([n, v]) => n + " ×" + v).join(" | ")}`);

const secs = Math.round((Date.now() - t0) / 1000);
const OUTF = process.env.OUT || path.join(os.tmpdir(), "simulation-ergebnis.json");
fs.writeFileSync(OUTF, JSON.stringify({ daily, problems, gemCalls, verdicts: Object.keys(verdicts).length, cov: COV, need, tourDone, secs }, null, 1));
console.log("\nErgebnis: " + OUTF + "\nProbleme:", problems.length, "| Gemini-Aufrufe:", JSON.stringify(gemCalls), "| Dauer", secs, "s");
await browser.close(); server.close();
