// Langzeit-Simulation der App (beide Apps der Lern-Engine): node tools/simulation.mjs
// Simuliert DAYS Tage (Standard 90) Lernen mit echten Inhalten, verschobener Uhr, nachgebautem Gemini, nachgebautem
// Claude (Urteile zu KI-Übungen) und zwei Geräten (PC täglich, Handy jeden 5. Tag) mit nachgebauter Supabase.
// Bedient wird die App wie von einem Menschen: über die Knöpfe (data-act), nicht über interne Funktionen.
// Optionen (Umgebungsvariablen): DAYS=90, WEAK_TOPIC=<Themen-ID> (Standard: 7. Thema), NOMIX=<Tag> (ab diesem Tag keine
// gemischte Wiederholung → Langzeit-Check wird geprüft), GAP=<von>-<bis> (Lernpause, Standard 120-133 bei ≥ 150 Tagen),
// OUT=<Datei> (Ergebnis als JSON, Standard: Temp-Ordner), APP_ROOT=<Ordner der anderen App>, SC_FROM=<Tag> (Szenarien
// W10–W13 frühestens ab diesem Tag, Standard 8), BAD_DAY=<Tag> (manipulierte lektionen.json, Standard 11).
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
//  Seit S-1008 (Szenarien laufen am ersten passenden Tag ab SC_FROM, Standard 8; jedes muss einmal geklappt haben):
//  W10 Freischaltung (E-1008-1/-4/-10): Freischalt-Runde über „Heute“ (muss erscheinen, wenn kein neues Thema frei ist)
//      oder die Themenseite; „Wörter vorab lernen“ erst nach 3 Fehlversuchen; danach bleibt das Thema gesperrt (kein
//      „Weiter zu den Übungen“, Lernen startet nicht); vorab gelernte Wörter nicht zusätzlich in der normalen Runde;
//      heute gelernte Wörter höchstens 3 Tage Abstand
//  W11 Voraussetzung mit langem Abstand bei 75 % + „Einfach“ → spätestens nach 7 Tagen wieder (E-1008-5); dazu nach
//      jeder bewerteten Runde unter 80 %, auf die ein gesperrtes Thema wartet, dieselbe Prüfung
//  W12 KI-Ausfall mitten in einer Freischalt-Runde (E-1008-2): „Meine Antwort war richtig“ zählt richtig und steht im
//      KI-Protokoll, „Falsch“ zählt falsch und kommt wieder; Ergebnis und Fehlversuche stimmen. An Ausfalltagen (W6)
//      bedient die Simulation dieselbe Ansicht („Falsch“ bei absichtlich falschen Antworten)
//  W13 Schwächen-Vorzug (E-1008-22), einmal ab SC_FROM und einmal nach der Lernpause: 2 KI-Treffer → spätestens
//      übermorgen fällig, Grund auf Themenseite/Fortschritt/Bericht, auf dem Handy gleich, Schalter aus/an, höchstens 3
//      Themen, unbekannte/gesperrte IDs ignoriert, nach der nächsten Runde wieder normaler Plan
//  W14 Einzelregeln: Endung mitten im Wort streng (E-1008-3), ganze Übersetzung ohne Pünktchen „fast richtig“, zweite
//      Wortstellung richtig (E-1008-6), Lektionen nie in Lernstand/Cloud/Tagesständen/Sicherungen, aber in der
//      Notfall-Version (E-1008-7), fremdes Lektionspaket und an Tag BAD_DAY (11) eine manipulierte lektionen.json
//      (E-1008-12), automatische Gesamtanalyse höchstens alle 3 Tage und erst nach 5 Runden (E-1008-13),
//      Deutsch-Trainer: Groß-/Kleinschreibung im Einstufungstest (E-1008-9)
//  Auswertung: Themen-Abdeckung (erreicht/gelernt/≥ 80 %), Speichergröße je Tag, KI-Aufrufe je Tag, gelernte Themen
//  gehen nie verloren (außer „Thema zurücksetzen“)
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import os from "node:os";
import vm from "node:vm";

// APP_ROOT=<Ordner>: andere App derselben Engine simulieren (z. B. ../deutsch-trainer) – mit dieser Fassung der Simulation
const ROOT = process.env.APP_ROOT ? path.resolve(process.env.APP_ROOT) : path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const APPX = vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8") + "\n;APP");
const KEYID = APPX.id;
const PLACE = !!(APPX.features && APPX.features.placement);
const DAYS = +(process.env.DAYS || 90);
const DAY = 86400000;
const [GAP_FROM, GAP_TO] = (process.env.GAP || (DAYS >= 150 ? "120-133" : "")).split("-").map(Number);
const inGap = d => GAP_FROM >= 0 && GAP_TO >= GAP_FROM && d >= GAP_FROM && d <= GAP_TO;
const REVEAL_DAY = 25;
const SC_FROM = +(process.env.SC_FROM || 8), BAD_DAY = +(process.env.BAD_DAY || 11);
/* W13 zweimal: ab SC_FROM und nach der Lernpause (bzw. nach 60 % der Tage) */
const WEAK2_FROM = DAYS >= 60 ? Math.max(GAP_TO >= 0 ? GAP_TO + 2 : 0, Math.round(DAYS * 0.6)) : Infinity;
const BASEX = (() => { try { return vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8") + "\n" + fs.readFileSync(path.join(ROOT, "js/inhalte.js"), "utf8") + "\n;BASE_TOPICS"); } catch (e) { return []; } })();
let LESSONS = [];
try { LESSONS = JSON.parse(fs.readFileSync(path.join(ROOT, "lektionen/lektionen.json"), "utf8")); } catch (e) {}
/* Textstellen aus der Theorie einiger Lektionen (nur Buchstaben und Leerzeichen): dürfen nie im Lernstand, in der Cloud,
   in Tagesständen oder Sicherungsdateien stehen, wohl aber in der Notfall-Version (E-1008-7). Nicht die ersten Lektionen –
   die erste spielt der Rundgang als Lektionspaket ein, die ersten drei manipuliert BAD_DAY. */
const snipOf = t => { const m = String((t && t.th) || "").split(/<[^>]*>/).flatMap(x => x.match(/[A-Za-zÄÖÜäöüß ]{34,}/g) || []); const s = m.sort((a, b) => b.length - a.length)[0]; return s ? s.trim().slice(0, 30) : null; };
const SNIPS = [10, 20, 30].map(i => snipOf(LESSONS[i])).filter(s => s && s.length >= 25);
const log = [], problems = [];
const P = m => { problems.push(m); console.log("✗ " + m); };

/* Ausnahmen der Abdeckungs-Kontrolle – nur mit Begründung */
const EXEMPT = {
  reload: "„Jetzt neu laden“ erscheint nur bei einer neuen Version; das Neuladen selbst passiert jeden Tag (openDay)"
};
if (!PLACE) Object.assign(EXEMPT, Object.fromEntries(["pt", "ptpart", "ptu", "ptcheck", "ptrf", "ptself", "ptfinish", "ptreport", "ptimport", "renderPlacement", "KI:einstufung"].map(k => [k, "Einstufungstest gibt es nur im Deutsch-Trainer"])));

/* ---------- Server: App (echte Inhalte) + Supabase-Nachbau ---------- */
const db = { progress: new Map(), snaps: new Map(), hang: false };
const snapLog = []; // jeder hochgeladene Tagesstand: Simulationstag, Schlüssel, Wiederholungen
const pgTime = ms => new Date(ms).toISOString().replace("Z", "+00:00");
let verdicts = {}, simDayNow = 0, lessonBad = false;
/* W14 (E-1008-12): manipulierte lektionen.json – Skript in der Theorie, ungültige Übung, gekürztes Thema, Grundthema überschreiben */
const BAD_IDS = LESSONS.slice(0, 3).map(t => t.id);
function badLessons(L) {
  const M = JSON.parse(JSON.stringify(L)), f = id => M.find(t => t.id === id);
  const [a, b, c] = BAD_IDS.map(f);
  if (a) a.th += '<p>SIMBAD</p><img src="x" onerror="window.__xss=1"><script>window.__xss=2</script><a href="javascript:window.__xss=3" onclick="window.__xss=4">x</a><svg onload="window.__xss=5"></svg>';
  if (b) b.ex[1] = { t: "zz", q: "kaputt" };
  if (c) c.ex = c.ex.slice(0, -1);
  if (BASEX[0]) M.push({ ...JSON.parse(JSON.stringify(BASEX[0])), title: "Übernommen?" });
  return M;
}
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname === "/lektionen/ki-pruefung.json") { res.writeHead(200, { "Content-Type": "application/json" }); return res.end(JSON.stringify(verdicts)); }
  if (u.pathname === "/lektionen/lektionen.json" && (simDayNow < REVEAL_DAY || lessonBad)) {
    // W8: die letzten 2 Themen kommen erst später (wie neue Lektionen von Claude); W14: manipulierte Fassung an BAD_DAY
    let L = LESSONS.slice();
    if (simDayNow < REVEAL_DAY && L.length > 4) L = L.slice(0, -2);
    if (lessonBad) L = badLessons(L);
    res.writeHead(200, { "Content-Type": "application/json" }); return res.end(JSON.stringify(L));
  }
  if (u.pathname.startsWith("/sb/")) {
    if (db.hang) return;
    let body = ""; req.on("data", c => (body += c)); req.on("end", () => {
      const send = (code, obj) => { res.writeHead(code, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }); res.end(obj === undefined ? "" : JSON.stringify(obj)); };
      if (u.pathname.startsWith("/sb/auth/")) return send(200, { access_token: "t", refresh_token: "r", expires_in: 3600, user: { id: "u1", email: "sim@example.invalid" } });
      if (u.pathname === "/sb/rest/v1/snapshots") {
        if (req.method === "POST") { try { const b = JSON.parse(body); db.snaps.set(b.day, b.data); snapLog.push({ simDay: simDayNow, key: b.day, reviews: ((b.data || {}).stats || {}).reviews }); } catch (e) {} return send(201); }
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
let geminiDown = false, gemCalls = {}, genCounter = 0, caseRuleSeen = false;
const gemDay = {};
/* vom Browser aus steuerbar (window.simCtl): Gemini mitten in einer Runde ausfallen lassen (W12), Themen, die die KI bei
   Fehlern in freien Antworten nennt (W13; sonst W3: WEAK_TOPIC und eine unbekannte ID) */
const ctl = { gemDown: false, weak: null };
const wt = () => (ctl.weak ? ctl.weak.slice() : [WEAK, "t99"]);
function gemini(body) {
  const k = (n) => { gemCalls[n] = (gemCalls[n] || 0) + 1; gemDay[simDayNow] = (gemDay[simDayNow] || 0) + 1; };
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
  if (has("Korrigiere den Text wie")) { k("schreiben-korrektur"); return { correct: false, corrected: "En ole kotona.", errors: [{ wrong: "Minä ei", right: "En", why: "Verneinung" }], feedback: "Verneinung beachten.", topics: wt() }; }
  if (has("kurze Schreibaufgabe")) { k("schreiben-aufgabe"); return { task: "Schreib, dass du nicht zu Hause bist.", words: ["koti"], sample: "En ole kotona." }; }
  if (has("Prüfe streng als")) { k("schreiben-gegenpruefung"); return { ok: true, taskClear: true, fixed: "" }; }
  if (has("Starte ein kurzes Rollenspiel")) { k("rollenspiel-start"); return { scene: "Im Café " + Math.random().toString(36).slice(2, 5), role: "Kellner", goal: "bestellen", opener: "Hei! Mitä saisi olla?", opener_tr: "Hallo!" }; }
  if (has("Neue Antwort von")) { k("rollenspiel-zug"); return { ok: false, fix: "En halua kahvia.", note: "Verneinung", reply: "Selvä.", reply_tr: "OK", end: false, topics: wt() }; }
  if (has("Ziel erreicht? Was war gut?")) { k("rollenspiel-ende"); return { goal: true, summary: "Gut.", tips: ["Verneinung"] }; }
  if (has("Bewerte jede markierte ZEILE")) { k("dialog"); return { lines: [{ n: 1, correct: false, correction: "En ole." }], feedback: "Fehler.", topics: wt() }; }
  if (has("Aufgabentyp: Schreibaufgabe")) { k("schreibaufgabe"); return { correct: false, feedback: "Fehler", correction: "En ole.", topics: wt() }; }
  if (has("Vokabelkarte")) { k("vokabel"); return { correct: false, feedback: "Nein." }; }
  if (has("Grundform (Wörterbuchform)")) { k("wort"); return { de: "Sim-Bedeutung", base: "sim", note: "" }; }
  if (has("höchstens 1 kurzer Satz")) { k("eigenes-wort"); return { fi: "simsana", de: "Simwort", note: "" }; }
  if (has('\\"results\\":[')) {
    k("einstufung-pruefung");
    if (has("Groß-/Kleinschreibung")) caseRuleSeen = true; // E-1008-9: die KI bekommt die Regel
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
    if (geminiDown || ctl.gemDown) return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: { message: "overloaded" } }) });
    const text = JSON.stringify(gemini(route.request().postData() || ""));
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }], usageMetadata: { promptTokenCount: 500, candidatesTokenCount: 80, thoughtsTokenCount: 10 } }) });
  });
  await ctx.exposeFunction("simCtl", o => { Object.assign(ctl, o || {}); return true; });
  const page = await ctx.newPage();
  page.errs = [];
  page.on("pageerror", e => page.errs.push(e.message));
  page.on("dialog", d => d.dismiss());
  // Heruntergeladene Dateien prüfen (E-1008-7): Sicherungen ohne Lektionen, Notfall-Version mit eingebetteten Lektionen
  page.on("download", async d => {
    const file = d.suggestedFilename(), day = simDayNow;
    try {
      const p = await d.path(), txt = p ? fs.readFileSync(p, "utf8") : "";
      downloads.push({ day, dev: name, file, html: /\.html?$/i.test(file), size: txt.length, emb: /OFFLINE_LESSONS/.test(txt), snips: SNIPS.filter(s => txt.includes(s)).length });
    } catch (e) { downloads.push({ day, dev: name, file, err: String((e && e.message) || e) }); }
    d.delete().catch(() => {});
  });
  page.name = name;
  return page;
}
const downloads = [];

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
  /* Merker der Simulation (einmalige Schritte, Szenario-Zustand) überleben das tägliche Neuladen – sonst liefen „einmal“-
     Schritte (z. B. Wörter überspringen) jeden Tag. Liegt unter __simState, nicht im Speicher der App. */
  if (!window.SIM) { try { window.SIM = JSON.parse(localStorage.getItem("__simState")) || {}; } catch (e) { window.SIM = {}; } }
  window.simSave = () => { try { localStorage.setItem("__simState", JSON.stringify(SIM)); } catch (e) {} };
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
  /* Gesamtanalysen mitschreiben (E-1008-13): Zeitpunkt, automatisch oder von Hand, Runden seit der letzten */
  window.__simGlob = window.__simGlob || [];
  if (typeof runGlobal === "function" && !runGlobal.__sim) {
    const f = runGlobal;
    window.runGlobal = async function (silent) {
      const before = S.lastGlobal, since = S.sinceGlobal;
      const r = await f.apply(this, arguments);
      if (S.lastGlobal && S.lastGlobal !== before) __simGlob.push({ t: S.lastGlobal, auto: !!silent, since, prev: before || 0 });
      return r;
    };
    window.runGlobal.__sim = 1;
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
  window.fillModel = (ex, alt = 0) => {
    if (ex.t === "mc") { clk("mc", SESSION.cur.opts.findIndex(o => o.ok)); return true; }
    if (ex.t === "tab") { const g = tabGaps(ex); document.querySelectorAll(".tcell").forEach((inp, k) => (inp.value = g[k][0])); }
    else if (ex.t === "ord") {
      const used = new Set(); let rest = norm(ordSols(ex)[alt] || ordSols(ex)[0]), g = 0;
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
  /* Einzelregeln (W14), je Lauf wenige Male in gewöhnlichen Runden: statt der Musterlösung eine bestimmte Eingabe mit
     erwartetem Ergebnis. Nur bei Aufgaben, die die Simulation ohnehin richtig beantworten wollte. */
  const deUml = s => String(s).replace(/ä/g, "a").replace(/ö/g, "o").replace(/Ä/g, "A").replace(/Ö/g, "O");
  const ordFormable = (ex, i) => {
    const w = s => norm(s).split(" ").filter(Boolean).sort().join(" ");
    return SESSION.cur && SESSION.cur.chips && w(SESSION.cur.chips.join(" ")) === w(ordSols(ex)[i] || "");
  };
  window.simRule = (ex, info) => {
    if (info.retry || !info.ok || SESSION.mode === "gen" || ex.gid) return null;
    const R = (SIM.rules = SIM.rules || {});
    // E-1008-3: Lücke mitten im Wort (Endung) wird streng geprüft – „a“ statt „ä“ ist falsch
    if ((R.strict || 0) < 2 && ex.t === "gap" && /\p{L}___|___\p{L}/u.test(ex.q || "") && /[äö]/i.test(ex.a[0]) && !ex.a.some(a => norm(a) === norm(deUml(ex.a[0])))) {
      R.strict = (R.strict || 0) + 1;
      return { text: deUml(ex.a[0]), expect: false, why: `Endung mitten im Wort: „${deUml(ex.a[0])}“ statt „${ex.a[0]}“ als richtig gewertet (E-1008-3)` };
    }
    // ganze Übersetzung in die Lernsprache: fehlende Pünktchen zählen als „fast richtig“ (nur wenn die Sprache das erlaubt)
    if ((R.loose || 0) < 2 && ex.t === "tr" && ex.dir === "de" && !ex.s && !/vokalharmonie/i.test(ex.h || "") && /[äö]/i.test(ex.a[0]) && !ex.a.some(a => norm(a) === norm(deUml(ex.a[0]))) && (SP.loose || []).some(p => p[0] === "ä")) {
      R.loose = (R.loose || 0) + 1;
      return { text: deUml(ex.a[0]), expect: true, note: /Fast perfekt/, why: `Übersetzung ohne Pünktchen („${deUml(ex.a[0])}“) nicht als fast richtig gewertet` };
    }
    // E-1008-6: eine zweite richtige Wortstellung zählt als richtig
    if ((R.ordAlt || 0) < 3 && ex.t === "ord" && ordSols(ex).length > 1 && ordFormable(ex, 1)) {
      R.ordAlt = (R.ordAlt || 0) + 1;
      return { alt: 1, expect: true, why: `zweite richtige Wortstellung „${ordSols(ex)[1]}“ als falsch gewertet (E-1008-6)` };
    }
    return null;
  };
  /* eine Übungsrunde über die Knöpfe spielen; gibt Stats zurück. opt.stopAfter: nach n Aufgaben pausieren;
     opt.answer(ex, info): eigene Antwort ("ok" | "wrong" | { text | alt, expect, self, offline, note, why }); opt.rate: Bewertung */
  window.simRound = async (simDay, rate = true, opt = {}) => {
    const st = { n: 0, wrong: 0, first: 0, firstOk: 0, self: [], sid: SESSION && SESSION.id, mode: SESSION && SESSION.mode, fresh: !!(SESSION && SESSION.idx === 0 && !SESSION.results.length) };
    let guard = 0;
    while (SESSION && SESSION.kind === "topic" && SESSION.idx < SESSION.items.length && guard++ < 200) {
      if (opt.stopAfter && st.n >= opt.stopAfter) { clk("abort", null, "Pause"); st.paused = true; return st; }
      const ex = SESSION.items[SESSION.idx], src = srcOf(S.active, SESSION.idx), retry = !!(S.active && S.active.rt[SESSION.idx]);
      __cov.ex[ex.t] = (__cov.ex[ex.t] || 0) + 1;
      let ok = retry ? Math.random() < 0.95 || guard > 120 : Math.random() < simP(src.tid, simDay);
      st.n++;
      if (opt.extras && st.n === 1) await opt.extras(ex);
      if (!SIM.vhintUsed && simHas("vhint")) { clk("vhint"); SIM.vhintUsed = 1; } // Vokabelhilfe (nur Übersetzung in die Lernsprache)
      const info = { retry, ok, n: st.n, first: st.first };
      let plan = opt.answer ? await opt.answer(ex, info) : null;
      if (plan === "ok" || plan === "wrong") { ok = plan === "ok"; plan = null; }
      else if (!plan && !opt.answer) plan = simRule(ex, info);
      if (plan && plan.expect != null) ok = plan.expect;
      const nRes = SESSION.results.length, nItems = SESSION.items.length, nErr = (S.errors || []).length;
      if (plan && plan.text != null) { typeIn("#ans", plan.text); clk("check"); }
      else if (ok) { if (!fillModel(ex, plan && plan.alt)) clk("check"); }
      else simWrong(ex);
      if (!ok) st.wrong++;
      // Antwort abwarten: „Weiter“ – oder, wenn die KI nicht erreichbar ist, „Meine Antwort war richtig“/„Falsch“ (E-1008-2)
      if (!(await waitFor(() => !SESSION || document.querySelector("#nextbtn, #selfokbtn"), 45000))) { simErr.push("Antwort wird nicht ausgewertet: " + ex.t); clk("dunno"); await waitFor(() => !SESSION || document.querySelector("#nextbtn"), 5000); }
      if (!SESSION) break;
      let selfAsked = false;
      if (document.querySelector("#selfokbtn")) {
        selfAsked = true;
        const self = plan && plan.self != null ? plan.self : ok;
        st.self.push({ t: ex.t, self });
        clk(self ? "selfok" : "selfno");
        await waitFor(() => !SESSION || document.querySelector("#nextbtn"), 5000);
        if (!SESSION) break;
      }
      const res = SESSION.results.length > nRes ? SESSION.results[SESSION.results.length - 1] : null;
      if (!retry && res) { st.first++; if (res.correct) st.firstOk++; }
      if (plan && plan.offline && !selfAsked) simErr.push(`KI-Ausfall (${ex.t}): keine Auswahl „Meine Antwort war richtig“/„Falsch“ (E-1008-2)`);
      if (plan && plan.expect != null && res && res.correct !== plan.expect) simErr.push(plan.why + ` [${ex.t}: ${promptText(ex).slice(0, 60)}]`);
      if (plan && plan.note && res && !plan.note.test((document.querySelector("#fb") || {}).textContent || "")) simErr.push(plan.why + " (Hinweis fehlt)");
      if (plan && plan.offline && selfAsked && res) {
        // „Meine Antwort war richtig“: zählt richtig, kein Fehler, im KI-Protokoll als selbst gewertet; „Falsch“: Fehler und kommt wieder
        const a0 = (S.aiAudit || [])[0] || {};
        if (plan.self) {
          if (a0.m !== "selbst gewertet" || a0.ok !== true) simErr.push("KI-Ausfall: „Meine Antwort war richtig“ fehlt im KI-Protokoll");
          if ((S.errors || []).length > nErr) simErr.push("KI-Ausfall: selbst als richtig gewertete Antwort steht in der Fehlerliste");
          if (!/Selbst als richtig gewertet/.test(document.querySelector("#fb").textContent)) simErr.push("KI-Ausfall: Hinweis „Selbst als richtig gewertet“ fehlt");
        } else {
          if (!((S.errors || [])[0] && S.errors[0].q === promptText(ex))) simErr.push("KI-Ausfall: „Falsch“ landet nicht in der Fehlerliste");
          if (!retry && SESSION.items.length !== nItems + 1) simErr.push("KI-Ausfall: „Falsch“ kommt in der Runde nicht wieder");
        }
      }
      if (opt.after) await opt.after(ex, res, plan);
      if (opt.afterCheck && st.n === 1) await opt.afterCheck(ex);
      if (!clk("next")) break;
    }
    if (guard >= 200) st.stuck = true;
    if (SESSION && SESSION.kind === "topic" && Number.isFinite(SESSION.score)) {
      st.appScore = SESSION.score;
      // Ergebnis = Anteil beim ersten Versuch richtig (auch mit selbst gewerteten Antworten)
      if (st.fresh && st.first && Math.abs(SESSION.score - st.firstOk / st.first) > 0.001) simErr.push(`Ergebnis ${Math.round(SESSION.score * 100)} % passt nicht zu ${st.firstOk}/${st.first} beim ersten Versuch richtig (${st.mode} ${st.sid})`);
    }
    if (rate && document.querySelector("#ratebox")) {
      const sc = SESSION ? SESSION.score : 1, s0 = S.topics[st.sid] || {};
      const k = opt.rate || (sc >= 0.9 ? "easy" : sc >= 0.75 ? "good" : sc >= 0.5 ? "hard" : "again");
      st.rated = k; st.ivBefore = s0.interval; st.failsBefore = s0.unlockFails || 0;
      clk("rate", k);
      if (!(await waitFor(() => !SESSION, 45000))) simErr.push("Bewertung schließt die Runde nicht ab");
      const s = S.topics[st.sid];
      if (s && sc < 0.8 && TOPICS.some(t => t.req.includes(st.sid) && S.topics[t.id].status === "locked")) {
        // E-1008-5: unter 80 % und ein gesperrtes Thema wartet → spätestens nach 7 Tagen wieder (Plan und KI-Termin)
        st.capDays = (s.due - startOfDay()) / 86400000;
        SIM.capChecks = (SIM.capChecks || 0) + 1;
        if (st.capDays > 7.1) simErr.push(`Voraussetzung ${st.sid} mit ${Math.round(sc * 100)} % blockiert ein gesperrtes Thema, kommt aber erst in ${st.capDays.toFixed(1)} Tagen wieder (höchstens 7, E-1008-5)`);
      }
      if (s && st.mode === "unlock") {
        const exp = sc >= 0.8 ? 0 : st.failsBefore + 1;
        if ((s.unlockFails || 0) !== exp) simErr.push(`Freischalt-Runde ${st.sid} ${Math.round(sc * 100)} %: Fehlversuche ${s.unlockFails || 0} statt ${exp}`);
      }
    }
    st.score = st.first ? st.firstOk / st.first : st.n ? 1 - st.wrong / st.n : 1;
    return st;
  };
  /* Vokabelrunde über die Knöpfe (Aufdecken, Bewerten, einmal „↶ Zurück“, ab und zu fragen) */
  window.simVocab = async (simDay, limitN, opt = {}) => {
    let n = 0, again = 0, undone = !opt.undo;
    // E-1008-10: Wörter eines Themas, dessen „Wörter lernen“ noch aussteht, kommen nicht zusätzlich als neue Karten
    if (SESSION && SESSION.kind === "vocab" && !SESSION.topicVocab && SESSION.extra !== "practice" && !SESSION.leech) {
      const bad = SESSION.queue.filter(id => { const c = S.cards[id], p = cardParse(id), s = p && p.tid !== "own" ? S.topics[p.tid] : null; return c && c.isNew && s && s.status !== "learning" && !s.vocabDone; });
      if (bad.length) simErr.push(`Vokabelrunde enthält ${bad.length} neue Wörter eines Themas vor dessen „Wörter lernen“ (E-1008-10): ${bad.slice(0, 4).join(", ")}`);
    }
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

  /* ---------- Szenarien (S-1008) ---------- */
  const appText = () => (document.querySelector("#app").textContent || "").replace(/\s+/g, " ");
  const blocksLocked = id => TOPICS.some(t => t.req.includes(id) && S.topics[t.id].status === "locked");
  /* E-1008-4: „Heute“ bietet die Freischalt-Runde als nächsten Schritt an, wenn sonst nichts ansteht und kein neues Thema
     frei ist (Reihenfolge wie im Tagesplan). Prüft Anzeige gegen Erwartung; gibt den Knopf zurück. */
  window.simHeuteUnlock = () => {
    A.tab("today");
    const b = document.querySelector('#app .next [data-act="unlock"]'), bl = blockingReq();
    const pt = typeof ptOn === "function" && ptOn() && (!S.placement.done || !TOPICS.length);
    const expect = !S.active && !pt && !dueTopics().length && dueToday().length + newCardsAvail().length === 0 && !openErrors().length && !nextNewTopic() && bl;
    if (expect && !b) simErr.push(`Heute bietet die Freischalt-Runde nicht an (E-1008-4): ${bl.r.id} für ${bl.t.id}`);
    if (b && (!bl || b.dataset.id !== bl.r.id || S.topics[b.dataset.id].status !== "learning")) simErr.push(`Heute bietet eine unpassende Freischalt-Runde an: ${b.dataset.id}`);
    return b;
  };
  /* W12: Gemini fällt nach der 2. Aufgabe aus; die nächste geeignete Antwort wird selbst als richtig gewertet, die
     übernächste als falsch; danach ist Gemini wieder da */
  window.simOfflinePlan = () => {
    const P = { done: 0, armed: false };
    P.answer = async (ex, info) => {
      if (info.retry || P.done >= 2) return null;
      if (!P.armed && info.first >= 2) { P.armed = true; await simCtl({ gemDown: true }); }
      if (!P.armed || !(ex.t === "tr" || ex.t === "sch" || (ex.t === "gap" && String(ex.a[0]).length >= 4))) return null;
      P.done++;
      const self = P.done === 1, a = String(ex.a[0]);
      return { text: ex.t === "gap" ? a.slice(0, -1) + (/x$/i.test(a) ? "y" : "x") : a + " kyllä", self, expect: self, offline: true, why: `KI-Ausfall: selbst als ${self ? "richtig" : "falsch"} gewertet, aber anders gezählt (E-1008-2)` };
    };
    P.after = async () => { if (P.done >= 2 && P.armed) { P.armed = false; await simCtl({ gemDown: false }); } };
    return P;
  };
  /* 4. Freischaltung (W10/W12): über „Heute“, sonst alle 3 Tage über die Themenseite */
  window.simUnlockStep = async (day, pend, out) => {
    const r = {};
    const b = simHeuteUnlock(), bl = blockingReq();
    if (!bl || S.active || (!b && day % 3 !== 0)) return r;
    const via = b ? "Heute" : "Themenseite";
    if (b) clk("unlock", bl.r.id); else { A.tab("topics"); clk("topic", bl.t.id); clk("unlock", bl.r.id); }
    if (!SESSION || SESSION.mode !== "unlock") { simErr.push(`Freischalt-Runde startet nicht (${via}): ${bl.r.id}`); SESSION = null; return r; }
    if (!/Freischalt-Runde/.test(appText())) simErr.push("Freischalt-Runde zeigt ihren Titel nicht");
    const off = pend.w12 && day >= pend.from && aiReady() ? simOfflinePlan() : null;
    let st;
    try { st = await simRound(day, true, off ? { answer: off.answer, after: off.after } : {}); }
    finally { if (off) await simCtl({ gemDown: false }); }
    out.did.push(`Freischalt ${bl.r.id} ${Math.round(st.score * 100)}% (${via}${off ? ", KI-Ausfall " + off.done + "/2" : ""})`);
    SIM.unlockVia = SIM.unlockVia || {}; SIM.unlockVia[via] = (SIM.unlockVia[via] || 0) + 1;
    if (off) {
      if (off.done < 2) r.w12 = "skip";
      else if (!/selbst als richtig gewertet/.test(buildReport())) r.w12 = "Bericht nennt die selbst gewertete Antwort nicht";
      else r.w12 = "ok";
    }
    return r;
  };
  /* „Wörter vorab lernen“ (E-1007-62, E-1008-1/-10): nur nach 3 Fehlversuchen einer Voraussetzung; danach bleibt das
     Thema gesperrt; neue Wörter des Themas kommen nicht zusätzlich in die normale Runde */
  window.simPrevocab = async (day, out) => {
    const L = TOPICS.filter(t => S.topics[t.id].status === "locked" && !/^tsim/.test(t.id)).slice(0, 6);
    let target = null;
    for (const t of L) {
      A.topic(t.id);
      const exp = t.req.some(r => S.topics[r] && (S.topics[r].unlockFails || 0) >= 3) && t.v.length > 0, has = simHas("prevocab", t.id);
      if (exp !== has) simErr.push(`„Wörter vorab lernen“ bei ${t.id} ${has ? "angeboten, obwohl keine Voraussetzung 3× gescheitert ist" : "fehlt trotz 3 Fehlversuchen"} (Fehlversuche: ${t.req.map(r => r + "=" + ((S.topics[r] || {}).unlockFails || 0)).join(" ")})`);
      const bad = ["learn", "review", "extra", "tvskip", "tvocab"].filter(a => simHas(a, t.id));
      if (bad.length) simErr.push(`Gesperrtes Thema ${t.id} bietet ${bad.join(", ")} an (E-1008-1)`);
      if (has && !target && !S.topics[t.id].vocabDone) target = t;
    }
    if (!target || S.active) return;
    const id = target.id;
    A.topic(id); clk("prevocab", id);
    let g = 0;
    while (SESSION && SESSION.kind === "vocab" && g++ < 4) { await simVocab(day, 300); if (!S.topics[id].vocabDone && simHas("tvocab", id)) clk("tvocab", id); }
    if (S.topics[id].status !== "locked") simErr.push(`${id} nach „Wörter vorab lernen“ nicht mehr gesperrt (E-1008-1)`);
    if (simHas("learn", id)) simErr.push(`${id}: nach „Wörter vorab lernen“ wird „Weiter zu den Übungen“ angeboten, obwohl das Thema gesperrt ist (E-1008-1)`);
    A.learn(id); if (SESSION) { simErr.push(`${id}: Übungen eines gesperrten Themas lassen sich starten (E-1008-1)`); SESSION = null; }
    SIM.prevocabN = (SIM.prevocabN || 0) + 1;
    out.did.push(`Vorab ${id}${S.topics[id].vocabDone ? " fertig" : ""}`);
    // gleich danach die normale Vokabelrunde: darf keine neuen Wörter des gesperrten Themas enthalten (Prüfung in simVocab)
    A.tab("today"); if (simHas("vocab")) { clk("vocab"); if (SESSION && SESSION.kind === "vocab") await simVocab(day, 40); }
  };
  /* W11: Wiederholung eines Themas mit langem Abstand, auf das ein gesperrtes Thema wartet, mit genau ~75 % und „Einfach“ */
  window.sim75Wanted = (id, day) => {
    const s = S.topics[id];
    return blocksLocked(id) && (s.reps || 0) >= 1 && ((s.interval || 0) >= 6 || day >= 15);
  };
  window.sim75Plan = () => {
    const n = SESSION.items.length, w = Math.max(1, Math.ceil(n * 0.25));
    let k = 0;
    return { answer: (ex, info) => (info.retry ? "ok" : k++ < w ? "wrong" : "ok"), rate: "easy" };
  };
  /* W13: Schwächen-Vorzug */
  window.simWeakScenario = async (day, out) => {
    if (!aiReady() || S.active) return "skip";
    const host = learningTopics().find(t => practiceReady(t.id)), wp0 = weakPlan();
    const cand = learningTopics().filter(t => !wp0[t.id] && topicDue(t.id) > addDays(4) && t.id !== window.__simWeakId).sort((a, b) => topicDue(b.id) - topicDue(a.id));
    if (!host || !cand.length) return "skip";
    const X = cand[0].id, more = cand.slice(1, 4).map(t => t.id), locked = (TOPICS.find(t => S.topics[t.id].status === "locked") || {}).id;
    const E = [];
    const write = async ids => {
      await simCtl({ weak: ids });
      try {
        A.tab("topics"); clk("topic", host.id); clk("pwrite", host.id);
        await simWait(() => simHas("pwcheck") || /nicht erreichbar/.test(appText()), 30000);
        if (!simHas("pwcheck")) return false;
        typeIn("#ans", "Minä ei ole kotona."); clk("pwcheck");
        await simWait(() => !SESSION || (!SESSION.busy && document.querySelector("#fb .fb, #fb .card")), 30000);
        return true;
      } finally { await simCtl({ weak: null }); SESSION = null; }
    };
    const n0 = (S.weak || []).length, dueBefore = S.topics[X].due;
    for (let i = 0; i < 2; i++) if (!(await write([X, "t99", locked].filter(Boolean)))) return "Freies Schreiben startet nicht";
    const added = (S.weak || []).slice(0, Math.max(0, (S.weak || []).length - n0));
    if (added.length < 2) E.push(`nur ${added.length} von 2 KI-Treffern gespeichert`);
    if (added.some(x => x.g.includes("t99") || (locked && x.g.includes(locked)))) E.push("unbekannte oder gesperrte Themen-ID übernommen");
    let wp = weakPlan();
    if (!wp[X] || !wp[X].moved) E.push(`${X} (fällig ${fmtDate(dueBefore)}) nach 2 Treffern nicht vorgezogen`);
    else if (topicDue(X) > addDays(2)) E.push(`${X} erst am ${fmtDate(topicDue(X))} fällig statt spätestens übermorgen`);
    A.topic(X); if (!/Vorgezogen/.test(appText())) E.push("Themenseite nennt den Grund nicht");
    A.tab("progress"); if (!/wegen Schwäche vorgezogen/.test(appText())) E.push("Fortschritt nennt den Vorzug nicht");
    if (!new RegExp("deshalb vorgezogen:[^\\n]*" + X + "\\b").test(buildReport())) E.push("Bericht nennt den Vorzug nicht");
    // Schalter in den Einstellungen: aus → normaler Termin, an → wieder vorgezogen
    A.tab("settings"); clk("toggleweak");
    if (Object.keys(weakPlan()).length || topicDue(X) !== S.topics[X].due) E.push("„Schwächen vorziehen: Aus“ wirkt nicht");
    if (!/Vorziehen ist ausgeschaltet/.test(buildReport())) E.push("Bericht vermerkt „Aus“ nicht");
    A.tab("settings"); clk("toggleweak");
    if (!weakPlan()[X]) E.push("nach „An“ nicht wieder vorgezogen");
    // höchstens 3 Themen zugleich
    if (more.length >= 3) {
      for (const ids of [[more[0], more[1]], [more[2]]]) for (let i = 0; i < 2; i++) await write(ids);
      const since = Date.now() - 14 * 86400000, by = {};
      (S.weak || []).forEach(x => x && x.d >= since && new Set(x.g).forEach(id => S.topics[id] && S.topics[id].status === "learning" && x.d > lastPracticed(id) && (by[id] = (by[id] || 0) + 1)));
      const q = Object.keys(by).filter(id => by[id] >= 2).length, n = Object.keys(weakPlan()).length;
      if (n !== Math.min(3, q)) E.push(`${q} Themen mit ≥ 2 Treffern, vorgezogen ${n} (erwartet ${Math.min(3, q)})`);
    } else E.push("(Höchstens-3-Prüfung übersprungen: zu wenige Themen)");
    const W = weakPlan(), ids = Object.keys(W);
    SIM.weakFollow = (SIM.weakFollow || []).concat(ids.filter(id => W[id].moved).map(id => ({ id, t: Date.now(), until: W[id].due })));
    out.weakCmp = true; // Vergleich mit dem Handy am Tagesende (dayA)
    out.did.push(`Schwächen-Vorzug ${ids.join(",")}`);
    const real = E.filter(e => !e.startsWith("("));
    return real.length ? real.join("; ") : "ok";
  };
  /* Nach der nächsten Runde eines vorgezogenen Themas gilt wieder der normale Plan */
  window.simWeakFollow = () => {
    for (const f of SIM.weakFollow || []) {
      if (f.done) continue;
      if (lastPracticed(f.id) > f.t) {
        const w = weakPlan()[f.id];
        if ((w && w.moved) || topicDue(f.id) !== S.topics[f.id].due) simErr.push(`Schwächen-Vorzug ${f.id}: nach der Runde weiter vorgezogen`);
        f.done = "ok";
      } else if (Date.now() > f.until + 86400000) { simErr.push(`Schwächen-Vorzug ${f.id}: war ab ${fmtDate(f.until)} fällig, wurde aber nicht wiederholt`); f.done = "fail"; }
    }
    return (SIM.weakFollow || []).filter(f => !f.done).map(f => f.id);
  };
  /* W14 (E-1008-12): manipulierte lektionen.json an BAD_DAY */
  window.simBadLessonsCheck = async bad => {
    const E = [], [a, b, c] = bad.ids;
    if (a && !(await simWait(() => T(a) && T(a).th.includes("SIMBAD"), 6000))) E.push("geänderte Theorie wurde nicht übernommen");
    if (a && T(a) && /onerror|onload|onclick|<script|javascript:|<svg/i.test(T(a).th)) E.push(`Theorie von ${a} nicht bereinigt`);
    if (b && T(b) && (T(b).ex.length !== bad.len[1] || T(b).ex.some(e => e.t === "zz"))) E.push(`${b} mit ungültiger Übung übernommen`);
    if (c && T(c) && T(c).ex.length !== bad.len[2]) E.push(`${c}: gekürzte Fassung übernommen (${T(c).ex.length} statt ${bad.len[2]} Übungen)`);
    if (bad.base && T(bad.base) && T(bad.base).title === "Übernommen?") E.push("Grundthema aus lektionen.json überschrieben");
    if (a && S.topics[a] && S.topics[a].status !== "locked") A.topic(a);
    A.tab("topics"); clk("grammar"); await simSleep(300);
    if (window.__xss) E.push("Skript aus der Theorie ausgeführt (" + window.__xss + ")");
    A.tab("today");
    return E;
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
    const t = learningTopics().find(x => topicDue(x.id) > endOfDay()); if (!t || S.active || learningTopics().length < 2) return "skip";
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
    A.tab("vocab"); if (simHas("allwords")) clk("allwords"); clk("ownedit", n); typeIn("#ownde", "Simwort (geändert)"); clk("ownsave", n);
    if (S.own[n].de !== "Simwort (geändert)") return "Eigenes Wort nicht geändert";
    A.tab("vocab"); if (simHas("allwords")) clk("allwords"); clk("owndel", n); clk("owndel", n); if (!S.own[n].del) return "Eigenes Wort nicht gelöscht";
    A.tab("vocab"); if (simHas("allwords")) { clk("allwords"); const sp = document.querySelector("#app .spk"); if (sp) sp.click(); clk("allwords"); } return "ok";
  }],
  ["Grammatik-Übersicht, Themenliste, Zurück", async () => {
    if (!learningTopics().length) return "skip";
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
    if (!S.stats.sessions) { /* noch nichts gelernt: keine Erinnerung (richtig so) */ }
    else if (!CFG.autoFile) {
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
  ["Einstellungen", async () => {
    // „Schwächen vorziehen“ fehlt am Anfang in S.settings (= an) – nach Aus/An steht es ausdrücklich drin
    const norm0 = () => JSON.stringify({ ...S.settings, weakPlan: S.settings.weakPlan !== false });
    A.tab("settings"); const keep = norm0();
    for (const th of ["dark", "light", "auto"]) clk("theme", th);
    clk("toggleauto"); clk("toggleauto"); clk("toggleslow"); clk("toggleslow"); clk("toggleai"); clk("toggleai");
    clk("toggleweak"); if (S.settings.weakPlan !== false) return "„Schwächen vorziehen“ lässt sich nicht ausschalten";
    clk("toggleweak"); if (S.settings.weakPlan === false) return "„Schwächen vorziehen“ lässt sich nicht wieder einschalten";
    for (const id of ["newper", "extranum", "maxrev", "newtop"]) { const el = document.getElementById(id); if (!el) { simErr.push("Einstellung fehlt: " + id); continue; } const v = el.value; setSel(id, el.options[0].value); setSel(id, v); }
    if (norm0() !== keep) return "Einstellungen nicht wiederhergestellt";
    clk("aidiag"); await simWait(() => !/prüft|Prüfe/.test((document.querySelector("#aidiagbox") || {}).textContent || ""), 20000);
    return "ok";
  }],
  ["Tagesstände der Cloud", async () => {
    A.tab("settings"); clk("snaps"); await simWait(() => document.querySelector('[data-act="loadsnap"]'), 8000);
    const b = document.querySelector('[data-act="loadsnap"]'); if (!b) return "skip";
    // Der neueste Tagesstand muss von heute sein (entsteht beim ersten Hochladen des Tages) und darf nicht älter sein als
    // der Stand von heute Morgen – sonst gingen beim Laden auch Vortage verloren
    const diag = `CFG.lastSnapDay ${CFG.lastSnapDay}, heute ${todayKey()}, syncedAt ${CFG.syncedAt ? new Date(CFG.syncedAt).toISOString() : "-"}, Sync „${(document.querySelector("#sync") || {}).className || ""}“`;
    const first = b.dataset.id, before = Object.keys(S.cards).length, pushedToday = !!CFG.syncedAt && todayKey(new Date(CFG.syncedAt)) === todayKey();
    clk("loadsnap", b.dataset.id); clk("loadsnap", b.dataset.id); await simSleep(800);
    // ohne Hochladen heute entsteht (richtig) kein Tagesstand von heute
    if (first !== todayKey() && pushedToday) return `Kein Tagesstand von heute, obwohl heute hochgeladen wurde – geladen wurde ${first} (${diag})`;
    if (S.stats.reviews < (window.__simMorningReviews || 0)) return `Tagesstand von heute älter als der Stand von heute Morgen (${S.stats.reviews} < ${window.__simMorningReviews} Wiederholungen; ${diag})`;
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
    if (TOPICS.length !== n) return "Lektionspaket mit vorhandenem Thema ändert die Themenzahl";
    // fremdes Paket (E-1008-12): Skript in der Theorie, Grundthema überschreiben, ungültige Übung, Titel kein Text, kürzere Fassung
    if (SIM.packDone) return "ok";
    const ex0 = TOPICS.flatMap(x => x.ex).find(e => e.t === "tr"), last = TOPICS.filter(x => !/^tsim/.test(x.id)).slice(-1)[0];
    const stat = () => JSON.stringify(TOPICS.filter(x => !/^tsim/.test(x.id)).map(x => [x.id, S.topics[x.id].status, S.topics[x.id].last])), st0 = stat();
    const evil = { id: "tsim1", title: "Sim-Paket", fi: "Sim", th: '<p>Sim</p><img src="x" onerror="window.__xss=11"><script>window.__xss=12</script><a href="javascript:window.__xss=13" onclick="window.__xss=14">x</a><svg onload="window.__xss=15"></svg>', v: [t.v[0]], ex: [ex0], req: [last.id] };
    const imp = list => { A.tab("settings"); typeIn("#packta", JSON.stringify(list)); clk("importpack"); };
    imp([evil]); await simSleep(300);
    const E = [];
    if (!T("tsim1")) E.push("gültiges fremdes Paket abgelehnt");
    else if (/onerror|onload|onclick|<script|javascript:|<svg/i.test(T("tsim1").th)) E.push("Theorie des Pakets nicht bereinigt");
    const b0 = BASE_TOPICS[0];
    if (b0) { imp([{ ...JSON.parse(JSON.stringify(b0)), title: "Übernommen?" }]); if (T(b0.id).title === "Übernommen?") E.push("Grundthema überschrieben"); }
    imp([{ ...evil, id: "tsim2", ex: [{ t: "zz", q: "kaputt" }] }]); if (T("tsim2")) E.push("Paket mit ungültiger Übung übernommen");
    imp([{ ...evil, id: "tsim3", title: { x: 1 } }]); if (T("tsim3")) E.push("Paket mit Titel als Objekt übernommen");
    imp([{ ...evil, v: [] }]); if (T("tsim1") && T("tsim1").v.length !== 1) E.push("kürzere Fassung ersetzt ein Paket");
    A.tab("topics"); clk("grammar"); await simSleep(300); A.tab("topics");
    if (window.__xss) E.push("Skript ausgeführt (" + window.__xss + ")");
    if (stat() !== st0) E.push("Fortschritt der übrigen Themen verändert");
    SIM.packDone = 1;
    return E.length ? "Fremdes Lektionspaket: " + E.join("; ") : "ok";
  }],
  ["Thema zurücksetzen", async day => {
    const t = learningTopics().find(x => x.id !== window.__simWeakId && S.topics[x.id].last >= 0.8); if (!t || S.active || SIM.resetDone) return "skip";
    A.tab("topics"); clk("topic", t.id); clk("resettopic", t.id); clk("topresetno");
    clk("resettopic", t.id); typeIn("#topconf", "ZURÜCKSETZEN"); clk("topresetgo", t.id);
    await simWait(() => S.topics[t.id].status === "new", 8000); SIM.resetDone = 1; SIM.resetId = t.id;
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
  ["Freies Schreiben, Rollenspiel, fertige Aufgaben", async day => {
    const L = learningTopics().filter(x => (S.topics[x.id].last || 0) >= 0.8), t = L.find(x => fixedPool(x.id).length) || L[0]; if (!t || !aiReady() || S.active) return "skip";
    A.tab("topics"); clk("topic", t.id); clk("pwrite", t.id); await simWait(() => simHas("pwcheck") || /nicht erreichbar/.test(document.querySelector("#app").textContent), 30000);
    if (simHas("pwcheck")) { typeIn("#ans", "Minä ei ole kotona."); clk("pwcheck"); await simWait(() => !SESSION.busy && document.querySelector("#fb .fb, #fb .card"), 30000); }
    A.tab("topics"); clk("topic", t.id); clk("pchat", t.id); await simWait(() => document.querySelector("#chatin") || /nicht erreichbar/.test(document.querySelector("#app").textContent), 30000);
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
      // Antworten vom Claude-Testblatt übernehmen (nur vor der ersten Antwort angeboten)
      const it = PT[0].sections[0].items[0], id0 = PT[0].sections[0].id + ".1";
      typeIn("#ptimp", JSON.stringify({ type: "dt-placement", a: { [id0]: ["x"] }, c: {} })); clk("ptimport");
      if (!S.placement.a[id0]) E.push("Einstufungstest: Import übernimmt keine Antwort");
      for (const part of PT) {
        clk("ptpart", part.id);
        for (const sec of part.sections) {
          document.querySelectorAll(`input.pgap[data-pid^="${sec.id}."]`).forEach((f, i) => { f.focus(); f.value = i % 4 ? "ist" : ""; f.dispatchEvent(new Event("input", { bubbles: true })); });
          document.querySelectorAll(`textarea[data-pid^="${sec.id}."]`).forEach(f => { f.focus(); f.value = "Ich habe gestern einen langen Satz geschrieben."; f.dispatchEvent(new Event("input", { bubbles: true })); });
          [...document.querySelectorAll('[data-act="ptrf"]')].filter(b => b.dataset.id.startsWith(sec.id + ".") && b.dataset.id.endsWith("|richtig")).forEach(b => b.click());
          const u = document.querySelector(`[data-act="ptu"][data-id^="${sec.id}."]`); if (u) { u.click(); }
          const noAi = sec === part.sections[part.sections.length - 1] && part.id === PT[0].id; // ein Abschnitt ohne KI: Selbstvergleich
          if (noAi) { S.settings.ai = false; save(); }
          if (simHas("ptcheck", sec.id)) { clk("ptcheck", sec.id); await simWait(() => !document.querySelector(".pres.busy, .pres.wait.busy"), 30000); await simSleep(200); }
          const sb = [...document.querySelectorAll('[data-act="ptself"]')].find(b => b.dataset.id.startsWith(sec.id + ".")); if (sb) sb.click();
          if (noAi) { if (!sb) E.push("Einstufungstest ohne KI: kein Selbstvergleich in " + sec.id); S.settings.ai = true; save(); }
        }
      }
      // Groß-/Kleinschreibung (E-1008-9): ein kleingeschriebenes Nomen in einer Lücke zählt lokal als falsch, außer am Satzanfang
      if (SP.caseMatters) {
        let n = 0;
        for (const part of PT) for (const sec of part.sections) sec.items.forEach(item => {
          if (item.k !== "b" || n >= 3) return;
          const stems = gapStems(item);
          (item.s || []).forEach((alt0, i) => {
            const a = String(alt0).split("|")[0], pre = item.t.split("___")[i] || "";
            if (n >= 3 || stems[i] || !/^[A-ZÄÖÜ][a-zäöüß]/.test(a) || (i === 0 && !pre.trim()) || /[.!?:]\s*$/.test(pre)) return;
            if (String(alt0).split("|").includes(a.toLowerCase())) return;
            n++;
            if (!gapOk(item, i, a)) E.push(`Einstufungstest: Musterlösung „${a}“ gilt nicht als richtig`);
            if (gapOk(item, i, a.toLowerCase())) E.push(`Einstufungstest: „${a.toLowerCase()}“ statt „${a}“ gilt als richtig (E-1008-9)`);
          });
        });
        if (!n) E.push("Einstufungstest: keine Lücke mit großgeschriebenem Wort zum Prüfen gefunden");
      }
      const toPt = () => { A.tab("topics"); clk("pt"); };
      toPt(); if (simHas("ptfinish")) { clk("ptfinish"); clk("ptfinish"); await simWait(() => S.placement.done, 30000); }
      if (!S.placement.done) E.push("Einstufungstest: Abschließen klappt nicht");
      toPt(); clk("ptreport");
      if (!/EINSTUFUNGSTEST/.test(buildReport())) E.push("Einstufungstest fehlt im Bericht");
    } catch (e) { E.push("Einstufungstest: Ausnahme " + (e && e.stack || e)); }
    return E.concat(simErr.splice(0));
  });
}

/* ---------- ein Tag ---------- */
const daily = [];
async function dayA(page, day, tourSteps, flags = {}, SC = {}) {
  return page.evaluate(async ([day, tour, NOMIX, FILEP, SC]) => {
    const out = { day, did: [], err: [], tour: {}, scen: {} };
    const E = m => out.err.push(m);
    const TOUR = tour.map(([n, src]) => [n, eval("(" + src + ")")]);
    SIM.tries = {};
    window.__simMorningReviews = S.stats.reviews;
    try {
      A.tab("today");
      if (simHas("pasteimport")) { clk("pasteimport"); if (!document.querySelector("#impta")) E("„Schon gelernt? Sicherung einspielen“ öffnet das Einspielen nicht"); A.tab("today"); }
      // 0. pausierte Runde fortsetzen
      if (S.active) { if (!clk("resume")) openSession(); const r = await simRound(day); out.did.push("Fortsetzung " + Math.round(r.score * 100) + "%"); }
      // Tagesplan muss vorhanden sein, sobald gelernt wird
      A.tab("today");
      if ((learningTopics().length || Object.keys(S.cards).length) && !/Tagesplan/.test(document.querySelector("#app").textContent)) E("Heute: Tagesplan fehlt");
      // 1. fällige Themen (über den Tagesplan bzw. die Themenseite); vorgezogene Schwächen-Themen (W13) immer
      const follow = (SIM.weakFollow || []).filter(f => !f.done).map(f => f.id), dT = dueTopics();
      for (const t of [...dT.slice(0, 3), ...dT.slice(3).filter(x => follow.includes(x.id))]) {
        A.tab("topics"); clk("topic", t.id); clk("review", t.id);
        if (!SESSION) { E("Wiederholung startet nicht: " + t.id); continue; }
        if (SESSION.items.length > 8) E("Wiederholung mit " + SESSION.items.length + " Übungen");
        // W11: Thema mit langem Abstand, auf das ein gesperrtes Thema wartet → ~75 % und „Einfach“
        const w75 = SC.pend.w11 && day >= SC.from && !out.scen.w11 && sim75Wanted(t.id, day), iv0 = S.topics[t.id].interval;
        const r = await simRound(day, true, w75 ? sim75Plan() : {}); out.did.push(`Wdh ${t.id} ${Math.round(r.score * 100)}%`);
        if (r.stuck) E("Runde hängt: " + t.id);
        if (w75) {
          if (!(r.appScore >= 0.6 && r.appScore < 0.8)) out.scen.w11 = "skip";
          else if (r.capDays == null) out.scen.w11 = "Abstand nicht geprüft";
          else { out.scen.w11 = r.capDays <= 7.1 ? "ok" : `nach ${Math.round(r.appScore * 100)} % + „Einfach“ erst in ${r.capDays.toFixed(1)} Tagen`; out.did.push(`75%-Szenario ${t.id}: Abstand vorher ${iv0} T, jetzt ${r.capDays.toFixed(1)} T`); }
        }
      }
      simWeakFollow();
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
      // 4. Freischaltung (W10/W12): blockierende Voraussetzung über „Heute“ oder alle 3 Tage über die Themenseite;
      //    „Wörter vorab lernen“ nur nach 3 Fehlversuchen, gesperrt bleibt gesperrt
      if (!S.active) Object.assign(out.scen, await simUnlockStep(day, SC.pend, out));
      await simPrevocab(day, out);
      // 5. Fehler-Training über den Tagesplan
      if (openErrors().length && day % 2 === 0 && !S.active) { const before = openErrors().length; A.tab("today"); clk("errtrain"); await simRound(day, false); out.did.push(`Fehler ${before}→${openErrors().length}`); }
      // 6. gemischte Wiederholung (Mehr üben), Langzeit-Check über den Tagesplan
      if (learningTopics().length >= 2 && day % 2 === 1 && !(NOMIX && day >= NOMIX) && !S.active) { A.tab("today"); clk("mix"); const r = await simRound(day, false); out.did.push(`Mix ${SESSION ? "?" : Math.round(r.score * 100) + "%"}`); if (S.mixDay !== todayKey()) E("Mix nicht als erledigt markiert"); }
      if (checkDue() && !S.active) { const ct = checkTopics().map(t => t.id); A.tab("today"); clk("longcheck"); await simRound(day, false); out.did.push("Langzeit-Check " + ct.join(",")); out.check = ct; if (checkDue()) E("Langzeit-Check bleibt fällig"); }
      // Sicherungsdatei braucht nach dem Neustart eine Freigabe (W6, Tag 71): Hinweis, Freigeben, danach ausschalten
      if (FILEP) {
        if (!CFG.autoFile) E("Freigabe-Tag: automatische Sicherungsdatei war nicht eingerichtet");
        else {
          A.tab("today"); if (!NEED_FILE_PERM || !simHas("fileperm")) E("Hinweis „Sicherungsdatei freigeben“ fehlt");
          else { clk("fileperm"); await simWait(() => !NEED_FILE_PERM, 5000); if (NEED_FILE_PERM) E("Freigeben hat nicht geklappt"); else out.did.push("Datei freigegeben"); }
          A.tab("settings"); clk("autofileoff"); clk("autofileoff"); await simWait(() => !CFG.autoFile, 3000); if (CFG.autoFile) E("Sicherungsdatei lässt sich nicht ausschalten"); else out.did.push("Datei aus");
        }
      }
      // 6b. Szenarien: manipulierte lektionen.json (W14), Schwächen-Vorzug (W13)
      if (SC.bad) { const e = await simBadLessonsCheck(SC.bad); e.forEach(x => E("Manipulierte lektionen.json (E-1008-12): " + x)); out.scen.bad = e.length ? "Fehler" : "ok"; }
      if (SC.pend.w13 && !S.active) out.scen.w13 = await simWeakScenario(day, out);
      // 7. Rundgang: die nächsten Schritte
      for (const [n, f] of TOUR) {
        try { const r = await f(day); out.tour[n] = r; if (r !== "ok" && r !== "skip") E("Rundgang „" + n + "“: " + r); } catch (e) { out.tour[n] = "Fehler"; E("Rundgang „" + n + "“: " + (e && e.stack || e)); }
        if (SESSION) { SESSION = null; }
        A.tab("today");
      }
      // 8. Prüfungen am Tagesende
      // E-1008-10: heute neu gelernte Wörter höchstens 3 Tage Abstand (vorher sprang ein zweites „Gut“ auf 4 Tage)
      const tk = todayKey(), jump = Object.entries(S.cards).filter(([, c]) => c.learnDay === tk && c.due - startOfDay() > 3 * 86400000 + 7200e3);
      if (jump.length) E(`${jump.length} heute neu gelernte Wörter erst in mehr als 3 Tagen wieder (E-1008-10): ` + jump.slice(0, 3).map(([id, c]) => id + " " + Math.round((c.due - startOfDay()) / 86400000) + " T").join(", "));
      // E-1008-7: keine Lektionen im Lernstand
      const sj = JSON.stringify(S), inS = SC.snips.filter(x => sj.includes(x));
      if (inS.length) E("Lernstand enthält Lektionstext (E-1008-7): „" + inS[0] + "“");
      simHeuteUnlock();
      if (out.weakCmp) { const W = weakPlan(), ids = Object.keys(W); out.weakCmp = { ids, due: Object.fromEntries(ids.map(id => [id, topicDue(id)])), lastD: ((S.weak || [])[0] || {}).d || 0 }; }
      // alle Ansichten (Absturz-Probe, 390 px)
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
      longCheck: S.longCheck, sync: document.querySelector("#sync") ? document.querySelector("#sync").className : "",
      resetId: SIM.resetId || null
    };
    // Speicher (E-1008-19): Lernstand, localStorage dieser App (ohne Merker der Simulation), belegter Browser-Speicher
    const lsKeys = Object.keys(localStorage).filter(k => !k.startsWith("__sim"));
    out.store = { s: out.snap.size, ls: lsKeys.reduce((a, k) => a + k.length + (localStorage.getItem(k) || "").length, 0), top: lsKeys.map(k => [k, (localStorage.getItem(k) || "").length]).sort((a, b) => b[1] - a[1]).slice(0, 4) };
    out.store.parts = Object.keys(S).map(k => [k, JSON.stringify(S[k] === undefined ? null : S[k]).length]).sort((a, b) => b[1] - a[1]).slice(0, 6);
    try { const est = await navigator.storage.estimate(); out.store.use = est.usage; } catch (e) {}
    out.glob = __simGlob.splice(0);
    out.repTimes = (S.reports || []).map(x => x.d).filter(Boolean);
    out.sim = { looseOn: (SP.loose || []).some(p => p[0] === "ä"), unlockVia: SIM.unlockVia || {}, prevocabN: SIM.prevocabN || 0, capChecks: SIM.capChecks || 0, rules: SIM.rules || {}, weakOpen: (SIM.weakFollow || []).filter(f => !f.done).length };
    simSave();
    return out;
  }, [day, tourSteps.map(([n, f]) => [n, f.toString()]), +process.env.NOMIX || 0, !!flags.filePrompt, SC]);
}
async function dayB(page, day) {
  return page.evaluate(async day => {
    const out = { err: [] };
    SIM.tries = {};
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
    out.glob = __simGlob.splice(0);
    simSave();
    return out;
  }, day);
}
/* W13: Der Schwächen-Vorzug ergibt sich aus synchronisierten Daten – auf dem Handy müssen dieselben Themen mit demselben
   Termin vorgezogen sein */
async function weakCompareB(page, cmp) {
  return page.evaluate(async c => {
    await simWait(() => (S.weak || []).some(x => x.d === c.lastD), 10000);
    const wp = weakPlan(), ids = Object.keys(wp);
    const E = [];
    if (JSON.stringify(ids.slice().sort()) !== JSON.stringify(c.ids.slice().sort())) E.push(`Handy zieht ${ids.join(",") || "nichts"} vor, PC ${c.ids.join(",")}`);
    c.ids.forEach(id => { if (topicDue(id) !== c.due[id]) E.push(`${id}: Handy fällig ${fmtDate(topicDue(id))}, PC ${fmtDate(c.due[id])}`); });
    return { E: E.concat(simErr.splice(0)), glob: __simGlob.splice(0), cov: __cov };
  }, cmp);
}

/* ---------- Ablauf ---------- */
const A = await makeDevice("PC"), B = await makeDevice("Handy");
const t0 = Date.now();
const COV = { act: {}, view: {}, ex: {}, chg: {}, ai: {} };
const addCov = c => { if (!c) return; for (const g of ["act", "view", "ex", "chg"]) for (const k in c[g] || {}) COV[g][k] = (COV[g][k] || 0) + c[g][k]; };
const tourDone = {};
let tourIdx = 0, bSample = null, bDiag = null, lastSnap = null;
const scen = { w11: 0, w12: 0, w13: 0, bad: 0 }, scenOk = { w11: 0, w12: 0, w13: 0, bad: 0 }, glob = [], storeLog = [];
let lastSim = {}, prevLearning = null;
const snapLoadDays = new Set(), repTimes = new Map(); // repTimes: Zeitpunkt jeder Gesamtanalyse (aus S.reports) → erster Tag gesehen // Tage, an denen der Rundgang einen Tagesstand geladen hat (setzt den Stand auf den Morgen zurück)
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
  ctl.gemDown = false; ctl.weak = null;
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
    await openDay(B, day, { noVoice: flags.noVoice });
    bRes = await dayB(B, day);
    bRes.err.forEach(e => P(`Tag ${day}: ${e}`));
    addCov(bRes.cov);
    if (bRes.sample && Object.keys(bRes.sample).length) { bSample = bRes.sample; bDiag = bRes.diag; }
  }
  lessonBad = day === BAD_DAY && BAD_IDS.length > 0; // W14: nur der PC lädt an diesem Tag die manipulierte Fassung
  await openDay(A, day, flags);
  lessonBad = false;
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
  if (day === REVEAL_DAY) { const n = await A.evaluate(() => TOPICS.length); if (lastSnap && lastSnap.nTopics > 4 && n <= lastSnap.nTopics) P(`Tag ${day}: neue Lektionen von Claude nicht geladen (${n} Themen)`); }
  if (day === 60) await A.evaluate(() => setTimeout(() => { throw new Error("Absturz-Probe Tag 60"); }, 0));
  if (flags.noVoice) {
    const nv = await A.evaluate(() => { A.tab("vocab"); const b = document.querySelector('[data-act="listen"]'); return { dis: !b || b.disabled, warn: CFG.voiceWarnDay }; });
    if (!nv.dis) P(`Tag ${day}: ohne Stimme ist das Diktat nicht ausgegraut`);
  }
  // Rundgang: pro Tag 2 Schritte, offene („skip“) bleiben in der Warteschlange; ab Tag 6, wenn es Inhalte gibt
  const steps = [];
  if (day >= 6) for (let i = 0; i < TOUR.length && steps.length < 2; i++) { const s = TOUR[(tourIdx + i) % TOUR.length]; steps.push(s); }
  tourIdx = (tourIdx + 2) % TOUR.length;
  const SC = {
    from: SC_FROM, snips: SNIPS,
    pend: { from: SC_FROM, w11: !scen.w11, w12: !scen.w12, w13: day >= SC_FROM && scen.w13 < (day >= WEAK2_FROM ? 2 : 1) },
    bad: day === BAD_DAY && BAD_IDS.length ? { ids: BAD_IDS, len: BAD_IDS.map(id => LESSONS.find(t => t.id === id).ex.length), base: BASEX[0] && BASEX[0].id } : null
  };
  const r = await dayA(A, day, steps, flags, SC);
  for (const [n, v] of Object.entries(r.tour || {})) if (v === "ok") tourDone[n] = (tourDone[n] || 0) + 1;
  if ((r.tour || {})["Tagesstände der Cloud"] === "ok") snapLoadDays.add(day);
  addCov(r.cov);
  // Szenarien: „skip“ = Voraussetzung fehlt noch (morgen erneut), sonst gelaufen; alles außer „ok“ ist ein Problem
  for (const [k, v] of Object.entries(r.scen || {})) {
    if (v === "skip") continue;
    scen[k]++; if (v === "ok") scenOk[k]++; else if (k !== "bad") P(`Tag ${day}: Szenario ${k}: ${v}`);
  }
  (r.glob || []).forEach(g => glob.push({ ...g, day, dev: "PC" }));
  (r.repTimes || []).forEach(t => { if (!repTimes.has(t)) repTimes.set(t, day); });
  if (snapLog.length && (r.tour || {})["Tagesstände der Cloud"] && r.tour["Tagesstände der Cloud"] !== "ok") console.log(`   Tagesstände bis Tag ${day}: ` + snapLog.filter(x => x.simDay >= day - 3).map(x => `Tag ${x.simDay} → ${x.key} (${x.reviews} Wdh)`).join(", "));
  if (bRes) (bRes.glob || []).forEach(g => glob.push({ ...g, day, dev: "Handy" }));
  lastSim = r.sim || lastSim;
  // W13: dasselbe auf dem Handy – erst hochladen lassen, dann das Handy öffnen
  if (r.weakCmp && r.weakCmp.ids) {
    await A.evaluate(() => simWait(() => !PUSH_TIMER && !PUSHING, 10000)).catch(() => {});
    await A.waitForTimeout(500);
    await openDay(B, day, { noVoice: flags.noVoice });
    const wc = await weakCompareB(B, r.weakCmp);
    wc.E.forEach(e => P(`Tag ${day}: Schwächen-Vorzug auf dem Handy (E-1008-22): ${e}`));
    wc.glob.forEach(g => glob.push({ ...g, day, dev: "Handy" }));
    addCov(wc.cov);
    if (!wc.E.length) r.did.push("Handy: gleicher Vorzug");
  }
  // gelernte Themen gehen nie verloren (außer „Thema zurücksetzen“ im Rundgang)
  const learnNow = new Set((r.snap.learning || "").split(",").filter(Boolean));
  if (prevLearning) { const lost = [...prevLearning].filter(id => !learnNow.has(id) && id !== r.snap.resetId); if (lost.length) P(`Tag ${day}: gelernte Themen nicht mehr gelernt: ${lost.join(", ")}`); }
  prevLearning = learnNow;
  // E-1008-7: Lektionen nie in der Cloud
  { const cj = JSON.stringify((db.progress.get("u1") || {}).data || {}), hit = SNIPS.filter(x => cj.includes(x)); if (hit.length) P(`Tag ${day}: Cloud-Stand enthält Lektionstext „${hit[0]}“ (E-1008-7)`); }
  // Speicher je Tag (E-1008-19)
  if (r.store) { storeLog.push({ day, ...r.store }); if (r.store.ls > 2.5e6) P(`Tag ${day}: localStorage dieser App ${Math.round(r.store.ls / 1e3)} k Zeichen – Grenze ca. 5 MB, geteilt mit der anderen App`); }
  await A.waitForTimeout(db.hang ? 2500 : 1500); // Hochladen abwarten
  if (bRes) r.b = bRes.n;
  r.err.forEach(e => P(`Tag ${day}: ${e}`));
  [...A.errs.splice(0), ...B.errs.splice(0)].forEach(e => { if (!/Absturz-Probe|Sim-Ansichtsfehler/.test(e)) P(`Tag ${day}: JS-Fehler ${e}`); });
  const s = r.snap;
  if (GAP_TO && day === GAP_TO + 1) { if (s.dueToday > 150 && s.dueToday > s.dueCards) P(`Tag ${day}: nach der Pause mehr als das Tageslimit fällig`); console.log(`   nach der Pause: ${s.dueCards} Karten überfällig, heute ${s.dueToday}`); }
  s.aiKinds.forEach(k => (COV.ai[k] = 1));
  delete r.cov; daily.push(r); lastSnap = s;
  console.log(`T${String(day).padStart(2)} | ${r.did.join("; ").slice(0, 220)}${r.b ? " | Handy " + r.b : ""} | lernt ${s.learning ? s.learning.split(",").length : 0} Themen, Karten fällig ${s.dueCards}, ⚠${s.leech}, Fehler ${s.errors}, KI ${s.unrev}u/${s.approvedUnseen}✓ ${gemDay[day] || 0} Aufrufe, Stand ${Math.round(s.size / 1024)} KB, LS ${r.store ? Math.round(r.store.ls / 1024) : "?"} KB${Object.keys(r.tour).length ? " | Rundgang: " + Object.entries(r.tour).map(([n, v]) => n.split(/[ ,:]/)[0] + "=" + v).join(" ") : ""}`);
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
/* Noch keine Themen (Deutsch-Trainer vor dem Einstufungstest): Lern-Funktionen sind dort nicht prüfbar – nur melden */
const noTopics = !need.ex.length;
if (miss.length && noTopics) console.log("Erst mit Themen prüfbar (App hat noch keine Themen): " + miss.join(", "));
else if (miss.length) P("Abdeckung: nicht geprüft – " + miss.join(", "));
if (PLACE) { const pm = ["pt", "ptpart", "ptcheck", "ptfinish", "ptreport", "ptimport", "ptrf", "ptu", "ptself"].filter(k => !COV.act[k]); if (!COV.view.renderPlacement) pm.push("renderPlacement"); if (!COV.ai.einstufung) pm.push("KI einstufung"); if (pm.length) P("Einstufungstest nicht vollständig geprüft: " + pm.join(", ")); }
const exNoContent = need.allEx.filter(k => !need.ex.includes(k));
const tourMiss = TOUR.map(([n]) => n).filter(n => !tourDone[n]);
if (tourMiss.length && !noTopics) P("Rundgang nie erfolgreich: " + tourMiss.join(" | "));
else if (tourMiss.length) console.log("Rundgang ohne Themen nicht möglich: " + tourMiss.join(" | "));
console.log(`\nAbdeckung: ${need.act.length - need.act.filter(k => !COV.act[k]).length}/${need.act.length} Aktionen, ${need.view.filter(k => COV.view[k]).length}/${need.view.length} Ansichten, ${need.ex.filter(k => COV.ex[k]).length}/${need.ex.length} Übungsarten, ${need.ai.filter(k => COV.ai[k]).length}/${need.ai.length} KI-Arten, ${chgIds.filter(k => COV.chg[k]).length}/${chgIds.length} Einstellungen` +
  (Object.keys(EXEMPT).length ? `\nAusnahmen: ${Object.entries(EXEMPT).map(([k, v]) => k + " (" + v + ")").filter((x, i, a) => a.indexOf(x) === i).join("; ")}` : "") +
  (exNoContent.length ? `\nÜbungsarten ohne Inhalte in dieser App (nur in pruefen.mjs geprüft): ${exNoContent.join(", ")}` : "") +
  `\nRundgang: ${Object.entries(tourDone).map(([n, v]) => n + " ×" + v).join(" | ")}`);

/* ---------- Auswertung S-1008: Szenarien, Einzelregeln, Themen, Speicher, KI ---------- */
const say = noTopics ? m => console.log("(ohne Themen nicht prüfbar) " + m) : P;
const kb = n => Math.round((n || 0) / 1024);
// Themen-Abdeckung (E-1008-19 Nr. 1)
const tc = await A.evaluate(() => TOPICS.filter(t => !/^tsim/.test(t.id)).map(t => { const s = S.topics[t.id]; return { id: t.id, sub: /\d[a-z]$/.test(t.id), st: s.status, n: (s.hist || []).length, last: s.last, open: s.status === "locked" ? reqInfo(t).filter(r => !r.ok).map(r => r.id + (r.s.last != null ? " " + Math.round(r.s.last * 100) + "%" : "")) : [] }; }));
{
  const cnt = f => `${tc.filter(f).length} (davon ${tc.filter(t => t.sub && f(t)).length} Unterthemen)`;
  console.log(`\nThemen-Abdeckung: ${tc.length} Themen (${tc.filter(t => t.sub).length} Unterthemen) – erreicht ${cnt(t => t.st !== "locked")}, gelernt ${cnt(t => t.n > 0)}, zuletzt ≥ 80 % ${cnt(t => (t.last || 0) >= 0.8)}`);
  const nl = tc.filter(t => t.st === "new"), lk = tc.filter(t => t.st === "locked");
  if (nl.length) console.log("Frei, aber nie gelernt: " + nl.map(t => t.id).join(", "));
  if (lk.length) console.log("Nie erreicht: " + lk.slice(0, 10).map(t => `${t.id} (offen: ${t.open.slice(0, 3).join(", ")}${t.open.length > 3 ? " …" : ""})`).join("; ") + (lk.length > 10 ? ` … und ${lk.length - 10} weitere` : ""));
}
// Szenarien
const scenNeed = { w11: 1, w12: 1, w13: DAYS > WEAK2_FROM ? 2 : DAYS > SC_FROM ? 1 : 0, bad: DAYS > BAD_DAY && BAD_IDS.length ? 1 : 0 };
const scenName = { w11: "W11 75 % mit langem Abstand", w12: "W12 KI-Ausfall in der Freischalt-Runde", w13: "W13 Schwächen-Vorzug", bad: "W14 manipulierte lektionen.json" };
for (const [k, n] of Object.entries(scenNeed)) if (n && DAYS > SC_FROM && scen[k] < n) say(`Szenario ${scenName[k]}: ${scen[k]} von ${n}× gelaufen – Voraussetzung nie erfüllt`);
const R = lastSim.rules || {};
for (const [k, l] of [["strict", "Endung mitten im Wort streng (E-1008-3)"], ["loose", "Übersetzung ohne Pünktchen „fast richtig“"], ["ordAlt", "zweite Wortstellung (E-1008-6)"]]) if (!R[k] && DAYS > SC_FROM && !(k === "loose" && !lastSim.looseOn)) say(`Regel nie geprüft (keine passende Übung): ${l}`);
if (!lastSim.prevocabN && DAYS > SC_FROM) say("„Wörter vorab lernen“ nie geprüft – keine Voraussetzung ist 3× gescheitert");
if (!lastSim.capChecks && DAYS > SC_FROM) say("7-Tage-Regel (E-1008-5) nie geprüft – keine bewertete Runde unter 80 % mit gesperrtem Folgethema");
const uv = lastSim.unlockVia || {};
if (!uv.Heute && !uv.Themenseite && DAYS > SC_FROM) say("Keine Freischalt-Runde gespielt");
console.log(`Szenarien: ${Object.keys(scenNeed).map(k => `${scenName[k]} ${scenOk[k]}/${scen[k]} ok`).join(" | ")}\nFreischalt-Runden: über Heute ${uv.Heute || 0}, über die Themenseite ${uv.Themenseite || 0}; Wörter vorab gelernt: ${lastSim.prevocabN || 0}×; 7-Tage-Regel geprüft: ${lastSim.capChecks || 0}×; Einzelregeln: Endung streng ${R.strict || 0}×, ohne Pünktchen ${R.loose || 0}×, zweite Wortstellung ${R.ordAlt || 0}×`);
// E-1008-7: Tagesstände und heruntergeladene Dateien
for (const [d, data] of db.snaps) { const j = JSON.stringify(data), h = SNIPS.filter(x => j.includes(x)); if (h.length) P(`Tagesstand ${d} enthält Lektionstext (E-1008-7)`); }
const dlOff = downloads.filter(d => d.html), dlOther = downloads.filter(d => !d.html && !d.err);
dlOther.filter(d => d.snips).forEach(d => P(`Tag ${d.day}: ${d.file} (${d.dev}) enthält Lektionstext (E-1008-7)`));
dlOff.filter(d => !d.emb || d.snips < SNIPS.length).forEach(d => P(`Tag ${d.day}: Notfall-Version ohne eingebettete Lektionen (E-1008-7)`));
downloads.filter(d => d.err).forEach(d => P(`Tag ${d.day}: Download ${d.file} nicht lesbar: ${d.err}`));
if (!dlOff.length && DAYS > 10) say("Notfall-Version nie heruntergeladen");
console.log(`Downloads: ${downloads.length} (Notfall-Version ${dlOff.length}, Sicherungen/Rohdaten ${dlOther.length}); Lektionstext-Proben: ${SNIPS.length}`);
// E-1008-13: automatische Gesamtanalyse höchstens alle 3 Tage und erst nach 5 Runden (nach 7 Tagen nach 1 Runde).
// Alle Zeitpunkte aus S.reports (auch Analysen beim App-Start, bevor die Simulation mitschreibt); „von Hand“ und die
// Rundenzahl kennt nur der Mitschnitt (runGlobal).
{
  const byT = new Map(glob.map(g => [g.t, g])), manual = new Set(glob.filter(g => !g.auto).map(g => g.t));
  const all = [...new Set([...repTimes.keys(), ...glob.map(g => g.t)])].sort((a, b) => a - b);
  const dayOf = t => (byT.has(t) ? byT.get(t).day : repTimes.get(t));
  const restored = (d0, d1) => [...snapLoadDays].some(d => d >= d0 && d <= d1);
  let minGap = Infinity, nAuto = 0;
  all.forEach((t, i) => {
    if (manual.has(t)) return;
    nAuto++;
    if (!i) return;
    const g = byT.get(t), gap = (t - all[i - 1]) / DAY, own = g && g.prev ? (t - g.prev) / DAY : gap, d0 = dayOf(all[i - 1]), d1 = dayOf(t);
    const who = g ? g.dev : "beim Start";
    if (own < 2.99) {
      const m = `Tag ${d1}: automatische Gesamtanalyse (${who}) schon ${own.toFixed(1)} Tage nach der letzten (Tag ${d0}, E-1008-13)`;
      if (!g && restored(d0, d1)) console.log(m + " – dazwischen Tagesstand geladen, erwartet"); else P(m);
    } else if (g && own < 6.99 && g.since < 5) P(`Tag ${d1}: automatische Gesamtanalyse (${who}) nach nur ${g.since} Runden (E-1008-13)`);
    else minGap = Math.min(minGap, own);
    if (g && gap < own - 0.01) {
      const m = `Tag ${d1}: die Gesamtanalyse von Tag ${d0} war auf dem Gerät (${who}) nicht mehr bekannt – nächste nach ${gap.toFixed(1)} Tagen`;
      if (restored(d0, d1)) console.log(m + " (Tagesstand geladen, erwartet)"); else P(m + " (Abgleich?)");
    }
  });
  const gd = Object.values(gemDay);
  console.log(`Gesamtanalysen: ${all.length} (${nAuto} automatisch, davon ${glob.filter(g => g.auto).length} mitgeschnitten; ${manual.size} von Hand)${Number.isFinite(minGap) ? `, kürzester Abstand automatisch ${minGap.toFixed(1)} Tage` : ""}; KI-Aufrufe je Lerntag: Ø ${gd.length ? (gd.reduce((a, b) => a + b, 0) / gd.length).toFixed(1) : 0}, höchstens ${gd.length ? Math.max(...gd) : 0}`);
}
if (PLACE && !caseRuleSeen) P("Einstufungstest: KI-Prüfung bekommt die Regel zur Groß-/Kleinschreibung nicht (E-1008-9)");
// Speicher (E-1008-19 Nr. 3)
if (storeLog.length) {
  const f = storeLog[0], l = storeLog[storeLog.length - 1], mx = storeLog.reduce((a, x) => (x.ls > a.ls ? x : a)), span = Math.max(1, l.day - f.day);
  console.log(`Speicher: Lernstand ${kb(f.s)} → ${kb(l.s)} KB, localStorage der App ${kb(f.ls)} → ${kb(l.ls)} KB (höchstens ${kb(mx.ls)} KB an Tag ${mx.day}, +${kb(((l.ls - f.ls) / span) * 30)} KB je 30 Tage), belegter Browser-Speicher ${l.use != null ? kb(l.use) + " KB" : "?"}; größte Schlüssel: ${(l.top || []).map(([k, n]) => k + " " + kb(n) + " KB").join(", ")}; größte Teile des Lernstands: ${(l.parts || []).map(([k, n]) => k + " " + kb(n) + " KB").join(", ")}`);
}

const secs = Math.round((Date.now() - t0) / 1000);
const OUTF = process.env.OUT || path.join(os.tmpdir(), "simulation-ergebnis.json");
fs.writeFileSync(OUTF, JSON.stringify({ daily, problems, gemCalls, gemDay, snapLog, repTimes: [...repTimes], snapLoadDays: [...snapLoadDays], verdicts: Object.keys(verdicts).length, cov: COV, need, tourDone, scen, scenOk, sim: lastSim, topics: tc, glob, storeLog, downloads, secs }, null, 1));
console.log("\nErgebnis: " + OUTF + "\nProbleme:", problems.length, "| Gemini-Aufrufe:", JSON.stringify(gemCalls), "| Dauer", secs, "s");
await browser.close(); server.close();
