/* Lern-Engine – verlauf.js: Verlaufsprotokoll des Lernstands (S-1013-39).
   S.history = [{d, k, lvl?, t:{Thema: %}, w, ok, weak:{Thema: n}, sl}] – ein kurzer Eintrag nach jeder Analyse der
   KI-Lehrkraft (k "analyse"), nach jedem Langzeit-Check (k "check") und sonst höchstens einmal pro Woche nach einer
   Themenrunde (k "woche"). t = letztes Ergebnis je gelerntem Thema, w = gelernte Karten, ok = sichere Themen,
   weak = Schwächen nach Thema der letzten 30 Tage, sl = Ausrutscher der letzten 30 Tage. Bis HIST_MAX Einträge (mehrere
   Jahre), synchronisiert; sichtbar unter Fortschritt („Verlauf“) und im Bericht (VERLAUF), damit Fortschritt und neu
   auftauchende Problemfelder über Wochen erkennbar sind. Alle Dateien teilen sich den globalen Bereich. */
const HIST_MAX = 400,
  HIST_KIND = { analyse: "Analyse", check: "Langzeit-Check", woche: "Wochenstand" };
function histWeak() {
  const since = Date.now() - 30 * DAY,
    by = {};
  (S.weak || [])
    .filter(x => x.d >= since && weakCounts(x))
    .forEach(x => (x.g || []).forEach(id => (by[id] = (by[id] || 0) + 1)));
  return by;
}
function histAdd(k, lvl) {
  const t = {},
    since = Date.now() - 30 * DAY;
  TOPICS.forEach(x => {
    const s = S.topics[x.id];
    if (s && s.status === "learning" && s.last != null) t[x.id] = Math.round(s.last * 100);
  });
  const e = {
    d: Date.now(),
    k,
    t,
    w: learnedCardIds().length,
    ok: masteredTopics(),
    weak: histWeak(),
    sl: (S.slips || []).filter(x => x.d >= since && x.k !== "edit").length
  };
  if (lvl) e.lvl = String(lvl).slice(0, 40);
  S.history = [e, ...(Array.isArray(S.history) ? S.history : [])].slice(0, HIST_MAX);
}
/* nach einer Themenrunde: Wochenstand, wenn der letzte Eintrag mindestens 7 Tage alt ist */
function histTick() {
  const h = (S.history || [])[0];
  if (!h || Date.now() - h.d >= 7 * DAY) histAdd("woche");
}
function mergeHistory(L, R) {
  const m = new Map();
  [...(Array.isArray(R) ? R : []), ...(Array.isArray(L) ? L : [])].forEach(x => x && x.d && m.set(x.d + "|" + x.k, x));
  return [...m.values()].sort((a, b) => b.d - a.d).slice(0, HIST_MAX);
}
/* Vergleich: neuester Eintrag gegen den jüngsten, der mindestens 14 Tage älter ist (sonst den ältesten) */
function histTrend() {
  const H = S.history || [];
  if (H.length < 2) return null;
  const a = H[0],
    b = H.find(x => a.d - x.d >= 14 * DAY) || H[H.length - 1],
    up = [],
    down = [];
  for (const id in a.t) {
    if (b.t[id] == null) continue;
    const diff = a.t[id] - b.t[id];
    if (diff >= 5) up.push([id, diff]);
    else if (diff <= -5) down.push([id, diff]);
  }
  const newWeak = Object.keys(a.weak || {}).filter(id => a.weak[id] >= 2 && !((b.weak || {})[id] >= 2));
  return { a, b, up, down, newWeak };
}
const histTitle = id => (T(id) || {}).title || id;
function histCardHTML() {
  const H = S.history || [];
  if (!H.length) return "";
  const tr = histTrend();
  let h = `<div class="card"><div class="label">Verlauf</div><p class="muted">${H.length} Einträge seit ${fmtDate(H[H.length - 1].d)} – nach jeder Analyse, jedem Langzeit-Check und sonst einmal pro Woche.</p>`;
  if (tr) {
    const li = (L, s) => L.map(([id, d]) => `<li>${s} ${esc(histTitle(id))}: ${d > 0 ? "+" : ""}${d} %</li>`).join("");
    h += `<p><b>Seit ${fmtDate(tr.b.d)}:</b></p><ul>${li(tr.up, "↑")}${li(tr.down, "↓")}${tr.newWeak.map(id => `<li>⚠ neu als Schwäche: ${esc(histTitle(id))}</li>`).join("")}${!tr.up.length && !tr.down.length && !tr.newWeak.length ? "<li>keine großen Änderungen</li>" : ""}</ul>`;
  }
  h += `<table class="hist"><tr><th>Datum</th><th>Art</th><th>Themen sicher</th><th>Wörter</th></tr>${H.slice(0, 8)
    .map(
      x =>
        `<tr><td>${fmtDate(x.d)}</td><td>${esc(HIST_KIND[x.k] || x.k)}${x.lvl ? " · " + esc(x.lvl) : ""}</td><td>${x.ok}</td><td>${x.w}</td></tr>`
    )
    .join("")}</table></div>`;
  return h;
}
function histReport() {
  const H = S.history || [];
  if (!H.length) return "";
  const line = x =>
    `- ${fmtDate(x.d)} ${HIST_KIND[x.k] || x.k}${x.lvl ? " | Niveau " + x.lvl : ""} | sicher ${x.ok} | Karten ${x.w} | Ausrutscher ${x.sl} | Themen: ${
      Object.entries(x.t)
        .map(([id, p]) => id + " " + p)
        .join(", ") || "–"
    }${
      Object.keys(x.weak || {}).length
        ? " | Schwächen: " +
          Object.entries(x.weak)
            .sort((p, q) => q[1] - p[1])
            .map(([id, n]) => id + " " + n)
            .join(", ")
        : ""
    }`;
  const tr = histTrend();
  return (
    `\n\nVERLAUF (${H.length} Einträge seit ${fmtDate(H[H.length - 1].d)}, neueste zuerst – Ergebnis in % je Thema, Schwächen der letzten 30 Tage):\n` +
    H.slice(0, 15).map(line).join("\n") +
    (tr
      ? `\nTrend seit ${fmtDate(tr.b.d)}: ${[...tr.up.map(([id, d]) => `↑ ${id} +${d}`), ...tr.down.map(([id, d]) => `↓ ${id} ${d}`)].join(", ") || "keine großen Änderungen"}${tr.newWeak.length ? " | neu als Schwäche: " + tr.newWeak.join(", ") : ""}`
      : "")
  );
}
