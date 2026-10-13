# Startdatei: „Opi suomea (Lerninhalte)“

Stand: 13.10.2026 (Generation 4; offene Codes umgesetzt, Starter-Weg). Diese Datei wird **überschrieben**, nicht ergänzt. Der Verlauf steht in `docs/entscheidungen.md`.
Frühere Übergaben wörtlich in `docs/archiv/` (u. a. `uebergabe-inhalte-2026-10-07.md`).

## Pflichtlektüre beim Start
- `CLAUDE.md` (wird automatisch geladen)
- diese Datei
- `docs/lehrplan.md` (Regeln für neue Themen, offene Erinnerungen)
- `lektionen/pruefliste.md` (vor jedem neuen Inhalt und vor jedem Push Punkt für Punkt prüfen; jede Meldung von Matthias → neue Zeile; F-1009-10)

## Lesestoff je Aufgabe
| Aufgabe | Lesen |
|---|---|
| Bericht auswerten | Abschnitt „Typischer Ablauf“ unten, offene Erinnerungen in `lehrplan.md`, `docs/ki-qualitaet.md` (nur anhängen) |
| Neues Thema / Unterthema | `lektionen/README.md`, `docs/uebungsformate.md`, Zeile in `lektionen/abdeckung.md`, Abschnitt in `lektionen/entwuerfe-bis-b1.md`; Kernwörter im Themenplan `docs/pruefungen/2026-10-08-themenplan-bis-b1.md` nur per Grep |
| Ein Thema lesen | `node tools/thema.mjs tNN …` (Theorie ohne HTML, Wörter, Übungen mit Index, mc-Lösung mit *; S-1008-103) |
| Übungen anhängen / korrigieren | `node tools/thema.mjs tNN` (mehrere IDs möglich), nie ganz `lektionen.json`; Änderungen per Python-Skript |
| Frühere Entscheidung / alter Stand | Grep in `docs/entscheidungen.md`, `docs/archiv/` (u. a. `lehrplan-verlauf.md`) |

## Stand
- 58 Themen: t01–t19 und 39 Unterthemen. A1 laut `abdeckung.md` vollständig, A2-Plan t20–t35 in `lektionen/entwuerfe-bis-b1.md`.
- Seit der Übergabe 9.10. umgesetzt: F-1009-6 (t05-Hinweise „im Restaurant …“, `js/inhalte.js`), F-1009-7/-8 (42 Hinweise in `lektionen.json` ohne Bau-Rezept, `a` erweitert: t15#5 +pitää, t18#6 +lämmintä, t09c#2 +tulee), F-1009-10/-11 (`lektionen/pruefliste.md` mit 10 Zeilen + Quellentabelle, 2. Test), F-1010-1/-3/-5/-7 (automatische Auswertung, Opus, Archivieren, jeden 3. Tag), F-1011-1 (`.claude/settings.json` effortLevel „high“ für neue Sitzungen; inzwischen ggf. vom Token-Paket T-1012 geändert).
- **Auswertungen 10.10. und 12.10. auf main** (13.10., F-1010-8 + F-1013-A1, CI grün, Branch `auswertung/2026-10-12-1149`, Sitzung archiviert): 44 + 40 angehängte Übungen in t01–t09/t01b/t02b/t02c/t03b, `GLOSS_EXTRA` katsoo, 8 Urteile in `ki-pruefung.json`, Prüfliste Zeile 11 („Schreibweise als eigene Übung“). F-1013-A2: t06 „Ich liebe Finnland.“ mit `h` (Partitiv nach rakastaa). F-1013-A3: E-1007-8 zurückgestellt (Tippfehler landen bei t01/t05).
- **Prüfbericht 12.10. (S-1012-127 bis -129) auf main** (13.10., F-1013-1 bis -5): `req` t17c/t17d, Kästen „Wörter, die du hier schon brauchst“ (t02c, t04c, t05b, t08d), 27 `GLOSS_EXTRA`, `pruef-ausnahmen.json`, Regelfragen mit `x` in allen Grammatikthemen (3 neue mc in t06b/t10b/t12b), kaksoisvee, 3 `h` ohne Bau-Rezept, t16d kenet, t09#26 umformuliert. F-1013-6 (Vorschlagsliste) → F-1013-7 bis -11, umgesetzt.
- **Offene Codes 13.10. umgesetzt** (F-1013-7 bis -11): t18c Jahreszahl nach Kotus, t16e laituri/raide, t17c ex2, t04b ex5 +todella, t17b sattua/„Ei satu.“, je eine `tab` in t03b/t07b/t08c/t10b/t11c/t14c/t15c, t12c „In der Stadt“ (Theorie + `les`), `GLOSS_EXTRA` raide/raiteelle/satu. `lämmintä` in t18#6 bleibt (Ohjepankki „Predikatiivi: on mukava vai mukavaa“; Prüfliste Zeile 13). F-1010-9 erledigt sich mit dem KI-Test-Trigger 14.10.; F-1010-10 an den Funktionen-Chat geschickt (er schlägt Matthias einen E-Code vor). F-1012-1/-2: Starter-Sitzung läuft (siehe Routine).
- Analyse 12.10.: 177 Wörter, 148 Karten Rückstand, Serie 7; Rückschritt t08 63 %; schwach t02b 63 %, t03b 60 %, t02c/t06/t07 75 %; ä/a-Verwechslungen, Selbstwertung „vertippt“ zu oft (haitta/haittaa, minus/miinus); noch nicht gelernt: Rakastan Suomea. Empfehlung: Rückstand abbauen, t08/t02b/t03b auf ≥ 80 %, erst dann t10. KI: nur Gemini 3 Flash (217 Aufrufe, 0 Ausfälle), meist richtig, teils zu großzügig; ~1039k ein / ~183k aus pro Monat. App-Fehler seit 10.10. keine.

## Letzter Code
**F-1013-11** (13.10.2026). Weiter mit F-1013-12, an späteren Tagen `F-<MMTT>-1`. Auswertungs-Sitzungen nutzen eigene Codes `F-<MMTT>-A<Nr>` (zuletzt F-1013-A3, alle erledigt). Codes anderer Chats (E-, D-, S-, T-) unverändert verwenden.

## Offene Codes (Matthias hat noch nicht entschieden)
- keine (Stand 13.10.).

## Offene Punkte
- Nächster Bericht: Analyse nach „Typischer Ablauf“ unten, KI-Protokoll, `ki-pruefung.json`; in jedem gelernten Thema ≥ 2 neue Übungen (F-1007-15).
- Abschnitt „NOCH NICHT GELERNT?“ (F-1009-1): fehlende Theorie/Vokabeln ergänzen oder Übung anpassen (Index bleibt, nur anhängen); zählt nicht als Schwäche.
- Zähler „Schwächen nach Thema“ (`lehrplan.md`) weiterführen; Empfehlung nach 3 Berichten gegeben: E-1007-8 zurückgestellt (F-1013-A3).
- KI über OpenRouter (F-1009-2): Modelle getrennt bewerten, nach 2–3 Berichten Empfehlung je Aufgabe (Erinnerung in `lehrplan.md`).
- Lücken streng (E-1009-12/-14): KI akzeptiert nur die Form der Musterlösung; gleichwertige Lösungen in `a`, `h` sagt was gesucht ist, ohne Bau-Rezept (Prüfliste Nr. 2/3).
- **A2-Themen t20–t35d NICHT selbst anlegen** (Matthias 9.10.): Entwurf kommt vom Simulations-Chat (Branch `pruefung/abschluss-2026-10-08`); der Funktionen-Chat meldet, wenn geprüft. Dann mit F-Code nach OK in `lektionen.json` übernehmen (Prüfliste).

## Routine: Auswertung jeden 3. Tag (F-1010-3/-5/-7, seit 13.10. Starter-Weg F-1012-1/-2)
- **Starter-Sitzung** `session_01P8hH2UZPLEjNNtHxbS4hzc` („Opi suomea: Auswertungs-Starter“, Sonnet) nach `lektionen/auswertung-starter.md`: Sie sichert selbst die `send_later`-Kette „Opi suomea: Auswertung“ (nächster Lauf 16.10. 03:45Z, ab 25.10. 04:45Z), archiviert fertige Auswertungs-Sitzungen und startet die neue Auswertungs-Sitzung (Opus). Diese zeigt Matthias das Ergebnis direkt; **dieser Chat wird nicht mehr geweckt**. Alter Wecker an diesen Chat (`trig_01PKcriQRiRxwXyKtijQnZFE`) am 13.10. gelöscht.
- Prüfen bei Bedarf: `list_triggers` – genau ein künftiger Trigger „Opi suomea: Auswertung“ an die Starter-Sitzung. Fehlt er, der Starter-Sitzung per `send_message` Punkt 1 aus `auswertung-starter.md` schicken.
- Grundlagen: Neue Sitzungen sehen die Geheimnisse OPI_SB_*/OPI_BERICHT_* (nie ausgeben). Routinen mit frischer Sitzung gehen nicht (kein Repo, keine Chat-Werkzeuge, Test 10.10.). Cron kann „jeden 3. Tag“ nicht über Monatsgrenzen. Branch `auswertung/<JJJJ-MM-TT-HHMM>` ist zugleich Merker „schon ausgewertet“. Bericht nie ins Repo.
- Weitere Routinen des Kontos (nicht von diesem Chat): „Wöchentlich: Bericht für Claude schicken“ (So 18:41), „KI-Test: Bericht nach Testphase B“ (14.10.), OpenRouter-Schlüssel (30.3.2027).


## Ideen für später (nur gesammelt)
- **Theorie-Karten zu allen Theorieteilen** (Wunsch Matthias, 11.10.2026, noch kein Code): Zu jedem Theorieteil jedes Themas eigene Abfragen, damit nichts vergessen wird (z. B. „Wie bildet man Ja/Nein-Fragen?“ → Verb + -ko/-kö an den Anfang), dazu jeweils Übungen. Mehr Übungen pro Thema sind ausdrücklich erwünscht: Theoriefragen und Übungen zu allen Themen in ausreichender Zahl. Vorgehen später: je Thema die Theorie in Bausteine zerlegen, je Baustein mindestens eine Regelfrage (`mc` mit `x`) und Übungen, Prüfliste und Quellen. Geklärt (Matthias, 11.10.): „Karten“ = zusätzliche Fragen in den Übungsrunden (normale Übungen, v. a. `mc` mit `x`, nur anhängen), die wie alle Übungen nach Wissensstand wiederholt werden – keine Engine-Änderung nötig.
- **Dialoge natürlicher machen** (Wunsch von Matthias' finnischer Freundin, 8.10.2026, F-1008-15 zurückgestellt): alle `dlg`/`les` prüfen – Fehler, steif wegen fehlender Grammatik (feste natürliche Wendung als zusätzliche Lösung), Schriftsprache (Hinweis „gesprochen: …“ in `h`), unnatürlicher Ablauf (Szene umschreiben). Erst Liste mit Vorschlägen, dann F-Codes. Effort „high“. Zusammen mit der geplanten Gegenlese-Funktion (E-1008-65/-66).

## Session-IDs (`send_message`)
In `docs/chats/sessions.md` (T-1012-18).

## Arbeitsregeln
- Wünsche von Matthias: vollständige Themen, ≥ 15 Übungen mit je 2 `les`/`dlg`/`sch`, 2–4 Regelfragen, x.3 mit 2–3 „Gesprochen“-Übungen; Unterthemen x.2/x.3 (F-1007-31); Regeln in `lehrplan.md`.
- Keine doppelten Karten (F-1008-3): vor dem Anhängen gegen alle `v` prüfen, **ohne Satzzeichen** (!?.); Vorgriffe nur in die Theorie.
- Neue Themen per Python als Dicts erzeugen, hinter dem Geschwister-Thema einfügen, `json.dumps(L, ensure_ascii=False, indent=2) + "\n"`. In bestehenden Themen nur hinten anhängen; Text/Lösungen innerhalb einer Übung korrigieren ist erlaubt.
- `js/inhalte.js`: nur anhängen (Übungen in BASE_TOPICS: per Node-Skript vor dem Ende `\n    ]\n  }` des Themas einfügen; `GLOSS_EXTRA`: ans Ende, zuletzt `aja`); bestehenden Text nur mit ausdrücklichem OK. Danach Prettier (`node "$(npm root -g)/prettier/bin/prettier.cjs" --write js/inhalte.js`).
- Wortprüfung über alle Themen: `WORTCHECK=alle node tools/pruefen.mjs`; neue „✗ Antippen: ohne Bedeutung“ mit `GLOSS_EXTRA` beheben.
- GitHub-Lauf prüfen: `node tools/ci-status.mjs [--warten]` (eine Zeile je Lauf; nie das rohe JSON der GitHub-API – ≈ 4.800 Tokens pro Abfrage, T-1012-13).
- `ki-qualitaet.md`: nur anonym (keine Antworten von Matthias zitieren).
- Theorie-Tabellen höchstens 3 Spalten, kurze Zellen: GitHub prüft mit breiterer Schrift (DejaVu Sans) als lokal.
- `pruefen.mjs` muss „Alles in Ordnung“ melden; Hinweise der Wortprüfung bewerten. Nach dem Push den GitHub-Lauf prüfen.
- `docs/entscheidungen.md` nur anhängen (`cat >> … <<'EOF'`), 3–4 Zeilen.
- Effort nach Aufgabe (T-1012-11): Standard „medium“; Inhalte schreiben und Quellenprüfung „high“; Verwaltung „low“.
- Formen in Quellen zuerst mit `node tools/quellen.mjs <wort> …` nachschlagen (kompakte Ausgabe, T-1012-20); ganze Seiten bzw. Playwright nur, wenn das nicht reicht.

## Typischer Ablauf (aus `CLAUDE.md` verschoben, T-1012-17): Bericht → Analyse → neue Lektionen
1. Matthias kopiert in der App unter *Einstellungen (Tab „Asetukset“) → Bericht für Claude* seinen Lernstand und fügt ihn im Chat ein.
2. Analysiere: Niveau, Fehlermuster, schwache Wörter, welche Themen sitzen. Prüfe dabei die **offenen Erinnerungen** in `docs/lehrplan.md` und sprich sie an, wenn ihr Zeitpunkt gekommen ist.
   Prüfe außerdem das **KI-PROTOKOLL** im Bericht: jedes KI-Urteil auf finnische Korrektheit (⚑ = von Matthias als falsch markiert, zuerst ansehen), erzeugte Übungen, Terminwahl, Token-Verbrauch. Gib Matthias eine kurze Qualitätsbewertung je Funktion/Modell und trage nur eine anonyme Zusammenfassung in `docs/ki-qualitaet.md` ein.
   Enthält der Bericht **„KI-ÜBUNGEN ZUR PRÜFUNG“**: jede Übung (gid) auf finnische Korrektheit prüfen (Aufgabe, Musterlösung, Hinweis, Erklärung) und das Urteil in `lektionen/ki-pruefung.json` eintragen – `{"<gid>": {"ok": true}}` bzw. `{"<gid>": {"ok": false, "korrektur": "richtige Lösung", "grund": "kurz warum"}}`; bestehende Einträge behalten. Matthias das Ergebnis zeigen und zusammen mit den neuen Lektionen pushen. Die App zeigt danach ✓/✗ und streicht Fehler aus fehlerhaften KI-Übungen aus dem Fehler-Training.
   Enthält der Bericht **„VOKABEL-ANTWORTEN ZUR PRÜFUNG“** (von Opettaja anerkannte Antworten, die nicht in der Vokabelliste stehen): jede Antwort prüfen und mit dem Schlüssel aus der Zeile in `lektionen/ki-pruefung.json` eintragen – `{"va:<Karte>:<Antwort>": {"ok": true}}` bzw. `{"ok": false, "korrektur": "…", "grund": "…"}`; richtige zusätzlich in die bestehende Vokabel aufnehmen (Index bleibt). Den Abschnitt **„AUSRUTSCHER“** (ä/ö vergessen, „Nur vertippt“) in die Analyse einbeziehen.
   Enthält der Bericht **„NOCH NICHT GELERNT?“** (Übungen, die laut Matthias Ungelerntes abfragen): je Übung Theorie/Vokabel des Themas ergänzen oder die Übung anpassen (Index bleibt, nur anhängen).
3. Schreibe 1–3 neue Themen nach `docs/lehrplan.md` und dem Bericht in `lektionen/lektionen.json` (Regeln in `lektionen/README.md`), aktualisiere `docs/lehrplan.md`.
4. Prüfe finnische Korrektheit selbst und führe `node tools/pruefen.mjs` aus (muss „Alles in Ordnung“ melden), dann commit + push auf `main`.
5. Beim nächsten Öffnen lädt die App die neuen Themen automatisch („Neue Themen von Claude geladen“). Der Fortschritt bleibt erhalten.
