# Archiv: Übergabe an den Inhalts-Chat (Stand 7./8.10.2026)

Wörtlich aus `docs/lehrplan.md` verschoben (S-1008-98, F-1008-9). Aktuelle Startdatei: `docs/chats/inhalte.md`.

## Übergabe an einen neuen Chat „Opi suomea (Lerninhalte)“ (7.10.2026, abends)
Der bisherige Inhalts-Chat (`session_01MjWzFCPLaipFDwvNEToR8s`) wurde zu lang (Token). Hier steht alles zum Weitermachen.

**Zuerst lesen:** `CLAUDE.md`, dieser Abschnitt, `lektionen/README.md`, `docs/uebungsformate.md`, `lektionen/abdeckung.md`, `lektionen/entwuerfe-bis-b1.md`, die letzten Einträge in `docs/entscheidungen.md` und die offenen Erinnerungen oben.

**Andere Chats (`send_message`):**
- „App-Engine: Funktionen“: `session_0178n7MqHz3VvKsjw8JASFNh`, Codes E-…
- „Deutsch-Trainer (Lehrinhalte)“: `session_01XDLQ2V6tk1eM7bLtG3XZRH`, Codes D-…

**Codes:** Der letzte vergebene F-Code ist **F-1008-8** (Stand 8.10.2026). Weiter mit F-1008-9, an späteren Tagen mit `F-<MMTT>-1`. Codes anderer Chats (E-, D-, S-) unverändert verwenden. Gepusht wird nur nach ausdrücklichem OK zu einem Code; der Push auf `main` kann eine Freigabe-Abfrage auslösen, die Matthias bestätigt.

**Wünsche von Matthias (verbindlich, zusätzlich zu CLAUDE.md):**
- Vollständige, ausführliche Themen mit viel Stoff und vielen Übungen. Erst wenn ein Thema perfekt sitzt, geht es weiter. Nichts auslassen, vor allem keine Grundlagen (Beispiel: Uhrzeiten wie 7.52 und *kolmelta*).
- Unterthemen (F-1007-31): x.1 = Kern, x.2 = Wortschatz & Festigen, x.3 = Feinheiten (+ gesprochenes Finnisch), bei Bedarf weitere (16.4). IDs `tNNb/c/d`, Titel mit „(N.2)“.
- Freischaltung: x.2 ist `req` für Thema x+2, x.3 für das erste Thema der nächsten Stufe; die Basis-Unterthemen, 7.2 und 8.4 sind req für t13. Nie `req` an Themen hängen, die schon frei sind.
- Mindestens 15 Übungen pro Thema (F-1007-35), mit Lesetext, Dialog und Schreibaufgabe sowie 2–4 Regelfragen. 20–25 Wörter pro Hauptthema (F-1007-2). Vokabeln nicht doppelt anlegen (vorher gegen alle Themen prüfen).
- Jedes x.3 bekommt 2–3 Verstehensübungen zu gesprochenem Finnisch (F-1007-36, als `mc` „Gesprochen: …“).
- Bei jedem Bericht in jedem gelernten Thema mindestens 2 neue Übungen gegen Auswendiglernen (F-1007-15).
- Vor neuen Themen die Abdeckung gegen eine vollständige Grammatikübersicht prüfen: elon.io und uusikielemme.fi sind im Netzwerk freigegeben, `lektionen/abdeckung.md` dabei abhaken.
- Der Lehrplan soll schlüssig bleiben. Die Entwürfe t20–t43 werden nach den Berichten angepasst und erst nach OK angelegt; dabei die Notiz zu den `req` von t20/t21 in den Entwürfen beachten.
- Dem Engine-Chat keine Simulation mehr vorschlagen.
- Effort steht auf „high“.

**Stand:** 58 Themen (seit 8.10.2026). t01–t08 stehen im Code (je 21–28 Übungen), dazu alle Unterthemen bis 19.3 und 16.4. A1 ist laut `abdeckung.md` vollständig. Matthias steht laut letztem Bericht bei etwa t09–t12.

**Bei jedem Bericht:**
- Analyse nach CLAUDE.md, KI-Protokoll prüfen, `ki-pruefung.json`.
- Zähler „Schwächen nach Thema“ oben weiterführen; nach etwa 3 Berichten eine Empfehlung zu E-1007-8.
- F-1007-11 erneut ansprechen, sobald mehr Daten da sind.

**Arbeitsweise (bewährt):**
- Neue Themen per Python-Skript als Dicts erzeugen und in `lektionen.json` direkt hinter dem Hauptthema einfügen; `json.dumps(L, ensure_ascii=False, indent=2) + "\n"`. In bestehenden Themen nur hinten anhängen.
- Worterklärungen: Meldet `pruefen` „Antippen: nur über KI erklärt in …“, kommt für diese Wörter ein Eintrag in `GLOSS_EXTRA` (`js/inhalte.js`) direkt vor den Eintrag `  saisi: {`. Format: `wort: { de: "…", base: "…", note: "…" },`, Schlüssel klein. Danach Prettier (`node "$(npm root -g)/prettier/bin/prettier.cjs" --write js/inhalte.js`).
- Übungen in BASE_TOPICS anhängen: vor dem schließenden `\n    ]\n  }` hinter `id: "tNN"`.
- Breite Tabellen (3–4 Spalten) knapp halten, sonst meldet `pruefen` „zu breit für 390 px“.
- Ablauf zum Hochladen: `git pull --rebase origin main && node tools/pruefen.mjs && git push -u origin main`. Konflikte in `docs/entscheidungen.md` lösen, indem beide Einträge erhalten bleiben.
