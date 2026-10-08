// Entwurf A2 (S-1008-124): lädt Grundthemen (js/inhalte.js), lektionen.json und die Entwurfsthemen (themen/*.js,
// je Datei module.exports = { id, title, … } – als JS, damit HTML in der Theorie ohne Escapes geschrieben werden kann).
// Nur lesend. Aufruf aus anderen Werkzeugen: const L = require("./laden.cjs");
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "../../../..");
const DIR = path.resolve(__dirname, "../themen");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(ROOT + "/js/app.js", "utf8") + "\n" + fs.readFileSync(ROOT + "/js/inhalte.js", "utf8") +
  "\n;this.BT = BASE_TOPICS; this.GX = typeof GLOSS_EXTRA === 'undefined' ? {} : GLOSS_EXTRA;", ctx);
const json = JSON.parse(fs.readFileSync(ROOT + "/lektionen/lektionen.json", "utf8"));
// Reihenfolge der Entwurfsthemen: t20, t20b, t20c, t20d, t21 … (wie später in lektionen.json)
const ORDER = id => { const m = /^t(\d+)([a-z]?)$/.exec(id); return +m[1] * 10 + (m[2] ? m[2].charCodeAt(0) - 96 : 0); };
const neu = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter(f => f.endsWith(".js")).map(f => {
  try { return JSON.parse(JSON.stringify(require(path.join(DIR, f)))); }
  catch (e) { console.error("JSON-Fehler in " + f + ": " + e.message); process.exitCode = 1; return null; }
}).filter(Boolean).sort((a, b) => ORDER(a.id) - ORDER(b.id)) : [];
const alt = [...ctx.BT, ...json];
module.exports = { ROOT, DIR, alt, neu, all: [...alt, ...neu], GX: ctx.GX, ORDER };
