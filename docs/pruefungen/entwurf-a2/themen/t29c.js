module.exports = {
  id: "t29c",
  title: "Feinheiten: näyttää väsyneeltä, kuulostaa hyvältä; joka oder mikä (29.3)",
  fi: "Kuulostaa hyvältä!",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t14c", "t21d", "t28c"],
  th: `<p>Feinheiten zu t29: wie jemand <b>aussieht</b>, wie etwas <b>klingt</b>, sich <b>anfühlt</b>, <b>schmeckt</b> oder <b>riecht</b> – und wann man <b>mikä</b> statt <i>joka</i> nimmt.</p>
<h3>Sinnesverben + -lta / -ltä</h3>
<table><tr><td>näyttää</td><td>Näytät väsyneeltä.</td><td>Du siehst müde aus.</td></tr>
<tr><td>kuulostaa</td><td>Se kuulostaa hyvältä.</td><td>Das klingt gut.</td></tr>
<tr><td>tuntua</td><td>Vesi tuntuu kylmältä.</td><td>Das Wasser fühlt sich kalt an.</td></tr>
<tr><td>maistua</td><td>Kahvi maistuu hyvältä.</td><td>Der Kaffee schmeckt gut.</td></tr>
<tr><td>haista</td><td>Täällä haisee pahalta.</td><td>Hier riecht es schlecht.</td></tr></table>
<p class="rule">Nach diesen Verben steht das Adjektiv mit <b>-lta/-ltä</b> (Stamm wie vor -n): <i>väsynyt → väsyneeltä, kaunis → kauniilta, onnellinen → onnelliselta</i>. Frage: <i>Miltä se näyttää / tuntuu?</i> Ganz allgemein: <i>Näyttää siltä, että huomenna sataa.</i> (Es sieht so aus, als …)</p>
<h3>joka oder mikä?</h3>
<table><tr><td>joka</td><td>bezieht sich auf ein Nomen: <i>Nainen, joka asuu tuolla …</i></td></tr>
<tr><td>mikä</td><td>nach <i>kaikki, se, jokin</i>: <i>Kaikki, mikä on alessa, on halpaa.</i></td></tr>
<tr><td>mikä</td><td>auf den ganzen Satz: <i>Hän tuli ajoissa, mikä oli kiva.</i></td></tr></table>
<p class="rule"><i>mikä</i> wird gebeugt wie das Fragewort: <i>Se, mitä sanoit, oli totta.</i> (mitä = Teilungsform)</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Kuulostaa hyvältä!</i> = Klingt gut! (Zustimmung zu einem Vorschlag) · <i>Toi näyttää kivalta!</i> (toi = tuo) · <i>Miltä tuntuu?</i> = Wie fühlst du dich?</p>`,
  v: [
    ["näyttää", "aussehen (+ -lta); zeigen (näytän)"],
    ["kuulostaa", "klingen (kuulostaa hyvältä)"],
    ["tuntua", "sich anfühlen, scheinen (tuntuu)"],
    ["haista", "riechen (haisee)"],
    ["paha", "schlecht, böse (pahalta)"],
    ["miltä?", "wie? (miltä näyttää? = wie sieht es aus?)"],
    ["kaikki, mikä", "alles, was (mikä als Relativpronomen)"]
  ],
  ex: [
    { t: "tab", q: "Adjektiv + -lta / -ltä", h: "Jedes Kästchen ein Wort: Adjektiv mit -lta/-ltä (Stamm wie vor -n)", head: ["Adjektiv", "näyttää …"], r: [["hyvä", "[hyvältä]"], ["paha", "[pahalta]"], ["kylmä", "[kylmältä]"], ["väsynyt", "[väsyneeltä]"], ["kiva", "[kivalta]"], ["kaunis", "[kauniilta]"]], s: 1 },
    { t: "gap", q: "Näytät ___. Nukuitko huonosti?", h: "väsynyt + -ltä", a: ["väsyneeltä"], s: 1 },
    { t: "gap", q: "Se ___ hyvältä!", h: "kuulostaa – Form für „se“: klingt", a: ["kuulostaa"] },
    { t: "gap", q: "Vesi ___ kylmältä.", h: "tuntua – Form für „se“: fühlt sich an", a: ["tuntuu"] },
    { t: "gap", q: "Täällä haisee ___.", h: "paha + -lta: schlecht", a: ["pahalta"] },
    { t: "gap", q: "Kaikki, ___ on alessa, on halpaa.", h: "Relativpronomen nach „kaikki“", a: ["mikä"] },
    { t: "gap", q: "Hän tuli ajoissa, ___ oli kiva.", h: "Relativpronomen für den ganzen Satz davor", a: ["mikä"] },
    { t: "gap", q: "Nainen, ___ asuu tuolla, on lääkäri.", h: "joka oder mikä? (bezieht sich auf eine Person)", a: ["joka"] },
    { t: "tr", dir: "de", q: "Das klingt gut!", a: ["Se kuulostaa hyvältä", "Kuulostaa hyvältä"] },
    { t: "tr", dir: "de", q: "Du siehst glücklich aus.", a: ["Näytät onnelliselta", "Sinä näytät onnelliselta"] },
    { t: "tr", dir: "de", q: "Die Suppe schmeckt gut.", a: ["Keitto maistuu hyvältä"] },
    { t: "tr", dir: "fi", q: "Näyttää siltä, että huomenna sataa.", a: ["Es sieht so aus, als würde es morgen regnen", "Es sieht so aus, als ob es morgen regnet", "Es sieht aus, als würde es morgen regnen"] },
    { t: "tr", dir: "fi", q: "Se, mitä sanoit, oli totta.", a: ["Was du gesagt hast, war wahr", "Das, was du gesagt hast, war wahr", "Was du sagtest, war wahr"] },
    { t: "ord", w: ["Tämä", "kakku", "maistuu", "tosi", "hyvältä"], a: ["Tämä kakku maistuu tosi hyvältä."], de: "Dieser Kuchen schmeckt richtig gut." },
    { t: "mc", q: "Welche Form steht nach „näyttää“, „kuulostaa“, „tuntua“?", o: ["Adjektiv mit -lta/-ltä: näyttää väsyneeltä", "Adjektiv in der Grundform: näyttää väsynyt", "mit -ksi: näyttää väsyneeksi", "mit -na: näyttää väsyneenä"], a: 0, x: "Sinnesverben + -lta/-ltä: näyttää, kuulostaa, tuntua, maistua, haista. Kahvi maistuu hyvältä (14.3)." },
    { t: "mc", q: "„joka“ oder „mikä“?", o: ["joka bezieht sich auf ein Nomen, mikä auf kaikki/se oder einen ganzen Satz", "immer joka", "mikä nur für Personen", "Beide sind immer gleich."], a: 0, x: "Mies, joka … – Kaikki, mikä … – Hän tuli ajoissa, mikä oli kiva. Teilungsform: mitä (Se, mitä sanoit …)." },
    { t: "mc", q: "Gesprochen: Wann sagt man „Kuulostaa hyvältä!“?", o: ["wenn man einem Vorschlag zustimmt", "wenn man nichts hört", "wenn man Musik hört", "wenn man etwas ablehnt"], a: 0, x: "Mennään elokuviin! – Kuulostaa hyvältä! (= Gute Idee!)" },
    { t: "mc", q: "Gesprochen: „Toi näyttää kivalta!“ – geschrieben:", o: ["Tuo näyttää kivalta!", "Tuo näytti kivalta!", "Tuo on kiva näyttää!", "Näytä tuo!"], a: 0, x: "toi = tuo (gesprochen)." },
    { t: "les", q: "Uusi kahvila", txt: ["Kävimme uudessa kahvilassa.", "Kahvila näytti tosi kauniilta.", "Kahvi maistui hyvältä, mutta pulla ei maistunut hyvältä.", "Kaikki, mikä oli kahvilassa, oli kallista.", "Myyjä oli ystävällinen, mikä oli kiva."], qs: [{ q: "Wie sah das Café aus?", o: ["sehr schön", "alt", "schmutzig"], a: 0 }, { q: "Was schmeckte nicht gut?", o: ["die Pulla", "der Kaffee", "beides"], a: 0 }, { q: "Was war nett?", o: ["die freundliche Verkäuferin", "der Preis", "die Musik"], a: 0 }] },
    { t: "les", q: "Lääkärissä", txt: ["Lääkäri: Miltä nyt tuntuu?", "Matthias: Kurkku tuntuu kipeältä ja pää on kuuma.", "Lääkäri: Näytät väsyneeltä. Onko sinulla kuumetta?", "Matthias: Luulen, että on.", "Lääkäri: Kuulostaa flunssalta. Lepää muutama päivä."], qs: [{ q: "Was tut Matthias weh?", o: ["der Hals", "der Bauch", "der Rücken"], a: 0 }, { q: "Wie sieht er aus?", o: ["müde", "fröhlich", "gesund"], a: 0 }, { q: "Was denkt die Ärztin?", o: ["Es klingt nach einer Erkältung.", "Es ist nichts.", "Er muss ins Krankenhaus."], a: 0 }] },
    { t: "dlg", q: "Ein Vorschlag", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Mennään huomenna mökille!"], ["Sinä", "[Kuulostaa hyvältä!|Se kuulostaa hyvältä!|Kuulostaa kivalta!]", "Stimme zu: Klingt gut!"], ["Aino", "Sää näyttää kuitenkin huonolta."], ["Sinä", "[Ei se haittaa.|Ei haittaa!|Ei se mitään.]", "Sag: macht nichts."]] },
    { t: "dlg", q: "Wie fühlst du dich?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Miltä nyt tuntuu?"], ["Sinä", "[Tuntuu hyvältä!|Hyvältä, kiitos.|Tosi hyvältä!]", "Sag: gut."], ["Aino", "Näytät iloiselta!"], ["Sinä", "[Kiitos! Kaikki, mikä tänään tapahtui, oli kivaa.|Kiitos, olen iloinen.|Kiitos!]", "Bedanke dich – alles, was heute passiert ist, war schön."]] },
    { t: "sch", q: "Beschreib, wie etwas aussieht und schmeckt.", w: ["näyttää", "maistuu"], a: ["Kakku näyttää kauniilta ja maistuu hyvältä.", "Keitto näyttää hyvältä ja maistuu hyvältä."], h: "ein Satz mit Adjektiv + -lta/-ltä" },
    { t: "sch", q: "Schreib einen Satz mit „…, mikä oli …“.", w: ["mikä"], a: ["Bussi tuli ajoissa, mikä oli kiva.", "Juna oli myöhässä, mikä ei ollut kivaa."], h: "ein Satz – mikä bezieht sich auf den ganzen Satz davor" }
  ]
};
