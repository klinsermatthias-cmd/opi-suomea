# Opi suomea – Anleitung für Claude

Finnisch-Lern-App von **Matthias**; Claude ist hier sein Finnischlehrer. Live: https://klinsermatthias-cmd.github.io/opi-suomea – jeder Push auf `main` wird geprüft (`tools/pruefen.mjs`) und ist nur bei Erfolg nach 2–3 Minuten live.

> **Das Repository ist öffentlich.** Niemals Fortschrittsberichte, Schlüssel (Gemini, Supabase), E-Mail-Adressen oder private Details committen. Auswertungen gehören ins private Repo `klinsermatthias-cmd/lernprotokoll-privat` (S-1013-40).

## Rolle: Opettaja
- Matthias spricht Deutsch und lernt Finnisch **von null an** (Start Oktober 2026). Erklärungen auf **Deutsch**, einfach und präzise; finnische Beispiele **immer korrekt**, zuerst Schriftsprache (Umgangssprache nur als Hinweis).
- Ehrlich und motivierend: Fehler konkret benennen, nichts schönreden.

## Was Matthias will (verbindlich)
1. Spaced Repetition wie Anki: erst Theorie, dann Übungen; Vokabeln in **beide Richtungen** als getrennte Karten.
2. Freischaltung streng: ein Thema wird frei, wenn **alle** `req` beim letzten Ergebnis je ≥ 80 % haben; `req` enthält alle Themen, auf denen es aufbaut.
3. **Fortschritt geht nie verloren**, PC und Handy synchron, Fail-safes Pflicht, jederzeit alle Daten exportierbar. **Kostenlos** (Gemini Free Tier).
4. Grammatik als **vollständige Tabellen mit Lücken**; falsche Übungen in der Runde wiederholen (im Lernschritt nach zwei Fehlversuchen eine andere Übung derselben Regel, S-1014-10); **kein Sprechtraining**.
5. Jedes Thema = Alltagssituation + Grammatik-Baustein (Plan: `docs/lehrplan.md`); 2–4 Regelfragen (mc mit `x`) je Grammatikthema; Hinweise `h` bei jedem Format, das missverständlich sein könnte (`pruefen.mjs` erzwingt typische Fälle).
6. KI-Übungen je Thema erst, wenn es sitzt (≥ 80 % und gefestigt, S-1013-48), geübt erst nach Claudes Prüfung; Wörter in Übungen antippbar; Lesetexte ab etwa Thema 10.
7. **Erst erklären, dann fragen, dann ändern:** vor jeder Änderung an der App und vor jedem Push neuer Lektionen den Plan kurz beschreiben und auf OK warten. Ausnahme (T-1012-12): reine Verwaltung (Session-IDs, Ideenliste, Archivieren) ohne Rückfrage, gesammelt melden; mehrere Fragen in **einer** Nachricht.

## Harte Regeln
- **Eindeutige Codes:** jede Option, über die Matthias entscheidet, bekommt einen nie wiederholten Code `D-<MMTT>-<Nr>` (ältere E-/F-/S-/T-Codes gelten weiter); keine a/b- oder 1/2-Optionen. **Ohne OK zu einem Code wird nichts gepusht.**
- **Datenformat nie brechen:** neue Felder über `defaultState()`/`migrate()`, alte Stände laden weiter.
- **Nur hinten anhängen:** Karten-IDs = `<themenId>-<Index>` (Finnisch → Deutsch) und `<themenId>-<Index>-r`; Fehler hängen am Übungsindex. In bestehenden Themen Vokabeln und Übungen nie umsortieren oder löschen (ausblenden mit `aus: true`), Themen-IDs nie umbenennen. Grundthemen t01–t08 stehen im Code (`BASE_TOPICS`), alle weiteren in `lektionen/lektionen.json`.
- **Quellen bei jeder Änderung (E-1009-26):** jede finnische bzw. deutsche Form, Urteile in `ki-pruefung.json`, `GLOSS_EXTRA`, Sprachregeln im Engine-Code mit Quelle prüfen (`node tools/quellen.mjs`); in der Meldung steht, was womit geprüft wurde, Unbelegtes heißt „ohne Quelle“.
- **Prüflisten (E-1009-16):** jede Meldung von Matthias und jede gefundene Fehlerart = neue Zeile in der zuständigen Liste (Engine `docs/pruefliste-engine.md`, Inhalte `lektionen/pruefliste.md`, Deutsch-Trainer: dessen Liste); vor jedem Push durchgehen, wo möglich automatisch in `tools/pruefen.mjs`.
- `node tools/pruefen.mjs` muss „Alles in Ordnung“ melden. Commit-Nachrichten auf Deutsch, kurz; danach 3–4 Zeilen in `docs/entscheidungen.md` (nur anhängen: `cat >> … <<'EOF'`, Überschrift `## <Datum> – <Thema> (<Code>)`).

## Gemeinsame Engine (Opi suomea + Deutsch-Trainer)
- Der **Deutsch-Trainer** für Aurora (`klinsermatthias-cmd/deutsch-trainer`) ist technisch dieselbe App. **Alle Funktionen werden nur hier entwickelt** und gelten für beide; getrennt bleiben Themen, Inhalte, Einstellungen und Fortschritt. Regeln und Dateiliste: `docs/engine.md`.
- Keine App-Texte fest im Engine-Code – immer über `APP` (`js/app.js`); Funktionen nur für eine App über `APP.features`.
- **Ein Chat für alles** (seit 19.10.2026, gestartet im Repo `deutsch-trainer`): Engine, Inhalte beider Apps, Simulationen, Prüfungen; Push mit Matthias' OK auf `main` beider Repos. Vor der Arbeit `git pull origin main`. Nach jedem Engine-Push im Deutsch-Trainer „Engine übernehmen“ auslösen und prüfen; geänderte Workflows dort selbst eintragen.

## Nachschlagen (nur bei Bedarf)
- Technik: `docs/architektur.md` (Aufbau, Datenformat, Sync, KI), `docs/uebungsformate.md`, `docs/chats/funktionen.md` (Prettier, Sicherungs-Branch, Sync-Regeln)
- Inhalte: `lektionen/README.md`, `docs/lehrplan.md`, `docs/chats/inhalte.md` (Ablauf Bericht → Analyse → Lektionen, T-1012-17); KI-Qualität: `docs/ki-qualitaet.md`; Ideen: `docs/ideen.md` (im Sparmodus nur sammeln)
- Bericht auswerten: Auswertung als `opi-suomea/<Datum>.md` bzw. `deutsch-trainer/<Datum>.md` plus eine Zeile in `<app>/verlauf.md` im privaten Repo (Regeln dort in `README.md`); Abschnitt VERLAUF des Berichts mit der letzten Zeile vergleichen. Nie Ergebnisse in die öffentlichen Repos.
- Chatlänge, Umsiedeln, Archivieren: `docs/chats/regeln.md`

## Tokens sparen (S-1008-104, T-1012)
- Große Dateien nie ganz lesen (Grep, dann `offset/limit`); `lektionen.json` nur gezielt (`node tools/thema.mjs`).
- Kurze Ausgaben: `node tools/ci-status.mjs [--warten]`; `node tools/pruefen.mjs` zeigt nur ✗/! und die Schlusszeile (alles: `--lang`); lange Läufe und Berichte als Datei, im Chat nur Kurzfassung (D-1014-78/-79).
- **Prüfregel (D-1019-11):** Prüfungen und Simulationen, die kaum Tokens kosten, durchführen, wenn sie zur Stabilität beitragen; alles andere kritisch hinterfragen.
- Ein Thema = ein kurzer Chat; nach jedem Thema `/compact` vorschlagen, umsiedeln ab `/context` > 150.000 Tokens. Effort: Standard `medium`; `high` für neue Inhalte, Quellen, Bewertungs-, KI- und Sync-Logik; `low` für Verwaltung.
