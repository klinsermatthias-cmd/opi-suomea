# Prüfliste Engine (Funktionen-Chat)

Jede Optimierung und jede Meldung von Matthias ergibt eine Zeile (E-1009-15). **Vor jedem Push** wird die Liste durchgegangen; „Test“ nennt die automatische Prüfung in `tools/pruefen/` (Meldungstext), „–“ = nur von Hand prüfen. Neue Zeilen unten anhängen und, wo möglich, mit einem Test absichern. Inhalte haben eigene Listen (`lektionen/pruefliste.md`, Deutsch-Trainer: dessen Liste).

**Regeln (E-1009-17):**
- **Lehren für die KI in der App** (Bewertung, erzeugte Übungen, Analyse) gelten erst, wenn sie im Auftrag an die KI stehen (`JUDGE_RULES`, `SP.judge`, Prompts in `js/ki.js`, `js/ki-ueben.js`, `js/vokabeln.js`, `js/formate.js`) – Opettaja liest diese Liste nicht. Dazu ein Test, der die Regel im Auftrag prüft.
- **Aufteilen erst ab ca. 60 Zeilen:** dann je Bereich eine eigene Datei (`docs/pruefliste/bewertung.md`, `sync.md`, `anzeige.md` …), diese Datei wird zum Inhaltsverzeichnis; vor einem Push nur die betroffenen Bereiche lesen.

## Ablauf
| Prüfen | Beispiel | Code | Test |
|---|---|---|---|
| Neuer Test schlägt bei absichtlich kaputtem Code an (Gegenprobe) | `typoOf` kaputt → Meldung statt Absturz | E-1008-58 | – (bei jeder neuen Funktion) |
| Deutsch-Trainer lokal mit der neuen Engine prüfen; „Engine übernehmen“ erst nach grünem Prüflauf von opi-suomea | Übernahme lief zu früh und nahm den alten Stand | E-1008-58 | – |
| Keine App-Texte fest im Engine-Code, immer über `APP` | „Opettaja“/„Matthias“ im Code statt `APP.teacher`/`APP.learner` | CLAUDE.md | Durchlauf beider Apps |
| Sprachregeln im Code (`js/sprache.js`, KI-Aufträge, Endungen fürs Antippen) nur mit Quelle; in der Meldung an Matthias Quelle nennen bzw. „eigenes Wissen“ kennzeichnen | Endungsliste `SP.ends`, Längen-Regel in `JUDGE_RULES` | E-1009-26 | – |

## Daten und Sync
| Prüfen | Beispiel | Code | Test |
|---|---|---|---|
| Neues synchronisiertes Feld: `defaultState`, `mergeStates`, Lösch-Liste in `applyWipe`, Merge-Test | `slips`, `vocAlt`, `unlearned` | E-1008-58/-59, E-1009-3 | „Abgleich … falsch“ |
| Zurücknehmbare Markierungen: jüngste Änderung gewinnt beim Abgleich (Zeitstempel `xu`), nicht Vereinigung | ⚑ an Vokabel-Antwort, „Noch nicht gelernt?“ zurückgenommen | E-1008-59, E-1009-3 | „jüngere Rücknahme gewinnt nicht“ |
| Netzabbrüche im Hintergrund (iOS „Load failed“) nicht als App-Fehler melden; Wiederholung bleibt | Wegwischen der App während des Uploads | E-1009-8 | „Sync: Hintergrund-Abbruch“ |
| Zeitstempel der Cloud: Supabase speichert Mikrosekunden – Vergleiche auf ms-Bereich (`gte`/`lt`), Lesen über `pgMs`; Fehlerprotokoll nennt den Grund | „Hochladen: Sync-Konflikt“ nach Einrichtung (Deutsch-Trainer) | E-1010-3 | „Sync: Zeitstempel mit Mikrosekunden …“ |
| Cloud übernimmt eine Änderung still nicht (0 Zeilen trotz passendem Zeitstempel): Prüfabfrage + Ausweichweg (POST), Grund ins Fehlerprotokoll; eingearbeiteten Cloud-Stand nicht erneut als „geändert“ werten | Deutsch-Trainer am PC: Cloud seit Einrichtung unverändert | E-1010-4 | „Sync: Cloud übernimmt Änderungen still nicht …“ |
| Neue Cloud-Tabelle: Row Level Security (eigene Zeilen; Lese-Konto nur `select`), Prüfung in `supabase-wach-halten.yml` (ohne Anmeldung weder lesen noch schreiben), keine Schlüssel/Passwörter im Inhalt, Fehler stören den Sync nicht | Tabelle `berichte` | E-1010-6 | „Bericht für Claude in der Cloud …“ |
| Import/Export: Importformat = das, was die App selbst speichert (z. B. Lücken-`first` als Text); `null` in Listen wie leer; ältere Formate weiter annehmen; Test mit echtem Exportbeispiel, nicht mit Annahmen | Einstufungstest-Import verwarf Lücken-Bewertungen | E-1010-2 | „Einstufungstest-Import: …“ |

## Bewertung (lokal und KI)
| Prüfen | Beispiel | Code | Test |
|---|---|---|---|
| Tippfehler = genau ein Buchstabe; im Finnischen ist Vokal-/Konsonantenlänge kein Tippfehler | „nähdän“, „olkon“ → falsch | E-1009-5 | „Bewertungsregeln: Länge/Tippfehler“ |
| Nur wegen Tippfehler anerkannte Antworten nicht als Alternative merken | „ei kostin hyvin“ in `vocAlt` | E-1009-6 | „Tippfehler-Antwort gemerkt“ |
| Lücken: gleiche grammatische Form wie die Musterlösung; Hinweis als „Gesucht ist“ an die KI | „joi“ statt „juo“ | E-1009-14 | „Lückentext: strenge Form-Regel“ |
| Endungs-Lücken: ganzes Wort auf Endung kürzen, andere Endung falsch, KI bekommt den richtigen Satz | „kirjastona“ bei `kirjasto___` (-ssa) | E-1009-12 | „Endungs-Lücke: …“ |
| Strenge Übungen (ä/ö, Endungen): keine ä/a-Toleranz, kein „Nur vertippt“ | `Asut___` → „ko“ statt „kö“ falsch | E-1008-3, E-1009-10 | „Endungs-Lücke nicht streng“ |
| Groß-/Kleinschreibung im Deutschen zählt (außer Satzanfang) | „sie“ statt „Sie“ | E-1008-9 | `sprachen.mjs` (Groß-/Kleinschreibung) |
| Fehler, die keine echten sind, vollständig zurücknehmen: Rundenwertung, Wiederholung, Fehler-Training, Statistik | „trotzdem richtig“, „Noch nicht gelernt?“, ✗ KI-Übung | E-1009-3, E-1009-10 | „Trotzdem richtig: …“ |
| „Trotzdem richtig“ nur nahe an der Lösung (≤ 2 Buchstaben), immer im Bericht sichtbar | „qqqq“ → kein Link | E-1009-10 | „Link auch bei ganz falscher Antwort“ |
| Selbstwertungen („Nur vertippt“) umschaltbar und erst bei „Weiter“/Verlassen/Hintergrund gezählt – ein versehentlicher Tipp hinterlässt keine Spuren | aus Versehen „Nur vertippt“ getippt | E-1010-5 | „Trotzdem richtig: … (E-1010-5)“ |

## KI-Aufträge
| Prüfen | Beispiel | Code | Test |
|---|---|---|---|
| Beispielwerte im JSON-Muster werden wörtlich übernommen: Platzhalter eindeutig beschreiben, Antwort prüfen, Ungültiges im KI-Protokoll kennzeichnen | „topicId 0T“ | E-1009-7 | „Gesamtanalyse: Prüfung der Termine“ |
| Großzügige Regeln („im Zweifel richtig“, Alternativen) nicht dort, wo genau eine Form verlangt ist | Essiv statt Inessiv als „gleichwertig“ | E-1009-12/-14 | wie oben |

## Anzeige und Eingabe
| Prüfen | Beispiel | Code | Test |
|---|---|---|---|
| Lösung steht nicht in der Angabe (Klammern/„:“-Teil verdecken) | „Schuh (kengät = Schuhe)“ | E-1008-57 | `promptNoSpoiler` im Durchlauf |
| Antwortfelder ohne Autokorrektur | iOS ersetzt finnische Wörter | E-1008-57 | „Antwortfelder ohne Autokorrektur“ |
| Vorlese-Knöpfe in Theorie-Tabellen (erste Spalte, `sayall` = alle) | Alphabet nur links vorgelesen | E-1008-51 | „Theorie-Tabellen: Vorlese-Knöpfe“ |
| Ansichten in 390 px ohne waagrechtes Scrollen | Handy-Ansicht | – | Durchlauf „Ansichten (390 px)“ |

## Tokens und Ausgaben (T-1012)
| Prüfen | Beispiel | Code | Test |
|---|---|---|---|
| Werkzeuge geben lokal nur das Nötige aus; vollständige Ausgabe nur auf Wunsch (`--lang`) bzw. in CI | `pruefen.mjs` 71 Zeilen „✓“ → 1 Schlusszeile | T-1012-14 | Schlusszeile „… Prüfungen bestanden (Kurzmodus …)“ |
| GitHub-Status nie als rohes JSON (≈ 16 KB je Abfrage), nur `tools/ci-status.mjs` | `curl …/actions/runs` | T-1012-13 | „Werkzeuge tools/quellen.mjs und tools/ci-status.mjs …“ |
| Quellen kompakt: `tools/quellen.mjs` statt ganzer Seiten | Wiktionary-Rohtext 10–50 KB | T-1012-20 | wie oben |
| Handprüfungen, die sich automatisieren lassen, ins Prüfskript (billiger und zuverlässiger) | doppelte Karten trotz Handprüfung | T-1012-19 | „Prüfliste 6/8/9 …“ |
| Fehlerpfade von Werkzeugen geben **eine** Zeile aus, keinen Stacktrace (kostet sonst Tokens) | `ci-status.mjs --repo … <Kürzel>` → 80 Zeilen Node-Fehler | T-1012-13 | – (Gegenprobe von Hand) |
| Satz ordnen (`ord`) und Tabellen (`tab`) werden ohne KI geprüft: bei Nebensätzen alle richtigen Wortstellungen in `a` | „Ich weiß nicht, ob er kommt.“ nur eine Lösung | S-1011-12, E-1012-29 | `pruefen.mjs` Hinweis „Satz ordnen mit Nebensatz“ |
| KI-Nachprüfung im Einstufungstest bekommt Abschnittstitel, `hint` und Wortbank; keine pauschalen Lockerungen (regionale Varianten, „nur der neue Teil“) | Wortschatzaufgabe mit österreichischem Ziel als richtig gewertet | S-1011-19 Nr. 1, E-1012-30 | – (vor zweitem Test umsetzen) |
| Selbstbewertungen ☆ und KI-Hochstufungen im Bericht kennzeichnen, damit Claude sie nachprüft | Hochstufung ohne Vermerk | S-1011-19 Nr. 2, E-1012-30 | – |
| Zählung: teilweise beantwortete Mehrlücken-Aufgaben und ausgelassene Aufgaben nicht stillschweigend weglassen | Mehrlücke halb richtig fehlt in der Statistik | S-1011-19 Nr. 3, E-1012-30 | – |
| Normalisierung im Test wie in den Übungen (ß/ss locker, `SP.loose`); Großschreibung bei ganzem getipptem Wort prüfen | „Strasse“ falsch, „strasse“ richtig | S-1011-19 Nr. 4, E-1012-30 | – |
| KI-Schreibbewertung mit Raster je Kriterium; Wiederholungsauftrag nach ungültigem JSON muss erfüllbar sein | „unter 120 Wörter“ bei D2/A18 | S-1011-19 Nr. 5, E-1012-30 | – |
| Einstufung ohne Verankerung (Selbsteinschätzung, Beispielniveaus); Profil je Fertigkeit statt Gesamtniveau | Gesamtniveau folgt der Selbsteinschätzung | S-1011-19 Nr. 6, E-1012-30 | – |
| Sync: „ungesendet“ nie über Uhrzeiten vergleichen (`S.updated !== CFG.syncedAt`), Geräteuhren können abweichen | Uhr A 5 min vor → B verlor ungesendete Karte | S-1012-121, E-1013-1 | `sync.mjs` „Uhr eines Geräts geht vor“ |
| Großschreibregel der Lernsprache nur bei Antworten in der Lernsprache (lokal und im KI-Auftrag), nicht bei Antworten in der Ausgangssprache (`tr` dir „fi“, Vokabel → Ausgangssprache, Hörsätze) | „i“, „monday“ falsch im Deutsch-Trainer | S-1012-122, E-1013-1 | `sprachen.mjs` |
| KI-Urteile nur als echtes `true` werten (`aiBools` in `parseJSON`); Vergleich mit NFC | `"correct": "false"` zählte als richtig | S-1012-125, E-1013-1 | – |
| Kalendertage (gestern, morgen) über `setDate`, nie `± 24 h` (Sommerzeit) | Serie brach am 25.10. 23–24 Uhr | S-1012-125, E-1013-1 | – |
| Kein Rückgängig versprechen, wenn die Sicherheitskopie nicht gespeichert wurde (`safeCopy` liefert true/false) | „Alles löschen“ bei vollem Speicher | S-1012-126, E-1013-1 | `sicherungen.mjs` „Löschen bei vollem Speicher“ |
| Seltene, teure Läufe (Gesamtanalyse) beim Start vermerken und sofort hochladen, bei Fehlschlag zurücksetzen | Analyse an zwei Geräten am Folgetag | S-1012-105, E-1013-1 | `befunde.mjs` |
| Handy-Oberfläche: Tippflächen ≥ 32 px, Kontrast ≥ 4,5:1 in beiden Modi | Text-Knöpfe 17 px | S-1012-117 | `docs/pruefungen/ui-2026-10-12/ui-pruefung.mjs` (von Hand) |
| Jede Freitext-Bewertung, die sonst die KI entscheidet (auch `dlg`), bietet ohne KI (Ausfall, aus, nicht eingerichtet) die Selbstbewertung an | Dialog bei Gemini-Limit falsch | S-1012-123, E-1013-2 | `durchlauf.mjs` (Dialog/Schreibaufgabe ohne KI) |
| Zusammenführen: Verlauf `hist` beider Geräte vereinigen (nichts vor Zurücksetzen/Löschen), `best` als Maximum, bei Gleichstand früherer Termin | vorgezogener Termin ging verloren | S-1012-124, E-1013-2 | `durchlauf.mjs` (Abgleich) |
| Deutsch: Nomen-Karten mit Artikel/Plural liefern Einzelwort und Plural fürs Antippen; Wortprüfung prüft großgeschriebene Wörter (Nomen) statt sie als Namen zu überspringen | „Ei“ nicht antippbar ohne `GLOSS_EXTRA` | S-1012-102, E-1013-2 | `sprachen.mjs`, Wortprüfung (`WORTCHECK=alle`) |
| Gerätekonfiguration bei vollem Speicher wie der Lernstand schreiben (`freeRoom`), sonst Fehlerprotokoll | erneuertes Token nicht gespeichert | S-1012-125, E-1013-2 | – |
| Satz ordnen: Schreibung eines Bausteins ist nicht änderbar – der klein angezeigte erste Baustein gilt in anderer Stellung wieder groß | Name als erster Baustein | S-1012-125, E-1013-2 | `sprachen.mjs` |
| Service Worker offline: Startseite zuerst aus „./“, dann „./index.html“ | alte index.html mit gelöschten Skripten | S-1012-125, E-1013-2 | – |
| Tabellen (Groß/klein-Sprachen): ganzer Satz (endet auf . ! ?) oder Fragewort (`SP.caseFreeWords`) am Zellanfang frei; Alternativen, die sich nur in Groß/klein unterscheiden, greifen (passende Schreibung zuerst); jede Alternative jeder Zelle lokal richtig | „heute bleibe ich zu Hause.“, „wem“, „Welcher“ als falsch | S-1013-7 | `sprachen.mjs`, `inhalte.mjs` |
| Wortkarten und Diktat in der Lernsprache: Klammerzusatz („(Pl.)“) nicht verlangen und nicht vorlesen, bei Nomen mit Plural die Einzahl allein richtig; Ausgangssprache: nur „(auch: …)“ ist Alternative; Deutsch: ae/oe/ue fast richtig, zuhause = zu Hause; Englisch: Kurzformen = Langformen; freistehender Strich wie Satzzeichen | „die Kopfschmerzen“ im Diktat falsch, „Austria“ als Antwort richtig | S-1013-9 | `sprachen.mjs` |
| Erklärung `x` einer Übung nach jeder Antwort zeigen (richtig, falsch, „Weiß ich nicht“), nie doppelt | `x` nur bei „Weiß ich nicht“ sichtbar | S-1013-8 | `sprachen.mjs` |
| KI-Bewertung einer Antwort in der Ausgangssprache: keine Regeln der Lernsprache (Artikel, Subjektpronomen, Umlaut-Strenge); Aufträge nennen Richtung „dir fi“ und die Sprache von `x`/`h`/`why` (`APP.explain`); Wortregel je App (`APP.wordRule`) | englische Antwort nach deutschen Artikelregeln beurteilt | S-1013-10 | `sprachen.mjs` |
| Vorlesen: Hauptvariante der Sprache vor fremden Varianten (de-AT → de-DE → andere); Bindestrich in „E-Card“ mitlesen; Überschriften der Wortseite aus `APP.vocabName` | „ECard“ vorgelesen | S-1013-22 | `sprachen.mjs` |
| Prüfhinweise ohne Zeilennummern einer bestimmten Prüfliste (jede App hat eigene Nummern); Varianten je Art nur nach `APP.pruefVarianten`; Verbkarten „to …“ mit „(… · … · …)“; „Austria“ nur mit „Germany: …“ | „Prüfliste 6“ meinte in Opi doppelte Karten, im Deutsch-Trainer Zeile 4; d01 v14 „snack (Austria)“ | S-1013-23 | ja (`statisch.mjs`, Hinweise mit Ausnahmen in `pruef-ausnahmen.json`) |
| KI-Fehlermeldung nennt den eingestellten Anbieter (Gemini, OpenRouter, Groq …) und hängt die Originalmeldung kurz an; keine leere Klammer | „Gemini überlastet“ bei OpenRouter, „402: Insufficient credits“ verschluckt | E-1008-35 | `ki.mjs` |
| Vokabeltrainer am PC: Leertaste deckt auf, 1–4 bewerten (Nochmal/Schwer/Gut/Einfach), nie in Eingabefeldern und nicht mit Strg/Alt | Ziffer im Antwortfeld bewertet die Karte | Ideenliste 11.10. | `durchlauf.mjs` |
| Als „Noch nicht gelernt?“ gemeldete Übungen zählen nicht im Rundenergebnis (Hinweis „N Übungen … zählt nicht“); nur Gemeldetes → 0 % | Runde 75 % trotz markierter Übung | E-1012-1 | `tools/pruefen/befunde.mjs` |
| Tippflächen am Handy ≥ 32 px (Text-Links in Absätzen, Wörter in Tabellen/Theorie, Lautsprecher unsichtbar vergrößert); Hinweis-Toast oben, wenn unten ein Eingabefeld liegt; Kontrast ≥ 4,5:1 hell/dunkel | „Sicherung einspielen“ 17 px hoch; Toast über Tabellenzeile | S-1012-117 | `tools/pruefen/durchlauf.mjs`; Werkzeug `docs/pruefungen/ui-2026-10-12/ui-pruefung.mjs` |
| Verbformen `{f:[…]}` als 3. Element einer Vokabel: nur Anzeige (unter dem Lernsprachen-Wort, bei umgekehrter Karte erst nach Aufdecken), nicht vorgelesen, im Antipp-Wörterbuch; ohne Feld keine Änderung | „er hat vereinbart“ als Antwort verlangt oder mit vorgelesen | E-1013-4 | `tools/pruefen/sprachen.mjs` |
| „⚠ Fehler in der Übung?“ unter jeder Lektions-Übung und „⚠ Fehler in der Theorie?“ am Ende der Theorie: Text melden, Bericht FEHLERMELDUNGEN, Abgleich (jüngere Rücknahme gewinnt), nochmal tippen = zurücknehmen | Meldung fehlt im Bericht | E-1009-20 | `tools/pruefen/befunde.mjs` |
| Prüfvermerk je Thema: neues/geändertes Thema ohne Vermerk in `lektionen/pruefvermerke.json` oder Vermerk mit alter Prüfsumme → Warnung; `thema.mjs --vermerk` schreibt dieselbe Prüfsumme | Thema geändert, Quellenprüfung vergessen | E-1009-23 | `tools/pruefen/statisch.mjs` |
| Bestätigte Fehler (✗ in `ki-pruefung.json`) stehen im Auftrag für neue Übungen (max. 5 je Thema, mit Korrektur und Grund); von Claude verworfene Vokabel-Antwort ist ohne KI falsch, andere verworfene im Bewertungsauftrag | Opettaja erzeugt denselben Fehler erneut | E-1009-21 | `tools/pruefen/befunde.mjs` |
| Lesetext „🎧 Erst nur hören“: Text versteckt und vorgelesen, nach dem Prüfen wieder sichtbar; Satzdiktat: Satz in der Lernsprache (klein, ohne Schlusszeichen) richtig, Unsinn falsch, Ergebnis `listen.d` im Bericht und im Abgleich | Text bleibt nach dem Prüfen versteckt; Diktat-Ergebnis geht beim Abgleich verloren | S-1013-19 | `tools/pruefen/durchlauf.mjs` |
| Neue Formate `luk` (mehrere Lücken im Text) und `zuo` (Zuordnen/Sortieren): Musterlösung richtig, Teilfehler mit Lösung markiert, unvollständiges Zuordnen nicht prüfbar, „Weiß ich nicht“ zeigt alle Lösungen, ungültige Daten abgelehnt | Lückentext zählt nur die erste Lücke | S-1013-20 | `tools/pruefen/durchlauf.mjs` |
| Ausgeblendete Übung (`aus: true`) kommt in keiner Runde, keiner Aufgabenliste von Claude und keinem Fehler-Training dran; Prüflisten-Zählungen ignorieren sie | geteiltes Thema zeigt alte Übungen weiter | S-1013-33 | `tools/pruefen/durchlauf.mjs` |
| Prüfmodus (Einstellungen, nur dieses Gerät): gesperrte Themen zeigen Theorie, Wörter und alle Übungen mit Lösung; freie Themen die Übungsliste; Lernstand bleibt unverändert | Prüfmodus schaltet Thema frei oder speichert Ergebnisse | S-1013-37 | `tools/pruefen/befunde.mjs` |
| Verlaufsprotokoll: Eintrag nach Analyse (mit Niveau), Langzeit-Check und wöchentlich; Trend ↑/↓ gegen Stand vor ≥ 14 Tagen, „neu als Schwäche“; Bericht VERLAUF; Karte unter Fortschritt; Abgleich behält alle Einträge | Verlauf geht beim Sync verloren | S-1013-39 | `tools/pruefen/befunde.mjs` |
| Zeitraster + Punkte: 3× in Folge richtig → 14 Tage Ruhe, dann 30/60; Fehler hebt auf; ruhende nur als Auffüllung; Lern-/Freischalt-Runde ausgenommen; Abgleich behält Ruhe; Bericht nennt ruhende | gut gekonnte Übung kommt jede Runde wieder | S-1013-41 | `tools/pruefen/befunde.mjs` |
| Auch bei richtiger Antwort (lokal oder KI) steht „Musterlösung: …“ und „Auch richtig: …“; in Tabelle/Lückentext/Dialog bei abweichender richtiger Eingabe die Musterlösung klein darunter | nach KI-„richtig“ sieht man nicht, wie es im Lehrbuch steht | S-1013-42 | `tools/pruefen/befunde.mjs` |
| Selbst werten bei jeder falschen Antwort (außer mc/les/zuo): fast richtig → „Nur vertippt“, sonst „Ich werte es als richtig“; zählt als richtig, steht im Bericht (AUSRUTSCHER „Ganze Antwort …“) und im KI-Protokoll | Selbstwertung unsichtbar für Claude | S-1013-43 | `tools/pruefen/befunde.mjs` |
