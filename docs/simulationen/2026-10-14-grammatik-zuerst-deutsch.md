# Deutsch-Trainer: „Grammatik zuerst“, eingebaute Fehler, Schwächen-Kette (D-1014-37 … -39)

Gefahren im Chat „Deutsch-Trainer (Lehrinhalte)“. App unverändert: deutsch-trainer main c418740 (Engine ba9e2d5). Simulation auf diesem Branch (f49f1fb, e1dd652, 9c1e167). Gemini-Nachbau, kein OpenRouter. Simuliertes Lernmodell, keine echten Lernerdaten. Die vollständige Auswertung liegt privat.

## Umbau der Simulation
- `FOKUS=grammatik` (Lernmodell): fällige Grammatik-Wiederholungen und der neue Lernschritt zuerst; Vokabeln, Wortpaket-Wiederholungen und neue Pakete nur mit der restlichen Zeit. `WORTPAKETE=immer|selten|nie`.
- Freischalt-Runden bei FOKUS täglich, bis zu 3 Versuche am Tag.
- Gemini-Nachbau: einzelner kleiner Fehler (Groß-/Kleinschreibung, du/Sie) in einer Schreibaufgabe = „richtig mit Fehlerart“; falsche Lücke/Übersetzung bekommt eine Fehlerart.
- Fehlalarm behoben: E-1008-10 prüft „Kenne ich schon“-Karten (S-1014-21, gewollt 60 Tage) nicht mehr.

## Ergebnisse (365 Tage)
| | real, wie bisher | real, Grammatik zuerst | real, zuerst, Coach wie Gemini | regel, zuerst, Coach wie Gemini |
|---|---|---|---|---|
| Grammatikthemen gelernt | 6/18 | 10/18 | 9/18 | 18/18 |
| erstes Thema gelernt (Tag) | 159 | 15 | 16 | 7 |
| Übungszeit Grammatik / Wortpakete | 45 h / 45 h | 94 h / 2 h | 90 h / 4 h | 202 h / 10 h |
| Wdh mit Können ≥ 90 % / < 65 % | 3 % / 12 % | 10 % / 3 % | 11 % / 3 % | 34 % / 1 % |
| Reihenfolge verletzt / Fehler der App an Lerntagen | nie / 0 | nie / 0 | nie / 0 | nie / 0 |

## Schwächen-Kette
- Browser-Einzeltests (36 Fälle): 33 ✓ – Zuordnung (nur gelernte Themen, max. 3, Unterthemen getrennt, künftige/gesperrte verworfen), Fehlerarten (bekannt/„neu: …“), Vorziehen (2 Treffer in 14 Tagen → +2 Tage, max. 3 Plätze, Nachrücken, Runde räumt auf).
- Lücken: (1) gezielt nur je Übung/Thema, nicht je Teilregel – die schwache Teilregel kommt in der Wiederholung nur 1,3× so oft wie ihr Anteil; (2) schwache Themen (< 80 %) bekommen keine neuen KI-Übungen → Abnutzung (ab Monat 4 sind 75–93 % der Wiederholungsübungen ≥ 3× gesehen); (3) Fehler ohne eigenes Thema (Adjektivendungen) → Coach wie Gemini ordnet ein Nachbarthema zu → Fehlvorziehen (regel: d05 83×, d05b 82×); (4) Fehler-Training kommt bei wenig Zeit kaum dran (offene Fehler 60–99).
- Eingebaute Fehler: alle erkannt und im Bericht; haben/sein → d01b am Tag nach Beginn vorgezogen; Fehler zu gesperrten Themen ziehen nichts vor; neue Fehlerart erscheint als „neu: …“.

## Funktionslauf
Kein Absturz und kein Hänger (allein gefahren, Simulation 9c1e167; ein erster Start brach an Tag 290 nur wegen der 2-Stunden-Grenze ab). „Probleme: 213“ = 208× bekannte Speicher-Meldung (localStorage > 2,5 Mio. Zeichen ab etwa Tag 170, am Ende 3,0 Mio.; S-1012-104/D-1014-36: drei Sicherheitskopien so groß wie der Lernstand) + 5 weitere: Gesamtanalyse am Folgetag (Tag 27, bekannter Befund S-1012-105); Abdeckungslücken der Simulation (Aktionen prevocab, ownbulksave, ownbulkclear, knownword nicht erreicht; Szenario W11 und „Wörter vorab lernen“ ohne Gelegenheit; Regel E-1008-3 ohne passende Übung). Abgedeckt: 125/130 Aktionen, alle 18 Ansichten, 10 Übungsarten, 13 KI-Arten, 6 Einstellungen; alle 24 Themen erreicht und gelernt; Szenarien KI-Ausfall in der Freischalt-Runde, Schwächen-Vorzug und manipulierte lektionen.json ok. Der Fehlalarm zu „Kenne ich schon“ ist behoben (0×). Kein neuer App-Fehler.
