# d09 – Quellen, GLOSS_EXTRA, Prüfung (Entwurf, Simulations-/Analyse-Chat, 12.10.2026)

Entwurf: `d09.json` (14 Karten, 61 Übungen: tab 6, gap 26, mc 11, tr 7, ord 3, les 3, dlg 2, sch 3). Grundlage: Plan D-1012-11, Anleitung vom Deutsch-Trainer-Chat, Stand deutsch-trainer d99d0e2. Laut Anleitung erst nach Checkpoint 1 veröffentlichen; danach trägt der Deutsch-Trainer-Chat d09 als Voraussetzung von d03 ein (D-1012-17).

Bundesdeutsche Alternativen (Regel vom 12.10.): Öffis → öffentliche Verkehrsmittel, Bim → Straßenbahn (Karte, Theorie, GLOSS), daheim/heim → zu Hause/nach Hause (Theorie, GLOSS; in den Lösungen beide Formen).

## 1. Quellen
| Form/Regel | Quelle | Ergebnis |
|---|---|---|
| Haltestelle, Straßenbahn, U-Bahn, Kreuzung, Ampel, Ecke | en.wiktionary | je {{de-noun\|f}} → Plural -(e)n |
| Post | en.wiktionary | {{de-noun\|f,en[rare]}} (Plural selten) – Karte ohne Plural |
| Bank (Geldinstitut) | en.wiktionary | zweiter Eintrag {{de-noun\|f}} → die Banken (erster: Sitzbank, die Bänke) |
| Öffi / Öffis | Duden | Neutrum, „kurz für: öffentliches Verkehrsmittel“, Gebrauch „besonders österreichisch umgangssprachlich“, Plural die Öffis |
| Bim | Duden | feminin, Bedeutung „Straßenbahn“, Gebrauch „österreichisch umgangssprachlich“ |
| daheim | Duden | Adverb, „besonders süddeutsch, österreichisch, schweizerisch“ |
| zuhause / nachhause | de.wiktionary | jeweils „Alternative Schreibweisen“ zu zu Hause / nach Hause; nachhause mit Verweis auf Duden „nach Hause (dort auch nachhause)“ |
| umsteigen | en.wiktionary | um.steigen<stieg,gestiegen.sein>: stieg um, ist umgestiegen |
| aussteigen | Duden (en.wiktionary nicht erreichbar) | starkes Verb, Perfekt mit „ist“ |
| abbiegen | Duden (en.wiktionary nicht erreichbar) | starkes Verb; Perfekt mit „ist“ (Richtung ändern), mit „hat“ nur transitiv (etwas abbiegen) → bog ab, ist abgebogen |
| erledigen | en.wiktionary | schwach: erledigte, hat erledigt |
| geradeaus | en.wiktionary | {{de-adv}} |
| gegenüber + Dativ | de.wiktionary; en.wiktionary | „(lokale) Präposition mit dem Dativ“; Beleg „Gegenüber vom Riesenrad …“ für *gegenüber von*; en: preposition „opposite“ |
| aus, mit, nach, seit, von, zu + Dativ | en.wiktionary | {{+obj\|de\|dat}} je Präposition (bei: dat, daneben veraltet acc) |
| durch, für, gegen + Akkusativ | en.wiktionary | {{+obj\|de\|acc}} |
| ohne, um + Akkusativ | de.wiktionary | „mit Akkusativ“ |
| Kurzformen beim/vom/zum/zur | ohne eigenen Abruf (Standardgrammatik) | |
| seit + Präsens ↔ vor + Vergangenheit | ohne Quelle (Standardgrammatik) | |
| nach + Städte/Länder ohne Artikel, in + Länder mit Artikel | ohne Quelle (Standardgrammatik) | |

**Ohne Quelle:** Kurzformen, seit/vor-Regel, nach/in bei Ländern (Standardgrammatik, nicht einzeln nachgeschlagen); Natürlichkeit der Texte.

## 2. GLOSS_EXTRA-Vorschläge
Nur zum Testen lokal eingetragen; keine Kollision. *straßenbahn* steht schon unter den d07-Vorschlägen.
```js
  "haltestelle": {de: "stop (bus, tram)", note: "die Haltestelle, die Haltestellen"},
  "u-bahn": {de: "underground, subway", note: "die U-Bahn, die U-Bahnen"},
  "öffis": {de: "public transport (Austria, informal; Germany: öffentliche Verkehrsmittel)", base: "Öffi", note: "die Öffis (Plural)"},
  "bim": {de: "tram (Vienna, informal; = Straßenbahn)", note: "die Bim"},
  "post": {de: "post office; post, mail", note: "die Post"},
  "bank": {de: "bank; bench", note: "die Bank, die Banken (Geld) / die Bänke (zum Sitzen)"},
  "kreuzung": {de: "crossroads, junction", note: "die Kreuzung, die Kreuzungen"},
  "ampel": {de: "traffic lights", note: "die Ampel, die Ampeln"},
  "ampeln": {de: "traffic lights (plural)", base: "Ampel", note: "Plural"},
  "ecke": {de: "corner", note: "die Ecke, die Ecken; um die Ecke = round the corner"},
  "geradeaus": {de: "straight on, straight ahead"},
  "beim": {de: "at the (bei + dem)", base: "bei", note: "beim Arzt = at the doctor's"},
  "vom": {de: "from the (von + dem)", base: "von", note: "vom Arzt = from the doctor's"},
  "gegenüber": {de: "opposite", note: "Präposition mit Dativ: gegenüber dem Bahnhof / gegenüber vom Bahnhof"},
  "durch": {de: "through", note: "Präposition mit Akkusativ"},
  "ohne": {de: "without", note: "Präposition mit Akkusativ"},
  "stieg": {de: "climbed; got (on/off)", base: "steigen", note: "Präteritum: stieg um / stieg aus"},
  "umgestiegen": {de: "changed (trains, lines)", base: "umsteigen", note: "Partizip II: ist umgestiegen"},
  "ausgestiegen": {de: "got off, got out", base: "aussteigen", note: "Partizip II: ist ausgestiegen"},
  "bog": {de: "turned", base: "biegen", note: "Präteritum: bog ab (abbiegen)"},
  "abgebogen": {de: "turned (off)", base: "abbiegen", note: "Partizip II: ist abgebogen"},
  "erledigte": {de: "got done, dealt with", base: "erledigen", note: "Präteritum"},
  "erledigt": {de: "done, dealt with", base: "erledigen", note: "Partizip II: hat erledigt"},
  "wohne": {de: "(I) live", base: "wohnen"},
  "jetzt": {de: "now"},
  "fährst": {de: "(you) go, drive, ride", base: "fahren", note: "du fährst, er fährt"},
  "steigst": {de: "(you) climb; steigst … um = you change", base: "steigen"},
  "arzt": {de: "doctor", note: "der Arzt, die Ärzte; beim Arzt = at the doctor's"},
  "bahnhof": {de: "(railway) station", note: "der Bahnhof, die Bahnhöfe"},
  "eingang": {de: "entrance", note: "der Eingang, die Eingänge"},
  "fahrschein": {de: "ticket (bus, tram, train)", note: "der Fahrschein, die Fahrscheine"},
  "flughafen": {de: "airport", note: "der Flughafen, die Flughäfen"},
  "jahr": {de: "year", note: "das Jahr, die Jahre; seit/vor einem Jahr"},
  "jahren": {de: "years (Dat. Pl.)", base: "Jahr", note: "seit/vor zwei Jahren"},
  "minuten": {de: "minutes", base: "Minute", note: "die Minute, die Minuten"},
  "monaten": {de: "months (Dat. Pl.)", base: "Monat", note: "seit drei Monaten"},
  "stunde": {de: "hour", note: "die Stunde, die Stunden; eine halbe Stunde = half an hour"},
  "park": {de: "park", note: "der Park, die Parks"},
  "passant": {de: "passer-by", note: "der Passant, die Passanten"},
  "rad": {de: "bike; wheel", note: "das Rad, die Räder; mit dem Rad = by bike"},
  "rathaus": {de: "town hall, city hall", note: "das Rathaus"},
  "schwester": {de: "sister", note: "die Schwester, die Schwestern"},
  "telefon": {de: "telephone", note: "das Telefon; am Telefon = on the phone"},
  "weg": {de: "way, path; away", note: "der Weg, die Wege (Nomen); weg (Adverb: away)"},
  "zuerst": {de: "first, at first"},
  "jeden": {de: "every (masc. Akk.)", base: "jeder", note: "jeden Tag = every day"},
  "seit": {de: "since, for (until now)", note: "Präposition mit Dativ + Präsens: seit zwei Jahren"},
  "für": {de: "for", note: "Präposition mit Akkusativ"},
  "zuhause": {de: "at home (= zu Hause)", note: "auch: zu Hause; Österreich/Süddeutschland: daheim"},
  "nachhause": {de: "home (= nach Hause)", note: "auch: nach Hause; Österreich/Süddeutschland: heim"},
  "daheim": {de: "at home (Austria, southern Germany; = zu Hause)"},
  "heim": {de: "home (direction; = nach Hause)", note: "Ich gehe heim."},
```

## 3. req
`["d01","d02","d04","d05"]` wie im Plan. Genutzt: d01 Perfekt (5, 8, 26, 28, 43, 45), d02 weil/deshalb (29, Lesetext 51), d04 Plural (30), d05 Artikel im Dativ/Akkusativ und *der Kollege* (2, 18–21, 31–33). Imperative (d08) und Dativpronomen (d06) werden nicht verlangt; Wegbeschreibungen stehen im Präsens („Sie fahren …, dort steigen Sie um“). *beim Nachbarn* (Lesetext 50) ist durch die d06-GLOSS-Vorschläge antippbar.

## 4. Ergebnis `node tools/pruefen.mjs`
Lokale Kopie von deutsch-trainer d99d0e2 mit d04–d09 hinten angehängt (nicht gepusht):
- ohne die d09-Vorschläge: „Alles in Ordnung · 1 Hinweis“ – Wortprüfung: beim, vom, stieg, bog, erledigte, umgestiegen, ausgestiegen, abgebogen, erledigt, gegenüber, durch, ohne, wohne, jetzt, fährst, steigst.
- mit den Vorschlägen: **„Alles in Ordnung · 77 Prüfungen bestanden“, kein Hinweis.** Breite 390 px eingehalten.

## 5. Prüfliste 1–16
| Zeile | Ergebnis |
|---|---|
| 1 | ✓ Formen und Rektion mit Quelle; Bim, Öffis, daheim mit Duden-Vermerk und bundesdeutscher Form |
| 2 | ✓ `h` nennt die Bedeutung der gesuchten Präposition („= opposite“), die Frage (wo?/wohin?/woher?) oder „seit oder vor?“ – nie die Form selbst |
| 3 | ✓ mit Vorschlägen keine Hinweise |
| 4 | ✓ keine Karte aus d01–d08 doppelt (*Straßenbahn* bisher nur GLOSS-Vorschlag) |
| 5 | ✓ zu Hause/zuhause/daheim, nach Hause/nachhause/heim, wohnen/leben, Präteritum/Perfekt (43), Wortstellungen |
| 6 | ✓ Theorie-Tabellen höchstens 3 Spalten |
| 7 | ✓ Großschreibung (Seit/Vor am Satzanfang frei) |
| 8 | ✓ Umlaute exakt (gegenüber, fährst, Öffis) |
| 9 | ✓ ord 47–49 mit allen Stellungen |
| 10 | ✓ keine Alternativen in Lücken |
| 11 | ✓ Kartenklammern verraten nichts |
| 12 | ✓ neues Thema |
| 13 | ✓ nicht betroffen (U4 als Linienname) |
| 14 | Niveau laut Plan (A1+/A2++) |
| 15 | ✓ 61 Übungen, 8 Formate |
| 16 | ✓ vier Verbkarten mit Zeitformen (drei mit *ist*); Präteritum-/Perfekt-Tabelle (4, 5), Futur-Lücken (6, 7), Perfekt-Lücke mit *sind* (8) |

**Besonderheiten laut Anleitung:** seit ↔ vor mit Regelfrage (58) und vier Lücken mit `h` „seit oder vor?“ (25–28); Wegbeschreibung in Wien/Graz mit Bim, U-Bahn, Haltestelle; zu Hause/zuhause, nach Hause/nachhause, daheim akzeptiert.

**Anteil:** Teilregeln (0–3, 9–28, 32–42, 44, 46–48, 58–60) ≈ 75 %; Mischung, Lesen, Schreiben ≈ 25 %.

## 6. Offene Fragen und Befunde (S-Codes)
Keine neuen.
