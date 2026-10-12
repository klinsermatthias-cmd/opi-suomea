# Auftrag an den Deutsch-Trainer-Chat (Lehrinhalte) – Ergebnis der Inhaltsprüfung S-1011

> Von Matthias zu kopieren und im Chat „Deutsch-Trainer (Lehrinhalte)“ einzufügen. Gilt erst mit seinem OK
> (S-1011-10 und S-1011-20: alles; S-1011-11: nur Korrekturen in d01–d03; S-1011-18: Einstufungstest).

---

Der Simulations-Chat hat im Auftrag von Matthias die Themen **d01–d03**, den **Themenplan** und den
**Einstufungstest** des Deutsch-Trainers (Stand 8ca1818) genau geprüft: unabhängige Prüfer, je eine Schiedsrunde mit
eigenem Nachschlagen (Code in node nachgestellt), eigene Kontrolle. Quellen: Duden, DWDS, grammis, Wiktionary,
ostarrichi, ÖIF-Einstufungsmatrizen A1–B2 und Rahmencurricula A2/B1/B2.

**Ergebnis kurz:** Das Deutsch ist richtig. Probleme: (1) *Satz ordnen* wertet in 16 Übungen richtige Wortstellungen
als falsch (ohne KI geprüft); (2) Hinweise verraten die Kernentscheidung (als/wenn/wann, haben/sein); (3) einzelne
Theorie-Regeln falsch oder zu absolut, vor allem fehlt das Gesamtsystem; (4) Übungen zu gelenkt; (5) Themen zu groß;
(6) Plan: Grundlagen in falscher Reihenfolge, A1/A2-Lücken fehlen; (7) Einstufungstest: mehrdeutige Lücken, fehlende
Varianten, Einstufung „B1-“ nicht belastbar (Profil statt Gesamtniveau).

## Woher die Details kommen
Repository `klinsermatthias-cmd/opi-suomea` (öffentlich), Branch `pruefung/deutsch-inhalte-2026-10-11`, Ordner
`docs/pruefungen/deutsch/`:
```
git clone --depth 1 -b pruefung/deutsch-inhalte-2026-10-11 https://github.com/klinsermatthias-cmd/opi-suomea /tmp/opi-pruefung
```
- **`plan-final.md`** – der endgültige Themenplan (33 Themen, Niveau, Situation, Baustein, `req`, behobene Schwäche).
- **`schied/d01.md`, `schied/d02.md`, `schied/d03.md`** – Endurteile je Fund zu d01–d03 mit exakter Korrektur und Beleg.
- **`schied/test-aufgaben.md`, `schied/test-bewertung.md`** – Endurteile zum Einstufungstest.
- Umsetzen nur **BESTÄTIGT, ABGESCHWÄCHT, VERSCHÄRFT, TEILWEISE** (bei TEILWEISE nur den bestätigten Teil);
  **ÜBERTRIEBEN, FALSCH, DOPPELT, OFFEN ignorieren**. [N] verweist auf `schied/eingang-*.md` (Wortlaut des Prüfers).
- `bericht.md` – Gesamtergebnis; `funde/` – Erstprüfung (Inventar, Abdeckung, Großes Bild, Unterthemen).

## Was zu tun ist – nach Priorität (erst erklären, D-Codes vergeben, nach Matthias' OK ändern)
1. **Akzeptanz (ord/tab, ohne KI):** alle richtigen Wortstellungen in `a` ergänzen – d01 e19, e20, e56; d02 e9, e10,
   e11, e12, e49, e50, e51, tab e1 „zuhause“; d03 e14, e15, e16, e54, e55, e56, tab e61 „wohl fühlen“.
2. **Hinweise neutral:** d03 e4–e6, e41–e43 → „when (als, wenn or wann?)“; d01 e24/e58 ohne haben/sein-Vorgabe;
   d01 e2/e60 und d02 e0/e55 ohne Lösung der ersten Zeile.
3. **Theorie-Fehler:** d02 V2-Regel nur für Aussage/W-Frage + Verb-Erst (Ja/Nein-Frage, Bitte), MC e23 anpassen;
   d01 Stellungsregel, haben/sein-Regel (fahren mit Objekt, wandern, Zustandsänderung) und `x` in e28; d03 „wenn = if“
   (Theorie und Karte v1), „wann“ als direktes Fragewort, „als Kind“, „nachdem“, Präteritum/Perfekt in Österreich.
   Wortlaut: jeweils im Schied-Fund.
4. **`req`:** d02 → `["d01"]`. d03 → `["d01","d02","d09"]`, **nur falls d03 bei Aurora noch gesperrt ist** (d03 nach
   d09, vor d10, siehe `plan-final.md`); `refreshUnlocks()` sperrt freigeschaltete Themen nie wieder.
5. **Gesamtbild + Übungen anhängen** (Matthias' Wunsch „das ganze Thema erklären, damit Aurora das große Bild
   versteht“): Übersicht des ganzen Systems am Anfang der Theorie (≤ 3 Spalten); Übungen hinten anhängen – ca. 70 % zu
   den Schwächen, ca. 30 % Kontrast/Umbau/Mischung, freie Aufgaben ohne vorgegebenen Bauplan; d01 ca. 30, d02 ca.
   8–10, d03 ca. 30–35. Neue Beispielsätze statt Sätzen aus dem Einstufungstest (d02 nutzt mehrere wörtlich).
   **Achtung:** Prüfer-Vorschläge für neue ord/tab-Übungen haben teils zu wenige Lösungen (`schied/d02.md` [E1]).
6. **Themenplan:** `plan-final.md` mit Matthias besprechen und in `docs/lehrplan.md` übernehmen (Niveau- und
   `req`-Spalte, Checkpoints). Die geplanten, nicht gebauten d04–d06 werden neu belegt. Statt „B1-“ das Profil
   eintragen (Lesen B1 wahrscheinlich, Grundwortschatz A2, Grammatik A2 mit A1-Lücken, Schreiben A2/A2+, Hören/Sprechen
   nicht getestet); Phase 1 „A1/A2-Lücken schließen, B1 festigen“; Regel ergänzen, wie aus Testergebnissen Themen
   werden (Grundlagen-Module zuerst, Teilregel → Thema).
7. **Einstufung in `js/app.js`:** Persona „at B1 level“ und `APP.levelHint` („B1-“ … „B2-“) verankern alle KI-Urteile
   auf B1 → neutral formulieren (Niveau-Beispiele A1–B2).
8. **Einstufungstest (`js/inhalte.js`, Aufgaben-IDs nie ändern):** fehlende Varianten in `s` (A8.8 „die Herren“ bzw.
   Singular erzwingen, B1.6 „Erfahrungen machen“, A15.3 „nicht …, sondern“, nachhause, gegen/ab 18 Uhr, übers
   Wochenende, sowohl … wie); mehrdeutige Lücken mit `tag` eindeutig machen (A13.3, A13.4, A18.6, A7.2, A15.1/2);
   Genitiv sicher messen (A8.3 „trotz“ in Österreich auch mit Dativ; A9.6 „während der“ = Dativform); B1-Wortbank mit
   Ablenkern; A17-Titel („Mixed A2 grammar“); Hinweise, die andere Aufgaben verraten, entkoppeln; langfristig Niveau je
   Aufgabe, B2-Lesetext, argumentative Schreibaufgabe. B4.5 (Heizkosten als Betriebskosten) mit Quelle klären.
9. **Prüfliste ergänzen** (`lektionen/pruefliste.md`, je Zeile mit Code der Lehre):
   - ord/tab: jede gleichwertige Wortstellung in `a` (Haupt-/Nebensatz getauscht, anderes Vorfeld).
   - Hinweise nennen das Format, nie die Entscheidung, die geübt wird.
   - Keine Sätze aus dem Einstufungstest in Übungen.
   - Jedes Grammatikthema beginnt mit einer Übersicht des ganzen Systems; ≤ 3 neue Teilregeln je Thema.
   - Jede in Übungen verlangte Form steht in Theorie oder Karten.
   - Jede Testlücke mit allen richtigen Antworten oder eindeutigem Tag.
   - Keine Testaufgaben-Nummern zusammen mit Ergebnissen der Lernenden in Dateien (Vertraulichkeit).
Engine-Punkte (KI-Nachprüfung, ☆ bei Lücken, Zählung, Einstufungsregel, Warnung für ord) gehen an den Funktionen-Chat
(`uebergabe-funktionen.md`).

## Regeln
- Wie immer: nur anhängen (Indizes bleiben), Quellenregel, Prüfliste, `node tools/pruefen.mjs`, natürliches
  österreichisches Standarddeutsch. In der Meldung an Matthias: was mit welcher Quelle geprüft wurde.
- Auroras Testergebnis und Bericht nie ins Repository; die Prüfdateien nennen Schwächen nur allgemein.
- Rückfragen zur Prüfung: an Matthias (er leitet an den Simulations-Chat weiter).
