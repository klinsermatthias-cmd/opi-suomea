module.exports = {
  id: "t32",
  title: "Stadt & Dienstleistungen (Mehrzahl in allen Ortsfällen)",
  fi: "Keskustan kaupoissa",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t31", "t30b"],
  th: `<p>Situation: Dienstleistungen in der Stadt – Friseur, Werkstatt, Wäscherei, Flohmarkt, Rathaus, Bibliothek – und über <b>mehrere</b> Orte und Dinge sprechen: <i>kaupoissa</i> (in den Geschäften), <i>kauppoihin</i> (in die Geschäfte).</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Menen kampaamoon. / Menen parturiin.</td><td>Ich gehe zum Friseur.</td></tr>
<tr><td>Auto on korjaamossa.</td><td>Das Auto ist in der Werkstatt.</td></tr>
<tr><td>Keskustan kaupoissa on paljon ihmisiä.</td><td>In den Geschäften im Zentrum sind viele Leute.</td></tr>
<tr><td>Kirpputoreilla voi ostaa halvalla.</td><td>Auf Flohmärkten kann man billig einkaufen.</td></tr>
<tr><td>Kirjastoissa voi lainata kirjoja kirjastokortilla.</td><td>In den Bibliotheken kann man mit dem Ausweis Bücher leihen.</td></tr>
<tr><td>Näissä kaupoissa on ale.</td><td>In diesen Geschäften ist Ausverkauf.</td></tr>
</table>
<h3>Mehrzahl in den Ortsfällen: Stamm + -i- + Endung</h3>
<table><tr><td>Fall</td><td>Einzahl</td><td>Mehrzahl</td></tr>
<tr><td>in</td><td>talossa</td><td>taloissa</td></tr>
<tr><td>hinein</td><td>taloon</td><td>taloihin</td></tr>
<tr><td>aus</td><td>talosta</td><td>taloista</td></tr>
<tr><td>auf / bei</td><td>talolla</td><td>taloilla</td></tr>
<tr><td>hin zu</td><td>talolle</td><td>taloille</td></tr>
<tr><td>von … weg</td><td>talolta</td><td>taloilta</td></tr></table>
<p class="rule">Der Stamm ändert sich wie in der Teilungsform Mehrzahl (t22): <i>kauppa → kaupoissa, kaupunki → kaupungeissa, pieni → pienissä, maa → maissa, työ → töissä</i>. Wohin-Form Mehrzahl meist <b>-ihin</b> (<i>taloihin, kauppoihin</i>), bei langen Stämmen <b>-isiin</b> (<i>huoneisiin</i>). Stufenwechsel wie im Singular: <i>kaupoissa</i> (schwach) – <i>kauppoihin</i> (stark).</p>
<p class="rule">Zeigewörter und Adjektive gehen mit: <i>nämä → näissä, näihin; nuo → noissa; ne → niissä</i>; <i>isoissa kaupungeissa</i>.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mä käyn parturis.</i> (= parturissa) · <i>Kirppis</i> = kirpputori · <i>Näis kaupois</i> (= näissä kaupoissa) – gesprochen fällt das End-a oft weg.</p>
<p class="tip"><b>Kulttuuri:</b> <i>Kirpputorit</i> (Flohmärkte) sind in Finnland sehr beliebt – viele Hallen, in denen jede/r einen Tisch mieten kann. Viele Behördendienste gibt es im <i>palvelupiste</i> der Gemeinde (<i>kunta</i>).</p>`,
  v: [
    ["kampaamo", "Friseursalon"],
    ["kampaaja", "Friseur/in"],
    ["parturi", "Herrenfriseur, Barbier"],
    ["korjaamo", "Werkstatt"],
    ["pesula", "Wäscherei, Reinigung"],
    ["kirpputori", "Flohmarkt"],
    ["tavaratalo", "Kaufhaus"],
    ["kioski", "Kiosk"],
    ["bussipysäkki", "Bushaltestelle"],
    ["poliisiasema", "Polizeistation"],
    ["kaupungintalo", "Rathaus"],
    ["palvelupiste", "Servicestelle, Bürgerbüro"],
    ["palvelu", "Dienstleistung, Service"],
    ["kunta", "Gemeinde (kunnan)"],
    ["asukas", "Einwohner/in (asukkaan)"],
    ["lähiö", "Vorstadtsiedlung"],
    ["jono", "Warteschlange"],
    ["kirjastokortti", "Bibliotheksausweis"],
    ["moni", "viele, manch (monissa = in vielen)"],
    ["esimerkiksi", "zum Beispiel"],
    ["näissä", "in diesen"]
  ],
  ex: [
    { t: "tab", q: "talo in der Mehrzahl", h: "Jedes Kästchen ein Wort: talo in der Mehrzahl (Stamm + -i- + Endung)", head: ["Fall", "talo (Mehrzahl)"], r: [["in", "[taloissa]"], ["hinein", "[taloihin]"], ["aus", "[taloista]"], ["auf / bei", "[taloilla]"], ["hin zu", "[taloille]"], ["von … weg", "[taloilta]"]], s: 1 },
    { t: "tab", q: "Mehrzahl mit Stammänderung", h: "Jedes Kästchen eine Form in der Mehrzahl mit -ssa/-ssä (bei katu -lla); bei zwei Wörtern beide", head: ["Wort", "Mehrzahl"], r: [["kauppa", "[kaupoissa]"], ["kaupunki", "[kaupungeissa]"], ["huone", "[huoneissa]"], ["katu", "[kaduilla]"], ["pieni kahvila", "[pienissä kahviloissa]"], ["maa", "[maissa]"]], s: 1 },
    { t: "gap", q: "Kävin kaikissa ___.", h: "kauppa – Mehrzahl -ssa (Stufenwechsel)", a: ["kaupoissa"], s: 1 },
    { t: "gap", q: "Isoissa ___ on paljon ihmisiä.", h: "kaupunki – Mehrzahl -ssa", a: ["kaupungeissa"], s: 1 },
    { t: "gap", q: "Lapset menevät aamulla eri ___.", h: "koulu – Mehrzahl Wohin-Form: in verschiedene Schulen", a: ["kouluihin"], s: 1 },
    { t: "gap", q: "___ kaupoissa on ale.", h: "nämä in derselben Form wie „kaupoissa“", a: ["Näissä"], s: 1 },
    { t: "gap", q: "Kampaamossa on pitkä ___.", h: "Warteschlange", a: ["jono"] },
    { t: "gap", q: "Lainaan kirjoja ___.", h: "kirjastokortti + -lla: mit dem Ausweis (Stufenwechsel)", a: ["kirjastokortilla"], s: 1 },
    { t: "gap", q: "Auto on ___.", h: "korjaamo + -ssa: in der Werkstatt", a: ["korjaamossa"] },
    { t: "tr", dir: "de", q: "In den Geschäften im Zentrum sind viele Leute.", a: ["Keskustan kaupoissa on paljon ihmisiä"] },
    { t: "tr", dir: "de", q: "Ich gehe zum Friseur.", a: ["Menen kampaamoon", "Menen parturiin", "Menen kampaajalle"] },
    { t: "tr", dir: "de", q: "Wie viele Einwohner hat Linz?", a: ["Montako asukasta Linzissä on", "Kuinka monta asukasta Linzissä on", "Paljonko Linzissä on asukkaita"] },
    { t: "tr", dir: "fi", q: "Kirpputoreilla voi ostaa halvalla.", a: ["Auf Flohmärkten kann man billig einkaufen", "Auf den Flohmärkten kann man günstig kaufen", "Auf Flohmärkten kann man billig kaufen"] },
    { t: "tr", dir: "fi", q: "Kaupungintalolla on palvelupiste.", a: ["Im Rathaus gibt es eine Servicestelle", "Beim Rathaus gibt es eine Servicestelle", "Im Rathaus gibt es ein Bürgerbüro"] },
    { t: "ord", w: ["Lähiöissä", "on", "paljon", "kerrostaloja"], a: ["Lähiöissä on paljon kerrostaloja."], de: "In den Vorstadtsiedlungen gibt es viele Wohnblöcke." },
    { t: "ord", w: ["Mennään", "näihin", "kauppoihin"], a: ["Mennään näihin kauppoihin."], de: "Gehen wir in diese Geschäfte." },
    { t: "mc", q: "Wie heißt „in den Häusern“?", o: ["taloissa", "talotssa", "talossa", "taloihin"], a: 0, x: "Mehrzahl-Ortsfälle: Stamm + -i- + Endung: taloissa, taloihin, taloista, taloilla." },
    { t: "mc", q: "Warum „kaupoissa“ (ein p), aber „kauppoihin“ (pp)?", o: ["Stufenwechsel: vor -ssa schwach, vor -ihin stark", "Das ist ein Tippfehler.", "Die Mehrzahl ist immer schwach.", "Das hängt vom Satz ab."], a: 0, x: "Wie im Singular: kaupassa (schwach) – kauppaan (stark). Mehrzahl: kaupoissa – kauppoihin." },
    { t: "mc", q: "„in diesen Geschäften“ heißt:", o: ["näissä kaupoissa", "nämä kaupoissa", "tässä kaupoissa", "näitä kaupoissa"], a: 0, x: "Zeigewörter in der Mehrzahl gehen mit: nämä → näissä, näihin, näistä; nuo → noissa; ne → niissä." },
    { t: "les", q: "Kaupungin palvelut", txt: ["Kaupungin palvelupisteet ovat auki ma–pe klo 9–16.", "Kirjastoissa voi lainata kirjoja kirjastokortilla.", "Uimahalleissa on alennus opiskelijoille.", "Bussipysäkeillä on aikataulut.", "Monissa lähiöissä on myös oma kirjasto."], qs: [{ q: "Wann sind die Servicestellen offen?", o: ["Mo–Fr 9–16 Uhr", "jeden Tag", "nur abends"], a: 0 }, { q: "Wer bekommt Rabatt in den Hallenbädern?", o: ["Studierende", "Pensionisten", "alle"], a: 0 }, { q: "Was gibt es an den Haltestellen?", o: ["Fahrpläne", "Fahrkarten", "Kioske"], a: 0 }] },
    { t: "les", q: "Lauantai kaupungilla", txt: ["Lauantaina kävin monessa paikassa.", "Ensin kävin parturissa.", "Sitten kävin kirpputoreilla ja ostin vanhoja kirjoja.", "Tavaratalossa oli pitkä jono kassoilla.", "Illalla söin makkaraa kioskilla."], qs: [{ q: "Wo war er zuerst?", o: ["beim Friseur", "am Flohmarkt", "im Kaufhaus"], a: 0 }, { q: "Was kaufte er am Flohmarkt?", o: ["alte Bücher", "Kleidung", "Möbel"], a: 0 }, { q: "Wo gab es eine lange Schlange?", o: ["an den Kassen im Kaufhaus", "beim Friseur", "am Kiosk"], a: 0 }] },
    { t: "dlg", q: "Wo gibt es Flohmärkte?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Matkailija", "Anteeksi, missä täällä on kirpputoreja?"], ["Sinä", "[Keskustassa on kaksi kirpputoria.|Kirpputoreja on keskustassa ja lähiöissä.|Keskustassa.]", "Sag: Im Zentrum gibt es zwei Flohmärkte."], ["Matkailija", "Ovatko ne auki sunnuntaina?"], ["Sinä", "[En tiedä, tarkista netistä.|En tiedä. Tarkista netistä.|En tiedä.]", "Sag, dass du es nicht weißt – sie soll im Internet nachsehen."]] },
    { t: "dlg", q: "Friseurtermin", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Kampaaja", "Kampaamo Kiharat, hei!"], ["Sinä", "[Hei! Haluaisin varata ajan.|Hei, voisinko varata ajan?]", "Sag, dass du einen Termin möchtest."], ["Kampaaja", "Sopiiko torstai kello 15?"], ["Sinä", "[Sopii hyvin!|Sopii, kiitos.|Sopii.]", "Sag ja."]] },
    { t: "sch", q: "Schreib, welche Dienstleistungen es in deiner Wohngegend gibt (mit Mehrzahl).", w: ["asuinalueella"], a: ["Asuinalueella on kauppoja, kahviloita ja kampaamo.", "Asuinalueella on kaksi kauppaa, kirjasto ja bussipysäkkejä."], h: "ein Satz" },
    { t: "sch", q: "Schreib, in was für Städten du schon warst (Mehrzahl -ssa).", w: ["kaupungeissa"], a: ["Olen käynyt isoissa kaupungeissa, esimerkiksi Wienissä ja Helsingissä.", "Olen käynyt monissa kaupungeissa."], h: "ein Satz im Perfekt" }
  ]
};
