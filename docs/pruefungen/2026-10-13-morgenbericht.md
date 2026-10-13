# Morgenbericht 13.10.2026 – Nachtarbeit des Simulations-/Analyse-Chats

Freigaben von gestern Abend: S-1012-101 bis -107 („Ich gebe alles frei“), S-1012-110 (nur d05–d09, wie in der Anleitung), S-1012-111 bis -119. Regel vom Abend: zu jedem österreichischen Wort die bundesdeutsche Alternative, auch d01–d03 prüfen. Nichts wurde auf `main` gepusht, nichts im Repo deutsch-trainer.

---

## 1. To-dos für Matthias (in dieser Reihenfolge)

### 1.1 Entscheiden – neue Codes (meine Empfehlung jeweils dahinter)
| Code | Worum es geht | Schwere | Empfehlung |
|---|---|---|---|
| **S-1012-121** | Datenverlust möglich, wenn die Uhren von PC und Handy nicht gleich gehen: Ein Gerät ersetzt seinen noch nicht hochgeladenen Stand durch den aus der Cloud, statt zusammenzuführen (nachgestellt) | **hoch** | **ja, zuerst** – Funktionen-Chat |
| **S-1012-122** | Deutsch-Trainer: kleingeschriebenes Englisch („i“, „monday“) zählt bei Übersetzungen ins Englische als falsch, ohne KI | **hoch** (Aurora) | **ja, zuerst** – Funktionen-Chat |
| S-1012-123 | Keine Selbstbewertung („Meine Antwort war richtig“) bei Dialogen und ganz ohne KI | mittel | ja |
| S-1012-124 | Sicherheitskopien in der App wiederherstellbar machen; beim Zusammenführen Plan-Änderungen und Verlauf nicht verlieren | mittel | ja |
| S-1012-125 | Sammelauftrag Kleinigkeiten (u. a. Lernserie an Sommerzeit-Tagen – **Umstellung am 25.10.**, Umlaute in zerlegter Form, 429 bei der Anmeldung) | niedrig | ja, Sommerzeit vor dem 25.10. |
| S-1012-126 | „Alles löschen“ bei vollem Speicher verspricht „Rückgängig“, das dann nicht geht (nur die heruntergeladene Datei rettet) | mittel | ja |
| S-1012-127 | Opi suomea: fehlende Voraussetzungen in `req` (t04c, t02c, t17d, t17c, t08d, t05b) | mittel | ja – Inhalte-Chat |
| S-1012-128 | Opi suomea: Regelfragen mit Erklärung ergänzen (16 Themen), 6 doppelte Karten, 6 Tabellen mit 4 Spalten beheben oder als gewollt eintragen | mittel | ja – Inhalte-Chat |
| S-1012-129 | Opi suomea: Hinweise mit Bau-Rezept, fehlende Wörterbuch-Einträge, „kaksoisvee“, Kleinigkeiten | niedrig | ja – Inhalte-Chat |
| S-1012-120 | Deutsch-Trainer-Chat liest beim Start den ganzen Lehrplan (18,7 KB) – nur Grundsätze + aktuelle Themenzeile lesen | niedrig (Tokens) | ja – Deutsch-Trainer-Chat |
| S-1012-130 | Wer dauerhaft ~65 % trifft, bleibt an der 80-%-Regel hängen (Deutsch-Trainer: 4 von 9 Themen in 70 Tagen). App verhält sich wie vorgesehen | Entscheidung | **abwarten bis Checkpoint 1** (echte Werte von Aurora), dann entscheiden |

Antwort einfach mit den Codes, z. B. „OK S-1012-120 bis -129, S-1012-130 abwarten“.

### 1.2 Weiterleiten (Texte zum Einfügen – dieser Chat erreicht die anderen nicht)
**a) In „App-Engine: Funktionen“ einfügen:**
> Vom Simulations-/Analyse-Chat (12./13.10.): Bitte lies auf opi-suomea `docs/pruefungen/2026-10-12-engine-review.md` (Branch `pruefung/nacht-2026-10-12`), `docs/pruefungen/ui-2026-10-12/README.md` (Branch `pruefung/ui-2026-10-12`) und `docs/simulationen/2026-10-13-nacht.md` (Branch `simulation/abdeckung-2026-10-12`). Freigegeben von Matthias: S-1012-102 (Antippen/Wortprüfung deutscher Nomen), S-1012-104 (localStorage → IndexedDB, auch Lektions-Zwischenspeicher), S-1012-105 (doppelte Gesamtanalyse), S-1012-107 (Branch `simulation/abdeckung-2026-10-12` prüfen und `tools/simulation.mjs` + Berichte nach main übernehmen). Zusätzlich [hier die Codes eintragen, die Matthias freigibt]: S-1012-121 bis -126. Bitte auch die Session-ID des Simulations-/Analyse-Chats (session_01GELRJqy8SAofm8nNVX2fcy) in `docs/chats/sessions.md` eintragen.

**b) In „Deutsch-Trainer (Lehrinhalte)“ einfügen:**
> Vom Simulations-/Analyse-Chat: Die Entwürfe d04–d09 sind fertig – opi-suomea, Branch `pruefung/deutsch-d04-d09`, Ordner `docs/pruefungen/deutsch/entwuerfe/` (je `dNN.json` + `dNN-quellen.md` mit Quellen, GLOSS-Vorschlägen, req, pruefen-Ergebnis, Prüfliste 1–16). Laut Anleitung d04–d07 jetzt übernehmen, d08–d09 nach Checkpoint 1. Dazu `docs/pruefungen/deutsch/2026-10-12-gesamtpruefung-d01-d09.md`: drei Kartentexte für d01/d02 mit bundesdeutscher Alternative (Heurige, Krankenstand, Ordination), 53 GLOSS-Vorschläge für Nomen in d01–d03, Vorschlag neue Prüflisten-Zeile 17 (österreichisch → bundesdeutsche Alternative). Kartenformat „der Markt, die Märkte“ ist bestätigt (S-1012-101). [falls freigegeben:] S-1012-120: beim Start nur Grundsätze + Themenzeile aus `docs/lehrplan.md` lesen.

**c) In „Opi suomea (Lerninhalte)“ einfügen:**
> Vom Simulations-/Analyse-Chat: Inhaltsprüfung aller 58 Themen – kein Fehler im Finnischen gefunden. Bericht: opi-suomea, Branch `pruefung/nacht-2026-10-12`, `docs/pruefungen/2026-10-12-inhalte-opi-suomea.md`. [falls freigegeben:] S-1012-127 bis -129 umsetzen.

### 1.3 Danach / bei Gelegenheit
- **08:00-Erinnerung** (gestern gestellt): T-1012-Einfügetexte für die anderen Chats – kommt von selbst; am besten zusammen mit 1.2 erledigen.
- **Deutsch-Trainer erneut simulieren**, sobald d04–d07 dort veröffentlicht sind (mit den Entwürfen schon geprüft; ein Lauf mit der echten Fassung bestätigt es).
- **Checkpoint 1** nach d07: Bericht von Aurora → dann S-1012-130 entscheiden.
- Hinweis Cloud: Lange Simulationen brauchen eine aktive Sitzung (der Container wird bei Leerlauf zurückgefordert). Künftige Nachtläufe plane ich gleich mit Fortschritts-Monitor.

---

## 2. Erledigt in der Nacht
| Code | Ergebnis | Wo (Branch, Commit) |
|---|---|---|
| S-1012-101/-103 | Kartenformat bestätigt, *stand*-Eintrag zusammengeführt | pruefung/deutsch-d04-d09, 5572f88 |
| S-1012-110 | **Entwürfe d05–d09 fertig** (je 61–63 Übungen, 8 Formate, Quellen, `pruefen.mjs` „Alles in Ordnung“) | pruefung/deutsch-d04-d09: d05 1fdd366, d06 78e2a00, d07 4f2ac58, d08 607bbe5, d09 548ea17 |
| Österreich-Regel | d04–d09 erfüllt (d04 nachgebessert: Kartoffeln/Tomaten/Brötchen in den Lösungen); d01–d03: drei Kartentexte als Vorschlag | pruefung/deutsch-d04-d09, 4f2ac58, 64f0019 |
| S-1012-111 | Gesamtprüfung d01–d09: alle Vorgaben der Anleitung erfüllt, keine doppelten Karten/GLOSS-Schlüssel, 53 GLOSS-Vorschläge für d01–d03 | pruefung/deutsch-d04-d09, 64f0019 |
| S-1012-112 | „Wörter vorab lernen“ jetzt in beiden Apps geprüft (Opi suomea 2×/3×, Deutsch-Trainer 5×), fehlerfrei; Deutsch-Trainer mit d01–d09: 160 Tage ohne Problem | simulation/abdeckung-2026-10-12, 9b028a4 |
| S-1012-113 | Inhalte Opi suomea: alle 58 Themen, ~135 Wiktionary-Abrufe – **keine falsche finnische Form**; Befunde → S-1012-127 bis -129 | pruefung/nacht-2026-10-12, 2cfe739 |
| S-1012-114 | Engine-Code geprüft; Befunde → S-1012-121 bis -125 (die zwei schweren selbst im Code nachvollzogen) | pruefung/nacht-2026-10-12, 504c1ab |
| S-1012-115 | Grenzfälle: 9 Tage Handy offline, voller Speicher (129 von 129 Wiederholungen erhalten), 4 Tage Gemini-Ausfall – **kein Datenverlust**; Befund S-1012-126 | simulation/abdeckung-2026-10-12, 9b028a4 |
| S-1012-116 | Lernprofile: langsam → S-1012-130; schnell + Handy täglich: alle 9 Themen; 3 Wochen Pause: Rückstand ohne Fehler abgebaut | simulation/abdeckung-2026-10-12, 9b028a4 |
| S-1012-117 | Handy-Oberfläche (390 px, hell/dunkel): kein Überlauf, keine Skriptfehler; 6 kleinere Befunde (Text-Knöpfe 17 px hoch, Kontrast 4,4:1 knapp unter 4,5:1, schmale Tippflächen in Tabellen) | pruefung/ui-2026-10-12, e5abc6d |
| S-1012-118 | Wachstum hochgerechnet (Abschnitt 3) | dieser Bericht |
| S-1012-119 | Token-Nachmessung: Funktionen-Start −45 %, `pruefen`-Ausgabe −87 %, CI-Status −99,6 %; Deutsch-Trainer-Start +55 % wegen Themenplan → S-1012-120 | claude/language-app-token-analysis-b75s4a, 6f6f500 |
| Simulation | Skript erweitert: W19 (prevocab), W20 (offline, Speicher voll, Gemini-Ausfall), W21 (Lernprofile); zwei Fehlalarme behoben | simulation/abdeckung-2026-10-12, fc8545c … 1c4ed36 |

## 3. Wachstum (S-1012-118)
- Lektionen Opi suomea: 50 Themen = 547 KB (107 KB gzip), Ø 7,1 KB/Thema → 100 Themen ≈ 1,1 MB, 150 ≈ 1,6 MB. Laden/Parsen unkritisch.
- Deutsch-Trainer: Ø 21 KB/Thema → 33 Themen ≈ 0,9 MB.
- **Engpass ist der localStorage:** Neben Lernstand und Sicherheitskopien liegen dort auch die Lektionen (`<app>-lektionen`). Beide Apps teilen sich ≈ 5 Mio. Zeichen auf github.io. Simulation: Opi suomea +0,8–0,95 Mio. Zeichen je 30 Tage, ab ≈ Tag 80 über 2,5 Mio. → S-1012-104 (IndexedDB) auch für den Lektions-Zwischenspeicher.

## 4. Alle Berichte
- Entwürfe und Gesamtprüfung Deutsch-Trainer: `docs/pruefungen/deutsch/` auf **pruefung/deutsch-d04-d09**
- Engine-Prüfung, Inhaltsprüfung Opi suomea, dieser Morgenbericht: `docs/pruefungen/` auf **pruefung/nacht-2026-10-12**
- Handy-Oberfläche mit Screenshots: `docs/pruefungen/ui-2026-10-12/` auf **pruefung/ui-2026-10-12**
- Simulationen: `docs/simulationen/2026-10-12-180-tage.md` und `2026-10-13-nacht.md` auf **simulation/abdeckung-2026-10-12**
- Token-Analyse und Nachmessung: `docs/token-analyse/` auf **claude/language-app-token-analysis-b75s4a**

## 5. Stand der Codes dieses Chats
- Erledigt/freigegeben: S-1012-101 bis -107, -110 bis -119
- Nicht gewählt: S-1012-108, -109 (Matthias hat -110 gewählt)
- Offen zur Entscheidung: **S-1012-120 bis -130**
- Letzter vergebener Code: **S-1012-130**
