# Handy-Oberfläche: Prüfung mit Screenshots (S-1012-117, 12.10.2026)

Simulations-/Analyse-Chat. Nur Prüfung, keine Änderung an der App. Werkzeug: `ui-pruefung.mjs` (hier abgelegt; Aufruf `node ui-pruefung.mjs <App-Ordner> <Name> <Bildordner>`, Playwright/Chromium, 390 × 844 px, hell und dunkel über `prefers-color-scheme`).

**Geprüft:** Opi suomea (main 6de8b50) und Deutsch-Trainer (d99d0e2 + Entwürfe d04–d09, lokal) – Einrichtung, Heute, Themen, Wörter, Fortschritt, Einstellungen, Themenseite mit Theorie, Rundenstart, Rückmeldung nach „Weiß ich nicht“ und die Übungsarten mc, tr, gap, tab, ord, sch (les und dlg kamen in den ersten 90 Schritten der Runde nicht vor). Je Ansicht gemessen: waagrechter Überlauf, Elemente breiter als der Bildschirm, Tippflächen unter 32 px, Schrift unter 12 px, Kontrast unter 4,5:1 (WCAG AA; große Schrift 3:1). Testinhalte, keine persönlichen Daten.

## Ergebnis
- **Kein waagrechter Überlauf, kein Element breiter als 390 px, keine Skriptfehler** – in beiden Apps, hell und dunkel.
- **Keine zu schwachen Kontraste im Dunkelmodus.**

| # | Befund | Wo | Messwert | Schwere | Vorschlag |
|---|---|---|---|---|---|
| 1 | Text-Knöpfe sehr niedrig | „Sicherung einspielen“ (Heute/Einrichtung, `pasteimport`), „⚙ Einstellungen“ (Fortschritt, `tab=settings`) | 17 px hoch (WCAG 2.5.8: mindestens 24 × 24 px; Apple/Google empfehlen 44/48 px) | mittel – „Sicherung einspielen“ ist ein Rettungsweg und am Handy schwer zu treffen | Mindesthöhe 32–44 px über `padding` (Klasse für Text-Knöpfe) |
| 2 | Antippbare Wörter in Tabellen schmal | Übung „tab“, erste Spalte (Pronomen *er, du, es*) | 16–24 × 21 px | niedrig | Tippfläche über `padding` vergrößern, ohne die Zeile zu verbreitern |
| 3 | Vorlese-Wörter in der Theorie niedrig | Themenseite (`say`, z. B. *SAU-na*, *yö*) | 17–72 × 19–20 px; Lautsprecher-Knöpfe 30 × 30 px | niedrig | Zeilenhöhe/Padding leicht erhöhen |
| 4 | Kontrast knapp unter AA im hellen Modus | Abzeichen „Neu“/„Fertig“ (Themenliste), Knopf „✓ Theorie lesen“ (Deutsch-Trainer, Farben aus `farben.css`) | 4,43:1 bzw. 4,40:1 (Ziel 4,5:1) | niedrig | Farbton im Deutsch-Trainer etwas dunkler (App-Datei `farben.css`, Sache des Deutsch-Trainer-Chats) |
| 5 | Kleine Schrift bei Unterthemen-Nummern | Themenliste Opi suomea („1.2“, „2.3“ …) | 11,5 px | niedrig | 12 px |
| 6 | Hinweis-Toast deckt Eingabefeld | Übung „tab“: „Keine deutsche Stimme gefunden …“ liegt über der 5./6. Tabellenzeile | – | niedrig, verschwindet von selbst | Toast über der unteren Leiste, aber nicht über dem aktiven Feld, oder kürzer anzeigen |

Befund 6 nur auf dem Screenshot gesehen (Testumgebung ohne Stimmen); auf dem Handy erscheint der Hinweis nur, wenn keine Stimme installiert ist.

## Screenshots
| Datei | Ansicht |
|---|---|
| `fi-light-today.png` | Opi suomea, Heute (hell) |
| `fi-dark-topics.png` | Opi suomea, Themen (dunkel) |
| `fi-light-uebung-tr.png` | Opi suomea, Übersetzen (hell) |
| `fi-light-progress.png` | Opi suomea, Fortschritt (hell) – Befund 1 |
| `de-light-uebung-tab.png` | Deutsch-Trainer, Tabelle (hell) – Befunde 2 und 6 |
| `de-light-uebung-gap.png` | Deutsch-Trainer, Lücke (hell) |
| `de-dark-uebung-sch.png` | Deutsch-Trainer, Schreiben (dunkel) |
| `de-light-thema.png` | Deutsch-Trainer, Themenseite (hell) – Befunde 3 und 4 |
| `de-light-topics.png` | Deutsch-Trainer, Themen (hell) – Befund 4 |
| `de-dark-settings.png` | Deutsch-Trainer, Einstellungen (dunkel) |

Der automatische Breitentest in `tools/pruefen.mjs` (390 px) deckt Befund „Überlauf“ schon ab; Tippflächen und Kontrast prüft er nicht. Vorschlag für `docs/pruefliste-engine.md` (Funktionen-Chat): eine Zeile „Tippflächen ≥ 32 px, Kontrast ≥ 4,5:1 in beiden Modi“ mit diesem Werkzeug als Test.
