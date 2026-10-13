# Werkzeuge und Rohdaten der Entwürfe d04–d09 (Simulations-/Analyse-Chat, 12./13.10.2026)

Gesichert beim Umsiedeln des Chats (13.10.), damit nichts verloren geht. Nur Arbeitsdateien, keine Daten von Aurora.
- `d04.py` … `d09.py`: Generatoren der Entwürfe `../../entwuerfe/dNN.json` (Ausgabe JSON; Pfade im Kopf an die eigene Umgebung anpassen).
- `gloss-d04.js` … `gloss-d09.js`, `gloss-d0103.js` (53 Nomen in d01–d03): GLOSS_EXTRA-Vorschläge zum Anhängen an `js/inhalte.js` des Deutsch-Trainers.
- `add.js`, `gesamt.js`, `neu.js`, `nomen.js`, `oesterr.js`, `moved.py`: Hilfsskripte (Testkopie zusammensetzen, Nomen-/Österreich-Prüfung, Kennzahlen).
- `quellen-*.txt`, `duden-d04.txt`, `phrasen-d04.txt`, `g?add.txt`, `alt-de.json`: Rohauszüge der Quellenabrufe und Zwischenlisten.
- `prueflisten-test.mjs`: Test der Prüflisten-Hinweise.
Testkopie zum Prüfen: Deutsch-Trainer klonen, `entwuerfe/d04–d09.json` an `lektionen/lektionen.json` anhängen und `gloss-*.js` an `GLOSS_EXTRA` anhängen; dann `NODE_PATH=$(npm root -g) node tools/pruefen.mjs`.
