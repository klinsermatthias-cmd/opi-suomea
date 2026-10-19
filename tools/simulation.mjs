// Langzeit-Simulation der App (beide Apps der Lern-Engine): node tools/simulation.mjs
// Simuliert DAYS Tage (Standard 90) Lernen mit echten Inhalten, verschobener Uhr, nachgebautem Gemini, nachgebautem
// Claude (Urteile zu KI-Übungen) und zwei Geräten (PC täglich, Handy jeden 5. Tag) mit nachgebauter Supabase.
// Bedient wird die App wie von einem Menschen: über die Knöpfe (data-act), nicht über interne Funktionen.
// Optionen (Umgebungsvariablen): DAYS=90, WEAK_TOPIC=<Themen-ID> (Standard: 7. Thema), NOMIX=<Tag> (ab diesem Tag keine
// gemischte Wiederholung → Langzeit-Check wird geprüft), GAP=<von>-<bis> (Lernpause, Standard 120-133 bei ≥ 150 Tagen),
// OUT=<Datei> (Ergebnis als JSON, Standard: Temp-Ordner), APP_ROOT=<Ordner der anderen App>, SC_FROM=<Tag> (Szenarien
// W10–W13 frühestens ab diesem Tag, Standard 8), BAD_DAY=<Tag> (manipulierte lektionen.json, Standard 11).
// S-1014-14 (aus der Analyse D-1014-25): Lernschritte (steplearn bis zur Abschlussrunde), luk/zuo ausfüllen,
// Wiederholung ≤ 20, Langzeit-Check vor dem neuen Thema, Wortschatz-Pakete, Rundgang mit Prüfmodus/Fehler melden/
// Wortliste/Satzdiktat/Lesetext hören. Lernmodell-Modus (didaktische Prüfung): AURORA=<Profil> LERNMODELL=<Katalog>
// AUR_OUT=<JSONL> AUR_COACH=echt|ideal AUR_SEED=<n> – simulierte Lernende mit Können je Lernschritt, Vergessen,
// Fehlerkatalog, Zeitbudget je Tag und Coach-Nachbau. Katalog und Profile liegen nur im privaten Repo
// (lernprotokoll-privat, deutsch-trainer/simulation-2026-10/skripte/aurora-katalog.mjs).
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
//  Seit 12.10.2026 (Simulation an die Funktionen bis E-1010-6 angepasst):
//  W15 Cloud wie die echte Supabase (Mikrosekunden, Vergleiche gte/lt, E-1010-3); an CAS_DAY (13) übernimmt sie PATCH still
//      nicht → Ausweichweg per POST, am Tagesende hat die Cloud den Stand des PCs (E-1010-4)
//  W16 Rundgang „Nur vertippt und Noch nicht gelernt“: Tippfehler-Frage, umschaltbar bis „Weiter“ (E-1009-10, E-1010-5),
//      Ausrutscher gezählt, Länge ist kein Tippfehler; „Noch nicht gelernt?“ an/aus/an, steht im Bericht (E-1008-64, E-1009-3)
//  W17 Rundgang „Bericht in die Cloud“ (E-1010-6): Schalter an → Bericht des Tages in der Tabelle berichte, aus → kein neuer
//  W18 Rundgang „Stimme, Vorlesen, Eingabefelder“: Stimme wählen (E-1008-62), Vorlese-Knöpfe der Theorie (E-1008-51),
//      Antwortfelder ohne Autokorrektur, Rückwärts-Karten ohne Lösung in der Angabe (E-1008-57)
//  W19 (S-1012-106) „Wörter vorab lernen“ erzwingen: ab PV_FROM (Standard Tag 60 bei ≥ 90 Tagen, PV_FROM=0 = aus) fällt
//      eine Voraussetzung in drei Freischalt-Runden absichtlich durch (erster Versuch falsch) → prevocab muss erscheinen
//  W20 (S-1012-115) Grenzfälle: OFFLINE_A/OFFLINE_B (Gerät tagelang ohne Cloud, danach Abgleich), GEM_DOWN (Gemini
//      mehrere Tage weg), QUOTA_DAY (localStorage voll: Arbeit des Tages muss am nächsten Morgen noch da sein)
//  W21 (S-1012-116) Lernprofile: P_BASE (Treffsicherheit, Standard 0.9), HANDY_EVERY (Handy jeden n-ten Tag, 1 = täglich)
//  Auswertung: Themen-Abdeckung (erreicht/gelernt/≥ 80 %), Speichergröße je Tag, KI-Aufrufe je Tag, gelernte Themen
//  gehen nie verloren (außer „Thema zurücksetzen“)
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import os from "node:os";
import vm from "node:vm";
// D-1014-37/-38 (Chat Deutsch-Trainer, nur Simulation): im Lernmodell-Modus FOKUS=grammatik → fällige Grammatik-Wiederholungen
// und der neue Lernschritt kommen zuerst; Vokabeln, Wiederholungen der Wortschatz-Pakete und neue Pakete nur mit der
// restlichen Zeit des Tages. WORTPAKETE=immer (Standard, wie bisher) | selten (nur mit ≥ 10 min Restzeit, höchstens
// eines je 60 Tage) | nie. Gemini-Nachbau: kleine Fehler (Groß-/Kleinschreibung, du/Sie) in Schreibaufgaben gelten als
// „richtig mit Fehlerart“ (S-1014-20), falsche Lücken-/Übersetzungsantworten bekommen eine Fehlerart (Sätze, ki.js „satz“).
// S-1014-14: Lernmodell-Modus (aus der Analyse D-1014-25). Fehlerkatalog, Startkönnen, Lernprofile und Zeitannahmen
// liegen NICHT im Repo (sie beruhen auf Ergebnissen der Lernenden) – LERNMODELL=<Pfad zur Katalog-Datei> im privaten Repo.
import { pathToFileURL } from "node:url";
const AURK = process.env.LERNMODELL ? await import(pathToFileURL(path.resolve(process.env.LERNMODELL)).href) : { PROFILES: {} };
const AURP = process.env.AURORA ? AURK.PROFILES[process.env.AURORA] : null;
if (process.env.AURORA && !AURP) throw new Error("AURORA=<Profil aus LERNMODELL> (z. B. regel|real|knapp) und LERNMODELL=<Katalog-Datei> nötig");
const AUR_SEED = +(process.env.AUR_SEED || 1);
const AUR_MINOR = ["grossKlein", "register"];
let aurTitleMap = null;
const aurTitles = () => aurTitleMap || (aurTitleMap = Object.fromEntries((j => (Array.isArray(j) ? j : j.topics || []))(JSON.parse(fs.readFileSync(path.join(ROOT, "lektionen/lektionen.json"), "utf8"))).map(t => [t.title, t.id])));
const aurHash = (d, k) => { const x = Math.sin((d + 1) * 12.9898 + AUR_SEED * 78.233 + k * 3.17) * 43758.5453; return x - Math.floor(x); };
const aurInGap = d => !!AURP && AURP.gaps.some(([a, b]) => d >= a && d <= b);
const AUR_DAYS = new Proxy({}, { get: (o, d) => (AURP ? +d === 0 || (!aurInGap(+d) && aurHash(+d, 1) < AURP.p(+d)) : true) });
const aurBudget = d => Math.round((AURP.min[0] + aurHash(d, 2) * (AURP.min[1] - AURP.min[0])) * 60);
const AUR_OUT = process.env.AUR_OUT || "/tmp/aurora-tage.jsonl";
const aurCoach = [];
if (AURP) fs.writeFileSync(AUR_OUT, "");
/* Fehler aus dem Katalog in einem KI-Auftrag finden (nur falsche Sätze von Aurora) */
function aurFind(body) {
  const out = [];
  for (const [name, a] of Object.entries(AURK.AREAS)) if (a.s.some(p => body.includes(p[0]))) out.push(name);
  return out;
}
/* Coach-Nachbau „ideal“: erkennt jeden Katalogfehler und nennt das Thema, das die Regel lehrt (die App nimmt davon nur
   gelernte Themen, höchstens 3). So misst die Simulation, was die App aus richtigen Zuordnungen macht; wie gut echte
   Modelle zuordnen, misst der Coach-Test (coach-test/). */
function aurGemini(body, k, has) {
  const found = aurFind(body);
  // Fehlerarten (S-1014-4, ab deutsch-trainer 2d4b597): Art je Katalogbereich
  const KIND = { habenSein: "Hilfsverb haben/sein", adjektiv: "Adjektivendung", dativ: "Kasus (Akkusativ/Dativ)", akkusativ: "Kasus (Akkusativ/Dativ)", dativVerb: "Kasus (Akkusativ/Dativ)", pronomen: "Kasus (Akkusativ/Dativ)", reflexiv: "Kasus (Akkusativ/Dativ)", possessiv: "Kasus (Akkusativ/Dativ)", demonstrativ: "Kasus (Akkusativ/Dativ)", genitiv: "Kasus (Akkusativ/Dativ)", relativ: "Kasus (Akkusativ/Dativ)", verbZwei: "Verbstellung", nebensatz: "Verbstellung", genus: "Artikel/Genus", plural: "Pluralform", grossKlein: "Groß-/Kleinschreibung", register: "Groß-/Kleinschreibung", partizip: "Konjugation/Verbform", praetModal: "Konjugation/Verbform", imperativ: "Konjugation/Verbform", konj2: "Konjugation/Verbform", passiv: "Konjugation/Verbform", praepFest: "Präposition", wechselpraep: "Präposition", verbPraep: "Präposition", seitVor: "Präposition", alsWenn: "Wortwahl", bevorNachdem: "Wortwahl", konnektor: "Wortwahl", nomenVerb: "Wortwahl", zuInf: "Rechtschreibung" };
  // AUR_COACH=echt: Fehler ohne Thema ordnet Coach wie Gemini 3 Flash im Coach-Test einem Nachbarthema zu (5/5 Fälle)
  const ECHT = AURK.ECHT || { adjektiv: () => (Math.random() < 0.5 ? "d05b" : "d05"), wechselpraep: () => (Math.random() < 0.5 ? "d05" : "d09b"), verbPraep: () => "d09", register: () => "d06", genitiv: () => "d05b", relativ: () => "d06" };
  const tagOf = f => AURK.AREAS[f].tid || (process.env.AUR_COACH === "echt" && ECHT[f] ? ECHT[f]() : null);
  const topics = [...new Set(found.map(tagOf).filter(Boolean))].slice(0, 3);
  const kinds = [...new Set(found.map(f => KIND[f] || "neu: " + f))].slice(0, 3);
  const L = kind => aurCoach.push({ day: simDayNow, kind, labels: found, topics, minor: minor ? 1 : 0 });
  // D-1014-34: ein einzelner kleiner Fehler (AUR_MINOR) in einer Schreibaufgabe → „richtig“, aber mit Fehlerart
  const minor = found.length === 1 && AUR_MINOR.includes(found[0]) && has("Aufgabentyp: Schreibaufgabe");
  // D-1014-34: Lücke/Übersetzung falsch → Fehlerart des Themas (Sätze); das Thema steht als Titel im Auftrag
  const sm = has("Aufgabentyp: Lückentext") || has("Aufgabentyp: Übersetzung") ? body.match(/Thema: ([^\n\\]+)/) : null;
  if (sm) {
    const tid = aurTitles()[sm[1].trim()], area = Object.keys(AURK.AREAS).find(n => AURK.AREAS[n].tid === tid);
    k("pruefung"); aurCoach.push({ day: simDayNow, kind: "satz", labels: area ? [area] : [], topics: tid ? [tid] : [], tid });
    return { correct: false, feedback: "Leider falsch (Sim).", correction: "–", kinds: area && KIND[area] ? [KIND[area]] : [] };
  }
  const errs = found.map(f => { const p = AURK.AREAS[f].s.find(p => body.includes(p[0])); return { wrong: p[0], right: p[1], why: f }; });
  if (has("Korrigiere den Text wie")) { k("schreiben-korrektur"); L("schreiben"); return { correct: !found.length, corrected: "(korrigiert)", errors: errs, feedback: found.length ? "Ein paar Fehler – schau dir die Korrekturen an." : "Sehr gut, alles richtig!", topics, kinds }; }
  if (has("kurze Schreibaufgabe")) { k("schreiben-aufgabe"); return { task: "Schreib 4–5 Sätze über deine Woche: Was hast du gemacht, was hast du vor?", words: [], sample: "Am Montag bin ich mit dem Zug nach Linz gefahren." }; }
  if (has("Aufgabentyp: Schreibaufgabe")) { k("schreibaufgabe"); L("schreibaufgabe"); return { correct: !found.length || minor, feedback: found.length ? "Fehler: " + errs.map(e => e.right).join(" ") : "Richtig.", correction: errs.map(e => e.right).join(" "), topics, kinds }; }
  if (has("Bewerte jede markierte ZEILE")) {
    k("dialog"); L("dialog");
    const ns = [...new Set([...body.matchAll(/ZEILE (\d+)/g)].map(m => +m[1]))];
    return { lines: (ns.length ? ns : [1]).map(n => ({ n, correct: !found.length, correction: errs.length ? errs[0].right : "" })), feedback: found.length ? "Da ist ein Fehler." : "Passt.", topics, kinds };
  }
  if (has("Starte ein kurzes Rollenspiel")) { k("rollenspiel-start"); return { scene: "Beim Hausarzt " + Math.random().toString(36).slice(2, 5), role: "Ordinationsassistentin", goal: "einen Termin vereinbaren", opener: "Grüß Gott, was kann ich für Sie tun?", opener_tr: "Hello, how can I help you?" }; }
  if (has("Neue Antwort von")) { k("rollenspiel-zug"); L("rollenspiel"); return { ok: !found.length, fix: errs.map(e => e.right).join(" "), note: found.join(", "), reply: "Alles klar, danke.", reply_tr: "All right, thanks.", end: false, topics, kinds }; }
  if (has("Erstelle 7 NEUE")) {
    k("generieren"); genCounter++;
    const ex = [];
    for (let i = 0; i < 5; i++) ex.push({ t: "gap", q: `KI-Übung ${genCounter}-${i}: Gestern ___ ich zu Hause geblieben.`, h: "Perfekt: haben oder sein?", a: ["bin"] });
    ex.push({ t: "mc", q: `KI-Regelfrage ${genCounter}: Welches Hilfsverb hat „bleiben“?`, o: ["sein", "haben", "werden"], a: 0, x: "bleiben → sein" });
    return { ex };
  }
  if (has("reschedule")) { k("gesamtanalyse"); return { level: "B1", summary: "Simulation.", strengths: ["Lesen"], weaknesses: [], tips: ["Weiter so"], reschedule: [], skills: {}, nextFocus: "Weiter so", basicsSolid: false, basicsReason: "Simulation" }; }
  if (has("intervalDays")) { k("rundenauswertung"); return { feedback: "Gut gemacht.", tips: ["Fehler nochmal ansehen"], reason: "Plan übernommen" }; }
  return null;
}
async function aurInject(page, day) {
  const cfg = { day, budget: aurBudget(day), cat: AURK.AREAS, init: AURK.topicInit(), typeMod: AURK.TYPEMOD, secs: AURK.SECS, forced: AURK.FORCED, fokus: process.env.FOKUS || "", wp: process.env.WORTPAKETE || "immer" };
  await page.evaluate(([c, src]) => { window.__AURcfg = c; (0, eval)(src); }, [cfg, "(" + aurBrowser.toString() + ")()"]);
  if (process.env.AUR_DEBUG && !page.__aurDbg) {
    page.__aurDbg = setInterval(() => page.evaluate(() => JSON.stringify({ tab: CUR && CUR.tab, arg: CUR && CUR.arg, se: SESSION ? { kind: SESSION.kind, mode: SESSION.mode, idx: SESSION.idx, n: (SESSION.items || SESSION.queue || []).length, t: SESSION.items && SESSION.items[SESSION.idx] && SESSION.items[SESSION.idx].t, busy: SESSION.busy, locked: SESSION.locked } : null, btns: [...document.querySelectorAll("[data-act]")].map(b => b.dataset.act).slice(0, 15).join(","), fb: ((document.querySelector("#fb") || {}).textContent || "").slice(0, 120), used: window.__AUR && __AUR.left() })).then(x => console.log("DBG", x)).catch(e => console.log("DBG err", String(e).slice(0, 100))), 15000);
  }
}
function aurRecord(day, r) {
  const coach = aurCoach.splice(0);
  fs.appendFileSync(AUR_OUT, JSON.stringify({ day, did: r.did, err: r.err, aur: r.aur, coach }) + "\n");
}
/* ---------- Browser: Lernmodell ---------- */
function aurBrowser() {
  const C = window.__AURcfg, DAYMS = 86400000;
  SIM.aur = SIM.aur || { sk: {}, th: {}, ld: 0, fd: {} };
  const AS = SIM.aur;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const used = { s: 0 }, skipped = [], steps = [], log = [], free = [];
  window.__AUR = {
    spend: t => (used.s += C.secs[t] || 30),
    left: () => C.budget - used.s,
    cardsLeft: () => Math.max(10, Math.floor((C.budget - used.s) / C.secs.card)),
    skip: w => skipped.push(w),
    stepTry: (tid, k, sc) => steps.push([tid, k, Math.round(sc * 100)])
  };
  const stepOf = (tid, ei) => {
    const st = topicSteps(T(tid));
    if (!st || ei < 0) return "x";
    const i = st.findIndex(x => x.ex.includes(ei));
    return i < 0 ? "x" : i;
  };
  const topicKeys = tid => { const st = topicSteps(T(tid)); return st ? st.map((_, i) => tid + ":" + i) : [tid + ":x"]; };
  const sk = key => {
    if (!AS.sk[key]) {
      const [tid, k] = key.split(":"), b = clamp((C.init[tid] ?? 0.4) + (k === "0" ? 0.05 : 0), 0.03, 0.95);
      AS.sk[key] = { b, s: b, st: 3, t: Date.now(), pd: 0, ld: -1 };
    }
    return AS.sk[key];
  };
  const eff = o => o.b + (o.s - o.b) * Math.exp(-Math.max(0, Date.now() - o.t) / (o.st * DAYMS));
  const learn = (o, gain) => {
    const e = eff(o);
    o.s = clamp(e + gain * (1 - e), 0, 0.98);
    o.t = Date.now();
    if (o.ld !== C.day) { if (o.ld >= 0) o.st = Math.min(400, o.st * 1.7); o.pd++; o.ld = C.day; }
  };
  const topicEff = tid => { const ks = topicKeys(tid).filter(k => AS.sk[k]); return ks.length ? ks.reduce((a, k) => a + eff(AS.sk[k]), 0) / ks.length : C.init[tid] ?? 0.4; };
  const areaEff = name => {
    const a = C.cat[name];
    if (!a.tid) return clamp(a.init + 0.0004 * C.day, 0, 0.9); // ohne Thema: nur langsam durch Alltag
    const st = S.topics[a.tid], started = topicKeys(a.tid).some(k => AS.sk[k] && AS.sk[k].pd > 0);
    // „also“: Grundregel wird schon in einem anderen Lernschritt gelehrt (haben/sein in d01 Schritt 4)
    const alsoKey = a.also ? a.also[0] + ":" + a.also[1] : null, alsoEff = alsoKey && AS.sk[alsoKey] && AS.sk[alsoKey].pd > 0 ? eff(AS.sk[alsoKey]) - 0.1 : 0;
    if (!st || !started) return Math.max(a.init, alsoEff);
    return clamp(Math.max(alsoEff, topicEff(a.tid) + (a.init - (C.init[a.tid] ?? a.init))), 0.02, 0.97);
  };
  window.AURok = (ex, src, retry, guard) => {
    const tid = src.tid, k = ex.gid && src.ei < 0 ? "g" : stepOf(tid, src.ei), key = tid + ":" + k;
    if (SESSION && SESSION.mode === "step" && S.active && Number.isInteger(S.active.step)) {
      const tk = tid + ":" + S.active.step; // Theorie des Schritts gelesen
      if (!AS.th[tk]) { AS.th[tk] = C.day + 1; learn(sk(tk), 0.35); }
    } else if (SESSION && SESSION.mode === "learn" && !topicSteps(T(tid)) && !AS.th[tid + ":x"]) { AS.th[tid + ":x"] = C.day + 1; learn(sk(tid + ":x"), 0.35); }
    const e = k === "x" || k === "g" ? topicEff(tid) : eff(sk(key));
    const L = (S.exLog || {})[exKey(src, ex)];
    const p0 = clamp(e + (C.typeMod[ex.t] || 0), 0.03, 0.97);
    const lastOk = L && L.n && ((L.c || 0) > 0 || ((L.z || 0) > 0 && (L.r ?? 1) < 0.3));
    const memo = lastOk ? 0.25 * Math.exp(-Math.max(0, Date.now() - (L.s || 0)) / (14 * DAYMS)) * Math.min(1, L.n / 3) : 0;
    let p = clamp(p0 + memo, 0.03, 0.97);
    if (retry) p = Math.max(p, 0.85);
    if (guard > 120) p = 1;
    const ok = Math.random() < p;
    window.__AURcur = { key, k, p0, p, memo, seen: L ? L.n : 0, t0: L ? L.s : 0 };
    return ok;
  };
  const MUT = {
    d01b: [[/\bbin\b/, "habe"], [/\bist\b/, "hat"], [/\bsind\b/, "haben"], [/\bbist\b/, "hast"], [/\bwar\b/, "hatte"]],
    d01: [[/\bge(\p{L}+)en\b/u, "ge$1t"], [/\bge(\p{L}+)t\b/u, "ge$1en"]],
    d03: [[/\bals\b/i, "wenn"], [/\bwenn\b/i, "wann"], [/\bkonnte\b/, "könnte"], [/\bmusste\b/, "müsste"]],
    d03b: [[/\bbevor\b/i, "vor"], [/\bnachdem\b/i, "nach"], [/\bwar\b/, "habe"], [/\bhatte\b/, "habe"]],
    d04: [[/\bdie\b/i, "der"], [/\bdas\b/i, "der"], [/\bder\b/i, "die"], [/\beine\b/, "ein"]],
    d04b: [[/(\p{L}{3,})(er|en|e|n|s)\b/u, "$1"]],
    d05: [[/\beinen\b/, "ein"], [/\bden\b/, "der"], [/\bkeinen\b/, "kein"], [/\bmeinen\b/, "mein"]],
    d05b: [[/\bdem\b/, "den"], [/\beinem\b/, "einen"], [/\bmeiner\b/, "meine"], [/\bder\b/, "die"], [/\beiner\b/, "eine"]],
    d06: [[/\bmir\b/, "mich"], [/\bdir\b/, "dich"], [/\bihm\b/, "ihn"], [/\bihr\b/, "sie"]],
    d06b: [[/\bmir\b/, "mich"], [/\bdir\b/, "dich"], [/\bihm\b/, "ihn"], [/\bIhnen\b/, "Sie"]],
    d07: [[/\bmeiner\b/, "meinen"], [/\bkeiner\b/, "keinen"], [/\beiner\b/, "einen"], [/\bmeins\b/, "mein"]],
    d07b: [[/\bden\b/i, "der"], [/\bdem\b/i, "der"], [/\bdenen\b/i, "den"]],
    d08: [[/\bgib\b/i, "gebe"], [/\bnimm\b/i, "nehme"], [/\bseid\b/i, "sind"], [/\bsei\b/i, "bist"], [/\blies\b/i, "lese"]],
    d08b: [[/\bmir\b/, "mich"], [/\bdir\b/, "dich"], [/\bsich\b/, "ihn"]],
    d09: [[/\bzum\b/i, "nach"], [/\bzur\b/i, "nach"], [/\bmit dem\b/, "mit den"], [/\bfür den\b/, "für dem"]],
    d09b: [[/\bseit\b/i, "vor"], [/\bnach Hause\b/, "zu Hause"], [/\bvor\b/i, "seit"]],
    d02: [[/^(\S+) (\S+) (\S+)/, "$1 $3 $2"]],
    d02b: [[/(\S+) (\S+)([.?!]?)$/, "$2 $1$3"]]
  };
  const mutate = (a, tid) => {
    for (const [re, to] of MUT[tid] || []) if (re.test(a)) return a.replace(re, to);
    const m = a.match(/(\p{L}{3,})(en|em|er|e)\b/u);
    return m ? a.replace(m[0], m[1] + { en: "e", em: "en", er: "en", e: "en" }[m[2]]) : null;
  };
  window.AURplan = (ex, src, info, ok) => {
    if (ex.t === "sch") {
      // zweiter Versuch in der Runde: Aurora übernimmt die Korrektur von Coach (meist fehlerfrei)
      const lk = src.tid + ":" + src.ei;
      if (info.retry && window.__AURsch && window.__AURsch[lk] && Math.random() < 0.85) return { text: window.__AURsch[lk], expect: true, why: "Coach-Nachbau: korrigierter Text als falsch gewertet", aurLabels: [] };
      const tx = AURtext(src.tid, 3, "schreibaufgabe");
      (window.__AURsch = window.__AURsch || {})[lk] = tx.right;
      return { text: tx.text, expect: !tx.labels.length || (tx.labels.length === 1 && ["grossKlein", "register"].includes(tx.labels[0])), why: "Coach-Nachbau: Schreibaufgabe falsch bewertet", aurLabels: tx.labels };
    }
    if (!ok && !info.retry && (ex.t === "gap" || ex.t === "tr") && typeof (ex.a || [])[0] === "string" && Math.random() > 0.15) {
      const w = mutate(ex.a[0], src.tid);
      if (w && norm(w) !== norm(ex.a[0]) && !ex.a.some(a => norm(a) === norm(w))) {
        const claim = Math.random() < 0.1; // gibt sich manchmal „Nur vertippt“, obwohl es ein Fehler war
        return { text: w, expect: false, self: claim, why: "Aurora-Fehlantwort wurde als richtig gewertet: „" + w + "“" };
      }
    }
    return null;
  };
  window.AURafter = (ex, src, retry, res, ok, plan) => {
    const c = window.__AURcur || {};
    __AUR.spend(ex.t);
    const correct = res ? !!res.correct : ok;
    if (c.k === "x" || c.k === "g") topicKeys(src.tid).forEach(kk => learn(sk(kk), correct ? 0.015 : 0.03));
    else if (c.key) learn(sk(c.key), correct ? 0.04 * (c.p ? c.p0 / c.p : 1) : 0.08);
    log.push([src.tid, src.ei, ex.t, SESSION ? SESSION.mode : "?", retry ? 1 : 0, correct ? 1 : 0, c.seen || 0, Math.round((c.p0 || 0) * 100), Math.round((c.p || 0) * 100), c.t0 ? Math.round((Date.now() - c.t0) / DAYMS) : -1, ex.gid ? 1 : 0, plan && plan.aurLabels ? plan.aurLabels.join("+") : ""]);
  };
  window.AURwrongLine = ex => {
    const tid = (SESSION && S.active && srcOf(S.active, SESSION.idx).tid) || "", a = Object.values(C.cat).find(x => x.tid === tid) || C.cat.habenSein;
    return a.s[Math.floor(Math.random() * a.s.length)][0];
  };
  const pickArea = (names, excl) => {
    const L = names.filter(n => !excl.includes(n)), tot = L.reduce((a, n) => a + C.cat[n].w, 0);
    let r = Math.random() * tot;
    for (const n of L) if ((r -= C.cat[n].w) <= 0) return n;
    return L[0];
  };
  window.AURtext = (focusTid, n, kind) => {
    const names = Object.keys(C.cat), chosen = [];
    const focus = names.filter(x => C.cat[x].tid === focusTid || (C.cat[x].also && C.cat[x].also[0] === focusTid));
    // Schreibaufgabe im Thema: Sätze zum Thema, nur manchmal einer außerhalb; freies Schreiben/Rollenspiel: 2 bzw. 1 zum Thema
    const nFocus = kind === "schreibaufgabe" ? (Math.random() < 0.4 ? n - 1 : n) : kind === "rollenspiel" ? 1 : 2;
    for (let i = 0; i < nFocus && focus.length; i++) chosen.push(focus[Math.floor(Math.random() * focus.length)]);
    while (chosen.length < n) chosen.push(pickArea(names, chosen));
    const forced = [];
    (C.forced || []).forEach(F => {
      if (C.day < F.from || C.day > F.to || (F.once && AS.fd[F.id]) || Math.random() >= F.p) return;
      AS.fd[F.id] = (AS.fd[F.id] || 0) + 1;
      forced.push(F.area);
      if (!chosen.includes(F.area)) chosen.push(F.area);
    });
    const labels = [], parts = [], right = [];
    for (const name of chosen) {
      const a = C.cat[name], p = a.s[Math.floor(Math.random() * a.s.length)];
      const wrong = forced.includes(name) || Math.random() > areaEff(name);
      parts.push(wrong ? p[0] : p[1]);
      right.push(p[1]);
      if (wrong) labels.push(name);
    }
    free.push({ kind, focus: focusTid, labels, forced, n: chosen.length });
    return { text: parts.join(" "), labels, right: right.join(" ") };
  };
  window.AURfree = async (day, out) => {
    AS.ld++;
    if (AS.ld % 3 !== 0 || __AUR.left() < 240 || !aiReady()) return;
    const L = learningTopics();
    if (!L.length) return;
    const t = L[Math.floor(Math.random() * L.length)];
    const txt = () => document.querySelector("#app").textContent;
    A.tab("topics"); clk("topic", t.id);
    if (!simHas("pwrite", t.id)) { out.did.push("kein freies Schreiben bei " + t.id); return; }
    clk("pwrite", t.id);
    await simWait(() => simHas("pwcheck") || /nicht erreichbar/.test(txt()), 30000);
    if (simHas("pwcheck")) {
      const tx = AURtext(t.id, 5, "schreiben");
      typeIn("#ans", tx.text); clk("pwcheck");
      await simWait(() => !SESSION || (!SESSION.busy && document.querySelector("#fb .fb, #fb .card")), 30000);
      __AUR.spend("sch");
      out.did.push(`Freies Schreiben ${t.id} (${tx.labels.length} Fehler)`);
    }
    SESSION = null;
    if ((AS.ld / 3) % 2 === 0 && __AUR.left() > 120) {
      A.tab("topics"); clk("topic", t.id); clk("pchat", t.id);
      await simWait(() => document.querySelector("#chatin") || /nicht erreichbar/.test(txt()), 30000);
      if (document.querySelector("#chatin")) {
        for (let i = 0; i < 2; i++) { const tx = AURtext(t.id, 2, "rollenspiel"); typeIn("#chatin", tx.text); clk("pcsend"); await simWait(() => !SESSION || !SESSION.busy, 30000); }
        clk("pcend"); await simWait(() => !SESSION || !SESSION.busy, 30000);
        __AUR.spend("dlg");
        out.did.push("Rollenspiel " + t.id);
      }
      SESSION = null;
    }
  };
  window.AURday = day => {
    const wp = weakPlan(), now = Date.now();
    const o = {
      used: used.s, budget: C.budget, skipped, steps, log, free,
      topics: TOPICS.map(t => { const s = S.topics[t.id]; return [t.id, s.status, s.st || 0, s.last == null ? null : Math.round(s.last * 100), s.due ? Math.round((topicDue(t.id, wp) - now) / DAYMS) : null, s.interval || 0, s.reps || 0, (s.hist || []).length]; }),
      weak: (S.weak || []).length, weakToday: (S.weak || []).filter(x => x.d >= startOfDay()).map(x => [x.k, x.tid, x.g, x.f || []]),
      wp: Object.keys(wp).filter(id => wp[id].moved), errors: openErrors().length, learned: learnedWords(), cards: Object.keys(S.cards).length,
      dueCards: dueCards().length, gen: (S.genReview || []).reduce((a, x) => a + x.ex.length, 0), genOk: learningTopics().reduce((a, t) => a + approvedGen(t.id).length, 0),
      streak: streakNow(), avail: Object.fromEntries(learningTopics().map(t => [t.id, topicAvail(t.id)]))
    };
    if (day % 7 === 0) o.skill = { t: Object.fromEntries(TOPICS.map(t => [t.id, Math.round(topicEff(t.id) * 100)])), a: Object.fromEntries(Object.keys(C.cat).map(n => [n, Math.round(areaEff(n) * 100)])) };
    if (day % 30 === 29) o.report = buildReport();
    return o;
  };
}

// APP_ROOT=<Ordner>: andere App derselben Engine simulieren (z. B. ../deutsch-trainer) – mit dieser Fassung der Simulation
const ROOT = process.env.APP_ROOT ? path.resolve(process.env.APP_ROOT) : path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const APPX = vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8") + "\n;APP");
const KEYID = APPX.id;
const PLACE = !!(APPX.features && APPX.features.placement);
const DAYS = +(process.env.DAYS || 90);
const DAY = 86400000;
const [GAP_FROM, GAP_TO] = (process.env.GAP || (DAYS >= 150 ? "120-133" : "")).split("-").map(Number);
const inGap = d => GAP_FROM >= 0 && GAP_TO >= GAP_FROM && d >= GAP_FROM && d <= GAP_TO;
const REVEAL_DAY = AURP ? 0 : 25;
const SC_FROM = +(process.env.SC_FROM || 8), BAD_DAY = +(process.env.BAD_DAY || 11), CAS_DAY = +(process.env.CAS_DAY || 13);
// W19 (S-1012-106): ab diesem Tag fällt eine Voraussetzung absichtlich 3× durch → „Wörter vorab lernen“ (0 = aus)
const PV_FROM = +(process.env.PV_FROM || (DAYS >= 90 ? 60 : 0));
/* W20/W21 (S-1012-115/-116): Grenzfälle und Lernprofile, alle aus = Standardlauf wie bisher.
   OFFLINE_A / OFFLINE_B=<von>-<bis>: PC bzw. Handy ohne Cloud (Anfragen brechen ab); Handy-Wiederholungen dieser Tage
   müssen nach der Rückkehr am PC ankommen. GEM_DOWN=<von>-<bis>: Gemini mehrere Tage überlastet (503).
   QUOTA_DAY=<Tag>: am PC schlägt an diesem Tag jedes Schreiben in den localStorage fehl (Speicher voll) – die Arbeit des
   Tages darf trotzdem nicht verloren gehen. P_BASE=0.9: Treffsicherheit der Lernenden (Profil langsam ≈ 0.65, schnell
   ≈ 0.97). HANDY_EVERY=5: Handy lernt jeden n-ten Tag (1 = täglich). */
const rangeOf = s => { const m = String(s || "").match(/^(\d+)-(\d+)$/); return m ? [+m[1], +m[2]] : null; };
const inR = (d, r) => !!r && d >= r[0] && d <= r[1];
const OFF_A = rangeOf(process.env.OFFLINE_A), OFF_B = rangeOf(process.env.OFFLINE_B), GEM_DOWN = rangeOf(process.env.GEM_DOWN);
const QUOTA_DAY = +(process.env.QUOTA_DAY || 0), P_BASE = +(process.env.P_BASE || 0.9), HANDY_EVERY = Math.max(1, +(process.env.HANDY_EVERY || 5));
const offline = {};
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
/* S-1014-14: Lernschritte und Wortschatz-Pakete gibt es nur, wenn die Inhalte sie haben */
{ const L = Array.isArray(LESSONS) ? LESSONS : LESSONS.topics || [];
  if (!L.some(t => Array.isArray(t.steps))) EXEMPT.steplearn = "keine Inhalte mit Lernschritten (steps)";
  if (!L.some(t => t.wort)) EXEMPT.wordpack = "keine Wortschatz-Pakete (wort: true) in den Inhalten"; }

/* ---------- Server: App (echte Inhalte) + Supabase-Nachbau ---------- */
const db = { progress: new Map(), snaps: new Map(), berichte: new Map(), hang: false, casSilent: false };
const snapLog = []; // jeder hochgeladene Tagesstand: Simulationstag, Schlüssel, Wiederholungen
const sbLog = {}; // Anfragen an die Cloud-Zeile je Simulationstag (PATCH ok/verfehlt, GET, POST)
const sbCount = k => { const d = (sbLog[simDayNow] = sbLog[simDayNow] || { patchOk: 0, patchMiss: 0, get: 0, post: 0 }); d[k]++; };
const pgTime = ms => new Date(ms).toISOString().replace("Z", "+00:00");
const pgTimeUs = row => (row.us ? pgTime(row.at).replace(/(\.\d{3})/, "$1" + String(row.us).padStart(3, "0")) : pgTime(row.at));
const usOf = t => { const m = String(t).match(/\.(\d+)/); return Date.parse(t) * 1000 + (m ? Number((m[1] + "000000").slice(3, 6)) : 0); };
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
  if (u.pathname === "/__sim.html") { res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); return res.end("<!doctype html><title>Simulation</title>"); }
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
      /* Berichte für Claude (E-1010-6): Upsert je Nutzer und Tag, Löschen alter Tage, Lesen neuester zuerst */
      if (u.pathname === "/sb/rest/v1/berichte") {
        const uidQ = (u.searchParams.get("user_id") || "").replace("eq.", "");
        if (req.method === "POST") { const b = JSON.parse(body); db.berichte.set(b.user_id + "|" + b.tag, { ...b, n: ((db.berichte.get(b.user_id + "|" + b.tag) || {}).n || 0) + 1, simDay: simDayNow }); return send(201); }
        if (req.method === "DELETE") { const lt = (u.searchParams.get("tag") || "").replace("lt.", ""); for (const [k, v] of db.berichte) if (v.user_id === uidQ && v.tag < lt) db.berichte.delete(k); return send(204); }
        if (req.method === "GET") {
          const t = (u.searchParams.get("tag") || "").replace("eq.", ""), lim = Number(u.searchParams.get("limit") || 1000);
          return send(200, [...db.berichte.values()].filter(v => !t || v.tag === t).sort((x, y) => (x.tag < y.tag ? 1 : -1)).slice(0, lim).map(v => ({ tag: v.tag, updated_at: v.updated_at, text: v.text })));
        }
        return send(405, {});
      }
      if (u.pathname !== "/sb/rest/v1/progress") return send(404, {});
      /* wie die echte Supabase (E-1010-3): Zeitstempel mit Mikrosekunden, Vergleiche mit eq/gte/lt auf die Mikrosekunde */
      const user = (u.searchParams.get("user_id") || "").replace("eq.", ""), row = db.progress.get(user);
      const rowUs = row ? row.at * 1000 + (row.us || 0) : 0;
      const pass = row && u.searchParams.getAll("updated_at").every(f => { const [op, ...v] = f.split("."), t = usOf(v.join(".")); return op === "eq" ? rowUs === t : op === "gte" ? rowUs >= t : op === "lt" ? rowUs < t : false; });
      if (req.method === "GET") { sbCount("get"); return send(200, row && (pass || !u.searchParams.getAll("updated_at").length) ? [{ user_id: user, data: row.data, updated_at: pgTimeUs(row) }] : []); }
      if (req.method === "PATCH") {
        // W15 (E-1010-4): an CAS_DAY übernimmt die Cloud Änderungen still nicht (200 ohne Zeile, wie am PC des Deutsch-Trainers)
        if (!pass || db.casSilent) { sbCount("patchMiss"); return send(200, []); }
        sbCount("patchOk");
        const b = JSON.parse(body); row.data = b.data; row.at = Date.parse(b.updated_at); row.us = 123; return send(200, [{ user_id: user }]);
      }
      if (req.method === "POST") {
        sbCount("post");
        const b = JSON.parse(body); if (db.progress.has(b.user_id) && !u.searchParams.get("on_conflict")) return send(409, {});
        db.progress.set(b.user_id, { data: b.data, at: Date.parse(b.updated_at), us: 456 }); return send(201);
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
  if (AURP) { const a = aurGemini(body, k, has); if (a) return a; }
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
  if (has("Vokabelkarte")) {
    k("vokabel");
    // Testantworten des Rundgangs: „simsynonym“ = gleichwertige Antwort (wird gemerkt), „simtypo“ = nur vertippt (Ausrutscher)
    if (has("simsynonym")) return { correct: true, typo: false, feedback: "Passt (Sim)." };
    if (has("simtypo")) return { correct: true, typo: true, feedback: "Nur vertippt (Sim)." };
    return { correct: false, feedback: "Nein." };
  }
  if (has("Grundform (Wörterbuchform)")) { k("wort"); return { de: "Sim-Bedeutung", base: "sim", note: "" }; }
  // Sammel-Eingabe und Nachprüfung eigener Wörter (S-1013-49, S-1014-50): je Eingabezeile ein Paar, Verben mit Formzeilen
  if (has('{\\"words\\":[')) { k("eigenes-wort"); const L = [...body.matchAll(/\\n- ([^\\]+)/g)].map(m => m[1]);
    return { words: L.map((x, i) => ({ in: x, fi: "simsana" + i, de: "Simwort " + i, f: ["Präsens: sim"], note: "" })) }; }
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
      const voices = [{ name: "Sim fi", lang: "fi-FI", localService: true }, { name: "Sim fi 2", lang: "fi-FI", localService: false }, { name: "Sim de", lang: "de-AT", localService: true }, { name: "Sim de 2", lang: "de-DE", localService: false }, { name: "Sim en", lang: "en-GB", localService: true }].map(v => ({ ...v, voiceURI: v.name }));
      speechSynthesis.getVoices = () => voices;
      speechSynthesis.speak = u => (window.__spoken = window.__spoken || []).push(u && u.text); // Vorlesen protokollieren (W18)
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
    if (offline[name]) return route.abort("internetdisconnected"); // W20: Gerät ohne Netz
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
  // Uhr auf einer leeren Seite derselben Adresse umstellen – sonst liefe die App kurz mit der Uhr des Vortags
  // (Hochladen, Tagesstand, Gesamtanalyse mit falschem Datum)
  await page.goto(URL0 + "__sim.html");
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
      // Zeitpunkt wie in S.reports (d), damit dieselbe Analyse nicht doppelt gezählt wird
      if (S.lastGlobal && S.lastGlobal !== before) __simGlob.push({ t: (S.reports[0] || {}).d || S.lastGlobal, auto: !!silent, since, prev: before || 0 });
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
    let p = window.__simPBase || 0.9; // W21: Lernprofil (P_BASE)
    if (tid === WEAK_TOPIC && simDay < WEAK_TOPIC_UNTIL) p = 0.3;
    const lp = typeof lastPracticed === "function" ? lastPracticed(tid) : Date.now();
    if (lp && Date.now() - lp > 40 * 86400000) p -= 0.3; // vergessen
    return p;
  };
  /* Wie ein Mensch nach einer Runde kurz das Ergebnis ansehen: Die App lädt erst nach ~1 s ohne Runde hoch. Ohne
     diese Pause lernte die Simulation einen ganzen Tag ohne Hochladen (Tagesstand fehlte, Cloud blieb alt). */
  window.simIdle = async () => { await waitFor(() => !SESSION && !PUSH_TIMER && !PUSHING, 4000); };
  window.simWeakWord = id => {
    const base = cardParse(id).base;
    const all = Object.keys(S.cards).filter(x => cardWord(x)).map(x => cardParse(x).base);
    const uniq = [...new Set(all)].sort();
    return uniq.slice(0, 5).includes(base);
  };
  /* Musterlösung über die Bedienelemente eingeben (Satz ordnen: Wörter antippen) */
  window.fillModel = (ex, alt = 0) => {
    if (ex.t === "mc") { clk("mc", SESSION.cur.opts.findIndex(o => o.ok)); return true; }
    if (ex.t === "tab" || ex.t === "luk") { const g = tabGaps(ex); document.querySelectorAll(".tcell").forEach((inp, k) => (inp.value = g[k][0])); }
    else if (ex.t === "zuo") document.querySelectorAll(".zsel").forEach((sel, i) => (sel.value = ex.p[i][1]));
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
    if (ex.t === "zuo" && r >= 0.15) { document.querySelectorAll(".zsel").forEach((sel, i) => { const o = [...sel.options].map(x => x.value).filter(v => v && v !== ex.p[i][1]); sel.value = i === 0 && o.length ? o[0] : ex.p[i][1]; }); return clk("check"); }
    if (r < (window.__AUR ? 0.15 : 0.6) || ex.t === "ord") return clk("dunno");
    if (ex.t === "tab" || ex.t === "luk") document.querySelectorAll(".tcell").forEach(i => (i.value = "zzz"));
    else if (ex.t === "dlg") document.querySelectorAll(".dcell").forEach(i => (i.value = window.__AUR ? AURwrongLine(ex) : "Minä ei ole zzz"));
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
    if (info.retry || info.peek || !info.ok || SESSION.mode === "gen" || ex.gid) return null; // nachgeschaut zählt nie richtig (S-1014-54)
    const R = (SIM.rules = SIM.rules || {});
    // E-1008-3: Lücke mitten im Wort (Endung) wird streng geprüft – „a“ statt „ä“ ist falsch
    if ((R.strict || 0) < 2 && ex.t === "gap" && /\p{L}___|___\p{L}/u.test(ex.q || "") && /[äö]/i.test(ex.a[0]) && !ex.a.some(a => norm(a) === norm(deUml(ex.a[0])))) {
      R.strict = (R.strict || 0) + 1;
      return { text: deUml(ex.a[0]), expect: false, why: `Endung mitten im Wort: „${deUml(ex.a[0])}“ statt „${ex.a[0]}“ als richtig gewertet (E-1008-3)` };
    }
    // ganze Übersetzung in die Lernsprache: fehlende Pünktchen zählen als „fast richtig“ (nur wenn die Sprache das erlaubt)
    if ((R.loose || 0) < 2 && ex.t === "tr" && ex.dir === "de" && !ex.s && !/vokalharmonie/i.test(ex.h || "") && /[äö]/i.test(ex.a[0]) && !ex.a.some(a => norm(a) === norm(deUml(ex.a[0]))) && (SP.loose || []).some(p => p[0] === "ä" && p[1] === "a") /* Deutsch: a statt ä bleibt falsch (S-1013-9, S-1014-14) */) {
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
      let ok = window.__AUR ? AURok(ex, src, retry, guard) : retry ? Math.random() < 0.95 || guard > 120 : Math.random() < simP(src.tid, simDay);
      st.n++;
      if (opt.extras && st.n === 1) await opt.extras(ex);
      if (opt.each) await opt.each(ex);
      if (!SIM.vhintUsed && simHas("vhint")) { clk("vhint"); SIM.vhintUsed = 1; } // Vokabelhilfe (nur Übersetzung in die Lernsprache)
      // S-1014-54: einmal je Lauf „Regel ansehen“ im Lernschritt – richtig beantwortet muss es als Fehlversuch zählen
      let peeked = false;
      if (!SIM.peekUsed && !retry && simHas("peek")) { clk("peek"); SIM.peekUsed = 1; peeked = true; ok = true; if (!document.querySelector("#peek .peekbox")) simErr.push("Regel ansehen: Regel wird nicht eingeblendet"); }
      const info = { retry, ok, n: st.n, first: st.first, peek: peeked };
      let plan = opt.answer ? await opt.answer(ex, info) : null;
      if (plan === "ok" || plan === "wrong") { ok = plan === "ok"; plan = null; }
      else if (!plan && !opt.answer) plan = window.__AUR ? AURplan(ex, src, info, ok) : simRule(ex, info);
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
      if (peeked && res && (res.correct || !res.peek)) simErr.push("Regel ansehen: nachgeschaute Übung als richtig gewertet (S-1014-54)");
      if (window.__AUR) AURafter(ex, src, retry, res, ok, plan);
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
    if (!SESSION) await simIdle();
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
      const pScale = (window.__simPBase || 0.9) / 0.9; // W21: Lernprofil
      const pKnow = Math.min(0.99, pScale * (weak ? 0.05 : c.isNew ? 0.7 : Math.max(0.5, 0.97 - Math.max(0, sinceLast - (c.interval || 1)) * 0.02)));
      const know = Math.random() < pKnow;
      const inp = document.querySelector("#ans");
      if (inp) inp.value = know ? (SESSION.dir === "fi" ? w[1] : w[0]) : Math.random() < 0.3 ? "väärin" : "";
      clk("flip");
      if (opt.ask && n === 2 && simHas("askex")) { clk("askex"); typeIn("#askexq", "Woher kommt das Wort?"); clk("askexgo"); await waitFor(() => !/prüft|denkt/.test(document.querySelector("#askex").textContent), 20000); }
      if (inp && inp.value && document.querySelector("#vjudge")) await waitFor(() => !/prüft/.test(document.querySelector("#vjudge").textContent), 20000);
      const k = !know ? "again" : Math.random() < 0.15 ? "hard" : Math.random() < 0.8 ? "good" : "easy";
      if (k === "again") again++;
      clk("crate", k); if (window.__AUR) __AUR.spend("card");
      if (!undone && n === 3 && simHas("cundo")) { undone = true; clk("cundo"); clk("crate", k); }
    }
    if (SESSION && SESSION.kind === "vocab") SESSION = null;
    await simIdle();
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
    const gf = !!(APP.features && APP.features.grammarFirst); /* D-1014-43: mit grammarFirst kommt die Freischalt-Runde vor Vokabeln und Fehler-Training */
    const expect = !S.active && !pt && !dueTopics().length && (gf || (dueToday().length + newCardsAvail().length === 0 && !openErrors().length)) && !nextNewTopic() && bl;
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
    let b = simHeuteUnlock(), bl = blockingReq();
    const pvNow = pend.pvFrom && day >= pend.pvFrom && !SIM.pvDone; // W19: dann täglich eine Freischalt-Runde
    let pvPair = null;
    if (pvNow) {
      // W19 braucht eine Voraussetzung, auf die ein echtes gesperrtes Thema mit Wörtern wartet (keine tsim-Themen)
      for (const t of TOPICS) {
        if (/^tsim/.test(t.id) || !t.v.length || (S.topics[t.id] || {}).status !== "locked") continue;
        const R = reqInfo(t);
        if (!R.every(x => x.ok || x.s.status === "learning")) continue;
        const rr = R.find(x => !x.ok && (!SIM.pvReq || SIM.pvReq === x.id));
        if (rr) { bl = pvPair = { t, r: rr }; break; }
      }
      if (b && bl && b.dataset.id !== bl.r.id) b = null; // dann über die Themenseite
    }
    if (!bl || S.active || (!b && day % 3 !== 0 && !pvNow && !SIM.unlockEvery)) return r;
    const via = b ? "Heute" : "Themenseite";
    if (b) clk("unlock", bl.r.id); else { A.tab("topics"); clk("topic", bl.t.id); clk("unlock", bl.r.id); }
    if (!SESSION || SESSION.mode !== "unlock") { simErr.push(`Freischalt-Runde startet nicht (${via}): ${bl.r.id}`); SESSION = null; return r; }
    if (!/Freischalt-Runde/.test(appText())) simErr.push("Freischalt-Runde zeigt ihren Titel nicht");
    const off = pend.w12 && day >= pend.from && aiReady() ? simOfflinePlan() : null;
    // W19 (S-1012-106): ab PV_FROM fällt eine Voraussetzung absichtlich 3× durch (erster Versuch falsch, Wiederholung
    // richtig) → danach muss „Wörter vorab lernen“ beim gesperrten Thema erscheinen (Prüfung in simPrevocab)
    const pv = !off && !!pvPair && (!SIM.pvReq || SIM.pvReq === bl.r.id); // nur bei einem echten gesperrten Thema
    if (pv) SIM.pvReq = bl.r.id;
    let st;
    try { st = await simRound(day, true, off ? { answer: off.answer, after: off.after } : pv ? { answer: async (ex, info) => (info.retry ? "ok" : "wrong"), rate: "again" } : {}); }
    finally { if (off) await simCtl({ gemDown: false }); }
    if (pv && (S.topics[bl.r.id].unlockFails || 0) >= 3) SIM.pvDone = day;
    out.did.push(`Freischalt ${bl.r.id} ${Math.round(st.score * 100)}% (${via}${off ? ", KI-Ausfall " + off.done + "/2" : ""}${pv ? ", absichtlich durchgefallen " + (S.topics[bl.r.id].unlockFails || 0) + "/3" : ""})`);
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
    // wirklich langer Abstand (≥ 14 Tage); ab Tag 60 notfalls der längste vorhandene
    return blocksLocked(id) && (s.reps || 0) >= 1 && ((s.interval || 0) >= 14 || (day >= 60 && (s.interval || 0) >= 6));
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
      } else if (!(weakPlan()[f.id] && weakPlan()[f.id].moved)) {
        // nicht mehr unter den höchstens 3 vorgezogenen Themen (andere haben mehr Treffer) – laut E-1008-22 so vorgesehen
        f.done = "verdrängt"; (SIM.weakDropped = SIM.weakDropped || []).push(`${f.id} (vorgezogen bis ${fmtDate(f.until)}, jetzt ${Object.keys(weakPlan()).join(",") || "keins"})`);
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
  /* D-1019-4: „✎ Antwort ändern“ nach „Richtig“ und „← Vorige“ – die alte Eingabe steht wieder im Feld, nochmal prüfen
     ergibt dieselbe Wertung; Rundenergebnis und Länge der Runde bleiben gleich */
  ["Antwort ändern und vorige Übung", async day => {
    const t = learningTopics()[0]; if (!t || S.active) return "skip";
    A.tab("topics"); clk("topic", t.id); clk("extra", t.id);
    let edited = 0, back = 0, prev = null;
    const again = async (ex, why) => {
      const n0 = SESSION.results.length, len = SESSION.items.length;
      if (ex.t === "mc") fillModel(ex); else clk("check", null, why);
      if (!(await simWait(() => !SESSION || document.querySelector("#nextbtn, #selfokbtn"), 45000))) return simErr.push(why + ": nochmal prüfen wertet nicht aus");
      if (document.querySelector("#selfokbtn")) { clk("selfok"); await simWait(() => document.querySelector("#nextbtn"), 5000); }
      const r = SESSION.results[SESSION.results.length - 1];
      if (SESSION.results.length !== n0 + 1 || !r || !r.correct) simErr.push(`${why}: alte Eingabe nicht wieder eingesetzt oder anders gewertet (${ex.t})`);
      if (SESSION.items.length !== len) simErr.push(why + ": Runde hat danach eine andere Länge");
    };
    await simRound(day, false, {
      each: async ex => {
        if (back || !prev || !simHas("prevex")) return;
        const n0 = SESSION.results.length, p = prev; clk("prevex"); back = 1;
        if (SESSION.results.length !== n0 - 1 || SESSION.items[SESSION.idx] !== p) return simErr.push("„← Vorige“: Wertung nicht zurückgenommen");
        await again(p, "„← Vorige“"); clk("next");
        if (SESSION.items[SESSION.idx] !== ex) simErr.push("„← Vorige“: danach nicht wieder bei derselben Übung");
      },
      after: async (ex, res) => {
        prev = res && res.correct && !res.retry && !res.peek ? ex : null;
        if (edited || !prev || !simHas("ansedit")) return;
        const n0 = SESSION.results.length; clk("ansedit"); edited = 1;
        if (SESSION.results.length !== n0 - 1 || SESSION.locked) return simErr.push("„✎ Antwort ändern“: Wertung nicht zurückgenommen");
        await again(ex, "„✎ Antwort ändern“"); prev = null;
      }
    });
    const e = (S.slips || []).filter(x => x.k === "edit").length;
    if (edited + back && !/ANTWORT GEÄNDERT/.test(buildReport())) simErr.push("Bericht zeigt geänderte Antworten nicht (D-1019-4)");
    return edited + back ? (e >= edited + back ? "ok" : "geänderte Antworten fehlen in S.slips") : "skip";
  }],
  ["Fragen, Wort antippen, Vokabelhilfe, KI lag falsch", async day => {
    const t = learningTopics().find(x => T(x.id).ex.some(e => e.t === "tr" || e.t === "gap")); if (!t || S.active) return "skip";
    A.tab("topics"); clk("topic", t.id);
    typeIn("#askq", "Warum ist das so?"); clk("ask", t.id); await simWait(() => !/denkt|prüft/.test(document.querySelector("#askres").textContent), 20000);
    clk("extra", t.id);
    await simRound(day, false, {
      extras: async () => {
        // D-1014-45: mehrere Wörter antippen, bis eines „＋ Merken“ zeigt (Kurswörter haben keinen Knopf)
        // Kurswörter haben keinen Knopf – zuletzt ein unbekanntes Testwort (geht an die KI, Grundform „sim“)
        const fremd = Object.assign(document.createElement("span"), { className: "gw", textContent: "simvieras" });
        fremd.dataset.act = "gloss"; fremd.dataset.id = "simvieras"; document.querySelector("#app").appendChild(fremd);
        for (const g of [...[...document.querySelectorAll('#app [data-act="gloss"]')].slice(0, 6), fremd]) {
          g.click(); await simWait(() => document.querySelector("#gloss") && !/schaut nach/.test(document.querySelector("#gloss").textContent), 20000);
          if (simHas("glossmerk")) { const n0 = ownKeys().length; clk("glossmerk"); if (ownKeys().length !== n0 + 1) simErr.push("Merken beim Antippen: Wort nicht übernommen"); break; }
        }
        fremd.remove();
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
  ["Prüfmodus, Fehler melden, Wortliste, Kenne ich schon, Satzdiktat, Lesetext hören (S-1014-14/-21)", async day => {
    if (S.active || !learningTopics().length) return "skip";
    A.tab("settings"); clk("togglepruef"); if (!CFG.pruef) return "Prüfmodus lässt sich nicht einschalten";
    A.tab("topics"); clk("topic", learningTopics()[0].id);
    const f = document.querySelector('#app [data-act="exflag"]');
    if (f) {
      const id = f.dataset.id; f.click(); typeIn("#exflagq", "Simulation: bitte prüfen"); clk("exflaggo", id);
      const [tid, ei] = id.split("|"); if (!exFlagOn(tid, +ei)) return "Fehler melden: Meldung nicht gespeichert";
      const g = document.querySelector(`#app [data-act="exflag"][data-id="${id}"]`); if (g) g.click();
      if (exFlagOn(tid, +ei)) return "Fehler melden: Zurücknehmen klappt nicht";
    }
    A.tab("settings"); clk("togglepruef"); if (CFG.pruef) return "Prüfmodus lässt sich nicht ausschalten";
    A.tab("vocab");
    if (simHas("ownbulk")) { typeIn("#ownbulk", "Simwort eins, Simwort zwei"); clk("ownbulk"); await simWait(() => simHas("ownbulkclear") || !/prüft|denkt|sucht|schaut/.test((document.querySelector("#ownbulkres") || {}).textContent || ""), 20000); if (simHas("ownbulksave")) { const n0 = ownKeys().length, on = document.querySelectorAll("#ownbulkres .ownbchk:checked").length; clk("ownbulksave"); if (on && ownKeys().length < n0 + on) return "Sammel-Eingabe: angehakte Wörter nicht gespeichert"; } if (simHas("ownbulkclear")) clk("ownbulkclear"); }
    // S-1014-21: „Kenne ich schon“ in der Wortliste und auf einer neuen Karte
    A.tab("vocab"); if (simHas("allwords")) clk("allwords");
    { const kw = document.querySelector('#app [data-act="knownword"]'); if (kw) { const b = kw.dataset.id; kw.click(); if (S.cards[b].isNew || S.cards[b].interval !== KNOWN_DAYS) return "Kenne ich schon (Wortliste) wirkt nicht"; } }
    A.tab("today"); if (simHas("extravocab")) { clk("extravocab"); if (simHas("cknown")) { const id = SESSION.queue[0]; clk("cknown"); if (S.cards[id].isNew) return "Kenne ich schon (Karte) wirkt nicht"; } clk("tab", "vocab"); SESSION = null; }
    A.tab("vocab");
    if (simHas("listend")) {
      clk("listend"); let i = 0;
      while (SESSION && SESSION.kind === "listenS" && SESSION.idx < SESSION.queue.length && i++ < 4) {
        const x = SESSION.queue[SESSION.idx]; typeIn("#ans", i === 2 ? "zzz" : x.fi); clk("lscheck");
        await simWait(() => document.querySelector('[data-act="lsnext"]'), 20000); clk("lsnext");
      }
      SESSION = null;
    }
    const t = learningTopics().find(x => T(x.id).ex.some(e => e.t === "les" && !e.aus));
    if (t) { A.tab("topics"); clk("topic", t.id); clk("extra", t.id); await simRound(day, false, { each: async () => { if (simHas("leshear")) { clk("leshear"); if (simHas("lesshow")) clk("lesshow"); } } }); }
    return "ok";
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
    await simWait(() => !PUSH_TIMER && !PUSHING, 8000); await simSleep(300);
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
    if (window.__simHang) return "skip"; // an W6-Tag 33 hängt die Cloud absichtlich – Anmelden kann dann nicht klappen
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
  ["Thema zurücksetzen und rückgängig machen (S-1014-25)", async () => {
    const t = learningTopics().find(x => x.id !== window.__simWeakId && x.id !== SIM.resetId && S.topics[x.id].last >= 0.8); if (!t || S.active || !SIM.resetDone || SIM.undoResetDone) return "skip";
    const last = S.topics[t.id].last;
    A.tab("topics"); clk("topic", t.id); clk("resettopic", t.id); typeIn("#topconf", "ZURÜCKSETZEN"); clk("topresetgo", t.id);
    await simWait(() => S.topics[t.id].status === "new", 8000); if (S.topics[t.id].status !== "new") return "Thema nicht zurückgesetzt";
    A.tab("topics"); clk("topic", t.id); if (!simHas("undoreset")) return "„Zurücksetzen rückgängig machen“ fehlt";
    clk("undoreset"); clk("undoreset"); SIM.undoResetDone = 1;
    return S.topics[t.id].last === last && S.topics[t.id].status === "learning" ? "ok" : "Zurücksetzen nicht rückgängig gemacht";
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
  }]  ,
  /* W16 (E-1008-58, E-1009-10, E-1010-5, E-1008-64/E-1009-3): Tippfehler-Frage umschaltbar bis „Weiter“, „Nur vertippt –
     trotzdem richtig“ nach einer knappen falschen Antwort, beides als Ausrutscher gezählt; „Noch nicht gelernt?“ an/aus/an
     und im Bericht; Antwortfelder ohne Autokorrektur (E-1008-57) */
  ["Nur vertippt und Noch nicht gelernt", async day => {
    const fit = ex => (ex.t === "tr" || ex.t === "gap") && !exStrict(ex) && !ex.gid && typeof (ex.a || [])[0] === "string";
    // zwei benachbarte Buchstaben tauschen – in einem Wort ab 5 Buchstaben, nicht in den letzten zwei (dort sitzen Endungen)
    const mkTypo = s => { for (const m of s.matchAll(/\p{L}{5,}/gu)) { const w = m[0]; for (let i = 0; i + 1 < w.length - 2; i++) if (w[i] !== w[i + 1]) { const p = m.index + i; return s.slice(0, p) + s[p + 1] + s[p] + s.slice(p + 2); } } return null; };
    // ein Vokal doppelt: kein Tippfehler im Sinn der App (Länge zählt), aber höchstens 2 Buchstaben daneben
    const mkLen = s => { const m = s.match(/\p{L}*?[aeiouyäö]/iu); return m ? s.slice(0, m.index + m[0].length) + m[0].slice(-1) + s.slice(m.index + m[0].length) : null; };
    const t = learningTopics().find(x => topicDue(x.id) > endOfDay() && T(x.id).ex.filter(fit).length >= 2); if (!t || S.active || !aiReady() || window.__simGemDown) return "skip";
    A.tab("topics"); clk("topic", t.id); clk("extra", t.id); if (!SESSION || SESSION.kind !== "topic") return "skip";
    const E = [], slip0 = (S.slips || []).map(x => x.d + x.k + x.w).join("|"), st = { typo: 0, len: 0, unl: null, inp: 0 };
    await simRound(day, false, {
      answer: async (ex, info) => {
        if (!st.inp) { st.inp = 1; const i = document.querySelector("#ans"); if (i && (i.getAttribute("autocorrect") !== "off" || i.getAttribute("spellcheck") !== "false")) E.push("Antwortfeld mit Autokorrektur/Rechtschreibprüfung (E-1008-57)"); }
        if (info.retry || !fit(ex)) return null;
        if (!st.typo) { const x = mkTypo(ex.a[0]); if (!x) return null; st.typo = 1; return { text: x, self: true, mark: "typo" }; }
        if (!st.len) { const x = mkLen(ex.a[0]); if (!x) return null; st.len = 1; return { text: x, expect: false, mark: "len", why: "Vokal doppelt (Länge) als richtig gewertet" }; }
        return null;
      },
      after: async (ex, res, plan) => {
        if (plan && plan.mark === "typo") {
          if (!SESSION.typoPend) return E.push("Nach „Nur vertippt“ fehlt die umschaltbare Markierung (E-1010-5)");
          clk("typotoggle"); if (SESSION.typoPend.on) E.push("„Nur vertippt“ lässt sich nicht zurücknehmen");
          clk("typotoggle"); if (!SESSION.typoPend.on) E.push("„Nur vertippt“ lässt sich nicht wieder setzen");
          if (res) E.push("„Nur vertippt“ wurde schon vor „Weiter“ gezählt (E-1010-5)");
        }
        if (plan && plan.mark === "len") {
          if (SESSION.typoPend) E.push("Längenfehler als Tippfehler angeboten (E-1009-5)");
          if (!simHas("selftypo")) E.push("„Nur vertippt – trotzdem als richtig werten“ fehlt bei knapper falscher Antwort (E-1009-10)");
          else { clk("selftypo"); if (!(SESSION.undo && SESSION.undo.on)) E.push("„trotzdem richtig“ nicht vorgemerkt"); }
        }
        if (!st.unl && simHas("unlearned")) {
          const b = document.querySelector('#app [data-act="unlearned"]'), [tid, ei] = b.dataset.id.split("|");
          clk("unlearned", b.dataset.id); const on1 = unlearnedOn(tid, +ei);
          clk("unlearned", b.dataset.id); const off = unlearnedOn(tid, +ei);
          clk("unlearned", b.dataset.id); const on2 = unlearnedOn(tid, +ei);
          if (!on1 || off || !on2) E.push(`„Noch nicht gelernt?“ an/aus/an klappt nicht (${on1}/${off}/${on2})`);
          st.unl = { tid, ei: +ei };
        }
      }
    });
    const neu = (S.slips || []).filter(x => !slip0.includes(x.d + x.k + x.w));
    if (st.typo && !neu.some(x => x.k === "typo")) E.push("„Nur vertippt“ nicht als Ausrutscher gezählt");
    if (st.len && !neu.some(x => x.k === "self")) E.push("„trotzdem richtig“ nicht als Ausrutscher (selbst gewertet) gezählt");
    const rep = buildReport();
    if (neu.length && !/AUSRUTSCHER/.test(rep)) E.push("Bericht ohne Abschnitt AUSRUTSCHER");
    if (st.unl) {
      if (!rep.includes(`${st.unl.tid} ex[${st.unl.ei}]`)) E.push("„Noch nicht gelernt?“ fehlt im Bericht");
      unlearnedToggle(st.unl.tid, st.unl.ei, ""); save(); // zurücknehmen, damit die Simulation nicht verfälscht wird
    }
    if (!st.typo && !st.unl) return "skip";
    return E.length ? E.join("; ") : "ok";
  }],
  /* Vokabeln (E-1008-59, E-1009-6, E-1008-57): von der KI anerkannte Antwort wird gemerkt und steht im Bericht; Claudes
     „falsch“ (ki-pruefung.json) nimmt sie zurück; wegen Tippfehler anerkannt = Ausrutscher, nicht gemerkt; Rückwärts-Karte
     verrät die Lösung nicht */
  ["Vokabeln: anerkannte Antwort, Tippfehler, Rückwärts-Karte", async day => {
    if (!Object.keys(S.cards).length || S.active || !aiReady() || window.__simGemDown) return "skip";
    const E = [];
    (S.vocAlt || []).filter(x => x.v && !x.v.ok).forEach(x => { if (vocAltFor(x.id).length && vocAltFor(x.id).some(y => y.a === x.a)) E.push(`von Claude als falsch beurteilte Antwort gilt weiter: ${x.id} ${x.a}`); });
    A.tab("today"); if (!simHas("extravocab")) return E.length ? E.join("; ") : "skip";
    clk("extravocab"); let n = 0, alt = null, typo = null, rev = 0;
    while (SESSION && SESSION.kind === "vocab" && SESSION.queue.length && n++ < 12 && (!alt || !typo || !rev)) {
      const id = SESSION.queue[0], w = cardWord(id), inp = document.querySelector("#ans");
      if (SESSION.dir === "de") { rev++; const f = norm((document.querySelector(".front") || {}).textContent || ""), core = norm(w[1].replace(/\(.*?\)/g, "").split(":")[0]);
        if (norm(w[0]).length >= 3 && !core.includes(norm(w[0])) && f.includes(norm(w[0]))) E.push(`Rückwärts-Karte verrät die Lösung: ${w[1]} → ${w[0]} (E-1008-57)`); }
      if (inp && (inp.getAttribute("autocorrect") !== "off" || inp.getAttribute("spellcheck") !== "false")) E.push("Vokabel-Eingabe mit Autokorrektur (E-1008-57)");
      const mode = !alt ? "alt" : !typo ? "typo" : "";
      if (inp) inp.value = mode === "alt" ? "simsynonym" : mode === "typo" ? "simtypo" : SESSION.dir === "fi" ? w[1] : w[0];
      clk("flip");
      if (inp && document.querySelector("#vjudge")) await simWait(() => !/prüft/.test(document.querySelector("#vjudge").textContent), 20000);
      if (mode === "alt" && inp) { alt = id; if (!(S.vocAlt || []).some(x => x.id === id && x.a === "simsynonym")) E.push("anerkannte Vokabel-Antwort nicht gemerkt (E-1008-59)"); }
      if (mode === "typo" && inp) { typo = id; if ((S.vocAlt || []).some(x => x.id === id && x.a === "simtypo")) E.push("wegen Tippfehler anerkannte Antwort als Alternative gemerkt (E-1009-6)"); if (!(S.slips || []).some(x => x.k === "typo" && x.u === "simtypo")) E.push("Vokabel-Tippfehler nicht als Ausrutscher gezählt (E-1009-6)"); }
      clk("crate", "good");
    }
    if (SESSION && SESSION.kind === "vocab") SESSION = null;
    await simIdle();
    if (alt && !/VOKABEL-ANTWORTEN ZUR PRÜFUNG[\s\S]*simsynonym/.test(buildReport())) E.push("anerkannte Vokabel-Antwort fehlt im Bericht");
    if (!alt) return E.length ? E.join("; ") : "skip";
    return E.length ? E.join("; ") : "ok";
  }],
  /* W17 (E-1010-6): Schalter „Bericht für Claude automatisch in die Cloud“ – lädt sofort hoch; danach nach jedem Hochladen
     höchstens alle 30 min (Prüfung je Tag im Hauptablauf) */
  ["Bericht in die Cloud", async () => {
    if (!cloudOn()) return "skip";
    A.tab("settings"); if (!simHas("togglereport")) return "Schalter „Bericht in die Cloud“ fehlt (E-1010-6)";
    if (S.settings.cloudReport) { window.__simReportOn = 1; return "ok"; }
    const ok0 = CFG.reportOk || 0; clk("togglereport");
    await simWait(() => (CFG.reportOk || 0) > ok0 || CFG.reportErr, 8000);
    if (!((CFG.reportOk || 0) > ok0)) return "Bericht nicht hochgeladen: " + (CFG.reportErr || "keine Antwort");
    window.__simReportOn = 1; return "ok";
  }],
  /* W18 (E-1008-62, E-1008-51): Stimme wählen (mit Hörprobe, nur dieses Gerät); Vorlese-Knöpfe in Theorie-Tabellen, bei
     class="sayall" in jeder Spalte */
  ["Stimme, Vorlesen", async () => {
    const E = [];
    A.tab("settings"); const sel = document.getElementById("voicesel");
    if (!sel) return document.querySelector('[data-act="listen"]') ? "Stimmenwahl fehlt trotz mehrerer Stimmen der Lernsprache (E-1008-62)" : "skip";
    const opts = [...sel.options].map(o => o.value), keep = sel.value; window.__spoken = [];
    setSel("voicesel", opts.find(v => v !== keep)); if (CFG.voice === keep) E.push("gewählte Stimme nicht gespeichert"); if (!window.__spoken.length) E.push("keine Hörprobe nach Stimmenwahl");
    if (S.voice !== undefined) E.push("Stimme im synchronisierten Lernstand statt nur auf dem Gerät");
    setSel("voicesel", keep);
    const t = TOPICS.find(x => /class="sayall"/.test(x.th || "") && S.topics[x.id].status !== "locked") || TOPICS.find(x => S.topics[x.id].status !== "locked");
    if (t) {
      A.tab("topics"); clk("topic", t.id);
      const det = document.querySelector("#app details"); if (det && !det.open) det.open = true;
      if (/class="sayall"/.test(t.th || "") && !document.querySelector('#app table.sayall td:nth-child(2) [data-act="say"]')) E.push(`${t.id}: Theorie-Tabelle „sayall“ ohne Vorlese-Knopf in Spalte 2 (E-1008-51)`);
      const b = document.querySelector('#app [data-act="say"]'); window.__spoken = [];
      if (b) { b.click(); if (!window.__spoken.length) E.push("Vorlese-Knopf liest nichts vor"); }
      A.tab("today");
    }
    return E.length ? E.join("; ") : "ok";
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
      // Import in einem Schritt (das Feld gibt es nur vor der ersten Antwort); dabei die Export-Formate der App (E-1010-2):
      // Lücken-first als Text, leere Lücken als null, ältere Fassung mit first als Liste
      const noAiSec = (PT[0].sections.filter(s => ptAll().some(x => x.id.startsWith(s.id + ".") && ["r", "w"].includes(x.item.k))).pop() || PT[0].sections[PT[0].sections.length - 1]).id, bs = ptAll().filter(x => x.item.k === "b" && x.id !== id0 && !x.id.startsWith(noAiSec + ".") && (x.item.s || []).length >= 2), sol = x => x.item.s.map(v => String(v).split("|")[0]);
      const [b1, b2] = bs, raw1 = b1 ? sol(b1).map((v, i) => (i === 0 ? null : v)) : null, imp = { type: "dt-placement", a: { [id0]: ["x"] }, c: {} };
      if (b1 && b2) { imp.a[b1.id] = raw1; imp.c[b1.id] = { first: raw1.map(v => v || "").join(" … "), raw: raw1, r: "wrong" }; imp.c[b2.id] = { first: sol(b2), r: "ok" }; }
      typeIn("#ptimp", JSON.stringify(imp)); clk("ptimport");
      if (!S.placement.a[id0]) E.push("Einstufungstest: Import übernimmt keine Antwort");
      if (b1 && b2) {
        const c1 = S.placement.c[b1.id], c2 = S.placement.c[b2.id];
        if (!c1 || typeof c1.first !== "string") E.push("Einstufungstest-Import: Lücken-Bewertung mit leerer Lücke (null) nicht übernommen (E-1010-2)");
        else if ((c1.raw || []).some(v => v === null)) E.push("Einstufungstest-Import: null in Lücken nicht als leer übernommen (E-1010-2)");
        if (!c2 || typeof c2.first !== "string") E.push("Einstufungstest-Import: älteres Format (first als Liste) nicht umgewandelt (E-1010-2)");
      }
      for (const part of PT) {
        clk("ptpart", part.id);
        for (const sec of part.sections) {
          document.querySelectorAll(`input.pgap[data-pid^="${sec.id}."]`).forEach((f, i) => { f.focus(); f.value = i % 4 ? "ist" : ""; f.dispatchEvent(new Event("input", { bubbles: true })); });
          document.querySelectorAll(`textarea[data-pid^="${sec.id}."]`).forEach(f => { f.focus(); f.value = "Ich habe gestern einen langen Satz geschrieben."; f.dispatchEvent(new Event("input", { bubbles: true })); });
          [...document.querySelectorAll('[data-act="ptrf"]')].filter(b => b.dataset.id.startsWith(sec.id + ".") && b.dataset.id.endsWith("|richtig")).forEach(b => b.click());
          const u = document.querySelector(`[data-act="ptu"][data-id^="${sec.id}."]`); if (u) { u.click(); }
          const noAi = part.id === PT[0].id && sec.id === noAiSec; // ein Abschnitt ohne KI: Selbstvergleich (letzter Abschnitt von Teil 1 mit freien Eingaben)
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
      // D-1014-37: FOKUS=grammatik (Lernmodell) → Wortschatz-Pakete erst nach der Grammatik (unten, 3c)
      const GF = !!(window.__AUR && window.__AURcfg && __AURcfg.fokus === "grammatik"), WPM = (window.__AURcfg && __AURcfg.wp) || "immer";
      const follow = (SIM.weakFollow || []).filter(f => !f.done).map(f => f.id), dT0 = dueTopics(), dT = GF ? dT0.filter(x => !x.wort) : dT0, wpDue = GF ? dT0.filter(x => x.wort) : [];
      const revOne = async t => {
        if (window.__AUR && __AUR.left() <= 0) { __AUR.skip("Wdh " + t.id); return; }
        A.tab("topics"); clk("topic", t.id);
        if (!simHas("review", t.id) && topicDue(t.id) > endOfDay()) { out.did.push(`${t.id} nicht mehr fällig`); SIM.noLongerDue = (SIM.noLongerDue || 0) + 1; return; } // z. B. Schwächen-Vorzug verdrängt
        clk("review", t.id);
        if (!SESSION) { E("Wiederholung startet nicht: " + t.id); return; }
        if (SESSION.items.length > 20) E("Wiederholung mit " + SESSION.items.length + " Übungen");
        // W11: Thema mit langem Abstand, auf das ein gesperrtes Thema wartet → ~75 % und „Einfach“
        const w75 = SC.pend.w11 && day >= SC.from && !out.scen.w11 && sim75Wanted(t.id, day), iv0 = S.topics[t.id].interval;
        const r = await simRound(day, true, w75 ? sim75Plan() : {}); out.did.push(`Wdh ${t.id} ${Math.round(r.score * 100)}%`);
        if (r.stuck) E("Runde hängt: " + t.id);
        if (w75) {
          if (!(r.appScore >= 0.6 && r.appScore < 0.8)) out.scen.w11 = "skip";
          else if (r.capDays == null) out.scen.w11 = "Abstand nicht geprüft";
          else { out.scen.w11 = r.capDays <= 7.1 ? "ok" : `nach ${Math.round(r.appScore * 100)} % + „Einfach“ erst in ${r.capDays.toFixed(1)} Tagen`; out.did.push(`75%-Szenario ${t.id}: Abstand vorher ${iv0} T, jetzt ${r.capDays.toFixed(1)} T`); }
        }
      };
      for (const t of [...dT.slice(0, 3), ...dT.slice(3).filter(x => follow.includes(x.id))]) await revOne(t);
      simWeakFollow();
      // 2. Vokabeln über den Tagesplan
      const vocOne = async () => {
        A.tab("today");
        if (dueToday().length + newCardsAvail().length > 0 && (!GF || __AUR.left() > 0)) {
          clk("vocab"); if (SESSION && SESSION.kind === "vocab") { const v = await simVocab(day, window.__AUR ? __AUR.cardsLeft() : undefined); out.did.push(`Vok ${v.n} (${v.again} nochmal)`); }
        }
      };
      if (!GF) await vocOne();
      if (dueCards().length > (S.settings.maxReviews || 1e9) && dueToday().length > S.settings.maxReviews) E("Tageslimit überschritten: " + dueToday().length);
      // 2b. Langzeit-Check: steht auf „Heute“ vor dem neuen Thema (S-1014-8)
      if (checkDue() && !S.active && (!window.__AUR || __AUR.left() > 0)) { const ct = checkTopics().map(t => t.id); A.tab("today"); clk("longcheck"); await simRound(day, false); out.did.push("Langzeit-Check " + ct.join(",")); out.check = ct; if (checkDue()) E("Langzeit-Check bleibt fällig"); }
      // 3. neues Thema: Themenseite → Wörter → Übungen
      const nt = nextNewTopic();
      // Wortschatz-Pakete (S-1014-12): laufen neben den Grammatikthemen – „Wörter übernehmen“, sobald eines angeboten wird
      const wpTake = () => { const wk = nextWordPack(); if (WPM === "nie" || (WPM === "selten" && (__AUR.left() < 600 || day - (SIM.wpLast ?? -999) < 60))) return; if (wk && !S.active && (!window.__AUR || __AUR.left() > 0)) { SIM.wpLast = day; A.topic(wk.id); if (clk("wordpack", wk.id)) out.did.push("Wortpaket " + wk.id); if (S.topics[wk.id].status !== "learning") E("Wortschatz-Paket " + wk.id + " nicht übernommen"); } };
      if (!GF) wpTake();
      if (window.__AUR && nt && __AUR.left() <= 0) __AUR.skip("Neu " + nt.id);
      if (nt && (!window.__AUR || __AUR.left() > 0) && S.daily.newTopics < S.settings.newTopicsPerDay && !(dueCards().length > (S.settings.maxReviews || 150))) {
        let g = 0; A.tab("topics"); clk("topic", nt.id);
        if (day >= 20 && !SIM.tvskip && !vocabReady(nt.id) && simHas("tvskip", nt.id)) { clk("tvskip", nt.id); SIM.tvskip = 1; out.did.push("Wörter übersprungen " + nt.id); }
        while (!vocabReady(nt.id) && g++ < 6) { A.topic(nt.id); clk("tvocab", nt.id); await simVocab(day, 300); }
        if (vocabReady(nt.id)) {
          // Lernschritte (S-1014-1): Schritt für Schritt (je ab 80 %), danach die Abschlussrunde
          const nst = (topicSteps(T(nt.id)) || []).length; let sg = 0;
          while (nst && stepNow(nt.id) >= 0 && stepNow(nt.id) < nst && sg++ < (window.__AUR ? 4 : 3) && (!window.__AUR || __AUR.left() > 0)) {
            const k0 = stepNow(nt.id); A.topic(nt.id); if (!clk("steplearn", nt.id)) break;
            const r = await simRound(day, false); out.did.push(`Schritt ${nt.id} ${k0 + 1}/${nst} ${Math.round(r.score * 100)}%`);
            if (window.__AUR) __AUR.stepTry(nt.id, k0, r.score);
          }
          if ((!nst || stepNow(nt.id) < 0 || stepNow(nt.id) >= nst) && (!window.__AUR || __AUR.left() > 0)) { A.topic(nt.id); clk("learn", nt.id); const r = await simRound(day); out.did.push(`Neu ${nt.id} ${Math.round(r.score * 100)}%`); if (window.__AUR) __AUR.stepTry(nt.id, "Abschluss", r.score); }
        }
        else E("Themenwörter nach 6 Runden nicht fertig: " + nt.id);
      }
      // 3c. D-1014-37 (FOKUS=grammatik): erst jetzt Vokabeln, Wiederholungen der Wortschatz-Pakete und ein neues Paket
      if (GF) {
        await vocOne();
        for (const t of wpDue) await revOne(t);
        if (!S.active) wpTake();
      }
      // 4. Freischaltung (W10/W12): blockierende Voraussetzung über „Heute“ oder alle 3 Tage über die Themenseite;
      //    „Wörter vorab lernen“ nur nach 3 Fehlversuchen, gesperrt bleibt gesperrt
      // D-1014-39 (FOKUS=grammatik): Freischalt-Versuche jeden Tag und mehrmals am Tag (bis zu 3, solange Zeit bleibt und
      // die App einen weiteren Versuch anbietet) – Aurora wartet nicht bis morgen, um voranzukommen
      SIM.unlockEvery = GF;
      for (let u = 0; u < (GF ? 3 : 1); u++) {
        if (S.active || (window.__AUR && __AUR.left() <= 0)) break;
        const bl0 = blockingReq();
        if (u > 0) {
          if (!bl0) break;
          A.tab("topics"); clk("topic", bl0.t.id);
          if (!simHas("unlock", bl0.r.id)) { out.did.push("kein weiterer Freischalt-Versuch angeboten (" + bl0.r.id + ")"); break; }
        }
        const n0 = out.did.length;
        Object.assign(out.scen, await simUnlockStep(day, SC.pend, out));
        if (out.did.length === n0 || !out.did.slice(n0).some(x => /^Freischalt /.test(x))) break;
        if (u > 0) SIM.unlockMulti = (SIM.unlockMulti || 0) + 1;
      }
      await simPrevocab(day, out);
      // 5. Fehler-Training über den Tagesplan
      if (openErrors().length && day % 2 === 0 && !S.active && (!window.__AUR || __AUR.left() > 0)) { const before = openErrors().length; A.tab("today"); clk("errtrain"); await simRound(day, false); out.did.push(`Fehler ${before}→${openErrors().length}`); }
      // 6. gemischte Wiederholung (Mehr üben)
      if (window.__AUR && !S.active) await AURfree(day, out);
      if (learningTopics().length >= 2 && day % 2 === 1 && !(NOMIX && day >= NOMIX) && !S.active && (!window.__AUR || __AUR.left() > 0)) { A.tab("today"); clk("mix"); const r = await simRound(day, false); out.did.push(`Mix ${SESSION ? "?" : Math.round(r.score * 100) + "%"}`); if (S.mixDay !== todayKey()) E("Mix nicht als erledigt markiert"); }
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
      // E-1008-10: heute neu gelernte Wörter höchstens 3 Tage Abstand (vorher sprang ein zweites „Gut“ auf 4 Tage); „Kenne ich schon“ (c.kn, S-1014-21) gewollt 60 Tage
      const tk = todayKey(), jump = Object.entries(S.cards).filter(([, c]) => c.learnDay === tk && !c.kn && c.due - startOfDay() > 3 * 86400000 + 7200e3);
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
    await simWait(() => !PUSH_TIMER && !PUSHING, 8000); // wie ein Mensch, der danach das Gerät weglegt
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
    out.syncDiag = { cloudOn: cloudOn(), dirty: DIRTY, pushing: PUSHING, noCas: typeof NO_CAS !== "undefined" ? NO_CAS : null, remoteAt: CFG.remoteAt, syncedAt: CFG.syncedAt, text: (document.querySelector("#sync") || {}).textContent || "" };
    // Speicher (E-1008-19): Lernstand, localStorage dieser App (ohne Merker der Simulation), belegter Browser-Speicher
    const lsKeys = Object.keys(localStorage).filter(k => !k.startsWith("__sim"));
    out.store = { s: out.snap.size, ls: lsKeys.reduce((a, k) => a + k.length + (localStorage.getItem(k) || "").length, 0), top: lsKeys.map(k => [k, (localStorage.getItem(k) || "").length]).sort((a, b) => b[1] - a[1]).slice(0, 4) };
    out.store.parts = Object.keys(S).map(k => [k, JSON.stringify(S[k] === undefined ? null : S[k]).length]).sort((a, b) => b[1] - a[1]).slice(0, 6);
    try { const est = await navigator.storage.estimate(); out.store.use = est.usage; } catch (e) {}
    out.glob = __simGlob.splice(0);
    out.repTimes = (S.reports || []).map(x => x.d).filter(Boolean);
    out.sim = { noLongerDue: SIM.noLongerDue || 0, weakDropped: SIM.weakDropped || [], looseOn: (SP.loose || []).some(p => p[0] === "ä" && p[1] === "a") /* Deutsch: a statt ä bleibt falsch (S-1013-9, S-1014-14) */, unlockMulti: SIM.unlockMulti || 0, unlockVia: SIM.unlockVia || {}, prevocabN: SIM.prevocabN || 0, capChecks: SIM.capChecks || 0, rules: SIM.rules || {}, weakOpen: (SIM.weakFollow || []).filter(f => !f.done).length };
    if (window.__AUR) out.aur = AURday(day);
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
      if (day % 10 === 7 && !S.active && !window.__AUR) { const t = learningTopics()[0]; if (t) { A.tab("topics"); clk("topic", t.id); if (simHas("review", t.id)) clk("review", t.id); else clk("extra", t.id); await simRound(day); out.round = t.id; } }
      A.tab("today");
      if (dueToday().length + newCardsAvail().length > 0) { clk("vocab"); if (SESSION && SESSION.kind === "vocab") { const v = await simVocab(day, 60); out.n = v.n; } }
      await new Promise(r => setTimeout(r, 300)); flushSave && flushSave();
      await simWait(() => !PUSH_TIMER && !PUSHING, 8000); // so wie ein Mensch, der danach das Handy weglegt
      out.reviews = S.stats.reviews; out.cards = Object.keys(S.cards).length;
      out.diag = { updated: S.updated, dirty: DIRTY, remoteAt: CFG.remoteAt, syncedAt: CFG.syncedAt, sync: (document.querySelector("#sync") || {}).textContent };
      out.sample = Object.fromEntries(Object.entries(S.cards).filter(([, c]) => c.last && c.last > Date.now() - 3600e3).slice(0, 8).map(([id, c]) => [id, [c.due, c.last]])); // [fällig, zuletzt geübt]
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
let pendOff = null, quota = null; const offDaysB = [], offOk = {}; // W20
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
  db.hang = !AURP && day === 33;
  db.casSilent = day === CAS_DAY; // W15 (E-1010-4)
  geminiDown = (!AURP && (day === 50 || day === 51)) || inR(day, GEM_DOWN);
  offline.PC = inR(day, OFF_A); offline.Handy = inR(day, OFF_B);
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
  if (AURP && !AUR_DAYS[day]) continue; // Aurora lernt heute nicht (Claudes Urteile oben laufen trotzdem)
  const flags = AURP ? {} : { noVoice: day === 44 || day === 89, filePrompt: day === 71 };
  let bRes = null;
  if (day > 0 && day % HANDY_EVERY === 2 % HANDY_EVERY) {
    await openDay(B, day, { noVoice: flags.noVoice });
    await B.evaluate(p => (window.__simPBase = p), P_BASE).catch(() => {}); // W21
    bRes = await dayB(B, day);
    bRes.err.forEach(e => P(`Tag ${day}: ${e}`));
    addCov(bRes.cov);
    if (bRes.sample && Object.keys(bRes.sample).length) { bSample = bRes.sample; bDiag = bRes.diag; }
    // W20: offline geübte Handy-Karten erst nach der Rückkehr prüfen (dann müssen sie am PC sein)
    if (offline.Handy || db.hang) { pendOff = Object.assign(pendOff || {}, bSample || {}); bSample = null; if (offline.Handy) offDaysB.push(day); } // Cloud hängt (W6) wie offline behandeln
    else if (pendOff) { bSample = Object.assign({}, pendOff, bSample || {}); console.log(`T${day} | W20 Handy wieder online: ${Object.keys(pendOff).length} offline geübte Karten werden geprüft`); pendOff = null; offOk.B = day; }
  }
  lessonBad = !AURP && day === BAD_DAY && BAD_IDS.length > 0; // W14: nur der PC lädt an diesem Tag die manipulierte Fassung
  await openDay(A, day, flags);
  if (AURP) await aurInject(A, day);
  await A.evaluate(p => (window.__simPBase = p), P_BASE).catch(() => {}); // W21
  // W20: Speicher voll – am Morgen danach muss die Arbeit des Tages noch da sein (aus der Cloud oder lokal)
  if (quota && quota.day === day - 1) {
    const kept = await A.evaluate(q => Object.values(S.cards).filter(c => c.last && c.last >= q.start && c.last < q.start + 86400000).length, quota).catch(() => -1);
    console.log(`T${day} | W20 Speicher voll an Tag ${quota.day}: ${quota.n} Wiederholungen geübt, ${kept} am nächsten Morgen vorhanden, ${quota.hits} fehlgeschlagene Schreibvorgänge, Warnung: ${quota.warn ? "ja" : "nein"}`);
    if (kept < quota.n) P(`Tag ${quota.day}: Speicher voll – ${quota.n - kept} von ${quota.n} Wiederholungen des Tages am nächsten Morgen verloren (W20)`);
    quota.checked = true;
  }
  if (QUOTA_DAY && day === QUOTA_DAY) {
    await A.evaluate(() => {
      const orig = Storage.prototype.setItem; window.__quotaHits = 0;
      Storage.prototype.setItem = function (k, v) { if (String(k).startsWith("__sim")) return orig.call(this, k, v); window.__quotaHits++; throw new DOMException("Quota exceeded (Simulation)", "QuotaExceededError"); };
    });
  }
  lessonBad = false;
  if (!WEAK) WEAK = await A.evaluate(() => window.__simWeakId);
  if (bSample) {
    // Abgleich-Kontrolle: Karten, die das Handy eben geübt hat, müssen auf dem PC angekommen sein
    // verloren = PC kennt die Karte nicht oder hat einen älteren Stand; übte der PC sie später selbst (gleicher Tag, beide offline), gilt seine Wiederholung
    const got = await A.evaluate(s => Object.entries(s).filter(([id, v]) => { const [due, last] = Array.isArray(v) ? v : [v, 0], c = S.cards[id]; return !c || (c.due < due && (c.last || 0) < last); }).map(([id]) => id), bSample);
    if (got.length) {
      const id = got[0], cloud = ((db.progress.get("u1") || {}).data || {}).cards || {};
      const pc = await A.evaluate(id => ({ card: S.cards[id], updated: S.updated, remoteAt: CFG.remoteAt, syncedAt: CFG.syncedAt }), id);
      P(`Tag ${day}: Abgleich verloren – Handy-Wiederholungen fehlen am PC: ${got.join(", ")} | ${id}: Handy due ${bSample[id]}, Cloud ${JSON.stringify(cloud[id])}, PC ${JSON.stringify(pc)}, Handy-Diag ${JSON.stringify(bDiag)}`);
    }
    bSample = null;
  }
  if (day === REVEAL_DAY) { const n = await A.evaluate(() => TOPICS.length); if (lastSnap && lastSnap.nTopics > 4 && n <= lastSnap.nTopics) P(`Tag ${day}: neue Lektionen von Claude nicht geladen (${n} Themen)`); }
  if (!AURP && day === 60) await A.evaluate(() => setTimeout(() => { throw new Error("Absturz-Probe Tag 60"); }, 0));
  if (flags.noVoice) {
    const nv = await A.evaluate(() => { A.tab("vocab"); const b = document.querySelector('[data-act="listen"]'); return { dis: !b || b.disabled, warn: CFG.voiceWarnDay }; });
    if (!nv.dis) P(`Tag ${day}: ohne Stimme ist das Diktat nicht ausgegraut`);
  }
  // Rundgang: pro Tag 2 Schritte, offene („skip“) bleiben in der Warteschlange; ab Tag 6, wenn es Inhalte gibt
  const steps = [];
  if (!AURP && day >= 6) for (let i = 0; i < TOUR.length && steps.length < 2; i++) { const s = TOUR[(tourIdx + i) % TOUR.length]; steps.push(s); }
  tourIdx = (tourIdx + 2) % TOUR.length;
  const SC = {
    from: SC_FROM, snips: SNIPS,
    pend: { from: SC_FROM, pvFrom: PV_FROM, w11: !AURP && !scen.w11, w12: !AURP && !scen.w12, w13: !AURP && day >= SC_FROM && scen.w13 < (day >= WEAK2_FROM ? 2 : 1) },
    bad: !AURP && day === BAD_DAY && BAD_IDS.length ? { ids: BAD_IDS, len: BAD_IDS.map(id => LESSONS.find(t => t.id === id).ex.length), base: BASEX[0] && BASEX[0].id } : null
  };
  await A.evaluate(([g, h]) => { window.__simGemDown = g; window.__simHang = h; }, [geminiDown, db.hang]).catch(() => {}); // Rundgang: nicht an KI-Ausfall- bzw. Cloud-hängt-Tagen
  const r = await dayA(A, day, steps, flags, SC);
  if (AURP) aurRecord(day, r);
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
  if (snapLog.length && (r.tour || {})["Tagesstände der Cloud"] && r.tour["Tagesstände der Cloud"] !== "ok") {
    console.log(`   Tagesstände bis Tag ${day}: ` + snapLog.filter(x => x.simDay >= day - 3).map(x => `Tag ${x.simDay} → ${x.key} (${x.reviews} Wdh)`).join(", "));
    console.log(`   Cloud-Anfragen: ` + [day - 2, day - 1, day].map(d => `Tag ${d} ${JSON.stringify(sbLog[d] || {})}`).join(", ") + ` | Gerät am Tagesende: ${JSON.stringify(r.syncDiag)} | Cloud-Zeile ${pgTime(((db.progress.get("u1") || {}).at) || 0)}`);
  }
  if (bRes) (bRes.glob || []).forEach(g => glob.push({ ...g, day, dev: "Handy" }));
  lastSim = r.sim || lastSim;
  if (QUOTA_DAY && day === QUOTA_DAY) {
    await A.evaluate(() => simWait(() => !PUSH_TIMER && !PUSHING, 10000)).catch(() => {});
    quota = await A.evaluate(d => ({ day: d, start: startOfDay(), n: Object.values(S.cards).filter(c => c.last && c.last >= startOfDay()).length, hits: window.__quotaHits || 0, warn: /voll|Speicher/i.test(document.body.textContent) }), day);
  }
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
  // W15 (E-1010-4): Cloud übernimmt PATCH still nicht → Prüfabfrage + Ausweichweg (POST); am Tagesende muss die Cloud
  // den Stand des PCs haben (sonst gingen die Wiederholungen des Tages auf anderen Geräten verloren)
  if (day === CAS_DAY) {
    await A.evaluate(() => simWait(() => !PUSH_TIMER && !PUSHING, 10000)).catch(() => {});
    const dev = await A.evaluate(() => S.stats.reviews), cl = (((db.progress.get("u1") || {}).data || {}).stats || {}).reviews || 0, q = sbLog[day] || {};
    if (cl < dev) P(`Tag ${day}: W15 Cloud übernimmt still nicht – Cloud ${cl} Wiederholungen, PC ${dev}; Ausweichweg hat nicht gegriffen (Anfragen ${JSON.stringify(q)})`);
    else if (!q.post) P(`Tag ${day}: W15 kein Ausweichweg (POST), obwohl PATCH still nichts übernahm (${JSON.stringify(q)})`);
    else r.did.push("W15 Ausweichweg ok");
  }
  // W17 (E-1010-6): ist „Bericht in die Cloud“ an, liegt nach jedem Lerntag ein Bericht dieses Tages in der Tabelle berichte;
  // Berichte älter als 30 Tage werden gelöscht
  if (day !== 33 && (await A.evaluate(() => !!(S.settings || {}).cloudReport && cloudOn()).catch(() => false))) {
    await A.evaluate(() => simWait(() => !PUSH_TIMER && !PUSHING && !REPORT_BUSY, 8000)).catch(() => {});
    const rows = [...db.berichte.values()];
    if (!rows.some(v => v.simDay === day)) P(`Tag ${day}: W17 kein Bericht von heute in der Cloud, obwohl „Bericht in die Cloud“ an ist (E-1010-6)`);
    if (rows.some(v => v.simDay < day - 31)) P(`Tag ${day}: W17 Berichte älter als 30 Tage nicht gelöscht`);
    if (rows.some(v => /sbKey|"key"\s*:|AIza|simsim1/.test(v.text || ""))) P(`Tag ${day}: W17 Bericht enthält Zugangsdaten`);
  }
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
if (OFF_B) { if (!offDaysB.length) say("W20: Handy war nie offline (OFFLINE_B passt zu keinem Handy-Tag)"); else if (!offOk.B) say(`W20: Handy offline an Tag ${offDaysB.join(", ")}, danach nie wieder online geprüft`); else console.log(`W20 Handy offline an Tag ${offDaysB.join(", ")}, Abgleich nach der Rückkehr an Tag ${offOk.B} geprüft`); }
if (QUOTA_DAY && QUOTA_DAY < DAYS - 1 && !(quota && quota.checked)) say("W20: Speicher-voll-Tag nicht ausgewertet");
if (!lastSim.prevocabN && DAYS > SC_FROM) say("„Wörter vorab lernen“ nie geprüft – keine Voraussetzung ist 3× gescheitert");
if (!lastSim.capChecks && DAYS > SC_FROM) say("7-Tage-Regel (E-1008-5) nie geprüft – keine bewertete Runde unter 80 % mit gesperrtem Folgethema");
const uv = lastSim.unlockVia || {};
if (!uv.Heute && !uv.Themenseite && DAYS > SC_FROM) say("Keine Freischalt-Runde gespielt");
console.log(`Szenarien: ${Object.keys(scenNeed).map(k => `${scenName[k]} ${scenOk[k]}/${scen[k]} ok`).join(" | ")}\nFreischalt-Runden: über Heute ${uv.Heute || 0}, über die Themenseite ${uv.Themenseite || 0} (davon weitere Versuche am selben Tag: ${lastSim.unlockMulti || 0}); Wörter vorab gelernt: ${lastSim.prevocabN || 0}×; 7-Tage-Regel geprüft: ${lastSim.capChecks || 0}×; Einzelregeln: Endung streng ${R.strict || 0}×, ohne Pünktchen ${R.loose || 0}×, zweite Wortstellung ${R.ordAlt || 0}×`);
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
fs.writeFileSync(OUTF, JSON.stringify({ daily, problems, gemCalls, gemDay, snapLog, sbLog, repTimes: [...repTimes], snapLoadDays: [...snapLoadDays], verdicts: Object.keys(verdicts).length, cov: COV, need, tourDone, scen, scenOk, sim: lastSim, topics: tc, glob, storeLog, downloads, secs }, null, 1));
console.log("\nErgebnis: " + OUTF + "\nProbleme:", problems.length, "| Gemini-Aufrufe:", JSON.stringify(gemCalls), "| Dauer", secs, "s");
await browser.close(); server.close();
