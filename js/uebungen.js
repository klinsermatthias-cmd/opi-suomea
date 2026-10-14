/* Lern-Engine – uebungen.js: Übungs-Sitzung (Themenrunden, Fehler-Training), Prüfung, Auswertung, Abschlussbildschirme.
   Wörter antippen: woerterbuch.js · Vokabeln und Hören: vokabeln.js · weitere Übungsformate: formate.js.
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
const ROUND_N = 8,
  LEARN_MAX = 15,
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
  /* ausgeblendete Übungen (aus: true, S-1013-33) behalten ihren Index, kommen aber nicht mehr dran */
  const own = t.ex.map((ex, ei) => ({ ex, src: { tid, ei }, bonus })).filter(c => !c.ex.aus);
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
const STEP_PREV = 2,
  STEP_MAX = 18;
function topicSteps(t) {
  const st = t && Array.isArray(t.steps) ? t.steps : null;
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
  if (!all) return startPicked(id, mode, pickRound(topicPool(id, true), ROUND_N));
  const rot = ((S.topics[id] || {}).hist || []).length,
    pool = topicPool(id, false),
    drop = new Set();
  FIXED_TYPES.forEach(k => {
    const vs = pool.filter(c => c.ex.t === k);
    if (vs.length > 1) vs.forEach((c, n) => n !== rot % vs.length && drop.add(c));
  });
  const rest = pool.filter(c => !drop.has(c)),
    list = rest.length <= LEARN_MAX ? shuffle(rest) : pickRound(rest, LEARN_MAX, 0, true);
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
function checkTopics() {
  return learningTopics()
    .filter(t => Date.now() - lastPracticed(t.id) >= CHECK_DAYS * DAY)
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
  const isRetry = !!(S.active && S.active.rt && S.active.rt[se.idx]);
  let h = `<div class="smode">${esc(roundLabel(se))}</div><div class="sbar"><div class="prog"><i style="width:${(se.idx / se.items.length) * 100}%"></i></div><small>${se.idx + 1}/${se.items.length}</small><button class="xbtn" data-act="abort">Pause</button></div><div class="card">${isRetry ? '<span class="badge" style="margin-bottom:8px;display:inline-block">Nochmal üben</span> ' : ""}${ex.gid ? genBadge(ex.gid) : ""}`;
  h += FMT[ex.t].render(ex, se);
  h += `<div id="fb"></div><div id="askex"><p class="aiflagp"><a href="#" class="aiflag" data-act="askex">❓ Frag ${APP.teacher}</a></p></div>${unlearnedLink(se)}${exFlagLinkFor(se)}</div>`;
  app().innerHTML = h;
  if (FMT[ex.t].after) FMT[ex.t].after(se);
  const a = app().querySelector("#ans, .tcell, .dcell");
  if (a) a.focus();
}

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
function slipAdd(k, w, u) {
  if (typeof S === "undefined" || !S || !w) return;
  const now = Date.now(),
    list = Array.isArray(S.slips) ? S.slips : (S.slips = []);
  if (list.some(x => x.k === k && x.w === w && now - x.d < 5000)) return; // dieselbe Antwort nicht doppelt zählen
  list.unshift({ d: now, k, w: cut(w, 40), u: cut(u, 40) });
  if (list.length > SLIP_MAX) list.length = SLIP_MAX;
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
    L = (S.slips || []).filter(x => x.d >= since);
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
/* Tabellenzellen: frei, wenn die Musterlösung ein ganzer Satz ist (endet auf . ! ?) oder ein Fragewort, das nur am
   Satzanfang großgeschrieben wird (S-1013-7) */
function caseFree(ex, ans) {
  if (!ex || ["tr", "ord", "sch", "dlg", "les"].includes(ex.t) || (ex.t === "gap" && /^\s*___/.test(ex.q || "")))
    return true;
  if (ex.t !== "tab" || ans == null) return false;
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
function checkAnswer() {
  const se = SESSION;
  if (!se || se.kind !== "topic" || se.locked) return;
  const ex = se.items[se.idx];
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
    if (u.src.ei >= 0) {
      const dt = exDoneToday(),
        dk = u.src.tid + ":" + u.src.ei;
      if (!dt.k.includes(dk)) dt.k.push(dk);
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
    `<div class="fb dunno"><b class="t">${APP.teacher} ${noai ? "ist ausgeschaltet bzw. nicht eingerichtet" : "ist gerade nicht erreichbar"}</b><p>${dlg ? "Rot markierte Zeilen passen nicht wörtlich – die Musterlösungen stehen grün darunter." : `Deine Antwort passt nicht wörtlich zur Musterlösung: <b>${esc(expectedText(ex))}</b>`}</p><p class="muted">${dlg ? "Sind deine rot markierten Zeilen trotzdem richtig" : "Ist deine Antwort trotzdem richtig"} (andere Wortwahl oder Wortstellung)? Dann zählt sie als richtig. Sonst zählt sie als Fehler und kommt gleich nochmal. ${noai ? "" : '<a href="#" data-act="aidiag">Verbindung prüfen</a>'}</p></div><div class="btnrow"><button class="btn ghost" data-act="selfno">Falsch</button><button class="btn" data-act="selfok" id="selfokbtn">${dlg ? "Meine Zeilen waren richtig" : "Meine Antwort war richtig"}</button></div>`;
}
function showTypo(ty) {
  $("#fb").innerHTML =
    `<div class="fb dunno"><b class="t">Nur vertippt?</b><p>Fast genau die Lösung: <b>${esc(ty.hit)}</b> – du hast „${esc(ty.u)}“ statt „${esc(ty.w)}“ geschrieben (eine Nachbartaste bzw. zwei Buchstaben vertauscht).</p><p class="muted">War es nur ein Tippfehler, zählt die Antwort als richtig – Claude sieht im Bericht, wie oft. Sonst zählt sie als Fehler und kommt gleich nochmal.</p></div><div class="btnrow"><button class="btn ghost" data-act="selfno">Falsch</button><button class="btn" data-act="selfok" id="selfokbtn">Nur vertippt</button></div>`;
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
  se.locked = true;
  const ex = se.items[se.idx];
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
  const src = a ? srcOf(a, se.idx) : { tid: se.id, ei: -1 };
  se.results.push({ q, user, exp, fix, correct: res.correct, retry, hint: se.hint || null, tid: src.tid, ei: src.ei });
  /* Für „Nur vertippt – trotzdem als richtig werten“ (E-1009-10): was eine falsche Antwort verändert hat */
  se.lastRec = res.correct
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
  if (!retry && !res.dunno) exStatAdd(ex.t, !!res.correct, !!res.aid);
  if (!retry) {
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
  if (ex.gid && !retry) {
    const set = (S.genReview || []).find(x => ex.gid.startsWith(x.id + "-"));
    if (set) (set.res = set.res || {})[ex.gid] = !!res.correct;
  }
  if (!res.correct && !retry) {
    const e = { d: Date.now(), topic: src.tid, ei: src.ei, q, user, exp };
    if (fix) e.fix = fix;
    if (src.ei < 0) e.gx = ex;
    S.errors.unshift(e);
    S.errors = capErrors(S.errors);
    if (se.lastRec) se.lastRec.errD = e.d;
  }
  /* Beim ersten Versuch richtig gilt ein offener Fehler als gelöst – im Fehler-Training wie in jeder anderen Runde */
  if (res.correct && !retry) {
    const k = errKey({ topic: src.tid, ei: src.ei, q });
    S.errors.forEach(e => {
      if (!e.ok && (errEx(e), errKey(e) === k)) e.ok = 1;
    });
  }
  if (a) {
    const exi = a.idxs[se.idx];
    if (res.correct) {
      if (src.ei >= 0) {
        const dt = exDoneToday();
        const k = src.tid + ":" + src.ei;
        if (!dt.k.includes(k)) dt.k.push(k);
      }
    } else {
      const pos = Math.min(se.idx + 4, a.idxs.length);
      a.idxs.splice(pos, 0, exi);
      a.rt.splice(pos, 0, 1);
      se.items.splice(pos, 0, ex);
      res.requeue = true;
      if (se.lastRec) se.lastRec.pos = pos;
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
  if (F.fbExtra) h += F.fbExtra(ex, exp);
  if (res.note) h += `<p>${esc(res.note)}</p>`;
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
  if (res.requeue) h += `<p class="muted">↻ Diese Übung kommt gleich nochmal – bis du sie richtig hast.</p>`;
  if (SESSION && (SESSION.typoPend || (!res.correct && SESSION.undo && SESSION.undo.si === SESSION.idx)))
    h += typoMarkHTML(SESSION);
  h += `</div><div class="btnrow"><button class="btn" data-act="next" id="nextbtn">Weiter</button></div>`;
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

function finishTopic() {
  const se = SESSION,
    t = T(se.id) || { id: se.id, title: se.title },
    /* „Noch nicht gelernt?“ gemeldete Übungen zählen nicht ins Ergebnis, bis Claude sie geprüft hat (E-1012-1);
       bleibt keine Übung übrig, gilt die Runde nicht als bestanden */
    first = se.results.filter(r => !r.retry),
    res = first.filter(r => !unlearnedOn(r.tid, r.ei)),
    skipped = first.length - res.length,
    ok = res.filter(r => r.correct).length,
    score = res.length ? ok / res.length : skipped ? 0 : 1;
  se.score = score;
  const retries = se.results.length - first.length;
  const wrong = res.filter(r => !r.correct);
  let h = `<div class="card center"><div class="label">${esc(se.title || t.title)}</div><div class="ring" style="--p:${Math.round(score * 100)}"><span>${Math.round(score * 100)}%</span></div><p>${ok} von ${res.length} beim ersten Versuch richtig</p>${skipped ? `<p class="muted">${skipped === 1 ? "1 Übung" : skipped + " Übungen"} als „Noch nicht gelernt“ gemeldet – zählt nicht</p>` : ""}${retries ? `<p class="muted">${retries}× nochmal geübt – am Ende hattest du alles richtig ✓</p>` : ""}</div>`;
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
      h += `${stepMsg}<button class="btn" data-act="topic" data-id="${esc(t.id)}">Zurück zum Thema</button>`;
    }
  } else
    h += `<div class="card" id="ratebox"><h3 style="margin-top:0">Wie sicher fühlst du dich?</h3><p class="muted">Deine Einschätzung und dein Ergebnis fließen in den Plan ein. ${se.score >= 1 ? "" : `Danach prüft ${APP.teacher}, wann das Thema wiederkommt.`}</p><div class="rates">${RATINGS.map(r => `<button class="rate ${r.k}" data-act="rate" data-id="${r.k}"><b>${r.l}</b><small>${relDays(addDays(topicBase(S.topics[t.id], se.score, r.q, t.id).days))}</small></button>`).join("")}</div><p class="muted" style="margin:8px 0 0;font-size:12px">Unter den Knöpfen steht, wann das Thema nach dem Plan wiederkommt${aiReady() ? ` – ${APP.teacher} kann den Termin danach noch etwas anpassen` : ""}.${se.score < 0.8 ? ` Unter 80 % zählt höchstens „${RATINGS[se.score < 0.6 ? 0 : 1].l}“, damit das Thema bald wiederkommt.` : ""}</p></div>`;
  app().innerHTML = h;
  scrollTo(0, 0);
}
/* Plan nach Algorithmus für eine Themen-Bewertung: das Ergebnis begrenzt die Einschätzung (unter 60 % höchstens
   „Nochmal“, unter 80 % höchstens „Schwer“). Wird auch vorab unter den Knöpfen angezeigt. */
function topicBase(s, score, q, id) {
  if (score < 0.6) q = Math.min(q, 2);
  else if (score < 0.8) q = Math.min(q, 3);
  const base = sm2Next(s || {}, q);
  return { base, days: Math.min(Math.max(1, base.interval), blockCap(id, score)) };
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
    const d = Math.min(topicIv(j.intervalDays, score, baseDays, s.reps), blockCap(se.id, score));
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
    box.innerHTML = `<div class="plan" style="border:0;margin:0;padding:0">Nächste Wiederholung: <b>${relDays(s.due)}</b> (${fmtDate(s.due)})<br><small>${APP.teacher} war nicht erreichbar (${esc(aiErrShort())}), daher gilt der Standardplan.</small></div>${words}`;
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
