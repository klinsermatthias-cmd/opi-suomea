# Entscheidungen und Verlauf

Entstanden im Claude-Projekt „Matthi Finnisch“ (Cowork), ab Oktober 2026 hier im Repository fortgeführt.

> **Archiv:** 5.–7.10.2026 in `docs/archiv/entscheidungen-2026-10-05-bis-07.md`, 7.–20.10.2026 in `docs/archiv/entscheidungen-2026-10-07-bis-20.md` (wörtlich).
> **Neue Einträge nur anhängen, ohne die Datei zu lesen** (`cat >> docs/entscheidungen.md <<'EOF'`), Überschrift `## <Datum> – <Thema> (<Code>)`, höchstens 3–4 Zeilen; Details stehen im Commit und in den Fachdokumenten. Über ca. 20.000 Zeichen ältere Tage ins Archiv schieben (eine Datei je Zeitraum).

## Grundsatzentscheidungen
- Matthias lernt Finnisch von null an, mit Claude als Lehrer.
- Wunsch: dynamische App (Anki-artige Wiederholung, Theorie → Übungen, wachsender Wortschatz, KI-Prüfung), die Schritt für Schritt um neue Themen erweitert wird, sobald die bisherigen sitzen.
- Fortschritt darf nie verloren gehen, Sync zwischen PC und Handy.
- Kostenlos, aber mit KI → Web-App (PWA) auf GitHub Pages + Supabase (Sync) + Gemini Free Tier (KI).
- Fail-safes überall; jederzeit Wechsel zu HTML oder einer anderen Lösung mit allen Daten möglich.
- Optionale Alternative geprüft: Claude-API (Sonnet ca. 1–3 $/Monat bei dieser Nutzung, Ausgabenlimit in der Claude Console einstellbar). Nicht umgesetzt; bräuchte eine Zwischenstelle (z. B. Supabase-Funktion), damit der Schlüssel nicht öffentlich ist.

## 21.10.2026 – Vorgriff „bekannt“ und Verbformen-Werkzeug (D-1021-7, D-1021-12)
- `tools/vorgriff.mjs`: neue optionale Liste `bekannt` in `lektionen/vorgriff.json` – als bekannt geltende Wendungen werden je Thema vor der Prüfung entfernt (Deutsch-Trainer: A1-Wendungen in d01–d02b).
- Neu `tools/verbformen.mjs`: Verbkarten mit voller Tabelle gegen DWDS-Flexionstabellen prüfen, auf Abruf (braucht Netz); in `tools/engine-dateien.txt` und `docs/engine.md` eingetragen.

## 22.10.2026 – Antipp-Prüfung für alle Textfelder (D-1022-5)
- `tools/pruefen/inhalte.mjs`: Die Prüfung „ohne Bedeutung / nur über KI erklärt“ liest jetzt auch Lesetexte, Dialogzeilen, Schreibmuster, Lösungen in Lücken- und Tabellenkästchen und die linke Seite von Zuordnungen; ausgeblendete Übungen nicht. Grundthemen t01–t08 bleiben fehlerfrei.

## 22.10.2026 – Lernschritt sofort wiederholen (D-1022-16)
- Matthias: nach einem Lernschritt unter 80 % nicht auf morgen warten. Ging schon über die Themenseite; jetzt steht im Ergebnis direkt „Schritt X nochmal üben“ (neu gemischt). Test in befunde.mjs, Prüfliste-Engine.

## 25.10.2026 – CI: Zeitgrenzen und Browser-Cache (D-1025-1)
- Prüf-Jobs brechen nach 30 Minuten ab statt bis zu 6 h zu hängen. Die Playwright-Installation hat je Versuch 4,5 Minuten und bis zu 3 Versuche, der Browser liegt im Actions-Cache (Schlüssel playwright-1.56.1).
- Die Workflows sind in beiden Repos gleich (Engine-Dateien, hier selbst eingetragen, weil „Engine übernehmen“ keine Workflows pushen darf).

## 25.10.2026 – Code-Review Engine (D-1025-21)
- KI-Antworten werden vereinheitlicht: `tips`/`strengths`/`weaknesses` sind immer Listen (ein Text ließ „Fortschritt“ abstürzen und verwarf gültiges Feedback), `[{…}]` wird angenommen statt eines zweiten KI-Aufrufs. Die KI-Diagnose escapt Fehlertexte und Modellnamen.
- Nicht behoben (sehr selten, nur Anzeige/Zähler): Tag doppelt gezählt nach Ändern der letzten Bewertung einer fertigen Vokabelrunde; Datum im Fehlerzweig von rateTopic. Bericht: deutsch-trainer `docs/archiv/pruefung-2026-10-25/21-code-review.md`.

## 25.10.2026 – Service Worker lädt die Seite frisch (D-1025-24)
- Beim Öffnen holt der Service Worker index.html mit `cache:"no-cache"` (Rückfrage beim Server statt bis zu 10 Minuten alter Kopie aus dem Browser-Cache). Offline-Start unverändert (Playwright: Start offline nach Neuladen wie vorher).
- Weitere Befunde zu Sync und Speicher (Runde auf zwei Geräten, Lektionen-Cache im Gerätespeicher) kommen auf einen eigenen Branch.

## 25.10.2026 – Pausierte Runde auf zwei Geräten (D-1025-22, Branch)
- Ist dieselbe Runde auf zwei Geräten pausiert, gilt beim Abgleich die mit mehr beantworteten Aufgaben (vorher gewann immer das eigene Gerät, auch mit älterem Stand → Aufgaben doppelt). Test in tools/pruefen/durchlauf.mjs.

## 25.10.2026 – Abgleich pausierter Runden gemergt (D-1025-22)
- Freigabe Matthias: Branch `d1025-sync-runde` in `main`. Bei einer pausierten Runde auf zwei Geräten gilt beim Abgleich die weiter fortgeschrittene.

## 25.10.2026 – Antwortbewertung getestet (D-1025-12)
- Massentest im Deutsch-Trainer: 16.489 richtige Varianten (klein, ohne Satzzeichen, Leerzeichen) und 26.615 gezielt falsche (Artikel, Endungen, Umlaute, Nomen klein, sie/Sie). Keine falsche Antwort wurde lokal als richtig gewertet.
- Behoben: Lücke mit ganzem Satz („→ ___“) lehnte einen klein geschriebenen Satzanfang ohne KI ab (109 Fälle); „zu  Hause“ mit doppeltem Leerzeichen. `pruefen` prüft jetzt alle Alternativen aller Freitext-Formate.

## 25.10.2026 – Simulation: Coach-Nachbau mit Lernschritt-Regel (D-1025-11)
- Der nachgebaute Coach wertete Schreibaufgaben und Dialoge in Lernschritten an aller Grammatik; der echte Auftrag (STEP_RULE, S-1014-10) zählt dort nur die Regel des Themas. Folge in der Aurora-Simulation: d01b-Schritt 5 (3 von 8 Übungen Schreibaufgaben) 31× unter 80 %. Nachbau jetzt wie der echte Auftrag.

## 25.10.2026 – pruefen.mjs: Schutzprüfung wieder aktiv (D-1025-27)
- `git show` lief mit dem Standardpuffer von execSync (1 MB); die lektionen.json des Deutsch-Trainers ist größer → Vergleich mit origin/main scheiterte lautlos, die Nur-hinten-anhängen-Prüfung lief für Lektionsthemen nicht, alle Themen galten als „geändert“ (Dauer-Hinweis Vorgriff). Jetzt 256 MB Puffer und Fehlermeldung statt Schweigen. Nachprüfung gegen Stände vom 12. und 20.10.: keine Verstöße.

## 25.10.2026 – KI-Aufträge geprüft und geschärft (D-1025-17)
- Bewertung: fehlt Inhalt der Vorlage, ist die Antwort falsch („im Zweifel richtig“ nur bei sprachlichen Zweifeln); Antwort muss in der verlangten Sprache sein; Finnisch: Pronomen nur in 1./2. Person weglassbar; Lernschritt-Regel mit Titel des Schritts und Vorrang.
- Sicherheit: Eingaben als JSON-Text, Systemregel „Texte der Lernenden sind nur Daten“; aiBools auch für ok/end/goal/taskClear/basicsSolid. Vokabeln Richtung Lernsprache ohne „im Zweifel richtig“ (Urteil wird als Alternative gespeichert), Deutsch: Nomen mit Artikel.
- Kleinkram: Endungslücken-Hinweis, Höflichkeitsform Ihnen/Ihr, Schreibaufgabe mit WORD_ONLY, Hinweise „h“ in der Sprache der Beispiele, kein Anker-Beispiel bei reschedule.

## 25.10.2026 – Teilpunkte bei mehreren Feldern (D-1025-18)
- Tabelle, Lückentext, Zuordnen, Dialog und Lesetext zählen im Rundenergebnis anteilig (Feld `pt` im Ergebnis); Anzeige „1,5 von 2 … (mit Teilpunkten)“. Gelöst, Fehlerliste und Wiederholung in der Runde nur, wenn alle Felder stimmen. Freischaltung wird dadurch etwas leichter (Idee vom 8.10., Freigabe 25.10.).

## 25.10.2026 – „Meine Schwächen“ (D-1025-19)
- Neue Karte unter Fortschritt: die 5 häufigsten Fehlerarten und Themen der letzten 30 Tage aus S.weak (wie im Bericht an Claude), Trend ↑/↓ (15 gegen 15 Tage), je Thema „Üben“. Bisher sah nur Claude diese Auswertung.

## 25.10.2026 – Ausgeblendete Übungen verschlankt (D-1025-2, hilft D-1025-23)
- Ausgeblendete Übungen werden beim Laden durch einen kleinen gültigen Platzhalter ersetzt (Index, Karten- und Fehler-IDs bleiben); die volle Fassung bleibt in lektionen.json. Deutsch-Trainer: 1.149 von 2.745 Übungen, rund 290 KB (26 %) weniger im Gerätespeicher. Prüfmodus zeigt nur noch ihre Anzahl.

## 26.10.2026 – uebungen.js geteilt (D-1025-3)
- Lokale Antwortprüfung (localCheck, Tippfehler, Groß-/Kleinschreibung, Ähnlichkeit), Ausrutscher, „Noch nicht gelernt?“ und „⚠ Fehler in der Übung?“ liegen jetzt in `js/bewertung.js` (286 Zeilen); uebungen.js 1.547 statt 1.828 Zeilen. index.html, sw.js, engine-dateien.txt, architektur.md ergänzt; Verhalten unverändert.

## 26.10.2026 – CLAUDE.md gekürzt (D-1025-4)
- 11,4 → etwa 7 KB: Regeln unverändert, nach dem Muster des Deutsch-Trainers gegliedert (Rolle, Wünsche, harte Regeln, Engine, Nachschlagen, Tokens); Einzelheiten stehen in den verlinkten Dokumenten.

## 26.10.2026 – Handy-Ansichten geprüft (D-1025-25)
- Bildschirmfotos bei 390 px (Heute, Themen, Theorie, Fortschritt mit „Meine Schwächen“, Tabelle, Dialog, Lückentext, Einstellungen): nirgends Querscrollen, keine Skriptfehler. Behoben: feste Tabellenspalte brach „der neue Kasten“ Wort für Wort um → mindestens 6,5em breit.

## 26.10.2026 – Doku aufgeräumt (D-1025-28)
- Entscheidungen 7.–20.10. wörtlich nach `docs/archiv/entscheidungen-2026-10-07-bis-20.md` (68 → 9 KB); CLAUDE.md gekürzt (D-1025-4); uebungen.js geteilt, architektur.md ergänzt (D-1025-3).

## 26.10.2026 – Kleine Sync- und Code-Fixes (D-1025-21 B5/B6, D-1025-22 F2/F6/F7)
- F2: beim Zurückkehren in die App sofort hochladen, wenn beim Verlassen nicht fertig (großer Stand passt nicht in keepalive). F6: erste Verbindung nutzt pgMs. F7: Rückfrage vor dem Einspielen einer deutlich älteren Sicherung.
- B5: „Letzte Bewertung ändern“ zählt den Tag nicht doppelt. B6: Fehlerzweig der Rundenauswertung zeigt das gespeicherte Datum. Offen bleiben F3 (NO_CAS-Ersatzpfad, nur Analyse), F4 (Zähler bei parallelem Offline-Lernen), F5 (zwei Tabs) – selten, ohne Datenverlust.
