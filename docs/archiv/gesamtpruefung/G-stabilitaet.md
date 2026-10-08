# G – Stabilität & Tests

Geprüft (Engine-Chat, 8.10.2026): `tools/pruefen.mjs` vollständig in einer Kopie ausgeführt (**„Alles in Ordnung“, 49 Prüfungen,
32 s**), `sw.js` vollständig, Start/Fehlerbehandlung/Versionshinweis in `js/start.js`, Workflows beider Repos, Stand der Engine im
Deutsch-Trainer (aktuell bis auf eine Doku-Zeile), `tools/simulation.mjs` nur gelesen (Ausnahmen, Inhalte).

## G1 – Testlücken zu den Befunden dieser Prüfung
- **Schwere:** niedrig (die vorhandene Prüfung ist sehr breit; es fehlen gezielte Fälle)
- **Problem:** Keiner der in dieser Prüfung gefundenen Fehler wäre von `pruefen.mjs` erkannt worden. Fehlende Fälle:

| Fall | heute getestet? | Risiko |
|---|---|---|
| Gesperrtes Thema über „Wörter vorab lernen“ (C1) | nein | mittel |
| KI fällt während einer Runde aus → Wertung (E1) | nein | mittel |
| „Heute“, wenn eine Voraussetzung < 80 % alles blockiert (C2) | nein | mittel |
| Deutsch als Lernsprache: Antwortprüfung, Antippen, Groß-/Kleinschreibung (H2, D2, D3) | nein | mittel |
| Speicher voll / Größe des Stands (A1) | nein | mittel |
| Schadcode in Lektionspaket/Sicherung (B1) | nein | niedrig |
| doppelte Funktionsnamen über Dateien (H4) | nein | niedrig |
| Zeitumstellung / Lernen über Mitternacht | nein (nur im Code berücksichtigt) | niedrig |

- **Vorschlag:** Zu jedem behobenen Befund einen Fall in `pruefen.mjs` (wie bisher üblich).
- **Aufwand:** klein je Fall
- **Apps:** beide

## G2 – Beim Start laufen Cloud-Abgleich und Laden der Lektionen gleichzeitig
- **Schwere:** niedrig
- **Wo:** `js/start.js:588–592` (`startupPull()` und `loadRepoLessons()` ohne Reihenfolge)
- **Problem:** Übernimmt der Abgleich einen Cloud-Stand, nachdem die neuen Lektionen schon in den alten Stand geschrieben wurden,
  fehlen die neuen Themen bis zum nächsten Start (danach wieder da). Kein Datenverlust, nur kurz verwirrend („Neue Themen geladen“ –
  aber nicht zu sehen). Entfällt mit A1 (Lektionen nicht mehr im Stand).
- **Aufwand:** klein (oder mit A1 erledigt)
- **Apps:** beide

## Vor E-1007-88 (Simulation mit allen Unterthemen) ergänzen
1. Abdeckung auch für **Themen**: am Ende melden, wie viele der 52 Themen (inkl. Unterthemen bis t19c) erreicht und gelernt wurden.
2. Szenarien zu den neuen Befunden: drei Freischaltversuche < 80 % → „Wörter vorab lernen“ → „Weiter zu den Übungen“ (C1);
   KI-Ausfall mitten in einer Freischalt-Runde (E1); Voraussetzung bei 75 % mit langem Abstand (C2).
3. Größe des Stands je Tag protokollieren (JSON-Länge, belegter Browser-Speicher) – zeigt A1 über 180 Tage.
4. Sobald der Deutsch-Trainer Lektionen hat: Lauf mit `APP_ROOT=../deutsch-trainer` (deutsche Sprachregeln, H2).

## Gut gelöst
- `pruefen.mjs` deckt sehr viel ab: alle 52 Themen mit Musterlösungen, Sync mit zwei Geräten (auch Konflikte, Ausweichweg,
  Schließen bei großem Stand, hängende Cloud), zwei Tabs, kaputte Daten, Rettungsansicht, Löschen/Wiederherstellen, Notfall-Version offline.
- Service Worker: Netz zuerst, nach 6 s die gespeicherte Kopie; Dateien je Version vollständig im Cache; bei 404/5xx die Kopie;
  Skripte bekommen nie die HTML-Seite als Ersatz; eigener Cache je App; fremde Adressen (Supabase, Gemini) werden nicht angefasst.
- Startfehler führen zur Rettungsansicht (Rohdaten ohne Schlüssel), gemischte alte/neue Dateien lösen einmal ein Neuladen aus.
- Veröffentlichung nur nach grüner Prüfung; Versionsnummer in allen Skript-Adressen.
