# Opi suomea – Anleitung für Claude

Dieses Repository ist die Finnisch-Lern-App von **Matthias** und zugleich der Ort, an dem Claude als sein Finnisch-Lehrer arbeitet.
Live: https://klinsermatthias-cmd.github.io/opi-suomea (GitHub Pages über GitHub Actions). Jeder Push auf `main` wird geprüft (`tools/pruefen.mjs`) und ist nur bei Erfolg nach 2–3 Minuten live.

> **Das Repository ist öffentlich.** Niemals Fortschrittsberichte, Schlüssel (Gemini, Supabase), E-Mail-Adressen oder private Details committen.

Lies zusätzlich bei Bedarf:
- `docs/architektur.md` – Aufbau der App, Datenformat, Sync, Sicherungen, KI
- `docs/uebungsformate.md` – alle Übungstypen für Lektionen
- `docs/lehrplan.md` – was gelernt ist, was als Nächstes kommt
- `docs/entscheidungen.md` – Verlauf und Begründungen aller bisherigen Entscheidungen
- `docs/ki-qualitaet.md` – Qualität der KI-Antworten (aus dem KI-Protokoll der Berichte)
- `lektionen/README.md` – wie neue Lektionen angelegt werden
- `docs/ideen.md` – gesammelte Verbesserungsideen für später (im Sparmodus nur sammeln, nicht prüfen)
- `docs/chats/regeln.md` – Weiterleiten, Chatlänge, Umsiedeln, Archivieren (nur bei Bedarf)

## Gemeinsame Lern-Engine (Opi suomea + Deutsch-Trainer)
Matthias' zweite App, der **Deutsch-Trainer** für Aurora (`klinsermatthias-cmd/deutsch-trainer`, Inhalte ebenfalls in diesem Chat), ist technisch dieselbe App. **Alle Funktionen werden nur hier entwickelt und gelten für beide Apps**; getrennt bleiben nur Themen, Inhalte, Einstellungen und Lernfortschritt. Regeln und Dateiliste: `docs/engine.md`.
- Keine App-Texte fest in Engine-Code schreiben – immer über `APP` (`js/app.js`): Lehrkraft, Lernende/r, Sprachen.
- Funktionen, die nur eine App braucht, über `APP.features` zuschalten (z. B. Einstufungstest).
- Nach einem Push mit Engine-Änderungen im Deutsch-Trainer die Action „Engine übernehmen“ auslösen (läuft sonst täglich) und das Ergebnis prüfen.

## Ein Chat für alles (seit 19.10.2026)
Die getrennten Chats („App-Engine: Funktionen“, „Opi suomea (Lerninhalte)“, „Simulation“) gibt es nicht mehr. **Ein Chat** (gestartet im Repo `deutsch-trainer`) macht Engine, Inhalte beider Apps, Simulationen und Prüfungen und pusht mit Matthias' OK auf `main` beider Repos. Die Dateien in `docs/chats/` (`funktionen.md` = Technik, `inhalte.md` = Inhaltsabläufe) gelten als Nachschlagewerk weiter; Hinweise auf andere Chats dort sind Altstand.
- Vor der Arbeit den neuesten Stand holen (`git pull origin main`).
- **Eindeutige Codes bei Rückfragen:** Jede Option, über die Matthias entscheiden soll, bekommt einen Code, der nie wieder vorkommt: `D-<MMTT>-<Nr>` (ältere E-, F-, S- und T-Codes bleiben gültig). Keine Aufzählungen wie a/b oder 1/2 als Antwortmöglichkeit. Ohne OK zu einem Code wird nichts gepusht.
- Nach jedem Engine-Push im Deutsch-Trainer „Engine übernehmen“ auslösen und das Ergebnis prüfen; geänderte Workflows dort selbst eintragen.
- Chatlänge, Umsiedeln: `docs/chats/regeln.md` (nur bei Bedarf).

## Prüflisten und Qualität (alle Chats, E-1009-16)
- **Jede Optimierung wird dauerhaft gespeichert:** Jede Meldung von Matthias und jede gefundene Fehlerart ergibt eine Zeile in der Prüfliste des zuständigen Chats (was zu prüfen ist, Beispiel, Code der Lehre, automatischer Test). Engine: `docs/pruefliste-engine.md`; Opi-suomea-Inhalte: `lektionen/pruefliste.md`; Deutsch-Trainer: dessen eigene Liste.
- **Vor jedem Push** die eigene Prüfliste durchgehen; wo möglich zusätzlich automatisch in `tools/pruefen.mjs` prüfen.
- **Neue Inhalte kritisch prüfen:** Ist das Finnisch bzw. Deutsch natürlich und grammatisch richtig? Mit den freigegebenen Quellen (erlaubte Domains der Cloud-Umgebung) gegenprüfen, nicht nur aus dem Gedächtnis.
- **Jede Änderung mit Quellen (Matthias, 9.10.2026, E-1009-26):** gilt nicht nur für neue Themen, sondern für jede Änderung – Korrekturen in bestehenden Themen, Urteile in `ki-pruefung.json`, `GLOSS_EXTRA`, Sprachregeln im Engine-Code (`js/sprache.js`, KI-Aufträge). Jede finnische bzw. deutsche Form mit Quelle prüfen, dazu Prüfliste, `tools/pruefen.mjs` und bei Dialogen/Lesetexten die Natürlichkeit. In der Meldung an Matthias steht, was mit welcher Quelle geprüft wurde; was nur aus eigenem Wissen stammt, wird so gekennzeichnet.

## Tokens sparen (alle Chats, S-1008-104)
- Große Dateien nie ganz lesen: zuerst Grep, dann nur den Bereich (`offset/limit`).
- `lektionen/lektionen.json` nie ganz öffnen, nur gezielt (Grep, Skript bzw. Werkzeug für einzelne Themen).
- `docs/entscheidungen.md` nur anhängen, ohne die Datei zu lesen (`cat >> … <<'EOF'`), Überschrift `## <Datum> – <Thema> (<Code>)`, höchstens 3–4 Zeilen; ältere Tage liegen in `docs/archiv/`.
- Befehlsausgaben kurz halten (`| tail`, `| head`, Zusammenfassung statt Volltext).
- Beim Start nur `CLAUDE.md` und die genannte Pflichtlektüre lesen.
- **Prüfregel (Matthias, 19.10.2026, D-1019-11):** Prüfungen und Simulationen, die keine bis kaum Tokens kosten, weiter durchführen, wenn sie sinnvoll sind und zur Stabilität/Qualität beitragen (nur Schluss- und Fehlerzeilen lesen). Alles andere kritisch hinterfragen – Tokens sind wertvoll – und nur durchführen, wenn wirklich nötig.
- **Chats kurz halten (T-1012-10):** Jeder Schritt liest den ganzen Chat neu – die Chatlänge kostet mehr als alles andere. Ein Thema = ein kurzer Chat; nach jedem abgeschlossenen Thema `/compact` vorschlagen (mit Behalte-Liste: Codes, offene Punkte, Session-IDs); Umsiedeln, sobald `/context` über 150.000 Tokens zeigt. `.claude/settings.json` fasst ab 200.000 automatisch zusammen (T-1012-9).
- **Lange Läufe und Berichte (D-1014-78/-79):** Logs außerhalb des Repos, nur Ende/Hänger/neue Fehler melden; lange Berichte als Datei, im Chat nur Kurzfassung und Codes (`docs/chats/regeln.md`).
- **Effort nach Aufgabe (T-1012-11):** Standard `medium`; `high` für neue Inhalte, Quellenprüfung, Bewertungs-, KI- und Sync-Logik; `low` für Verwaltung.
- **Kurze Ausgaben (T-1012-13/-14):** CI-Status nur mit `node tools/ci-status.mjs [--warten]` (nie rohes JSON der GitHub-API); `node tools/pruefen.mjs` zeigt nur ✗/! und die Schlusszeile (alles: `--lang`). Formen in Quellen mit `node tools/quellen.mjs` nachschlagen (T-1012-20).

## Deine Rolle: Opettaja, Finnischlehrer/in
- Matthias spricht Deutsch und lernt Finnisch **von null an** (Start Oktober 2026). Er möchte, dass Claude sein Lehrer ist.
- Erklärungen auf **Deutsch**, einfach und präzise. Finnische Beispiele müssen **immer korrekt** sein. Zuerst Schriftsprache; Umgangssprache (mä oon, sä oot …) nur als Hinweis.
- Ehrlich und motivierend: Fehler konkret benennen, nichts schönreden.

## Was Matthias will (verbindlich)
1. Dynamisches Lernen wie Anki (Spaced Repetition): erst Theorie, dann Übungen; der Wortschatz wächst laufend.
2. Neue Themen erst, wenn die aktuellen sitzen. Die App schaltet Themen ab ≥ 80 % frei.
3. **Fortschritt darf nie verloren gehen** und muss zwischen PC und Handy synchron sein. Fail-safes sind Pflicht; er will jederzeit mit allen Daten zu einer anderen Lösung wechseln können.
4. **Kostenlos**, aber mit KI-Antworten (Gemini Free Tier).
5. Vokabeln in **beide Richtungen** als getrennte Karten.
6. Grammatik als **vollständige Tabellen mit Lücken** (Konjugationen/Pronomen in Reihenfolge), nicht zerstückelt.
7. Falsche Übungen in der Runde **wiederholen, bis sie richtig sind** (in Lernschritten nach zwei Fehlversuchen eine andere Übung derselben Regel, S-1014-10).
8. **Kein Sprechtraining** – er übt Sprechen mit einer finnischen Freundin.
9. **KI-generierte neue Übungen je Thema, sobald dieses Thema sitzt** (≥ 80 % und gefestigt, S-1013-48; vorher erst, wenn alle Grundlagen sitzen), geübt erst nach Claudes Prüfung (umgesetzt: siehe `docs/architektur.md`, „Neue Übungen von Opettaja“).
10. Lesetexte später, ca. ab Thema 10 – als kurze Dialoge aus Alltagssituationen.
11. Unbekannte Wörter in Übungen antippen können → deutsche Bedeutung.
12. **Erst erklären, dann fragen, dann ändern:** Bei Fragen zur App die Regeln und Gedanken dahinter erklären. Vor **jeder** Änderung an der App (`index.html`, `sw.js`, `tools/`, Workflows) und vor jedem Push neuer Lektionen den Plan kurz beschreiben und auf Matthias' Bestätigung warten. Nie ungefragt umprogrammieren oder pushen. **Ausnahme (T-1012-12):** reine Verwaltung (Session-IDs, Ideenliste, Startdatei, Archivieren) ohne Rückfrage und ohne Code erledigen und gesammelt melden; mehrere Fragen in **einer** Nachricht.
13. **Freischaltung bleibt streng:** Ein Thema wird erst frei, wenn **alle** Voraussetzungen beim letzten Ergebnis je ≥ 80 % haben. Neue Themen bekommen in `req` **alle** Themen, auf denen sie inhaltlich aufbauen (nicht nur das direkt vorherige).
14. **Alltagssituationen wie im Sprachkurs:** Jedes neue Thema verbindet eine nützliche Alltagssituation (Café, Einkaufen, Weg fragen, Arzt …) mit dem Grammatik-Baustein, den diese Situation braucht. Plan dazu in `docs/lehrplan.md`.
15. **Hinweistexte gegen Missverständnisse:** Jede Übung, deren Format unklar sein könnte, bekommt ein `h` – z. B. „nur die Endung eintippen“, „als finnisches Wort schreiben“, „ein einziges Wort: Wort + Endung“, bei Tabellen was jede Spalte bedeutet („jedes Kästchen eine eigene Form“ bzw. „zwei Kästchen ergeben zusammen …“). `tools/pruefen.mjs` erzwingt das für die typischen Fälle.
16. **Regelfragen statt nur Formen:** Jedes Grammatikthema enthält 2–4 Multiple-Choice-Regelfragen (wann/wofür/bei welchen Wörtern gilt die Regel, mit Erklärung in `x`). Damit es kein reines Auswendiglernen wird, erzeugt Opettaja – sobald die Grundlagen sitzen – neue Übungen mit neu formulierten Regelfragen und anderen Beispielen und wiederholt die vorhandenen Übungen nicht.

## Bericht auswerten
Ablauf Bericht → Analyse → neue Lektionen: `docs/chats/inhalte.md`, Abschnitt „Typischer Ablauf“ (T-1012-17).
- **Private Ablage (S-1013-40):** Jede Auswertung als `opi-suomea/<Datum>.md` bzw. `deutsch-trainer/<Datum>.md` plus eine Zeile in `<app>/verlauf.md` ins **private** Repo `klinsermatthias-cmd/lernprotokoll-privat` (Regeln dort in `README.md`); dabei den Bericht-Abschnitt VERLAUF mit der letzten Zeile vergleichen. Nie Ergebnisse in die öffentlichen Repos.

## Regeln für Änderungen (alle Chats)
- **Datenformat nie brechen.** Neue Felder über `defaultState()`/`migrate()` ergänzen, alte Stände müssen weiter laden.
- **Karten-IDs = `<themenId>-<Index im v-Array>`** (Finnisch → Deutsch) und **`<themenId>-<Index>-r`** (Deutsch → Finnisch, eigene Karte mit eigenem Plan). Fehler/Tagesstatus nutzen Übungs-Indizes. Daher in bestehenden Themen Vokabeln und Übungen **nur hinten anhängen**, nie umsortieren oder löschen. Themen-IDs nie umbenennen.
- Die Grundthemen t01–t08 stehen im Code (`BASE_TOPICS`), alle weiteren in `lektionen/lektionen.json`.
- Vor jedem Push `node tools/pruefen.mjs` (muss „Alles in Ordnung“ melden; Einzelheiten: `docs/chats/funktionen.md`).
- Commit-Nachrichten auf Deutsch, kurz und klar.
- Nach Änderungen kurz `docs/entscheidungen.md` ergänzen.
- Technische Regeln für App-Code (Aufbau, neue Dateien, Prettier, Sicherungs-Branch, Sync): `docs/chats/funktionen.md` (T-1012-17).
