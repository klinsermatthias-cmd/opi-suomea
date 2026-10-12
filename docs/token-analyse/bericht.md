# Token-Analyse – Gesamtbericht (12.10.2026)

Eigener Analyse-Chat, nur lesend, Effort high. Branch `claude/language-app-token-analysis-b75s4a`, Ordner `docs/token-analyse/`.
Rohdaten: `messwerte.md`. Testskript: `werkzeuge/prueflisten-test.mjs`. Codes für Matthias: `T-1012-<Nr>` (T = Token-Analyse).

**Kennzeichnung:** **[gemessen]** = hier selbst gemessen oder getestet · **[im Programm geprüft]** = in Claude Code 2.1.296 nachgesehen, Wirkung nicht live getestet · **[Schätzung]** = aus eigenem Wissen bzw. abgeleitet, nicht gemessen.

---

## 1. Kurzfazit
1. **Der Code und die Startlektüre sind nicht mehr das Problem.**
   - Die Empfehlungen vom 8.10. (S-1008-97 bis -104) sind fast alle umgesetzt.
   - Die feste Startlektüre ist von 31.000 bzw. 44.000 auf etwa 13.000 (Funktionen) bzw. 11.000 Tokens (Inhalte) gesunken **[gemessen]**.
   - `tools/pruefen.mjs` läuft 39 s und gibt etwa 1.600 Tokens aus **[gemessen]**.
2. **Wenn auch Kleinigkeiten teuer sind, liegt das an der Länge der Chats.**
   - Bei jedem Arbeitsschritt (jeder Werkzeugaufruf) liest das Modell den **ganzen** bisherigen Chat neu **[gemessen an diesem Chat]**.
   - Die Chats haben ein Fenster von 1 Million Tokens und werden erst „umgesiedelt“, wenn sie sehr lang sind. Der Funktionen-Chat steht seit dem 7.10. in Generation 4.
   - Beispiel: Ein Chat mit 400.000 Tokens Kontext braucht für eine Kleinigkeit mit 8 Schritten rund **3,2 Mio. Tokens**. Derselbe Auftrag in einem Chat mit 60.000 Tokens Kontext braucht rund 0,5 Mio. **[Schätzung, Rechenweg in 3.1]**.
3. **Zweiter Treiber ist `effortLevel: "high"` als Standard für alle Sitzungen** (F-1011-1, 11.10.). Denktokens sind Ausgabetokens und damit die teuerste Art.
4. **Dritter Treiber ist der Ablauf um jede Änderung herum.**
   - Dazu gehören: erklären → fragen (mit Code) → ändern, Prüfliste von Hand, Quellen per Browser, Push, CI-Status abfragen und andere Chats per `send_message` wecken.
   - 91 von 241 Commits seit dem 5.10. ändern nur Doku oder Verwaltung (Session-IDs, Ideen, Startdateien) **[gemessen]**.
   - Die CI-Abfrage aus der Startdatei des Inhalts-Chats kostet jedes Mal etwa 4.800 Tokens **[gemessen]**.
5. **Prüfskripte nicht streichen.** Sie sind billig, weil die Maschine die Arbeit macht und nicht Claude.
   - Teuer sind die **Handprüfungen**: die Prüfliste Punkt für Punkt und die Quellen per Browser.
   - Drei Punkte der Inhalts-Prüfliste lassen sich automatisieren. Der Test fand dabei **6 doppelte Vokabelkarten**, **6 Theorie-Tabellen mit 4 Spalten** und **20 Themen mit weniger als 2 Regelfragen**, obwohl die Liste von Hand durchgegangen wird **[gemessen]**. Automatisch zu prüfen ist also billiger **und** besser.

**Erwartete Gesamtwirkung bei Umsetzung von T-1012-9 bis -18:** etwa **50–75 % weniger Tokens pro Anfrage**, bei Kleinigkeiten in alten Chats noch mehr **[Schätzung]**. Die Prüfung der Lerninhalte wird dabei strenger, nicht lockerer.

---

## 2. Was ich geprüft habe
| Bereich | Wie | Ergebnis |
|---|---|---|
| Verläufe der anderen Chats (T-1012-1) | `get_session` | ✗ nicht lesbar (anderes Konto). Ersatz: Messung an diesem Chat, Regeln, Commits |
| Startlektüre je Chat (beide Repos) | Bytes aller Pflichtdateien | Funktionen ≈ 13.300, Inhalte ≈ 10.900, Deutsch-Trainer ≈ 7.100 + CLAUDE-Anteil |
| CLAUDE.md | Abschnittsgrößen | 15,9 KB ≈ 4.800 Tokens, ≈ 45 % betreffen nur einen Chat |
| Prüfskripte | Lauf in beiden Repos, Module gezählt | grün; 39 s / 32 s; 71 Zeilen Ausgabe |
| Prüflisten | Inhalt gegen Prüfskript; eigenes Testskript | Punkte 6, 8, 9 automatisierbar; Funde s. o. |
| CI-Abfrage | Größe gemessen | 15.953 B pro Abfrage, gefiltert 1 Zeile |
| Commits seit 5.10. | nach Dateien eingeteilt | 140 App/Werkzeuge, 10 Inhalte, 91 nur Doku/Verwaltung |
| Claude-Code-Einstellungen | Programm 2.1.296 durchsucht | `autoCompactWindow` (100.000–1.000.000) vorhanden |
| Auswertungs-Kette, Routinen, Engine-Übernahme | Startdateien, Workflows | doppelte Prüfungen, großer Chat wird nur zum Starten geweckt |
| Prüfung vom 8.10. (S-1008-93) | Code für Code | umgesetzt: -97, -98, -99, -100, -102, -103, -104; teilweise: -101 (drei Quellen für künftige Themen bestehen noch); offen/nicht nötig: -105, -106 |
| Quellen (Wiktionary, KS) | Abruf versucht | ✗ aus dieser Umgebung gesperrt – Größe nur geschätzt |

---

## 3. Wo die Tokens hingehen

### 3.1 Rechenweg „Kleinigkeit im langen Chat“ [Schätzung auf Grundlage der Messung an diesem Chat]
- Jeder Modellschritt (Antwort oder Werkzeugaufruf) verarbeitet den ganzen bisherigen Chat. Der Großteil kommt aus dem Zwischenspeicher (Cache). Er ist billiger, zählt aber trotzdem für Kosten und Limits.
- Gemessen an diesem Chat: Nach 6 Schritten waren es 312.672 Cache-Tokens bei 80.000 Tokens Kontext.
- Eine typische Kleinigkeit nach den heutigen Regeln besteht aus etwa 6–10 Schritten:
  - Startdatei bzw. Datei lesen
  - Erklärung mit Code und Rückfrage (eine Runde)
  - nach dem OK: ändern, Prüfliste, `pruefen.mjs`, Commit und Push
  - CI-Status abfragen, Startdatei aktualisieren
  - eventuell `send_message` an einen anderen Chat. Das löst dort noch einmal dasselbe aus.
- Das ergibt:

| Chatlänge (Kontext) | 8 Schritte ≈ |
|---|---|
| 60.000 | 0,5 Mio. Tokens |
| 200.000 | 1,6 Mio. |
| 400.000 | 3,2 Mio. |
| 800.000 | 6,4 Mio. |

→ **Die Chatlänge zählt mehr als alles andere.** Eine Datei mit 5.000 Tokens weniger spart in einem 400.000-Token-Chat nur gut 1 %.

### 3.2 Denktokens (Effort) [Schätzung]
- `high` lässt das Modell auch bei „trage die Session-ID ein“ ausführlich nachdenken.
- Denktokens sind Ausgabetokens. Sie kosten ein Vielfaches von Cache-Tokens.
- Der Startwert gilt seit dem 11.10. für **alle** neuen Sitzungen (`.claude/settings.json`).

### 3.3 Ablauf und Abstimmung [gemessen bzw. aus Regeln abgeleitet]
- 38 % der Commits sind reine Verwaltung. Allein das Umsiedeln am 12.10. brauchte 4 Commits in 2 Chats (Startdatei, 2× Session-ID, Ideen).
- Session-IDs stehen in mehreren Dateien (`docs/chats/funktionen.md`, `docs/chats/inhalte.md`, beim Deutsch-Trainer die Übergabe). Bei jedem Umsiedeln werden sie in mehreren Chats nachgetragen.
- Die **Auswertungs-Kette** (alle 3 Tage) läuft so:
  1. `send_later` weckt den **großen** Inhalts-Chat, nur damit er eine Sitzung startet.
  2. Die Sitzung wertet aus, läuft `pruefen.mjs` und pusht einen Branch.
  3. Sie weckt per `send_message` wieder den großen Inhalts-Chat.
  4. Der Inhalts-Chat zeigt das Ergebnis, prüft nach dem OK noch einmal die Prüfliste, lässt `pruefen.mjs` erneut laufen, pusht, fragt den CI-Status ab und archiviert.
  
  Das sind zwei volle Runden im großen Chat und eine doppelte Prüfung.
- **Engine-Push:**
  - Der Funktionen-Chat prüft den Deutsch-Trainer zusätzlich lokal (Schritt 3 der Startdatei), verfolgt den Lauf mit `gh run watch` und kontrolliert danach die Übernahme.
  - Die Action „Engine übernehmen“ prüft aber selbst mit den Deutsch-Trainer-Inhalten und übernimmt nur bei Grün.
  - Der lokale Lauf ist damit eine zweite Sicherung. Sie ist nur bei sprachabhängigen Änderungen nötig.
- **CI-Status:** `curl …/actions/runs?head_sha=…` liefert 16 KB JSON, etwa 4.800 Tokens **pro Abfrage**. Bei 2–3 Abfragen pro Push sind das 10.000–15.000 Tokens nur fürs Warten.

### 3.4 Dokumente [gemessen]
- `CLAUDE.md` (4.800 Tokens) steht in jeder Anfrage jedes Chats. Davon braucht nur ein Chat:
  - „Typischer Ablauf“ (2.462 B, nur Inhalte)
  - „Regeln für Änderungen an der App“ (2.066 B, nur Funktionen)
  - die Einzelheiten zu Umsiedeln und Chat-Länge in „Code-Chats“ (≈ 2.000 von 4.279 B, nur selten)
- `docs/pruefliste-engine.md` und `docs/engine.md` sind Pflichtlektüre beim **Start**, gebraucht werden sie erst **vor dem Push** bzw. bei Engine-Änderungen.
- `docs/entscheidungen.md` wächst um etwa 6 KB pro Tag (31 KB seit 8.10.). Es wird zwar nur angehängt, sollte aber monatlich ins Archiv.
- Veraltet bzw. doppelt: `docs/simulation.md` (nur Verweis), `docs/simulationen/uebergabe.md` (8.10.). Für künftige Themen gibt es drei Quellen: `abdeckung.md`, `entwuerfe-bis-b1.md`, Themenplan 47 KB. Dazu kommt der A2-Entwurf auf einem Branch.

### 3.5 Prüfskripte [gemessen]
- Laufzeit 39 s, Ausgabe etwa 1.600 Tokens, beides unkritisch. 70 von 71 Zeilen sind „✓“, für Claude also wertlos.
- Teuer wird es, wenn ein Test **hinzugefügt** werden soll: `durchlauf.mjs` hat 78 KB (≈ 23.500 Tokens) und 266 Prüfstellen. Gezielt lesen ist schon Regel (S-1008-99).

---

## 4. Prüfskripte: was kritisch ist, was schlanker geht

### 4.1 Einteilung
| Modul / Werkzeug | Schützt | Einstufung | Empfehlung |
|---|---|---|---|
| `statisch.mjs`: lektionen.json, Themen-IDs, ki-pruefung.json, Hinweistexte `h`, Nur-anhängen, Einstufungstest-IDs | **Lerninhalte + Fortschritt** | **kritisch** | behalten; Prüflisten-Punkte 6/8/9 hier ergänzen (T-1012-19) |
| `inhalte.mjs`: jede Übung mit Musterlösung lösbar, Antippen, Wortprüfung neuer Themen, Einstufungstest, 390 px | **Lerninhalte** | **kritisch** | behalten |
| `sync.mjs` (21), `sicherungen.mjs` (15) | **Fortschritt geht nie verloren** | **kritisch** | behalten |
| `durchlauf.mjs` (266): Engine mit Test-Inhalten | Engine-Funktionen | wichtig bei Engine-Änderungen | behalten (billig); nur Ausgabe kürzen |
| `ki.mjs` (25): Bewertungsregeln, KI-Aufträge | **richtige Bewertung** (Länge ≠ Tippfehler, strenge Lücken) | kritisch für Lernqualität | behalten |
| `befunde.mjs`, `sprachen.mjs` | frühere Fehler, Deutsch-Trainer | Regressionsschutz | behalten |
| `tools/simulation.mjs` (107 KB) | Langzeitverhalten | läuft nur im Simulations-Chat (zweites Konto) | keine Kosten hier; nicht ändern |
| `tools/test-inhalte.js`, `test-app*.js`, `test-lektionen.json` | feste Testdaten | Vorrichtung | behalten |
| Lokaler Deutsch-Trainer-Lauf im Funktionen-Chat | doppelt zur Action „Engine übernehmen“ | verlagerbar | nur bei sprachabhängigen Änderungen (T-1012-16) |
| Zweiter `pruefen.mjs`-Lauf im Inhalts-Chat nach Übernahme einer Auswertung | doppelt zur Auswertungs-Sitzung + CI | verlagerbar | CI genügt (T-1012-15) |
| **Prüfliste von Hand** (Inhalte 10 Punkte, Engine ≈ 30 Zeilen) | Lernqualität | teuer und lückenhaft | automatisierbare Punkte ins Skript, Rest bleibt von Hand (T-1012-19) |

**Fazit:** Kein Test sollte entfallen. Das Prüfskript ist der billigste Qualitätsschutz, den es gibt. Gespart wird bei der Ausgabe, bei doppelten Läufen und bei Handarbeit.

### 4.2 Test „Prüfliste automatisch“ [gemessen, Skript `werkzeuge/prueflisten-test.mjs`]
Opi suomea, 58 Themen, 854 Karten:
- **Doppelte Karten** (Punkt 6, F-1008-3):
  - t13-21 *suomalainen* = t04b-0
  - t14c-1 *ruoka* = t12c-1
  - t16-8 *hotelli* = t05-5
  - t18-9 *kuuma* = t14c-0
  - t19-23 *matkustaa* = t12-8
  - t15c-4 *tässä* = t10-11. Die Bedeutung ist hier anders, das ist vermutlich gewollt.
- **Theorie-Tabellen mit 4 Spalten** (Punkt 8, höchstens 3): t08d, t13c, t14, t16, t16d, t19. Der 390-px-Test besteht trotzdem.
- **Weniger als 2 Regelfragen** (Punkt 9 bzw. CLAUDE.md Nr. 16, `mc` mit `x`): 20 Themen, Liste in `messwerte.md`. Ob das reine Wortschatz-Themen sind, muss der Inhalts-Chat entscheiden.
- **Deutsch-Trainer** (3 Themen): keine Funde.

→ Diese Funde sind **nicht korrigiert**, weil dieser Chat nichts ändert. Sie gehen als Auftrag an den Inhalts-Chat (T-1012-19). Nach dem Nur-anhängen-Grundsatz bleiben doppelte Karten im Array stehen. Wie man sie entschärft (z. B. Markierung oder bewusst gewollt), muss der Inhalts-Chat entscheiden.

---

## 5. Empfehlungen (je mit Code, nach Wirkung sortiert)

| Code | Was | Einsparung | Qualitätsrisiko | Aufwand | Wer | Beleg |
|---|---|---|---|---|---|---|
| **T-1012-9** | `"autoCompactWindow": 200000` in `.claude/settings.json` (beide Repos) | sehr hoch: Kontext bleibt ≤ 200.000 statt bis 1 Mio. | gering: Startdateien sichern das Wissen; vor dem Zusammenfassen Startdatei aktuell halten | klein | Funktionen | im Programm geprüft |
| **T-1012-10** | Regel „ein Thema = kurzer Chat“: nach jedem abgeschlossenen Thema `/compact` mit Behalte-Liste; Umsiedeln, sobald `/context` > 150.000; tägliche Prüfung entfällt | sehr hoch | gering | klein (CLAUDE.md) | Funktionen (nach OK) | Schätzung |
| **T-1012-11** | Effort-Standard `medium` statt `high` (F-1011-1 zurücknehmen); `high` für Inhalte schreiben, Quellenprüfung, Sync-, KI- und Bewertungslogik; `low` für Verwaltung (IDs, Ideenliste) | hoch (Denktokens) | gering, weil `high` bleibt, wo Qualität zählt | klein | Funktionen | Schätzung |
| **T-1012-12** | Kleinigkeiten ohne Rückfrage-Runde: reine Doku/Verwaltung (Session-IDs, Ideenliste, Startdatei) direkt erledigen und gesammelt melden, ohne Code; mehrere Fragen in **einer** Nachricht | mittel–hoch (38 % der Commits) | keins (App und Inhalte bleiben „erst fragen“) | klein (CLAUDE.md Nr. 12) | Funktionen (nach OK) | gemessen (Commits) |
| **T-1012-13** | CI-Status nur gefiltert abfragen (eine Zeile statt 16 KB); kleines Skript `tools/ci-status.mjs` oder Einzeiler in den Startdateien; `gh run watch` nur mit `--exit-status`, ohne Protokoll | ≈ 4.800 Tokens pro Abfrage | keins | sehr klein | Funktionen + Inhalte | gemessen |
| **T-1012-14** | `pruefen.mjs`-Kurzmodus: nur ✗/⚠ und Schlusszeile, `--lang` für alles; Standard kurz | ≈ 1.500 Tokens pro Lauf | keins (Fehler werden weiter voll ausgegeben) | klein | Funktionen | gemessen (71 → 2 Zeilen) |
| **T-1012-15** | Auswertungs-Kette: `send_later` weckt nicht den großen Inhalts-Chat, sondern eine **kleine Starter-Sitzung** (nur dafür); Ergebnis an Matthias direkt aus der Auswertungs-Sitzung (eigener Chat, gleiches Konto), nach OK übernimmt **diese** Sitzung auf main; kein zweiter Prüflauf (CI prüft) | hoch (zwei volle Runden im großen Chat alle 3 Tage) | gering: gleiche Prüfungen, nur einmal | mittel | Inhalte | abgeleitet |
| **T-1012-16** | Engine-Push: lokaler Deutsch-Trainer-Lauf nur bei Änderungen an sprachabhängigem Code (`js/sprache.js`, APP-Texte, Einstufungstest, Bewertung); sonst genügt die Action „Engine übernehmen“ (prüft selbst mit Deutsch-Trainer-Inhalten, übernimmt nur bei Grün) | mittel | gering: Fehler fällt eine Stufe später auf, App bleibt unverändert | sehr klein | Funktionen | Workflow gelesen |
| **T-1012-17** | CLAUDE.md von 16 KB auf ≈ 7 KB: „Typischer Ablauf“ → `docs/chats/inhalte.md`; „Regeln für Änderungen an der App“ → `docs/chats/funktionen.md`; Umsiedeln, Chat-Länge und Weiterleiten → neue `docs/chats/regeln.md` (nur bei Bedarf lesen); im Kern bleiben: öffentliches Repo, Chat-Tabelle, Matthias' 16 Regeln, Quellenpflicht, Codes (kurz), Tokens sparen | ≈ 2.700 Tokens in **jedem** Schritt jedes Chats | gering: nichts wird gelöscht, nur verschoben; Matthias' Regeln bleiben im Kern | mittel | Funktionen (CLAUDE.md nur nach OK) | gemessen |
| **T-1012-18** | Session-IDs nur noch in **einer** Datei (`docs/chats/sessions.md`), Startdateien verweisen darauf | klein–mittel (je Umsiedeln 1 Commit statt 2–4) | keins | klein | Funktionen | gemessen (Commits 12.10.) |
| **T-1012-19** | Prüflisten-Punkte 6 (doppelte Karten), 8 (Tabellenspalten), 9 (Regelfragen je Grammatikthema) automatisch in `statisch.mjs`; diese Punkte aus der Handprüfung streichen; die 6/6/20 Funde vom Inhalts-Chat bewerten lassen | mittel + **bessere Qualität** | keins (strenger als heute) | klein–mittel | Funktionen (Test), Inhalte (Funde) | gemessen (Skript) |
| **T-1012-20** | `tools/quellen.mjs` (E-1009-22) vorziehen: gibt je Wort nur Beugungsklasse und Kernformen aus (Wiktionary-Vorlage, KS-Stichwort), statt ganzer Seiten bzw. Browser-Ausgaben | mittel–hoch bei jeder Quellenprüfung | keins (Quellenpflicht bleibt, wird billiger) | mittel | Funktionen | Schätzung (Quellen hier gesperrt) |
| **T-1012-21** | Pflichtlektüre beim Start kürzen: `docs/pruefliste-engine.md` erst vor dem Push, `docs/engine.md` nur bei Engine-Änderungen lesen | ≈ 4.300 Tokens pro Funktionen-Chat | keins | sehr klein | Funktionen | gemessen |
| **T-1012-22** | Aufräumen ins Archiv: `docs/simulation.md`, `docs/simulationen/uebergabe.md`, monatlich `entscheidungen.md`; nach der A2-Übernahme `entwuerfe-bis-b1.md` und Themenplan (S-1008-101 abschließen) | klein (nur Grep-Treffer) | keins (wörtlich ins Archiv) | klein | Funktionen + Inhalte | gemessen |
| T-1012-23 *(optional)* | Modellwahl: Verwaltung, Doku und Routine-Abfragen mit Sonnet; Inhalte, Quellenprüfung, Auswertung und Sync weiter mit Opus | mittel | gering, wenn strikt getrennt | klein | Matthias beim Anlegen | Schätzung |

**Bewusst nicht empfohlen:**
- **Prüftests streichen:** Sie sind billig und schützen Lernqualität und Fortschritt.
- **Quellenpflicht lockern:** Sie wird stattdessen billiger gemacht (T-1012-20).
- **`lektionen.json` teilen und `architektur.md` kürzen:** wie am 8.10. begründet, hohes Risiko bei kleinem Nutzen.
- **Den Simulations-Chat einstellen:** Er läuft auf dem zweiten Konto und belastet dieses Limit nicht.

**Empfohlene Reihenfolge:**
1. T-1012-9, -11, -13, -14, -21: sofort, sehr klein.
2. T-1012-10, -12, -17, -18: Regeln in CLAUDE.md, ein Durchgang.
3. T-1012-15, -16, -19: Abläufe.
4. T-1012-20, -22, -23: danach.

---

## 6. Erwartete Wirkung [Schätzung]
| Fall | heute | danach |
|---|---|---|
| Kleinigkeit im alten Chat (400.000 Kontext, 8 Schritte, high) | ≈ 3,2 Mio. Tokens + viel Denken | ≈ 0,6–1 Mio. (Kontext ≤ 150.000, weniger Schritte, medium) |
| Startlektüre Funktionen-Chat | ≈ 13.300 | ≈ 6.300 (T-1012-17, -21) |
| Startlektüre Inhalte-Chat | ≈ 10.900 | ≈ 7.000 (T-1012-17) |
| CI-Status je Push (2–3 Abfragen) | ≈ 10.000–15.000 | < 100 |
| Ausgabe `pruefen.mjs` je Lauf | ≈ 1.600 | ≈ 50 |
| Auswertung alle 3 Tage | Auswertungs-Sitzung + 2 Runden im großen Chat + 2. Prüflauf | Auswertungs-Sitzung + kleine Starter-Runde |

---

## 7. Tests für Matthias (zum Nachmessen)
1. **Vor der Umsetzung:** In jedem Chat `/context` eingeben und die Zahl notieren. Bei mehr als 150.000 ist das der Hauptgrund für die Kosten.
2. **Nach T-1012-9/-11:** dieselbe Kleinigkeit (z. B. „Idee X auf die Ideenliste“) in einem frischen Chat geben und `/cost` vorher und nachher vergleichen.
3. **Nach T-1012-14:** `node tools/pruefen.mjs` gibt bei Grün nur noch 1–2 Zeilen aus.

---

## 8. Übergabetexte (zum Einfügen, erst nach OK zu den Codes)

**→ „App-Engine: Funktionen“**
```
Auftrag aus der Token-Analyse (Branch claude/language-app-token-analysis-b75s4a, docs/token-analyse/bericht.md), OK von Matthias zu: <Codes eintragen>.
Bitte nur den Bericht-Abschnitt 5 lesen (Grep "^## 5"), nicht den ganzen Ordner.
T-1012-9 autoCompactWindow 200000 in .claude/settings.json (auch Deutsch-Trainer).
T-1012-11 effortLevel "medium" (F-1011-1 zurücknehmen), high/low nach Aufgabe in den Startdateien.
T-1012-13 CI-Status gefiltert (tools/ci-status.mjs oder Einzeiler), Startdateien anpassen.
T-1012-14 Kurzmodus für pruefen.mjs (Standard: nur ✗/⚠ + Schluss; --lang für alles), Test dazu.
T-1012-16 lokaler Deutsch-Trainer-Lauf nur bei sprachabhängigen Änderungen (Startdatei Schritt 3).
T-1012-17/-18/-10/-12 CLAUDE.md verschlanken und Regeln anpassen (CLAUDE.md nur mit OK; wörtlich verschieben, nichts löschen).
T-1012-19 Prüflisten-Punkte 6/8/9 als Test in statisch.mjs (Vorlage: docs/token-analyse/werkzeuge/prueflisten-test.mjs auf dem Branch); bestehende Funde zunächst als Hinweis (warn), damit main grün bleibt; Inhalts-Chat informieren.
T-1012-21 Pflichtlektüre beim Start kürzen.
Sicherungs-Branch vorher, Prüfliste, pruefen.mjs, Engine übernehmen wie gewohnt.
```

**→ „Opi suomea (Lerninhalte)“**
```
Auftrag aus der Token-Analyse (docs/token-analyse/bericht.md auf Branch claude/language-app-token-analysis-b75s4a, nur Abschnitt 4.2 und 5 lesen). OK von Matthias zu: <Codes>.
T-1012-19 Funde bewerten: doppelte Karten t13-21/t04b-0 suomalainen, t14c-1/t12c-1 ruoka, t16-8/t05-5 hotelli, t18-9/t14c-0 kuuma, t19-23/t12-8 matkustaa, t15c-4/t10-11 tässä (gewollt?); Tabellen mit 4 Spalten t08d t13c t14 t16 t16d t19; Regelfragen < 2 in 20 Themen (Liste messwerte.md) – nur Grammatikthemen ergänzen. Nur anhängen, Quellen wie immer.
T-1012-15 Auswertungs-Kette umbauen (kleine Starter-Sitzung, Übernahme durch die Auswertungs-Sitzung nach OK, kein zweiter Prüflauf).
T-1012-13 CI-Status nur gefiltert abfragen.
T-1012-22 nach A2-Übernahme entwuerfe-bis-b1.md und Themenplan ins Archiv.
```
