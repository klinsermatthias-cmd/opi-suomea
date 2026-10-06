/* Opi suomea – start.js: Ereignisse (Klicks, Eingaben), Rettungsansicht, Start der App. Wird zuletzt geladen.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
/* ============================================================
   EVENTS
   ============================================================ */
const A = {
  say: t => speak(t),
  theme: k => {
    S.settings.theme = k;
    applyTheme();
    save();
    render();
  },
  setup: () => {
    SESSION = null;
    CUR = { tab: "setup", arg: null };
    render();
    scrollTo(0, 0);
  },
  setupdone: () => {
    CFG.setupDone = true;
    saveCfg();
    CUR = { tab: "today", arg: null };
    render();
    scrollTo(0, 0);
  },
  login: () => doAuth("login"),
  signup: () => doAuth("signup"),
  logout: (id, b) => {
    if (!b.dataset.sure) {
      b.dataset.sure = "1";
      b.textContent = "Wirklich abmelden?";
      return;
    }
    CFG.session = null;
    saveCfg();
    setSync("local");
    render();
  },
  aisave: () => aiSave(),
  gloss: (w, el) => {
    if (el.classList.contains("on")) {
      closeGloss();
      return;
    }
    showGloss(w, el);
  },
  aidiag: () => {
    if (!$("#aidiagbox")) {
      SESSION = null;
      CUR = { tab: "progress", arg: null };
      render();
    }
    const b = $("#aidiagbox");
    b.scrollIntoView({ behavior: "smooth", block: "center" });
    aiDiagnose();
  },
  snaps: () => listSnaps(),
  loadsnap: (day, b) => loadSnap(day, b),
  autofile: () => setupAutoFile(false),
  resettopic: id => {
    $("#topresetbox").innerHTML =
      `<p>Zur Bestätigung <b>ZURÜCKSETZEN</b> eintippen. Vorher wird automatisch eine Sicherungsdatei gespeichert.</p><input id="topconf" class="inp" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ZURÜCKSETZEN"><div class="btnrow"><button class="btn ghost" data-act="topresetno">Abbrechen</button><button class="btn danger" id="topgo" data-act="topresetgo" data-id="${id}" disabled>Thema zurücksetzen</button></div>`;
    $("#topconf").focus();
  },
  topresetgo: id => doResetTopic(id),
  topresetno: () => render(),
  autofilechange: () => setupAutoFile(true),
  autofileoff: (id, b) => {
    if (!b.dataset.sure) {
      b.dataset.sure = "1";
      b.textContent = "Wirklich aus?";
      return;
    }
    stopAutoFile();
  },
  fileperm: () => writeAutoFile(true).then(() => render()),
  offline: () => downloadOffline(),
  resume: () => openSession(),
  // „Pause“: die Runde bleibt in S.active gespeichert und kann später (auch auf dem anderen Gerät) fortgesetzt werden
  abort: () => {
    const id = SESSION && SESSION.id;
    save();
    SESSION = null;
    CUR = id && T(id) ? { tab: "topics", arg: id } : { tab: "today", arg: null };
    render();
  },
  discard: () => {
    S.active = null;
    save();
    render();
  },
  startanyway: () => {
    const f = PENDING_START;
    PENDING_START = null;
    S.active = null;
    save();
    if (f) f();
    else render();
  },
  download: () => downloadBackup(),
  sharebackup: () => shareBackup(),
  backuplater: () => {
    CFG.backupSnooze = Date.now() + DAY;
    saveCfg();
    render();
  },
  listen: () => startListen(),
  listens: () => startListenS(),
  lscheck: () => checkListenS(false),
  lsreveal: () => checkListenS(true),
  lsnext: () => {
    SESSION.idx++;
    renderListenS();
  },
  errtrain: guardActive(() => startErrors()),
  gen: guardActive((id, b) => startGen(id, b)),
  lcheck: () => checkListen(),
  lnext: () => {
    SESSION.idx++;
    renderListen();
  },
  toggleauto: () => {
    S.settings.autoplay = !S.settings.autoplay;
    save();
    render();
  },
  toggleslow: () => {
    S.settings.slow = !S.settings.slow;
    save();
    render();
  },
  tab: id => {
    SESSION = null;
    CUR = { tab: id, arg: null };
    render();
    scrollTo(0, 0);
  },
  topic: id => {
    SESSION = null;
    CUR = { tab: "topics", arg: id };
    render();
    scrollTo(0, 0);
  },
  back: () => {
    CUR.arg = null;
    render();
  },
  learn: guardActive(id => startSession(id, "learn")),
  tvocab: id => startTopicVocab(id),
  reportnow: () => {
    SESSION = null;
    CUR = { tab: "progress", arg: null };
    render();
    A.report();
    const o = $("#out");
    if (o) o.scrollIntoView({ behavior: "smooth", block: "center" });
  },
  tvskip: id => {
    S.topics[id].vocabDone = "skip";
    save();
    render();
  },
  review: guardActive(id => startSession(id, "review")),
  unlock: guardActive(id => startSession(id, "unlock")),
  extra: guardActive(id => startSession(id, "extra")),
  mc: i => answerMC(+i),
  check: () => checkAnswer(),
  dunno: () => dunno(),
  next: () => nextEx(),
  pick: i => {
    if (SESSION.locked) return;
    SESSION.cur.picked.push(+i);
    renderOrd();
  },
  unpick: i => {
    if (SESSION.locked) return;
    SESSION.cur.picked.splice(+i, 1);
    renderOrd();
  },
  rate: k => rateTopic(k),
  vhint: () => showVocabHint(),
  askex: () => {
    const b = $("#askex");
    if (!b) return;
    b.innerHTML = `<div style="display:flex;gap:8px;margin-top:10px"><input id="askexq" class="inp" placeholder="Deine Frage zu dieser Aufgabe …" autocomplete="off"><button class="btn sm" data-act="askexgo">Fragen</button></div><div id="askexres"></div>`;
    $("#askexq").focus();
  },
  askexgo: () => askExercise(),
  aiflag: (id, b) => {
    const e = (S.aiAudit || []).find(x => x.id === id);
    if (!e) {
      toast("Eintrag nicht mehr vorhanden");
      return;
    }
    e.flag = !e.flag;
    S.aiAudit = auditCap(S.aiAudit);
    save();
    b.textContent = e.flag
      ? "✓ markiert – Claude prüft das beim nächsten Bericht (nochmal tippen = zurücknehmen)"
      : "KI lag falsch?";
    if (e.flag) toast("Markiert – Claude schaut sich das an");
  },
  vocab: () => startVocab(),
  extravocab: () => startExtraVocab(),
  flip: () => flipCard(),
  crate: k => rateCard(k),
  cundo: () => undoCard(),
  global: () => runGlobal(false),
  ask: id => askTeacher(id),
  report: () => showOut("#out", buildReport(), "Bericht – kopieren und im Chat einfügen"),
  export: () => {
    S.lastBackup = Date.now();
    save();
    showOut("#out2", JSON.stringify(S), "Backup – in einer Notiz oder Datei sicher aufbewahren");
  },
  copy: () => copyOut(),
  importpack: () => importPack($("#packta").value),
  pasteimport: () => {
    CUR = { tab: "progress", arg: null };
    render();
    A.importopen();
    $("#out2").scrollIntoView({ behavior: "smooth" });
  },
  importopen: () => {
    $("#out2").innerHTML =
      `<p style="margin-top:14px"><b>Backup einfügen</b></p><input type="file" id="impfile" accept=".json,application/json" class="inp" style="margin-bottom:8px"><textarea class="out" id="impta" placeholder="… oder Backup-Text hier einfügen"></textarea><div class="btnrow"><button class="btn sm" data-act="importdo">Einspielen</button></div>`;
  },
  importdo: () => importText($("#impta").value),
  toggleai: () => {
    S.settings.ai = !S.settings.ai;
    save();
    render();
  },
  rescuedl: () => {
    const all = {};
    Object.keys(localStorage)
      .filter(k => k.startsWith(KEY))
      .forEach(k => (all[k] = localStorage.getItem(k)));
    dl(JSON.stringify(all), APP.id + "-rohdaten-" + todayKey() + ".json", "application/json");
  },
  reload: () => location.reload(),
  reset: () => {
    const lt = TOPICS.filter(t => S.topics[t.id].status === "learning").length,
      lw = learnedWords();
    $("#delbox").innerHTML =
      `<div class="card" style="border:2px solid var(--puolukka);margin-top:12px"><b style="color:var(--puolukka)">Wirklich alles löschen?</b><p>Das löscht <b>alles</b> auf <b>allen Geräten</b>: ${lt} gelernte ${lt === 1 ? "Thema" : "Themen"}, ${lw} Vokabeln, ${streakNow()} ${streakNow() === 1 ? "Tag" : "Tage"} Lernserie, deinen Verlauf und ${APP.teacher}s Analysen. Vorher wird automatisch eine Sicherungsdatei gespeichert.</p><p>Tippe zur Bestätigung <b>LÖSCHEN</b> ein.</p><input id="delconf" class="inp" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="LÖSCHEN"><div class="btnrow"><button class="btn ghost" data-act="resetno">Abbrechen</button><button class="btn danger" id="delgo" data-act="resetgo" disabled>Endgültig löschen</button></div></div>`;
    $("#delconf").focus();
  },
  resetgo: () => doDeleteAll(),
  resetno: () => render(),
  undodelete: () => undoDelete()
};
/* Fehler in einer Ansicht: Hinweis mit Rückweg statt leerer/kaputter Seite. Daten sind sofort gespeichert,
   eine unterbrochene Übung bleibt in S.active und kann fortgesetzt werden. */
function showViewError(e) {
  console.error(e);
  SESSION = null;
  app().innerHTML = `<div class="card"><div class="label">Fehler in dieser Ansicht</div><p>Hier ist etwas schiefgelaufen. Deine Daten sind gespeichert.</p><p class="muted">${esc(e && (e.message || e))}</p><div class="btnrow"><button class="btn" data-act="tab" data-id="today">Zu Heute</button><button class="btn ghost" data-act="rescuedl">Rohdaten sichern</button></div></div>`;
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]");
  if (!b || b.disabled) return;
  const f = A[b.dataset.act];
  if (!f) return;
  e.preventDefault();
  try {
    const r = f(b.dataset.id, b);
    if (r && typeof r.catch === "function")
      r.catch(err => {
        console.error(err);
        toast("Fehler: " + ((err && err.message) || err) + " – deine Daten sind gespeichert");
      });
  } catch (err) {
    showViewError(err);
  }
});
document.addEventListener("input", e => {
  if (e.target.id === "delconf" && $("#delgo")) $("#delgo").disabled = !confirmOk(e.target.value, "LÖSCHEN");
  if (e.target.id === "topconf" && $("#topgo")) $("#topgo").disabled = !confirmOk(e.target.value, "ZURÜCKSETZEN");
});
document.addEventListener("change", e => {
  if (e.target.id === "newper") {
    S.settings.newCardsPerDay = +e.target.value;
    save();
  }
  if (e.target.id === "extranum") {
    S.settings.extraCards = +e.target.value;
    save();
  }
  if (e.target.id === "newtop") {
    S.settings.newTopicsPerDay = +e.target.value;
    save();
  }
  if (e.target.id === "impfile" && e.target.files[0]) {
    const fr = new FileReader();
    fr.onload = () => importText(fr.result);
    fr.readAsText(e.target.files[0]);
  }
});
document.addEventListener("keydown", e => {
  if (e.key !== "Enter" || !SESSION) return;
  if (e.target.id === "askq" || e.target.id === "askexq") return;
  if (SESSION.kind === "topic") {
    e.preventDefault();
    if (!SESSION.locked && e.target.classList && e.target.classList.contains("tcell")) {
      const cs = [...document.querySelectorAll(".tcell")],
        i = cs.indexOf(e.target);
      const nx = cs.slice(i + 1).find(c => !c.value.trim()) || cs.slice(i + 1)[0];
      if (nx) {
        nx.focus();
        return;
      }
    }
    if (!SESSION.locked) checkAnswer();
    else if ($("#nextbtn")) nextEx();
  } else if (SESSION.kind === "vocab" && !SESSION.shown) {
    e.preventDefault();
    flipCard();
  } else if (SESSION.kind === "listen") {
    e.preventDefault();
    if (!SESSION.shown) checkListen();
    else {
      SESSION.idx++;
      renderListen();
    }
  } else if (SESSION.kind === "listenS") {
    e.preventDefault();
    if (!SESSION.shown) checkListenS(false);
    else if ($("#nextbtn")) {
      SESSION.idx++;
      renderListenS();
    }
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.id === "askexq") {
    e.preventDefault();
    askExercise();
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.id === "askq") {
    e.preventDefault();
    const b = document.querySelector('[data-act="ask"]');
    if (b) askTeacher(b.dataset.id);
  }
});

/* ============================================================
   LANDSCHAFT IM KOPF & START
   ============================================================ */
/* Kopf, Titel und Tabs aus den App-Einstellungen (js/app.js) */
function landscape() {
  document.title = APP.name;
  const tc = document.getElementById("themecolor");
  if (tc) tc.setAttribute("content", APP.color);
  $("#brandlogo").innerHTML = APP.logo;
  $("#brandname").textContent = APP.name;
  $("#brandtag").textContent = APP.tagline;
  ["today", "topics", "vocab", "progress"].forEach((id, i) => {
    const b = document.getElementById("tab-" + id);
    if (b) {
      b.querySelector("b").textContent = APP.tabs[i][0];
      b.querySelector("small").textContent = APP.tabs[i][1];
    }
  });
  APP.landscape($("#landscape"));
}
/* Nachtmodus */
const DARK_MQ = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
function applyTheme() {
  const t = S ? S.settings.theme : "auto";
  const dark = t === "dark" || (t === "auto" && DARK_MQ && DARK_MQ.matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}
if (DARK_MQ && DARK_MQ.addEventListener) DARK_MQ.addEventListener("change", applyTheme);
applyTheme();
/* Neue Version: Die Veröffentlichung legt version.json (Commit-Kennung) ab. Weicht sie vom Stand beim Start ab,
   erscheint ein Hinweis zum Neuladen. Eine laufende Übung bleibt dabei gespeichert (S.active). */
let APP_VERSION = null;
async function checkVersion() {
  try {
    const r = await fetch("version.json", { cache: "no-store" });
    if (!r.ok) return;
    const v = (await r.json()).v;
    if (!v) return;
    if (!APP_VERSION) APP_VERSION = v;
    else if (v !== APP_VERSION) showUpdate();
  } catch (e) {}
}
function showUpdate() {
  if (document.getElementById("update")) return;
  const d = document.createElement("div");
  d.id = "update";
  d.innerHTML = `<span>Neue Version verfügbar</span><button class="btn sm" data-act="reload">Jetzt neu laden</button>`;
  document.body.appendChild(d);
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") checkVersion();
});
/* Rettung: falls beim Start etwas schiefgeht, nie eine weiße Seite – Rohdaten sichern können */
function rescue(e) {
  const el = app();
  if (!el) return;
  el.innerHTML = `<div class="card"><div class="label">Die App konnte nicht starten</div><p>Deine Daten sind noch auf diesem Gerät${cloudOn() ? " und in der Cloud" : ""}. Bitte sichere zuerst die Rohdaten und schick Claude die Fehlermeldung.</p><p class="muted">${esc(e && (e.message || e))}</p><div class="btnrow"><button class="btn" data-act="rescuedl">Rohdaten sichern</button><button class="btn ghost" data-act="reload">Neu laden</button></div></div>`;
}
let ERR_SHOWN = 0;
window.addEventListener("error", e => {
  if (Date.now() - ERR_SHOWN < 10000) return;
  ERR_SHOWN = Date.now();
  if (!app().innerHTML.trim()) rescue(e.error || e.message);
  else toast("Unerwarteter Fehler – deine Daten sind gespeichert. Bitte App neu laden.");
});
(async function init() {
  try {
    landscape();
    await load();
    applyTheme();
    render();
  } catch (e) {
    console.error(e);
    rescue(e);
    return;
  }
  startupPull();
  checkVersion();
  setInterval(checkVersion, 15 * 60000);
  if (CFG.autoFile) writeAutoFile(false);
  loadRepoLessons().then(loadGenVerdicts);
  if ("serviceWorker" in navigator && location.protocol === "https:")
    navigator.serviceWorker.register("sw.js").catch(() => {});
})();
