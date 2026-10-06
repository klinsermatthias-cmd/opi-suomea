/* Opi suomea – ki-ueben.js: freies Schreiben und Rollenspiel mit der KI-Lehrkraft (Themenseite gelernter Themen).
   Beides ändert den Lernplan nicht. Die letzten Ergebnisse stehen in S.practice (max. 20) und im Bericht für Claude,
   jede KI-Antwort zusätzlich im KI-Protokoll (Arten „schreiben“, „rollenspiel“).
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
const CHAT_TURNS = 10;

/* Was die KI über das Thema wissen muss: Situation, Theorie (gekürzt), Wortschatz des Themas, seiner Voraussetzungen
   und die eigenen Wörter – damit Aufgaben und Antworten zum Stand passen. */
function practiceContext(t) {
  const ids = [t.id, ...(t.req || [])],
    words = [];
  ids.forEach(id => (T(id) ? T(id).v : []).forEach(w => words.push(w[0] + " = " + w[1])));
  ownKeys().forEach(n => words.push(S.own[n].fi + " = " + S.own[n].de));
  const th = String(t.th || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 900);
  const rep = S.reports[0];
  return `Thema: ${t.title} (${t.fi}), Niveau ${t.lvl || "?"}${rep && rep.level ? `; geschätztes Niveau von ${APP.learner}: ${rep.level}` : ""}
Theorie (Auszug): ${th}
Wortschatz, den ${APP.learner} kennt (Auswahl): ${words.slice(0, 90).join("; ")}`;
}
function practiceLog(e) {
  S.practice = [{ d: Date.now(), ...e }, ...(S.practice || [])].slice(0, 20);
  save();
}
function mergePractice(L, R) {
  const seen = new Set();
  return [...(L || []), ...(R || [])]
    .filter(x => (seen.has(x.d) ? false : seen.add(x.d)))
    .sort((a, b) => b.d - a.d)
    .slice(0, 20);
}
function practiceReport() {
  const P = S.practice || [];
  if (!P.length) return "";
  return (
    `\n\nFREIES SCHREIBEN & ROLLENSPIEL (letzte ${P.length}, ändern den Plan nicht):` +
    P.map(
      x =>
        `\n- ${new Date(x.d).toLocaleDateString(APP.locale, { day: "numeric", month: "numeric" })} ${x.tid} ${x.k === "r" ? "Rollenspiel" : "Schreiben"}: ${cut(x.task || "", 120)} | ${APP.learner}: ${cut(x.text || "", 300)}${x.fix ? " | Korrektur/Rückmeldung: " + cut(x.fix, 300) : ""}${x.errs != null ? ` | Fehler: ${x.errs}` : ""}`
    ).join("")
  );
}
function practiceCardHTML(id) {
  const s = S.topics[id];
  if (!s || s.status !== "learning") return "";
  if (!aiReady())
    return `<div class="card"><div class="label">Frei üben mit ${APP.teacher}</div><p class="muted">Schreiben und Rollenspiel brauchen ${APP.teacher}. Unter Einstellungen → „Cloud & KI einrichten“ trägst du deinen kostenlosen Schlüssel ein.</p></div>`;
  return `<div class="card"><div class="label">Frei üben mit ${APP.teacher}</div><p class="muted">Zur Situation dieses Themas, mit deinem Wortschatz. Ändert deinen Lernplan nicht.</p><div class="btnrow"><button class="btn ghost" data-act="pwrite" data-id="${id}">✍️ Schreiben</button><button class="btn ghost" data-act="pchat" data-id="${id}">💬 Rollenspiel</button></div></div>`;
}
function practiceErr(msg) {
  return `<p class="muted">${APP.teacher} nicht erreichbar: ${esc(aiErrShort())}. <a href="#" data-act="aidiag">Verbindung prüfen</a></p>${msg || ""}`;
}
function practiceBar(id, label) {
  return `<div class="sbar"><small>${esc(label)}</small><span style="flex:1"></span><button class="xbtn" data-act="topic" data-id="${id}">Beenden</button></div>`;
}

/* ---------- Freies Schreiben ---------- */
async function startWrite(id) {
  const t = T(id);
  if (!t) return;
  SESSION = { kind: "write", id, task: null };
  CUR = { tab: "topics", arg: id };
  setTab("topics");
  app().innerHTML = `${practiceBar(id, "Schreiben · " + t.title)}<div class="card"><p class="muted">${APP.teacher} denkt sich eine Aufgabe aus ${dots()}</p></div>`;
  scrollTo(0, 0);
  const se = SESSION;
  try {
    const meta = { k: "schreiben" },
      j = await aiJSON(
        `${practiceContext(t)}

Stelle ${APP.learner} eine kurze Schreibaufgabe zur Alltagssituation dieses Themas: 1–3 Sätze auf ${APP.target.name}, mit dem bekannten Wortschatz lösbar. Die Aufgabe selbst auf ${APP.explain}, konkret (wer, was, wo). Wähle jedes Mal eine andere Situation.
JSON: {"task": "Aufgabe auf ${APP.explain}", "words": ["2–4 ${APP.target.adj}e Wörter, die vorkommen sollen"], "sample": "eine korrekte Musterlösung auf ${APP.target.name}"}`,
        meta
      );
    if (SESSION !== se) return;
    se.task = {
      task: String(j.task || ""),
      words: (j.words || []).map(String).slice(0, 5),
      sample: String(j.sample || "")
    };
    se.aid = aiAudit("schreiben", meta, {
      q: `${id} Aufgabe: ${se.task.task}`,
      r: `Wörter: ${se.task.words.join(", ")} | Muster: ${se.task.sample}`
    });
    renderWrite();
  } catch (e) {
    if (SESSION !== se) return;
    app().innerHTML = `${practiceBar(id, "Schreiben")}<div class="card">${practiceErr()}</div>`;
  }
}
function renderWrite() {
  const se = SESSION,
    t = T(se.id),
    k = se.task;
  app().innerHTML = `${practiceBar(se.id, "Schreiben · " + t.title)}<div class="card"><div class="ask">Schreib auf ${APP.target.name}</div><div class="q" style="font-size:20px">${esc(k.task)}</div>${k.words.length ? `<div class="hint">Verwende: ${k.words.map(w => glossWords(w)).join(", ")}</div>` : ""}${flagLink(se.aid, "Aufgabe fehlerhaft?")}${charKeys()}<textarea id="ans" class="inp schta" rows="4" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="Auf ${APP.target.name} …"></textarea><div class="btnrow"><button class="btn ghost" id="wother" data-act="pwrite" data-id="${se.id}">Andere Aufgabe</button><button class="btn" data-act="pwcheck">Korrigieren</button></div><div id="fb"></div></div>`;
  $("#ans").focus();
}
async function checkWrite() {
  const se = SESSION;
  if (!se || se.kind !== "write" || se.busy) return;
  const user = ($("#ans").value || "").trim();
  if (!user) return;
  se.busy = true;
  $("#ans").disabled = true;
  document.querySelectorAll('[data-act="pwcheck"],#wother').forEach(b => (b.style.display = "none"));
  $("#fb").innerHTML = `<div class="fb wait">${APP.teacher} liest deinen Text ${dots()}</div>`;
  const t = T(se.id),
    k = se.task;
  try {
    const meta = { k: "schreiben" },
      j = await aiJSON(
        `${practiceContext(t)}

Schreibaufgabe: ${k.task}${k.words.length ? `\nZu verwendende Wörter: ${k.words.join(", ")}` : ""}
Text von ${APP.learner}: "${user}"

Korrigiere den Text wie eine gute Lehrerin: Ist er sprachlich korrekt und erfüllt er die Aufgabe? Kleine Tippfehler und fehlende Satzzeichen nur nebenbei erwähnen. Andere Formulierungen als erwartet sind richtig, wenn sie passen. ${SP.judge.trim()}
JSON: {"correct": true oder false, "corrected": "der Text mit allen Fehlern korrigiert, so nah wie möglich an seinem Text", "errors": [{"wrong": "falsche Stelle", "right": "richtig", "why": "kurz warum, auf ${APP.explain}"}], "feedback": "1–2 Sätze auf ${APP.explain}: was gut war und worauf achten"}`,
        meta
      );
    if (SESSION !== se) return;
    const errs = (j.errors || []).filter(x => x && x.wrong);
    const aid = aiAudit("schreiben", meta, {
      q: `${se.id} Korrektur: ${k.task}`,
      u: user,
      ok: !!j.correct,
      r: `${j.correct ? "richtig" : "Fehler"} – ${j.corrected || ""} | ${errs.map(x => `${x.wrong} → ${x.right} (${x.why})`).join("; ")} | ${j.feedback || ""}`,
      rmax: 600
    });
    practiceLog({ k: "s", tid: se.id, task: k.task, text: user, fix: j.corrected || "", errs: errs.length });
    bumpStreak();
    save();
    $("#fb").innerHTML =
      `<div class="fb ${j.correct ? "ok" : "bad"}"><b class="t">${j.correct ? "Sehr gut – das passt!" : "Fast – hier ist die Korrektur."}</b>${!j.correct && j.corrected ? `<p>${spk(j.corrected)}<b>${glossWords(j.corrected)}</b></p>` : ""}${errs.length ? `<ul class="perr">${errs.map(x => `<li><s>${esc(x.wrong)}</s> → <b>${esc(x.right)}</b>${x.why ? ` – ${esc(x.why)}` : ""}</li>`).join("")}</ul>` : ""}${j.feedback ? `<p>${esc(j.feedback)}</p>` : ""}${k.sample ? `<p class="muted">Beispiel: ${spk(k.sample)}${glossWords(k.sample)}</p>` : ""}${flagLink(aid)}</div>` +
      `<div class="btnrow"><button class="btn" data-act="pwrite" data-id="${se.id}">Neue Aufgabe</button><button class="btn ghost" data-act="topic" data-id="${se.id}">Zum Thema</button></div>`;
  } catch (e) {
    if (SESSION !== se) return;
    se.busy = false;
    $("#ans").disabled = false;
    document.querySelectorAll('[data-act="pwcheck"],#wother').forEach(b => (b.style.display = ""));
    $("#fb").innerHTML = practiceErr();
  }
}

/* ---------- Rollenspiel ---------- */
async function startChat(id) {
  const t = T(id);
  if (!t) return;
  SESSION = { kind: "chat", id, msgs: [], turns: 0, busy: true, errs: 0 };
  CUR = { tab: "topics", arg: id };
  setTab("topics");
  app().innerHTML = `${practiceBar(id, "Rollenspiel · " + t.title)}<div class="card"><p class="muted">${APP.teacher} bereitet die Szene vor ${dots()}</p></div>`;
  scrollTo(0, 0);
  const se = SESSION;
  try {
    const meta = { k: "rollenspiel" },
      j = await aiJSON(
        `${practiceContext(t)}

Starte ein kurzes Rollenspiel zur Alltagssituation dieses Themas. Du spielst eine passende Person (z. B. Verkäuferin, Kellner, Nachbarin), ${APP.learner} spielt sich selbst. Sprich einfach, im Niveau des Themas, und nutze möglichst den bekannten Wortschatz. Wähle jedes Mal eine etwas andere Situation.
JSON: {"scene": "Situation in 1 Satz auf ${APP.explain}", "role": "deine Rolle auf ${APP.explain}", "goal": "was ${APP.learner} im Gespräch erreichen soll, auf ${APP.explain}", "opener": "deine erste Zeile auf ${APP.target.name}", "opener_tr": "Übersetzung der ersten Zeile auf ${APP.base.name}"}`,
        meta
      );
    if (SESSION !== se) return;
    Object.assign(se, {
      scene: String(j.scene || ""),
      role: String(j.role || APP.teacher),
      goal: String(j.goal || ""),
      busy: false
    });
    se.msgs.push({ who: "ai", t: String(j.opener || ""), tr: String(j.opener_tr || "") });
    se.aid = aiAudit("rollenspiel", meta, {
      q: `${id} Szene: ${se.scene} (${se.role})`,
      r: `${j.opener} = ${j.opener_tr}`
    });
    renderChat();
    if (S.settings.autoplay) speak(se.msgs[0].t);
  } catch (e) {
    if (SESSION !== se) return;
    app().innerHTML = `${practiceBar(id, "Rollenspiel")}<div class="card">${practiceErr()}</div>`;
  }
}
function chatBubble(m) {
  if (m.who === "me")
    return `<div class="cmsg me"><div>${esc(m.t)}</div>${m.fix ? `<div class="cfix">✎ ${spk(m.fix)}<b>${glossWords(m.fix)}</b>${m.note ? `<small>${esc(m.note)}</small>` : ""}</div>` : m.ok ? '<div class="cok">✓</div>' : ""}</div>`;
  return `<div class="cmsg"><div>${spk(m.t)}${glossWords(m.t)}</div>${m.tr ? `<details><summary>Übersetzung</summary>${esc(m.tr)}</details>` : ""}</div>`;
}
function renderChat() {
  const se = SESSION,
    t = T(se.id),
    left = CHAT_TURNS - se.turns;
  app().innerHTML = `${practiceBar(se.id, "Rollenspiel · " + t.title)}<div class="card"><div class="label">Szene</div><p style="margin:0 0 4px">${esc(se.scene)}</p><p class="muted" style="margin:0">${esc(APP.teacher)} spielt: ${esc(se.role)}${se.goal ? ` · Dein Ziel: ${esc(se.goal)}` : ""}</p>${flagLink(se.aid, "Szene fehlerhaft?")}</div>
  <div class="chat">${se.msgs.map(chatBubble).join("")}${se.busy ? `<div class="cmsg"><div class="muted">${dots()}</div></div>` : ""}</div>
  ${
    se.ended
      ? `<div id="chatend"></div>`
      : `<div class="card">${charKeys()}<div style="display:flex;gap:8px"><input id="chatin" class="inp" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="Auf ${APP.target.name} …" ${se.busy ? "disabled" : ""}><button class="btn sm" data-act="pcsend" ${se.busy ? "disabled" : ""}>Senden</button></div><p class="muted" style="margin:8px 0 0;font-size:13px">Noch ${left} ${left === 1 ? "Antwort" : "Antworten"} · <a href="#" class="aiflag" data-act="pcend">Gespräch beenden</a></p></div>`
  }`;
  const inp = $("#chatin");
  if (inp && !se.busy) inp.focus();
  const last = app().querySelector(".chat .cmsg:last-child");
  if (last && se.msgs.length > 2) last.scrollIntoView({ block: "nearest" });
}
function chatTranscript(se) {
  return se.msgs.map(m => (m.who === "ai" ? `${se.role}: ${m.t}` : `${APP.learner}: ${m.t}`)).join("\n");
}
async function sendChat() {
  const se = SESSION;
  if (!se || se.kind !== "chat" || se.busy || se.ended) return;
  const user = ($("#chatin").value || "").trim();
  if (!user) return;
  const t = T(se.id),
    hist = chatTranscript(se);
  se.msgs.push({ who: "me", t: user });
  se.turns++;
  se.busy = true;
  renderChat();
  try {
    const meta = { k: "rollenspiel" },
      j = await aiJSON(
        `${practiceContext(t)}

Rollenspiel. Situation: ${se.scene}. Du spielst: ${se.role}. ${APP.learner} soll: ${se.goal}
Bisheriges Gespräch:
${hist}
Neue Antwort von ${APP.learner}: "${user}"

1) Prüfe die Antwort von ${APP.learner}: sprachlich korrekt (Grammatik, Wortwahl, Endungen)? Kleine Tippfehler und Satzzeichen nicht beanstanden. Wenn nicht korrekt: korrigierte Fassung, so nah wie möglich an seinem Satz, und eine sehr kurze Erklärung auf ${APP.explain}. ${SP.judge.trim()}
2) Antworte in deiner Rolle kurz (1–2 einfache Sätze auf ${APP.target.name}) und halte das Gespräch mit einer Rückfrage in Gang.${se.turns >= CHAT_TURNS - 1 ? " Das Gespräch soll jetzt freundlich enden: verabschiede dich und setze end auf true." : " Ist das Ziel erreicht und das Gespräch natürlich zu Ende, verabschiede dich und setze end auf true."}
JSON: {"ok": true oder false, "fix": "korrigierte Fassung oder leer", "note": "kurze Erklärung oder leer", "reply": "deine Antwort auf ${APP.target.name}", "reply_tr": "Übersetzung deiner Antwort auf ${APP.base.name}", "end": false}`,
        meta
      );
    if (SESSION !== se) return;
    const me = se.msgs[se.msgs.length - 1],
      fix = j.ok ? "" : String(j.fix || "");
    me.ok = !!j.ok;
    if (fix && norm(fix) !== norm(user)) {
      me.fix = fix;
      me.note = String(j.note || "");
      se.errs++;
    }
    aiAudit("rollenspiel", meta, {
      q: `${se.id} ${se.role}: ${se.msgs[se.msgs.length - 2] ? se.msgs[se.msgs.length - 2].t : ""}`,
      u: user,
      ok: !!j.ok,
      r: `${j.ok ? "richtig" : "Korrektur: " + (j.fix || "") + " – " + (j.note || "")} | Antwort: ${j.reply || ""}`
    });
    if (j.reply) se.msgs.push({ who: "ai", t: String(j.reply), tr: String(j.reply_tr || "") });
    se.busy = false;
    if (j.end || se.turns >= CHAT_TURNS) return endChat();
    renderChat();
    if (S.settings.autoplay && j.reply) speak(String(j.reply));
  } catch (e) {
    if (SESSION !== se) return;
    se.msgs.pop();
    se.turns--;
    se.busy = false;
    renderChat();
    $("#chatin").value = user;
    toast(`${APP.teacher} nicht erreichbar: ${aiErrShort()}`);
  }
}
async function endChat() {
  const se = SESSION;
  if (!se || se.kind !== "chat" || se.ended) return;
  se.ended = true;
  se.busy = false;
  renderChat();
  const box = $("#chatend"),
    mine = se.msgs.filter(m => m.who === "me");
  const done = (fb, extra) => {
    box.innerHTML = `<div class="card"><div class="label">Rückmeldung</div>${fb}${extra || ""}<div class="btnrow"><button class="btn" data-act="pchat" data-id="${se.id}">Neues Rollenspiel</button><button class="btn ghost" data-act="topic" data-id="${se.id}">Zum Thema</button></div></div>`;
  };
  if (!mine.length) return done(`<p class="muted">Du hast noch nichts geschrieben.</p>`);
  box.innerHTML = `<div class="card"><p class="muted">${APP.teacher} schreibt dir eine Rückmeldung ${dots()}</p></div>`;
  let fb = "";
  try {
    const meta = { k: "rollenspiel" },
      j = await aiJSON(
        `Rollenspiel zum Thema „${T(se.id).title}“. Situation: ${se.scene}. Ziel von ${APP.learner}: ${se.goal}
Gespräch (Korrekturen in Klammern):
${se.msgs.map(m => (m.who === "ai" ? `${se.role}: ${m.t}` : `${APP.learner}: ${m.t}${m.fix ? ` (richtig: ${m.fix})` : ""}`)).join("\n")}

Gib ${APP.learner} eine kurze, ehrliche und motivierende Rückmeldung auf ${APP.explain}: Ziel erreicht? Was war gut? Die 1–3 wichtigsten Punkte zum Üben.
JSON: {"goal": true oder false, "summary": "2–3 Sätze", "tips": ["…"]}`,
        meta
      );
    fb = `<p>${j.goal ? "✓ Ziel erreicht. " : ""}${esc(j.summary || "")}</p>${(j.tips || []).length ? `<ul>${j.tips.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}`;
    const aid = aiAudit("rollenspiel", meta, {
      q: `${se.id} Rückmeldung: ${se.scene}`,
      r: `${j.summary || ""} | ${(j.tips || []).join("; ")}`
    });
    fb += flagLink(aid);
    practiceLog({
      k: "r",
      tid: se.id,
      task: se.scene,
      text: mine.map(m => m.t).join(" / "),
      fix: j.summary || "",
      errs: se.errs
    });
  } catch (e) {
    fb = practiceErr();
    practiceLog({ k: "r", tid: se.id, task: se.scene, text: mine.map(m => m.t).join(" / "), errs: se.errs });
  }
  bumpStreak();
  save();
  if (SESSION === se)
    done(
      fb,
      `<p class="muted">${mine.length} ${mine.length === 1 ? "Antwort" : "Antworten"}, ${se.errs ? se.errs + " mit Korrektur" : "alle ohne Korrektur"}.</p>`
    );
}
