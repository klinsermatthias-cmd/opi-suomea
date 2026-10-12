# Prüfung des Einstufungstests und der Abdeckung (S-1011-15) – Anleitung für die Prüfer

Zuerst `anleitung.md` (gleicher Ordner) lesen: Hintergrund, Quellen, Kategorien, Zeilenformat, Vertraulichkeit gelten
weiter. Hier nur, was neu ist.

## Auftrag von Matthias (12.10.2026)
„S-1011-15: Den Einstufungstest selbst prüfen (Aufgaben, Musterlösungen, Bewertung, Niveau-Einstufung) – checken, ob
alle Problem-Themen abgedeckt sind mit ausreichenden Unterthemen.“

## Dateien (nur lesen)
- Test aufbereitet: `texte/einstufungstest.txt` (169 Aufgaben; je Zeile `<Abschnitt>.<Nr>` + JSON des Originals:
  `k` Art, `t` Aufgabe, `s` akzeptierte Lösungen – `a|b` = Alternativen, mehrere Einträge = mehrere Lücken bzw.
  Varianten; weitere Felder je nach Art). Original: `/home/user/klinsermatthias-cmd/deutsch-trainer/js/inhalte.js`
  ab `const PT = [`. Aufgaben-IDs (z. B. `A3.2`) sind fest und dürfen nie geändert werden.
- Prüfung und Bewertung im Code: `…/deutsch-trainer/js/einstufung.js` (Engine-Datei, gilt für beide Apps):
  `gapOk`, `sentOk`, `normGap`, `normSent`, `localGrade`, `ptCheckSection`, `ptAIGrade`, `ptAIWriting`, `ptStats`,
  `ptFinish`, `ptReport` – wie wird lokal geprüft, wann urteilt die KI, wie wird gezählt und eingestuft?
- Testergebnis (vertraulich, nur allgemein zitieren): Pfad in `anleitung.md`.
- Bereinigter Themenplan: `schied/plan.md` (Abschnitt „Bereinigter Plan“); Endurteile zu d01–d03: `schied/d0*.md`.
- ÖIF-Einstufungsmatrizen A1–B2 und Rahmencurricula (Pfad in `anleitung.md`).

## Zusätzliche Kategorien
| Kürzel | Bedeutung |
|---|---|
| LÖSUNG | Musterlösung falsch oder unvollständig (richtige Antwort fehlt in `s`, falsche wird akzeptiert) |
| NIVEAU | Aufgabe misst nicht das angegebene/vermutete Niveau oder den angegebenen Bereich |
| BEWERTUNG | Prüf- oder Zähllogik wertet falsch (Normalisierung, KI-Urteil, Punktzahl, Einstufungsregel) |
| ABDECKUNG | Testschwäche bzw. Teilregel hat im Plan kein Thema oder kein ausreichendes Unterthema |

Zeilenformat wie gehabt, Ort = Aufgaben-ID (`- A8.3 | LÖSUNG | mittel | … | … | Quelle`) bzw. Funktion
(`- einstufung.js gapOk | BEWERTUNG | …`) bzw. Teilregel (`- Abdeckung: Possessivpronomen allein | ABDECKUNG | …`).
Nach jedem Abschnitt sofort anhängen; Neustart: `grep '^## ' DATEI`, beim nächsten fehlenden Abschnitt weiter.
Nichts im Repository ändern außer der eigenen Ausgabedatei, keine Commits.
