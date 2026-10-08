# Ideensammlung (für später)

Matthias' Verbesserungsideen. Solange der **Sparmodus** gilt (Usage-Tokens sparen), werden Ideen hier nur kurz gesammelt –
ohne Code zu lesen und ohne Machbarkeitsprüfung. Erst wenn Matthias den Sparmodus beendet, wird geprüft und (nach seiner Bestätigung) umgesetzt.

Format: `- [ ] Datum – Idee (kurz) · Notiz`

## Offen
- [ ] 2026-10 – KI-Anbieter: Mischbetrieb Gemini + Claude-API prüfen (siehe Erinnerungen in `docs/lehrplan.md`)
- [ ] 2026-10 – Kleinstes Gemini-Modell für einfache Aufgaben nur, falls Limits erreicht werden
- [ ] 2026-10 – **E-1007-8 Gezielte Wiederholung schwacher Grammatikthemen** (wartet): Thema mit ≥ 2 Treffern in `S.weak` (14 Tage) spätestens übermorgen fällig, Karte auf „Heute“ mit kurzer Runde dieses Themas, KI-Übungen gezielt dazu; Karte verschwindet nach einer Runde ≥ 80 %. Erst umsetzen, wenn die Inhalts-Chats nach einigen Berichten bestätigt haben, dass die KI-Zuordnung (E-1007-6) zuverlässig ist – dann Empfehlung an Matthias.

## Erledigt
- [x] 2026-10 – Wörter antippen: Endungen -na/-nä (maanantaina) und Teilungsform (teetä, euroa) lokal erkennen statt über KI
- [x] 2026-10 – Vokabeln: „Frag Opettaja“ auf der Vokabelkarte (nach dem Aufdecken)
- [x] 2026-10 – Vokabeln: eigene Eingabe nach dem Aufdecken sichtbar, Abweichungen markiert

## Vorgemerkt für die nächste große Prüfung (Matthias, 7.10.2026)
- **Erinnern:** Matthias will vor der nächsten großen Prüfung den Effort erhöhen (Empfehlung: „max“ für die Gesamtprüfung, danach dauerhaft „xhigh“) und dann einen kompletten Check starten: App, Code, Funktionen, Stabilität, Datensicherheit, Bedienung.
- **Immer vorschlagen:** Claude schlägt von sich aus vor, wann eine vollständige Simulation oder eine vollständige App-/Code-Prüfung sinnvoll ist (z. B. nach größeren Paketen, vor riskanten Umbauten, wenn eine neue App/Sprache dazukommt).
- **Architektur überdenken:** In der nächsten großen Prüfung die gesamte Architektur bewerten – vor allem die gemeinsame Engine für die zwei bestehenden, getrennten Apps (Opi suomea = Finnisch-Trainer, Deutsch-Trainer): Ist die Trennung Engine ↔ App-Dateien, „Engine übernehmen“, `APP`-Einstellungen, Sprachregeln (`SP`) und Datenhaltung je App gut so, oder sollte etwas verbessert werden (z. B. eine App-Vorlage für neue Sprachen, gemeinsame Tests je App, getrennte Clouds)?

## Übergabe an einen neuen Chat „App-Engine: Funktionen“ (7.10.2026, abends)
Der bisherige Engine-Chat wurde zu lang (Token-Verbrauch). Alles Wichtige steht in den Docs; hier der Stand zum Weitermachen.

**Zuerst lesen:** `CLAUDE.md`, dieser Abschnitt, `docs/engine.md` (inkl. Simulation), `docs/architektur.md` (inkl. „Token-Verbrauch: Einsparpotenzial“), die letzten Einträge in `docs/entscheidungen.md`.

**Arbeitsregeln (von Matthias, verbindlich):**
- Erst erklären, dann fragen, dann ändern. Jede Entscheidungsoption bekommt einen eindeutigen Code `E-<MMTT>-<Nr>` (nie a/b, 1/2). **Gepusht wird nur nach ausdrücklichem OK zu einem Code.** Letzter vergebener Code: **E-1008-20** (8.10.) – am 8.10. mit **E-1008-21** weitermachen, an späteren Tagen mit `E-<MMTT>-1`.
- Den Stop-Hook „bitte pushen“ ignorieren, solange kein OK vorliegt.
- Claude Code läuft im Modus „Accept edits“: Ein Push auf `main` erzeugt eine Freigabe-Abfrage, die Matthias bestätigt. Niemals selbst Erlaubnisse in Einstellungen eintragen (wird als Umgehung blockiert).
- Nach jedem Engine-Push im Deutsch-Trainer die Action „Engine übernehmen“ auslösen (`engine-uebernehmen.yml`, ref `main`) und beide Prüfläufe („Prüfen und veröffentlichen“) beobachten.
- Antworten an Matthias auf Deutsch, kurz und verständlich; Commits auf Deutsch mit den üblichen Attributionszeilen.
- Vor jeder Simulation kritisch prüfen, ob sie wirklich alle Funktionen abdeckt (auch neue) – siehe `docs/engine.md`. **Simulationen nur auf Matthias' Wunsch** (die Inhalts-Chats schlagen keine mehr vor).
- Hoher Effort: „max“ für die Gesamtprüfung, sonst dauerhaft „xhigh“. Lange Befehlsausgaben vermeiden; große Lese-/Prüfaufgaben an Hilfs-Agenten geben.

**Andere Chats (für `send_message`):** „Opi suomea (Lerninhalte)“ = `session_01JzrEfnqnC1AnKhF6FkbjyW` (Codes F-…; seit 7.10. abends, vorher `session_01MjWzFCPLaipFDwvNEToR8s`, Übergabe in `docs/lehrplan.md`), „Deutsch-Trainer (Lehrinhalte)“ = `session_01XDLQ2V6tk1eM7bLtG3XZRH` (Codes D-…). Der alte Engine-Chat war `session_01ST3ZLaUHzcNaHGuTf6pK5v`.

**Stand (alles live, Prüfläufe grün):** Pakete A–E (E-1007-50 bis -77), E-1007-78 (Übungsprotokoll nachgetragen), E-1007-82 (Hochladen gleich nach Rundenende – Abgleich-Verlust behoben), E-1007-83 (Simulation mit Knopf-Bedienung + Abdeckungs-Kontrolle, `APP_ROOT` für den Deutsch-Trainer), E-1007-84 (180-Tage-Läufe: kein Datenverlust, 99/109 Aktionen; Rest = Einstufungstest nur DT + „Jetzt neu laden“), E-1007-86 (Unterthemen tNN+Buchstabe direkt unter dem Hauptthema, Nummer „1.2“). Gefunden und behoben: Knopf „Langzeit-Check“ rief die Antwortprüfung auf (doppelte Aktion `check`), „Sicherung einspielen“ hatte keinen Knopf; `pruefen.mjs` prüft jetzt Aktion ↔ Knopf in beide Richtungen.
Sicherungs-Branches: `sicherung/vor-bedienung` (Stand vor Paket A–E), `sicherung/zwischenstand-simulation` (Arbeitsstand, inzwischen vollständig in `main`).

**Offen / als Nächstes:**
1. ~~Gesamtprüfung~~ erledigt am 7./8.10.2026: Ergebnis in `docs/gesamtpruefung.md` (Befunde je Bereich in `docs/gesamtpruefung/`). Paket **E-1008-20**, **E-1008-21** (Schrift im Prüfskript), **E-1008-5** und **E-1008-13** umgesetzt. Auch **E-1008-7** (Lektionen getrennt vom Lernstand, Sicherungs-Branch `sicherung/vor-e1008-7`) und **E-1008-9** (Deutsch: Test-App, Groß-/Kleinschreibung) umgesetzt. **Noch offen (je mit eigenem Code entscheiden):** E-1008-17 (Cloud-Tabellen mit App-Kennung, nur bei geteilten Konten), E-1008-18 (CSP), E-1008-19 (Simulation erweitern, vor E-1007-88). Lehre aus der Prüfung: keine parallelen Hilfs-Prüfer mit hohem Effort – das Nutzungslimit war nach 15 Minuten erschöpft; besser allein und nacheinander, mit Sicherung je Bereich.
2. **E-1007-88 (später, nur auf Wunsch):** Simulation mit allen Unterthemen (seit 7.10. kamen viele dazu: t01b…t19c, insgesamt 52 Themen; Freischalt-Regel der Unterthemen siehe Übergabe in `docs/lehrplan.md`). Die Simulation in der letzten Fassung hat einen kleinen Fix (Sicherungsdatei ausschalten braucht zwei Tipps) ohne neuen Lauf.
3. **E-1007-8** (oben unter „Offen“): Empfehlung erst nach einigen Berichten mit geprüfter Schwächen-Zuordnung.
4. Hinweis an den Inhalts-Chat (optional): Unterthemen-Titel enthalten „(1.2)“ zusätzlich zur Nummer davor – kann entfallen.
5. Token: Gesamtanalyse lief in der Simulation ~110× in 180 Tagen – Kandidat zum Sparen (siehe Einsparpotenzial Nr. 14).
