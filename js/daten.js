/* Opi suomea – daten.js: Grundlagen, Zustand S, Speichern, Cloud-Sync (Supabase), Zusammenführen, Sicherungsdatei am PC.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
/* ============================================================
   GRUNDLAGEN
   ============================================================ */
/* Kurze Texte, die je App anders lauten dürfen (APP.ui in js/app.js); fehlt ein Eintrag, gilt die neutrale Vorgabe */
const UI = {
  welcome: "Willkommen!",
  right: "Richtig!",
  rightShort: "Richtig!",
  wrong: "Leider falsch.",
  praise: "Super!",
  ...(APP.ui || {})
};
/* Kürzel der Richtungen (z. B. fi→de): Lernsprache → Basissprache */
/* Name der Einstellungen-Seite in Hinweistexten (Zahnrad oben rechts, E-1007-72) */
const SET_NAME = "⚙ Einstellungen";
const BASE_CODE = APP.base.code || APP.base.name.slice(0, 2).toLowerCase();
const DIR_FWD = APP.target.code + "→" + BASE_CODE,
  DIR_REV = BASE_CODE + "→" + APP.target.code;
let TOPICS = BASE_TOPICS.slice();
function rebuildTopics() {
  TOPICS = BASE_TOPICS.concat((S.packs || []).filter(t => !BASE_TOPICS.some(b => b.id === t.id)));
}
const KEY = APP.id + "-v1";
const DAY = 86400000;
const RATINGS = [
  { k: "again", q: 1, l: "Nochmal", fi: "Uudelleen" },
  { k: "hard", q: 3, l: "Schwer", fi: "Vaikea" },
  { k: "good", q: 4, l: "Gut", fi: "Hyvä" },
  { k: "easy", q: 5, l: "Einfach", fi: "Helppo" }
];
const RQ = { again: 1, hard: 3, good: 4, easy: 5 };
let S = null,
  SESSION = null,
  CUR = { tab: "today", arg: null },
  GLOBAL_RUNNING = false;

const $ = s => document.querySelector(s);
const app = () => document.getElementById("app");
/* Thema nach ID; die Map wird neu gebaut, sobald TOPICS ein neues Array ist (rebuildTopics) */
let TMAP = null,
  TMAP_OF = null;
function T(id) {
  if (TMAP_OF !== TOPICS) {
    TMAP = new Map(TOPICS.map(t => [t.id, t]));
    TMAP_OF = TOPICS;
  }
  return TMAP.get(id);
}
function ucFirst(s) {
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}
function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}
function todayKey(d = new Date()) {
  const z = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
}
function startOfDay(t = Date.now()) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function endOfDay(t = Date.now()) {
  const d = new Date(t);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}
function addDays(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d.getTime();
}
function fmtDate(t) {
  if (!t) return "–";
  return new Date(t).toLocaleDateString(APP.locale, { day: "numeric", month: "numeric" });
}
function relDays(t) {
  const diff = Math.round((startOfDay(t) - startOfDay()) / DAY);
  if (diff <= 0) return "heute";
  if (diff === 1) return "morgen";
  return "in " + diff + " Tagen";
}
function pct(x) {
  return x == null ? "–" : Math.round(x * 100) + " %";
}
function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function clampInt(v, a, b) {
  const n = parseInt(v, 10);
  if (isNaN(n)) return null;
  return Math.min(b, Math.max(a, n));
}
function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[.,!?;:"“”„«»()]/g, "")
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function loose(s) {
  return norm(s).replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss");
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), Math.max(2400, String(msg).length * 65));
}
/* Knöpfe ein-/ausblenden (z. B. „Prüfen“ und „Weiß ich nicht“, sobald eine Antwort ausgewertet wird) */
const CHECK_BTNS = '[data-act="check"],[data-act="dunno"]';
function showBtns(sel, on) {
  document.querySelectorAll(sel).forEach(b => (b.style.display = on ? "" : "none"));
}
function dots() {
  return '<span class="dots"><i></i><i></i><i></i></span>';
}

/* ============================================================
   ZUSTAND & SPEICHERUNG – sofort lokal + Cloud (Supabase)
   ============================================================ */
/* Fehlerprotokoll (E-1007-13): was im Alltag schiefgeht (Absturz, Ansichtsfehler, Abgleich, Laden), max. 40 Einträge
   {d, dev, w: wo, m: Meldung (gekürzt, keine Inhalte)}; im Bericht „APP-FEHLER“, damit Claude echte Probleme sieht.
   Gleiche Meldung am selben Ort höchstens einmal pro Stunde. */
function appErrLog(where, e) {
  try {
    if (!S || typeof S !== "object") return;
    const m = String((e && (e.message || e)) || "?")
      .replace(/\s+/g, " ")
      .slice(0, 160);
    const L = Array.isArray(S.appErr) ? S.appErr : [];
    if (L.some(x => x.w === where && x.m === m && Date.now() - x.d < 3600e3)) return;
    S.appErr = [{ d: Date.now(), dev: typeof devId === "function" ? devId() : "", w: where, m }, ...L].slice(0, 40);
    if (typeof saveSoon === "function") saveSoon();
  } catch (x) {}
}
function mergeAppErr(L, R) {
  const seen = new Set();
  return [...(L || []), ...(R || [])]
    .filter(x => x && (seen.has(x.d + "|" + x.m) ? false : seen.add(x.d + "|" + x.m)))
    .sort((a, b) => b.d - a.d)
    .slice(0, 40);
}
/* Nutzungszähler (E-1007-19): wie oft welche Funktion angetippt wurde, je Gerät {gerät: {aktion: n}} – damit wir
   später entscheiden können, was weg kann. Beim Abgleich je Gerät der größere Zähler. */
function usageAdd(act) {
  try {
    const d = typeof devId === "function" ? devId() : "x",
      U = (S.usage = S.usage || {}),
      u = (U[d] = U[d] || {});
    u[act] = (u[act] || 0) + 1;
  } catch (x) {}
}
function mergeUsage(L, R) {
  const M = JSON.parse(JSON.stringify(R || {}));
  for (const d in L || {}) {
    M[d] = M[d] || {};
    for (const k in L[d]) M[d][k] = Math.max(M[d][k] || 0, L[d][k] || 0);
  }
  return M;
}
function defaultState() {
  return {
    v: 1,
    app: APP.id,
    created: Date.now(),
    updated: 0,
    topics: {},
    cards: {},
    errors: [],
    reports: [],
    daily: { date: todayKey(), newCards: 0, newTopics: 0 },
    stats: { streak: 0, last: null, reviews: 0, sessions: 0 },
    settings: {
      newCardsPerDay: 10,
      maxReviews: 150,
      extraCards: 10,
      newTopicsPerDay: 2,
      ai: true,
      slow: false,
      autoplay: true,
      theme: "auto"
    },
    lastGlobal: 0,
    sinceGlobal: 0,
    active: null,
    lastBackup: 0,
    packs: [],
    aiAudit: [],
    aiStats: {},
    vhelp: [],
    genReview: [],
    own: {},
    days: {},
    practice: [],
    weak: [],
    exLog: {},
    exLogSeed: 0,
    appErr: [],
    usage: {},
    longCheck: 0,
    mixDay: "",
    genAutoDay: "",
    checkLog: [],
    mixLog: [],
    listen: {},
    exStats: {},
    activeDone: [],
    placement: defaultPlacement()
  };
}
function migrate() {
  const d = defaultState();
  for (const k in d) if (S[k] === undefined) S[k] = d[k];
  S.app = APP.id;
  S.settings = { ...d.settings, ...S.settings };
  S.stats = { ...d.stats, ...S.stats };
  S.placement = { ...defaultPlacement(), ...(S.placement || {}) };
  /* Alte Karten-IDs des Deutsch-Trainers (vor der gemeinsamen Engine): "<thema>-<i>-de" = Lernsprache → Basissprache
     (heute "<thema>-<i>"), "<thema>-<i>-en" = Gegenrichtung (heute "<thema>-<i>-r"). Der Lernstand bleibt erhalten. */
  Object.keys(S.cards).forEach(id => {
    const m = /^(.+-\d+)-(de|en)$/.exec(id);
    if (!m) return;
    const nid = m[2] === "de" ? m[1] : m[1] + "-r";
    if (!S.cards[nid]) S.cards[nid] = S.cards[id];
    delete S.cards[id];
  });
  rebuildTopics();
  TOPICS.forEach(t => {
    if (!S.topics[t.id])
      S.topics[t.id] = {
        status: "locked",
        ease: 2.5,
        interval: 0,
        reps: 0,
        lapses: 0,
        due: null,
        last: null,
        best: null,
        hist: [],
        ai: null
      };
  });
  TOPICS.forEach(t => {
    if (S.topics[t.id].status === "learning") addCards(t);
  });
  addOwnCards();
  seedDays();
  if (S.daily.date !== todayKey()) S.daily = { date: todayKey(), newCards: 0, newTopics: 0 };
  seedExLog();
  refreshUnlocks();
}
/* Einmalig: vor Einführung des Übungsprotokolls Geübtes als gesehen nachtragen (Tabelle in APP.exSeenBefore).
   Datum = letzte Themenrunde vor dem Stichtag; Übungen aus der Fehlerliste zählen als einmal falsch. Nie überschreiben. */
function seedExLog() {
  const sb = APP.exSeenBefore;
  if (S.exLogSeed || !sb || !sb.n) return;
  S.exLog = S.exLog || {};
  for (const [tid, n] of Object.entries(sb.n)) {
    const s = S.topics[tid],
      before = ((s && s.hist) || []).filter(h => h.d < sb.at);
    if (!before.length) continue;
    const d = before[before.length - 1].d,
      wrong = new Set((S.errors || []).filter(e => e.topic === tid && e.ei >= 0 && e.d < sb.at).map(e => e.ei));
    for (let i = 0; i < n; i++) {
      const k = tid + ":" + i;
      if (!S.exLog[k]) S.exLog[k] = { s: d, n: 1, w: wrong.has(i) ? 1 : 0 };
    }
  }
  S.exLogSeed = 1;
}
function hasProgress(x) {
  return !!(x && ((x.stats && x.stats.sessions) || Object.keys(x.cards || {}).length || placementCount(x)));
}

/* --- Gerätekonfiguration: bleibt nur auf diesem Gerät, wird nie synchronisiert --- */
const CFG_KEY = APP.id + "-config";
function loadCfg() {
  try {
    return JSON.parse(localStorage.getItem(CFG_KEY)) || {};
  } catch (e) {
    return {};
  }
}
let CFG = loadCfg();
function saveCfg() {
  try {
    localStorage.setItem(CFG_KEY, JSON.stringify(CFG));
  } catch (e) {}
}
const cloudOn = () => !!(CFG.sbUrl && CFG.sbKey && CFG.session && CFG.session.refresh_token);
const uid = () => CFG.session.user.id;

/* --- Lokal: wird bei JEDER Änderung sofort geschrieben --- */
let DIRTY = false,
  PUSH_TIMER = null;
function setSync(st) {
  const el = $("#sync");
  if (!el) return;
  el.classList.toggle("err", st === "err");
  el.textContent =
    {
      ok: "Synchronisiert ✓",
      saving: "Speichert …",
      offline: "Offline · lokal gesichert",
      local: "Lokal gespeichert",
      err: "Sync-Fehler · lokal gesichert",
      login: "Bitte neu anmelden",
      load: "Lädt …"
    }[st] || st;
}
function writeLocal() {
  const txt = JSON.stringify(S);
  try {
    localStorage.setItem(KEY, txt);
  } catch (e) {
    if (e && e.name === "SecurityError") return; /* Speicher gesperrt (Hinweis kam schon beim Start), nicht „voll“ */
    /* Speicher voll: zuerst defekte Kopien und Sicherheitskopien opfern, die Rückgängig-Kopie vom Löschen zuletzt –
       der aktuelle Stand geht vor (E-1007-68) */
    appErrLog("Gerätespeicher", "voll – Sicherheitskopien werden entfernt");
    const keys = Object.keys(localStorage),
      drop = f => keys.filter(f).forEach(k => localStorage.removeItem(k));
    for (const f of [
      k => k.startsWith(KEY + "-defekt-"),
      k => k.startsWith(KEY + "-vor-") && !k.endsWith("-vor-loeschen"),
      k => k.endsWith("-vor-loeschen")
    ]) {
      try {
        drop(f);
        localStorage.setItem(KEY, txt);
        return;
      } catch (e2) {}
    }
    toast("Gerätespeicher voll – bitte Sicherung herunterladen");
  }
}
/* Sicherheitskopie (z. B. "-vor-sync"); darf nie einen Fehler auslösen */
function safeCopy(name, obj) {
  try {
    localStorage.setItem(KEY + name, JSON.stringify(obj));
  } catch (e) {
    appErrLog("Sicherheitskopie " + name, e);
  }
}
function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch (e) {
    return null;
  }
}
function save() {
  S.updated = Date.now();
  /* geänderte Einstellungen merken – beim Abgleich gewinnt die neuere Fassung (E-1007-67) */
  const st = JSON.stringify(S.settings || {});
  if (SETTINGS_SNAP && st !== SETTINGS_SNAP) S.settingsAt = Date.now();
  SETTINGS_SNAP = st;
  writeLocal();
  DIRTY = true;
  autoFileBackup();
  if (!cloudOn()) {
    setSync("local");
    return;
  }
  setSync("saving");
  clearTimeout(PUSH_TIMER);
  /* während einer Runde seltener hochladen (der ganze Stand je Antwort war zu viel); beim Verlassen/Rundenende sofort */
  PUSH_TIMER = setTimeout(() => pushCloud(), SESSION ? 30000 : 1200);
}

/* --- Supabase (direkt über REST, ohne Zusatzbibliothek) --- */
const sbBase = () => CFG.sbUrl.replace(/\/+$/, "");
const SB_TIMEOUT = window.OPI_SB_TIMEOUT || 25000;
/* fetch mit Zeitlimit: ein hängender Request darf den Sync nie dauerhaft blockieren */
async function fetchSB(url, opt) {
  const c = new AbortController(),
    tm = setTimeout(() => c.abort(), SB_TIMEOUT);
  try {
    const res = await fetch(url, { ...opt, signal: c.signal });
    const text = await res.text();
    return { res, text };
  } finally {
    clearTimeout(tm);
  }
}
async function authCall(kind, body) {
  const { res, text } = await fetchSB(sbBase() + "/auth/v1/" + kind, {
    method: "POST",
    headers: { apikey: CFG.sbKey, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  let j = {};
  try {
    j = JSON.parse(text);
  } catch (e) {}
  if (!res.ok) {
    const e = new Error(j.error_description || j.msg || j.message || j.error || "HTTP " + res.status);
    e.status = res.status;
    throw e;
  }
  return j;
}
function setSession(j) {
  const old = CFG.session || {};
  CFG.session = {
    access_token: j.access_token,
    refresh_token: j.refresh_token,
    expires_at: Date.now() + (j.expires_in || 3600) * 1000,
    user: {
      id: (j.user && j.user.id) || (old.user && old.user.id),
      email: (j.user && j.user.email) || (old.user && old.user.email)
    }
  };
  saveCfg();
}
let REFRESHING = null;
async function ensureToken(force) {
  if (!force && CFG.session.expires_at - 60000 > Date.now()) return;
  const used = CFG.session.refresh_token;
  if (!REFRESHING)
    REFRESHING = authCall("token?grant_type=refresh_token", { refresh_token: used })
      .then(setSession)
      .catch(e => {
        if (e.status >= 400 && e.status < 500) {
          const c = loadCfg();
          if (c.session && c.session.refresh_token && c.session.refresh_token !== used) {
            CFG.session = c.session;
            return;
          }
          CFG.session = null;
          saveCfg();
          setSync("login");
          toast("Bitte unter Einstellungen → Cloud & KI neu anmelden");
        }
        throw e;
      })
      .finally(() => {
        REFRESHING = null;
      });
  await REFRESHING;
}
async function sbFetch(path, opt = {}, retried) {
  await ensureToken();
  const { res, text: t } = await fetchSB(sbBase() + path, {
    ...opt,
    headers: {
      apikey: CFG.sbKey,
      Authorization: "Bearer " + CFG.session.access_token,
      "Content-Type": "application/json",
      ...(opt.headers || {})
    }
  });
  if (res.status === 401 && !retried) {
    await ensureToken(true);
    return sbFetch(path, opt, true);
  }
  if (!res.ok) {
    const e = new Error("HTTP " + res.status);
    e.status = res.status;
    throw e;
  }
  return t ? JSON.parse(t) : null;
}
/* Hochladen nur, wenn die Cloud seit dem letzten Abgleich unverändert ist (CFG.remoteAt).
   Hat ein anderes Gerät inzwischen gespeichert, wird zuerst zusammengeführt – so überschreibt
   kein Gerät die Übungen eines anderen. */
let PUSHING = false,
  PUSH_AGAIN = false,
  NO_CAS = false;
async function pushCloud(keepalive) {
  PUSH_TIMER = null;
  if (!cloudOn() || !DIRTY) return;
  if (!navigator.onLine) {
    setSync("offline");
    return;
  }
  if (PUSHING) {
    PUSH_AGAIN = true;
    return;
  }
  PUSHING = true;
  try {
    for (let i = 0; i < 3; i++) {
      const upd = S.updated,
        base = Number.isFinite(CFG.remoteAt) ? CFG.remoteAt : Number.isFinite(CFG.syncedAt) ? CFG.syncedAt : 0;
      const body = JSON.stringify({ data: S, updated_at: new Date(upd).toISOString() });
      /* keepalive (beim Schließen) erlaubt nur ~64 KB – größere Stände normal senden */
      const ka = !!keepalive && body.length < 60000;
      if (base && !NO_CAS) {
        let rows = null;
        try {
          rows = await sbFetch(
            `/rest/v1/progress?user_id=eq.${uid()}&updated_at=eq.${encodeURIComponent(new Date(base).toISOString())}&select=user_id`,
            { method: "PATCH", keepalive: ka, headers: { Prefer: "return=representation" }, body }
          );
        } catch (e) {
          if (e.status !== 400) throw e;
          NO_CAS = true;
        }
        if (rows && rows.length) {
          pushDone(upd);
          return;
        }
        if (!NO_CAS && (SESSION || keepalive)) {
          setSync("saving");
          return;
        }
      }
      const row = await fetchRemote();
      if (!row) {
        try {
          await sbFetch("/rest/v1/progress", {
            method: "POST",
            keepalive: ka,
            headers: { Prefer: "return=minimal" },
            body: JSON.stringify({ user_id: uid(), data: S, updated_at: new Date(upd).toISOString() })
          });
          pushDone(upd);
          return;
        } catch (e) {
          if (e.status === 409) continue;
          throw e;
        }
      }
      const ru = Date.parse(row.updated_at);
      if (row.data && (row.data.updated || 0) !== (CFG.syncedAt || 0)) {
        /* Anderes Gerät hat gespeichert: zusammenführen (während einer Übung erst danach) */
        if (SESSION || keepalive || ptBusy()) {
          setSync("saving");
          return;
        }
        if (hasProgress(S)) safeCopy("-vor-sync", S);
        if (!sameApp(row.data) || !adoptState(() => mergeStates(S, row.data), "Abgleich (Zusammenführen)")) {
          setSync("err");
          return;
        }
        applyTheme();
        S.updated = Date.now();
        writeLocal();
        if (!SESSION) {
          render();
          toast("Mit anderem Gerät zusammengeführt ✓");
        }
      }
      CFG.remoteAt = ru;
      saveCfg();
      if (NO_CAS) {
        /* Ausweichweg, falls die Cloud den Vergleich ablehnt: erst prüfen/zusammenführen, dann schreiben */
        const u2 = S.updated,
          b2 = JSON.stringify({ user_id: uid(), data: S, updated_at: new Date(u2).toISOString() });
        await sbFetch("/rest/v1/progress?on_conflict=user_id", {
          method: "POST",
          keepalive: !!keepalive && b2.length < 60000,
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: b2
        });
        pushDone(u2);
        return;
      }
    }
    throw new Error("Sync-Konflikt");
  } catch (e) {
    if (cloudOn()) {
      setSync(navigator.onLine ? "err" : "offline");
      syncHint();
      if (navigator.onLine) appErrLog("Hochladen", e);
    }
  } finally {
    PUSHING = false;
    if (PUSH_AGAIN) {
      PUSH_AGAIN = false;
      if (DIRTY) setTimeout(() => pushCloud(), 50);
    }
  }
}
function pushDone(upd) {
  if (S.updated === upd) DIRTY = false;
  CFG.syncedAt = upd;
  CFG.remoteAt = upd;
  saveCfg();
  setSync(DIRTY ? "saving" : "ok");
  if (DIRTY && !PUSH_TIMER) PUSH_AGAIN = true;
  cloudSnapshot().catch(() => {});
}
let SYNC_HINTED = false;
function syncHint() {
  if (SYNC_HINTED || !navigator.onLine) return;
  SYNC_HINTED = true;
  setTimeout(
    () =>
      toast(
        "Cloud nicht erreichbar – alles ist lokal gesichert. Länger nicht gelernt? Dann in Supabase „Resume project“ tippen."
      ),
    800
  );
}
/* Täglicher Stand in der Cloud – die letzten 30 Tage bleiben erhalten */
async function cloudSnapshot() {
  const d = todayKey();
  if (CFG.lastSnapDay === d || !hasProgress(S)) return;
  await sbFetch("/rest/v1/snapshots?on_conflict=user_id,day", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ user_id: uid(), day: d, data: S })
  });
  const old = new Date();
  old.setDate(old.getDate() - 30);
  await sbFetch(`/rest/v1/snapshots?user_id=eq.${uid()}&day=lt.${todayKey(old)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" }
  });
  CFG.lastSnapDay = d;
  saveCfg();
}
/* Cloud-Zeile {data, updated_at} oder null */
async function fetchRemote() {
  const rows = await sbFetch(`/rest/v1/progress?select=data,updated_at&user_id=eq.${uid()}`);
  return rows && rows[0] && rows[0].data ? rows[0] : null;
}
/* Führt zwei Stände zusammen (für Änderungen, die offline auf zwei Geräten entstanden sind).
   Pro Thema und pro Karte gewinnt der zuletzt geübte Stand; Listen werden vereinigt. */
/* Ganzen Stand ersetzen (Sicherung einspielen, älteren Stand laden, Löschen rückgängig): erst prüfen, dann übernehmen.
   Schlägt die Prüfung fehl, bleibt der bisherige Stand. Die Merkzeichen für Löschen/Zurücksetzen bleiben bekannt, gelten
   aber nicht mehr (restored = jetzt) – sonst würde der Abgleich das Eingespielte gleich wieder entfernen. */
/* Fremden Stand sicher übernehmen (E-1007-64): erst bauen (zusammenführen) und migrieren, bei einem Fehler bleibt der
   bisherige Stand unverändert und der Fehler landet im Fehlerprotokoll (sonst wiederholte er sich bei jedem Start).
   sameApp (E-1007-66): Daten einer anderen App (Opi suomea ↔ Deutsch-Trainer) werden nie übernommen. */
let SETTINGS_SNAP = "";
function sameApp(o) {
  return !!o && typeof o === "object" && (!o.app || o.app === APP.id);
}
function adoptState(build, where) {
  const prev = S;
  try {
    const n = build();
    if (!n || typeof n !== "object" || !n.topics || typeof n.topics !== "object") throw new Error("ungültiger Stand");
    S = n;
    migrate();
    SETTINGS_SNAP = JSON.stringify(S.settings || {});
    return true;
  } catch (e) {
    S = prev;
    try {
      rebuildTopics();
    } catch (x) {}
    appErrLog(where, e);
    return false;
  }
}
function replaceState(o, copyName) {
  if (!o || typeof o !== "object" || !o.topics || typeof o.topics !== "object" || !o.cards) throw new Error("ungültig");
  if (!sameApp(o)) throw new Error("Diese Daten gehören zu einer anderen App");
  const prev = S,
    n = JSON.parse(JSON.stringify(o));
  n.wiped = n.wiped || (prev && prev.wiped);
  n.resets = { ...((prev && prev.resets) || {}), ...(n.resets || {}) };
  /* Merkzeichen, die nach dem Stand dieser Sicherung entstanden sind (bis jetzt), gelten nicht mehr – ältere schon:
     die Sicherung enthält sie bereits, ein veraltetes Gerät soll sie nicht rückgängig machen.
     restoreWins = Liste solcher Zeitfenster; restored/wipeUndone (Zahlen) bleiben für ältere App-Versionen erhalten. */
  const now = Date.now();
  n.restoreWins = [...((prev && prev.restoreWins) || []), { from: o.updated || 0, at: now }].slice(-10);
  n.restored = now;
  n.wipeUndone = now;
  S = n;
  try {
    migrate();
  } catch (e) {
    S = prev;
    rebuildTopics();
    throw e;
  }
  if (copyName && prev) safeCopy(copyName, prev);
  SETTINGS_SNAP = JSON.stringify(S.settings || {});
  applyTheme();
  save();
}
/* Zeitpunkt der letzten Runde eines Themas (0 = noch nie geübt) */
const topicAct = t => (t && t.hist && t.hist.length ? Math.max(...t.hist.map(h => h.d || 0)) : 0);
function mergeStates(L, R) {
  const M = JSON.parse(JSON.stringify(R));
  const act = topicAct;
  for (const id in L.topics || {}) {
    const lt = L.topics[id],
      rt = M.topics[id];
    if (!rt || act(lt) > act(rt) || (rt.status === "locked" && lt.status !== "locked")) M.topics[id] = lt;
    else if (lt.vocabDone && !rt.vocabDone) M.topics[id] = { ...rt, vocabDone: lt.vocabDone };
  }
  for (const id in L.cards || {}) {
    const lc = L.cards[id],
      rc = M.cards[id];
    if (!rc || (lc.last || 0) > (rc.last || 0)) M.cards[id] = lc;
  }
  const uniq = (a, k) => {
    const seen = new Set();
    return a.filter(x => {
      const kk = k(x);
      if (seen.has(kk)) return false;
      seen.add(kk);
      return true;
    });
  };
  const okKeys = new Set([...(L.errors || []), ...(M.errors || [])].filter(e => e.ok).map(e => e.d + "|" + e.q));
  M.errors = uniq([...(L.errors || []), ...(M.errors || [])], e => e.d + "|" + e.q)
    .map(e => (okKeys.has(e.d + "|" + e.q) ? { ...e, ok: 1 } : e))
    .sort((a, b) => b.d - a.d);
  M.errors = capErrors(M.errors);
  M.reports = uniq([...(L.reports || []), ...(M.reports || [])], r => r.d)
    .sort((a, b) => b.d - a.d)
    .slice(0, 10);
  {
    /* Lektionen werden nur hinten ergänzt: bei gleicher ID gewinnt das Paket mit mehr Vokabeln/Übungen */
    const size = t => ((t && t.v) || []).length + ((t && t.ex) || []).length,
      lp = new Map((L.packs || []).map(t => [t.id, t]));
    M.packs = (M.packs || []).map(t => (lp.has(t.id) && size(lp.get(t.id)) > size(t) ? lp.get(t.id) : t));
    M.packs.push(...(L.packs || []).filter(t => !M.packs.some(x => x.id === t.id)));
  }
  const ls = L.stats || {},
    ms = M.stats || {};
  M.stats = {
    ...ms,
    sessions: Math.max(ls.sessions || 0, ms.sessions || 0),
    reviews: Math.max(ls.reviews || 0, ms.reviews || 0),
    ...((ls.last || "") > (ms.last || "") ? { streak: ls.streak, last: ls.last } : {})
  };
  if (L.daily && M.daily && L.daily.date === M.daily.date)
    M.daily = {
      date: M.daily.date,
      newCards: Math.max(L.daily.newCards, M.daily.newCards),
      newTopics: Math.max(L.daily.newTopics, M.daily.newTopics),
      newRev: Math.max(L.daily.newRev || 0, M.daily.newRev || 0),
      rev: Math.max(L.daily.rev || 0, M.daily.rev || 0)
    };
  /* Verschiedene Tage: der jüngere Tagesstand gilt (sonst setzte ein Gerät von gestern den heutigen Zähler auf 0) */ else if (
    L.daily &&
    (!M.daily || (L.daily.date || "") > (M.daily.date || ""))
  )
    M.daily = { ...L.daily };
  if (L.exToday && M.exToday && L.exToday.d === M.exToday.d)
    M.exToday.k = [...new Set([...L.exToday.k, ...M.exToday.k])];
  else if (L.exToday && (!M.exToday || (L.exToday.d || "") > (M.exToday.d || "")))
    M.exToday = { ...L.exToday, k: [...(L.exToday.k || [])] };
  /* Pausierte Runde: lokale vor der aus der Cloud – aber nie eine, die ein Gerät schon beendet oder verworfen hat */
  M.activeDone = [...new Set([...(L.activeDone || []), ...(M.activeDone || [])])]
    .filter(Number.isFinite)
    .sort((a, b) => b - a)
    .slice(0, 20);
  const open = a => (a && !M.activeDone.includes(a.d) ? a : null);
  M.active = open(L.active) || open(R.active);
  M.gloss = { ...(M.gloss || {}), ...(L.gloss || {}) };
  M.own = mergeOwn(L.own, M.own);
  M.days = mergeDays(L.days, M.days);
  M.practice = mergePractice(L.practice, M.practice);
  M.weak = mergeWeak(L.weak, M.weak);
  if ((L.settingsAt || 0) > (M.settingsAt || 0)) M.settings = { ...L.settings };
  M.settingsAt = Math.max(L.settingsAt || 0, M.settingsAt || 0) || undefined;
  M.exLog = mergeExLog(L.exLog, M.exLog);
  M.exLogSeed = Math.max(L.exLogSeed || 0, M.exLogSeed || 0);
  M.appErr = mergeAppErr(L.appErr, M.appErr);
  M.usage = mergeUsage(L.usage, M.usage);
  M.longCheck = Math.max(L.longCheck || 0, M.longCheck || 0);
  const byD = (a, b, n) => {
    const seen = new Set();
    return [...(a || []), ...(b || [])]
      .filter(x => x && (seen.has(x.d) ? false : seen.add(x.d)))
      .sort((x, y) => y.d - x.d)
      .slice(0, n);
  };
  M.checkLog = byD(L.checkLog, M.checkLog, 6);
  M.mixLog = byD(L.mixLog, M.mixLog, 10);
  M.listen = { ...(M.listen || {}) };
  for (const d in L.listen || {}) {
    const a = L.listen[d],
      b = M.listen[d];
    M.listen[d] = b ? { w: a.w[0] >= b.w[0] ? a.w : b.w, s: a.s[0] >= b.s[0] ? a.s : b.s } : a;
  }
  if ((L.mixDay || "") > (M.mixDay || "")) M.mixDay = L.mixDay;
  if ((L.genAutoDay || "") > (M.genAutoDay || "")) M.genAutoDay = L.genAutoDay;
  M.exStats = mergeExStats(L.exStats, M.exStats);
  M.vhelp = uniq([...(L.vhelp || []), ...(M.vhelp || [])], x => x.d + "|" + x.topic)
    .sort((a, b) => b.d - a.d)
    .slice(0, 60);
  {
    const g = new Map();
    [...(M.genReview || []), ...(L.genReview || [])].forEach(x => {
      const o = g.get(x.id);
      g.set(x.id, o ? { ...o, res: { ...(o.res || {}), ...(x.res || {}) }, v: { ...(o.v || {}), ...(x.v || {}) } } : x);
    });
    M.genReview = genReviewCap([...g.values()]);
  }
  {
    const byId = new Map();
    [...(M.aiAudit || []), ...(L.aiAudit || [])].forEach(e => {
      const o = byId.get(e.id);
      byId.set(e.id, o ? { ...o, flag: !!(o.flag || e.flag) } : e);
    });
    M.aiAudit = auditCap([...byId.values()]);
    const tot = x => Object.values((x && x.k) || {}).reduce((s, v) => s + v.n + v.err, 0);
    M.aiStats = { ...(M.aiStats || {}) };
    for (const dv in L.aiStats || {}) if (tot(L.aiStats[dv]) >= tot(M.aiStats[dv])) M.aiStats[dv] = L.aiStats[dv];
  }
  if (L.genUnlock && L.genUnlock.on && !(M.genUnlock && M.genUnlock.on)) M.genUnlock = L.genUnlock;
  /* Runden seit der Gesamtanalyse: vom Gerät mit der jüngsten Gesamtanalyse (sonst löste ein Gerät, das sie
     verpasst hat, sofort die nächste aus) */
  const lg = L.lastGlobal || 0,
    mg = M.lastGlobal || 0;
  M.sinceGlobal =
    lg > mg ? L.sinceGlobal || 0 : lg < mg ? M.sinceGlobal || 0 : Math.max(L.sinceGlobal || 0, M.sinceGlobal || 0);
  ["lastGlobal", "lastBackup"].forEach(k => {
    M[k] = Math.max(L[k] || 0, M[k] || 0);
  });
  M.placement = mergePlacement(L.placement, M.placement, (L.updated || 0) > (R.updated || 0));
  M.created = Math.min(L.created || Date.now(), M.created || Date.now());
  applyResets(M, L, R);
  applyWipe(M, L, R);
  return M;
}
/* „Thema zurücksetzen“ (S.resets[id] = {at, voc}): Ergebnisse des Themas aus der Zeit vor dem Zurücksetzen, die ein
   anderes Gerät noch hat, werden durch den zurückgesetzten Stand ersetzt; mit voc ebenso seine Karten, ältere Fehler
   fallen weg. Wurde danach weitergelernt (neuere Runde/Karte), bleibt das. */
function applyResets(M, L, R) {
  const all = {};
  [L, R].forEach(x =>
    Object.entries(x.resets || {}).forEach(([id, r]) => {
      if (r && (!all[id] || r.at > all[id].at)) all[id] = r;
    })
  );
  const ids = Object.keys(all)
    .sort((a, b) => all[b].at - all[a].at)
    .slice(0, 50);
  M.resets = Object.fromEntries(ids.map(id => [id, all[id]]));
  const wins = restoreWins(L, R);
  M.restoreWins = wins.length ? wins : undefined;
  ids.forEach(id => {
    if (inWins(wins, all[id].at)) return; /* danach wurde ein älterer Stand bewusst eingespielt */
    const r = all[id],
      src = L.resets && L.resets[id] && L.resets[id].at === r.at ? L : R,
      a = topicAct(M.topics[id]);
    if (a > 0 && a < r.at && src.topics && src.topics[id]) M.topics[id] = JSON.parse(JSON.stringify(src.topics[id]));
    M.errors = (M.errors || []).filter(e => e.topic !== id || e.d >= r.at);
    for (const k in M.exLog || {}) if (k.startsWith(id + ":") && (M.exLog[k].s || 0) < r.at) delete M.exLog[k];
    if (M.exToday && M.exToday.d === todayKey(new Date(r.at)) && src.exToday && src.exToday.d === M.exToday.d)
      M.exToday.k = M.exToday.k.filter(k => !k.startsWith(id + ":") || src.exToday.k.includes(k));
    if (r.voc) dropOld(M, src, cid => (cardParse(cid) || {}).tid === id, r.at);
  });
}
/* Eingespielte Sicherungen als Zeitfenster (from = Stand der Sicherung, at = Zeitpunkt des Einspielens), beider Seiten
   vereinigt. Ältere Stände kennen nur Zahlen (restored, wipeUndone) – das entspricht dem Fenster (0, Zahl]. */
function restoreWins(L, R) {
  const list = [];
  [L, R].forEach(x => {
    if (!x) return;
    (Array.isArray(x.restoreWins) ? x.restoreWins : []).forEach(
      w => w && w.at && list.push({ from: w.from || 0, at: w.at })
    );
    const legacy = Math.max(typeof x.restored === "number" ? x.restored : 0, x.wipeUndone || 0);
    if (legacy && !list.some(w => w.at === legacy)) list.push({ from: 0, at: legacy });
  });
  const seen = new Set();
  return list
    .filter(w => (seen.has(w.from + ":" + w.at) ? false : seen.add(w.from + ":" + w.at)))
    .sort((a, b) => a.at - b.at)
    .slice(-10);
}
const inWins = (wins, t) => wins.some(w => t > w.from && t <= w.at);
/* Karten aus der Zeit vor `at` (für die `match` gilt) durch den Stand von src ersetzen bzw. entfernen */
function dropOld(M, src, match, at) {
  Object.keys(M.cards).forEach(cid => {
    if (!match(cid) || (M.cards[cid].last || 0) >= at) return;
    const sc = src.cards && src.cards[cid];
    if (sc) M.cards[cid] = sc;
    else delete M.cards[cid];
  });
}
/* „Fortschritt löschen“ (S.wiped = Zeitpunkt): alles aus der Zeit davor, das ein anderes Gerät noch hat, fällt weg –
   Themen, Karten, Fehler, Analysen, eigene Wörter, Lerntage, Zähler. Was danach entstanden ist, bleibt.
   „Gelöschten Stand wiederherstellen“ setzt wipeUndone; ist das neuer als das Löschen, gilt das Löschen nicht mehr. */
const wdKey = W => todayKey(new Date(W));
function applyWipe(M, L, R) {
  const W = Math.max(L.wiped || 0, R.wiped || 0);
  M.wiped = W || undefined;
  /* Zahlenfelder für ältere App-Versionen weiterführen */
  const num = k => Math.max(typeof L[k] === "number" ? L[k] : 0, typeof R[k] === "number" ? R[k] : 0) || undefined;
  M.restored = num("restored");
  M.wipeUndone = num("wipeUndone");
  if (!W || inWins(restoreWins(L, R), W)) return;
  const src = (L.wiped || 0) === W ? L : R,
    other = src === L ? R : L,
    old = d => (d || 0) < W;
  Object.keys(M.topics).forEach(id => {
    const a = topicAct(M.topics[id]);
    if (a > 0 && a < W) {
      if (src.topics && src.topics[id]) M.topics[id] = JSON.parse(JSON.stringify(src.topics[id]));
      else delete M.topics[id];
    }
  });
  /* auch Themen ohne Runde (nur Status „neu“, Wörter-Fortschritt) und Zähler vom löschenden Gerät (E-1007-69) */
  Object.keys(M.topics).forEach(id => {
    if (topicAct(M.topics[id]) === 0 && src.topics && src.topics[id])
      M.topics[id] = JSON.parse(JSON.stringify(src.topics[id]));
  });
  ["exStats", "listen"].forEach(k => (M[k] = JSON.parse(JSON.stringify(src[k] || {}))));
  dropOld(M, src, () => true, W);
  ["errors", "reports", "vhelp", "practice", "weak", "checkLog", "mixLog"].forEach(
    k => (M[k] = (M[k] || []).filter(x => !old(x.d)))
  );
  M.own = Object.fromEntries(Object.entries(M.own || {}).filter(([n, w]) => !old(w.u) || (src.own && src.own[n])));
  M.exLog = Object.fromEntries(Object.entries(M.exLog || {}).filter(([, l]) => !old(l.s)));
  if (old(M.longCheck)) M.longCheck = src.longCheck || 0;
  if ((M.mixDay || "") < wdKey(W)) M.mixDay = src.mixDay || "";
  const wd = todayKey(new Date(W));
  M.days = Object.fromEntries(Object.entries(M.days || {}).filter(([k]) => k >= wd || (src.days && src.days[k])));
  if ((other.stats && other.stats.last ? other.stats.last : "") < wd) M.stats = { ...(src.stats || M.stats) };
  if (M.active && old(M.active.d)) M.active = null;
  if (M.genUnlock && old(M.genUnlock.d) && !(src.genUnlock && src.genUnlock.on)) M.genUnlock = src.genUnlock || null;
  /* Einstufungstest (keine Zeitstempel je Antwort): wurde er auf dem anderen Gerät vor dem Löschen begonnen, gilt der
     Stand des löschenden Geräts; ein danach begonnener Test wird normal zusammengeführt */
  const op = other.placement;
  if (src.placement && op && !((op.started || 0) > W)) M.placement = JSON.parse(JSON.stringify(src.placement));
}
/* Holt den neueren Stand aus der Cloud. Rückgabe true = lokaler Stand wurde ersetzt */
async function pullCloud() {
  if (!cloudOn() || !navigator.onLine) {
    if (cloudOn()) setSync("offline");
    return false;
  }
  try {
    const row = await fetchRemote();
    if (!row) {
      if (hasProgress(S)) {
        DIRTY = true;
        pushCloud();
      } else setSync("ok");
      return false;
    }
    const remote = row.data,
      ru = Date.parse(row.updated_at);
    if ((remote.updated || 0) > (S.updated || 0) && !SESSION && !ptBusy()) {
      if (hasProgress(S)) safeCopy("-vor-sync", S);
      /* DIRTY: lokale Änderung noch nicht hochgeladen – auch wenn die Uhren der Geräte nicht gleich gehen */
      const unsynced = hasProgress(S) && (DIRTY || (S.updated || 0) > (CFG.syncedAt || 0));
      CFG.remoteAt = ru;
      saveCfg();
      if (!sameApp(remote)) {
        setSync("err");
        appErrLog("Abgleich", "Cloud-Daten gehören zu einer anderen App");
        return false;
      }
      if (unsynced) {
        if (!adoptState(() => mergeStates(S, remote), "Abgleich (Zusammenführen)")) return false;
        applyTheme();
        save();
        return true;
      }
      if (!adoptState(() => JSON.parse(JSON.stringify(remote)), "Abgleich (Übernehmen)")) return false;
      writeLocal();
      applyTheme();
      DIRTY = false;
      CFG.syncedAt = S.updated;
      saveCfg();
      setSync("ok");
      return true;
    }
    if ((remote.updated || 0) !== (S.updated || 0)) {
      DIRTY = true;
      pushCloud();
    } else {
      CFG.remoteAt = ru;
      CFG.syncedAt = S.updated;
      saveCfg();
      setSync("ok");
    }
    return false;
  } catch (e) {
    if (cloudOn()) setSync(navigator.onLine ? "err" : "offline");
    if (cloudOn() && navigator.onLine) appErrLog("Abgleich", e);
    return false;
  }
}
/* Erste Verbindung eines Geräts: nie einen echten Fortschritt überschreiben */
async function firstLink() {
  CFG.remoteAt = null;
  saveCfg();
  const row = await fetchRemote(),
    remote = row && row.data;
  if (remote && hasProgress(remote) && hasProgress(S)) {
    /* Beide haben Fortschritt (auch nur Einstufungstest): zusammenführen statt einen Stand zu ersetzen */
    safeCopy("-vor-sync", S); /* Zusammenführen verliert nichts; die Kopie bleibt für den Notfall */
    if (!sameApp(remote)) throw new Error("Diese Cloud-Daten gehören zu einer anderen App");
    if (!adoptState(() => mergeStates(S, remote), "Erste Verbindung")) throw new Error("Cloud-Stand ungültig");
    applyTheme();
    CFG.remoteAt = Date.parse(
      row.updated_at
    ); /* Hochladen vergleicht mit diesem Cloud-Stand – kein zweites Zusammenführen */
    saveCfg();
    save();
    return "merged";
  }
  if (remote && hasProgress(remote)) {
    if (!sameApp(remote)) throw new Error("Diese Cloud-Daten gehören zu einer anderen App");
    if (!adoptState(() => JSON.parse(JSON.stringify(remote)), "Erste Verbindung"))
      throw new Error("Cloud-Stand ungültig");
    writeLocal();
    applyTheme();
    DIRTY = false;
    CFG.syncedAt = S.updated;
    CFG.remoteAt = Date.parse(row.updated_at);
    saveCfg();
    setSync("ok");
    return "remote";
  }
  DIRTY = true;
  await pushCloud();
  return "local";
}
async function load() {
  /* Gesperrter Browser-Speicher (z. B. Website-Daten blockiert): App läuft trotzdem, Hinweis statt Absturz */
  let raw = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch (e) {
    setTimeout(
      () => toast("Der Browser-Speicher ist gesperrt – ohne Cloud geht der Fortschritt beim Schließen verloren"),
      1500
    );
  }
  S = readLocal();
  if (!S || typeof S !== "object" || Array.isArray(S) || typeof S.topics !== "object" || !S.topics) {
    if (raw) safeCopy("-defekt-" + Date.now(), raw); /* unlesbarer Stand: aufheben statt überschreiben */
    S = defaultState();
  }
  migrate();
  SETTINGS_SNAP = JSON.stringify(S.settings || {});
  writeLocal();
  setSync(cloudOn() ? "load" : "local");
}
/* Cloud-Abgleich nach dem Start – die App ist bis dahin schon mit dem lokalen Stand benutzbar */
async function startupPull() {
  if (!cloudOn()) return;
  if (await pullCloud()) {
    if (!SESSION) render();
    toast("Fortschritt aus der Cloud geladen ✓");
  }
}
/* Speichern beim Tippen (Einstufungstest): gebündelt nach 400 ms statt bei jedem Buchstaben den ganzen Stand zu
   schreiben; beim Verlassen der Seite wird Offenes sofort gespeichert. */
let SAVE_T = null;
function saveSoon() {
  /* sofort als geändert markieren, damit ein Abgleich in den 400 ms zusammenführt statt zu ersetzen */
  S.updated = Date.now();
  DIRTY = true;
  clearTimeout(SAVE_T);
  SAVE_T = setTimeout(() => {
    SAVE_T = null;
    save();
  }, 400);
}
function flushSave() {
  if (!SAVE_T) return;
  clearTimeout(SAVE_T);
  SAVE_T = null;
  save();
}
let SHOWN_DAY = todayKey();
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "hidden") {
    flushSave();
    if (DIRTY && cloudOn()) {
      clearTimeout(PUSH_TIMER);
      pushCloud(true);
    }
    return;
  }
  if (SESSION) return;
  const day = todayKey(),
    newDay = day !== SHOWN_DAY;
  SHOWN_DAY = day;
  if (await pullCloud()) {
    render();
    toast("Mit anderem Gerät synchronisiert ✓");
  } else if (newDay && !SESSION) render(); /* über Nacht offen gelassen: Heute zeigt den neuen Tag */
});
window.addEventListener("pagehide", () => {
  flushSave();
  if (DIRTY && cloudOn()) {
    clearTimeout(PUSH_TIMER);
    pushCloud(true);
  }
});
/* Zweiter Tab/Fenster derselben App: neueren Stand des anderen Tabs zusammenführen (jede Änderung wird
   ohnehin sofort gespeichert – ein alter, vergessener Tab darf den neueren Stand nie überschreiben). */
window.addEventListener("storage", e => {
  if (!S) return;
  if (e.key === CFG_KEY) {
    CFG = loadCfg();
    return;
  }
  if (e.key !== KEY || !e.newValue) return;
  let o;
  try {
    o = JSON.parse(e.newValue);
  } catch (x) {
    return;
  }
  if (!o || typeof o.topics !== "object" || (o.updated || 0) <= (S.updated || 0) || !sameApp(o)) return;
  if (!adoptState(() => mergeStates(S, o), "Zweiter Tab")) return;
  S.updated = o.updated;
  writeLocal();
  DICT = null;
  if (!SESSION) {
    applyTheme();
    render();
  }
});
window.addEventListener("online", () => {
  if (DIRTY) pushCloud();
  else pullCloud();
});
window.addEventListener("offline", () => {
  if (cloudOn()) setSync("offline");
});
setInterval(() => {
  if (DIRTY && cloudOn() && !PUSH_TIMER) pushCloud();
}, 60000);
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

/* --- Automatische Sicherungsdatei am PC (Chrome / Edge) --- */
const HAS_FSA = "showSaveFilePicker" in window;
let FILE_HANDLE = null,
  FILE_TIMER = null,
  NEED_FILE_PERM = false;
function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(APP.id, 1);
    r.onupgradeneeded = () => r.result.createObjectStore("kv");
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbGet(k) {
  const db = await idb();
  return new Promise(res => {
    const q = db.transaction("kv").objectStore("kv").get(k);
    q.onsuccess = () => res(q.result);
    q.onerror = () => res(null);
  });
}
async function idbSet(k, v) {
  const db = await idb();
  return new Promise(res => {
    const tx = db.transaction("kv", "readwrite");
    tx.objectStore("kv").put(v, k);
    tx.oncomplete = () => res(true);
    tx.onerror = () => res(false);
  });
}
async function setupAutoFile(change) {
  try {
    const opts = {
      suggestedName: (change && CFG.autoFileName) || APP.id + "-sicherung.json",
      types: [{ description: APP.name + "-Sicherung", accept: { "application/json": [".json"] } }]
    };
    if (change && FILE_HANDLE) opts.startIn = FILE_HANDLE;
    const h = await window.showSaveFilePicker(opts);
    FILE_HANDLE = h;
    NEED_FILE_PERM = false;
    await idbSet("fileHandle", FILE_HANDLE);
    CFG.autoFile = true;
    CFG.autoFileName = h.name;
    saveCfg();
    await writeAutoFile(true);
    toast(
      (change ? "Neuer Speicherort gewählt" : "Sicherungsdatei eingerichtet") +
        " – wird nach jeder Änderung überschrieben ✓"
    );
    render();
  } catch (e) {}
}
async function stopAutoFile() {
  clearTimeout(FILE_TIMER);
  FILE_HANDLE = null;
  NEED_FILE_PERM = false;
  await idbSet("fileHandle", null);
  CFG.autoFile = false;
  CFG.autoFileName = "";
  CFG.lastFileWrite = 0;
  saveCfg();
  toast("Automatische Sicherung ausgeschaltet – die bisherige Datei bleibt erhalten");
  render();
}
async function writeAutoFile(interactive) {
  if (!CFG.autoFile) return;
  try {
    if (!FILE_HANDLE) FILE_HANDLE = await idbGet("fileHandle");
    if (!FILE_HANDLE) return;
    let p = await FILE_HANDLE.queryPermission({ mode: "readwrite" });
    if (p !== "granted" && interactive) p = await FILE_HANDLE.requestPermission({ mode: "readwrite" });
    if (p !== "granted") {
      NEED_FILE_PERM = true;
      return;
    }
    NEED_FILE_PERM = false;
    const w = await FILE_HANDLE.createWritable();
    await w.write(JSON.stringify(S));
    await w.close();
    CFG.lastFileWrite = Date.now();
    saveCfg();
  } catch (e) {}
}
function autoFileBackup() {
  if (!CFG.autoFile) return;
  clearTimeout(FILE_TIMER);
  FILE_TIMER = setTimeout(() => writeAutoFile(false), 3000);
}
