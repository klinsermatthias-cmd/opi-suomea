// node gesamt.js <dtw>: Kennzahlen d01–d09 gegen die Anleitung
const fs=require("fs");const dir=process.argv[2];
const L=JSON.parse(fs.readFileSync(dir+"/lektionen/lektionen.json","utf8"));const T=Array.isArray(L)?L:L.topics;
const PLAN={d04:["d01","d02"],d05:["d01","d02","d04"],d06:["d01","d02","d04","d05"],d07:["d01","d02","d04","d05","d06"],d08:["d01","d02","d05","d06"],d09:["d01","d02","d04","d05"]};
console.log("| Thema | Karten | Übungen | Formate | les | dlg | sch | tr de/fi | Zeitformen (Prät/Perf-Tab, Futur-Lücken) | Regelfragen am Ende | th: Situation/Dialog/Grammatik/Verbtabelle | req wie Plan |");
console.log("|---|---|---|---|---|---|---|---|---|---|---|---|");
for(const t of T){const ex=t.ex;const c=k=>ex.filter(e=>e.t===k).length;
 const fm=new Set(ex.map(e=>e.t)).size;
 const tense=ex.filter(e=>e.t==="tab"&&/Präteritum|Perfekt/.test(e.q)).length+"/"+ex.filter(e=>e.t==="gap"&&/Futur/.test(e.h||"")).length;
 let k=0;for(let i=ex.length-1;i>=0&&ex[i].t==="mc"&&ex[i].x;i--)k++;
 const th=t.th||"";const parts=[/Situation/i.test(th),/dialogue/i.test(th),/Grammar/i.test(th),/Verb forms/i.test(th)].map(b=>b?"✓":"✗").join("");
 const verbs=t.v.filter(v=>/·/.test(v[1])).length;
 const tr=ex.filter(e=>e.t==="tr"&&e.dir==="de").length+"/"+ex.filter(e=>e.t==="tr"&&e.dir==="fi").length;
 const req=PLAN[t.id]?(JSON.stringify(t.req)===JSON.stringify(PLAN[t.id])?"✓":"✗ "+t.req.join(",")):"(bestehend) "+(t.req||[]).join(",");
 console.log(`| ${t.id} | ${t.v.length} (Verben ${verbs}) | ${ex.length} | ${fm} | ${c("les")} | ${c("dlg")} | ${c("sch")} | ${tr} | ${tense} | ${k} | ${parts} | ${req} |`);}
// doppelte Karten über alle Themen
const seen={};for(const t of T)t.v.forEach((v,i)=>{const k=v[0].toLowerCase().replace(/,.*$/,"").replace(/\s*\(.*\)/,"").trim();(seen[k]=seen[k]||[]).push(t.id+"-"+i)});
const dup=Object.entries(seen).filter(([k,a])=>a.length>1);console.log("\nDoppelte Karten (Singular):",dup.length?dup.map(([k,a])=>k+": "+a.join(", ")).join("; "):"keine");
