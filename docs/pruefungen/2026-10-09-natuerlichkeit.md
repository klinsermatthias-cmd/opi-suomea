# Natürlichkeit der finnischen Sätze und Dialoge (S-1009-1)

Simulations-Chat (Kontrolle), Auftrag von Matthias 9.10.2026. Anlass: Seine finnische Freundin findet viele Dialoge
unnatürlich („so würde ich das nie sagen“). Frage: richtig, aber nur Schriftsprache bzw. für das Niveau vereinfacht –
oder wirklich unidiomatisch? Wird es in späteren Themen natürlicher?

**Entschieden:** S-1009-1 (live t01–t19c und Entwurf t20–t35d, Effort xhigh), S-1009-4 (vorher `/compact`).
Nichts an App oder `lektionen/` ändern; Live-Themen nur Vorschläge für den Inhalts-Chat. Entwürfe erst nach eigenem OK
korrigieren. Branch `pruefung/abschluss-2026-10-08`, nie `main`. Nächster freier Code: S-1009-5.

## Umfang
- Live: 58 Themen, 77 Dialoge, 67 Lesetexte. Entwurf: 53 Themen, 106 Dialoge, 107 Lesetexte.
- Dazu Musterlösungen der Übersetzungen und die Kästen „Nützliche Sätze“.

## Klassen
- **A** richtig und natürlich · **B** richtig, typische Schriftsprache (gesprochen: …) · **C** richtig, lehrbuchhaft
  vereinfacht (für das Niveau vertretbar) · **D** grammatisch richtig, aber so sagt es kein Finne – ersetzen · **E** falsch.

## Vorgehen
1. Jedes Thema von zwei unabhängigen Agenten: Rolle 1 Muttersprachler-Gefühl, Rolle 2 Norm/Quellen
   (Kielitoimiston sanakirja/ohjepankki, Uusi kielemme, Yle Selkouutiset, Wiktionary, Korpora).
2. Uneinigkeit → dritter Agent mit Belegen; alle D/E prüft der Simulations-Chat selbst.
3. Verlauf: Anteile B/C/D/E je Niveau (A1, A1+, A2.1, A2.2).
4. Bericht in dieser Datei: Tabelle je Thema, schlimmste Beispiele mit natürlicher Alternative (geschrieben und
   gesprochen), Erklärung für die Freundin, Empfehlungen.
5. Zwischenstände unter `docs/pruefungen/natuerlichkeit/` sichern (Funde je Gruppe).

## Arbeitsstand
- 9.10.2026: Plan gespeichert, `/compact` erledigt, Prüfung gestartet.
- Auszug: 111 Themen, 4.329 nummerierte Einheiten (live A1.1 1.025 · A1.2 287 · A1.3 586; Entwurf A2.1 1.321 ·
  A2.2 1.110), 10 Gruppen (`natuerlichkeit/gruppen.json`), Anleitung für die Agenten `natuerlichkeit/anleitung.md`.
- Welle 1 läuft: g1–g5 (live t01–t19c), je Gruppe Rolle 1 (Sprachgefühl) und Rolle 2 (Norm/Belege). Danach Welle 2
  (Entwurf g6–g10), dann Schiedsrunde für Streitfälle.
