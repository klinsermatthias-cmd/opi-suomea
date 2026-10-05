# Architektur von Opi suomea

## Dateien
| Datei | Zweck |
|---|---|
| `index.html` | Die komplette App (PWA): Inhalte t01–t08, Logik, Design |
| `sw.js` | Service Worker: immer zuerst Netz, sonst Cache (offline) |
| `manifest.webmanifest`, `icon-*.png` | Installierbar als App |
| `lektionen/lektionen.json` | Zusätzliche Themen ab t09, werden beim Start automatisch geladen |
| `CLAUDE.md`, `docs/` | Wissen und Regeln für Claude |
| `tools/pruefen.mjs` | Automatische Prüfung (Syntax, Lektionen, Nur-anhängen-Regel, Browser-Durchlauf, Sync mit zwei Geräten) |
| `.github/workflows/` | `pruefen-und-veroeffentlichen.yml`: prüft jeden Push, veröffentlicht nur bei Erfolg; `supabase-wach-halten.yml`: Ping alle 3 Tage + prüft, dass ohne Anmeldung nichts lesbar ist (Row Level Security) |

Hosting: GitHub Pages (kostenlos), veröffentlicht über GitHub Actions – nur wenn `tools/pruefen.mjs` fehlerfrei ist. Kein Build-Schritt.

## Kostenlose Dienste
- **Supabase (Free)**: Cloud-Sync. Achtung: Gratis-Projekte werden nach ca. 7 Tagen ohne Aktivität pausiert; Daten bleiben, im Supabase-Dashboard „Resume project“. Die App zeigt dann einen Hinweis.
- **Google Gemini (Free Tier)**: KI „Opettaja“. Limits pro Minute und pro Tag, pro Modell; Tageslimit setzt sich um Mitternacht Pazifik-Zeit zurück (≈ 9 Uhr in Österreich).
- Alternativ in der App wählbar: OpenAI-kompatibler Anbieter (z. B. Groq) oder „ohne KI“.

## Zustand `S` (wird gespeichert und synchronisiert)
Gespeichert in `localStorage["opi-suomea-v1"]`, bei jeder Änderung sofort (`save()`).
- `topics[id]`: `{status: locked|new|learning, ease, interval, reps, lapses, due, last, best, hist[{d,sc,r}], ai{feedback,tips,reason}}`
- `cards["tXX-i"]` (Finnisch → Deutsch) und `cards["tXX-i-r"]` (Deutsch → Finnisch): je Richtung eine eigene SM-2-Karte `{ease, interval, reps, lapses, due, isNew, last}`. Beim Umstieg (Okt. 2026, vorher wechselte eine Karte die Richtung mit `reps`) übernimmt die neue `-r`-Karte den Stand der bisherigen Karte (`addCards`). Pro Tag und Runde nur eine Richtung je Wort (`siblingSeenToday`, `onePerWord`); die neue Gegenrichtung wird frühestens am Tag nach der ersten Richtung neu (eigenes Tageslimit `daily.newRev`, gleich hoch wie „Neue Wörter pro Tag“).
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

Ablauf: lokal sofort speichern → nach 1,2 s in die Cloud. Beim Öffnen/Zurückkehren neueren Cloud-Stand holen. Hat das Gerät **noch nicht synchronisierte** Änderungen (`S.updated > CFG.syncedAt`) und die Cloud ist neuer, werden beide Stände **zusammengeführt** (`mergeStates`: pro Thema/Karte gewinnt der zuletzt geübte Stand, Listen werden vereinigt, gelöste Fehler bleiben gelöst).

**Hochladen nur mit Vergleich** (`pushCloud`): `PATCH … &updated_at=eq.<CFG.remoteAt>` – die Cloud wird nur überschrieben, wenn sie seit dem letzten Abgleich unverändert ist. Sonst: Cloud-Stand holen, zusammenführen, erneut hochladen. Während einer Übung wird nicht zusammengeführt, sondern danach. `CFG.remoteAt` = zuletzt gesehener `updated_at` der Cloud, `CFG.syncedAt` = `data.updated` des zuletzt abgeglichenen Stands (daran erkennt die App ihren eigenen Stand). Lehnt die Cloud den Vergleich ab (HTTP 400), gilt ein Ausweichweg: erst holen und zusammenführen, dann per Upsert schreiben. Beim Schließen der App wird mit `keepalive` gesendet, aber nur unter 64 KB (Browser-Grenze), sonst normal.

**Start & Netz**: Die App zeigt sofort den lokalen Stand, der Cloud-Abgleich läuft danach im Hintergrund (`startupPull`). Alle Supabase-Anfragen haben ein Zeitlimit (`SB_TIMEOUT`, 25 s), damit ein hängender Request den Sync nie dauerhaft blockiert.

**Mehrere Tabs/Fenster**: Jede Änderung wird sofort in `localStorage` geschrieben; ein verborgener Tab schreibt beim Verlassen nichts mehr (ein alter Tab könnte sonst Neueres überschreiben). Über das `storage`-Ereignis übernimmt jeder Tab den neueren Stand des anderen (`mergeStates`) und die Gerätekonfiguration (Token). Schlägt die Token-Erneuerung fehl, weil ein anderer Tab den Token schon erneuert hat, wird dessen Token übernommen statt abzumelden.

## Sicherungen (Fail-safes)
- Vor jedem riskanten Schritt Kopie im localStorage: `-vor-sync`, `-vor-import`, `-vor-reset`, `-vor-loeschen`, `-vor-wiederherstellung` (`safeCopy`). Ist der Speicher voll, werden zuerst diese Kopien gelöscht – der aktuelle Stand geht immer vor.
- Unlesbarer Speicherinhalt wird nie überschrieben, sondern als `opi-suomea-v1-defekt-<Zeit>` aufgehoben.
- **Fortschritt löschen** / **Thema zurücksetzen**: nur nach Eintippen von „LÖSCHEN“ bzw. „ZURÜCKSETZEN“; vorher wird automatisch eine Sicherungsdatei gespeichert (Teilen-Menü am Handy, sonst Download – bricht man das ab, wird nichts gelöscht). Nach dem Löschen bietet *Asetukset* „Gelöschten Stand wiederherstellen“ (aus `-vor-loeschen`), bis wieder Fortschritt da ist; die Wiederherstellung wird wie jede Änderung in die Cloud übertragen.
- Startfehler: statt weißer Seite eine Rettungsansicht mit „Rohdaten sichern“ (alle `opi-suomea-v1*`-Einträge als Datei).
- Cloud: 30 Tagesstände, in der App „Älteren Stand laden“
- PC (Chrome/Edge): automatische Sicherungsdatei, Ort änderbar
- Handy/alle: wöchentliche Erinnerung mit „Sicherung speichern“ (Teilen-Menü) bzw. Download, Dateiname mit Datum
- „Backup kopieren“ (Text), „Sicherung einspielen“, „Notfall-Version herunterladen“ (App als einzelne HTML-Datei)

## Lernlogik
- **Themen**: Theorie → Übungen. Falsche Übungen kommen ca. 4 Aufgaben später wieder, bis sie richtig sind; Wertung nur erster Versuch.
- **Auswertung**: SM-2 + Selbsteinschätzung (Ergebnis < 60 % → höchstens „Nochmal“, < 80 % → höchstens „Schwer“) → Gemini legt den Termin fest (1–180 Tage), sonst gilt SM-2.
- **Gesamtanalyse** nach je 3 Lektionen (oder 1, wenn > 3 Tage her): Niveau, Muster, Termine verschieben, `basicsSolid`.
- **Freischaltung**: ein Thema wird frei, wenn **alle** Voraussetzungen (`req`) beim letzten Ergebnis je ≥ 80 % haben. Gesperrte Themen sind antippbar und zeigen jede Voraussetzung mit letztem Ergebnis, ✓/✗ und dem Weg dorthin (`reqInfo`, `reqHint`); die Themenliste zeigt die Voraussetzungen direkt unter gesperrten Themen; freie Themen zeigen „Baut auf: …“.
- **Freischaltversuch** (`startSession(id,"unlock")`): bei gelernten Themen unter 80 % jederzeit möglich, alle Übungen des Themas, gewertet wie eine normale Wiederholung (Selbsteinschätzung + Opettaja-Termin, Ergebnis wird `last`). Ab 80 % werden abhängige Themen frei. Knopf auf der Themenseite und direkt bei der fehlenden Voraussetzung eines gesperrten Themas.
- **Vokabeln**: Anki-artig, beide Richtungen als getrennte Karten (eigener Termin je Richtung; „Wörter gelernt“ zählt Wörter); getippte Antworten lokal, sonst Gemini prüft Bedeutung.
- **„↶ Zurück“ beim Vokabellernen** (`undoCard`): vor jeder Bewertung ein Schnappschuss (Karte, `daily.newCards`, `stats.reviews`, Warteschlange, Zähler); „Zurück“ stellt ihn exakt her und zeigt die Karte aufgedeckt zur neuen Wahl – mehrfach bis zum Rundenanfang, am Rundenende über „Letzte Bewertung ändern“.
- **Zusätzlich Vokabeln lernen** (Anzahl = `settings.extraCards`): zuerst neue Wörter (zählen normal); sind alle gelernt, gelernte Wörter extra üben (`practiceRate`, nur erste Antwort je Karte): Nochmal = wie ein Fehler (morgen, Abstand von vorn), Schwer = Termin auf halbe Restzeit + Ease −0,15, Gut/Einfach = bei Fälligkeit in ≤ 2 Tagen als normale Wiederholung; sonst Anrechnung nach der echten Pause seit der letzten Wiederholung (neuer Abstand = Pause × Ease, bei Einfach × 1,3; nur wenn später als der bisherige Termin; am selben Tag nichts). Heute schon extra geübte Wörter (`c.xp`) kommen erst, wenn alle anderen dran waren. Wörter, die heute schon extra geübt wurden, tragen das Schild „heute schon N× geübt“ (`c.xpd`/`c.xpn`); sind alle gelernten Wörter heute schon geübt, weist „Heute“/Rundenende darauf hin.
- **Kartenstatus-Begriffe** (`STATE_L`): neu · frisch (Abstand < 4 Tage) · gefestigt (4–20 Tage) · sicher (ab 21 Tagen); Legende über der Vokabelliste.
- **Hörtraining** (Wörter, Schreibweise) und **Hörverstehen** (ganze Sätze, Bedeutung auf Deutsch).
- **Fehler-Training**: offene Fehler (bis 10 je Runde); richtig beim ersten Versuch = gelöst.
- **Neue Übungen von Opettaja** (KI-generiert): erst frei, wenn alle t01–t08 `status=learning`, `last ≥ 0,8`, `reps ≥ 2` **und** die Gesamtanalyse `basicsSolid: true` meldet. Danach je Thema ein Knopf; ändert den Plan nicht.
- **Theorie-HTML** wird mit einer Allowlist bereinigt (`sanitizeHTML`: nur p, h3/h4, table…, i, b, s, ul/ol/li, span, div, code; Attribute nur class/colspan/rowspan).
- **Lektionen laden** (`loadRepoLessons`): ein Thema wird nur komplett übernommen. Ist auch nur eine Übung/Vokabel ungültig oder wurde etwas entfernt, bleibt die bisherige Version (Hinweis in der App). Nie einzelne Einträge herausfiltern – sonst verrutschen Karten-IDs.
- **Wörter antippen**: Wörterbuch aus allen Vokabeln + Verbformen aus Tabellen-Übungen + Endungs-Heuristik + Orte (-ssa/-ssä); sonst fragt Gemini, Ergebnis wird in `S.gloss` gespeichert.

## KI-Protokoll & Token-Statistik
- `S.aiStats[Geräte-ID][Art]`: Zähler je Funktion (Aufrufe, Fehler nach Art, Token ein/aus/Denken, Dauer, verwendete Modelle) – pro Gerät (`CFG.devId`), beim Sync gewinnt je Gerät der höhere Zählerstand, nichts zählt doppelt.
- `S.aiAudit`: die letzten KI-Antworten mit Inhalt (Aufgabe, Musterlösung, Antwort, Urteil, Begründung, Modell, Token) – max. 15 je Art, 80 gesamt, von Matthias markierte („KI lag falsch?“) bevorzugt (bis 20). Beim Sync per ID vereinigt, Markierung bleibt.
- Arten (`AI_KINDS`): pruefung, vokabel, hoeren, auswertung, analyse, wort, frage, uebungen. Erfasst in `claude()`/`claudeJSON(prompt, meta)` über `meta.k`; Gemini liefert `usageMetadata`, OpenAI-kompatible Anbieter `usage`.
- Der „Bericht für Claude“ enthält den Abschnitt **KI-PROTOKOLL** (Statistik + Hochrechnung pro Monat) und **KI-ANTWORTEN zur Qualitätsprüfung** (markierte mit ⚑ zuerst).

## Token-Verbrauch: Einsparpotenzial (für später, wenn die Daten wachsen)
Grundlage ist die Statistik im KI-Protokoll. Hebel, grob nach erwarteter Wirkung:
1. **Gesamtanalyse** schickt den ganzen Lernstand (alle Themen, 20 Fehler, schwache Wörter) – wächst mit jedem Thema. Nur gelernte/geänderte Themen und weniger Fehler senden.
2. **Neue Übungen** schicken bis zu 250 Vokabeln + 1800 Zeichen Theorie – auf die Wörter des Themas und seiner Voraussetzungen beschränken.
3. **Antwortprüfung** läuft nur, wenn die Musterlösung nicht passt – mehr Alternativlösungen in den Lektionen und Tippfehler-Toleranz sparen Aufrufe ohne Qualitätsverlust.
4. **Vokabelprüfung**: Ergebnisse dauerhaft zwischenspeichern (heute nur bis zum Neuladen).
5. **Rundenauswertung** bei 100 % und „Gut/Einfach“ ohne KI (der Algorithmus reicht dort).
6. **Denk-Token**: einfache Aufgaben (Wort, Vokabel) ohne „Thinking“ oder mit Lite-Modell; JSON-Wiederholungen (doppelte Kosten) im Fehlerzähler beobachten.
7. **Modellwahl je Aufgabe (Kontingent schonen, Idee von Matthias):** einfache Aufgaben zuerst mit dem kleinsten Gemini-Modell (Lite) versuchen, damit die größeren Modelle für qualitätskritische Aufgaben (Antwortprüfung, KI-Übungen) frei bleiben. Kandidaten: Wort nachschlagen, Vokabelprüfung, evtl. Rundenauswertung; die Gesamtanalyse eher nicht, weil sie über die Freischaltung der KI-Übungen mitentscheidet. **Nur umsetzen, wenn das KI-Protokoll zeigt, dass die größeren Modelle ihr Limit erreichen** (Fehler `quota-day`/`quota-min` bzw. Lite-Modelle als Ausweiche in der Modellliste). Sonst bringt es nichts und kostet Qualität.
8. Bei einem Wechsel zur Claude API: **Prompt-Caching** für die festen Systemtexte.
9. Sync-Datenmenge: der ganze Stand (inkl. Lektionen und KI-Protokoll, ca. 30 KB) wird bei jeder Antwort hochgeladen – später Lektionen aus dem Sync nehmen bzw. das Protokoll seltener mitschicken.

## KI-Verbindung (Gemini)
`geminiCall`: Modelle nacheinander (`gemini-flash-latest`, `gemini-2.5-flash`, `gemini-flash-lite-latest`, `gemini-2.5-flash-lite`), jedes mit eigenem Kontingent. JSON-Modus, wenig „Thinking“ (`thinkingLevel: low`, bei Ablehnung automatisch ohne), Timeout 30 s, Retry bei 5xx. Fehler werden eingeordnet (`quota-day`, `quota-min`, `overload`, `key`, `timeout`, `offline` …) und verständlich angezeigt. „Verbindung prüfen“ (Einstellungen → Daten & Einstellungen) testet Internet, Schlüssel und jedes Modell und stellt das beste erreichbare ein. Die Funktion heißt aus historischen Gründen `claude()`.
