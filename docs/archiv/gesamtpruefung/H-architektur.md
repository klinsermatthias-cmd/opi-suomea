# H – Architektur der gemeinsamen Engine

Geprüft (Engine-Chat selbst, 7./8.10.2026): `tools/engine-dateien.txt`, `js/app.js` beider Apps, `js/sprache.js`,
`index.html` (Ladereihenfolge), Abhängigkeiten zwischen allen 17 Skriptdateien (Skript: 544 globale Namen, keine doppelt),
`engine-uebernehmen.yml`, `pruefen-und-veroeffentlichen.yml`, `tools/pruefen.mjs` (Teil 1 + Teil 6), `tools/test-app.js`,
Engine-Dateien auf fest verdrahtete App-Texte (grep), Stand beider Repos, Inhaltsumfang beider Apps.

Stand der Apps: Opi suomea 52 Themen (8 im Code, 44 in `lektionen.json`, 728 Wörter, 1080 Übungen, 467 KB JSON).
Deutsch-Trainer: noch **keine Themen**, nur der Einstufungstest (`PT`). Engine-Stand im Deutsch-Trainer = `6542776`
(7.10. 17:08 UTC); seitdem nur eine Doku-Zeile in `docs/architektur.md` geändert – wird beim nächsten Lauf übernommen.

## Gesamturteil
Die Grundentscheidung ist **richtig und passt zu Matthias' Lage** (keine Build-Werkzeuge, ein Entwickler-Chat, zwei kleine
Apps): Engine nur in einem Repo entwickeln, jede App holt sie sich selbst („Ziehen“ statt „Schieben“) und übernimmt sie
**nur, wenn die eigene Prüfung mit den eigenen Inhalten grün ist**. Alternativen wie ein gemeinsames Repo für beide Apps,
Git-Submodule oder ein npm-Paket brächten mehr Werkzeug und mehr Fehlerquellen, aber kaum Nutzen – **nicht empfohlen**.
Die Trennung über `APP` hält: In den Engine-Dateien steht kein fest verdrahteter App-Text (nur Kommentare nennen
„Opi suomea“). Die Schwachstellen liegen an den Rändern: was genau übernommen wird, was getestet wird, wo die Daten liegen.

## Befunde

### H1 – Deutsch-Trainer übernimmt auch Engine-Stände, die in Opi suomea nie grün waren
- **Schwere:** mittel
- **Wo:** `.github/workflows/engine-uebernehmen.yml:26` (`git clone --depth 1 …opi-suomea.git` = immer der neueste Stand von `main`)
- **Problem:** Die Action nimmt den aktuellen `main`, nicht den zuletzt **geprüften und veröffentlichten** Stand. Ist ein
  Engine-Push in Opi suomea rot (z. B. Teil 6 mit den finnischen Inhalten schlägt fehl), kann der Deutsch-Trainer ihn trotzdem
  übernehmen, wenn seine eigene Prüfung zufällig grün ist (er hat noch keine Themen – Teil 6 prüft dort fast nichts).
- **Folge:** Aurora könnte eine Engine-Fassung bekommen, die Matthias' App wegen eines Fehlers gerade **nicht** veröffentlicht hat.
- **Vorschlag:** Die Action holt den Stand, der in Opi suomea zuletzt veröffentlicht wurde – er steht schon heute in
  `…/opi-suomea/version.json` (wird nur nach grüner Prüfung geschrieben) – und checkt genau diesen Commit aus.
- **Aufwand:** klein (3–4 Zeilen im Workflow; danach einmal im Deutsch-Trainer eintragen, weil Workflows nicht automatisch mitgehen).
- **Apps:** Deutsch-Trainer (Ursache in der gemeinsamen Workflow-Datei).

### H2 – Das Sprachmodul Deutsch ist ungetestet
- **Schwere:** mittel
- **Wo:** `tools/test-app.js:22` (Engine-Tests laufen nur mit `code: "fi"`), `js/sprache.js:76–118` (`SPRACHEN.de`), `tools/pruefen.mjs` Teil 6
- **Problem:** Alle Engine-Tests laufen mit Finnisch als Lernsprache. Die deutschen Regeln (`SPRACHEN.de`: Endungen beim
  Antippen, Verneinung, Toleranzen für die KI-Prüfung …) werden nirgends ausgeführt. Teil 6 im Deutsch-Trainer prüft dessen
  echte Inhalte – aber dort gibt es noch keine Themen, also prüft er praktisch nichts.
- **Folge:** Ein Fehler, der nur bei Deutsch als Lernsprache auftritt, fällt erst auf, wenn Aurora ihn findet.
- **Vorschlag:** In `tools/pruefen.mjs` einen zweiten, kurzen Engine-Durchlauf mit einer deutschen Test-App (kleine
  `test-app-de.js` + zwei Test-Themen): Antwortprüfung mit ä/ö/ü/ß und Großschreibung, Wörter antippen, Vokabelhilfe,
  Einstufungstest. Läuft dann automatisch in beiden Repos.
- **Aufwand:** mittel.
- **Apps:** beide (der Test liegt in der Engine, schützt vor allem den Deutsch-Trainer).

### H3 – Unbekannte Lernsprache fällt still auf Deutsch zurück
- **Schwere:** niedrig
- **Wo:** `js/sprache.js:120` (`const SP = SPRACHEN[APP.target.code] || SPRACHEN.de;`)
- **Problem:** Käme eine dritte App (z. B. Schwedisch) dazu und fehlte ihr Eintrag in `SPRACHEN`, liefe sie ohne Warnung mit
  deutschen Sprachregeln (deutsche Endungen beim Antippen, deutsche Prüf-Toleranzen).
- **Folge:** Heute keine; bei einer neuen App falsche Wortbedeutungen und Bewertungen, ohne dass es jemand merkt.
- **Vorschlag:** `tools/pruefen.mjs` meldet einen Fehler, wenn es für `APP.target.code` keinen Eintrag gibt; in der App ein
  neutraler Standard (keine Endungsregeln) statt Deutsch.
- **Aufwand:** klein.
- **Apps:** beide (vorbeugend).

### H4 – Doppelte Funktionsnamen würden still überschrieben
- **Schwere:** niedrig
- **Wo:** alle 17 Skripte teilen sich einen globalen Bereich (544 Namen); `tools/pruefen.mjs:33–44` prüft nur doppelte **Aktionen**.
- **Problem:** Definieren zwei Dateien eine Funktion gleichen Namens, gewinnt still die später geladene (genau so ist der Fehler
  „Langzeit-Check rief die Antwortprüfung auf“ bei den Aktionen entstanden). Heute gibt es keinen Doppelnamen – das Risiko
  wächst mit jeder Datei.
- **Folge:** Ein Knopf oder eine Rechnung macht plötzlich etwas anderes, ohne Fehlermeldung.
- **Vorschlag:** In Teil 1 von `pruefen.mjs` alle obersten `function`/`const`/`let`-Namen über alle Dateien sammeln und Doppelte
  als Fehler melden (das Mess-Skript dieser Prüfung kann übernommen werden).
- **Aufwand:** klein.
- **Apps:** beide.

### H5 – Engine-Doku enthält App-Eigenes
- **Schwere:** niedrig
- **Wo:** `docs/architektur.md` (Engine-Datei, Titel „Architektur von Opi suomea“, Schlüssel `opi-suomea-v1`, Opettaja,
  Matthias' Entscheidungen), Kopfkommentare aller Engine-Skripte („Opi suomea – …“).
- **Problem:** Die Datei wird 1:1 in den Deutsch-Trainer kopiert; der Inhalts-Chat dort liest Opi-suomea-Angaben als seine eigenen.
- **Folge:** Missverständnisse in den Chats (z. B. falscher Speicherschlüssel), keine Wirkung auf die App selbst.
- **Vorschlag:** Titel „Architektur der Lern-Engine“, Beispiele mit `<APP.id>` statt `opi-suomea`, Kopfkommentare „Lern-Engine – …“.
- **Aufwand:** klein (nur Doku/Kommentare).
- **Apps:** beide.

### H6 – Beide Apps nutzen dieselben Cloud-Tabellen
- **Schwere:** wird mit Bereich A zusammen bewertet (siehe dort)
- **Wo:** `js/daten.js:546/565/604/654/670` – Tabellen `progress` und `snapshots`, **eine Zeile je Konto**, ohne App-Kennung im Schlüssel.
- **Problem:** Die Trennung der Apps hängt allein daran, dass jede App ein **eigenes Supabase-Projekt oder ein eigenes Konto**
  benutzt. Der Schutz `sameApp` verhindert nur das **Übernehmen** fremder Daten, nicht das **Überschreiben** der Cloud-Zeile.
- **Vorschlag (Architektur):** App-Kennung in den Cloud-Schlüssel aufnehmen (z. B. Spalte `app` und eindeutig je
  `user_id, app`) oder mindestens: nie eine Cloud-Zeile überschreiben, deren `data.app` eine andere App nennt, und in den
  Einstellungen deutlich sagen „eigenes Projekt bzw. eigenes Konto je App“.
- **Apps:** beide.

## Bewertung der Fragen aus „Vorgemerkt für die nächste große Prüfung“
- **Trennung Engine ↔ App-Dateien:** gut. Klare Liste, `APP`-Einstellungen decken alle Texte ab, Funktionen über `APP.features`.
- **„Engine übernehmen“:** gutes Prinzip (Prüfung mit eigenen Inhalten vor dem Übernehmen). Verbessern: H1; Workflow-Dateien
  bleiben Handarbeit (GitHub-Grenze, gut dokumentiert); aus der Liste entfernte Dateien bleiben im Deutsch-Trainer liegen (harmlos).
- **`APP`-Einstellungen:** gut. `exSeenBefore` (einmalige Nachtragung) liegt sinnvoll bei der App.
- **Sprachregeln (`SP`):** für zwei Sprachen richtig in einer Engine-Datei. Verbessern: H2, H3.
- **Datenhaltung je App:** im Browser sauber getrennt (`APP.id` als Präfix für localStorage, IndexedDB, Sicherungsdatei; Cache
  je App laut `sw.js`). In der Cloud nur durch Einrichtung getrennt → H6. Beide Apps teilen sich am selben Gerät das
  Speicherkontingent des Browsers (→ Bereich A).
- **App-Vorlage für neue Sprachen:** jetzt **nicht nötig**. Es genügt eine Checkliste „Neue App anlegen“ in `docs/engine.md`
  (Repo vom Deutsch-Trainer kopieren, `js/app.js`/`farben.css`/`js/inhalte.js`/`lektionen/`/Manifest/Icons anpassen, Sprache in
  `js/sprache.js` ergänzen, Supabase-Projekt anlegen, Workflow „Engine übernehmen“ ist schon dabei).
- **Gemeinsame Tests je App:** gibt es bereits (Engine-Tests mit festen Test-Inhalten + Teil 6 mit den echten Inhalten).
  Lücke: nur Finnisch → H2.
- **Getrennte Clouds:** siehe H6 – empfehlenswert, sobald jemand beide Apps mit einem Konto nutzt.
- **Dateigrößen:** `js/ki.js` (1295 Zeilen) und `js/daten.js` (1266) nähern sich der 1.500-Zeilen-Regel. Beim nächsten
  größeren Ausbau teilen: z. B. Aufträge/Prompts aus `ki.js` in `ki-auftraege.js`, Cloud-Sync aus `daten.js` in `sync.js`.

## Gut gelöst
- „Ziehen und selbst prüfen“: Eine fehlerhafte Engine kann den Deutsch-Trainer nur erreichen, wenn auch dessen Prüfung grün ist.
- Keine App-Texte im Engine-Code; Unterschiede vollständig in `js/app.js` (gleiche Struktur in beiden Apps).
- Veröffentlichung nur nach grüner Prüfung; Versionsnummer in den Skript-Adressen verhindert gemischte alte/neue Dateien.
- Speicherschlüssel, IndexedDB und Sicherungsdatei werden aus `APP.id` gebildet; Daten der anderen App werden nie übernommen.
- Ladereihenfolge und Abhängigkeiten sind diszipliniert: Beim Laden ruft keine Datei Funktionen späterer Dateien auf.
