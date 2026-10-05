# Lektionen

`lektionen.json` enthält alle Themen ab **t09** als JSON-Array. Die App lädt die Datei bei jedem Start und übernimmt neue oder geänderte Themen; der Fortschritt bleibt erhalten.

## Regeln
- Format: siehe `docs/uebungsformate.md`. Pflichtfelder: `id`, `title`, `v`, `ex` (mind. 1 gültige Übung). Ist auch nur eine Übung oder Vokabel ungültig, übernimmt die App das **ganze Thema nicht** (bzw. behält die alte Version).
- IDs fortlaufend: `t09`, `t10`, … – nie umbenennen, nie löschen (sonst geht Fortschritt verloren).
- In bestehenden Themen Vokabeln und Übungen **nur hinten anhängen** (Karten-IDs hängen vom Index ab).
- `req` setzen: **alle** Themen eintragen, auf denen das Thema inhaltlich aufbaut (Grammatik oder Wortschatz). Das Thema wird erst frei, wenn alle Voraussetzungen beim letzten Ergebnis je ≥ 80 % hatten (Wunsch von Matthias, so beibehalten).
- Pro Thema: **Alltagssituation + Grammatik-Baustein** (siehe `docs/lehrplan.md`). Theorie-Aufbau: 1) Situation und nützliche Sätze (Tabelle finnisch–deutsch), 2) ab t10 ein kurzer Dialog als Lesetext, 3) die Grammatik, die die Situation braucht, mit Tabelle. 8–15 Vokabeln, 10–14 Übungen, davon einige zur Situation (passende Antwort wählen, Dialog ergänzen, Satz bilden); Grammatik immer auch als `tab`-Übung.
- Nur Wörter verwenden, die aus früheren Themen oder dem eigenen `v` bekannt sind.
- Finnisch muss korrekt sein; Vokalharmonie und Stufenwechsel prüfen.
- Nach dem Bearbeiten immer `node tools/pruefen.mjs` ausführen: prüft JSON, Pflichtfelder, Voraussetzungen, Nur-anhängen-Regel und löst jede Übung im Browser mit der Musterlösung (z. B. ob sich ein `ord`-Satz aus den Wörtern bilden lässt). Die GitHub Action macht dasselbe und veröffentlicht nur bei Erfolg.
