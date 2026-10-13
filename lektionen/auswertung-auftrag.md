# Auftrag für die Auswertungs-Sitzung (F-1010-3/-5/-7)

Die **Starter-Sitzung** (`lektionen/auswertung-starter.md`, T-1012-15) startet mit diesem Text jeden 3. Tag eine eigene Sitzung (`create_session` mit diesem Repository, Modell Opus, Titel „Opi suomea: Auswertung <Datum>“). Der große Inhalts-Chat wird dafür nicht mehr geweckt. Eine Routine mit frischer Sitzung kann das nicht: Sie hat kein Repository und keine Chat-Werkzeuge (Test 10.10.2026). Neue Sitzungen sehen die Geheimnisse `OPI_SB_*` und `OPI_BERICHT_*`. Der Bericht ist privat und kommt nie ins Repository.

---

Du bist die Auswertungs-Sitzung des Chats „Opi suomea (Lerninhalte)“ (Wunsch von Matthias). Sprache: Deutsch. Arbeite gründlich.

1. `git pull origin main`. Lies CLAUDE.md, docs/chats/inhalte.md, docs/lehrplan.md und lektionen/pruefliste.md. Die dort genannten Regeln gelten. Sie gehen dieser Anweisung vor, außer beim Pushen auf main: Das tust du nur nach Matthias' OK (Schritt 6). Du zählst als Teil des Inhalts-Chats; Codes für Matthias: `F-<MMTT>-A<Nr>` (A = Auswertung, damit sie sich nie mit den Codes des Inhalts-Chats überschneiden). Effort: high.

2. Neuer Bericht? `node tools/bericht-holen.mjs --liste` zeigt die vorhandenen Tage mit Uhrzeit. Nimm den neuesten Eintrag und bilde daraus den Schlüssel JJJJ-MM-TT-HHMM. Prüfe mit `git ls-remote origin "refs/heads/auswertung/*"`, ob es den Branch auswertung/<Schlüssel> schon gibt. Wenn ja, antworte mit genau einer Zeile „Auswertung: nichts Neues (neuester Bericht <Schlüssel>)“ und beende dich ohne Änderungen (kein send_message; die Starter-Sitzung archiviert dich beim nächsten Lauf).
   Fehlen die Geheimnisse oder ist Supabase nicht erreichbar, antworte mit einer kurzen Fehlermeldung und beende dich.

3. Hole den Bericht mit `node tools/bericht-holen.mjs`. Er ist PRIVAT: nie committen, nie in Dateien im Repo schreiben, nie vollständig ausgeben, Zugangsdaten nie zeigen.

4. Mache die VOLLSTÄNDIGE Auswertung nach CLAUDE.md, „Typischer Ablauf“, genau wie bei einem eingefügten Bericht:
   - Niveau, Fehlermuster, schwache Wörter, welche Themen sitzen; die offenen Erinnerungen in docs/lehrplan.md.
   - KI-PROTOKOLL bzw. Opettaja-Analyse und QUALITÄT JE MODELL, jedes Modell getrennt; ⚑ zuerst. Anonyme Zusammenfassung in docs/ki-qualitaet.md.
   - KI-ÜBUNGEN ZUR PRÜFUNG und VOKABEL-ANTWORTEN ZUR PRÜFUNG in lektionen/ki-pruefung.json, jede Form mit Quelle.
   - AUSRUTSCHER, NOCH NICHT GELERNT?, SCHWÄCHEN NACH THEMA (Zähler in lehrplan.md weiterführen), APP-FEHLER (Engine-Themen nur melden).
   - In jedem gelernten Thema mindestens 2 neue Übungen, schwache Themen mehr. Sitzen alle Übungen eines Themas sicher, dort neue, andere Übungen.
   - Keine Themen ab t20: A2 kommt als Entwurf vom Simulations-Chat.
   - Jede finnische Form mit den Quellen aus der Prüfliste prüfen, die ganze Prüfliste durchgehen, dann `node tools/pruefen.mjs` (muss „Alles in Ordnung“ melden).

5. Lege die Änderungen auf einen neuen Branch auswertung/<Schlüssel> ab dem aktuellen main, committe sie und pushe nur diesen Branch (git push -u origin auswertung/<Schlüssel>). Gibt es keine Änderungen, pushe den Branch trotzdem als Merker.

6. Zeig Matthias die Zusammenfassung **direkt hier** in dieser Sitzung (T-1012-15; kein send_message an den Inhalts-Chat). Kurz, auf Deutsch, ohne Rohdaten des Berichts:
   - Branchname, Datum und Uhrzeit des Berichts
   - Analyse: Stand, Schwächen, Empfehlung, was als Nächstes dran ist
   - Bewertung je KI-Modell
   - Urteile zu den KI-Übungen und Vokabel-Antworten
   - Liste der Änderungen mit Quellen je Form; was nur aus eigenem Wissen stammt, so kennzeichnen
   - fällige Erinnerungen und offene Fragen an Matthias
   - am Ende **ein** Code `F-<MMTT>-A<Nr>` „übernehmen“ (und bei Bedarf einzelne Codes für Teile)
   Gibt es ein Werkzeug für Push-Benachrichtigungen, schick Matthias eine Zeile „Auswertung <Datum> fertig“.
   Nach seinem OK: `git fetch origin main`. Hat sich main seit deinem Branch nicht geändert, den Branch nach main pushen (fast-forward), **ohne** zweiten Prüflauf. Hat sich main geändert: auf main rebasen (enthält dein Branch einen Merge-Commit, z. B. eine eingemergte ältere Auswertung, stattdessen `git merge origin/main` – ein Rebase spielt alte Konflikte erneut ab; Lehre 13.10.), `node tools/pruefen.mjs` einmal, dann pushen. Danach `node tools/ci-status.mjs --warten` (eine Zeile). Bei Rot: melden, nicht raten.

7. Beende dich mit einem Satz Zusammenfassung.
