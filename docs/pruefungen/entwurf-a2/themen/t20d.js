module.exports = {
  id: "t20d",
  title: "Sprachkurs & Anmeldung: nachfragen im Unterricht (20.4)",
  fi: "Mitä tämä sana tarkoittaa?",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20"],
  th: `<p>Situation: Du meldest dich für einen Finnischkurs an und fragst im Unterricht nach – was ein Wort bedeutet, wie man etwas sagt, ob die Lehrerin etwas erklären oder wiederholen kann.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Haluan ilmoittautua suomen kurssille.</td><td>Ich möchte mich für den Finnischkurs anmelden.</td></tr>
<tr><td>Milloin kurssi alkaa? Paljonko se maksaa?</td><td>Wann beginnt der Kurs? Was kostet er?</td></tr>
<tr><td>Mitä tämä sana tarkoittaa?</td><td>Was bedeutet dieses Wort?</td></tr>
<tr><td>Miten sanotaan suomeksi „Hausaufgabe“?</td><td>Wie sagt man „Hausaufgabe“ auf Finnisch?</td></tr>
<tr><td>En ymmärrä kysymystä. Voitko selittää?</td><td>Ich verstehe die Frage nicht. Kannst du das erklären?</td></tr>
<tr><td>Voitko toistaa? Puhu hitaammin, kiitos.</td><td>Kannst du das wiederholen? Sprich bitte langsamer.</td></tr>
<tr><td>Mikä on läksy huomiseksi?</td><td>Was ist die Hausaufgabe für morgen?</td></tr>
</table>
<h3>Im Unterricht hörst du</h3><table>
<tr><td>Avatkaa kirjat sivulta kaksitoista.</td><td>Öffnet die Bücher auf Seite zwölf.</td></tr>
<tr><td>Tehkää harjoitus kolme.</td><td>Macht Übung drei.</td></tr>
<tr><td>Keskustelkaa yhdessä suomeksi.</td><td>Unterhaltet euch zusammen auf Finnisch.</td></tr>
<tr><td>Läksyksi on harjoitus neljä.</td><td>Als Hausaufgabe ist Übung vier.</td></tr>
<tr><td>Huomenna on koe.</td><td>Morgen ist ein Test.</td></tr></table>
<p class="rule">Die Lehrerin spricht alle an: Befehlsform für mehrere (<i>avatkaa, tehkää, lukekaa</i> – aus 16.3). Kurse und Stunden nehmen <b>-lle / -lla / -lta</b>: <i>ilmoittautua kurssille</i> (wohin), <i>kurssilla</i> (im Kurs), <i>tunnilla</i> (in der Stunde).</p>
<h3>ilmoittautua – Verben auf -utua / -ytyä</h3>
<table><tr><td>Person</td><td>ilmoittautua</td></tr>
<tr><td>minä</td><td>ilmoittaudun</td></tr><tr><td>sinä</td><td>ilmoittaudut</td></tr><tr><td>hän</td><td>ilmoittautuu</td></tr>
<tr><td>me</td><td>ilmoittaudumme</td></tr><tr><td>te</td><td>ilmoittaudutte</td></tr><tr><td>he</td><td>ilmoittautuvat</td></tr></table>
<p class="rule">Wie <i>pukeutua → pukeudun</i> (12.4): Stufenwechsel <b>t → d</b> in den schwachen Formen; <i>hän ilmoittautuu, he ilmoittautuvat</i> stark. Diese Verben beschreiben oft, was man mit sich selbst tut (sich anmelden, sich anziehen).</p>
<h3>Wörter auf -s</h3>
<p class="rule"><i>kysymys, vastaus, harjoitus</i> (und <i>kokous</i> aus t20) bekommen vor Endungen <b>-kse-</b>: <i>kysymyksen, vastauksen, harjoituksessa</i>; in der Teilungsform aber <b>-sta</b>: <i>En ymmärrä kysymystä.</i> Mehr dazu in 21.3. Auch <i>koe</i> ist besonders: <i>kokeen, kokeessa</i>.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mitä toi tarkottaa?</i> (= Mitä tuo tarkoittaa?) · <i>Miten sanotaan …?</i> oft verkürzt <i>Miten sanotaan suomeks?</i> · Statt <i>läksy</i> sagt man im Erwachsenenkurs oft <i>kotitehtävä</i>.</p>
<p class="tip"><b>Kulttuuri:</b> Viele Finnischkurse für Erwachsene gibt es günstig an der <i>kansalaisopisto</i> (Volkshochschule). Anmeldung fast immer im Internet. Lehrkräfte werden meist geduzt und mit Vornamen angesprochen.</p>`,
  v: [
    ["kurssi", "Kurs (kurssille, kurssilla)"],
    ["alkeiskurssi", "Anfängerkurs"],
    ["ilmoittautua", "sich anmelden (ilmoittaudun; + -lle)"],
    ["oppitunti", "Unterrichtsstunde"],
    ["tunnilla", "in der (Unterrichts-)Stunde"],
    ["läksy", "Hausaufgabe"],
    ["huomiseksi", "für morgen"],
    ["koe", "Prüfung, Test (kokeen, kokeessa)"],
    ["selittää", "erklären (selitän)"],
    ["keskustella", "sich unterhalten, diskutieren (keskustelen)"],
    ["kysymys", "Frage (kysymyksen, kysymystä)"],
    ["vastaus", "Antwort (vastauksen, vastausta)"],
    ["harjoitus", "Übung (harjoituksen)"],
    ["sivu", "Seite (sivulla, sivulta)"],
    ["avata", "öffnen (avaan; avatkaa!)"],
    ["taso", "Niveau, Stufe"],
    ["netissä", "im Internet"],
    ["Miten sanotaan suomeksi?", "Wie sagt man das auf Finnisch?"]
  ],
  ex: [
    { t: "tab", q: "ilmoittautua", h: "Jedes Kästchen eine Form von ilmoittautua (Stufenwechsel t → d)", head: ["Person", "ilmoittautua"], r: [["minä", "[ilmoittaudun]"], ["sinä", "[ilmoittaudut]"], ["hän", "[ilmoittautuu]"], ["me", "[ilmoittaudumme]"], ["te", "[ilmoittaudutte]"], ["he", "[ilmoittautuvat]"]] },
    { t: "tab", q: "Im Unterricht nachfragen", h: "Jedes Kästchen ein ganzer Satz auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["Was bedeutet dieses Wort?", "[Mitä tämä sana tarkoittaa?]"], ["Kannst du das wiederholen?", "[Voitko toistaa?|Voitko toistaa sen?]"], ["Kannst du das erklären?", "[Voitko selittää?|Voitko selittää sen?]"], ["Ich verstehe die Frage nicht.", "[En ymmärrä kysymystä.|Minä en ymmärrä kysymystä.]"], ["Wie sagt man das auf Finnisch?", "[Miten se sanotaan suomeksi?|Miten sanotaan suomeksi?|Miten tämä sanotaan suomeksi?]"]] },
    { t: "gap", q: "Haluan ___ suomen kurssille.", h: "ilmoittautua – Grundform nach „haluan“", a: ["ilmoittautua"] },
    { t: "gap", q: "Minä ___ kurssille netissä.", h: "ilmoittautua – Form für „minä“ (Stufenwechsel t → d)", a: ["ilmoittaudun"], s: 1 },
    { t: "gap", q: "Mitä tämä sana ___?", h: "tarkoittaa – Form für „se“", a: ["tarkoittaa"] },
    { t: "gap", q: "Voitko ___ tämän harjoituksen?", h: "selittää – Grundform: erklären", a: ["selittää"] },
    { t: "gap", q: "Huomenna on ___.", h: "Prüfung, Test", a: ["koe"] },
    { t: "gap", q: "Avatkaa kirjat ___ kymmenen.", h: "sivu + -lta: (ab) Seite …", a: ["sivulta"] },
    { t: "gap", q: "Läksyksi on ___ neljä.", h: "Übung – ein Wort", a: ["harjoitus"] },
    { t: "tr", dir: "de", q: "Was bedeutet dieses Wort?", a: ["Mitä tämä sana tarkoittaa"] },
    { t: "tr", dir: "de", q: "Ich verstehe die Frage nicht.", a: ["En ymmärrä kysymystä", "Minä en ymmärrä kysymystä", "En ymmärrä tätä kysymystä"] },
    { t: "tr", dir: "de", q: "Was ist die Hausaufgabe für morgen?", a: ["Mikä on läksy huomiseksi", "Mikä on huomiseksi läksy"] },
    { t: "tr", dir: "fi", q: "Kurssi alkaa syyskuussa ja maksaa sata euroa.", a: ["Der Kurs beginnt im September und kostet hundert Euro", "Der Kurs fängt im September an und kostet hundert Euro", "Der Kurs beginnt im September und kostet 100 Euro"] },
    { t: "tr", dir: "fi", q: "Tunnilla keskustelemme suomeksi.", a: ["In der Stunde unterhalten wir uns auf Finnisch", "Im Unterricht unterhalten wir uns auf Finnisch", "In der Stunde sprechen wir Finnisch", "Im Unterricht sprechen wir Finnisch", "In der Stunde diskutieren wir auf Finnisch"] },
    { t: "ord", w: ["Ilmoittaudun", "kurssille", "netissä"], a: ["Ilmoittaudun kurssille netissä.", "Ilmoittaudun netissä kurssille.", "Netissä ilmoittaudun kurssille."], de: "Ich melde mich im Internet für den Kurs an." },
    { t: "ord", w: ["Mikä", "on", "läksy", "huomiseksi"], a: ["Mikä on läksy huomiseksi?"], de: "Was ist die Hausaufgabe für morgen?" },
    { t: "mc", q: "Die Lehrerin spricht zu schnell. Was sagst du?", o: ["Anteeksi, puhu hitaammin, kiitos.", "Hienoa!", "Ilmoittaudun kurssille.", "Ei haittaa."], a: 0 },
    { t: "mc", q: "Du kennst ein Wort nicht. Was fragst du?", o: ["Mitä tämä sana tarkoittaa?", "Missä tämä sana on?", "Kuka tämä sana on?", "Milloin tämä sana on?"], a: 0 },
    { t: "mc", q: "Welche Form hat „ilmoittautua“ bei „minä“?", o: ["ilmoittaudun", "ilmoittautun", "ilmoittaudan", "ilmoittautan"], a: 0, x: "Verben auf -utua/-ytyä haben in der schwachen Form t → d, wie pukeutua → pukeudun. Stark: hän ilmoittautuu." },
    { t: "mc", q: "„ilmoittautua kurssille“ – warum -lle?", o: ["Kurse und Stunden nehmen -lle (wohin), -lla (wo), -lta (woher).", "-lle heißt hier „mit“.", "Weil kurssi eine Person ist.", "-lle zeigt die Vergangenheit."], a: 0, x: "Wie mennä kurssille, olla kurssilla, tulla tunnilta. Ähnlich: olla töissä/lomalla – manche Wörter haben feste Ortsformen." },
    { t: "mc", q: "„Läksyksi on harjoitus neljä.“ – Was bedeutet -ksi hier?", o: ["„als“: wozu etwas dient (als Hausaufgabe)", "„auf“: auf Seite vier", "die Vergangenheit", "„ohne“"], a: 0, x: "Translativ -ksi = als was etwas dient oder wofür: läksyksi, joululahjaksi, huomiseksi (für morgen)." },
    { t: "les", q: "Kurssi-ilmoitus", txt: ["Suomen kielen alkeiskurssi", "Kurssi alkaa maanantaina 2.9. kello 17.", "Oppitunti on kaksi kertaa viikossa: maanantaina ja keskiviikkona.", "Kurssi maksaa 120 euroa.", "Ilmoittaudu netissä!"], qs: [{ q: "An welchen Tagen ist der Kurs?", o: ["Montag und Mittwoch", "nur Montag", "jeden Tag"], a: 0 }, { q: "Wie viel kostet er?", o: ["120 Euro", "20 Euro", "nichts"], a: 0 }, { q: "Wie meldet man sich an?", o: ["im Internet", "am Telefon", "in der ersten Stunde"], a: 0 }] },
    { t: "les", q: "Tunnilla", txt: ["Opettaja: Huomenta! Avatkaa kirjat sivulta kaksitoista.", "Matthias: Anteeksi, mitä „sivu“ tarkoittaa?", "Opettaja: Sivu on saksaksi „Seite“.", "Matthias: Kiitos! Voitko selittää harjoituksen kolme?", "Opettaja: Totta kai. Keskustelkaa yhdessä suomeksi.", "Opettaja: Läksyksi on harjoitus neljä."], qs: [{ q: "Auf welcher Seite öffnen sie das Buch?", o: ["12", "2", "4"], a: 0 }, { q: "Was versteht Matthias nicht?", o: ["das Wort „sivu“", "die Hausaufgabe", "die Uhrzeit"], a: 0 }, { q: "Was ist die Hausaufgabe?", o: ["Übung vier", "Übung drei", "Seite zwölf"], a: 0 }] },
    { t: "dlg", q: "Anmeldung zum Kurs", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Opettaja", "Hei! Miten voin auttaa?"], ["Sinä", "[Haluan ilmoittautua suomen kurssille.|Haluaisin ilmoittautua suomen kurssille.|Haluan ilmoittautua kurssille.]", "Sag, dass du dich für den Finnischkurs anmelden möchtest."], ["Opettaja", "Hyvä! Puhutko suomea?"], ["Sinä", "[Vähän. Osaan vähän suomea.|Puhun vähän suomea.|Vähän.|Osaan vähän.]", "Sag: ein bisschen."], ["Opettaja", "Sitten alkeiskurssi on hyvä. Se alkaa maanantaina."], ["Sinä", "[Paljonko kurssi maksaa?|Paljonko se maksaa?|Mitä kurssi maksaa?]", "Frag, was der Kurs kostet."], ["Opettaja", "Sata euroa."]] },
    { t: "dlg", q: "Nachfragen in der Stunde", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Opettaja", "Lukekaa sivu viisi."], ["Sinä", "[Anteeksi, en ymmärrä. Voitko toistaa?|Anteeksi, voitko toistaa?|En ymmärrä. Voitko toistaa?]", "Sag, dass du nicht verstehst, und bitte um Wiederholung."], ["Opettaja", "Lukekaa sivu viisi."], ["Sinä", "[Kiitos! Mitä se tarkoittaa?|Mitä se tarkoittaa?|Mitä tämä tarkoittaa?]", "Bedanke dich und frag, was das bedeutet."], ["Opettaja", "Se on saksaksi „Lest Seite fünf!“"], ["Sinä", "[Selvä, kiitos!|Kiitos!|Selvä!]", "Sag „klar“ und bedanke dich."]] },
    { t: "sch", q: "Schreib eine kurze Nachricht: Du möchtest dich für den Finnischkurs anmelden. Frag, wann er beginnt.", w: ["ilmoittautua", "kurssille"], a: ["Hei! Haluan ilmoittautua suomen kurssille. Milloin kurssi alkaa?", "Hei, haluaisin ilmoittautua suomen kurssille. Milloin se alkaa?"], h: "zwei kurze Sätze auf Finnisch" },
    { t: "sch", q: "Schreib, dass du die Frage nicht verstehst, und bitte darum, sie zu erklären.", w: ["kysymystä", "selittää"], a: ["En ymmärrä kysymystä. Voitko selittää sen?", "En ymmärrä tätä kysymystä. Voitko selittää?"], h: "zwei kurze Sätze auf Finnisch" }
  ]
};
