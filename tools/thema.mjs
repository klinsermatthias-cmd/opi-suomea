// Ein oder mehrere Themen kompakt lesen (S-1008-103): node tools/thema.mjs <themenId…>
// Gibt je Thema Kopf (Titel, Niveau, Voraussetzungen), Theorie ohne HTML, Wörter (mit Index) und Übungen (mit Index im
// ex-Array; bei mc ist die richtige Option mit * markiert) aus. Statt lektionen/lektionen.json ganz zu öffnen
// (sehr viele Tokens) nur die gebrauchten Themen lesen. Gilt für jede App der Engine: liest js/app.js, js/inhalte.js
// (BASE_TOPICS) und lektionen/lektionen.json des Repos, in dem das Werkzeug liegt.
// Für Tests andere Dateien: --app <datei> --inhalte <datei> --lektionen <datei>
// Prüfvermerk (E-1009-23): node tools/thema.mjs --vermerk <themenId…> --quellen "en.wiktionary, Kielitoimiston sanakirja" --chat F
// trägt in lektionen/pruefvermerke.json je Thema {d: Datum, q: Quellen, c: Chat, h: Prüfsumme des Themas} ein und gibt
// nichts aus. tools/pruefen.mjs warnt bei neuem/geändertem Thema ohne Vermerk und bei Vermerk mit alter Prüfsumme.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2),
  opt = { app: "js/app.js", inhalte: "js/inhalte.js", lektionen: "lektionen/lektionen.json", vermerke: "lektionen/pruefvermerke.json" },
  ids = [];
let vermerk = false;
for (let i = 0; i < args.length; i++) {
  const m = /^--(app|inhalte|lektionen|vermerke|quellen|chat)$/.exec(args[i]);
  if (m) opt[m[1]] = args[++i];
  else if (args[i] === "--vermerk") vermerk = true;
  else ids.push(args[i]);
}
if (!ids.length) {
  console.log("Aufruf: node tools/thema.mjs <themenId…>   (z. B. t07b t08)");
  process.exit(1);
}
const read = f => fs.readFileSync(path.resolve(ROOT, f), "utf8");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(read(opt.app) + "\n" + read(opt.inhalte) + "\n;this.BT = typeof BASE_TOPICS === 'undefined' ? [] : BASE_TOPICS;", ctx);
let lessons = [];
try {
  lessons = JSON.parse(read(opt.lektionen));
} catch (e) {}
const all = [...ctx.BT, ...lessons];
/* Prüfsumme eines Themas – gleiche Rechnung in tools/pruefen/statisch.mjs */
const sum = t => crypto.createHash("sha1").update(JSON.stringify(t)).digest("hex").slice(0, 12);
if (vermerk) {
  if (!opt.quellen || !opt.chat) {
    console.log('Prüfvermerk braucht --quellen "…" und --chat <E|F|D|S>');
    process.exit(1);
  }
  const f = path.resolve(ROOT, opt.vermerke);
  let V = {};
  try {
    V = JSON.parse(fs.readFileSync(f, "utf8"));
  } catch (e) {}
  const d = new Date().toISOString().slice(0, 10);
  for (const id of ids) {
    const t = all.find(x => x.id === id);
    if (!t) {
      console.log("FEHLT " + id);
      process.exit(2);
    }
    V[id] = { d, q: opt.quellen, c: opt.chat, h: sum(t) };
  }
  fs.writeFileSync(f, JSON.stringify(V, null, 2) + "\n");
  console.log(`Prüfvermerk eingetragen: ${ids.join(", ")} (${d}, ${opt.chat})`);
  process.exit(0);
}
const txt = h =>
  String(h || "")
    .replace(/<tr>/g, "\n")
    .replace(/<\/t[dh]>\s*<t[dh][^>]*>/g, " | ")
    .replace(/<(p|li|h3|h4|div|br)[^>]*>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
const mark = (o, a) => (o || []).map((x, k) => (k === a ? "*" : "") + x).join("  ‖  ");
let missing = 0;
for (const id of ids) {
  const t = all.find(x => x.id === id);
  if (!t) {
    console.log("FEHLT " + id);
    missing++;
    continue;
  }
  console.log(`\n######## ${t.id} | ${t.title} | ${t.fi || ""} | lvl ${t.lvl || ""} | req ${(t.req || []).join(",")}`);
  console.log("--- THEORIE\n" + txt(t.th));
  console.log(`--- WÖRTER (${t.v.length})\n` + t.v.map((w, i) => i + ": " + w.join(" = ")).join("\n"));
  console.log(`--- ÜBUNGEN (${t.ex.length})`);
  t.ex.forEach((e, i) => {
    let s = `[${i}] ${e.t}`;
    if (e.dir) s += ` dir=${e.dir}`;
    if (e.q) s += ` Q: ${e.q}`;
    if (e.h) s += `\n     H: ${e.h}`;
    if (e.t === "mc") s += `\n     O: ${mark(e.o, e.a)}`;
    else if (e.t === "tab" || e.t === "dlg")
      s += `\n     R: ${(e.r || []).map(r => r.join(" ; ")).join(" || ")}${e.head ? "\n     KOPF: " + e.head.join(" ; ") : ""}`;
    else if (e.t === "les")
      s += `\n     TXT: ${(e.txt || []).join(" / ")}\n     QS: ${(e.qs || []).map(q => q.q + " → " + mark(q.o, q.a) + (q.x ? " (X: " + q.x + ")" : "")).join("  ##  ")}`;
    else if (e.t === "ord") s += `\n     W: ${(e.w || []).join(" ; ")}${e.de ? "\n     DE: " + e.de : ""}\n     A: ${JSON.stringify(e.a)}`;
    else if (e.a !== undefined) s += `\n     A: ${JSON.stringify(e.a)}`;
    if (e.t === "sch" && e.w) s += `\n     W: ${e.w.join(", ")}`;
    const known = ["t", "q", "h", "o", "a", "r", "dir", "qs", "x", "txt", "head", "w", "de"];
    const rest = Object.keys(e).filter(k => !known.includes(k));
    if (rest.length) s += `\n     +: ${JSON.stringify(Object.fromEntries(rest.map(k => [k, e[k]])))}`;
    if (e.x) s += `\n     X: ${e.x}`;
    console.log(s);
  });
}
process.exit(missing ? 2 : 0);
