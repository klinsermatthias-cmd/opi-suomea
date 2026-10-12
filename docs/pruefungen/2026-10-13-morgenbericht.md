# Morgenbericht 13.10.2026 – Nachtarbeit des Simulations-/Analyse-Chats

Freigaben: S-1012-101 bis -107 („Ich gebe alles frei“), S-1012-110 (nur d05–d09), S-1012-111 bis -119. Regel vom Abend: zu jedem österreichischen Wort die bundesdeutsche Alternative (auch in d01–d03 prüfen).

## Erledigt
| Code | Ergebnis | Wo (Branch, Commit) |
|---|---|---|
| S-1012-101/-103 | Kartenformat bestätigt, *stand*-Eintrag zusammengeführt | pruefung/deutsch-d04-d09, 5572f88 |
| S-1012-110 | Entwürfe d05–d09 fertig (je JSON + Quellendatei, `pruefen.mjs` „Alles in Ordnung“) | pruefung/deutsch-d04-d09: d05 1fdd366, d06 78e2a00, d07 4f2ac58, d08 607bbe5, d09 548ea17 |
| Österreich-Regel | d04–d09 erfüllt (d04 nachgebessert); d01–d03: drei Kartentexte als Vorschlag | Gesamtprüfung, 64f0019 |
| S-1012-111 | Gesamtprüfung d01–d09: alle Vorgaben erfüllt, keine doppelten Karten/GLOSS-Schlüssel; 53 GLOSS-Vorschläge für Nomen in d01–d03 | pruefung/deutsch-d04-d09, 64f0019 |
| S-1012-113 | Inhalte Opi suomea: alle 58 Themen gelesen, ~135 Wiktionary-Abrufe – **keine falsche finnische Form**; Befunde zu `req`, Prüfliste 6/8/9, Hinweisen → S-1012-127 bis -129 | pruefung/nacht-2026-10-12, 2cfe739 |
| S-1012-114 | Engine-Code: Datenverlust bei Uhrenabweichung (nachgestellt), Großschreibung bei englischen Antworten im Deutsch-Trainer, keine Selbstbewertung bei Dialogen/ohne KI → S-1012-121 bis -125 | pruefung/nacht-2026-10-12, 504c1ab |
| S-1012-112 | „Wörter vorab lernen“ jetzt in beiden Apps geprüft (Opi suomea 2×/3×, Deutsch-Trainer 5×), ohne Fehler; Deutsch-Trainer mit d01–d09: 160 Tage ohne Problem | simulation/abdeckung-2026-10-12, 9b028a4 |
| S-1012-115 | Grenzfälle: 9 Tage Handy offline, voller Speicher, 4 Tage Gemini-Ausfall – **kein Datenverlust**; Befund S-1012-126 | simulation/abdeckung-2026-10-12, 9b028a4 |
| S-1012-116 | Lernprofile: langsam (65 %) bleibt bei 4 von 9 Themen stehen → S-1012-130; schnell/Handy täglich und 3 Wochen Pause ohne Fehler | simulation/abdeckung-2026-10-12, 9b028a4 |
| S-1012-117 | Handy-Oberfläche: kein Überlauf; 6 kleinere Befunde (niedrige Text-Knöpfe, knapper Kontrast) | pruefung/ui-2026-10-12, e5abc6d |
| S-1012-118 | Wachstum hochgerechnet | (im Bericht unten) |
| S-1012-119 | Token-Nachmessung: Funktionen-Start −45 %, pruefen-Ausgabe −87 %, CI-Status −99,6 % | claude/language-app-token-analysis-b75s4a, 6f6f500 |

## Wachstum (S-1012-118)
- Lektionen Opi suomea: 50 Themen = 547 KB (107 KB gzip), Ø 7,1 KB/Thema → bei 100 Themen ≈ 1,1 MB (≈ 210 KB gzip), bei 150 ≈ 1,6 MB (≈ 320 KB gzip). JSON-Parse heute 1,6 ms (Node) – unkritisch.
- Deutsch-Trainer: Themen sind dreimal so groß (Ø 21 KB) → bei 33 Themen ≈ 0,9 MB (≈ 190 KB gzip).
- **Korrektur:** Die Lektionen liegen zusätzlich im localStorage (Schlüssel `<app>-lektionen`, `saveRepoCache` in `js/daten.js`; Opi suomea heute 328 KB). Dieser Schlüssel wächst mit jedem Thema mit: bei 100 Themen ≈ 1,1 Mio. Zeichen, bei 150 ≈ 1,6 Mio.; der Deutsch-Trainer bei 33 Themen ≈ 0,9 Mio. – beide Apps teilen sich ≈ 5 Mio. Zeichen auf github.io. Zusammen mit Lernstand und Sicherheitskopien (S-1012-104) wird es damit früher eng als gedacht → S-1012-104 (IndexedDB) auch für den Lektions-Zwischenspeicher.

## Neue Codes (alle offen, Entscheidung durch Matthias)
- S-1012-120: Deutsch-Trainer liest beim Start `docs/lehrplan.md` ganz (18,7 KB seit dem Themenplan) – nur Grundsätze + Themenzeile lesen (≈ −3.500 Tokens je Start).
- S-1012-121 bis -125: Befunde aus der Engine-Prüfung (siehe Bericht).
- S-1012-127 bis -129: Befunde aus der Inhaltsprüfung Opi suomea (siehe Bericht).
- S-1012-126 (mittel): „Alles löschen“ bei vollem Gerätespeicher – die Sicherheitskopie `-vor-loeschen` scheitert still (`safeCopy`), die Meldung verspricht trotzdem „Rückgängig unter Einstellungen“, der Knopf fehlt. Gerettet werden kann nur über die vorher heruntergeladene Sicherungsdatei. Gefunden im W20-Probelauf (Tag 9). Vorschlag: Scheitert die Kopie, Meldung „Rückgängig nur mit der eben gespeicherten Datei“ oder Löschen abbrechen.
- S-1012-130 (Entscheidung): Bei dauerhaft ~65 % Treffern stockt der Fortschritt an der 80-%-Regel (Deutsch-Trainer: 4 von 9 Themen in 70 Tagen). App verhält sich wie vorgesehen; Frage, ob eine zusätzliche Hilfe für schwache Phasen gewünscht ist.

## Wichtigste Punkte für heute
1. **S-1012-121 (hoch):** möglicher Datenverlust, wenn die Uhren von PC und Handy nicht gleich gehen – Auftrag an „App-Engine: Funktionen“.
2. **S-1012-122 (hoch, Aurora):** Im Deutsch-Trainer zählt kleingeschriebenes Englisch („i“, „monday“) als falsch.
3. **S-1012-104 + Wachstum:** localStorage wird bei Opi suomea nach ~80 Lerntagen knapp; der Lektions-Zwischenspeicher wächst mit jedem Thema mit.
4. **Entwürfe d05–d09** sind bereit zur Übernahme durch den Deutsch-Trainer-Chat (Anleitung: Abschnitt 7), dazu die GLOSS-Vorschläge d01–d03 und drei Kartentexte (Gesamtprüfung).
5. Der Funktionen-Chat kann die Branches `simulation/abdeckung-2026-10-12` (S-1012-107) und die Prüfberichte übernehmen.

## Weiterleiten (Texte zum Einfügen)
- **An „App-Engine: Funktionen“:** „Bitte lies `docs/pruefungen/2026-10-12-engine-review.md` und `docs/simulationen/2026-10-13-nacht.md` (Branches pruefung/nacht-2026-10-12 und simulation/abdeckung-2026-10-12). Freigegeben sind S-1012-102, -104, -105, -107; zur Entscheidung stehen S-1012-121 bis -126.“
- **An „Deutsch-Trainer (Lehrinhalte)“:** „Entwürfe d04–d09 liegen auf opi-suomea, Branch pruefung/deutsch-d04-d09, Ordner docs/pruefungen/deutsch/entwuerfe/ (je dNN.json + dNN-quellen.md). Dazu `docs/pruefungen/deutsch/2026-10-12-gesamtpruefung-d01-d09.md`: drei Kartentexte für d01/d02 (bundesdeutsche Alternativen), 53 GLOSS-Vorschläge für d01–d03, Vorschlag Prüfliste Zeile 17. S-1012-120: beim Start nur die Themenzeile aus docs/lehrplan.md lesen.“
- **An „Opi suomea (Lerninhalte)“:** „Bitte lies `docs/pruefungen/2026-10-12-inhalte-opi-suomea.md` (Branch pruefung/nacht-2026-10-12): S-1012-127 bis -129.“

## Hinweis zur Nacht
Der Cloud-Container wurde zweimal bei Leerlauf neu gestartet und hat dabei laufende Simulationen beendet. Danach liefen kürzere Läufe mit einem Fortschritts-Monitor. Alle Ergebnisse sind gepusht; nichts auf `main`, nichts im Repo deutsch-trainer.
