# d06 – Quellen, GLOSS_EXTRA, Prüfung (Entwurf, Simulations-/Analyse-Chat, 12.10.2026)

Entwurf: `d06.json` (15 Karten, 61 Übungen: tab 7, gap 23, mc 12, tr 7, ord 4, les 3, dlg 2, sch 3). Grundlage: Plan D-1012-11, Anleitung vom Deutsch-Trainer-Chat, Stand deutsch-trainer d99d0e2. Niveau wie im Plan „A1++/A2++“.

## 1. Quellen
Abruf mit `node tools/quellen.mjs --sprache de <Wort>` (en.wiktionary.org, Rohtext; Rektion über `{{+obj|de|dat…}}`) und duden.de.

| Form/Regel | Quelle | Ergebnis |
|---|---|---|
| Nachbar | en.wiktionary; Duden | {{de-noun\|<m.weak_n>,<m,s[more informal],n>}}: schwach (den/dem Nachbarn), umgangssprachlich auch stark (dem Nachbar); Duden: Genitiv des Nachbarn (selten: des Nachbars), Plural die Nachbarn |
| Nachbarin | en.wiktionary | {{de-noun\|f}} → die Nachbarinnen |
| Paket | en.wiktionary | {{de-noun\|n,(e)s}} → die Pakete |
| Leiter (f) / Leiter (m) | en.wiktionary | f: ladder (→ die Leitern); m: leader/manager – Hinweis im GLOSS-Vorschlag |
| Schlüssel | Duden (en.wiktionary nicht erreichbar) | maskulin, Genitiv des Schlüssels, Plural die Schlüssel |
| annehmen | en.wiktionary; Duden | an.nehmen<nimmt#nahm,genommen>; Duden: „etwas entgegennehmen“ |
| übernehmen (nur als Variante in Übung 41) | en.wiktionary | übernehmen<übernimmt#übernahm,übernommen>; die österreichische Verwendung „ein Paket übernehmen“ ohne Quelle – darum Karte *annehmen*, *übernehmen* nur als zusätzliche Lösung |
| helfen + Dat. | en.wiktionary | helfen<hilft#half,geholfen>; {{+obj\|de\|dat<someone>}} |
| gehören + Dat. | en.wiktionary; Duden | schwach; Duden-Beispiel „das Buch gehört mir“ |
| gefallen + Dat. | en.wiktionary | gefallen<gefällt#gefiel,gefallen>; Hinweis „with the dative object as the subject“ (im Englischen) |
| passen + Dat. | en.wiktionary | schwach; {{+obj\|de\|dat<someone/something>}} |
| schmecken + Dat. | en.wiktionary | schwach; {{+obj\|de\|dat<q:sometimes>}} |
| danken + Dat. | Duden (en.wiktionary nicht erreichbar) | schwaches Verb; Beispiel „jemandem … danken, wir danken Ihnen“ |
| gratulieren + Dat. (+ zu) | en.wiktionary | schwach; {{+obj\|de\|dat<someone> + :zu(dat)}} |
| schicken | en.wiktionary | schwach: schickte, hat geschickt |
| leihen | en.wiktionary | leihen<lieh,geliehen> |
| borgen (nur als Variante in Dialog 53) | en.wiktionary; Duden | schwach; Duden: „leihen“, Gebrauch „veraltend“ – in Österreich verbreitet (ohne Quelle), darum nur als zusätzliche Lösung |
| Kasten = Schrank | Duden | Bedeutung „Schrank“, Gebrauch „süddeutsch, österreichisch, schweizerisch“; Plural die Kästen |
| Briefträger | en.wiktionary | {{de-noun\|m}}, endungsloser Plural |
| Personalpronomen Nom./Akk./Dat. | Standardtabelle, z. B. en.wiktionary „ich“, „er“ (nicht einzeln abgerufen) | ohne eigenen Abruf |
| Stellung der Objekte (Nomen Dat. vor Akk.; Pronomen vor Nomen; Pronomen Akk. vor Dat.) | ohne Quelle (Standardgrammatik); grammis.ids-mannheim.de war erreichbar, die passende Seite über die Suche aber nicht auffindbar | |

**Ohne Quelle:** Stellung der Objekte (Regel 3); *übernehmen* und *borgen* als in Österreich übliche Varianten; Natürlichkeit der Dialoge und Lesetexte (eigenes Sprachgefühl).

## 2. GLOSS_EXTRA-Vorschläge
Nur zum Testen lokal eingetragen; keine Kollision mit bestehenden Schlüsseln und mit den d04/d05-Vorschlägen.
```js
  "nachbar": {de: "neighbour (man)", note: "der Nachbar, den/dem Nachbarn, die Nachbarn"},
  "nachbarn": {de: "neighbour (Akk./Dat.); neighbours", base: "Nachbar", note: "den/dem Nachbarn (Singular) oder die Nachbarn (Plural)"},
  "nachbarin": {de: "neighbour (woman)", note: "die Nachbarin, die Nachbarinnen"},
  "nachbarinnen": {de: "neighbours (women)", base: "Nachbarin", note: "Plural"},
  "paket": {de: "parcel, package", note: "das Paket, die Pakete"},
  "pakete": {de: "parcels", base: "Paket", note: "Plural"},
  "leiter": {de: "ladder", note: "die Leiter, die Leitern (der Leiter = manager, head)"},
  "schlüssel": {de: "key", note: "der Schlüssel, die Schlüssel"},
  "mich": {de: "me (Akkusativ)", base: "ich"},
  "dich": {de: "you (Akkusativ)", base: "du"},
  "ihn": {de: "him; it (Akkusativ, maskulin)", base: "er"},
  "ihm": {de: "(to) him; (to) it (Dativ)", base: "er", note: "er/es → ihm"},
  "mir": {de: "(to) me (Dativ)", base: "ich"},
  "euch": {de: "you (plural; Akk./Dat.)", base: "ihr"},
  "ihnen": {de: "(to) them (Dativ)", base: "sie", note: "Ihnen (groß) = (to) you, höflich"},
  "half": {de: "helped", base: "helfen", note: "Präteritum"},
  "geholfen": {de: "helped", base: "helfen", note: "Partizip II: hat geholfen"},
  "gefiel": {de: "pleased (… liked)", base: "gefallen", note: "Präteritum: es gefiel mir = I liked it"},
  "gefällt": {de: "pleases (I like …)", base: "gefallen", note: "Die Wohnung gefällt mir = I like the flat"},
  "nahm": {de: "took", base: "nehmen", note: "Präteritum; nahm … an = took in, accepted (annehmen)"},
  "angenommen": {de: "accepted, taken in", base: "annehmen", note: "Partizip II: hat angenommen"},
  "lieh": {de: "lent; borrowed", base: "leihen", note: "Präteritum"},
  "geliehen": {de: "lent; borrowed", base: "leihen", note: "Partizip II: hat geliehen"},
  "schickte": {de: "sent", base: "schicken", note: "Präteritum"},
  "gratulierte": {de: "congratulated", base: "gratulieren", note: "Präteritum"},
  "gratuliert": {de: "congratulated; congratulates", base: "gratulieren", note: "Partizip II: hat gratuliert; Präsens: er gratuliert"},
  "geschmeckt": {de: "tasted", base: "schmecken", note: "Partizip II: hat geschmeckt"},
  "gehört": {de: "belongs; heard", base: "gehören", note: "Präsens von gehören (das gehört mir); auch Partizip II von hören (hat gehört)"},
  "könnten": {de: "could (polite)", base: "können", note: "Könnten Sie …? = Could you …?"},
  "könntest": {de: "could (polite, du)", base: "können", note: "Könntest du …? = Could you …?"},
  "nett": {de: "nice, kind"},
  "zehn": {de: "ten"},
  "besser": {de: "better", base: "gut"},
  "kommt": {de: "comes", base: "kommen"},
  "zurückgeben": {de: "to give back, to return", note: "trennbar: Du gibst sie mir zurück."},
  "abend": {de: "evening", note: "der Abend; am Abend = in the evening"},
  "briefträger": {de: "postman (Germany also: Postbote)", note: "der Briefträger, die Briefträger; die Briefträgerin"},
  "bruder": {de: "brother", note: "der Bruder, die Brüder"},
  "dank": {de: "thanks", note: "Vielen Dank! = Thank you very much!"},
  "vielen": {de: "many (Dat.)", base: "viel", note: "Vielen Dank! = Thank you very much!"},
  "essen": {de: "food, meal; to eat", note: "das Essen (Nomen); essen (Verb)"},
  "frau": {de: "woman; Mrs/Ms", note: "die Frau, die Frauen; Frau Huber = Mrs/Ms Huber"},
  "hallo": {de: "hello, hi"},
  "haus": {de: "house; building", note: "das Haus, die Häuser"},
  "hilfe": {de: "help", note: "die Hilfe"},
  "kasten": {de: "wardrobe, cupboard (Austria; Germany: Schrank); box", note: "der Kasten, die Kästen"},
  "klar": {de: "clear; sure, of course", note: "Klar! = Sure!"},
  "natürlich": {de: "of course; natural"},
  "kuchen": {de: "cake", note: "der Kuchen, die Kuchen"},
  "schuhe": {de: "shoes", base: "Schuh", note: "der Schuh, die Schuhe"},
  "suppe": {de: "soup", note: "die Suppe, die Suppen"},
  "tag": {de: "day", note: "der Tag, die Tage; den ganzen Tag = all day"},
  "tür": {de: "door", note: "die Tür, die Türen"},
  "uhr": {de: "clock, watch; o'clock", note: "die Uhr; zehn Uhr = ten o'clock"},
  "wohnung": {de: "flat, apartment", note: "die Wohnung, die Wohnungen"},
  "super": {de: "great, super"},
```

## 3. req
`["d01","d02","d04","d05"]` wie im Plan. d06 nutzt aus d05 Artikel im Dativ (24–26, 29, 36) und *schenken/geben* (Übungen 4, 29, 43, 45), aus d01 Perfekt (6, 9, 43, 55), aus d02 weil/deshalb (27, 28, 48), aus d04 Plural/Genus der neuen Nomen. Präpositionen (d09) werden nicht abgefragt; *für*, *vor der Tür* und *zum Geburtstag* stehen nur in Hör-/Lesezeilen bzw. als feste Wendung.

## 4. Ergebnis `node tools/pruefen.mjs`
Lokale Kopie von deutsch-trainer d99d0e2 mit d04–d06 hinten angehängt (nicht gepusht):
- ohne die d06-Vorschläge: „Alles in Ordnung · 1 Hinweis“ – Wortprüfung: mich, dich, ihn, euch, mir, ihm, ihnen, half, gefiel, nahm, lieh, schickte, gratulierte, geholfen, angenommen, geliehen, geschmeckt, gratuliert, gefällt, gehört, könnten, nett, zehn, besser, kommt, zurückgeben.
- mit den Vorschlägen: **„Alles in Ordnung · 74 Prüfungen bestanden“, kein Hinweis.**
- Großgeschriebene Wörter zusätzlich mit einem eigenen Skript geprüft (S-1012-102): übrig bleiben nur Namen, Grammatikbegriffe in Aufgabentiteln und englische Anweisungen.

## 5. Prüfliste 1–16
| Zeile | Ergebnis |
|---|---|
| 1 | ✓ Formen und Rektion mit Quelle (Abschnitt 1); Wortstellungsregel ohne Quelle |
| 2 | ✓ `h` nennt Fall/Person/Pronomen-Bezug, nie die Form. Übung 25 mit „(ein Nachbar)“, weil *den Nachbarn* (Dativ Plural) sonst auch passt |
| 3 | ✓ mit Vorschlägen keine Hinweise; jede Regel in der Theorie |
| 4 | ✓ keine Karte aus d01–d05 doppelt |
| 5 | ✓ Varianten: gern/gerne, Können/Könnten, annehmen/übernehmen, leihen/borgen, Wortstellung (39, 40, 45, 46, 48), neighbour/neighbor |
| 6 | ✓ Theorie-Tabellen höchstens 3 Spalten (Pronomen: Nom./Akk./Dat.) |
| 7 | ✓ Großschreibung *Sie/Ihnen*; Hinweis wie in d05: am Zellenanfang ist der erste Buchstabe frei |
| 8 | ✓ Umlaute exakt (gefällt, Schlüssel, zurückgeben) |
| 9 | ✓ ord 45–48: alle Stellungen; bei zwei Pronomen (47) gibt es nur eine |
| 10 | ✓ keine Alternativen in Lücken |
| 11 | ✓ Kartenklammern verraten nichts (gefallen: „I like it = it pleases me“) |
| 12 | ✓ neues Thema |
| 13 | ✓ nicht betroffen |
| 14 | Niveau laut Plan; nicht neu gegen ÖIF geprüft |
| 15 | ✓ 61 Übungen, 8 Formate |
| 16 | ✓ zehn Verbkarten mit „(Präteritum · Perfekt · Futur)“; Präteritum-/Perfekt-Tabelle (5, 6), Futur-Lücken (7, 8), Perfekt-Lücke (9) |

**Anteil Teilregeln/Mischung:** 0–4, 10–26, 30–41, 45–47, 57–60 zu den drei Teilregeln (≈ 70 %); 5–9, 27–29, 42–44, 48–56 Mischung, Lesen, Schreiben (≈ 30 %).

## 6. Offene Fragen und Befunde (S-Codes)
Keine neuen. Hinweis an den Deutsch-Trainer-Chat: *der Nachbar* hat wie *der Kollege* n-Formen; das System kommt laut Plan erst in d18.
