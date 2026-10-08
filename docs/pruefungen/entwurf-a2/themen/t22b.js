module.exports = {
  id: "t22b",
  title: "Kochen & Rezepte: Keitä, lisää, sekoita! (22.2)",
  fi: "Resepti",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t21b"],
  th: `<p>Vertiefung zu t22: ein Rezept lesen und zusammen kochen. Rezepte sprechen dich mit der <b>Befehlsform</b> an und nennen <b>Mengen</b>.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Kuori ja leikkaa perunat.</td><td>Schäle und schneide die Kartoffeln.</td></tr>
<tr><td>Keitä perunoita kaksikymmentä minuuttia.</td><td>Koche die Kartoffeln zwanzig Minuten.</td></tr>
<tr><td>Lisää kaksi desilitraa kermaa.</td><td>Gib zwei Deziliter Sahne dazu.</td></tr>
<tr><td>Sekoita jauhot ja sokeri.</td><td>Misch das Mehl und den Zucker.</td></tr>
<tr><td>Paista uunissa 200 asteessa.</td><td>Back im Ofen bei 200 Grad.</td></tr>
<tr><td>Leivon tänään pullaa.</td><td>Ich backe heute Pulla.</td></tr>
</table>
<h3>Befehlsform (sinä) = minä-Form ohne -n</h3>
<table><tr><td>Grundform</td><td>minä</td><td>Befehl</td></tr>
<tr><td>keittää (kochen)</td><td>keitän</td><td>keitä!</td></tr>
<tr><td>sekoittaa (mischen)</td><td>sekoitan</td><td>sekoita!</td></tr>
<tr><td>leikata (schneiden)</td><td>leikkaan</td><td>leikkaa!</td></tr>
<tr><td>lisätä (dazugeben)</td><td>lisään</td><td>lisää!</td></tr>
<tr><td>kuoria (schälen)</td><td>kuorin</td><td>kuori!</td></tr>
<tr><td>leipoa (backen)</td><td>leivon</td><td>leivo!</td></tr></table>
<p class="rule">Der Befehl hat dieselbe Stufe wie die minä-Form: <i>keittää → keitä</i> (schwach), <i>leikata → leikkaa</i> (stark, Typ 4). Das Objekt steht beim Befehl ohne -n: <i>Leikkaa sipuli!</i> (Mehrzahl: <i>Leikkaa perunat!</i>). Für mehrere: <i>keittäkää, lisätkää</i> (16.3). In Kochbüchern steht oft auch das Passiv: <i>Perunat keitetään.</i> (t26).</p>
<h3>Mengen</h3>
<p class="rule">Zahl + Maß in der Teilungsform Einzahl + Stoff in der Teilungsform: <i>kaksi desilitraa maitoa, sata grammaa voita</i>; ohne Zahl (= eins) steht das Maß in der Grundform: <i>teelusikka suolaa</i>. Zählbares in der Mehrzahl: <i>viisisataa grammaa perunoita</i>; nach einer Zahl direkt: <i>kolme munaa</i>. <i>jauhot</i> (Mehl) steht im Rezept fast immer in der Mehrzahl: <i>jauhoja</i>.</p>
<p class="tip">Abkürzungen: <i>dl</i> = desilitra (0,1 l), <i>rkl</i> = ruokalusikka (Esslöffel), <i>tl</i> = teelusikka (Teelöffel), <i>g</i> = gramma.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mä teen ruokaa</i> oder <i>Mä kokkaan</i> (= Ich koche) · <i>Laita uuni päälle!</i> = Schalt den Ofen ein! · <i>Nam!</i> oder <i>Namskis!</i> = Lecker!</p>
<p class="tip"><b>Kulttuuri:</b> Typisch finnisch: <i>lohikeitto</i> (Lachssuppe mit Sahne), <i>karjalanpiirakka</i> (Karelische Piroggen) und <i>pulla</i> mit Kardamom zum Kaffee.</p>`,
  v: [
    ["keittää", "kochen (in Wasser), sieden (keitän)"],
    ["paistaa pannulla", "in der Pfanne braten (paistan)"],
    ["leikata", "schneiden (leikkaan)"],
    ["sekoittaa", "mischen, umrühren (sekoitan)"],
    ["lisätä", "dazugeben, hinzufügen (lisään)"],
    ["kuoria", "schälen (kuorin)"],
    ["leipoa", "backen (leivon)"],
    ["desilitra", "Deziliter (kaksi desilitraa)"],
    ["ruokalusikka", "Esslöffel"],
    ["teelusikka", "Teelöffel"],
    ["jauhot", "Mehl (jauhoja)"],
    ["kerma", "Sahne, Obers"],
    ["suola", "Salz"],
    ["pippuri", "Pfeffer"],
    ["kattila", "Kochtopf"],
    ["paistinpannu", "Bratpfanne"],
    ["asteessa", "bei … Grad (200 asteessa)"]
  ],
  ex: [
    { t: "tab", q: "Befehlsform im Rezept", h: "Jedes Kästchen eine eigene Form: minä-Form und Befehl (= minä-Form ohne -n) – z. B. keittää | keitän | keitä", head: ["Grundform", "minä", "Befehl"], r: [["keittää", "[keitän]", "[keitä]"], ["sekoittaa", "[sekoitan]", "[sekoita]"], ["leikata", "[leikkaan]", "[leikkaa]"], ["lisätä", "[lisään]", "[lisää]"], ["kuoria", "[kuorin]", "[kuori]"], ["paistaa", "[paistan]", "[paista]"]], s: 1 },
    { t: "tab", q: "Mengen im Rezept", h: "Jedes Kästchen eine ganze Mengenangabe auf Finnisch, Zahlen als Wörter", head: ["Deutsch", "Suomeksi"], r: [["2 dl Mehl", "[kaksi desilitraa jauhoja]"], ["1 TL Salz", "[yksi teelusikka suolaa|teelusikka suolaa]"], ["3 Eier", "[kolme munaa]"], ["1 l Milch", "[yksi litra maitoa|litra maitoa]"], ["2 EL Zucker", "[kaksi ruokalusikkaa sokeria]"]] },
    { t: "gap", q: "___ perunat kattilassa.", h: "keittää – Befehl an „sinä“", a: ["Keitä"], s: 1 },
    { t: "gap", q: "___ sipuli pieneksi.", h: "leikata – Befehl an „sinä“", a: ["Leikkaa"] },
    { t: "gap", q: "Lisää kaksi desilitraa ___.", h: "jauhot in der Teilungsform (jauhot steht meist in der Mehrzahl)", a: ["jauhoja"] },
    { t: "gap", q: "Lisää teelusikka ___.", h: "suola in der Teilungsform", a: ["suolaa"] },
    { t: "gap", q: "Paista uunissa 200 ___.", h: "bei … Grad: aste + -ssa (langer Stamm wie huone → huoneessa)", a: ["asteessa"] },
    { t: "gap", q: "Laita kerma ___.", h: "kattila in der Wohin-Form: in den Topf", a: ["kattilaan"] },
    { t: "tr", dir: "de", q: "Schneide die Kartoffeln.", a: ["Leikkaa perunat"] },
    { t: "tr", dir: "de", q: "Ich backe heute einen Kuchen.", a: ["Leivon tänään kakun", "Tänään leivon kakun", "Minä leivon tänään kakun", "Leivon tänään kakkua", "Tänään leivon kakkua"] },
    { t: "tr", dir: "de", q: "Gib ein bisschen Salz und Pfeffer dazu.", a: ["Lisää vähän suolaa ja pippuria", "Lisää vähän suolaa ja vähän pippuria"] },
    { t: "tr", dir: "fi", q: "Keitä perunoita kaksikymmentä minuuttia.", a: ["Koch die Kartoffeln zwanzig Minuten", "Koche die Kartoffeln zwanzig Minuten", "Koch die Kartoffeln 20 Minuten", "Koche Kartoffeln zwanzig Minuten"] },
    { t: "tr", dir: "fi", q: "Tarvitset kattilan ja paistinpannun.", a: ["Du brauchst einen Topf und eine Pfanne", "Du brauchst einen Kochtopf und eine Bratpfanne", "Du brauchst einen Topf und eine Bratpfanne", "Du brauchst einen Kochtopf und eine Pfanne"] },
    { t: "ord", w: ["Sekoita", "jauhot", "ja", "sokeri"], a: ["Sekoita jauhot ja sokeri."], de: "Misch das Mehl und den Zucker." },
    { t: "ord", w: ["Paista", "kalaa", "pannulla", "viisi", "minuuttia"], a: ["Paista kalaa pannulla viisi minuuttia.", "Paista kalaa viisi minuuttia pannulla."], de: "Brate den Fisch fünf Minuten in der Pfanne." },
    { t: "mc", q: "Womit isst man Suppe?", o: ["lusikalla", "haarukalla", "veitsellä", "kattilalla"], a: 0 },
    { t: "mc", q: "Wie bildet man den Befehl an „sinä“ (z. B. im Rezept)?", o: ["minä-Form ohne -n: keitän → keitä", "Grundform ohne -a: keitt", "minä-Form + -kaa: keitänkaa", "Grundform + -n: keittään"], a: 0, x: "Darum hat der Befehl dieselbe Stufe wie die minä-Form: keittää → keitä, lukea → lue, leikata → leikkaa. An mehrere: keittäkää (16.3)." },
    { t: "mc", q: "Warum „kaksi desilitraa jauhoja“?", o: ["Nach der Zahl steht das Maß in der Teilungsform, der Stoff als Menge auch: jauhot → jauhoja", "Weil jauhoja Einzahl ist", "Weil der Satz verneint ist", "„desilitraa“ ist ein Fehler"], a: 0, x: "Zahl + Maß (Teilungsform Einzahl) + Stoff (Teilungsform): kaksi desilitraa maitoa, teelusikka suolaa. jauhot steht meist in der Mehrzahl." },
    { t: "mc", q: "„Leikkaa sipuli!“ – Warum hat das Objekt kein -n?", o: ["Beim Befehl steht das ganze Objekt in der Grundform.", "Weil sipuli ein Fremdwort ist.", "Weil der Satz verneint ist.", "Das ist ein Fehler, richtig wäre sipulin."], a: 0, x: "Befehl: Leikkaa sipuli! Osta leipä! (aus 14.3). Aussage: Leikkaan sipulin." },
    { t: "les", q: "Resepti: Lohikeitto", txt: ["Lohikeitto (4 annosta)", "500 g lohta, 6 perunaa, 1 sipuli, 1 l vettä, 2 dl kermaa, suolaa, pippuria", "1. Kuori ja leikkaa perunat ja sipuli.", "2. Keitä perunoita ja sipulia vedessä 15 minuuttia.", "3. Lisää lohi ja kerma.", "4. Keitä vielä 5 minuuttia. Lisää suolaa ja pippuria.", "Hyvää ruokahalua!"], qs: [{ q: "Für wie viele Portionen ist das Rezept?", o: ["vier", "zwei", "sechs"], a: 0 }, { q: "Was macht man zuerst?", o: ["Kartoffeln und Zwiebel schälen und schneiden", "den Lachs braten", "die Sahne kochen"], a: 0 }, { q: "Wann kommt der Lachs dazu?", o: ["nach 15 Minuten, mit der Sahne", "ganz am Anfang", "gar nicht"], a: 0 }] },
    { t: "les", q: "Pulla-aamu", txt: ["Aino: Leivon tänään pullaa. Autatko?", "Matthias: Totta kai! Mitä tarvitsemme?", "Aino: Jauhoja, maitoa, sokeria, voita ja yhden munan.", "Matthias: Paljonko jauhoja?", "Aino: Noin kymmenen desilitraa.", "Matthias: Ja kauanko uunissa?", "Aino: Kymmenen minuuttia, 225 asteessa."], qs: [{ q: "Was backt Aino?", o: ["Pulla", "Brot", "Kuchen"], a: 0 }, { q: "Wie viel Mehl braucht sie?", o: ["ungefähr 10 dl", "1 dl", "1 kg"], a: 0 }, { q: "Wie lange bleibt die Pulla im Ofen?", o: ["zehn Minuten", "eine Stunde", "225 Minuten"], a: 0 }] },
    { t: "dlg", q: "Zusammen kochen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Mitä minä teen?"], ["Sinä", "[Kuori perunat, kiitos.|Kuori perunat.|Voitko kuoria perunat?]", "Sag ihr, sie soll die Kartoffeln schälen."], ["Aino", "Selvä. Entä sinä?"], ["Sinä", "[Minä leikkaan sipulin.|Leikkaan sipulin.|Minä leikkaan sipulit.]", "Sag, dass du die Zwiebel schneidest."], ["Aino", "Lisäänkö suolaa?"], ["Sinä", "[Lisää vähän suolaa.|Kyllä, vähän.|Lisää vähän.]", "Sag: ein bisschen Salz dazugeben."]] },
    { t: "dlg", q: "Nach dem Rezept fragen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Tämä keitto on tosi herkullista!"], ["Sinä", "[Kiitos! Se on helppo.|Kiitos, se on helppo resepti.|Kiitos! Resepti on helppo.]", "Bedanke dich: Es ist einfach."], ["Aino", "Mitä keitossa on?"], ["Sinä", "[Lohta, perunoita ja kermaa.|Keitossa on lohta, perunoita ja kermaa.]", "Sag: Lachs, Kartoffeln und Sahne."], ["Aino", "Voitko lähettää reseptin?"], ["Sinä", "[Totta kai!|Kyllä, totta kai.|Voin!]", "Sag: na klar."]] },
    { t: "sch", q: "Schreib ein Mini-Rezept in zwei Schritten (Befehlsform).", w: ["keitä", "lisää"], a: ["Keitä perunat. Lisää voita ja suolaa.", "Keitä riisi vedessä. Lisää vähän suolaa."], h: "zwei kurze Sätze auf Finnisch" },
    { t: "sch", q: "Schreib, was du für einen Kuchen brauchst – mit Mengen.", w: ["desilitraa", "munaa"], a: ["Tarvitsen kolme desilitraa jauhoja, kaksi munaa ja sokeria.", "Tarvitsen kaksi munaa, kaksi desilitraa sokeria ja kolme desilitraa jauhoja."], h: "ein Satz, Zahlen als Wörter" }
  ]
};
