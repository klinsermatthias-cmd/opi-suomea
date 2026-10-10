/* Prüfskript – sync.mjs (S-1008-102): Teil 5 – Cloud-Sync mit zwei Geräten gegen die nachgebaute Supabase, Schließen der App, Löschen/Wiederherstellen,
   hängende Cloud, zwei Tabs, kaputter Speicher, Startfehler.
   Aufgerufen von tools/pruefen.mjs; gemeinsame Werte und Ergebnisse früherer Teile stehen im Objekt P. */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import { execSync, execFile } from "node:child_process";
import { createRequire } from "node:module";

export default async function sync(P) {
  const { ok, fail, db, URL0, device, r } = P;
  /* ---------- 5. Cloud-Sync mit zwei Geräten ---------- */
  const cfg = { setupDone: true, sbUrl: URL0 + "sb", sbKey: "k", session: { access_token: "t", refresh_token: "r", expires_at: Date.now() + 36e5, user: { id: "u1" } } };
  const a = await device(cfg), b = await device(cfg);
  const mark = (p, id) => p.evaluate(async id => { S.cards[id] = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; save(); await pushCloud(); }, id);
  const cloudCards = () => Object.keys((db.progress.get("u1") || { data: { cards: {} } }).data.cards);
  await a.evaluate(() => pullCloud()); await b.evaluate(() => pullCloud());
  await mark(a, "syncA");
  await mark(b, "syncB"); // B kennt A's Stand noch nicht → muss zusammenführen statt überschreiben
  const c1 = cloudCards();
  if (c1.includes("syncA") && c1.includes("syncB")) ok("Sync: zwei Geräte – nichts überschrieben"); else fail("Sync: Änderung eines Geräts ging verloren " + JSON.stringify(c1));
  const bHas = await b.evaluate(() => !!S.cards.syncA);
  if (!bHas) fail("Sync: Gerät B hat den Stand von A nicht übernommen");
  await a.evaluate(() => pullCloud());
  if (!(await a.evaluate(() => !!S.cards.syncB))) fail("Sync: Gerät A hat den Stand von B nicht geholt");
  // Während einer Übung wird nicht zusammengeführt, danach schon
  await a.evaluate(() => { SESSION = { kind: "vocab", queue: [] }; });
  await mark(b, "syncB2"); await mark(a, "syncA2");
  if (cloudCards().includes("syncA2")) fail("Sync: Konflikt während einer Übung hätte warten müssen");
  await a.evaluate(async () => { SESSION = null; await pushCloud(); });
  const c2 = cloudCards();
  if (c2.includes("syncA2") && c2.includes("syncB2")) ok("Sync: Konflikt während einer Übung wird danach zusammengeführt"); else fail("Sync nach Übung: " + JSON.stringify(c2));
  // E-1007-82: während einer Runde 30 s Frist, nach dem Rundenende innerhalb von ~1 s hochladen
  { await a.evaluate(async () => { await pullCloud(); await pushCloud(); }); await a.waitForTimeout(1500);
    await a.evaluate(() => { SESSION = { kind: "vocab", queue: [] }; S.cards.syncEnd = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; save(); });
    await a.waitForTimeout(1800);
    if (cloudCards().includes("syncEnd")) fail("Sync: während einer Runde sofort hochgeladen (30-s-Frist wirkungslos)");
    await a.evaluate(() => { SESSION = null; });
    await a.waitForTimeout(2500);
    if (cloudCards().includes("syncEnd")) ok("Sync: nach dem Rundenende innerhalb von ~2 s hochgeladen (E-1007-82)"); else fail("Sync: Rundenende wartet auf die 30-s-Frist (E-1007-82)"); }
  // Ausweichweg: Cloud lehnt den Vergleich ab → trotzdem nichts überschreiben
  db.noCas = true;
  await mark(a, "syncA3"); await mark(b, "syncB3");
  const c3 = cloudCards();
  if (c3.includes("syncA3") && c3.includes("syncB3")) ok("Sync-Ausweichweg: nichts überschrieben"); else fail("Sync-Ausweichweg: " + JSON.stringify(c3));
  // E-1010-3: Cloud speichert Mikrosekunden – Vergleich muss trotzdem passen, kein „Sync-Konflikt“
  db.noCas = false;
  { db.micro = true;
    const row = db.progress.get("u1"); if (row) row.us = 789;
    /* frische Geräte: a und b nutzen nach dem Ausweichweg-Test keinen Vergleich mehr (NO_CAS) */
    const c = await device(cfg), d = await device(cfg);
    await c.evaluate(() => pullCloud()); await d.evaluate(() => pullCloud());
    await c.waitForTimeout(500); await d.waitForTimeout(500); // Start-Abgleich der frischen Geräte abwarten
    await mark(c, "syncUsA"); await mark(d, "syncUsB"); await mark(c, "syncUsA2");
    /* Hochladen kann hinter einem noch laufenden Abgleich warten (PUSH_AGAIN) – bis zu 5 s auf die Cloud warten */
    for (let i = 0; i < 25 && !["syncUsA", "syncUsB", "syncUsA2"].every(k => cloudCards().includes(k)); i++) await c.waitForTimeout(200);
    const cu = cloudCards(), errs = await c.evaluate(() => (S.appErr || []).filter(e => /Sync-Konflikt/.test(e.m)).length + (document.querySelector("#sync") || {}).textContent);
    const ms = await c.evaluate(() => typeof pgMs === "function" && pgMs("2026-10-10T15:35:07.123456+00:00") === Date.parse("2026-10-10T15:35:07.123Z"));
    if (cu.includes("syncUsA") && cu.includes("syncUsB") && cu.includes("syncUsA2") && /^0/.test(errs) && !/Sync-Fehler/.test(errs) && ms)
      ok("Sync: Zeitstempel mit Mikrosekunden – Vergleich passt, kein Sync-Konflikt (E-1010-3)");
    else fail("Sync mit Mikrosekunden-Zeitstempel: " + JSON.stringify({ cu: cu.filter(x => x.startsWith("syncUs")), errs, ms }));
    db.micro = false; const r2 = db.progress.get("u1"); if (r2) r2.us = 0;
    await c.context().close(); await d.context().close(); }
  // E-1010-4: Cloud übernimmt Änderungen still nicht (PATCH ohne Wirkung) – Ausweichweg, Grund im Fehlerprotokoll
  { db.casSilent = true;
    const c = await device(cfg);
    await c.evaluate(() => pullCloud()); await c.waitForTimeout(500);
    await mark(c, "syncSilent");
    for (let i = 0; i < 25 && !cloudCards().includes("syncSilent"); i++) await c.waitForTimeout(200);
    const info = await c.evaluate(() => ({ e: (S.appErr || []).map(x => x.m).join(" | "), st: (document.querySelector("#sync") || {}).textContent }));
    if (cloudCards().includes("syncSilent") && /Vergleich wirkungslos \(Zeile gefunden\)/.test(info.e) && !/Sync-Konflikt/.test(info.e) && !/Sync-Fehler/.test(info.st))
      ok("Sync: Cloud übernimmt Änderungen still nicht – Ausweichweg, Grund im Fehlerprotokoll (E-1010-4)");
    else fail("Sync bei still abgelehnter Änderung: " + JSON.stringify({ cloud: cloudCards().includes("syncSilent"), ...info }));
    db.casSilent = false; await c.context().close(); }
  // E-1010-6: Bericht für Claude automatisch in die Cloud – nur mit Schalter, höchstens alle 30 min, Leseskript
  { db.berichte.clear();
    const c = await device(cfg);
    await c.evaluate(async () => { await pullCloud(); S.settings.cloudReport = false; S.cards.repOff = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; save(); await pushCloud(); });
    await c.waitForTimeout(300);
    const off = db.berichte.size;
    const btn = await c.evaluate(() => { CUR = { tab: "settings", arg: null }; render(); return !!document.querySelector('[data-act="togglereport"]'); });
    await c.evaluate(async () => { A.togglereport(); await new Promise(r => setTimeout(r, 400)); });
    const on = [...db.berichte.values()];
    await c.evaluate(async () => { S.cards.repOn = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; save(); await pushCloud(); await reportUpload(); });
    const again = [...db.berichte.values()].reduce((n, v) => n + v.n, 0);
    let out = "", list = "", nokey = "";
    const envR = { ...process.env, OPI_SB_URL: URL0 + "sb", OPI_SB_KEY: "sb_publishable_test_0123456789", OPI_BERICHT_EMAIL: "leser@test", OPI_BERICHT_PASSWORT: "pw" };
    /* asynchron: das Skript fragt die nachgebaute Cloud in diesem Prozess – execSync würde sie blockieren */
    const run = (args, env) => new Promise(res => execFile("node", ["tools/bericht-holen.mjs", ...args], { env, encoding: "utf8", timeout: 20000 }, (e, so, se) => res({ e, so: so || "", se: se || "" })));
    { const r1 = await run([], envR), r2 = await run(["--liste"], envR); out = r1.e ? "Fehler: " + r1.se : r1.so; list = r2.so; }
    nokey = (await run([], { ...process.env, OPI_SB_URL: "", OPI_SB_KEY: "" })).se;
    /* vertauschte Felder: Abbruch mit Hinweis, ohne den Wert auszugeben */
    const swap = (await run([], { ...envR, OPI_SB_URL: "sb_publishable_geheim_123456", OPI_SB_KEY: "abc" })).se;
    const swapBad = !/Felder vertauscht/.test(swap) || /geheim/.test(swap) ? swap.slice(0, 120) || "keine Meldung" : "";
    const shown = await c.evaluate(() => { render(); return (document.querySelector('[data-act="togglereport"]') || {}).closest ? document.querySelector('[data-act="togglereport"]').closest(".setrow").textContent : ""; });
    if (off === 0 && btn && on.length === 1 && /Fortschrittsbericht für Claude/.test(on[0].text) && !/sbKey|refresh_token|access_token/.test(on[0].text) && again === 1 &&
        /# Bericht vom \d{4}-\d\d-\d\d/.test(out) && /Fortschrittsbericht für Claude/.test(out) && /\d{4}-\d\d-\d\d/.test(list) && /Fehlende Umgebungsvariablen: OPI_SB_URL, OPI_SB_KEY/.test(nokey) && /zuletzt/.test(shown) && !swapBad)
      ok("Bericht für Claude in der Cloud: nur mit Schalter, höchstens alle 30 min, Leseskript (E-1010-6)");
    else fail("Bericht für Claude in der Cloud: " + JSON.stringify({ off, btn, on: on.length, again, out: out.slice(0, 120), list: list.slice(0, 60), nokey: nokey.slice(0, 80), shown: shown.slice(0, 80), swapBad }));
    db.berichte.clear(); await c.context().close(); }
  // Großer Stand (> 64 KB) beim Schließen der App
  await b.evaluate(() => pullCloud());
  await b.evaluate(async () => { S.gloss = S.gloss || {}; for (let i = 0; i < 3000; i++) S.gloss["w" + i] = { de: "x".repeat(20) }; S.cards.syncBig = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; S.updated = Date.now(); writeLocal(); DIRTY = true; await pushCloud(true); });
  if (cloudCards().includes("syncBig")) ok("Sync beim Schließen auch bei großem Stand"); else fail("Sync beim Schließen: großer Stand nicht hochgeladen");
  // Löschen und Wiederherstellen über die Cloud auf zwei Geräten
  { await a.evaluate(() => pullCloud()); await b.evaluate(() => pullCloud());
    const before = await a.evaluate(() => Object.keys(S.cards).length);
    await a.evaluate(async () => { safeCopy("-vor-loeschen", S); S = defaultState(); migrate(); save(); clearTimeout(PUSH_TIMER); await pushCloud(); });
    await b.evaluate(() => pullCloud());
    const bEmpty = await b.evaluate(() => Object.keys(S.cards).length === 0);
    await a.evaluate(async () => { undoDelete(); clearTimeout(PUSH_TIMER); await pushCloud(); });
    await b.evaluate(() => pullCloud());
    const bBack = await b.evaluate(() => Object.keys(S.cards).length);
    if (bEmpty && bBack === before && cloudCards().length === before) ok("Löschen und Wiederherstellen kommen über die Cloud auf dem zweiten Gerät an");
    else fail(`Cloud-Wiederherstellung: zweites Gerät leer=${bEmpty}, danach ${bBack}/${before} Karten, Cloud ${cloudCards().length}`); }
  // Cloud hängt: App startet trotzdem sofort, Sync blockiert nicht dauerhaft
  db.hang = true;
  const t0 = Date.now(); const h = await device(cfg); const dt = Date.now() - t0;
  if (dt < 1400) ok(`Start bei hängender Cloud ohne Warten (${dt} ms)`); else fail(`Start wartet auf die Cloud (${dt} ms)`);
  await h.evaluate(async () => { S.cards.syncHang = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; save(); clearTimeout(PUSH_TIMER); await pushCloud(); });
  db.hang = false;
  await h.evaluate(async () => { DIRTY = true; await pushCloud(); });
  if (cloudCards().includes("syncHang")) ok("Sync erholt sich nach hängender Verbindung"); else fail("Sync bleibt nach hängender Verbindung blockiert");
  [...a.errs, ...b.errs, ...h.errs].forEach(e => fail("JS-Fehler beim Sync: " + e));

  // Zwei Tabs auf demselben Gerät (ohne Cloud): kein Tab überschreibt den anderen
  const t1 = await device({ setupDone: true }), t2 = await device(null, t1.context());
  await t1.evaluate(() => { S.cards.tabA = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; save(); });
  await t2.waitForTimeout(200);
  await t2.evaluate(() => { S.cards.tabB = { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: 0, isNew: false, last: Date.now() }; save(); });
  await t1.waitForTimeout(200);
  await t2.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  const stored = await t1.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("opi-suomea-v1")).cards));
  const inT1 = await t1.evaluate(() => !!S.cards.tabB);
  if (stored.includes("tabA") && stored.includes("tabB") && inT1) ok("Zwei Tabs: Änderungen beider Tabs bleiben erhalten"); else fail("Zwei Tabs: Daten überschrieben " + JSON.stringify(stored));
  [...t1.errs, ...t2.errs].forEach(e => fail("JS-Fehler mit zwei Tabs: " + e));
  await t1.context().close();

  // Kaputter Speicherinhalt: App startet, alter Inhalt bleibt als Kopie erhalten
  const k = await device({ setupDone: true }, null, "{kaputt");
  const kept = await k.evaluate(() => Object.keys(localStorage).some(x => x.startsWith("opi-suomea-v1-defekt-")));
  const shown = await k.evaluate(() => document.querySelector("#app").innerText.length > 50);
  if (kept && shown) ok("Kaputte Daten: App startet, Originaldaten bleiben als Kopie"); else fail(`Kaputte Daten: Kopie ${kept}, Ansicht ${shown}`);
  k.errs.forEach(e => fail("JS-Fehler bei kaputten Daten: " + e));
  // Startfehler: Rettungsansicht statt weißer Seite, Daten unverändert
  const rz = await device({ setupDone: true }, null, '{"topics":{},"daily":null}');
  const rText = await rz.evaluate(() => document.querySelector("#app").innerText);
  const rKept = await rz.evaluate(() => localStorage.getItem("opi-suomea-v1"));
  if (/konnte nicht starten/.test(rText) && rKept === '{"topics":{},"daily":null}') ok("Startfehler: Rettungsansicht, Daten unangetastet"); else fail("Startfehler ohne Rettungsansicht: " + rText.slice(0, 80));

  Object.assign(P, { cfg, a, b, mark, cloudCards, c1, bHas, c2, c3, t0, h, dt, t1, t2, stored, inT1, k, kept, shown, rz, rText, rKept });
}
