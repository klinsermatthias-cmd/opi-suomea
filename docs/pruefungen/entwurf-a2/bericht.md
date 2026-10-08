# Entwurf A2: Themen t20–t35 vollständig ausgearbeitet (S-1008-124)

Simulations-Chat (Kontrolle), Auftrag von Matthias 8.10.2026 (Plan: `docs/pruefungen/2026-10-08-abschluss-plan.md`,
Schritt A). **Nur Entwurf:** Die App lädt diese Themen nicht. Übernahme in `lektionen/lektionen.json` nur durch den
Inhalts-Chat mit F-Code nach Matthias' OK. Branch `pruefung/abschluss-2026-10-08`, nie `main`.

## Arbeitsstand
- **Stand (8./9.10.2026): Schritt A fertig.** Alle 53 Themen t20–t35d ausgearbeitet, Korrektur-Durchgang (S-1008-122)
  abgeschlossen, Abdeckung geprüft, volle App-Prüfung grün (siehe „Prüfungen“).
- **Fertig:** t20–t27d (A2.1), t28–t28c, t29–t29c, t30–t30c, t31–t31c, t32–t32c, t33–t33c, t34–t34c, t35–t35d.
- **Wecker** `trig_01VcJoSKc85EYWhTuZrGwzRg` nach Abschluss gelöscht.
- **Als Nächstes:** nur nach Matthias' OK – siehe „Offene Fragen“ (Schritt B = Plan S-1008-113).

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
| t32 | Stadt & Dienstleistungen (Mehrzahl in allen Ortsfällen) | 21 | 25 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t32b | Probleme & Reparaturen in der Wohnung (32.2) | 16 | 24 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t32c | Feinheiten: Genitiv Mehrzahl – talojen, lasten, ihmisten (32.3) | 9 | 22 (les 2, dlg 2, sch 2, tab 1) | ausgearbeitet, geprüft |
| t33 | Verben mit festen Fällen (Rektion) | 21 | 27 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t33b | Hobbys im Detail – die -minen-Form (33.2) | 19 | 29 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t33c | Feinheiten: Der Fall ändert die Bedeutung – etsiä, puhua, kuulua (33.3) | 7 | 26 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t34 | Gefühle ausdrücken (itse, Possessivsuffixe vertiefen) | 23 | 30 (les 2, dlg 2, sch 2, tab 3) | ausgearbeitet, geprüft |
| t34b | Gesundheit 2: Zahnarzt & gesund leben (34.2) | 19 | 27 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t34c | Feinheiten: Meinung & Ratschlag – mielestäni, kannattaa, pitäisi (34.3) | 12 | 24 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t35 | Wiederholung A2 & Prüfungstraining (YKI-Stil) | 20 | 27 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t35b | Lesen & Hören: Aushang, Anzeige, Durchsage, Wetterbericht (35.2) | 20 | 27 (les 3, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t35c | Feinheiten: Schreiben wie im YKI-Test – Nachricht, Beschwerde, Einladung (35.3) | 9 | 25 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |
| t35d | Finnland: Staat & Gesellschaft (35.4) | 20 | 24 (les 2, dlg 2, sch 2, tab 2) | ausgearbeitet, geprüft |

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
- t26b: 22 Karten statt 15–20 – Tiere, Pflanzen und Bewegungsverben brauchen mehr Grundwörter (bewusst so gelassen).
- t33: *tutustua*, *luottaa* (t29b) und *unohtaa* nur als Wiederholung; zusätzlich *apu*, *kuulua*, *historia*.
  Beispiel „uskoa + Wohin-Form“ mit *Uskon sinuun* statt *Jumalaan* (nur bekannte Wörter).
- t33b: zusätzlich *käydä lenkillä*, *harjoitella*, *kuoro*, *kansalaisopisto*, *urheiluseura*, *maali*, *hävitä*,
  *kilpailu*; *jääkiekko* hatte bisher keine Karte. Regelfrage „leikkiä – pelata – soittaa“.
- t33c: Der Plan nannte nur *etsiä* (Wh.); ausgearbeitet als „Der Fall ändert die Bedeutung“ (puhua suomea / säästä,
  ajatella sinua / siitä, rakastaa / rakastua, pitää / pitää huolta, kuulua). Zusätzlich *heti* (fehlte in A1).
- t34: zusätzlich *olo*, *mukava* (fehlte in A1!), *hävettää*, *ärsyttää*, *vitsi*, *sisu*; *onnellinen*, *itkeä*, *nauraa* nur
  Wiederholung. `req` + t29c (miltä tuntuu).
- t34b: zusätzlich *reikä*, *paikata*, *puudutus*, *hammasharja*, *terve*, *vaarallinen*, *paino*, *influenssa*,
  *alkoholi*; *levätä*, *tupakoida* nur Wiederholung. `req` + t17b (päänsärkyä, sattua), t33b (-minen).
- t34c: *varmasti* als Form auf der Karte *varma* (Höchstzahl 12 Karten für x.3); *totta* nur Wiederholung.
- t35: Plan „keine neuen Wörter“ – stattdessen 20 Wörter aus Prüfungsanweisungen (*ohje, vaihtoehto, täydentää, lause,
  perustella, mielipide, tilanne …*), damit YKI-Aufgaben verständlich sind; Grammatik nur gemischte Wiederholung.
- t35b: zusätzlich Himmelsrichtungen *etelä, pohjoinen, itä, länsi* (fehlten bisher ganz), *pahoitella*, *raide*, *lehti*, *radio*.
- t35c: zusätzlich *sillä, ensinnäkin, toisaalta, ehdottaa, pyyntö, valitus, korvaus, saunavuoro, pyykkitupa* (Plan: keine neuen).
- t35d: zusätzlich *pääkaupunki, kansanedustaja, kansalainen, päiväkoti, peruskoulu, ammattikoulu* (Schulsystem fehlte in 28.1).

## Prüfungen
- **Eigene Prüfung** (`werkzeuge/pruefen.cjs`): 53 Themen, 831 Wörter, 1379 Übungen – 0 Fehler, 1 Hinweis
  (t26b hat 22 statt 15–20 Karten, bewusst).
- **Volle App-Prüfung** (`tools/pruefen.mjs` in einer Kopie von `origin/main`, Entwürfe an `lektionen.json` angehängt):
  VOLLPRUEFUNG_ERGEBNIS
- **Abdeckung:** 664 Kernwörter aus dem Themenplan (20.1–35.4) – alle haben eine Karte. 13 scheinbare Lücken sind Formen
  oder Wendungen vorhandener Karten (z. B. *roskat* bei *roska*, *varmasti* bei *varma*, *kiitos viestistä*).
- **Korrektur-Durchgang (S-1008-122):** Alle finnischen Sätze, Karten, Musterlösungen, Regeln und Sachhinweise wurden
  von 6 unabhängigen Gegenlesern (je 8–9 Themen) geprüft: 146 Funde. Jeden Fund habe ich selbst nachgeprüft;
  eingearbeitet wurden alle bis auf einen (t33b „Pihalla leikkivät lapset“ bleibt als gültige Wortstellung).
  Unsichere Punkte per Websuche bestätigt (Sprachrat 2014 zu *alkaa tekemään*, YKI-Stufen, Kotus-Regel zum Komma).
  **Echte Fehler, die korrigiert wurden:**
  - t35: YKI-Grundstufe (*perustaso*) = Stufen 1–2 (A1–A2), nicht 1–3; Stufe 3 (B1) gibt es erst im *keskitaso*.
  - t29: *joiden* stand als Mehrzahl-Objekt in der Tabelle – richtig *jotka* (*kirjat, jotka luin*); *joiden* = „deren“.
  - t20: Translativ-Regel galt nur für *kokki*; allgemein: Stamm der -n-Form (*sade → sateeksi*).
  - t25: *pitkin* wurde als Superlativ von *pitkä* akzeptiert (heißt „entlang“) – nur *pisin*.
  - t22: die gleichwertige Form *omenia* wurde abgelehnt – jetzt überall akzeptiert.
  - t23b u. a.: Komma nach dem Schlussgruß entfernt (*Ystävällisin terveisin Matthias*), Regel ergänzt.
  - t23c, t28: Aufgaben, bei denen eine richtige Antwort als falsch gegolten hätte (Perfekt/Imperfekt, „du“/„ich“).
  - t30b: *vieksä* = *vietkö sä* (nicht *viekö*). t24d: Datum der Kulturwoche passte nicht zu „Montag“.
  - Sachhinweise: 1. *kerros* = Erdgeschoss (t31b, t32c); Grippeimpfung gratis nur für Risikogruppen (t34b);
    erste Steuerkarte meist beim Finanzamt (t35d); Neuer Dom Linz 1862–1924 (t30c); *alkaa tekemään* seit 2014
    auch standardsprachlich erlaubt (t31, t31c); *pesäpallo* nicht „nur in Finnland“ (t33b).
  Dazu viele Kleinigkeiten: naheliegende richtige Antworten ergänzt, unpassende akzeptierte Antworten gestrichen,
  finnische Anführungszeichen ”…” in finnischen Texten, schiefe Formulierungen geglättet.

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
  *ulos*, *pois*, *vanhemmat*, *paikka*, *hauska*, *ongelma*, *hinta*, *opettaa*, *moni*, *esimerkiksi*, *viettää*, *heti*, *jääkiekko*, *mukava* (in t21–t34 ergänzt), *idea*.
- Bis A2 fehlten ganz: Himmelsrichtungen (*etelä, pohjoinen, itä, länsi* – jetzt t35b) und Schulsystem (*peruskoulu,
  päiväkoti, ammattikoulu* – jetzt t35d).
- **Vokabelkarte Deutsch → Finnisch prüft nur die exakte Vorderseite** (`js/vokabeln.js`, `revealCard`, `acc = [w[0]]`;
  `norm()` in `js/daten.js` entfernt „…“ nicht): Bei *onko …?* (t08) wird die Eingabe „onko“ lokal als falsch gewertet
  (nur die KI kann retten). Vorschlag (E-…): „…“ in `norm()` entfernen bzw. Schrägstrich-Alternativen auch in dieser
  Richtung zulassen. In den Entwürfen vermieden (t20d, t23b, t34c umgestellt).
- Antippen: auch die Endungen der Teilungsform Mehrzahl (-ja/-jä, -ia/-iä, -ita/-itä, -oita) fehlen in `SP.ends` – in t22 bleiben z. B. *munia, kaloja, mansikoita* ohne Erklärung.

## Offene Fragen für Matthias / den Inhalts-Chat
- **S-1008-125:** Schritt B starten – Analyse und 360-Tage-Simulation nach Plan S-1008-113 mit diesen 53 Themen
  (Empfehlung: Effort xhigh, wie bei Schritt A).
- **S-1008-126:** Die App-Befunde oben (Antippen kennt A2-Endungen nicht, Formen in Klammern ungenutzt, „…“ in
  Vokabelkarten Deutsch → Finnisch) schon jetzt als Prompt für den Funktionen-Chat formulieren, statt erst im
  Abschlussbericht.
- **S-1008-127:** Den Entwurf dem Inhalts-Chat als Grundlage nennen (Übernahme thema-weise mit F-Code nach Matthias' OK).
- Weiter offen aus dem Plan: S-1008-114 … 119; S-1008-112 ruht (Matthias meldet sich).
