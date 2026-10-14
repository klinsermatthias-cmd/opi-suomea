/* Lern-Engine – ki.js: KI „Opettaja“: Anbieter (Gemini/OpenAI-kompatibel), Fehlerbehandlung, KI-Protokoll, Übungen.
   Prüfung der KI-Übungen und Analysen: ki-auswertung.js.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
/* ============================================================
   KI – OPETTAJA
   ============================================================ */
const TEACHER = APP.persona;
const SYS_JSON =
  TEACHER + " Antworte AUSSCHLIESSLICH mit gültigem JSON, ohne Text davor oder danach und ohne Markdown.";
/* KI-Anbieter: Google Gemini (kostenlos) oder ein OpenAI-kompatibler Dienst.
   Der Schlüssel liegt nur auf diesem Gerät.  */
const GEMINI_MODELS = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-flash-lite-latest", "gemini-2.5-flash-lite"];
function aiReady() {
  const a = CFG.ai || {};
  return !!(S && S.settings.ai && a.provider && a.provider !== "none" && a.key);
}
/* --- Fehler einordnen, merken und verständlich erklären --- */
let LAST_AI_ERR = null;
function aiErr(kind, msg, model) {
  const e = new Error(msg || kind);
  e.kind = kind;
  e.model = model || "";
  return e;
}
function aiLog(kind, model, msg, ms) {
  CFG.aiLog = [
    { t: Date.now(), kind, model: model || "", msg: String(msg || "").slice(0, 160), ms: ms || 0 },
    ...(CFG.aiLog || [])
  ].slice(0, 30);
  saveCfg();
}
/* Anbietername für Fehlermeldungen (E-1008-35): Gemini oder der Host des OpenAI-kompatiblen Dienstes */
function aiProvName() {
  const a = CFG.ai || {};
  if (a.provider !== "openai") return "Gemini";
  const h = String(a.baseUrl || "https://api.groq.com/openai/v1")
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .replace(/^(api|www)\./, "");
  return { "openrouter.ai": "OpenRouter", "groq.com": "Groq", "openai.com": "OpenAI", "mistral.ai": "Mistral" }[h] || h;
}
function aiErrText(e) {
  const k = (e && e.kind) || "unknown",
    p = aiProvName();
  const t =
    {
      offline: "kein Internet",
      timeout: p + " hat zu lange gebraucht",
      "quota-min": "zu viele Anfragen pro Minute – kurz warten",
      "quota-day":
        p === "Gemini"
          ? "Tageslimit von Gemini erreicht – setzt sich um ca. 9 Uhr zurück"
          : "Tageslimit von " + p + " erreicht",
      key: "API-Schlüssel ungültig oder gesperrt",
      overload: p + " ist gerade überlastet",
      empty: p + " hat keine verwertbare Antwort geliefert",
      net: "keine Verbindung zu " + (p === "Gemini" ? "Google" : p),
      setup: "KI nicht eingerichtet"
    }[k] || "unbekannter Fehler";
  /* Originalmeldung des Anbieters kurz anhängen, z. B. „402: Insufficient credits“ */
  const d = e && (e.detail || (k === "unknown" && (e.msg || e.message)));
  return d && d !== k ? t + " (" + String(d).slice(0, 80) + ")" : t;
}
function aiErrShort() {
  return LAST_AI_ERR ? aiErrText(LAST_AI_ERR) : "keine Verbindung";
}
/* Prüfen, Korrigieren und Übungen erzeugen nie mit den schwächeren „lite“-Modellen (E-1007-54) – fällt das gute
   Modell aus, gilt nur der Vergleich mit der Musterlösung */
const STRICT_KINDS = ["pruefung", "schreibaufgabe", "dialog", "uebungen", "schreiben", "rollenspiel", "hoeren"];
async function aiCall(system, user, opt = {}) {
  if (opt.meta && STRICT_KINDS.includes(opt.meta.k)) {
    opt.noLite = true;
    /* Prüfungen: höchstens ca. 40 s insgesamt (2 Modelle × 20 s), dann gilt der Vergleich mit der Musterlösung */
    if (!opt.timeout) opt.timeout = 20000;
  }
  const a = CFG.ai || {};
  if (!a.key || !a.provider || a.provider === "none") throw aiErr("setup");
  if (!navigator.onLine) {
    LAST_AI_ERR = aiErr("offline");
    throw LAST_AI_ERR;
  }
  const meta = opt.meta || {},
    t0 = Date.now();
  opt.usage = null;
  try {
    const r = await (a.provider === "openai" ? openaiCall(system, user, a, opt) : geminiCall(system, user, a, opt));
    LAST_AI_ERR = null;
    const u = opt.usage || {};
    meta.model = u.model || meta.model;
    if (u.fb) meta.fb = 1;
    meta.i = (meta.i || 0) + (u.i || 0);
    meta.o = (meta.o || 0) + (u.o || 0);
    meta.t = (meta.t || 0) + (u.t || 0);
    meta.ms = (meta.ms || 0) + Date.now() - t0;
    if (meta.k) aiStat(meta.k, u, Date.now() - t0, null);
    return r;
  } catch (e) {
    if (!e.kind) e.kind = "unknown";
    LAST_AI_ERR = e;
    aiLog(e.kind, e.model, e.message);
    if (meta.k) aiStat(meta.k, { model: e.model }, Date.now() - t0, e.kind);
    throw e;
  }
}
async function fetchT(url, opt, ms) {
  const c = new AbortController();
  const tm = setTimeout(() => c.abort(), ms);
  try {
    return await fetch(url, { ...opt, signal: c.signal });
  } catch (e) {
    throw aiErr(c.signal.aborted ? "timeout" : navigator.onLine ? "net" : "offline", e.message);
  } finally {
    clearTimeout(tm);
  }
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* Probiert die Modelle der Reihe nach. Jedes Modell hat ein eigenes Gratis-Kontingent –
   ist eines voll oder überlastet, springt das nächste ein. Die Ausweiche gilt nur vorübergehend (E-1007-38): ein
   ausgefallenes Modell wird für AI_DOWN_MS übersprungen (CFG.aiDown, nur dieses Gerät), danach wieder zuerst versucht.
   Das eingestellte Modell ändert sich dadurch nie (früher blieb nach einer einzigen Ausweiche das schwächere „lite“
   dauerhaft eingestellt). */
const AI_DOWN_MS = 15 * 60000;
function aiDownMark(m, kind) {
  if (!["quota-day", "quota-min", "overload", "timeout", "net"].includes(kind)) return;
  CFG.aiDown = CFG.aiDown || {};
  CFG.aiDown[m] = Date.now() + (kind === "quota-day" ? 6 * 3600e3 : AI_DOWN_MS);
  saveCfg();
}
/* Einmalige Korrektur: Hat die frühere Ausweiche ein „lite“-Modell als eingestellt hinterlassen → zurück zum besten */
if (CFG.ai && /lite/.test(CFG.ai.model || "") && !CFG.aiModelFix) {
  CFG.ai.model = GEMINI_MODELS[0];
  CFG.aiModelFix = 1;
  saveCfg();
}
async function geminiCall(system, user, a, opt = {}) {
  const down = CFG.aiDown || {},
    all = opt.only ? [a.model] : [a.model, ...GEMINI_MODELS].filter((m, i, arr) => m && arr.indexOf(m) === i),
    up = all.filter(m => !(down[m] > Date.now()) && !(opt.noLite && /lite/.test(m)));
  const models = up.length ? up : all.filter(m => !(opt.noLite && /lite/.test(m)));
  if (!models.length) throw aiErr("overload", "Kein geeignetes Modell verfügbar");
  const caps = CFG.aiCaps || (CFG.aiCaps = {});
  let worst = null;
  const rank = { "quota-day": 5, "quota-min": 4, overload: 3, timeout: 2, empty: 1, net: 1, unknown: 0 };
  const keep = e => {
    if (!worst || (rank[e.kind] || 0) >= (rank[worst.kind] || 0)) worst = e;
  };
  for (const m of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const cap = caps[m] || {};
      const gc = { temperature: opt.temp || 0.3, maxOutputTokens: 8192 };
      if (opt.json && !cap.noJson) gc.responseMimeType = "application/json";
      if (!cap.noThink) gc.thinkingConfig = { thinkingLevel: "low" };
      const t0 = Date.now();
      let res;
      try {
        res = await fetchT(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": a.key },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: system }] },
              contents: [{ role: "user", parts: [{ text: user }] }],
              generationConfig: gc
            })
          },
          opt.timeout || 30000
        );
      } catch (e) {
        e.model = m;
        if (e.kind === "offline") throw e;
        keep(e);
        /* hängendes Modell vorübergehend überspringen, sonst wartet jede Prüfung wieder (E-1007-65) */
        if (!opt.only) aiDownMark(m, e.kind);
        break;
      }
      if (res.ok) {
        const d = await res.json().catch(() => ({}));
        const c = d.candidates && d.candidates[0];
        const txt = ((c && c.content && c.content.parts) || [])
          .filter(p => !p.thought)
          .map(p => p.text || "")
          .join("")
          .trim();
        if (!txt) {
          keep(aiErr("empty", "Leere Antwort (" + ((c && c.finishReason) || "?") + ")", m));
          if (attempt === 0 && !cap.noThink) {
            continue;
          }
          break;
        }
        if (down[m]) {
          delete down[m];
          saveCfg();
        }
        aiLog("ok", m, "", Date.now() - t0);
        const um = d.usageMetadata || {};
        opt.usage = {
          model: m,
          fb: !!a.model && m !== a.model,
          i: um.promptTokenCount || 0,
          o: um.candidatesTokenCount || 0,
          t: um.thoughtsTokenCount || 0
        };
        return txt;
      }
      const j = await res.json().catch(() => ({}));
      const msg = (j.error && j.error.message) || "HTTP " + res.status;
      if (res.status === 400) {
        if (/thinking/i.test(msg) && !cap.noThink) {
          caps[m] = { ...cap, noThink: 1 };
          saveCfg();
          continue;
        }
        if (/mime|response_?mime/i.test(msg) && !cap.noJson) {
          caps[m] = { ...cap, noJson: 1 };
          saveCfg();
          continue;
        }
        if (/api key|api_key|API_KEY/i.test(msg)) throw aiErr("key", msg, m);
        keep(aiErr("unknown", msg, m));
        break;
      }
      if (res.status === 401 || res.status === 403) throw aiErr("key", msg, m);
      if (res.status === 404) {
        keep(aiErr("unknown", "Modell " + m + " nicht verfügbar", m));
        break;
      }
      if (res.status === 429) {
        const k = /per ?day|PerDay|daily/i.test(msg) ? "quota-day" : "quota-min";
        keep(aiErr(k, msg, m));
        if (!opt.only) aiDownMark(m, k);
        break;
      }
      if (res.status >= 500) {
        keep(aiErr("overload", msg, m));
        if (attempt < 1) {
          await sleep(1500);
          continue;
        }
        if (!opt.only) aiDownMark(m, "overload");
        break;
      }
      keep(aiErr("unknown", msg, m));
      break;
    }
  }
  throw worst || aiErr("unknown", "Kein Modell verfügbar");
}
async function openaiCall(system, user, a, opt = {}) {
  const res = await fetchT(
    (a.baseUrl || "https://api.groq.com/openai/v1").replace(/\/+$/, "") + "/chat/completions",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + a.key },
      body: JSON.stringify({
        model: a.model || "llama-3.3-70b-versatile",
        temperature: opt.temp || 0.3,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ]
      })
    },
    30000
  );
  if (!res.ok) {
    /* Originalmeldung des Dienstes behalten (E-1008-35) */
    let om = "";
    try {
      const j = await res.json();
      om = (j && j.error && (j.error.message || j.error)) || "";
    } catch (e) {}
    const det = res.status + (om ? ": " + String(om).slice(0, 70) : ""),
      ex = k => Object.assign(aiErr(k, "HTTP " + det, a.model), { detail: det });
    if (res.status === 429) throw ex("quota-min");
    if (res.status === 401 || res.status === 403) throw ex("key");
    if (res.status >= 500) throw ex("overload");
    throw ex("unknown");
  }
  const d = await res.json();
  const t = ((d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) || "").trim();
  if (!t) throw aiErr("empty", "Leere Antwort");
  const us = d.usage || {};
  opt.usage = {
    model: a.model || "llama-3.3-70b-versatile",
    i: us.prompt_tokens || 0,
    o: us.completion_tokens || 0,
    t: 0
  };
  return t;
}
/* Urteile nur als echtes Ja werten (S-1012-125): "false", "no" o. Ä. als Text zählten sonst als richtig */
function aiBools(o) {
  if (Array.isArray(o)) o.forEach(aiBools);
  else if (o && typeof o === "object")
    for (const k in o)
      if ((k === "correct" || k === "typo") && typeof o[k] !== "boolean") o[k] = o[k] === "true";
      else aiBools(o[k]);
  return o;
}
function parseJSON(txt) {
  const c = txt.replace(/```json|```/g, "").trim();
  return aiBools(JSON.parse(c.slice(c.indexOf("{"), c.lastIndexOf("}") + 1)));
}
/* temp: Zufälligkeit der Antwort – Standard 0,3 (verlässlich für Prüfen und Erklären); höher nur zum Ausdenken neuer
   Aufgaben, damit nicht jedes Mal dieselbe kommt */
async function aiJSON(prompt, meta, temp) {
  const txt = await aiCall(SYS_JSON, prompt, { json: true, meta, temp });
  try {
    return parseJSON(txt);
  } catch (e) {
    const t2 = await aiCall(
      SYS_JSON,
      prompt + "\n\nWICHTIG: Halte dich sehr kurz (insgesamt unter 120 Wörter), damit das JSON vollständig ist.",
      { json: true, meta, temp }
    );
    try {
      return parseJSON(t2);
    } catch (e2) {
      const er = aiErr("empty", "Antwort war kein gültiges JSON");
      LAST_AI_ERR = er;
      aiLog("empty", "", er.message);
      throw er;
    }
  }
}

/* Genaue Erklärungen (E-1007-40): Gemini begründete Urteile oft falsch („es fehlt hän“, obwohl es dastand) */
const EXPLAIN_RULE = () => {
  const t = typeof exTid === "function" ? T(exTid()) : null,
    teachesIt = SP.explainTopic && t && SP.explainTopic.test(t.title + " " + (t.th || ""));
  return `Begründung nur, wenn die Antwort falsch ist: Nenne den konkreten Unterschied zwischen Antwort und Lösung (welcher Buchstabe, welche Endung, welches Wort falsch ist oder fehlt) und prüfe, ob deine Begründung wirklich zur Antwort passt – behaupte nichts, was nicht stimmt. Ist die Antwort richtig, aber anders formuliert, sag kurz, dass beides geht. Beispiele nur mit Wörtern aus der Aufgabe oder einfachen, bekannten Wörtern${teachesIt ? "" : `; vermeide ${SP.explainAvoid || "Sonderfälle"}`}.`;
};
/* Gemeinsame Bewertungsregeln für alle Prüfungen (E-1007-51) – einheitliche Toleranz, keine erfundenen Regeln */
const JUDGE_RULES = (strict, base) =>
  `Bewertungsregeln: Gleichwertige Alternativen sind richtig, auch wenn sie nicht unter den Musterlösungen stehen. ${base ? `Die Antwort ist auf ${APP.base.name}: richtig ist sie, wenn sie den Sinn genau wiedergibt – eine natürliche, freiere Übersetzung ist richtig.` : SP.tolerance || ""} ${(!base && SP.caseRule) || "Groß-/Kleinschreibung und fehlende Satzzeichen zählen nicht."} Ein kleiner Tippfehler – genau ein Buchstabe falsch, fehlend, zu viel oder mit dem Nachbarn vertauscht –, der kein anderes Wort und keine andere Form ergibt, ist richtig (mit kurzem Hinweis); zwei oder mehr solche Fehler in einem Wort sind falsch. ${base ? "" : SP.judge.trim()}${strict && !base ? SP.strict : ""} Erfinde keine Regeln und begründe nur mit Regeln, die wirklich gelten. Im Zweifel ist die Antwort richtig. Eine Korrektur darf nie falscher sein als die Antwort und ändert nur, was wirklich falsch ist.`;
async function aiJudge(ex, user) {
  const t = { title: topicTitleNow() || "" };
  const kind =
    ex.t === "gap"
      ? "Lückentext"
      : ex.dir === "de"
        ? "Übersetzung " + APP.base.name + " → " + APP.target.name
        : "Übersetzung " + APP.target.name + " → " + APP.base.name;
  const sol = solutionText(ex);
  /* Lückentext: was in die Lücke gehört und wie der Satz mit der Eingabe aussieht (sonst „fehlt hän“-Begründungen) */
  const gapInfo =
    ex.t === "gap"
      ? `\nIn die Lücke gehört: ${ex.a.join(" | ")}\nSatz mit der Eingabe von ${APP.learner}: "${user.includes(" ") && norm(user).length > norm(ex.a[0]).length + 3 ? user : ex.q.replace("___", user)}"` +
        (ex.h ? `\nGesucht ist: ${ex.h}` : "") +
        (gapParts(ex)
          ? `\nEndungs-Lücke: Gesucht ist genau die Form der Musterlösung(en). Eine andere Endung (anderer Fall, andere Person, andere Zahl) ist falsch, auch wenn sie grammatisch möglich wäre – die Regeln zu gleichwertigen Alternativen und „im Zweifel richtig“ gelten hier nicht. Richtig ist nur dieselbe Form mit einem kleinen Tippfehler.`
          : `\nLückentext (E-1009-14): Verlangt ist dieselbe grammatische Form wie in der Musterlösung (gleicher Fall, gleiche Person, gleiche Zeit, gleiche Zahl). Eine andere, grammatisch mögliche Form ist falsch (z. B. Vergangenheit statt Gegenwart). Ein anderes Wort ist nur richtig, wenn es in genau dieser Form steht, in den Satz passt und zum Hinweis passt.`)
      : "";
  const p = `Thema: ${t.title}
Aufgabentyp: ${kind}
Aufgabe: ${promptText(ex)}
Musterlösung(en): ${sol}
Antwort von ${APP.learner}: "${user}"${gapInfo}

${JUDGE_RULES(exStrict(ex), baseAnswer(ex))} ${EXPLAIN_RULE()}
${WEAK_TAGS ? kindAsk().trim() + "\n" : ""}JSON: {"correct": true oder false, "feedback": "1–2 kurze Sätze auf ${APP.explain}: warum richtig/falsch", "correction": "die richtige Lösung"${WEAK_TAGS ? ", " + KIND_FIELD : ""}}`;
  const meta = { k: "pruefung" },
    j = await aiJSON(p, meta),
    f = !WEAK_TAGS || j.correct ? [] : weakKinds(j);
  j._aid = aiAudit("pruefung", meta, {
    q: `[${kind}] ${promptText(ex)}`,
    sol,
    u: user,
    ok: !!j.correct,
    r: `${j.correct ? "richtig" : "falsch"} – ${j.feedback || ""}${j.correction ? " | Korrektur: " + j.correction : ""}${weakText([], f)}`
  });
  weakNote("satz", exTid(), [], j._aid, exEi(), f);
  return j;
}

/* ---------- KI-Protokoll (für die Qualitätsprüfung durch Claude und die Token-Statistik) ----------
   S.aiStats[Gerät][Art] = Zähler (Aufrufe, Fehler, Token, Dauer, Modelle) – pro Gerät, damit sich beim Sync nichts doppelt zählt.
   S.aiStats[Gerät].mm[Modell] = Qualität je Modell über alle Aufrufe (E-1008-43): Aufrufe, Fehler, Token, Urteile
   richtig/falsch, von der/dem Lernenden als falsch markiert (⚑) – für den Vergleich von Modellen und Anbietern.
   S.aiAudit = die letzten Antworten mit Inhalt (max. 25 je Art, 150 gesamt; markierte bleiben bevorzugt, bis 50). */
const AI_KINDS = {
  pruefung: "Antwortprüfung",
  vokabel: "Vokabelprüfung",
  hoeren: "Hörverstehen",
  auswertung: "Rundenauswertung",
  analyse: "Gesamtanalyse",
  wort: "Wort nachschlagen",
  frage: "Frag " + APP.teacher,
  einstufung: "Einstufungstest",
  uebungen: "Neue Übungen",
  schreibaufgabe: "Schreibaufgabe (Prüfung)",
  dialog: "Dialog (Prüfung)",
  schreiben: "Freies Schreiben",
  rollenspiel: "Rollenspiel"
};
function devId() {
  if (!CFG.devId) {
    CFG.devId = Math.random().toString(36).slice(2, 10);
    saveCfg();
  }
  return CFG.devId;
}
function aiDev() {
  S.aiStats = S.aiStats || {};
  return S.aiStats[devId()] || (S.aiStats[devId()] = { since: Date.now(), k: {} });
}
/* Zähler je Modell (E-1008-43); m ohne „(Ausweiche)“ */
function aiModelStat(m, f, d = 1) {
  m = String(m || "").replace(/ \(Ausweiche\)$/, "");
  if (!m) return;
  const dv = aiDev(),
    mm = dv.mm || (dv.mm = {}),
    x = mm[m] || (mm[m] = { since: Date.now(), n: 0, err: 0, i: 0, o: 0, t: 0, ok: 0, bad: 0, flag: 0 });
  x[f] = Math.max(0, (x[f] || 0) + d);
}
function aiStat(k, u, ms, err) {
  const dv = aiDev();
  const s = dv.k[k] || (dv.k[k] = { n: 0, err: 0, i: 0, o: 0, t: 0, ms: 0, m: {} });
  if (err) {
    aiModelStat(u.model, "err");
    s.err++;
    s.ek = s.ek || {};
    s.ek[err] = (s.ek[err] || 0) + 1;
  } else {
    s.n++;
    s.i += u.i || 0;
    s.o += u.o || 0;
    s.t += u.t || 0;
    s.ms += ms;
    if (u.model) s.m[u.model] = (s.m[u.model] || 0) + 1;
    aiModelStat(u.model, "n");
    ["i", "o", "t"].forEach(f => aiModelStat(u.model, f, u[f] || 0));
  }
}
const cut = (x, n) => {
  x = typeof x === "string" ? x : JSON.stringify(x ?? "");
  return x.length > n ? x.slice(0, n - 1) + "…" : x;
};
function auditCap(list) {
  const by = list.slice().sort((a, b) => b.d - a.d),
    cnt = {},
    out = [];
  by.filter(e => e.flag)
    .slice(0, 50)
    .forEach(e => out.push(e));
  by.filter(e => !e.flag).forEach(e => {
    cnt[e.k] = (cnt[e.k] || 0) + 1;
    if (cnt[e.k] <= 25 && out.length < 150) out.push(e);
  });
  return out.sort((a, b) => b.d - a.d);
}
/* Einen Eintrag ablegen; Rückgabe = Eintrags-ID (für „KI lag falsch?“) */
function aiAudit(k, meta, f) {
  const e = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    d: Date.now(),
    k,
    m: (meta.model || "") + (meta.fb ? " (Ausweiche)" : ""),
    ms: meta.ms || 0,
    tok: [meta.i || 0, meta.o || 0, meta.t || 0],
    q: cut(f.q, 240),
    sol: f.sol != null ? cut(f.sol, 200) : undefined,
    u: f.u != null ? cut(f.u, f.umax || 160) : undefined,
    r: cut(f.r, f.rmax || 320),
    ok: f.ok
  };
  if (f.ok === true || f.ok === false) aiModelStat(e.m, f.ok ? "ok" : "bad");
  S.aiAudit = auditCap([e, ...(S.aiAudit || [])]);
  save();
  return e.id;
}
/* Schwächen nach Grammatikthema (E-1007-6): Beim Prüfen freier Antworten (Schreibaufgabe, Dialog, freies Schreiben,
   Rollenspiel) nennt die KI zu Fehlern die gelernten Themen, deren Regel verletzt wurde (z. B. Verneinung).
   Gesammelt in S.weak (max. 100, synchronisiert), sichtbar im KI-Protokoll und im Bericht, damit Claude die Zuordnung
   prüfen kann. Wiederholte Treffer ziehen das Thema vor (weakPlan, E-1008-22). Abschalten: WEAK_TAGS = false –
   gesammelte Einträge bleiben erhalten. */
const WEAK_TAGS = true;
/* S-1014-4 (Matthias): Fehlerarten – jede KI-Prüfung mit Fehler nennt zusätzlich die Art des Fehlers aus APP.errorKinds;
   passt keine, eine neue Bezeichnung „neu: …“ (die Liste wächst: Claude nimmt wiederkehrende neue Arten nach der
   Auswertung in APP.errorKinds auf). Gespeichert in S.weak (Feld f), im Bericht „WIEDERKEHRENDE FEHLERARTEN“ –
   getrennt nach Texten (Schreibaufgabe, Dialog, freies Schreiben, Rollenspiel) und Sätzen (Übersetzung, Lücke). */
const ERR_KINDS_DEFAULT = ["Wortstellung", "Endung/Fall", "Konjugation/Verbform", "Wortwahl", "Rechtschreibung"];
const errKinds = () => (Array.isArray(APP.errorKinds) && APP.errorKinds.length ? APP.errorKinds : ERR_KINDS_DEFAULT);
const KIND_FIELD = `"kinds": ["Art jedes Fehlers aus FEHLERARTEN (höchstens 3, wörtlich übernehmen); passt keine, eine neue kurze Bezeichnung (2–4 Wörter) mit „neu: “ davor; ohne Fehler leer"]`;
const kindAsk = () => `\nFEHLERARTEN: ${errKinds().join("; ")}`;
function weakKinds(j) {
  if (!j || !Array.isArray(j.kinds)) return [];
  const known = new Map(errKinds().map(k => [norm(k), k]));
  return [
    ...new Set(
      j.kinds
        .map(x => String(x || "").trim())
        .filter(Boolean)
        .map(x => {
          const raw = x.replace(/^neu\s*:\s*/i, "").trim();
          return known.get(norm(raw)) || "neu: " + cut(raw, 40);
        })
        .filter(x => x !== "neu: ")
    )
  ].slice(0, 3);
}
function weakAsk() {
  if (!WEAK_TAGS) return "";
  const L = TOPICS.filter(t => S.topics[t.id] && S.topics[t.id].status === "learning");
  return (
    (L.length ? `\nTHEMEN (gelernte Grammatikthemen): ${L.map(t => t.id + " " + t.title).join("; ")}` : "") + kindAsk()
  );
}
/* S-1014-9 (Simulation D-1014-22: KI nannte für Fehler ohne passendes Thema fast immer ein Nachbarthema) */
const WEAK_FIELD = `"topics": ["IDs aus THEMEN, deren Regel bei einem Fehler verletzt wurde – nur bei echten Grammatikfehlern, höchstens 3, sonst leer. Nur ein Thema nennen, dessen Theorie genau diese Regel lehrt; gibt es keins, leer lassen (die Fehlerart genügt)"], ${KIND_FIELD}`;
/* S-1014-10 (Simulation D-1014-23: Schreibaufgaben in Lernschritten wurden an aller Grammatik gemessen, nur 11–12 %
   beim ersten Versuch richtig): in einer Lernschritt-Runde zählt nur die Regel des Themas */
const inStep = () => !!(SESSION && SESSION.mode === "step");
const STEP_RULE = () =>
  SESSION && SESSION.mode === "step"
    ? ` LERNSCHRITT: ${APP.learner} lernt das Thema „${topicTitleNow()}“ gerade erst. Werte die Antwort nur dann als falsch, wenn sie gegen eine Regel dieses Themas verstößt oder die Aufgabe nicht erfüllt. Andere Fehler (andere Grammatik, Wortwahl, Rechtschreibung) verbesserst du in der Korrektur und nennst sie kurz, die Antwort zählt aber als richtig. Nenne in "kinds" trotzdem die Art jedes solchen Fehlers.`
    : "";
function weakTags(j) {
  if (!WEAK_TAGS || !j || !Array.isArray(j.topics)) return [];
  return [...new Set(j.topics.map(x => String(x).trim().split(/\s/)[0]))]
    .filter(id => T(id) && S.topics[id] && S.topics[id].status === "learning")
    .slice(0, 3);
}
const weakText = (g, f) =>
  (g.length ? " | Themen: " + g.join(", ") : "") + (f && f.length ? " | Fehlerarten: " + f.join(", ") : "");
/* Nur bei Fehlern merken; tid = Thema der Übung, g = von der KI genannte Themen, aid = Eintrag im KI-Protokoll,
   f = Fehlerarten (S-1014-4) */
function weakNote(k, tid, g, aid, ei, f, minor) {
  if (!g.length && !(f && f.length)) return;
  const x = { d: Date.now(), k, tid: tid || "", g, aid };
  if (f && f.length) x.f = f;
  /* S-1014-20: im Lernschritt nicht gewerteter Fehler (Antwort zählte als richtig) – nur Fehlerart, kein Vorziehen */
  if (minor) x.m = 1;
  if (ei >= 0) x.ei = ei;
  S.weak = [x, ...(S.weak || [])].slice(0, 100);
}
/* Treffer aus Übungen, die als „Noch nicht gelernt?“ gemeldet sind, zählen nicht (E-1009-3) */
const weakCounts = x => !(x.ei >= 0 && unlearnedOn(x.tid, x.ei));
function mergeWeak(L, R) {
  const seen = new Set();
  return [...(L || []), ...(R || [])]
    .filter(x => x && (seen.has(x.d + "|" + x.aid) ? false : seen.add(x.d + "|" + x.aid)))
    .sort((a, b) => b.d - a.d)
    .slice(0, 100);
}
/* Zählung je Thema der letzten 30 Tage; full = mit Beispielen aus dem KI-Protokoll (für den Bericht) */
function weakSummary(full) {
  const since = Date.now() - 30 * DAY,
    W = (S.weak || []).filter(x => x.d >= since && weakCounts(x)),
    by = {};
  W.forEach(x => x.g.forEach(id => (by[id] = by[id] || []).push(x)));
  const ids = Object.keys(by).sort((a, b) => by[b].length - by[a].length);
  if (!ids.length) return "";
  const kinds = {
    schreibaufgabe: "Schreibaufgabe",
    dialog: "Dialog",
    schreiben: "Schreiben",
    rollenspiel: "Rollenspiel"
  };
  return ids
    .map(id => {
      const L = by[id],
        n = {};
      L.forEach(x => (n[kinds[x.k] || x.k] = (n[kinds[x.k] || x.k] || 0) + 1));
      let line = `- ${id} ${(T(id) || {}).title || ""}: ${L.length}× (${Object.entries(n)
        .map(([k, v]) => k + " " + v)
        .join(", ")})`;
      if (full)
        line += L.slice(0, 3)
          .map(x => {
            const a = (S.aiAudit || []).find(e => e.id === x.aid);
            return a ? `\n    · [${x.tid}] „${cut(a.u || "", 120)}“ → ${cut(a.r || "", 160)}` : "";
          })
          .join("");
      return line;
    })
    .join("\n");
}
function weakReport() {
  const w = weakSummary(true);
  if (!w) return "";
  const wp = weakPlan(),
    moved = Object.keys(wp).filter(id => wp[id].moved);
  return `\n\nSCHWÄCHEN NACH THEMA (KI-Zuordnung der letzten 30 Tage – bitte prüfen, ob sie stimmt):\n${w}${
    moved.length
      ? `\n→ deshalb vorgezogen: ${moved.map(id => `${id} ${wp[id].n}× (${fmtDate(wp[id].due)})`).join(", ")}`
      : weakPlanOn()
        ? ""
        : "\n→ Vorziehen ist ausgeschaltet"
  }`;
}
/* S-1014-4: wiederkehrende Fehlerarten der letzten 30 Tage – Anzahl, Texte/Sätze, Trend (letzte 15 Tage gegenüber den
   15 davor), Beispiele; neue Arten („neu: …“) markiert, damit Claude sie in APP.errorKinds aufnimmt bzw. Themen plant */
const TEXT_KINDS = ["schreibaufgabe", "dialog", "schreiben", "rollenspiel"];
function kindSummary(full) {
  const now = Date.now(),
    since = now - 30 * DAY,
    half = now - 15 * DAY,
    W = (S.weak || []).filter(x => x.d >= since && weakCounts(x) && Array.isArray(x.f) && x.f.length),
    by = {};
  W.forEach(x => x.f.forEach(k => (by[k] = by[k] || []).push(x)));
  const ks = Object.keys(by).sort((a, b) => by[b].length - by[a].length);
  return ks
    .map(k => {
      const L = by[k],
        txt = L.filter(x => TEXT_KINDS.includes(x.k)).length,
        neu = L.filter(x => x.d >= half).length,
        alt = L.length - neu,
        tr = neu > alt ? "↑" : neu < alt ? "↓" : "→";
      const mi = L.filter(x => x.m).length;
      let line = `- ${k}${/^neu: /.test(k) ? " (noch nicht in der Liste)" : ""}: ${L.length}× (Texte ${txt}, Sätze ${L.length - txt}${mi ? `; davon ${mi} im Lernschritt nicht gewertet` : ""}) ${tr}`;
      if (full)
        line += L.slice(0, 2)
          .map(x => {
            const a = (S.aiAudit || []).find(e => e.id === x.aid);
            return a ? `\n    · [${x.tid}] „${cut(a.u || "", 100)}“ → ${cut(a.r || "", 140)}` : "";
          })
          .join("");
      return line;
    })
    .join("\n");
}
function kindReport() {
  const s = kindSummary(true);
  return s
    ? `\n\nWIEDERKEHRENDE FEHLERARTEN (30 Tage, S-1014-4; Trend ↑/↓ = letzte 15 Tage mehr/weniger als davor; „neu“ = bitte in APP.errorKinds aufnehmen, bei Häufung Thema vorziehen oder neues Thema planen):\n${s}`
    : "";
}
/* Schwächen wirken auf den Plan (E-1008-22, Idee E-1007-8): Nennt die KI ein gelerntes Thema seit dessen letzter
   Runde mindestens WEAK_PLAN_N-mal (Treffer der letzten WEAK_PLAN_DAYS Tage), kommt es spätestens WEAK_PLAN_GAP Tage
   nach dem entscheidenden Treffer dran – höchstens WEAK_PLAN_MAX Themen zugleich (wer zuerst kommt; S-1008-16).
   Nur vorziehen, nie nach hinten schieben. Gespeichert wird nichts: Der Termin ergibt sich aus S.weak und dem Verlauf
   (beides wird synchronisiert) und ist daher auf allen Geräten gleich. Nach der nächsten Runde des Themas zählen die
   alten Treffer nicht mehr – es gilt wieder der normale Plan. Abschalten: Einstellungen → „Schwächen vorziehen“. */
const WEAK_PLAN_N = 2,
  WEAK_PLAN_DAYS = 14,
  WEAK_PLAN_GAP = 2,
  WEAK_PLAN_MAX = 3;
const weakPlanOn = () => WEAK_TAGS && !!S && S.settings.weakPlan !== false;
function weakPlan() {
  const out = {};
  if (!weakPlanOn()) return out;
  /* Treffer und Runden der letzten WEAK_PLAN_DAYS Tage in zeitlicher Reihenfolge nachspielen (S-1008-16): Ein Thema
     bekommt beim WEAK_PLAN_N-ten Treffer seit seiner letzten Runde einen Platz, wenn einer frei ist, sonst wartet es.
     Den Platz behält es bis zu seiner nächsten Runde – später stärkere Themen verdrängen es nicht. Wird ein Platz frei,
     rückt das am längsten wartende Thema nach; sein Termin zählt dann ab diesem Zeitpunkt. */
  const since = Date.now() - WEAK_PLAN_DAYS * DAY,
    ev = [];
  (S.weak || []).forEach(x => {
    if (!x || !(x.d >= since) || !Array.isArray(x.g) || !weakCounts(x)) return;
    new Set(x.g).forEach(id => {
      const s = S.topics[id];
      if (s && s.status === "learning") ev.push({ d: x.d, id, hit: true });
    });
  });
  new Set(ev.map(e => e.id)).forEach(id =>
    (S.topics[id].hist || []).forEach(h => h && h.d >= since && ev.push({ d: h.d, id, hit: false }))
  );
  ev.sort((a, b) => a.d - b.d || a.hit - b.hit);
  const n = {},
    last = {},
    wait = [],
    admit = (id, t) => {
      const d = new Date(t);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + WEAK_PLAN_GAP);
      out[id] = { due: d.getTime() };
    };
  ev.forEach(e => {
    if (!e.hit) {
      n[e.id] = 0;
      const w = wait.indexOf(e.id);
      if (w >= 0) wait.splice(w, 1);
      if (out[e.id]) {
        delete out[e.id];
        if (wait.length) admit(wait.shift(), e.d);
      }
      return;
    }
    n[e.id] = (n[e.id] || 0) + 1;
    last[e.id] = e.d;
    if (out[e.id] || wait.includes(e.id) || n[e.id] < WEAK_PLAN_N) return;
    if (Object.keys(out).length < WEAK_PLAN_MAX) admit(e.id, e.d);
    else wait.push(e.id);
  });
  for (const id in out) {
    const s = S.topics[id];
    Object.assign(out[id], { n: n[id], last: last[id], moved: !s.due || out[id].due < s.due });
  }
  return out;
}
/* Schwächen-Treffer eines Themas in den letzten days Tagen (S-1014-7: begrenzt den Abstand des Plans) */
function weakHits(id, days) {
  const since = Date.now() - days * DAY;
  return (S.weak || []).filter(x => x && x.d >= since && Array.isArray(x.g) && x.g.includes(id) && weakCounts(x))
    .length;
}
/* Termin eines Themas mit Schwächen-Vorzug; wp = weakPlan() (bei vielen Themen einmal berechnen und mitgeben) */
function topicDue(id, wp) {
  const w = (wp || weakPlan())[id];
  return w && w.moved ? w.due : (S.topics[id] || {}).due;
}
/* Grund für die Anzeige – nur wenn der Vorzug den Termin tatsächlich verändert hat */
function weakPlanText(id, wp) {
  const w = (wp || weakPlan())[id];
  return w && w.moved
    ? `Vorgezogen: In freien Antworten (Schreiben, Dialog, Rollenspiel) hast du seit der letzten Runde ${w.n}× Fehler zu diesem Thema gemacht.`
    : "";
}
function flagLink(aid, label) {
  return aid
    ? `<p class="aiflagp"><a href="#" class="aiflag" data-act="aiflag" data-id="${esc(aid)}">${label || "KI lag falsch?"}</a></p>`
    : "";
}

/* Grundlagen = die Grundthemen der App (BASE_TOPICS); hat eine App keine (Deutsch-Trainer: alles aus Lektionen),
   gelten die ersten 6 Themen. Ohne Themen sind die Grundlagen nie „sicher“. */
function basicIds() {
  return (BASE_TOPICS.length ? BASE_TOPICS : TOPICS.slice(0, 6)).map(t => t.id);
}
/* Sitzt ein Grundthema? Letztes Ergebnis ≥ 80 % und entweder ≥ 2 Themen-Wiederholungen oder – weil gut gekonnte
   Themen lange Abstände bekommen – genug Übungen dieses Themas in anderen Runden (gemischt, Langzeit-Check, Extra):
   mindestens 8 Versuche mit höchstens 20 % Fehlern (E-1007-35) */
function topicEvidence(id) {
  let n = 0,
    w = 0;
  for (const k in S.exLog || {})
    if (k.startsWith(id + ":")) {
      n += S.exLog[k].n || 0;
      w += S.exLog[k].w || 0;
    }
  return { n, w };
}
function basicSolid(id) {
  const s = S.topics[id];
  if (!s || s.status !== "learning" || (s.last || 0) < 0.8) return false;
  if ((s.reps || 0) >= 2) return true;
  const e = topicEvidence(id);
  return e.n >= 8 && e.w / e.n <= 0.2;
}
function basicsStatus() {
  const ids = basicIds();
  const solid = ids.filter(basicSolid).length;
  return { solid, total: ids.length, ok: ids.length > 0 && solid === ids.length };
}
function genUnlocked() {
  return !!(S.genUnlock && S.genUnlock.on);
}
/* S-1013-48 (Matthias): neue Übungen von der KI je Thema schon, sobald dieses Thema sitzt (zuletzt ≥ 80 % und
   gefestigt wie basicSolid) – nicht erst, wenn alle Grundlagen sitzen. Geprüft werden sie weiter von Claude. */
function genUnlockedFor(id) {
  return genUnlocked() || basicSolid(id);
}
function genSolidTopics() {
  return learningTopics().filter(t => basicSolid(t.id));
}
/* Theorie eines Themas als reiner Text (für KI-Aufträge), gekürzt. Statt einfach den Anfang zu nehmen (oft Situation
   und Landeskunde), werden die Regel-Teile bevorzugt: Regel-Kästen, Tabellen, „Typischer Fehler“; Tipps und die
   Situationsbeschreibung zuletzt. Ausgabe in der ursprünglichen Reihenfolge (E-1007-55). */
function theoryText(t, max) {
  const plain = x =>
    String(x || "")
      .replace(/<\/(td|th)>/g, " ")
      .replace(/<\/tr>/g, "; ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const parts = String(t.th || "").split(/(?=<(?:p|h3|h4|table|ul|ol|div)[\s>])/i);
  const blocks = [];
  parts.forEach(p => {
    if (/^<h[34]/i.test(p) && blocks.length >= 0) blocks.push({ h: plain(p), x: "" });
    else if (blocks.length && blocks[blocks.length - 1].h && !blocks[blocks.length - 1].x)
      blocks[blocks.length - 1].x = p;
    else blocks.push({ h: "", x: p });
  });
  const sc = b => {
    const raw = b.x + " " + b.h;
    let v = 0;
    if (/class="rule"/i.test(raw)) v += 5;
    if (/regel|merke|achtung|fehler|endung|form|konjug|tabelle/i.test(plain(raw))) v += 2;
    if (/<table/i.test(raw)) v += 1;
    if (/class="tip"/i.test(raw)) v -= 2;
    if (/^<p>\s*Situation/i.test(b.x)) v -= 1;
    return v;
  };
  const items = blocks.map((b, i) => ({ i, t: plain((b.h ? b.h + ": " : "") + b.x), v: sc(b) })).filter(b => b.t);
  const chosen = new Set();
  let len = 0;
  [...items]
    .sort((a, b) => b.v - a.v || a.i - b.i)
    .forEach(b => {
      if (len + b.t.length + 1 <= max) {
        chosen.add(b.i);
        len += b.t.length + 1;
      }
    });
  const out = items
    .filter(b => chosen.has(b.i))
    .map(b => b.t)
    .join(" ");
  return out || plain(t.th).slice(0, max);
}
/* E-1009-21: von Claude als falsch bestätigte KI-Übungen dieses Themas (✗ in lektionen/ki-pruefung.json), die
   jüngsten 5 mit Korrektur und Grund – kommen in den Auftrag, damit Opettaja denselben Fehler nicht wiederholt */
function genWrongFor(id, n = 5) {
  return (S.genReview || [])
    .filter(x => x.topic === id)
    .sort((a, b) => b.d - a.d)
    .flatMap(x => x.ex.map(e => ({ e, v: (x.v || {})[e.gid] })).filter(o => o.v && !o.v.ok))
    .slice(0, n)
    .map(
      ({ e, v }) =>
        `- ${cut(promptText(e), 90)} → deine Lösung: ${cut(expectedText(e), 60)}; richtig: ${cut(v.korrektur || "?", 60)}${v.grund ? " (" + cut(v.grund, 120) + ")" : ""}`
    );
}
async function aiGenerate(t) {
  /* Wörter des Themas und seiner (auch indirekten) Voraussetzungen – wie beim freien Üben (E-1008-13, vorher alle
     gelernten Wörter: der größte Teil des Auftrags) */
  const voc = knownWords(t).join("; ");
  const weak =
    S.errors
      .filter(e => e.topic === t.id && !e.ok)
      .slice(0, 6)
      .map(e => `- ${e.q} (richtig: ${e.exp})`)
      .join("\n") || "keine";
  const theory = theoryText(t, 1800);
  const wrong = genWrongFor(t.id);
  /* vorhandene Aufgaben mitschicken, damit Opettaja sie nicht wiederholt (nur die Aufgabentexte, gekürzt) */
  const known = t.ex
    .map(promptText)
    .slice(0, 20)
    .map(x => "- " + String(x).slice(0, 80))
    .join("\n");
  const p = `Erstelle 7 NEUE Übungen zum Thema „${t.title}“ (${t.lvl}). Weder die Sätze aus der Theorie noch die vorhandenen Übungen wiederholen – neue Sätze, gleiche Grammatik. Ziel ist Verständnis, nicht Auswendiglernen.
Theorie (Auszug): ${theory}
Vorhandene Übungen (NICHT wiederholen, auch nicht leicht umformuliert):
${known}
WORTLISTE – Wörter dieses Themas und seiner Voraussetzungen, die ${APP.learner} kennt: ${voc}
${WORD_ONLY}
Aktuelle Fehler von ${APP.learner} in diesem Thema:
${weak}
${wrong.length ? `Von Claude geprüft und FALSCH – frühere Übungen von dir zu diesem Thema (diese Fehler NICHT wiederholen):\n${wrong.join("\n")}\n` : ""}
Mische (S-1013-48: vor allem längere Eingabe-Aufgaben, kein Wiedererkennen): 1× "luk" (kurzer zusammenhängender Text oder Mini-Dialog mit 3–5 Lücken), 1× "gap", 2× "tr" (dir "de" = ${APP.base.name}→${APP.target.name}, ganze Sätze mit mindestens 4 Wörtern), 1× "tr" (dir "fi" = ${APP.target.name}→${APP.base.name}), 1× "tab", 1× "mc" als REGELFRAGE (wann/wofür/bei welchen Wörtern gilt die Regel – neu formuliert und mit anderen Beispielwörtern als in der Theorie, mit kurzer Erklärung in "x"). Wo das Format missverständlich sein könnte, einen Hinweis "h" angeben (Hinweise "h" und Erklärungen "x" auf ${APP.explain}) (z. B. „nur die Endung eintippen“, bei Tabellen: was jedes Kästchen bedeutet). Alle ${APP.target.adj}en Formen müssen korrekt sein.
Formate:
${APP.genExamples}  (Lücken in [eckigen Klammern], Alternativen mit |)
{"t":"luk","q":"Ergänze den Text.","h":"was in jedes Kästchen kommt","txt":["Satz mit [Lücke] …","nächster Satz mit [Lücke|Alternative] …"]}
{"t":"mc","q":"Bei welchem Verb verwendet man …?","o":["richtig","falsch","falsch","falsch"],"a":0,"x":"kurze Erklärung der Regel"}
JSON: {"ex":[ … ]}`;
  const meta = { k: "uebungen" },
    j = await aiJSON(p, meta);
  const ok = (j.ex || []).filter(validEx);
  ok._aid = aiAudit("uebungen", meta, {
    q: `${t.id} ${t.title}: 7 neue Übungen`,
    r: JSON.stringify(j.ex || []),
    rmax: 2400,
    ok: ok.length === (j.ex || []).length
  });
  return ok;
}
/* ---------- Verbindungs-Check für Opettaja ---------- */
async function aiDiagnose() {
  const box = $("#aidiagbox");
  if (!box) return;
  const a = CFG.ai || {};
  const row = (ok, t, d) =>
    `<div class="setrow"><span>${ok === null ? "…" : ok ? "✓" : "✗"} ${t}</span><small>${d || ""}</small></div>`;
  let h = "";
  const put = x => {
    h += x;
    box.innerHTML = h + `<p class="muted">Prüfe ${dots()}</p>`;
  };
  put(row(navigator.onLine, "Internet", navigator.onLine ? "verbunden" : "offline – bitte WLAN/Daten prüfen"));
  if (!navigator.onLine) {
    box.innerHTML = h;
    return;
  }
  if (!S.settings.ai) {
    box.innerHTML = h + row(false, APP.teacher, "ist in den Einstellungen ausgeschaltet");
    return;
  }
  if (!a.key || !a.provider || a.provider === "none") {
    box.innerHTML = h + row(false, "KI-Schlüssel", "fehlt – unter „Cloud & KI einrichten“ eintragen");
    return;
  }
  if (a.provider === "openai") {
    try {
      const t0 = Date.now();
      await openaiCall("Antworte mit OK.", "Test", a);
      box.innerHTML = h + row(true, "Anbieter", `antwortet (${Date.now() - t0} ms)`);
    } catch (e) {
      box.innerHTML = h + row(false, "Anbieter", aiErrText(e));
    }
    return;
  }
  // Schlüssel + verfügbare Modelle
  let avail = [];
  try {
    const r = await fetchT(
      "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200",
      { headers: { "x-goog-api-key": a.key } },
      15000
    );
    if (r.status === 400 || r.status === 401 || r.status === 403) {
      box.innerHTML =
        h +
        row(
          false,
          "API-Schlüssel",
          "ungültig – auf aistudio.google.com einen neuen erstellen und unter „Cloud & KI einrichten“ eintragen"
        );
      return;
    }
    if (!r.ok) throw aiErr(r.status >= 500 ? "overload" : "unknown", "HTTP " + r.status);
    const d = await r.json();
    avail = (d.models || [])
      .filter(m => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map(m => m.name.replace(/^models\//, ""));
    put(row(true, "API-Schlüssel", "gültig"));
  } catch (e) {
    box.innerHTML = h + row(false, "Google erreichbar", aiErrText(e));
    return;
  }
  const flash = avail.filter(m => /flash/i.test(m) && !/image|tts|audio|live|exp|preview/i.test(m));
  const cands = [...GEMINI_MODELS, ...flash]
    .filter((m, i, arr) => arr.indexOf(m) === i && (avail.includes(m) || GEMINI_MODELS.includes(m)))
    .slice(0, 7);
  const results = [];
  for (const m of cands) {
    const t0 = Date.now();
    let r;
    try {
      const txt = await geminiCall(
        "Antworte nur mit dem Wort OK.",
        "Test",
        { ...a, model: m },
        { timeout: 20000, only: true }
      );
      r = { m, ok: true, ms: Date.now() - t0 };
    } catch (e) {
      r = { m, ok: false, err: e };
      aiLog(e.kind || "unknown", m, e.message);
    }
    results.push(r);
    put(row(r.ok, m, r.ok ? `${r.ms} ms` : aiErrText(r.err)));
  }
  const good = results
    .filter(r => r.ok)
    .sort((x, y) => /lite/.test(x.m) - /lite/.test(y.m) || cands.indexOf(x.m) - cands.indexOf(y.m));
  if (good.length) {
    CFG.ai.model = good[0].m;
    saveCfg();
    LAST_AI_ERR = null;
    h += `<p style="color:var(--kuusi);margin-top:10px">✓ ${APP.teacher} ist erreichbar. Eingestellt: <b>${esc(good[0].m)}</b> (bestes erreichbares Modell). Fällt es aus, springen die anderen automatisch ein.</p>`;
  } else {
    const kinds = results.map(r => r.err && r.err.kind);
    const tip = kinds.includes("quota-day")
      ? "Das Gratis-Tageslimit ist bei allen Modellen aufgebraucht. Es setzt sich täglich um ca. 9 Uhr (österreichische Zeit) zurück. Bis dahin funktioniert alles ohne KI weiter."
      : kinds.includes("quota-min")
        ? "Zu viele Anfragen in kurzer Zeit. Warte eine Minute und prüf dann nochmal."
        : kinds.includes("overload")
          ? "Google ist gerade überlastet. Das ist meist nach wenigen Minuten vorbei."
          : kinds.includes("timeout")
            ? "Die Verbindung ist sehr langsam. Probier es mit besserem Empfang oder WLAN."
            : "Unklarer Fehler – siehe Protokoll unten.";
    h += `<p style="color:var(--puolukka);margin-top:10px">Kein Modell antwortet gerade.</p><p>${tip}</p>`;
  }
  box.innerHTML = h + aiLogHTML();
}
function aiLogHTML() {
  const L = (CFG.aiLog || []).filter(x => x.kind !== "ok").slice(0, 8);
  const okN = (CFG.aiLog || []).filter(x => x.kind === "ok").length;
  if (!L.length) return "";
  return `<details style="margin-top:10px"><summary class="muted">Letzte Probleme (${L.length})</summary>${L.map(x => `<div class="setrow"><span><small>${new Date(x.t).toLocaleString(APP.locale, { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })} · ${esc(x.model || "")}</small></span><small>${esc(aiErrText(x))}</small></div>`).join("")}<p class="muted">Von den letzten ${(CFG.aiLog || []).length} Anfragen waren ${okN} erfolgreich.</p></details>`;
}
/* Kurze KI-Antworten anzeigen: **fett**, *kursiv*, Zeilenumbrüche – alles andere bleibt Text */
function mdLite(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/(^|[^*])\*([^*\n]+?)\*/g, "$1<i>$2</i>")
    .replace(/\n/g, "<br>");
}
/* „Frag Opettaja“ in einer Übung. Vor dem Prüfen nur Hinweise (Lösung wird nicht verraten), danach volle Erklärung. */
function exDescribe(ex) {
  return FMT[ex.t] ? FMT[ex.t].describe(ex) : promptText(ex);
}
async function askExercise() {
  const se = SESSION;
  if (se && se.kind === "vocab") return askVocab();
  if (!se || se.kind !== "topic") return;
  const inp = $("#askexq"),
    box = $("#askexres");
  if (!inp || !box) return;
  const q = inp.value.trim();
  if (!q) return;
  if (!aiReady()) {
    box.innerHTML = `<p class="muted">${APP.teacher} ist noch nicht eingerichtet (${SET_NAME} → „Cloud & KI einrichten“).</p>`;
    return;
  }
  const ex = se.items[se.idx],
    checked = !!se.locked,
    t = T(exTid()) || T(se.id) || { title: se.title },
    last = checked ? se.results[se.results.length - 1] : null;
  const sol = solutionText(ex);
  const rule = checked
    ? `${APP.learner} hat die Aufgabe schon beantwortet. Erkläre vollständig und konkret, auch warum die Antwort richtig oder falsch ist. ${EXPLAIN_RULE()}`
    : APP.learner +
      " hat die Aufgabe NOCH NICHT beantwortet. Verrate die Lösung NICHT – weder ganz noch teilweise, auch nicht die gesuchten Wortformen oder Endungen der Lösung. Erkläre stattdessen die Regel, gib Denkanstöße und Beispiele mit ANDEREN Wörtern – nur einfache, bekannte Wörter, keine " +
      (SP.explainAvoid || "Sonderfälle") +
      ".";
  box.innerHTML = `<p class="muted">${APP.teacher} denkt nach ${dots()}</p>`;
  const meta = { k: "frage" };
  try {
    const ans = await aiCall(
      TEACHER +
        " Antworte kurz (max. 120 Wörter) auf " +
        APP.explain +
        ", mit korrekten " +
        APP.target.adj +
        "en Beispielen. Verwende kein Markdown außer **fett**. " +
        rule,
      `Thema: ${t.title}\nTheorie (Auszug): ${t.th ? theoryText(t, 500) : "–"}\nAufgabe: ${exDescribe(ex)}\nMusterlösung (nur für dich): ${sol}${last ? `\nAntwort von ${APP.learner}: ${last.user} (${last.correct ? "richtig" : "falsch"})` : ""}\n\nFrage von ${APP.learner}: ${q}`,
      { meta }
    );
    if (SESSION !== se) return;
    const aid = aiAudit("frage", meta, {
      q: `[Übung ${checked ? "nach" : "vor"} dem Prüfen] ${promptText(ex)} – Frage: ${q}`,
      sol,
      u: last ? last.user : undefined,
      r: ans,
      rmax: 900
    });
    box.innerHTML = `<div class="teacher" style="margin:10px 0 0"><p>${mdLite(ans)}</p>${flagLink(aid)}</div>`;
    inp.value = "";
  } catch (e) {
    if (SESSION === se)
      box.innerHTML = `<p class="muted">${APP.teacher} nicht erreichbar: ${esc(aiErrShort())}. <a href="#" data-act="aidiag">Verbindung prüfen</a></p>`;
  }
}
/* „Frag Opettaja“ auf der Vokabelkarte (nach dem Aufdecken): Bedeutung, Beispielsatz, Grundform, Merkhilfe … */
async function askVocab() {
  const se = SESSION,
    id = se && se.queue[0],
    w = id && cardWord(id);
  const inp = $("#askexq"),
    box = $("#askexres");
  if (!w || !inp || !box) return;
  const q = inp.value.trim();
  if (!q) return;
  if (!aiReady()) {
    box.innerHTML = `<p class="muted">${APP.teacher} ist noch nicht eingerichtet (${SET_NAME} → „Cloud & KI einrichten“).</p>`;
    return;
  }
  box.innerHTML = `<p class="muted">${APP.teacher} denkt nach ${dots()}</p>`;
  const meta = { k: "frage" },
    dirL = se.dir === "fi" ? APP.target.name + " → " + APP.base.name : APP.base.name + " → " + APP.target.name;
  try {
    const ans = await aiCall(
      TEACHER +
        " Antworte kurz (max. 120 Wörter) auf " +
        APP.explain +
        ", mit korrekten " +
        APP.target.adj +
        "en Beispielen. Verwende kein Markdown außer **fett**. Die Lösung der Karte ist schon aufgedeckt – du darfst sie frei erklären (z. B. Grundform, Beispielsatz, Merkhilfe, Unterschied zu ähnlichen Wörtern).",
      `Keine erfundenen Wortherkünfte; eine Merkhilfe als Eselsbrücke kennzeichnen. Beispielsätze nur einfach und korrekt.\nVokabelkarte (${dirL}): ${APP.target.name} „${w[0]}“ = ${APP.base.name} „${w[1]}“${se.typed ? `\nEingabe von ${APP.learner}: „${se.typed}“` : ""}\n\nFrage von ${APP.learner}: ${q}`,
      { meta }
    );
    if (SESSION !== se || se.queue[0] !== id) return;
    const aid = aiAudit("frage", meta, {
      q: `[Vokabel ${w[0]} = ${w[1]}] – Frage: ${q}`,
      u: se.typed || undefined,
      r: ans,
      rmax: 900
    });
    box.innerHTML = `<div class="teacher" style="margin:10px 0 0"><p>${mdLite(ans)}</p>${flagLink(aid)}</div>`;
    inp.value = "";
  } catch (e) {
    if (SESSION === se && se.queue[0] === id)
      box.innerHTML = `<p class="muted">${APP.teacher} nicht erreichbar: ${esc(aiErrShort())}. <a href="#" data-act="aidiag">Verbindung prüfen</a></p>`;
  }
}
async function askTeacher(id) {
  const q = $("#askq").value.trim();
  if (!q) return;
  const t = T(id) || { id, title: id === "pt" ? "Einstufungstest" : "Allgemein" };
  const box = $("#askres");
  if (!aiReady()) {
    box.innerHTML = `<p class="muted">${APP.teacher} ist noch nicht eingerichtet. Unter Einstellungen → „Cloud & KI einrichten“ trägst du deinen kostenlosen Gemini-Schlüssel ein.</p>`;
    return;
  }
  box.innerHTML = `<p class="muted">${APP.teacher} denkt nach ${dots()}</p>`;
  try {
    const meta = { k: "frage" };
    const ans = await aiCall(
      TEACHER +
        " Antworte kurz (max. 120 Wörter) auf " +
        APP.explain +
        ", mit korrekten " +
        APP.target.adj +
        "en Beispielen. Verwende kein Markdown außer **fett**.",
      `Aktuelles Thema: ${t.title} (${t.lvl || ""}).\nTheorie (Auszug): ${theoryText(t, 500) || "–"}\nBeantworte die Frage mit dem, was ${APP.learner} schon gelernt hat; Weiterführendes nur kurz als Ausblick kennzeichnen. Nenne nur Regeln, die wirklich gelten – erfinde nichts.\n\nFrage von ${APP.learner}: ${q}`,
      { meta }
    );
    const aid = aiAudit("frage", meta, { q: `${t.id}: ${q}`, r: ans, rmax: 900 });
    box.innerHTML = `<div class="teacher" style="margin:12px 0 0"><p>${mdLite(ans)}</p>${flagLink(aid)}</div>`;
  } catch (e) {
    box.innerHTML = `<p class="muted">${APP.teacher} nicht erreichbar: ${esc(aiErrShort())}. <a href="#" data-act="aidiag">Verbindung prüfen</a></p>`;
  }
}
