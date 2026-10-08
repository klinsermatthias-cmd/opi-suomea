module.exports = {
  id: "t20b",
  title: "Arbeitsalltag: Schicht, Pause, krank melden (20.2)",
  fi: "Olen sairaana",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20"],
  th: `<p>Vertiefung zu t20: der Arbeitsalltag – Schichten, Pausen, Arbeitszeit, Urlaub, sich krank melden und Arbeit suchen.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Minulla on huomenna aamuvuoro.</td><td>Morgen habe ich Frühschicht.</td></tr>
<tr><td>Olen tällä viikolla iltavuorossa.</td><td>Diese Woche bin ich in der Spätschicht.</td></tr>
<tr><td>Pidän tauon kello kaksitoista.</td><td>Ich mache um zwölf Pause.</td></tr>
<tr><td>Olen sairaana. En voi tulla töihin.</td><td>Ich bin krank. Ich kann nicht zur Arbeit kommen.</td></tr>
<tr><td>Hän on sairaslomalla.</td><td>Er/Sie ist im Krankenstand.</td></tr>
<tr><td>Työaika on neljäkymmentä tuntia viikossa.</td><td>Die Arbeitszeit ist 40 Stunden pro Woche.</td></tr>
<tr><td>Hän on työtön ja hakee töitä.</td><td>Er/Sie ist arbeitslos und sucht Arbeit.</td></tr>
<tr><td>Hoidan sen!</td><td>Ich erledige das!</td></tr>
</table>
<h3>Wo bin ich gerade? Zustände in der Arbeit</h3>
<table><tr><td>Zustand</td><td>Form</td><td>Beispiel</td></tr>
<tr><td>krank (vorübergehend)</td><td>Essiv -na</td><td>Olen sairaana.</td></tr>
<tr><td>Urlaub, Pension, Krankenstand</td><td>-lla / -llä</td><td>lomalla, kesälomalla, eläkkeellä, sairaslomalla</td></tr>
<tr><td>Schicht</td><td>-ssa / -ssä</td><td>aamuvuorossa, iltavuorossa</td></tr>
<tr><td>in der Arbeit</td><td>(feste Form)</td><td>töissä – töihin – töistä</td></tr></table>
<p class="rule">Der Essiv (-na/-nä, aus t20) zeigt einen <b>Zustand für eine Zeit</b>: <i>Olen sairaana</i> = ich bin (gerade) krank. <i>Olen sairas</i> ist auch richtig. Haben: <i>Minulla on aamuvuoro</i> – sein: <i>Olen aamuvuorossa</i>.</p>
<h3>Wie lange? pro Tag, pro Woche</h3>
<p class="rule">Zahl + Teilungsform + <b>-ssa</b> = „pro“: <i>kahdeksan tuntia päivässä</i>, <i>neljäkymmentä tuntia viikossa</i> (wie <i>kolme kertaa viikossa</i> aus 8.4).</p>
<h3>hakea, hoitaa, pitää tauko</h3>
<table><tr><td>Person</td><td>hakea</td><td>hoitaa</td></tr>
<tr><td>minä</td><td>haen</td><td>hoidan</td></tr><tr><td>sinä</td><td>haet</td><td>hoidat</td></tr><tr><td>hän</td><td>hakee</td><td>hoitaa</td></tr>
<tr><td>me</td><td>haemme</td><td>hoidamme</td></tr><tr><td>te</td><td>haette</td><td>hoidatte</td></tr><tr><td>he</td><td>hakevat</td><td>hoitavat</td></tr></table>
<p class="rule">Stufenwechsel: <b>k → –</b> (hakea → haen), <b>t → d</b> (hoitaa → hoidan). <i>hakea töitä</i> = Arbeit suchen (Partitiv, die Suche ist offen); <i>hakea</i> heißt auch „abholen“: <i>Haen lapsen koulusta.</i></p>
<p class="rule"><i>pitää tauko</i> = Pause machen: <i>Pidän tauon.</i> (Objekt mit -n, Stufenwechsel tauko → tauon; pitää → pidän)</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mä oon kipeenä</i> (= Olen sairaana; <i>kipeä</i> = krank, wund) · <i>Mul on aamuvuoro.</i> · <i>Mä pidän tauon.</i> Die kurze Pause in der Arbeit heißt meist <i>kahvitauko</i>.</p>
<p class="tip"><b>Kulttuuri:</b> Bei Krankheit meldet man sich am Morgen bei der/dem Vorgesetzten. Für ein paar Tage reicht oft die eigene Meldung, für längere Zeit braucht man eine ärztliche Bestätigung (<i>lääkärintodistus</i>).</p>`,
  v: [
    ["työvuoro", "Schicht, Arbeitsschicht"],
    ["aamuvuoro", "Frühschicht"],
    ["iltavuoro", "Spätschicht"],
    ["tauko", "Pause (tauon)"],
    ["ruokatauko", "Mittagspause, Essenspause"],
    ["olla sairaana", "(gerade) krank sein"],
    ["sairaslomalla", "im Krankenstand"],
    ["tehtävä", "Aufgabe"],
    ["hoitaa", "erledigen, sich kümmern um (hoidan)"],
    ["asiakas", "Kunde, Kundin (asiakkaan)"],
    ["työkaveri", "Arbeitskollege, -kollegin"],
    ["työaika", "Arbeitszeit"],
    ["osa-aikainen", "Teilzeit-"],
    ["kokoaikainen", "Vollzeit-"],
    ["työtön", "arbeitslos"],
    ["työhaastattelu", "Vorstellungsgespräch"],
    ["hakea", "suchen, sich bewerben; abholen (haen)"],
    ["hakea töitä", "Arbeit suchen"],
    ["viikko", "Woche"],
    ["tällä viikolla", "diese Woche"]
  ],
  ex: [
    { t: "tab", q: "Wo bin ich gerade?", h: "Jedes Kästchen ein Wort: krank → Essiv -na, Urlaub → -lla, Schicht → -ssa", head: ["Wort", "Form"], r: [["sairas", "[sairaana]"], ["loma", "[lomalla]"], ["sairasloma", "[sairaslomalla]"], ["aamuvuoro", "[aamuvuorossa]"], ["iltavuoro", "[iltavuorossa]"], ["kesäloma", "[kesälomalla]"]], s: 1 },
    { t: "tab", q: "hakea und hoitaa", h: "Jedes Kästchen eine eigene Form: links hakea, rechts hoitaa – z. B. minä | haen | hoidan", head: ["Person", "hakea", "hoitaa"], r: [["minä", "[haen]", "[hoidan]"], ["sinä", "[haet]", "[hoidat]"], ["hän", "[hakee]", "[hoitaa]"], ["me", "[haemme]", "[hoidamme]"], ["te", "[haette]", "[hoidatte]"], ["he", "[hakevat]", "[hoitavat]"]] },
    { t: "gap", q: "Olen tänään ___. En voi tulla töihin.", h: "sairas im Essiv: (gerade) krank", a: ["sairaana"] },
    { t: "gap", q: "Minulla on huomenna ___.", h: "Frühschicht – ein Wort", a: ["aamuvuoro"] },
    { t: "gap", q: "Hän on tällä viikolla ___.", h: "Spätschicht + -ssa – ein Wort", a: ["iltavuorossa"] },
    { t: "gap", q: "Työaika on kahdeksan ___ päivässä.", h: "tunti in der Teilungsform (nach einer Zahl)", a: ["tuntia"] },
    { t: "gap", q: "Pidän ___ kello kaksitoista.", h: "tauko als Objekt mit -n (Stufenwechsel)", a: ["tauon"] },
    { t: "gap", q: "Hän ___ töitä.", h: "hakea – Form für „hän“", a: ["hakee"] },
    { t: "gap", q: "Selvä, minä ___ sen!", h: "hoitaa – Form für „minä“ (Stufenwechsel t → d)", a: ["hoidan"] },
    { t: "tr", dir: "de", q: "Ich bin heute krank. Ich kann nicht zur Arbeit kommen.", a: ["Olen tänään sairaana. En voi tulla töihin", "Olen sairaana tänään. En voi tulla töihin", "Tänään olen sairaana. En voi tulla töihin", "Olen tänään sairas. En voi tulla töihin", "Olen tänään sairaana enkä voi tulla töihin"] },
    { t: "tr", dir: "de", q: "Ich habe eine Teilzeitarbeit.", a: ["Minulla on osa-aikainen työ", "Teen osa-aikaista työtä", "Minulla on osa-aikatyö"] },
    { t: "tr", dir: "de", q: "Er ist arbeitslos und sucht Arbeit.", a: ["Hän on työtön ja hakee töitä", "Hän on työtön ja hän hakee töitä", "Hän on työtön ja hakee työtä", "Hän on työtön ja etsii töitä", "Hän on työtön ja etsii työtä"] },
    { t: "tr", dir: "fi", q: "Asiakas odottaa kassalla.", a: ["Der Kunde wartet an der Kasse", "Die Kundin wartet an der Kasse", "Ein Kunde wartet an der Kasse", "Eine Kundin wartet an der Kasse"] },
    { t: "tr", dir: "fi", q: "Tämä tehtävä on helppo.", a: ["Diese Aufgabe ist leicht", "Diese Aufgabe ist einfach", "Die Aufgabe ist leicht", "Die Aufgabe ist einfach"] },
    { t: "ord", w: ["Työkaveri", "on", "tänään", "sairaslomalla"], a: ["Työkaveri on tänään sairaslomalla.", "Työkaveri on sairaslomalla tänään.", "Tänään työkaveri on sairaslomalla."], de: "Der Arbeitskollege ist heute im Krankenstand." },
    { t: "ord", w: ["Minulla", "on", "huomenna", "iltavuoro"], a: ["Minulla on huomenna iltavuoro.", "Huomenna minulla on iltavuoro."], de: "Morgen habe ich Spätschicht." },
    { t: "mc", q: "Du bist krank und rufst am Morgen den Chef an. Was sagst du?", o: ["Olen sairaana, en voi tulla tänään.", "Olen lomalla, hyvää päivää.", "Minulla on aamuvuoro, kiitos.", "Parane pian!"], a: 0 },
    { t: "mc", q: "„tauko“ heißt:", o: ["Pause", "Schicht", "Aufgabe", "Kunde"], a: 0 },
    { t: "mc", q: "„Olen sairaana.“ – Warum -na?", o: ["Essiv: ein Zustand für eine Zeit (gerade krank)", "Translativ: man wird krank", "Teilungsform nach olla", "Ort: im Krankenhaus"], a: 0, x: "Der Essiv -na/-nä zeigt einen vorübergehenden Zustand: Olen sairaana. Auch richtig: Olen sairas." },
    { t: "mc", q: "Welche Endung haben Urlaub, Pension und Krankenstand?", o: ["-lla/-llä: lomalla, eläkkeellä, sairaslomalla", "-ssa: lomassa, eläkkeessä", "-na: lomana, eläkkeenä", "-ksi: lomaksi, eläkkeeksi"], a: 0, x: "Wie „auf Urlaub“: lomalla, kesälomalla, eläkkeellä, sairaslomalla. Schichten aber mit -ssa: aamuvuorossa, iltavuorossa." },
    { t: "mc", q: "Warum heißt es „hakea töitä“ (Teilungsform)?", o: ["Die Suche ist offen, es gibt kein festes Ergebnis.", "töitä ist Mehrzahl, darum immer Teilungsform.", "Nach hakea steht immer -sta.", "Weil der Satz verneint ist."], a: 0, x: "Tätigkeit ohne festes Ergebnis → Teilungsform: hakea töitä, odottaa bussia. Mit Ergebnis -n: Haen lapsen koulusta. (Ich hole das Kind von der Schule ab.)" },
    { t: "les", q: "Sannan työviikko", txt: ["Sanna on sairaanhoitaja.", "Maanantaina ja tiistaina hänellä on aamuvuoro.", "Aamuvuoro alkaa kello seitsemän ja loppuu kello kolme.", "Keskiviikkona hän on iltavuorossa.", "Torstaina hän on vapaa.", "Perjantaina hän on lomalla – hän matkustaa Helsinkiin."], qs: [{ q: "Wann beginnt die Frühschicht?", o: ["um sieben Uhr", "um drei Uhr", "um acht Uhr"], a: 0 }, { q: "Was hat Sanna am Mittwoch?", o: ["Spätschicht", "frei", "Urlaub"], a: 0 }, { q: "Wann hat Sanna frei?", o: ["am Donnerstag", "am Montag", "am Mittwoch"], a: 0 }] },
    { t: "les", q: "Työhaastattelu", txt: ["Pomo: Hei ja tervetuloa!", "Matthias: Kiitos! Onko tämä työ kokoaikainen?", "Pomo: Ei. Se on osa-aikainen. Työaika on kaksikymmentä tuntia viikossa.", "Matthias: Selvä. Milloin työpäivä alkaa?", "Pomo: Kello yhdeksän. Ruokatauko on kello kaksitoista.", "Matthias: Mitä minä teen täällä?", "Pomo: Olet myyjänä ja usein kassalla."], qs: [{ q: "Ist die Arbeit Vollzeit?", o: ["Nein, Teilzeit.", "Ja, Vollzeit.", "Das sagt der Chef nicht."], a: 0 }, { q: "Wie viele Stunden pro Woche?", o: ["20", "40", "12"], a: 0 }, { q: "Wann ist Mittagspause?", o: ["um zwölf", "um neun", "um eins"], a: 0 }] },
    { t: "dlg", q: "Sich krank melden", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Pomo", "Hei, Matthias! Mitä kuuluu?"], ["Sinä", "[Huonosti. Olen sairaana.|Ei hyvin, olen sairaana.|Olen sairaana.|Huonosti, olen sairas.]", "Sag, dass es dir schlecht geht: Du bist krank."], ["Pomo", "Voi voi! Onko sinulla kuumetta?"], ["Sinä", "[On, minulla on kuumetta.|On.|Kyllä, minulla on kuumetta.]", "Sag ja, du hast Fieber."], ["Pomo", "Selvä. Lepää nyt!"], ["Sinä", "[Kiitos. En voi tulla huomenna töihin.|Kiitos, en tule huomenna töihin.|Kiitos. Huomenna en voi tulla töihin.]", "Bedanke dich und sag, dass du morgen nicht zur Arbeit kommen kannst."], ["Pomo", "Ei se mitään. Parane pian!"]] },
    { t: "dlg", q: "Schicht tauschen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Työkaveri", "Hei! Onko sinulla lauantaina vapaata?"], ["Sinä", "[On, olen lauantaina vapaa.|On, lauantaina olen vapaa.|Joo, olen vapaa.|On.]", "Sag ja, am Samstag hast du frei."], ["Työkaveri", "Voitko olla lauantaina aamuvuorossa?"], ["Sinä", "[Voin. Milloin se alkaa?|Voin, milloin aamuvuoro alkaa?|Kyllä. Milloin se alkaa?]", "Sag ja und frag, wann sie beginnt."], ["Työkaveri", "Kello kuusi. Kiitos paljon!"], ["Sinä", "[Ei kestä!|Ei kestä.]", "Antworte: gern geschehen."]] },
    { t: "sch", q: "Schreib deinem Chef: Du bist krank und kommst heute nicht zur Arbeit.", w: ["sairaana", "töihin"], a: ["Olen sairaana. En tule tänään töihin.", "Olen tänään sairaana enkä voi tulla töihin.", "Olen sairaana, en voi tulla tänään töihin."], h: "ein oder zwei kurze Sätze auf Finnisch" },
    { t: "sch", q: "Schreib, wie viele Stunden du pro Woche arbeitest und ob die Arbeit Voll- oder Teilzeit ist.", w: ["viikossa", "kokoaikainen"], a: ["Teen töitä neljäkymmentä tuntia viikossa. Työ on kokoaikainen.", "Työskentelen neljäkymmentä tuntia viikossa. Minulla on kokoaikainen työ."], h: "zwei kurze Sätze, Zahlen als Wörter" },
    { t: "sch", q: "Schreib, dass Aino arbeitslos ist, Arbeit sucht und morgen ein Vorstellungsgespräch hat.", w: ["työtön", "työhaastattelu"], a: ["Aino on työtön ja hakee töitä. Hänellä on huomenna työhaastattelu.", "Aino on työtön. Hän hakee töitä ja hänellä on huomenna työhaastattelu."], h: "ein oder zwei Sätze auf Finnisch" }
  ]
};
