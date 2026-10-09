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
