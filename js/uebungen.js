/* Opi suomea – uebungen.js: Übungs-Sitzung (Themenrunden, Fehler-Training), Prüfung, Auswertung, Abschlussbildschirme.
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
      if (!e.ok && ex) out.push({ e, ex });
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
function exLogAdd(src, ex, correct) {
  const L = (S.exLog = S.exLog || {}),
    k = exKey(src, ex),
    o = L[k] || { s: 0, n: 0, w: 0 };
  L[k] = { s: Date.now(), n: o.n + 1, w: o.w + (correct ? 0 : 1) };
}
function mergeExLog(A, B) {
  const M = { ...(B || {}) };
  for (const k in A || {}) {
    const a = A[k],
      b = M[k];
    M[k] = b
      ? { s: Math.max(a.s || 0, b.s || 0), n: Math.max(a.n || 0, b.n || 0), w: Math.max(a.w || 0, b.w || 0) }
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
function topicPool(tid, withGen, bonus) {
  const t = T(tid);
  if (!t) return [];
  const own = t.ex.map((ex, ei) => ({ ex, src: { tid, ei }, bonus }));
  return withGen ? [...own, ...approvedGen(tid).map(ex => ({ ex, src: { tid, ei: -1 }, bonus }))] : own;
}
function exScore(c, done) {
  const l = (S.exLog || {})[exKey(c.src, c.ex)];
  let sc = Math.random() * 1.5 + (c.bonus || 0);
  if (!l || !l.n) sc += 3;
  else sc += Math.min(3, (Date.now() - (l.s || 0)) / DAY / 7) + (l.w / l.n) * 2;
  if (done.has(c.src.tid + ":" + c.src.ei) || (l && l.s >= startOfDay())) sc -= 5;
  return sc;
}
/* n Übungen auswählen: zuerst die beste je Übungsart (Vielfalt), dann nach Punkten auffüllen; höchstens eine
   Lese-/Schreib-/Dialogaufgabe je Art, höchstens GEN_MAX KI-Übungen, höchstens perTopic je Thema */
function pickRound(pool, n, perTopic) {
  const done = new Set(exDoneToday().k),
    scored = pool.map(c => ({ ...c, sc: exScore(c, done) })).sort((a, b) => b.sc - a.sc);
  const out = [],
    types = new Set(),
    per = {};
  let gen = 0;
  const fits = c =>
    !out.includes(c) &&
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
/* Erstes Lernen und Freischaltversuch: die Übungen der Lektion (bei sehr vielen eine Auswahl von LEARN_MAX), je
   Lese-/Schreib-/Dialogart nur eine Variante – der Reihe nach über die Runden des Themas (auf allen Geräten gleich).
   Wiederholung und Extra-Üben: ROUND_N aus Lektion + geprüften KI-Übungen. */
function startSession(id, mode) {
  const t = T(id),
    all = mode === "learn" || mode === "unlock";
  if (!all) return startPicked(id, mode, pickRound(topicPool(id, true), ROUND_N));
  const rot = ((S.topics[id] || {}).hist || []).length,
    pool = topicPool(id, false),
    drop = new Set();
  FIXED_TYPES.forEach(k => {
    const vs = pool.filter(c => c.ex.t === k);
    if (vs.length > 1) vs.forEach((c, n) => n !== rot % vs.length && drop.add(c));
  });
  const rest = pool.filter(c => !drop.has(c)),
    list = rest.length <= LEARN_MAX ? shuffle(rest) : pickRound(rest, LEARN_MAX);
  startPicked(id, mode, list, mode === "unlock" ? { title: t.title + " · Freischaltversuch" } : null);
}
/* Gemischte Wiederholung (E-1007-16): MIX_N Übungen aus allen gelernten Themen durcheinander, höchstens 3 je Thema;
   schwächere und länger nicht geübte Themen kommen öfter dran. Ändert die Themenpläne nicht. */
const MIX_N = 10;
function learningTopics() {
  return TOPICS.filter(t => S.topics[t.id] && S.topics[t.id].status === "learning");
}
/* Zuletzt geübt: letzte Themenrunde oder letzte Übung dieses Themas in einer anderen Runde (z. B. gemischt) */
function lastPracticed(id) {
  let d = (((S.topics[id] || {}).hist || []).slice(-1)[0] || {}).d || 0;
  for (const k in S.exLog || {}) if (k.startsWith(id + ":") && S.exLog[k].s > d) d = S.exLog[k].s;
  return d;
}
function startMix() {
  const L = learningTopics();
  if (L.length < 2) return toast("Die gemischte Wiederholung gibt es ab zwei gelernten Themen");
  const pool = L.flatMap(t => {
    const s = S.topics[t.id],
      bonus = (1 - (s.last || 0)) * 2 + Math.min(2, (Date.now() - lastPracticed(t.id)) / DAY / 14);
    return topicPool(t.id, true, bonus);
  });
  startPicked("__mix", "mix", pickRound(pool, MIX_N, 3), { title: "Gemischte Wiederholung" });
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
    L.flatMap(t => pickRound(topicPool(t.id, true), 2)),
    { title: "Langzeit-Check", chk: {} }
  );
}
function finishCheck(a) {
  const out = [];
  Object.entries(a.chk || {}).forEach(([tid, r]) => {
    const s = S.topics[tid],
      sc = r[1] ? r[0] / r[1] : 1;
    if (!s) return;
    let moved = false;
    if (sc < 0.7 && s.status === "learning") {
      const d = addDays(1);
      if (!s.due || s.due > d) {
        s.due = d;
        moved = true;
      }
      s.ai = { ...(s.ai || {}), reason: `Langzeit-Check: ${Math.round(sc * 100)} %` };
    }
    out.push({ tid, sc, moved });
  });
  S.longCheck = Date.now();
  S.checkLog = [
    { d: Date.now(), r: out.map(o => ({ tid: o.tid, sc: Math.round(o.sc * 100) })) },
    ...(S.checkLog || [])
  ].slice(0, 6);
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
function isFree(mode) {
  return mode === "extra" || mode === "errors" || mode === "gen" || mode === "mix" || mode === "check";
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
  let h = `<div class="sbar"><div class="prog"><i style="width:${(se.idx / se.items.length) * 100}%"></i></div><small>${se.idx + 1}/${se.items.length}</small><button class="xbtn" data-act="abort">Pause</button></div><div class="card">${isRetry ? '<span class="badge" style="margin-bottom:8px;display:inline-block">Nochmal üben</span> ' : ""}${ex.gid ? genBadge(ex.gid) : ""}`;
  h += FMT[ex.t].render(ex, se);
  h += `<div id="fb"></div><div id="askex"><p class="aiflagp"><a href="#" class="aiflag" data-act="askex">❓ Frag ${APP.teacher}</a></p></div></div>`;
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
function localCheck(user, acc, strict) {
  const u = norm(user);
  if (acc.some(a => norm(a) === u)) return { correct: true };
  if (!strict && acc.some(a => loose(a) === loose(user)))
    return { correct: true, note: "Fast perfekt – " + SP.charNote + ". Richtig: " + acc[0] };
  return { correct: false };
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
  let res = localCheck(user, acc, !!ex.s);
  /* Lückentext: offensichtlich ganz andere Eingabe (kaum gemeinsame Buchstabenpaare) → ohne KI falsch (E-1007-50) */
  if (!res.correct && ex.t === "gap" && Math.max(...acc.map(a => bigramSim(user, a))) < 0.25) judge = null;
  if (!res.correct && judge && aiReady()) {
    $("#fb").innerHTML = `<div class="fb wait">${APP.teacher} ${waitText || "prüft deine Antwort"} ${dots()}</div>`;
    try {
      const j = await judge(ex, user);
      res = { correct: !!j.correct, ai: j.feedback, correction: j.correction, aid: j._aid };
    } catch (e) {
      res = { correct: false, offline: true };
    }
  }
  if (SESSION !== se) return;
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
  se.results.push({ q, user, exp, fix, correct: res.correct, retry, hint: se.hint || null });
  if (!retry && !res.dunno) exStatAdd(ex.t, !!res.correct, !!res.aid);
  if (!retry) {
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
    S.errors = S.errors.slice(0, 80);
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
    }
    a.idx = se.idx + 1;
    a.results = se.results.slice();
  }
  save();
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
  else if (fin) h += `<p>${spk(exp)}${glossWords(exp)}</p>`;
  if (F.fbExtra) h += F.fbExtra(ex, exp);
  if (res.note) h += `<p>${esc(res.note)}</p>`;
  if (res.ai) h += `<p>${esc(res.ai)}</p>`;
  if (alt) h += `<p class="muted">${APP.teacher} schlägt vor: ${glossWords(alt)}</p>`;
  if (res.ai || alt) h += flagLink(res.aid);
  if (SESSION && SESSION.mode === "gen" && S.active && S.active.genAid)
    h += flagLink(S.active.genAid, "Übung fehlerhaft?");
  if (res.offline)
    h += `<p class="muted">${APP.teacher} war nicht erreichbar (${esc(aiErrShort())}), daher nur der Vergleich mit der Musterlösung. <a href="#" data-act="aidiag">Verbindung prüfen</a></p>`;
  if (res.requeue) h += `<p class="muted">↻ Diese Übung kommt gleich nochmal – bis du sie richtig hast.</p>`;
  h += `</div><div class="btnrow"><button class="btn" data-act="next" id="nextbtn">Weiter</button></div>`;
  $("#fb").innerHTML = h;
  if (fin && S.settings.autoplay) speak(exp);
  const n = $("#nextbtn");
  if (n) n.focus();
}
function nextEx() {
  const se = SESSION;
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
    res = se.results.filter(r => !r.retry),
    ok = res.filter(r => r.correct).length,
    score = res.length ? ok / res.length : 1;
  se.score = score;
  const retries = se.results.length - res.length;
  const wrong = res.filter(r => !r.correct);
  let h = `<div class="card center"><div class="label">${esc(se.title || t.title)}</div><div class="ring" style="--p:${Math.round(score * 100)}"><span>${Math.round(score * 100)}%</span></div><p>${ok} von ${res.length} beim ersten Versuch richtig</p>${retries ? `<p class="muted">${retries}× nochmal geübt – am Ende hattest du alles richtig ✓</p>` : ""}</div>`;
  const helped = res.filter(r => r.hint && r.correct);
  if (helped.length)
    h += `<div class="card"><h3 style="margin-top:0">Mit Vokabelhilfe gelöst</h3><p class="muted">Die Grammatik hast du selbst gebildet – diese Wörter kommen in deinen Vokabeln (${APP.base.name} → ${APP.target.name}) früher wieder:</p>${helped.map(r => `<div class="err"><div>${esc(r.q)}</div><div class="u">💡 ${esc(r.hint.join(", "))}</div></div>`).join("")}</div>`;
  if (wrong.length)
    h += `<div class="card"><h3 style="margin-top:0">Das ging daneben</h3>${wrong.map(r => `<div class="err"><div>${esc(r.q)}</div><div class="u">Deine Antwort: ${esc(r.user)}</div><div class="r">Richtig: ${esc(r.exp)}</div></div>`).join("")}</div>`;
  if (isFree(se.mode)) {
    const chk = se.mode === "check" && S.active ? finishCheck(S.active) : null;
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
      S.mixLog = [{ d: Date.now(), sc: Math.round(score * 100), n: res.length }, ...(S.mixLog || [])].slice(0, 10);
      save();
      h += `<div class="card center"><p class="muted" style="margin:0">Gemischt üben trainiert, selbst zu erkennen, welche Regel gerade gilt. Ändert deine Themenpläne nicht.</p></div><div class="btnrow"><button class="btn" data-act="mix">Noch eine Runde</button><button class="btn ghost" data-act="tab" data-id="today">Zurück zu Heute</button></div>`;
    } else {
      if (se.mode === "gen")
        h += `<div class="card" style="border-color:var(--lakka)"><b>Diese Übungen hat ${APP.teacher} erzeugt.</b><p class="muted" style="margin:4px 0 0">Schick Claude deinen Bericht (${APP.tabs[3][0]} → Bericht für Claude), damit er sie auf Richtigkeit prüft. Fehlerhafte Übungen werden danach aus deinem Fehler-Training entfernt.</p></div>`;
      h += `<button class="btn" data-act="topic" data-id="${t.id}">Zurück zum Thema</button>`;
    }
  } else
    h += `<div class="card" id="ratebox"><h3 style="margin-top:0">Wie sicher fühlst du dich?</h3><p class="muted">Deine Einschätzung und dein Ergebnis fließen in den Plan ein. Danach prüft ${APP.teacher}, wann das Thema wiederkommt.</p><div class="rates">${RATINGS.map(r => `<button class="rate ${r.k}" data-act="rate" data-id="${r.k}"><b>${r.l}</b><small>${relDays(addDays(topicBase(S.topics[t.id], se.score, r.q).days))}</small></button>`).join("")}</div><p class="muted" style="margin:8px 0 0;font-size:12px">Unter den Knöpfen steht, wann das Thema nach dem Plan wiederkommt${aiReady() ? ` – ${APP.teacher} kann den Termin danach noch etwas anpassen` : ""}.${se.score < 0.8 ? ` Unter 80 % zählt höchstens „${RATINGS[se.score < 0.6 ? 0 : 1].l}“, damit das Thema bald wiederkommt.` : ""}</p></div>`;
  app().innerHTML = h;
  scrollTo(0, 0);
}
/* Plan nach Algorithmus für eine Themen-Bewertung: das Ergebnis begrenzt die Einschätzung (unter 60 % höchstens
   „Nochmal“, unter 80 % höchstens „Schwer“). Wird auch vorab unter den Knöpfen angezeigt. */
function topicBase(s, score, q) {
  if (score < 0.6) q = Math.min(q, 2);
  else if (score < 0.8) q = Math.min(q, 3);
  const base = sm2Next(s || {}, q);
  return { base, days: Math.max(1, base.interval) };
}
async function rateTopic(k) {
  const se = SESSION;
  if (!se || se.rated) return;
  se.rated = true;
  const t = T(se.id),
    s = S.topics[se.id],
    score = se.score;
  const { base, days: baseDays } = topicBase(s, score, RQ[k]);
  s.ease = base.ease;
  s.reps = base.reps;
  s.lapses = base.lapses;
  s.last = score;
  s.best = Math.max(s.best || 0, score);
  s.hist.push({ d: Date.now(), sc: Math.round(score * 100), r: k });
  s.hist = s.hist.slice(-30);
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
      ? `<div class="card" style="border-color:var(--lakka)"><b>Noch nicht 80 %</b> – du kannst jederzeit einen neuen Freischaltversuch starten. Tipp: zuerst die Fehler oben ansehen und das Fehler-Training machen.</div>`
      : "";
  const tail = `${miss}${unl}<div class="btnrow"><button class="btn" data-act="tab" data-id="today">Weiter</button></div>`;
  if (!aiReady()) {
    box.innerHTML = `<div class="plan" style="border:0;margin:0;padding:0">Nächste Wiederholung: <b>${relDays(s.due)}</b> (${fmtDate(s.due)})</div>${words}`;
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
    const d = topicIv(j.intervalDays, score, baseDays);
    /* Während der Auswertung kann der Abgleich S ersetzt haben: den Termin im aktuellen Stand setzen */
    const cur = S.topics[se.id] || s;
    cur.interval = d;
    cur.due = addDays(d);
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
