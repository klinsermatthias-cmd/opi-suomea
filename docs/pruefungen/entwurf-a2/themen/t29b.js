module.exports = {
  id: "t29b",
  title: "Charakter & Beziehungen: tutustua, luottaa, toisiaan (29.2)",
  fi: "He auttavat toisiaan",
  lvl: "A2.2",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29"],
  th: `<p>Vertiefung zu t29: wie jemand ist, wie man sich kennengelernt hat, Freunde, Nachbarn und Beziehungen – und das Wort für „einander“.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Tutustuin häneen kurssilla.</td><td>Ich habe ihn/sie im Kurs kennengelernt.</td></tr>
<tr><td>Luotan häneen.</td><td>Ich vertraue ihm/ihr.</td></tr>
<tr><td>Naapuri on tosi puhelias.</td><td>Der Nachbar / die Nachbarin ist sehr gesprächig.</td></tr>
<tr><td>He tuntevat toisensa hyvin.</td><td>Sie kennen einander gut.</td></tr>
<tr><td>He auttavat toisiaan.</td><td>Sie helfen einander.</td></tr>
<tr><td>Joskus riitelemme, mutta ystävyytemme on tärkeä.</td><td>Manchmal streiten wir, aber die Freundschaft ist wichtig.</td></tr>
</table>
<h3>Verben mit der Wohin-Form</h3>
<p class="rule"><b>tutustua</b> (kennenlernen) und <b>luottaa</b> (vertrauen) wollen die <b>Wohin-Form</b>: <i>tutustua Ainoon, luottaa ystävään</i>; bei Personen: <i>häneen, minuun, sinuun</i>. Mehr Verben mit festen Fällen in t33.</p>
<h3>einander: toisensa – toisiaan</h3>
<table><tr><td>ganzes Objekt</td><td>He tuntevat toisensa. (Sie kennen einander.)</td></tr>
<tr><td>Teilungsform</td><td>He auttavat toisiaan. (Sie helfen einander.)</td></tr>
<tr><td>-lle</td><td>He soittavat toisilleen. (Sie rufen einander an.)</td></tr></table>
<p class="rule">Die Form richtet sich nach dem Verb, wie bei jedem Objekt: <i>tuntea</i> + ganzes Objekt, <i>auttaa</i> + Teilungsform, <i>soittaa</i> + -lle. Bei <i>me</i> mit -mme: <i>Autamme toisiamme.</i></p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Me tutustuttiin kurssilla.</i> (= Tutustuimme kurssilla.) · <i>Se on tosi fiksu tyyppi.</i> · <i>kaveri</i> = Freund/in, Kumpel (sehr häufig statt ystävä).</p>
<p class="tip"><b>Kulttuuri:</b> Finnen gelten als eher zurückhaltend – Smalltalk mit Fremden ist seltener als in Österreich. Wer aber einmal <i>ystävä</i> ist, ist es oft fürs Leben.</p>`,
  v: [
    ["naapuri", "Nachbar/in"],
    ["tuttu", "Bekannte/r; bekannt"],
    ["ystävyys", "Freundschaft (ystävyyden)"],
    ["kumppani", "Partner/in"],
    ["tutustua", "kennenlernen (tutustun; + Wohin-Form)"],
    ["luottaa", "vertrauen (luotan; + Wohin-Form)"],
    ["häneen", "in ihn/sie, an ihn/sie (luotan häneen)"],
    ["riidellä", "streiten (riitelen)"],
    ["sosiaalinen", "gesellig, sozial"],
    ["puhelias", "gesprächig (puheliaan)"],
    ["älykäs", "klug, intelligent (älykkään)"],
    ["fiksu", "klug, vernünftig"],
    ["utelias", "neugierig (uteliaan)"],
    ["toisensa", "einander (ganzes Objekt)"],
    ["toisiaan", "einander (Teilungsform)"]
  ],
  ex: [
    { t: "tab", q: "Charakter", h: "Jedes Kästchen ein Wort auf Finnisch", head: ["Deutsch", "Suomeksi"], r: [["gesprächig", "[puhelias]"], ["neugierig", "[utelias]"], ["klug", "[älykäs|fiksu]"], ["gesellig", "[sosiaalinen]"], ["ehrlich", "[rehellinen]"], ["schüchtern", "[ujo]"]] },
    { t: "tab", q: "einander", h: "Jedes Kästchen ein Wort: Form von „einander“ passend zum Verb", head: ["Satz", "einander"], r: [["He tuntevat … (kennen)", "[toisensa]"], ["He auttavat … (helfen)", "[toisiaan]"], ["He soittavat … (anrufen, -lle)", "[toisilleen]"]], s: 1 },
    { t: "gap", q: "Tutustuin ___ kurssilla.", h: "hän in der Wohin-Form: ihn/sie kennengelernt", a: ["häneen"] },
    { t: "gap", q: "Luotan ___.", h: "ystävä in der Wohin-Form", a: ["ystävään"], s: 1 },
    { t: "gap", q: "He auttavat ___.", h: "einander – Teilungsform (auttaa + Teilungsform)", a: ["toisiaan"] },
    { t: "gap", q: "He tuntevat ___ hyvin.", h: "einander – ganzes Objekt", a: ["toisensa"] },
    { t: "gap", q: "Naapuri on tosi ___. Hän puhuu paljon.", h: "gesprächig", a: ["puhelias"] },
    { t: "gap", q: "Joskus me ___, mutta ystävyytemme on tärkeä.", h: "riidellä – Form für „me“ (Stufenwechsel d → t wie riitelen)", a: ["riitelemme"], s: 1 },
    { t: "tr", dir: "de", q: "Wo hast du ihn kennengelernt?", a: ["Missä tutustuit häneen", "Missä sinä tutustuit häneen"] },
    { t: "tr", dir: "de", q: "Ich vertraue meinem Nachbarn.", a: ["Luotan naapuriini", "Luotan naapuriin", "Minä luotan naapuriini"] },
    { t: "tr", dir: "de", q: "Sie ist klug und neugierig.", a: ["Hän on älykäs ja utelias", "Hän on fiksu ja utelias"] },
    { t: "tr", dir: "fi", q: "Olemme olleet tuttuja jo kymmenen vuotta.", a: ["Wir kennen uns schon seit zehn Jahren", "Wir sind seit zehn Jahren Bekannte", "Wir kennen uns schon zehn Jahre"] },
    { t: "tr", dir: "fi", q: "Hän on sosiaalinen ja puhuu paljon.", a: ["Er ist gesellig und spricht viel", "Sie ist gesellig und spricht viel", "Er ist gesellig und redet viel", "Sie ist gesellig und redet viel"] },
    { t: "ord", w: ["Tutustuin", "häneen", "kurssilla"], a: ["Tutustuin häneen kurssilla.", "Kurssilla tutustuin häneen."], de: "Ich habe ihn/sie im Kurs kennengelernt." },
    { t: "ord", w: ["Naapurit", "auttavat", "toisiaan"], a: ["Naapurit auttavat toisiaan."], de: "Die Nachbarn helfen einander." },
    { t: "mc", q: "„tutustua“ – welcher Fall folgt?", o: ["die Wohin-Form: tutustua Ainoon, tutustua häneen", "die Teilungsform: tutustua Ainoa", "-lla: tutustua Ainolla", "-sta: tutustua Ainosta"], a: 0, x: "tutustua und luottaa wollen die Wohin-Form: Tutustuin häneen. Luotan sinuun." },
    { t: "mc", q: "„He auttavat toisiaan.“ – warum „toisiaan“ und nicht „toisensa“?", o: ["auttaa will die Teilungsform", "weil es Mehrzahl ist", "weil es Vergangenheit ist", "Beides ist immer gleich richtig."], a: 0, x: "Die Form von „einander“ folgt dem Verb: tuntea toisensa (ganz), auttaa toisiaan (Teilungsform), soittaa toisilleen (-lle)." },
    { t: "mc", q: "Was ist ein „tuttu“?", o: ["ein Bekannter / eine Bekannte", "ein Nachbar", "ein Feind", "ein Kollege"], a: 0 },
    { t: "les", q: "Naapurit", txt: ["Naapurini Ville on tosi puhelias ja utelias.", "Hän tietää kaikki talon asiat.", "Tutustuin häneen, kun muutin taloon viime vuonna.", "Nyt me autamme toisiamme: minä kastelen hänen kukkansa, kun hän on lomalla.", "Luotan häneen, ja hänellä on avain minun asuntooni."], qs: [{ q: "Wie ist Ville?", o: ["gesprächig und neugierig", "schüchtern und still", "faul"], a: 0 }, { q: "Wann haben sie sich kennengelernt?", o: ["als der Schreiber letztes Jahr eingezogen ist", "im Kurs", "in der Arbeit"], a: 0 }, { q: "Was zeigt, dass er Ville vertraut?", o: ["Ville hat einen Schlüssel zu seiner Wohnung.", "Sie streiten oft.", "Sie arbeiten zusammen."], a: 0 }] },
    { t: "les", q: "Ystävyys", txt: ["Aino ja Sanna ovat ystäviä jo lapsuudesta.", "He tuntevat toisensa todella hyvin.", "Joskus he riitelevät, mutta eivät koskaan pitkään.", "He soittavat toisilleen joka viikko."], qs: [{ q: "Seit wann sind Aino und Sanna Freundinnen?", o: ["seit der Kindheit", "seit letztem Jahr", "seit dem Kurs"], a: 0 }, { q: "Wie lange streiten sie?", o: ["nie lange", "oft wochenlang", "nie"], a: 0 }, { q: "Wie oft telefonieren sie?", o: ["jede Woche", "jeden Tag", "selten"], a: 0 }] },
    { t: "dlg", q: "Wie habt ihr euch kennengelernt?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Missä tutustuit Villeen?"], ["Sinä", "[Tutustuin häneen suomen kurssilla.|Kurssilla.|Tutustuin Villeen kurssilla.]", "Sag: im Finnischkurs."], ["Aino", "Millainen hän on?"], ["Sinä", "[Hän on fiksu ja tosi hauska.|Tosi hauska ja fiksu.|Hän on hauska ja fiksu.]", "Sag: klug und sehr lustig."], ["Aino", "Tapaatteko usein?"], ["Sinä", "[Joo, me tavataan joka viikko.|Tapaamme joka viikko.|Kyllä, joka viikko.]", "Sag: jede Woche."]] },
    { t: "dlg", q: "Der Nachbar", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Kollega", "Tunnetko naapurisi?"], ["Sinä", "[Tunnen. Naapuri on tosi puhelias.|Kyllä, naapuri on tosi puhelias.|Tunnen hyvin.]", "Sag ja – der Nachbar ist sehr gesprächig."], ["Kollega", "Luotatko häneen?"], ["Sinä", "[Luotan. Hänellä on avain asuntooni.|Kyllä, luotan häneen.|Luotan.]", "Sag ja – er hat einen Schlüssel zu deiner Wohnung."]] },
    { t: "sch", q: "Schreib, wo du eine Freundin / einen Freund kennengelernt hast und wie sie/er ist.", w: ["tutustuin"], a: ["Tutustuin Ainoon kurssilla. Hän on älykäs ja hauska.", "Tutustuin häneen työpaikalla. Hän on rehellinen ja puhelias."], h: "zwei kurze Sätze" },
    { t: "sch", q: "Schreib einen Satz mit „toisiaan“ oder „toisensa“.", w: ["toisiaan"], a: ["Naapurit auttavat toisiaan.", "Me autamme toisiamme.", "He tuntevat toisensa hyvin."], h: "ein Satz" }
  ]
};
