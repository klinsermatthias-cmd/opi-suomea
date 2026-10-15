/* Prüfskript – befunde.mjs (S-1008-102): Prüfungen zu Befunden: Lektionen getrennt vom Lernstand (E-1008-7), Gesamtprüfung (E-1008-1 …), Schwächen-Vorzug
   (E-1008-22), Befunde der Simulation (S-1008-15, E-1008-28), Selbsttest der Wortprüfung (S-1008-73).
   Aufgerufen von tools/pruefen.mjs; gemeinsame Werte und Ergebnisse früherer Teile stehen im Objekt P. */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

export default async function befunde(P) {
  const { ROOT, ok, fail, newWordsCheck, ids, device, r, a, b, t0, stored, k, shown } = P;
  // E-1008-7: Lektionen aus lektionen.json nicht im Lernstand; ein alter Stand mit Paketen wird verschlankt, Fortschritt bleibt
  { const L0 = JSON.parse(fs.readFileSync(path.join(ROOT, "tools/test-lektionen.json"), "utf8")), lid = L0[0].id;
    const old = { v: 1, app: "opi-suomea", created: 1, updated: 5, topics: { [lid]: { status: "learning", ease: 2.5, interval: 3, reps: 2, lapses: 0, due: Date.now() + 86400000, last: 0.9, best: 0.9, hist: [{ d: 4, sc: 90, r: "good" }], ai: null } }, cards: {}, errors: [], reports: [], daily: { date: "x", newCards: 0, newTopics: 0 }, stats: { streak: 0, last: null, reviews: 0, sessions: 1 }, settings: {}, packs: JSON.parse(JSON.stringify(L0)) };
    const m = await device({ setupDone: true }, null, JSON.stringify(old));
    await m.waitForFunction(() => localStorage.getItem("opi-suomea-lektionen"), null, { timeout: 5000 }).catch(() => {});
    const r = await m.evaluate(lid => ({ packs: S.packs.length, inTopics: !!T(lid), status: S.topics[lid] && S.topics[lid].status, cache: (JSON.parse(localStorage.getItem("opi-suomea-lektionen") || "[]") || []).length, stored: JSON.parse(localStorage.getItem("opi-suomea-v1")).packs.length }), lid);
    if (r.packs === 0 && r.stored === 0 && r.inTopics && r.status === "learning" && r.cache >= 1) ok("Lektionen getrennt vom Lernstand: alter Stand verschlankt, Thema und Fortschritt bleiben (E-1008-7)");
    else fail("E-1008-7 Lektionen im Lernstand: " + JSON.stringify(r));
    // Neustart, lektionen.json nicht erreichbar: Lektionen kommen aus dem Zwischenspeicher
    await m.route("**/lektionen/lektionen.json", rt => rt.abort()); await m.reload();
    await m.waitForFunction(() => typeof S !== "undefined" && S && TOPICS.length);
    if (!(await m.evaluate(lid => !!T(lid) && !S.packs.length, lid))) fail("E-1008-7: nach Neustart ohne lektionen.json fehlen die Lektionen");
    await m.context().close(); }

  // Gesamtprüfung 8.10.2026 (E-1008-1, -2, -3, -4, -6, -10, -12): Sperre, KI-Ausfall, strenge Endungen, Wortstellungen,
  // blockierte Voraussetzung, Themenwörter, Pakete aus fremden Quellen
  { const q = await device({ setupDone: true });
    const r = await q.evaluate(async () => {
      const E = [], far = Date.now() + 90 * 86400000;
      // E-1008-1: gesperrtes Thema nicht lernbar, „Wörter vorab lernen“ endet ohne Übungs-Knopf, alte Stände repariert
      const L = TOPICS.find(t => S.topics[t.id].status === "locked" && t.v.length);
      if (!L) E.push("kein gesperrtes Thema mit Wörtern");
      else {
        S.active = null; SESSION = null; startSession(L.id, "learn");
        if (SESSION || S.active) E.push("gesperrtes Thema ließ sich lernen");
        A.prevocab(L.id); topicVocabIds(L.id).forEach(id => (S.cards[id].tv = 1)); finishVocab();
        if (document.querySelector('#app [data-act="learn"]')) E.push("„Weiter zu den Übungen“ bei gesperrtem Thema");
        if (!/sobald das Thema frei ist/.test(document.querySelector("#app").textContent)) E.push("Hinweis „sobald das Thema frei ist“ fehlt");
        S.topics[L.id].hist = [{ d: Date.now(), sc: 90, r: "good" }]; migrate();
        if (S.topics[L.id].status !== "learning") E.push("gesperrtes Thema mit Runde nicht repariert");
      }
      // E-1008-2: KI nicht erreichbar → selbst entscheiden
      { const keepJ = aiJudge, keepR = aiReady, T2 = TOPICS.find(t => S.topics[t.id].status !== "locked" && t.ex.some(e => e.t === "tr"));
        aiReady = () => true; aiJudge = async () => { throw new Error("Zeitüberschreitung"); };
        S.active = null; SESSION = null; startSession(T2.id, "learn");
        const one = async (ans, act) => {
          let n = 0; while (SESSION.items[SESSION.idx].t !== "tr" && n++ < 50) { SESSION.idx++; renderEx(); }
          const k = SESSION.results.length; document.querySelector("#ans").value = ans; await checkAnswer();
          if (SESSION.results.length !== k || !document.querySelector('[data-act="selfok"]')) E.push("KI-Ausfall: keine Selbst-Entscheidung angeboten");
          A[act]();
          return SESSION.results[SESSION.results.length - 1];
        };
        const a = await one("ganz andere Worte", "selfok");
        if (!a || !a.correct || (S.aiAudit[0] || {}).m !== "selbst gewertet") E.push("„Meine Antwort war richtig“ zählt nicht oder fehlt im KI-Protokoll");
        SESSION.idx++; renderEx();
        const b = await one("noch was anderes", "selfno");
        if (!b || b.correct || (S.errors[0] || {}).user !== "noch was anderes") E.push("„Falsch“ zählt nicht als Fehler");
        aiJudge = keepJ; aiReady = keepR; SESSION = null; S.active = null; }
      // E-1008-3: Endungs-Lücke streng, Toleranz je Sprache
      if (!exStrict({ t: "gap", q: "Asut___ täällä?", a: ["ko"] }) || localCheck("kö", ["ko"], exStrict({ t: "gap", q: "Asut___ täällä?" })).correct) E.push("Endungs-Lücke nicht streng");
      if (exStrict({ t: "gap", q: "Minä ___ kotona.", a: ["olen"] }) || !localCheck("paiva", ["päivä"], false).correct) E.push("normale Lücke zu streng");
      if (SPRACHEN.de.loose.some(([a, b]) => /^[äöüÄÖÜ]$/.test(a) && /^[aouAOU]$/.test(b))) E.push("Deutsch: Umlaut-Toleranz nicht abgeschaltet");
      // E-1008-6: mehrere richtige Wortstellungen
      { const ox = { t: "ord", w: ["Annan", "siskolle", "lahjan"], a: ["Annan lahjan siskolle.", "Annan siskolle lahjan."], de: "x" };
        if (!FMT.ord.valid(ox) || !localCheck("annan siskolle lahjan", ordSols(ox), true).correct || ordFull(ox) !== "Annan lahjan siskolle.") E.push("Satz ordnen: zweite Wortstellung nicht erkannt"); }
      // E-1008-58: „Nur vertippt?“ – Nachbartaste/Vertauschung, nie in den letzten zwei Buchstaben (Endungen)
      { const t = [typoOf("Open", ["olen"]), typoOf("olet", ["olen"]), typoOf("Minä open Matthias", ["Minä olen Matthias"]), typoOf("khavi", ["kahvi"]),
          typoOf("olrn", ["olen"]), typoOf("kahvi", ["kahvi"]), typoOf("tlao", ["talo"]), typoOf("kaxvi", ["kahvi"]), typoOf("Ich bun", ["Ich bin"])];
        const want = ["olen", null, "olen", "kahvi", null, null, null, null, null];
        if (t.map(x => x && x.w).join("|") !== want.join("|")) E.push("typoOf: " + JSON.stringify(t.map(x => x && x.w)));
        if (!keyNeighbors("z", "u") || !keyNeighbors("y", "u") || keyNeighbors("a", "p")) E.push("keyNeighbors: QWERTY/QWERTZ falsch"); }
      // E-1008-58: fehlende ä/ö-Punkte werden je Wort gezählt (Wertung bleibt „fast richtig“)
      { S.slips = [];
        const r1 = localCheck("Hyvää paivaa", ["Hyvää päivää"], false);
        if (!r1.correct || S.slips.length !== 1 || S.slips[0].k !== "loose" || S.slips[0].w !== "päivää" || S.slips[0].u !== "paivaa") E.push("ä/ö-Ausrutscher nicht gezählt: " + JSON.stringify(S.slips));
        localCheck("Hyvää paivaa", ["Hyvää päivää"], false);
        if (S.slips.length !== 1) E.push("ä/ö-Ausrutscher doppelt gezählt"); }
      // E-1008-58: in der Übung – Knopf „Nur vertippt“ ohne KI-Anfrage, zählt als richtig, im Bericht
      { const keepJ = aiJudge, keepR = aiReady; let calls = 0;
        aiReady = () => true; aiJudge = async () => { calls++; return { correct: false, feedback: "" }; };
        const T3 = TOPICS.find(t => S.topics[t.id].status !== "locked" && t.ex.some(e => e.t === "tr" && !exStrict(e) && /\p{L}{4,}/u.test(e.a[0])));
        S.active = null; SESSION = null; startSession(T3.id, "learn");
        let n = 0; const fit = e => e.t === "tr" && !exStrict(e) && /\p{L}{4,}/u.test(e.a[0]);
        while (!fit(SESSION.items[SESSION.idx]) && n++ < 80) { SESSION.idx++; renderEx(); }
        const ex = SESSION.items[SESSION.idx], sol = ex.a[0], p = /\p{L}{4,}/u.exec(sol).index, c = sol[p].toLowerCase(),
          row = KEY_ROWS[0].find(r => r.includes(c)), nb = row ? row[row.indexOf(c) + 1] || row[row.indexOf(c) - 1] : null;
        if (!nb) E.push("Testannahme: kein Tastatur-Nachbar für " + c);
        else {
          const k0 = SESSION.results.length, sl0 = S.slips.length; document.querySelector("#ans").value = sol.slice(0, p) + nb + sol.slice(p + 1); await checkAnswer();
          if (calls || SESSION.results.length !== k0 || !/Nur vertippt/.test(document.querySelector("#fb").textContent)) E.push("„Nur vertippt?“ nicht angeboten oder KI gefragt");
          A.selfok();
          // E-1010-5: erst bei „Weiter“ gezählt, bis dahin umschaltbar
          if (SESSION.results.length !== k0 || S.slips.length !== sl0 || !document.querySelector("#typomark")) E.push("„Nur vertippt“: zählt sofort statt erst bei „Weiter“ (E-1010-5)");
          A.typotoggle(); if (!/Fehler/.test(document.querySelector("#typomark").textContent)) E.push("„Nur vertippt“: Umschalten auf „doch falsch“ wirkt nicht (E-1010-5)");
          A.typotoggle(); const se = SESSION; A.next();
          const res = se.results[k0];
          if (!res || !res.correct || (S.slips[0] || {}).k !== "typo" || S.slips.length !== sl0 + 1) E.push("„Nur vertippt“ zählt nicht als richtig oder fehlt in den Ausrutschern");
          if (!/AUSRUTSCHER[\s\S]*Nur vertippt/.test(buildReport())) E.push("Bericht ohne Abschnitt AUSRUTSCHER");
        }
        aiJudge = keepJ; aiReady = keepR; SESSION = null; S.active = null; }
      // E-1008-59: von der KI anerkannte Vokabel-Antwort gemerkt, beim nächsten Mal ohne KI, Urteil von Claude, ⚑
      { const t = TOPICS[0], id = `${t.id}-0-r`, had = S.cards[id], keepV = vocabJudge, keepR = aiReady, keepF = window.fetch; let calls = 0;
        if (!had) S.cards[id] = { isNew: true, due: Date.now(), interval: 0, ease: 2.5, reps: 0, lapses: 0 };
        aiReady = () => true; vocabJudge = async () => { calls++; return { correct: true, feedback: "passt", _aid: "va-test" }; };
        S.vocAlt = [];
        const flip = async txt => { SESSION = { kind: "vocab", queue: [id], done: 0, again: 0 }; renderCard(); document.querySelector("#ans").value = txt; flipCard(); await new Promise(r => setTimeout(r, 20)); return document.querySelector("#back").textContent; };
        await flip("Andere Lösung");
        if (calls !== 1 || (S.vocAlt[0] || {}).a !== "Andere Lösung" || S.vocAlt[0].id !== id) E.push("Vokabel: anerkannte Antwort nicht gemerkt " + JSON.stringify(S.vocAlt));
        const txt = await flip("andere lösung");
        if (calls !== 1 || !/schon einmal anerkannt/.test(txt)) E.push("Vokabel: gemerkte Antwort nicht ohne KI erkannt: " + txt);
        const key = `va:${id}:andere lösung`;
        if (!vocAltReportSection().includes(key) || !buildReport().includes("VOKABEL-ANTWORTEN ZUR PRÜFUNG")) E.push("Bericht ohne Vokabel-Antworten zur Prüfung");
        // Abgleich: Eintrag nicht doppelt, ⚑ vom neueren Gerät gilt
        const other = JSON.parse(JSON.stringify(S));
        if (other.vocAlt[0]) { other.vocAlt[0].x = 1; other.vocAlt[0].xu = Date.now() + 5; other.vocAlt[0].d -= 3; }
        const M = mergeStates(S, other);
        if (M.vocAlt.length !== 1 || M.vocAlt[0].x !== 1) E.push("Abgleich der Vokabel-Antworten falsch: " + JSON.stringify(M.vocAlt));
        const MS = mergeStates({ ...S, slips: [{ d: 1, k: "typo", w: "olen", u: "open" }] }, { ...S, slips: [{ d: 2, k: "loose", w: "päivää", u: "paivaa" }, { d: 1, k: "typo", w: "olen", u: "open" }] });
        if (MS.slips.length !== 2) E.push("Abgleich der Ausrutscher falsch: " + JSON.stringify(MS.slips));
        // Urteil von Claude: falsch → gilt nicht mehr, die KI wird wieder gefragt
        window.fetch = async (u, o) => (/ki-pruefung/.test(String(u)) ? new Response(JSON.stringify({ [key]: { ok: false, korrektur: t.v[0][0], grund: "Test" } })) : keepF(u, o));
        await loadGenVerdicts();
        if (!S.vocAlt[0] || !S.vocAlt[0].v || S.vocAlt[0].v.ok !== false || vocAltFor(id).length || vocAltReportSection()) E.push("Urteil zur Vokabel-Antwort nicht übernommen");
        await flip("andere lösung");
        if (calls !== 2) E.push("verworfene Vokabel-Antwort wird weiter ohne KI anerkannt");
        // ⚑ an einer noch ungeprüften Antwort
        S.vocAlt = [{ d: Date.now(), id, a: "Dritte", aid: "va-x" }]; vocAltFlag("va-x", true);
        if (vocAltFor(id).length) E.push("⚑ verwirft die gemerkte Vokabel-Antwort nicht");
        window.fetch = keepF; vocabJudge = keepV; aiReady = keepR; SESSION = null; S.vocAlt = []; S.slips = []; if (!had) delete S.cards[id]; }
      // E-1009-3: „Noch nicht gelernt?“ – Link in der Übung, Fehler raus aus Fehler-Training und Schwächen, Bericht, Abgleich
      { const T4 = TOPICS.find(t => S.topics[t.id].status !== "locked" && t.ex.length);
        S.active = null; SESSION = null; S.unlearned = []; startSession(T4.id, "learn");
        const src = srcOf(S.active, SESSION.idx), q = promptText(SESSION.items[SESSION.idx]), keepE = S.errors, keepW = S.weak;
        S.errors = [{ d: Date.now(), topic: src.tid, ei: src.ei, q, user: "x", exp: "y" }];
        S.weak = [{ d: Date.now(), k: "dialog", tid: src.tid, ei: src.ei, g: [src.tid], aid: "w-x" }];
        const ln = document.querySelector('[data-act="unlearned"]');
        if (!ln || !openErrors().length || !weakCounts(S.weak[0])) E.push("„Noch nicht gelernt?“: Link fehlt oder Testannahme falsch");
        else {
          A.unlearned(ln.dataset.id, ln);
          if (openErrors().length || weakCounts(S.weak[0]) || !/gemeldet/.test(ln.textContent)) E.push("„Noch nicht gelernt?“: Fehler bleibt im Fehler-Training oder bei den Schwächen");
          if (!new RegExp("NOCH NICHT GELERNT\\?[\\s\\S]*" + src.tid + " ex\\[" + src.ei + "\\]").test(buildReport())) E.push("Bericht ohne Abschnitt NOCH NICHT GELERNT");
          const MS = mergeStates({ ...S }, { ...S, unlearned: [{ ...S.unlearned[0], x: 1, xu: S.unlearned[0].xu + 5 }] });
          if (MS.unlearned.length !== 1 || !MS.unlearned[0].x) E.push("Abgleich „Noch nicht gelernt?“: jüngere Rücknahme gewinnt nicht");
          /* E-1012-1: gemeldete Übung zählt nicht ins Rundenergebnis */
          { const se = SESSION; se.results = [{ q, user: "x", exp: "y", correct: false, retry: false, tid: src.tid, ei: src.ei }, { q: "b", user: "b", exp: "b", correct: true, retry: false, tid: src.tid, ei: -1 }];
            finishTopic(); if (se.score !== 1 || !/als „Noch nicht gelernt“ gemeldet – zählt nicht/.test(app().innerHTML)) E.push("„Noch nicht gelernt?“ zählt im Rundenergebnis (" + se.score + ")");
            se.results = [se.results[0]]; finishTopic(); if (se.score !== 0) E.push("Nur gemeldete Übungen: Runde gilt als bestanden");
            SESSION = se; }
          A.unlearned(ln.dataset.id, ln);
          if (!openErrors().length || !weakCounts(S.weak[0]) || /NOCH NICHT GELERNT/.test(buildReport())) E.push("„Noch nicht gelernt?“: Zurücknehmen wirkt nicht");
        }
        S.errors = keepE; S.weak = keepW; S.unlearned = []; SESSION = null; S.active = null; }
      // S-1013-42: Musterlösung auch bei richtiger Antwort; weitere richtige Lösungen; Dialog/Tabelle: Muster unter abweichender richtiger Zeile
      { const TR = TOPICS.flatMap(t => t.ex).find(e => e.t === "tr" && e.a.length > 1), DL = TOPICS.flatMap(t => t.ex).find(e => e.t === "dlg" && dlgGaps(e).some(g => g.length > 1));
        app().innerHTML = '<div id="fb"></div>';
        if (TR) { showFb({ correct: true, ai: "passt" }, TR); const tx = $("#fb").textContent;
          if (!tx.includes("Musterlösung:") || !tx.includes(TR.a[0]) || !tx.includes("Auch richtig:")) E.push("Musterlösung fehlt bei richtiger Antwort"); }
        if (DL) { app().innerHTML = dlgRender(DL); const g = dlgGaps(DL), cells = document.querySelectorAll(".dcell");
          cells.forEach((c, k) => (c.value = g[k][1] || g[k][0])); dlgMark(DL, g.map(() => true), false, null);
          const k2 = g.findIndex(x => x.length > 1), sol = cells[k2].parentElement.querySelector(".sol.muted");
          if (!sol || !sol.textContent.includes(g[k2][0])) E.push("Dialog: Musterlösung fehlt unter abweichender richtiger Zeile"); }
        SESSION = null; A.tab("today"); }
      // S-1013-41: Zeitraster + Punkte – 3× richtig ruht 14 Tage, dann 30/60, Fehler hebt auf; ruhende nur als Auffüllung
      { const keepL = S.exLog, TT = TOPICS.find(t => S.topics[t.id].status !== "locked" && t.ex.length >= 3 && t.ex.some(e => e.t !== "mc" && !e.aus));
        S.exLog = {}; const ei0 = TT.ex.findIndex(e => e.t !== "mc" && !e.aus), src = { tid: TT.id, ei: ei0 }, ex = TT.ex[ei0], k = exKey(src, ex), near = (v, d) => Math.abs(v - (Date.now() + d * DAY)) < 60000;
        exLogAdd(src, ex, true); exLogAdd(src, ex, true);
        if (exResting(S.exLog[k])) E.push("Zeitraster: ruht schon nach 2× richtig");
        exLogAdd(src, ex, true);
        if (!exResting(S.exLog[k]) || !near(S.exLog[k].p, 14) || S.exLog[k].z !== 1) E.push("Zeitraster: nach 3× richtig keine 14 Tage Ruhe");
        const pool = topicPool(TT.id, true), before = topicAvail(TT.id);
        if (before !== pool.length - 1) E.push("Zeitraster: topicAvail zählt ruhende mit");
        const picks = pickRound(pool, Math.min(3, pool.length - 1));
        if (picks.some(c => c.src.ei === ei0)) E.push("Zeitraster: ruhende Übung trotz genug anderer gewählt");
        if (!pickRound(pool, pool.length).some(c => c.src.ei === ei0)) E.push("Zeitraster: ruhende Übung füllt nicht auf");
        if (exScore({ src, ex }, new Set(), true) < exScore({ src, ex }, new Set()) + 15) E.push("Zeitraster: Freischalt-/Lernrunde nicht ausgenommen");
        S.exLog[k].p = Date.now() - 1000; exLogAdd(src, ex, true);
        if (!near(S.exLog[k].p, 30) || S.exLog[k].z !== 2) E.push("Zeitraster: zweite Ruhe nicht 30 Tage");
        const o = { [k]: { ...S.exLog[k], s: S.exLog[k].s - 5000, p: 0, z: 0 } }, M = mergeExLog(o, S.exLog);
        if (!near(M[k].p, 30)) E.push("Zeitraster: Abgleich verliert die Ruhe");
        exLogAdd(src, ex, false);
        if (S.exLog[k].p || S.exLog[k].z || S.exLog[k].c) E.push("Zeitraster: Fehler hebt die Ruhe nicht auf");
        if (!/ruhen \(3× richtig/.test(buildReport()) && learningTopics().length) E.push("Zeitraster: Bericht nennt ruhende Übungen nicht");
        S.exLog = keepL; }
      // S-1013-47: mc ruht nach 2× richtig doppelt so lange; höchstens MC_MAX mc je Runde, mehr nur zum Auffüllen
      { const keepL = S.exLog, TT = TOPICS.find(t => S.topics[t.id].status !== "locked" && t.ex.some(e => e.t === "mc" && !e.aus));
        S.exLog = {}; const ei = TT.ex.findIndex(e => e.t === "mc" && !e.aus), src = { tid: TT.id, ei }, ex = TT.ex[ei], k = exKey(src, ex);
        exLogAdd(src, ex, true);
        if (exResting(S.exLog[k])) E.push("S-1013-47: mc ruht schon nach 1× richtig");
        exLogAdd(src, ex, true);
        if (!exResting(S.exLog[k]) || Math.abs(S.exLog[k].p - (Date.now() + 28 * DAY)) > 60000) E.push("S-1013-47: mc ruht nach 2× richtig nicht 28 Tage");
        S.exLog = {};
        const pool = TOPICS.filter(t => S.topics[t.id].status !== "locked").flatMap(t => topicPool(t.id, false));
        const mcs = pool.filter(c => c.ex.t === "mc").slice(0, 4), others = pool.filter(c => c.ex.t !== "mc" && !FIXED_TYPES.includes(c.ex.t)).slice(0, 6);
        others.forEach(c => exLogAdd(c.src, c.ex, true)); /* heute gesehen → wenige Punkte; ohne Obergrenze kämen alle 4 mc */
        if (mcs.length === 4 && others.length === 6 && pickRound([...mcs, ...others], 6).filter(c => c.ex.t === "mc").length !== MC_MAX) E.push("S-1013-47: nicht genau MC_MAX mc in einer Runde");
        S.exLog = {};
        const onlyMc = pool.filter(c => c.ex.t === "mc").slice(0, 5);
        if (onlyMc.length === 5 && pickRound(onlyMc, 5).length !== 5) E.push("S-1013-47: Runde füllt bei nur mc nicht auf");
        S.exLog = keepL; }
      // S-1013-48: KI-Übungen je Thema, sobald das Thema sitzt
      { const keepG = S.genUnlock, LT = TOPICS.find(t => S.topics[t.id].status === "learning");
        if (LT) { const keepT = { ...S.topics[LT.id] }; S.genUnlock = null;
          Object.assign(S.topics[LT.id], { last: 0.85, reps: 2 });
          if (!genUnlockedFor(LT.id) || !genSolidTopics().some(t => t.id === LT.id)) E.push("S-1013-48: Thema mit ≥ 80 % und 2 Wiederholungen nicht freigeschaltet");
          Object.assign(S.topics[LT.id], { last: 0.7, hist: [] }); // D-1014-48: unter 80 % erst nach einer Runde (gezielt)
          if (genUnlockedFor(LT.id)) E.push("S-1013-48/D-1014-48: Thema unter 80 % ohne Runde freigeschaltet");
          S.topics[LT.id] = keepT; }
        S.genUnlock = keepG; }
      // S-1013-49: Wörter schnell hinzufügen – aufteilen, Kurs-Hinweis, angehakte speichern, nie doppelt
      { const keepO = S.own, keepC = { ...S.cards }, keepCur = CUR;
        const sp = ownSplit("Haus, Katze\nhouse;  Haus ,");
        if (sp.length !== 3 || sp[0] !== "Haus" || sp[2] !== "house") E.push("S-1013-49: Eingabe wird nicht richtig aufgeteilt");
        if (ownInCourse(TOPICS[0].v[0][0]) !== TOPICS[0] || ownInCourse("zzqxwort")) E.push("S-1013-49: Kurs-Hinweis falsch");
        S.own = {}; OWN_BULK = [{ fi: "zzqxa", de: "Test A", on: true }, { fi: "zzqxb", de: "Test B", on: false }, { fi: "zzqxa", de: "doppelt", on: true }];
        ownBulkSave();
        const ks = ownKeys();
        if (ks.length !== 1 || S.own[ks[0]].fi !== "zzqxa" || !S.cards["own-" + ks[0]] || !S.cards["own-" + ks[0] + "-r"]) E.push("S-1013-49: angehakte Wörter nicht als eigene Wörter mit zwei Karten gespeichert");
        OWN_BULK = [{ fi: "ZZQXA", de: "nochmal", on: true }]; ownBulkSave();
        if (ownKeys().length !== 1) E.push("S-1013-49: eigenes Wort doppelt gespeichert");
        if (OWN_BULK.length !== 1) E.push("S-1013-49: Liste trotz nichts Gespeichertem geleert");
        OWN_BULK = []; Object.keys(S.cards).filter(k => k.startsWith("own-") && !(k in keepC)).forEach(k => delete S.cards[k]);
        S.own = keepO; CUR = keepCur; DICT = null; }
      // D-1014-45: „Merken“ beim Antippen – nur für Wörter außerhalb von Kurs und eigenen Wörtern, Grundform wie geschrieben
      { const keepO = S.own, keepC = { ...S.cards }; S.own = {};
        if (glossMerkHTML(TOPICS[0].v[0][0], { de: "x", base: gkey(TOPICS[0].v[0][0]) })) E.push("D-1014-45: Merken bei einem Kurswort angeboten");
        if (!glossMerkHTML("zzqxformen", { de: "Test", base: "zzqxform", bf: "Zzqxform" })) E.push("D-1014-45: Merken fehlt bei unbekanntem Wort");
        glossMerk(null); const ks = ownKeys();
        if (ks.length !== 1 || S.own[ks[0]].fi !== "Zzqxform" || S.own[ks[0]].de !== "Test" || !S.cards["own-" + ks[0] + "-r"]) E.push("D-1014-45: gemerktes Wort nicht als eigenes Wort mit zwei Karten gespeichert");
        if (glossMerkHTML("zzqxformen", { de: "Test", base: "zzqxform", bf: "Zzqxform" })) E.push("D-1014-45: Merken trotz schon gemerktem Wort angeboten");
        Object.keys(S.cards).filter(k => k.startsWith("own-") && !(k in keepC)).forEach(k => delete S.cards[k]);
        S.own = keepO; DICT = null; GLOSS_MERK = null; }
      // S-1014-50/-51: eigene Wörter im Format der Kurskarten – Formzeilen als 3. Element, „geprüft“ nur bei unverändertem
      // KI-Vorschlag, ungeprüfte Wörter prüft ownEnrich nachträglich, Bericht markiert Ungeprüftes
      { const keepO = S.own, keepC = { ...S.cards }, keepCur = CUR, keepJ = aiJSON, keepR = aiReady, keepSy = STARTUP_SYNCED, keepF = APP.ownForms;
        S.own = {}; OWN_BULK = [{ fi: "zzqxv", fi0: "zzqxv", de: "Test V", f: ["Präsens: zzqx"], on: true }, { fi: "zzqxw", fi0: "zzqxx", de: "Test W", f: ["Präsens: alt"], on: true }];
        ownBulkSave();
        const byFi = fi => ownKeys().map(k => S.own[k]).find(w => w.fi === fi) || {};
        if (!byFi("zzqxv").c || (byFi("zzqxv").f || [])[0] !== "Präsens: zzqx") E.push("S-1014-50: KI-Vorschlag ohne Formzeilen bzw. nicht als geprüft gespeichert");
        if (byFi("zzqxw").c || byFi("zzqxw").f) E.push("S-1014-50: geändertes Wort trotzdem mit Formen der KI bzw. als geprüft gespeichert");
        const kv = ownKeys().find(k => S.own[k].fi === "zzqxv");
        if (!ownWord(kv)[2] || ownWord(kv)[2].f[0] !== "Präsens: zzqx") E.push("S-1014-50: Formzeilen erscheinen nicht auf der Karte");
        if (!/zzqxw = Test W \(ungeprüft\)/.test(ownReport()) || !/\[Präsens: zzqx\]/.test(ownReport())) E.push("S-1014-51: Bericht zeigt Formen bzw. „ungeprüft“ nicht");
        APP.ownForms = "Formzeilen"; aiReady = () => true; STARTUP_SYNCED = true; OWN_ENRICH_AT = 0;
        aiJSON = async () => ({ words: [{ in: "zzqxw", fi: "zzqxwk", de: "Test W korr", f: ["Präsens: neu"] }] });
        await ownEnrich();
        if (!byFi("zzqxwk").c || (byFi("zzqxwk").f || [])[0] !== "Präsens: neu") E.push("S-1014-50: ungeprüftes Wort nicht nachträglich geprüft");
        if (!byFi("zzqxv").c || byFi("zzqxv").fi !== "zzqxv") E.push("S-1014-50: schon geprüftes Wort erneut geändert");
        OWN_BULK = []; Object.keys(S.cards).filter(k => k.startsWith("own-") && !(k in keepC)).forEach(k => delete S.cards[k]);
        aiJSON = keepJ; aiReady = keepR; STARTUP_SYNCED = keepSy; APP.ownForms = keepF; OWN_ENRICH_AT = 0;
        S.own = keepO; CUR = keepCur; DICT = null; }
      // S-1014-1: Lernschritte – nur Schritt-Übungen, ab 80 % nächster Schritt, Theorie gesperrt, Abgleich, ungültig = aus
      { const TT = TOPICS.find(t => t.ex.filter(e => !e.aus).length >= 6 && (String(t.th).match(/<h3[\s>]/gi) || []).length >= 2);
        if (TT) { const keepSt = TT.steps, keepT = JSON.parse(JSON.stringify(S.topics[TT.id])), keepA = S.active, keepS = SESSION, keepCur = CUR;
          const idx = TT.ex.map((e, i) => (e.aus ? -1 : i)).filter(i => i >= 0);
          TT.steps = [{ t: "A", sec: [1], ex: idx.slice(0, 3) }, { t: "B", sec: [2], ex: idx.slice(3, 6) }];
          S.topics[TT.id] = { ...S.topics[TT.id], status: "new", st: 0, std: 0, hist: [] };
          if (stepNow(TT.id) !== 0) E.push("S-1014-1: Schritt 1 nicht aktiv");
          if (!/steplock/.test(stepTheory(TT, 0)) || /steplock/.test(stepTheory(TT, 1))) E.push("S-1014-1: Theorie späterer Schritte nicht gesperrt bzw. nicht frei");
          S.active = null; startStep(TT.id);
          if (!S.active || S.active.mode !== "step" || S.active.gsrc.some(g => !idx.slice(0, 3).includes(g.ei))) E.push("S-1014-1: Schritt-Runde enthält fremde Übungen");
          stepFinish({ id: TT.id }, 0.5);
          if (S.topics[TT.id].st) E.push("S-1014-1: unter 80 % trotzdem weiter");
          stepFinish({ id: TT.id }, 0.9);
          if (S.topics[TT.id].st !== 1 || stepNow(TT.id) !== 1) E.push("S-1014-1: ab 80 % kein nächster Schritt");
          S.active = { ...S.active, step: 1 }; stepFinish({ id: TT.id }, 1);
          if (stepNow(TT.id) !== 2) E.push("S-1014-1: nach dem letzten Schritt nicht fertig");
          // S-1014-54: „Regel ansehen“ – nur in Lernschritt/erster Lernrunde; danach zählt „richtig“ als Fehlversuch, kommt
          // nochmal, ohne Fehlerliste; nicht in Wiederholungen und nicht beim zweiten Versuch
          { const stK = S.topics[TT.id].st, errK = S.errors.slice(), logK = JSON.stringify(S.exLog || {});
            S.topics[TT.id].st = 0; S.active = null; SESSION = null; startStep(TT.id); if (!SESSION) openSession();
            if (!SESSION || !peekAllowed(SESSION) || !document.querySelector('#app [data-act="peek"]')) E.push("S-1014-54: „Regel ansehen“ fehlt im Lernschritt");
            else {
              const n0 = S.active.idxs.length, ex0 = SESSION.items[0];
              peekOpen();
              if (!peekOn(SESSION) || !document.querySelector("#peek .peekbox")) E.push("S-1014-54: Regel wird nicht eingeblendet");
              record(ex0, "x", { correct: true });
              const r0 = SESSION.results[0];
              if (!r0 || r0.correct || !r0.peek) E.push("S-1014-54: nachgeschaut, aber als richtig gewertet");
              if (S.errors.length !== errK.length || JSON.stringify(S.exLog || {}) !== logK) E.push("S-1014-54: Nachschauen landet in Fehlerliste bzw. Übungsstatistik");
              const pos = S.active.rt.indexOf(1);
              if (S.active.idxs.length !== n0 + 1 || pos < 0) E.push("S-1014-54: nachgeschaute Übung kommt nicht nochmal");
              else { SESSION.idx = pos; if (peekAllowed(SESSION)) E.push("S-1014-54: „Regel ansehen“ auch beim zweiten Versuch"); }
              SESSION.mode = "review"; SESSION.idx = 0;
              if (peekAllowed(SESSION)) E.push("S-1014-54: „Regel ansehen“ auch in Wiederholungen");
            }
            S.errors = errK; S.exLog = JSON.parse(logK); SESSION = null; S.active = null; S.topics[TT.id].st = stK; }
          // S-1014-10: Ersatz nach zwei Fehlversuchen – unbenutzte Übung desselben Schritts, dann -1; Rundengröße ≤ 10
          { const sa = { mode: "step", id: TT.id, step: 0, gen: [TT.ex[idx[0]]], gsrc: [{ tid: TT.id, ei: idx[0] }] };
            const j1 = stepSwap(sa), j2 = stepSwap(sa), j3 = stepSwap(sa);
            if (j1 !== 1 || j2 !== 2 || j3 !== -1 || !sa.gsrc.slice(1).every(g => idx.slice(1, 3).includes(g.ei))) E.push("S-1014-10: Ersatzübung falsch: " + JSON.stringify(sa.gsrc));
            if (stepSwap({ ...sa, mode: "review" }) !== -1) E.push("S-1014-10: Ersatzübung außerhalb von Lernschritten");
            if (STEP_MAX + STEP_PREV > 10) E.push("S-1014-10: Schritt-Runde größer als 10");
            const keepSe = SESSION; SESSION = { mode: "step", title: "X" };
            if (!/LERNSCHRITT/.test(STEP_RULE())) E.push("S-1014-10: Lernschritt-Regel fehlt im KI-Auftrag");
            SESSION = { mode: "review", title: "X" };
            if (STEP_RULE()) E.push("S-1014-10: Lernschritt-Regel auch in Wiederholungen");
            SESSION = keepSe; }
          const A = JSON.parse(JSON.stringify(S)), B = JSON.parse(JSON.stringify(S));
          B.topics[TT.id].st = 0; B.topics[TT.id].std = 0;
          if (mergeStates(A, B).topics[TT.id].st !== 2 || mergeStates(B, A).topics[TT.id].st !== 2) E.push("S-1014-1: Abgleich verliert den Lernschritt");
          B.resets = { [TT.id]: { at: Date.now() + 1000 } };
          if (mergeStates(A, B).topics[TT.id].st === 2 && mergeStates(B, A).topics[TT.id].st === 2) E.push("S-1014-1: Abgleich holt Schritt von vor dem Zurücksetzen");
          TT.steps = [{ t: "A", ex: [0] }, { t: "B", ex: [TT.ex.length + 5] }];
          if (topicSteps(TT) || stepNow(TT.id) !== -1) E.push("S-1014-1: ungültige steps nicht ignoriert");
          S.topics[TT.id].status = "learning"; TT.steps = keepSt === undefined ? [{ t: "A", ex: [0] }, { t: "B", ex: [1] }] : keepSt;
          if (stepNow(TT.id) !== -1) E.push("S-1014-1: gelerntes Thema nutzt Lernschritte");
          if (keepSt === undefined) delete TT.steps; else TT.steps = keepSt;
          S.topics[TT.id] = keepT; S.active = keepA; SESSION = keepS; CUR = keepCur; } }
      // S-1014-7/-17: Themenabstand nach vergangener Zeit, Vorzug höchstens gleich, Wachstum ≤ ×2,5, max. 60 bzw. 30 Tage
      { const now = Date.now(), keepW = S.weak, tb = (s, q) => topicBase(s, 0.9, q, "zz-test").days;
        S.weak = [];
        if (tb({ ease: 2.5, reps: 3, interval: 40, hist: [{ d: now - 5 * DAY }], due: now + 35 * DAY }, 4) > 15) E.push("S-1014-7: vorgezogene Wiederholung rechnet mit dem geplanten Abstand");
        if (tb({ ease: 2.5, reps: 3, interval: 10, hist: [{ d: now - 8 * DAY }], due: now }, 4) !== 10) E.push("S-1014-7: Vorziehen wegen Schwächen verlängert den Abstand");
        if (tb({ ease: 3, reps: 3, interval: 10, hist: [{ d: now - 10 * DAY }], due: now }, 5) !== 25) E.push("S-1014-7: Wachstum nicht auf ×2,5 begrenzt");
        if (tb({ ease: 2.5, reps: 5, interval: 50, hist: [{ d: now - 50 * DAY }], due: now }, 4) !== 60) E.push("S-1014-17: Themenabstand nicht auf 60 Tage begrenzt");
        S.weak = [{ d: now - DAY, k: "dialog", tid: "x", g: ["zz-test"], aid: "w1" }, { d: now - 2 * DAY, k: "dialog", tid: "x", g: ["zz-test"], aid: "w2" }];
        if (tb({ ease: 2.5, reps: 5, interval: 50, hist: [{ d: now - 50 * DAY }], due: now }, 4) !== 30) E.push("S-1014-7: Schwächen-Treffer begrenzen nicht auf 30 Tage");
        if (topicIvMax(0.9, 50, 5, "zz-test") !== 30) E.push("S-1014-7: KI-Termin trotz Schwächen über 30 Tage");
        S.weak = keepW;
        const t0 = TOPICS[0], k0 = JSON.stringify(S.topics[t0.id]);
        Object.assign(S.topics[t0.id], { interval: 200, hist: [{ d: now - 10 * DAY, sc: 90 }], due: now + 190 * DAY });
        capTopicIntervals();
        if (S.topics[t0.id].interval !== 60 || S.topics[t0.id].due > now + 51 * DAY) E.push("S-1014-17: bestehender langer Themenabstand nicht begrenzt");
        S.topics[t0.id] = JSON.parse(k0); }
      // S-1014-9/-11/-13: Themenzuordnung nur zu passenden Themen, Lückenhinweis in Wiederholungen auf Knopfdruck, KI-Protokoll als Stichprobe
      { if (!/genau diese Regel lehrt/.test(WEAK_FIELD)) E.push("S-1014-9: Regel zur Themenzuordnung fehlt");
        const keepSe = SESSION, gx = { t: "gap", q: "a ___ b", a: ["x"], h: "Hinweis" };
        SESSION = { mode: "review" };
        if (!/<details/.test(gapHintHTML(gx))) E.push("S-1014-11: Lückenhinweis in der Wiederholung sofort sichtbar");
        SESSION = { mode: "learn" };
        if (/<details/.test(gapHintHTML(gx)) || !/Hinweis/.test(gapHintHTML(gx))) E.push("S-1014-11: Lückenhinweis beim Lernen verborgen");
        SESSION = keepSe;
        const keepAu = S.aiAudit, k = Object.keys(AI_KINDS)[0], now = Date.now();
        S.aiAudit = [...Array(40)].map((_, i) => ({ id: "t" + i, d: now - i * 1000, k, m: "m", q: "ZZQ" + i, r: "x", ok: i % 2 === 0, ...(i === 39 ? { flag: 1 } : {}) }));
        const r = aiReport(), n = (r.match(/ZZQ\d+/g) || []).length;
        if (n !== AUDIT_BAD + AUDIT_OK + 1 || !/Stichprobe/.test(r) || !/ZZQ39/.test(r)) E.push("S-1014-13: KI-Protokoll nicht als Stichprobe: " + n);
        S.aiAudit = keepAu; }
      // S-1014-20: im Lernschritt nicht gewertete Fehler – Fehlerart gespeichert (ohne Vorziehen), Korrektur hervorgehoben
      { const keepW = S.weak, keepSe = SESSION, k0 = errKinds()[0];
        S.weak = []; weakNote("schreibaufgabe", "x", [], "m1", -1, [k0], true);
        if (!S.weak[0] || S.weak[0].m !== 1 || S.weak[0].g.length) E.push("S-1014-20: nicht gewerteter Fehler nicht als Fehlerart gespeichert");
        if (!/im Lernschritt nicht gewertet/.test(kindSummary(false))) E.push("S-1014-20: Bericht nennt nicht gewertete Fehler nicht");
        if (Object.keys(weakPlan()).length) E.push("S-1014-20: nicht gewerteter Fehler zieht ein Thema vor");
        SESSION = { mode: "step", title: "X" };
        if (!/kinds/.test(STEP_RULE())) E.push("S-1014-20: KI-Auftrag fragt im Lernschritt nicht nach Fehlerarten");
        SESSION = keepSe; S.weak = keepW;
        const dm = diffMark("Ich gehe mit meine Freundin", "Ich gehe mit meiner Freundin");
        if (!/<mark class="chg">meiner<\/mark>/.test(dm) || /<mark[^>]*>Ich/.test(dm)) E.push("S-1014-20: Änderung nicht hervorgehoben: " + dm); }
      // S-1014-21: „Kenne ich schon“ – beide Richtungen 60 Tage, kein Tageslimit, Zurück stellt beide her, vergessen = von vorn
      { const t = TOPICS.find(x => x.v.length >= 2), base = t.id + "-0", keepC = JSON.stringify(S.cards), keepD = JSON.stringify(S.daily), keepSe = SESSION, keepCur = CUR;
        S.cards[base] = newCard(); S.cards[base + "-r"] = newCard(); const nc0 = S.daily.newCards;
        SESSION = { kind: "vocab", queue: [base, base + "-r"], done: 0, again: 0, shown: false };
        knownCard();
        const f = S.cards[base], r = S.cards[base + "-r"];
        if (f.isNew || r.isNew || f.interval !== 60 || r.interval !== 60 || f.due < addDays(59)) E.push("S-1014-21: nicht beide Richtungen auf 60 Tage");
        if (S.daily.newCards !== nc0) E.push("S-1014-21: zählt gegen „Neue Wörter pro Tag“");
        if (SESSION && SESSION.queue.length) E.push("S-1014-21: Karte bleibt in der Runde");
        if (!/Kenne ich schon/.test(knownSummary())) E.push("S-1014-21: Bericht nennt bekannte Wörter nicht");
        undoCard();
        if (!S.cards[base].isNew || !S.cards[base + "-r"].isNew) E.push("S-1014-21: Zurück stellt nicht beide Richtungen her");
        markKnown(base);
        const g = sm2Next(S.cards[base], 4), v = sm2Next(S.cards[base], 1);
        if (!(g.interval >= 120) || v.interval !== 0 || v.reps !== 0) E.push("S-1014-21: nach 60 Tagen gewusst/vergessen falsch: " + g.interval + "/" + v.interval);
        S.cards = JSON.parse(keepC); S.daily = JSON.parse(keepD); SESSION = keepSe; CUR = keepCur; }
      // S-1014-25: „Zurücksetzen rückgängig machen“ – Kopie, Angebot nur bis zum nächsten Üben, Abgleich bringt das Zurücksetzen nicht zurück
      { const t = TOPICS.find(x => S.topics[x.id] && x.v.length), id = t.id, keep = JSON.stringify(S), keepCur = CUR, now = Date.now();
        S.topics[id] = { ...S.topics[id], status: "learning", last: 0.9, hist: [{ d: now - 2 * DAY, sc: 90, r: "good" }], interval: 10, due: now + 8 * DAY };
        save(); S.updated = Date.now() - 5; /* Kopie entsteht vor dem Zurücksetzen (in echt: Bestätigung tippen) */ resetTopic(id, false);
        if (S.topics[id].status !== "new") E.push("S-1014-25: Vorbedingung – Thema nicht zurückgesetzt");
        if (!resetUndoHTML(id)) E.push("S-1014-25: kein Angebot „rückgängig“ nach dem Zurücksetzen");
        const other = JSON.parse(JSON.stringify(S)); /* zweites Gerät, das das Zurücksetzen schon hat */
        undoReset(null);
        if (S.topics[id].last !== 0.9 || !S.topics[id].hist.length) E.push("S-1014-25: Thema nicht wiederhergestellt");
        if (resetUndoHTML(id)) E.push("S-1014-25: Angebot bleibt nach dem Wiederherstellen");
        const m1 = mergeStates(JSON.parse(JSON.stringify(S)), other), m2 = mergeStates(other, JSON.parse(JSON.stringify(S)));
        if (m1.topics[id].last !== 0.9 || m2.topics[id].last !== 0.9) E.push("S-1014-25: Abgleich bringt das Zurücksetzen zurück");
        resetTopic(id, false); S.topics[id].hist = [{ d: Date.now() + 1000, sc: 50, r: "again" }];
        if (resetUndoHTML(id)) E.push("S-1014-25: Angebot trotz neuem Üben");
        S = JSON.parse(keep); CUR = keepCur; save();
        try { localStorage.removeItem(KEY + "-vor-reset-info"); } catch (e) {} }
      // S-1014-12: Wortschatz-Pakete – nicht als neues Thema, „Wörter übernehmen“, nächstes erst nach Einführung aller Wörter
      { const X = TOPICS.find(t => t.v.length >= 3 && !BASE_TOPICS.includes(t)) || TOPICS[TOPICS.length - 1];
        const keepT = JSON.stringify(S.topics[X.id]), keepC = new Set(Object.keys(S.cards)), keepD = JSON.stringify(S.daily), keepCur = CUR;
        X.wort = true; S.topics[X.id] = { ...S.topics[X.id], status: "new", hist: [] }; S.daily.newPacks = 0;
        const otherNew = TOPICS.filter(t => t !== X && S.topics[t.id].status === "new");
        otherNew.forEach(t => (S.topics[t.id].status = "locked"));
        if (nextNewTopic() === X) E.push("S-1014-12: Wortschatz-Paket als neues Grammatikthema angeboten");
        otherNew.forEach(t => (S.topics[t.id].status = "new"));
        if (nextWordPack() !== X) E.push("S-1014-12: Wortschatz-Paket nicht angeboten");
        if (topicSteps(X)) E.push("S-1014-12: Wortschatz-Paket mit Lernschritten");
        wordPackTake(X.id);
        if (S.topics[X.id].status !== "learning" || !S.cards[X.id + "-0"] || !(S.topics[X.id].due > Date.now())) E.push("S-1014-12: „Wörter übernehmen“ wirkt nicht");
        if (nextWordPack()) E.push("S-1014-12: nächstes Paket vor Einführung der Wörter angeboten");
        delete X.wort; S.topics[X.id] = JSON.parse(keepT); Object.keys(S.cards).forEach(id => { if (!keepC.has(id)) delete S.cards[id]; });
        S.daily = JSON.parse(keepD); CUR = keepCur; }
      // D-1014-43/-44: grammarFirst – Grammatik vor Vokabeln, Kartenrückstand pausiert kein neues Thema, Vokabeln freiwillig;
      // Wortschatz-Pakete keine Pflicht-Wiederholung und nicht im Langzeit-Check (Gegenprobe: ohne Schalter wie bisher)
      { const keep = JSON.stringify(S), keepCur = CUR, keepAct = S.active, keepGF = APP.features.grammarFirst, g = TOPICS.filter(t => !t.wort && t.v.length).slice(0, 3), now = Date.now();
        const lab = () => (document.querySelector("#app .next .label") || {}).textContent || "";
        const setup = () => { S.active = null; if (S.placement) S.placement.done = true; S.errors = []; S.daily.newTopics = 0; S.settings.maxReviews = 150;
          TOPICS.forEach(t => (S.topics[t.id].status = "locked")); S.topics[g[1].id].status = "new";
          S.topics[g[0].id] = { ...S.topics[g[0].id], status: "learning", last: 0.9, due: now + 5 * DAY, hist: [{ d: now, sc: 90, r: "good" }] };
          addCards(g[0]); Object.keys(S.cards).forEach(id => { S.cards[id].isNew = false; S.cards[id].due = now - DAY; }); CUR = { tab: "today" }; };
        const res = {};
        for (const gf of [false, true]) { APP.features.grammarFirst = gf; setup(); renderToday(); const a = [lab()];
          S.settings.maxReviews = 1; renderToday(); a.push(lab()); res[gf] = a; }
        if (res.false[0] !== "Als Nächstes: " + (APP.vocabName || "Vokabeln")) E.push("D-1014-43 Gegenprobe: ohne grammarFirst nicht mehr Vokabeln zuerst: " + res.false[0]);
        if (res.true[0] !== "Als Nächstes: neues Thema" || res.true[1] !== "Als Nächstes: neues Thema") E.push("D-1014-43/-44: mit grammarFirst nicht zuerst das neue Thema (auch bei Kartenrückstand): " + JSON.stringify(res.true));
        const st = document.querySelector("#app .card small.muted");
        if (!st || !/von 2 erledigt/.test(st.textContent)) E.push("D-1014-43: Vokabeln zählen mit grammarFirst noch als Pflicht im Tagesplan: " + (st && st.textContent));
        const X = g[2]; X.wort = true; S.topics[X.id] = { ...S.topics[X.id], status: "learning", due: now - 1000, hist: [] };
        if (dueTopics().includes(X) || !dueWordPacks().includes(X)) E.push("D-1014-44: Wortschatz-Paket als Pflicht-Wiederholung fällig");
        if (checkTopics().includes(X)) E.push("D-1014-44: Wortschatz-Paket im Langzeit-Check");
        renderToday(); if (!document.querySelector(`#app details.more [data-act="review"][data-id="${X.id}"]`)) E.push("D-1014-44: fällige Paket-Übungen nicht unter „Mehr üben“");
        delete X.wort; APP.features.grammarFirst = keepGF; S = JSON.parse(keep); S.active = keepAct; CUR = keepCur; save(); }
      // D-1014-47/-48/-50: schwache Teilregel (Lernschritt) bevorzugt, vorgezogen → Kurzrunde, offene Fehler in der
      // Wiederholung des Themas, KI-Übungen auch für schwache Themen (Gegenproben: ohne Fehler / gefestigt / ohne Runde)
      { const X = TOPICS.find(t => topicSteps(t) && t.ex.length >= 25) || TOPICS.filter(t => !t.wort && t.ex.length >= 9).sort((a, b) => b.ex.length - a.ex.length)[0], keepSt = X && X.steps;
        if (X && !topicSteps(X)) { const n = Math.floor(X.ex.length / 3); X.steps = [0, 1, 2].map(k => ({ t: "Schritt " + (k + 1), ex: X.ex.map((_, i) => i).slice(k * n, k === 2 ? X.ex.length : (k + 1) * n) })); }
        if (!X || !topicSteps(X)) E.push("D-1014-47: kein Thema mit Lernschritten zum Prüfen");
        else { const keep = JSON.stringify(S), now = Date.now(), st = topicSteps(X), w = st[1].ex.filter(i => !X.ex[i].aus).slice(0, 2);
          S.errors = []; S.weak = []; S.exLog = {}; S.settings.weakPlan = true;
          S.topics[X.id] = { ...S.topics[X.id], status: "learning", last: 0.6, reps: 0, due: now + 10 * DAY, hist: [{ d: now - 3 * DAY, sc: 60, r: "hard" }] };
          if (weakStep(X.id) !== -1) E.push("D-1014-47 Gegenprobe: schwache Teilregel ohne Fehler");
          w.forEach((ei, k) => S.errors.push({ d: now - k * 1000, topic: X.id, ei, q: promptText(X.ex[ei]), user: "x", exp: "y" }));
          if (weakStep(X.id) !== 1) E.push("D-1014-47: Teilregel mit offenen Fehlern nicht erkannt: " + weakStep(X.id));
          const pb = topicPool(X.id, true).find(c => c.src.ei === st[1].ex[0]), pn = topicPool(X.id, false).find(c => c.src.ei === st[1].ex[0]);
          if (!pb || !(pb.bonus > 0) || (pn && pn.bonus)) E.push("D-1014-47: Vorzug der schwachen Teilregel fehlt (oder gilt auch beim ersten Lernen)");
          const r1 = reviewList(X.id, "review");
          if (r1.title || !w.every(ei => r1.list.some(c => c.src.ei === ei)) || r1.list.length > ROUND_N) E.push("D-1014-50: offene Fehler nicht in der Wiederholung des Themas");
          S.weak = [{ d: now - 2 * DAY, k: "schreiben", tid: X.id, g: [X.id], aid: "t1" }, { d: now - DAY, k: "schreiben", tid: X.id, g: [X.id], aid: "t2" }];
          const r2 = reviewList(X.id, "review"), inS = r2.list.filter(c => st[1].ex.includes(c.src.ei)).length;
          if (!/Kurzrunde/.test(r2.title || "") || r2.list.length > STEP_SHORT_N + STEP_SHORT_MIX || inS < Math.min(STEP_SHORT_N, st[1].ex.length) - 1 || !w.every(ei => r2.list.some(c => c.src.ei === ei)))
            E.push(`D-1014-47: vorgezogene Wiederholung keine Kurzrunde zur Teilregel (${r2.title}, ${inS}/${r2.list.length})`);
          if (reviewList(X.id, "extra").title) E.push("D-1014-47: Kurzrunde auch beim Extra-Üben");
          if (!genWeak(X.id) || !genUnlockedFor(X.id)) E.push("D-1014-48: schwaches Thema bekommt keine KI-Übungen");
          S.topics[X.id].last = 0.9; if (genWeak(X.id)) E.push("D-1014-48 Gegenprobe: 90 % gilt als schwach");
          S.topics[X.id] = { ...S.topics[X.id], last: 0.5, hist: [] }; if (genWeak(X.id)) E.push("D-1014-48 Gegenprobe: ohne Runde schon schwach");
          S = JSON.parse(keep); save(); }
        if (X) { if (keepSt) X.steps = keepSt; else delete X.steps; } }
      // S-1014-4: Fehlerarten – bekannte Art übernommen, unbekannte als „neu: …“, Bericht mit Texte/Sätze und Marker
      { const keepW = S.weak, keepA = S.aiAudit, k0 = errKinds()[0];
        const f = weakKinds({ kinds: [k0.toLowerCase(), "Komma vergessen", "neu: Komma vergessen", ""] });
        if (f[0] !== k0 || f[1] !== "neu: Komma vergessen" || f.length !== 2) E.push("S-1014-4: Fehlerarten falsch normalisiert: " + JSON.stringify(f));
        S.weak = []; weakNote("dialog", "x", [], "a1", -1, [k0]); weakNote("satz", "x", [], "a2", -1, [k0, "neu: Komma vergessen"]); weakNote("satz", "x", [], "a3", -1, []);
        if (S.weak.length !== 2 || !S.weak[0].f) E.push("S-1014-4: Fehlerarten werden nicht gespeichert (oder leere doch)");
        const r = kindReport();
        if (!r.includes(k0 + ": 2× (Texte 1, Sätze 1)") || !/neu: Komma vergessen \(noch nicht in der Liste\): 1×/.test(r) || !/WIEDERKEHRENDE FEHLERARTEN/.test(buildReport())) E.push("S-1014-4: Bericht-Abschnitt Fehlerarten fehlt oder falsch");
        if (!mergeWeak(S.weak, []).every(x => x.f)) E.push("S-1014-4: Abgleich verliert Fehlerarten");
        S.weak = keepW; S.aiAudit = keepA; }
      // S-1013-39: Verlaufsprotokoll – Eintrag nach Analyse/Check/Woche, Trend, neue Schwäche, Bericht, Fortschritt, Abgleich
      { const keepH = S.history, keepW = S.weak, LT = TOPICS.find(t => S.topics[t.id].status === "learning" && S.topics[t.id].last != null);
        S.history = []; histAdd("analyse", "A2");
        const e = S.history[0];
        if (!e || e.k !== "analyse" || e.lvl !== "A2" || (LT && e.t[LT.id] == null) || typeof e.w !== "number") E.push("Verlauf: Analyse-Eintrag fehlt oder unvollständig");
        histTick(); if (S.history.length !== 1) E.push("Verlauf: Wochenstand zu früh");
        S.history[0].d -= 8 * DAY; histTick(); if (S.history.length !== 2 || S.history[0].k !== "woche") E.push("Verlauf: Wochenstand fehlt nach 7 Tagen");
        const id1 = TOPICS[0].id, id2 = TOPICS[1].id, now = Date.now();
        S.history = [{ d: now, k: "check", t: { [id1]: 90 }, w: 50, ok: 3, weak: { [id2]: 3 }, sl: 2 }, { d: now - 15 * DAY, k: "analyse", lvl: "A1", t: { [id1]: 70 }, w: 30, ok: 1, weak: {}, sl: 5 }];
        const tr = histTrend();
        if (!tr || !tr.up.some(([id, d]) => id === id1 && d === 20) || !tr.newWeak.includes(id2)) E.push("Verlauf: Trend oder neue Schwäche falsch");
        const rep = buildReport();
        if (!/VERLAUF \(2 Einträge/.test(rep) || !rep.includes("neu als Schwäche: " + id2)) E.push("Verlauf: Bericht-Abschnitt fehlt");
        A.tab("progress"); if (!document.querySelector("#app .hist") || !document.querySelector("#app").textContent.includes("neu als Schwäche")) E.push("Verlauf: Karte unter Fortschritt fehlt");
        const o = JSON.parse(JSON.stringify(S)); o.history = [{ d: now - 30 * DAY, k: "woche", t: {}, w: 10, ok: 0, weak: {}, sl: 0 }];
        const M = mergeStates(S, o); if (!M.history || M.history.length !== 3) E.push("Abgleich verliert Verlaufseinträge");
        S.history = keepH; S.weak = keepW; A.tab("today"); }
      // S-1013-37: Prüfmodus – gesperrtes Thema zeigt Theorie und alle Übungen mit Lösung, Lernstand bleibt unverändert
      { const LK = TOPICS.find(t => S.topics[t.id].status === "locked"), OP = TOPICS.find(t => S.topics[t.id].status !== "locked" && t.ex.length);
        SESSION = null; S.active = null; const before = JSON.stringify(S), keep = CFG.pruef;
        CFG.pruef = false; CUR = { tab: "topics", arg: LK && LK.id }; render();
        if (LK && document.querySelector("#app .pruef")) E.push("Prüfmodus: ohne Schalter sichtbar");
        A.tab("settings"); if (!document.querySelector('[data-act="togglepruef"]')) E.push("Prüfmodus: Schalter in den Einstellungen fehlt");
        A.togglepruef(); if (!CFG.pruef) E.push("Prüfmodus: Schalter wirkt nicht");
        if (LK) { CUR = { tab: "topics", arg: LK.id }; render();
          const p = document.querySelector("#app .pruef");
          if (!p || p.querySelectorAll(".pex").length !== LK.ex.length || !document.querySelector("#app .card.theory")) E.push("Prüfmodus: gesperrtes Thema ohne Theorie oder Übungsliste");
          else if (!p.textContent.includes("Lösung:")) E.push("Prüfmodus: Lösungen fehlen"); }
        if (OP) { CUR = { tab: "topics", arg: OP.id }; render(); if (!document.querySelector("#app .pruef")) E.push("Prüfmodus: freies Thema ohne Übungsliste"); }
        if (JSON.stringify(S) !== before) E.push("Prüfmodus: Lernstand verändert");
        CFG.pruef = keep; saveCfg(); A.tab("today"); }
      // E-1009-20: „⚠ Fehler in der Übung?“ – Link in Übung und Theorie, Text melden, Bericht, Abgleich, Zurücknehmen
      { const T5 = TOPICS.find(t => S.topics[t.id].status !== "locked" && t.ex.length);
        S.active = null; SESSION = null; S.exFlags = []; startSession(T5.id, "learn");
        const src = srcOf(S.active, SESSION.idx), ln = document.querySelector('[data-act="exflag"]');
        if (!ln || ln.dataset.id !== src.tid + "|" + src.ei) E.push("„Fehler in der Übung?“: Link fehlt in der Übung");
        else {
          A.exflag(ln.dataset.id, ln);
          const inp = document.querySelector("#exflagq"), go = document.querySelector('[data-act="exflaggo"]');
          if (!inp || !go) E.push("„Fehler in der Übung?“: Textfeld/Melden fehlt");
          else {
            inp.value = "Lösung falsch";
            A.exflaggo(go.dataset.id, go);
            if (!exFlagOn(src.tid, src.ei) || !/gemeldet/.test(ln.textContent)) E.push("„Fehler in der Übung?“: Meldung nicht gespeichert");
            if (!new RegExp("FEHLERMELDUNGEN[\\s\\S]*" + src.tid + " ex\\[" + src.ei + "\\][\\s\\S]*Lösung falsch").test(buildReport())) E.push("Bericht ohne Abschnitt FEHLERMELDUNGEN");
            const MS = mergeStates({ ...S }, { ...S, exFlags: [{ ...S.exFlags[0], x: 1, xu: S.exFlags[0].xu + 5 }] });
            if (MS.exFlags.length !== 1 || !MS.exFlags[0].x) E.push("Abgleich Fehlermeldungen: jüngere Rücknahme gewinnt nicht");
            A.exflag(ln.dataset.id, ln);
            if (exFlagOn(src.tid, src.ei) || /FEHLERMELDUNGEN/.test(buildReport())) E.push("„Fehler in der Übung?“: Zurücknehmen wirkt nicht");
          }
        }
        SESSION = null; S.active = null; renderTopic(T5.id);
        if (!document.querySelector(`.theory [data-act="exflag"][data-id="${T5.id}|-1"]`)) E.push("„Fehler in der Theorie?“: Link fehlt in der Theorie");
        S.exFlags = []; }
      // E-1009-5: Längenfehler im Finnischen sind kein Tippfehler; Tippfehler = genau ein Buchstabe
      if (!/Doppelbuchstabe ist kein Tippfehler/.test(SPRACHEN.fi.judge) || !/genau ein Buchstabe/.test(JUDGE_RULES())) E.push("Bewertungsregeln: Länge/Tippfehler nicht festgelegt");
      // E-1009-6: wegen Tippfehler anerkannte Vokabel-Antwort wird nicht gemerkt, sondern als Ausrutscher gezählt
      { const t = TOPICS[0], id = `${t.id}-0-r`, had = S.cards[id], keepV = vocabJudge, keepR = aiReady;
        if (!had) S.cards[id] = { isNew: true, due: Date.now(), interval: 0, ease: 2.5, reps: 0, lapses: 0 };
        aiReady = () => true; vocabJudge = async () => ({ correct: true, typo: true, feedback: "Tippfehler", _aid: "va-typo" });
        S.vocAlt = []; S.slips = [];
        SESSION = { kind: "vocab", queue: [id], done: 0, again: 0 }; renderCard(); document.querySelector("#ans").value = "Vertipt"; flipCard(); await new Promise(r => setTimeout(r, 20));
        if (S.vocAlt.length || (S.slips[0] || {}).k !== "typo" || S.slips[0].u !== "Vertipt") E.push("Vokabel: Tippfehler-Antwort gemerkt statt als Ausrutscher gezählt " + JSON.stringify([S.vocAlt, S.slips]));
        vocabJudge = keepV; aiReady = keepR; SESSION = null; S.vocAlt = []; S.slips = []; if (!had) delete S.cards[id]; }
      // E-1009-7: ungültige Termine der Gesamtanalyse erkannt
      { const L = TOPICS.find(t => S.topics[t.id].status === "learning");
        if (!L || !reschedOk({ topicId: L.id, days: 2 }) || reschedOk({ topicId: "topicId", days: 0 }) || reschedOk({ topicId: L.id, days: 0 })) E.push("Gesamtanalyse: Prüfung der Termine falsch"); }
      // E-1009-8: Netzabbruch im Hintergrund kein App-Fehler
      { const keep = VIS_AT; VIS_AT = 0;
        if (syncErrQuiet() || !syncErrQuiet(true)) E.push("Sync: Hintergrund-Abbruch falsch erkannt");
        VIS_AT = Date.now(); if (!syncErrQuiet()) E.push("Sync: Abbruch kurz nach Rückkehr wird gemeldet");
        VIS_AT = keep; }
      // E-1009-10: „Nur vertippt – trotzdem als richtig werten“ – nur nahe an der Lösung, nimmt Fehler und Wiederholung zurück
      { const keepJ = aiJudge, keepR = aiReady;
        aiReady = () => true; aiJudge = async () => ({ correct: false, feedback: "falsch" });
        const fit = e => e.t === "tr" && !exStrict(e) && /\p{L}{5,}\s*[.!?]?$/u.test(e.a[0]);
        const T5 = TOPICS.find(t => S.topics[t.id].status !== "locked" && t.ex.some(fit));
        S.active = null; SESSION = null; S.slips = []; const keepE = S.errors; S.errors = []; startSession(T5.id, "learn");
        let n = 0; while (!fit(SESSION.items[SESSION.idx]) && n++ < 80) { SESSION.idx++; renderEx(); }
        const ex = SESSION.items[SESSION.idx], sol = ex.a[0].replace(/\s*[.!?]$/, ""), len0 = SESSION.items.length, k0 = SESSION.results.length;
        document.querySelector("#ans").value = sol.slice(0, -1) + (sol.slice(-1) === "x" ? "y" : "x"); await checkAnswer();
        const ln = document.querySelector('[data-act="selftypo"]');
        if (!ln || SESSION.items.length !== len0 + 1 || !openErrors().length) E.push("„Trotzdem richtig“: Link fehlt oder Testannahme falsch");
        else {
          // E-1010-5: Tipp markiert nur – ein, aus, wieder ein; gezählt wird erst bei „Weiter“
          A.selftypo();
          if (SESSION.results[k0].correct || SESSION.items.length !== len0 + 1 || !openErrors().length || S.slips.length) E.push("„Trotzdem richtig“: zählt sofort statt erst bei „Weiter“ (E-1010-5)");
          if (!/Zurücknehmen/.test((document.querySelector("#typomark") || {}).textContent || "")) E.push("„Trotzdem richtig“: Markierung nicht sichtbar (E-1010-5)");
          A.selftypo(); A.selftypo();
          const se = SESSION; A.next();
          const r = se.results[k0];
          if (!r || !r.correct || se.items.length !== len0 || openErrors().length || se.results.length !== k0 + 1) E.push("„Trotzdem richtig“: Wertung, Wiederholung oder Fehler-Training nicht zurückgenommen");
          if ((S.slips[0] || {}).k !== "self" || !/selbst als richtig gewertet/.test(buildReport())) E.push("„Trotzdem richtig“: fehlt im Bericht (AUSRUTSCHER)");
        }
        // ein- und wieder ausgeschaltet → bleibt ein Fehler (E-1010-5)
        { let m = 0; while (SESSION && SESSION.idx < SESSION.items.length && !fit(SESSION.items[SESSION.idx]) && m++ < 80) { SESSION.idx++; renderEx(); }
          if (SESSION && SESSION.idx < SESSION.items.length && fit(SESSION.items[SESSION.idx])) {
            const ex2 = SESSION.items[SESSION.idx], s2 = ex2.a[0].replace(/\s*[.!?]$/, ""), e0 = openErrors().length, sl0 = S.slips.length, k2 = SESSION.results.length;
            document.querySelector("#ans").value = s2.slice(0, -1) + (s2.slice(-1) === "x" ? "y" : "x"); await checkAnswer();
            if (document.querySelector('[data-act="selftypo"]')) {
              A.selftypo(); A.selftypo(); const se = SESSION; A.next();
              if (se.results[k2].correct || openErrors().length !== e0 + 1 || S.slips.length !== sl0) E.push("„Trotzdem richtig“: aus Versehen getippt und zurückgenommen – trotzdem gezählt (E-1010-5)");
            }
          } }
        // Runde verlassen zählt wie „Weiter“ (E-1010-5)
        { let m = 0; while (SESSION && SESSION.idx < SESSION.items.length && !fit(SESSION.items[SESSION.idx]) && m++ < 80) { SESSION.idx++; renderEx(); }
          if (SESSION && SESSION.idx < SESSION.items.length && fit(SESSION.items[SESSION.idx])) {
            const ex3 = SESSION.items[SESSION.idx], s3 = ex3.a[0].replace(/\s*[.!?]$/, ""), k3 = SESSION.results.length, se3 = SESSION;
            document.querySelector("#ans").value = s3.slice(0, -1) + (s3.slice(-1) === "x" ? "y" : "x"); await checkAnswer();
            if (document.querySelector('[data-act="selftypo"]')) {
              document.querySelector('[data-act="selftypo"]').click();
              const tb = document.querySelector('[data-act="tab"]'); if (tb) tb.click();
              if (!se3.results[k3].correct) E.push("„Trotzdem richtig“: beim Verlassen der Runde nicht gezählt (E-1010-5)");
              S.active = null; SESSION = null;
            }
          } }
        // weit weg von der Lösung → kein Link
        if (!SESSION) { startSession(T5.id, "learn"); }
        n = 0; while (SESSION && SESSION.idx < SESSION.items.length && SESSION.items[SESSION.idx].t !== "tr" && n++ < 80) { SESSION.idx++; renderEx(); }
        if (SESSION && SESSION.idx < SESSION.items.length && document.querySelector("#ans")) {
          document.querySelector("#ans").value = "qqqqqq zzzzzz"; await checkAnswer();
          /* S-1013-43: auch bei ganz falscher Antwort selbst als richtig werten – Bericht und KI-Protokoll zeigen es */
          const ln = document.querySelector('[data-act="selftypo"]');
          if (!ln || !ln.textContent.includes("Ich werte es als richtig")) E.push("Selbst werten: Link „Ich werte es als richtig“ fehlt bei falscher Antwort");
          else { A.selftypo(); typoCommit(); const r = SESSION.results[SESSION.results.length - 1];
            if (!r || !r.correct || !S.slips.some(x => x.k === "selfok") || !(S.aiAudit || []).some(x => x.u === "qqqqqq zzzzzz")) E.push("Selbst werten: zählt nicht als richtig oder fehlt im Bericht");
            if (!/Ganze Antwort selbst als richtig gewertet/.test(buildReport())) E.push("Selbst werten: Bericht-Abschnitt fehlt"); }
        }
        aiJudge = keepJ; aiReady = keepR; S.errors = keepE; S.slips = []; SESSION = null; S.active = null; }
      // E-1009-12: Endungs-Lücke – ganzes Wort wird auf die Endung gekürzt, anderer Fall ohne KI falsch, strenge Regel im KI-Auftrag
      { const gx = { t: "gap", q: "Luen kirjasto___.", a: ["ssa"], h: "nur die Endung eintippen" };
        if (gapCut(gx, "kirjastossa") !== "ssa" || gapCut(gx, "Kirjastona") !== "na" || gapCut(gx, "ssa") !== null || gapCut(gx, "talossa") !== null || gapCut({ t: "gap", q: "Minä ___ kotona.", a: ["olen"] }, "olen") !== null) E.push("gapCut: Stamm falsch abgeschnitten");
        const keepJ = aiJudge, keepR = aiReady, keepA = aiJSON; let calls = 0, prompt = "";
        aiReady = () => true; aiJudge = async () => { calls++; return { correct: true, feedback: "passt" }; };
        S.active = null; SESSION = null; const T6 = TOPICS.find(t => S.topics[t.id].status !== "locked" && t.ex.length > 1), keepE = S.errors; startSession(T6.id, "learn");
        const run = async txt => { SESSION.items[SESSION.idx] = gx; renderEx(); document.querySelector("#ans").value = txt; await checkAnswer(); return SESSION.results[SESSION.results.length - 1]; };
        const r1 = await run("kirjastossa");
        if (!r1 || !r1.correct || calls || !/nur die Endung/.test(document.querySelector("#fb").textContent)) E.push("Endungs-Lücke: ganzes richtiges Wort nicht als richtig erkannt");
        A.next(); const r2 = await run("kirjastona");
        if (!r2 || r2.correct || calls) E.push("Endungs-Lücke: anderer Fall nicht ohne KI falsch");
        aiJudge = keepJ; aiJSON = async p => { prompt = p; return { correct: false, feedback: "" }; };
        await aiJudge(gx, "na");
        if (!/Endungs-Lücke: Gesucht ist genau die Form/.test(prompt) || !/kirjastona/.test(prompt)) E.push("Endungs-Lücke: strenge Regel oder Satz fehlt im KI-Auftrag");
        await aiJudge({ t: "gap", q: "Hän ___ kahvia.", a: ["juo"], h: "Präsens von juoda" }, "joi");
        if (!/Lückentext \(E-1009-14\): Verlangt ist dieselbe grammatische Form/.test(prompt) || !/Gesucht ist: Präsens von juoda/.test(prompt) || /Endungs-Lücke/.test(prompt)) E.push("Lückentext: strenge Form-Regel oder „Gesucht ist“ fehlt im KI-Auftrag");
        aiJSON = keepA; aiReady = keepR; S.errors = keepE; SESSION = null; S.active = null; }
      // E-1009-21: Von Claude bestätigte Fehler (✗) kommen in den Auftrag – neue Übungen und Vokabelbewertung
      { const keepA = aiJSON, keepG = S.genReview, keepV = S.vocAlt, t = TOPICS.find(x => x.ex.length); let prompt = "", calls = 0;
        aiJSON = async p => { prompt = p; calls++; return { ex: [], correct: true, feedback: "" }; };
        S.genReview = [{ id: "s1", d: Date.now(), topic: t.id, res: {}, ex: [{ t: "tr", dir: "de", q: "Testsatz eins", a: ["Väärä lause"], gid: "s1-0" }, { t: "tr", dir: "de", q: "Testsatz zwei", a: ["Oikea"], gid: "s1-1" }],
          v: { "s1-0": { ok: false, korrektur: "Oikea lause", grund: "Testgrund-21" }, "s1-1": { ok: true } } }];
        await aiGenerate(t);
        if (!/FALSCH[\s\S]*Testsatz eins[\s\S]*Väärä lause[\s\S]*Oikea lause[\s\S]*Testgrund-21/.test(prompt) || /Testsatz zwei/.test(prompt)) E.push("Neue Übungen: bestätigte Fehler (✗) fehlen im Auftrag");
        S.genReview = []; await aiGenerate(t);
        if (/Von Claude geprüft und FALSCH/.test(prompt)) E.push("Neue Übungen: Fehlerabschnitt ohne bestätigte Fehler");
        S.vocAlt = [{ d: Date.now(), id: "vt-0", a: "Falschwort", aid: "x", v: { ok: false, korrektur: "Wort", grund: "Grund-21" } }]; calls = 0;
        const r1 = await vocabJudge(["sana", "Wort"], "fi", "falschwort", "vt-0");
        if (r1.correct || calls || !/Grund-21/.test(r1.feedback)) E.push("Vokabel: von Claude verworfene Antwort wird nicht ohne KI als falsch erkannt");
        await vocabJudge(["sana", "Wort"], "fi", "Andersrum", "vt-0");
        if (calls !== 1 || !/FALSCH[\s\S]*„Falschwort“ → Wort \(Grund-21\)/.test(prompt)) E.push("Vokabel: verworfene Antworten fehlen im Auftrag");
        aiJSON = keepA; S.genReview = keepG; S.vocAlt = keepV; }
      // E-1008-62: Stimme wählen (nur dieses Gerät)
      { const keepG = speechSynthesis.getVoices, keepS = speak, vs = [{ name: "Satu", voiceURI: "satu", lang: APP.target.tts }, { name: "Onni", voiceURI: "onni", lang: APP.target.tts }, { name: "Anna", voiceURI: "anna", lang: "de-DE" }];
        speechSynthesis.getVoices = () => APP.target.code === "de" ? vs.slice(0, 2).map(v => ({ ...v, lang: "de-AT" })) : vs; speak = () => {};
        CFG.voice = "onni"; pickVoice();
        if (!FI_VOICE || FI_VOICE.voiceURI !== "onni" || targetVoices().length !== 2) E.push("Stimmenwahl: gewählte Stimme nicht genommen");
        A.tab("settings"); const sel = document.querySelector("#voicesel");
        if (!sel || sel.options.length !== 2 || sel.value !== "onni") E.push("Stimmenwahl: Auswahlliste fehlt");
        else { sel.value = "satu"; sel.dispatchEvent(new Event("change", { bubbles: true })); if (CFG.voice !== "satu" || FI_VOICE.voiceURI !== "satu") E.push("Stimmenwahl: Wechsel wirkt nicht"); }
        delete CFG.voice; speechSynthesis.getVoices = keepG; speak = keepS; pickVoice(); A.tab("today"); }
      // E-1008-4: Voraussetzung unter 80 % blockiert → „Heute“ bietet die Freischalt-Runde an
      { const B = TOPICS.find(t => S.topics[t.id].status === "locked" && t.req.length);
        TOPICS.forEach(t => { const s = S.topics[t.id]; if (s.status === "new" || B.req.includes(t.id)) Object.assign(s, { status: "learning", last: 0.9, due: far, hist: [{ d: Date.now(), sc: 90 }] }); });
        S.topics[B.req[0]].last = 0.7;
        Object.values(S.cards).forEach(c => Object.assign(c, { isNew: false, due: far }));
        S.errors = []; S.active = null; SESSION = null; S.daily.newCards = S.daily.newRev = 999; S.placement.done = Date.now(); /* Test-App hat einen Einstufungstest */
        A.tab("today");
        const bt = document.querySelector('.next [data-act="unlock"]');
        if (!bt || bt.dataset.id !== B.req[0]) E.push("„Heute“ bietet die Freischalt-Runde der blockierenden Voraussetzung nicht an: " + ((document.querySelector(".next") || {}).textContent || "").slice(0, 80)); }
      // E-1008-10: Wörter neuer Themen nicht in der normalen Runde, kein Sprung am Lerntag
      { const N = TOPICS.find(t => t.v.length && !BASE_TOPICS.includes(t)) || TOPICS[TOPICS.length - 1];
        Object.assign(S.topics[N.id], { status: "new", vocabDone: null }); addCards(N);
        topicVocabIds(N.id).forEach(id => Object.assign(S.cards[id], newCard()));
        S.daily.newCards = S.daily.newRev = 0;
        if (newFwdIds().some(id => id.startsWith(N.id + "-"))) E.push("Wörter eines neuen Themas in der normalen Runde");
        S.topics[N.id].vocabDone = "skip";
        if (!newFwdIds().some(id => id.startsWith(N.id + "-"))) E.push("nach „Wörter kenne ich schon“ fehlen die Wörter in der normalen Runde");
        const id = N.id + "-0";
        Object.assign(S.cards[id], { isNew: false, reps: 1, interval: 1, ease: 2.5, learnDay: todayKey(), due: addDays(1), last: Date.now() });
        SESSION = { kind: "vocab", queue: [id], done: 0, again: 0, shown: true }; rateCard("good");
        if (S.cards[id].interval !== 1 || S.cards[id].reps !== 1) E.push("zweites „Gut“ am Lerntag: Abstand " + S.cards[id].interval);
        SESSION = null; }
      // E-1008-12: Pakete aus Sicherung/Cloud werden geprüft und bereinigt
      { const keep = S.packs.slice();
        S.packs.push({ id: "zz1", title: "X", lvl: { x: 1 }, v: [["a", "b"]], ex: [{ t: "mc", q: "?", o: ["a", "b"], a: 0 }] },
          { id: "zz2", title: "Y", th: "<img src=x onerror=\"window.__xss=1\"><p>ok</p>", v: [["a", "b"]], ex: [{ t: "mc", q: "?", o: ["a", "b"], a: 0 }] });
        rebuildTopics();
        if (T("zz1")) E.push("ungültiges Paket wird angezeigt");
        if (!T("zz2") || /onerror|<img/i.test(T("zz2").th)) E.push("Theorie eines Pakets aus fremder Quelle nicht bereinigt");
        S.packs = keep; rebuildTopics(); }
      // E-1008-5: Thema unter 80 %, auf das ein gesperrtes Thema wartet → höchstens 7 Tage
      { const B = TOPICS.find(t => t.req.length), r = B.req[0], keepSt = S.topics[B.id].status;
        S.topics[B.id].status = "locked";
        const d = topicBase({ ease: 2.5, reps: 5, interval: 40 }, 0.75, 4, r).days, d2 = topicBase({ ease: 2.5, reps: 5, interval: 40 }, 0.9, 4, r).days;
        if (d > 7 || d2 <= 7) E.push(`Abstand blockierender Voraussetzung: ${d} (unter 80 %), ${d2} (ab 80 %)`);
        S.topics[B.id].status = keepSt; }
      // E-1008-13: Gesamtanalyse seltener, Lernstand kompakt
      { const keepRun = runGlobal, keepReady = aiReady; let n = 0; runGlobal = () => n++; aiReady = () => true;
        S.lastGlobal = Date.now() - 4 * 86400000; S.sinceGlobal = 3; maybeAutoGlobal();
        S.sinceGlobal = 5; maybeAutoGlobal();
        S.lastGlobal = Date.now() - 1 * 86400000; S.sinceGlobal = 9; maybeAutoGlobal();
        if (n !== 1) E.push("Gesamtanalyse: " + n + " Läufe statt 1 (erst nach 5 Runden und 3 Tagen)");
        runGlobal = keepRun; aiReady = keepReady;
        /* S-1012-105: Start sofort vermerkt (zweites Gerät startet nicht nochmal), bei Fehlschlag alter Zeitpunkt */
        { const keepAG = aiGlobal, keepR = aiReady; let seen = 0; aiReady = () => true; S.lastGlobal = 5;
          aiGlobal = async () => { seen = S.lastGlobal; throw new Error("aus"); };
          await runGlobal(true);
          if (!(seen > 5 && S.lastGlobal === 5)) E.push("Gesamtanalyse: Start nicht sofort vermerkt bzw. nach Fehlschlag nicht zurückgesetzt (S-1012-105)");
          aiGlobal = keepAG; aiReady = keepR; GLOBAL_FAILED_AT = 0; }
        S.lastGlobal = Date.now(); const ps = progressSummary(false), pr = progressSummary(true);
        if (!/sitzen \(≥ 80 %/.test(ps) && learningTopics().some(t => (S.topics[t.id].last ?? 0) >= 0.8)) E.push("Gesamtanalyse: Lernstand nicht kompakt");
        if (pr.length < ps.length) E.push("Bericht kürzer als Analyse-Auftrag – Bericht muss vollständig bleiben"); }
      return E;
    });
    if (!r.length) ok("Gesamtprüfung E-1008: Sperre, KI-Ausfall, strenge Endungen, Wortstellungen, Freischalt-Hinweis, Themenwörter, Pakete, Abstand schwacher Voraussetzungen, seltenere Gesamtanalyse");
    else r.forEach(m => fail("E-1008: " + m));
    await q.context().close(); }

  // E-1008-22: Schwächen aus freien Antworten ziehen ein Thema vor (höchstens übermorgen, nur bis zur nächsten Runde)
  { const q = await device({ setupDone: true });
    const r = await q.evaluate(() => {
      const E = [], D = 86400000, far = Date.now() + 90 * D, day0 = startOfDay();
      const L = TOPICS.slice(0, 5).map(t => t.id);
      TOPICS.forEach(t => { const s = S.topics[t.id]; if (s.status === "learning" || L.includes(t.id)) Object.assign(s, { status: "learning", last: 0.9, due: far, hist: [{ d: Date.now() - 20 * D, sc: 90, r: "good" }] }); });
      Object.values(S.cards).forEach(c => Object.assign(c, { isNew: false, due: far }));
      S.errors = []; S.active = null; SESSION = null; S.daily.newCards = S.daily.newRev = 999; S.daily.newTopics = 99; S.placement.done = Date.now();
      const [a, b, c, d] = L, hit = (t, g) => ({ d: t, k: "schreiben", tid: "x", g, aid: "w" + t + g.join() });
      S.weak = [hit(day0 + 2000, [a]), hit(day0 + 1000, [a])];
      if (topicDue(a) !== addDays(2) || dueTopics().some(t => t.id === a)) E.push("zwei Treffer heute: nicht auf übermorgen vorgezogen");
      S.weak = [hit(startOfDay(Date.now() - 2 * D) + 1000, [a]), hit(startOfDay(Date.now() - 3 * D) + 1000, [a])];
      if (!dueTopics().some(t => t.id === a)) E.push("Treffer vor 2 und 3 Tagen: heute nicht fällig");
      A.tab("today");
      const nx = document.querySelector(".next") || { textContent: "" }, bt = document.querySelector('.next [data-act="review"]');
      if (!bt || bt.dataset.id !== a || !/Vorgezogen/.test(nx.textContent)) E.push("„Heute“ zeigt das vorgezogene Thema nicht mit Grund: " + nx.textContent.slice(0, 90));
      if (!/deshalb vorgezogen: /.test(weakReport())) E.push("Bericht nennt das vorgezogene Thema nicht");
      S.topics[a].hist.push({ d: Date.now(), sc: 85, r: "good" });
      if (topicDue(a) !== far) E.push("nach einer Runde noch vorgezogen");
      S.topics[a].hist.pop();
      S.weak = [hit(day0 + 1000, [b])];
      if (topicDue(b) !== far) E.push("ein Treffer zieht schon vor");
      S.weak = [hit(Date.now() - 15 * D, [c]), hit(Date.now() - 16 * D, [c])];
      if (topicDue(c) !== far) E.push("Treffer älter als 14 Tage zählen");
      S.topics[d].due = addDays(1); S.weak = [hit(day0 + 1000, [d]), hit(day0 + 2000, [d])];
      if (topicDue(d) !== addDays(1)) E.push("Vorzug schiebt einen früheren Termin nach hinten");
      S.weak = L.slice(0, 4).flatMap(id => [hit(day0 + 1000, [id]), hit(day0 + 2000, [id])]);
      if (Object.keys(weakPlan()).length !== 3) E.push("mehr als 3 Themen zugleich vorgezogen");
      // S-1008-16: ein vorgezogenes Thema behält seinen Platz bis zur nächsten Runde; danach rückt das wartende nach
      S.weak = [a, b, c].flatMap(id => [hit(day0 + 1000, [id]), hit(day0 + 2000, [id])]).concat([3000, 4000, 5000].map(t => hit(day0 + t, [d])));
      let wp = weakPlan();
      if (!wp[a] || !wp[b] || !wp[c] || wp[d]) E.push("später stärkeres Thema verdrängt ein vorgezogenes: " + Object.keys(wp));
      S.topics[a].hist.push({ d: day0 + 6000, sc: 85, r: "good" });
      wp = weakPlan();
      if (wp[a] || !wp[d] || wp[d].due !== addDays(2)) E.push("nach der Runde rückt das wartende Thema nicht nach: " + JSON.stringify(wp));
      S.topics[a].hist.pop();
      A.toggleweak();
      if (S.settings.weakPlan !== false || Object.keys(weakPlan()).length || topicDue(a) !== far) E.push("Abschalten wirkt nicht");
      A.toggleweak();
      if (!Object.keys(weakPlan()).length) E.push("Einschalten wirkt nicht");
      A.tab("settings");
      if (!document.querySelector('[data-act="toggleweak"]')) E.push("Schalter „Schwächen vorziehen“ fehlt in den Einstellungen");
      return E;
    });
    if (!r.length) ok("Schwächen ziehen Themen vor: übermorgen, mit Grund, endet nach der Runde, höchstens 3 mit festem Platz, abschaltbar (E-1008-22, S-1008-16)");
    else r.forEach(m => fail("E-1008-22: " + m));
    await q.context().close(); }

  // Befunde der Simulation 8.10.: Gesamtanalyse erst nach dem Start-Abgleich (S-1008-15), Speicher-Warnung und
  // Lektionen zuerst opfern (E-1008-28)
  { const q = await device({ setupDone: true });
    const r = await q.evaluate(async () => {
      const E = [];
      { const keepRun = runGlobal, keepReady = aiReady; let n = 0; runGlobal = () => n++; aiReady = () => true;
        S.lastGlobal = 0; S.sinceGlobal = 9; STARTUP_SYNCED = false; maybeAutoGlobal();
        if (n) E.push("Gesamtanalyse vor dem Start-Abgleich");
        await startupPull();
        if (n !== 1) E.push("Gesamtanalyse nach dem Start-Abgleich: " + n + " Läufe statt 1");
        runGlobal = keepRun; aiReady = keepReady; }
      localStorage.setItem("zz-fuell", "x".repeat(3100000));
      if (!/Gerätespeicher fast voll/.test(buildReport())) E.push("Bericht warnt nicht vor vollem Speicher");
      A.tab("settings");
      if (!/Gerätespeicher fast voll/.test(document.querySelector("#app").textContent)) E.push("Einstellungen warnen nicht vor vollem Speicher");
      localStorage.removeItem("zz-fuell");
      if (/fast voll/.test(buildReport())) E.push("Speicher-Warnung ohne Grund");
      saveRepoCache(); safeCopy("-vor-sync", S);
      const orig = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === KEY && localStorage.getItem(REPO_KEY) !== null) { const e = new Error("voll"); e.name = "QuotaExceededError"; throw e; }
        return orig.call(this, k, v);
      };
      const t0 = Date.now();
      try { save(); } finally { Storage.prototype.setItem = orig; }
      if (localStorage.getItem(REPO_KEY) !== null || !localStorage.getItem(KEY + "-vor-sync") || !(JSON.parse(localStorage.getItem(KEY)).updated >= t0))
        E.push("bei vollem Speicher nicht zuerst den Lektions-Zwischenspeicher geopfert");
      saveRepoCache();
      // D-1014-81: alte Sicherheitskopien aufräumen – neueste allgemeine bleibt, Lösch-Kopie unberührt, Reset-Kopie
      // solange jünger als COPY_DAYS (Gegenprobe: frische Kopien bleiben)
      { const n = Date.now(), cp = (k, d) => localStorage.setItem(KEY + k, JSON.stringify({ updated: n - d * DAY, topics: {} }));
        cp("-vor-sync", 20); cp("-vor-import", 30); cp("-vor-wiederherstellung", 2); cp("-vor-loeschen", 90); cp("-vor-reset", 9);
        localStorage.setItem(KEY + "-vor-reset-info", JSON.stringify({ id: "t01", at: n - 9 * DAY }));
        localStorage.setItem(KEY + "-defekt-" + (n - 10 * DAY), "{"); localStorage.setItem(KEY + "-defekt-" + (n - DAY), "{");
        pruneCopies(n);
        const has = k => localStorage.getItem(KEY + k) !== null;
        if (has("-vor-sync") || has("-vor-import") || has("-vor-reset") || has("-vor-reset-info") || has("-defekt-" + (n - 10 * DAY)))
          E.push("D-1014-81: alte Sicherheitskopien bleiben liegen");
        if (!has("-vor-wiederherstellung") || !has("-vor-loeschen") || !has("-defekt-" + (n - DAY))) E.push("D-1014-81: neueste bzw. geschützte Kopie gelöscht");
        localStorage.removeItem(KEY + "-vor-wiederherstellung"); cp("-vor-sync", 30); pruneCopies(n);
        if (!has("-vor-sync")) E.push("D-1014-81 Gegenprobe: einzige (alte) Kopie gelöscht");
        cp("-vor-reset", 2); localStorage.setItem(KEY + "-vor-reset-info", JSON.stringify({ id: "t01", at: n - 2 * DAY })); pruneCopies(n);
        if (!has("-vor-reset")) E.push("D-1014-81 Gegenprobe: frische Reset-Kopie gelöscht");
        ["-vor-loeschen", "-vor-reset", "-vor-reset-info", "-defekt-" + (n - DAY)].forEach(k => localStorage.removeItem(KEY + k)); }
      return E;
    });
    if (!r.length) ok("Gesamtanalyse erst nach dem Start-Abgleich, Speicher-Warnung, Lektionen zuerst geopfert, alte Kopien aufgeräumt (S-1008-15, E-1008-28, D-1014-81)");
    else r.forEach(m => fail("Simulation 8.10.: " + m));
    await q.context().close(); }

  // S-1008-73: Wortprüfung meldet ein Wort ohne frühere Wortliste, aber keine bekannten Wörter, gegebenen Wörter oder Namen
  { const q = await device({ setupDone: true });
    const w0 = (await q.evaluate(() => gkey(TOPICS[0].v[0][0].split(" ")[0])));
    const r = await q.evaluate(newWordsCheck, { ids: ["zz9"], extra: { id: "zz9", title: "Test", req: [], v: [], ex: [
      { t: "tr", dir: "de", q: "x", a: [w0 + " qwzrtx ja Matti."] }, { t: "sch", q: "x", w: ["plomxa"], a: ["Plomxa."] },
      { t: "tr", dir: "fi", q: "vbnqwe", a: ["x"] }] } });
    const m = r.join(" ");
    if (r.length === 1 && /zz9: .*qwzrtx \(Übung 0\)/.test(m) && !/plomxa|matti|vbnqwe/i.test(m) && !new RegExp("\\b" + w0 + " \\(").test(m)) ok("Wortprüfung: Wort ohne frühere Wortliste wird gemeldet, bekannte und gegebene Wörter nicht (S-1008-73)");
    else fail("Wortprüfung (S-1008-73): " + JSON.stringify(r));
    await q.context().close(); }

}
