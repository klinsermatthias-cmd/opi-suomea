# Umsetzung (12.10.2026, durch diesen Chat mit einmaliger Erlaubnis von Matthias)

Sicherung vorher: Branch `sicherung/vor-t1012` (= main fe495f6). Rückweg: `git revert 34fa592 33efe0e` auf main.

## Commits
| Repo | Commit | Inhalt | CI |
|---|---|---|---|
| opi-suomea | 34fa592 | Sparpaket T-1012-9 bis -22 | ✓ |
| opi-suomea | 33efe0e | ci-status: fremder Commit ohne Stacktrace | ✓ |
| deutsch-trainer | 53dfb2a | `.claude/settings.json` (Effort medium, autoCompactWindow 200.000) | ✓ |
| deutsch-trainer | f3b911d, 02b9de8 | Engine übernommen (Action, Stand 34fa592 bzw. 33efe0e) | ✓ |
| deutsch-trainer | 58a911c + Folgecommit | CLAUDE.md: Abschnitt „Tokens sparen (T-1012)“ | ✓ |

## Je Code
| Code | Stand | Geprüft |
|---|---|---|
| T-1012-9/-11 | ✓ beide Repos | Einstellung im Programm vorhanden; Wirkung in den anderen Chats erst in **neuen** Sitzungen |
| T-1012-10/-12 | ✓ CLAUDE.md (Tokens sparen, Nr. 12), `docs/chats/regeln.md` | – |
| T-1012-13 | ✓ `tools/ci-status.mjs`, Startdateien | live gegen beide Repos getestet; Gegenprobe Fehlerpfad |
| T-1012-14 | ✓ Kurzmodus | 71 → 4 Zeilen (3 Hinweise + Schluss); `--lang` 70 ✓-Zeilen; CI (Umgebung `CI`) voll |
| T-1012-15 | ◐ Dokumente fertig (`auswertung-auftrag.md`, `auswertung-starter.md`, Startdatei Inhalte) | **offen:** Inhalts-Chat muss einmalig die Starter-Sitzung anlegen und Trigger `trig_01E9UcF7pvWx9guyeXxScRMJ` löschen (anderes Konto, von hier nicht erreichbar) |
| T-1012-16 | ✓ Startdatei Funktionen Schritt 3 | – |
| T-1012-17 | ✓ CLAUDE.md 15.859 → 11.853 B (wörtlich verschoben; neue Spar-Regeln +1,5 KB) | Startlektüre Funktionen 43.909 → 23.593 B (≈ 13.300 → 7.150 Tokens); Inhalte ≈ gleich (Ablauf liegt jetzt dort), dafür −4 KB in **jedem** Schritt jedes Chats |
| T-1012-18 | ✓ `docs/chats/sessions.md` | – |
| T-1012-19 | ◐ Test ✓ (3 Hinweiszeilen, Deutsch-Trainer ohne Funde) | **offen:** Inhalts-Chat bewertet die Funde (mit Quellen) und legt `lektionen/pruef-ausnahmen.json` an |
| T-1012-20 | ◐ `tools/quellen.mjs` + Selbsttest (Gegenprobe ✓) | **gegen echte Seiten nicht getestet:** Wiktionary ist aus dieser Umgebung gesperrt – beim ersten Einsatz prüfen |
| T-1012-21 | ✓ Startdatei Funktionen | – |
| T-1012-22 | ◐ Simulations-Übergabe und Verweis im Archiv; Monatsregel in `regeln.md` | **offen:** `entwuerfe-bis-b1.md` + Themenplan erst nach der A2-Übernahme |
| T-1012-23 | nicht freigegeben | – |
