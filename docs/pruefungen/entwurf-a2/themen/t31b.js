module.exports = {
  id: "t31b",
  title: "Im Hotel & unterwegs: einchecken, Probleme melden (31.2)",
  fi: "Sisältyykö aamiainen hintaan?",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t31", "t20c", "t25b", "t30b"],
  th: `<p>Vertiefung zu t31: im Hotel einchecken, nach Frühstück und WLAN fragen, ein Problem im Zimmer melden und auschecken.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Minulla on varaus nimellä Matthias.</td><td>Ich habe eine Reservierung auf den Namen Matthias.</td></tr>
<tr><td>Haluaisin kahden hengen huoneen kolmeksi yöksi.</td><td>Ich hätte gern ein Doppelzimmer für drei Nächte.</td></tr>
<tr><td>Sisältyykö aamiainen hintaan?</td><td>Ist das Frühstück im Preis inbegriffen?</td></tr>
<tr><td>Mikä on wifin salasana?</td><td>Wie lautet das WLAN-Passwort?</td></tr>
<tr><td>Ilmastointi ei toimi.</td><td>Die Klimaanlage funktioniert nicht.</td></tr>
<tr><td>Huoneessa ei ole pyyhkeitä.</td><td>Im Zimmer sind keine Handtücher.</td></tr>
<tr><td>Mihin aikaan huone pitää luovuttaa?</td><td>Bis wann muss man das Zimmer räumen?</td></tr>
</table>
<h3>Was du schon kannst – hier angewendet</h3>
<p class="rule">Höflich mit Konditional (t27): <i>Haluaisin …, Voisitteko …?</i> Dauer mit -ksi (20.3): <i>kolmeksi yöksi</i>. „Es gibt keine …“ mit Teilungsform Mehrzahl: <i>Huoneessa ei ole pyyhkeitä</i>. Etwas funktioniert nicht (25.2): <i>… ei toimi</i>. <i>sisältyä</i> will die Wohin-Form: <i>sisältyä hintaan</i>.</p>
<p class="rule"><i>vastaanotto</i> kennst du als „Praxis“ (17.2) – im Hotel ist es die Rezeption.</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Onks aamupala hinnassa?</i> (= Sisältyykö aamiainen hintaan? <i>aamupala</i> = Frühstück, alltäglich) · <i>Mikä on wifin salis?</i> (<i>salis</i> = salasana)</p>
<p class="tip"><b>Kulttuuri:</b> In Finnland zählt das Erdgeschoss schon als <i>ensimmäinen kerros</i> (1. kerros). <i>kolmas kerros</i> ist also bei uns der 2. Stock.</p>`,
  v: [
    ["yhden hengen huone", "Einzelzimmer"],
    ["kahden hengen huone", "Doppelzimmer"],
    ["hinta", "Preis (hintaan, hinnassa)"],
    ["sisältyä", "inbegriffen sein (sisältyä hintaan)"],
    ["kirjautua sisään", "einchecken, sich anmelden (kirjaudun)"],
    ["kirjautua ulos", "auschecken, sich abmelden"],
    ["luovuttaa huone", "das Zimmer räumen, abgeben"],
    ["avainkortti", "Schlüsselkarte"],
    ["wifi", "WLAN"],
    ["salasana", "Passwort"],
    ["siivous", "Reinigung, Putzen (siivouksen)"],
    ["pyyhe", "Handtuch (pyyhkeen, pyyhkeitä)"],
    ["ilmastointi", "Klimaanlage"],
    ["herätys", "Weckruf, Wecken"],
    ["matkavakuutus", "Reiseversicherung"],
    ["matkalla", "unterwegs, auf Reisen"]
  ],
  ex: [
    { t: "tab", q: "An der Rezeption", h: "Jedes Kästchen ein ganzer Satz auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["Ich habe eine Reservierung.", "[Minulla on varaus.]"], ["Ist das Frühstück inbegriffen?", "[Sisältyykö aamiainen hintaan?]"], ["Wie lautet das WLAN-Passwort?", "[Mikä on wifin salasana?|Mikä wifin salasana on?]"], ["Die Klimaanlage funktioniert nicht.", "[Ilmastointi ei toimi.]"], ["Im Zimmer sind keine Handtücher.", "[Huoneessa ei ole pyyhkeitä.]"]] },
    { t: "gap", q: "Haluaisin kahden hengen huoneen kolmeksi ___.", h: "yö + -ksi: für (drei) Nächte", a: ["yöksi"] },
    { t: "gap", q: "Sisältyykö aamiainen ___?", h: "hinta in der Wohin-Form", a: ["hintaan"], s: 1 },
    { t: "gap", q: "Mikä on wifin ___?", h: "Passwort", a: ["salasana"] },
    { t: "gap", q: "Huoneessa ei ole ___.", h: "pyyhe – Teilungsform Mehrzahl (keine Handtücher)", a: ["pyyhkeitä"], s: 1 },
    { t: "gap", q: "Avainkortti ei ___.", h: "toimia – verneint: funktioniert nicht", a: ["toimi"] },
    { t: "gap", q: "Mihin aikaan huone pitää ___?", h: "luovuttaa – Grundform: räumen", a: ["luovuttaa"] },
    { t: "gap", q: "Olen ___ Suomessa.", h: "unterwegs, auf Reisen", a: ["matkalla"] },
    { t: "tr", dir: "de", q: "Ich hätte gern ein Einzelzimmer.", a: ["Haluaisin yhden hengen huoneen", "Haluaisin yhden hengen huoneen, kiitos"] },
    { t: "tr", dir: "de", q: "Was kostet ein Doppelzimmer?", a: ["Paljonko kahden hengen huone maksaa", "Paljonko maksaa kahden hengen huone", "Kuinka paljon kahden hengen huone maksaa", "Mitä kahden hengen huone maksaa", "Mikä on kahden hengen huoneen hinta"] },
    { t: "tr", dir: "de", q: "Hast du eine Reiseversicherung?", a: ["Onko sinulla matkavakuutus", "Onko sinulla matkavakuutusta"] },
    { t: "tr", dir: "fi", q: "Siivous tulee kello kymmenen.", a: ["Die Reinigung kommt um zehn Uhr", "Das Zimmer wird um zehn Uhr geputzt", "Die Putzkraft kommt um zehn Uhr"] },
    { t: "tr", dir: "fi", q: "Kirjauduin sisään illalla.", a: ["Ich habe am Abend eingecheckt", "Ich checkte am Abend ein"] },
    { t: "ord", w: ["Minulla", "on", "varaus", "nimellä", "Matthias"], a: ["Minulla on varaus nimellä Matthias."], de: "Ich habe eine Reservierung auf den Namen Matthias." },
    { t: "mc", q: "Im Zimmer ist es zu heiß. Was sagst du an der Rezeption?", o: ["Ilmastointi ei toimi.", "Wifi on hyvä.", "Haluaisin herätyksen.", "Kiitos viimeisestä!"], a: 0 },
    { t: "mc", q: "Was fragst du, wenn du wissen willst, ob das Frühstück inklusive ist?", o: ["Sisältyykö aamiainen hintaan?", "Missä aamiainen on?", "Onko aamiainen kallis?", "Syötkö aamiaista?"], a: 0 },
    { t: "mc", q: "„Huoneessa ei ole pyyhkeitä.“ – warum „pyyhkeitä“?", o: ["Verneintes „es gibt“ → Teilungsform (hier Mehrzahl)", "weil pyyhe ein langes Wort ist", "Das ist die Grundform.", "weil es eine Frage ist"], a: 0, x: "„Es gibt nicht“ will die Teilungsform: Huoneessa ei ole pyyhkeitä / sänkyä. pyyhe → pyyhkeen → pyyhkeitä (langer Stamm wie 21.4)." },
    { t: "mc", q: "„sisältyä hintaan“ – welcher Fall folgt auf „sisältyä“?", o: ["die Wohin-Form: hintaan", "die Teilungsform: hintaa", "-ssa: hinnassa", "-sta: hinnasta"], a: 0, x: "sisältyä + Wohin-Form: Aamiainen sisältyy hintaan. (wörtlich: ist im Preis „hinein“ enthalten)" },
    { t: "les", q: "Hotellin vastaanotossa", txt: ["Virkailija: Hyvää iltaa! Miten voin auttaa?", "Matthias: Minulla on varaus nimellä Matthias, kahden hengen huone kolmeksi yöksi.", "Virkailija: Kyllä, tässä on avainkortti. Huone on kolmannessa kerroksessa.", "Matthias: Sisältyykö aamiainen hintaan?", "Virkailija: Sisältyy. Aamiainen on kello 7–10. Wifin salasana on huoneessa."], qs: [{ q: "Wie lange bleibt Matthias?", o: ["drei Nächte", "eine Nacht", "eine Woche"], a: 0 }, { q: "In welchem Stock ist das Zimmer?", o: ["im 3. kerros – bei uns im 2. Stock", "im Erdgeschoss", "im 10. Stock"], a: 0 }, { q: "Wo findet er das WLAN-Passwort?", o: ["im Zimmer", "an der Rezeption", "im Internet"], a: 0 }] },
    { t: "les", q: "Ongelma huoneessa", txt: ["Matthias: Anteeksi, huoneessa on ongelma.", "Virkailija: Mikä ongelma?", "Matthias: Ilmastointi ei toimi, ja huoneessa ei ole pyyhkeitä.", "Virkailija: Voi anteeksi! Siivous tuo pyyhkeet pian. Voitte myös vaihtaa huonetta.", "Matthias: Kiitos, vaihdan mielelläni."], qs: [{ q: "Was funktioniert nicht?", o: ["die Klimaanlage", "das WLAN", "die Schlüsselkarte"], a: 0 }, { q: "Was fehlt im Zimmer?", o: ["Handtücher", "ein Bett", "eine Lampe"], a: 0 }, { q: "Was macht Matthias?", o: ["Er wechselt gern das Zimmer.", "Er reist ab.", "Er beschwert sich beim Chef."], a: 0 }] },
    { t: "dlg", q: "Einchecken", h: "Deine Zeilen auf Finnisch schreiben – höflich", r: [["Virkailija", "Hyvää iltaa!"], ["Sinä", "[Hyvää iltaa! Minulla on varaus.|Hyvää iltaa, minulla on varaus nimellä Matthias.]", "Grüß und sag, dass du reserviert hast."], ["Virkailija", "Kuinka moneksi yöksi?"], ["Sinä", "[Kahdeksi yöksi.|Kahdeksi yöksi, kiitos.]", "Sag: für zwei Nächte."], ["Virkailija", "Tässä on avainkortti."], ["Sinä", "[Kiitos! Mikä on wifin salasana?|Kiitos. Mikä wifin salasana on?]", "Bedanke dich und frag nach dem WLAN-Passwort."]] },
    { t: "dlg", q: "Auschecken", h: "Deine Zeilen auf Finnisch schreiben – höflich", r: [["Sinä", "[Haluaisin kirjautua ulos.|Hei, haluaisin luovuttaa huoneen.]", "Sag, dass du auschecken möchtest."], ["Virkailija", "Totta kai. Oliko kaikki hyvin?"], ["Sinä", "[Oli, kiitos! Aamiainen oli tosi hyvä.|Kyllä, kiitos.]", "Sag ja – das Frühstück war sehr gut."]] },
    { t: "sch", q: "Schreib eine kurze E-Mail an ein Hotel: Du möchtest ein Doppelzimmer für zwei Nächte buchen und fragst nach dem Frühstück.", w: ["kahden hengen huoneen", "sisältyykö"], a: ["Hei! Haluaisin varata kahden hengen huoneen kahdeksi yöksi. Sisältyykö aamiainen hintaan? Ystävällisin terveisin, Matthias", "Hyvä vastaanottaja, haluaisin varata kahden hengen huoneen kahdeksi yöksi. Sisältyykö aamiainen hintaan? Kiitos, Matthias"], h: "Anrede, zwei Sätze, Gruß" },
    { t: "sch", q: "Schreib, welches Problem es im Zimmer gibt.", w: ["ei toimi"], a: ["Huoneessa on ongelma: ilmastointi ei toimi.", "Avainkortti ei toimi."], h: "ein Satz" }
  ]
};
