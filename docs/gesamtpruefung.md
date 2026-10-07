# Gesamtprüfung der Lern-Engine (Start 7.10.2026, 17:55 UTC, Effort „max“)

Auftrag von Matthias (E-1007-94/-95, „Gesamtprüfung starten“): App, Code, Funktionen, Stabilität, Datensicherheit,
Bedienung **und** Architektur der gemeinsamen Engine für Opi suomea und den Deutsch-Trainer prüfen.
Ergebnis: Liste mit E-Codes – **nichts an der App ändern ohne OK zu einem Code**.
Dieser Branch (`sicherung/gesamtpruefung`) ist nur der Zwischenstand; `main` und die App bleiben unberührt.
Öffentliches Repo: keine Schlüssel, keine privaten Daten, Sicherheitslücken ohne Schritt-für-Schritt-Anleitung beschreiben.

## Fortschritt (bei Unterbrechung hier weitermachen)
Stand: Basis `main` e808c8c. Bereichsberichte liegen in `docs/gesamtpruefung/<Bereich>.md`.
- 7.10. 17:55–22:55 UTC: Unterbrechung (Neustart der Umgebung), danach fortgesetzt.
- 22:57 UTC: Hilfs-Prüfer für A–G gestartet (je eigene Datei); H macht der Engine-Chat selbst.
- Ist eine Bereichsdatei unvollständig (kein Abschnitt „Gut gelöst“ am Ende), den Bereich neu starten bzw. fortsetzen.
- [ ] A – Datensicherheit: Speichern, Migration, Cloud-Sync, Sicherungen, zwei Apps auf einem Origin
- [ ] B – Sicherheit & Datenschutz: HTML-Einfügen/XSS, Schlüssel, Supabase-Zugriff, Service Worker, Workflows
- [ ] C – Lernlogik: Wiederholungsplan, Freischaltung, Runden, Fehler-Training, Tagesplan, Vokabeln
- [ ] D – Übungsformate, Antwortprüfung, Sprachmodul, Wörterbuch, Einstufungstest
- [ ] E – KI: Verbindung, Fehlerbehandlung, Aufträge, KI-Übungen, Protokoll, Token
- [ ] F – Bedienung & Oberfläche (echter Durchlauf im Browser, 390 px)
- [ ] G – Stabilität & Tests: Fehlerbehandlung, Updates/Offline, pruefen.mjs, Simulation (nur Abdeckung lesen), Workflows
- [x] H – Architektur der gemeinsamen Engine (inkl. Vergleich mit dem Deutsch-Trainer) – `H-architektur.md`
- [ ] Z – Befunde gegenprüfen, E-Codes vergeben, Bericht an Matthias

## Ergebnis
(folgt)
