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
