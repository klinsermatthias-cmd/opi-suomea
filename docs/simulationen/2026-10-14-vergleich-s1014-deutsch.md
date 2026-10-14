# Deutsch-Trainer: Vergleich vor/nach S-1014-7 … -14, -17, -20 (Auftrag S-1014-19)

Gefahren im Chat „Deutsch-Trainer (Lehrinhalte)“. App-Stand: deutsch-trainer main 503b6bb mit Engine 8c674ff. Vergleichslauf: e118025 (vor den Änderungen). Gemini-Mock, kein OpenRouter. Simuliertes Lernmodell (Profil „real“, Seed 1), keine echten Lernerdaten. Die vollständige Auswertung liegt privat.

## Punkte 1–10
| # | Messgröße | vorher | nachher | nachher, Coach „wie Gemini“ |
|---|---|---|---|---|
| 1 | Themen gelernt nach 1 Jahr | 11 Grammatik | 6 Grammatik + 6 Wortpakete | 5 Grammatik + 6 Wortpakete |
| 2 | Lernzeit je Thema (gleiche 6 Themen) | Median 5,6 h | Median 5,3 h | ≈ 5,4 h |
| 3 | Schritt-Runden < 80 % | 67 % | 68 % | 72 % |
| 4 | Abstände am Jahresende | bis 365 Tage | höchstens 60 | höchstens 60 |
| 5 | Langzeit-Checks | 0 | 11 | 10 |
| 6 | Wortpakete / Wörter | 1 Paket nie fertig, 102 Wörter | 6 Pakete, 198 Wörter | 6 Pakete, 198 Wörter |
| 7 | Vorziehen | (anderes Profil) | 1–2×, kein Fehlvorziehen | 1× |
| 8 | „im Lernschritt nicht gewertet“ im Bericht | – | 0 (nicht prüfbar, s. F3) | 0 |
| 9 | Belastung Ø min/Lerntag (Budget 20) | 34, 88× ausgelassen | 33, 172× ausgelassen | 32, 154× |
| 10 | Probleme der Simulation | 0 | 0 | 0 |

## Befunde
- **F1 (hoch):** Fällige Wortpaket-Wiederholungen werden vor „Neu d…“ gespielt und verbrauchen das Zeitbudget. Übungszeit für Grammatik-Lernschritte sinkt von 56 h auf 26 h, die Wortpakete brauchen 48 h. Das erste Grammatikthema ist erst an Tag 155 gelernt (vorher Tag 20).
- **F2 (mittel):** Der Langzeit-Check wählt frisch übernommene Wortpakete, z. B. am Tag nach der Übernahme. Ursache: `wordPackTake` (`js/lernen.js`) legt keinen `hist`-Eintrag an, deshalb liefert `lastPracticed` 0.
- **F3 (Simulation):** S-1014-20 lässt sich mit dem Mock nicht prüfen, weil der Mock bei „richtig“ nie Fehlerarten liefert. Satz-Fehlerarten kommen ebenfalls nie vor (in allen Berichten „Sätze 0“).
- **F4:** Die Schutzwirkung von S-1014-11 beim Vorziehen ist nicht gemessen; dafür wäre ein Zusatzlauf mit Profil „regel“ nötig.
- **F5:** Die Fehlerzuordnung trifft nur noch passende Themen (z. B. haben/sein 17× statt 48×, solange das Thema gesperrt ist). Adjektivendungen bleiben der häufigste Fehler ohne eigenes Thema.
- **F6:** Die Wiederholungsabstände sind jetzt eher knapp als zu lang. Runden mit ≥ 90 %: 0 % (vorher 7 %), < 65 %: 8 % (vorher 1 %).
- **F7:** Funktionslauf über 365 Tage: kein Hänger, keine Fehlermeldung, kein Datenverlust. „Probleme: 195“ = 193× „localStorage > 2,5 Mio. Zeichen“ (ab Tag 172, am Ende 3,0 Mio.; bekannter Befund S-1012-104, jetzt auch im Deutsch-Trainer: drei Sicherheitskopien so groß wie der Lernstand) und 2 Abdeckungsmeldungen (Aktionen ownbulksave/ownbulkclear nie erreicht; Regel E-1008-3 ohne passende Übung). Abdeckung sonst vollständig (124/127 Aktionen, alle Ansichten, Übungsarten, KI-Arten, Einstellungen). Ein erster Start mit drei parallelen Läufen hing an Tag 6; allein lief er durch.
