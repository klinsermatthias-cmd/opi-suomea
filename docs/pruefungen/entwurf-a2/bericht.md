# Entwurf A2: Themen t20–t35 vollständig ausgearbeitet (S-1008-124)

Simulations-Chat (Kontrolle), Auftrag von Matthias 8.10.2026 (Plan: `docs/pruefungen/2026-10-08-abschluss-plan.md`,
Schritt A). **Nur Entwurf:** Die App lädt diese Themen nicht. Übernahme in `lektionen/lektionen.json` nur durch den
Inhalts-Chat mit F-Code nach Matthias' OK. Branch `pruefung/abschluss-2026-10-08`, nie `main`.

## Arbeitsstand
- **Stand (8.10.2026):** t20-Familie fertig (t20, t20b, t20c, t20d), volle Prüfung „Alles in Ordnung“.
- **Fertig:** t20, t20b, t20c, t20d
- **Als Nächstes:** t21, t21b, t21c, t21d, dann t22 … (Reihenfolge wie die Tabelle unten).
- **Wecker:** `trig_01VcJoSKc85EYWhTuZrGwzRg` (alle 2 h, an diese Session gebunden) – nach Abschluss löschen.
- **Wiederaufnahme:** Branch holen, diesen Abschnitt lesen, `node docs/pruefungen/entwurf-a2/werkzeuge/pruefen.cjs`
  ausführen, beim ersten Thema mit Status „offen“ weitermachen.

## Aufbau
- `themen/<id>.json` – ein Thema je Datei, gleiches Format wie `lektionen/lektionen.json` (siehe `docs/uebungsformate.md`).
- `werkzeuge/laden.cjs` – lädt vorhandene Themen und Entwürfe (nur lesend).
- `werkzeuge/wort.cjs` – sucht Wörter in allen Wortlisten (neu oder schon als Karte vorhanden).
- `werkzeuge/pruefen.cjs` – Struktur, Hinweise, Satz ordnen, Mengen, doppelte Karten, Voraussetzungen, Wörter aus
  Themen außerhalb der Voraussetzungen; baut `lektionen-a2.json` (alle Entwürfe als ein Array zum Anhängen).
- Zusätzlich läuft `node tools/pruefen.mjs` in einer Kopie des Repos, in der die Entwürfe an `lektionen.json`
  angehängt sind (Musterlösungen im Browser, Antippen, Wortprüfung). Ergebnis unten unter „Prüfungen“.

## Regeln für die Ausarbeitung
- Grundlage: `lektionen/entwuerfe-bis-b1.md` (Unterthemen-Tabelle S-1008-87), `docs/pruefungen/2026-10-08-themenplan-bis-b1.md`
  (Abschnitte 5 und 6, Kernwörter), `lektionen/README.md`, `docs/uebungsformate.md`, `docs/lehrplan.md`.
- IDs: x.1 = `tNN`, x.2 = `tNNb`, x.3 = `tNNc`, x.4 = `tNNd`. Niveau `A2.1` (t20–t27) bzw. `A2.2` (t28–t35).
- Mengen: Hauptthema 20–25 Wörter, x.2 15–20, x.3 5–12; mindestens 15 Übungen, je 2 `les`/`dlg`/`sch`, 2–4 Regelfragen
  mit `x`, Grammatik auch als `tab`, Kasten „So sagt man's gesprochen“, x.3 mit 2–3 Übungen zu gesprochenem Finnisch.
- `req`: Hauptthema = alle Hauptthemen davor + x.2 von Thema x−2 (t20 zusätzlich die A1-Unterthemen laut Entwurf);
  t28 zusätzlich alle A2.1-x.3 und 20.4, 21.4, 24.4, 27.4. Unterthemen = Hauptthemen bis einschließlich x, dazu jedes
  Unterthema, dessen Wörter oder Grammatik sie verwenden (wird unter „Abweichungen“ vermerkt).
- Wörter mit Karte in t01–t19c werden nicht noch einmal als Karte angelegt (Wiederholung nur in Übungen).
- Quellen: uusikielemme.fi, elon.io, oph.fi, en.wiktionary.org, kielitoimistonohjepankki.fi.

## Themen
| ID | Titel | Wörter | Übungen | Status |
|---|---|---|---|---|
| t20 | Arbeit & Beruf (als: -na, zu: -ksi) | 25 | 34 (les 2, dlg 2, sch 3, tab 4) | ausgearbeitet, geprüft |
| t20b | Arbeitsalltag: Schicht, Pause, krank melden (20.2) | 20 | 28 (les 2, dlg 2, sch 3, tab 2) | ausgearbeitet, geprüft |
| t20c | Feinheiten: Minusta tulee …, lapsena, viikoksi (20.3) | 12 | 28 (les 2, dlg 2, sch 2, tab 3) | ausgearbeitet, geprüft |
| t20d | Sprachkurs & Anmeldung: nachfragen im Unterricht (20.4) | 18 | 27 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |

## Abweichungen vom Themenplan
- t20: zusätzlich Karten *mikään* (bisher nur Theorie 7.2), *vuosi* (fehlte in A1 als eigene Karte), *myöhemmin*, *selvä*
  (für die Dialoge), *yrittäjä*, *kesälomalla*; *kokous* mit Formen. Tabelle *työskennellä* (Typ 3, nn → nt).
- t20b: zusätzlich *viikko* (fehlte in A1 als eigene Karte), *tällä viikolla*, *aamuvuoro*, *iltavuoro*, *ruokatauko*,
  *olla sairaana*, *hakea*. *kahvitauko* bleibt für 26.1.
- t20c: zusätzlich *minusta tulee*, *aikuisena*, *isona*, *sairastua*, *tänä vuonna*, *duuni/duunata* (gesprochen);
  `req` + t19b (asuin, halusin) und t20b (viikko).
- t20d: zusätzlich *alkeiskurssi*, *tunnilla*, *huomiseksi*, *sivu*, *avata* (bisher nur Theorie 16.3), *taso*, *netissä*,
  *miten sanotaan …?*.

## Prüfungen

## Befunde nebenbei (für den Abschlussbericht)
- **Antipp-Wörterbuch kennt A2-Endungen nicht** (`js/sprache.js`, `SP.ends`): es fehlen u. a. -ksi (Translativ), -lta/-ltä,
  -lle ohne Ort, -seen/-hin/-Vn (Wohin), -nut/-nyt/-neet, -isi-, Possessivsuffixe -ni/-si/-nsa/-mme/-nne, -mpi/-in,
  -maan/-massa/-masta, -minen, Passiv -taan/-tiin. Folge: viele A2-Formen nur über KI erklärbar. Vorschlag an den
  Funktionen-Chat (E-…): Endungsliste für A2 erweitern.
- **Formen in Klammern der Wortliste werden nicht genutzt** (`js/woerterbuch.js`, `buildDict`): Einträge wie
  „opiskella – studieren (opiskelen)“ oder „tauko – Pause (tauon)“ geben ihre Formen nicht ans Antippen weiter
  (Prüfung meldet z. B. *opiskelen*, *tauon*, *kahdeksi*). Vorschlag: Wörter in Klammern als Formen aufnehmen.
- A1: *viikko*, *vuosi* und *mikään* hatten keine eigene Karte (nur in Wendungen) – in t20/t20b ergänzt.
  *matkustaa* hat zwei Karten (t12 und t19).

## Offene Fragen für Matthias / den Inhalts-Chat
