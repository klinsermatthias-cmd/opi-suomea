const fs = require("fs"); const D = __dirname; const G = require(D + "/gruppen.json"); const RANG = { A: 0, B: 1, C: 2, D: 3, E: 4 };
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
module.exports = { R1, R2 };
