# A – Datensicherheit

Geprüft (Engine-Chat, 8.10.2026, nach Abbruch des Hilfs-Prüfers): `js/daten.js` vollständig (Speichern, `migrate`,
`mergeStates`, `applyResets`/`applyWipe`, `pushCloud`/`pullCloud`/`firstLink`, Sicherungsdatei), `js/verwaltung.js`
vollständig (Sicherung, Import, Lektionspakete, Bericht), Cloud-Zugriffe in `js/ansichten.js`. Abgleich aller 42
Zustandsfelder, die der Code benutzt, mit `defaultState()` und `mergeStates()`. Messungen im Headless-Chromium:
Größe eines voll genutzten Stands, Speichergrenze des Browsers.

## Befunde

### A1 – Die Lektionen stecken im Lernstand: Speicher, Sicherheitskopien und Hochladen werden schwer
- **Schwere:** mittel (wächst mit jedem neuen Thema)
- **Wo:** `js/verwaltung.js:241/244` (`loadRepoLessons` legt jedes Thema aus `lektionen.json` in `S.packs` ab), `js/daten.js:354–378`
  (`writeLocal`), `:380` (`safeCopy`), `:539/541` (Hochladen des ganzen Stands, `keepalive` nur unter 60 KB), `:657` (Tagesstand)
- **Problem:** Alle 44 Themen aus `lektionen.json` werden in den Lernstand kopiert. Gemessen: `S.packs` = **291 KB**; ein voll
  genutzter Stand (52 Themen gelernt, Protokolle voll) = **955 KB** (packs 291, Karten 257, KI-Protokoll 123 KB). Dieser Stand
  liegt im Browser-Speicher, dazu bis zu fünf vollständige Sicherheitskopien (`-vor-sync`, `-vor-import`, `-vor-reset`,
  `-vor-loeschen`, `-vor-wiederherstellung`). Gemessene Grenze in Chromium: **5,24 Mio. Zeichen je Origin – geteilt mit dem
  Deutsch-Trainer**. Wird es eng, löscht `writeLocal` stillschweigend die Sicherheitskopien (so gewollt, damit der aktuelle Stand
  gerettet wird). Außerdem geht bei **jedem** Hochladen und jedem Tagesstand der ganze Stand (0,4–1 MB) über das Netz; der
  `keepalive`-Versand beim Schließen (Grenze 60 KB) kommt dadurch nie mehr zum Einsatz (das normale Hochladen beim Schließen
  klappt im Test trotzdem – `pruefen.mjs` „Sync beim Schließen auch bei großem Stand“ –, am Handy ist es weniger sicher). Die Doku nennt noch „ca. 30 KB“.
- **Ablauf/Beleg:** `exp-A/scripts/groesse.mjs` (voll genutzter Stand), `exp-A/scripts/quota.mjs` (Grenze 5.242.730 Zeichen).
  Rechnung: 955 KB × (Stand + 5 Kopien) ≈ 5,7 Mio. Zeichen > Grenze. Mit den Entwürfen bis B1 (t20–t43) verdoppeln sich die Lektionen ungefähr.
- **Folge:** Die Notfall-Kopien, auf die Matthias sich verlässt, verschwinden genau dann, wenn der Speicher knapp wird; am Handy
  kostet jedes Hochladen spürbar mobile Daten.
- **Vorschlag:** Lektionen aus `lektionen.json` **nicht** mehr im Lernstand speichern, sondern bei jedem Start aus der Datei
  (offline aus dem Service-Worker-Cache) laden; im Stand bleiben nur von Hand eingespielte Pakete. Einmalige Umstellung in
  `migrate()` (Pakete, die genau so in `lektionen.json` stehen, aus `S.packs` entfernen – nichts am Fortschritt ändert sich, Karten
  hängen an Themen-ID und Index). Danach Doku „ca. 30 KB“ berichtigen. Test in `pruefen.mjs`: Stand ohne Lektionen, App offline.
- **Aufwand:** mittel (Sync-nah, daher mit Sicherungs-Branch und Zwei-Geräte-Test)
- **Apps:** beide

### A2 – Cloud-Tagesstände sind nicht nach App getrennt
- **Schwere:** niedrig (nur wenn beide Apps dasselbe Supabase-Projekt **und** dasselbe Konto nutzen)
- **Wo:** `js/daten.js:654–664` (`snapshots` eindeutig je `user_id, day`), `js/ansichten.js:120/142` (Liste/Laden ohne App-Filter),
  `js/daten.js:565/604` (`progress` eine Zeile je Konto)
- **Problem:** Der Hauptstand ist geschützt (`sameApp` verhindert Übernehmen und Überschreiben – nachvollzogen in `pushCloud`,
  `pullCloud`, `firstLink`). Die Tagesstände nicht: Beide Apps schreiben in dieselbe Zeile des Tages und überschreiben sich.
  Die zweite App kann außerdem nie synchronisieren (dauerhaft „Sync-Fehler“), weil die eine Zeile der ersten App gehört.
- **Folge:** Würde Matthias den Deutsch-Trainer mit seinem eigenen Konto ausprobieren, wären seine 30 Tagesstände von Opi suomea
  teilweise weg.
- **Vorschlag:** App-Kennung in beide Tabellen (Spalte `app`, eindeutig je `user_id, app` bzw. `user_id, app, day`) – zusammen mit H6;
  bis dahin in „Cloud & KI einrichten“ deutlich: „je App ein eigenes Konto“.
- **Aufwand:** mittel (Datenbank-Änderung in Supabase + Code), Hinweistext klein
- **Apps:** beide

## Verdachtsfälle / Anmerkungen (kein Datenverlust im engeren Sinn)
- Üben zwei Geräte **offline** dasselbe Thema, gewinnt beim Zusammenführen der Stand mit der jüngeren Runde vollständig
  (`mergeStates`, Zeile 738); die Runde des anderen Geräts fehlt dann im Verlauf, Rundenzahl und Lernkalender zählen sie nicht
  (`Math.max` statt Summe). Der Wiederholungsplan bleibt richtig. Bewusst so gebaut; nur erwähnenswert.
- Geht die Uhr eines Geräts stark falsch, entscheiden dessen Zeitstempel beim Zusammenführen (Themen, Karten, Löschen/Zurücksetzen).
  Der Vergleich beim Hochladen ist davon **nicht** betroffen (exakter Vergleich, keine Uhrzeit-Logik). Nicht belegt, selten.
- Ausweichweg ohne Vergleich (`NO_CAS`, HTTP 400): zwischen Holen und Schreiben kann ein anderes Gerät dazwischenkommen.
  Tritt nur ein, wenn Supabase den Vergleich ablehnt; nie beobachtet.

## Gut gelöst
- `mergeStates` deckt **alle 42** im Code benutzten Zustandsfelder ab (geprüft per Skript); unbekannte Felder einer neueren
  App-Version bleiben beim Speichern erhalten (`migrate` ergänzt nur, löscht nichts).
- Hochladen nur mit Vergleich (`updated_at=eq.…`), sonst erst zusammenführen – kein Gerät überschreibt blind ein anderes.
- Fremde Stände werden erst gebaut und migriert, bei Fehlern bleibt der alte Stand (`adoptState`); unlesbarer Speicher wird als
  `-defekt-…` aufgehoben statt überschrieben.
- Sicherungen enthalten nie Schlüssel oder Anmeldedaten (die liegen getrennt in `CFG`, das nie synchronisiert oder exportiert wird).
- Löschen/Zurücksetzen/Wiederherstellen sind über Geräte hinweg mit Zeitfenstern abgesichert (`applyWipe`, `restoreWins`).
