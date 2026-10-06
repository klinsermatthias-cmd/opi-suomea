/* Opi suomea – formate.js: Übungsformate Lesetext (les), Schreibaufgabe (sch) und Dialog (dlg).
   Jedes Format liefert in FMT[t]: Prüfung der Daten (valid), Anzeige (render), Auswertung (check), „Weiß ich nicht“
   (dunno), Text für Fehlerliste/Bericht (prompt, expected) und eine Beschreibung für „Frag …“ (describe).
   uebungen.js, verwaltung.js und ki.js rufen FMT erst zur Laufzeit auf (nach dem Laden aller Dateien).
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */

/* Zeile eines Lesetexts/Dialogs: „Name: Text“ → Sprecher + Text */
function fmtLine(s) {
  const m = /^([^:]{1,30}):\s+(.+)$/.exec(String(s));
  return m ? { who: m[1], txt: m[2] } : { who: "", txt: String(s) };
}
const isStr = x => typeof x === "string" && x.trim() !== "";

/* ---------- Lesetext: {t:"les", q?, txt:["Name: Text", …], qs:[{q, o:[…], a, x?}], h?} ----------
   Richtig, wenn alle Fragen richtig beantwortet sind (wie bei Tabellen). */
function lesRender(ex, se) {
  se.cur = { qs: ex.qs.map(q => shuffle(q.o.map((o, i) => ({ o, ok: i === q.a })))), pick: ex.qs.map(() => -1) };
  const all = ex.txt.map(l => fmtLine(l).txt).join(" ");
  return `<div class="ask">Lies den Text und beantworte die Fragen</div>${ex.q ? `<div class="q" style="font-size:20px">${esc(ex.q)}</div>` : ""}${ex.h ? `<div class="hint">${esc(ex.h)}</div>` : ""}
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
  <div class="btnrow"><button class="btn ghost" data-act="dunno">Weiß ich nicht</button><button class="btn" data-act="check">Prüfen</button></div>`;
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
  document.querySelectorAll('[data-act="check"],[data-act="dunno"]').forEach(b => (b.style.display = "none"));
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
function schRender(ex) {
  return `<div class="ask">Schreib auf ${APP.target.name}</div><div class="q" style="font-size:20px">${esc(ex.q)}</div>${ex.w && ex.w.length ? `<div class="hint">Verwende: ${ex.w.map(w => glossWords(w)).join(", ")}</div>` : ""}${ex.h ? `<div class="hint">${esc(ex.h)}</div>` : ""}${charKeys()}<textarea id="ans" class="inp schta" rows="4" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="Auf ${APP.target.name} …"></textarea><div class="btnrow"><button class="btn ghost" data-act="dunno">Weiß ich nicht</button><button class="btn" data-act="check">Prüfen</button></div>`;
}
async function schJudge(ex, user) {
  const p = `Thema: ${SESSION.title || (T(SESSION.id) || {}).title || ""}
Aufgabentyp: Schreibaufgabe (freier Text auf ${APP.target.name})
Aufgabe: ${ex.q}${ex.w && ex.w.length ? `\nZu verwendende Wörter: ${ex.w.join(", ")}` : ""}
Musterlösung(en) (nur Beispiele, andere Lösungen sind gleichwertig): ${ex.a.join(" | ")}
Text des Schülers: "${user}"

Bewerte: Ist die Aufgabe inhaltlich erfüllt und der Text sprachlich korrekt (Grammatik, Wortwahl, Endungen)? Kleine Tippfehler, die kein anderes Wort und keine andere Form ergeben, und fehlende Satzzeichen zählen nicht. Andere Formulierungen als die Musterlösung sind richtig, wenn sie passen. ${SP.judge.trim()}
JSON: {"correct": true oder false, "feedback": "1–3 kurze Sätze auf ${APP.explain}: was gut ist, welche Fehler und warum", "correction": "der Text des Schülers mit allen Fehlern korrigiert (so nah wie möglich an seinem Text)"}`;
  const meta = { k: "schreibaufgabe" },
    j = await aiJSON(p, meta);
  j._aid = aiAudit("schreibaufgabe", meta, {
    q: `[Schreibaufgabe] ${ex.q}`,
    sol: ex.a.join(" | "),
    u: user,
    umax: 400,
    rmax: 600,
    ok: !!j.correct,
    r: `${j.correct ? "richtig" : "falsch"} – ${j.feedback || ""}${j.correction ? " | Korrektur: " + j.correction : ""}`
  });
  return j;
}
async function schCheck(se, ex) {
  const user = ($("#ans").value || "").trim();
  if (!user) return;
  se.locked = true;
  $("#ans").disabled = true;
  document.querySelectorAll('[data-act="check"],[data-act="dunno"]').forEach(b => (b.style.display = "none"));
  let res = localCheck(user, ex.a, !!ex.s);
  if (!res.correct && aiReady()) {
    $("#fb").innerHTML = `<div class="fb wait">${APP.teacher} liest deinen Text ${dots()}</div>`;
    try {
      const j = await schJudge(ex, user);
      res = { correct: !!j.correct, ai: j.feedback, correction: j.correction, aid: j._aid };
    } catch (e) {
      res = { correct: false, offline: true };
    }
  }
  if (SESSION !== se) return;
  record(ex, user, res);
  showFb(res, ex);
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
  return `<div class="ask">Führe das Gespräch auf ${APP.target.name}</div><div class="q" style="font-size:20px">${esc(ex.q)}</div>${ex.h ? `<div class="hint">${esc(ex.h)}</div>` : ""}${charKeys()}<div class="dlg">${ex.r
    .map(row => {
      if (tabGap(row[1]))
        return `<div class="dlgl me"><b>${esc(row[0])}</b>${row[2] ? `<small>${esc(row[2])}</small>` : ""}<input class="dcell" data-k="${k++}" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="Auf ${APP.target.name} …"></div>`;
      return `<div class="dlgl"><b>${esc(row[0])}</b><span>${spk(row[1])}${glossWords(row[1])}</span></div>`;
    })
    .join(
      ""
    )}</div><div class="btnrow"><button class="btn ghost" data-act="dunno">Weiß ich nicht</button><button class="btn" data-act="check">Prüfen</button></div>`;
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
      return `${row[0]} (Schüler${row[2] ? ", Aufgabe: " + row[2] : ""}): ${l ? `„${l.user}“ [ZEILE ${l.n}]` : g[0]}`;
    })
    .join("\n");
  const p = `Thema: ${SESSION.title || (T(SESSION.id) || {}).title || ""}
Aufgabentyp: Dialog – der Schüler schreibt seine Zeilen selbst auf ${APP.target.name}.
Situation: ${ex.q}
Gespräch:
${conv}
Musterlösungen der zu prüfenden Zeilen: ${lines.map(l => `ZEILE ${l.n}: ${l.acc.join(" | ")}`).join("; ")}

Bewerte jede markierte ZEILE: Passt sie ins Gespräch, erfüllt sie die Aufgabe und ist sie sprachlich korrekt? Gleichwertige Alternativen, weggelassene Personalpronomen, Groß-/Kleinschreibung, fehlende Satzzeichen und kleine Tippfehler, die kein anderes Wort ergeben, zählen als richtig. ${SP.judge.trim()}
JSON: {"lines": [{"n": Zeilennummer, "correct": true oder false, "correction": "richtige Fassung, möglichst nah am Schüler"}], "feedback": "1–2 kurze Sätze auf ${APP.explain}"}`;
  const meta = { k: "dialog" },
    j = await aiJSON(p, meta);
  const okN = new Set((j.lines || []).filter(x => x.correct).map(x => +x.n));
  j._aid = aiAudit("dialog", meta, {
    q: `[Dialog] ${ex.q}`,
    sol: lines.map(l => l.acc[0]).join(" / "),
    u: lines.map(l => l.user).join(" / "),
    umax: 400,
    rmax: 600,
    ok: lines.every(l => okN.has(l.n)),
    r: `${j.feedback || ""} | ${(j.lines || []).map(x => `${x.n}: ${x.correct ? "richtig" : "falsch – " + (x.correction || "")}`).join("; ")}`
  });
  return j;
}
async function dlgCheck(se, ex) {
  const cells = [...document.querySelectorAll(".dcell")],
    user = cells.map(i => i.value.trim());
  if (!user.some(Boolean)) return;
  se.locked = true;
  cells.forEach(i => (i.disabled = true));
  document.querySelectorAll('[data-act="check"],[data-act="dunno"]').forEach(b => (b.style.display = "none"));
  const gaps = dlgGaps(ex),
    rows = ex.r.filter(row => tabGap(row[1]));
  const ok = user.map((u, k) => !!u && localCheck(u, gaps[k], !!ex.s).correct),
    fix = [];
  let res = {},
    near = user.some((u, k) => u && localCheck(u, gaps[k], !!ex.s).note);
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
const FMT = {
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
    dunno: (se, ex) => lesMark(se, ex),
    prompt: ex => ex.q || fmtLine(ex.txt[0]).txt,
    expected: ex => ex.qs.map(q => q.o[q.a]).join(" · "),
    inline: true,
    describe: ex =>
      `Lesetext${ex.q ? " (" + ex.q + ")" : ""}:\n${ex.txt.join("\n")}\nFragen:\n${ex.qs.map((q, i) => `${i + 1}. ${q.q} – Optionen: ${q.o.join(" | ")}`).join("\n")}`
  },
  sch: {
    valid: e => isStr(e.q) && Array.isArray(e.a) && e.a.length > 0 && e.a.every(isStr) && (!e.w || Array.isArray(e.w)),
    render: schRender,
    check: schCheck,
    dunno: () => {},
    prompt: ex => ex.q,
    expected: ex => ex.a[0],
    target: true,
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
      e.r.some(row => tabGap(row[1])),
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
    inline: true,
    describe: ex =>
      `Dialog (${ex.q}), der Schüler schreibt die Zeilen „___“ selbst:\n${ex.r.map(row => `${row[0]}: ${tabGap(row[1]) ? "___" + (row[2] ? " (" + row[2] + ")" : "") : row[1]}`).join("\n")}`
  }
};
