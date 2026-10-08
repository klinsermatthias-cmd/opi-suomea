module.exports = {
  id: "t31c",
  title: "Feinheiten: oppia uimaan, ruveta, jäädä; sanomatta (31.3)",
  fi: "Hän lähti sanomatta mitään",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t31", "t27b", "t28c"],
  th: `<p>Feinheiten zu t31: Viele Verben wollen den 3. Infinitiv auf <b>-maan</b> – nicht nur Bewegungsverben. Dazu die Form auf <b>-matta/-mättä</b> = „ohne zu …“.</p>
<h3>Verben + -maan</h3>
<table><tr><td>oppia</td><td>Opin uimaan lapsena.</td><td>Ich lernte als Kind schwimmen.</td></tr>
<tr><td>opettaa</td><td>Isä opetti minut ajamaan.</td><td>Der Vater brachte mir das Fahren bei.</td></tr>
<tr><td>auttaa</td><td>Autatko siivoamaan?</td><td>Hilfst du beim Putzen?</td></tr>
<tr><td>ruveta</td><td>Rupesin opiskelemaan suomea.</td><td>Ich fing an, Finnisch zu lernen.</td></tr>
<tr><td>jäädä</td><td>Jäin katsomaan elokuvaa.</td><td>Ich blieb, um den Film zu sehen.</td></tr>
<tr><td>pyytää</td><td>Pyysin häntä tulemaan.</td><td>Ich bat ihn/sie zu kommen.</td></tr></table>
<p class="rule">Nach <i>oppia, opettaa, auttaa, ruveta, jäädä, pyytää</i> und den Bewegungsverben steht <b>-maan</b>. Nach <i>haluta, voida, osata, täytyy, alkaa</i> dagegen die <b>Grundform</b>: <i>Haluan uida. Osaan uida. Alkaa sataa.</i> <i>ruveta</i> geht wie Typ 4 mit Stufenwechsel: <i>rupean, rupesin</i>.</p>
<h3>-matta / -mättä = ohne zu</h3>
<p class="rule">Stamm wie bei -maan + <b>-matta/-mättä</b>: <i>Hän lähti sanomatta mitään.</i> (Er ging, ohne etwas zu sagen.) <i>Lähdin syömättä.</i> (Ich ging, ohne zu essen.) <i>Lasku on maksamatta.</i> (Die Rechnung ist unbezahlt.)</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mä meen nukkuun.</i> (= Menen nukkumaan.) · <i>Se rupes sataa / satamaan.</i> · Nach <i>alkaa</i> hört man oft <i>alkaa tekemään</i> statt <i>alkaa tehdä</i> – Kielitoimisto akzeptiert das in der Alltagssprache; geschrieben bleibt <i>alkaa tehdä</i> die sichere Wahl.</p>`,
  v: [
    ["ruveta", "anfangen (rupean; + -maan)"],
    ["opettaa", "lehren, beibringen (opetan; + -maan)"],
    ["kysymättä", "ohne zu fragen"],
    ["sanomatta", "ohne zu sagen (sanomatta mitään)"],
    ["syömättä", "ohne zu essen"],
    ["maksamatta", "unbezahlt"]
  ],
  ex: [
    { t: "tab", q: "-maan oder Grundform?", h: "Jedes Kästchen ein Wort: uida nach dem Verb links – entweder uimaan oder uida", head: ["Verb", "uida"], r: [["Opin …", "[uimaan]"], ["Haluan …", "[uida]"], ["Rupesin …", "[uimaan]"], ["Osaan …", "[uida]"], ["Menen …", "[uimaan]"], ["Voin …", "[uida]"]], s: 1 },
    { t: "tab", q: "ohne zu: -matta / -mättä", h: "Jedes Kästchen ein Wort: Stamm (wie -maan) + -matta/-mättä", head: ["Grundform", "ohne zu …"], r: [["sanoa", "[sanomatta]"], ["syödä", "[syömättä]"], ["maksaa", "[maksamatta]"], ["nukkua", "[nukkumatta]"]], s: 1 },
    { t: "gap", q: "Opin ___ lapsena.", h: "uida nach oppia: -maan", a: ["uimaan"], s: 1 },
    { t: "gap", q: "Autatko minua ___?", h: "siivota nach auttaa: -maan", a: ["siivoamaan"], s: 1 },
    { t: "gap", q: "Vuonna 2026 ___ opiskelemaan suomea.", h: "ruveta – Vergangenheit für „minä“ (Stufenwechsel v → p: rupe-)", a: ["rupesin"], s: 1 },
    { t: "gap", q: "Jäin ___ elokuvaa.", h: "katsoa nach jäädä: -maan", a: ["katsomaan"], s: 1 },
    { t: "gap", q: "Hän lähti ___ mitään.", h: "sanoa: ohne zu sagen (-matta)", a: ["sanomatta"], s: 1 },
    { t: "gap", q: "Haluan ___ ajamaan autoa.", h: "oppia – Grundform nach haluan", a: ["oppia"] },
    { t: "tr", dir: "de", q: "Ich gehe jetzt schlafen.", a: ["Menen nyt nukkumaan", "Nyt menen nukkumaan", "Minä menen nyt nukkumaan"] },
    { t: "tr", dir: "de", q: "Sie hat mir das Schwimmen beigebracht.", a: ["Hän opetti minut uimaan", "Hän opetti minua uimaan"] },
    { t: "tr", dir: "de", q: "Ich bin ohne Frühstück gegangen.", a: ["Lähdin syömättä aamiaista", "Lähdin syömättä", "Lähdin ilman aamiaista"] },
    { t: "tr", dir: "fi", q: "Pyysin häntä tulemaan huomenna.", a: ["Ich bat ihn, morgen zu kommen", "Ich bat sie, morgen zu kommen", "Ich habe ihn gebeten, morgen zu kommen", "Ich habe sie gebeten, morgen zu kommen"] },
    { t: "tr", dir: "fi", q: "Lasku on vielä maksamatta.", a: ["Die Rechnung ist noch nicht bezahlt", "Die Rechnung ist noch unbezahlt"] },
    { t: "ord", w: ["Rupesin", "opiskelemaan", "suomea", "lokakuussa"], a: ["Rupesin opiskelemaan suomea lokakuussa.", "Lokakuussa rupesin opiskelemaan suomea."], de: "Im Oktober habe ich angefangen, Finnisch zu lernen." },
    { t: "mc", q: "Nach welchem Verb steht -maan?", o: ["oppia (Opin uimaan.)", "haluta (Haluan …)", "osata (Osaan …)", "voida (Voin …)"], a: 0, x: "-maan nach oppia, opettaa, auttaa, ruveta, jäädä, pyytää und Bewegungsverben. Grundform nach haluta, voida, osata, täytyy, alkaa." },
    { t: "mc", q: "„Hän lähti sanomatta mitään.“ bedeutet:", o: ["Er ging, ohne etwas zu sagen.", "Er ging, um etwas zu sagen.", "Er sagte, dass er geht.", "Er ging und sagte alles."], a: 0, x: "-matta/-mättä = ohne zu: sanomatta, syömättä, maksamatta." },
    { t: "mc", q: "Gesprochen: „Mä meen nukkuun.“ – geschrieben:", o: ["Menen nukkumaan.", "Menin nukkumaan.", "Nukun.", "Menen nukkumassa."], a: 0, x: "meen = menen, nukkuun = nukkumaan (gesprochen verkürzt)." },
    { t: "mc", q: "Gesprochen hört man „alkaa tekemään“. Was gilt geschrieben?", o: ["Geschrieben besser „alkaa tehdä“ (Grundform).", "Nur „alkaa tekemään“ ist richtig.", "„alkaa tekemässä“", "„alkaa teki“"], a: 0, x: "Nach alkaa steht die Grundform: alkaa sataa, alkaa tehdä. alkaa + -maan ist umgangssprachlich und wird akzeptiert." },
    { t: "les", q: "Miten opin suomea", txt: ["Rupesin opiskelemaan suomea lokakuussa.", "Ystäväni Aino auttaa minua puhumaan.", "Hän pyysi minua tulemaan kurssille.", "Joskus jään illalla lukemaan kirjaa, vaikka olen väsynyt.", "Opettaja sanoi: „Älä lähde kotiin kysymättä!“"], qs: [{ q: "Wann hat er angefangen, Finnisch zu lernen?", o: ["im Oktober", "im Januar", "letztes Jahr"], a: 0 }, { q: "Wobei hilft Aino?", o: ["beim Sprechen", "beim Schreiben", "beim Kochen"], a: 0 }, { q: "Was sagt die Lehrerin?", o: ["Geh nicht nach Hause, ohne zu fragen!", "Geh früh nach Hause!", "Frag nicht so viel!"], a: 0 }] },
    { t: "les", q: "Ilta", txt: ["Illalla jäin töihin tekemään raporttia.", "Lähdin kotiin syömättä.", "Kotona söin nopeasti ja menin nukkumaan.", "Aamulla huomasin, että lasku oli vielä maksamatta!"], qs: [{ q: "Warum blieb er länger in der Arbeit?", o: ["um einen Bericht zu schreiben", "um zu essen", "um auf den Chef zu warten"], a: 0 }, { q: "Hat er vor dem Heimgehen gegessen?", o: ["nein", "ja", "nur Kaffee getrunken"], a: 0 }, { q: "Was merkte er am Morgen?", o: ["Die Rechnung war unbezahlt.", "Er war krank.", "Der Wecker war kaputt."], a: 0 }] },
    { t: "dlg", q: "Wann hast du angefangen?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Milloin rupesit opiskelemaan suomea?"], ["Sinä", "[Rupesin opiskelemaan lokakuussa.|Lokakuussa.|Aloitin lokakuussa.]", "Sag: im Oktober."], ["Aino", "Kuka opettaa sinua?"], ["Sinä", "[Claude opettaa minua!|Opettaja ja Claude.|Opettaja.]", "Sag, wer dich unterrichtet."], ["Aino", "Opitko jo puhumaan?"], ["Sinä", "[Vähän! Opin koko ajan.|Vähän.|Opin vähitellen.]", "Sag: ein bisschen."]] },
    { t: "dlg", q: "Hilfst du mir?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Autatko minua siivoamaan?"], ["Sinä", "[Autan mielelläni!|Autan!|Joo, autan.]", "Sag gern zu."], ["Aino", "Kiitos! Jäätkö sitten syömään?"], ["Sinä", "[Jään mielelläni!|Jään, kiitos!|Kiitos, jään.]", "Sag ja: Du bleibst gern zum Essen."]] },
    { t: "sch", q: "Schreib, wann du angefangen hast, Finnisch zu lernen.", w: ["rupesin", "opiskelemaan"], a: ["Rupesin opiskelemaan suomea lokakuussa.", "Rupesin opiskelemaan suomea vuonna 2026."], h: "ein Satz mit ruveta + -maan" },
    { t: "sch", q: "Schreib, was du als Kind gelernt hast (oppia + -maan).", w: ["opin"], a: ["Lapsena opin uimaan ja hiihtämään.", "Opin lapsena uimaan."], h: "ein Satz" }
  ]
};
