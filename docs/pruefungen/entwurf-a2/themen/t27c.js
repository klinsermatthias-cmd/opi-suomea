module.exports = {
  id: "t27c",
  title: "Feinheiten: Konditional aller Verbtypen, Jos olisin … (27.3)",
  fi: "Jos olisin rikas …",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t24d", "t25c"],
  th: `<p>Feinheiten zu t27: der <b>Konditional</b> für alle Verbtypen, verneint, mit Stufenwechsel – und Sätze wie „Wenn ich reich wäre, würde ich …“.</p>
<h3>Bildung: Stamm + -isi- + Endung</h3>
<table><tr><td>Typ</td><td>Grundform</td><td>minä</td></tr>
<tr><td>1</td><td>ostaa, puhua</td><td>ostaisin, puhuisin</td></tr>
<tr><td>1 (-e/-i fällt weg)</td><td>lukea, lähteä, oppia</td><td>lukisin, lähtisin, oppisin</td></tr>
<tr><td>2</td><td>syödä, juoda, saada</td><td>söisin, joisin, saisin</td></tr>
<tr><td>2 (Sonderfälle)</td><td>tehdä, nähdä</td><td>tekisin, näkisin</td></tr>
<tr><td>3</td><td>mennä, tulla, olla</td><td>menisin, tulisin, olisin</td></tr>
<tr><td>4</td><td>haluta, tavata</td><td>haluaisin, tapaisin</td></tr>
<tr><td>5</td><td>tarvita</td><td>tarvitsisin</td></tr></table>
<p class="rule">Der Konditional hat die <b>starke Stufe</b> (wie die hän-Form): <i>ottaa → ottaisin, lukea → lukisin, tavata → tapaisin</i>. Ein -e oder -i am Stammende fällt vor -isi- weg. Typ 2: langer Vokal wird kurz (<i>saa- → saisin</i>), bei <i>uo/yö/ie</i> fällt der erste Buchstabe weg (<i>juo- → joisin, syö- → söisin, vie- → veisin</i>).</p>
<p class="rule"><b>Verneint:</b> en/et/ei … + Konditional ohne Personalendung: <i>en menisi, et tulisi, emme ostaisi, eivät haluaisi</i>.</p>
<h3>Wenn …, dann würde …</h3>
<p class="rule">Bei einer gedachten Bedingung stehen <b>beide Verben im Konditional</b>: <i>Jos olisin rikas, ostaisin mökin.</i> <i>Jos minulla olisi aikaa, lukisin enemmän.</i> Reale Bedingung ohne Konditional: <i>Jos sataa, olen kotona.</i> (8.4)</p>
<p class="rule"><b>mieluummin</b> = lieber: <i>Joisin mieluummin teetä (kuin kahvia).</i></p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mä ottaisin kahvin.</i> · <i>Ois kiva!</i> (= Olisi kiva!) · <i>Jos mä oisin rikas …</i> (= Jos olisin rikas …) · <i>Voisitsä …?</i> (= Voisitko sinä …?)</p>`,
  v: [
    ["mieluummin", "lieber (+ kuin: lieber als)"],
    ["voittaa", "gewinnen (voitan)"],
    ["lotto", "Lotto (lotossa = im Lotto)"],
    ["maailma", "Welt"],
    ["ympäri maailmaa", "um die (ganze) Welt"],
    ["vapaa päivä", "freier Tag"]
  ],
  ex: [
    { t: "tab", q: "Konditional für „minä“", h: "Jedes Kästchen ein Wort: Konditional (-isi-) für minä, starke Stufe", head: ["Grundform", "minä"], r: [["ostaa", "[ostaisin]"], ["lukea", "[lukisin]"], ["syödä", "[söisin]"], ["tehdä", "[tekisin]"], ["mennä", "[menisin]"], ["tavata", "[tapaisin]"], ["tarvita", "[tarvitsisin]"], ["lähteä", "[lähtisin]"]], s: 1 },
    { t: "tab", q: "mennä im Konditional – bejaht und verneint", h: "Jedes Kästchen eine eigene Form: links bejaht (ein Wort), rechts verneint (zwei Wörter) – z. B. minä | menisin | en menisi", head: ["Person", "bejaht", "verneint"], r: [["minä", "[menisin]", "[en menisi]"], ["sinä", "[menisit]", "[et menisi]"], ["hän", "[menisi]", "[ei menisi]"], ["me", "[menisimme]", "[emme menisi]"], ["he", "[menisivät]", "[eivät menisi]"]], s: 1 },
    { t: "gap", q: "Jos olisin rikas, ___ mökin.", h: "ostaa – Konditional für „minä“", a: ["ostaisin"], s: 1 },
    { t: "gap", q: "Jos minulla ___ aikaa, lukisin enemmän.", h: "olla – Konditional (minulla on → minulla …)", a: ["olisi"] },
    { t: "gap", q: "Joisin ___ teetä kuin kahvia.", h: "lieber", a: ["mieluummin"] },
    { t: "gap", q: "En ___ sitä.", h: "haluta – verneinter Konditional (ohne Personalendung)", a: ["haluaisi"], s: 1 },
    { t: "gap", q: "Jos ___ lotossa, matkustaisin ympäri maailmaa.", h: "voittaa – Konditional für „minä“", a: ["voittaisin"], s: 1 },
    { t: "gap", q: "___ sinä tulla huomenna?", h: "voida – Konditional + -ko für „sinä“", a: ["Voisitko"] },
    { t: "tr", dir: "de", q: "Wenn ich Zeit hätte, würde ich nach Finnland reisen.", a: ["Jos minulla olisi aikaa, matkustaisin Suomeen", "Jos minulla olisi aikaa, menisin Suomeen", "Matkustaisin Suomeen, jos minulla olisi aikaa"] },
    { t: "tr", dir: "de", q: "Ich würde lieber zu Hause bleiben.", a: ["Jäisin mieluummin kotiin", "Mieluummin jäisin kotiin", "Olisin mieluummin kotona"] },
    { t: "tr", dir: "de", q: "Wir würden nicht kommen.", a: ["Emme tulisi", "Me emme tulisi"] },
    { t: "tr", dir: "fi", q: "Mitä tekisit, jos voittaisit lotossa?", a: ["Was würdest du machen, wenn du im Lotto gewinnen würdest", "Was würdest du tun, wenn du im Lotto gewinnen würdest"] },
    { t: "tr", dir: "fi", q: "Ehkä menisin Lappiin.", a: ["Vielleicht würde ich nach Lappland fahren", "Vielleicht würde ich nach Lappland gehen", "Vielleicht würde ich nach Lappland reisen"] },
    { t: "ord", w: ["Jos", "olisin", "rikas", "ostaisin", "mökin"], a: ["Jos olisin rikas, ostaisin mökin.", "Ostaisin mökin, jos olisin rikas."], de: "Wenn ich reich wäre, würde ich eine Hütte kaufen." },
    { t: "mc", q: "Wie heißt „tehdä“ im Konditional (minä)?", o: ["tekisin", "tehdisin", "teisin", "tein"], a: 0, x: "tehdä und nähdä: tekisin, näkisin. Sonst Typ 2: langer Vokal wird kurz (saada → saisin), bei uo/yö/ie fällt der erste Buchstabe weg (syödä → söisin, juoda → joisin)." },
    { t: "mc", q: "Welche Stufe hat der Konditional?", o: ["die starke: ottaisin, lukisin, tapaisin", "die schwache: otaisin, luisin, tavaisin", "gar keine Konsonanten", "immer kk"], a: 0, x: "Wie die hän-Form: ottaa → ottaisin, lukea → lukisin, tavata → tapaisin." },
    { t: "mc", q: "„Jos olisin rikas, ostaisin mökin.“ – Wo steht der Konditional?", o: ["in beiden Satzteilen", "nur im jos-Teil", "nur im zweiten Teil", "nirgends"], a: 0, x: "Gedachte Bedingung: beide Verben im Konditional. Reale Bedingung: Jos sataa, olen kotona." },
    { t: "mc", q: "Gesprochen: „Mä ottaisin kahvin.“ bedeutet:", o: ["Ich hätte gern einen Kaffee.", "Ich habe Kaffee genommen.", "Ich nehme keinen Kaffee.", "Nimm einen Kaffee!"], a: 0, x: "mä = minä; der Konditional macht es höflich." },
    { t: "mc", q: "Gesprochen: „Ois kiva!“ – geschrieben:", o: ["Olisi kiva!", "Oli kiva!", "On kiva!", "Olisin kiva!"], a: 0, x: "ois = olisi (gesprochen verkürzt)." },
    { t: "les", q: "Jos voittaisin lotossa", txt: ["Mitä tekisin, jos voittaisin lotossa?", "Ensin ostaisin talon järven rannalta.", "Sitten matkustaisin ympäri maailmaa.", "En lopettaisi töitä, koska pidän työstäni.", "Mutta ehkä tekisin vähemmän töitä."], qs: [{ q: "Was würde er zuerst kaufen?", o: ["ein Haus am See", "ein Auto", "eine Wohnung in der Stadt"], a: 0 }, { q: "Würde er aufhören zu arbeiten?", o: ["Nein, er mag seine Arbeit.", "Ja, sofort.", "Ja, nach einem Jahr."], a: 0 }, { q: "Was würde er vielleicht ändern?", o: ["weniger arbeiten", "mehr arbeiten", "umziehen"], a: 0 }] },
    { t: "les", q: "Mieluummin teatteriin", txt: ["Aino: Mennäänkö elokuviin?", "Matthias: Menisin mieluummin teatteriin.", "Aino: Teatteri on kallis. Olisiko konsertti parempi?", "Matthias: Ehkä. Jos konserttiliput eivät olisi kalliita, menisin mielelläni."], qs: [{ q: "Wohin würde Matthias lieber gehen?", o: ["ins Theater", "ins Kino", "ins Konzert"], a: 0 }, { q: "Was ist das Problem mit dem Theater?", o: ["Es ist teuer.", "Es ist weit weg.", "Es ist voll."], a: 0 }, { q: "Wann würde er ins Konzert gehen?", o: ["wenn die Karten nicht teuer wären", "wenn Aino zahlt", "nie"], a: 0 }] },
    { t: "dlg", q: "Was würdest du tun?", h: "Deine Zeilen auf Finnisch schreiben – im Konditional", r: [["Aino", "Mitä tekisit, jos sinulla olisi vapaa päivä?"], ["Sinä", "[Menisin mökille.|Jos minulla olisi vapaa päivä, menisin mökille.|Nukkuisin pitkään.]", "Sag, was du tun würdest."], ["Aino", "Entä jos sataisi?"], ["Sinä", "[Sitten lukisin kirjaa.|Jos sataisi, lukisin kirjaa.|Sitten olisin kotona ja lukisin.]", "Sag: Dann würdest du ein Buch lesen."]] },
    { t: "dlg", q: "Im Café – höflich", h: "Deine Zeilen auf Finnisch schreiben – im Konditional", r: [["Myyjä", "Mitä saisi olla?"], ["Sinä", "[Ottaisin kahvin, kiitos.|Ottaisin teen, kiitos.|Haluaisin kahvin, kiitos.]", "Bestelle höflich (Konditional)."], ["Myyjä", "Haluaisitko pullan?"], ["Sinä", "[En kiitos, söisin mieluummin leipää.|Ei kiitos, ottaisin mieluummin leipää.|En, kiitos.]", "Sag nein danke – du würdest lieber Brot essen."]] },
    { t: "sch", q: "Schreib, was du tun würdest, wenn du im Lotto gewinnen würdest.", w: ["jos", "voittaisin"], a: ["Jos voittaisin lotossa, matkustaisin ympäri maailmaa.", "Jos voittaisin lotossa, ostaisin mökin Suomesta."], h: "ein Satz mit jos – beide Verben im Konditional" },
    { t: "sch", q: "Schreib, was du lieber machen würdest: ins Kino oder in die Sauna gehen?", w: ["mieluummin"], a: ["Menisin mieluummin saunaan.", "Menisin mieluummin elokuviin kuin saunaan."], h: "ein Satz mit „mieluummin“" }
  ]
};
