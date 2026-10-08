module.exports = {
  id: "t32c",
  title: "Feinheiten: Genitiv Mehrzahl – talojen, lasten, ihmisten (32.3)",
  fi: "Lasten kanssa",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t31", "t32", "t21c", "t22c", "t28b"],
  th: `<p>Feinheiten zu t32: der <b>Genitiv Mehrzahl</b> – „der Häuser, der Kinder, der Menschen“. Er steht vor Postpositionen (<i>lasten kanssa</i>), als Besitz (<i>ihmisten koti</i>) und in zusammengesetzten Wörtern (<i>lastenhuone</i>).</p>
<h3>Bildung: von der Teilungsform Mehrzahl aus</h3>
<table><tr><td>Teilungsform Mz.</td><td>Genitiv Mz.</td><td>Regel</td></tr>
<tr><td>taloja, kauppoja</td><td>talojen, kauppojen</td><td>-ja → -jen</td></tr>
<tr><td>kaupunkeja</td><td>kaupunkien</td><td>-eja → -ien</td></tr>
<tr><td>ystäviä, vanhempia</td><td>ystävien, vanhempien</td><td>-iä/-ia → -ien</td></tr>
<tr><td>opiskelijoita, omenoita</td><td>opiskelijoiden, omenoiden</td><td>-ita → -iden (auch -itten)</td></tr>
<tr><td>ihmisiä, suomalaisia</td><td>ihmisten, suomalaisten</td><td>-nen → -sten</td></tr>
<tr><td>lapsia</td><td>lasten</td><td>unregelmäßig</td></tr></table>
<p class="rule">Faustregel: Endung der Teilungsform Mehrzahl <b>-a/-ä weg, -en dazu</b> (<i>taloja → talojen</i>); bei <b>-eja</b> wird es <b>-ien</b> (<i>kaupunkien</i>), bei <b>-ita</b> wird es <b>-iden</b>. Wörter auf <b>-nen</b> und <i>lapsi</i> bekommen <b>-ten</b>: <i>ihmisten, lasten</i>. Stufenwechsel wie in der Teilungsform: <i>kauppojen</i> (stark).</p>
<h3>Wo du ihn brauchst</h3>
<table><tr><td>Postposition</td><td>lasten kanssa, talojen välissä, ystävien luona</td></tr>
<tr><td>Besitz</td><td>opiskelijoiden kahvila, vanhempien talo</td></tr>
<tr><td>„aller“</td><td>kaikkien kanssa, kaikkien mielestä</td></tr>
<tr><td>Zusammensetzung</td><td>lastenhuone (Kinderzimmer), naistenhuone (Damentoilette)</td></tr></table>
<h3>So sagt man’s gesprochen</h3>
<p class="tip">Gesprochen oft die Form auf <b>-itten</b>: <i>omenoitten, perheitten</i> (auch geschrieben richtig). <i>kaikkien kaa</i> = kaikkien kanssa. Sehr häufig ist <i>niitten</i> (= niiden, „ihrer“ bei Dingen).</p>`,
  v: [
    ["lasten", "der Kinder (lasten kanssa)"],
    ["ihmisten", "der Menschen"],
    ["vanhempien", "der Eltern (vanhempien luona = bei den Eltern)"],
    ["ystävien", "der Freunde (ystävien kanssa)"],
    ["kaikkien", "aller (kaikkien kanssa = mit allen)"],
    ["lastenhuone", "Kinderzimmer"],
    ["viettää", "verbringen (vietän)"],
    ["naiset", "Frauen (naisten = der Frauen)"],
    ["miehet", "Männer (miesten = der Männer)"]
  ],
  ex: [
    { t: "tab", q: "Genitiv Mehrzahl", h: "Jedes Kästchen ein Wort: Genitiv Mehrzahl (der …)", head: ["Teilungsform Mz.", "Genitiv Mz."], r: [["taloja", "[talojen]"], ["kauppoja", "[kauppojen]"], ["ystäviä", "[ystävien]"], ["opiskelijoita", "[opiskelijoiden|opiskelijoitten]"], ["ihmisiä", "[ihmisten]"], ["lapsia", "[lasten]"]], s: 1 },
    { t: "gap", q: "Asun ___ kanssa.", h: "lapsi – Genitiv Mehrzahl (unregelmäßig)", a: ["lasten"] },
    { t: "gap", q: "Olen viikonlopun ___ luona.", h: "vanhemmat – Genitiv Mehrzahl", a: ["vanhempien"] },
    { t: "gap", q: "Puhun ___ kanssa suomea.", h: "ystävä – Genitiv Mehrzahl", a: ["ystävien"] },
    { t: "gap", q: "Hän puhuu ___ kanssa.", h: "kaikki – Genitiv Mehrzahl: mit allen", a: ["kaikkien"] },
    { t: "gap", q: "Tämä on ___ kahvila.", h: "opiskelija – Genitiv Mehrzahl: das Café der Studierenden", a: ["opiskelijoiden", "opiskelijoitten"] },
    { t: "gap", q: "Puisto on ___ välissä.", h: "talo – Genitiv Mehrzahl (zwischen den Häusern)", a: ["talojen"] },
    { t: "tr", dir: "de", q: "Ich spreche mit den Kindern Finnisch.", a: ["Puhun lasten kanssa suomea", "Puhun suomea lasten kanssa", "Minä puhun lasten kanssa suomea"] },
    { t: "tr", dir: "de", q: "Wo ist die Damentoilette?", a: ["Missä naistenhuone on", "Missä on naistenhuone"] },
    { t: "tr", dir: "fi", q: "Lastenhuone on pieni mutta valoisa.", a: ["Das Kinderzimmer ist klein, aber hell", "Das Kinderzimmer ist klein aber hell"] },
    { t: "tr", dir: "fi", q: "Suomalaisten mielestä sauna on tärkeä.", a: ["Nach Meinung der Finnen ist die Sauna wichtig", "Die Finnen finden die Sauna wichtig", "Für Finnen ist die Sauna wichtig"] },
    { t: "ord", w: ["Vietän", "joulun", "vanhempien", "luona"], a: ["Vietän joulun vanhempien luona.", "Joulun vietän vanhempien luona."], de: "Ich verbringe Weihnachten bei den Eltern." },
    { t: "mc", q: "Wie bildet man meist den Genitiv Mehrzahl?", o: ["Teilungsform Mehrzahl: -a/-ä weg, -en dazu (taloja → talojen)", "Grundform + -jen (ystäväjen)", "Genitiv Einzahl + -t (talont)", "-ssa + -en"], a: 0, x: "taloja → talojen, ystäviä → ystävien, opiskelijoita → opiskelijoiden. Besonders: ihmisten, lasten (-ten)." },
    { t: "mc", q: "Welche Form ist der Genitiv Mehrzahl von „lapsi“?", o: ["lasten", "lapsiden", "lapsojen", "lapsten"], a: 0, x: "lapsi ist unregelmäßig: lasten (der Kinder). Ebenso -nen-Wörter: ihmisten, suomalaisten." },
    { t: "mc", q: "Gesprochen: „Mä puhun kaikkien kaa.“ – geschrieben:", o: ["Puhun kaikkien kanssa.", "Puhun kaikille.", "Puhun kaikesta.", "Kaikki puhuvat."], a: 0, x: "kaa = kanssa (gesprochen)." },
    { t: "mc", q: "Gesprochen hört man „omenoitten“. Ist das richtig?", o: ["Ja, -itten ist eine zweite richtige Form neben -iden.", "Nein, nur in Dialekten.", "Nein, richtig ist omenojen.", "Nur bei Obst."], a: 0, x: "Bei -ita-Wörtern gibt es zwei Formen: omenoiden / omenoitten, opiskelijoiden / opiskelijoitten." },
    { t: "les", q: "Viikonloppu vanhempien luona", txt: ["Viikonloppuna olin vanhempien luona maaseudulla.", "Myös siskoni oli siellä lastensa kanssa.", "Lastenhuoneessa oli paljon leluja.", "Illalla söimme kaikkien kanssa yhdessä.", "Talojen välissä on iso puutarha."], qs: [{ q: "Wo war er am Wochenende?", o: ["bei den Eltern auf dem Land", "bei Freunden in der Stadt", "im Hotel"], a: 0 }, { q: "Wer war noch da?", o: ["seine Schwester mit ihren Kindern", "sein Chef", "niemand"], a: 0 }, { q: "Was war zwischen den Häusern?", o: ["ein großer Garten", "eine Straße", "ein See"], a: 0 }] },
    { t: "les", q: "Opiskelijoiden kahvila", txt: ["Yliopistossa on opiskelijoiden kahvila.", "Siellä kahvi on halpaa.", "Opettajien huoneet ovat ensimmäisessä kerroksessa.", "Naistenhuone ja miestenhuone ovat kahvilan vieressä."], qs: [{ q: "Wem gehört das Café?", o: ["es ist das Café der Studierenden", "den Lehrern", "einer Firma"], a: 0 }, { q: "Wo sind die Räume der Lehrenden?", o: ["im Erdgeschoss (1. kerros)", "neben dem Café", "im Keller"], a: 0 }, { q: "Wo sind die Toiletten?", o: ["neben dem Café", "im 2. kerros", "draußen"], a: 0 }] },
    { t: "dlg", q: "Weihnachten bei wem?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Kollega", "Missä vietät joulun?"], ["Sinä", "[Vanhempien luona.|Vietän joulun vanhempien luona.|Olen vanhempien luona.]", "Sag: bei den Eltern."], ["Kollega", "Tuleeko siskosi myös?"], ["Sinä", "[Tulee, lasten kanssa.|Tulee, ja lapset myös.|Tulee lasten kanssa.]", "Sag ja – mit den Kindern."]] },
    { t: "dlg", q: "Mit wem sprichst du Finnisch?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Kenen kanssa puhut suomea?"], ["Sinä", "[Ystävien kanssa.|Puhun suomea ystävien kanssa.|Kaikkien kanssa!]", "Sag: mit Freunden."], ["Aino", "Hienoa! Entä töissä?"], ["Sinä", "[Töissä puhun saksaa kaikkien kanssa.|Töissä puhun saksaa.]", "Sag: In der Arbeit sprichst du mit allen Deutsch."]] },
    { t: "sch", q: "Schreib, mit wem du am Wochenende Zeit verbringst (Genitiv Mehrzahl + kanssa).", w: ["kanssa"], a: ["Viikonloppuna olen ystävien kanssa.", "Viikonloppuna olen vanhempien ja lasten kanssa."], h: "ein Satz" },
    { t: "sch", q: "Schreib, wo du Weihnachten verbringst.", w: ["luona"], a: ["Vietän joulun vanhempien luona.", "Jouluna olen ystävien luona."], h: "ein Satz mit „luona“" }
  ]
};
