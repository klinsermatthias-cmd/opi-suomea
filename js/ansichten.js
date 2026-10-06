/* Opi suomea – ansichten.js: Ansichten: Einrichtung, Heute, Themenliste, Themenseite, Freischaltung/Voraussetzungen.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
/* ============================================================
   ANSICHTEN
   ============================================================ */
function setTab(tab) {
  ["today", "topics", "vocab", "progress"].forEach(k => $("#tab-" + k).classList.toggle("on", k === tab));
}
/* ---------- Einrichtung (pro Gerät) ---------- */
function renderSetup() {
  const a = CFG.ai || {};
  let h = `<p class="ftitle">${esc(UI.welcome)}</p><h2 style="margin-top:6px">Einrichtung</h2><p class="muted">Einmal pro Gerät. Schlüssel und Passwort bleiben nur auf diesem Gerät.</p>`;
  h += `<div class="card"><div class="label">1 · Cloud-Speicher (Supabase)</div>`;
  if (cloudOn())
    h += `<p>Angemeldet als <b>${esc(CFG.session.user.email || "")}</b>. Jede Antwort wird sofort gespeichert und mit deinen anderen Geräten abgeglichen.</p><div class="btnrow"><button class="btn ghost" data-act="logout">Abmelden</button></div>`;
  else
    h += `<p class="muted">Project URL und anon public key findest du in Supabase unter <i>Project Settings → API</i>. Auf dem ersten Gerät „Neu registrieren“, auf allen weiteren „Anmelden“.</p>
  <input id="sburl" class="inp" placeholder="Project URL (https://….supabase.co)" value="${esc(CFG.sbUrl || "")}" autocapitalize="off" autocorrect="off" spellcheck="false" style="margin-bottom:8px">
  <input id="sbkey" class="inp" placeholder="anon public key" value="${esc(CFG.sbKey || "")}" autocapitalize="off" autocorrect="off" spellcheck="false" style="margin-bottom:8px">
  <input id="sbmail" class="inp" type="email" placeholder="Deine E-Mail" autocomplete="username" value="${esc(CFG.lastMail || "")}" style="margin-bottom:8px">
  <input id="sbpw" class="inp" type="password" placeholder="Passwort (mind. 6 Zeichen)" autocomplete="current-password">
  <div class="btnrow"><button class="btn" data-act="login">Anmelden</button><button class="btn ghost" data-act="signup">Neu registrieren</button></div><div id="authmsg"></div>`;
  h += `</div><div class="card"><div class="label">2 · ${esc(APP.teacherRole || "KI-Lehrkraft")} ${APP.teacher}</div>
  <select id="aiprov" class="inp" style="margin-bottom:8px"><option value="gemini" ${a.provider !== "openai" && a.provider !== "none" ? "selected" : ""}>Google Gemini (kostenlos)</option><option value="openai" ${a.provider === "openai" ? "selected" : ""}>Anderer Anbieter (OpenAI-kompatibel, z. B. Groq)</option><option value="none" ${a.provider === "none" ? "selected" : ""}>Ohne KI</option></select>
  <input id="aikey" class="inp" type="password" placeholder="API-Schlüssel (von aistudio.google.com)" value="${esc(a.key || "")}" autocapitalize="off" autocorrect="off" spellcheck="false" style="margin-bottom:8px">
  <details><summary class="muted">Erweitert</summary><input id="aimodel" class="inp" placeholder="Modell (leer = automatisch)" value="${esc(a.model || "")}" autocapitalize="off" style="margin:8px 0"><input id="aibase" class="inp" placeholder="Basis-URL (nur anderer Anbieter)" value="${esc(a.baseUrl || "")}" autocapitalize="off"></details>
  <div class="btnrow"><button class="btn" data-act="aisave">Speichern & testen</button></div><div id="aimsg"></div></div>
  <div class="btnrow"><button class="btn" data-act="setupdone">${CFG.setupDone ? "Fertig" : "Los geht’s"}</button></div>
  ${cloudOn() ? "" : `<p class="muted" style="margin-top:12px">Du kannst auch ohne Cloud starten. Dann wird nur auf diesem Gerät gespeichert – die Cloud kannst du später jederzeit verbinden, dein Fortschritt wird dabei mitgenommen.</p>`}`;
  app().innerHTML = h;
}
function authErr(m) {
  if (/invalid login|invalid_credentials/i.test(m)) return "E-Mail oder Passwort falsch.";
  if (/already registered|already exists/i.test(m))
    return "Diese E-Mail ist schon registriert – bitte „Anmelden“ verwenden.";
  if (/not confirmed/i.test(m)) return "Bitte zuerst die Bestätigungs-E-Mail von Supabase öffnen, dann „Anmelden“.";
  if (/failed to fetch|networkerror|load failed/i.test(m))
    return "Keine Verbindung. Stimmt die Project URL und bist du online?";
  if (/api key|apikey|jwt/i.test(m)) return "Der anon public key stimmt nicht.";
  return "Fehler: " + m;
}
async function doAuth(kind) {
  const url = $("#sburl").value.trim().replace(/\/+$/, ""),
    key = $("#sbkey").value.trim(),
    mail = $("#sbmail").value.trim(),
    pw = $("#sbpw").value,
    msg = $("#authmsg");
  const bad = t => {
    msg.innerHTML = `<p class="muted" style="color:var(--puolukka);margin-top:10px">${esc(t)}</p>`;
  };
  if (!/^https:\/\/\S+$/.test(url)) return bad("Bitte die Project URL eintragen (beginnt mit https://).");
  if (!key) return bad("Bitte den anon public key eintragen.");
  if (!mail || pw.length < 6) return bad("Bitte E-Mail und Passwort (mind. 6 Zeichen) eintragen.");
  CFG.sbUrl = url;
  CFG.sbKey = key;
  CFG.lastMail = mail;
  saveCfg();
  msg.innerHTML = `<p class="muted" style="margin-top:10px">Verbinde ${dots()}</p>`;
  try {
    const j =
      kind === "signup"
        ? await authCall("signup", { email: mail, password: pw })
        : await authCall("token?grant_type=password", { email: mail, password: pw });
    if (!j.access_token) {
      msg.innerHTML = `<p style="margin-top:10px">Fast geschafft: Öffne die Bestätigungs-E-Mail von Supabase und tippe danach hier auf „Anmelden“.</p>`;
      return;
    }
    setSession(j);
    const r = await firstLink();
    toast(
      r === "remote"
        ? "Fortschritt aus der Cloud geladen ✓"
        : r === "merged"
          ? "Fortschritt dieses Geräts und der Cloud zusammengeführt ✓"
          : "Verbunden – dein Fortschritt ist jetzt in der Cloud ✓"
    );
    renderSetup();
  } catch (e) {
    bad(authErr(e.message || String(e)));
  }
}
async function aiSave() {
  CFG.ai = {
    provider: $("#aiprov").value,
    key: $("#aikey").value.trim(),
    model: $("#aimodel").value.trim(),
    baseUrl: $("#aibase").value.trim()
  };
  saveCfg();
  const m = $("#aimsg");
  if (CFG.ai.provider === "none") {
    m.innerHTML = `<p class="muted" style="margin-top:10px">Ohne KI: Antworten werden mit den Musterlösungen verglichen. Alles andere funktioniert normal.</p>`;
    return;
  }
  if (!CFG.ai.key) {
    m.innerHTML = `<p class="muted" style="color:var(--puolukka);margin-top:10px">Bitte den Schlüssel eintragen.</p>`;
    return;
  }
  m.innerHTML = `<p class="muted" style="margin-top:10px">Teste ${APP.teacher} ${dots()}</p>`;
  try {
    const t = await aiCall(
      "Antworte mit genau einem " + APP.target.adj + "en Wort, ohne Satzzeichen.",
      "Wie sagt man „Hallo“ auf " + APP.target.name + "?"
    );
    m.innerHTML = `<p style="color:var(--kuusi);margin-top:10px">✓ ${APP.teacher} ist bereit (${esc(CFG.ai.model || CFG.ai.provider)}) und sagt: „${esc(t.slice(0, 40))}“</p>`;
  } catch (e) {
    m.innerHTML = `<p class="muted" style="color:var(--puolukka);margin-top:10px">Test fehlgeschlagen: ${esc(e.message)}</p>`;
  }
}
async function listSnaps() {
  const box = $("#snaplist");
  box.innerHTML = `<p class="muted" style="margin-top:10px">Lade ${dots()}</p>`;
  try {
    const rows = await sbFetch(`/rest/v1/snapshots?select=day&user_id=eq.${uid()}&order=day.desc`);
    box.innerHTML =
      rows && rows.length
        ? `<p class="muted" style="margin-top:10px">Dein aktueller Stand wird vor dem Laden zusätzlich auf dem Gerät aufgehoben.</p>` +
          rows
            .map(
              r =>
                `<div class="row"><span>${new Date(r.day + "T12:00:00").toLocaleDateString(APP.locale, { weekday: "short", day: "numeric", month: "numeric" })}</span><button class="btn sm ghost" data-act="loadsnap" data-id="${esc(r.day)}">Laden</button></div>`
            )
            .join("")
        : `<p class="muted" style="margin-top:10px">Noch keine Tagesstände – der erste entsteht heute.</p>`;
  } catch (e) {
    box.innerHTML = `<p class="muted" style="margin-top:10px">Keine Verbindung zur Cloud.</p>`;
  }
}
async function loadSnap(day, b) {
  if (!b.dataset.sure) {
    b.dataset.sure = "1";
    b.textContent = "Sicher?";
    return;
  }
  try {
    const rows = await sbFetch(`/rest/v1/snapshots?select=data&user_id=eq.${uid()}&day=eq.${day}`);
    if (!rows || !rows[0]) throw 0;
    replaceState(rows[0].data, "-vor-wiederherstellung");
    CUR = { tab: "today", arg: null };
    render();
    toast("Stand geladen ✓");
  } catch (e) {
    toast("Laden fehlgeschlagen");
  }
}

/* Jede Ansicht abgesichert: ein Fehler zeigt einen Hinweis statt einer kaputten Seite (showViewError in start.js) */
function render() {
  try {
    renderView();
  } catch (e) {
    showViewError(e);
  }
}
function renderView() {
  if (S.daily.date !== todayKey()) {
    S.daily = { date: todayKey(), newCards: 0, newTopics: 0 };
  }
  if ((!CFG.setupDone && !SESSION) || CUR.tab === "setup") {
    CUR.tab = "setup";
    setTab("");
    return renderSetup();
  }
  setTab(CUR.tab);
  if (CUR.tab === "today") renderToday();
  else if (CUR.tab === "topics")
    CUR.arg === "pt"
      ? renderPlacement()
      : CUR.view === "grammar"
        ? renderGrammar()
        : CUR.arg
          ? renderTopic(CUR.arg)
          : renderTopics();
  else if (CUR.tab === "vocab") renderVocab();
  else renderProgress();
}
function greeting() {
  const h = new Date().getHours();
  return APP.greeting(h);
}

function renderToday() {
  const dueT = dueTopics(),
    newT = nextNewTopic(),
    capped = S.daily.newTopics >= S.settings.newTopicsPerDay;
  const dc = dueCards().length,
    nc = newCardsAvail().length,
    rep = S.reports[0];
  let h = `<div class="greet">${greeting()}, ${APP.learner}!</div><div class="date">${new Date().toLocaleDateString(APP.locale, { weekday: "long", day: "numeric", month: "long" })}</div>
  <div class="facts"><div><b>${streakNow()}</b><span>Tage in Folge</span></div><div><b>${learnedWords()}</b><span>Wörter gelernt</span></div><div><b>${masteredTopics()}/${TOPICS.length}</b><span>Themen sicher</span></div></div>`;

  // Neue App-Version ohne Daten: Wiederherstellen anbieten
  if (!S.stats.sessions && !Object.keys(S.cards).length) {
    h += `<div class="card" style="border:2px solid var(--sini)"><div class="label">Schon gelernt?</div><p>Wenn du in einer früheren Version schon Fortschritt hattest, spiel hier deine Sicherung ein.</p><input type="file" id="impfile" accept=".json,application/json" class="inp" style="margin-bottom:8px"><div class="btnrow" style="margin-top:4px"><button class="btn ghost" data-act="pasteimport">Backup-Text einfügen</button></div></div>`;
  }
  // Wichtigster nächster Schritt
  if (S.active && (S.active.gen || T(S.active.id))) {
    const a = S.active;
    h += `<div class="next"><div class="label">Pausierte Runde</div><h2>${esc(activeTitle(a))}</h2><p>Du warst bei Aufgabe ${Math.min(a.idx + 1, a.idxs.length)} von ${a.idxs.length}. Alles bis hierhin ist gespeichert.</p><button class="btn" data-act="resume">Weitermachen</button><p class="aiflagp"><a href="#" class="aiflag" data-act="discard">Runde verwerfen</a></p></div>`;
  } else if (ptOn() && !S.placement.done) {
    h += placementCard(true);
  } else if (ptOn() && !TOPICS.length) {
    h += `<div class="next"><div class="label">Einstufungstest abgeschlossen</div><h2>${esc(APP.doneTitle)}</h2><p>Kopiere deinen Bericht unter ${esc(APP.tabs[3][0])} → „Bericht für Claude“ und füge ihn im Chat ein. Daraus entstehen deine ersten Themen – passend zu deinem Niveau.</p><button class="btn" data-act="tab" data-id="progress">Bericht öffnen</button></div>`;
  } else if (dueT.length) {
    const t = dueT[0];
    h += `<div class="next"><div class="label">Als Nächstes: Wiederholung</div><h2>${esc(t.title)}</h2><p>${esc(S.topics[t.id].ai?.reason || "Dieses Thema ist heute dran.")}</p><button class="btn" data-act="review" data-id="${t.id}">Wiederholung starten</button></div>`;
  } else if (dc + nc > 0) {
    h += `<div class="next"><div class="label">Als Nächstes: Vokabeln</div><h2>${dc} fällig, ${nc} neu</h2><p>Kurz und regelmäßig wirkt am besten.</p><button class="btn" data-act="vocab">Vokabeln lernen</button></div>`;
  } else if (newT && !capped) {
    h += `<div class="next"><div class="label">Als Nächstes: neues Thema</div><h2>${esc(newT.title)}</h2><p>${esc(newT.fi)} · Theorie lesen, Wörter lernen, dann üben.</p><button class="btn" data-act="topic" data-id="${newT.id}">Thema öffnen</button></div>`;
  } else {
    h += `<div class="next"><div class="label">Heute erledigt</div><h2>${APP.doneTitle}</h2><p>${capped && newT ? "Für heute genug Neues. Morgen wartet das nächste Thema." : !newT && TOPICS.every(t => S.topics[t.id].status === "learning") ? "Du hast alle Themen gelernt. Schick Claude deinen Bericht (unter Einstellungen) – die neuen Themen sind danach beim nächsten Öffnen automatisch da." : "Alles wiederholt. Neue Themen werden frei, sobald ein Thema mit mindestens 80 % sitzt."}</p></div>`;
  }

  // KI-Übungen warten auf Prüfung durch Claude
  {
    const n = genUnreviewed().length;
    if (n)
      h += `<div class="card" style="border-color:var(--lakka)"><div class="row" style="padding:0"><div><b>${n} KI-${n === 1 ? "Übung wartet" : "Übungen warten"} auf Prüfung durch Claude</b><small>Schick Claude deinen Bericht – er prüft, ob ${APP.teacher}s Übungen korrekt sind.</small></div><button class="btn sm" data-act="reportnow">Bericht</button></div></div>`;
  }
  // Fehler-Training
  const oe = openErrors().length;
  if (oe)
    h += `<div class="card"><div class="row" style="padding:0"><div><b>Fehler-Training</b><small>${oe} ${oe === 1 ? "Übung" : "Übungen"}, die zuletzt danebengingen. Richtig beim ersten Versuch = gelöst.</small></div><button class="btn sm" data-act="errtrain">Üben</button></div></div>`;
  // Zusätzliche Vokabeln
  const hasCards = Object.keys(S.cards).length > 0,
    nx = extraNewCards().length;
  h += `<div class="card"><div class="row" style="padding:0"><div><b>Zusätzlich Vokabeln lernen</b><small>${!hasCards ? "Verfügbar, sobald du dein erstes Thema abgeschlossen hast." : extraVocabText()}</small></div><button class="btn sm ${hasCards ? "" : "ghost"}" data-act="extravocab" ${hasCards ? "" : "disabled"}>Los</button></div></div>`;

  // Weitere Aufgaben
  const more = [];
  dueT
    .slice(1)
    .forEach(t =>
      more.push(
        `<div class="row"><div><b>${esc(t.title)}</b><small>Wiederholung fällig</small></div><button class="btn sm ghost" data-act="review" data-id="${t.id}">Starten</button></div>`
      )
    );
  if (dueT.length && dc + nc > 0)
    more.push(
      `<div class="row"><div><b>Vokabeln</b><small>${dc} fällig, ${nc} neu</small></div><button class="btn sm ghost" data-act="vocab">Lernen</button></div>`
    );
  if (newT && !capped && (dueT.length || dc + nc > 0))
    more.push(
      `<div class="row"><div><b>${esc(newT.title)}</b><small>Neues Thema</small></div><button class="btn sm ghost" data-act="topic" data-id="${newT.id}">Öffnen</button></div>`
    );
  if (more.length) h += `<div class="card"><div class="label">Außerdem heute</div>${more.join("")}</div>`;

  if (NEED_FILE_PERM)
    h += `<div class="card"><div class="row" style="padding:0"><div><b>Sicherungsdatei freigeben</b><small>Der Browser fragt nach einem Neustart einmal nach.</small></div><button class="btn sm" data-act="fileperm">Freigeben</button></div></div>`;
  if (!cloudOn())
    h += `<div class="card" style="border-color:var(--lakka)"><div class="row" style="padding:0"><div><b>Nur auf diesem Gerät gespeichert</b><small>Verbinde die Cloud, damit nichts verloren geht.</small></div><button class="btn sm" data-act="setup">Einrichten</button></div></div>`;
  if (backupDue()) {
    const last = CFG.lastDevBackup;
    h += `<div class="card" style="border:2px solid var(--lakka)"><div class="label">${cloudOn() ? "Wöchentliche" : "Tägliche"} Sicherung</div><p style="margin:4px 0 0">${last ? `Deine letzte Sicherung auf diesem Gerät ist vom ${fmtDate(last)}.` : "Auf diesem Gerät gibt es noch keine Sicherungsdatei."} Speichere jetzt eine Kopie deines Fortschritts direkt auf dem Gerät.</p><div class="btnrow"><button class="btn" data-act="${CAN_SHARE_FILE() ? "sharebackup" : "download"}">${CAN_SHARE_FILE() ? "Sicherung speichern" : "Sicherung herunterladen"}</button>${CAN_SHARE_FILE() ? `<button class="btn ghost" data-act="download">Herunterladen</button>` : ""}<button class="btn ghost" data-act="backuplater">Später</button></div></div>`;
  }
  if (rep)
    h += `<div class="teacher"><div class="label">${APP.teacher}</div><p>${esc(rep.nextFocus || rep.summary)}</p>${rep.tips && rep.tips[0] ? `<p class="muted">Tipp: ${esc(rep.tips[0])}</p>` : ""}</div>`;
  app().innerHTML = h;
  maybeAutoGlobal();
}

/* Voraussetzungen eines Themas: jedes muss beim letzten Ergebnis ≥ 80 % haben */
function reqInfo(t) {
  return (t.req || [])
    .map(id => {
      const rt = T(id),
        s = S.topics[id] || {};
      return { id, t: rt, s, ok: s.last != null && s.last >= 0.8 };
    })
    .filter(r => r.t);
}
function reqLine(t) {
  return reqInfo(t)
    .map(
      r =>
        `${esc(r.t.title)} (${r.s.last != null ? "zuletzt " + pct(r.s.last) : "noch nicht geübt"}) <span class="${r.ok ? "ok" : "no"}">${r.ok ? "✓" : "✗"}</span>`
    )
    .join(" · ");
}
function reqHint(r) {
  const s = r.s;
  if (s.status === "locked") return "Noch gesperrt – zuerst dessen Voraussetzungen schaffen.";
  if (s.status === "new") return "Noch nicht geübt – Thema öffnen und die Übungen machen.";
  if (r.ok) return "Erfüllt.";
  return (
    "Freischaltversuch jederzeit möglich" +
    (s.due && s.due > endOfDay()
      ? ` – sonst Wiederholung ${relDays(s.due)} (${fmtDate(s.due)})`
      : " – Wiederholung ist heute fällig") +
    "."
  );
}
function topicBadge(t) {
  const s = S.topics[t.id];
  if (s.status === "locked") return '<span class="badge locked">Gesperrt</span>';
  if (s.status === "new") return '<span class="badge new">Neu</span>';
  if (s.due <= endOfDay()) return '<span class="badge due">Fällig</span>';
  return `<span class="badge">${relDays(s.due)}</span>`;
}
function renderTopics() {
  let h = `<h2>Themen</h2>${placementTopicRow()}`;
  if (!TOPICS.length) {
    app().innerHTML =
      h +
      `<p class="muted">${ptOn() ? "Deine Themen erscheinen hier nach dem Einstufungstest. Claude baut sie aus deinem Ergebnis." : "Noch keine Themen."}</p>`;
    return;
  }
  h += `<p class="muted">Ein Thema wird frei, sobald alle seine Voraussetzungen mit mindestens 80 % sitzen.</p><div class="btnrow" style="margin:0 0 12px"><button class="btn ghost" data-act="grammar">📖 Grammatik-Übersicht</button></div><div class="card" style="padding:4px 14px">`;
  TOPICS.forEach((t, i) => {
    const s = S.topics[t.id],
      lk = s.status === "locked";
    h += `<button class="titem${lk ? " locked" : ""}" data-act="topic" data-id="${t.id}"><span class="num">${i + 1}</span><span class="body"><b>${esc(t.title)}</b><div class="fi">${esc(t.fi)} · ${t.lvl}</div>${lk && t.req.length ? `<div class="req">🔒 Frei ab 80 % in: ${reqLine(t)}</div>` : ""}${s.last != null ? `<div class="bar"><i style="width:${Math.round(s.last * 100)}%"></i></div>` : ""}</span>${topicBadge(t)}</button>`;
  });
  app().innerHTML = h + "</div>";
}
/* Sicherungsdatei vor einem gefährlichen Schritt. Rückgabe false = nicht gesichert → Schritt abbrechen */
async function backupBefore(name) {
  const txt = JSON.stringify(S);
  if (CAN_SHARE_FILE()) {
    try {
      await navigator.share({
        files: [new File([txt], name, { type: "application/json" })],
        title: APP.name + "-Sicherung"
      });
      return true;
    } catch (e) {
      if (e && e.name === "AbortError") return false;
    }
  }
  try {
    dl(txt, name, "application/json");
    return true;
  } catch (e) {
    return false;
  }
}
const confirmOk = (v, word) => {
  v = String(v || "")
    .trim()
    .toUpperCase()
    .replace(/OE/g, "Ö")
    .replace(/UE/g, "Ü");
  return v === word;
};
function deletedCopy() {
  try {
    const o = JSON.parse(localStorage.getItem(KEY + "-vor-loeschen"));
    return o && typeof o.topics === "object" && hasProgress(o) ? o : null;
  } catch (e) {
    return null;
  }
}
async function doDeleteAll() {
  if (!confirmOk($("#delconf").value, "LÖSCHEN")) return;
  if (!(await backupBefore(APP.id + "-vor-dem-loeschen-" + todayKey() + ".json"))) {
    toast("Sicherung abgebrochen – es wurde nichts gelöscht");
    return;
  }
  safeCopy("-vor-loeschen", S);
  S = defaultState();
  S.wiped = Date.now(); /* Merkzeichen: ein Gerät mit altem Stand darf den gelöschten Fortschritt nicht zurückbringen */
  migrate();
  save();
  CUR = { tab: "today", arg: null };
  render();
  toast("Fortschritt gelöscht – Sicherung gespeichert. Rückgängig unter " + APP.tabs[3][0] + ".");
}
function undoDelete() {
  const o = deletedCopy();
  if (!o) {
    toast("Keine gelöschte Kopie gefunden");
    return;
  }
  replaceState(o, "-vor-wiederherstellung");
  CUR = { tab: "today", arg: null };
  render();
  toast("Gelöschter Stand wiederhergestellt ✓");
}
async function doResetTopic(id) {
  if (!confirmOk($("#topconf").value, "ZURÜCKSETZEN")) return;
  /* Auswahl vor dem Speichern der Sicherung lesen: währenddessen kann die Ansicht neu gezeichnet werden */
  const voc = !!($("#resetvoc") && $("#resetvoc").checked);
  if (!(await backupBefore(APP.id + "-vor-zuruecksetzen-" + id + "-" + todayKey() + ".json"))) {
    toast("Sicherung abgebrochen – nichts zurückgesetzt");
    return;
  }
  resetTopic(id, voc);
}
function resetTopic(id, voc) {
  const t = T(id);
  if (!t) return;
  if (voc === undefined) voc = !!($("#resetvoc") && $("#resetvoc").checked);
  const oldVocab = S.topics[id] && S.topics[id].vocabDone;
  safeCopy("-vor-reset", S);
  /* Merkzeichen für den Abgleich: ältere Stände dieses Themas (und ggf. seiner Vokabeln) gelten als überholt */
  S.resets = { ...(S.resets || {}), [id]: { at: Date.now(), voc } };
  S.topics[id] = {
    status: "new",
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
  if (S.active && S.active.id === id) {
    endActive();
    if (SESSION && SESSION.id === id) SESSION = null;
  }
  if (S.exToday) S.exToday.k = S.exToday.k.filter(k => !k.startsWith(id + ":"));
  if (voc)
    t.v.forEach((w, i) => {
      delete S.cards[id + "-" + i];
      delete S.cards[id + "-" + i + "-r"];
    });
  /* Vokabeln behalten → Schritt „Wörter lernen“ bleibt erledigt; Vokabeln neu → Wörter kommen wieder zuerst */ else if (
    oldVocab ||
    topicVocabIds(id).every(x => S.cards[x] && !S.cards[x].isNew)
  )
    S.topics[id].vocabDone = oldVocab || "reset";
  save();
  render();
  scrollTo(0, 0);
  toast("„" + t.title + "“ zurückgesetzt" + (voc ? " – inklusive Vokabeln" : ""));
}
/* Themenseite: Opettajas Übungen und Claudes Prüfung */
function genTopicCard(id) {
  const sets = (S.genReview || []).filter(x => x.topic === id);
  if (!sets.length) return "";
  const all = sets.flatMap(x => x.ex),
    ok = all.filter(e => (genVerdictOf(e.gid) || {}).ok).length,
    bad = all.filter(e => {
      const v = genVerdictOf(e.gid);
      return v && !v.ok;
    }),
    open = all.length - ok - bad.length;
  return `<div class="card"><div class="label">${APP.teacher}s Übungen · Prüfung durch Claude</div><p class="muted" style="margin:0">${all.length} erzeugt: <b style="color:var(--kuusi)">${ok} ✓ korrekt</b> · <b style="color:var(--puolukka)">${bad.length} ✗ fehlerhaft</b> · ${open} noch ungeprüft</p>${bad
    .map(e => {
      const v = genVerdictOf(e.gid);
      return `<div class="err"><div>${esc(promptText(e))}</div><div class="u">KI-Lösung: ${esc(expectedText(e))}</div><div class="r">Richtig: ${esc(v.korrektur || "–")}${v.grund ? " · " + esc(v.grund) : ""}</div></div>`;
    })
    .join("")}</div>`;
}
function renderTopic(id) {
  const t = T(id),
    s = S.topics[id];
  let h = `<button class="back" data-act="back">‹ Alle Themen</button><p class="ftitle">${esc(t.fi)}</p><h2 style="margin-top:6px">${esc(t.title)}</h2>`;
  if (s.status !== "locked" && reqInfo(t).length)
    h += `<p class="muted" style="margin:-4px 0 12px">Baut auf: ${reqInfo(t)
      .map(r => esc(r.t.title))
      .join(", ")}</p>`;
  if (s.status === "locked") {
    h += `<div class="card"><div class="label">🔒 Noch gesperrt</div><p>Dieses Thema wird frei, sobald <b>alle</b> Voraussetzungen beim letzten Ergebnis mindestens 80 % haben. Gezählt wird der erste Versuch jeder Übung.</p>${reqInfo(
      t
    )
      .map(
        r =>
          `<div class="reqrow"><div class="rq"><b>${esc(r.t.title)}</b> <span class="req"><span class="${r.ok ? "ok" : "no"}">${r.ok ? "✓" : "✗"}</span></span><small>${r.s.last != null ? "Zuletzt " + pct(r.s.last) : "Noch nicht geübt"} · ${esc(reqHint(r))}</small></div>${r.ok ? "" : r.s.status === "learning" && !(S.active && S.active.id === r.id) ? `<button class="btn sm" data-act="unlock" data-id="${r.id}">Freischaltversuch</button>` : `<button class="btn sm ghost" data-act="topic" data-id="${r.id}">Öffnen</button>`}</div>`
      )
      .join("")}</div>`;
    app().innerHTML = h;
    return;
  }
  let act;
  if (S.active && S.active.id === id)
    act = `<p>Du warst bei Aufgabe ${Math.min(S.active.idx + 1, S.active.idxs.length)} von ${S.active.idxs.length}. Alles bis hierhin ist gespeichert.</p><button class="btn" data-act="resume">Pausierte Runde fortsetzen</button><p class="aiflagp"><a href="#" class="aiflag" data-act="discard">Runde verwerfen und neu beginnen</a></p>`;
  else if (s.status === "new" && !vocabReady(id)) {
    const pr = topicVocabProgress(id);
    act = `<div class="label">Schritt 1 von 2: Wörter lernen</div><p>Lerne zuerst die ${t.v.length} Wörter dieses Themas – in beide Richtungen. Sobald du jedes Wort einmal gewusst hast, werden die Übungen frei.</p>${pr.ok ? `<div class="bar" style="margin:0 0 10px"><i style="width:${Math.round((pr.ok / pr.all) * 100)}%"></i></div><p class="muted" style="margin-top:-4px">${pr.ok} von ${pr.all} Karten geschafft</p>` : ""}<button class="btn" data-act="tvocab" data-id="${id}">${pr.ok ? "Weiterlernen" : "Wörter dieses Themas lernen"}</button><p class="aiflagp"><a href="#" class="aiflag" data-act="tvskip" data-id="${id}">Wörter kenne ich schon – direkt zu den Übungen</a></p>`;
  } else if (s.status === "new")
    act = `<div class="label">Schritt 2 von 2: Übungen</div><button class="btn" data-act="learn" data-id="${id}">Zu den Übungen</button>`;
  else if (s.due <= endOfDay())
    act = `<button class="btn" data-act="review" data-id="${id}">Wiederholung starten</button>`;
  else
    act = `<p class="muted">Nächste geplante Wiederholung: ${relDays(s.due)} (${fmtDate(s.due)}). Extra-Übung ändert den Plan nicht.</p><button class="btn ghost" data-act="extra" data-id="${id}">Extra üben</button>`;
  if (s.status === "learning" && !(S.active && S.active.id === id) && (s.last ?? 0) < 0.8) {
    const blocks = TOPICS.filter(x => x.req.includes(id) && S.topics[x.id].status === "locked");
    act += `<button class="btn${s.due <= endOfDay() ? " ghost" : ""}" style="margin-top:8px" data-act="unlock" data-id="${id}">Freischaltversuch starten</button><p class="muted" style="margin:6px 0 0">Alle ${t.ex.length} Übungen, zählt wie eine Wiederholung. Ab 80 % ${blocks.length ? "wird frei: " + blocks.map(x => esc(x.title)).join(", ") : "gilt das Thema als sicher"}.</p>`;
  }
  if (s.status === "learning" && !(S.active && S.active.id === id) && genUnlocked() && aiReady())
    act += `<button class="btn ghost" style="margin-top:8px" data-act="gen" data-id="${id}">Neue Übungen von ${APP.teacher}</button><p class="muted" style="margin:6px 0 0">Frisch erzeugte Sätze zu diesem Thema – ändert deinen Plan nicht.</p>`;
  if (s.ai && s.ai.feedback)
    h += `<div class="teacher"><div class="label">${APP.teacher}s letzte Notiz</div><p>${esc(s.ai.feedback)}</p>${(s.ai.tips || []).map(x => `<p class="muted">Tipp: ${esc(x)}</p>`).join("")}</div>`;
  const vocabList = `<div class="card theory"><h3>Wörter in diesem Thema</h3><p class="muted">Lies sie dir einmal laut durch – in den Übungen kommen sie vor. Danach landen sie automatisch in deinen Vokabelkarten.</p><table>${t.v.map(w => `<tr><td>${esc(w[0])}</td><td>${esc(w[1])}</td></tr>`).join("")}</table></div>`;
  h += `<div class="card theory">${t.th}</div>${vocabList}<div class="card">${act}</div>
  ${genTopicCard(id)}${practiceCardHTML(id)}
  <div class="card"><div class="label">Frag ${APP.teacher}</div><p class="muted">Etwas unklar? Frag einfach.</p><div style="display:flex;gap:8px"><input id="askq" class="inp" placeholder="${APP.askPlaceholder}" autocomplete="off"><button class="btn sm" data-act="ask" data-id="${id}">Fragen</button></div><div id="askres"></div></div>`;
  const hasCards = t.v.some((w, i) => S.cards[id + "-" + i] && !S.cards[id + "-" + i].isNew);
  /* Zurücksetzen ist bei jedem freigeschalteten Thema möglich (gesperrte Themen enden oben mit der Voraussetzungs-Ansicht) */
  h += `<div class="card"><div class="label">Fortschritt zurücksetzen</div><p class="muted">Das Thema startet wieder als neues Thema – mit allen Übungen. Ergebnisse, Wiederholungsplan, eine unterbrochene Übung und ${APP.teacher}s Notizen zu diesem Thema werden gelöscht. Andere Themen bleiben unverändert.</p>${hasCards ? `<label style="display:flex;gap:8px;align-items:center;margin:0 0 10px"><input type="checkbox" id="resetvoc"> Auch die Vokabeln dieses Themas neu lernen</label>` : ""}<div id="topresetbox"><button class="btn ghost" data-act="resettopic" data-id="${id}">Thema zurücksetzen</button></div></div>`;
  app().innerHTML = h;
  app().querySelectorAll(".theory").forEach(decorateTheory);
}
