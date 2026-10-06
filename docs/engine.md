# Gemeinsame Lern-Engine (Opi suomea + Deutsch-Trainer)

Opi suomea (Finnisch für Matthias) und der Deutsch-Trainer (Deutsch für Aurora) sind **technisch dieselbe App**.
Alle Funktionen werden **nur hier in opi-suomea** entwickelt und gelten automatisch für beide Apps.
Getrennt bleiben nur Inhalte, Einstellungen und Lernfortschritt.

## Welche Datei gehört wem?
- **Engine** (in beiden Repos gleich, Liste: `tools/engine-dateien.txt`): `index.html`, `app.css`, `sw.js`, alle Skripte in `js/` außer `app.js` und `inhalte.js`, `tools/pruefen.mjs` mit den Test-Inhalten `tools/test-*`, die Workflows `pruefen-und-veroeffentlichen.yml` und `engine-uebernehmen.yml`, sowie `docs/engine.md`, `docs/architektur.md`, `docs/uebungsformate.md`.
- **App** (je Repo eigen, wird nie überschrieben):
  - `js/app.js` – Einstellungen: Name, Speicherschlüssel (`id`), Lernende/r, Name und Rolle der KI-Lehrkraft, Lern- und Basissprache, Vorlesestimme, Sonderzeichen-Tasten, Tabs, Begrüßung, Logo, Landschaft im Kopf, Funktionen (`features`), Angaben zum Einstufungstest.
  - `farben.css` – Farben (gleiche Variablennamen in beiden Apps).
  - `js/inhalte.js` – `BASE_TOPICS`, `GLOSS_EXTRA` (Wörterbuch-Ergänzungen) und – falls vorhanden – der Einstufungstest (`PT`, `PT_READING`).
  - `lektionen/`, `manifest.webmanifest`, Icons, `CLAUDE.md`, `docs/lehrplan.md`, `docs/entscheidungen.md`, `docs/ki-qualitaet.md`.
- **Sprachmodul** `js/sprache.js` (Engine): Eigenheiten der Lernsprache (Endungen beim Antippen, Verneinung, unregelmäßige Formen, Hinweise für die KI-Prüfung). Neue Lernsprache → hier ergänzen.

## Regeln für Engine-Änderungen
1. Keine App-Texte fest im Engine-Code: Namen, Sprachen, Lehrkraft, Lernende/r immer über `APP` (z. B. `APP.teacher`, `APP.target.name`, `APP.base.ins`, `APP.explain`). Kurze Rückmeldungen („Richtig!“, Lob am Rundenende, Begrüßung bei der Einrichtung) stehen in `APP.ui` (`welcome`, `right`, `rightShort`, `wrong`, `praise`); fehlt ein Eintrag, gilt die neutrale deutsche Vorgabe der Engine (`UI` in `js/daten.js`). Richtungskürzel (`fi→de`) entstehen aus `APP.target.code` und `APP.base.code` (fehlt es: erste zwei Buchstaben von `APP.base.name`).
2. Funktionen, die nicht jede App braucht, über `APP.features` zuschalten (Beispiel: `features.placement` für den Einstufungstest).
3. Datenformat nie brechen – auch nicht für die andere App (`defaultState()`/`migrate()`, `mergeStates()`).
4. Tests: Die Engine-Tests in `tools/pruefen.mjs` laufen mit festen Test-Inhalten (`tools/test-app.js`, `tools/test-inhalte.js`, `tools/test-lektionen.json`) und sind daher in beiden Repos identisch. Teil 6 prüft danach die echten Inhalte der jeweiligen App (alle Themen mit Musterlösungen, Einstufungstest, 390 px).
5. Beide Apps liegen auf demselben Origin (`klinsermatthias-cmd.github.io`): localStorage, IndexedDB und Cache Storage sind geteilt. Darum alle Namen über `APP.id` bzw. den Pfad der App bilden und **nie fremde Schlüssel oder Caches löschen** (nur mit eigenem Präfix).
6. Neues Übungsformat → nur ein Eintrag in `FMT` (`js/formate.js`), Beschreibung in `docs/uebungsformate.md` und ein Test in `tools/pruefen.mjs`; Sitzung, Prüfung, Rückmeldung, Validierung und KI-Texte rufen `FMT` auf.
7. Neue Engine-Datei → in `index.html`, `sw.js` (`FILES`), Workflow (`cp`) **und** `tools/engine-dateien.txt` eintragen.

## Wie kommt eine neue Funktion in den Deutsch-Trainer?
Die Action **„Engine übernehmen“** im Repo `deutsch-trainer` läuft täglich (03:17 UTC) und auf Knopfdruck (Actions → Engine übernehmen → Run workflow). Sie kopiert die Engine-Dateien aus `opi-suomea/main`, prüft sie mit den Inhalten des Deutsch-Trainers und übernimmt und veröffentlicht nur, wenn alles grün ist. Schlägt die Prüfung fehl, bleibt der Deutsch-Trainer unverändert.

## Übersetzungsrichtung in Übungen (`tr`)
`dir: "de"` = Aufgabe in der **Basissprache**, Antwort in der **Lernsprache** (Opi suomea: Deutsch → Finnisch, Deutsch-Trainer: Englisch → Deutsch).
`dir: "fi"` = Aufgabe in der **Lernsprache**, Antwort in der Basissprache. (Die Kürzel stammen aus Opi suomea und bleiben aus Kompatibilitätsgründen.)
