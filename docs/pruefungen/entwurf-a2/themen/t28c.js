module.exports = {
  id: "t28c",
  title: "Bindewörter A2: vaikka, joten, siksi, vaan, kuitenkin (28.3)",
  fi: "En juo kahvia vaan teetä",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t20b", "t23b"],
  th: `<p>Feinheiten zu t28: Sätze sinnvoll verbinden – Grund, Folge, Gegensatz, Ergänzung. Damit werden Erzählungen und kurze Texte (auch in der YKI-Prüfung) viel flüssiger.</p>
<h3>Die wichtigsten Bindewörter</h3>
<table><tr><td>Bedeutung</td><td>Wort</td><td>Beispiel</td></tr>
<tr><td>Grund</td><td>koska (weil)</td><td>En tule, koska olen väsynyt.</td></tr>
<tr><td>Folge</td><td>joten (sodass, also)</td><td>Olin sairas, joten en tullut.</td></tr>
<tr><td>Folge</td><td>siksi (deshalb)</td><td>Olin sairas. Siksi en tullut.</td></tr>
<tr><td>Gegensatz</td><td>vaikka (obwohl)</td><td>Menin ulos, vaikka satoi.</td></tr>
<tr><td>Gegensatz</td><td>kuitenkin (trotzdem, jedoch)</td><td>Satoi. Menin kuitenkin ulos.</td></tr>
<tr><td>Korrektur</td><td>ei …, vaan (nicht …, sondern)</td><td>En juo kahvia vaan teetä.</td></tr>
<tr><td>Ergänzung</td><td>sekä (sowie), lisäksi (außerdem)</td><td>Ostin leipää sekä maitoa. Lisäksi …</td></tr>
<tr><td>Verneinung</td><td>eikä (und nicht)</td><td>Hän ei tullut eikä soittanut.</td></tr></table>
<p class="rule"><b>mutta oder vaan?</b> <i>vaan</i> nur nach einer Verneinung, wenn man etwas korrigiert („nicht A, sondern B“). Sonst <i>mutta</i> (aber). <b>sekä … että</b> = sowohl … als auch: <i>Hän puhuu sekä suomea että ruotsia.</i></p>
<p class="rule"><i>joten</i> verbindet zwei Satzteile (mit Komma davor). <i>siksi</i> steht meist am Anfang eines neuen Satzes. <i>kuitenkin</i> steht meist nach dem Verb: <i>Menin kuitenkin.</i></p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip">Kurzformen: <i>mut</i> = mutta, <i>et</i> = että, <i>ku</i> = kun / koska / kuin. Beim Erzählen hört man auch oft <i>eli</i> (= also, das heißt – auch geschrieben korrekt). <i>Mä en tuu, ku mul ei oo aikaa.</i> (= En tule, koska minulla ei ole aikaa.)</p>`,
  v: [
    ["vaikka", "obwohl"],
    ["joten", "sodass, also (Folge)"],
    ["siksi", "deshalb"],
    ["kuitenkin", "trotzdem, jedoch"],
    ["vaan", "sondern (nach Verneinung)"],
    ["sekä", "sowie, und (sekä … että = sowohl … als auch)"],
    ["lisäksi", "außerdem"],
    ["kokemus", "Erfahrung (kokemusta)"]
  ],
  ex: [
    { t: "tab", q: "Welches Bindewort?", h: "Jedes Kästchen ein Bindewort auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["obwohl", "[vaikka]"], ["deshalb", "[siksi]"], ["trotzdem, jedoch", "[kuitenkin]"], ["sondern", "[vaan]"], ["sodass, also (Folge)", "[joten]"], ["sowie", "[sekä]"], ["außerdem", "[lisäksi]"]] },
    { t: "gap", q: "En juo kahvia, ___ teetä.", h: "sondern (nach Verneinung)", a: ["vaan"] },
    { t: "gap", q: "Menen ulos, ___ sataa.", h: "obwohl", a: ["vaikka"] },
    { t: "gap", q: "Olin sairas, ___ en tullut töihin.", h: "sodass / deshalb (Folge)", a: ["joten", "siksi"] },
    { t: "gap", q: "Sää oli huono. Menimme ___ rannalle.", h: "trotzdem", a: ["kuitenkin"] },
    { t: "gap", q: "Ostin leipää ___ maitoa.", h: "sowie (eher geschrieben)", a: ["sekä", "ja"] },
    { t: "gap", q: "Asunto on iso. ___ asunnossa on sauna.", h: "außerdem", a: ["Lisäksi"] },
    { t: "gap", q: "Hän puhuu ___ suomea että ruotsia.", h: "sowohl … als auch: ___ … että", a: ["sekä"] },
    { t: "tr", dir: "de", q: "Ich bin nicht müde, sondern hungrig.", a: ["En ole väsynyt vaan nälkäinen", "En ole väsynyt, vaan nälkäinen", "En ole väsynyt, vaan minulla on nälkä", "Minä en ole väsynyt vaan nälkäinen"] },
    { t: "tr", dir: "de", q: "Obwohl es regnete, gingen wir hinaus.", a: ["Vaikka satoi, menimme ulos", "Menimme ulos, vaikka satoi", "Vaikka satoi, me menimme ulos"] },
    { t: "tr", dir: "de", q: "Ich habe keine Zeit, deshalb komme ich nicht.", a: ["Minulla ei ole aikaa, joten en tule", "Minulla ei ole aikaa, siksi en tule", "Minulla ei ole aikaa. Siksi en tule"] },
    { t: "tr", dir: "fi", q: "Kurssi oli vaikea, mutta opin kuitenkin paljon.", a: ["Der Kurs war schwer, aber ich habe trotzdem viel gelernt", "Der Kurs war schwierig, aber ich habe trotzdem viel gelernt", "Der Kurs war schwer, aber ich lernte trotzdem viel"] },
    { t: "tr", dir: "fi", q: "Lisäksi tarvitsen passin sekä kuvan.", a: ["Außerdem brauche ich einen Pass sowie ein Foto", "Außerdem brauche ich einen Pass und ein Foto", "Außerdem brauche ich den Pass sowie ein Bild"] },
    { t: "ord", w: ["En", "asu", "Wienissä", "vaan", "Linzissä"], a: ["En asu Wienissä vaan Linzissä."], de: "Ich wohne nicht in Wien, sondern in Linz." },
    { t: "mc", q: "„mutta“ oder „vaan“?", o: ["vaan nur nach Verneinung („nicht …, sondern …“), sonst mutta (aber)", "immer vaan", "immer mutta", "vaan heißt „obwohl“"], a: 0, x: "En juo kahvia vaan teetä. (nicht …, sondern) – Juon kahvia, mutta en teetä. (aber)" },
    { t: "mc", q: "„joten“ und „siksi“ – was stimmt?", o: ["Beide zeigen eine Folge: „…, joten …“ verbindet, „Siksi …“ beginnt meist einen neuen Satz.", "joten heißt „weil“.", "siksi heißt „obwohl“.", "Beide heißen „aber“."], a: 0, x: "Grund: koska (weil). Folge: joten / siksi (deshalb). Gegensatz: vaikka (obwohl), kuitenkin (trotzdem)." },
    { t: "mc", q: "„Hän tuli, ___ hän oli sairas.“ (obwohl) – Welches Wort?", o: ["vaikka", "koska", "joten", "vaan"], a: 0, x: "vaikka = obwohl: Er/Sie kam, obwohl er/sie krank war." },
    { t: "mc", q: "Gesprochen: „Mä tuun, mut vähän myöhemmin.“ – „mut“ ist:", o: ["mutta", "muuta", "mutsi", "muttei"], a: 0, x: "Gesprochen kurz: mut = mutta, et = että, ku = kun/koska/kuin." },
    { t: "mc", q: "Gesprochen: „Mä en tuu, ku mul ei oo aikaa.“ – „ku“ bedeutet hier:", o: ["koska (weil)", "kun (als)", "kuin (als beim Vergleich)", "kuka (wer)"], a: 0, x: "ku steht gesprochen für kun, koska und kuin – der Zusammenhang zeigt es. Hier: weil." },
    { t: "les", q: "Hakemus", txt: ["Hyvä vastaanottaja,", "haen kesätyötä kahvilassanne.", "Minulla on kokemusta asiakaspalvelusta sekä kassatyöstä.", "Lisäksi puhun suomea, englantia ja saksaa.", "En ole vielä työskennellyt Suomessa, mutta opin kuitenkin nopeasti.", "Ystävällisin terveisin Matthias"], qs: [{ q: "Was sucht er?", o: ["einen Sommerjob im Café", "eine Wohnung", "einen Kurs"], a: 0 }, { q: "Welche Erfahrung hat er?", o: ["Kundenservice und Kasse", "Kochen", "Unterrichten"], a: 0 }, { q: "Was sagt er über sich?", o: ["Er lernt schnell.", "Er hat schon in Finnland gearbeitet.", "Er spricht nur Deutsch."], a: 0 }] },
    { t: "les", q: "Huono päivä", txt: ["Eilen oli huono päivä.", "Heräsin myöhään, joten en ehtinyt syödä aamiaista.", "Satoi, vaikka oli kesä.", "Bussi ei tullut, joten kävelin töihin.", "Töissä pomo oli kuitenkin iloinen. Siksi päivä oli lopulta ihan hyvä."], qs: [{ q: "Warum hat er nicht gefrühstückt?", o: ["Er wachte zu spät auf.", "Er hatte keinen Hunger.", "Es gab nichts."], a: 0 }, { q: "Wie kam er zur Arbeit?", o: ["zu Fuß", "mit dem Bus", "mit dem Auto"], a: 0 }, { q: "Wie war der Tag am Ende?", o: ["ganz gut", "sehr schlecht", "langweilig"], a: 0 }] },
    { t: "dlg", q: "Begründen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Tuletko tänään saunaan?"], ["Sinä", "[En tule, koska olen väsynyt.|En, koska olen väsynyt.|En tule, olen väsynyt.]", "Sag nein – weil du müde bist."], ["Aino", "Harmi. Entä huomenna?"], ["Sinä", "[Huomenna tulen kuitenkin!|Huomenna tulen, vaikka olen väsynyt.|Huomenna tulen.]", "Sag: Morgen kommst du trotzdem."]] },
    { t: "dlg", q: "Nicht …, sondern …", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Kollega", "Asutko Wienissä?"], ["Sinä", "[En asu Wienissä vaan Linzissä.|En, vaan Linzissä.|En, asun Linzissä.]", "Sag: nicht in Wien, sondern in Linz."], ["Kollega", "Ja oletko opettaja?"], ["Sinä", "[En ole opettaja vaan insinööri.|En, vaan insinööri.|En, olen insinööri.]", "Sag: nicht Lehrer, sondern Ingenieur."]] },
    { t: "sch", q: "Schreib zwei Sätze über dein Wochenende – einen mit „vaikka“, einen mit „joten“.", w: ["vaikka", "joten"], a: ["Menin ulos, vaikka satoi. Olin väsynyt, joten nukuin pitkään.", "Vaikka satoi, kävin kaupassa. Olin väsynyt, joten nukuin pitkään."], h: "zwei Sätze, Komma vor dem Bindewort" },
    { t: "sch", q: "Schreib einen Satz über dich mit „ei …, vaan …“.", w: ["vaan"], a: ["En asu Wienissä vaan Linzissä.", "En juo kahvia vaan teetä."], h: "ein Satz" }
  ]
};
