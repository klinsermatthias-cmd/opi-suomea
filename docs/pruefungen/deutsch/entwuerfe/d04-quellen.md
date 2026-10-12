# d04 – Quellen, GLOSS_EXTRA, Prüfung (Entwurf, Simulations-/Analyse-Chat, 12.10.2026)

Entwurf: `d04.json` (14 Karten, 56 Übungen: tab 7, gap 17, mc 13, tr 7, ord 3, les 3, dlg 3, sch 3). Grundlage: `docs/pruefungen/deutsch/plan-final.md` (D-1012-11), Anleitung vom Deutsch-Trainer-Chat, Stand deutsch-trainer d99d0e2.

## 1. Quellen
Abruf mit `node tools/quellen.mjs --sprache de <Wort>` (en.wiktionary.org, Rohtext, Vorlage `de-noun|Genus,Genitiv,Plural`; ohne Plural-Angabe = Standardplural: f → -(e)n, m/n auf -er/-el/-en → endungslos) und duden.de (`/rechtschreibung/<Wort>`).

| Form/Regel | Quelle | Ergebnis |
|---|---|---|
| Markt | en.wiktionary (Rohtext) | Noun: {{de-noun|m,(e)s,^e}} |
| Stand | en.wiktionary (Rohtext) | Noun: {{de-noun|m,(e)s,^e|dim=^chen,^lein,l,erl}} |
| Einkaufsliste | en.wiktionary (Rohtext) | Noun: {{de-noun|f}} |
| Paradeiser | en.wiktionary (Rohtext) | Noun: {{de-noun|m}} |
| Erdapfel | en.wiktionary (Rohtext) | Noun: {{de-noun|m,,^}} |
| Karfiol | en.wiktionary (Rohtext) | Noun: {{de-noun|m.sg}} |
| Zwiebel | en.wiktionary (Rohtext) | Noun: {{de-noun|f}} |
| Semmel | en.wiktionary (Rohtext) | Noun: {{de-noun|f|dim=chen,Semmerl}} |
| Ei | en.wiktionary (Rohtext) | Noun: {{de-noun|n,(e)s,er|dim=chen,erchen,lein}} |
| Sackerl | en.wiktionary (Rohtext) | Noun: {{de-noun|n,,-:n}} |
| Kassa | en.wiktionary (Rohtext) | Noun: {{de-noun|f,Kassen}} |
| Packung | en.wiktionary (Rohtext) | Noun: {{de-noun|f}} |
| Kilo | en.wiktionary (Rohtext) | Noun: {{de-noun|n,-,(s)}} |
| Stück | en.wiktionary (Rohtext) | Noun: {{de-noun|n,(e)s,e:er:-|dim=chen,lein,erl}} |
| Zeitung | en.wiktionary (Rohtext) | Noun: {{de-noun|f}} |
| Freiheit | en.wiktionary (Rohtext) | Noun: {{de-noun|f}} |
| Möglichkeit | en.wiktionary (Rohtext) | Noun: {{de-noun|f}} |
| Freundschaft | en.wiktionary (Rohtext) | Noun: {{de-noun|f}} |
| Information | en.wiktionary (Rohtext) | Noun: {{de-noun|f|dim=^chen}} |
| Universität | en.wiktionary (Rohtext) | Noun: {{de-noun|f}} |
| Gemüse | en.wiktionary (Rohtext) | Noun: {{de-noun|n,,-}} |
| Getränk | en.wiktionary (Rohtext) | Noun: {{de-noun|n,(e)s}}  |
| Gemeinde | en.wiktionary (Rohtext) | Noun: {{de-noun|f}} |
| Geschichte | en.wiktionary (Rohtext) | Noun: {{de-noun|f|dim=chen,lein,l,erl}} |
| Gedanke | en.wiktionary (Rohtext) | Noun: {{de-noun|m,ns:n[nonstandard but common].weak}} |
| Mädchen | en.wiktionary (Rohtext) | Noun: {{de-noun|n,s,-:s[nonstandard, uncommon]}} |
| Ergebnis | en.wiktionary (Rohtext) | Noun: {{de-noun|n}} |
| Erlaubnis | en.wiktionary (Rohtext) | Noun: {{de-noun|f}} |
| Zentrum | en.wiktionary (Rohtext) | Noun: {{de-noun|n,,Zentren}} |
| Museum | en.wiktionary (Rohtext) | Noun: {{de-noun|n,,Museen}} |
| Dokument | en.wiktionary (Rohtext) | Noun: {{de-noun|n,(e)s}} |
| Moment | en.wiktionary (Rohtext) | Noun: {{de-noun|m,(e)s|dim=chen,erl}} |
| Montag | en.wiktionary (Rohtext) | Noun: {{de-noun|m,(e)s}} |
| Jänner | en.wiktionary (Rohtext) | Noun: {{de-noun|m}} |
| Winter | en.wiktionary (Rohtext) | Noun: {{de-noun|m}} |
| Verkäufer | en.wiktionary (Rohtext) | Noun: {{de-noun|m|f=in}} |
| Uhr | en.wiktionary (Rohtext) | Noun: {{de-noun|f}} |
| Monat | en.wiktionary (Rohtext) | Noun: {{de-noun|m:n,(e)s}} |
| Brot | en.wiktionary (Rohtext) | Noun: {{de-noun|n,(e)s|dim=^chen}} |
| Milch | en.wiktionary (Rohtext) | Noun: {{de-noun|f,en:e}} |
| Käse | en.wiktionary (Rohtext) | Noun: {{de-noun|m,,-}} |
| Auge | en.wiktionary (Rohtext) | Noun: {{de-noun|n|dim=^elchen,^lein,^elein}} |
| Tag | en.wiktionary (Rohtext) | Noun: {{de-noun|m,(e)s|dim=^chen|dim2=^lein}} |
| Buch | en.wiktionary (Rohtext) | Noun: {{de-noun|n,(e)s,^er|dim=^lein,^elchen}} |
| Auto | en.wiktionary (Rohtext) | Noun: {{de-noun|n,,s}} |
| Kunde | en.wiktionary (Rohtext) | Noun: {{de-noun|m.weak|f=in}} |
| Wurst | en.wiktionary (Rohtext) | Noun: {{de-noun|f,^e|dim=^chen,^lein,^erl,^el}} |
| Obst | en.wiktionary (Rohtext) | Noun: {{de-noun|n,(e)s.sg}} |
| Flasche | en.wiktionary (Rohtext) | Noun: {{de-noun|f|dim=^chen,^lein,erl,Flaschi,Fläschle}} |
| Topfen | en.wiktionary (Rohtext) | Noun: {{de-noun|m.sg}} |
| Marille | en.wiktionary (Rohtext) | Noun: {{de-noun|f}} |
| Kren | en.wiktionary (Rohtext) | Noun: {{de-noun|m,(e)s.sg}} |
| Name | en.wiktionary (Rohtext) | Noun: {{de-noun|m,ns.weak}}  |
| Ende | en.wiktionary (Rohtext) | Noun: {{de-noun|n|dim=chen}}  |
| Apfel | en.wiktionary (Rohtext) | Noun: {{de-noun|m,,^|dim=^chen,^ein,Äpflein,Apferl}}  |
| Kundin | en.wiktionary (Rohtext) | Noun: {{de-noun|f}}  |
| Kühlschrank | en.wiktionary (Rohtext) | Noun: {{de-noun|m,(e)s,^e}}  |
| Tasche | en.wiktionary (Rohtext) | Noun: {{de-noun|f|dim=^chen,^lein,^el,l,erl}}  |
| Zettel | en.wiktionary (Rohtext) | Noun: {{de-noun|m|dim=chen,Zetterl}} Noun: {{de-noun|m}}  |
| Supermarkt | en.wiktionary (Rohtext) | Noun: {{de-noun|m,(e)s,^e}}  |
| Cent | en.wiktionary (Rohtext) | Noun: {{de-noun|m,,(s)}}  |
| Euro | en.wiktionary (Rohtext) | Noun: {{de-noun|m,(s),(s)}} Noun: {{de-noun|f.sg}}  |
| Brötchen | en.wiktionary (Rohtext) | Noun: {{de-noun|n}}  |
| Tomate | en.wiktionary (Rohtext) | Noun: {{de-noun|f}}  |
| Blumenkohl | en.wiktionary (Rohtext) | Noun: {{de-noun|m,(e)s}}  |
| Samstag | en.wiktionary (Rohtext) | Noun: {{de-noun|m,(e)s}}  |
| Butter | en.wiktionary (Rohtext) | Noun: {{de-noun|f.sg}} Noun: {{de-noun|m[dialectal].sg}}  |
| Fenster | en.wiktionary (Rohtext) | Noun: {{de-noun|n|dim=chen,lein,l[dialectal]}}  |
| Kartoffel | en.wiktionary (Rohtext) | Noun: {{de-noun|f|dim=^chen}}  |
| Tüte | en.wiktionary (Rohtext) | Noun: {{de-noun|f|dim=chen,erl}}  |
| Kasse | en.wiktionary (Rohtext) | Noun: {{de-noun|f}}  |
| Paradeiser, Erdapfel, Karfiol, Semmel, Sackerl, Kassa | duden.de | Vermerk „österreichisch“ bei allen sechs |
| Kassierin | duden.de | „österreichisch, schweizerisch“ (= Kassiererin) |
| Marktstand | duden.de | Substantiv, maskulin |
| brauchen | en.wiktionary `{{de-verb|brauchen<brauchte,gebraucht,…>}}` | brauchte · hat gebraucht |
| nehmen (nur geprüft, nicht verwendet) | en.wiktionary + duden.de | nahm · genommen |
| kosten | en.wiktionary `{{de-verb}}` (regelmäßig) | kostete · hat gekostet |
| „aus sein“ = verbraucht/zu Ende („Die Semmeln sind aus.“) | duden.de `aus` (Adverb): „vorbei, zu Ende“ | ✓ |
| Genus-Signale (-ung/-heit/-keit/-schaft/-ion/-tät → die; -chen → das; Wochentage/Monate/Jahreszeiten → der) | Beispiele einzeln in Wiktionary geprüft (Tabelle oben) | ✓ für alle Beispiele; die Regeln selbst stammen aus dem Plan (D-1012-11) |
| Ausnahmen der, das bei -e: der Käse, der Name, der Kunde, das Ende, das Auge; der Gedanke, die Gemeinde, die Geschichte; der Moment; die Erlaubnis | Wiktionary (oben) | ✓ (Moment auch neutrum = „Faktor“, im Mc erklärt als „a short time“) |
| Plural-Sonderformen Museen, Zentren, Kassen, Würste, Sackerl/Sackerln, Kilo/Kilos | Wiktionary (oben) | ✓ |

**Ohne Quelle (eigenes Wissen, klein gehalten):** „Was darf es sein?“, „Sonst noch etwas?“, „Das macht dann …“ (Verkaufsfloskeln); „am Markt“ als österreichische Form von „auf dem Markt“; -erl = österreichische Verkleinerung, immer *das* (nur an *das Sackerl* belegt); Englisch der Karten und Erklärungen.

## 2. GLOSS_EXTRA-Vorschläge
Mit diesen Einträgen meldet die Wortprüfung keinen Hinweis mehr (lokal getestet, siehe 4). Einzufügen in `GLOSS_EXTRA` von `js/inhalte.js`:
```js
  "das": {de: "the (neuter); that, this", note: "Artikel; auch: Das ist … = That is …"},
  "kein": {de: "no, not a", note: "kein Karfiol / keine Semmel / kein Ei / keine Eier"},
  "keine": {de: "no, not a (feminine / plural)", base: "kein"},
  "markt": {de: "market", note: "der Markt, die Märkte"},
  "märkte": {de: "markets", base: "Markt", note: "Plural"},
  "stände": {de: "stalls", base: "Stand", note: "Plural von der Stand"},
  "einkaufsliste": {de: "shopping list", note: "die Einkaufsliste"},
  "paradeiser": {de: "tomato(es) (Austria)", note: "der Paradeiser, die Paradeiser"},
  "erdapfel": {de: "potato (Austria)", note: "der Erdapfel, die Erdäpfel"},
  "erdäpfel": {de: "potatoes (Austria)", base: "Erdapfel", note: "Plural"},
  "karfiol": {de: "cauliflower (Austria)", note: "der Karfiol"},
  "zwiebel": {de: "onion", note: "die Zwiebel, die Zwiebeln"},
  "zwiebeln": {de: "onions", base: "Zwiebel", note: "Plural"},
  "semmel": {de: "bread roll (Austria)", note: "die Semmel, die Semmeln"},
  "semmeln": {de: "bread rolls", base: "Semmel", note: "Plural"},
  "ei": {de: "egg", note: "das Ei, die Eier"},
  "eier": {de: "eggs", base: "Ei", note: "Plural"},
  "sackerl": {de: "bag (Austria)", note: "das Sackerl, die Sackerl(n)"},
  "kassa": {de: "checkout, till (Austria)", note: "die Kassa, die Kassen"},
  "packung": {de: "packet", note: "die Packung, die Packungen"},
  "packungen": {de: "packets", base: "Packung", note: "Plural"},
  "brauche": {de: "need", base: "brauchen", note: "ich-Form"},
  "braucht": {de: "needs", base: "brauchen", note: "er/sie-Form"},
  "brauchte": {de: "needed", base: "brauchen", note: "Präteritum"},
  "gebraucht": {de: "needed", base: "brauchen", note: "Partizip II"},
  "kostet": {de: "costs", base: "kosten", note: "er/sie/es-Form"},
  "kostete": {de: "cost", base: "kosten", note: "Präteritum"},
  "gekostet": {de: "cost", base: "kosten", note: "Partizip II"},
  "kaufe": {de: "buy", base: "kaufen", note: "ich-Form"},
  "kauft": {de: "buys", base: "kaufen", note: "er/sie-Form"},
  "gekauft": {de: "bought", base: "kaufen", note: "Partizip II"},
  "gibt": {de: "gives", base: "geben", note: "es gibt = there is / there are"},
  "darf": {de: "may, is allowed to", base: "dürfen", note: "Was darf es sein? = What would you like? (in a shop)"},
  "macht": {de: "makes, does", base: "machen", note: "Das macht 12 Euro. = That comes to 12 euros."},
  "hätte": {de: "would have", base: "haben", note: "Ich hätte gern … = I would like …"},
  "kilo": {de: "kilo", note: "das Kilo; zwei Kilo"},
  "euro": {de: "euro", note: "der Euro"},
  "cent": {de: "cent", note: "der Cent"},
  "gemüse": {de: "vegetables", note: "das Gemüse"},
  "milch": {de: "milk", note: "die Milch"},
  "brot": {de: "bread", note: "das Brot"},
  "tasche": {de: "bag", note: "die Tasche"},
  "zettel": {de: "note, slip of paper", note: "der Zettel"},
  "kühlschrank": {de: "fridge", note: "der Kühlschrank"},
  "supermarkt": {de: "supermarket", note: "der Supermarkt"},
  "marktstand": {de: "market stall", note: "der Marktstand"},
  "verkäufer": {de: "salesman, seller", note: "der Verkäufer"},
  "verkäuferin": {de: "saleswoman, seller", note: "die Verkäuferin"},
  "kassierin": {de: "cashier (woman, Austria)", note: "die Kassierin"},
  "zeitung": {de: "newspaper", note: "die Zeitung"},
  "information": {de: "information", note: "die Information"},
  "ergebnis": {de: "result", note: "das Ergebnis"},
  "freundschaft": {de: "friendship", note: "die Freundschaft"},
  "möglichkeit": {de: "possibility", note: "die Möglichkeit"},
  "gemeinde": {de: "municipality", note: "die Gemeinde"},
  "museum": {de: "museum", note: "das Museum, die Museen"},
  "moment": {de: "moment", note: "der Moment"},
  "mädchen": {de: "girl", note: "das Mädchen"},
  "montag": {de: "Monday", note: "der Montag"},
  "samstag": {de: "Saturday", note: "der Samstag"},
  "jänner": {de: "January (Austria)", note: "der Jänner"},
  "winter": {de: "winter", note: "der Winter"},
  "auto": {de: "car", note: "das Auto, die Autos"},
  "tomaten": {de: "tomatoes (Germany)", note: "die Tomate; Austria: Paradeiser"},
  "blumenkohl": {de: "cauliflower (Germany)", note: "der Blumenkohl; Austria: Karfiol"},
  "brötchen": {de: "bread roll(s) (Germany)", note: "das Brötchen; Austria: Semmel"},
  "frisch": {de: "fresh"},
  "frische": {de: "fresh", base: "frisch"},
  "billig": {de: "cheap"},
  "teuer": {de: "expensive"},
  "wichtig": {de: "important"},
  "groß": {de: "big"},
  "anstrengend": {de: "tiring, exhausting"},
  "oft": {de: "often"},
  "viel": {de: "much"},
  "viele": {de: "many", base: "viel"},
  "mehr": {de: "more", note: "kein … mehr = no more …"},
  "sechs": {de: "six"},
  "drei": {de: "three"},
  "hier": {de: "here"},
  "wo": {de: "where"},
  "wie": {de: "how", note: "Wie viel …? = How much …?"},
  "von": {de: "from, of"},
  "bei": {de: "at, near, with"},
  "oder": {de: "or"},
  "auch": {de: "also, too"},
  "schon": {de: "already"},
  "dann": {de: "then"},
  "gleich": {de: "right away, just"},
  "vorne": {de: "at the front", note: "da vorne = over there at the front"},
  "ganz": {de: "quite, completely", note: "ganz frisch = really fresh"},
  "etwas": {de: "something", note: "Sonst noch etwas? = Anything else?"},
  "sonst": {de: "else, otherwise"},
  "dabei": {de: "with (one)", note: "etwas dabeihaben = to have sth with you"},
  "alles": {de: "everything, all"},
  "bitte": {de: "please"},
  "danke": {de: "thank you"},
  "schade": {de: "what a pity"},
  "okay": {de: "okay"},
  "liebe": {de: "dear (in a letter)", note: "Liebe Aurora!"},
  "entschuldigung": {de: "excuse me, sorry", note: "die Entschuldigung"},
  "entschuldigen": {de: "to excuse", note: "Entschuldigen Sie … = Excuse me … (polite)"},
  "hause": {de: "home", note: "zu Hause = at home, nach Hause = (to) home"},
  "er": {de: "he"},
```
**Achtung, Schlüssel-Kollision:** `stand` steht schon in `GLOSS_EXTRA` (Präteritum von *stehen*). Das Nomen *der Stand* (Karte d04-1) bekommt deshalb keinen eigenen Eintrag. Vorschlag: den bestehenden Eintrag erweitern, z. B. `"stand": {de: "stood / stall", note: "stand = Präteritum von stehen; der Stand, die Stände = (Markt-)Stand"}` (S-1012-103).

## 3. req
`["d01","d02"]` wie im Plan. d04 verwendet aus d01 Perfekt (Übungen 6, 9, 39) und aus d02 weil/deshalb (Übungen 41, 42). Akkusativ (d05) kommt bewusst nicht vor: maskuline Nomen nur als Subjekt oder nach *sein*; *brauchen* nur mit Plural, Feminin oder Neutrum (gleich im Nominativ und Akkusativ).

## 4. Ergebnis `node tools/pruefen.mjs`
Lokale Kopie von deutsch-trainer d99d0e2, d04 hinten angehängt (nicht gepusht):
- ohne GLOSS_EXTRA-Vorschläge: „Alles in Ordnung · 1 Hinweis“ – Wortprüfung: brauchte, gebraucht, gekostet, das, kein, wo, frisch, bitte, danke, alles, entschuldigung, gibt, schade, paradeiser.
- mit den Vorschlägen (nur zum Testen in `js/inhalte.js` eingetragen): **„Alles in Ordnung · 72 Prüfungen bestanden“, kein Hinweis.**

## 5. Prüfliste 1–16
| # | Ergebnis |
|---|---|
| 1 | ✓ Formen/Genus/Plural mit Wiktionary bzw. Duden (Abschnitt 1); „ohne Quelle“ dort aufgeführt |
| 2 | ✓ `h` nennt nur, was gesucht ist („bestimmter Artikel (Nominativ)“, „Plural – nur das Nomen“), keine Form |
| 3 | ✓ mit GLOSS_EXTRA-Vorschlägen keine Wortprüfungs-Hinweise; großgeschriebene Nomen zusätzlich von Hand geprüft (siehe Befund S-1012-102) |
| 4 | ✓ keine Karte aus d01–d03 doppelt (automatischer Hinweis „Prüfliste 6“ ohne Fund) |
| 5 | ✓ Varianten in `a`: Paradeiser/Tomaten, Karfiol/Blumenkohl, Semmeln/Brötchen, gern/gerne, mit/ohne „Und“ |
| 6 | ✓ Theorie-Tabellen höchstens 3 Spalten, Übungstabellen je eine Lückenspalte |
| 7 | ✓ Großschreibung der Nomen in allen Lösungen; Satzanfang in gap 10–14 groß (Die/Das/Der) |
| 8 | ✓ Umlaute exakt (Erdäpfel, Märkte, Stände) |
| 9 | ✓ ord 40–42 mit allen Stellungen (Vorfeld, vorangestellter weil-Satz) |
| 10 | ✓ Alternativen mit `|` nur als ganze Zeilen |
| 11 | ✓ Klammern auf der englischen Seite nennen nur das bundesdeutsche Wort, nicht die Lösung |
| 12 | ✓ neues Thema, keine bestehenden Indizes berührt |
| 13 | – nicht betroffen |
| 14 | ✓ Plural, Genus, ein/kein im Nominativ = ÖIF A1 (Plan D-1012-11) |
| 15 | ✓ 56 Übungen, 8 Formate, je 3 les/sch/dlg; Schwerpunkt tr/gap/ord/sch/dlg |
| 16 | ✓ brauchen, kosten mit „(Präteritum · Perfekt · Futur)“; Verbtabelle in der Theorie; Präteritum-/Perfekt-Tabelle (5, 6), Futur-Lücken (7, 8) |

## 6. Offene Fragen und Befunde (S-Codes)
- **S-1012-101 (Kartenformat Nomen mit Plural):** Die Anleitung verlangt Artikel und Plural auf der Karte. Bei Englisch → Deutsch vergleicht die App aber mit der ganzen Karte. Aurora müsste also „der Markt, die Märkte“ tippen; sonst entscheidet Coach. Für d04 habe ich die ausgeschriebene Form „der Markt, die Märkte“ gewählt, weil der Plural hier das Thema ist; „-, ¨-e“ wäre beim Tippen unbrauchbar. Stand 12.10.: von Matthias mit den übrigen Empfehlungen freigegeben, gilt auch für d05–d09.
- **S-1012-102 (Befund Engine, an „App-Engine: Funktionen“):** Zwei Lücken bei deutschen Nomen.
  - **Antippen:** Das Wörterbuch (`buildDict`) findet Nomen-Karten mit Artikel („das Ei, die Eier“) nicht als Einzelwort. Darum braucht jedes Nomen zusätzlich einen `GLOSS_EXTRA`-Eintrag (das gilt schon für d01–d03: wochenende, ausflug …).
  - **Wortprüfung:** Großgeschriebene Wörter mitten im Satz werden als Namen übersprungen. Im Deutschen sind das alle Nomen.
  - Vorschlag: Bei `APP.target` Deutsch den Artikel und den Plural nach „, die“ abtrennen und beide Formen eintragen. Großschreibung mitten im Satz nur bei Wörtern als Namen werten, die in keiner Wortliste stehen.
- **S-1012-103:** GLOSS-Kollision `stand` (siehe 2). Stand 12.10.: Empfehlung freigegeben – bestehenden Eintrag erweitern, `base` bleibt: `"stand": {de: "stood / stall", base: "stehen", note: "Präteritum von stehen (stand auf → aufstehen); auch Nomen: der Stand, die Stände = (market) stall"}`.
- **S-1012-102** ist seit 12.10. als Auftrag beim Chat „App-Engine: Funktionen“; bis zur Umsetzung bekommt jedes Nomen einen `GLOSS_EXTRA`-Eintrag.
