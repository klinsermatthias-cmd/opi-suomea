module.exports = {
  id: "t24c",
  title: "Feinheiten: kotonani, kotiini, äidilleen (24.3)",
  fi: "Tervetuloa kotiini!",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t21b", "t24b"],
  th: `<p>Feinheiten zu t24: Possessivsuffixe zusammen mit <b>Fällen</b> – <i>kotonani</i> (bei mir zu Hause), <i>kotiini</i> (zu mir nach Hause), <i>ystäväni kanssa</i> (mit meinem Freund) – und der Unterschied zwischen <i>äidilleen</i> und <i>hänen äidilleen</i>.</p>
<h3>Erst der Fall, dann das Suffix</h3>
<table><tr><td>Fall</td><td>+ -ni (mein)</td><td>+ 3. Person (sein/ihr eigenes)</td></tr>
<tr><td>kotona</td><td>kotonani</td><td>kotonaan</td></tr>
<tr><td>kotiin</td><td>kotiini</td><td>kotiinsa</td></tr>
<tr><td>talossa</td><td>talossani</td><td>talossaan</td></tr>
<tr><td>äidille</td><td>äidilleni</td><td>äidilleen</td></tr>
<tr><td>ystävän kanssa</td><td>ystäväni kanssa</td><td>ystävänsä kanssa</td></tr></table>
<p class="rule">Die Endungen <b>-n</b> (Genitiv, Wohin-Form) und <b>-t</b> (Mehrzahl) fallen vor dem Suffix weg: <i>ystävän → ystäväni, kotiin → kotiini</i>. In der 3. Person heißt das Suffix nach einem Fall-Vokal meist <b>Vokal + n</b>: <i>kotonaan, talossaan, äidilleen</i>; sonst <b>-nsa/-nsä</b>: <i>kotiinsa, ystävänsä</i>.</p>
<h3>sein eigenes – oder das eines anderen?</h3>
<table><tr><td>Aino soittaa äidilleen.</td><td>Aino ruft ihre (eigene) Mutter an.</td></tr>
<tr><td>Aino soittaa hänen äidilleen.</td><td>Aino ruft seine/ihre Mutter an (die einer anderen Person).</td></tr></table>
<p class="rule"><b>oma</b> = eigen: <i>oma huone, oma auto</i>; mit Suffix verstärkt: <i>minun oma autoni</i>. <i>Tämä on omani.</i> = Das ist mein eigenes.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip">Gesprochen: Pronomen + Grundform statt Suffix – <i>mun kotona</i> (= kotonani), <i>mun luona</i> (= luonani), <i>sen äidille</i> (= äidilleen oder hänen äidilleen – gesprochen doppeldeutig), <i>mun perheen kaa</i> (= perheeni kanssa; <i>kaa</i> = kanssa). <i>Onks tää sun oma?</i> = Onko tämä sinun omasi?</p>`,
  v: [
    ["oma", "eigen (oma huone)"],
    ["omani", "mein eigenes"],
    ["kotonani", "bei mir zu Hause"],
    ["kotiini", "zu mir nach Hause"],
    ["kotoani", "von mir zu Hause (weg)"],
    ["ystäväni kanssa", "mit meinem Freund / meiner Freundin"]
  ],
  ex: [
    { t: "tab", q: "Fall + -ni", h: "Jedes Kästchen eine Form: Fallendung + -ni (-n fällt weg); bei „kanssa“ zwei Wörter", head: ["Form", "+ mein"], r: [["kotona", "[kotonani]"], ["kotiin", "[kotiini]"], ["talossa", "[talossani]"], ["äidille", "[äidilleni]"], ["ystävän kanssa", "[ystäväni kanssa]"]], s: 1 },
    { t: "tab", q: "Fall + eigenes (3. Person)", h: "Jedes Kästchen eine Form: nach Fall-Vokal Vokal + n (kotonaan), sonst -nsa/-nsä; bei „kanssa“ zwei Wörter", head: ["Form", "+ sein/ihr eigenes"], r: [["kotona", "[kotonaan]"], ["kotiin", "[kotiinsa]"], ["talossa", "[talossaan]"], ["äidille", "[äidilleen]"], ["ystävän kanssa", "[ystävänsä kanssa]"]], s: 1 },
    { t: "gap", q: "Tervetuloa ___!", h: "kotiin + -ni: zu mir nach Hause", a: ["kotiini"], s: 1 },
    { t: "gap", q: "Olen illalla ___.", h: "kotona + -ni", a: ["kotonani", "kotona"] },
    { t: "gap", q: "Menen kauppaan ___ kanssa.", h: "ystävä + -ni: mit meinem Freund", a: ["ystäväni"], s: 1 },
    { t: "gap", q: "Aino soittaa ___ joka päivä.", h: "äiti + -lle + eigenes Suffix: ihrer (eigenen) Mutter", a: ["äidilleen"], s: 1 },
    { t: "gap", q: "Tämä ei ole sinun, se on ___.", h: "mein eigenes", a: ["omani"] },
    { t: "gap", q: "Minulla on ___ huone.", h: "eigen", a: ["oma"] },
    { t: "tr", dir: "de", q: "Willkommen bei mir zu Hause!", a: ["Tervetuloa kotiini", "Tervetuloa minun kotiini"] },
    { t: "tr", dir: "de", q: "Ich wohne mit meiner Familie in Linz.", a: ["Asun perheeni kanssa Linzissä", "Asun Linzissä perheeni kanssa", "Minä asun perheeni kanssa Linzissä"] },
    { t: "tr", dir: "de", q: "Er ruft seine (eigene) Mutter an.", a: ["Hän soittaa äidilleen", "Hän soittaa omalle äidilleen"] },
    { t: "tr", dir: "fi", q: "Hänellä on oma auto.", a: ["Er hat ein eigenes Auto", "Sie hat ein eigenes Auto"] },
    { t: "tr", dir: "fi", q: "Unohdin avaimeni kotiin.", a: ["Ich habe meinen Schlüssel zu Hause vergessen", "Ich habe meine Schlüssel zu Hause vergessen", "Ich vergaß meinen Schlüssel zu Hause"] },
    { t: "ord", w: ["Hän", "asuu", "oman", "perheensä", "kanssa"], a: ["Hän asuu oman perheensä kanssa."], de: "Er wohnt mit seiner eigenen Familie." },
    { t: "mc", q: "Wo steht das Suffix bei „kotonani“?", o: ["nach der Fallendung: koto-na-ni", "vor der Fallendung: koti-ni-na", "statt der Fallendung", "am Wortanfang"], a: 0, x: "Erst der Fall, dann das Suffix: kotona → kotonani. -n und -t fallen weg: ystävän → ystäväni, kotiin → kotiini." },
    { t: "mc", q: "„Aino soittaa äidilleen.“ – Wessen Mutter?", o: ["Ainos eigene Mutter", "die Mutter einer anderen Person", "Matthias' Mutter", "Das ist unklar."], a: 0, x: "Suffix der 3. Person ohne hänen = das eigene (des Subjekts). Mit hänen = jemand, der nicht Subjekt dieses Satzes ist: Aino soittaa hänen äidilleen (eine andere Person) – oder im nächsten Satz: Hänen äitinsä asuu Helsingissä (Ainos Mutter)." },
    { t: "mc", q: "„talossaan“ – warum -an und nicht -nsa?", o: ["3. Person nach Fall-Vokal: Vokal + n", "Das ist die Mehrzahl.", "Das ist die Verneinung.", "Das ist die Teilungsform."], a: 0, x: "talossa → talossaan, kotona → kotonaan, äidille → äidilleen. Nach -n bleibt -nsa/-nsä: kotiinsa, ystävänsä." },
    { t: "mc", q: "Gesprochen: „Mä asun mun perheen kaa.“ – geschrieben:", o: ["Asun perheeni kanssa.", "Asun perheen luona.", "Minä asun perheessä.", "Perhe asuu kanssani."], a: 0, x: "Gesprochen: mun + Grundform statt Suffix; kaa = kanssa." },
    { t: "mc", q: "Gesprochen: „Onks tää sun oma?“ bedeutet:", o: ["Ist das dein eigenes?", "Ist das mein eigenes?", "Bist du allein?", "Ist das neu?"], a: 0, x: "onks = onko, tää = tämä, sun = sinun." },
    { t: "les", q: "Tervetuloa!", txt: ["Matthias: Tervetuloa kotiini!", "Aino: Kiitos! Onko tämä sinun oma asuntosi?", "Matthias: On. Asun täällä kissani kanssa.", "Aino: Missä on sinun huoneesi?", "Matthias: Huoneeni on tuolla. Siellä on myös kirjahyllyni."], qs: [{ q: "Wem gehört die Wohnung?", o: ["Matthias – es ist seine eigene", "Aino", "seiner Mutter"], a: 0 }, { q: "Mit wem wohnt er?", o: ["mit seiner Katze", "mit Aino", "mit seinem Bruder"], a: 0 }, { q: "Was steht in seinem Zimmer?", o: ["sein Bücherregal", "ein Klavier", "ein Fernseher"], a: 0 }] },
    { t: "les", q: "Ainon perhe", txt: ["Aino asuu Oulussa miehensä ja lapsensa kanssa.", "Joka sunnuntai hän soittaa äidilleen.", "Hänen äitinsä asuu Helsingissä.", "Kesällä he menevät mökilleen."], qs: [{ q: "Mit wem wohnt Aino?", o: ["mit ihrem Mann und ihrem Kind / ihren Kindern", "allein", "mit ihrer Mutter"], a: 0 }, { q: "Wen ruft sie sonntags an?", o: ["ihre Mutter", "ihren Chef", "Matthias"], a: 0 }, { q: "Wohin fahren sie im Sommer?", o: ["zu ihrer Hütte", "nach Helsinki", "nach Österreich"], a: 0 }] },
    { t: "dlg", q: "Wo ist mein Telefon?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Mitä etsit?"], ["Sinä", "[Puhelintani.|Etsin puhelintani.|Puhelinta.]", "Sag, dass du dein Telefon suchst (Teilungsform + -ni)."], ["Aino", "Onko se laukussa?"], ["Sinä", "[Ei. Unohdin sen töihin.|Ei, unohdin sen töihin.|Ei ole. Unohdin sen töihin.]", "Sag nein: Du hast es in der Arbeit vergessen."]] },
    { t: "dlg", q: "Bei mir oder bei dir?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Nähdäänkö sinun luonasi vai minun luonani?"], ["Sinä", "[Minun luonani!|Minun luonani. Tervetuloa!|Minun luonani, tule kotiini!]", "Lade sie zu dir ein: „bei mir“."], ["Aino", "Kiva! Tuonko jotain mukanani?"], ["Sinä", "[Ei tarvitse, kiitos!|Ei tarvitse.|Ei tarvitse mitään.]", "Sag: nicht nötig."]] },
    { t: "sch", q: "Schreib, mit wem du wohnst (mit Possessivsuffix).", w: ["kanssa"], a: ["Asun perheeni kanssa.", "Asun ystäväni kanssa Linzissä.", "Asun kissani kanssa."], h: "ein Satz mit Possessivsuffix" },
    { t: "sch", q: "Schreib, dass du deinen Schlüssel zu Hause vergessen hast.", w: ["unohdin"], a: ["Unohdin avaimeni kotiin.", "Minä unohdin avaimeni kotiin."], h: "ein Satz – „vergessen“ mit der Wohin-Form: kotiin" }
  ]
};
