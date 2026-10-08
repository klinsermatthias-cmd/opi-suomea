module.exports = {
  id: "t27b",
  title: "Bank & Post: Konto, Rechnung, Paket (27.2)",
  fi: "Maksan laskun verkkopankissa",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t21c", "t23c"],
  th: `<p>Vertiefung zu t27: einfache Bank- und Postgeschäfte – ein Konto eröffnen, eine Rechnung bezahlen, einen Brief schicken, ein Paket abholen.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Haluaisin avata tilin.</td><td>Ich möchte ein Konto eröffnen.</td></tr>
<tr><td>Maksan laskun verkkopankissa.</td><td>Ich zahle die Rechnung im Online-Banking.</td></tr>
<tr><td>Lasku pitää maksaa eräpäivään mennessä.</td><td>Die Rechnung muss bis zum Fälligkeitstag bezahlt werden.</td></tr>
<tr><td>Voinko maksaa käteisellä?</td><td>Kann ich bar zahlen?</td></tr>
<tr><td>Haluaisin lähettää kirjeen Itävaltaan.</td><td>Ich möchte einen Brief nach Österreich schicken.</td></tr>
<tr><td>Noudan paketin pakettiautomaatista.</td><td>Ich hole das Paket am Paketautomaten ab.</td></tr>
<tr><td>Tunnistaudu pankkitunnuksilla.</td><td>Identifiziere dich mit deinen Bankzugangsdaten.</td></tr>
</table>
<h3>Womit? -lla / -llä</h3>
<p class="rule">Das Mittel steht mit <b>-lla/-llä</b>: <i>käteisellä</i> (bar), <i>kortilla</i> (mit Karte), <i>puhelimella</i> (mit dem Handy), <i>pankkitunnuksilla</i> (mit den Bankzugangsdaten). Wo: <i>verkkopankissa</i>, <i>pankissa</i>, <i>postissa</i>.</p>
<h3>Verben mit Stufenwechsel</h3>
<table><tr><td>Verb</td><td>minä</td><td>hän</td></tr>
<tr><td>noutaa (abholen)</td><td>noudan</td><td>noutaa</td></tr>
<tr><td>siirtää (überweisen)</td><td>siirrän</td><td>siirtää</td></tr>
<tr><td>tunnistautua (sich identifizieren)</td><td>tunnistaudun</td><td>tunnistautuu</td></tr></table>
<p class="rule"><i>noutaa</i> und <i>hakea</i> heißen beide „abholen“; <i>noutaa</i> liest man vor allem bei Post und Paketen. <i>tunnistautua</i> geht wie <i>ilmoittautua</i> (20.4): t → d.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mä maksan sen netissä.</i> · <i>Käteistä vai korttia?</i> (Bar oder Karte?) · <i>Mun paketti on automaatissa.</i></p>
<p class="tip"><b>Kulttuuri:</b> In Finnland zahlt man fast überall mit Karte oder Handy. Mit den <i>pankkitunnukset</i> (Online-Banking-Zugang) meldet man sich auch bei Ämtern und Kela an (<i>vahva tunnistautuminen</i>). Rechnungen haben eine <i>viitenumero</i> (Referenznummer) und einen <i>eräpäivä</i>.</p>`,
  v: [
    ["tili", "Konto (tilille, tililtä)"],
    ["pankkikortti", "Bankkarte"],
    ["käteinen", "Bargeld (käteisellä = bar)"],
    ["verkkopankki", "Online-Banking"],
    ["pankkitunnukset", "Online-Banking-Zugangsdaten"],
    ["tunnistautua", "sich identifizieren, sich anmelden (tunnistaudun)"],
    ["maksaa lasku", "eine Rechnung bezahlen (maksan laskun)"],
    ["eräpäivä", "Fälligkeitstag"],
    ["viitenumero", "Referenznummer"],
    ["siirtää rahaa", "Geld überweisen (siirrän)"],
    ["vakuutus", "Versicherung (vakuutuksen)"],
    ["postimerkki", "Briefmarke"],
    ["kirjekuori", "Briefumschlag"],
    ["noutaa", "abholen (noudan)"],
    ["pakettiautomaatti", "Paketautomat"],
    ["seurantakoodi", "Sendungsnummer"]
  ],
  ex: [
    { t: "tab", q: "noutaa und tunnistautua", h: "Jedes Kästchen eine eigene Form: links noutaa, rechts tunnistautua (beide t → d) – z. B. minä | noudan | tunnistaudun", head: ["Person", "noutaa", "tunnistautua"], r: [["minä", "[noudan]", "[tunnistaudun]"], ["sinä", "[noudat]", "[tunnistaudut]"], ["hän", "[noutaa]", "[tunnistautuu]"], ["me", "[noudamme]", "[tunnistaudumme]"]], s: 1 },
    { t: "tab", q: "Wie zahlst du?", h: "Jedes Kästchen ein Wort: womit (-lla/-llä) oder wo (-ssa)", head: ["Deutsch", "Suomeksi"], r: [["bar", "[käteisellä]"], ["mit Karte", "[kortilla]"], ["mit dem Handy", "[puhelimella]"], ["im Online-Banking", "[verkkopankissa]"]], s: 1 },
    { t: "gap", q: "Maksan laskun ___.", h: "verkkopankki + -ssa (Stufenwechsel)", a: ["verkkopankissa"], s: 1 },
    { t: "gap", q: "Haluaisin ___ tilin.", h: "eröffnen – Grundform", a: ["avata"] },
    { t: "gap", q: "Voinko maksaa ___?", h: "käteinen + -llä: bar", a: ["käteisellä"], s: 1 },
    { t: "gap", q: "Lasku pitää maksaa ___ mennessä.", h: "eräpäivä in der Wohin-Form", a: ["eräpäivään"], s: 1 },
    { t: "gap", q: "Minä ___ paketin pakettiautomaatista.", h: "noutaa – Form für „minä“ (t → d)", a: ["noudan"], s: 1 },
    { t: "gap", q: "Tarvitsen ___ kirjeeseen.", h: "postimerkki als Objekt (-n, Stufenwechsel)", a: ["postimerkin"], s: 1 },
    { t: "gap", q: "___ rahaa tililleni.", h: "siirtää – Form für „minä“ (rt → rr)", a: ["Siirrän"], s: 1 },
    { t: "tr", dir: "de", q: "Ich möchte einen Brief nach Österreich schicken.", a: ["Haluaisin lähettää kirjeen Itävaltaan", "Haluan lähettää kirjeen Itävaltaan"] },
    { t: "tr", dir: "de", q: "Kann ich mit Karte zahlen?", a: ["Voinko maksaa kortilla", "Voiko maksaa kortilla", "Saanko maksaa kortilla"] },
    { t: "tr", dir: "de", q: "Ich brauche eine Versicherung.", a: ["Tarvitsen vakuutuksen", "Minä tarvitsen vakuutuksen"] },
    { t: "tr", dir: "fi", q: "Seurantakoodi on viestissä.", a: ["Die Sendungsnummer ist in der Nachricht", "Die Sendungsnummer steht in der Nachricht"] },
    { t: "tr", dir: "fi", q: "Tunnistaudu pankkitunnuksilla.", a: ["Identifiziere dich mit deinen Bankzugangsdaten", "Melde dich mit deinen Online-Banking-Daten an", "Identifiziere dich mit den Bankzugangsdaten"] },
    { t: "ord", w: ["Maksoin", "laskun", "verkkopankissa"], a: ["Maksoin laskun verkkopankissa.", "Verkkopankissa maksoin laskun."], de: "Ich habe die Rechnung im Online-Banking bezahlt." },
    { t: "ord", w: ["Paketti", "on", "pakettiautomaatissa"], a: ["Paketti on pakettiautomaatissa."], de: "Das Paket ist im Paketautomaten." },
    { t: "mc", q: "Was brauchst du, um eine finnische Rechnung zu bezahlen?", o: ["Viitenumero und eräpäivä", "Postimerkki und kirjekuori", "Nur den Seurantakoodi", "Einen Sovituskoppi"], a: 0 },
    { t: "mc", q: "„maksaa käteisellä“ – was bedeutet -llä hier?", o: ["womit: mit Bargeld", "wo: auf dem Bargeld", "wann", "an wen"], a: 0, x: "-lla/-llä = womit (Mittel): käteisellä, kortilla, puhelimella, bussilla." },
    { t: "mc", q: "„noutaa“ und „hakea“ – was stimmt?", o: ["Beide heißen „abholen“; noutaa liest man vor allem bei Post und Paketen.", "noutaa heißt „suchen“.", "hakea heißt nur „sich bewerben“.", "noutaa heißt „schicken“."], a: 0, x: "hakea: holen, abholen, suchen, sich bewerben (20.2). noutaa: abholen – Nouda paketti!" },
    { t: "mc", q: "Wie heißt „tunnistautua“ bei „minä“?", o: ["tunnistaudun", "tunnistautun", "tunnistauden", "tunnistan"], a: 0, x: "Wie ilmoittautua → ilmoittaudun (20.4): -utua-Verben haben in der schwachen Form t → d." },
    { t: "les", q: "Lasku", txt: ["LASKU", "Saaja: Virta Oy", "Summa: 54,20 €", "Eräpäivä: 30.11.", "Viitenumero: 12345 67890", "Maksa lasku verkkopankissa eräpäivään mennessä."], qs: [{ q: "Wie viel muss man zahlen?", o: ["54,20 €", "30,11 €", "12 €"], a: 0 }, { q: "Bis wann?", o: ["bis zum 30.11.", "sofort", "bis Jahresende"], a: 0 }, { q: "Wo soll man zahlen?", o: ["im Online-Banking", "am Schalter", "bar beim Postboten"], a: 0 }] },
    { t: "les", q: "Paketti on tullut", txt: ["Pakettisi on pakettiautomaatissa.", "Seurantakoodi: JJFI123456", "Nouda paketti 7 päivän aikana.", "Tarvitset koodin: 4821."], qs: [{ q: "Wo ist das Paket?", o: ["im Paketautomaten", "beim Nachbarn", "zu Hause"], a: 0 }, { q: "Wie lange hat man Zeit?", o: ["7 Tage", "einen Tag", "einen Monat"], a: 0 }, { q: "Was braucht man zum Abholen?", o: ["einen Code", "den Reisepass", "Bargeld"], a: 0 }] },
    { t: "dlg", q: "In der Bank", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Virkailija", "Hyvää päivää! Miten voin auttaa?"], ["Sinä", "[Haluaisin avata tilin.|Hyvää päivää! Haluaisin avata tilin.]", "Sag, dass du ein Konto eröffnen möchtest."], ["Virkailija", "Onko teillä henkilöllisyystodistus?"], ["Sinä", "[On, tässä on passi.|Kyllä, tässä on passi.|On. Tässä.]", "Sag ja – hier ist der Pass."], ["Virkailija", "Kiitos. Saatte pankkikortin postissa."], ["Sinä", "[Kiitos! Entä pankkitunnukset?|Kiitos. Milloin saan pankkitunnukset?]", "Bedanke dich und frag nach den Zugangsdaten fürs Online-Banking."]] },
    { t: "dlg", q: "Auf der Post", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Virkailija", "Seuraava!"], ["Sinä", "[Hei! Haluaisin lähettää tämän kirjeen Itävaltaan.|Hei, haluaisin lähettää kirjeen Itävaltaan.]", "Sag, dass du den Brief nach Österreich schicken möchtest."], ["Virkailija", "Se maksaa kaksi euroa."], ["Sinä", "[Voinko maksaa kortilla?|Saanko maksaa kortilla?|Voiko maksaa kortilla?]", "Frag, ob du mit Karte zahlen kannst."], ["Virkailija", "Totta kai."]] },
    { t: "sch", q: "Schreib, wie und bis wann du deine Rechnungen bezahlst.", w: ["maksan", "verkkopankissa"], a: ["Maksan laskut verkkopankissa eräpäivään mennessä.", "Maksan laskun verkkopankissa eräpäivään mennessä."], h: "ein Satz" },
    { t: "sch", q: "Schreib, dass du morgen ein Paket am Automaten abholst.", w: ["noudan"], a: ["Huomenna noudan paketin pakettiautomaatista.", "Noudan paketin huomenna pakettiautomaatista."], h: "ein Satz" }
  ]
};
