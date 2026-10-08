module.exports = {
  id: "t21d",
  title: "Stufenwechsel umgekehrt: lomake → lomakkeen, rakas → rakkaan (21.4)",
  fi: "Lomake ja osoite",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t20d"],
  th: `<p>Vertiefung zu t21 und 21.3: Bei vielen Wörtern auf <b>-e</b> und auf <b>-as / -is</b> ist es umgekehrt als gewohnt: Die <b>Grundform ist schwach</b>, die gebeugten Formen sind <b>stark</b> und haben einen <b>langen Vokal</b>.</p>
<h3>Wörter auf -e</h3>
<table><tr><td>Grundform</td><td>-n-Form, -ssa</td><td>Teilungsform</td></tr>
<tr><td>lomake (Formular)</td><td>lomakkeen, lomakkeessa</td><td>lomaketta</td></tr>
<tr><td>osoite (Adresse)</td><td>osoitteen, osoitteessa</td><td>osoitetta</td></tr>
<tr><td>liike (Geschäft)</td><td>liikkeen, liikkeessä</td><td>liikettä</td></tr>
<tr><td>sade (Regen)</td><td>sateen, sateessa</td><td>sadetta</td></tr>
<tr><td>huone (Zimmer)</td><td>huoneen, huoneessa</td><td>huonetta</td></tr></table>
<p class="rule">Wohin: <i>lomakkeeseen, osoitteeseen, huoneeseen</i> (langer Vokal + <b>-seen</b>).</p>
<h3>Wörter auf -as / -is</h3>
<table><tr><td>Grundform</td><td>-n-Form, -ssa</td><td>Teilungsform</td></tr>
<tr><td>rakas (lieb)</td><td>rakkaan, rakkaassa</td><td>rakasta</td></tr>
<tr><td>opas (Führer/in)</td><td>oppaan, oppaassa</td><td>opasta</td></tr>
<tr><td>hammas (Zahn)</td><td>hampaan, hampaassa</td><td>hammasta</td></tr>
<tr><td>kallis (teuer)</td><td>kalliin, kalliissa</td><td>kallista</td></tr>
<tr><td>kaunis (schön)</td><td>kauniin, kauniissa</td><td>kaunista</td></tr></table>
<p class="rule"><b>Regel:</b> Alle Endungen außer der Teilungsform kommen an den <b>langen Stamm</b>: -e → <b>-ee-</b>, -as → <b>-aa-</b>, -is → <b>-ii-</b>, dazu die <b>starke Stufe</b> (k → kk, t → tt, d → t, p → pp, mm → mp). Die <b>Teilungsform</b> hängt -tta/-ttä bzw. -ta/-tä an die Grundform: <i>lomaketta, rakasta</i>.</p>
<p class="rule">Das kennst du schon von den Verben Typ 4: <i>tavata → tapaan, hypätä → hyppään</i> – Grundform schwach, Formen stark. Und von <i>huone → huoneessa</i> und <i>koe → kokeessa</i>.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip">Lange Endungen werden verkürzt: <i>Mä oon huonees</i> (= huoneessa), <i>sateel</i> (= sateella). Statt <i>lomake</i> sagt man oft <i>lappu</i> (Zettel): <i>Täytä tää lappu.</i></p>`,
  v: [
    ["lomake", "Formular (lomakkeen, lomaketta)"],
    ["osoite", "Adresse (osoitteen, osoitetta)"],
    ["liike", "Geschäft, Laden; Bewegung (liikkeen)"],
    ["sade", "Regen (sateen; sateella = bei Regen)"],
    ["rakas", "lieb, geliebt (rakkaan, rakasta)"],
    ["opas", "Reiseführer/in; Führer (oppaan)"],
    ["taivas", "Himmel (taivaan)"]
  ],
  ex: [
    { t: "tab", q: "Wörter auf -e: die -n-Form", h: "Jedes Kästchen ein Wort: -e wird zu -ee- + n, mit starker Stufe (k → kk, t → tt, d → t)", head: ["Grundform", "-n-Form"], r: [["lomake", "[lomakkeen]"], ["osoite", "[osoitteen]"], ["liike", "[liikkeen]"], ["sade", "[sateen]"], ["koe", "[kokeen]"], ["huone", "[huoneen]"]], s: 1 },
    { t: "tab", q: "Wörter auf -as / -is", h: "Jedes Kästchen eine eigene Form: links die -n-Form (langer Stamm, stark), rechts die Teilungsform (Grundform + -ta) – z. B. rakas | rakkaan | rakasta", head: ["Grundform", "-n-Form", "Teilungsform"], r: [["rakas", "[rakkaan]", "[rakasta]"], ["opas", "[oppaan]", "[opasta]"], ["hammas", "[hampaan]", "[hammasta]"], ["kallis", "[kalliin]", "[kallista]"], ["kaunis", "[kauniin]", "[kaunista]"]], s: 1 },
    { t: "gap", q: "Kirjoita nimi ___.", h: "lomake + Wohin-Form (-seen): ins Formular", a: ["lomakkeeseen"], s: 1 },
    { t: "gap", q: "Lähetä se tähän ___.", h: "osoite + Wohin-Form (-seen): an diese Adresse", a: ["osoitteeseen"], s: 1 },
    { t: "gap", q: "Olin eilen ___.", h: "liike + -ssä: im Geschäft", a: ["liikkeessä"], s: 1 },
    { t: "gap", q: "Kävelin kotiin ___.", h: "sade + -ssa: im Regen", a: ["sateessa"], s: 1 },
    { t: "gap", q: "___ sattuu.", h: "hammas in der Wohin-Form (wie päähän sattuu)", a: ["Hampaaseen"], s: 1 },
    { t: "gap", q: "Kysy ___!", h: "opas + -lta: (den) Reiseführer fragen", a: ["oppaalta"], s: 1 },
    { t: "tr", dir: "de", q: "Ich brauche ein Formular.", a: ["Tarvitsen lomakkeen", "Minä tarvitsen lomakkeen", "Tarvitsen lomaketta"] },
    { t: "tr", dir: "de", q: "Das Geschäft ist im Zentrum.", a: ["Liike on keskustassa"] },
    { t: "tr", dir: "de", q: "Bei Regen bin ich zu Hause.", a: ["Sateella olen kotona", "Sateella minä olen kotona", "Olen kotona sateella"] },
    { t: "tr", dir: "fi", q: "Opas puhuu saksaa ja suomea.", a: ["Der Reiseführer spricht Deutsch und Finnisch", "Die Reiseführerin spricht Deutsch und Finnisch", "Der Führer spricht Deutsch und Finnisch"] },
    { t: "tr", dir: "fi", q: "Kirjoita osoite lomakkeeseen.", a: ["Schreib die Adresse ins Formular", "Schreibe die Adresse in das Formular", "Schreib die Adresse in das Formular"] },
    { t: "ord", w: ["Liike", "on", "kiinni", "sunnuntaina"], a: ["Liike on kiinni sunnuntaina.", "Sunnuntaina liike on kiinni."], de: "Das Geschäft ist am Sonntag geschlossen." },
    { t: "ord", w: ["Kirjoitin", "osoitteen", "lomakkeeseen"], a: ["Kirjoitin osoitteen lomakkeeseen.", "Lomakkeeseen kirjoitin osoitteen."], de: "Ich habe die Adresse ins Formular geschrieben." },
    { t: "mc", q: "Warum „lomake“ → „lomakkeen“ mit kk?", o: ["Die Grundform ist schwach, die gebeugten Formen sind stark (umgekehrter Stufenwechsel).", "Weil -n immer kk macht.", "Das ist ein Tippfehler.", "Weil lomake ein langes Wort ist."], a: 0, x: "Grundform schwach (lomake, sade, rakas, hammas), gebeugt stark mit langem Vokal (lomakkeen, sateen, rakkaan, hampaan). Genauso bei Verben Typ 4: tavata → tapaan." },
    { t: "mc", q: "Wie heißt die Teilungsform von „lomake“?", o: ["lomaketta", "lomakkeetta", "lomakkeita", "lomakkeen"], a: 0, x: "Die Teilungsform hängt -tta/-ttä an die Grundform: lomaketta, sadetta, osoitetta; bei -as/-is -ta/-tä: rakasta, kallista." },
    { t: "mc", q: "Welches Wort gehört NICHT zu diesem Muster?", o: ["talo", "huone", "sade", "rakas"], a: 0, x: "talo → talon ist normal. huone → huoneen, sade → sateen, rakas → rakkaan: langer Stamm auf -ee-/-aa-." },
    { t: "mc", q: "Gesprochen: „Täytä tää lappu.“ bedeutet:", o: ["Füll diesen Zettel (dieses Formular) aus.", "Zeig mir diesen Zettel.", "Wirf den Zettel weg.", "Schreib deine Adresse."], a: 0, x: "tää = tämä; lappu = Zettel – im Alltag oft statt lomake." },
    { t: "les", q: "Kaupunkikierros", txt: ["Opas: Hei kaikki! Olen Ville ja olen opas tänään.", "Opas: Ensin kävelemme torille. Siellä on kaunis kirkko.", "Opas: Sitten menemme museoon. Sateella se on kiva.", "Matthias: Anteeksi, mikä on museon osoite?", "Opas: Osoite on Kauppakatu 5."], qs: [{ q: "Wer ist Ville?", o: ["der Reiseführer", "ein Verkäufer", "ein Lehrer"], a: 0 }, { q: "Was gibt es am Marktplatz?", o: ["eine schöne Kirche", "ein Museum", "ein Café"], a: 0 }, { q: "Wonach fragt Matthias?", o: ["nach der Adresse des Museums", "nach dem Preis", "nach der Uhrzeit"], a: 0 }] },
    { t: "les", q: "Rakas Aino!", txt: ["Rakas Aino!", "Kiitos kirjeestä!", "Täällä Linzissä sataa joka päivä.", "Sateella istun kotona ja luen.", "Lähetä minulle uusi osoite!", "Matthias"], qs: [{ q: "Wie ist das Wetter in Linz?", o: ["Es regnet jeden Tag.", "Es ist sonnig.", "Es schneit."], a: 0 }, { q: "Was macht Matthias bei Regen?", o: ["Er sitzt zu Hause und liest.", "Er geht spazieren.", "Er arbeitet."], a: 0 }, { q: "Was soll Aino schicken?", o: ["ihre neue Adresse", "ein Foto", "ein Buch"], a: 0 }] },
    { t: "dlg", q: "Das Formular", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Opettaja", "Täytä tämä lomake, kiitos."], ["Sinä", "[Mitä kirjoitan tähän?|Mitä minä kirjoitan tähän?]", "Frag, was du hier hineinschreiben sollst."], ["Opettaja", "Nimi ja osoite."], ["Sinä", "[Selvä. Tarvitsetko myös numeron?|Selvä. Entä numero?|Tarvitsetko myös numeron?]", "Sag „klar“ und frag, ob sie auch die Nummer braucht."], ["Opettaja", "Kyllä, kiitos."]] },
    { t: "dlg", q: "Im Regen", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Sataa! Haluatko mennä kotiin?"], ["Sinä", "[En, sateella on kiva kävellä.|Ei, sateella on kiva kävellä.|En. Sateella on kiva kävellä.]", "Sag nein: Bei Regen ist es schön, spazieren zu gehen."], ["Aino", "Minulla on kylmä."], ["Sinä", "[Mennään kahvilaan!|Mennään sitten kahvilaan!]", "Schlag vor: Gehen wir ins Café!"], ["Aino", "Hyvä idea!"]] },
    { t: "sch", q: "Schreib, was du bei Regen machst.", w: ["sateella"], a: ["Sateella olen kotona ja luen.", "Sateella luen kirjaa kotona.", "Sateella juon kahvia kotona."], h: "ein Satz auf Finnisch" },
    { t: "sch", q: "Schreib, dass du die Adresse ins Formular schreibst.", w: ["osoitteen", "lomakkeeseen"], a: ["Kirjoitan osoitteen lomakkeeseen.", "Minä kirjoitan osoitteen lomakkeeseen."], h: "ein Satz auf Finnisch" }
  ]
};
