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
      if (JSON.stringify(SPRACHEN.de.loose) !== '[["ß","ss"]]') E.push("Deutsch: Umlaut-Toleranz nicht abgeschaltet");
      // E-1008-6: mehrere richtige Wortstellungen
      { const ox = { t: "ord", w: ["Annan", "siskolle", "lahjan"], a: ["Annan lahjan siskolle.", "Annan siskolle lahjan."], de: "x" };
        if (!FMT.ord.valid(ox) || !localCheck("annan siskolle lahjan", ordSols(ox), true).correct || ordFull(ox) !== "Annan lahjan siskolle.") E.push("Satz ordnen: zweite Wortstellung nicht erkannt"); }
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
      return E;
    });
    if (!r.length) ok("Gesamtanalyse erst nach dem Start-Abgleich, Speicher-Warnung, Lektionen zuerst geopfert (S-1008-15, E-1008-28)");
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
