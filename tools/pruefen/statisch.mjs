/* Prüfskript – statisch.mjs (S-1008-102): Teil 1–3 ohne Browser: JS-Syntax, doppelte Namen, Aktionen ↔ Knöpfe, Sprachmodul, Satz ordnen, Lektionen,
   KI-Urteile, Werkzeug tools/thema.mjs, Nur-anhängen-Regel gegen den Vergleichsstand (BASIS / origin/main).
   Aufgerufen von tools/pruefen.mjs; gemeinsame Werte und Ergebnisse früherer Teile stehen im Objekt P. */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import crypto from "node:crypto";
import os from "node:os";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

export default async function statisch(P) {
const { ROOT, ok, fail, warn } = P;
/* ---------- 1. Syntax ---------- */
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
/* App-Dateien in Ladereihenfolge (aus index.html) */
const jsFiles = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
{ let bad = 0;
  if (!jsFiles.length) { fail("index.html lädt keine Skripte"); bad++; }
  for (const f of jsFiles) { try { new vm.Script(fs.readFileSync(path.join(ROOT, f), "utf8"), { filename: f }); } catch (e) { fail(`JS-Syntax ${f}: ${e.message}`); bad++; } }
  if (!bad) ok(`JS-Syntax (${jsFiles.length} Dateien)`); }
const inhalteSrc = fs.readFileSync(path.join(ROOT, "js/inhalte.js"), "utf8");
/* Einstellungen der echten App (js/app.js) – für Teil 6 */
const REAL = vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8") + "\n;APP");

/* Antwortfelder ohne Autokorrektur (E-1008-57): Jedes Feld mit spellcheck="false" bekommt auch autocorrect="off",
   sonst schlägt die Handy-Tastatur (iOS) die Lösung vor oder „korrigiert“ finnische Wörter. */
{ const bad = [];
  for (const f of jsFiles) {
    const s = fs.readFileSync(path.join(ROOT, f), "utf8");
    for (const m of s.matchAll(/<(?:input|textarea)\b[^>]*>/g)) if (/spellcheck="false"/.test(m[0]) && !/autocorrect="off"/.test(m[0])) bad.push(f + ": " + m[0].slice(0, 60));
  }
  if (bad.length) fail("Eingabefeld ohne autocorrect=\"off\": " + bad.join(" | "));
  else ok("Antwortfelder ohne Autokorrektur"); }

/* Doppelte Namen (E-1008-14): Alle Skripte teilen sich einen globalen Bereich – eine zweite Funktion gleichen Namens
   überschreibt still die erste. Jeder oberste Name darf nur einmal vorkommen. */
{ const seen = new Map(), dup = [];
  for (const f of jsFiles) {
    const s = fs.readFileSync(path.join(ROOT, f), "utf8");
    for (const m of s.matchAll(/^(?:async\s+)?function\s+([\w$]+)|^(?:const|let|var)\s+([\w$]+)/gm)) {
      const n = m[1] || m[2];
      if (seen.has(n)) dup.push(`${n} (${seen.get(n)}, ${f})`); else seen.set(n, f);
    }
  }
  if (dup.length) fail("Doppelte Namen: " + dup.join("; ")); else ok(`Keine doppelten Namen (${seen.size} globale Namen)`); }
/* Sprachmodul (E-1008-14): für die Lernsprache dieser App und der Test-App muss es einen Eintrag geben – sonst liefe
   die App still mit den Regeln einer anderen Sprache */
{ const sp = fs.readFileSync(path.join(ROOT, "js/sprache.js"), "utf8"),
    TEST = vm.runInNewContext(fs.readFileSync(path.join(ROOT, "tools/test-app.js"), "utf8") + "\n;APP"),
    miss = [REAL, TEST].map(a => a.target.code).filter(c => !new RegExp("^  " + c + ": \\{", "m").test(sp));
  if (miss.length) fail("Sprachmodul fehlt für: " + miss.join(", ")); else ok("Sprachmodul für die Lernsprache vorhanden"); }
/* Knöpfe und Aktionen: kein Aktionsname doppelt (der zweite überschreibt sonst still den ersten – so rief der
   Knopf „Langzeit-Check“ die Antwortprüfung auf) und jeder Knopf (data-act="…") hat eine Aktion */
{ const st = fs.readFileSync(path.join(ROOT, "js/start.js"), "utf8"), body = (st.match(/^const A = \{[\s\S]*?^\};/m) || [""])[0];
  const keys = [...body.matchAll(/^  ([a-zA-Z]+):/gm)].map(m => m[1]), dup = keys.filter((k, i) => keys.indexOf(k) !== i);
  const src = [html, ...jsFiles.map(f => fs.readFileSync(path.join(ROOT, f), "utf8"))].join("\n");
  const acts = new Set([...src.matchAll(/data-act=\\?"([a-zA-Z]+)\\?"/g)].map(m => m[1]));
  ["sharebackup", "download"].forEach(a => acts.add(a));
  const miss = [...acts].filter(a => !keys.includes(a));
  /* Gegenrichtung: jede Aktion hat einen Knopf (wörtlich data-act="…" oder als Name in einer Knopf-Vorlage) */
  const rest = src.replace(body, ""), orphan = keys.filter(k => !acts.has(k) && !new RegExp(`["'\`]${k}["'\`]`).test(rest));
  if (!keys.length) fail("Aktionen (const A) nicht gefunden");
  else if (dup.length || miss.length || orphan.length) fail(`Aktionen: doppelt ${dup.join(", ") || "–"}, Knöpfe ohne Aktion ${miss.join(", ") || "–"}, Aktionen ohne Knopf ${orphan.join(", ") || "–"}`);
  else ok(`Aktionen: ${keys.length} eindeutig, jeder Knopf hat eine Aktion und jede Aktion einen Knopf`); }

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

/* Urteile von Claude zu KI-Übungen */
try { const v = JSON.parse(fs.readFileSync(path.join(ROOT, "lektionen/ki-pruefung.json"), "utf8")); if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("kein Objekt");
  for (const [k, x] of Object.entries(v)) if (!(/^[a-z0-9]+-\d+$/.test(k) || /^va:[^:]+:[^:]+$/.test(k)) || typeof x.ok !== "boolean" || (!x.ok && !x.korrektur)) throw new Error("Eintrag " + k + " unvollständig (ok, bei Fehler auch korrektur)");
  ok(`ki-pruefung.json gültig (${Object.keys(v).length} Urteile)`); } catch (e) { fail("ki-pruefung.json: " + e.message); }

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
/* Satz ordnen (E-1008-6): jede richtige Wortstellung besteht genau aus den Wortkärtchen */
{ const bad = [], key = s => String(s).toLowerCase().replace(/[.,!?;:"“”„«»()…]/g, "").split(/\s+/).filter(Boolean).sort().join(" ");
  all.forEach(t => (t.ex || []).forEach((e, i) => { if (e.t !== "ord") return;
    const w = key((e.w || []).join(" "));
    [e.a].flat().forEach(a => { if (key(a) !== w) bad.push(`${t.id}/${i}: „${a}“`); }); }));
  if (bad.length) bad.forEach(b => fail("Satz ordnen: Lösung passt nicht zu den Wortkärtchen – " + b)); else ok("Satz ordnen: alle Lösungen aus den Wortkärtchen bildbar"); }

/* Lernschritte (S-1014-1): steps gültig (Indizes vorhanden, nicht ausgeblendet, Abschnitte vorhanden) = Fehler; je Schritt
   mindestens 8 Übungen und der Mix (mind. 3 Arten) = Hinweis; Lernschritte für alle Grammatikthemen vorgesehen. */
{ const bad = [], duenn = [];
  all.forEach(t => { if (t.steps == null) return;
    const nSec = (String(t.th || "").match(/<h3[\s>]/gi) || []).length;
    if (!Array.isArray(t.steps) || t.steps.length < 2) { bad.push(`${t.id}: steps braucht mindestens 2 Schritte`); return; }
    t.steps.forEach((x, k) => {
      if (!x || typeof x.t !== "string" || !Array.isArray(x.ex) || !x.ex.length) { bad.push(`${t.id} Schritt ${k + 1}: t/ex fehlt`); return; }
      x.ex.forEach(i => { if (!Number.isInteger(i) || !t.ex[i]) bad.push(`${t.id} Schritt ${k + 1}: Übung ${i} gibt es nicht`); else if (t.ex[i].aus) bad.push(`${t.id} Schritt ${k + 1}: Übung ${i} ist ausgeblendet`); });
      (x.sec || []).forEach(n => { if (!Number.isInteger(n) || n < 1 || n > nSec) bad.push(`${t.id} Schritt ${k + 1}: Abschnitt ${n} gibt es nicht (${nSec} Abschnitte)`); });
      const ok = x.ex.filter(i => t.ex[i] && !t.ex[i].aus), arten = new Set(ok.map(i => t.ex[i].t));
      if (ok.length < 8 || arten.size < 3) duenn.push(`${t.id}/${k + 1} (${ok.length} Übungen, ${arten.size} Arten)`); }); });
  bad.forEach(b => fail("Lernschritte: " + b));
  if (duenn.length) warn(`Lernschritte – weniger als 8 Übungen oder weniger als 3 Übungsarten je Schritt (${duenn.length}): ${duenn.join(", ")}`);
  if (!bad.length && !duenn.length) ok("Lernschritte: alle steps gültig, je Schritt ≥ 8 Übungen in ≥ 3 Arten"); }

/* Prüflisten-Punkte automatisch (T-1012-19, S-1013-23): doppelte Karten (ohne Satzzeichen), Theorie-Tabellen höchstens
   3 Spalten, je Grammatikthema mindestens 2 Regelfragen (mc mit x), je vorhandener Art les/sch/dlg mindestens
   APP.pruefVarianten Varianten (nur wo die App das verlangt, Deutsch-Trainer: 3 – pro Runde kommt nur eine dran), Verbkarten „to …“ mit Zeitformen als {f: ["Präsens: …", "Präteritum: …", "Perfekt: …", "Futur: …"]} mit Pronomen auf der deutschen Seite (S-1014-26; früher „(… · … · …)“ auf der englischen) und österreichische Wörter („Austria“) mit
   bundesdeutscher Alternative („Germany: …“). Hinweistexte ohne Zeilennummern, weil jede App ihre eigene Prüfliste hat.
   Nur Hinweise (je Punkt eine Zeile); gewollte Fälle stehen in lektionen/pruef-ausnahmen.json
   ({"doppelt": ["t15c-4"], "spalten": ["t14"], "regelfragen": ["t02"], "varianten": ["t10"], "verbformen": ["d01-3"], "oesterreich": ["d01-14"]}). */
{ let aus = {}; try { aus = JSON.parse(fs.readFileSync(path.join(ROOT, "lektionen/pruef-ausnahmen.json"), "utf8")); } catch (e) {}
  const frei = (k, id) => (aus[k] || []).includes(id);
  const norm = x => String(x).toLowerCase().replace(/[!?.,;:¿¡"„“”«»]/g, "").replace(/\s+/g, " ").trim();
  const seen = new Map(), dup = [], breit = [], regel = [], wenig = [], verb = [], oe = [];
  all.forEach(t => {
    (t.v || []).forEach(([w], i) => { const k = norm(w), id = `${t.id}-${i}`;
      if (seen.has(k) && !frei("doppelt", id)) dup.push(`${id} ${w} = ${seen.get(k)}`); else if (!seen.has(k)) seen.set(k, id); });
    const cols = Math.max(0, ...(String(t.th || "").match(/<tr[\s>][\s\S]*?<\/tr>/g) || []).map(tr => (tr.match(/<t[dh][\s>]/g) || []).length));
    if (cols > 3 && !frei("spalten", t.id)) breit.push(`${t.id} (${cols})`);
    const exA = (t.ex || []).filter(e => !e.aus), n = exA.filter(e => e.t === "mc" && e.x).length;
    if (n < 2 && !frei("regelfragen", t.id)) regel.push(`${t.id} (${n})`);
    ["les", "sch", "dlg"].forEach(art => { const m = exA.filter(e => e.t === art).length;
      if (m && m < (REAL.pruefVarianten || 0) && !frei("varianten", t.id)) wenig.push(`${t.id} ${art} (${m})`); });
    (t.v || []).forEach((w, i) => { const id = `${t.id}-${i}`, s = String(w[1] || ""), f = w[2] && Array.isArray(w[2].f) ? w[2].f : [];
      const zeiten = ["Präsens", "Präteritum", "Perfekt", "Futur"].every((k, j) => new RegExp(`^${k}:.*[\\s·](ich|du|er/sie/es|wir|ihr|sie)\\s`).test(String(f[j] || "")));
      if (/^to /.test(s) && (!zeiten || /\([^()·]+·[^()·]+·[^()·]+\)/.test(s)) && !frei("verbformen", id)) verb.push(id);
      if (/\bAustria/.test(s) && !/Germany:/.test(s) && !frei("oesterreich", id)) oe.push(id); });
  });
  if (dup.length) warn(`Prüfliste „keine doppelten Karten“ (${dup.length}): ${dup.join("; ")}`);
  if (breit.length) warn(`Prüfliste „Theorie-Tabellen höchstens 3 Spalten“ (${breit.length}): ${breit.join(", ")}`);
  if (regel.length) warn(`Prüfliste „Regelfragen“ – weniger als 2 (mc mit x), bei Grammatikthemen ergänzen, sonst in pruef-ausnahmen.json (${regel.length}): ${regel.join(", ")}`);
  if (wenig.length) warn(`Prüfliste „${REAL.pruefVarianten} Varianten je Art“ – les/sch/dlg kommt pro Runde nur einmal dran, sonst in pruef-ausnahmen.json "varianten" (${wenig.length}): ${wenig.join(", ")}`);
  if (verb.length) warn(`Prüfliste „Verbkarten mit Zeitformen“ – „to …“ braucht {"f": ["Präsens: er/sie/es …", "Präteritum: …", "Perfekt: …", "Futur: …"]} (mit Pronomen, ohne Klammer auf der englischen Seite, S-1014-26), sonst in pruef-ausnahmen.json "verbformen" (${verb.length}): ${verb.join(", ")}`);
  if (oe.length) warn(`Prüfliste „österreichisches Wort mit bundesdeutscher Alternative“ – „Austria“ ohne „Germany: …“, sonst in pruef-ausnahmen.json "oesterreich" (${oe.length}): ${oe.join(", ")}`);
  if (!dup.length && !breit.length && !regel.length && !wenig.length && !verb.length && !oe.length) ok("Prüfliste: keine doppelten Karten, Tabellen ≤ 3 Spalten, Regelfragen, Varianten je Art, Verbkarten, Österreich-Alternativen (T-1012-19, S-1013-23)");
  /* Satz ordnen mit Nebensatz, aber nur einer Lösung (S-1011-12, E-1012-29): ord wird ohne KI geprüft, eine andere
     richtige Reihenfolge (Nebensatz vorn oder hinten) gälte sonst als falsch. Gewollte Fälle: pruef-ausnahmen.json "ord". */
  const NEBEN = /,\s*(als|wenn|bevor|während|nachdem|weil|dass|ob|wann|obwohl|damit|falls|sobald|seit|seitdem|bis|kun|jos|koska|että|vaikka|jotta|kunnes|ennen kuin)\b|^(als|wenn|bevor|während|nachdem|weil|dass|ob|obwohl|damit|falls|sobald|seit|seitdem|bis|kun|jos|koska|vaikka|jotta|kunnes)\b[^,]*,/iu;
  const ordNeben = [];
  all.forEach(t => (t.ex || []).forEach((e, i) => { const id = `${t.id}-${i}`;
    if (e.t === "ord" && [e.a].flat().length === 1 && NEBEN.test(String([e.a].flat()[0]).trim()) && !frei("ord", id)) ordNeben.push(id); }));
  if (ordNeben.length) warn(`Satz ordnen mit Nebensatz, nur eine Lösung – andere Reihenfolge in a ergänzen oder in pruef-ausnahmen.json "ord" (${ordNeben.length}): ${ordNeben.join(", ")}`);
  else ok("Satz ordnen: Nebensatz-Aufgaben haben alle Wortstellungen (S-1011-12)"); }
/* Werkzeuge für kurze Ausgaben (T-1012-13/-20): tools/quellen.mjs kürzt Wiktionary-Rohtext auf Vorlagen und Bedeutungen
   (Beispieltext ohne Netz); tools/ci-status.mjs ist gültiges JavaScript (braucht sonst Netz). */
{ let err = "";
  try {
    const { kurz } = await import(path.join(ROOT, "tools/quellen.mjs"));
    const roh = "==Estonian==\n===Noun===\n# [[farm]]\n==Finnish==\n===Noun===\n{{fi-noun}}\n# [[house]], [[building]]\n# [[household]]\n# [[firm]]\n====Declension====\n{{fi-decl-valo|tal|o|a}}\n==Ingrian==\n# [[x]]";
    const z = kurz(roh, "fi", "en").join("\n");
    if (!/Noun: \{\{fi-noun\}\}/.test(z) || !/house, building/.test(z) || !/Declension: \{\{fi-decl-valo\|tal\|o\|a\}\}/.test(z) || /farm|firm|x$/.test(z)) err = "quellen.mjs: " + z.replace(/\n/g, " | ");
    if (!/kein Abschnitt/.test(kurz("==Swedish==\n# hus", "fi", "en")[0])) err = "quellen.mjs meldet fehlenden Abschnitt nicht";
    execSync("node --check tools/ci-status.mjs", { cwd: ROOT, stdio: "ignore" });
  } catch (e) { err = err || String(e.message).slice(0, 200); }
  if (err) fail(err); else ok("Werkzeuge tools/quellen.mjs und tools/ci-status.mjs in Ordnung (T-1012-13/-20)"); }
/* Werkzeug „ein Thema lesen“ (S-1008-103): läuft mit den Test-Inhalten und zeigt Kopf, Theorie, Wörter, Übungen und
   die markierte mc-Lösung */
{ let out = "", err = "";
  try { out = execSync("node tools/thema.mjs --app tools/test-app.js --inhalte tools/test-inhalte.js --lektionen tools/test-lektionen.json t01", { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] }).toString(); }
  catch (e) { err = String(e.stderr || e.message).slice(0, 200); }
  if (!err && /^######## t01 \|/m.test(out) && /--- THEORIE\n\S/.test(out) && /--- WÖRTER \(\d+\)\n0: /.test(out) && /^\[0\] /m.test(out) && (!/\] mc /.test(out) || /O: .*\*/.test(out)) && !/<[a-z]+[ >]/i.test(out.split("--- WÖRTER")[0]))
    ok("Werkzeug tools/thema.mjs gibt ein Thema lesbar aus (S-1008-103)");
  else fail("tools/thema.mjs: " + (err || out.slice(0, 200))); }
/* E-1009-23: --vermerk schreibt Datum, Quellen, Chat und dieselbe Prüfsumme wie unten */
{ const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "vermerk-")), "v.json");
  try { execSync(`node tools/thema.mjs --app tools/test-app.js --inhalte tools/test-inhalte.js --lektionen tools/test-lektionen.json --vermerke ${f} --vermerk t01 --quellen "Testquelle" --chat S`, { cwd: ROOT, stdio: "ignore" });
    const v = JSON.parse(fs.readFileSync(f, "utf8")).t01, t = baseTopics(fs.readFileSync(path.join(ROOT, "tools/test-inhalte.js"), "utf8")).find(x => x.id === "t01");
    if (v && v.q === "Testquelle" && v.c === "S" && /^\d{4}-\d\d-\d\d$/.test(v.d) && v.h === crypto.createHash("sha1").update(JSON.stringify(t)).digest("hex").slice(0, 12)) ok("Werkzeug tools/thema.mjs --vermerk trägt den Prüfvermerk ein (E-1009-23)");
    else fail("tools/thema.mjs --vermerk: Vermerk fehlt oder Prüfsumme passt nicht"); }
  catch (e) { fail("tools/thema.mjs --vermerk: " + e.message.slice(0, 160)); } }

/* ---------- 3. Nur hinten anhängen ---------- */
/* Neue/geänderte Themen gegenüber dem Vergleichsstand (für die Wortprüfung S-1008-73); WORTCHECK=alle prüft alle */
let CHANGED = [];
const git = c => execSync(c, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString();
let basis = process.env.BASIS;
if (!basis) try { git("git rev-parse --verify origin/main"); basis = "origin/main"; } catch (e) {}
if (basis && !/^0+$/.test(basis)) {
  try {
    let oldHtml; try { oldHtml = git(`git show ${basis}:js/inhalte.js`); } catch (e) { oldHtml = git(`git show ${basis}:index.html`); }
    let oldLessons = []; try { oldLessons = JSON.parse(git(`git show ${basis}:lektionen/lektionen.json`)); } catch (e) {}
    const old = [...baseTopics(oldHtml), ...oldLessons];
    const exSig = e => e && e.t + "|" + (e.q || e.de || "");
    CHANGED = all.filter(n => { const o = old.find(x => x.id === n.id); return !o || JSON.stringify(o) !== JSON.stringify(n); }).map(t => t.id);
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
    // Einstufungstest: Aufgaben-IDs und -Typen dürfen sich nie ändern (gespeicherte Antworten hängen daran)
    const ptOf = src => { try { return vm.runInNewContext(src + "\n;typeof PT === 'undefined' ? [] : PT"); } catch (e) { return []; } };
    const ptIds = list => list.flatMap(p => p.sections.flatMap(sec => sec.items.map((it, i) => [sec.id + "." + (i + 1), it.k + "|" + it.t])));
    const oldPt = new Map(ptIds(/<script/.test(oldHtml) ? [] : ptOf(oldHtml))), newPt = new Map(ptIds(ptOf(inhalteSrc)));
    for (const [id, k] of oldPt) { if (!newPt.has(id)) fail(`Einstufungstest: Aufgabe ${id} entfernt oder verschoben`); else if (newPt.get(id).split("|")[0] !== k.split("|")[0]) fail(`Einstufungstest: Aufgabe ${id} hat einen anderen Typ`); else if (newPt.get(id) !== k) warn(`Einstufungstest: Aufgabe ${id} umformuliert – nur Tippfehler korrigieren, nie Aufgaben verschieben`); }
    ok(`Nur-anhängen-Regel gegen ${basis} geprüft`);
  } catch (e) { warn("Vergleich mit " + basis + " nicht möglich: " + e.message); }
} else warn("Kein Vergleichsstand – Nur-anhängen-Regel übersprungen");

/* Prüfvermerk je Thema (E-1009-23): lektionen/pruefvermerke.json {id: {d, q, c, h}} – setzt node tools/thema.mjs --vermerk.
   Warnung (kein Fehler) bei neuem/geändertem Thema ohne Vermerk und bei jedem Vermerk, dessen Prüfsumme nicht mehr passt. */
const themaSumme = t => crypto.createHash("sha1").update(JSON.stringify(t)).digest("hex").slice(0, 12);
{ let V = {}; try { V = JSON.parse(fs.readFileSync(path.join(ROOT, "lektionen/pruefvermerke.json"), "utf8")); } catch (e) {}
  const ohne = CHANGED.filter(id => !V[id]), alt = all.filter(t => V[t.id] && V[t.id].h !== themaSumme(t)).map(t => t.id);
  if (ohne.length) warn(`Prüfvermerk fehlt (neu/geändert): ${ohne.join(", ")} – nach Quellenprüfung: node tools/thema.mjs --vermerk <id> --quellen "…" --chat <E|F|D|S>`);
  if (alt.length) warn(`Prüfvermerk veraltet (Thema seit der Prüfung geändert): ${alt.join(", ")}`);
  if (!ohne.length && !alt.length) ok(`Prüfvermerke aktuell (${Object.keys(V).length} Themen mit Vermerk)`); }

Object.assign(P, { html, jsFiles, inhalteSrc, REAL, baseTopics, lessons, all, ids, CHANGED, git, basis });
}
