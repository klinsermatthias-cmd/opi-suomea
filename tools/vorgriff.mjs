// Vorgriff-Prüfung (D-1014-62/-71): sucht in den SELBST zu bildenden Antworten (gap, luk/tab-Kästchen, tr in die
// Lernsprache, sch-Muster, Lernenden-Zeilen im dlg) Formen aus Themen bzw. Lernschritten, die in der Lernreihenfolge
// erst SPÄTER kommen. Statt ganze Themen zu lesen: node tools/vorgriff.mjs [themenId…] [--kurz]
// Die Marker sind Inhalt der App: lektionen/vorgriff.json
//   { "order"?: ["d01", …], "marker": { "<themenId>": ["regex", …], "<themenId>/<Schritt ab 1>": ["regex", …] },
//     "bekannt"?: { "<themenId>": ["regex", …] } }  – bekannt: Wendungen, die in diesem Thema als bekannt gelten (D-1021-7)
// "<id>/<k>": Formen, die erst in Schritt k desselben Themas kommen – Treffer in früheren Schritten dieses Themas sind
// Vorgriff. Reihenfolge: "order" oder sonst nach req (Voraussetzungen zuerst, sonst Dateireihenfolge). Ein Thema, das
// zu den (auch indirekten) Voraussetzungen gehört, ist nie Vorgriff. tools/pruefen.mjs zeigt die Zahl der Treffer als
// Hinweis (!), nicht als Fehler. Andere Dateien für Tests: --app, --inhalte, --lektionen, --marker
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const opt = {
  app: "js/app.js",
  inhalte: "js/inhalte.js",
  lektionen: "lektionen/lektionen.json",
  marker: "lektionen/vorgriff.json"
};

/* \b und \w kennen in JavaScript nur a–z: neben ä/ö/ü/ß bzw. vor „Größe“ griff ein Marker nicht (DT-Inhalts-Chat
   15.10., S-1014-53). Deshalb werden \w, \W, \b und \B als Unicode-Buchstaben übersetzt (Flag u); lässt sich ein
   Marker so nicht übersetzen, gilt er unverändert. */
const UW = "\\p{L}\\p{N}_";
export function uniRe(r) {
  let out = "",
    cls = false;
  for (let i = 0; i < r.length; i++) {
    const c = r[i];
    if (c === "\\" && i + 1 < r.length) {
      const d = r[++i];
      if (d === "w") out += cls ? UW : `[${UW}]`;
      else if (d === "W") out += cls ? "\\W" : `[^${UW}]`;
      else if (d === "b" && !cls) out += `(?:(?<=[${UW}])(?![${UW}])|(?<![${UW}])(?=[${UW}]))`;
      else if (d === "B" && !cls) out += `(?:(?<=[${UW}])(?=[${UW}])|(?<![${UW}])(?![${UW}]))`;
      else out += c + d;
      continue;
    }
    if (c === "[" && !cls) cls = true;
    else if (c === "]" && cls) cls = false;
    out += c;
  }
  try {
    return new RegExp(out, "u");
  } catch (e) {
    return new RegExp(r);
  }
}

export function vorgriff(o = {}) {
  o = { ...opt, ...o };
  const read = f => fs.readFileSync(path.resolve(ROOT, f), "utf8");
  let cfg;
  try {
    cfg = JSON.parse(read(o.marker));
  } catch (e) {
    return null; /* keine Marker für diese App */
  }
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(
    read(o.app) + "\n" + read(o.inhalte) + "\n;this.BT = typeof BASE_TOPICS === 'undefined' ? [] : BASE_TOPICS;",
    ctx
  );
  let lessons = [];
  try {
    lessons = JSON.parse(read(o.lektionen));
  } catch (e) {}
  const all = [...ctx.BT, ...lessons],
    byId = new Map(all.map(t => [t.id, t]));
  /* Reihenfolge: vorgegeben oder nach req (Tiefensuche, Dateireihenfolge) */
  let order = Array.isArray(cfg.order) ? cfg.order.filter(id => byId.has(id)) : [];
  if (!order.length) {
    const seen = new Set(),
      visit = id => {
        if (seen.has(id) || !byId.has(id)) return;
        seen.add(id);
        (byId.get(id).req || []).forEach(visit);
        order.push(id);
      };
    all.forEach(t => visit(t.id));
  } else all.forEach(t => !order.includes(t.id) && order.push(t.id));
  const pos = id => (order.includes(id) ? order.indexOf(id) : Infinity) /* Marker für noch nicht gebaute Themen */,
    reqs = id => {
      const out = new Set(),
        go = x => (byId.get(x)?.req || []).forEach(r => !out.has(r) && (out.add(r), go(r)));
      go(id);
      return out;
    };
  const M = Object.entries(cfg.marker || {}).map(([k, res]) => {
    const [id, st] = k.split("/");
    return { id, st: st ? +st : 0, res: res.map(uniRe) };
  });
  /* bekannt: {Themen-ID: [Regex]} – als bekannt geltende Wendungen werden vor der Prüfung entfernt */
  const BK = Object.fromEntries(Object.entries(cfg.bekannt || {}).map(([k, res]) => [k, res.map(uniRe)]));
  const tgt = s => [...String(s).matchAll(/\[([^\]]+)\]/g)].map(m => m[1].split("|")[0]);
  const prod = e => {
    if (e.t === "gap" || e.t === "sch" || (e.t === "tr" && e.dir === "de"))
      return []
        .concat(e.a || [])
        .map(String)
        .slice(0, 1);
    if (e.t === "luk") return (e.txt || []).flatMap(tgt);
    if (e.t === "tab") return (e.r || []).flatMap(r => r.flatMap(tgt));
    if (e.t === "dlg") return (e.r || []).filter(r => /^\[[\s\S]*\]$/.test(String(r[1] || ""))).flatMap(r => tgt(r[1]));
    return [];
  };
  const hits = [];
  for (const id of order) {
    const t = byId.get(id);
    if (!t || t.wort || !Array.isArray(t.ex)) continue;
    const before = reqs(id),
      stepOf = i => (Array.isArray(t.steps) ? t.steps.findIndex(s => (s.ex || []).includes(i)) + 1 : 0);
    t.ex.forEach((e, i) => {
      if (e.aus) return;
      const P = (BK[id] || []).reduce(
        (p, r) => p.replace(new RegExp(r.source, r.flags.includes("g") ? r.flags : r.flags + "g"), " "),
        prod(e).join(" / ")
      );
      if (!P) return;
      for (const m of M) {
        if (m.id === id) {
          const s = stepOf(i);
          if (!m.st || !s || s >= m.st) continue;
        } else if (before.has(m.id) || pos(m.id) < pos(id) || m.st) continue;
        const re = m.res.find(r => r.test(P));
        if (re)
          hits.push({
            id,
            step: stepOf(i),
            ei: i,
            t: e.t,
            mk: m.id + (m.st ? "/" + m.st : ""),
            m: P.match(re)[0],
            p: P
          });
      }
    });
  }
  return hits;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const args = process.argv.slice(2),
    o = {},
    ids = [];
  let kurz = false;
  for (let i = 0; i < args.length; i++) {
    const m = /^--(app|inhalte|lektionen|marker)$/.exec(args[i]);
    if (m) o[m[1]] = args[++i];
    else if (args[i] === "--kurz") kurz = true;
    else ids.push(args[i]);
  }
  const h = vorgriff(o);
  if (!h) {
    console.log("Keine Marker (lektionen/vorgriff.json fehlt) – nichts zu prüfen");
    process.exit(0);
  }
  const sel = ids.length ? h.filter(x => ids.includes(x.id)) : h;
  if (!kurz)
    sel.forEach(x =>
      console.log(`${x.id} S${x.step || "-"} ex${x.ei} ${x.t} [${x.mk}] „${x.m}“ in: ${x.p.slice(0, 110)}`)
    );
  console.log(
    `${sel.length} mögliche Vorgriffe${ids.length ? " in " + ids.join(", ") : ""} (Hinweis – von Hand prüfen)`
  );
}
