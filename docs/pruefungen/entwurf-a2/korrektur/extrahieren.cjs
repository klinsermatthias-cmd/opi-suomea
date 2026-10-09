// Zieht alle finnischen Texte eines Entwurfsthemas heraus (Lücken mit allen Lösungen gefüllt) – für den Korrektur-Durchgang
const L = require("/home/user/opi-suomea/docs/pruefungen/entwurf-a2/werkzeuge/laden.cjs");
const fs = require("fs");
const out = process.argv[2];
const strip = s => String(s).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
for (const t of L.neu) {
  const z = [];
  z.push(`# ${t.id} – ${t.title} (fi: ${t.fi})`);
  z.push(`## Theorie\n${strip(t.th)}`);
  z.push(`## Karten\n` + t.v.map(([f, d]) => `- ${f} = ${d}`).join("\n"));
  z.push(`## Übungen`);
  t.ex.forEach((e, i) => {
    const p = `[${i}] ${e.t}`;
    const h = e.h ? ` (Hinweis: ${e.h})` : "";
    if (e.t === "gap") z.push(`${p}: ` + e.a.map(a => e.q.replace("___", `«${a}»`)).join(" | ") + h);
    else if (e.t === "tab") z.push(`${p}: ${e.q}${h} | Kopf: ${e.head.join(" / ")}\n` + e.r.map(r => "   " + r.join(" / ")).join("\n"));
    else if (e.t === "tr") z.push(`${p} (${e.dir === "de" ? "DE→FI" : "FI→DE"}): ${e.q} ⇒ ${e.a.join(" | ")}`);
    else if (e.t === "ord") z.push(`${p}: ${e.a.join(" | ")} (DE: ${e.de})`);
    else if (e.t === "mc") z.push(`${p}: ${e.q} → richtig: ${e.o[e.a]} | falsch: ${e.o.filter((_, j) => j !== e.a).join(" / ")}${e.x ? " | Erklärung: " + e.x : ""}`);
    else if (e.t === "les") z.push(`${p}: ${e.q}\n   TEXT: ${e.txt.join(" ")}\n` + e.qs.map(q => `   F: ${q.q} → ${q.o[q.a]}`).join("\n"));
    else if (e.t === "dlg") z.push(`${p}: ${e.q}${h}\n` + e.r.map(r => `   ${r[0]}: ${r[1]}${r[2] ? "  (" + r[2] + ")" : ""}`).join("\n"));
    else if (e.t === "sch") z.push(`${p}: ${e.q} (Wörter: ${(e.w || []).join(", ")}) ⇒ ${e.a.join(" | ")}${h}`);
    else z.push(`${p}: ${JSON.stringify(e)}`);
  });
  fs.writeFileSync(`${out}/${t.id}.txt`, z.join("\n") + "\n");
}
console.log("geschrieben:", L.neu.length);
