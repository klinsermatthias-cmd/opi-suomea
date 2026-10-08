module.exports = {
  id: "t24b",
  title: "Einladung & Gäste: zusagen, absagen, mitbringen (24.2)",
  fi: "Kiitos viimeisestä!",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t23c"],
  th: `<p>Vertiefung zu t24: Eine Einladung annehmen oder höflich absagen, fragen, was man mitbringen soll, als Gast und Gastgeber die richtigen Worte finden.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Tulen mielelläni! Mitä tuon?</td><td>Ich komme gern! Was soll ich mitbringen?</td></tr>
<tr><td>Valitettavasti en pääse.</td><td>Leider kann ich nicht kommen.</td></tr>
<tr><td>En ehdi, koska olen töissä.</td><td>Ich schaffe es nicht, weil ich arbeite.</td></tr>
<tr><td>Ilmoita, jos et pääse.</td><td>Sag Bescheid, wenn du nicht kommen kannst.</td></tr>
<tr><td>Tuon mukanani kakun.</td><td>Ich bringe einen Kuchen mit.</td></tr>
<tr><td>Ostin kirjan lahjaksi.</td><td>Ich habe ein Buch als Geschenk gekauft.</td></tr>
<tr><td>Malja Ainolle! Kippis!</td><td>Ein Toast auf Aino! Prost!</td></tr>
<tr><td>Kiitos viimeisestä!</td><td>Danke für das letzte Mal!</td></tr>
</table>
<h3>en pääse – en ehdi</h3>
<p class="rule"><b>päästä</b> = hinkommen können: <i>Valitettavasti en pääse (tulemaan).</i> – weil etwas anderes im Weg ist. <b>ehtiä</b> = (rechtzeitig) schaffen, Zeit haben: <i>En ehdi.</i> Stufenwechsel: ehdin, ehdit, ehtii. Höflich mit <i>valitettavasti</i> und einem Grund mit <i>koska</i>.</p>
<h3>Possessivsuffix an der Postposition: mukanani</h3>
<table><tr><td>minä</td><td>mukanani</td><td>mit mir</td></tr>
<tr><td>sinä</td><td>mukanasi</td><td>mit dir</td></tr>
<tr><td>hän</td><td>mukanaan</td><td>mit ihm/ihr (selbst)</td></tr>
<tr><td>me</td><td>mukanamme</td><td>mit uns</td></tr>
<tr><td>te</td><td>mukananne</td><td>mit euch</td></tr></table>
<p class="rule"><i>tuoda mukanaan</i> = mitbringen: <i>Tuon mukanani kakun. Tuokaa mukananne juomia!</i> In der 3. Person heißt das Suffix nach einem Vokal oft <b>-an/-än</b> (Vokal verdoppelt + n): <i>mukanaan</i>.</p>
<p class="tip"><b>Kulttuuri:</b> Wenn man Gastgeber wiedersieht, sagt man <i>Kiitos viimeisestä!</i> – danke für den letzten Abend. Gäste bringen oft Blumen, Wein oder etwas Süßes mit. Schuhe zieht man in finnischen Wohnungen im Flur aus.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mä en pääse.</i> · <i>Mä tuun!</i> (= Minä tulen!) · <i>Mitä mä tuon?</i> · <i>Kippis!</i> · Statt <i>kutsut</i> sagt man oft <i>bileet</i> (Party).</p>`,
  v: [
    ["kutsut", "Party, Einladung (Mehrzahl; pitää kutsut = eine Party geben)"],
    ["tuoda mukanaan", "mitbringen (tuon mukanani)"],
    ["en pääse", "ich kann nicht (kommen)"],
    ["ehtiä", "(rechtzeitig) schaffen, Zeit haben (ehdin)"],
    ["ilmoittaa", "mitteilen, Bescheid sagen (ilmoitan)"],
    ["peruuttaa", "absagen, stornieren (peruutan)"],
    ["kiitos viimeisestä", "danke für das letzte Mal"],
    ["ensi kerralla", "nächstes Mal"],
    ["lahjaksi", "als Geschenk"],
    ["isäntä", "Gastgeber"],
    ["emäntä", "Gastgeberin"],
    ["tarjoilla", "servieren, anbieten (tarjoilen)"],
    ["juhlapuku", "Festkleidung"],
    ["viini", "Wein"],
    ["malja", "Toast, Trinkspruch (malja Ainolle!)"],
    ["kippis", "Prost!"]
  ],
  ex: [
    { t: "tab", q: "Zusagen und absagen", h: "Jedes Kästchen ein ganzer Satz auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["Ich komme gern.", "[Tulen mielelläni.]"], ["Leider kann ich nicht kommen.", "[Valitettavasti en pääse.|Valitettavasti en pääse tulemaan.]"], ["Ich schaffe es nicht.", "[En ehdi.]"], ["Was soll ich mitbringen?", "[Mitä tuon?|Mitä tuon mukanani?]"], ["Danke für die Einladung!", "[Kiitos kutsusta!]"]] },
    { t: "tab", q: "mukana + Possessivsuffix", h: "Jedes Kästchen ein Wort: mukana + Suffix", head: ["Person", "mit …"], r: [["minä", "[mukanani]"], ["sinä", "[mukanasi]"], ["me", "[mukanamme]"], ["te", "[mukananne]"]], s: 1 },
    { t: "gap", q: "Valitettavasti en ___.", h: "päästä verneint: ich kann nicht (kommen)", a: ["pääse"] },
    { t: "gap", q: "En ___ tänään, minulla on kiire.", h: "ehtiä verneint (Stufenwechsel t → d)", a: ["ehdi"] },
    { t: "gap", q: "Tuon ___ kakun.", h: "mukana + -ni: mit mir", a: ["mukanani"], s: 1 },
    { t: "gap", q: "Kiitos ___!", h: "viimeinen + -stä: für das letzte Mal", a: ["viimeisestä"], s: 1 },
    { t: "gap", q: "Ostin kirjan ___.", h: "lahja + -ksi: als Geschenk", a: ["lahjaksi"] },
    { t: "gap", q: "Minun täytyy ___ juhlat.", h: "absagen – Grundform", a: ["peruuttaa", "perua"] },
    { t: "tr", dir: "de", q: "Leider kann ich am Samstag nicht kommen.", a: ["Valitettavasti en pääse lauantaina", "Valitettavasti en pääse tulemaan lauantaina", "Lauantaina en valitettavasti pääse", "Valitettavasti en pääse lauantaina tulemaan"] },
    { t: "tr", dir: "de", q: "Was soll ich mitbringen?", a: ["Mitä tuon", "Mitä tuon mukanani", "Mitä minä tuon"] },
    { t: "tr", dir: "de", q: "Sag Bescheid, wenn du nicht kommen kannst.", a: ["Ilmoita, jos et pääse", "Ilmoita, jos et pääse tulemaan", "Ilmoita minulle, jos et pääse"] },
    { t: "tr", dir: "fi", q: "Isäntä tarjoilee kahvia ja kakkua.", a: ["Der Gastgeber serviert Kaffee und Kuchen", "Der Gastgeber bietet Kaffee und Kuchen an"] },
    { t: "tr", dir: "fi", q: "Malja Ainolle! Kippis!", a: ["Ein Toast auf Aino! Prost", "Auf Aino! Prost", "Ein Hoch auf Aino! Prost"] },
    { t: "ord", w: ["Tulen", "mielelläni", "kiitos", "kutsusta"], a: ["Tulen mielelläni, kiitos kutsusta.", "Kiitos kutsusta, tulen mielelläni."], de: "Ich komme gern, danke für die Einladung." },
    { t: "ord", w: ["En", "ehdi", "koska", "olen", "töissä"], a: ["En ehdi, koska olen töissä."], de: "Ich schaffe es nicht, weil ich arbeite." },
    { t: "mc", q: "Du triffst Aino eine Woche nach ihrer Feier. Was sagst du (finnische Sitte)?", o: ["Kiitos viimeisestä!", "Hyvää uutta vuotta!", "Kippis!", "Valitettavasti en pääse."], a: 0 },
    { t: "mc", q: "Was sagt man beim Anstoßen?", o: ["Kippis!", "Kiitos samoin!", "Hyvää ruokahalua!", "Moikka!"], a: 0 },
    { t: "mc", q: "„en pääse“ oder „en ehdi“ – was ist der Unterschied?", o: ["en pääse: etwas anderes verhindert es; en ehdi: die Zeit reicht nicht", "beide heißen „ich will nicht“", "en ehdi ist unhöflich", "en pääse heißt: ich finde den Weg nicht"], a: 0, x: "päästä = hinkommen können (en pääse tulemaan); ehtiä = rechtzeitig schaffen (en ehdi). Höflich mit valitettavasti + Grund (koska …)." },
    { t: "mc", q: "„Tuon mukanani kakun.“ – Was ist -ni an „mukana“?", o: ["mein: „mit mir“ (Possessivsuffix an der Postposition)", "Mehrzahl", "Verneinung", "Frage"], a: 0, x: "Possessivsuffixe kommen auch an Postpositionen: mukanani (mit mir), mukanasi (mit dir), mukanaan (mit sich)." },
    { t: "les", q: "Kutsut perjantaina", txt: ["Moi kaikki!", "Pidän kutsut perjantaina kello 19. Tervetuloa!", "Tuokaa mukananne juomia, minä tarjoilen ruokaa.", "Ilmoittakaa torstaihin mennessä, jos ette pääse.", "Aino"], qs: [{ q: "Wann ist die Party?", o: ["Freitag um 19 Uhr", "Samstag um 19 Uhr", "Donnerstag"], a: 0 }, { q: "Was sollen die Gäste mitbringen?", o: ["Getränke", "Essen", "nichts"], a: 0 }, { q: "Bis wann soll man absagen?", o: ["bis Donnerstag", "bis Freitag", "gar nicht"], a: 0 }] },
    { t: "les", q: "Juhlissa", txt: ["Aino: Tervetuloa! Saanko ottaa takkisi?", "Matthias: Kiitos! Tässä on pieni lahja sinulle.", "Aino: Voi kiitos, ihana!", "Matthias: Anteeksi, olen vähän myöhässä.", "Aino: Ei haittaa! Ota kahvia ja kakkua.", "Ville: Malja Ainolle! Kippis!"], qs: [{ q: "Was gibt Matthias Aino?", o: ["ein kleines Geschenk", "Blumen", "Wein"], a: 0 }, { q: "Warum entschuldigt er sich?", o: ["Er ist etwas zu spät.", "Er hat kein Geschenk.", "Er muss früh gehen."], a: 0 }, { q: "Was macht Ville?", o: ["Er bringt einen Toast auf Aino aus.", "Er sagt ab.", "Er bestellt Kaffee."], a: 0 }] },
    { t: "dlg", q: "Höflich absagen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Tuletko lauantaina kutsuille?"], ["Sinä", "[Valitettavasti en pääse.|Valitettavasti en pääse tulemaan.|En valitettavasti pääse.]", "Sag leider ab."], ["Aino", "Voi harmi! Miksi?"], ["Sinä", "[Olen töissä lauantaina.|Koska olen töissä.|Minulla on iltavuoro.]", "Gib einen Grund: Du arbeitest."], ["Aino", "Selvä. Ehkä ensi kerralla!"], ["Sinä", "[Kiitos kutsusta!|Kiitos, ensi kerralla!|Kiitos kutsusta, ensi kerralla!]", "Bedanke dich für die Einladung."]] },
    { t: "dlg", q: "Zusagen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Ville", "Tuletko perjantaina kutsuille?"], ["Sinä", "[Tulen mielelläni! Mitä tuon?|Tulen! Mitä tuon mukanani?|Tulen mielelläni. Mitä tuon?]", "Sag zu und frag, was du mitbringen sollst."], ["Ville", "Voit tuoda juomia."], ["Sinä", "[Selvä! Tuon viiniä.|Selvä, tuon mehua.|Selvä, tuon juomia.]", "Sag „klar“ und sag, was du mitbringst."]] },
    { t: "sch", q: "Schreib eine kurze, höfliche Absage mit Grund.", w: ["valitettavasti", "koska"], a: ["Kiitos kutsusta! Valitettavasti en pääse, koska olen töissä.", "Valitettavasti en pääse, koska olen matkalla. Kiitos kutsusta!"], h: "ein oder zwei Sätze" },
    { t: "sch", q: "Schreib, dass du gern kommst und einen Kuchen mitbringst.", w: ["mielelläni", "mukanani"], a: ["Tulen mielelläni! Tuon mukanani kakun.", "Kiitos kutsusta, tulen mielelläni. Tuon mukanani kakun."], h: "ein oder zwei Sätze" }
  ]
};
