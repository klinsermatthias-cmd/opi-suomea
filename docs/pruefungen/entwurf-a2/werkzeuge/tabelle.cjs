// Schreibt die Tabelle „Themen“ in bericht.md neu (aus den Entwurfsdateien). Aufruf: node tabelle.cjs
const fs = require("fs"), path = require("path");
const { neu } = require("./laden.cjs");
const f = path.resolve(__dirname, "../bericht.md");
let s = fs.readFileSync(f, "utf8");
const rows = neu.map(t => { const c = k => t.ex.filter(e => e.t === k).length;
  return `| ${t.id} | ${t.title} | ${t.v.length} | ${t.ex.length} (les ${c("les")}, dlg ${c("dlg")}, sch ${c("sch")}, tab ${c("tab")}) | ausgearbeitet, geprüft |`; });
s = s.replace(/(## Themen\n\| ID \| Titel \| Wörter \| Übungen \| Status \|\n\|---\|---\|---\|---\|---\|\n)[\s\S]*?(\n## )/, (m, a, b) => a + rows.join("\n") + "\n" + b);
fs.writeFileSync(f, s);
console.log(rows.length + " Zeilen");
