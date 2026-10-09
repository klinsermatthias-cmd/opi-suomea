# Prüfliste Engine (Funktionen-Chat)

Jede Optimierung und jede Meldung von Matthias ergibt eine Zeile (E-1009-15). **Vor jedem Push** wird die Liste durchgegangen; „Test“ nennt die automatische Prüfung in `tools/pruefen/` (Meldungstext), „–“ = nur von Hand prüfen. Neue Zeilen unten anhängen und, wo möglich, mit einem Test absichern. Inhalte haben eigene Listen (`lektionen/pruefliste.md`, Deutsch-Trainer: dessen Liste).

## Ablauf
| Prüfen | Beispiel | Code | Test |
|---|---|---|---|
| Neuer Test schlägt bei absichtlich kaputtem Code an (Gegenprobe) | `typoOf` kaputt → Meldung statt Absturz | E-1008-58 | – (bei jeder neuen Funktion) |
| Deutsch-Trainer lokal mit der neuen Engine prüfen; „Engine übernehmen“ erst nach grünem Prüflauf von opi-suomea | Übernahme lief zu früh und nahm den alten Stand | E-1008-58 | – |
| Keine App-Texte fest im Engine-Code, immer über `APP` | „Opettaja“/„Matthias“ im Code statt `APP.teacher`/`APP.learner` | CLAUDE.md | Durchlauf beider Apps |

## Daten und Sync
| Prüfen | Beispiel | Code | Test |
|---|---|---|---|
| Neues synchronisiertes Feld: `defaultState`, `mergeStates`, Lösch-Liste in `applyWipe`, Merge-Test | `slips`, `vocAlt`, `unlearned` | E-1008-58/-59, E-1009-3 | „Abgleich … falsch“ |
| Zurücknehmbare Markierungen: jüngste Änderung gewinnt beim Abgleich (Zeitstempel `xu`), nicht Vereinigung | ⚑ an Vokabel-Antwort, „Noch nicht gelernt?“ zurückgenommen | E-1008-59, E-1009-3 | „jüngere Rücknahme gewinnt nicht“ |
| Netzabbrüche im Hintergrund (iOS „Load failed“) nicht als App-Fehler melden; Wiederholung bleibt | Wegwischen der App während des Uploads | E-1009-8 | „Sync: Hintergrund-Abbruch“ |

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
