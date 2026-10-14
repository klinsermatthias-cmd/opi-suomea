# Entscheidungen und Verlauf

Entstanden im Claude-Projekt „Matthi Finnisch“ (Cowork), ab Oktober 2026 hier im Repository fortgeführt.

> **Archiv:** Die Einträge vom 5.–7.10.2026 (bis vor den Unterthemen) stehen wörtlich in `docs/archiv/entscheidungen-2026-10-05-bis-07.md`.
> **Neue Einträge nur anhängen, ohne die Datei zu lesen** (`cat >> docs/entscheidungen.md <<'EOF'`), Überschrift `## <Datum> – <Thema> (<Code>)`, höchstens 3–4 Zeilen; Details stehen im Commit und in den Fachdokumenten. Über ca. 20.000 Zeichen ältere Tage ins Archiv schieben (eine Datei je Zeitraum).

## Grundsatzentscheidungen
- Matthias lernt Finnisch von null an, mit Claude als Lehrer.
- Wunsch: dynamische App (Anki-artige Wiederholung, Theorie → Übungen, wachsender Wortschatz, KI-Prüfung), die Schritt für Schritt um neue Themen erweitert wird, sobald die bisherigen sitzen.
- Fortschritt darf nie verloren gehen, Sync zwischen PC und Handy.
- Kostenlos, aber mit KI → Web-App (PWA) auf GitHub Pages + Supabase (Sync) + Gemini Free Tier (KI).
- Fail-safes überall; jederzeit Wechsel zu HTML oder einer anderen Lösung mit allen Daten möglich.
- Optionale Alternative geprüft: Claude-API (Sonnet ca. 1–3 $/Monat bei dieser Nutzung, Ausgabenlimit in der Claude Console einstellbar). Nicht umgesetzt; bräuchte eine Zwischenstelle (z. B. Supabase-Funktion), damit der Schlüssel nicht öffentlich ist.

## 7.10.2026 – Unterthemen 7.2, 8.4, 13.2–15.3 (F-1007-34, Teil 1)
- Neu: t07b (nie, noch nicht, niemand, nichts), t08d (täällä/tuolla/siellä, tai/vai, kun, wie oft), t13b, t13c, t14b, t14c, t15b (mit Genitiv-Regel), t15c – je ≥ 15 Übungen mit Lesetext, Dialog, Schreibaufgabe; x.3 mit Übungen zu gesprochenem Finnisch.
- Freischaltung: 7.2/8.4 sind Voraussetzung für t13; 13.2 → t15, 14.2 → t16, 13.3/14.3/15.2/15.3 → t17 (nur Themen, die noch nicht frei sind).
- Chat-Länge (E-1007-90): Jeder Chat prüft einmal am Tag, ob er zu lang geworden ist, und schlägt dann einen neuen Chat mit vollständiger Übergabe in den Docs vor (Regel in CLAUDE.md).
- Chat-Länge (E-1007-92): Zuerst `/compact` vorschlagen, ein neuer Chat erst, wenn das nicht reicht.

## 7.10.2026 – Unterthemen 16.2–19.3, 16.4 und gesprochenes Finnisch (F-1007-34 Teil 2, F-1007-36)
- Neu: t16b, t16c, t16d (Personalpronomen in allen Fällen), t17b, t17c, t18b, t18c, t19b, t19c – je 20–24 Übungen mit Lesetext, Dialog und Schreibaufgabe; Vokabeln ohne Dopplungen zu früheren Themen.
- Freischaltung: 16.2 → t18, 17.2 → t19; 16.3, 16.4, 17.3, 18.2, 18.3, 19.2, 19.3 werden Voraussetzung für t20/t21, sobald diese angelegt sind (Notiz in den Entwürfen).
- F-1007-36: 2–3 Verstehensübungen zu gesprochenem Finnisch in 8.3, 9.2, 9.3, 10.3, 11.3, 12.3 angehängt (die neuen Unterthemen enthalten sie schon).

## 8.10.2026 – Gesamtprüfung und Paket E-1008-20
- Gesamtprüfung (E-1007-94/-95, Effort „max“): kein kritischer Befund, kein Weg zu Datenverlust gefunden; Ergebnis mit Codes in `docs/gesamtpruefung.md`, Einzelheiten je Bereich in `docs/gesamtpruefung/`.
- Paket E-1008-20 umgesetzt: gesperrte Themen nicht lernbar, auch nicht nach „Wörter vorab lernen“, alte Stände repariert (E-1008-1); KI nicht erreichbar → selbst entscheiden „Meine Antwort war richtig“/„Falsch“ statt automatisch falsch – „nicht gewertet“ wäre ein Schlupfloch gewesen, offline hätte kein Fehler mehr gezählt (E-1008-2); strenge Prüfung bei Lücken mitten im Wort und Hinweis „Vokalharmonie“, Toleranz je Sprache in `SP.loose`, Deutsch nur ß/ss (E-1008-3); „Heute“ bietet die Freischalt-Runde einer blockierenden Voraussetzung an (E-1008-4); Satz ordnen mit mehreren richtigen Wortstellungen (E-1008-6); „Engine übernehmen“ nimmt nur den veröffentlichten Stand (E-1008-8); Themenwörter nicht doppelt am selben Tag, kein Sprung auf 4 Tage (E-1008-10); gesperrte Themen lesbar, größere Tippflächen (E-1008-11); Lektionspakete zentral geprüft und bereinigt, Felder maskiert, Supabase-Prüfung um Tagesstände und Schreiben erweitert (E-1008-12); Prüfskript: keine doppelten Namen, Sprachmodul vorhanden, Wortstellungen bildbar (E-1008-14); Doku berichtigt, Engine-Kopfkommentare neutral (E-1008-15); Hinweis „je App ein eigenes Konto“ (E-1008-16). Neue Tests in `pruefen.mjs`.

## 8.10.2026 – Theorie-Tabellen schmaler (F-1008-1)
- Der Prüflauf auf GitHub war seit 24cac51 rot: „t13b: zu breit für 390 px (416 px)“. Ursache: GitHub rendert mit einer breiteren Schrift (DejaVu Sans) als die lokale Umgebung, darum war `pruefen.mjs` lokal grün.
- Vierspaltige Tabellen in t13 und t13b jetzt zweispaltig („talo | talossa · talosta · taloon“), t18b „joulu → jouluna | Hyvää joulua!“, in t18c die ausgeschriebenen Jahreszahlen und das 32-Buchstaben-Wort aus Tabelle/Tipp genommen. Nur `th` geändert, keine Vokabeln/Übungen.
- Kontrolle: mit DejaVu Sans passen alle Themenseiten und Übungen auch in 360 px (30 px Puffer). Für neue Themen: Theorie-Tabellen höchstens 3 Spalten mit kurzen Zellen, keine sehr langen Einzelwörter.
- Satz ordnen mit mehreren richtigen Wortstellungen (F-1008-2, nutzt E-1008-6): 13 Übungen (t08d/11, t09b/14, t12/11, t12b/15, t13/12, t13b/10, t13c/10, t15/13, t16b/17, t18b/16, t18c/17, t19/13, t19b/16) haben jetzt gleichwertige Stellungen als Alternativen, z. B. „Menen töihin aamulla.“, „Annan siskolle lahjan.“ Nur natürliche Stellungen aufgenommen, die erste bleibt die Musterlösung.
- Prüfskript misst mit derselben Schrift wie GitHub (DejaVu Sans), damit die 390-px-Breitenprüfung lokal und in CI gleich ausfällt – t13b war lokal grün, in CI 416 px (E-1008-21). Gegenprobe: alter t13b-Stand fällt jetzt lokal auf.
- E-1008-5: Ein Thema unter 80 %, auf das ein gesperrtes Thema wartet, kommt spätestens nach 7 Tagen wieder (Plan und KI-Termin) – vorher bis zu 36–72 Tage Stillstand.
- E-1008-13: Gesamtanalyse höchstens alle 3 Tage und erst nach 5 Runden (nach 7 Tagen nach 1 Runde), Lernstand im Auftrag kompakt (Bericht bleibt vollständig); „Neue Übungen“ nur mit Wörtern von Thema und Voraussetzungen.
- E-1008-7: Lektionen aus `lektionen.json` liegen nicht mehr im Lernstand, sondern getrennt unter `<APP.id>-lektionen` (nie hochgeladen, nie in Kopien/Sicherungen); alte Stände werden beim Laden verschlankt, Fortschritt bleibt; Notfall-Version bettet die Lektionen ein. Rückweg: Branch `sicherung/vor-e1008-7`.
- E-1008-9: Deutsch als Lernsprache: Groß-/Kleinschreibung zählt (außer Satzanfang), lokal ohne KI, KI-Regel aus `SP.caseRule`, ebenso im Einstufungstest; Engine-Tests zusätzlich mit `tools/test-app-de.js`. Mit den Inhalten des Deutsch-Trainers geprüft.
- E-1008-22: Schwächen aus freien Antworten wirken auf den Plan: ≥ 2 KI-Treffer zu einem gelernten Thema seit dessen letzter Runde (14 Tage) → spätestens übermorgen fällig, höchstens 3 Themen, nur vorziehen; Grund auf „Heute“, Themenseite, Überblick und im Bericht; abschaltbar in den Einstellungen. Nichts Neues im Lernstand: berechnet aus `weak[]` und Verlauf, daher sync-sicher. Abweichung vom Vorschlag: der Vorzug endet nach jeder Runde des Themas (nicht erst ab 80 %) – unter 80 % plant der Algorithmus ohnehin kurz, sonst wäre das Thema direkt nach der Runde wieder „fällig“.
- E-1008-24: Simulationen laufen künftig in einem eigenen Chat unter Matthias' zweitem Konto (Codes S-…), damit sie das Limit der anderen Chats nicht verbrauchen. Übergabe in `docs/simulation.md`; der Chat ändert nur `tools/simulation.mjs` und `docs/simulationen/`, pusht nur auf Branches `simulation/…`, App-Fehler meldet er als Befund.
- E-1008-27: Simulation 8.10. vom Simulations-Chat übernommen (Branch `simulation/2026-10-08`, S-1008-1 bis -12): 180 Tage Opi suomea ohne Daten- oder Abgleich-Verlust, 52/52 Themen, alle Regeln aus E-1008-1 bis -22 halten; Deutsch-Trainer 10 Tage (Einstufungstest) in Ordnung. Befunde S1–S3:
- S-1008-15: Automatische Gesamtanalyse erst nach dem Start-Abgleich – das Handy analysierte vorher seinen tagealten Stand (11 doppelte Analysen in 180 Tagen).
- S-1008-16: Schwächen-Vorzug mit festem Platz: wer zuerst 2 Treffer hat, bleibt bis zur nächsten Runde vorgezogen; wartende rücken nach, ihr Termin zählt ab dem frei gewordenen Platz. Weiter ohne neues Feld im Lernstand (nachgespielt aus `weak[]` und Verlauf).
- E-1008-28: Gerätespeicher im Bericht, Warnung ab 3 Mio. Zeichen in Bericht und Einstellungen; bei vollem Speicher zuerst den Lektions-Zwischenspeicher opfern. S-1008-14 (nur eine Sicherheitskopie) bewusst nicht – jede Kopie schützt einen anderen Fall; S-1008-13 (IndexedDB) für später vorgemerkt.

## 8.10.2026 – Prüfung der Lehrinhalte umgesetzt (S-1008-24 bis -72, F-1008-3, F-1008-4)
- Grundlage: Prüfbericht des Simulations-Chats (Branch `pruefung/2026-10-08`, 0 kritisch, 15 mittel, 34 niedrig). Jeder Befund wurde vom Inhalts-Chat nachgeprüft; Matthias hat alle Empfehlungen freigegeben.
- Umgesetzt: Erklärungen, die zu falschem Finnisch führen konnten (kukaan/joku, Komposita in der Vokalharmonie, Partitiv-Verben, kun/jos, tyttö in 11.2), Stoff vor seiner Einführung (kurz in der Theorie), neue Karten nur für Wörter ohne Karte (jos, joku, jotain, liian, lähteä, moneltako, tyttöystävä, hyvää syntymäpäivää), Kommas vor ja/enkä, kleinere Präzisierungen, fünf Notizen im Antipp-Wörterbuch, Planung vor t20 in `abdeckung.md` und `entwuerfe-bis-b1.md`.
- F-1008-3: Keine doppelten Wortkarten. Die App führt gleiche Wörter aus verschiedenen Themen nicht zusammen; eine zweite Karte hieße doppelter Lernaufwand und getrennte Wiederholungspläne. Wörter, die früher gebraucht werden als ihre Karte kommt, stehen deshalb im früheren Thema nur in der Theorie.
- F-1008-4: In `js/inhalte.js` (t01–t08, GLOSS_EXTRA) ausnahmsweise bestehenden Text korrigiert – nur Text, keine Indizes oder Reihenfolgen; der doppelte, wirkungslose `nimeni`-Eintrag ist entfernt.
- Nicht umgesetzt: S-1008-32/-33 (Wörter stehen schon in den Theorie-Tabellen und haben später Karten), S-1008-45 (keine Änderung nötig), S-1008-73 (gehört dem Funktionen-Chat).
- S-1008-73: `tools/pruefen.mjs` warnt bei neuen/geänderten Themen, wenn eine Übung ein Wort verlangt, das bis dahin in keiner Wortliste steht (Antipp-Wörterbuch der App + Stammabgleich ab 5 Buchstaben, nur Warnung, mit Selbsttest). Anlass: Lehrinhalte-Prüfung 8.10. (S-1008-27, -31, -32, -46, -49, -60); alle dort genannten Wörter in eigenen Antworten werden erkannt; tehdä/lähteä kommen nur in Aufgabentexten vor (Multiple Choice, Zeilen des Gegenübers, Lesetext, vorgegebene Wörter) – die Prüfung betrachtet bewusst nur Musterlösungen.

## 8.10.2026 – Wortprüfung abgearbeitet (F-1008-5)
- Grundlage: neue Wortprüfung in `pruefen.mjs` (S-1008-73, E-1008-29). Drei Gruppen: gewollte Formen aus Theorie-Tabellen (bleiben), Wörter nach F-1008-3 nur in der Theorie (bleiben), echte Lücken (behoben).
- Behoben: Theorie-Kasten „Wörter, die du hier schon brauchst“ in 1.2, 3.2, 4.2, 8.2, t10, 11.3, 13.2, 16.3, t18, 18.2, 19.3; neue Karten *nähdään, tähän, niin, uusi, viesti* und die neun fehlenden Monatsnamen in t18 (die Monatstabelle fragte alle zwölf ab, nur drei hatten Karten); `vähän` in GLOSS_EXTRA (t06 steht im Code); 19.3 Musterlösung *aamupalaa* → *aamiaista* (Wort aus 9.2). Entwürfe t21/t23: *uusi, viesti* als Wiederholung.
- S-1008-88: Themenplan bis B1 des Simulations-Chats als Kontrollliste übernommen (`docs/pruefungen/2026-10-08-themenplan-bis-b1.md`, Branch `pruefung/themenplan-2026-10-08`, Stand a16c452) – reiner Plan, App, Lektionen und Engine unverändert.

## 8.10.2026 – Sechs A1-Unterthemen, Vorschau Kongruenz, Unterthemen-Plan A2 (F-1008-6 bis -8)
- Grundlage: Themenplan bis exklusive B1 des Simulations-Chats (`docs/pruefungen/2026-10-08-themenplan-bis-b1.md`), Matthias' OK zu S-1008-85, -87, -92.
- F-1008-6: 2.3, 4.3, 12.4, 16.5, 17.4, 18.4 angelegt. `req` wie bei den Geschwister-Unterthemen (nur Hauptthemen); 2.3 zusätzlich `req` für t13 (die App sperrt schon freie Themen nicht wieder). Abweichungen vom Plan: *kengät* und *herätä* ohne neue Karte (kenkä 1.2, herään 9.2); *Olen kadottanut lompakkoni* (17.4) nur als feste Wendung, weil Perfekt und -ni erst in A2 kommen; *loukkaantunut* statt *loukkaantua* als Karte (so braucht man es auf A1); dazu *suuri*, *valo*, *lompakko*, *sadetakki*.
- F-1008-7: 13.2 hinten Vorschau *isossa talossa, uudessa asunnossa*.
- F-1008-8: `entwuerfe-bis-b1.md` mit Unterthemen-Tabelle t20–t35, verschobenen B1-Teilen (Reparaturen → 32.2, Bindewörter → 28.3, Meinung → 34.3) und „normal üben“ für joka, Passiv Vergangenheit, Plural-Genitiv; `abdeckung.md` mit allen Lücken aus Abschnitt 7.2.
- Doppelte Karte gefunden: *nähdään* (2.2, F-1008-5) und *nähdään!* (t09) – die Prüfung auf Dubletten verglich ohne Satzzeichen-Abgleich. 2.2-Karte zu *nähdään pian!* geändert. Ältere Doppelungen aus der Zeit vor dem Chat-Wechsel (suomalainen, hotelli, tässä, matkustaa, ruoka, kuuma) bleiben, weil Karten nicht gelöscht werden dürfen.

## 8.10.2026 – Token sparen, Schritt 1 (E-1008-30: S-1008-97, -98, -99, -104, -105, -106, -107)
- Nur Dokumente, nichts gelöscht: ältere Teile wörtlich nach `docs/archiv/` (Index `docs/archiv/README.md`), Zeichenzahl geprüft; Sicherung `sicherung/vor-token-sparen`.
- Startdatei je Chat in `docs/chats/` (Spalte in `CLAUDE.md`), `CLAUDE.md` mit Abschnitt „Tokens sparen“; dieses Protokoll nur noch anhängen.
- Alte Pfade in historischen Texten bleiben wörtlich (Zuordnung im Archiv-Index); `docs/simulation.md` ist ein Wegweiser.

## 8.10.2026 – Inhalts-Dokumente verschlankt (S-1008-98, -100, -101, -107; F-1008-9 bis -11)
- Sicherung `sicherung/vor-lehrplan-archiv`. Startdatei `docs/chats/inhalte.md`; alte Übergabe, Lehrplan-Verlauf (Tabelle t09–t19, Stand) und doppelte Abdeckungstabelle wörtlich in `docs/archiv/` (Zeichenzahl geprüft).
- `lehrplan.md` von ~20.000 auf ~6.900 Zeichen: Regeln als Kurzliste, Unterthemen-Liste, „Wo steht Matthias“, Erinnerungen. `abdeckung.md` ist Master „Baustein → Thema“ (7 fehlende Zeilen vorher ergänzt), Entwürfe nur Detailplanung; Themenplan als „übernommen“ markiert.

## 8.10.2026 – Werkzeug „ein Thema lesen“ (E-1008-32: S-1008-103, S-1008-107)
- `tools/thema.mjs <id…>`: Theorie, Wörter, Übungen mit Index und mc-Lösung kompakt als Text, für beide Apps (Engine-Datei); Test mit den Test-Inhalten. Sicherung `sicherung/vor-thema-werkzeug`.

## 8.10.2026 – Themen nur noch per Werkzeug lesen (S-1008-103, F-1008-12)
- Regel in `lektionen/README.md`: `lektionen.json` nie ganz öffnen, Themen mit `node tools/thema.mjs tNN` lesen; Startdatei `docs/chats/inhalte.md` angepasst.

## 8.10.2026 – Prüfskript aufgeteilt (E-1008-33: S-1008-102, S-1008-107)
- `tools/pruefen.mjs` nur noch Aufruf und Reihenfolge; Prüfungen in `tools/pruefen/*.mjs` (9 Module), gemeinsame Werte im Objekt `P`. Reiner Umzug per Skript (Parser für gemeinsame Variablen), Ausgabe vorher/nachher gleich (nur eine Zeitangabe in ms anders), Deutsch-Trainer-Inhalte lokal grün. Sicherung `sicherung/vor-pruefen-aufteilen`.

## 8.10.2026 – Token-Bericht und Simulations-Übergabe übernommen (E-1008-34: S-1008-109)
- `docs/pruefungen/2026-10-08-token-effizienz.md` (Bericht, Fahrplan umgesetzt) und neue `docs/simulationen/uebergabe.md` von den Branches des Simulations-Chats übernommen; nur Dokumente.

## 8.10.2026 – Prüfbericht Lehrinhalte als Nachweis übernommen (S-1008-110)
- `docs/pruefungen/2026-10-08-lehrinhalte.md` vom Branch `pruefung/2026-10-08` (nur diese Datei); vorher auf private Daten geprüft – nur Codes, Befunde und öffentliche Quellen.

## 8.10.2026 – Qualität je Modell im Bericht (E-1008-43)
- Für den Anbieter-Test (E-1008-42, OpenRouter: Gemini 3 Flash vs. Claude Haiku): `S.aiStats[Gerät].mm` zählt je Modell Aufrufe, Fehler, Token, Urteile richtig/falsch und ⚑ über alle Aufrufe; Bericht „QUALITÄT JE MODELL“. KI-Protokoll mit mehr Beispielen (25 je Art, 150 gesamt, ⚑ bis 50). Kein neues Feld auf oberster Ebene, Sync unverändert (je Gerät).

## 2026-10-08 – Idee Tastatur-Vorschläge abschalten (E-1008-47)
Nur in `docs/ideen.md` gesammelt (Sparflamme): Eingabefelder ohne Autokorrektur/Vorschläge; sicher nur über die iOS-Einstellungen.

## 2026-10-08 – Idee akzeptierte Vokabel-Antworten lernen (E-1008-48)
Nur in `docs/ideen.md` gesammelt (Sparflamme): von Opettaja akzeptierte Antworten merken, im Bericht prüfen, in die Vokabelliste übernehmen.

## 2026-10-08 – Vorlesen in allen Tabellenspalten (E-1008-51)
Theorie-Tabellen mit `class="sayall"` bekommen in jedem Kästchen einen Vorlese-Knopf (sonst nur erste Spalte, `nosay` keinen). Anlass: Buchstaben-Tabelle in t01b (beide Spalten finnisch); Markierung setzt der Inhalts-Chat. „nur Übung“ bleibt (E-1008-49/-50 nicht gewählt).

## 2026-10-08 – Idee Klammern verraten die Lösung (E-1008-56)
Nur in `docs/ideen.md` gesammelt: finnische Formen in deutschen Klammern bei Deutsch → Finnisch ausblenden. Ebenfalls weitergeleitet an den Inhalts-Chat: t01b-Übung „Mein Vorname ist …“ fragt ungelehrtes -ni ab.

## 8.10.2026 – 1.2: Vorlesen in der Buchstaben-Tabelle, „mein Name“ erklärt (F-1008-13, F-1008-14)
- Buchstaben-Tabelle in t01b mit `class="sayall"` (E-1008-51). Theorie-Kasten *Minun nimeni / Etunimeni / Sukunimeni on …* (-ni = mein, feste Wendung), Hinweis an Übung 8; keine neue Karte (minun nimeni on in t11).

## 2026-10-08 – Paket A „Nichts verraten“ (E-1008-57)
Antwortfelder mit `autocorrect="off"` (Prüfskript erzwingt es); Rückwärts-Karten verdecken Klammern/„:“-Teile mit Wörtern gleichen Anfangs wie die Lösung bis zum Aufdecken (`promptNoSpoiler`); „Verwende: …“ der Schreibaufgaben hinter „💡 Wörter zeigen“.
Offen zur Wahl: E-1008-58 (Paket B), -59 (Paket C), -60 (Teilpunkte nur Anzeige), -61 (Tageslimit für Themen-Runden).

## 2026-10-08 – Pakete B und C (E-1008-58, E-1008-59, mit E-1008-62)
B: `S.slips` zählt fehlende ä/ö (SP.loose) und „Nur vertippt“ (Knopf statt KI bei einer Nachbartaste/Vertauschung, nie in den letzten zwei Buchstaben, nicht bei strengen Übungen); Bericht „AUSRUTSCHER“. Stimme in Einstellungen wählbar (`CFG.voice`, gerätelokal).
C: `S.vocAlt` merkt von der KI anerkannte Vokabel-Antworten (danach ohne KI „vorläufig richtig“, ⚑ verwirft); Bericht „VOKABEL-ANTWORTEN ZUR PRÜFUNG“, Urteil als `va:<Karte>:<Antwort>` in `ki-pruefung.json`. Sicherung: `sicherung/vor-e1008-58`.

## 2026-10-08 – CLAUDE.md: neue Bericht-Abschnitte im Ablauf (E-1008-63)
Schritt 2 nennt jetzt „VOKABEL-ANTWORTEN ZUR PRÜFUNG“ (Urteil `va:<Karte>:<Antwort>` in `ki-pruefung.json`) und „AUSRUTSCHER“. Deutsch-Trainer-Chat gebeten, das für dessen `CLAUDE.md` vorzuschlagen.

## 2026-10-08 – Idee „Noch nicht gelernt?“ (E-1008-64)
Nur in `docs/ideen.md` gesammelt (Sparmodus): Übungen markieren, die Ungelerntes abfragen; Prüfung über den Bericht.

## 9.10.2026 – Dialoge natürlicher machen: zurückgestellt (F-1008-15)
- Matthias: vorerst nicht umsetzen, als Idee in `docs/chats/inhalte.md` gesammelt (Prüfung aller dlg/les auf Natürlichkeit, siehe dort).

## 2026-10-09 – Gegenlese-Funktion als Idee gesammelt (E-1009-1)
- Die Gegenlese-Funktion (E-1008-65/-66) steht als Idee in `docs/ideen.md`, mit Verweis auf „Dialoge natürlicher machen“ in `docs/chats/inhalte.md` (F-1008-15). Nur Doku, kein Code.

## 2026-10-09 – „Noch nicht gelernt?“ an Übungen (E-1008-64, E-1009-3)
- Link unter jeder Lektions-Übung meldet Aufgaben, die Ungelerntes abfragen (`S.unlearned`, synchronisiert). Bericht-Abschnitt „NOCH NICHT GELERNT?“ für den Inhalts-Chat.
- E-1009-3 statt E-1009-2: Fehler dazu fehlen im Fehler-Training und zählen nicht als Schwäche; das Rundenergebnis bleibt, die Freischaltung also streng. Zurücknehmen stellt alles wieder her.

## 2026-10-09 – CLAUDE.md: „NOCH NICHT GELERNT?“ in der Auswertung (E-1009-4)
- Schritt 2 nennt jetzt den Bericht-Abschnitt „NOCH NICHT GELERNT?“: Theorie/Vokabel ergänzen oder Übung anpassen.

## 9.10.2026 – Meldungen „Noch nicht gelernt?“ (F-1009-1)
Der neue Bericht-Abschnitt „NOCH NICHT GELERNT?“ (E-1008-64/E-1009-3) wird bei jeder Auswertung bearbeitet: fehlende Theorie oder Vokabeln ergänzen oder die Übung anpassen (nur anhängen). Als offener Punkt in `docs/chats/inhalte.md` vermerkt.

## 9.10.2026 – Auswertung nach Wechsel auf OpenRouter (F-1009-2)
Erinnerungen F-1007-11 (Mischbetrieb Gemini/Claude API) und „Gemini-Kontingent schonen“ durch „Modellvergleich je OpenRouter-Modell, Token/Kosten beobachten, nach 2–3 Berichten Empfehlung je Aufgabe“ ersetzt (`lehrplan.md`, Startdatei). `ki-qualitaet.md`: Wechsel vermerkt, ältere Zeilen = Gemini direkt.

## 9.10.2026 – Auswertung Bericht 9.10. (F-1009-3, F-1009-4, F-1009-5)
`ki-pruefung.json`: Vokabel-Alternative „ei kostin hyvin“ als falsch (Tippfehler). 35 neue Übungen in t01–t09, t01b, t02b (Vokallänge, neutrale Vokale, he/se, en aja/en ole, -ko, Wochentage, Kiitos samoin/Entä sinulla), Merkhilfen in t05 und t09, weitere richtige Antworten in t09-Dialogen, Glosse „aja“. Befunde zu Tippfehler-Toleranz, Vokabel-Alternativen, „topicId“ und Sync an den Funktionen-Chat.

## 2026-10-09 – Befunde aus dem Bericht vom 9.10. (E-1009-5 bis -8)
- E-1009-5: Tippfehler = genau ein Buchstabe; im Finnischen ist ein fehlender/zusätzlicher Doppelbuchstabe (Länge) falsch, kein Tippfehler. E-1009-6: Vokabel-Urteil mit „typo“ – solche Antworten zählen als Ausrutscher, nicht als anerkannte Alternative.
- E-1009-7: Gesamtanalyse-Auftrag eindeutig (nur Themen-IDs, days 1–60), ungültige Termine im KI-Protokoll als „ungültig“.
- E-1009-8: Sync-Abbrüche im Hintergrund oder bis 5 s nach der Rückkehr (iOS „Load failed“) nicht mehr als App-Fehler; Wiederholung unverändert, keine Datenverlust-Gefahr.

## 9.10.2026 – Neuer Inhalts-Chat (Wunsch von Matthias)
Inhalts-Chat session_01JzrEfnqnC1AnKhF6FkbjyW geschlossen, Nachfolger session_01Qt52MWJw4FDPSysStkj8At. Übergabe vollständig in `docs/chats/inhalte.md` (Stand, Codes bis F-1009-5, offene Punkte, Session-IDs, Arbeitsregeln).

## 2026-10-09 – „Nur vertippt – trotzdem als richtig werten“ (E-1009-10)
- Link unter falschen Antworten mit Eingabefeld, nur bei höchstens 2 Buchstaben Abstand zu einer Musterlösung, nicht bei strengen Übungen/Satz ordnen. Wertung, Wiederholung, Fehler-Training und Statistik werden zurückgenommen.
- Kontrolle über den Bericht (AUSRUTSCHER „Trotz Fehler selbst als richtig gewertet“). E-1009-11 (ohne Abstandsgrenze) nicht gewählt.

## 9.10.2026 – Lücken in t05 eindeutig (F-1009-6)
Sechs Endungslücken in t05 (ravintola, kirjasto, hotelli, Wien, Linz, Graz) hatten keine Bedeutung im Hinweis; jeder Kasus war denkbar (Meldung: „kirjastona“ als richtig gewertet). Hinweis ergänzt („– in der Bibliothek“ usw.). KI-Bewertung anderer Kasus an Funktionen-Chat gemeldet.
## 2026-10-09 – Endungs-Lücken streng (E-1009-12)
- Anlass: „kirjastona“ bei `kirjasto___` (-ssa) von der KI als richtig gewertet. Ganzes Wort wird auf die Endung gekürzt (richtig mit Hinweis, falsche Endung ohne KI falsch), die KI bekommt den richtigen Satz und die Regel „nur genau diese Form“.
- Alternative richtige Endungen gehören deshalb in `a` (Hinweis in `docs/uebungsformate.md`). E-1009-13 (nur KI-Regel) nicht gewählt.

## 2026-10-09 – Strenge Form-Regel für alle Lücken (E-1009-14)
- Lückentexte: KI wertet nur dieselbe grammatische Form wie die Musterlösung als richtig (Fall, Person, Zeit, Zahl); Hinweis `h` geht als „Gesucht ist: …“ in den Auftrag. Vorschlag des Inhalts-Chats.

## 9.10.2026 – Lücken-Hinweise klar, ohne Lösung (F-1009-7/-8)
Alle 279 Lücken geprüft. 42 Hinweise in lektionen.json geändert: Bedeutung statt Bau-Rezept („pulla + n“, „Wochentag + -na“, Endungen wie -lle/-lla entfernt; Stufenwechsel-Hinweise bleiben). Gleichwertige Lösungen ergänzt (t15 pitää, t18 lämmintä, t09c tulee), da die KI seit E-1009-14 nur die Form der Musterlösung gelten lässt.

## 2026-10-09 – Prüflisten für alle Chats (E-1009-15, E-1009-16)
- `docs/pruefliste-engine.md` mit den Lehren der Engine (Prüfen, Beispiel, Code, Test), vor jedem Push durchzugehen; neue Meldungen = neue Zeile.
- `CLAUDE.md`: Abschnitt „Prüflisten und Qualität (alle Chats)“ mit Verweis auf die Listen jedes Chats und Quellen-Gegenprüfung neuer Inhalte. Wunsch von Matthias über den Inhalts-Chat.

## 9.10.2026 – Prüfliste für Lerninhalte (F-1009-10)
Neue `lektionen/pruefliste.md` (9 Punkte, u. a. natürliches/korrektes Finnisch mit Quellen gegenprüfen, eindeutige Lücken, alle Lösungen in `a`, Länge) als Pflichtlektüre in `docs/chats/inhalte.md`. Jede Meldung von Matthias ergibt eine neue Zeile; Engine-Liste und CLAUDE.md-Abschnitt kamen vom Funktionen-Chat (E-1009-15/-16).

## 2026-10-09 – Prüfliste: Regeln für App-KI und Aufteilen (E-1009-17)
- Lehren, die die KI in der App betreffen, kommen zusätzlich in deren Auftrag (mit Test) – Opettaja liest die Prüfliste nicht. Prüfliste erst ab ca. 60 Zeilen nach Bereichen aufteilen.

## 2026-10-09 – Funktionen-Chat umgesiedelt
- Startdatei `docs/chats/funktionen.md` vollständig neu (Stand 9.10., offene Codes, Routinen, Quellen, bewährter Ablauf Engine-Push, Abschnitt „Beim Umsiedeln“). Regel für alle Chats in `CLAUDE.md` als E-1009-18 vorgeschlagen.

## 2026-10-09 – Regel „Umsiedeln“ für alle Chats (E-1009-18)
- `CLAUDE.md`: Startdatei vor jedem Wechsel vollständig neu (feste Liste), Nachfolger legt der Chat selbst an (`create_session`), der Nachfolger archiviert den alten Chat. Grenze 8 Generationen; Simulations-Chat siedelt Matthias um.

## 2026-10-09 – Jede Änderung mit Quellen prüfen (E-1009-26)
- `CLAUDE.md`, „Prüflisten und Qualität“: Quellen-Gegenprüfung gilt für jede Änderung (auch Korrekturen, `ki-pruefung.json`, `GLOSS_EXTRA`, Sprachregeln im Code); Meldung nennt Quellen bzw. „eigenes Wissen“.
- `docs/pruefliste-engine.md`: Zeile „Sprachregeln im Code nur mit Quelle“.

## 10.10.2026 – Quellenpflicht in der Prüfliste, Nachprüfung F-1009-8 (F-1009-11)
Prüfliste Zeile 10: jede Änderung mit Quelle, Meldung nennt Quelle bzw. „eigenes Wissen“ (E-1009-26). Nachgeprüft: *pitää* = müssen (KS pitää 17), *Juna tulee klo 9* (KS tulla) ✓; *Kesällä on lämmintä*: KS zeigt nur *on lämmin*, fi.wiktionary nutzt *jossa on lämmintä* – bleibt als Alternative, Musterlösung *lämmin*.

## 2026-10-10 – Einstufungstest-Import repariert (E-1010-2)
- `ptImport`: Lücken-Antwort (`first`) als Text wie in der App (Liste wird umgewandelt), `null` = leere Lücke, älteres Format ohne `g`/`raw` übernommen (ok bzw. falsch mit Korrektur = fertig bewertet). Anlass: Auroras Export vom Claude-Testblatt (Meldung des Deutsch-Trainer-Chats, D-1010-6).
- Test in `tools/pruefen/durchlauf.mjs` (Gegenprobe: alter Code → 4 Meldungen); Zeile in `docs/pruefliste-engine.md`.

## 2026-10-10 – Sync robuster bei genauen Zeitstempeln (E-1010-3)
- `pushCloud`: Vergleich mit der Cloud auf die Millisekunde (`updated_at=gte…&lt…+1 ms`) statt exakt gleich; Zeitstempel über `pgMs` (Mikrosekunden gekürzt). Mit Mikrosekunden in der Cloud scheiterte bisher jeder Upload („Sync-Konflikt“, Deutsch-Trainer am PC).
- „Sync-Konflikt (…)“ nennt im Fehlerprotokoll den Grund je Versuch. Nachgebaute Supabase kann Mikrosekunden (`db.micro`), Test in `sync.mjs` mit frischen Geräten (Gegenprobe: alter Code lädt nichts hoch). Sicherung: `sicherung/vor-e1010-3`.

## 2026-10-10 – Sync: Ausweichweg, wenn die Cloud Änderungen still nicht übernimmt (E-1010-4)
- Deutsch-Trainer am PC: Supabase-Zeile seit der Einrichtung unverändert, PATCH mit passendem Zeitstempel ohne Wirkung (Policies, Rechte, Spaltentyp geprüft – alles korrekt). `pushCloud` macht dann eine Prüfabfrage („Zeile gefunden/nicht gefunden“ im Fehlerprotokoll) und speichert über den vorhandenen Ausweichweg (prüfen/zusammenführen, POST mit `on_conflict`).
- Bereits eingearbeiteter Cloud-Stand gilt im selben Durchgang nicht erneut als „geändert“; `sbFetch` gibt Code und Kurztext der Cloud-Meldung mit. Test `casSilent` in `sync.mjs` (Gegenprobe: alter Code → genau Matthias' Meldung). Sicherung: `sicherung/vor-e1010-4`.

## 2026-10-10 – „Nur vertippt“ umschaltbar, gezählt erst bei „Weiter“ (E-1010-5)
- Link „Nur vertippt – trotzdem als richtig werten“ und Knöpfe im Fenster „Nur vertippt?“ markieren nur; nochmal tippen nimmt zurück („doch falsch“ / „doch nur vertippt“). Gezählt (`typoCommit`) bei „Weiter“, beim Verlassen der Runde und wenn die App in den Hintergrund geht. Wunsch von Matthias.
- Tests in `befunde.mjs` (ein/aus/ein, aus Versehen zurückgenommen, Verlassen), drei Gegenproben. Sicherung: `sicherung/vor-e1010-5`.


## 10.10.2026 – Automatische Auswertung des Fortschritts (F-1010-1)
Matthias wünscht, dass der Inhalts-Chat den Bericht selbst ausliest und täglich die vollständige Auswertung macht (wie bei eingefügtem Bericht, inkl. Opettaja-Analyse). Auftrag für Bericht in Supabase, Lesezugang und Leseskript an den Funktionen-Chat. Danach tägliche Routine; Push weiterhin nur nach OK, Bericht nie ins Repo.

## 2026-10-10 – Bericht für Claude automatisch in die Cloud (E-1010-6)
- Auf Wunsch des Inhalts-Chats (F-1010-1): Schalter in den Einstellungen; die App legt den „Bericht für Claude“ in die Supabase-Tabelle `berichte` (ein Eintrag je Tag, höchstens alle 30 min, 30 Tage). `tools/bericht-holen.mjs` liest ihn mit einem eigenen Lese-Konto (nur Konsole). Vorerst nur Opi suomea (E-1010-7: nein).
- `supabase-wach-halten.yml` prüft auch `berichte` (ohne Anmeldung weder lesen noch schreiben). Test in `sync.mjs` mit nachgebauter Cloud; Gegenprobe (ohne Schalter-Prüfung) schlägt an. Sicherung: `sicherung/vor-e1010-6`.

## 11.10.2026 – Startwert Effort „high“ (F-1011-1)
`.claude/settings.json` mit `effortLevel: high` als Startwert für neue Sitzungen dieses Repos (vor allem die automatischen Auswertungs-Sitzungen). In jedem Chat bleibt /effort frei wählbar. Funktionen-Chat ohne Einwand.

## 2026-10-11 – Sparflamme (Matthias)
- Funktionen-Chat sammelt neue Wünsche nur noch in `docs/ideen.md` (nicht prüfen, nicht bauen), bis Matthias die Sparflamme aufhebt.

## 2026-10-12 – Umsiedeln Funktionen-Chat (Generation 4)
- Startdatei neu geschrieben (Stand 9.–12.10., Themenliste zum einzelnen Vorschlagen, Termine, Abläufe). „Noch nicht gelernt?“ im Rundenergebnis als Fehler bestätigt, bleibt auf der Ideenliste (E-1012-1 vorbereitet).

## 2026-10-12 – Token-Sparpaket aus der Token-Analyse (T-1012-9 bis -22, OK Matthias)
- Settings: Effort `medium` (löst F-1011-1 ab), `autoCompactWindow` 200.000; Chats kurz halten, Umsiedeln ab `/context` > 150.000; Verwaltung ohne Rückfrage (Nr. 12). CLAUDE.md 15,9 → 11,9 KB: Ablauf → `docs/chats/inhalte.md`, App-Technik → `docs/chats/funktionen.md`, Weiterleiten/Umsiedeln → `docs/chats/regeln.md`, Session-IDs → `docs/chats/sessions.md`.
- Werkzeuge: `pruefen.mjs` Kurzmodus (`--lang`, CI voll), `tools/ci-status.mjs`, `tools/quellen.mjs`, Prüflisten-Punkte 6/8/9 als Hinweis (Ausnahmen: `lektionen/pruef-ausnahmen.json`); Auswertung über Starter-Sitzung (`lektionen/auswertung-starter.md`). Analyse: Branch `claude/language-app-token-analysis-b75s4a`, `docs/token-analyse/`.

## 2026-10-12 – Offene Themen durchgesprochen (E-1012-1 bis -27)
Matthias hat alle offenen Funktionen-Themen einzeln entschieden: alle bleiben auf der Ideenliste (Pläne mit Codes dort), Sprachausgabe in besserer Qualität verworfen (E-1012-12). E-1008-40 (Ausweich-Modell) wird mit dem KI-Test-Bericht am 14.10. entschieden.

## 2026-10-12 – Prüfung Deutsch-Inhalte übernommen (E-1012-28 bis -30)
- Prüfdateien des Simulations-Chats (`docs/pruefungen/deutsch/`, S-1011-13) nach `main` übernommen, Branch gelöscht.
- `pruefen.mjs`: Hinweis bei `ord` mit Nebensatz und nur einer Lösung (S-1011-12) – trifft 9 Aufgaben im Deutsch-Trainer.
- Einstufungstest-Korrekturen (S-1011-19 Nr. 1–6) auf die Ideenliste, vor einem zweiten Test umzusetzen; Lehren in der Prüfliste.

## 10.10.2026 – Automatische Auswertung Bericht 10.10. (Branch auswertung/2026-10-10-2304)
- Erste Auswertung durch die Auswertungs-Sitzung (F-1010-3): 44 neue Übungen in t01–t09, t01b, t02b, t02c (Schwerpunkte Mitä kuuluu/Miten menee, Doppelbuchstaben, „en ole“ nur bei olla, Wochentage, Typ-1-Verben), Glosse „katsoo“.
- `ki-pruefung.json` unverändert (keine KI-Übungen/Vokabel-Antworten zur Prüfung). Übernahme auf main erst nach F-Code und OK von Matthias.

## 13.10.2026 – Auswertung Bericht 12.10. (F-1013-A1)
- 40 neue Übungen in t01–t09 (Schreibweise ä/a, Doppelbuchstaben, kuinka monta/pari, ei haittaa, rakastaa + Partitiv, he eivät); 8 Urteile in ki-pruefung.json.
- Lehrplan-Stand 12.10. (t08 Rückschritt 63 %, t02b/t03b schwach); KI-Qualität ergänzt.
- „Schwächen nach Thema“: 3 Berichte – E-1007-8 so nicht umsetzen, Tippfehler verzerren die Zuordnung (F-1013-A3).

## 13.10.2026 – t06-Hinweis und Schwächen nach Thema (F-1013-A2, F-1013-A3)
- t06 „Ich liebe Finnland.“ bekommt den Hinweis „wie bei puhua: Suomi bekommt die a-Endung“ (Partitiv nach rakastaa, KS *rakastaa*).
- E-1007-8 (Themen nach „Schwächen nach Thema“ vorziehen) wird zurückgestellt: Tippfehler landen bei t01/t05; erst wieder prüfen, wenn die KI Tippfehler sauber trennt.

## 13.10.2026 – Auswertung 12.10. archiviert (F-1013-A1)
- Startdatei `docs/chats/inhalte.md` auf Stand 13.10. (F-1010-8 erledigt, Analyse 12.10., Codes F-1013-A1–A3).
- `auswertung-auftrag.md`: bei Branch mit Merge-Commit `git merge origin/main` statt Rebase (alte Konflikte würden erneut abgespielt).

## 2026-10-13 – Prüfbericht 12.10. umgesetzt (F-1013-1 bis -5)
- `req` t17c +t16d, t17d +t16c; Kästen mit schon gebrauchten Wörtern in t02c/t04c/t05b/t08d; 27 Glossar-Einträge für Dialoge (t02c, t12d, t16e, t17d, t18d).
- Alle Grammatikthemen haben ≥ 2 Regelfragen mit `x` (Erklärungen ergänzt, 3 neue mc hinten angehängt); Vokabelthemen t11b/t14b und gewollte Doppel/Spalten in `lektionen/pruef-ausnahmen.json`.
- Kleinkorrekturen: kaksoisvee (Kotus), 3 Hinweise ohne Bau-Rezept, t16d „kenet“, t09#26 umformuliert; Prüfliste Nr. 12 (`req`-Kette).

## 2026-10-13 – Befunde Engine-Prüfung und Simulation (E-1013-1)
Umgesetzt: Sync ohne Uhrvergleich (S-1012-121), Großschreibung nur in der Lernsprache (S-1012-122), KI-Urteile streng, NFC, 429/408 kein Abmelden, Serie bei Sommerzeit (S-1012-125 klein), ehrliches Löschen bei vollem Speicher (S-1012-126), Gesamtanalyse nicht doppelt (S-1012-105); je mit Test.
Übernommen: `tools/simulation.mjs` (W19–W21), Berichte in `docs/simulationen/` und `docs/pruefungen/` (S-1012-107). UI-Befunde und S-1012-130 in `docs/ideen.md`. Offen: E-1013-2, E-1013-3.
Offene Pakete: E-1013-2 = S-1012-123 (Selbstbewertung bei `dlg` und ohne KI), S-1012-124 Teil 2 (Merge: früheres `due`, `hist` vereinigen), S-1012-102 (deutsche Nomen antippen/prüfen), S-1012-125 Rest (Gerätekonfiguration bei vollem Speicher, SW-Rückfall, `ord`-Vorsorge). E-1013-3 = S-1012-104 (Kopien und Lektionsspeicher nach IndexedDB) + S-1012-124 Teil 1 (Kopien wiederherstellbar, `-vor-sync` mehrere Generationen).

## 2026-10-13 – Wertung, Zusammenführen, deutsche Nomen (E-1013-2)
Selbstbewertung auch bei Dialogen und ganz ohne KI (S-1012-123); Zusammenführen vereinigt `hist`, `best` als Maximum, bei Gleichstand früherer Termin (S-1012-124 Teil 2). Deutsch: „der Markt, die Märkte“ → „Markt“/„Märkte“ antippbar, Wortprüfung prüft Nomen statt sie als Namen zu überspringen (S-1012-102). Rest S-1012-125: Gerätekonfiguration bei vollem Speicher, SW-Rückfall „./“, Satz ordnen mit klein angezeigtem erstem Baustein. Offen: E-1013-3.

## 2026-10-13 – Offene Codes umgesetzt (F-1013-7 bis -11, F-1010-9/-10, F-1012-1/-2)
- Inhalte: t18c Jahreszahl nach Kotus-Gruppierung, t16e laituri/raide, t17c ex2, t04b ex5, t17b sattua; je eine `tab` in t03b/t07b/t08c/t10b/t11c/t14c/t15c; t12c „In der Stadt“ (Theorie + Lesetext). `lämmintä` in t18#6 bleibt (Ohjepankki „Predikatiivi“), Prüfliste Zeile 13.
- Auswertung läuft über die Starter-Sitzung `session_01P8hH2UZPLEjNNtHxbS4hzc` (T-1012-15); alter Wecker an den Inhalte-Chat gelöscht.
- F-1010-10 an den Funktionen-Chat übergeben (Schreibfehler getrennt zählen); F-1010-9 erledigt sich mit dem KI-Test-Bericht 14.10.

## 2026-10-13 – Automatische Berichtsauswertung abgeschaltet (F-1013-12)
- Auf Matthias' Wunsch: Wecker gelöscht, Starter-Sitzung archiviert. Berichte lädt er wieder selbst im Chat „Opi suomea (Lerninhalte)“ hoch; Auswertung nach „Typischer Ablauf“ in `docs/chats/inhalte.md`. `auswertung-starter.md`/`auswertung-auftrag.md` bleiben als Vorlage.

## 2026-10-13 – Simulations-Chat vorläufig Hauptchat (S-1013-25..-31)
Matthias' Hauptkonto am Limit: Der Simulations-Chat (Generation 2, `session_019eZRkq5orfkfFP6mnqNupE`) arbeitet alle offenen Punkte ab und darf auf `main` beider Repos pushen; andere Chats pausieren. Entschieden: S-1013-27 (Teilpunkte/Tageslimit bleiben Idee), S-1013-29 (Präteritum/Futur je Thema 2–3 Übungen), S-1013-31 (A2-Entwurf zuletzt). Einstufungstest abgeschlossen, keine Simulation ohne Zeichen. Startdatei + Rohdaten übernommen; Sicherung `sicherung/vor-s1013-grossauftrag`.

## 13.10.2026 – Prüfhinweise app-neutral, neue automatische Prüflisten-Punkte (S-1013-23)
`statisch.mjs`: Hinweise heißen nach Inhalt statt „Prüfliste 6/8/9“; neu: Varianten je Art les/sch/dlg (Mindestzahl über `APP.pruefVarianten`, nur Deutsch-Trainer 3), Verbkarten „to …“ mit Zeitformen, „Austria“ nur mit „Germany: …“. Groß/klein-Zwillinge in `a` nicht gemeldet – seit S-1013-7 findet die Bewertung den passenden Zwilling selbst, sie schaden nicht.

## 13.10.2026 – KI-Fehlermeldung mit Anbieter, Zahlentasten im Vokabeltrainer (E-1008-35, Ideenliste)
`aiErrText` nennt den eingestellten Anbieter (`aiProvName`) und hängt die Originalmeldung an (z. B. „402: Insufficient credits“); OpenAI-kompatible Dienste lesen dazu `error.message`. Vokabeltrainer: Leertaste deckt auf, Tasten 1–4 bewerten (Hinweis nur bei Maus/Touchpad). Tests in `ki.mjs`/`durchlauf.mjs`; beide Apps.

## 2026-10-13 – „Noch nicht gelernt?“ zählt nicht ins Rundenergebnis (E-1012-1)
- Gemeldete Übungen fallen aus dem Rundenergebnis (`record()` speichert `tid/ei`), Hinweis am Rundenende; bleibt nur Gemeldetes, gilt die Runde als 0 % (keine Freischaltung durch Melden). Test in `befunde.mjs`. Ideenliste: „Nomen mit Artikel“ war schon durch S-1012-102 erledigt.

## 2026-10-13 – Handy-Tippflächen (S-1012-117)
- Größere Tippflächen ohne Änderung des Aussehens (`app.css`, Block S-1012-117), Unterthemen-Nummern 12 px, Hinweis-Toast oben, wenn unten ein Eingabefeld liegt (`toast()` in `daten.js`). Deutsch-Trainer: `--kuusi` #2e7d4f → #2a7549 (Kontrast 4,4 → 4,9:1). Test in `durchlauf.mjs`, Nachmessung mit `ui-pruefung.mjs`.

## 2026-10-13 – Verbformen unter dem Wort (E-1013-4)
- Optionales 3. Element einer Vokabel `{f:[…]}`: Anzeige auf der Karte (umgekehrt erst nach Aufdecken) und in der Wortliste, nicht vorgelesen, im Antipp-Wörterbuch. Ohne Feld keine Änderung (Opi unverändert). Format: `docs/uebungsformate.md`; Test in `sprachen.mjs`.

## 2026-10-13 – Knopf „⚠ Fehler in der Übung?“ (E-1009-20)
Link unter jeder Lektions-Übung und am Ende der Theorie; kurzer Text → `S.exFlags[]` (synchronisiert, zurücknehmbar), Bericht-Abschnitt FEHLERMELDUNGEN (30 Tage). Wertung bleibt unverändert. Inhalts-Chats prüfen jede Meldung mit Quelle (Simulation-Chat als Hauptchat, S-1013-25).

## 2026-10-13 – Prüfvermerk je Thema (E-1009-23)
Statt Feld im Thema eine eigene Datei `lektionen/pruefvermerke.json` {id: {d, q, c, h}} (App lädt sie nicht, `lektionen.json` bleibt unberührt, DT-Format egal). Setzen: `node tools/thema.mjs --vermerk <id> --quellen "…" --chat F`. `pruefen.mjs` warnt (kein Fehler) bei neuem/geändertem Thema ohne Vermerk und bei veralteter Prüfsumme.

## 2026-10-13 – Opettaja wiederholt bestätigte Fehler nicht (E-1009-21)
`aiGenerate` schickt die jüngsten 5 ✗-Urteile des Themas (KI-Lösung → Korrektur, Grund) mit. Vokabeln: von Claude verworfene Antwort gilt beim nächsten Mal ohne KI-Anfrage als falsch (spart Kontingent); andere verworfene Antworten der Karte stehen im Bewertungsauftrag.

## 2026-10-13 – Hörmodus für Lesetexte und Satzdiktat (S-1013-19)
- Lesetexte mit Stimme: „🎧 Erst nur hören“ versteckt den Text und liest ihn vor; nach dem Prüfen ist er sichtbar. Vokabel-Tab: „Sätze diktieren“ (Sätze aus gelernten Themen in der Lernsprache aufschreiben, lokal tolerant geprüft, ohne KI).
- Ergebnis als `listen.d` je Gerät (optional, alte Stände laden weiter), im Bericht „Satzdiktat x/y“. Test: `durchlauf.mjs`, Negativprobe 4 ✗.

## 2026-10-13 – Neue Übungsformate luk und zuo (S-1013-20)
- `luk`: Lückentext mit mehreren `[Lücken]` im Text (Satzklammer, Artikel + Endung), ausgewertet wie Tabellen. `zuo`: Zuordnen per Auswahlliste; mehrfach vorkommende rechte Teile = Sortieren in Gruppen (der/die/das). Doku `docs/uebungsformate.md`; Inhalte können sie ab sofort verwenden (beide Apps).

## 2026-10-13 – Übungen ausblenden (S-1013-33)
- Neues Feld `aus: true` je Übung: Index bleibt, Übung kommt nicht mehr dran. Grundlage, um zu große Themen (zuerst Deutsch-Trainer d01/d02) in Unterthemen zu teilen, ohne Fortschritt oder IDs zu brechen (Matthias: „selbst entscheiden … gleiche Logik für jedes Thema“).

## 2026-10-13 – ki.js geteilt (S-1008-106)
- `js/ki.js` hatte 1.524 Zeilen (Grenze 1.500): Prüfung der KI-Übungen, Rundenauswertung und Gesamtanalyse nach `js/ki-auswertung.js` (lädt direkt nach `ki.js`; `index.html`, `sw.js`, `tools/engine-dateien.txt` ergänzt). Kein Verhalten geändert.

## 2026-10-13 – Deutsch-Trainer: gleiche Logik für jedes Thema (S-1013-34 bis -36)
- Im DT-Repo umgesetzt (DT `docs/entscheidungen.md`, f3c59f7): alle 18 Themen neu gegliedert, d01–d07 in Teilthemen d0xb geteilt (mit S-1013-33 `aus: true`), je Thema `zuo`/`luk`/Regelfragen, Prüfvermerke. Startdateien `funktionen.md`, `inhalte.md`, `simulation.md` §9 nachgeführt.

## 2026-10-13 – Prüfmodus (S-1013-37)
- Matthias: „Für Deutsch einen Admin-Modus einführen, damit ich alle Themen zum Prüfen freischalten kann.“ Umgesetzt als Prüfmodus in der Engine (beide Apps), Schalter in den Einstellungen, nur dieses Gerät: auch gesperrte Themen zeigen Theorie, Wörter und alle Übungen mit Lösung. Bewusst ohne echtes Freischalten, damit Auroras Lernstand und Freischaltung unberührt bleiben.

## 2026-10-13 – Verlaufsprotokoll (S-1013-39)
- Matthias: Protokoll des Lernstands nach jeder Analyse, um Fortschritt und neue Problemfelder zu sehen. `S.history` (synchronisiert, privat in der Cloud der Lernenden, nie im Repo): Eintrag nach Analyse/Langzeit-Check/wöchentlich; Karte „Verlauf“ und Bericht-Abschnitt VERLAUF mit Trend und neuen Schwächen. Neue Datei `js/verlauf.js`.

## 2026-10-13 – Zeitraster und Punkte-Regel verbunden (S-1013-41)
- Matthias: gekonnte Übungen zurückstellen, nach z. B. 2 Wochen wieder zeigen, Vorrat soll wachsen; „Zeitraster und Punkte-Regel verbinden“. Umgesetzt: 3× richtig → 14 Tage Ruhe, danach 30/60; ruhende −20 Punkte (nur Auffüllung), danach normale Punkte-Regel; Lern-/Freischalt-Runde unverändert; Coach-Nachschub bevorzugt für Themen mit < 8 nicht ruhenden Übungen.

## 2026-10-13 – Musterlösung auch bei richtiger Antwort (S-1013-42)
- Matthias: Beispiellösungen auch sehen, wenn die eigene Lösung laut Opettaja/Coach richtig war. Rückmeldung zeigt jetzt immer „Musterlösung“ (+ bis zu 3 „Auch richtig“); Tabelle, Lückentext und Dialog zeigen die Musterlösung klein unter abweichenden richtigen Feldern.

## 2026-10-13 – Selbst werten bei allen Übungen (S-1013-43)
- Matthias: „Nur vertippt“ öfter, bei allen Übungen – „ich entscheide, was ich als richtig werte“. Link nach jeder falschen Antwort (außer Auswahlformaten); ohne Fast-Treffer heißt er „Ich werte es als richtig“. Jede Selbstwertung im Bericht (AUSRUTSCHER) und im KI-Protokoll, damit Claude sie prüft.

## 2026-10-13 – Private Ablage der Auswertungen (S-1013-40) und Zahlentasten im Knopf
- Privates Repo `lernprotokoll-privat` (von Matthias angelegt): Auswertungen je App und Datum + `verlauf.md`; Regel in `CLAUDE.md` „Bericht auswerten“ und `docs/chats/inhalte.md`.
- Vokabelkarten: Zahl der Taste (1–4) sichtbar im Bewertungsknopf (nur mit Maus/Tastatur), Hinweistext angepasst (Matthias, Screenshot).

## 13.10.2026 – Auswertung Bericht 13.10. abends (S-1013-44 bis -46)
5 Vokabelurteile in `ki-pruefung.json` (alle ok). 39 neue Übungen in allen 13 gelernten Themen, auf Matthias' Wunsch fast nur Eingabe-Formate (luk, dlg, sch, tr) statt mc; t02 ex[12] „Hei hei!“ als Abschied. Prüfliste Nr. 14 (keine leichten mc mehr), Zeile in `ki-qualitaet.md`, Idee Dialogprüfung in `ideen.md`. Quellen: en.wiktionary.

## 13.10.2026 – Weniger Wiedererkennen, mehr neue Übungen (S-1013-47/-48)
Matthias: „immer dieselben Übungen, MC zu einfach“. S-1013-47: mc ruht schon nach 2× richtig und doppelt so lange (28/60/120 Tage), höchstens 2 mc je Runde (mehr nur zum Auffüllen). S-1013-48: KI-Übungen je Thema, sobald es sitzt (≥ 80 % + gefestigt), Mischung mit `luk` und ganzen Sätzen; geübt weiter erst nach Claudes Prüfung. CLAUDE.md Nr. 9 angepasst. Sicherung `sicherung/vor-s1013-47`.

## 13.10.2026 – Wörter schnell hinzufügen (S-1013-49)
Tab Vokabeln → Eigene Wörter: ein Feld für bis zu 20 Wörter (Komma/Zeile) in Basis-, Lern- oder anderer Sprache (z. B. Englisch); die KI liefert je Wort Lernsprache = Basissprache (Grundform), Liste zum Abhaken/Ändern, „Angehakte speichern“ legt normale eigene Wörter an (kein neues Feld). Hinweis „kommt schon im Kurs vor“, keine Doppelten. Beide Apps. Test + Gegenprobe; Sicherung `sicherung/vor-s1013-49`.

## 14.10.2026 – Lernschritte innerhalb eines Themas (S-1014-1)
Matthias: Themen zu groß. Neues optionales Feld `steps` (Theorie-Abschnitte + Übungen je Schritt): neue Themen werden Schritt für Schritt gelernt (ab 80 % nächster Schritt), danach normale Abschlussrunde; gelernte Themen unverändert. `S.topics[id].st/std`, Abgleich nimmt den weiteren Schritt. Tests + Gegenprobe, Inhaltsprüfung in `pruefen.mjs`. Sicherung `sicherung/vor-s1014-1`. Inhalte: Deutsch-Trainer d01–d09b, später neue Themen (Prüfliste).

## 14.10.2026 – Rundengröße (S-1014-3)
Matthias schlug 30 vor, Kompromiss angenommen: Wiederholung und Extra-Üben 20 Übungen (vorher 8), Freischalt-Runde 25 (vorher 15), erstes Lernen bleibt 15. Test in `durchlauf.mjs` angepasst (40 Übungen → 15/20/25).

## 14.10.2026 – Fehlerarten in der laufenden Analyse (S-1014-4)
Jede KI-Prüfung mit Fehler (Schreibaufgabe, Dialog, freies Schreiben, Rollenspiel, Übersetzung, Lücke) nennt die Fehlerart aus `APP.errorKinds` (je App eigene Liste); unbekannte als „neu: …“ – die Liste wird bei der Auswertung erweitert (Matthias). Bericht „WIEDERKEHRENDE FEHLERARTEN“ mit Texte/Sätze, Trend, Beispielen; auch in der Gesamtanalyse. Test + Gegenprobe; Sicherung `sicherung/vor-s1014-4`.

## 2026-10-14 – Befunde der Deutsch-Trainer-Simulation umgesetzt (S-1014-7 bis -14, -17)
- Themenabstand nach vergangener Zeit, Vorziehen verlängert nicht, Wachstum ≤ ×2,5, Themen max. 60 Tage (Matthias: „Abstände sehr lang“), mit Schwächen 30; Vokabeln bleiben 365.
- Lernschritte: 10 Übungen, nach 2 Fehlversuchen andere Übung (Ausnahme zu Punkt 7), Schreiben/Dialog nur Themenregel streng; KI-Themenzuordnung nur passende Themen.
- Langzeit-Check vor neuem Thema, Lückenhinweis in Wiederholungen auf Knopfdruck, Wortschatz-Pakete (`wort: true`) parallel, KI-Protokoll im Bericht als Stichprobe; Simulation an Lernschritte angepasst (nicht gestartet).

## 2026-10-14 – Nicht gewertete Fehler sichtbar (S-1014-20)
- Im Lernschritt nicht gewertete Fehler werden als Fehlerart gespeichert (Bericht, ohne Vorziehen) und in der Rückmeldung orange hervorgehoben, geänderte Wörter markiert (Matthias: „trotzdem visuell hervorheben“).

## 2026-10-14 – „Kenne ich schon“ für Vokabeln (S-1014-21)
- Neue Wörter, die man schon kann: beide Richtungen kommen erst nach 60 Tagen wieder (Matthias: „erst mal 60 Tage“), nicht im Tageslimit; vergessen → normal von vorn. Englische Oberfläche für den Deutsch-Trainer nur in `docs/ideen.md` vorgemerkt (S-1014-22/-23).

## 2026-10-14 – Zurücksetzen rückgängig machen (S-1014-25)
- Nach einem versehentlich zurückgesetzten Thema (Auroras Stand, Rettung über den Tagesstand) bietet die App „Zurücksetzen rückgängig machen“ aus der Gerätekopie an, bis das Thema wieder geübt wird; Abgleich bringt das Zurücksetzen nicht zurück.

## 2026-10-14 – Lernschritte für Opi-suomea-Themen, Etappe 1 (S-1014-6)
- t04b, t04c, t05b, t06b, t07b, t08b, t08c, t08d haben `steps` (je 2 Schritte nach den Theorie-Abschnitten; t07b/t08b ohne `sec`, da nur ein Abschnitt). Nur t08d brauchte 3 neue Übungen (Schritt „Wie oft?“). Lehrplan: neue Themen immer mit Schritten.

## 2026-10-14 – Lernschritte, Etappe 2: t09b–t11c (S-1014-6)
- t09b, t09c, t10, t10b, t10c, t11, t11b, t11c haben `steps` (2–3 Schritte nach den Theorie-Abschnitten; t10b/t11b ohne `sec`). Keine neuen Übungen nötig; Lesetexte mit späterer Grammatik (t10 Übung 16 „syön“) im späteren Schritt.

## 2026-10-14 – Lernschritte, Etappe 3: t12–t12d (S-1014-6)
- t12, t12b, t12c, t12d haben je 2 `steps` (t12c ohne `sec`: erst Stufenwechsel bei Verben, dann bei Orten mit -ssa). Keine neuen Übungen nötig.

## 2026-10-14 – Lernschritte, Etappe 4: t13–t14c (S-1014-6)
- t13, t13b, t13c, t14, t14b, t14c haben `steps` (t14 drei: Teilungsform – Objekt – tämä/tuo/se). t13c: 5 neue Übungen (Orte mit -lla, Wieniin, työhön; en./fi.wiktionary), GLOSS_EXTRA ergänzt.
- „Gesprochen“-Übungen stehen jetzt immer im Schritt mit dem Abschnitt „gesprochen“ (t08d, t12d nachträglich verschoben; Prüfliste Nr. 16).

## 2026-10-14 – Lernschritte Etappe 5: t15–t15c (S-1014-6)
- t15 (Typ 4 | können/müssen/kenen), t15b (Genitiv + kanssa | pitää + -sta), t15c (müssen/nicht müssen | dürfen/können) haben Schritte; Gesprochen-Übungen jeweils im letzten Schritt.
- t15b: 4 neue Übungen zu Genitiv/kanssa (miehen, talon, ystävän kanssa, lapsen), Formen mit en.wiktionary geprüft; GLOSS_EXTRA miehen, naisen.

## 2026-10-14 – Lernschritte Etappe 6: t16–t16e (S-1014-6)
- t16, t16b, t16c, t16d, t16e je 2 Schritte (Grundregel | Erweiterung + gesprochen), keine neuen Übungen.
- Offen: ältere Hinweise „Wort ohne frühere Wortliste“ in Formtabellen (torilta, meille, menkää …, matka) – keine Fehler, nur Hinweise.

## 2026-10-14 – Lernschritte Etappe 7: t17–t19c (S-1014-6)
- t17–t17d, t18–t18d, t19–t19c je 2 Schritte; Gesprochen-Übungen immer im Schritt mit ihrem Abschnitt.
- Neue Übungen für Schritt 1 (sonst < 8): t18d 3 (Mehrzahl-Kleidung: ovat märät, siniset), t19b 2 (puhuin, ostin), t19c 4 (tunsi, tiesin, pyysin) – Formen mit en.wiktionary geprüft.

## 2026-10-14 – Lernschritte gelernte Themen (S-1014-6, Etappe 8)
- t09, t01b, t02b, t02c, t03b bekommen je 2 Lernschritte (Abschnitte wie in der Theorie, Mischübungen zuletzt, „Gesprochen“ im Schritt mit dem Gesprochen-Abschnitt).
- Keine neuen Übungen, keine neuen finnischen Formen; Übungs-Indizes unverändert.

## 2026-10-14 – Lernschritte Grundthemen t01–t08 (S-1014-6, Etappe 9)
- `js/inhalte.js`: jedes Grundthema bekommt 2 Lernschritte (Feld `steps`, nur eingefügt, `ex`/`v` unverändert); t04 und t07 beginnen mit der Tabelle aus der Einleitung (Schritt ohne `sec`).
- Keine neuen Übungen oder finnischen Formen. Damit haben alle 58 Themen Lernschritte.

## 2026-10-14 – Verbkarten-Prüfung auf neues Format (S-1014-26)
- `statisch.mjs`: Verbkarten „to …“ brauchen `{f: ["Präsens: …", "Präteritum: …", "Perfekt: …", "Futur: …"]}` mit Pronomen auf der deutschen Seite; die alte Klammer auf der englischen Seite gilt als veraltet (Wunsch Matthias für den Deutsch-Trainer).

## 14.10.2026 – Grammatik zuerst, Wortpakete freiwillig (D-1014-43/-44, -56)
- Simulation (Branch `simulation/vergleich-s1014`) auf main übernommen (D-1014-56).
- Neuer Schalter `APP.features.grammarFirst` (Deutsch-Trainer an, Opi suomea aus): „Als Nächstes“ zuerst Grammatik, Vokabeln im Tagesplan freiwillig, Kartenrückstand pausiert keine neuen Themen. Für beide Apps: Wortschatz-Pakete ohne Pflicht-Wiederholung (Übungen unter „Mehr üben“) und nicht im Langzeit-Check. Test in `befunde.mjs`, Sicherung `sicherung/vor-d1014-43`.

## 14.10.2026 – Schwache Teilregel, Fehler in Wiederholungen, KI-Übungen für schwache Themen (D-1014-47/-48/-49/-50)
- Wiederholungen bevorzugen den schwächsten Lernschritt; vorgezogene Wiederholung = Kurzrunde zur Teilregel; offene Fehler (bis 4) immer in der Wiederholung des Themas.
- KI-Übungen auch für Themen unter 80 % (nach mind. einer Runde), mit Schwerpunkt auf Teilregel und Fehlern. -49 (Fehlerarten im KI-Auftrag) war mit S-1014-9 schon erfüllt.
