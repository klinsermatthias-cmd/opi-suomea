# Token-Analyse (eigener Chat, nur Analyse)

Branch: `claude/language-app-token-analysis-b75s4a`. Dieser Chat ändert **nichts** an App, Inhalten, Prüfskripten oder Regeln.
Alle Ergebnisse stehen nur in diesem Ordner. Codes für Entscheidungen: `T-<MMTT>-<Nr>` (T = Token-Analyse).

## Stand 12.10.2026 – Phase 0: Rückfragen an Matthias
Auftrag: Code, Dokumente und Prüfskripte auf Token-Einsparungen analysieren. Prüfskripte nach „kritisch für Lernqualität“ und „kann schlanker werden“ einteilen. Wie wirken die Dokumente zusammen?

### Erste Beobachtungen (noch nicht ausgewertet)
- `.claude/settings.json` setzt `effortLevel: "high"` für **alle** Chats in diesem Repo, auch für Kleinigkeiten. Das ist wahrscheinlich ein großer Kostentreiber.
- `CLAUDE.md` hat ca. 16 KB (≈ 4.500 Tokens) und wird in **jedem** Chat bei **jeder** Anfrage mitgeladen.
- Es gibt schon eine Token-Prüfung vom 8.10. (`docs/pruefungen/2026-10-08-token-effizienz.md`, S-1008-93). Zu prüfen ist, was davon umgesetzt wurde.
- Größte Dateien: `lektionen/lektionen.json` 560 KB, `tools/simulation.mjs` 107 KB, `tools/pruefen/durchlauf.mjs` 78 KB, `js/inhalte.js` 75 KB, `js/ki.js` 66 KB, `docs/architektur.md` 40 KB.
- Prüfwerkzeuge: `tools/pruefen.mjs` + 9 Module in `tools/pruefen/`, dazu `test-app*.js`, `test-inhalte.js`, `simulation.mjs`, 3 Workflows.

### Offene Fragen (Antworten hier eintragen)
Siehe Chat vom 12.10.2026. Vorgeschlagener Effort für die Analyse: **high** (einmalig, breit), nicht xhigh/max.

### Antworten Matthias (12.10.2026)
- **T-1012-1** andere Chats (Verläufe) lesend auswerten · **T-1012-3** deutsch-trainer lesend einbinden · **T-1012-5** alles auf den Prüfstand (auch Regeln/CLAUDE.md) · **T-1012-7** Prüfskripte zusammenlegen/verlagern erlaubt.
- Kein konkretes Beispiel genannt. Ergebnisform: wie empfohlen (Markdown im Repo + Artifact-Übersicht).
- „Was immer du empfiehlst testen und im Bericht ausweisen. Vollständige Analyse.“

## Phase 1: Analyse (läuft)
Ergebnisse je Schritt in eigenen Dateien dieses Ordners; Gesamtbericht: `bericht.md`.
