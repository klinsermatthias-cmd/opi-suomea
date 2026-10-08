/* Prüfskript – durchlauf.mjs (S-1008-102): Teil 4 – App-Durchlauf mit den Test-Inhalten: Themen mit Musterlösungen, Vokabeln, Hörtraining, Fehler-Training,
   alle Ansichten in 390 px und die Einzelprüfungen der Engine-Funktionen.
   Aufgerufen von tools/pruefen.mjs; gemeinsame Werte und Ergebnisse früherer Teile stehen im Objekt P. */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

export default async function durchlauf(P) {
  const { ok, fail, ids, device } = P;
  /* ---------- 4. App-Durchlauf ---------- */
  const page = await device({ setupDone: true });
  const r = await page.evaluate(async () => {
    const out = { err: [], info: [] }, E = m => out.err.push(m);
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const click = sel => { const b = document.querySelector(sel); if (!b) throw new Error("Knopf fehlt: " + sel); b.click(); };
    const wide = name => { if (document.documentElement.scrollWidth > 392) E(`${name}: zu breit für 390 px (${document.documentElement.scrollWidth} px)`); };
    await loadRepoLessons();
    // Lektionen aus der Datei müssen alle (streng) gültig sein
    const raw = await (await fetch("lektionen/lektionen.json", { cache: "no-store" })).json();
    raw.forEach(t => { const c = JSON.parse(JSON.stringify(t)); if (!validTopic(c)) E(`${t.id}: ungültig (Pflichtfelder oder fehlerhafte Übung/Vokabel)`); if (!T(t.id)) E(`${t.id}: nicht geladen`); });
    BASE_TOPICS.forEach(t => { if (!validTopic(JSON.parse(JSON.stringify(t)))) E(`${t.id}: ungültig`); });
    out.info.push(TOPICS.length + " Themen");
    // Theorie-HTML: Schadcode wird entfernt, erlaubte Formatierung bleibt
    const san = sanitizeHTML('<p class="rule">x <i>olla</i> <s>a</s></p><img src=x onerror=alert(1)><script>alert(1)</script><a href="javascript:alert(1)">l</a><iframe src="//x"></iframe>');
    if (/onerror|<script|javascript:|<iframe|<img|<a /i.test(san) || !san.includes('<p class="rule">') || !san.includes("<s>")) E("sanitizeHTML unsicher oder zu streng: " + san);
    // Vorlese-Knöpfe in Theorie-Tabellen: erste Spalte, bei class="sayall" jedes Kästchen, bei class="nosay" keins (E-1008-51)
    { const d = document.createElement("div");
      d.innerHTML = sanitizeHTML('<table><tr><td>a1</td><td>b1</td></tr></table><table class="sayall"><tr><td>a2</td><td>b2</td></tr></table><table class="nosay"><tr><td>a3</td><td>b3</td></tr></table>');
      decorateTheory(d);
      const ids = [...d.querySelectorAll('[data-act="say"]')].map(b => b.dataset.id).join(",");
      if (ids !== "a1,a2,b2") E("Theorie-Tabellen: Vorlese-Knöpfe falsch (" + ids + ")"); }
    // Rückwärts-Karte verrät die Lösung nicht (E-1008-57): finnische Formen in Klammern / nach „:“ bis zum Aufdecken verdeckt
    for (const [q, a, want] of [["Schuh (kengät = Schuhe)", "kenkä", "Schuh (…)"], ["wie geht es Ihnen? (höflich)", "mitä teille kuuluu?", "wie geht es Ihnen? (höflich)"],
      ["Onkel (väterlicherseits)", "setä", "Onkel (väterlicherseits)"], ["zu (zu sehr): liian kallis", "liian", "zu (zu sehr): …"], ["lesen (luen)", "lukea", "lesen (…)"]])
      if (promptNoSpoiler(q, a) !== want) E(`promptNoSpoiler(${q}) = ${promptNoSpoiler(q, a)} statt ${want}`);
    // Vorgegebene Wörter der Schreibaufgabe erst auf Wunsch (E-1008-57)
    { const d = document.createElement("div"); d.innerHTML = writeBoxHTML("x", ["talo"]);
      const det = d.querySelector("details.whelp");
      if (!det || det.open || !/Verwende/.test(det.textContent)) E("Schreibaufgabe: „Verwende“ nicht hinter „Wörter zeigen“ verborgen"); }
    // … auch auf der echten Karte: vorne verdeckt, nach dem Aufdecken die ganze Angabe
    { const t = TOPICS[0], w = t.v[0], orig = w[1], id = `${t.id}-0-r`;
      w[1] = `${orig} (${w[0]}n)`; // Testwort: Klammer mit finnischer Form
      { const had = S.cards[id];
        if (!had) S.cards[id] = { isNew: true, due: Date.now(), interval: 0, ease: 2.5, reps: 0, lapses: 0 };
        SESSION = { kind: "vocab", queue: [id], done: 0, again: 0 }; renderCard();
        const f1 = document.querySelector(".front").textContent; flipCard(); const f2 = document.querySelector(".front").textContent;
        if (f1 !== promptNoSpoiler(w[1], w[0]) || f2 !== w[1]) E(`Rückwärts-Karte ${id}: vorne „${f1}“, nach dem Aufdecken „${f2}“`);
        SESSION = null; if (!had) delete S.cards[id]; w[1] = orig; } }
    // Ansichten
    for (const tab of ["today", "topics", "vocab", "progress", "settings"]) { A.tab(tab); await wait(30); if (!document.querySelector("#app").innerHTML.trim()) E("Leere Ansicht: " + tab); wide(tab); }
    // Neues Thema: zuerst die Wörter (beide Richtungen), dann die Übungen
    { const t = T("t01"), N = t.v.length, d0 = JSON.stringify(S.daily);
      if (S.topics.t01.status !== "new") E("Testannahme: t01 ist neu");
      A.topic("t01");
      if (!document.querySelector('[data-act="tvocab"]') || document.querySelector('[data-act="learn"]')) E("Neues Thema: Schritt „Wörter lernen“ fehlt oder Übungen schon frei");
      A.tvocab("t01");
      if (!SESSION || SESSION.queue.length !== 2 * N) E(`Wörter lernen: ${SESSION && SESSION.queue.length} statt ${2 * N} Karten`);
      const firstRev = SESSION.queue.findIndex(id => id.endsWith("-r"));
      if (firstRev !== N || SESSION.queue.slice(N).some(id => !id.endsWith("-r"))) E("Wörter lernen: Richtungen nicht getrennt (erst fi→de, dann de→fi)");
      // zwei Karten bewerten, dann abbrechen → beim Weiterlernen nur der Rest
      flipCard(); rateCard("good"); flipCard(); rateCard("good"); SESSION = null;
      A.tvocab("t01");
      if (SESSION.queue.length !== 2 * N - 2) E("Wörter lernen: Weiterlernen beginnt nicht beim Rest");
      let n = 0, again = false;
      while (SESSION && SESSION.topicVocab && n++ < 200) { flipCard(); if (!again) { again = true; rateCard("again"); } else rateCard("good"); }
      if (!S.topics.t01.vocabDone) E("Wörter lernen: Thema nicht als „Wörter sitzen“ markiert");
      if (!document.querySelector('[data-act="learn"][data-id="t01"]')) E("Wörter lernen: „Weiter zu den Übungen“ fehlt");
      if (!(S.daily.newCards > JSON.parse(d0).newCards)) E("Wörter des Themas zählen nicht zum Tageslimit (E-1007-59)");
      if (!topicVocabIds("t01").every(id => S.cards[id] && S.cards[id].tv && !S.cards[id].isNew)) E("Wörter lernen: nicht alle Karten gelernt");
      A.topic("t01"); if (!document.querySelector('[data-act="learn"]')) E("Nach den Wörtern: Übungen nicht frei");
      // Zurücksetzen ist auch bei einem neuen Thema möglich; mit Vokabeln → Wörter kommen wieder zuerst
      A.topic("t01");
      if (!document.querySelector('[data-act="resettopic"][data-id="t01"]')) E("Neues Thema: „Thema zurücksetzen“ fehlt");
      document.querySelector("#resetvoc").checked = true; resetTopic("t01");
      if (S.topics.t01.vocabDone || topicVocabIds("t01").some(id => S.cards[id])) E("Zurücksetzen inkl. Vokabeln: Wörter-Schritt nicht wieder offen");
      A.tvocab("t01"); let n2 = 0; while (SESSION && SESSION.topicVocab && n2++ < 200) { flipCard(); rateCard("good"); }
      A.topic("t01"); resetTopic("t01");
      if (!S.topics.t01.vocabDone) E("Zurücksetzen ohne Vokabeln: Wörter-Schritt müsste erledigt bleiben");
      // Überspringen für Vorlerner
      const s2 = S.topics.t02.status; S.topics.t02.status = "new"; A.topic("t02"); document.querySelector('[data-act="tvskip"]').click();
      if (!document.querySelector('[data-act="learn"][data-id="t02"]')) E("„Wörter kenne ich schon“ schaltet die Übungen nicht frei");
      S.topics.t02.status = s2;
      // Sync behält „Wörter sitzen“
      const other = JSON.parse(JSON.stringify(S)); other.topics.t01.vocabDone = null;
      if (!mergeStates(S, other).topics.t01.vocabDone) E("Sync verliert „Wörter sitzen“");
      out.info.push(`Neues Thema: erst ${2 * N} Wortkarten, dann Übungen`); }
    // Gesperrte Themen: Voraussetzungen in Liste und auf der Themenseite sichtbar
    { const lockedT = TOPICS.find(t => S.topics[t.id].status === "locked" && t.req.length);
      if (lockedT) {
        A.tab("topics"); await wait(10);
        const line = [...document.querySelectorAll(".titem")].find(b => b.dataset.id === lockedT.id);
        if (!line || !line.querySelector(".req") || !lockedT.req.every(r => line.textContent.includes(T(r).title))) E("Themenliste: Voraussetzungen fehlen bei " + lockedT.id);
        line.click(); await wait(10);
        if (document.querySelectorAll(".reqrow").length !== lockedT.req.length) E("Gesperrte Themenseite: Voraussetzungen fehlen bei " + lockedT.id);
        wide("gesperrtes Thema");
      } }
    // Jedes Thema mit den Musterlösungen lösen
    const solve = async ex => { if (!fillModel(ex, E)) await checkAnswer(); solved++; };
    let solved = 0;
    for (const t of TOPICS) {
      S.topics[t.id].status = "learning"; addCards(t);
      A.topic(t.id); await wait(5); if (!document.querySelector("#app").innerHTML.trim()) E(t.id + ": Themenseite leer"); wide(t.id);
      if (t.req.length && !document.querySelector("#app").textContent.includes("Baut auf:")) E(t.id + ": „Baut auf“ fehlt");
      startSession(t.id, "learn");
      let first = true, n = 0;
      while (SESSION && SESSION.idx < SESSION.items.length && n++ < 200) {
        const ex = SESSION.items[SESSION.idx];
        if (first) { first = false; dunno(); } // erzeugt einen Fehler + Wiederholung
        else { await solve(ex); const fb = document.querySelector("#fb .fb"); if (!fb || !fb.classList.contains("ok")) E(`${t.id}: Musterlösung wird nicht akzeptiert: ${JSON.stringify(ex).slice(0, 160)}`); }
        wide(t.id + " Übung");
        nextEx();
      }
      if (!document.querySelector("#ratebox")) { E(t.id + ": keine Auswertung am Ende"); continue; }
      if ([...document.querySelectorAll("#ratebox .rate small")].some(x => !/heute|morgen|in \d+ Tagen/.test(x.textContent))) E(t.id + ": Bewertungsknöpfe zeigen den nächsten Termin nicht");
      await rateTopic("good");
    }
    out.info.push(solved + " Übungen mit Musterlösung gelöst");
    // Lesetext, Schreibaufgabe, Dialog: falsche Antworten, „Weiß ich nicht“, ungültige Daten
    { const t = TOPICS.find(x => ["les", "sch", "dlg"].every(k => x.ex.some(e => e.t === k)));
      if (!t) E("Testthema mit les/sch/dlg fehlt");
      else {
        const errsBefore = JSON.stringify(S.errors);
        const run = async (k, act) => { const ei = t.ex.findIndex(e => e.t === k);
          S.active = { id: t.id, mode: "extra", idxs: [ei], rt: [0], idx: 0, results: [], d: Date.now() }; openSession(); wide(t.id + " " + k);
          await act(t.ex[ei]); const fb = document.querySelector("#fb .fb"); SESSION = null; S.active = null; return fb ? fb.className : ""; };
        let c = await run("les", async () => { click('[data-act="lpick"][data-id="0:' + SESSION.cur.qs[0].findIndex(o => !o.ok) + '"]'); click('[data-act="lpick"][data-id="1:' + SESSION.cur.qs[1].findIndex(o => o.ok) + '"]'); await checkAnswer(); });
        if (!/bad/.test(c)) E("Lesetext: falsche Antwort nicht als falsch erkannt");
        c = await run("les", async () => { click('[data-act="lpick"][data-id="0:0"]'); await checkAnswer(); });
        if (c) E("Lesetext: unvollständig beantwortet darf nicht geprüft werden");
        c = await run("dlg", async ex => { document.querySelectorAll(".dcell").forEach(i => (i.value = "zzz")); await checkAnswer(); });
        if (!/bad/.test(c) || document.querySelectorAll(".dlg .sol").length !== dlgGaps(t.ex.find(e => e.t === "dlg")).length) E("Dialog: falsche Zeilen ohne Lösung");
        c = await run("dlg", async () => dunno());
        if (!/dunno/.test(c)) E("Dialog: „Weiß ich nicht“ ohne Lösung");
        c = await run("sch", async () => { $("#ans").value = "zzz"; await checkAnswer(); });
        if (!/bad/.test(c) || !document.querySelector("#fb").textContent.includes("Musterlösung")) E("Schreibaufgabe: Musterlösung fehlt bei falscher Antwort");
        if (["les", "sch", "dlg"].some(k => validEx({ t: k })) || validEx({ t: "dlg", q: "x", r: [["A", "Hei"], ["B", "Moi"]] }) || validEx({ t: "les", txt: ["A: Hei"], qs: [{ q: "?", o: ["a", "b"], a: 2 }] }) || validEx({ t: "dlg", q: "x", r: [["A", "Hei"], ["B", "[]"]] }) || validEx({ t: "tab", q: "x", r: [["a", "[ | ]"]] }))
          E("validEx: ungültige les/sch/dlg-Übung wird akzeptiert");
        if (!TOPICS.every(x => x.ex.every(e => exDescribe(e) && promptText(e) && expectedText(e) && solutionText(e)))) E("Übungsformate: Beschreibung oder Lösungstext fehlt");
        if (validEx({ t: "xyz", q: "x" })) E("validEx: unbekannter Übungstyp wird akzeptiert");
        for (const k of ["les", "dlg", "sch"]) { const ei = t.ex.findIndex(e => e.t === k); if (ei < 0) { E("Testthema ohne " + k); continue; }
          S.active = { id: t.id, mode: "extra", idxs: [ei], rt: [0], idx: 0, results: [], d: Date.now() }; openSession();
          const ak = document.querySelector('[data-act="askex"]'); if (ak) ak.click(); if (!document.querySelector("#askexq")) E("Frag-Feld fehlt bei " + k); SESSION = null; S.active = null; }
        S.errors = JSON.parse(errsBefore); save();
        out.info.push("Lesetext, Schreibaufgabe und Dialog: Prüfung, Fehler, „Weiß ich nicht“ in Ordnung");
      } }
    // Freie Runden (KI-Übungen, Fehler aus KI-Übungen): richtige Antwort kommt nicht noch einmal
    { const ex = T("t01").ex.find(e => e.t === "mc");
      S.active = { id: "__gen", mode: "gen", title: "Test", gen: [ex, ex], gsrc: [{ tid: "t01", ei: -1 }, { tid: "t01", ei: -1 }], idxs: [0, 1], rt: [0, 0], idx: 0, results: [], d: Date.now() };
      openSession(); const n0 = SESSION.items.length;
      click(`.opt[data-id="${SESSION.cur.opts.findIndex(o => o.ok)}"]`);
      if (SESSION.items.length !== n0 || /kommt gleich nochmal/.test(document.querySelector("#fb").textContent)) E("Freie Runde: richtige Antwort wird erneut eingereiht (Runde endet nie)");
      SESSION = null; S.active = null; }
    // Abgleich: beendete Runde wird nicht wiederbelebt, längeres Lektionspaket gewinnt
    { const L = JSON.parse(JSON.stringify(S)), R = JSON.parse(JSON.stringify(S));
      L.active = { id: "t01", mode: "review", idxs: [0], rt: [0], idx: 0, results: [], d: 777 }; R.active = null; R.activeDone = [777];
      if (mergeStates(L, R).active) E("Abgleich: auf dem anderen Gerät beendete Runde kommt zurück");
      R.active = { id: "t02", mode: "review", idxs: [0], rt: [0], idx: 0, results: [], d: 888 };
      if ((mergeStates(L, R).active || {}).d !== 888) E("Abgleich: offene Runde des anderen Geräts geht verloren");
      R.active = null;
      const p1 = { id: "zz", title: "x", v: [["a", "b"]], ex: [{ t: "mc", q: "?", o: ["a", "b"], a: 0 }] }, p2 = { ...p1, ex: [...p1.ex, p1.ex[0]] };
      L.packs = [p2]; R.packs = [p1];
      if (mergeStates(L, R).packs.find(x => x.id === "zz").ex.length !== 2) E("Abgleich: älteres (kürzeres) Lektionspaket überschreibt das neuere");
      L.packs = [p1]; R.packs = [p2];
      if (mergeStates(L, R).packs.find(x => x.id === "zz").ex.length !== 2) E("Abgleich: neueres Lektionspaket der Cloud geht verloren"); }
    // Abgleich: Zurücksetzen und Löschen werden von einem Gerät mit altem Stand nicht rückgängig gemacht
    { const base = JSON.parse(JSON.stringify(S)), tid = TOPICS.find(t => S.topics[t.id].hist && S.topics[t.id].hist.length).id;
      const cid = tid + "-0", old = JSON.parse(JSON.stringify(base)); old.resets = {};
      old.cards[cid] = { ...(old.cards[cid] || {}), isNew: false, last: Date.now() - 5000, reps: 4, interval: 9 };
      old.topics[tid].hist = [{ d: Date.now() - 5000, sc: 90 }];
      const rs = JSON.parse(JSON.stringify(old)); rs.topics[tid] = { status: "new", hist: [], reps: 0 }; delete rs.cards[cid]; delete rs.cards[cid + "-r"];
      rs.resets = { [tid]: { at: Date.now() - 1000, voc: true } }; rs.updated = Date.now();
      for (const [a, b, n] of [[old, rs, "alt→neu"], [rs, old, "neu→alt"]]) {
        const M = mergeStates(a, b);
        if (M.topics[tid].status !== "new" || M.cards[cid]) E("Abgleich (" + n + "): zurückgesetztes Thema kommt zurück");
        if (!M.resets || !M.resets[tid]) E("Abgleich (" + n + "): Merkzeichen fürs Zurücksetzen fehlt");
      }
      const later = JSON.parse(JSON.stringify(rs)); later.topics[tid] = { status: "learning", hist: [{ d: Date.now(), sc: 70 }], reps: 1 };
      if (mergeStates(old, later).topics[tid].hist[0].sc !== 70) E("Abgleich: nach dem Zurücksetzen Gelerntes geht verloren");
      /* Zurückgesetztes Thema: danach nur „Wörter gelernt“ (ohne Runde) bleibt erhalten */
      const vd = JSON.parse(JSON.stringify(rs)); vd.topics[tid] = { ...vd.topics[tid], vocabDone: Date.now() };
      if (!mergeStates(rs, vd).topics[tid].vocabDone) E("Abgleich: „Wörter gelernt“ nach dem Zurücksetzen geht verloren");
      /* Löschen: altes Gerät speichert danach noch etwas (updated neuer) – trotzdem kein alter Fortschritt zurück */
      const W = Date.now() - 500, wiped = defaultState(); wiped.wiped = W; wiped.updated = W;
      old.updated = Date.now() + 1000; old.wiped = undefined;
      old.errors = [{ d: Date.now() - 5000, topic: tid, ei: 0, q: "x", user: "y", exp: "z" }];
      for (const M of [mergeStates(old, wiped), mergeStates(wiped, old)]) {
        if (M.topics[tid] && M.topics[tid].hist && M.topics[tid].hist.length) E("Abgleich: gelöschtes Thema kommt von einem alten Gerät zurück");
        if (M.cards[cid] || M.errors.length) E("Abgleich: gelöschte Karten/Fehler kommen zurück");
      }
      const after = JSON.parse(JSON.stringify(old)); after.topics[tid].hist = [{ d: Date.now() + 500, sc: 80 }]; after.cards[cid].last = Date.now() + 500;
      const Ma = mergeStates(after, wiped);
      if (!Ma.topics[tid].hist.length || !Ma.cards[cid]) E("Abgleich: nach dem Löschen auf einem anderen Gerät Gelerntes geht verloren");
      const undone = JSON.parse(JSON.stringify(old)); undone.wiped = W; undone.wipeUndone = Date.now();
      if (!mergeStates(old, mergeStates(undone, wiped)).cards[cid]) E("Abgleich: wiederhergestellter Stand wird wieder gelöscht");
      /* Sicherung von NACH dem Zurücksetzen einspielen: das Zurücksetzen gilt weiter gegenüber einem veralteten Gerät */
      const rsAt = Date.now() - 3000, bk = JSON.parse(JSON.stringify(rs)); bk.resets = { [tid]: { at: rsAt, voc: true } }; bk.updated = rsAt + 1000; bk.wiped = undefined;
      const rest = JSON.parse(JSON.stringify(bk)); rest.restoreWins = [{ from: bk.updated, at: Date.now() }];
      const oldDev = JSON.parse(JSON.stringify(old)); oldDev.topics[tid].hist = [{ d: rsAt - 2000, sc: 90 }]; oldDev.wiped = undefined;
      if (mergeStates(oldDev, rest).topics[tid].status !== "new") E("Abgleich: Sicherung hebt ein älteres Zurücksetzen auf");
      /* Sicherung von VOR dem Zurücksetzen einspielen: das Zurücksetzen gilt nicht mehr */
      const rest2 = JSON.parse(JSON.stringify(bk)); rest2.restoreWins = [{ from: rsAt - 1500, at: Date.now() }]; rest2.topics[tid] = oldDev.topics[tid];
      if (mergeStates(rest2, rs).topics[tid].status === "new" && !(mergeStates(rest2, rs).topics[tid].hist || []).length) E("Abgleich: eingespielte ältere Sicherung wird durch das Zurücksetzen entfernt"); }
    // Sicherung einspielen: ungültiger Stand ändert nichts; eingespielter Stand wird vom Löschen-Merkzeichen nicht entfernt
    { const keep = JSON.stringify(S), before = S;
      try { replaceState({ topics: {}, cards: {}, daily: null, packs: null }); } catch (e) {}
      try { replaceState(null); E("replaceState: ungültiger Stand angenommen"); } catch (e) {}
      if (S !== before && JSON.stringify(S) !== keep) E("Sicherung einspielen: ungültiger Stand hat den bisherigen ersetzt");
      S = JSON.parse(keep); migrate();
      const cid = learnedCardIds()[0], W = Date.now() - 100;
      const cloud = JSON.parse(keep); cloud.wiped = W; cloud.updated = W; Object.keys(cloud.cards).forEach(k => delete cloud.cards[k]);
      const backup = JSON.parse(keep); backup.cards[cid].last = W - 10000; backup.updated = W - 5000; /* Sicherung von vor dem Löschen */
      replaceState(backup);
      if (!mergeStates(S, cloud).cards[cid]) E("Sicherung einspielen: Abgleich entfernt die eingespielten Karten wieder");
      S = JSON.parse(keep); migrate(); save(); }
    // Rohdaten sichern: nur Lernstände dieser App, nie Konfiguration/Schlüssel oder die andere App
    { const id = rescueId();
      if (!rescueKey(id + "-v1", id) || !rescueKey(id + "-v1-vor-sync", id) || rescueKey(id + "-config", id) || rescueKey("andere-app-v1", id)) E("Rohdaten sichern: falsche Auswahl der Einträge");
      /* ältere App-Version: Zahlenfelder restored/wipeUndone bleiben Zahlen */
      const a = JSON.parse(JSON.stringify(S)), b = JSON.parse(JSON.stringify(S)); a.restored = 5; b.wipeUndone = 7; b.restoreWins = [{ from: 1, at: 7 }];
      const m = mergeStates(a, b); if (typeof m.restored !== "number" || typeof m.wipeUndone !== "number") E("Abgleich: Zahlenfelder für ältere Versionen fehlen"); }
    // Eigene Wörter: anlegen, ändern, löschen, Karten, Antippen, Zusammenführen, Bericht
    { A.tab("vocab"); await wait(5);
      $("#ownfi").value = "mustikka"; $("#ownde").value = "Heidelbeere"; click('[data-act="ownsave"]');
      const n = ownKeys().find(k => S.own[k].fi === "mustikka");
      if (!n || !S.cards["own-" + n] || !S.cards["own-" + n + "-r"]) E("Eigene Wörter: Wort oder Karten fehlen");
      else {
        if (!newFwdIds().includes("own-" + n)) E("Eigene Wörter: neue Karte wird nicht angeboten");
        if (!cardWord("own-" + n) || cardWord("own-" + n)[1] !== "Heidelbeere") E("Eigene Wörter: cardWord falsch");
        if (!glossLocal("mustikka") || glossLocal("mustikka").de !== "Heidelbeere") E("Eigene Wörter: Antippen kennt das Wort nicht");
        A.tab("vocab"); await wait(5); wide("Vokabeln mit eigenen Wörtern");
        click(`[data-act="ownedit"][data-id="${n}"]`); $("#ownde").value = "Blaubeere"; click(`[data-act="ownsave"][data-id="${n}"]`);
        if (S.own[n].de !== "Blaubeere") E("Eigene Wörter: Ändern klappt nicht");
        S.own[n] = { ...S.own[n], de: "Heidelbeere (über Abgleich)", u: S.own[n].u + 1 };
        if (glossLocal("mustikka").de !== "Heidelbeere (über Abgleich)") E("Antippen: Änderung eines eigenen Wortes über den Abgleich nicht übernommen");
        S.own[n] = { ...S.own[n], de: "Blaubeere", u: S.own[n].u + 1 };
        $("#ownfi").value = "mustikka"; $("#ownde").value = "x"; click('[data-act="ownsave"]');
        if (ownKeys().filter(k => S.own[k].fi === "mustikka").length !== 1) E("Eigene Wörter: doppeltes Wort angelegt");
        if (!buildReport().includes("mustikka = Blaubeere")) E("Bericht: eigene Wörter fehlen");
        const L = JSON.parse(JSON.stringify(S)), R = JSON.parse(JSON.stringify(S));
        L.own[1] = { fi: "puolukka", de: "Preiselbeere", d: 1, u: 1 }; R.own[n] = { ...R.own[n], del: 1, u: Date.now() + 5 };
        const M = mergeStates(L, R);
        if (!M.own[1] || !M.own[n] || !M.own[n].del) E("Eigene Wörter: Zusammenführen verliert ein Wort oder belebt ein gelöschtes wieder");
        A.tab("vocab"); await wait(5); click(`[data-act="owndel"][data-id="${n}"]`); click(`[data-act="owndel"][data-id="${n}"]`);
        if (cardWord("own-" + n) || newFwdIds().includes("own-" + n) || ownKeys().includes(n) || S.cards["own-" + n]) E("Eigene Wörter: gelöschtes Wort oder seine Karten noch aktiv");
        delete S.own[n]; delete S.cards["own-" + n]; delete S.cards["own-" + n + "-r"]; DICT = null; save();
      }
      out.info.push("Eigene Wörter: anlegen, ändern, löschen, Antippen, Abgleich, Bericht"); }
    // Lernregeln dynamisch: Problemwort endet nach 3 Erfolgen in Folge, kommt beim Vergessen zurück; Ease erholt sich;
    // Verspätung wird angerechnet; höchstens 365 Tage
    { const id = learnedCardIds()[0], keep = JSON.stringify(S.cards[id]), c = S.cards[id];
      Object.assign(c, { lapses: 3, reps: 0, ease: 1.8, interval: 1, lk: undefined, lkd: undefined }); // alter Stand ohne Tageszähler: reps zählt
      if (!isLeech(id)) E("Problemwort: oft vergessenes Wort nicht markiert");
      for (let i = 0; i < 3; i++) Object.assign(c, sm2Next(c, 4));
      if (isLeech(id)) E("Problemwort: nach 3× gewusst noch markiert");
      Object.assign(c, sm2Next(c, 1));
      if (!isLeech(id)) E("Problemwort: nach erneutem Vergessen nicht wieder markiert");
      S.cards[id] = JSON.parse(keep);
      // E-1007-22: ⚠ verschwindet nach richtigen Antworten an 3 verschiedenen Tagen – auch bei „Problemwörter üben“;
      // mehrmals am selben Tag zählt einmal, Vergessen setzt zurück, Anzeige „⚠ n/3“
      { const tk0 = todayKey, c2 = S.cards[id]; Object.assign(c2, { isNew: false, lapses: 3, reps: 0, ease: 1.8, interval: 1, due: addDays(5), lk: undefined, lkd: undefined });
        const day = d => (todayKey = () => "2099-01-0" + d);
        const prac = k => { SESSION = { kind: "vocab", queue: [id], done: 0, again: 0, shown: true, extra: "practice", leech: 1 }; rateCard(k); SESSION = null; };
        day(1); prac("good"); prac("good"); prac("good");
        if (leechProgress(c2) !== 1 || !isLeech(id)) E("Problemwort: am selben Tag mehrfach gezählt oder gar nicht " + leechProgress(c2));
        if (!/⚠ 1\/3/.test(leechMark(id))) E("Problemwort: Anzeige ⚠ 1/3 fehlt " + leechMark(id));
        day(2); prac("again"); prac("good");
        if (leechProgress(c2) !== 0) E("Problemwort: Vergessen setzt nicht zurück");
        day(3); prac("good"); day(4); prac("hard"); day(5); prac("easy");
        if (isLeech(id)) E("Problemwort: nach 3 Tagen richtig noch markiert");
        day(6); prac("again");
        if (!isLeech(id)) E("Problemwort: nach erneutem Vergessen nicht wieder markiert (Tageszählung)");
        todayKey = tk0; S.cards[id] = JSON.parse(keep); }
      const g = sm2Next({ ease: 1.5, reps: 2, interval: 10, lapses: 2 }, 4);
      if (!(g.ease > 1.5) || g.interval !== 15) E("Ease-Erholung bei „Gut“ fehlt: " + JSON.stringify(g));
      if (sm2Next({ ease: 2.5, reps: 2, interval: 10 }, 4).ease !== 2.5) E("Ease über 2,5 durch „Gut“ verändert");
      if (sm2Next({ ease: 2.5, reps: 3, interval: 10 }, 4, 10).interval !== 38) E("Verspätung wird nicht angerechnet");
      if (sm2Next({ ease: 2.5, reps: 3, interval: 10 }, 3, 10).interval !== 12) E("„Schwer“ darf Verspätung nicht anrechnen");
      if (sm2Next({ ease: 3, reps: 5, interval: 300 }, 5).interval !== 365) E("Abstand nicht auf 365 Tage begrenzt");
      const f = sm2Next({ ease: 2.5, reps: 4, interval: 40, lapses: 0 }, 1);
      if (f.interval !== 0 || f.reps !== 0 || !(f.ease < 2.5) || f.lapses !== 1) E("Vergessen setzt den Abstand nicht zurück");
      if (topicIv(30, 0.5, 1) !== 2 || topicIv(30, 0.7, 2) !== 4 || topicIv(30, 0.9, 4) !== 8 || topicIv(200, 0.9, 40, 2) !== 45 || topicIv(200, 0.9, 40, 5) !== 80 || topicIv(3, 0.9, 10) !== 3 || topicIv("x", 0.9, 5) !== 5) E("Themen: KI-Termin nicht nach Ergebnis begrenzt");
      out.info.push("Lernregeln: Vergessen → öfter, Gut → seltener (mit Ease-Erholung, Verspätungsbonus, max. 365 Tage), Problemwort endet nach 3× gewusst"); }
    // Problemwörter üben und Paare zuordnen
    { const ids = learnedCardIds(); const keep = JSON.stringify(S.cards);
      if (ids.length < 3) E("Zu wenige gelernte Karten für Problemwörter/Paare");
      else {
        S.cards[ids[0]].lapses = 3; A.tab("vocab"); await wait(5);
        if (document.querySelector(".vrow")) E("Vokabeln: Wortliste nicht hinter „Alle Wörter anzeigen“");
        A.allwords(); await wait(5);
        if (!document.querySelector('[data-act="leech"]') || !document.querySelector(".leech")) E("Problemwörter: Knopf oder ⚠ fehlt");
        click('[data-act="leech"]');
        if (!SESSION || !SESSION.leech || !SESSION.queue.includes(ids[0])) E("Problemwörter: Runde startet nicht");
        let k = 0; while (SESSION && SESSION.kind === "vocab" && k++ < 50) { flipCard(); rateCard("good"); }
        if (!/Problemw/.test(document.querySelector("#app").textContent)) E("Problemwörter: kein Rundenende");
        A.tab("vocab"); await wait(5); click('[data-act="pairs"]');
        if (!SESSION || SESSION.kind !== "pairs") E("Paare: Spiel startet nicht");
        else {
          wide("Paare zuordnen");
          const se = SESSION, wrong = se.ws.length > 1 ? 1 : 0;
          if (wrong) { click('[data-id="L:0"]'); click('[data-id="R:1"]'); if (se.miss !== 1) E("Paare: Fehlgriff nicht gezählt"); }
          se.ws.forEach((_, i) => { click(`[data-id="L:${i}"]`); click(`[data-id="R:${i}"]`); });
          if (SESSION || !/Paare in/.test(document.querySelector("#app").textContent)) E("Paare: kein Rundenende");
        }
        S.cards = JSON.parse(keep); save();
      }
      out.info.push("Problemwörter üben und Paare zuordnen in Ordnung"); }
    // Lernkalender, Vorschau, Grammatik-Übersicht
    { if (!(S.days && S.days[todayKey()] > 0)) E("Lernkalender: heutige Runden nicht gezählt");
      const n0 = S.days[todayKey()]; bumpStreak(); if (S.days[todayKey()] !== n0 + 1) E("Lernkalender: Runde nicht gezählt");
      const M = mergeDays({ "2026-01-01": 2, "2026-01-02": 1 }, { "2026-01-01": 1, "2026-01-03": 4 });
      if (M["2026-01-01"] !== 2 || M["2026-01-02"] !== 1 || M["2026-01-03"] !== 4) E("Lernkalender: Zusammenführen falsch");
      const keep = S.days; S.days = {}; seedDays(); if (!Object.keys(S.days).length) E("Lernkalender: keine Lerntage aus vorhandenen Daten ergänzt"); S.days = keep;
      if (forecast().length !== 7) E("Vorschau: nicht 7 Tage");
      { const kd = S.days, kc = S.cards; S.days = {}; S.cards = {}; if (statsCardHTML()) E("Statistik: leere Karte bei neuem Stand"); S.days = kd; S.cards = kc; }
      A.tab("progress"); await wait(5);
      if (document.querySelectorAll(".cal i").length !== 84 || document.querySelectorAll(".fcol").length !== 7) E("Statistik: Kalender oder Vorschau fehlt");
      wide("Statistik");
      A.tab("topics"); await wait(5); click('[data-act="grammar"]'); await wait(5);
      const open = TOPICS.filter(t => S.topics[t.id].status !== "locked").length;
      if (document.querySelectorAll("details.gram").length !== open || !open) E("Grammatik-Übersicht: Themen fehlen");
      wide("Grammatik-Übersicht"); A.tab("today");
      out.info.push("Lernkalender, Vorschau und Grammatik-Übersicht in Ordnung"); }
    // Freischaltversuch: Thema unter 80 % blockiert ein anderes → alle Übungen, danach frei
    { const t = TOPICS.find(x => TOPICS.some(y => y.req.includes(x.id)));
      const dep = TOPICS.filter(y => y.req.includes(t.id));
      S.topics[t.id].last = 0.5; dep.forEach(y => (S.topics[y.id].status = "locked")); save();
      A.topic(dep[0].id); await wait(5);
      if (!document.querySelector(`.reqrow [data-act="unlock"][data-id="${t.id}"]`)) E("Gesperrtes Thema: Knopf „Freischaltversuch“ fehlt");
      A.topic(t.id); await wait(5);
      if (!document.querySelector('[data-act="unlock"]')) E("Themenseite: Knopf „Freischaltversuch starten“ fehlt");
      A.unlock(t.id);
      if (SESSION.items.length !== t.ex.length) E(`Freischaltversuch: ${SESSION.items.length} statt ${t.ex.length} Übungen`);
      let n = 0; while (SESSION && SESSION.idx < SESSION.items.length && n++ < 200) { await solve(SESSION.items[SESSION.idx]); nextEx(); }
      await rateTopic("good");
      if (S.topics[t.id].last !== 1) E("Freischaltversuch: Ergebnis nicht übernommen");
      if (!dep.every(y => S.topics[y.id].status !== "locked")) E("Freischaltversuch: abhängiges Thema bleibt gesperrt");
      else out.info.push("Freischaltversuch schaltet " + dep.map(y => y.id).join(", ") + " frei"); }
    // Pause: Runde bleibt gespeichert, Fortsetzen zählt alle Antworten; andere Runde starten fragt erst nach
    { const t = TOPICS.find(x => x.ex.length >= 3 && S.topics[x.id].status !== "locked"), o = TOPICS.find(x => x.id !== t.id && S.topics[x.id].status !== "locked");
      A.learn(t.id); await solve(SESSION.items[SESSION.idx]); nextEx(); await solve(SESSION.items[SESSION.idx]);
      const btn = document.querySelector('[data-act="abort"]');
      if (!btn || btn.textContent !== "Pause") E("Übung: Knopf „Pause“ fehlt");
      btn.click(); await wait(5);
      if (!S.active || S.active.id !== t.id || S.active.results.length !== 2) E("Pause: Runde nicht gespeichert");
      if (!document.querySelector('#app [data-act="resume"]') || !document.querySelector('#app [data-act="discard"]')) E("Pause: Themenseite zeigt Fortsetzen/Verwerfen nicht");
      A.tab("today"); if (!document.querySelector('#app [data-act="resume"]')) E("Pause: „Heute“ zeigt die pausierte Runde nicht");
      A.learn(o.id);
      if (!document.querySelector('#app [data-act="startanyway"]') || SESSION || S.active.id !== t.id) E("Pause: andere Runde überschreibt ohne Nachfrage");
      document.querySelector('#app [data-act="resume"]').click(); await wait(5);
      if (!SESSION || SESSION.id !== t.id || SESSION.idx !== 2) E("Pause: Fortsetzen nicht an der richtigen Stelle");
      let n = 0; while (SESSION && SESSION.idx < SESSION.items.length && n++ < 200) { await solve(SESSION.items[SESSION.idx]); nextEx(); }
      await rateTopic("good");
      if (S.topics[t.id].last !== 1 || S.active) E("Pause: Ergebnis nach Fortsetzen nicht vollständig");
      A.learn(t.id); document.querySelector('[data-act="abort"]').click(); await wait(5);
      A.learn(o.id); document.querySelector('#app [data-act="startanyway"]').click(); await wait(5);
      if (!SESSION || SESSION.id !== o.id || S.active.id !== o.id) E("Pause: „Trotzdem neu starten“ startet nicht");
      document.querySelector('[data-act="abort"]').click(); await wait(5);
      document.querySelector('#app [data-act="discard"]').click(); await wait(5);
      if (S.active) E("Pause: „Runde verwerfen“ wirkt nicht");
      else out.info.push("Pause: Runde gespeichert, fortgesetzt, Nachfrage vor neuer Runde, verwerfen"); }
    // Zusätzliche Vokabeln: Einstellung gilt für neue UND gelernte Wörter
    { const keep = JSON.stringify(S.cards); S.settings.extraCards = 20;
      Object.values(S.cards).forEach(c => (c.isNew = true)); startExtraVocab();
      const nNew = SESSION && SESSION.extra === "new" ? SESSION.queue.length : -1;
      Object.values(S.cards).forEach(c => (c.isNew = false)); startExtraVocab();
      const nOld = SESSION && SESSION.extra === "practice" ? SESSION.queue.length : -1;
      const total = Object.keys(S.cards).length;
      if (nNew !== Math.min(20, total) || nOld !== Math.min(20, total)) E(`Zusätzliche Vokabeln: neu ${nNew}, gelernt ${nOld}, erwartet je ${Math.min(20, total)}`);
      A.tab("today"); await wait(5);
      if (!document.querySelector("#app").textContent.includes(Math.min(20, total) + " gelernte Wörter extra üben")) E("Heute: Text zu zusätzlichen Vokabeln stimmt nicht");
      // Extra-Üben wirkt auf den Plan: Nochmal = morgen, Schwer = halbe Restzeit, Gut = nur kurz vor Fälligkeit
      { const ids = Object.keys(S.cards).slice(0, 4), far = addDays(10), near = addDays(1);
        ids.forEach((id, i) => Object.assign(S.cards[id], { isNew: false, reps: 3, interval: 10, ease: 2.5, lapses: 0, due: i === 3 ? near : far, last: Date.now() - 3 * DAY }));
        SESSION = { kind: "vocab", queue: ids.slice(), done: 0, again: 0, shown: true, extra: "practice" };
        const rate = k => { SESSION.shown = true; rateCard(k); if (SESSION) SESSION.shown = true; };
        rate("again"); rate("hard"); rate("good"); rate("good"); // Karten 0–3
        const [c0, c1, c2, c3] = ids.map(id => S.cards[id]);
        if (!(c0.due === addDays(1) && c0.lapses === 1)) E("Extra-Üben „Nochmal“ wirkt nicht wie ein Fehler");
        if (!(c1.due === addDays(5) && c1.ease === 2.5)) E("Extra-Üben „Schwer“ zieht den Termin nicht vor (oder senkt die Leichtigkeit): " + new Date(c1.due) + " " + c1.ease);
        if (c2.due !== far) E("Extra-Üben „Gut“ verschiebt einen weit entfernten Termin");
        if (!(c3.due > near && c3.reps === 4)) E("Extra-Üben „Gut“ kurz vor Fälligkeit zählt nicht als Wiederholung");
        SESSION.shown = true; rateCard("good"); // Karte 0 kommt als Wiederholung in der Runde – darf nicht nochmal zählen
        if (S.cards[ids[0]].due !== addDays(1) || S.cards[ids[0]].reps !== 0) E("Extra-Üben: Wiederholung in der Runde zählt doppelt");
        // Anrechnung nach echter Pause: zuletzt vor 3 Tagen, fällig in 5 Tagen, Ease 2,5
        const setc = (id, last) => Object.assign(S.cards[id], { isNew: false, reps: 3, interval: 8, ease: 2.5, lapses: 0, due: addDays(5), last, xp: 0 });
        const three = startOfDay() - 3 * DAY + 3600e3;
        setc(ids[0], three); setc(ids[1], three); setc(ids[2], Date.now());
        SESSION = { kind: "vocab", queue: ids.slice(0, 3), done: 0, again: 0, shown: true, extra: "practice" };
        rate("good"); rate("easy"); rate("easy");
        if (S.cards[ids[0]].due !== addDays(8)) E("Extra-Üben „Gut“ nach 3 Tagen Pause: erwartet in 8 Tagen, ist " + Math.round((S.cards[ids[0]].due - startOfDay()) / DAY));
        if (S.cards[ids[1]].due !== addDays(10)) E("Extra-Üben „Einfach“ nach 3 Tagen Pause: erwartet in 10 Tagen, ist " + Math.round((S.cards[ids[1]].due - startOfDay()) / DAY));
        if (S.cards[ids[2]].due !== addDays(5)) E("Extra-Üben „Einfach“ am selben Tag darf nicht verlängern");
        // Vorschau unter den Knöpfen = tatsächliche Wirkung, ohne die Karte zu ändern
        { setc(ids[0], three); const before = JSON.stringify(S.cards[ids[0]]), rv = S.stats.reviews;
          const pre = RATINGS.map(r => practiceDue(S.cards[ids[0]], r.q));
          if (JSON.stringify(S.cards[ids[0]]) !== before || S.stats.reviews !== rv) E("Extra-Üben: Vorschau ändert die Karte");
          if (pre[0] !== addDays(1) || pre[2] !== addDays(8)) E("Extra-Üben: Vorschau stimmt nicht mit der Wirkung überein: " + pre.map(d => relDays(d)).join(", "));
          SESSION = { kind: "vocab", queue: [ids[0]], done: 0, again: 0, extra: "practice", dir: "fi" }; renderCard(); flipCard();
          const lab = [...document.querySelectorAll("#cact .rate small")].map(x => x.textContent);
          if (lab.join("|") !== pre.map(d => relDays(d)).join("|")) E("Extra-Üben: Knöpfe zeigen nicht den neuen Termin: " + lab.join(", "));
          SESSION = null; }
        // Keine Dauerschleife: heute schon extra Geübtes kommt erst, wenn alle anderen dran waren
        { const keepN = S.settings.extraCards, keepC = JSON.stringify(S.cards); S.settings.extraCards = 2;
          const keys = Object.keys(S.cards); keys.forEach((id, i) => { S.cards[id].isNew = i >= 8; S.cards[id].xp = 0; S.cards[id].last = Date.now() - 2 * DAY; });
          keys.slice(0, 4).forEach(id => (S.cards[id].xp = Date.now())); // 2 Wörter heute schon geübt, 2 noch nicht
          for (let i = 0; i < 4; i++) S.cards[keys[i]].isNew = false;
          const wantWords = new Set(keys.slice(4, 8).map(id => cardParse(id).base));
          S.cards = Object.fromEntries(keys.slice(0, 8).map(id => [id, S.cards[id]]));
          startExtraVocab();
          if (SESSION.extra !== "practice" || SESSION.queue.length !== 2) E("Dauerschleifen-Test: falscher Modus " + SESSION.extra + " " + SESSION.queue.length);
          else if (!SESSION.queue.every(id => wantWords.has(cardParse(id).base))) E("Heute schon extra geübte Wörter kommen vor den anderen");
          else if (SESSION.queue.some(id => (S.cards[id].xp || 0) >= startOfDay())) E("Heute schon extra geübte Wörter kommen sofort wieder");
          // Dauerschleife sichtbar: Schild auf der Karte + Hinweis, wenn alles heute schon geübt ist
          SESSION = null; Object.values(S.cards).forEach(c => { c.xp = Date.now(); c.xpd = todayKey(); c.xpn = 2; });
          if (!/heute schon extra geübt – jetzt kommen Wiederholungen/.test(extraVocabText())) E("Hinweis „alles heute schon geübt“ fehlt");
          startExtraVocab(); if (!/heute schon 2× geübt/.test(document.querySelector("#app").textContent)) E("Schild „heute schon 2× geübt“ fehlt");
          SESSION = null; S.settings.extraCards = keepN; S.cards = JSON.parse(keepC); } }
      SESSION = null; S.cards = JSON.parse(keep); S.settings.extraCards = 10; }
    // Vokabeln „↶ Zurück“: jede Bewertung exakt rückgängig, neue Wahl zählt; auch nach dem Rundenende
    { const ids = Object.keys(S.cards).slice(0, 3);
      ids.forEach(id => Object.assign(S.cards[id], { isNew: false, reps: 2, interval: 4, ease: 2.5, lapses: 0, due: Date.now() - 1000 }));
      const snap = () => JSON.stringify({ c: ids.map(id => S.cards[id]), n: S.daily.newCards, r: S.stats.reviews });
      for (const k of ["again", "hard", "good", "easy"]) {
        SESSION = { kind: "vocab", queue: ids.slice(), done: 0, again: 0, shown: false }; renderCard(); flipCard();
        const before = snap(); rateCard(k);
        if (!document.querySelector('[data-act="cundo"]')) E("Vokabeln: Knopf „↶ Zurück“ fehlt nach Bewertung " + k);
        A.cundo();
        if (snap() !== before || SESSION.queue.join() !== ids.join() || !SESSION.shown || SESSION.hist.length) E("Vokabeln: „Zurück“ stellt den Stand nach „" + k + "“ nicht exakt her");
        rateCard("good");
        if (S.cards[ids[0]].reps !== 3) E("Vokabeln: neue Wahl nach „Zurück“ zählt nicht"); 
        ids.forEach(id => Object.assign(S.cards[id], { isNew: false, reps: 2, interval: 4, ease: 2.5, lapses: 0, due: Date.now() - 1000 }));
      }
      SESSION = { kind: "vocab", queue: ids.slice(0, 1), done: 0, again: 0, shown: false }; renderCard(); flipCard();
      const b2 = snap(); rateCard("easy");
      if (SESSION || !document.querySelector('[data-act="cundo"]')) E("Vokabeln: „Letzte Bewertung ändern“ fehlt am Rundenende");
      else { A.cundo(); if (!SESSION || snap() !== b2) E("Vokabeln: „Zurück“ nach Rundenende stellt nicht her"); }
      SESSION = null; }
    // Rundenende: „Weitere Vokabeln lernen“ startet direkt die nächste Runde mit der eingestellten Anzahl
    { S.settings.extraCards = 15; startExtraVocab(); SESSION.queue = SESSION.queue.slice(0, 1); flipCard(); rateCard("good");
      const btn = document.querySelector('[data-act="extravocab"]');
      if (!btn || !/Weitere Vokabeln lernen/.test(btn.textContent)) E("Rundenende: „Weitere Vokabeln lernen“ fehlt");
      else { btn.click(); const want = Math.min(15, extraNewCards().length || learnedCardIds().length);
        if (!SESSION || SESSION.kind !== "vocab" || SESSION.queue.length !== want) E(`„Weitere Vokabeln lernen“: ${SESSION && SESSION.queue.length} statt ${want} Wörter`); }
      SESSION = null; S.settings.extraCards = 10; }
    // Vokabeln in zwei getrennten Richtungen
    { const keep = JSON.stringify(S.cards), kd = JSON.stringify(S.daily);
      // Umstieg: alter Stand (nur eine Karte je Wort) → Gegenrichtung übernimmt den Stand
      S.cards = { "t01-0": { ease: 2.3, interval: 7, reps: 3, lapses: 1, due: addDays(7), isNew: false, last: Date.now() - 5 * DAY } };
      migrate();
      const r0 = S.cards["t01-0-r"];
      if (!r0 || r0.isNew || r0.interval !== 7 || r0.ease !== 2.3 || r0.due !== addDays(7)) E("Umstieg: Gegenrichtung übernimmt den Stand nicht: " + JSON.stringify(r0));
      if (cardDir("t01-0") !== "fi" || cardDir("t01-0-r") !== "de" || cardWord("t01-0-r")[0] !== cardWord("t01-0")[0]) E("Richtung/Wort der Karten falsch");
      // Deutsch → Finnisch falsch: nur diese Karte fällt zurück, Wiederholung bleibt in dieser Richtung
      const fBefore = JSON.stringify(S.cards["t01-0"]);
      S.cards["t01-0-r"].due = Date.now() - 1000;
      SESSION = { kind: "vocab", queue: ["t01-0-r"], done: 0, again: 0, shown: false }; renderCard();
      if (SESSION.dir !== "de") E("Karte de→fi wird nicht auf Deutsch gefragt");
      flipCard(); rateCard("again");
      if (JSON.stringify(S.cards["t01-0"]) !== fBefore) E("Fehler in de→fi verändert die Karte fi→de");
      if (S.cards["t01-0-r"].lapses !== 2 || SESSION.queue[0] !== "t01-0-r" || SESSION.dir !== "de") E("Wiederholung nach „Nochmal“ nicht in derselben Richtung");
      SESSION = null;
      // Geschwister: am selben Tag nur eine Richtung je Wort
      S.cards["t01-0"].due = Date.now() - 1000; S.cards["t01-0-r"].due = Date.now() - 1000; S.cards["t01-0-r"].last = Date.now() - 3 * DAY; S.cards["t01-0"].last = Date.now() - 3 * DAY;
      if (onePerWord(dueCards()).length !== 1) E("Beide Richtungen eines Wortes in derselben Runde");
      S.cards["t01-0"].last = Date.now();
      if (dueCards().includes("t01-0-r")) E("Gegenrichtung am selben Tag nicht zurückgestellt");
      // Neue Gegenrichtung erst am Tag nach der ersten Richtung
      S.cards = {}; S.daily = { date: todayKey(), newCards: 0, newTopics: 0 }; addCards(T("t01"));
      if (newCardsAvail().some(id => id.endsWith("-r"))) E("Neue Gegenrichtung schon vor der ersten Richtung");
      S.cards["t01-0"].isNew = false; S.cards["t01-0"].last = Date.now();
      if (newCardsAvail().includes("t01-0-r")) E("Neue Gegenrichtung am selben Tag");
      S.cards["t01-0"].last = Date.now() - DAY;
      if (!newCardsAvail().includes("t01-0-r")) E("Neue Gegenrichtung am Folgetag fehlt");
      if (learnedWords() !== 1) E("„Wörter gelernt“ zählt Karten statt Wörter");
      S.cards = JSON.parse(keep); S.daily = JSON.parse(kd); }
    // Vokabelhilfe bei Übersetzungen ins Finnische: Grundformen, Vermerk, Karte de→fi kommt früher
    { const t = TOPICS.find(x => x.ex.some(e => e.t === "tr" && e.dir === "de" && vocabHint(e, x.id).length)), ei = t.ex.findIndex(e => e.t === "tr" && e.dir === "de" && vocabHint(e, t.id).length);
      const ex = t.ex[ei], L = vocabHint(ex, t.id);
      const rid = L[0].id + "-r"; addCards(T(L[0].id.replace(/-\d+$/, "")));
      Object.assign(S.cards[rid], { isNew: false, interval: 10, ease: 2.5, due: addDays(10), hintd: null });
      S.active = { id: t.id, mode: "learn", idxs: [ei], rt: [0], idx: 0, results: [], d: Date.now() }; openSession();
      const link = document.querySelector('[data-act="vhint"]');
      if (!link) E("Vokabelhilfe-Link fehlt bei „" + ex.q + "“");
      else { link.click();
        const box = document.querySelector("#vhint").textContent;
        if (!L.every(e => box.includes(e.fi))) E("Vokabelhilfe zeigt nicht alle Grundformen: " + box);
        if (S.cards[rid].due !== addDays(5) || !(S.cards[rid].ease < 2.5)) E("Vokabelhilfe: Karte de→fi kommt nicht früher");
        if (!(S.vhelp[0] && S.vhelp[0].words.length === L.length)) E("Vokabelhilfe nicht im Bericht vermerkt");
        await solve(ex); nextEx();
        if (!/Mit Vokabelhilfe gelöst/.test(document.querySelector("#app").textContent)) E("Auswertung: Vermerk „mit Vokabelhilfe“ fehlt");
        if (!/VOKABELHILFE genutzt/.test(buildReport())) E("Bericht: Vokabelhilfe fehlt");
        out.info.push("Vokabelhilfe: " + L.map(e => e.fi).join(", ")); }
      SESSION = null; S.active = null;
      // verrät nie die Lösung unverändert
      TOPICS.forEach(x => x.ex.filter(e => e.t === "tr" && e.dir === "de").forEach(e => { const g = new Set(vocabHint(e, x.id).flatMap(v => norm(v.fi).split(" "))); if (g.size && norm(e.a[0]).split(" ").every(w => g.has(w))) E("Vokabelhilfe verrät die Lösung: " + e.q); })); }
    // Wörter antippen: Einzelwort statt Redewendung, Verneinungsformen, Redewendung nur im passenden Satz
    { const g1 = glossLocal("ole", "Emme ole kotona."), g2 = glossLocal("Ole", "Ole hyvä!"), g3 = glossLocal("asu", "Hän ei asu täällä.");
      if (!g1 || g1.base !== "olla" || g1.phrase) E("Antippen: „ole“ in „Emme ole kotona“ nicht als olla erklärt: " + JSON.stringify(g1));
      if (!g2 || !g2.phrase || g2.phrase.fi !== "ole hyvä") E("Antippen: „ole hyvä“ im Satz nicht als Redewendung gezeigt");
      if (!g3 || g3.base !== "asua") E("Antippen: Verneinungsform „asu“ nicht als asua erklärt"); }
    // Vokabeln: eigene Eingabe bleibt nach dem Aufdecken sichtbar (Abweichungen markiert), „Frag …“ auf der Karte
    { addCards(T("t01")); const keepS = SESSION;
      SESSION = { kind: "vocab", queue: ["t01-0"], hist: [], results: [] }; renderCard();
      document.querySelector("#ans").value = "dnakee"; flipCard();
      const t = document.querySelector("#back").textContent;
      if (!/Deine Eingabe: dnakee/.test(t) || !document.querySelector("#back .dx")) E("Vokabeln: eigene Eingabe nach dem Aufdecken fehlt oder ohne Markierung: " + t);
      if (!document.querySelector('#back [data-act="askex"]')) E("Vokabeln: „Frag " + APP.teacher + "“ fehlt auf der Karte");
      SESSION = { kind: "vocab", queue: ["t01-0"], hist: [], results: [] }; renderCard();
      document.querySelector("#ans").value = "danke"; flipCard();
      if (!/Deine Eingabe: danke/.test(document.querySelector("#back").textContent) || document.querySelector("#back .dx")) E("Vokabeln: richtige Eingabe falsch angezeigt");
      if (charDiff("ymärrätko", "ymmärrätkö").replace(/<[^>]+>/g, "") !== "ymärrätko" || !/<b class="dx">o<\/b>$/.test(charDiff("ymärrätko", "ymmärrätkö"))) E("Vokabeln: Buchstabenvergleich falsch");
      // Sonderzeichen-Tasten (Test-Einstellungen: ä, ö) bei Eingaben in der Lernsprache, Klick fügt ein
      SESSION = { kind: "vocab", queue: ["t01-0-r"], hist: [], results: [] }; addCards(T("t01")); renderCard();
      const kb = document.querySelector('#cact [data-ch="ö"]'); if (!kb) E("Sonderzeichen-Tasten fehlen auf der Vokabelkarte (Richtung in die Lernsprache)");
      else { document.querySelector("#ans").focus(); document.querySelector("#ans").value = "k"; kb.click(); if (document.querySelector("#ans").value !== "kö") E("Sonderzeichen-Taste fügt auf der Karte nicht ein"); }
      SESSION = keepS; out.info.push("Vokabeln: eigene Eingabe mit Markierung, „Frag " + APP.teacher + "“ auf der Karte"); }
    // Grundlagen für KI-Übungen: ohne Grundthemen (BASE_TOPICS leer) nie automatisch „sicher“
    { const keepB = BASE_TOPICS.splice(0), keepT = TOPICS; TOPICS = [];
      if (basicsStatus().ok) E("Grundlagen gelten ohne Themen als sicher (KI-Übungen würden zu früh frei)");
      TOPICS = keepT; BASE_TOPICS.push(...keepB);
      if (basicIds().join() !== BASE_TOPICS.map(t => t.id).join()) E("Grundlagen: falsche Themen"); }
    // Einstufungstest (Engine-Funktion, Test-Inhalte mit Mini-Test)
    { const keep = JSON.stringify(S.placement); S.placement = defaultPlacement();
      if (!ptOn()) E("Einstufungstest: nicht aktiv trotz Test-Einstellungen");
      A.tab("today"); if (!document.querySelector('#app [data-act="pt"]')) E("Einstufungstest: Karte unter „Heute“ fehlt");
      A.tab("topics"); if (!document.querySelector('#app .titem[data-act="pt"]')) E("Einstufungstest: Eintrag in der Themenliste fehlt");
      A.pt(); wide("Einstufungstest");
      if (!document.querySelector(".ptabs") || !document.querySelector('[data-act="ptcheck"][data-id="A1"]')) E("Einstufungstest: Ansicht unvollständig");
      const type = (sel, v) => { const f = document.querySelector(sel); if (!f) { E("Einstufungstest: Feld fehlt " + sel); return; } f.focus(); f.value = v; f.dispatchEvent(new Event("input", { bubbles: true })); };
      type('input.pgap[data-pid="A1.1"]', "sprichst"); type('input.pgap[data-pid="A1.2"][data-gi="0"]', "fährt"); type('input.pgap[data-pid="A1.2"][data-gi="1"]', "an");
      if ((S.placement.a["A1.2"] || []).join("|") !== "fährt|an") E("Einstufungstest: Eingabe nicht gespeichert");
      // Sonderzeichen-Taste fügt ins zuletzt benutzte Feld ein
      type('textarea.pline[data-pid="A2.1"]', "Morgen fahre ich nach Linz");
      const key = document.querySelector('[data-ch="ä"]'); if (!key) E("Sonderzeichen-Tasten fehlen"); else { key.click(); if (!/ä$/.test(S.placement.a["A2.1"])) E("Sonderzeichen-Taste fügt nicht ein"); }
      type('textarea.pline[data-pid="A2.1"]', "Morgen fahre ich nach Linz");
      await ptCheckSection("A1"); await ptCheckSection("A2");
      const c1 = S.placement.c["A1.1"], c2 = S.placement.c["A1.2"], c3 = S.placement.c["A2.1"];
      if (!c1 || c1.r !== "ok" || !c2 || c2.r !== "wrong" || (c2.gaps || []).join() !== "true,false" || !c3 || c3.r !== "ok") E("Einstufungstest: lokale Prüfung falsch " + JSON.stringify([c1, c2, c3]));
      if (!document.querySelector('input.pgap[data-pid="A1.1"][readonly]')) E("Einstufungstest: geprüfte Antworten nicht gesperrt");
      if (!/nicht eingerichtet/.test(document.querySelector("#app").textContent)) E("Einstufungstest: Hinweis ohne KI fehlt");
      A.ptpart("B"); wide("Einstufungstest Teil B");
      if (!document.querySelector(".reading")) E("Einstufungstest: Lesetext fehlt");
      document.querySelector('[data-act="ptrf"][data-id="B1.1|richtig"]').click(); await ptCheckSection("B1");
      type('textarea.plong[data-pid="B2.1"]', "Heute lerne ich viel und gehe dann spazieren.");
      if (!/8 Wörter/.test(document.querySelector("#wc-B2-1").textContent)) E("Einstufungstest: Wortzähler falsch");
      await ptCheckSection("B2");
      if ((S.placement.c["B1.1"] || {}).r !== "ok" || (S.placement.c["B2.1"] || {}).r !== "fb") E("Einstufungstest: richtig/falsch oder Text nicht abgegeben");
      // Zusammenführen: geprüfte Antworten gewinnen, nichts geht verloren
      const other = JSON.parse(JSON.stringify(S)); other.placement.c = {}; other.placement.a = { "A2.1": "anders", "A9.9": "neu" }; other.updated = S.updated + 1000;
      const mp = mergeStates(S, other).placement;
      if (!mp.c["A1.1"] || mp.a["A2.1"] !== "Morgen fahre ich nach Linz" || mp.a["A9.9"] !== "neu") E("Einstufungstest: Zusammenführen verliert Antworten " + JSON.stringify(mp.a));
      // Bericht, Import, Abschluss
      const rep = buildReport();
      if (!/EINSTUFUNGSTEST/.test(rep) || !/A1\.2: fährt … an ✗/.test(rep) || !/A1\.1: sprichst ✓/.test(rep)) E("Einstufungstest: Bericht unvollständig");
      const n0 = Object.keys(S.placement.a).length; ptImport(JSON.stringify({ type: "dt-placement", a: { "A1.1": ["x"] }, c: {} }));
      if (Object.keys(S.placement.a).length !== n0 || S.placement.a["A1.1"][0] !== "sprichst") E("Einstufungstest: Import überschreibt geprüfte Antworten");
      { const P0 = JSON.stringify(S.placement);
        S.placement = defaultPlacement(); S.placement.a["A2.1"] = "Morgen ich fahre";
        ptImport(JSON.stringify({ type: "dt-placement", a: { "A1.1": ["sprichst"], "A2.1": "anders" }, c: { "A1.1": { first: ["sprichst"], r: "ok" }, "A2.1": { first: "anders", r: "ok" }, "A1.2": { first: 5, r: "ok" } } }));
        if (!S.placement.c["A1.1"]) E("Einstufungstest: Import übernimmt geprüfte Antworten nicht");
        if (S.placement.c["A2.1"] || S.placement.a["A2.1"] !== "Morgen ich fahre") E("Einstufungstest: Import überschreibt eine getippte Antwort");
        if (S.placement.c["A1.2"]) E("Einstufungstest: Import nimmt falschen Datentyp an");
        S.placement = JSON.parse(P0); }
      // Nach „Fortschritt löschen“: alter Test kommt nicht zurück, ein danach begonnener bleibt
      { const W = Date.now() - 1000, w = JSON.parse(JSON.stringify(S)); w.wiped = W; w.placement = defaultPlacement();
        const o1 = JSON.parse(JSON.stringify(S)); o1.placement.started = W - 5000;
        if (Object.keys(mergeStates(o1, w).placement.a).length) E("Einstufungstest: gelöschter Test kommt von einem alten Gerät zurück");
        const o2 = JSON.parse(JSON.stringify(S)); o2.placement.started = W + 500;
        if (!Object.keys(mergeStates(o2, w).placement.a).length) E("Einstufungstest: nach dem Löschen begonnener Test geht verloren"); }
      const fb = document.createElement("button"); await ptFinish(fb); await ptFinish(fb);
      if (!S.placement.done) E("Einstufungstest: Abschließen klappt nicht");
      if (!hasProgress({ stats: {}, cards: {}, placement: { a: { x: 1 }, c: {} } })) E("Einstufungstest: Antworten zählen nicht als Fortschritt (Sync!)");
      if (!document.querySelector("#app").innerHTML.trim()) E("Einstufungstest: leere Ansicht nach dem Abschluss");
      S.placement = JSON.parse(keep); CUR = { tab: "today", arg: null }; render();
      out.info.push("Einstufungstest: Eingabe, Prüfung, Sperre, Sonderzeichen, Zusammenführen, Bericht, Import, Abschluss"); }
    // Fehler in einer Ansicht: Hinweis mit Rückweg statt kaputter Seite; App bleibt bedienbar
    { const orig = renderTopics; renderTopics = () => { throw new Error("Testfehler"); };
      A.tab("topics"); const t1 = document.querySelector("#app").textContent;
      renderTopics = orig;
      if (!/Fehler in dieser Ansicht/.test(t1) || !/Testfehler/.test(t1)) E("Ansichtsfehler: kein Hinweis");
      document.querySelector('#app [data-act="tab"][data-id="today"]').click();
      if (!/Hyvää|Matthias/.test(document.querySelector("#app").textContent)) E("Ansichtsfehler: Rückweg zu Heute klappt nicht");
      A.__boom = () => { throw new Error("Klickfehler"); }; const bt = document.createElement("button"); bt.dataset.act = "__boom"; document.querySelector("#app").appendChild(bt); bt.click(); delete A.__boom;
      if (!/Klickfehler/.test(document.querySelector("#app").textContent)) E("Fehler beim Antippen: kein Hinweis"); A.tab("today"); }
    // Fehler-Training
    if (!openErrors().length) E("Fehler-Training: keine offenen Fehler");
    startErrors(); let n = 0;
    while (SESSION && SESSION.idx < SESSION.items.length && n++ < 50) { await solve(SESSION.items[SESSION.idx]); nextEx(); }
    if (openErrors().length) E("Fehler-Training: Fehler nicht gelöst");
    { // gelöster Fehler, später wieder falsch → wieder offen; in einer normalen Runde beim ersten Versuch richtig → gelöst
      const e0 = S.errors.find(e => e.ok && e.ei >= 0);
      if (!e0) E("Testannahme: gelöster Fehler fehlt");
      else {
        S.errors.unshift({ ...e0, ok: undefined, d: Date.now() + 1000 });
        if (!openErrors().some(o => o.e.topic === e0.topic && o.e.ei === e0.ei)) E("Fehler-Training: erneut falsch beantwortete Übung bleibt ausgeblendet");
        S.active = { id: e0.topic, mode: "extra", idxs: [e0.ei], rt: [0], idx: 0, results: [], d: Date.now() }; openSession();
        await solve(SESSION.items[0]); SESSION = null; S.active = null;
        if (openErrors().some(o => o.e.topic === e0.topic && o.e.ei === e0.ei)) E("Fehler-Training: in normaler Runde richtig gelöster Fehler bleibt offen");
      } }
    // Unterthemen (E-1007-86): direkt hinter dem Hauptthema, Nummer „1.2“, eingerückt
    { const o = orderTopics(["t01", "t02", "t01c", "t01b", "t09", "t09b", "x5b"].map(id => ({ id }))).map(t => t.id).join();
      if (o !== "t01,t01b,t01c,t02,t09,t09b,x5b") E("Unterthemen: Reihenfolge falsch " + o);
      const keep = S.packs; const base = TOPICS[0], sub = { ...JSON.parse(JSON.stringify(TOPICS[TOPICS.length - 1])), id: base.id + "b", title: "Sim-Unterthema", req: [base.id] };
      S.packs = [...(S.packs || []), sub]; migrate();
      if (TOPICS[1].id !== sub.id || topicNum(TOPICS[1]) !== "1.2" || topicNum(TOPICS[2]) !== "2") E("Unterthemen: Liste/Nummer falsch " + TOPICS.slice(0, 3).map(t => t.id + ":" + topicNum(t)).join(" "));
      A.tab("topics"); const it = document.querySelector(`.titem.sub[data-id="${sub.id}"] .num`); if (!it || it.textContent !== "1.2") E("Unterthemen: Themenliste zeigt Unterthema nicht eingerückt mit „1.2“");
      S.packs = keep; delete S.topics[sub.id]; migrate(); }
    // Übungsauswahl: nie Gesehenes zuerst, nie alles auf einmal, Vielfalt; gemischte Wiederholung; Langzeit-Check
    { const t = TOPICS.find(x => x.ex.length >= 10), keepEx = t.ex.slice(), keepLog = JSON.stringify(S.exLog || {});
      const pool = topicPool(t.id, true);
      pool.slice(1).forEach(c => (S.exLog[exKey(c.src, c.ex)] = { s: Date.now() - DAY, n: 3, w: 0 })); delete S.exLog[exKey(pool[0].src, pool[0].ex)];
      let hit = 0; for (let i = 0; i < 20; i++) if (pickRound(topicPool(t.id, true), 8).some(c => c.src.ei === 0)) hit++;
      if (hit < 20) E("Auswahl: nie gesehene Übung kommt nicht zuverlässig dran (" + hit + "/20)");
      const pr = pickRound(topicPool(t.id, true), 8);
      if (pr.length !== Math.min(8, pool.length) || new Set(pr.map(c => c.ex.t)).size < Math.min(3, new Set(pool.map(c => c.ex.t)).size)) E("Auswahl: falsche Größe oder zu wenig Vielfalt");
      while (t.ex.length < 40) t.ex.push({ ...keepEx[t.ex.findIndex(e => e.t === "gap" || e.t === "tr")], q: "Zusatz " + t.ex.length });
      S.active = null; startSession(t.id, "learn"); const nLearn = SESSION.items.length; SESSION = null; S.active = null;
      startSession(t.id, "review"); const nRev = SESSION.items.length; SESSION = null; S.active = null;
      if (nLearn !== 15 || nRev !== 8) E(`Auswahl: bei 40 Übungen erstes Lernen ${nLearn} (erwartet 15), Wiederholung ${nRev} (erwartet 8)`);
      t.ex.length = 0; t.ex.push(...keepEx); S.exLog = JSON.parse(keepLog); }
    { const L = learningTopics();
      if (L.length < 2) E("Testannahme: mindestens zwei gelernte Themen");
      A.tab("today"); if (!/Gemischte Wiederholung/.test(document.querySelector("#app").textContent)) E("Heute: gemischte Wiederholung fehlt");
      S.mixDay = ""; S.active = null; startMix(); if (S.mixDay) E("Gemischte Wiederholung gilt schon beim Start als erledigt");
      const tids = new Set(S.active.gsrc.map(x => x.tid)), per = {}; S.active.gsrc.forEach(x => (per[x.tid] = (per[x.tid] || 0) + 1));
      if (SESSION.items.length !== Math.min(MIX_N, L.reduce((a, t) => a + Math.min(3, topicPool(t.id, true).length), 0)) || tids.size < 2 || Object.values(per).some(v => v > 3)) E("Gemischte Wiederholung: falsche Auswahl " + JSON.stringify(per));
      const due0 = JSON.stringify(L.map(t => S.topics[t.id].due));
      let n2 = 0; while (SESSION && SESSION.idx < SESSION.items.length && n2++ < 50) { await solve(SESSION.items[SESSION.idx]); nextEx(); }
      if (JSON.stringify(L.map(t => S.topics[t.id].due)) !== due0) E("Gemischte Wiederholung ändert Themenpläne");
      if (S.mixDay !== todayKey() || !/Noch eine Runde/.test(document.querySelector("#app").textContent)) E("Gemischte Wiederholung: Abschluss fehlt");
      // Langzeit-Check: zwei Themen seit 40 Tagen nicht geübt; eines falsch → morgen fällig
      const [a1, a2] = L, keep = JSON.stringify([S.topics[a1.id], S.topics[a2.id]]);
      [a1, a2].forEach(t => { S.topics[t.id].hist = [{ d: Date.now() - 40 * DAY, sc: 90 }]; S.topics[t.id].due = addDays(60);
        for (const k in S.exLog) if (k.startsWith(t.id + ":")) S.exLog[k].s = Date.now() - 40 * DAY; });
      S.longCheck = 0; A.tab("today");
      if (!checkDue() || !/Langzeit-Check/.test(document.querySelector("#app").textContent)) E("Heute: Langzeit-Check fehlt");
      S.active = null; { const b = document.querySelector('[data-act="longcheck"]'); if (!b) E("Heute: Knopf „Langzeit-Check“ fehlt"); else b.click(); }
      if (!SESSION || SESSION.items.length < 2 || SESSION.items.length > 6) E("Langzeit-Check: falsche Anzahl Übungen");
      n2 = 0; while (SESSION && SESSION.idx < SESSION.items.length && n2++ < 50) { const src = srcOf(S.active, SESSION.idx);
        if (src.tid === a1.id && !S.active.rt[SESSION.idx]) dunno(); else await solve(SESSION.items[SESSION.idx]); nextEx(); }
      if (S.topics[a1.id].due !== addDays(1) || S.topics[a2.id].due !== addDays(60)) E("Langzeit-Check: Termine falsch " + [S.topics[a1.id].due, S.topics[a2.id].due].map(d => relDays(d)).join(", "));
      if (checkDue() || !/kommt morgen zur Wiederholung/.test(document.querySelector("#app").textContent)) E("Langzeit-Check: Abschluss/Zeitpunkt falsch");
      [S.topics[a1.id], S.topics[a2.id]] = JSON.parse(keep);
      if (!/ÜBUNGSSAMMLUNG/.test(buildReport()) || !/Langzeit-Check zuletzt: \d/.test(buildReport())) E("Bericht: Übungssammlung fehlt"); }
    // Paket B (E-1007-56 bis -63): Wiederholungsplan
    { const keep = JSON.stringify(S), L = learningTopics(), [a1, a2] = L;
      // Gesamtanalyse: nur vorziehen, Abstand bleibt
      Object.assign(S.topics[a1.id], { due: addDays(10), interval: 10 }); Object.assign(S.topics[a2.id], { due: addDays(3), interval: 5 });
      applyReschedule([{ topicId: a1.id, days: 2 }, { topicId: a2.id, days: 200 }]);
      if (S.topics[a1.id].due !== addDays(2) || S.topics[a1.id].interval !== 10) E("Gesamtanalyse: Vorziehen falsch oder Abstand verändert");
      if (S.topics[a2.id].due !== addDays(3)) E("Gesamtanalyse schiebt ein Thema nach hinten");
      // Lernschritte: mehrfaches „Nochmal“ beim ersten Lernen bzw. am selben Tag zählt höchstens einmal
      const [n1, k1] = Object.keys(S.cards).filter(id => cardWord(id)).slice(0, 2);
      Object.assign(S.cards[n1], { isNew: true, lapses: 0, ease: 2.5, reps: 0, interval: 0, learnDay: undefined, lapseDay: undefined });
      Object.assign(S.cards[k1], { isNew: false, lapses: 0, ease: 2.5, reps: 3, interval: 10, due: Date.now() - 1000, learnDay: "2000-01-01", lapseDay: undefined });
      SESSION = { kind: "vocab", queue: [n1, n1, n1, k1, k1], done: 0, again: 0, shown: true };
      for (let i = 0; i < 5; i++) { SESSION.shown = true; rateCard("again"); if (!SESSION) break; }
      SESSION = null;
      if (S.cards[n1].lapses !== 0 || S.cards[n1].ease !== 2.5) E("Lernschritte: neues Wort wird durch „Nochmal“ abgewertet " + JSON.stringify(S.cards[n1]));
      if (S.cards[k1].lapses !== 1 || Math.abs(S.cards[k1].ease - 2.3) > 1e-9) E("Lernschritte: zweites „Nochmal“ am selben Tag zählt doppelt " + JSON.stringify(S.cards[k1]));
      // Tageslimit für Wiederholungen: Rückstand wird verteilt
      Object.values(S.cards).forEach(c => Object.assign(c, { isNew: false, due: Date.now() - 5 * DAY, interval: 3 }));
      S.settings.maxReviews = 5; S.daily.rev = 0;
      if (dueToday().length !== 5 || dueCards().length <= 5) E("Tageslimit für Wiederholungen greift nicht");
      S.settings.maxReviews = 0; if (dueToday().length !== dueCards().length) E("Ohne Tageslimit fehlen Karten");
      // Extra-Üben: heute schon wiederholt → keine Verlängerung
      { const c = S.cards[k1]; Object.assign(c, { due: addDays(1), interval: 1, last: Date.now(), reps: 3, ease: 2.5 }); const due0 = c.due; practiceRate(c, 4);
        if (c.due !== due0) E("Extra-Üben verlängert am selben Tag"); }
      // Gemischte Runde: schwaches Thema wird vorgezogen
      Object.assign(S.topics[a1.id], { due: addDays(30) });
      const pulled = pullTopics({ [a1.id]: [1, 4] }, 3, 0.5, 3, "Test");
      if (!pulled[0].moved || S.topics[a1.id].due !== addDays(3)) E("Gemischte Runde: schwaches Thema wird nicht vorgezogen");
      // STOCKT: 3 gescheiterte Freischaltversuche → Bericht + Wörter vorab
      S.topics[a1.id].unlockFails = 3;
      if (!/STOCKT[\s\S]*Versuche hintereinander unter 80/.test(buildReport())) E("Bericht: STOCKT fehlt");
      const lk = TOPICS.find(t => t.req.includes(a1.id));
      if (lk) { S.topics[lk.id].status = "locked"; A.topic(lk.id); if (!document.querySelector('[data-act="prevocab"]')) E("Gesperrtes Thema: „Wörter vorab lernen“ fehlt"); }
      // Fehlerliste: offene Fehler gehen beim Kürzen nicht verloren
      const many = Array.from({ length: 120 }, (_, i) => ({ d: 1000 + i, topic: "x", ei: i, q: "q" + i, user: "u", exp: "e", ok: i < 60 ? 1 : undefined }));
      const capped = capErrors(many);
      if (capped.filter(e => !e.ok).length !== 60 || capped.length !== 80) E("Fehlerliste: offene Fehler gehen beim Kürzen verloren");
      S = JSON.parse(keep); SESSION = null; S.active = null; }
    // Paket C (E-1007-64 bis -69): Zuverlässigkeit
    { const keep = JSON.stringify(S);
      const snap = () => JSON.stringify({ ...S, appErr: 0, updated: 0 }), before = snap();
      const ok1 = adoptState(() => ({ topics: {}, cards: null, errors: [null] }), "Test"), after = snap();
      if (ok1 || after !== before) E("Kaputter Stand wird übernommen oder verändert den alten " + ok1 + " " + [...before].findIndex((ch, i) => ch !== after[i]) + " " + after.slice([...before].findIndex((ch, i) => ch !== after[i]) - 40, [...before].findIndex((ch, i) => ch !== after[i]) + 60));
      if (!(S.appErr || []).some(x => x.w === "Test")) E("Kaputter Stand nicht im Fehlerprotokoll");
      let threw = false; try { replaceState({ app: "andere-app", topics: {}, cards: {} }); } catch (e) { threw = /anderen App/.test(e.message); }
      if (!threw || S.app !== APP.id) E("Daten einer anderen App werden übernommen");
      if (sameApp({ app: "x" }) || !sameApp({}) || !sameApp({ app: APP.id })) E("App-Kennung falsch geprüft");
      const a = JSON.parse(keep), b = JSON.parse(keep);
      a.settings.newCardsPerDay = 40; a.settingsAt = 200; b.settings.newCardsPerDay = 5; b.settingsAt = 100;
      if (mergeStates(b, a).settings.newCardsPerDay !== 40 || mergeStates(a, b).settings.newCardsPerDay !== 40) E("Abgleich: neuere Einstellungen gehen verloren");
      const raw = JSON.stringify({ aktuell: keep, hinweis: "x" }); S.stats.sessions = -1; importText(raw);
      if (S.stats.sessions === -1) E("Rohdaten-Datei lässt sich nicht einspielen");
      CFG.aiDown = {}; aiDownMark("m-x", "timeout"); if (!(CFG.aiDown["m-x"] > Date.now())) E("Zeitüberschreitung: Modell wird nicht zurückgestellt");
      S = JSON.parse(keep); }
    // E-1007-78: Übungsprotokoll einmalig nachtragen (vor dem Stichtag geübte Themen, nur damalige Übungen)
    { const t = learningTopics()[0], keepA = APP.exSeenBefore, keepL = JSON.stringify(S.exLog), keepH = JSON.stringify(S.topics[t.id].hist), keepF = S.exLogSeed;
      APP.exSeenBefore = { at: Date.now() - 5 * DAY, n: { [t.id]: 3 } };
      S.topics[t.id].hist = [{ d: Date.now() - 9 * DAY, sc: 80 }, ...S.topics[t.id].hist];
      for (const k in S.exLog) if (k.startsWith(t.id + ":")) delete S.exLog[k];
      S.exLog[t.id + ":1"] = { s: 1, n: 7, w: 2 }; S.exLogSeed = 0; seedExLog();
      const L = S.exLog;
      if (!L[t.id + ":0"] || L[t.id + ":0"].s !== Date.now() - 9 * DAY - (Date.now() - 9 * DAY - S.topics[t.id].hist[0].d) || L[t.id + ":1"].n !== 7 || L[t.id + ":3"] || !S.exLogSeed) E("Übungsprotokoll-Nachtrag falsch " + JSON.stringify([L[t.id + ":0"], L[t.id + ":1"], L[t.id + ":3"]]));
      delete L[t.id + ":0"]; seedExLog(); if (L[t.id + ":0"]) E("Übungsprotokoll-Nachtrag läuft mehrfach");
      APP.exSeenBefore = keepA; S.exLog = JSON.parse(keepL); S.topics[t.id].hist = JSON.parse(keepH); S.exLogSeed = keepF; }
    // Bericht-Ergänzungen (E-1007-28 bis -35)
    { const t = learningTopics()[0], k = t.id + ":0", keep = JSON.stringify(S.exLog[k] || null);
      S.exLog[k] = { s: Date.now(), n: 5, w: 4 };
      const rep = buildReport();
      if (!/App-Version: .* \| KI: .* \| Geräte mit Daten: \d/.test(rep)) E("Bericht: Kopfzeile mit Version/KI/Geräten fehlt");
      if (!/Aktivität: an \d+ von 14 Tagen gelernt .*Rückstand: \d+ Karten und \d+ Themen fällig .*neue Wörter\/Tag/.test(rep)) E("Bericht: Aktivität/Rückstand/Einstellungen fehlen");
      if (!new RegExp("SCHWIERIGE ÜBUNGEN[^\\n]*\\n- \\[" + k + "\\][^\\n]*4 von 5 falsch").test(rep)) E("Bericht: schwierige Übungen fehlen");
      if (!/WEITERE RUNDEN:[\s\S]*Langzeit-Checks: [^\n]*%[\s\S]*Gemischte Wiederholungen: [^\n]*%/.test(rep)) E("Bericht: Ergebnisse von Langzeit-Check/gemischter Wiederholung fehlen");
      if (/LETZTE FEHLER/.test(rep) && !/LETZTE FEHLER:\n- [^\n]*– (offen|✓ gelöst)/.test(rep)) E("Bericht: Fehler ohne Status offen/gelöst");
      if (/✓ gelöst/.test(progressSummary())) E("Gesamtanalyse bekommt gelöste Fehler (E-1007-77)");
      S.exLog[k] = JSON.parse(keep); if (!S.exLog[k]) delete S.exLog[k];
      // E-1007-35: Grundthema mit 1 Wiederholung, aber oft richtig in anderen Runden, gilt als gefestigt
      const b = BASE_TOPICS[0].id, kb = JSON.stringify(S.topics[b]), kl = JSON.stringify(S.exLog);
      Object.assign(S.topics[b], { status: "learning", last: 0.9, reps: 1 });
      for (const kk in S.exLog) if (kk.startsWith(b + ":")) delete S.exLog[kk];
      if (basicSolid(b)) E("Grundlagen: ohne Belege schon gefestigt");
      for (let i = 0; i < 4; i++) S.exLog[b + ":" + i] = { s: Date.now(), n: 3, w: 0 };
      if (!basicSolid(b)) E("Grundlagen: oft richtig in anderen Runden zählt nicht");
      S.topics[b] = JSON.parse(kb); S.exLog = JSON.parse(kl); }
    // Fehlerprotokoll und Nutzung im Bericht, Abgleich
    { appErrLog("Test", new Error("Probe")); appErrLog("Test", new Error("Probe"));
      if ((S.appErr || []).filter(x => x.m === "Probe").length !== 1) E("Fehlerprotokoll: doppelt oder fehlt");
      const rep = buildReport();
      if (!/APP-FEHLER \(letzte 30 Tage, \d+\):[\s\S]*Test: Probe/.test(rep)) E("Bericht: APP-FEHLER fehlt");
      if (!/NUTZUNG \(Antippen je Funktion[^\n]*tab \d+/.test(rep)) E("Bericht: Nutzung fehlt");
      const o = JSON.parse(JSON.stringify(S)); o.appErr = [{ d: 5, dev: "x", w: "y", m: "z" }]; o.usage = { fremd: { mix: 4 } };
      o.exLog = { "zz:1": { s: 9, n: 2, w: 1 } };
      const M = mergeStates(S, o);
      if (!M.appErr.some(x => x.m === "z") || !M.appErr.some(x => x.m === "Probe") || M.usage.fremd.mix !== 4 || !M.usage[devId()] || !M.exLog["zz:1"]) E("Abgleich verliert Fehlerprotokoll, Nutzung oder Übungsprotokoll"); }
    // Vokabeln
    startVocab(); n = 0;
    while (SESSION && SESSION.kind === "vocab" && n++ < 2000) { const w = cardWord(SESSION.queue[0]); document.querySelector("#ans").value = SESSION.dir === "fi" ? w[1] : w[0]; flipCard(); rateCard("good"); }
    if (SESSION) E("Vokabeln: Runde endet nicht"); out.info.push(S.stats.reviews + " Vokabeln wiederholt");
    // Hörtraining
    startListen(); n = 0;
    while (SESSION && SESSION.kind === "listen" && SESSION.idx < SESSION.queue.length && n++ < 50) { document.querySelector("#ans").value = cardWord(SESSION.queue[SESSION.idx])[0]; checkListen(); A.lnext(); }
    if (SESSION) E("Hörtraining endet nicht");
    if (!/Hörtraining: Wörter \d+\/\d+ richtig, Sätze \d+\/\d+ richtig/.test(buildReport())) E("Bericht: Hörtraining fehlt");
    startListenS(); n = 0;
    while (SESSION && SESSION.kind === "listenS" && SESSION.idx < SESSION.queue.length && n++ < 50) { document.querySelector("#ans").value = SESSION.queue[SESSION.idx].de[0]; await checkListenS(false); A.lsnext(); }
    for (const tab of ["today", "topics", "vocab", "progress", "settings"]) { A.tab(tab); await wait(30); wide(tab + " (nach dem Lernen)"); }
    A.tab("vocab"); CUR.allWords = true; render(); { const tx = document.querySelector("#app").textContent; if (/\blernt ·|fi→de lernt|de→fi lernt/.test(tx) || !tx.includes("frisch = Abstand unter 4 Tagen")) E("Vokabelliste: alte Begriffe oder Legende fehlt"); }
    // Sicherung: exportieren und wieder laden
    const before = JSON.stringify(S.cards); S = JSON.parse(JSON.stringify(S)); migrate(); if (JSON.stringify(S.cards) !== before) E("Sicherung: Karten ändern sich beim Neuladen");
    return out;
  });
  r.info.forEach(i => ok(i));
  r.err.forEach(fail);
  page.errs.forEach(e => fail("JS-Fehler in der App: " + e));
  if (!r.err.length && !page.errs.length) ok("App-Durchlauf: alle Themen, Fehler-Training, Vokabeln, Hörtraining, Ansichten (390 px)");
  await page.context().close();

  Object.assign(P, { page, r });
}
