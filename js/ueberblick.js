/* Opi suomea – ueberblick.js: Grammatik-Übersicht (Tab Themen) und Lernstatistik (Tab Einstellungen).
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */

/* ---------- Lerntage ----------
   S.days["JJJJ-MM-TT"] = Anzahl abgeschlossener Runden an diesem Tag (Themen, Vokabeln, Hören, Spiele).
   Beim ersten Start mit dieser Funktion aus den vorhandenen Daten (Themen-Ergebnisse, letzte Karten-Wiederholung)
   ergänzt, soweit bekannt. Beim Abgleich gewinnt je Tag der höhere Wert. Höchstens 400 Tage. */
function logDay() {
  const k = todayKey();
  S.days = S.days || {};
  S.days[k] = (S.days[k] || 0) + 1;
  capDays(S);
}
function capDays(x) {
  const ks = Object.keys(x.days || {}).sort();
  ks.slice(0, Math.max(0, ks.length - 400)).forEach(k => delete x.days[k]);
}
function seedDays() {
  if (S.days && Object.keys(S.days).length) return;
  S.days = {};
  const add = t => {
    if (!t) return;
    const k = todayKey(new Date(t));
    S.days[k] = Math.max(S.days[k] || 0, 1);
  };
  Object.values(S.topics || {}).forEach(s => (s.hist || []).forEach(h => add(h.d)));
  Object.values(S.cards || {}).forEach(c => add(c.last));
  capDays(S);
}
function mergeDays(L, R) {
  const M = { ...(R || {}) };
  for (const k in L || {}) M[k] = Math.max(M[k] || 0, L[k]);
  const x = { days: M };
  capDays(x);
  return x.days;
}

/* ---------- Statistik-Karte ---------- */
const WEEKS = 12;
function dayLevel(n) {
  return !n ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4;
}
function forecast() {
  const out = [];
  for (let i = 0; i < 7; i++) {
    const end = endOfDay(addDays(i)),
      start = i ? addDays(i) : 0;
    const cards = Object.keys(S.cards).filter(id => {
        const c = S.cards[id];
        return !c.isNew && c.due && c.due <= end && c.due >= start && cardWord(id);
      }).length,
      topics = TOPICS.filter(t => {
        const s = S.topics[t.id];
        return s.status === "learning" && s.due && s.due <= end && s.due >= start;
      }).length;
    out.push({ i, cards, topics, d: addDays(i) });
  }
  return out;
}
function statsCardHTML() {
  const days = S.days || {},
    today = new Date();
  today.setHours(12, 0, 0, 0);
  /* Spalten = Wochen (Montag oben), letzte Spalte = aktuelle Woche */
  const dow = (today.getDay() + 6) % 7,
    first = new Date(today.getTime() - (dow + (WEEKS - 1) * 7) * DAY);
  let cells = "";
  for (let w = 0; w < WEEKS; w++)
    for (let d = 0; d < 7; d++) {
      const dt = new Date(first.getTime() + (w * 7 + d) * DAY);
      if (dt > today) {
        cells += `<i class="cal0 calf" style="grid-column:${w + 1};grid-row:${d + 1}"></i>`;
        continue;
      }
      const k = todayKey(dt),
        n = days[k] || 0;
      cells += `<i class="cal${dayLevel(n)}" style="grid-column:${w + 1};grid-row:${d + 1}" title="${dt.toLocaleDateString(APP.locale, { weekday: "short", day: "numeric", month: "numeric" })}: ${n ? n + (n === 1 ? " Runde" : " Runden") : "nicht gelernt"}"></i>`;
    }
  let last30 = 0;
  for (let i = 0; i < 30; i++) if (days[todayKey(new Date(Date.now() - i * DAY))]) last30++;
  const fc = forecast(),
    max = Math.max(1, ...fc.map(x => x.cards));
  const bars = fc
    .map(
      x =>
        `<div class="fcol" title="${x.i === 0 ? "Heute (inkl. überfällig)" : fmtDate(x.d)}: ${x.cards} ${x.cards === 1 ? "Karte" : "Karten"}${x.topics ? `, ${x.topics} ${x.topics === 1 ? "Thema" : "Themen"}` : ""}"><b>${x.cards}</b><span class="fbar"><i style="height:${Math.round((x.cards / max) * 100)}%"></i></span><small>${x.i === 0 ? "heute" : new Date(x.d).toLocaleDateString(APP.locale, { weekday: "short" })}</small>${x.topics ? `<small class="ftop">+${x.topics} Th.</small>` : ""}</div>`
    )
    .join("");
  return `<div class="card"><div class="label">Lernkalender</div><p class="muted" style="margin:0 0 10px">${last30} von 30 Tagen gelernt · ${streakNow()} ${streakNow() === 1 ? "Tag" : "Tage"} in Folge. Je kräftiger die Farbe, desto mehr Runden.</p><div class="cal">${cells}</div><div class="calleg"><span>weniger</span><i class="cal0"></i><i class="cal1"></i><i class="cal2"></i><i class="cal3"></i><i class="cal4"></i><span>mehr</span></div>
  <div class="label" style="margin-top:16px">Fällige Karten in den nächsten 7 Tagen</div><div class="fc">${bars}</div><p class="muted" style="margin:6px 0 0;font-size:13px">„Th.“ = Themen-Wiederholungen am selben Tag.</p></div>`;
}

/* ---------- Grammatik-Übersicht: Theorie aller freigeschalteten Themen zum Nachschlagen ---------- */
function renderGrammar() {
  const open = TOPICS.filter(t => S.topics[t.id].status !== "locked" && t.th);
  let h = `<button class="back" data-act="back">‹ Alle Themen</button><h2>Grammatik-Übersicht</h2><p class="muted">Die Erklärungen und Tabellen aller freigeschalteten Themen zum Nachschlagen. Tippe ein Thema an, um es aufzuklappen.</p>`;
  if (!open.length) h += `<p class="muted">Noch kein Thema freigeschaltet.</p>`;
  h += open
    .map(
      t =>
        `<details class="card gram"><summary><b>${esc(t.title)}</b><small>${esc(t.fi)} · ${esc(t.lvl || "")}</small></summary><div class="theory">${t.th}</div><p class="aiflagp"><a href="#" class="aiflag" data-act="topic" data-id="${t.id}">Zum Thema</a></p></details>`
    )
    .join("");
  app().innerHTML = h;
  app().querySelectorAll(".theory").forEach(decorateTheory);
}
