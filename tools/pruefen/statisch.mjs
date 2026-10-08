/* Prüfskript – statisch.mjs (S-1008-102): Teil 1–3 ohne Browser: JS-Syntax, doppelte Namen, Aktionen ↔ Knöpfe, Sprachmodul, Satz ordnen, Lektionen,
   KI-Urteile, Werkzeug tools/thema.mjs, Nur-anhängen-Regel gegen den Vergleichsstand (BASIS / origin/main).
   Aufgerufen von tools/pruefen.mjs; gemeinsame Werte und Ergebnisse früherer Teile stehen im Objekt P. */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
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
  for (const [k, x] of Object.entries(v)) if (!/^[a-z0-9]+-\d+$/.test(k) || typeof x.ok !== "boolean" || (!x.ok && !x.korrektur)) throw new Error("Eintrag " + k + " unvollständig (ok, bei Fehler auch korrektur)");
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

/* Werkzeug „ein Thema lesen“ (S-1008-103): läuft mit den Test-Inhalten und zeigt Kopf, Theorie, Wörter, Übungen und
   die markierte mc-Lösung */
{ let out = "", err = "";
  try { out = execSync("node tools/thema.mjs --app tools/test-app.js --inhalte tools/test-inhalte.js --lektionen tools/test-lektionen.json t01", { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] }).toString(); }
  catch (e) { err = String(e.stderr || e.message).slice(0, 200); }
  if (!err && /^######## t01 \|/m.test(out) && /--- THEORIE\n\S/.test(out) && /--- WÖRTER \(\d+\)\n0: /.test(out) && /^\[0\] /m.test(out) && (!/\] mc /.test(out) || /O: .*\*/.test(out)) && !/<[a-z]+[ >]/i.test(out.split("--- WÖRTER")[0]))
    ok("Werkzeug tools/thema.mjs gibt ein Thema lesbar aus (S-1008-103)");
  else fail("tools/thema.mjs: " + (err || out.slice(0, 200))); }

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

Object.assign(P, { html, jsFiles, inhalteSrc, REAL, baseTopics, lessons, all, ids, CHANGED, git, basis });
}
