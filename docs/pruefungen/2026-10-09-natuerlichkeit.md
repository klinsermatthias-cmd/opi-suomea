# Natürlichkeit der finnischen Sätze und Dialoge (S-1009-1)

Simulations-Chat (Kontrolle), Auftrag von Matthias 9.10.2026. Anlass: Seine finnische Freundin findet viele Dialoge
unnatürlich („so würde ich das nie sagen“). Frage: richtig, aber nur Schriftsprache bzw. für das Niveau vereinfacht –
oder wirklich unidiomatisch? Wird es in späteren Themen natürlicher?

**Entschieden:** S-1009-1 (live t01–t19c und Entwurf t20–t35d, Effort xhigh), S-1009-4 (vorher `/compact`).
Nichts an App oder `lektionen/` geändert; Live-Themen nur Vorschläge für den Inhalts-Chat. Entwürfe erst nach eigenem
OK korrigieren. Branch `pruefung/abschluss-2026-10-08`, nie `main`.

## Kurzfassung
- **Die Freundin hat recht – aber es sind kaum Fehler.** Von 4.329 finnischen Sätzen sind 76,5 % richtig und natürlich,
  8,8 % richtige Schriftsprache, 12,4 % richtig, aber lehrbuchhaft vereinfacht, **2,2 % so, wie es kein Finne sagt**
  und nur **11 echte Fehler** (davon 4 in den Live-Themen).
- **Der Eindruck entsteht in den Dialogen.** Dort ist nur gut die Hälfte der Zeilen (51 %) natürlich: 25 % sind
  Schriftsprache in einem Gespräch (minä olen, sinä olet, me menemme, -ko-Fragen), 20 % lehrbuchhaft (Echo-Antworten,
  ganze Mustersätze, zu glatte Abläufe), nur 3 % wirklich schief. Übungen (91 %), Karten (96 %) und Theorie (84 %)
  sind fast durchweg natürlich.
- **Später wird es teils natürlicher:** Lesetexte steigen von 51 % (A1.1) auf 78 % natürlich (A2.2), weil es echte
  geschriebene Texte werden (Anzeigen, Durchsagen, E-Mails). Die Dialoge bleiben bei ~50 %: weniger Vereinfachung
  (23 % → 17 %), aber mehr Schriftsprache (21 % → 32 %), weil die Sätze länger werden.
- **Wichtigste Ursache für „so würde ich das nie sagen“** ist nicht die Grammatik, sondern
  (1) Schriftsprache in Gesprächen unter Freunden, (2) Mustersätze statt kurzer Antworten und
  (3) knapp 100 falsch eingesetzte Alltagsformeln und Lehnübersetzungen aus dem Deutschen (z. B. „Hauska nähdä!“ beim
  Abschied, „Ole hyvä“ als Antwort auf „Danke“, „olla kotona“ für „Zeit haben“).

## Vorgehen
1. Auszug aller nummerierten finnischen Sätze (Dialogzeilen, Lesetexte, Musterlösungen, Lücken, „Nützliche Sätze“,
   Abschnitte „So sagt man’s gesprochen“, Wendungskarten): 111 Themen, 4.329 Einheiten
   (Werkzeug `natuerlichkeit/extrahieren.cjs`, Live-Stand aus `origin/main`).
2. Jede der 10 Gruppen von **zwei unabhängigen Agenten** bewertet: Rolle 1 Sprachgefühl, Rolle 2 Norm und Belege
   (Kielitoimiston ohjepankki, Uusi kielemme, Wiktionary, Websuche; Kielitoimiston sanakirja und Korp waren nicht
   erreichbar). Anleitung: `natuerlichkeit/anleitung.md`, Funde: `natuerlichkeit/funde/`.
3. **Schiedsrunde:** alle 218 Sätze, bei denen mindestens eine Rolle D oder E vergab, von vier weiteren Agenten
   unabhängig neu beurteilt (`natuerlichkeit/schied/`). Ergebnis: 106 davon herabgestuft (meist zu C), 112 bestätigt.
4. **Eigene Kontrolle** aller bestätigten D/E: 8 Urteile geändert (4 zu C, 4 von E zu D; bleiben 108) (`korrektur.json` im Scratchpad, Gründe in der
   D/E-Liste), Fakten nachgerechnet (Wochentage, Stockwerke, Preise).
5. Endstand: Schiedsurteil bzw. eigene Korrektur, sonst die strengere Klasse der beiden Rollen
   (`natuerlichkeit/endstand.cjs`).

Klassen: **A** richtig und natürlich · **B** richtig, Schriftsprache (gesprochen anders) · **C** richtig, lehrbuchhaft
vereinfacht · **D** grammatisch richtig, aber so sagt es kein Finne – ersetzen · **E** falsch.

Zuverlässigkeit: Rolle 1 (Sprachgefühl) war deutlich zu streng; Rolle 2 (Norm) ausgewogener, aber bei
Normverstößen teils zu milde. Wo beide unabhängig D/E sagten, hielt das Urteil fast immer. Ohne Muttersprachlerin
bleiben die D-Urteile Einschätzungen – die Freundin ist die beste Gegenprobe (siehe unten).

## Ergebnis in Zahlen
Alle Sätze je Niveau:

| Niveau | Themen | Sätze | A natürlich | B Schriftsprache | C vereinfacht | D ersetzen | E falsch |
|---|---|---|---|---|---|---|---|
| A1.1 (live) | 33 | 1.025 | 76,5 % | 7,1 % | 13,6 % | 2,7 % | 0,1 % |
| A1.2 (live) | 9 | 287 | 73,2 % | 12,9 % | 9,1 % | 4,5 % | 0,3 % |
| A1.3 (live) | 16 | 586 | 76,5 % | 5,5 % | 15,9 % | 2,2 % | 0,0 % |
| A2.1 (Entwurf) | 28 | 1.321 | 73,5 % | 11,5 % | 12,8 % | 1,9 % | 0,3 % |
| A2.2 (Entwurf) | 25 | 1.110 | 80,8 % | 7,7 % | 9,8 % | 1,6 % | 0,1 % |

Nach Textart (alle Niveaus): Dialogzeilen 938 · A 51 % · B 25 % · C 20 % · D 3 % — Lesetexte 885 · A 66 % · B 8 % ·
C 21 % · D 5 % — Theorie 673 · A 84 % — Übungen 1.670 · A 91 % — Wendungskarten 163 · A 96 %.

Verlauf Dialoge / Lesetexte (Anteil natürlich · Schriftsprache · vereinfacht · D):

| Niveau | Dialoge | Lesetexte |
|---|---|---|
| A1.1 | 53 · 21 · 23 · 3 % | 51 · 11 · 31 · 7 % |
| A1.2 | 56 · 27 · 8 · 8 % | 50 · 16 · 20 · 12 % |
| A1.3 | 59 · 17 · 20 · 3 % | 57 · 6 · 32 · 5 % |
| A2.1 | 48 · 27 · 22 · 2 % | 70 · 11 · 17 · 2 % |
| A2.2 | 48 · 32 · 17 · 3 % | 78 · 2 · 15 · 4 % |

Je Thema: `natuerlichkeit/themen-tabelle.md`. Alle 108 Sätze zum Ersetzen und Fehler mit natürlicher Alternative:
`natuerlichkeit/d-e-liste.md`.

## Die drei Ursachen mit Beispielen
**1. Schriftsprache im Gespräch (B) – gewollt, aber im Dialog steif.** Die App lehrt bewusst zuerst kirjakieli.
Im echten Gespräch klingt das wie vorgelesen:

| Schriftsprache (typisch in der App) | So spricht man |
|---|---|
| Minä olen Matthias. Minä olen opiskelija. | Mä oon Matthias. Mä opiskelen. |
| Mitä sinä teet huomenna? | Mitä sä teet huomenna? |
| Me menemme kauppaan. | Me mennään kauppaan. |
| Tuletko sinäkin? | Tuuksä kans? |
| Minulla on kiire. | Mulla on kiire. |

**2. Lehrbuch-Vereinfachung (C).** Ganze Sätze, wo Finnen ein Wort sagen; Lesetexte als Ketten gleich gebauter Sätze;
Gespräche ohne echte Frage oder Reaktion.

| Vereinfacht (typisch in der App) | Natürlich |
|---|---|
| Onko sinulla koira? – Kyllä, minulla on koira. | Onko sinulla koira? – On. / Joo, on. |
| Mistä olet kotoisin? – Olen kotoisin Itävallasta. | – Itävallasta. |
| Hän on opettaja. Hän on iloinen. | Hän on opettaja ja tosi iloinen ihminen. |

**3. So sagt es kein Finne (D) – das sollte ersetzt werden.** Fast immer Alltagsformeln am falschen Ort oder
Lehnübersetzungen aus dem Deutschen:

| In der App | Problem | Natürlich (geschrieben / gesprochen) |
|---|---|---|
| Hauska nähdä! (beim Abschied, t02c) | ist eine Begrüßung | Oli kiva nähdä! |
| Olen pahoillani. (auf „nicht so gut“, t02c) | zu schwer, wie Beileid | Voi ei! Mikä hätänä? / Ikävä kuulla. |
| Hyvää ruokahalua! (Gast bringt Kuchen, t02b) | sagt, wer das Essen serviert | Toin sinulle kakun. |
| Oletko kotona huomenna? / Perjantaina en ole kotona. (t09, t09b) | „zu Hause sein“ statt „Zeit haben“ | Onko sinulla huomenna aikaa? / Perjantaina en pääse. |
| Olen saunassa kerran viikossa. (t08d) | heißt „bin gerade in der Sauna“ | Käyn saunassa kerran viikossa. |
| Olen nälkäinen. (t08c) | für Hunger sagt man „haben“ | Minulla on nälkä. / Mulla on nälkä. |
| Opitko suomea? / Opin suomea. (t12) | klingt nach „hast du es gelernt?“ | Opiskeletko suomea? / Opiskelen suomea. |
| Kala on kallis, peruna on halpa. (t14) | Stoff → Teilungsform | Kala on kallista, peruna on halpaa. |
| Kiitos, ei. (t14c) | feste Formel umgekehrt | Ei kiitos. |
| Ole hyvä! (Antwort auf Dank, t15, t33) | „Ole hyvä“ sagt, wer etwas gibt | Eipä kestä! |
| Kiitos! Kuulemiin! (unter Freundinnen, t16d) | Amts-/Telefonformel | Kuullaan! / Moi moi! |
| Juna saapuu laiturille kolme. (t16e) | Gleis heißt „raide“ | Juna saapuu raiteelle kolme. |
| Mikä sinulla on? (Ärztin, t17, t17b) | abrupt, doppeldeutig | Mikä sinua vaivaa? |
| Avaa suu, ole hyvä. (t17b) | „ole hyvä“ ist kein „bitte“ | Avaa suu, kiitos. / Avaisitko suun? |
| Aloitan työn kello kahdeksan. (t20) | klingt nach neuer Stelle | Aloitan työt kahdeksalta. |
| Anteeksi, en kuule hyvin. (Telefon, t23) | klingt nach Schwerhörigkeit | Anteeksi, kuuluu huonosti. |
| Onnittelen sinua! (t24) | ohne Anlass Lehnübersetzung | Onneksi olkoon! / Onnittelut! |
| Mistä pidät vapaa-aikana? (t24d) | nach dem Deutschen gebaut | Mitä teet vapaa-ajalla? |
| Anteeksi jo nyt! (t35) | „Entschuldigung schon jetzt“ | Anteeksi jo etukäteen! |

Dazu Inhalts- und Kulturbrüche: Schuhe erst vor dem Schlafengehen ausziehen (t12d), Milch „in der Flasche“ (t14b),
Äpfel an der Käsetheke (t14), Matthias’ Eltern einmal in Linz, einmal in Oulu (t11/t13), Pulla ohne Hefe (t22b).

## Echte Fehler (E)
Live (Vorschlag an den Inhalts-Chat):
- t01b Theorie: „kaksois-vee“ → **kaksoisvee** (gesprochen meist „tuplavee“).
- t12c e10: „Kissa on «pöydässä»“ – die Katze ist auf dem Tisch = **pöydällä**; für die Übung zu -ssa/t→d passt
  z. B. „Istumme «pöydässä».“ (Wir sitzen am Tisch.)
- t14 e17.s4: „Mutta liha on kallis. En osta lihaa.“ → **liha on kallista** (Stoffwort; widerspricht sonst der
  eigenen Regel aus t14c).
- t18d Theorie: „sukat, saappaat, lapaset sind immer Mehrzahl“ – nur **housut, farkut** stehen auch für ein einzelnes
  Stück in der Mehrzahl; Socken und Stiefel gibt es normal in der Einzahl.

Nicht als Fehler, aber angleichen: t02c antwortet auf „Mitä kuuluu?“ mit „(ei kovin) hyvin“ – gesprochen verbreitet,
aber die App lehrt in t02/t02b selbst „hyvää“.

Entwurf (vom Simulations-Chat erstellt; Korrektur erst nach OK):
- t20d e21: „maanantaina 2.9.“ – der 2.9.2026 ist ein Mittwoch.
- t21 Theorie: „kolmannessa kerroksessa = im dritten Stock“ – in Finnland ist das Erdgeschoss der 1. kerros, also
  österreichisch „im zweiten Stock“; Hinweis ergänzen.
- t21 Theorie: Anzeigenkürzel „kk = Monat“ – in Raumangaben heißt kk **keittokomero** (Kochnische); „€/kk“ = pro Monat.
- t27b e23: Brief ins Ausland „kaksi euroa“ – bei Posti seit 2.6.2026 3,00 € (Economy) bzw. 3,35 € (Priority).
- t30c Theorie: „on avattu = ist geöffnet“ – für „hat offen“ sagt man **on auki / avoinna**.
- t32 Theorie: „-isiin bei langen Stämmen“ – richtig: **-isiin** bei Wörtern mit Wohin-Form Einzahl auf -seen
  (huoneeseen → huoneisiin, vapaaseen → vapaisiin), **-iin** nach Konsonant + i (naisiin, kiviin), sonst **-ihin**
  (taloihin, kaupunkeihin).
- t35c e20: „lauantaina 12.4.“ – der 12.4. ist 2026 ein Sonntag, 2027 ein Montag.

## Erklärung für die Freundin
Auf Deutsch: Sie hat recht, dass die Dialoge oft nicht klingen wie echtes Finnisch. Fast alles ist grammatisch
richtig, aber (1) die App lässt alle Personen bewusst Schriftsprache sprechen, weil Matthias zuerst die Schriftsprache
lernt (die gesprochenen Formen stehen als Hinweise in der Theorie), und (2) Anfängerdialoge sind absichtlich
vereinfacht (ganze Sätze statt kurzer Antworten). Echt unnatürlich sind knapp 100 Sätze – meist Höflichkeitsformeln am
falschen Ort; die werden korrigiert. Wenn ihr ein Satz seltsam vorkommt, ist genau das die wertvollste Rückmeldung.

Suomeksi (zum Zeigen):
> Kiitos palautteesta – olet oikeassa. Tarkistimme kaikki sovelluksen suomenkieliset lauseet (noin 4 300). Lähes
> kaikki ovat kieliopillisesti oikein, mutta dialogit kuulostavat usein jäykiltä kahdesta syystä. Ensinnäkin ne on
> kirjoitettu tarkoituksella kirjakielellä (minä olen, sinä olet, me menemme), koska Matthias opettelee ensin
> kirjakieltä. Puhekieliset muodot (mä oon, sä oot, me mennään) ovat sovelluksessa vain vinkkeinä. Toiseksi alkeistason
> dialogit on yksinkertaistettu: vastataan kokonaisella lauseella („Kyllä, minulla on koira“) eikä lyhyesti („On“).
> Lisäksi löysimme noin sata lausetta, joita suomalainen ei sanoisi, esimerkiksi „Hauska nähdä!“ hyvästeltäessä
> („Oli kiva nähdä!“) tai „olla kotona“, kun tarkoitetaan, että on aikaa. Ne korjataan. Jos kuulet jotain outoa,
> kerro siitä Matthiakselle – se auttaa paljon!

## Empfehlungen (Entscheidung durch Matthias)
- **S-1009-5:** Ich schreibe einen Auftrag für den **Inhalts-Chat**: die 4 Fehler und 54 D-Sätze der Live-Themen
  t01–t19c laut `natuerlichkeit/d-e-liste.md` korrigieren (unter seinen Regeln: Karten nicht umdeuten, nur
  anhängen, wo nötig). Matthias gibt ihn weiter.
- **S-1009-6:** Ich korrigiere die **Entwurfsthemen** t20–t35d (7 Fehler, 43 D-Sätze) auf dem Prüf-Branch und lasse
  danach Eigen- und Vollprüfung laufen.
- **S-1009-7:** Ich formuliere **Stilregeln für natürliche Dialoge** als Vorschlag für die Anleitung neuer Lektionen
  (Inhalts-Chat, `lektionen/README.md`): echte Frage → kurze Antwort → passende Reaktion; keine Echo-Antworten;
  Liste der festen Formeln (Ei kiitos, Eipä kestä, Oli kiva nähdä, Onneksi olkoon, kuuluu huonosti, raide …);
  bei Gesprächen unter Freunden die gesprochene Fassung als Hinweis zeigen.
- **S-1009-8:** Idee für den **Funktionen-Chat** (nur in `docs/ideen.md` sammeln): Dialoge mit Umschalter
  „geschrieben / gesprochen“, damit Matthias beide Formen sieht – ohne Sprechtraining.
- **S-1009-9:** Vorerst nichts weiter; der Bericht bleibt so stehen.

Empfehlung: S-1009-6 und S-1009-5 zuerst (Fehler weg), dann S-1009-7. Nächster freier Code: S-1009-10.

## Arbeitsstand
- 9.10.2026: Plan, `/compact`, Auszug (111 Themen, 4.329 Einheiten), 20 Prüfläufe, Schiedsrunde (218 Sätze), eigene
  Kontrolle und Bericht fertig. Dreimal durch das Nutzungslimit unterbrochen, jeweils ohne Datenverlust fortgesetzt.
- 9.10.2026 abends: **S-1009-5 erteilt** (Matthias gibt die Ergebnisse an den Inhalts-Chat; Prompt in
  `uebergabe/prompt-inhalts-chat.md`). Alles gesichert, Übersicht in `docs/pruefungen/README.md`.
- Offen: S-1009-6 bis S-1009-9. Weiter offen aus dem Abschlussplan: S-1008-112 (ruht),
  S-1008-114…119, S-1008-125…127.
