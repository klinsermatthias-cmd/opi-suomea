# Übergabe: Simulations-Chat (Kontrolle) – Stand 8.10.2026

Der bisherige Chat (`session_01RYkJUoDVaUeXgWBwdBZ9fp`) wurde zu lang. Hier steht alles zum Weitermachen.

**Zuerst lesen:**
1. `CLAUDE.md` (Regeln aller Chats)
2. `docs/chats/simulation.md` (Startdatei: Regeln und Werkzeug des Simulations-Chats)
3. diese Datei

> **Das Repository ist öffentlich.** Keine Schlüssel, E-Mail-Adressen, Fortschrittsberichte oder privaten Details committen.

## 1. Rolle (verbindlich, Matthias 8.10.2026)
- **Wörtlich von Matthias:** „Was du auf keinen Fall tun darfst, ist Änderungen an der App, an den Lehrinhalten vorzunehmen. Du darfst zwar deine Vorschläge, Verbesserungen in ein neues File schreiben, aber du selbst darfst nie Änderungen vornehmen. Dafür verwende ich immer den Engine Chat. Du bist nur zur Kontrolle da, zur Prüfung der App, der Inhalte, des Codes, der Simulation. Du bist aber nie zum Programmieren und zum Verwalten von Inhalten da.“
- **Darf schreiben:**
  - `tools/simulation.mjs`
  - Berichte und Vorschläge in `docs/simulationen/`, nur auf Branches `simulation/…`
  - Prüfberichte in `docs/pruefungen/`, nur auf Branches `pruefung/…` (seit S-1008-23)
- **Nie** auf `main` pushen.
- **Codes:** Jede Option bekommt einen Code `S-<MMTT>-<Nr>`. Ohne ausdrückliches OK zu einem Code wird nichts gepusht.
- **Erst erklären, dann fragen, dann ändern.** Antworten auf Deutsch und kurz, Commits auf Deutsch.
- **Befunde in App oder Inhalten** nie selbst beheben: Bericht mit Ort, Schwere, Vorschlag und Code. Umsetzen tun:
  - „App-Engine: Funktionen“ (Code und Engine)
  - „Opi suomea (Lerninhalte)“ (`lektionen/`, `js/inhalte.js`)

## 2. Erledigt
1. **Simulation 180 Tage (S-1008-12)**
   - `tools/simulation.mjs` erweitert (S-1008-1 bis -8):
     - Ausfall-Ansicht und `toggleweak`
     - Szenarien: Freischaltung, 75 %, KI-Ausfall in der Freischalt-Runde, Schwächen-Vorzug
     - Einzelregeln, Themen-Abdeckung, Speichergröße
     - Großschreibung im Deutsch-Trainer
   - Bericht: `docs/archiv/simulationen/2026-10-08-180-tage.md`. Kein Datenverlust, alle Szenarien bestanden.
   - Auf `main` übernommen (660187d).
   - Umgang mit den Befunden:
     - S-1008-15 und -16 sind umgesetzt (56be18c, dazu E-1008-28).
     - S-1008-14 wurde bewusst nicht umgesetzt.
     - S-1008-13 (IndexedDB) ist für später vorgemerkt (`docs/entscheidungen.md`).
2. **Prüfung aller finnischen Lehrinhalte (Auftrag S-1008-17, -19, -22, -23)**
   - Bericht: `docs/pruefungen/2026-10-08-lehrinhalte.md` auf Branch `pruefung/2026-10-08` (5e94a15). Er ist nicht auf `main`.
   - Ergebnis: 0 kritisch, 15 mittel, 34 niedrig. Codes S-1008-24 bis -72.
   - Dazu S-1008-73: Vorschlag an den Funktionen-Chat (siehe Abschnitt 7).
   - Der Inhalts-Chat hat umgesetzt: `main` 51acce0, „Prüfung der Lehrinhalte umgesetzt (S-1008-24 bis -72, F-1008-3, F-1008-4)“.
     - **F-1008-3:** keine doppelten Wortkarten. Ein Wort, das früher gebraucht wird, als seine Karte kommt, steht im früheren Thema nur in der Theorie.
     - **F-1008-4:** In `js/inhalte.js` wurde bestehender Text korrigiert.
     - **Nicht umgesetzt:** S-1008-32/-33 (Wörter stehen in Theorie-Tabellen), S-1008-45 (keine Änderung nötig), S-1008-73 (gehört dem Funktionen-Chat).
3. **Übergabe-Texte:**
   - S-1008-74 an den Inhalts-Chat: erledigt und umgesetzt.
   - S-1008-76 an den Funktionen-Chat zu S-1008-73: Text in Abschnitt 7. Ob Matthias ihn weitergegeben hat, ist offen.
4. **Wecker** `trig_012fR4V8uzEQjMHr6BeQyGQK` (alle 2 h, an den alten Chat gebunden): abgeschaltet und nicht mehr nötig.

## 3. Offene Punkte (nur auf Matthias' Wunsch, jeweils mit neuem Code)
- **Nachprüfung von 51acce0:**
  - Ist jeder Code S-1008-24 bis -72 richtig und vollständig umgesetzt?
  - Ist das Finnisch der neuen Stellen korrekt?
  - Gilt die Nur-anhängen-Regel?
  - Läuft `node tools/pruefen.mjs`?
  - Achtung: Nach F-1008-3 meldet `wortlisten-abgleich.js` absichtlich weiter Wörter, die nur in der Theorie stehen (z. B. t07b *juo*, t14c *kylmää*, *täytyy*). Diese gegen die Theorie des Themas abgleichen.
- **S-1008-73 / S-1008-76:** Matthias fragen, ob der Funktionen-Chat den Vorschlag bekommen oder umgesetzt hat.
- **Branch `pruefung/2026-10-08`:** Ob der Prüfbericht auf `main` kommt (über den Funktionen-Chat), entscheidet Matthias.
- **Simulation:**
  - Vor jedem Lauf prüfen, ob alle Funktionen abgedeckt sind, auch neue seit 56be18c/51acce0.
  - Einen Deutsch-Trainer-Lauf erst, wenn er Lektionen hat (E-1008-19, Punkt 4).
  - Großer Lauf E-1007-88 laut `docs/chats/simulation.md`.

## 4. Codes
- In diesem Chat vergeben: S-1008-1 bis S-1008-76. S-1008-75 wurde nicht vergeben.
- **Nächster Code:** S-1008-77, an einem neuen Tag S-<MMTT>-1.
- Wo die Bedeutung steht:
  - S-1008-1 bis -16: im Simulationsbericht
  - S-1008-17 bis -23: Prüfauftrag, Kopf der Prüfdatei
  - S-1008-24 bis -73: Befunde in der Prüfdatei
  - S-1008-74 und -76: Übergabe-Texte

## 5. Andere Chats
Quelle: `docs/lehrplan.md`, `docs/ideen.md`. Laut `docs/chats/simulation.md` liegen sie in einem anderen Konto; `send_message` geht dann nicht.
- „App-Engine: Funktionen“: `session_0178n7MqHz3VvKsjw8JASFNh` (E-…)
- „Opi suomea (Lerninhalte)“: `session_01JzrEfnqnC1AnKhF6FkbjyW` (F-…)
- „Deutsch-Trainer (Lehrinhalte)“: `session_01XDLQ2V6tk1eM7bLtG3XZRH` (D-…)

## 6. Werkzeuge und Erfahrungen
- **Hilfsskripte für Inhaltsprüfungen** (nur lesen, ändern nichts):
  - `docs/simulationen/hilfsskripte/themen-ausgeben.js`
    - Aufruf: `node docs/simulationen/hilfsskripte/themen-ausgeben.js . t07b t08d`
    - Gibt Theorie, Wörter und Übungen eines Themas als Text aus. Bei mc ist die richtige Option mit `*` markiert.
  - `docs/simulationen/hilfsskripte/wortlisten-abgleich.js`
    - Aufruf: `STAMM=1 node docs/simulationen/hilfsskripte/wortlisten-abgleich.js . <ids…>`
    - Listet Wörter in Musterlösungen, die bis zu diesem Thema in keiner Wortliste standen.
    - Ohne `STAMM` sind es viele Meldungen für Beugungsformen (656 über alle Themen), mit `STAMM` etwa 240.
- **Quellen für Finnisch** (Netz von Matthias freigegeben):
  - uusikielemme.fi (Suche: `https://uusikielemme.fi/?s=…`)
  - en.wiktionary.org
  - kielitoimistonohjepankki.fi (Suche: `https://kielitoimistonohjepankki.fi/?s=…`). Dort steht z. B., dass *alkaa tekemään* seit Kurzem zulässig ist.
  - finnpottblog.de (Linkliste)
  - Nicht abrufbar: scripta.kotus.fi (403).
- **Simulation:**
  - Lange Läufe im Hintergrund, die Ausgabe in eine Datei schreiben und nur die Zusammenfassung lesen.
  - Wichtige Mechanik in `tools/simulation.mjs`:
    - `simIdle`: menschliche Pause, damit hochgeladen wird
    - leere Seite `/__sim.html` zum Umstellen der Uhr
    - SIM-Zustand in `localStorage` unter `__simState`
    - `simCtl` über `exposeFunction`
- **Sparsam mit Tokens:**
  - Keine Hilfs-Agenten mit hohem Effort.
  - Große Dateien nur in Ausschnitten lesen.
  - Den Chat einmal am Tag auf seine Länge prüfen und rechtzeitig übergeben.

## 7. Text S-1008-76 (an „App-Engine: Funktionen“, falls noch nicht weitergegeben)
```
Vorschlag vom Simulations-Chat (nur Kontrolle): S-1008-73 – Warnung in tools/pruefen.mjs bei Wörtern ohne frühere Wortliste

Hintergrund:
- Die Prüfung der Lehrinhalte vom 8.10.2026 liegt auf dem Branch pruefung/2026-10-08 (docs/pruefungen/2026-10-08-lehrinhalte.md, „Gesamtfazit“).
- Mehrere Befunde haben dieselbe Ursache: Eine Übung verlangt ein Wort, das bis zu diesem Thema in keiner Wortliste stand. Betroffen sind S-1008-27, -31, -32, -46, -49 und -60.

Vorschlag:
- pruefen.mjs gibt eine Warnung aus, keinen Fehler (hinweise/warn). Der Push bleibt erlaubt.
- Reihenfolge wie in der App: BASE_TOPICS, dann lektionen.json, Unterthemen direkt nach ihrem Hauptthema.
- Als „bekannt“ zählen:
  - v-Einträge bis einschließlich des aktuellen Themas
  - GLOSS_EXTRA
  - Formen, die buildDict/glossLocal (js/woerterbuch.js) lokal auflösen: Tabellenformen, SP.derive, SP.ends
  - nach F-1008-3 auch Wörter aus der Theorie (th) des Themas
- Geprüft wird jeweils die erste Musterlösung bei:
  - gap und sch
  - tr mit dir „de“
  - ord
  - den Lücken in tab
  - den eigenen Zeilen in dlg
- Nur neue oder geänderte Themen gegenüber dem Vergleichsstand prüfen.
- Ausgabe z. B. „! t07b: Wort ohne frühere Wortliste: juo (Übung 10, 18)“.
- Engine-Regeln:
  - Das gilt für beide Apps. Keine sprachspezifischen Texte fest im Code (SP/APP).
  - Selbsttest: Eine eingeschleuste Übung mit unbekanntem Wort muss eine Warnung erzeugen.

Messwerte aus der Prüfung:
- Einfacher Wortabgleich über alle Themen: 656 Meldungen.
- Mit Stammabgleich ab 4 Buchstaben: etwa 240. Darunter sind alle echten Befunde; der Rest sind vor allem olla-Formen.
- Referenz: docs/simulationen/hilfsskripte/wortlisten-abgleich.js auf Branch simulation/uebergabe-2026-10-08.

Vorgehen nach CLAUDE.md:
1. Matthias den Plan erklären.
2. OK zu S-1008-73 einholen, oder mit OK nur in docs/ideen.md sammeln.
3. Erst dann ändern.
4. Danach Prettier, pruefen.mjs, docs/entscheidungen.md. Nach dem Push „Engine übernehmen“ im Deutsch-Trainer auslösen.
```
