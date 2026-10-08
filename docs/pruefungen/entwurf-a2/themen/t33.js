module.exports = {
  id: "t33",
  title: "Verben mit festen Fällen (Rektion)",
  fi: "Minua kiinnostaa musiikki",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t31", "t32", "t31b"],
  th: `<p>Situation: über Interessen, Gefühle und Pläne sprechen – <i>Minua kiinnostaa …, Osallistun …, Kaipaan …, Luotan …</i>. Viele finnische Verben wollen einen <b>festen Fall</b>, oft einen anderen als im Deutschen. Diese Verben lernt man am besten mit ihrem Fall.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Minua kiinnostaa historia.</td><td>Mich interessiert Geschichte.</td></tr>
<tr><td>Olen kiinnostunut taiteesta.</td><td>Ich interessiere mich für Kunst.</td></tr>
<tr><td>Osallistun kurssiin.</td><td>Ich nehme am Kurs teil.</td></tr>
<tr><td>Huolehdin lapsista.</td><td>Ich kümmere mich um die Kinder.</td></tr>
<tr><td>Kaipaan sinua.</td><td>Ich vermisse dich.</td></tr>
<tr><td>Kiitän sinua avusta.</td><td>Ich danke dir für die Hilfe.</td></tr>
<tr><td>Se riippuu säästä.</td><td>Das hängt vom Wetter ab.</td></tr>
<tr><td>En uskalla uida avannossa.</td><td>Ich traue mich nicht, im Eisloch zu schwimmen.</td></tr>
</table>
<h3>Drei Gruppen</h3>
<table><tr><td>Fall</td><td>Verben</td></tr>
<tr><td>Teilungsform</td><td>rakastaa, odottaa, auttaa, ajatella, kaivata, ihailla, kiittää (+ -sta wofür), uskoa (jemandem glauben)</td></tr>
<tr><td>-sta / -stä</td><td>pitää, kiinnostua, huolehtia, valittaa, riippua, innostua, olla kiinnostunut</td></tr>
<tr><td>Wohin-Form</td><td>tutustua, osallistua, luottaa, keskittyä, väsyä, ihastua, uskoa (an etwas glauben), kuulua</td></tr></table>
<p class="rule"><b>kiinnostaa – kiinnostua:</b> <i>Minua kiinnostaa musiikki</i> (Musik interessiert mich: Sache = Subjekt, Person in der Teilungsform) – <i>Kiinnostuin musiikista</i> (ich begann mich für Musik zu interessieren: Person = Subjekt, Sache mit -sta). Zustand: <i>Olen kiinnostunut musiikista.</i>. <b>uskoa:</b> <i>Uskon sinua</i> (ich glaube dir) – <i>Uskon sinuun</i> (ich glaube an dich) – <i>Uskon, että …</i></p>
<h3>Wiederholung: das Objekt</h3>
<p class="rule">Bejaht und ganz → <b>-n</b> (Mehrzahl -t): <i>Avaan oven. Luen kirjan.</i> Verneint → immer <b>Teilungsform</b>: <i>En avaa ovea.</i> Unvollendet, Menge → Teilungsform: <i>Luen kirjaa. Juon kahvia.</i> Befehl → Grundform: <i>Avaa ovi!</i></p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mä tykkään susta.</i> (= Pidän sinusta.) · <i>Mua ei kiinnosta.</i> (= Minua ei kiinnosta.) · <i>Riippuu.</i> = Kommt drauf an.</p>`,
  v: [
    ["kiinnostaa", "interessieren (minua kiinnostaa …)"],
    ["kiinnostua", "Interesse bekommen, sich interessieren (+ -sta)"],
    ["kiinnostunut", "interessiert (olla kiinnostunut + -sta)"],
    ["osallistua", "teilnehmen (+ Wohin-Form)"],
    ["huolehtia", "sich kümmern (+ -sta; huolehdin)"],
    ["kaivata", "vermissen, sich sehnen (+ Teilungsform; kaipaan)"],
    ["kiittää", "danken (kiitän sinua + -sta)"],
    ["apu", "Hilfe (avun, avusta)"],
    ["uskoa", "glauben (+ Teilungsform: jemandem; + Wohin-Form: an etwas)"],
    ["toivoa", "hoffen, wünschen (toivon)"],
    ["ajatella", "denken (+ Teilungsform; ajattelen)"],
    ["ihailla", "bewundern (+ Teilungsform; ihailen)"],
    ["ihastua", "sich verlieben, begeistert sein (+ Wohin-Form)"],
    ["innostua", "sich begeistern (+ -sta)"],
    ["väsyä", "müde werden (+ Wohin-Form: einer Sache überdrüssig)"],
    ["valittaa", "sich beschweren, klagen (+ -sta; valitan)"],
    ["keskittyä", "sich konzentrieren (+ Wohin-Form; keskityn)"],
    ["riippua", "abhängen (+ -sta: riippuu säästä)"],
    ["uskaltaa", "sich trauen, wagen (+ Grundform; uskallan)"],
    ["kuulua", "gehören (zu) (+ Wohin-Form / -lle)"],
    ["historia", "Geschichte (Fach)"]
  ],
  ex: [
    { t: "tab", q: "Welcher Fall nach dem Verb?", h: "Jedes Kästchen: Teilungsform, -sta oder Wohin-Form", head: ["Verb", "Fall danach"], r: [["odottaa", "[Teilungsform|Partitiv]"], ["kiinnostua", "[-sta|-sta/-stä|Elativ]"], ["osallistua", "[Wohin-Form|Illativ]"], ["auttaa", "[Teilungsform|Partitiv]"], ["huolehtia", "[-sta|-sta/-stä|Elativ]"], ["luottaa", "[Wohin-Form|Illativ]"], ["kaivata", "[Teilungsform|Partitiv]"], ["keskittyä", "[Wohin-Form|Illativ]"]] },
    { t: "tab", q: "musiikki nach verschiedenen Verben", h: "Jedes Kästchen ein Wort: musiikki im Fall, den das Verb will", head: ["Verb", "musiikki"], r: [["Pidän …", "[musiikista]"], ["Rakastan …", "[musiikkia]"], ["Olen kiinnostunut …", "[musiikista]"], ["Keskityn …", "[musiikkiin]"], ["Kaipaan …", "[musiikkia]"], ["Minua kiinnostaa …", "[musiikki]"]], s: 1 },
    { t: "gap", q: "Odotan ___.", h: "bussi – odottaa will die Teilungsform", a: ["bussia"] },
    { t: "gap", q: "Huolehdin ___.", h: "lapset – huolehtia will -sta (Mehrzahl)", a: ["lapsista"], s: 1 },
    { t: "gap", q: "Osallistun ___.", h: "kokous – osallistua will die Wohin-Form", a: ["kokoukseen"], s: 1 },
    { t: "gap", q: "___ kiinnostaa historia.", h: "minä in der Teilungsform: Mich interessiert …", a: ["Minua"] },
    { t: "gap", q: "Kiitän sinua ___.", h: "apu + -sta: für die Hilfe (Stufenwechsel p → v)", a: ["avusta"], s: 1 },
    { t: "gap", q: "Se ___ säästä.", h: "riippua – Form für „se“: hängt ab", a: ["riippuu"] },
    { t: "gap", q: "En ___ uida avannossa.", h: "uskaltaa – verneint (Stufenwechsel lt → ll)", a: ["uskalla"], s: 1 },
    { t: "gap", q: "Kaipaan ___.", h: "koti in der Teilungsform: Ich vermisse mein Zuhause", a: ["kotia"] },
    { t: "tr", dir: "de", q: "Ich interessiere mich für Kunst.", a: ["Olen kiinnostunut taiteesta", "Minua kiinnostaa taide", "Taide kiinnostaa minua"] },
    { t: "tr", dir: "de", q: "Ich vermisse dich.", a: ["Kaipaan sinua", "Minä kaipaan sinua"] },
    { t: "tr", dir: "de", q: "Ich glaube dir.", a: ["Uskon sinua", "Minä uskon sinua"] },
    { t: "tr", dir: "fi", q: "Älä valita koko ajan!", a: ["Beschwer dich nicht ständig", "Beklag dich nicht die ganze Zeit", "Jammer nicht die ganze Zeit"] },
    { t: "tr", dir: "fi", q: "Hän ihastui suomalaiseen mieheen.", a: ["Sie hat sich in einen finnischen Mann verliebt", "Sie verliebte sich in einen finnischen Mann", "Er hat sich in einen finnischen Mann verliebt"] },
    { t: "ord", w: ["Keskityn", "nyt", "työhön"], a: ["Keskityn nyt työhön.", "Nyt keskityn työhön."], de: "Ich konzentriere mich jetzt auf die Arbeit." },
    { t: "ord", w: ["Minua", "ei", "kiinnosta", "jalkapallo"], a: ["Minua ei kiinnosta jalkapallo.", "Jalkapallo ei kiinnosta minua."], de: "Fußball interessiert mich nicht." },
    { t: "mc", q: "„Minua kiinnostaa musiikki.“ – „Olen kiinnostunut musiikista.“ Was stimmt?", o: ["kiinnostaa: Sache = Subjekt, Person in der Teilungsform; kiinnostunut: Person = Subjekt, Sache mit -sta", "Beide heißen „ich liebe Musik“.", "kiinnostaa ist die Vergangenheit.", "kiinnostunut will die Wohin-Form."], a: 0, x: "Wie „Musik interessiert mich“ – „ich interessiere mich für Musik“. Ebenso mit -sta: kiinnostua (Interesse bekommen): Kiinnostuin musiikista." },
    { t: "mc", q: "Welche Verben wollen die Wohin-Form?", o: ["tutustua, osallistua, luottaa, keskittyä", "odottaa, auttaa, rakastaa, kaivata", "pitää, huolehtia, kiinnostua, valittaa", "haluta, voida, osata, uskaltaa"], a: 0, x: "Wohin-Form: tutustua, osallistua, luottaa, keskittyä, väsyä, ihastua. -sta: pitää, huolehtia, kiinnostua, valittaa, riippua. Teilungsform: odottaa, auttaa, rakastaa, kaivata, ajatella." },
    { t: "mc", q: "„Uskon sinua.“ – „Uskon sinuun.“ Was ist der Unterschied?", o: ["Teilungsform: jemandem glauben; Wohin-Form: an etwas glauben", "Es gibt keinen.", "sinuun ist die Mehrzahl.", "„Uskon sinua“ ist falsch."], a: 0, x: "Uskon sinua = Ich glaube dir. Uskon sinuun = Ich glaube an dich. Uskon, että … = Ich glaube, dass …" },
    { t: "mc", q: "„En avaa ___.“ – welche Form?", o: ["ovea", "oven", "ovi", "ovesta"], a: 0, x: "Verneint immer Teilungsform: En avaa ovea. Bejaht und ganz: Avaan oven. Befehl: Avaa ovi!" },
    { t: "les", q: "Mikä minua kiinnostaa", txt: ["Minua kiinnostaa historia ja taide.", "Osallistun joka syksy taidekurssiin.", "Tänä vuonna tutustuin suomalaiseen kirjallisuuteen.", "Ihailen Tove Janssonia.", "Talvella kaipaan kesää ja aurinkoa."], qs: [{ q: "Was interessiert den Schreiber?", o: ["Geschichte und Kunst", "Sport", "Kochen"], a: 0 }, { q: "Wen bewundert er?", o: ["Tove Jansson", "Jean Sibelius", "seinen Lehrer"], a: 0 }, { q: "Was vermisst er im Winter?", o: ["den Sommer und die Sonne", "den Schnee", "die Arbeit"], a: 0 }] },
    { t: "les", q: "Aino huolehtii", txt: ["Aino huolehtii vanhasta äidistään.", "Hän käy äidin luona joka päivä.", "Äiti kiittää häntä aina avusta.", "Joskus Aino väsyy, mutta hän ei valita."], qs: [{ q: "Um wen kümmert sich Aino?", o: ["um ihre alte Mutter", "um Kinder", "um Tiere"], a: 0 }, { q: "Wie oft besucht sie sie?", o: ["jeden Tag", "jede Woche", "selten"], a: 0 }, { q: "Beschwert sich Aino?", o: ["nein", "ja, oft", "manchmal"], a: 0 }] },
    { t: "dlg", q: "Interessen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Mikä sinua kiinnostaa?"], ["Sinä", "[Minua kiinnostaa musiikki.|Musiikki kiinnostaa minua.|Olen kiinnostunut musiikista.]", "Sag: Musik."], ["Aino", "Osallistutko johonkin kurssiin?"], ["Sinä", "[Osallistun suomen kurssiin.|Osallistun suomen kurssille.]", "Sag: am Finnischkurs."], ["Aino", "Hienoa! Kaipaatko Itävaltaa?"], ["Sinä", "[Joskus kaipaan.|Kaipaan vähän.|Joskus kaipaan Itävaltaa.]", "Sag: manchmal."]] },
    { t: "dlg", q: "Danke!", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Naapuri", "Kiitos, että autoit minua!"], ["Sinä", "[Ole hyvä! Autan mielelläni.|Ei kestä!|Ole hyvä.]", "Antworte freundlich."], ["Naapuri", "Voinko luottaa sinuun huomennakin?"], ["Sinä", "[Totta kai voit luottaa minuun.|Voit luottaa minuun!|Totta kai.]", "Sag: Natürlich kann er sich auf dich verlassen."]] },
    { t: "sch", q: "Schreib, was dich interessiert und woran du teilnimmst.", w: ["kiinnostaa", "osallistun"], a: ["Minua kiinnostaa suomi. Osallistun suomen kurssiin.", "Minua kiinnostaa taide. Osallistun taidekurssiin."], h: "zwei kurze Sätze" },
    { t: "sch", q: "Schreib, wen oder was du vermisst.", w: ["kaipaan"], a: ["Kaipaan perhettäni.", "Kaipaan kesää ja aurinkoa."], h: "ein Satz – kaivata + Teilungsform" }
  ]
};
