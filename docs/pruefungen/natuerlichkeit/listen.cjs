// S-1009-1: erzeugt die Anhänge zum Bericht: themen-tabelle.md (A–E je Thema) und d-e-liste.md (alle End-D/E)
const fs = require("fs"), D = __dirname, out = process.argv[2];
const E = require(D + "/endstand.json"), I = require(D + "/einheiten.json");
const K = fs.existsSync(D + "/korrektur.json") ? require(D + "/korrektur.json") : {};
const zelle = s => String(s || "").replace(/\|/g, "/").replace(/\s+/g, " ").trim();
// Tabelle je Thema
const z = ["# Natürlichkeit je Thema (S-1009-1)", "", "Endstand nach zwei Prüfrollen, Schiedsrunde und eigener Kontrolle. A natürlich · B Schriftsprache · C vereinfacht · D so sagt es kein Finne · E falsch.", "", "| Thema | Niveau | Art | Sätze | A | B | C | D | E |", "|---|---|---|---|---|---|---|---|---|"];
for (const [tid, x] of Object.entries(I)) {
  const c = { A: 0, B: 0, C: 0, D: 0, E: 0 }; for (const u of x.units) c[E.fin[tid][u]]++;
  z.push(`| ${tid} | ${x.lvl} | ${x.art} | ${x.units.length} | ${c.A} | ${c.B} | ${c.C} | ${c.D} | ${c.E} |`);
}
fs.writeFileSync(out + "/themen-tabelle.md", z.join("\n") + "\n");
// D/E-Liste
const l = ["# Sätze zum Ersetzen (D) und Fehler (E) – S-1009-1", "", "Jede Zeile: von zwei Rollen gemeldet, in der Schiedsrunde bestätigt und vom Simulations-Chat kontrolliert. Live-Themen (t01–t19c) sind nur Vorschläge für den Inhalts-Chat; Entwurf (t20–t35d) wird erst nach eigenem OK geändert. Stelle = ID aus `texte/<thema>.txt` (eN = Übung N, .rM = Dialogzeile, .sM = Lesetextzeile, th = Theorie, v = Karte).", ""];
for (const art of ["live", "entwurf"]) {
  l.push(`## ${art === "live" ? "Live-Themen t01–t19c (Vorschlag für den Inhalts-Chat)" : "Entwurf t20–t35d"}`, "", "| Nr | Thema | Stelle | Kl. | Satz | Problem | natürlich (geschrieben / gesprochen) |", "|---|---|---|---|---|---|---|");
  for (const d of E.de.filter(d => I[d.tid].art === art)) {
    const f = d.urteil.split("|").map(s => s.trim());
    const alt = f.slice(4).filter(s => /geschrieben|gesprochen|richtig/.test(s)).join(" · ");
    const grund = K[d.n] ? K[d.n].grund + " (eigene Kontrolle)" : f[3];
    l.push(`| ${d.n} | ${d.tid} | ${d.u} | ${d.k} | ${zelle(d.text)} | ${zelle(grund)} | ${zelle(alt)} |`);
  }
  l.push("");
}
fs.writeFileSync(out + "/d-e-liste.md", l.join("\n"));
console.log("geschrieben:", out);
