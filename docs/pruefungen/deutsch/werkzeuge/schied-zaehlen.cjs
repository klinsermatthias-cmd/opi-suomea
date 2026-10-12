// S-1011: zählt die Endurteile der Schiedsrunde je Datei (Urteil, Schwere der nicht verworfenen Funde, Kategorien)
// Aufruf: node schied-zaehlen.cjs
const fs = require("fs");
const D = __dirname + "/../schied";
for (const g of ["d01", "d02", "d03", "plan"]) {
  const f = `${D}/${g}.md`;
  if (!fs.existsSync(f)) { console.log(g, "fehlt"); continue; }
  const urteil = {}, schwere = {}, kat = {};
  let n = 0, eigene = 0;
  for (const z of fs.readFileSync(f, "utf8").split("\n")) {
    const m = /^\[(E?\d+)\]\s*[^|]*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/.exec(z);
    if (!m) continue;
    n++;
    if (m[1].startsWith("E")) eigene++;
    const u = m[2].replace(/\s*→.*$/, "").replace(/^DOPPELT.*/, "DOPPELT").toUpperCase();
    urteil[u] = (urteil[u] || 0) + 1;
    if (/ÜBERTRIEBEN|FALSCH|DOPPELT/.test(u)) continue;
    const s = m[4].toLowerCase().replace(/[^a-zäöü–-]/g, "");
    schwere[s] = (schwere[s] || 0) + 1;
    kat[m[3].toUpperCase()] = (kat[m[3].toUpperCase()] || 0) + 1;
  }
  console.log(`${g}: ${n} Zeilen (davon ${eigene} eigene)\n  Urteil: ${JSON.stringify(urteil)}\n  Schwere: ${JSON.stringify(schwere)}\n  Kategorie: ${JSON.stringify(kat)}`);
}
