// node nomen.js <dtw> <id>: großgeschriebene Wörter in Übungen ohne Karte/GLOSS (S-1012-102)
const fs=require("fs");const [dir,id]=process.argv.slice(2);
const src=fs.readFileSync(dir+"/js/inhalte.js","utf8");
const known=new Set([...src.matchAll(/^\s*"([^"]+)":\s*\{de:/gm)].map(m=>m[1].toLowerCase()));
const L=JSON.parse(fs.readFileSync(dir+"/lektionen/lektionen.json","utf8"));const T=Array.isArray(L)?L:L.topics;
for(const t of T){for(const [w] of t.v)for(const x of w.toLowerCase().split(/[^a-zäöüß]+/))known.add(x); if(t.id===id)break;}
const d=T.find(t=>t.id===id);
const parts=[];for(const e of d.ex){for(const k of ["q","txt","a","r","w","o"]){if(e.t==="mc"&&k==="q"&&/^[A-Z][a-z]+ /.test(e.q)&&!/[„“]/.test(e.q))continue;
 if((e.t==="tr"&&e.dir==="de"&&k==="q")||(e.t==="tr"&&e.dir==="fi"&&k==="a")||(e.t==="sch"&&k==="q")||(e.t==="les"&&k==="q"))continue;
 if(e[k]!==undefined)parts.push(JSON.stringify(e[k]));}
 if(e.t==="dlg")for(const r of e.r)parts.push(r[0]+" "+r[1]);}
const ws=new Set([...parts.join(" ").matchAll(/(?<![A-Za-zäöüßÄÖÜ])[A-ZÄÖÜ][a-zäöüß]+/g)].map(m=>m[0]));
console.log([...ws].filter(w=>!known.has(w.toLowerCase())).sort().join(" "));
