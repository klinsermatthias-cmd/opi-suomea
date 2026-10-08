module.exports = {
  id: "t30",
  title: "Natur, Mökki & Ausflüge (Passiv Vergangenheit)",
  fi: "Mentiin retkelle",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t28b"],
  th: `<p>Situation: Du erzählst von einem Ausflug in die Natur, vom Wochenende auf der Hütte, von Lappland im Winter – was „man“ oder „wir“ gemacht haben. Dafür lernst du das <b>Passiv in der Vergangenheit</b>: <i>Mentiin retkelle. Uitiin ja saunottiin.</i></p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Viime lauantaina mentiin retkelle.</td><td>Letzten Samstag haben wir einen Ausflug gemacht.</td></tr>
<tr><td>Rannalla grillattiin makkaraa.</td><td>Am Strand wurde Wurst gegrillt.</td></tr>
<tr><td>Illalla istuttiin nuotiolla.</td><td>Am Abend saßen wir am Lagerfeuer.</td></tr>
<tr><td>Nukuttiin teltassa.</td><td>Wir haben im Zelt geschlafen.</td></tr>
<tr><td>Lapissa nähtiin revontulet.</td><td>In Lappland haben wir Nordlichter gesehen.</td></tr>
<tr><td>Ei uitu, koska vesi oli kylmää.</td><td>Wir sind nicht geschwommen, weil das Wasser kalt war.</td></tr>
</table>
<h3>Passiv: Präsens → Vergangenheit</h3>
<table><tr><td>Grundform</td><td>Präsens</td><td>Vergangenheit</td></tr>
<tr><td>puhua</td><td>puhutaan</td><td>puhuttiin</td></tr>
<tr><td>ostaa</td><td>ostetaan</td><td>ostettiin</td></tr>
<tr><td>syödä</td><td>syödään</td><td>syötiin</td></tr>
<tr><td>mennä</td><td>mennään</td><td>mentiin</td></tr>
<tr><td>olla</td><td>ollaan</td><td>oltiin</td></tr>
<tr><td>haluta</td><td>halutaan</td><td>haluttiin</td></tr></table>
<p class="rule">Aus <b>-taan/-tään</b> wird <b>-ttiin</b> (puhuttiin, ostettiin, haluttiin); aus <b>-daan/-dään</b> wird <b>-tiin</b> (syötiin, juotiin); bei Typ 3 Stamm + <b>-tiin</b> (mentiin, oltiin, tultiin). <b>Verneint:</b> <i>ei</i> + <b>-ttu/-tty</b> bzw. <b>-tu/-ty</b>: <i>ei puhuttu, ei syöty, ei menty, ei oltu</i>.</p>
<p class="rule">Wie im Präsens: geschrieben „man“, gesprochen meist „wir“: <i>Me mentiin mökille.</i> (= Menimme mökille.) Das ganze Objekt bleibt im Passiv in der Grundform: <i>Nähtiin revontulet. Syötiin eväät.</i></p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Me oltiin mökillä koko viikonloppu.</i> · <i>Me ei menty uimaan.</i> (= Emme menneet uimaan.) · <i>Lähdetäänkö?</i> (= Lass uns losgehen?)</p>
<p class="tip"><b>Kulttuuri:</b> Finnland hat über 40 Nationalparks (<i>kansallispuisto</i>) mit markierten Wegen (<i>polku</i>) und offenen Unterständen (<i>laavu</i>) mit Feuerstelle – frei für alle. Im Sommer gehören Mücken (<i>hyttyset</i>) leider dazu.</p>`,
  v: [
    ["retki", "Ausflug (retkelle = auf einen Ausflug)"],
    ["metsäretki", "Waldausflug"],
    ["kävelyretki", "Wanderung, Spaziergang"],
    ["kansallispuisto", "Nationalpark"],
    ["polku", "Pfad, Weg (polun)"],
    ["vuori", "Berg"],
    ["tunturi", "Fjell (Berg in Lappland)"],
    ["kallio", "Fels"],
    ["maisema", "Landschaft, Aussicht"],
    ["teltta", "Zelt"],
    ["laavu", "offener Unterstand mit Feuerstelle"],
    ["nuotio", "Lagerfeuer"],
    ["eväät", "Proviant, Jause (Mehrzahl)"],
    ["piknik", "Picknick"],
    ["grillata", "grillen (grillaan)"],
    ["vene", "Boot (veneen)"],
    ["kanootti", "Kanu"],
    ["soutaa", "rudern (soudan)"],
    ["hyttynen", "Mücke (hyttysiä)"],
    ["revontulet", "Nordlicht (Mehrzahl)"]
  ],
  ex: [
    { t: "tab", q: "Passiv Präsens und Vergangenheit", h: "Jedes Kästchen eine eigene Form: links Passiv Präsens, rechts Passiv Vergangenheit – z. B. mennä | mennään | mentiin", head: ["Grundform", "Präsens", "Vergangenheit"], r: [["mennä", "[mennään]", "[mentiin]"], ["olla", "[ollaan]", "[oltiin]"], ["syödä", "[syödään]", "[syötiin]"], ["juoda", "[juodaan]", "[juotiin]"], ["uida", "[uidaan]", "[uitiin]"], ["puhua", "[puhutaan]", "[puhuttiin]"]], s: 1 },
    { t: "tab", q: "Passiv Vergangenheit verneint", h: "Jedes Kästchen zwei Wörter: ei + Form auf -tu/-ty bzw. -ttu/-tty", head: ["Grundform", "verneint"], r: [["mennä", "[ei menty]"], ["olla", "[ei oltu]"], ["syödä", "[ei syöty]"], ["uida", "[ei uitu]"], ["puhua", "[ei puhuttu]"]], s: 1 },
    { t: "gap", q: "Eilen ___ retkelle.", h: "mennä – Passiv Vergangenheit", a: ["mentiin"] },
    { t: "gap", q: "Rannalla ___ makkaraa.", h: "grillata – Passiv Vergangenheit", a: ["grillattiin"], s: 1 },
    { t: "gap", q: "Illalla ___ saunassa.", h: "olla – Passiv Vergangenheit", a: ["oltiin"] },
    { t: "gap", q: "Järvellä ___ veneellä.", h: "soutaa – Passiv Vergangenheit (Stufenwechsel t → d, a → e)", a: ["soudettiin"], s: 1 },
    { t: "gap", q: "Kesällä ei ___ ulkomaille.", h: "mennä – verneintes Passiv Vergangenheit", a: ["menty"] },
    { t: "gap", q: "Lapissa nähtiin ___.", h: "Nordlicht (Mehrzahl-Wort)", a: ["revontulet", "revontulia"] },
    { t: "gap", q: "Otimme ___ mukaan.", h: "Proviant (Mehrzahl-Wort)", a: ["eväät"] },
    { t: "tr", dir: "de", q: "Am Samstag sind wir in den Wald gegangen.", a: ["Lauantaina mentiin metsään", "Lauantaina menimme metsään", "Me mentiin lauantaina metsään", "Lauantaina me mentiin metsään"] },
    { t: "tr", dir: "de", q: "Im Nationalpark gibt es viele Wege.", a: ["Kansallispuistossa on paljon polkuja", "Kansallispuistossa on monta polkua"] },
    { t: "tr", dir: "de", q: "Wir haben im Zelt geschlafen.", a: ["Nukuimme teltassa", "Me nukuimme teltassa", "Nukuttiin teltassa", "Me nukuttiin teltassa"] },
    { t: "tr", dir: "fi", q: "Mökillä uitiin, saunottiin ja syötiin hyvin.", a: ["Auf der Hütte sind wir geschwommen, waren in der Sauna und haben gut gegessen", "Auf der Hütte schwamm man, ging in die Sauna und aß gut", "Auf der Hütte haben wir geschwommen, sauniert und gut gegessen"] },
    { t: "tr", dir: "fi", q: "Hyttysiä oli tosi paljon!", a: ["Es gab sehr viele Mücken", "Es waren sehr viele Mücken da"] },
    { t: "ord", w: ["Illalla", "istuttiin", "nuotiolla"], a: ["Illalla istuttiin nuotiolla.", "Istuttiin illalla nuotiolla."], de: "Am Abend saßen wir am Lagerfeuer." },
    { t: "ord", w: ["Maisema", "tunturilta", "oli", "kaunis"], a: ["Maisema tunturilta oli kaunis."], de: "Die Aussicht vom Fjell war schön." },
    { t: "mc", q: "Wie bildet man das Passiv in der Vergangenheit?", o: ["-taan/-daan/-an wird zu -ttiin/-tiin: puhuttiin, syötiin, mentiin", "Passiv + -i-: puhutaani", "oli + Passiv: oli puhutaan", "Es ist gleich wie im Präsens."], a: 0, x: "puhutaan → puhuttiin, syödään → syötiin, mennään → mentiin, ollaan → oltiin." },
    { t: "mc", q: "Wie verneint man „mentiin“?", o: ["ei menty", "ei mentiin", "eivät menty", "en mentiin"], a: 0, x: "ei + Form auf -tu/-ty: ei menty, ei oltu, ei syöty, ei puhuttu. Immer ei." },
    { t: "mc", q: "„Me mentiin rannalle.“ – Was ist das?", o: ["gesprochen für „menimme“ (wir gingen)", "„man geht“", "ein Befehl", "das Perfekt"], a: 0, x: "Wie me mennään (Präsens) ist me mentiin das gesprochene „wir“ in der Vergangenheit." },
    { t: "mc", q: "Was ist ein „laavu“?", o: ["ein offener Unterstand mit Feuerstelle", "ein Ruderboot", "ein Zelt aus Stoff", "ein kleiner See"], a: 0 },
    { t: "les", q: "Retki kansallispuistoon", txt: ["Viime lauantaina mentiin retkelle kansallispuistoon.", "Ensin käveltiin metsässä kalliolle.", "Siellä syötiin eväät ja katsottiin maisemaa.", "Sitten mentiin laavulle ja tehtiin nuotio.", "Hyttysiä oli paljon, mutta päivä oli ihana!"], qs: [{ q: "Wohin ging der Ausflug?", o: ["in einen Nationalpark", "ans Meer", "in die Stadt"], a: 0 }, { q: "Was machten sie auf dem Felsen?", o: ["Proviant essen und die Landschaft anschauen", "schlafen", "angeln"], a: 0 }, { q: "Was war störend?", o: ["viele Mücken", "Regen", "Kälte"], a: 0 }] },
    { t: "les", q: "Lapissa talvella", txt: ["Talvella oltiin viikko Lapissa.", "Päivällä hiihdettiin tunturilla.", "Illalla katsottiin revontulia.", "Nukuttiin mökissä, ei teltassa – oli liian kylmä!"], qs: [{ q: "Was machten sie tagsüber?", o: ["Ski fahren", "Kanu fahren", "angeln"], a: 0 }, { q: "Was sahen sie am Abend?", o: ["Nordlichter", "Rentiere", "einen Film"], a: 0 }, { q: "Warum schliefen sie nicht im Zelt?", o: ["Es war zu kalt.", "Es war zu teuer.", "Es gab keinen Platz."], a: 0 }] },
    { t: "dlg", q: "Wie war das Wochenende?", h: "Deine Zeilen auf Finnisch schreiben – gesprochenes „wir“ ist erlaubt", r: [["Kollega", "Mitä teitte viikonloppuna?"], ["Sinä", "[Mentiin mökille.|Me mentiin mökille.|Menimme mökille.]", "Sag: Ihr seid zur Hütte gefahren."], ["Kollega", "Mitä siellä tehtiin?"], ["Sinä", "[Saunottiin ja uitiin.|Me saunottiin ja uitiin.|Saunoimme ja uimme.]", "Sag: Sauna und schwimmen."], ["Kollega", "Kalastettiinko?"], ["Sinä", "[Ei kalastettu. Soudettiin vain.|Ei, mutta soudettiin.|Ei kalastettu.]", "Sag nein – ihr seid nur gerudert."]] },
    { t: "dlg", q: "Einen Ausflug planen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Lähdetäänkö huomenna retkelle?"], ["Sinä", "[Lähdetään! Otetaan eväät mukaan.|Joo, lähdetään!|Lähdetään!]", "Sag zu und schlag vor, Proviant mitzunehmen."], ["Aino", "Entä teltta?"], ["Sinä", "[Ei tarvita telttaa, mennään laavulle.|Ei tarvita. Mennään laavulle.]", "Sag: kein Zelt nötig – ihr geht zur Laavu."]] },
    { t: "sch", q: "Schreib im Passiv (Vergangenheit), was ihr am Wochenende gemacht habt.", w: ["mentiin"], a: ["Viikonloppuna mentiin rannalle ja grillattiin makkaraa.", "Lauantaina mentiin metsään ja illalla saunottiin."], h: "ein oder zwei Sätze im Passiv" },
    { t: "sch", q: "Schreib, was ihr nicht gemacht habt – mit Grund.", w: ["ei", "koska"], a: ["Ei uitu, koska vesi oli kylmää.", "Ei menty retkelle, koska satoi."], h: "ein Satz: verneintes Passiv + koska" }
  ]
};
