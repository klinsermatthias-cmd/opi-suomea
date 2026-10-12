# Übergabe: Simulations-Chat (Kontrolle) – Stand 8.10.2026, abends

Bisherige Chats: `session_01RYkJUoDVaUeXgWBwdBZ9fp` (bis S-1008-76), `session_01SmQg4rr1Buc3wStUprPR3z` (S-1008-77 bis -109).
**Zuerst lesen:** `CLAUDE.md` (automatisch), `docs/chats/simulation.md` (Startdatei, Werkzeug und Regeln), diese Datei.

> Das Repository ist öffentlich: keine Schlüssel, E-Mail-Adressen, Fortschrittsberichte oder privaten Details committen.

## 1. Rolle (verbindlich, Matthias 8.10.2026)
- **Nur Kontrolle:** prüfen von App, Inhalten, Code und Simulation. **Nie** App oder Lehrinhalte ändern (wörtlich Matthias: „du selbst darfst nie Änderungen vornehmen. Dafür verwende ich immer den Engine Chat.“).
- **Darf schreiben:**
  - `tools/simulation.mjs` und `docs/simulationen/`, nur auf Branches `simulation/…`
  - Prüfberichte in `docs/pruefungen/`, nur auf Branches `pruefung/…`
- **Nie** auf `main` pushen. Übernahmen auf `main` macht der Funktionen-Chat nach Matthias' OK.
- **Erst erklären, dann fragen, dann ändern.** Jede Option bekommt einen Code `S-<MMTT>-<Nr>`. Ohne OK zu einem Code wird nichts gepusht.
- **Befunde** nie selbst beheben, sondern als Bericht mit Ort, Schwere, Vorschlag und Code. Dazu ein fertiger Übergabetext für den Funktionen-Chat (E-…) bzw. den Inhalts-Chat (F-…).
- Die Chats liegen in verschiedenen Konten, `send_message` geht nicht. Matthias gibt die Texte weiter.
- **Bei langen Aufträgen:** zu Beginn einen Wecker alle 2 h (`create_trigger`, an diese Session gebunden) mit Hinweis auf den Abschnitt „Arbeitsstand“ im Bericht. Zwischenstände auf den Branch pushen. Am Ende den Wecker löschen.
- **Effort** „xhigh“ (S-1008-95), keine Hilfs-Agenten.

## 2. Erledigt in diesem Chat (8.10.2026)
| Auftrag | Ergebnis | Stand |
|---|---|---|
| Themenplan bis exkl. B1 (S-1008-77 bis -92) | `docs/pruefungen/2026-10-08-themenplan-bis-b1.md`: 111 Themen bis A2.2, nachgeprüft mit elon.io, OPH-Stufen, YKI-Grundlagen | auf `main` (S-1008-88). Inhalts-Chat hat S-1008-85 (6 A1-Unterthemen), -87, -92 umgesetzt (F-1008-6 bis -8, -11); Plan ist jetzt Nachweis, die Masterliste ist `lektionen/abdeckung.md` |
| Prüfung Token-Effizienz (S-1008-93 bis -107) | `docs/pruefungen/2026-10-08-token-effizienz.md`, Fahrplan in 5 Schritten | **alle 5 Schritte umgesetzt** und nachgeprüft (Abschnitte 8 und 9 im Bericht): nichts verloren, Prüfausgabe gleich, Archiv `docs/archiv/`, Startdateien `docs/chats/`, `tools/thema.mjs`, `tools/pruefen/*.mjs` |

Stand der App nach den Umbauten (`main` be5824c): 58 Themen, 854 Wörter, 870 Übungen; `node tools/pruefen.mjs` „Alles in Ordnung“.

## 3. Offene Punkte
- **S-1008-109:** Der Funktionen-Chat soll den Token-Bericht (Branch `pruefung/token-effizienz-2026-10-08`) und diese Übergabe (Branch `simulation/uebergabe-2026-10-08b`) auf `main` übernehmen.
- **Deutsch-Trainer:** Er steht auf dem Engine-Stand 14db575. „Engine übernehmen“ für be5824c (neue Module `tools/pruefen/`) muss der Funktionen-Chat noch auslösen. Danach prüfen, ob dort alles grün ist.
- **Prüfbericht Lehrinhalte** (`docs/pruefungen/2026-10-08-lehrinhalte.md`) liegt nur auf dem Branch `pruefung/2026-10-08`. Ob er auf `main` kommt, entscheidet Matthias.
- **Simulation** nur auf Matthias' Wunsch:
  - Vorher prüfen, ob alle Funktionen abgedeckt sind, auch die neuen (u. a. 6 A1-Unterthemen, `tools/thema.mjs`).
  - Großer Lauf E-1007-88 laut `docs/chats/simulation.md`.
  - Deutsch-Trainer-Lauf erst, wenn er Lektionen hat.
- **Chat-Länge** einmal am Tag prüfen; rechtzeitig diese Datei aktualisieren.

## 4. Codes
- **Vergeben:** S-1008-1 bis S-1008-109. Nicht vergeben: S-1008-75. S-1008-84, -86, -89, -91, -94 und -96 waren Optionen, die nicht gewählt wurden.
- **Nächster Code:** S-1008-110, an einem neuen Tag S-<MMTT>-1.
- **Bedeutung nachlesen:**
  - S-1008-1 bis -16: Simulationsbericht (`docs/archiv/simulationen/`)
  - S-1008-17 bis -73: Prüfbericht Lehrinhalte
  - S-1008-77 bis -92: Themenplan (Abschnitte 8 und 9)
  - S-1008-93 bis -107: Token-Bericht
  - S-1008-108: diese Übergabe
  - S-1008-109: Übernahme auf `main`

## 5. Werkzeuge und Erfahrungen
- **Themen lesen:** `node tools/thema.mjs tNN …`. `lektionen.json` nie ganz öffnen.
- **Inhaltsprüfung:** `docs/simulationen/hilfsskripte/wortlisten-abgleich.js` (Wörter in Musterlösungen ohne frühere Wortliste; `STAMM=1` für Stammabgleich).
- **Nachprüfen, ob nichts verloren ging** (bewährt):
  - Lektionen strukturell vergleichen (alle IDs da, `v`/`ex` nur hinten verlängert)
  - Docs zeilenweise gegen den alten Stand (`git show <alt>:<datei>`) und die neuen Dateien inkl. Archiv suchen
  - Prüfausgabe vorher/nachher mit `diff` vergleichen
  - Deutsch-Trainer klonen und Engine-Dateien mit `cmp` gegen `tools/engine-dateien.txt` prüfen
- **Webquellen** (freigegeben): uusikielemme.fi, elon.io (Lektionsliste mit Stufen in den Seitendaten), oph.fi (Stufenbeschreibungen und YKI-Grundlagen als PDF), jyu.fi, en.wiktionary.org, kielitoimistonohjepankki.fi.
- **Sparsam:** Startlektüre klein halten, große Dateien nur per Grep und Ausschnitt lesen, lange Läufe im Hintergrund mit Ausgabe in eine Datei.
