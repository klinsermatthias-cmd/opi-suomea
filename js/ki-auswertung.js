/* Lern-Engine – ki-auswertung.js: Prüfung der KI-Übungen durch Claude, Auswertung einer Runde und Gesamtanalyse durch
   die KI (abgetrennt aus ki.js, S-1008-106). Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge
   aus index.html geladen. */
/* ---------- Prüfung der KI-Übungen durch Claude ----------
   Jede erzeugte Übung bekommt eine ID (gid). S.genReview = [{id, d, topic, ex:[…], res:{gid:richtig?}, v:{gid:Urteil}}].
   Claude prüft die Übungen aus dem Bericht und trägt das Urteil in lektionen/ki-pruefung.json ein
   ({"<gid>": {"ok": true} | {"ok": false, "korrektur": "…", "grund": "…"}}). Die App lädt die Datei beim Start:
   geprüfte Übungen zeigen ✓/✗, Fehler aus fehlerhaften KI-Übungen werden aus dem Fehler-Training gestrichen. */
function genReviewCap(list) {
  list = list.slice().sort((a, b) => b.d - a.d);
  /* behalten: ungeprüfte Sätze und Sätze mit geprüften (✓) Übungen, die noch nicht fest in der Lektion stehen –
     sie gehören zur Übungssammlung und dürfen nie wegfallen */
  const inLesson = new Set(TOPICS.flatMap(t => t.ex.map(e => e.gid).filter(Boolean)));
  const open = x => x.ex.some(e => !(x.v || {})[e.gid] || ((x.v || {})[e.gid].ok && !inLesson.has(e.gid)));
  const keep = list.filter(open);
  return [...keep, ...list.filter(x => !open(x))].slice(0, Math.max(30, keep.length)).sort((a, b) => b.d - a.d);
}
function genUnreviewed() {
  return (S.genReview || []).flatMap(x => x.ex.filter(e => !(x.v || {})[e.gid]).map(e => ({ set: x, ex: e })));
}
function genVerdictOf(gid) {
  for (const x of S.genReview || []) if (x.v && x.v[gid]) return x.v[gid];
  return null;
}
async function loadGenVerdicts() {
  try {
    const r = await fetch("lektionen/ki-pruefung.json", { cache: "no-store" });
    if (!r.ok) return;
    const V = await r.json();
    if (!V || typeof V !== "object") return;
    let ok = 0,
      bad = 0;
    (S.genReview || []).forEach(x =>
      x.ex.forEach(e => {
        const v = V[e.gid];
        if (!v) return;
        const nv = { ok: !!v.ok, korrektur: v.korrektur || "", grund: v.grund || "" },
          o = x.v && x.v[e.gid];
        /* neu oder von Claude geändert (z. B. Urteil korrigiert) → übernehmen */
        if (o && o.ok === nv.ok && o.korrektur === nv.korrektur && o.grund === nv.grund) return;
        x.v = x.v || {};
        x.v[e.gid] = nv;
        v.ok ? ok++ : bad++;
      })
    );
    /* Urteile zu anerkannten Vokabel-Antworten (E-1008-59) */
    let va = 0;
    (S.vocAlt || []).forEach(x => {
      const v = V[vocAltKey(x)];
      if (!v) return;
      const nv = { ok: !!v.ok, korrektur: v.korrektur || "", grund: v.grund || "" };
      if (x.v && x.v.ok === nv.ok && x.v.korrektur === nv.korrektur && x.v.grund === nv.grund) return;
      x.v = nv;
      va++;
    });
    /* Fehler aus fehlerhaften KI-Übungen streichen – das war ein Fehler der KI, nicht von Matthias */
    const reopen = [];
    S.errors.forEach(e => {
      const v = e.gx && e.gx.gid && genVerdictOf(e.gx.gid);
      if (v && !v.ok && !e.ok) {
        e.ok = 1;
        e.kiFalsch = 1;
      } else if (v && v.ok && e.kiFalsch) {
        /* Urteil auf „korrekt“ geändert: der Fehler war doch einer → als neuer Eintrag wieder offen
           (der jüngste Eintrag zählt; „gelöst“ bleibt beim Abgleich am alten Eintrag hängen) */
        delete e.kiFalsch;
        const n = { ...e, d: Date.now() + reopen.length };
        delete n.ok;
        reopen.push(n);
      }
    });
    reopen.forEach(n => S.errors.unshift(n));
    if (ok + bad || reopen.length || va) {
      save();
      if (!SESSION) render();
      if (ok + bad)
        toast(
          `Claude hat ${ok + bad} KI-Übungen geprüft: ${ok} korrekt${bad ? `, ${bad} fehlerhaft (aus dem Fehler-Training entfernt)` : ""}`
        );
    }
  } catch (e) {}
}
function genReportSection() {
  const L = genUnreviewed();
  if (!L.length) return "";
  const desc = e =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(e).filter(([k]) =>
          ["t", "q", "dir", "o", "a", "h", "x", "w", "de", "head", "r", "s"].includes(k)
        )
      )
    );
  return (
    `\n\nKI-ÜBUNGEN ZUR PRÜFUNG (${L.length}, von ${APP.teacher} erzeugt – Urteil bitte in lektionen/ki-pruefung.json eintragen):\n` +
    L.map(({ set, ex }) => {
      const r = (set.res || {})[ex.gid];
      return `- ${ex.gid} [${set.topic}${r == null ? "" : r ? ", " + APP.learner + " richtig" : ", " + APP.learner + " falsch"}] ${desc(ex)}`;
    }).join("\n")
  );
}
/* Neue Übungen von Opettaja (E-1007-15): werden erzeugt und gesammelt, aber erst geübt, wenn Claude sie geprüft
   hat (✓ über den Bericht → lektionen/ki-pruefung.json). Danach kommen sie zufällig in Wiederholungen, gemischte
   Wiederholung und Langzeit-Check (approvedGen) – so lernt man keine Fehler aus ungeprüften KI-Übungen. */
async function genMake(id) {
  const t = T(id);
  const gen = await aiGenerate(t);
  if (gen.length < 3) throw new Error("zu wenige");
  const setId = Date.now().toString(36);
  gen.forEach((e, i) => (e.gid = setId + "-" + i));
  S.genReview = genReviewCap([
    { id: setId, d: Date.now(), topic: id, ex: JSON.parse(JSON.stringify(gen)), res: {}, v: {} },
    ...(S.genReview || [])
  ]);
  save();
  return gen.length;
}
async function startGen(id, b) {
  const t = T(id);
  if (!t || !aiReady() || !genUnlocked()) return;
  if (b) {
    b.disabled = true;
    b.innerHTML = `${APP.teacher} schreibt neue Übungen ${dots()}`;
  }
  try {
    const n = await genMake(id);
    toast(`${n} neue Übungen erstellt – sie kommen in deine Wiederholungen, sobald Claude sie geprüft hat`, 5000);
    if (!SESSION && CUR.tab === "topics" && CUR.arg === id) render();
  } catch (e) {
    toast(
      e.kind
        ? APP.teacher + " nicht erreichbar: " + aiErrShort()
        : APP.teacher + " konnte gerade keine passenden Übungen erstellen – versuch es nochmal"
    );
    if (b) {
      b.disabled = false;
      b.textContent = "Neue Übungen anfordern";
    }
  }
}
/* Vorrat: höchstens einmal am Tag (geräteübergreifend, S.genAutoDay) für das gelernte Thema mit dem kleinsten Vorrat
   an neuen Übungen (ungeprüft + geprüft und noch nie gesehen) neue erzeugen, solange der Vorrat unter GEN_STOCK liegt */
const GEN_STOCK = 5;
function genStock(id) {
  const unrev = genUnreviewed().filter(x => x.set.topic === id).length,
    fresh = approvedGen(id).filter(e => !((S.exLog || {})["g:" + e.gid] || {}).n).length;
  return unrev + fresh;
}
async function genAutoStock() {
  if (SESSION || !aiReady() || !genUnlocked() || S.genAutoDay === todayKey() || genUnreviewed().length >= 30) return;
  const L = learningTopics()
    .map(t => ({ id: t.id, n: genStock(t.id) }))
    .filter(x => x.n < GEN_STOCK)
    .sort((a, b) => a.n - b.n);
  if (!L.length) return;
  S.genAutoDay = todayKey();
  save();
  try {
    await genMake(L[0].id);
  } catch (e) {}
}
async function aiSessionReview(t, s, results, score, rating, baseDays) {
  const errs =
    results
      .filter(r => !r.correct)
      .map(r => `- ${r.q} | Antwort: ${r.user} | richtig: ${r.exp}`)
      .join("\n") || "keine";
  const hist = s.hist
    .slice(-6)
    .map(h => `${new Date(h.d).toLocaleDateString(APP.locale)}: ${h.sc} %`)
    .join(", ");
  const p = `${APP.learner} hat gerade das Thema „${t.title}“ (${t.lvl}) geübt.
Ergebnis: ${Math.round(score * 100)} % (${results.filter(r => r.correct).length}/${results.length}). Selbsteinschätzung: ${RATINGS.find(r => r.k === rating).l}.
Bisherige Ergebnisse: ${hist}
Wiederholungen: ${s.reps}, Fehlschläge: ${s.lapses}
Fehler in dieser Runde:
${errs}
Der Spaced-Repetition-Algorithmus schlägt die nächste Wiederholung in ${baseDays} Tag(en) vor.
Theorie des Themas (Auszug, für die Erklärung der Fehler): ${theoryText(t, 600) || "–"}
Beim Feedback zu den Fehlern: ${EXPLAIN_RULE()}

Entscheide als Lehrkraft, wann das Thema wiederholt wird: Unsicheres früher (1–2 Tage), Solides später. Weiche vom Vorschlag ab, wenn Fehler oder Verlauf es nahelegen – höchstens ${topicIvMax(score, baseDays, s.reps)} Tage.
JSON: {"feedback":"2–3 Sätze ehrliches, persönliches Feedback auf ${APP.explain}, Fehler konkret erklären","tips":["bis zu 3 kurze, konkrete Tipps"],"intervalDays": Ganzzahl 1–${topicIvMax(score, baseDays, s.reps)},"reason":"1 kurzer Satz, warum dieser Abstand"}`;
  const meta = { k: "auswertung" },
    j = await aiJSON(p, meta);
  j._aid = aiAudit("auswertung", meta, {
    q: `${t.id} ${t.title}: ${Math.round(score * 100)} %, selbst „${RATINGS.find(r => r.k === rating).l}“, Algorithmus ${baseDays} T., Fehler: ${
      results
        .filter(r => !r.correct)
        .map(r => r.user + " ≠ " + r.exp)
        .join("; ") || "keine"
    }`,
    r: `${j.intervalDays} Tage – ${j.reason || ""} | ${j.feedback || ""} | Tipps: ${(j.tips || []).join("; ")}`,
    rmax: 500
  });
  return j;
}

/* Lernstand als Text. Für den Bericht (forReport) ohne die Kurzfassungen von Schreiben/Rollenspiel und eigenen Wörtern,
   weil der Bericht sie ausführlich in eigenen Abschnitten bringt. */
/* Bericht-Bausteine (E-1007-28/30/31/32) */
function activityLine() {
  const d14 = Array.from({ length: 14 }, (_, i) => todayKey(new Date(Date.now() - i * DAY))),
    act = d14.filter(k => (S.days || {})[k]).length,
    sum = d14.reduce((a, k) => a + ((S.days || {})[k] || 0), 0);
  return `Aktivität: an ${act} von 14 Tagen gelernt (Ø ${act ? Math.round(sum / act) : 0} Einheiten je Lerntag) | Rückstand: ${dueCards().length} Karten und ${dueTopics().length} Themen fällig | Einstellungen: ${S.settings.newCardsPerDay} neue Wörter/Tag, ${S.settings.newTopicsPerDay} neue Themen/Tag, ${S.settings.extraCards} Extra-Karten`;
}
function hardExercises(n) {
  const out = [];
  for (const [k, l] of Object.entries(S.exLog || {})) {
    if (!l || l.n < 3 || l.w / l.n < 0.4) continue;
    let tid, ex;
    if (k.startsWith("g:")) {
      const gid = k.slice(2);
      for (const x of S.genReview || []) {
        const e = x.ex.find(e => e.gid === gid);
        if (e) {
          tid = x.topic;
          ex = e;
          break;
        }
      }
    } else {
      const i = k.lastIndexOf(":");
      tid = k.slice(0, i);
      ex = (T(tid) || { ex: [] }).ex[+k.slice(i + 1)];
    }
    if (ex) out.push({ k, tid, ex, l });
  }
  return out
    .sort((a, b) => b.l.w / b.l.n - a.l.w / a.l.n || b.l.n - a.l.n)
    .slice(0, n)
    .map(
      x =>
        `- [${x.k.startsWith("g:") ? x.tid + ", KI-Übung " + x.k.slice(2) : x.k}] ${cut(promptText(x.ex), 90)} – ${x.l.w} von ${x.l.n} falsch (richtig: ${cut(expectedText(x.ex), 60)})`
    );
}
function roundsLine() {
  const parts = [];
  const cl = (S.checkLog || []).slice(0, 3);
  if (cl.length)
    parts.push(
      "Langzeit-Checks: " +
        cl.map(c => `${fmtDate(c.d)}: ${c.r.map(r => r.tid + " " + r.sc + " %").join(", ")}`).join(" | ")
    );
  const ml = (S.mixLog || []).slice(0, 5);
  if (ml.length) parts.push("Gemischte Wiederholungen: " + ml.map(m => `${fmtDate(m.d)} ${m.sc} %`).join(", "));
  const t = { w: [0, 0], s: [0, 0], d: [0, 0] };
  Object.values(S.listen || {}).forEach(x =>
    ["w", "s", "d"].forEach(k => x[k] && ((t[k][0] += x[k][0]), (t[k][1] += x[k][1])))
  );
  if (t.w[0] || t.s[0] || t.d[0])
    parts.push(
      `Hörtraining: Wörter ${t.w[1]}/${t.w[0]} richtig, Sätze ${t.s[1]}/${t.s[0]} richtig, Satzdiktat ${t.d[1]}/${t.d[0]} richtig`
    );
  return parts.length ? "WEITERE RUNDEN:\n- " + parts.join("\n- ") : "";
}
function progressSummary(forReport) {
  const L = [];
  L.push(
    `Lernstart: ${new Date(S.created).toLocaleDateString(APP.locale)} | Serie: ${streakNow()} Tage | Sitzungen: ${S.stats.sessions} | Kartenwiederholungen: ${S.stats.reviews}`
  );
  L.push(activityLine());
  L.push("\nTHEMEN:");
  /* Für die Gesamtanalyse kompakt (E-1008-13): ausführlich nur Themen unter 80 %, mit Runden seit der letzten Analyse und
     die 5 schwächsten; der Rest je Gruppe in einer Zeile. Der Bericht für Claude bleibt vollständig. */
  const wp = weakPlan(),
    learnT = TOPICS.filter(t => S.topics[t.id].status === "learning"),
    weakest = new Set(
      learnT
        .slice()
        .sort((a, b) => (S.topics[a.id].last ?? 0) - (S.topics[b.id].last ?? 0))
        .slice(0, 5)
        .map(t => t.id)
    ),
    brief = t => {
      const s = S.topics[t.id];
      if (forReport) return false;
      if (s.status !== "learning") return true;
      return (
        !weakest.has(t.id) &&
        (s.last ?? 0) >= 0.8 &&
        !(s.hist || []).some(h => h.d > (GLOBAL_PREV ?? (S.lastGlobal || 0)))
      );
    };
  if (!forReport) {
    const sits = learnT.filter(brief),
      fresh = TOPICS.filter(t => S.topics[t.id].status === "new"),
      locked = TOPICS.filter(t => S.topics[t.id].status === "locked");
    if (sits.length)
      L.push(`- sitzen (≥ 80 %, seit der letzten Analyse nicht geübt): ${sits.map(t => t.id).join(", ")}`);
    if (fresh.length)
      L.push(`- freigeschaltet, noch nicht gelernt: ${fresh.map(t => t.id + " " + t.title).join("; ")}`);
    if (locked.length) L.push(`- gesperrt: ${locked.length} Themen`);
  }
  TOPICS.forEach(t => {
    const s = S.topics[t.id];
    if (brief(t)) return;
    if (s.status === "learning")
      L.push(
        `- ${t.id} ${t.title}: zuletzt ${pct(s.last)}, bestes ${pct(s.best)}, Wdh ${s.reps}, Fehlschläge ${s.lapses}, Abstand ${s.interval || 0} T., nächste ${fmtDate(topicDue(t.id, wp))} (${relDays(topicDue(t.id, wp))}${wp[t.id] && wp[t.id].moved ? ", wegen Schwäche vorgezogen" : ""}), Verlauf ${s.hist
          .slice(-5)
          .map(h => h.sc + "%")
          .join(" → ")}`
      );
    else L.push(`- ${t.id} ${t.title}: ${s.status === "new" ? "freigeschaltet, noch nicht gelernt" : "gesperrt"}`);
  });
  const all = Object.entries(S.cards).filter(([id]) => cardWord(id)),
    seen = all.filter(([, c]) => !c.isNew);
  const dirStat = r => {
    const x = seen.filter(([id]) => cardParse(id).rev === r),
      n = k => x.filter(([, c]) => cardState(c) === k).length;
    return `${x.length} gelernt (${n("lernt")} frisch, ${n("gut")} gefestigt, ${n("sicher")} sicher), ${x.filter(([id]) => isLeech(id)).length} Problemwörter`;
  };
  L.push(
    `\nVOKABELN: ${new Set(all.map(([id]) => cardParse(id).base)).size} Wörter, ${learnedWords()} gelernt (je Richtung eigene Karte)\n- ${APP.target.name} → ${APP.base.name}: ${dirStat(false)}\n- ${APP.base.name} → ${APP.target.name}: ${dirStat(true)}`
  );
  const weak = weakCards()
    .slice(0, 15)
    .map(([id, c]) => {
      const w = cardWord(id);
      return `${w[0]} (${w[1]}, ${DIRL(id)}) – ${c.lapses}× vergessen, ⚠ ${leechProgress(c)}/${LEECH_OK}`;
    });
  if (weak.length) L.push("Schwierige Wörter: " + weak.join("; "));
  const vh = S.vhelp || [];
  if (vh.length) {
    const cnt = {};
    vh.forEach(x => x.words.forEach(w => (cnt[w] = (cnt[w] || 0) + 1)));
    L.push(
      `\nVOKABELHILFE genutzt (letzte ${vh.length} Aufgaben) – aktiv noch unsichere Wörter: ` +
        Object.entries(cnt)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 25)
          .map(([w, n]) => w + (n > 1 ? " ×" + n : ""))
          .join(", ")
    );
  }
  {
    const st = exStatsTotal(),
      names = {
        mc: "Multiple Choice",
        gap: "Lückentext",
        tr: "Übersetzung",
        ord: "Satz ordnen",
        tab: "Tabelle",
        luk: "Lückentext (mehrere Lücken)",
        zuo: "Zuordnen",
        les: "Lesetext",
        sch: "Schreibaufgabe",
        dlg: "Dialog"
      };
    const rows = Object.entries(st).filter(([, s]) => s.n);
    if (rows.length)
      L.push(
        "\nÜBUNGSARTEN (erster Versuch, „Weiß ich nicht“ nicht mitgezählt):\n" +
          rows
            .map(
              ([t, s]) =>
                `- ${names[t] || t}: ${s.ok}/${s.n} richtig (${pct(s.ok / s.n)})${s.ai ? `; davon ${s.ai} von der KI geprüft, ${s.aiOk} als richtig gewertet` : ""}`
            )
            .join("\n")
      );
  }
  const pr = forReport ? [] : (S.practice || []).slice(0, 6);
  if (pr.length) {
    L.push("\nFREIES SCHREIBEN & ROLLENSPIEL (letzte):");
    pr.forEach(x => L.push(practiceLine(x, false)));
  }
  const wk = forReport ? "" : weakSummary(false);
  if (wk) L.push("\nSCHWÄCHEN NACH THEMA (Fehler bei freien Antworten, 30 Tage):\n" + wk);
  const ow = ownKeys();
  if (ow.length && !forReport)
    L.push(
      `\nEIGENE WÖRTER: ${ow.length} selbst angelegt, ${ow.filter(n => S.cards["own-" + n] && !S.cards["own-" + n].isNew).length} davon schon gelernt`
    );
  const stuck = TOPICS.filter(t => (S.topics[t.id].unlockFails || 0) >= 3);
  if (stuck.length)
    L.push(
      "\nSTOCKT (Freischaltung scheitert wiederholt – bitte gezielte Förderübungen/Erklärungen):\n" +
        stuck
          .map(t => {
            const blocked = TOPICS.filter(x => x.req.includes(t.id) && S.topics[x.id].status === "locked").map(
              x => x.id
            );
            return `- ${t.id} ${t.title}: ${S.topics[t.id].unlockFails} Versuche hintereinander unter 80 % (zuletzt ${pct(S.topics[t.id].last)})${blocked.length ? `, sperrt ${blocked.join(", ")}` : ""}`;
          })
          .join("\n")
    );
  const hx = hardExercises(15);
  if (hx.length) L.push("\nSCHWIERIGE ÜBUNGEN (dauerhaft oft falsch, aus dem Übungsprotokoll):\n" + hx.join("\n"));
  const rx = roundsLine();
  if (rx) L.push("\n" + rx);
  /* Für die KI nur offene Fehler (gelöste kosten nur Tokens, E-1007-77); der Bericht für Claude zeigt beide */
  const open = new Set(openErrors().map(o => errKey(o.e))),
    er = S.errors.filter(e => forReport || open.has(errKey(e))).slice(0, 20),
    solvedN = S.errors.slice(0, 20).filter(e => !open.has(errKey(e))).length;
  if (!forReport && solvedN) L.push(`\n(${solvedN} der letzten Fehler sind im Fehler-Training schon gelöst.)`);
  if (er.length) {
    L.push(forReport ? "\nLETZTE FEHLER:" : "\nOFFENE FEHLER:");
    er.forEach(e =>
      L.push(
        `- [${e.topic}] ${e.q} → „${e.user}“ (richtig: ${e.exp}${e.fix ? `; KI-Korrektur: ${e.fix}` : ""}) ${open.has(errKey(e)) ? "– offen" : "– ✓ gelöst"}`
      )
    );
  }
  return L.join("\n");
}

async function aiGlobal() {
  const ids =
    TOPICS.filter(t => S.topics[t.id].status === "learning")
      .map(t => t.id)
      .join(", ") || "keine";
  const p = `Aktueller Lernstand:

${progressSummary()}

Analysiere den Fortschritt wie eine erfahrene ${APP.teacherKind}. Schätze das Niveau (z. B. ${APP.levelHint}), erkenne Muster in Fehlern und vergessenen Wörtern und ziehe Wiederholungen vor, wo es sinnvoll ist (nur diese Themen-IDs: ${ids}; höchstens 4 Themen, nur mit klarer Begründung aus Fehlern oder Verlauf). Termine können nur vorgezogen werden – „topicId“ = genau eine dieser Themen-IDs (nie das Wort „topicId“), „days“ = ganze Zahl von 1 bis 60, in wie vielen Tagen ab heute; Themen, die nach Plan gut liegen, nicht aufführen. Heute ist der ${fmtDate(Date.now())}.
Halte jeden Text kurz (Listen höchstens 3 Punkte mit je max. 12 Wörtern), damit die Antwort vollständig bleibt.
Beurteile auch die Fertigkeiten Lesen (Lesetexte), Schreiben (Schreibaufgaben, freies Schreiben) und Gesprächsfähigkeit (Dialoge, Rollenspiel), soweit Daten dazu vorliegen; ohne Daten schreibe „noch keine Daten“.
Entscheide außerdem streng, ob die Grundlagen (Themen ${basicIds().join(", ") || "noch keine"}) über mehrere Wiederholungen sicher sitzen. Nur dann bekommt ${APP.learner} frei erzeugte Zusatzübungen. Im Zweifel false.
JSON: {"level":"…","summary":"2 Sätze","strengths":["…"],"weaknesses":["…"],"tips":["…"],"reschedule":[{"topicId":"${(TOPICS[0] || { id: "t01" }).id}","days":1,"reason":"max. 8 Wörter"}],"skills":{"lesen":"max. 12 Wörter","schreiben":"max. 12 Wörter","dialog":"max. 12 Wörter"},"nextFocus":"1 motivierender Satz","basicsSolid":false,"basicsReason":"1 kurzer Satz"}`;
  const meta = { k: "analyse" },
    j = await aiJSON(p, meta);
  j._aid = aiAudit("analyse", meta, {
    q: `Gesamtanalyse (Themen: ${ids})`,
    r: `Niveau ${j.level} | ${j.summary || ""} | Schwächen: ${(j.weaknesses || []).join("; ")} | Termine: ${(Array.isArray(j.reschedule) ? j.reschedule : []).map(r => (r && r.topicId) + " " + (r && r.days) + "T" + (reschedOk(r) ? "" : " (ungültig)")).join(", ")} | Fertigkeiten: ${j.skills ? `Lesen ${j.skills.lesen || "–"}; Schreiben ${j.skills.schreiben || "–"}; Dialog ${j.skills.dialog || "–"}` : "–"} | Grundlagen sicher: ${j.basicsSolid}`,
    rmax: 600
  });
  return j;
}

/* Die Gesamtanalyse darf Themen nur VORZIEHEN (höchstens 4) – nie nach hinten schieben und nie den Abstand des Plans
   verändern (E-1007-56). Früher schob sie Themen endlos hinaus oder hielt eines dauerhaft auf 1 Tag. */
/* Gültig: Thema wird gerade gelernt und days ist eine Zahl ab 1 (E-1009-7) – sonst im KI-Protokoll „ungültig“ */
function reschedOk(r) {
  const s = r && S.topics[r.topicId],
    d = r && parseInt(r.days, 10);
  return !!(s && s.status === "learning" && d >= 1);
}
function applyReschedule(list) {
  (Array.isArray(list) ? list : []).slice(0, 4).forEach(r => {
    const s = S.topics[r && r.topicId],
      d = clampInt(r && r.days, 1, 60);
    if (s && s.status === "learning" && d && (!s.due || addDays(d) < s.due)) {
      s.due = addDays(d);
      s.ai = { ...(s.ai || {}), reason: "Gesamtanalyse: " + (r.reason || "") };
    }
  });
}
async function runGlobal(silent) {
  if (GLOBAL_RUNNING) return;
  if (!aiReady()) {
    if (!silent) toast(APP.teacher + " ist nicht eingerichtet – siehe Einstellungen → Cloud & KI");
    return;
  }
  if (!TOPICS.some(t => S.topics[t.id].status === "learning")) {
    if (!silent) toast("Lerne zuerst ein Thema");
    return;
  }
  GLOBAL_RUNNING = true;
  /* S-1012-105: Start sofort vermerken und hochladen – sonst startet ein zweites Gerät kurz danach dieselbe Analyse;
     scheitert sie, gilt wieder der alte Zeitpunkt */
  GLOBAL_PREV = S.lastGlobal || 0;
  const claim = (S.lastGlobal = Date.now());
  save();
  if (cloudOn()) pushCloud();
  if (!silent) {
    const b = $("#globalbox");
    if (b) b.innerHTML = `<p class="muted">${APP.teacher} analysiert deinen Fortschritt ${dots()}</p>`;
  }
  try {
    const j = await aiGlobal();
    applyReschedule(j.reschedule);
    const aid = j._aid;
    delete j._aid;
    S.reports.unshift({ ...j, d: Date.now(), aid });
    S.reports = S.reports.slice(0, 10);
    if (!genUnlocked() && j.basicsSolid === true && basicsStatus().ok) {
      S.genUnlock = { on: true, d: Date.now(), reason: j.basicsReason || "" };
      setTimeout(() => toast("Freigeschaltet: Neue Übungen von " + APP.teacher + " – deine Grundlagen sitzen!"), 2600);
    }
    S.lastGlobal = Date.now();
    S.sinceGlobal = 0;
    save();
    if (!SESSION && (CUR.tab === "today" || CUR.tab === "progress" || CUR.tab === "settings")) render();
    toast(APP.teacher + " hat deinen Lernplan aktualisiert");
  } catch (e) {
    if (S.lastGlobal === claim) {
      S.lastGlobal = GLOBAL_PREV;
      save();
    }
    GLOBAL_FAILED_AT = Date.now();
    if (!silent) {
      toast(APP.teacher + " nicht erreichbar: " + aiErrShort());
      if (!SESSION) render(); // nie über eine laufende Runde zeichnen
    }
  }
  GLOBAL_PREV = null;
  GLOBAL_RUNNING = false;
}
let GLOBAL_FAILED_AT = 0,
  GLOBAL_PREV = null;
function maybeAutoGlobal() {
  if (!STARTUP_SYNCED || !aiReady() || GLOBAL_RUNNING || Date.now() - GLOBAL_FAILED_AT < 30 * 60000) return;
  /* höchstens alle 3 Tage und erst nach 5 Runden; nach einer Woche schon nach einer Runde (E-1008-13 – vorher lief sie
     etwa jeden zweiten Lerntag und war der größte Auftrag) */
  const ago = Date.now() - (S.lastGlobal || 0);
  if ((S.sinceGlobal >= 5 && ago >= 3 * DAY) || (ago >= 7 * DAY && S.sinceGlobal >= 1)) runGlobal(true);
}
