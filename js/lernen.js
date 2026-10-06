/* Opi suomea – lernen.js: Aussprache (Sprachausgabe) und Wiederholungsplan (SM-2, Vokabelkarten, Freischaltung).
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
/* ============================================================
   AUSSPRACHE (Sprachausgabe des Geräts in der Lernsprache, APP.target.tts)
   ============================================================ */
const HAS_TTS = "speechSynthesis" in window;
let FI_VOICE = null,
  VOICE_WARNED = false;
const SPK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>';
function pickVoice() {
  if (!HAS_TTS) return;
  const vs = speechSynthesis.getVoices();
  // zuerst genau die eingestellte Stimme (z. B. de-AT), sonst irgendeine Stimme der Lernsprache
  const lc = l => String(l).toLowerCase().replace("_", "-");
  FI_VOICE =
    vs.find(v => lc(v.lang) === lc(APP.target.tts)) ||
    vs.find(v => lc(v.lang).split("-")[0] === APP.target.code) ||
    null;
}
if (HAS_TTS) {
  pickVoice();
  speechSynthesis.onvoiceschanged = () => {
    pickVoice();
    if (CUR.tab === "progress" && !SESSION) render();
  };
}
function speak(text) {
  if (!HAS_TTS) {
    if (!VOICE_WARNED) {
      toast("Dein Browser kann leider nicht vorlesen");
      VOICE_WARNED = true;
    }
    return;
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text).replace(/[→\/]/g, ", ").replace(/___/g, ""));
  u.lang = APP.target.tts;
  if (FI_VOICE) u.voice = FI_VOICE;
  u.rate = S && S.settings.slow ? 0.65 : 0.9;
  speechSynthesis.speak(u);
  if (!FI_VOICE && !VOICE_WARNED) {
    VOICE_WARNED = true;
    toast("Keine " + APP.target.adj + "e Stimme gefunden – Hilfe unter Einstellungen");
  }
}
function spk(text, big) {
  return `<button class="spk${big ? " big" : ""}" data-act="say" data-id="${esc(text)}" aria-label="Anhören">${SPK_ICON}</button>`;
}
function sayClean(t) {
  return t
    .replace(/[„“"]/g, "")
    .replace(/(\w)-(\w)/g, "$1$2")
    .trim();
}
function decorateTheory(root) {
  root
    .querySelectorAll("table:not(.nosay) tr td:first-child")
    .forEach(td => td.insertAdjacentHTML("afterbegin", spk(sayClean(td.textContent))));
  root.querySelectorAll("i").forEach(i => {
    i.classList.add("sayable");
    i.dataset.act = "say";
    i.dataset.id = sayClean(i.textContent);
  });
}
function voiceStatus() {
  if (!HAS_TTS) return "nicht unterstützt";
  return FI_VOICE ? esc(FI_VOICE.name) : "nicht gefunden";
}

/* ============================================================
   SPACED REPETITION (SM-2, wie Anki)
   ============================================================ */
/* Dynamik (Wunsch von Matthias): Vergessen → Abstand von vorn und Ease sinkt (öfter wiederholen); Gut/Einfach →
   Abstand wächst mit der Ease. Zusätzlich:
   - late = Tage, die eine Wiederholung überfällig war: wer ein Wort nach längerer Pause noch weiß, bekommt die Pause
     angerechnet (Gut: halbe, Einfach: ganze Verspätung – wie Anki).
   - Ease-Erholung: „Gut“ hebt eine gesunkene Ease langsam wieder an (+0,05 bis 2,5), sonst bliebe ein früher oft
     vergessenes Wort für immer bei kurzen Abständen, obwohl es inzwischen sitzt.
   - Höchstens 365 Tage Abstand. */
const MAX_IV = 365;
function sm2Next(it, q, late = 0) {
  let ease = it.ease ?? 2.5,
    reps = it.reps ?? 0,
    interval = it.interval ?? 0,
    lapses = it.lapses ?? 0;
  if (q < 3) {
    reps = 0;
    interval = 0;
    lapses++;
    ease = Math.max(1.3, ease - 0.2);
  } else {
    if (reps === 0) interval = { 3: 1, 4: 1, 5: 3 }[q];
    else if (reps === 1) interval = { 3: 2, 4: 4, 5: 7 }[q];
    else {
      const f = q === 3 ? 1.2 : q === 4 ? ease : ease * 1.3,
        base = interval + (q === 4 ? late / 2 : q === 5 ? late : 0);
      interval = Math.min(MAX_IV, Math.max(interval + 1, Math.round(base * f)));
    }
    ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    if (q === 4 && ease < 2.5) ease = Math.min(2.5, ease + 0.05);
    reps++;
  }
  return { ease, reps, interval, lapses };
}
/* Termin der KI für ein Thema in sinnvollen Grenzen halten: nach einer schwachen Runde nie lange warten, nach einer guten
   höchstens das Dreifache des Algorithmus (die KI darf früher wiederholen lassen, aber nicht beliebig später). */
function topicIvMax(score, baseDays) {
  return score < 0.6 ? 2 : score < 0.8 ? Math.max(4, baseDays * 2) : Math.min(MAX_IV, Math.max(7, baseDays * 3));
}
function topicIv(aiDays, score, baseDays) {
  const d = clampInt(aiDays, 1, MAX_IV) || baseDays;
  return Math.min(d, topicIvMax(score, baseDays));
}
function prereqMet(t) {
  return t.req.every(r => {
    const s = S.topics[r];
    return s && s.last != null && s.last >= 0.8;
  });
}
function refreshUnlocks() {
  const opened = [];
  TOPICS.forEach(t => {
    const s = S.topics[t.id];
    if (s.status === "locked" && prereqMet(t)) {
      s.status = "new";
      opened.push(t);
    }
  });
  return opened;
}
/* Vokabelkarten: je Wort zwei getrennte Karten mit eigenem Plan.
   "<thema>-<i>"   = Lernsprache → Basissprache (z. B. Finnisch → Deutsch)
   "<thema>-<i>-r" = Basissprache → Lernsprache. Beim Umstieg übernimmt die neue Gegenrichtung den Stand der bisherigen Karte. */
const newCard = () => ({ ease: 2.5, interval: 0, reps: 0, lapses: 0, due: null, isNew: true });
/* Kartenpaar eines Wortes anlegen; die Gegenrichtung übernimmt den Stand einer schon gelernten Vorwärtskarte */
function ensureCardPair(id) {
  if (!S.cards[id]) S.cards[id] = newCard();
  if (!S.cards[id + "-r"]) {
    const f = S.cards[id];
    S.cards[id + "-r"] = f.isNew
      ? newCard()
      : { ease: f.ease, interval: f.interval, reps: f.reps, lapses: f.lapses, due: f.due, isNew: false, last: f.last };
  }
}
function addCards(t) {
  t.v.forEach((w, i) => ensureCardPair(t.id + "-" + i));
}
/* Alle Wörter als Basis-IDs in Lernreihenfolge: Themenwörter "<thema>-<i>", danach eigene Wörter "own-<n>" */
function wordBases() {
  const b = [];
  TOPICS.forEach(t => t.v.forEach((w, i) => b.push(t.id + "-" + i)));
  ownKeys().forEach(n => b.push("own-" + n));
  return b;
}
function cardParse(id) {
  const m = /^(.+)-(\d+)(-r)?$/.exec(id);
  return m ? { tid: m[1], i: +m[2], rev: !!m[3], base: m[1] + "-" + m[2] } : null;
}
function cardWord(id) {
  const p = cardParse(id);
  if (p && p.tid === "own") return ownWord(p.i);
  const t = p && T(p.tid);
  return t ? t.v[p.i] || null : null;
}
function cardDir(id) {
  const p = cardParse(id);
  return p && p.rev ? "de" : "fi";
}
function sibling(id) {
  const p = cardParse(id);
  return p ? (p.rev ? p.base : p.base + "-r") : null;
}
/* Nur eine Richtung je Wort pro Tag und Runde (sonst verrät die eine Karte die andere) */
function siblingSeenToday(id) {
  const s = S.cards[sibling(id)];
  return !!(s && s.last && s.last >= startOfDay());
}
function onePerWord(ids) {
  const seen = new Set();
  return ids.filter(id => {
    const b = (cardParse(id) || {}).base;
    if (seen.has(b)) return false;
    seen.add(b);
    return true;
  });
}
function dueTopics() {
  return TOPICS.filter(t => {
    const s = S.topics[t.id];
    return s.status === "learning" && s.due && s.due <= endOfDay();
  }).sort((a, b) => S.topics[a.id].due - S.topics[b.id].due);
}
function nextNewTopic() {
  return TOPICS.find(t => S.topics[t.id].status === "new");
}
function dueCards() {
  const now = Date.now();
  return Object.keys(S.cards).filter(id => {
    const c = S.cards[id];
    return !c.isNew && c.due && c.due <= now && cardWord(id) && !siblingSeenToday(id);
  });
}
/* Neue Karten: „Neue Wörter pro Tag“ zählt Wörter (Finnisch → Deutsch). Die Gegenrichtung eines Wortes wird
   frühestens am Tag danach neu, mit eigenem Tageslimit in gleicher Höhe. */
function newFwdIds() {
  return wordBases().filter(id => S.cards[id] && S.cards[id].isNew);
}
function newRevIds() {
  const sod = startOfDay();
  return wordBases()
    .filter(id => {
      const f = S.cards[id],
        r = S.cards[id + "-r"];
      return r && r.isNew && f && !f.isNew && (f.last || 0) < sod;
    })
    .map(id => id + "-r");
}
function newCardsAvail() {
  const n = S.settings.newCardsPerDay;
  return [
    ...newFwdIds().slice(0, Math.max(0, n - S.daily.newCards)),
    ...newRevIds().slice(0, Math.max(0, n - (S.daily.newRev || 0)))
  ];
}
function cardState(c) {
  if (c.isNew) return "neu";
  if (c.interval >= 21) return "sicher";
  if (c.interval >= 4) return "gut";
  return "lernt";
}
/* Anzeige-Namen (CSS-Klassen bleiben): frisch = Abstand < 4 Tage, gefestigt = 4–20 Tage, sicher = ab 21 Tagen */
const STATE_L = { neu: "neu", lernt: "frisch", gut: "gefestigt", sicher: "sicher" };
const STATE_LEGEND = "frisch = Abstand unter 4 Tagen · gefestigt = 4–20 Tage · sicher = ab 21 Tagen";
function learnedWords() {
  const b = new Set();
  for (const id in S.cards) if (!S.cards[id].isNew && cardWord(id)) b.add(cardParse(id).base);
  return b.size;
}
function masteredTopics() {
  return TOPICS.filter(t => (S.topics[t.id].last || 0) >= 0.8).length;
}
const DIRL = id => (cardParse(id).rev ? DIR_REV : DIR_FWD);
/* Problemwort (wie „Leech“ bei Anki): oft vergessen oder schwer */
/* Problemwort: oft vergessen (≥ 2×) oder schwer (Ease < 2,0) – bis es seit dem letzten Vergessen 3× in Folge gewusst
   wurde (reps zählt die Erfolge seit dem letzten Vergessen). Wird es wieder vergessen, ist es wieder ein Problemwort. */
const LEECH_OK = 3;
function isLeech(id) {
  const c = S.cards[id];
  return !!(c && !c.isNew && (c.lapses >= 2 || c.ease < 2.0) && (c.reps || 0) < LEECH_OK);
}
/* Tage, die eine Karte überfällig ist (für sm2Next) */
function lateDays(c) {
  return c && c.due && !c.isNew ? Math.max(0, Math.floor((startOfDay() - startOfDay(c.due)) / DAY)) : 0;
}
function weakCards() {
  return Object.keys(S.cards)
    .filter(id => isLeech(id) && cardWord(id))
    .map(id => [id, S.cards[id]])
    .sort((a, b) => b[1].lapses - a[1].lapses);
}
/* Erste Versuche je Übungsart (pro Gerät, damit sich beim Abgleich nichts doppelt zählt):
   S.exStats[Gerät][Typ] = {n: Versuche, ok: richtig, ai: von der KI geprüft, aiOk: davon von der KI als richtig gewertet}.
   Grundlage für die Gesamtanalyse und für Claudes Prüfung, ob die KI neue Formate (Schreiben, Dialog) gut bewertet. */
function exStatAdd(t, correct, aiJudged) {
  S.exStats = S.exStats || {};
  const dv = S.exStats[devId()] || (S.exStats[devId()] = {}),
    s = dv[t] || (dv[t] = { n: 0, ok: 0, ai: 0, aiOk: 0 });
  s.n++;
  if (correct) s.ok++;
  if (aiJudged) {
    s.ai++;
    if (correct) s.aiOk++;
  }
}
function exStatsTotal() {
  const tot = {};
  Object.values(S.exStats || {}).forEach(dv =>
    Object.entries(dv).forEach(([t, s]) => {
      const a = tot[t] || (tot[t] = { n: 0, ok: 0, ai: 0, aiOk: 0 });
      ["n", "ok", "ai", "aiOk"].forEach(k => (a[k] += s[k] || 0));
    })
  );
  return tot;
}
function mergeExStats(L, R) {
  const M = { ...(R || {}) },
    n = x => Object.values(x || {}).reduce((s, v) => s + (v.n || 0), 0);
  for (const dv in L || {}) if (n(L[dv]) >= n(M[dv])) M[dv] = L[dv];
  return M;
}
function streakNow() {
  const y = todayKey(new Date(Date.now() - DAY));
  return S.stats.last === todayKey() || S.stats.last === y ? S.stats.streak : 0;
}
function bumpStreak() {
  logDay();
  const tk = todayKey();
  if (S.stats.last === tk) return;
  const y = todayKey(new Date(Date.now() - DAY));
  S.stats.streak = S.stats.last === y ? S.stats.streak + 1 : 1;
  S.stats.last = tk;
}
function ivLabel(n) {
  return n < 1 ? "1 Min" : n === 1 ? "1 Tag" : n + " Tage";
}
