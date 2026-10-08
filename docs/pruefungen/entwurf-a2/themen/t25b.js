module.exports = {
  id: "t25b",
  title: "Umtausch & Kundenservice: Se ei toimi! (25.2)",
  fi: "Saanko rahat takaisin?",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t21c", "t23c"],
  th: `<p>Vertiefung zu t25: Etwas ist kaputt, zu klein oder falsch – du tauschst es um, gibst es zurück, rufst den Kundenservice an oder bestellst im Internet.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Haluaisin palauttaa tämän takin.</td><td>Ich möchte diese Jacke zurückgeben.</td></tr>
<tr><td>Se on rikki. / Se ei toimi.</td><td>Es ist kaputt. / Es funktioniert nicht.</td></tr>
<tr><td>Voinko vaihtaa sen isompaan?</td><td>Kann ich sie gegen eine größere umtauschen?</td></tr>
<tr><td>Saanko rahat takaisin?</td><td>Bekomme ich mein Geld zurück?</td></tr>
<tr><td>Onko sinulla kuittia?</td><td>Hast du den Kassenbon?</td></tr>
<tr><td>Tilasin kengät verkkokaupasta.</td><td>Ich habe die Schuhe im Online-Shop bestellt.</td></tr>
<tr><td>Tilaukseni ei ole vielä tullut.</td><td>Meine Bestellung ist noch nicht gekommen.</td></tr>
</table>
<h3>vaihtaa + Wohin-Form</h3>
<p class="rule"><b>vaihtaa</b> + Wohin-Form = gegen etwas tauschen: <i>vaihtaa isompaan (kokoon), vaihtaa pienempään, vaihtaa toiseen väriin</i>. Der Komparativ wird mit <b>-mpa-</b> gebeugt: <i>isompi → isompaan</i>.</p>
<h3>rahat oder rahaa?</h3>
<p class="rule"><i>rahat</i> (Mehrzahl) = das bestimmte Geld, z. B. das man bezahlt hat: <i>Saanko rahat takaisin?</i> <i>rahaa</i> = Geld allgemein: <i>Minulla ei ole rahaa.</i> Bestellen „aus“ einem Laden: <i>verkkokaupasta</i> (-sta); anrufen „in“: <i>soittaa asiakaspalveluun</i>.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Tää on rikki.</i> · <i>Tää ei toimi.</i> · <i>Mä tilasin ne netistä.</i> · Paket = <i>paketti</i> (in Nachrichten der Post oft <i>lähetys</i> = Sendung); der Paketautomat heißt im Alltag oft nur <i>automaatti</i>.</p>
<p class="tip"><b>Kulttuuri:</b> In Finnland bestellt man viel im Internet und holt Pakete an einer Abholstation (<i>noutopiste</i>) im Supermarkt ab. Für Umtausch braucht man fast immer den <i>kuitti</i>.</p>`,
  v: [
    ["palauttaa", "zurückgeben (palautan)"],
    ["rahat takaisin", "Geld zurück"],
    ["vaihtaa isompaan", "gegen ein größeres umtauschen"],
    ["takuu", "Garantie"],
    ["rikki", "kaputt"],
    ["ei toimi", "funktioniert nicht"],
    ["väärä", "falsch"],
    ["tuote", "Produkt, Ware (tuotteen)"],
    ["asiakaspalvelu", "Kundenservice"],
    ["verkkokauppa", "Online-Shop (verkkokaupasta)"],
    ["tilaus", "Bestellung (tilauksen)"],
    ["toimitus", "Lieferung (toimituksen)"],
    ["nouto", "Abholung"],
    ["noutopiste", "Abholstation"],
    ["liian pieni", "zu klein"]
  ],
  ex: [
    { t: "tab", q: "Reklamieren", h: "Jedes Kästchen ein ganzer Satz auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["Ich möchte das zurückgeben.", "[Haluaisin palauttaa tämän.|Haluan palauttaa tämän.|Haluaisin palauttaa sen.|Haluan palauttaa sen.]"], ["Es ist kaputt.", "[Se on rikki.|Tämä on rikki.]"], ["Es funktioniert nicht.", "[Se ei toimi.|Tämä ei toimi.]"], ["Bekomme ich mein Geld zurück?", "[Saanko rahat takaisin?|Saanko rahani takaisin?]"], ["Kann ich es umtauschen?", "[Voinko vaihtaa sen?|Voinko vaihtaa tämän?]"]] },
    { t: "tab", q: "vaihtaa … + Wohin-Form", h: "Jedes Kästchen ein Wort: Wohin-Form (Komparativ mit -mpa-, toinen mit -se-)", head: ["Wort", "vaihtaa …"], r: [["isompi", "[isompaan]"], ["pienempi", "[pienempään]"], ["halvempi", "[halvempaan]"], ["toinen", "[toiseen]"]], s: 1 },
    { t: "gap", q: "Haluaisin ___ tämän takin.", h: "zurückgeben – Grundform", a: ["palauttaa"] },
    { t: "gap", q: "Puhelin ei ___.", h: "toimia verneint: funktioniert nicht", a: ["toimi"] },
    { t: "gap", q: "Onko sinulla ___?", h: "Kassenbon – in der Frage Teilungsform (Grundform geht auch)", a: ["kuittia", "kuitti"] },
    { t: "gap", q: "Saanko rahat ___?", h: "zurück", a: ["takaisin"] },
    { t: "gap", q: "Tilasin kengät ___.", h: "verkkokauppa + -sta: aus dem Online-Shop (Stufenwechsel)", a: ["verkkokaupasta"], s: 1 },
    { t: "gap", q: "Voinko vaihtaa sen ___ kokoon?", h: "isompi in der Wohin-Form (wie „kokoon“)", a: ["isompaan"], s: 1 },
    { t: "gap", q: "Puhelimessa on kahden vuoden ___.", h: "Garantie", a: ["takuu"] },
    { t: "tr", dir: "de", q: "Die Jacke ist zu klein. Kann ich sie umtauschen?", a: ["Takki on liian pieni. Voinko vaihtaa sen", "Takki on liian pieni. Voinko vaihtaa sen isompaan", "Takki on liian pieni. Voinko vaihtaa sen isompaan kokoon", "Tämä takki on liian pieni. Voinko vaihtaa sen"] },
    { t: "tr", dir: "de", q: "Meine Bestellung ist noch nicht gekommen.", a: ["Tilaukseni ei ole vielä tullut", "Minun tilaukseni ei ole vielä tullut", "Tilaus ei ole vielä tullut"] },
    { t: "tr", dir: "de", q: "Das ist die falsche Größe.", a: ["Tämä on väärä koko", "Se on väärä koko"] },
    { t: "tr", dir: "fi", q: "Toimitus kestää kolme päivää.", a: ["Die Lieferung dauert drei Tage"] },
    { t: "tr", dir: "fi", q: "Paketti on noutopisteessä.", a: ["Das Paket ist an der Abholstation", "Das Paket liegt an der Abholstation", "Das Paket ist bei der Abholstation"] },
    { t: "ord", w: ["Haluaisin", "palauttaa", "tämän", "takin"], a: ["Haluaisin palauttaa tämän takin."], de: "Ich möchte diese Jacke zurückgeben." },
    { t: "ord", w: ["Soitin", "asiakaspalveluun", "eilen"], a: ["Soitin asiakaspalveluun eilen.", "Eilen soitin asiakaspalveluun."], de: "Ich habe gestern den Kundenservice angerufen." },
    { t: "mc", q: "Dein Handy ist kaputt. Was sagst du im Geschäft?", o: ["Puhelin on rikki. Onko puhelimessa takuu?", "Puhelin on kaikkein paras.", "Haluaisin tilata puhelimen.", "Kiitos viimeisestä!"], a: 0 },
    { t: "mc", q: "Was fragt die Verkäuferin beim Umtausch meistens zuerst?", o: ["Onko sinulla kuittia?", "Mikä on lempielokuvasi?", "Mennäänkö elokuviin?", "Oletko käynyt Lapissa?"], a: 0 },
    { t: "mc", q: "„vaihtaa isompaan“ – warum die Endung -an?", o: ["vaihtaa will die Wohin-Form: gegen etwas tauschen", "Das ist der Superlativ.", "-an heißt „mit“.", "Das ist die Mehrzahl."], a: 0, x: "vaihtaa + Wohin-Form: vaihtaa isompaan, vaihtaa toiseen väriin. Der Komparativ wird mit -mpa- gebeugt: isompaan." },
    { t: "mc", q: "„Saanko rahat takaisin?“ – warum „rahat“ in der Mehrzahl?", o: ["rahat = das bestimmte Geld (das man bezahlt hat)", "Weil es viele Münzen sind", "Das ist ein Fehler.", "Weil es eine Frage ist."], a: 0, x: "Bestimmtes Geld: rahat (Annan rahat takaisin). Geld allgemein: rahaa (Minulla ei ole rahaa)." },
    { t: "les", q: "Puhelin ei toimi", txt: ["Asiakas: Hei! Ostin tämän puhelimen viime viikolla, mutta se ei toimi.", "Myyjä: Voi harmi. Onko sinulla kuittia?", "Asiakas: On, tässä.", "Myyjä: Puhelimessa on takuu. Haluatko uuden puhelimen vai rahat takaisin?", "Asiakas: Uuden puhelimen, kiitos."], qs: [{ q: "Wann wurde das Telefon gekauft?", o: ["letzte Woche", "gestern", "vor einem Jahr"], a: 0 }, { q: "Was ist das Problem?", o: ["Es funktioniert nicht.", "Es ist zu teuer.", "Es hat die falsche Farbe."], a: 0 }, { q: "Was möchte der Kunde?", o: ["ein neues Telefon", "das Geld zurück", "einen Rabatt"], a: 0 }] },
    { t: "les", q: "Kiitos tilauksesta!", txt: ["Kiitos tilauksesta!", "Tilausnumero: 4711", "Toimitus kestää 2–4 päivää.", "Saat viestin, kun paketti on noutopisteessä.", "Voit palauttaa tuotteen 30 päivän aikana."], qs: [{ q: "Wie lange dauert die Lieferung?", o: ["2–4 Tage", "30 Tage", "einen Tag"], a: 0 }, { q: "Wann bekommt man eine Nachricht?", o: ["wenn das Paket an der Abholstation ist", "sofort", "nie"], a: 0 }, { q: "Wie lange kann man das Produkt zurückgeben?", o: ["30 Tage", "4 Tage", "gar nicht"], a: 0 }] },
    { t: "dlg", q: "Umtauschen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Myyjä", "Hei! Miten voin auttaa?"], ["Sinä", "[Tämä takki on liian pieni.|Takki on liian pieni.|Ostin tämän takin, mutta se on liian pieni.]", "Sag: Die Jacke ist zu klein."], ["Myyjä", "Haluatko vaihtaa sen isompaan?"], ["Sinä", "[Kyllä, kiitos.|Kyllä, isompaan, kiitos.|Haluan vaihtaa sen isompaan.]", "Sag ja."], ["Myyjä", "Onko sinulla kuittia?"], ["Sinä", "[On, tässä.|Kyllä, tässä se on.|On.]", "Sag ja und gib ihn ihr."]] },
    { t: "dlg", q: "Anruf beim Kundenservice", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Asiakaspalvelu", "Asiakaspalvelu, hei!"], ["Sinä", "[Hei! Tilaukseni ei ole vielä tullut.|Hei, tilaus ei ole vielä tullut.|Hei! Minun tilaukseni ei ole vielä tullut.]", "Sag: Deine Bestellung ist noch nicht gekommen."], ["Asiakaspalvelu", "Mikä on tilausnumero?"], ["Sinä", "[Se on 4711.|4711.|Tilausnumero on 4711.]", "Nenn die Nummer 4711."], ["Asiakaspalvelu", "Paketti on noutopisteessä. Saat viestin tänään."], ["Sinä", "[Kiitos paljon!|Hyvä, kiitos!|Kiitos!]", "Bedanke dich."]] },
    { t: "sch", q: "Schreib dem Online-Shop: Die Schuhe sind zu klein, du willst sie zurückgeben.", w: ["palauttaa"], a: ["Hei! Kengät ovat liian pienet. Haluaisin palauttaa ne.", "Kengät ovat liian pienet ja haluan palauttaa ne."], h: "ein oder zwei Sätze" },
    { t: "sch", q: "Schreib, dass das Gerät nicht funktioniert und du dein Geld zurück möchtest.", w: ["ei toimi", "rahat"], a: ["Puhelin ei toimi. Haluaisin rahat takaisin.", "Tämä ei toimi. Saanko rahat takaisin?"], h: "zwei kurze Sätze" }
  ]
};
