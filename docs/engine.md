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
4. Tests: Die Engine-Tests in `tools/pruefen.mjs` laufen mit festen Test-Inhalten (`tools/test-app.js`, `tools/test-inhalte.js`, `tools/test-lektionen.json`; zusätzlich `tools/test-app-de.js` mit Deutsch als Lernsprache, E-1008-9 – sonst würde das deutsche Sprachmodul nie geprüft) und sind daher in beiden Repos identisch. Teil 6 prüft danach die echten Inhalte der jeweiligen App (alle Themen mit Musterlösungen, Einstufungstest, 390 px). **Wortprüfung (S-1008-73):** Bei neuen/geänderten Themen (gegenüber dem Vergleichsstand) warnt es „! tNN: Wort ohne frühere Wortliste: … (Übung …)“, wenn eine Musterlösung in der Lernsprache ein Wort verlangt, das bis zu diesem Thema in keiner Wortliste steht – bekannt ist, was das Antipp-Wörterbuch der App bis dahin auflöst (Wortlisten, `GLOSS_EXTRA`, Tabellenformen, Endungen) oder mit dem Stamm eines Listenworts (ab 5 Buchstaben) beginnt; Wörter aus `w`/`h` der Übung gelten als gegeben, Großgeschriebenes mitten im Satz als Name. Nur Hinweis, kein Fehler. `WORTCHECK=alle node tools/pruefen.mjs` prüft alle Themen (8.10.: 111 Wörter in 34 Themen, vor allem neue Formen in Grammatiktabellen).
5. Beide Apps liegen auf demselben Origin (`klinsermatthias-cmd.github.io`): localStorage, IndexedDB und Cache Storage sind geteilt. Darum alle Namen über `APP.id` bzw. den Pfad der App bilden und **nie fremde Schlüssel oder Caches löschen** (nur mit eigenem Präfix).
6. Neues Übungsformat → nur ein Eintrag in `FMT` (`js/formate.js`), Beschreibung in `docs/uebungsformate.md` und ein Test in `tools/pruefen.mjs`; Sitzung, Prüfung, Rückmeldung, Validierung und KI-Texte rufen `FMT` auf.
7. Neue Engine-Datei → in `index.html`, `sw.js` (`FILES`), Workflow (`cp`) **und** `tools/engine-dateien.txt` eintragen.

## Wie kommt eine neue Funktion in den Deutsch-Trainer?
**Workflow-Dateien** (`.github/workflows/…`) kann die Action nicht übernehmen (GitHub erlaubt dem Action-Token keine Änderungen an Workflows). Weichen sie ab, überspringt sie sie mit einer Warnung; der Funktionen-Chat trägt geänderte Workflows nach dem Push direkt im Deutsch-Trainer ein (gleiche Datei kopieren, committen, pushen).

Die Action **„Engine übernehmen“** im Repo `deutsch-trainer` läuft täglich (03:17 UTC) und auf Knopfdruck (Actions → Engine übernehmen → Run workflow). Sie kopiert die Engine-Dateien aus `opi-suomea/main`, prüft sie mit den Inhalten des Deutsch-Trainers und übernimmt und veröffentlicht nur, wenn alles grün ist. Schlägt die Prüfung fehl, bleibt der Deutsch-Trainer unverändert.

## Übersetzungsrichtung in Übungen (`tr`)
`dir: "de"` = Aufgabe in der **Basissprache**, Antwort in der **Lernsprache** (Opi suomea: Deutsch → Finnisch, Deutsch-Trainer: Englisch → Deutsch).
`dir: "fi"` = Aufgabe in der **Lernsprache**, Antwort in der Basissprache. (Die Kürzel stammen aus Opi suomea und bleiben aus Kompatibilitätsgründen.)

## Simulation (`tools/simulation.mjs`)
- Simuliert viele Tage Lernen auf zwei Geräten mit nachgebauter Cloud, Gemini und Claude und bedient die App **über die Knöpfe** wie ein Mensch. Aufruf: `DAYS=180 node tools/simulation.mjs` (Optionen im Kopf der Datei; `APP_ROOT=../deutsch-trainer` simuliert den Deutsch-Trainer mit dieser Fassung).
- **Abdeckungs-Kontrolle:** Am Ende muss jede Aktion (jeder Knopf), jede Ansicht (`render…`), jede Übungsart der Inhalte, jede KI-Art und jede Einstellung vorgekommen sein, sonst meldet die Simulation ein Problem. Neue Funktionen fallen so automatisch auf. Ausnahmen nur mit Begründung (`EXEMPT`).
- **Simulations-Chat (E-1008-24):** Simulationen fährt ein eigener Chat in Matthias' zweitem Konto (Codes S-…), Übergabe und Regeln in `docs/simulation.md`; er pusht nur auf Branches `simulation/…`, der Funktionen-Chat übernimmt sie nach Matthias' OK auf `main`.
- **Regel (Matthias, 7.10.2026):** Vor jeder neuen Simulation kritisch prüfen, ob wirklich alle Funktionen der App abgedeckt sind – auch neu hinzugekommene – und die Simulation sonst zuerst erweitern. Sie soll bis ins kleinste Detail gehen.
