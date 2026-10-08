# F – Bedienung & Oberfläche

Geprüft: Hilfs-Prüfer bis zum Abbruch: Bildschirmfotos aller Hauptansichten in vier Varianten (Handy 390 px / PC 1280 px,
hell / dunkel) und einer kompletten Runde mit allen Übungsarten (`exp-F/shots`, 78 Bilder), Messung von Tippflächen und
Überlauf je Ansicht (`exp-F/audit-s1-opi.json`). Engine-Chat (8.10.2026): Bilder „Heute“, Übung, Tabellen-Rückmeldung
angesehen; Kontrastmessung (`exp-F/s2-contrast.mjs`) selbst ausgeführt. Deutsch-Trainer-Ansichten nicht mehr geprüft (Abbruch).

## F1 – Gesperrte Themen in der Themenliste sind schwer lesbar
- **Schwere:** niedrig bis mittel (52 Themen, die meisten davon gesperrt)
- **Wo:** `app.css:62` (`.titem.locked … {opacity:.55}`)
- **Problem/Beleg:** Durch die halbe Deckkraft liegt der Kontrast gesperrter Einträge bei **2,2–3,9 : 1** (Empfehlung für kleine
  Schrift: 4,5 : 1). Gemessen: hell **109**, dunkel **73** zu schwache Textstellen in der Themenliste – z. B. „Gesperrt“ 2,15,
  finnischer Untertitel mit Stufe 2,27, Nummer „8.2“ 3,07. Alle anderen Ansichten: 0.
- **Folge:** Am Handy, vor allem draußen, ist kaum zu lesen, was als Nächstes kommt und was noch fehlt.
- **Vorschlag:** statt Deckkraft eine eigene gedämpfte Farbe mit mindestens 4,5 : 1 (das Schloss zeigt die Sperre schon).
- **Aufwand:** klein
- **Apps:** beide

## F2 – Einige häufig benutzte Knöpfe sind sehr klein
- **Schwere:** niedrig
- **Wo/Beleg (gemessen, Handy):** „Pause“ in der Übung 53×19 px, „❓ Frag Opettaja“ 99×15, „Wörter kenne ich schon – direkt zu den
  Übungen“ 288×15, „Zum Thema“ 70×15, „‹ Alle Themen“ 109×28, Zahnrad 36×36 (Empfehlung ≥ 44 px Höhe).
- **Folge:** Daneben tippen, besonders „Pause“ und „Frag Opettaja“ mitten in einer Runde.
- **Vorschlag:** nur Innenabstand vergrößern (Aussehen bleibt fast gleich).
- **Aufwand:** klein
- **Apps:** beide

## Gut gelöst
- Kein seitlicher Überlauf in **allen** gemessenen Ansichten (Handy und PC, hell und dunkel).
- „Heute“ hat genau einen gefüllten Hauptknopf („Als Nächstes …“), darunter den Tagesplan mit Stand – klar und ruhig.
- Übungsansicht ist fokussiert: Leiste unten ausgeblendet, Eingabefeld hat den Fokus, nach dem Prüfen springt er auf „Weiter“.
- Rückmeldungen sind verständlich (z. B. Tabelle: falsches Feld rot, Lösung grün darunter, „kommt gleich nochmal“).
- Nachtmodus vollständig, Kontrast außerhalb der Themenliste überall ausreichend.
