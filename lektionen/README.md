# Lektionen

`lektionen.json` enthält alle Themen ab **t09** als JSON-Array. Die App lädt die Datei bei jedem Start und übernimmt neue oder geänderte Themen; der Fortschritt bleibt erhalten.

## Regeln
- Format: siehe `docs/uebungsformate.md`. Pflichtfelder: `id`, `title`, `v`, `ex` (mind. 1 gültige Übung). Ist auch nur eine Übung oder Vokabel ungültig, übernimmt die App das **ganze Thema nicht** (bzw. behält die alte Version).
- IDs fortlaufend: `t09`, `t10`, … – nie umbenennen, nie löschen (sonst geht Fortschritt verloren).
- In bestehenden Themen Vokabeln und Übungen **nur hinten anhängen** (Karten-IDs hängen vom Index ab).
- `req` setzen: Das Thema wird frei, wenn alle Voraussetzungen zuletzt ≥ 80 % hatten.
- Pro Thema: kurze Theorie mit Tabellen, 8–15 Vokabeln, 10–14 Übungen; Grammatik immer auch als `tab`-Übung.
- Nur Wörter verwenden, die aus früheren Themen oder dem eigenen `v` bekannt sind.
- Finnisch muss korrekt sein; Vokalharmonie und Stufenwechsel prüfen.
- Nach dem Bearbeiten immer `node tools/pruefen.mjs` ausführen: prüft JSON, Pflichtfelder, Voraussetzungen, Nur-anhängen-Regel und löst jede Übung im Browser mit der Musterlösung (z. B. ob sich ein `ord`-Satz aus den Wörtern bilden lässt). Die GitHub Action macht dasselbe und veröffentlicht nur bei Erfolg.
