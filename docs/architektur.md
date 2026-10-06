# Architektur von Opi suomea

## Dateien
| Datei | Zweck |
|---|---|
| `index.html` | Gerüst der App (PWA): Kopfzeile, Navigation, lädt `app.css` und die Skripte in fester Reihenfolge |
| `app.css` | Aussehen (Farben hell/dunkel, Layout; Hover-Effekte nur in `@media (hover:hover)`) |
| `js/app.js` | **App-Einstellungen** (Name, Sprachen, Lehrkraft, Tabs, Logo, Funktionen) – gehört der App, siehe `docs/engine.md` |
| `js/inhalte.js` | Lerninhalte der App (`BASE_TOPICS`, `GLOSS_EXTRA`, ggf. Einstufungstest `PT`) – gehört der App |
| `js/sprache.js` | Sprachmodul der Lernsprache (Antippen, Vokabelhilfe, KI-Prüfregeln) |
| `js/daten.js` | Grundlagen, Zustand `S`, Speichern, Cloud-Sync (`pushCloud`/`pullCloud`/`mergeStates`), Sicherungsdatei am PC |
| `js/lernen.js` | Sprachausgabe, Wiederholungsplan (SM-2), Vokabelkarten, Freischaltung |
| `js/einstufung.js` | Einstufungstest (nur mit `APP.features.placement`): Ansicht, lokale + KI-Prüfung, Bericht, Import, Zusammenführen |
| `js/ki.js` | KI-Lehrkraft (`APP.teacher`): `aiCall`/`aiJSON`, Gemini/OpenAI-kompatibel, KI-Protokoll, Prüfung, Analyse, KI-Übungen, Fragen |
| `js/ansichten.js` | `render()`: Einrichtung, Heute, Themenliste, Themenseite |
| `js/woerterbuch.js` | Wörter antippen (Wörterbuch, Endungen, KI-Nachschlagen), Vokabelhilfe |
| `js/uebungen.js` | Übungs-Sitzung (Themenrunden, Fehler-Training), Prüfung, Auswertung, Abschlussbildschirme |
| `js/vokabeln.js` | Vokabelkarten, Tab Vokabeln, Hörverstehen, Hörtraining |
| `js/formate.js` | **Alle Übungsformate** (mc, gap, tr, ord, tab, les, sch, dlg) über die Schnittstelle `FMT`: Prüfung der Daten, Anzeige, Auswertung, „Weiß ich nicht“, Texte für Fehlerliste/KI. Ein neues Format = ein neuer `FMT`-Eintrag |
| `js/wortschatz.js` | Eigene Wörter (`S.own`, Karten `own-<n>`), Problemwörter üben, Paare zuordnen (Tab Vokabeln) |
| `js/ueberblick.js` | Grammatik-Übersicht (Tab Themen), Lernkalender und Vorschau fälliger Karten (Tab Einstellungen) |
| `js/ki-ueben.js` | Frei üben auf der Themenseite: ab 80 % im Thema Schreiben/Rollenspiel, die die KI-Lehrkraft sich ausdenkt (mit Abwechslung: bisherige Aufgaben, Pflichtwörter, Wendung, Temperatur 0,9), `S.practice` |
| `js/verwaltung.js` | Sicherungen, Notfall-Version, Lektionspakete, Bericht, Einstellungen |
| `js/start.js` | Klick-/Eingabe-Ereignisse (`A`), Fehler-Hinweise (`showViewError`, `rescue`), Start – wird zuletzt geladen |
| `sw.js` | Service Worker: immer zuerst Netz, sonst Cache (offline) |
| `manifest.webmanifest`, `icon-*.png` | Installierbar als App |
| `lektionen/lektionen.json` | Zusätzliche Themen ab t09, werden beim Start automatisch geladen |
| `CLAUDE.md`, `docs/` | Wissen und Regeln für Claude |
| `tools/pruefen.mjs` | Automatische Prüfung (Syntax, Lektionen, Nur-anhängen-Regel, Browser-Durchlauf, Sync mit zwei Geräten) |
| `.github/workflows/` | `pruefen-und-veroeffentlichen.yml`: prüft jeden Push, veröffentlicht nur bei Erfolg; `supabase-wach-halten.yml`: Ping alle 3 Tage + prüft, dass ohne Anmeldung nichts lesbar ist (Row Level Security) |

Hosting: GitHub Pages (kostenlos), veröffentlicht über GitHub Actions – nur wenn `tools/pruefen.mjs` fehlerfrei ist. Kein Build-Schritt.

**Aufbau seit Okt. 2026 (Umbau aus einer Einzeldatei):** normale Skripte (keine Module, kein Build), die sich den globalen Bereich teilen. Die Reihenfolge in `index.html` zählt: Code, der beim Laden sofort läuft, darf nur Funktionen aus derselben oder früher geladenen Dateien aufrufen; alles andere läuft erst nach dem Start (`start.js`). Formatierung: Prettier (`.prettierrc.json`, Breite 120). Die **Notfall-Version** setzt beim Herunterladen alles wieder zu einer einzigen HTML-Datei zusammen (`buildOfflineHTML`). Sicherung des letzten Einzeldatei-Stands: Branch `sicherung/vor-umbau`.

## Kostenlose Dienste
- **Supabase (Free)**: Cloud-Sync. Achtung: Gratis-Projekte werden nach ca. 7 Tagen ohne Aktivität pausiert; Daten bleiben, im Supabase-Dashboard „Resume project“. Die App zeigt dann einen Hinweis.
- **Google Gemini (Free Tier)**: KI „Opettaja“. Limits pro Minute und pro Tag, pro Modell; Tageslimit setzt sich um Mitternacht Pazifik-Zeit zurück (≈ 9 Uhr in Österreich).
- Alternativ in der App wählbar: OpenAI-kompatibler Anbieter (z. B. Groq) oder „ohne KI“.

## Zustand `S` (wird gespeichert und synchronisiert)
Gespeichert in `localStorage["opi-suomea-v1"]`, bei jeder Änderung sofort (`save()`).
- `topics[id]`: `{status: locked|new|learning, ease, interval, reps, lapses, due, last, best, hist[{d,sc,r}], ai{feedback,tips,reason}}`
- `cards["tXX-i"]` (Finnisch → Deutsch) und `cards["tXX-i-r"]` (Deutsch → Finnisch): je Richtung eine eigene SM-2-Karte `{ease, interval, reps, lapses, due, isNew, last}`. Beim Umstieg (Okt. 2026, vorher wechselte eine Karte die Richtung mit `reps`) übernimmt die neue `-r`-Karte den Stand der bisherigen Karte (`addCards`). Pro Tag und Runde nur eine Richtung je Wort (`siblingSeenToday`, `onePerWord`); die neue Gegenrichtung wird frühestens am Tag nach der ersten Richtung neu (eigenes Tageslimit `daily.newRev`, gleich hoch wie „Neue Wörter pro Tag“).
- `own["<n>"]`: eigene Wörter `{fi, de, d, u, del?}` – `n` = eindeutige Zahl (Zeitstempel), Karten `own-<n>` und `own-<n>-r`. Löschen setzt nur `del` (bleibt erhalten, damit der Abgleich es nicht wiederbelebt); beim Zusammenführen gewinnt je Wort der höhere `u`.
- `days["JJJJ-MM-TT"]`: abgeschlossene Runden je Tag (Lernkalender, über `bumpStreak` → `logDay`); beim ersten Start aus Themen-Ergebnissen und Karten ergänzt (`seedDays`), beim Abgleich je Tag der höhere Wert, max. 400 Tage.
- `practice[]`: letzte 20 Ergebnisse von freiem Schreiben (`k:"s"`) und Rollenspiel (`k:"r"`) `{d, k, tid, task, text, fix, errs}` – für den Bericht; beim Abgleich per `d` vereinigt.
- `exStats[Gerät][Typ]`: erste Versuche je Übungsart `{n, ok, ai, aiOk}` (ai = von der KI geprüft, aiOk = davon als richtig gewertet) – für die Gesamtanalyse und um zu prüfen, wie gut die KI neue Formate bewertet; beim Abgleich je Gerät der höhere Stand.
- `activeDone[]`: Startzeiten (`d`) der letzten 20 beendeten/verworfenen Runden – beim Abgleich wird eine dort genannte pausierte Runde nicht wiederbelebt (sonst doppelte Wertung).
- `resets[Thema]` `{at, voc}` und `wiped` (Zeit): Merkzeichen für „Thema zurücksetzen“ bzw. „Fortschritt löschen“. Beim Abgleich gelten ältere Stände des Themas (mit `voc` auch seiner Karten) bzw. ein seit dem Löschen unveränderter Stand als überholt (`applyResets`, Anfang von `mergeStates`); wer danach weitergelernt hat, wird normal zusammengeführt.
- `errors[]`: `{d, topic, ei (Übungsindex, -1 = KI-Übung), q, user, exp, ok?, gx? (KI-Übung selbst)}` max. 80
- `reports[]`: Gesamtanalysen von Opettaja (max. 10)
- `packs[]`: zusätzliche Themen (aus `lektionen.json` oder eingefügten Paketen)
- `settings`: `newCardsPerDay` (5–50), `extraCards` (5–50), `newTopicsPerDay`, `ai`, `slow`, `autoplay`, `theme`
- `active`: pausierte bzw. unterbrochene Runde (`idxs`, `rt` = Wiederholungs-Markierung, `gen`/`gsrc` bei Fehler-Training und KI-Übungen). „Pause“ behält sie, „Runde verwerfen“ löscht sie; `guardActive` fragt vor dem Start einer anderen Runde nach.
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
- **„Neue Version verfügbar“**: Die Veröffentlichung legt `version.json` (Commit) ab; `checkVersion()` vergleicht beim Start, beim Zurückkehren in die App und alle 15 min und zeigt bei Abweichung einen Hinweis mit „Jetzt neu laden“.
- **Prüfung der KI-Übungen durch Claude**: jede erzeugte Übung hat eine ID (`gid`); `S.genReview` (max. 30 Runden, ungeprüfte bleiben immer) speichert Übungen, das eigene Ergebnis (`res`) und Claudes Urteil (`v`). Bericht: Abschnitt „KI-ÜBUNGEN ZUR PRÜFUNG“. Claude trägt Urteile in `lektionen/ki-pruefung.json` ein; `loadGenVerdicts()` lädt sie beim Start, zeigt ✓/✗ (Schild in der Übung, Übersicht auf der Themenseite) und streicht Fehler aus fehlerhaften KI-Übungen (`e.kiFalsch`). Auf „Heute“ eine Karte, solange Übungen ungeprüft sind.
- **Neue Übungen von Opettaja** enthalten eine neu formulierte Regelfrage (`mc` mit `x`) und Hinweise `h`; die vorhandenen Aufgaben des Themas werden mitgeschickt, damit sie nicht wiederholt werden.
- **Neues Thema: erst die Wörter** (`startTopicVocab`, `vocabReady`): Bei einem neuen Thema werden die Übungen erst frei, wenn jede Wortkarte des Themas (beide Richtungen, erst alle fi→de, dann alle de→fi) einmal mit Schwer/Gut/Einfach bewertet wurde (`c.tv`), dann `S.topics[id].vocabDone`. Abbrechen und Weiterlernen möglich; „Wörter kenne ich schon“ überspringt (`vocabDone: "skip"`). Diese Wörter zählen nicht gegen „Neue Wörter pro Tag“. Bereits begonnene Themen sind nicht betroffen. Beim Sync bleibt `vocabDone` erhalten.
- **Freischaltversuch** (`startSession(id,"unlock")`): bei gelernten Themen unter 80 % jederzeit möglich, alle Übungen des Themas, gewertet wie eine normale Wiederholung (Selbsteinschätzung + Opettaja-Termin, Ergebnis wird `last`). Ab 80 % werden abhängige Themen frei. Knopf auf der Themenseite und direkt bei der fehlenden Voraussetzung eines gesperrten Themas.
- **Vokabeln**: Anki-artig, beide Richtungen als getrennte Karten (eigener Termin je Richtung; „Wörter gelernt“ zählt Wörter); getippte Antworten lokal, sonst Gemini prüft Bedeutung.
- **„↶ Zurück“ beim Vokabellernen** (`undoCard`): vor jeder Bewertung ein Schnappschuss (Karte, `daily.newCards`, `stats.reviews`, Warteschlange, Zähler); „Zurück“ stellt ihn exakt her und zeigt die Karte aufgedeckt zur neuen Wahl – mehrfach bis zum Rundenanfang, am Rundenende über „Letzte Bewertung ändern“.
- **Zusätzlich Vokabeln lernen** (Anzahl = `settings.extraCards`): zuerst neue Wörter (zählen normal); sind alle gelernt, gelernte Wörter extra üben (`practiceRate`, nur erste Antwort je Karte): Nochmal = wie ein Fehler (morgen, Abstand von vorn), Schwer = Termin auf halbe Restzeit + Ease −0,15, Gut/Einfach = bei Fälligkeit in ≤ 2 Tagen als normale Wiederholung; sonst Anrechnung nach der echten Pause seit der letzten Wiederholung (neuer Abstand = Pause × Ease, bei Einfach × 1,3; nur wenn später als der bisherige Termin; am selben Tag nichts). Heute schon extra geübte Wörter (`c.xp`) kommen erst, wenn alle anderen dran waren. Wörter, die heute schon extra geübt wurden, tragen das Schild „heute schon N× geübt“ (`c.xpd`/`c.xpn`); sind alle gelernten Wörter heute schon geübt, weist „Heute“/Rundenende darauf hin.
- **Problemwörter** (wie „Leech“ bei Anki): Karten mit ≥ 2× vergessen oder Ease < 2,0 (`weakCards`) tragen ⚠; „Problemwörter üben“ nutzt die Wirkung von „Zusätzlich Vokabeln lernen“ (`practiceRate`).
- **Paare zuordnen**: 5 gelernte Wörter mit ihrer Bedeutung verbinden; ändert den Plan nicht.
- **Freies Schreiben & Rollenspiel** (gelernte Themen, nur mit KI): Die KI bekommt Thema, Theorie-Auszug und bekannten Wortschatz (`practiceContext`). Schreiben = Aufgabe → eigener Text → Korrektur mit Fehlerliste. Rollenspiel = Szene + bis zu 10 Antworten, jede wird kurz korrigiert, am Ende Rückmeldung. Ändert den Plan nicht; KI-Protokoll-Arten `schreiben`, `rollenspiel`; Bericht-Abschnitt „FREIES SCHREIBEN & ROLLENSPIEL“.
- **Dynamik der Wiederholungen** (`sm2Next`, Wunsch von Matthias): Vergessen → Abstand von vorn, Ease −0,2 (öfter); Schwer → kleiner Schritt, Ease −0,14; Gut → Abstand × Ease, gesunkene Ease erholt sich um +0,05 bis 2,5; Einfach → × Ease × 1,3, Ease +0,1. Überfällige, aber gewusste Karten bekommen die Verspätung angerechnet (Gut halb, Einfach ganz). Höchstens 365 Tage. Problemwort (⚠) = ≥ 2× vergessen oder Ease < 2,0, **bis es 3× in Folge gewusst wurde** (`reps`); beim nächsten Vergessen wieder. Themen: der KI-Termin ist nach dem Ergebnis begrenzt (`topicIv`: < 60 % höchstens 2 Tage, < 80 % höchstens doppelter Algorithmus-Abstand, sonst höchstens dreifacher), auch bei Terminen aus der Gesamtanalyse.
- **Kartenstatus-Begriffe** (`STATE_L`): neu · frisch (Abstand < 4 Tage) · gefestigt (4–20 Tage) · sicher (ab 21 Tagen); Legende über der Vokabelliste.
- **Hörtraining** (Wörter, Schreibweise) und **Hörverstehen** (ganze Sätze, Bedeutung auf Deutsch).
- **Fehler-Training**: offene Fehler (bis 10 je Runde); richtig beim ersten Versuch = gelöst.
- **Neue Übungen von Opettaja** (KI-generiert): erst frei, wenn alle t01–t08 `status=learning`, `last ≥ 0,8`, `reps ≥ 2` **und** die Gesamtanalyse `basicsSolid: true` meldet. Danach je Thema ein Knopf; ändert den Plan nicht.
- **Theorie-HTML** wird mit einer Allowlist bereinigt (`sanitizeHTML`: nur p, h3/h4, table…, i, b, s, ul/ol/li, span, div, code; Attribute nur class/colspan/rowspan).
- **Lektionen laden** (`loadRepoLessons`): ein Thema wird nur komplett übernommen. Ist auch nur eine Übung/Vokabel ungültig oder wurde etwas entfernt, bleibt die bisherige Version (Hinweis in der App). Nie einzelne Einträge herausfiltern – sonst verrutschen Karten-IDs.
- **„❓ Frag Opettaja“ in jeder Übung** (`askExercise`): Kontext (Thema, Aufgabe, Musterlösung, ggf. Antwort) geht automatisch mit. Vor dem Prüfen nur Hinweise – die Lösung wird ausdrücklich nicht verraten; nach dem Prüfen volle Erklärung. Kein Einfluss auf die Wertung; Eintrag im KI-Protokoll (Art „frage“, mit „vor/nach dem Prüfen“).
- **Vokabelhilfe** (`vocabHint`) bei Übersetzungen ins Finnische: zeigt die finnischen Grundformen aller Wörter der Musterlösung aus dem eigenen Wortschatz (ohne KI, alphabetisch; Vokabeln des aktuellen Themas haben Vorrang; Verneinung immer als „ei (Verb)“). Wird nicht angeboten, wenn sie die Lösung unverändert verraten würde. Wertung: Übung zählt normal, Vermerk „Mit Vokabelhilfe gelöst“ in der Auswertung, `S.vhelp` (max. 60) im Bericht, die Karte Deutsch → Finnisch des Wortes kommt früher (halbe Restzeit, Ease −0,15, höchstens einmal am Tag).
- **Wörter antippen**: Wörterbuch in dieser Reihenfolge (erster Eintrag gewinnt): `GLOSS_EXTRA` (js/inhalte.js – Einzelwörter aus Redewendungen, Partitivformen, Wörter ohne Lernkarte) → Vokabeln → Verneinungsformen (minä-Form ohne -n: olen → ole) → Verbformen aus Tabellen-Übungen; danach Zahlen (-toista/-kymmentä), Endungs-Heuristik mit Vermerk (-ssa = in …) und Orte. Redewendungen („ole hyvä“) werden nie in Einzelwörter zerlegt, sondern nur zusätzlich angezeigt, wenn sie im angetippten Satz stehen. Sonst fragt Gemini, Ergebnis wird in `S.gloss` gespeichert. `pruefen.mjs` verlangt für jedes finnische Wort der Grundthemen eine Bedeutung ohne KI.

## KI-Protokoll & Token-Statistik
- `S.aiStats[Geräte-ID][Art]`: Zähler je Funktion (Aufrufe, Fehler nach Art, Token ein/aus/Denken, Dauer, verwendete Modelle) – pro Gerät (`CFG.devId`), beim Sync gewinnt je Gerät der höhere Zählerstand, nichts zählt doppelt.
- `S.aiAudit`: die letzten KI-Antworten mit Inhalt (Aufgabe, Musterlösung, Antwort, Urteil, Begründung, Modell, Token) – max. 15 je Art, 80 gesamt, von Matthias markierte („KI lag falsch?“) bevorzugt (bis 20). Beim Sync per ID vereinigt, Markierung bleibt.
- Arten (`AI_KINDS`): pruefung (Lücke/Übersetzung), schreibaufgabe, dialog, vokabel, hoeren, auswertung, analyse, wort, frage, uebungen, schreiben (freies Schreiben), rollenspiel. Längere Texte (Schreiben, Rollenspiel mit ganzem Gespräch) werden ausführlicher protokolliert, max. 100 Einträge.
- Die **Gesamtanalyse** bekommt zusätzlich die Statistik je Übungsart, die letzten freien Schreib-/Rollenspiel-Ergebnisse und die eigenen Wörter und beurteilt die Fertigkeiten Lesen, Schreiben und Gespräch (`skills`, sichtbar unter Einstellungen). Erfasst in `aiCall()`/`aiJSON(prompt, meta)` über `meta.k`; Gemini liefert `usageMetadata`, OpenAI-kompatible Anbieter `usage`.
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
`geminiCall`: Modelle nacheinander (`gemini-flash-latest`, `gemini-2.5-flash`, `gemini-flash-lite-latest`, `gemini-2.5-flash-lite`), jedes mit eigenem Kontingent. JSON-Modus, wenig „Thinking“ (`thinkingLevel: low`, bei Ablehnung automatisch ohne), Timeout 30 s, Retry bei 5xx. Fehler werden eingeordnet (`quota-day`, `quota-min`, `overload`, `key`, `timeout`, `offline` …) und verständlich angezeigt. „Verbindung prüfen“ (Einstellungen → Daten & Einstellungen) testet Internet, Schlüssel und jedes Modell und stellt das beste erreichbare ein.
