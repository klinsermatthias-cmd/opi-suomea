/* Prüfskript – inhalte.mjs (S-1008-102): Teil 6 – echte Inhalte dieser App (tools/test-* gelten hier nicht): alle Themen und Lektionen, Musterlösungen,
   Antippen, Einstufungstest, Wortprüfung für neue/geänderte Themen (S-1008-73).
   Aufgerufen von tools/pruefen.mjs; gemeinsame Werte und Ergebnisse früherer Teile stehen im Objekt P. */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

export default async function inhalte(P) {
  const { ok, fail, warn, newWordsCheck, REAL, ids, CHANGED, device, r, b } = P;
  /* ---------- 6. Inhalte dieser App: echte Einstellungen, Grundthemen und Lektionen ---------- */
  P.MODE = "app";
  { const ap = await device({ setupDone: true }, null, null, REAL.id);
    const r6 = await ap.evaluate(async () => {
      const out = { err: [], info: [] }, E = m => out.err.push(m);
      const wait = ms => new Promise(r => setTimeout(r, ms));
      const wide = name => { if (document.documentElement.scrollWidth > 392) E(`${name}: zu breit für 390 px (${document.documentElement.scrollWidth} px)`); };
      await loadRepoLessons();
      const raw = await (await fetch("lektionen/lektionen.json", { cache: "no-store" })).json();
      raw.forEach(t => { if (!validTopic(JSON.parse(JSON.stringify(t)))) E(`${t.id}: ungültig (Pflichtfelder oder fehlerhafte Übung/Vokabel)`); if (!T(t.id)) E(`${t.id}: nicht geladen`); });
      BASE_TOPICS.forEach(t => { if (!validTopic(JSON.parse(JSON.stringify(t)))) E(`${t.id}: ungültig`); });
      for (const tab of ["today", "topics", "vocab", "progress", "settings"]) { A.tab(tab); await wait(20); if (!document.querySelector("#app").innerHTML.trim()) E("Leere Ansicht: " + tab); wide(tab); }
      // Jede Übung jedes Themas mit der Musterlösung lösen (lokal, ohne KI)
      const solve = async ex => { if (!fillModel(ex, E)) await checkAnswer(); };
      let solved = 0;
      for (const t of TOPICS) {
        S.topics[t.id].status = "learning"; S.topics[t.id].vocabDone = Date.now(); addCards(t);
        A.topic(t.id); await wait(5); if (!document.querySelector("#app").innerHTML.trim()) E(t.id + ": Themenseite leer"); wide(t.id);
        startSession(t.id, "learn"); let n = 0;
        while (SESSION && SESSION.idx < SESSION.items.length && n++ < 300) {
          const ex = SESSION.items[SESSION.idx]; await solve(ex); solved++;
          const fb = document.querySelector("#fb .fb"); if (!fb || !fb.classList.contains("ok")) E(`${t.id}: Musterlösung wird nicht akzeptiert: ${JSON.stringify(ex).slice(0, 160)}`);
          wide(t.id + " Übung"); nextEx();
        }
        SESSION = null; S.active = null;
      }
      out.info.push(`${TOPICS.length} Themen dieser App, ${solved} Übungen mit Musterlösung gelöst`);
      // Wörter antippen: jedes Wort der Grundthemen ohne KI erklärbar, bei Lektionen nur Hinweis
      {
      const words = t => String(t).match(/[A-Za-zÄÖÅäöå][A-Za-zÄÖÅäöå'’-]+/g) || [];
      const fin = (ex) => ex.t === "gap" ? [ex.q, expectedText(ex)] : ex.t === "ord" || (ex.t === "tr" && ex.dir === "de") ? [expectedText(ex)] : ex.t === "tr" ? [ex.q] : [];
      const miss = {};
      TOPICS.forEach(t => { const base = BASE_TOPICS.some(x => x.id === t.id);
        t.v.forEach(([fi]) => words(fi.replace(/\(.*?\)/g, "")).forEach(w => { if (!glossLocal(w)) (miss[t.id] = miss[t.id] || new Set()).add(w); }));
        t.ex.forEach(ex => fin(ex).forEach(tx => words(tx).forEach(w => { const g = glossLocal(w, tx); if (!g) (miss[t.id] = miss[t.id] || new Set()).add(w); else if (/^\(in:/.test(g.de)) E("Antippen: Teil einer Redewendung als Bedeutung: " + w); }))); });
      Object.keys(miss).forEach(id => { const m = [...miss[id]].join(", "); if (BASE_TOPICS.some(x => x.id === id)) E("Antippen: ohne Bedeutung in " + id + ": " + m); else out.info.push("Antippen: nur über KI erklärt in " + id + ": " + m); });
      }
      // Einstufungstest dieser App
      if (ptOn()) {
        const ids = ptAll().map(x => x.id); if (new Set(ids).size !== ids.length) E("Einstufungstest: Aufgaben-IDs doppelt");
        ptAll().forEach(({ id, item }) => {
          const g = item.k === "b" ? localGrade(item, item.s.map(x => x.split("|")[0] || "–")) : item.k === "r" && !item.m ? localGrade(item, item.s[0]) : item.k === "rf" ? localGrade(item, item.s) : null;
          if (g && g.res !== "ok") E(`Einstufungstest ${id}: Musterlösung wird lokal nicht als richtig erkannt`);
          if (item.k === "w" && !(item.min && item.max)) E(`Einstufungstest ${id}: Wortanzahl (min/max) fehlt`);
        });
        const keep = JSON.stringify(S.placement);
        for (const p of PT) { A.pt(); A.ptpart(p.id); await wait(5); wide("Einstufungstest Teil " + p.id); }
        S.placement = JSON.parse(keep);
        out.info.push(`Einstufungstest: ${ids.length} Aufgaben, Musterlösungen und Ansicht (390 px) in Ordnung`);
      }
      return out;
    });
    r6.info.forEach(i => ok(i)); r6.err.forEach(fail); ap.errs.forEach(e => fail("Inhalte: Fehler im Browser: " + e));
    { const alle = process.env.WORTCHECK === "alle", ids = alle ? null : CHANGED;
      if (alle || ids.length) {
        const nw = await ap.evaluate(newWordsCheck, { ids, extra: null });
        nw.forEach(m => warn(m));
        if (!nw.length) ok(`Wörter der Übungen stehen in früheren Wortlisten (${alle ? "alle Themen" : "neue/geänderte: " + ids.join(", ")})`);
      } }
    if (!r6.err.length && !ap.errs.length) ok("Inhalte dieser App (" + REAL.name + "): alle Themen und Lektionen in Ordnung"); }
}
