# Messwerte (12.10.2026, Stand main d. h. origin/main beim Start dieser Analyse)

Schätzung Tokens ≈ Bytes ÷ 3,3 (deutsch mit Markdown, ±25 %). Alles hier selbst gemessen, wenn nicht anders vermerkt.

## 1. Verläufe der anderen Chats
`get_session` für `session_01RDQuEyYTikM25QrUxLnCu5` (Funktionen) → „not found“: Die Chats liegen auf dem anderen Konto, dieses Konto sieht sie nicht. **Keine echten Verbrauchsdaten** – Ersatz: Messung an diesem Chat + Regeln/Dateien. Test für Matthias: in jedem Chat `/context` (bzw. `/cost`) eingeben und Zahl notieren.

Messung an diesem Chat (nach Antwort 1, 6 Modell-Schritte): Kontext 79.629 Tokens, gelesen aus Cache 312.672, geschrieben 51.810, Ausgabe 5.169. → **Jeder Werkzeug-Schritt liest den ganzen bisherigen Chat neu.** Kosten pro Schritt ≈ Chatlänge.

## 2. Feste Startlektüre je Chat (heute)
| Datei | Bytes | ≈ Tokens |
|---|---|---|
| CLAUDE.md (jede Anfrage, alle Chats) | 15.859 | 4.800 |
| Funktionen: funktionen.md + engine.md + pruefliste-engine.md + architektur „Dateien“ (4.085 B) | 28.024 | 8.500 |
| Inhalte: inhalte.md + lehrplan.md + lektionen/pruefliste.md | 20.176 | 6.100 |
| Deutsch-Trainer: CLAUDE.md (9.456) + lektionen/pruefliste.md (7.119) + lehrplan.md (6.823) | 23.398 | 7.100 |

Gesamt Funktionen ≈ 13.300, Inhalte ≈ 10.900 Tokens (am 8.10.: 30.800 bzw. 44.100) → **Empfehlungen S-1008-97…-104 sind umgesetzt und wirken.** Die Startlektüre ist nicht mehr der Haupttreiber.

CLAUDE.md nach Abschnitt (Bytes): Code-Chats 4.279 · Was Matthias will 2.798 · Typischer Ablauf 2.462 · Regeln App 2.066 · Prüflisten 1.293 · Kopf ≈ 1.100 · Engine 777 · Tokens sparen 649 · Rolle 426.

## 3. Prüfskript
| | Opi suomea | Deutsch-Trainer |
|---|---|---|
| `node tools/pruefen.mjs` Laufzeit (diese Cloud) | **39 s** | **32 s** |
| Ausgabe | 71 Zeilen, 5.321 B (≈ 1.600 Tok) | 69 Zeilen, 5.775 B |
| Ergebnis | Alles in Ordnung | Alles in Ordnung |
| Nur ✗/⚠ + Schluss (gefiltert) | 2 Zeilen | 2 Zeilen |

Startdatei Funktionen nennt „~5–9 min“ – hier nicht nachvollziehbar (evtl. älterer Stand oder Wortprüfung `WORTCHECK=alle`).

Module: durchlauf 266 Prüfstellen (78 KB ≈ 23.500 Tok), statisch 28, ki 25, sync 21, sicherungen 15, inhalte 14, befunde 6, sprachen 2. Gesamt Prüfcode tools/pruefen/ ≈ 237 KB ≈ 72.000 Tok; dazu test-inhalte.js 38,5 KB, simulation.mjs 107 KB.

## 4. CI-Status abfragen
`curl -s ".../actions/runs?head_sha=…"` (so in docs/chats/inhalte.md): **15.953 B ≈ 4.800 Tokens pro Abfrage**. Gefiltert auf Name/Status: 1 Zeile (≈ 15 Tokens).

## 5. Test: Prüflisten-Punkte automatisch (Skript `werkzeuge/prueflisten-test.mjs`, nur lesend)
Opi suomea (58 Themen, 854 Karten):
- Doppelte Karten (Prüfliste Nr. 6, F-1008-3): **6** – t13-21 suomalainen = t04b-0; t14c-1 ruoka = t12c-1; t16-8 hotelli = t05-5; t18-9 kuuma = t14c-0; t19-23 matkustaa = t12-8; t15c-4 tässä = t10-11 (andere Bedeutung, evtl. gewollt).
- Themen mit < 2 Regelfragen (`mc` mit `x`, Prüfliste Nr. 9; gilt nur für Grammatikthemen – Liste ungefiltert): 20 – t02:0 t03:1 t03b:1 t06b:0 t07b:1 t08b:1 t08c:1 t10b:0 t10c:1 t11b:0 t12b:0 t12c:1 t13c:0 t14b:1 t15:1 t15b:1 t15c:0 t16:1 t17:1 t18b:1.
- Theorie-Tabellen mit 4 Spalten (Prüfliste Nr. 8: höchstens 3): t08d t13c t14 t16 t16d t19 (Breitentest 390 px besteht trotzdem).
Deutsch-Trainer (3 Themen): keine Funde.
→ Die Handprüfung „Prüfliste Punkt für Punkt“ kostet bei jedem Push Tokens und übersieht trotzdem Fälle; automatisch ist es billiger und zuverlässiger.
