# Startdatei: „App-Engine: Funktionen“

Stand: 8.10.2026. Diese Datei wird **überschrieben**, nicht ergänzt. Der Verlauf steht in `docs/entscheidungen.md`.
Die frühere Übergabe vom 7.10. liegt wörtlich in `docs/archiv/uebergabe-funktionen-2026-10-07.md`.

## Pflichtlektüre beim Start
- `CLAUDE.md` (wird automatisch geladen)
- diese Datei
- `docs/engine.md`
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
- Alles live, Prüfläufe beider Apps grün.
- 7./8.10.:
  - Gesamtprüfung (Bericht im Archiv, siehe `docs/archiv/README.md`) mit E-1008-1 bis -13, -20, -21.
  - E-1008-7: Lektionen getrennt vom Lernstand.
  - E-1008-9: Deutsch als Lernsprache.
  - E-1008-22: Schwächen ziehen Themen vor.
  - E-1008-24: Simulations-Chat im zweiten Konto.
  - E-1008-27: Simulation 180 Tage übernommen, daraus E-1008-28, S-1008-15, S-1008-16.
  - S-1008-73: Wortprüfung im Prüfskript.
  - S-1008-88: Themenplan bis B1 übernommen.
  - E-1008-30: Token sparen, Schritt 1 (S-1008-97, -98, -99, -104, -105, -106).
  - E-1008-32: Werkzeug `tools/thema.mjs` (S-1008-103). E-1008-33: Prüfskript in `tools/pruefen/` aufgeteilt (S-1008-102).
  - E-1008-51: Vorlesen in allen Tabellenspalten (`sayall`). E-1008-57: Paket A (Autokorrektur aus, Klammern verdeckt, „Verwende“ auf Wunsch). E-1008-58/-59 mit -62: Ausrutscher, „Nur vertippt?“, Stimmenwahl, anerkannte Vokabel-Antworten.
- Davor: Pakete A–E, Simulation mit Knopf-Bedienung, Unterthemen (Einzelheiten im Archiv der Übergabe).
- Sicherungs-Branches (Rückweg je Umbau):
  - `sicherung/vor-e1008-58` (vor den Paketen B und C)
  - `sicherung/vor-pruefen-aufteilen` (vor E-1008-33, nur `tools/`)
  - `sicherung/vor-thema-werkzeug` (vor E-1008-32)
  - `sicherung/vor-token-sparen` (vor E-1008-30)
  - `sicherung/vor-e1008-22`
  - `sicherung/vor-e1008-7`
  - `sicherung/gesamtpruefung`
  - `sicherung/vor-bedienung`
  - `sicherung/vor-umbau` (letzte Einzeldatei)
  - ältere: `vor-aufraeumen`, `vor-engine`, `vor-neue-funktionen`, `vor-uebungsauswahl`, `zwischenstand-simulation`

## Letzter Code
**E-1008-64** (8.10.). Am 8.10. weiter mit **E-1008-65**, an späteren Tagen mit `E-<MMTT>-1`.

## Offene Punkte
1. **Token sparen:** Fahrplan aus `docs/pruefungen/2026-10-08-token-effizienz.md` (Abschnitt 7) am 8.10. umgesetzt (Schritte 1, 3, 5 hier; 2 und 4 im Inhalts-Chat, F-1008-11/-12). Der Bericht kann ins Archiv, sobald Matthias das bestätigt.
2. **S-1008-13:** Sicherheitskopien und Lektionen nach IndexedDB (mittel, xhigh). Wenn die Speicher-Warnung kommt oder in etwa 6 Monaten. S-1008-14 bewusst nicht.
3. **E-1008-17:** Cloud-Tabellen mit App-Kennung (nur bei geteilten Konten).
4. **E-1008-18:** CSP.
5. **E-1008-19 / E-1007-88:** Simulation mit allen Themen. Macht der Simulations-Chat.
6. **E-1007-8 (Rest):** gezielte KI-Übungen zu schwachen Themen. Erst nach einigen Berichten mit geprüfter Zuordnung.
7. Vorgemerkt für die nächste große Prüfung: `docs/ideen.md`.
8. Zur Wahl offen: **E-1008-60** (Teilpunkte nur als Anzeige), **E-1008-61** (Tageslimit für Themen-Runden).

## KI-Anbieter (8.10.2026)
- Google hat das Gemini-Projekt „Opi-Suomea“ eingeschränkt (nur noch mit Zahlungsmethode). Matthias nutzt jetzt **OpenRouter mit Prepaid-Guthaben** (Auto Top-Up aus) über „Anderer Anbieter“, Basis-URL `https://openrouter.ai/api/v1`; Schlüssel läuft nach 180 Tagen ab (Erinnerung als Routine am 30.3.2027).
- **KI-Test E-1008-42:** Phase A `google/gemini-3-flash-preview` bis 11.10., Phase B Claude Haiku 4.5 bis 14.10. (Erinnerungen als Routinen). Danach Berichte vergleichen („QUALITÄT JE MODELL“, ⚑, Token) und Modell empfehlen.
- Offen: E-1008-35 (Googles Originalmeldung anzeigen), E-1008-40 (OpenRouter-Eintrag mit Ausweich-Modell, JSON-Format, „Guthaben aufgebraucht“, günstiges Modell für einfache Aufgaben).

## Session-IDs
- Dieser Chat: `session_0178n7MqHz3VvKsjw8JASFNh` (vorher `session_01ST3ZLaUHzcNaHGuTf6pK5v`)
- „Opi suomea (Lerninhalte)“: `session_01JzrEfnqnC1AnKhF6FkbjyW` (F-…; vorher `session_01MjWzFCPLaipFDwvNEToR8s`)
- „Deutsch-Trainer (Lehrinhalte)“: `session_01XDLQ2V6tk1eM7bLtG3XZRH` (D-…)
- „Simulation“: im zweiten Konto, `send_message` geht nicht. Matthias leitet weiter (S-…).

## Arbeitsregeln dieses Chats (Matthias, verbindlich)
- Erst erklären, dann fragen, dann ändern. Jede Option bekommt einen Code `E-<MMTT>-<Nr>`. **Gepusht wird nur nach ausdrücklichem OK zu einem Code.**
- Den Stop-Hook „bitte pushen“ ignorieren, solange kein OK vorliegt.
- Blockiert die automatische Sicherheitsprüfung einen Push auf `main`: nicht umgehen. Matthias bitten, „Push auf main freigeben“ zu schreiben.
- Niemals selbst Erlaubnisse in Einstellungen eintragen.
- Vor jedem Push: Prettier und `node tools/pruefen.mjs` („Alles in Ordnung“). Vor größeren Umbauten einen Sicherungs-Branch pushen.
- Nach jedem Engine-Push im Deutsch-Trainer „Engine übernehmen“ auslösen (`engine-uebernehmen.yml`, ref `main`) und beide Prüfläufe prüfen.
- Antworten auf Deutsch, kurz. Commits auf Deutsch mit den Attributionszeilen.
- Effort: „high“ für normale Arbeit, „xhigh“ für Sync-nahe oder große Umbauten, „max“ nur für eine Gesamtprüfung.
- Keine parallelen Hilfs-Agenten mit hohem Effort: Bei der Gesamtprüfung war das Limit nach 15 Minuten erschöpft.
- Simulationen nur auf Matthias' Wunsch. Sie laufen im Simulations-Chat.
