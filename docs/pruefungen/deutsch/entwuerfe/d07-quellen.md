# d07 – Quellen, GLOSS_EXTRA, Prüfung (Entwurf, Simulations-/Analyse-Chat, 12.10.2026)

Entwurf: `d07.json` (13 Karten, 61 Übungen: tab 6, gap 27, mc 11, tr 6, ord 3, les 3, dlg 2, sch 3). Grundlage: Plan D-1012-11, Anleitung vom Deutsch-Trainer-Chat, Stand deutsch-trainer d99d0e2. Nach d07 folgt Checkpoint 1; darum viele Mischübungen zu d04–d06.

**Regel ab 12.10. (Matthias):** Zu jedem österreichischen Wort steht die bundesdeutsche Alternative auf der Karte bzw. im GLOSS-Vorschlag, und wo ein österreichisches Wort in einer Lösung vorkommt, gilt das bundesdeutsche Wort ebenfalls als richtig (hier: Häferl → Tasse/Becher, Kasten → Schrank). Prüfskript: `oesterr.js` (Ergebnis für d01–d07 im Gesamtbericht S-1012-111).

## 1. Quellen
| Form/Regel | Quelle | Ergebnis |
|---|---|---|
| Firmenfeier | Duden (en.wiktionary ohne Seite) | feminin, Plural die Firmenfeiern |
| Garderobe | en.wiktionary; de.wiktionary; Duden | {{de-noun\|f}}; Bedeutung [2] „Raum, in dem Besucher … ihre Kleidung aufbewahren“, [4] „Möbelstück zur Aufbewahrung von Kleidung“; Plural die Garderoben |
| Mantel | en.wiktionary | {{de-noun\|m,,^}} → die Mäntel |
| Jacke | en.wiktionary | {{de-noun\|f}} → die Jacken |
| Schal | en.wiktionary | {{de-noun\|m,,s:e[less common]}} → die Schals (seltener Schale) |
| Regenschirm | en.wiktionary | {{de-noun\|m,(e)s}} → die Regenschirme |
| Handschuh | en.wiktionary | {{de-noun\|m,s:es,e}} → die Handschuhe |
| Häferl | Duden (en.wiktionary ohne Seite) | Neutrum, Gebrauch „österreichisch umgangssprachlich“, Bedeutung „Tasse“; Plural die Häferl |
| Kühlschrank | en.wiktionary | {{de-noun\|m,(e)s,^e}} → die Kühlschränke |
| vergessen | en.wiktionary | vergessen<vergisst#vergaß,vergessen> |
| verlieren | en.wiktionary | verlieren<verlor,verloren> |
| finden | en.wiktionary | finden<fand,gefunden> |
| abholen | en.wiktionary | {{de-verb\|ab.holen}} schwach: holte ab, hat abgeholt |
| meins / meines | en.wiktionary „meins“ | „alternative form of meines … slightly informal but fully standard“ → beide akzeptiert |
| keiner / keins | en.wiktionary „keiner“ | {{de-decl-keiner}} (Formen allein) neben {{de-decl-kein}} (vor dem Nomen) |
| welche (= some) | en.wiktionary „welche“ | Bedeutung „some“ (unbestimmt, Plural) |
| denen | en.wiktionary „denen“ | „inflection of der: dat p“, demonstrative „(to) that, (to) him/her“ |
| eins | en.wiktionary „eins“ | „contraction of eines (nominative/accusative neuter of ein)“ |
| Kasten = Schrank | Duden (siehe d06) | „süddeutsch, österreichisch, schweizerisch“ |
| ein-Wörter allein mit der-Endungen (meiner/meins) | de-decl-keiner und „meins“ (en.wiktionary) | übereinstimmend; grammis nicht eigens abgerufen |

**Ohne Quelle:** Hinweis in der Theorie „der/die/das allein ist in der gesprochenen Sprache sehr häufig, *er/sie/es* neutraler“ (Stilhinweis); Natürlichkeit der Dialoge und Lesetexte.

## 2. GLOSS_EXTRA-Vorschläge
Nur zum Testen lokal eingetragen; *kühlschrank* steht schon unter den d04-Vorschlägen und fehlt darum hier.
```js
  "firmenfeier": {de: "company party", note: "die Firmenfeier, die Firmenfeiern"},
  "garderobe": {de: "cloakroom; coat rack", note: "die Garderobe, die Garderoben"},
  "mantel": {de: "coat", note: "der Mantel, die Mäntel"},
  "mäntel": {de: "coats", base: "Mantel", note: "Plural"},
  "jacke": {de: "jacket", note: "die Jacke, die Jacken"},
  "schal": {de: "scarf", note: "der Schal, die Schals"},
  "regenschirm": {de: "umbrella", note: "der Regenschirm, die Regenschirme; kurz: der Schirm"},
  "regenschirme": {de: "umbrellas", base: "Regenschirm", note: "Plural"},
  "schirm": {de: "umbrella (short for Regenschirm)", note: "der Schirm, die Schirme"},
  "schirme": {de: "umbrellas", base: "Schirm", note: "Plural"},
  "handschuhe": {de: "gloves", base: "Handschuh", note: "der Handschuh, die Handschuhe"},
  "häferl": {de: "mug, cup (Austria, informal; Germany: Becher, Tasse)", note: "das Häferl, die Häferl"},
  "becher": {de: "mug; beaker (Austria: Häferl)", note: "der Becher, die Becher"},
  "tasse": {de: "cup", note: "die Tasse, die Tassen"},
  "büroküche": {de: "office kitchen", note: "die Büroküche"},
  "vergaß": {de: "forgot", base: "vergessen", note: "Präteritum"},
  "verlor": {de: "lost", base: "verlieren", note: "Präteritum"},
  "verloren": {de: "lost", base: "verlieren", note: "Partizip II: hat verloren"},
  "fand": {de: "found", base: "finden", note: "Präteritum"},
  "holte": {de: "fetched", base: "holen", note: "Präteritum; holte … ab = picked up (abholen)"},
  "abgeholt": {de: "picked up, collected", base: "abholen", note: "Partizip II: hat abgeholt"},
  "gesehen": {de: "seen", base: "sehen", note: "Partizip II: hat gesehen"},
  "dein": {de: "your (du)", note: "ein-Wort: dein, deine, dein, deine"},
  "meins": {de: "mine (neuter)", base: "mein", note: "auch: meines; das Häferl → meins"},
  "meines": {de: "mine (neuter)", base: "mein", note: "auch: meins"},
  "ihrer": {de: "hers / theirs (masc.); her (fem. Dat.)", base: "ihr", note: "Ihrer = yours (Sie)"},
  "ihren": {de: "her / their / your (Sie) – masc. Akk.", base: "ihr", note: "Ihren Ausweis = your ID (Sie)"},
  "grau": {de: "grey"},
  "ausweis": {de: "ID card, identity card", note: "der Ausweis, die Ausweise"},
  "beamtin": {de: "official, civil servant (woman)", note: "die Beamtin; der Beamte"},
  "fuß": {de: "foot", note: "der Fuß, die Füße; zu Fuß gehen = to walk"},
  "hund": {de: "dog", note: "der Hund, die Hunde"},
  "joghurt": {de: "yoghurt", note: "das oder der Joghurt"},
  "straßenbahn": {de: "tram (Austria, informal: Bim)", note: "die Straßenbahn, die Straßenbahnen"},
  "schrank": {de: "cupboard, wardrobe (Austria: Kasten)", note: "der Schrank, die Schränke"},
  "meiner": {de: "mine (masc. Nom.); my (fem. Dat.)", base: "mein", note: "Das ist meiner (der Mantel)."},
```

## 3. req
`["d01","d02","d04","d05","d06"]` wie im Plan. Mischübungen: d01 Perfekt/Futur (4–8, 42, 56), d02 deshalb/trotzdem/dass (27, 28, 49), d04 Plural (31, 39), d05 Artikel im Dativ/Akkusativ, Herr (26, 30, 32, 38), d06 Pronomen und gehören (29, 40, 47).

## 4. Ergebnis `node tools/pruefen.mjs`
Lokale Kopie von deutsch-trainer d99d0e2 mit d04–d07 hinten angehängt (nicht gepusht):
- ohne die d07-Vorschläge: „Alles in Ordnung · 1 Hinweis“ – Wortprüfung: vergaß, verlor, fand, holte, verloren, abgeholt, dein, grau, gesehen.
- mit den Vorschlägen: **„Alles in Ordnung · 75 Prüfungen bestanden“, kein Hinweis.**
- Großgeschriebene Wörter mit eigenem Skript nachgeprüft (S-1012-102): nur Namen, Grammatikbegriffe, Englisch und eine falsche mc-Option (*Mantels*) bleiben übrig.

## 5. Prüfliste 1–16
| Zeile | Ergebnis |
|---|---|
| 1 | ✓ Formen mit Quelle; Häferl mit Duden-Vermerk „österreichisch umgangssprachlich“ und bundesdeutscher Alternative |
| 2 | ✓ `h` nennt nur die Wortart (mein-/ein- allein, der/die/das allein, welch-), nie die Form; Lücke 17 „Wort ohne Nomen (some)“ |
| 3 | ✓ mit Vorschlägen keine Hinweise |
| 4 | ✓ keine Karte aus d01–d06 doppelt (*Kühlschrank* bisher nur GLOSS-Vorschlag in d04, keine Karte) |
| 5 | ✓ meins/meines, eins/eines, keins/keines; Häferl/Tasse/Becher; Kasten/Schrank; Wortstellungen |
| 6 | ✓ Theorie-Tabellen höchstens 3 Spalten |
| 7 | ✓ Großschreibung (Lücken am Satzanfang: Der/Den/Die/Das/Welcher – erster Buchstabe frei) |
| 8 | ✓ Umlaute exakt (Mäntel, vergaß, Häferl) |
| 9 | ✓ ord 47–49 mit allen Stellungen; 49 auch „dass Lena der Schal gehört“ |
| 10 | ✓ keine Alternativen in Tabellenlücken außer ganzen Formen (meins\|meines, keins\|keines) |
| 11 | ✓ Kartenklammern verraten nichts |
| 12 | ✓ neues Thema |
| 13 | ✓ nicht betroffen |
| 14 | Niveau laut Plan (A2) |
| 15 | ✓ 61 Übungen, 8 Formate |
| 16 | ✓ vier Verbkarten mit Zeitformen; Präteritum-/Perfekt-Tabelle (4, 5), Futur-Lücken (6, 7), Perfekt-Lücke (8) |

**Anteil:** Teilregeln (0–3, 9–26, 33–37, 41, 43–46, 48, 57–59) ≈ 65 %; Mischung d01–d06 und Lesen/Schreiben ≈ 35 % – bewusst etwas mehr Mischung vor Checkpoint 1.

## 6. Offene Fragen und Befunde (S-Codes)
Keine neuen.
