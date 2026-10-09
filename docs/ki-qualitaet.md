# KI-Qualität (Opettaja)

Claude wertet bei jedem Bericht das **KI-PROTOKOLL** aus und trägt hier nur eine **anonyme Zusammenfassung** ein – keine Antworten von Matthias, keine Fehlerlisten, keine privaten Details (Repository ist öffentlich).

Bewertet wird je Funktion: Wie oft lag die KI falsch (Richtiges als falsch gewertet / Falsches als richtig), waren Korrekturen und erzeugte Übungen fehlerfrei, passen die Wiederholungstermine? Dazu Token-Verbrauch und verwendete Modelle.

Ziel: entscheiden, welches Modell welche Aufgabe übernimmt (siehe Erinnerung in `docs/lehrplan.md`).

**Anbieterwechsel 9.10.2026:** Einträge bis 7.10. stammen von Gemini direkt (Free Tier). Ab 9.10. läuft alles über OpenRouter; Modelle je Zeile getrennt angeben, statt Gratis-Limit Kosten notieren.

| Datum | Anbieter / Modelle | Geprüft | Fehlurteile | Auffälligkeiten | Token/Monat (hochgerechnet) |
|---|---|---|---|---|---|
| 6.10.2026 | Gemini; fast nur flash-lite (eingestellt), vereinzelt flash / 3.5-flash | 57 Antworten (2 markiert) | Antwortprüfung: 2× zu großzügig (fehlendes Wort bzw. Tippfehler + falsche Vokalharmonie als richtig gewertet), 1× falsche Begründung; Wort nachschlagen: Verneinungsform als hän-Form erklärt (inzwischen lokal korrigiert); beide Markierungen inhaltlich richtig, nur Ton („Fast …“) bzw. Erklärung unscharf | Antworten oft mit „Fast richtig“ auch bei ganz falschen Wörtern; Rundenauswertung/Gesamtanalyse solide, kleine Ungenauigkeiten (Vokalwechsel bei Typ 1, „Doppelbuchstaben“ bei työ) | ~965k ein / ~275k aus – weit unter dem Gratis-Limit |
| 7.10.2026 | Gemini; weiter fast nur flash-lite (flash-latest je 1× bei Antwortprüfung/Gesamtanalyse) – Vergleich flash vs. lite noch nicht möglich | 81 Antworten (5 markiert) | Urteile richtig/falsch bei Antwort-, Vokabelprüfung und Rundenauswertung fast immer korrekt, aber **Begründungen oft falsch** (z. B. „kein Doppel-t bei te“, „Pronomen fehlt“, obwohl es im Satz steht). **Freies Schreiben unzuverlässig**: richtige Antwort als falsch gewertet, falsche Mustersätze, erfundener Stufenwechsel (3 Markierungen berechtigt). Frag Opettaja: Beispiel mit Stufenwechsel für „Stamm + n“ (Markierung berechtigt). 1 Markierung unberechtigt (Vokabelurteil war richtig) | Rollenspiel holprig (Einstieg ohne Bezug); an Funktionen-Chat gemeldet (F-1007-10). Kein Abschnitt „Schwächen nach Thema“ im Bericht | ~1237k ein / ~272k aus |
