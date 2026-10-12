# Auftrag an den Funktionen-Chat (App-Engine) – Einstufungstest und Übungsprüfung (S-1011-12, S-1011-19)

> Von Matthias zu kopieren und im Chat „App-Engine: Funktionen“ einzufügen. Gilt erst mit seinem OK. Betrifft
> Engine-Dateien (gelten für Opi suomea und Deutsch-Trainer); erst erklären, E-Codes vergeben, dann ändern.

Der Simulations-Chat hat den Einstufungstest des Deutsch-Trainers und die Bewertung in `js/einstufung.js` geprüft
(Prüfer + Schiedsrunde, jede Code-Behauptung in node mit dem Originalcode nachgestellt). Details mit Belegen: Repository
`klinsermatthias-cmd/opi-suomea`, Branch `pruefung/deutsch-inhalte-2026-10-11`, `docs/pruefungen/deutsch/`:
`schied/test-bewertung.md` (Nr. [1]–[47] + E1), `schied/test-aufgaben.md` (Nr. [1], [2], E1), `bericht.md` Teil 2.
Nur BESTÄTIGT/ABGESCHWÄCHT/TEILWEISE umsetzen.

## Vorschläge (Engine)
1. **KI-Nachprüfung im Test (`ptAIGrade`):** Abschnittstitel, `hint` und Wortbank (`bank`) mitgeben; Regel „nur Wörter
   aus der Wortbank“ bzw. „die Struktur des Abschnitts muss verwendet werden“; „regionale Varianten sind richtig“ nicht
   auf Wortschatzaufgaben mit österreichischem Ziel (B4) anwenden; die Regel „nur den neuen Teil geschrieben ist ok“
   nicht für alle Umformaufgaben.
2. **Selbstbewertung ☆ auch bei Lücken (`k:"b"`),** solange keine KI da ist; Selbstbewertungen und KI-Hochstufungen
   im Bericht kennzeichnen, damit Claude sie nachprüfen kann.
3. **Zählung (`ptStats`):** teilweise beantwortete Mehrlücken-Aufgaben zählen bzw. Teilpunkte je Lücke; Ergebnis je
   Lücke im Bericht; ausgelassene Aufgaben nicht stillschweigend weglassen.
4. **Normalisierung:** ß/ss locker wie in den Übungen (`SP.loose`); Groß-/Kleinschreibung bei Stammlücken prüfen
   (A8.4/A8.8), wenn das ganze Wort getippt wird.
5. **Schreiben (`ptAIWriting`):** Raster je Kriterium (Inhaltspunkte, Wortzahl, Register, Grammatik, Wortschatz) statt
   frei geschätztem Niveau. Zweiter KI-Versuch nach ungültigem JSON nicht „unter 120 Wörter“ verlangen (unerfüllbar
   für D2/A18).
6. **Einstufung (`ptFinish`):** keine Verankerung durch Selbsteinschätzung und Beispiele; Profil je Fertigkeit
   (Lesen, Wortschatz, Grammatik, Schreiben; Hören/Sprechen als „nicht getestet“) statt eines Gesamtniveaus; optional
   Niveau je Aufgabe (Feld) und Ergebnis je Niveau. (Die Texte Persona/`levelHint` stehen in `js/app.js` und gehören
   dem Deutsch-Trainer-Chat.)
7. **Übungen (`tools/pruefen.mjs`, S-1011-12):** Warnung, wenn eine `ord`-Lösung ein Komma und ein Nebensatzwort
   (als, wenn, bevor, während, nachdem, weil, dass, ob, wann …) enthält, `a` aber nur einen Eintrag hat – `ord` und
   `tab` werden ohne KI geprüft (`js/formate.js` Z. 459, `checkTable`).
