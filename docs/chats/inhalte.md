# Startdatei: „Opi suomea (Lerninhalte)“

Stand: 8.10.2026. Diese Datei wird **überschrieben**, nicht ergänzt. Der Verlauf steht in `docs/entscheidungen.md`.
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
- 58 Themen: t01–t19 und 39 Unterthemen (zuletzt 2.3, 4.3, 12.4, 16.5, 17.4, 18.4). A1 laut `abdeckung.md` vollständig, A2-Plan in den Entwürfen.
- Matthias steht laut letztem Bericht (7.10.) bei etwa t09–t12.
- Alles live, Prüfläufe grün.

## Letzter Code
**F-1008-14** (8.10.2026). Weiter mit F-1008-15, an späteren Tagen `F-<MMTT>-1`. Codes anderer Chats (E-, D-, S-) unverändert verwenden.

## Offene Punkte
- Nächster Bericht: Analyse nach CLAUDE.md, KI-Protokoll, `ki-pruefung.json`; in jedem gelernten Thema ≥ 2 neue Übungen (F-1007-15).
- Zähler „Schwächen nach Thema“ (`lehrplan.md`) weiterführen; nach ≈ 3 Berichten Empfehlung zu E-1007-8.
- F-1007-11 (KI-Anbieter) erneut ansprechen, sobald mehr Daten da sind.
- A2-Themen t20 ff. erst nach Berichten und mit eigenem F-Code anlegen (`req`-Notizen in den Entwürfen).

## Session-IDs (`send_message`)
- „App-Engine: Funktionen“: `session_0178n7MqHz3VvKsjw8JASFNh` (E-…)
- „Deutsch-Trainer (Lehrinhalte)“: `session_01XDLQ2V6tk1eM7bLtG3XZRH` (D-…)
- dieser Chat: `session_01JzrEfnqnC1AnKhF6FkbjyW` (F-…); Simulations-Chat: siehe `docs/chats/simulation.md` (S-…)

## Arbeitsregeln
- Wünsche von Matthias: vollständige Themen, ≥ 15 Übungen mit je 2 `les`/`dlg`/`sch`, 2–4 Regelfragen, x.3 mit 2–3 „Gesprochen“-Übungen; Unterthemen x.2/x.3 (F-1007-31); Regeln in `lehrplan.md`.
- Keine doppelten Karten (F-1008-3): vor dem Anhängen gegen alle `v` prüfen, **ohne Satzzeichen** (!?.); Vorgriffe nur in die Theorie.
- Neue Themen per Python als Dicts erzeugen, hinter dem Geschwister-Thema einfügen, `json.dumps(L, ensure_ascii=False, indent=2) + "\n"`. In bestehenden Themen nur hinten anhängen; Text/Lösungen innerhalb einer Übung korrigieren ist erlaubt.
- `js/inhalte.js`: nur anhängen (Übungen in BASE_TOPICS, `GLOSS_EXTRA` vor `  saisi: {`); bestehenden Text nur mit ausdrücklichem OK. Danach Prettier.
- Theorie-Tabellen höchstens 3 Spalten, kurze Zellen: GitHub prüft mit breiterer Schrift (DejaVu Sans) als lokal.
- `pruefen.mjs` muss „Alles in Ordnung“ melden; Hinweise der Wortprüfung bewerten. Nach dem Push den GitHub-Lauf prüfen.
- `docs/entscheidungen.md` nur anhängen (`cat >> … <<'EOF'`), 3–4 Zeilen.
- Effort nach Aufgabe: Inhalte schreiben „high“, Dokumente verschieben „medium“.
