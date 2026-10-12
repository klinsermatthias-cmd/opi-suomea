# Nachmessung nach der Umsetzung (S-1012-119, 12.10.2026 abends)

Gleiche Methode wie in `messwerte.md` (Tokens ≈ Bytes ÷ 3,3). Stand: opi-suomea main 6de8b50, deutsch-trainer main d99d0e2. Gemessen in dieser Cloud-Umgebung; während der Messung liefen zwei Simulationen parallel (Laufzeiten darum eher zu hoch).

## 1. Feste Startlektüre je Chat
| Chat | vorher (12.10. früh) | jetzt | Änderung |
|---|---|---|---|
| App-Engine: Funktionen – CLAUDE.md 11.853 B + funktionen.md 12.268 B (engine.md/pruefliste-engine.md erst bei Bedarf, T-1012-21) | 43.883 B ≈ 13.300 | 24.121 B ≈ **7.300** | **−45 %** |
| Opi suomea (Inhalte) – CLAUDE.md + inhalte.md 12.657 + lehrplan.md 6.758 + pruefliste.md 4.522 | 36.035 B ≈ 10.900 | 35.790 B ≈ **10.800** | ±0 (CLAUDE.md −4 KB, inhalte.md +4 KB durch den hierher verschobenen „Typischen Ablauf“) |
| Deutsch-Trainer – CLAUDE.md 10.538 + pruefliste.md 7.119 + lehrplan.md 18.675 | 23.398 B ≈ 7.100 | 36.332 B ≈ **11.000** | **+55 %** – Ursache: der neue Themenplan d01–d33 (D-1012-11) steht in `docs/lehrplan.md` (+11,9 KB) |
| Simulation – CLAUDE.md + simulation.md 7.752 | – | 19.605 B ≈ 5.900 | neu gemessen |

**CLAUDE.md** (wird bei jeder Anfrage in jedem Chat geladen): opi-suomea 15.859 → 11.853 B (**−25 %**, ≈ −1.200 Tokens je Anfrage).

**Empfehlung (neu, S-1012-120):** Im Deutsch-Trainer `docs/lehrplan.md` nicht ganz als Pflichtlektüre lesen, sondern nur die Grundsätze und die Zeile des aktuellen Themas (Grep `^| dNN`); spart ≈ 3.500 Tokens je Chat-Start. Umsetzung im Deutsch-Trainer-Chat (dessen `CLAUDE.md`), nach Matthias' OK.

## 2. Werkzeug-Ausgaben
| | vorher | jetzt | Änderung |
|---|---|---|---|
| `node tools/pruefen.mjs` (Opi suomea) | 71 Zeilen, 5.321 B ≈ 1.600 Tok | Kurzmodus **5 Zeilen, 713 B ≈ 220 Tok**; `--lang` 76 Zeilen, 6.146 B | **−87 %** |
| Laufzeit `pruefen.mjs` | 39 s | 35 s (Kurz) / 36 s (lang) | gleich (Ausgabe kürzer, Prüfungen gleich) |
| CI-Status | `curl` auf die API: 15.953 B ≈ 4.800 Tok | `node tools/ci-status.mjs`: **67 B ≈ 20 Tok** | **−99,6 %** |
| Formen nachschlagen | Wiktionary-Rohtext ganze Seite (oft 20–60 KB) | `node tools/quellen.mjs`: ≤ 8 Zeilen je Wort (≈ 300 B) | **> −95 %** je Abruf |

## 3. Prüflisten-Test (Werkzeug `werkzeuge/prueflisten-test.mjs`) auf main
Unverändert gegenüber dem Morgen: 6 doppelte Karten, 20 Themen mit < 2 Regelfragen, 6 Theorie-Tabellen mit 4 Spalten. Die Funde sind jetzt in `pruefen.mjs` als Hinweise „Prüfliste 6/8/9“ eingebaut (Kurzmodus: „3 Hinweise“); bewusste Ausnahmen gehören nach `lektionen/pruef-ausnahmen.json`. Die inhaltliche Bereinigung ist Sache des Inhalte-Chats.

## 4. Erfahrung aus diesem Chat (Entwürfe d04–d09)
- Ein Thema (Quellen, Generator, Test, Quellendatei) kostet hier grob einen Arbeitsblock; Hauptkosten sind die Quellenabrufe (je Wort ein kurzer Aufruf) und das wiederholte Lesen des Chats.
- Kurzausgaben (`pruefen` ohne `--lang`, `quellen.mjs`, gefilterte `grep`/`node`-Ausgaben) haben die Ausgaben je Schritt auf wenige hundert Bytes gedrückt.
- Was weiter kostet: lange Chats ohne `/compact` und Rückfragen mitten in laufenden Befehlen (abgebrochene Befehle müssen neu gestartet werden).
