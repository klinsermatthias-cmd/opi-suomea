# Gesamtprüfung Deutsch-Trainer d01–d09 (S-1012-111, 12.10.2026)

Simulations-/Analyse-Chat. Grundlage: deutsch-trainer d99d0e2 (d01–d03) und die Entwürfe d04–d09 auf diesem Branch (`docs/pruefungen/deutsch/entwuerfe/`). Alle Themen zusammen in einer lokalen Kopie geprüft (nicht gepusht). Keine Daten von Aurora verwendet.

## 1. Ergebnis in Kürze
- `node tools/pruefen.mjs` mit d01–d09 und allen GLOSS-Vorschlägen: **„Alles in Ordnung · 77 Prüfungen bestanden“**, kein ✗, kein Hinweis (390-px-Breite eingehalten).
- d04–d09 erfüllen jede Mengenvorgabe der Anleitung (Tabelle unten); `req` genau wie im Plan.
- **Keine doppelte Karte** über alle neun Themen (Singularform verglichen).
- **Keine doppelten GLOSS-Schlüssel** zwischen den Vorschlägen d04–d09 (443 Einträge) und dem bestehenden `GLOSS_EXTRA`.
- **Österreich-Regel (Matthias, 12.10.):** d04–d09 erfüllt; in d01–d03 fehlen auf drei Karten die bundesdeutschen Entsprechungen (Abschnitt 4).
- **S-1012-102 (Nomen nicht antippbar):** betrifft auch d01–d03 – 53 GLOSS-Vorschläge dafür in Abschnitt 5.

## 2. Kennzahlen je Thema
| Thema | Karten | Übungen | Formate | les | dlg | sch | tr de/fi | Präteritum-/Perfekt-Tabellen / Futur-Lücken | Regelfragen am Ende | Theorie: Situation/Dialog/Grammatik/Verbtabelle | req wie Plan |
|---|---|---|---|---|---|---|---|---|---|---|---|
| d01 | 15 (Verben 11) | 65 | 8 | 3 | 3 | 3 | 6/3 | 3/2 | 1 | ✓✓✓✓ | (bestehend) |
| d02 | 15 (Verben 7) | 60 | 8 | 3 | 3 | 3 | 6/3 | 2/2 | 1 | ✓✓✓✓ | (bestehend) d01 |
| d03 | 13 (Verben 2) | 65 | 8 | 3 | 3 | 3 | 6/3 | 6/2 | 1 | ✓✓✓✓ | (bestehend) d01, d02 |
| d04 | 14 (Verben 2) | 56 | 8 | 3 | 3 | 3 | 4/3 | 2/2 | 4 | ✓✓✓✓ | ✓ |
| d05 | 14 (Verben 5) | 62 | 8 | 3 | 2 | 3 | 4/3 | 2/2 | 4 | ✓✓✓✓ | ✓ |
| d06 | 15 (Verben 10) | 61 | 8 | 3 | 2 | 3 | 4/3 | 2/2 | 4 | ✓✓✓✓ | ✓ |
| d07 | 13 (Verben 4) | 61 | 8 | 3 | 2 | 3 | 3/3 | 2/2 | 3 | ✓✓✓✓ | ✓ |
| d08 | 14 (Verben 6) | 63 | 8 | 3 | 2 | 3 | 4/3 | 2/2 | 3 | ✓✓✓✓ | ✓ |
| d09 | 14 (Verben 4) | 61 | 8 | 3 | 2 | 3 | 4/3 | 2/2 | 3 | ✓✓✓✓ | ✓ |

„Regelfragen am Ende“ zählt die mc mit Erklärung ganz am Schluss. d01–d03 haben ihre Regelfragen an anderer Stelle (die automatische Prüfliste-9-Prüfung ist trotzdem grün) – kein Fehler, nur eine andere Reihenfolge.

## 3. Zusammenhang zwischen den Themen
- **Reihenfolge der Teilregeln:** Akkusativ erst ab d05 (d04 nur Nominativ), Dativpronomen erst ab d06, ein-Wörter allein erst ab d07, Imperativ erst ab d08, Präpositionen erst ab d09. In früheren Themen kommen spätere Formen höchstens als **zusätzliche richtige Antwort** in `a` oder in Lese-/Hörzeilen vor, nie als verlangte Form (je Thema in Abschnitt 3 der Quellendatei begründet).
- **Wechselpräpositionen (d11) und Adjektivendungen (d14)** stehen in d04–d09 nur in Lese- und Dialogzeilen (*im Kasten, auf der Firmenfeier, die neue U-Bahn, eine halbe Stunde*), nie in einer Lücke oder einer verlangten Antwort.
- **d08 und d09 nach Checkpoint 1:** beide setzen d07 nicht voraus; sie können also auch in anderer Reihenfolge freigeschaltet werden. d09 verlangt keine Imperative (Wegbeschreibung im Präsens), weil d08 nicht in seinem `req` steht.
- **n-Deklination (d18):** *Herr, Kollege, Nachbar* kommen als feste Formen vor (d05, d06), das System wird nicht erklärt – wie im Plan.
- **Checkpoint 1 nach d07:** d07 hat mit rund 35 % bewusst etwas mehr Mischübungen zu d04–d06.

## 4. Österreichische Wörter → bundesdeutsche Alternative (Regel vom 12.10.)
Prüfskript: alle Karten und alle verlangten Lösungen (gap, tr de, ord, tab, dlg) auf österreichische Wörter durchsucht; Ergebnis je Fundstelle.

**d04–d09: erfüllt.** Karten mit „Germany: …“ (Paradeiser, Erdapfel, Karfiol, Semmel, Sackerl, Kassa, Häferl, E-Card, Öffis, Straßenbahn/Bim), Lösungen mit beiden Formen (Kartoffeln, Tomaten, Brötchen, Schrank, zu Hause/zuhause/daheim, nach Hause/nachhause/heim). Wo das österreichische Wort in der Aufgabe vorgegeben ist (Plural von *der Paradeiser*), bleibt die Lösung österreichisch. In d04 nachgebessert (Commit 4f2ac58).

**d01–d03 (veröffentlicht – nur Vorschläge für den Deutsch-Trainer-Chat, Indizes bleiben):**
| Stelle | jetzt | Vorschlag |
|---|---|---|
| d01 v13 | „der Heurige“ → traditional wine tavern (Austria) | „traditional wine tavern (Austria; Germany: no exact equivalent, similar: Weinstube)“ – Duden: „besonders österreichisch“ |
| d02 v1 | „im Krankenstand sein“ → to be on sick leave (Austria) | „to be on sick leave (Austria; Germany: krankgeschrieben sein) (war · ist gewesen · wird sein)“ |
| d02 v6 | „die Ordination“ → doctor's surgery (Austria) | „doctor's surgery (Austria; Germany: Praxis, Arztpraxis)“ |

Die Lösungen in d01–d03 sind schon in Ordnung: zu Hause/zuhause/daheim (d01 ex52, d03 ex18); wo *Ordination* oder *Krankenstand* vorkommt, ist das Wort in der Aufgabe vorgegeben oder es wird ins Englische übersetzt. Die bundesdeutschen Entsprechungen *Praxis, krankgeschrieben, Weinstube* stammen aus eigenem Wissen (ohne Quelle).

**Vorschlag für die Prüfliste des Deutsch-Trainers (neue Zeile 17):** „Österreichisches Wort → bundesdeutsche Alternative auf der Karte (‚Germany: …‘) und im GLOSS-Vorschlag; in verlangten Lösungen gilt die bundesdeutsche Form ebenfalls als richtig, außer das österreichische Wort ist in der Aufgabe vorgegeben. Beispiel: Kasten → auch Schrank (d07 Dialog 54). Code: Matthias 12.10. Automatischer Test: Liste österreichischer Wörter gegen Karten und Lösungen (Skript aus dieser Prüfung).“

## 5. GLOSS_EXTRA-Vorschläge für d01–d03 (S-1012-102)
Großgeschriebene Nomen in d01–d03, die weder Karte noch GLOSS-Eintrag haben und darum nicht antippbar sind. Viele weitere (Abend, Arbeit, Arzt, Büro, Freundin, Wohnung …) sind schon durch die Vorschläge zu d04–d09 abgedeckt. Plural und Genus mit en.wiktionary (`{{de-noun|…}}`) geprüft; *Kaffeeküche* und *Unterlagen* ohne Seite (ohne Quelle); *Servus* und *Kaffeehaus* mit Duden („besonders bayrisch, österreichisch“ bzw. „besonders österreichisch“); *Schi* als alternative Schreibweise von *Ski* (de.wiktionary). Mit diesen Einträgen bleiben in d01–d03 nur Namen, Grammatikbegriffe und Arbeitsanweisungen übrig.
```js
  "bahn": {de: "train, railway; track", note: "die Bahn, die Bahnen; mit der Bahn = by train"},
  "berge": {de: "mountains", base: "Berg", note: "der Berg, die Berge"},
  "bett": {de: "bed", note: "das Bett, die Betten"},
  "eltern": {de: "parents", note: "die Eltern (nur Plural)"},
  "fahrt": {de: "journey, ride, trip", note: "die Fahrt, die Fahrten"},
  "fisch": {de: "fish", note: "der Fisch, die Fische"},
  "job": {de: "job", note: "der Job, die Jobs"},
  "kaffeeküche": {de: "office kitchen (for making coffee)", note: "die Kaffeeküche"},
  "meer": {de: "sea", note: "das Meer, die Meere; ans Meer = to the seaside"},
  "monat": {de: "month", note: "der Monat, die Monate"},
  "mutter": {de: "mother", note: "die Mutter, die Mütter"},
  "nachmittag": {de: "afternoon", note: "der Nachmittag, die Nachmittage; am Nachmittag"},
  "schnitzel": {de: "schnitzel, escalope", note: "das Schnitzel, die Schnitzel"},
  "see": {de: "lake", note: "der See, die Seen (die See = the sea)"},
  "sohn": {de: "son", note: "der Sohn, die Söhne"},
  "sommer": {de: "summer", note: "der Sommer, die Sommer; im Sommer"},
  "sonntag": {de: "Sunday", note: "der Sonntag; am Sonntag"},
  "montagmorgen": {de: "Monday morning", note: "der Montagmorgen; am Montagmorgen"},
  "juli": {de: "July", note: "der Juli; im Juli"},
  "mai": {de: "May", note: "der Mai; im Mai"},
  "stunden": {de: "hours", base: "Stunde", note: "Plural"},
  "unterlagen": {de: "documents, papers", note: "die Unterlagen (meist Plural)"},
  "urlaub": {de: "holiday(s), vacation", note: "der Urlaub; auf/im Urlaub"},
  "wochen": {de: "weeks", base: "Woche", note: "Plural"},
  "zug": {de: "train", note: "der Zug, die Züge"},
  "servus": {de: "hi; bye (Austria, informal; Germany: hallo, tschüss)"},
  "café": {de: "café", note: "das Café, die Cafés (Österreich auch: das Kaffeehaus)"},
  "anruf": {de: "(phone) call", note: "der Anruf, die Anrufe"},
  "bus": {de: "bus", note: "der Bus, die Busse"},
  "chefin": {de: "boss (woman)", note: "die Chefin, die Chefinnen; der Chef"},
  "doktor": {de: "doctor", note: "der Doktor, die Doktoren; Frau Doktor / Herr Doktor (Anrede)"},
  "donnerstag": {de: "Thursday", note: "der Donnerstag; am Donnerstag"},
  "name": {de: "name", note: "der Name, den/dem Namen, die Namen"},
  "problem": {de: "problem", note: "das Problem, die Probleme; Kein Problem! = No problem!"},
  "satz": {de: "sentence", note: "der Satz, die Sätze"},
  "wort": {de: "word", note: "das Wort, die Wörter"},
  "zeit": {de: "time", note: "die Zeit, die Zeiten; Ich habe keine Zeit."},
  "anfang": {de: "beginning, start", note: "der Anfang, die Anfänge; am Anfang"},
  "baum": {de: "tree", note: "der Baum, die Bäume"},
  "erinnerungen": {de: "memories", base: "Erinnerung", note: "die Erinnerung, die Erinnerungen"},
  "erwachsenen": {de: "adults", base: "Erwachsene", note: "der/die Erwachsene, die Erwachsenen"},
  "familie": {de: "family", note: "die Familie, die Familien"},
  "hände": {de: "hands", base: "Hand", note: "Plural"},
  "kurs": {de: "course, class", note: "der Kurs, die Kurse"},
  "land": {de: "country; countryside", note: "das Land, die Länder; am Land (Österreich) = auf dem Land = in the countryside"},
  "musik": {de: "music", note: "die Musik"},
  "oma": {de: "grandma", note: "die Oma, die Omas"},
  "pause": {de: "break", note: "die Pause, die Pausen"},
  "radio": {de: "radio", note: "das Radio, die Radios"},
  "ski": {de: "ski; skiing", note: "der Ski, die Skier; Ski fahren (Österreich auch: Schi)"},
  "schi": {de: "ski (Austrian spelling of Ski)", base: "Ski", note: "Schi fahren = Ski fahren"},
  "tante": {de: "aunt", note: "die Tante, die Tanten"},
  "wohnungen": {de: "flats, apartments", base: "Wohnung", note: "Plural"},
```

## 6. Offene Punkte
- **S-1012-112** (nächster Schritt): Simulation des Deutsch-Trainers mit d01–d09 in einer lokalen Kopie.
- Für den Deutsch-Trainer-Chat bei der Übernahme: GLOSS-Vorschläge d04–d09 aus den Quellendateien, die drei Kartentexte aus Abschnitt 4, die Prüflisten-Zeile 17 und die GLOSS-Vorschläge aus Abschnitt 5.
