// Lädt alle Themen (BASE_TOPICS + lektionen.json [+ Zusatzdatei]) – nur lesend
const fs=require("fs"),vm=require("vm"),path=require("path");
const R=process.env.R||"/home/user/opi-suomea";
const ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(R+"/js/app.js","utf8")+"\n"+fs.readFileSync(R+"/js/inhalte.js","utf8")+"\n;this.BT=BASE_TOPICS;this.GX=typeof GLOSS_EXTRA==='undefined'?{}:GLOSS_EXTRA;",ctx);
let L=JSON.parse(fs.readFileSync(R+"/lektionen/lektionen.json","utf8"));
const extra=process.env.EXTRA?JSON.parse(fs.readFileSync(process.env.EXTRA,"utf8")):[];
module.exports={base:ctx.BT,json:L,extra,all:[...ctx.BT,...L,...extra],GX:ctx.GX};
