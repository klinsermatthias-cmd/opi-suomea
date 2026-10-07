# D – Übungsformate & Antwortprüfung

Geprüft: Stand `opi-suomea` main e808c8c und `deutsch-trainer` 4ae9255 (Engine-Stand 6542776). Gelesen: `js/formate.js`, `js/sprache.js`, `js/woerterbuch.js`, `js/einstufung.js` vollständig; in `js/uebungen.js` Prüfung/Auswertung (`localCheck`, `textCheck`, `record`, `showFb`, `dunno`), `norm`/`loose` (`js/daten.js`), `validEx`/`validTopic`/`loadRepoLessons`/`importPack` (`js/verwaltung.js`), `aiJudge`/`JUDGE_RULES`/`aiGenerate` (`js/ki.js`), `mergePlacement`, `orderTopics`; Inhalte beider Apps (1080 Übungen in 52 Themen Opi suomea; Deutsch-Trainer: nur Einstufungstest, noch keine Lektionen). Experimente: echte App in Chromium (390 px, ohne KI/Cloud), Prüffunktionen direkt aufgerufen bzw. Runde mit genau einer Übung gestartet und „Prüfen“ ausgelöst (Skripte in `exp-D/`, Harness `h.mjs`). Deutsch-Trainer mit eingeschleuster Test-Lektion (`exp-D/dt-test-lektionen.json`), da er noch keine Lektionen hat.

## D1 – Satz ordnen (`ord`) kennt nur eine Wortstellung
- **Schwere:** mittel
- **Wo:** `js/formate.js:426-427` (`check` vergleicht nur mit `[ex.a]`, Richter `null` = keine KI), Format `ord.a` ist ein einzelner Text (`js/formate.js:423`)
- **Problem:** Eine gleichwertige, korrekte Wortstellung wird ohne Rückfrage als falsch gewertet; es gibt weder Alternativen im Format noch eine KI-Prüfung. Im Finnischen sind Zeitangaben und Objekte frei stellbar, im Deutschen das Vorfeld.
- **Ablauf/Beleg:** (`exp-D/e1.js`, `e2.js`)
  - t16b/17 („Ich gebe der Schwester ein Geschenk“): „Annan siskolle lahjan.“ → „Väärin“, richtig sei nur „Annan lahjan siskolle.“
  - t13/12: „Menen töihin aamulla.“ → falsch; t19b/16: „Tapasin vanhan ystävän viime viikolla.“ → falsch; t08d/11: „Juon teetä, kun olen kotona.“ → falsch.
  - Deutsch-Trainer: „Ich fahre morgen nach Linz.“ → „Leider falsch“ (nur „Morgen fahre ich nach Linz.“).
  - In Opi suomea haben etwa 13 der 43 `ord`-Übungen eine solche gleichwertige Stellung (t08d/11, t09b/14, t12/11, t12b/15, t13/12, t13b/10, t13c/10, t15/13, t16b/17, t18b/16, t18c/17, t19/13, t19b/16).
- **Folge:** Matthias bekommt für richtiges Finnisch „falsch“, muss die Übung wiederholen, bis er die eine vorgegebene Reihenfolge trifft, und lernt dabei eine falsche Regel („Zeitangabe muss vorn stehen“).
- **Vorschlag:** `ord.a` darf eine Liste sein (`[ex.a].flat()` in `check`, `ordFull`/`expected` nehmen den ersten Eintrag, `valid` und `pruefen.mjs`-Bildbarkeitstest für jede Alternative); Inhalts-Chats tragen die Alternativen nach. Optional zusätzlich `aiJudge` als Richter (wie bei `tr`), mit Hinweis „gleiche Wörter, andere Reihenfolge“.
- **Aufwand:** klein
- **Apps:** beide

## D2 – Umlaut-Toleranz wertet bedeutungstragende Fehler als „richtig“
- **Schwere:** mittel (Opi suomea) · hoch für den Deutsch-Trainer, sobald Lektionen kommen
- **Wo:** `js/uebungen.js:393-399` (`localCheck`: ohne `s:1` gilt `loose(a) === loose(user)` als richtig), `js/daten.js:141-143` (`loose`: ä→a, ö→o, ü→u, ß→ss); gilt auch für jede Tabellen- und Dialogzelle (`js/formate.js:133`, `:348`)
- **Problem:** Die Toleranz ist Standard und muss je Übung mit `s:1` abgeschaltet werden. Das passiert kaum (12 von 1080 Übungen, 2 von 68 Tabellen) – auch nicht bei später angehängten Übungen, die ausdrücklich Vokalharmonie prüfen. Im Deutschen trägt der Umlaut Grammatik (Plural, Konjunktiv II, Steigerung) oder unterscheidet Wörter.
- **Ablauf/Beleg:** (`exp-D/e1.js`, `e2.js`, Runde mit genau dieser Übung, „Prüfen“)
  - t08/20 „Asut___ täällä?“, Hinweis „nur die Fragendung eintippen – **Vokalharmonie!**“: Eingabe „kö“ → „Oikein! Richtig.“ (+ „Fast perfekt – achte auf ä/ö“). Zum Vergleich t08/2 mit `s:1`: „ko“ statt „kö“ → „Väärin“.
  - t05/22 „Wien___“ (Thema „Vokalharmonie“): „issa“ → richtig; t05/19 „ravintola___“: „ssä“ → richtig (ebenso t05/20, t05/21).
  - Deutsch-Trainer (Test-Lektion): „Meine Bruder sind gross.“ für „Meine Brüder sind groß.“ → „Richtig!“; Lücke Konjunktiv II „wurde“ statt „würde“ → „Richtig!“; „schon“ statt „schön“ → „Richtig!“; Tabelle Plural „die Bruder“, „die Mutter“ → „Richtig!“.
- **Folge:** Genau der Fehler, den die Übung abfragt, zählt als richtig und fließt so in Ergebnis, Freischaltung (80 %) und Wiederholungsplan ein; im Deutsch-Trainer würde Aurora Plural- und Konjunktivfehler nie als Fehler erleben.
- **Vorschlag:** Toleranz im Sprachmodul festlegen statt fest im Code: `SP.loose` (de: keine Umlaut-Toleranz – die App hat ä/ö/ü/ß-Tasten; höchstens ß→ss), fi: automatisch streng, wenn die Lösung nur eine Endung ist (Lücke mitten im Wort) oder der Hinweis „Vokalharmonie“ nennt. Zusätzlich in `pruefen.mjs` warnen, wenn eine Endungs-Lücke a/ä/o/ö/u/y enthält und `s` fehlt. Alternativ: „Fast perfekt“ beim ersten Versuch nicht als richtig zählen.
- **Aufwand:** klein
- **Apps:** beide

## D3 – Groß-/Kleinschreibung wird im Deutschen nie geprüft
- **Schwere:** mittel
- **Wo:** `js/daten.js:133-140` (`norm` macht alles klein), `js/ki.js:300-301` (`JUDGE_RULES`: „Groß-/Kleinschreibung … zählen nicht“ fest im Engine-Code, nicht im Sprachmodul); Einstufungstest `js/einstufung.js:54-59`, `:76-77` (`normGap`, `alt.toLowerCase()`)
- **Problem:** Für Finnisch richtig, für Deutsch falsch: Nomen-Großschreibung ist Pflicht und „Sie/sie“ ändert die Bedeutung. Weder die lokale Prüfung noch die KI darf das bemängeln; es erscheint nicht einmal ein Hinweis. Im Einstufungstest widerspricht die lokale Lückenprüfung der eigenen KI-Regel („Groß-/Kleinschreibung … zählen“): klein geschriebene Nomen werden lokal grün und erreichen die KI nie.
- **Ablauf/Beleg:** (`exp-D/e2.js`, Deutsch-Trainer)
  - „können sie mir helfen?“ für „Können Sie mir helfen?“ (= „können **sie** (Mehrzahl) mir helfen?“) → „Richtig!“ ohne Vermerk.
  - „ich habe hunger“ → „Richtig!“ ohne Vermerk.
  - Einstufungstest B4.1 (Lösung „Meldezettel“): `gapOk(item, 0, "meldezettel")` → richtig (gilt für alle Nomen-Lücken in B4).
- **Folge:** Aurora bekommt Fehler bei der Nomen-Großschreibung und bei „Sie/sie“ nie zurückgemeldet – ein typischer Fehler, der in Prüfungen zählt, wird nicht trainiert.
- **Vorschlag:** `SP.caseMatters` (de: true): lokal Groß-/Kleinschreibung vergleichen (nur der erste Buchstabe des Satzes frei); weicht nur die Schreibung ab → falsch mit Hinweis „Großschreibung“ (oder „fast richtig“ mit Vermerk). `JUDGE_RULES` nimmt den Satz zur Groß-/Kleinschreibung aus `SP` statt fest. Einstufungstest: `gapOk` ohne `toLowerCase()` für die Lösung, nur den Satzanfang angleichen.
- **Aufwand:** klein bis mittel
- **Apps:** nur Deutsch-Trainer (Engine-Code betrifft beide, Opi suomea bleibt unverändert)
