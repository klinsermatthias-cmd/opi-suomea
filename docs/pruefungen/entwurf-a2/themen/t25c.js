module.exports = {
  id: "t25c",
  title: "Feinheiten: paremmin, eniten, kahdessa kaupassa, riittää (25.3)",
  fi: "Kiitos, riittää!",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t20d", "t22c", "t23c"],
  th: `<p>Feinheiten zu t25: Steigerung bei <b>Adverbien</b> (<i>paremmin</i> = besser sprechen), <b>Zahlen in Fällen</b> (<i>kahdessa kaupassa</i>) und das Verb <b>riittää</b> (reichen).</p>
<h3>Adverbien steigern</h3>
<table><tr><td>Grundform</td><td>mehr …</td><td>am meisten …</td></tr>
<tr><td>hyvin (gut)</td><td>paremmin</td><td>parhaiten</td></tr>
<tr><td>paljon (viel)</td><td>enemmän</td><td>eniten</td></tr>
<tr><td>vähän (wenig)</td><td>vähemmän</td><td>vähiten</td></tr>
<tr><td>nopeasti (schnell)</td><td>nopeammin</td><td>nopeimmin</td></tr></table>
<p class="rule">Adverb: Komparativ <b>-mmin</b>, Superlativ <b>-immin</b> (<i>nopeammin, nopeimmin</i>). Adjektiv und Adverb unterscheiden: <i>parempi takki</i> (eine bessere Jacke) – <i>puhun paremmin</i> (ich spreche besser).</p>
<h3>Zahlen in Fällen</h3>
<table><tr><td>in zwei Geschäften</td><td>kahdessa kaupassa</td></tr>
<tr><td>für drei Euro</td><td>kolmella eurolla</td></tr>
<tr><td>von fünf bis zehn</td><td>viidestä kymmeneen</td></tr>
<tr><td>einem Freund</td><td>yhdelle ystävälle</td></tr>
<tr><td>in sechs Tagen</td><td>kuuden päivän päästä</td></tr></table>
<p class="rule">Zahl und Nomen stehen im <b>gleichen Fall</b>, das Nomen bleibt <b>Einzahl</b>. Nur im Grundfall folgt die Teilungsform (<i>kaksi kauppaa</i>). Stämme: yksi → <b>yhde-</b>, kaksi → <b>kahde-</b>, viisi → <b>viide-</b>, kuusi → <b>kuude-</b>, kymmenen → <b>kymmene-</b> (wie aus 9.3: viidestä, kuuteen). Preis beim Kaufen mit <b>-lla</b>: <i>Ostin sen kolmella eurolla.</i></p>
<h3>riittää</h3>
<p class="rule"><i>Raha ei riitä.</i> (Das Geld reicht nicht.) <i>Riittääkö tämä?</i> (Reicht das?) <i>Kiitos, riittää!</i> (Danke, das genügt!)</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip">Endungen werden verkürzt: <i>kolmel eurol</i> (= kolmella eurolla), <i>kahes kaupas</i> (= kahdessa kaupassa). <i>Mä puhun jo paremmin suomee!</i> · <i>Riittää!</i> = Es reicht! / Genug!</p>`,
  v: [
    ["riittää", "reichen, genügen (raha ei riitä)"],
    ["enemmän", "mehr"],
    ["vähemmän", "weniger"],
    ["eniten", "am meisten"],
    ["vähiten", "am wenigsten"],
    ["paremmin", "besser (Adverb)"],
    ["parhaiten", "am besten (Adverb)"]
  ],
  ex: [
    { t: "tab", q: "Adverbien steigern", h: "Jedes Kästchen eine eigene Form: links „mehr …“, rechts „am meisten …“ – z. B. hyvin | paremmin | parhaiten", head: ["Grundform", "mehr …", "am meisten …"], r: [["hyvin", "[paremmin]", "[parhaiten]"], ["paljon", "[enemmän]", "[eniten]"], ["vähän", "[vähemmän]", "[vähiten]"], ["nopeasti", "[nopeammin]", "[nopeimmin]"]], s: 1 },
    { t: "tab", q: "Zahlen in Fällen", h: "Jedes Kästchen zwei Wörter: Zahl und Nomen im gleichen Fall (Nomen in der Einzahl)", head: ["Deutsch", "Suomeksi"], r: [["in zwei Geschäften", "[kahdessa kaupassa]"], ["für drei Euro", "[kolmella eurolla]"], ["von fünf bis zehn", "[viidestä kymmeneen]"], ["für einen Freund", "[yhdelle ystävälle]"]], s: 1 },
    { t: "gap", q: "Puhun suomea ___ kuin viime vuonna.", h: "hyvin – Komparativ: besser", a: ["paremmin"] },
    { t: "gap", q: "Kuka osaa suomea ___?", h: "hyvin – Superlativ: am besten", a: ["parhaiten"] },
    { t: "gap", q: "Juon kahvia ___ kuin teetä.", h: "paljon – Komparativ: mehr", a: ["enemmän"] },
    { t: "gap", q: "Raha ei ___.", h: "riittää – verneint", a: ["riitä"] },
    { t: "gap", q: "Ostin kirjan ___ eurolla.", h: "kolme in derselben Form wie „eurolla“", a: ["kolmella"], s: 1 },
    { t: "gap", q: "Asuin ___ kaupungissa.", h: "kaksi in derselben Form wie „kaupungissa“", a: ["kahdessa"], s: 1 },
    { t: "tr", dir: "de", q: "Danke, das reicht!", a: ["Kiitos, riittää", "Kiitos, se riittää", "Kiitos, tämä riittää"] },
    { t: "tr", dir: "de", q: "Ich lese weniger als früher.", a: ["Luen vähemmän kuin ennen", "Minä luen vähemmän kuin ennen"] },
    { t: "tr", dir: "de", q: "Was magst du am meisten?", a: ["Mistä pidät eniten", "Mistä sinä pidät eniten"] },
    { t: "tr", dir: "fi", q: "Ostin kahvin kahdella eurolla.", a: ["Ich habe den Kaffee für zwei Euro gekauft", "Ich kaufte den Kaffee für zwei Euro", "Ich habe einen Kaffee für zwei Euro gekauft"] },
    { t: "tr", dir: "fi", q: "Aino osaa suomea parhaiten.", a: ["Aino kann am besten Finnisch", "Aino spricht am besten Finnisch", "Aino kann Finnisch am besten"] },
    { t: "ord", w: ["Puhun", "nyt", "paremmin", "suomea"], a: ["Puhun nyt paremmin suomea.", "Puhun nyt suomea paremmin.", "Nyt puhun suomea paremmin.", "Nyt puhun paremmin suomea."], de: "Ich spreche jetzt besser Finnisch." },
    { t: "mc", q: "Wie heißt „besser“ als Adverb (Ich spreche besser)?", o: ["paremmin", "parempi", "paras", "hyvemmin"], a: 0, x: "Adjektiv: parempi (eine bessere Jacke). Adverb: paremmin (ich spreche besser). Superlativ: parhaiten." },
    { t: "mc", q: "„kahdessa kaupassa“ – warum steht „kauppa“ in der Einzahl?", o: ["Nach Zahlen bleibt das Nomen Einzahl; Zahl und Nomen haben denselben Fall.", "Weil zwei wenig ist.", "Das ist ein Fehler.", "Weil -ssa immer Einzahl ist."], a: 0, x: "kahdessa kaupassa, kolmella eurolla, yhdelle ystävälle. Nur im Grundfall folgt die Teilungsform: kaksi kauppaa." },
    { t: "mc", q: "„eniten“ bedeutet:", o: ["am meisten", "mehr", "weniger", "genug"], a: 0, x: "paljon – enemmän – eniten; vähän – vähemmän – vähiten." },
    { t: "mc", q: "Gesprochen: „Mä ostin sen kolmel eurol.“ – geschrieben:", o: ["Ostin sen kolmella eurolla.", "Ostin sen kolmelle eurolle.", "Ostin kolme euroa.", "Ostan sen kolmella eurolla."], a: 0, x: "Gesprochen werden -lla/-ssa oft zu -l/-s verkürzt: kolmel eurol = kolmella eurolla." },
    { t: "mc", q: "Gesprochen: Wann sagt man „Riittää!“?", o: ["wenn es genug ist", "wenn man mehr möchte", "wenn man bezahlen will", "wenn man nichts versteht"], a: 0 },
    { t: "les", q: "Toinen vuosi suomea", txt: ["Puhun suomea nyt paremmin kuin viime vuonna.", "Ymmärrän enemmän ja puhun nopeammin.", "Mutta yksi tunti viikossa ei riitä.", "Nyt olen kahdella kurssilla.", "Kurssilla puhumme paljon, ja se on parasta."], qs: [{ q: "Wie spricht der Schreiber jetzt?", o: ["besser als letztes Jahr", "schlechter als letztes Jahr", "genauso"], a: 0 }, { q: "Was reicht nicht?", o: ["eine Stunde pro Woche", "das Geld", "die Bücher"], a: 0 }, { q: "In wie vielen Kursen ist er jetzt?", o: ["in zwei", "in einem", "in drei"], a: 0 }] },
    { t: "les", q: "Kahdessa kaupassa", txt: ["Matthias käy kahdessa kaupassa.", "Ensimmäisessä kaupassa kahvi maksaa viisi euroa.", "Toisessa kaupassa se maksaa neljä euroa.", "Hän ostaa kahvin neljällä eurolla.", "Rahaa jää enemmän!"], qs: [{ q: "In wie vielen Geschäften ist Matthias?", o: ["in zwei", "in drei", "in einem"], a: 0 }, { q: "Wo ist der Kaffee billiger?", o: ["im zweiten Geschäft", "im ersten Geschäft", "gleich teuer"], a: 0 }, { q: "Für wie viel kauft er ihn?", o: ["für vier Euro", "für fünf Euro", "für neun Euro"], a: 0 }] },
    { t: "dlg", q: "Reicht das?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Haluatko lisää kahvia?"], ["Sinä", "[Kiitos, riittää!|Ei kiitos, riittää.|Kiitos, tämä riittää.]", "Sag: danke, das reicht."], ["Aino", "Entä kakkua?"], ["Sinä", "[Vähän, kiitos.|Vähän lisää, kiitos.|Kyllä, vähän.]", "Sag: ein bisschen."]] },
    { t: "dlg", q: "Wie geht's mit dem Finnisch?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Opettaja", "Miten suomi menee?"], ["Sinä", "[Paremmin kuin ennen!|Nyt paremmin.|Paremmin, kiitos!]", "Sag: besser als früher."], ["Opettaja", "Mitä teet eniten?"], ["Sinä", "[Luen eniten.|Eniten luen kirjoja.|Luen paljon.]", "Sag: Du liest am meisten."]] },
    { t: "sch", q: "Schreib, was du jetzt mehr und was du weniger machst als früher.", w: ["enemmän", "vähemmän"], a: ["Luen enemmän kuin ennen, mutta katson vähemmän televisiota.", "Nyt opiskelen enemmän ja nukun vähemmän."], h: "ein oder zwei Sätze" },
    { t: "sch", q: "Schreib, für wie viel du etwas gekauft hast.", w: ["eurolla"], a: ["Ostin kirjan kymmenellä eurolla.", "Ostin takin viidellä eurolla."], h: "ein Satz: ostaa … + Zahl und euro mit -lla" }
  ]
};
