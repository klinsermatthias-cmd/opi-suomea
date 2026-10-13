# Startdatei: „App-Engine: Funktionen“

Stand: 12.10.2026 (Umsiedeln, Generation 3 → 4). Diese Datei wird **überschrieben**, nicht ergänzt. Verlauf: `docs/entscheidungen.md`; frühere Übergabe: `docs/archiv/uebergabe-funktionen-2026-10-07.md`.

## Pflichtlektüre beim Start
- `CLAUDE.md` (wird automatisch geladen) und diese Datei – sonst nichts (T-1012-21).
- `docs/engine.md` erst bei Änderungen an Engine-Dateien; `docs/pruefliste-engine.md` erst **vor dem Push** durchgehen.
- aus `docs/architektur.md` nur den Abschnitt „Dateien“, wenn die Aufgabe Code betrifft (Grep `^## Dateien`, dann `offset/limit`)

## Lesestoff je Aufgabe (S-1008-99)
Abschnitte mit Grep finden (`^## …`), dann nur den Bereich lesen.

| Aufgabe | Lesen |
|---|---|
| Sync, Speichern, Datenformat | `architektur.md`: „Zustand `S`“, „Gerätekonfiguration `CFG`“, „Cloud-Sync“, „Sicherungen“; in `js/daten.js` die Funktion per Grep (`pushCloud`, `pullCloud`, `mergeStates`, `migrate`, `writeLocal`) |
| KI | `architektur.md`: „KI-Protokoll & Token-Statistik“, „Token-Verbrauch“, „KI-Verbindung“; `js/ki.js` per Grep |
| Lernlogik, Plan, Freischaltung | `architektur.md` „Lernlogik“; `js/lernen.js`, `js/uebungen.js` per Grep |
| Übungsformate | `docs/uebungsformate.md`, in `js/formate.js` den `FMT`-Eintrag |
| Neuer Test | passendes Modul `tools/pruefen/<bereich>.mjs`; gemeinsame Werte im Objekt `P` |
| Branch eines anderen Chats | `git diff --stat main...<branch>`, dann nur die betroffenen Dateien |
| Frühere Entscheidung | Grep auf den Code in `docs/entscheidungen.md` und `docs/archiv/` |

Regeln: große Dateien nie ganz lesen; Befehlsausgaben kurz halten; neue Texte kurz.

## Arbeitsmodus (Matthias)
- **Sparflamme seit 11.10.:** neue Wünsche nur in `docs/ideen.md` sammeln, nicht prüfen/bauen – außer Matthias gibt ein Thema mit Code frei.
- **Seit 12.10.:** Matthias lässt sich die offenen Themen **einzeln** vorschlagen (Runde am 12.10. komplett durch: alles auf der Ideenliste, Sprachausgabe verworfen; nächste Anlässe: KI-Test-Bericht 14.10., Auroras Berichte) (je Thema: kurzer Befund, Plan, Effort, Codes „umsetzen“/„verwerfen“, oder „Ideenliste“ = bleibt gesammelt). Nach seiner Antwort das nächste Thema.
- **Token sparen:** Antworten kurz; nur nötige Dateien lesen; Gegenproben gezielt.

## Stand seit der letzten Übergabe (9.–12.10.)
- E-1009-18 Umsiedeln-Regel · E-1009-26 jede Änderung mit Quellen prüfen und Quellen melden (`CLAUDE.md`, Prüfliste)
- E-1010-2 Einstufungstest-Import: Lücken-`first` als Text, `null` = leer, altes Format ohne `g`/`raw`
- E-1010-3 Sync-Vergleich auf die Millisekunde (`gte`/`lt`, `pgMs`), Grund bei „Sync-Konflikt“ im Fehlerprotokoll
- E-1010-4 Cloud übernimmt PATCH still nicht (Deutsch-Trainer, Gerät `gbgntad5`, Supabase-Projekt `usjcalwmvngarqdyznig`; Policies/Rechte/Spaltentyp korrekt, Prüfabfrage „Zeile gefunden“) → Prüfabfrage + Ausweichweg per POST (`NO_CAS`). Ursache offen; beobachten, ob andere Geräte es melden. Hinweiszeile im Fehlerprotokoll einmal pro App-Start ist erwartet.
- E-1010-5 „Nur vertippt“ umschaltbar, gezählt erst bei „Weiter“/Verlassen/Hintergrund (`typoCommit`)
- E-1010-6 Bericht automatisch in Supabase-Tabelle `berichte` (Schalter in den Einstellungen, ≤ alle 30 min, 30 Tage), Leseskript `tools/bericht-holen.mjs` (prüft Format, gibt nie Werte aus). Opi-Projekt: Tabelle + Policy „eigene Berichte“ + Lese-Konto mit Policy „Leser“ (`auth.jwt()->>'email'`). Geheimnisse `OPI_SB_URL`, `OPI_SB_KEY`, `OPI_BERICHT_EMAIL`, `OPI_BERICHT_PASSWORT` und Allowed domain in env_01DeEL2VfGxPUmR6Jh5VMb3t; gelten nur in **neuen** Sitzungen. Getestet 10.10. 23:24 ✓. `supabase-wach-halten.yml` prüft auch `berichte` (auch in den Deutsch-Trainer kopiert). E-1010-7: vorerst **nicht** für den Deutsch-Trainer.
- Deutsch-Trainer: eigenes Supabase-Projekt; erste Themen d01–d03 seit 11.10. live; Quellenliste dort in `lektionen/pruefliste.md`.
- A2-Entwurf t20–t35d (53 Themen) des Simulations-Chats auf `pruefung/abschluss-2026-10-08` (`docs/pruefungen/entwurf-a2/`); Natürlichkeitsprüfung S-1009-1 lief (Rohfunde viele D/E). Matthias: Simulations-Chat finalisiert, dann Gesamtsimulation, Inhalts-Chat übernimmt nur. **Vor der Übernahme kurz prüfen** (Funde eingearbeitet? wie geprüft?), dann Inhalts-Chat Bescheid geben.
- Sicherungs-Branches: `sicherung/vor-e1010-3` … `vor-e1010-6`, `vor-e1009-3/-5/-10/-12`, `vor-e1008-58` und ältere (siehe Archiv).

## Letzter Code
**E-1013-3** (13.10.; -1 und -2 erledigt: Befunde S-1012-102/-105/-121 bis -126 ohne -124 Teil 1, Simulation übernommen; -3 offen = S-1012-104 IndexedDB + S-1012-124 Teil 1, siehe `docs/entscheidungen.md`). Nächster Code: am selben Tag E-1013-4, sonst `E-<MMTT>-1`.

## Offene Themen (Reihenfolge zum Vorschlagen)
1. ✔ besprochen 12.10.: **„Noch nicht gelernt?“ zählt ins Rundenergebnis** – bestätigter Fehler (`unlearnedOn` nur in Fehler-Training/`weakCounts`, nicht in `finishTopic`/Themen-Ergebnis). Plan E-1012-1 (aus Rundenergebnis nehmen, Anzeige „zählt nicht“, keine Ersatz-Übung, medium). Matthias: **bleibt auf der Ideenliste**.
2. ✔ besprochen 12.10.: Zahlentasten 1–4 im Vokabeltrainer (PC; nur bei aufgedeckter Antwort, nicht in Eingabefeldern; Ziffern auf den Knöpfen; Enter/Leertaste deckt auf – vorher prüfen), klein. Matthias: **bleibt auf der Ideenliste**.
3. ✔ besprochen 12.10.: Antippen: Nomen mit Artikel (Plan E-1012-5/-6). Matthias: **bleibt auf der Ideenliste**.
4. ✔ besprochen 12.10.: E-1009-20 Knopf „Fehler in der Übung?“ (Plan E-1012-7/-8). Matthias: **bleibt auf der Ideenliste**.
5. ✔ besprochen 12.10.: E-1009-23 Prüfvermerk je Thema (Plan E-1012-9/-10). Matthias: **bleibt auf der Ideenliste**.
6. ✔ 12.10.: Sprachausgabe in besserer Qualität – **verworfen** (E-1012-12).
7. ✔ besprochen 12.10.: Teilpunkte bei mehreren Feldern (Plan E-1012-13/-14). Matthias: **bleibt auf der Ideenliste**.
8. ✔ besprochen 12.10.: Dialoge gegenlesen lassen (Plan E-1012-15/-16). Matthias: **bleibt auf der Ideenliste**.
9. ✔ besprochen 12.10.: E-1009-21 bestätigte Fehler in Opettajas Auftrag (Plan E-1012-17/-18). Matthias: **bleibt auf der Ideenliste**.
10. ✔ besprochen 12.10.: E-1009-22 Rest (`--thema`, Plan E-1012-19/-20). Matthias: **bleibt auf der Ideenliste**.
11. ✔ besprochen 12.10.: E-1007-8 Rest (Plan E-1012-21/-22). Matthias: **bleibt auf der Ideenliste** bis nach ca. 3 Berichten (Erinnerung F-1007-1 im Lehrplan).
12. ✔ besprochen 12.10.: E-1008-35 (Plan E-1012-23/-24) **bleibt auf der Ideenliste**; E-1008-40 mit dem KI-Test-Bericht am 14.10. entscheiden.
13. E-1010-1 deutsche KI-Regel mit Beispielen – nach Auroras ersten Berichten.
14. ✔ besprochen 12.10.: E-1008-61 Tageslimit (Plan E-1012-25/-26). Matthias: **bleibt auf der Ideenliste**.
15. ✔ besprochen 12.10. (E-1012-27): bleibt langfristig gesammelt, erst bei konkretem Anlass wieder aufnehmen –: S-1008-13 IndexedDB, E-1008-17 App-Kennung in der Cloud, E-1008-18 CSP, E-1008-19 Simulation mit allen Themen, große Dateien teilen (> 1.500 Zeilen), Architektur in der nächsten großen Prüfung.
- Warten auf andere: E-1009-19 (Inhalts-Chat prüft Themen vorab mit Quellen), A2-Entwurf (s. o.).

## Termine
- **KI-Test E-1008-42:** Bericht Phase A (Gemini 3 Flash) war am 11.10. fällig, Phase B (Claude Haiku 4.5) am 14.10. → beide Berichte vergleichen („QUALITÄT JE MODELL“, ⚑, Token/Kosten, Bewertungsqualität; wirken E-1009-5/-6/-12/-14?) → Empfehlung mit Code. Seit E-1010-6 kann der Bericht auch per `tools/bericht-holen.mjs` geholt werden (nur in neuer Sitzung).

## Session-IDs
In `docs/chats/sessions.md` (T-1012-18).

## KI-Anbieter
- OpenRouter mit Prepaid-Guthaben (Auto Top-Up aus) über „Anderer Anbieter“, Basis-URL `https://openrouter.ai/api/v1`. Schlüssel läuft ca. 6.4.2027 ab.
- Die App-KI kann keine Quellen nachschlagen; Lehren für sie müssen in ihren Auftrag (E-1009-17).

## Routinen (claude.ai, frische Sessions)
- `trig_01CJeBzbAaus5qVrp8VeU9bT` 14.10. 18:45: Bericht nach Phase B.
- `trig_01NChVTCCFQF9114Ne3DYSK2` wöchentlich So 18:41 Wien: Wochenbericht.
- `trig_01QiB344yM72FseB5okxUT5q` 30.3.2027: OpenRouter-Schlüssel erneuern.
- (`trig_01AHJFYbLyHfNfJoyJAHCc1y` 11.10. ist gelaufen.) Fremd, nicht anfassen: `trig_016iQPcWSAHQXuPCyu5koztt`.

## Quellen und Netz (Cloud-Umgebung)
- Finnisch: Wiktionary (Rohtext `index.php?title=<wort>&action=raw`), Kielitoimiston sanakirja (nur Playwright), uusikielemme.fi, kotus.fi, kielikello.fi. Nicht: kielikoulu.yle.fi, kaino.kotus.fi/visk.
- Deutsch: duden.de, dwds.de, Wiktionary, grammis.ids-mannheim.de (Playwright), ostarrichi.org, osd.at, integrationsfonds.at. Gesperrt bzw. blockt: goethe.de, leo, linguee, dw.com, wikipedia u. a.
- github.io ist aus der Cloud gesperrt; GitHub per `gh` bzw. MCP. Nicht im Prüfskript nutzen.

## Arbeitsweise Engine-Push (bewährt)
1. Sicherungs-Branch bei Umbauten, Prüfliste, Prettier, `node tools/pruefen.mjs` (Kurzmodus: nur ✗/! + Schluss, alles mit `--lang`; gemessen 39 s am 12.10., sicherheitshalber mit `timeout 580` aufrufen).
2. Neuer Test + Gegenprobe (Code kaputt → Test schlägt an). Tests, die Kindprozesse gegen die nachgebaute Cloud starten, **asynchron** (`execFile`), sonst blockiert der Server. Nie `pkill -f` mit Mustern, die im eigenen Befehl stehen.
3. Deutsch-Trainer lokal **nur bei sprachabhängigen Änderungen** (`js/sprache.js`, Texte über `APP`, Einstufungstest, Bewertung; T-1012-16) – sonst prüft die Action „Engine übernehmen“ selbst mit den Deutsch-Trainer-Inhalten und übernimmt nur bei Grün: Kopie nach Scratchpad, Engine-Dateien + `js/*.js` + `tools/pruefen/` hinein, `js/app.js`/`js/inhalte.js` zurück, `node tools/pruefen.mjs`.
4. Push (bei Ablehnung `git pull --rebase`; `docs/entscheidungen.md` beide Einträge behalten).
5. Prüflauf abwarten (`node tools/ci-status.mjs --warten`, eine Zeile je Lauf; nie rohes JSON oder ganze Protokolle – Protokoll nur bei Fehler, T-1012-13), dann „Engine übernehmen“ auslösen (GitHub-MCP `actions_run_trigger`, workflow `engine-uebernehmen.yml`), Übernahme + Prüflauf im Deutsch-Trainer prüfen (`node tools/ci-status.mjs --repo klinsermatthias-cmd/deutsch-trainer <volle Commit-Nummer>`). Geänderte Workflows selbst in den Deutsch-Trainer kopieren.
6. Andere Chats über neue Funktionen/Regeln informieren.

## Beim Umsiedeln (E-1009-18, Regeln: `docs/chats/regeln.md`)
Umsiedeln, sobald `/context` über 150.000 Tokens zeigt (T-1012-10); Session-ID nur in `docs/chats/sessions.md`.
Diese Datei vollständig überschreiben, pushen, Nachfolger per `create_session` (Quellen opi-suomea + deutsch-trainer, Titel „App-Engine: Funktionen“) anlegen. Der Nachfolger trägt seine ID ein, informiert die anderen Chats, archiviert den Vorgänger. Kette jetzt bei Generation 4 von höchstens 8.

## Regeln für Änderungen an der App (aus `CLAUDE.md` verschoben, T-1012-17)
- **Aufbau ohne Build-Schritt:** `index.html` (Gerüst), `app.css`, Skripte in `js/` (Übersicht in `docs/architektur.md`). Neuen Code in die **thematisch passende Datei** schreiben und nur die betroffene Datei lesen/ändern. Wird eine Datei zu groß (> ca. 1.500 Zeilen), thematisch weiter aufteilen.
- **Neue Skriptdatei:** in `index.html` (richtige Reihenfolge) und in `sw.js` (`FILES`) eintragen, bei Engine-Dateien auch in `tools/engine-dateien.txt` (der Workflow kopiert `js/` ganz); die Notfall-Version bettet sie automatisch ein. Code, der beim Laden sofort läuft, darf nur Funktionen aus früher geladenen Dateien aufrufen.
- **Formatierung:** nach Änderungen Prettier ausführen (`node "$(npm root -g)/prettier/bin/prettier.cjs" --write "js/*.js" sw.js`, Einstellungen in `.prettierrc.json`).
- **Vor größeren Umbauten** einen Sicherungs-Branch pushen (`sicherung/<name>`) und Matthias sagen, wie man zurückkommt.
- Vor jedem Push `node tools/pruefen.mjs` ausführen (JS-Syntax, Lektionen, Nur-anhängen-Regel gegen `origin/main`, Browser-Durchlauf mit allen Musterlösungen, Vokabeln, Hörtraining, Fehler-Training, Ansichten in 390 px, Cloud-Sync mit zwei Geräten). Neue Funktionen dort mit einem Test ergänzen.
- Sync-Logik (`pushCloud`, `pullCloud`, `mergeStates`) nur mit großer Vorsicht ändern; nie wieder blind überschreiben.
