module.exports = {
  id: "t23c",
  title: "Feinheiten: Imperfekt oder Perfekt? Seit, bis, nach, vor (23.3)",
  fi: "Vuodesta 2020 lähtien",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t20c", "t21d"],
  th: `<p>Feinheiten zu t23: Wann nimmt man das <b>Imperfekt</b> (kävin), wann das <b>Perfekt</b> (olen käynyt)? Und wie sagt man genau <b>seit, bis, nach, vor, während</b>?</p>
<h3>Imperfekt oder Perfekt?</h3>
<table><tr><td>Imperfekt (kävin)</td><td>Perfekt (olen käynyt)</td></tr>
<tr><td>abgeschlossen, mit Zeitpunkt: <i>Kävin Lapissa viime vuonna.</i></td><td>Erfahrung ohne Zeitpunkt: <i>Olen käynyt Lapissa.</i></td></tr>
<tr><td>vorbei: <i>Asuin Wienissä viisi vuotta.</i> (jetzt nicht mehr)</td><td>bis jetzt: <i>Olen asunut Linzissä viisi vuotta.</i> (immer noch)</td></tr>
<tr><td>eilen, viime viikolla, … sitten, lapsena</td><td>jo, vielä, koskaan, tähän asti, … lähtien</td></tr></table>
<p class="rule">Typisch: Frage im Perfekt, Antwort mit Zeitpunkt im Imperfekt: <i>Oletko käynyt Lapissa? – Olen, kävin siellä viime talvena.</i> Verneint im Plural: <i>Emme ole nähneet häntä.</i></p>
<h3>Zeitangaben</h3>
<table><tr><td>seit</td><td>-sta + lähtien</td><td>vuodesta 2020 lähtien, maanantaista lähtien</td></tr>
<tr><td>bis</td><td>Wohin-Form + asti</td><td>kello viiteen asti, perjantaihin asti</td></tr>
<tr><td>bis spätestens</td><td>Wohin-Form + mennessä</td><td>perjantaihin mennessä</td></tr>
<tr><td>in (nach Ablauf)</td><td>-n + kuluttua / päästä</td><td>viikon kuluttua, tunnin päästä</td></tr>
<tr><td>nach</td><td>-n + jälkeen</td><td>ruoan jälkeen, työn jälkeen</td></tr>
<tr><td>vor</td><td>ennen + Teilungsform</td><td>ennen ruokaa, ennen joulua</td></tr>
<tr><td>während</td><td>-n + aikana</td><td>kesän aikana, viikon aikana</td></tr></table>
<p class="rule"><i>kuluttua</i> und <i>päästä</i> bedeuten dasselbe („in einer Woche“), <i>päästä</i> ist etwas alltäglicher. „Bis“ mit Uhrzeit kennst du aus 9.3: <i>yhdeksästä viiteen</i> → <i>kello viiteen asti</i>. <i>En ole nähnyt häntä vuosiin.</i> = Ich habe ihn/sie seit Jahren nicht gesehen.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mä oon asunu täällä vuodesta 2020.</i> (lähtien fällt oft weg) · <i>Nähdään viikon päästä!</i> · <i>Mä oon töissä viiteen asti.</i> · statt <i>asti</i> auch <i>saakka</i> (eher geschrieben).</p>`,
  v: [
    ["lähtien", "seit (vuodesta 2020 lähtien)"],
    ["asti", "bis (kello viiteen asti)"],
    ["mennessä", "bis spätestens (perjantaihin mennessä)"],
    ["kuluttua", "in, nach Ablauf von (viikon kuluttua)"],
    ["päästä", "in (tunnin päästä)"],
    ["jälkeen", "nach (ruoan jälkeen)"],
    ["ennen", "vor (ennen ruokaa); früher"],
    ["aikana", "während (kesän aikana)"],
    ["tähän asti", "bis jetzt, bisher"],
    ["vuosiin", "seit Jahren (nicht)"],
    ["pitkään", "lange"]
  ],
  ex: [
    { t: "tab", q: "Imperfekt und Perfekt von käydä", h: "Jedes Kästchen eine eigene Form: links Imperfekt (ein Wort), rechts Perfekt (zwei Wörter) – z. B. minä | kävin | olen käynyt", head: ["Person", "Imperfekt", "Perfekt"], r: [["minä", "[kävin]", "[olen käynyt]"], ["sinä", "[kävit]", "[olet käynyt]"], ["hän", "[kävi]", "[on käynyt]"], ["me", "[kävimme]", "[olemme käyneet]"], ["he", "[kävivät]", "[ovat käyneet]"]] },
    { t: "tab", q: "Zeitangaben", h: "Jedes Kästchen eine ganze Zeitangabe auf Finnisch (zwei oder drei Wörter)", head: ["Deutsch", "Suomeksi"], r: [["seit 2020", "[vuodesta 2020 lähtien]"], ["bis fünf Uhr", "[kello viiteen asti|viiteen asti]"], ["in einer Woche", "[viikon kuluttua|viikon päästä]"], ["nach dem Essen", "[ruoan jälkeen|ruuan jälkeen]"], ["vor Weihnachten", "[ennen joulua]"], ["während des Sommers", "[kesän aikana]"]] },
    { t: "gap", q: "___ Lapissa viime vuonna.", h: "käydä – Imperfekt oder Perfekt? (Zeitpunkt genannt) – Form für „minä“", a: ["Kävin"] },
    { t: "gap", q: "Oletko koskaan ___ Lapissa?", h: "käydä – Form auf -nyt (Erfahrung)", a: ["käynyt"], s: 1 },
    { t: "gap", q: "Asun Linzissä vuodesta 2020 ___.", h: "seit", a: ["lähtien"] },
    { t: "gap", q: "Olen töissä kello viiteen ___.", h: "bis", a: ["asti"] },
    { t: "gap", q: "Nähdään viikon ___!", h: "in (nach Ablauf von) – ein Wort auf -ttua", a: ["kuluttua"] },
    { t: "gap", q: "Juon kahvia ruoan ___.", h: "nach", a: ["jälkeen"] },
    { t: "gap", q: "Emme ole ___ häntä vuosiin.", h: "nähdä: Form auf -neet (Mehrzahl)", a: ["nähneet"], s: 1 },
    { t: "tr", dir: "de", q: "Ich wohne seit 2020 in Linz.", a: ["Olen asunut Linzissä vuodesta 2020 lähtien", "Asun Linzissä vuodesta 2020 lähtien", "Olen asunut Linzissä vuodesta 2020", "Vuodesta 2020 lähtien olen asunut Linzissä"] },
    { t: "tr", dir: "de", q: "Ich habe ihn seit Jahren nicht gesehen.", a: ["En ole nähnyt häntä vuosiin", "Minä en ole nähnyt häntä vuosiin"] },
    { t: "tr", dir: "de", q: "Vor der Arbeit trinke ich Kaffee.", a: ["Ennen työtä juon kahvia", "Juon kahvia ennen työtä", "Ennen työtä minä juon kahvia"] },
    { t: "tr", dir: "fi", q: "Lähetä lomake perjantaihin mennessä.", a: ["Schick das Formular bis spätestens Freitag", "Schicke das Formular bis Freitag", "Schick das Formular bis Freitag"] },
    { t: "tr", dir: "fi", q: "Kesän aikana luin viisi kirjaa.", a: ["Während des Sommers habe ich fünf Bücher gelesen", "Im Sommer habe ich fünf Bücher gelesen", "Während des Sommers las ich fünf Bücher", "Im Sommer las ich fünf Bücher"] },
    { t: "ord", w: ["Oletko", "jo", "syönyt"], a: ["Oletko jo syönyt?", "Oletko syönyt jo?"], de: "Hast du schon gegessen?" },
    { t: "ord", w: ["Kävin", "siellä", "kaksi", "vuotta", "sitten"], a: ["Kävin siellä kaksi vuotta sitten.", "Kaksi vuotta sitten kävin siellä."], de: "Ich war vor zwei Jahren dort." },
    { t: "mc", q: "„___ Wienissä viisi vuotta, nyt asun Linzissä.“ – Welche Form?", o: ["Asuin", "Olen asunut", "Asun", "Olin asua"], a: 0, x: "Abgeschlossen (jetzt nicht mehr) → Imperfekt: Asuin Wienissä viisi vuotta." },
    { t: "mc", q: "Wann nimmt man das Perfekt?", o: ["bei Erfahrungen ohne Zeitpunkt und bei allem, was bis jetzt gilt", "immer, wenn etwas gestern war", "nur in Fragen", "nur mit „sitten“"], a: 0, x: "Olen käynyt Lapissa (Erfahrung). Olen asunut täällä viisi vuotta (bis jetzt). Mit Zeitpunkt (eilen, viime vuonna, … sitten) → Imperfekt." },
    { t: "mc", q: "„viikon kuluttua“ – welche Form hat „viikko“?", o: ["die -n-Form: viikon", "die Teilungsform: viikkoa", "die Grundform: viikko", "-sta: viikosta"], a: 0, x: "kuluttua, päästä, jälkeen, aikana stehen nach der -n-Form: viikon kuluttua, ruoan jälkeen, kesän aikana. ennen steht davor, mit Teilungsform: ennen ruokaa." },
    { t: "mc", q: "„seit Montag“ heißt:", o: ["maanantaista lähtien", "maanantaihin asti", "maanantain jälkeen", "ennen maanantaita"], a: 0, x: "seit = -sta + lähtien. bis = Wohin-Form + asti: maanantaihin asti." },
    { t: "mc", q: "Gesprochen: „Nähdään viikon päästä!“ bedeutet:", o: ["Wir sehen uns in einer Woche!", "Wir sehen uns seit einer Woche.", "Wir haben uns vor einer Woche gesehen.", "Wir sehen uns die ganze Woche."], a: 0, x: "päästä = kuluttua (in, nach Ablauf von)." },
    { t: "les", q: "Viimeksi", txt: ["Aino: Milloin kävit viimeksi Suomessa?", "Matthias: Kaksi vuotta sitten. Entä sinä, oletko käynyt Itävallassa?", "Aino: En ole vielä. Mutta tulen sinne ensi kesänä!", "Matthias: Hienoa! Kuinka pitkäksi aikaa?", "Aino: Kahdeksi viikoksi. Olen lomalla heinäkuusta elokuun loppuun asti."], qs: [{ q: "Wann war Matthias zuletzt in Finnland?", o: ["vor zwei Jahren", "letzten Sommer", "noch nie"], a: 0 }, { q: "War Aino schon in Österreich?", o: ["noch nicht", "ja, oft", "ja, letztes Jahr"], a: 0 }, { q: "Wie lange hat Aino Urlaub?", o: ["von Juli bis Ende August", "zwei Tage", "nur im Juli"], a: 0 }] },
    { t: "les", q: "Työpäivä", txt: ["Olen töissä kahdeksasta neljään.", "Ennen työtä juon kahvia.", "Ruokatauko on kello kaksitoista. Ruoan jälkeen on kokous.", "Työn jälkeen menen kotiin.", "Tähän asti työpäivä on ollut hyvä!"], qs: [{ q: "Was macht der Schreiber vor der Arbeit?", o: ["Kaffee trinken", "essen", "einkaufen"], a: 0 }, { q: "Was ist nach dem Essen?", o: ["eine Besprechung", "Feierabend", "eine Pause"], a: 0 }, { q: "Wie war der Tag bis jetzt?", o: ["gut", "schlecht", "lang"], a: 0 }] },
    { t: "dlg", q: "Seit wann?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Kollega", "Kauanko olet asunut Linzissä?"], ["Sinä", "[Vuodesta 2020 lähtien.|Olen asunut täällä vuodesta 2020 lähtien.|Viisi vuotta.]", "Sag: seit 2020."], ["Kollega", "Entä ennen?"], ["Sinä", "[Ennen asuin Wienissä.|Asuin Wienissä.|Wienissä.]", "Sag: Vorher hast du in Wien gewohnt."], ["Kollega", "Oletko käynyt Suomessa?"], ["Sinä", "[Olen. Kävin siellä viime vuonna.|Olen, kävin siellä viime vuonna.|Kyllä, viime vuonna.]", "Sag ja – du warst letztes Jahr dort."]] },
    { t: "dlg", q: "Wann treffen wir uns?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Milloin olet vapaa?"], ["Sinä", "[Olen töissä kello viiteen asti.|Kello viiteen asti olen töissä.|Viiteen asti olen töissä.]", "Sag: Du arbeitest bis fünf Uhr."], ["Aino", "Nähdäänkö työn jälkeen?"], ["Sinä", "[Kyllä! Nähdään tunnin päästä.|Joo, nähdään tunnin päästä.|Nähdään tunnin kuluttua.]", "Sag ja: in einer Stunde."]] },
    { t: "sch", q: "Schreib, seit wann du Finnisch lernst und ob du schon in Finnland warst.", w: ["lähtien", "olen"], a: ["Olen opiskellut suomea vuodesta 2026 lähtien. Olen käynyt Suomessa kerran.", "Olen opiskellut suomea lokakuusta lähtien. En ole vielä käynyt Suomessa."], h: "zwei kurze Sätze im Perfekt" },
    { t: "sch", q: "Schreib, was du nach der Arbeit und vor dem Essen machst.", w: ["jälkeen", "ennen"], a: ["Työn jälkeen menen kauppaan. Ennen ruokaa luen kirjaa.", "Työn jälkeen menen kotiin. Ennen ruokaa käyn suihkussa."], h: "zwei kurze Sätze" }
  ]
};
