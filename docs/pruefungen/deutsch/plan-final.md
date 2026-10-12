# Endgültiger Themenplan Deutsch-Trainer (S-1011-23) – Vorschlag des Simulations-Chats

Eine einzige, widerspruchsfreie Fassung aus: bereinigtem Plan (`schied/plan.md`), Ergänzungen aus Teil 2
(`schied/test-bewertung.md`, Abschnitt „Ergänzungen zum bereinigten Plan“) und Feinschliff S-1011-21 (Präpositionen vor
Perfekt II; d03 erst nach Block A). Umsetzung nur durch den Deutsch-Trainer-Chat mit Matthias' OK (D-Codes).

## Grundsätze
- **A1 → A2 → B1 → B2, mit Rücksicht auf Auroras Schwächen:** zuerst die Lücken auf A1/A2-Niveau (Block A), dann B1
  festigen (Block B), dann B2 (Block C, vorläufig). Innerhalb eines Blocks entscheidet, was worauf aufbaut.
- **Jedes Thema:** Alltagssituation in Österreich + Grammatik-Baustein mit **höchstens 3 neuen Teilregeln** (durch „;“
  getrennt; „Detail“ = keine neue Teilregel), Übersicht des ganzen Systems am Anfang der Theorie, ca. 70 % Übungen zu
  den Schwächen und 30 % Kontrast/Umbau/Mischung, freie Aufgaben ohne vorgegebenen Bauplan. Teststärken (Präsens,
  Komparation, deshalb/trotzdem/obwohl, je … desto, indirekte W-Fragen, Lesen) nur als Kontrast.
- **`req`:** jedes neue Thema mindestens d01, d02 und alle Themen, deren Stoff es braucht (Spalte `req`).
  Nomen-Verb-Verbindungen kommen früh als Karten in passende Situationen (System erst d29).
- **Checkpoint** = Bericht an Claude → Analyse → Neuplanung (Themen, die schon sitzen, werden gestrichen); keine
  neue App-Funktion nötig.
- **d01–d03 bleiben** (nur anhängen/korrigieren, siehe `schied/d01.md` … `d03.md`). d02 bekommt `req ["d01"]`.
  **d03 nach d09, vor d10:** Ist d03 bei Aurora noch gesperrt, `req` auf `["d01","d02","d09"]` setzen (seit/vor und
  Zeitangaben aus d09; d10 braucht d03 für musste ↔ habe … müssen). Der Stoff von d03 ist großteils A1+/A2 (war, hatte,
  konnte, musste, wenn) und eine zentrale Testschwäche (als/wenn/wann) – ihn hinter ganz Block A zu schieben, würde
  schaden (Prüfung `schied/plan-final-pruefung.md` P01). Ist d03 schon frei, sperrt die App es nicht wieder
  (`refreshUnlocks()`).
- Die alten Plan-IDs d04–d06 im Lehrplan des Deutsch-Trainers sind nicht gebaut und werden neu belegt.

## Plan
| ID | Titel | Niveau (ÖIF) | Alltagssituation | Grammatik-Baustein | req | behebt Testschwäche | vorher |
|---|---|---|---|---|---|---|---|
| d01 | Wie war dein Wochenende? – Perfekt | A2 | Montag im Büro | Perfekt mit haben/sein; Partizip II; Satzklammer (gebaut, Korrekturen + Übungen laut `schied/d01.md`) | – | Perfekt mit sein, Partizipien | d01 |
| d02 | Ich kann leider nicht kommen – Wortstellung | A2 | Krankmeldung, Ordination | Satzarten- und Satzklammer-Übersicht (Verb-Erst/-Zweit/-Letzt); Verb am Ende im Nebensatz (dass/weil/ob, auch mit Modalverb und Perfekt); Mittelfeld: Zeit vor Ort, Stellung von „nicht“ (gebaut, Korrekturen + Übungen laut `schied/d02.md`) | d01 | Wortstellung | d02 |
| d03 | Als ich nach Österreich kam – als, wenn, wann | B1 | Erinnerungen | als/wenn/wann (+ wenn = if); Präteritum sein/haben/Modalverben; Plusquamperfekt nur Einstieg (gebaut, laut `schied/d03.md`) | d01, d02, **d09** (nur falls noch gesperrt) | als/wenn/wann, Präteritum Modal | d03 |
| | **Block A – A1/A2-Lücken schließen** | | | | | | |
| d04 | Was brauchen wir vom Markt? – der, die, das und Plural | A1 | Einkaufsliste, Markt und Supermarkt (Paradeiser, Erdäpfel, Karfiol) | Genus-Signale (die: -e meist, -ung, -heit, -keit, -schaft, -ion, -tät; das: Ge-(…-e) meist (aber die Gemeinde, die Geschichte, der Gedanke), -chen, -nis meist, -um/-ment meist; der: Wochentage, Monate, Jahreszeiten, -er bei Personen; ohne Signal lernen: die Uhr, der Monat …); Plural-Typen; ein/kein im Nominativ, Nomen groß (Nominalisierung nur erkennen) | d01, d02 | Genus, Plural, kein, Großschreibung | d04 |
| d05 | Ein Geschenk für die Kollegin – Nominativ, Akkusativ, Dativ | A1/A2 | Geschenk aussuchen und überreichen | Akkusativ (nur Maskulinum ändert sich); Dativ -m/-r/-m/-n + Dativ Plural -n, wer/wen/wem; Gesamttabelle aller Artikelwörter (der-/ein-Muster: dies-, welch-, kein, mein …) – Detail: den/dem Herrn, dem Kollegen (System d18) | d01, d02, d04 | Artikel, kein-/Possessivformen | d05 |
| d06 | Kannst du mir helfen? – Pronomen und Dativverben | A1++/A2++ | Nachbarn um Hilfe bitten, Paket übernehmen | Personalpronomen Akk./Dat.; Verben mit Dativ (helfen, gehören, gefallen, passen, schmecken, danken, gratulieren); Dativ + Akkusativ (Nomen: Dat. vor Akk.; Pronomen: „Ich schicke ihn Ihnen.“) | d01, d02, d04, d05 | Pronomen, helfen + Dativ, zwei Objekte | d06 |
| d07 | Ist das deiner? – Wem gehört was? | A2 | Fundsachen/Garderobe nach der Firmenfeier, Büroküche | ein-Wörter allein (meiner/meine/meins, einer/eins, keiner/keins; meinen/einen/keinen, meinem …); der/den/dem allein als Demonstrativ („Den nehme ich.“); gehören + Dativ als Anwendung (Detail: Frage welcher?/welchen?) | d01, d02, d04, d05, d06 | Possessiv-/kein-Pronomen allein, Demonstrativ | neu |
| | *Checkpoint 1 (d01–d07)* | | | | | | |
| d08 | Nehmen Sie die Tabletten! – beim Arzt und in der Apotheke | A1+/A2+ | Beschwerden beschreiben, Anweisungen, Beipackzettel | Imperativ du/ihr/Sie (e → i, sein, trennbar); Verb-Erst (Ja/Nein-Frage, Imperativ); Reflexivpronomen Akk./Dat. (sich setzen / sich etwas verletzen) | d01, d02, d05, d06 | Imperativ, reflexiver Dativ, Verb-Erst | d07 |
| d09 | Wie komme ich zur Post? – Präpositionen mit festem Kasus | A1+/A2++ | Öffis, Weg beschreiben, Erledigungen | mit Dativ (aus, bei, mit, nach, seit, von, zu, gegenüber) und Akkusativ (durch, für, gegen, ohne, um), beim/vom/zum/zur; wo?/wohin?/woher? (bei – zu/nach – aus/von, zu Hause/nach Hause); seit + Präsens ↔ vor + Vergangenheit (= ago) – Detail: zu Hause/zuhause, nach Hause/nachhause, daheim akzeptieren | d01, d02, d04, d05 | Ort/Richtung, seit, vor | d09 |
| d10 | Ich habe warten müssen – Perfekt II | A2 | Verspätung oder Missgeschick erklären | haben/sein vertieft (Zustandsänderung, ist gefahren ↔ hat das Auto gefahren, ist gewesen/hat gehabt/ist geworden, österr. ist gesessen/gestanden/gelegen); unregelmäßige und gemischte Partizipien nach Gruppen; musste ↔ habe … müssen (Ersatzinfinitiv, auch im Nebensatz) – Detail: reflexive Verben mit haben, hat gekonnt (Modalverb ohne Infinitiv) | d01, d02, d03, d08 | Perfekt mit sein, Partizipien, Ersatzinfinitiv | d08 |
| d11 | Wohin kommt das Sofa? – Wechselpräpositionen | A2 | Umzug, Wohnung einrichten, Schlüssel suchen | wo? + Dativ / wohin? + Akkusativ (9 Präpositionen); ins/ans/im/am; legen/liegen, stellen/stehen, setzen/sitzen, hängen | d01, d02, d04, d05, d09, d10 | Wechselpräpositionen | d10 |
| d12 | Worüber ärgerst du dich? – Verben mit Präposition | A2+/A2++ | Small Talk: Hobbys, Pläne, Sorgen | Verben/reflexive Verben mit fester Präposition (Detail: auch Nomen – Angst haben vor, Lust haben auf, Interesse haben an; sich freuen auf ↔ über); Fragen wo(r)- (Sachen) / Präposition + wen/wem (Personen); da(r)-Wörter – Karte: Rücksicht nehmen auf | d01, d02, d05, d06, d08, d09, d11 | Verben mit Präposition, Fragen mit Präposition | d11 |
| d13 | Wer macht was bis wann? – Wortstellung II | A1+–B2 | Besprechung: Aufgaben und Termine verteilen | Wiederholung Satzklammer + Mittelfeld im Zusammenhang (Zeit – Grund – Art – Ort, Pronomen vor Nomen; Haupt- + Nebensatz); Verbkomplex im Nebensatz (… kommen kann, … hat machen müssen); „nicht“ für den ganzen Satz ↔ einen Teil (nicht heute, sondern morgen) – Karten: einen Vorschlag machen, eine Entscheidung treffen | d01, d02, d06, d08, d10 | Wortstellung (Mittelfeld, Verbkomplex im Nebensatz) | d12 |
| | *Checkpoint 2 (d08–d13) – danach d03, falls noch nicht gelernt* | | | | | | |
| | **Block B – B1 festigen** | | | | | | |
| d14 | Die helle Wohnung im zweiten Stock – Adjektivendungen I | A2+ | Wohnungsinserate, Termine mit Datum | Adjektiv nach der/die/das, dies-, welch-; Ordinalzahlen (Detail: erste, dritte, siebte, achte; am fünften Mai); derselbe/dieselbe/dasselbe im Nominativ, Akkusativ, Dativ (Genitiv in d18) – Karten: die Miete, die Betriebskosten (Pl.), die Kaution, die Ablöse | d01, d02, d04, d05, d09, d11 | Adjektivendungen, Ordinalzahlen, derselbe, Betriebskosten | d13 |
| d15 | Ein großer Balkon, frisches Gemüse – Adjektivendungen II | A2+ (Partizip I: B1) | Wohnungsbesichtigung, Rezept, Speisekarte | nach ein-/kein-/mein- (Schwerpunkt Dativ: mit unserem neuen Chef); ohne Artikel (bei schönem Wetter); Partizip als einfaches Adjektiv (fließendes Wasser, geriebener Käse) | d01, d02, d04, d05, d14 | Adjektivendungen, Partizip I | d14 |
| d16 | Könnten Sie mir sagen, ob …? – Konjunktiv II höflich | A2++ | Telefonieren mit Hausverwaltung und Firmen, formelle E-Mail | hätte, wäre, könnte, würde + Infinitiv, sollte; Bitte, Rat, gern – lieber – am liebsten; höfliche indirekte Frage ob ↔ wenn („if“) – Detail: Sie/Ihnen/Ihr immer groß, du im Brief wahlweise, Briefanrede; Karte: eine Frage stellen | d01, d02, d03, d06 | Konjunktiv II, ob, lieber, Anrede | d15 |
| d17 | Der Meldezettel wird ausgefüllt – werden und Passiv I | A2++ (Futur-Gebrauch B1++) | Behördenweg: Meldezettel, Antrag, Konto | werden dreifach (Vollverb ist geworden – Futur für Versprechen/Vorhersage ↔ Präsens + Zeitangabe – Passiv-Hilfsverb); Passiv Präsens (wird ausgefüllt); von + Dativ, man ↔ Passiv – Karte: einen Antrag stellen | d01, d02, d05, d09, d10 | Passiv, Futur I | d16 |
| d18 | Wegen eines Staus zu spät – Genitiv | B1/B1+ | Verspätung entschuldigen, Brief von der Behörde | Genitiv der Artikelwörter + -(e)s (Detail: Adjektiv im Genitiv -en), Genitivattribut; trotz/während/wegen/statt (Hinweis: umgangssprachlich und österr. auch mit Dativ); n-Deklination (des Herrn, dem Nachbarn, den Kollegen) | d01, d02, d04, d05, d09, d15 | Genitiv, Genitivpräpositionen, n-Deklination | d17 |
| d19 | Die Kollegin, die neben mir sitzt – Relativsätze I | B1 | Im Büro Leute und Dinge beschreiben | Relativpronomen Nom./Akk./Dat. (inkl. denen); Verb am Ende, Komma; Relativ- ↔ Demonstrativpronomen (gleiche Formen) | d01, d02, d04, d05, d06, d07 | Relativpronomen | d18 |
| | *Checkpoint 3 (d14–d19)* | | | | | | |
| d20 | Ich versuche, pünktlich zu sein – Infinitiv mit zu | B1 | Kurs anmelden, Vorsätze, Aufgaben bei der Arbeit | zu-Infinitiv (auch trennbar: anzurufen); um … zu (↔ damit, Stärke); ohne … zu, statt … zu | d01, d02, d13 | zu-Infinitiv, ohne/statt … zu | d19 |
| d21 | Seitdem ich hier wohne … – Zeitsätze II | B1 | Lebenslauf bei Behörde/AMS, Arbeitszeiten | seit(dem) + Präsens; bis, sobald; Präposition ↔ Konjunktion ↔ Adverb (vor/bevor/vorher, nach/nachdem/danach, während) – Karte: Erfahrungen sammeln | d01, d02, d03, d09, d18 | seit, Zeitsätze, während | d20 |
| d22 | Damals war alles neu – Präteritum und Plusquamperfekt | B1+ | Schadensmeldung an Versicherung/Hausverwaltung, ORF-Meldung lesen | Präteritum (produktiv nur Mischverben und ca. 20 häufigste starke Verben inkl. wurde, Rest erkennen); Plusquamperfekt + Zeitenfolge mit nachdem; Zeitachse aller Zeiten (mündlich/schriftlich in Österreich) mit Umbau | d01, d02, d03, d10, d21 | Präteritum, Plusquamperfekt | d21 |
| d23 | Die Heizung ist repariert worden – Passiv II | B1+ | Mängel bei der Hausverwaltung melden | Passiv Präteritum (wurde repariert); Passiv Perfekt (ist … worden); Passiv mit Modalverb (muss repariert werden), Nebensatz als Anwendung | d01, d02, d10, d13, d17, d22 | Passiv Präteritum/Perfekt/Modalverb | d22 |
| d24 | Die Firma, bei der ich arbeite – Relativsätze II | B1+ | Arbeitsplatz und Wohnung beschreiben | Relativsatz mit Präposition; dessen/deren; wo/was (kurz, Stärke) | d01, d02, d09, d12, d18, d19 | Relativpronomen (Präposition, Genitiv) | d23 |
| d25 | Nicht heute, sondern morgen – Konnektoren | A2–B1++ | Reklamation, Beschwerde-E-Mail | da (Verb am Ende) ↔ denn ↔ weil; falls ↔ wenn; entweder … oder, sowohl … als auch – Wiederholung aus d02: sondern ↔ aber, denn auf Position 0 (deshalb/trotzdem/obwohl nur als Kontrast) | d01, d02, d03, d13 | Konnektoren | d24 |
| d26 | Hätte ich das nur gewusst! – Konjunktiv II irreal | B1/B1++ | Pläne, Träume, Ratschläge, Bedauern | irreale Bedingung und Wunsch in der Gegenwart (falls nur real); Vergangenheit: hätte/wäre + Partizip II; hätte … sollen/können | d01, d02, d10, d16, d25 | Konjunktiv II, falls | d25 |
| | *Checkpoint 4 (d20–d26) = Ende Phase 1, Block C neu planen* | | | | | | |
| | **Block C – B2 aufbauen (vorläufig)** | | | | | | |
| d27 | Beim Lesen des Mietvertrags – Nominalisierung | B2 | Mietvertrag, Hausordnung, Behördenbrief | Nominalisierung ↔ Verbalisierung; beim/zum + Infinitiv (groß); aufgrund, infolge, innerhalb, außerhalb | d01, d02, d15, d18, d21, d25 | Groß-/Kleinschreibung | d26 |
| d28 | Das Amt ist geschlossen – Zustandspassiv und Passiversatz | B2 | Öffnungszeiten, Bescheid | Zustandspassiv (ist/war geöffnet); sich lassen, -bar; sein + zu | d01, d02, d20, d23 | Passiv | d27 |
| d29 | Einen Antrag stellen – Nomen-Verb-Verbindungen | B2+/B2++ | Behörde, Besprechung | Nomen-Verb-Verbindungen systematisch (die getesteten schon vorher als Karten); Nomen und Adjektive mit Präposition (Interesse an, zufrieden mit) | d01, d02, d12, d27 | Nomen-Verb-Verbindungen | d28 |
| d30 | Die neu eröffnete Filiale – Partizipialattribute | B2+ | Stellenanzeigen, Bewerbung | erweitertes Attribut mit Partizip I/II (Umbau Relativsatz → Attribut) | d01, d02, d15, d19, d23 | Partizip als Adjektiv | d29 |
| d31 | Er dürfte krank sein – Vermutungen und Modalpartikeln | B2+ | Small Talk, Gerüchte im Büro, Österreichisch verstehen | dürfte/müsste/könnte, soll (angeblich); werden + wohl (Futur I/II als Vermutung); Modalpartikeln doch, ja, halt, eh, schon | d01, d02, d16, d17 | – (Ausbau) | d31 |
| d32 | Zwar …, aber … – Konnektoren II | B2++ | Besprechung: Meinung begründen | zwar … aber; sodass / so … dass; indem | d01, d02, d25, d26 | – (Ausbau) | d30 |
| d33 | Laut ORF … – Konjunktiv I | B2++ | Nachrichten verstehen und wiedergeben | Konjunktiv I in der indirekten Rede (Ersatz durch Konjunktiv II); als ob (irrealer Vergleich) | d01, d02, d26, d31 | – (Ausbau) | d32 |

Korrekturen nach der unabhängigen Prüfung (`schied/plan-final-pruefung.md`, P01–P18) sind eingearbeitet.
Spalte „vorher“ = ID im bereinigten Plan `schied/plan.md` (dort gilt: d07 → hier d08, d08 → d10, d09 bleibt d09,
ab d10 jeweils +1). Umfang: 30 neue Themen ≈ 30–60 Wochen; Block C wird beim Checkpoint 4 neu geplant.
