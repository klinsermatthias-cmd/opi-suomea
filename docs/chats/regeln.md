# Regeln für alle Chats: Weiterleiten, Chatlänge, Umsiedeln, Archivieren

Aus `CLAUDE.md` hierher verschoben (T-1012-17, 12.10.2026), damit sie nicht in jeder Anfrage mitgeladen werden. **Nur bei Bedarf lesen** (Weiterleiten, Umsiedeln, Archivieren). Session-IDs: `docs/chats/sessions.md`.

## Weiterleiten
- **Falscher Chat → weiterleiten:** Landet eine Anfrage im falschen Chat, leitet dieser sie an den zuständigen Chat weiter (`send_message`) und sagt Matthias, wohin. Der zuständige Chat behandelt sie wie eine Anfrage von Matthias, holt vor Änderungen aber trotzdem sein OK ein („erst erklären, dann fragen, dann ändern“).

## Chatlänge (gilt seit T-1012-10)
- **Ein Thema = ein kurzer Chat.** Jeder Arbeitsschritt liest den ganzen bisherigen Chat neu; ein Chat mit 400.000 Tokens Kontext braucht für eine Kleinigkeit ein Vielfaches eines frischen Chats (Messung: `docs/token-analyse/` auf Branch `claude/language-app-token-analysis-b75s4a`).
- Nach jedem abgeschlossenen Thema `/compact` vorschlagen (dahinter, was erhalten bleiben soll: Codes, offene Punkte, Session-IDs).
- Zeigt `/context` mehr als 150.000 Tokens: Startdatei aktualisieren und umsiedeln (unten). `.claude/settings.json` fasst ab 200.000 Tokens automatisch zusammen (`autoCompactWindow`, T-1012-9).
- Abgelöste Regel (wörtlich, zur Nachvollziehbarkeit): **Chat-Länge täglich prüfen (Matthias, 7.10.2026):** Jeder Chat prüft einmal am Tag (beim ersten Arbeiten an einem neuen Tag), ob er sehr lang geworden ist. Wenn ja, schlägt er Matthias zuerst `/compact` vor (Chat zusammenfassen; dahinter angeben, was erhalten bleiben soll, z. B. Codes, offene Punkte, Session-IDs) – erst wenn das nicht reicht, mit einem Code einen neuen Chat, und überträgt vorher alle wichtigen Informationen und Daten in seine **Startdatei** (Spalte oben; Stand, letzter vergebener Code, offene Punkte, Session-IDs der anderen Chats – überschreiben, nicht anhängen).

## Lange Läufe und Berichte (D-1014-78/-79)
- **Lange Läufe** (Simulationen, große Prüfungen): Logs außerhalb des Repos schreiben (Scratchpad), erst am Ende ins Ziel kopieren. Überwachen nur auf Ende, Hänger und neue Fehler – keine Zwischenmeldungen je Fortschritt. Ein stündlicher Wecker nur für Läufe über 2 Stunden.
- **Lange Berichte als Datei** (`SendUserFile`, bei privaten Inhalten ins private Repo), im Chat nur Kurzfassung und Codes – sonst wird der Bericht in jedem Folgeschritt mitgelesen.

## Umsiedeln
- **Umsiedeln (Matthias, 9.10.2026, E-1009-18):** Vor jedem Wechsel schreibt der Chat seine Startdatei vollständig neu und prüft, dass drinsteht: Stand mit allen Codes seit der letzten Übergabe, letzter vergebener Code, offene Codes mit Kurzbeschreibung und Effort, laufende Tests und Termine, Routinen, Sicherungs-Branches, Session-IDs der anderen Chats, bewährte Abläufe. Dann pushen. Danach **legt der Chat den Nachfolger selbst an** (`create_session` mit beiden Repos, Titel = Chat-Name, erste Nachricht: Startdatei lesen, eigene Session-ID dort eintragen und pushen, die anderen Chats per `send_message` informieren) – ohne weiteren Code, wenn Matthias das Umsiedeln verlangt. Der Nachfolger **archiviert den alten Chat** (`archive_session`), sobald er übernommen hat. Grenze: höchstens 8 Generationen in Folge, danach legt Matthias den Chat selbst neu an. Der Simulations-Chat (zweites Konto) wird von Matthias umgesiedelt.
- Session-IDs stehen nur noch in `docs/chats/sessions.md` (T-1012-18): beim Umsiedeln nur dort eintragen.

## Archivieren (T-1012-22)
- `docs/entscheidungen.md` am Monatsanfang wörtlich nach `docs/archiv/entscheidungen-<JJJJ-MM>.md` verschieben (neue Datei beginnt mit Überschrift und Verweis aufs Archiv). Abgeschlossene Übergaben, Prüfberichte und veraltete Entwürfe wörtlich nach `docs/archiv/`, nie löschen.
