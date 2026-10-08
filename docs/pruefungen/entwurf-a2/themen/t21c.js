module.exports = {
  id: "t21c",
  title: "Wörter auf Konsonant: puhelin, kysymys, suomalainen (21.3)",
  fi: "Uusi puhelin",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t19b", "t20b", "t20d"],
  th: `<p>Feinheiten zu t21: Viele häufige Wörter enden auf einen <b>Konsonanten</b> oder auf <b>-nen</b>. Vor Endungen ändern sie ihren Stamm. Wer die sechs Muster kennt, kann viele dieser Wörter beugen. Wörter auf -as/-is wie <i>hidas, kaunis</i> haben ein eigenes Muster (<i>hitaan, kauniin</i>, siehe t21).</p>
<h3>Die Muster</h3>
<table><tr><td>Ende</td><td>Beispiel: -n-Form, -ssa, Teilungsform</td></tr>
<tr><td>-nen</td><td>suomalainen: suomalaisen, suomalaisessa, suomalaista</td></tr>
<tr><td>-s (aus Verben)</td><td>kysymys: kysymyksen, kysymyksessä, kysymystä</td></tr>
<tr><td>-in</td><td>puhelin: puhelimen, puhelimessa, puhelinta</td></tr>
<tr><td>-ton / -tön</td><td>työtön: työttömän, työttömässä, työtöntä</td></tr>
<tr><td>-us / -ys (Eigenschaft)</td><td>rakkaus: rakkauden, rakkaudessa, rakkautta</td></tr>
<tr><td>alte -i-Wörter</td><td>vesi: veden, vedessä, vettä</td></tr></table>
<p class="rule">Faustregel: Die <b>Teilungsform</b> hängt -ta/-tä meist an die <b>Grundform</b> (puhelin<b>ta</b>, kysymys<b>tä</b>, työtön<b>tä</b>; -nen → -s<b>ta</b>). Alle <b>anderen Endungen</b> hängen am <b>Stamm</b> der -n-Form (puhelime-ssa, kysymykse-ssä, suomalaise-ssa).</p>
<p class="rule"><b>-us/-ys</b> gibt es zweimal: Wörter aus Verben (vastata → vastaus, kysyä → kysymys, harjoitella → harjoitus) haben <b>-kse-</b>; Eigenschaften aus Adjektiven (rakas → rakkaus, terve → terveys, vapaa → vapaus) haben <b>-de-</b>, Teilungsform <b>-tta/-ttä</b>.</p>
<p class="rule">Adjektive auf -nen folgen demselben Muster: <i>ystävällisessä ihmisessä, iloiseen lapseen, suomalaista ruokaa</i>.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip">Das End-i fällt oft weg: <i>Mul on uus puhelin</i> (= uusi), <i>kaks</i> (= kaksi), <i>viis</i> (= viisi). Das Handy heißt im Alltag <i>kännykkä</i> oder kurz <i>känny</i>, offiziell <i>matkapuhelin</i>. <i>Ootsä suomalainen?</i> = Oletko sinä suomalainen?</p>`,
  v: [
    ["puhelin", "Telefon (puhelimen, puhelinta)"],
    ["eläin", "Tier (eläimen, eläintä)"],
    ["ihminen", "Mensch (ihmisen, ihmistä)"],
    ["ystävällinen", "freundlich (ystävällisen)"],
    ["terveys", "Gesundheit (terveyden, terveyttä)"],
    ["rakkaus", "Liebe (rakkauden, rakkautta)"],
    ["vapaus", "Freiheit (vapauden, vapautta)"]
  ],
  ex: [
    { t: "tab", q: "-n-Form und Teilungsform", h: "Jedes Kästchen eine eigene Form: links die -n-Form, rechts die Teilungsform – z. B. puhelin | puhelimen | puhelinta", head: ["Grundform", "-n-Form", "Teilungsform"], r: [["suomalainen", "[suomalaisen]", "[suomalaista]"], ["kysymys", "[kysymyksen]", "[kysymystä]"], ["puhelin", "[puhelimen]", "[puhelinta]"], ["työtön", "[työttömän]", "[työtöntä]"], ["rakkaus", "[rakkauden]", "[rakkautta]"], ["vesi", "[veden]", "[vettä]"]], s: 1 },
    { t: "tab", q: "Wo? -ssa / -ssä", h: "Jedes Kästchen eine Form mit -ssa/-ssä; bei zwei Wörtern beide Wörter mit Endung", head: ["Grundform", "in …"], r: [["puhelin", "[puhelimessa]"], ["kysymys", "[kysymyksessä]"], ["kokous", "[kokouksessa]"], ["uusi talo", "[uudessa talossa]"], ["suomalainen kaupunki", "[suomalaisessa kaupungissa]"]], s: 1 },
    { t: "gap", q: "Juon paljon ___.", h: "vesi in der Teilungsform", a: ["vettä"], s: 1 },
    { t: "gap", q: "En ymmärrä tätä ___.", h: "kysymys in der Teilungsform", a: ["kysymystä"], s: 1 },
    { t: "gap", q: "Kiitos ___!", h: "vastaus + -sta: für die Antwort", a: ["vastauksesta"], s: 1 },
    { t: "gap", q: "Puhun ___ kanssa.", h: "suomalainen in der -n-Form (vor „kanssa“)", a: ["suomalaisen"] },
    { t: "gap", q: "Hän on nyt ___.", h: "työtön im Essiv: (gerade) arbeitslos", a: ["työttömänä"], s: 1 },
    { t: "tr", dir: "de", q: "Ich habe ein neues Telefon.", a: ["Minulla on uusi puhelin"] },
    { t: "tr", dir: "de", q: "Sie ist ein sehr freundlicher Mensch.", a: ["Hän on tosi ystävällinen ihminen", "Hän on hyvin ystävällinen ihminen", "Hän on todella ystävällinen ihminen"] },
    { t: "tr", dir: "de", q: "Wo ist das Telefon?", a: ["Missä puhelin on", "Missä on puhelin"] },
    { t: "tr", dir: "fi", q: "Kiitos ystävällisestä viestistä!", a: ["Danke für die freundliche Nachricht", "Vielen Dank für die freundliche Nachricht", "Danke für deine freundliche Nachricht"] },
    { t: "tr", dir: "fi", q: "Kissa on pieni eläin.", a: ["Die Katze ist ein kleines Tier", "Eine Katze ist ein kleines Tier"] },
    { t: "ord", w: ["Puhun", "suomalaisen", "ystävän", "kanssa"], a: ["Puhun suomalaisen ystävän kanssa."], de: "Ich spreche mit einem finnischen Freund." },
    { t: "ord", w: ["Avain", "on", "puhelimen", "vieressä"], a: ["Avain on puhelimen vieressä.", "Puhelimen vieressä on avain."], de: "Der Schlüssel liegt neben dem Telefon." },
    { t: "mc", q: "Wie bilden Wörter auf -nen die -n-Form?", o: ["-nen → -sen: suomalainen → suomalaisen", "-nen + en: suomalainenen", "-nen → -nan: suomalainan", "Sie haben keine -n-Form."], a: 0, x: "Vor Endungen -se-: suomalaisessa, suomalaiseen. Teilungsform mit -sta: suomalaista." },
    { t: "mc", q: "„vastaus“ → vastauksen, aber „rakkaus“ → rakkauden. Warum?", o: ["-us aus Verben (vastata) hat -kse-, -us als Eigenschaft (rakas) hat -de-", "Das ist Zufall, beide Formen gehen.", "Lange Wörter bekommen -de-.", "„rakkauden“ ist ein Fehler."], a: 0, x: "Handlung/Ergebnis: vastaus, kokous, kysymys, harjoitus → -kse-. Eigenschaft: rakkaus, terveys, vapaus → -de-, Teilungsform -tta/-ttä (rakkautta)." },
    { t: "mc", q: "Wie heißt die Teilungsform von „puhelin“?", o: ["puhelinta", "puhelimea", "puhelinia", "puhelimen"], a: 0, x: "Wörter auf Konsonant hängen in der Teilungsform -ta/-tä an die Grundform: puhelinta, kysymystä, työtöntä (-nen: suomalaista)." },
    { t: "mc", q: "Gesprochen: „Mul on uus puhelin.“ – Wie schreibt man das?", o: ["Minulla on uusi puhelin.", "Minulla on uuden puhelimen.", "Minä olen uusi puhelin.", "Minulla oli uusi puhelin."], a: 0, x: "Gesprochen fällt das End-i oft weg: uus (uusi), kaks (kaksi), viis (viisi)." },
    { t: "mc", q: "Gesprochen: „Ootsä suomalainen?“ bedeutet:", o: ["Bist du Finne/Finnin?", "Bist du in Finnland?", "Sprichst du Finnisch?", "Hast du einen finnischen Freund?"], a: 0, x: "ootsä = oletko sinä." },
    { t: "tr", dir: "fi", q: "Missä mun kännykkä on?", h: "gesprochenes Finnisch: kännykkä = Handy", a: ["Wo ist mein Handy", "Wo ist mein Telefon"] },
    { t: "les", q: "Uusi puhelin", txt: ["Matthias: Katso, minulla on uusi puhelin!", "Aino: Hieno! Oliko se kallis?", "Matthias: Ei, se oli halpa. Ostin sen netistä.", "Aino: Entä vanha puhelin?", "Matthias: Annoin sen siskolle. Hän on tosi iloinen."], qs: [{ q: "Was hat Matthias?", o: ["ein neues Telefon", "einen neuen Schlüssel", "ein Haustier"], a: 0 }, { q: "Wo hat er es gekauft?", o: ["im Internet", "im Geschäft", "in Finnland"], a: 0 }, { q: "Was ist mit dem alten Telefon?", o: ["Er hat es seiner Schwester gegeben.", "Er hat es verkauft.", "Es ist kaputt."], a: 0 }] },
    { t: "les", q: "Onnittelukortti", txt: ["Hyvää syntymäpäivää, Matthias!", "Paljon rakkautta ja terveyttä!", "Olet tosi ystävällinen ihminen.", "Kiitos kaikesta!", "Aino"], qs: [{ q: "Wozu ist die Karte?", o: ["zum Geburtstag", "zu Weihnachten", "zur Hochzeit"], a: 0 }, { q: "Was wünscht Aino?", o: ["Liebe und Gesundheit", "Geld und Arbeit", "eine neue Wohnung"], a: 0 }, { q: "Wie beschreibt sie Matthias?", o: ["sehr freundlich", "sehr lustig", "sehr fleißig"], a: 0 }] },
    { t: "dlg", q: "Wo ist das Telefon?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Mitä etsit?"], ["Sinä", "[Puhelinta.|Etsin puhelinta.|Puhelinta. Missä se on?]", "Sag: das Telefon (Teilungsform!)."], ["Aino", "Se on keittiössä pöydällä."], ["Sinä", "[Kiitos! Missä avain on?|Kiitos. Entä avain?|Kiitos! Entä avain?]", "Bedanke dich und frag nach dem Schlüssel."], ["Aino", "Avain on puhelimen vieressä."], ["Sinä", "[Kiitos!|Hyvä, kiitos!]", "Bedanke dich."]] },
    { t: "dlg", q: "Wasser, bitte", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Haluatko kahvia vai teetä?"], ["Sinä", "[Vettä, kiitos.|Haluan vettä, kiitos.|Vain vettä, kiitos.]", "Sag: Wasser, bitte."], ["Aino", "Kylmää vettä?"], ["Sinä", "[Kyllä, kiitos.|Kyllä, kylmää vettä.|Joo, kiitos.]", "Sag ja."], ["Aino", "Ole hyvä!"], ["Sinä", "[Kiitos, olet tosi ystävällinen!|Kiitos, olet ystävällinen!|Kiitos, olet todella ystävällinen!]", "Bedanke dich: Sie ist sehr freundlich."]] },
    { t: "sch", q: "Schreib, dass du jeden Tag mit einer finnischen Freundin telefonierst.", w: ["suomalaisen", "puhelimessa"], a: ["Puhun joka päivä puhelimessa suomalaisen ystävän kanssa.", "Puhun suomalaisen ystävän kanssa puhelimessa joka päivä.", "Joka päivä puhun puhelimessa suomalaisen ystävän kanssa."], h: "ein Satz: puhua puhelimessa = telefonieren" },
    { t: "sch", q: "Schreib eine kurze Geburtstagskarte: Wünsche Liebe und Gesundheit.", w: ["rakkautta", "terveyttä"], a: ["Hyvää syntymäpäivää! Paljon rakkautta ja terveyttä!", "Hyvää syntymäpäivää ja paljon rakkautta ja terveyttä!"], h: "ein oder zwei kurze Sätze auf Finnisch" }
  ]
};
