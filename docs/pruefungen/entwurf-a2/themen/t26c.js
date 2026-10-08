module.exports = {
  id: "t26c",
  title: "Feinheiten: ei puhuta, Schilder, me ei mennä (26.3)",
  fi: "Tupakointi kielletty",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t20c", "t21b"],
  th: `<p>Feinheiten zu t26: das <b>verneinte Passiv</b> (<i>Täällä ei tupakoida</i> = Hier raucht man nicht), der Stufenwechsel im Passiv und typische <b>Schilder</b>. Dazu das gesprochene <i>me ei mennä</i>.</p>
<h3>Passiv bejaht und verneint</h3>
<table><tr><td>Grundform</td><td>Passiv</td><td>verneint</td></tr>
<tr><td>puhua</td><td>puhutaan</td><td>ei puhuta</td></tr>
<tr><td>mennä</td><td>mennään</td><td>ei mennä</td></tr>
<tr><td>juoda</td><td>juodaan</td><td>ei juoda</td></tr>
<tr><td>lukea</td><td>luetaan</td><td>ei lueta</td></tr>
<tr><td>ottaa</td><td>otetaan</td><td>ei oteta</td></tr>
<tr><td>tupakoida</td><td>tupakoidaan</td><td>ei tupakoida</td></tr></table>
<p class="rule">Verneint: <b>ei</b> + Passiv ohne <b>-an/-än</b>. Immer <i>ei</i> – nie <i>en</i> oder <i>emme</i>. Typ 1 hat im Passiv die <b>schwache Stufe</b> wie die minä-Form: <i>lukea → luen → luetaan, ottaa → otan → otetaan, pitää → pidän → pidetään</i>.</p>
<p class="rule">Frage: <i>Puhutaanko täällä englantia?</i> (Spricht man hier Englisch?) · Erlaubnis: <i>Saako täällä tupakoida?</i> – <i>Ei saa.</i></p>
<h3>Schilder</h3>
<table><tr><td>Tupakointi kielletty</td><td>Rauchen verboten</td></tr>
<tr><td>Pysäköinti kielletty</td><td>Parken verboten</td></tr>
<tr><td>Koirat sallittu</td><td>Hunde erlaubt</td></tr>
<tr><td>Varattu</td><td>besetzt, reserviert</td></tr>
<tr><td>Sisäänkäynti / Uloskäynti</td><td>Eingang / Ausgang</td></tr>
<tr><td>Huom!</td><td>Achtung! Bitte beachten!</td></tr></table>
<h3>So sagt man’s gesprochen</h3>
<p class="tip">Gesprochenes „wir … nicht“: <i>me ei mennä</i> (= emme mene), <i>me ei olla kotona</i> (= emme ole kotona). Verneinter Vorschlag: <i>Ei mennä vielä!</i> = Lass uns noch nicht gehen! <i>Mennääks?</i> = Mennäänkö?</p>
<p class="tip"><b>Kulttuuri:</b> In finnischen Wohnungen zieht man die Schuhe im Flur aus: <i>Kengät otetaan pois eteisessä.</i></p>`,
  v: [
    ["kielletty", "verboten"],
    ["sallittu", "erlaubt"],
    ["tupakointi kielletty", "Rauchen verboten"],
    ["pysäköidä", "parken (pysäköin)"],
    ["varattu", "besetzt, reserviert"],
    ["sisäänkäynti", "Eingang"],
    ["uloskäynti", "Ausgang"],
    ["ulos", "hinaus, nach draußen"],
    ["pois", "weg (ottaa pois = ausziehen, wegnehmen)"],
    ["huom!", "Achtung! Bitte beachten!"]
  ],
  ex: [
    { t: "tab", q: "Passiv bejaht und verneint", h: "Jedes Kästchen eine eigene Form: links Passiv (ein Wort), rechts verneint (zwei Wörter) – z. B. puhua | puhutaan | ei puhuta", head: ["Grundform", "Passiv", "verneint"], r: [["puhua", "[puhutaan]", "[ei puhuta]"], ["mennä", "[mennään]", "[ei mennä]"], ["juoda", "[juodaan]", "[ei juoda]"], ["lukea", "[luetaan]", "[ei lueta]"], ["ottaa", "[otetaan]", "[ei oteta]"], ["tupakoida", "[tupakoidaan]", "[ei tupakoida]"]], s: 1 },
    { t: "tab", q: "Schilder", h: "Jedes Kästchen ein Schild auf Finnisch (ein oder zwei Wörter)", head: ["Deutsch", "Schild"], r: [["Rauchen verboten", "[Tupakointi kielletty]"], ["Parken verboten", "[Pysäköinti kielletty]"], ["Hunde erlaubt", "[Koirat sallittu]"], ["besetzt / reserviert", "[Varattu]"], ["Ausgang", "[Uloskäynti]"]] },
    { t: "gap", q: "Täällä ei ___.", h: "tupakoida – verneintes Passiv: man raucht nicht", a: ["tupakoida"] },
    { t: "gap", q: "Kirjastossa ei ___ puhelimessa.", h: "puhua – verneintes Passiv", a: ["puhuta"] },
    { t: "gap", q: "Kotona ___ kengät pois.", h: "ottaa im Passiv (schwache Stufe)", a: ["otetaan"], s: 1 },
    { t: "gap", q: "___ täällä englantia?", h: "puhua im Passiv + -ko: Spricht man …?", a: ["Puhutaanko"], s: 1 },
    { t: "gap", q: "___ täällä tupakoida?", h: "saada + -ko: Darf man …?", a: ["Saako"] },
    { t: "gap", q: "Me ei ___ huomenna töihin.", h: "gesprochen: me ei + verneintes Passiv von mennä", a: ["mennä"] },
    { t: "tr", dir: "de", q: "Hier darf man nicht parken.", a: ["Täällä ei saa pysäköidä", "Täällä ei pysäköidä", "Pysäköinti kielletty"] },
    { t: "tr", dir: "de", q: "Hier liest man viel.", a: ["Täällä luetaan paljon"] },
    { t: "tr", dir: "fi", q: "Koirat sallittu.", a: ["Hunde erlaubt", "Hunde sind erlaubt"] },
    { t: "tr", dir: "fi", q: "Huom! Uloskäynti on oikealla.", a: ["Achtung! Der Ausgang ist rechts", "Bitte beachten: Der Ausgang ist rechts", "Achtung, der Ausgang ist rechts"] },
    { t: "ord", w: ["Täällä", "ei", "puhuta", "saksaa"], a: ["Täällä ei puhuta saksaa."], de: "Hier spricht man kein Deutsch." },
    { t: "mc", q: "Wie verneint man „puhutaan“?", o: ["ei puhuta", "ei puhutaan", "eivät puhutaan", "en puhuta"], a: 0, x: "ei + Passiv ohne -an/-än: ei puhuta, ei mennä, ei lueta. Immer „ei“, nie en/emme." },
    { t: "mc", q: "Warum heißt es „luetaan“ und nicht „luketaan“?", o: ["Typ 1 hat im Passiv die schwache Stufe: lukea → luetaan, ottaa → otetaan", "weil lukea Typ 2 ist", "das ist nur Umgangssprache", "weil -taan immer das k frisst"], a: 0, x: "Typ 1: schwacher Stamm wie bei minä (luen, otan) + -taan; End-a/-ä wird e: otetaan." },
    { t: "mc", q: "Auf einer Tür steht „Varattu“. Das bedeutet:", o: ["besetzt / reserviert", "verboten", "offen", "Ausgang"], a: 0 },
    { t: "mc", q: "Gesprochen: „Me ei olla kotona.“ – geschrieben:", o: ["Emme ole kotona.", "Me olemme kotona.", "Ei olla kotona!", "Olimme kotona."], a: 0, x: "Gesprochen: me + ei + verneintes Passiv. Geschrieben: emme ole." },
    { t: "mc", q: "Gesprochen: „Ei mennä vielä!“ bedeutet hier:", o: ["Lass uns noch nicht gehen!", "Wir sind schon gegangen.", "Geh nicht!", "Er geht noch nicht."], a: 0, x: "Der Vorschlag Mennään! wird verneint zu Ei mennä! (Lass uns nicht gehen!)." },
    { t: "les", q: "Kirjaston säännöt", txt: ["Kirjastossa ollaan hiljaa.", "Puhelimessa ei puhuta.", "Täällä ei syödä.", "Kahvia saa juoda kahvilassa.", "Koirat kielletty."], qs: [{ q: "Was darf man mit dem Handy in der Bibliothek nicht?", o: ["telefonieren", "die Uhrzeit ansehen", "es ausschalten"], a: 0 }, { q: "Wo darf man Kaffee trinken?", o: ["im Café", "überall", "nirgends"], a: 0 }, { q: "Sind Hunde erlaubt?", o: ["nein", "ja", "nur kleine"], a: 0 }] },
    { t: "les", q: "Uimahallin säännöt", txt: ["Ensin käydään suihkussa.", "Uimahallissa ei syödä.", "Saunassa ollaan alasti.", "Lapset ovat uimahallissa aikuisen kanssa.", "Huom! Uloskäynti on oikealla."], qs: [{ q: "Was macht man zuerst?", o: ["duschen", "schwimmen", "essen"], a: 0 }, { q: "Darf man im Hallenbad essen?", o: ["nein", "ja", "nur Obst"], a: 0 }, { q: "Mit wem sind Kinder dort?", o: ["mit einem Erwachsenen", "allein", "mit dem Hund"], a: 0 }] },
    { t: "dlg", q: "Darf man hier …?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Sinä", "[Anteeksi, saako täällä tupakoida?|Saako täällä tupakoida?]", "Frag, ob man hier rauchen darf."], ["Myyjä", "Ei saa. Täällä ei tupakoida."], ["Sinä", "[Missä saa tupakoida?|Missä sitten saa?|Missä saa?]", "Frag, wo man rauchen darf."], ["Myyjä", "Ulkona, oven vieressä."], ["Sinä", "[Kiitos!|Selvä, kiitos.]", "Bedanke dich."]] },
    { t: "dlg", q: "Nicht morgen!", h: "Deine Zeilen auf Finnisch schreiben – gesprochen ist hier erlaubt", r: [["Aino", "Mennäänks me huomenna saunaan?"], ["Sinä", "[Ei mennä huomenna, mennään lauantaina.|Ei huomenna. Mennään lauantaina!|Mennään lauantaina!]", "Sag: nicht morgen – lass uns am Samstag gehen."], ["Aino", "Okei! Me ollaan sit lauantaina saunassa."], ["Sinä", "[Hyvä!|Kiva!]", "Freu dich."]] },
    { t: "sch", q: "Schreib zwei Regeln für deine Wohnung (Passiv, eine davon verneint).", w: ["ei"], a: ["Kotona otetaan kengät pois. Täällä ei tupakoida.", "Täällä ei tupakoida. Kengät otetaan pois eteisessä."], h: "zwei kurze Sätze im Passiv" },
    { t: "sch", q: "Schreib ein Schild: Rauchen und Parken verboten.", w: ["kielletty"], a: ["Tupakointi kielletty. Pysäköinti kielletty.", "Tupakointi ja pysäköinti kielletty."], h: "Schilder auf Finnisch" }
  ]
};
