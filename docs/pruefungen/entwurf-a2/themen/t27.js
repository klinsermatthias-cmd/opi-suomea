module.exports = {
  id: "t27",
  title: "Behörden, Termine & höfliche Bitten (Konditional)",
  fi: "Voisitteko auttaa?",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t25b", "t21d"],
  th: `<p>Situation: Auf dem Amt, auf der Post – Wartenummer ziehen, ein Formular ausfüllen, einen Termin vereinbaren, höflich um Hilfe bitten. Dafür lernst du den <b>Konditional</b> zum höflichen Bitten (<i>voisitteko, olisiko</i>) und die höfliche Anrede mit <b>te</b>.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Voisitteko auttaa?</td><td>Könnten Sie (mir) helfen?</td></tr>
<tr><td>Haluaisin varata ajan.</td><td>Ich möchte einen Termin vereinbaren.</td></tr>
<tr><td>Olisiko teillä aikaa huomenna?</td><td>Hätten Sie morgen Zeit?</td></tr>
<tr><td>Ota vuoronumero ja odota.</td><td>Nimm eine Wartenummer und warte.</td></tr>
<tr><td>Täyttäkää tämä lomake.</td><td>Füllen Sie dieses Formular aus.</td></tr>
<tr><td>Allekirjoitus tähän, olkaa hyvä.</td><td>Unterschrift bitte hierher.</td></tr>
<tr><td>Saisinko henkilöllisyystodistuksen?</td><td>Könnte ich Ihren Ausweis haben?</td></tr>
</table>
<h3>Konditional: -isi-</h3>
<p>Den Konditional kennst du schon aus <i>haluaisin, saisinko, ottaisin</i>. Er entsteht mit <b>-isi-</b> zwischen Stamm und Personalendung.</p>
<table><tr><td>Person</td><td>voida</td><td>olla</td></tr>
<tr><td>minä</td><td>voisin</td><td>olisin</td></tr>
<tr><td>sinä</td><td>voisit</td><td>olisit</td></tr>
<tr><td>hän</td><td>voisi</td><td>olisi</td></tr>
<tr><td>me</td><td>voisimme</td><td>olisimme</td></tr>
<tr><td>te</td><td>voisitte</td><td>olisitte</td></tr>
<tr><td>he</td><td>voisivat</td><td>olisivat</td></tr></table>
<p class="rule"><b>Höflich bitten:</b> <i>Voisitko …?</i> (Könntest du …?), <i>Voisitteko …?</i> (Könnten Sie …?), <i>Olisiko …?</i> (Gäbe es / Hätten Sie …?), <i>Haluaisin …</i> (Ich möchte …). Alle Verbtypen im Konditional übst du in 27.3.</p>
<p class="rule"><b>te als Sie-Form:</b> In Ämtern, in Briefen und mit älteren Menschen spricht man oft mit <i>te</i>: <i>Voisitteko …? Mitä te haluaisitte? Olkaa hyvä!</i> Sonst duzt man in Finnland fast immer.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Voisitsä auttaa?</i> (= Voisitko sinä auttaa?) · <i>Ois kiva, jos …</i> (= Olisi kiva, jos … – Es wäre schön, wenn …) · Am Schalter ruft man: <i>Seuraava!</i> (Der/die Nächste!)</p>
<p class="tip"><b>Kulttuuri:</b> Für Wohnsitz und Personendaten ist die <i>Digi- ja väestötietovirasto</i> (DVV, früher <i>maistraatti</i>) zuständig. Die <i>henkilötunnus</i> (Personenkennzahl: Geburtsdatum, Trennzeichen und vier Zeichen) braucht man für fast alles. Viele Ämter arbeiten nur mit Termin (<i>ajanvaraus</i>).</p>`,
  v: [
    ["virasto", "Amt, Behörde"],
    ["virkailija", "Sachbearbeiter/in, Beamter/Beamtin"],
    ["ajanvaraus", "Terminvereinbarung, Termin"],
    ["jonottaa", "anstehen, Schlange stehen (jonotan)"],
    ["vuoronumero", "Wartenummer"],
    ["avoinna", "geöffnet"],
    ["suljettu", "geschlossen"],
    ["täyttää", "ausfüllen; füllen (täytän)"],
    ["allekirjoitus", "Unterschrift"],
    ["henkilöllisyystodistus", "Ausweis"],
    ["henkilökortti", "Personalausweis"],
    ["passi", "Reisepass"],
    ["henkilötunnus", "Personenkennzahl"],
    ["syntymäaika", "Geburtsdatum (syntymäajan)"],
    ["kansalaisuus", "Staatsangehörigkeit (kansalaisuuden)"],
    ["hakemus", "Antrag (hakemuksen)"],
    ["todistus", "Bescheinigung, Zeugnis (todistuksen)"],
    ["asiakirja", "Dokument"],
    ["voisitko?", "könntest du?"],
    ["voisitteko?", "könnten Sie? könntet ihr?"],
    ["olisiko?", "wäre …? gäbe es …? hätten Sie …?"]
  ],
  ex: [
    { t: "tab", q: "Konditional von voida und olla", h: "Jedes Kästchen eine eigene Form: links voida, rechts olla – z. B. minä | voisin | olisin", head: ["Person", "voida", "olla"], r: [["minä", "[voisin]", "[olisin]"], ["sinä", "[voisit]", "[olisit]"], ["hän", "[voisi]", "[olisi]"], ["me", "[voisimme]", "[olisimme]"], ["te", "[voisitte]", "[olisitte]"], ["he", "[voisivat]", "[olisivat]"]], s: 1 },
    { t: "tab", q: "Höflich bitten", h: "Jedes Kästchen ein ganzer Satz auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["Könnten Sie mir helfen?", "[Voisitteko auttaa?|Voisitteko auttaa minua?]"], ["Könntest du das wiederholen?", "[Voisitko toistaa?|Voisitko toistaa sen?]"], ["Ich möchte einen Termin vereinbaren.", "[Haluaisin varata ajan.]"], ["Hätten Sie morgen Zeit?", "[Olisiko teillä aikaa huomenna?|Olisiko teillä huomenna aikaa?]"]] },
    { t: "gap", q: "___ auttaa minua?", h: "voida im Konditional – höflich an „te“ (Sie)", a: ["Voisitteko"], s: 1 },
    { t: "gap", q: "Pitää ___ tämä lomake.", h: "ausfüllen – Grundform", a: ["täyttää"] },
    { t: "gap", q: "Virasto on ___ kello 9–16.", h: "geöffnet", a: ["avoinna", "auki"] },
    { t: "gap", q: "Lauantaina virasto on ___.", h: "geschlossen", a: ["suljettu", "kiinni"] },
    { t: "gap", q: "Ota ___ ja odota.", h: "Wartenummer", a: ["vuoronumero"] },
    { t: "gap", q: "___ teillä aikaa huomenna?", h: "olla im Konditional + -ko: Hätten (Sie) …?", a: ["Olisiko"] },
    { t: "gap", q: "___ tähän, olkaa hyvä.", h: "Unterschrift", a: ["Allekirjoitus"] },
    { t: "tr", dir: "de", q: "Könnten Sie mir helfen?", a: ["Voisitteko auttaa minua", "Voisitteko auttaa"] },
    { t: "tr", dir: "de", q: "Ich brauche eine Bescheinigung.", a: ["Tarvitsen todistuksen", "Minä tarvitsen todistuksen"] },
    { t: "tr", dir: "de", q: "Was ist Ihre Staatsangehörigkeit?", a: ["Mikä on kansalaisuutenne", "Mikä teidän kansalaisuutenne on", "Mikä on teidän kansalaisuutenne", "Mikä kansalaisuus teillä on"] },
    { t: "tr", dir: "fi", q: "Henkilöllisyystodistus, kiitos.", a: ["Den Ausweis, bitte", "Ihren Ausweis, bitte", "Ausweis, bitte"] },
    { t: "tr", dir: "fi", q: "Jonotin virastossa tunnin.", a: ["Ich habe eine Stunde im Amt angestanden", "Ich stand eine Stunde im Amt an", "Ich habe im Amt eine Stunde gewartet", "Ich wartete eine Stunde im Amt"] },
    { t: "ord", w: ["Voisitteko", "auttaa", "minua", "lomakkeen", "kanssa"], a: ["Voisitteko auttaa minua lomakkeen kanssa?"], de: "Könnten Sie mir mit dem Formular helfen?" },
    { t: "ord", w: ["Haluaisin", "varata", "ajan", "virastoon"], a: ["Haluaisin varata ajan virastoon."], de: "Ich möchte einen Termin beim Amt vereinbaren." },
    { t: "mc", q: "Du kommst ins Amt. Was machst du zuerst?", o: ["Otan vuoronumeron.", "Allekirjoitan kortin.", "Menen sovituskoppiin.", "Tilaan ruokaa."], a: 0 },
    { t: "mc", q: "Du sprichst höflich mit einer Beamtin (Sie). Was passt?", o: ["Voisitteko auttaa?", "Auta!", "Autatko heti?", "Sinä autat."], a: 0 },
    { t: "mc", q: "Woran erkennt man den Konditional?", o: ["an -isi- vor der Personalendung: voisin, olisin", "an -i- allein: voin", "an der Endung -ko", "an -nut/-nyt"], a: 0, x: "Stamm + -isi- + Endung: voi-si-n, ol-isi-n, halua-isi-n. Höflich: haluaisin, voisitko, olisiko." },
    { t: "mc", q: "Du sprichst EINE Beamtin an: „Voisitteko …?“ – warum die Form mit -tte-?", o: ["höfliche Anrede mit „te“ (Sie)", "weil es eine Frage ist", "Das ist die Vergangenheit.", "Das ist die Verneinung."], a: 0, x: "te ist auch die höfliche Sie-Form: Voisitteko …? Mitä te haluaisitte? In Finnland duzt man aber meistens." },
    { t: "mc", q: "Was heißt „Olisiko teillä aikaa?“", o: ["Hätten Sie Zeit?", "Hatten Sie Zeit?", "Haben Sie Zeit gehabt?", "Sie haben Zeit."], a: 0, x: "olisiko = olla im Konditional + -ko: Wäre …? Hätten Sie …? (höflich)" },
    { t: "les", q: "Aukioloajat", txt: ["Digi- ja väestötietovirasto", "Avoinna: ma–pe klo 9–16", "La–su suljettu", "Ota vuoronumero ovella.", "Ajanvaraus netissä."], qs: [{ q: "Wann ist das Amt geöffnet?", o: ["Montag bis Freitag, 9–16 Uhr", "jeden Tag", "nur am Samstag"], a: 0 }, { q: "Was soll man an der Tür tun?", o: ["eine Wartenummer nehmen", "klingeln", "anrufen"], a: 0 }, { q: "Wie vereinbart man einen Termin?", o: ["im Internet", "am Telefon", "per Brief"], a: 0 }] },
    { t: "les", q: "Postissa", txt: ["Virkailija: Seuraava, olkaa hyvä!", "Matthias: Hei! Haluaisin hakea paketin.", "Virkailija: Saisinko henkilöllisyystodistuksen?", "Matthias: Tässä on passi.", "Virkailija: Kiitos. Allekirjoitus tähän, olkaa hyvä.", "Matthias: Kiitos!"], qs: [{ q: "Was möchte Matthias?", o: ["ein Paket abholen", "eine Briefmarke kaufen", "Geld wechseln"], a: 0 }, { q: "Was zeigt er?", o: ["seinen Reisepass", "seine Bankkarte", "nichts"], a: 0 }, { q: "Was muss er am Ende tun?", o: ["unterschreiben", "warten", "zahlen"], a: 0 }] },
    { t: "dlg", q: "Im Amt", h: "Deine Zeilen auf Finnisch schreiben – höflich mit „te“", r: [["Virkailija", "Hei! Miten voin auttaa?"], ["Sinä", "[Tarvitsen todistuksen. Voisitteko auttaa?|Voisitteko auttaa? Tarvitsen todistuksen.|Haluaisin todistuksen.]", "Sag, dass du eine Bescheinigung brauchst, und bitte höflich um Hilfe."], ["Virkailija", "Totta kai. Täyttäkää tämä lomake."], ["Sinä", "[Voisitteko toistaa?|Anteeksi, voisitteko toistaa?|Voisitteko sanoa sen uudestaan?]", "Bitte höflich um Wiederholung."], ["Virkailija", "Täyttäkää lomake. Allekirjoitus tähän."], ["Sinä", "[Selvä, kiitos.|Kiitos!]", "Bedanke dich."]] },
    { t: "dlg", q: "Termin am Telefon", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Virkailija", "Virasto, hyvää päivää."], ["Sinä", "[Hyvää päivää! Haluaisin varata ajan.|Hei! Haluaisin varata ajan.]", "Grüß und sag, dass du einen Termin möchtest."], ["Virkailija", "Sopiiko tiistai kello 10?"], ["Sinä", "[Sopii hyvin, kiitos.|Kyllä, se sopii.|Sopii.]", "Sag ja, es passt."], ["Virkailija", "Ottakaa passi mukaan."], ["Sinä", "[Selvä, kiitos!|Selvä. Kiitos ja hei!]", "Sag „klar“ und verabschiede dich."]] },
    { t: "sch", q: "Schreib eine kurze, höfliche E-Mail: Du bittest um einen Termin nächste Woche.", w: ["haluaisin", "voisitteko"], a: ["Hyvä virkailija, haluaisin varata ajan ensi viikolle. Voisitteko auttaa? Ystävällisin terveisin Matthias", "Hei! Haluaisin varata ajan ensi viikolle. Voisitteko vastata pian? Kiitos! Terveisin Matthias"], h: "Anrede, Bitte, Gruß" },
    { t: "sch", q: "Schreib, was du ins Formular schreibst: Name, Geburtsdatum und Adresse.", w: ["lomakkeeseen"], a: ["Kirjoitan lomakkeeseen nimen, syntymäajan ja osoitteen.", "Lomakkeeseen kirjoitan nimen, syntymäajan ja osoitteen."], h: "ein Satz" }
  ]
};
