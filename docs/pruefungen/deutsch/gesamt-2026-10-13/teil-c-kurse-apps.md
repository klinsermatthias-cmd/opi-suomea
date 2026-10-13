# Teil C/D – Kurse, Grammatikseiten und Apps: Lehrweise und Übungsarten (13.10.2026)

Geprüft wurden: DW „Nicos Weg“ A1/A2/B1, vhs-Lernportal, Lingolia, mein-deutschbuch.de, Schubert-Verlag (Online-Aufgaben), DeutschAkademie, Babbel, Busuu und Duolingo (Duolingo nicht prüfbar, siehe unten). Abgerufen wurde mit curl. Bei DW wurden die Übungsarten aus den JSON-Daten der Seiten gelesen (`inquiryType`, `clozeType`, `inputType`), beim vhs-Lernportal aus öffentlichen PDF-Handreichungen. Deutsch-Trainer: `docs/uebungsformate.md`, Engine `main-wt/js/` (formate.js, vokabeln.js, wortschatz.js, ki-ueben.js, uebungen.js, verwaltung.js) und die Testkopie `dtw` mit d01–d09 (549 Übungen).

## Kurzfazit
1. Die Grundformen der Angebote hat der Deutsch-Trainer: Auswahl, Lückentext, Tabelle, Satzbau, Lesen mit Fragen, freies Schreiben, Karteikarten in beiden Richtungen und Wort-Diktat. Die Tabellen mit getippten Lücken sind sogar strenger als bei DW und vhs, wo man auswählt oder zieht.
2. Bei allen Quellen kommen vor, im Deutsch-Trainer fehlen: **mehrere Lücken in einem Satz oder Text** (Satzklammer „hat … gemacht“, Lückentext in einem Zusammenhang), **Zuordnen und Sortieren als Grammatikübung**, **Hören mit Fragen bei verdecktem Text** und **Satzdiktat**.
3. Lingolia gibt bei **jeder Lücke die Begründung** („Dativ maskulin → dem“). Im Deutsch-Trainer gibt es die Erklärung `x` nur bei `mc`, `tab` und `dlg`. Bei `gap`, `tr` und `ord` erscheint sie nach dem Prüfen nicht (Ausnahme: „Weiß ich nicht“). Das sind aber 303 der 549 Übungen.
4. Die Theorie-Texte (621–910 Wörter) liegen im Umfang von Lingolia (576–1.034) und sind deutlich länger als bei DW (≈ 130–330). Es fehlt oben ein Kasten „Das Wichtigste in Kürze“. Der Block zum Futur I steht unverändert in d01, d02 und d03.
5. Kasus-Farben (mein-deutschbuch: rot = Dativ, blau = Akkusativ) könnte man **ohne Engine-Änderung** einführen: `<span class>` übersteht die Bereinigung, und `farben.css` ist eine Datei der App.

## Befunde
| Befund | Stelle | Beleg/Quelle | Schwere | Vorschlag |
|---|---|---|---|---|
| Keine Begründung nach `gap`/`tr`/`ord`: `x` wird nur bei mc (formate.js:42), tab (:163), dlg (:390) und „Weiß ich nicht“ (uebungen.js:803) gezeigt; `textCheck` (uebungen.js:591 ff.) nutzt `x` nicht. In d01–d09 hat nur `mc` ein `x` (116/116) | Engine `formate.js`, `uebungen.js`; Inhalte d01–d09 | Lingolia zeigt pro Lücke Fall und Genus bzw. die Regel: https://deutsch.lingolia.com/de/grammatik/nomen/deklination/uebungen („1. Lücke: Nominativ feminin → die“), https://deutsch.lingolia.com/de/grammatik/zeitformen/perfekt/uebungen („Verben der Bewegung bilden das Perfekt normalerweise mit sein“) | mittel | `x` nach jeder Prüfung von gap/tr/ord anzeigen (Engine, klein); dann kurze Begründungen in `x` nachtragen (Inhalt, nur bestehende Einträge ergänzen) |
| `gap` hat genau ein `___`. Satzklammer, Artikel + Endung oder ein kurzer Text mit mehreren Lücken gehen nur über `tab` oder `dlg` | `docs/uebungsformate.md` (gap) | Schubert, Perfekt mit zwei Feldern: https://www.schubert-verlag.de/aufgaben/uebungen_b1/b1_kap1_verbformen.htm · Lückentext mit Zusammenhang: …/b1_kap3_michundmir.htm · DW-Lückentext „Verben im Präteritum und Perfekt“: https://learngerman.dw.com/de/verben-im-präteritum-und-perfekt/l-38463064/e-38487856 · Lingolia, 2–3 Lücken pro Satz (Deklination, s. o.) · C-Test: https://mein-deutschbuch.de/c-test-ausbildung/ | mittel | neues Format „Lückentext mit mehreren Lücken“ (Engine, mittel); Bewertung wie bei `tab`, Feld für Feld |
| Kein Hörverstehen mit verdecktem Text: `les` zeigt den Text immer, Vorlesen ist nur Zusatz. „Sätze verstehen (Hören)“ fragt einzelne Sätze nach ihrer Bedeutung | `docs/uebungsformate.md` (les), `vokabeln.js` (Hörverstehen) | DW, Dialog hören und Fragen beantworten (inputType AUDIO): https://learngerman.dw.com/de/am-9-november-1989-1/l-38463064/e-38487978 · Babbel Reviews mit Modus „listening“: https://www.babbel.com/how-babbel-works | mittel | `les` im Hörmodus: Text verdeckt, vorlesen, Fragen beantworten, danach Text zeigen (Engine, klein–mittel; Inhalte gibt es schon) |
| Zuordnen nur als Vokabelspiel (`wortschatz.js`: „Paare zuordnen (Spiel, ändert den Lernplan nicht)“), nicht als Grammatikübung. Sortieren in Gruppen fehlt ganz | Engine `wortschatz.js`; FMT hat nur mc/gap/tr/ord/tab/les/sch/dlg | DW, Präteritumform ↔ Infinitiv zuordnen (ASSOCIATION DIRECT): https://learngerman.dw.com/de/neue-verben-im-präteritum/l-38463064/e-38487541 · vhs-Handreichung mit den Übungstypen „Zuordnen“ (7×) und „Sortieren“ (8×, z. B. formell/informell): https://www.vhs-lernportal.de/wws/bin/4007530-4015250-1-2024_05_dvv_handreichung_deutsch_unterrichten.pdf | niedrig–mittel | sofort als Inhalt: `tab` mit Spalte „Gruppe“ (z. B. Verb ǀ [haben/sein]); später Format „zuordnen/sortieren“ auf Grundlage des Paare-Codes (Engine, mittel) |
| Kein Satzdiktat: Diktat gibt es nur für Wörter („Wörter diktieren“), Sätze nur als Bedeutung | `vokabeln.js` | DW, Hör-Lückentext „Wiederholung der neuen Wörter“: https://learngerman.dw.com/de/wiederholung-der-neuen-wörter/l-38463064/e-38489061 · Diktate auf https://mein-deutschbuch.de/diktat-2-deutsch-schreiben-ueben/ · vhs „Diktat“ (Handreichung) | niedrig | „Sätze diktieren“ aus `listenSentences()` mit Vergleich auf Deutsch, ß/ss tolerant (Engine, klein) |
| Theorie ohne Kurzfassung am Anfang. Der Futur-I-Block mit Regel, Tipp und werden-Tabelle steht in d01, d02 und d03; der Abschnitt „Verb forms in this topic“ in allen neun Themen | `lektionen.json` (dtw) d01–d03 `th` | DeutschAkademie beginnt mit „Das Wichtigste im Überblick“ (4 Zeilen): https://www.deutschakademie.de/online-deutschkurs/deutsche-grammatik/vier-faelle-deutsch/dativ-akkusativ-erklaerung · DW-Grammatikseiten haben ≈ 130–330 Wörter: https://learngerman.dw.com/de/wechselpräpositionen-2/l-40463291/gr-44537220 | niedrig | oben im Grammatikteil 2–4 Zeilen `rule` „In short“; Futur I nur einmal ausführlich, sonst ein Satz mit Verweis „see d01“ (Inhalt; nur Theorie-Text, Indizes bleiben) |
| Keine Farben für Fälle oder Genus in Theorie und Tabellen | `th` d04–d09; `farben.css` | mein-deutschbuch: „rot = Dativ-Objekt (Person), blau = Akkusativ-Objekt (Sache)“, dazu Positionstabelle: https://mein-deutschbuch.de/dativ-und-akkusativ-ergaenzung/ · Lingolia hebt Endungen farbig hervor (`<em class="char">`): https://deutsch.lingolia.com/de/grammatik/zeitformen/perfekt | niedrig | `<span class="dat">`/`"akk"` in Beispielen; Klassen in `farben.css` für hell und dunkel anlegen; zusätzlich fett bzw. „(Dat.)“, damit die Farbe nicht allein trägt (Inhalt + App-CSS, keine Engine) |
| Kein gelöstes Beispiel („0.“) vor Übungen, deren Format neu ist | Inhalte (`h`) | Schubert, Silbensalat mit „0. … die Staumeldung“ als Beispiel: https://www.schubert-verlag.de/aufgaben/uebungen_b1/b1_kap6_silbensalat.htm · DW-Übung mit „Beispiel: sprechen – Perfekt: … / Präteritum: …“ (e-38487856, s. o.) | niedrig | bei neuen Formaten ein Beispiel in `h` („z. B. …“) (Inhalt) |
| Gewichtung: `gap` 36 % (198/549), `mc` 21 %, `tr` 12 %, `tab` 11 %, `ord` 7 %, `les`/`sch` je 5 %, `dlg` 4 %. Bei DW mischt eine Lektion ≈ 15 Übungen aus Auswahl, Lückentext, Sortieren, Hören und Video | dtw d01–d09 | Lektionsablauf DW (lessonPart-Reihenfolge): https://learngerman.dw.com/de/im-büro/l-40463291, https://learngerman.dw.com/de/mein-beruf/l-40449209 | niedrig | sobald neue Formate da sind, je Thema 2–3 davon statt weiterer Einzellücken |

## Katalog der Übungsarten (Stichprobe) und Abgleich
DT = Deutsch-Trainer. ✓ = vorhanden, ≈ = nachbildbar, – = fehlt.

| Übungsart | Angebot (URL) | DT | Passt zu den Regeln? |
|---|---|---|---|
| Einfachauswahl (Text) | DW ASSOCIATION SINGLE (e-38487978, s. o.); vhs „Single Choice“; Schubert „Wählen Sie …“ (https://www.schubert-verlag.de/aufgaben/uebungen_b1/b1_uebungen_index.htm) | ✓ `mc` | ja |
| Mehrfachauswahl (mehrere richtig) | DW, Video „Ein Fahrrad aus der DDR (1)“, „Es gibt mehrere richtige Antworten“: https://learngerman.dw.com/de/ein-fahrrad-aus-der-ddr-1/l-38463064/e-38463349 | – | ja (gering) |
| „Was passt nicht?“ | DW „Welche Tätigkeit passt nicht?“ (l-40449209); Schubert b1_kap5_wortschatz | ≈ `mc` | ja |
| Fehler finden („Welcher Satz ist richtig?“) | in der Stichprobe nicht als eigener Typ gesehen | ✓ `mc` (d05) | ja |
| Lückentext schreiben (eine Lücke) | DW clozeType WRITING; mein-deutschbuch Perfekt A (https://mein-deutschbuch.de/grammatikuebungen-perfekt/) | ✓ `gap` | ja |
| Lückentext mit Auswahl je Lücke | DW clozeType CHOOSE („Lokale Präpositionen – Lies die Regel und wende sie an“, l-40463291); Lingolia (Dropdown); Schubert mich/mir | ≈ `mc` (eine Lücke) | ja |
| Mehrere Lücken / Satzklammer / Text mit Lücken | Schubert b1_kap1_verbformen, b1_kap3_michundmir; DW e-38487856; Lingolia Deklination | ≈ `tab`/`dlg` | ja, hoher Nutzen |
| C-Test (Wortenden ergänzen) | https://mein-deutschbuch.de/c-test-ausbildung/ | – | ja (B2) |
| Tabelle ergänzen | vhs „Tabelle ergänzen“ (Handreichung); DW „Konjugation von können/müssen – Ordne zu“ (CHOOSE, l-40449209) | ✓ `tab` (getippt, strenger) | ja (Regel 6) |
| Zuordnen (Paare, Satzhälften) | DW ASSOCIATION DIRECT (e-38487541); vhs „Zuordnen“ | ≈ (nur Vokabelspiel) | ja |
| Sortieren in Gruppen | vhs „Sortieren“ (Handreichung, Übung 3/4) | ≈ `tab` | ja, regelbezogen |
| Wörter zum Satz ordnen | DW SORTING „Nico muss Vokabeln lernen“ (l-40449209); vhs „Reihenfolge“ | ✓ `ord` | ja |
| Sätze/Dialogteile ordnen | DW SORTING „Was passiert im Video wann?“ (l-40449209); vhs „Dialog in die richtige Reihenfolge“ (Handreichung) | ≈ `ord` mit Satz-Kärtchen (ungetestet, siehe unten) | ja |
| Buchstaben-/Silbensalat | Schubert b1_kap6_silbensalat; DW „Bring die Buchstaben in die richtige Reihenfolge“ (l-40584799) | – | gering (A1-Niveau) |
| Umformen (Perfekt bilden, wohin→wo, direkte→indirekte Frage) | mein-deutschbuch Wechselpräp. B (https://mein-deutschbuch.de/grammatikuebungen-wechselpraepositionen/); DW „Betreff: Wohnung …“ (l-40584799) | ✓ `tab` (d02 „Satz ǀ weil-Satz“), `tr` | ja |
| Sätze aus Stichwörtern | Lingolia „(ich/suchen/dich)“ (Perfekt-Übungen) | ≈ `gap`/`tab`/`sch` | ja |
| W-Fragen bilden / Fragen beantworten | mein-deutschbuch Wechselpräp. C, Verben mit Dat./Akk. C (https://mein-deutschbuch.de/grammatikuebungen-verben-mit-dativ-akkusativ/) | ≈ `tab`/`sch` | ja |
| Markieren (z. B. alle Verben antippen) | vhs „Markieren“ (Handreichung Übung 1) | – | ja (Wahrnehmen der Wortstellung) |
| Lesen + Fragen | DW inputType TEXT („Die Mauer durch Deutschland (1)“); Schubert „ordnen Texte zu“ | ✓ `les` | ja |
| Hören + Fragen (Audio/Video) | DW AUDIO/VIDEO (e-38487978, e-38463349) | ≈ (`les` mit sichtbarem Text) | ja |
| Diktat / Hör-Lückentext | DW e-38489061; mein-deutschbuch Diktate; vhs „Diktat“ | ✓ Wörter, – Sätze | ja |
| Bildaufgaben (Bild wählen, beschriften, Klickbild) | DW „Wo ist das Geld? (2)“ (ASSOCIATION, mediaType IMAGE); Lingolia „Sieh dir das Bild an“ (Lokale Präp.-Übungen); vhs „Bildkarten beschriften“, „Klickbild“ | – | ja, aber teuer (Bilder, Rechte) |
| Dialog ergänzen (schriftlich) | DW REPEAT als Sprechübung; vhs Dialogschnipsel als Lückentext (Handreichung Übung 4) | ✓ `dlg` | ja |
| Freies Schreiben mit Korrektur | vhs „Übung an Tutor“ (Lehrkraft korrigiert, Bedienungsanleitung S. 15 ff.); Busuu-Rückmeldungen von Muttersprachler/innen (https://www.busuu.com/en/about); Schubert „schreiben frei“ | ✓ `sch` + KI, freies Schreiben/Rollenspiel ab 80 % | ja |
| Karteikarten mit Wiederholung, beide Richtungen | vhs Vokabel- **und Phrasen**trainer, beide Richtungen, bekannte Karten seltener (https://www.vhs-lernportal.de/wws/bin/4007530-4015314-1-dvv_bedanl_deutsch_web.pdf, S. 31); Babbel Reviews mit Spaced Repetition (how-babbel-works) | ✓ (Redemittel stehen schon in `v`) | ja |
| Zwischentests | vhs 3 Tests pro Lektion (https://www.vhs-lernportal.de/wws/kursangebot.php); Busuu „checkpoint quizzes“ | ✓ Themenrunde ≥ 80 % | ja |
| Nachsprechen / Sprechen / gesprochenes Rollenspiel | DW REPEAT (e-38488735, l-40449209); vhs „Nachsprechen“ (13×); Babbel Guided Conversations, Babbel Speak; Busuu „speaking practice“ | – | **nein (Regel: kein Sprechtraining)** |

Nebenbefund zu `ord`: Die Kärtchen werden mit Leerzeichen verbunden und dann verglichen (formate.js:458 f.). Kärtchen mit ganzen Sätzen sollten daher funktionieren. Die Aufgabe heißt aber fest „Bilde den deutschen Satz“, und ob `tools/pruefen.mjs` Kärtchen mit Leerzeichen annimmt, wurde **nicht getestet**.

## Wie die Angebote Regeln erklären – und was sich für `th` lohnt
- **DW:** Erst Video und Kontext, dann Übungen. Darunter ist eine Übung „Lies die Regel und wende sie an“ (z. B. „Lokale Präpositionen“, „Satzstruktur mit Modalverb“). Die Grammatikseite steht **am Ende** der Lektion, zum Nachschlagen (Reihenfolge `lessonPart`, l-40463291, l-40449209). Die Texte sind kurz (Wechselpräpositionen ≈ 140 Wörter): die Fragen „Wo …?“/„Wohin …?“, zwei Beispiele je Fall in Fettdruck, eine kleine Artikeltabelle Akk./Dat. In den Wortlisten steht das Genus als „(f.)“ (z. B. „Auseinandersetzung, -en (f.)“). Farben gibt es keine.
- **vhs:** Jede Lerneinheit beginnt mit einer Szene aus dem Alltag. „Sortieren“ kommt teils **vor** der Regel („Die TN können hier noch auf keine Regel … zurückgreifen“), danach wird mit „Tabelle ergänzen“ geordnet. Grammatik-Tipps hängen am Ausrufezeichen jeder Übung. Jede B1-Lektion hat einen Abschnitt **„Wiederholung“** mit älterer Grammatik (PDF Themen/Grammatik B1).
- **Lingolia:** Die Seiten folgen dem Schema „Was ist …? – Wann? – Wie bildet man …? – Besonderheiten“. Oben steht ein Beispieltext zum Vorlesen, dazu ein Inhaltsverzeichnis. Endungen und Morpheme sind farbig hervorgehoben („gewart**et**“). Jede Regel hat ein Beispiel.
- **mein-deutschbuch:** Kasus-Farben (rot Dativ, blau Akkusativ), Positionstabelle (Pos. 1 · Verb · Dativ · Akkusativ), die Formel „Wer + Verb + wem + was“ und Verblisten zum Herunterladen.
- **DeutschAkademie:** Oben „Das Wichtigste im Überblick“, danach 11 nummerierte Abschnitte, „Wem-Fall/Wen-Fall“, Verblisten mit Beispielsatz, Tipp-Kästen und eigene „Grammatiktafeln“ als Übersicht für A1–B1 (https://www.deutschakademie.de/kostenlose-grammatiktafeln/).
- **Babbel:** Lektionen von 5–10 Minuten (im Schnitt 6) zu Alltagssituationen, Grammatik im Kontext, „Learning Tips“ mitten in der Lektion (how-babbel-works). Die Fälle werden über **englische Pronomen** erklärt („We like him“) (https://www.babbel.com/german-grammar).
- **Busuu:** „only the masculine article changes“ im Akkusativ; die Wechselpräpositionen über „static position“ und „change of position“ (https://www.busuu.com/en/german/prepositions).

**Für die Theorie-Texte lohnt sich:**
- (a) Eine Zeile `rule` „In short“ oben im Grammatikteil (DeutschAkademie).
- (b) Kasus-Farben über `span` + `farben.css`, nie die Farbe allein (mein-deutschbuch).
- (c) Merkformeln wie „wer + Verb + wem + was“, „only the masculine changes“. In d05/d09 ist das teils schon da: „wer/wen/wem“, „wo? – wohin? – woher?“.
- (d) Vergleich mit der Ausgangssprache. Englisch wie bei Babbel, zusätzlich Finnisch als Tipp: wohin ≈ -Vn/-lle, wo ≈ -ssa/-lla, woher ≈ -sta/-lta. Das ist ohne Quelle und müsste vor dem Einbau belegt werden.
- (e) Wiederholte Blöcke (Futur I) kürzen.

Die Reihenfolge „Theorie → Wörter → Übungen“ bleibt (Matthias' Regel). Die DW-Idee „Regel in der Übung“ ist durch die Regelfragen (`mc` + `x`) schon abgedeckt.

## Lohnende Übungsarten und Lehrmittel (nach Priorität)
| # | Was | Nutzen | Aufwand | Art |
|---|---|---|---|---|
| 1 | **Begründung `x` nach gap/tr/ord anzeigen** und kurz befüllen („Dativ: mit → dem“) | hoch: macht aus Formen Regelwissen und passt zu „Regelfragen statt nur Formen“ | klein (Engine) + laufend (Inhalt) | Engine + Inhalt |
| 2 | **Lückentext mit mehreren Lücken** (Satzklammer, Artikel + Endung, kurzer Text) | hoch: Perfekt/Futur/Modalverben im Zusammenhang; Grundlage für C-Test (B2) | mittel | Engine |
| 3 | **Hörmodus für `les`** (Text verdeckt, Fragen, danach Text) | hoch: Alltag in Österreich (Telefon, Ordination); vorhandene `les` sofort nutzbar; kein Sprechen | klein–mittel | Engine |
| 4 | **Kurzfassung oben in `th`**, Futur-I-Wiederholung kürzen, Merkformeln | mittel | klein | nur Inhalt |
| 5 | **Kasus-Farben** in Beispielen und Tabellen (plus Fettdruck oder Kürzel) | mittel (d05–d09, d18) | klein | Inhalt + `farben.css` (App-Datei) |
| 6 | **Sortieren/Zuordnen** für Regeln (haben/sein, Dativ-/Akk.-Präpositionen, als/wenn/wann, Satzhälften) | mittel | sofort klein als `tab`; eigenes Format mittel | erst Inhalt, später Engine |
| 7 | **Satzdiktat** aus gelernten Sätzen | mittel (Rechtschreibung, Großschreibung) | klein (Code von „Wörter diktieren“ wiederverwenden) | Engine |
| 8 | **Gelöstes Beispiel in `h`** bei ungewohnten Aufgaben | mittel (weniger Formatfehler) | sehr klein | nur Inhalt |
| 9 | **Satz-/Dialogteile ordnen** über `ord` mit Satz-Kärtchen | niedrig–mittel | klein, wenn `pruefen.mjs` und die Aufgabenzeile mitspielen (vorher testen) | Inhalt (evtl. kleine Engine-Anpassung) |
| 10 | Mehrfachauswahl (`mc` mit mehreren richtigen) | niedrig | klein | Engine |
| 11 | Markieren im Text | niedrig–mittel | mittel | Engine |
| 12 | Bildaufgaben | niedrig | hoch (Bilder, Rechte, Größe) | Engine + Material |
| – | Nachsprechen, gesprochenes Rollenspiel, Silbensalat | nicht empfohlen (Regel bzw. A1-Niveau) | – | – |

## Geprüft, ohne Befund
- Karteikarten in beiden Richtungen mit Wiederholungsplan, auch für Redemittel. Das entspricht dem vhs-Trainer und den Babbel Reviews (Quellen s. o.).
- Vollständige Tabellen mit Lücken (`tab`, getippt) sind mindestens so streng wie „Tabelle ergänzen“ (vhs) und das Auswahl-Zuordnen bei DW.
- Regelfragen mit Erklärung: `mc` mit `x` in d01–d09 116/116.
- „Fehler finden“ als `mc` „Welcher Satz ist richtig?“ (d05).
- Freies Schreiben mit Korrektur (KI statt Tutor/Community wie bei vhs/Busuu); Rollenspiel nur schriftlich, also regelkonform.
- Zwischenprüfung: Freischaltung ab 80 %, vergleichbar mit den 3 vhs-Tests pro Lektion und den Checkpoint-Quizzes bei Busuu.
- Theorie-Aufbau „Situation → Dialog → Grammatik → Regeln“ entspricht dem szenischen Einstieg bei vhs und DW. Fragewörter (wer/wen/wem, wo/wohin/woher) sind wie bei DW, DeutschAkademie und mein-deutschbuch schon da.
- Strenge der Prüfung: mein-deutschbuch wertet Groß-/Kleinschreibung und Satzzeichen als Fehler. Der Deutsch-Trainer wertet Großschreibung (außer am Satzanfang) und ignoriert Satzzeichen (`uebungsformate.md`). Das ist vertretbar.

## Nicht prüfbar / ohne Quelle
- **Duolingo:** www.duolingo.com wird per JavaScript aufgebaut; per curl kommt nur die Meta-Beschreibung („bite-size lessons based on science“, https://www.duolingo.com/course/de/en/Learn-German). blog.duolingo.com, support.duolingo.com, research.duolingo.com und investors.duolingo.com liefern über den Proxy 403. Übungsarten von Duolingo sind also **nicht geprüft**. Aus eigenem Wissen (ohne Quelle): Übersetzen mit Wortkärtchen, Paare zuordnen, Hören und Tippen, „Stories“, „Explain my answer“ (Max).
- **vhs-Lernportal:** Kursinhalte erst nach Anmeldung. Die Übungstypen stammen aus der öffentlichen Handreichung und Bedienungsanleitung (PDF, s. o.), nicht aus den Kursen selbst. Die ISO-8859-1-Seiten wurden nach UTF-8 umgewandelt.
- **DeutschAkademie:** Die Übungen des Dativ-Akkusativ-Trainers laufen über JavaScript, ihre Formate sind nicht geprüft. deutschakademie.de ohne „www“ gibt 403, mit „www“ ging es.
- **Babbel/Busuu:** nur öffentliche Werbe- und Erklärseiten; Lektionen selbst nicht geprüft. support.babbel.com gibt 403.
- **Genus-Farben** (der/die/das in Blau/Rot/Grün wie in manchen Lehrbüchern): in keiner Quelle der Stichprobe gefunden (ohne Quelle). Belegt sind nur die Kasus-Farben bei mein-deutschbuch.
- **Finnisch als Vergleich** (Kasus-Entsprechungen): ohne Quelle, vor dem Einbau mit Wiktionary oder einer Grammatik prüfen.
- Ob die **Begründung bei gap/tr/ord** über die KI-Rückmeldung teilweise doch erscheint, wurde nur im Code gelesen, nicht in der laufenden App geprüft.
- Die Zuordnung von Grammatikthema zu Lektions-URL bei DW wurde aus den Seitendaten abgeleitet. Bei der A2-Lektion „auf-wohnungssuche“ (l-40584799) passte sie nicht: Dort geht es um indirekte Fragen, nicht um Wechselpräpositionen. Sie dient nur als Beispiel für die Übungsarten.
