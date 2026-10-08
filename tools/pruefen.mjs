// Prüft die App vor jedem Livegang: node tools/pruefen.mjs
// 1. JS-Syntax von index.html  2. lektionen.json gültig  3. nur hinten angehängt (Vergleich mit BASIS)
// 4. Headless-Browser (390 px): alle Themen mit den Musterlösungen lösen, Vokabeln, Hörtraining,
//    Fehler-Training, alle Ansichten  5. Cloud-Sync mit zwei Geräten gegen eine nachgebaute Supabase.
// BASIS = Git-Stand zum Vergleichen (Standard: origin/main bzw. env BASIS).
// Engine-Tests laufen mit festen Test-Inhalten (tools/test-app.js, tools/test-inhalte.js, tools/test-lektionen.json)
// und sind daher in allen Apps der Lern-Engine gleich. Danach prüft Teil 6 die echten Inhalte dieser App.
// Aufgeteilt in Module unter tools/pruefen/ (S-1008-102): hier nur Aufruf und Reihenfolge. Neuer Test → passendes Modul
// (Kopfkommentar je Datei); gemeinsame Werte stehen im Objekt P (hilfen.mjs), Ergebnisse früherer Teile ebenso.
import { P, starten } from "./pruefen/hilfen.mjs";
import statisch from "./pruefen/statisch.mjs";
import durchlauf from "./pruefen/durchlauf.mjs";
import sync from "./pruefen/sync.mjs";
import ki from "./pruefen/ki.mjs";
import sicherungen from "./pruefen/sicherungen.mjs";
import sprachen from "./pruefen/sprachen.mjs";
import befunde from "./pruefen/befunde.mjs";
import inhalte from "./pruefen/inhalte.mjs";

await statisch(P);
await starten();
try {
  await durchlauf(P);
  await sync(P);
  await ki(P);
  await sicherungen(P);
  await sprachen(P);
  await befunde(P);
  await inhalte(P);
} catch (e) { P.fail("Test abgebrochen: " + (e.stack || e.message)); }
finally { await P.browser.close(); P.server.close(); }

console.log(`\n${P.fehler.length ? "FEHLER: " + P.fehler.length : "Alles in Ordnung"}${P.hinweise.length ? ` · ${P.hinweise.length} Hinweis(e)` : ""}`);
process.exit(P.fehler.length ? 1 : 0);
