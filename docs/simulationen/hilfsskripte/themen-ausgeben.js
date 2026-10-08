// Gibt Themen lesbar aus (Theorie, Wörter, Übungen; mc: * = richtig). Aufruf: node themen-ausgeben.js <repo> <themenId...>
const vm = require("vm"), fs = require("fs"), path = require("path");
const R = process.argv[2];
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(R, "js/app.js"), "utf8") + "\n" + fs.readFileSync(path.join(R, "js/inhalte.js"), "utf8") + "\n;this.BT=BASE_TOPICS;", ctx);
const L = JSON.parse(fs.readFileSync(path.join(R, "lektionen/lektionen.json"), "utf8"));
const all = [...ctx.BT, ...L];
const txt = h => String(h || "").replace(/<tr>/g, "\n").replace(/<\/t[dh]>\s*<t[dh][^>]*>/g, " | ").replace(/<(p|li|h3|h4|div|br)[^>]*>/g, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\n\s*\n+/g, "\n").trim();
for (const id of process.argv.slice(3)) {
  const t = all.find(x => x.id === id);
  if (!t) { console.log("FEHLT " + id); continue; }
  console.log(`\n######## ${t.id} | ${t.title} | ${t.fi || ""} | lvl ${t.lvl || ""} | req ${(t.req || []).join(",")}`);
  console.log("--- THEORIE\n" + txt(t.th));
  console.log("--- WÖRTER (" + t.v.length + ")\n" + t.v.map((w, i) => i + ": " + w.join(" = ")).join("\n"));
  console.log("--- ÜBUNGEN (" + t.ex.length + ")");
  t.ex.forEach((e, i) => {
    const o = { ...e }; delete o.t;
    let s = `[${i}] ${e.t}`;
    if (e.dir) s += ` dir=${e.dir}`;
    if (e.q) s += ` Q: ${e.q}`;
    if (e.h) s += `\n     H: ${e.h}`;
    if (e.t === "mc") s += `\n     O: ${e.o.map((x, k) => (k === e.a ? "*" : "") + x).join("  ‖  ")}`;
    else if (e.t === "tab") s += `\n     R: ${(e.r || []).map(r => r.join(" ; ")).join(" || ")}${e.c ? "\n     C: " + JSON.stringify(e.c) : ""}`;
    else if (e.t === "dlg") s += `\n     R: ${(e.r || []).map(r => r.join(" ; ")).join(" || ")}`;
    else if (e.t === "les") s += `\n     TXT: ${(e.txt || []).join(" / ")}\n     QS: ${(e.qs || []).map(q => q.q + " → " + q.o.map((x, k) => (k === q.a ? "*" : "") + x).join(" ‖ ") + (q.x ? " (X: " + q.x + ")" : "")).join("  ##  ")}`;
    else if (e.a !== undefined) s += `\n     A: ${JSON.stringify(e.a)}`;
    const rest = Object.keys(o).filter(k => !["q", "h", "o", "a", "r", "dir", "text", "p", "qs", "x", "c", "txt"].includes(k));
    if (rest.length) s += `\n     +: ${JSON.stringify(Object.fromEntries(rest.map(k => [k, o[k]])))}`;
    if (e.x) s += `\n     X: ${e.x}`;
    console.log(s);
  });
}
