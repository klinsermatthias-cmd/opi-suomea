# Schiedsrunde Deutsch-Trainer-Inhalte (S-1011-8) – dritte, unabhängige Meinung

Zwei Prüfer haben je Thema unabhängig gearbeitet: **K** (Korrektheit, jede Zeile) und **V** (Vollständigkeit, Didaktik,
Gesamtbild, Unterthemen); **P** hat den Themenplan geprüft. Ihre Funde stehen nummeriert in `schied/eingang-<x>.md`.
Hintergrund, Kategorien und Quellen: `anleitung.md` (zuerst ganz lesen, inkl. Zusatzauftrag 1–3).

Deine Aufgabe: **für jeden Fund ein eigenes, begründetes Endurteil.** Du bist an K/V/P nicht gebunden – so streng wie
nötig, aber fair. Achte besonders auf:
- **Falsche Behauptungen** der Prüfer: falsche Regel, falsche „Korrektur“, Wort steht doch in `v`/Theorie, Übung gibt
  es so nicht. Immer im Thementext (`texte/<id>.txt`) bzw. Original nachsehen.
- **Übertreibungen**: Ist es wirklich falsch/fehlend, oder nur eine Geschmacksfrage? Ist die Schwere angemessen?
- **Belege**: Zweifelhafte Sprachfragen selbst nachschlagen (duden.de, dwds.de, grammis mit Playwright, wiktionary roh
  höchstens 1 Abruf alle 3 s – bei 429 weglassen, ostarrichi.org, ÖIF-Texte laut Anleitung).
- **Doppelte**: K und V melden teils dasselbe – den späteren als `DOPPELT→[Nr]` markieren.
- **Österreich**: österreichisches Standarddeutsch ist das Ziel (z. B. ist gesessen/gestanden/gelegen, Jänner, Paradeiser).

**Fakten zur App (vom Simulations-Chat im Engine-Code geprüft):**
- `ord` (Satz ordnen) und `tab` (Tabelle) werden **nur lokal** gegen die hinterlegten Lösungen geprüft, **ohne KI**
  (`js/formate.js` Z. 459: kein Richter; `checkTable` → `tabMark`). Eine fehlende richtige Variante wird dort immer als
  falsch gewertet → echter Fund.
- `gap`, `tr`, `sch`, `dlg`: zuerst lokal gegen `a`, passt nichts, urteilt die KI (falls Schlüssel gesetzt und erreichbar).
  Fehlende Varianten sind dort meist **niedrig**, außer die Variante ist naheliegend und häufig.
- `mc` und `les`: feste Auswahl, keine KI.
- Bestehende Themen-IDs, Karten und Übungen bleiben (nur anhängen); Korrekturen an bestehenden Übungen sind erlaubt
  (Text, Lösung, Hinweis), Löschen/Umsortieren nicht.

## Ausgabe – nach je ca. 10 Einträgen sofort anhängen (`cat >> DATEI <<'EOF'`)
Je Fund genau eine Zeile:
`[Nr] <Ort> | <Urteil> | <Kategorie> | <Schwere> | Begründung kurz | Korrektur exakt (oder –) | Beleg (URL) / ohne Quelle`
Urteile: **BESTÄTIGT** · **ABGESCHWÄCHT** (echt, aber geringere Schwere) · **VERSCHÄRFT** · **TEILWEISE** (Teil richtig,
Teil falsch – kurz welcher) · **ÜBERTRIEBEN** (kein echtes Problem) · **FALSCH** (Behauptung stimmt nicht) ·
**DOPPELT→[Nr]**.
Danach `## Eigene Funde` (nur, was beide übersehen haben und wichtig ist, gleiches Zeilenformat mit `[E1]`, `[E2]` …)
und `## FERTIG` mit 5–10 Sätzen: Wie zuverlässig waren K und V (bzw. P)? Was sind die 5–10 wichtigsten bestätigten
Punkte? Falls die Datei schon Einträge enthält (Neustart): mit der nächsten fehlenden [Nr] weitermachen.

## Regeln
Nichts im Repository ändern außer deiner Ausgabedatei, keine Commits. Deutsch schreiben, deutsche Beispiele exakt.
Testergebnis vertraulich (nur „Testschwäche: …“). Schlussantwort: Anzahl je Urteil und Schwere, die 5 wichtigsten
bestätigten Funde.
