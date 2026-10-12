# d05 – Quellen, GLOSS_EXTRA, Prüfung (Entwurf, Simulations-/Analyse-Chat, 12.10.2026)

Entwurf: `d05.json` (14 Karten, 62 Übungen: tab 9, gap 23, mc 12, tr 7, ord 3, les 3, dlg 2, sch 3). Grundlage: `docs/pruefungen/deutsch/plan-final.md` (D-1012-11), Anleitung vom Deutsch-Trainer-Chat, Stand deutsch-trainer d99d0e2. Kartenformat „der Kollege, die Kollegen“ wie in d04 (S-1012-101).

## 1. Quellen
Abruf mit `node tools/quellen.mjs --sprache de <Wort>` (en.wiktionary.org, Rohtext) und duden.de (`/rechtschreibung/<Wort>`), dazu de.wiktionary.org (Rohtext) für *euer* und *welcher*.

| Form/Regel | Quelle | Ergebnis |
|---|---|---|
| Geschenk | en.wiktionary; Duden | {{de-noun\|n,(e)s}} → die Geschenke; Duden: Neutrum, Plural die Geschenke |
| Kollegin | Duden (en.wiktionary nicht erreichbar) | Substantiv, feminin; Plural die Kolleginnen |
| Kollege | en.wiktionary; Duden | {{de-noun\|m.weak}}; Duden: Genitiv des Kollegen, Plural die Kollegen → den/dem Kollegen |
| Herr | en.wiktionary; Duden | {{de-noun\|<m,,en.weak_n>}}: Singular -n (den/dem Herrn), Plural -en (die Herren); Duden: Genitiv des Herrn, Plural die Herren |
| Geburtstag | en.wiktionary | {{de-noun\|m,(e)s}} → die Geburtstage |
| Blumenstrauß | Duden (en.wiktionary ohne Seite) | Substantiv, maskulin; Plural die Blumensträuße |
| Bonbonniere | en.wiktionary; Duden; DWDS | {{de-noun\|f}} → die Bonbonnieren; Duden: „hübsch aufgemachte Pralinenpackung“, Plural die Bonbonnieren. Kein Vermerk „österreichisch“ gefunden (ostarrichi.org: Suche 404) – darum ohne Österreich-Hinweis auf der Karte |
| Gutschein | en.wiktionary; Duden | {{de-noun\|m,s:es,e}} → die Gutscheine; Duden: maskulin |
| Glückwunschkarte | en.wiktionary; Duden | {{de-noun\|f}}; Duden: Plural die Glückwunschkarten |
| schenken | en.wiktionary | {{de-verb}} schwach: schenkte, hat geschenkt |
| geben | en.wiktionary | geben<gibt#gab,gegeben>: er gibt, gab, hat gegeben |
| einpacken | en.wiktionary | {{de-verb\|ein.packen}} trennbar, schwach: packte ein, hat eingepackt |
| aussuchen | en.wiktionary | {{de-verb\|aus.suchen}} trennbar, schwach: suchte aus, hat ausgesucht |
| überreichen | en.wiktionary; Duden | {{de-verb}} untrennbar (keine Trennstelle), schwach: überreichte, hat überreicht; Duden: schwaches Verb, Beispiel „überreicht“ |
| Kind | en.wiktionary | {{de-noun\|n,(e)s,er}} → die Kinder, Dativ Plural den Kindern |
| Freund | en.wiktionary | {{de-noun\|m,(e)s}} → die Freunde, Dativ Plural den Freunden |
| Schokolade | en.wiktionary | {{de-noun\|f}} |
| dieser (dies-) | en.wiktionary | {{de-decl-dieser}}: dieser/diese/dieses, diesen, diesem |
| welcher | de.wiktionary | Interrogativpronomen; Formen welcher, welche, welches, welchen, welchem |
| euer / eure / euere | de.wiktionary | Formen eure und euere (Nebenform) belegt → in Übung 4 beide akzeptiert |
| Akkusativ: nur Maskulinum ändert sich; Dativ -m/-r/-m/-n; Dativ Plural -n (außer Plural auf -n/-s) | en.wiktionary-Deklinationsvorlagen der Wörter oben (de-ndecl, de-decl-dieser, de-decl-euer) | übereinstimmend; grammis.ids-mannheim.de nicht eigens abgerufen |
| ein-Wörter ohne Endung in Nom. m/n und Akk. n | de-decl-euer (en.wiktionary), Possessivformen de.wiktionary | übereinstimmend |
| es gibt + Akkusativ | ohne Quelle (eigenes Wissen, Standardgrammatik) | |
| Niveau A1/A2 | Plan D-1012-11 (ÖIF-Zuordnung dort) | nicht neu geprüft |

**Ohne Quelle:** „es gibt + Akkusativ“; Natürlichkeit der Dialoge und Lesetexte (eigenes Sprachgefühl, keine Korpusabfrage); Behauptung „in vielen österreichischen Büros schenkt das Team …“ (Situationsbeschreibung, keine Sprachregel).

## 2. GLOSS_EXTRA-Vorschläge
Nur zum Testen lokal in `js/inhalte.js` der Testkopie eingetragen. Keine Kollision mit bestehenden Schlüsseln (automatisch geprüft). Nomen brauchen wegen S-1012-102 eigene Einträge.
```js
  "geschenk": {de: "present, gift", note: "das Geschenk, die Geschenke"},
  "geschenke": {de: "presents, gifts", base: "Geschenk", note: "Plural"},
  "kollegin": {de: "colleague (woman)", note: "die Kollegin, die Kolleginnen"},
  "kolleginnen": {de: "colleagues (women)", base: "Kollegin", note: "Plural"},
  "kollege": {de: "colleague (man)", note: "der Kollege, den/dem Kollegen, die Kollegen"},
  "kollegen": {de: "colleague (Akk./Dat.); colleagues", base: "Kollege", note: "den/dem Kollegen (Singular) oder die Kollegen (Plural)"},
  "herr": {de: "gentleman; Mr", note: "der Herr, den/dem Herrn, die Herren"},
  "herrn": {de: "gentleman, Mr (Akk./Dat.)", base: "Herr", note: "den Herrn, dem Herrn; vor Namen: Herrn Gruber"},
  "herren": {de: "gentlemen", base: "Herr", note: "Plural"},
  "geburtstag": {de: "birthday", note: "der Geburtstag, die Geburtstage"},
  "geburtstage": {de: "birthdays", base: "Geburtstag", note: "Plural"},
  "blumenstrauß": {de: "bunch of flowers, bouquet", note: "der Blumenstrauß, die Blumensträuße"},
  "blumensträuße": {de: "bunches of flowers", base: "Blumenstrauß", note: "Plural"},
  "bonbonniere": {de: "box of chocolates", note: "die Bonbonniere, die Bonbonnieren"},
  "bonbonnieren": {de: "boxes of chocolates", base: "Bonbonniere", note: "Plural"},
  "gutschein": {de: "voucher, gift card", note: "der Gutschein, die Gutscheine"},
  "gutscheine": {de: "vouchers", base: "Gutschein", note: "Plural"},
  "glückwunschkarte": {de: "greeting card", note: "die Glückwunschkarte, die Glückwunschkarten"},
  "glückwunschkarten": {de: "greeting cards", base: "Glückwunschkarte", note: "Plural"},
  "karte": {de: "card", note: "die Karte, die Karten"},
  "blumen": {de: "flowers", base: "Blume", note: "die Blume, die Blumen"},
  "kind": {de: "child", note: "das Kind, die Kinder"},
  "kinder": {de: "children", base: "Kind", note: "Plural"},
  "kindern": {de: "(to the) children", base: "Kind", note: "Dativ Plural: den Kindern"},
  "freund": {de: "friend (man); boyfriend", note: "der Freund, die Freunde"},
  "freunde": {de: "friends", base: "Freund", note: "Plural"},
  "freunden": {de: "(to the) friends", base: "Freund", note: "Dativ Plural: den Freunden"},
  "freundin": {de: "friend (woman); girlfriend", note: "die Freundin, die Freundinnen"},
  "person": {de: "person", note: "die Person, die Personen"},
  "team": {de: "team", note: "das Team, die Teams"},
  "buch": {de: "book", note: "das Buch, die Bücher"},
  "schokolade": {de: "chocolate", note: "die Schokolade"},
  "büro": {de: "office", note: "das Büro, die Büros"},
  "woche": {de: "week", note: "die Woche, die Wochen"},
  "freitag": {de: "Friday", note: "der Freitag"},
  "mittwoch": {de: "Wednesday", note: "der Mittwoch"},
  "geschäft": {de: "shop, store; business", note: "das Geschäft, die Geschäfte"},
  "idee": {de: "idea", note: "die Idee, die Ideen"},
  "grüße": {de: "regards, greetings", base: "Gruß", note: "Liebe Grüße = Best wishes (am Ende einer Nachricht)"},
  "gute": {de: "good", base: "gut", note: "Alles Gute! = All the best! / Alles Gute zum Geburtstag! = Happy birthday!"},
  "mail": {de: "email", note: "die E-Mail, die E-Mails (Österreich auch: das E-Mail)"},
  "dieser": {de: "this (masc. Nom.; fem. Dat.)", note: "der-Wort: dieser, diese, dieses, diese"},
  "diese": {de: "this (fem.); these", base: "dieser"},
  "diesen": {de: "this (masc. Akk.); these (Dat. Pl.)", base: "dieser"},
  "diesem": {de: "this (masc./neut. Dat.)", base: "dieser"},
  "welcher": {de: "which (masc. Nom.)", note: "der-Wort: welcher, welche, welches, welche"},
  "welche": {de: "which (fem.; plural)", base: "welcher"},
  "welchen": {de: "which (masc. Akk.; Dat. Pl.)", base: "welcher"},
  "welchem": {de: "which (masc./neut. Dat.)", base: "welcher"},
  "mein": {de: "my", note: "ein-Wort: mein, meine, mein, meine"},
  "ihr": {de: "you (plural); her; their", note: "Pronomen: ihr = you (pl.); Possessivartikel: ihr = her/their, Ihr = your (Sie)"},
  "unserer": {de: "our (fem. Dat.)", base: "unser"},
  "wer": {de: "who (Nominativ)"},
  "wen": {de: "who(m) (Akkusativ)", base: "wer"},
  "wem": {de: "(to) whom (Dativ)", base: "wer"},
  "schenkte": {de: "gave (as a present)", base: "schenken", note: "Präteritum"},
  "geschenkt": {de: "given (as a present)", base: "schenken", note: "Partizip II: hat geschenkt"},
  "gab": {de: "gave", base: "geben", note: "Präteritum"},
  "gegeben": {de: "given", base: "geben", note: "Partizip II: hat gegeben"},
  "packte": {de: "packed, wrapped", base: "einpacken", note: "Präteritum: packte … ein"},
  "eingepackt": {de: "wrapped, packed", base: "einpacken", note: "Partizip II: hat eingepackt"},
  "suchte": {de: "looked for", base: "suchen", note: "Präteritum; suchte … aus = chose (aussuchen)"},
  "ausgesucht": {de: "chosen, picked out", base: "aussuchen", note: "Partizip II: hat ausgesucht"},
  "überreichte": {de: "handed over, presented", base: "überreichen", note: "Präteritum"},
  "überreicht": {de: "handed over, presented", base: "überreichen", note: "Partizip II: hat überreicht; Präsens: er überreicht"},
  "nehme": {de: "(I) take", base: "nehmen"},
  "nimmst": {de: "(you) take", base: "nehmen", note: "du nimmst, er nimmt"},
  "suche": {de: "(I) look for", base: "suchen"},
  "schreibt": {de: "writes", base: "schreiben"},
  "liest": {de: "reads", base: "lesen", note: "du/er liest"},
  "chef": {de: "boss", note: "der Chef, die Chefs; die Chefin"},
```

## 3. req
`["d01","d02","d04"]` wie im Plan. d05 verwendet aus d01 Perfekt (Übungen 8, 11, 45, 46, 57), aus d02 weil/deshalb (Übungen 30, 31, 49), aus d04 Genus und Plural (Übungen 24, 25, 39) sowie Karfiol und Semmel (Übungen 15, 20, 35). Dativverben (d06), Personalpronomen im Dativ (d06) und Präpositionen (d09) werden nicht abgefragt: *zum Geburtstag* und *für* kommen nur als feste Wendung bzw. im Titel vor; *ihr* in Dialog 54 und *es* in Übung 43 stehen nur als zusätzliche richtige Antworten in `a`.

## 4. Ergebnis `node tools/pruefen.mjs`
Lokale Kopie von deutsch-trainer d99d0e2 mit d04 und d05 hinten angehängt (nicht gepusht):
- ohne die d05-Vorschläge: „Alles in Ordnung · 1 Hinweis“ – Wortprüfung: diesen, mein, ihr, dieser, diesem, welcher, welchen, welchem, wer, wen, wem, schenkte, gab, packte, suchte, überreichte, geschenkt, gegeben, eingepackt, ausgesucht, überreicht, unserer, nehme, welche, nimmst, suche, herr, schreibt, diese, liest.
- mit den Vorschlägen: **„Alles in Ordnung · 73 Prüfungen bestanden“, kein Hinweis.**
- Großgeschriebene Nomen prüft die Wortprüfung nicht (S-1012-102); darum zusätzlich von Hand geprüft und als Vorschläge ergänzt (Kind, Freund, Team, Büro, Woche …).

## 5. Prüfliste 1–16
| Zeile | Ergebnis |
|---|---|
| 1 | ✓ Formen mit Quelle (Abschnitt 1); Dialoge und Lesetexte nach Sprachgefühl (ohne Quelle). Österreichisch: Grüß Gott, Bonbonniere (ohne Österreich-Vermerk), E-Mail |
| 2 | ✓ Hinweise nennen nur Fall/Artikelart/Fragewort, keine Form. Lücken 9, 10 (werden), 30 (deshalb) und 18 (ein) wären ohne `h` mehrdeutig – `h` grenzt ein. Übung 5: „Dativ Singular“, weil *welchen Kollegen* sonst als Dativ Plural ginge |
| 3 | ✓ mit GLOSS_EXTRA-Vorschlägen keine Hinweise; jede Regel steht in der Theorie (n-Formen von Herr/Kollege nur als Detail) |
| 4 | ✓ keine Karte aus d01–d04 doppelt (automatischer Hinweis „Prüfliste 6“ ohne Fund) |
| 5 | ✓ Varianten: gern/gerne, Können/Könnten, das/es, Wortstellung mit Objekt vorn (40, 41), eure/euere |
| 6 | ✓ Theorie-Tabellen höchstens 3 Spalten; Gesamtsystem in einer Tabelle (Fall × der-/ein-Wörter, Reihenfolge m · f · n · Pl.) |
| 7 | ✓ Großschreibung; *Ihr* (Sie) in Übung 4 – Achtung: am Zellenanfang ist der erste Buchstabe frei, *ihr* würde dort auch gelten (Engine-Regel, kein Inhaltsfehler) |
| 8 | ✓ Umlaute exakt (Blumensträuße, Glückwunschkarte, überreichen) |
| 9 | ✓ ord 47–49: alle Stellungen, natürlichste zuerst; Nebensatz auch vorangestellt |
| 10 | ✓ Alternativen nur ganze Formen (welcher\|Welcher, eure\|euere) |
| 11 | ✓ Klammern auf den Karten verraten nichts („colleague (woman)“) |
| 12 | ✓ neues Thema, nichts an d01–d04 geändert |
| 13 | ✓ keine Markenschreibung betroffen |
| 14 | Niveau laut Plan A1/A2 (D-1012-11); nicht neu gegen ÖIF geprüft |
| 15 | ✓ 62 Übungen, 8 Formate; Schwerpunkt Satzbildung (gap 23, tr 7, ord 3, sch 3, dlg 2) |
| 16 | ✓ fünf Verbkarten mit „(Präteritum · Perfekt · Futur)“; Verbtabelle in der Theorie; Präteritum-/Perfekt-Tabelle (7, 8), Futur-Lücken (9, 10), Perfekt-Lücke (11) |

**Anteil Teilregeln/Mischung:** 0–6, 12–29, 32–38, 40–44, 58–61 zu den drei Teilregeln (≈ 70 %); 7–11, 30, 31, 39, 45–57 Mischung mit d01/d02/d04, Lesen, Schreiben (≈ 30 %).

## 6. Offene Fragen und Befunde (S-Codes)
Keine neuen. S-1012-101 (Kartenformat) und S-1012-102 (Antippen/Wortprüfung bei Nomen) gelten wie in d04.
