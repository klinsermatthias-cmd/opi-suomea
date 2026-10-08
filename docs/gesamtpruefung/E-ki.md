# E – KI-Anbindung

Geprüft (Engine-Chat, 8.10.2026; Vorarbeit des abgebrochenen Prüfers übernommen): in `js/ki.js` `aiCall`, `geminiCall`,
`openaiCall`, `aiJSON`, `aiJudge`, `aiGenerate`, Prüfung der KI-Übungen, `genAutoStock`, Gesamtanalyse (`aiGlobal`,
`applyReschedule`, `runGlobal`, `maybeAutoGlobal`); in `js/uebungen.js` `textCheck`/`localCheck`; in `js/formate.js` die
Dialog-Prüfung. Messung der Auftragsgrößen mit realistischem Stand (52 Themen, 30 gelernt, 762 Karten, 80 Fehler) im
Headless-Chromium mit nachgebauter Gemini (`exp-E/exp1-groessen.mjs`), keine echten Aufrufe.

## Befunde

### E1 – Fällt die KI aus, zählt eine richtige, aber anders formulierte Antwort als Fehler
- **Schwere:** mittel
- **Wo:** `js/uebungen.js:418–425` (`textCheck`: bei Fehler `{correct: false, offline: true}`), `js/formate.js:369–372`
  (Dialog: nicht lokal passende Zeilen gelten als falsch), Wertung in `record()` (`js/uebungen.js:481–487`)
- **Problem:** Passt eine Antwort nicht wörtlich zur Musterlösung, entscheidet die KI. Ist sie nicht erreichbar (Zeitüberschreitung,
  Überlastung, Tageskontingent aller Modelle, Funkloch), wird die Antwort als **falsch** gewertet: Fehlereintrag, Wiederholung in
  der Runde, schlechteres Ergebnis. Die Rückmeldung sagt zwar „nur der Vergleich mit der Musterlösung“, aber es gibt keinen Weg,
  das zu korrigieren.
- **Folge:** Gerade bei Übersetzungen mit vielen richtigen Varianten kann eine Freischalt-Runde knapp unter 80 % fallen, nur weil
  Gemini kurz nicht antwortete (bei 15 Übungen kostet jede falsch gezählte Antwort 6–7 Prozentpunkte).
- **Vorschlag:** Bei KI-Ausfall die Übung **nicht werten** (wie eine Wiederholung: zählt nicht ins Ergebnis, kein Fehlereintrag)
  und anzeigen „nicht gewertet – {Lehrkraft} war nicht erreichbar“, oder einen Knopf „Meine Antwort war richtig“ anbieten, der
  sie als richtig mit Vermerk zählt (für Claude im Bericht sichtbar). Test in `pruefen.mjs` mit abgeschalteter KI.
- **Aufwand:** klein
- **Apps:** beide

### E2 – Gesamtanalyse: größter Auftrag, läuft etwa jeden zweiten Lerntag
- **Schwere:** niedrig (Kosten/Kontingent, keine Fehlfunktion)
- **Wo:** `js/ki.js:1041–1045` (`maybeAutoGlobal`: nach je 3 Runden oder nach 3 Tagen und 1 Runde), `:964–986` (`aiGlobal` mit
  ganzem `progressSummary()`)
- **Problem/Beleg:** Gemessen: Auftrag der Gesamtanalyse **14.469 Zeichen ≈ 4.400 Token** (größter Posten: Themenliste 5.911 Zeichen,
  offene Fehler 1.876, schwierige Übungen 1.454) – mehr als jeder andere Auftrag; dazu Antwort und Denk-Token. Laut Simulation
  ~110 Läufe in 180 Tagen. Wirkung je Lauf ist klein (höchstens 4 Themen vorziehen, `basicsSolid` einmalig).
- **Folge:** Verbraucht Tageskontingent, das bei der Antwortprüfung fehlen kann (siehe E1).
- **Vorschlag:** höchstens alle 3 Tage **und** frühestens nach 5 Runden; in der Themenliste nur Themen mit Runden seit der letzten
  Analyse plus die schwächsten 5 ausführlich, den Rest als eine Zeile „sitzt (≥ 80 %)“. Geschätzte Ersparnis: ~⅔ der Analyse-Aufrufe,
  ~40 % ihrer Länge. „Jetzt analysieren“ bleibt jederzeit möglich.
- **Aufwand:** klein
- **Apps:** beide

### E3 – „Neue Übungen“ schicken die ganze Wortliste
- **Schwere:** niedrig (Kosten)
- **Wo:** `js/ki.js:568` (`knownWords(t, true)` = alle gelernten Wörter), gemessen 12.524 Zeichen ≈ 3.800 Token, davon Wortliste 7.827 Zeichen
- **Vorschlag:** wie bei Schreiben/Rollenspiel (Paket E, E-1007-77) nur Wörter des Themas und seiner Voraussetzungen (Einsparpotenzial Nr. 2).
- **Aufwand:** klein
- **Apps:** beide

## Auftragsgrößen (gemessen, realistischer Stand)
| Art | Zeichen | ≈ Token | Bemerkung |
|---|---|---|---|
| Gesamtanalyse | 14.469 | 4.400 | ~0,6× je Lerntag → E2 |
| Neue Übungen | 12.524 | 3.800 | höchstens 1× am Tag → E3 |
| Rollenspiel-Antwort | 7.169–7.222 | 2.200 | je Zug, bis 10 Züge |
| Rollenspiel-Start / Schreiben (Aufgabe) | 5.505–5.644 | 1.700 | |
| Schreib-Korrektur / Dialog / Schreibaufgabe | 3.728–4.536 | 1.100–1.400 | |
| Rundenauswertung | 2.285 | 700 | entfällt bei 100 % + Gut/Einfach |
| Frage, Wort, Vokabel, Hören | 590–1.353 | 180–410 | |
Fazit: Mit Gemini Free Tier sind eher die **Anfragen pro Tag** knapp als die Token. E2 spart Anfragen ohne spürbaren Qualitätsverlust.

## Verdachtsfälle (nicht belegt)
- `geminiCall` schickt `thinkingConfig: {thinkingLevel: "low"}`. Lehnt ein Modell das ab (laut Code-Kommentar möglich), läuft es danach
  **ganz ohne** Vorgabe – bei Gemini-2.5-Modellen heißt das: volles Nachdenken nach eigenem Ermessen, also langsamer (Prüfungen haben
  nur 20 s) und mehr Token. Prüfen im KI-Protokoll: Denk-Token und Zeitüberschreitungen bei `gemini-2.5-flash` als Ausweiche.
  Abhilfe wäre für diese Modelle `thinkingBudget` (klein oder 0) statt gar nichts.
- Ein abgeschaltetes Modell (HTTP 404) wird nicht vorübergehend übersprungen (`aiDownMark` nur für Kontingent/Überlastung/Zeit) –
  kostet je Aufruf eine schnelle Fehlanfrage, sonst harmlos.

## Gut gelöst
- KI-Ergebnisse werden vor der Wirkung begrenzt: Termine (`topicIv`, `applyReschedule`: nur vorziehen, 1–60 Tage, höchstens 4),
  Freischaltung der KI-Übungen nur mit `basicsSolid` **und** eigener Prüfung (`basicsStatus`), KI-Übungen nur nach Format-Prüfung
  (`validEx`) und erst nach Claudes ✓.
- Modell-Ausweiche mit vorübergehendem Überspringen, verständliche Fehlerarten, ungültiges JSON wird einmal mit kürzerer Vorgabe wiederholt.
- Antworten, die nach dem Ende einer Runde eintreffen, ändern nichts mehr (`SESSION !== se`); die Rundenauswertung setzt den Termin
  im aktuellen Stand, auch wenn der Abgleich ihn inzwischen ersetzt hat.
- Lückentext: offensichtlich falsche Eingaben gehen gar nicht erst an die KI (spart Anfragen).
