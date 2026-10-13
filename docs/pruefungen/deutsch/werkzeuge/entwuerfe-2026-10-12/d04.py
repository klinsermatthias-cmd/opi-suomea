import json
th = (
'<h3>1. Situation: Saturday at the market</h3>'
'<p>On Saturday many people in Vienna shop at a market such as the Brunnenmarkt or the Naschmarkt. In Austria many foods have their own names: <b>Paradeiser</b> (Germany: Tomaten), <b>Erdäpfel</b> (Kartoffeln), <b>Karfiol</b> (Blumenkohl), <b>Semmeln</b> (Brötchen).</p>'
'<table><tr><th>Deutsch</th><th>English</th></tr>'
'<tr><td>Was brauchen wir noch?</td><td>What else do we need?</td></tr>'
'<tr><td>Was darf es sein?</td><td>What would you like? (seller)</td></tr>'
'<tr><td>Die Paradeiser sind heute sehr schön.</td><td>The tomatoes are very nice today.</td></tr>'
'<tr><td>Was kostet ein Kilo Erdäpfel?</td><td>How much is a kilo of potatoes?</td></tr>'
'<tr><td>Zwei Kilo, bitte.</td><td>Two kilos, please.</td></tr>'
'<tr><td>Sonst noch etwas?</td><td>Anything else?</td></tr>'
'<tr><td>Brauchen Sie ein Sackerl?</td><td>Do you need a bag?</td></tr>'
'<tr><td>Die Semmeln sind leider aus.</td><td>Sorry, the rolls are sold out.</td></tr></table>'
'<h3>2. Short dialogue</h3>'
'<p><b>Verkäuferin:</b> <i>Grüß Gott! Was darf es sein?</i><br><b>Aurora:</b> <i>Ein Kilo Paradeiser und zwei Zwiebeln, bitte. Ist der Karfiol frisch?</i><br><b>Verkäuferin:</b> <i>Ja, der Karfiol ist von heute. Sonst noch etwas?</i><br><b>Aurora:</b> <i>Was kosten die Erdäpfel?</i><br><b>Verkäuferin:</b> <i>Ein Kilo kostet zwei Euro. Brauchen Sie ein Sackerl?</i><br><b>Aurora:</b> <i>Nein danke, ich habe eine Tasche.</i></p>'
'<h3>3. Grammar: der, die, das – ein, kein – plural</h3>'
'<p>Every German noun has a gender: masculine (<b>der</b>), feminine (<b>die</b>) or neuter (<b>das</b>). In the plural the article is always <b>die</b>. Here is the whole system in the nominative (the subject, and the noun after <i>sein</i>):</p>'
'<table><tr><th>Gender</th><th>der / die / das</th><th>ein / kein</th></tr>'
'<tr><td>masculine</td><td>der Markt</td><td>ein Markt / kein Markt</td></tr>'
'<tr><td>feminine</td><td>die Semmel</td><td>eine Semmel / keine Semmel</td></tr>'
'<tr><td>neuter</td><td>das Ei</td><td>ein Ei / kein Ei</td></tr>'
'<tr><td>plural</td><td>die Eier</td><td>– / keine Eier</td></tr></table>'
'<p class="rule">Learn every noun with its article and its plural: <i>der Markt, die Märkte</i>. The endings below help you guess the gender.</p>'
'<h3>Rule 1: endings that show the gender</h3>'
'<table><tr><th>Signal</th><th>Gender</th><th>Examples (exceptions)</th></tr>'
'<tr><td>-ung, -heit, -keit, -schaft, -ion, -tät</td><td>die (always)</td><td>die Zeitung, die Freiheit, die Möglichkeit, die Freundschaft, die Information, die Universität</td></tr>'
'<tr><td>-e</td><td>die (mostly)</td><td>die Einkaufsliste, die Flasche (but: der Käse, der Name, der Kunde, das Ende, das Auge)</td></tr>'
'<tr><td>Ge- (… -e)</td><td>das (mostly)</td><td>das Gemüse, das Getränk (but: die Gemeinde, die Geschichte, der Gedanke)</td></tr>'
'<tr><td>-chen, -erl</td><td>das</td><td>das Mädchen, das Sackerl (-erl is Austrian: small)</td></tr>'
'<tr><td>-nis</td><td>das (mostly)</td><td>das Ergebnis (but: die Erlaubnis)</td></tr>'
'<tr><td>-um, -ment</td><td>das (mostly)</td><td>das Zentrum, das Museum, das Dokument (but: der Moment)</td></tr>'
'<tr><td>days, months, seasons</td><td>der</td><td>der Montag, der Jänner, der Winter</td></tr>'
'<tr><td>-er for people</td><td>der</td><td>der Verkäufer (a woman: die Verkäuferin)</td></tr></table>'
'<p class="tip">No signal? Then learn the noun with its article: <i>die Uhr, der Monat, das Brot, die Milch, der Markt</i>. -e is only a rule of thumb – <i>der Käse</i> and <i>das Ende</i> are common exceptions.</p>'
'<h3>Rule 2: plural types</h3>'
'<table><tr><th>Type</th><th>Singular → plural</th><th>Typical for</th></tr>'
'<tr><td>-e / ¨-e</td><td>der Tag → die Tage, der Markt → die Märkte, der Stand → die Stände</td><td>many masculine nouns</td></tr>'
'<tr><td>-n / -en</td><td>die Zwiebel → die Zwiebeln, die Packung → die Packungen</td><td>almost all feminine nouns</td></tr>'
'<tr><td>-er / ¨-er</td><td>das Ei → die Eier, das Buch → die Bücher</td><td>many short neuter nouns</td></tr>'
'<tr><td>no ending / ¨</td><td>der Paradeiser → die Paradeiser, der Erdapfel → die Erdäpfel, das Mädchen → die Mädchen</td><td>masculine and neuter nouns in -er, -el, -en; -chen, -erl</td></tr>'
'<tr><td>-s</td><td>das Auto → die Autos, das Kilo → die Kilos</td><td>words ending in -a, -i, -o, -u; many foreign words</td></tr></table>'
'<p class="tip">Special plurals: <i>die Kassa → die Kassen, das Museum → die Museen, das Zentrum → die Zentren, die Wurst → die Würste</i>. Austrian -erl words: <i>die Sackerl</i> or <i>die Sackerln</i>. After a number, measure words stay singular: <i>zwei Kilo Erdäpfel, drei Stück</i>.</p>'
'<h3>Rule 3: ein / kein in the nominative – nouns with a capital letter</h3>'
'<p class="rule"><b>ein, eine, ein</b> = a/an. There is no plural of ein: <i>Das sind Erdäpfel.</i> <b>kein, keine, kein, keine</b> = no / not a: <i>Das ist kein Karfiol. Heute gibt es keine Semmeln.</i></p>'
'<p class="rule"><b>kein</b> negates a noun with ein or without an article. <b>nicht</b> negates verbs, adjectives and nouns with der/die/das: <i>Das ist kein Ei.</i> ↔ <i>Das Ei ist nicht frisch.</i></p>'
'<p class="rule">All nouns begin with a capital letter, also in the middle of a sentence: <i>Wir brauchen Eier und Semmeln.</i> Verbs can become nouns with <b>das</b>: <i>einkaufen → das Einkaufen, essen → das Essen</i> – here you only need to recognise them: <i>Das Einkaufen am Samstag ist anstrengend.</i></p>'
'<p class="tip">The accusative (<i>Ich brauche einen Karfiol.</i>) comes in d05. In this topic, masculine nouns only appear as the subject or after <i>sein</i>.</p>'
'<h3>Verb forms in this topic</h3>'
'<table><tr><th>Infinitiv</th><th>Präteritum (er/sie)</th><th>Perfekt (er/sie)</th></tr>'
'<tr><td>brauchen</td><td>brauchte</td><td>hat gebraucht</td></tr>'
'<tr><td>kosten</td><td>kostete</td><td>hat gekostet</td></tr></table>'
'<p class="tip">Futur I (see d01): <i>werden</i> + infinitive at the end: <i>Wir werden mehr Gemüse brauchen.</i></p>'
)
v = [
 ["der Markt, die Märkte","market"],
 ["der Stand, die Stände","(market) stall"],
 ["die Einkaufsliste, die Einkaufslisten","shopping list"],
 ["der Paradeiser, die Paradeiser","tomato (Germany: Tomate)"],
 ["der Erdapfel, die Erdäpfel","potato (Germany: Kartoffel)"],
 ["der Karfiol","cauliflower (Germany: Blumenkohl)"],
 ["die Zwiebel, die Zwiebeln","onion"],
 ["die Semmel, die Semmeln","bread roll (Germany: Brötchen)"],
 ["das Ei, die Eier","egg"],
 ["das Sackerl, die Sackerl","bag, carrier bag (Germany: Tüte)"],
 ["die Kassa, die Kassen","checkout, till (Germany: Kasse)"],
 ["die Packung, die Packungen","packet, pack"],
 ["brauchen","to need (brauchte · hat gebraucht · wird brauchen)"],
 ["kosten","to cost (kostete · hat gekostet · wird kosten)"],
]
H_ART = "Nur der, die oder das eintippen."
ex = [
 {"t":"tab","q":"der, die oder das?","h":H_ART,"head":["Nomen","Artikel"],"r":[["Zeitung","[die]"],["Gemüse","[das]"],["Montag","[der]"],["Möglichkeit","[die]"],["Mädchen","[das]"],["Verkäufer","[der]"],["Information","[die]"],["Ergebnis","[das]"]]},
 {"t":"tab","q":"Bilde den Plural","h":"Plural mit Artikel, z. B. die Tage.","head":["Singular","Plural"],"r":[["der Markt","[die Märkte]"],["die Zwiebel","[die Zwiebeln]"],["das Ei","[die Eier]"],["der Paradeiser","[die Paradeiser]"],["der Erdapfel","[die Erdäpfel]"],["die Packung","[die Packungen]"],["das Auto","[die Autos]"],["die Semmel","[die Semmeln]"]]},
 {"t":"tab","q":"ein oder eine? (Nominativ)","h":"Artikelwort + Nomen, z. B. ein Tag.","head":["Nomen","ein … / eine …"],"r":[["Markt","[ein Markt]"],["Semmel","[eine Semmel]"],["Ei","[ein Ei]"],["Packung","[eine Packung]"],["Stand","[ein Stand]"],["Sackerl","[ein Sackerl]"]]},
 {"t":"tab","q":"kein oder keine? (Nominativ)","h":"Artikelwort + Nomen, z. B. kein Tag.","head":["Nomen","kein … / keine …"],"r":[["Karfiol","[kein Karfiol]"],["Zwiebel","[keine Zwiebel]"],["Ei","[kein Ei]"],["Eier (Plural)","[keine Eier]"],["Erdäpfel (Plural)","[keine Erdäpfel]"],["Einkaufsliste","[keine Einkaufsliste]"]]},
 {"t":"tab","q":"Welches Genus zeigt die Endung?","h":H_ART,"head":["Endung","Artikel"],"r":[["-ung","[die]"],["-chen","[das]"],["-heit","[die]"],["-schaft","[die]"],["-tät","[die]"],["-erl (Österreich)","[das]"]]},
 {"t":"tab","q":"Präteritum (er/sie)","h":"Nur die Form für er/sie, z. B. machte.","head":["Infinitiv","Präteritum (er/sie)"],"r":[["brauchen","[brauchte]"],["kosten","[kostete]"],["einkaufen","[kaufte ein]"],["wandern","[wanderte]"]]},
 {"t":"tab","q":"Perfekt (er/sie)","h":"Hilfsverb + Partizip II, z. B. hat gemacht.","head":["Infinitiv","Perfekt (er/sie)"],"r":[["brauchen","[hat gebraucht]"],["kosten","[hat gekostet]"],["einkaufen","[hat eingekauft]"],["aufstehen","[ist aufgestanden]"]]},
 {"t":"gap","q":"Am Samstag ___ wir frische Semmeln brauchen.","h":"Futur I: werden – richtige Form","a":["werden"]},
 {"t":"gap","q":"Im Winter ___ die Paradeiser mehr kosten.","h":"Futur I: werden – richtige Form","a":["werden"]},
 {"t":"gap","q":"Was ___ die Erdäpfel gekostet?","h":"haben oder sein – richtige Form im Präsens","a":["haben"]},
 {"t":"gap","q":"___ Zeitung ist von heute.","h":"bestimmter Artikel (Nominativ)","a":["Die"]},
 {"t":"gap","q":"___ Gemüse ist sehr frisch.","h":"bestimmter Artikel (Nominativ)","a":["Das"]},
 {"t":"gap","q":"___ Jänner ist in Wien oft kalt.","h":"bestimmter Artikel (Nominativ)","a":["Der"]},
 {"t":"gap","q":"___ Information ist wichtig.","h":"bestimmter Artikel (Nominativ)","a":["Die"]},
 {"t":"gap","q":"___ Ergebnis ist gut.","h":"bestimmter Artikel (Nominativ)","a":["Das"]},
 {"t":"gap","q":"Wir brauchen noch zwei ___. (die Zwiebel)","h":"Plural – nur das Nomen","a":["Zwiebeln"]},
 {"t":"gap","q":"Im Sackerl sind sechs ___. (das Ei)","h":"Plural – nur das Nomen","a":["Eier"]},
 {"t":"gap","q":"Am Markt sind viele ___. (der Stand)","h":"Plural – nur das Nomen","a":["Stände"]},
 {"t":"gap","q":"Die ___ sind heute sehr billig. (der Erdapfel)","h":"Plural – nur das Nomen","a":["Erdäpfel"]},
 {"t":"gap","q":"Hier ist ___ Einkaufsliste.","h":"unbestimmter Artikel (Nominativ)","a":["eine"]},
 {"t":"gap","q":"Ist das ___ Paradeiser?","h":"unbestimmter Artikel (Nominativ)","a":["ein"]},
 {"t":"gap","q":"Das ist ___ Ei, das ist eine Semmel.","h":"Verneinung vor dem Nomen","a":["kein"]},
 {"t":"gap","q":"Im Kühlschrank ist ___ Milch mehr.","h":"Verneinung vor dem Nomen","a":["keine"]},
 {"t":"gap","q":"Leider sind ___ Semmeln mehr da.","h":"Verneinung vor dem Nomen","a":["keine"]},
 {"t":"mc","q":"Welcher Artikel passt? „___ Freundschaft“","o":["die","der","das"],"a":0,"x":"-schaft is always feminine: die Freundschaft."},
 {"t":"mc","q":"Welcher Artikel passt? „___ Museum“","o":["das","der","die"],"a":0,"x":"-um is mostly neuter: das Museum, das Zentrum."},
 {"t":"mc","q":"Welcher Artikel passt? „___ Gemeinde“","o":["die","das","der"],"a":0,"x":"Ge-…-e is mostly neuter (das Gemüse), but die Gemeinde and die Geschichte are exceptions."},
 {"t":"mc","q":"Welcher Artikel passt? „___ Moment“ (a short time)","o":["der","das","die"],"a":0,"x":"-ment is mostly neuter (das Dokument), but der Moment is an exception."},
 {"t":"mc","q":"Welcher Satz ist richtig?","o":["Das ist kein Ei.","Das ist keine Ei.","Das ist nicht Ei."],"a":0,"x":"Ei is neuter: ein Ei → kein Ei. nicht does not negate a noun without article."},
 {"t":"mc","q":"Welcher Satz ist richtig geschrieben?","o":["Am Markt kaufe ich Eier und Semmeln.","Am Markt kaufe ich eier und semmeln.","Am markt kaufe ich Eier und Semmeln."],"a":0,"x":"All nouns begin with a capital letter: Markt, Eier, Semmeln."},
 {"t":"mc","q":"Was ist der Plural von „die Kassa“?","o":["die Kassen","die Kassas","die Kassa"],"a":0,"x":"die Kassa (Austria) → die Kassen, like die Kasse → die Kassen in Germany."},
 {"t":"mc","q":"Was ist der Plural von „das Sackerl“?","o":["die Sackerl oder die Sackerln","die Sackerle","die Säckerl"],"a":0,"x":"Austrian -erl words take no ending or -n in the plural: die Sackerl / die Sackerln."},
 {"t":"mc","q":"„Das Einkaufen am Samstag ist anstrengend.“ – Was ist „Einkaufen“ hier?","o":["ein Nomen (aus dem Verb einkaufen)","ein Verb","ein Adjektiv"],"a":0,"x":"das + infinitive turns a verb into a noun, so it begins with a capital letter."},
 {"t":"tr","dir":"de","q":"The tomatoes are very nice today.","a":["Die Paradeiser sind heute sehr schön.","Heute sind die Paradeiser sehr schön.","Die Tomaten sind heute sehr schön.","Heute sind die Tomaten sehr schön."]},
 {"t":"tr","dir":"de","q":"That is not a cauliflower.","a":["Das ist kein Karfiol.","Das ist kein Blumenkohl."]},
 {"t":"tr","dir":"de","q":"Where is the shopping list?","a":["Wo ist die Einkaufsliste?"]},
 {"t":"tr","dir":"de","q":"The bread rolls are fresh.","a":["Die Semmeln sind frisch.","Die Brötchen sind frisch."]},
 {"t":"tr","dir":"fi","q":"Wie viel kosten die Erdäpfel?","a":["How much are the potatoes?","How much do the potatoes cost?","What do the potatoes cost?"]},
 {"t":"tr","dir":"fi","q":"Brauchen Sie ein Sackerl?","a":["Do you need a bag?","Would you like a bag?"]},
 {"t":"tr","dir":"fi","q":"Ich habe am Markt Eier und Zwiebeln gekauft.","a":["I bought eggs and onions at the market.","I have bought eggs and onions at the market."]},
 {"t":"ord","w":["Die","Paradeiser","sind","heute","sehr","frisch"],"a":["Die Paradeiser sind heute sehr frisch.","Heute sind die Paradeiser sehr frisch."],"de":"The tomatoes are very fresh today."},
 {"t":"ord","w":["Ich","gehe","heute","zum","Markt","weil","wir","keine","Eier","mehr","haben"],"a":["Ich gehe heute zum Markt, weil wir keine Eier mehr haben.","Heute gehe ich zum Markt, weil wir keine Eier mehr haben.","Weil wir keine Eier mehr haben, gehe ich heute zum Markt."],"de":"I'm going to the market today because we have no eggs left."},
 {"t":"ord","w":["Die","Semmeln","sind","aus","deshalb","kaufe","ich","Brot"],"a":["Die Semmeln sind aus, deshalb kaufe ich Brot.","Die Semmeln sind aus, ich kaufe deshalb Brot."],"de":"The rolls are sold out, so I'm buying bread."},
 {"t":"les","q":"Samstag am Brunnenmarkt","txt":["Am Samstag ist Aurora mit Lena am Brunnenmarkt in Wien.","Der Markt ist groß, und es gibt viele Stände.","Die Paradeiser sind heute sehr schön, aber der Karfiol ist teuer.","Aurora braucht Erdäpfel, Zwiebeln und Eier.","Lena kauft nur Semmeln, denn sie hat schon Gemüse zu Hause.","Ein Sackerl brauchen sie nicht – sie haben eine Tasche dabei."],"qs":[{"q":"What is expensive today?","o":["the cauliflower","the tomatoes","the eggs"],"a":0},{"q":"Why does Lena only buy bread rolls?","o":["She already has vegetables at home.","The vegetables are too expensive.","The market has no vegetables."],"a":0},{"q":"Do they need a bag?","o":["No, they have a bag with them.","Yes, two bags.","Yes, one bag."],"a":0}]},
 {"t":"les","q":"Ein Zettel am Kühlschrank","txt":["Liebe Aurora!","Im Kühlschrank ist keine Milch mehr, und die Eier sind auch aus.","Wir brauchen auch ein Kilo Erdäpfel und zwei Zwiebeln.","Paradeiser brauchen wir nicht, die sind noch da.","Danke! Jonas"],"qs":[{"q":"What is missing in the fridge?","o":["milk and eggs","tomatoes","onions"],"a":0},{"q":"What do they not need?","o":["tomatoes","potatoes","onions"],"a":0}]},
 {"t":"les","q":"An der Kassa","txt":["Kassierin: Grüß Gott! Brauchen Sie ein Sackerl?","Aurora: Ja, bitte. Was kostet ein Sackerl?","Kassierin: Ein Sackerl kostet 30 Cent.","Aurora: Gut. Sind die Semmeln von heute?","Kassierin: Ja, die Semmeln sind ganz frisch. Das macht dann 12 Euro 40."],"qs":[{"q":"How much is a bag?","o":["30 cents","12 euros 40","40 cents"],"a":0},{"q":"Are the bread rolls fresh?","o":["Yes, they are from today.","No, they are from yesterday.","There are no bread rolls."],"a":0}]},
 {"t":"dlg","q":"Am Marktstand","r":[["Verkäufer","Grüß Gott! Was darf es sein?"],["Du","[Zwei Kilo Erdäpfel, bitte.|Ich hätte gern zwei Kilo Erdäpfel.|Ich hätte gerne zwei Kilo Erdäpfel.|Ich möchte zwei Kilo Erdäpfel.|Zwei Kilo Kartoffeln, bitte.|Ich hätte gern zwei Kilo Kartoffeln.|Ich hätte gerne zwei Kilo Kartoffeln.|Ich möchte zwei Kilo Kartoffeln.]","Ask for two kilos of potatoes."],["Verkäufer","Gerne. Sonst noch etwas?"],["Du","[Was kosten die Paradeiser?|Wie viel kosten die Paradeiser?|Was kosten die Tomaten?|Wie viel kosten die Tomaten?]","Ask what the tomatoes cost."],["Verkäufer","Ein Kilo kostet drei Euro."],["Du","[Danke, das ist alles.|Nein danke, das ist alles.|Danke, das war alles.]","Say thank you, that's all."]]},
 {"t":"dlg","q":"Im Supermarkt: Wo ist …?","r":[["Du","[Entschuldigung, wo sind die Eier?|Entschuldigen Sie, wo sind die Eier?]","Ask politely where the eggs are."],["Verkäuferin","Die Eier sind gleich da vorne, bei der Milch."],["Du","[Gibt es noch Semmeln?|Und gibt es noch Semmeln?|Haben Sie noch Semmeln?|Gibt es noch Brötchen?|Und gibt es noch Brötchen?|Haben Sie noch Brötchen?]","Ask if there are still bread rolls."],["Verkäuferin","Nein, leider. Heute gibt es keine Semmeln mehr."],["Du","[Schade. Danke!|Schade, danke.|Okay, danke.]","Say: what a pity, thanks."]]},
 {"t":"dlg","q":"Zu Hause: Was brauchen wir noch?","r":[["Lena","Ich gehe gleich einkaufen. Was brauchen wir noch?"],["Du","[Wir brauchen noch Eier und Zwiebeln.|Wir brauchen Eier und Zwiebeln.|Eier und Zwiebeln.]","Say: we still need eggs and onions."],["Lena","Und Milch?"],["Du","[Nein, wir haben noch Milch.|Nein, Milch haben wir noch.|Milch haben wir noch.]","Say: no, we still have milk."],["Lena","Hast du die Einkaufsliste?"],["Du","[Nein, ich habe keine Einkaufsliste.|Nein, ich habe keine.|Nein, leider nicht.]","Say: no, you don't have a shopping list."]]},
 {"t":"sch","q":"Write a short note for your flatmate (2–3 sentences): what do you need from the market, and what don't you need?","a":["Wir brauchen Erdäpfel, Zwiebeln und Eier. Paradeiser brauchen wir nicht."],"h":"2–3 Sätze"},
 {"t":"sch","q":"At a market stall: ask how much the cauliflower costs and say that you don't need a bag.","a":["Was kostet der Karfiol? Ich brauche kein Sackerl, danke.","Wie viel kostet der Karfiol? Ein Sackerl brauche ich nicht, danke."]},
 {"t":"sch","q":"Describe a market stall in 2–3 sentences: what is there, and what is sold out?","a":["Am Stand sind Paradeiser, Zwiebeln und Erdäpfel. Die Zwiebeln sind sehr schön, aber der Karfiol ist leider aus."],"h":"2–3 Sätze"},
 {"t":"mc","q":"Which nouns are always feminine (die)?","o":["nouns ending in -ung, -heit, -keit, -schaft, -ion, -tät","nouns ending in -chen","all nouns ending in -er","the days of the week"],"a":0,"x":"-ung, -heit, -keit, -schaft, -ion, -tät: always die (die Zeitung). -chen is always das, days of the week are der, and -er can be any gender (der Verkäufer, die Butter, das Fenster)."},
 {"t":"mc","q":"Which article do all nouns have in the plural?","o":["die","der","das","it depends on the gender"],"a":0,"x":"In the plural the article is always die: der Markt → die Märkte, das Ei → die Eier."},
 {"t":"mc","q":"When do you use kein and when nicht?","o":["kein for a noun with ein or without an article; nicht for verbs, adjectives and nouns with der/die/das","kein only in the plural","nicht before every noun","kein only for masculine nouns"],"a":0,"x":"Das ist kein Ei. Heute gibt es keine Semmeln. ↔ Das Ei ist nicht frisch. Ich kaufe heute nicht ein."},
 {"t":"mc","q":"Which plural ending do almost all feminine nouns have?","o":["-n / -en: die Zwiebeln, die Packungen","-er: die Eier","-s: die Autos","no ending"],"a":0,"x":"Feminine nouns: almost always -n/-en. Exceptions with ¨-e: die Wurst → die Würste."}
]
t = {"id":"d04","title":"Was brauchen wir vom Markt? – der, die, das und Plural","fi":"What do we need from the market? – der, die, das and the plural","lvl":"A1","req":["d01","d02"],"th":th,"v":v,"ex":ex}
open('/home/user/opi-suomea/docs/pruefungen/deutsch/entwuerfe/d04.json','w',encoding='utf8').write(json.dumps(t,ensure_ascii=False,indent=1))
print(len(v), len(ex), {k:sum(1 for e in ex if e['t']==k) for k in set(e['t'] for e in ex)})
