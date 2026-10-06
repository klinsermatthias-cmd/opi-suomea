# KI-Qualität (Opettaja)

Claude wertet bei jedem Bericht das **KI-PROTOKOLL** aus und trägt hier nur eine **anonyme Zusammenfassung** ein – keine Antworten von Matthias, keine Fehlerlisten, keine privaten Details (Repository ist öffentlich).

Bewertet wird je Funktion: Wie oft lag die KI falsch (Richtiges als falsch gewertet / Falsches als richtig), waren Korrekturen und erzeugte Übungen fehlerfrei, passen die Wiederholungstermine? Dazu Token-Verbrauch und verwendete Modelle.

Ziel: entscheiden, welche Aufgaben bei Gemini bleiben und welche zur Claude API wechseln (siehe Erinnerung in `docs/lehrplan.md`).

| Datum | Anbieter / Modelle | Geprüft | Fehlurteile | Auffälligkeiten | Token/Monat (hochgerechnet) |
|---|---|---|---|---|---|
| 6.10.2026 | Gemini; fast nur flash-lite (eingestellt), vereinzelt flash / 3.5-flash | 57 Antworten (2 markiert) | Antwortprüfung: 2× zu großzügig (fehlendes Wort bzw. Tippfehler + falsche Vokalharmonie als richtig gewertet), 1× falsche Begründung; Wort nachschlagen: Verneinungsform als hän-Form erklärt (inzwischen lokal korrigiert); beide Markierungen inhaltlich richtig, nur Ton („Fast …“) bzw. Erklärung unscharf | Antworten oft mit „Fast richtig“ auch bei ganz falschen Wörtern; Rundenauswertung/Gesamtanalyse solide, kleine Ungenauigkeiten (Vokalwechsel bei Typ 1, „Doppelbuchstaben“ bei työ) | ~965k ein / ~275k aus – weit unter dem Gratis-Limit |
