# Schiedsrunde (S-1009-1) – dritte, unabhängige Meinung

Zwei Agenten haben finnische Lernsätze einer App (deutschsprachiger Lerner, A1–A2, bewusst zuerst Schriftsprache) nach
den Klassen A–E bewertet (Definitionen: ../anleitung.md – zuerst lesen). In deiner Liste stehen alle Sätze, bei denen
**mindestens eine** Rolle D („so sagt es kein Finne“) oder E („falsch“) vergeben hat – teils einig, teils strittig.

Deine Aufgabe: **für jeden Eintrag ein eigenes, begründetes Endurteil**. Du bist nicht an die beiden gebunden – sei
genau so streng wie nötig, aber fair. Achte besonders auf:
- **Übertreibungen**: Ist es wirklich D, oder nur Schriftsprache (B) bzw. Lehrbuch-Vereinfachung (C)? Gibt es die
  beanstandete Wendung im echten Finnisch durchaus (z. B. in Zeitungen, Ratgebern, Lehrwerken, Foren)? Dann nicht D.
- **Falsche Behauptungen** der Agenten (falsche Regel, falscher Kasus in ihrer „Korrektur“, Fakten).
- **Kontext**: Den ganzen Dialog/Text findest du in ../texte/<tid>.txt (Zeile mit der ID suchen). Prüfe, ob die
  deutsche Vorgabe und die Situation den Satz rechtfertigen.
- **Fakten** (Wochentage, Preise, Stockwerke, Orte): nachrechnen bzw. nachsehen (z. B. `date -d 2026-09-02 +%A`).

Quellen: Kielitoimiston ohjepankki (https://www.kielitoimistonohjepankki.fi – Suche per `curl -sL "…/?s=WORT"`),
Uusi kielemme, en.wiktionary, Websuche. kielitoimistonsanakirja.fi (nur JavaScript), fi.wiktionary und Korp sind
nicht erreichbar – nicht versuchen. Websuche sparsam, nur bei echtem Zweifel.

## Ausgabe – nach je ca. 10 Einträgen sofort anhängen (`cat >> DATEI <<'EOF'`)
Je Eintrag genau eine Zeile:
`[Nr] tid id | Endklasse | Urteil zu R1/R2 (z. B. „R2 hat recht“, „beide übertreiben“) | Begründung kurz | natürlich geschrieben: … | gesprochen: … | Beleg/„kein Beleg“`
Für A/B/C reichen Begründung und „–“ in den Alternativ-Feldern. Bei E unbedingt die richtige Form.
Am Ende `## FERTIG` und 3–5 Sätze: Wie zuverlässig waren die beiden Rollen? Welche Fehlerarten sind echt?
Falls die Datei schon Einträge enthält (Neustart): mit dem nächsten fehlenden [Nr] weitermachen.

Regeln: Nichts im Repository ändern. Deutsch schreiben, Finnisch exakt. Schlussantwort: Anzahl je Endklasse und die
5 wichtigsten bestätigten D/E-Funde.
