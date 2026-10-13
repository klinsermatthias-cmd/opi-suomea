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
      if (c("Meine Bruder sind groß", "Meine Brüder sind groß", { t: "tr", dir: "de" }).correct) E.push("Umlaut-Fehler als richtig gewertet");
      const ss = c("gross", "groß", { t: "gap", q: "Er ist ___." });
      if (!ss.correct || !ss.note) E.push("ß/ss nicht als „fast richtig“");
      const h = c("ich habe hunger", "Ich habe Hunger", { t: "tr", dir: "de" });
      if (h.correct || !h.caseOnly) E.push("kleingeschriebenes Nomen als richtig gewertet");
      if (!c("ich habe Hunger", "Ich habe Hunger", { t: "tr", dir: "de" }).correct) E.push("Satzanfang klein nicht erlaubt");
      if (c("hunger", "Hunger", { t: "gap", q: "Ich habe ___." }).correct) E.push("Lücke: Nomen klein als richtig");
      if (!c("sie", "Sie", { t: "gap", q: "___ sind sehr nett." }).correct) E.push("Lücke am Satzanfang: Großschreibung verlangt");
      if (c("können sie mir helfen", "Können Sie mir helfen?", { t: "tr", dir: "de" }).correct) E.push("„sie“ statt „Sie“ als richtig gewertet");
      if (c("brüder", "Brüder", { t: "tab" }).correct) E.push("Tabelle: Nomen klein als richtig");
      if (!/Groß-\/Kleinschreibung zählt/.test(JUDGE_RULES(false))) E.push("KI-Regel zur Großschreibung fehlt");
      /* S-1013-9: ae/oe/ue fast richtig (a statt ä bleibt falsch), zuhause = zu Hause, englische Kurzformen, freistehender Strich, Kartenwort ohne (Pl.) und Einzahl allein */
      { const ue = c("schoen", "schön", { t: "gap", q: "Das ist ___." }); if (!ue.correct || !ue.note) E.push("ae/oe/ue nicht als „fast richtig“"); }
      if (c("schon", "schön", { t: "gap", q: "Das ist ___." }).correct) E.push("o statt ö als richtig gewertet");
      if (!c("Ich bin zuhause.", "Ich bin zu Hause.", { t: "tr", dir: "de" }).correct || c("ich bin zu hause", "Ich bin zu Hause.", { t: "tr", dir: "de" }).correct) E.push("zuhause/zu Hause");
      if (!localCheck("I am not tired", ["I'm not tired."], false, null, true).correct || !localCheck("What's this?", ["What is this?"], false, null, true).correct || localCheck("I was tired", ["I'm tired."], false, null, true).correct) E.push("englische Kurzformen");
      if (!localCheck("Ja, gerne", ["Ja – gerne!"], false).correct || localCheck("U Bahn", ["U-Bahn"], false).correct) E.push("Gedankenstrich/Bindestrich");
      if (!localCheck("die Kopfschmerzen", targetAcc("die Kopfschmerzen (Pl.)"), false).correct || !localCheck("der Markt", targetAcc("der Markt, die Märkte"), false).correct || localCheck("die Märkte", targetAcc("der Markt, die Märkte"), false).correct) E.push("Kartenwort: (Pl.) oder Einzahl allein");
      /* S-1013-7: Tabellen – ganzer Satz und Fragewort am Satzanfang frei, Groß/klein-Alternativen greifen; Gegenprobe: Nomen bleiben streng */
      if (!c("heute bleibe ich zu Hause.", "Heute bleibe ich zu Hause.", { t: "tab" }).correct) E.push("Tabelle: Satz mit kleinem Satzanfang falsch");
      if (c("heute bleibe ich zu hause.", "Heute bleibe ich zu Hause.", { t: "tab" }).correct) E.push("Tabelle: Satz mit kleinem Nomen richtig");
      if (!c("wem", "Wem", { t: "tab" }).correct) E.push("Tabelle: Fragewort klein falsch");
      if (c("dativ", "Dativ", { t: "tab" }).correct) E.push("Tabelle: Fachwort (Nomen) klein richtig");
      if (!localCheck("Welcher", ["welcher", "Welcher"], false, { t: "tab" }).correct || !localCheck("welcher", ["welcher", "Welcher"], false, { t: "tab" }).correct) E.push("Groß/klein-Alternative greift nicht");
      if (localCheck("sie", ["Sie", "Ihnen"], false, { t: "tab" }).correct) E.push("Tabelle: „sie“ statt „Sie“ richtig");
      /* S-1012-125: Satz ordnen – klein angezeigter erster Baustein (Name ohne Vokabel) in anderer Wortstellung */
      { const ex = { t: "ord", w: ["Zorbas", "kommt", "heute"], a: ["Zorbas kommt heute", "Heute kommt Zorbas"], de: "Zorbas kommt heute." }, se = {};
        ordRender(ex, se); se.cur.picked = ["heute", "kommt", "zorbas"].map(w => se.cur.chips.indexOf(w));
        const keep = textCheck; let got = ""; textCheck = (s, e, u) => (got = u);
        try { FMT.ord.check(se, ex); } finally { textCheck = keep; }
        if (got !== "heute kommt Zorbas") E.push("Satz ordnen: kleingeschriebener erster Baustein in anderer Stellung (" + got + ")"); }
      /* S-1012-102: Nomen-Karten mit Artikel/Plural – Einzelwort und Plural antippbar */
      const vf = SP.vocabForms("der Markt, die Märkte").map(x => x[0]).join();
      if (vf !== "Markt,Märkte" || SP.vocabForms("das Wochenende").map(x => x[0]).join() !== "Wochenende" || SP.vocabForms("wandern").length) E.push("Nomen-Karten: Einzelwort/Plural nicht erkannt (" + vf + ")");
      /* S-1012-122: Antwort auf Englisch (dir "fi") – Großschreibregel gilt nicht, auch nicht im KI-Auftrag */
      if (!c("unfortunately i have to go on monday", "Unfortunately I have to go on Monday.", { t: "tr", dir: "fi" }).correct) E.push("englische Antwort: Kleinschreibung als Fehler");
      if (/Groß-\/Kleinschreibung zählt/.test(JUDGE_RULES(false, baseAnswer({ t: "tr", dir: "fi" })))) E.push("KI-Regel zur Großschreibung auch bei englischer Antwort");
      const it = { t: "Ich habe ___. ___ ist nett.", s: ["Hunger", "Sie"] };
      if (gapOk(it, 0, "hunger") || !gapOk(it, 0, "Hunger") || !gapOk(it, 1, "sie")) E.push("Einstufungstest: Groß-/Kleinschreibung");
      return E;
    });
    if (!r.length && !g.errs.length) ok("Deutsch als Lernsprache: Umlaute, ß, Groß-/Kleinschreibung, Einstufungstest (E-1008-9)");
    else fail("Deutsch als Lernsprache: " + [...r, ...g.errs].join("; "));
    await g.context().close(); }
  P.MODE = "engine";

}
