# Startdatei: „Opi suomea (Lerninhalte)“

Stand: 9.10.2026 (Übergabe an neuen Chat). Diese Datei wird **überschrieben**, nicht ergänzt. Der Verlauf steht in `docs/entscheidungen.md`.
Die frühere Übergabe vom 7.10. liegt wörtlich in `docs/archiv/uebergabe-inhalte-2026-10-07.md`.

## Pflichtlektüre beim Start
- `CLAUDE.md` (wird automatisch geladen)
- diese Datei
- `docs/lehrplan.md` (Regeln für neue Themen, offene Erinnerungen)
- `lektionen/pruefliste.md` (vor jedem neuen Inhalt und vor jedem Push Punkt für Punkt prüfen; jede Meldung von Matthias → neue Zeile; F-1009-10)

## Lesestoff je Aufgabe
| Aufgabe | Lesen |
|---|---|
| Bericht auswerten | `CLAUDE.md` „Typischer Ablauf“, offene Erinnerungen in `lehrplan.md`, `docs/ki-qualitaet.md` (nur anhängen) |
| Neues Thema / Unterthema | `lektionen/README.md`, `docs/uebungsformate.md`, Zeile in `lektionen/abdeckung.md`, Abschnitt in `lektionen/entwuerfe-bis-b1.md`; Kernwörter im Themenplan `docs/pruefungen/2026-10-08-themenplan-bis-b1.md` nur per Grep |
| Ein Thema lesen | `node tools/thema.mjs tNN …` (Theorie ohne HTML, Wörter, Übungen mit Index, mc-Lösung mit *; S-1008-103) |
| Übungen anhängen / korrigieren | `node tools/thema.mjs tNN` (mehrere IDs möglich), nie ganz `lektionen.json`; Änderungen per Python-Skript |
| Frühere Entscheidung / alter Stand | Grep in `docs/entscheidungen.md`, `docs/archiv/` (u. a. `lehrplan-verlauf.md`) |

## Stand
- 58 Themen: t01–t19 und 39 Unterthemen (zuletzt 2.3, 4.3, 12.4, 16.5, 17.4, 18.4). A1 laut `abdeckung.md` vollständig, A2-Plan t20–t35 in `lektionen/entwuerfe-bis-b1.md`.
- Letzter Bericht 9.10.: t01–t09 gelernt (dazu t01b, t02b), t10 und 9 Unterthemen frei, nicht begonnen. Schwach: t05 (neutrale Vokale e/i), t09 (Schreibweise Wochentage), t01b (Buchstabennamen), Vokal-/Konsonantenlänge beim Tippen. Empfohlen: erst t05b, t08b, t07b, t06b, dann t10. Details in `lehrplan.md` („Wo steht Matthias“).
- Ausgewertet mit F-1009-3 (`ki-pruefung.json`: va:t02b-2-r:ei kostin hyvin = falsch), F-1009-4 (35 neue Übungen in t01–t09, t01b, t02b, Merkhilfen t05/t09, Glosse „aja“), F-1009-5 (Befunde an Funktionen-Chat).
- Alles live (Commit 0c020b7), Prüfläufe grün.

## Letzter Code
**F-1010-7** (10.10.2026; F-1009-9, F-1010-2, F-1010-4 und F-1010-6 vergeben, nicht gewählt). Weiter mit F-1010-8, an späteren Tagen `F-<MMTT>-1`. Codes anderer Chats (E-, D-, S-) unverändert verwenden.

## Offene Punkte
- Nächster Bericht: Analyse nach CLAUDE.md, KI-Protokoll, `ki-pruefung.json`; in jedem gelernten Thema ≥ 2 neue Übungen (F-1007-15).
- Abschnitt „NOCH NICHT GELERNT?“ im Bericht (E-1008-64/E-1009-3, F-1009-1): Zeilen `<tid> ex[<Index>] (<Titel>): <Aufgabe>` – fehlende Theorie bzw. Vokabeln ergänzen oder die Übung anpassen (Index bleibt, nur anhängen). Diese Fehler zählen nicht als Schwäche.
- Zähler „Schwächen nach Thema“ (`lehrplan.md`) weiterführen; nach ≈ 3 Berichten Empfehlung zu E-1007-8.
- KI läuft seit 9.10. über OpenRouter (F-1009-2): Modelle getrennt bewerten („QUALITÄT JE MODELL“), Token/Kosten beobachten; nach 2–3 Berichten Empfehlung je Aufgabe (Erinnerung in `lehrplan.md`).
- F-1009-5 umgesetzt (E-1009-5 bis -8): beim nächsten Bericht prüfen, ob Längenfehler falsch, Tippfehler unter AUSRUTSCHER, keine „Load failed“-App-Fehler.
- Lücken (seit E-1009-12/-14 streng): KI akzeptiert nur die Form der Musterlösung; gleichwertige Lösungen in `a` eintragen, `h` sagt was gesucht ist, ohne Bau-Rezept (F-1009-6/-8).
- **A2-Themen t20–t35d NICHT selbst anlegen** (Entscheidung Matthias, 9.10.): Der Simulations-Chat erstellt sie als Entwurf auf Branch `pruefung/abschluss-2026-10-08` (`docs/pruefungen/entwurf-a2/`, `lektionen-a2.json`, Natürlichkeitsprüfung S-1009-1). Der Funktionen-Chat meldet, wenn der Entwurf geprüft ist. Dann übernehme ich ihn in `lektionen/lektionen.json` (mit F-Code nach Matthias' OK, Prüfliste durchgehen). Vorschläge zu t01–t19c kommen voraussichtlich mit.

- **Automatische Auswertung (F-1010-1, Matthias 10.10.):** Der Funktionen-Chat baut den automatischen Bericht in Supabase, den Lesezugang als Umgebungs-Geheimnis und ein Leseskript (Antwort mit E-Code abwarten). Danach richte ich eine tägliche Routine ein, die nur bei neuem Bericht läuft: **vollständige Auswertung wie bei einem eingefügten Bericht** (Analyse, KI-Protokoll bzw. Opettaja je Modell, KI-Übungen und Vokabel-Antworten in `ki-pruefung.json`, Ausrutscher, „Noch nicht gelernt?“, Schwächen nach Thema, Erinnerungen in `lehrplan.md`, neue Übungen, sobald alles sitzt) nach Prüfliste mit Quellen. Danach Zusammenfassung mit F-Code an Matthias. Push nur nach OK. Bericht nie ins Repo.

- **Routine „Opi suomea: Auswertung jeden 2. Tag“ (F-1010-3/-5/-7, `trig_01CVPFYU7TXj14KDVNpiKhph`):** ab Mo 12.10. jeden 2. Tag um 5:45 Uhr (Europe/Vienna; Cron `2-30/2`, also an geraden Tagen, am Monatsende einmal 3 Tage Abstand). Sie weckt **diesen Chat**. Er startet mit `create_session` (source_url opi-suomea, Modell Opus) eine Auswertungs-Sitzung mit dem Auftrag aus `lektionen/auswertung-auftrag.md`. Neue Sitzungen sehen die Geheimnisse OPI_SB_*/OPI_BERICHT_*. Routinen mit frischer Sitzung gehen nicht, weil sie kein Repository und keine Chat-Werkzeuge haben (Test 10.10.). Die Sitzung wertet nur bei neuem Bericht aus, pusht auf Branch `auswertung/<JJJJ-MM-TT-HHMM>` (zugleich Merker) und meldet sich per send_message, auch bei „nichts Neues“. Dieser Chat zeigt Matthias die Auswertung mit F-Code, übernimmt erst nach OK auf main (Prüfliste, pruefen.mjs) und archiviert die Sitzung. **Beim Umsiedeln:** Die Routine ist an diese Session-ID gebunden. Neu anlegen (gleiche Angaben), alte löschen und die Session-ID oben aktualisieren.

## Ideen für später (nur gesammelt)
- **Dialoge natürlicher machen** (Wunsch von Matthias' finnischer Freundin, 8.10.2026, F-1008-15 zurückgestellt): alle `dlg`/`les` prüfen – Fehler, steif wegen fehlender Grammatik (feste natürliche Wendung als zusätzliche Lösung), Schriftsprache (Hinweis „gesprochen: …“ in `h`), unnatürlicher Ablauf (Szene umschreiben). Erst Liste mit Vorschlägen, dann F-Codes. Effort „high“. Zusammen mit der geplanten Gegenlese-Funktion (E-1008-65/-66).

## Session-IDs (`send_message`)
- „App-Engine: Funktionen“: `session_01AfQVTQtztrJp6zPsrB6cv4` (E-…; seit 9.10., Vorgänger session_0178n7MqHz3VvKsjw8JASFNh archiviert)
- „Deutsch-Trainer (Lehrinhalte)“: `session_01XDLQ2V6tk1eM7bLtG3XZRH` (D-…)
- dieser Chat (Lerninhalte): `session_01Qt52MWJw4FDPSysStkj8At` (F-…); Vorgänger bis 9.10.: `session_01JzrEfnqnC1AnKhF6FkbjyW` (geschlossen), davor `session_01MjWzFCPLaipFDwvNEToR8s`
- Simulations-Chat (S-…) läuft in Matthias' zweitem Konto – per `send_message` nicht erreichbar; Infos über Matthias (Text zum Einfügen).

## Arbeitsregeln
- Wünsche von Matthias: vollständige Themen, ≥ 15 Übungen mit je 2 `les`/`dlg`/`sch`, 2–4 Regelfragen, x.3 mit 2–3 „Gesprochen“-Übungen; Unterthemen x.2/x.3 (F-1007-31); Regeln in `lehrplan.md`.
- Keine doppelten Karten (F-1008-3): vor dem Anhängen gegen alle `v` prüfen, **ohne Satzzeichen** (!?.); Vorgriffe nur in die Theorie.
- Neue Themen per Python als Dicts erzeugen, hinter dem Geschwister-Thema einfügen, `json.dumps(L, ensure_ascii=False, indent=2) + "\n"`. In bestehenden Themen nur hinten anhängen; Text/Lösungen innerhalb einer Übung korrigieren ist erlaubt.
- `js/inhalte.js`: nur anhängen (Übungen in BASE_TOPICS: per Node-Skript vor dem Ende `\n    ]\n  }` des Themas einfügen; `GLOSS_EXTRA`: ans Ende, zuletzt `aja`); bestehenden Text nur mit ausdrücklichem OK. Danach Prettier (`node "$(npm root -g)/prettier/bin/prettier.cjs" --write js/inhalte.js`).
- Wortprüfung über alle Themen: `WORTCHECK=alle node tools/pruefen.mjs`; neue „✗ Antippen: ohne Bedeutung“ mit `GLOSS_EXTRA` beheben.
- GitHub-Lauf prüfen: `curl -s "https://api.github.com/repos/klinsermatthias-cmd/opi-suomea/actions/runs?head_sha=$(git rev-parse HEAD)"` (status/conclusion).
- `ki-qualitaet.md`: nur anonym (keine Antworten von Matthias zitieren).
- Theorie-Tabellen höchstens 3 Spalten, kurze Zellen: GitHub prüft mit breiterer Schrift (DejaVu Sans) als lokal.
- `pruefen.mjs` muss „Alles in Ordnung“ melden; Hinweise der Wortprüfung bewerten. Nach dem Push den GitHub-Lauf prüfen.
- `docs/entscheidungen.md` nur anhängen (`cat >> … <<'EOF'`), 3–4 Zeilen.
- Effort nach Aufgabe: Inhalte schreiben „high“, Dokumente verschieben „medium“.
