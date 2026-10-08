module.exports = {
  id: "t24d",
  title: "Kultur erleben: Kino, Konzert, Kunst (24.4)",
  fi: "Mennäänkö elokuviin?",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t21c", "t21d"],
  th: `<p>Situation: Du verabredest dich fürs Kino oder ein Konzert, liest ein Kulturprogramm, kaufst Karten und sagst, was dir gefällt. Dazu ein paar Grundbegriffe zu Literatur, Medien und Religion in Finnland.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Mennäänkö elokuviin lauantaina?</td><td>Gehen wir am Samstag ins Kino?</td></tr>
<tr><td>Mihin aikaan esitys alkaa?</td><td>Um wie viel Uhr beginnt die Vorstellung?</td></tr>
<tr><td>Kauanko elokuva kestää?</td><td>Wie lange dauert der Film?</td></tr>
<tr><td>Kaksi lippua, kiitos.</td><td>Zwei Karten, bitte.</td></tr>
<tr><td>Pidän taiteesta ja kirjallisuudesta.</td><td>Ich mag Kunst und Literatur.</td></tr>
<tr><td>Mikä on lempielokuvasi?</td><td>Was ist dein Lieblingsfilm?</td></tr>
</table>
<h3>Wohin? – Was magst du?</h3>
<table><tr><td>Wohin (mennä …)</td><td>Was (pitää …-sta)</td></tr>
<tr><td>elokuviin (ins Kino)</td><td>elokuvista</td></tr>
<tr><td>konserttiin</td><td>musiikista</td></tr>
<tr><td>teatteriin</td><td>teatterista</td></tr>
<tr><td>näyttelyyn</td><td>taiteesta</td></tr>
<tr><td>kirjastoon</td><td>kirjallisuudesta</td></tr></table>
<p class="rule"><i>elokuviin</i> = „zu den Filmen“ (Mehrzahl) – so sagt man „ins Kino“. <i>taide → taiteesta</i> wie <i>sade → sateen</i> (21.4); <i>kirjallisuus → kirjallisuudesta</i> wie <i>rakkaus</i> (21.3). <i>Mennäänkö …?</i> ist ein Vorschlag (aus <i>Mennään!</i>, t16; mehr in t26).</p>
<p class="rule"><b>lempi-</b> vor einem Wort = Lieblings-: <i>lempiruoka, lempiväri, lempikirjailija</i>.</p>
<h3>Kultur in Finnland</h3>
<p class="tip">Bekannte Namen: <i>Jean Sibelius</i> (Komponist), <i>Aleksis Kivi</i> (Roman <i>Seitsemän veljestä</i>), <i>Tove Jansson</i> (Mumins). Die meisten Finninnen und Finnen gehören zur <i>luterilainen kirkko</i> (evangelisch-lutherische Kirche); es gibt auch eine orthodoxe Kirche.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mennäänks leffaan?</i> (= Mennäänkö elokuviin? <i>leffa</i> = Film, Kino) · <i>keikka</i> = Konzert (einer Band) · <i>Mikä on sun lempileffa?</i></p>`,
  v: [
    ["kulttuuri", "Kultur"],
    ["vapaa-aika", "Freizeit (vapaa-aikana)"],
    ["elokuvateatteri", "Kino (Gebäude)"],
    ["elokuviin", "ins Kino"],
    ["konsertti", "Konzert"],
    ["näyttely", "Ausstellung"],
    ["taide", "Kunst (taiteen, taiteesta)"],
    ["kirjallisuus", "Literatur (kirjallisuuden)"],
    ["kirjailija", "Schriftsteller/in"],
    ["näytelmä", "Theaterstück"],
    ["esitys", "Vorstellung, Aufführung (esityksen)"],
    ["katsoja", "Zuschauer/in"],
    ["ohjelma", "Programm, Sendung"],
    ["sarja", "Serie"],
    ["lempi-", "Lieblings- (lempielokuva)"],
    ["uskonto", "Religion"],
    ["luterilainen", "lutherisch"]
  ],
  ex: [
    { t: "tab", q: "pitää + -sta", h: "Jedes Kästchen ein Wort mit -sta/-stä; bei taide und kirjallisuus auf den Stamm achten", head: ["Wort", "Pidän …"], r: [["taide", "[taiteesta]"], ["kirjallisuus", "[kirjallisuudesta]"], ["musiikki", "[musiikista]"], ["teatteri", "[teatterista]"], ["näyttely", "[näyttelystä]"]], s: 1 },
    { t: "tab", q: "Wohin gehen wir?", h: "Jedes Kästchen ein Wort in der Wohin-Form", head: ["Deutsch", "Suomeksi"], r: [["ins Kino", "[elokuviin]"], ["ins Konzert", "[konserttiin]"], ["ins Theater", "[teatteriin]"], ["in die Ausstellung", "[näyttelyyn]"], ["ins Museum", "[museoon]"]], s: 1 },
    { t: "gap", q: "Mennäänkö ___ illalla?", h: "ins Kino – ein Wort", a: ["elokuviin"] },
    { t: "gap", q: "Pidän ___.", h: "taide + -sta (Stamm taitee-)", a: ["taiteesta"], s: 1 },
    { t: "gap", q: "Elokuva ___ kaksi tuntia.", h: "kestää – Form für „se“: dauert", a: ["kestää"] },
    { t: "gap", q: "Mikä on ___?", h: "ein Wort: lempi + elokuva + -si (dein Lieblingsfilm)", a: ["lempielokuvasi"], s: 1 },
    { t: "gap", q: "Ostin kaksi ___ konserttiin.", h: "lippu nach einer Zahl: Teilungsform", a: ["lippua"] },
    { t: "gap", q: "Hän kuuluu ___ kirkkoon.", h: "kuulua = gehören zu; luterilainen in derselben Form wie „kirkkoon“", a: ["luterilaiseen"], s: 1 },
    { t: "tr", dir: "de", q: "Gehen wir heute Abend ins Kino?", a: ["Mennäänkö tänä iltana elokuviin", "Mennäänkö elokuviin tänä iltana", "Mennäänkö illalla elokuviin", "Mennäänkö elokuviin illalla"] },
    { t: "tr", dir: "de", q: "Ich mag Theater und Kunst.", a: ["Pidän teatterista ja taiteesta", "Minä pidän teatterista ja taiteesta"] },
    { t: "tr", dir: "de", q: "Wann beginnt die Vorstellung?", a: ["Milloin esitys alkaa", "Mihin aikaan esitys alkaa"] },
    { t: "tr", dir: "fi", q: "Katson usein suomalaisia sarjoja.", a: ["Ich schaue oft finnische Serien", "Ich sehe oft finnische Serien"] },
    { t: "tr", dir: "fi", q: "Kirjailija kirjoittaa uutta kirjaa.", a: ["Der Schriftsteller schreibt ein neues Buch", "Die Schriftstellerin schreibt ein neues Buch", "Der Schriftsteller schreibt gerade ein neues Buch", "Die Schriftstellerin schreibt gerade ein neues Buch"] },
    { t: "ord", w: ["Konsertti", "alkaa", "kello", "seitsemän"], a: ["Konsertti alkaa kello seitsemän."], de: "Das Konzert beginnt um sieben Uhr." },
    { t: "ord", w: ["Mikä", "on", "lempielokuvasi"], a: ["Mikä on lempielokuvasi?", "Mikä lempielokuvasi on?"], de: "Was ist dein Lieblingsfilm?" },
    { t: "mc", q: "An der Kinokasse – was sagst du?", o: ["Kaksi lippua, kiitos.", "Kaksi esitystä, kiitos.", "Kiitos viimeisestä!", "Hyvää ruokahalua!"], a: 0 },
    { t: "mc", q: "„Pidän taiteesta.“ – Warum „taiteesta“ und nicht „taidesta“?", o: ["taide folgt dem Muster -e → -ee- mit starker Stufe (taiteen, taiteesta)", "pitää will immer -tee-", "taidesta ist auch richtig", "weil taide ein Fremdwort ist"], a: 0, x: "Wie sade → sateen (21.4): taide → taiteen → taiteesta. Eigenschaften auf -us: kirjallisuus → kirjallisuudesta (21.3)." },
    { t: "mc", q: "Was bedeutet „lempi-“ vor einem Wort?", o: ["Lieblings-: lempiruoka = Lieblingsessen", "sehr: lempiruoka = sehr gutes Essen", "neu", "alt"], a: 0, x: "lempi- bildet zusammengesetzte Wörter: lempiväri, lempielokuva, lempikirjailija." },
    { t: "mc", q: "„Mennäänkö elokuviin?“ bedeutet:", o: ["Gehen wir ins Kino?", "Ich gehe ins Kino.", "Bist du im Kino?", "Warst du im Kino?"], a: 0, x: "Mennään! = Lass uns gehen! (t16). Mit -kö wird daraus ein Vorschlag als Frage. Mehr in t26." },
    { t: "les", q: "Kulttuuriviikko 14.–20.10.", txt: ["Ma klo 19: Konsertti – Sibelius-talo, liput 25 €", "Ke klo 18: Taidenäyttely – ilmainen", "Pe klo 20: Näytelmä „Seitsemän veljestä“ – kaupunginteatteri", "La klo 15: Kirjailija lukee uutta kirjaansa – kirjasto"], qs: [{ q: "Was kostet das Konzert?", o: ["25 €", "nichts", "20 €"], a: 0 }, { q: "Was ist kostenlos?", o: ["die Kunstausstellung", "das Konzert", "das Theaterstück"], a: 0 }, { q: "Wo liest die Schriftstellerin oder der Schriftsteller?", o: ["in der Bibliothek", "im Theater", "im Museum"], a: 0 }] },
    { t: "les", q: "Lempisarja", txt: ["Aino: Katsotko paljon televisiota?", "Matthias: En paljon. Mutta katson netistä yhtä suomalaista sarjaa.", "Aino: Millainen se on?", "Matthias: Se on hauska. Pidän siitä tosi paljon!", "Aino: Minä luen kirjoja. Lempikirjailijani on Tove Jansson."], qs: [{ q: "Wo schaut Matthias die Serie?", o: ["im Internet", "im Kino", "bei Freunden"], a: 0 }, { q: "Wie findet er sie?", o: ["sehr gut und lustig", "langweilig", "zu lang"], a: 0 }, { q: "Wer ist Ainos Lieblingsschriftstellerin?", o: ["Tove Jansson", "Aleksis Kivi", "Jean Sibelius"], a: 0 }] },
    { t: "dlg", q: "Ins Kino", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Mennäänkö elokuviin lauantaina?"], ["Sinä", "[Mielelläni! Mikä elokuva?|Joo, mennään! Mikä elokuva?|Mennään! Mikä elokuva?]", "Sag zu und frag, welcher Film."], ["Aino", "Uusi suomalainen elokuva. Se alkaa kello 19."], ["Sinä", "[Kauanko se kestää?|Kauanko elokuva kestää?]", "Frag, wie lange er dauert."], ["Aino", "Kaksi tuntia."], ["Sinä", "[Hyvä. Ostan liput netistä.|Selvä, ostan liput.|Ostan liput netistä.]", "Sag, dass du die Karten im Internet kaufst."]] },
    { t: "dlg", q: "Was magst du?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Kollega", "Mistä pidät vapaa-aikana?"], ["Sinä", "[Pidän musiikista ja taiteesta.|Pidän taiteesta ja musiikista.]", "Sag: Musik und Kunst."], ["Kollega", "Käytkö usein konsertissa?"], ["Sinä", "[Joskus. Kävin konsertissa viime viikolla.|Joskus, viime viikolla kävin.|Joskus.]", "Sag: manchmal – du warst letzte Woche dort."]] },
    { t: "sch", q: "Lade jemanden ins Konzert ein: mit Tag und Uhrzeit.", w: ["konserttiin"], a: ["Mennäänkö konserttiin perjantaina kello seitsemän?", "Haluatko tulla konserttiin perjantaina kello seitsemän?"], h: "ein Satz, Uhrzeit als Wort" },
    { t: "sch", q: "Schreib, welche zwei Dinge aus Kunst und Kultur du magst.", w: ["pidän"], a: ["Pidän elokuvista ja kirjallisuudesta.", "Pidän musiikista ja taiteesta."], h: "ein Satz mit „pitää + -sta“" }
  ]
};
