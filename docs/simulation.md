# Übergabe an den Simulations-Chat

Stand: 8.10.2026, geschrieben vom Chat „App-Engine: Funktionen“. Diese Datei ist der Einstieg für einen eigenen Chat, der
**nur Simulationen** der Lern-Engine fährt (läuft unter Matthias' zweitem Konto, damit die Simulationen nicht das
Nutzungslimit der anderen Chats verbrauchen).

> **Das Repository ist öffentlich.** Niemals Fortschrittsberichte, Schlüssel (Gemini, Supabase), E-Mail-Adressen oder
> private Details committen. Die Simulation braucht keine echten Schlüssel – Gemini, Claude und Supabase sind nachgebaut.

## 1. Die App in Kürze
- **Zwei Apps, eine Engine:** *Opi suomea* (Finnisch für Matthias, dieses Repo) und der *Deutsch-Trainer* (Deutsch für
  Aurora, `klinsermatthias-cmd/deutsch-trainer`, ebenfalls öffentlich). Alle Funktionen entstehen hier; der Deutsch-Trainer
  übernimmt sie über die Action „Engine übernehmen“. Getrennt sind nur Inhalte, Einstellungen (`js/app.js`) und Fortschritt.
- **Aufbau:** reine Web-App ohne Build-Schritt, GitHub Pages. `index.html` + `app.css` + Skripte in `js/` (Reihenfolge in
  `index.html`, Übersicht in `docs/architektur.md`). Zustand `S` im Browser-Speicher, Abgleich zwischen Geräten über
  Supabase (`pushCloud`/`pullCloud`/`mergeStates`), KI über Gemini (Free Tier).
- **Lernlogik (was Matthias verbindlich will, Details in `CLAUDE.md`):**
  - Erst Theorie, dann die Wörter eines Themas (beide Richtungen als getrennte Karten), dann Übungen.
  - Themen und Karten nach Spaced Repetition (wie Anki). Falsche Übungen kommen in derselben Runde wieder, bis sie sitzen.
  - **Freischaltung streng:** Ein Thema wird frei, wenn alle Voraussetzungen (`req`) beim letzten Ergebnis je ≥ 80 % haben.
  - 52 Themen in Opi suomea: Grundthemen t01–t08 im Code, der Rest in `lektionen/lektionen.json`, darunter Unterthemen
    (`tNN` + Buchstabe, z. B. t05b). Der Deutsch-Trainer hat noch keine Lektionen, nur den Einstufungstest (148 Aufgaben).
  - KI („Opettaja“ bzw. „Coach“) prüft freie Antworten, wertet Runden aus, macht eine Gesamtanalyse und schreibt später
    neue Übungen (erst wenn die Grundlagen sitzen und erst nach Claudes Prüfung).
  - **Fortschritt darf nie verloren gehen:** Sicherheitskopien, Tagesstände in der Cloud, Sicherungsdatei, Notfall-Version.
- **Wichtige Neuerungen seit der letzten Simulation (E-1007-84, 180 Tage):** Details je Code in `docs/entscheidungen.md`.
  - Unterthemen (E-1007-86).
  - Gesamtprüfung 8.10. (`docs/gesamtpruefung.md`):
    - gesperrte Themen sind nicht lernbar (E-1008-1);
    - bei KI-Ausfall entscheidet der Lernende selbst mit „Richtig“/„Falsch“ (E-1008-2);
    - strenge Endungs-Lücken (E-1008-3);
    - „Heute“ bietet die Freischalt-Runde an (E-1008-4);
    - schwache Voraussetzung höchstens 7 Tage Abstand (E-1008-5);
    - mehrere richtige Wortstellungen (E-1008-6);
    - Lektionen getrennt vom Lernstand (E-1008-7);
    - Deutsch: Groß-/Kleinschreibung zählt (E-1008-9);
    - Wörter neuer Themen erst nach dem Themen-Wortlernen (E-1008-10);
    - Pakete aus fremden Quellen werden geprüft (E-1008-12);
    - Gesamtanalyse seltener (E-1008-13).
  - **Schwächen ziehen Themen vor (E-1008-22):** Die KI nennt ein Thema seit dessen letzter Runde ≥ 2× (14 Tage). Dann ist es
    spätestens übermorgen fällig, mit höchstens 3 Themen zugleich. Abschaltbar in den Einstellungen.

## 2. Das Simulationswerkzeug
- `tools/simulation.mjs` simuliert viele Tage Lernen auf **zwei Geräten** (PC täglich, Handy jeden 5. Tag) mit verschobener
  Uhr, echten Inhalten, nachgebautem Gemini, Claude und Supabase. Es bedient die App **über die Knöpfe** wie ein Mensch.
  Aufruf: `DAYS=180 node tools/simulation.mjs`. Optionen und eingebaute Schwächen/Störungen (W1–W9) stehen im Kopf der Datei.
  `APP_ROOT=../deutsch-trainer` simuliert den Deutsch-Trainer mit dieser Fassung der Engine.
- **Abdeckungs-Kontrolle:** Am Ende muss jede Aktion (jeder Knopf in `const A`, `js/start.js`), jede Ansicht (`render…`), jede
  Übungsart, jede KI-Art und jede Einstellung vorgekommen sein, sonst meldet die Simulation ein Problem. Ausnahmen nur mit
  Begründung in `EXEMPT`. Seit dem letzten Lauf neu und in der Simulation noch nicht vorhanden:
  - die Knöpfe `selfok`/`selfno` (KI-Ausfall, E-1008-2);
  - der Knopf `toggleweak` (E-1008-22).

  `unlock` und `prevocab` kommen schon vor. Ihr neues Verhalten (E-1008-1/-4/-10) muss die Simulation aber noch prüfen.
- **Regel (Matthias):** Vor jeder Simulation kritisch prüfen, ob wirklich alle Funktionen abgedeckt sind (auch neue) – und die
  Simulation sonst zuerst erweitern. Sie soll bis ins kleinste Detail gehen.
- **Offene Erweiterungen (E-1008-19, aus `docs/gesamtpruefung/G-stabilitaet.md`), vor dem großen Lauf E-1007-88:**
  1. Themen-Abdeckung: wie viele der 52 Themen (inkl. Unterthemen) erreicht und gelernt wurden.
  2. Szenarien:
     - drei Freischaltversuche unter 80 % → „Wörter vorab lernen“;
     - KI-Ausfall mitten in einer Freischalt-Runde;
     - Voraussetzung bei 75 % mit langem Abstand (höchstens 7 Tage);
     - **neu:** Schwächen-Vorzug (W3 ordnet Fehler einem Thema zu → das Thema muss spätestens übermorgen fällig werden und
       nach der nächsten Runde wieder normal laufen, auf beiden Geräten gleich).
  3. Größe des Lernstands je Tag protokollieren (JSON-Länge, belegter Browser-Speicher).
  4. Deutsch-Trainer-Lauf, sobald er Lektionen hat (bis dahin nur Einstufungstest).
- `node tools/pruefen.mjs` ist die schnelle Prüfung (muss „Alles in Ordnung“ melden). Die Simulation ersetzt sie nicht.

## 3. Arbeitsregeln für den Simulations-Chat
- **Erst erklären, dann fragen, dann ändern.** Jede Option, über die Matthias entscheidet, bekommt einen eindeutigen Code
  **`S-<MMTT>-<Nr>`** (S = Simulations-Chat, z. B. S-1009-1). Nie a/b oder 1/2. **Ohne ausdrückliches OK zu einem Code
  wird nichts gepusht.** Simulationen nur auf Matthias' Wunsch.
- **Darf ändern:** nur `tools/simulation.mjs` und Ergebnisberichte unter `docs/simulationen/` (eine Datei je Lauf,
  z. B. `2026-10-09-180-tage.md`).
- **Darf nicht:** App-Code, Inhalte, andere Docs, Workflows. **Nie auf `main` pushen**, nur auf einen Branch
  `simulation/<datum>`. Der Chat „App-Engine: Funktionen“ prüft den Branch und übernimmt ihn nach Matthias' OK auf `main`.
- **Fehler in der App** nicht selbst beheben. Jeder Befund kommt in den Ergebnisbericht und bekommt einen Vorschlag mit Code
  `S-…`. Matthias gibt ihn an den Engine-Chat weiter. Die Chats liegen in verschiedenen Konten, `send_message` geht nicht.
- **Ergebnisbericht** je Befund wie in der Gesamtprüfung: Schwere, Wo (Datei:Zeile), Ablauf/Beleg (Simulationstag,
  Gerät), Folge, Vorschlag, Aufwand, betroffene Apps. Dazu: Laufzeit, Abdeckung (Aktionen/Ansichten/Themen), Datenverlust
  ja/nein, Auffälligkeiten im Lernverlauf (Freischaltung, Abstände, Rückstand, KI-Aufrufe je Tag).
- Antworten an Matthias auf Deutsch, kurz. Commits auf Deutsch.
- **Sparsam mit dem Limit:**
  - Lange Läufe im Hintergrund starten, Ausgabe in eine Datei.
  - Nur Zusammenfassung und Probleme lesen, nicht das ganze Tagesprotokoll.
  - Keine parallelen Hilfs-Agenten mit hohem Effort. Bei der Gesamtprüfung war das Limit so nach 15 Minuten erschöpft.
  - Effort „xhigh“.
- Vor größeren Umbauten an `tools/simulation.mjs` einen Sicherungs-Branch `sicherung/simulation-<name>` pushen.
- **Chat-Länge** einmal am Tag prüfen. Ist der Chat sehr lang, zuerst `/compact` vorschlagen, dahinter angeben, was erhalten
  bleibt (Codes, offene Punkte).

## 4. Umgebung
- Node.js und Playwright mit Chromium. In den Cloud-Umgebungen von Claude Code ist beides vorinstalliert; nicht
  `playwright install` ausführen. Die Skripte finden Playwright im Repo oder global (`npm root -g`).
- Für Läufe mit dem Deutsch-Trainer dessen Repo daneben klonen: `git clone https://github.com/klinsermatthias-cmd/deutsch-trainer ../deutsch-trainer`.
- Weiterlesen bei Bedarf:
  - `CLAUDE.md` (Regeln);
  - `docs/architektur.md` (Datenformat, Sync, KI);
  - `docs/engine.md` (Engine-Regeln, Simulation);
  - `docs/gesamtpruefung.md` (letzte Prüfung, Befunde A–H);
  - `docs/entscheidungen.md` (letzte Einträge).
