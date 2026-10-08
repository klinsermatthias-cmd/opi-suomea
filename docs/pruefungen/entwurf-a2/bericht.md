# Entwurf A2: Themen t20–t35 vollständig ausgearbeitet (S-1008-124)

Simulations-Chat (Kontrolle), Auftrag von Matthias 8.10.2026 (Plan: `docs/pruefungen/2026-10-08-abschluss-plan.md`,
Schritt A). **Nur Entwurf:** Die App lädt diese Themen nicht. Übernahme in `lektionen/lektionen.json` nur durch den
Inhalts-Chat mit F-Code nach Matthias' OK. Branch `pruefung/abschluss-2026-10-08`, nie `main`.

## Arbeitsstand
- **Stand (8.10.2026):** A2.1 komplett, A2.2 bis t31c (40 Themen), volle Prüfung „Alles in Ordnung“.
- **Fertig:** t20–t27d (A2.1), t28–t28c, t29–t29c, t30–t30c, t31–t31c
- **Als Nächstes:** t32, t32b, t32c, dann t33 … (Reihenfolge wie die Tabelle unten).
- **Danach:** eigener Korrektur-Durchgang über alle finnischen Sätze (in t31 wurde dabei schon ein Fehler gefunden:
  „pientä ravintolaan“ → „pieneen ravintolaan“).
- **Wecker:** `trig_01VcJoSKc85EYWhTuZrGwzRg` (alle 2 h, an diese Session gebunden) – nach Abschluss löschen.
- **Wiederaufnahme:** Branch holen, diesen Abschnitt lesen, `node docs/pruefungen/entwurf-a2/werkzeuge/pruefen.cjs`
  ausführen, beim ersten Thema mit Status „offen“ weitermachen.

## Aufbau
- `themen/<id>.js` – ein Thema je Datei (JS-Objekt, damit HTML ohne Escapes geht), gleiches Format wie `lektionen/lektionen.json` (siehe `docs/uebungsformate.md`).
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
- Theorie-Tabellen höchstens 3 schmale Spalten (sonst zu breit für 390 px – von der vollen Prüfung bemerkt und behoben).
- Quellen: uusikielemme.fi, elon.io, oph.fi, en.wiktionary.org, kielitoimistonohjepankki.fi.

## Themen
| ID | Titel | Wörter | Übungen | Status |
|---|---|---|---|---|
| t20 | Arbeit & Beruf (als: -na, zu: -ksi) | 25 | 34 (les 2, dlg 2, sch 3, tab 4) | ausgearbeitet, geprüft |
| t20b | Arbeitsalltag: Schicht, Pause, krank melden (20.2) | 20 | 28 (les 2, dlg 2, sch 3, tab 2) | ausgearbeitet, geprüft |
| t20c | Feinheiten: Minusta tulee …, lapsena, viikoksi (20.3) | 12 | 28 (les 2, dlg 2, sch 2, tab 3) | ausgearbeitet, geprüft |
| t20d | Sprachkurs & Anmeldung: nachfragen im Unterricht (20.4) | 18 | 27 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t21 | Wohnen & Wohnung suchen (Adjektiv + Nomen, -sti) | 25 | 27 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t21b | Möbel & Hausarbeit: Wo steht was? (21.2) | 19 | 25 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t21c | Wörter auf Konsonant: puhelin, kysymys, suomalainen (21.3) | 7 | 26 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t21d | Stufenwechsel umgekehrt: lomake → lomakkeen, rakas → rakkaan (21.4) | 7 | 25 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t22 | Im Restaurant (Teilungsform Mehrzahl, Objekt Mehrzahl) | 24 | 28 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t22b | Kochen & Rezepte: Keitä, lisää, sekoita! (22.2) | 17 | 25 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t22c | Feinheiten: monta, paljon, ilman, ei yhtään (22.3) | 10 | 27 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t23 | Telefon, Nachrichten & Erfahrungen (Perfekt, että) | 22 | 30 (les 2, dlg 2, sch 3, tab 2) | ausgearbeitet, geprüft |
| t23b | E-Mail & Brief: Anrede, Dank, Gruß (23.2) | 16 | 26 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t23c | Feinheiten: Imperfekt oder Perfekt? Seit, bis, nach, vor (23.3) | 11 | 27 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t24 | Feste & finnische Kultur (Possessivsuffixe) | 20 | 28 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t24b | Einladung & Gäste: zusagen, absagen, mitbringen (24.2) | 16 | 25 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t24c | Feinheiten: kotonani, kotiini, äidilleen (24.3) | 6 | 25 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t24d | Kultur erleben: Kino, Konzert, Kunst (24.4) | 17 | 25 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t25 | Kleidung & Einkaufen 2 (Komparativ, Superlativ) | 21 | 27 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t25b | Umtausch & Kundenservice: Se ei toimi! (25.2) | 15 | 26 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t25c | Feinheiten: paremmin, eniten, kahdessa kaupassa, riittää (25.3) | 7 | 25 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t26 | Typisch finnisch: Was man macht (Passiv Präsens) | 21 | 27 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t26b | Tiere, Pflanzen & Bewegung: seisoa, maata, Vedä! (26.2) | 22 | 27 (les 2, dlg 2, sch 2, tab 3) | ausgearbeitet, geprüft |
| t26c | Feinheiten: ei puhuta, Schilder, me ei mennä (26.3) | 10 | 24 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t27 | Behörden, Termine & höfliche Bitten (Konditional) | 21 | 27 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t27b | Bank & Post: Konto, Rechnung, Paket (27.2) | 16 | 26 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t27c | Feinheiten: Konditional aller Verbtypen, Jos olisin … (27.3) | 6 | 25 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t27d | Indirekte Fragen: Tiedättekö, missä …? En tiedä, onko … (27.4) | 6 | 24 (les 2, dlg 2, sch 2, tab 1) | ausgearbeitet, geprüft |
| t28 | Von früher erzählen (Plusquamperfekt, ennen kuin, kunnes) | 20 | 27 (les 2, dlg 2, sch 2, tab 3) | ausgearbeitet, geprüft |
| t28b | Lebenslauf & Familie früher (28.2) | 18 | 24 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t28c | Bindewörter A2: vaikka, joten, siksi, vaan, kuitenkin (28.3) | 8 | 25 (les 2, dlg 2, sch 2, tab 1) | ausgearbeitet, geprüft |
| t29 | Menschen beschreiben (Relativpronomen joka) | 21 | 26 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t29b | Charakter & Beziehungen: tutustua, luottaa, toisiaan (29.2) | 15 | 24 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t29c | Feinheiten: näyttää väsyneeltä, kuulostaa hyvältä; joka oder mikä (29.3) | 7 | 24 (les 2, dlg 2, sch 2, tab 1) | ausgearbeitet, geprüft |
| t30 | Natur, Mökki & Ausflüge (Passiv Vergangenheit) | 20 | 26 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t30b | Natur & Umwelt: Mülltrennung, Wetterextreme (30.2) | 20 | 25 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t30c | Feinheiten: otettiin, luettiin; on rakennettu (30.3) | 6 | 23 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t31 | Reisen & Unterkunft (3. Infinitiv: uimaan, uimassa, uimasta) | 21 | 26 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t31b | Im Hotel & unterwegs: einchecken, Probleme melden (31.2) | 16 | 24 (les 2, dlg 2, sch 2, tab 1) | ausgearbeitet, geprüft |
| t31c | Feinheiten: oppia uimaan, ruveta, jäädä; sanomatta (31.3) | 6 | 24 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |

## Abweichungen vom Themenplan
- t20: zusätzlich Karten *mikään* (bisher nur Theorie 7.2), *vuosi* (fehlte in A1 als eigene Karte), *myöhemmin*, *selvä*
  (für die Dialoge), *yrittäjä*, *kesälomalla*; *kokous* mit Formen. Tabelle *työskennellä* (Typ 3, nn → nt).
- t20b: zusätzlich *viikko* (fehlte in A1 als eigene Karte), *tällä viikolla*, *aamuvuoro*, *iltavuoro*, *ruokatauko*,
  *olla sairaana*, *hakea*. *kahvitauko* bleibt für 26.1.
- t20c: zusätzlich *minusta tulee*, *aikuisena*, *isona*, *sairastua*, *tänä vuonna*, *duuni/duunata* (gesprochen);
  `req` + t19b (asuin, halusin) und t20b (viikko).
- t20d: zusätzlich *alkeiskurssi*, *tunnilla*, *huomiseksi*, *sivu*, *avata* (bisher nur Theorie 16.3), *taso*, *netissä*,
  *miten sanotaan …?*.
- t21: zusätzlich *koti* (fehlte in A1 als eigene Karte), *kuukaudessa*; `req` + t19b (x.2 → x+2).
- t21b: zusätzlich *kirjahylly*, *verho*, *nurkassa*, *pyykki*, *pestä pyykkiä*.
- t21c: zusätzlich *ihminen* (fehlte in A1!), *vapaus*; `req` + t19b, t20b (työtön), t20d (kysymys, vastaus).
- t21d: *hammas* hat schon eine Karte (t17) – nur Wiederholung; zusätzlich *taivas*; `req` + t20d (koe).

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
  *matkustaa* hat zwei Karten (t12 und t19), ebenso *kuuma* (t14c, t18) und *tässä* (t10, t15c).
- A1 ohne eigene Karte, obwohl sehr häufig: *koti*, *ihminen*, *raha*, *kuva*, *asia*, *ennen*, *jälkeen*, *jättää*,
  *ulos*, *pois*, *vanhemmat*, *paikka*, *hauska*, *ongelma*, *hinta*, *opettaa* (in t21–t31c ergänzt), *idea*.
- Antippen: auch die Endungen der Teilungsform Mehrzahl (-ja/-jä, -ia/-iä, -ita/-itä, -oita) fehlen in `SP.ends` – in t22 bleiben z. B. *munia, kaloja, mansikoita* ohne Erklärung.

## Offene Fragen für Matthias / den Inhalts-Chat
