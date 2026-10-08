module.exports = {
  id: "t22c",
  title: "Feinheiten: monta, paljon, ilman, ei yhtään (22.3)",
  fi: "Montako?",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t20d", "t21c"],
  th: `<p>Feinheiten zu t22: Welche Form steht nach <b>Mengenwörtern</b> (monta, paljon, muutama, useita, ei yhtään)? Dazu die Teilungsform Mehrzahl langer Wörter, „es gibt“ in der Mehrzahl und <b>ilman</b> (ohne).</p>
<h3>Mengenwörter</h3>
<table><tr><td>Wort</td><td>Form danach</td><td>Beispiel</td></tr>
<tr><td>kaksi, kolme …</td><td>Teilungsform Einzahl</td><td>kaksi omenaa</td></tr>
<tr><td>monta (viele)</td><td>Teilungsform Einzahl</td><td>monta omenaa</td></tr>
<tr><td>montako? kuinka monta?</td><td>Teilungsform Einzahl</td><td>Montako lasta?</td></tr>
<tr><td>muutama (ein paar)</td><td>Grundform Einzahl</td><td>muutama omena</td></tr>
<tr><td>useita (mehrere)</td><td>Teilungsform Mehrzahl</td><td>useita omenoita</td></tr>
<tr><td>paljon, vähän</td><td>Teilungsform (Mz. bei Zählbarem)</td><td>paljon omenoita, vähän kahvia</td></tr>
<tr><td>liikaa, tarpeeksi</td><td>Teilungsform</td><td>liikaa sokeria, tarpeeksi rahaa</td></tr>
<tr><td>ei yhtään</td><td>Teilungsform Einzahl</td><td>ei yhtään omenaa</td></tr></table>
<p class="rule"><i>monta</i> wirkt wie eine Zahl (Einzahl!). Das Verb nach <i>muutama</i> und <i>monta</i> steht in der Einzahl: <i>Muutama ihminen odottaa.</i></p>
<h3>Lange Wörter in der Teilungsform Mehrzahl</h3>
<p class="rule">Drei und mehr Silben auf -a/-ä: <i>opiskelija → opiskelijoita, kahvila → kahviloita, ravintola → ravintoloita, hedelmä → hedelmiä</i>. Bei <i>omena</i> sind zwei Formen richtig: <i>omenoita</i> und <i>omenia</i>. <i>ihminen → ihmisiä</i>, <i>suomalainen → suomalaisia</i>.</p>
<h3>Es gibt … – in der Mehrzahl</h3>
<table><tr><td>unbestimmt: Ort + on + Teilungsform</td><td>Kulhossa on marjoja. (In der Schüssel sind Beeren.)</td></tr>
<tr><td>bestimmt: Grundform Mz. + ovat + Ort</td><td>Marjat ovat kulhossa. (Die Beeren sind in der Schüssel.)</td></tr></table>
<h3>ilman = ohne</h3>
<p class="rule"><b>ilman</b> + Teilungsform (vor dem Wort): <i>kahvi ilman maitoa, tee ilman sokeria, matka ilman lapsia</i>.</p>
<p class="tip"><i>kasvis</i> und <i>vihannes</i> heißen beide „Gemüse“; <i>kasvis</i> sagt man auch für vegetarisch (<i>kasvisruoka</i>), <i>vihannes</i> eher im Geschäft.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip">Nach Vokal wird -a/-ä in der Teilungsform oft zu einem langen Vokal: <i>kahvii</i> (= kahvia), <i>maitoo</i> (= maitoa), <i>omenii</i> (= omenia). <i>Ei oo yhtää aikaa</i> = Ei ole yhtään aikaa (Ich habe gar keine Zeit).</p>`,
  v: [
    ["kulho", "Schüssel"],
    ["marja", "Beere (marjoja)"],
    ["raha", "Geld (rahaa)"],
    ["monta", "viele (+ Teilungsform Einzahl: monta omenaa)"],
    ["montako?", "wie viele? (montako lasta?)"],
    ["muutama", "ein paar, einige (+ Grundform: muutama omena)"],
    ["useita", "mehrere (+ Teilungsform Mehrzahl)"],
    ["ei yhtään", "gar kein(e) (ei yhtään omenaa)"],
    ["liikaa", "zu viel"],
    ["tarpeeksi", "genug"]
  ],
  ex: [
    { t: "tab", q: "Mengenwort + omena", h: "Jedes Kästchen ein Wort: die passende Form von omena", head: ["Mengenwort", "omena"], r: [["kaksi", "[omenaa]"], ["monta", "[omenaa]"], ["paljon", "[omenoita|omenia]"], ["useita", "[omenoita|omenia]"], ["muutama", "[omena]"], ["ei yhtään", "[omenaa]"]], s: 1 },
    { t: "tab", q: "Lange Wörter: Teilungsform Mehrzahl", h: "Jedes Kästchen ein Wort: Teilungsform Mehrzahl", head: ["Wort", "einige …"], r: [["opiskelija", "[opiskelijoita]"], ["kahvila", "[kahviloita]"], ["ravintola", "[ravintoloita]"], ["hedelmä", "[hedelmiä]"], ["ihminen", "[ihmisiä]"], ["suomalainen", "[suomalaisia]"]], s: 1 },
    { t: "gap", q: "Kulhossa on ___.", h: "marja – einige: Teilungsform Mehrzahl", a: ["marjoja"] },
    { t: "gap", q: "Kurssilla on monta ___.", h: "opiskelija nach „monta“: Teilungsform Einzahl", a: ["opiskelijaa"] },
    { t: "gap", q: "Linzissä on paljon ___.", h: "kahvila nach „paljon“: Teilungsform Mehrzahl", a: ["kahviloita"] },
    { t: "gap", q: "Juon kahvia ilman ___.", h: "sokeri nach „ilman“: Teilungsform", a: ["sokeria"] },
    { t: "gap", q: "Minulla ei ole yhtään ___.", h: "raha in der Teilungsform", a: ["rahaa"] },
    { t: "gap", q: "Kahvissa on ___ sokeria.", h: "zu viel", a: ["liikaa"] },
    { t: "tr", dir: "de", q: "In der Schüssel sind Beeren.", a: ["Kulhossa on marjoja"] },
    { t: "tr", dir: "de", q: "Die Beeren sind in der Schüssel.", a: ["Marjat ovat kulhossa"] },
    { t: "tr", dir: "de", q: "Wie viele Kinder hast du?", a: ["Montako lasta sinulla on", "Kuinka monta lasta sinulla on"] },
    { t: "tr", dir: "de", q: "Ich habe genug Geld.", a: ["Minulla on tarpeeksi rahaa"] },
    { t: "tr", dir: "fi", q: "Muutama ihminen odottaa bussia.", a: ["Ein paar Menschen warten auf den Bus", "Einige Leute warten auf den Bus", "Ein paar Leute warten auf den Bus", "Einige Menschen warten auf den Bus"] },
    { t: "tr", dir: "fi", q: "Ostin useita kirjoja.", a: ["Ich habe mehrere Bücher gekauft", "Ich kaufte mehrere Bücher"] },
    { t: "ord", w: ["Kaupassa", "on", "paljon", "hedelmiä"], a: ["Kaupassa on paljon hedelmiä."], de: "Im Geschäft gibt es viel Obst." },
    { t: "ord", w: ["Haluan", "teetä", "ilman", "maitoa"], a: ["Haluan teetä ilman maitoa."], de: "Ich möchte Tee ohne Milch." },
    { t: "mc", q: "Welche Form steht nach „monta“?", o: ["Teilungsform Einzahl: monta omenaa", "Teilungsform Mehrzahl: monta omenoita", "Grundform Mehrzahl: monta omenat", "Grundform Einzahl: monta omena"], a: 0, x: "monta wirkt wie eine Zahl: monta omenaa. Nach paljon und useita dagegen Mehrzahl: paljon omenoita. Nach muutama die Grundform: muutama omena." },
    { t: "mc", q: "„Kulhossa on omenoita.“ – „Omenat ovat kulhossa.“ Was ist der Unterschied?", o: ["unbestimmt (es gibt Äpfel) → Teilungsform; bestimmt (die Äpfel) → Grundform Mehrzahl + ovat", "Es gibt keinen Unterschied.", "Der erste Satz ist verneint.", "„omenoita“ ist Einzahl."], a: 0, x: "„Es gibt“: Ort zuerst, dann on + Teilungsform. Bekannte Dinge: Omenat ovat kulhossa." },
    { t: "mc", q: "„ilman“ (ohne) – welche Form folgt?", o: ["Teilungsform: ilman sokeria, ilman lapsia", "-n-Form: ilman sokerin", "Grundform: ilman sokeri", "-sta: ilman sokerista"], a: 0, x: "ilman steht vor dem Wort und will die Teilungsform, Einzahl oder Mehrzahl: kahvi ilman maitoa, matka ilman lapsia." },
    { t: "mc", q: "Gesprochen: „Mä juon kahvii ilman maitoo.“ – geschrieben:", o: ["Minä juon kahvia ilman maitoa.", "Minä join kahvin ilman maidon.", "Minä juon kahvi ilman maito.", "Minä juon kahvista ilman maidosta."], a: 0, x: "Gesprochen wird -a/-ä nach Vokal oft zu einem langen Vokal: kahvii (kahvia), maitoo (maitoa)." },
    { t: "mc", q: "Gesprochen: „Ei oo yhtää aikaa.“ bedeutet:", o: ["Ich habe gar keine Zeit.", "Ich habe viel Zeit.", "Es ist keine Uhr da.", "Es ist zu früh."], a: 0, x: "= Ei ole yhtään aikaa. (oo = ole, yhtää = yhtään)" },
    { t: "les", q: "Torilla", txt: ["Torilla on paljon ihmisiä.", "Myyjällä on marjoja: mansikoita ja mustikoita.", "Litra mansikoita maksaa viisi euroa.", "Ostan kaksi litraa.", "Ostan myös omenoita ja vihanneksia.", "Minulla ei ole enää yhtään rahaa!"], qs: [{ q: "Wie ist es am Markt?", o: ["Es sind viele Menschen da.", "Es ist fast niemand da.", "Es gibt keine Beeren."], a: 0 }, { q: "Was kostet ein Liter Erdbeeren?", o: ["5 €", "2 €", "10 €"], a: 0 }, { q: "Was ist am Ende?", o: ["Das Geld ist alle.", "Die Erdbeeren sind alle.", "Der Markt ist geschlossen."], a: 0, x: "„Minulla ei ole enää yhtään rahaa!“ = Ich habe gar kein Geld mehr!" }] },
    { t: "les", q: "Illalla tulee ystäviä", txt: ["Aino: Montako ystävää tulee illalla?", "Matthias: Kahdeksan. Onko meillä tarpeeksi ruokaa?", "Aino: On. Meillä on leipää, juustoa ja kulho hedelmiä.", "Matthias: Entä juomat?", "Aino: Kahvia on liikaa, mutta mehua ei ole yhtään!", "Matthias: Selvä, ostan mehua."], qs: [{ q: "Wie viele Freunde kommen?", o: ["acht", "vier", "zwölf"], a: 0 }, { q: "Gibt es genug zu essen?", o: ["ja", "nein", "zu wenig Brot"], a: 0 }, { q: "Was fehlt?", o: ["Saft", "Kaffee", "Obst"], a: 0 }] },
    { t: "dlg", q: "Am Markt", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Myyjä", "Hei! Mitä saisi olla?"], ["Sinä", "[Litra mansikoita, kiitos.|Yksi litra mansikoita, kiitos.|Haluaisin litran mansikoita.]", "Bestelle einen Liter Erdbeeren."], ["Myyjä", "Jotain muuta?"], ["Sinä", "[Muutama omena, kiitos.|Ja muutama omena.|Kiitos, muutama omena.]", "Sag: ein paar Äpfel."], ["Myyjä", "Ole hyvä. Kymmenen euroa."], ["Sinä", "[Tässä, kiitos!|Kiitos! Tässä.|Ole hyvä.]", "Gib das Geld und bedanke dich."]] },
    { t: "dlg", q: "Wie viele?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Kollega", "Montako opiskelijaa kurssilla on?"], ["Sinä", "[Kaksitoista opiskelijaa.|Kurssilla on kaksitoista opiskelijaa.|Kaksitoista.]", "Sag: zwölf Studierende."], ["Kollega", "Onko siellä paljon suomalaisia?"], ["Sinä", "[Ei ole yhtään suomalaista.|Ei yhtään.|Ei, ei yhtään suomalaista.]", "Sag: gar keine Finnen."]] },
    { t: "sch", q: "Schreib, was es in deinem Kühlschrank gibt – mit Wörtern in der Mehrzahl.", w: ["jääkaapissa"], a: ["Jääkaapissa on munia, juustoja ja tomaatteja.", "Jääkaapissa on vihanneksia ja hedelmiä."], h: "ein Satz: Ort + on + Teilungsform" },
    { t: "sch", q: "Schreib, wie du deinen Kaffee trinkst: ohne Milch oder ohne Zucker.", w: ["ilman"], a: ["Juon kahvia ilman sokeria.", "Juon kahvia ilman maitoa.", "Juon kahvia ilman maitoa ja sokeria."], h: "ein Satz mit „ilman“" }
  ]
};
