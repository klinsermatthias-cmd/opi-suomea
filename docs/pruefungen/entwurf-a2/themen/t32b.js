module.exports = {
  id: "t32b",
  title: "Probleme & Reparaturen in der Wohnung (32.2)",
  fi: "Hana vuotaa",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t31", "t32", "t21b", "t24b", "t25b"],
  th: `<p>Vertiefung zu t32: Probleme in der Wohnung melden – der Wasserhahn tropft, das WC ist verstopft, der Strom ist weg, der Nachbar ist laut – und Mitteilungen der Hausverwaltung verstehen.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Keittiön hana vuotaa.</td><td>Der Wasserhahn in der Küche tropft.</td></tr>
<tr><td>Vessa on tukossa.</td><td>Das WC ist verstopft.</td></tr>
<tr><td>Pesukone ei toimi.</td><td>Die Waschmaschine funktioniert nicht.</td></tr>
<tr><td>Lamppu meni rikki.</td><td>Die Lampe ist kaputtgegangen.</td></tr>
<tr><td>Haluaisin tehdä vikailmoituksen.</td><td>Ich möchte eine Störung melden.</td></tr>
<tr><td>Milloin vika korjataan?</td><td>Wann wird der Schaden repariert?</td></tr>
<tr><td>Naapurin meteli häiritsee minua.</td><td>Der Lärm des Nachbarn stört mich.</td></tr>
</table>
<h3>Was du dafür brauchst</h3>
<p class="rule"><b>Etwas geht kaputt:</b> <i>mennä rikki</i> (Lamppu meni rikki). <b>Zustand:</b> <i>olla rikki / tukossa</i>. <b>Funktioniert nicht:</b> <i>ei toimi</i>. <b>Mitteilungen im Passiv:</b> <i>Vika korjataan huomenna. Vesi suljetaan kello 9–12.</i></p>
<p class="rule"><i>häiritä</i> ist Typ 5 wie <i>tarvita</i>: <i>häiritsen, häiritsee</i>. <i>sulkea</i> hat k → j: <i>suljen, suljetaan</i>. <i>korjata</i>: <i>korjaan, korjataan</i>.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Hana vuotaa ihan koko ajan.</i> · <i>Toi vessa on taas tukossa.</i> · <i>Huoltomies tulee huomenna.</i> (<i>huoltomies</i> = Hausmeister)</p>
<p class="tip"><b>Kulttuuri:</b> In Mietshäusern meldet man Schäden online beim <i>huoltoyhtiö</i> (Hausmeisterfirma) mit einer <i>vikailmoitus</i>. Der <i>isännöitsijä</i> (Hausverwaltung) schickt Mitteilungen an alle. Ein funktionierender <i>palovaroitin</i> (Rauchmelder) ist in jeder Wohnung Pflicht.</p>`,
  v: [
    ["vika", "Fehler, Defekt, Schaden (vian)"],
    ["toimia", "funktionieren (toimii)"],
    ["korjata", "reparieren (korjaan)"],
    ["mennä rikki", "kaputtgehen"],
    ["sulkea", "schließen, abdrehen (suljen)"],
    ["vuotaa", "lecken, tropfen"],
    ["tukossa", "verstopft"],
    ["sähkökatko", "Stromausfall"],
    ["hana", "Wasserhahn"],
    ["patteri", "Heizkörper"],
    ["palovaroitin", "Rauchmelder"],
    ["vikailmoitus", "Störungsmeldung, Schadensmeldung"],
    ["huoltoyhtiö", "Hausmeisterfirma"],
    ["isännöitsijä", "Hausverwalter/in"],
    ["häiritä", "stören (häiritsen)"],
    ["meteli", "Lärm"]
  ],
  ex: [
    { t: "tab", q: "Was ist kaputt?", h: "Jedes Kästchen ein ganzer Satz auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["Der Wasserhahn tropft.", "[Hana vuotaa.]"], ["Das WC ist verstopft.", "[Vessa on tukossa.]"], ["Die Waschmaschine funktioniert nicht.", "[Pesukone ei toimi.]"], ["Die Lampe ist kaputtgegangen.", "[Lamppu meni rikki.]"], ["Der Heizkörper ist kalt.", "[Patteri on kylmä.]"]] },
    { t: "tab", q: "Passiv in Mitteilungen", h: "Jedes Kästchen ein Wort: Passiv Präsens (wird …)", head: ["Grundform", "Passiv"], r: [["korjata", "[korjataan]"], ["sulkea", "[suljetaan]"], ["vaihtaa", "[vaihdetaan]"], ["tarkistaa", "[tarkistetaan]"]], s: 1 },
    { t: "gap", q: "Keittiön hana ___.", h: "vuotaa – Form für „se“", a: ["vuotaa"] },
    { t: "gap", q: "Vessa on ___.", h: "verstopft", a: ["tukossa"] },
    { t: "gap", q: "Astianpesukone ei ___.", h: "toimia – verneint", a: ["toimi"] },
    { t: "gap", q: "Lamppu meni ___.", h: "kaputt", a: ["rikki"] },
    { t: "gap", q: "Vika ___ huomenna.", h: "korjata – Passiv: wird repariert", a: ["korjataan"], s: 1 },
    { t: "gap", q: "Naapurin meteli ___ minua.", h: "häiritä – Form für „se“ (Typ 5: -tse-)", a: ["häiritsee"], s: 1 },
    { t: "gap", q: "Talossa oli eilen ___.", h: "Stromausfall", a: ["sähkökatko"] },
    { t: "tr", dir: "de", q: "Ich möchte eine Störung melden.", a: ["Haluaisin tehdä vikailmoituksen", "Haluan tehdä vikailmoituksen", "Haluaisin ilmoittaa viasta"] },
    { t: "tr", dir: "de", q: "Wann kommt der Hausmeister?", a: ["Milloin huoltomies tulee", "Milloin huolto tulee", "Milloin huoltoyhtiö tulee"] },
    { t: "tr", dir: "de", q: "Der Rauchmelder funktioniert nicht.", a: ["Palovaroitin ei toimi"] },
    { t: "tr", dir: "fi", q: "Vesi suljetaan huomenna kello 9–12.", a: ["Das Wasser wird morgen von 9 bis 12 Uhr abgedreht", "Morgen wird das Wasser von 9 bis 12 Uhr abgestellt"] },
    { t: "tr", dir: "fi", q: "Isännöitsijä lähetti viestin kaikille asukkaille.", a: ["Die Hausverwaltung hat allen Bewohnern eine Nachricht geschickt", "Der Hausverwalter schickte allen Bewohnern eine Nachricht", "Die Hausverwalterin hat allen Bewohnern eine Nachricht geschickt"] },
    { t: "ord", w: ["Kylpyhuoneen", "hana", "vuotaa"], a: ["Kylpyhuoneen hana vuotaa."], de: "Der Wasserhahn im Badezimmer tropft." },
    { t: "mc", q: "Das WC ist verstopft. Wen kontaktierst du?", o: ["huoltoyhtiö", "kampaamo", "matkatoimisto", "kirjasto"], a: 0 },
    { t: "mc", q: "„Lamppu meni rikki.“ – „Lamppu on rikki.“ Was ist der Unterschied?", o: ["meni rikki: ist kaputtgegangen (Veränderung); on rikki: ist kaputt (Zustand)", "Es gibt keinen Unterschied.", "meni rikki ist die Zukunft.", "on rikki ist die Vergangenheit."], a: 0, x: "Veränderung: mennä rikki (ging kaputt). Zustand: olla rikki. Wie mennä naimisiin – olla naimisissa (28.2)." },
    { t: "mc", q: "„Vika korjataan huomenna.“ – Wer repariert?", o: ["Das sagt der Satz nicht: Passiv (wird repariert).", "ich", "der Nachbar", "die Hausverwaltung, weil -taan „sie“ heißt"], a: 0, x: "Das Passiv nennt keine Person: Vika korjataan = Der Schaden wird repariert. In Mitteilungen sehr häufig." },
    { t: "les", q: "Tiedote asukkaille", txt: ["Hyvät asukkaat!", "Talon vesi suljetaan torstaina kello 9–12.", "Kylpyhuoneiden hanoja korjataan.", "Palovaroittimet tarkistetaan ensi viikolla.", "Isännöitsijä"], qs: [{ q: "Was passiert am Donnerstag?", o: ["Das Wasser wird von 9 bis 12 abgedreht.", "Der Strom ist weg.", "Die Hausverwaltung kommt zum Kaffee."], a: 0 }, { q: "Was wird repariert?", o: ["die Wasserhähne in den Bädern", "die Aufzüge", "die Fenster"], a: 0 }, { q: "Was wird nächste Woche kontrolliert?", o: ["die Rauchmelder", "die Heizkörper", "die Waschmaschinen"], a: 0 }] },
    { t: "les", q: "Vikailmoitus", txt: ["Asunto: B 12", "Vika: Keittiön hana vuotaa, ja vessa on tukossa.", "Milloin vika alkoi: eilen illalla", "Saako huoltomies tulla asuntoon, kun olen töissä? Kyllä."], qs: [{ q: "Was ist kaputt?", o: ["der Wasserhahn in der Küche und das WC", "die Heizung", "die Tür"], a: 0 }, { q: "Seit wann?", o: ["seit gestern Abend", "seit einer Woche", "seit heute Morgen"], a: 0 }, { q: "Darf der Hausmeister kommen, wenn niemand zu Hause ist?", o: ["ja", "nein", "nur am Wochenende"], a: 0 }] },
    { t: "dlg", q: "Anruf bei der Hausmeisterfirma", h: "Deine Zeilen auf Finnisch schreiben – höflich", r: [["Huoltoyhtiö", "Huoltoyhtiö, hyvää päivää."], ["Sinä", "[Hei! Keittiön hana vuotaa.|Hyvää päivää! Haluaisin tehdä vikailmoituksen. Hana vuotaa.]", "Grüß und sag, dass der Wasserhahn in der Küche tropft."], ["Huoltoyhtiö", "Mikä on osoite?"], ["Sinä", "[Kauppakatu 5 B 12.|Osoite on Kauppakatu 5 B 12.]", "Nenn die Adresse: Kauppakatu 5 B 12."], ["Huoltoyhtiö", "Huoltomies tulee huomenna aamulla."], ["Sinä", "[Kiitos, se sopii.|Hyvä, kiitos!]", "Bedanke dich – das passt."]] },
    { t: "dlg", q: "Der laute Nachbar", h: "Deine Zeilen auf Finnisch schreiben – höflich", r: [["Naapuri", "Hei! Mitä asiaa?"], ["Sinä", "[Hei! Musiikki on tosi kovalla. Se häiritsee minua.|Hei, voisitteko soittaa musiikkia hiljempaa?]", "Sag höflich, dass die laute Musik dich stört."], ["Naapuri", "Voi anteeksi! Laitan sen hiljemmalle."], ["Sinä", "[Kiitos paljon!|Kiitos!]", "Bedanke dich."]] },
    { t: "sch", q: "Schreib eine kurze Schadensmeldung: Was ist kaputt und seit wann?", w: ["ei toimi"], a: ["Pesukone ei toimi. Vika alkoi eilen.", "Astianpesukone ei toimi eilisestä lähtien."], h: "ein oder zwei Sätze" },
    { t: "sch", q: "Schreib, was in deiner Wohnung einmal kaputtgegangen ist.", w: ["meni rikki"], a: ["Viime viikolla pesukone meni rikki.", "Lamppu meni rikki, ja ostin uuden."], h: "ein Satz in der Vergangenheit" }
  ]
};
