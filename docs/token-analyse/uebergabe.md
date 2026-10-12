# Übergabe der freigegebenen Empfehlungen (12.10.2026)

OK von Matthias: T-1012-9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22. **Nicht** freigegeben: T-1012-23 (Modellwahl).
Dieser Analyse-Chat ändert nichts selbst und kann die anderen Chats nicht erreichen (anderes Konto). Matthias fügt die Texte unten ein.
Reihenfolge: zuerst Text 1 (Funktionen), nach dessen Push Text 2 (Inhalte), dann kurz Text 3 (Deutsch-Trainer).

## Text 1 → „App-Engine: Funktionen“
```
Auftrag aus der Token-Analyse. OK von Matthias (gilt als Freigabe, keine neuen E-Codes nötig):
T-1012-9, -10, -11, -12, -13, -14, -16, -17, -18, -19, -20, -21, -22. Nicht: T-1012-23.
Lies nur: git fetch origin claude/language-app-token-analysis-b75s4a && git show origin/claude/language-app-token-analysis-b75s4a:docs/token-analyse/bericht.md | sed -n '/^## 5/,/^## 6/p'
Vorlage für T-1012-19: git show origin/claude/language-app-token-analysis-b75s4a:docs/token-analyse/werkzeuge/prueflisten-test.mjs
Effort für diesen Auftrag: medium (T-1012-20 und -19 high).

Pakete (je ein Commit, vorher Sicherungs-Branch sicherung/vor-t1012):
A) Sofort: T-1012-9 "autoCompactWindow": 200000 + T-1012-11 "effortLevel": "medium" in .claude/settings.json (auch Deutsch-Trainer; F-1011-1 damit abgelöst).
   T-1012-21: Pflichtlektüre beim Start nur CLAUDE.md + Startdatei; pruefliste-engine.md vor dem Push, engine.md bei Engine-Änderungen.
   T-1012-13: tools/ci-status.mjs (eine Zeile je Lauf: Name, Status, Ergebnis; ohne Schlüssel), Startdateien darauf umstellen; gh run watch nur mit --exit-status, Protokoll nur bei Fehler.
   T-1012-14: pruefen.mjs gibt standardmäßig nur ✗/⚠ und die Schlusszeile aus, alles mit --lang (auch im Workflow --lang lassen, damit GitHub-Protokolle vollständig bleiben). Test + Gegenprobe.
   T-1012-16: Startdatei Schritt 3 – lokaler Deutsch-Trainer-Lauf nur bei sprachabhängigen Änderungen (js/sprache.js, APP-Texte, Einstufungstest, Bewertung); sonst genügt „Engine übernehmen“.
B) Regeln (CLAUDE.md, nur verschieben, nichts löschen):
   T-1012-17: „Typischer Ablauf“ → docs/chats/inhalte.md; „Regeln für Änderungen an der App“ → docs/chats/funktionen.md; Umsiedeln, Chat-Länge, Weiterleiten → neue docs/chats/regeln.md (nur bei Bedarf lesen). Im Kern bleiben: öffentliches Repo, Chat-Tabelle, Matthias' 16 Regeln, Quellenpflicht, Codes (kurz), Tokens sparen. Ziel ≈ 7 KB.
   T-1012-10: ein Thema = kurzer Chat; nach jedem abgeschlossenen Thema /compact mit Behalte-Liste; Umsiedeln, sobald /context > 150.000 (ersetzt die tägliche Prüfung).
   T-1012-12: reine Verwaltung (Session-IDs, Ideenliste, Startdatei) ohne Rückfrage und ohne Code erledigen, gesammelt melden; mehrere Fragen in einer Nachricht. App, Inhalte, Workflows bleiben „erst erklären, dann fragen“.
   T-1012-18: Session-IDs nur in docs/chats/sessions.md, Startdateien verweisen darauf.
C) T-1012-19: Prüflisten-Punkte 6 (doppelte Karten ohne Satzzeichen), 8 (Theorie-Tabellen ≤ 3 Spalten), 9 (≥ 2 mc mit x je Grammatikthema) in tools/pruefen/statisch.mjs – zunächst als Hinweis (warn), damit main grün bleibt; für bewusst gewollte Fälle eine Ausnahmeliste. Zeilen in lektionen/pruefliste.md auf „automatisch“ setzen (Inhalts-Chat informieren). Gegenprobe.
D) T-1012-20: tools/quellen.mjs (E-1009-22): je Wort nur Beugungsklasse + Kernformen (Wiktionary-Rohtext: fi-decl/fi-conj-Vorlage; KS per Playwright nur Stichwortzeile), Ausgabe ≤ 5 Zeilen je Wort; in beide Prüflisten als Standardweg eintragen.
E) T-1012-22: docs/simulation.md und docs/simulationen/uebergabe.md wörtlich nach docs/archiv/; entscheidungen.md monatlich archivieren (Regel in regeln.md).
Danach: Prüfliste, pruefen.mjs, Engine übernehmen, Inhalts-Chat und Deutsch-Trainer-Chat per send_message informieren (T-1012-15/-19/-22 und neue Regeln). Kurze Meldung an Matthias mit Messwert: /context vor und nach dem Auftrag.
```

## Text 2 → „Opi suomea (Lerninhalte)“ (nach Push von Text 1)
```
Auftrag aus der Token-Analyse, OK von Matthias: T-1012-15, -19, -22 (und die neuen Regeln aus T-1012-10/-12/-13, die der Funktionen-Chat eingetragen hat).
Lies nur: git show origin/claude/language-app-token-analysis-b75s4a:docs/token-analyse/bericht.md | sed -n '/^### 4.2/,/^## 5/p'
T-1012-15: Auswertungs-Kette umbauen – send_later weckt eine kleine Starter-Sitzung (nur dafür, nie für anderes nutzen) statt diesen Chat; die Auswertungs-Sitzung meldet ihr Ergebnis direkt an Matthias und übernimmt nach seinem OK selbst auf main; kein zweiter Prüflauf (CI prüft). auswertung-auftrag.md und Startdatei anpassen, alten Trigger löschen, neuen anlegen.
T-1012-19: Funde bewerten (nur anhängen, jede Form mit Quelle): doppelte Karten suomalainen t13-21/t04b-0, ruoka t14c-1/t12c-1, hotelli t16-8/t05-5, kuuma t18-9/t14c-0, matkustaa t19-23/t12-8, tässä t15c-4/t10-11 (gewollt?) → gewollte in die Ausnahmeliste des Prüfskripts; Tabellen mit 4 Spalten t08d t13c t14 t16 t16d t19; < 2 Regelfragen: t02 t03 t03b t06b t07b t08b t08c t10b t10c t11b t12b t12c t13c t14b t15 t15b t15c t16 t17 t18b – nur Grammatikthemen ergänzen. Erst Liste mit F-Code an Matthias, dann ändern.
T-1012-22: nach der A2-Übernahme lektionen/entwuerfe-bis-b1.md und den Themenplan wörtlich ins Archiv.
Effort: medium; Inhalte schreiben und Quellen: high.
```

## Text 3 → „Deutsch-Trainer (Lehrinhalte)“ (kurz, nach Text 1)
```
Info aus der Token-Analyse (OK Matthias): Ab jetzt gelten T-1012-9/-11 (Settings: autoCompactWindow 200000, Effort medium), T-1012-10 (ein Thema = kurzer Chat, Umziehen ab /context > 150.000), T-1012-12 (Verwaltung ohne Rückfrage), T-1012-13 (CI-Status nur gefiltert, tools/ci-status.mjs), T-1012-20 (tools/quellen.mjs, sobald vorhanden). Bitte in docs/uebergabe.md bzw. CLAUDE.md dieses Repos übernehmen (nur Verweise, kurz). Inhalte schreiben und Quellen weiter mit Effort high.
```
