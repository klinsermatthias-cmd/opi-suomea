module.exports = {
  id: "t25",
  title: "Kleidung & Einkaufen 2 (Komparativ, Superlativ)",
  fi: "Onko isompaa kokoa?",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t23b"],
  th: `<p>Situation: Im Kleidergeschäft – Größe und Farbe wählen, anprobieren, vergleichen, im Ausverkauf das Beste finden. Dafür lernst du den <b>Komparativ</b> (<i>halvempi</i> = billiger) und den <b>Superlativ</b> (<i>halvin</i> = am billigsten).</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Etsin talvitakkia.</td><td>Ich suche eine Winterjacke.</td></tr>
<tr><td>Saanko sovittaa tätä?</td><td>Darf ich das anprobieren?</td></tr>
<tr><td>Missä on sovituskoppi?</td><td>Wo ist die Umkleidekabine?</td></tr>
<tr><td>Onko tätä isompaa kokoa?</td><td>Gibt es das eine Größe größer?</td></tr>
<tr><td>Tämä on halvempi kuin tuo.</td><td>Dieses ist billiger als jenes.</td></tr>
<tr><td>Musta sopii sinulle hyvin.</td><td>Schwarz steht dir gut.</td></tr>
<tr><td>Kaikki on alessa!</td><td>Alles ist im Ausverkauf!</td></tr>
</table>
<h3>Komparativ: -mpi</h3>
<table><tr><td>Grundform</td><td>Komparativ</td><td>Superlativ</td></tr>
<tr><td>iso</td><td>isompi</td><td>isoin</td></tr>
<tr><td>pieni</td><td>pienempi</td><td>pienin</td></tr>
<tr><td>halpa</td><td>halvempi</td><td>halvin</td></tr>
<tr><td>vanha</td><td>vanhempi</td><td>vanhin</td></tr>
<tr><td>kallis</td><td>kalliimpi</td><td>kallein</td></tr>
<tr><td>uusi</td><td>uudempi</td><td>uusin</td></tr>
<tr><td>pitkä</td><td>pidempi</td><td>pisin</td></tr>
<tr><td>hyvä</td><td>parempi</td><td>paras</td></tr></table>
<p class="rule"><b>Komparativ:</b> Stamm (wie vor -n) + <b>-mpi</b>. Zweisilbige Wörter auf -a/-ä ändern den Endvokal zu <b>e</b>: <i>halpa → halvempi, vanha → vanhempi, pitkä → pidempi</i>. Vergleich mit <b>kuin</b>: <i>Tämä on halvempi kuin tuo.</i></p>
<p class="rule"><b>Superlativ:</b> Stamm + <b>-in</b>; -a/-ä fällt weg (<i>halvin, vanhin</i>), -i-/-e- wird zu <b>e</b> (<i>kallis → kallein, kaunis → kaunein</i>). <i>hyvä – parempi – paras</i>. Verstärkt: <i>kaikkein paras</i> (allerbeste).</p>
<p class="rule">Gebeugt: Komparativ <b>-mpa-/-mma-</b> (<i>isompaa, isomman</i>), Superlativ <b>-impa-/-imma-</b> (<i>halvinta, halvimman</i>); <i>paras → parasta, parhaan</i>.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Onks tätä isompaa?</i> · <i>Tää on halvempi ku toi</i> (<i>ku</i> = kuin) · <i>Toi on paras!</i> · <i>alennusmyynti</i> heißt im Alltag fast immer <i>ale</i>: <i>Mä ostin sen alesta.</i></p>
<p class="tip"><b>Kulttuuri:</b> Größen: S, M, L (gesprochen <i>äs, äm, äl</i>); Schuhe nach europäischer Größe: <i>Kenkäni koko on 43.</i></p>`,
  v: [
    ["koko", "Größe (mikä koko? = welche Größe?)"],
    ["sovittaa", "anprobieren (sovitan)"],
    ["sovituskoppi", "Umkleidekabine"],
    ["sopia", "passen, stehen (sopii sinulle = steht dir)"],
    ["ale", "Ausverkauf (alessa = im Ausverkauf)"],
    ["alennus", "Rabatt, Ermäßigung (alennuksen)"],
    ["musta", "schwarz"],
    ["valkoinen", "weiß"],
    ["ruskea", "braun"],
    ["harmaa", "grau"],
    ["pinkki", "pink, rosa"],
    ["oranssi", "orange"],
    ["violetti", "violett, lila"],
    ["kuin", "als (beim Vergleich)"],
    ["parempi", "besser"],
    ["paras", "beste(r), am besten (parasta)"],
    ["halvempi", "billiger"],
    ["kalliimpi", "teurer"],
    ["isompi", "größer"],
    ["pienempi", "kleiner"],
    ["kaikkein", "aller- (kaikkein paras = allerbeste)"]
  ],
  ex: [
    { t: "tab", q: "Komparativ", h: "Jedes Kästchen ein Wort: Komparativ auf -mpi (hyvä ist unregelmäßig)", head: ["Grundform", "Komparativ"], r: [["iso", "[isompi]"], ["pieni", "[pienempi]"], ["halpa", "[halvempi]"], ["kallis", "[kalliimpi]"], ["vanha", "[vanhempi]"], ["uusi", "[uudempi]"], ["hyvä", "[parempi]"]], s: 1 },
    { t: "tab", q: "Komparativ und Superlativ", h: "Jedes Kästchen eine eigene Form: links Komparativ (-mpi), rechts Superlativ (-in) – z. B. halpa | halvempi | halvin", head: ["Grundform", "Komparativ", "Superlativ"], r: [["halpa", "[halvempi]", "[halvin]"], ["kallis", "[kalliimpi]", "[kallein]"], ["iso", "[isompi]", "[isoin]"], ["hyvä", "[parempi]", "[paras]"], ["pitkä", "[pidempi|pitempi]", "[pisin|pitkin]"]], s: 1 },
    { t: "gap", q: "Tämä paita on halvempi ___ tuo.", h: "als (beim Vergleich)", a: ["kuin"] },
    { t: "gap", q: "Onko tätä ___ kokoa?", h: "iso – Komparativ in der Teilungsform (größere)", a: ["isompaa"], s: 1 },
    { t: "gap", q: "Mikä on ___ takki?", h: "halpa – Superlativ: die billigste", a: ["halvin"], s: 1 },
    { t: "gap", q: "Tämä on ___ kahvila Linzissä!", h: "hyvä – Superlativ", a: ["paras"] },
    { t: "gap", q: "Saanko ___ tätä mekkoa?", h: "anprobieren – Grundform", a: ["sovittaa"] },
    { t: "gap", q: "Musta ___ sinulle hyvin.", h: "sopia – Form für „se“: steht (dir)", a: ["sopii"] },
    { t: "gap", q: "Takit ovat nyt ___.", h: "ale + -ssa: im Ausverkauf", a: ["alessa"] },
    { t: "tr", dir: "de", q: "Gibt es das in einer größeren Größe?", a: ["Onko tätä isompaa kokoa", "Onko isompaa kokoa", "Onko tätä isompana"] },
    { t: "tr", dir: "de", q: "Die schwarze Jacke ist teurer als die weiße.", a: ["Musta takki on kalliimpi kuin valkoinen", "Musta takki on kalliimpi kuin valkoinen takki"] },
    { t: "tr", dir: "de", q: "Welche Größe hast du?", a: ["Mikä koko sinulla on", "Mikä on sinun kokosi", "Mikä kokosi on"] },
    { t: "tr", dir: "fi", q: "Tämä on kaikkein paras ale!", a: ["Das ist der allerbeste Ausverkauf", "Das ist der beste Ausverkauf überhaupt"] },
    { t: "tr", dir: "fi", q: "Harmaa villapaita sopii sinulle hyvin.", a: ["Der graue Pullover steht dir gut", "Der graue Pullover passt dir gut"] },
    { t: "ord", w: ["Tämä", "on", "halvempi", "kuin", "tuo"], a: ["Tämä on halvempi kuin tuo."], de: "Dieses ist billiger als jenes." },
    { t: "ord", w: ["Missä", "on", "sovituskoppi"], a: ["Missä on sovituskoppi?", "Missä sovituskoppi on?"], de: "Wo ist die Umkleidekabine?" },
    { t: "mc", q: "Die Hose ist zu klein. Was sagst du?", o: ["Onko isompaa kokoa?", "Onko pienempää kokoa?", "Tämä on liian iso.", "Kiitos, otan sen."], a: 0 },
    { t: "mc", q: "Wie bildet man den Komparativ von „vanha“?", o: ["vanhempi: -a wird zu -e, dazu -mpi", "vanhampi", "vanhapi", "vanhin"], a: 0, x: "Zweisilbige Wörter auf -a/-ä: a/ä → e + mpi (vanhempi, halvempi, pidempi). Sonst Stamm + mpi: isompi, kalliimpi, uudempi. Unregelmäßig: hyvä → parempi." },
    { t: "mc", q: "Womit vergleicht man zwei Dinge?", o: ["kuin + Grundform: halvempi kuin tuo", "kanssa: halvempi tuon kanssa", "-lla: halvempi tuolla", "ja: halvempi ja tuo"], a: 0, x: "Tämä on halvempi kuin tuo. Man hört auch: Tämä on tuota halvempi (Teilungsform, ohne kuin)." },
    { t: "mc", q: "Welche Form ist der Superlativ von „hyvä“?", o: ["paras", "hyvin", "parempi", "hyväin"], a: 0, x: "hyvä – parempi – paras. Sonst Superlativ mit -in: halvin, isoin, kallein, vanhin." },
    { t: "mc", q: "„Onko tätä isompaa kokoa?“ – Warum -paa?", o: ["Komparativ in der Teilungsform: isompi → isompaa", "Das ist der Superlativ.", "Das ist die Mehrzahl.", "Das ist die Verneinung."], a: 0, x: "Der Komparativ wird mit -mpa-/-mma- gebeugt: isompaa, isomman, isommassa." },
    { t: "les", q: "Vaatekaupassa", txt: ["Myyjä: Hei! Voinko auttaa?", "Matthias: Etsin talvitakkia.", "Myyjä: Tämä musta takki on alessa. Se on halvempi kuin harmaa.", "Matthias: Saanko sovittaa?", "Myyjä: Totta kai. Sovituskoppi on tuolla.", "Matthias: Se on vähän liian pieni. Onko isompaa kokoa?", "Myyjä: On. Tässä on koko L."], qs: [{ q: "Was sucht Matthias?", o: ["eine Winterjacke", "einen Pullover", "Schuhe"], a: 0 }, { q: "Welche Jacke ist billiger?", o: ["die schwarze", "die graue", "beide kosten gleich viel"], a: 0 }, { q: "Was ist das Problem?", o: ["Sie ist etwas zu klein.", "Sie ist zu teuer.", "Die Farbe gefällt ihm nicht."], a: 0 }] },
    { t: "les", q: "Kaksi takkia", txt: ["Punainen takki maksaa 120 euroa.", "Sininen takki maksaa 90 euroa.", "Sininen on halvempi, mutta punainen on parempi talvella.", "Ostan punaisen, koska se on kaikkein paras."], qs: [{ q: "Welche Jacke ist billiger?", o: ["die blaue", "die rote", "beide gleich"], a: 0 }, { q: "Warum kauft der Schreiber die rote?", o: ["Sie ist die allerbeste.", "Sie ist billiger.", "Sie ist größer."], a: 0 }] },
    { t: "dlg", q: "Anprobieren", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Myyjä", "Hei! Etsitkö jotain?"], ["Sinä", "[Etsin harmaata villapaitaa.|Etsin villapaitaa.|Kyllä, harmaata villapaitaa.]", "Sag: einen grauen Pullover (Teilungsform)."], ["Myyjä", "Tässä. Mikä koko?"], ["Sinä", "[M, kiitos.|Koko M.|M.]", "Sag: Größe M."], ["Myyjä", "Sovituskoppi on tuolla."], ["Sinä", "[Se on liian pieni. Onko isompaa kokoa?|Onko isompaa kokoa?|Liian pieni. Onko isompaa?]", "Er ist zu klein – frag nach einer größeren Größe."]] },
    { t: "dlg", q: "Welcher ist besser?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Kumpi on parempi, musta vai valkoinen?"], ["Sinä", "[Musta on parempi.|Musta. Se on parempi.|Minusta musta on parempi.]", "Sag: Der schwarze ist besser."], ["Aino", "Mutta valkoinen on halvempi."], ["Sinä", "[Musta on kalliimpi, mutta kauniimpi.|Totta, mutta musta on kauniimpi.]", "Sag: Der schwarze ist teurer, aber schöner."]] },
    { t: "sch", q: "Vergleiche zwei Dinge beim Preis.", w: ["kuin"], a: ["Tämä paita on halvempi kuin tuo.", "Musta takki on kalliimpi kuin harmaa takki."], h: "ein Satz mit Komparativ und „kuin“" },
    { t: "sch", q: "Schreib, wo das beste Café deiner Stadt ist.", w: ["paras"], a: ["Paras kahvila Linzissä on keskustassa.", "Linzin paras kahvila on torin lähellä."], h: "ein Satz mit „paras“" }
  ]
};
