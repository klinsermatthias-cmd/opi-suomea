# B – Sicherheit & Datenschutz

Geprüft: (wird am Ende vervollständigt)

## B1 – Schadcode über Lektionsinhalte: Lektionspaket (`lvl`) sowie Sicherung/Rohdaten/Cloud-Stand (Theorie, Themen-ID)
- **Schwere:** mittel
- **Wo:** `js/ansichten.js:356` (`${t.lvl}` und `data-id="${t.id}"` unmaskiert in der Themenliste), `js/ansichten.js:557` und `js/ueberblick.js:106` (`${t.th}` roh), `js/verwaltung.js:184–215` (`importPack` bereinigt nur `th`, nicht `lvl`), `js/daten.js:703–729` (`replaceState`), `js/daten.js:685–702` (`adoptState`/`mergeStates` für Cloud und zweiten Tab), `js/daten.js:22–24` (`rebuildTopics` übernimmt `S.packs` ungeprüft).
- **Problem:** Die Bereinigung von Lektionen (`validTopic` + `sanitizeHTML`) gibt es nur an zwei Eingängen (eingefügtes Lektionspaket, `lektionen.json`) – und dort unvollständig: `lvl` wird gar nicht geprüft und in der Themenliste roh als HTML eingesetzt. Über alle anderen Wege, auf denen Themen in `S.packs` landen (Sicherung einspielen, Rohdaten-Datei, „Älteren Stand laden“, Cloud-Abgleich, zweiter Tab), wird gar nichts geprüft: Theorie-HTML und Themen-ID gehen unverändert in `innerHTML`.
- **Ablauf/Beleg (Browser-Experimente, exp-B/scripts/exp1, exp2):**
  - Lektionspaket mit HTML-Schadcode in *allen* Feldern eingefügt → nur `lvl` wird ausgeführt, und zwar sofort nach „Lektionen einspielen“ (die App springt in die Themenliste). `th` wird korrekt bereinigt, Titel, Vokabeln, Aufgaben, Hinweise und Erklärungen werden korrekt maskiert.
  - Sicherung (Textfeld), Rohdaten-Datei und Cloud-Stand mit einem Thema, dessen Theorie bzw. ID Schadcode enthält → Ausführung in Themenliste (ID), Themenseite (Theorie) und Grammatik-Übersicht (auch eingeklappt). Der Cloud-Stand wird auf jedem verbundenen Gerät übernommen und läuft dort bei jedem Öffnen der Themen erneut.
  - Ein manipuliertes Thema mit gleicher ID wie ein echtes, aber mehr Einträgen, verdrängt außerdem dauerhaft die Fassung aus `lektionen.json` (`packUpdateOk` lehnt die echte dann als „fehlerhaft“ ab).
- **Folge:** Wer Matthias oder Aurora ein präpariertes Lektionspaket oder eine fremde Sicherungsdatei zum Einspielen gibt (oder Schreibzugriff auf den Cloud-Stand bekommt), kann in der App beliebigen Code ausführen und damit den Gemini-Schlüssel, die Supabase-Anmeldung und den Lernstand beider Apps abgreifen oder verändern.
- **Vorschlag:** (1) Zentral prüfen statt an einzelnen Eingängen: in `rebuildTopics()`/`migrate()` jedes Thema aus `S.packs` mit `validTopic` prüfen (ungültige ausblenden, nicht löschen) und `th` bei jedem Laden durch `sanitizeHTML` schicken – dann sind Sicherung, Cloud, Snapshot und zweiter Tab automatisch abgedeckt. (2) In den Vorlagen `esc(t.lvl)` und `esc(t.id)` verwenden (`ansichten.js:214/220/261/356/516`, `ueberblick.js:106`, `uebungen.js:599`). (3) `lvl`, `fi`, `title` in `validTopic` auf Zeichenketten begrenzen. (4) Test in `tools/pruefen.mjs`: Lektionspaket und Sicherung mit Schadcode in jedem Feld, danach alle Ansichten öffnen und prüfen, dass nichts ausgeführt wurde. (5) Zusätzlich eine Content-Security-Policy (siehe B-Abschnitt CSP) als zweite Sicherung.
- **Aufwand:** klein (Maskierung) bis mittel (zentrale Prüfung + Test)
- **Apps:** beide

