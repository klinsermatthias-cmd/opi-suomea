# Prüfung der Deutsch-Trainer-Inhalte (S-1011) – Anleitung für die Prüfer

## Hintergrund
Der **Deutsch-Trainer** ist eine Lern-App für **Aurora** (Finnin, lebt in Österreich, Deutsch B1 → Ziel B2 im Alltag und
Beruf). Erklärungen sind auf **Englisch**, Beispiele in **österreichischem Standarddeutsch**. Nach einem Einstufungstest
wurden die ersten Themen gebaut: d01 Perfekt, d02 Wortstellung, d03 als/wenn/wann + Präteritum.
**Testergebnis (Zusammenfassung):** Lesen und österreichischer Alltagswortschatz B1, Grammatik und Schreiben A2/A2+.
Häufigste Fehler: Perfekt mit „sein“, Wortstellung (Verb-Zweit, Verb am Ende im Nebensatz), Dativ und
Wechselpräpositionen, „wann“ statt als/wenn/während, Pronomen, Genus.

Auftrag von Matthias: **genauestens prüfen**, ob (1) für jedes Thema wirklich alle relevanten Dinge vorhanden sind,
(2) die Übungen ausreichen, um das Thema in der Tiefe zu lernen, (3) alle Übungen korrekt sind. Sei so kritisch und
genau wie möglich, aber fair – nur echte Probleme, jedes belegt.

**Zusatzauftrag (Matthias, 11.10.2026) – drei weitere Prüfpunkte:**
1. **Großes Bild statt Teilreparatur:** Auch wenn im Test nur ein Teil eines Themas falsch war, soll das Thema das
   **ganze System** erklären und üben (Beispiel Wortstellung: Verb-Zweit im Hauptsatz, Verb-Erst bei Ja/Nein-Frage und
   Imperativ, Verb am Ende im Nebensatz, Satzklammer, Vorfeld/Mittelfeld, Haupt- und Nebensatz verbunden), damit der
   Zusammenhang verständlich wird. Prüfe: Erklärt die Theorie das Gesamtsystem mit einer Übersicht? Decken die Übungen
   **alle** Teile ab (nicht nur die Testfehler) und verbinden sie (Kontrast-, Umbau- und Mischübungen)?
2. **Unterthemen:** Ist ein Thema für eine Lerneinheit zu groß (zu viele Regeln, > ca. 3 neue Teilregeln, Theorie zu
   lang)? Dann konkret vorschlagen, wie es in kleinere, gut verdauliche Unterthemen geteilt wird (Titel, Inhalt,
   Reihenfolge, `req`). App-Regel beachten: bestehende Themen-IDs, Karten und Übungen bleiben (nur anhängen); Unterthemen
   sind daher **neue Themen** (z. B. Wiederholung/Vertiefung) oder eine Aufteilung künftiger Themen.
3. **Niveaufolge A1 → A2 → B1 → B2:** Grundlegende Themen zuerst, aufbauende danach (z. B. Genus/Artikel und Kasus vor
   Wechselpräpositionen, Adjektivendungen, Relativsätzen) – **mit Rücksicht auf die Schwächen** aus dem Test: Lücken auf
   A1/A2-Niveau zuerst schließen, auch wenn die Lernende insgesamt B1 ist; Stärken nicht unnötig wiederholen.

## Dateien (nur lesen, nichts ändern, keine Commits)
- Themen aufbereitet: `/home/user/opi-suomea/docs/pruefungen/deutsch/texte/<id>.txt` (Theorie, Karten `vN`, Übungen
  `eN`, Dialogzeilen `eN.rM`, Lesetextzeilen `eN.sM`; bei Lücken alle akzeptierten Antworten als «a / b»).
- Original: `/home/user/klinsermatthias-cmd/deutsch-trainer/lektionen/lektionen.json` (nur bei Bedarf, gezielt).
- Regeln des Deutsch-Trainers: `…/deutsch-trainer/lektionen/pruefliste.md` (Prüfliste, **Pflichtlektüre**),
  `…/lektionen/README.md`, `…/docs/uebungsformate.md`, `…/docs/lehrplan.md`, `…/CLAUDE.md`.
- Einstufungstest (was abgefragt wurde): `…/deutsch-trainer/js/inhalte.js` (nur bei Bedarf, per Grep).
- Testergebnis im Detail (vertraulich, nur lesen, **nie** zitieren oder kopieren; in Funden nur allgemein
  „Testschwäche: …“): `/tmp/claude-0/-home-user-opi-suomea/666db11b-b7fe-50f9-84ce-0a94670b5dcb/scratchpad/deutsch/testergebnis.md`.
- ÖIF-Rahmencurricula und Einstufungsmatrizen als Text: `/tmp/claude-0/-home-user-opi-suomea/666db11b-b7fe-50f9-84ce-0a94670b5dcb/scratchpad/deutsch/quellen/`
  (A1–B2 Matrix, A2/B1/B2 Rahmencurriculum; Original-URLs: `https://www.integrationsfonds.at/fileadmin/user_upload/<Name>.pdf`).

## Quellen (freigegeben, erreichbar)
duden.de (`/rechtschreibung/<Slug>`, ä → ae), dwds.de (`/wb/<Wort>`), de.wiktionary.org und en.wiktionary.org
(Rohtext `index.php?title=<Wort>&action=raw`, höchstens 1 Abruf alle 2–3 s), grammis.ids-mannheim.de (lädt per
JavaScript – mit Playwright/Chromium öffnen: `executablePath: '/opt/pw-browsers/chromium'` falls nötig),
ostarrichi.org (österreichische Wörter), integrationsfonds.at (ÖIF), osd.at (ÖSD-Modellsätze).
goethe.de und coe.int blocken automatische Abrufe. Mit `curl -sL -A 'Mozilla/5.0'` abrufen.
**Jeder Fund braucht eine Quelle** (URL) oder den Vermerk „ohne Quelle“. Formen, die du für richtig hältst, musst du
nicht einzeln belegen – aber alles Zweifelhafte nachschlagen.

## Kategorien
| Kürzel | Bedeutung |
|---|---|
| FEHLER | Deutsch falsch: Grammatik, Rechtschreibung, Genus, Beugung, Bedeutung passt nicht zur Aufgabe |
| AKZEPTANZ | richtige Antwort wird nicht akzeptiert (fehlt in `a` bzw. in der Lücke) oder eine falsche wird akzeptiert |
| MEHRDEUTIG | Aufgabe/Lücke lässt mehrere richtige Lösungen zu, die nicht alle akzeptiert sind; `h` fehlt, verrät zu viel oder irreführt |
| UNNATÜRLICH | grammatisch richtig, aber so sagt/schreibt man es in Österreich nicht |
| ENGLISCH | englische Erklärung, Übersetzung oder Karte falsch oder irreführend |
| THEORIE | Regel in der Theorie falsch, unvollständig oder missverständlich |
| UNGELERNT | Übung verlangt ein Wort/eine Regel, das nicht in `v` dieses/früherer Themen bzw. in der Theorie steht |
| FEHLT | ein für das Thema relevanter Teil fehlt ganz (Regel, Form, Ausnahme, typischer Fehler, Situation) |
| DIDAKTIK | Übungen reichen nicht für Tiefe: zu wenige zu einem Teil, nur gelenkt statt frei, keine Fehler-Kontraste, Progression fehlt |
| GESAMTBILD | Theorie/Übungen reparieren nur Teilfehler, das Gesamtsystem des Themas wird nicht erklärt bzw. nicht verbunden geübt |
| UNTERTHEMA | Thema zu groß für eine Einheit – Vorschlag zur Aufteilung |
| REIHENFOLGE | Thema kommt zu früh/zu spät (Niveau A1→B2, Voraussetzungen, `req`) |
Schwere: **hoch** (lehrt Falsches / blockiert Lernen) · **mittel** (verwirrt, wertet falsch) · **niedrig** (Feinschliff).

## Ausgabe (WICHTIG: nach jedem Abschnitt sofort anhängen, nicht erst am Ende)
In deine Ausgabedatei mit `cat >> DATEI <<'EOF' … EOF`. Je Fund eine Zeile:
```
- d01 e12 | FEHLER | hoch | Befund (kurz, konkret) | Korrektur/Vorschlag (exakt) | Quelle: URL / ohne Quelle
```
Zusätzlich je nach Rolle die Abschnitte, die im Auftrag stehen. Am Ende `## FERTIG` und 5–10 Sätze Gesamturteil.
Falls die Datei schon Inhalte hat (Neustart): mit `grep '^## ' DATEI` nachsehen und beim nächsten fehlenden Abschnitt
weitermachen.

## Regeln
- Unabhängig arbeiten: keine anderen Dateien in `funde/` lesen.
- Deutsch schreiben, deutsche Beispiele exakt; nichts im Repository ändern.
- Schlussantwort: Anzahl Funde je Kategorie/Schwere und die 5 wichtigsten.
