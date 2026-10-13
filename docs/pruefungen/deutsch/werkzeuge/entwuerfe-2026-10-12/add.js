// node add.js <dtw> <entwurf.json>: Thema in Testkopie ersetzen/anhängen
const fs=require("fs");const [dir,f]=process.argv.slice(2);const p=dir+"/lektionen/lektionen.json";
const L=JSON.parse(fs.readFileSync(p,"utf8"));const T=Array.isArray(L)?L:L.topics;const t=JSON.parse(fs.readFileSync(f,"utf8"));
const i=T.findIndex(x=>x.id===t.id); if(i>=0)T[i]=t; else T.push(t);
fs.writeFileSync(p,JSON.stringify(L,null,1));console.log(T.map(x=>x.id).join(","));
