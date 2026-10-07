/* Opi suomea – vokabeln.js: Vokabelkarten (Wörter eines neuen Themas, fällige/neue/zusätzliche Karten, Zurück), Tab Vokabeln, Hörverstehen, Hörtraining.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
/* ---------- Vokabeln ---------- */
/* ---------- Neues Thema: zuerst die Wörter (Wunsch von Matthias) ----------
   Beide Richtungen, falsche Karten kommen in der Runde wieder. Jede Karte, die einmal mit Schwer/Gut/Einfach
   bewertet wurde, bekommt c.tv = 1. Sind alle Karten des Themas so markiert, gilt S.topics[id].vocabDone und die
   Übungen werden frei. Diese Wörter zählen nicht gegen „Neue Wörter pro Tag“. */
function topicVocabIds(id) {
  const t = T(id);
  return t ? t.v.flatMap((w, i) => [id + "-" + i, id + "-" + i + "-r"]) : [];
}
function vocabReady(id) {
  const s = S.topics[id],
    t = T(id);
  return !t || !t.v.length || !s || s.status !== "new" || !!s.vocabDone || !!(S.active && S.active.id === id);
}
function topicVocabProgress(id) {
  const ids = topicVocabIds(id);
  return { ok: ids.filter(x => S.cards[x] && S.cards[x].tv).length, all: ids.length };
}
function startTopicVocab(id) {
  const t = T(id);
  if (!t) return;
  addCards(t);
  const open = x => !(S.cards[x] && S.cards[x].tv),
    fwd = t.v.map((w, i) => id + "-" + i);
  /* erst alle Finnisch → Deutsch, dann alle Deutsch → Finnisch – so stehen die beiden Richtungen eines Wortes nie direkt hintereinander */
  const q = [...shuffle(fwd.filter(open)), ...shuffle(fwd.map(x => x + "-r").filter(open))];
  if (!q.length) {
    S.topics[id].vocabDone = Date.now();
    save();
    return render();
  }
  save();
  SESSION = { kind: "vocab", queue: q, done: 0, again: 0, shown: false, topicVocab: id };
  CUR = { tab: "topics", arg: id };
  setTab("topics");
  renderCard();
  scrollTo(0, 0);
}
function startVocab() {
  const q = onePerWord([...shuffle(dueToday()), ...newCardsAvail()]);
  if (!q.length) {
    toast("Gerade keine Karten fällig");
    return;
  }
  SESSION = { kind: "vocab", queue: q, done: 0, again: 0, shown: false };
  CUR = { tab: "vocab", arg: null };
  setTab("vocab");
  renderCard();
}
function extraNewCards() {
  return onePerWord([...newFwdIds(), ...newRevIds()]);
}
/* Was „Zusätzlich Vokabeln lernen“ als Nächstes bringt (Heute + Rundenende) */
function allPracticedToday() {
  const L = learnedCardIds(),
    sod = startOfDay();
  return L.length > 0 && L.every(id => (S.cards[id].xp || 0) >= sod);
}
function extraVocabText() {
  const nx = extraNewCards().length,
    n = S.settings.extraCards;
  if (!nx && allPracticedToday())
    return `Alle ${learnedWords()} gelernten Wörter hast du heute schon extra geübt – jetzt kommen Wiederholungen. Tipp: Morgen weiterüben bringt mehr, oder lerne ein neues Thema für neue Wörter.`;
  return nx
    ? nx < n
      ? `${nx} weitere neue ${nx === 1 ? "Wort" : "Wörter"} (mehr gibt es gerade nicht) – über dein Tageslimit hinaus.`
      : `${n} weitere neue Wörter – über dein Tageslimit hinaus.`
    : `${Math.min(n, onePerWord(learnedCardIds()).length)} gelernte Wörter extra üben – vergessene Wörter kommen früher wieder.`;
}
function learnedCardIds() {
  return Object.keys(S.cards).filter(id => !S.cards[id].isNew && cardWord(id));
}
function startExtraVocab() {
  const nw = extraNewCards().slice(0, S.settings.extraCards);
  if (nw.length) SESSION = { kind: "vocab", queue: nw, done: 0, again: 0, shown: false, extra: "new" };
  else {
    const sod = startOfDay(),
      xpToday = id => (S.cards[id].xp || 0) >= sod;
    /* heute schon extra Geübtes erst, wenn alle anderen dran waren */
    const pool = shuffle(learnedCardIds()),
      learned = onePerWord([...pool.filter(id => !xpToday(id)), ...pool.filter(xpToday)]).slice(
        0,
        S.settings.extraCards
      );
    if (!learned.length) {
      toast("Lerne zuerst ein Thema");
      return;
    }
    SESSION = { kind: "vocab", queue: learned, done: 0, again: 0, shown: false, extra: "practice" };
  }
  CUR = { tab: "vocab", arg: null };
  setTab("vocab");
  renderCard();
  scrollTo(0, 0);
}
function renderCard() {
  const se = SESSION;
  if (!se.queue.length) return finishVocab();
  const id = se.queue[0],
    w = cardWord(id),
    c = S.cards[id];
  if (!w) {
    se.queue.shift();
    return renderCard();
  }
  se.dir = cardDir(id);
  se.shown = false;
  app().innerHTML = `<div class="sbar"><small>${se.queue.length} übrig</small><span style="flex:1"></span>${se.hist && se.hist.length ? `<button class="xbtn" data-act="cundo">↶ Zurück</button>` : ""}${se.topicVocab ? `<button class="xbtn" data-act="topic" data-id="${se.topicVocab}">Später</button>` : `<button class="xbtn" data-act="tab" data-id="vocab">Beenden</button>`}</div>
  <div class="card flash"><div class="ask">${se.topicVocab ? `<span class="badge">${esc((T(se.topicVocab) || {}).title || "")}</span> ` : ""}${se.leech ? '<span class="badge">Problemwort</span> ' : se.extra ? '<span class="badge">Extra</span> ' : ""}${se.extra === "practice" && c.xpd === todayKey() && c.xpn ? `<span class="badge" style="background:var(--lakka-bg);color:var(--lakka-ink)">heute schon ${c.xpn}× geübt</span> ` : ""}${c.isNew ? '<span class="badge new">Neues Wort</span> ' : ""}${se.dir === "fi" ? "Was heißt das auf " + APP.base.name + "?" : "Wie heißt das auf " + APP.target.name + "?"}</div>
  <div class="front">${esc(se.dir === "fi" ? w[0] : w[1])}</div>${se.dir === "fi" ? `<div class="center" style="margin-bottom:14px">${spk(w[0], true)}</div>` : ""}<div id="back"></div>
  <div id="cact">${se.dir === "de" ? charKeys() : ""}<input id="ans" class="inp" placeholder="Antwort tippen (optional)" autocomplete="off" autocapitalize="off" spellcheck="false"><div class="btnrow"><button class="btn" data-act="flip">Aufdecken</button></div></div></div>`;
  if (se.dir === "fi" && S.settings.autoplay) speak(w[0]);
}
const VOC_AI = {};
async function vocabJudge(w, dir, typed) {
  const k = dir + "|" + w[0] + "|" + norm(typed);
  if (VOC_AI[k]) return VOC_AI[k];
  const p = `Vokabelkarte (${dir === "fi" ? APP.target.name + " → " + APP.base.name : APP.base.name + " → " + APP.target.name})
${APP.target.name}: ${w[0]}
${APP.base.name}: ${w[1]}
Gefragt war: ${dir === "fi" ? "die " + APP.base.adj + "e Bedeutung von „" + w[0] + "“" : "das " + APP.target.adj + "e Wort/den " + APP.target.adj + "en Ausdruck für „" + w[1] + "“"}
Antwort von ${APP.learner}: "${typed}"

Bewerte, ob ${APP.learner} die Vokabel kann. Es geht um die Bedeutung, nicht um den exakten Wortlaut.${dir === "fi" ? " Auf " + APP.base.name + " zählt jede gleichwertige Formulierung als richtig: Kurz- und Langformen (z. B. „wie geht's“ = „wie geht es dir“ = „wie geht es“), Synonyme, andere Wortstellung, mit oder ohne Artikel/Pronomen, Umgangssprache, Groß-/Kleinschreibung, Tippfehler. Falsch nur, wenn die Bedeutung nicht stimmt." : " Auf " + APP.target.name + ": " + JUDGE_RULES() + " Ein anderes Wort, eine falsche Endung oder eine falsche Form ist falsch."}
JSON: {"correct": true oder false, "feedback": "1 kurzer Satz auf ${APP.explain}"}`;
  const meta = { k: "vokabel" },
    j = await aiJSON(p, meta);
  j._aid = aiAudit("vokabel", meta, {
    q: `${dir === "fi" ? DIR_FWD : DIR_REV}: ${w[0]} = ${w[1]}`,
    u: typed,
    ok: !!j.correct,
    r: `${j.correct ? "richtig" : "falsch"} – ${j.feedback || ""}`
  });
  VOC_AI[k] = j;
  return j;
}
/* Eigene Eingabe mit der Lösung vergleichen: Buchstaben, die nicht zur Lösung passen, werden markiert */
function charDiff(typed, ref) {
  const a = [...typed],
    b = [...ref],
    L = x => x.toLowerCase();
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      dp[i][j] = L(a[i]) === L(b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  let i = 0,
    j = 0,
    out = "";
  while (i < a.length) {
    if (j < b.length && L(a[i]) === L(b[j])) {
      out += esc(a[i]);
      i++;
      j++;
    } else if (j < b.length && dp[i][j + 1] >= dp[i + 1][j]) j++;
    else out += `<b class="dx">${esc(a[i++])}</b>`;
  }
  return out;
}
function closest(typed, list) {
  const n = s => norm(s).replace(/\s+/g, "");
  let best = list[0] || "",
    sc = -1;
  list.forEach(x => {
    const a = n(typed),
      b = n(x);
    let m = 0;
    for (const ch of a) if (b.includes(ch)) m++;
    const s = m - Math.abs(a.length - b.length);
    if (s > sc) {
      sc = s;
      best = x;
    }
  });
  return best;
}
function flipCard() {
  const se = SESSION;
  if (se.shown) return;
  se.shown = true;
  const id = se.queue[0],
    w = cardWord(id),
    c = S.cards[id];
  const typed = ($("#ans")?.value || "").trim();
  const dir = se.dir;
  let cmp = "",
    askAI = false;
  if (typed) {
    const acc =
      dir === "de"
        ? [w[0]]
        : [
            w[1],
            ...w[1].replace(/\(.*?\)/g, "").split(/[,/;]/),
            ...(w[1].match(/\((.*?)\)/g) || [])
              .flatMap(x => x.slice(1, -1).split(/[,;]/))
              .map(x => x.replace(/^\s*auch:\s*/, ""))
          ]
            .map(x => x.trim())
            .filter(Boolean);
    const r = localCheck(typed, acc, false);
    se.typed = typed;
    const mine = `<div class="cmp typed">Deine Eingabe: <span class="mine">${r.correct ? esc(typed) : charDiff(typed, closest(typed, acc))}</span></div>`;
    if (r.correct)
      cmp = `${mine}<div class="cmp" style="color:var(--kuusi)">✓ Richtig getippt${r.note ? " – " + SP.charNote : ""}</div>`;
    else if (aiReady()) {
      askAI = true;
      cmp = `${mine}<div class="cmp muted" id="vjudge">${APP.teacher} prüft ${dots()}</div>`;
    } else cmp = `${mine}<div class="cmp" style="color:var(--puolukka)">✗ Stimmt nicht mit der Lösung überein</div>`;
  } else se.typed = "";
  $("#back").innerHTML =
    `<div class="backside">${esc(dir === "fi" ? w[1] : w[0])}<small>${esc(dir === "fi" ? w[0] : w[1])}</small></div>${dir === "de" ? `<div class="center" style="margin-bottom:12px">${spk(w[0], true)}</div>` : ""}${cmp}<div id="askex"><p class="aiflagp"><a href="#" class="aiflag" data-act="askex">❓ Frag ${esc(APP.teacher)}</a></p></div>`;
  if (askAI)
    vocabJudge(w, dir, typed)
      .then(j => {
        const el = $("#vjudge");
        if (!el || SESSION !== se) return;
        el.classList.remove("muted");
        el.style.color = j.correct ? "var(--kuusi)" : "var(--puolukka)";
        el.innerHTML = (j.correct ? "✓ Richtig – " : "✗ Nicht ganz – ") + esc(j.feedback || "") + flagLink(j._aid);
      })
      .catch(() => {
        const el = $("#vjudge");
        if (!el || SESSION !== se) return;
        el.classList.remove("muted");
        el.style.color = "var(--puolukka)";
        el.innerHTML = `✗ Stimmt nicht mit der Lösung überein <small class="muted">(${APP.teacher} nicht erreichbar: ${esc(aiErrShort())})</small>`;
      });
  if (se.dir === "de" && S.settings.autoplay) speak(w[0]);
  const practice = se.extra === "practice",
    counted = !practice || !(se.seen || {})[id];
  $("#cact").innerHTML = `<div class="rates">${RATINGS.map(r => {
    const when = !counted
      ? "nur Übung"
      : practice
        ? relDays(practiceDue(c, r.q))
        : ivLabel(sm2Next(c, r.q, lateDays(c)).interval);
    return `<button class="rate ${r.k}" data-act="crate" data-id="${r.k}"><b>${r.l}</b><small>${when}</small></button>`;
  }).join(
    ""
  )}</div><p class="muted" style="margin:6px 0 0;font-size:12px;text-align:center">${counted ? "Unter den Knöpfen: wann das Wort wiederkommt." : "Schon bewertet – zählt nur deine erste Antwort; der Plan ändert sich nicht mehr."}</p>`;
}
/* Gelernte Wörter extra üben: wirkt vorsichtig auf den Plan der Karte.
   Nochmal = wie ein Fehler (morgen wieder, Abstand von vorn); Schwer = Termin rückt auf die halbe Restzeit;
   Gut/Einfach = bei Fälligkeit in ≤ 2 Tagen eine normale Wiederholung; sonst Anrechnung nach der echten Pause seit der
   letzten Wiederholung (wie Anki bei vorgezogenen Wiederholungen): neuer Abstand = Pause × Ease (Einfach × 1,3),
   nur wenn das später liegt als der bisherige Termin. Am selben Tag keine Verlängerung (Kurzzeitgedächtnis).
   c.xp = zuletzt extra geübt (damit heute Geübtes nicht in Dauerschleife kommt). */
/* Probelauf von practiceRate auf einer Kopie: neuer Termin, ohne etwas zu ändern (für die Anzeige unter den Knöpfen) */
function practiceDue(c, q) {
  const k = JSON.parse(JSON.stringify(c)),
    r = S.stats.reviews;
  practiceRate(k, q);
  S.stats.reviews = r;
  return k.due || Date.now();
}
function practiceRate(c, q) {
  if (!c) return;
  const now = Date.now();
  c.xp = now;
  if (c.xpd !== todayKey()) {
    c.xpd = todayKey();
    c.xpn = 0;
  }
  c.xpn++;
  if (q < 3) {
    Object.assign(c, sm2Next(c, q));
    c.due = addDays(1);
    c.last = now;
    S.stats.reviews++;
    return;
  }
  const left = (c.due || now) - now;
  if (q === 3) {
    if (left > 0) {
      const d = Math.max(1, Math.ceil(left / DAY / 2));
      c.due = Math.min(c.due, addDays(d));
      c.interval = Math.max(1, Math.round((c.interval || 1) / 2));
    }
    /* gewusst, nur mühsam: Termin vorziehen, aber die Leichtigkeit nicht senken (E-1007-60) */
    c.last = now;
    S.stats.reviews++;
    return;
  }
  /* heute schon wiederholt: kein zweites Mal verlängern – das prüft nur das Kurzzeitgedächtnis (E-1007-60) */
  if (c.last && c.last >= startOfDay()) return;
  if (left <= 2 * DAY) {
    const n = sm2Next(c, q, lateDays(c));
    Object.assign(c, n);
    c.due = addDays(n.interval);
    c.last = now;
    S.stats.reviews++;
    return;
  }
  const lastRev = c.last || (c.due || now) - (c.interval || 0) * DAY,
    pause = Math.round((startOfDay(now) - startOfDay(lastRev)) / DAY);
  if (pause < 1) return;
  const iv = Math.round(pause * (c.ease || 2.5) * (q === 5 ? 1.3 : 1));
  if (addDays(iv) > c.due) {
    c.due = addDays(iv);
    c.interval = iv;
    c.reps = (c.reps || 0) + 1;
    c.last = now;
    S.stats.reviews++;
  }
}
function rateCard(k) {
  const se = SESSION;
  if (!se || !se.shown) return;
  /* Schnappschuss für „↶ Zurück“: Karte, Zähler und Rundenstand vor dieser Bewertung */
  {
    const id = se.queue[0];
    (se.hist = se.hist || []).push({
      id,
      card: JSON.stringify(S.cards[id]),
      newCards: S.daily.newCards,
      newRev: S.daily.newRev || 0,
      rev: S.daily.rev || 0,
      revSeen: { ...(se.revSeen || {}) },
      reviews: S.stats.reviews,
      queue: se.queue.slice(),
      done: se.done,
      again: se.again,
      seen: { ...(se.seen || {}) }
    });
  }
  /* Problemwort-Zähler: jede Antwort (auch beim Extra-Üben), pro Tag zählt eine richtige */
  leechTick(S.cards[se.queue[0]], RQ[k] >= 3);
  if (se.extra === "practice") {
    const id = se.queue.shift(),
      q = RQ[k];
    se.seen = se.seen || {};
    if (!se.seen[id]) {
      se.seen[id] = 1;
      practiceRate(S.cards[id], q);
    } /* nur die erste Antwort je Karte zählt */
    if (q < 3) {
      se.queue.push(id);
      se.again++;
    } else se.done++;
    save();
    return renderCard();
  }
  const id = se.queue.shift(),
    c = S.cards[id],
    q = RQ[k],
    tk = todayKey(),
    wasNew = !!c.isNew;
  let n = sm2Next(c, q, lateDays(c));
  /* Lernschritte wie bei Anki (E-1007-58): Beim ersten Lernen und nach einem Vergessen zählt ein weiteres „Nochmal“ am
     selben Tag nicht noch einmal als Vergessen und senkt die Leichtigkeit nicht erneut */
  if (q < 3 && (wasNew || c.learnDay === tk || c.lapseDay === tk))
    n = { ...n, lapses: c.lapses || 0, ease: c.ease ?? 2.5 };
  else if (q < 3) c.lapseDay = tk;
  if (wasNew) {
    c.isNew = false;
    c.learnDay = tk;
    /* auch Themenwörter zählen zum Tageslimit für neue Wörter (E-1007-59) */
    if (cardParse(id).rev) S.daily.newRev = (S.daily.newRev || 0) + 1;
    else S.daily.newCards++;
  } else if (!(se.revSeen || (se.revSeen = {}))[id]) {
    se.revSeen[id] = 1;
    S.daily.rev = (S.daily.rev || 0) + 1;
  }
  if (se.topicVocab && q >= 3) c.tv = 1;
  Object.assign(c, n);
  c.last = Date.now();
  if (q < 3) {
    c.due = Date.now() + 60000;
    se.queue.push(id);
    se.again++;
  } else {
    c.due = addDays(n.interval);
    se.done++;
  }
  S.stats.reviews++;
  save();
  renderCard();
}
/* „↶ Zurück“: letzte Bewertung vollständig rückgängig machen und die Karte aufgedeckt wieder zeigen */
let VOCAB_DONE = null;
function undoCard() {
  if (!SESSION && VOCAB_DONE) {
    SESSION = VOCAB_DONE;
    CUR = { tab: "vocab", arg: null };
    setTab("vocab");
  }
  VOCAB_DONE = null;
  const se = SESSION;
  if (!se || se.kind !== "vocab" || !se.hist || !se.hist.length) return;
  const x = se.hist.pop();
  S.cards[x.id] = JSON.parse(x.card);
  if (se.topicVocab && S.topics[se.topicVocab]) S.topics[se.topicVocab].vocabDone = null;
  S.daily.newCards = x.newCards;
  S.daily.rev = x.rev || 0;
  se.revSeen = x.revSeen || {};
  S.daily.newRev = x.newRev;
  S.stats.reviews = x.reviews;
  se.queue = x.queue;
  se.done = x.done;
  se.again = x.again;
  se.seen = x.seen;
  save();
  renderCard();
  flipCard();
  toast("Letzte Bewertung zurückgenommen – wähle neu");
}
function finishVocab() {
  const se = SESSION;
  bumpStreak();
  save();
  SESSION = null;
  VOCAB_DONE = se;
  if (se.topicVocab) {
    const id = se.topicVocab,
      pr = topicVocabProgress(id);
    if (pr.ok === pr.all) S.topics[id].vocabDone = Date.now();
    save();
    return doneScreen(
      pr.ok === pr.all
        ? `Alle ${pr.all / 2} Wörter in beiden Richtungen gewusst – die Übungen sind jetzt frei.`
        : `${pr.ok} von ${pr.all} Karten geschafft.`,
      `<div class="btnrow">${pr.ok === pr.all ? `<button class="btn" data-act="learn" data-id="${id}">Weiter zu den Übungen</button>` : `<button class="btn" data-act="tvocab" data-id="${id}">Weiterlernen</button>`}</div><div class="btnrow">${se.hist && se.hist.length ? `<button class="btn ghost" data-act="cundo">↶ Letzte Bewertung ändern</button>` : ""}<button class="btn ghost" data-act="topic" data-id="${id}">Zum Thema</button></div>`
    );
  }
  if (se.leech)
    return doneScreen(
      `${se.done} ${se.done === 1 ? "Problemwort" : "Problemwörter"} geübt${se.again ? `, ${se.again}× wiederholt` : ""}.`,
      againRow("leech")
    );
  doneScreen(
    `${se.done} ${se.done === 1 ? "Karte" : "Karten"} geschafft${se.again ? `, ${se.again}× wiederholt` : ""}.`,
    (learnedCardIds().length || extraNewCards().length
      ? `<div class="btnrow"><button class="btn" data-act="extravocab">${se.extra ? "Weitere Vokabeln lernen" : "Zusätzlich Vokabeln lernen"}</button></div><p class="muted" style="margin:6px 0 0">${esc(extraVocabText())}</p>`
      : "") +
      `<div class="btnrow">${se.hist && se.hist.length ? `<button class="btn ghost" data-act="cundo">↶ Letzte Bewertung ändern</button>` : ""}<button class="btn ghost" data-act="tab" data-id="today">Zurück zu Heute</button></div>`
  );
}
function renderVocab() {
  const learned = learnedWords();
  const all = dueCards().length,
    dc = dueToday().length,
    nc = newCardsAvail().length;
  let h = `<h2>Vokabeln</h2><div class="next"><div class="label">Heute</div><h2>${dc} fällig, ${nc} neu</h2>${all > dc ? `<p class="muted">Rückstand: ${all - dc} weitere kommen an den nächsten Tagen (Tageslimit ${S.settings.maxReviews ?? 150}, einstellbar).</p>` : ""}${dc + nc ? `<button class="btn" data-act="vocab">Jetzt lernen</button>` : `<p>${Object.keys(S.cards).length ? "Für den Moment ist alles wiederholt." : "Lerne dein erstes Thema – dann landen die Wörter hier."}</p>`}</div>`;
  h += vocabExtrasHTML(learned);
  if (listenSentences().length >= 3)
    h += `<div class="card"><div class="label">Hörverstehen: ganze Sätze</div><p class="muted">Du hörst einen Satz aus deinen gelernten Themen und schreibst auf ${APP.base.name}, was er bedeutet. Der Wortlaut ist egal – ${APP.teacher} prüft die Bedeutung.</p><button class="btn ghost" data-act="listens">Sätze hören</button></div>`;
  if (learned >= 3)
    h += `<div class="card"><div class="label">Hörtraining</div><p class="muted">Du hörst ein gelerntes Wort und schreibst es auf ${APP.target.name}. Trainiert Ohr und Rechtschreibung, ohne deinen Lernplan zu verändern.</p><button class="btn ghost" data-act="listen">Hörtraining starten</button></div>`;
  h += ownCardHTML();
  if (Object.keys(S.cards).length)
    h += `<p class="muted" style="font-size:13px;margin:4px 2px 10px">${STATE_LEGEND}</p>`;
  TOPICS.forEach(t => {
    const ids = t.v.map((w, i) => t.id + "-" + i).filter(id => S.cards[id]);
    if (!ids.length) return;
    const stl = (id, lbl) => {
      const c = S.cards[id];
      if (!c) return "";
      const st = cardState(c);
      return `<span class="st ${st}">${lbl} ${STATE_L[st]}${c.isNew ? "" : " · " + relDays(c.due)}</span>`;
    };
    h += `<div class="card"><div class="label">${esc(t.title)}</div>${ids
      .map(id => {
        const w = cardWord(id);
        return `<div class="vrow" style="align-items:center">${spk(w[0])}<div class="vbody"><div><span class="w">${esc(w[0])}</span> <span class="d">${esc(w[1])}</span>${leechMark(id)}</div><div class="sts">${stl(id, DIR_FWD)}${stl(id + "-r", DIR_REV)}</div></div></div>`;
      })
      .join("")}</div>`;
  });
  app().innerHTML = h;
}

/* ---------- Hörverstehen: ganze Sätze ---------- */
function listenSentences() {
  const out = [];
  TOPICS.forEach(t => {
    if (S.topics[t.id].status !== "learning") return;
    t.ex.forEach(e => {
      if (e.t === "tr" && e.dir === "fi") out.push({ fi: e.q, de: e.a });
      else if (e.t === "tr" && e.dir === "de") out.push({ fi: e.a[0], de: [e.q] });
      else if (e.t === "ord") out.push({ fi: e.a, de: [e.de] });
    });
  });
  const seen = new Set();
  return out.filter(x => {
    const k = norm(x.fi);
    if (seen.has(k) || x.fi.split(" ").length < 2) return false;
    seen.add(k);
    return true;
  });
}
function startListenS() {
  const q = shuffle(listenSentences()).slice(0, 8);
  if (!q.length) return;
  SESSION = { kind: "listenS", queue: q, idx: 0, ok: 0, shown: false };
  CUR = { tab: "vocab", arg: null };
  setTab("vocab");
  renderListenS();
}
function renderListenS() {
  const se = SESSION;
  if (se.idx >= se.queue.length) {
    const n = se.queue.length,
      ok = se.ok;
    SESSION = null;
    bumpStreak();
    save();
    doneScreen(`${ok} von ${n} Sätzen verstanden.`, againRow("listens"));
    return;
  }
  const x = se.queue[se.idx];
  se.shown = false;
  app().innerHTML = `<div class="sbar"><div class="prog"><i style="width:${(se.idx / se.queue.length) * 100}%"></i></div><small>${se.idx + 1}/${se.queue.length}</small><button class="xbtn" data-act="tab" data-id="vocab">Beenden</button></div>
  <div class="card flash"><div class="ask">Was bedeutet der Satz? Schreib ihn auf ${APP.base.name}.</div><div class="center" style="padding:22px 0">${spk(x.fi, true)}</div>
  <input id="ans" class="inp" autocomplete="off" spellcheck="false" placeholder="Auf ${APP.base.name} …"><div class="btnrow"><button class="btn ghost" data-act="lsreveal">Text zeigen</button><button class="btn" data-act="lscheck">Prüfen</button></div><div id="fb"></div></div>`;
  speak(x.fi);
}
async function checkListenS(reveal) {
  const se = SESSION;
  if (!se || se.shown) return;
  const u = ($("#ans").value || "").trim();
  if (!u && !reveal) return;
  se.shown = true;
  const x = se.queue[se.idx];
  $("#ans").disabled = true;
  showBtns('[data-act="lscheck"],[data-act="lsreveal"]', false);
  let r = u ? localCheck(u, x.de, false) : { correct: false },
    fb = "";
  if (u && !r.correct && aiReady()) {
    $("#fb").innerHTML = `<div class="fb wait">${APP.teacher} prüft ${dots()}</div>`;
    try {
      const meta = { k: "hoeren" };
      const j = await aiJSON(
        `Hörverstehen. ${ucFirst(APP.target.adj)}er Satz: "${x.fi}". Bedeutung: ${x.de.join(" / ")}. ${APP.learner} hat verstanden: "${u}". Stimmt die Bedeutung im Wesentlichen (Wortlaut egal)?\nJSON: {"correct": true oder false, "feedback": "1 kurzer Satz auf ${APP.explain}"}`,
        meta
      );
      r = { correct: !!j.correct };
      fb = j.feedback || "";
      r.aid = aiAudit("hoeren", meta, {
        q: x.fi,
        sol: x.de.join(" / "),
        u,
        ok: !!j.correct,
        r: `${j.correct ? "richtig" : "falsch"} – ${fb}`
      });
    } catch (e) {}
  }
  if (SESSION !== se) return;
  if (r.correct) se.ok++;
  listenAdd("s", !!r.correct);
  $("#fb").innerHTML =
    `<div class="fb ${r.correct ? "ok" : reveal && !u ? "dunno" : "bad"}"><b class="t">${r.correct ? UI.rightShort : reveal && !u ? "So lautet der Satz:" : "Nicht ganz."}</b><p>${spk(x.fi)}<b>${glossWords(x.fi)}</b></p><p>${esc(x.de[0])}</p>${fb ? `<p class="muted">${esc(fb)}</p>${flagLink(r.aid)}` : ""}${u && !r.correct ? `<p class="muted">Du hast verstanden: ${esc(u)}</p>` : ""}</div><div class="btnrow"><button class="btn" data-act="lsnext" id="nextbtn">Weiter</button></div>`;
  $("#nextbtn").focus();
}
/* ---------- Hörtraining ---------- */
/* Ergebnisse für den Bericht (E-1007-31): je Gerät {w: [Versuche, richtig], s: [...]}, w = Wörter, s = Sätze */
function listenAdd(k, ok) {
  const d = devId(),
    L = (S.listen = S.listen || {}),
    x = (L[d] = L[d] || { w: [0, 0], s: [0, 0] });
  x[k][0]++;
  if (ok) x[k][1]++;
}
function startListen() {
  const ids = onePerWord(shuffle(learnedCardIds())).slice(0, 10);
  if (!ids.length) return;
  SESSION = { kind: "listen", queue: ids, idx: 0, ok: 0, shown: false };
  CUR = { tab: "vocab", arg: null };
  setTab("vocab");
  renderListen();
}
function renderListen() {
  const se = SESSION;
  if (se.idx >= se.queue.length) {
    const n = se.queue.length,
      ok = se.ok;
    SESSION = null;
    bumpStreak();
    save();
    doneScreen(`${ok} von ${n} richtig erkannt.`, againRow("listen"));
    return;
  }
  const w = cardWord(se.queue[se.idx]);
  se.shown = false;
  app().innerHTML = `<div class="sbar"><div class="prog"><i style="width:${(se.idx / se.queue.length) * 100}%"></i></div><small>${se.idx + 1}/${se.queue.length}</small><button class="xbtn" data-act="tab" data-id="vocab">Beenden</button></div>
  <div class="card flash"><div class="ask">Was hörst du? Schreib es auf ${APP.target.name}.</div><div class="center" style="padding:22px 0">${spk(w[0], true)}</div>
  ${charKeys()}<input id="ans" class="inp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Auf ${APP.target.name} …"><div class="btnrow"><button class="btn" data-act="lcheck">Prüfen</button></div><div id="fb"></div></div>`;
  speak(w[0]);
}
function checkListen() {
  const se = SESSION;
  if (se.shown) return;
  const u = ($("#ans").value || "").trim();
  if (!u) return;
  se.shown = true;
  const w = cardWord(se.queue[se.idx]),
    r = localCheck(u, [w[0]], false);
  if (r.correct) se.ok++;
  listenAdd("w", !!r.correct);
  $("#ans").disabled = true;
  showBtns('[data-act="lcheck"]', false);
  $("#fb").innerHTML =
    `<div class="fb ${r.correct ? "ok" : "bad"}"><b class="t">${r.correct ? UI.rightShort : "Nicht ganz."}</b><p>${spk(w[0])}<b>${esc(w[0])}</b> – ${esc(w[1])}</p>${r.note ? `<p>${esc(r.note)}</p>` : ""}${!r.correct ? `<p class="muted">Du hast geschrieben: ${esc(u)}</p>` : ""}</div><div class="btnrow"><button class="btn" data-act="lnext" id="nextbtn">Weiter</button></div>`;
  $("#nextbtn").focus();
}
