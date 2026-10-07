/* Lern-Engine – formate.js: alle Übungsformate an einer Stelle (FMT).
   Jedes Format liefert in FMT[t]: Prüfung der Daten (valid), Anzeige (render, danach optional after), Auswertung (check),
   Markierung bei „Weiß ich nicht“ (dunno), Text für Fehlerliste/Bericht (prompt, expected), Beschreibung für
   „Frag …“ (describe) und Angaben für die Rückmeldung: target(ex) = Lösung ist in der Lernsprache (vorlesen, antippbar; fehlt es: nein),
   inline = Lösungen stehen schon in der Aufgabe (kein „Richtig ist …“), fbLabel/fbExtra für Sonderfälle.
   Ein neues Format braucht nur einen Eintrag hier (plus Doku in docs/uebungsformate.md und einen Test).
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */

/* Zeile eines Lesetexts/Dialogs: „Name: Text“ → Sprecher + Text */
function fmtLine(s) {
  const m = /^([^:]{1,30}):\s+(.+)$/.exec(String(s));
  return m ? { who: m[1], txt: m[2] } : { who: "", txt: String(s) };
}
const isStr = x => typeof x === "string" && x.trim() !== "";

const hintHTML = ex => (ex.h ? `<div class="hint">${esc(ex.h)}</div>` : "");
const BTN_DUNNO = `<button class="btn ghost" data-act="dunno">Weiß ich nicht</button>`,
  BTN_ROW = `<div class="btnrow">${BTN_DUNNO}<button class="btn" data-act="check">Prüfen</button></div>`;
const inputHTML = ph =>
  `<input id="ans" class="inp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${ph}">`;

/* ---------- Multiple Choice: {t:"mc", q, o:[…], a, x?, h?} – ausgewertet direkt beim Antippen (answerMC) ---------- */
function mcRender(ex, se) {
  se.cur = { opts: shuffle(ex.o.map((o, i) => ({ o, ok: i === ex.a }))) };
  return `<div class="ask">Wähle die richtige Antwort</div><div class="q">${glossQuoted(ex.q)}</div>${hintHTML(ex)}<div class="opts">${se.cur.opts.map((o, i) => `<button class="opt" data-act="mc" data-id="${i}">${esc(o.o)}</button>`).join("")}</div><div class="btnrow">${BTN_DUNNO}</div>`;
}
function mcMark(se, chosen) {
  document.querySelectorAll(".opt").forEach((b, j) => {
    b.disabled = true;
    if (se.cur.opts[j].ok) b.classList.add("right");
    else if (j === chosen) b.classList.add("wrong");
  });
}
function answerMC(i) {
  const se = SESSION;
  if (!se || se.locked) return;
  se.locked = true;
  const ex = se.items[se.idx],
    o = se.cur.opts[i];
  showBtns('[data-act="dunno"]', false);
  mcMark(se, i);
  const res = { correct: o.ok, note: ex.x || "" };
  record(ex, o.o, res);
  showFb(res, ex);
}

/* ---------- Lückentext {t:"gap", q:"… ___ …", a:[…]} und Übersetzung {t:"tr", dir:"de"|"fi", q, a:[…]} ----------
   Zuerst lokal (textCheck in uebungen.js), passt nichts, prüft die KI (aiJudge in ki.js). */
function gapRender(ex) {
  return `<div class="ask">Ergänze die Lücke</div><div class="q">${ex.q
    .split("___")
    .map(x => glossWords(x))
    .join(
      '<span class="gap">&nbsp;?&nbsp;</span>'
    )}</div>${hintHTML(ex)}${charKeys()}${inputHTML("Deine Antwort")}${BTN_ROW}`;
}
function trRender(ex) {
  const toT = ex.dir === "de";
  return `<div class="ask">Übersetze ${toT ? APP.target.ins : APP.base.ins}</div><div class="q">${toT ? esc(ex.q) : spk(ex.q) + glossWords(ex.q)}</div>${hintHTML(ex)}${toT ? charKeys() : ""}${inputHTML("Auf " + (toT ? APP.target.name : APP.base.name) + " …")}${toT && vocabHint(ex).length ? `<div id="vhint"><p class="aiflagp"><a href="#" class="aiflag" data-act="vhint">💡 Vokabelhilfe</a></p></div>` : ""}${BTN_ROW}`;
}
const ansText = () => ($("#ans").value || "").trim();

/* ---------- Satz ordnen: {t:"ord", w:[Wörter], a:"Satz", de:"Bedeutung"} ---------- */
function ordRender(ex, se) {
  se.cur = { chips: shuffle(ex.w), picked: [] };
  return `<div class="ask">Bilde den ${APP.target.adj}en Satz</div><div class="q">${esc(ex.de)}</div>${hintHTML(ex)}<div id="ordarea"></div>${BTN_ROW}`;
}
function renderOrd() {
  const c = SESSION.cur,
    box = $("#ordarea");
  if (!box) return;
  const lock = SESSION.locked;
  box.innerHTML = `<div class="ordline">${c.picked.length ? c.picked.map((ci, pi) => `<button class="chip on" ${lock ? "disabled" : `data-act="unpick" data-id="${pi}"`}>${esc(c.chips[ci])}</button>`).join("") : '<span class="ph">Tippe die Wörter in der richtigen Reihenfolge an</span>'}</div><div class="chips">${c.chips.map((w, i) => (c.picked.includes(i) ? `<span class="chip ghost">${esc(w)}</span>` : `<button class="chip" ${lock ? "disabled" : `data-act="pick" data-id="${i}"`}>${esc(w)}</button>`)).join("")}</div>`;
}

/* ---------- Tabelle mit Lücken: {t:"tab", q, head?, r:[[…,"[Lösung|Alternative]"]]} ----------
   Zellen in [eckigen Klammern] sind Lücken; richtig nur, wenn alle Felder stimmen. */
function tabGap(c) {
  const m = /^\[(.*)\]$/.exec(String(c).trim());
  return m
    ? m[1]
        .split("|")
        .map(x => x.trim())
        .filter(Boolean)
    : null;
}
function tabGaps(ex) {
  const g = [];
  ex.r.forEach(row =>
    row.forEach(c => {
      const a = tabGap(c);
      if (a) g.push(a);
    })
  );
  return g;
}
function tabRender(ex) {
  let k = 0;
  return `<div class="ask">Fülle die Tabelle aus</div><div class="q">${esc(ex.q)}</div>${hintHTML(ex)}${charKeys()}<table class="tabex">${ex.head ? `<tr>${ex.head.map(x => `<th>${esc(x)}</th>`).join("")}</tr>` : ""}${ex.r.map(row => `<tr>${row.map(c => (tabGap(c) ? `<td><input class="tcell" data-k="${k++}" autocomplete="off" autocapitalize="off" spellcheck="false"></td>` : `<td class="fix">${glossWords(c, true)}</td>`)).join("")}</tr>`).join("")}</table>${BTN_ROW}`;
}
function tabMark(ex, user, showAll) {
  const gaps = tabGaps(ex);
  let allOk = true,
    near = false;
  document.querySelectorAll(".tcell").forEach((inp, k) => {
    inp.disabled = true;
    const r = user[k] ? localCheck(user[k], gaps[k], !!ex.s) : { correct: false };
    if (r.note) near = true;
    if (!r.correct) allOk = false;
    if (showAll && !user[k]) {
      inp.value = "";
      inp.placeholder = "";
    }
    inp.classList.add(r.correct ? "ok" : "no");
    if (!r.correct || r.note) inp.insertAdjacentHTML("afterend", `<span class="sol">${esc(gaps[k][0])}</span>`);
  });
  return { allOk, near };
}
function checkTable(se, ex) {
  const cells = [...document.querySelectorAll(".tcell")],
    user = cells.map(i => i.value.trim());
  if (!user.some(Boolean)) return;
  se.locked = true;
  showBtns(CHECK_BTNS, false);
  const m = tabMark(ex, user),
    n = user.length,
    ok = cells.filter(c => c.classList.contains("ok")).length;
  const res = {
    correct: m.allOk,
    note:
      (m.allOk ? "" : `${ok} von ${n} Feldern richtig – die Lösungen stehen grün unter den falschen Feldern.`) +
      (m.near ? " " + ucFirst(SP.charNote) + "." : "") +
      (ex.x ? " " + ex.x : "")
  };
  record(ex, user.map(x => x || "–").join(", "), res);
  showFb(res, ex);
}

/* ---------- Lesetext: {t:"les", q?, txt:["Name: Text", …], qs:[{q, o:[…], a, x?}], h?} ----------
   Richtig, wenn alle Fragen richtig beantwortet sind (wie bei Tabellen). */
function lesRender(ex, se) {
  se.cur = { qs: ex.qs.map(q => shuffle(q.o.map((o, i) => ({ o, ok: i === q.a })))), pick: ex.qs.map(() => -1) };
  const all = ex.txt.map(l => fmtLine(l).txt).join(" ");
  return `<div class="ask">Lies den Text und beantworte die Fragen</div>${ex.q ? `<div class="q" style="font-size:20px">${esc(ex.q)}</div>` : ""}${hintHTML(ex)}
  <div class="lestxt"><div class="lesspk">${spk(all)}<small>Ganzen Text anhören</small></div>${ex.txt
    .map(l => {
      const x = fmtLine(l);
      return `<p>${x.who ? `<b>${esc(x.who)}:</b> ` : ""}${glossWords(x.txt)}</p>`;
    })
    .join("")}</div>
  ${ex.qs
    .map(
      (q, qi) =>
        `<div class="lesq"><div class="lesqq">${qi + 1}. ${glossQuoted(q.q)}</div><div class="opts">${se.cur.qs[qi]
          .map((o, oi) => `<button class="opt" data-act="lpick" data-id="${qi}:${oi}">${esc(o.o)}</button>`)
          .join("")}</div></div>`
    )
    .join("")}
  ${BTN_ROW}`;
}
function lesPick(id) {
  const se = SESSION;
  if (!se || se.locked || !se.cur || !se.cur.pick) return;
  const [qi, oi] = String(id).split(":").map(Number);
  se.cur.pick[qi] = oi;
  document.querySelectorAll(`[data-act="lpick"][data-id^="${qi}:"]`).forEach(b => {
    b.classList.toggle("sel", b.dataset.id === qi + ":" + oi);
  });
}
function lesMark(se, ex) {
  document.querySelectorAll('[data-act="lpick"]').forEach(b => {
    const [qi, oi] = b.dataset.id.split(":").map(Number);
    b.disabled = true;
    b.classList.remove("sel");
    if (se.cur.qs[qi][oi].ok) b.classList.add("right");
    else if (se.cur.pick[qi] === oi) b.classList.add("wrong");
  });
}
function lesCheck(se, ex) {
  if (se.cur.pick.some(p => p < 0)) {
    toast("Bitte jede Frage beantworten");
    return;
  }
  se.locked = true;
  showBtns(CHECK_BTNS, false);
  lesMark(se, ex);
  const ok = se.cur.pick.map((p, qi) => se.cur.qs[qi][p].ok),
    n = ok.filter(Boolean).length;
  const notes = ex.qs.map((q, qi) => (!ok[qi] && q.x ? `${qi + 1}. ${q.x}` : "")).filter(Boolean);
  const res = {
    correct: n === ok.length,
    note: (n === ok.length ? "" : `${n} von ${ok.length} Fragen richtig. `) + notes.join(" ")
  };
  record(ex, se.cur.pick.map((p, qi) => se.cur.qs[qi][p].o).join(" · "), res);
  showFb(res, ex);
}

/* ---------- Schreibaufgabe: {t:"sch", q:"Aufgabe in der Basissprache", a:["Musterlösung", …], w?:[Wörter], h?} ----------
   Man schreibt frei in der Lernsprache. Passt der Text genau zu einer Musterlösung, ist er lokal richtig; sonst
   prüft die KI, ob die Aufgabe erfüllt und der Text sprachlich korrekt ist, und zeigt eine korrigierte Fassung. */
/* Schreibfeld mit Aufgabe – gemeinsam für Schreibaufgaben in Themen und freies Schreiben (ki-ueben.js) */
function writeBoxHTML(task, words, extra) {
  return `<div class="ask">Schreib auf ${APP.target.name}</div><div class="q" style="font-size:20px">${esc(task)}</div>${words && words.length ? `<div class="hint">Verwende: ${words.map(w => glossWords(w)).join(", ")}</div>` : ""}${extra || ""}${charKeys()}<textarea id="ans" class="inp schta" rows="4" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="Auf ${APP.target.name} …"></textarea>`;
}
function schRender(ex) {
  return writeBoxHTML(ex.q, ex.w, hintHTML(ex)) + BTN_ROW;
}
/* Thema der gerade geprüften Übung (im Fehler-Training das Herkunftsthema) */
function exTid() {
  const se = SESSION;
  if (!se) return "";
  return S.active && S.active.id === se.id ? srcOf(S.active, se.idx).tid : se.id;
}
async function schJudge(ex, user) {
  const p = `Thema: ${SESSION.title || (T(SESSION.id) || {}).title || ""}
Aufgabentyp: Schreibaufgabe (freier Text auf ${APP.target.name})
Aufgabe: ${ex.q}${ex.w && ex.w.length ? `\nZu verwendende Wörter: ${ex.w.join(", ")}` : ""}
Musterlösung(en) (nur Beispiele, andere Lösungen sind gleichwertig): ${ex.a.join(" | ")}
Text von ${APP.learner}: "${user}"${weakAsk()}

Bewerte: Ist die Aufgabe inhaltlich erfüllt und der Text sprachlich korrekt (Grammatik, Wortwahl, Endungen)? Kleine Tippfehler, die kein anderes Wort und keine andere Form ergeben, und fehlende Satzzeichen zählen nicht. Andere Formulierungen als die Musterlösung sind richtig, wenn sie passen. ${SP.judge.trim()}
JSON: {"correct": true oder false, "feedback": "1–3 kurze Sätze auf ${APP.explain}: was gut ist, welche Fehler und warum", "correction": "der Text mit allen Fehlern korrigiert (so nah wie möglich am Original)"${WEAK_TAGS ? ", " + WEAK_FIELD : ""}}`;
  const meta = { k: "schreibaufgabe" },
    j = await aiJSON(p, meta),
    g = j.correct ? [] : weakTags(j);
  j._aid = aiAudit("schreibaufgabe", meta, {
    q: `[Schreibaufgabe] ${ex.q}`,
    sol: ex.a.join(" | "),
    u: user,
    umax: 400,
    rmax: 600,
    ok: !!j.correct,
    r: `${j.correct ? "richtig" : "falsch"} – ${j.feedback || ""}${j.correction ? " | Korrektur: " + j.correction : ""}${weakText(g)}`
  });
  weakNote("schreibaufgabe", exTid(), g, j._aid);
  return j;
}

/* ---------- Dialog: {t:"dlg", q:"Situation", h?, r:[["Name","Text"], ["Du","[Lösung|Alternative]","Hinweis, was man sagt"]]} ----------
   Zeilen mit [eckigen Klammern] schreibt man selbst (Alternativen mit |), die dritte Spalte sagt in der Basissprache,
   was man sagen soll. Richtig, wenn alle eigenen Zeilen stimmen. Passt eine Zeile nicht zur Musterlösung, prüft die KI
   alle offenen Zeilen in einer einzigen Anfrage im Zusammenhang des Gesprächs. */
function dlgGaps(ex) {
  return ex.r.map(row => tabGap(row[1])).filter(Boolean);
}
function dlgRender(ex) {
  let k = 0;
  return `<div class="ask">Führe das Gespräch auf ${APP.target.name}</div><div class="q" style="font-size:20px">${esc(ex.q)}</div>${hintHTML(ex)}${charKeys()}<div class="dlg">${ex.r
    .map(row => {
      if (tabGap(row[1]))
        return `<div class="dlgl me"><b>${esc(row[0])}</b>${row[2] ? `<small>${esc(row[2])}</small>` : ""}<input class="dcell" data-k="${k++}" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="Auf ${APP.target.name} …"></div>`;
      return `<div class="dlgl"><b>${esc(row[0])}</b><span>${spk(row[1])}${glossWords(row[1])}</span></div>`;
    })
    .join("")}</div>${BTN_ROW}`;
}
function dlgMark(ex, ok, show, fix) {
  const gaps = dlgGaps(ex);
  document.querySelectorAll(".dcell").forEach((inp, k) => {
    inp.disabled = true;
    if (show && !inp.value) inp.placeholder = "";
    inp.classList.add(ok[k] ? "ok" : "no");
    const sol = (fix && fix[k]) || (!ok[k] ? gaps[k][0] : "");
    if (sol) inp.insertAdjacentHTML("afterend", `<span class="sol">${spk(sol)}${glossWords(sol)}</span>`);
  });
}
async function dlgJudge(ex, lines) {
  const conv = ex.r
    .map(row => {
      const g = tabGap(row[1]);
      if (!g) return `${row[0]}: ${row[1]}`;
      const l = lines.find(x => x.row === row);
      return `${row[0]} (${APP.learner}${row[2] ? ", Aufgabe: " + row[2] : ""}): ${l ? `„${l.user}“ [ZEILE ${l.n}]` : g[0]}`;
    })
    .join("\n");
  const p = `Thema: ${SESSION.title || (T(SESSION.id) || {}).title || ""}
Aufgabentyp: Dialog – ${APP.learner} schreibt die eigenen Zeilen selbst auf ${APP.target.name}.
Situation: ${ex.q}
Gespräch:
${conv}
Musterlösungen der zu prüfenden Zeilen: ${lines.map(l => `ZEILE ${l.n}: ${l.acc.join(" | ")}`).join("; ")}${weakAsk()}

Bewerte jede markierte ZEILE: Passt sie ins Gespräch, erfüllt sie die Aufgabe und ist sie sprachlich korrekt? Gleichwertige Alternativen, weggelassene Personalpronomen, Groß-/Kleinschreibung, fehlende Satzzeichen und kleine Tippfehler, die kein anderes Wort ergeben, zählen als richtig. ${SP.judge.trim()}
JSON: {"lines": [{"n": Zeilennummer, "correct": true oder false, "correction": "richtige Fassung, möglichst nah am Original"}], "feedback": "1–2 kurze Sätze auf ${APP.explain}"${WEAK_TAGS ? ", " + WEAK_FIELD : ""}}`;
  const meta = { k: "dialog" },
    j = await aiJSON(p, meta);
  const okN = new Set((j.lines || []).filter(x => x.correct).map(x => +x.n)),
    g = lines.every(l => okN.has(l.n)) ? [] : weakTags(j);
  j._aid = aiAudit("dialog", meta, {
    q: `[Dialog] ${ex.q}`,
    sol: lines.map(l => l.acc[0]).join(" / "),
    u: lines.map(l => l.user).join(" / "),
    umax: 400,
    rmax: 600,
    ok: lines.every(l => okN.has(l.n)),
    r: `${j.feedback || ""} | ${(j.lines || []).map(x => `${x.n}: ${x.correct ? "richtig" : "falsch – " + (x.correction || "")}`).join("; ")}${weakText(g)}`
  });
  weakNote("dialog", exTid(), g, j._aid);
  return j;
}
async function dlgCheck(se, ex) {
  const cells = [...document.querySelectorAll(".dcell")],
    user = cells.map(i => i.value.trim());
  if (!user.some(Boolean)) return;
  se.locked = true;
  cells.forEach(i => (i.disabled = true));
  showBtns(CHECK_BTNS, false);
  const gaps = dlgGaps(ex),
    rows = ex.r.filter(row => tabGap(row[1]));
  const lc = user.map((u, k) => (u ? localCheck(u, gaps[k], !!ex.s) : { correct: false })),
    ok = lc.map(r => r.correct),
    near = lc.some(r => r.note),
    fix = [];
  let res = {};
  const open = user
    .map((u, k) => ({ u, k }))
    .filter(x => x.u && !ok[x.k])
    .map((x, i) => ({ n: i + 1, k: x.k, user: x.u, acc: gaps[x.k], row: rows[x.k] }));
  if (open.length && aiReady()) {
    $("#fb").innerHTML = `<div class="fb wait">${APP.teacher} prüft deine Antworten ${dots()}</div>`;
    try {
      const j = await dlgJudge(ex, open);
      (j.lines || []).forEach(x => {
        const l = open.find(o => o.n === +x.n);
        if (!l) return;
        if (x.correct) ok[l.k] = true;
        if (x.correction && norm(x.correction) !== norm(l.user)) fix[l.k] = x.correction;
      });
      res = { ai: j.feedback, aid: j._aid };
    } catch (e) {
      res = { offline: true };
    }
  }
  if (SESSION !== se) return;
  dlgMark(ex, ok, false, fix);
  const n = ok.filter(Boolean).length;
  res.correct = n === ok.length;
  res.note =
    (res.correct ? "" : `${n} von ${ok.length} Zeilen richtig – die Lösungen stehen grün unter den falschen Zeilen.`) +
    (near ? " " + ucFirst(SP.charNote) + "." : "") +
    (ex.x ? " " + ex.x : "");
  record(ex, user.map(x => x || "–").join(" / "), res);
  showFb(res, ex);
}

/* ---------- Gemeinsame Schnittstelle ---------- */
const isArr = x => Array.isArray(x) && x.length > 0;
const FMT = {
  mc: {
    valid: e =>
      typeof e.q === "string" && isArr(e.o) && e.o.length > 1 && Number.isInteger(e.a) && e.a >= 0 && e.a < e.o.length,
    render: mcRender,
    check: () => {}, // ausgewertet beim Antippen (answerMC)
    dunno: se => mcMark(se, -1),
    prompt: ex => ex.q,
    expected: ex => ex.o[ex.a],
    describe: ex => `Multiple Choice: ${ex.q}\nOptionen: ${ex.o.join(" | ")}`
  },
  gap: {
    valid: e => typeof e.q === "string" && e.q.includes("___") && isArr(e.a),
    render: gapRender,
    check: (se, ex) => textCheck(se, ex, ansText(), [...ex.a, ...ex.a.map(a => ex.q.replace("___", a))], aiJudge),
    dunno: () => {},
    prompt: ex => ex.q + (ex.h ? ` (${ex.h})` : ""),
    expected: ex => ex.q.replace("___", ex.a[0]),
    solution: ex => ex.a.map(a => ex.q.replace("___", a)).join(" | "),
    target: () => true,
    describe: ex => `Lückentext: ${ex.q}${ex.h ? ` (Hinweis: ${ex.h})` : ""}`
  },
  tr: {
    valid: e => typeof e.q === "string" && (e.dir === "de" || e.dir === "fi") && isArr(e.a),
    render: trRender,
    check: (se, ex) => textCheck(se, ex, ansText(), ex.a, aiJudge),
    dunno: () => {},
    prompt: ex => ex.q,
    expected: ex => ex.a[0],
    target: ex => ex.dir === "de",
    solution: ex => ex.a.join(" | "),
    describe: ex =>
      `Übersetzung ${ex.dir === "de" ? APP.base.name + " → " + APP.target.name : APP.target.name + " → " + APP.base.name}: ${ex.q}`
  },
  ord: {
    valid: e => isArr(e.w) && e.w.length > 1 && typeof e.a === "string" && typeof e.de === "string",
    render: ordRender,
    after: renderOrd,
    check: (se, ex) =>
      se.cur.picked.length && textCheck(se, ex, se.cur.picked.map(i => se.cur.chips[i]).join(" "), [ex.a], null),
    dunno: renderOrd,
    prompt: ex => ex.de,
    expected: ex => ex.a,
    target: () => true,
    describe: ex => `Satz ordnen (${ex.de}) aus den Wörtern: ${ex.w.join(" / ")}`
  },
  tab: {
    valid: e => {
      if (!(typeof e.q === "string" && Array.isArray(e.r) && e.r.every(Array.isArray))) return false;
      const g = tabGaps(e);
      return g.length > 0 && g.every(x => x.length > 0);
    },
    render: tabRender,
    check: checkTable,
    dunno: (se, ex) =>
      tabMark(
        ex,
        [...document.querySelectorAll(".tcell")].map(() => ""),
        true
      ),
    prompt: ex => ex.q,
    expected: ex =>
      tabGaps(ex)
        .map(a => a[0])
        .join(", "),
    solution: ex =>
      tabGaps(ex)
        .map(a => a.join(" / "))
        .join(", "),
    inline: true,
    describe: ex =>
      `Tabelle: ${ex.q}${ex.head ? ` (Spalten: ${ex.head.join(", ")})` : ""}\n${ex.r.map(r => r.map(c => (tabGap(c) ? "___" : c)).join(" | ")).join("\n")}`
  },
  les: {
    valid: e =>
      Array.isArray(e.txt) &&
      e.txt.length > 0 &&
      e.txt.every(isStr) &&
      Array.isArray(e.qs) &&
      e.qs.length > 0 &&
      e.qs.every(
        q =>
          q &&
          isStr(q.q) &&
          Array.isArray(q.o) &&
          q.o.length > 1 &&
          q.o.every(isStr) &&
          Number.isInteger(q.a) &&
          q.a >= 0 &&
          q.a < q.o.length
      ),
    render: lesRender,
    check: lesCheck,
    dunno: lesMark,
    prompt: ex => ex.q || fmtLine(ex.txt[0]).txt,
    expected: ex => ex.qs.map(q => q.o[q.a]).join(" · "),
    inline: true,
    describe: ex =>
      `Lesetext${ex.q ? " (" + ex.q + ")" : ""}:\n${ex.txt.join("\n")}\nFragen:\n${ex.qs.map((q, i) => `${i + 1}. ${q.q} – Optionen: ${q.o.join(" | ")}`).join("\n")}`
  },
  sch: {
    valid: e => isStr(e.q) && Array.isArray(e.a) && e.a.length > 0 && e.a.every(isStr) && (!e.w || Array.isArray(e.w)),
    render: schRender,
    check: (se, ex) => textCheck(se, ex, ansText(), ex.a, schJudge, "liest deinen Text"),
    dunno: () => {},
    prompt: ex => ex.q,
    expected: ex => ex.a[0],
    solution: ex => ex.a.join(" | "),
    target: () => true,
    fbLabel: res => (res.correction ? "Korrigiert:" : "Musterlösung:"),
    fbExtra: (ex, exp) =>
      ex.a.length && norm(exp) !== norm(ex.a[0])
        ? `<p class="muted">Musterlösung: ${spk(ex.a[0])}${glossWords(ex.a[0])}</p>`
        : "",
    describe: ex =>
      `Schreibaufgabe (freier Text auf ${APP.target.name}): ${ex.q}${ex.w && ex.w.length ? ` (Wörter: ${ex.w.join(", ")})` : ""}`
  },
  dlg: {
    valid: e =>
      isStr(e.q) &&
      Array.isArray(e.r) &&
      e.r.length > 1 &&
      e.r.every(
        row => Array.isArray(row) && row.length >= 2 && row.every(x => typeof x === "string") && isStr(row[1])
      ) &&
      (g => g.some(Boolean) && g.every(x => !x || x.length > 0))(e.r.map(row => tabGap(row[1]))),
    render: dlgRender,
    check: dlgCheck,
    dunno: (se, ex) =>
      dlgMark(
        ex,
        dlgGaps(ex).map(() => false),
        true
      ),
    prompt: ex => ex.q,
    expected: ex =>
      dlgGaps(ex)
        .map(a => a[0])
        .join(" / "),
    solution: ex =>
      dlgGaps(ex)
        .map(a => a.join(" | "))
        .join(" / "),
    inline: true,
    describe: ex =>
      `Dialog (${ex.q}), ${APP.learner} schreibt die Zeilen „___“ selbst:\n${ex.r.map(row => `${row[0]}: ${tabGap(row[1]) ? "___" + (row[2] ? " (" + row[2] + ")" : "") : row[1]}`).join("\n")}`
  }
};
