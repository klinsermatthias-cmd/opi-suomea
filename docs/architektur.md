# Architektur von Opi suomea

## Dateien
| Datei | Zweck |
|---|---|
| `index.html` | Die komplette App (PWA): Inhalte t01–t08, Logik, Design |
| `sw.js` | Service Worker: immer zuerst Netz, sonst Cache (offline) |
| `manifest.webmanifest`, `icon-*.png` | Installierbar als App |
| `lektionen/lektionen.json` | Zusätzliche Themen ab t09, werden beim Start automatisch geladen |
| `CLAUDE.md`, `docs/` | Wissen und Regeln für Claude |

Hosting: GitHub Pages (kostenlos). Kein Build-Schritt.

## Kostenlose Dienste
- **Supabase (Free)**: Cloud-Sync. Achtung: Gratis-Projekte werden nach ca. 7 Tagen ohne Aktivität pausiert; Daten bleiben, im Supabase-Dashboard „Resume project“. Die App zeigt dann einen Hinweis.
- **Google Gemini (Free Tier)**: KI „Opettaja“. Limits pro Minute und pro Tag, pro Modell; Tageslimit setzt sich um Mitternacht Pazifik-Zeit zurück (≈ 9 Uhr in Österreich).
- Alternativ in der App wählbar: OpenAI-kompatibler Anbieter (z. B. Groq) oder „ohne KI“.

## Zustand `S` (wird gespeichert und synchronisiert)
Gespeichert in `localStorage["opi-suomea-v1"]`, bei jeder Änderung sofort (`save()`).
- `topics[id]`: `{status: locked|new|learning, ease, interval, reps, lapses, due, last, best, hist[{d,sc,r}], ai{feedback,tips,reason}}`
- `cards["tXX-i"]`: SM-2-Karte `{ease, interval, reps, lapses, due, isNew, last}` – Richtung wechselt mit `reps` (fi→de / de→fi)
- `errors[]`: `{d, topic, ei (Übungsindex, -1 = KI-Übung), q, user, exp, ok?, gx? (KI-Übung selbst)}` max. 80
- `reports[]`: Gesamtanalysen von Opettaja (max. 10)
- `packs[]`: zusätzliche Themen (aus `lektionen.json` oder eingefügten Paketen)
- `settings`: `newCardsPerDay` (5–50), `extraCards` (5–50), `newTopicsPerDay`, `ai`, `slow`, `autoplay`, `theme`
- `active`: unterbrochene Übung (`idxs`, `rt` = Wiederholungs-Markierung, `gen`/`gsrc` bei Fehler-Training und KI-Übungen)
- `exToday`: heute richtig gelöste Übungen (`tid:index`)
- `gloss`: von Opettaja nachgeschlagene Wörter (Cache)
- `genUnlock`: Freischaltung der KI-Übungen
- `stats`, `daily`, `lastGlobal`, `sinceGlobal`, `lastBackup`, `updated`, `created`

## Gerätekonfiguration `CFG` (nur auf dem Gerät, nie synchronisiert)
`localStorage["opi-suomea-config"]`: Supabase-URL/Key/Session, KI-Anbieter + Schlüssel (`ai`), `aiCaps` (Modell-Eigenheiten), `aiLog` (letzte 30 KI-Anfragen), `syncedAt`, Sicherungsdatei-Einstellungen, Backup-Erinnerung.

## Cloud-Sync (Supabase, REST ohne Bibliothek)
Tabellen (aus dem Code abgeleitet):
- `progress(user_id uuid, data jsonb, updated_at timestamptz)` – eindeutig je `user_id`, Upsert mit `on_conflict=user_id`
- `snapshots(user_id uuid, day date, data jsonb)` – eindeutig je `(user_id, day)`, tägliche Stände, älter als 30 Tage werden gelöscht
- Zugriff per Supabase-Auth (E-Mail/Passwort), Row Level Security je Nutzer.

Ablauf: lokal sofort speichern → nach 1,2 s in die Cloud. Beim Öffnen/Zurückkehren neueren Cloud-Stand holen. Hat das Gerät **noch nicht synchronisierte** Änderungen (`S.updated > CFG.syncedAt`) und die Cloud ist neuer, werden beide Stände **zusammengeführt** (`mergeStates`: pro Thema/Karte gewinnt der zuletzt geübte Stand, Listen werden vereinigt).

## Sicherungen (Fail-safes)
- Vor jedem riskanten Schritt Kopie im localStorage: `-vor-sync`, `-vor-import`, `-vor-reset`, `-vor-loeschen`, `-vor-wiederherstellung`
- Cloud: 30 Tagesstände, in der App „Älteren Stand laden“
- PC (Chrome/Edge): automatische Sicherungsdatei, Ort änderbar
- Handy/alle: wöchentliche Erinnerung mit „Sicherung speichern“ (Teilen-Menü) bzw. Download, Dateiname mit Datum
- „Backup kopieren“ (Text), „Sicherung einspielen“, „Notfall-Version herunterladen“ (App als einzelne HTML-Datei)

## Lernlogik
- **Themen**: Theorie → Übungen. Falsche Übungen kommen ca. 4 Aufgaben später wieder, bis sie richtig sind; Wertung nur erster Versuch.
- **Auswertung**: SM-2 + Selbsteinschätzung (Ergebnis < 60 % → höchstens „Nochmal“, < 80 % → höchstens „Schwer“) → Gemini legt den Termin fest (1–180 Tage), sonst gilt SM-2.
- **Gesamtanalyse** nach je 3 Lektionen (oder 1, wenn > 3 Tage her): Niveau, Muster, Termine verschieben, `basicsSolid`.
- **Freischaltung**: nächstes Thema, wenn Voraussetzungen zuletzt ≥ 80 %.
- **Vokabeln**: Anki-artig, beide Richtungen; getippte Antworten lokal, sonst Gemini prüft Bedeutung.
- **Hörtraining** (Wörter, Schreibweise) und **Hörverstehen** (ganze Sätze, Bedeutung auf Deutsch).
- **Fehler-Training**: offene Fehler (bis 10 je Runde); richtig beim ersten Versuch = gelöst.
- **Neue Übungen von Opettaja** (KI-generiert): erst frei, wenn alle t01–t08 `status=learning`, `last ≥ 0,8`, `reps ≥ 2` **und** die Gesamtanalyse `basicsSolid: true` meldet. Danach je Thema ein Knopf; ändert den Plan nicht.
- **Wörter antippen**: Wörterbuch aus allen Vokabeln + Verbformen aus Tabellen-Übungen + Endungs-Heuristik + Orte (-ssa/-ssä); sonst fragt Gemini, Ergebnis wird in `S.gloss` gespeichert.

## KI-Verbindung (Gemini)
`geminiCall`: Modelle nacheinander (`gemini-flash-latest`, `gemini-2.5-flash`, `gemini-flash-lite-latest`, `gemini-2.5-flash-lite`), jedes mit eigenem Kontingent. JSON-Modus, wenig „Thinking“ (`thinkingLevel: low`, bei Ablehnung automatisch ohne), Timeout 30 s, Retry bei 5xx. Fehler werden eingeordnet (`quota-day`, `quota-min`, `overload`, `key`, `timeout`, `offline` …) und verständlich angezeigt. „Verbindung prüfen“ (Fortschritt → Daten & Einstellungen) testet Internet, Schlüssel und jedes Modell und stellt das beste erreichbare ein. Die Funktion heißt aus historischen Gründen `claude()`.
