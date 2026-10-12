// S-1011: zieht alle Inhalte der Deutsch-Trainer-Themen lesbar heraus – mit ALLEN akzeptierten Antworten, Hinweisen
// und Erklärungen (für die Korrektheitsprüfung). Nur lesend.
// Aufruf: node extrahieren.cjs <pfad/zu/deutsch-trainer> <ausgabeordner>
const fs = require("fs");
const [repo, out] = process.argv.slice(2);
const L = JSON.parse(fs.readFileSync(repo + "/lektionen/lektionen.json", "utf8"));
const strip = s => String(s).replace(/<\/(td|th)>/g, " | ").replace(/<br\s*\/?>/g, " / ").replace(/<\/(p|li|h3|tr)>/g, "\n").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/( \|)+\s*$/gm, "").trim();
const lueck = s => String(s).replace(/\[([^\]]*)\]/g, (_, g) => "«" + g.split("|").join(" / ") + "»");
for (const t of L) {
  const z = [`# ${t.id} – ${t.title} · Niveau ${t.lvl} · req: ${(t.req || []).join(", ") || "–"}${t.fi ? " · fi: " + t.fi : ""}`, "", "## Theorie", strip(t.th), "", "## Karten (Deutsch = Englisch)"];
  t.v.forEach(([d, e], i) => z.push(`v${i} ${d} = ${e}`));
  z.push("", "## Übungen (alle akzeptierten Antworten; «a / b» = Alternativen einer Lücke)");
  t.ex.forEach((e, i) => {
    const h = e.h ? `  [h: ${e.h}]` : "", x = e.x ? `  [x: ${e.x}]` : "", s = e.s ? "  [streng]" : "";
    const A = a => (Array.isArray(a) ? a : [a]).join(" | ");
    if (e.t === "gap") z.push(`e${i} gap: ${e.q} ⇒ ${A(e.a)}${h}${x}${s}`);
    else if (e.t === "tr") z.push(`e${i} tr (${e.dir === "de" ? "EN→DE" : "DE→EN"}): ${e.q} ⇒ ${A(e.a)}${h}${x}`);
    else if (e.t === "ord") z.push(`e${i} ord: [${(e.w || []).join(" ")}] ⇒ ${A(e.a)}  (EN: ${e.de || ""})${h}`);
    else if (e.t === "sch") z.push(`e${i} sch: ${e.q} (Wörter: ${(e.w || []).join(", ")}) ⇒ ${A(e.a)}${h}${x}`);
    else if (e.t === "mc") z.push(`e${i} mc: ${e.q} → RICHTIG: ${e.o[e.a]} | falsch: ${e.o.filter((_, j) => j !== e.a).join(" / ")}${h}${x}`);
    else if (e.t === "tab") { z.push(`e${i} tab: ${e.q}${h} | Kopf: ${e.head.join(" / ")}`); e.r.forEach(r => z.push("   " + r.map(lueck).join(" / "))); }
    else if (e.t === "les") { z.push(`e${i} les: ${e.q}${h}`); e.txt.forEach((l, j) => z.push(`e${i}.s${j} ${l}`)); e.qs.forEach(q => z.push(`   F: ${q.q} → RICHTIG: ${q.o[q.a]} | falsch: ${q.o.filter((_, j) => j !== q.a).join(" / ")}`)); }
    else if (e.t === "dlg") { z.push(`e${i} dlg: ${e.q}${h}`); e.r.forEach((r, j) => z.push(`e${i}.r${j} ${r[0]}: ${lueck(r[1])}${r[2] ? "  (Aufgabe: " + r[2] + ")" : ""}`)); }
    else z.push(`e${i} ${e.t}: ${JSON.stringify(e)}`);
  });
  fs.writeFileSync(`${out}/${t.id}.txt`, z.join("\n") + "\n");
  console.log(t.id, z.length, "Zeilen");
}
