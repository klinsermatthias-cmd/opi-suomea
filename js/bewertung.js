/* Lern-Engine – bewertung.js (aus uebungen.js ausgelagert, D-1025-3): lokale Antwortprüfung ohne KI (localCheck, Tippfehler,
   Groß-/Kleinschreibung, Ähnlichkeit), Ausrutscher, „Noch nicht gelernt?“ und „⚠ Fehler in der Übung?“.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */

/* Ähnlichkeit zweier Texte (Dice-Koeffizient über Buchstabenpaare, 0–1) */
function bigramSim(a, b) {
  const g = x => {
    const t = " " + norm(x) + " ",
      m = new Map();
    for (let i = 0; i < t.length - 1; i++) m.set(t.slice(i, i + 2), (m.get(t.slice(i, i + 2)) || 0) + 1);
    return m;
  };
  const A = g(a),
    B = g(b);
  let both = 0,
    n = 0;
  A.forEach((v, k) => ((both += Math.min(v, B.get(k) || 0)), (n += v)));
  B.forEach(v => (n += v));
  return n ? (2 * both) / n : 0;
}
/* Streng prüfen (keine ä/a-Toleranz, E-1008-3): ausdrücklich markiert (s:1), Lücke mitten im Wort (Endung – dort ist
   der Vokal oft genau das Geprüfte, z. B. Vokalharmonie) oder Hinweis nennt die Vokalharmonie */
/* ---------- Ausrutscher (E-1008-58): Sonderzeichen vergessen (SP.loose, z. B. ä/ö) und „nur vertippt“ ----------
   S.slips = [{d, k: "loose" | "typo" | "self" (E-1009-10), w: richtiges Wort, u: Eingabe}] – max. 200, synchronisiert (per d|k|w vereinigt),
   nur für den Bericht; an der Wertung ändert das nichts. */
const SLIP_MAX = 200;
function slipWords(hit, user) {
  const a = norm(hit).split(" "),
    b = norm(user).split(" ");
  if (a.length !== b.length) return [[norm(hit), norm(user)]];
  return a.map((w, i) => [w, b[i]]).filter(([w, u]) => w !== u);
}
function slipAdd(k, w, u, extra) {
  if (typeof S === "undefined" || !S || !w) return null;
  const now = Date.now(),
    list = Array.isArray(S.slips) ? S.slips : (S.slips = []);
  if (k !== "edit" && list.some(x => x.k === k && x.w === w && now - x.d < 5000)) return null; // dieselbe Antwort nicht doppelt zählen
  const e = { d: now, k, w: cut(w, 40), u: cut(u, 40), ...(extra || {}) };
  list.unshift(e);
  if (list.length > SLIP_MAX) list.length = SLIP_MAX;
  return e;
}
function mergeSlips(L, R) {
  const seen = new Set(),
    key = x => x.d + "|" + x.k + "|" + x.w;
  return [...(Array.isArray(L) ? L : []), ...(Array.isArray(R) ? R : [])]
    .filter(x => x && x.d && !seen.has(key(x)) && seen.add(key(x)))
    .sort((a, b) => b.d - a.d)
    .slice(0, SLIP_MAX);
}
/* Bericht: Ausrutscher der letzten 30 Tage je Wort (Eingabe in Klammern) – für die Analyse, ob z. B. ä/ö sitzt */
function slipReport() {
  const since = Date.now() - 30 * DAY,
    L = (S.slips || []).filter(x => x.d >= since && x.k !== "edit");
  if (!L.length) return "";
  const part = (k, title) => {
    const xs = L.filter(x => x.k === k);
    if (!xs.length) return "";
    const g = new Map();
    xs.forEach(x => {
      const o = g.get(x.w) || { n: 0, u: new Set() };
      o.n++;
      o.u.add(x.u);
      g.set(x.w, o);
    });
    return (
      `\n${title}: ${xs.length}× – ` +
      [...g]
        .sort((a, b) => b[1].n - a[1].n)
        .slice(0, 15)
        .map(([w, o]) => `${w} (${[...o.u].slice(0, 3).join(", ")}) ${o.n}×`)
        .join("; ")
    );
  };
  return (
    "\n\nAUSRUTSCHER (30 Tage, als richtig gewertet)" +
    part("loose", `Sonderzeichen vergessen/vertauscht (${SP.charNote})`) +
    part("typo", "„Nur vertippt“ selbst gewertet") +
    part("self", "Trotz Fehler selbst als richtig gewertet (bitte prüfen: wirklich nur vertippt?)") +
    part("selfok", "Ganze Antwort selbst als richtig gewertet (S-1013-43; Musterlösung (Antwort) – bitte prüfen)")
  );
}
/* ---------- „Noch nicht gelernt?“ (E-1008-64, E-1009-3) ----------
   Link unter jeder Lektions-Übung: Die Aufgabe fragt etwas ab, das noch nicht gelehrt wurde (z. B. „mein“ vor dem Thema).
   S.unlearned = [{d, tid, ei, q, x?: 1 = zurückgenommen, xu: Zeit der letzten Änderung}], max. 100, synchronisiert
   (je tid:ei gewinnt die jüngste Änderung). Solange markiert, fehlen Fehler dazu im Fehler-Training und zählen nicht
   als Schwäche (weakPlan) und nicht im Rundenergebnis (E-1012-1; nur Gemeldetes = 0 %). Bericht: Meldungen der letzten
   30 Tage für den Inhalts-Chat. */
const UNL_MAX = 100;
function unlearnedOn(tid, ei) {
  return ei != null && ei >= 0 && (S.unlearned || []).some(x => !x.x && x.tid === tid && x.ei === ei);
}
function unlearnedToggle(tid, ei, q) {
  const list = Array.isArray(S.unlearned) ? S.unlearned : (S.unlearned = []),
    o = list.find(x => x.tid === tid && x.ei === ei),
    now = Date.now();
  if (!o) list.unshift({ d: now, tid, ei, q: cut(q, 120), xu: now });
  else if (o.x) Object.assign(o, { x: 0, d: now, xu: now });
  else Object.assign(o, { x: 1, xu: now });
  S.unlearned = list.sort((a, b) => b.d - a.d).slice(0, UNL_MAX);
  return unlearnedOn(tid, ei);
}
function mergeUnlearned(L, R) {
  return mergeTidEi(L, R, UNL_MAX, 0);
}
/* Listen mit einem Eintrag je Übung (tid:ei): je Schlüssel gewinnt die jüngste Änderung (xu) */
function mergeTidEi(L, R, max, minEi) {
  const m = new Map();
  [...(Array.isArray(R) ? R : []), ...(Array.isArray(L) ? L : [])].forEach(x => {
    if (!x || !x.tid || !(x.ei >= minEi)) return;
    const k = x.tid + ":" + x.ei,
      o = m.get(k);
    if (!o || (x.xu || 0) > (o.xu || 0)) m.set(k, x);
  });
  return [...m.values()].sort((a, b) => b.d - a.d).slice(0, max);
}
const unlearnedLabel = on =>
  on
    ? "✓ gemeldet – zählt nicht im Ergebnis und im Fehler-Training (nochmal tippen = zurücknehmen)"
    : "📘 Noch nicht gelernt?";
function unlearnedLink(se) {
  const a = S.active && S.active.id === se.id ? S.active : null,
    src = a && srcOf(a, se.idx);
  if (!src || !(src.ei >= 0) || !T(src.tid)) return "";
  return `<p class="aiflagp"><a href="#" class="aiflag" data-act="unlearned" data-id="${esc(src.tid + "|" + src.ei)}">${unlearnedLabel(unlearnedOn(src.tid, src.ei))}</a></p>`;
}
function unlearnedReport() {
  const since = Date.now() - 30 * DAY,
    L = (S.unlearned || []).filter(x => !x.x && x.d >= since);
  if (!L.length) return "";
  return (
    `\n\nNOCH NICHT GELERNT? (${L.length}, von ${APP.learner} gemeldet: Übung fragt etwas ab, das noch nicht gelehrt wurde – Theorie/Vokabel ergänzen oder Übung anpassen; Fehler dazu zählen nicht im Fehler-Training):\n` +
    L.map(x => `- ${fmtDate(x.d)} ${x.tid} ex[${x.ei}] (${(T(x.tid) || {}).title || "?"}): ${x.q}`).join("\n")
  );
}
/* ---------- „⚠ Fehler in der Übung?“ (E-1009-20) ----------
   Link unter jeder Lektions-Übung und am Ende der Theorie (ei = -1): kurzer Text, was falsch ist (Lösung, Erklärung,
   Tippfehler …). S.exFlags = [{d, tid, ei, q, t, x?: 1 = zurückgenommen, xu}], max. 100, synchronisiert wie
   S.unlearned. Ändert nichts an Wertung oder Fehler-Training. Bericht: FEHLERMELDUNGEN (30 Tage) für den Inhalts-Chat. */
const FLAG_MAX = 100;
const exFlagOn = (tid, ei) => (S.exFlags || []).some(x => !x.x && x.tid === tid && x.ei === ei);
const exFlagLabel = (on, ei) =>
  on
    ? "✓ Fehler gemeldet – Claude prüft es (nochmal tippen = zurücknehmen)"
    : ei < 0
      ? "⚠ Fehler in der Theorie?"
      : "⚠ Fehler in der Übung?";
function exFlagSet(tid, ei, q, t) {
  const list = Array.isArray(S.exFlags) ? S.exFlags : (S.exFlags = []),
    o = list.find(x => x.tid === tid && x.ei === ei),
    now = Date.now();
  if (t == null) {
    if (o) Object.assign(o, { x: 1, xu: now });
  } else if (!o) list.unshift({ d: now, tid, ei, q: cut(q, 120), t: cut(t, 300), xu: now });
  else Object.assign(o, { x: 0, d: now, q: cut(q, 120), t: cut(t, 300), xu: now });
  S.exFlags = list.sort((a, b) => b.d - a.d).slice(0, FLAG_MAX);
  return exFlagOn(tid, ei);
}
function mergeExFlags(L, R) {
  return mergeTidEi(L, R, FLAG_MAX, -1);
}
function exFlagLink(tid, ei) {
  if (!T(tid)) return "";
  return `<p class="aiflagp"><a href="#" class="aiflag" data-act="exflag" data-id="${esc(tid + "|" + ei)}">${exFlagLabel(exFlagOn(tid, ei), ei)}</a></p><div class="exflagbox"></div>`;
}
function exFlagLinkFor(se) {
  const a = S.active && S.active.id === se.id ? S.active : null,
    src = a && srcOf(a, se.idx);
  return src && src.ei >= 0 ? exFlagLink(src.tid, src.ei) : "";
}
function exFlagReport() {
  const since = Date.now() - 30 * DAY,
    L = (S.exFlags || []).filter(x => !x.x && x.d >= since);
  if (!L.length) return "";
  return (
    `\n\nFEHLERMELDUNGEN (${L.length}, von ${APP.learner} gemeldet: Fehler in Übung oder Theorie – mit Quelle prüfen, korrigieren oder begründet verwerfen):\n` +
    L.map(
      x =>
        `- ${fmtDate(x.d)} ${x.tid} ${x.ei < 0 ? "Theorie" : "ex[" + x.ei + "]"} (${(T(x.tid) || {}).title || "?"})${x.q ? ": " + x.q : ""} → „${x.t || "ohne Text"}“`
    ).join("\n")
  );
}
/* „Nur vertippt?“: Die Antwort weicht von einer Musterlösung nur um eine Nachbartaste ab oder zwei benachbarte
   Buchstaben sind vertauscht – aber nicht in den letzten zwei Buchstaben eines Wortes (dort sitzen die Endungen, also
   echte Grammatikfehler wie olen/olet) und nur in Wörtern ab 4 Buchstaben. Tastaturen: QWERTY (fi/en) und QWERTZ (de). */
const KEY_ROWS = [
  ["qwertyuiopå", "asdfghjklöä", "zxcvbnm"],
  ["qwertzuiopü", "asdfghjklöä", "yxcvbnm"]
];
function keyNeighbors(a, b) {
  return KEY_ROWS.some(rows => {
    const pos = c => {
      for (let r = 0; r < rows.length; r++) if (rows[r].includes(c)) return [r, rows[r].indexOf(c)];
      return null;
    };
    const p = pos(a),
      q = pos(b);
    if (!p || !q) return false;
    const [r, i] = p,
      [t, j] = q;
    if (r === t) return Math.abs(i - j) === 1;
    if (t === r + 1) return j === i - 1 || j === i;
    if (t === r - 1) return j === i || j === i + 1;
    return false;
  });
}
function typoOf(user, acc) {
  const U = norm(user);
  for (const a of acc) {
    const A = norm(a);
    if (A.length !== U.length || A === U) continue;
    const diff = [];
    for (let i = 0; i < A.length && diff.length < 3; i++) if (A[i] !== U[i]) diff.push(i);
    const one = diff.length === 1 && keyNeighbors(A[diff[0]], U[diff[0]]),
      swap = diff.length === 2 && diff[1] === diff[0] + 1 && A[diff[0]] === U[diff[1]] && A[diff[1]] === U[diff[0]];
    if (!one && !swap) continue;
    const last = diff[diff.length - 1],
      start = A.lastIndexOf(" ", last) + 1,
      end = A.indexOf(" ", last) < 0 ? A.length : A.indexOf(" ", last);
    if (end - start < 4 || last >= end - 2 || /\s/.test(A.slice(diff[0], last + 1))) continue;
    return { hit: a, w: A.slice(start, end), u: U.slice(start, end) };
  }
  return null;
}
function exStrict(ex) {
  return !!(
    ex &&
    (ex.s || (ex.t === "gap" && /\p{L}___|___\p{L}/u.test(ex.q || "")) || /vokalharmonie/i.test(ex.h || ""))
  );
}
/* Groß-/Kleinschreibung (nur Sprachen mit SP.caseMatters, E-1008-9): wie norm(), aber ohne Kleinschreiben; der erste
   Buchstabe ist frei, wenn die Antwort einen Satz beginnt (Übersetzung, Satz ordnen, Schreibaufgabe, Dialogzeile,
   Lücke am Satzanfang) */
function caseKey(s, firstFree) {
  const k = (SP.loose || []).reduce(
    (t, [a, b]) => t.split(a).join(b),
    String(s || "")
      .normalize("NFC")
      .replace(/(^|\s)[–—-]+(?=\s|$)/g, " ")
      .replace(/[.,!?;:"“”„«»()]/g, "")
      .replace(/[’']/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
  return firstFree ? k.charAt(0).toLowerCase() + k.slice(1) : k;
}
/* Tabellenzellen und Lücken (D-1025-12: „→ ___“ verlangt den ganzen Satz): frei, wenn die Musterlösung ein ganzer Satz ist (endet auf . ! ?) oder ein Fragewort, das nur am
   Satzanfang großgeschrieben wird (S-1013-7) */
function caseFree(ex, ans) {
  if (!ex || ["tr", "ord", "sch", "dlg", "les"].includes(ex.t) || (ex.t === "gap" && /^\s*___/.test(ex.q || "")))
    return true;
  if (!["tab", "gap"].includes(ex.t) || ans == null) return false;
  return /[.!?]["“”»]?\s*$/.test(ans) || !!(SP.caseFreeWords && SP.caseFreeWords.test(norm(ans).split(" ")[0]));
}
/* Antwort in der Ausgangssprache (z. B. Englisch im Deutsch-Trainer): dort gilt die Großschreibregel der Lernsprache nicht (S-1012-122) */
function baseAnswer(ex) {
  const f = ex && FMT[ex.t];
  return !!(f && f.target && !f.target(ex));
}
function localCheck(user, acc, strict, ex, base) {
  /* gleichwertige Schreibungen angleichen (S-1013-9): Lernsprache SP.same, Ausgangssprache BASE_SAME */
  const inBase = base || baseAnswer(ex),
    f = inBase ? BASE_SAME[BASE_CODE] : SP.same,
    eq = s => (f ? f(String(s == null ? "" : s)) : s),
    U = eq(user),
    A = acc.map(eq),
    u = norm(U);
  let i = A.findIndex(a => norm(a) === u),
    near = false;
  if (i < 0 && !strict) {
    i = A.findIndex(a => loose(a) === loose(U));
    near = i >= 0;
  }
  if (i < 0) return { correct: false };
  /* Alternativen, die sich nur in Groß/klein unterscheiden („welcher|Welcher“): die mit passender Schreibung zählt */
  const same = a => caseKey(a, caseFree(ex, a)) === caseKey(U, caseFree(ex, a));
  if (SP.caseMatters && !same(A[i])) {
    const j = A.findIndex(a => (near ? loose(a) === loose(U) : norm(a) === u) && same(a));
    if (j >= 0) i = j;
  }
  const hit = acc[i];
  if (SP.caseMatters && !inBase && !same(A[i]))
    return { correct: false, caseOnly: true, note: "Achte auf die Groß-/Kleinschreibung. Richtig: " + hit };
  if (near) slipWords(hit, user).forEach(([w, u]) => slipAdd("loose", w, u));
  return near ? { correct: true, note: "Fast perfekt – " + SP.charNote + ". Richtig: " + acc[0] } : { correct: true };
}
