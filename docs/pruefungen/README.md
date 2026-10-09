# Prüfungen des Simulations-Chats – Übersicht (Stand 9.10.2026)

Alles, was der Simulations-Chat (nur Kontrolle) bisher erarbeitet hat, liegt gesammelt auf dem Branch
**`pruefung/abschluss-2026-10-08`** (nie `main`; Übernahme auf `main` nur durch den Funktionen-Chat nach Matthias' OK).
Ohne Auschecken lesen:

```
git fetch origin pruefung/abschluss-2026-10-08
git show origin/pruefung/abschluss-2026-10-08:docs/pruefungen/README.md
git show origin/pruefung/abschluss-2026-10-08:<pfad>          # jede Datei unten
git ls-tree -r --name-only origin/pruefung/abschluss-2026-10-08 docs/pruefungen docs/simulationen
```

> Das Repository ist öffentlich: Die Berichte enthalten keine Schlüssel, E-Mail-Adressen oder Lernfortschritte.

## 1. Berichte (neueste zuerst)
| Datum | Datei | Inhalt | Codes | Stand |
|---|---|---|---|---|
| 9.10. | `docs/pruefungen/2026-10-09-natuerlichkeit.md` | **Natürlichkeit** aller finnischen Sätze (live t01–t19c + Entwurf t20–t35d): 4.329 Sätze, A–E-Klassen, Ursachen, Fehlerliste, Erklärung für die finnische Freundin | S-1009-1 … -9 | fertig; S-1009-5 (Auftrag an Inhalts-Chat) erteilt, S-1009-6 … -9 offen |
| 8./9.10. | `docs/pruefungen/entwurf-a2/bericht.md` | **Entwurf A2:** 53 Themen t20–t35d vollständig ausgearbeitet (Schritt A), geprüft, App-Prüfung grün | S-1008-122, -124 … -127 | fertig; Natürlichkeits-Korrekturen (S-1009-6) noch offen |
| 8.10. | `docs/pruefungen/2026-10-08-abschluss-plan.md` | **Plan Abschlussanalyse + 360-Tage-Simulation** (Phasen 0–5) | S-1008-113 … -127 | Schritt A fertig, **Schritt B (S-1008-125) offen** |
| 8.10. | `docs/pruefungen/2026-10-08-lehrinhalte.md` | Prüfung der Lehrinhalte t01–t19 (Stand `main` 56be18c) | S-1008-17 … -73 | Vorschläge an den Inhalts-Chat |
| 8.10. | `docs/pruefungen/2026-10-08-themenplan-bis-b1.md` | Themenplan bis exkl. B1 (111 Themen) | S-1008-77 … -92 | übernommen in `lektionen/abdeckung.md` |
| 8.10. | `docs/pruefungen/2026-10-08-token-effizienz.md` | Token-Effizienz beim Programmieren | S-1008-93 … -107 | alle 5 Schritte umgesetzt |
| 8.10. | `docs/archiv/simulationen/2026-10-08-180-tage.md` (auf `main`) | Simulation 180 Tage | S-1008-1 … -16 | erledigt |

Übergabe des Simulations-Chats: `docs/simulationen/uebergabe.md`. Startdatei und Werkzeug: `docs/chats/simulation.md`,
`tools/simulation.mjs` (beide auf `main`).

## 2. Natürlichkeitsprüfung – Dateien (`docs/pruefungen/natuerlichkeit/`)
- `d-e-liste.md` – **die Arbeitsliste:** alle 108 Sätze zum Ersetzen (D) und Fehler (E) mit natürlicher Alternative,
  getrennt nach Live-Themen (Inhalts-Chat) und Entwurf.
- `themen-tabelle.md` – A/B/C/D/E je Thema.
- `texte/<thema>.txt` – alle Sätze eines Themas mit den IDs, auf die sich die Listen beziehen
  (eN = Übung N, eN.rM = Dialogzeile, eN.sM = Lesetextzeile, th.N = Theorie, vN = Karte).
- `anleitung.md` (Klassen und Regeln für die Prüfer), `funde/gN-r1.md` / `gN-r2.md` (je Gruppe Rolle 1 Sprachgefühl /
  Rolle 2 Norm), `schied/` (Schiedsrunde: Listen, Urteile, Anleitung), `korrektur.json` (eigene Änderungen).
- Daten: `einheiten.json`, `pruefliste.json`, `stand.json`, `endstand.json`, `gruppen.json`.
- Werkzeuge (Node, nur lesend): `extrahieren.cjs` (Auszug; Pfade für den Scratchpad geschrieben, `ROOT`/Ausgabe
  anpassen), `auswerten.cjs`, `auswerten-lesen.cjs`, `endstand.cjs`, `listen.cjs`.

## 3. Entwurf A2 – Dateien (`docs/pruefungen/entwurf-a2/`)
- `themen/<id>.js` – je Thema eine Datei; `lektionen-a2.json` – alle 53 als Array zum Anhängen an `lektionen.json`.
- `bericht.md` – Regeln, Themenliste, Abweichungen, Prüfungen, Befunde für die App, offene Fragen.
- `korrektur/funde-g1…g6.md` – Korrektur-Durchgang (146 Funde), `korrektur/abdeckung.cjs`, `korrektur/extrahieren.cjs`.
- `werkzeuge/` – `laden.cjs`, `wort.cjs`, `pruefen.cjs`, `tabelle.cjs`, `alle-themen.cjs`, `vollpruefung.sh`
  (Kopie von `origin/main` + Entwürfe, dann `tools/pruefen.mjs`); letztes Ergebnis `vollpruefung-ergebnis.txt`.

## 4. Offene Entscheidungen (Matthias)
- **S-1009-6** Entwurf t20–t35d nach der Natürlichkeitsprüfung korrigieren (7 Fehler, 43 D-Sätze).
- **S-1009-7** Stilregeln für natürliche Dialoge (Vorschlag für `lektionen/README.md`, Inhalts-Chat).
- **S-1009-8** Idee „Dialoge umschaltbar geschrieben/gesprochen“ für `docs/ideen.md` (Funktionen-Chat).
- **S-1008-125** Schritt B: Abschlussanalyse + Simulation (Plan S-1008-113); dafür vorher S-1008-114 … -119 klären.
- **S-1008-126** App-Befunde aus dem Entwurf (Antippen, Formen in Klammern, „…“) an den Funktionen-Chat.
- **S-1008-127** Entwurf A2 dem Inhalts-Chat als Grundlage nennen (sinnvoll nach S-1009-6).
- **S-1008-112** ruht.
- Übernahme dieses Branches (nur `docs/pruefungen/`, `docs/simulationen/`) auf `main` durch den Funktionen-Chat –
  noch ohne Code, bei Bedarf **S-1009-10**.

Codes vergeben bis S-1008-127 und S-1009-9. **Nächster freier Code: S-1009-10.**

## 5. Übergabe-Prompts (`docs/pruefungen/uebergabe/`)
- `prompt-alle-chats.md` – kurzer Hinweis für jeden Chat, wo alles liegt.
- `prompt-inhalts-chat.md` – Auftrag Natürlichkeit an „Opi suomea (Lerninhalte)“ (S-1009-5).
- `prompt-simulation-schritt-b.md` – Start eines neuen Simulations-Chats (anderes Konto) für Schritt B.

## 6. Verlauf der Simulations-Chats
- `session_01RYkJUoDVaUeXgWBwdBZ9fp` – S-1008-1 … -76 (Simulation 180 Tage, Prüfung Lehrinhalte).
- `session_01SmQg4rr1Buc3wStUprPR3z` – S-1008-77 … -109 (Themenplan, Token-Effizienz, Übergabe).
- `session_01XiEtLarwXmX3t9983Fu73E` – S-1008-110 … -127, S-1009-1 … -9 (Abschlussplan, Entwurf A2, Natürlichkeit).
