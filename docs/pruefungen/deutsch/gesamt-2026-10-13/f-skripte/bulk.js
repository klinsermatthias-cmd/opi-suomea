const h = require("./harness"), C = h.load("de");
const ts = require("scratchpad/dtw/lektionen/lektionen.json");
const vacc = w => [w[1], ...w[1].replace(/\(.*?\)/g, "").split(/[,/;]/), ...(w[1].match(/\((.*?)\)/g) || []).flatMap(x => x.slice(1, -1).split(/[,;]/)).map(x => x.replace(/^\s*auch:\s*/, ""))].map(x => x.trim()).filter(Boolean);
let a = 0, an = 0, ex1 = [];
ts.forEach(t => t.ex.forEach((e, i) => { if (e.t === "tr" && e.dir === "fi") { an++; const r = C.localCheck(e.a[0].toLowerCase(), e.a, false, e); if (r.caseOnly) { a++; if (ex1.length < 4) ex1.push(t.id + " ex[" + i + "] " + e.a[0]); } } }));
console.log("tr/fi ganz klein getippt → FALSCH Groß/klein:", a, "von", an, ex1);
let v = 0, vn = 0, ex2 = [];
ts.forEach(t => t.v.forEach((w, i) => { vn++; const acc = vacc(w); const main = acc[1] || acc[0]; const r = C.localCheck(main.toLowerCase(), acc, false); if (r.caseOnly) { v++; ex2.push(t.id + " v[" + i + "] " + main); } }));
console.log("Karte DE→EN klein:", v, "von", vn, ex2.slice(0, 8));
// Klammer-Inhalte als Antwort
let p = [];
ts.forEach(t => t.v.forEach((w, i) => { const acc = vacc(w); acc.forEach(x => { if (/^(Austria|Germany|auch|also)\b|·/.test(x)) p.push(t.id + " v[" + i + "]: „" + x + "“"); }); }));
console.log("Klammer-Teile als gültige Antwort:", p.length, p.slice(0, 6));
console.log("Austria für E-Card:", C.localCheck("Austria", vacc(ts.find(t => t.id === "d08").v[3]), false));
// Tabellenzellen: Satzanfang groß (ganzer Satz oder Fragewort)
let tc = 0, tl = [];
ts.forEach(t => t.ex.forEach((e, i) => { if (e.t !== "tab") return; e.r.forEach(row => row.forEach((c, ci) => { const m = /^\[(.*)\]$/.exec(c); if (!m) return; const acc = m[1].split("|"); const u = acc[0].charAt(0).toLowerCase() + acc[0].slice(1); if (u === acc[0]) return; const r = C.localCheck(u, acc, C.exStrict(e), e); if (r.caseOnly) { tc++; tl.push(t.id + " ex[" + i + "] " + acc[0]); } })); }));
console.log("Tab-Zellen, erster Buchstabe klein → FALSCH:", tc, tl.join("; "));
// Typo-Test
const g = (id, i) => ts.find(t => t.id === id).ex[i];
console.log("Blunenstrauß:", h.verdict(C, g("d05", 41), "Ich nehme diesen Blunenstrauß."));
console.log("Schlüdsel:", h.verdict(C, g("d06", 39), "Gehört dieser Schlüdsel Ihnen?"));
// Sie-Zeile
const e61 = g("d06", 1); const row = e61.r.find(r => /höflich/.test(r[0])); console.log(row, C.localCheck("ihnen", ["Ihnen"], false, e61));
