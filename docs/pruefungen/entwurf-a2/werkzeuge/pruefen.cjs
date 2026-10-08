// Entwurf A2 (S-1008-124): prüft die Entwurfsthemen (themen/*.json) und baut lektionen-a2.json.
// Aufruf: node docs/pruefungen/entwurf-a2/werkzeuge/pruefen.cjs [tNN …]   (ohne IDs: alle Entwürfe)
// Fehler (✗) müssen weg, Hinweise (·) ansehen. Ändert nichts außer lektionen-a2.json im Entwurfsordner.
const fs = require("fs"), path = require("path");
const { alt, neu, all, GX, DIR } = require("./laden.cjs");
const only = process.argv.slice(2);
const ids = all.map(t => t.id);
const byId = Object.fromEntries(all.map(t => [t.id, t]));
const norm = s => String(s).toLowerCase().replace(/\(.*?\)/g, "").replace(/[?!.,]/g, "").trim();
let nErr = 0, nWarn = 0;
const E = (id, m) => { nErr++; console.log(`✗ ${id}: ${m}`); };
const W = (id, m) => { nWarn++; console.log(`· ${id}: ${m}`); };
const isGap = c => /^\[.*\]$/.test(String(c).trim());
const gapAlts = c => String(c).trim().slice(1, -1).split("|");

// Voraussetzungen (transitiv)
const closure = id => { const seen = new Set(), st = [...(byId[id].req || [])];
  while (st.length) { const x = st.pop(); if (seen.has(x) || !byId[x]) continue; seen.add(x); st.push(...(byId[x].req || [])); }
  return seen; };
// Wort → Themen mit diesem Wort in der Wortliste (Grundform, auch Teile mehrteiliger Einträge)
// nur Einzelwörter und das erste Wort von Wendungen (sonst Fehlalarme wie „tulee“ aus „minusta tulee“)
const vocabIdx = new Map();
all.forEach(t => t.v.forEach(([fi]) => { const ws = norm(fi).split(/[\s/;]+/).filter(w => w.length > 1);
  (ws.length > 1 ? ws.slice(0, 1) : ws).forEach(w => { if (!vocabIdx.has(w)) vocabIdx.set(w, new Set()); vocabIdx.get(w).add(t.id); }); }));
const toks = s => (String(s || "").match(/\p{L}[\p{L}'’-]*/gu) || []).map(x => x.toLowerCase());

const doc = [];
for (const t of neu) {
  if (only.length && !only.includes(t.id)) continue;
  const id = t.id;
  ["id", "title", "fi", "lvl", "th", "v", "ex"].forEach(k => { if (t[k] == null) E(id, "Feld fehlt: " + k); });
  if (!Array.isArray(t.req)) E(id, "req fehlt");
  (t.req || []).forEach(r => { if (!ids.includes(r)) E(id, "Voraussetzung gibt es nicht: " + r); });
  (t.req || []).forEach(r => { if (ids.indexOf(r) > ids.indexOf(id)) E(id, "Voraussetzung steht später in der Liste: " + r); });
  if (/<script/i.test(t.th)) E(id, "Script in der Theorie");
  if ((t.th.match(/<table/g) || []).length !== (t.th.match(/<\/table>/g) || []).length) E(id, "Theorie: Tabellen nicht geschlossen");
  ["<p>", "<h3>", "<tr>", "<td>"].forEach(tag => { const o = (t.th.match(new RegExp(tag.replace(">", "[ >]"), "g")) || []).length,
    c = (t.th.match(new RegExp(tag.replace("<", "</"), "g")) || []).length; if (o !== c) E(id, `Theorie: ${tag} ${o}× offen, ${c}× zu`); });
  // Wörter
  const seenV = new Set();
  t.v.forEach(([fi, de], i) => {
    if (!fi || !de) E(id, `Vokabel ${i} unvollständig`);
    const k = norm(fi);
    if (seenV.has(k)) E(id, `Vokabel doppelt im Thema: ${fi}`); seenV.add(k);
    alt.concat(neu).forEach(o => { if (o.id === id) return; o.v.forEach(([f2], j) => { if (norm(f2) === k) W(id, `Karte „${fi}“ gibt es schon: ${o.id}/${j}`); }); });
  });
  // Übungen
  const cnt = {};
  t.ex.forEach((e, i) => {
    cnt[e.t] = (cnt[e.t] || 0) + 1;
    const P = `Übung ${i} (${e.t})`;
    if (e.t === "mc") { if (!Array.isArray(e.o) || e.o.length < 2 || !(e.a >= 0 && e.a < e.o.length)) E(id, P + ": o/a fehlerhaft");
      if (new Set(e.o).size !== e.o.length) E(id, P + ": Optionen doppelt"); }
    else if (e.t === "gap") { if ((String(e.q).match(/___/g) || []).length !== 1) E(id, P + ": nicht genau eine Lücke");
      if (!Array.isArray(e.a) || !e.a.length) E(id, P + ": a fehlt");
      if (!e.h && /[\wäöåÄÖÅ]___|___[\wäöåÄÖÅ]/.test(e.q)) E(id, P + ": Lücke mitten im Wort ohne h"); }
    else if (e.t === "tr") { if (!["de", "fi"].includes(e.dir) || !Array.isArray(e.a) || !e.a.length) E(id, P + ": dir/a fehlerhaft"); }
    else if (e.t === "ord") { const key = s => String(s).toLowerCase().replace(/[.,!?;:"“”„«»()…]/g, "").split(/\s+/).filter(Boolean).sort().join(" ");
      if (!e.de) E(id, P + ": de fehlt");
      [e.a].flat().forEach(a => { if (key(a) !== key((e.w || []).join(" "))) E(id, P + `: „${a}“ passt nicht zu den Kärtchen`); }); }
    else if (e.t === "tab") { const n = (e.head || []).length;
      (e.r || []).forEach((r, j) => { if (r.length !== n) E(id, P + `: Zeile ${j} hat ${r.length} statt ${n} Zellen`); });
      const cols = Math.max(0, ...(e.r || []).map(r => r.filter(isGap).length));
      if (!(e.r || []).some(r => r.some(isGap))) E(id, P + ": keine Lücke");
      if (cols >= 2 && !e.h) E(id, P + ": mehrere Lückenspalten ohne h"); }
    else if (e.t === "les") { if (!Array.isArray(e.txt) || !e.txt.length) E(id, P + ": txt fehlt");
      if (!Array.isArray(e.qs) || e.qs.length < 2 || e.qs.length > 4) E(id, P + ": 2–4 Fragen");
      (e.qs || []).forEach((q, j) => { if (!(q.a >= 0 && q.a < (q.o || []).length)) E(id, P + `: Frage ${j} a fehlerhaft`); }); }
    else if (e.t === "sch") { if (!Array.isArray(e.a) || !e.a.length || !e.q) E(id, P + ": q/a fehlt"); }
    else if (e.t === "dlg") { if (!(e.r || []).some(r => isGap(r[1]))) E(id, P + ": keine eigene Zeile");
      (e.r || []).forEach((r, j) => { if (isGap(r[1]) && !r[2]) E(id, P + `: Zeile ${j} ohne Anweisung`); }); }
    else E(id, P + ": unbekannter Typ");
  });
  // Mengen
  const sub = /[b-z]$/.test(id), x3 = /c$/.test(id);
  const [vmin, vmax] = !sub ? [20, 25] : x3 ? [5, 12] : /d$/.test(id) ? [5, 20] : [15, 20];
  if (t.v.length < vmin || t.v.length > vmax) W(id, `${t.v.length} Wörter (Plan ${vmin}–${vmax})`);
  if (t.ex.length < 15) E(id, `nur ${t.ex.length} Übungen (mind. 15)`);
  ["les", "dlg", "sch"].forEach(k => { if ((cnt[k] || 0) < 2) E(id, `nur ${cnt[k] || 0}× ${k} (mind. 2)`); });
  if (!cnt.tab) W(id, "keine tab-Übung");
  const rules = t.ex.filter(e => e.t === "mc" && e.x && !String(e.q).includes("___")).length;
  if (rules < 2) E(id, `nur ${rules} Regelfragen mit x (2–4)`);
  if (!/gesprochen/i.test(t.th)) E(id, "Kasten „So sagt man's gesprochen“ fehlt");
  // Wörter aus Themen außerhalb der Voraussetzungen (nur solche, die anderswo eine Karte haben)
  const cl = closure(id); cl.add(id);
  const texts = [];
  t.ex.forEach((e, i) => {
    const a0 = Array.isArray(e.a) ? e.a[0] : e.a;
    if (e.t === "gap") texts.push([i, String(e.q).replace("___", a0)]);
    if (e.t === "sch" || (e.t === "tr" && e.dir === "de")) texts.push([i, a0]);
    if (e.t === "tr" && e.dir === "fi") texts.push([i, e.q]);
    if (e.t === "ord") texts.push([i, [e.a].flat()[0]]);
    if (e.t === "tab") (e.r || []).forEach(r => r.forEach(c => texts.push([i, isGap(c) ? gapAlts(c)[0] : c])));
    if (e.t === "dlg") (e.r || []).forEach(r => texts.push([i, isGap(r[1]) ? gapAlts(r[1])[0] : r[1]]));
    if (e.t === "les") (e.txt || []).forEach(x => texts.push([i, String(x).replace(/^[^:]{1,20}:/, "")]));
  });
  const outside = new Map();
  const given = i => new Set([...toks(t.ex[i].h), ...(t.ex[i].w || []).flatMap(toks)]);
  texts.forEach(([i, s]) => toks(s).forEach(w => {
    const hit = vocabIdx.get(w); if (!hit || GX[w] || given(i).has(w)) return;
    if ([...hit].some(x => cl.has(x) || alt.slice(0, 8).some(b => b.id === x))) return;
    if (!outside.has(w)) outside.set(w, { from: [...hit], ex: new Set() }); outside.get(w).ex.add(i);
  }));
  outside.forEach((o, w) => W(id, `„${w}“ (Übung ${[...o.ex].join(",")}) hat eine Karte nur in ${o.from.join(", ")} – nicht in den Voraussetzungen`));
  doc.push(`| ${id} | ${t.title} | ${t.v.length} | ${t.ex.length} (les ${cnt.les || 0}, dlg ${cnt.dlg || 0}, sch ${cnt.sch || 0}, tab ${cnt.tab || 0}, Regelfragen ${rules}) |`);
}
console.log(doc.join("\n"));
console.log(`\n${neu.length} Entwurfsthemen, ${neu.reduce((s, t) => s + t.v.length, 0)} Wörter, ${neu.reduce((s, t) => s + t.ex.length, 0)} Übungen – Fehler: ${nErr}, Hinweise: ${nWarn}`);
if (!only.length) fs.writeFileSync(path.resolve(DIR, "../lektionen-a2.json"), JSON.stringify(neu, null, 1) + "\n");
process.exitCode = nErr ? 1 : process.exitCode;
