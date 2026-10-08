# Lehrplan

## Grundlagen (im Code, `BASE_TOPICS`)
| ID | Thema | Stufe | Voraussetzung |
|---|---|---|---|
| t01 | Aussprache & Alphabet (Ääntäminen) | A1.1 | – |
| t02 | Begrüßungen & Höflichkeit (Tervehdykset) | A1.1 | t01 |
| t03 | Zahlen 0–20 (Numerot) | A1.1 | t01 |
| t04 | Ich bin – du bist: Pronomen + olla | A1.1 | t02 |
| t05 | Vokalharmonie, -ssa/-ssä | A1.1 | t01 |
| t06 | Verben Typ 1 im Präsens | A1.1 | t04, t05 |
| t07 | Verneinung (en, et, ei …) | A1.1 | t06 |
| t08 | Fragen stellen (-ko/-kö, Fragewörter) | A1.1 | t07 |


**Unterthemen (Liste; Original-Absatz im Archiv):**
- A1.1: 1.2 Alphabet & Buchstabieren · 2.2 Small Talk & gute Wünsche · 2.3 Reagieren, entschuldigen, nachfragen · 3.2 Zahlen im Alltag · 4.2 Herkunft, Beruf, Eigenschaften · 4.3 Gegensätze · 5.2 Mehr Orte & schwierige Wörter · 6.2 Sprachen & mehr Verben Typ 1 · 7.2 Verneinung genauer · 8.2 Alle Fragewörter · 8.3 Fragen & Antworten genauer · 8.4 Hier & dort, oder, wann, wie oft · 9.2 Uhrzeit genau · 9.3 Fahrplan · 10.2 Café genauer · 10.3 Typ 2 vollständig & höflich · 11.2 Verwandte & Haustiere · 11.3 Existenzsatz & Kinder · 12.2 Gewohnheiten (-sin) · 12.3 Stufenwechsel genauer · 12.4 Mein Tag
- A1.2: 13.2 Länder, Städte & Gebäude · 13.3 kotona/kotiin, -lla-Orte · 14.2 Lebensmittel & Verpackungen · 14.3 Kahvi on kuumaa / Osta leipä! · 15.2 kanssa, pitää + -sta, Genitiv · 15.3 pitää / on pakko / saa
- A1.3: 16.2 Postpositionen & Personen · 16.3 Menkää! Älkää! · 16.4 Pronomen in allen Fällen · 16.5 Verkehrsmittel · 17.2 Körper & Symptome · 17.3 minua väsyttää, Telefon · 17.4 Notfall & Apotheke · 18.2 Wetter & Feiertage · 18.3 am 5. Mai, Jahreszahlen · 18.4 Kleidung · 19.2 Vergangenheit aller Typen · 19.3 tiesin, verneinte Vergangenheit
- `req`: die Unterthemen zu t01–t08, 2.3, 7.2 und 8.4 sind Voraussetzung für t13; 9.2 für t11, 9.3 für t13; 13.2 → t15, 14.2 → t16, 13.3/14.3/15.2/15.3 → t17; 16.2 → t18, 17.2 → t19; alle übrigen (16.3–19.3, 4.3, 12.4, 16.5, 17.4, 18.4) für t20/t21 (Notiz in den Entwürfen). Jedes x.3 hat 2–3 Übungen zu gesprochenem Finnisch. A1 ist laut `abdeckung.md` vollständig.

Wenn t01–t08 sicher sitzen und die Analyse zustimmt, werden die KI-generierten „Neuen Übungen von Opettaja“ frei.

## Regeln für neue Themen (Kurzfassung; Originaltexte in `docs/archiv/lehrplan-verlauf.md`)
- **Prinzip:** wie im Sprachkurs – jedes Thema ist eine Alltagssituation mit nützlichen Sätzen und einem kurzen Dialog; die Grammatik kommt, wenn die Situation sie braucht. Feste Wendungen dürfen vorher als Baustein gelernt werden.
- **Stufen:** A1.1 → A1.2 → A1.3 → A2.1 → A2.2 (finnischer Rahmen, OPH/YKI). Reihenfolge so, dass jedes Thema auf bekannten Wörtern aufbaut; `req` = alle Themen, auf denen es aufbaut.
- **Unterthemen (F-1007-31):** x.1 Kern, x.2 Wortschatz & Festigen (+15–20 Wörter), x.3 Feinheiten (Zusatzgrammatik, Ausnahmen, gesprochen), bei Bedarf x.4/x.5. IDs `tNNb/c/d`, Titel mit „(N.2)“.
- **Freischaltung:** x.2 ist `req` für Thema x+2, x.3 für das erste Thema der nächsten Stufe. Nie `req` an Themen hängen, die schon frei sind (die App sperrt sie nicht wieder, aber es verwirrt).
- **Umfang:** Hauptthema 20–25 Wörter (F-1007-2), mindestens 15 Übungen (F-1007-35) mit je 2 `les`/`dlg`/`sch` in verschiedenen Situationen, 2–4 Regelfragen, Grammatik auch als `tab`; Kasten „So sagt man’s gesprochen“; x.3 mit 2–3 „Gesprochen“-Übungen (F-1007-36).
- **Bei jedem Bericht (F-1007-15):** jedes gelernte Thema bekommt mindestens 2 neue Übungen, schwache Themen mehr.
- **Keine doppelten Karten (F-1008-3):** Wird ein Wort vor seinem Karten-Thema gebraucht, steht es im früheren Thema nur in der Theorie.
- **Abdeckung:** vor neuen Themen gegen `lektionen/abdeckung.md` prüfen (Master „Baustein → Thema“); Detailentwürfe in `lektionen/entwuerfe-bis-b1.md`.
- Kein Sprechtraining (Matthias übt mit einer finnischen Freundin) – Dialoge sind Lese- und Hörtexte.

## Wo steht Matthias
- Letzter Bericht 7.10.2026: t01–t08 ≥ 88 %, arbeitet bei etwa t09–t12.
- In der App: 58 Themen – t01–t19 und 39 Unterthemen (Liste in `lektionen/abdeckung.md`). A1 vollständig, A2 geplant.
- Verlauf aller Änderungen: `docs/entscheidungen.md`, älterer Lehrplan-Stand: `docs/archiv/lehrplan-verlauf.md`.

## Offene Erinnerung für Claude: KI-Anbieter (Gemini → teilweise Claude API)
Matthias möchte erinnert werden, sobald es sich lohnt (Entscheidung Oktober 2026: erst in ein paar Wochen).
- **Wann erinnern:** bei der Auswertung eines Berichts, sobald eines zutrifft: die Grundlagen t01–t08 sind fast sicher (KI-Übungen stehen kurz vor der Freischaltung), oder es kommen komplexere Themen dran (ab Partitiv/Ortsfälle/Stufenwechsel, ca. t12–t15), oder der Bericht zeigt Fehlurteile der KI bei der Antwortprüfung.
- **Grundlage:** die Auswertungen in `docs/ki-qualitaet.md` (KI-Protokoll aus den Berichten).
- **Was vorschlagen:** Mischbetrieb – Antwortprüfung, Gesamtanalyse und neue KI-Übungen über die Claude API (Empfehlung Claude Sonnet 5.5, ca. 2–4 $/Monat, Ausgabenlimit in der Anthropic Console setzen); Wörter nachschlagen, Vokabelprüfung und „Frag Opettaja“ bleiben bei Gemini (gratis). Schlüssel bleibt nur auf dem Gerät.
- Vor der Umsetzung Plan erklären und Bestätigung abwarten (Regel 12 in CLAUDE.md).
- **Stand 7.10.2026:** Zeitpunkt erreicht (Fehlurteile im freien Schreiben, Begründungsfehler). Matthias: **vorgemerkt (F-1007-11)** – erneut ansprechen, wenn mehr Daten vorliegen (v. a. ob flash-latest besser urteilt als flash-lite, nach den Verbesserungen aus F-1007-10).

## Offene Erinnerung für Claude: Gemini-Kontingent schonen
- **Wann ansprechen:** sobald das KI-Protokoll im Bericht zeigt, dass die größeren Gemini-Modelle ihr Limit erreichen (`quota-day`/`quota-min` oder häufig Lite-Modelle als Ausweiche).
- **Was vorschlagen:** einfache Aufgaben (Wort nachschlagen, Vokabelprüfung, evtl. Rundenauswertung) zuerst mit dem kleinsten Modell, qualitätskritische (Antwortprüfung, KI-Übungen) mit den größeren. Details: `docs/architektur.md`, „Token-Verbrauch: Einsparpotenzial“, Punkt 7.

## Offene Erinnerung für Claude: „Schwächen nach Thema“ prüfen (seit 7.10.2026)
Die KI ordnet Fehler in Schreibaufgabe, Dialog, freiem Schreiben und Rollenspiel gelernten Themen zu (Bericht: „SCHWÄCHEN NACH THEMA“, KI-Protokoll: „| Themen: …“).
- **Bei jedem Bericht:** Zuordnung prüfen (richtiges Thema, kein unbeteiligtes – z. B. Verneinung = t07, nicht t05) und anonym in `docs/ki-qualitaet.md` festhalten. Themen mit vielen Treffern gezielt mit zusätzlichen Übungen/Varianten versorgen (E-1007-9).
- **Nach ca. 3 Berichten mit diesem Abschnitt:** Matthias eine Empfehlung zu **E-1007-8** geben (schwache Themen automatisch früher wiederholen: spätestens übermorgen fällig, Karte auf „Heute“, verschwindet nach ≥ 80 %). Nur empfehlen, wenn die Zuordnung zuverlässig ist; umsetzen würde der Funktionen-Chat.
- Zähler Berichte mit diesem Abschnitt: 0
