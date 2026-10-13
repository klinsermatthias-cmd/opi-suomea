# Deutsch-Trainer: Technik für Deutsch (Bewertung, KI-Aufträge, Hören, Bericht, Oberfläche, Prüfliste)

Teil von S-1013-4 · nur gelesen, getestet in eigenen Skripten · Stand der Engine: `main-wt` 6de8b50 (= Engine-Dateien in `/home/user/deutsch-trainer`, Byte für Byte gleich), Inhalte: `dtw` (d01–d09).
Skripte und Rohausgaben: `berichte/1013/f-technik-deutsch-skripte/` (`harness.js` lädt `norm`/`loose` aus `daten.js`, `localCheck`/`caseKey`/`caseFree`/`typoOf`/`exStrict`/`gapCut` usw. aus `uebungen.js`/`formate.js` und `SPRACHEN.de` aus `sprache.js` per `vm`; `test.js` → `tabelle.md`, `bulk.js` → `bulk.out`).

## Kurzfazit
1. Die lokale Bewertung ist für Deutsch meist fair (Satzzeichen, Leerzeichen, ß/ss, Satzanfang, „Sie“, Nomen klein → richtig erkannt), hat aber **drei harte Fehlurteile ohne KI und ohne Einspruch**: ganze Sätze und Fragewörter in **Tabellen** am Satzanfang klein (21 Zellen), **englische Antworten** mit „i“/„monday“ klein (9 von 27 Übersetzungen, bekannt S-1012-122, bestätigt) und **Groß-/Klein-Alternativen in `a`** („welcher|Welcher“), die nie greifen.
2. **Nomenkarten Englisch → Deutsch** (48 von 127 Karten, d04–d09) verlangen lokal „der Markt, die Märkte“ vollständig; „der Markt“ geht immer an die KI (offline falsch). Im Diktat (ohne KI) sind „die Kopfschmerzen (Pl.)“ und „die Öffis (Pl.)“ unlösbar.
3. KI-Aufträge: österreichische Varianten, Lücken-Kontext, ß-Strenge sind sauber übergeben; keine finnischen Reste in Texten, die an Gemini gehen. Aber die deutsche Groß-/Klein-Regel geht auch bei **englischen** Antworten mit, „dir fi“ wird nicht erklärt, und die Regel „NUR Wörter aus der WORTLISTE“ ist für eine B1-Lernerin sehr eng.
4. Vorlesen: angefordert `de-AT`, sonst jede deutsche Stimme; ohne Stimme Hinweis + Hörübungen ausgegraut – gut. Hörsätze passen (3–11 Wörter, keine Zahlen/Abkürzungen).
5. Bericht enthält alle Abschnitte aus der `CLAUDE.md` des Deutsch-Trainers, nichts Geheimes (kein Schlüssel, keine E-Mail). Prüfliste: 3 Zeilen werden geprüft, weitere 10 ließen sich (teilweise) automatisieren; die Hinweise heißen „Prüfliste 6/8/9“ nach der **Opi-suomea-Nummerierung**, in der Deutsch-Liste sind das die Zeilen 4/6/–.

## Befunde

| Befund | Stelle | Beleg/Quelle | Schwere | Vorschlag |
|---|---|---|---|---|
| Ganze Sätze in Tabellenzellen: erster Buchstabe klein → „FALSCH (Groß/klein)“, ohne KI, ohne „Nur vertippt“ | `uebungen.js` `caseFree()` (tab nicht frei), betrifft d02 ex[1] (4 Zellen), d06 ex[4] (6), d08 ex[3] (5) | Test: „heute bleibe ich zu Hause.“, „nimm die Tablette!“, „ich gebe ihm das Paket.“ → alle FALSCH (`bulk.out`); Regel der App selbst: „nur der erste Buchstabe am Satzanfang ist egal“ (`sprache.js` `caseRule`) | hoch | `caseFree`: in `tab`/`dlg`-Zellen den ersten Buchstaben freigeben, wenn die Musterlösung auf `.`/`!`/`?` endet (Satz) |
| Fragewörter am Satzanfang in Tabelle: „wem“ statt „Wem“ → FALSCH | d05 ex[6] (6 Zellen, Spalte „Fragewort“) | Test `bulk.out`; Fragewörter sind keine Nomen – großgeschrieben nur, weil sie hier den Satz beginnen (ohne Quelle, Grundregel) | hoch | wie oben, oder in der Tabelle klein schreiben – dann greift aber der nächste Befund nicht; besser Engine |
| Alternativen, die sich nur in Groß/klein unterscheiden, sind wirkungslos: `localCheck` nimmt den **ersten** norm-Treffer und vergleicht dann die Schreibung | `uebungen.js` `localCheck()` Z. 571; d05 ex[5] „[welcher\|Welcher]“, „[welchen\|Welchen]“, „[welchem\|Welchem]“ | Test: `localCheck("Welcher", ["welcher","Welcher"])` → caseOnly FALSCH | mittel | Treffer zuerst unter den Alternativen mit passender Schreibung suchen (`acc.find(a => norm(a)===u && caseKey(a,ff)===caseKey(user,ff))`, sonst wie bisher); in `tools/pruefen.mjs` alle Alternativen jeder Zelle durchspielen, nicht nur die erste |
| Englische Antworten (dir "fi"): „i“, „monday“ klein → FALSCH ohne KI, ohne Einspruch | `caseKey`/`localCheck` mit `SP.caseMatters` gilt auch für die Basissprache | 9 von 27 tr/fi-Übungen (d01 ex[17], ex[53], d02 ex[15], ex[46] …, `bulk.out`); bekannt S-1012-122 – **bestätigt** | hoch | Groß/klein nur prüfen, wenn die Antwort in der Lernsprache ist (`ex.dir !== "fi"`, Hören „Sätze“, Karten fi) |
| KI-Auftrag sagt auch bei englischen Antworten „Groß-/Kleinschreibung zählt: Nomen … großgeschrieben“ | `ki.js` `JUDGE_RULES` → `SP.caseRule` in `aiJudge` für tr/fi | Text gelesen | mittel | in `aiJudge` für `dir:"fi"` die Basis-Regel („Groß-/Kleinschreibung und Satzzeichen zählen nicht“) statt `SP.caseRule`; ebenso `SP.judge`/`SP.tolerance` (Artikel, Subjektpronomen) nur für die Lernsprache |
| Kurzformen: „I am / What is / I will“ statt „I'm / What's / I'll“ → nicht lokal erkannt (Apostroph wird entfernt: „im“ ≠ „i am“) | `norm()`; d02 ex[48], d08 ex[46], d07 ex[44] | Test → „→ KI (offline falsch)“ | niedrig | für Basissprache Englisch Kurzformen vor dem Vergleich auflösen (’m→ am, ’s→ is, ’ll→ will, ’ve→ have, n’t→ not) |
| Gedankenstrich „–“ wird nicht entfernt: „-“ oder Weglassen → nicht lokal richtig | `norm()` Zeichenklasse; d07 ex[45] (auch ex[41] als Hörsatz) | Test → „→ KI“ | niedrig | freistehende Striche (` – `, ` - `, `—`) in `norm`/`caseKey` wie Satzzeichen behandeln (Bindestrich im Wort wie „U-Bahn“ bleibt) |
| Nomenkarten Englisch → Deutsch verlangen Singular **und** Plural: „der Markt“ allein → KI, offline falsch; jede Wiederholung ein KI-Aufruf, bis Coach es als Alternative merkt (dann auch Eintrag in „VOKABEL-ANTWORTEN ZUR PRÜFUNG“) | `vokabeln.js` `flipCard()` (acc = `[w[0]]`); 48 von 127 Karten d04–d09 im Format „der X, die Y“ | Test: „der Markt“, „die U-Bahn“ → „→ KI (offline: falsch)“ | mittel | Entscheidung nötig: entweder lokal auch die Singularform (Teil vor dem ersten Komma) als richtig zählen und den Plural nur zeigen – oder auf der Vorderseite sagen „mit Artikel und Plural“ |
| Diktat (ohne KI): „die Kopfschmerzen (Pl.)“, „die Öffis (Pl.)“ – der Zusatz „(Pl.)“ muss mitgetippt werden („pl“), das hört niemand → immer falsch; dasselbe lokal auf der Karte Englisch → Deutsch | `vokabeln.js` `checkListen()`, `speak()` liest Klammern mit vor | Test: `localCheck("die Kopfschmerzen", ["die Kopfschmerzen (Pl.)"])` → falsch | mittel | Klammern aus `w[0]` vor Vergleich und Vorlesen entfernen (wie schon auf der englischen Seite) |
| ae/oe/ue statt Umlaut („schoen“, „Gehoert“, „Erdaepfel“) → KI, offline falsch | `SPRACHEN.de.loose` nur `[["ß","ss"]]` | Test; Ersatzschreibung ae/oe/ue ist im Deutschen üblich: en.wiktionary „ä“, Hinweis „(not ae, as in German)“ – https://en.wiktionary.org/wiki/%C3%A4 | niedrig | `loose` um `["ä","ae"],["ö","oe"],["ü","ue"]` ergänzen (beidseitig ersetzt, daher keine Verwechslung schon/schön; E-1008-3 bleibt: a statt ä weiter falsch) |
| „zu Hause/zuhause“: nur 3 von 13 Lösungen haben beide Schreibungen; „…bleibe ich heute zuhause“ in d02 ex[13] und d03 ex[18] → KI | d02 ex[13] (2 Alternativen), d03 ex[18] (3) | „zuhause“ = alternative Schreibung von „zu Hause“: https://de.wiktionary.org/w/index.php?title=zuhause&action=raw | niedrig | Engine: `SP.de`-Gleichsetzung „zuhause“ = „zu hause“ vor dem Vergleich (dann entfallen die Zwillinge in `a`) |
| Klammerteile der englischen Seite zählen als eigene Antwort: „Austria“ ist eine gültige Antwort für „die E-Card“; „machte · hat gemacht · wird machen“ als Ganzes ebenso | `flipCard()` acc aus `(…)`-Inhalten | Test: `localCheck("Austria", …E-Card…)` → richtig; 119 solcher Teile (`bulk.out`) | niedrig | nur Klammern mit „auch:“ als Alternative nehmen, nicht „Austria; Germany: …“ und nicht die Zeitformen-Klammer |
| Hinweis „Fast perfekt – achte auf ß“ auch, wenn zu viel ß getippt wurde („daß“) | `SP.de.charNote` | – (ohne Quelle) | niedrig | „achte auf ß/ss“ |
| Einstufungstest bewertet ß/ss streng (lokal `gapOk` ohne `loose`, KI-Auftrag „Sonderzeichen … zählen“), Übungen dagegen „fast richtig“ | `einstufung.js` `gapOk`, `ptAIGrade` | Text gelesen | niedrig | einheitlich: ß/ss auch dort „fast richtig“ (oder bewusst so lassen und in `docs/engine.md` vermerken) |
| Dialog-Prüfung: „why“ ohne Sprache – der Auftrag ist deutsch, die Begründung kommt evtl. deutsch statt englisch | `formate.js` `dlgJudge` | Text gelesen | niedrig | „why“: „… auf ${APP.explain}“ |
| „Neue Übungen von Coach“: `dir "fi"` wird nicht erklärt (nur dir "de"), Sprache für `x`/`h` nicht genannt | `ki.js` `aiGenerate` | Text gelesen; im Deutsch-Trainer sind `x` englisch, `h` deutsch (d04) | niedrig | „dir "fi" = ${APP.target.name}→${APP.base.name}“; „Erklärung x auf ${APP.explain}“ |
| „Verwende NUR Wörter aus der WORTLISTE“ (Übungen, Schreiben, Rollenspiel „sehr einfach“) – für B1 mit ~15 Themenwörtern sehr eng, Übungen werden künstlich | `ki-ueben.js` `WORD_ONLY`/`WORD_RULE`, `ki.js` `aiGenerate` | Text gelesen; Persona sagt B1 → B2 (`js/app.js`) | mittel | Einstellung je App (z. B. `APP.wordRule`): Deutsch-Trainer „Grundwortschatz bis ${placement.level} erlaubt, neue Wörter in "new" angeben“ |
| Toleranz „Ein fehlendes Subjektpronomen ist im Deutschen falsch“ ohne Ausnahme Imperativ (d08: „Nimm …!“) | `SPRACHEN.de.tolerance` | – (ohne Quelle, Grundregel) | niedrig | „… falsch (außer im Imperativ)“ |
| Vorlesen: ohne de-AT nimmt die App die **erste** deutsche Stimme (kann de-CH sein) | `lernen.js` `pickVoice()` | Code gelesen; welche Stimmen Geräte haben: ohne Quelle | niedrig | Reihenfolge: gewählte → de-AT → de-DE → andere de |
| Theorie-Vorlesen entfernt Bindestriche („E-Card“ → „ECard“, „U-Bahn“ → „UBahn“) | `lernen.js` `sayClean()` | Code gelesen; Aussprache-Wirkung ohne Quelle | niedrig | nur Bindestriche an Zeilenumbruch-Trennstellen entfernen, nicht bei Großbuchstabe davor |
| Begrüßung „Gute Nacht“ ab 22 Uhr – das ist ein Abschieds-/Zubettgehgruß, kein Gruß beim Öffnen | `js/app.js` (Deutsch-Trainer) `greeting()` | de.wiktionary „gute Nacht“: „Gruß, wenn jemand zu Bett geht … Verabschiedung am Tagesende“ – https://de.wiktionary.org/w/index.php?title=gute_Nacht&action=raw | niedrig | ab 22 Uhr „Guten Abend“ (oder „Noch so spät?“) |
| App-Name „Deutsch Trainer“ (Leerzeichen) – überall sonst „Deutsch-Trainer“ | `js/app.js` `name`, `manifest.webmanifest` | Duden D 21/22: Zusammensetzungen in einem Wort, Bindestrich zur Gliederung – https://www.duden.de/sprachwissen/rechtschreibregeln/bindestrich | niedrig | „Deutsch-Trainer“ (Achtung: `id` nie ändern, nur `name`) |
| Tab heißt „Wörter“, Seite darin „Vokabeln“ | `js/app.js` `tabs`, Engine `vokabeln.js` Z. 525, `ansichten.js` Z. 237 | Code gelesen | niedrig | Überschrift aus `APP.tabs[2][0]` nehmen |
| Hinweise „Prüfliste 6/8/9“ verweisen auf die Opi-suomea-Nummern; in der Deutsch-Liste sind das Zeile 4 (doppelte Karten) und 6 (Tabellen), Regelfragen haben dort keine Zeile; Zeilen 4 und 6 stehen noch als „von Hand“/„teilweise“ | `tools/pruefen/statisch.mjs` Z. 104–122; `lektionen/pruefliste.md` | Vergleich beider Listen | niedrig | Hinweistext ohne Nummer („doppelte Karten“, …) oder je App die eigene Nummer; Deutsch-Liste Spalte „Automatischer Test“ aktualisieren und Regelfragen als eigene Zeile aufnehmen |

### Testtabelle Bewertung (Auszug aus `tabelle.md`, echte Übungen aus `dtw`)
„→ KI“ = lokal nicht erkannt, Coach entscheidet (offline: Lernende entscheidet selbst, bei Karten/Diktat falsch). **Fett** = unfair.

| Fall | Übung | Eingabe | erwartet | App-Urteil |
|---|---|---|---|---|
| Nomen klein | d04 ex[33] tr | Die paradeiser sind heute sehr schön. | falsch | FALSCH (Groß/klein) ✓ |
| Satzanfang klein | d04 ex[33] tr | die Paradeiser sind heute sehr schön | richtig | richtig ✓ |
| „Sie“ klein | d06 ex[39] tr | Gehört dieser Schlüssel ihnen? | falsch | FALSCH (Groß/klein) ✓ |
| Lücke am Satzanfang | d03 ex[7] gap | während | richtig | richtig ✓ |
| **Englisch klein** | d02 ex[15] tr/fi | unfortunately i have to postpone the appointment | richtig | **FALSCH (Groß/klein, ohne KI)** |
| **Englisch klein** | d02 ex[46] tr/fi | I have been on sick leave since monday. | richtig | **FALSCH (Groß/klein, ohne KI)** |
| ß→ss | d05 ex[41] tr | Ich nehme diesen Blumenstrauss. | fast richtig | richtig („Fast perfekt“) ✓ |
| ae/oe/ue | d06 ex[39] tr | Gehoert dieser Schluessel Ihnen? | fast richtig | → KI |
| ae/oe/ue | d04 ex[18] gap | Erdaepfel | fast richtig | → KI |
| Umlaut fehlt | d04 ex[33] tr | … sehr schon. | falsch | → KI ✓ (gewollt, E-1008-3) |
| Umlaut fehlt | d06 ex[20] gap | gefallt | falsch | → KI ✓ |
| ohne Komma/Punkt | d02 ex[13] tr | Ich bleibe heute zu Hause weil ich Fieber habe | richtig | richtig ✓ |
| Punkt statt ? | d06 ex[39] tr | Gehört dieser Schlüssel Ihnen. | richtig | richtig ✓ |
| Leerzeichen | d02 ex[13] tr | Ich bleibe heute zu Hause ,  weil … . | richtig | richtig ✓ |
| Bindestrich statt – | d07 ex[45] tr/fi | Do you have an umbrella? - No, I don't have one. | richtig | → KI |
| zuhause | d01 ex[52] tr | Ich bin zuhause geblieben … | richtig | richtig ✓ |
| zuhause | d02 ex[13] tr | Weil ich Fieber habe, bleibe ich heute zuhause. | richtig | → KI |
| Apostroph ’ | d02 ex[46] tr/fi | I’ve been on sick leave since Monday. | richtig | richtig ✓ |
| I am = I'm | d02 ex[48] tr/fi | Nevertheless I am going to work today. | richtig | → KI |
| trennbar, ohne Punkt | d08 ex[43] tr | Nehmen Sie dreimal täglich eine Tablette ein | richtig | richtig ✓ |
| trennbar falsch | d01 ex[52] tr | … habe ein gekauft. | falsch | → KI ✓ |
| Tippfehler (Nachbartaste) | d05 ex[41] tr | … diesen Blunenstrauß. | „Nur vertippt?“ | „Nur vertippt?“ ✓ |
| Tippfehler am Wortende | d06 ex[39] tr | … Ihenn? | KI (Endung) | → KI ✓ (gewollt) |
| AT/DE-Variante | d04 ex[33] tr | Die Tomaten sind heute sehr schön. | richtig | richtig ✓ |
| **Tabelle Satz** | d02 ex[1] tab | heute bleibe ich zu Hause. | richtig | **FALSCH (Groß/klein, ohne KI)** |
| **Tabelle Satz** | d08 ex[3] tab | nimm die Tablette! | richtig | **FALSCH (Groß/klein, ohne KI)** |
| **Tabelle Fragewort** | d05 ex[6] tab | wem | richtig | **FALSCH (Groß/klein, ohne KI)** |
| **Alternative groß** | d05 ex[5] tab „[welcher\|Welcher]“ | Welcher | richtig | **FALSCH (Groß/klein, ohne KI)** |
| Fachwort klein | d09 ex[0] tab | dativ | streitbar (Nomen) | FALSCH (Groß/klein) |
| „Sie“ in Tabelle | d06 ex[1] tab | ihnen | falsch | FALSCH ✓ |
| Karte EN→DE | d04 v[0] | der Markt | richtig? | → KI (offline falsch) |
| Karte EN→DE | d04 v[0] | der Markt die Märkte | richtig | richtig ✓ |
| Karte EN→DE | d04 v[0] | der markt, die märkte | falsch | FALSCH (Groß/klein) ✓ |
| **Diktat** | d08 v[6] | die Kopfschmerzen | richtig | **falsch (kein KI im Diktat)** |
| Karte DE→EN | d01 v[3] | hike | richtig | → KI |
| Karte DE→EN | d08 v[3] | Austria | falsch | **richtig** |

## Geprüft, ohne Befund
- **Engine-Gleichstand:** alle Engine-Dateien in `/home/user/deutsch-trainer/js` = `main-wt/js` (nur `app.js`, `inhalte.js` verschieden, wie vorgesehen).
- **Sprachmodul de:** `loose` nur ß/ss (Umlaute bewusst streng, E-1008-3), `caseMatters`, `strict`-Text für ä/ö/ü/ß, `tolerance` „österreichische und bundesdeutsche Varianten sind beide richtig“ – wird in `aiJudge`, `schJudge`, `dlgJudge`, `vocabJudge` (de-Richtung) und Schreiben (`ki-ueben.js`) mitgegeben. Lücken-Kontext („In die Lücke gehört …“, „Satz mit der Eingabe …“, gleiche Form verlangt) korrekt. Kein Deutsch-Lückentext ist „mitten im Wort“ (keine `exStrict`-Lücke in d01–d09).
- **Keine finnischen Reste in KI-Texten oder Oberfläche** des Deutsch-Trainers: Suche nach Finnisch/Opettaja/Matthias/minä/Stufenwechsel/Vokalharmonie trifft in der Engine nur Kommentare und den `fi`-Eintrag von `SPRACHEN`; `UI`-Vorgaben neutral deutsch („Richtig!“, „Leider falsch.“); `index.html`/`manifest` ohne finnische Texte (`lang="de"`).
- **Persona** englisch, `APP.explain` = Englisch in allen Feedback-Feldern; Richtungskürzel `de→en`/`en→de` (BASE_CODE aus „Englisch“ abgeleitet).
- **Vorlesen:** `u.lang = "de-AT"`, Stimme: gewählte → exakt de-AT → irgendeine `de-*`; ohne deutsche Stimme Toast höchstens 1×/Tag, Installationshilfe in den Einstellungen, Hörübungen ausgegraut. Hörsätze: 105 Sätze, 3–11 Wörter (Ø 6,4), keine Ziffern, keine Abkürzungen; einziger Sonderfall „–“ in d07 ex[41]/[45] (wird als Pause gelesen – ohne Quelle). „Sätze verstehen“ fragt bei Abweichung immer die KI (auch bei Groß/klein).
- **Bericht für Claude** (`verwaltung.js` `buildReport`): enthält EINSTUFUNGSTEST (wenn `features.placement`), KI-PROTOKOLL, KI-ÜBUNGEN ZUR PRÜFUNG, VOKABEL-ANTWORTEN ZUR PRÜFUNG (mit Schlüsselformat für `ki-pruefung.json`, passt zur Prüfung in `statisch.mjs`), AUSRUTSCHER (mit „achte auf ß“), NOCH NICHT GELERNT?, dazu Schwächen, Übungssammlung, App-Fehler, Nutzung. **Nichts Geheimes:** Schlüssel nur im Header der Anfrage (`x-goog-api-key`/`Authorization`), E-Mail nur in der Einstellungsansicht; der Bericht nennt Anbieter/Modell, Geräteanzahl, den Vornamen und Auroras eigene Texte – er ist zum Einfügen im Chat gedacht und darf (laut `CLAUDE.md`) nie committet werden.
- **Oberfläche (`js/app.js`):** Gruß „Servus“ tagsüber, Beispiele „Jänner, Paradeiser, Grüß Gott“, `locale: "de-AT"` (Datum österreichisch), Sonderzeichentasten ä ö ü ß, Platzhalter und Einstufungstext korrekt. Kleine Tab-Untertitel auf Finnisch („Tänään“ …) wirken gewollt (Lernerin ist Finnin) – keine Begründung in den Docs gefunden.

## Prüfliste (`lektionen/pruefliste.md`, 16 Zeilen): was `tools/pruefen.mjs` prüft, was ginge

| # | Zeile | Heute | Vorschlag für automatischen Test (an „App-Engine: Funktionen“) |
|---|---|---|---|
| 1 | Deutsch natürlich, Quelle je Form | von Hand | Hinweis, wenn ein neues/geändertes Thema keine Quellen-Datei hat (z. B. `lektionen/quellen/dNN.md`); kleine Liste bekannter Lehnübersetzungen („ein Foto nehmen“, „Sinn machen“ …) als Warnung |
| 2 | Lücke eindeutig | teilweise (Lücke im Wort braucht `h`) | Warnung für `gap` ohne `h` und ohne „(…)“ im Satz – Probelauf: 0 Treffer in d01–d09, also sofort einsetzbar |
| 3 | Nichts Ungelerntes | ja (Warnung) | – |
| 4 | Keine doppelten Karten | **ja** (läuft als „Prüfliste 6“) – Liste sagt noch „von Hand“ | zusätzlich nur den Singular vergleichen („der Markt“ = „der Markt, die Märkte“) |
| 5 | Alle Varianten in `a` | von Hand | je Alternative Zwilling verlangen bei bekannten Paaren (zu Hause/zuhause, gern/gerne, am/beim …) – Probelauf: d02 ex[13], d03 ex[18]; Österreich/Deutschland-Paare (Paradeiser/Tomate …) nur als Hinweis (Probelauf hatte 1 Fehlalarm: d04 ex[18]) |
| 6 | Tabellen ≤ 3 Spalten | **ja** (läuft als „Prüfliste 8“) | – |
| 7 | Großschreibung in Musterlösungen | von Hand | (a) Nomen aus Wortlisten klein in Lösungen → Warnung (Probelauf: 0); (b) Alternativen, die sich nur in Groß/klein unterscheiden → Warnung bzw. Engine-Fix (d05 ex[5]); (c) **jede Alternative jeder Zelle** im Durchlauf mit klein geschriebenem Satzanfang lösen lassen → findet die 21 Tabellenzellen |
| 8 | Kein ä/a-Spielraum | von Hand | Lösungswörter mit ae/oe/ue/ss melden, wenn dasselbe Wort mit Umlaut/ß in einer Wortliste steht; Zeichen außerhalb des deutschen Alphabets (å …) als Fehler |
| 9 | Satz ordnen | ja (Kärtchen + Nebensatz-Varianten) | – |
| 10 | Alternativen je Lücke (Einstufungstest) | von Hand | alle Kombinationen der Lücken-Alternativen eines `b`-Items ausgeben und ab > 1 Kombination zur Sichtprüfung melden |
| 11 | Klammer-Hinweise verraten nichts | App verdeckt | Warnung, wenn die englische Klammer das deutsche Stichwort (erste 4 Buchstaben) enthält – Probelauf: d04 v[10] „(Germany: Kasse)“ |
| 12 | Nur hinten anhängen | ja | – |
| 13 | Mehrere amtliche Schreibweisen | von Hand | kleine Paarliste (e-card/E-Card …): kommt eine vor, muss die andere in `a`/`s` stehen |
| 14 | Niveau-Abdeckung | von Hand | `lvl` jedes Themas mit der Spalte im Lehrplan (`docs/lehrplan.md`) abgleichen; Abdeckung selbst bleibt von Hand |
| 15 | Genug Übungen | von Hand | voll automatisierbar: ≥ 30 Übungen, ≥ 6 Formate, je `les`/`sch`/`dlg` ≥ 3 – Probelauf: **d05–d09 haben nur 2 `dlg`** |
| 16 | Verbkarten mit Zeitformen | von Hand | englische Seite beginnt mit „to “ → Klammer mit zwei „·“ verlangen, kein Komma in der Klammer – Probelauf: 0 Treffer |

## Nicht prüfbar / ohne Quelle
- Gemini wurde nicht aufgerufen (Auftrag): ob Coach „der Markt“ ohne Plural, ae/oe/ue oder „zuhause“ als richtig wertet, ist nicht getestet.
- Welche Stimmen (de-AT/de-DE/de-CH) Auroras Geräte haben und wie „(Pl.)“, „ECard“ oder „–“ ausgesprochen werden: ohne Quelle (kein Gerät, kein Browser-TTS im Container).
- Duden-Einträge zu „zuhause“ (`/rechtschreibung/zuhause` → 404) und zu Umlaut-Ersatzschreibungen (`/sprachwissen/rechtschreibregeln/umlaute`, Verbindung zurückgesetzt) **nicht geprüft**; stattdessen Wiktionary (siehe oben). Duden „Haus“ zeigt „zu Haus[e]“ (https://www.duden.de/rechtschreibung/Haus), aber keine Aussage zu „zuhause“.
- Fachwörter „Dativ/Akkusativ“ klein in Tabelle d09 ex[0]: formal Nomen (also richtig bewertet) – ob das gewollt streng sein soll, ist eine Entscheidung, keine Quellenfrage.
- „Tab-Untertitel finnisch gewollt“, „Gute Nacht als Begrüßung unpassend“ (außer Wiktionary-Bedeutung), Subjektpronomen-Ausnahme Imperativ: eigenes Wissen.
