# Entscheidungen und Verlauf

Entstanden im Claude-Projekt „Matthi Finnisch“ (Cowork), ab Oktober 2026 hier im Repository fortgeführt.

## Grundsatzentscheidungen
- Matthias lernt Finnisch von null an, mit Claude als Lehrer.
- Wunsch: dynamische App (Anki-artige Wiederholung, Theorie → Übungen, wachsender Wortschatz, KI-Prüfung), die Schritt für Schritt um neue Themen erweitert wird, sobald die bisherigen sitzen.
- Fortschritt darf nie verloren gehen, Sync zwischen PC und Handy.
- Kostenlos, aber mit KI → Web-App (PWA) auf GitHub Pages + Supabase (Sync) + Gemini Free Tier (KI).
- Fail-safes überall; jederzeit Wechsel zu HTML oder einer anderen Lösung mit allen Daten möglich.
- Optionale Alternative geprüft: Claude-API (Sonnet ca. 1–3 $/Monat bei dieser Nutzung, Ausgabenlimit in der Claude Console einstellbar). Nicht umgesetzt; bräuchte eine Zwischenstelle (z. B. Supabase-Funktion), damit der Schlüssel nicht öffentlich ist.

## 05.10.2026
- Vokabeln in beiden Richtungen.
- Automatische Sicherungsdatei am PC: Speicherort änderbar, abschaltbar.
- Vokabel-Antworten prüft Gemini nach Bedeutung („wie geht's“ = „wie geht es dir“).
- Zahlenkarten: deutsche Seite „eins (1)“ statt nur „1“.
- Falsche Übungen werden in der Runde wiederholt, bis sie richtig sind; Wertung nur erster Versuch.
- Neuer Übungstyp Tabelle mit Lücken (`tab`) + Tabellen in t04–t08.
- Wöchentliche Backup-Erinnerung mit direktem Speichern am Handy.
- Thema zurücksetzen (optional inkl. Vokabeln).
- Gesamtprüfung: Zusammenführen statt Überschreiben bei Offline-Änderungen auf zwei Geräten; robuste Lektionspakete; Sicherheitskopie vor „Fortschritt löschen“; Hinweis bei pausiertem Supabase-Projekt.
- Fehler-Training, Hörverstehen mit ganzen Sätzen.
- KI-generierte „Neue Übungen von Opettaja“ – gesperrt bis die Grundlagen sicher sitzen (Wunsch: erst nach Beherrschen der Grundlagen, entschieden durch die laufende Analyse).
- Kein Sprechtraining (Matthias übt Sprechen mit einer finnischen Freundin).
- Lesetexte später (ca. ab Thema 10).
- Gemini-Verbindung robuster (Modell-Fallback, Retry, Timeout, JSON-Modus) + „Verbindung prüfen“ mit Fehlergründen.
- Wörter in Übungen antippen → deutsche Bedeutung/Grundform.
- Zusätzliche Vokabeln pro Runde einstellbar (5–50, Standard 10); neue Wörter pro Tag bis 50.
- Umzug der Arbeit nach Claude Code mit GitHub-Zugriff: Lektionen liegen ab jetzt in `lektionen/lektionen.json` und werden automatisch geladen; Wissen in `CLAUDE.md` und `docs/`.
- Tab „Fortschritt“ umbenannt in „Asetukset / Einstellungen“ (Leiste + Überschrift); Verweise in Hinweisen angepasst.
- Stabilität: Cloud-Sync überschreibt nie mehr die Änderungen eines anderen Geräts (Hochladen nur mit Vergleich, sonst zusammenführen); Ausweichweg falls Supabase den Vergleich ablehnt; Hochladen beim Schließen auch bei großen Ständen.
- Lektionen werden nur noch komplett übernommen – ein Fehler in einer Lektion verschiebt keine Karten mehr.
- Automatische Prüfung `tools/pruefen.mjs` + GitHub Action: veröffentlicht nur, wenn alles grün ist.
- Service Worker: bei sehr langsamem Netz nach 6 s die gespeicherte Version.
- Optional: GitHub Action hält Supabase wach (braucht 2 Secrets).
- Gesamtprüfung 2: App startet sofort auch bei schlechtem Netz (Cloud im Hintergrund, Zeitlimit für alle Supabase-Anfragen); zwei Tabs überschreiben sich nicht mehr; kein Abmelden durch Token-Erneuerung in einem anderen Tab; voller Speicher opfert alte Kopien statt des Stands; kaputte Daten werden aufgehoben; Rettungsansicht bei Startfehlern; Theorie-HTML per Allowlist bereinigt; Supabase-Action prüft Row Level Security; Playwright-Version in CI fest.
- Arbeitsweise: Claude erklärt Regeln und Hintergründe und ändert App oder Lektionen nur nach ausdrücklicher Bestätigung von Matthias.
- Freischaltung bleibt streng (alle Voraussetzungen je ≥ 80 %); gilt auch für alle künftigen Themen – `req` enthält alle Themen, auf denen ein Thema aufbaut.
- Voraussetzungen sichtbar: gesperrte Themen zeigen in der Liste und auf der (jetzt antippbaren) Themenseite, welche Themen mit welchem Ergebnis fehlen; freie Themen zeigen „Baut auf: …“.
- Freischaltversuch statt Zurücksetzen: Themen unter 80 % jederzeit mit allen Übungen neu testen; zählt wie eine normale Wiederholung (Variante A, von Matthias gewählt).
- KI-Anbieter: vorerst weiter Gemini. Mischbetrieb mit der Claude API (Prüfung, Analyse, KI-Übungen) in ein paar Wochen neu besprechen; Claude erinnert daran (siehe `docs/lehrplan.md`).
- KI-Protokoll: Die App erfasst KI-Antworten, Modelle und Token je Funktion; Bericht für Claude enthält Statistik und Antworten zur Qualitätsprüfung; „KI lag falsch?“ zum Markieren. Einsparpotenzial beim Token-Verbrauch in `docs/architektur.md` notiert.
- Vorgemerkt: einfache KI-Aufgaben zuerst mit dem kleinsten Gemini-Modell – nur falls das KI-Protokoll zeigt, dass die größeren Modelle ihr Limit erreichen.
- Fehler behoben: „Zusätzlich Vokabeln lernen“ nimmt die eingestellte Anzahl auch beim Üben gelernter Wörter (vorher fest 10); Text auf „Heute“ zeigt die genaue Anzahl.
- Extra-Üben gelernter Vokabeln fließt in den Plan ein: Vergessenes kommt morgen wieder, Schweres früher; „Gut“ verlängert nur kurz vor Fälligkeit (frühes Richtigwissen beweist kein langfristiges Behalten).
- Schutz vor versehentlichem Löschen: Eintipp-Bestätigung (LÖSCHEN/ZURÜCKSETZEN), automatische Sicherungsdatei davor, „Gelöschten Stand wiederherstellen“ – Wiederherstellung lokal, nach Neuladen und über die Cloud auf dem zweiten Gerät getestet.
