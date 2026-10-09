# Startdatei: „App-Engine: Funktionen“

Stand: 9.10.2026 (Umsiedeln). Diese Datei wird **überschrieben**, nicht ergänzt. Der Verlauf steht in `docs/entscheidungen.md`.
Die frühere Übergabe vom 7.10. liegt wörtlich in `docs/archiv/uebergabe-funktionen-2026-10-07.md`.

## Pflichtlektüre beim Start
- `CLAUDE.md` (wird automatisch geladen)
- diese Datei
- `docs/engine.md`
- `docs/pruefliste-engine.md` (vor jedem Push durchgehen)
- aus `docs/architektur.md` nur den Abschnitt „Dateien“ (Grep `^## Dateien`, dann `offset/limit`)

## Lesestoff je Aufgabe (S-1008-99)
Vor Änderungen in diesen Bereichen ist das Genannte **Pflicht**. Abschnitte mit Grep finden (`^## …`), dann nur den Bereich lesen.

| Aufgabe | Lesen |
|---|---|
| Sync, Speichern, Datenformat | `architektur.md`: „Zustand `S`“, „Gerätekonfiguration `CFG`“, „Cloud-Sync“, „Sicherungen“; in `js/daten.js` die betroffene Funktion per Grep (`pushCloud`, `pullCloud`, `mergeStates`, `migrate`, `writeLocal`) |
| KI | `architektur.md`: „KI-Protokoll & Token-Statistik“, „Token-Verbrauch“, „KI-Verbindung“; `js/ki.js` per Grep |
| Lernlogik, Plan, Freischaltung | `architektur.md` „Lernlogik“ per Grep auf das Stichwort; `js/lernen.js`, `js/uebungen.js` per Grep |
| Übungsformate | `docs/uebungsformate.md`, in `js/formate.js` den `FMT`-Eintrag |
| Neuer Test | passendes Modul `tools/pruefen/<bereich>.mjs` (Kopfkommentar; Grep auf Überschrift oder Code); gemeinsame Werte im Objekt `P` |
| Branch eines anderen Chats übernehmen | `git diff --stat main...<branch>`, dann nur die betroffenen Dateien |
| Deutsch-Trainer, Engine-Regeln | `docs/engine.md` |
| Frühere Entscheidung | Grep auf den Code in `docs/entscheidungen.md` und `docs/archiv/` |

Regeln:
- Große Dateien nie ganz lesen: zuerst Grep, dann `offset/limit`.
- Bestehende Texte nicht umschreiben. Neue Texte kurz: ein Gedanke je Punkt.
- Befehlsausgaben kurz halten (`| tail`, Zusammenfassung).

## Stand
- Alles live, Prüfläufe beider Apps grün (letzter Engine-Stand im Deutsch-Trainer: 8fd96cd; danach nur Doku).
- 9.10. (dieser Chat):
  - E-1009-1: Gegenlese-Funktion als Idee in `docs/ideen.md` (Verweis auf `docs/chats/inhalte.md`, „Dialoge natürlicher machen“).
  - E-1008-64 + E-1009-3: Link „📘 Noch nicht gelernt?“ unter Lektions-Übungen (`S.unlearned`, synchronisiert), Fehler fehlen im Fehler-Training und in `weakPlan`, Bericht „NOCH NICHT GELERNT?“. E-1009-4: Zeile in `CLAUDE.md` Schritt 2.
  - E-1009-5: Tippfehler = genau ein Buchstabe; Finnisch: Länge (Doppelbuchstabe) ist kein Tippfehler. E-1009-6: Vokabel-Urteil mit `typo` → Ausrutscher statt `vocAlt`. E-1009-7: Analyse-Termine eindeutig, ungültige als „(ungültig)“. E-1009-8: Sync-Abbrüche im Hintergrund/≤ 5 s nach Rückkehr nicht als App-Fehler (`syncErrQuiet`).
  - E-1009-10: Link „Nur vertippt – trotzdem als richtig werten“ (≤ 2 Buchstaben, nicht streng/ord), nimmt Wertung, Wiederholung, Fehler, Statistik zurück; Bericht AUSRUTSCHER `k: "self"`.
  - E-1009-12: Endungs-Lücken (`gapParts`/`gapCut`): ganzes Wort → nur Endung prüfen, falsche Endung ohne KI falsch, KI-Regel „genau diese Form“. E-1009-14: alle Lücken gleiche grammatische Form, Hinweis als „Gesucht ist: …“.
  - E-1009-15/-16/-17: `docs/pruefliste-engine.md` (Pflicht vor jedem Push), Abschnitt „Prüflisten und Qualität“ in `CLAUDE.md`, Regeln für App-KI-Lehren und Aufteilen ab ~60 Zeilen.
- 7./8.10.: Gesamtprüfung (E-1008-1 bis -13, -20, -21), E-1008-7 Lektionen getrennt, E-1008-9 Deutsch als Lernsprache, E-1008-22 Schwächen ziehen vor, E-1008-27/-28 Simulation, E-1008-30/-32/-33 Token sparen/`tools/thema.mjs`/Prüfskript in Modulen, E-1008-51 `sayall`, E-1008-57 Paket A, E-1008-58/-59/-62 Pakete B/C (Ausrutscher, „Nur vertippt?“, Stimmenwahl, anerkannte Vokabel-Antworten).
- Davor: Pakete A–E, Simulation mit Knopf-Bedienung, Unterthemen (Archiv der Übergabe).
- Sicherungs-Branches (Rückweg je Umbau):
  - `sicherung/vor-e1009-12`, `vor-e1009-10`, `vor-e1009-5`, `vor-e1009-3` (9.10.)
  - `sicherung/vor-e1008-58` (vor den Paketen B und C)
  - `sicherung/vor-pruefen-aufteilen`, `vor-thema-werkzeug`, `vor-token-sparen`, `vor-e1008-22`, `vor-e1008-7`, `gesamtpruefung`, `vor-bedienung`, `vor-umbau` (letzte Einzeldatei)
  - ältere: `vor-aufraeumen`, `vor-engine`, `vor-neue-funktionen`, `vor-uebungsauswahl`, `zwischenstand-simulation`

## Letzter Code
**E-1009-18** (9.10.). Am 9.10. weiter mit **E-1009-19**, an späteren Tagen mit `E-<MMTT>-1`.

## Offene Punkte
1. **E-1009-18 umgesetzt:** Regel „Umsiedeln“ in `CLAUDE.md` (Startdatei neu, Nachfolger selbst anlegen, alten Chat archivieren). Inhalts-Chats darüber informieren (erledigt der Nachfolger mit der Session-ID-Meldung).
2. **KI-Test E-1008-42 auswerten:** Berichte am 11.10. (Phase A, Gemini 3 Flash) und 14.10. (Phase B, Claude Haiku 4.5) kommen in diesen Chat: „QUALITÄT JE MODELL“, ⚑, Token/Kosten, Bewertungsqualität vergleichen → Empfehlung mit Code. Auch prüfen, ob E-1009-5/-6/-12/-14 wirken (keine Längenfehler mehr als richtig, keine Tippfehler in `vocAlt`, Lücken streng).
3. Zur Wahl offen: **E-1008-60** (Teilpunkte nur als Anzeige), **E-1008-61** (Tageslimit für Themen-Runden), **E-1008-65/-66** (Dialoge gegenlesen lassen, Idee in `docs/ideen.md`).
4. KI-Anbieter offen: **E-1008-35** (Originalmeldung des Anbieters anzeigen), **E-1008-40** (OpenRouter-Eintrag mit Ausweich-Modell, JSON-Format, „Guthaben aufgebraucht“, günstiges Modell für einfache Aufgaben).
5. **S-1008-13:** Sicherheitskopien und Lektionen nach IndexedDB (xhigh). Wenn die Speicher-Warnung kommt oder in etwa 6 Monaten. S-1008-14 bewusst nicht.
6. **E-1008-17:** Cloud-Tabellen mit App-Kennung (nur bei geteilten Konten). **E-1008-18:** CSP.
7. **E-1008-19 / E-1007-88:** Simulation mit allen Themen (Simulations-Chat).
8. **E-1007-8 (Rest):** gezielte KI-Übungen zu schwachen Themen, erst nach einigen Berichten mit geprüfter Zuordnung.
9. **Token sparen:** Bericht `docs/pruefungen/2026-10-08-token-effizienz.md` kann ins Archiv, sobald Matthias das bestätigt.
10. Vorgemerkt für die nächste große Prüfung: `docs/ideen.md`. Große Dateien erst ab > 1.500 Zeilen teilen (S-1008-106).

## KI-Anbieter (Stand 9.10.2026)
- **OpenRouter mit Prepaid-Guthaben** (Auto Top-Up aus) über „Anderer Anbieter“, Basis-URL `https://openrouter.ai/api/v1`. Schlüssel läuft ca. 6.4.2027 ab.
- **KI-Test E-1008-42:** Phase A `google/gemini-3-flash-preview` bis 11.10., Phase B Claude Haiku 4.5 bis 14.10. Erster Bericht 9.10. (Gemini 3 Flash): 75 Aufrufe, 0 Fehler, 0 ⚑, Urteile meist korrekt, aber zu großzügig bei Längen-/Tippfehlern → E-1009-5 ff.
- Die App-KI kann während des Übens keine Quellen nachschlagen; Lehren für sie müssen in ihren Auftrag (E-1009-17).

## Routinen (claude.ai, starten jeweils eine frische Session – nicht an diesen Chat gebunden)
- `trig_01AHJFYbLyHfNfJoyJAHCc1y` 11.10. 18:45: Bericht schicken, auf Haiku wechseln.
- `trig_01CJeBzbAaus5qVrp8VeU9bT` 14.10. 18:45: Bericht nach Phase B.
- `trig_01NChVTCCFQF9114Ne3DYSK2` wöchentlich So 18:41 Wien: Wochenbericht.
- `trig_01QiB344yM72FseB5okxUT5q` 30.3.2027: OpenRouter-Schlüssel erneuern.
- Fremd, nicht anfassen: `trig_016iQPcWSAHQXuPCyu5koztt` (Jobsuche).

## Quellen (Cloud-Umgebung, Stand 9.10., Test des Inhalts-Chats)
- Erreichbar: Wiktionary (en/fi/de, Rohtext `index.php?title=<wort>&action=raw`), Kielitoimiston sanakirja (nur per Playwright), uusikielemme.fi, kotus.fi, kielikello.fi, duden.de, dwds.de.
- Nicht: kielikoulu.yle.fi (leitet auf gesperrtes yle.fi), kaino.kotus.fi/visk (Bot-Schutz).
- Nicht im Prüfskript nutzen (CI würde von fremden Seiten abhängen).

## Arbeitsweise Engine-Push (bewährt)
1. Sicherungs-Branch bei Umbauten, Prüfliste durchgehen, Prettier, `node tools/pruefen.mjs`.
2. Neuer Test + Gegenprobe (Code absichtlich kaputt → Test muss anschlagen, danach wiederherstellen).
3. Deutsch-Trainer lokal prüfen: Kopie des Repos, `js/*.js` und `tools/pruefen/` aus opi-suomea hineinkopieren, `js/app.js` und `js/inhalte.js` des Deutsch-Trainers zurück, `node tools/pruefen.mjs`.
4. Push (bei Ablehnung: `git pull --rebase`, Konflikte in `docs/entscheidungen.md` = beide Einträge behalten).
5. Prüflauf von opi-suomea abwarten (kann hinter Läufen anderer Chats warten), erst dann „Engine übernehmen“ auslösen und Übernahme + Prüflauf im Deutsch-Trainer prüfen.
6. Inhalts-Chats über neue Bericht-Abschnitte oder Regeln informieren.

## Beim Umsiedeln (Matthias, 9.10., E-1009-18 – Regel in `CLAUDE.md`)
Vor jedem Wechsel diese Datei vollständig überschreiben (Stand mit allen Codes seit der letzten Übergabe, letzter Code, offene Codes mit Kurzbeschreibung und Effort, laufende Tests und Termine, Routinen, Sicherungs-Branches, Session-IDs, Quellen, bewährte Abläufe) und pushen. Dann den Nachfolger selbst anlegen (`create_session`, Quellen opi-suomea + deutsch-trainer, Titel „App-Engine: Funktionen“); der Nachfolger trägt seine Session-ID hier ein, informiert die anderen Chats und archiviert den alten Chat. Diese Sessions-Kette ist bei Generation 3 von höchstens 8.
