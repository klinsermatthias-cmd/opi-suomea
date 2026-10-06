/* Opi suomea – daten.js: Grundlagen, Zustand S, Speichern, Cloud-Sync (Supabase), Zusammenführen, Sicherungsdatei am PC.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
/* ============================================================
   GRUNDLAGEN
   ============================================================ */
let TOPICS = BASE_TOPICS.slice();
function rebuildTopics() {
  TOPICS = BASE_TOPICS.concat((S.packs || []).filter(t => !BASE_TOPICS.some(b => b.id === t.id)));
}
const KEY = "opi-suomea-v1";
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
const T = id => TOPICS.find(t => t.id === id);
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
  return new Date(t).toLocaleDateString("de-AT", { day: "numeric", month: "numeric" });
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
  return norm(s).replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u");
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), Math.max(2400, String(msg).length * 65));
}
function dots() {
  return '<span class="dots"><i></i><i></i><i></i></span>';
}

/* ============================================================
   ZUSTAND & SPEICHERUNG – sofort lokal + Cloud (Supabase)
   ============================================================ */
function defaultState() {
  return {
    v: 1,
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
    vhelp: []
  };
}
function migrate() {
  const d = defaultState();
  for (const k in d) if (S[k] === undefined) S[k] = d[k];
  S.settings = { ...d.settings, ...S.settings };
  S.stats = { ...d.stats, ...S.stats };
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
  if (S.daily.date !== todayKey()) S.daily = { date: todayKey(), newCards: 0, newTopics: 0 };
  refreshUnlocks();
}
function hasProgress(x) {
  return !!(x && ((x.stats && x.stats.sessions) || Object.keys(x.cards || {}).length));
}

/* --- Gerätekonfiguration: bleibt nur auf diesem Gerät, wird nie synchronisiert --- */
const CFG_KEY = "opi-suomea-config";
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
    /* Speicher voll: ältere Sicherheitskopien opfern, der aktuelle Stand geht vor */
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(KEY + "-vor-"))
        .forEach(k => localStorage.removeItem(k));
      localStorage.setItem(KEY, txt);
    } catch (e2) {
      toast("Gerätespeicher voll – bitte Sicherung herunterladen");
    }
  }
}
/* Sicherheitskopie (z. B. "-vor-sync"); darf nie einen Fehler auslösen */
function safeCopy(name, obj) {
  try {
    localStorage.setItem(KEY + name, JSON.stringify(obj));
  } catch (e) {}
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
  writeLocal();
  DIRTY = true;
  autoFileBackup();
  if (!cloudOn()) {
    setSync("local");
    return;
  }
  setSync("saving");
  clearTimeout(PUSH_TIMER);
  PUSH_TIMER = setTimeout(() => pushCloud(), 1200);
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
        if (SESSION || keepalive) {
          setSync("saving");
          return;
        }
        if (hasProgress(S)) safeCopy("-vor-sync", S);
        S = mergeStates(S, row.data);
        migrate();
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
function mergeStates(L, R) {
  const M = JSON.parse(JSON.stringify(R));
  const act = t => (t && t.hist && t.hist.length ? Math.max(...t.hist.map(h => h.d || 0)) : 0);
  for (const id in L.topics || {}) {
    const lt = L.topics[id],
      rt = M.topics[id];
    if (!rt || act(lt) > act(rt) || (rt.status === "locked" && lt.status !== "locked")) M.topics[id] = lt;
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
    .sort((a, b) => b.d - a.d)
    .slice(0, 80);
  M.reports = uniq([...(L.reports || []), ...(M.reports || [])], r => r.d)
    .sort((a, b) => b.d - a.d)
    .slice(0, 10);
  M.packs = [...(M.packs || []), ...(L.packs || []).filter(t => !(M.packs || []).some(x => x.id === t.id))];
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
      newRev: Math.max(L.daily.newRev || 0, M.daily.newRev || 0)
    };
  if (L.exToday && M.exToday && L.exToday.d === M.exToday.d)
    M.exToday.k = [...new Set([...L.exToday.k, ...M.exToday.k])];
  if (L.active) M.active = L.active;
  M.gloss = { ...(M.gloss || {}), ...(L.gloss || {}) };
  M.vhelp = uniq([...(L.vhelp || []), ...(M.vhelp || [])], x => x.d + "|" + x.topic)
    .sort((a, b) => b.d - a.d)
    .slice(0, 60);
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
  ["lastGlobal", "sinceGlobal", "lastBackup"].forEach(k => {
    M[k] = Math.max(L[k] || 0, M[k] || 0);
  });
  M.created = Math.min(L.created || Date.now(), M.created || Date.now());
  return M;
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
    if ((remote.updated || 0) > (S.updated || 0) && !SESSION) {
      if (hasProgress(S)) safeCopy("-vor-sync", S);
      const unsynced = hasProgress(S) && (S.updated || 0) > (CFG.syncedAt || 0);
      CFG.remoteAt = ru;
      saveCfg();
      if (unsynced) {
        S = mergeStates(S, remote);
        migrate();
        applyTheme();
        save();
        return true;
      }
      S = remote;
      migrate();
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
    return false;
  }
}
/* Erste Verbindung eines Geräts: nie einen echten Fortschritt überschreiben */
async function firstLink() {
  CFG.remoteAt = null;
  saveCfg();
  const row = await fetchRemote(),
    remote = row && row.data;
  const score = x => (x ? ((x.stats && x.stats.sessions) || 0) * 10 + ((x.stats && x.stats.reviews) || 0) : 0);
  if (remote && hasProgress(remote) && score(remote) >= score(S)) {
    if (hasProgress(S)) {
      safeCopy("-vor-sync", S);
      dl(JSON.stringify(S), "opi-suomea-geraet-vorher.json", "application/json");
    }
    S = remote;
    migrate();
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
  const raw = localStorage.getItem(KEY);
  S = readLocal();
  if (!S || typeof S !== "object" || Array.isArray(S) || typeof S.topics !== "object" || !S.topics) {
    if (raw) safeCopy("-defekt-" + Date.now(), raw); /* unlesbarer Stand: aufheben statt überschreiben */
    S = defaultState();
  }
  migrate();
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
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "hidden") {
    if (DIRTY && cloudOn()) {
      clearTimeout(PUSH_TIMER);
      pushCloud(true);
    }
    return;
  }
  if (SESSION) return;
  if (await pullCloud()) {
    render();
    toast("Mit anderem Gerät synchronisiert ✓");
  }
});
window.addEventListener("pagehide", () => {
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
  if (!o || typeof o.topics !== "object" || (o.updated || 0) <= (S.updated || 0)) return;
  S = mergeStates(S, o);
  S.updated = o.updated;
  migrate();
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
    const r = indexedDB.open("opi-suomea", 1);
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
      suggestedName: (change && CFG.autoFileName) || "opi-suomea-sicherung.json",
      types: [{ description: "Opi-suomea-Sicherung", accept: { "application/json": [".json"] } }]
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
