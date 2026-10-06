# Übungsformate

Ein Thema hat: `{id, title, fi, lvl, req:[Voraussetzungs-IDs], th:"Theorie als HTML", v:[["finnisch","deutsch"], …], ex:[Übungen]}`

## Übungstypen (`ex`)
- `mc` – Multiple Choice: `{t:"mc", q, o:[Optionen], a:IndexRichtig, x?:Erklärung}`
  Finnische Wörter in der Frage in „…“ setzen – dann sind sie antippbar.
- `gap` – Lückentext: `{t:"gap", q:"Minä ___ Matthias.", h?:Hinweis, a:["olen"], s?:1}` – genau ein `___`
- `tr` – Übersetzung: `{t:"tr", dir:"de"|"fi", q, a:[Lösungen], s?:1}`
  `dir:"de"` = Deutsch → Finnisch, `dir:"fi"` = Finnisch → Deutsch. Mehrere gleichwertige Lösungen angeben (mit/ohne Pronomen).
- `ord` – Satz ordnen: `{t:"ord", w:[Wörter], a:"Satz", de:"Deutsch"}`
- `tab` – Tabelle mit Lücken: `{t:"tab", q:"Konjugiere olla", h?:Hinweis, head:["Person","olla"], r:[["minä","[olen]"],["sinä","[olet]"]], s?:1}`
  - Zellen in `[eckigen Klammern]` sind Lücken, Alternativen mit `|`: `[Missä asut?|Missä sinä asut?]`
  - Steht im Spaltenkopf eine Grundform aus dem Wortschatz (z. B. `olla`, `puhua`), lernt das Antipp-Wörterbuch die Formen automatisch.
  - Lokal Feld für Feld geprüft; richtig nur, wenn alle Felder stimmen.
- `les` – Lesetext/Dialog zum Lesen mit Verständnisfragen: `{t:"les", q?:"Im Café", txt:["Myyjä: Hei! Mitä saisi olla?", "Matthias: Yksi kahvi, kiitos."], qs:[{q:"Was bestellt Matthias?", o:["einen Kaffee","einen Tee"], a:0, x?:Erklärung}], h?}`
  - Jede Zeile `"Name: Text"` (Sprecher fett) oder nur Text. Alle Wörter antippbar, der ganze Text kann vorgelesen werden.
  - 2–4 Fragen (Multiple Choice, Fragen und Optionen in der Basissprache). Richtig nur, wenn **alle** Fragen stimmen.
  - Gedacht für kurze Alltagsdialoge (Café, Einkaufen, Weg fragen …) mit dem Wortschatz des Themas und seiner Voraussetzungen.
- `sch` – Schreibaufgabe (freier Text in der Lernsprache): `{t:"sch", q:"Bestelle einen Kaffee und eine Zimtschnecke.", w?:["kahvi","pulla"], a:["Yksi kahvi ja yksi pulla, kiitos."], h?, s?:1}`
  - `q` = Aufgabe in der Basissprache, `w` = Wörter, die vorkommen sollen (antippbar), `a` = Musterlösung(en).
  - Passt der Text genau zu einer Musterlösung → lokal richtig. Sonst prüft die KI: Aufgabe erfüllt **und** sprachlich korrekt; sie zeigt eine korrigierte Fassung des eigenen Texts und die Musterlösung. Ohne KI zählt nur die Musterlösung.
  - Kurz halten (1–3 Sätze), damit die Aufgabe eindeutig bewertbar bleibt.
- `dlg` – Dialog zum Mitschreiben: `{t:"dlg", q:"Im Café bestellen", h?, r:[["Myyjä","Hei! Mitä saisi olla?"], ["Sinä","[Yksi kahvi, kiitos.|Kahvi, kiitos.]","Bestelle einen Kaffee."]], s?:1}`
  - Zeilen ohne Klammern sagt die andere Person (vorlesbar, antippbar). Zeilen mit `[eckigen Klammern]` schreibt man selbst, Alternativen mit `|`; die dritte Spalte sagt in der Basissprache, was man sagen soll.
  - Lokal Zeile für Zeile geprüft; passt eine Zeile nicht, prüft die KI alle offenen Zeilen in einer Anfrage im Zusammenhang. Richtig nur, wenn alle eigenen Zeilen stimmen.

Lesetexte, Schreibaufgaben und Dialoge gehören direkt in die Themen (wie jede andere Übung, nur hinten anhängen). Zusätzlich gibt es freies Schreiben und Rollenspiel mit der KI außerhalb der Themen.

`h` (Hinweis) ist bei **allen** Typen möglich und wird unter der Aufgabe angezeigt. Pflicht, wo das Format sonst missverständlich wäre (siehe `lektionen/README.md`).

`s:1` = strenge Prüfung: a/ä bzw. o/ö-Verwechslung zählt als falsch.

## Prüfung
- Zuerst lokal (Groß/Klein, Satzzeichen egal; ä/ö-Toleranz außer bei `s:1`).
- Bei `gap`/`tr`/`sch`/`dlg` ohne Treffer prüft die KI (gleichwertige Alternativen = richtig).

## Theorie (`th`)
HTML: `<p>`, `<h3>`, `<table>` (erste Spalte finnisch, bekommt automatisch einen Vorlese-Knopf; `class="nosay"` verhindert das), `<p class="rule">` (Regel), `<p class="tip">` (Tipp), `<i>` (antippbar zum Vorlesen). Keine Scripts (werden entfernt).
