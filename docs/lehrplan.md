# Lehrplan

## Grundlagen (im Code, `BASE_TOPICS`)
| ID | Thema | Niveau | Voraussetzung |
|---|---|---|---|
| t01 | Aussprache & Alphabet (Ääntäminen) | A0 | – |
| t02 | Begrüßungen & Höflichkeit (Tervehdykset) | A0 | t01 |
| t03 | Zahlen 0–20 (Numerot) | A0 | t01 |
| t04 | Ich bin – du bist: Pronomen + olla | A0 | t02 |
| t05 | Vokalharmonie, -ssa/-ssä | A0 | t01 |
| t06 | Verben Typ 1 im Präsens | A0+ | t04, t05 |
| t07 | Verneinung (en, et, ei …) | A0+ | t06 |
| t08 | Fragen stellen (-ko/-kö, Fragewörter) | A0+ | t07 |

Wenn t01–t08 sicher sitzen und die Analyse zustimmt, werden die KI-generierten „Neuen Übungen von Opettaja“ frei.

## Nächste Themen (Vorschlag, je nach Bericht anpassen)
Reihenfolge so, dass jedes Thema auf bekannten Wörtern aufbaut. Jeweils mit Tabellen-Übungen.
1. **t09 Zahlen ab 20, Uhrzeit, Wochentage**
2. **t10 Verben Typ 2** (syödä, juoda, tehdä …) – ab hier kurze **Lesetexte** einbauen (Wunsch von Matthias)
3. **t11 Besitz: minulla on** (Adessiv-Grundlage, „ich habe“)
4. **t12 Innere Ortsfälle**: -ssa (wo), -sta (woher), -Vn (wohin)
5. **t13 Partitiv – Grundlagen** (Mengen, Sprachen nach puhua, Verneinung)
6. **t14 Verben Typ 3** (tulla, mennä, olla-Ausnahmen)
7. **t15 Konsonantenstufenwechsel – Grundlagen** (kk→k, pp→p, tt→t)
8. **t16 Äußere Ortsfälle**: -lla, -lta, -lle
9. **t17 Genitiv & Besitz** (minun, sinun …)
10. **t18 Verben Typ 4–6**, danach Imperfekt

## Stand
- Oktober 2026: App mit t01–t08 live, Matthias lernt seit Anfang Oktober 2026.
- Neue Themen hier eintragen, sobald sie in `lektionen/lektionen.json` liegen.

## Offene Erinnerung für Claude: KI-Anbieter (Gemini → teilweise Claude API)
Matthias möchte erinnert werden, sobald es sich lohnt (Entscheidung Oktober 2026: erst in ein paar Wochen).
- **Wann erinnern:** bei der Auswertung eines Berichts, sobald eines zutrifft: die Grundlagen t01–t08 sind fast sicher (KI-Übungen stehen kurz vor der Freischaltung), oder es kommen komplexere Themen dran (ab Partitiv/Ortsfälle/Stufenwechsel, ca. t12–t15), oder der Bericht zeigt Fehlurteile der KI bei der Antwortprüfung.
- **Was vorschlagen:** Mischbetrieb – Antwortprüfung, Gesamtanalyse und neue KI-Übungen über die Claude API (Empfehlung Claude Sonnet 5.5, ca. 2–4 $/Monat, Ausgabenlimit in der Anthropic Console setzen); Wörter nachschlagen, Vokabelprüfung und „Frag Opettaja“ bleiben bei Gemini (gratis). Schlüssel bleibt nur auf dem Gerät.
- Vor der Umsetzung Plan erklären und Bestätigung abwarten (Regel 12 in CLAUDE.md).
