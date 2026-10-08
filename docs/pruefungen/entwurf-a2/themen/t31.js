module.exports = {
  id: "t31",
  title: "Reisen & Unterkunft (3. Infinitiv: uimaan, uimassa, uimasta)",
  fi: "Menen uimaan",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t29b"],
  th: `<p>Situation: Eine Reise planen und machen – Flug, Gepäck, Unterkunft, Sehenswürdigkeiten – und sagen, <b>wohin du wozu gehst</b> und <b>was du gerade tust</b>. Dafür lernst du den <b>3. Infinitiv</b>: <i>Menen uimaan. Olen uimassa. Tulen uimasta.</i></p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Lähdemme lomamatkalle ensi viikolla.</td><td>Wir fahren nächste Woche in den Urlaub.</td></tr>
<tr><td>Lähtöselvitys on kaksi tuntia ennen lentoa.</td><td>Der Check-in ist zwei Stunden vor dem Flug.</td></tr>
<tr><td>Menen katsomaan nähtävyyksiä.</td><td>Ich gehe Sehenswürdigkeiten anschauen.</td></tr>
<tr><td>Olen syömässä. Soitan myöhemmin.</td><td>Ich bin gerade beim Essen. Ich rufe später an.</td></tr>
<tr><td>Kävin uimassa.</td><td>Ich war schwimmen.</td></tr>
<tr><td>Tulen juuri ostamasta lippuja.</td><td>Ich komme gerade vom Kartenkaufen.</td></tr>
<tr><td>Alkaa sataa.</td><td>Es fängt an zu regnen.</td></tr>
</table>
<h3>3. Infinitiv: -maan, -massa, -masta</h3>
<table><tr><td>Form</td><td>Bedeutung</td><td>Beispiel</td></tr>
<tr><td>-maan / -mään</td><td>wohin, wozu</td><td>Menen uimaan. Lähden syömään.</td></tr>
<tr><td>-massa / -mässä</td><td>wo, gerade dabei</td><td>Olen uimassa. Kävin syömässä.</td></tr>
<tr><td>-masta / -mästä</td><td>woher</td><td>Tulen uimasta.</td></tr></table>
<p class="rule"><b>Bildung:</b> Stamm der <i>hän</i>-Form (starke Stufe) ohne Endung + <b>-ma-</b> + Fall: <i>hän ui → uimaan, hän syö → syömään, hän lukee → lukemaan, hän tekee → tekemään, hän tapaa → tapaamaan, hän ostaa → ostamaan</i>.</p>
<p class="rule"><b>Wann?</b> Nach Bewegungsverben (<i>mennä, tulla, lähteä</i>) + <b>-maan</b>. <i>olla</i> + <b>-massa</b> = gerade dabei sein. <i>käydä</i> + <b>-massa</b> = kurz hingehen und etwas tun (<i>kävin uimassa</i>). Aber: <i>alkaa</i> + <b>Grundform</b>: <i>alkaa sataa</i>.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mä meen uimaan.</i> (= Menen uimaan.) · <i>Mä oon syömässä.</i> · Gesprochen auch <i>alkaa tekemään</i> statt <i>alkaa tehdä</i> – laut Kielitoimisto in der Umgangssprache zulässig, geschrieben besser <i>alkaa tehdä</i>.</p>
<p class="tip"><b>Kulttuuri:</b> Zum Flughafen Helsinki-Vantaa fährt ein Zug aus der Innenstadt (rund 30 Minuten). Innerhalb des Schengen-Raums gibt es meist keine <i>rajatarkastus</i>, einen Ausweis braucht man trotzdem.</p>`,
  v: [
    ["lomamatka", "Urlaubsreise"],
    ["matkailija", "Tourist/in"],
    ["matkustaja", "Reisende/r, Passagier/in"],
    ["matkatoimisto", "Reisebüro"],
    ["varaus", "Reservierung, Buchung (varauksen)"],
    ["majoitus", "Unterkunft (majoituksen)"],
    ["matkalaukku", "Koffer"],
    ["lento", "Flug (lennon)"],
    ["lentolippu", "Flugticket"],
    ["lähtöselvitys", "Check-in (am Flughafen)"],
    ["turvatarkastus", "Sicherheitskontrolle"],
    ["rajatarkastus", "Grenzkontrolle"],
    ["myöhästyä", "sich verspäten; verpassen (myöhästyn)"],
    ["nähtävyys", "Sehenswürdigkeit (nähtävyyksiä)"],
    ["kartta", "Landkarte, Stadtplan"],
    ["juuri", "gerade, eben (tulen juuri …)"],
    ["retkeily", "Wandern, Outdoor"],
    ["menen uimaan", "ich gehe schwimmen"],
    ["olen syömässä", "ich bin gerade beim Essen"],
    ["kävin uimassa", "ich war schwimmen"],
    ["alkaa sataa", "es fängt an zu regnen"]
  ],
  ex: [
    { t: "tab", q: "3. Infinitiv: wohin, wo, woher", h: "Jedes Kästchen ein Wort: Stamm der hän-Form + -maan / -massa / -masta – z. B. uida | uimaan | uimassa | uimasta", head: ["Grundform", "-maan", "-massa", "-masta"], r: [["uida", "[uimaan]", "[uimassa]", "[uimasta]"], ["syödä", "[syömään]", "[syömässä]", "[syömästä]"], ["lukea", "[lukemaan]", "[lukemassa]", "[lukemasta]"]], s: 1 },
    { t: "tab", q: "Wozu? -maan", h: "Jedes Kästchen ein Wort: Form auf -maan/-mään (starke Stufe)", head: ["Grundform", "menen …"], r: [["katsoa", "[katsomaan]"], ["tehdä", "[tekemään]"], ["ostaa", "[ostamaan]"], ["tavata", "[tapaamaan]"], ["nukkua", "[nukkumaan]"]], s: 1 },
    { t: "gap", q: "Menen ___ järvelle.", h: "uida – wozu: -maan", a: ["uimaan"], s: 1 },
    { t: "gap", q: "Olen ___. Soitan myöhemmin.", h: "syödä – gerade dabei: -mässä", a: ["syömässä"], s: 1 },
    { t: "gap", q: "Kävin eilen ___ elokuvan.", h: "katsoa – kurz hingehen und …: -massa", a: ["katsomassa"], s: 1 },
    { t: "gap", q: "Tulen juuri ___.", h: "uida – woher: -masta", a: ["uimasta"], s: 1 },
    { t: "gap", q: "Lähden ___ ystävää.", h: "tavata – wozu (starke Stufe: tapaa-)", a: ["tapaamaan"], s: 1 },
    { t: "gap", q: "Alkaa ___.", h: "Nach alkaa die Grundform: regnen", a: ["sataa"] },
    { t: "gap", q: "En halua ___ lennosta.", h: "myöhästyä – Grundform: verpassen", a: ["myöhästyä"] },
    { t: "tr", dir: "de", q: "Ich gehe heute Abend essen.", a: ["Menen illalla syömään", "Menen tänä iltana syömään", "Tänä iltana menen syömään", "Illalla menen syömään"] },
    { t: "tr", dir: "de", q: "Wir sind gerade beim Einkaufen.", a: ["Olemme ostamassa ruokaa", "Olemme kaupassa", "Me olemme ostoksilla", "Olemme ostoksilla"] },
    { t: "tr", dir: "de", q: "Wo ist mein Koffer?", a: ["Missä matkalaukkuni on", "Missä on matkalaukkuni", "Missä minun matkalaukkuni on"] },
    { t: "tr", dir: "fi", q: "Lähtöselvitys alkaa kaksi tuntia ennen lentoa.", a: ["Der Check-in beginnt zwei Stunden vor dem Flug", "Das Einchecken beginnt zwei Stunden vor dem Flug"] },
    { t: "tr", dir: "fi", q: "Matkailijat menevät katsomaan nähtävyyksiä.", a: ["Die Touristen gehen Sehenswürdigkeiten anschauen", "Die Touristen gehen die Sehenswürdigkeiten ansehen"] },
    { t: "ord", w: ["Kävin", "eilen", "uimassa", "järvessä"], a: ["Kävin eilen uimassa järvessä.", "Eilen kävin uimassa järvessä.", "Kävin uimassa järvessä eilen."], de: "Ich war gestern im See schwimmen." },
    { t: "ord", w: ["Alkaa", "sataa", "mennään", "sisään"], a: ["Alkaa sataa, mennään sisään.", "Mennään sisään, alkaa sataa."], de: "Es fängt an zu regnen, gehen wir hinein." },
    { t: "mc", q: "Du willst sagen: „Ich gehe schwimmen.“ Was passt?", o: ["Menen uimaan.", "Menen uida.", "Menen uimassa.", "Menen uimasta."], a: 0 },
    { t: "mc", q: "Wie bildet man den 3. Infinitiv?", o: ["Stamm der hän-Form + -ma- + Fall: lukee → lukemaan", "Grundform + -maan: lukeamaan", "minä-Form + -maan: luenmaan", "Stamm der minä-Form: luemaan"], a: 0, x: "Starke Stufe wie bei hän: lukee → lukemaan, tekee → tekemään, tapaa → tapaamaan." },
    { t: "mc", q: "„Olen syömässä.“ bedeutet:", o: ["Ich bin gerade beim Essen.", "Ich gehe essen.", "Ich komme vom Essen.", "Ich habe gegessen."], a: 0, x: "olla + -massa = gerade dabei sein. Wohin/wozu: -maan. Woher: -masta." },
    { t: "mc", q: "„Alkaa ___.“ (Es fängt an zu regnen) – welche Form?", o: ["sataa (Grundform)", "satamaan", "satamassa", "sateessa"], a: 0, x: "alkaa + Grundform: alkaa sataa, alkaa tehdä. Gesprochen hört man auch alkaa tekemään." },
    { t: "les", q: "Lomamatka Roomaan", txt: ["Lähdimme lomamatkalle Roomaan.", "Lentokentällä lähtöselvitys ja turvatarkastus menivät nopeasti.", "Hotellissa meillä oli varaus kolmeksi yöksi.", "Päivällä kävimme katsomassa nähtävyyksiä.", "Illalla menimme syömään pieneen ravintolaan."], qs: [{ q: "Wie war es am Flughafen?", o: ["Es ging schnell.", "Sie haben den Flug verpasst.", "Der Koffer war weg."], a: 0 }, { q: "Für wie lange hatten sie das Hotel gebucht?", o: ["drei Nächte", "eine Woche", "eine Nacht"], a: 0 }, { q: "Was machten sie am Abend?", o: ["Sie gingen essen.", "Sie gingen schwimmen.", "Sie schliefen."], a: 0 }] },
    { t: "les", q: "Myöhästyminen", txt: ["Juna oli myöhässä, ja Matthias myöhästyi lennosta.", "Hän meni matkatoimistoon kysymään uutta lentoa.", "Seuraava lento lähti vasta illalla.", "Hän kävi syömässä ja lukemassa lentokentällä."], qs: [{ q: "Warum hat Matthias den Flug verpasst?", o: ["Der Zug hatte Verspätung.", "Er hat verschlafen.", "Er hatte keinen Pass."], a: 0 }, { q: "Wozu ging er ins Reisebüro?", o: ["um nach einem neuen Flug zu fragen", "um zu essen", "um ein Hotel zu buchen"], a: 0 }, { q: "Was machte er am Flughafen?", o: ["essen und lesen", "schlafen", "einkaufen"], a: 0 }] },
    { t: "dlg", q: "Am Telefon: Was machst du gerade?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Hei! Mitä teet?"], ["Sinä", "[Olen syömässä.|Olen juuri syömässä.|Syön.]", "Sag: Du bist gerade beim Essen."], ["Aino", "Lähdetkö illalla uimaan?"], ["Sinä", "[Lähden mielelläni!|Joo, lähden uimaan!|Lähden!]", "Sag zu."], ["Aino", "Hyvä! Mennään uimahalliin kello kuusi."], ["Sinä", "[Selvä, nähdään!|Sopii, nähdään!]", "Sag „klar, bis dann“."]] },
    { t: "dlg", q: "Im Reisebüro", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Virkailija", "Hei! Miten voin auttaa?"], ["Sinä", "[Haluaisin varata lomamatkan Lappiin.|Haluaisin matkustaa Lappiin.]", "Sag, dass du eine Urlaubsreise nach Lappland buchen möchtest."], ["Virkailija", "Mitä haluatte tehdä siellä?"], ["Sinä", "[Haluan käydä hiihtämässä.|Haluan mennä hiihtämään.|Hiihtää ja katsoa revontulia.]", "Sag: Ski fahren (gehen)."], ["Virkailija", "Hyvä. Tarvitsetteko majoituksen?"], ["Sinä", "[Kyllä, kiitos.|Kyllä, hotellin kiitos.|Kyllä.]", "Sag ja."]] },
    { t: "sch", q: "Schreib, wohin du am Wochenende wozu gehst (-maan).", w: ["menen"], a: ["Lauantaina menen uimaan ja sunnuntaina menen syömään.", "Viikonloppuna menen katsomaan elokuvaa."], h: "ein Satz mit mennä + -maan" },
    { t: "sch", q: "Schreib, was du gestern kurz gemacht hast (käydä + -massa).", w: ["kävin"], a: ["Eilen kävin uimassa.", "Kävin eilen syömässä ravintolassa."], h: "ein Satz mit kävin + -massa" }
  ]
};
