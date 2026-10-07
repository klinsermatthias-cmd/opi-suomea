/* Opi suomea – inhalte.js: Lerninhalte der Grundthemen t01–t08 (BASE_TOPICS). Weitere Themen: lektionen/lektionen.json.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
/* ============================================================
   LERNINHALTE – Paket 1 (A0). Neue Pakete werden hier ergänzt.
   ============================================================ */
const BASE_TOPICS = [
  {
    id: "t01",
    title: "Aussprache & Alphabet",
    fi: "Ääntäminen",
    lvl: "A1.1",
    req: [],
    th: `<p>Gute Nachricht zuerst: Finnisch wird fast genau so gesprochen, wie es geschrieben wird. Jeder Buchstabe hat immer denselben Laut.</p>
<h3>Die Betonung</h3>
<p class="rule">Betont wird <b>immer die erste Silbe</b>: <i>KII-tos</i>, <i>SAU-na</i>, <i>HEL-sinki</i>.</p>
<h3>Die Vokale</h3>
<table><tr><td>a, e, i, o, u</td><td>wie im Deutschen</td></tr><tr><td>y</td><td>wie deutsches <b>ü</b> – <i>yksi</i> (eins)</td></tr><tr><td>ä</td><td>sehr offen, wie das a in engl. „cat“ – <i>järvi</i> (See)</td></tr><tr><td>ö</td><td>wie deutsches ö – <i>yö</i> (Nacht)</td></tr></table>
<h3>Lang oder kurz ändert die Bedeutung</h3>
<p>Doppelt geschriebene Buchstaben werden länger gesprochen. Das ist kein Detail, sondern ein anderes Wort:</p>
<table><tr><td>tuli</td><td>Feuer</td></tr><tr><td>tuuli</td><td>Wind</td></tr><tr><td>muta</td><td>Schlamm</td></tr><tr><td>mutta</td><td>aber</td></tr></table>
<h3>Falle für Deutschsprachige</h3>
<p class="tip">Vokalpaare werden als <b>beide Laute</b> gesprochen, nicht wie im Deutschen zusammengezogen.</p>
<table><tr><td>ei</td><td>e + i, wie engl. „hey“ – nicht wie „Eis“</td></tr><tr><td>ie</td><td>i + e: <i>tie</i> (Weg) = „ti-e“ – nicht wie „Lied“</td></tr><tr><td>eu</td><td>e + u – nicht wie „Euro“</td></tr><tr><td>yö</td><td>ü + ö: <i>yö</i> (Nacht)</td></tr></table>
<h3>Konsonanten</h3>
<ul><li><b>r</b> wird gerollt (Zungenspitzen-r).</li><li><b>s</b> ist immer scharf wie in „Bus“.</li><li><b>h</b> wird immer gesprochen, auch mitten im Wort: <i>lahti</i> (Bucht).</li><li><b>v</b> klingt wie deutsches w, <b>j</b> wie deutsches j.</li><li><b>k, p, t</b> klingen weicher, ohne Hauch.</li><li>Doppelte Konsonanten werden gehalten: <i>kissa</i> = „kis-sa“.</li></ul>`,
    v: [
      ["kiitos", "danke"],
      ["kyllä", "ja"],
      ["ei", "nein"],
      ["talo", "Haus"],
      ["tie", "Weg, Straße"],
      ["yö", "Nacht"],
      ["kissa", "Katze"],
      ["koira", "Hund"],
      ["järvi", "See"],
      ["metsä", "Wald"],
      ["tuuli", "Wind"],
      ["kuu", "Mond"]
    ],
    ex: [
      {
        t: "mc",
        q: "Wie spricht man das finnische „y“ aus?",
        o: ["wie deutsches ü", "wie deutsches i", "wie deutsches j", "wie „ai“"],
        a: 0,
        x: "y = ü, z. B. yksi (eins)."
      },
      {
        t: "mc",
        q: "Welche Silbe wird im Finnischen betont?",
        o: ["immer die erste", "immer die letzte", "die vorletzte", "das ist unterschiedlich"],
        a: 0,
        x: "Die Betonung liegt immer auf der ersten Silbe."
      },
      {
        t: "mc",
        q: "„tuli“ heißt Feuer. Was ist „tuuli“?",
        o: ["ein anderes Wort (Wind)", "dasselbe, nur betont", "die Mehrzahl von tuli", "ein Rechtschreibfehler"],
        a: 0,
        x: "Lange Vokale ändern die Bedeutung: tuuli = Wind."
      },
      {
        t: "mc",
        q: "Wie spricht man „tie“ (Weg) aus?",
        o: ["ti-e, beide Vokale hörbar", "wie „Lied“ mit langem i", "wie „tei“", "wie „tö“"],
        a: 0,
        x: "ie = i + e, nicht wie das deutsche ie."
      },
      {
        t: "mc",
        q: "Wie klingt „ei“ (nein)?",
        o: ["e + i, ähnlich wie engl. „hey“", "wie in „Eis“", "wie ein langes e", "wie „oi“"],
        a: 0,
        x: "Finnisches ei klingt nicht wie deutsches ei."
      },
      {
        t: "mc",
        q: "Wie wird das „s“ in „sauna“ gesprochen?",
        o: ["scharf wie in „Bus“", "weich wie in „Sonne“", "wie „sch“", "wie „z“"],
        a: 0,
        x: "Das finnische s ist immer stimmlos."
      },
      {
        t: "mc",
        q: "Was bedeutet das Doppel-s in „kissa“?",
        o: ["das s wird länger gehalten", "das s ist stumm", "das i wird lang", "nichts, nur Schreibweise"],
        a: 0,
        x: "kis-sa: Der Konsonant wird gehalten."
      },
      {
        t: "mc",
        q: "Welches Wort hat einen langen Vokal?",
        o: ["tuuli", "tuli", "talo", "kissa"],
        a: 0,
        x: "uu = langes u."
      },
      { t: "tr", dir: "de", q: "danke", a: ["kiitos"] },
      { t: "tr", dir: "de", q: "Wald", a: ["metsä"] },
      { t: "tr", dir: "fi", q: "järvi", a: ["See", "der See", "ein See"] },
      { t: "mc", q: "Welches Wort bedeutet „Wind“?", o: ["tuuli", "tuli", "tulli", "tie"], a: 0 },
      { t: "mc", q: "Wie spricht man „y“?", o: ["wie deutsches ü", "wie i", "wie j", "wie u"], a: 0 },
      {
        t: "mc",
        q: "Wie spricht man „ä“?",
        o: ["sehr offen, wie das a in engl. „cat“", "wie e in „See“", "wie a", "wie ei"],
        a: 0
      },
      { t: "mc", q: "Was bedeutet „kissa“?", o: ["Katze", "Hund", "Haus", "See"], a: 0 },
      { t: "tr", dir: "de", q: "Hund", a: ["koira"] },
      { t: "tr", dir: "de", q: "Haus", a: ["talo"] },
      { t: "tr", dir: "fi", q: "kuu", a: ["Mond", "der Mond"] },
      { t: "mc", q: "Welches Wort hat einen doppelten Konsonanten?", o: ["kissa", "koira", "talo", "tie"], a: 0 },
      {
        t: "mc",
        q: "Wie spricht man „ei“ (nein)?",
        o: ["e + i, wie engl. „hey“", "wie in „Eis“", "wie langes e", "wie i"],
        a: 0
      },
      { t: "tr", dir: "de", q: "Nacht", a: ["yö"] },
      {
        t: "mc",
        q: "Wie spricht man das h in „lahti“?",
        o: ["hörbar, gehaucht", "gar nicht", "wie ch in „ach“", "wie k"],
        a: 0
      }
    ]
  },

  {
    id: "t02",
    title: "Begrüßungen & Höflichkeit",
    fi: "Tervehdykset",
    lvl: "A1.1",
    req: ["t01"],
    th: `<p>Finn*innen sind sprachlich unkompliziert: Man duzt sich fast immer, auch im Job.</p>
<h3>Hallo und Tschüss</h3>
<table><tr><td>Moi! / Hei!</td><td>Hallo (locker)</td></tr><tr><td>Moi moi! / Heippa!</td><td>Tschüss</td></tr><tr><td>Hyvää huomenta</td><td>Guten Morgen</td></tr><tr><td>Hyvää päivää</td><td>Guten Tag (förmlich)</td></tr><tr><td>Hyvää iltaa</td><td>Guten Abend</td></tr><tr><td>Hyvää yötä</td><td>Gute Nacht</td></tr><tr><td>Näkemiin</td><td>Auf Wiedersehen (förmlich)</td></tr></table>
<p class="tip"><i>Hyvää</i> heißt „einen guten …“. Du hängst einfach die Tageszeit an.</p>
<h3>Höflich sein</h3>
<table><tr><td>Kiitos</td><td>Danke</td></tr><tr><td>Kiitos paljon</td><td>Vielen Dank</td></tr><tr><td>Ole hyvä</td><td>Bitte (beim Geben) / Gern geschehen</td></tr><tr><td>Ei kestä</td><td>Gern geschehen (Antwort auf „Kiitos“)</td></tr><tr><td>Anteeksi</td><td>Entschuldigung</td></tr><tr><td>Kyllä / Joo</td><td>Ja (joo ist locker)</td></tr><tr><td>Ei</td><td>Nein</td></tr></table>
<h3>Ein kleines Gespräch</h3>
<table><tr><td>Moi! Mitä kuuluu?</td><td>Hallo! Wie geht’s?</td></tr><tr><td>Hyvää, kiitos. Entä sinulle?</td><td>Gut, danke. Und dir?</td></tr><tr><td>Ihan hyvää. Minun nimeni on Matthias.</td><td>Ganz gut. Mein Name ist Matthias.</td></tr><tr><td>Hauska tutustua!</td><td>Freut mich!</td></tr></table>
<p class="tip"><i>Mitä kuuluu?</i> heißt wörtlich „Was ist zu hören?“</p>`,
    v: [
      ["moi", "hallo"],
      ["moi moi", "tschüss"],
      ["hyvää huomenta", "guten Morgen"],
      ["hyvää päivää", "guten Tag"],
      ["hyvää iltaa", "guten Abend"],
      ["hyvää yötä", "gute Nacht"],
      ["näkemiin", "auf Wiedersehen"],
      ["kiitos paljon", "vielen Dank"],
      ["ole hyvä", "bitte (beim Geben) / gern geschehen"],
      ["anteeksi", "Entschuldigung"],
      ["mitä kuuluu?", "wie geht’s?"],
      ["entä sinulle?", "und dir?"],
      ["hauska tutustua", "freut mich"],
      ["joo", "ja (umgangssprachlich)"],
      ["ei kestä", "gern geschehen, keine Ursache (Antwort auf kiitos)"]
    ],
    ex: [
      { t: "mc", q: "Was sagst du am Morgen?", o: ["Hyvää huomenta", "Hyvää yötä", "Näkemiin", "Anteeksi"], a: 0 },
      {
        t: "mc",
        q: "Was bedeutet „Ole hyvä“?",
        o: ["bitte / gern geschehen", "Entschuldigung", "Wie geht’s?", "Gute Besserung"],
        a: 0
      },
      {
        t: "mc",
        q: "„Mitä kuuluu?“ – welche Antwort passt?",
        o: ["Hyvää, kiitos.", "Näkemiin.", "Anteeksi.", "Hyvää yötä."],
        a: 0
      },
      { t: "mc", q: "Wie verabschiedest du dich förmlich?", o: ["Näkemiin", "Moi", "Kiitos", "Hei"], a: 0 },
      { t: "gap", q: "Hyvää ___!", h: "Guten Abend", a: ["iltaa"] },
      { t: "gap", q: "Kiitos ___!", h: "Vielen Dank", a: ["paljon"] },
      {
        t: "ord",
        w: ["Minun", "nimeni", "on", "Matthias"],
        a: "Minun nimeni on Matthias.",
        de: "Mein Name ist Matthias."
      },
      { t: "tr", dir: "de", q: "Entschuldigung", a: ["anteeksi"] },
      { t: "tr", dir: "de", q: "Freut mich!", a: ["hauska tutustua", "hauska tavata"] },
      { t: "tr", dir: "de", q: "Gute Nacht", a: ["hyvää yötä"] },
      { t: "tr", dir: "fi", q: "Moi moi!", a: ["Tschüss", "Tschüs", "Ciao", "Baba", "Tschau"] },
      {
        t: "les",
        q: "Aamulla",
        txt: [
          "Aino: Hyvää huomenta, Matthias!",
          "Matthias: Huomenta! Mitä kuuluu?",
          "Aino: Kiitos, hyvää. Entä sinulle?",
          "Matthias: Ihan hyvää, kiitos.",
          "Aino: Moi moi!"
        ],
        qs: [
          { q: "Welche Tageszeit ist es?", o: ["Morgen", "Abend", "Nacht"], a: 0 },
          { q: "Wie geht es Matthias?", o: ["ganz gut", "schlecht", "er ist müde"], a: 0 }
        ]
      },
      {
        t: "dlg",
        q: "Begrüßung",
        h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen",
        r: [
          ["Aino", "Hyvää päivää!"],
          ["Sinä", "[Hyvää päivää!|Päivää!|Moi!|Hei!]", "Grüße zurück."],
          ["Aino", "Mitä kuuluu?"],
          [
            "Sinä",
            "[Hyvää, kiitos. Entä sinulle?|Kiitos, hyvää. Entä sinulle?|Hyvää, kiitos!|Kiitos hyvää, entä sinulle?]",
            "Antworte und frag zurück."
          ],
          ["Aino", "Hyvää, kiitos! Näkemiin!"],
          ["Sinä", "[Näkemiin!|Moi moi!]", "Verabschiede dich."]
        ]
      },
      {
        t: "sch",
        q: "Begrüße jemanden am Abend und sag „Freut mich!“.",
        w: ["hyvää iltaa", "hauska tutustua"],
        a: ["Hyvää iltaa! Hauska tutustua.", "Hyvää iltaa, hauska tutustua!"],
        h: "ein oder zwei kurze Sätze auf Finnisch"
      },
      {
        t: "mc",
        q: "Du kommst am Abend an. Du sagst:",
        o: ["Hyvää iltaa!", "Hyvää yötä!", "Hyvää huomenta!", "Näkemiin!"],
        a: 0
      },
      {
        t: "mc",
        q: "Du gehst schlafen. Du sagst:",
        o: ["Hyvää yötä!", "Hyvää iltaa!", "Hyvää päivää!", "Anteeksi!"],
        a: 0
      },
      { t: "mc", q: "„Kiitos!“ – passende Antwort:", o: ["Ole hyvä!", "Anteeksi!", "Moi moi!", "Hyvää yötä!"], a: 0 },
      { t: "tr", dir: "de", q: "Auf Wiedersehen!", a: ["Näkemiin"] },
      { t: "tr", dir: "fi", q: "Anteeksi!", a: ["Entschuldigung", "Entschuldige", "Verzeihung"] },
      { t: "gap", q: "Mitä ___?", h: "„Wie geht’s?“ – ein Wort", a: ["kuuluu"] },
      { t: "ord", w: ["Hyvää", "huomenta", "Aino"], a: "Hyvää huomenta, Aino!", de: "Guten Morgen, Aino!" }
    ]
  },

  {
    id: "t03",
    title: "Zahlen 0–20",
    fi: "Numerot",
    lvl: "A1.1",
    req: ["t01"],
    th: `<h3>0 bis 10</h3>
<table><tr><td>nolla</td><td>0</td></tr><tr><td>yksi</td><td>1</td></tr><tr><td>kaksi</td><td>2</td></tr><tr><td>kolme</td><td>3</td></tr><tr><td>neljä</td><td>4</td></tr><tr><td>viisi</td><td>5</td></tr><tr><td>kuusi</td><td>6</td></tr><tr><td>seitsemän</td><td>7</td></tr><tr><td>kahdeksan</td><td>8</td></tr><tr><td>yhdeksän</td><td>9</td></tr><tr><td>kymmenen</td><td>10</td></tr></table>
<h3>11 bis 19: Zahl + toista</h3>
<p class="rule"><i>toista</i> heißt ungefähr „vom zweiten (Zehner)“. Du hängst es einfach an: <b>yksitoista</b> = 11, <b>kaksitoista</b> = 12, <b>viisitoista</b> = 15.</p>
<h3>Zehner: Zahl + kymmentä</h3>
<p class="rule"><b>kaksikymmentä</b> = 20 (zwei Zehner).</p>
<p class="tip">Lustig: <i>kuusi</i> heißt „sechs“ und auch „Fichte“. <i>Kuu</i> ist der Mond.</p>`,
    v: [
      ["nolla", "null (0)"],
      ["yksi", "eins (1)"],
      ["kaksi", "zwei (2)"],
      ["kolme", "drei (3)"],
      ["neljä", "vier (4)"],
      ["viisi", "fünf (5)"],
      ["kuusi", "sechs (6; auch: Fichte)"],
      ["seitsemän", "sieben (7)"],
      ["kahdeksan", "acht (8)"],
      ["yhdeksän", "neun (9)"],
      ["kymmenen", "zehn (10)"],
      ["yksitoista", "elf (11)"],
      ["kaksikymmentä", "zwanzig (20)"]
    ],
    ex: [
      { t: "mc", q: "Was ist „viisi“?", o: ["5", "4", "6", "9"], a: 0 },
      { t: "mc", q: "Was ist „kahdeksan“?", o: ["8", "2", "9", "10"], a: 0 },
      { t: "mc", q: "Was ist „kymmenen“?", o: ["10", "100", "7", "1"], a: 0 },
      {
        t: "mc",
        q: "Wie bildet man die Zahlen 11–19?",
        o: ["Zahl + toista", "Zahl + kymmentä", "toista + Zahl", "Zahl + sata"],
        a: 0
      },
      { t: "gap", q: "3 = ___", h: "drei", a: ["kolme"] },
      { t: "gap", q: "7 = ___", h: "sieben", a: ["seitsemän"] },
      { t: "tr", dir: "de", q: "12", h: "als finnisches Wort schreiben", a: ["kaksitoista"] },
      { t: "tr", dir: "de", q: "15", h: "als finnisches Wort schreiben", a: ["viisitoista"] },
      { t: "tr", dir: "de", q: "18", h: "als finnisches Wort schreiben", a: ["kahdeksantoista"] },
      { t: "tr", dir: "de", q: "20", h: "als finnisches Wort schreiben", a: ["kaksikymmentä"] },
      { t: "tr", dir: "de", q: "4", h: "als finnisches Wort schreiben", a: ["neljä"] },
      {
        t: "tab",
        q: "11 bis 19",
        h: "Jedes Kästchen ein Wort: Zahl + toista",
        head: ["Zahl", "Finnisch"],
        r: [
          ["11", "[yksitoista]"],
          ["13", "[kolmetoista]"],
          ["14", "[neljätoista]"],
          ["16", "[kuusitoista]"],
          ["17", "[seitsemäntoista]"],
          ["19", "[yhdeksäntoista]"]
        ]
      },
      { t: "mc", q: "Was ist „kuusitoista“?", o: ["16", "6", "60", "61"], a: 0 },
      { t: "mc", q: "Was ist „yhdeksän“?", o: ["9", "19", "90", "8"], a: 0 },
      { t: "tr", dir: "de", q: "11", a: ["yksitoista"], h: "Zahl als finnisches Wort" },
      { t: "tr", dir: "fi", q: "kaksitoista", a: ["zwölf", "12"] },
      { t: "gap", q: "yksi, kaksi, kolme, ___", h: "die nächste Zahl als finnisches Wort", a: ["neljä"] },
      { t: "gap", q: "kahdeksan, yhdeksän, ___", h: "die nächste Zahl als finnisches Wort", a: ["kymmenen"] },
      { t: "mc", q: "Was bedeutet „kuusi“ außer „sechs“?", o: ["Fichte", "Mond", "See", "Wald"], a: 0 },
      {
        t: "mc",
        q: "Welche Zahl ist richtig geschrieben?",
        o: ["seitsemäntoista", "seitsentoista", "seitsemäntoiste", "seitsemätoista"],
        a: 0
      },
      {
        t: "sch",
        q: "Schreib die Zahlen 7, 12 und 20 als finnische Wörter.",
        w: ["seitsemän", "kaksikymmentä"],
        a: ["seitsemän, kaksitoista, kaksikymmentä"],
        h: "drei Zahlen als finnische Wörter, mit Komma getrennt"
      }
    ]
  },

  {
    id: "t04",
    title: "Ich bin – du bist (olla)",
    fi: "Persoonapronominit ja olla",
    lvl: "A1.1",
    req: ["t02"],
    th: `<p>Das wichtigste Verb überhaupt: <b>olla</b> = sein.</p>
<table><tr><td>minä olen</td><td>ich bin</td></tr><tr><td>sinä olet</td><td>du bist</td></tr><tr><td>hän on</td><td>er / sie ist</td></tr><tr><td>me olemme</td><td>wir sind</td></tr><tr><td>te olette</td><td>ihr seid / Sie sind</td></tr><tr><td>he ovat</td><td>sie sind</td></tr></table>
<h3>Drei Besonderheiten</h3>
<p class="rule"><b>hän</b> heißt „er“ <b>und</b> „sie“. Finnisch unterscheidet hier kein Geschlecht.</p>
<p class="rule">Bei ich, du, wir, ihr kann das Pronomen wegfallen, weil die Endung es verrät: <i>Olen Matthias.</i> = Ich bin Matthias. Bei <i>hän</i> und <i>he</i> bleibt es stehen.</p>
<p class="rule">Für Dinge sagt man <b>se</b> (es): <i>Se on talo.</i> = Das ist ein Haus.</p>
<p class="tip">Finnisch hat <b>keine Artikel</b>: kein der/die/das, kein ein/eine. <i>talo</i> = das Haus oder ein Haus.</p>
<h3>Beispiele</h3>
<table><tr><td>Olen väsynyt.</td><td>Ich bin müde.</td></tr><tr><td>Hän on opettaja.</td><td>Er / Sie ist Lehrer/in.</td></tr><tr><td>Me olemme kotona.</td><td>Wir sind zu Hause.</td></tr><tr><td>Olen itävaltalainen.</td><td>Ich bin Österreicher.</td></tr></table>
<p class="tip">Gesprochen hörst du oft <i>mä oon</i> (ich bin) und <i>sä oot</i> (du bist). Wir lernen zuerst die Schriftsprache.</p>`,
    v: [
      ["minä", "ich"],
      ["sinä", "du"],
      ["hän", "er / sie"],
      ["me", "wir"],
      ["te", "ihr / Sie"],
      ["he", "sie (Mehrzahl)"],
      ["olla", "sein"],
      ["opettaja", "Lehrer/in"],
      ["opiskelija", "Student/in"],
      ["kotona", "zu Hause"],
      ["täällä", "hier"],
      ["väsynyt", "müde"],
      ["iloinen", "froh, fröhlich"],
      ["itävaltalainen", "Österreicher/in; österreichisch"]
    ],
    ex: [
      { t: "gap", q: "Minä ___ Matthias.", h: "olla – passende Form einsetzen", a: ["olen"] },
      { t: "gap", q: "Hän ___ opettaja.", h: "olla – passende Form einsetzen", a: ["on"] },
      { t: "gap", q: "Me ___ kotona.", h: "olla – passende Form einsetzen", a: ["olemme"] },
      { t: "gap", q: "He ___ täällä.", h: "olla – passende Form einsetzen", a: ["ovat"] },
      { t: "gap", q: "Sinä ___ väsynyt.", h: "olla – passende Form einsetzen", a: ["olet"] },
      { t: "gap", q: "Te ___ täällä.", h: "olla – passende Form einsetzen", a: ["olette"] },
      {
        t: "tab",
        q: "Konjugiere olla (sein)",
        h: "Trag die Formen von olla ein – die deutsche Spalte zeigt die Bedeutung",
        head: ["Person", "olla", "Deutsch"],
        r: [
          ["minä", "[olen]", "ich bin"],
          ["sinä", "[olet]", "du bist"],
          ["hän", "[on]", "er / sie ist"],
          ["me", "[olemme]", "wir sind"],
          ["te", "[olette]", "ihr seid"],
          ["he", "[ovat]", "sie sind"]
        ]
      },
      {
        t: "tab",
        q: "Pronomen und olla – ganz aus dem Kopf",
        h: "Pro Zeile zwei Kästchen: das finnische Pronomen und die passende Form von olla, z. B. ich → minä | olen",
        head: ["Deutsch", "Pronomen", "olla"],
        r: [
          ["ich", "[minä]", "[olen]"],
          ["du", "[sinä]", "[olet]"],
          ["er / sie", "[hän]", "[on]"],
          ["wir", "[me]", "[olemme]"],
          ["ihr / Sie", "[te]", "[olette]"],
          ["sie (Mz.)", "[he]", "[ovat]"]
        ]
      },
      { t: "mc", q: "Was bedeutet „hän“?", o: ["er oder sie", "nur er", "nur sie", "es"], a: 0 },
      { t: "tr", dir: "de", q: "Ich bin müde.", a: ["Minä olen väsynyt", "Olen väsynyt"] },
      { t: "tr", dir: "de", q: "Er ist Lehrer.", a: ["Hän on opettaja"] },
      { t: "ord", w: ["Hän", "on", "kotona"], a: "Hän on kotona.", de: "Er/Sie ist zu Hause." },
      {
        t: "tr",
        dir: "fi",
        q: "Olen itävaltalainen.",
        a: ["Ich bin Österreicher", "Ich bin Österreicherin", "Ich bin Österreicher/in"]
      },
      {
        t: "mc",
        q: "Wofür braucht man „olla“?",
        o: [
          "für „sein“: wer/was jemand ist, wie es jemandem geht, wo jemand ist",
          "nur für „haben“",
          "nur für Fragen",
          "nur für die Vergangenheit"
        ],
        a: 0,
        x: "olen Matthias (wer), olen väsynyt (wie), olen kotona (wo)."
      },
      {
        t: "mc",
        q: "Muss man „minä“ immer dazusagen?",
        o: [
          "Nein – bei minä, sinä, me, te zeigt die Endung die Person; bei hän und he bleibt das Pronomen",
          "Ja, immer",
          "Nein, nie – auch nicht bei hän",
          "Nur in Fragen"
        ],
        a: 0,
        x: "„Olen väsynyt.“ reicht – die Endung -n zeigt „ich“. Aber: „Hän on opettaja.“"
      },
      { t: "gap", q: "He ___ kotona.", h: "olla – Form für „he“", a: ["ovat"] },
      { t: "gap", q: "Hän ___ väsynyt.", h: "olla – Form für „hän“", a: ["on"] },
      {
        t: "mc",
        q: "Welche Form passt: Me ___ täällä.",
        o: ["olemme", "olen", "on", "olette"],
        a: 0,
        x: "me → olemme (-mme = wir). olen = ich, on = er/sie, olette = ihr."
      },
      {
        t: "les",
        q: "Kuka hän on?",
        txt: [
          "Tämä on Aino.",
          "Hän on opettaja.",
          "Hän on iloinen.",
          "Minä olen Matthias.",
          "Olen itävaltalainen.",
          "Me olemme kotona."
        ],
        qs: [
          { q: "Was ist Aino von Beruf?", o: ["Lehrerin", "Studentin", "Österreicherin"], a: 0 },
          { q: "Wo sind sie?", o: ["zu Hause", "in der Schule", "im Café"], a: 0 }
        ]
      },
      {
        t: "dlg",
        q: "Kennenlernen",
        h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen",
        r: [
          ["Aino", "Moi! Minä olen Aino."],
          [
            "Sinä",
            "[Minä olen Matthias.|Olen Matthias.|Moi! Minä olen Matthias.|Moi, olen Matthias.]",
            "Sag deinen Namen."
          ],
          ["Aino", "Minä olen opettaja."],
          ["Sinä", "[Minä olen opiskelija.|Olen opiskelija.]", "Sag, dass du Student bist."],
          ["Aino", "Hauska tutustua!"],
          ["Sinä", "[Hauska tutustua!|Kiitos, samoin!]", "Antworte freundlich."]
        ]
      },
      {
        t: "sch",
        q: "Stell dich vor: Name und Nationalität.",
        w: ["olen", "itävaltalainen"],
        a: ["Minä olen Matthias. Olen itävaltalainen.", "Olen Matthias. Minä olen itävaltalainen."],
        h: "ein oder zwei kurze Sätze auf Finnisch"
      },
      { t: "gap", q: "Minä ___ iloinen.", h: "olla – Form für „minä“", a: ["olen"] },
      { t: "tr", dir: "de", q: "Wir sind hier.", a: ["Me olemme täällä", "Olemme täällä"] },
      {
        t: "tr",
        dir: "fi",
        q: "Te olette kotona.",
        a: ["Ihr seid zu Hause", "Sie sind zu Hause", "Ihr seid daheim", "Ihr seid zuhause"]
      },
      {
        t: "mc",
        q: "Was bedeutet „hän“?",
        o: ["er oder sie", "nur er", "nur sie", "es (für Dinge)"],
        a: 0,
        x: "Für Dinge sagt man se."
      }
    ]
  },

  {
    id: "t05",
    title: "Vokalharmonie",
    fi: "Vokaaliharmonia",
    lvl: "A1.1",
    req: ["t01"],
    th: `<p>Das ist <b>die</b> Grundregel des Finnischen: Fast jede Endung gibt es in zwei Versionen.</p>
<h3>Drei Vokalgruppen</h3>
<table class="nosay"><tr><td>hinten</td><td>a, o, u</td></tr><tr><td>vorne</td><td>ä, ö, y</td></tr><tr><td>neutral</td><td>e, i</td></tr></table>
<p class="rule">Hat ein Wort <b>a, o oder u</b>, bekommt es Endungen mit a/o/u. Sonst (ä, ö, y oder nur e/i) bekommt es Endungen mit ä/ö/y.</p>
<h3>Beispiel: -ssa / -ssä = „in“</h3>
<table><tr><td>talo → talossa</td><td>im Haus</td></tr><tr><td>koulu → koulussa</td><td>in der Schule</td></tr><tr><td>metsä → metsässä</td><td>im Wald</td></tr><tr><td>kylä → kylässä</td><td>im Dorf</td></tr><tr><td>keittiö → keittiössä</td><td>in der Küche</td></tr></table>
<h3>Städte, die auf Konsonant enden</h3>
<p>Dann kommt ein <b>-i-</b> dazwischen:</p>
<table><tr><td>Graz → Grazissa</td><td>in Graz</td></tr><tr><td>Linz → Linzissä</td><td>in Linz</td></tr><tr><td>Wien → Wienissä</td><td>in Wien</td></tr><tr><td>Steyr → Steyrissä</td><td>in Steyr</td></tr></table>
<p class="tip">Ein Wort nur mit e und i (wie <i>Wien</i>) zählt als „vorne“ und bekommt -ssä.</p>
<p class="tip">Manche Wörter verändern dabei ihren Stamm, etwa <i>Helsinki → Helsingissä</i>. Das kommt in einer späteren Lektion.</p>`,
    v: [
      ["koulu", "Schule"],
      ["kahvila", "Café"],
      ["kylä", "Dorf"],
      ["kirjasto", "Bibliothek"],
      ["ravintola", "Restaurant"],
      ["hotelli", "Hotel"],
      ["auto", "Auto"],
      ["keittiö", "Küche"],
      ["työ", "Arbeit"]
    ],
    ex: [
      { t: "mc", q: "Welche Vokale sind „hintere“ Vokale?", o: ["a, o, u", "ä, ö, y", "e, i", "alle Vokale"], a: 0 },
      {
        t: "mc",
        q: "Welche Endung bekommt „talo“?",
        o: ["-ssa", "-ssä"],
        a: 0,
        x: "talo hat a und o → hinten → -ssa."
      },
      { t: "mc", q: "Welche Endung bekommt „metsä“?", o: ["-ssä", "-ssa"], a: 0, x: "metsä hat ä → vorne → -ssä." },
      {
        t: "mc",
        q: "„Wien“ hat nur e und i. Welche Endung?",
        o: ["-issä", "-issa"],
        a: 0,
        x: "Nur e/i zählt als vorne."
      },
      { t: "gap", q: "talo___", h: "nur die Endung eintippen – im Haus", a: ["ssa"], s: 1 },
      { t: "gap", q: "metsä___", h: "nur die Endung eintippen – im Wald", a: ["ssä"], s: 1 },
      { t: "gap", q: "koulu___", h: "nur die Endung eintippen – in der Schule", a: ["ssa"], s: 1 },
      { t: "gap", q: "kylä___", h: "nur die Endung eintippen – im Dorf", a: ["ssä"], s: 1 },
      { t: "gap", q: "Steyr___", h: "nur die Endung eintippen (mit i) – in Steyr", a: ["issä"], s: 1 },
      {
        t: "tab",
        q: "Wo? – Endung -ssa / -ssä",
        h: "Schreib das ganze Wort mit Endung, z. B. talo → talossa",
        head: ["Wort", "in …"],
        r: [
          ["talo", "[talossa]"],
          ["metsä", "[metsässä]"],
          ["koulu", "[koulussa]"],
          ["kylä", "[kylässä]"],
          ["kahvila", "[kahvilassa]"],
          ["keittiö", "[keittiössä]"],
          ["Linz", "[Linzissä]"],
          ["Graz", "[Grazissa]"]
        ],
        s: 1
      },
      { t: "tr", dir: "de", q: "im Restaurant", h: "ein einziges Wort: Wort + Endung", a: ["ravintolassa"], s: 1 },
      { t: "tr", dir: "de", q: "in Graz", h: "ein einziges Wort: Wort + Endung", a: ["Grazissa"], s: 1 },
      {
        t: "mc",
        q: "Wann nimmt man „-ssa“, wann „-ssä“?",
        o: [
          "-ssa, wenn das Wort a, o oder u enthält, sonst -ssä",
          "-ssa bei langen Wörtern, -ssä bei kurzen",
          "-ssä bei Städten, -ssa bei allen anderen Wörtern",
          "das ist frei wählbar"
        ],
        a: 0,
        x: "talossa (a, o), metsässä (ä), Wienissä (nur e und i → -ssä)."
      },
      {
        t: "mc",
        q: "Was bedeutet die Endung „-ssa/-ssä“?",
        o: ["„in …“ – wo sich etwas befindet", "„aus …“ – woher", "„nach …“ – wohin", "„mit …“"],
        a: 0,
        x: "talossa = im Haus. „Woher“ und „wohin“ haben eigene Endungen – die kommen später."
      },
      {
        t: "mc",
        q: "Welche Gruppe sind die vorderen Vokale?",
        o: ["ä, ö, y", "a, o, u", "e, i", "a, ä, e"],
        a: 0,
        x: "Vorne im Mund: ä, ö, y. Hinten: a, o, u. e und i sind neutral."
      },
      {
        t: "mc",
        q: "Warum heißt es „talossa“, aber „metsässä“?",
        o: [
          "talo hat hintere Vokale (a, o) → -ssa; metsä hat einen vorderen (ä) → -ssä",
          "Weil talo kürzer ist",
          "Weil metsä mit m beginnt",
          "Das ist reiner Zufall"
        ],
        a: 0,
        x: "Die Endung passt sich den Vokalen des Wortes an: hintere Vokale → -ssa, vordere → -ssä."
      },
      {
        t: "les",
        q: "Missä?",
        txt: ["Aino on koulussa.", "Matthias on kahvilassa.", "Kissa on talossa.", "Koira on metsässä."],
        qs: [
          { q: "Wo ist Matthias?", o: ["im Café", "in der Schule", "im Wald"], a: 0 },
          { q: "Wo ist der Hund?", o: ["im Wald", "im Haus", "im Café"], a: 0 }
        ]
      },
      {
        t: "dlg",
        q: "Wo bist du?",
        h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen",
        r: [
          ["Aino", "Minä olen kahvilassa."],
          ["Sinä", "[Minä olen kirjastossa.|Olen kirjastossa.]", "Sag, dass du in der Bibliothek bist."],
          ["Aino", "Hyvä! Moi moi!"],
          ["Sinä", "[Moi moi!|Näkemiin!]", "Verabschiede dich."]
        ]
      },
      {
        t: "sch",
        q: "Schreib, dass du in der Küche bist und die Katze im Haus ist.",
        w: ["keittiössä", "talossa"],
        a: ["Olen keittiössä. Kissa on talossa.", "Minä olen keittiössä ja kissa on talossa."],
        h: "ein oder zwei kurze Sätze auf Finnisch"
      },
      { t: "gap", q: "ravintola___", h: "nur die Endung eintippen", a: ["ssa"] },
      { t: "gap", q: "kirjasto___", h: "nur die Endung eintippen", a: ["ssa"] },
      { t: "gap", q: "hotelli___", h: "nur die Endung eintippen", a: ["ssa"] },
      { t: "gap", q: "Wien___", h: "nur die Endung eintippen", a: ["issä"] }
    ]
  },

  {
    id: "t06",
    title: "Verben Typ 1 im Präsens",
    fi: "Verbityyppi 1",
    lvl: "A1.1",
    req: ["t04", "t05"],
    th: `<p>Finnische Verben haben sechs Typen. Typ 1 ist der häufigste: Der Infinitiv endet auf <b>zwei Vokale</b>, der letzte ist a oder ä – <i>puhua, asua, ostaa, kysyä</i>.</p>
<h3>So geht’s</h3>
<p class="rule">1. Letzten Buchstaben streichen → Stamm: puhu|a → <b>puhu-</b><br>2. Personalendung anhängen.</p>
<table><tr><td>minä puhu<b>n</b></td><td>ich spreche</td></tr><tr><td>sinä puhu<b>t</b></td><td>du sprichst</td></tr><tr><td>hän puhu<b>u</b></td><td>er / sie spricht</td></tr><tr><td>me puhu<b>mme</b></td><td>wir sprechen</td></tr><tr><td>te puhu<b>tte</b></td><td>ihr sprecht</td></tr><tr><td>he puhu<b>vat</b></td><td>sie sprechen</td></tr></table>
<p class="tip">Bei „er/sie“ gibt es keine eigene Endung – der letzte Vokal wird einfach <b>verlängert</b>: asu → asuu, sano → sanoo, osta → ostaa.</p>
<p class="tip">Vokalharmonie gilt auch hier: he puhu<b>vat</b>, aber he kysy<b>vät</b>.</p>
<h3>Nützliche Sätze</h3>
<table><tr><td>Asun Steyrissä.</td><td>Ich wohne in Steyr.</td></tr><tr><td>Puhun saksaa.</td><td>Ich spreche Deutsch.</td></tr><tr><td>Puhun vähän suomea.</td><td>Ich spreche ein bisschen Finnisch.</td></tr><tr><td>Hän ostaa kahvia.</td><td>Er / Sie kauft Kaffee.</td></tr></table>
<p class="muted">Sprachen nach <i>puhua</i> haben eine eigene Endung (saksaa, suomea, englantia). Das ist der Partitiv, den du später lernst. Merk sie dir vorerst als feste Ausdrücke.</p>`,
    v: [
      ["puhua", "sprechen"],
      ["asua", "wohnen"],
      ["sanoa", "sagen"],
      ["ostaa", "kaufen"],
      ["katsoa", "schauen, ansehen"],
      ["kysyä", "fragen"],
      ["rakastaa", "lieben"],
      ["ajaa", "fahren (selbst lenken)"],
      ["maksaa", "zahlen; kosten"],
      ["istua", "sitzen"],
      ["hyvin", "gut (Adverb)"],
      ["saksaa", "Deutsch (nach puhua)"],
      ["aina", "immer"]
    ],
    ex: [
      { t: "gap", q: "Minä ___ Steyrissä.", h: "asua – passende Form einsetzen", a: ["asun"] },
      { t: "gap", q: "Sinä ___ hyvin.", h: "puhua – passende Form einsetzen", a: ["puhut"] },
      { t: "gap", q: "Hän ___ kahvia.", h: "ostaa – passende Form einsetzen", a: ["ostaa"] },
      { t: "gap", q: "Me ___ Linzissä.", h: "asua – passende Form einsetzen", a: ["asumme"] },
      { t: "gap", q: "He ___ saksaa.", h: "puhua – passende Form einsetzen", a: ["puhuvat"] },
      { t: "gap", q: "Te ___ paljon.", h: "kysyä – passende Form einsetzen", a: ["kysytte"] },
      { t: "gap", q: "Hän ___ aina kiitos.", h: "sanoa – passende Form einsetzen", a: ["sanoo"] },
      {
        t: "tab",
        q: "Konjugiere puhua (sprechen)",
        head: ["Person", "puhua"],
        r: [
          ["minä", "[puhun]"],
          ["sinä", "[puhut]"],
          ["hän", "[puhuu]"],
          ["me", "[puhumme]"],
          ["te", "[puhutte]"],
          ["he", "[puhuvat]"]
        ]
      },
      {
        t: "tab",
        q: "Zwei Verben nebeneinander",
        h: "Konjugiere jedes Verb einzeln – jedes Kästchen ist eine eigene Form, z. B. minä asun (ich wohne), minä kysyn (ich frage). Achte auf die Vokalharmonie: asua → -vat, kysyä → -vät.",
        head: ["Person", "asua", "kysyä"],
        r: [
          ["minä", "[asun]", "[kysyn]"],
          ["sinä", "[asut]", "[kysyt]"],
          ["hän", "[asuu]", "[kysyy]"],
          ["me", "[asumme]", "[kysymme]"],
          ["te", "[asutte]", "[kysytte]"],
          ["he", "[asuvat]", "[kysyvät]"]
        ],
        s: 1
      },
      {
        t: "tab",
        q: "Konjugiere ostaa (kaufen)",
        head: ["Person", "ostaa"],
        r: [
          ["minä", "[ostan]"],
          ["sinä", "[ostat]"],
          ["hän", "[ostaa]"],
          ["me", "[ostamme]"],
          ["te", "[ostatte]"],
          ["he", "[ostavat]"]
        ]
      },
      { t: "mc", q: "Welche Form heißt „er/sie wohnt“?", o: ["asuu", "asua", "asun", "asuvat"], a: 0 },
      { t: "tr", dir: "de", q: "Ich wohne in Steyr.", a: ["Asun Steyrissä", "Minä asun Steyrissä"] },
      { t: "tr", dir: "de", q: "Wir sprechen Deutsch.", a: ["Puhumme saksaa", "Me puhumme saksaa"] },
      { t: "ord", w: ["Hän", "asuu", "Linzissä"], a: "Hän asuu Linzissä.", de: "Er/Sie wohnt in Linz." },
      {
        t: "mc",
        q: "Welche Verben gehören zum Verbtyp 1?",
        o: [
          "Verben, deren Grundform auf zwei Vokale endet (puhua, asua, kysyä)",
          "Verben auf -da/-dä (syödä, juoda)",
          "Verben auf -la/-lä, -na/-nä, -ra/-rä (tulla, mennä)",
          "alle Verben, die mit a anfangen"
        ],
        a: 0,
        x: "Die Grundform endet auf einen Vokal + a/ä: puhu-a, asu-a, osta-a, kysy-ä, sano-a."
      },
      {
        t: "mc",
        q: "Wie bildet man bei Verbtyp 1 die Präsensform?",
        o: [
          "Grundform ohne das letzte -a/-ä, dann die Personalendung",
          "Grundform + Personalendung",
          "Grundform ohne die letzten zwei Buchstaben + -n",
          "man ändert nur den ersten Vokal"
        ],
        a: 0,
        x: "puhua → puhu- → puhun, puhut, puhumme …"
      },
      {
        t: "mc",
        q: "Welche Personalendungen hat Verbtyp 1?",
        o: [
          "-n, -t, (Vokal verlängert), -mme, -tte, -vat/-vät",
          "-n, -s, -t, -mme, -tte, -vat",
          "-a, -t, -n, -me, -te, -at",
          "-n, -t, -n, -mme, -tte, -n"
        ],
        a: 0,
        x: "minä puhun, sinä puhut, hän puhuu, me puhumme, te puhutte, he puhuvat."
      },
      {
        t: "mc",
        q: "Warum heißt es „hän asuu“ (mit uu)?",
        o: [
          "In der 3. Person Einzahl wird der letzte Vokal des Stamms verlängert",
          "Weil asua ein unregelmäßiges Verb ist",
          "Weil hän immer ein Doppel-u verlangt",
          "Das ist ein Tippfehler – richtig ist „hän asu“"
        ],
        a: 0,
        x: "asu- → asuu, puhu- → puhuu, kysy- → kysyy, osta- → ostaa."
      },
      {
        t: "mc",
        q: "Wie bildest du „te kysytte“ aus „kysyä“?",
        o: [
          "Grundform ohne -ä → kysy-, dann -tte → kysytte",
          "Grundform + -tte → kysyätte",
          "Grundform ohne -ä, dann -te → kysyte",
          "kysyä bleibt gleich: te kysyä"
        ],
        a: 0,
        x: "Bei Verben Typ 1 fällt das letzte -a/-ä weg, die Endung kommt an den Stamm: kysyä → kysy- → kysyn, kysyt, kysytte."
      },
      { t: "gap", q: "Me ___ autoa.", h: "ostaa – Form für „me“", a: ["ostamme"] },
      { t: "gap", q: "Minä ___ paljon.", h: "kysyä – Form für „minä“", a: ["kysyn"] },
      { t: "gap", q: "Sinä ___ täällä.", h: "istua – Form für „sinä“", a: ["istut"] },
      { t: "tr", dir: "de", q: "Er zahlt immer.", a: ["Hän maksaa aina", "Hän aina maksaa"] },
      {
        t: "les",
        q: "Matthias",
        txt: [
          "Matthias asuu Steyrissä.",
          "Hän puhuu saksaa ja vähän suomea.",
          "Hän ostaa kahvia kahvilassa.",
          "Hän maksaa aina."
        ],
        qs: [
          { q: "Wo wohnt Matthias?", o: ["in Steyr", "in Linz", "in Graz"], a: 0 },
          {
            q: "Welche Sprachen spricht er?",
            o: ["Deutsch und ein bisschen Finnisch", "nur Finnisch", "nur Deutsch"],
            a: 0
          }
        ]
      },
      {
        t: "dlg",
        q: "Wo wohnst du?",
        h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen",
        r: [
          ["Aino", "Minä asun Linzissä."],
          ["Sinä", "[Minä asun Steyrissä.|Asun Steyrissä.]", "Sag, dass du in Steyr wohnst."],
          ["Aino", "Puhun suomea ja saksaa."],
          [
            "Sinä",
            "[Puhun saksaa ja vähän suomea.|Minä puhun saksaa ja vähän suomea.]",
            "Sag, dass du Deutsch und ein bisschen Finnisch sprichst."
          ]
        ]
      },
      {
        t: "sch",
        q: "Schreib, wo du wohnst und welche Sprachen du sprichst.",
        w: ["asun", "puhun"],
        a: ["Asun Steyrissä. Puhun saksaa ja vähän suomea.", "Minä asun Steyrissä ja puhun saksaa ja vähän suomea."],
        h: "ein oder zwei kurze Sätze auf Finnisch"
      },
      { t: "tr", dir: "de", q: "Sie (Mehrzahl) sitzen hier.", a: ["He istuvat täällä"] },
      { t: "tr", dir: "de", q: "Ich liebe Finnland.", a: ["Rakastan Suomea", "Minä rakastan Suomea"] }
    ]
  },

  {
    id: "t07",
    title: "Verneinung",
    fi: "Kieltomuoto",
    lvl: "A1.1",
    req: ["t06"],
    th: `<p>Im Finnischen ist „nicht“ ein <b>Verb</b>, das sich nach der Person richtet. Das Hauptverb steht dann nur im Stamm.</p>
<table><tr><td>minä en puhu</td><td>ich spreche nicht</td></tr><tr><td>sinä et puhu</td><td>du sprichst nicht</td></tr><tr><td>hän ei puhu</td><td>er / sie spricht nicht</td></tr><tr><td>me emme puhu</td><td>wir sprechen nicht</td></tr><tr><td>te ette puhu</td><td>ihr sprecht nicht</td></tr><tr><td>he eivät puhu</td><td>sie sprechen nicht</td></tr></table>
<p class="rule">Einfache Regel für den Stamm: Nimm die ich-Form und streich das -n. puhun → <b>en puhu</b>, asun → <b>et asu</b>.</p>
<p class="rule">Das klappt auch bei olla: olen → <b>en ole</b>, et ole, ei ole …</p>
<h3>Beispiele</h3>
<table><tr><td>En ole väsynyt.</td><td>Ich bin nicht müde.</td></tr><tr><td>Hän ei asu täällä.</td><td>Er / Sie wohnt nicht hier.</td></tr><tr><td>Emme ole kotona.</td><td>Wir sind nicht zu Hause.</td></tr></table>
<p class="tip">Typischer Fehler: <s>En puhun</s>. Die Person steckt schon im „en“ – das Hauptverb bekommt keine Endung.</p>`,
    v: [
      ["en", "ich … nicht"],
      ["et", "du … nicht"],
      ["ei (Verb)", "er / sie … nicht"],
      ["emme", "wir … nicht"],
      ["ette", "ihr … nicht"],
      ["eivät", "sie (Mz.) … nicht"],
      ["nyt", "jetzt"],
      ["tänään", "heute"],
      ["vielä", "noch"]
    ],
    ex: [
      { t: "gap", q: "Minä ___ ole väsynyt.", h: "nur das Verneinungswort für „ich“ eintippen", a: ["en"] },
      { t: "gap", q: "Hän ___ asu täällä.", h: "nur das Verneinungswort für „er/sie“ eintippen", a: ["ei"] },
      { t: "gap", q: "He ___ puhu saksaa.", h: "nur das Verneinungswort für „sie (Mehrzahl)“ eintippen", a: ["eivät"] },
      { t: "gap", q: "Me ___ ole kotona.", h: "nur das Verneinungswort für „wir“ eintippen", a: ["emme"] },
      { t: "gap", q: "Sinä et ___ suomea.", h: "puhua – Form nach der Verneinung", a: ["puhu"] },
      { t: "gap", q: "Te ette ___ autoa.", h: "ostaa – Form nach der Verneinung", a: ["osta"] },
      {
        t: "tab",
        q: "Verneinung von puhua",
        h: "Pro Zeile zwei Kästchen, die zusammen „… spreche nicht“ ergeben: links das Verneinungswort, rechts die Form von puhua – z. B. en | puhu",
        head: ["Person", "nicht", "puhua"],
        r: [
          ["minä", "[en]", "[puhu]"],
          ["sinä", "[et]", "[puhu]"],
          ["hän", "[ei]", "[puhu]"],
          ["me", "[emme]", "[puhu]"],
          ["te", "[ette]", "[puhu]"],
          ["he", "[eivät]", "[puhu]"]
        ]
      },
      {
        t: "tab",
        q: "Bejaht und verneint: olla",
        h: "Links die bejahte Form (z. B. olen), rechts verneint mit zwei Wörtern (z. B. en ole)",
        head: ["Person", "… bin / ist / sind", "… nicht"],
        r: [
          ["minä", "[olen]", "[en ole]"],
          ["sinä", "[olet]", "[et ole]"],
          ["hän", "[on]", "[ei ole]"],
          ["me", "[olemme]", "[emme ole]"],
          ["te", "[olette]", "[ette ole]"],
          ["he", "[ovat]", "[eivät ole]"]
        ]
      },
      { t: "mc", q: "Was ist richtig?", o: ["En puhu.", "En puhun.", "Ei puhun.", "Minä ei puhu."], a: 0 },
      { t: "tr", dir: "de", q: "Ich bin nicht müde.", a: ["En ole väsynyt", "Minä en ole väsynyt"] },
      { t: "tr", dir: "de", q: "Er wohnt nicht hier.", a: ["Hän ei asu täällä"] },
      {
        t: "tr",
        dir: "fi",
        q: "Emme ole kotona.",
        a: ["Wir sind nicht zu Hause", "Wir sind nicht daheim", "Wir sind nicht zuhause"]
      },
      {
        t: "mc",
        q: "Wie verneint man im Finnischen?",
        o: [
          "Mit einem eigenen Verneinungsverb (en, et, ei, emme, ette, eivät), das sich nach der Person richtet",
          "Mit „ei“ vor dem Verb – bei allen Personen gleich",
          "Mit der Endung -ei am Verb",
          "Mit einem Wort für „nicht“ am Satzende"
        ],
        a: 0,
        x: "minä en puhu, sinä et puhu, he eivät puhu – das Verneinungsverb trägt die Person."
      },
      {
        t: "mc",
        q: "Welche Form hat das Hauptverb nach „en, et, ei …“?",
        o: [
          "die Form von „minä“ ohne -n – bei allen Personen gleich",
          "die normale Präsensform (en puhun)",
          "die Grundform (en puhua)",
          "die Form von „hän“ (en puhuu)"
        ],
        a: 0,
        x: "puhun → en puhu, olen → en ole; genauso: he eivät puhu."
      },
      { t: "gap", q: "He ___ ole kotona.", h: "Verneinungswort für „he“", a: ["eivät"] },
      {
        t: "les",
        q: "Ei tänään",
        txt: [
          "Aino ei ole kotona tänään.",
          "Hän ei asu täällä.",
          "Matthias ei puhu suomea hyvin.",
          "Me emme ole kotona."
        ],
        qs: [
          { q: "Ist Aino heute zu Hause?", o: ["Nein", "Ja", "Am Abend"], a: 0 },
          {
            q: "Spricht Matthias gut Finnisch?",
            o: ["Nein, nicht gut", "Ja, sehr gut", "Er spricht kein Deutsch"],
            a: 0
          }
        ]
      },
      {
        t: "dlg",
        q: "Nein!",
        h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen",
        r: [
          ["Aino", "Minä olen väsynyt."],
          ["Sinä", "[Minä en ole väsynyt.|En ole väsynyt.]", "Sag, dass du nicht müde bist."],
          ["Aino", "Minä ajan autoa."],
          ["Sinä", "[Minä en aja autoa.|En aja autoa.]", "Sag, dass du nicht Auto fährst."]
        ]
      },
      {
        t: "sch",
        q: "Schreib, dass du heute nicht zu Hause bist und nicht müde bist.",
        w: ["en ole", "väsynyt"],
        a: ["Tänään en ole kotona. En ole väsynyt.", "En ole tänään kotona. En ole väsynyt."],
        h: "ein oder zwei kurze Sätze auf Finnisch"
      },
      { t: "gap", q: "Te ___ ole täällä.", h: "Verneinungswort für „te“", a: ["ette"] },
      { t: "tr", dir: "fi", q: "He eivät asu Linzissä.", a: ["Sie wohnen nicht in Linz"] },
      {
        t: "mc",
        q: "Welcher Satz ist FALSCH?",
        o: ["En puhun.", "En puhu.", "Hän ei puhu.", "Emme puhu."],
        a: 0,
        x: "Nach en steht der Stamm ohne Endung: en puhu."
      }
    ]
  },

  {
    id: "t08",
    title: "Fragen stellen",
    fi: "Kysymykset",
    lvl: "A1.1",
    req: ["t07"],
    th: `<p>Ja/Nein-Fragen bildest du mit der Endung <b>-ko / -kö</b>. Sie hängt am Verb, und das Verb rückt an den Satzanfang.</p>
<table><tr><td>Puhutko suomea?</td><td>Sprichst du Finnisch?</td></tr><tr><td>Onko hän kotona?</td><td>Ist er / sie zu Hause?</td></tr><tr><td>Oletko väsynyt?</td><td>Bist du müde?</td></tr><tr><td>Kysytkö?</td><td>Fragst du?</td></tr></table>
<p class="tip">Vokalharmonie: -ko bei Wörtern mit a/o/u, -kö bei den anderen.</p>
<h3>Antworten wie in Finnland</h3>
<p>Statt nur „ja“ wiederholt man gern das Verb:</p>
<table><tr><td>Puhutko suomea?</td><td>Sprichst du Finnisch?</td></tr><tr><td>Puhun.</td><td>Ja.</td></tr><tr><td>En puhu.</td><td>Nein.</td></tr><tr><td>Vähän.</td><td>Ein bisschen.</td></tr></table>
<h3>Fragewörter</h3>
<p>Mit Fragewort brauchst du <b>kein</b> -ko:</p>
<table><tr><td>Missä asut?</td><td>Wo wohnst du?</td></tr><tr><td>Kuka hän on?</td><td>Wer ist er / sie?</td></tr><tr><td>Mikä tämä on?</td><td>Was ist das?</td></tr></table>`,
    v: [
      ["mikä", "was, welche(r)"],
      ["missä", "wo"],
      ["kuka", "wer"],
      ["tämä", "dies, das hier"],
      ["vähän", "ein bisschen"],
      ["ymmärrätkö?", "verstehst du?"],
      ["en ymmärrä", "ich verstehe nicht"],
      ["onko …?", "ist …?"]
    ],
    ex: [
      { t: "gap", q: "___ väsynyt?", h: "olla, du – als Frage", a: ["Oletko"] },
      { t: "gap", q: "Puhut___ saksaa?", h: "nur die Fragendung eintippen", a: ["ko"], s: 1 },
      { t: "gap", q: "Kysyt___?", h: "nur die Fragendung eintippen – Vokalharmonie!", a: ["kö"], s: 1 },
      { t: "gap", q: "___ hän kotona?", h: "olla, er/sie – als Frage", a: ["Onko"] },
      {
        t: "tab",
        q: "Fragen mit -ko / -kö",
        h: "Jedes Verb einzeln als Frageform – jedes Kästchen ist eine eigene Form, z. B. olenko? (bin ich?), puhunko? (spreche ich?)",
        head: ["Person", "olla?", "puhua?"],
        r: [
          ["minä", "[olenko]", "[puhunko]"],
          ["sinä", "[oletko]", "[puhutko]"],
          ["hän", "[onko]", "[puhuuko]"],
          ["me", "[olemmeko]", "[puhummeko]"],
          ["te", "[oletteko]", "[puhutteko]"],
          ["he", "[ovatko]", "[puhuvatko]"]
        ]
      },
      {
        t: "tab",
        q: "Fragewörter",
        h: "Teils einzelne Fragewörter, teils ganze Fragen auf Finnisch",
        head: ["Deutsch", "Finnisch"],
        r: [
          ["wo", "[missä]"],
          ["wer", "[kuka]"],
          ["was", "[mikä]"],
          ["Wo wohnst du?", "[Missä asut?|Missä sinä asut?]"],
          ["Wer ist er / sie?", "[Kuka hän on?]"]
        ]
      },
      { t: "mc", q: "„Asutko Linzissä?“ – Antwort „ja“:", o: ["Asun.", "Asutko.", "Olen.", "Kiitos."], a: 0 },
      {
        t: "mc",
        q: "Was heißt „Missä asut?“",
        o: ["Wo wohnst du?", "Wer bist du?", "Was sagst du?", "Wohnst du hier?"],
        a: 0
      },
      { t: "tr", dir: "de", q: "Bist du zu Hause?", a: ["Oletko kotona", "Oletko sinä kotona"] },
      { t: "tr", dir: "de", q: "Sprichst du Finnisch?", a: ["Puhutko suomea", "Puhutko sinä suomea"] },
      { t: "tr", dir: "fi", q: "Kuka hän on?", a: ["Wer ist er?", "Wer ist sie?", "Wer ist er/sie?"] },
      { t: "ord", w: ["Onko", "hän", "opettaja"], a: "Onko hän opettaja?", de: "Ist er/sie Lehrer/in?" },
      {
        t: "mc",
        q: "Wie macht man aus einem Satz eine Ja/Nein-Frage?",
        o: [
          "Verb an den Anfang und -ko/-kö anhängen",
          "nur die Stimme am Ende heben",
          "„kuka“ an den Anfang stellen",
          "-ko/-kö an das letzte Wort hängen"
        ],
        a: 0,
        x: "Sinä puhut suomea. → Puhutko suomea?"
      },
      {
        t: "mc",
        q: "Braucht man bei Fragewörtern wie „missä“ oder „kuka“ auch -ko/-kö?",
        o: ["Nein – mit Fragewort kein -ko/-kö", "Ja, immer", "Nur bei missä", "Nur am Satzende"],
        a: 0,
        x: "Missä asut? Kuka hän on? – das Fragewort macht schon die Frage."
      },
      { t: "gap", q: "___ hän saksaa?", h: "puhua, er/sie – als Frage, ein einziges Wort", a: ["Puhuuko"] },
      { t: "gap", q: "___ he kotona?", h: "olla, sie (Mehrzahl) – als Frage, ein einziges Wort", a: ["Ovatko"] },
      {
        t: "mc",
        q: "Welche Frage ist richtig?",
        o: ["Missä asut?", "Missä asutko?", "Asutko missä?", "Missäko asut?"],
        a: 0,
        x: "Mit Fragewort (missä, kuka, mikä) kein -ko! -ko nur bei Ja/Nein-Fragen: Asutko Linzissä?"
      },
      {
        t: "les",
        q: "Kysymyksiä",
        txt: [
          "Aino: Puhutko suomea?",
          "Matthias: Puhun vähän.",
          "Aino: Missä asut?",
          "Matthias: Asun Steyrissä.",
          "Aino: Oletko opiskelija?",
          "Matthias: En ole."
        ],
        qs: [
          { q: "Spricht Matthias Finnisch?", o: ["ein bisschen", "sehr gut", "gar nicht"], a: 0 },
          { q: "Ist Matthias Student?", o: ["Nein", "Ja", "Er weiß es nicht"], a: 0 }
        ]
      },
      {
        t: "dlg",
        q: "Fragen und Antworten",
        h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen",
        r: [
          ["Aino", "Puhutko saksaa?"],
          ["Sinä", "[Puhun.|Kyllä, puhun.|Joo, puhun saksaa.|Puhun saksaa.|Kyllä, puhun saksaa.]", "Sag ja."],
          ["Aino", "Missä asut?"],
          ["Sinä", "[Asun Steyrissä.|Steyrissä.|Minä asun Steyrissä.]", "Sag, dass du in Steyr wohnst."]
        ]
      },
      {
        t: "sch",
        q: "Stell zwei Fragen: ob die Person zu Hause ist und wo sie wohnt.",
        w: ["oletko", "missä"],
        a: ["Oletko kotona? Missä asut?", "Oletko sinä kotona? Missä sinä asut?"],
        h: "ein oder zwei kurze Sätze auf Finnisch"
      },
      { t: "gap", q: "Asut___ täällä?", h: "nur die Fragendung eintippen – Vokalharmonie!", a: ["ko"] },
      { t: "tr", dir: "de", q: "Wer ist das?", a: ["Kuka tämä on", "Kuka se on", "Kuka hän on"] }
    ]
  }
];

/* Wörterbuch-Ergänzungen fürs Antippen (keine Lernkarten): einzelne Wörter aus Redewendungen,
   Teilungsformen (Partitiv) und Wörter, die in Übungen vorkommen, aber nicht im Wortschatz stehen.
   Diese Einträge haben Vorrang vor dem Wortschatz. */
const GLOSS_EXTRA = {
  ei: { de: "nein · im Satz: … nicht (Verneinungswort für „hän“, z. B. hän ei asu)" },
  hyvä: { de: "gut" },
  hyvää: { de: "gut", base: "hyvä", note: "Teilungsform (Partitiv), in Grüßen: hyvää huomenta" },
  huomenta: { de: "Morgen", base: "huomen", note: "Teilungsform (Partitiv), in „hyvää huomenta“" },
  päivää: { de: "Tag", base: "päivä", note: "Teilungsform (Partitiv), in „hyvää päivää“" },
  iltaa: { de: "Abend", base: "ilta", note: "Teilungsform (Partitiv), in „hyvää iltaa“" },
  yötä: { de: "Nacht", base: "yö", note: "Teilungsform (Partitiv), in „hyvää yötä“" },
  mitä: { de: "was", base: "mikä", note: "Teilungsform (Partitiv) von mikä" },
  kuuluu: { de: "ist zu hören; gehört (zu)", base: "kuulua", note: "Form für „hän“" },
  paljon: { de: "viel" },
  hauska: { de: "nett, lustig" },
  tutustua: { de: "kennenlernen" },
  entä: { de: "und …? (Rückfrage)" },
  sinulle: { de: "dir, für dich", base: "sinä", note: "sinä + -lle" },
  ymmärrä: { de: "verstehen", base: "ymmärtää", note: "Verneinungsform: en ymmärrä = ich verstehe nicht" },
  onko: { de: "ist …?", base: "olla", note: "Frageform für „hän“ (on + -ko)" },
  minun: { de: "mein, meine", base: "minä", note: "Genitiv (Besitz)" },
  nimeni: { de: "mein Name", base: "nimi", note: "nimi + -ni = mein" },
  nimi: { de: "Name" },
  tuli: { de: "Feuer · auch: er/sie kam (von tulla)" },
  sauna: { de: "Sauna" },
  kahvi: { de: "Kaffee" },
  kahvia: { de: "Kaffee", base: "kahvi", note: "Teilungsform (Partitiv): etwas Kaffee" },
  sanoo: { de: "sagen", base: "sanoa", note: "Form für „hän“" },
  suomi: { de: "Finnland; Finnisch" },
  suomea: { de: "Finnisch", base: "suomi", note: "Teilungsform (Partitiv) nach puhua: puhua suomea" },
  autoa: { de: "Auto", base: "auto", note: "Teilungsform (Partitiv), z. B. nach Verneinung: en osta autoa" },
  ja: { de: "und" },
  ssa: { de: "in (Endung -ssa/-ssä: talossa = im Haus)" },
  ssä: { de: "in (Endung -ssa/-ssä: metsässä = im Wald)" },
  steyr: { de: "Steyr (Ortsname)" },
  linz: { de: "Linz (Ortsname)" },
  graz: { de: "Graz (Ortsname)" },
  wien: { de: "Wien (Ortsname)" },
  matthias: { de: "(Name)" },
  kestä: {
    de: "(aus)halten, dauern",
    base: "kestää",
    note: "in „Ei kestä!“ = Gern geschehen! – etwa „nicht der Rede wert“"
  },
  kuinka: { de: "wie (in Fragen: kuinka vanha? = wie alt?)" },
  vuotias: { de: "… Jahre alt", note: "an die Zahl gehängt: kolmekymmentävuotias = 30 Jahre alt" },
  sinun: { de: "dein, deine", base: "sinä" },
  nimesi: { de: "dein Name", base: "nimi", note: "nimi + -si (dein): Mikä sinun nimesi on?" },
  nimeni: { de: "mein Name", base: "nimi", note: "nimi + -ni (mein): Minun nimeni on …" },
  hänellä: { de: "bei ihm / ihr", base: "hän", note: "hänellä on = er / sie hat" },
  meillä: { de: "bei uns", base: "me", note: "meillä on = wir haben" },
  teillä: { de: "bei euch", base: "te", note: "teillä on = ihr habt" },
  heillä: { de: "bei ihnen", base: "he", note: "heillä on = sie haben" },
  nukkuu: { de: "schläft", base: "nukkua", note: "hän-Form" },
  opimme: { de: "wir lernen", base: "oppia", note: "me-Form, Stufenwechsel pp → p" },
  soitat: { de: "du spielst (Instrument) / rufst an", base: "soittaa", note: "sinä-Form, Stufenwechsel tt → t" },
  joka: { de: "jeder, jede", note: "joka päivä = jeden Tag" },
  päivä: { de: "Tag" },
  kauppaan: { de: "ins Geschäft", base: "kauppa", note: "Wohin-Form (starke Stufe pp)" },
  kaupassa: { de: "im Geschäft", base: "kauppa", note: "Wo-Form, pp → p" },
  kaupan: { de: "des Geschäfts", base: "kauppa", note: "Genitiv, pp → p (kaupan edessä = vor dem Geschäft)" },
  itävallasta: { de: "aus Österreich", base: "Itävalta", note: "Woher-Form, lt → ll" },
  kouluun: { de: "in die Schule", base: "koulu", note: "Wohin-Form" },
  opiskelevat: { de: "sie studieren / lernen", base: "opiskella", note: "he-Form, Typ 3" },
  helsinkiin: { de: "nach Helsinki", base: "Helsinki", note: "Wohin-Form" },
  suomeen: { de: "nach Finnland", base: "Suomi", note: "Wohin-Form (unregelmäßig)" },
  jotain: { de: "etwas" },
  muuta: { de: "anderes", base: "muu", note: "Teilungsform: jotain muuta = sonst noch etwas" },
  tänä: { de: "diesen, an diesem", base: "tämä", note: "tänä iltana = heute Abend" },
  aikaa: { de: "Zeit", base: "aika", note: "Teilungsform: onko sinulla aikaa? = hast du Zeit?" },
  aika: { de: "Zeit; Termin", note: "varata aika = einen Termin vereinbaren" },
  voitko: { de: "kannst du?", base: "voida", note: "sinä-Form + -ko" },
  osaa: { de: "kann (er/sie)", base: "osata", note: "hän-Form" },
  osaan: { de: "ich kann", base: "osata", note: "minä-Form" },
  tapaamme: { de: "wir treffen (uns)", base: "tavata", note: "me-Form, v → p" },
  odotan: { de: "ich warte", base: "odottaa", note: "minä-Form, tt → t" },
  pysäkillä: { de: "an der Haltestelle", base: "pysäkki", note: "-llä, kk → k" },
  käänny: { de: "bieg ab!", base: "kääntyä", note: "Befehlsform" },
  kirkon: { de: "der Kirche", base: "kirkko", note: "Genitiv, kk → k (kirkon edessä = vor der Kirche)" },
  varata: { de: "reservieren, buchen", note: "varata aika = einen Termin vereinbaren" },
  parane: { de: "werde gesund!", base: "parata", note: "Befehlsform: parane pian = gute Besserung" },
  pian: { de: "bald" },
  kuumetta: { de: "Fieber", base: "kuume", note: "Teilungsform" },
  selkään: { de: "in den Rücken", base: "selkä", note: "Wohin-Form: selkään sattuu = der Rücken tut weh" },
  päähän: { de: "in den Kopf", base: "pää", note: "Wohin-Form: päähän sattuu = der Kopf tut weh" },
  apteekkiin: { de: "in die Apotheke", base: "apteekki", note: "Wohin-Form" },
  lepää: { de: "ruh dich aus!", base: "levätä", note: "Befehlsform" },
  vettä: { de: "Wasser", base: "vesi", note: "Teilungsform (unregelmäßig)" },
  lunta: { de: "Schnee", base: "lumi", note: "Teilungsform: sataa lunta = es schneit" },
  talvella: { de: "im Winter", base: "talvi", note: "-lla" },
  takin: { de: "eine Jacke", base: "takki", note: "Objekt mit -n, kk → k" },
  onpa: { de: "ist aber …!", base: "olla", note: "on + -pa (Ausruf): Onpa kaunis ilma! = Was für ein schönes Wetter!" },
  viime: { de: "letzte(r/s)", note: "viime viikolla = letzte Woche" },
  viikolla: { de: "in der Woche", base: "viikko", note: "-lla, kk → k" },
  vuonna: { de: "im Jahr", base: "vuosi", note: "viime vuonna = letztes Jahr" },
  teit: { de: "du machtest, du hast gemacht", base: "tehdä", note: "Vergangenheit, sinä-Form" },
  meni: { de: "ging, lief (er/sie/es)", base: "mennä", note: "Vergangenheit, hän-Form: miten meni? = wie war's?" },
  kävin: { de: "ich war (kurz), ich besuchte", base: "käydä", note: "Vergangenheit, minä-Form" },
  matkustin: { de: "ich reiste", base: "matkustaa", note: "Vergangenheit, minä-Form" },
  teidän: { de: "euer; (teidän täytyy = ihr müsst)", base: "te" },
  heidän: { de: "ihr (von ihnen); (heidän täytyy = sie müssen)", base: "he" },
  ainon: { de: "Ainos, gehört Aino", base: "Aino", note: "Genitiv: Se on Ainon. = Das gehört Aino." },
  seitsemäs: { de: "siebte(r)", base: "seitsemän", note: "Ordnungszahl: seitsemäs lokakuuta = der 7. Oktober" },
  toukokuuta: { de: "(des) Mai", base: "toukokuu", note: "Teilungsform im Datum: ensimmäinen toukokuuta = der 1. Mai" },
  ensi: { de: "nächste(r/s)", note: "ensi viikolla = nächste Woche, ensi vuonna = nächstes Jahr" },
  nukkumaan: { de: "schlafen (wohin: zum Schlafen)", base: "nukkua", note: "menen nukkumaan = ich gehe schlafen" },
  kymmentä: { de: "zehn (Teilungsform)", base: "kymmenen", note: "kymmentä vaille = zehn vor; auch in kaksikymmentä" },
  kolmelta: { de: "um drei (Uhr)", base: "kolme", note: "-lta = um … Uhr (volle/halbe Stunde)" },
  viideltä: { de: "um fünf (Uhr)", base: "viisi", note: "puoli viideltä = um halb fünf" },
  kuuteen: { de: "bis sechs", base: "kuusi", note: "kahdeksasta kuuteen = von acht bis sechs" },
  kirjoitetaan: {
    de: "schreibt man",
    base: "kirjoittaa",
    note: "Passiv: Miten se kirjoitetaan? = Wie schreibt man das?"
  },
  sen: { de: "es, das", base: "se", note: "Objektform: Voitko tavata sen?" },
  etunimeni: { de: "mein Vorname", base: "etunimi", note: "etunimi + -ni (mein)" },
  ihan: { de: "ganz, ziemlich", note: "ihan hyvin = ganz gut" },
  kovin: { de: "sehr, besonders", note: "ei kovin hyvin = nicht so gut" },
  kysymästä: { de: "(fürs) Fragen", base: "kysyä", note: "kiitos kysymästä = danke der Nachfrage" },
  viikonloppua: { de: "Wochenende", base: "viikonloppu", note: "Teilungsform: hyvää viikonloppua" },
  ruokahalua: { de: "Appetit", base: "ruokahalu", note: "Teilungsform: hyvää ruokahalua = guten Appetit" },
  onneksi: { de: "zum Glück", base: "onni", note: "onneksi olkoon = herzlichen Glückwunsch" },
  olkoon: { de: "es sei", base: "olla", note: "onneksi olkoon = herzlichen Glückwunsch" },
  samoin: { de: "gleichfalls, ebenso" },
  hei: { de: "hallo; hei hei = tschüss" },
  monta: { de: "viele", base: "moni", note: "kuinka monta? = wie viele?" },
  työksesi: { de: "als Arbeit (deine)", base: "työ", note: "Mitä teet työksesi? = Was arbeitest du?" },
  tosi: { de: "echt, sehr (locker)" },
  järvessä: { de: "im See", base: "järvi", note: "-i → -e-: järvessä" },
  minäkään: { de: "ich auch (nicht)", base: "minä", note: "en minäkään = ich auch nicht" },
  mitään: { de: "nichts, etwas", base: "mikään", note: "ei se mitään = macht nichts" },
  totta: { de: "wahr", base: "tosi", note: "totta kai = na klar" },
  kai: { de: "wohl, doch", note: "totta kai = na klar" },
  aino: { de: "(Name)" },
  tupakoi: { de: "raucht", base: "tupakoida", note: "hän-Form / nach Verneinung" },
  huonetta: { de: "Zimmer", base: "huone", note: "Teilungsform nach Zahlen: kolme huonetta" },
  käyn: { de: "ich gehe (hin), ich besuche", base: "käydä", note: "käyn lenkillä = ich gehe joggen" },
  lenkillä: { de: "beim Laufen / Spaziergang", base: "lenkki", note: "käyn lenkillä = ich gehe joggen" },
  kuuntelen: { de: "ich höre (zu)", base: "kuunnella", note: "kuuntelen musiikkia = ich höre Musik" },
  piirrän: { de: "ich zeichne", base: "piirtää", note: "rt → rr" },
  neuloo: { de: "strickt", base: "neuloa", note: "hän-Form" },
  kaupungissa: { de: "in der Stadt", base: "kaupunki", note: "nk → ng" },
  kerron: { de: "ich erzähle", base: "kertoa", note: "rt → rr" },
  annan: { de: "ich gebe", base: "antaa", note: "nt → nn" },
  huoneessa: { de: "im Zimmer", base: "huone", note: "-e → -ee-ssa" },
  meressä: { de: "im Meer", base: "meri", note: "-i → -e-ssä" },
  itkee: { de: "weint", base: "itkeä", note: "hän-Form" },
  viemme: { de: "wir bringen (weg)", base: "viedä", note: "me-Form" },
  pöydällä: { de: "auf dem Tisch", base: "pöytä", note: "-llä, t → d" },
  käy: { de: "geht (hin), besucht", base: "käydä", note: "hän-Form: käy lenkillä" },
  pöydässä: { de: "im Tisch, in der Tischplatte", base: "pöytä", note: "Wo-Form, t → d" },
  kertoo: { de: "erzählt", base: "kertoa", note: "hän-Form (stark)" },
  anna: { de: "gib! / (nicht) geben", base: "antaa", note: "Stamm nach Verneinung: en anna" },
  pankkiin: { de: "in die Bank", base: "pankki", note: "Wohin-Form (-iin)" },
  viroon: { de: "nach Estland", base: "Viro", note: "Wohin-Form: Viroon" },
  laiva: { de: "Schiff, Fähre" },
  tallinnaan: { de: "nach Tallinn", base: "Tallinna", note: "Wohin-Form" },
  postiin: { de: "zur Post", base: "posti", note: "Wohin-Form (-iin)" },
  lähden: { de: "ich gehe los, ich fahre ab", base: "lähteä", note: "ht → hd" },
  huoneeseen: { de: "ins Zimmer", base: "huone", note: "Wohin-Form: -e → -eeseen" },
  tampereella: { de: "in Tampere", base: "Tampere", note: "Städte auf -e: -lla (Tampereella)" },
  tomaatteja: { de: "Tomaten", base: "tomaatti", note: "Teilungsform Mehrzahl" },
  perheen: { de: "der Familie (Genitiv)", base: "perhe", note: "perheen kanssa = mit der Familie" },
  kanssani: { de: "mit mir", base: "kanssa", note: "(minun) kanssani" },
  saunaan: { de: "in die Sauna", base: "sauna", note: "Wohin-Form" },
  pakko: { de: "Zwang", note: "minun on pakko = ich muss unbedingt" },
  kauppakeskukseen: { de: "ins Einkaufszentrum", base: "kauppakeskus", note: "-us → -ukseen" },
  purkin: { de: "einen Becher / ein Glas", base: "purkki", note: "ganzes Objekt: ostan purkin" },
  paketin: { de: "eine Packung", base: "paketti", note: "ganzes Objekt: ostan paketin" },
  saisi: { de: "(es) dürfte / könnte bekommen", base: "saada", note: "in „Mitä saisi olla?“ = Was darf es sein?" }
};
