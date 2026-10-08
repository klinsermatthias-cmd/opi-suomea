# Gesamtprüfung der Lern-Engine (Start 7.10.2026, 17:55 UTC, Effort „max“)

Auftrag von Matthias (E-1007-94/-95, „Gesamtprüfung starten“): App, Code, Funktionen, Stabilität, Datensicherheit,
Bedienung **und** Architektur der gemeinsamen Engine für Opi suomea und den Deutsch-Trainer prüfen.
Ergebnis: Liste mit E-Codes – **nichts an der App ändern ohne OK zu einem Code**.
Dieser Branch (`sicherung/gesamtpruefung`) ist nur der Zwischenstand; `main` und die App bleiben unberührt.
Öffentliches Repo: keine Schlüssel, keine privaten Daten, Sicherheitslücken ohne Schritt-für-Schritt-Anleitung beschreiben.

## Fortschritt (bei Unterbrechung hier weitermachen)
Stand: Basis `main` e808c8c. Bereichsberichte liegen in `docs/gesamtpruefung/<Bereich>.md`.
- 7.10. 17:55–22:55 UTC: Unterbrechung (Neustart der Umgebung), danach fortgesetzt.
- 22:57 UTC: Hilfs-Prüfer für A–G gestartet; ~23:10 Nutzungslimit erreicht, alle abgebrochen (Teilergebnisse B1, D1–D3 gesichert).
- 8.10. ab 03:52 UTC: Engine-Chat prüft allein und sparsam weiter, Bereich für Bereich (keine parallelen Prüfer mehr).
- Ist eine Bereichsdatei unvollständig (kein Abschnitt „Gut gelöst“ am Ende), den Bereich neu starten bzw. fortsetzen.
- [x] A – Datensicherheit (`A-datensicherheit.md`)
- [x] B – Sicherheit & Datenschutz (`B-sicherheit.md`)
- [x] C – Lernlogik (`C-lernlogik.md`)
- [x] D – Übungsformate (`D-formate.md`, teilweise)
- [x] E – KI (`E-ki.md`)
- [x] F – Bedienung (`F-bedienung.md`, teilweise)
- [x] G – Stabilität & Tests (`G-stabilitaet.md`)
- [x] H – Architektur der gemeinsamen Engine (inkl. Vergleich mit dem Deutsch-Trainer) – `H-architektur.md`
- [x] Z – Befunde gegengeprüft, E-Codes vergeben (8.10.2026)

## Ergebnis (8.10.2026)

**Gesamturteil:** Die App ist in gutem Zustand. Kein kritischer Befund. Beim Wichtigsten – Fortschritt darf nie verloren
gehen – wurde kein Weg zu Datenverlust gefunden: Hochladen nur mit Vergleich, Zusammenführen deckt alle 42 Zustandsfelder ab,
`pruefen.mjs` testet Sync mit zwei Geräten, zwei Tabs, kaputte Daten und Rettung (49 Prüfungen, alle grün). Die Befunde sind
Randfälle der Lernlogik (Sperre umgehbar, blockierter Fortschritt ohne Hinweis), Fairness der Bewertung (KI-Ausfall,
Wortstellung, Umlaute), ein Wachstumsrisiko (Lektionen im Lernstand) und die Vorbereitung des Deutsch-Trainers auf eigene
Lektionen (deutsche Sprachregeln ungetestet). Die gemeinsame Engine ist richtig aufgebaut.

**Grenzen dieser Prüfung:** D (Formate) und F (Bedienung) nur teilweise (Hilfs-Prüfer vom Nutzungslimit abgebrochen,
Ergebnisse übernommen); keine Simulation (nur auf Matthias' Wunsch, Vorschläge dazu in G).

| Code | Befund | Was geändert würde | Schwere | Aufwand | Empfehlung |
|---|---|---|---|---|---|
| **E-1008-1** | C1 | Gesperrtes Thema nicht über „Wörter vorab lernen“ lernbar; Reparatur widersprüchlicher Stände | mittel | klein | ja |
| **E-1008-2** | E1 | KI nicht erreichbar → Übung „nicht gewertet“ statt Fehler | mittel | klein | ja |
| **E-1008-3** | D2 | Umlaut-Toleranz: Endungs-Lücken (Vokalharmonie) automatisch streng; Deutsch ohne Umlaut-Toleranz | mittel | klein | ja |
| **E-1008-4** | C2 | „Heute“ nennt die blockierende Voraussetzung und bietet die Freischalt-Runde an | mittel | klein | ja |
| **E-1008-5** | C2 | Themen unter 80 %, von denen andere abhängen: höchstens 7 Tage Abstand (auch KI) | mittel | klein | Entscheidung (Didaktik) |
| **E-1008-6** | D1 | Satz ordnen: mehrere richtige Wortstellungen im Format; danach trägt der Inhalts-Chat ~13 Alternativen nach | mittel | klein | ja |
| **E-1008-7** | A1 | Lektionen aus `lektionen.json` nicht mehr im Lernstand speichern | mittel | mittel | ja, mit Sicherungs-Branch |
| **E-1008-8** | H1 | „Engine übernehmen“ holt nur den in Opi suomea veröffentlichten Stand | mittel | klein | ja |
| **E-1008-9** | H2, D3 | Deutsch: Engine-Tests mit deutscher Test-App; Groß-/Kleinschreibung im Deutschen prüfen (auch Einstufungstest) | mittel | mittel | ja, vor den ersten DT-Lektionen |
| **E-1008-10** | C3 | Themenwörter nicht doppelt am selben Tag; zweites „Gut“ am Lerntag kein Sprung auf 4 Tage | niedrig | klein | ja |
| **E-1008-11** | F1, F2 | Gesperrte Themen besser lesbar, größere Tippflächen (nur CSS) | niedrig | klein | ja |
| **E-1008-12** | B1, B2 | Lektionsfelder maskieren, Pakete aus Sicherung/Cloud zentral prüfen; Supabase-Prüfung um `snapshots` und Schreiben erweitern | niedrig | klein | ja |
| **E-1008-13** | E2, E3 | Gesamtanalyse höchstens alle 3 Tage und nach ≥ 5 Runden, kompakter; „Neue Übungen“ nur mit Themenwörtern | niedrig | klein | ja |
| **E-1008-14** | H3, H4 | Prüfskript: Sprachmodul für jede Lernsprache vorhanden, keine doppelten Funktionsnamen | niedrig | klein | ja |
| **E-1008-15** | C4, H5, A1 | Doku berichtigen (KI-Grenze, „ca. 30 KB“, Engine-Doku neutral), Ergebnis in `docs/` festhalten | niedrig | klein | ja |
| **E-1008-16** | A2, H6 | Hinweis in „Cloud & KI einrichten“: je App ein eigenes Konto | niedrig | klein | ja |
| **E-1008-17** | A2, H6 | App-Kennung in den Cloud-Tabellen (Supabase-Änderung) | niedrig | mittel | nur falls Konten geteilt werden |
| **E-1008-18** | B3 | Content-Security-Policy als zweite Sicherung | niedrig | mittel | später (nach E-1008-12) |
| **E-1008-19** | G | Simulation um Themen-Abdeckung, neue Szenarien und Speichergröße erweitern (Vorbereitung E-1007-88) | – | klein | vor E-1007-88 |
| **E-1008-20** | Paket | E-1008-1, -2, -3, -4, -6, -8, -10, -11, -12, -14, -15, -16 zusammen (alles klein, keine Sync-Änderung) | | | **Empfehlung** |
