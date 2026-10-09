// S-1009-1: Endstand = Schiedsurteil für alle D/E-Kandidaten (plus eigene Korrekturen aus korrektur.json),
// sonst strengere Klasse der beiden Rollen. Schreibt endstand.json und gibt Statistik je Niveau aus.
const fs = require("fs"), D = __dirname;
const I = require(D + "/einheiten.json"), L = require(D + "/pruefliste.json"), S = require(D + "/stand.json");
const K = fs.existsSync(D + "/korrektur.json") ? require(D + "/korrektur.json") : {};
const RANG = { A: 0, B: 1, C: 2, D: 3, E: 4 };
const urteil = {};
for (const f of fs.readdirSync(D + "/schied").filter(f => /^urteil-\d\.md$/.test(f)))
  for (const z of fs.readFileSync(D + "/schied/" + f, "utf8").split("\n")) {
    const m = /^\[(\d+)\]\s*(\S+)\s+(\S+)\s*\|\s*([A-E])/.exec(z);
    if (m) urteil[+m[1]] = { tid: m[2], u: m[3], k: m[4], zeile: z };
  }
const fehlt = L.map((_, i) => i + 1).filter(n => !urteil[n]);
// Klassen je Einheit aus den Rollen (strengere), dann Schiedsurteil/eigene Korrektur drüber
const fin = {};
for (const t of S.proThema) fin[t.tid] = {};
const lesen = require(D + "/auswerten-lesen.cjs");
for (const [tid, x] of Object.entries(I)) for (const u of x.units) {
  const k1 = lesen.R1[tid]?.units[u]?.k || "A", k2 = lesen.R2[tid]?.units[u]?.k || "A";
  fin[tid][u] = RANG[k1] >= RANG[k2] ? k1 : k2;
}
const de = [];
L.forEach((x, i) => {
  const n = i + 1, ur = urteil[n], k = K[n]?.k || ur?.k;
  if (!k) return;
  if (I[x.tid].units.includes(x.u)) fin[x.tid][x.u] = k;
  if (RANG[k] >= 3) de.push({ n, tid: x.tid, lvl: x.lvl, u: x.u, k, text: x.text, urteil: ur?.zeile || "", eigen: K[n]?.grund || "" });
});
const st = {};
for (const [tid, x] of Object.entries(I)) {
  const key = x.lvl;
  const p = (st[key] = st[key] || { themen: 0, n: 0, A: 0, B: 0, C: 0, D: 0, E: 0 });
  p.themen++; for (const u of x.units) { p.n++; p[fin[tid][u]]++; }
}
const pc = (a, n) => (Math.round((1000 * a) / n) / 10).toFixed(1) + " %";
console.log("Niveau | Themen | Sätze | A | B | C | D | E");
for (const [l, p] of Object.entries(st).sort()) console.log(`${l} | ${p.themen} | ${p.n} | ${pc(p.A, p.n)} | ${pc(p.B, p.n)} | ${pc(p.C, p.n)} | ${pc(p.D, p.n)} | ${pc(p.E, p.n)}`);
console.log("Schiedsurteile:", Object.keys(urteil).length, "von", L.length, fehlt.length ? "· fehlen: " + fehlt.join(",") : "", "· End-D/E:", de.length);
fs.writeFileSync(D + "/endstand.json", JSON.stringify({ st, de, fin }, null, 1));
