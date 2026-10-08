// Sucht Wörter in allen Wortlisten (vorhandene Themen + Entwurf): node wort.cjs työ kollega …
// Treffer: genaue Grundform oder Wortlisten-Eintrag, der mit dem Wort beginnt/es enthält.
const { all } = require("./laden.cjs");
const norm = s => s.toLowerCase().replace(/\(.*?\)/g, "").trim();
for (const q of process.argv.slice(2)) {
  const k = q.toLowerCase(), hit = [];
  all.forEach(t => t.v.forEach(([fi, de], i) => {
    const f = norm(fi);
    if (f === k) hit.push(`= ${t.id}/${i} ${fi} – ${de}`);
    else if (f.split(/[ ,/;!?.]+/).includes(k) || (k.length >= 5 && f.startsWith(k.slice(0, -1)))) hit.push(`~ ${t.id}/${i} ${fi} – ${de}`);
  }));
  console.log(q + ": " + (hit.length ? hit.slice(0, 6).join(" | ") : "NEU"));
}
