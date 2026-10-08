/* Prüfskript – sprachen.mjs (S-1008-102): Alter Deutsch-Trainer-Stand und Deutsch als Lernsprache (E-1008-9, Test-App tools/test-app-de.js).
   Aufgerufen von tools/pruefen.mjs; gemeinsame Werte und Ergebnisse früherer Teile stehen im Objekt P. */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

export default async function sprachen(P) {
  const { ok, fail, device, r, a, h, k } = P;
  // Alter Stand des Deutsch-Trainers (vor der gemeinsamen Engine): Karten -de/-en und Einstufungstest bleiben erhalten
  { const card = (iv, l) => ({ ease: 2.5, interval: iv, reps: 2, lapses: l, due: Date.now() + 86400000, isNew: false, last: 1 });
    const old = { v: 2, created: 1, updated: 5, topics: {}, cards: { "t01-0-de": card(3, 0), "t01-0-en": card(1, 1) }, errors: [], reports: [], daily: { date: "x", newCards: 0, newTopics: 0 }, stats: { streak: 0, last: null, reviews: 3, sessions: 1 }, settings: { newCardsPerDay: 16, newTopicsPerDay: 2, ai: true, slow: false, autoplay: true, theme: "auto" }, lastGlobal: 0, sinceGlobal: 0, active: null, lastBackup: 0, packs: [], placement: { a: { "A1.1": ["sprichst"] }, u: { "A1.2": true }, c: {}, part: "A", started: 1, done: false, doneAt: 0, analysis: null } };
    const m = await device({ setupDone: true }, null, JSON.stringify(old));
    const res = await m.evaluate(() => ({ c: Object.keys(S.cards).filter(k => k.startsWith("t01-0")).sort().join(), iv: S.cards["t01-0"] && S.cards["t01-0"].interval, ivr: S.cards["t01-0-r"] && S.cards["t01-0-r"].interval, pa: S.placement.a["A1.1"], pu: S.placement.u["A1.2"], n: S.settings.newCardsPerDay }));
    if (res.c === "t01-0,t01-0-r" && res.iv === 3 && res.ivr === 1 && res.pa && res.pa[0] === "sprichst" && res.pu && res.n === 16) ok("Alter Deutsch-Trainer-Stand: Karten, Einstellungen und Einstufungstest übernommen");
    else fail("Alter Deutsch-Trainer-Stand: " + JSON.stringify(res)); }

  // E-1008-9: Deutsch als Lernsprache – Sprachmodul, Umlaute, Groß-/Kleinschreibung, Einstufungstest
  P.MODE = "de";
  { const g = await device({ setupDone: true }, null, null, "deutsch-test");
    const r = await g.evaluate(() => {
      const E = [], c = (u, a, ex) => localCheck(u, [a], exStrict(ex), ex);
      if (SP !== SPRACHEN.de) E.push("Sprachmodul nicht Deutsch");
      if (c("Meine Bruder sind groß", "Meine Brüder sind groß", { t: "tr" }).correct) E.push("Umlaut-Fehler als richtig gewertet");
      const ss = c("gross", "groß", { t: "gap", q: "Er ist ___." });
      if (!ss.correct || !ss.note) E.push("ß/ss nicht als „fast richtig“");
      const h = c("ich habe hunger", "Ich habe Hunger", { t: "tr" });
      if (h.correct || !h.caseOnly) E.push("kleingeschriebenes Nomen als richtig gewertet");
      if (!c("ich habe Hunger", "Ich habe Hunger", { t: "tr" }).correct) E.push("Satzanfang klein nicht erlaubt");
      if (c("hunger", "Hunger", { t: "gap", q: "Ich habe ___." }).correct) E.push("Lücke: Nomen klein als richtig");
      if (!c("sie", "Sie", { t: "gap", q: "___ sind sehr nett." }).correct) E.push("Lücke am Satzanfang: Großschreibung verlangt");
      if (c("können sie mir helfen", "Können Sie mir helfen?", { t: "tr" }).correct) E.push("„sie“ statt „Sie“ als richtig gewertet");
      if (c("brüder", "Brüder", { t: "tab" }).correct) E.push("Tabelle: Nomen klein als richtig");
      if (!/Groß-\/Kleinschreibung zählt/.test(JUDGE_RULES(false))) E.push("KI-Regel zur Großschreibung fehlt");
      const it = { t: "Ich habe ___. ___ ist nett.", s: ["Hunger", "Sie"] };
      if (gapOk(it, 0, "hunger") || !gapOk(it, 0, "Hunger") || !gapOk(it, 1, "sie")) E.push("Einstufungstest: Groß-/Kleinschreibung");
      return E;
    });
    if (!r.length && !g.errs.length) ok("Deutsch als Lernsprache: Umlaute, ß, Groß-/Kleinschreibung, Einstufungstest (E-1008-9)");
    else fail("Deutsch als Lernsprache: " + [...r, ...g.errs].join("; "));
    await g.context().close(); }
  P.MODE = "engine";

}
