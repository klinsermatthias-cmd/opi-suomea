// Testet automatisierbare Punkte der Inhalts-Prüfliste (nur lesend). Aufruf: node prueflisten-test.mjs <repo>
import fs from "node:fs"; import vm from "node:vm"; import path from "node:path";
const R = process.argv[2]; const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(R, "js/inhalte.js"), "utf8") + "\nthis.B = typeof BASE_TOPICS!=='undefined'?BASE_TOPICS:[];", ctx);
const T = [...ctx.B, ...JSON.parse(fs.readFileSync(path.join(R, "lektionen/lektionen.json"), "utf8"))];
const norm = s => String(s).toLowerCase().replace(/[!?.,;:¿¡"„“”]/g, "").replace(/\s+/g, " ").trim();
const seen = new Map(), dup = [];
T.forEach(t => (t.v || []).forEach(([fi, de], i) => { const k = norm(fi); if (seen.has(k)) dup.push(`${t.id}-${i} „${fi}“ = ${seen.get(k)}`); else seen.set(k, `${t.id}-${i}`); }));
const wenigRegel = [], breit = [];
T.forEach(t => { const n = (t.ex || []).filter(e => e.t === "mc" && e.x).length;
  if (n < 2) wenigRegel.push(`${t.id}:${n}`);
  const html = String(t.theory || t.th || ""); (html.match(/<tr>[\s\S]*?<\/tr>/g) || []).forEach(tr => { const c = (tr.match(/<t[dh]/g) || []).length; if (c > 3) breit.push(`${t.id}:${c}`); }); });
console.log(`Themen ${T.length}, Karten ${seen.size + dup.length}`);
console.log(`Doppelte Karten (ohne Satzzeichen): ${dup.length}`); dup.slice(0, 12).forEach(d => console.log("  " + d));
console.log(`Themen mit < 2 Regelfragen (mc mit x): ${wenigRegel.length}: ${wenigRegel.join(" ")}`);
console.log(`Tabellenzeilen > 3 Spalten: ${[...new Set(breit)].length}: ${[...new Set(breit)].slice(0, 15).join(" ")}`);
