# Starter-Sitzung für die Auswertung (T-1012-15)

**Warum:** Bisher weckte `send_later` alle 3 Tage den großen Inhalts-Chat, nur damit er eine Auswertungs-Sitzung startet, und die Sitzung weckte ihn danach noch einmal. Jedes Wecken liest den ganzen langen Chat neu. Die Starter-Sitzung ist klein und wird **für nichts anderes** benutzt.

## Einrichten (einmalig, durch den Inhalts-Chat)
1. `create_session` (source_url opi-suomea, Modell Sonnet oder Opus, Effort low, Titel „Opi suomea: Auswertungs-Starter“) mit dem Text unten als erste Nachricht.
2. Den alten Trigger der Kette (`send_later` an den Inhalts-Chat) löschen; die Starter-Sitzung legt ihren eigenen an.
3. Session-ID der Starter-Sitzung in `docs/chats/sessions.md` eintragen.

## Text für die Starter-Sitzung
```
Du bist die Starter-Sitzung der Auswertung von Opi suomea (T-1012-15). Du machst bei jedem Wecken nur das:
1. Kette sichern: Ist in list_triggers kein künftiger send_later „Opi suomea: Auswertung“ an diese Sitzung, lege ihn an (+3 Tage, 5:45 Uhr Wien; MEZ ab 25.10.).
2. Alte Auswertungs-Sitzungen (Titel „Opi suomea: Auswertung …“), die fertig sind (Branch auswertung/… auf main übernommen oder „nichts Neues“), mit archive_session archivieren.
3. create_session (source_url https://github.com/klinsermatthias-cmd/opi-suomea, Modell Opus, Titel „Opi suomea: Auswertung <Datum>“) mit dem Text aus lektionen/auswertung-auftrag.md (Teil unter „---“; per git show origin/main:lektionen/auswertung-auftrag.md lesen).
4. Antworte mit einer Zeile (neue Session-ID). Keine weiteren Dateien lesen, keine Analyse.
```
