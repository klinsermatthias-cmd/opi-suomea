module.exports = {
  id: "t21b",
  title: "Möbel & Hausarbeit: Wo steht was? (21.2)",
  fi: "Sohvan vieressä",
  lvl: "A2.1",
  req: ["t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20", "t21"],
  th: `<p>Vertiefung zu t21: Möbel und Räume genau beschreiben – und sagen, wer im Haushalt was macht.</p>
<h3>Nützliche Sätze</h3><table>
<tr><td>Olohuoneessa on sohva ja nojatuoli.</td><td>Im Wohnzimmer gibt es ein Sofa und einen Sessel.</td></tr>
<tr><td>Matto on sohvan edessä.</td><td>Der Teppich liegt vor dem Sofa.</td></tr>
<tr><td>Peili on seinällä.</td><td>Der Spiegel hängt an der Wand.</td></tr>
<tr><td>Kengät ovat eteisessä.</td><td>Die Schuhe sind im Flur.</td></tr>
<tr><td>Kuka siivoaa tänään?</td><td>Wer putzt heute?</td></tr>
<tr><td>Minä imuroin ja sinä tiskaat.</td><td>Ich sauge Staub und du spülst ab.</td></tr>
<tr><td>Pesen pyykit lauantaina.</td><td>Ich wasche am Samstag die Wäsche.</td></tr>
</table>
<h3>Auf, an, in: -lla oder -ssa?</h3>
<table><tr><td>auf/an einer Fläche: -lla / -llä</td><td>innen drin: -ssa / -ssä</td></tr>
<tr><td>pöydällä, lattialla, seinällä, sohvalla, matolla</td><td>kaapissa, laatikossa, kirjahyllyssä, nurkassa, huoneessa</td></tr></table>
<p class="rule">Stufenwechsel gilt auch hier: <i>pöytä → pöydällä, matto → matolla, kaappi → kaapissa, lamppu → lampun</i>. An der Wand hängt etwas „auf“ der Wand: <i>seinällä</i>.</p>
<h3>Postpositionen (aus 16.2): -n-Form + vieressä, edessä …</h3>
<table><tr><td>sohvan vieressä</td><td>neben dem Sofa</td></tr><tr><td>pöydän alla</td><td>unter dem Tisch</td></tr>
<tr><td>ikkunan edessä</td><td>vor dem Fenster</td></tr><tr><td>oven takana</td><td>hinter der Tür</td></tr>
<tr><td>kaapin päällä</td><td>auf dem Schrank</td></tr></table>
<h3>Hausarbeit: wer macht was?</h3>
<p class="rule"><i>siivota</i> (siivoan) = putzen, <i>imuroida</i> (imuroin) = staubsaugen, <i>tiskata</i> (tiskaan) = abspülen (Alltagswort; neutral: <i>pestä astioita</i>), <i>pestä pyykkiä</i> (pesen) = Wäsche waschen. Teilungsform = man ist dabei (<i>Pesen pyykkiä.</i>); Mehrzahl auf -t = alles fertig machen (<i>Pesen pyykit.</i>).</p>
<h3>So sagt man’s gesprochen</h3>
<p class="tip"><i>Mä imuroin, sä tiskaat.</i> · <i>Missä on vessa?</i> (<i>vessa</i> ist das normale Alltagswort, auf Schildern steht <i>WC</i>) · <i>Mä hoidan tiskit</i> = Ich mache den Abwasch.</p>
<p class="tip"><b>Kulttuuri:</b> In vielen finnischen Wohnungen steht über der Spüle ein <i>astiankuivauskaappi</i> – ein Schrank mit Gitterböden, in dem nasses Geschirr direkt trocknet. Eine finnische Erfindung aus den 1940er-Jahren.</p>`,
  v: [
    ["sohva", "Sofa"],
    ["nojatuoli", "Sessel"],
    ["kaappi", "Schrank (kaapissa)"],
    ["matto", "Teppich (matolla)"],
    ["lamppu", "Lampe (lampun)"],
    ["peili", "Spiegel"],
    ["lattia", "Fußboden (lattialla)"],
    ["seinä", "Wand (seinällä)"],
    ["kirjahylly", "Bücherregal"],
    ["verho", "Vorhang"],
    ["nurkassa", "in der Ecke"],
    ["liesi", "Herd (liedellä)"],
    ["uuni", "Backofen"],
    ["pesukone", "Waschmaschine"],
    ["astianpesukone", "Geschirrspüler"],
    ["vessa", "Toilette, WC"],
    ["eteinen", "Flur, Vorraum (eteisessä)"],
    ["pyykki", "Wäsche (pyykit)"],
    ["pestä pyykkiä", "Wäsche waschen (pesen pyykkiä)"]
  ],
  ex: [
    { t: "tab", q: "Wo ist es?", h: "Jedes Kästchen ein Wort: Nomen + -lla/-llä (auf, an) oder -ssa/-ssä (in) – auf den Stufenwechsel achten", head: ["Deutsch", "Suomeksi"], r: [["auf dem Sofa", "[sohvalla]"], ["an der Wand", "[seinällä]"], ["auf dem Boden", "[lattialla]"], ["im Schrank", "[kaapissa]"], ["auf dem Teppich", "[matolla]"], ["in der Ecke", "[nurkassa]"]] },
    { t: "tab", q: "Postpositionen", h: "Jedes Kästchen zwei Wörter: Nomen mit -n + Postposition, z. B. sohvan vieressä", head: ["Deutsch", "Suomeksi"], r: [["neben dem Sofa", "[sohvan vieressä]"], ["unter dem Tisch", "[pöydän alla]"], ["vor dem Fenster", "[ikkunan edessä]"], ["hinter der Tür", "[oven takana]"], ["auf dem Schrank", "[kaapin päällä]"]] },
    { t: "gap", q: "Kirjat ovat ___.", h: "kirjahylly + -ssä: im Bücherregal", a: ["kirjahyllyssä"] },
    { t: "gap", q: "Kissa nukkuu ___.", h: "sohva + -lla: auf dem Sofa", a: ["sohvalla"] },
    { t: "gap", q: "Lamppu on pöydän ___.", h: "auf (oben drauf)", a: ["päällä"] },
    { t: "gap", q: "Peili on ___.", h: "seinä + -llä: an der Wand", a: ["seinällä"] },
    { t: "gap", q: "Pesen ___ lauantaina.", h: "pyykki in der Teilungsform", a: ["pyykkiä"] },
    { t: "gap", q: "Kuka ___ tänään?", h: "imuroida – Form für „hän“", a: ["imuroi"] },
    { t: "tr", dir: "de", q: "Die Schuhe sind im Flur.", a: ["Kengät ovat eteisessä"] },
    { t: "tr", dir: "de", q: "Ich putze am Samstag und du saugst Staub.", a: ["Minä siivoan lauantaina ja sinä imuroit", "Siivoan lauantaina ja sinä imuroit", "Lauantaina minä siivoan ja sinä imuroit", "Lauantaina siivoan ja sinä imuroit"] },
    { t: "tr", dir: "de", q: "Die Waschmaschine ist im Badezimmer.", a: ["Pesukone on kylpyhuoneessa"] },
    { t: "tr", dir: "fi", q: "Keittiössä on liesi, uuni ja astianpesukone.", a: ["In der Küche gibt es einen Herd, einen Backofen und einen Geschirrspüler", "In der Küche sind ein Herd, ein Backofen und ein Geschirrspüler", "In der Küche gibt es einen Herd, ein Backrohr und einen Geschirrspüler", "Die Küche hat einen Herd, einen Backofen und einen Geschirrspüler"] },
    { t: "tr", dir: "fi", q: "Vanha nojatuoli on nurkassa.", a: ["Der alte Sessel ist in der Ecke", "Der alte Sessel steht in der Ecke"] },
    { t: "ord", w: ["Matto", "on", "sohvan", "edessä"], a: ["Matto on sohvan edessä.", "Sohvan edessä on matto."], de: "Der Teppich liegt vor dem Sofa." },
    { t: "ord", w: ["Vessa", "on", "eteisen", "vieressä"], a: ["Vessa on eteisen vieressä.", "Eteisen vieressä on vessa."], de: "Das WC ist neben dem Flur." },
    { t: "mc", q: "Wo wäscht man das Geschirr ohne Hände?", o: ["astianpesukoneessa", "pesukoneessa", "uunissa", "kaapissa"], a: 0 },
    { t: "mc", q: "„Peili on seinällä.“ – Warum -llä und nicht -ssä?", o: ["auf/an einer Fläche (Wand, Boden, Tisch) → -lla/-llä", "Weil seinä ein langes Wort ist", "-llä heißt „in“", "Weil der Spiegel klein ist"], a: 0, x: "Auf/an einer Oberfläche: pöydällä, lattialla, seinällä, sohvalla. Innen drin: kaapissa, laatikossa, huoneessa." },
    { t: "mc", q: "„sohvan vieressä“ – welche Form steht vor der Postposition?", o: ["die -n-Form: sohvan", "die Grundform: sohva", "die Teilungsform: sohvaa", "die -lla-Form: sohvalla"], a: 0, x: "Postpositionen wie vieressä, edessä, takana, alla, päällä stehen nach der -n-Form (16.2): pöydän alla, oven takana." },
    { t: "mc", q: "„Pesen pyykkiä.“ oder „Pesen pyykit.“?", o: ["pyykkiä: ich bin am Waschen; pyykit: ich wasche die ganze Wäsche fertig", "Beides bedeutet genau dasselbe.", "„pyykit“ ist falsch.", "„pyykkiä“ heißt: ich wasche keine Wäsche."], a: 0, x: "Teilungsform = die Handlung läuft, ohne Ende. Mehrzahl auf -t als Objekt = alles, bis es fertig ist." },
    { t: "les", q: "Uusi koti", txt: ["Muutimme uuteen kaksioon.", "Olohuoneessa on iso sohva ja vanha nojatuoli.", "Sohvan edessä on matto.", "Seinällä on kirjahylly ja peili.", "Makuuhuoneessa on sänky ja kaappi.", "Keittiö on pieni, mutta siellä on astianpesukone!"], qs: [{ q: "Was liegt vor dem Sofa?", o: ["ein Teppich", "ein Sessel", "ein Bett"], a: 0 }, { q: "Was ist an der Wand?", o: ["ein Bücherregal und ein Spiegel", "eine Lampe", "Vorhänge"], a: 0 }, { q: "Was ist gut an der Küche?", o: ["Es gibt einen Geschirrspüler.", "Sie ist groß.", "Es gibt einen neuen Herd."], a: 0 }] },
    { t: "les", q: "Kotityöt tällä viikolla", txt: ["Maanantai: Aino imuroi.", "Tiistai: Matthias pesee pyykkiä.", "Keskiviikko: Ville tiskaa.", "Lauantai: kaikki siivoavat yhdessä!"], qs: [{ q: "Wer saugt Staub?", o: ["Aino", "Matthias", "Ville"], a: 0 }, { q: "Was macht Matthias am Dienstag?", o: ["Er wäscht Wäsche.", "Er spült ab.", "Er saugt Staub."], a: 0 }, { q: "Was passiert am Samstag?", o: ["Alle putzen zusammen.", "Niemand putzt.", "Ville putzt allein."], a: 0 }] },
    { t: "dlg", q: "Wo sind die Schlüssel?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Missä avaimet ovat?"], ["Sinä", "[Ne ovat pöydällä.|Pöydällä.|Avaimet ovat pöydällä.]", "Sag: auf dem Tisch."], ["Aino", "Eivät ole. Pöydällä on lamppu ja kirja."], ["Sinä", "[Katso eteisestä!|Ehkä ne ovat eteisessä.|Ne ovat ehkä eteisessä.]", "Sag ihr, sie soll im Flur schauen."], ["Aino", "Löysin! Ne olivat kengän alla."], ["Sinä", "[Hyvä!|Hienoa!|Hyvä, kiitos!]", "Freu dich."]] },
    { t: "dlg", q: "Wer macht was?", h: "Deine Zeilen auf Finnisch schreiben – kurze Antworten reichen", r: [["Aino", "Kuka siivoaa tänään?"], ["Sinä", "[Minä imuroin ja sinä tiskaat.|Minä imuroin, sinä tiskaat.|Minä imuroin ja sinä tiskaat, okei?]", "Sag: Du saugst Staub, sie spült ab."], ["Aino", "Hyvä. Entä pyykki?"], ["Sinä", "[Pesen pyykit huomenna.|Minä pesen pyykit huomenna.|Huomenna pesen pyykit.]", "Sag, dass du morgen die Wäsche wäschst."]] },
    { t: "sch", q: "Beschreib dein Wohnzimmer: zwei Möbel und wo eines davon steht.", w: ["olohuoneessa", "vieressä"], a: ["Olohuoneessa on sohva ja nojatuoli. Nojatuoli on sohvan vieressä.", "Olohuoneessa on sohva ja lamppu. Lamppu on sohvan vieressä."], h: "zwei kurze Sätze auf Finnisch" },
    { t: "sch", q: "Schreib, wer bei euch welche Hausarbeit macht (du und Aino).", w: ["siivoan", "pesee"], a: ["Minä siivoan ja imuroin. Aino pesee pyykkiä ja tiskaa.", "Minä siivoan. Aino pesee pyykit."], h: "ein oder zwei kurze Sätze auf Finnisch" }
  ]
};
