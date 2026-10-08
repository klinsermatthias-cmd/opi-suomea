module.exports = {
  id: "t30b",
  title: "Natur & Umwelt: Mülltrennung, Wetterextreme (30.2)",
  fi: "Roskat lajitellaan",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t23c"],
  th: `<p>Vertiefung zu t30: Umwelt im Alltag – Müll trennen, Pfand, Energie sparen – und Nachrichten über Sturm und Überschwemmung verstehen. Regeln dazu stehen fast immer im <b>Passiv</b>.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Suomessa roskat lajitellaan.</td><td>In Finnland wird der Müll getrennt.</td></tr>
<tr><td>Biojäte viedään ruskeaan astiaan.</td><td>Biomüll kommt in den braunen Behälter.</td></tr>
<tr><td>Pullot palautetaan kauppaan.</td><td>Flaschen bringt man ins Geschäft zurück.</td></tr>
<tr><td>Meidän pitää säästää sähköä.</td><td>Wir müssen Strom sparen.</td></tr>
<tr><td>Sammutan valot, kun lähden.</td><td>Ich schalte das Licht aus, wenn ich gehe.</td></tr>
<tr><td>Ilmastonmuutos on iso ongelma.</td><td>Der Klimawandel ist ein großes Problem.</td></tr>
</table>
<h3>Regeln im Passiv</h3>
<table><tr><td>Grundform</td><td>Passiv</td></tr>
<tr><td>lajitella (trennen)</td><td>lajitellaan</td></tr>
<tr><td>kierrättää (recyceln)</td><td>kierrätetään</td></tr>
<tr><td>viedä (hinbringen)</td><td>viedään</td></tr>
<tr><td>palauttaa (zurückbringen)</td><td>palautetaan</td></tr>
<tr><td>säästää (sparen)</td><td>säästetään</td></tr></table>
<p class="rule">Hausordnungen und Anleitungen benutzen das Passiv (t26): <i>Roskat lajitellaan.</i> Wer muss: Person mit -n + <i>pitää / täytyy</i> (15.3): <i>Meidän pitää säästää energiaa.</i></p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>roskis</i> = Mülleimer · <i>Vieksä roskat?</i> (= Vietkö sinä roskat? – Bringst du den Müll raus?) · <i>Pullot palautukseen!</i></p>
<p class="tip"><b>Kulttuuri:</b> Für Flaschen und Dosen zahlt man in Finnland Pfand – über 90 % kommen zurück (<i>pullonpalautus</i> im Supermarkt). In Wohnhäusern gibt es eigene Behälter (<i>astiat</i>) für Bio, Karton, Plastik, Glas, Metall und Papier.</p>`,
  v: [
    ["ympäristö", "Umwelt"],
    ["ilmasto", "Klima"],
    ["ilmastonmuutos", "Klimawandel"],
    ["ongelma", "Problem"],
    ["roska", "Abfall (roskat = der Müll)"],
    ["astia", "Behälter, Gefäß"],
    ["lajitella", "trennen, sortieren (lajittelen)"],
    ["kierrättää", "recyceln (kierrätän)"],
    ["muovi", "Plastik"],
    ["pahvi", "Karton"],
    ["paperi", "Papier"],
    ["metalli", "Metall"],
    ["biojäte", "Biomüll (biojätteen)"],
    ["pullonpalautus", "Flaschenrückgabe (Pfandautomat)"],
    ["säästää", "sparen (säästän)"],
    ["sähkö", "Strom, Elektrizität"],
    ["sammuttaa", "ausschalten, löschen (sammutan)"],
    ["luonnonsuojelu", "Naturschutz"],
    ["myrsky", "Sturm"],
    ["tulva", "Überschwemmung, Hochwasser"]
  ],
  ex: [
    { t: "tab", q: "Was ist das?", h: "Jedes Kästchen ein Wort auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["Plastik", "[muovi]"], ["Karton", "[pahvi]"], ["Papier", "[paperi]"], ["Biomüll", "[biojäte]"], ["Metall", "[metalli]"], ["Glas", "[lasi]"]] },
    { t: "tab", q: "Regeln im Passiv", h: "Jedes Kästchen ein Wort: Passiv Präsens (man …)", head: ["Grundform", "Passiv"], r: [["lajitella", "[lajitellaan]"], ["kierrättää", "[kierrätetään]"], ["säästää", "[säästetään]"], ["viedä", "[viedään]"], ["palauttaa", "[palautetaan]"]], s: 1 },
    { t: "gap", q: "Suomessa roskat ___.", h: "lajitella – Passiv: man trennt", a: ["lajitellaan"], s: 1 },
    { t: "gap", q: "Pullot ___ kauppaan.", h: "palauttaa – Passiv: man bringt zurück", a: ["palautetaan"], s: 1 },
    { t: "gap", q: "Meidän pitää ___ sähköä.", h: "sparen – Grundform", a: ["säästää"] },
    { t: "gap", q: "Eilen oli kova ___.", h: "Sturm", a: ["myrsky"] },
    { t: "gap", q: "Vie ___ ulos!", h: "der Müll (Mehrzahl)", a: ["roskat"] },
    { t: "gap", q: "___ muuttuu nopeasti.", h: "Klima", a: ["Ilmasto"] },
    { t: "gap", q: "___ valot, kun lähdet!", h: "sammuttaa – Befehl an „sinä“ (tt → t)", a: ["Sammuta"], s: 1 },
    { t: "tr", dir: "de", q: "Ich trenne Plastik, Papier und Biomüll.", a: ["Lajittelen muovin, paperin ja biojätteen", "Lajittelen muovit, paperit ja biojätteet", "Minä lajittelen muovin, paperin ja biojätteen", "Lajittelen muovia, paperia ja biojätettä"] },
    { t: "tr", dir: "de", q: "Ich recycle viel.", a: ["Kierrätän paljon", "Minä kierrätän paljon"] },
    { t: "tr", dir: "de", q: "Nach dem Sturm gab es eine Überschwemmung.", a: ["Myrskyn jälkeen tuli tulva", "Myrskyn jälkeen oli tulva"] },
    { t: "tr", dir: "fi", q: "Ilmastonmuutos on iso ongelma.", a: ["Der Klimawandel ist ein großes Problem"] },
    { t: "tr", dir: "fi", q: "Pullonpalautuksesta saa rahaa.", a: ["Für die Flaschenrückgabe bekommt man Geld", "Bei der Flaschenrückgabe bekommt man Geld", "Für Pfandflaschen bekommt man Geld"] },
    { t: "ord", w: ["Biojäte", "viedään", "ruskeaan", "astiaan"], a: ["Biojäte viedään ruskeaan astiaan."], de: "Biomüll kommt in den braunen Behälter." },
    { t: "mc", q: "Wohin kommt eine Bananenschale?", o: ["biojätteeseen", "muoviin", "paperiin", "metalliin"], a: 0 },
    { t: "mc", q: "Was bekommt man bei der „pullonpalautus“?", o: ["Pfandgeld für Flaschen und Dosen", "eine neue Flasche", "eine Strafe", "nichts"], a: 0 },
    { t: "mc", q: "„Roskat lajitellaan.“ – Was bedeutet das?", o: ["Der Müll wird getrennt. / Man trennt den Müll.", "Ich trenne den Müll.", "Trenn den Müll!", "Der Müll wurde getrennt."], a: 0, x: "Passiv Präsens (t26): „man …“ oder „wird …“. Sehr häufig in Regeln. Vergangenheit: lajiteltiin (t30)." },
    { t: "mc", q: "Warum „Meidän pitää säästää“ und nicht „Me pitää säästää“?", o: ["pitää (müssen) will die Person mit -n: minun, meidän", "Das ist Umgangssprache.", "pitää braucht immer „me“.", "Weil säästää Typ 1 ist."], a: 0, x: "Notwendigkeit: Person mit -n + pitää / täytyy + Grundform (15.3): Meidän pitää säästää energiaa." },
    { t: "les", q: "Hyvät naapurit!", txt: ["Hyvät naapurit!", "Lajitelkaa roskat.", "Muovi viedään muoviastiaan ja pahvi pahviastiaan.", "Biojäte viedään ruskeaan astiaan.", "Pullot palautetaan kauppaan.", "Kiitos, että huolehditte ympäristöstä!"], qs: [{ q: "Wohin kommt Biomüll?", o: ["in den braunen Behälter", "ins Geschäft", "in den Plastikbehälter"], a: 0 }, { q: "Was macht man mit Flaschen?", o: ["ins Geschäft zurückbringen", "in den Biomüll werfen", "in den Kartonbehälter"], a: 0 }, { q: "An wen ist der Aushang?", o: ["an die Nachbarn im Haus", "an Kunden eines Geschäfts", "an Kinder in der Schule"], a: 0 }] },
    { t: "les", q: "Sääuutinen", txt: ["Eilen illalla Suomessa oli kova myrsky.", "Monessa paikassa ei ollut sähköä.", "Helsingissä oli tulva rannalla.", "Ilmasto muuttuu, ja myrskyjä voi tulla enemmän kuin ennen."], qs: [{ q: "Was passierte gestern Abend?", o: ["ein starker Sturm", "ein Erdbeben", "viel Schnee"], a: 0 }, { q: "Was fehlte an vielen Orten?", o: ["Strom", "Wasser", "Internet"], a: 0 }, { q: "Was sagt der Text über das Klima?", o: ["Es ändert sich – es kann mehr Stürme geben.", "Es bleibt gleich.", "Es wird kälter."], a: 0 }] },
    { t: "dlg", q: "Wohin damit?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Mihin tämä muovipullo menee?"], ["Sinä", "[Pullot palautetaan kauppaan.|Se palautetaan kauppaan.|Kauppaan, pullonpalautukseen.]", "Sag: Flaschen bringt man ins Geschäft zurück."], ["Aino", "Entä tämä pahvi?"], ["Sinä", "[Pahviastiaan.|Se viedään pahviastiaan.|Pahvi viedään pahviastiaan.]", "Sag: in den Kartonbehälter."]] },
    { t: "dlg", q: "Strom sparen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Kollega", "Miten sinä säästät sähköä?"], ["Sinä", "[Sammutan valot.|Sammutan aina valot.|Sammutan valot, kun lähden.]", "Sag: Du schaltest das Licht aus."], ["Kollega", "Entä vettä?"], ["Sinä", "[Käyn nopeasti suihkussa.|Käyn lyhyesti suihkussa.]", "Sag: Du duschst kurz."]] },
    { t: "sch", q: "Schreib, wie du zu Hause Müll trennst.", w: ["lajittelen"], a: ["Lajittelen muovin, paperin ja biojätteen.", "Kotona lajittelen muovin, pahvin ja biojätteen."], h: "ein Satz" },
    { t: "sch", q: "Schreib eine Regel für dein Haus im Passiv.", w: ["viedään"], a: ["Roskat viedään ulos joka päivä.", "Biojäte viedään ruskeaan astiaan."], h: "ein Satz im Passiv" }
  ]
};
