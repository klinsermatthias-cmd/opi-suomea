/* Opi suomea – ki-ueben.js: freies Schreiben und Rollenspiel mit der KI-Lehrkraft (Themenseite gelernter Themen).
   Beides ändert den Lernplan nicht. Die letzten Ergebnisse stehen in S.practice (max. 20) und im Bericht für Claude,
   jede KI-Antwort zusätzlich im KI-Protokoll (Arten „schreiben“, „rollenspiel“).
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
const CHAT_TURNS = 10;

/* Was die KI über das Thema wissen muss: Situation, Theorie (gekürzt) und der Wortschatz, den der/die Lernende schon
   kennt – aktuelles Thema und Voraussetzungen zuerst, dann alle anderen gelernten Themen und die eigenen Wörter.
   Die KI soll NUR diese Wörter verwenden (WORD_RULE); ein unvermeidbares neues Wort nennt sie in "new". */
function knownWords(t) {
  const ids = [t.id, ...(t.req || [])];
  TOPICS.forEach(x => {
    if (!ids.includes(x.id) && S.topics[x.id] && S.topics[x.id].status === "learning") ids.push(x.id);
  });
  const seen = new Set(),
    out = [];
  const add = (fi, de) => {
    const k = norm(fi);
    if (k && !seen.has(k)) {
      seen.add(k);
      out.push(fi + " = " + de);
    }
  };
  ids.forEach(id => (T(id) ? T(id).v : []).forEach(w => add(w[0], w[1])));
  ownKeys().forEach(n => add(S.own[n].fi, S.own[n].de));
  return out.slice(0, 320);
}
/* Korrekte Beispielsätze des Themas und seiner Voraussetzungen (Lösungen der Übersetzungen in die Lernsprache und der
   Lückensätze) – Vorbilder für Aufgaben und Mustersätze der KI */
function practiceModels(t) {
  const out = [];
  [t.id, ...(t.req || [])].forEach(id =>
    ((T(id) || {}).ex || []).forEach(e => {
      if ((e.t === "tr" && e.dir === "de") || e.t === "gap") {
        const x = expectedText(e);
        if (x && /\s/.test(x) && x.length < 80) out.push(x);
      }
    })
  );
  return shuffle(out).slice(0, 8);
}
function practiceContext(t) {
  const th = theoryText(t, 900);
  const rep = S.reports[0];
  return `Thema: ${t.title} (${t.fi}), Niveau ${t.lvl || "?"}${rep && rep.level ? `; geschätztes Niveau von ${APP.learner}: ${rep.level}` : ""}
Theorie (Auszug): ${th}
WORTLISTE – alle Wörter, die ${APP.learner} kennt: ${knownWords(t).join("; ")}`;
}
const WORD_ONLY = `Verwende auf ${APP.target.name} NUR Wörter aus der WORTLISTE (in passenden Formen, die die Theorie erklärt) und Eigennamen. Kein anderes Wort, auch keine Redewendung, die nicht in der Liste steht.`;
const WORD_RULE =
  WORD_ONLY +
  ` Nur wenn es ganz ohne nicht geht: höchstens EIN neues Wort pro Antwort, und dieses in "new" mit Grundform und Bedeutung auf ${APP.base.name} angeben.`;
/* Abwechslung beim Ausdenken: Die KI hat kein Gedächtnis – bei gleichem Auftrag käme fast immer dieselbe Aufgabe.
   Deshalb bekommt sie die zuletzt gestellten Aufgaben dieses Themas (KI-Protokoll + Ergebnisse, synchronisiert),
   4–5 zufällige Pflichtwörter (schwache Wörter und Wörter des Themas zuerst) und eine zufällige Wendung. */
const PRACTICE_TWISTS = [
  "etwas ist gerade nicht da oder ausverkauft",
  "jemand hat es eilig",
  "es gibt ein kleines Missverständnis",
  "es ist früh am Morgen oder spät am Abend",
  "jemand fragt nach einer Alternative",
  "jemand ist zum ersten Mal hier",
  "du fragst höflich nach, weil du etwas nicht verstanden hast",
  "es geht um eine Zahl, eine Uhrzeit oder einen Preis"
];
const PRACTICE_MIN = 0.8;
function practiceRecent(id, k) {
  const tag = id + (k === "r" ? " Szene: " : " Aufgabe: "),
    ak = k === "r" ? "rollenspiel" : "schreiben";
  const a = (S.aiAudit || [])
      .filter(e => e.k === ak && (e.q || "").startsWith(tag))
      .map(e => [e.d, e.q.slice(tag.length)]),
    p = (S.practice || []).filter(x => x.k === k && x.tid === id).map(x => [x.d, x.task || ""]);
  const seen = new Set();
  return [...a, ...p]
    .sort((x, y) => y[0] - x[0])
    .map(x => x[1].replace(/ \([^)]*\)$/, "").trim())
    .filter(x => x && !seen.has(x) && seen.add(x))
    .slice(0, 6);
}
function practiceReady(id) {
  return ((S.topics[id] || {}).last || 0) >= PRACTICE_MIN;
}
function practiceVariety(t, k) {
  const known = new Map(knownWords(t).map(x => [norm(x.split(" = ")[0]), x.split(" = ")[0]]));
  /* nur Wörter des Themas und schwache Wörter – beliebige Wörter aus anderen Themen ergaben unpassende Szenen (E-1007-53) */
  const topicW = new Set(t.v.map(w => norm(w[0]))),
    weak = weakCards()
      .map(([id]) => cardWord(id)[0])
      .filter(w => known.has(norm(w))),
    own = shuffle(t.v.map(w => w[0]));
  const pick = [...new Set([...shuffle(weak.filter(w => topicW.has(norm(w)))).slice(0, 2), ...own])].slice(0, 4);
  const recent = practiceRecent(t.id, k),
    twist = PRACTICE_TWISTS[Math.floor(Math.random() * PRACTICE_TWISTS.length)];
  return `
ABWECHSLUNG: Nutze davon die Wörter, die natürlich in die Situation passen (in passenden Formen): ${pick.join(", ")}. Wendung, nur falls sie natürlich passt: ${twist}. Keine dritte Person ohne klaren Bezug, keine Grammatik, die über die Theorie hinausgeht.${recent.length ? `\nSCHON GESTELLT (nicht wiederholen, andere Situation/Person/Ort wählen):\n${recent.map(x => "- " + x).join("\n")}` : ""}`;
}
/* Neue Wörter, die die KI trotzdem benutzt hat: für das Antippen merken (ohne erneute KI-Anfrage) und anzeigen */
function practiceNew(list) {
  const nw = (Array.isArray(list) ? list : [])
    .filter(x => x && x.fi && x.de)
    .slice(0, 3)
    .map(x => ({ fi: String(x.fi), de: String(x.de) }));
  if (nw.length) {
    S.gloss = S.gloss || {};
    nw.forEach(x => {
      const k = gkey(x.fi);
      if (k && !S.gloss[k]) S.gloss[k] = { de: x.de, base: k, note: "neues Wort" };
    });
  }
  return nw;
}
const nwText = nw => (nw.length ? " | neue Wörter: " + nw.map(x => x.fi + " = " + x.de).join(", ") : "");
function newWordsHTML(nw) {
  return nw && nw.length
    ? `<small class="cnew">Neu: ${nw.map(x => `<b>${esc(x.fi)}</b> = ${esc(x.de)}`).join("; ")}</small>`
    : "";
}
/* Ergebnis merken (gespeichert wird mit dem save() des Aufrufers) */
function practiceLog(e) {
  S.practice = [{ d: Date.now(), ...e }, ...(S.practice || [])].slice(0, 20);
}
/* Eine Zeile je Ergebnis – kurz für die Gesamtanalyse, ausführlich (mit Datum und Korrektur) für den Bericht */
function practiceLine(x, full) {
  return `- ${full ? fmtDate(x.d) + " " : ""}[${x.tid}] ${x.k === "r" ? "Rollenspiel" : "Schreiben"}: ${cut(x.task || "", full ? 120 : 80)} | ${APP.learner}: „${cut(x.text || "", full ? 300 : 160)}“${full && x.fix ? " | Korrektur/Rückmeldung: " + cut(x.fix, 300) : ""}${x.errs != null ? ` | ${x.errs} Fehler/Korrekturen` : ""}`;
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
    P.map(x => "\n" + practiceLine(x, true)).join("")
  );
}
function practiceCardHTML(id) {
  const s = S.topics[id];
  if (!s || s.status !== "learning") return "";
  const nFix = fixedPool(id).length,
    fixBtn = nFix ? `<button class="btn ghost" data-act="pfixed" data-id="${id}">📝 Aufgaben von Claude</button>` : "";
  const head = `<div class="card"><div class="label">Frei üben mit ${APP.teacher}</div>`;
  if (!aiReady())
    return `${head}<p class="muted">${nFix ? `„Aufgaben von Claude“: Lesen, Schreiben und Dialoge aus deinen Themen. ` : ""}Eigene Schreibaufgaben und Rollenspiele brauchen ${APP.teacher}. Unter Einstellungen → „Cloud & KI einrichten“ trägst du deinen kostenlosen Schlüssel ein.</p>${fixBtn ? `<div class="btnrow">${fixBtn}</div>` : ""}</div>`;
  const ready = (s.last || 0) >= PRACTICE_MIN;
  return `${head}<p class="muted">${nFix ? `„Aufgaben von Claude“: Lesen, Schreiben und Dialoge aus deinen Themen – ${APP.teacher} prüft deine Antworten. ` : ""}${ready ? `Schreiben und Rollenspiel denkt sich ${APP.teacher} jedes Mal neu aus, mit deinem Wortschatz.` : `Schreiben und Rollenspiel mit ${APP.teacher} gibt es, sobald das Thema sitzt (letztes Ergebnis ab ${Math.round(PRACTICE_MIN * 100)} %, jetzt ${pct(s.last)}).`} Ändert deinen Lernplan nicht.</p><div class="btnrow">${fixBtn}${ready ? `<button class="btn ghost" data-act="pwrite" data-id="${id}">✍️ Schreiben</button><button class="btn ghost" data-act="pchat" data-id="${id}">💬 Rollenspiel</button>` : ""}</div></div>`;
}
/* Aufgaben von Claude: die fertigen Lese-, Schreib- und Dialogaufgaben aus den Lektionen – dieses Thema und alle
   Themen, auf denen es aufbaut bzw. die schon gelernt werden. Feste Aufgaben sind sprachlich verlässlich; freie
   Antworten prüft die KI (wie in der Themenrunde). Heute schon Gelöstes kommt zuletzt. */
function fixedPool(id) {
  const t = T(id);
  if (!t) return [];
  const ids = [id, ...(t.req || [])].filter(x => S.topics[x] && S.topics[x].status === "learning");
  return ids.flatMap(tid =>
    T(tid)
      .ex.map((ex, ei) => ({ tid, ei, ex }))
      .filter(x => FIXED_TYPES.includes(x.ex.t))
  );
}
function startFixed(id) {
  const done = exDoneToday().k,
    pool = shuffle(fixedPool(id));
  if (!pool.length) return toast("Für dieses Thema gibt es noch keine Lese-, Schreib- oder Dialogaufgaben");
  const fresh = x => !done.includes(x.tid + ":" + x.ei),
    own = x => (x.tid === id ? 0 : 1);
  const list = [...pool.filter(fresh), ...pool.filter(x => !fresh(x))]
    .sort((a, b) => fresh(b) - fresh(a) || own(a) - own(b))
    .slice(0, 4);
  const idxs = list.map((_, i) => i);
  S.active = {
    id,
    mode: "extra",
    title: (T(id) || {}).title + " · Aufgaben von Claude",
    gen: list.map(x => x.ex),
    gsrc: list.map(x => ({ tid: x.tid, ei: x.ei })),
    idxs,
    rt: idxs.map(() => 0),
    idx: 0,
    results: [],
    d: Date.now()
  };
  save();
  openSession();
}
function practiceErr(msg) {
  return `<p class="muted">${APP.teacher} nicht erreichbar: ${esc(aiErrShort())}. <a href="#" data-act="aidiag">Verbindung prüfen</a></p>${msg || ""}`;
}
function practiceBar(id, label) {
  return `<div class="sbar"><small>${esc(label)}</small><span style="flex:1"></span><button class="xbtn" data-act="topic" data-id="${id}">Beenden</button></div>`;
}

/* ---------- Freies Schreiben ---------- */
async function startWrite(id, again) {
  const t = T(id);
  if (!t) return;
  if (!practiceReady(id)) return toast(`Erst wenn das Thema sitzt (ab ${Math.round(PRACTICE_MIN * 100)} %)`);
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

VORBILDER – geprüfte, korrekte Sätze aus den Übungen (Formen und Satzbau daran orientieren): ${practiceModels(t).join(" | ") || "–"}

Stelle ${APP.learner} eine kurze Schreibaufgabe zur Alltagssituation dieses Themas: 1–3 Sätze auf ${APP.target.name}, NUR mit Wörtern aus der WORTLISTE lösbar (auch die Musterlösung nur mit diesen Wörtern). Die Aufgabe selbst auf ${APP.explain}, konkret (wer, was, wo), und direkt an ${APP.learner} gerichtet in der Du-Form (z. B. „Frag die Kellnerin, ob …“, „Schreib, dass du …“) – nie in der dritten Person über ${APP.learner}, keine Selbstkorrekturen oder Alternativen im Aufgabentext. Die Musterlösung muss genau diese Aufgabe erfüllen und grammatisch korrekt sein (Formen wie in den VORBILDERN). ${practiceVariety(t, "s")}
JSON: {"task": "Aufgabe auf ${APP.explain}", "words": ["2–4 ${APP.target.adj}e Wörter, die vorkommen sollen"], "sample": "eine korrekte Musterlösung auf ${APP.target.name}"}`,
        meta,
        0.7
      );
    if (SESSION !== se) return;
    se.task = {
      task: String(j.task || ""),
      words: (j.words || []).map(String).slice(0, 5),
      sample: String(j.sample || "")
    };
    /* Muster nur zeigen, wenn eine zweite, strenge Prüfung es bestätigt (oder verbessert) – sonst gar keins */
    if (se.task.sample) {
      try {
        const v = await aiJSON(
          `Prüfe streng als ${APP.teacherKind}: Ist dieser Satz auf ${APP.target.name} grammatisch korrekt, natürlich (so würde man es wirklich sagen) und erfüllt er die Aufgabe? Ist die Aufgabe selbst eindeutig?\nAufgabe: ${se.task.task}\nSatz: ${se.task.sample}${SP.judge}\nJSON: {"ok": true oder false, "taskClear": true oder false, "fixed": "korrigierter, natürlicher Satz, der die Aufgabe erfüllt, oder leer"}`,
          { k: "schreiben" }
        );
        if (!v.ok) se.task.sample = String(v.fixed || "");
        if (v.taskClear === false) se.task.unclear = 1;
      } catch (e) {
        se.task.sample = "";
      }
      if (SESSION !== se) return;
    }
    /* unklare Aufgabe: einmal neu stellen lassen */
    if (se.task.unclear && !again) return startWrite(id, true);
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
  app().innerHTML = `${practiceBar(se.id, "Schreiben · " + t.title)}<div class="card">${writeBoxHTML(k.task, k.words, flagLink(se.aid, "Aufgabe fehlerhaft?"))}<div class="btnrow"><button class="btn ghost" id="wother" data-act="pwrite" data-id="${se.id}">Andere Aufgabe</button><button class="btn" data-act="pwcheck">Korrigieren</button></div><div id="fb"></div></div>`;
  $("#ans").focus();
}
async function checkWrite() {
  const se = SESSION;
  if (!se || se.kind !== "write" || se.busy) return;
  const user = ($("#ans").value || "").trim();
  if (!user) return;
  se.busy = true;
  $("#ans").disabled = true;
  showBtns('[data-act="pwcheck"],#wother', false);
  $("#fb").innerHTML = `<div class="fb wait">${APP.teacher} liest deinen Text ${dots()}</div>`;
  const t = T(se.id),
    k = se.task;
  try {
    const meta = { k: "schreiben" },
      j = await aiJSON(
        `${practiceContext(t)}

Schreibaufgabe: ${k.task}${k.words.length ? `\nZu verwendende Wörter: ${k.words.join(", ")}` : ""}
Text von ${APP.learner}: "${user}"${weakAsk()}

Korrigiere den Text wie eine gute Lehrkraft: Ist er sprachlich korrekt und erfüllt er die Aufgabe? Ist der Text korrekt, setze correct auf true, lass errors leer und ändere nichts. Nenne nur echte Fehler und begründe sie am besten mit der Theorie oben. ${JUDGE_RULES()} ${EXPLAIN_RULE()}
JSON: {"correct": true oder false, "corrected": "der Text mit allen Fehlern korrigiert, so nah wie möglich am Original", "errors": [{"wrong": "falsche Stelle", "right": "richtig", "why": "kurz warum, auf ${APP.explain}"}], "feedback": "1–2 Sätze auf ${APP.explain}: was gut war und worauf achten"${WEAK_TAGS ? ", " + WEAK_FIELD : ""}}`,
        meta
      );
    if (SESSION !== se) return;
    const errs = (j.errors || []).filter(x => x && x.wrong),
      g = j.correct && !errs.length ? [] : weakTags(j);
    const aid = aiAudit("schreiben", meta, {
      q: `${se.id} Korrektur: ${k.task}`,
      u: user,
      umax: 400,
      ok: !!j.correct,
      r: `${j.correct ? "richtig" : "Fehler"} – ${j.corrected || ""} | ${errs.map(x => `${x.wrong} → ${x.right} (${x.why})`).join("; ")} | ${j.feedback || ""}${weakText(g)}`,
      rmax: 600
    });
    weakNote("schreiben", se.id, g, aid);
    practiceLog({ k: "s", tid: se.id, task: k.task, text: user, fix: j.corrected || "", errs: errs.length });
    bumpStreak();
    save();
    SESSION = null; // Aufgabe erledigt: der Cloud-Abgleich darf wieder zusammenführen
    $("#fb").innerHTML =
      `<div class="fb ${j.correct ? "ok" : "bad"}"><b class="t">${j.correct ? "Sehr gut – das passt!" : "Fast – hier ist die Korrektur."}</b>${!j.correct && j.corrected ? `<p>${spk(j.corrected)}<b>${glossWords(j.corrected)}</b></p>` : ""}${errs.length ? `<ul class="perr">${errs.map(x => `<li><s>${esc(x.wrong)}</s> → <b>${esc(x.right)}</b>${x.why ? ` – ${esc(x.why)}` : ""}</li>`).join("")}</ul>` : ""}${j.feedback ? `<p>${esc(j.feedback)}</p>` : ""}${k.sample ? `<p class="muted">Beispiel: ${spk(k.sample)}${glossWords(k.sample)}</p>` : ""}${flagLink(aid)}</div>` +
      `<div class="btnrow"><button class="btn" data-act="pwrite" data-id="${se.id}">Neue Aufgabe</button><button class="btn ghost" data-act="topic" data-id="${se.id}">Zum Thema</button></div>`;
  } catch (e) {
    if (SESSION !== se) return;
    se.busy = false;
    $("#ans").disabled = false;
    showBtns('[data-act="pwcheck"],#wother', true);
    $("#fb").innerHTML = practiceErr();
  }
}

/* ---------- Rollenspiel ---------- */
async function startChat(id) {
  const t = T(id);
  if (!t) return;
  if (!practiceReady(id)) return toast(`Erst wenn das Thema sitzt (ab ${Math.round(PRACTICE_MIN * 100)} %)`);
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

Starte ein kurzes Rollenspiel zur Alltagssituation dieses Themas. Du spielst eine passende Person (z. B. Verkäuferin, Kellner, Nachbarin), ${APP.learner} spielt sich selbst. Sprich sehr einfach, im Niveau des Themas. ${WORD_RULE} Wähle die Situation so, dass sie mit diesen Wörtern gut machbar ist. Die erste Zeile passt genau zur Szene und zu deiner Rolle (z. B. Begrüßung und Frage der Kellnerin); sprich ${APP.learner} direkt an und erwähne nur Personen, die in der Szene vorkommen – kein „er/sie“ ohne klaren Bezug.${practiceVariety(t, "r")}
JSON: {"scene": "Situation in 1 Satz auf ${APP.explain}", "role": "deine Rolle auf ${APP.explain}", "goal": "was ${APP.learner} im Gespräch erreichen soll, auf ${APP.explain}", "opener": "deine erste Zeile auf ${APP.target.name}", "opener_tr": "Übersetzung der ersten Zeile auf ${APP.base.name}", "new": [{"fi": "Grundform", "de": "Bedeutung"}]}`,
        meta,
        0.7
      );
    if (SESSION !== se) return;
    Object.assign(se, {
      scene: String(j.scene || ""),
      role: String(j.role || APP.teacher),
      goal: String(j.goal || ""),
      busy: false
    });
    const nw = practiceNew(j.new);
    se.msgs.push({ who: "ai", t: String(j.opener || ""), tr: String(j.opener_tr || ""), nw });
    se.aid = aiAudit("rollenspiel", meta, {
      q: `${id} Szene: ${se.scene} (${se.role})`,
      r: `${j.opener} = ${j.opener_tr}${nwText(nw)}`
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
    return `<div class="cmsg me"><div>${esc(m.t)}</div>${m.fix ? `<div class="cfix">✎ ${spk(m.fix)}<b>${glossWords(m.fix)}</b>${m.note ? `<small>${esc(m.note)}</small>` : ""}${flagLink(m.aid)}</div>` : m.ok ? '<div class="cok">✓</div>' : ""}</div>`;
  return `<div class="cmsg"><div>${spk(m.t)}${glossWords(m.t)}</div>${newWordsHTML(m.nw)}${m.tr ? `<details><summary>Übersetzung</summary>${esc(m.tr)}</details>` : ""}</div>`;
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
Neue Antwort von ${APP.learner}: "${user}"${weakAsk()}

1) Prüfe die Antwort von ${APP.learner}: sprachlich korrekt (Grammatik, Wortwahl, Endungen) und passend im Gespräch? Wenn nicht korrekt: korrigierte Fassung, so nah wie möglich am Original, und eine sehr kurze Erklärung auf ${APP.explain}. ${JUDGE_RULES()} ${EXPLAIN_RULE()}
2) Antworte in deiner Rolle kurz (1–2 sehr einfache Sätze auf ${APP.target.name}) und halte das Gespräch mit einer Rückfrage in Gang. ${WORD_RULE}${se.turns >= CHAT_TURNS - 1 ? " Das Gespräch soll jetzt freundlich enden: verabschiede dich und setze end auf true." : " Ist das Ziel erreicht und das Gespräch natürlich zu Ende, verabschiede dich und setze end auf true."}
JSON: {"ok": true oder false, "fix": "korrigierte Fassung oder leer", "note": "kurze Erklärung oder leer", "reply": "deine Antwort auf ${APP.target.name}", "reply_tr": "Übersetzung deiner Antwort auf ${APP.base.name}", "new": [{"fi": "Grundform", "de": "Bedeutung"}], "end": false${WEAK_TAGS ? ", " + WEAK_FIELD : ""}}`,
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
    const nw = practiceNew(j.new),
      g = j.ok ? [] : weakTags(j);
    me.aid = aiAudit("rollenspiel", meta, {
      q: `${se.id} ${se.role}: ${se.msgs[se.msgs.length - 2] ? se.msgs[se.msgs.length - 2].t : ""}`,
      u: user,
      umax: 300,
      ok: !!j.ok,
      r: `${j.ok ? "richtig" : "Korrektur: " + (j.fix || "") + " – " + (j.note || "")} | Antwort: ${j.reply || ""}${nwText(nw)}${weakText(g)}`
    });
    weakNote("rollenspiel", se.id, g, me.aid);
    if (j.reply) se.msgs.push({ who: "ai", t: String(j.reply), tr: String(j.reply_tr || ""), nw });
    se.busy = false;
    if (j.end || se.turns >= CHAT_TURNS || se.endAfter) return endChat();
    renderChat();
    if (S.settings.autoplay && j.reply) speak(String(j.reply));
  } catch (e) {
    if (SESSION !== se) return;
    se.msgs.pop();
    se.turns--;
    se.busy = false;
    if (se.endAfter) return endChat();
    renderChat();
    const ci = $("#chatin");
    if (ci) ci.value = user;
    toast(`${APP.teacher} nicht erreichbar: ${aiErrShort()}`);
  }
}
async function endChat() {
  const se = SESSION;
  if (!se || se.kind !== "chat" || se.ended) return;
  /* Läuft noch eine Antwort, wird das Gespräch danach beendet (sonst überschreibt sie die Rückmeldung) */
  if (se.busy) {
    se.endAfter = true;
    toast("Das Gespräch endet nach der nächsten Antwort");
    return;
  }
  se.ended = true;
  se.busy = false;
  renderChat();
  const box = $("#chatend"),
    mine = se.msgs.filter(m => m.who === "me");
  const done = (fb, extra) => {
    SESSION = null; // Runde vorbei: der Cloud-Abgleich darf wieder zusammenführen
    box.innerHTML = `<div class="card"><div class="label">Rückmeldung</div>${fb}${extra || ""}<div class="btnrow"><button class="btn" data-act="pchat" data-id="${se.id}">Neues Rollenspiel</button><button class="btn ghost" data-act="topic" data-id="${se.id}">Zum Thema</button></div></div>`;
  };
  if (!mine.length) return done(`<p class="muted">Du hast noch nichts geschrieben.</p>`);
  box.innerHTML = `<div class="card"><p class="muted">${APP.teacher} schreibt dir eine Rückmeldung ${dots()}</p></div>`;
  let fb = "",
    fix = "";
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
      q: `${se.id} Rückmeldung: ${se.scene} (Ziel: ${se.goal})`,
      u: chatTranscript(se),
      umax: 900,
      ok: !!j.goal,
      r: `${j.goal ? "Ziel erreicht" : "Ziel nicht erreicht"} – ${j.summary || ""} | ${(j.tips || []).join("; ")}`,
      rmax: 500
    });
    fb += flagLink(aid);
    fix = j.summary || "";
  } catch (e) {
    fb = practiceErr();
  }
  practiceLog({ k: "r", tid: se.id, task: se.scene, text: mine.map(m => m.t).join(" / "), fix, errs: se.errs });
  bumpStreak();
  save();
  if (SESSION === se)
    done(
      fb,
      `<p class="muted">${mine.length} ${mine.length === 1 ? "Antwort" : "Antworten"}, ${se.errs ? se.errs + " mit Korrektur" : "alle ohne Korrektur"}.</p>`
    );
}
