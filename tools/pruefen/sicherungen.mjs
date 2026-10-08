/* Prüfskript – sicherungen.mjs (S-1008-102): Neue Version, Notfall-Version, Fortschritt löschen und wiederherstellen, Thema zurücksetzen.
   Aufgerufen von tools/pruefen.mjs; gemeinsame Werte und Ergebnisse früherer Teile stehen im Objekt P. */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";

export default async function sicherungen(P) {
  const { ok, fail, browser, device, r } = P;
  // Neue Version veröffentlicht → Hinweis „Neue Version verfügbar“ mit Neuladen
  { const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); let ver = "v1";
    await ctx.addInitScript(() => localStorage.setItem("opi-suomea-config", JSON.stringify({ setupDone: true })));
    await ctx.route("**/version.json*", r => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ v: ver }) }));
    const pg = await device(null, ctx);
    await pg.evaluate(() => checkVersion());
    const before = await pg.locator("#update").count();
    ver = "v2"; await pg.evaluate(() => checkVersion());
    const after = await pg.locator("#update").count();
    if (before === 0 && after === 1) ok("Neue Version: Hinweis zum Neuladen erscheint"); else fail(`Versionshinweis: vorher ${before}, nachher ${after}`);
    await ctx.close(); }
  // Notfall-Version: eine einzige Datei, die ohne Server und ohne Internet startet
  { const nf = await device({ setupDone: true });
    const single = await nf.evaluate(() => buildOfflineHTML());
    await nf.context().close();

    const tmp = path.join(fs.mkdtempSync("/tmp/opi-"), "notfall.html"); fs.writeFileSync(tmp, single);
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, offline: true });
    await ctx.addInitScript(() => localStorage.setItem("opi-suomea-config", JSON.stringify({ setupDone: true })));
    const pg = await ctx.newPage(); const errs = []; pg.on("pageerror", e => errs.push(e.message));
    await pg.goto("file://" + tmp); await pg.waitForTimeout(600);
    if (await pg.evaluate(() => document.querySelectorAll("script[src],link[rel=stylesheet]").length)) fail("Notfall-Version lädt noch externe Dateien");
    const okNf = await pg.evaluate(() => typeof BASE_TOPICS !== "undefined" && TOPICS.length > BASE_TOPICS.length /* Lektionen eingebettet, E-1008-7 */ && document.querySelector("#app").innerText.length > 50 && getComputedStyle(document.querySelector("nav.tabs")).position !== "static");
    if (okNf && !errs.length) ok(`Notfall-Version: eine Datei (${Math.round(single.length / 1024)} KB), startet offline mit Design`); else fail("Notfall-Version startet nicht: " + errs.join("; "));
    await ctx.close(); }
  // Fortschritt löschen: Eintipp-Bestätigung, Sicherungsdatei, Wiederherstellen (auch nach Neuladen); Thema zurücksetzen
  { const d = await device({ setupDone: true });
    const prep = await d.evaluate(() => { ["t01", "t02"].forEach(id => { const s = S.topics[id]; s.status = "learning"; s.last = 0.9; s.reps = 2; s.due = addDays(3); s.hist = [{ d: Date.now(), sc: 90 }]; addCards(T(id)); });
      Object.values(S.cards).forEach(c => { c.isNew = false; c.reps = 2; c.interval = 4; c.due = addDays(4); c.last = Date.now(); }); S.stats.sessions = 3; save(); refreshUnlocks(); A.tab("settings");
      return { cards: Object.keys(S.cards).length, json: JSON.stringify({ t: S.topics, c: S.cards }) }; });
    await d.click('[data-act="reset"]');
    const go = d.locator("#delgo");
    if (!(await go.isDisabled())) fail("Löschen: Knopf ohne Bestätigung aktiv");
    await d.fill("#delconf", "löschen bitte"); if (!(await go.isDisabled())) fail("Löschen: falsche Eingabe wird akzeptiert");
    await d.fill("#delconf", "löschen"); if (await go.isDisabled()) fail("Löschen: korrekte Eingabe wird nicht akzeptiert");
    const [dlf] = await Promise.all([d.waitForEvent("download", { timeout: 5000 }), go.click()]);
    const bak = JSON.parse(fs.readFileSync(await dlf.path(), "utf8"));
    if (!/^opi-suomea-vor-dem-loeschen-/.test(dlf.suggestedFilename()) || Object.keys(bak.cards).length !== prep.cards) fail("Löschen: Sicherungsdatei fehlt oder unvollständig");
    if (await d.evaluate(() => hasProgress(S))) fail("Löschen: Fortschritt nicht gelöscht");
    await d.evaluate(() => A.tab("settings"));
    if (!(await d.locator('[data-act="undodelete"]').count())) fail("Löschen: „Gelöschten Stand wiederherstellen“ fehlt");
    else {
      await d.click('[data-act="undodelete"]'); await d.reload(); await d.waitForTimeout(500);
      const after = await d.evaluate(() => JSON.stringify({ t: S.topics, c: S.cards }));
      if (after !== prep.json) fail("Wiederherstellen: Stand nach Neuladen nicht identisch");
      else ok("Fortschritt löschen: Bestätigung, Sicherungsdatei, Wiederherstellung (identisch nach Neuladen)");
      await d.evaluate(() => A.tab("settings"));
      if (await d.locator('[data-act="undodelete"]').count()) fail("Wiederherstellen-Knopf bleibt nach Wiederherstellung sichtbar");
    }
    // Sicherungsdatei lässt sich auch über „Sicherung einspielen“ zurückholen
    await d.evaluate(() => { S = defaultState(); migrate(); save(); });
    await d.evaluate(txt => importText(txt), JSON.stringify(bak));
    if (await d.evaluate(() => JSON.stringify({ t: S.topics, c: S.cards })) !== prep.json) fail("Sicherungsdatei einspielen: Stand nicht identisch");
    else ok("Sicherungsdatei vom Löschen lässt sich wieder einspielen");
    // Thema zurücksetzen mit Eintipp-Bestätigung
    await d.evaluate(() => A.topic("t01"));
    await d.click("details.reset summary");
    await d.click('[data-act="resettopic"]');
    if (!(await d.locator("#topgo").isDisabled())) fail("Thema zurücksetzen: Knopf ohne Bestätigung aktiv");
    await d.fill("#topconf", "zuruecksetzen");
    const [dl2] = await Promise.all([d.waitForEvent("download", { timeout: 5000 }), d.click("#topgo")]);
    const st = await d.evaluate(() => S.topics.t01.status);
    if (st !== "new" || !/vor-zuruecksetzen-t01/.test(dl2.suggestedFilename())) fail("Thema zurücksetzen: " + st + " " + dl2.suggestedFilename());
    else ok("Thema zurücksetzen: Bestätigung + Sicherungsdatei");
    d.errs.forEach(e => fail("JS-Fehler beim Löschen/Wiederherstellen: " + e));
    await d.context().close(); }

}
