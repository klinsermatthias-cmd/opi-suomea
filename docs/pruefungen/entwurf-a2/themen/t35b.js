module.exports = {
  id: "t35b",
  title: "Lesen & Hören: Aushang, Anzeige, Durchsage, Wetterbericht (35.2)",
  fi: "Hyvät matkustajat!",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t31", "t32", "t33", "t34", "t35", "t18b", "t30c", "t32b"],
  th: `<p>Vertiefung zu t35: kurze Alltagstexte schnell verstehen – Aushang im Haus, Kleinanzeige, Durchsage am Bahnhof, Wetterbericht, Werbung und Nachrichten in einfachem Finnisch. Du musst nicht jedes Wort verstehen: Suche <b>Zahl, Zeit, Ort</b> und <b>was anders ist als sonst</b>.</p>
<h3>Textsorten</h3><table>
<tr><td>tiedote</td><td>Mitteilung: Talon vesi suljetaan torstaina.</td></tr>
<tr><td>ilmoitus</td><td>Anzeige: Myydään polkupyörä. Kadonnut: musta kissa.</td></tr>
<tr><td>kuulutus</td><td>Durchsage: Juna on myöhässä 10 minuuttia.</td></tr>
<tr><td>sääennuste</td><td>Wetterbericht: Huomenna sataa lunta.</td></tr>
<tr><td>mainos</td><td>Werbung: Tarjous! Kaikki kengät −30 %.</td></tr>
<tr><td>uutiset</td><td>Nachrichten (radio, lehti, netti)</td></tr></table>
<h3>Was du dafür brauchst</h3>
<p class="rule"><b>Anzeigen im Passiv</b> (t26): <i>Myydään</i> (zu verkaufen), <i>Ostetaan</i> (kaufe), <i>Vuokrataan</i> (zu vermieten), <i>Annetaan</i> (zu verschenken), <i>Etsitään</i> (gesucht). <b>Zustand mit -ttu/-tty</b> (t30c): <i>Juna on peruttu.</i> (fällt aus) <i>Kauppa on suljettu.</i> Nach Zahlen die <b>Teilungsform</b>: <i>15 minuuttia, 10 astetta</i>.</p>
<h3>Durchsagen am Bahnhof</h3><table>
<tr><td>Hyvät matkustajat!</td><td>Sehr geehrte Fahrgäste!</td></tr>
<tr><td>Juna Tampereelle on myöhässä noin 15 minuuttia.</td><td>Der Zug nach Tampere hat etwa 15 Minuten Verspätung.</td></tr>
<tr><td>Juna lähtee raiteelta 4.</td><td>Der Zug fährt von Gleis 4 ab.</td></tr>
<tr><td>Juna on peruttu. Pahoittelemme.</td><td>Der Zug fällt aus. Wir bitten um Entschuldigung.</td></tr></table>
<h3>Himmelsrichtungen</h3>
<table><tr><td>etelä – etelässä</td><td>Süden – im Süden: Etelä-Suomi</td></tr>
<tr><td>pohjoinen – pohjoisessa</td><td>Norden – im Norden: Pohjois-Suomi</td></tr>
<tr><td>itä – idässä</td><td>Osten – im Osten: Itä-Suomi</td></tr>
<tr><td>länsi – lännessä</td><td>Westen – im Westen: Länsi-Suomi</td></tr></table>
<p class="rule">Stufenwechsel: <i>itä → idässä</i> (t → d), <i>länsi → lännessä</i> (wie <i>vesi → vedessä</i>, aber nt → nn). Vor einem Ortsnamen: <i>Etelä-, Pohjois-, Itä-, Länsi-</i>.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip">Durchsagen und Nachrichten sind in Schriftsprache. Im Radio und in Werbung hört man aber auch <i>tää</i> (= tämä), <i>nyt kannattaa tulla!</i> und Zahlen kurz: <i>viis, kuus</i> (= viisi, kuusi). Zum Üben: <i>Selkouutiset</i> von Yle – Nachrichten in einfachem Finnisch, auch zum Hören.</p>`,
  v: [
    ["tiedote", "Mitteilung, Aushang (tiedotteen)"],
    ["ilmoitus", "Anzeige, Bekanntmachung"],
    ["kuulutus", "Durchsage"],
    ["sääennuste", "Wetterbericht, Wettervorhersage"],
    ["uutiset", "Nachrichten"],
    ["selkouutiset", "Nachrichten in einfachem Finnisch"],
    ["mainos", "Werbung"],
    ["lehti", "Zeitung, Zeitschrift; Blatt (lehden)"],
    ["radio", "Radio"],
    ["peruttu", "abgesagt, fällt aus (juna on peruttu)"],
    ["lähtöaika", "Abfahrtszeit"],
    ["raide", "Gleis (raiteelta = von Gleis)"],
    ["kadonnut", "verloren, vermisst"],
    ["varoitus", "Warnung"],
    ["myynti", "Verkauf (myynnissä = zu verkaufen)"],
    ["pahoitella", "bedauern (pahoittelemme = wir bitten um Entschuldigung)"],
    ["etelä", "Süden (etelässä)"],
    ["pohjoinen", "Norden (pohjoisessa)"],
    ["itä", "Osten (idässä)"],
    ["länsi", "Westen (lännessä)"]
  ],
  ex: [
    { t: "tab", q: "Welche Textsorte?", h: "Jedes Kästchen ein Wort: ilmoitus, kuulutus, sääennuste, tiedote oder mainos", head: ["Text", "Textsorte"], r: [["Myydään polkupyörä. Hinta 50 €.", "[ilmoitus]"], ["Hyvät matkustajat, juna on myöhässä.", "[kuulutus]"], ["Huomenna sataa lunta.", "[sääennuste]"], ["Talon vesi suljetaan torstaina. Isännöitsijä", "[tiedote]"], ["Tarjous! Kaikki kengät −30 %.", "[mainos]"]] },
    { t: "tab", q: "Anzeigen im Passiv", h: "Jedes Kästchen ein Wort: Passiv Präsens wie in Anzeigen", head: ["Grundform", "Anzeige"], r: [["myydä", "[myydään]"], ["ostaa", "[ostetaan]"], ["vuokrata", "[vuokrataan]"], ["antaa", "[annetaan]"], ["etsiä", "[etsitään]"]], s: 1 },
    { t: "gap", q: "___ polkupyörä. Hinta 50 euroa.", h: "myydä – Passiv: zu verkaufen", a: ["Myydään"], s: 1 },
    { t: "gap", q: "Juna on ___.", h: "perua – -ttu-Form: fällt aus", a: ["peruttu"], s: 1 },
    { t: "gap", q: "Juna lähtee ___ 4.", h: "raide + -lta (Stufenwechsel d → t: raite-)", a: ["raiteelta"], s: 1 },
    { t: "gap", q: "Pakkasta on 10 ___.", h: "aste – Teilungsform nach einer Zahl", a: ["astetta"], s: 1 },
    { t: "gap", q: "Kauppa ___ kello 21.", h: "sulkea – Passiv Präsens: wird geschlossen", a: ["suljetaan"], s: 1 },
    { t: "gap", q: "___: musta kissa.", h: "verschwunden, vermisst", a: ["Kadonnut"], s: 1 },
    { t: "gap", q: "Pohjoisessa on kylmempää kuin ___.", h: "etelä – Wo-Form: im Süden", a: ["etelässä"], s: 1 },
    { t: "gap", q: "Aurinko nousee ___ ja laskee länteen.", h: "itä + -sta: aus dem Osten (Stufenwechsel t → d)", a: ["idästä"], s: 1 },
    { t: "gap", q: "Helsinki on ___-Suomessa.", h: "etelä vor einem Ortsnamen – nur den ersten Teil vor dem Bindestrich eintippen", a: ["Etelä"], s: 1 },
    { t: "tr", dir: "de", q: "Der Zug nach Tampere hat Verspätung.", a: ["Juna Tampereelle on myöhässä", "Tampereen juna on myöhässä"] },
    { t: "tr", dir: "de", q: "Morgen schneit es im Norden.", a: ["Huomenna pohjoisessa sataa lunta", "Huomenna sataa lunta pohjoisessa", "Pohjoisessa sataa huomenna lunta"] },
    { t: "tr", dir: "fi", q: "Hyvät matkustajat, juna lähtee raiteelta kolme.", a: ["Sehr geehrte Fahrgäste, der Zug fährt von Gleis drei ab", "Liebe Fahrgäste, der Zug fährt von Gleis drei ab", "Sehr geehrte Fahrgäste, der Zug fährt von Gleis 3 ab"] },
    { t: "tr", dir: "fi", q: "Kuuntelen uutisia radiosta.", a: ["Ich höre Nachrichten im Radio", "Ich höre die Nachrichten im Radio"] },
    { t: "ord", w: ["Juna", "on", "myöhässä", "noin", "kymmenen", "minuuttia"], a: ["Juna on myöhässä noin kymmenen minuuttia."], de: "Der Zug hat etwa zehn Minuten Verspätung." },
    { t: "mc", q: "Am Bahnhof hörst du: „Juna on peruttu.“ Was bedeutet das?", o: ["Der Zug fällt aus.", "Der Zug ist pünktlich.", "Der Zug ist voll.", "Der Zug fährt früher."], a: 0 },
    { t: "mc", q: "Warum steht in Anzeigen „Myydään“?", o: ["Passiv: Es wird verkauft – wer verkauft, ist unwichtig.", "Es ist ein Befehl.", "Es ist die wir-Form.", "Es ist die Vergangenheit."], a: 0, x: "Anzeigen nutzen das Passiv (t26): Myydään, Ostetaan, Vuokrataan, Annetaan, Etsitään." },
    { t: "mc", q: "„Juna on peruttu.“ – Was für eine Form ist „peruttu“?", o: ["-ttu-Form (Passiv-Mittelwort): ein Zustand – ist abgesagt", "Vergangenheit für „hän“", "Befehl", "Teilungsform"], a: 0, x: "Wie in t30c: Kauppa on suljettu. Talo on rakennettu 1950. Juna on peruttu." },
    { t: "mc", q: "Im Wetterbericht: „Pakkasta on 10 astetta.“ Wie kalt ist es?", o: ["minus 10 Grad", "plus 10 Grad", "10 Zentimeter Schnee", "10 Tage Frost"], a: 0, x: "pakkanen = Frost, Grad unter null. Nach Zahlen steht die Teilungsform: 10 astetta, 15 minuuttia." },
    { t: "les", q: "Kuulutus asemalla", txt: ["Hyvät matkustajat!", "Juna IC 27 Tampereelle on myöhässä noin 20 minuuttia.", "Uusi lähtöaika on kello 14.35.", "Juna lähtee raiteelta 6.", "Juna IC 45 Turkuun on peruttu.", "Pahoittelemme."], qs: [{ q: "Wie viel Verspätung hat der Zug nach Tampere?", o: ["etwa 20 Minuten", "eine Stunde", "keine"], a: 0 }, { q: "Von welchem Gleis fährt er?", o: ["Gleis 6", "Gleis 2", "Gleis 14"], a: 0 }, { q: "Was ist mit dem Zug nach Turku?", o: ["Er fällt aus.", "Er ist pünktlich.", "Er fährt auch von Gleis 6."], a: 0 }] },
    { t: "les", q: "Sääennuste", txt: ["Huomenna Etelä-Suomessa on pilvistä, ja iltapäivällä sataa lunta.", "Lämpötila on noin nolla astetta.", "Pohjois-Suomessa on aurinkoista, mutta pakkasta on 20 astetta.", "Varoitus: tiet ovat liukkaita!"], qs: [{ q: "Wie ist das Wetter morgen im Süden?", o: ["bewölkt, nachmittags Schnee", "sonnig", "den ganzen Tag Regen"], a: 0 }, { q: "Wie kalt ist es im Norden?", o: ["minus 20 Grad", "null Grad", "plus 20 Grad"], a: 0 }, { q: "Wovor wird gewarnt?", o: ["vor glatten Straßen", "vor Sturm", "vor Hitze"], a: 0 }] },
    { t: "les", q: "Selkouutiset", txt: ["Suomessa oli eilen ensimmäinen lumi.", "Etelä-Suomessa satoi lunta noin viisi senttiä.", "Monet ihmiset tulivat töihin myöhässä, koska tiet olivat liukkaita.", "Huomenna sää on lämpimämpi."], qs: [{ q: "Was war gestern?", o: ["der erste Schnee", "ein Sturm", "ein Feiertag"], a: 0 }, { q: "Warum kamen viele zu spät zur Arbeit?", o: ["Die Straßen waren glatt.", "Die Züge fielen aus.", "Es war ein Feiertag."], a: 0 }, { q: "Wie wird das Wetter morgen?", o: ["wärmer", "kälter", "wie heute"], a: 0 }] },
    { t: "dlg", q: "Am Bahnhof nachfragen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Virkailija", "Hei, miten voin auttaa?"], ["Sinä", "[Hei! Onko juna Tampereelle myöhässä?|Anteeksi, onko Tampereen juna myöhässä?|Hei, onko juna Tampereelle myöhässä?]", "Frag, ob der Zug nach Tampere Verspätung hat."], ["Virkailija", "On, noin 20 minuuttia. Se lähtee raiteelta 6."], ["Sinä", "[Kiitos! Raiteelta 6.|Kiitos paljon!|Selvä, kiitos.]", "Bedanke dich."]] },
    { t: "dlg", q: "Anruf wegen einer Anzeige", h: "Deine Zeilen auf Finnisch schreiben – höflich", r: [["Myyjä", "Haloo?"], ["Sinä", "[Hei! Soitan ilmoituksesta. Onko polkupyörä vielä myynnissä?|Hei, onko polkupyörä vielä myynnissä?|Hei! Onko polkupyörä vielä myynnissä?]", "Grüß und frag, ob das Fahrrad aus der Anzeige noch zu haben ist."], ["Myyjä", "On. Hinta on 50 euroa."], ["Sinä", "[Voinko tulla katsomaan sitä tänään?|Voisinko tulla katsomaan sitä tänään?|Voinko tulla katsomaan sitä?]", "Frag, ob du es heute anschauen kommen kannst."]] },
    { t: "sch", q: "Schreib eine kurze Anzeige: Du verkaufst etwas (Myydään …, Hinta …).", w: ["myydään"], a: ["Myydään polkupyörä. Hinta 50 euroa.", "Myydään sohva. Hinta 100 euroa. Soita!"], h: "zwei kurze Sätze wie in einer Anzeige" },
    { t: "sch", q: "Schreib einen kurzen Wetterbericht für morgen.", w: ["huomenna"], a: ["Huomenna on aurinkoista, ja lämpötila on 20 astetta.", "Huomenna sataa vettä, ja tuulee paljon."], h: "ein oder zwei Sätze" }
  ]
};
