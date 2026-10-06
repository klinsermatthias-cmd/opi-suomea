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

`h` (Hinweis) ist bei **allen** Typen möglich und wird unter der Aufgabe angezeigt. Pflicht, wo das Format sonst missverständlich wäre (siehe `lektionen/README.md`).

`s:1` = strenge Prüfung: a/ä bzw. o/ö-Verwechslung zählt als falsch.

## Prüfung
- Zuerst lokal (Groß/Klein, Satzzeichen egal; ä/ö-Toleranz außer bei `s:1`).
- Bei `gap`/`tr` ohne Treffer prüft Gemini (gleichwertige Alternativen = richtig).

## Theorie (`th`)
HTML: `<p>`, `<h3>`, `<table>` (erste Spalte finnisch, bekommt automatisch einen Vorlese-Knopf; `class="nosay"` verhindert das), `<p class="rule">` (Regel), `<p class="tip">` (Tipp), `<i>` (antippbar zum Vorlesen). Keine Scripts (werden entfernt).
