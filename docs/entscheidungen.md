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
