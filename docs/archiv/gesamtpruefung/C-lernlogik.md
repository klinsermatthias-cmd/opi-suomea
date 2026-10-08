# C – Lernlogik

Geprüft (Engine-Chat, 8.10.2026): `js/lernen.js` vollständig (SM-2, Termine, Freischaltung, Karten, Tageslimits, Problemwörter),
in `js/uebungen.js` Übungsauswahl, Rundenstart, Wiederholen falscher Übungen, Abschluss und Bewertung (`pickRound`,
`startSession`, `record`, `finishTopic`, `rateTopic`), in `js/vokabeln.js` Themen-Wörter und Kartenbewertung, „Heute“ in
`js/ansichten.js`. Experimente im Headless-Chromium mit echten Inhalten und verschobener Uhr (Skripte des abgebrochenen
Prüfers `exp-C/e1, e2, e4, e5`, Ergebnisse unten).

## Befunde

### C1 – Ein gesperrtes Thema lässt sich über „Wörter vorab lernen“ lernen – seine Unterthemen werden frei, es selbst bleibt gesperrt
- **Schwere:** mittel (verletzt die strenge Freischaltung, Wunsch Nr. 13)
- **Wo:** `js/vokabeln.js:425–441` (`finishVocab`: Knopf „Weiter zu den Übungen“ ohne Blick auf den Status), `js/start.js:163`
  (`learn` startet ohne Prüfung), `js/uebungen.js:633–646` (`rateTopic`: Status bleibt „locked“, aber `last`, Termin und `refreshUnlocks`)
- **Problem:** Nach drei Freischaltversuchen unter 80 % bietet ein gesperrtes Folgethema „Schon vorbereiten – Wörter vorab lernen“
  an (gewollt, E-1007-62). Sind alle Wörter gewusst, zeigt der Abschluss „die Übungen sind jetzt frei“ und „Weiter zu den Übungen“.
  Das startet eine volle Lernrunde des **gesperrten** Themas. Danach bleibt es „gesperrt“, hat aber ein Ergebnis – und mit ≥ 80 %
  werden **seine Unterthemen freigeschaltet**. Das Thema selbst kommt nie zur Wiederholung (nur Themen „learning“ werden geplant).
- **Ablauf/Beleg:** `exp-C/e1.mjs`: t10 gesperrt → Wörter vorab gelernt → „Weiter zu den Übungen“ → Runde (15 Übungen) mit 100 % →
  t10 `status: "locked"`, `last: 1`; neu frei: t10b, t10c; `dueTopics()` enthält t10 nicht.
- **Folge:** Matthias kann (unbeabsichtigt) die Sperre umgehen; danach stehen Unterthemen offen, deren Hauptthema als gesperrt gilt
  und nie wiederholt wird – ein widersprüchlicher Stand.
- **Vorschlag:** Im Abschluss gesperrter Themen statt „Weiter zu den Übungen“ den Text „Die Übungen werden frei, sobald … ≥ 80 %“
  und „Zurück zum Thema“; `startSession(…, "learn")` lehnt gesperrte Themen ab. Einmalige Reparatur in `migrate()`: gesperrte Themen
  mit Ergebnis wie neue behandeln (Verlauf behalten). Test in `pruefen.mjs`.
- **Aufwand:** klein
- **Apps:** beide

### C2 – Eine Voraussetzung unter 80 % kann den Fortschritt wochenlang blockieren, ohne dass „Heute“ es sagt
- **Schwere:** mittel (Lernfluss)
- **Wo:** `js/uebungen.js:608–613` (`topicBase`: unter 80 % höchstens „Schwer“ = Abstand × 1,2), `js/lernen.js:116–121`
  (`topicIvMax`: KI darf unter 80 % bis zum Doppelten), `js/ansichten.js:221–222` („Heute erledigt“)
- **Problem:** Ein bereits mehrmals wiederholtes Thema mit 75 % bekommt mit „Schwer“ einen **längeren** Abstand als vorher
  (Beispiel aus `exp-C/e2.mjs`: 30 → **36 Tage**, KI-Grenze **72 Tage**). Alle Themen, die es voraussetzen, bleiben so lange
  gesperrt. „Heute“ zeigt dann „Heute erledigt – Neue Themen werden frei, sobald ein Thema mit mindestens 80 % sitzt“, nennt das
  Thema aber nicht und bietet keine Freischalt-Runde an (nur die Themenliste zeigt „Noch offen: … (75 %)“).
- **Folge:** Matthias sieht „alles erledigt“, kommt aber wochenlang nicht zu neuen Themen, wenn er nicht selbst in der Themenliste sucht.
- **Vorschlag:** (1) „Heute“: Gibt es kein neues Thema und wartet ein gesperrtes Thema nur auf Voraussetzungen unter 80 %, ist der
  nächste Schritt „Freischalt-Runde: <Thema> (75 %)“. (2) Themen unter 80 %, von denen andere abhängen, höchstens z. B. 7 Tage
  Abstand (auch für die KI). Didaktische Entscheidung – Matthias' Wunsch „neue Themen erst, wenn die aktuellen sitzen“ spricht dafür.
- **Aufwand:** klein bis mittel
- **Apps:** beide

### C3 – Wörter eines neuen Themas können am selben Tag doppelt gelernt werden und springen dann auf 4 Tage
- **Schwere:** niedrig
- **Wo:** `js/vokabeln.js:21–40` (`startTopicVocab` legt alle Karten an), `js/lernen.js:233–235` (`newFwdIds` nimmt sie in die
  normale Vokabelrunde auf), `js/vokabeln.js:359` (zweites „Gut“ am selben Tag = Wiederholung Nr. 2)
- **Problem:** Wird „Wörter lernen“ eines neuen Themas unterbrochen, landen die übrigen Wörter als neue Karten in der normalen
  Vokabelrunde (und verbrauchen das Tageslimit). Danach fragt „Wörter lernen“ sie noch einmal ab; das zweite „Gut“ am selben Tag
  zählt als bestandene Wiederholung → Abstand 4 statt 1 Tag.
- **Ablauf/Beleg:** `exp-C/e4.mjs`: 4 Wörter von t01b in der normalen Runde gelernt → in „Wörter lernen“ erneut → „Abstand 4, reps 2“;
  Tageszähler danach `newCards: 10` (Limit voll).
- **Folge:** Einige neue Wörter kommen zu spät wieder und werden eher vergessen; das Limit für neue Wörter ist schneller aufgebraucht.
- **Vorschlag:** Wörter von Themen im Status „neu“ (Wörter noch nicht fertig) nicht in die normale Runde nehmen – sie gehören zu
  „Wörter lernen“; zusätzlich ein zweites „Gut“ am Lerntag wie einen Lernschritt behandeln (kein Sprung auf 4 Tage).
- **Aufwand:** klein
- **Apps:** beide

### C4 – Doku widerspricht dem Code bei der KI-Grenze für Themen
- **Schwere:** niedrig (nur Doku)
- **Wo:** `docs/architektur.md` Abschnitt „Dynamik der Wiederholungen“ („sonst höchstens dreifacher“) ↔ `js/lernen.js:111–121`
  (seit E-1007-57 höchstens das Doppelte)
- **Vorschlag:** Doku-Satz berichtigen.
- **Aufwand:** klein
- **Apps:** beide

## Gut gelöst
- Freischaltung ist streng und nur in eine Richtung (`refreshUnlocks`): schon freie Themen werden nie wieder gesperrt, wenn Unterthemen
  als neue Voraussetzungen dazukommen.
- Falsche Übungen kommen 4 Aufgaben später wieder, auch mehrmals, bis sie richtig sind; gewertet wird nur der erste Versuch.
- Übungsauswahl ist fair: In 10 Wiederholungen von t08 (je 8 Übungen) kam **jede** der 22 Übungen mindestens einmal dran (`exp-C/e5.mjs`).
- Der KI-Termin nach einer Runde ist begrenzt und ändert den Plan-Abstand nicht (kein Aufschaukeln); bei KI-Ausfall gilt der Algorithmus.
- Vokabeln: Lernschritte wie bei Anki (zweites „Nochmal“ am selben Tag zählt nicht doppelt), Rückstand nach Überfälligkeit verteilt,
  beide Richtungen getrennt und nie am selben Tag hintereinander.
