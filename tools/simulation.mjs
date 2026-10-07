// Langzeit-Simulation der App (beide Apps der Lern-Engine): node tools/simulation.mjs
// Simuliert DAYS Tage (Standard 90) Lernen mit echten Inhalten, verschobener Uhr, nachgebautem Gemini, nachgebautem
// Claude (Urteile zu KI-Übungen) und zwei Geräten (PC täglich, Handy jeden 5. Tag) mit nachgebauter Supabase.
// Optionen (Umgebungsvariablen): DAYS=90, WEAK_TOPIC=<Themen-ID> (Standard: 7. Thema), NOMIX=<Tag> (ab diesem Tag keine
// gemischte Wiederholung → Langzeit-Check wird geprüft), OUT=<Datei> (Ergebnis als JSON, Standard: Temp-Ordner).
// Ändert keine Dateien im Repository. Ergebnis: Tagesprotokoll in der Konsole + „Probleme: N“.
// Eingebaute Schwächen:
//  W1 WEAK_TOPIC: Übungen bis Tag 40 meist falsch, danach gut
//  W2 fünf feste Vokabeln werden bis Tag 45 vergessen (in der Runde nach 2× gemerkt), danach gewusst
//  W3 freies Schreiben/Rollenspiel: KI ordnet Fehler WEAK_TOPIC zu
//  W4 Vergessen: Themen, die > 40 Tage nicht geübt wurden, sitzen schlechter
//  W5 Gerät B (Handy) lernt jeden 5. Tag zuerst → Abgleich darf nichts verlieren
//  W6 Störungen: Cloud hängt an Tag 33, Gemini überlastet an Tag 50–51, Skriptfehler-Probe an Tag 60
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
const DAYS = +(process.env.DAYS || 90);
const DAY = 86400000;
const log = [], problems = [];
const P = m => { problems.push(m); console.log("✗ " + m); };

/* ---------- Server: App (echte Inhalte) + Supabase-Nachbau ---------- */
const db = { progress: new Map(), hang: false };
const pgTime = ms => new Date(ms).toISOString().replace("Z", "+00:00");
let verdicts = {};
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname === "/lektionen/ki-pruefung.json") { res.writeHead(200, { "Content-Type": "application/json" }); return res.end(JSON.stringify(verdicts)); }
  if (u.pathname.startsWith("/sb/")) {
    if (db.hang) return;
    let body = ""; req.on("data", c => (body += c)); req.on("end", () => {
      const send = (code, obj) => { res.writeHead(code, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }); res.end(obj === undefined ? "" : JSON.stringify(obj)); };
      if (u.pathname.startsWith("/sb/auth/")) return send(200, { access_token: "t", refresh_token: "r", expires_in: 3600, user: { id: "u1" } });
      if (u.pathname === "/sb/rest/v1/snapshots") return send(req.method === "DELETE" ? 204 : 201);
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
  const type = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png" }[path.extname(f)] || "application/octet-stream";
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
  if (has("Starte ein kurzes Rollenspiel")) { k("rollenspiel-start"); return { scene: "Im Café " + Math.random().toString(36).slice(2, 5), role: "Kellner", goal: "bestellen", opener: "Hei! Mitä saisi olla?", opener_tr: "Hallo!" }; }
  if (has("Neue Antwort von")) { k("rollenspiel-zug"); return { ok: false, fix: "En halua kahvia.", note: "Verneinung", reply: "Selvä.", reply_tr: "OK", end: false, topics: [WEAK] }; }
  if (has("Ziel erreicht? Was war gut?")) { k("rollenspiel-ende"); return { goal: true, summary: "Gut.", tips: ["Verneinung"] }; }
  if (has("Bewerte jede markierte ZEILE")) { k("dialog"); return { lines: [{ n: 1, correct: false, correction: "En ole." }], feedback: "Fehler.", topics: [WEAK] }; }
  if (has("Aufgabentyp: Schreibaufgabe")) { k("schreibaufgabe"); return { correct: false, feedback: "Fehler", correction: "En ole.", topics: [WEAK] }; }
  if (has("Vokabelkarte")) { k("vokabel"); return { correct: false, feedback: "Nein." }; }
  k("sonst"); return { correct: false, feedback: "Leider falsch.", correction: "–" };
}

/* ---------- Geräte ---------- */
const CFG = { setupDone: true, sbUrl: URL0 + "sb", sbKey: "k", ai: { provider: "gemini", key: "sim" }, session: { access_token: "t", refresh_token: "r", expires_at: Date.now() + 36e5, user: { id: "u1" } } };
async function makeDevice(name) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(([cfg, key, weak]) => {
    window.__simWeak = weak;
    const off = +localStorage.getItem("__simOff") || 0, RD = Date, now = () => RD.now() + off;
    class D extends RD { constructor(...a) { super(...(a.length ? a : [now()])); } static now() { return now(); } }
    window.Date = D;
    window.OPI_SB_TIMEOUT = 1500;
    if (!localStorage.getItem(key + "-config")) localStorage.setItem(key + "-config", JSON.stringify(cfg));
  }, [CFG, KEYID, process.env.WEAK_TOPIC || ""]);
  await ctx.route("https://generativelanguage.googleapis.com/**", route => {
    if (geminiDown) return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: { message: "overloaded" } }) });
    const text = JSON.stringify(gemini(route.request().postData() || ""));
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }], usageMetadata: { promptTokenCount: 500, candidatesTokenCount: 80, thoughtsTokenCount: 10 } }) });
  });
  const page = await ctx.newPage();
  page.errs = [];
  page.on("pageerror", e => page.errs.push(e.message));
  page.on("dialog", d => d.dismiss());
  page.name = name;
  return page;
}
async function openDay(page, day) {
  await page.goto(URL0);
  await page.evaluate(o => localStorage.setItem("__simOff", String(o)), day * DAY);
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
  const day = Math.round((Date.now() - (window.__simStart || 0)) / 86400000);
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
  window.fillModel = ex => {
    if (ex.t === "mc") { document.querySelector(`.opt[data-id="${SESSION.cur.opts.findIndex(o => o.ok)}"]`).click(); return true; }
    if (ex.t === "tab") { const g = tabGaps(ex); document.querySelectorAll(".tcell").forEach((inp, k) => (inp.value = g[k][0])); }
    else if (ex.t === "ord") {
      const chips = SESSION.cur.chips, used = new Set(); let rest = norm(ex.a);
      while (rest) { const i = chips.findIndex((c, j) => !used.has(j) && (rest === norm(c) || rest.startsWith(norm(c) + " "))); if (i < 0) return false; used.add(i); SESSION.cur.picked.push(i); rest = rest.slice(norm(chips[i]).length).trim(); }
      renderEx && 0;
    }
    else if (ex.t === "les") SESSION.cur.qs.forEach((q, qi) => document.querySelector(`[data-act="lpick"][data-id="${qi}:${q.findIndex(o => o.ok)}"]`).click());
    else if (ex.t === "dlg") { const g = dlgGaps(ex); document.querySelectorAll(".dcell").forEach((inp, k) => (inp.value = g[k][0])); }
    else document.querySelector("#ans").value = ex.a[0];
    return false;
  };
  window.simWrong = async ex => {
    const r = Math.random();
    if (ex.t === "mc") { document.querySelector(`.opt[data-id="${SESSION.cur.opts.findIndex(o => !o.ok)}"]`).click(); return; }
    if (ex.t === "les") { SESSION.cur.qs.forEach((q, qi) => document.querySelector(`[data-act="lpick"][data-id="${qi}:${q.findIndex(o => !o.ok)}"]`).click()); return checkAnswer(); }
    if (r < 0.6 || ex.t === "ord") return dunno();
    if (ex.t === "tab") document.querySelectorAll(".tcell").forEach(i => (i.value = "zzz"));
    else if (ex.t === "dlg") document.querySelectorAll(".dcell").forEach(i => (i.value = "Minä ei ole zzz"));
    else if (document.querySelector("#ans")) document.querySelector("#ans").value = "Minä ei zzz";
    else return dunno();
    return checkAnswer();
  };
  /* eine Übungsrunde spielen; gibt Stats zurück */
  window.simRound = async (simDay, rate = true) => {
    const st = { n: 0, wrong: 0 };
    let guard = 0;
    while (SESSION && SESSION.kind === "topic" && SESSION.idx < SESSION.items.length && guard++ < 200) {
      const ex = SESSION.items[SESSION.idx], src = srcOf(S.active, SESSION.idx), retry = S.active.rt[SESSION.idx];
      const ok = retry ? Math.random() < 0.95 || guard > 120 : Math.random() < simP(src.tid, simDay);
      st.n++;
      if (ok) { if (!fillModel(ex)) await checkAnswer(); }
      else { st.wrong++; await simWrong(ex); }
      if (!SESSION) break;
      if (!SESSION.locked) { dunno(); }
      nextEx();
    }
    if (guard >= 200) st.stuck = true;
    if (rate && document.querySelector("#ratebox")) { const sc = SESSION ? SESSION.score : 1; await rateTopic(sc >= 0.9 ? "easy" : sc >= 0.75 ? "good" : sc >= 0.5 ? "hard" : "again"); }
    st.score = st.n ? 1 - st.wrong / st.n : 1;
    return st;
  };
  window.simVocab = async (simDay, limitN) => {
    let n = 0, again = 0;
    while (SESSION && SESSION.kind === "vocab" && SESSION.queue.length && n++ < (limitN || 400)) {
      const id = SESSION.queue[0], w = cardWord(id), c = S.cards[id];
      SIM.tries = SIM.tries || {}; const tk = id + "@" + simDay; SIM.tries[tk] = (SIM.tries[tk] || 0) + 1;
      const weak = simWeakWord(id) && simDay < WEAK_WORDS_UNTIL && SIM.tries[tk] < 3; // in der Runde nach 2× gemerkt, am nächsten Tag wieder vergessen
      const sinceLast = c.last ? (Date.now() - c.last) / 86400000 : 0;
      const pKnow = weak ? 0.05 : c.isNew ? 0.7 : Math.max(0.5, 0.97 - Math.max(0, sinceLast - (c.interval || 1)) * 0.02);
      const know = Math.random() < pKnow;
      const inp = document.querySelector("#ans");
      if (inp) inp.value = know ? (SESSION.dir === "fi" ? w[1] : w[0]) : "";
      flipCard();
      const k = !know ? "again" : Math.random() < 0.15 ? "hard" : Math.random() < 0.8 ? "good" : "easy";
      if (k === "again") again++;
      rateCard(k);
    }
    if (SESSION && SESSION.kind === "vocab") SESSION = null;
    return { n, again };
  };
};

/* ---------- ein Tag ---------- */
const daily = [];
async function dayA(page, day) {
  return page.evaluate(async day => {
    const out = { day, did: [], err: [] };
    const E = m => out.err.push(m);
    try {
      if (S.active) { openSession(); const r = await simRound(day); out.did.push("Fortsetzung " + JSON.stringify(r)); }
      // 1. fällige Themen
      for (const t of dueTopics().slice(0, 3)) {
        startSession(t.id, "review");
        if (SESSION.items.length > 8) E("Wiederholung mit " + SESSION.items.length + " Übungen");
        const r = await simRound(day); out.did.push(`Wdh ${t.id} ${Math.round(r.score * 100)}%`);
        if (r.stuck) E("Runde hängt: " + t.id);
      }
      // 2. Vokabeln
      startVocab(); if (SESSION && SESSION.kind === "vocab") { const v = await simVocab(day); out.did.push(`Vok ${v.n} (${v.again} nochmal)`); }
      // 3. neues Thema (Wörter zuerst, dann Übungen)
      const nt = nextNewTopic();
      if (nt && S.daily.newTopics < S.settings.newTopicsPerDay) {
        let g = 0;
        while (!vocabReady(nt.id) && g++ < 6) { startTopicVocab(nt.id); await simVocab(day, 300); }
        if (vocabReady(nt.id)) { startSession(nt.id, "learn"); const r = await simRound(day); out.did.push(`Neu ${nt.id} ${Math.round(r.score * 100)}%`); }
        else E("Themenwörter nach 6 Runden nicht fertig: " + nt.id);
      }
      // 4. gesperrtes Thema mit schwacher Voraussetzung: Freischaltversuch (alle 3 Tage)
      if (!nt && day % 3 === 0) {
        const lk = TOPICS.find(t => S.topics[t.id].status === "locked");
        if (lk) { const weak = lk.req.find(r => S.topics[r].status === "learning" && (S.topics[r].last || 0) < 0.8);
          if (weak) { startSession(weak, "unlock"); const r = await simRound(day); out.did.push(`Freischalt ${weak} ${Math.round(r.score * 100)}%`); } }
      }
      // 5. Fehler-Training
      if (openErrors().length && day % 2 === 0) { const before = openErrors().length; startErrors(); await simRound(day, false); out.did.push(`Fehler ${before}→${openErrors().length}`); }
      // 6. gemischte Wiederholung (jeden 2. Tag), Langzeit-Check wenn fällig
      if (learningTopics().length >= 2 && day % 2 === 1 && !(window.__noMixFrom && day >= window.__noMixFrom)) { startMix(); const r = await simRound(day, false); out.did.push(`Mix ${SESSION ? "?" : Math.round(r.score * 100) + "%"}`); if (S.mixDay !== todayKey()) E("Mix nicht als erledigt markiert"); }
      if (checkDue()) { const ct = checkTopics().map(t => t.id); startCheck(); await simRound(day, false); out.did.push("Langzeit-Check " + ct.join(",")); out.check = ct; }
      // 7. Problemwörter üben (jeden 4. Tag)
      if (day % 4 === 0 && weakCards().length) { startLeech(); if (SESSION && SESSION.kind === "vocab") { const v = await simVocab(day, 40); out.did.push(`Problemw ${v.n}`); } }
      // 8. freies Schreiben/Rollenspiel (wöchentlich), Themen ab 80 %
      if (day % 7 === 3) {
        const t = learningTopics().find(x => (S.topics[x.id].last || 0) >= 0.8);
        if (t && aiReady()) {
          await startWrite(t.id); if (SESSION && SESSION.kind === "write" && SESSION.task) { document.querySelector("#ans").value = "Minä ei ole kotona."; await checkWrite(); out.did.push("Schreiben " + t.id); }
          SESSION = null;
          await startChat(t.id); if (SESSION && SESSION.kind === "chat" && !SESSION.busy) { document.querySelector("#chatin").value = "Minä ei halua kahvia."; await sendChat(); await endChat(); out.did.push("Rollenspiel " + t.id); }
          SESSION = null;
        }
      }
      // 9. Feste Aufgaben von Claude (wöchentlich)
      if (day % 7 === 5) { const t = learningTopics().find(x => fixedPool(x.id).length); if (t) { startFixed(t.id); await simRound(day, false); out.did.push("AufgabenClaude " + t.id); } }
      // 10. Bericht bauen (Absturz-Probe)
      const rep = buildReport(); out.repLen = rep.length;
      A.tab("today"); A.tab("topics"); A.tab("vocab"); A.tab("progress"); A.tab("today");
      if (document.body.scrollWidth > 392) E("Ansicht breiter als 390 px");
    } catch (e) { E("Ausnahme: " + (e && e.stack || e)); }
    await new Promise(r => setTimeout(r, 300));
    flushSave && flushSave();
    out.snap = {
      learning: TOPICS.filter(t => S.topics[t.id].status === "learning").map(t => t.id).join(","),
      topics: Object.fromEntries(TOPICS.filter(t => S.topics[t.id].status === "learning").map(t => [t.id, { iv: S.topics[t.id].interval, last: S.topics[t.id].last, reps: S.topics[t.id].reps, due: Math.round((S.topics[t.id].due - Date.now()) / 86400000) }])),
      basics: basicsStatus(), lastRep: (S.reports[0] || {}).basicsSolid,
      cards: Object.keys(S.cards).length, learned: learnedWords(), dueCards: dueCards().length, leech: weakCards().length,
      leechIds: weakCards().map(([id]) => id), errors: openErrors().length, weak: (S.weak || []).length,
      weakT: (S.weak || []).filter(x => x.g.includes(window.__simWeakId)).length, appErr: (S.appErr || []).map(x => x.w + ": " + x.m),
      gen: (S.genReview || []).length, unrev: genUnreviewed().length, approvedUnseen: learningTopics().reduce((a, t) => a + approvedGen(t.id).length, 0),
      exLog: Object.keys(S.exLog || {}).length, size: JSON.stringify(S).length, reviews: S.stats.reviews, streak: streakNow(), genOn: genUnlocked(),
      longCheck: S.longCheck, glob: [S.sinceGlobal, S.lastGlobal, typeof GLOBAL_RUNNING !== "undefined" && GLOBAL_RUNNING, GLOBAL_FAILED_AT, aiReady()], sync: document.querySelector("#sync") ? document.querySelector("#sync").className : ""
    };
    return out;
  }, day);
}
async function dayB(page, day) {
  return page.evaluate(async day => {
    const out = { err: [] };
    try {
      startVocab(); if (SESSION && SESSION.kind === "vocab") { const v = await simVocab(day, 60); out.n = v.n; }
      await new Promise(r => setTimeout(r, 300)); flushSave && flushSave();
      out.reviews = S.stats.reviews; out.cards = Object.keys(S.cards).length;
      out.sample = Object.fromEntries(Object.entries(S.cards).filter(([, c]) => c.last && c.last > Date.now() - 3600e3).slice(0, 8).map(([id, c]) => [id, c.due]));
    } catch (e) { out.err.push("B: " + (e && e.stack || e)); }
    return out;
  }, day);
}

/* ---------- Ablauf ---------- */
const A = await makeDevice("PC"), B = await makeDevice("Handy");
const t0 = Date.now();
let bSample = null;
for (let day = 0; day < DAYS; day++) {
  db.hang = day === 33;
  geminiDown = day === 50 || day === 51;
  // simulierter Claude: jede Woche Bericht → Urteile (jede 5. KI-Übung fehlerhaft)
  if (day % 7 === 6) {
    const un = await A.evaluate(() => genUnreviewed().map(x => x.ex.gid)).catch(() => []);
    un.forEach((g, i) => (verdicts[g] = i % 5 === 4 ? { ok: false, korrektur: "olen", grund: "Sim" } : { ok: true }));
  }
  let bRes = null;
  if (day % 5 === 2 && day > 0) {
    await openDay(B, day);
    bRes = await dayB(B, day);
    await B.waitForTimeout(1500);
    bRes.err.forEach(e => P(`Tag ${day}: ${e}`));
    if (bRes.sample && Object.keys(bRes.sample).length) bSample = bRes.sample;
  }
  await openDay(A, day);
  if (!WEAK) WEAK = await A.evaluate(() => window.__simWeakId);
  if (process.env.NOMIX) await A.evaluate(d => (window.__noMixFrom = d), +process.env.NOMIX);
  if (bSample) {
    // Abgleich-Kontrolle: Karten, die das Handy gestern geübt hat, müssen auf dem PC angekommen sein
    const got = await A.evaluate(s => Object.entries(s).filter(([id, due]) => !S.cards[id] || S.cards[id].due < due).map(([id]) => id), bSample);
    if (got.length) P(`Tag ${day}: Abgleich verloren – Handy-Wiederholungen fehlen am PC: ${got.join(", ")}`);
    bSample = null;
  }
  if (day === 60) await A.evaluate(() => setTimeout(() => { throw new Error("Absturz-Probe Tag 60"); }, 0));
  const r = await dayA(A, day);
  await A.waitForTimeout(db.hang ? 2500 : 900); // Hochladen abwarten
  if (bRes) r.b = bRes.n;
  r.err.forEach(e => P(`Tag ${day}: ${e}`));
  [...A.errs.splice(0), ...B.errs.splice(0)].forEach(e => { if (!/Absturz-Probe/.test(e)) P(`Tag ${day}: JS-Fehler ${e}`); });
  daily.push(r);
  const s = r.snap;
  console.log(`T${String(day).padStart(2)} | ${r.did.join("; ").slice(0, 150)}${r.b ? " | Handy " + r.b : ""} | lernt ${s.learning.split(",").length} Themen, Karten fällig ${s.dueCards}, ⚠${s.leech}, Fehler ${s.errors}, KI ${s.unrev}u/${s.approvedUnseen}✓, ${Math.round(s.size / 1024)} KB`);
}
const secs = Math.round((Date.now() - t0) / 1000);
const OUTF = process.env.OUT || path.join(os.tmpdir(), "simulation-ergebnis.json");
fs.writeFileSync(OUTF, JSON.stringify({ daily, problems, gemCalls, verdicts: Object.keys(verdicts).length, secs }, null, 1));
console.log("\nErgebnis: " + OUTF + "\nProbleme:", problems.length, "| Gemini-Aufrufe:", JSON.stringify(gemCalls), "| Dauer", secs, "s");
await browser.close(); server.close();
