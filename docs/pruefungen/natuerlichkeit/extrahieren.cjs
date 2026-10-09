// S-1009-1: zieht alle finnischen Sätze je Thema mit festen IDs heraus (live aus origin/main, Entwurf aus themen/*.js)
const fs = require("fs"), vm = require("vm"), cp = require("child_process");
const ROOT = "/home/user/opi-suomea";
const L = require(ROOT + "/docs/pruefungen/entwurf-a2/werkzeuge/laden.cjs");
const out = __dirname + "/texte";
const show = f => cp.execSync(`git -C ${ROOT} show origin/main:${f}`, { encoding: "utf8", maxBuffer: 1e8 });
const ctx = {}; vm.createContext(ctx);
vm.runInContext(show("js/app.js") + "\n" + show("js/inhalte.js") + "\n;this.BT = BASE_TOPICS;", ctx);
const live = [...JSON.parse(JSON.stringify(ctx.BT)), ...JSON.parse(show("lektionen/lektionen.json"))];
const strip = s => String(s).replace(/<\/(td|th)>/g, " | ").replace(/<br\s*\/?>/g, " / ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").replace(/( \|)+\s*$/, "").trim();
const fill = (s, alt) => s.replace(/\[([^\]]*)\]/g, (_, g) => "«" + g.split("|")[0] + "»");
const alts = s => [...s.matchAll(/\[([^\]]*)\]/g)].map(m => m[1].split("|")).filter(a => a.length > 1).map(a => a.slice(1).join(" / "));
const satz = s => /\S\s+\S/.test(s);
const index = {};
for (const [art, liste] of [["live", live], ["entwurf", L.neu]]) for (const t of liste) {
  const z = [], u = [];
  const add = (id, txt) => { u.push(id); z.push(`${id} ${txt}`); };
  z.push(`# ${t.id} – ${t.title} (fi: ${t.fi}) · Niveau ${t.lvl} · ${art}`);
  // Theorie: Abschnitte; Tabellenzeilen mit Satz in der ersten Spalte werden nummeriert, „gesprochen“-Abschnitte als Ganzes
  z.push("## Theorie");
  const teile = t.th.split(/<h3>/);
  let n = 0;
  teile.forEach((teil, k) => {
    const [kopf, rest] = k === 0 ? ["(Einleitung)", teil] : [teil.split("</h3>")[0], teil.split("</h3>").slice(1).join("")];
    const rows = [...rest.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m => [...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map(c => strip(c[1])));
    const ohneTab = strip(rest.replace(/<table[\s\S]*?<\/table>/g, " [Tabelle] "));
    z.push(`### ${strip(kopf)}`);
    if (/gesprochen/i.test(kopf)) add(`th.g${++n}`, ohneTab);
    else if (ohneTab) z.push("   " + ohneTab);
    for (const r of rows) {
      if (r.length && satz(r[0]) && /[.?!…]$/.test(r[0]) && !/gesprochen/i.test(kopf)) add(`th.${++n}`, r.join(" | "));
      else if (r.some(Boolean)) z.push("   (Tab) " + r.join(" | "));
    }
  });
  z.push("## Karten (nur Wendungen mit mehreren Wörtern)");
  t.v.forEach(([f, d], i) => { if (satz(f)) add(`v${i}`, `${f} = ${d}`); });
  z.push("## Übungen");
  t.ex.forEach((e, i) => {
    const h = e.h ? `  [Hinweis: ${e.h}]` : "";
    if (e.t === "gap") add(`e${i}`, `(Lücke) ${e.q.replace("___", "«" + e.a[0] + "»")}${e.de ? "  (DE: " + e.de + ")" : ""}`);
    else if (e.t === "tr" && e.dir === "de") add(`e${i}`, `(Übers. DE→FI) ${e.q} ⇒ ${e.a[0]}`);
    else if (e.t === "tr") add(`e${i}`, `(Übers. FI→DE) ${e.q} ⇒ ${e.a[0]}`);
    else if (e.t === "ord") add(`e${i}`, `(Satzbau) ${Array.isArray(e.a) ? e.a[0] : e.a}  (DE: ${e.de})`);
    else if (e.t === "sch") add(`e${i}`, `(Schreiben: ${e.q}) ⇒ ${e.a[0]}`);
    else if (e.t === "mc" && /___/.test(e.q)) add(`e${i}`, `(MC) ${e.q.replace("___", "«" + e.o[e.a] + "»")}`);
    else if (e.t === "mc" && /[.?!]$/.test(e.o[e.a]) && satz(e.o[e.a])) add(`e${i}`, `(MC: ${e.q}) ⇒ ${e.o[e.a]}  | falsch: ${e.o.filter((_, j) => j !== e.a).join(" / ")}`);
    else if (e.t === "dlg") {
      z.push(`e${i} (Dialog) ${e.q}`);
      e.r.forEach((r, j) => { const a = alts(r[1]); add(`e${i}.r${j}`, `${r[0]}: ${fill(r[1])}${r[2] ? "  (Aufgabe: " + r[2] + ")" : ""}${a.length ? "  (auch: " + a.join("; ") + ")" : ""}`); });
    } else if (e.t === "les") {
      z.push(`e${i} (Lesetext) ${e.q}`);
      e.txt.forEach((s, j) => add(`e${i}.s${j}`, s));
      z.push("   Fragen: " + e.qs.map(q => `${q.q} → ${q.o[q.a]}`).join(" · "));
    }
  });
  fs.writeFileSync(`${out}/${t.id}.txt`, z.join("\n") + "\n");
  index[t.id] = { art, lvl: t.lvl, units: u };
}
fs.writeFileSync(__dirname + "/einheiten.json", JSON.stringify(index));
const s = Object.values(index); console.log("Themen", s.length, "Einheiten", s.reduce((a, b) => a + b.units.length, 0));
