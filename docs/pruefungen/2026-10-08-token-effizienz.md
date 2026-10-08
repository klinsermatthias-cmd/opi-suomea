# Prüfung: Token-Effizienz beim Programmieren (S-1008-93)

Simulations-Chat (nur Kontrolle), 8.10.2026, Effort xhigh (S-1008-95). Stand `main` 3f41126.

**Ziel:** Beim Programmieren und bei der Inhaltsarbeit weniger Tokens verbrauchen, **ohne Qualitätsverlust**. Empfohlen wird nur, was keine Information verliert. Verschoben wird immer wörtlich (Archiv statt Löschen). Diese Prüfung ändert nichts an App, Lektionen oder Docs.

## Arbeitsstand
- [x] Bestandsaufnahme: alle Dateien mit Größe, Zeilen und Abschnittsgrößen.
- [x] Startlektüre je Chat gemessen (laut Übergaben in `docs/ideen.md`, `docs/lehrplan.md`, `docs/simulation.md`).
- [x] Veraltete und doppelte Inhalte gesucht.
- [x] Code geprüft:
  - Dateigrößen, Aufbau, doppelte Funktionen
  - `tools/pruefen.mjs`: Laufzeit und Ausgabe gemessen
- [x] Empfehlungen mit Codes, Übergabetexte.

**Schätzung Tokens:** Zeichen ÷ 3,5 (deutsch mit Markdown, grob ±25 %).

---

## 1. Kurzfazit
- **Der App-Code ist effizient aufgebaut.** Deshalb empfehle ich keinen Umbau der App:
  - jede Datei mit Kopfkommentar
  - keine doppelten Funktionsnamen (17 Dateien, 463 Funktionen)
  - alle `js/`-Dateien unter 1.500 Zeilen
  - klare Zuständigkeiten (Tabelle „Dateien“ in `docs/architektur.md`)
- **Die Prüfausgabe ist sparsam:** `node tools/pruefen.mjs` braucht 37 s und gibt 60 Zeilen aus (≈ 1.300 Tokens).
- **Die großen Kostentreiber sind Dokumente und eine Werkzeugdatei:**
  1. `docs/entscheidungen.md` (46.500 Zeichen ≈ 13.300 Tokens):
     - Er wird beim Start gelesen.
     - Er wird **bei jeder Ergänzung ganz gelesen**, weil das Bearbeitungswerkzeug die Datei vorher lesen muss.
     - 80 % davon betreffen den 5.–7.10.
  2. Die Startlektüre ist zu breit:
     - Funktionen-Chat ≈ 31.000 Tokens, Inhalts-Chat ≈ 44.000 Tokens, bevor die eigentliche Aufgabe beginnt.
     - Diese Tokens bleiben den ganzen Chat über im Kontext. Der Chat wird dadurch auch früher „zu lang“.
  3. Übergaben und Verläufe stecken in Fachdokumenten (`ideen.md`, `lehrplan.md`) und veralten dort.
  4. `tools/pruefen.mjs`:
     - 1.754 Zeilen, 164 KB ≈ 47.000 Tokens, ein einziger Ablauf.
     - Für jeden neuen Test muss man darin suchen und lesen.
     - Er verletzt die eigene Regel „> ca. 1.500 Zeilen aufteilen“.
  5. Für zukünftige Themen gibt es drei Quellen: `abdeckung.md`, `entwuerfe-bis-b1.md` und der Themenplan. Das sind ≈ 19.500 Tokens, teils doppelt.
- **Mit den Empfehlungen S-1008-97 bis -104 sinkt die Startlektüre** schätzungsweise auf ≈ 10.000 Tokens (Funktionen) und ≈ 19.000 Tokens (Inhalte). Das ist **etwa 55–65 % weniger**. Jede Ergänzung im Entscheidungsprotokoll kostet dann statt ≈ 13.000 nur noch einige hundert Tokens.

## 2. Messungen
### 2.1 Größte Dateien
| Datei | Zeichen/Bytes | Zeilen | ≈ Tokens bei vollem Lesen | Bemerkung |
|---|---|---|---|---|
| `lektionen/lektionen.json` | 478 KB | 17.199 | ≈ 135.000 | nie ganz lesen; heute je nach Chat per eigenem Skript |
| `tools/pruefen.mjs` | 164 KB | 1.754 | ≈ 47.000 | 70 Zeilen über 200 Zeichen, ein einziger Ablauf ab Zeile 243 |
| `tools/simulation.mjs` | 107 KB | 1.327 | ≈ 30.000 | gehört dem Simulations-Chat |
| `js/inhalte.js` | 69 KB | 1.344 | ≈ 20.000 | nahe 1.500 Zeilen (`GLOSS_EXTRA` wächst) |
| `js/ki.js` | 63 KB | 1.411 | ≈ 18.000 | nahe 1.500 Zeilen |
| `js/daten.js` | 50 KB | 1.354 | ≈ 14.000 | nahe 1.500 Zeilen |
| `docs/entscheidungen.md` | 46.500 | 181 | ≈ 13.300 | Zeilen bis 1.400 Zeichen |
| `docs/pruefungen/2026-10-08-themenplan-bis-b1.md` | 46.900 | 422 | ≈ 13.000 | seit 3f41126 auf `main` |
| `docs/architektur.md` | 35.600 | 163 | ≈ 10.200 | davon „Lernlogik“ 13.600 Zeichen |
| `docs/lehrplan.md` | 19.000 | 121 | ≈ 5.400 | davon ≈ 14.000 Zeichen Verlauf/Übergabe |
| `lektionen/entwuerfe-bis-b1.md` | 17.100 | 152 | ≈ 4.900 | |
| `CLAUDE.md` | 11.300 | 79 | ≈ 3.300 | wird automatisch in jeden Chat geladen |

### 2.2 Startlektüre je Chat (laut den Übergaben)
| Chat | Was beim Start gelesen wird | ≈ Tokens |
|---|---|---|
| Funktionen | `CLAUDE.md` 3,3k + `ideen.md` 2,1k + `engine.md` 1,8k + `architektur.md` 10,2k + `entscheidungen.md` 13,3k | **≈ 30.800** |
| Inhalte | `CLAUDE.md` 3,3k + `lehrplan.md` 5,5k + `README` 0,9k + `uebungsformate` 1,6k + `abdeckung` 1,8k + `entwuerfe` 4,7k + `entscheidungen` 13,3k + Themenplan 13,0k (für S-1008-87) | **≈ 44.100** |
| Simulation | `CLAUDE.md` 3,3k + `simulation.md` 2,1k + `uebergabe.md` ≈ 2,6k | ≈ 8.000 |

„Die letzten Einträge in `entscheidungen.md`“ heißt praktisch: die ganze Datei. Sie hat nur 181 Zeilen, das Lesewerkzeug liest sie also auf einmal.

### 2.3 Code
- 17 Skripte in `js/`, jede mit Kopfkommentar (Zweck der Datei). Keine Funktion ist doppelt definiert.
- Die Zahl der Funktionen je Datei ist überschaubar (0–73).
- `tools/pruefen.mjs` hat nur 2 eigene Funktionen. Alles andere ist ein langer Ablauf in Blöcken:
  - statische Prüfungen: Zeilen 1–243
  - App-Durchlauf: 243–1019
  - Sync: 1020–1106
  - KI: 1107–1386
  - Version, Notfall, Löschen: 1389–1460
  - Deutsch, Lektionen, Befunde: 1461–1700
  - echte Inhalte: 1700–1754
- Ausgabe von `pruefen.mjs`: 60 Zeilen, 4,3 KB, 37 s. Sie ist schon sparsam, hier ist nichts zu tun.

## 3. Befunde
| Nr. | Befund | Wo / Beleg | Folge |
|---|---|---|---|
| B1 | Das Entscheidungsprotokoll wird bei jeder Ergänzung ganz gelesen. 37.200 der 46.500 Zeichen betreffen den 5.–7.10. Die Überschrift „## 05.10.2026“ (Z. 13) umfasst Einträge bis 7.10. | `docs/entscheidungen.md`; Regel „Nach Änderungen kurz `docs/entscheidungen.md` ergänzen“ (`CLAUDE.md`, Z. 79) | ≈ 13.000 Tokens je Ergänzung und je Start; die Datei wächst weiter |
| B2 | Übergabe-Abschnitte stehen in Fachdokumenten und veralten dort. Beispiele: „Letzter vergebener Code E-1008-28“, „Stand: 52 Themen“, „Noch offen: E-1008-19“, inzwischen erledigt durch S-1008-1 bis -8. | `docs/ideen.md` Z. 23–47 (4.800 Zeichen), `docs/lehrplan.md` Z. 86–121 (3.900 Zeichen) | Jeder Chat liest fremde und veraltete Übergaben mit; Fehlerrisiko durch alte Angaben |
| B3 | Der Funktionen-Chat liest `architektur.md` beim Start ganz (10.200 Tokens). Für die meisten Aufgaben braucht er nur die Dateitabelle und einen Fachabschnitt. Einzelne Zeilen sind bis 1.353 Zeichen lang, eine Grep-Suche liefert deshalb sehr lange Treffer. | Übergabe in `ideen.md` Z. 26 („inkl. Token-Verbrauch“); `architektur.md` Z. 46, 98, 111 | ≈ 9.000 Tokens je Start ohne Nutzen für die meisten Aufgaben |
| B4 | `lehrplan.md` enthält zu 70 % Verlauf:<br>– Tabelle „Nächste Themen“ für t09–t19, alle erledigt (5.400 Zeichen)<br>– „Stand“-Protokoll (4.700 Zeichen)<br>– Übergabe (3.900 Zeichen)<br>– ein Absatz von 2.300 Zeichen in einer Zeile (Z. 14) | `docs/lehrplan.md` | ≈ 4.000 Tokens je Start des Inhalts-Chats |
| B5 | Drei Quellen für zukünftige Themen: `abdeckung.md`, `entwuerfe-bis-b1.md` (am Ende noch einmal eine Abdeckungstabelle) und der Themenplan. Nach S-1008-87 überträgt der Inhalts-Chat den Plan in die beiden Dateien, danach ist er doppelt. | `lektionen/`, `docs/pruefungen/` | ≈ 13.000 Tokens, wenn der Themenplan weiter mitgelesen wird; Widersprüche möglich |
| B6 | `tools/pruefen.mjs` ist mit 1.754 Zeilen ein einziger Ablauf. Ein neuer Test zu einer Funktion heißt: die richtige Stelle in 164 KB suchen und viel Umgebung lesen. | `tools/pruefen.mjs`; Regel in `CLAUDE.md` Z. 69 („> ca. 1.500 Zeilen … aufteilen“) | ≈ 10.000–47.000 Tokens je Testerweiterung |
| B7 | Für Inhalte gibt es kein Standardwerkzeug, das ein Thema als lesbaren Text ausgibt. Der Inhalts-Chat schreibt dafür jedes Mal eigene Python-Skripte. Das Werkzeug `themen-ausgeben.js` liegt nur auf dem Branch `simulation/uebergabe-2026-10-08`. | `lektionen/README.md`, Übergabe in `lehrplan.md` („per Python-Skript“) | Wiederholte Skript-Tokens; Gefahr, `lektionen.json` (≈ 135.000 Tokens) ganz zu öffnen |
| B8 | `CLAUDE.md` ist veraltet oder ungenau:<br>– „Neue Skriptdatei … im Workflow (`cp`) eintragen“: Der Workflow kopiert `js/` aber ganz (`cp -r js`). Nötig ist dagegen `tools/engine-dateien.txt`, das in `CLAUDE.md` fehlt (in `engine.md` Z. 23 steht es, dort aber auch „Workflow (`cp`)“).<br>– Die Zeile „Simulation“ in der Chat-Tabelle kennt die Kontrollrolle und die Prüfberichte auf `pruefung/…`-Branches (S-1008-23) noch nicht.<br>– `CLAUDE.md` selbst ist keinem Chat zugeordnet. | `CLAUDE.md` Z. 24–34 (Simulation: Z. 29), Z. 70 | Kleine Umwege und Rückfragen; keine großen Tokens |
| B9 | Abgeschlossene Berichte liegen zwischen den aktiven Dokumenten: Gesamtprüfung (9 Dateien, ≈ 54.000 Zeichen), Simulationsbericht, Prüfberichte. Eine Grep-Suche über `docs/` liefert daher viele Treffer aus alten Berichten. | `docs/gesamtpruefung*`, `docs/simulationen/`, `docs/pruefungen/` | Mehr Treffer je Suche; nur geringe Kosten |
| B10 | Drei Engine-Dateien nähern sich 1.500 Zeilen: `ki.js` 1.411, `daten.js` 1.354, `inhalte.js` 1.344 (gehört der App, `GLOSS_EXTRA` wächst mit jedem Thema). | `js/` | Später müssen sie geteilt werden; heute kein Handlungsbedarf |

## 4. Empfehlungen (je mit Code)
Jede Empfehlung hat eine Prüfung „Geht Information verloren?“. Verschoben wird **wörtlich**, nichts wird gelöscht.

### S-1008-97: Entscheidungsprotokoll archivieren und ohne Volllesen ergänzen (B1)
- **Was:**
  1. Den Teil „## 05.10.2026“ (5.–7.10.) wörtlich nach `docs/archiv/entscheidungen-2026-10-05-bis-07.md` verschieben. In `entscheidungen.md` bleiben „Grundsatzentscheidungen“, ein Verweis aufs Archiv und alles ab 7.10. (Unterthemen) bzw. 8.10.
  2. Neue Regel: Einträge **anhängen, ohne die Datei zu lesen** (z. B. `cat >> docs/entscheidungen.md <<'EOF'`), Überschrift `## <Datum> – <Thema> (<Code>)`, höchstens 3–4 Zeilen je Eintrag. Details stehen im Commit und in den Fachdokumenten.
  3. Wird die Datei größer als ≈ 20.000 Zeichen, ältere Tage ins Archiv schieben (eine Datei je Zeitraum).
- **Einsparung:** ≈ 10.000 Tokens je Start und ≈ 13.000 Tokens je Ergänzung (heute bei fast jedem Push).
- **Qualität:**
  - Kein Verlust, das Archiv bleibt im Repo und ist per Grep durchsuchbar.
  - Grundsatzentscheidungen bleiben vorne.
  - Absicherung: Zeichenzahl vorher = nachher (Archiv + Rest).
- **Aufwand:** klein. **Wer:** Funktionen-Chat. Gilt für alle Chats, weil alle die Datei ergänzen.

### S-1008-98: Eine Startdatei je Chat statt Übergaben in Fachdokumenten (B2)
- **Was:**
  1. Neuer Ordner `docs/chats/` mit `funktionen.md`, `inhalte.md` und `simulation.md`.
  2. Die Übergabe-Abschnitte aus `docs/ideen.md` und `docs/lehrplan.md` sowie die Simulations-Übergabe dorthin **verschieben**. Dabei aktualisieren: letzter Code, erledigt/offen.
  3. Jede Startdatei hat dieselbe kurze Gliederung:
     - Pflichtlektüre (minimal)
     - Lesestoff je Aufgabe (Tabelle, siehe S-1008-99)
     - Stand
     - letzter Code
     - offene Punkte
     - Session-IDs
     - Arbeitsregeln dieses Chats
  4. Der Stand wird **überschrieben**, nicht angehängt. Der Verlauf steht im Entscheidungsprotokoll.
  5. In `CLAUDE.md` bekommt die Chat-Tabelle eine Spalte „Startdatei“.
- **Einsparung:**
  - ≈ 2.000–3.000 Tokens je Start, weil keine fremden und veralteten Übergaben mehr mitgelesen werden.
  - Übergaben bei „Chat zu lang“ werden schneller und billiger: eine Datei überschreiben statt Abschnitte in mehreren Dokumenten suchen.
- **Qualität:**
  - Kein Verlust, der Inhalt wird verschoben.
  - Gewinn: Es gibt keine veralteten Angaben mehr an zwei Orten.
  - Die Regel „Chat-Länge täglich prüfen“ bleibt; sie verweist dann auf die Startdatei.
- **Aufwand:** klein. **Wer:** Funktionen-Chat legt den Ordner an. `inhalte.md` füllt der Inhalts-Chat aus seinem Abschnitt in `lehrplan.md`. `simulation.md` übernimmt `docs/simulation.md` und die Übergabe dieses Chats.

### S-1008-99: Gezielt lesen statt ganze Dateien (B3)
- **Was:**
  1. In der Startdatei des Funktionen-Chats steht als Pflichtlektüre nur die Tabelle „Dateien“ aus `architektur.md` (3.900 Zeichen) und `engine.md`.
  2. Alles andere je Aufgabe nach einer Tabelle „Lesestoff je Aufgabe“, zum Beispiel:
     - Sync/Speichern → „Zustand S“, „Cloud-Sync“, „Sicherungen“
     - KI → „KI-Protokoll“, „Token-Verbrauch“, „KI-Verbindung“
     - Lernlogik/Übungen → „Lernlogik“ (per Grep auf das Stichwort)
     - neuer Test → Abschnitt in `tools/pruefen/…` (S-1008-102)
  3. Arbeitsregel: Funktionen und Abschnitte zuerst mit Grep suchen, dann mit `offset/limit` nur den Bereich lesen. Große Dateien nie ganz lesen.
  4. Neue Doc-Texte: ein Gedanke je Aufzählungspunkt, möglichst unter ≈ 300 Zeichen je Zeile. Grep-Treffer werden dadurch kurz. Bestehende Texte **nicht** umschreiben.
- **Einsparung:** ≈ 7.000–9.000 Tokens je Start des Funktionen-Chats.
- **Qualität:**
  - Risiko: Kontext fehlt bei einer Änderung.
  - Absicherung: Die Tabelle „Lesestoff je Aufgabe“ nennt verbindlich, was vor Sync-, Daten- und KI-Änderungen zu lesen ist.
  - Die Regeln in `CLAUDE.md` bleiben unverändert (Sync nur mit Vorsicht, Datenformat nie brechen).
- **Aufwand:** klein. **Wer:** Funktionen-Chat.

### S-1008-100: `lehrplan.md` auf den aktuellen Stand verschlanken (B4)
- **Was:**
  1. Die Tabelle „Nächste Themen“ für t09–t19 (erledigt) und das „Stand“-Protokoll wörtlich nach `docs/archiv/lehrplan-verlauf.md` verschieben.
  2. In `lehrplan.md` bleiben:
     - Grundlagen-Tabelle
     - Regeln für neue Themen (F-1007-2, -15, -31, -35, -36, F-1008-3)
     - ein kurzer Absatz „Wo steht Matthias“
     - die offenen Erinnerungen
     - ein Verweis auf `abdeckung.md` und die Entwürfe
  3. Die Übergabe geht nach `docs/chats/inhalte.md` (S-1008-98).
  4. Der 2.300-Zeichen-Absatz in Z. 14 wird zu einer kurzen Liste; der Inhalt bleibt vollständig.
- **Einsparung:** ≈ 3.500 Tokens je Start des Inhalts-Chats.
- **Qualität:**
  - Kein Verlust, der Verlauf liegt im Archiv.
  - Die „Ich kann …“-Sätze für t09–t19 gibt es nur in dieser Tabelle. Sie bleiben im Archiv und sind per Grep auffindbar.
- **Aufwand:** klein. **Wer:** Inhalts-Chat.

### S-1008-101: Eine Quelle je Zweck für zukünftige Themen (B5)
- **Was:**
  1. **Nach** S-1008-87 klare Rollen:
     - `lektionen/abdeckung.md` = Kontrollliste „Baustein → Thema“ (Master)
     - `lektionen/entwuerfe-bis-b1.md` = Detailentwürfe der nächsten Themen
  2. Der Themenplan bekommt oben den Vermerk „in `abdeckung.md`/`entwuerfe-bis-b1.md` übernommen (F-…); nur noch Nachweis, nicht mehr routinemäßig lesen“.
  3. Die doppelte Tabelle „Abdeckung A1/A2-Grammatik“ am Ende der Entwürfe streicht der Inhalts-Chat erst, **nachdem er jede Zeile in `abdeckung.md` wiedergefunden hat**.
- **Einsparung:** ≈ 13.000 Tokens, wenn der Themenplan nicht mehr mitgelesen wird, plus ≈ 1.000 für die doppelte Tabelle.
- **Qualität:**
  - Kein Verlust, der Themenplan bleibt als Nachweis im Repo.
  - Gewinn: Es gibt nur noch einen Ort, an dem eine Zuordnung geändert wird.
- **Aufwand:** klein. Er entsteht ohnehin bei S-1008-87. **Wer:** Inhalts-Chat.

### S-1008-102: `tools/pruefen.mjs` thematisch aufteilen (B6)
- **Was:**
  1. `tools/pruefen.mjs` bleibt der Aufruf und Ablauf.
  2. Die Blöcke wandern in Module `tools/pruefen/*.mjs`. Vorschlag nach den vorhandenen Blöcken:
     - `statisch.mjs` (Syntax, Namen, Aktionen, Lektionen, Nur-anhängen, Service Worker)
     - `durchlauf.mjs` (App-Durchlauf)
     - `sync.mjs`
     - `ki.mjs`
     - `sicherungen.mjs` (Version, Notfall, Löschen, Zurücksetzen)
     - `sprachen.mjs` (Deutsch, alte Stände)
     - `befunde.mjs` (Gesamtprüfung, Schwächen, Simulation-Befunde, Wortprüfung-Selbsttest)
     - `inhalte.mjs` (echte Inhalte, Wortprüfung)
     - `hilfen.mjs` (`ok/fail/warn`, `device`, Server)
  3. Jedes Modul bekommt einen Kopfkommentar.
  4. Neue Dateien in `tools/engine-dateien.txt` eintragen, damit der Deutsch-Trainer sie bekommt.
- **Einsparung:** Ein neuer Test braucht dann ≈ 150–400 Zeilen Lesen (≈ 4.000–10.000 Tokens) statt Suchen in 164 KB. Bei 1–3 Tests je Funktion lohnt sich das schnell.
- **Qualität:**
  - Risiko mittel: Die Prüfung ist das Sicherheitsnetz vor jedem Livegang.
  - Absicherung:
    - vorher Sicherungs-Branch `sicherung/vor-pruefen-aufteilen`
    - reiner Umzug ohne Logikänderung
    - Ausgabe vorher und nachher Zeile für Zeile gleich (60 Zeilen, gleiche ✓/✗/!)
    - beide Prüfläufe grün, danach „Engine übernehmen“ im Deutsch-Trainer und dessen Prüflauf grün
- **Aufwand:** mittel. **Wer:** Funktionen-Chat, eigener Code, erst nach OK.

### S-1008-103: Werkzeug „ein Thema lesen“ für Inhalte (B7)
- **Was:** `tools/thema.mjs <id…>` gibt Theorie, Wörter und Übungen eines Themas kompakt als Text aus. Bei mc ist die richtige Option markiert, Übungsnummern sind mit angegeben.
  - Grundlage: `themen-ausgeben.js` vom Branch `simulation/uebergabe-2026-10-08`. Es hat sich bei der Prüfung der Lehrinhalte bewährt.
  - Allgemein über `APP` und Lektionen, damit es auch im Deutsch-Trainer funktioniert. Eintrag in `tools/engine-dateien.txt`.
  - In `lektionen/README.md` (Inhalts-Chat) die Regel: „`lektionen.json` nie ganz öffnen; Themen mit `node tools/thema.mjs tNN` lesen.“
- **Einsparung:** Es entfallen die wiederholten Hilfsskripte (je ≈ 500–1.500 Tokens). Vor allem schützt es vor dem versehentlichen Volllesen von `lektionen.json` (≈ 135.000 Tokens).
- **Qualität:**
  - Kein Risiko, es ist nur ein Lesewerkzeug.
  - Absicherung: ein kleiner Test in `pruefen.mjs` (Werkzeug läuft und gibt die Testthemen aus).
- **Aufwand:** klein. **Wer:** Funktionen-Chat (Werkzeug); Inhalts-Chat (Satz in README).

### S-1008-104: `CLAUDE.md` berichtigen und um 5 Spar-Regeln ergänzen (B8)
- **Was:**
  1. „Neue Skriptdatei“: „Workflow (`cp`)“ ersetzen durch „bei Engine-Dateien `tools/engine-dateien.txt`“. Dasselbe in `docs/engine.md` Punkt 7.
  2. Chat-Tabelle:
     - Simulations-Chat = nur Kontrolle; darf `tools/simulation.mjs`, `docs/simulationen/` (Branches `simulation/…`) und `docs/pruefungen/` (Branches `pruefung/…`) schreiben.
     - Wer `CLAUDE.md` ändern darf: Funktionen-Chat nach OK.
  3. Neuer kurzer Abschnitt „Tokens sparen“ (≈ 5 Zeilen, ≈ 150 Tokens):
     - große Dateien nie ganz lesen (Grep, dann `offset/limit`)
     - `lektionen.json` nur per Werkzeug lesen
     - Entscheidungsprotokoll nur anhängen
     - Befehlsausgaben kurz halten (`| tail`, Zusammenfassung)
     - Startdatei des eigenen Chats statt aller Übergaben lesen
  4. Die Nummern der Wünsche **nicht** ändern, weil Docs darauf verweisen (z. B. „Regel 12 in CLAUDE.md“). Nur die Reihenfolge der Zeilen nach Nummer sortieren (heute 1–10, 14, 11, 12, 15, 16, 13).
- **Einsparung:** indirekt, denn die Regeln wirken bei jeder Aufgabe. `CLAUDE.md` wird dadurch nicht größer (+150 Tokens).
- **Qualität:** Gewinn, weil veraltete Anweisungen verschwinden.
- **Aufwand:** klein. **Wer:** Funktionen-Chat nach OK.

### S-1008-105 (optional): Abgeschlossene Berichte in ein Archiv (B9)
- **Was:**
  1. Die abgeschlossenen Berichte nach `docs/archiv/` verschieben:
     - `docs/gesamtpruefung.md` und `docs/gesamtpruefung/`
     - der Simulationsbericht
     - erledigte Prüfberichte
  2. Ein kurzer Index `docs/archiv/README.md` (eine Zeile je Bericht).
  3. Verweise in `CLAUDE.md`/Docs anpassen.
- **Einsparung:** gering, nur kürzere Grep-Ergebnisse über `docs/`.
- **Qualität:** Kein Verlust; Risiko sind nur kaputte Verweise. Absicherung: Grep nach alten Pfaden.
- **Aufwand:** klein. Nur auf Wunsch.

### S-1008-106: Teilung der großen Engine-Dateien vormerken (B10)
- **Was:** Nur in `docs/ideen.md` vormerken: Bei mehr als 1.500 Zeilen thematisch teilen.
  - `ki.js`: z. B. KI-Protokoll/Statistik abtrennen
  - `daten.js`: z. B. Sicherungsdatei abtrennen
  - `inhalte.js`: `GLOSS_EXTRA` als eigene App-Datei
  - Jetzt nichts umbauen.
- **Einsparung:** später, je Änderung ≈ 3.000–6.000 Tokens weniger.
- **Qualität:** keine Änderung jetzt. **Aufwand:** keiner.

## 5. Bewusst **nicht** empfohlen (Qualität oder Aufwand)
| Idee | Warum nicht |
|---|---|
| `CLAUDE.md` in verschachtelte `CLAUDE.md`-Dateien oder Skills aufteilen | Spart nur ≈ 600–900 Tokens je Anfrage, und die werden zwischengespeichert. Es besteht aber das Risiko, dass eine Regel nicht geladen wird, weil diese Dateien erst beim Lesen eines Ordners erscheinen. Ein Bericht zum Einfügen löst z. B. keinen Ordnerzugriff aus. Qualitätsrisiko → nein. |
| `architektur.md` oder andere Fachdokumente kürzen oder zusammenfassen | Gefahr, dass Einzelheiten verloren gehen (Sync, Fail-safes). Stattdessen gezielt lesen (S-1008-99). |
| `lektionen.json` in Einzeldateien je Thema teilen | Würde Laden, Service Worker, Sync, Nur-anhängen-Prüfung und Deutsch-Trainer ändern; hohes Risiko. Der Nutzen ist mit S-1008-103 fast genauso erreichbar. |
| Prüfausgabe von `pruefen.mjs` verkürzen | Sie ist schon kompakt (60 Zeilen, ≈ 1.300 Tokens). |
| Alte Berichte oder Verläufe löschen | Information ginge verloren. Nur archivieren (S-1008-97, -100, -105). |
| Umbau der App-Skripte | Der Code ist sauber gegliedert. Ein Umbau kostet mehr Tokens, als er spart, und birgt Risiken. |

## 6. Erwartete Wirkung
| Chat | Start heute | Start nachher (geschätzt) | Wodurch |
|---|---|---|---|
| Funktionen | ≈ 30.800 | ≈ 10.000 | S-1008-97, -98, -99 |
| Inhalte | ≈ 44.100 | ≈ 19.000 | S-1008-97, -98, -100, -101 |
| Simulation | ≈ 8.000 | ≈ 7.000 | S-1008-98 |
| Jede Ergänzung im Entscheidungsprotokoll | ≈ 13.000 | < 500 | S-1008-97 |
| Neuer Test in `pruefen.mjs` | ≈ 10.000–47.000 | ≈ 4.000–10.000 | S-1008-102 |

Die Startlektüre bleibt den ganzen Chat über im Kontext. Weniger Startlektüre heißt deshalb auch: Die Chats werden später „zu lang“ und brauchen seltener eine Übergabe.

**Reihenfolge:**
1. S-1008-97, -98, -99, -104: klein, sofort wirksam.
2. S-1008-100, -101: Inhalts-Chat, zusammen mit S-1008-87.
3. S-1008-103.
4. S-1008-102: mittel, mit Sicherungs-Branch.
5. S-1008-105 und -106 nur bei Bedarf.

## 7. Übergabetexte (Matthias gibt sie weiter; nur die Codes mit OK stehen lassen)
**An „App-Engine: Funktionen“:**
```
Auftrag vom Simulations-Chat (Prüfung Token-Effizienz, Bericht docs/pruefungen/2026-10-08-token-effizienz.md
auf Branch pruefung/token-effizienz-2026-10-08). OK von Matthias zu: S-1008-97, -98, -99, -102, -103, -104 (-105, -106 nur falls genannt)

Grundsatz: nichts löschen, nur wörtlich verschieben (Archiv docs/archiv/); keine Logikänderung.
- S-1008-97: docs/entscheidungen.md: Abschnitt „## 05.10.2026“ (5.–7.10.) wörtlich nach docs/archiv/entscheidungen-2026-10-05-bis-07.md,
  Verweis oben; Regel „anhängen ohne Lesen (cat >>), Überschrift ## <Datum> – <Thema> (<Code>), max. 3–4 Zeilen, ab ~20.000 Zeichen archivieren“
  in CLAUDE.md. Prüfen: Zeichenzahl Archiv + Rest = vorher.
- S-1008-98: docs/chats/funktionen.md, inhalte.md, simulation.md als Startdatei je Chat (Pflichtlektüre, Lesestoff je Aufgabe, Stand,
  letzter Code, offene Punkte, Session-IDs, Arbeitsregeln). Übergabe aus docs/ideen.md dorthin verschieben und aktualisieren; inhalte.md füllt
  der Inhalts-Chat, simulation.md übernimmt docs/simulation.md. Spalte „Startdatei“ in der Chat-Tabelle von CLAUDE.md.
- S-1008-99: in docs/chats/funktionen.md: Pflichtlektüre nur architektur.md „Dateien“ + engine.md; Tabelle „Lesestoff je Aufgabe“
  (Sync/Speichern, KI, Lernlogik, Tests …); Regel „Grep, dann offset/limit; große Dateien nie ganz lesen“; neue Doc-Texte kurz je Zeile.
- S-1008-102: tools/pruefen.mjs in tools/pruefen/*.mjs aufteilen (Vorschlag im Bericht, Abschnitt 4), reiner Umzug. Vorher Sicherungs-Branch
  sicherung/vor-pruefen-aufteilen; Ausgabe vorher/nachher gleich; neue Dateien in tools/engine-dateien.txt; danach „Engine übernehmen“ im
  Deutsch-Trainer und beide Prüfläufe grün.
- S-1008-103: tools/thema.mjs <id…> (Thema als Text: Theorie, Wörter, Übungen mit Nummern, mc-Lösung markiert), allgemein über APP;
  Vorlage docs/simulationen/hilfsskripte/themen-ausgeben.js auf Branch simulation/uebergabe-2026-10-08; kleiner Test; engine-dateien.txt.
- S-1008-104: CLAUDE.md: „Workflow (cp)“ → „tools/engine-dateien.txt (bei Engine-Dateien)“ (auch docs/engine.md Punkt 7); Simulations-Zeile
  (nur Kontrolle; schreibt tools/simulation.mjs, docs/simulationen/ auf simulation/…, docs/pruefungen/ auf pruefung/…); wer CLAUDE.md ändert;
  Abschnitt „Tokens sparen“ (5 Zeilen, Bericht Abschnitt 4); Wünsche nach Nummer sortieren, Nummern NICHT ändern.
- S-1008-105 (optional): abgeschlossene Berichte nach docs/archiv/ + Index, Verweise anpassen.
- S-1008-106: in docs/ideen.md vormerken: ki.js, daten.js, inhalte.js bei > 1.500 Zeilen thematisch teilen.
Vorgehen nach CLAUDE.md: Plan erklären, E-Codes, erst nach OK ändern; Prettier, pruefen.mjs, Eintrag in docs/entscheidungen.md.
```

**An „Opi suomea (Lerninhalte)“:**
```
Auftrag vom Simulations-Chat (Bericht docs/pruefungen/2026-10-08-token-effizienz.md, Branch pruefung/token-effizienz-2026-10-08).
OK von Matthias zu: S-1008-98 (dein Teil), S-1008-100, S-1008-101 (S-1008-103: README-Satz, sobald das Werkzeug da ist)
Grundsatz: nichts löschen, nur wörtlich verschieben (docs/archiv/).
- S-1008-98: deine Übergabe aus docs/lehrplan.md nach docs/chats/inhalte.md (Ordner legt der Funktionen-Chat an) und aktualisieren.
- S-1008-100: in docs/lehrplan.md „Nächste Themen“ (t09–t19, erledigt) und „Stand“-Protokoll wörtlich nach docs/archiv/lehrplan-verlauf.md;
  es bleiben Grundlagen-Tabelle, Regeln für neue Themen, „Wo steht Matthias“, offene Erinnerungen, Verweise. Langen Absatz Z. 14 als Liste.
- S-1008-101: nach S-1008-87: abdeckung.md = Kontrollliste Baustein → Thema (Master), entwuerfe-bis-b1.md = Detailentwürfe;
  Themenplan oben vermerken „übernommen (F-…), nur Nachweis“; doppelte Tabelle am Ende der Entwürfe erst streichen, wenn jede Zeile in
  abdeckung.md steht.
- S-1008-103 (später): in lektionen/README.md „lektionen.json nie ganz öffnen; Themen mit node tools/thema.mjs tNN lesen“.
Vorgehen nach CLAUDE.md: erklären, F-Codes, erst nach OK ändern und pushen.
```
