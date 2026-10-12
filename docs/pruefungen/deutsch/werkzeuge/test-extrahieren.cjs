// S-1011-15: Einstufungstest des Deutsch-Trainers (js/inhalte.js, PT + PT_READING) als lesbarer Text
// Aufruf: node test-extrahieren.cjs <deutsch-trainer> <ausgabe.txt>
const fs = require("fs");
const [dt, out] = process.argv.slice(2);
const src = fs.readFileSync(dt + "/js/inhalte.js", "utf8");
const teil = src.slice(src.indexOf("const PT = ["));
const { PT, PT_READING } = new Function(teil + "\nreturn { PT, PT_READING: typeof PT_READING !== 'undefined' ? PT_READING : null };")();
const z = [];
const zeige = (x, ein = "") => {
  if (x == null) return;
  if (typeof x !== "object") { z.push(ein + String(x)); return; }
  z.push(ein + JSON.stringify(x));
};
for (const teilT of PT) {
  z.push(`\n# Teil ${teilT.id} – ${teilT.name || ""} ${teilT.time ? "(" + teilT.time + ")" : ""}`);
  for (const k of Object.keys(teilT)) if (!["id", "name", "time", "sections"].includes(k)) zeige(teilT[k], `  [${k}] `);
  for (const s of teilT.sections || []) {
    z.push(`\n## ${s.id} ${s.title || ""}${s.hint ? " – Hinweis: " + s.hint : ""}`);
    for (const k of Object.keys(s)) if (!["id", "title", "hint", "items"].includes(k)) zeige(s[k], `  [${k}] `);
    (s.items || []).forEach((it, i) => z.push(`${s.id}.${i + 1} ${JSON.stringify(it)}`));
  }
}
if (PT_READING) { z.push("\n# PT_READING"); zeige(PT_READING); }
fs.writeFileSync(out, z.join("\n") + "\n");
console.log("Zeilen:", z.length);
