/* Prüfskript – ki.mjs (S-1008-102): KI mit simuliertem Gemini: KI-Protokoll, Token, „KI lag falsch?“, Schwächen nach Thema, freies Üben, Modell-Ausweiche,
   KI-Aufträge und KI-Übungen.
   Aufgerufen von tools/pruefen.mjs; gemeinsame Werte und Ergebnisse früherer Teile stehen im Objekt P. */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

export default async function ki(P) {
  const { ok, fail, browser, device, r, a, b, h, k, kept } = P;
  // KI-Protokoll mit simuliertem Gemini: Einträge, Token, „KI lag falsch?“, Bericht, Sync
  { const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); const aiBodies = []; let verdicts = {};
    await ctx.route("**/lektionen/ki-pruefung.json*", r => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(verdicts) }));
    await ctx.addInitScript(() => { if (!localStorage.getItem("opi-suomea-config")) localStorage.setItem("opi-suomea-config", JSON.stringify({ setupDone: true, ai: { provider: "gemini", key: "test" } })); });
    const aiUrls = []; let failFlash = false;
    await ctx.route("https://generativelanguage.googleapis.com/**", route => {
      const body = route.request().postData() || ""; aiBodies.push(body); aiUrls.push(route.request().url());
      if (failFlash && route.request().url().includes("/gemini-flash-latest:")) return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: { message: "overloaded" } }) });
      const text = body.includes("kurze Schreibaufgabe") ? '{"task":"Schreib, wo du wohnst.","words":["asua"],"sample":"Asun Linzissä."}'
        : body.includes("Korrigiere den Text wie") ? '{"correct":false,"corrected":"Asun Linzissä.","errors":[{"wrong":"Asut","right":"Asun","why":"minä-Form"}],"feedback":"Fast richtig.","topics":["t04","t99 Unsinn"]}'
        : body.includes("Starte ein kurzes Rollenspiel") ? '{"scene":"Im Café","role":"Kellnerin","goal":"Kaffee bestellen","opener":"Hei! Mitä saisi olla?","opener_tr":"Hallo! Was darf es sein?"}'
        : body.includes("Neue Antwort von") ? '{"ok":false,"fix":"Yksi kahvi, kiitos.","note":"Mit kiitos ist es höflicher.","reply":"Selvä. Muuta?","reply_tr":"Gut. Noch etwas?","end":false}'
        : body.includes("Ziel erreicht? Was war gut?") ? '{"goal":true,"summary":"Gut bestellt.","tips":["Höflich mit kiitos"]}'
        : body.includes("Erstelle 7 NEUE") ? JSON.stringify({ ex: [
          { t: "gap", q: "Minä ___ väsynyt.", h: "olla – passende Form einsetzen", a: ["olen"] },
          { t: "tr", dir: "de", q: "Wir sind zu Hause.", a: ["Olemme kotona", "Me olemme kotona"] },
          { t: "mc", q: "Wofür steht „on“?", o: ["er/sie ist", "ich bin", "wir sind"], a: 0, x: "hän on" } ] })
        : body.includes("intervalDays") ? '{"feedback":"Gut gemacht.","tips":["Weiter so"],"intervalDays":3,"reason":"solide"}'
        : body.includes("Vokabelkarte") ? '{"correct":true,"feedback":"Passt."}'
        : '{"correct":false,"feedback":"Endung falsch.","correction":"olen"}';
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }], usageMetadata: { promptTokenCount: 120, candidatesTokenCount: 30, thoughtsTokenCount: 10 } }) });
    });
    const g = await device(null, ctx);
    const r = await g.evaluate(async () => {
      const E = []; S.topics.t04.status = "new"; startSession("t04", "learn"); let n = 0, judged = false;
      while (!judged && SESSION.idx < SESSION.items.length && n++ < 100) {
        const ex = SESSION.items[SESSION.idx];
        if (ex.t === "gap" || ex.t === "tr") { document.querySelector("#ans").value = ex.t === "gap" ? ex.a[0] + "q" : "zzz"; await checkAnswer(); judged = true;
          const fl = document.querySelector("#fb .aiflag"); if (!fl) E.push("„KI lag falsch?“ fehlt nach KI-Prüfung"); else fl.click(); }
        else { SESSION.idx++; renderEx(); }
      }
      SESSION.idx = SESSION.items.length - 1; nextEx();
      await rateTopic("good");
      if (!document.querySelector("#ratebox .aiflag")) E.push("„KI lag falsch?“ fehlt bei der Rundenauswertung");
      await vocabJudge(["talo", "Haus"], "fi", "Gebäude");
      const kinds = [...new Set(S.aiAudit.map(e => e.k))].sort().join(",");
      if (kinds !== "auswertung,pruefung,vokabel") E.push("Protokoll-Arten: " + kinds);
      // E-1007-77: 100 % beim ersten Versuch + „Gut“ → keine Rundenauswertung durch die KI
      { const nA = () => S.aiAudit.filter(e => e.k === "auswertung").length, n0 = nA(); S.active = null; startSession("t04", "review"); let m = 0;
        while (SESSION && SESSION.idx < SESSION.items.length && m++ < 100) { if (!fillModel(SESSION.items[SESSION.idx], x => E.push(x))) await checkAnswer(); nextEx(); }
        if (SESSION && SESSION.score === 1) { await rateTopic("good"); if (nA() !== n0) E.push("Rundenauswertung trotz 100 % und „Gut“ (E-1007-77)"); }
        else E.push("Testannahme: Runde mit Musterlösungen nicht 100 %"); }
      const pr = S.aiAudit.find(e => e.k === "pruefung");
      if (!pr || !pr.flag || pr.tok.join("/") !== "120/30/10" || !pr.m) E.push("Prüfungs-Eintrag unvollständig: " + JSON.stringify(pr));
      // „Frag Opettaja“ in der Übung: vor dem Prüfen nur Hinweise (Anweisung im Prompt), Eintrag im Protokoll
      S.active = { id: "t06", mode: "learn", idxs: [0], rt: [0], idx: 0, results: [], d: Date.now() }; openSession();
      document.querySelector('[data-act="askex"]').click(); document.querySelector("#askexq").value = "Warum diese Endung?";
      window.__lastAiBody = null; await askExercise();
      if (!document.querySelector("#askexres .teacher")) E("Frag Opettaja (Übung): keine Antwort angezeigt");
      if (!document.querySelector("#askexres .aiflag")) E("Frag Opettaja (Übung): „KI lag falsch?“ fehlt");
      const fq = S.aiAudit.find(e => e.k === "frage");
      if (!fq || !/vor dem Prüfen/.test(fq.q)) E("Frag Opettaja (Übung): Protokolleintrag fehlt");
      dunno(); document.querySelector("#askexq").value = "Und jetzt?"; await askExercise();
      SESSION = null; S.active = null;
      // „Frag Opettaja“ auf der Vokabelkarte
      addCards(T("t01")); SESSION = { kind: "vocab", queue: ["t01-0"], hist: [], results: [] }; renderCard(); flipCard();
      document.querySelector('#back [data-act="askex"]').click(); document.querySelector("#askexq").value = "Merkhilfe für kiitos?"; await askExercise();
      if (!document.querySelector("#askexres .teacher")) E("Frag Opettaja (Vokabel): keine Antwort angezeigt");
      if (!S.aiAudit.some(e => e.k === "frage" && /Vokabel kiitos/.test(e.q))) E("Frag Opettaja (Vokabel): Protokolleintrag fehlt");
      SESSION = null;
      // Freies Schreiben und Rollenspiel (simulierte KI)
      { S.topics.t04.status = "learning"; S.topics.t04.last = 0.5; A.topic("t04");
        if (document.querySelector('[data-act="pwrite"]') || !/sobald das Thema sitzt/.test(document.querySelector("#app").textContent)) E.push("Schreiben/Rollenspiel: vor 80 % nicht gesperrt");
        await startWrite("t04"); if (SESSION) E.push("Schreiben: startet vor 80 %");
        S.topics.t04.last = 0.85; A.topic("t04");
        if (!document.querySelector('[data-act="pwrite"]') || !document.querySelector('[data-act="pchat"]')) E.push("Themenseite: Schreiben/Rollenspiel fehlt");
        await startWrite("t04");
        if (!/wo du wohnst/.test(document.querySelector("#app").textContent)) E.push("Schreiben: Aufgabe fehlt");
        document.querySelector("#ans").value = "Asut Linzissä."; await checkWrite();
        if (!document.querySelector(".perr") || !/Asun Linzissä/.test(document.querySelector("#fb").textContent)) E.push("Schreiben: Korrektur fehlt");
        S.topics.t01.status = "learning";
        const ctx = practiceContext(T("t04"));
        if (!/WORTLISTE/.test(ctx) || !ctx.includes(T("t01").v[0][0] + " = ") || !ctx.includes(T("t04").v[0][0] + " = ")) E.push("Rollenspiel: Wortliste ohne Wörter des Themas und seiner Voraussetzungen");
        // E-1007-77: nur Thema + Voraussetzungen; Korrektur ohne Wortliste, Rollenspiel-Antworten ohne Theorie
        { const near = knownWords(T("t04")), other = TOPICS.find(x => x.v.length && !near.some(k => k.startsWith(x.v[0][0] + " = ")));
          S.topics[other.id].status = "learning";
          if (practiceContext(T("t04")).includes(other.v[0][0] + " = ")) E.push("Rollenspiel: Wortliste enthält fremde Themen (E-1007-77)");
          if (!knownWords(T("t04"), true).includes(other.v[0][0] + " = " + other.v[0][1])) E.push("Neue Übungen: volle Wortliste fehlt");
          if (/WORTLISTE/.test(practiceContext(T("t04"), { words: false })) || /Theorie/.test(practiceContext(T("t04"), { theory: false }))) E.push("practiceContext: Wortliste/Theorie lässt sich nicht weglassen"); }
        if (!/NUR Wörter aus der WORTLISTE/.test(WORD_RULE)) E.push("Rollenspiel: Regel „nur bekannte Wörter“ fehlt");
        const nw = practiceNew([{ fi: "haluta", de: "wollen" }]);
        if (nw.length !== 1 || !glossLocal("haluta") || glossLocal("haluta").de !== "wollen") E.push("Rollenspiel: neues Wort nicht zum Antippen gemerkt");
        if (!/Neu: <b>haluta/.test(newWordsHTML(nw))) E.push("Rollenspiel: neues Wort wird nicht angezeigt");
        await startChat("t04");
        if (!/Mitä saisi olla/.test(document.querySelector(".chat").textContent)) E.push("Rollenspiel: erste Zeile fehlt");
        document.querySelector("#chatin").value = "Kahvi"; await sendChat();
        if (!document.querySelector(".cfix") || !/Muuta/.test(document.querySelector(".chat").textContent)) E.push("Rollenspiel: Korrektur oder Antwort fehlt");
        SESSION.busy = true; await endChat();
        if (SESSION.ended || !SESSION.endAfter) E.push("Rollenspiel: Beenden während einer laufenden Antwort nicht abgefangen");
        SESSION.busy = false; SESSION.endAfter = false;
        await endChat();
        if (SESSION) E.push("Rollenspiel: Runde nach dem Ende nicht abgeschlossen (Abgleich bliebe gesperrt)");
        if (!/Gut bestellt/.test(document.querySelector("#app").textContent)) E.push("Rollenspiel: Rückmeldung fehlt");
        if ((S.practice || []).length !== 2 || !/FREIES SCHREIBEN & ROLLENSPIEL/.test(buildReport())) E.push("Schreiben/Rollenspiel: nicht im Bericht");
        if (!S.aiAudit.some(e => e.k === "schreiben") || !S.aiAudit.some(e => e.k === "rollenspiel")) E.push("Schreiben/Rollenspiel: nicht im KI-Protokoll");
        // Schwächen nach Thema (E-1007-6): KI-Zuordnung gemerkt (nur gültige, gelernte Themen), im Protokoll, Bericht, Abgleich
        if (!(S.weak || []).some(x => x.k === "schreiben" && x.g.join() === "t04")) E.push("Schwächen: Zuordnung beim Schreiben nicht gemerkt " + JSON.stringify(S.weak));
                if (!S.aiAudit.some(e => e.k === "schreiben" && /Themen: t04/.test(e.r))) E.push("Schwächen: Zuordnung fehlt im KI-Protokoll");
        if (!/SCHWÄCHEN NACH THEMA/.test(buildReport()) || !/t04 [^\n]*1× \(Schreiben 1\)/.test(buildReport())) E.push("Schwächen: Abschnitt im Bericht fehlt");
        if (!/SCHWÄCHEN NACH THEMA/.test(progressSummary())) E.push("Schwächen: fehlen in der Gesamtanalyse");
        { const o = JSON.parse(JSON.stringify(S)); o.weak = [{ d: 7, k: "dialog", tid: "t04", g: ["t04"], aid: "x" }];
          if (mergeStates(S, o).weak.length !== S.weak.length + 1) E.push("Schwächen: Abgleich verliert Einträge"); }
        const other = JSON.parse(JSON.stringify(S)); other.practice = [{ d: 5, k: "s", tid: "t04", task: "x", text: "y" }];
        if (mergeStates(S, other).practice.length !== 3) E.push("Schreiben/Rollenspiel: Abgleich verliert Einträge");
        SESSION = null;
        // zweites Rollenspiel: bisherige Szene geht als „schon gestellt“ mit (Prüfung des Prompts außerhalb)
        if (!practiceRecent("t04", "r").includes("Im Café") || !practiceRecent("t04", "s").includes("Schreib, wo du wohnst.")) E.push("Abwechslung: bisherige Aufgaben fehlen " + JSON.stringify(practiceRecent("t04", "r")));
        await startChat("t04"); SESSION = null;
        // Mehrere Dialog-Varianten im Thema: pro Runde nur eine, der Reihe nach
        { const t = TOPICS.find(x => x.ex.some(e => e.t === "dlg")), keepEx = t.ex.slice(), s = S.topics[t.id], keepH = s.hist, keepSt = s.status;
          if (s.status === "locked") s.status = "new"; /* gesperrte Themen lassen sich nicht lernen (E-1008-1) */
          const d0 = t.ex.findIndex(e => e.t === "dlg"); t.ex.push({ ...t.ex[d0], q: "Variante 2" });
          const seen = [];
          for (const h of [[], [{ sc: 90 }]]) { s.hist = h; S.active = null; startSession(t.id, "learn");
            const d = SESSION.items.filter(e => e.t === "dlg"); seen.push(d.map(e => e.q).join("|")); SESSION = null; S.active = null; }
          if (seen.some(x => x.includes("|")) || seen[0] === seen[1]) E.push("Dialog-Varianten wechseln sich nicht ab: " + JSON.stringify(seen));
          t.ex.length = 0; t.ex.push(...keepEx); s.hist = keepH; s.status = keepSt; }
        // Aufgaben von Claude: feste Lese-/Schreib-/Dialogaufgaben aus gelernten Themen
        { const t = TOPICS.find(x => x.ex.some(e => e.t === "dlg")); S.topics[t.id].status = "learning"; S.active = null;
          A.topic(t.id); const b = document.querySelector('[data-act="pfixed"]');
          if (!b) E.push("Aufgaben von Claude: Knopf fehlt"); else b.click();
          if (!SESSION || !SESSION.items.length || !SESSION.items.every(x => ["les", "sch", "dlg"].includes(x.t))) E.push("Aufgaben von Claude: falsche Übungen");
          else { const ex = SESSION.items[0], src = srcOf(S.active, 0);
            if (T(src.tid).ex[src.ei] !== ex) E.push("Aufgaben von Claude: Herkunft der Übung falsch"); }
          SESSION = null; S.active = null; } }
      // Schreibaufgabe und Dialog in Themen: eigene Arten im KI-Protokoll, Statistik je Übungsart, Gesamtanalyse-Daten
      { const t = TOPICS.find(x => x.ex.some(e => e.t === "sch")); S.topics[t.id].status = "learning"; S.topics[t.id].vocabDone = 1;
        for (const k of ["sch", "dlg"]) { const ei = t.ex.findIndex(e => e.t === k);
          S.active = { id: t.id, mode: "extra", idxs: [ei], rt: [0], idx: 0, results: [], d: Date.now() }; openSession();
          if (k === "sch") document.querySelector("#ans").value = "Kahvi ja pulla."; else document.querySelectorAll(".dcell").forEach(i => (i.value = "Kahvi"));
          await checkAnswer(); SESSION = null; S.active = null; }
        if (!S.aiAudit.some(e => e.k === "schreibaufgabe") || !S.aiAudit.some(e => e.k === "dialog")) E.push("KI-Protokoll: Schreibaufgabe/Dialog ohne eigene Art");
        const st = exStatsTotal();
        if (!st.sch || st.sch.ai !== 1 || !st.dlg || st.dlg.ai !== 1) E.push("Statistik je Übungsart: KI-Prüfung nicht gezählt " + JSON.stringify(st));
        const ps = progressSummary();
        if (!/ÜBUNGSARTEN/.test(ps) || !/Schreibaufgabe: 0\/1/.test(ps) || !/FREIES SCHREIBEN & ROLLENSPIEL/.test(ps)) E.push("Gesamtanalyse: neue Formate fehlen im Lernstand");
        if (!/Schreibaufgabe \(Prüfung\)/.test(buildReport()) || !/Dialog \(Prüfung\)/.test(buildReport())) E.push("Bericht: KI-Protokoll ohne Schreibaufgabe/Dialog");
        const o2 = JSON.parse(JSON.stringify(S)); o2.exStats = { fremd: { tr: { n: 3, ok: 2, ai: 1, aiOk: 0 } } };
        const M2 = mergeStates(S, o2); if (!M2.exStats.fremd || !M2.exStats[devId()]) E.push("Abgleich verliert die Statistik je Übungsart"); }
      const rep = buildReport();
      if (!/KI-PROTOKOLL/.test(rep) || !/Antwortprüfung: 1 \(0\) \| 120\/30\/10/.test(rep) || !/⚑/.test(rep)) E.push("Bericht ohne korrektes KI-Protokoll:\n" + rep.slice(rep.indexOf("KI-PROTOKOLL"), rep.indexOf("KI-PROTOKOLL") + 400));
      // Sync: Markierung und Gerätezähler bleiben beim Zusammenführen erhalten
      const other = JSON.parse(JSON.stringify(S)); other.aiAudit.forEach(e => (e.flag = false)); other.aiStats = { fremd: { since: 1, k: { wort: { n: 2, err: 0, i: 50, o: 5, t: 0, ms: 900, m: {} } } } };
      const M = mergeStates(S, other);
      if (!M.aiAudit.find(e => e.id === pr.id).flag) E.push("Sync verliert die Markierung");
      if (!M.aiStats.fremd || !M.aiStats[devId()]) E.push("Sync verliert Gerätezähler");
      return { E, rep };
    });
    r.E.forEach(fail); g.errs.forEach(e => fail("JS-Fehler im KI-Protokoll: " + e));
    // KI-Übungen: Schild „ungeprüft“, Hinweis am Ende, Karte auf Heute, Bericht, Urteil von Claude → ✓/✗, Fehler gestrichen
    const gr = await g.evaluate(async () => {
      const E = []; S.genUnlock = { on: true, d: Date.now() }; S.topics.t04.status = "learning"; SESSION = null; S.active = null;
      A.topic("t04"); await startGen("t04");
      // E-1007-15: erzeugt, aber nicht sofort geübt; nicht in Runden, solange Claude nicht geprüft hat
      if (SESSION || S.active) E.push("KI-Übungen: werden vor Claudes Prüfung schon geübt");
      if (genStock("t04") !== 3 || approvedGen("t04").length) E.push("KI-Übungen: Vorrat/Prüfstatus falsch " + genStock("t04"));
      if (topicPool("t04", true).some(c => c.ex.gid)) E.push("KI-Übungen: ungeprüfte Übung in der Auswahl");
      // ältere, pausierte KI-Runde (frühere App-Version) läuft weiter
      { const set = S.genReview[0], ex = JSON.parse(JSON.stringify(set.ex));
        S.active = { id: "t04", mode: "gen", genSet: set.id, title: "x", gen: ex, gsrc: ex.map(() => ({ tid: "t04", ei: -1 })), idxs: ex.map((_, i) => i), rt: ex.map(() => 0), idx: 0, results: [], d: Date.now() }; openSession(); }
      if (!/noch nicht von Claude geprüft/.test(document.querySelector("#app").textContent)) E.push("KI-Übung: Schild „ungeprüft“ fehlt");
      dunno(); SESSION.idx = SESSION.items.length - 1; nextEx();
      if (!/Diese Übungen hat Opettaja erzeugt/.test(document.querySelector("#app").textContent)) E.push("KI-Runde: Hinweis zur Prüfung am Ende fehlt");
      A.tab("today"); if (!/3 KI-Übungen warten auf Claude/.test(document.querySelector("#app").textContent)) E.push("Heute: Karte „warten auf Prüfung“ fehlt");
      const gids = S.genReview[0].ex.map(e => e.gid);
      if (!buildReport().includes(gids[0]) || !/KI-ÜBUNGEN ZUR PRÜFUNG \(3/.test(buildReport())) E.push("Bericht: KI-Übungen zur Prüfung fehlen");
      if (!openErrors().some(o => o.ex.gid === gids[0])) E.push("Testannahme: Fehler aus KI-Übung im Fehler-Training");
      return { E, gids };
    });
    gr.E.forEach(fail);
    { const kb = aiBodies.find(b => b.includes("Korrigiere den Text wie"));
      if (!kb || !kb.includes("THEMEN (gelernte Grammatikthemen)") || !kb.includes("t04 ") || !kb.includes('\\"topics\\"')) fail("Schwächen: Themenliste oder Feld „topics“ fehlt im Prüfauftrag");
      else ok("Schwächen nach Thema: KI-Zuordnung im Prüfauftrag, gemerkt, im KI-Protokoll, Bericht und Abgleich"); }
    { const rp = aiBodies.filter(b => b.includes("Starte ein kurzes Rollenspiel"));
      if (rp.length < 2 || !rp[rp.length - 1].includes("SCHON GESTELLT") || !rp[rp.length - 1].includes("Im Café") || !/"temperature":0\.7/.test(rp[rp.length - 1])) fail("Abwechslung: Rollenspiel-Auftrag ohne bisherige Szenen oder höhere Temperatur");
      else if (!rp[0].includes("ABWECHSLUNG: Nutze davon")) fail("Abwechslung: Pflichtwörter fehlen");
      else if (aiBodies.some(b => b.includes("Bewerte jede markierte ZEILE") && !/"temperature":0\.3/.test(b))) fail("Prüfen muss bei niedriger Temperatur bleiben");
      else ok("Freies Üben: Abwechslung (bisherige Aufgaben, Pflichtwörter, Temperatur), Freischaltung ab 80 %, Aufgaben von Claude"); }
    verdicts = { [gr.gids[0]]: { ok: false, korrektur: "Minä olen väsynyt.", grund: "Test" }, [gr.gids[1]]: { ok: true } };
    const gv = await g.evaluate(async gids => {
      const E = []; await loadGenVerdicts();
      if (openErrors().some(o => o.ex.gid === gids[0])) E.push("Fehler aus fehlerhafter KI-Übung bleibt im Fehler-Training");
      if (genUnreviewed().length !== 1) E.push("Nach dem Urteil: falsche Zahl ungeprüfter Übungen " + genUnreviewed().length);
      A.topic("t04"); const tx = document.querySelector("#app").textContent;
      if (!/1 ✓ korrekt/.test(tx) || !/1 ✗ fehlerhaft/.test(tx)) E.push("Themenseite: Prüfergebnis fehlt");
      const other = JSON.parse(JSON.stringify(S)); other.genReview.forEach(x => (x.v = {}));
      if (!mergeStates(other, S).genReview[0].v[gids[0]]) E.push("Sync verliert Claudes Urteil");
      // E-1007-14: geprüfte (✓) KI-Übung kommt in die Auswahl, fehlerhafte (✗) nie; übernommene (gleiche gid in der Lektion) nicht doppelt
      if (!approvedGen("t04").some(e => e.gid === gids[1]) || approvedGen("t04").some(e => e.gid === gids[0])) E.push("Geprüfte KI-Übungen: falsche Auswahl");
      { let seen = false; for (let i = 0; i < 30 && !seen; i++) seen = pickRound(topicPool("t04", true), 8).some(c => c.ex.gid === gids[1]);
        if (!seen) E.push("Geprüfte KI-Übung kommt nie in eine Wiederholung"); }
      // geprüfte Sätze fallen nie aus der Sammlung (auch bei vielen neuen Sätzen), übernommene dürfen wegfallen
      { const many = Array.from({ length: 40 }, (_, i) => ({ id: "z" + i, d: Date.now() + i, topic: "t04", ex: [{ t: "gap", q: "x" + i, a: ["y"], gid: "z" + i + "-0" }], res: {}, v: { ["z" + i + "-0"]: { ok: true } } }));
        const kept = genReviewCap([...S.genReview, ...many]);
        if (!kept.some(x => x.ex.some(e => e.gid === gids[1])) || !kept.some(x => x.id === "z0")) E.push("Geprüfte KI-Übungen fallen aus der Sammlung"); }
      { const t = T("t04"); t.ex.push({ ...approvedGen("t04")[0] }); if (approvedGen("t04").some(e => e.gid === gids[1])) E.push("In die Lektion übernommene KI-Übung kommt doppelt"); t.ex.pop(); }
      return E;
    }, gr.gids);
    gv.forEach(fail);
    // E-1007-38: Ausweiche nur vorübergehend – eingestelltes Modell bleibt, ausgefallenes wird 15 Min. übersprungen
    { failFlash = true; aiUrls.length = 0;
      const r1 = await g.evaluate(async () => { CFG.ai.model = "gemini-flash-latest"; CFG.aiDown = {}; await vocabJudge(["talo", "Haus"], "fi", "Bau" + Math.random());
        return { model: CFG.ai.model, down: Object.keys(CFG.aiDown || {}), m: S.aiAudit[0].m }; });
      const tried1 = aiUrls.map(u => u.split("/models/")[1].split(":")[0]);
      aiUrls.length = 0;
      await g.evaluate(async () => { await vocabJudge(["talo", "Haus"], "fi", "Bau" + Math.random()); });
      const tried2 = aiUrls.map(u => u.split("/models/")[1].split(":")[0]);
      failFlash = false; aiUrls.length = 0;
      await g.evaluate(async () => { CFG.aiDown["gemini-flash-latest"] = Date.now() - 1; await vocabJudge(["talo", "Haus"], "fi", "Bau" + Math.random()); });
      const tried3 = aiUrls.map(u => u.split("/models/")[1].split(":")[0]);
      if (r1.model !== "gemini-flash-latest") fail("Modell-Ausweiche ändert das eingestellte Modell: " + r1.model);
      else if (!r1.down.includes("gemini-flash-latest") || !/\(Ausweiche\)/.test(r1.m)) fail("Modell-Ausweiche: ausgefallenes Modell nicht vermerkt " + JSON.stringify(r1));
      else if (tried2[0] === "gemini-flash-latest") fail("Modell-Ausweiche: ausgefallenes Modell wird sofort wieder versucht " + tried2.join(","));
      else if (tried3[0] !== "gemini-flash-latest") fail("Modell-Ausweiche: nach der Pause nicht zurück zum besten Modell " + tried3.join(","));
      else ok("KI-Modell: Ausweiche nur vorübergehend, eingestelltes Modell bleibt, Ausweiche im Protokoll markiert");
      if (!tried1.length) fail("Testannahme: keine KI-Anfrage"); }
    // Paket A (E-1007-50 bis -55)
    { aiUrls.length = 0; failFlash = true;
      const r = await g.evaluate(async () => { const E = []; CFG.aiDown = {};
        const t = TOPICS.find(x => x.ex.some(e => e.t === "gap")), ei = t.ex.findIndex(e => e.t === "gap"), ex = t.ex[ei];
        S.active = { id: t.id, mode: "extra", idxs: [ei], rt: [0], idx: 0, results: [], d: Date.now() }; openSession();
        document.querySelector("#ans").value = ex.a[0] + "q"; await checkAnswer();
        const e0 = S.errors[0], fb = document.querySelector("#fb").textContent;
        if (!e0 || e0.exp !== expectedText(ex)) E.push("Fehlerliste: Musterlösung ersetzt durch KI-Korrektur " + JSON.stringify(e0));
        if (!/Richtig ist:/.test(fb) || !fb.includes(expectedText(ex))) E.push("Rückmeldung zeigt nicht die Musterlösung");
        if (e0 && e0.fix && !/schlägt vor/.test(fb)) E.push("KI-Vorschlag nicht als solcher gekennzeichnet");
        SESSION = null; S.active = null;
        // weit entfernte Lücken-Eingabe: keine KI
        const n0 = S.aiAudit.length; S.active = { id: t.id, mode: "extra", idxs: [ei], rt: [0], idx: 0, results: [], d: Date.now() }; openSession();
        document.querySelector("#ans").value = "xyzxyz"; await checkAnswer(); SESSION = null; S.active = null;
        if (S.aiAudit.length !== n0) E.push("KI-Prüfung bei offensichtlich falscher Lücken-Eingabe");
        // Theorie-Auszug bevorzugt Regel-Kästen
        const tt = { th: '<p>Situation: lange Einleitung ' + "x".repeat(300) + '</p><p class="tip">Tipp ' + "y".repeat(300) + '</p><p class="rule">REGEL: en, et, ei</p>' };
        if (!theoryText(tt, 120).includes("REGEL: en, et, ei")) E.push("Theorie-Auszug ohne Regel-Kasten");
        return E; });
      const tried = aiUrls.map(u => u.split("/models/")[1].split(":")[0]);
      failFlash = false;
      r.forEach(fail);
      if (tried.some(m => /lite/.test(m))) fail("Antwortprüfung nutzt Lite-Modell als Ausweiche: " + tried.join(","));
      const jb = aiBodies.filter(b => b.includes("Aufgabentyp: Lückentext")).pop() || "";
      if (!jb.includes("In die Lücke gehört") || !jb.includes("Bewertungsregeln") || !jb.includes("weggelassenes Personalpronomen ist richtig") || !jb.includes("Begründung nur, wenn die Antwort falsch ist")) fail("Antwortprüfung: Lücken-Kontext oder Bewertungsregeln fehlen");
      if (!r.length && !tried.some(m => /lite/.test(m))) ok("Keine Fehler lernen: Musterlösung bleibt Lösung, KI-Vorschlag gekennzeichnet, keine KI bei klar falscher Lücke, kein Lite-Modell, Regeln und Lücken-Kontext im Auftrag"); }
    // E-1007-39/40/41: Regeln in den Aufträgen
    { const sb = aiBodies.find(b => b.includes("kurze Schreibaufgabe")), kb = aiBodies.find(b => b.includes("Korrigiere den Text wie")),
        jb = aiBodies.find(b => b.includes("Aufgabentyp: Lückentext") || b.includes("Aufgabentyp: Übersetzung")), rb = aiBodies.find(b => b.includes("Starte ein kurzes Rollenspiel"));
      if (!sb || !sb.includes("VORBILDER") || !sb.includes("Du-Form")) fail("Freies Schreiben: Vorbilder oder Du-Form fehlen im Auftrag");
      else if (!aiBodies.some(b => b.includes("Prüfe streng als") && b.includes("Asun Linzissä"))) fail("Freies Schreiben: Muster wird nicht gegengeprüft");
      else if (!kb || !/erfinde keine Regeln/i.test(kb) || !kb.includes("konkreten Unterschied")) fail("Freies Schreiben: Korrekturregeln fehlen");
      else if (!jb || !jb.includes("konkreten Unterschied")) fail("Antwortprüfung: Regel für genaue Begründung fehlt");
      else if (!rb || !rb.includes("passt genau zur Szene")) fail("Rollenspiel: Regel für den Einstieg fehlt");
      else if (!aiBodies.some(b => b.includes("intervalDays") && b.includes("Theorie des Themas (Auszug") && b.includes("konkreten Unterschied"))) fail("Rundenauswertung: Theorie-Auszug oder Begründungsregel fehlt");
      else ok("KI-Aufträge: Du-Form, Vorbilder, Muster-Gegenprüfung, genaue Begründungen (auch Rundenauswertung), passender Rollenspiel-Einstieg"); }
    // Claude ändert sein Urteil: „fehlerhaft“ → „korrekt“ – der Fehler kommt wieder ins Fehler-Training, auch nach dem Abgleich
    verdicts = { ...verdicts, [gr.gids[0]]: { ok: true } };
    const gc = await g.evaluate(async gids => {
      const E = [], old = JSON.parse(JSON.stringify(S)); await loadGenVerdicts();
      if (!S.genReview[0].v[gids[0]].ok) E.push("Geändertes Urteil von Claude wird nicht übernommen");
      if (!openErrors().some(o => o.ex.gid === gids[0])) E.push("Urteil auf korrekt geändert: Fehler kommt nicht zurück");
      { const keep = S; S = mergeStates(S, old); const r = openErrors().some(o => o.ex.gid === gids[0]); S = keep;
        if (!r) E.push("Wieder geöffneter Fehler geht beim Abgleich verloren"); }
      // Abgleich: Tageszähler vom jüngeren Tag, Runden seit der Gesamtanalyse vom Gerät mit der jüngsten Analyse
      { const a = JSON.parse(JSON.stringify(S)), b = JSON.parse(JSON.stringify(S));
        a.daily = { date: todayKey(), newCards: 12, newTopics: 1, newRev: 3 }; b.daily = { date: "2000-01-01", newCards: 0, newTopics: 0, newRev: 0 };
        a.exToday = { d: todayKey(), k: ["t04:1"] }; b.exToday = { d: "2000-01-01", k: [] };
        a.lastGlobal = 100; a.sinceGlobal = 2; b.lastGlobal = 200; b.sinceGlobal = 0;
        const m1 = mergeStates(a, b), m2 = mergeStates(b, a);
        if (m1.daily.newCards !== 12 || m2.daily.newCards !== 12) E.push("Abgleich setzt die heutigen neuen Wörter zurück");
        if (!m1.exToday.k.includes("t04:1") || !m2.exToday.k.includes("t04:1")) E.push("Abgleich vergisst heute gelöste Übungen");
        if (m1.sinceGlobal !== 0 || m2.sinceGlobal !== 0) E.push("Abgleich: Zähler seit der Gesamtanalyse vom falschen Gerät"); }
      { const id = Object.keys(S.cards).find(i => cardWord(i) && !cardParse(i).rev), keep = JSON.stringify(S.cards[id]);
        Object.assign(S.cards[id], { isNew: false, lapses: 3, reps: 0, ease: 2.2 });
        if (/: [^\n]*\b0 Problemwörter/.test(progressSummary(true).split("\n").find(l => l.includes("Problemwörter")) || "")) E.push("Bericht zählt Problemwörter nicht");
        S.cards[id] = JSON.parse(keep); }
      return E;
    }, gr.gids);
    gc.forEach(fail); gv.push(...gc);
    if (!gr.E.length && !gv.length) ok("KI-Übungen: Prüfhinweis, Bericht, Urteil von Claude (✓/✗), Fehler gestrichen, Sync");
    if (!aiBodies.some(b => b.includes("Warum diese Endung?") && b.includes("NOCH NICHT beantwortet") && b.includes("Verrate die Lösung NICHT"))) fail("Frag Opettaja (Übung): Hinweis-Anweisung vor dem Prüfen fehlt im Prompt");
    if (!aiBodies.some(b => b.includes("Und jetzt?") && b.includes("schon beantwortet") && !b.includes("Verrate die Lösung NICHT"))) fail("Frag Opettaja (Übung): nach dem Prüfen keine volle Erklärung");
    if (!r.E.length) ok("KI-Protokoll: Einträge, Token, „KI lag falsch?“, Bericht und Sync");
    await ctx.close(); }

}
