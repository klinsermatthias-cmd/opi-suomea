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
    lvl: "A0",
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
      { t: "tr", dir: "fi", q: "järvi", a: ["See", "der See"] }
    ]
  },

  {
    id: "t02",
    title: "Begrüßungen & Höflichkeit",
    fi: "Tervehdykset",
    lvl: "A0",
    req: ["t01"],
    th: `<p>Finn*innen sind sprachlich unkompliziert: Man duzt sich fast immer, auch im Job.</p>
<h3>Hallo und Tschüss</h3>
<table><tr><td>Moi! / Hei!</td><td>Hallo (locker)</td></tr><tr><td>Moi moi! / Heippa!</td><td>Tschüss</td></tr><tr><td>Hyvää huomenta</td><td>Guten Morgen</td></tr><tr><td>Hyvää päivää</td><td>Guten Tag (förmlich)</td></tr><tr><td>Hyvää iltaa</td><td>Guten Abend</td></tr><tr><td>Hyvää yötä</td><td>Gute Nacht</td></tr><tr><td>Näkemiin</td><td>Auf Wiedersehen (förmlich)</td></tr></table>
<p class="tip"><i>Hyvää</i> heißt „einen guten …“. Du hängst einfach die Tageszeit an.</p>
<h3>Höflich sein</h3>
<table><tr><td>Kiitos</td><td>Danke</td></tr><tr><td>Kiitos paljon</td><td>Vielen Dank</td></tr><tr><td>Ole hyvä</td><td>Bitte (beim Geben) / Gern geschehen</td></tr><tr><td>Anteeksi</td><td>Entschuldigung</td></tr><tr><td>Kyllä / Joo</td><td>Ja (joo ist locker)</td></tr><tr><td>Ei</td><td>Nein</td></tr></table>
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
      ["joo", "ja (umgangssprachlich)"]
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
        a: "Minun nimeni on Matthias",
        de: "Mein Name ist Matthias."
      },
      { t: "tr", dir: "de", q: "Entschuldigung", a: ["anteeksi"] },
      { t: "tr", dir: "de", q: "Freut mich!", a: ["hauska tutustua"] },
      { t: "tr", dir: "de", q: "Gute Nacht", a: ["hyvää yötä"] },
      { t: "tr", dir: "fi", q: "Moi moi!", a: ["Tschüss", "Tschüs", "Ciao", "Baba"] }
    ]
  },

  {
    id: "t03",
    title: "Zahlen 0–20",
    fi: "Numerot",
    lvl: "A0",
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
      { t: "tr", dir: "de", q: "4", h: "als finnisches Wort schreiben", a: ["neljä"] }
    ]
  },

  {
    id: "t04",
    title: "Ich bin – du bist (olla)",
    fi: "Persoonapronominit ja olla",
    lvl: "A0",
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
      { t: "ord", w: ["Hän", "on", "kotona"], a: "Hän on kotona", de: "Er/Sie ist zu Hause." },
      {
        t: "tr",
        dir: "fi",
        q: "Olen itävaltalainen.",
        a: ["Ich bin Österreicher", "Ich bin Österreicher", "Ich bin Österreicher/in"]
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
      }
    ]
  },

  {
    id: "t05",
    title: "Vokalharmonie",
    fi: "Vokaaliharmonia",
    lvl: "A0",
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
      }
    ]
  },

  {
    id: "t06",
    title: "Verben Typ 1 im Präsens",
    fi: "Verbityyppi 1",
    lvl: "A0+",
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
      { t: "ord", w: ["Hän", "asuu", "Linzissä"], a: "Hän asuu Linzissä", de: "Er/Sie wohnt in Linz." },
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
      }
    ]
  },

  {
    id: "t07",
    title: "Verneinung",
    fi: "Kieltomuoto",
    lvl: "A0+",
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
      { t: "tr", dir: "fi", q: "Emme ole kotona.", a: ["Wir sind nicht zu Hause", "Wir sind nicht daheim"] },
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
      }
    ]
  },

  {
    id: "t08",
    title: "Fragen stellen",
    fi: "Kysymykset",
    lvl: "A0+",
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
      { t: "ord", w: ["Onko", "hän", "opettaja"], a: "Onko hän opettaja", de: "Ist er/sie Lehrer/in?" },
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
      }
    ]
  }
];
