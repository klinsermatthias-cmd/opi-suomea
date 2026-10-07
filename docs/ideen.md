# Ideensammlung (für später)

Matthias' Verbesserungsideen. Solange der **Sparmodus** gilt (Usage-Tokens sparen), werden Ideen hier nur kurz gesammelt –
ohne Code zu lesen und ohne Machbarkeitsprüfung. Erst wenn Matthias den Sparmodus beendet, wird geprüft und (nach seiner Bestätigung) umgesetzt.

Format: `- [ ] Datum – Idee (kurz) · Notiz`

## Offen
- [ ] 2026-10 – KI-Anbieter: Mischbetrieb Gemini + Claude-API prüfen (siehe Erinnerungen in `docs/lehrplan.md`)
- [ ] 2026-10 – Kleinstes Gemini-Modell für einfache Aufgaben nur, falls Limits erreicht werden
- [ ] 2026-10 – **E-1007-8 Gezielte Wiederholung schwacher Grammatikthemen** (wartet): Thema mit ≥ 2 Treffern in `S.weak` (14 Tage) spätestens übermorgen fällig, Karte auf „Heute“ mit kurzer Runde dieses Themas, KI-Übungen gezielt dazu; Karte verschwindet nach einer Runde ≥ 80 %. Erst umsetzen, wenn die Inhalts-Chats nach einigen Berichten bestätigt haben, dass die KI-Zuordnung (E-1007-6) zuverlässig ist – dann Empfehlung an Matthias.

## Erledigt
- [x] 2026-10 – Wörter antippen: Endungen -na/-nä (maanantaina) und Teilungsform (teetä, euroa) lokal erkennen statt über KI
- [x] 2026-10 – Vokabeln: „Frag Opettaja“ auf der Vokabelkarte (nach dem Aufdecken)
- [x] 2026-10 – Vokabeln: eigene Eingabe nach dem Aufdecken sichtbar, Abweichungen markiert

## Vorgemerkt für die nächste große Prüfung (Matthias, 7.10.2026)
- **Erinnern:** Matthias will vor der nächsten großen Prüfung den Effort erhöhen (Empfehlung: „max“ für die Gesamtprüfung, danach dauerhaft „xhigh“) und dann einen kompletten Check starten: App, Code, Funktionen, Stabilität, Datensicherheit, Bedienung.
- **Immer vorschlagen:** Claude schlägt von sich aus vor, wann eine vollständige Simulation oder eine vollständige App-/Code-Prüfung sinnvoll ist (z. B. nach größeren Paketen, vor riskanten Umbauten, wenn eine neue App/Sprache dazukommt).
- **Architektur überdenken:** In der nächsten großen Prüfung die gesamte Architektur bewerten – vor allem die gemeinsame Engine für getrennte Apps (Opi suomea, Deutsch-Trainer, evtl. weitere wie ein Englisch-Trainer): Ist die Trennung Engine ↔ App-Dateien, „Engine übernehmen“, `APP`-Einstellungen, Sprachregeln (`SP`) und Datenhaltung je App gut so, oder sollte etwas verbessert werden (z. B. eine App-Vorlage für neue Sprachen, gemeinsame Tests je App, getrennte Clouds)?
