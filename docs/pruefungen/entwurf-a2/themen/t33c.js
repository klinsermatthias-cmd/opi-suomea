module.exports = {
  id: "t33c",
  title: "Feinheiten: Der Fall ändert die Bedeutung – etsiä, puhua, kuulua (33.3)",
  fi: "Etsin avainta – löysin avaimen",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t31", "t32", "t33", "t33b", "t21b"],
  th: `<p>Feinheiten zu t33: Einige Verben wollen <b>immer die Teilungsform</b> – auch wenn der Satz bejaht ist. Und bei manchen Verben <b>ändert der Fall die Bedeutung</b>.</p>
<h3>Immer Teilungsform</h3>
<p class="rule"><i>etsiä, odottaa, auttaa, rakastaa, ajatella, kaivata</i> + Teilungsform: <i>Etsin avainta.</i> (Ich suche den Schlüssel.) <i>Odotan bussia.</i> Diese Handlungen haben kein fertiges Ergebnis. <i>löytää</i> (finden) dagegen schon: <i>Löysin avaimen.</i> Verneint: <i>En löydä avainta.</i></p>
<h3>Der Fall ändert die Bedeutung</h3>
<table><tr><td>Puhun suomea.</td><td>Ich spreche Finnisch.</td></tr>
<tr><td>Puhumme säästä.</td><td>Wir reden über das Wetter.</td></tr>
<tr><td>Ajattelen sinua.</td><td>Ich denke an dich.</td></tr>
<tr><td>Mitä ajattelet siitä?</td><td>Was hältst du davon?</td></tr>
<tr><td>Rakastan sinua.</td><td>Ich liebe dich.</td></tr>
<tr><td>Rakastuin sinuun.</td><td>Ich habe mich in dich verliebt.</td></tr>
<tr><td>Pidän sinusta.</td><td>Ich mag dich.</td></tr>
<tr><td>Pidän huolta sinusta.</td><td>Ich kümmere mich um dich.</td></tr>
<tr><td>Kuulun kuoroon.</td><td>Ich gehöre zum Chor.</td></tr>
<tr><td>Tämä kuuluu minulle.</td><td>Das gehört mir.</td></tr>
<tr><td>Se ei kuulu sinulle.</td><td>Das geht dich nichts an.</td></tr></table>
<p class="rule"><b>-sta = über:</b> <i>puhua, kertoa, kysyä</i> + -sta: <i>Kerro lomasta!</i> <b>Zustand – Veränderung:</b> <i>rakastaa</i> (lieben, Teilungsform) – <i>rakastua</i> (sich verlieben, Wohin-Form). Verben auf <i>-ua/-yä</i> bezeichnen oft eine Veränderung: <i>rakastua, ihastua</i> (+ Wohin-Form), <i>kiinnostua, innostua</i> (+ -sta).</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mä tykkään susta.</i> (= Pidän sinusta.) · <i>Mä ootan sua.</i> (= Odotan sinua.) · <i>Mitä sä tykkäät tästä?</i> (= Mitä ajattelet tästä?) · <i>Ei kuulu sulle!</i> (= Se ei kuulu sinulle.)</p>`,
  v: [
    ["rakastua", "sich verlieben (+ Wohin-Form: rakastuin sinuun)"],
    ["pitää huolta", "sich kümmern, aufpassen (+ -sta: pidän huolta lapsista)"],
    ["puhua säästä", "über das Wetter reden (puhua + -sta = über etwas)"],
    ["Mitä ajattelet siitä?", "Was hältst du davon?"],
    ["Se ei kuulu sinulle.", "Das geht dich nichts an."],
    ["odottaa innolla", "sich freuen auf (+ Teilungsform: odotan innolla lomaa)"],
    ["heti", "sofort"]
  ],
  ex: [
    { t: "tab", q: "Welcher Fall nach dem Verb?", h: "Jedes Kästchen ein Wort: das Wort in Klammern im Fall, den das Verb will", head: ["Satz (Wort)", "Form"], r: [["Etsin … (avain)", "[avainta]"], ["Löysin … (avain)", "[avaimen]"], ["En löydä … (avain)", "[avainta]"], ["Odotan … (bussi)", "[bussia]"], ["Rakastuin … (sinä)", "[sinuun]"], ["Pidän huolta … (lapset)", "[lapsista]"]], s: 1 },
    { t: "tab", q: "Gleiches Verb – andere Bedeutung", h: "Jedes Kästchen ein ganzer Satz auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["Ich spreche Finnisch.", "[Puhun suomea.]"], ["Wir reden über das Wetter.", "[Puhumme säästä.]"], ["Ich denke an dich.", "[Ajattelen sinua.]"], ["Ich habe mich in dich verliebt.", "[Rakastuin sinuun.]"], ["Das gehört mir.", "[Tämä kuuluu minulle.|Se kuuluu minulle.]"]] },
    { t: "gap", q: "Etsin ___ koko aamun.", h: "lompakko – etsiä will immer die Teilungsform", a: ["lompakkoa"], s: 1 },
    { t: "gap", q: "Lopulta löysin ___.", h: "lompakko – löytää: gefunden, fertig (-n; Stufenwechsel kk → k)", a: ["lompakon"], s: 1 },
    { t: "gap", q: "Puhumme usein ___.", h: "työ + -sta: über die Arbeit", a: ["työstä"], s: 1 },
    { t: "gap", q: "Mitä ajattelet ___?", h: "se + -sta: Was hältst du davon?", a: ["siitä"], s: 1 },
    { t: "gap", q: "Mikko rakastui ___.", h: "Aino – Wohin-Form", a: ["Ainoon"] },
    { t: "gap", q: "Pidän huolta ___.", h: "äiti + -sta (Stufenwechsel t → d)", a: ["äidistä"], s: 1 },
    { t: "gap", q: "Se ei ___ sinulle.", h: "kuulua – verneint: Das geht dich nichts an.", a: ["kuulu"] },
    { t: "gap", q: "Odotan innolla ___.", h: "loma – Teilungsform", a: ["lomaa"] },
    { t: "tr", dir: "de", q: "Ich freue mich auf den Urlaub.", a: ["Odotan innolla lomaa", "Odotan lomaa innolla", "Minä odotan innolla lomaa"] },
    { t: "tr", dir: "de", q: "Was hältst du davon?", a: ["Mitä ajattelet siitä", "Mitä ajattelet tästä", "Mitä mieltä olet siitä", "Mitä mieltä olet tästä"] },
    { t: "tr", dir: "fi", q: "Se ei kuulu sinulle.", a: ["Das geht dich nichts an", "Das geht dich nicht an"] },
    { t: "tr", dir: "fi", q: "Mä ootan sua kahvilassa.", a: ["Ich warte im Café auf dich", "Ich warte auf dich im Café"] },
    { t: "ord", w: ["Rakastuin", "sinuun", "heti"], a: ["Rakastuin sinuun heti.", "Rakastuin heti sinuun."], de: "Ich habe mich sofort in dich verliebt." },
    { t: "mc", q: "Eine Bekannte fragt etwas sehr Privates. Was sagst du (scherzhaft)?", o: ["Se ei kuulu sinulle!", "Mitä kuuluu?", "Kuulun kuoroon.", "Pidän huolta sinusta."], a: 0 },
    { t: "mc", q: "„Etsin avainta.“ – „Löysin avaimen.“ Warum verschiedene Fälle?", o: ["etsiä will immer die Teilungsform; bei löytää ist das Ergebnis fertig: -n", "avaimen ist die Mehrzahl.", "„Etsin avainta“ ist verneint.", "Das ist frei wählbar."], a: 0, x: "Immer Teilungsform: etsiä, odottaa, auttaa, rakastaa, ajatella, kaivata. Beim Finden ist das Ergebnis da: Löysin avaimen. Verneint wieder: En löydä avainta." },
    { t: "mc", q: "„Puhun suomea.“ – „Puhumme säästä.“ Was bedeutet -sta nach puhua?", o: ["über (das Thema)", "mit", "auf", "aus der Sprache übersetzt"], a: 0, x: "puhua + Teilungsform = eine Sprache sprechen; puhua + -sta = über etwas reden. Ebenso kertoa und kysyä + -sta: Kerro lomasta!" },
    { t: "mc", q: "„Rakastan sinua.“ – „Rakastuin sinuun.“ Was ist der Unterschied?", o: ["Zustand (lieben, Teilungsform) – Veränderung (sich verlieben, Wohin-Form)", "Gegenwart – Zukunft", "Es gibt keinen.", "Einzahl – Mehrzahl"], a: 0, x: "Verben auf -ua/-yä bezeichnen oft eine Veränderung: rakastua, ihastua (+ Wohin-Form), kiinnostua, innostua (+ -sta)." },
    { t: "mc", q: "Gesprochen: „Mä tykkään susta.“ – geschrieben:", o: ["Pidän sinusta.", "Pidän sinua.", "Tykkään sinuun.", "Pidin sinusta."], a: 0, x: "tykätä + -sta (gesprochen) = pitää + -sta. mä = minä, susta = sinusta." },
    { t: "les", q: "Missä lompakko on?", txt: ["Aamulla etsin lompakkoa koko talosta.", "Etsin keittiöstä ja makuuhuoneesta, mutta en löytänyt sitä.", "Soitin vaimolle ja kysyin, onko se autossa.", "Ei ollut.", "Lopulta löysin lompakon takista!"], qs: [{ q: "Was suchte er?", o: ["die Geldbörse", "den Schlüssel", "die Brille"], a: 0 }, { q: "Wo hat er zuerst gesucht?", o: ["in der Küche und im Schlafzimmer", "im Auto", "in der Arbeit"], a: 0 }, { q: "Wo war die Geldbörse?", o: ["in der Jacke", "im Auto", "im Kühlschrank"], a: 0 }] },
    { t: "les", q: "Aino ja Mikko", txt: ["Aino tutustui Mikkoon kesällä kuorossa.", "Hän ihastui Mikkoon heti.", "He puhuivat paljon musiikista ja kirjoista.", "Syksyllä Aino rakastui.", "Nyt he odottavat innolla kesälomaa."], qs: [{ q: "Wo haben sie sich kennengelernt?", o: ["im Chor", "in der Arbeit", "im Urlaub"], a: 0 }, { q: "Worüber sprachen sie?", o: ["über Musik und Bücher", "über das Wetter", "über die Arbeit"], a: 0 }, { q: "Worauf freuen sie sich?", o: ["auf den Sommerurlaub", "auf Weihnachten", "auf ein Konzert"], a: 0 }] },
    { t: "dlg", q: "Aino spricht umgangssprachlich", h: "Deine Zeilen auf Finnisch schreiben (Schriftsprache) – kurze Antworten reichen", r: [["Aino", "Mitä sä tykkäät tästä kirjasta?"], ["Sinä", "[Pidän siitä paljon.|Pidän siitä.|Tykkään siitä!]", "Sag: Du magst es sehr."], ["Aino", "Mä ootan innolla lomaa!"], ["Sinä", "[Minäkin odotan lomaa innolla!|Minäkin!|Niin minäkin.]", "Sag: Du auch!"]] },
    { t: "dlg", q: "Wo ist mein Schlüssel?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Mitä sinä etsit?"], ["Sinä", "[Etsin avainta.|Etsin avaintani.|Avainta.]", "Sag: den Schlüssel."], ["Aino", "Tässä se on! Löysin sen sohvalta."], ["Sinä", "[Kiitos! Hyvä, että löysit sen.|Kiitos paljon!|Kiitos!]", "Bedanke dich."]] },
    { t: "sch", q: "Schreib, worauf du dich freust (odottaa innolla + Teilungsform).", w: ["odotan innolla"], a: ["Odotan innolla kesää.", "Odotan innolla matkaa Suomeen."], h: "ein Satz" },
    { t: "sch", q: "Schreib, worüber du mit Freunden oft sprichst (puhua + -sta).", w: ["puhumme"], a: ["Puhumme usein työstä ja harrastuksista.", "Ystävien kanssa puhumme musiikista."], h: "ein Satz" }
  ]
};
