# Natürlichkeitsprüfung finnischer Lerntexte (S-1009-1) – gemeinsame Anleitung

## Hintergrund
Eine Finnisch-Lern-App für einen deutschsprachigen Erwachsenen (Österreich, lernt seit Oktober 2026 von null; Niveau
A1.1 → A2.2). Die Inhalte sind **bewusst zuerst in Schriftsprache (kirjakieli)** geschrieben; Umgangssprache (mä oon, sä
oot, me mennään …) steht nur als Hinweis in den Theorie-Abschnitten „So sagt man’s gesprochen“. Seine finnische
Freundin (Muttersprachlerin) sagt: Die **Dialoge wirken oft unnatürlich, so würde sie das nie sagen**.
Zu klären ist für **jeden** nummerierten Satz: richtig, aber nur Schriftsprache? Richtig, aber für das Niveau vereinfacht?
Oder wirklich unidiomatisch bzw. falsch? Sei **so kritisch und genau wie möglich**, aber fair: Ziel ist eine belastbare
Diagnose, keine Schönfärberei und keine Übertreibung.

## Eingabe
Je Thema eine Datei `texte/<id>.txt`. Nummerierte Einheiten (nur diese bewerten):
- `th.N` Satz aus einer Theorie-Tabelle („Nützliche Sätze“, Dialoge, Beispiele), `th.gN` ganzer Abschnitt „So sagt man’s
  gesprochen“ (prüfe: sind die gesprochenen Formen richtig und so gebräuchlich?)
- `vN` Vokabelkarte mit mehreren Wörtern (Wendung) – Finnisch = Deutsch
- `eN` Übung: Lücke (Lösung in «»), Übersetzung (⇒ Musterlösung), Satzbau, Schreiben (⇒ Mustertext), MC
- `eN.rM` Dialogzeile (Sprecher: Text; «…» = Musterlösung der Lernenden, „auch:“ = weitere akzeptierte Antworten)
- `eN.sM` Zeile eines Lesetextes
Nicht nummerierte Zeilen (Theorie-Fließtext, Tabellen, Fragen) sind nur Kontext. Offensichtliche Fehler dort trotzdem
unter der ID `th` bzw. `eN` melden.
Prüfe auch, ob die **deutsche Übersetzung/Aufgabe zum Finnischen passt** (Bedeutung verschieden → E).

## Klassen
- **A – richtig und natürlich.** So schreibt oder sagt man es in dieser Situation (geschriebener Text, Schild, E-Mail,
  Nachricht, Amt; im Gespräch auch höfliche Standardsprache, die man so hört).
- **B – richtig, typische Schriftsprache.** Grammatisch und lexikalisch korrekte Standardsprache, die **im gesprochenen
  Alltagsdialog** steif/buchhaft klingt, nur weil sie kirjakieli ist. Gib ein Merkmal-Kürzel an:
  `pron` minä/sinä/hän/he statt mä/sä/se/ne · `verb` volle Verbformen (olen, olet, menemme …) statt oon, oot …
  · `me` me + -mme statt me + Passiv (me mennään) · `poss` Possessivsuffix (nimeni, kotisi) · `ko` Frage mit -ko/-kö
  statt -ks/ohne · `lex` schriftsprachliches Wort (z. B. kuinka statt miten, auto statt…) · `num` Zahl voll statt
  kurz (kaksikymmentä → kakskyt) · `andere` (kurz erklären).
  Lesetexte, die geschriebene Texte sind (E-Mail, Zettel, Nachricht, Bericht, Tagebuch), sind in Schriftsprache **A**,
  nicht B. B gilt nur dort, wo gesprochen wird (Dialoge, wörtliche Rede, Telefonat …).
- **C – richtig, lehrbuchhaft vereinfacht** (für das Niveau vertretbar). Grammatisch korrekt, aber zu vollständig, zu
  explizit oder zu schematisch: ganzer Satz, wo man nur ein Wort antwortet; Pronomen ständig wiederholt; jede Zeile
  ein Muster-Satz; abgehackte Folge kurzer Sätze; Gesprächsverlauf zu glatt; Echo-Antworten („Onko sinulla koira? –
  Kyllä, minulla on koira.“).
- **D – grammatisch richtig, aber so sagt/schreibt es kein Finne – ersetzen.** Falsche oder seltsame Wortwahl,
  Kollokation, Lehnübersetzung aus dem Deutschen, unpassendes Register (z. B. viel zu förmlich/zu vertraut für die
  Situation), pragmatisch seltsam (unpassende Reaktion, falsche Höflichkeitsformel, unrealistischer Ablauf), ungewöhnliche
  Wortstellung ohne Grund, veraltet. **Auch in Schriftsprache unnatürlich** – sonst ist es B oder C.
- **E – falsch.** Grammatik (Kasus, Rektion, Kongruenz, Verbform, Stufenwechsel), Rechtschreibung, Bedeutung passt nicht
  zur deutschen Vorgabe, sachlich falsch (z. B. Fakten zu Finnland/Österreich, Wochentag, Rechnung).

Grenzfälle: Zwischen B/C und D entscheidet die Frage „Würde eine Finnin das **auch in sorgfältiger Schriftsprache bzw. in
höflicher Standardsprache** so nicht sagen?“ Ja → D. Nur weil es gesprochen anders klänge → B. Nur weil es zu einfach
oder zu vollständig ist → C. Wenn unsicher zwischen zwei Klassen: die strengere nehmen und „(unsicher)“ dazuschreiben.

## Ausgabe (WICHTIG: nach JEDEM Thema sofort anhängen, nicht erst am Ende!)
Schreibe in deine Ausgabedatei (Pfad steht im Auftrag) mit Bash `cat >> DATEI <<'EOF' … EOF`. Je Thema genau dieser Block:

```
## t04
B: e19.r0:pron e19.r2:pron e18.s3:pron
- e19.r1 | C | ganze Vorstellung statt nur Name | geschrieben: Olen Matthias. | gesprochen: Mä oon Matthias. / Matthias.
- e7.r2 | D | „Kuinka voit?“ fragt man so im Alltag kaum; … | geschrieben: Mitä kuuluu? | gesprochen: Mitä kuuluu? / Miten menee?
- e12 | E | Partitiv nötig: … | richtig: … | Quelle: …
Eindruck: (1–2 Sätze, z. B. „Dialoge durchgehend Schriftsprache, sonst natürlich; zwei echte Fehler.“)
```
- Die B-Zeile: alle B-Einheiten des Themas mit Kürzel, durch Leerzeichen getrennt (leer lassen, wenn keine).
- Jede C-, D- und E-Einheit eine eigene Zeile mit Grund und natürlicher Alternative (geschrieben **und** gesprochen).
- Alles, was nicht genannt wird, gilt als **A**. Also nichts weglassen, was nicht A ist.
- Am Ende der Datei: `## FERTIG` und darunter 5–10 Sätze Gesamturteil für deine Gruppe (Was ist das Hauptproblem? Liegt
  der Eindruck der Freundin eher an Schriftsprache, Vereinfachung oder echten Fehlern?).

## Regeln
- Arbeite **unabhängig**: Lies nur die Dateien deiner Gruppe und diese Anleitung, keine Dateien in `funde/` außer deiner
  eigenen. Ändere nichts im Repository, keine Commits.
- Antworte und schreibe auf Deutsch; finnische Beispiele exakt.
- Werkzeuge: WebSearch/WebFetch (falls nötig erst mit ToolSearch laden: `select:WebSearch,WebFetch`).
- Deine Schlussantwort: nur kurz Anzahl B/C/D/E und die 3 schwersten Funde – die Details stehen in der Datei.
