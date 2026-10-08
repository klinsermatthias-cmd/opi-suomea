module.exports = {
  id: "t28b",
  title: "Lebenslauf & Familie früher (28.2)",
  fi: "Menimme naimisiin 1990-luvulla",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28"],
  th: `<p>Vertiefung zu t28: das eigene Leben und das der Familie erzählen – Hochzeit, Umzug, Ausland, Ruhestand, Erinnerungen – und einen kurzen Lebenslauf lesen und schreiben.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Vanhempani menivät naimisiin 1980-luvulla.</td><td>Meine Eltern haben in den 1980ern geheiratet.</td></tr>
<tr><td>Isovanhempani ovat olleet naimisissa 50 vuotta.</td><td>Meine Großeltern sind seit 50 Jahren verheiratet.</td></tr>
<tr><td>He erosivat kymmenen vuotta sitten.</td><td>Sie haben sich vor zehn Jahren getrennt.</td></tr>
<tr><td>Nuorena asuin ulkomailla.</td><td>Als junger Mensch habe ich im Ausland gewohnt.</td></tr>
<tr><td>Isä jäi eläkkeelle viime vuonna.</td><td>Der Vater ist letztes Jahr in Pension gegangen.</td></tr>
<tr><td>Minulla on hyviä muistoja lapsuudesta.</td><td>Ich habe gute Erinnerungen an die Kindheit.</td></tr>
</table>
<h3>Veränderung (wohin) – Zustand (wo)</h3>
<table><tr><td>Veränderung</td><td>Zustand</td></tr>
<tr><td>mennä naimisiin (heiraten)</td><td>olla naimisissa (verheiratet sein)</td></tr>
<tr><td>jäädä eläkkeelle (in Pension gehen)</td><td>olla eläkkeellä (in Pension sein)</td></tr>
<tr><td>muuttaa ulkomaille (ins Ausland ziehen)</td><td>asua ulkomailla (im Ausland wohnen)</td></tr></table>
<p class="rule">Wie <i>mennä kotiin – olla kotona</i>: Veränderung mit der <b>Wohin-Form</b>, Zustand mit der <b>Wo-Form</b>.</p>
<h3>Jahrzehnte</h3>
<p class="rule"><i>1990-luku</i> = die 1990er-Jahre; „in den 1990ern“ = <b>1990-luvulla</b> (gelesen: <i>yhdeksänkymmentäluvulla</i>). Ein einzelnes Jahr: <i>vuonna 1990</i>. Lebensabschnitte im Essiv: <i>lapsena, nuorena, aikuisena</i> (20.3).</p>
<h3>Lebenslauf (ansioluettelo)</h3>
<p class="tip">Typische Überschriften: <i>Koulutus</i> (Ausbildung), <i>Työkokemus</i> (Berufserfahrung), <i>Kielitaito</i> (Sprachkenntnisse), <i>Harrastukset</i> (Hobbys).</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip">Jahrzehnte haben Spitznamen: <i>kasari</i> (1980er), <i>ysäri</i> (1990er): <i>Ysärillä mä asuin Wienis.</i> · <i>Mun vanhemmat on eronnu.</i> (= Vanhempani ovat eronneet.)</p>`,
  v: [
    ["vanhemmat", "Eltern"],
    ["häät", "Hochzeit (Mehrzahl; häissä = auf der Hochzeit)"],
    ["mennä naimisiin", "heiraten"],
    ["erota", "sich trennen, sich scheiden lassen (eroan; erosin)"],
    ["jäädä eläkkeelle", "in Pension gehen"],
    ["nuorena", "als junger Mensch"],
    ["kotimaa", "Heimatland"],
    ["kotikaupunki", "Heimatstadt"],
    ["ulkomailla", "im Ausland"],
    ["ulkomaille", "ins Ausland"],
    ["muisto", "Erinnerung"],
    ["valokuva", "Foto"],
    ["vuosikymmen", "Jahrzehnt"],
    ["-luvulla", "in den …ern (1990-luvulla)"],
    ["ansioluettelo", "Lebenslauf"],
    ["koulutus", "Ausbildung (koulutuksen)"],
    ["työkokemus", "Berufserfahrung"],
    ["kielitaito", "Sprachkenntnisse"]
  ],
  ex: [
    { t: "tab", q: "Lebensereignisse", h: "Jedes Kästchen ein ganzer Satz auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["Ich bin 1990 geboren.", "[Synnyin vuonna 1990.]"], ["Wir haben 2015 geheiratet.", "[Menimme naimisiin vuonna 2015.]"], ["Sie haben sich getrennt.", "[He erosivat.]"], ["Er ist in Pension gegangen.", "[Hän jäi eläkkeelle.]"], ["Ich habe im Ausland gewohnt.", "[Olen asunut ulkomailla.|Asuin ulkomailla.]"]] },
    { t: "tab", q: "Veränderung und Zustand", h: "Jedes Kästchen eine eigene Wendung: links Veränderung (Wohin-Form), rechts Zustand (Wo-Form) – z. B. heiraten | mennä naimisiin | olla naimisissa", head: ["Deutsch", "Veränderung", "Zustand"], r: [["heiraten / verheiratet", "[mennä naimisiin]", "[olla naimisissa]"], ["Pension", "[jäädä eläkkeelle]", "[olla eläkkeellä]"], ["Ausland", "[muuttaa ulkomaille]", "[asua ulkomailla]"]] },
    { t: "gap", q: "Aino ja Ville ___ naimisiin kesällä.", h: "mennä – Vergangenheit für „he“", a: ["menivät"] },
    { t: "gap", q: "Isovanhempani ovat olleet ___ 50 vuotta.", h: "verheiratet", a: ["naimisissa"] },
    { t: "gap", q: "___ asuin ulkomailla.", h: "nuori im Essiv: als junger Mensch", a: ["Nuorena"] },
    { t: "gap", q: "Hän muutti ___ vuonna 2010.", h: "ins Ausland", a: ["ulkomaille"] },
    { t: "gap", q: "Isä jäi ___ viime vuonna.", h: "in Pension (Wohin-Form)", a: ["eläkkeelle"] },
    { t: "gap", q: "Vanhempani menivät naimisiin 1980-___.", h: "nur die Endung: in den 1980ern", a: ["luvulla"] },
    { t: "tr", dir: "de", q: "Wo ist deine Heimatstadt?", a: ["Missä kotikaupunkisi on", "Missä on kotikaupunkisi", "Missä sinun kotikaupunkisi on"] },
    { t: "tr", dir: "de", q: "Meine Eltern haben sich vor zehn Jahren getrennt.", a: ["Vanhempani erosivat kymmenen vuotta sitten", "Minun vanhempani erosivat kymmenen vuotta sitten", "Vanhempani ovat eronneet kymmenen vuotta sitten"] },
    { t: "tr", dir: "de", q: "In den 90ern wohnten wir in Wien.", a: ["1990-luvulla asuimme Wienissä", "Asuimme Wienissä 1990-luvulla", "Yhdeksänkymmentäluvulla asuimme Wienissä"] },
    { t: "tr", dir: "fi", q: "Häissä oli sata vierasta.", a: ["Auf der Hochzeit waren hundert Gäste", "Bei der Hochzeit waren hundert Gäste"] },
    { t: "tr", dir: "fi", q: "Minulla on paljon hyviä muistoja lapsuudesta.", a: ["Ich habe viele gute Erinnerungen an die Kindheit", "Ich habe viele gute Erinnerungen an meine Kindheit"] },
    { t: "ord", w: ["Kirjoitin", "ansioluettelon", "suomeksi"], a: ["Kirjoitin ansioluettelon suomeksi.", "Suomeksi kirjoitin ansioluettelon."], de: "Ich habe den Lebenslauf auf Finnisch geschrieben." },
    { t: "mc", q: "„mennä naimisiin“ – „olla naimisissa“: Was ist der Unterschied?", o: ["heiraten (Veränderung, Wohin-Form) – verheiratet sein (Zustand, Wo-Form)", "Beides heißt „heiraten“.", "naimisissa ist die Mehrzahl.", "naimisiin ist die Vergangenheit."], a: 0, x: "Wie mennä kotiin – olla kotona. Ebenso jäädä eläkkeelle – olla eläkkeellä." },
    { t: "mc", q: "„1990-luvulla“ bedeutet:", o: ["in den 1990er-Jahren", "im Jahr 1990", "vor 1990", "seit 1990"], a: 0, x: "-luku = Jahrzehnt, „in“ mit -lla: 1990-luvulla. Ein einzelnes Jahr: vuonna 1990." },
    { t: "mc", q: "„ulkomailla“ oder „ulkomaille“?", o: ["ulkomailla = im Ausland (wo), ulkomaille = ins Ausland (wohin)", "Beides heißt „im Ausland“.", "ulkomaille ist die Mehrzahl.", "ulkomailla ist die Vergangenheit."], a: 0, x: "ulkomaat ist ein Mehrzahl-Wort: ulkomailla (wo), ulkomaille (wohin), ulkomailta (woher)." },
    { t: "mc", q: "Gesprochen: „Ysärillä mä asuin Wienis.“ – Was ist „ysärillä“?", o: ["in den 90ern", "im Jahr 9", "am Neunten", "um neun"], a: 0, x: "ysäri = die 1990er (yhdeksänkymmentäluku), kasari = die 1980er." },
    { t: "les", q: "Isovanhempien tarina", txt: ["Isoäitini syntyi Karjalassa vuonna 1940.", "Lapsena hän muutti perheen kanssa Ouluun.", "Nuorena hän tapasi isoisäni tanssilavalla.", "He menivät naimisiin vuonna 1962.", "Häissä oli paljon vieraita.", "He olivat naimisissa 50 vuotta."], qs: [{ q: "Wo wurde die Großmutter geboren?", o: ["in Karelien", "in Oulu", "in Helsinki"], a: 0 }, { q: "Wann haben sie geheiratet?", o: ["1962", "1940", "1950"], a: 0 }, { q: "Wie lange waren sie verheiratet?", o: ["50 Jahre", "20 Jahre", "62 Jahre"], a: 0 }] },
    { t: "les", q: "Ansioluettelo", txt: ["ANSIOLUETTELO", "Nimi: Ville Virtanen", "Koulutus: lukio 2004, insinööri 2009", "Työkokemus: 2009–2015 insinööri, Helsinki; 2015– yrittäjä, Oulu", "Kielitaito: suomi, englanti, ruotsi"], qs: [{ q: "Was hat Ville gelernt?", o: ["Ingenieur", "Arzt", "Lehrer"], a: 0 }, { q: "Was macht er seit 2015?", o: ["Er ist selbstständig in Oulu.", "Er ist Ingenieur in Helsinki.", "Er studiert."], a: 0 }, { q: "Welche Sprachen kann er?", o: ["Finnisch, Englisch, Schwedisch", "Deutsch und Finnisch", "nur Finnisch"], a: 0 }] },
    { t: "dlg", q: "Familie früher", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Missä isovanhempasi asuivat?"], ["Sinä", "[He asuivat maaseudulla.|Maaseudulla.|Isovanhempani asuivat maaseudulla.]", "Sag: auf dem Land."], ["Aino", "Milloin he menivät naimisiin?"], ["Sinä", "[1960-luvulla.|He menivät naimisiin 1960-luvulla.|Vuonna 1965.]", "Sag: in den 1960ern."], ["Aino", "Onko sinulla valokuvia?"], ["Sinä", "[On, minulla on vanha valokuva häistä.|On, vanha valokuva häistä.|On.]", "Sag: Ja, ein altes Foto von der Hochzeit."]] },
    { t: "dlg", q: "Im Ausland", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Kollega", "Oletko asunut ulkomailla?"], ["Sinä", "[Olen. Asuin Saksassa kaksi vuotta.|Olen, asuin Saksassa kaksi vuotta.]", "Sag ja: Du hast zwei Jahre in Deutschland gewohnt."], ["Kollega", "Milloin?"], ["Sinä", "[Nuorena, 2010-luvulla.|Kun olin nuori.|2010-luvulla.]", "Sag: als junger Mensch, in den 2010ern."]] },
    { t: "sch", q: "Schreib drei wichtige Ereignisse deines Lebens mit Jahreszahl.", w: ["vuonna"], a: ["Synnyin vuonna 1990. Muutin Linziin vuonna 2010. Aloitin suomen kurssin vuonna 2026.", "Synnyin vuonna 1990 Itävallassa. Valmistuin vuonna 2015. Aloitin uudessa työpaikassa vuonna 2020."], h: "drei kurze Sätze in der Vergangenheit" },
    { t: "sch", q: "Schreib, ob du schon im Ausland gewohnt hast.", w: ["ulkomailla"], a: ["Olen asunut ulkomailla kaksi vuotta.", "En ole koskaan asunut ulkomailla."], h: "ein Satz im Perfekt" }
  ]
};
