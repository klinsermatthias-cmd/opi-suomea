// Prüft: Steht jedes Kernwort des Themenplans (20.1–35.4) als Karte in A1 oder im Entwurf?
const fs = require("fs");
const L = require("/home/user/opi-suomea/docs/pruefungen/entwurf-a2/werkzeuge/laden.cjs");
const plan = fs.readFileSync("/home/user/opi-suomea/docs/pruefungen/2026-10-08-themenplan-bis-b1.md", "utf8");
const karten = [];
for (const t of L.all) t.v.forEach(([f]) => karten.push([t.id, f.toLowerCase()]));
const fehlt = [], schwach = [];
let n = 0;
for (const line of plan.split("\n")) {
  const m = line.match(/^\|\s*(2\d|3[0-5])\.(\d)\s/);
  if (!m) continue;
  const k = line.match(/\*\*Kernwörter:\*\*([^|]*?)(\*\*Ich kann|\|)/);
  if (!k) continue;
  const teil = `${m[1]}.${m[2]}`;
  const woerter = k[1].replace(/\*\([^)]*\)\*/g, "").replace(/\([^)]*\)/g, "").split(/[,;]/).map(w => w.replace(/[*.]/g, "").trim().toLowerCase()).filter(w => w && !/^keine/.test(w));
  for (const w of woerter) {
    n++;
    const genau = karten.filter(([, f]) => f === w || f.split(/[ (,]/)[0] === w);
    if (genau.length) continue;
    const teilw = karten.filter(([, f]) => f.includes(w));
    if (teilw.length) schwach.push(`${teil} ${w} ~ ${teilw.slice(0, 3).map(x => x.join(":")).join(", ")}`);
    else fehlt.push(`${teil} ${w}`);
  }
}
console.log("Kernwörter:", n, "| fehlen:", fehlt.length, "| nur als Teil:", schwach.length);
console.log("FEHLT:\n" + fehlt.join("\n"));
console.log("NUR ALS TEIL:\n" + schwach.join("\n"));
