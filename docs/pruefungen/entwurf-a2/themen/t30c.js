module.exports = {
  id: "t30c",
  title: "Feinheiten: otettiin, luettiin; on rakennettu (30.3)",
  fi: "Talo on rakennettu 1920-luvulla",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t26c", "t28b"],
  th: `<p>Feinheiten zu t30: das Passiv in der Vergangenheit mit <b>Stufenwechsel</b> (<i>otettiin, luettiin</i>) und das <b>Passiv Perfekt</b> zum Erkennen: <i>Talo on rakennettu</i> (Das Haus ist gebaut worden). Dazu das gesprochene <i>me otettiin</i>.</p>
<h3>Passiv Vergangenheit mit Stufenwechsel</h3>
<table><tr><td>Grundform</td><td>Präsens</td><td>Vergangenheit</td></tr>
<tr><td>ottaa</td><td>otetaan</td><td>otettiin</td></tr>
<tr><td>lukea</td><td>luetaan</td><td>luettiin</td></tr>
<tr><td>kirjoittaa</td><td>kirjoitetaan</td><td>kirjoitettiin</td></tr>
<tr><td>hakea</td><td>haetaan</td><td>haettiin</td></tr>
<tr><td>pitää</td><td>pidetään</td><td>pidettiin</td></tr></table>
<p class="rule">Typ 1 hat im ganzen Passiv die <b>schwache Stufe</b> (wie minä: otan, luen, kirjoitan): <i>otettiin, luettiin, kirjoitettiin</i>.</p>
<h3>Passiv Perfekt: on + -ttu / -tty / -tu</h3>
<table><tr><td>rakentaa</td><td>on rakennettu</td><td>ist gebaut (worden)</td></tr>
<tr><td>avata</td><td>on avattu</td><td>ist geöffnet</td></tr>
<tr><td>sulkea</td><td>on suljettu</td><td>ist geschlossen</td></tr>
<tr><td>tehdä</td><td>on tehty</td><td>ist gemacht</td></tr>
<tr><td>valmistaa</td><td>on valmistettu</td><td>ist hergestellt</td></tr></table>
<p class="rule">Die Form auf <b>-ttu/-tty/-tu</b> kennst du aus der Verneinung (<i>ei menty, ei puhuttu</i>). Mit <i>on</i> wird daraus das Passiv Perfekt. Auf Schildern und Produkten steht sie allein: <i>Suljettu. Avattu 1.5. Valmistettu Suomessa.</i> Du musst sie hier nur erkennen.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Me otettiin paljon kuvia.</i> (= Otimme paljon kuvia.) · <i>Me luettiin koko ilta.</i> · <i>Talossa on remontti.</i> (Im Haus wird renoviert.)</p>
<p class="tip"><b>Kulttuuri:</b> Helsinki wurde 1550 gegründet; der weiße Dom (<i>tuomiokirkko</i>) wurde im 19. Jahrhundert gebaut, die Bibliothek <i>Oodi</i> 2018 eröffnet.</p>`,
  v: [
    ["rakentaa", "bauen (rakennan; on rakennettu)"],
    ["perustaa", "gründen (perustan; perustettiin)"],
    ["valmistaa", "herstellen (valmistan)"],
    ["valmistettu Suomessa", "hergestellt in Finnland"],
    ["remontti", "Renovierung, Umbau"],
    ["tuomiokirkko", "Dom, Kathedrale"]
  ],
  ex: [
    { t: "tab", q: "Passiv mit Stufenwechsel", h: "Jedes Kästchen eine eigene Form: links Präsens, rechts Vergangenheit (schwache Stufe) – z. B. ottaa | otetaan | otettiin", head: ["Grundform", "Präsens", "Vergangenheit"], r: [["ottaa", "[otetaan]", "[otettiin]"], ["lukea", "[luetaan]", "[luettiin]"], ["kirjoittaa", "[kirjoitetaan]", "[kirjoitettiin]"], ["hakea", "[haetaan]", "[haettiin]"], ["pitää", "[pidetään]", "[pidettiin]"]], s: 1 },
    { t: "tab", q: "Passiv Perfekt", h: "Jedes Kästchen zwei Wörter: on + Form auf -ttu/-tty/-tu", head: ["Grundform", "Passiv Perfekt"], r: [["rakentaa", "[on rakennettu]"], ["avata", "[on avattu]"], ["lukea", "[on luettu]"], ["tehdä", "[on tehty]"], ["perustaa", "[on perustettu]"]], s: 1 },
    { t: "gap", q: "Retkellä ___ paljon kuvia.", h: "ottaa – Passiv Vergangenheit (schwache Stufe)", a: ["otettiin"], s: 1 },
    { t: "gap", q: "Talo on ___ vuonna 1920.", h: "rakentaa – Form auf -ttu (nt → nn)", a: ["rakennettu"], s: 1 },
    { t: "gap", q: "Helsinki ___ vuonna 1550.", h: "perustaa – Passiv Vergangenheit: wurde gegründet", a: ["perustettiin"], s: 1 },
    { t: "gap", q: "Kauppa on ___.", h: "avata – Form auf -ttu: geöffnet", a: ["avattu"] },
    { t: "gap", q: "Tämä laukku on valmistettu ___.", h: "in Finnland", a: ["Suomessa"] },
    { t: "gap", q: "Kirjeet ___ eilen.", h: "kirjoittaa – Passiv Vergangenheit", a: ["kirjoitettiin"], s: 1 },
    { t: "tr", dir: "de", q: "Das Haus wurde 1950 gebaut.", a: ["Talo rakennettiin vuonna 1950", "Talo on rakennettu vuonna 1950"] },
    { t: "tr", dir: "de", q: "Hergestellt in Finnland.", a: ["Valmistettu Suomessa"] },
    { t: "tr", dir: "fi", q: "Kirjastossa on remontti. Se on suljettu.", a: ["In der Bibliothek wird renoviert. Sie ist geschlossen", "Die Bibliothek wird renoviert. Sie ist geschlossen"] },
    { t: "tr", dir: "fi", q: "Eilen luettiin paljon ja kirjoitettiin vähän.", a: ["Gestern wurde viel gelesen und wenig geschrieben", "Gestern haben wir viel gelesen und wenig geschrieben"] },
    { t: "ord", w: ["Tämä", "kirkko", "on", "rakennettu", "1600-luvulla"], a: ["Tämä kirkko on rakennettu 1600-luvulla."], de: "Diese Kirche wurde im 17. Jahrhundert gebaut." },
    { t: "mc", q: "Wie heißt das Passiv Vergangenheit von „ottaa“?", o: ["otettiin", "ottettiin", "otiin", "ottiin"], a: 0, x: "Typ 1 im Passiv: schwache Stufe wie minä (otan) → otetaan, otettiin." },
    { t: "mc", q: "„Talo on rakennettu.“ – Was ist das?", o: ["Passiv Perfekt: Das Haus ist gebaut (worden).", "Das Haus baut.", "Bau das Haus!", "Das Haus wird morgen gebaut."], a: 0, x: "Passiv Perfekt = on + -ttu/-tty/-tu. Häufig auf Schildern und in Texten: avattu, suljettu, valmistettu." },
    { t: "mc", q: "Gesprochen: „Me otettiin paljon kuvia.“ – geschrieben:", o: ["Otimme paljon kuvia.", "Otamme paljon kuvia.", "Kuvia otetaan paljon.", "Ota paljon kuvia!"], a: 0, x: "me + Passiv (gesprochen) = wir … (geschrieben -imme)." },
    { t: "mc", q: "Auf einem Schild steht „SULJETTU“. Das heißt:", o: ["geschlossen", "geöffnet", "verboten", "besetzt"], a: 0 },
    { t: "les", q: "Helsinki", txt: ["Helsinki perustettiin vuonna 1550.", "Tuomiokirkko rakennettiin 1800-luvulla.", "Kauppatorilla myydään kalaa ja marjoja.", "Oodi-kirjasto avattiin vuonna 2018."], qs: [{ q: "Wann wurde Helsinki gegründet?", o: ["1550", "1850", "2018"], a: 0 }, { q: "Wann wurde der Dom gebaut?", o: ["im 19. Jahrhundert", "1550", "2018"], a: 0 }, { q: "Was ist Oodi?", o: ["eine Bibliothek", "ein Markt", "eine Kirche"], a: 0 }] },
    { t: "les", q: "Retkipäivä", txt: ["Me lähdettiin aamulla aikaisin.", "Ensin käytiin kaupassa ja otettiin eväät mukaan.", "Metsässä otettiin paljon kuvia.", "Illalla luettiin ja pelattiin korttia.", "Kaikki oli tosi kivaa!"], qs: [{ q: "Was nahmen sie mit?", o: ["Proviant", "ein Zelt", "ein Boot"], a: 0 }, { q: "Was machten sie im Wald?", o: ["viele Fotos", "schwimmen", "angeln"], a: 0 }, { q: "Was machten sie am Abend?", o: ["lesen und Karten spielen", "Sauna", "fernsehen"], a: 0 }] },
    { t: "dlg", q: "Ein altes Haus", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Tämä on kaunis talo! Milloin se on rakennettu?"], ["Sinä", "[Se on rakennettu 1920-luvulla.|1920-luvulla.|Se rakennettiin 1920-luvulla.]", "Sag: in den 1920ern."], ["Aino", "Onko talossa remontti?"], ["Sinä", "[On, keittiö on uusi.|On, keittiö on juuri tehty.|On. Keittiö on uusi.]", "Sag: Ja, die Küche ist gerade neu gemacht."]] },
    { t: "dlg", q: "Was habt ihr gemacht?", h: "Deine Zeilen auf Finnisch schreiben – gesprochenes „wir“ ist erlaubt", r: [["Aino", "Mitä te teitte eilen?"], ["Sinä", "[Me käytiin museossa.|Käytiin museossa.|Kävimme museossa.]", "Sag: Ihr wart im Museum."], ["Aino", "Otitteko kuvia?"], ["Sinä", "[Joo, otettiin paljon kuvia.|Otettiin, paljon!|Otimme paljon kuvia.]", "Sag ja – viele Fotos."]] },
    { t: "sch", q: "Schreib, wann ein Gebäude in deiner Stadt gebaut wurde.", w: ["rakennettu"], a: ["Talomme on rakennettu vuonna 1970.", "Linzin uusi tuomiokirkko on rakennettu 1900-luvulla."], h: "ein Satz im Passiv Perfekt" },
    { t: "sch", q: "Schreib im gesprochenen Stil, was ihr gestern gemacht habt.", w: ["me"], a: ["Me käytiin kaupassa ja illalla saunottiin.", "Me oltiin kotona ja luettiin."], h: "ein Satz: me + Passiv" }
  ]
};
