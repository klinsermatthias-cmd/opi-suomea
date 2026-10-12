// S-1011: nummerierte Fundlisten für die Schiedsrunde (je Thema K + V, Plan extra)
// Aufruf: node schied-eingang.cjs   → schreibt ../schied/eingang-<d01|d02|d03|plan>.md
const fs = require("fs");
const D = __dirname + "/..";
const zeilen = f => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").filter(z => /^- [^|]+\|[^|]+\|[^|]+\|/.test(z)) : []);
const gruppen = { d01: ["d01-k", "d01-v"], d02: ["d02-k", "d02-v"], d03: ["d03-k", "d03-v"], plan: ["plan"], "test-aufgaben": ["test-t1", "test-t2"], "test-bewertung": ["test-bewertung", "test-abdeckung"] };
for (const [g, dateien] of Object.entries(gruppen)) {
  let n = 0;
  const out = [`# Schiedsrunde ${g} – Eingang (nummeriert)`, ""];
  for (const d of dateien) {
    const z = zeilen(`${D}/funde/${d}.md`);
    out.push(`## aus ${d}.md (${z.length})`);
    for (const l of z) out.push(`[${++n}] ${d.endsWith("-k") ? "K" : d.endsWith("-v") ? "V" : d.startsWith("test-") ? d.slice(5).toUpperCase() : "P"} ${l.slice(2)}`);
    out.push("");
  }
  fs.writeFileSync(`${D}/schied/eingang-${g}.md`, out.join("\n"));
  console.log(g, n);
}
