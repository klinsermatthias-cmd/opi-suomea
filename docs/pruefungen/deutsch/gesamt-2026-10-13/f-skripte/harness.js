// Lädt die Vergleichsfunktionen der Engine in einen vm-Kontext (nur lesen)
const fs = require("fs"), vm = require("vm");
const J = "scratchpad/main-wt/js/";
function grab(file, name, kind = "function") {
  const src = fs.readFileSync(J + file, "utf8");
  const start = kind === "function" ? src.indexOf("function " + name + "(") : src.indexOf("const " + name + " =");
  if (start < 0) throw new Error("nicht gefunden " + name);
  let i = src.indexOf(kind === "function" ? "{" : "=", start), depth = 0;
  if (kind !== "function") { // const ... = [...]; bis zum ersten ";\n" auf Tiefe 0
    for (let k = i; k < src.length; k++) { const c = src[k]; if ("[{(".includes(c)) depth++; if ("]})".includes(c)) depth--; if (c === ";" && depth === 0) return src.slice(start, k + 1); }
  }
  for (let k = i; k < src.length; k++) { const c = src[k]; if (c === "{") depth++; if (c === "}") { depth--; if (depth === 0) return src.slice(start, k + 1); } }
}
function load(lang = "de") {
  const ctx = { SLIP_MAX: 200, APP: { target: { code: lang } }, S: { slips: [] }, cut: (s, n) => String(s).slice(0, n), console };
  vm.createContext(ctx);
  const sp = fs.readFileSync(J + "sprache.js", "utf8").replace("const SP =", "var SP =");
  vm.runInContext(sp, ctx);
  const parts = [
    grab("daten.js", "norm"), grab("daten.js", "loose"),
    grab("uebungen.js", "KEY_ROWS", "const"), grab("uebungen.js", "keyNeighbors"), grab("uebungen.js", "typoOf"),
    grab("uebungen.js", "exStrict"), grab("uebungen.js", "caseKey"), grab("uebungen.js", "caseFree"),
    grab("uebungen.js", "localCheck"), grab("uebungen.js", "editDist"), grab("uebungen.js", "nearHit"),
    grab("uebungen.js", "slipWords"), grab("uebungen.js", "slipAdd"), grab("uebungen.js", "bigramSim"),
    grab("formate.js", "gapParts"), grab("formate.js", "gapCut")
  ];
  vm.runInContext(parts.join("\n"), ctx);
  return ctx;
}
// Urteil wie textCheck() bis zur KI-Stelle: lokal richtig / Groß-Klein falsch / „nur vertippt?“ / ginge an KI / ohne KI falsch
function verdict(C, ex, user, acc0) {
  let user2 = user, gapFull = null, acc = acc0 || ex.a;
  if (ex.t === "gap") { const cut = C.gapCut(ex, user); gapFull = cut ? user : null; user2 = cut || user; acc = [...ex.a, ...ex.a.map(a => ex.q.replace("___", a))]; }
  const r = C.localCheck(user2, acc, C.exStrict(ex), ex);
  if (r.correct) return r.note ? "richtig (fast: " + r.note.split(" –")[0] + ")" : "richtig";
  if (r.caseOnly) return "FALSCH (Groß/klein, ohne KI)";
  if (ex.t !== "ord" && !C.exStrict(ex) && C.typoOf(user2, acc)) return "„Nur vertippt?“-Frage";
  if (ex.t === "gap" && Math.max(...acc.map(a => C.bigramSim(user2, a))) < 0.25) return "FALSCH (ohne KI)";
  if (ex.t === "gap" && gapFull) return "FALSCH (Endung, ohne KI)";
  if (ex.t === "ord") return "FALSCH (Satz ordnen, keine KI)";
  return "→ KI (offline: falsch/selbst entscheiden)";
}
module.exports = { load, verdict };
