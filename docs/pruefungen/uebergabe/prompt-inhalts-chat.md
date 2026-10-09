# Prompt für den Chat „Opi suomea (Lerninhalte)“ – Natürlichkeit (S-1009-5)

Zum Kopieren:

---
Auftrag von Matthias über den Simulations-Chat (S-1009-5), Stand 9.10.2026.

**Anlass:** Meine finnische Freundin findet viele Dialoge unnatürlich („so würde ich das nie sagen“). Der
Simulations-Chat hat deshalb alle 4.329 finnischen Sätze geprüft (zwei unabhängige Prüfrollen, Schiedsrunde, eigene
Kontrolle). Ergebnis: kaum Grammatikfehler; der Eindruck entsteht in den Dialogen (nur 51 % natürlich) durch
(1) Schriftsprache im Gespräch, (2) Lehrbuch-Vereinfachung (Echo-Antworten, ganze Mustersätze) und (3) knapp 100
falsch eingesetzte Alltagsformeln und Lehnübersetzungen aus dem Deutschen.

**Lesen** (Branch `pruefung/abschluss-2026-10-08`, nicht auf `main`; nur diese Dateien, gezielt):
```
git fetch origin pruefung/abschluss-2026-10-08
B=origin/pruefung/abschluss-2026-10-08
git show $B:docs/pruefungen/2026-10-09-natuerlichkeit.md          # Bericht, Abschnitte „Kurzfassung“, „Die drei Ursachen“, „Echte Fehler“
git show $B:docs/pruefungen/natuerlichkeit/d-e-liste.md           # Arbeitsliste, Abschnitt „Live-Themen t01–t19c“
git show $B:docs/pruefungen/natuerlichkeit/texte/t12c.txt         # Satz-IDs eines Themas nachschlagen (eN = Übung N, .rM Dialogzeile, .sM Lesetextzeile, th Theorie, vN Karte)
```

**Bitte:**
1. Die Live-Themen t01–t19c anhand der Liste prüfen: **4 echte Fehler** und **54 Sätze, die ein Finne so nicht sagt**
   (Klasse D). Die Liste enthält je Satz das Problem und eine natürliche Alternative (geschrieben/gesprochen). Es sind
   Vorschläge – ohne Muttersprachlerin geprüft; im Zweifel lieber nachfragen. Die Fehler:
   - t01b Theorie: „kaksois-vee“ → „kaksoisvee“.
   - t12c e10: „Kissa on «pöydässä»“ (auf dem Tisch = pöydällä) – für die Übung z. B. „Istumme «pöydässä».“
   - t14 e17.s4: „Mutta liha on kallis. En osta lihaa.“ → „liha on kallista“.
   - t18d Theorie: „sukat, saappaat, lapaset immer Mehrzahl“ – nur housut/farkut stehen für ein Stück in der Mehrzahl.
   - Dazu angleichen: t02c antwortet auf „Mitä kuuluu?“ mit „hyvin“, t02/t02b lehren „hyvää“.
2. Wie immer nach deinen Regeln: erst erklären, dann Matthias mit F-Codes fragen, dann ändern; Nur-anhängen-Regel und
   Karten-IDs beachten (Karten nicht umdeuten); `node tools/pruefen.mjs` muss „Alles in Ordnung“ melden.
3. **Vorschlag für neue Lektionen (S-1009-7, noch nicht entschieden):** Regeln für natürliche Dialoge in
   `lektionen/README.md` – echte Frage → kurze Antwort → passende Reaktion; keine Echo-Antworten; feste Formeln richtig
   einsetzen (Ei kiitos · Eipä kestä als Antwort auf Dank · Oli kiva nähdä beim Abschied · Onneksi olkoon / Onnittelut ·
   kuuluu huonosti am Telefon · Minulla on nälkä/kiire · Onko sinulla aikaa? / En pääse · käyn saunassa ·
   opiskelen suomea · raide = Gleis · Mikä sinua vaivaa? beim Arzt); Stoffwörter mit Teilungsform (Kahvi on kuumaa,
   Liha on kallista); bei Gesprächen unter Freunden die gesprochene Fassung als Hinweis. Bitte mit Matthias besprechen.
4. **Entwurf t20–t35d** (`docs/pruefungen/entwurf-a2/` auf demselben Branch) noch **nicht** übernehmen: Die
   Natürlichkeits-Korrekturen dort (S-1009-6) sind noch offen; die Übernahme entscheidet Matthias (S-1008-127).

Für die Freundin gibt es im Bericht (Abschnitt „Erklärung für die Freundin“) eine kurze Erklärung auf Finnisch.
---
