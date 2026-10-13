// node oesterr.js <lektionen.json>: österreichische Wörter in Karten und Lösungen, mit/ohne bundesdeutsche Alternative
const fs=require("fs");const L=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));const T=Array.isArray(L)?L:L.topics;
const AT={Paradeiser:"Tomate",Erdäpfel:"Kartoffel",Erdapfel:"Kartoffel",Karfiol:"Blumenkohl",Semmel:"Brötchen",Sackerl:"Tüte",Kassa:"Kasse",Jänner:"Januar",Häferl:"Tasse|Becher",Kasten:"Schrank",Jause:"Brotzeit|Imbiss|Snack",Heurige:"Weinlokal|Straußwirtschaft",Ordination:"Praxis|Arztpraxis",Krankenstand:"krankgeschrieben|Krankschreibung",Topfen:"Quark",Bim:"Straßenbahn",Marille:"Aprikose",Obers:"Sahne",Kren:"Meerrettich",Stiege:"Treppe",Spital:"Krankenhaus",Matura:"Abitur",heuer:"dieses Jahr",Fisole:"Bohne",Faschiertes:"Hackfleisch",Melanzani:"Aubergine",Zuckerl:"Bonbon",Polster:"Kissen",Sessel:"Stuhl",Rauchfang:"Schornstein",Mistkübel:"Mülleimer",Kübel:"Eimer",Jänner:"Januar",Feber:"Februar",Kipferl:"Hörnchen",Nachtmahl:"Abendessen",Gelse:"Mücke",Paradeiser:"Tomate"};
const re=new RegExp("(?<![A-Za-zäöüß])("+Object.keys(AT).join("|")+")","");
for(const t of T){
 t.v.forEach((c,i)=>{const m=c[0].match(re);if(m){const alt=new RegExp(AT[m[1]],"i").test(c[1]);console.log(`${t.id} v${i} Karte „${c[0]}“ → ${c[1]} ${alt?"✓":"✗ ohne "+AT[m[1]]}`);}});
 t.ex.forEach((e,i)=>{let sols=[];
  if(e.t==="gap"||e.t==="tr"&&e.dir==="de"||e.t==="ord")sols=[].concat(e.a||[]);
  if(e.t==="tab")sols=e.r.flatMap(r=>r.slice(1).map(c=>(c.match(/\[([^\]]*)\]/)||[])[1]).filter(Boolean));
  if(e.t==="dlg")sols=e.r.filter(r=>r[0]==="Du").map(r=>(r[1].match(/\[([^\]]*)\]/)||[])[1]).filter(Boolean);
  const all=sols.join("|");const m=all.match(re);if(!m)return;
  const alt=new RegExp(AT[m[1]],"i").test(all);
  console.log(`${t.id} ex${i} ${e.t} „${m[1]}“ in Lösung ${alt?"✓ Alternative vorhanden":"✗ ohne "+AT[m[1]]}`);});
}
