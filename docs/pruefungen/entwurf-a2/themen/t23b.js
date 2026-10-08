module.exports = {
  id: "t23b",
  title: "E-Mail & Brief: Anrede, Dank, Gruß (23.2)",
  fi: "Ystävällisin terveisin",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t20d", "t21d"],
  th: `<p>Vertiefung zu t23: kurze E-Mails und Nachrichten schreiben – förmlich (an ein Amt, eine Lehrerin) und vertraut (an Freunde). Das ist auch eine typische Aufgabe in der YKI-Prüfung.</p>
<h3>Aufbau einer E-Mail</h3>
<table><tr><td>Teil</td><td>förmlich</td><td>vertraut</td></tr>
<tr><td>Anrede</td><td>Hyvä Anna Virtanen,</td><td>Hei Anna! / Moi!</td></tr>
<tr><td>Dank</td><td>Kiitos viestistä.</td><td>Kiitos viestistä!</td></tr>
<tr><td>Grund</td><td>Kirjoitan, koska minulla on kysymys.</td><td>Mitä kuuluu?</td></tr>
<tr><td>Schluss</td><td>Odotan vastausta.</td><td>Toivottavasti nähdään pian!</td></tr>
<tr><td>Gruß</td><td>Ystävällisin terveisin, Matthias</td><td>Terveisin / Moikka, Matthias</td></tr></table>
<p class="rule">Nach der Anrede steht im Finnischen meist ein <b>Komma</b> und der Text beginnt klein – oder ein Ausrufezeichen und der Text beginnt groß. <i>Hyvä</i> (wörtlich „gut“) ist die normale förmliche Anrede wie „Sehr geehrte/r“.</p>
<h3>Kiitos …-sta, terveisiä …-sta, sano terveisiä …-lle</h3>
<table><tr><td>Kiitos viestistä / kuvasta!</td><td>Danke für die Nachricht / das Bild!</td></tr>
<tr><td>Terveisiä Linzistä!</td><td>Grüße aus Linz!</td></tr>
<tr><td>Sano terveisiä Ainolle!</td><td>Grüß Aino von mir!</td></tr>
<tr><td>Lähetän kuvan liitteenä.</td><td>Ich schicke das Bild als Anhang.</td></tr></table>
<p class="rule">Wofür man dankt, steht mit <b>-sta/-stä</b>. <i>liitteenä</i> = als Anhang (Essiv, t20). Oft liest du <i>Kiitos viestistäsi</i> – <b>-si</b> heißt „dein“ (Possessivsuffix, kommt in t24); ohne -si ist es auch richtig.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip">In Nachrichten unter Freunden: <i>Moikka!</i>, <i>Moi moi!</i>, <i>Kiitti!</i> (= kiitos), <i>Nähdään!</i>, <i>Terkkuja!</i> (= terveisiä). Förmliche E-Mails bleiben bei <i>Ystävällisin terveisin</i>.</p>`,
  v: [
    ["sähköposti", "E-Mail"],
    ["liite", "Anhang (liitteenä = als Anhang)"],
    ["otsikko", "Betreff, Überschrift"],
    ["hyvä …", "Sehr geehrte/r … (förmliche Anrede)"],
    ["kiitos viestistä", "danke für die Nachricht"],
    ["toivottavasti", "hoffentlich"],
    ["odotan vastausta", "ich warte auf (eine) Antwort"],
    ["terveisin", "viele Grüße (am Ende)"],
    ["ystävällisin terveisin", "mit freundlichen Grüßen"],
    ["sano terveisiä", "grüß … von mir (sano terveisiä Ainolle)"],
    ["moikka", "tschüss; hallo (vertraut)"],
    ["lähettäjä", "Absender/in"],
    ["vastaanottaja", "Empfänger/in"],
    ["postilaatikko", "Briefkasten"],
    ["kuva", "Bild, Foto"],
    ["asia", "Sache, Angelegenheit (Mitä asiaa? = Worum geht's?)"]
  ],
  ex: [
    { t: "tab", q: "Förmlich und vertraut", h: "Jedes Kästchen eine Wendung: links förmlich, rechts vertraut", head: ["Teil", "förmlich", "vertraut"], r: [["Anrede an Anna", "[Hyvä Anna|Hyvä Anna Virtanen]", "[Hei Anna|Moi Anna|Hei|Moi]"], ["Gruß am Ende", "[Ystävällisin terveisin]", "[Terveisin|Moikka|Moi moi]"]] },
    { t: "tab", q: "Danke für …, Grüße aus …", h: "Jedes Kästchen eine ganze Wendung: kiitos / terveisiä + Wort mit -sta/-stä", head: ["Deutsch", "Suomeksi"], r: [["Danke für die Nachricht", "[Kiitos viestistä]"], ["Danke für die E-Mail", "[Kiitos sähköpostista]"], ["Danke für das Bild", "[Kiitos kuvasta]"], ["Grüße aus Linz", "[Terveisiä Linzistä]"], ["Grüße aus Finnland", "[Terveisiä Suomesta]"]] },
    { t: "gap", q: "Kiitos ___!", h: "viesti + -stä: für die Nachricht", a: ["viestistä"] },
    { t: "gap", q: "Lähetän kuvan ___.", h: "liite im Essiv: als Anhang", a: ["liitteenä"], s: 1 },
    { t: "gap", q: "___ terveisin, Matthias", h: "förmlicher Gruß: „mit freundlichsten …“", a: ["Ystävällisin"] },
    { t: "gap", q: "Sano terveisiä ___!", h: "Aino + -lle: an Aino", a: ["Ainolle"] },
    { t: "gap", q: "___ nähdään pian!", h: "hoffentlich", a: ["Toivottavasti"] },
    { t: "gap", q: "Mikä on sähköpostin ___?", h: "Betreff", a: ["otsikko"] },
    { t: "tr", dir: "de", q: "Grüße aus Wien!", a: ["Terveisiä Wienistä"] },
    { t: "tr", dir: "de", q: "Ich schicke das Bild als Anhang.", a: ["Lähetän kuvan liitteenä", "Minä lähetän kuvan liitteenä", "Lähetän liitteenä kuvan"] },
    { t: "tr", dir: "de", q: "Hoffentlich geht es dir gut.", a: ["Toivottavasti sinulla menee hyvin", "Toivottavasti sinulle kuuluu hyvää"] },
    { t: "tr", dir: "fi", q: "Odotan vastausta.", a: ["Ich warte auf eine Antwort", "Ich warte auf Antwort", "Ich freue mich auf eine Antwort"] },
    { t: "tr", dir: "fi", q: "Postilaatikossa on kirje.", a: ["Im Briefkasten ist ein Brief", "Im Briefkasten liegt ein Brief"] },
    { t: "ord", w: ["Kiitos", "kuvasta", "se", "on", "ihana"], a: ["Kiitos kuvasta, se on ihana!"], de: "Danke für das Bild, es ist wunderbar!" },
    { t: "ord", w: ["Kirjoitan", "koska", "minulla", "on", "kysymys"], a: ["Kirjoitan, koska minulla on kysymys."], de: "Ich schreibe, weil ich eine Frage habe." },
    { t: "mc", q: "Du schreibst an ein Amt. Wie beendest du die E-Mail?", o: ["Ystävällisin terveisin", "Moikka!", "Hei hei!", "Nähdään!"], a: 0 },
    { t: "mc", q: "Du schreibst deiner Freundin Aino. Welche Anrede passt?", o: ["Moi Aino!", "Hyvä Aino Virtanen", "Ystävällisin terveisin", "Odotan vastausta."], a: 0 },
    { t: "mc", q: "„Kiitos viestistä“ – warum -stä?", o: ["Wofür man dankt, steht mit -sta/-stä.", "-stä heißt hier „in“.", "Weil viesti ein Fremdwort ist.", "Das ist die Teilungsform."], a: 0, x: "kiitos + -sta/-stä: kiitos viestistä, kiitos kuvasta. Auch Grüße „aus“: Terveisiä Linzistä!" },
    { t: "mc", q: "„Lähetän kuvan liitteenä.“ – Was ist -nä?", o: ["Essiv: „als“ (Anhang)", "Translativ: „zu“", "Ort: „im“ Anhang", "Verneinung"], a: 0, x: "Essiv = in einer Rolle: liitteenä (als Anhang), opettajana (als Lehrer). liite → liitteen → liitteenä (langer Stamm wie in 21.4)." },
    { t: "mc", q: "„Kiitos viestistäsi“ – was bedeutet -si?", o: ["dein: deine Nachricht", "Mehrzahl: Nachrichten", "Frage", "Vergangenheit"], a: 0, x: "-si = dein (Possessivsuffix): viestisi, nimesi. Mehr in t24. Ohne -si ist es auch richtig: Kiitos viestistä." },
    { t: "les", q: "Sähköposti kurssista", txt: ["Otsikko: Kysymys kurssista", "Hyvä Anna Virtanen,", "kiitos viestistä. Minulla on kysymys: milloin kurssi alkaa?", "Lähetän lomakkeen liitteenä.", "Ystävällisin terveisin", "Matthias"], qs: [{ q: "Was ist der Betreff?", o: ["eine Frage zum Kurs", "eine Einladung", "eine Rechnung"], a: 0 }, { q: "Was will Matthias wissen?", o: ["wann der Kurs beginnt", "was der Kurs kostet", "wo der Kurs ist"], a: 0 }, { q: "Was schickt er mit?", o: ["ein Formular als Anhang", "ein Foto", "nichts"], a: 0 }] },
    { t: "les", q: "Viesti Oulusta", txt: ["Moi Matthias!", "Kiitos kuvasta! Linz on tosi kaunis.", "Täällä Oulussa sataa lunta.", "Toivottavasti nähdään pian!", "Sano terveisiä siskolle!", "Terveisin, Aino"], qs: [{ q: "Wofür bedankt sich Aino?", o: ["für ein Foto", "für einen Brief", "für ein Geschenk"], a: 0 }, { q: "Wie ist das Wetter in Oulu?", o: ["Es schneit.", "Es ist warm.", "Es regnet."], a: 0 }, { q: "Wen soll Matthias grüßen?", o: ["seine Schwester", "seinen Chef", "Ville"], a: 0 }] },
    { t: "dlg", q: "Hast du meine E-Mail bekommen?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Sain sähköpostin. Kiitos!"], ["Sinä", "[Ole hyvä! Oletko lukenut liitteen?|Ei kestä! Luitko liitteen?|Ole hyvä. Avasitko liitteen?]", "Antworte freundlich und frag, ob sie den Anhang gelesen hat."], ["Aino", "En vielä. Mikä se on?"], ["Sinä", "[Se on kuva Linzistä.|Kuva Linzistä.]", "Sag: ein Bild aus Linz."], ["Aino", "Kiva! Sano terveisiä Villelle!"], ["Sinä", "[Kiitos, sanon!|Selvä, sanon terveisiä.|Selvä!]", "Sag, dass du es ausrichtest."]] },
    { t: "dlg", q: "Post für dich", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Onko postilaatikossa jotain?"], ["Sinä", "[On, kirje sinulle.|Siellä on kirje sinulle.|On. Kirje sinulle.]", "Sag ja: ein Brief für sie."], ["Aino", "Kuka on lähettäjä?"], ["Sinä", "[En tiedä.|Minä en tiedä.|En tiedä, katso.]", "Sag, dass du es nicht weißt."]] },
    { t: "sch", q: "Schreib eine kurze förmliche E-Mail an die Lehrerin Anna Virtanen: Du fragst, wann der Kurs beginnt.", w: ["hyvä", "ystävällisin terveisin"], a: ["Hyvä Anna Virtanen, milloin kurssi alkaa? Ystävällisin terveisin, Matthias", "Hyvä Anna, minulla on kysymys: milloin kurssi alkaa? Ystävällisin terveisin, Matthias"], h: "Anrede, eine Frage, Gruß" },
    { t: "sch", q: "Schreib einer Freundin eine kurze Nachricht mit Grüßen aus Linz.", w: ["terveisiä"], a: ["Moi Aino! Terveisiä Linzistä! Toivottavasti nähdään pian.", "Hei Aino! Terveisiä Linzistä! Moikka!"], h: "zwei oder drei kurze Sätze" }
  ]
};
