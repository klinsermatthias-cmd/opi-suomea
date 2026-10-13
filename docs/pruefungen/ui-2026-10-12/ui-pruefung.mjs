// UI-Prüfung am Handy (S-1012-117): node ui.mjs <App-Ordner> <Name> <Bildordner>
// Lädt die App in 390×844, hell und dunkel, öffnet alle Hauptansichten und je eine Übung jeder Art, macht Screenshots
// und misst: horizontaler Überlauf, zu kleine Tippflächen (< 32 px), zu kleine Schrift (< 12 px), Kontrast < 4,5:1.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const [ROOT, NAME, OUTDIR] = process.argv.slice(2).map((a, i) => (i === 0 || i === 2 ? path.resolve(a) : a));
fs.mkdirSync(OUTDIR, { recursive: true });
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname.startsWith("/sb/")) { res.writeHead(404); return res.end("{}"); }
  const f = path.join(ROOT, decodeURIComponent(u.pathname === "/" ? "/index.html" : u.pathname));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  const type = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".webmanifest": "application/manifest+json" }[path.extname(f)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type + "; charset=utf-8" });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, r));
const URL0 = `http://localhost:${server.address().port}/`;
const pw = createRequire(path.join(execSync("npm root -g").toString().trim(), "x.js"))("playwright");
const browser = await pw.chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

/* Messung in der Seite */
const MEASURE = () => {
  const W = document.documentElement.clientWidth;
  const out = { overflow: document.documentElement.scrollWidth - W, wide: [], small: [], tiny: [], contrast: [] };
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05; };
  const label = el => (el.getAttribute("data-act") ? `[${el.getAttribute("data-act")}${el.dataset.id ? "=" + el.dataset.id : ""}] ` : "") + (el.innerText || el.value || el.placeholder || el.tagName).replace(/\s+/g, " ").trim().slice(0, 40);
  for (const el of document.querySelectorAll("#app *")) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.right > W + 1 && getComputedStyle(el).position !== "fixed") out.wide.push(`${el.tagName.toLowerCase()} ${label(el)} (bis ${Math.round(r.right)} px)`);
  }
  for (const el of document.querySelectorAll("button, a, input, select, textarea, [data-act]")) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    if (el.type === "hidden") continue;
    if (r.height < 32 || r.width < 32) out.small.push(`${label(el)} ${Math.round(r.width)}×${Math.round(r.height)}`);
  }
  const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
  const lum = ([r, g, b]) => { const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.length >= 3 && (c.length < 4 || c[3] > 0.5)) return c; } return rgb(getComputedStyle(document.body).backgroundColor); };
  for (const el of document.querySelectorAll("#app *")) {
    if (!vis(el)) continue;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    const cs = getComputedStyle(el), fs_ = parseFloat(cs.fontSize);
    if (fs_ < 12) out.tiny.push(`${label(el)} (${fs_} px)`);
    const fg = rgb(cs.color), bg = bgOf(el);
    if (fg.length >= 3 && bg.length >= 3) {
      const a = lum(fg), b = lum(bg), cr = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const big = fs_ >= 24 || (fs_ >= 18.66 && +cs.fontWeight >= 700);
      if (cr < (big ? 3 : 4.5)) out.contrast.push(`${label(el)} ${cr.toFixed(2)}:1`);
    }
  }
  for (const k of ["wide", "small", "tiny", "contrast"]) out[k] = [...new Set(out[k])];
  return out;
};

const results = [];
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, colorScheme: theme });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push(e.message));
  page.on("dialog", d => d.dismiss());
  await page.goto(URL0);
  await page.waitForFunction(() => typeof S !== "undefined" && S && document.querySelector("#app").innerHTML.length > 0);
  await page.waitForTimeout(400);
  const shot = async view => {
    await page.waitForTimeout(250);
    const m = await page.evaluate(MEASURE);
    const file = `${NAME}-${theme}-${view}.png`;
    await page.screenshot({ path: path.join(OUTDIR, file) });
    results.push({ app: NAME, theme, view, file, ...m });
  };
  await shot("start");
  // Einrichtung/Einstufung überspringen, damit die Hauptansichten erreichbar sind
  await page.evaluate(() => { const b = document.querySelector('[data-act="setupdone"]'); if (b) b.click(); });
  await page.waitForTimeout(400);
  await shot("nach-einrichtung");
  await page.evaluate(() => {
    if (S.placement && !S.placement.done) S.placement.done = true;
    if (S.settings) S.settings.theme = "auto";
    if (typeof save === "function") save();
    if (typeof render === "function") render();
  });
  for (const tab of ["today", "topics", "vocab", "progress", "settings"]) {
    const ok = await page.evaluate(t => { try { A.tab(t); return true; } catch (e) { return String(e); } }, tab);
    if (ok === true) await shot(tab);
    else results.push({ app: NAME, theme, view: tab, error: ok });
  }
  // erstes freies Thema: Themenseite, Theorie, eine Übung je Art
  const tid = await page.evaluate(() => { const t = TOPICS.find(t => S.topics[t.id] && S.topics[t.id].status !== "locked") || TOPICS[0]; return t.id; });
  await page.evaluate(id => A.topic(id), tid);
  await shot("thema");
  const types = await page.evaluate(id => {
    try { A.learn(id); } catch (e) { return "Fehler: " + e.message; }
    if (!SESSION) { const b = document.querySelector('[data-act="learn"],[data-act="tvskip"]'); if (b) b.click(); }
    return SESSION && SESSION.items ? [...new Set(SESSION.items.map(e => e.t))] : "keine Runde";
  }, tid);
  await page.evaluate(() => { const b = document.querySelector('[data-act="resume"]'); if (b) b.click(); });
  await page.waitForTimeout(300);
  await shot("runde-start");
  if (Array.isArray(types)) {
    const seen = new Set();
    for (let step = 0; step < 90 && seen.size < types.length; step++) {
      const t = await page.evaluate(() => (SESSION && SESSION.kind === "topic" && SESSION.items[SESSION.idx] ? SESSION.items[SESSION.idx].t : null));
      if (!t) break;
      if (!seen.has(t)) { seen.add(t); await shot("uebung-" + t); }
      await page.evaluate(() => { const d = document.querySelector('[data-act="dunno"]'); if (d) d.click(); });
      await page.waitForTimeout(150);
      if (step === 0) await shot("rueckmeldung");
      await page.evaluate(() => { const n = document.querySelector('#nextbtn, [data-act="next"]'); if (n) n.click(); });
      await page.waitForTimeout(150);
    }
  } else results.push({ app: NAME, theme, view: "runde", error: types });
  results.push({ app: NAME, theme, view: "_fehler", pageErrors: errs.slice(0, 5) });
  await ctx.close();
}
await browser.close();
server.close();
fs.writeFileSync(path.join(OUTDIR, `${NAME}-ergebnis.json`), JSON.stringify(results, null, 1));
for (const r of results) {
  if (r.view === "_fehler") { if (r.pageErrors.length) console.log(`${r.app} ${r.theme}: Seitenfehler: ${r.pageErrors.join(" | ")}`); continue; }
  if (r.error) { console.log(`${r.app} ${r.theme} ${r.view}: ${r.error}`); continue; }
  console.log(`${r.app} ${r.theme} ${r.view}: Überlauf ${r.overflow}px, breit ${r.wide.length}, klein ${r.small.length}, Schrift<12 ${r.tiny.length}, Kontrast ${r.contrast.length}`);
}
