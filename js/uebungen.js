/* Lern-Engine – uebungen.js: Übungs-Sitzung (Themenrunden, Fehler-Training), Prüfung, Auswertung, Abschlussbildschirme.
   Lokale Antwortprüfung und Meldungen: bewertung.js · Wörter antippen: woerterbuch.js · Vokabeln und Hören: vokabeln.js ·
   weitere Übungsformate: formate.js.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
/* ---------- Übungs-Sitzung ---------- */

function promptText(ex) {
  return FMT[ex.t] ? FMT[ex.t].prompt(ex) : String(ex.q || "");
}
function expectedText(ex) {
  return FMT[ex.t] ? FMT[ex.t].expected(ex) : "";
}
/* Alle gültigen Lösungen (für KI-Prüfung und „Frag …“) – ohne eigene Angabe des Formats die Musterlösung */
function solutionText(ex) {
  const F = FMT[ex.t];
  return F && F.solution ? F.solution(ex) : expectedText(ex);
}
/* Fehler-Training: offene Fehler, die sich einer Übung zuordnen lassen */
function errKey(e) {
  return e.ei != null && e.ei >= 0 ? e.topic + ":" + e.ei : "q:" + e.topic + ":" + e.q;
}
function errEx(e) {
  if (e.gx && validEx(e.gx)) return e.gx;
  const t = T(e.topic);
  if (!t) return null;
  if (e.ei != null && e.ei >= 0) return t.ex[e.ei] || null;
  const i = t.ex.findIndex(x => promptText(x) === e.q);
  if (i >= 0) {
    e.ei = i;
    return t.ex[i];
  }
  return null;
}
/* Offen ist eine Übung, deren jüngster Fehler-Eintrag noch nicht gelöst ist. Wird sie nach dem Lösen wieder
   falsch beantwortet, ist sie wieder offen (früher blieb sie dann für immer als „gelöst“ ausgeblendet). */
/* Fehlerliste begrenzen, ohne offene Fehler zu verlieren (E-1007-63): offene bis 200, gelöste füllen bis 80 auf */
function capErrors(list) {
  const L = list.slice().sort((a, b) => (b.d || 0) - (a.d || 0)),
    open = L.filter(e => !e.ok).slice(0, 200),
    done = L.filter(e => e.ok).slice(0, Math.max(0, 80 - open.length));
  return [...open, ...done].sort((a, b) => (b.d || 0) - (a.d || 0));
}
function openErrors() {
  const seen = new Set(),
    out = [];
  (S.errors || [])
    .slice()
    .sort((a, b) => (b.d || 0) - (a.d || 0))
    .forEach(e => {
      const ex = errEx(e),
        k = errKey(e);
      if (seen.has(k)) return;
      seen.add(k);
      if (!e.ok && ex && !ex.aus && !unlearnedOn(e.topic, e.ei)) out.push({ e, ex });
    });
  return out;
}
function startErrors() {
  const list = openErrors().slice(0, 10);
  if (!list.length) {
    toast("Keine offenen Fehler – super!");
    return;
  }
  const gen = list.map(o => o.ex),
    gsrc = list.map(o => ({ tid: o.e.topic, ei: o.e.ei != null ? o.e.ei : -1 }));
  const idxs = shuffle(gen.map((_, i) => i));
  S.active = {
    id: "__err",
    mode: "errors",
    title: "Fehler-Training",
    gen,
    gsrc,
    idxs,
    rt: idxs.map(() => 0),
    idx: 0,
    results: [],
    d: Date.now()
  };
  save();
  openSession();
}
/* Runde beenden (fertig oder verworfen). Die Startzeit kommt in S.activeDone, damit ein anderes Gerät mit derselben,
   noch pausierten Runde sie beim Abgleich nicht wiederbelebt (sonst würde sie ein zweites Mal gewertet). */
function endActive() {
  if (S.active && Number.isFinite(S.active.d)) S.activeDone = [S.active.d, ...(S.activeDone || [])].slice(0, 20);
  S.active = null;
}
function exDoneToday() {
  if (!S.exToday || S.exToday.d !== todayKey()) S.exToday = { d: todayKey(), k: [] };
  return S.exToday;
}
/* Nur eine Runde kann pausiert sein: vor dem Start einer anderen Runde nachfragen, statt sie stillschweigend zu verwerfen */
let PENDING_START = null;
function guardActive(fn) {
  return (...args) => {
    const a = S.active;
    if (!a || !(a.gen || T(a.id))) return fn(...args);
    PENDING_START = () => fn(...args);
    SESSION = null;
    app().innerHTML = `<div class="card" style="border:2px solid var(--puolukka)"><div class="label">Pausierte Runde</div><p>Deine pausierte Runde <b>${esc(activeTitle(a))}</b> (Aufgabe ${Math.min(a.idx + 1, a.idxs.length)} von ${a.idxs.length}) geht verloren, wenn du jetzt eine neue Runde startest. Die einzelnen Antworten bleiben gespeichert, nur das Ergebnis der Runde fehlt dann.</p><div class="btnrow"><button class="btn ghost" data-act="startanyway">Trotzdem neu starten</button><button class="btn" data-act="resume">Pausierte Runde fortsetzen</button></div></div>`;
    scrollTo(0, 0);
  };
}
/* ---------- Übungsauswahl (E-1007-14/16/17) ----------
   Die Übungssammlung wächst ständig (Lektionen von Claude + von Claude geprüfte KI-Übungen, nie gelöscht). Eine Runde
   fragt nie alles ab, sondern eine gute Auswahl: nie Gesehenes und lange nicht Gesehenes zuerst, oft Falsches öfter,
   heute schon Gelöstes zuletzt, verschiedene Übungsarten, etwas Zufall. Grundlage ist S.exLog
   ({"<thema>:<index>" | "g:<gid>": {s: zuletzt gesehen, n: Versuche, w: davon falsch}}, synchronisiert).
   Lesen, Schreiben, Dialog: höchstens eine Aufgabe je Art pro Runde (Varianten wechseln sich so ab). */
const FIXED_TYPES = ["les", "sch", "dlg"];
/* S-1014-3 (Matthias): Wiederholung und Extra-Üben 20 Übungen, Freischalt-Runde 25 (vorher 8 bzw. 15) */
const ROUND_N = 20,
  LEARN_MAX = 15,
  UNLOCK_MAX = 25,
  GEN_MAX = 3;
function exKey(src, ex) {
  return ex && ex.gid ? "g:" + ex.gid : src.tid + ":" + src.ei;
}
/* Zeitraster + Punkte-Regel (S-1013-41, Matthias): Dreimal in Folge beim ersten Versuch richtig → die Übung ruht
   14 Tage; danach genügt jeweils ein richtiger erster Versuch für die nächste, längere Ruhe (30, dann 60 Tage). Ein
   Fehler hebt Ruhe und Zähler auf. Ruhende Übungen bekommen in der Punkte-Auswahl einen großen Abzug (sie kommen nur,
   wenn sonst zu wenig da ist); nach der Ruhe gilt wieder die Punkte-Regel – lange nicht gesehen ergibt viele Punkte, die
   Übung taucht also wieder auf. Erstes Lernen und Freischalt-Runde bleiben unverändert (alle Übungen, strenge 80 %).
   exLog-Felder: c = richtige erste Versuche in Folge, z = Ruhe-Stufe, p = ruht bis (ms); 0-Werte werden weggelassen. */
const REST_DAYS = [14, 30, 60],
  REST_STREAK = 3;
/* S-1013-47 (Matthias: Multiple Choice wird beim Wiederholen zu leicht): mc ruht schon nach 2 richtigen ersten
   Versuchen in Folge und doppelt so lange; eine Runde enthält höchstens MC_MAX mc (mehr nur, wenn sonst zu wenig da ist) */
const MC_STREAK = 2,
  MC_REST_FACTOR = 2,
  MC_MAX = 2;
const exResting = l => !!(l && l.p && l.p > Date.now());
function exLogAdd(src, ex, correct) {
  const L = (S.exLog = S.exLog || {}),
    k = exKey(src, ex),
    o = L[k] || { s: 0, n: 0, w: 0 };
  /* r = abklingende Fehlerneigung (jüngste Antworten zählen mehr) – für die Auswahl; w/n bleiben für den Bericht */
  const r0 = o.r ?? (o.n ? o.w / o.n : 0);
  let c = correct ? (o.c || 0) + 1 : 0,
    z = correct ? o.z || 0 : 0,
    p = correct ? o.p || 0 : 0;
  const mc = ex && ex.t === "mc";
  if (correct && !exResting(o) && c >= (z ? 1 : mc ? MC_STREAK : REST_STREAK)) {
    p = Date.now() + REST_DAYS[Math.min(z, REST_DAYS.length - 1)] * (mc ? MC_REST_FACTOR : 1) * DAY;
    z++;
    c = 0;
  }
  L[k] = {
    s: Date.now(),
    n: o.n + 1,
    w: o.w + (correct ? 0 : 1),
    r: Math.round((r0 * 0.6 + (correct ? 0 : 0.4)) * 100) / 100,
    ...(c ? { c } : {}),
    ...(z ? { z } : {}),
    ...(p ? { p } : {})
  };
}
function mergeExLog(A, B) {
  const M = { ...(B || {}) };
  for (const k in A || {}) {
    const a = A[k],
      b = M[k];
    M[k] = b
      ? {
          s: Math.max(a.s || 0, b.s || 0),
          n: Math.max(a.n || 0, b.n || 0),
          w: Math.max(a.w || 0, b.w || 0),
          r: (a.s || 0) >= (b.s || 0) ? a.r : b.r,
          ...(() => {
            const nw = (a.s || 0) >= (b.s || 0) ? a : b;
            return { ...(nw.c ? { c: nw.c } : {}), ...(nw.z ? { z: nw.z } : {}), ...(nw.p ? { p: nw.p } : {}) };
          })()
        }
      : a;
  }
  return M;
}
/* Von Claude als korrekt geprüfte KI-Übungen eines Themas (✓), die noch nicht fest in die Lektion übernommen wurden
   (übernommene tragen dort dieselbe gid) */
function approvedGen(tid) {
  const t = T(tid);
  if (!t) return [];
  const inLesson = new Set(t.ex.map(e => e.gid).filter(Boolean));
  return (S.genReview || [])
    .filter(x => x.topic === tid)
    .flatMap(x => x.ex.filter(e => e.gid && x.v && x.v[e.gid] && x.v[e.gid].ok && !inLesson.has(e.gid) && validEx(e)));
}
/* Alle Übungen eines Themas als Kandidaten {ex, src}; withGen = auch geprüfte KI-Übungen */
/* Übungen eines Themas, die gerade nicht ruhen (S-1013-41) */
function topicAvail(tid) {
  return topicPool(tid, true).filter(c => !exResting((S.exLog || {})[exKey(c.src, c.ex)])).length;
}
function topicPool(tid, withGen, bonus) {
  const t = T(tid);
  if (!t) return [];
  /* D-1014-47: in Wiederholungen (withGen) bekommen die Übungen der schwachen Teilregel einen Vorzug */
  const ws = withGen ? weakStep(tid) : -1,
    wk = new Set(ws >= 0 ? topicSteps(t)[ws].ex : []);
  /* ausgeblendete Übungen (aus: true, S-1013-33) behalten ihren Index, kommen aber nicht mehr dran */
  const own = t.ex
    .map((ex, ei) => ({ ex, src: { tid, ei }, bonus: wk.has(ei) ? (bonus || 0) + STEP_WEAK_BONUS : bonus }))
    .filter(c => !c.ex.aus);
  return withGen ? [...own, ...approvedGen(tid).map(ex => ({ ex, src: { tid, ei: -1 }, bonus }))] : own;
}
function exScore(c, done, noRest) {
  const l = (S.exLog || {})[exKey(c.src, c.ex)];
  let sc = Math.random() * 1.5 + (c.bonus || 0);
  if (!noRest && exResting(l)) sc -= 20;
  if (!l || !l.n) sc += 3;
  else sc += Math.min(3, (Date.now() - (l.s || 0)) / DAY / 7) + (l.r ?? l.w / l.n) * 2;
  if (done.has(c.src.tid + ":" + c.src.ei) || (l && l.s >= startOfDay())) sc -= 5;
  return sc;
}
/* n Übungen auswählen: zuerst die beste je Übungsart (Vielfalt), dann nach Punkten auffüllen; höchstens eine
   Lese-/Schreib-/Dialogaufgabe je Art, höchstens GEN_MAX KI-Übungen, höchstens perTopic je Thema */
function pickRound(pool, n, perTopic, noRest) {
  const done = new Set(exDoneToday().k),
    scored = pool.map(c => ({ ...c, sc: exScore(c, done, noRest) })).sort((a, b) => b.sc - a.sc);
  const out = [],
    types = new Set(),
    per = {};
  let gen = 0,
    mcCap = true;
  const fits = c =>
    !out.includes(c) &&
    !(mcCap && c.ex.t === "mc" && out.filter(o => o.ex.t === "mc").length >= MC_MAX) &&
    !(FIXED_TYPES.includes(c.ex.t) && out.some(o => o.ex.t === c.ex.t)) &&
    !(c.ex.gid && c.src.ei < 0 && gen >= GEN_MAX) &&
    !(perTopic && (per[c.src.tid] || 0) >= perTopic);
  const take = c => {
    out.push(c);
    types.add(c.ex.t);
    per[c.src.tid] = (per[c.src.tid] || 0) + 1;
    if (c.ex.gid && c.src.ei < 0) gen++;
  };
  for (const c of scored) if (out.length < n && !types.has(c.ex.t) && fits(c)) take(c);
  for (const c of scored) if (out.length < n && fits(c)) take(c);
  mcCap = false;
  for (const c of scored) if (out.length < n && fits(c)) take(c);
  return shuffle(out);
}
/* Runde aus einer Auswahl starten: Übungen in a.gen, Herkunft (Thema, Index; -1 = KI-Übung) in a.gsrc */
function startPicked(id, mode, list, extra) {
  const idxs = list.map((_, i) => i);
  S.active = {
    id,
    mode,
    gen: list.map(c => c.ex),
    gsrc: list.map(c => ({ tid: c.src.tid, ei: c.src.ei })),
    idxs,
    rt: idxs.map(() => 0),
    idx: 0,
    results: [],
    d: Date.now(),
    ...(extra || {})
  };
  save();
  openSession();
}
/* ---------- Lernschritte (S-1014-1, Matthias: „nicht alles auf einmal“) ----------
   Ein Thema kann optional steps:[{t: Titel, sec:[Nummern der <h3>-Abschnitte der Theorie, ab 1], ex:[Übungsindizes]}]
   haben. Solange es neu ist, lernt man Schritt für Schritt: nur die Theorie bis zum aktuellen Schritt, eine Runde nur
   mit dessen Übungen (+ STEP_PREV aus früheren Schritten). Ab 80 % ist der nächste Schritt frei (S.topics[id].st,
   Zeit std). Nach dem letzten Schritt folgt wie bisher die volle Lernrunde mit Bewertung; ab dann gilt das Thema
   normal (alle Übungen, Wiederholungsplan). Themen ohne gültige steps und bereits gelernte Themen: unverändert. */
/* S-1014-10 (Simulation D-1014-23): Schritt-Runden mit etwa 10 Übungen (STEP_MAX + STEP_PREV) statt bis zu 20 */
const STEP_PREV = 2,
  STEP_MAX = 8;
function topicSteps(t) {
  const st = t && !t.wort && Array.isArray(t.steps) ? t.steps : null;
  if (!st || st.length < 2) return null;
  const ok = st.every(
    x =>
      x &&
      typeof x.t === "string" &&
      Array.isArray(x.ex) &&
      x.ex.length &&
      x.ex.every(i => Number.isInteger(i) && i >= 0 && i < t.ex.length) &&
      (x.sec == null || (Array.isArray(x.sec) && x.sec.every(Number.isInteger)))
  );
  return ok ? st : null;
}
/* Schwache Teilregel (D-1014-47): Lernschritt eines Themas mit den meisten Schwächen je Übung – offene Fehler,
   Fehlerquote der Übungen (exLog) und Schwächen-Treffer aus Übungen der letzten WEAK_PLAN_DAYS Tage.
   -1 ohne Lernschritte oder wenn kein Schritt mindestens STEP_WEAK_MIN erreicht. */
const STEP_WEAK_BONUS = 0.5,
  STEP_WEAK_MIN = 0.05,
  STEP_SHORT_N = 8,
  STEP_SHORT_MIX = 2,
  ERR_MIX_MAX = 4;
function weakStep(tid) {
  const t = T(tid),
    st = topicSteps(t);
  if (!st) return -1;
  const open = new Set(
      openErrors()
        .filter(o => o.e.topic === tid && o.e.ei >= 0)
        .map(o => o.e.ei)
    ),
    since = Date.now() - WEAK_PLAN_DAYS * DAY,
    hits = {};
  (S.weak || []).forEach(x => {
    if (x && x.tid === tid && x.ei >= 0 && x.d >= since && !x.m) hits[x.ei] = (hits[x.ei] || 0) + 1;
  });
  let best = -1,
    max = STEP_WEAK_MIN;
  st.forEach((s, i) => {
    const sum = s.ex.reduce((n, ei) => {
      const ex = t.ex[ei],
        l = ex && !ex.aus ? (S.exLog || {})[exKey({ tid, ei }, ex)] : null;
      return n + (open.has(ei) ? 1 : 0) + (hits[ei] || 0) + (l && l.n ? (l.r ?? l.w / l.n) : 0);
    }, 0);
    if (sum / s.ex.length > max) {
      max = sum / s.ex.length;
      best = i;
    }
  });
  return best;
}
/* D-1014-50: offene Fehler eines Themas als Kandidaten für dessen Wiederholung (jüngste zuerst) */
function topicErrors(tid, n) {
  return openErrors()
    .filter(o => o.e.topic === tid)
    .slice(0, n)
    .map(o => ({ ex: o.ex, src: { tid, ei: o.e.ei >= 0 ? o.e.ei : -1 } }));
}
/* Wiederholung bzw. Extra-Üben: bis zu ERR_MIX_MAX offene Fehler des Themas fest dabei (D-1014-50), der Rest wie
   bisher. Vorgezogen wegen Schwächen und mit schwacher Teilregel → Kurzrunde (D-1014-47): STEP_SHORT_N Übungen
   dieser Teilregel + STEP_SHORT_MIX aus dem übrigen Thema. */
function reviewList(id, mode) {
  const t = T(id),
    errs = topicErrors(id, ERR_MIX_MAX),
    same = (a, b) => (a.src.ei >= 0 ? a.src.ei === b.src.ei : a.ex.gid && a.ex.gid === b.ex.gid),
    pool = topicPool(id, true).filter(c => !errs.some(e => same(e, c))),
    w = mode === "review" && weakPlan()[id],
    ws = w && w.moved ? weakStep(id) : -1;
  if (ws >= 0) {
    const s = topicSteps(t)[ws],
      inS = new Set(s.ex),
      e1 = errs.filter(e => inS.has(e.src.ei)).slice(0, STEP_SHORT_N),
      a = pickRound(
        pool.filter(c => c.src.ei >= 0 && inS.has(c.src.ei)),
        STEP_SHORT_N - e1.length
      ),
      b = pickRound(
        pool.filter(c => !(c.src.ei >= 0 && inS.has(c.src.ei))),
        STEP_SHORT_MIX
      );
    return { list: shuffle([...e1, ...a, ...b]), title: `${t.title} · Kurzrunde: ${s.t}` };
  }
  return { list: shuffle([...errs, ...pickRound(pool, ROUND_N - errs.length)]) };
}
/* aktueller Schritt (0 … n-1), n = alle Schritte geschafft, -1 = keine Lernschritte (mehr) */
function stepNow(id) {
  const t = T(id),
    st = topicSteps(t),
    s = S.topics[id];
  if (!st || !s || s.status !== "new") return -1;
  return Math.min(Math.max(0, s.st || 0), st.length);
}
/* Theorie bis Schritt k: Einleitung immer, Abschnitte späterer Schritte nur als gesperrte Überschrift */
function stepTheory(t, k) {
  const st = topicSteps(t),
    th = String(t.th || "");
  if (!st || k < 0 || k >= st.length) return th;
  const parts = th.split(/(?=<h3[\s>])/i),
    later = new Map();
  st.forEach((x, i) => (x.sec || []).forEach(n => i > k && !later.has(n) && later.set(n, i)));
  return parts
    .map((p, i) => {
      if (!i || !later.has(i)) return p;
      const m = /<h3[^>]*>([\s\S]*?)<\/h3>/i.exec(p);
      return `<h3 class="steplock">🔒 ${m ? m[1] : ""}</h3><p class="muted">Kommt in Schritt ${later.get(i) + 1}.</p>`;
    })
    .join("");
}
function startStep(id) {
  const t = T(id),
    st = topicSteps(t),
    k = stepNow(id);
  if (!st || k < 0 || k >= st.length) return startSession(id, "learn");
  const cand = i => ({ ex: t.ex[i], src: { tid: id, ei: i } }),
    own = st[k].ex.filter(i => !t.ex[i].aus).map(cand),
    prev = [...new Set(st.slice(0, k).flatMap(x => x.ex))].filter(i => !t.ex[i].aus && !st[k].ex.includes(i)).map(cand),
    main = own.length <= STEP_MAX ? shuffle(own) : pickRound(own, STEP_MAX, 0, true);
  startPicked(id, "step", [...main, ...shuffle(pickRound(prev, Math.min(STEP_PREV, prev.length), 0, true))], {
    title: `${t.title} · Schritt ${k + 1}/${st.length}: ${st[k].t}`,
    step: k
  });
}
/* S-1014-10: Ersatz nach zwei Fehlversuchen – eine noch nicht verwendete Übung des aktuellen Schritts (Index in a.gen);
   -1 = keine mehr da, dann kommt dieselbe Übung wie sonst nochmal */
function stepSwap(a) {
  if (!a || a.mode !== "step" || !a.gen || !Number.isInteger(a.step)) return -1;
  const t = T(a.id),
    st = topicSteps(t);
  if (!st || !st[a.step]) return -1;
  const used = new Set(a.gsrc.map(x => x.ei)),
    free = st[a.step].ex.filter(i => !used.has(i) && t.ex[i] && !t.ex[i].aus);
  if (!free.length) return -1;
  const ei = free[Math.floor(Math.random() * free.length)];
  a.gen.push(t.ex[ei]);
  a.gsrc.push({ tid: a.id, ei });
  return a.gen.length - 1;
}
/* Ergebnis einer Schritt-Runde: ab 80 % ist der nächste Schritt frei */
function stepFinish(se, score) {
  const s = S.topics[se.id],
    st = topicSteps(T(se.id)),
    k = S.active && Number.isInteger(S.active.step) ? S.active.step : stepNow(se.id);
  if (!s || !st || k < 0) return "";
  if (score >= 0.8 && (s.st || 0) <= k) {
    s.st = k + 1;
    s.std = Date.now();
  }
  const done = (s.st || 0) >= st.length;
  return score >= 0.8
    ? `<div class="card" style="border-color:var(--kuusi)"><b style="color:var(--kuusi)">${done ? "Alle Schritte geschafft!" : `Schritt ${k + 2} ist frei: ${esc(st[k + 1].t)}`}</b><p class="muted" style="margin:4px 0 0">${done ? "Jetzt kommt die Abschlussrunde mit Übungen aus dem ganzen Thema – danach gilt das Thema als gelernt." : "Lies zuerst den neuen Theorie-Abschnitt, dann folgen die Übungen dazu."}</p></div>`
    : `<div class="card" style="border-color:var(--lakka)"><b>Noch nicht 80 %</b><p class="muted" style="margin:4px 0 0">Schau dir die Fehler und den Theorie-Abschnitt noch einmal an und übe Schritt ${k + 1} nochmal.</p></div>`;
}
/* Erstes Lernen und Freischaltversuch: die Übungen der Lektion (bei sehr vielen eine Auswahl von LEARN_MAX), je
   Lese-/Schreib-/Dialogart nur eine Variante – der Reihe nach über die Runden des Themas (auf allen Geräten gleich).
   Wiederholung und Extra-Üben: ROUND_N aus Lektion + geprüften KI-Übungen. */
function startSession(id, mode) {
  const t = T(id),
    all = mode === "learn" || mode === "unlock";
  /* Gesperrte Themen nie lernen (E-1008-1) – sonst würden ihre Unterthemen frei, obwohl das Thema selbst gesperrt bleibt */
  if (!t || (S.topics[id] || {}).status === "locked") {
    toast("Dieses Thema ist noch gesperrt – erst alle Voraussetzungen mit mindestens 80 %");
    return;
  }
  if (!all) {
    const r = reviewList(id, mode);
    return startPicked(id, mode, r.list, r.title ? { title: r.title } : null);
  }
  const rot = ((S.topics[id] || {}).hist || []).length,
    pool = topicPool(id, false),
    drop = new Set();
  FIXED_TYPES.forEach(k => {
    const vs = pool.filter(c => c.ex.t === k);
    if (vs.length > 1) vs.forEach((c, n) => n !== rot % vs.length && drop.add(c));
  });
  const rest = pool.filter(c => !drop.has(c)),
    max = mode === "unlock" ? UNLOCK_MAX : LEARN_MAX,
    list = rest.length <= max ? shuffle(rest) : pickRound(rest, max, 0, true);
  startPicked(id, mode, list, mode === "unlock" ? { title: t.title + " · Freischalt-Runde" } : null);
}
/* Gemischte Wiederholung (E-1007-16): MIX_N Übungen aus allen gelernten Themen durcheinander, höchstens 3 je Thema;
   schwächere und länger nicht geübte Themen kommen öfter dran. Ändert die Themenpläne nicht. */
const MIX_N = 10;
function learningTopics() {
  return TOPICS.filter(t => S.topics[t.id] && S.topics[t.id].status === "learning");
}
/* Zuletzt geübt (für den Langzeit-Check): letzte Themenrunde. Gemischte Runden zählen hier bewusst nicht – sonst kam
   der Check bei regelmäßigem gemischtem Üben nie (E-1007-61); ihre Ergebnisse wirken stattdessen direkt auf den Plan. */
function lastPracticed(id) {
  return (((S.topics[id] || {}).hist || []).slice(-1)[0] || {}).d || 0;
}
/* Ergebnis je Thema aus gemischter Runde/Langzeit-Check: schwach (≤ limit bei mind. minN Übungen) → Termin vorziehen */
function pullTopics(chk, minN, limit, days, label) {
  const out = [];
  Object.entries(chk || {}).forEach(([tid, r]) => {
    const s = S.topics[tid],
      sc = r[1] ? r[0] / r[1] : 1;
    if (!s) return;
    let moved = false;
    if (r[1] >= minN && sc <= limit && s.status === "learning") {
      const d = addDays(days);
      if (!s.due || s.due > d) {
        s.due = d;
        moved = true;
      }
      s.ai = { ...(s.ai || {}), reason: `${label}: ${Math.round(sc * 100)} %` };
    }
    out.push({ tid, sc, moved, n: r[1] });
  });
  return out;
}
function startMix() {
  const L = learningTopics();
  if (L.length < 2) return toast("Die gemischte Wiederholung gibt es ab zwei gelernten Themen");
  const pool = L.flatMap(t => {
    const s = S.topics[t.id],
      bonus = (1 - (s.last || 0)) * 2 + Math.min(2, (Date.now() - lastPracticed(t.id)) / DAY / 14);
    return topicPool(t.id, true, bonus);
  });
  startPicked("__mix", "mix", pickRound(pool, MIX_N, 3), { title: "Gemischte Wiederholung", chk: {} });
}
/* Langzeit-Check (E-1007-17): etwa einmal im Monat je 2 Übungen aus Themen, die seit ≥ 30 Tagen nicht geübt wurden
   (bevorzugt unbekannte Übungen). Unter 70 % in einem Thema → das Thema ist spätestens morgen fällig. */
const CHECK_DAYS = 30,
  CHECK_EVERY = 28;
/* ohne Wortschatz-Pakete (D-1014-44): deren Wörter wiederholt der Vokabeltrainer */
function checkTopics() {
  return learningTopics()
    .filter(t => !t.wort && Date.now() - lastPracticed(t.id) >= CHECK_DAYS * DAY)
    .sort((a, b) => lastPracticed(a.id) - lastPracticed(b.id))
    .slice(0, 6);
}
function checkDue() {
  return Date.now() - (S.longCheck || 0) >= CHECK_EVERY * DAY && checkTopics().length > 0;
}
function startCheck() {
  const L = checkTopics();
  if (!L.length)
    return toast(`Alle Themen wurden in den letzten ${CHECK_DAYS} Tagen geübt – kein Langzeit-Check nötig`);
  startPicked(
    "__check",
    "check",
    L.flatMap(t => pickRound(topicPool(t.id, true), 3)),
    { title: "Langzeit-Check", chk: {} }
  );
}
function finishCheck(a) {
  const out = pullTopics(a.chk, 2, 0.69, 1, "Langzeit-Check");
  S.longCheck = Date.now();
  S.checkLog = [
    { d: Date.now(), r: out.map(o => ({ tid: o.tid, sc: Math.round(o.sc * 100) })) },
    ...(S.checkLog || [])
  ].slice(0, 6);
  histAdd("check");
  return out;
}
/* Freie Sitzungen (Fehler-Training, neue Übungen) tragen ihre Übungen selbst in a.gen */
function exOf(a, j) {
  const v = a.idxs[j];
  if (a.gen) return a.gen[v] || null;
  const t = T(a.id);
  return t ? t.ex[v] || null : null;
}
function srcOf(a, j) {
  const v = a.idxs[j];
  return a.gsrc ? a.gsrc[v] || { tid: a.id, ei: -1 } : { tid: a.id, ei: v };
}
function activeTitle(a) {
  return a.title || (T(a.id) || {}).title || "Übung";
}
/* Titel der laufenden Runde oben in der Leiste – damit man sieht, in welchem Modus man ist (E-1007-73) */
function roundLabel(se) {
  const m = { learn: "Lernen", review: "Wiederholung", extra: "Extra üben", step: "Lernschritt" }[se.mode];
  return m && !/ · /.test(se.title || "") ? `${se.title} · ${m}` : se.title || "Übung";
}
function isFree(mode) {
  return (
    mode === "extra" || mode === "errors" || mode === "gen" || mode === "mix" || mode === "check" || mode === "step"
  );
}
function openSession() {
  const a = S.active;
  if (!a || (!a.gen && !T(a.id))) {
    S.active = null;
    save();
    return render();
  }
  if (!a.rt || a.rt.length !== a.idxs.length) a.rt = a.idxs.map(() => 0);
  if (a.idxs.some((_, j) => !exOf(a, j))) {
    const keep = a.idxs.map((_, j) => (exOf(a, j) ? j : -1)).filter(j => j >= 0);
    a.idx = keep.filter(j => j < a.idx).length;
    a.idxs = keep.map(j => a.idxs[j]);
    a.rt = keep.map(j => a.rt[j]);
  }
  if (!a.idxs.length) {
    S.active = null;
    save();
    return render();
  }
  SESSION = {
    kind: "topic",
    id: a.id,
    mode: a.mode,
    title: activeTitle(a),
    items: a.idxs.map((_, j) => exOf(a, j)),
    idx: Math.min(a.idx, a.idxs.length),
    results: (a.results || []).slice(),
    locked: false,
    cur: null
  };
  CUR = ["errors", "mix", "check"].includes(a.mode) ? { tab: "today", arg: null } : { tab: "topics", arg: a.id };
  setTab(CUR.tab);
  scrollTo(0, 0);
  if (SESSION.idx >= SESSION.items.length) finishTopic();
  else renderEx();
}
function renderEx() {
  const se = SESSION,
    ex = se.items[se.idx];
  se.locked = false;
  se.hint = null;
  se.inVals = null;
  const isRetry = !!(S.active && S.active.rt && S.active.rt[se.idx]);
  let h = `<div class="smode">${esc(roundLabel(se))}</div><div class="sbar"><div class="prog"><i style="width:${(se.idx / se.items.length) * 100}%"></i></div><small>${se.idx + 1}/${se.items.length}</small>${prevOk(se) ? '<button class="xbtn" data-act="prevex" title="Zur vorigen Übung – Antwort ändern">← Vorige</button>' : ""}<button class="xbtn" data-act="abort">Pause</button></div><div class="card">${isRetry ? '<span class="badge" style="margin-bottom:8px;display:inline-block">Nochmal üben</span> ' : ""}${ex.gid ? genBadge(ex.gid) : ""}`;
  h += FMT[ex.t].render(ex, se);
  h += `<div id="peek">${peekHTML(se)}</div><div id="fb"></div><div id="askex"><p class="aiflagp"><a href="#" class="aiflag" data-act="askex">❓ Frag ${APP.teacher}</a></p></div>${unlearnedLink(se)}${exFlagLinkFor(se)}</div>`;
  app().innerHTML = h;
  if (FMT[ex.t].after) FMT[ex.t].after(se);
  const a = app().querySelector("#ans, .tcell, .dcell");
  if (a) a.focus();
}
/* S-1014-54 (Matthias): „Open Book“ am Anfang – in Lernschritten und in der ersten Lernrunde eines neuen Themas lässt
   sich die Regel während der Übung einblenden (im Lernschritt die Theorie bis zu diesem Schritt). Wer nachschaut,
   bekommt die Übung nicht als richtig gewertet: sie zählt wie ein Fehlversuch und kommt gleich nochmal ohne Hilfe;
   kein Eintrag in Fehlerliste, Übungsstatistik oder Fehlerneigung (Nachschauen ist kein Wissensfehler). Nicht in
   Wiederholungen, Freischalt-Runden, Langzeit-Check und beim zweiten Versuch einer Übung. S.active.pk = Position. */
function peekAllowed(se) {
  const a = S.active;
  if (!se || se.kind !== "topic" || !a || a.id !== se.id || !T(se.id)) return false;
  if (a.rt && a.rt[se.idx]) return false;
  return se.mode === "step" || (se.mode === "learn" && (S.topics[se.id] || {}).status !== "learning");
}
const peekOn = se => !!(se && S.active && S.active.id === se.id && S.active.pk === se.idx);
function peekHTML(se) {
  if (!peekAllowed(se)) return "";
  if (!peekOn(se))
    return `<p class="aiflagp"><a href="#" class="aiflag" data-act="peek">📖 Regel ansehen (die Übung zählt dann nicht als richtig)</a></p>`;
  const t = T(se.id),
    k = Number.isInteger(S.active.step) ? S.active.step : -1;
  return `<div class="peekbox"><div class="label">📖 Regel – nachgeschaut: diese Übung zählt nicht als richtig und kommt gleich nochmal</div>${se.mode === "step" && k >= 0 ? stepTheory(t, k) : String(t.th || "")}</div>`;
}
function peekOpen() {
  const se = SESSION;
  if (!peekAllowed(se) || se.locked || peekOn(se)) return;
  S.active.pk = se.idx;
  save();
  const el = $("#peek");
  if (el) el.innerHTML = peekHTML(se);
}

function checkAnswer() {
  const se = SESSION;
  if (!se || se.kind !== "topic" || se.locked) return;
  const ex = se.items[se.idx];
  se.inVals = inputVals(se, ex);
  prevHide();
  return FMT[ex.t].check(se, ex);
}
/* Freitext-Antwort prüfen (Lücke, Übersetzung, Satz ordnen, Schreibaufgabe): zuerst lokal mit den Musterlösungen,
   passt nichts und gibt es eine KI-Prüfung (judge), urteilt die KI; ohne Verbindung zählt nur der lokale Vergleich. */
async function textCheck(se, ex, user, acc, judge, waitText) {
  if (!user) return;
  se.locked = true;
  const inp = $("#ans");
  if (inp) inp.disabled = true;
  if (FMT[ex.t].after) FMT[ex.t].after(se);
  showBtns(CHECK_BTNS, false);
  let res = localCheck(user, acc, exStrict(ex), ex);
  /* Nur vertippt? (E-1008-58) – Matthias entscheidet selbst, ohne KI; nicht bei strengen Übungen und Satz ordnen */
  if (!res.correct && !res.caseOnly && ex.t !== "ord" && !exStrict(ex)) {
    const ty = typoOf(user, acc);
    if (ty) {
      se.pending = { ex, user, typo: ty };
      return showTypo(ty);
    }
  }
  /* Nur die Groß-/Kleinschreibung falsch: eindeutig, keine KI nötig (E-1008-9) */
  if (res.caseOnly) judge = null;
  /* Lückentext: offensichtlich ganz andere Eingabe (kaum gemeinsame Buchstabenpaare) → ohne KI falsch (E-1007-50) */
  if (!res.correct && ex.t === "gap" && Math.max(...acc.map(a => bigramSim(user, a))) < 0.25) judge = null;
  /* Ganzes Wort statt Endung getippt (E-1009-12): die Endung ist eindeutig ablesbar – falsche Endung ohne KI falsch */
  if (!res.correct && ex.t === "gap" && se.gapFull) judge = null;
  /* ohne KI (aus, nicht eingerichtet) wie bei Ausfall selbst bewerten (S-1012-123) */
  if (!res.correct && judge && !aiReady()) res = { correct: false, offline: true, noai: true };
  else if (!res.correct && judge) {
    $("#fb").innerHTML = `<div class="fb wait">${APP.teacher} ${waitText || "prüft deine Antwort"} ${dots()}</div>`;
    try {
      const j = await judge(ex, user);
      res = { correct: !!j.correct, ai: j.feedback, correction: j.correction, aid: j._aid };
      /* S-1014-20: richtig gewertet, aber korrigiert (im Lernschritt nicht gewertete Fehler) – sichtbar hervorheben */
      if (res.correct && FMT[ex.t].ownFix && res.correction && norm(res.correction) !== norm(user)) res.minor = user;
    } catch (e) {
      res = { correct: false, offline: true };
    }
  }
  if (SESSION !== se) return;
  if (se.gapFull && ex.t === "gap" && res.correct)
    res.note = `Gefragt war nur die Endung („${user}“) – dein ganzes Wort „${se.gapFull}“ stimmt aber.`;
  /* KI nicht erreichbar (E-1008-2): eine anders formulierte, aber richtige Antwort soll nicht als Fehler zählen –
     Matthias entscheidet selbst; „richtig“ landet im KI-Protokoll, damit Claude es im Bericht sieht */
  if (res.offline) {
    se.pending = { ex, user, noai: res.noai };
    return showOffline(ex, res.noai);
  }
  record(ex, user, res);
  /* fast richtig: die getroffene Musterlösung merken – „Nur vertippt“ statt „Ich werte es als richtig“ */
  if (se.undo && ex.t !== "ord" && !exStrict(ex)) se.undo.hit = nearHit(user, acc);
  showFb(res, ex);
}
/* Nahe an einer Musterlösung (E-1009-10): höchstens 2 Buchstaben anders (Levenshtein auf norm), sonst null */
function editDist(a, b) {
  const A = [...a],
    B = [...b];
  let prev = B.map((_, j) => j + 1);
  prev.unshift(0);
  for (let i = 1; i <= A.length; i++) {
    const cur = [i];
    for (let j = 1; j <= B.length; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[B.length];
}
function nearHit(user, acc) {
  const u = norm(user);
  let best = null;
  (acc || []).forEach(a => {
    const d = editDist(u, norm(a));
    if (d >= 1 && d <= 2 && (!best || d < best.d)) best = { a: String(a), d };
  });
  return best ? best.a : null;
}
/* „Nur vertippt – trotzdem als richtig werten“: nimmt zurück, was die falsche Antwort verändert hat (Rundenergebnis,
   Wiederholung in der Runde, Fehler-Training, Statistik) und zählt sie im Bericht als selbst gewertet (AUSRUTSCHER) */
function selfTypoAccept(silent) {
  const se = SESSION,
    u = se && se.undo;
  if (!u || u.si !== se.idx) return;
  se.undo = null;
  const a = S.active && S.active.id === se.id ? S.active : null,
    r = se.results[u.ri];
  if (r) Object.assign(r, { correct: true, self: 1 });
  if (!u.retry) {
    if (!u.dunno) {
      const s = ((S.exStats || {})[devId()] || {})[u.ex.t];
      if (s) {
        s.ok++;
        if (u.aid) s.aiOk++;
      }
    }
    const k = exKey(u.src, u.ex);
    if (u.logPrev) S.exLog[k] = u.logPrev;
    else delete S.exLog[k];
    exLogAdd(u.src, u.ex, true);
    if (a && a.chk && a.chk[u.src.tid]) a.chk[u.src.tid][0]++;
    if (u.ex.gid) {
      const set = (S.genReview || []).find(x => u.ex.gid.startsWith(x.id + "-"));
      if (set && set.res) set.res[u.ex.gid] = true;
    }
    const e = u.errD && S.errors.find(x => x.d === u.errD);
    if (e) Object.assign(e, { ok: 1, self: 1 });
  }
  if (a) {
    if (u.pos >= 0) {
      a.idxs.splice(u.pos, 1);
      a.rt.splice(u.pos, 1);
      se.items.splice(u.pos, 1);
    }
    const rv = se.rev && se.rev.si === u.si ? se.rev : null;
    if (rv) rv.pos = -1;
    if (u.src.ei >= 0) {
      const dt = exDoneToday(),
        dk = u.src.tid + ":" + u.src.ei;
      if (!dt.k.includes(dk)) {
        dt.k.push(dk);
        if (rv) rv.done = dk;
      }
    }
    a.results = se.results.slice();
  }
  if (u.hit) slipWords(u.hit, u.user).forEach(([w, x]) => slipAdd("self", w, x));
  else {
    /* keine Fast-Treffer: ganze Antwort als Selbstwertung – im Bericht (AUSRUTSCHER) und im KI-Protokoll zum Prüfen */
    slipAdd("selfok", expectedText(u.ex), String(u.user));
    aiAudit(
      "pruefung",
      { model: "selbst gewertet" },
      {
        q: promptText(u.ex),
        sol: solutionText(u.ex),
        u: String(u.user),
        ok: true,
        r: `richtig – von ${APP.learner} selbst als richtig gewertet`
      }
    );
  }
  save();
  if (silent) return;
  showFb(
    {
      correct: true,
      note: u.hit
        ? `Als „nur vertippt“ selbst gewertet – richtig: ${u.hit}. Claude sieht das im Bericht.`
        : `Selbst als richtig gewertet. Claude sieht das im Bericht und prüft es.`
    },
    u.ex
  );
}
/* E-1010-5: „Nur vertippt“ ist umschaltbar – ein Tipp markiert nur, ein zweiter nimmt zurück. Gezählt wird erst bei
   „Weiter“ bzw. wenn die Runde verlassen oder die App in den Hintergrund geschickt wird (typoCommit). */
function typoMarkText(se) {
  if (se.typoPend)
    return se.typoPend.on
      ? "✓ Als vertippt gewertet (zählt bei „Weiter“) – doch falsch werten"
      : "✗ Wird als Fehler gewertet (zählt bei „Weiter“) – doch nur vertippt";
  const hit = se.undo && se.undo.hit;
  return se.undo && se.undo.on
    ? `✓ Wird bei „Weiter“ als ${hit ? "vertippt (richtig)" : "richtig"} gewertet – nochmal tippen zum Zurücknehmen`
    : hit
      ? "Nur vertippt – trotzdem als richtig werten"
      : "Ich werte es als richtig (vertippt oder gleichwertig)";
}
function typoMarkHTML(se) {
  const act = se.typoPend ? "typotoggle" : "selftypo";
  return `<p class="aiflagp"><a href="#" class="aiflag" id="typomark" data-act="${act}">${typoMarkText(se)}</a></p>`;
}
function typoToggle() {
  const se = SESSION;
  if (!se || se.kind !== "topic") return;
  if (se.typoPend) se.typoPend.on = !se.typoPend.on;
  else if (se.undo && se.undo.si === se.idx) se.undo.on = !se.undo.on;
  else return;
  const el = $("#typomark");
  if (el) el.textContent = typoMarkText(se);
}
function typoCommit(se = SESSION) {
  if (!se || se.kind !== "topic" || (!se.typoPend && !(se.undo && se.undo.on))) return;
  const keep = SESSION;
  SESSION = se;
  try {
    const p = se.typoPend;
    if (p) {
      se.typoPend = null;
      if (p.on) slipAdd("typo", p.typo.w, p.typo.u);
      record(p.ex, p.user, { correct: !!p.on, typo: true });
      se.undo = null;
    } else if (se.undo.si === se.idx) selfTypoAccept(true);
    se.undo = null;
    save();
  } finally {
    SESSION = keep;
  }
  const el = $("#typomark");
  if (el && SESSION === se) el.closest("p").remove();
}
function showOffline(ex, noai) {
  const dlg = ex.t === "dlg";
  $("#fb").innerHTML =
    `<div class="fb dunno"><b class="t">${APP.teacher} ${noai ? "ist ausgeschaltet bzw. nicht eingerichtet" : "ist gerade nicht erreichbar"}</b><p>${dlg ? "Rot markierte Zeilen passen nicht wörtlich – die Musterlösungen stehen grün darunter." : `Deine Antwort passt nicht wörtlich zur Musterlösung: <b>${esc(expectedText(ex))}</b>`}</p><p class="muted">${dlg ? "Sind deine rot markierten Zeilen trotzdem richtig" : "Ist deine Antwort trotzdem richtig"} (andere Wortwahl oder Wortstellung)? Dann zählt sie als richtig. Sonst zählt sie als Fehler und kommt gleich nochmal. ${noai ? "" : '<a href="#" data-act="aidiag">Verbindung prüfen</a>'}</p>${EDIT_LINK}</div><div class="btnrow"><button class="btn ghost" data-act="selfno">Falsch</button><button class="btn" data-act="selfok" id="selfokbtn">${dlg ? "Meine Zeilen waren richtig" : "Meine Antwort war richtig"}</button></div>`;
}
function showTypo(ty) {
  $("#fb").innerHTML =
    `<div class="fb dunno"><b class="t">Nur vertippt?</b><p>Fast genau die Lösung: <b>${esc(ty.hit)}</b> – du hast „${esc(ty.u)}“ statt „${esc(ty.w)}“ geschrieben (eine Nachbartaste bzw. zwei Buchstaben vertauscht).</p><p class="muted">War es nur ein Tippfehler, zählt die Antwort als richtig – Claude sieht im Bericht, wie oft. Sonst zählt sie als Fehler und kommt gleich nochmal.</p>${EDIT_LINK}</div><div class="btnrow"><button class="btn ghost" data-act="selfno">Falsch</button><button class="btn" data-act="selfok" id="selfokbtn">Nur vertippt</button></div>`;
}
function selfJudge(ok) {
  const se = SESSION;
  if (!se || se.kind !== "topic" || !se.pending) return;
  const { ex, user, typo, noai, dlg } = se.pending;
  se.pending = null;
  if (typo) {
    /* gezählt wird erst bei „Weiter“ (E-1010-5) – bis dahin umschaltbar */
    se.typoPend = { ex, user, typo, on: !!ok };
    se.undo = null;
    return showFb({ correct: !!ok, typo: true, note: ok ? `Richtig: ${typo.hit}` : "" }, ex);
  }
  const why = noai ? "ausgeschaltet" : "nicht erreichbar",
    res = dlg ? dlg.res : { correct: !!ok, offline: true };
  res.noai = noai;
  if (ok) {
    res.note = `Selbst als richtig gewertet (${APP.teacher} ${noai ? "war ausgeschaltet" : "war nicht erreichbar"}) – Claude sieht das im Bericht.`;
    aiAudit(
      "pruefung",
      { model: "selbst gewertet" },
      {
        q: promptText(ex),
        sol: solutionText(ex),
        u: user,
        ok: true,
        r: `${APP.teacher} ${why} – von ${APP.learner} selbst als richtig gewertet`
      }
    );
  }
  if (dlg) {
    if (ok)
      dlg.open.forEach(k => {
        dlg.ok[k] = true;
        const c = document.querySelectorAll(".dcell")[k];
        if (c) c.classList.replace("no", "ok");
      });
    return dlgFinish(se, ex, dlg.ok, dlg.near, res, user);
  }
  record(ex, user, res);
  showFb(res, ex);
}
function dunno() {
  const se = SESSION;
  if (!se || se.kind !== "topic" || se.locked) return;
  const ex = se.items[se.idx];
  se.inVals = inputVals(se, ex);
  prevHide();
  se.locked = true;
  const inp = $("#ans");
  if (inp) inp.disabled = true;
  FMT[ex.t].dunno(se, ex);
  showBtns(CHECK_BTNS, false);
  const res = { correct: false, dunno: true, note: ex.x || "" };
  record(ex, "(weiß ich nicht)", res);
  showFb(res, ex);
}
/* Schild an KI-Übungen: ungeprüft / von Claude geprüft / fehlerhaft */
function genBadge(gid) {
  const v = genVerdictOf(gid);
  if (!v)
    return (
      '<span class="badge" style="margin-bottom:8px;display:inline-block;background:var(--lakka-bg);color:var(--lakka-ink)">Neue Übung von ' +
      APP.teacher +
      " – noch nicht von Claude geprüft</span>"
    );
  return v.ok
    ? '<span class="badge" style="margin-bottom:8px;display:inline-block;background:var(--kuusi-bg);color:var(--kuusi)">✓ von Claude geprüft</span>'
    : `<span class="badge" style="margin-bottom:8px;display:inline-block;background:var(--puolukka-bg);color:var(--puolukka)">✗ laut Claude fehlerhaft${v.korrektur ? " – richtig: " + esc(v.korrektur) : ""}</span>`;
}
/* Als „richtig“ gilt immer die feste Musterlösung (E-1007-50) – eine KI-Korrektur wird nur zusätzlich gemerkt
   (fix), damit eine falsche KI-Antwort nie als Lösung weitergegeben wird (Fehlerliste, Bericht, neue Übungen) */
function record(ex, user, res) {
  const se = SESSION,
    q = promptText(ex),
    exp = expectedText(ex),
    fix = res.correction && norm(res.correction) !== norm(exp) ? String(res.correction) : "";
  const a = S.active && S.active.id === se.id ? S.active : null,
    retry = !!(a && a.rt && a.rt[se.idx]);
  const src = a ? srcOf(a, se.idx) : { tid: se.id, ei: -1 },
    /* S-1014-54: nachgeschaut – zählt wie ein Fehlversuch, ohne Fehlerliste und Statistik */
    peek = !retry && peekOn(se);
  if (peek) res.peek = true;
  revStart(se, a, src, ex, user, res, peek);
  prevHide();
  se.results.push({
    q,
    user,
    exp,
    fix,
    correct: peek ? false : res.correct,
    /* D-1025-18: Teilpunkte – Anteil richtiger Felder (Tabelle, Lückentext, Zuordnen, Dialog, Lesetext); gelöst bleibt nur ganz richtig */
    ...(!peek && !res.correct && res.pt > 0 ? { pt: Math.round(res.pt * 100) / 100 } : {}),
    retry,
    hint: se.hint || null,
    tid: src.tid,
    ei: src.ei,
    ...(peek ? { peek: 1 } : {})
  });
  /* Für „Nur vertippt – trotzdem als richtig werten“ (E-1009-10): was eine falsche Antwort verändert hat */
  se.lastRec =
    res.correct || peek
      ? null
      : {
          si: se.idx,
          ri: se.results.length - 1,
          retry,
          src,
          dunno: !!res.dunno,
          aid: !!res.aid,
          logPrev: null,
          errD: 0,
          pos: -1
        };
  if (!retry && !res.dunno && !peek) exStatAdd(ex.t, !!res.correct, !!res.aid);
  const rv = se.rev;
  if (!retry && !peek) {
    if (se.lastRec) {
      const lp = (S.exLog || {})[exKey(src, ex)];
      se.lastRec.logPrev = lp ? { ...lp } : null;
    }
    exLogAdd(src, ex, !!res.correct);
    if (a && a.chk) {
      const c = (a.chk[src.tid] = a.chk[src.tid] || [0, 0]);
      c[1]++;
      if (res.correct) c[0]++;
    }
  }
  if (ex.gid && !retry && !peek) {
    const set = (S.genReview || []).find(x => ex.gid.startsWith(x.id + "-"));
    if (set) {
      set.res = set.res || {};
      rv.gen = { id: set.id, had: ex.gid in set.res, v: set.res[ex.gid] };
      set.res[ex.gid] = !!res.correct;
    }
  }
  if (!res.correct && !retry && !peek) {
    const e = { d: Date.now(), topic: src.tid, ei: src.ei, q, user, exp };
    if (fix) e.fix = fix;
    if (src.ei < 0) e.gx = ex;
    S.errors.unshift(e);
    S.errors = capErrors(S.errors);
    if (se.lastRec) se.lastRec.errD = e.d;
    rv.errD = e.d;
  }
  /* Beim ersten Versuch richtig gilt ein offener Fehler als gelöst – im Fehler-Training wie in jeder anderen Runde */
  if (res.correct && !retry && !peek) {
    const k = errKey({ topic: src.tid, ei: src.ei, q });
    S.errors.forEach(e => {
      if (!e.ok && (errEx(e), errKey(e) === k)) {
        e.ok = 1;
        rv.errOk.push(e.d);
      }
    });
  }
  if (a) {
    const exi = a.idxs[se.idx];
    if (res.correct && !peek) {
      if (src.ei >= 0) {
        const dt = exDoneToday();
        const k = src.tid + ":" + src.ei;
        if (!dt.k.includes(k)) {
          dt.k.push(k);
          rv.done = k;
        }
      }
    } else {
      const pos = Math.min(se.idx + 4, a.idxs.length),
        alt = retry ? stepSwap(a) : -1;
      if (alt >= 0) {
        /* S-1014-10: im Lernschritt nach dem zweiten Fehlversuch eine andere Übung desselben Schritts */
        a.idxs.splice(pos, 0, alt);
        a.rt.splice(pos, 0, 0);
        se.items.splice(pos, 0, a.gen[alt]);
        a.swaps = (a.swaps || 0) + 1;
        res.swapped = true;
        rv.swap = alt;
      } else {
        a.idxs.splice(pos, 0, exi);
        a.rt.splice(pos, 0, 1);
        se.items.splice(pos, 0, ex);
        res.requeue = true;
      }
      if (se.lastRec) se.lastRec.pos = pos;
      rv.pos = pos;
    }
    a.idx = se.idx + 1;
    a.results = se.results.slice();
  }
  /* S-1013-43 (Matthias): bei jeder falschen Antwort selbst entscheiden können, ob sie als richtig zählt – außer bei
     Auswahl-Formaten (Multiple Choice, Lesetext, Zuordnen); Claude sieht jede Selbstwertung im Bericht */
  se.undo =
    !res.correct && !res.dunno && !res.typo && !res.offline && se.lastRec && !SELF_NO.includes(ex.t)
      ? { ...se.lastRec, ex, user, hit: null }
      : null;
  /* nach „✎ Antwort ändern“: im Bericht vermerken, ob die geänderte Antwort richtig war */
  if (se.edit && se.edit.i === se.idx) {
    if (se.edit.e) se.edit.e.ok = res.correct && !peek ? 1 : 0;
    se.edit = null;
  }
  save();
}
const SELF_NO = ["mc", "les", "zuo"];
/* weitere richtige Lösungen einer Übung (ohne die Musterlösung), höchstens drei */
function solAlts(ex, model) {
  const all = String(solutionText(ex) || "")
    .split(" | ")
    .map(x => x.trim())
    .filter(Boolean);
  return [...new Set(all)].filter(x => norm(x) !== norm(model)).slice(0, 3);
}
/* S-1014-20: korrigierte Fassung mit hervorgehobenen Änderungen (Wörter, die in der eigenen Antwort fehlen oder anders
   sind; Vergleich wortweise über die längste gemeinsame Folge) */
function diffMark(from, to) {
  const A = String(from || "")
      .split(/\s+/)
      .filter(Boolean),
    B = String(to || "")
      .split(/\s+/)
      .filter(Boolean),
    a = A.map(norm),
    b = B.map(norm),
    L = a.map(() => new Array(b.length + 1).fill(0));
  L.push(new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      L[i][j] = a[i] === b[j] && A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const keep = new Set();
  for (let i = 0, j = 0; i < a.length && j < b.length; )
    if (a[i] === b[j] && A[i] === B[j]) {
      keep.add(j);
      i++;
      j++;
    } else if (L[i + 1][j] >= L[i][j + 1]) i++;
    else j++;
  return B.map((w, j) => (keep.has(j) ? esc(w) : `<mark class="chg">${esc(w)}</mark>`)).join(" ");
}
function showFb(res, ex) {
  const F0 = FMT[ex.t],
    /* Schreibaufgabe: die KI-Korrektur ist die korrigierte Fassung des eigenen Texts; sonst immer die Musterlösung */
    exp = F0.ownFix && res.correction ? res.correction : expectedText(ex),
    alt =
      !F0.ownFix && res.correction && !res.correct && norm(res.correction) !== norm(exp) ? String(res.correction) : "";
  let h = `<div class="fb ${res.correct ? "ok" : res.dunno ? "dunno" : "bad"}"><b class="t">${res.correct ? UI.right : res.dunno ? "Kein Problem – hier ist die Lösung." : UI.wrong}</b>`;
  const F = FMT[ex.t],
    fin = !!(F.target && F.target(ex));
  if (!res.correct && !F.inline)
    h += `<p>${F.fbLabel ? F.fbLabel(res) : "Richtig ist:"} ${fin ? spk(exp) : ""}<b>${fin ? glossWords(exp) : esc(exp)}</b></p>`;
  else if (!F.inline) {
    /* S-1013-42 (Matthias): auch bei richtiger Antwort – lokal oder von der KI gewertet – die Musterlösung zeigen,
       dazu bis zu drei weitere richtige Lösungen */
    const model = F0.ownFix ? expectedText(ex) : exp,
      more = solAlts(ex, model),
      show = x => (fin ? glossWords(x) : esc(x));
    h += `<p>Musterlösung: ${fin ? spk(model) : ""}<b>${show(model)}</b></p>${more.length ? `<p class="muted">Auch richtig: ${more.map(show).join(" · ")}</p>` : ""}`;
  } else if (fin) h += `<p>${spk(exp)}${glossWords(exp)}</p>`;
  /* bei richtiger Antwort steht die Musterlösung schon oben (sonst doppelt, S-1014-20) */
  if (F.fbExtra && !(res.correct && !F.inline)) h += F.fbExtra(ex, exp);
  if (res.note) h += `<p>${esc(res.note)}</p>`;
  if (res.minor)
    h += `<div class="fbminor"><b>${SESSION && SESSION.mode === "step" ? "⚠ Nicht gewertet – aber bitte merken:" : "⚠ Kleine Korrektur:"}</b><p>${diffMark(res.minor, res.correction)}</p></div>`;
  if (res.ai) h += `<p>${esc(res.ai)}</p>`;
  /* Erklärung der Übung immer zeigen, nicht nur bei „Weiß ich nicht“ (S-1013-8) */
  if (ex.x && !String(res.note || "").includes(ex.x)) h += `<p class="muted">${esc(ex.x)}</p>`;
  if (alt) h += `<p class="muted">${APP.teacher} schlägt vor: ${glossWords(alt)}</p>`;
  if (res.ai || alt) h += flagLink(res.aid);
  if (SESSION && SESSION.mode === "gen" && S.active && S.active.genAid)
    h += flagLink(S.active.genAid, "Übung fehlerhaft?");
  if (res.offline && !res.correct && res.noai)
    h += `<p class="muted">${APP.teacher} ist ausgeschaltet, daher nur der Vergleich mit der Musterlösung.</p>`;
  else if (res.offline && !res.correct)
    h += `<p class="muted">${APP.teacher} war nicht erreichbar (${esc(aiErrShort())}), daher nur der Vergleich mit der Musterlösung. <a href="#" data-act="aidiag">Verbindung prüfen</a></p>`;
  if (res.peek)
    h += `<p class="muted">📖 Mit Nachschauen – zählt nicht als richtig. Die Übung kommt gleich nochmal, dann ohne Hilfe.</p>`;
  else if (res.requeue) h += `<p class="muted">↻ Diese Übung kommt gleich nochmal – bis du sie richtig hast.</p>`;
  if (res.swapped)
    h += `<p class="muted">↻ Gleich kommt eine andere Übung zur selben Regel – lies vorher die Erklärung oben.</p>`;
  if (SESSION && (SESSION.typoPend || (!res.correct && SESSION.undo && SESSION.undo.si === SESSION.idx)))
    h += typoMarkHTML(SESSION);
  h += `</div><div class="btnrow">${editOk(SESSION) ? '<button class="btn ghost" data-act="ansedit">✎ Antwort ändern</button>' : ""}<button class="btn" data-act="next" id="nextbtn">Weiter</button></div>`;
  $("#fb").innerHTML = h;
  if (fin && S.settings.autoplay) speak(exp);
  const n = $("#nextbtn");
  if (n) n.focus();
}
function nextEx() {
  const se = SESSION;
  typoCommit(se);
  se.idx++;
  if (se.idx >= se.items.length) finishTopic();
  else {
    renderEx();
    scrollTo(0, 0);
  }
}

/* ---------- „✎ Antwort ändern“ und „← Vorige“ (D-1019-4, Matthias: vertippt oder zu schnell geklickt) ----------
   Nach dem Prüfen (vor „Weiter“) lässt sich die Eingabe wieder öffnen, nach „Weiter“ genau eine Übung zurückgehen.
   Die Wertung wird dabei ganz zurückgenommen (Rundenergebnis, Wiederholung in der Runde, Fehler-Training, Statistik,
   exLog, KI-Übungs-Ergebnis); die alte Eingabe steht wieder im Feld. Jede Änderung kommt in S.slips (k: "edit",
   w: Lösung, u: alte Eingabe, r: f = nach „Falsch“, r = nach „Richtig“, d = nach „Weiß ich nicht“, o = vor der
   Entscheidung (Nur vertippt? / KI offline), b: 1 = über „← Vorige“, ok: danach richtig 1/0) – im Bericht, damit
   Claude Raten oder Abschreiben erkennt. se.rev = was die letzte Wertung verändert hat (nur bis zur nächsten). */
const EDIT_LINK = `<p class="aiflagp"><a href="#" class="aiflag" data-act="ansedit">✎ Antwort ändern</a></p>`;
function inputVals(se, ex) {
  const all = s => [...app().querySelectorAll(s)].map(x => x.value);
  const ans = $("#ans");
  return {
    t: Date.now(),
    ans: ans ? ans.value : null,
    cells: all(".tcell, .dcell"),
    sel: all(".zsel"),
    ord: ex.t === "ord" && se.cur ? JSON.parse(JSON.stringify(se.cur)) : null,
    les:
      ex.t === "les" && se.cur && se.cur.pick ? se.cur.pick.map((p, qi) => (p < 0 ? null : se.cur.qs[qi][p].o)) : null
  };
}
function revStart(se, a, src, ex, user, res, peek) {
  const st = ((S.exStats || {})[devId()] || {})[ex.t],
    logK = exKey(src, ex),
    lp = (S.exLog || {})[logK],
    c = a && a.chk && a.chk[src.tid];
  se.rev = {
    si: se.idx,
    ri: se.results.length,
    ex,
    user,
    vals: se.inVals,
    hint: se.hint,
    t0: (se.inVals && se.inVals.t) || Date.now(),
    r: res.dunno ? "d" : res.correct && !peek ? "r" : "f",
    stat: st ? { ...st } : null,
    logK,
    logPrev: lp ? { ...lp } : null,
    tid: src.tid,
    chk: c ? [...c] : null,
    gen: null,
    errD: 0,
    errOk: [],
    done: null,
    pos: -1,
    swap: -1,
    pk: a ? a.pk : undefined
  };
}
function revertRec(rv) {
  const se = SESSION,
    a = S.active && S.active.id === se.id ? S.active : null,
    t = rv.ex.t;
  const dv = (S.exStats || {})[devId()];
  if (dv) {
    if (rv.stat) dv[t] = rv.stat;
    else delete dv[t];
  }
  if (S.exLog) {
    if (rv.logPrev) S.exLog[rv.logK] = rv.logPrev;
    else delete S.exLog[rv.logK];
  }
  if (a && a.chk) {
    if (rv.chk) a.chk[rv.tid] = rv.chk;
    else delete a.chk[rv.tid];
  }
  if (rv.gen) {
    const set = (S.genReview || []).find(x => x.id === rv.gen.id);
    if (set && set.res) {
      if (rv.gen.had) set.res[rv.ex.gid] = rv.gen.v;
      else delete set.res[rv.ex.gid];
    }
  }
  if (rv.errD) S.errors = S.errors.filter(e => e.d !== rv.errD);
  if (rv.errOk.length) S.errors.forEach(e => rv.errOk.includes(e.d) && (delete e.ok, delete e.self));
  if (rv.done) {
    const dt = exDoneToday();
    dt.k = dt.k.filter(k => k !== rv.done);
  }
  if (a) {
    if (rv.pos >= 0) {
      a.idxs.splice(rv.pos, 1);
      a.rt.splice(rv.pos, 1);
      se.items.splice(rv.pos, 1);
    }
    if (rv.swap >= 0) {
      a.swaps = Math.max(0, (a.swaps || 0) - 1);
      if (a.gen && rv.swap === a.gen.length - 1) {
        a.gen.pop();
        if (a.gsrc) a.gsrc.pop();
      }
    }
    if (rv.pk === undefined) delete a.pk;
    else a.pk = rv.pk;
  }
  /* Ausrutscher dieser Antwort (Sonderzeichen, „Nur vertippt“, Selbstwertung) zählen nicht mehr */
  if (Array.isArray(S.slips)) S.slips = S.slips.filter(x => x.k === "edit" || x.d < rv.t0);
  se.results.length = rv.ri;
  if (a) {
    a.idx = rv.si;
    a.results = se.results.slice();
  }
  se.undo = se.lastRec = se.typoPend = se.pending = null;
  se.rev = null;
  save();
}
/* alte Eingabe nach renderEx() wieder einsetzen (nur, wenn die Felder noch passen) */
function prefill(se, vals, hint) {
  const ex = se.items[se.idx];
  if (hint) {
    se.hint = hint;
    if (typeof showVocabHint === "function") showVocabHint();
  }
  if (!vals) return;
  const ans = $("#ans");
  if (ans && vals.ans != null) ans.value = vals.ans;
  const put = (s, L) => {
    const els = [...app().querySelectorAll(s)];
    if (L && L.length && els.length === L.length) els.forEach((el, i) => (el.value = L[i]));
  };
  put(".tcell, .dcell", vals.cells);
  put(".zsel", vals.sel);
  if (ex.t === "ord" && vals.ord) {
    se.cur = vals.ord;
    renderOrd();
  }
  if (ex.t === "les" && vals.les && se.cur && se.cur.qs)
    vals.les.forEach((o, qi) => {
      const oi = o == null || !se.cur.qs[qi] ? -1 : se.cur.qs[qi].findIndex(x => x.o === o);
      if (oi >= 0) lesPick(qi + ":" + oi);
    });
  const f = ans || app().querySelector(".tcell, .dcell");
  if (f) {
    f.focus();
    if (f.setSelectionRange && typeof f.value === "string") f.setSelectionRange(f.value.length, f.value.length);
  }
}
const editOk = se => !!(se && se.kind === "topic" && se.locked && (se.typoPend || (se.rev && se.rev.si === se.idx)));
const prevHide = () => document.querySelectorAll('[data-act="prevex"]').forEach(b => b.remove());
const prevOk = se => !!(se && se.kind === "topic" && !se.locked && se.rev && se.rev.si === se.idx - 1);
function editLog(ex, user, r, back) {
  const se = SESSION,
    e = slipAdd("edit", expectedText(ex), String(user), { r, ...(back ? { b: 1 } : {}) });
  se.edit = { i: se.idx, e };
}
function ansEdit() {
  const se = SESSION;
  if (!se || se.kind !== "topic" || !se.locked) return;
  const ex = se.items[se.idx];
  let vals, hint;
  if (se.pending) {
    if (se.pending.dlg) return; // Dialog: Teile schon gewertet – nur „Falsch“ oder „richtig“
    vals = se.inVals;
    hint = se.hint;
    editLog(ex, se.pending.user, "o");
    se.pending = null;
  } else if (se.typoPend) {
    vals = se.inVals;
    hint = se.hint;
    editLog(ex, se.typoPend.user, "o");
    se.typoPend = null;
  } else if (se.rev && se.rev.si === se.idx) {
    const rv = se.rev;
    vals = rv.vals;
    hint = rv.hint;
    revertRec(rv);
    editLog(ex, rv.user, rv.r);
  } else return;
  save();
  renderEx();
  prefill(se, vals, hint);
}
function prevEx() {
  const se = SESSION;
  if (!prevOk(se)) return;
  typoCommit(se);
  const rv = se.rev;
  if (!rv || rv.si !== se.idx - 1) return;
  revertRec(rv);
  se.idx = rv.si;
  editLog(rv.ex, rv.user, rv.r, true);
  save();
  renderEx();
  prefill(se, rv.vals, rv.hint);
  scrollTo(0, 0);
}
/* Bericht: geänderte Antworten der letzten 30 Tage – häufig nach „Falsch“ und danach richtig = Abschreiben? */
function editReport() {
  const since = Date.now() - 30 * DAY,
    L = (S.slips || []).filter(x => x.k === "edit" && x.d >= since);
  if (!L.length) return "";
  const n = r => L.filter(x => x.r === r).length,
    ok = L.filter(x => x.ok === 1).length,
    bad = L.filter(x => x.ok === 0).length,
    g = new Map();
  L.forEach(x => {
    const o = g.get(x.w) || { n: 0, u: new Set() };
    o.n++;
    o.u.add(x.u);
    g.set(x.w, o);
  });
  return (
    `\n\nANTWORT GEÄNDERT (30 Tage): ${L.length}×` +
    `\nnach „Falsch“ (Lösung war sichtbar): ${n("f")}× · nach „Richtig“: ${n("r")}× · nach „Weiß ich nicht“: ${n("d")}× · vor der Entscheidung (Nur vertippt? / ${APP.teacher} offline): ${n("o")}×` +
    `\ndavon über „← Vorige“: ${L.filter(x => x.b).length}× · danach richtig: ${ok}× · danach falsch: ${bad}×` +
    `\nÜbungen (Lösung (alte Eingaben) Anzahl): ` +
    [...g]
      .sort((a, b) => b[1].n - a[1].n)
      .slice(0, 15)
      .map(([w, o]) => `${w} (${[...o.u].slice(0, 3).join(", ")}) ${o.n}×`)
      .join("; ")
  );
}

function finishTopic() {
  const se = SESSION,
    t = T(se.id) || { id: se.id, title: se.title },
    /* „Noch nicht gelernt?“ gemeldete Übungen zählen nicht ins Ergebnis, bis Claude sie geprüft hat (E-1012-1);
       bleibt keine Übung übrig, gilt die Runde nicht als bestanden */
    first = se.results.filter(r => !r.retry),
    res = first.filter(r => !unlearnedOn(r.tid, r.ei)),
    skipped = first.length - res.length,
    ok = Math.round(res.reduce((s, r) => s + (r.correct ? 1 : r.pt || 0), 0) * 10) / 10,
    score = res.length ? ok / res.length : skipped ? 0 : 1;
  se.score = score;
  const retries = se.results.length - first.length;
  const wrong = res.filter(r => !r.correct);
  let h = `<div class="card center"><div class="label">${esc(se.title || t.title)}</div><div class="ring" style="--p:${Math.round(score * 100)}"><span>${Math.round(score * 100)}%</span></div><p>${String(ok).replace(".", ",")} von ${res.length} beim ersten Versuch richtig${res.some(r => r.pt) ? " (mit Teilpunkten)" : ""}</p>${skipped ? `<p class="muted">${skipped === 1 ? "1 Übung" : skipped + " Übungen"} als „Noch nicht gelernt“ gemeldet – zählt nicht</p>` : ""}${retries ? `<p class="muted">${retries}× nochmal geübt${S.active && S.active.swaps ? "" : " – am Ende hattest du alles richtig ✓"}</p>` : ""}</div>`;
  const helped = res.filter(r => r.hint && r.correct);
  if (helped.length)
    h += `<div class="card"><h3 style="margin-top:0">Mit Vokabelhilfe gelöst</h3><p class="muted">Die Grammatik hast du selbst gebildet – diese Wörter kommen in deinen Vokabeln (${APP.base.name} → ${APP.target.name}) früher wieder:</p>${helped.map(r => `<div class="err"><div>${esc(r.q)}</div><div class="u">💡 ${esc(r.hint.join(", "))}</div></div>`).join("")}</div>`;
  if (wrong.length)
    h += `<div class="card"><h3 style="margin-top:0">Das ging daneben</h3>${wrong.map(r => `<div class="err"><div>${esc(r.q)}</div><div class="u">Deine Antwort: ${esc(r.user)}</div><div class="r">Richtig: ${esc(r.exp)}</div></div>`).join("")}</div>`;
  if (isFree(se.mode)) {
    const chk = se.mode === "check" && S.active ? finishCheck(S.active) : null;
    const mixChk = se.mode === "mix" && S.active ? S.active.chk : null;
    const stepMsg = se.mode === "step" ? stepFinish(se, score) : "";
    bumpStreak();
    S.stats.sessions++;
    endActive();
    save();
    SESSION = null;
    if (se.mode === "errors") {
      const left = openErrors().length;
      h += `<div class="card center"><p>${left ? `Noch ${left} offene Fehler – richtig beim ersten Versuch gilt als gelöst.` : "Alle Fehler gelöst – stark!"}</p></div><div class="btnrow">${left ? `<button class="btn" data-act="errtrain">Nächste Runde</button>` : ""}<button class="btn ${left ? "ghost" : ""}" data-act="tab" data-id="today">Zurück zu Heute</button></div>`;
    } else if (chk) {
      h += `<div class="card"><h3 style="margin-top:0">Langzeit-Check</h3>${chk
        .map(
          c =>
            `<div class="reqrow"><div class="rq"><b>${esc((T(c.tid) || {}).title || c.tid)}</b> <small>${Math.round(c.sc * 100)} %${c.sc < 0.7 ? (c.moved ? " – kommt morgen zur Wiederholung" : " – wird bald wiederholt") : " – sitzt noch ✓"}</small></div></div>`
        )
        .join(
          ""
        )}<p class="muted" style="margin:8px 0 0">Der nächste Langzeit-Check kommt in etwa ${CHECK_EVERY} Tagen.</p></div><button class="btn" data-act="tab" data-id="today">Zurück zu Heute</button>`;
    } else if (se.mode === "mix") {
      S.mixDay = todayKey();
      const pulled = pullTopics(mixChk, 3, 0.5, 3, "Gemischte Wiederholung").filter(o => o.moved);
      if (pulled.length)
        h += `<div class="card"><p style="margin:0">Schwach in dieser Runde – kommt in spätestens 3 Tagen zur Wiederholung: <b>${pulled.map(o => esc((T(o.tid) || {}).title || o.tid)).join(", ")}</b></p></div>`;
      S.mixLog = [{ d: Date.now(), sc: Math.round(score * 100), n: res.length }, ...(S.mixLog || [])].slice(0, 10);
      save();
      h += `<div class="card center"><p class="muted" style="margin:0">Gemischt üben trainiert, selbst zu erkennen, welche Regel gerade gilt. Ändert deine Themenpläne nicht.</p></div><div class="btnrow"><button class="btn" data-act="mix">Noch eine Runde</button><button class="btn ghost" data-act="tab" data-id="today">Zurück zu Heute</button></div>`;
    } else {
      if (se.mode === "gen")
        h += `<div class="card" style="border-color:var(--lakka)"><b>Diese Übungen hat ${APP.teacher} erzeugt.</b><p class="muted" style="margin:4px 0 0">Schick Claude deinen Bericht (${SET_NAME} → Bericht für Claude), damit er sie auf Richtigkeit prüft. Fehlerhafte Übungen werden danach aus deinem Fehler-Training entfernt.</p></div>`;
      /* D-1022-16: Schritt unter 80 % – sofort neuer Versuch (neu gemischt), ohne Umweg über die Themenseite */
      const again =
        se.mode === "step" && score < 0.8 && stepNow(t.id) >= 0 && stepNow(t.id) < (topicSteps(t) || []).length;
      h += again
        ? `${stepMsg}<div class="btnrow"><button class="btn" data-act="steplearn" data-id="${esc(t.id)}">Schritt ${stepNow(t.id) + 1} nochmal üben</button><button class="btn ghost" data-act="topic" data-id="${esc(t.id)}">Zurück zum Thema</button></div>`
        : `${stepMsg}<button class="btn" data-act="topic" data-id="${esc(t.id)}">Zurück zum Thema</button>`;
    }
  } else
    h += `<div class="card" id="ratebox"><h3 style="margin-top:0">Wie sicher fühlst du dich?</h3><p class="muted">Deine Einschätzung und dein Ergebnis fließen in den Plan ein. ${se.score >= 1 ? "" : `Danach prüft ${APP.teacher}, wann das Thema wiederkommt.`}</p><div class="rates">${RATINGS.map(r => `<button class="rate ${r.k}" data-act="rate" data-id="${r.k}"><b>${r.l}</b><small>${relDays(addDays(topicBase(S.topics[t.id], se.score, r.q, t.id).days))}</small></button>`).join("")}</div><p class="muted" style="margin:8px 0 0;font-size:12px">Unter den Knöpfen steht, wann das Thema nach dem Plan wiederkommt${aiReady() ? ` – ${APP.teacher} kann den Termin danach noch etwas anpassen` : ""}.${se.score < 0.8 ? ` Unter 80 % zählt höchstens „${RATINGS[se.score < 0.6 ? 0 : 1].l}“, damit das Thema bald wiederkommt.` : ""}</p></div>`;
  app().innerHTML = h;
  scrollTo(0, 0);
}
/* Plan nach Algorithmus für eine Themen-Bewertung: das Ergebnis begrenzt die Einschätzung (unter 60 % höchstens
   „Nochmal“, unter 80 % höchstens „Schwer“). Wird auch vorab unter den Knöpfen angezeigt. */
/* S-1014-7 (Simulation D-1014-20: vorgezogene Wiederholungen ließen den Abstand in 12 Tagen von 53 auf 365 Tage
   springen): gerechnet wird mit der seit der letzten Runde vergangenen Zeit, nicht mit dem geplanten Abstand. Wurde
   das Thema wegen Schwächen vorgezogen (Schwächen-Vorzug, gemischte Runde, Langzeit-Check), bleibt der Abstand
   höchstens gleich. Dazu Wachstumsgrenze und Höchstabstand (topicCap, S-1014-17). */
function topicBase(s, score, q, id) {
  if (score < 0.6) q = Math.min(q, 2);
  else if (score < 0.8) q = Math.min(q, 3);
  s = s || {};
  const iv = s.interval || 0,
    lastD = ((s.hist || []).slice(-1)[0] || {}).d || 0,
    gone = lastD ? Math.max(1, Math.round((Date.now() - lastD) / DAY)) : iv,
    early = iv > 0 && gone < iv,
    pulled = early && (topicPulled(id, s, lastD, iv) || false),
    base = sm2Next(early ? { ...s, interval: gone } : s, q);
  let days = Math.max(1, base.interval);
  if (iv > 0 && q >= 3) days = Math.min(days, Math.max(iv + 1, Math.round(iv * TOPIC_GROW)));
  if (pulled) days = Math.min(days, iv);
  return { base, days: Math.min(days, topicCap(id), blockCap(id, score)) };
}
/* Wurde das Thema wegen Schwächen vor seinem Plan-Termin geholt? (Schwächen-Vorzug oder ein von pullTopics
   vorgezogener Termin) */
function topicPulled(id, s, lastD, iv) {
  if (!id) return false;
  const w = weakPlan()[id];
  if (w && w.moved) return true;
  /* Termin der KI (aiIv) zählt als Plan – nur ein noch früherer Termin war ein Vorziehen */
  const plan = Math.min(iv, s.aiIv || iv);
  return !!(s.due && lastD && s.due < lastD + (plan - 1) * DAY);
}
/* Ein Thema unter 80 %, auf das gesperrte Themen warten, kommt spätestens nach BLOCK_MAX Tagen wieder – sonst stünde
   der Fortschritt wochenlang still (E-1008-5); gilt auch für den Termin der KI */
const BLOCK_MAX = 7;
function blockCap(id, score) {
  return id && score < 0.8 && TOPICS.some(t => t.req.includes(id) && (S.topics[t.id] || {}).status === "locked")
    ? BLOCK_MAX
    : Infinity;
}
async function rateTopic(k) {
  const se = SESSION;
  /* nur nach einer fertig ausgewerteten Runde (Schutz gegen ein fehlendes Ergebnis → NaN im Plan) */
  if (!se || se.rated || !Number.isFinite(se.score) || !S.topics[se.id]) return;
  se.rated = true;
  const t = T(se.id),
    s = S.topics[se.id],
    score = se.score;
  /* Stocken erkennen (E-1007-62): Freischaltversuche hintereinander unter 80 % */
  if (score >= 0.8) s.unlockFails = 0;
  else if (se.mode === "unlock") s.unlockFails = (s.unlockFails || 0) + 1;
  const { base, days: baseDays } = topicBase(s, score, RQ[k], se.id);
  s.ease = base.ease;
  s.reps = base.reps;
  s.lapses = base.lapses;
  s.last = score;
  s.best = Math.max(s.best || 0, score);
  s.hist.push({ d: Date.now(), sc: Math.round(score * 100), r: k });
  s.hist = s.hist.slice(-30);
  histTick();
  const wasNew = s.status === "new";
  if (wasNew) {
    s.status = "learning";
    addCards(t);
    S.daily.newTopics++;
  }
  s.interval = baseDays;
  s.due = addDays(baseDays);
  delete s.aiIv;
  s.ai = { ...(s.ai || {}), reason: "Plan nach Algorithmus" };
  bumpStreak();
  S.stats.sessions++;
  S.sinceGlobal++;
  endActive();
  const opened = refreshUnlocks();
  save();
  const unl = opened.length
    ? `<div class="card" style="border-color:var(--kuusi)"><b style="color:var(--kuusi)">Neu freigeschaltet:</b> ${opened.map(o => esc(o.title)).join(", ")}</div>`
    : "";
  const words = wasNew ? `<p class="muted">${t.v.length} neue Wörter warten im Bereich Vokabeln.</p>` : "";
  const box = $("#ratebox");
  const miss =
    se.mode === "unlock" && score < 0.8
      ? `<div class="card" style="border-color:var(--lakka)"><b>Noch nicht 80 %</b> – mit „Zeigen, dass ich es kann“ kannst du es jederzeit nochmal versuchen. Tipp: zuerst die Fehler oben ansehen und das Fehler-Training machen.</div>`
      : "";
  const tail = `${miss}${unl}<div class="btnrow"><button class="btn" data-act="tab" data-id="today">Weiter</button></div>`;
  /* Alles beim ersten Versuch richtig und „Gut“/„Einfach“: nichts auszuwerten – der Plan gilt, keine KI-Anfrage (E-1007-77) */
  const perfect = score >= 1 && (k === "good" || k === "easy");
  if (!aiReady() || perfect) {
    box.innerHTML = `<div class="plan" style="border:0;margin:0;padding:0">${perfect ? "Alles beim ersten Versuch richtig – stark! " : ""}Nächste Wiederholung: <b>${relDays(s.due)}</b> (${fmtDate(s.due)})</div>${words}`;
    box.insertAdjacentHTML("afterend", tail);
    SESSION = null;
    return;
  }
  box.innerHTML = `<p class="muted">${APP.teacher} wertet deine Runde aus ${dots()}</p>`;
  try {
    const j = await aiSessionReview(
      t,
      s,
      se.results.filter(r => !r.retry),
      score,
      k,
      baseDays
    );
    const d = Math.min(topicIv(j.intervalDays, score, baseDays, s.reps, se.id), blockCap(se.id, score));
    /* Während der Auswertung kann der Abgleich S ersetzt haben: den Termin im aktuellen Stand setzen.
       Nur der Termin folgt der KI – der Abstand des Plans bleibt baseDays (E-1007-57) */
    const cur = S.topics[se.id] || s;
    cur.due = addDays(d);
    cur.aiIv = d;
    cur.ai = { feedback: j.feedback, tips: j.tips || [], reason: j.reason || "", date: Date.now() };
    save();
    if (!document.body.contains(box)) {
      if (SESSION === se) SESSION = null;
      return;
    }
    box.classList.add("aibox");
    box.innerHTML = `<div class="label">${APP.teacher}</div>${flagLink(j._aid)}<p>${esc(j.feedback)}</p>${(j.tips || []).length ? `<ul>${j.tips.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}<div class="plan">Nächste Wiederholung: <b>${relDays(cur.due)}</b> (${fmtDate(cur.due)})<br><small>${esc(j.reason || "")}</small></div>${words}`;
  } catch (e) {
    if (!document.body.contains(box)) {
      if (SESSION === se) SESSION = null;
      return;
    }
    box.innerHTML = `<div class="plan" style="border:0;margin:0;padding:0">Nächste Wiederholung: <b>${relDays((S.topics[se.id] || s).due)}</b> (${fmtDate((S.topics[se.id] || s).due)})<br><small>${APP.teacher} war nicht erreichbar (${esc(aiErrShort())}), daher gilt der Standardplan.</small></div>${words}`;
  }
  box.insertAdjacentHTML("afterend", tail);
  SESSION = null;
}

/* Gemeinsamer Abschlussbildschirm für Vokabel- und Hörrunden */
function doneScreen(msg, extra) {
  app().innerHTML = `<div class="card center"><p class="ftitle">${esc(UI.praise)}</p><p style="margin-top:8px">${msg}</p>${extra || ""}</div>`;
}
function againRow(act) {
  return `<div class="btnrow"><button class="btn" data-act="${act}">Noch eine Runde</button><button class="btn ghost" data-act="tab" data-id="vocab">Fertig</button></div>`;
}
