# Plan: Abschlussanalyse und Simulation (S-1008-113) – Entwurf, noch NICHT freigegeben

Stand 8.10.2026, Simulations-Chat (Kontrolle). Gespeichert auf Matthias' Wunsch, wird später wieder abgerufen.
Ändert nichts an App-Code oder Lehrinhalten; Umsetzung von Befunden macht der Funktionen- bzw. Inhalts-Chat.

## Reihenfolge (Matthias 8.10.2026)
1. **Zuerst Schritt A:** alle Themen bis exklusive B1 (t20–t35 mit allen Unterthemen) vollständig ausarbeiten.
2. **Danach** Abschlussanalyse und Simulation (Phasen 0–5) mit diesen Themen zusätzlich zu den 58 echten.

## Schritt A – Themen t20–t35 vollständig ausarbeiten (Entwurf, nicht in der App)
- **Umfang:** 16 Hauptthemen + 16 x.2 + 16 x.3 + 20.4, 21.4, 24.4, 27.4, 35.4 = **53 Themen**. Grundlage:
  `lektionen/entwuerfe-bis-b1.md` (Unterthemen-Tabelle S-1008-87), `docs/pruefungen/2026-10-08-themenplan-bis-b1.md`
  (Kernwörter je Unterthema), `lektionen/abdeckung.md`, `lektionen/README.md`, `docs/uebungsformate.md`.
- **Je Thema vollständig:** Theorie, Wortliste (Hauptthema 20–25, x.2 15–20, x.3 5–12 Wörter), mind. 15 Übungen
  (alle passenden Übungsarten, Grammatik als `tab`, je 2 `les`/`dlg`/`sch`, 2–4 Regelfragen mit `x`, `h` wo nötig),
  „So sagt man's gesprochen“, x.3 mit 2–3 Übungen zu gesprochenem Finnisch, `req` nach den Regeln der Entwürfe.
- **Format:** gleiches JSON-Format wie `lektionen/lektionen.json`, aber in einer **eigenen Datei**
  (`docs/pruefungen/entwurf-a2/lektionen-a2.json` + Begleitbericht). Die App lädt sie nicht; die Simulation kann sie
  als Zusatz einspielen. Übernahme in die App nur durch den Inhalts-Chat mit F-Code.
- **Prüfung:** gegen uusikielemme.fi, elon.io (Lektionsliste mit Stufen), oph.fi (Stufen, YKI-Grundlagen),
  en.wiktionary.org (Formen), kielitoimistonohjepankki.fi; Wortabdeckung: alle Kernwörter, keine Wörter in
  Musterlösungen ohne frühere Wortliste (`docs/simulationen/hilfsskripte/wortlisten-abgleich.js`), keine Dubletten zu
  t01–t19; Strukturprüfung mit den Regeln aus `tools/pruefen/` (nur lesend/auf Kopie).
- **Effort-Empfehlung:** „xhigh“ für das Ausarbeiten, danach ein eigener Korrektur-Durchgang über alle finnischen Formen.

## Phase 0 – Vorbereitung
- Sicherungs-Branch `sicherung/simulation-vor-abschluss`; Bericht `docs/pruefungen/2026-10-08-abschluss.md` mit Abschnitt
  „Arbeitsstand“ auf Branch `pruefung/abschluss-2026-10-08`; Wecker alle 2 h (create_trigger, an die Session gebunden).

## Phase 1 – Code und Architektur (statisch, alle `js/`, `sw.js`, `index.html`, Workflows, `tools/`)
- Datenverlust: `mergeStates`/`pushCloud`/`pullCloud`, `migrate`, Sicherungen, Tagesstände, Notfall-Version, voller Speicher.
- Sicherheit: KI-Text in `innerHTML`, Schlüssel, Supabase-Zugriffsregeln, fremde Lektionspakete.
- Stabilität: Fehlerpfade, Service-Worker-Update. Effizienz: Speicherwachstum, Rechenzeit, Gemini-Kontingent.
- Lernlogik: Spaced Repetition, Freischaltung ≥ 80 %, Fehlerzuordnung zu Grammatikthemen, Schwächen-Vorzug,
  Empfehlungen, Gesamtanalyse.

## Phase 2 – Inhalte
- Alle 58 Themen: finnische Korrektheit (870 Übungen, 854 Wörter), Musterlösungen, `h`, Regelfragen, `req`-Ketten.
- Sind die Befunde aus `docs/pruefungen/2026-10-08-lehrinhalte.md` behoben?
- Die ausgearbeiteten A2-Themen aus Schritt A noch einmal unabhängig prüfen.

## Phase 3 – Simulation erweitern (nur `tools/simulation.mjs`)
- Abdeckungslücken: `selfok`/`selfno`/`toggleweak`, die 6 neuen A1-Unterthemen, Szenarien E-1008-19.
- Menschlicher Rhythmus: wechselnde Uhrzeiten, Wochenenden kürzer, ausgelassene Tage, 2 Wochen Urlaub, Krankheit,
  abgebrochene Runden, Wochen nur mit dem Handy, typische Tippfehler (a statt ä), Fehlerquote je nach Thema.
- Fehlerzuordnung: Fehler bekannter Grammatik in fremden Übungen (z. B. Partitiv-Fehler in einer Ortsfall-Übung) →
  richtiges Thema, Vorzug, Empfehlung.
- Datenverlust-Prüfung jeden Tag auf beiden Geräten; Sommerzeit-Umstellung.
- Zusatzthemen aus Schritt A optional einspielen (Skalierung: ca. 111 Themen, Speicher, Freischaltketten).

## Phase 4 – Läufe
- Hauptlauf 360 Tage, alle Themen; Lauf mit schwachem Lerner; kurzer Deutsch-Trainer-Lauf.
- 180 Tage dauerten 43 min → 360 Tage ca. 1,5–2 h je Lauf, im Hintergrund mit Ausgabe in eine Datei.

## Phase 5 – Abschlussbericht
- Befunde mit Schwere, Ort (Datei:Zeile), Beleg, Folge, Vorschlag, Aufwand, betroffene Apps, Code;
  fertige Übergabetexte für den Funktionen-Chat (E-…) und den Inhalts-Chat (F-…).

## Grenzen
- Gemini ist nachgebaut: geprüft wird, ob die Fehlerzuordnung technisch richtig ankommt und verarbeitet wird; die
  Qualität des echten Gemini nur über den Prompt und das KI-Protokoll der Berichte.
- Aufwand: mehrere Limit-Fenster, grob 1–2 Tage (Schritt A zusätzlich ähnlich viel).

## Entscheidungen (Codes)
- **Entschieden 8.10.2026:** S-1008-120 (Plan und Entwürfe auf Branch `pruefung/abschluss-2026-10-08`, nie `main`),
  S-1008-122 (Schritt A mit Effort „xhigh“ + eigener Korrektur-Durchgang), S-1008-124 (Schritt A gestartet).
- **Schritt A fertig (9.10.2026):** 53 Themen in `docs/pruefungen/entwurf-a2/`, Bericht dort. Neu vergeben: S-1008-125 … 127
  (siehe Bericht, „Offene Fragen“). Nächster freier Code: S-1008-128.
- Noch offen:
- S-1008-114 Entwürfe nur als Text prüfen · S-1008-115 Platzhalter-Themen in der Simulation · S-1008-116 lokal
  gespeicherte Themen des Inhalts-Chats vorher auf einen Branch → durch Schritt A teilweise überholt, beim Abruf neu fragen.
- S-1008-117 Effort xhigh (empfohlen) · S-1008-118 Effort max.
- S-1008-119 Zusatzprüfungen: Wechsel zu anderer Lösung (Sicherungsdatei vollständig/lesbar, alte Sicherungen
  einspielen), beide Geräte gleichzeitig offline, Speicher/Tempo nach 360 Tagen auf schwachem Handy, Gemini-Kontingent
  in Spitzenzeiten, 390 px und Barrierefreiheit, Übergang t19 → t20 beim Nachladen neuer Lektionen.
