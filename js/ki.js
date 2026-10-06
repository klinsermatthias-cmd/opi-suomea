/* Opi suomea – ki.js: KI „Opettaja“: Anbieter (Gemini/OpenAI-kompatibel), Fehlerbehandlung, KI-Protokoll, Prüfung, Analyse, Übungen.
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
function aiErrText(e) {
  const k = (e && e.kind) || "unknown";
  return (
    {
      offline: "kein Internet",
      timeout: "Gemini hat zu lange gebraucht",
      "quota-min": "zu viele Anfragen pro Minute – kurz warten",
      "quota-day": "Tageslimit von Gemini erreicht – setzt sich um ca. 9 Uhr zurück",
      key: "API-Schlüssel ungültig oder gesperrt",
      overload: "Gemini ist gerade überlastet",
      empty: "Gemini hat keine verwertbare Antwort geliefert",
      net: "keine Verbindung zu Google",
      setup: "KI nicht eingerichtet"
    }[k] || "unbekannter Fehler"
  );
}
function aiErrShort() {
  return LAST_AI_ERR ? aiErrText(LAST_AI_ERR) : "keine Verbindung";
}
async function aiCall(system, user, opt = {}) {
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
    if (meta.k) aiStat(meta.k, {}, Date.now() - t0, e.kind);
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
   ist eines voll oder überlastet, springt das nächste ein. */
async function geminiCall(system, user, a, opt = {}) {
  const models = opt.only ? [a.model] : [a.model, ...GEMINI_MODELS].filter((m, i, arr) => m && arr.indexOf(m) === i);
  const caps = CFG.aiCaps || (CFG.aiCaps = {});
  let worst = null;
  const rank = { "quota-day": 5, "quota-min": 4, overload: 3, timeout: 2, empty: 1, net: 1, unknown: 0 };
  const keep = e => {
    if (!worst || (rank[e.kind] || 0) >= (rank[worst.kind] || 0)) worst = e;
  };
  for (const m of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const cap = caps[m] || {};
      const gc = { temperature: 0.3, maxOutputTokens: 8192 };
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
        if (a.model !== m) {
          CFG.ai.model = m;
        }
        aiLog("ok", m, "", Date.now() - t0);
        const um = d.usageMetadata || {};
        opt.usage = {
          model: m,
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
        keep(aiErr(/per ?day|PerDay|daily/i.test(msg) ? "quota-day" : "quota-min", msg, m));
        break;
      }
      if (res.status >= 500) {
        keep(aiErr("overload", msg, m));
        if (attempt < 1) {
          await sleep(1500);
          continue;
        }
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
        temperature: 0.3,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ]
      })
    },
    30000
  );
  if (res.status === 429) throw aiErr("quota-min", "Limit erreicht");
  if (res.status === 401 || res.status === 403) throw aiErr("key", "Schlüssel ungültig");
  if (res.status >= 500) throw aiErr("overload", "HTTP " + res.status);
  if (!res.ok) throw aiErr("unknown", "HTTP " + res.status);
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
function parseJSON(txt) {
  const c = txt.replace(/```json|```/g, "").trim();
  return JSON.parse(c.slice(c.indexOf("{"), c.lastIndexOf("}") + 1));
}
async function aiJSON(prompt, meta) {
  const txt = await aiCall(SYS_JSON, prompt, { json: true, meta });
  try {
    return parseJSON(txt);
  } catch (e) {
    const t2 = await aiCall(
      SYS_JSON,
      prompt + "\n\nWICHTIG: Halte dich sehr kurz (insgesamt unter 120 Wörter), damit das JSON vollständig ist.",
      { json: true, meta }
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

async function aiJudge(ex, user) {
  const t = { title: SESSION.title || (T(SESSION.id) || {}).title || "" };
  const kind =
    ex.t === "gap"
      ? "Lückentext"
      : ex.dir === "de"
        ? "Übersetzung " + APP.base.name + " → " + APP.target.name
        : "Übersetzung " + APP.target.name + " → " + APP.base.name;
  const sol = solutionText(ex);
  const p = `Thema: ${t.title}
Aufgabentyp: ${kind}
Aufgabe: ${promptText(ex)}
Musterlösung(en): ${sol}
Antwort von ${APP.learner}: "${user}"

Bewerte streng, aber fair. Korrekt sind auch gleichwertige Alternativen (andere passende Wortwahl, weggelassenes Personalpronomen, Groß-/Kleinschreibung, fehlende Satzzeichen). Ein kleiner Tippfehler, der kein anderes Wort und keine andere Form ergibt, zählt als korrekt mit Hinweis. ${SP.judge.trim()}${ex.s ? SP.strict : ""}
JSON: {"correct": true oder false, "feedback": "1–2 kurze Sätze auf ${APP.explain}: warum richtig/falsch", "correction": "die richtige Lösung"}`;
  const meta = { k: "pruefung" },
    j = await aiJSON(p, meta);
  j._aid = aiAudit("pruefung", meta, {
    q: `[${kind}] ${promptText(ex)}`,
    sol,
    u: user,
    ok: !!j.correct,
    r: `${j.correct ? "richtig" : "falsch"} – ${j.feedback || ""}${j.correction ? " | Korrektur: " + j.correction : ""}`
  });
  return j;
}

/* ---------- KI-Protokoll (für die Qualitätsprüfung durch Claude und die Token-Statistik) ----------
   S.aiStats[Gerät][Art] = Zähler (Aufrufe, Fehler, Token, Dauer, Modelle) – pro Gerät, damit sich beim Sync nichts doppelt zählt.
   S.aiAudit = die letzten Antworten mit Inhalt (max. 15 je Art, 80 gesamt; markierte bleiben bevorzugt). */
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
function aiStat(k, u, ms, err) {
  S.aiStats = S.aiStats || {};
  const dv = S.aiStats[devId()] || (S.aiStats[devId()] = { since: Date.now(), k: {} });
  const s = dv.k[k] || (dv.k[k] = { n: 0, err: 0, i: 0, o: 0, t: 0, ms: 0, m: {} });
  if (err) {
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
    .slice(0, 20)
    .forEach(e => out.push(e));
  by.filter(e => !e.flag).forEach(e => {
    cnt[e.k] = (cnt[e.k] || 0) + 1;
    if (cnt[e.k] <= 15 && out.length < 100) out.push(e);
  });
  return out.sort((a, b) => b.d - a.d);
}
/* Einen Eintrag ablegen; Rückgabe = Eintrags-ID (für „KI lag falsch?“) */
function aiAudit(k, meta, f) {
  const e = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    d: Date.now(),
    k,
    m: meta.model || "",
    ms: meta.ms || 0,
    tok: [meta.i || 0, meta.o || 0, meta.t || 0],
    q: cut(f.q, 240),
    sol: f.sol != null ? cut(f.sol, 200) : undefined,
    u: f.u != null ? cut(f.u, f.umax || 160) : undefined,
    r: cut(f.r, f.rmax || 320),
    ok: f.ok
  };
  S.aiAudit = auditCap([e, ...(S.aiAudit || [])]);
  save();
  return e.id;
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
function basicsStatus() {
  const ids = basicIds(),
    st = ids.map(id => S.topics[id]).filter(Boolean);
  const solid = st.filter(s => s.status === "learning" && (s.last || 0) >= 0.8 && (s.reps || 0) >= 2).length;
  return { solid, total: ids.length, ok: ids.length > 0 && solid === ids.length };
}
function genUnlocked() {
  return !!(S.genUnlock && S.genUnlock.on);
}
/* Theorie eines Themas als reiner Text (für KI-Aufträge), gekürzt */
function theoryText(t, max) {
  return String(t.th || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}
async function aiGenerate(t) {
  const learned = TOPICS.filter(x => S.topics[x.id].status === "learning");
  const voc = learned
    .flatMap(x => x.v.map(w => w[0]))
    .slice(0, 250)
    .join(", ");
  const weak =
    S.errors
      .filter(e => e.topic === t.id && !e.ok)
      .slice(0, 6)
      .map(e => `- ${e.q} (richtig: ${e.exp})`)
      .join("\n") || "keine";
  const theory = theoryText(t, 1800);
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
Bekannte Wörter (nur diese plus sehr einfache Wörter verwenden): ${voc}
Aktuelle Fehler von ${APP.learner} in diesem Thema:
${weak}

Mische: 2× "gap", 2× "tr" (dir "de" = ${APP.base.name}→${APP.target.name}), 1× "tr" (dir "fi"), 1× "tab", 1× "mc" als REGELFRAGE (wann/wofür/bei welchen Wörtern gilt die Regel – neu formuliert und mit anderen Beispielwörtern als in der Theorie, mit kurzer Erklärung in "x"). Wo das Format missverständlich sein könnte, einen Hinweis "h" angeben (z. B. „nur die Endung eintippen“, bei Tabellen: was jedes Kästchen bedeutet). Alle ${APP.target.adj}en Formen müssen korrekt sein.
Formate:
${APP.genExamples}  (Lücken in [eckigen Klammern], Alternativen mit |)
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
/* ---------- Prüfung der KI-Übungen durch Claude ----------
   Jede erzeugte Übung bekommt eine ID (gid). S.genReview = [{id, d, topic, ex:[…], res:{gid:richtig?}, v:{gid:Urteil}}].
   Claude prüft die Übungen aus dem Bericht und trägt das Urteil in lektionen/ki-pruefung.json ein
   ({"<gid>": {"ok": true} | {"ok": false, "korrektur": "…", "grund": "…"}}). Die App lädt die Datei beim Start:
   geprüfte Übungen zeigen ✓/✗, Fehler aus fehlerhaften KI-Übungen werden aus dem Fehler-Training gestrichen. */
function genReviewCap(list) {
  list = list.slice().sort((a, b) => b.d - a.d);
  const open = x => x.ex.some(e => !(x.v || {})[e.gid]);
  const keep = list.filter(open);
  return [...keep, ...list.filter(x => !open(x))].slice(0, Math.max(30, keep.length)).sort((a, b) => b.d - a.d);
}
function genUnreviewed() {
  return (S.genReview || []).flatMap(x => x.ex.filter(e => !(x.v || {})[e.gid]).map(e => ({ set: x, ex: e })));
}
function genVerdictOf(gid) {
  for (const x of S.genReview || []) if (x.v && x.v[gid]) return x.v[gid];
  return null;
}
async function loadGenVerdicts() {
  try {
    const r = await fetch("lektionen/ki-pruefung.json", { cache: "no-store" });
    if (!r.ok) return;
    const V = await r.json();
    if (!V || typeof V !== "object") return;
    let ok = 0,
      bad = 0;
    (S.genReview || []).forEach(x =>
      x.ex.forEach(e => {
        const v = V[e.gid];
        if (!v || (x.v && x.v[e.gid])) return;
        x.v = x.v || {};
        x.v[e.gid] = { ok: !!v.ok, korrektur: v.korrektur || "", grund: v.grund || "" };
        v.ok ? ok++ : bad++;
      })
    );
    /* Fehler aus fehlerhaften KI-Übungen streichen – das war ein Fehler der KI, nicht von Matthias */
    S.errors.forEach(e => {
      const v = e.gx && e.gx.gid && genVerdictOf(e.gx.gid);
      if (v && !v.ok && !e.ok) {
        e.ok = 1;
        e.kiFalsch = 1;
      }
    });
    if (ok + bad) {
      save();
      if (!SESSION) render();
      toast(
        `Claude hat ${ok + bad} KI-Übungen geprüft: ${ok} korrekt${bad ? `, ${bad} fehlerhaft (aus dem Fehler-Training entfernt)` : ""}`
      );
    }
  } catch (e) {}
}
function genReportSection() {
  const L = genUnreviewed();
  if (!L.length) return "";
  const desc = e =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(e).filter(([k]) =>
          ["t", "q", "dir", "o", "a", "h", "x", "w", "de", "head", "r", "s"].includes(k)
        )
      )
    );
  return (
    `\n\nKI-ÜBUNGEN ZUR PRÜFUNG (${L.length}, von ${APP.teacher} erzeugt – Urteil bitte in lektionen/ki-pruefung.json eintragen):\n` +
    L.map(({ set, ex }) => {
      const r = (set.res || {})[ex.gid];
      return `- ${ex.gid} [${set.topic}${r == null ? "" : r ? ", " + APP.learner + " richtig" : ", " + APP.learner + " falsch"}] ${desc(ex)}`;
    }).join("\n")
  );
}
async function startGen(id, b) {
  const t = T(id);
  if (!t || !aiReady() || !genUnlocked()) return;
  if (b) {
    b.disabled = true;
    b.innerHTML = `${APP.teacher} schreibt neue Übungen ${dots()}`;
  }
  try {
    const gen = await aiGenerate(t);
    if (gen.length < 3) throw new Error("zu wenige");
    const idxs = gen.map((_, i) => i),
      setId = Date.now().toString(36);
    gen.forEach((e, i) => (e.gid = setId + "-" + i));
    S.genReview = genReviewCap([
      { id: setId, d: Date.now(), topic: id, ex: JSON.parse(JSON.stringify(gen)), res: {}, v: {} },
      ...(S.genReview || [])
    ]);
    S.active = {
      id,
      mode: "gen",
      genSet: setId,
      genAid: gen._aid,
      title: t.title + " · neue Übungen",
      gen,
      gsrc: gen.map(() => ({ tid: id, ei: -1 })),
      idxs,
      rt: idxs.map(() => 0),
      idx: 0,
      results: [],
      d: Date.now()
    };
    save();
    openSession();
  } catch (e) {
    toast(
      e.kind
        ? APP.teacher + " nicht erreichbar: " + aiErrShort()
        : APP.teacher + " konnte gerade keine passenden Übungen erstellen – versuch es nochmal"
    );
    if (b) {
      b.disabled = false;
      b.textContent = "Neue Übungen von " + APP.teacher;
    }
  }
}
async function aiSessionReview(t, s, results, score, rating, baseDays) {
  const errs =
    results
      .filter(r => !r.correct)
      .map(r => `- ${r.q} | Antwort: ${r.user} | richtig: ${r.exp}`)
      .join("\n") || "keine";
  const hist = s.hist
    .slice(-6)
    .map(h => `${new Date(h.d).toLocaleDateString(APP.locale)}: ${h.sc} %`)
    .join(", ");
  const p = `${APP.learner} hat gerade das Thema „${t.title}“ (${t.lvl}) geübt.
Ergebnis: ${Math.round(score * 100)} % (${results.filter(r => r.correct).length}/${results.length}). Selbsteinschätzung: ${RATINGS.find(r => r.k === rating).l}.
Bisherige Ergebnisse: ${hist}
Wiederholungen: ${s.reps}, Fehlschläge: ${s.lapses}
Fehler in dieser Runde:
${errs}
Der Spaced-Repetition-Algorithmus schlägt die nächste Wiederholung in ${baseDays} Tag(en) vor.

Entscheide als Lehrkraft, wann das Thema wiederholt wird: Unsicheres früher (1–2 Tage), Solides später. Weiche vom Vorschlag ab, wenn Fehler oder Verlauf es nahelegen.
JSON: {"feedback":"2–3 Sätze ehrliches, persönliches Feedback auf ${APP.explain}, Fehler konkret erklären","tips":["bis zu 3 kurze, konkrete Tipps"],"intervalDays": Ganzzahl 1–180,"reason":"1 kurzer Satz, warum dieser Abstand"}`;
  const meta = { k: "auswertung" },
    j = await aiJSON(p, meta);
  j._aid = aiAudit("auswertung", meta, {
    q: `${t.id} ${t.title}: ${Math.round(score * 100)} %, selbst „${RATINGS.find(r => r.k === rating).l}“, Algorithmus ${baseDays} T., Fehler: ${
      results
        .filter(r => !r.correct)
        .map(r => r.user + " ≠ " + r.exp)
        .join("; ") || "keine"
    }`,
    r: `${j.intervalDays} Tage – ${j.reason || ""} | ${j.feedback || ""} | Tipps: ${(j.tips || []).join("; ")}`,
    rmax: 500
  });
  return j;
}

/* Lernstand als Text. Für den Bericht (forReport) ohne die Kurzfassungen von Schreiben/Rollenspiel und eigenen Wörtern,
   weil der Bericht sie ausführlich in eigenen Abschnitten bringt. */
function progressSummary(forReport) {
  const L = [];
  L.push(
    `Lernstart: ${new Date(S.created).toLocaleDateString(APP.locale)} | Serie: ${streakNow()} Tage | Sitzungen: ${S.stats.sessions} | Kartenwiederholungen: ${S.stats.reviews}`
  );
  L.push("\nTHEMEN:");
  TOPICS.forEach(t => {
    const s = S.topics[t.id];
    if (s.status === "learning")
      L.push(
        `- ${t.id} ${t.title}: zuletzt ${pct(s.last)}, bestes ${pct(s.best)}, Wdh ${s.reps}, Fehlschläge ${s.lapses}, nächste ${fmtDate(s.due)}, Verlauf ${s.hist
          .slice(-5)
          .map(h => h.sc + "%")
          .join(" → ")}`
      );
    else L.push(`- ${t.id} ${t.title}: ${s.status === "new" ? "freigeschaltet, noch nicht gelernt" : "gesperrt"}`);
  });
  const all = Object.entries(S.cards).filter(([id]) => cardWord(id)),
    seen = all.filter(([, c]) => !c.isNew);
  const dirStat = r => {
    const x = seen.filter(([id]) => cardParse(id).rev === r),
      n = k => x.filter(([, c]) => cardState(c) === k).length;
    return `${x.length} gelernt (${n("lernt")} frisch, ${n("gut")} gefestigt, ${n("sicher")} sicher), ${x.filter(([, c]) => c.lapses >= 2).length} oft vergessen`;
  };
  L.push(
    `\nVOKABELN: ${new Set(all.map(([id]) => cardParse(id).base)).size} Wörter, ${learnedWords()} gelernt (je Richtung eigene Karte)\n- ${APP.target.name} → ${APP.base.name}: ${dirStat(false)}\n- ${APP.base.name} → ${APP.target.name}: ${dirStat(true)}`
  );
  const weak = weakCards()
    .slice(0, 15)
    .map(([id, c]) => {
      const w = cardWord(id);
      return `${w[0]} (${w[1]}, ${DIRL(id)}) – ${c.lapses}× vergessen`;
    });
  if (weak.length) L.push("Schwierige Wörter: " + weak.join("; "));
  const vh = S.vhelp || [];
  if (vh.length) {
    const cnt = {};
    vh.forEach(x => x.words.forEach(w => (cnt[w] = (cnt[w] || 0) + 1)));
    L.push(
      `\nVOKABELHILFE genutzt (letzte ${vh.length} Aufgaben) – aktiv noch unsichere Wörter: ` +
        Object.entries(cnt)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 25)
          .map(([w, n]) => w + (n > 1 ? " ×" + n : ""))
          .join(", ")
    );
  }
  {
    const st = exStatsTotal(),
      names = {
        mc: "Multiple Choice",
        gap: "Lückentext",
        tr: "Übersetzung",
        ord: "Satz ordnen",
        tab: "Tabelle",
        les: "Lesetext",
        sch: "Schreibaufgabe",
        dlg: "Dialog"
      };
    const rows = Object.entries(st).filter(([, s]) => s.n);
    if (rows.length)
      L.push(
        "\nÜBUNGSARTEN (erster Versuch, „Weiß ich nicht“ nicht mitgezählt):\n" +
          rows
            .map(
              ([t, s]) =>
                `- ${names[t] || t}: ${s.ok}/${s.n} richtig (${pct(s.ok / s.n)})${s.ai ? `; davon ${s.ai} von der KI geprüft, ${s.aiOk} als richtig gewertet` : ""}`
            )
            .join("\n")
      );
  }
  const pr = forReport ? [] : (S.practice || []).slice(0, 6);
  if (pr.length) {
    L.push("\nFREIES SCHREIBEN & ROLLENSPIEL (letzte):");
    pr.forEach(x => L.push(practiceLine(x, false)));
  }
  const ow = ownKeys();
  if (ow.length && !forReport)
    L.push(
      `\nEIGENE WÖRTER: ${ow.length} selbst angelegt, ${ow.filter(n => S.cards["own-" + n] && !S.cards["own-" + n].isNew).length} davon schon gelernt`
    );
  const er = S.errors.slice(0, 20);
  if (er.length) {
    L.push("\nLETZTE FEHLER:");
    er.forEach(e => L.push(`- [${e.topic}] ${e.q} → „${e.user}“ (richtig: ${e.exp})`));
  }
  return L.join("\n");
}

async function aiGlobal() {
  const ids =
    TOPICS.filter(t => S.topics[t.id].status === "learning")
      .map(t => t.id)
      .join(", ") || "keine";
  const p = `Aktueller Lernstand:

${progressSummary()}

Analysiere den Fortschritt wie eine erfahrene ${APP.teacherKind}. Schätze das Niveau (z. B. ${APP.levelHint}), erkenne Muster in Fehlern und vergessenen Wörtern und plane Wiederholungen neu, wo es sinnvoll ist (nur diese Themen-IDs: ${ids}; schwache Themen früher, sehr sichere ruhig später).
Halte jeden Text kurz (Listen höchstens 3 Punkte mit je max. 12 Wörtern), damit die Antwort vollständig bleibt.
Beurteile auch die Fertigkeiten Lesen (Lesetexte), Schreiben (Schreibaufgaben, freies Schreiben) und Gesprächsfähigkeit (Dialoge, Rollenspiel), soweit Daten dazu vorliegen; ohne Daten schreibe „noch keine Daten“.
Entscheide außerdem streng, ob die Grundlagen (Themen ${basicIds().join(", ") || "noch keine"}) über mehrere Wiederholungen sicher sitzen. Nur dann bekommt ${APP.learner} frei erzeugte Zusatzübungen. Im Zweifel false.
JSON: {"level":"…","summary":"2 Sätze","strengths":["…"],"weaknesses":["…"],"tips":["…"],"reschedule":[{"topicId":"${(TOPICS[0] || { id: "t01" }).id}","days":1,"reason":"max. 8 Wörter"}],"skills":{"lesen":"max. 12 Wörter","schreiben":"max. 12 Wörter","dialog":"max. 12 Wörter"},"nextFocus":"1 motivierender Satz","basicsSolid":false,"basicsReason":"1 kurzer Satz"}`;
  const meta = { k: "analyse" },
    j = await aiJSON(p, meta);
  j._aid = aiAudit("analyse", meta, {
    q: `Gesamtanalyse (Themen: ${ids})`,
    r: `Niveau ${j.level} | ${j.summary || ""} | Schwächen: ${(j.weaknesses || []).join("; ")} | Termine: ${(j.reschedule || []).map(r => r.topicId + " " + r.days + "T").join(", ")} | Fertigkeiten: ${j.skills ? `Lesen ${j.skills.lesen || "–"}; Schreiben ${j.skills.schreiben || "–"}; Dialog ${j.skills.dialog || "–"}` : "–"} | Grundlagen sicher: ${j.basicsSolid}`,
    rmax: 600
  });
  return j;
}

async function runGlobal(silent) {
  if (GLOBAL_RUNNING) return;
  if (!aiReady()) {
    if (!silent) toast(APP.teacher + " ist nicht eingerichtet – siehe Einstellungen → Cloud & KI");
    return;
  }
  if (!TOPICS.some(t => S.topics[t.id].status === "learning")) {
    if (!silent) toast("Lerne zuerst ein Thema");
    return;
  }
  GLOBAL_RUNNING = true;
  if (!silent) {
    const b = $("#globalbox");
    if (b) b.innerHTML = `<p class="muted">${APP.teacher} analysiert deinen Fortschritt ${dots()}</p>`;
  }
  try {
    const j = await aiGlobal();
    (j.reschedule || []).forEach(r => {
      const s = S.topics[r.topicId];
      const d = clampInt(r.days, 1, 180);
      if (s && s.status === "learning" && d) {
        s.due = addDays(d);
        s.interval = d;
        s.ai = { ...(s.ai || {}), reason: "Gesamtanalyse: " + (r.reason || "") };
      }
    });
    const aid = j._aid;
    delete j._aid;
    S.reports.unshift({ ...j, d: Date.now(), aid });
    S.reports = S.reports.slice(0, 10);
    if (!genUnlocked() && j.basicsSolid === true && basicsStatus().ok) {
      S.genUnlock = { on: true, d: Date.now(), reason: j.basicsReason || "" };
      setTimeout(() => toast("Freigeschaltet: Neue Übungen von " + APP.teacher + " – deine Grundlagen sitzen!"), 2600);
    }
    S.lastGlobal = Date.now();
    S.sinceGlobal = 0;
    save();
    if (!SESSION && (CUR.tab === "today" || CUR.tab === "progress")) render();
    toast(APP.teacher + " hat deinen Lernplan aktualisiert");
  } catch (e) {
    GLOBAL_FAILED_AT = Date.now();
    if (!silent) {
      toast(APP.teacher + " nicht erreichbar: " + aiErrShort());
      if (!SESSION) render(); // nie über eine laufende Runde zeichnen
    }
  }
  GLOBAL_RUNNING = false;
}
let GLOBAL_FAILED_AT = 0;
function maybeAutoGlobal() {
  if (!aiReady() || GLOBAL_RUNNING || Date.now() - GLOBAL_FAILED_AT < 30 * 60000) return;
  const stale = Date.now() - S.lastGlobal > 3 * DAY;
  if (S.sinceGlobal >= 3 || (stale && S.sinceGlobal >= 1)) runGlobal(true);
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
    box.innerHTML = `<p class="muted">${APP.teacher} ist noch nicht eingerichtet (${APP.tabs[3][0]} → „Cloud & KI einrichten“).</p>`;
    return;
  }
  const ex = se.items[se.idx],
    checked = !!se.locked,
    t = T(se.id) || { title: se.title },
    last = checked ? se.results[se.results.length - 1] : null;
  const sol = solutionText(ex);
  const rule = checked
    ? `${APP.learner} hat die Aufgabe schon beantwortet. Erkläre vollständig und konkret, auch warum die Antwort richtig oder falsch ist.`
    : APP.learner +
      " hat die Aufgabe NOCH NICHT beantwortet. Verrate die Lösung NICHT – weder ganz noch teilweise, auch nicht die gesuchten Wortformen oder Endungen der Lösung. Erkläre stattdessen die Regel, gib Denkanstöße und Beispiele mit ANDEREN Wörtern.";
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
      `Thema: ${t.title}\nAufgabe: ${exDescribe(ex)}\nMusterlösung (nur für dich): ${sol}${last ? `\nAntwort von ${APP.learner}: ${last.user} (${last.correct ? "richtig" : "falsch"})` : ""}\n\nFrage von ${APP.learner}: ${q}`,
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
    box.innerHTML = `<p class="muted">${APP.teacher} ist noch nicht eingerichtet (${APP.tabs[3][0]} → „Cloud & KI einrichten“).</p>`;
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
      `Vokabelkarte (${dirL}): ${APP.target.name} „${w[0]}“ = ${APP.base.name} „${w[1]}“${se.typed ? `\nEingabe von ${APP.learner}: „${se.typed}“` : ""}\n\nFrage von ${APP.learner}: ${q}`,
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
      `Aktuelles Thema: ${t.title}. Frage von ${APP.learner}: ${q}`,
      { meta }
    );
    const aid = aiAudit("frage", meta, { q: `${t.id}: ${q}`, r: ans, rmax: 900 });
    box.innerHTML = `<div class="teacher" style="margin:12px 0 0"><p>${mdLite(ans)}</p>${flagLink(aid)}</div>`;
  } catch (e) {
    box.innerHTML = `<p class="muted">${APP.teacher} nicht erreichbar: ${esc(aiErrShort())}. <a href="#" data-act="aidiag">Verbindung prüfen</a></p>`;
  }
}
