# Übungsformate

Ein Thema hat: `{id, title, fi, lvl, req:[Voraussetzungs-IDs], th:"Theorie als HTML", v:[["finnisch","deutsch"], …], ex:[Übungen]}`

Vokabeln: Bei Deutsch → Finnisch verdeckt die App bis zum Aufdecken jede Klammer (und einen Teil nach „:“), die ein Wort mit denselben ersten zwei Buchstaben wie die Lösung enthält: „Schuh (kengät = Schuhe)“ → „Schuh (…)“. Deutsche Hinweise wie „(höflich)“ bleiben sichtbar (E-1008-57).

## Übungstypen (`ex`)
- `mc` – Multiple Choice: `{t:"mc", q, o:[Optionen], a:IndexRichtig, x?:Erklärung}`
  Finnische Wörter in der Frage in „…“ setzen – dann sind sie antippbar.
- `gap` – Lückentext: `{t:"gap", q:"Minä ___ Matthias.", h?:Hinweis, a:["olen"], s?:1}` – genau ein `___`
- `tr` – Übersetzung: `{t:"tr", dir:"de"|"fi", q, a:[Lösungen], s?:1}`
  `dir:"de"` = Deutsch → Finnisch, `dir:"fi"` = Finnisch → Deutsch. Mehrere gleichwertige Lösungen angeben (mit/ohne Pronomen).
- `ord` – Satz ordnen: `{t:"ord", w:[Wörter], a:"Satz", de:"Deutsch"}`. Sind mehrere Wortstellungen richtig, `a` als Liste: `a:["Annan lahjan siskolle.", "Annan siskolle lahjan."]` – die erste ist die Musterlösung; jede muss genau aus den Wortkärtchen bestehen (prüft `pruefen.mjs`, E-1008-6).
- `tab` – Tabelle mit Lücken: `{t:"tab", q:"Konjugiere olla", h?:Hinweis, head:["Person","olla"], r:[["minä","[olen]"],["sinä","[olet]"]], s?:1}`
  - Zellen in `[eckigen Klammern]` sind Lücken, Alternativen mit `|`: `[Missä asut?|Missä sinä asut?]`
  - Steht im Spaltenkopf eine Grundform aus dem Wortschatz (z. B. `olla`, `puhua`), lernt das Antipp-Wörterbuch die Formen automatisch.
  - Lokal Feld für Feld geprüft; richtig nur, wenn alle Felder stimmen.
- `les` – Lesetext/Dialog zum Lesen mit Verständnisfragen: `{t:"les", q?:"Im Café", txt:["Myyjä: Hei! Mitä saisi olla?", "Matthias: Yksi kahvi, kiitos."], qs:[{q:"Was bestellt Matthias?", o:["einen Kaffee","einen Tee"], a:0, x?:Erklärung}], h?}`
  - Jede Zeile `"Name: Text"` (Sprecher fett) oder nur Text. Alle Wörter antippbar, der ganze Text kann vorgelesen werden.
  - 2–4 Fragen (Multiple Choice, Fragen und Optionen in der Basissprache). Richtig nur, wenn **alle** Fragen stimmen.
  - Gedacht für kurze Alltagsdialoge (Café, Einkaufen, Weg fragen …) mit dem Wortschatz des Themas und seiner Voraussetzungen.
- `sch` – Schreibaufgabe (freier Text in der Lernsprache): `{t:"sch", q:"Bestelle einen Kaffee und eine Zimtschnecke.", w?:["kahvi","pulla"], a:["Yksi kahvi ja yksi pulla, kiitos."], h?, s?:1}`
  - `q` = Aufgabe in der Basissprache, `w` = Wörter, die vorkommen sollen (antippbar), `a` = Musterlösung(en). `w` steht erst nach „💡 Wörter zeigen“ da (E-1008-57).
  - Passt der Text genau zu einer Musterlösung → lokal richtig. Sonst prüft die KI: Aufgabe erfüllt **und** sprachlich korrekt; sie zeigt eine korrigierte Fassung des eigenen Texts und die Musterlösung. Ohne KI zählt nur die Musterlösung.
  - Kurz halten (1–3 Sätze), damit die Aufgabe eindeutig bewertbar bleibt.
- `dlg` – Dialog zum Mitschreiben: `{t:"dlg", q:"Im Café bestellen", h?, r:[["Myyjä","Hei! Mitä saisi olla?"], ["Sinä","[Yksi kahvi, kiitos.|Kahvi, kiitos.]","Bestelle einen Kaffee."]], s?:1}`
  - Zeilen ohne Klammern sagt die andere Person (vorlesbar, antippbar). Zeilen mit `[eckigen Klammern]` schreibt man selbst, Alternativen mit `|`; die dritte Spalte sagt in der Basissprache, was man sagen soll.
  - Lokal Zeile für Zeile geprüft; passt eine Zeile nicht, prüft die KI alle offenen Zeilen in einer Anfrage im Zusammenhang. Richtig nur, wenn alle eigenen Zeilen stimmen.

Lesetexte, Schreibaufgaben und Dialoge gehören direkt in die Themen (wie jede andere Übung, nur hinten anhängen). **Gern 2–3 Varianten je Art mit verschiedenen Situationen:** pro Themenrunde kommt nur eine Variante je Art (`les`, `sch`, `dlg`), der Reihe nach über die Runden; beim Extra-Üben zufällig. Auf der Themenseite gibt es zusätzlich „Aufgaben von Claude“ (diese festen Aufgaben aus dem Thema und seinen gelernten Voraussetzungen) und – ab 80 % im Thema – freies Schreiben und Rollenspiel, das sich die KI ausdenkt.

`h` (Hinweis) ist bei **allen** Typen möglich und wird unter der Aufgabe angezeigt. Pflicht, wo das Format sonst missverständlich wäre (siehe `lektionen/README.md`).

`s:1` = strenge Prüfung: a/ä bzw. o/ö-Verwechslung zählt als falsch. Automatisch streng (E-1008-3): Lücken mitten im Wort (`Asut___`, `Wien___` – meist Endungen mit Vokalharmonie) und Übungen, deren Hinweis „Vokalharmonie“ nennt.
Endungs-Lücken (E-1009-12): Tippt man das ganze Wort (`kirjastossa` bei `kirjasto___`), prüft die App nur die Endung (richtig mit Hinweis; falsche Endung ohne KI falsch). Die KI wertet bei Endungs-Lücken nur genau die Form der Musterlösung als richtig – alternative richtige Endungen deshalb in `a` aufnehmen. Für alle anderen Lücken gilt (E-1009-14): dieselbe grammatische Form wie die Musterlösung (Fall, Person, Zeit, Zahl), andere Wörter nur in genau dieser Form; der Hinweis `h` geht als „Gesucht ist: …“ an die KI.

## Prüfung
- Zuerst lokal (Groß/Klein, Satzzeichen egal; Toleranz je Sprache aus `SP.loose` – Finnisch ä/ö, Deutsch nur ß/ss – außer bei strenger Prüfung).
- Bei `gap`/`tr`/`sch`/`dlg` ohne Treffer prüft die KI (gleichwertige Alternativen = richtig). Ist die KI nicht erreichbar, entscheidet der/die Lernende selbst (E-1008-2).
- `ord` vergleicht mit allen angegebenen Wortstellungen (ohne KI).
- Deutsch als Lernsprache (E-1008-9): Groß-/Kleinschreibung zählt (Nomen, „Sie“), außer am Satzanfang; Lösungen in Lektionen also immer korrekt großschreiben.

## Theorie (`th`)
HTML: `<p>`, `<h3>`, `<table>` (erste Spalte finnisch, bekommt automatisch einen Vorlese-Knopf; `class="nosay"` verhindert das, `class="sayall"` gibt jedem Kästchen einen Vorlese-Knopf, wenn alle Spalten finnisch sind), `<p class="rule">` (Regel), `<p class="tip">` (Tipp), `<i>` (antippbar zum Vorlesen). Keine Scripts (werden entfernt).

## Übungssammlung wächst, Runden wählen aus
Übungen werden nie gelöscht, nur angehängt. Eine Runde fragt nie alle ab: Wiederholung = 8, erstes Lernen = bis 15, ausgewählt nach „nie gesehen / lange nicht gesehen / oft falsch / Vielfalt / Zufall“ (siehe `docs/architektur.md`, Übungsauswahl). Neue Übungen können also jederzeit hinten angehängt werden und kommen bevorzugt dran.
Geprüfte KI-Übungen (✓ in `lektionen/ki-pruefung.json`) kommen automatisch in die Auswahl. Besonders gute kann Claude fest ins Thema übernehmen: den Übungseintrag mit seiner `gid` hinten an `ex` anhängen – dann kommt er nur noch aus der Lektion (geräteübergreifend und dauerhaft).
