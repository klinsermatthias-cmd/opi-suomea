# Gemeinsamer Auftrag S-1013-4: vollständige Prüfung des Deutsch-Trainers (nur lesen)

Du bist ein Hilfs-Agent des Simulations-/Analyse-Chats. Matthias baut den **Deutsch-Trainer** für Aurora (Finnin, lebt in Österreich, Deutsch B1 → Ziel B2). Die App ist eine Spaced-Repetition-Lern-App; Grammatik-Erklärungen auf Englisch, Oberfläche Deutsch, österreichisches Standarddeutsch bevorzugt (mit bundesdeutscher Alternative).

## Pfade (alles NUR LESEN – nichts ändern, nichts committen, kein git checkout)
- Deutsch-Trainer, veröffentlichter Stand (main d99d0e2): `/home/user/deutsch-trainer`
  - `CLAUDE.md` (Regeln), `lektionen/README.md`, `lektionen/pruefliste.md` (16 Zeilen + Quellenliste), `docs/lehrplan.md` (Themenplan d01–d33, Grundsätze), `docs/uebungsformate.md` (Übungstypen), `lektionen/lektionen.json` (d01–d03), `js/inhalte.js` (Einstufungstest + GLOSS_EXTRA), `js/app.js` (App-Einstellungen/Texte)
- Entwürfe d04–d09 (noch nicht veröffentlicht) und Prüfberichte: `scratchpad/dt-entwuerfe/docs/pruefungen/deutsch/` (`entwuerfe/dNN.json`, `entwuerfe/dNN-quellen.md`, `plan-final.md`, `2026-10-12-gesamtpruefung-d01-d09.md`)
- Lokale Testkopie mit d01–d09 zusammen und allen GLOSS-Vorschlägen: `scratchpad/dtw` (`lektionen/lektionen.json`, `js/inhalte.js`); `NODE_PATH=$(npm root -g) node tools/pruefen.mjs` läuft dort (≈ 40 s)
- Gemeinsame Engine-Quellen (Bewertung, KI-Aufträge, Sprache): `scratchpad/main-wt/js/` (z. B. `daten.js`, `uebungen.js`, `formate.js`, `sprache.js`, `ki.js`)
- Große Dateien nie ganz lesen: grep, dann Ausschnitte; JSON mit kleinen `node -e`-Skripten auswerten.

## Quellen (Netz über curl; Pausen 2–4 s zwischen Abrufen derselben Seite)
Erreichbar: integrationsfonds.at (ÖIF), osd.at, grammis.ids-mannheim.de, duden.de, dwds.de, en/de.wiktionary.org (Rohtext `index.php?title=<Wort>&action=raw`; Werkzeug `node /home/user/opi-suomea/tools/quellen.mjs --sprache de <Wort>`), ostarrichi.org, learngerman.dw.com, dw.com, vhs-lernportal.de, deutsch.lingolia.com, mein-deutschbuch.de, schubert-verlag.de, hueber.de, klett-sprachen.de, deutschakademie.de, duolingo.com, babbel.com, busuu.com. Gesperrt/blockt: goethe.de, coe.int, Langenscheidt.
**Jede Aussage mit Quelle (URL) belegen.** Was nur aus eigenem Wissen stammt, als „ohne Quelle“ kennzeichnen. Nicht erreichbare Seiten nennen, nie so tun, als wäre geprüft worden.

## Datenschutz
Repos sind öffentlich: keine Daten von Aurora, keine E-Mail-Adressen, keine Schlüssel in den Bericht.

## Ausgabe
Bericht auf Deutsch, knapp und konkret, als Markdown in die dir genannte Datei unter `scratchpad/berichte/1013/`. Aufbau: Kurzfazit (5 Zeilen) · Befunde als Tabelle (Befund | Stelle | Beleg/Quelle | Schwere hoch/mittel/niedrig | Vorschlag) · „Geprüft, ohne Befund“ · „Nicht prüfbar / ohne Quelle“. Keine Codes vergeben. Am Ende antwortest du mit 5–8 Zeilen Zusammenfassung und dem Pfad.
