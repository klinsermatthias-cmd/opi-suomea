/* Opi suomea – ki.js: KI „Opettaja“: Anbieter (Gemini/OpenAI-kompatibel), Fehlerbehandlung, KI-Protokoll, Prüfung, Analyse, Übungen.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
/* ============================================================
   KI – OPETTAJA
   ============================================================ */
const TEACHER="Du bist „Opettaja“, eine geduldige, ehrliche und motivierende Finnischlehrerin. Dein Schüler heißt Matthias, ist Anfänger und spricht Deutsch. Du erklärst einfach und präzise auf Deutsch. Finnische Beispiele müssen immer korrekt sein.";
const SYS_JSON=TEACHER+" Antworte AUSSCHLIESSLICH mit gültigem JSON, ohne Text davor oder danach und ohne Markdown.";
/* KI-Anbieter: Google Gemini (kostenlos) oder ein OpenAI-kompatibler Dienst.
   Der Schlüssel liegt nur auf diesem Gerät.  */
const GEMINI_MODELS=["gemini-flash-latest","gemini-2.5-flash","gemini-flash-lite-latest","gemini-2.5-flash-lite"];
function aiReady(){const a=CFG.ai||{};return !!(S&&S.settings.ai&&a.provider&&a.provider!=="none"&&a.key)}
/* --- Fehler einordnen, merken und verständlich erklären --- */
let LAST_AI_ERR=null;
function aiErr(kind,msg,model){const e=new Error(msg||kind);e.kind=kind;e.model=model||"";return e}
function aiLog(kind,model,msg,ms){
  CFG.aiLog=[{t:Date.now(),kind,model:model||"",msg:String(msg||"").slice(0,160),ms:ms||0},...(CFG.aiLog||[])].slice(0,30);saveCfg()}
function aiErrText(e){const k=(e&&e.kind)||"unknown";return({
  offline:"kein Internet",timeout:"Gemini hat zu lange gebraucht",
  "quota-min":"zu viele Anfragen pro Minute – kurz warten",
  "quota-day":"Tageslimit von Gemini erreicht – setzt sich um ca. 9 Uhr zurück",
  key:"API-Schlüssel ungültig oder gesperrt",overload:"Gemini ist gerade überlastet",
  empty:"Gemini hat keine verwertbare Antwort geliefert",net:"keine Verbindung zu Google",
  setup:"KI nicht eingerichtet"}[k])||"unbekannter Fehler"}
function aiErrShort(){return LAST_AI_ERR?aiErrText(LAST_AI_ERR):"keine Verbindung"}
async function aiCall(system,user,opt={}){
  const a=CFG.ai||{};
  if(!a.key||!a.provider||a.provider==="none")throw aiErr("setup");
  if(!navigator.onLine){LAST_AI_ERR=aiErr("offline");throw LAST_AI_ERR}
  const meta=opt.meta||{},t0=Date.now();opt.usage=null;
  try{const r=await(a.provider==="openai"?openaiCall(system,user,a,opt):geminiCall(system,user,a,opt));LAST_AI_ERR=null;
    const u=opt.usage||{};meta.model=u.model||meta.model;meta.i=(meta.i||0)+(u.i||0);meta.o=(meta.o||0)+(u.o||0);meta.t=(meta.t||0)+(u.t||0);meta.ms=(meta.ms||0)+Date.now()-t0;
    if(meta.k)aiStat(meta.k,u,Date.now()-t0,null);return r}
  catch(e){if(!e.kind)e.kind="unknown";LAST_AI_ERR=e;aiLog(e.kind,e.model,e.message);if(meta.k)aiStat(meta.k,{},Date.now()-t0,e.kind);throw e}
}
async function fetchT(url,opt,ms){const c=new AbortController();const tm=setTimeout(()=>c.abort(),ms);
  try{return await fetch(url,{...opt,signal:c.signal})}
  catch(e){throw aiErr(c.signal.aborted?"timeout":(navigator.onLine?"net":"offline"),e.message)}
  finally{clearTimeout(tm)}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
/* Probiert die Modelle der Reihe nach. Jedes Modell hat ein eigenes Gratis-Kontingent –
   ist eines voll oder überlastet, springt das nächste ein. */
async function geminiCall(system,user,a,opt={}){
  const models=opt.only?[a.model]:[a.model,...GEMINI_MODELS].filter((m,i,arr)=>m&&arr.indexOf(m)===i);
  const caps=CFG.aiCaps||(CFG.aiCaps={});
  let worst=null;const rank={"quota-day":5,"quota-min":4,overload:3,timeout:2,empty:1,net:1,unknown:0};
  const keep=e=>{if(!worst||(rank[e.kind]||0)>=(rank[worst.kind]||0))worst=e};
  for(const m of models){
    for(let attempt=0;attempt<3;attempt++){
      const cap=caps[m]||{};const gc={temperature:0.3,maxOutputTokens:8192};
      if(opt.json&&!cap.noJson)gc.responseMimeType="application/json";
      if(!cap.noThink)gc.thinkingConfig={thinkingLevel:"low"};
      const t0=Date.now();let res;
      try{res=await fetchT(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`,{
        method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":a.key},
        body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents:[{role:"user",parts:[{text:user}]}],generationConfig:gc})},opt.timeout||30000)}
      catch(e){e.model=m;if(e.kind==="offline")throw e;keep(e);break}
      if(res.ok){
        const d=await res.json().catch(()=>({}));const c=d.candidates&&d.candidates[0];
        const txt=((c&&c.content&&c.content.parts)||[]).filter(p=>!p.thought).map(p=>p.text||"").join("").trim();
        if(!txt){keep(aiErr("empty","Leere Antwort ("+((c&&c.finishReason)||"?")+")",m));if(attempt===0&&!cap.noThink){continue}break}
        if(a.model!==m){CFG.ai.model=m}aiLog("ok",m,"",Date.now()-t0);
        const um=d.usageMetadata||{};opt.usage={model:m,i:um.promptTokenCount||0,o:um.candidatesTokenCount||0,t:um.thoughtsTokenCount||0};return txt;
      }
      const j=await res.json().catch(()=>({}));const msg=(j.error&&j.error.message)||("HTTP "+res.status);
      if(res.status===400){
        if(/thinking/i.test(msg)&&!cap.noThink){caps[m]={...cap,noThink:1};saveCfg();continue}
        if(/mime|response_?mime/i.test(msg)&&!cap.noJson){caps[m]={...cap,noJson:1};saveCfg();continue}
        if(/api key|api_key|API_KEY/i.test(msg))throw aiErr("key",msg,m);
        keep(aiErr("unknown",msg,m));break}
      if(res.status===401||res.status===403)throw aiErr("key",msg,m);
      if(res.status===404){keep(aiErr("unknown","Modell "+m+" nicht verfügbar",m));break}
      if(res.status===429){keep(aiErr(/per ?day|PerDay|daily/i.test(msg)?"quota-day":"quota-min",msg,m));break}
      if(res.status>=500){keep(aiErr("overload",msg,m));if(attempt<1){await sleep(1500);continue}break}
      keep(aiErr("unknown",msg,m));break;
    }
  }
  throw worst||aiErr("unknown","Kein Modell verfügbar");
}
async function openaiCall(system,user,a,opt={}){
  const res=await fetchT((a.baseUrl||"https://api.groq.com/openai/v1").replace(/\/+$/,"")+"/chat/completions",{method:"POST",
    headers:{"Content-Type":"application/json",Authorization:"Bearer "+a.key},
    body:JSON.stringify({model:a.model||"llama-3.3-70b-versatile",temperature:0.3,messages:[{role:"system",content:system},{role:"user",content:user}]})},30000);
  if(res.status===429)throw aiErr("quota-min","Limit erreicht");
  if(res.status===401||res.status===403)throw aiErr("key","Schlüssel ungültig");
  if(res.status>=500)throw aiErr("overload","HTTP "+res.status);
  if(!res.ok)throw aiErr("unknown","HTTP "+res.status);
  const d=await res.json();const t=((d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||"").trim();
  if(!t)throw aiErr("empty","Leere Antwort");
  const us=d.usage||{};opt.usage={model:a.model||"llama-3.3-70b-versatile",i:us.prompt_tokens||0,o:us.completion_tokens||0,t:0};return t;
}
function parseJSON(txt){const c=txt.replace(/```json|```/g,"").trim();return JSON.parse(c.slice(c.indexOf("{"),c.lastIndexOf("}")+1))}
async function aiJSON(prompt,meta){
  const txt=await aiCall(SYS_JSON,prompt,{json:true,meta});
  try{return parseJSON(txt)}
  catch(e){const t2=await aiCall(SYS_JSON,prompt+"\n\nWICHTIG: Halte dich sehr kurz (insgesamt unter 120 Wörter), damit das JSON vollständig ist.",{json:true,meta});
    try{return parseJSON(t2)}catch(e2){const er=aiErr("empty","Antwort war kein gültiges JSON");LAST_AI_ERR=er;aiLog("empty","",er.message);throw er}}
}

async function aiJudge(ex,user){
  const t={title:SESSION.title||(T(SESSION.id)||{}).title||""};
  const kind=ex.t==="gap"?"Lückentext":(ex.dir==="de"?"Übersetzung Deutsch → Finnisch":"Übersetzung Finnisch → Deutsch");
  const sol=(ex.t==="gap"?ex.a.map(a=>ex.q.replace("___",a)):ex.a).join(" | ");
  const p=`Thema: ${t.title}
Aufgabentyp: ${kind}
Aufgabe: ${promptText(ex)}
Musterlösung(en): ${sol}
Antwort des Schülers: "${user}"

Bewerte streng, aber fair. Korrekt sind auch gleichwertige Alternativen (andere passende Wortwahl, weggelassenes Personalpronomen, Groß-/Kleinschreibung, fehlende Satzzeichen). Ein kleiner Tippfehler, der kein anderes Wort und keine andere Form ergibt, zählt als korrekt mit Hinweis. Falsche Endungen, falsche Vokalharmonie oder falsche Verbformen sind falsch.${ex.s?" In dieser Aufgabe wird gezielt a/ä bzw. o/ö geprüft – eine Verwechslung ist falsch.":""}
JSON: {"correct": true oder false, "feedback": "1–2 kurze Sätze auf Deutsch: warum richtig/falsch", "correction": "die richtige Lösung"}`;
  const meta={k:"pruefung"},j=await aiJSON(p,meta);
  j._aid=aiAudit("pruefung",meta,{q:`[${kind}] ${promptText(ex)}`,sol,u:user,ok:!!j.correct,r:`${j.correct?"richtig":"falsch"} – ${j.feedback||""}${j.correction?" | Korrektur: "+j.correction:""}`});
  return j;
}

/* ---------- KI-Protokoll (für die Qualitätsprüfung durch Claude und die Token-Statistik) ----------
   S.aiStats[Gerät][Art] = Zähler (Aufrufe, Fehler, Token, Dauer, Modelle) – pro Gerät, damit sich beim Sync nichts doppelt zählt.
   S.aiAudit = die letzten Antworten mit Inhalt (max. 15 je Art, 80 gesamt; markierte bleiben bevorzugt). */
const AI_KINDS={pruefung:"Antwortprüfung",vokabel:"Vokabelprüfung",hoeren:"Hörverstehen",auswertung:"Rundenauswertung",analyse:"Gesamtanalyse",wort:"Wort nachschlagen",frage:"Frag Opettaja",uebungen:"Neue Übungen"};
function devId(){if(!CFG.devId){CFG.devId=Math.random().toString(36).slice(2,10);saveCfg()}return CFG.devId}
function aiStat(k,u,ms,err){
  S.aiStats=S.aiStats||{};const dv=S.aiStats[devId()]||(S.aiStats[devId()]={since:Date.now(),k:{}});
  const s=dv.k[k]||(dv.k[k]={n:0,err:0,i:0,o:0,t:0,ms:0,m:{}});
  if(err){s.err++;s.ek=s.ek||{};s.ek[err]=(s.ek[err]||0)+1}
  else{s.n++;s.i+=u.i||0;s.o+=u.o||0;s.t+=u.t||0;s.ms+=ms;if(u.model)s.m[u.model]=(s.m[u.model]||0)+1}
}
const cut=(x,n)=>{x=typeof x==="string"?x:JSON.stringify(x??"");return x.length>n?x.slice(0,n-1)+"…":x};
function auditCap(list){const by=list.slice().sort((a,b)=>b.d-a.d),cnt={},out=[];
  by.filter(e=>e.flag).slice(0,20).forEach(e=>out.push(e));
  by.filter(e=>!e.flag).forEach(e=>{cnt[e.k]=(cnt[e.k]||0)+1;if(cnt[e.k]<=15&&out.length<80)out.push(e)});
  return out.sort((a,b)=>b.d-a.d)}
/* Einen Eintrag ablegen; Rückgabe = Eintrags-ID (für „KI lag falsch?“) */
function aiAudit(k,meta,f){
  const e={id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),d:Date.now(),k,m:meta.model||"",ms:meta.ms||0,tok:[meta.i||0,meta.o||0,meta.t||0],
    q:cut(f.q,240),sol:f.sol!=null?cut(f.sol,200):undefined,u:f.u!=null?cut(f.u,160):undefined,r:cut(f.r,f.rmax||320),ok:f.ok};
  S.aiAudit=auditCap([e,...(S.aiAudit||[])]);save();return e.id}
function flagLink(aid,label){return aid?`<p class="aiflagp"><a href="#" class="aiflag" data-act="aiflag" data-id="${esc(aid)}">${label||"KI lag falsch?"}</a></p>`:""}

/* Grundlagen = die Themen der App-Basis (t01–t08) */
function basicsStatus(){const st=BASE_TOPICS.map(t=>S.topics[t.id]).filter(Boolean);
  const solid=st.filter(s=>s.status==="learning"&&(s.last||0)>=0.8&&(s.reps||0)>=2).length;return{solid,total:BASE_TOPICS.length,ok:solid===BASE_TOPICS.length}}
function genUnlocked(){return !!(S.genUnlock&&S.genUnlock.on)}
async function aiGenerate(t){
  const learned=TOPICS.filter(x=>S.topics[x.id].status==="learning");
  const voc=learned.flatMap(x=>x.v.map(w=>w[0])).slice(0,250).join(", ");
  const weak=S.errors.filter(e=>e.topic===t.id&&!e.ok).slice(0,6).map(e=>`- ${e.q} (richtig: ${e.exp})`).join("\n")||"keine";
  const theory=String(t.th||"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").slice(0,1800);
  const p=`Erstelle 7 NEUE Übungen zum Thema „${t.title}“ (${t.lvl}). Nicht die Sätze aus der Theorie wiederholen – neue Sätze, gleiche Grammatik.
Theorie (Auszug): ${theory}
Bekannte Wörter (nur diese plus sehr einfache Wörter verwenden): ${voc}
Aktuelle Fehler des Schülers in diesem Thema:
${weak}

Mische: 2× "gap", 2× "tr" (dir "de" = Deutsch→Finnisch), 1× "tr" (dir "fi"), 1× "tab", 1× "mc". Alle finnischen Formen müssen korrekt sein.
Formate:
{"t":"gap","q":"Minä ___ kotona.","h":"olla","a":["olen"]}
{"t":"tr","dir":"de","q":"Ich wohne in Linz.","a":["Asun Linzissä","Minä asun Linzissä"]}
{"t":"tr","dir":"fi","q":"Hän ei ole täällä.","a":["Er ist nicht hier","Sie ist nicht hier"]}
{"t":"tab","q":"Konjugiere …","head":["Person","Verb"],"r":[["minä","[form]"],["sinä","[form]"]]}  (Lücken in [eckigen Klammern], Alternativen mit |)
{"t":"mc","q":"…","o":["richtig","falsch","falsch","falsch"],"a":0}
JSON: {"ex":[ … ]}`;
  const meta={k:"uebungen"},j=await aiJSON(p,meta);const ok=(j.ex||[]).filter(validEx);
  ok._aid=aiAudit("uebungen",meta,{q:`${t.id} ${t.title}: 7 neue Übungen`,r:JSON.stringify(j.ex||[]),rmax:2400,ok:ok.length===(j.ex||[]).length});
  return ok;
}
async function startGen(id,b){
  const t=T(id);if(!t||!aiReady()||!genUnlocked())return;
  if(b){b.disabled=true;b.innerHTML=`Opettaja schreibt neue Übungen ${dots()}`}
  try{
    const gen=await aiGenerate(t);if(gen.length<3)throw new Error("zu wenige");
    const idxs=gen.map((_,i)=>i);
    S.active={id,mode:"gen",genAid:gen._aid,title:t.title+" · neue Übungen",gen,gsrc:gen.map(()=>({tid:id,ei:-1})),idxs,rt:idxs.map(()=>0),idx:0,results:[],d:Date.now()};save();openSession();
  }catch(e){toast(e.kind?"Opettaja nicht erreichbar: "+aiErrShort():"Opettaja konnte gerade keine passenden Übungen erstellen – versuch es nochmal");if(b){b.disabled=false;b.textContent="Neue Übungen von Opettaja"}}
}
async function aiSessionReview(t,s,results,score,rating,baseDays){
  const errs=results.filter(r=>!r.correct).map(r=>`- ${r.q} | Antwort: ${r.user} | richtig: ${r.exp}`).join("\n")||"keine";
  const hist=s.hist.slice(-6).map(h=>`${new Date(h.d).toLocaleDateString("de-AT")}: ${h.sc} %`).join(", ");
  const p=`Der Schüler hat gerade das Thema „${t.title}“ (${t.lvl}) geübt.
Ergebnis: ${Math.round(score*100)} % (${results.filter(r=>r.correct).length}/${results.length}). Selbsteinschätzung: ${RATINGS.find(r=>r.k===rating).l}.
Bisherige Ergebnisse: ${hist}
Wiederholungen: ${s.reps}, Fehlschläge: ${s.lapses}
Fehler in dieser Runde:
${errs}
Der Spaced-Repetition-Algorithmus schlägt die nächste Wiederholung in ${baseDays} Tag(en) vor.

Entscheide als Lehrerin, wann das Thema wiederholt wird: Unsicheres früher (1–2 Tage), Solides später. Weiche vom Vorschlag ab, wenn Fehler oder Verlauf es nahelegen.
JSON: {"feedback":"2–3 Sätze ehrliches, persönliches Feedback auf Deutsch, Fehler konkret erklären","tips":["bis zu 3 kurze, konkrete Tipps"],"intervalDays": Ganzzahl 1–180,"reason":"1 kurzer Satz, warum dieser Abstand"}`;
  const meta={k:"auswertung"},j=await aiJSON(p,meta);
  j._aid=aiAudit("auswertung",meta,{q:`${t.id} ${t.title}: ${Math.round(score*100)} %, selbst „${RATINGS.find(r=>r.k===rating).l}“, Algorithmus ${baseDays} T., Fehler: ${results.filter(r=>!r.correct).map(r=>r.user+" ≠ "+r.exp).join("; ")||"keine"}`,
    r:`${j.intervalDays} Tage – ${j.reason||""} | ${j.feedback||""} | Tipps: ${(j.tips||[]).join("; ")}`,rmax:500});
  return j;
}

function progressSummary(){
  const L=[];
  L.push(`Lernstart: ${new Date(S.created).toLocaleDateString("de-AT")} | Serie: ${streakNow()} Tage | Sitzungen: ${S.stats.sessions} | Kartenwiederholungen: ${S.stats.reviews}`);
  L.push("\nTHEMEN:");
  TOPICS.forEach(t=>{const s=S.topics[t.id];
    if(s.status==="learning")L.push(`- ${t.id} ${t.title}: zuletzt ${pct(s.last)}, bestes ${pct(s.best)}, Wdh ${s.reps}, Fehlschläge ${s.lapses}, nächste ${fmtDate(s.due)}, Verlauf ${s.hist.slice(-5).map(h=>h.sc+"%").join(" → ")}`);
    else L.push(`- ${t.id} ${t.title}: ${s.status==="new"?"freigeschaltet, noch nicht gelernt":"gesperrt"}`)});
  const all=Object.entries(S.cards).filter(([id])=>cardWord(id)), seen=all.filter(([,c])=>!c.isNew);
  const dirStat=r=>{const x=seen.filter(([id])=>cardParse(id).rev===r),n=k=>x.filter(([,c])=>cardState(c)===k).length;return`${x.length} gelernt (${n("lernt")} frisch, ${n("gut")} gefestigt, ${n("sicher")} sicher), ${x.filter(([,c])=>c.lapses>=2).length} oft vergessen`};
  L.push(`\nVOKABELN: ${new Set(all.map(([id])=>cardParse(id).base)).size} Wörter, ${learnedWords()} gelernt (je Richtung eigene Karte)\n- Finnisch → Deutsch: ${dirStat(false)}\n- Deutsch → Finnisch: ${dirStat(true)}`);
  const weak=weakCards().slice(0,15).map(([id,c])=>{const w=cardWord(id);return`${w[0]} (${w[1]}, ${DIRL(id)}) – ${c.lapses}× vergessen`});
  if(weak.length)L.push("Schwierige Wörter: "+weak.join("; "));
  const vh=S.vhelp||[];if(vh.length){const cnt={};vh.forEach(x=>x.words.forEach(w=>cnt[w]=(cnt[w]||0)+1));
    L.push(`\nVOKABELHILFE genutzt (letzte ${vh.length} Aufgaben) – aktiv noch unsichere Wörter: `+Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,25).map(([w,n])=>w+(n>1?" ×"+n:"")).join(", "))}
  const er=S.errors.slice(0,20);
  if(er.length){L.push("\nLETZTE FEHLER:");er.forEach(e=>L.push(`- [${e.topic}] ${e.q} → „${e.user}“ (richtig: ${e.exp})`))}
  return L.join("\n");
}

async function aiGlobal(){
  const ids=TOPICS.filter(t=>S.topics[t.id].status==="learning").map(t=>t.id).join(", ")||"keine";
  const p=`Aktueller Lernstand:

${progressSummary()}

Analysiere den Fortschritt wie eine erfahrene Finnischlehrerin. Schätze das Niveau (z. B. „A0“, „A0+“, „A1-“), erkenne Muster in Fehlern und vergessenen Wörtern und plane Wiederholungen neu, wo es sinnvoll ist (nur diese Themen-IDs: ${ids}; schwache Themen früher, sehr sichere ruhig später).
Halte jeden Text kurz (Listen höchstens 3 Punkte mit je max. 12 Wörtern), damit die Antwort vollständig bleibt.
Entscheide außerdem streng, ob die Grundlagen (Themen ${BASE_TOPICS.map(t=>t.id).join(", ")}) über mehrere Wiederholungen sicher sitzen. Nur dann bekommt der Schüler frei erzeugte Zusatzübungen. Im Zweifel false.
JSON: {"level":"…","summary":"2 Sätze","strengths":["…"],"weaknesses":["…"],"tips":["…"],"reschedule":[{"topicId":"t0X","days":1,"reason":"max. 8 Wörter"}],"nextFocus":"1 motivierender Satz","basicsSolid":false,"basicsReason":"1 kurzer Satz"}`;
  const meta={k:"analyse"},j=await aiJSON(p,meta);
  j._aid=aiAudit("analyse",meta,{q:`Gesamtanalyse (Themen: ${ids})`,r:`Niveau ${j.level} | ${j.summary||""} | Schwächen: ${(j.weaknesses||[]).join("; ")} | Termine: ${(j.reschedule||[]).map(r=>r.topicId+" "+r.days+"T").join(", ")} | Grundlagen sicher: ${j.basicsSolid}`,rmax:600});
  return j;
}

async function runGlobal(silent){
  if(GLOBAL_RUNNING)return; if(!aiReady()){if(!silent)toast("Opettaja ist nicht eingerichtet – siehe Einstellungen → Cloud & KI");return}
  if(!TOPICS.some(t=>S.topics[t.id].status==="learning")){if(!silent)toast("Lerne zuerst ein Thema");return}
  GLOBAL_RUNNING=true; if(!silent){const b=$("#globalbox");if(b)b.innerHTML=`<p class="muted">Opettaja analysiert deinen Fortschritt ${dots()}</p>`}
  try{
    const j=await aiGlobal();
    (j.reschedule||[]).forEach(r=>{const s=S.topics[r.topicId];const d=clampInt(r.days,1,180);
      if(s&&s.status==="learning"&&d){s.due=addDays(d);s.interval=d;s.ai={...(s.ai||{}),reason:"Gesamtanalyse: "+(r.reason||"")}}});
    const aid=j._aid;delete j._aid;S.reports.unshift({...j,d:Date.now(),aid}); S.reports=S.reports.slice(0,10);
    if(!genUnlocked()&&j.basicsSolid===true&&basicsStatus().ok){S.genUnlock={on:true,d:Date.now(),reason:j.basicsReason||""};setTimeout(()=>toast("Freigeschaltet: Neue Übungen von Opettaja – deine Grundlagen sitzen!"),2600)}
    S.lastGlobal=Date.now(); S.sinceGlobal=0; save();
    if(!SESSION&&(CUR.tab==="today"||CUR.tab==="progress"))render();
    toast("Opettaja hat deinen Lernplan aktualisiert");
  }catch(e){GLOBAL_FAILED_AT=Date.now();if(!silent){toast("Opettaja nicht erreichbar: "+aiErrShort());render()}}
  GLOBAL_RUNNING=false;
}
let GLOBAL_FAILED_AT=0;
function maybeAutoGlobal(){
  if(!aiReady()||GLOBAL_RUNNING||Date.now()-GLOBAL_FAILED_AT<30*60000)return;
  const stale=Date.now()-S.lastGlobal>3*DAY;
  if(S.sinceGlobal>=3||(stale&&S.sinceGlobal>=1))runGlobal(true);
}

/* ---------- Verbindungs-Check für Opettaja ---------- */
async function aiDiagnose(){
  const box=$("#aidiagbox");if(!box)return;const a=CFG.ai||{};
  const row=(ok,t,d)=>`<div class="setrow"><span>${ok===null?"…":ok?"✓":"✗"} ${t}</span><small>${d||""}</small></div>`;
  let h="";const put=x=>{h+=x;box.innerHTML=h+`<p class="muted">Prüfe ${dots()}</p>`};
  put(row(navigator.onLine,"Internet",navigator.onLine?"verbunden":"offline – bitte WLAN/Daten prüfen"));
  if(!navigator.onLine){box.innerHTML=h;return}
  if(!S.settings.ai){box.innerHTML=h+row(false,"Opettaja","ist in den Einstellungen ausgeschaltet");return}
  if(!a.key||!a.provider||a.provider==="none"){box.innerHTML=h+row(false,"KI-Schlüssel","fehlt – unter „Cloud & KI einrichten“ eintragen");return}
  if(a.provider==="openai"){try{const t0=Date.now();await openaiCall("Antworte mit OK.","Test",a);box.innerHTML=h+row(true,"Anbieter",`antwortet (${Date.now()-t0} ms)`)}catch(e){box.innerHTML=h+row(false,"Anbieter",aiErrText(e))}return}
  // Schlüssel + verfügbare Modelle
  let avail=[];
  try{const r=await fetchT("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200",{headers:{"x-goog-api-key":a.key}},15000);
    if(r.status===400||r.status===401||r.status===403){box.innerHTML=h+row(false,"API-Schlüssel","ungültig – auf aistudio.google.com einen neuen erstellen und unter „Cloud & KI einrichten“ eintragen");return}
    if(!r.ok)throw aiErr(r.status>=500?"overload":"unknown","HTTP "+r.status);
    const d=await r.json();avail=(d.models||[]).filter(m=>(m.supportedGenerationMethods||[]).includes("generateContent")).map(m=>m.name.replace(/^models\//,""));
    put(row(true,"API-Schlüssel","gültig"));
  }catch(e){box.innerHTML=h+row(false,"Google erreichbar",aiErrText(e));return}
  const flash=avail.filter(m=>/flash/i.test(m)&&!/image|tts|audio|live|exp|preview/i.test(m));
  const cands=[...GEMINI_MODELS,...flash].filter((m,i,arr)=>arr.indexOf(m)===i&&(avail.includes(m)||GEMINI_MODELS.includes(m))).slice(0,7);
  const results=[];
  for(const m of cands){
    const t0=Date.now();let r;
    try{const txt=await geminiCall("Antworte nur mit dem Wort OK.","Test",{...a,model:m},{timeout:20000,only:true});
      r={m,ok:true,ms:Date.now()-t0};}
    catch(e){r={m,ok:false,err:e};aiLog(e.kind||"unknown",m,e.message)}
    results.push(r);put(row(r.ok,m,r.ok?`${r.ms} ms`:aiErrText(r.err)));
  }
  const good=results.filter(r=>r.ok).sort((x,y)=>(/lite/.test(x.m)-/lite/.test(y.m))||(cands.indexOf(x.m)-cands.indexOf(y.m)));
  if(good.length){CFG.ai.model=good[0].m;saveCfg();LAST_AI_ERR=null;
    h+=`<p style="color:var(--kuusi);margin-top:10px">✓ Opettaja ist erreichbar. Eingestellt: <b>${esc(good[0].m)}</b> (bestes erreichbares Modell). Fällt es aus, springen die anderen automatisch ein.</p>`}
  else{const kinds=results.map(r=>r.err&&r.err.kind);
    const tip=kinds.includes("quota-day")?"Das Gratis-Tageslimit ist bei allen Modellen aufgebraucht. Es setzt sich täglich um ca. 9 Uhr (österreichische Zeit) zurück. Bis dahin funktioniert alles ohne KI weiter.":
      kinds.includes("quota-min")?"Zu viele Anfragen in kurzer Zeit. Warte eine Minute und prüf dann nochmal.":
      kinds.includes("overload")?"Google ist gerade überlastet. Das ist meist nach wenigen Minuten vorbei.":
      kinds.includes("timeout")?"Die Verbindung ist sehr langsam. Probier es mit besserem Empfang oder WLAN.":"Unklarer Fehler – siehe Protokoll unten.";
    h+=`<p style="color:var(--puolukka);margin-top:10px">Kein Modell antwortet gerade.</p><p>${tip}</p>`}
  box.innerHTML=h+aiLogHTML();
}
function aiLogHTML(){const L=(CFG.aiLog||[]).filter(x=>x.kind!=="ok").slice(0,8);const okN=(CFG.aiLog||[]).filter(x=>x.kind==="ok").length;
  if(!L.length)return"";
  return`<details style="margin-top:10px"><summary class="muted">Letzte Probleme (${L.length})</summary>${L.map(x=>`<div class="setrow"><span><small>${new Date(x.t).toLocaleString("de-AT",{day:"numeric",month:"numeric",hour:"2-digit",minute:"2-digit"})} · ${esc(x.model||"")}</small></span><small>${esc(aiErrText(x))}</small></div>`).join("")}<p class="muted">Von den letzten ${(CFG.aiLog||[]).length} Anfragen waren ${okN} erfolgreich.</p></details>`}
/* Kurze KI-Antworten anzeigen: **fett**, *kursiv*, Zeilenumbrüche – alles andere bleibt Text */
function mdLite(s){return esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/(^|[^*])\*([^*\n]+?)\*/g,"$1<i>$2</i>").replace(/\n/g,"<br>")}
/* „Frag Opettaja“ in einer Übung. Vor dem Prüfen nur Hinweise (Lösung wird nicht verraten), danach volle Erklärung. */
function exDescribe(ex){
  if(ex.t==="mc")return`Multiple Choice: ${ex.q}\nOptionen: ${ex.o.join(" | ")}`;
  if(ex.t==="gap")return`Lückentext: ${ex.q}${ex.h?` (Hinweis: ${ex.h})`:""}`;
  if(ex.t==="tr")return`Übersetzung ${ex.dir==="de"?"Deutsch → Finnisch":"Finnisch → Deutsch"}: ${ex.q}`;
  if(ex.t==="ord")return`Satz ordnen (${ex.de}) aus den Wörtern: ${ex.w.join(" / ")}`;
  if(ex.t==="tab")return`Tabelle: ${ex.q}${ex.head?` (Spalten: ${ex.head.join(", ")})`:""}\n${ex.r.map(r=>r.map(c=>tabGap(c)?"___":c).join(" | ")).join("\n")}`;
  return promptText(ex)}
async function askExercise(){
  const se=SESSION;if(!se||se.kind!=="topic")return;const inp=$("#askexq"),box=$("#askexres");if(!inp||!box)return;
  const q=inp.value.trim();if(!q)return;
  if(!aiReady()){box.innerHTML=`<p class="muted">Opettaja ist noch nicht eingerichtet (Asetukset → „Cloud & KI einrichten“).</p>`;return}
  const ex=se.items[se.idx],checked=!!se.locked,t=T(se.id)||{title:se.title},last=checked?se.results[se.results.length-1]:null;
  const sol=ex.t==="tab"?tabGaps(ex).map(a=>a.join(" / ")).join(", "):ex.t==="gap"?ex.a.map(a=>ex.q.replace("___",a)).join(" | "):ex.t==="mc"?ex.o[ex.a]:ex.t==="ord"?ex.a:ex.a.join(" | ");
  const rule=checked?"Der Schüler hat die Aufgabe schon beantwortet. Erkläre vollständig und konkret, auch warum seine Antwort richtig oder falsch ist."
    :"Der Schüler hat die Aufgabe NOCH NICHT beantwortet. Verrate die Lösung NICHT – weder ganz noch teilweise, auch nicht die gesuchten Wortformen oder Endungen der Lösung. Erkläre stattdessen die Regel, gib Denkanstöße und Beispiele mit ANDEREN Wörtern.";
  box.innerHTML=`<p class="muted">Opettaja denkt nach ${dots()}</p>`;
  const meta={k:"frage"};
  try{
    const ans=await aiCall(TEACHER+" Antworte kurz (max. 120 Wörter) auf Deutsch, mit korrekten finnischen Beispielen. Verwende kein Markdown außer **fett**. "+rule,
      `Thema: ${t.title}\nAufgabe: ${exDescribe(ex)}\nMusterlösung (nur für dich): ${sol}${last?`\nAntwort des Schülers: ${last.user} (${last.correct?"richtig":"falsch"})`:""}\n\nFrage des Schülers: ${q}`,{meta});
    if(SESSION!==se)return;
    const aid=aiAudit("frage",meta,{q:`[Übung ${checked?"nach":"vor"} dem Prüfen] ${promptText(ex)} – Frage: ${q}`,sol,u:last?last.user:undefined,r:ans,rmax:900});
    box.innerHTML=`<div class="teacher" style="margin:10px 0 0"><p>${mdLite(ans)}</p>${flagLink(aid)}</div>`;inp.value="";
  }catch(e){if(SESSION===se)box.innerHTML=`<p class="muted">Opettaja nicht erreichbar: ${esc(aiErrShort())}. <a href="#" data-act="aidiag">Verbindung prüfen</a></p>`}
}
async function askTeacher(id){
  const q=$("#askq").value.trim(); if(!q)return; const t=T(id); const box=$("#askres");
  if(!aiReady()){box.innerHTML=`<p class="muted">Opettaja ist noch nicht eingerichtet. Unter Einstellungen → „Cloud & KI einrichten“ trägst du deinen kostenlosen Gemini-Schlüssel ein.</p>`;return}
  box.innerHTML=`<p class="muted">Opettaja denkt nach ${dots()}</p>`;
  try{
    const meta={k:"frage"};
    const ans=await aiCall(TEACHER+" Antworte kurz (max. 120 Wörter) auf Deutsch, mit korrekten finnischen Beispielen. Verwende kein Markdown außer **fett**.",
      `Aktuelles Thema: ${t.title}. Frage des Schülers: ${q}`,{meta});
    const aid=aiAudit("frage",meta,{q:`${t.id}: ${q}`,r:ans,rmax:900});
    box.innerHTML=`<div class="teacher" style="margin:12px 0 0"><p>${mdLite(ans)}</p>${flagLink(aid)}</div>`;
  }catch(e){box.innerHTML=`<p class="muted">Opettaja nicht erreichbar: ${esc(aiErrShort())}. <a href="#" data-act="aidiag">Verbindung prüfen</a></p>`}
}
