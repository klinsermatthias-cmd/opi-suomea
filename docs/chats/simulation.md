# Startdatei Simulations-/Analyse-Chat (S-…)

Stand: **13.10.2026, 10:30 UTC**, vollständig neu geschrieben beim Umsiedeln (E-1009-18) vom Vorgänger `session_01GELRJqy8SAofm8nNVX2fcy` (Generation 1). Der Chat läuft unter **Matthias' zweitem Konto**, damit Simulationen und Prüfungen nicht das Limit der anderen Chats verbrauchen.

> **Das Repository ist öffentlich.** Niemals Fortschrittsberichte, Schlüssel (Gemini, Supabase), E-Mail-Adressen oder private Details committen. Keine Ergebnisse, Antworten oder Berichte von Aurora in Entwürfe, Quellendateien oder Commits. Die Simulation braucht keine echten Schlüssel – Gemini, Claude und Supabase sind nachgebaut.

## 0. Erste Schritte des Nachfolgers
1. Diese Datei lesen (liegt auf Branch `simulation/uebergabe-2026-10-13`, bis der Funktionen-Chat sie nach `main` übernimmt), dazu `CLAUDE.md`.
2. Beide Repos holen: `opi-suomea` (in der Sitzung) und `git clone https://github.com/klinsermatthias-cmd/deutsch-trainer /home/user/deutsch-trainer` (nur lesen, **nie dorthin pushen**).
3. Eigene Session-ID unten in Abschnitt 7 eintragen, auf `simulation/uebergabe-2026-10-13` pushen. `docs/chats/sessions.md` liegt auf `main` und darf nicht geändert werden. Matthias bekommt dafür einen Einfügetext für den Funktionen-Chat. `send_message` erreicht die anderen Chats nicht (anderes Konto).
4. Den alten Chat archivieren (`archive_session session_01GELRJqy8SAofm8nNVX2fcy`) und Matthias kurz melden: übernommen, offene Codes (Abschnitt 5), Einfügetexte (Abschnitt 6).

## 1. Rolle und Regeln
- **Nur Kontrolle:** prüft App, Inhalte, Code und Simulation; ändert nie App oder Inhalte der beiden Apps.
- **Darf ändern:**
  - `tools/simulation.mjs` und `docs/simulationen/` auf Branches `simulation/…`;
  - Prüfberichte in `docs/pruefungen/` auf Branches `pruefung/…`;
  - Themen-**Entwürfe** für den Deutsch-Trainer auf `pruefung/deutsch-d04-d09`, nur nach Matthias' Auftrag;
  - Token-Analyse auf `claude/language-app-token-analysis-b75s4a`.

  **Nie `main`**, nie das Repo deutsch-trainer (vorläufig aufgehoben, siehe Abschnitt 9). Der Funktionen-Chat prüft die Branches und übernimmt sie nach Matthias' OK.
- **Erst erklären, dann fragen, dann ändern.** Jede Option bekommt einen Code `S-<MMTT>-<Nr>`, der nie wieder vorkommt (nie a/b, 1/2). Ohne ausdrückliches OK zu einem Code wird nichts gepusht. Ausnahme: reine Verwaltung (Startdatei, Sicherung, Archivieren) ohne Rückfrage, gesammelt melden.
- **Fehler in der App** nicht selbst beheben: Befund mit Schwere, Datei:Zeile, Beleg, Folge, Vorschlag, Aufwand, betroffene Apps. Den Code gibt Matthias an den zuständigen Chat weiter, per **Einfügetext**.
- **Quellen:** Jede Aussage zu Deutsch/Finnisch mit Quelle (URL). Was nur aus eigenem Wissen stammt, als „ohne Quelle“ kennzeichnen.
  - Erreichbar: integrationsfonds.at, osd.at, duden.de, dwds.de, de/en.wiktionary (Rohtext `index.php?title=<Wort>&action=raw`, Werkzeug `node tools/quellen.mjs [--sprache de] <Wort>`), ostarrichi.org, learngerman.dw.com, vhs-lernportal.de, deutsch.lingolia.com, mein-deutschbuch.de, **schubert-verlag.de** (entgegen DT-Prüfliste erreichbar), hueber.de, klett-sprachen.de, deutschakademie.de, babbel.com, busuu.com; die Goethe/ÖSD-B1-Wortliste (`goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_B1_Wortliste.pdf`, urheberrechtlich geschützt, nur abrufen, nicht ins Repo).
  - Gesperrt: sprachportal.at, oesterreich.gv.at, Österreichisches Wörterbuch (403), übrige goethe.de-Seiten, coe.int, Langenscheidt. Duolingo nur per JavaScript, grammis lädt per JavaScript.
- Antworten an Matthias auf Deutsch, kurz; Commits auf Deutsch mit Attribution. Effort: Inhalte/Quellen `high`, Simulation `xhigh`, Verwaltung `low`.
- **Tokens sparen:**
  - Große Dateien nie ganz lesen (Grep, dann Ausschnitt), `lektionen.json` nur per `node -e`.
  - CI nur mit `node tools/ci-status.mjs`; `node tools/pruefen.mjs` zeigt nur ✗/!.
  - Hilfs-Agenten nur mit klarem Auftrag (Brief-Datei), Ergebnisse als Datei.
  - Agenten können am Sitzungslimit abbrechen (429). Dann nach der Rücksetzzeit per SendMessage fortsetzen, nicht neu starten.

## 2. Die App in Kürze
- **Zwei Apps, eine Engine:** *Opi suomea* (Finnisch für Matthias, dieses Repo, ~58 Themen) und *Deutsch-Trainer* (Deutsch für Aurora, B1 → B2, Österreich; `klinsermatthias-cmd/deutsch-trainer`). Getrennt sind nur Inhalte, `js/app.js`, `farben.css` und `js/inhalte.js`.
  - Der Deutsch-Trainer übernimmt die Engine über die Action „Engine übernehmen“.
  - Deutsch-Trainer veröffentlicht: **d01–d07** (main f212e83). d08/d09 sind Entwürfe (Abschnitt 4), d10–d33 nur im Plan (`docs/lehrplan.md` dort).
- **Lernlogik:**
  - Theorie → Wörter (beide Richtungen) → Übungen, Spaced Repetition.
  - Freischaltung streng: alle `req` ≥ 80 %.
  - Erste Lern-/Freischaltrunde höchstens 15 Übungen (`LEARN_MAX`), Wiederholungsrunden 8 (`ROUND_N`).
  - Karten-IDs `<tid>-<i>` / `<tid>-<i>-r`, Übungs-Indizes fest → in veröffentlichten Themen nur hinten anhängen.
- **Bewertung** (`js/uebungen.js`):
  - `localCheck` nimmt den ersten passenden Treffer unter den Alternativen.
  - `caseFree` gilt nur für tr/ord/sch/dlg/les und Lücken am Satzanfang, **nicht für tab**.
  - `baseAnswer` (seit 252d8cf): Großschreibung zählt nur in der Lernsprache.
  - `norm` entfernt Satzzeichen; `loose` für Deutsch nur ß/ss.
- **Speicher:** Lernstand, Lektions-Zwischenspeicher `<app>-lektionen` und Sicherheitskopien im localStorage; beide Apps teilen ≈ 5 Mio. Zeichen auf github.io (S-1012-104, offen).

## 3. Simulationswerkzeug (`tools/simulation.mjs`, auf main seit cb5e50d)
- Simuliert viele Tage auf **zwei Geräten** (PC täglich, Handy jeden 5. Tag, `HANDY_EVERY`). Verschobene Uhr, echte Inhalte, nachgebaute KI und Supabase; bedient die App über die Knöpfe.
- Aufruf: `DAYS=180 NODE_PATH=$(npm root -g) node tools/simulation.mjs`; Deutsch-Trainer mit `APP_ROOT=../deutsch-trainer`. Optionen im Kopf der Datei:
  - Schwächen/Störungen W1–W21;
  - `PV_FROM` (W19 Wörter vorab), `OFFLINE_A/B`, `QUOTA_DAY`, `GEM_DOWN` (W20 Grenzfälle);
  - `P_BASE`, `GAP`, `HANDY_EVERY` (W21 Profile).
- **Abdeckungs-Kontrolle:** Jede Aktion, Ansicht, Übungsart, KI-Art und Einstellung muss vorkommen. Ausnahmen nur in `EXEMPT` mit Begründung. Kurze Läufe erreichen nicht alles (Sicherungsdatei automatisch aus, Dateifreigabe, Langzeit-Check), der 180-Tage-Lauf schon.
- **Regel (Matthias):** Vor jeder Simulation prüfen, ob alle (auch neue) Funktionen abgedeckt sind, sonst zuerst erweitern. Seit cb5e50d sind neu auf main und in der Simulation noch nicht geprüft:
  - Selbstbewertung bei Dialogen/ohne KI (S-1012-123);
  - Zusammenführen mit vereinigtem Verlauf (S-1012-124);
  - Sync ohne Uhrvergleich (S-1012-121);
  - ehrliches Löschen bei vollem Speicher (S-1012-126);
  - Nomen-Karten antippbar (S-1012-102);
  - Gerätekonfiguration bei vollem Speicher und SW-Rückfall (Rest S-1012-125).
- **Bewährte Abläufe:**
  - Der Container wird bei Leerlauf zurückgefordert und beendet dabei laufende Simulationen; Hintergrundprozesse halten ihn nicht wach. Lange Läufe deshalb mit Fortschritts-**Monitor** (Heartbeat alle 10 min) oder in Teilen (≤ 70 Tage) fahren, Ausgabe in Dateien, `.done`-Marker.
  - Nie `pkill -f` mit einem Muster, das im eigenen Befehl steht.
  - Vor größeren Umbauten Sicherungs-Branch `sicherung/simulation-<name>`.
  - Bekannte Fehlalarme sind behoben (W19-Auswahl, „Abgleich verloren“ bei hängender Cloud: ce3c9f1, 8bb7719, 1c4ed36).
- Rohdaten der Läufe 12./13.10.: `docs/simulationen/rohdaten/2026-10-12-13-nacht.tar.gz` (Branch `simulation/abdeckung-2026-10-12`, 28008de; Ausgaben, Status, Skriptstände sim-v3/v5/w19/w20).

## 4. Branches und Berichte (alle gepusht)
| Branch | Inhalt | Stand |
|---|---|---|
| `simulation/abdeckung-2026-10-12` | Simulation W19–W21, Bericht `docs/simulationen/2026-10-13-nacht.md` (auf main übernommen, cb5e50d); danach nur Rohdaten 28008de | Rohdaten noch nicht auf main |
| `pruefung/nacht-2026-10-12` | Engine-Review (-121..-125), Inhalte Opi suomea (-127..-129), Morgenbericht 13.10. | auf main übernommen |
| `pruefung/ui-2026-10-12` | Handy-Oberfläche (S-1012-117), Screenshots, `ui-pruefung.mjs` | auf main übernommen |
| `pruefung/deutsch-d04-d09` | Entwürfe `docs/pruefungen/deutsch/entwuerfe/d04–d09.json` + `-quellen.md` (Quellen, GLOSS-Vorschläge, Prüfliste), Gesamtprüfung d01–d09 (64f0019), Werkzeuge/Generatoren `werkzeuge/entwuerfe-2026-10-12/` (8a25b66: d04–d09.py, gloss-*.js inkl. 53 Nomen d01–d03, Hilfsskripte, Quellenauszüge) | d04–d07 vom DT-Chat veröffentlicht (ea5fde0); **d08, d09 offen** |
| `pruefung/deutsch-gesamt-2026-10-13` | **Gesamtprüfung Deutsch-Trainer S-1013-4**: `docs/pruefungen/deutsch/gesamt-2026-10-13/README.md` + Teile A–F + Skripte (f85180a, 0034a39, 910dae0) | Codes S-1013-7..-24 offen |
| `claude/language-app-token-analysis-b75s4a` | Token-Analyse T-1012, `docs/token-analyse/`, Nachmessung S-1012-119 (6f6f500) | T-1012-9..-22 auf main |
| `simulation/uebergabe-2026-10-13` | diese Startdatei | an Funktionen-Chat zur Übernahme |

## 5. Codes
**Letzter vergebener Code: S-1013-24.** Der nächste ist S-1013-25 (bzw. am neuen Tag S-<MMTT>-1). Ältere Codes (S-1008-…, S-1009-…, S-1011-…, S-1012-1..-100) sind in `docs/entscheidungen.md`, `docs/archiv/` und den Simulationsberichten dokumentiert und erledigt oder übergeben.

**Erledigt / freigegeben (12.–13.10.):**
- S-1012-101..-107: freigegeben; -102, -105, -107 umgesetzt, -104 offen (siehe unten).
- S-1012-110: Entwürfe d05–d09.
- S-1012-111: Gesamtprüfung d01–d09.
- S-1012-112: DT-Simulation d01–d09.
- S-1012-113: Inhalte Opi suomea.
- S-1012-114: Engine-Review.
- S-1012-115/-116: Simulationen.
- S-1012-117: Oberfläche.
- S-1012-118: Wachstum.
- S-1012-119: Token-Nachmessung.
- S-1012-108/-109: nicht gewählt.
- S-1013-1..-6: Umfangsoptionen der Gesamtprüfung; **gewählt S-1013-4** (erledigt), die anderen nicht gewählt.
- Auf main umgesetzt (Funktionen-Chat, E-1013-1/-2):
  - S-1012-121 (Sync ohne Uhrvergleich);
  - S-1012-122 (Großschreibung nur Lernsprache);
  - S-1012-123/-124;
  - S-1012-125 (ganz);
  - S-1012-126.
- S-1012-127..-129: vom Inhalte-Chat umgesetzt (F-1013-1..-5, f6ff054).
- **S-1012-120: von Matthias freigegeben (13.10.).** Umsetzen muss der DT-Chat (Einfügetext Abschnitt 6).

**Offen:**
| Code | Kurz | Wer | Effort |
|---|---|---|---|
| S-1012-104 | localStorage → IndexedDB (auch Lektions-Zwischenspeicher); freigegeben, auf main noch nicht gesehen | Funktionen | high |
| S-1012-130 | Dauerhaft ~65 % → bleibt an 80 % hängen; **abwarten bis Checkpoint 1** (nach d07, echte Werte) | Entscheidung Matthias | – |
| S-1013-7 | Groß/klein: Satzanfang in Tabellen frei, Alternativen mit passender Schreibung zuerst | Funktionen | medium |
| S-1013-8 | Begründung `x` auch nach gap/tr/ord zeigen | Funktionen, dann DT | medium |
| S-1013-9 | Vokabel-/Diktat-Bewertung: Singular bei EN→DE-Nomenkarten, „(Pl.)“/Klammern, nur „auch:“-Klammern als Alternative („Austria“ heute gültig für E-Card), ae/oe/ue, zuhause, I'm, Gedankenstrich | Funktionen | medium |
| S-1013-10 | KI-Aufträge: dir "fi", Sprache von x/h/why, Wortlisten-Regel je App, Imperativ-Ausnahme | Funktionen | high |
| S-1013-11 | GLOSS: sein, sie/Sie, weiß, meinen (stand schon teilweise), Bescheid, bundesdeutsche Alternativen, Tomate/Schi/Bim, e-mail, doppeltes „keine“ | DT (+ eigene Vorschläge) | high |
| S-1013-12 | Teilen: jetzt nur noch **d08 → d08 + d08b, d09 → d09 + d09b** (Entwürfe); d05 veröffentlicht → höchstens Ergänzungsthema mit neuen Dativ-Übungen | dieser Chat (Entwurf) | high |
| S-1013-13 | Entwürfe nachbessern: d08-Imperativregel, ex[21], ex[44], d09 ex[49], 3. Dialog, Wegbeschreibung (links/rechts/geradeaus), als/wenn/wann-Wiederholung, +2 tr de; für d04–d07 an DT (nur anhängen) | dieser Chat / DT | high |
| S-1013-14 | d01–d03: Jause + bundesdeutsch, Querverweis d02 → d06, Varianten in `a`, Futur-Block | DT | high |
| S-1013-15 | Präteritum/Futur in jedem Thema (D-1011-6) behalten oder einschränken | Entscheidung Matthias | – |
| S-1013-16 | Plan-Lücken: temporale Präp., muss nicht/darf nicht, Indefinitpronomen, nicht nur…sondern auch/weder…noch, adversatives während, lassen+Inf., subst. Adjektive, innerhalb/außerhalb früher, attr. Komparativ, Redemittel; Partizip I B2+; CP2-Zeile | DT | high |
| S-1013-17 | Stärken nachprüfen (Checkpoint-Wiederholungstest, B2-Zusatztest, Wortschatz-Stichprobe) | DT (+ Funktionen) | high |
| S-1013-18 | Wortschatz: 5–10 Grundwortschatz-Karten je Thema, Behörde/Wohnung vorziehen, österreichische Uhrzeit/Datum | DT | high |
| S-1013-19 | Hören: `les`-Hörmodus, Satzdiktat, passive Dialekt-Karten | Funktionen, DT | medium |
| S-1013-20 | Formate: mehrere Lücken, Zuordnen/Sortieren | Funktionen (ideen.md) | medium |
| S-1013-21 | Theorie: Kurzfassung, Zielformen im Dialog, Kasus-Farben, Faustregel 25–35 Übungen | DT, dieser Chat | medium |
| S-1013-22 | Oberfläche DE: „Gute Nacht“, „Deutsch-Trainer“, Wörter/Vokabeln, Stimme, Bindestriche, „ß/ss“ | DT, Funktionen | low |
| S-1013-23 | Prüflisten (Opi-Nummern in Hinweisen, DT-Liste, Quellenliste, neue Zeilen) | Funktionen, DT | low |
| S-1013-24 | Einstufungstest: lvl je Aufgabe, A9.4 „mit“, A3-Hinweis, B3.1 | DT | low |

Empfehlung an Matthias (gemeldet): zuerst S-1013-7 und S-1013-11, dann S-1013-12/-13 vor der Veröffentlichung von d08/d09, dann S-1013-8/-9/-10. **Antwort von Matthias zu S-1013-7..-24 steht noch aus.**

## 6. Offene Einfügetexte und Termine
- **An „Deutsch-Trainer (Lehrinhalte)“ (S-1012-120, freigegeben):** „S-1012-120 ist freigegeben: Beim Start `docs/lehrplan.md` nicht mehr ganz lesen, sondern nur die Grundsätze und die Zeile des aktuellen Themas (per Grep). Spart etwa 3.500 Tokens je Start. Bitte in der Startanleitung bzw. `CLAUDE.md` festhalten.“
- **An „Deutsch-Trainer (Lehrinhalte)“ und „App-Engine: Funktionen“ (je nach Matthias' Freigabe):** auf den Bericht `pruefung/deutsch-gesamt-2026-10-13` verweisen, mit den freigegebenen S-1013-Codes.
- **An „App-Engine: Funktionen“:** Branch `simulation/uebergabe-2026-10-13` (diese Startdatei) nach `main` übernehmen, die neue Session-ID in `docs/chats/sessions.md` eintragen und die Rohdaten (28008de) übernehmen.
- **T-1012-Erinnerung (Token-Sparpaket):** Die drei Einfügetexte stehen im Morgenbericht auf main, `docs/pruefungen/2026-10-13-morgenbericht.md`, Abschnitt 1.2. T-1012-15 scheint erledigt: Die automatische Berichtsauswertung ist abgeschaltet (F-1013-12). Danach in jedem Chat `/context` messen.
- **Termine:**
  - Sommerzeit-Umstellung 25.10. (S-1012-125, auf main erledigt; bei der nächsten Simulation prüfen);
  - Checkpoint 1 des Deutsch-Trainers nach d07 → dann S-1012-130 entscheiden und den Deutsch-Trainer mit der veröffentlichten Fassung d01–d07 neu simulieren.
- **Routinen:** keine aktiv (`list_triggers` leer). Die stündliche Entwurfs-Routine und die 8:00-Erinnerung sind abgelaufen.

## 7. Session-IDs
- **Dieser Chat (Nachfolger, Generation 2, seit 13.10.):** `session_019eZRkq5orfkfFP6mnqNupE`
- Vorgänger (Generation 1, bis 13.10.): `session_01GELRJqy8SAofm8nNVX2fcy` – archiviert am 13.10.
- Andere Chats (Matthias' Hauptkonto, per `send_message` nicht erreichbar; Stand `docs/chats/sessions.md`):
  - „App-Engine: Funktionen“ (E-): `session_01RDQuEyYTikM25QrUxLnCu5`;
  - „Opi suomea (Lerninhalte)“ (F-): `session_01YUsnSxvNQWW2UiiXtsb9th`;
  - „Deutsch-Trainer (Lehrinhalte)“ (D-): `session_016DDMpBd2CwhYdxw8FXXc6M`.

## 9. Arbeitsstand Großauftrag (seit 13.10., S-1013-25..-31)
Matthias (13.10.): Dieser Chat ist vorläufig Hauptchat und arbeitet alle offenen Punkte nach eigener Empfehlung ab; darf auf `main` beider Repos pushen (S-1013-25), andere Chats pausieren (S-1013-26). Entschieden: S-1013-27 (Teilpunkte + Tageslimit bleiben auf der Ideenliste), S-1013-29 (Präteritum/Futur je Thema nur 2–3 Übungen, kein eigener Block; S-1013-15 erledigt), S-1012-130 bis Checkpoint 1 warten, S-1013-31 (A2-Entwurf t20–t35d erst zuletzt und nur bei t08/t02b/t03b ≥ 80 %). **Nicht machen:** Einstufungstest (abgeschlossen, S-1013-24 und Ideenliste-Punkt entfallen), vollständige Simulation (erst auf Matthias' Zeichen), KI-Test-Bericht (deaktiviert). Effort `high`; Aufgaben, die `xhigh` brauchen (S-1012-104 IndexedDB, Sync), erst nach Rückmeldung an Matthias starten.
Sicherung vor Beginn: `sicherung/vor-s1013-grossauftrag` (= main a84f242). Wecker: `send_later` alle ~90 min (Name „Wecker Großauftrag“).

Schritte (✔ = auf main):
1. [✔] Verwaltung: Startdatei, Rohdaten, sessions.md, CLAUDE.md-Hinweis
2. [✔] Engine: S-1013-7, -9, -8, -10, -22 (Engine), -23 (bis 6a4005e; Sicherungen `sicherung/vor-s1013-<Nr>`; DT übernommen, DT-Teil -10/-22/-23 in DT-main, CI grün)
3. [ ] (xhigh, wartet) S-1012-104 IndexedDB
4. [ ] Deutsch-Trainer: erledigt S-1013-11 (56cb81e), -14 (81d0163), -13 Teil d04–d07 + dritter Dialog d05–d07, Jause (DT-main, CI grün); offen: -12/-13 Entwürfe d08/d09, -18, -21, -16, -17, -29, Rest -13 (d04 Theorie, als/wenn-Wiederholung, +2 tr de)
5. [ ] Ideenliste: Noch nicht gelernt, Zahlentasten, Nomen mit Artikel, KI-Fehlermeldung, Handy-Knöpfe, Verbformen, Fehler-Knopf, Prüfvermerk, E-1009-21, S-1013-19/-20, Gegenlesen, quellen --thema
6. [ ] (wartet auf Matthias) vollständige Simulation
7. [ ] Schlussprotokoll, Startdateien aller Chats

## 8. Lehren aus Generation 1
- Commit-Nachrichten nicht mit Formulierungen wie „von Matthias freigegeben“ versehen; das wird als Anweisung missverstanden und blockiert. Den Code nennen genügt.
- Doppelte Ausführung von Skripten kann doppelte GLOSS-Schlüssel erzeugen; nach jedem Anhängen auf Duplikate prüfen.
- DT-Tabellen höchstens 3 Spalten; auf dem Handy breite Tabellen kürzen.
- Österreich-Regel (Matthias, 12.10.): zu jedem österreichischen Wort die bundesdeutsche Alternative auf der Karte („Germany: …“), in den Lösungen akzeptiert, auch in bestehenden Themen prüfen. In den eigenen Entwürfen ist „Jause“ in d01 übersehen worden: jede Karte mit „(Austria)“ automatisch prüfen.
- Eigene Entwürfe d05–d09 hatten nur 2 Dialoge (DT-Prüfliste 15 verlangt 3): vor jeder Abgabe die Formatzahlen per Skript gegen die Prüfliste zählen.
- Vor jedem Bericht den neuesten Stand von `main` beider Repos abgleichen: andere Chats setzen parallel um (am 13.10. waren S-1012-122 und d04–d07 schon erledigt bzw. veröffentlicht).
- `rm -f` mit Wildcards wird vom Sicherheitscheck geblockt → neuen Ordner anlegen statt löschen.
- Hilfs-Agenten: gemeinsamer Brief (Pfade, Quellen, Datenschutz, Ausgabeformat), je Teil eine Datei; danach die wichtigsten Befunde selbst nachprüfen.
