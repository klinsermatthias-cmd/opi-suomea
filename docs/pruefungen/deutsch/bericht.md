# Prüfung der Deutsch-Trainer-Inhalte (S-1011) – Bericht

Simulations-Chat (nur Kontrolle), Auftrag von Matthias 11.10.2026. Geprüft wurde der Deutsch-Trainer
(`klinsermatthias-cmd/deutsch-trainer`, Stand **8ca1818**) nur lesend; geändert wurde dort nichts. Umsetzung durch den
Deutsch-Trainer-Chat mit D-Codes nach Matthias' OK – Auftrag: `uebergabe-deutsch-trainer.md`.

**Entschieden:** S-1011-2 (Themen d01–d03 + Themenplan), S-1011-4 (Abschnitt EINSTUFUNGSTEST aus Auroras Bericht
kommt von Matthias, wird nur im Chat verwendet, nicht committet), S-1011-6 (Ablage hier, Branch
`pruefung/deutsch-inhalte-2026-10-11`, nie `main`), S-1011-8 (Effort xhigh, unabhängige Agenten + Schiedsrunde +
eigene Kontrolle). Nicht gewählt: S-1011-1, -3, -5, -7, -9. Offene Codes: unten (S-1011-10 bis -13).

## Kurzfassung
1. **Das Deutsch ist richtig.** In d01–d03 gibt es keine falsche Musterlösung, keine falsche Form, keinen falschen
   Genus; die österreichischen Wörter stimmen. Alle Probleme liegen in Akzeptanz, Hinweisen, Theorie-Aufbau,
   Übungstiefe und Planung.
2. **Richtige Antworten werden als falsch gewertet** – vor allem bei *Satz ordnen* (ohne KI geprüft): In 16 Übungen (d01: 3, d02: 7, d03: 6)
   fehlt die gleichwertige Wortstellung (Nebensatz vorne/hinten, anderes Vorfeld), z. B. d02 e10 „Weil ich krank bin,
   kann ich heute nicht kommen.“ Genau das, was d02/d03 lehren, wird so bestraft.
3. **Hinweise verraten die Kernentscheidung:** d03 sagt bei jeder als/wenn/wann-Lücke schon, welcher Fall es ist
   („one event in the past“ …); d01 e24/e58 sagen, ob haben oder sein. Damit wird die Testschwäche nie geübt.
4. **Theorie:** einzelne Regeln falsch oder zu absolut (d02: „the conjugated verb is **always** at position 2“, die
   MC-Frage e23 festigt das; d01: Regel „haben/sein at position 2“ widerspricht dem eigenen Beispiel; d03: „wenn = if“
   fehlt, „wann“ fällt unter „starts a subordinate clause“). Vor allem fehlt das **Gesamtsystem** (Satzarten und
   Satzklammer in d02, Satzklammer gemeinsam für Perfekt/Modalverb/trennbar/Futur in d01, Überblick der Zeitsätze in d03).
5. **Übungen zu gelenkt:** kaum Umbau (Präsens → Perfekt, Hauptsatz ↔ Nebensatz, weil ↔ denn ↔ deshalb), kaum
   Kontrast- und Mischübungen, freie Aufgaben mit vorgegebenem Bauplan; einzelne Teile werden nur 1× geübt (Perfekt im
   dass-Satz, „wenn“ für Wiederholtes in der Vergangenheit, Zustandsänderung mit „sein“). d02 übernimmt mehrere Sätze
   wörtlich aus dem (öffentlichen) Einstufungstest; „Zeit vor Ort“ hängt an einem einzigen Testsatz.
6. **Themen zu groß:** d01 und d02 je 7, d03 mindestens 5 neue Teilregeln (Richtwert ≤ 3). Abhilfe ohne Umbau:
   Kern behalten, Rest in neue Themen (siehe Plan).
7. **Themenplan:** Die Nomen-Grundlagen laufen rückwärts (Wechselpräpositionen A2 vor Genus/Plural A1); es fehlen ein
   Kasus-Thema mit Gesamttabelle, Präpositionen mit festem Kasus, Imperativ/Verb-Erst, Reflexivpronomen,
   Ersatzinfinitiv, Passiv Perfekt; Genitiv (ÖIF B1) steht zu spät; d02 hat `req: []`, baut aber auf d01 auf.
   **Bereinigter Plan:** 29 neue Themen in 3 Blöcken mit Checkpoints (`schied/plan.md`).

## Zahlen (nach Schiedsrunde)
| | Erstprüfung K + V (+ P) | bestätigt¹ | übertrieben/falsch | doppelt | eigene Funde Schied | Schwere hoch / mittel / niedrig² |
|---|---|---|---|---|---|---|
| d01 Perfekt | 32 + 40 | 63 | 1 | 8 | 0 | 0 / 20 / 43 |
| d02 Wortstellung | 35 + 33 | 58 | 3 | 7 | 1 | 2 / 18 / 39 |
| d03 als/wenn/wann | 41 + 33 | 59 | 2 | 13 | 2 | 0 / 25 / 36 |
| Themenplan | 40 | 38 | 0 | 2 | 5 | 2 / 17 / 24 |

¹ BESTÄTIGT + ABGESCHWÄCHT + VERSCHÄRFT + TEILWEISE. ² einschließlich eigener Funde der Schiedsrunde, ohne
übertriebene/doppelte. Kategorie-Zählung: `node werkzeuge/schied-zaehlen.cjs`.
**Zuverlässigkeit:** K (Korrektheit) war in allen drei Themen sehr zuverlässig (keine falsche Behauptung zu Formen),
eher zu streng in der Schwere. V (Vollständigkeit) lieferte das wertvollere Gesamtbild, überschätzte aber die Schwere
(kein einziges V-„hoch“ hielt) und schlug neue ord/tab-Übungen wieder mit zu wenigen Lösungen vor (`schied/d02.md`
[E1]). P (Plan) zitierte die ÖIF-Niveaus korrekt (≈ 40 Zuordnungen nachgeprüft), teilte aber zu fein (38 Themen).

## Ergebnis je Thema (Details: `schied/<id>.md`, je Fund Endurteil, Korrektur, Beleg)
### d01 Perfekt
- **Theorie:** Regel „haben/sein at position 2“ widerspricht dem Beispiel „Hast du deine Eltern besucht?“; Perfekt im
  Nebensatz fehlt („…, weil ich gefahren bin“). haben/sein-Regel zu eng bzw. unvollständig: „jemanden/etwas fahren“
  bildet das Perfekt mit haben („Ich habe meine Tochter zur Schule gefahren“ – aber „ich bin diese Straße oft
  gefahren“), wandern hat auch ohne Ziel „ist gewandert“, aufstehen ist Zustandsänderung, kein Weg von A nach B
  (Duden); `x` in e28 mitändern. Satzklammer nicht als gemeinsames Muster (Perfekt, Modalverb, trennbar, Futur).
- **Ungelernt/fehlt:** e39 fragt den Ersatzinfinitiv ab („habe … warten müssen“), die Theorie erklärt ihn nicht und
  empfiehlt nur „Ich musste …“ (Testschwäche; grammis `terminologie/155`, Duden). Keine Verbkarten für Kernverben
  (gehen, fahren, kommen, essen, schlafen, finden, sitzen); „gekommen“ nur in Lesetexten; gewesen/gehabt/geworden
  fehlen; Zustandsänderung (aufwachen, einschlafen, werden) in keiner Übung; keine Zeitenübersicht, „seit + Präsens“
  ohne Regel.
- **Akzeptanz:** ord e19, e20 („Ich habe meine Eltern am Sonntag besucht.“), e56; kleinere fehlende Varianten in tr/sch
  (z. B. daheimgeblieben, „mit der Bahn“), die meist die KI auffängt.
- **Hinweise:** e24 und e58 nehmen die Wahl des Hilfsverbs vorweg (Testschwäche); e2/e60 verraten mit dem Beispiel die
  erste Tabellenzeile.
- **Didaktik:** keine Umbauübung Präsens → Perfekt; in allen 18 Perfekt-Lücken ist Hilfsverb oder Partizip vorgegeben;
  keine Mischaufgaben mit Kontrastpaaren (geschlafen ↔ eingeschlafen). Lesetext e21: Heuriger nach Wanderung auf den
  Schafberg passt nicht (kein Weinbaugebiet) – Kahlenberg (niedrig).
- **Unterthemen:** d01 bleibt Perfekt-Kern (+ ca. 30 Übungen: Umbau, Zustandsänderung, Nebensatz, kommen,
  Ersatzinfinitiv); Vertiefung haben/sein, Partizipgruppen und Ersatzinfinitiv → d08, aber erst **nach** den
  Kasus-Themen d04–d06; Präteritum gesamt → d21, Futur → d16/d31.

### d02 Wortstellung
- **Theorie:** V2-Regel nur für Aussage und W-Frage; Verb-Erst (Ja/Nein-Frage, Bitte) fehlt, obwohl im Thema selbst
  verwendet (e17, e21); e23 fragt die falsche „always“-Regel ab (hoch). Es fehlt die Übersicht Satzarten + Satzklammer
  und „Position 1 = ein Satzglied, auch ein ganzer Nebensatz“ (hoch, grammis 2289/2277/2269).
- **Fehlt:** Stellung von „nicht“, Mittelfeld über „Zeit vor Ort“ hinaus (Zeit – Grund – Art – Ort, Pronomen vor
  Nomen), Konnektoren auf Position 0 außer „denn“ (aber, sondern, oder), Kommaregel.
- **Akzeptanz:** ord e10, e11, e12, e49 (+ e9, e50, e51) und „zuhause“ in tab e1.
- **Didaktik:** nur e0/e1 sind Umbauübungen; Perfekt im dass-Satz bildet die Lernende nie selbst; sechs Lücken
  (e2–e4, e37–e39) prüfen nur die Präsensform, nicht die Stellung; mehrere Übungen (e6, e7, e9, e11, e27, e28, e32,
  e33, e35, Theorie-Beispiele) sind wörtlich Sätze aus dem Einstufungstest – neue Sätze verwenden.
- **Unterthemen:** d02 bleibt Kern (Übersicht + 8–10 Übungen nur zu den Schwächen, `req ["d01"]`); Rest verteilt auf
  d07 (Imperativ/Verb-Erst), d12 (Wortstellung II: Satzklammer, Mittelfeld, „nicht“), d19 (zu-Infinitiv), d24
  (Konnektoren) des bereinigten Plans.

### d03 als/wenn/wann + Präteritum
- **Akzeptanz:** ord e14, e15, e16, e54, e55, e56 haben je nur eine Lösung – Haupt-/Nebensatz getauscht fehlt; tab e61
  nur „hat sich wohlgefühlt“ (Duden lässt „wohl fühlen“ zu).
- **Hinweise:** e4–e6, e41–e43 verraten die Wahl; einheitlich „when (als, wenn or wann?)“.
- **Theorie:** „wenn = if“ fehlt (Theorie und Karte v1) – mit „ob = whether, if“ aus d02 droht „if → ob“; Minimalpaar
  einmal (als) ↔ immer wieder (wenn) in der Vergangenheit mit Entscheidungsweg fehlt; „wann“ als direktes Fragewort ist
  Ausnahme von „starts a subordinate clause“; „als Kind“ (ohne Nebensatz) nie erklärt; „nachdem + Plusquamperfekt“ zu
  absolut (mit Präsens im Hauptsatz: Perfekt); Präteritum vs. Perfekt in Österreich nur halb erklärt (gesprochen
  überwiegend Perfekt, Modalverben auch mündlich Präteritum – Duden-Sprachratgeber).
- **Ungelernt:** e60 verlangt ging, fuhr, arbeitete – Bildung des Präteritums nirgends gelehrt.
- **Fehlt (Schied [E1]):** Perfekt der Modalverben mit Ersatzinfinitiv – Testschwäche, in keinem Thema und im Plan
  nicht vorgesehen (→ d08 des bereinigten Plans; in d03 ein Erkennen-Tipp).
- **Didaktik:** „wenn“ für Wiederholtes in der Vergangenheit, „wenn“ für ein einmaliges Ereignis in der Zukunft,
  Plusquamperfekt mit „war“, Umbau/Verbinden fehlen oder nur 1×.
- **Unterthemen:** d03 bleibt Kern (als/wenn/wann mit war/hatte/Modalverben) mit 30–35 angehängten Übungen; seit(dem),
  bis, sobald → d20; Präteritum gesamt + Plusquamperfekt → d21; ob/falls → d15/d24.

## Themenplan – bereinigter Vorschlag (Details: `schied/plan.md`, Abschnitt „Bereinigter Plan“)
- d01–d03 bleiben; nur d02 bekommt `req ["d01"]` (sperrt nichts nachträglich: `refreshUnlocks()` schaltet nur
  gesperrte Themen frei, nie zurück – in `js/lernen.js` nachgesehen). Die nicht gebauten IDs d04–d06 werden neu belegt.
- **Block A – A1/A2-Lücken:** d04 Genus + Plural (Markt) · d05 Nominativ/Akkusativ/Dativ mit Gesamttabelle (Geschenk) ·
  d06 Pronomen + Dativverben + zwei Objekte (Nachbarn) · *Checkpoint 1* · d07 Imperativ, Verb-Erst, Reflexivpronomen
  (Arzt) · d08 Perfekt II: haben/sein vertieft, Partizipgruppen, Ersatzinfinitiv (Verspätung erklären) · d09
  Präpositionen mit festem Kasus, wo/wohin/woher, seit (Öffis) · d10 Wechselpräpositionen + legen/liegen (Umzug) ·
  d11 Verben mit Präposition (Small Talk) · d12 Wortstellung II (Besprechung) · *Checkpoint 2*.
- **Block B – B1 festigen:** d13/d14 Adjektivendungen · d15 Konjunktiv II höflich + ob/wenn · d16 Passiv I + werden
  (Vollverb/Futur/Passiv) · d17 Genitiv + n-Deklination · d18 Relativsätze I · *Checkpoint 3* · d19 zu-Infinitiv ·
  d20 Zeitsätze II · d21 Präteritum + Plusquamperfekt · d22 Passiv II · d23 Relativsätze II · d24 Konnektoren ·
  d25 Konjunktiv II irreal · *Checkpoint 4*.
- **Block C – B2 (vorläufig):** d26–d32 (Nominalisierung, Zustandspassiv, Nomen-Verb-Verbindungen,
  Partizipialattribute, Konnektoren II, Vermutungen/Modalpartikeln, Konjunktiv I).
- Regeln: jedes neue Thema hat mindestens `req` d01, d02 und alle Themen, deren Stoff es braucht; ≤ 3 neue Teilregeln;
  Teststärken (Präsens, Komparation, deshalb/trotzdem/obwohl, je … desto, indirekte W-Fragen, Lesen) nur als Kontrast;
  Nomen-Verb-Verbindungen ab d04 als Karten in passenden Situationen; Checkpoint = Bericht an Claude → Analyse →
  Neuplanung (keine neue App-Funktion nötig). Umfang ≈ 29–58 Wochen.

## Matthias' Idee „ganzes Thema erklären“ – Ergebnis und Vorschlag
Die Prüfung bestätigt die Idee: In allen drei Themen fehlt das Gesamtsystem, und genau dort liegen Auroras
Testfehler (z. B. Nebensatz-Stellung, als/wenn/wann, haben/sein). **Vorschlag (Simulations-Chat):**
1. Jedes Grammatikthema beginnt mit einer **Übersicht des ganzen Systems** (eine Tabelle, ≤ 3 Spalten, Prüfliste
   Nr. 6), auch wenn nur ein Teil neu ist; danach der neue Teil im Detail.
2. **Übungen gewichtet:** ca. 70 % auf die schwachen Teile, ca. 30 % Kontrast-, Umbau- und Mischübungen über das ganze
   System, dazu freie Produktion ohne vorgegebenen Bauplan. Hinweise nennen das Format, nie die Entscheidung.
3. **Unterthemen:** ≤ 3 neue Teilregeln je Thema; große Systeme (Wortstellung, Kasus, Zeiten) in aufeinanderfolgende
   Themen, die jeweils dieselbe Übersicht wiederholen und erweitern (Spiralprinzip); nach ca. 6 Themen ein Checkpoint.
4. **Reihenfolge A1 → B2 mit Rücksicht auf Schwächen:** Lücken auf A1/A2-Niveau (Genus, Kasus, Pronomen,
   Präpositionen, Imperativ) kommen zuerst, auch wenn Aurora insgesamt B1 ist; Stärken werden nicht eigens geübt.
5. **Keine Testsätze** als Übungen – sonst lernt sie die Antwort statt der Regel, und ein späterer Vergleichstest ist
   wertlos.

## Für den Funktionen-Chat (Engine, gilt für beide Apps)
- `ord` und `tab` werden nur lokal geprüft (`js/formate.js` Z. 459 ohne Richter; `checkTable` → `tabMark`); der
  automatische Test zu Prüfliste Nr. 9 prüft nur, ob die Lösung aus den Kärtchen bildbar ist. **Vorschlag:** Warnung in
  `tools/pruefen.mjs`, wenn eine ord-Lösung ein Komma und ein Nebensatzwort (als, wenn, bevor, während, nachdem, weil,
  dass, ob, wann …) enthält, `a` aber nur einen Eintrag hat („Haupt-/Nebensatz getauscht ergänzen?“). Betrifft auch
  Opi suomea (ord mit Nebensätzen). Quelle: `schied/d03.md` [E2].

## Eigene Kontrolle (Simulations-Chat, selbst nachgesehen)
- Original `lektionen.json` (8ca1818): ord-Lösungen von d01 e20, d02 e10/e11/e12/e49, d03 e14/e15/e16/e54/e56 – jeweils
  fehlt die genannte Variante; Hinweise d01 e24/e58 und d03 e4–e6/e41–e43 verraten die Wahl; d02 Theorie „always at
  position 2“; `req` d01 `[]`, d02 `[]`, d03 `["d01","d02"]`.
- Engine: ord ohne KI (`js/formate.js` 459, `js/uebungen.js` 600/613), Tabellen nur lokal, `norm()` ignoriert Groß-/
  Kleinschreibung und Satzzeichen; `refreshUnlocks()` sperrt nie zurück.
- `texte/`: „gekommen“ in d01 nur in Lesetexten (e22, e57), „gehabt“ erst in d02, „geworden“ in d01–d03 nirgends.
- Bereinigter Plan stichprobenweise: österreichische Formen (ist gelegen/gestanden/gesessen, Paradeiser, Erdäpfel,
  Karfiol, Meldezettel, Öffis, AMS) und Grammatikangaben (Pronomen „Ich schicke ihn Ihnen“, wegen + Dativ
  umgangssprachlich) stimmen (eigenes Wissen, nicht eigens belegt).

## Entscheidungen für Matthias
| Code | Option | Effort |
|---|---|---|
| **S-1011-10** | Auftrag `uebergabe-deutsch-trainer.md` vollständig an den Deutsch-Trainer-Chat: Korrekturen d01–d03, Übersichten + Übungen anhängen, d02 `req`, bereinigter Plan als Vorschlag für `docs/lehrplan.md`, neue Prüflisten-Zeilen. Der Chat erklärt, vergibt D-Codes und ändert erst nach deinem OK. | high |
| **S-1011-11** | Nur die Korrekturen in d01–d03 (Akzeptanz, Hinweise, Theorie-Fehler, `req`) weitergeben; Plan, Unterthemen und neue Übungen erst nach einem Gespräch mit dir. | medium |
| **S-1011-12** | Vorschlag „Warnung für ord mit nur einer Lösung“ an den Funktionen-Chat (in `docs/ideen.md` sammeln oder umsetzen). | low |
| **S-1011-13** | Den Funktionen-Chat bitten, `docs/pruefungen/deutsch/` von diesem Branch nach `main` zu übernehmen. | low |
Empfehlung: S-1011-10 + S-1011-12 (+ S-1011-13, sobald es dir passt).

## Teil 2: Einstufungstest und Abdeckung (S-1011-15, 12.10.2026)
Auftrag: Einstufungstest selbst prüfen (169 Aufgaben, Musterlösungen, Prüf- und Bewertungslogik, Niveau-Einstufung) und
„checken, ob alle Problem-Themen abgedeckt sind mit ausreichenden Unterthemen“. Methode wie Teil 1: 4 Prüfer (T1 A1–A12,
T2 A13–D2, B Bewertung/Einstufung, A Abdeckung), 2 Schiedsrunden mit eigenem Nachschlagen und Nachstellen des Codes in
node, eigene Kontrolle. Dateien: `anleitung-test.md`, `texte/einstufungstest.txt`, `funde/test-*.md`,
**`schied/test-aufgaben.md`, `schied/test-bewertung.md`** (Endurteile).

**Ergebnis**
1. **Testaufgaben:** Das Deutsch ist richtig, österreichische Formen stimmen (Jänner, Sackerl, e-card, das/der Gehalt).
   Probleme: mehrdeutige Lücken (A13.3 ob ↔ wann, A18.6 seit ↔ weil, A13.4 während ↔ bevor/sobald, B1-Wortbank ohne
   Ablenker), fehlende richtige Varianten (die Herren A8.8, Erfahrungen machen B1.6, nicht Arzt, sondern … A15.3,
   nachhause, gegen/ab 18 Uhr, übers Wochenende, sowohl … wie), Genitiv nach Präposition wird nicht sicher gemessen
   (A8.3 „trotz“ in Österreich auch mit Dativ – Duden; A9.6 „während der“ = Dativform), A17 „Mixed B1 grammar“ ist
   A1/A2-Stoff, B2 nur mit 3–4 Aufgaben, Lesen nur ein B1-Text mit 4 richtig/falsch, Schreiben ohne Argumentation.
   Offen (Quelle nicht erreichbar): B4.5 Heizkosten als Betriebskosten (nach MRG eher getrennt – ohne Quelle).
2. **Prüf- und Bewertungslogik (Engine `js/einstufung.js`, gilt für beide Apps):** KI-Nachprüfung von Lücken ohne
   Abschnittstitel, Hinweis und Wortbank, Auftrag „regionale Varianten sind richtig“ → themenfremde Antworten zählen
   (Januar statt Jänner, weil statt seit, Indikativ statt Konjunktiv II); KI-Hochstufungen im Bericht nicht erkennbar;
   bei Lücken kein ☆ „Meine Fassung stimmt auch“ (ohne KI bleiben richtige Antworten falsch); Mehrlücken-Aufgaben alles
   oder nichts, teilweise Beantwortetes zählt nicht; ß/ss nicht locker; Schreiben ohne Bewertungsraster; zweiter
   KI-Versuch „unter 120 Wörter“ unerfüllbar für D2/A18.
3. **Einstufung „B1-“ als Gesamtniveau nicht belastbar:** Es gibt keine Einstufungsregel; das Niveau ist ein einzelnes
   KI-Urteil, dessen Auftrag die Selbsteinschätzung B1, das Ziel B2, die Beispiele „B1-“ … „B2-“ (`APP.levelHint`,
   selbst nachgesehen in `js/app.js` Z. 18) und die Persona „at B1 level“ enthält. **Belastbar ist ein Profil:** Lesen
   B1 wahrscheinlich, österreichischer Grundwortschatz A2 sicher, Grammatik A2 mit A1-Lücken, Schreiben A2/A2+, Hören
   und Sprechen nicht getestet. Persona und levelHint verankern auch alle anderen KI-Funktionen auf B1.
   Vom Ergebnis zu den Themen gibt es keine Regel (deshalb kam d03/B1 vor den A1-Lücken); der bereinigte Plan behebt das
   inhaltlich.
4. **Abdeckung:** 77 im Test falsche Teilregeln (inkl. Schreibproben), Liste vollständig (Schied geprüft). Im
   bereinigten Plan 61 ausreichend, 13 knapp, 3 fehlten. **Nach den Ergänzungen der Schiedsrunde ist jede Teilregel
   abgedeckt** – unter der Bedingung, dass die Korrekturen zu d01–d03 (Teil 1) umgesetzt werden:
   - neues Thema nach d06 „Ist das deiner? – Wem gehört was?“ (A2; meiner/meins, keiner/keins, einer/eins,
     der/den/dem allein, gehören + Dativ) – endgültige ID d07, folgende IDs +1;
   - d16 nur werden dreifach + Passiv Präsens + von/man; Passiv Präteritum nach d22 (Passiv II);
   - kleine Zusätze ohne neue Teilregel: Genus-Signale ausdrücklich in d04, seit ↔ vor in d09, Nomen mit Präposition
     (Angst haben vor …) in d11, getestete Nomen-Verb-Verbindungen als Karten in d11/d12/d15/d16/d20 (System erst d28),
     Ordinal-Sonderformen + derselbe + Wohnkosten-Karten in d13, Höflichkeitsform/Briefanrede in d15, Genitiv-Adjektiv
     + Herr/Nachbar in d17, Präteritum-Produktion in d21 auf Mischverben und ca. 20 starke Verben begrenzen;
   - Lehrplan: Phase 1 „A1/A2-Lücken schließen, B1 festigen“, Profil statt „B1-“.
   Einzelheiten: `schied/test-bewertung.md`, Abschnitt „Ergänzungen zum bereinigten Plan“.
5. **Vertraulichkeit (Schied [E2]):** `funde/test-abdeckung.md` ordnete in einer früheren Fassung jeder Schwäche die
   Aufgaben-Nummern zu – das zeigte, welche Aufgaben falsch waren. Im aktuellen Stand entfernt (Commit 7565eed); in
   älteren Commits dieses öffentlichen Branches (6021b20 … 2e19edf) noch enthalten → Entscheidung S-1011-16/-17.

**Zahlen (nach Schied):** Testaufgaben 78 Funde (47 bestätigt, 14 teilweise, 7 abgeschwächt, 7 übertrieben, 2 doppelt,
1 offen; 0 hoch, 14 mittel) + 3 eigene; Bewertung/Abdeckung 60 Funde (35 bestätigt, 15 abgeschwächt, 7 teilweise,
1 übertrieben, 2 doppelt; 0 hoch, 15 mittel) + 3 eigene (1 hoch: Vertraulichkeit).
**Eigene Kontrolle:** `APP.levelHint` und Auftrag der Gesamteinstufung (`js/einstufung.js` Z. 588) selbst
nachgesehen; Aufgaben-IDs in den Schwächenlisten selbst entfernt und alle Prüfdateien auf Antworten der Lernenden
durchsucht (keine gefunden). **Urteil:** Als Diagnosetest für A2/B1-Grammatik misst der Test im Wesentlichen, was er
soll – die Schwächen sind belastbar; A2 ↔ B1 trennt er grob, B1 ↔ B2 praktisch nicht.

**Entscheidungen zu Teil 2**
| Code | Option | Effort |
|---|---|---|
| **S-1011-16** | Branch-Geschichte bereinigen: `pruefung/deutsch-inhalte-2026-10-11` aus `main` neu aufbauen mit einem einzigen Commit des heutigen (bereinigten) Stands und mit Force-Push ersetzen; alte Commits mit Aufgaben-Nummern verschwinden aus dem Branch (Kopien bei GitHub/Forks lassen sich nicht ausschließen). | low |
| **S-1011-17** | Geschichte so lassen; nur der aktuelle Stand ist bereinigt. | – |
| **S-1011-18** | Testkorrekturen an den Deutsch-Trainer-Chat (`js/inhalte.js` gehört dort): Varianten in `s`, mehrdeutige Lücken mit Tag, Genitiv-Aufgaben A8.3/A9.6, B1-Ablenker, A17-Titel, Niveau je Aufgabe, B2-Ausbau (Lesetext, argumentatives Schreiben); dazu Persona/`APP.levelHint` (`js/app.js`) und Lehrplan-Profil – im Auftrag `uebergabe-deutsch-trainer.md`. | medium |
| **S-1011-19** | Engine-Korrekturen der Einstufung an den Funktionen-Chat (`uebergabe-funktionen.md`): KI-Nachprüfung mit Titel/Hinweis/Wortbank, ☆ auch bei Lücken, KI-Hochstufungen im Bericht kennzeichnen, Teilpunkte/Unbeantwortetes, ß/ss locker, Schreibraster, Einstufungsregel bzw. Profil je Fertigkeit, Warnung ord mit einer Lösung (= S-1011-12). | high |
| **S-1011-20** | Plan-Ergänzungen (neues Pronomen-Thema, d16/d22, Zusätze) zusammen mit S-1011-10 an den Deutsch-Trainer-Chat. | medium |
S-1011-14 ist durch S-1011-15 erledigt. Empfehlung: S-1011-16, S-1011-18, S-1011-19, S-1011-20 (+ S-1011-10, -12, -13
aus Teil 1). Nächster freier Code: S-1011-25 (S-1011-21 → in S-1011-23 umgesetzt, S-1011-22 nicht gewählt, S-1011-23 erledigt, S-1011-24 nicht gewählt).

## Teil 3: Endgültiger Themenplan (S-1011-23, 12.10.2026)
Matthias wählte S-1011-23 (Prüfdokumente nach den Empfehlungen umbauen; Effort high). Ergebnis: **`plan-final.md`** –
eine einzige Fassung aus bereinigtem Plan, Ergänzungen aus Teil 2 und Feinschliff S-1011-21 (33 Themen, neues
Pronomen-Thema d07, Präpositionen d09 vor Perfekt II d10). `req`-Graph automatisch geprüft (keine Zyklen, alles
erreichbar). Unabhängige Prüfung `schied/plan-final-pruefung.md`: Niveaufolge A1 → B2 und alle 33 Niveauangaben
stimmen (ÖIF), jede der 77 Teilregeln hat ein Thema; 18 Funde (0 hoch, 6 mittel), alle eingearbeitet. **Korrektur einer
eigenen Empfehlung:** „d03 erst nach Block A“ (S-1011-21) war falsch begründet – d03 braucht d13 nicht, sein Stoff ist
großteils A1+/A2 und eine zentrale Testschwäche; jetzt d03 nach d09, vor d10 (d10 braucht d03). Weitere Korrekturen:
d02-Zeile vollständig, d13 als Wiederholung + Verbkomplex im Nebensatz + Satz-/Sondernegation, d25 auf ≤ 3 neue
Teilregeln, d04 „Ge-…-e meist“, fehlende `req` (d10, d11, d23, d30), Block C umgeordnet (Vermutungen vor
Konnektoren II, „als ob“ zu Konjunktiv I). Auftrag an den Deutsch-Trainer-Chat zu einer Liste nach Priorität
zusammengeführt. Branch-Bereinigung (S-1011-16): vom Sicherheitsfilter der Sitzung blockiert (Force-Push), offen.

## Dateien
- **`plan-final.md`** – endgültiger Themenplan; `uebergabe-deutsch-trainer.md`, `uebergabe-funktionen.md` – Aufträge.
- `anleitung.md`, `anleitung-test.md`, `schied-anleitung.md` – Aufträge der Prüfer; `texte/` – aufbereitete Themen;
  `werkzeuge/extrahieren.cjs`, `schied-eingang.cjs`, `schied-zaehlen.cjs`.
- `funde/<id>-k.md`, `funde/<id>-v.md`, `funde/plan.md` – Erstprüfung (mit Inventar, Abdeckung, Großes Bild,
  Unterthemen); `schied/eingang-*.md` – nummerierte Funde; `schied/<id>.md`, `schied/plan.md` – **Endurteile**.
- Nicht im Repository (vertraulich bzw. urheberrechtlich): Testergebnis, ÖIF-Textkopien (Arbeitsordner des Chats).

## Quellen
duden.de, dwds.de, de./en.wiktionary.org (teils 429), grammis.ids-mannheim.de (mit Playwright), ostarrichi.org,
integrationsfonds.at (ÖIF-Einstufungsmatrizen A1–B2, Rahmencurricula A2/B1/B2:
`https://www.integrationsfonds.at/fileadmin/user_upload/<Stufe>_Rahmencurriculum_OEIF.pdf`,
`<Stufe>_OEIF-Einstufungsmatrix_modular.pdf`), Duden-Sprachratgeber; Regeldateien des Deutsch-Trainers
(`lektionen/pruefliste.md`, `CLAUDE.md`, `docs/lehrplan.md`) und Engine-Code. goethe.de und coe.int blocken
automatische Abrufe. Jeder Fund nennt seine Quelle oder „ohne Quelle“ (eigenes Wissen).

## Arbeitsstand
- 11.10.2026: Branch angelegt, Themen aufbereitet, 7 Agenten gestartet; am Wochenlimit ohne Funde abgebrochen.
  EINSTUFUNGSTEST von Matthias erhalten (S-1011-4, nur vertraulich im Arbeitsordner). Zusatzauftrag aufgenommen:
  großes Bild statt Teilreparatur, Unterthemen, Niveaufolge A1→B2 mit Rücksicht auf Schwächen (Anleitung ergänzt).
- 12.10.2026: 7 Erstprüfungen (06:05–11:10 UTC, zwei Neustarts nach Sitzungslimit), 4 Schiedsrunden, eigene Kontrolle,
  Bericht und Auftrag für den Deutsch-Trainer-Chat. Wecker `trig_014ggA9PdDdXojRSR3Z6JAt7` gelöscht.
- 12.10.2026: Matthias wählt **S-1011-15** (Einstufungstest selbst prüfen) und ergänzt: „Checken, ob alle Problem-Themen
  abgedeckt sind mit ausreichenden Unterthemen.“ Test aufbereitet (`werkzeuge/test-extrahieren.cjs` →
  `texte/einstufungstest.txt`), Anleitung `anleitung-test.md`, 4 Agenten (T1 A1–A12, T2 A13–D2, B Bewertung/Einstufung,
  A Abdeckung/Unterthemen), Effort high. Offene Codes S-1011-10 bis -14 bleiben offen; nächster freier Code S-1011-16.
- 12.10.2026 (Nachmittag): S-1011-15 – 4 Prüfer (nach Sitzungslimit 16:02 UTC neu gestartet), 2 Schiedsrunden, eigene
  Kontrolle, Aufgaben-IDs aus Schwächenlisten entfernt, Bericht Teil 2, `uebergabe-funktionen.md`, Auftrag an den
  Deutsch-Trainer-Chat ergänzt. Wecker `trig_01BZ2BUEiuHP1CdmnCRYQHsi` gelöscht.
- 12.10.2026 (Abend): S-1011-23 – `plan-final.md`, unabhängige Prüfung, Korrekturen eingearbeitet, Aufträge
  vereinheitlicht. Branch-Bereinigung (Force-Push) vom Sicherheitsfilter blockiert – braucht Matthias. Wecker gelöscht.
