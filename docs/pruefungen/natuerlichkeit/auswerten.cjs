// S-1009-1: liest funde/gN-r1.md und gN-r2.md, vergleicht die Rollen, zählt A–E je Thema/Niveau
// Aufruf: node auswerten.cjs [streit]   (streit → schreibt streit.md mit allen Einheiten, bei denen eine Rolle D/E sagt
// und die andere nicht dasselbe)
const fs = require("fs");
const D = __dirname;
const I = require(D + "/einheiten.json");
const G = require(D + "/gruppen.json");
const RANG = { A: 0, B: 1, C: 2, D: 3, E: 4 };
const lesen = f => {
  const r = {}; // tid → { done, units: {uid: {k, tag, zeile}}, eindruck }
  if (!fs.existsSync(f)) return r;
  let t = null;
  for (const z of fs.readFileSync(f, "utf8").split("\n")) {
    let m;
    if ((m = /^## (t\d+[a-z]?)\b/.exec(z))) { t = r[m[1]] = { done: true, units: {}, eindruck: "" }; continue; }
    if (/^## FERTIG/.test(z)) { t = null; continue; }
    if (!t) continue;
    if ((m = /^B:\s*(.*)$/.exec(z))) {
      for (const x of m[1].split(/\s+/).filter(Boolean)) {
        const [uid, tag] = x.split(":");
        if (/^(th|v|e)/.test(uid)) t.units[uid] = t.units[uid] && RANG[t.units[uid].k] > 1 ? t.units[uid] : { k: "B", tag: tag || "", zeile: "" };
      }
    } else if ((m = /^- ([\w.]+)\s*\|\s*([A-E])\b/.exec(z))) {
      const alt = t.units[m[1]];
      if (!alt || RANG[m[2]] >= RANG[alt.k]) t.units[m[1]] = { k: m[2], tag: "", zeile: z.slice(2) };
    } else if ((m = /^Eindruck:\s*(.*)/.exec(z))) t.eindruck = m[1];
  }
  return r;
};
const R1 = {}, R2 = {};
for (const g of G) { Object.assign(R1, lesen(`${D}/funde/g${g.g}-r1.md`)); Object.assign(R2, lesen(`${D}/funde/g${g.g}-r2.md`)); }
const streit = [], proThema = [], proNiveau = {};
for (const [tid, x] of Object.entries(I)) {
  const a = R1[tid], b = R2[tid];
  if (!a || !b) { proThema.push({ tid, fehlt: [!a && "r1", !b && "r2"].filter(Boolean).join("+") }); continue; }
  const z = { A: 0, B: 0, C: 0, D: 0, E: 0 }, z1 = { ...z }, z2 = { ...z };
  for (const u of x.units) {
    const k1 = a.units[u]?.k || "A", k2 = b.units[u]?.k || "A";
    z1[k1]++; z2[k2]++;
    const k = RANG[k1] >= RANG[k2] ? k1 : k2;
    z[k]++;
    if ((RANG[k1] >= 3 || RANG[k2] >= 3) && k1 !== k2) streit.push({ tid, u, k1, k2, z1: a.units[u]?.zeile || "", z2: b.units[u]?.zeile || "" });
  }
  // gemeldete IDs, die es nicht gibt (z. B. th, eN bei Dialogen) – trotzdem als Fund behalten
  for (const [rn, rr] of [["r1", a], ["r2", b]]) for (const [u, v] of Object.entries(rr.units)) if (!x.units.includes(u) && RANG[v.k] >= 3) streit.push({ tid, u, k1: rn === "r1" ? v.k : "?", k2: rn === "r2" ? v.k : "?", z1: rn === "r1" ? v.zeile : "", z2: rn === "r2" ? v.zeile : "", extra: true });
  proThema.push({ tid, lvl: x.lvl, n: x.units.length, z, z1, z2 });
  const p = (proNiveau[x.lvl] = proNiveau[x.lvl] || { n: 0, A: 0, B: 0, C: 0, D: 0, E: 0 });
  p.n += x.units.length; for (const k in z) p[k] += z[k];
}
const pc = (a, n) => n ? Math.round((100 * a) / n) + "%" : "–";
console.log("Niveau | Einh. | A | B | C | D | E");
for (const [l, p] of Object.entries(proNiveau).sort()) console.log(`${l} | ${p.n} | ${pc(p.A, p.n)} | ${pc(p.B, p.n)} | ${pc(p.C, p.n)} | ${pc(p.D, p.n)} | ${pc(p.E, p.n)}`);
const fehlt = proThema.filter(t => t.fehlt);
console.log("fertig:", proThema.length - fehlt.length, "von", proThema.length, fehlt.length ? "· fehlt: " + fehlt.map(t => t.tid + "(" + t.fehlt + ")").join(" ") : "");
console.log("Streitfälle (D/E nur bei einer Rolle oder D≠E):", streit.length);
fs.writeFileSync(D + "/stand.json", JSON.stringify({ proThema, proNiveau, streit }, null, 1));
if (process.argv[2] === "streit") {
  const zeilen = streit.map(s => `- ${s.tid} ${s.u} | Rolle 1: ${s.k1} ${s.z1 ? "· " + s.z1 : ""} | Rolle 2: ${s.k2} ${s.z2 ? "· " + s.z2 : ""}`);
  fs.writeFileSync(D + "/streit.md", zeilen.join("\n") + "\n");
  console.log("streit.md geschrieben");
}
