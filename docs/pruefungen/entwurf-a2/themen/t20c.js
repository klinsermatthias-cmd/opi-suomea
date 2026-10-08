module.exports = {
  id: "t20c",
  title: "Feinheiten: Minusta tulee …, lapsena, viikoksi (20.3)",
  fi: "Mikä sinusta tulee isona?",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t19b", "t20b"],
  th: `<p>Feinheiten zu t20: wie man auf Finnisch <b>„werden“</b> sagt, und Essiv und Translativ bei <b>Zeitangaben</b>.</p>
<h3>„werden“ – zwei Wege</h3>
<table><tr><td>Beruf, Rolle: <b>Person + -sta + tulla</b></td><td>Minusta tulee opettaja. (Ich werde Lehrer.) · Hänestä tuli lääkäri. (Er/Sie wurde Arzt/Ärztin.)</td></tr>
<tr><td>Eigenschaft, Zustand: <b>muuttua / tulla + -ksi</b></td><td>Sää muuttuu kylmäksi. (Das Wetter wird kalt.)</td></tr></table>
<p class="rule">Wörtlich: „Aus mir kommt ein Lehrer.“ Die Person steht mit <b>-sta</b> (minusta, sinusta, hänestä, meistä, teistä, heistä – aus 16.4), der Beruf in der Grundform. <i>tulla</i> steht immer in der <i>se</i>-Form: <i>minusta tulee</i>, Vergangenheit <i>minusta tuli</i>.</p>
<p class="rule">Andere „werden“-Verben: <i>sairastua</i> = krank werden (sairastuin = ich wurde krank), <i>valmistua</i> = fertig werden, den Abschluss machen (valmistun lääkäriksi = ich schließe als Arzt ab).</p>
<h3>Wann? Essiv – für wie lange? Translativ</h3>
<table><tr><td>Essiv (wann? in welcher Zeit des Lebens?)</td><td>Translativ (für wie lange? für wann?)</td></tr>
<tr><td>lapsena (als Kind), aikuisena (als Erwachsene/r)</td><td>viikoksi (für eine Woche), kahdeksi viikoksi</td></tr>
<tr><td>jouluna (zu Weihnachten), maanantaina</td><td>jouluksi (für Weihnachten, bis Weihnachten)</td></tr>
<tr><td>tänä vuonna (dieses Jahr), viime vuonna</td><td>Mitä haluat joululahjaksi? (als Weihnachtsgeschenk)</td></tr></table>
<p class="rule"><i>Jouluna olen Suomessa.</i> = Zu Weihnachten bin ich in Finnland. <i>Menen Suomeen viikoksi.</i> = Ich fahre für eine Woche nach Finnland (geplante Dauer). <i>Tulen kotiin jouluksi.</i> = Ich komme über Weihnachten nach Hause (rechtzeitig zum Fest).</p>
<p class="tip">Die Kinderfrage schlechthin: <i>Mikä sinusta tulee isona?</i> = Was willst du werden, wenn du groß bist?</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>duuni</i> = Arbeit, Job (<i>Mä oon duunissa</i> = Olen töissä) · <i>duunata</i> = arbeiten; machen · <i>Musta tulee kokki</i> = Minusta tulee kokki (Achtung: geschrieben heißt <i>musta</i> „schwarz“) · <i>Mitä sä teet duuniks?</i> = Mitä teet työksesi?</p>`,
  v: [
    ["muuttua", "sich verändern; werden zu (+ -ksi: muuttuu kylmäksi)"],
    ["minusta tulee", "ich werde … (minusta tulee opettaja)"],
    ["lapsena", "als Kind"],
    ["aikuisena", "als Erwachsene/r"],
    ["isona", "als Große/r, wenn man groß ist (Mikä sinusta tulee isona?)"],
    ["valmistua", "fertig werden, den Abschluss machen (valmistun)"],
    ["sairastua", "krank werden (sairastun)"],
    ["jouluksi", "über Weihnachten, rechtzeitig zu Weihnachten"],
    ["viikoksi", "für eine Woche"],
    ["tänä vuonna", "dieses Jahr"],
    ["duuni", "Job, Arbeit (umgangssprachlich)"],
    ["duunata", "arbeiten; machen (umgangssprachlich)"]
  ],
  ex: [
    { t: "tab", q: "Aus mir wird … (tulla + -sta)", h: "Jedes Kästchen zwei Wörter: Pronomen mit -sta + tulee – z. B. minusta tulee", head: ["Person", "… wird (tulla + -sta)"], r: [["minä", "[minusta tulee]"], ["sinä", "[sinusta tulee]"], ["hän", "[hänestä tulee]"], ["me", "[meistä tulee]"], ["te", "[teistä tulee]"], ["he", "[heistä tulee]"]] },
    { t: "tab", q: "Wann? – Essiv", h: "Jedes Kästchen eine Zeitangabe im Essiv (-na/-nä); „tämä vuosi“ ergibt zwei Wörter", head: ["Wort", "wann? (Essiv)"], r: [["lapsi", "[lapsena]"], ["joulu", "[jouluna]"], ["maanantai", "[maanantaina]"], ["tämä vuosi", "[tänä vuonna]"], ["viime vuosi", "[viime vuonna]"]] },
    { t: "tab", q: "Für wie lange? Was wird daraus? – Translativ", h: "Jedes Kästchen eine Form mit -ksi (Stamm wie bei -n); „kaksi viikkoa“ ergibt zwei Wörter", head: ["Wort", "Translativ"], r: [["viikko", "[viikoksi]"], ["kaksi viikkoa", "[kahdeksi viikoksi]"], ["joulu", "[jouluksi]"], ["kylmä", "[kylmäksi]"], ["opettaja", "[opettajaksi]"]] },
    { t: "gap", q: "Hänestä ___ lääkäri.", h: "tulla in der Vergangenheit (wurde)", a: ["tuli"] },
    { t: "gap", q: "___ tulee opettaja.", h: "minä mit -sta: „aus mir“", a: ["Minusta"] },
    { t: "gap", q: "Sää muuttuu ___.", h: "kylmä + -ksi: wird kalt", a: ["kylmäksi"] },
    { t: "gap", q: "Menen Suomeen ___.", h: "viikko + -ksi: für eine Woche", a: ["viikoksi"] },
    { t: "gap", q: "Asuin ___ Wienissä.", h: "lapsi im Essiv: als Kind", a: ["lapsena"] },
    { t: "gap", q: "Valmistun ___ vuonna.", h: "tämä im Essiv: dieses (Jahr)", a: ["tänä"] },
    { t: "tr", dir: "de", q: "Als Kind wohnte ich in Linz.", a: ["Lapsena asuin Linzissä", "Asuin lapsena Linzissä", "Lapsena minä asuin Linzissä", "Asuin Linzissä lapsena"] },
    { t: "tr", dir: "de", q: "Was willst du werden, wenn du groß bist?", a: ["Mikä sinusta tulee isona", "Mikä haluat olla isona", "Mikä sinä haluat olla isona"] },
    { t: "tr", dir: "de", q: "Ich komme über Weihnachten nach Hause.", a: ["Tulen kotiin jouluksi", "Tulen jouluksi kotiin", "Minä tulen kotiin jouluksi", "Jouluksi tulen kotiin"] },
    { t: "tr", dir: "fi", q: "Hänestä tuli insinööri vuonna 2020.", a: ["Er wurde 2020 Ingenieur", "Sie wurde 2020 Ingenieurin", "Er ist 2020 Ingenieur geworden", "Sie ist 2020 Ingenieurin geworden", "Er wurde im Jahr 2020 Ingenieur", "Sie wurde im Jahr 2020 Ingenieurin"] },
    { t: "tr", dir: "fi", q: "Valmistuin viime vuonna.", a: ["Ich habe letztes Jahr meinen Abschluss gemacht", "Letztes Jahr habe ich meinen Abschluss gemacht", "Ich bin letztes Jahr fertig geworden", "Ich habe im letzten Jahr meinen Abschluss gemacht"] },
    { t: "ord", w: ["Minusta", "tulee", "kokki"], a: ["Minusta tulee kokki."], de: "Ich werde Koch." },
    { t: "ord", w: ["Ilma", "muuttuu", "kylmäksi", "illalla"], a: ["Ilma muuttuu kylmäksi illalla.", "Illalla ilma muuttuu kylmäksi."], de: "Am Abend wird es kalt." },
    { t: "mc", q: "„Hänestä tuli lääkäri.“ – Wie sagt man „werden“ bei Berufen?", o: ["Person mit -sta + tulla + Beruf in der Grundform", "Person + tulla + Beruf mit -ksi", "Person mit -lla + on + Beruf", "Person + muuttua + Beruf mit -na"], a: 0, x: "Wörtlich: „Aus ihm/ihr kam ein Arzt.“ Bei Eigenschaften dagegen muuttua + -ksi: Sää muuttuu kylmäksi." },
    { t: "mc", q: "„Menen Suomeen viikoksi.“ – Was zeigt -ksi hier?", o: ["wie lange man bleiben will (geplante Dauer)", "wann man fährt", "mit wem man fährt", "dass die Reise schon vorbei ist"], a: 0, x: "Translativ = geplante Dauer oder Ziel-Zeitpunkt: viikoksi, jouluksi. Wann etwas ist → Essiv: jouluna, lapsena." },
    { t: "mc", q: "Welche Form passt: „___ asuin Linzissä.“ (Als Kind …)", o: ["Lapsena", "Lapseksi", "Lapsessa", "Lapsen"], a: 0, x: "Lebensabschnitte und Feste stehen im Essiv: lapsena, aikuisena, jouluna, tänä vuonna." },
    { t: "mc", q: "Gesprochen: „Mä oon duunissa.“ bedeutet:", o: ["Ich bin in der Arbeit.", "Ich bin zu Hause.", "Ich suche Arbeit.", "Ich habe frei."], a: 0, x: "duuni = työ (umgangssprachlich): duunissa = töissä." },
    { t: "mc", q: "Gesprochen: „Musta tulee kokki.“ – Wie schreibt man das?", o: ["Minusta tulee kokki.", "Minulla on kokki.", "Minä tulen kokkiin.", "Musta kokki tulee."], a: 0, x: "musta = minusta (gesprochen). Geschrieben ist musta das Wort für „schwarz“." },
    { t: "tr", dir: "fi", q: "Mä duunaan huomenna.", h: "gesprochenes Finnisch", a: ["Ich arbeite morgen", "Morgen arbeite ich"] },
    { t: "les", q: "Ainon elämä", txt: ["Lapsena Aino asui Oulussa.", "Hän halusi lääkäriksi.", "Mutta hänestä tuli opettaja.", "Hän valmistui vuonna 2015.", "Nyt hän asuu Helsingissä.", "Jouluna hän menee aina Ouluun viikoksi."], qs: [{ q: "Was wollte Aino als Kind werden?", o: ["Ärztin", "Lehrerin", "Köchin"], a: 0 }, { q: "Was ist sie geworden?", o: ["Lehrerin", "Ärztin", "Verkäuferin"], a: 0 }, { q: "Wie lange ist sie zu Weihnachten in Oulu?", o: ["eine Woche", "einen Tag", "einen Monat"], a: 0, x: "„viikoksi“ = für eine Woche" }] },
    { t: "les", q: "Sää muuttuu", txt: ["Tänään on lämmin päivä.", "Illalla sää muuttuu.", "Tuulee ja ilma muuttuu kylmäksi.", "Yöllä sataa lunta.", "Huomenna on talvi!"], qs: [{ q: "Wie ist es heute?", o: ["warm", "kalt", "es schneit"], a: 0 }, { q: "Was passiert am Abend?", o: ["Das Wetter ändert sich, es wird kalt.", "Es wird warm.", "Die Sonne scheint."], a: 0 }, { q: "Was passiert in der Nacht?", o: ["Es schneit.", "Es ist warm.", "Es regnet."], a: 0 }] },
    { t: "dlg", q: "Studium und Weihnachten", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Mitä opiskelet?"], ["Sinä", "[Opiskelen insinööriksi.|Minä opiskelen insinööriksi.]", "Sag: Du studierst, um Ingenieur zu werden."], ["Aino", "Milloin valmistut?"], ["Sinä", "[Valmistun ensi vuonna.|Ensi vuonna.|Minä valmistun ensi vuonna.]", "Sag: nächstes Jahr."], ["Aino", "Hienoa! Mitä teet jouluna?"], ["Sinä", "[Menen Suomeen viikoksi.|Menen viikoksi Suomeen.|Jouluna menen Suomeen viikoksi.]", "Sag: Du fährst für eine Woche nach Finnland."]] },
    { t: "dlg", q: "Als Kind", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Kollega", "Missä asuit lapsena?"], ["Sinä", "[Lapsena asuin Linzissä.|Asuin lapsena Linzissä.|Linzissä.]", "Sag: als Kind in Linz."], ["Kollega", "Halusitko lapsena opettajaksi?"], ["Sinä", "[En, halusin lääkäriksi.|En. Halusin lääkäriksi.|Ei, halusin lääkäriksi.]", "Sag nein: Du wolltest Arzt werden."], ["Kollega", "Ja nyt olet insinööri!"], ["Sinä", "[Niin! Minusta tuli insinööri.|Niin, minusta tuli insinööri.|Kyllä, minusta tuli insinööri.]", "Sag ja: Du bist Ingenieur geworden."]] },
    { t: "sch", q: "Schreib, was du als Kind werden wolltest und was du geworden bist.", w: ["lapsena", "minusta tuli"], a: ["Lapsena halusin lääkäriksi, mutta minusta tuli insinööri.", "Lapsena halusin opettajaksi. Minusta tuli insinööri."], h: "ein oder zwei Sätze auf Finnisch" },
    { t: "sch", q: "Schreib, dass du zu Weihnachten für zwei Wochen nach Finnland fährst.", w: ["jouluna", "viikoksi"], a: ["Jouluna menen Suomeen kahdeksi viikoksi.", "Menen jouluna Suomeen kahdeksi viikoksi.", "Jouluna matkustan Suomeen kahdeksi viikoksi."], h: "ein Satz auf Finnisch, Zahl als Wort" }
  ]
};
