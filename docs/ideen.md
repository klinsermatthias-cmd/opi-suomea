# Ideensammlung (für später)

Matthias' Verbesserungsideen. Solange der **Sparmodus** gilt (Usage-Tokens sparen), werden Ideen hier nur kurz gesammelt –
ohne Code zu lesen und ohne Machbarkeitsprüfung. Erst wenn Matthias den Sparmodus beendet, wird geprüft und (nach seiner Bestätigung) umgesetzt.

Format: `- [ ] Datum – Idee (kurz) · Notiz`

## Offen
- [ ] 2026-10 – KI-Anbieter: Mischbetrieb Gemini + Claude-API prüfen (siehe Erinnerungen in `docs/lehrplan.md`)
- [ ] 2026-10 – Kleinstes Gemini-Modell für einfache Aufgaben nur, falls Limits erreicht werden
- [ ] 2026-10 – **E-1007-8 Gezielte Wiederholung schwacher Grammatikthemen** (Kern umgesetzt mit **E-1008-22**: Vorziehen auf spätestens übermorgen, Grund auf „Heute“, abschaltbar; offen sind nur noch gezielte KI-Übungen dazu – erst nach einigen Berichten mit geprüfter Zuordnung entscheiden). Ursprüngliche Idee: Thema mit ≥ 2 Treffern in `S.weak` (14 Tage) spätestens übermorgen fällig, Karte auf „Heute“ mit kurzer Runde dieses Themas, KI-Übungen gezielt dazu; Karte verschwindet nach einer Runde ≥ 80 %. Erst umsetzen, wenn die Inhalts-Chats nach einigen Berichten bestätigt haben, dass die KI-Zuordnung (E-1007-6) zuverlässig ist – dann Empfehlung an Matthias.
- [ ] 2026-10 – **Große Dateien teilen (S-1008-106), erst ab > 1.500 Zeilen:** `js/ki.js` (8.10.: 1.411 Zeilen, z. B. KI-Protokoll/Statistik abtrennen), `js/daten.js` (1.354, z. B. Sicherungsdatei abtrennen), `js/inhalte.js` (1.344, `GLOSS_EXTRA` als eigene App-Datei). Jetzt nichts umbauen.
- [ ] 2026-10-08 – **„Nur vertippt?“** (Matthias): Weicht die Antwort nur um einen Buchstaben ab (v. a. Nachbartaste, z. B. „Open“ statt „olen“), unter „falsch“ einen Knopf „Nur vertippt – als richtig werten“ (wie die Selbst-Entscheidung bei KI-Ausfall, mit Vermerk im Bericht); nicht bei Endungs-Lücken/strengen Übungen; Häufigkeit zählen, damit echte Schwächen nicht verdeckt werden.
- [ ] 2026-10-08 – **„Verwende: …“ erst auf Wunsch** (Matthias): Die vorgegebenen Wörter (`w`) verraten viel – zuerst verdeckt, „💡 Hilfe“ deckt sie auf; im Bericht vermerken, ob die Hilfe genutzt wurde. Engine-Änderung, Inhalte bleiben.
- [ ] 2026-10-08 – **Teilpunkte bei mehreren Feldern** (Matthias): Dialog/Tabelle anteilig werten (1 von 2 Zeilen = 50 %) für Rundenergebnis und Auswertung; „gelöst“ erst, wenn alle Zeilen stimmen. Vorher klären: Wirkung auf die strenge 80-%-Freischaltung.
- [ ] 2026-10-08 – **ä/ö-Fehler mitzählen** (Matthias): Antworten mit fehlenden/falschen Pünktchen gelten heute als „fast richtig“ (`SP.loose`), werden aber nirgends gezählt. Je Wort zählen und im Bericht zeigen („ä/ö vergessen: 12× in 30 Tagen, v. a. …“), auch für die KI-Analyse; Bewertung bleibt gleich. Sprachneutral über `SP.loose` (gilt auch für ß/ss im Deutsch-Trainer).
- [ ] 2026-10-08 – **Tastatur-Vorschläge abschalten** (Matthias): Die iOS-Vorschlagsleiste zeigt beim Tippen oft schon das richtige Wort. Eingabefeldern `autocorrect="off" autocomplete="off" autocapitalize="off" spellcheck="false"` geben; blendet die Leiste je nach iOS nicht sicher aus. Sicher geht es nur in iOS: Einstellungen → Allgemein → Tastatur → Vorhersagen/Autokorrektur aus.
- [ ] 2026-10-08 – **Akzeptierte Vokabel-Antworten lernen** (Matthias): Wertet Opettaja eine nicht hinterlegte Antwort als richtig, App merkt sie je Karte und erkennt sie beim nächsten Mal selbst (spart KI-Anfragen). Bericht listet sie, Inhalts-Chat prüft: richtig → in die Vokabelliste, falsch → wieder entfernen; mit ⚑ markierte nicht speichern. Offen: schon vor der Prüfung „vorläufig richtig“ oder erst danach.
- [ ] 2026-10-08 – **Klammern verraten die Lösung** (Matthias): Bei Deutsch → Finnisch zeigt die Angabe oft finnische Formen in der Klammer („Schuh (kengät = Schuhe)“, „bleiben (jään)“), über 250 Vokabeln haben Klammern. Vorschlag: Klammern mit Wort gleichen Anfangs wie die Lösung bis zum Aufdecken als „(…)“ zeigen; deutsche Hinweise wie „(höflich)“ bleiben. Alternative: Inhalte umschreiben.

## Erledigt
- [x] 2026-10 – Wörter antippen: Endungen -na/-nä (maanantaina) und Teilungsform (teetä, euroa) lokal erkennen statt über KI
- [x] 2026-10 – Vokabeln: „Frag Opettaja“ auf der Vokabelkarte (nach dem Aufdecken)
- [x] 2026-10 – Vokabeln: eigene Eingabe nach dem Aufdecken sichtbar, Abweichungen markiert

## Vorgemerkt für die nächste große Prüfung (Matthias, 7.10.2026)
- **Erinnern:** Matthias will vor der nächsten großen Prüfung den Effort erhöhen (Empfehlung: „max“ für die Gesamtprüfung, danach dauerhaft „xhigh“) und dann einen kompletten Check starten: App, Code, Funktionen, Stabilität, Datensicherheit, Bedienung.
- **Immer vorschlagen:** Claude schlägt von sich aus vor, wann eine vollständige Simulation oder eine vollständige App-/Code-Prüfung sinnvoll ist (z. B. nach größeren Paketen, vor riskanten Umbauten, wenn eine neue App/Sprache dazukommt).
- **Architektur überdenken:** In der nächsten großen Prüfung die gesamte Architektur bewerten – vor allem die gemeinsame Engine für die zwei bestehenden, getrennten Apps (Opi suomea = Finnisch-Trainer, Deutsch-Trainer): Ist die Trennung Engine ↔ App-Dateien, „Engine übernehmen“, `APP`-Einstellungen, Sprachregeln (`SP`) und Datenhaltung je App gut so, oder sollte etwas verbessert werden (z. B. eine App-Vorlage für neue Sprachen, gemeinsame Tests je App, getrennte Clouds)?

## Übergabe
Die Startdatei des Chats „App-Engine: Funktionen“ ist `docs/chats/funktionen.md`; die frühere Übergabe vom 7.10. liegt wörtlich in `docs/archiv/uebergabe-funktionen-2026-10-07.md`.
