import json
th = (
'<h3>1. Situation: asking the neighbours for help</h3>'
'<p>In an Austrian block of flats (<i>Wohnhaus</i>) neighbours often help each other: they take in a parcel, lend a ladder or water the plants. Use <i>Sie</i> with neighbours you don\'t know well and <i>du</i> with friends.</p>'
'<table><tr><th>Deutsch</th><th>English</th></tr>'
'<tr><td>Können Sie mir helfen?</td><td>Can you help me?</td></tr>'
'<tr><td>Könnten Sie mein Paket annehmen?</td><td>Could you take in my parcel?</td></tr>'
'<tr><td>Ich bin morgen den ganzen Tag weg.</td><td>I\'m away all day tomorrow.</td></tr>'
'<tr><td>Gehört dieser Schlüssel Ihnen?</td><td>Does this key belong to you?</td></tr>'
'<tr><td>Kannst du mir deine Leiter leihen?</td><td>Can you lend me your ladder?</td></tr>'
'<tr><td>Kein Problem, ich helfe Ihnen gern.</td><td>No problem, I\'m happy to help you.</td></tr>'
'<tr><td>Danke, das ist sehr nett!</td><td>Thank you, that\'s very kind!</td></tr></table>'
'<h3>2. Short dialogue</h3>'
'<p><b>Aurora:</b> <i>Grüß Gott, Frau Huber! Können Sie mir helfen?</i><br><b>Frau Huber:</b> <i>Gerne. Was gibt\'s?</i><br><b>Aurora:</b> <i>Morgen kommt ein Paket, aber ich bin den ganzen Tag weg. Könnten Sie das Paket annehmen?</i><br><b>Frau Huber:</b> <i>Ja, natürlich. Ich gebe es Ihnen dann am Abend.</i><br><b>Aurora:</b> <i>Danke, das ist sehr nett. Ich danke Ihnen!</i><br>…<br><b>Frau Huber:</b> <i>Hier ist Ihr Paket. Der Briefträger hat es mir am Vormittag gegeben.</i><br><b>Aurora:</b> <i>Vielen Dank! Und das hier ist ein Kuchen. Ich hoffe, er schmeckt Ihnen.</i></p>'
'<h3>3. Grammar: personal pronouns – the whole system</h3>'
'<table><tr><th>Nominativ</th><th>Akkusativ</th><th>Dativ</th></tr>'
'<tr><td>ich</td><td>mich</td><td>mir</td></tr>'
'<tr><td>du</td><td>dich</td><td>dir</td></tr>'
'<tr><td>er</td><td>ihn</td><td>ihm</td></tr>'
'<tr><td>sie</td><td>sie</td><td>ihr</td></tr>'
'<tr><td>es</td><td>es</td><td>ihm</td></tr>'
'<tr><td>wir</td><td>uns</td><td>uns</td></tr>'
'<tr><td>ihr</td><td>euch</td><td>euch</td></tr>'
'<tr><td>sie (plural)</td><td>sie</td><td>ihnen</td></tr>'
'<tr><td>Sie (polite)</td><td>Sie</td><td>Ihnen</td></tr></table>'
'<h3>Rule 1: pronouns in the accusative and dative</h3>'
'<p class="rule">A pronoun takes the case of the noun it replaces – and the gender of the noun, also for things: <i>der Schlüssel → er / ihn / ihm, die Leiter → sie / sie / ihr, das Paket → es / es / ihm</i>. <i>Ich nehme den Schlüssel. → Ich nehme ihn.</i> <i>Ich gebe der Nachbarin das Paket. → Ich gebe ihr das Paket.</i></p>'
'<p class="tip">Careful with <b>ihr</b>: it can be <i>ihr</i> (you, plural, Nom.), <i>ihr</i> (to her, Dat.) or the possessive <i>ihr</i> (her / their). <b>uns</b> and <b>euch</b> are the same in Akk. and Dat. Polite <i>Sie / Ihnen</i> always has a capital letter.</p>'
'<h3>Rule 2: verbs with the dative</h3>'
'<table><tr><th>Verb</th><th>Example</th><th>English</th></tr>'
'<tr><td>helfen</td><td>Ich helfe dir.</td><td>I help you.</td></tr>'
'<tr><td>danken</td><td>Wir danken Ihnen.</td><td>We thank you.</td></tr>'
'<tr><td>gratulieren</td><td>Ich gratuliere dir zum Geburtstag.</td><td>Happy birthday! (I congratulate you)</td></tr>'
'<tr><td>gehören</td><td>Der Schlüssel gehört mir.</td><td>The key belongs to me.</td></tr>'
'<tr><td>gefallen</td><td>Die Wohnung gefällt mir.</td><td>I like the flat.</td></tr>'
'<tr><td>schmecken</td><td>Der Kuchen schmeckt mir.</td><td>I like the cake. (It tastes good to me.)</td></tr>'
'<tr><td>passen</td><td>Die Schuhe passen mir. / Passt dir Montag?</td><td>The shoes fit me. / Does Monday suit you?</td></tr></table>'
'<p class="rule">These verbs take a <b>dative</b> object, not an accusative: <i>Ich helfe dir</i> (not <i>dich</i>). With <i>gehören, gefallen, schmecken, passen</i> the <b>thing is the subject</b> and the person is in the dative – the verb agrees with the thing: <i>Die Schuhe passen mir. Der Kuchen schmeckt uns.</i></p>'
'<p class="tip">English „I like the flat“ ↔ German <i>Die Wohnung gefällt mir</i> (the flat pleases me). For food: <i>Die Suppe schmeckt mir.</i></p>'
'<h3>Rule 3: two objects – which comes first?</h3>'
'<table><tr><th>Objects</th><th>Example</th><th>Order</th></tr>'
'<tr><td>two nouns</td><td>Ich gebe dem Nachbarn das Paket.</td><td>dative before accusative</td></tr>'
'<tr><td>pronoun + noun</td><td>Ich gebe ihm das Paket. / Ich gebe es dem Nachbarn.</td><td>pronoun before noun</td></tr>'
'<tr><td>two pronouns</td><td>Ich gebe es ihm. / Ich schicke ihn Ihnen.</td><td>accusative before dative</td></tr></table>'
'<p class="tip">Short words first: pronouns come before nouns. Only with two pronouns does the accusative come first: <i>Kannst du es mir geben?</i> Like <i>der Kollege</i>, <i>der Nachbar</i> has the forms <i>den Nachbarn, dem Nachbarn</i> (in everyday speech also <i>dem Nachbar</i>).</p>'
'<h3>Verb forms in this topic</h3>'
'<table><tr><th>Infinitiv</th><th>Präteritum (er/sie)</th><th>Perfekt (er/sie)</th></tr>'
'<tr><td>helfen (er hilft)</td><td>half</td><td>hat geholfen</td></tr>'
'<tr><td>gefallen (es gefällt)</td><td>gefiel</td><td>hat gefallen</td></tr>'
'<tr><td>annehmen (er nimmt an)</td><td>nahm an</td><td>hat angenommen</td></tr>'
'<tr><td>leihen</td><td>lieh</td><td>hat geliehen</td></tr>'
'<tr><td>gehören, passen, schmecken, danken, schicken</td><td>gehörte, passte, schmeckte, dankte, schickte</td><td>hat gehört, gepasst, geschmeckt, gedankt, geschickt</td></tr>'
'<tr><td>gratulieren</td><td>gratulierte</td><td>hat gratuliert</td></tr></table>'
)
v = [
 ["der Nachbar, die Nachbarn","neighbour (man)"],
 ["die Nachbarin, die Nachbarinnen","neighbour (woman)"],
 ["das Paket, die Pakete","parcel, package"],
 ["die Leiter, die Leitern","ladder"],
 ["der Schlüssel, die Schlüssel","key"],
 ["annehmen","to accept; to take in (a parcel) (nahm an · hat angenommen · wird annehmen)"],
 ["helfen","to help (half · hat geholfen · wird helfen)"],
 ["gehören","to belong to (gehörte · hat gehört · wird gehören)"],
 ["gefallen","to please (I like it = it pleases me) (gefiel · hat gefallen · wird gefallen)"],
 ["passen","to fit; to suit (passte · hat gepasst · wird passen)"],
 ["schmecken","to taste (good) (schmeckte · hat geschmeckt · wird schmecken)"],
 ["danken","to thank (dankte · hat gedankt · wird danken)"],
 ["gratulieren","to congratulate (gratulierte · hat gratuliert · wird gratulieren)"],
 ["schicken","to send (schickte · hat geschickt · wird schicken)"],
 ["leihen","to lend; to borrow (lieh · hat geliehen · wird leihen)"],
]
HP = "Pronomen im richtigen Fall"
ex = [
 # --- Tabellen: Gesamtsystem
 {"t":"tab","q":"Personalpronomen: Nominativ → Akkusativ","h":"Jedes Kästchen ein Pronomen im Akkusativ.","head":["Nominativ","Akkusativ"],"r":[["ich","[mich]"],["du","[dich]"],["er","[ihn]"],["sie (Singular)","[sie]"],["es","[es]"],["wir","[uns]"],["ihr","[euch]"],["sie (Plural)","[sie]"],["Sie (höflich)","[Sie]"]]},
 {"t":"tab","q":"Personalpronomen: Nominativ → Dativ","h":"Jedes Kästchen ein Pronomen im Dativ.","head":["Nominativ","Dativ"],"r":[["ich","[mir]"],["du","[dir]"],["er","[ihm]"],["sie (Singular)","[ihr]"],["es","[ihm]"],["wir","[uns]"],["ihr","[euch]"],["sie (Plural)","[ihnen]"],["Sie (höflich)","[Ihnen]"]]},
 {"t":"tab","q":"Nomen → Pronomen","h":"Nur das Pronomen, das das Nomen in Klammern ersetzt, im richtigen Fall.","head":["Satz","Pronomen"],"r":[["Ich nehme ___. (den Schlüssel)","[ihn]"],["Kannst du ___ halten? (die Leiter)","[sie]"],["Frau Huber nimmt ___ an. (das Paket)","[es]"],["Ich helfe ___. (der Nachbarin)","[ihr]"],["Das Paket gehört ___. (dem Nachbarn)","[ihm]"],["Wir danken ___. (den Nachbarn, Plural)","[ihnen]"]]},
 {"t":"tab","q":"Verben mit Dativ: das richtige Pronomen","h":"Nur das Pronomen für die Person in Klammern.","head":["Satz","Pronomen"],"r":[["Ich helfe ___ gern. (du)","[dir]"],["Der Schlüssel gehört ___. (er)","[ihm]"],["Die Wohnung gefällt ___ sehr. (wir)","[uns]"],["Passt ___ Montag? (Sie)","[Ihnen]"],["Schmeckt ___ der Kuchen? (ihr)","[euch]"],["Ich gratuliere ___ zum Geburtstag. (sie, Singular)","[ihr]"],["Wir danken ___. (sie, Plural)","[ihnen]"]]},
 {"t":"tab","q":"Zwei Objekte: ersetze, was in Klammern steht","h":"Ganzer Satz, das Subjekt bleibt vorne.","head":["Satz","mit Pronomen"],"r":[["Ich gebe dem Nachbarn das Paket. (dem Nachbarn)","[Ich gebe ihm das Paket.]"],["Ich gebe dem Nachbarn das Paket. (das Paket)","[Ich gebe es dem Nachbarn.]"],["Ich gebe dem Nachbarn das Paket. (beide)","[Ich gebe es ihm.]"],["Wir leihen der Nachbarin die Leiter. (der Nachbarin)","[Wir leihen ihr die Leiter.]"],["Wir leihen der Nachbarin die Leiter. (die Leiter)","[Wir leihen sie der Nachbarin.]"],["Wir leihen der Nachbarin die Leiter. (beide)","[Wir leihen sie ihr.]"]]},
 # --- Zeitformen (5)
 {"t":"tab","q":"Präteritum (er/sie)","h":"Nur die Form für er/sie, z. B. machte.","head":["Infinitiv","Präteritum (er/sie)"],"r":[["helfen","[half]"],["gefallen","[gefiel]"],["annehmen","[nahm an]"],["leihen","[lieh]"],["schicken","[schickte]"],["gratulieren","[gratulierte]"]]},
 {"t":"tab","q":"Perfekt (er/sie)","h":"Hilfsverb + Partizip II, z. B. hat gemacht.","head":["Infinitiv","Perfekt (er/sie)"],"r":[["helfen","[hat geholfen]"],["gefallen","[hat gefallen]"],["annehmen","[hat angenommen]"],["leihen","[hat geliehen]"],["schmecken","[hat geschmeckt]"],["gratulieren","[hat gratuliert]"]]},
 {"t":"gap","q":"Am Samstag ___ ich dir helfen.","h":"Futur I: werden – richtige Form","a":["werde"]},
 {"t":"gap","q":"Die Wohnung ___ euch sicher gefallen.","h":"Futur I: werden – richtige Form","a":["wird"]},
 {"t":"gap","q":"Frau Huber ___ mein Paket angenommen.","h":"haben oder sein – richtige Form im Präsens","a":["hat"]},
 # --- Pronomen
 {"t":"gap","q":"Kannst du ___ helfen? (ich)","h":HP,"a":["mir"]},
 {"t":"gap","q":"Ich besuche ___ morgen. (du)","h":HP,"a":["dich"]},
 {"t":"gap","q":"Hast du ___ schon gratuliert? (er)","h":HP,"a":["ihm"]},
 {"t":"gap","q":"Wo ist die Leiter? – Ich habe ___ der Nachbarin geliehen.","h":"Pronomen für „die Leiter“","a":["sie"]},
 {"t":"gap","q":"Ich habe den Schlüssel gefunden. Ich gebe ___ dir gleich.","h":"Pronomen für „der Schlüssel“","a":["ihn"]},
 {"t":"gap","q":"Wie gefällt ___ die Wohnung, Frau Novak? (Sie)","h":HP,"a":["Ihnen"]},
 {"t":"gap","q":"Danke, der Kuchen schmeckt ___ sehr gut! (ich)","h":HP,"a":["mir"]},
 {"t":"gap","q":"Wir gratulieren ___ zum Geburtstag! (du)","h":HP,"a":["dir"]},
 {"t":"gap","q":"Ich danke ___ sehr, Herr Berger! (Sie)","h":HP,"a":["Ihnen"]},
 {"t":"gap","q":"Lena und Jonas, kann ich ___ helfen? (ihr)","h":HP,"a":["euch"]},
 # --- Dativverben: Verbform / Nomen
 {"t":"gap","q":"Die Wohnung ___ mir sehr. (gefallen)","h":"Verb in Klammern – richtige Form im Präsens","a":["gefällt"]},
 {"t":"gap","q":"Die Schuhe ___ mir nicht. (passen)","h":"Verb in Klammern – richtige Form im Präsens","a":["passen"]},
 {"t":"gap","q":"Die Nachbarn ___ uns oft. (helfen)","h":"Verb in Klammern – richtige Form im Präsens","a":["helfen"]},
 {"t":"gap","q":"Wem ___ das Paket? (gehören)","h":"Verb in Klammern – richtige Form im Präsens","a":["gehört"]},
 {"t":"gap","q":"Ich helfe ___ Nachbarin.","h":"bestimmter Artikel im richtigen Fall","a":["der"]},
 {"t":"gap","q":"Gehört der Schlüssel ___ Nachbarn? (ein Nachbar)","h":"bestimmter Artikel im richtigen Fall","a":["dem"]},
 {"t":"gap","q":"Wir danken ___ Nachbarinnen sehr.","h":"bestimmter Artikel im richtigen Fall","a":["den"]},
 # --- Mischung mit d02/d04/d05
 {"t":"gap","q":"Ich bin morgen weg, ___ nimmt Frau Huber das Paket an.","h":"deshalb, trotzdem oder weil?","a":["deshalb"]},
 {"t":"gap","q":"Ich helfe Lena gern, ___ sie mir auch oft hilft.","h":"deshalb, trotzdem oder weil?","a":["weil"]},
 {"t":"gap","q":"Wir schenken ___ Nachbarin einen Blumenstrauß.","h":"unbestimmter Artikel im richtigen Fall","a":["einer"]},
 # --- mc
 {"t":"mc","q":"„Gehört das Paket ___?“ (Sie)","o":["Ihnen","Sie","Ihr"],"a":0,"x":"gehören takes the dative: Sie → Ihnen."},
 {"t":"mc","q":"„Ich helfe ___ gern.“ (du)","o":["dir","dich","du"],"a":0,"x":"helfen takes the dative: du → dir."},
 {"t":"mc","q":"„Ich besuche ___ morgen.“ (er)","o":["ihn","ihm","er"],"a":0,"x":"besuchen takes the accusative: er → ihn."},
 {"t":"mc","q":"Welcher Satz ist richtig?","o":["Ich gebe es ihm.","Ich gebe ihm es.","Ich es gebe ihm."],"a":0,"x":"Two pronouns: accusative (es) before dative (ihm)."},
 {"t":"mc","q":"Welcher Satz ist richtig?","o":["Die Schuhe passen mir nicht.","Die Schuhe passen mich nicht.","Ich passe die Schuhe nicht."],"a":0,"x":"passen: the thing is the subject, the person is in the dative (mir)."},
 {"t":"mc","q":"Welcher Satz ist richtig?","o":["Der Kuchen schmeckt uns.","Wir schmecken den Kuchen.","Uns schmecken den Kuchen."],"a":0,"x":"schmecken: the food is the subject, the person is in the dative (uns)."},
 {"t":"mc","q":"„Der Schlüssel gehört ___ Nachbarin.“","o":["der","die","dem"],"a":0,"x":"gehören + dative; die Nachbarin → der Nachbarin."},
 {"t":"mc","q":"„Kannst du ___ die Leiter leihen?“ (ich)","o":["mir","mich","ich"],"a":0,"x":"The person who receives something is in the dative: mir."},
 # --- Übersetzen
 {"t":"tr","dir":"de","q":"Can you help me? (du)","a":["Kannst du mir helfen?","Könntest du mir helfen?"]},
 {"t":"tr","dir":"de","q":"Does this key belong to you? (Sie)","a":["Gehört dieser Schlüssel Ihnen?","Gehört der Schlüssel Ihnen?","Gehört Ihnen dieser Schlüssel?","Gehört Ihnen der Schlüssel?"]},
 {"t":"tr","dir":"de","q":"I like the flat very much.","a":["Die Wohnung gefällt mir sehr gut.","Die Wohnung gefällt mir sehr.","Mir gefällt die Wohnung sehr gut.","Mir gefällt die Wohnung sehr."]},
 {"t":"tr","dir":"de","q":"Could you take in my parcel, please? (Sie)","a":["Könnten Sie bitte mein Paket annehmen?","Könnten Sie mein Paket bitte annehmen?","Könnten Sie mein Paket annehmen?","Können Sie bitte mein Paket annehmen?","Können Sie mein Paket bitte annehmen?","Können Sie mein Paket annehmen?","Könnten Sie bitte mein Paket übernehmen?","Könnten Sie mein Paket bitte übernehmen?","Könnten Sie mein Paket übernehmen?"]},
 {"t":"tr","dir":"fi","q":"Das Paket gehört der Nachbarin.","a":["The parcel belongs to the neighbour.","The parcel belongs to the neighbor.","The package belongs to the neighbour.","The package belongs to the neighbor."]},
 {"t":"tr","dir":"fi","q":"Ich habe es ihm gestern gegeben.","a":["I gave it to him yesterday.","Yesterday I gave it to him.","I gave him it yesterday."]},
 {"t":"tr","dir":"fi","q":"Schmeckt dir die Suppe?","a":["Do you like the soup?","Does the soup taste good?","Is the soup good?","Does the soup taste good to you?","Do you like the taste of the soup?"]},
 # --- Satzbau
 {"t":"ord","w":["Ich","gebe","dem","Nachbarn","das","Paket"],"a":["Ich gebe dem Nachbarn das Paket.","Dem Nachbarn gebe ich das Paket.","Das Paket gebe ich dem Nachbarn."],"de":"I'm giving the parcel to the neighbour."},
 {"t":"ord","w":["Ich","schicke","ihn","Ihnen","morgen"],"a":["Ich schicke ihn Ihnen morgen.","Morgen schicke ich ihn Ihnen."],"de":"I'll send it (the key) to you tomorrow."},
 {"t":"ord","w":["Kannst","du","es","mir","geben"],"a":["Kannst du es mir geben?"],"de":"Can you give it to me?"},
 {"t":"ord","w":["Ich","helfe","der","Nachbarin","weil","sie","mir","oft","hilft"],"a":["Ich helfe der Nachbarin, weil sie mir oft hilft.","Weil sie mir oft hilft, helfe ich der Nachbarin.","Der Nachbarin helfe ich, weil sie mir oft hilft."],"de":"I help the neighbour because she often helps me."},
 # --- Lesen
 {"t":"les","q":"Ein Zettel an der Tür","txt":["Liebe Frau Huber!","Morgen kommt ein Paket, aber ich bin den ganzen Tag weg.","Könnten Sie das Paket bitte annehmen?","Ich hole es am Abend ab.","Vielen Dank! Aurora"],"qs":[{"q":"Why does Aurora write the note?","o":["She is away tomorrow and a parcel is coming.","She has lost her key.","She needs a ladder."],"a":0},{"q":"When will she collect the parcel?","o":["in the evening","in the morning","next week"],"a":0}]},
 {"t":"les","q":"Eine Nachricht von Jonas","txt":["Hallo Aurora!","Danke, der Kuchen hat uns sehr gut geschmeckt.","Die Leiter gehört übrigens nicht mir, sie gehört meinem Bruder.","Kannst du sie ihm am Montag geben?","Danke! Jonas"],"qs":[{"q":"Who does the ladder belong to?","o":["Jonas's brother","Jonas","Aurora"],"a":0},{"q":"What should Aurora do on Monday?","o":["give the ladder to Jonas's brother","bake a cake","buy a ladder"],"a":0}]},
 {"t":"les","q":"Die neue Nachbarin","txt":["Frau Novak ist neu im Haus.","Die Wohnung gefällt ihr sehr gut, aber der Kasten ist zu groß.","Am Samstag helfen ihr Aurora und Jonas.","Danach kocht Frau Novak, und das Essen schmeckt allen sehr gut.","Sie dankt ihnen und sagt: „Ich helfe euch auch gern!“"],"qs":[{"q":"Does Frau Novak like the flat?","o":["yes, very much","no","we don't know"],"a":0},{"q":"What is the problem?","o":["The wardrobe is too big.","The flat is too small.","The food is not good."],"a":0},{"q":"Who helps her on Saturday?","o":["Aurora and Jonas","Frau Huber","nobody"],"a":0}]},
 # --- Dialoge
 {"t":"dlg","q":"Der Nachbar hat Ihr Paket","r":[["Herr Berger","Grüß Gott! Ich habe hier ein Paket für Sie. Der Briefträger hat es mir heute gegeben."],["Du","[Danke, das ist sehr nett!|Vielen Dank, das ist sehr nett!|Danke, das ist sehr nett von Ihnen!|Vielen Dank, das ist sehr nett von Ihnen!|Ich danke Ihnen!]","Thank him and say that's very kind."],["Herr Berger","Gern geschehen. Gehört dieser Schlüssel auch Ihnen? Er war vor der Tür."],["Du","[Ja, der gehört mir.|Ja, er gehört mir.|Ja, der Schlüssel gehört mir.|Ja, das ist mein Schlüssel.]","Say yes, it belongs to you."],["Herr Berger","Hier, bitte."],["Du","[Wenn Sie Hilfe brauchen, helfe ich Ihnen gern.|Ich helfe Ihnen auch gern, wenn Sie Hilfe brauchen.|Ich helfe Ihnen auch gern.]","Offer to help him too some time."]]},
 {"t":"dlg","q":"Lena zieht um","r":[["Lena","Kannst du mir am Samstag helfen? Ich ziehe um."],["Du","[Ja, ich helfe dir gern.|Ja, ich helfe dir gerne.|Ja, gern.|Ja, gerne.|Klar, ich helfe dir gern.|Natürlich helfe ich dir.]","Say yes, you'll gladly help her."],["Lena","Super! Hast du eine Leiter?"],["Du","[Ja, ich leihe sie dir.|Ja, ich kann sie dir leihen.|Ja, ich leihe dir meine Leiter.|Ja, ich borge sie dir.|Ja, ich kann sie dir borgen.]","Say yes, and that you'll lend it to her."],["Lena","Danke! Passt dir neun Uhr?"],["Du","[Zehn Uhr passt mir besser.|Mir passt zehn Uhr besser.|Um zehn Uhr passt es mir besser.|Zehn passt mir besser.]","Say that ten o'clock suits you better."]]},
 # --- Schreiben
 {"t":"sch","q":"Write a note to your neighbour (Sie): a parcel is coming tomorrow and you are away. Ask her to take it in.","a":["Liebe Frau Huber, morgen kommt ein Paket, aber ich bin nicht da. Könnten Sie das Paket bitte annehmen? Vielen Dank!"],"h":"2–3 Sätze, Sie"},
 {"t":"sch","q":"Your neighbour (Sie) has helped you and brought you a cake. Write 2 sentences: thank him and say how you liked the cake.","a":["Ich danke Ihnen sehr! Der Kuchen hat mir sehr gut geschmeckt."],"h":"2 Sätze, Sie"},
 {"t":"sch","q":"A friend (du) asks if he can borrow your ladder. Answer in 2 sentences: you'll lend it to him, and he can give it back to you on Monday.","a":["Ja, ich leihe sie dir gern. Du kannst sie mir am Montag zurückgeben."],"h":"2 Sätze, du"},
 # --- Regelfragen (am Ende)
 {"t":"mc","q":"„Der Kuchen schmeckt mir.“ – What is the subject of this sentence?","o":["der Kuchen","mir","schmeckt","there is no subject"],"a":0,"x":"With schmecken, gefallen, passen and gehören the thing is the subject; the person is in the dative (mir)."},
 {"t":"mc","q":"Which verbs take a dative object?","o":["helfen, danken, gratulieren","besuchen, fragen, kennen","kaufen, nehmen, suchen","haben, brauchen, finden"],"a":0,"x":"helfen, danken, gratulieren (and gehören, gefallen, passen, schmecken) take the dative. The others take the accusative."},
 {"t":"mc","q":"Two pronouns as objects – which order is correct?","o":["accusative before dative: Ich gebe es ihm.","dative before accusative: Ich gebe ihm es.","any order","the longer word first"],"a":0,"x":"Two pronouns: accusative first (es ihm, ihn Ihnen). Two nouns: dative first (dem Nachbarn das Paket)."},
 {"t":"mc","q":"A pronoun and a noun as objects – which comes first?","o":["the pronoun: Ich gebe ihm das Paket. / Ich gebe es dem Nachbarn.","the noun","always the dative","always the accusative"],"a":0,"x":"Pronouns come before nouns, whatever their case."},
]
t = {"id":"d06","title":"Kannst du mir helfen? – Pronomen und Dativverben","fi":"Can you help me? – pronouns and verbs with the dative","lvl":"A1++/A2++","req":["d01","d02","d04","d05"],"th":th,"v":v,"ex":ex}
open('/home/user/opi-suomea/docs/pruefungen/deutsch/entwuerfe/d06.json','w',encoding='utf8').write(json.dumps(t,ensure_ascii=False,indent=1))
print(len(v), len(ex), {k:sum(1 for e in ex if e['t']==k) for k in set(e['t'] for e in ex)})
