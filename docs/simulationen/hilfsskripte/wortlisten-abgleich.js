// Wörter in Musterlösungen, die in keiner Wortliste bis zu diesem Thema vorkommen (Reihenfolge wie in der App).
// Aufruf: node wortlisten-abgleich.js <repo> <themenId...>   ·   STAMM=1 zählt Formen mit gleichem Wortanfang (ab 4 Buchstaben) als bekannt
const vm = require("vm"), fs = require("fs"), path = require("path");
const R = process.argv[2], ids = process.argv.slice(3);
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(R, "js/app.js"), "utf8") + "\n" + fs.readFileSync(path.join(R, "js/inhalte.js"), "utf8") + "\n;this.BT=BASE_TOPICS;this.G=typeof GLOSS_EXTRA!=='undefined'?GLOSS_EXTRA:{};", ctx);
const L = JSON.parse(fs.readFileSync(path.join(R, "lektionen/lektionen.json"), "utf8"));
const all0 = [...ctx.BT, ...L], idset = new Set(all0.map(t => t.id));
const par = t => { const m = /^(.*\d)([a-z])$/.exec(t.id); return m && idset.has(m[1]) ? m[1] : null; };
const all = []; all0.forEach(t => { if (par(t)) return; all.push(t); all0.filter(x => par(x) === t.id).sort((a, b) => a.id < b.id ? -1 : 1).forEach(x => all.push(x)); });
const tok = s => String(s).toLowerCase().replace(/\[|\]/g, " ").split(/[^a-zåäöšž-]+/).filter(w => w.length > 1);
function stemKnown(x){const c=(a,b)=>{let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;return i};for(const k of known){if(k.length<3)continue;const n=c(k,x);if(n>=4&&n>=Math.min(k.length,x.length)-2)return true}return false}
const known = new Set(Object.keys(ctx.G || {}).flatMap(tok));
for (const t of all) {
  t.v.forEach(w => tok(w[0]).forEach(x => known.add(x)));
  if (!ids.includes(t.id)) continue;
  const fin = [];
  t.ex.forEach((e, i) => {
    const add = s => tok(s).forEach(x => fin.push([x, i]));
    if (e.t === "gap" || e.t === "sch") (e.a || []).slice(0, 1).forEach(add);
    if (e.t === "tr" && e.dir === "de") (e.a || []).slice(0, 1).forEach(add);
    if (e.t === "ord") add(Array.isArray(e.a) ? e.a[0] : e.a);
    if (e.t === "tab") (e.r || []).forEach(r => r.forEach(c => /^\[/.test(c) && add(c.slice(1).split("|")[0])));
    if (e.t === "dlg") (e.r || []).forEach(r => /^\[/.test(r[1]) && add(r[1].slice(1).split("|")[0]));
  });
  const unk = {}; fin.forEach(([x, i]) => { if (!known.has(x) && !(process.env.STAMM && stemKnown(x))) (unk[x] = unk[x] || new Set()).add(i); });
  console.log(t.id + ": " + Object.entries(unk).map(([x, s]) => x + "[" + [...s].join(",") + "]").join(" "));
}
