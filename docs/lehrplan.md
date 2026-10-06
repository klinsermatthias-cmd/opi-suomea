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
**Prinzip (Wunsch von Matthias, Okt. 2026):** wie in einem Sprachkurs – jedes Thema ist eine **Alltagssituation** mit nützlichen Sätzen und einem kurzen Dialog als Lesetext, und die **Grammatik kommt genau dann, wenn die Situation sie braucht**. Häufige feste Wendungen dürfen schon vorher als „Baustein“ gelernt werden (z. B. *kahvia, kiitos* vor dem Partitiv), die Regel folgt später.
Reihenfolge so, dass jedes Thema auf bekannten Wörtern aufbaut; Grammatik immer auch als `tab`-Übung; `req` = alle Themen, auf denen es aufbaut.

| ID | Alltagssituation | Grammatik-Baustein | Voraussetzungen (Vorschlag) |
|---|---|---|---|
| t09 | **Uhrzeit, Tage & Termine** (Wann? Wie spät ist es? Treffen vereinbaren) | Zahlen ab 20, Uhrzeit, Wochentage (+ *-na*: maanantaina) | t03, t08 |
| t10 | **Im Café** (bestellen, bezahlen, „Was kostet …?“) – ab hier **Lesetexte als Dialoge** | Verben Typ 2 (syödä, juoda); *haluaisin*; *kahvia/teetä* als Baustein | t06, t07, t08, t09 |
| t11 | **Familie & sich vorstellen** (Geschwister, Kinder, Haustiere) | Besitz: *minulla on* / *minulla ei ole* (Adessiv-Grundlage) | t04, t07, t10 |
| t12 | **Wohnen & in der Stadt** (Wo wohnst du? Woher kommst du? Wohin gehst du?) | Innere Ortsfälle -ssa / -sta / -Vn | t05, t06, t11 |
| t13 | **Einkaufen im Supermarkt** (Mengen, Preise, „ein Kilo Äpfel“) | Partitiv – Grundlagen (nach Zahlen, Mengen, Verneinung) | t09, t10, t12 |
| t14 | **Tagesablauf & Freizeit** (aufstehen, zur Arbeit, Hobbys) | Verben Typ 3 (tulla, mennä, opiskella) + Uhrzeiten wiederholen | t09, t12, t13 |
| t15 | **Unterwegs: Bus, Zug, Weg fragen** (Haltestelle, Bahnhof, rechts/links) | Äußere Ortsfälle -lla / -lta / -lle | t12, t14 |
| t16 | **Im Restaurant & Essen** (Speisekarte, Vorlieben, Allergien) | Konsonantenstufenwechsel – Grundlagen (kk→k, pp→p, tt→t; pöytä → pöydässä) | t13, t15 |
| t17 | **Beim Arzt & Befinden** (Körper, Schmerzen, Termin) | Genitiv & Besitz (minun, sinun …; *minun pääni*), *minulla on kuumetta* | t11, t13, t16 |
| t18 | **Wetter, Jahreszeiten & Smalltalk** (*Onpa kaunis ilma!*) | Verben Typ 4–6 (Grundlagen) | t14, t16 |
| t19 | **Was hast du gestern gemacht?** (Wochenende, Urlaub erzählen) | Imperfekt (Vergangenheit) | t14, t18 |

Spätere Situationen (Auswahl): Arbeit & Kollegen, Telefon & Nachrichten, Behörden/Formulare, Feste & finnische Kultur (Sauna, Juhannus), Wohnungssuche.
Kein Sprechtraining (Matthias übt Sprechen mit einer finnischen Freundin) – Dialoge dienen als Lese- und Hörtexte und als Vorlage für Gespräche.

## Stand
- Oktober 2026: App mit t01–t08 live, Matthias lernt seit Anfang Oktober 2026.
- Neue Themen hier eintragen, sobald sie in `lektionen/lektionen.json` liegen.
- 6.10.2026: t01–t08 durchgearbeitet (t08 noch 71 %, t03 91 %). **t09 Uhrzeit, Tage & Termine** und **t10 Im Café (Verben Typ 2, Bestellen, Partitiv als Baustein)** in `lektionen/lektionen.json`. Schwache Verben aus t06 (kysyä, maksaa, istua, sanoa, katsoa, ostaa) in neuen Themen gezielt wiederverwenden; -ko-Fragen in t09 wiederholt.
- 6.10.2026: An t09 angehängt: Lesedialog „Milloin nähdään?“ (`les`) und Dialog „Ein Treffen ausmachen“ (`dlg`). An t10 angehängt: Lesedialog „Kahvilassa“, Dialog „Im Café bestellen“, Schreibaufgabe (`sch`) und Vokabel *myyjä*. **Ab t11 bekommt jedes neue Thema je eine `les`-, `dlg`- und `sch`-Übung** (Wunsch von Matthias: Lesen, Schreiben, Dialoge direkt in den Themen).

## Offene Erinnerung für Claude: KI-Anbieter (Gemini → teilweise Claude API)
Matthias möchte erinnert werden, sobald es sich lohnt (Entscheidung Oktober 2026: erst in ein paar Wochen).
- **Wann erinnern:** bei der Auswertung eines Berichts, sobald eines zutrifft: die Grundlagen t01–t08 sind fast sicher (KI-Übungen stehen kurz vor der Freischaltung), oder es kommen komplexere Themen dran (ab Partitiv/Ortsfälle/Stufenwechsel, ca. t12–t15), oder der Bericht zeigt Fehlurteile der KI bei der Antwortprüfung.
- **Grundlage:** die Auswertungen in `docs/ki-qualitaet.md` (KI-Protokoll aus den Berichten).
- **Was vorschlagen:** Mischbetrieb – Antwortprüfung, Gesamtanalyse und neue KI-Übungen über die Claude API (Empfehlung Claude Sonnet 5.5, ca. 2–4 $/Monat, Ausgabenlimit in der Anthropic Console setzen); Wörter nachschlagen, Vokabelprüfung und „Frag Opettaja“ bleiben bei Gemini (gratis). Schlüssel bleibt nur auf dem Gerät.
- Vor der Umsetzung Plan erklären und Bestätigung abwarten (Regel 12 in CLAUDE.md).

## Offene Erinnerung für Claude: Gemini-Kontingent schonen
- **Wann ansprechen:** sobald das KI-Protokoll im Bericht zeigt, dass die größeren Gemini-Modelle ihr Limit erreichen (`quota-day`/`quota-min` oder häufig Lite-Modelle als Ausweiche).
- **Was vorschlagen:** einfache Aufgaben (Wort nachschlagen, Vokabelprüfung, evtl. Rundenauswertung) zuerst mit dem kleinsten Modell, qualitätskritische (Antwortprüfung, KI-Übungen) mit den größeren. Details: `docs/architektur.md`, „Token-Verbrauch: Einsparpotenzial“, Punkt 7.
