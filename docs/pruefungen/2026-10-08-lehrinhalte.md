# Prüfung der finnischen Lehrinhalte – 8.10.2026

Auftrag von Matthias (S-1008-17, -19, -22, -23). Prüfer: Simulations-Chat, nur Kontrolle.
**Diese Datei schlägt nur vor. Geändert wird nichts.** Umsetzen soll der Chat „Opi suomea (Lerninhalte)“, laut `CLAUDE.md` gehört `lektionen/` und `js/inhalte.js` zu ihm.
Grundlage: `main` 56be18c.

## Umfang und Vorgehen
- **Geprüft wird:**
  - die Grundthemen t01–t08 in `js/inhalte.js` und alle Themen in `lektionen/lektionen.json` (52 Themen, 728 Wörter, 1.080 Übungen)
  - dazu `GLOSS_EXTRA`, die Entwürfe (`lektionen/entwuerfe-bis-b1.md`, `abdeckung.md`) und `lektionen/ki-pruefung.json`
- **Je Thema geprüft:**
  - Theorie: Richtigkeit und Vollständigkeit
  - Wortliste
  - jede Übung: Aufgabe, Musterlösung, gleichwertige Varianten, Hinweis, Erklärung, Distraktoren
  - ob jede Aufgabe mit dem bis dahin gelernten Stoff lösbar ist
- **Hilfsskripte (nur Lesen):**
  - Ausgabe aller Themen als Text
  - Abgleich, ob Wörter in Lösungen schon in einer Wortliste vorkamen (Reihenfolge wie in der App)
- **Quellen:**
  - eigenes Wissen
  - [uusikielemme.fi](https://uusikielemme.fi/) (Grammatikseiten)
  - [en.wiktionary.org](https://en.wiktionary.org/) (Beugung)
  - [finnpottblog.de](https://www.finnpottblog.de/finnischlernen/online-grammatiken/) (Linkliste)
  - [kielitoimistonohjepankki.fi](https://kielitoimistonohjepankki.fi/) (Empfehlungen des Kielitoimisto, z. B. Komma, *alkaa* + Infinitiv)
  - nicht abrufbar: `scripta.kotus.fi` (Iso suomen kielioppi; die Seite lehnt Abrufe ab), das Kotus-Wörterbuch (lädt Einträge per Skript)
- Abweichende oder unsichere Stellen sind als **unsicher** markiert.

## Legende
- **kritisch:** falsches Finnisch oder falsche Musterlösung. Die Lernenden lernen einen Fehler oder werden bei richtiger Antwort falsch bewertet.
- **mittel:**
  - wichtiger Inhalt fehlt
  - Aufgabe verlangt Stoff, der noch nicht gelernt wurde
  - Erklärung ist irreführend
  - gleichwertige Lösung fehlt bei Übungen ohne KI-Prüfung (`ord`, `tab`, `mc`)
- **niedrig:** Stil, kleine Ergänzungen, Dubletten.
- **Code:** Jeder Vorschlag hat einen eigenen Code (S-1008-…). Matthias entscheidet je Code.
- **Nur-anhängen-Regel:** Neue Wörter und Übungen nur hinten anhängen. Korrekturen innerhalb einer Übung (Text, Lösung, Option) ändern den Index nicht und sind erlaubt.
- **Bezeichnung:** `t05b ex[10]` = Übung Nr. 10 (ab 0 gezählt) im Thema t05b.

---

## Paket 1: t01–t08 mit Unterthemen (18 Themen, 356 Übungen)

**Ergebnis:**
- Keine kritischen Fehler. Das Finnisch in Theorie, Lösungen und Dialogen ist korrekt.
- Vier Lücken sind wichtig:
  - „jos“ fehlt im ganzen Kurs.
  - „joku“ und „jotain“ fehlen bzw. fehlen bei der Verneinung.
  - Die Komposita-Regel der Vokalharmonie fehlt.
  - Mehrere Aufgaben verlangen Wörter oder Grammatik, die erst später kommen.

### Befunde

| Code | Schwere | Wo | Befund | Vorschlag |
|---|---|---|---|---|
| **S-1008-24** | mittel | t08d (Theorie, Wörter), ganzer Kurs | **„jos“ (wenn/falls) kommt in keinem Thema vor.** t08d lehrt nur „kun = wenn, als“. Das deutsche „wenn“ ist doppeldeutig. Lernende übersetzen deshalb „Wenn es regnet, bleibe ich zu Hause“ mit *kun* statt richtig *jos*. „jos“ gehört zu den Grundkonjunktionen (uusikielemme: kun, koska, että, jos …). | t08d-Theorie unter „Bindewörter“ ergänzen: „**kun** = wenn (immer wenn) / als (zeitlich): Kun olen väsynyt, juon kahvia. – **jos** = wenn, falls (Bedingung): Jos olen väsynyt, olen kotona.“ An v anhängen: `["jos","wenn, falls (Bedingung)"]`. Dazu 2 Übungen: eine `mc` „kun oder jos?“ und eine `gap` „___ sataa, olen kotona.“ → jos. |
| **S-1008-25** | mittel | t07b Theorie und v[0–3] | **Irreführend:** „koskaan, enää, kukaan, mitään stehen immer zusammen mit der Verneinung. Allein heißen sie ‚jemals, mehr, jemand, etwas‘.“ Diese Wörter stehen in verneinten Sätzen und in Fragen (*Onko kukaan kotona?* = Ist jemand zu Hause?). Im bejahten Satz heißt es **joku** (jemand), **jotain/jokin** (etwas), **joskus** (manchmal). Wer der Erklärung folgt, bildet *Kukaan on kotona.* (falsch, richtig: *Joku on kotona.*). **„joku“ kommt im ganzen Kurs nicht vor**, „jotain“ erst in t14. | Satz ersetzen: „koskaan, enää, kukaan, mitään stehen nur in verneinten Sätzen und in Fragen (Onko kukaan kotona? = Ist jemand zu Hause?). Im bejahten Satz sagt man joku (jemand), jotain (etwas), joskus (manchmal): Joku on kotona.“ Wortliste: v[0] „jemals (in Fragen; ei koskaan = nie)“, v[2] „jemand (nur in Fragen/verneint; kukaan ei = niemand)“, v[3] „etwas (nur in Fragen/verneint; ei mitään = nichts)“. Anhängen: `["joku","jemand (bejaht)"]`, `["jotain","etwas (bejaht)"]`. Eine `mc`-Regelfrage „Joku oder kukaan?“. |
| **S-1008-26** | mittel | t05 Theorie | **Vokalharmonie bei zusammengesetzten Wörtern fehlt.** Es zählt nur der letzte Wortteil: aamu+päivä → *aamupäivällä*, kesä+loma → *kesälomalla* (uusikielemme: „applies only to each part … separately“). Die Regel „hat ein Wort a, o oder u → -ssa“ führt bei Komposita zu falschen Formen (*aamupäivälla*). Der Kurs nutzt Komposita schon früh (t05b ex[10] *aamupäivällä*, t04b *sairaanhoitaja*, *eläkeläinen*). In `abdeckung.md` als „→ 5.3 Ausnahmen“ geplant, aber noch offen. | t05-Theorie ergänzen: „Bei zusammengesetzten Wörtern entscheidet der letzte Teil: aamupäivä → aamupäivässä, kesäloma → kesälomalla.“ Dazu eine `mc`-Regelfrage. |
| **S-1008-27** | mittel | t07b ex[10], ex[15], ex[18]; t08d Theorie, ex[2–4], ex[9], ex[11–13], ex[15] | **„juoda“ (trinken) und „tee“ (Tee) werden verlangt, bevor sie gelehrt werden.** Sie kommen erst in t10 in eine Wortliste. Beispiele: t07b ex[10] „Ich trinke nie Kaffee.“ → *En koskaan juo kahvia*; t08d ex[9] „Ich trinke zweimal am Tag Kaffee.“ → *Juon kahvia …*. Die Form *juon/juo* (Typ 2) wird nirgends erklärt. | In t07b an v anhängen: `["juoda","trinken (juon, en juo)"]`, `["tee","Tee (teetä)"]`. Kurzer Satz in der Theorie: „juoda gehört zu Typ 2 (genauer in t10): juon, juot, juo …“. |
| **S-1008-28** | mittel | t06b ex[9] (dlg), ex[10] (sch) | **Aufgabe verlangt Verneinung, die erst in t07 kommt.** „Sag, dass du kein Französisch sprichst.“ → *En puhu ranskaa.* t06b steht vor t07, und `req` enthält t07 nicht. | t06b-Theorie: Kasten „Kein Französisch: **En puhu ranskaa.** (Verneinung genauer in t07)“. Alternativ beide Aufgaben auf bejahte Sätze umstellen. |
| **S-1008-29** | mittel | t05b ex[10] (sch) | **Aufgabe verlangt Zeitangaben, die erst in t09 kommen:** „am Vormittag im Büro, am Abend zu Hause“ → *aamupäivällä*, *illalla* (Adessiv). Dazu ist *aamupäivä* ein Kompositum (siehe S-1008-26). | Aufgabe ersetzen: „Schreib, dass du im Büro bist und Aino im Park ist.“ Musterlösungen: „Olen toimistossa. Aino on puistossa.“ / „Minä olen toimistossa ja Aino on puistossa.“ |
| **S-1008-30** | mittel | t04b Theorie und ex[4] | **„Olen nälkäinen“ ist nicht der übliche Ausdruck.** Auch in der Schriftsprache sagt man fast immer **Minulla on nälkä** (Ich habe Hunger). Die Theorie stellt das nur als gesprochene Form („Mulla on nälkä“) dar. | Theorie-Satz ändern: „Üblicher, auch geschrieben: **Minulla on nälkä.** (Ich habe Hunger – die haben-Form kommt in t11). Gesprochen: Mulla on nälkä.“ Die Übungen mit *nälkäinen* können bleiben (grammatisch richtig). |
| **S-1008-31** | mittel | t04b ex[0] (tab) | **„vanha“ (alt) wird in der Tabelle verlangt, steht aber in keiner Wortliste vor t11.** | An t04b v anhängen: `["vanha","alt"]`. |
| **S-1008-32** | mittel | t08b v | **Wortliste unvollständig.** *milloin* wird in ex[0] und ex[11] verlangt, steht aber erst in t09 in einer Wortliste. *mistä, mihin, miten, kuinka, kenen, paljonko* stehen nur in der Theorie und kommen so nie als Karte. | An t08b v anhängen: `["milloin?","wann?"]`, `["mistä?","woher?"]`, `["mihin?","wohin?"]`, `["miten?","wie?"]`, `["kenen?","wessen?"]`, `["paljonko?","wie viel?"]`. |
| **S-1008-33** | niedrig | t08d v | Wortliste unvollständig: *vai* (Lösung in ex[3]!), *tänne, siellä, sinne* (Tabelle ex[0]), *usein, joskus* (Theorie) fehlen. | An t08d v anhängen: `["vai","oder (in Fragen)"]`, `["tänne","hierher"]`, `["siellä","dort (erwähnt)"]`, `["sinne","dorthin (erwähnt)"]`, `["usein","oft"]`, `["joskus","manchmal"]`. |
| **S-1008-34** | niedrig | t01 ex[21] | **Distraktor ist phonetisch nicht falsch.** „Wie spricht man das h in lahti?“ markiert „wie ch in ‚ach‘“ als falsch. Vor einem Konsonanten nach hinterem Vokal klingt finnisches h aber tatsächlich oft wie der ach-Laut ([lɑxti]), nach vorderem Vokal wie der ich-Laut (*lehti*). | Distraktor „wie ch in „ach““ ersetzen durch „stumm, nur Dehnung (wie in ‚Bahn‘)“. In t01b-Theorie bei „h vor Konsonant“ ergänzen: „(klingt dabei oft wie ch in ‚ach‘ bzw. ‚ich‘)“. |
| **S-1008-35** | niedrig | t01b Theorie „So sagt man’s gesprochen“ | **Erklärung stimmt nicht:** „Im Alltag werden Endvokale oft verschluckt: kiitti (= kiitos), moikka (= moi)“. *kiitti* und *moikka* sind eigene lockere Formen, kein Wegfall von Endvokalen. | „Locker sagt man kiitti (= kiitos) und moikka (= moi). Endvokale fallen oft weg: kaks (= kaksi), viis (= viisi).“ |
| **S-1008-36** | niedrig | t04 Theorie „gesprochen“ | **Zum Verstehen wichtig und fehlt:** Gesprochen sagt man für Personen meist *se* statt *hän* und *ne* statt *he* (*Se on opettaja.* = Er/Sie ist Lehrer/in). | Satz im Gesprochen-Kasten ergänzen. |
| **S-1008-37** | niedrig | t02b Theorie, ex[10], ex[13] | Zum Geburtstag sagt man meist **Hyvää syntymäpäivää!** oder **Paljon onnea!**. *Onneksi olkoon* ist der allgemeine Glückwunsch (auch zu Prüfung, Hochzeit). *Paljon onnea* kommt erst in t18b. | Theorie-Zeile ergänzen: „Hyvää syntymäpäivää! / Paljon onnea! – Alles Gute zum Geburtstag!“. *Onneksi olkoon* als „Herzlichen Glückwunsch (allgemein)“ kennzeichnen. An v anhängen: `["hyvää syntymäpäivää","alles Gute zum Geburtstag"]`. |
| **S-1008-38** | niedrig | t04b Theorie, v | **saksalainen (Deutsche/r; deutsch) fehlt** bei den Nationalitäten. Für deutschsprachige Lernende ist das naheliegend; es kommt erst in t13. | Theorie-Zeile „Saksa → saksalainen | Deutschland → Deutsche/r“ und v `["saksalainen","Deutsche/r; deutsch"]`. |
| **S-1008-39** | niedrig | t06 ex[19] | *Me ostamme autoa.* ist grammatisch möglich, heißt aber „wir sind dabei, ein Auto zu kaufen“. Der normale Satz wäre *Ostamme auton.* (Objektfall erst t14). | Lückensatz ändern zu „Me ___ kahvia.“ (Lösung bleibt *ostamme*). |
| **S-1008-40** | niedrig | t07 Theorie | Die Übungen nutzen schon die Regel „Objekt im verneinten Satz steht in der Teilungsform“ (*Te ette osta autoa*, *En aja autoa*). Die Theorie nennt sie nicht. | Ein Satz: „Nach der Verneinung steht das Objekt in der Teilungsform: En osta autoa. (genauer in t14)“. |
| **S-1008-41** | niedrig | t07b ex[18] Musterlösung 2 | Komma vor *enkä*: Vor *ja, tai, eikä/enkä* steht zwischen Hauptsätzen kein Komma. Für die Bewertung ist das egal, weil Satzzeichen nicht zählen. | „En juo koskaan kahvia enkä ole vielä väsynyt.“ |
| **S-1008-42** | niedrig | t05b Theorie | Bei alten Wörtern auf -i gibt es weitere häufige Stammänderungen: *vesi → vedessä, käsi → kädessä, kieli → kielessä*. Sonst wirkt „-i → -e-“ wie die einzige Regel. | Ein Satz: „Manche ändern sich stärker (vesi → vedessä, käsi → kädessä) – das kommt später.“ |
| **S-1008-43** | niedrig | t01 v[11], ex[17] | *kuu* heißt auch „Monat“. | v[11] „Mond; Monat“, ex[17] Lösung „Monat“ ergänzen. |
| **S-1008-44** | niedrig | t08d Theorie „gesprochen“ | „tänne → tänne bleibt“ ist verwirrend. *ku (= kun)* ist regional (Norden/Osten). | „tääl, tuol, siel (= täällä, tuolla, siellä); regional ku (= kun).“ |
| **S-1008-45** | niedrig | t01 ex[12]/ex[0], ex[19]/ex[4]; t04 ex[24]/ex[8] | Doppelte Fragen mit fast gleichem Wortlaut. | Keine Änderung nötig. Bei neuen Übungen auf Vielfalt achten. |

### Geprüft und in Ordnung
- **t01 Aussprache:**
  - Vokale, Betonung, Länge (tuli/tuuli, muta/mutta)
  - Vokalpaare
  - Konsonanten (r gerollt, s stimmlos, k/p/t unbehaucht)
- **t01b:**
  - alle 29 Buchstabennamen (aa, bee, see … tset, ruotsalainen oo) korrekt
  - alle 18 Diphthonge
  - ng [ŋː] und nk [ŋk]
  - Buchstabier-Dialog Virtanen (vee, ii, är, tee, aa, än, ee, än) stimmt
- **t02/t02b:**
  - alle Grüße, Höflichkeitsformen und Antworten
  - Regel „Mitä kuuluu? → hyvää, Miten menee? → hyvin“ richtig
  - teitittely richtig dargestellt
- **t03/t03b:**
  - alle Zahlen 0–20, -toista mit richtiger Erklärung, Rechnen
  - Partitiv nach Zahlen ab 2 (Einzahl)
  - Umgangsformen yks, kaks, seittemän, kaheksan
- **t04/t04b:**
  - olla vollständig, Pronomen-Wegfall nur 1./2. Person
  - Nationalitäten auf -lainen/-läinen, Kleinschreibung
- **t05/t05b:**
  - Inessiv mit Vokalharmonie (Graz → Grazissa, Linz/Wien → -issä, Steyr → Steyrissä)
  - Wörter auf -e (huoneessa)
  - alte i-Wörter (Suomessa, järvessä, meressä) gegenüber Lehnwörtern (hotellissa)
- **t06/t06b:**
  - Typ 1 mit allen Endungen und Vokalharmonie
  - Sprachen im Partitiv (englantia, ruotsia, venäjää)
  - etsiä/muistaa/nauraa/itkeä ohne Stufenwechsel richtig
- **t07:** Verneinungsverb, Stammbildung („ich-Form ohne -n“; gilt für alle Verbtypen)
- **t08–t08d:**
  - -ko/-kö, Antwort mit Verb
  - Fragewörter, -ko am betonten Wort
  - verneinte Fragen, minäkin/en minäkään
  - Hier/dort-System, tai/vai, Häufigkeit
- Alle Lese-, Dialog- und Schreibaufgaben in Paket 1 haben passende Fragen und richtige Musterlösungen.
- **CLAUDE.md-Regeln:**
  - Regelfragen (Nr. 16): in jedem Grammatikthema vorhanden (t04: 2, t05: 3, t06: 5, t07: 2, t08: 2, Unterthemen 1–2).
  - Hinweise (Nr. 15) vorhanden.
  - Tabellen vollständig (Nr. 6).

---

## Paket 2: t09–t12 mit Unterthemen (12 Themen, 254 Übungen)

**Ergebnis:**
- Keine kritischen Fehler. Uhrzeit, Typ-2-Verben, „haben“, Existenzsatz, Stufenwechsel und -sin sind richtig und gut erklärt.
- Abgleich zu „kello kolmelta“: uusikielemme und Lernmaterialien empfehlen *kolmelta* oder *kello kolme*, nicht die Mischung. Die App lehrt das richtig.
- Lücken gibt es vor allem bei Grundverben:
  - *tehdä* kommt erst in t19 in eine Wortliste.
  - *lähteä* steht nur als *lähtee* in t09c.
- Bei *jäädä* fehlt eine Regel (*jään kotiin*).

### Befunde

| Code | Schwere | Wo | Befund | Vorschlag |
|---|---|---|---|---|
| **S-1008-46** | mittel | ganzer Kurs; t04b, t08b, t12b, t10c | **Grundverb „tehdä“ (machen, tun) kommt erst in t19 in eine Wortliste.** Seit t04b werden aber *Mitä teet työksesi?*, *Mitä teet?* (t08b), *Mitä teet viikonloppuisin?* (t12b ex[8]) benutzt. *tehdä* ist unregelmäßig (teen, teet, **tekee**, teemme, teette, **tekevät**; en tee) und eines der häufigsten Verben. | In t10c (Typ 2 vollständig) als Tabelle aufnehmen: „tehdä (machen): teen, teet, tekee, teemme, teette, tekevät – Verneinung en tee“. An v anhängen: `["tehdä","machen, tun (teen, hän tekee)"]`. Dazu eine `tab` und eine `gap`. |
| **S-1008-47** | mittel | t10c Theorie, ex[1], ex[7], ex[11], ex[16] | **„jäädä“ steht mit der Wohin-Form – die Regel fehlt.** Die Übungen verlangen *jään kotiin* (ich bleibe zu Hause), *jäämme tänne*. Gelernt ist aber *kotona*. Wer *Jään kotona* schreibt, schreibt nicht die Standardform. *kotiin* (Illativ) kommt erst in t13. | Theorie-Satz: „jäädä (bleiben) steht mit der Wohin-Form: jään kotiin (ich bleibe zu Hause), jään tänne (ich bleibe hier).“ An v anhängen: `["kotiin","nach Hause (jään kotiin = ich bleibe zu Hause)"]`. |
| **S-1008-48** | mittel | t11b ex[0] (tab) | **Gleichwertige Lösung fehlt (Tabelle, ohne KI):** Spalten „männlich → weiblich“, Zeile *poika → [tytär]*. *poika* heißt „Sohn“ **und** „Junge“, also ist auch *tyttö* (Mädchen) richtig. Wird ohne KI als falsch gewertet. | Zelle `[tytär|tyttö]`. |
| **S-1008-49** | niedrig | t12c Theorie | **Lücken im Muster:** Zwei sehr häufige Wechsel fehlen: **ht → hd** (*lähteä → lähden*, *lahti → lahdessa*) und **lk → l(j)** (*jalka → jalassa*, *kulkea → kuljen*). *lähteä* (losgehen, abfahren) steht in keiner Wortliste, nur als *lähtee* in t09c. | Tabelle um „ht → hd: lähteä → lähden“ und „lk → l: jalka → jalassa“ ergänzen. An v anhängen: `["lähteä","losgehen, abfahren (lähden)"]`. |
| **S-1008-50** | niedrig | t12c Theorie „gesprochen“ | **Erklärung stimmt nicht:** „Im Gesprochenen bleibt manches stark: ruuassa / ruoassa“. Beide Formen haben die schwache Stufe (k fällt weg). *ruuassa* ist eine Vokalangleichung und nach Kotus auch in der Schriftsprache richtig. | „Bei ruoka sind ruoassa und ruuassa beide richtig (auch geschrieben).“ Im mc ex[14] ist das unproblematisch (*ruuassa* ist keine Option). |
| **S-1008-51** | niedrig | t10b v; t11c ex[1] | **„maito“ (Milch) steht vor t14 in keiner Wortliste,** nur *maidolla*. t11c ex[1] verlangt aber *maitoa*, t10b dlg[9] *ilman maitoa*. | An t10b v anhängen: `["maito","Milch (maitoa, maidolla)"]`. |
| **S-1008-52** | niedrig | t09c dlg[14], sch[15] | *juna* (Zug) und *matka* (Fahrt) werden in Antworten verlangt, stehen aber erst in t16 bzw. t19 in einer Wortliste. | An t09c v anhängen: `["juna","Zug"]`, `["matka","Fahrt, Reise"]`. |
| **S-1008-53** | niedrig | t09b Theorie und v | Die häufigste Frage nach dem Zeitpunkt fehlt: **Moneltako?** (Um wie viel Uhr?) mit der Antwort auf -lta (*Kolmelta.*). Gelehrt wird nur *Mihin aikaan?*. | Theorie: „Frage: Mihin aikaan? oder Moneltako? – Kolmelta.“ An v anhängen: `["moneltako?","um wie viel Uhr?"]`. |
| **S-1008-54** | niedrig | t11b les ex[7] | Komma vor *ja*: *Serkku on naimisissa, ja hänellä on vauva.* Nach Kotus steht vor *ja* zwischen Hauptsätzen kein Komma. | „Serkku on naimisissa ja hänellä on vauva.“ |
| **S-1008-55** | niedrig | t11b v | *tyttöystävä* (feste Freundin) steht in der Theorie, aber nicht in der Wortliste. | An v anhängen: `["tyttöystävä","feste Freundin"]`. |
| **S-1008-56** | niedrig | t10c ex[4] (mc) | Distraktor *Haluan kahvi.* ist grammatisch falsch (richtig wäre *Haluan kahvia*). Als Distraktor zeigt er Lernenden eine falsche Form. | Distraktor ändern zu „Haluan kahvia.“ (richtig, aber weniger höflich). Die Lösung *Saisinko kahvia?* bleibt am höflichsten. |

### Geprüft und in Ordnung
- **t09:**
  - Uhrzeit mit puoli + nächste Stunde
  - Wochentage mit -na, Kleinschreibung
  - Zehner, Zahlen in einem Wort (kaksikymmentäyksi)
  - Termin-Dialoge
- **t09b:**
  - yli + Grundform, vaille + Teilungsform (alle 11 Formen richtig: yhtä, kahta, kolmea … kahtakymmentä)
  - alle 12 -lta-Formen (yhdeltä … kahdeltatoista)
  - Tageszeiten auf -lla, Mahlzeiten
  - Kulturhinweise
- **t09c:**
  - 24-Stunden-Lesart, von–bis (viidestä viiteen …)
  - tasan/melkein, Dauer mit Teilungsform
  - akateeminen vartti
- **t10, t10b, t10c:**
  - Café-Dialoge idiomatisch (*Mitä saisi olla?*, *Täälläkö vai mukaan?*, *Kortilla vai käteisellä?*)
  - Typ 2 vollständig, auch -oida
  - Mengenwörter mit Teilungsform, ilman + Partitiv
  - Konditional als Höflichkeitsform
  - santsikuppi, korvapuusti
- **t11, t11b, t11c:**
  - minulla on / ei ole + Teilungsform
  - Mehrzahl -t
  - sata/tuhat mit Teilungsform, Alter auf -vuotias in einem Wort
  - setä/eno richtig unterschieden
  - Existenzsatz mit Wortstellung und Bestimmtheit
  - lasta/lapsia
- **t12, t12b, t12c:**
  - Stufenwechsel-Regel (Silbe geschlossen → schwach), Verben stark bei hän/he
  - alle Beispielformen richtig (lammessa, kylvyssä, kaupungissa …)
  - -sin gegenüber -na/-lla richtig abgegrenzt

---

## Paket 3: t13–t16 mit Unterthemen (13 Themen, 268 Übungen)

**Ergebnis:**
- Keine kritischen Fehler. Alle Formen sind richtig, Dialoge, Wegbeschreibungen und Einkaufsszenen idiomatisch.
- Geprüft wurden:
  - Ortsfälle innen und außen
  - Typ 3 und 4 mit umgekehrtem Stufenwechsel
  - Partitiv-Bildung
  - Objekt ganz/Teil
  - Imperativ du/ihr mit Verneinung
  - Genitiv, Postpositionen, Pronomen in allen Fällen
- Befunde gibt es nur bei einer zu absoluten Regel, einer fehlenden Regel in t14 und bei der Reihenfolge (*täytyy*, *kylmä*).

### Befunde

| Code | Schwere | Wo | Befund | Vorschlag |
|---|---|---|---|---|
| **S-1008-57** | mittel | t14 Theorie („Das Objekt: ganz oder ein Teil?“) | **Wichtige Ausnahme fehlt:** Nach der Regel „ganzes Ding → -n“ bilden Lernende *Rakastan Suomen* oder *Katson television*. Manche Verben nehmen aber immer die Teilungsform: *rakastaa, auttaa, odottaa, etsiä, ajatella*, dazu *soittaa kitaraa*, *katsoa televisiota*. Die Übungen nutzen das seit t06 (*Rakastan Suomea*, *Etsimme autoa*, *Katson televisiota*). Erklärt wird es erst in t16d. | Ein Satz in t14: „Manche Verben nehmen immer die Teilungsform: Rakastan Suomea. Odotan bussia. Autan äitiä. (mehr in 16.4)“. Dazu eine `mc`-Regelfrage. |
| **S-1008-58** | niedrig | t16b Theorie | **Zu absolut:** „Bei Personen nimmt man -lle und -lta, nie -Vn oder -sta“. *-sta* steht sehr wohl bei Personen: *Pidän äidistä* (t15b), *Puhun Ainosta* (ich spreche über Aino). Gemeint ist nur geben, bekommen, fragen, anrufen. | „Beim Geben, Bekommen, Fragen, Anrufen … nimmt man bei Personen -lle (wem) und -lta (von wem) – nicht -Vn oder -sta: Annan äidille (nicht äitiin).“ |
| **S-1008-59** | niedrig | t14c ex[11], Theorie | **„täytyy“ wird verlangt, bevor es gelehrt ist.** „Ich muss ein Brot kaufen.“ → *Minun täytyy ostaa leipä*. *täytyy* kommt erst in t15; t14c liegt davor. | Übung bleibt. In t14c-Theorie kurz: „täytyy = muss (genauer in t15): Minun täytyy ostaa leipä.“ |
| **S-1008-60** | niedrig | t14c v; ex[1], ex[8], ex[15] | *kylmä* (kalt) wird verlangt (*Vesi on kylmää*), steht aber in keiner Wortliste davor. | An t14c v anhängen: `["kylmä","kalt"]`. |
| **S-1008-61** | niedrig | t13 Theorie „Kulttuuri“ | **unsicher:** „Fast drei Viertel der Menschen leben im Süden.“ Je nach Abgrenzung lebt gut die Hälfte im Süden. Uusimaa (Region Helsinki) allein hat rund ein Drittel der Bevölkerung. | „Die meisten Menschen leben im Süden – rund um Helsinki etwa ein Drittel.“ |
| **S-1008-62** | niedrig | t16d Theorie, erster Satz | „Viele kennst du schon (minulla on, *minun nimi*)“. Gelehrt wurde die Standardform *minun nimeni*; *minun nimi* ist umgangssprachlich. | „(minulla on, minun nimeni …)“. |

### Geprüft und in Ordnung
- **t13, t13b, t13c:**
  - -ssa/-sta/-Vn mit Stufenwechsel (kaupassa, aber kauppaan; Itävallasta, aber Itävaltaan)
  - Typ 3 (tulla, mennä, opiskella)
  - koti-Formen, Venäjällä/Tampereella
  - besondere Wohin-Formen (huoneeseen, maahan, työhön, Linziin)
  - Länder, Fähre nach Tallinn
- **t14, t14b, t14c:**
  - Partitiv-Bildung (-a/-ä, -ta/-tä, -tta/-ttä, vettä)
  - Mengen und Verpackungen
  - ganzes Objekt -n, Verneinung → Partitiv
  - *Luen kirjaa/kirjan*
  - tämä/tuo/se, Farben
  - Prädikativ bei Stoffen (*Kahvi on kuumaa*, *Ruoka on kallista*)
  - Objekt im Imperativ und nach *täytyy* ohne -n
- **t15, t15b, t15c:**
  - Typ 4 mit umgekehrtem Stufenwechsel (tykkään, tapaan)
  - voida/osata/pystyä/saada richtig abgegrenzt
  - *täytyy, pitää, on pakko, ei tarvitse* mit Genitiv
  - Genitiv-Bildung (naisen, miehen, lapsen, huoneen, Suomen, Matthiaksen)
  - *kanssa*, *pitää + -sta*
- **t16, t16b, t16c, t16d:**
  - -lla/-lta/-lle, Verkehrsmittel mit -lla
  - Imperativ (du: minä-Form ohne -n; ihr/Sie: -kaa/-kää mit starker Stufe, *avatkaa*)
  - Verneinung (*älä mene*, *älkää menkö*)
  - Postpositionen mit Genitiv (*päällä/alla/alle*, *luona/luo*)
  - Personen mit -lle/-lta
  - *hyllyllä/hyllyssä*, *järvellä/järvessä*
  - Pronomen in allen Fällen (*minut, häntä, meidät*), *minusta = ich finde*
  - *Mennään!*
  - Kulturhinweise (Schuhe aus, HSL, zweisprachige Schilder)

---

## Paket 4: t17–t19 mit Unterthemen, Entwürfe, Wörterbuch (9 Themen, 202 Übungen)

**Ergebnis:**
- Keine kritischen Fehler. t17–t19c sind sprachlich sauber:
  - Arzt und Befinden
  - unpersönliche Gefühlsverben
  - Wetter, Monate, Ordnungszahlen in Fällen
  - Imperfekt aller Verbtypen mit Stufenwechsel
  - verneinte Vergangenheit
- Die zwei mittleren Befunde betreffen den **ganzen Kurs**: Häufige Grundwörter und *että* fehlen und sind auch im Plan bis B1 keinem Thema zugeordnet.
- `lektionen/ki-pruefung.json` ist noch leer (`{}`). Es gibt also keine KI-Urteile zu prüfen.
- Ergänzte Quelle: [kielitoimistonohjepankki.fi](https://kielitoimistonohjepankki.fi/) (Empfehlungen des Kielitoimisto). Danach ist *alkaa tekemään* inzwischen neben *alkaa tehdä* zulässig. S-1008-71 ist deshalb nur „niedrig“.

### Befunde

| Code | Schwere | Wo | Befund | Vorschlag |
|---|---|---|---|---|
| **S-1008-63** | mittel | ganzer Kurs t01–t19c, `abdeckung.md`, `entwuerfe-bis-b1.md` | **Häufige Grundwörter fehlen überall, auch im Plan bis B1:**<ul><li>*kaikki* (alle, alles: *Onko kaikki hyvin?*, *Kiitos kaikesta*)</li><li>*jokainen* (jeder)</li><li>*liian* (zu: *liian kallis*, *liian kylmä*), obwohl Einkaufen (t14) und Wetter (t18) es nahelegen</li><li>Adverbien auf *-sti* (*nopeasti, hitaasti*). Es gibt nur *hitaammin* als feste Wendung in t17c.</li><li>*joku/jokin* (siehe S-1008-25)</li></ul>`abdeckung.md` verlangt „nichts darf ohne Zuordnung bleiben“. Für diese Bausteine gibt es aber keine Zeile. | `abdeckung.md` um zwei Zeilen ergänzen:<ul><li>„Unbestimmte Pronomen *joku, jokin, jokainen, kaikki* (bejaht) gegenüber *kukaan, mikään* (verneint)“ → t20</li><li>„Adverbien auf *-sti*, *liian, tosi, aika*“ → t21 (Wohnung beschreiben)</li></ul>Sofort an t14b v anhängen: `["liian","zu (zu sehr): liian kallis"]`. In der t20-Detailplanung *kaikki* und *jokainen* als Wörter vorsehen. |
| **S-1008-64** | mittel | `entwuerfe-bis-b1.md` (t28), `abdeckung.md` (B1-Zeile „Relativsätze …, että-Sätze, kun/koska/jos“) | **„että“ (dass) kommt erst in t28 (A2.2).** Das Wort ist eines der häufigsten im Finnischen und für einfache Sätze wie *Luulen, että …* oder *Tiedän, että …* schon auf A1/A2 nötig. Die Abdeckungszeile ist außerdem veraltet und falsch eingeordnet:<ul><li>*kun* ist schon da (✓ 8.4), *koska* auch (✓ 8.2).</li><li>*jos* und *että* gehören zu A1/A2, nicht zu B1.</li></ul> | Zeile aufteilen:<ul><li>„*kun* ✓ 8.4, *koska* ✓ 8.2, *jos* → S-1008-24, *että* → t20 oder t23 (*Luulen, että …*, *Hän sanoo, että …*)“</li><li>„Relativsätze *joka* → t29“</li></ul>In der Detailplanung von t20 oder t23 *että* als Wort und mit einer `sch`-Aufgabe vorsehen. |
| **S-1008-65** | niedrig | t18 ex[7] (tr), Lösungsliste | Angenommen wird „Tänään on kylmä ja **tuulinen**“. Nach der Regel aus t18b stehen Wetterwörter ohne Subjekt in der Teilungsform (*on tuulista*, *on pilvistä*). *tuulinen* allein klingt unvollständig (*tuulinen päivä*). | Variante ersetzen: „Tänään on kylmä ja tuulista“. |
| **S-1008-66** | niedrig | t19 Theorie (Regelkasten), ex[20] (dlg) | Die Theorie von t19 sagt nicht, dass der Stufenwechsel auch in der Vergangenheit gilt. Die Regel kommt erst in 19.2. ex[20] verlangt aber schon *nukuin* (nukkua), und alle angenommenen Lösungen enthalten es. Wer *nukkuin* schreibt, erfährt nicht, warum das falsch ist. | Ein Satz im Regelkasten: „Der Stufenwechsel bleibt wie im Präsens: nukun → nukuin, aber hän nukkui; luen → luin, aber hän luki (mehr in 19.2).“ |
| **S-1008-67** | niedrig | t19b Theorie, letzter Kasten („Kulttuuri“) | **Zu allgemein:** „Finnisch hat für ‚ich kaufte‘ und ‚ich habe gekauft‘ im Alltag meist dieselbe Form: ostin.“ Finnisch hat ein eigenes Perfekt (*olen ostanut*, *Oletko käynyt Lapissa?*). Es kommt in t23 und wird anders verwendet. Die Aussage stimmt nur, wenn eine Zeit genannt wird. Außerdem ist das kein Kulturhinweis. | Als „Tipp“ statt „Kulttuuri“: „Wenn eine Zeit genannt wird (eilen, viime vuonna), nimmt man das Imperfekt – auch wo man auf Deutsch ‚habe gekauft‘ sagt: Eilen ostin kahvia. Das finnische Perfekt (olen ostanut) kommt in t23.“ |
| **S-1008-68** | niedrig | t19b ex[9] (tr) | „Ich habe eine Stunde gewartet.“ → *Odotin tunnin*. Dass die Dauer im Akkusativ steht (*tunnin*), wird nirgends erklärt; nur das Antipp-Wörterbuch kennt es. Lernende schreiben naheliegend *Odotin tuntia*. | `x` ergänzen: „Wie lange? → Objektform: odotin tunnin, viikon. Mit Zahl ab 2 Teilungsform: odotin kaksi tuntia.“ |
| **S-1008-69** | niedrig | t19c ex[18] (les), Satz 2 | Komma vor *ja* zwischen zwei Hauptsätzen: „En löytänyt avaimia, ja bussi lähti ilman minua.“ Nach Kielitoimisto steht hier kein Komma (wie S-1008-41, S-1008-54). | „En löytänyt avaimia ja bussi lähti ilman minua.“ |
| **S-1008-70** | niedrig | `entwuerfe-bis-b1.md` (t20, t23–t26) | **Die Entwürfe widersprechen ihrem eigenen Hinweis** „Wörter … nicht noch einmal als Vokabeln anlegen“. Doppelt wären:<ul><li>t23: *lähettää* (16.2), *unohtaa* (19.3)</li><li>t24: *joulu, juhannus, pääsiäinen, mökki, hyvää joulua, kiitos samoin* (18.2), *ensimmäinen, toinen, kolmas* (t18). Dazu steht *viidentenä toukokuuta* noch als Grammatik von t24, obwohl es schon in 18.3 kommt.</li><li>t25: *punainen, sininen* (t14)</li><li>t26: *juhannus, mökki*</li></ul>Außerdem:<ul><li>t20 nennt in der Tabelle „Perfekt-Grundlage“, die Detailplanung aber nicht. Das Perfekt kommt in t23.</li><li>t26: Der heutige amtliche Begriff ist *jokaisenoikeus*; *jokamiehenoikeus* ist der ältere.</li></ul> | Vor dem Anlegen:<ul><li>Dubletten aus den Wortlisten streichen oder nur als „(Wiederholung)“ in Übungen nutzen.</li><li>t24 als Grammatik nur Possessivsuffixe.</li><li>„Perfekt-Grundlage“ bei t20 streichen.</li><li>*jokaisenoikeus (früher jokamiehenoikeus)*.</li></ul> |
| **S-1008-71** | niedrig | `entwuerfe-bis-b1.md` t31 („alkaa, oppia, käydä + -maan“) | *käydä* steht beim 3. Infinitiv fast immer mit *-massa*: *kävin uimassa* (ich war schwimmen). *alkaa* steht in der Schriftsprache meist mit der Grundform (*alkaa sataa*). *alkaa tekemään* ist laut Kielitoimisto inzwischen ebenfalls zulässig. | „*mennä, tulla, ruveta, oppia* + -maan; *käydä* + -massa (kävin uimassa); *alkaa* + Grundform (alkaa sataa), gesprochen auch *alkaa tekemään*.“ |
| **S-1008-72** | niedrig | `GLOSS_EXTRA` in `js/inhalte.js` | Fünf Einträge sind ungenau oder doppelt:<ul><li>`nimeni` steht zweimal. Der zweite Eintrag gilt, der erste ist wirkungslos.</li><li>`suomeen`: „(unregelmäßig)“ widerspricht t05b/t13. Dort ist *Suomi → Suomessa* die Regel „alte -i-Wörter: -i → -e-“.</li><li>`tampereella`: „Städte auf -e: -lla“ ist als Regel falsch (*Raahe → Raahessa*). t13c sagt richtig: „Manche Länder und Städte nehmen die äußeren Endungen“.</li><li>`näen`: „hk → h“ ist irreführend. Der Stamm ist *näke- / näe-*, das k fällt weg.</li><li>`pöydässä`: „im Tisch, in der Tischplatte“. Die übliche Bedeutung ist „am Tisch (sitzen)“: *Istumme pöydässä.*</li></ul> | Notizen ändern:<ul><li>`suomeen`: „Wohin-Form (alte -i-Wörter: -i → -e-, wie järveen)“</li><li>`tampereella`: „manche Orte nehmen -lla: Tampereella, Rovaniemellä“</li><li>`näen`: „k fällt weg: näke- → näe-“</li><li>`pöydässä`: de „am Tisch (sitzen); im Tisch“</li><li>ersten `nimeni`-Eintrag löschen (ändert nichts am Verhalten)</li></ul> |

### Geprüft und in Ordnung
- **t17, t17b, t17c:**
  - *sattuu* mit Wohin-Form (päähän, käteen, hampaaseen, polveen)
  - Teilungsform bei Mengen (kuumetta, yskää, päänsärkyä) gegenüber ganzer Krankheit (flunssa, nuha)
  - Anweisungen beim Arzt (Avaa suu, Näytä kieltä)
  - Termin am Telefon (varata/perua ajan, Kuulemiin)
  - unpersönliche Gefühlsverben mit Teilungsform der Person (*Minua väsyttää*, *Väsyttääkö sinua?*, *minua ei väsytä*)
  - *Minulla on nälkä* als übliche Form (stützt S-1008-30)
  - 112 und terveyskeskus
- **t18, t18b, t18c:**
  - Jahreszeiten mit -lla, Monate klein auf -kuu, „im Juli“ = heinäkuussa
  - Typ 5 (tarvitsen) und Typ 6 (lämpenee)
  - Wetter: *on kylmä* in der Grundform, sonst Teilungsform (*on pilvistä*, *viisi astetta pakkasta*)
  - Feste mit -na und Wünsche (*Hyvää joulua, Hauskaa vappua, Kiitos, samoin*)
  - Ordnungszahlen 1.–10., 20., 24., 30.
  - *viidentenä toukokuuta*, *yhdentenätoista*, *vuonna 2027*, *maanantaista perjantaihin*
  - Jahreszahlen als ganze Zahl
- **t19, t19b, t19c:**
  - Imperfekt: -i- mit Vokalregeln (o/u/y/ö bleibt, e/ä fällt weg, a → o nach a in der 1. Silbe, a fällt weg nach o/u und in langen Verben)
  - Typ 2–5 (sain, vein, söin, nousin, halusin, tapasin, tarvitsin)
  - Stufenwechsel schwach bei minä, stark bei hän (otin/otti)
  - -si-Verben (tiesin, ymmärsin, löysin, pyysin, tunsin)
  - lähdin/lähti
  - verneinte Vergangenheit mit Angleichung (tullut, mennyt, noussut, halunnut) und Mehrzahl -neet
  - *aikoa* mit k → –
  - gesprochene Formen (en tienny, en mä tiiä)
  - alle Lesetexte und Dialoge
- **Entwürfe t20–t43:** Fachlich korrekt bis auf S-1008-63, -64, -70, -71. Geprüft wurden:
  - Beispiele: *olen opettajana, Mitä teet työksesi?, Haluan lääkäriksi, isossa talossa, uudessa asunnossa, kaksi huonetta, ostan omenat/omenoita, Olen asunut Linzissä, kaksi vuotta sitten, kotini/nimesi, isompi/halvempi/parempi/kalliimpi, halvin/paras, Suomessa juodaan, Mennään!, voisitko/olisi/kävisin*
  - Grammatikfolge Plusquamperfekt, *joka*, Passiv Vergangenheit, Partizipien, Referativ, Temporalkonstruktion
  - Die Reihenfolge entspricht gängigen Lehrwerken (Perfekt A2.1, Konditional A2.1, Partizipien B1).
- **`abdeckung.md`:** bis auf S-1008-63/-64 stimmig. Offen bleibt „→ 5.3 Ausnahmen“ der Vokalharmonie (siehe S-1008-26).
- **`GLOSS_EXTRA`** (rund 200 Einträge): bis auf S-1008-72 richtig. Geprüft wurden Bedeutung, Grundform und Hinweis, z. B.:
  - *parane* (parata), *lepää* (levätä), *onneksi* (onni), *vuonna* (vuosi)
  - *tavata* = auch „buchstabieren“
  - *kuuntelen, piirrän, kerron*
- **`lektionen/ki-pruefung.json`:** leer, nichts zu prüfen.

---

## Gesamtfazit

**Umfang:** 52 Themen mit 1.080 Übungen, dazu Wörterbuch, Entwürfe bis B1 und Abdeckungsliste.

**Ergebnis:**
- **0 kritisch.** Es gibt keine falsche Musterlösung und kein falsches Finnisch in Theorie, Dialogen oder Lesetexten. Einzige fragwürdige Variante ist S-1008-65.
- **15 mittel:**
  - S-1008-24 bis -32
  - S-1008-46 bis -48
  - S-1008-57
  - S-1008-63, -64
- **34 niedrig:**
  - S-1008-33 bis -45
  - S-1008-49 bis -56
  - S-1008-58 bis -62
  - S-1008-65 bis -72
- Insgesamt **49 Befunde** zu den Inhalten, dazu **1 Vorschlag** an den Funktionen-Chat (S-1008-73). Alle haben einen eigenen Code.

**Was durchgehend auffällt:**
- **Grundwörter und Bindewörter fehlen:**
  - *jos* (S-1008-24)
  - *joku/jokin* (S-1008-25)
  - *kaikki, jokainen, liian, -sti* (S-1008-63)
  - *että* (S-1008-64)
- **Wörter werden benutzt, bevor sie in einer Wortliste stehen:**
  - *juoda, tee* (S-1008-27)
  - *tehdä* erst in t19 (S-1008-46)
  - *lähteä* nie als Grundform (S-1008-49)
  - *vanha* (S-1008-31), *kylmä* (S-1008-60), *milloin* (S-1008-32)
- **Grammatik wird benutzt, bevor sie erklärt ist:**
  - Verneinung in t06b (S-1008-28)
  - Zeitangaben in t05b (S-1008-29)
  - *jään kotiin* vor der Wohin-Form in t10c (S-1008-47)
  - *täytyy* in t14c (S-1008-59)
  - Stufenwechsel im Imperfekt in t19 (S-1008-66)
- **Regeln sind zu absolut oder lückenhaft:**
  - kukaan/mitään (S-1008-25)
  - Vokalharmonie bei Komposita (S-1008-26)
  - Partitiv-Verben (S-1008-57)
  - „nie -sta“ bei Personen (S-1008-58)

**Empfohlene Reihenfolge für die Umsetzung:**
1. **Erklärungen oder Lösungen, die zu falschem Finnisch oder falscher Bewertung führen:** S-1008-25 (*Kukaan on kotona*), S-1008-26 (*aamupäivälla*), S-1008-57 (*Rakastan Suomen*), S-1008-24 (*kun* statt *jos*), S-1008-48 (*tyttö* wird in der Tabelle ohne KI als falsch gewertet).
2. **Stoff vor seiner Einführung:** S-1008-27, -28, -29, -46, -47, -59, -66. Sonst scheitern Lernende an Aufgaben, die sie noch nicht lösen können.
3. **Wortlisten ergänzen (nur anhängen):** S-1008-31, -32, -33, -60, -63 (*liian*).
4. **Planung vor t20 anpassen:** S-1008-63, -64, -70, -71 in `entwuerfe-bis-b1.md` und `abdeckung.md`.
5. **Rest (niedrig):** einarbeiten, wenn das jeweilige Thema ohnehin angefasst wird.

**Vorschlag an den Funktionen-Chat (optional), S-1008-73:** `tools/pruefen.mjs` könnte als **Warnung** (nicht als Fehler) melden, welche Wörter in Musterlösungen noch in keiner früheren Wortliste stehen. Die Reihenfolge wäre wie in der App, Beugungsformen gekürzt. So hätten sich die Befunde S-1008-27, -31, -32, -46, -49 und -60 vor dem Push gezeigt. Die Prüfung lief hier mit einem Hilfsskript nach diesem Prinzip. Ohne OK zu S-1008-73 passiert nichts; sonst nur in `docs/ideen.md` sammeln.

**Wer setzt um:**
- Inhalte (`lektionen/`, `GLOSS_EXTRA` nur anhängen bzw. Notizen korrigieren, `entwuerfe`, `abdeckung`): Chat „Opi suomea (Lerninhalte)“.
- S-1008-73: Chat „App-Engine: Funktionen“.
- Matthias entscheidet je Code. Die Codes lassen sich auch gesammelt freigeben, z. B. „S-1008-24 bis -32“.
