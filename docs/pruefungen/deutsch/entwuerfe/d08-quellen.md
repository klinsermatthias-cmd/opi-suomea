# d08 – Quellen, GLOSS_EXTRA, Prüfung (Entwurf, Simulations-/Analyse-Chat, 12.10.2026)

Entwurf: `d08.json` (14 Karten, 63 Übungen: tab 8, gap 26, mc 11, tr 7, ord 3, les 3, dlg 2, sch 3). Grundlage: Plan D-1012-11, Anleitung vom Deutsch-Trainer-Chat, Stand deutsch-trainer d99d0e2. Laut Anleitung erst nach Checkpoint 1 veröffentlichen.

Bundesdeutsche Alternativen (Regel vom 12.10.): E-Card → Gesundheitskarte (Karte, Theorie, GLOSS), Ordination → Praxis und Krankenstand → krankgeschrieben (Theorie; Schreibaufgabe 58 mit zweiter Musterlösung), daheim/zu Hause/zuhause in Dialog 56.

## 1. Quellen
| Form/Regel | Quelle | Ergebnis |
|---|---|---|
| Apotheke | en.wiktionary | {{de-noun\|f}} → die Apotheken |
| Tablette | en.wiktionary | {{de-noun\|f}} → die Tabletten |
| Rezept | en.wiktionary | {{de-noun\|n,(e)s}} → die Rezepte |
| E-Card | Duden | feminin; „österreichisch für elektronische Krankenversicherungskarte“. Plural nicht abgerufen – Karte darum ohne Plural |
| Wartezimmer | en.wiktionary | {{de-noun\|n}} → die Wartezimmer |
| Beipackzettel | Duden | maskulin, Plural die Beipackzettel; Bedeutung „einer Ware (besonders einem Medikament) beigelegter Zettel“ |
| Kopfschmerz(en) | en.wiktionary | {{de-noun\|m,,en}} → die Kopfschmerzen |
| Husten | en.wiktionary | {{de-noun\|m}} (Nomen), dazu Verb husten |
| sich setzen | en.wiktionary | setzen, schwach |
| sich verletzen + Dat. (Körperteil) | en.wiktionary; Duden | schwach; Duden-Beispiel „ich habe mir das Bein verletzt“ |
| einnehmen | en.wiktionary | ein.nehmen<nimmt#nahm,genommen> |
| sich ausruhen | en.wiktionary | {{de-verb\|aus.ruhen}} schwach |
| untersuchen | en.wiktionary | schwach, untrennbar: untersuchte, hat untersucht |
| wehtun | en.wiktionary; Duden | weh.tun<irreg>: tat weh, hat wehgetan; Duden empfiehlt *wehtun*, alternativ *weh tun* (beide in Übung 7) |
| fehlen + Dat. | Duden | Beispiel „fehlt dir etwas? (fühlst du dich nicht wohl …)“ |
| Imperativ nimm, iss | en.wiktionary | „verb form of nehmen/essen: s imp“ |
| Imperativ lies/lest, sei/seid, iss/esst | de.wiktionary (Flexionstabellen lesen, sein, essen) | Imperativ Singular/Plural wie in der Theorie |
| Imperativ ohne Umlaut (schlaf!), -e nach -t/-d (warte!), seien Sie | ohne eigenen Abruf (Standardgrammatik) | |
| Verb-Erst: Frage ↔ Imperativ | ohne Quelle (Standardgrammatik) | |
| Reflexivpronomen Akk./Dat. | ohne eigenen Abruf (Standardtabelle) | |

**Ohne Quelle:** Imperativ-Sonderfälle (kein Umlaut, -e, seien Sie), Verb-Erst-Regel, Reflexivtabelle (Standardgrammatik, nicht einzeln nachgeschlagen); Natürlichkeit der Texte.

## 2. GLOSS_EXTRA-Vorschläge
Nur zum Testen lokal eingetragen; keine Kollision.
```js
  "apotheke": {de: "pharmacy, chemist's", note: "die Apotheke, die Apotheken"},
  "apothekerin": {de: "pharmacist (woman)", note: "die Apothekerin; der Apotheker"},
  "tablette": {de: "tablet, pill", note: "die Tablette, die Tabletten"},
  "tabletten": {de: "tablets, pills", base: "Tablette", note: "Plural"},
  "rezept": {de: "prescription; recipe", note: "das Rezept, die Rezepte"},
  "e-card": {de: "health insurance card (Austria; Germany: Gesundheitskarte)", note: "die E-Card"},
  "wartezimmer": {de: "waiting room", note: "das Wartezimmer, die Wartezimmer"},
  "beipackzettel": {de: "package leaflet (also: Packungsbeilage)", note: "der Beipackzettel, die Beipackzettel"},
  "packungsbeilage": {de: "package leaflet (= Beipackzettel)", note: "die Packungsbeilage"},
  "kopfschmerzen": {de: "headache", base: "Kopfschmerz", note: "meist Plural: Ich habe Kopfschmerzen."},
  "husten": {de: "cough; to cough", note: "der Husten (Nomen); husten (Verb)"},
  "ärztin": {de: "doctor (woman)", note: "die Ärztin, die Ärztinnen; der Arzt"},
  "assistentin": {de: "assistant (woman); receptionist at the doctor's", note: "die Assistentin"},
  "grippe": {de: "flu", note: "die Grippe"},
  "salbe": {de: "ointment, cream", note: "die Salbe, die Salben"},
  "kopf": {de: "head", note: "der Kopf, die Köpfe"},
  "arm": {de: "arm; poor", note: "der Arm, die Arme (Nomen); arm (Adjektiv)"},
  "hand": {de: "hand", note: "die Hand, die Hände"},
  "küche": {de: "kitchen", note: "die Küche, die Küchen"},
  "arbeit": {de: "work, job", note: "die Arbeit; zur Arbeit gehen = to go to work"},
  "tee": {de: "tea", note: "der Tee"},
  "kaffee": {de: "coffee", note: "der Kaffee"},
  "wasser": {de: "water", note: "das Wasser"},
  "alkohol": {de: "alcohol", note: "der Alkohol"},
  "problemen": {de: "problems (Dat. Pl.)", base: "Problem", note: "bei Problemen = if there are problems"},
  "laufen": {de: "to run; running", note: "beim Laufen = while running"},
  "ihre": {de: "her / their; your (Ihre, Sie)", base: "ihr", note: "Ihre Ärztin = your doctor (Sie)"},
  "komm": {de: "come!", base: "kommen", note: "Imperativ (du)"},
  "nimm": {de: "take!", base: "nehmen", note: "Imperativ (du): du nimmst → nimm!"},
  "iss": {de: "eat!", base: "essen", note: "Imperativ (du): du isst → iss!"},
  "lies": {de: "read!", base: "lesen", note: "Imperativ (du): du liest → lies!"},
  "hilf": {de: "help!", base: "helfen", note: "Imperativ (du)"},
  "schlaf": {de: "sleep!", base: "schlafen", note: "Imperativ (du): ohne Umlaut"},
  "sei": {de: "be!", base: "sein", note: "Imperativ: sei! – seid! – seien Sie!"},
  "seid": {de: "(you, plural) are; be! (ihr)", base: "sein", note: "ihr seid; Imperativ: Seid ruhig!"},
  "seien": {de: "be! (Sie)", base: "sein", note: "Imperativ: Seien Sie …!"},
  "esst": {de: "(you, plural) eat; eat! (ihr)", base: "essen"},
  "setz": {de: "sit (down)!", base: "setzen", note: "Imperativ (du): Setz dich!"},
  "setzt": {de: "sits; sit (down)! (ihr)", base: "setzen", note: "er setzt sich; Setzt euch!"},
  "setzen": {de: "to put, to set; sich setzen = to sit down", note: "Setzen Sie sich! = Sit down!"},
  "ruh": {de: "rest!", base: "ruhen", note: "Imperativ (du): Ruh dich aus!"},
  "ruhen": {de: "to rest", note: "sich ausruhen = to have a rest; Ruhen Sie sich aus!"},
  "trink": {de: "drink!", base: "trinken", note: "Imperativ (du)"},
  "geh": {de: "go!", base: "gehen", note: "Imperativ (du)"},
  "bleib": {de: "stay!", base: "bleiben", note: "Imperativ (du)"},
  "ruhig": {de: "quiet, calm"},
  "verletzte": {de: "hurt, injured (Präteritum)", base: "verletzen", note: "sie verletzte sich"},
  "verletzt": {de: "hurt, injured", base: "verletzen", note: "Partizip II: hat sich verletzt"},
  "ruhte": {de: "rested", base: "ruhen", note: "Präteritum; ruhte sich aus"},
  "ausgeruht": {de: "rested", base: "ausruhen", note: "Partizip II: hat sich ausgeruht"},
  "eingenommen": {de: "taken (medicine)", base: "einnehmen", note: "Partizip II: hat eingenommen"},
  "untersuchte": {de: "examined", base: "untersuchen", note: "Präteritum"},
  "untersucht": {de: "examined", base: "untersuchen", note: "Partizip II: hat untersucht"},
  "tat": {de: "did", base: "tun", note: "Präteritum; es tat weh = it hurt"},
  "tut": {de: "does", base: "tun", note: "es tut weh = it hurts (wehtun)"},
  "weh": {de: "sore, painful", note: "wehtun = to hurt: Der Kopf tut mir weh."},
  "wehgetan": {de: "hurt", base: "wehtun", note: "Partizip II: hat wehgetan"},
  "dreimal": {de: "three times"},
  "täglich": {de: "daily, a day", note: "dreimal täglich = three times a day"},
  "soll": {de: "should, am/is supposed to", base: "sollen"},
  "geehrter": {de: "dear (formal)", base: "geehrt", note: "Sehr geehrter Herr … = Dear Mr … (Brief)"},
  "bis": {de: "until, by", note: "bis Freitag = until Friday"},
  "aufforderung": {de: "request, instruction", note: "die Aufforderung"},
  "aussagesatz": {de: "statement (sentence)", note: "der Aussagesatz"},
  "frage": {de: "question", note: "die Frage, die Fragen"},
  "ruhe": {de: "rest, quiet (n.); rest! (du, formal)", note: "die Ruhe; Ruhe dich aus! = Ruh dich aus!"},
  "setze": {de: "(I) put; sit down! (du, formal)", base: "setzen", note: "Setze dich! = Setz dich!"},
  "trinke": {de: "(I) drink; drink! (du, formal)", base: "trinken"},
```

## 3. req
`["d01","d02","d05","d06"]` wie im Plan. Genutzt: d01 Perfekt/Futur (6–10, 50), d02 weil/trotzdem/dass, Krankenstand, Ordination, Fieber (31–33, 51, 53, 58), d05 Akkusativ (30), d06 Pronomen im Dativ, fehlen/wehtun (28, 29, 41, 48). *keins* (d07) steht in Dialog 55 nur als zusätzliche richtige Antwort, nicht als verlangte Form.

## 4. Ergebnis `node tools/pruefen.mjs`
Lokale Kopie von deutsch-trainer d99d0e2 mit d04–d08 hinten angehängt (nicht gepusht):
- erster Lauf: **✗ „zu breit für 390 px (408 px)“** – Imperativ-Übersicht und Verb-Erst-Tabelle gekürzt (kurze Formen ohne Objekt), danach kein ✗ mehr.
- ohne die d08-Vorschläge: Wortprüfung meldete u. a. komm, nimm, iss, hilf, schlaf, sei, esst, setzt, ruh, ruhig, verletzte, ruhte, untersuchte, tat, weh, verletzt, eingenommen, ausgeruht, untersucht, wehgetan, setz, trink, ruhen, setzen, dreimal, täglich, soll, geh, geehrter, bis, tut.
- mit den Vorschlägen: **„Alles in Ordnung · 76 Prüfungen bestanden“, kein Hinweis.**

## 5. Prüfliste 1–16
| Zeile | Ergebnis |
|---|---|
| 1 | ✓ Formen mit Quelle; Österreich: Ordination, E-Card, Krankenstand, „Bitte warten Sie im Wartezimmer“, je mit bundesdeutscher Form |
| 2 | ✓ `h` nennt Verb und Person bzw. „Reflexivpronomen im richtigen Fall“, nie die Form |
| 3 | ✓ mit Vorschlägen keine Hinweise |
| 4 | ✓ keine Karte aus d01–d07 doppelt |
| 5 | ✓ komm/komme, setz/setze, trink/trinke, ruh/ruhe, wehgetan/weh getan, Beipackzettel/Packungsbeilage, zu Hause/zuhause/daheim |
| 6 | ✓ Theorie-Tabellen höchstens 3 Spalten; Übungstabellen je eine Lückenspalte |
| 7 | ✓ *Sie* groß, *sich* klein (mc 39) |
| 8 | ✓ Umlaute exakt (Ärztin, täglich) |
| 9 | ✓ ord 49–51 mit allen Stellungen; Satzzeichen zählen in der App nicht (`norm` in js/daten.js) |
| 10 | ✓ Alternativen nur als ganze Formen |
| 11 | ✓ Kartenklammern verraten nichts |
| 12 | ✓ neues Thema |
| 13 | ✓ nicht betroffen |
| 14 | Niveau laut Plan (A1+/A2+) |
| 15 | ✓ 63 Übungen, 8 Formate |
| 16 | ✓ sechs Verbkarten mit Zeitformen; Präteritum-/Perfekt-Tabelle (6, 7), Futur-Lücken (8, 9), Perfekt-Lücke (10) |

**Anteil:** Teilregeln (0–5, 11–27, 34–40, 42–47, 49, 50, 60–62) ≈ 70 %; Mischung, Lesen, Schreiben ≈ 30 %.

## 6. Offene Fragen und Befunde (S-Codes)
Keine neuen. Hinweis: Die App ignoriert Satzzeichen beim Vergleich. Darum kann sie bei *Sie*-Sätzen Frage und Aufforderung nicht unterscheiden; Teilregel 2 wird deshalb über mc (34, 62) und die Tabelle „Frage → Aufforderung“ (3, mit du/ihr-Formen) geübt.
