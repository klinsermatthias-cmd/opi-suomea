module.exports = {
  id: "t34c",
  title: "Feinheiten: Meinung & Ratschlag – mielestäni, kannattaa, pitäisi (34.3)",
  fi: "Olen samaa mieltä",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t31", "t32", "t33", "t34", "t34b"],
  th: `<p>Feinheiten zu t34: die eigene <b>Meinung</b> sagen, zustimmen und widersprechen, <b>Rat geben</b> und ausdrücken, wie <b>sicher</b> man ist. Dazu zwei Redewendungen, die man in Finnland ständig hört.</p>
<h3>Meinung</h3><table>
<tr><td>Mitä mieltä olet tästä?</td><td>Was hältst du davon?</td></tr>
<tr><td>Minun mielestäni se on hyvä.</td><td>Meiner Meinung nach ist es gut.</td></tr>
<tr><td>Olen samaa mieltä (kanssasi).</td><td>Ich bin derselben Meinung (wie du).</td></tr>
<tr><td>Olen eri mieltä.</td><td>Ich bin anderer Meinung.</td></tr>
<tr><td>Olet oikeassa. – Olet väärässä.</td><td>Du hast recht. – Du irrst dich.</td></tr>
</table>
<p class="rule"><b>mielestä + Possessivsuffix:</b> <i>(minun) mielestäni, (sinun) mielestäsi, hänen mielestään</i>; bei Namen und Hauptwörtern ohne Suffix: <i>Ainon mielestä, suomalaisten mielestä</i>. Gleichbedeutend und kürzer: <i>minusta, sinusta</i> (t16d). Worüber: <b>-sta</b>: <i>Mitä mieltä olet elokuvasta?</i></p>
<h3>Rat geben</h3>
<table><tr><td>Sinun kannattaa levätä.</td><td>Es lohnt sich, dass du dich ausruhst. / Ruh dich am besten aus.</td></tr>
<tr><td>Sinun pitäisi levätä.</td><td>Du solltest dich ausruhen.</td></tr>
<tr><td>Ei kannata mennä autolla.</td><td>Es lohnt sich nicht, mit dem Auto zu fahren.</td></tr></table>
<p class="rule">Bei <i>kannattaa</i> und <i>pitäisi</i> steht die Person im <b>Genitiv</b> (<i>minun, sinun, Ainon</i>), dann die <b>Grundform</b> – wie bei <i>täytyy</i>. <i>pitäisi</i> ist der Konditional von <i>pitää</i> (t27).</p>
<h3>Wie sicher?</h3>
<p class="rule"><i>Olen varma, että …</i> (Ich bin sicher, dass …) – <i>En ole varma.</i> – <i>Hän tulee varmasti.</i> (bestimmt) – <i>Hän tulee luultavasti.</i> (wahrscheinlich) – <i>Ehkä.</i> (vielleicht)</p>
<h3>Redewendungen</h3>
<p class="rule"><i>Ota rennosti!</i> = Nimm’s locker! · <i>Pidän sinulle peukkuja!</i> = Ich drücke dir die Daumen! (wörtlich: Ich halte dir die Daumen.)</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Musta toi on hyvä.</i> (= Minusta tuo on hyvä.) · <i>Mitä mieltä sä oot?</i> · <i>Sun kannattaa …</i> (= Sinun kannattaa …) · <i>Ota iisisti!</i> (= Ota rennosti!) · <i>Peukut pystyyn!</i> (Daumen hoch!)</p>`,
  v: [
    ["mielestäni", "meiner Meinung nach (sinun mielestäsi, hänen mielestään)"],
    ["Mitä mieltä olet?", "Was meinst du? Was hältst du davon?"],
    ["olla samaa mieltä", "derselben Meinung sein (+ kanssa)"],
    ["olla eri mieltä", "anderer Meinung sein"],
    ["olla oikeassa", "recht haben"],
    ["olla väärässä", "sich irren, unrecht haben"],
    ["varma", "sicher (olen varma, että …; varmasti = bestimmt)"],
    ["luultavasti", "wahrscheinlich"],
    ["kannattaa", "sich lohnen (sinun kannattaa + Grundform)"],
    ["pitäisi", "sollte (minun pitäisi + Grundform)"],
    ["ottaa rennosti", "es locker nehmen (ota rennosti!)"],
    ["pitää peukkuja", "die Daumen drücken (+ -lle)"]
  ],
  ex: [
    { t: "tab", q: "mielestä + Suffix", h: "Jedes Kästchen ein Wort: mielestä + Possessivsuffix (bei einem Namen ohne Suffix)", head: ["Person", "nach Meinung von …"], r: [["minun …", "[mielestäni]"], ["sinun …", "[mielestäsi]"], ["hänen …", "[mielestään]"], ["meidän …", "[mielestämme]"], ["Ainon …", "[mielestä]"]], s: 1 },
    { t: "tab", q: "Meinung, Rat, Sicherheit", h: "Jedes Kästchen ein ganzer Satz auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["Du solltest dich ausruhen.", "[Sinun pitäisi levätä.]"], ["Ich bin sicher.", "[Olen varma.]"], ["Ich bin nicht sicher.", "[En ole varma.]"], ["Du hast recht.", "[Olet oikeassa.]"], ["Ich bin anderer Meinung.", "[Olen eri mieltä.]"]] },
    { t: "gap", q: "Minun ___ suomi on kaunis kieli.", h: "mielestä + Suffix für „minä“", a: ["mielestäni"], s: 1 },
    { t: "gap", q: "Olen ___ mieltä kanssasi.", h: "derselben Meinung", a: ["samaa"] },
    { t: "gap", q: "Sinun ___ levätä.", h: "pitää – Konditional: du solltest", a: ["pitäisi"], s: 1 },
    { t: "gap", q: "Ei ___ mennä autolla.", h: "kannattaa – verneint: es lohnt sich nicht", a: ["kannata"], s: 1 },
    { t: "gap", q: "En ole ___.", h: "sicher", a: ["varma"] },
    { t: "gap", q: "Hän tulee ___ huomenna.", h: "wahrscheinlich", a: ["luultavasti"] },
    { t: "gap", q: "Olet ___!", h: "oikea – Wo-Form: Du hast recht!", a: ["oikeassa"] },
    { t: "tr", dir: "de", q: "Was meinst du dazu?", a: ["Mitä mieltä olet", "Mitä mieltä sinä olet", "Mitä ajattelet"] },
    { t: "tr", dir: "de", q: "Nimm’s locker!", a: ["Ota rennosti", "Ota iisisti"] },
    { t: "tr", dir: "fi", q: "Pidän sinulle peukkuja!", a: ["Ich drücke dir die Daumen"] },
    { t: "tr", dir: "fi", q: "Musta toi on tosi kiva.", a: ["Ich finde das wirklich schön", "Ich finde das sehr nett", "Ich finde das echt toll"] },
    { t: "ord", w: ["Minun", "mielestäni", "se", "on", "totta"], a: ["Minun mielestäni se on totta.", "Se on minun mielestäni totta."], de: "Meiner Meinung nach ist das wahr." },
    { t: "mc", q: "Ein Freund hat morgen eine Prüfung. Was sagst du?", o: ["Pidän sinulle peukkuja!", "Olen väärässä.", "Ei kannata.", "Olen eri mieltä."], a: 0 },
    { t: "mc", q: "Wie sagt man „meiner Meinung nach“?", o: ["(minun) mielestäni – mielestä + Suffix", "minun mieleni", "minulla on mieltä", "mielessäni"], a: 0, x: "mielestä + Possessivsuffix: mielestäni, mielestäsi, hänen mielestään. Bei Namen ohne Suffix: Ainon mielestä. Gleichbedeutend: minusta." },
    { t: "mc", q: "„Sinun kannattaa levätä.“ – „Sinun pitäisi levätä.“ Was ist der Unterschied?", o: ["kannattaa: es lohnt sich, ist klug; pitäisi: du solltest", "Es gibt keinen Unterschied.", "kannattaa ist die Vergangenheit.", "pitäisi heißt „du musst sofort“."], a: 0, x: "Beide: Person im Genitiv (sinun) + Grundform. kannattaa = es lohnt sich: Kannattaa ostaa liput netistä. pitäisi (Konditional von pitää) = sollte: Minun pitäisi liikkua enemmän." },
    { t: "mc", q: "Gesprochen: „Ota iisisti!“ – geschrieben:", o: ["Ota rennosti!", "Ota se!", "Ole hiljaa!", "Odota!"], a: 0, x: "iisisti (vom englischen easy) = rennosti, nur gesprochen." },
    { t: "les", q: "Mitä mieltä olet?", txt: ["Aino: Minun mielestäni Helsinki on kaunis kaupunki.", "Ville: Olen samaa mieltä, mutta se on kallis.", "Aino: Olet oikeassa. Asuminen on kallista.", "Ville: Sinun kannattaa asua pienemmässä kaupungissa.", "Aino: En ole varma. Luultavasti jään Helsinkiin."], qs: [{ q: "Was findet Aino?", o: ["Helsinki ist eine schöne Stadt.", "Helsinki ist zu groß.", "Helsinki ist billig."], a: 0 }, { q: "Was rät Ville?", o: ["in einer kleineren Stadt zu wohnen", "nach Österreich zu ziehen", "ein Auto zu kaufen"], a: 0 }, { q: "Was macht Aino wahrscheinlich?", o: ["Sie bleibt in Helsinki.", "Sie zieht weg.", "Sie kauft eine Wohnung."], a: 0 }] },
    { t: "les", q: "Ensimmäinen talvi Suomessa", txt: ["Kun tulet Suomeen, sinun kannattaa ostaa hyvät kengät.", "Talvella sinun pitäisi pukeutua lämpimästi.", "Saunaan kannattaa mennä usein.", "Älä ole huolissasi, jos suomalaiset ovat hiljaa.", "Ota rennosti – kaikki menee varmasti hyvin!"], qs: [{ q: "Was soll man kaufen?", o: ["gute Schuhe", "ein Auto", "eine Sauna"], a: 0 }, { q: "Was soll man im Winter tun?", o: ["sich warm anziehen", "zu Hause bleiben", "viel Kaffee trinken"], a: 0 }, { q: "Was gilt, wenn Finnen still sind?", o: ["Man muss sich keine Sorgen machen.", "Man soll viel reden.", "Man soll weggehen."], a: 0 }] },
    { t: "dlg", q: "Aino fragt nach deiner Meinung", h: "Deine Zeilen auf Finnisch schreiben (Schriftsprache) – Aino spricht umgangssprachlich", r: [["Aino", "Mitä mieltä sä oot tästä kahvilasta?"], ["Sinä", "[Minun mielestäni se on tosi kiva.|Mielestäni se on kiva.|Minusta se on kiva.]", "Sag: Du findest es sehr nett."], ["Aino", "Mä oon samaa mieltä! Mut kahvi on kallista."], ["Sinä", "[Olet oikeassa.|Olet oikeassa, se on kallista.|Totta.]", "Sag: Sie hat recht."]] },
    { t: "dlg", q: "Rat geben", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Kollega", "Olen tosi väsynyt, ja minulla on paljon stressiä."], ["Sinä", "[Sinun pitäisi levätä.|Sinun kannattaa levätä.|Ota rennosti!]", "Gib einen Rat: Er sollte sich ausruhen."], ["Kollega", "Huomenna on tärkeä kokous."], ["Sinä", "[Pidän sinulle peukkuja!|Pidän peukkuja!|Kaikki menee varmasti hyvin!]", "Sag, dass du ihm die Daumen drückst."]] },
    { t: "sch", q: "Schreib deine Meinung über Finnland (mielestäni …).", w: ["mielestäni"], a: ["Minun mielestäni Suomi on kaunis maa.", "Mielestäni suomalaiset ovat ystävällisiä."], h: "ein Satz" },
    { t: "sch", q: "Gib einem Freund einen Rat (kannattaa oder pitäisi).", w: ["sinun"], a: ["Sinun kannattaa opiskella suomea joka päivä.", "Sinun pitäisi nukkua enemmän."], h: "ein Satz – Genitiv + kannattaa/pitäisi + Grundform" }
  ]
};
