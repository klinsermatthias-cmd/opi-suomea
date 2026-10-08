module.exports = {
  id: "t29",
  title: "Menschen beschreiben (Relativpronomen joka)",
  fi: "Mies, joka istuu tuolla …",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t27b"],
  th: `<p>Situation: Du beschreibst Menschen – Aussehen und Charakter – und Dinge genauer: „der Mann, der …“, „das Haus, in dem …“. Wenn dir ein Wort fehlt, umschreibst du es: <i>Se on sellainen kone, jolla …</i> Dafür lernst du das <b>Relativpronomen joka</b>.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Hän on pitkä ja hoikka.</td><td>Er/Sie ist groß und schlank.</td></tr>
<tr><td>Hänellä on vaaleat hiukset ja silmälasit.</td><td>Er/Sie hat helle Haare und eine Brille.</td></tr>
<tr><td>Hän on kiltti mutta vähän ujo.</td><td>Er/Sie ist nett, aber ein bisschen schüchtern.</td></tr>
<tr><td>Mies, joka istuu tuolla, on veljeni.</td><td>Der Mann, der dort sitzt, ist mein Bruder.</td></tr>
<tr><td>Talo, jossa asun, on vanha.</td><td>Das Haus, in dem ich wohne, ist alt.</td></tr>
<tr><td>Se on sellainen kone, jolla imuroidaan.</td><td>Das ist so eine Maschine, mit der man staubsaugt.</td></tr>
</table>
<h3>joka – der, die, das</h3>
<table><tr><td>Form</td><td>Einzahl</td><td>Mehrzahl</td></tr>
<tr><td>Grundform</td><td>joka</td><td>jotka</td></tr>
<tr><td>-n (Objekt)</td><td>jonka</td><td>joiden</td></tr>
<tr><td>Teilungsform</td><td>jota</td><td>joita</td></tr>
<tr><td>-ssa (in dem)</td><td>jossa</td><td>joissa</td></tr>
<tr><td>-lla (bei dem, womit)</td><td>jolla</td><td>joilla</td></tr></table>
<p class="rule">Die Form von <i>joka</i> richtet sich nach seiner <b>Aufgabe im Nebensatz</b>: <i>Mies, <b>joka</b> istuu …</i> (Subjekt) – <i>Nainen, <b>jonka</b> tapasin …</i> (ganzes Objekt) – <i>Kirja, <b>jota</b> luen …</i> (Teilungsform wie <i>luen kirjaa</i>) – <i>Talo, <b>jossa</b> asun …</i> – <i>Ystävä, <b>jolla</b> on koira …</i> Vor <i>joka</i> steht immer ein <b>Komma</b>.</p>
<h3>Aussehen</h3>
<p class="rule"><b>hiukset</b> (Kopfhaar) ist Mehrzahl: <i>Hänellä on vaaleat / tummat / kiharat / suorat hiukset.</i> Haben mit <i>-lla on</i>: <i>Hänellä on parta / silmälasit.</i> Sein mit <i>on</i>: <i>Hän on pitkä / lyhyt / hoikka.</i></p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Sillä on vaalee tukka.</i> (= Hänellä on vaaleat hiukset; <i>tukka</i> = Haar, Einzahl) · <i>Se on tosi kiva tyyppi.</i> (<i>tyyppi</i> = Typ, Person) · <i>Se mies, joka …</i> – gesprochen steht oft <i>se</i> vor dem Nomen.</p>`,
  v: [
    ["ulkonäkö", "Aussehen"],
    ["hiukset", "Haare (Mehrzahl)"],
    ["parta", "Bart"],
    ["silmälasit", "Brille (Mehrzahl)"],
    ["vaalea", "hell, blond"],
    ["tumma", "dunkel"],
    ["kihara", "lockig"],
    ["suora", "gerade, glatt"],
    ["hoikka", "schlank"],
    ["luonne", "Charakter (luonteen)"],
    ["ujo", "schüchtern"],
    ["kiltti", "nett, lieb, brav"],
    ["ahkera", "fleißig"],
    ["laiska", "faul"],
    ["rehellinen", "ehrlich"],
    ["kärsivällinen", "geduldig"],
    ["hauska", "lustig, nett"],
    ["sellainen", "so ein(e), solch"],
    ["joka", "der, die, das (Relativpronomen; jonka, jota, jossa, jotka)"],
    ["paikka", "Ort, Platz (paikan)"],
    ["kone", "Maschine, Gerät"]
  ],
  ex: [
    { t: "tab", q: "Formen von joka", h: "Jedes Kästchen ein Wort: die passende Form von joka", head: ["Form", "joka"], r: [["Grundform (Einzahl)", "[joka]"], ["-n-Form (Objekt)", "[jonka]"], ["Teilungsform", "[jota]"], ["-ssa (in dem)", "[jossa]"], ["-lla (bei dem)", "[jolla]"], ["Grundform (Mehrzahl)", "[jotka]"]] },
    { t: "tab", q: "Aussehen beschreiben", h: "Jedes Kästchen ein ganzer Satz auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["Er hat blonde Haare.", "[Hänellä on vaaleat hiukset.]"], ["Sie hat eine Brille.", "[Hänellä on silmälasit.]"], ["Er hat einen Bart.", "[Hänellä on parta.]"], ["Sie ist groß und schlank.", "[Hän on pitkä ja hoikka.]"]] },
    { t: "gap", q: "Mies, ___ istuu tuolla, on opettajani.", h: "joka als Subjekt", a: ["joka"] },
    { t: "gap", q: "Nainen, ___ tapasin eilen, on Aino.", h: "joka als ganzes Objekt (-n-Form)", a: ["jonka"] },
    { t: "gap", q: "Kirja, ___ luen, on hyvä.", h: "joka in der Teilungsform (luen kirjaa)", a: ["jota"] },
    { t: "gap", q: "Talo, ___ asun, on vanha.", h: "joka + -ssa: in dem", a: ["jossa"] },
    { t: "gap", q: "Ystävä, ___ on koira, asuu Oulussa.", h: "joka + -lla (haben: … on)", a: ["jolla"] },
    { t: "gap", q: "Lapset, ___ ovat pihalla, ovat iloisia.", h: "joka in der Mehrzahl", a: ["jotka"] },
    { t: "gap", q: "Hänellä on ___ hiukset.", h: "vaalea in der Mehrzahl (-t), wie hiukset", a: ["vaaleat"], s: 1 },
    { t: "tr", dir: "de", q: "Der Mann, der dort steht, ist mein Bruder.", a: ["Mies, joka seisoo tuolla, on veljeni", "Mies, joka seisoo tuolla, on minun veljeni", "Mies, joka seisoo siellä, on veljeni"] },
    { t: "tr", dir: "de", q: "Sie ist ehrlich und fleißig.", a: ["Hän on rehellinen ja ahkera"] },
    { t: "tr", dir: "de", q: "Das ist ein Ort, an dem man gut schlafen kann.", a: ["Se on paikka, jossa voi nukkua hyvin", "Tämä on paikka, jossa voi nukkua hyvin", "Se on paikka, jossa nukkuu hyvin"] },
    { t: "tr", dir: "fi", q: "Se on sellainen kone, jolla pestään pyykkiä.", a: ["Das ist so eine Maschine, mit der man Wäsche wäscht", "Das ist eine Maschine, mit der man Wäsche wäscht", "Das ist so ein Gerät, mit dem man Wäsche wäscht"] },
    { t: "tr", dir: "fi", q: "Aino on kiltti mutta vähän ujo.", a: ["Aino ist nett, aber ein bisschen schüchtern", "Aino ist lieb, aber etwas schüchtern", "Aino ist nett, aber etwas schüchtern"] },
    { t: "ord", w: ["Nainen", "jolla", "on", "silmälasit", "on", "opettaja"], a: ["Nainen, jolla on silmälasit, on opettaja."], de: "Die Frau, die eine Brille trägt, ist Lehrerin." },
    { t: "ord", w: ["Tämä", "on", "talo", "jossa", "asun"], a: ["Tämä on talo, jossa asun."], de: "Das ist das Haus, in dem ich wohne." },
    { t: "mc", q: "Dir fehlt das Wort „Staubsauger“. Wie umschreibst du es?", o: ["Se on sellainen kone, jolla imuroidaan.", "Se on sellainen kone, joka on pöydällä.", "Se on sellainen paikka, jossa syödään.", "En tiedä."], a: 0 },
    { t: "mc", q: "Wovon hängt die Form von „joka“ ab?", o: ["von seiner Aufgabe im Nebensatz (Subjekt, Objekt, Ort …)", "vom Wort davor im Hauptsatz", "Sie ist immer gleich.", "vom Verb im Hauptsatz"], a: 0, x: "Mies, joka istuu … (Subjekt) – Mies, jonka näin … (Objekt) – Talo, jossa asun … (wo). Mehrzahl: jotka, joita, joissa." },
    { t: "mc", q: "„Kirja, jota luen“ – warum „jota“?", o: ["Weil das Verb hier die Teilungsform will: luen kirjaa", "Weil kirja Mehrzahl ist", "Weil der Satz verneint ist", "jota heißt „ohne“"], a: 0, x: "joka steht im Fall, den das Verb im Nebensatz verlangt: luen kirjaa → kirja, jota luen. Luin kirjan → kirja, jonka luin." },
    { t: "mc", q: "Warum „vaaleat hiukset“ in der Mehrzahl?", o: ["Kopfhaar ist im Finnischen Mehrzahl (hiukset); gesprochen sagt man auch tukka (Einzahl).", "Weil man viele Haare hat – das gilt für alle Wörter.", "Das ist ein Fehler.", "Nur bei langen Haaren."], a: 0, x: "Hänellä on vaaleat hiukset. Gesprochen: Sillä on vaalee tukka." },
    { t: "les", q: "Uusi kollega", txt: ["Meillä on uusi kollega, joka on kotoisin Tampereelta.", "Hän on pitkä ja hoikka, ja hänellä on tummat kiharat hiukset.", "Hän on vähän ujo, mutta tosi kiltti ja ahkera.", "Kollega, jonka kanssa hän istuu, sanoo, että hän on hauska.", "Toimisto, jossa hän työskentelee, on kolmannessa kerroksessa."], qs: [{ q: "Woher kommt die neue Kollegin / der neue Kollege?", o: ["aus Tampere", "aus Oulu", "aus Wien"], a: 0 }, { q: "Wie sieht sie/er aus?", o: ["groß, schlank, dunkle Locken", "klein und blond", "mit Bart und Brille"], a: 0 }, { q: "Was sagt der Tischnachbar?", o: ["Sie/Er ist lustig.", "Sie/Er ist faul.", "Sie/Er ist laut."], a: 0 }] },
    { t: "les", q: "Etsimme koiraa", txt: ["Etsimme koiraa, joka on pieni ja ruskea.", "Koira, jonka nimi on Musti, on hyvin kiltti.", "Näimme sen viimeksi puistossa, joka on kirjaston vieressä.", "Jos näet sen, soita meille!"], qs: [{ q: "Wie ist der Hund?", o: ["klein und braun", "groß und schwarz", "weiß"], a: 0 }, { q: "Wie heißt er?", o: ["Musti", "Aino", "Ville"], a: 0 }, { q: "Wo wurde er zuletzt gesehen?", o: ["im Park neben der Bibliothek", "am Bahnhof", "im Wald"], a: 0 }] },
    { t: "dlg", q: "Wer ist das?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Kuka tuo mies on?"], ["Sinä", "[Kuka? Se, jolla on parta?|Mies, jolla on parta?|Kuka? Mies, jolla on parta?]", "Frag nach: der mit dem Bart?"], ["Aino", "Ei, se, jolla on silmälasit."], ["Sinä", "[Hän on uusi kollega.|Se on uusi kollega, joka aloitti eilen.|Hän on uusi kollega, joka aloitti eilen.]", "Sag: Er ist der neue Kollege."]] },
    { t: "dlg", q: "Wie ist deine Freundin?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Kollega", "Millainen ystäväsi on?"], ["Sinä", "[Hän on hauska ja rehellinen.|Hän on tosi hauska ja rehellinen.]", "Sag: lustig und ehrlich."], ["Kollega", "Entä ulkonäkö?"], ["Sinä", "[Hänellä on vaaleat hiukset ja silmälasit.|Hän on pitkä, ja hänellä on vaaleat hiukset.]", "Sag: helle Haare und eine Brille."]] },
    { t: "sch", q: "Beschreib eine Person: Aussehen und Charakter.", w: ["hänellä on"], a: ["Hän on pitkä ja hoikka. Hänellä on tummat hiukset. Hän on kiltti ja hauska.", "Hänellä on vaaleat hiukset ja silmälasit. Hän on ahkera ja rehellinen."], h: "zwei oder drei kurze Sätze" },
    { t: "sch", q: "Schreib einen Satz mit „joka“ oder „jossa“ über deine Wohnung oder Stadt.", w: ["jossa"], a: ["Linz on kaupunki, jossa asun.", "Asun talossa, joka on vanha."], h: "ein Satz mit Komma vor joka/jossa" }
  ]
};
