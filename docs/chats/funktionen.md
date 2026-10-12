# Startdatei: „App-Engine: Funktionen“

Stand: 12.10.2026 (Umsiedeln, Generation 3 → 4). Diese Datei wird **überschrieben**, nicht ergänzt. Verlauf: `docs/entscheidungen.md`; frühere Übergabe: `docs/archiv/uebergabe-funktionen-2026-10-07.md`.

## Pflichtlektüre beim Start
- `CLAUDE.md` (wird automatisch geladen), diese Datei, `docs/engine.md`
- `docs/pruefliste-engine.md` (vor jedem Push durchgehen)
- aus `docs/architektur.md` nur den Abschnitt „Dateien“ (Grep `^## Dateien`, dann `offset/limit`)

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
- **Seit 12.10.:** Matthias lässt sich die offenen Themen **einzeln** vorschlagen (je Thema: kurzer Befund, Plan, Effort, Codes „umsetzen“/„verwerfen“, oder „Ideenliste“ = bleibt gesammelt). Nach seiner Antwort das nächste Thema.
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
**E-1012-10** (12.10.). Nächster Code: am selben Tag E-1012-11, sonst `E-<MMTT>-1`.

## Offene Themen (Reihenfolge zum Vorschlagen)
1. ✔ besprochen 12.10.: **„Noch nicht gelernt?“ zählt ins Rundenergebnis** – bestätigter Fehler (`unlearnedOn` nur in Fehler-Training/`weakCounts`, nicht in `finishTopic`/Themen-Ergebnis). Plan E-1012-1 (aus Rundenergebnis nehmen, Anzeige „zählt nicht“, keine Ersatz-Übung, medium). Matthias: **bleibt auf der Ideenliste**.
2. ✔ besprochen 12.10.: Zahlentasten 1–4 im Vokabeltrainer (PC; nur bei aufgedeckter Antwort, nicht in Eingabefeldern; Ziffern auf den Knöpfen; Enter/Leertaste deckt auf – vorher prüfen), klein. Matthias: **bleibt auf der Ideenliste**.
3. ✔ besprochen 12.10.: Antippen: Nomen mit Artikel (Plan E-1012-5/-6). Matthias: **bleibt auf der Ideenliste**.
4. ✔ besprochen 12.10.: E-1009-20 Knopf „Fehler in der Übung?“ (Plan E-1012-7/-8). Matthias: **bleibt auf der Ideenliste**.
5. ▶ **als Nächstes:** E-1009-23 Prüfvermerk je Thema + Warnung im Prüfskript, medium.
6. Sprachausgabe in besserer Qualität (Stimmenwahl gibt es schon, E-1008-62; offen: KI-TTS/Audiodateien), high.
7. Teilpunkte bei mehreren Feldern (E-1008-60 nur Anzeige), medium.
8. Dialoge gegenlesen lassen (E-1008-65/-66), medium.
9. E-1009-21 bestätigte Fehler als „nicht wiederholen“ in Opettajas Auftrag, medium.
10. E-1009-22 `tools/quellen.mjs` (Formen gegen Wiktionary), high.
11. E-1007-8 Rest: gezielte KI-Übungen zu schwachen Themen (erst nach mehreren Berichten).
12. KI-Anbieter: E-1008-35 (Originalmeldung zeigen), E-1008-40 (Ausweich-Modell, günstiges Modell).
13. E-1010-1 deutsche KI-Regel mit Beispielen – nach Auroras ersten Berichten.
14. E-1008-61 Tageslimit für Themen-Runden.
15. Langfristig: S-1008-13 IndexedDB, E-1008-17 App-Kennung in der Cloud, E-1008-18 CSP, E-1008-19 Simulation mit allen Themen, große Dateien teilen (> 1.500 Zeilen), Architektur in der nächsten großen Prüfung.
- Warten auf andere: E-1009-19 (Inhalts-Chat prüft Themen vorab mit Quellen), A2-Entwurf (s. o.).

## Termine
- **KI-Test E-1008-42:** Bericht Phase A (Gemini 3 Flash) war am 11.10. fällig, Phase B (Claude Haiku 4.5) am 14.10. → beide Berichte vergleichen („QUALITÄT JE MODELL“, ⚑, Token/Kosten, Bewertungsqualität; wirken E-1009-5/-6/-12/-14?) → Empfehlung mit Code. Seit E-1010-6 kann der Bericht auch per `tools/bericht-holen.mjs` geholt werden (nur in neuer Sitzung).

## Session-IDs
- **Dieser Chat** („App-Engine: Funktionen“, E-…): `session_01RDQuEyYTikM25QrUxLnCu5` (Generation 4, seit 12.10.). Vorgänger: `session_01AfQVTQtztrJp6zPsrB6cv4` (Generation 3, bis 12.10.), davor `session_0178n7MqHz3VvKsjw8JASFNh`.
- „Opi suomea (Lerninhalte)“ (F-…): `session_01Qt52MWJw4FDPSysStkj8At`
- „Deutsch-Trainer (Lehrinhalte)“ (D-…): `session_01XDLQ2V6tk1eM7bLtG3XZRH`
- „Simulation“ (S-…): zweites Konto, nicht per `send_message` erreichbar

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
1. Sicherungs-Branch bei Umbauten, Prüfliste, Prettier, `node tools/pruefen.mjs` (dauert ~5–9 min; mit `timeout 580` aufrufen).
2. Neuer Test + Gegenprobe (Code kaputt → Test schlägt an). Tests, die Kindprozesse gegen die nachgebaute Cloud starten, **asynchron** (`execFile`), sonst blockiert der Server. Nie `pkill -f` mit Mustern, die im eigenen Befehl stehen.
3. Deutsch-Trainer lokal: Kopie nach Scratchpad, Engine-Dateien + `js/*.js` + `tools/pruefen/` hinein, `js/app.js`/`js/inhalte.js` zurück, `node tools/pruefen.mjs`.
4. Push (bei Ablehnung `git pull --rebase`; `docs/entscheidungen.md` beide Einträge behalten).
5. Prüflauf abwarten (`gh run watch <id> -R klinsermatthias-cmd/opi-suomea --exit-status`), dann „Engine übernehmen“ auslösen (GitHub-MCP `actions_run_trigger`, workflow `engine-uebernehmen.yml`), Übernahme + Prüflauf im Deutsch-Trainer prüfen. Geänderte Workflows selbst in den Deutsch-Trainer kopieren.
6. Andere Chats über neue Funktionen/Regeln informieren.

## Beim Umsiedeln (E-1009-18)
Diese Datei vollständig überschreiben, pushen, Nachfolger per `create_session` (Quellen opi-suomea + deutsch-trainer, Titel „App-Engine: Funktionen“) anlegen. Der Nachfolger trägt seine ID ein, informiert die anderen Chats, archiviert den Vorgänger. Kette jetzt bei Generation 4 von höchstens 8.
