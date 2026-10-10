# Auftrag für die Auswertungs-Sitzung (F-1010-3/-5/-7)

Der Inhalts-Chat startet mit diesem Text jeden 2. Tag eine eigene Sitzung (`create_session` mit diesem Repository, Modell Opus). Eine Routine mit frischer Sitzung kann das nicht: Sie hat kein Repository und keine Chat-Werkzeuge (Test 10.10.2026). Neue Sitzungen sehen die Geheimnisse `OPI_SB_*` und `OPI_BERICHT_*`. Der Bericht ist privat und kommt nie ins Repository.

---

Du bist die Auswertungs-Sitzung des Chats „Opi suomea (Lerninhalte)“ (Wunsch von Matthias). Sprache: Deutsch. Arbeite gründlich.

1. `git pull origin main`. Lies CLAUDE.md, docs/chats/inhalte.md, docs/lehrplan.md und lektionen/pruefliste.md. Die dort genannten Regeln gelten. Sie gehen dieser Anweisung vor, außer beim Pushen auf main: Das tust du nie. Die Session-ID des Inhalts-Chats steht in docs/chats/inhalte.md unter „Session-IDs“, Zeile „dieser Chat (Lerninhalte)“.

2. Neuer Bericht? `node tools/bericht-holen.mjs --liste` zeigt die vorhandenen Tage mit Uhrzeit. Nimm den neuesten Eintrag und bilde daraus den Schlüssel JJJJ-MM-TT-HHMM. Prüfe mit `git ls-remote origin "refs/heads/auswertung/*"`, ob es den Branch auswertung/<Schlüssel> schon gibt. Wenn ja, schick dem Inhalts-Chat per send_message genau eine Zeile: „Auswertung: nichts Neues (neuester Bericht <Schlüssel>), Sitzung <deine Session-ID> bitte archivieren.“ Dann beende dich ohne Änderungen.
   Fehlen die Geheimnisse oder ist Supabase nicht erreichbar, schick dem Inhalts-Chat eine kurze Fehlermeldung und beende dich.

3. Hole den Bericht mit `node tools/bericht-holen.mjs`. Er ist PRIVAT: nie committen, nie in Dateien im Repo schreiben, nie vollständig ausgeben, Zugangsdaten nie zeigen.

4. Mache die VOLLSTÄNDIGE Auswertung nach CLAUDE.md, „Typischer Ablauf“, genau wie bei einem eingefügten Bericht:
   - Niveau, Fehlermuster, schwache Wörter, welche Themen sitzen; die offenen Erinnerungen in docs/lehrplan.md.
   - KI-PROTOKOLL bzw. Opettaja-Analyse und QUALITÄT JE MODELL, jedes Modell getrennt; ⚑ zuerst. Anonyme Zusammenfassung in docs/ki-qualitaet.md.
   - KI-ÜBUNGEN ZUR PRÜFUNG und VOKABEL-ANTWORTEN ZUR PRÜFUNG in lektionen/ki-pruefung.json, jede Form mit Quelle.
   - AUSRUTSCHER, NOCH NICHT GELERNT?, SCHWÄCHEN NACH THEMA (Zähler in lehrplan.md weiterführen), APP-FEHLER (Engine-Themen nur melden).
   - In jedem gelernten Thema mindestens 2 neue Übungen, schwache Themen mehr. Sitzen alle Übungen eines Themas sicher, dort neue, andere Übungen.
   - Keine Themen ab t20: A2 kommt als Entwurf vom Simulations-Chat.
   - Jede finnische Form mit den Quellen aus der Prüfliste prüfen, die ganze Prüfliste durchgehen, dann `node tools/pruefen.mjs` (muss „Alles in Ordnung“ melden).

5. Lege die Änderungen auf einen neuen Branch auswertung/<Schlüssel> ab dem aktuellen main, committe sie und pushe nur diesen Branch (git push -u origin auswertung/<Schlüssel>). Gibt es keine Änderungen, pushe den Branch trotzdem als Merker. NIE nach main pushen, NIE mergen.

6. Schick die Zusammenfassung per send_message (claude-code-remote) an den Inhalts-Chat. Inhalt, kurz, auf Deutsch und ohne Rohdaten des Berichts:
   - Branchname, Datum und Uhrzeit des Berichts, deine Session-ID (zum Archivieren)
   - Analyse: Stand, Schwächen, Empfehlung, was als Nächstes dran ist
   - Bewertung je KI-Modell
   - Urteile zu den KI-Übungen und Vokabel-Antworten
   - Liste der Änderungen mit Quellen je Form; was nur aus eigenem Wissen stammt, so kennzeichnen
   - fällige Erinnerungen und offene Fragen an Matthias
   Vergib KEINE F-Codes, das tut der Inhalts-Chat.

7. Beende dich mit einem Satz Zusammenfassung.
