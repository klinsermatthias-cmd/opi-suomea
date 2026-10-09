# Prüfliste für Lerninhalte (F-1009-10)

Pflichtlektüre, bevor neue Themen, Übungen oder Korrekturen entstehen. Vor jedem Push jeden Punkt prüfen und Matthias melden: „Prüfliste: alle N Punkte geprüft“ (+ Auffälligkeiten).
**Jede Meldung von Matthias und jede Optimierung → neue Zeile hier** (Wunsch von Matthias, 9.10.2026) und den vorhandenen Bestand auf denselben Fehler prüfen.

| Nr | Prüfen | Beispiel | Herkunft |
|---|---|---|---|
| 1 | **Richtiges, natürliches Finnisch:** Grammatik, Rechtschreibung und Wortwahl kritisch prüfen und bei jeder Form, bei der du nicht ganz sicher bist, mit Quellen gegenprüfen (unten). Klingt der Satz so, wie ein Finne ihn schreiben würde? Schriftsprache; Umgangssprache nur als Hinweis. | Dialoge: Würde eine Finnin das im Café wirklich so sagen? Keine steifen Sätze nur aus Lernwörtern | Matthias 9.10.2026, F-1008-15 |
| 2 | **Lücken eindeutig:** `h` sagt, *was* gesucht ist (Bedeutung, Person, Zeit, Fall), aber kein Bau-Rezept („Wort + Endung“). Die KI akzeptiert nur die Form der Musterlösung (E-1009-12/-14). | `kirjasto___` – „in der Bibliothek“, nicht „kirjasto + -ssa“ | F-1009-6, F-1009-8 |
| 3 | **Alle richtigen Antworten in `a`:** jede gleichwertige Form bzw. Wortwahl (Lücke, Übersetzung, Dialogzeile), sonst wird sie als falsch gewertet. | `täytyy` und `pitää`; `saapuu` und `tulee` | F-1009-4, F-1009-8 |
| 4 | **Hinweis bei unklarem Format:** nur die Endung / ein Wort / Wort + Endung / was jede Tabellenspalte bedeutet. | „nur die Endung eintippen“ | CLAUDE.md Nr. 15 |
| 5 | **Nichts Ungelerntes abfragen:** jedes Wort und jede Form in Übungen ist gelernt oder steht in der Theorie des Themas (Wortprüfung in `pruefen.mjs` beachten). | Kasten „Wörter, die du hier schon brauchst“ | F-1008-5, F-1009-1 |
| 6 | **Keine doppelten Karten:** vor dem Anhängen gegen alle `v` prüfen (ohne Satzzeichen); Vorgriffe nur in die Theorie. | – | F-1008-3 |
| 7 | **Länge richtig:** Vokal- und Konsonantenlänge in Musterlösungen, Tabellen und Theorie doppelt prüfen (Matthias' häufigster Fehler – Vorbilder müssen stimmen). | *tuli / tuuli*, *kuka / kukka* | Bericht 9.10.2026 |
| 8 | **Theorie-Tabellen schmal:** höchstens 3 Spalten, kurze Zellen, keine sehr langen Einzelwörter (390 px, GitHub rendert breiter). | – | F-1008-1 |
| 9 | **Regelfragen:** jedes Grammatikthema 2–4 Multiple-Choice-Regelfragen mit Erklärung in `x`. | – | CLAUDE.md Nr. 16 |

## Quellen zum Gegenprüfen (getestet 9.10.2026, 2. Test)
| Quelle | Wofür | Zugriff aus der Cloud |
|---|---|---|
| Kielitoimiston sanakirja (www.kielitoimistonsanakirja.fi/#/<wort>) | Bedeutung, Schreibung, Beugungstyp | ✓ nur mit Browser (Playwright, `/opt/node-tools/node_modules/playwright`), curl liefert nur das Gerüst |
| Wiktionary (en/fi.wiktionary.org, Rohtext: `index.php?title=<wort>&action=raw`) | Beugungstabellen | ✓ curl |
| Uusi kielemme (uusikielemme.fi) | Erklärungen für Lernende, Umgangssprache | ✓ curl |
| Kotus / Kielikello (kotus.fi, kielikello.fi) | Zweifelsfälle, Sprachberatung | ✓ curl |
| Yle Kielikoulu (kielikoulu.yle.fi) | Lernmaterial | ✗ leitet auf yle.fi weiter, das nicht freigegeben ist (bei Bedarf yle.fi freigeben) |
| Iso suomen kielioppi (kaino.kotus.fi/visk) | Grammatik | ✗ Bot-Schutz der Seite (Cloudflare), auch im Browser – nicht nutzbar |

Ist eine Quelle nicht erreichbar, das im Bericht an Matthias sagen und nicht so tun, als wäre geprüft worden.
