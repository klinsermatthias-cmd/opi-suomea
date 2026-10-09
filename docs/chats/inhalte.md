# Startdatei: „Opi suomea (Lerninhalte)“

Stand: 9.10.2026 (Übergabe an neuen Chat). Diese Datei wird **überschrieben**, nicht ergänzt. Der Verlauf steht in `docs/entscheidungen.md`.
Die frühere Übergabe vom 7.10. liegt wörtlich in `docs/archiv/uebergabe-inhalte-2026-10-07.md`.

## Pflichtlektüre beim Start
- `CLAUDE.md` (wird automatisch geladen)
- diese Datei
- `docs/lehrplan.md` (Regeln für neue Themen, offene Erinnerungen)

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
**F-1009-5** (9.10.2026). Weiter mit F-1009-6, an späteren Tagen `F-<MMTT>-1`. Codes anderer Chats (E-, D-, S-) unverändert verwenden.

## Offene Punkte
- Nächster Bericht: Analyse nach CLAUDE.md, KI-Protokoll, `ki-pruefung.json`; in jedem gelernten Thema ≥ 2 neue Übungen (F-1007-15).
- Abschnitt „NOCH NICHT GELERNT?“ im Bericht (E-1008-64/E-1009-3, F-1009-1): Zeilen `<tid> ex[<Index>] (<Titel>): <Aufgabe>` – fehlende Theorie bzw. Vokabeln ergänzen oder die Übung anpassen (Index bleibt, nur anhängen). Diese Fehler zählen nicht als Schwäche.
- Zähler „Schwächen nach Thema“ (`lehrplan.md`) weiterführen; nach ≈ 3 Berichten Empfehlung zu E-1007-8.
- KI läuft seit 9.10. über OpenRouter (F-1009-2): Modelle getrennt bewerten („QUALITÄT JE MODELL“), Token/Kosten beobachten; nach 2–3 Berichten Empfehlung je Aufgabe (Erinnerung in `lehrplan.md`).
- Antwort des Funktionen-Chats zu F-1009-5 abwarten (dort E-Codes): Längenfehler im Finnischen nicht als Tippfehler werten, Tippfehler-Antworten nicht als Vokabel-Alternative speichern, „topicId“ in der Gesamtanalyse, Sync-Meldungen „Load failed“. Bei der nächsten Auswertung prüfen, ob umgesetzt.
- A2-Themen t20 ff. erst nach Berichten und mit eigenem F-Code anlegen (`req`-Notizen in den Entwürfen).

## Ideen für später (nur gesammelt)
- **Dialoge natürlicher machen** (Wunsch von Matthias' finnischer Freundin, 8.10.2026, F-1008-15 zurückgestellt): alle `dlg`/`les` prüfen – Fehler, steif wegen fehlender Grammatik (feste natürliche Wendung als zusätzliche Lösung), Schriftsprache (Hinweis „gesprochen: …“ in `h`), unnatürlicher Ablauf (Szene umschreiben). Erst Liste mit Vorschlägen, dann F-Codes. Effort „high“. Zusammen mit der geplanten Gegenlese-Funktion (E-1008-65/-66).

## Session-IDs (`send_message`)
- „App-Engine: Funktionen“: `session_0178n7MqHz3VvKsjw8JASFNh` (E-…)
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
