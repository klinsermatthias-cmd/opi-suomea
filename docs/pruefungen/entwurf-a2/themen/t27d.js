module.exports = {
  id: "t27d",
  title: "Indirekte Fragen: Tiedättekö, missä …? En tiedä, onko … (27.4)",
  fi: "Tiedättekö, missä posti on?",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t20d"],
  th: `<p>Vertiefung zu t27: höflich und indirekt nach Informationen fragen – „Wissen Sie, wo …?“, „Ich weiß nicht, ob …“, „Ich habe gefragt, ob …“.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Tiedättekö, missä posti on?</td><td>Wissen Sie, wo die Post ist?</td></tr>
<tr><td>Voisitteko sanoa, milloin bussi lähtee?</td><td>Könnten Sie sagen, wann der Bus fährt?</td></tr>
<tr><td>En tiedä, onko kauppa auki.</td><td>Ich weiß nicht, ob das Geschäft offen ist.</td></tr>
<tr><td>Kysyin, tuleeko hän.</td><td>Ich habe gefragt, ob er/sie kommt.</td></tr>
<tr><td>Hän kysyi, mistä olen kotoisin.</td><td>Er/Sie fragte, woher ich komme.</td></tr>
<tr><td>Minun täytyy selvittää, missä virasto on.</td><td>Ich muss herausfinden, wo das Amt ist.</td></tr>
</table>
<h3>Zwei Arten</h3>
<table><tr><td>mit Fragewort</td><td>Tiedätkö, <b>missä</b> posti on? – Kysy, <b>paljonko</b> se maksaa.</td></tr>
<tr><td>Ja/Nein („ob“)</td><td>En tiedä, <b>onko</b> kauppa auki. – Kysyin, <b>tuleeko</b> hän.</td></tr></table>
<p class="rule">Vor dem Nebensatz steht <b>ein Komma</b>. Mit Fragewort bleibt die Wortstellung wie in der direkten Frage. Für „ob“ bekommt das <b>erste Wort des Nebensatzes -ko/-kö</b> – meist das Verb: <i>onko, tuleeko, voiko</i>.</p>
<p class="rule"><b>Achtung:</b> „ob“ ist nicht <i>jos</i> (wenn, falls) und nicht <i>että</i> (dass): <i>En tiedä, tuleeko hän.</i> Gesprochen hört man manchmal <i>jos</i> für „ob“ – geschrieben gilt das als falsch.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Tiiäksä, missä posti on?</i> (= Tiedätkö sinä …?) · <i>Mä en tiiä, onks se auki.</i> (= En tiedä, onko se auki.) · <i>tiiä</i> = tiedä, <i>onks</i> = onko.</p>`,
  v: [
    ["tiedättekö?", "wissen Sie? wisst ihr?"],
    ["voisitteko sanoa", "könnten Sie sagen"],
    ["ihmetellä", "sich wundern, sich fragen (ihmettelen)"],
    ["selvittää", "klären, herausfinden (selvitän)"],
    ["tarkistaa", "überprüfen, nachsehen (tarkistan)"],
    ["tasotesti", "Einstufungstest"]
  ],
  ex: [
    { t: "tab", q: "Direkte Frage → indirekte Frage", h: "Jedes Kästchen: der ganze Nebensatz nach „Tiedätkö, …“ (ohne Fragezeichen)", head: ["direkte Frage", "Tiedätkö, …"], r: [["Missä posti on?", "[missä posti on]"], ["Milloin bussi lähtee?", "[milloin bussi lähtee]"], ["Onko kauppa auki?", "[onko kauppa auki]"], ["Tuleeko hän?", "[tuleeko hän]"], ["Paljonko se maksaa?", "[paljonko se maksaa]"]] },
    { t: "gap", q: "Tiedätkö, ___ posti on?", h: "wo", a: ["missä"] },
    { t: "gap", q: "En tiedä, ___ kauppa auki.", h: "olla + -ko: ob … ist", a: ["onko"] },
    { t: "gap", q: "Kysyin, ___ hän huomenna.", h: "tulla + -ko: ob er/sie kommt", a: ["tuleeko"] },
    { t: "gap", q: "Voisitteko sanoa, ___ juna lähtee?", h: "wann", a: ["milloin"] },
    { t: "gap", q: "Minun täytyy ___, missä virasto on.", h: "herausfinden – Grundform", a: ["selvittää"] },
    { t: "gap", q: "___, voiko kortilla maksaa.", h: "kysyä – Befehl an „sinä“: Frag, ob …", a: ["Kysy"] },
    { t: "tr", dir: "de", q: "Weißt du, wo der Bahnhof ist?", a: ["Tiedätkö, missä asema on", "Tiedätkö, missä rautatieasema on"] },
    { t: "tr", dir: "de", q: "Ich weiß nicht, ob er kommt.", a: ["En tiedä, tuleeko hän", "Minä en tiedä, tuleeko hän"] },
    { t: "tr", dir: "de", q: "Könnten Sie sagen, wann der Kurs beginnt?", a: ["Voisitteko sanoa, milloin kurssi alkaa"] },
    { t: "tr", dir: "fi", q: "Hän kysyi, mistä olen kotoisin.", a: ["Er fragte, woher ich komme", "Sie fragte, woher ich komme", "Er hat gefragt, woher ich komme", "Sie hat gefragt, woher ich komme", "Er fragte, woher ich stamme", "Sie fragte, woher ich stamme"] },
    { t: "tr", dir: "fi", q: "Ihmettelen, miksi hän ei vastaa.", a: ["Ich frage mich, warum er nicht antwortet", "Ich frage mich, warum sie nicht antwortet", "Ich wundere mich, warum er nicht antwortet", "Ich wundere mich, warum sie nicht antwortet"] },
    { t: "ord", w: ["En", "tiedä", "onko", "kauppa", "auki"], a: ["En tiedä, onko kauppa auki."], de: "Ich weiß nicht, ob das Geschäft offen ist." },
    { t: "ord", w: ["Tiedättekö", "missä", "posti", "on"], a: ["Tiedättekö, missä posti on?"], de: "Wissen Sie, wo die Post ist?" },
    { t: "mc", q: "„En tiedä, ___ hän kotona.“ – Was passt?", o: ["onko", "on", "että on", "jos on"], a: 0, x: "„ob“ = -ko/-kö am ersten Wort des Nebensatzes: onko, tuleeko, voiko." },
    { t: "mc", q: "Wo steht -ko in „Kysyin, tuleeko hän.“?", o: ["am ersten Wort des Nebensatzes (meist dem Verb)", "am Ende des Satzes", "am Hauptverb kysyin", "gar nicht"], a: 0, x: "Kysyin, tuleeko hän. En tiedä, voiko täällä maksaa kortilla. Das -ko-Wort steht vorne." },
    { t: "mc", q: "Wie fragt man höflich nach dem Weg?", o: ["Voisitteko sanoa, missä asema on?", "Missä asema on, voisitteko?", "Sano missä asema!", "Asema missä on, tiedätkö?"], a: 0, x: "Höflich: Voisitteko sanoa / Tiedättekö, + Fragewort + normale Wortstellung." },
    { t: "mc", q: "„Ich weiß nicht, ob …“ – welches Wort?", o: ["-ko: En tiedä, tuleeko hän.", "jos: En tiedä, jos hän tulee.", "että: En tiedä, että hän tulee.", "kun: En tiedä, kun hän tulee."], a: 0, x: "ob = -ko/-kö. jos = wenn, falls; että = dass. „jos“ für „ob“ hört man gesprochen, geschrieben gilt es als falsch." },
    { t: "les", q: "Kysymys kurssista", txt: ["Hei!", "Haluaisin tietää, milloin syksyn kurssi alkaa.", "Voitteko kertoa myös, paljonko kurssi maksaa?", "En tiedä, onko minun tasoni A2 vai B1.", "Voisinko tulla tasotestiin?", "Ystävällisin terveisin Matthias"], qs: [{ q: "Was will Matthias wissen?", o: ["wann der Kurs beginnt und was er kostet", "wo der Kurs ist", "wer unterrichtet"], a: 0 }, { q: "Was weiß er nicht?", o: ["sein Niveau", "seine Adresse", "den Preis seines Buchs"], a: 0 }, { q: "Was möchte er machen?", o: ["einen Einstufungstest", "sofort beginnen", "absagen"], a: 0 }] },
    { t: "les", q: "Asemalla", txt: ["Matthias kysyy virkailijalta, milloin juna Tampereelle lähtee.", "Virkailija sanoo, että juna lähtee kello 14.", "Matthias kysyy myös, onko junassa kahvila.", "Virkailija ei tiedä, onko kahvila tänään auki."], qs: [{ q: "Wonach fragt Matthias zuerst?", o: ["wann der Zug nach Tampere fährt", "wo der Bahnsteig ist", "was die Fahrkarte kostet"], a: 0 }, { q: "Wann fährt der Zug?", o: ["um 14 Uhr", "um 4 Uhr", "um 12 Uhr"], a: 0 }, { q: "Was weiß der Beamte nicht?", o: ["ob das Café heute offen ist", "wann der Zug fährt", "wo Tampere ist"], a: 0 }] },
    { t: "dlg", q: "Höflich fragen", h: "Deine Zeilen auf Finnisch schreiben – höflich mit „te“", r: [["Sinä", "[Anteeksi, tiedättekö, missä posti on?|Anteeksi, voisitteko sanoa, missä posti on?|Tiedättekö, missä posti on?]", "Frag höflich (Sie), wo die Post ist."], ["Nainen", "Se on torin vieressä."], ["Sinä", "[Tiedättekö, onko se auki lauantaina?|Tiedättekö, onko posti auki lauantaina?|Voisitteko sanoa, onko se auki lauantaina?|Onko se auki lauantaina?]", "Frag, ob sie am Samstag geöffnet ist."], ["Nainen", "En tiedä. Tarkista netistä."], ["Sinä", "[Kiitos!|Kiitos paljon!]", "Bedanke dich."]] },
    { t: "dlg", q: "Weitersagen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Kysyitkö Villeltä, tuleeko hän?"], ["Sinä", "[Kysyin. Hän sanoi, että hän tulee.|Kysyin, hän tulee.|Kyllä, hän sanoi, että hän tulee.]", "Sag: Du hast gefragt – er sagte, dass er kommt."], ["Aino", "Tiedätkö, milloin?"], ["Sinä", "[En tiedä, milloin hän tulee.|En tiedä.|En tiedä, milloin.]", "Sag, dass du nicht weißt, wann er kommt."]] },
    { t: "sch", q: "Schreib eine höfliche Frage: Wissen Sie, wann die Bibliothek offen ist?", w: ["tiedättekö"], a: ["Tiedättekö, milloin kirjasto on auki?", "Anteeksi, tiedättekö, milloin kirjasto on auki?"], h: "ein Satz mit Komma" },
    { t: "sch", q: "Schreib: Ich weiß nicht, ob ich morgen Zeit habe.", w: ["en tiedä"], a: ["En tiedä, onko minulla huomenna aikaa.", "En tiedä, onko minulla aikaa huomenna."], h: "ein Satz mit -ko" }
  ]
};
