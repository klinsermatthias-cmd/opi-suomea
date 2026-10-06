/* Opi suomea – uebungen.js: Übungs-Sitzung, Auswertung, Vokabeln, Hörtraining, Hörverstehen.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
/* ---------- Übungs-Sitzung ---------- */
/* ---------- Wörter antippen → deutsche Bedeutung ---------- */
let DICT = null,
  DICT_N = -1,
  PHRASES = [];
function gkey(w) {
  return norm(String(w).replace(/\(.*?\)/g, ""))
    .replace(/[?]/g, "")
    .trim();
}
// Reihenfolge = Vorrang (der erste Eintrag gewinnt): Ergänzungen, Wortschatz, Verneinungsformen, Tabellenformen.
// Redewendungen („ole hyvä“) werden nicht in Einzelwörter zerlegt, sondern nur im passenden Satz dazu angezeigt.
function buildDict() {
  if (DICT && DICT_N === TOPICS.length) return DICT;
  DICT = {};
  DICT_N = TOPICS.length;
  PHRASES = [];
  const add = (k, v) => {
    k = gkey(k);
    if (k && !DICT[k]) DICT[k] = v;
  };
  const extra = typeof GLOSS_EXTRA === "undefined" ? {} : GLOSS_EXTRA;
  Object.keys(extra).forEach(k => add(k, extra[k]));
  TOPICS.forEach(t =>
    t.v.forEach(([fi, de]) => {
      add(fi, { de });
      const parts = gkey(fi)
        .split(" ")
        .filter(x => /[a-zäöå]/.test(x));
      if (parts.length > 1) PHRASES.push({ fi, de, parts });
    })
  );
  // Verbformen aus den Tabellen-Übungen: Spaltenkopf = Grundform, erste Spalte = Person
  const forms = [];
  TOPICS.forEach(t =>
    t.ex.forEach(e => {
      if (e.t !== "tab" || !e.head) return;
      e.head.forEach((h, ci) => {
        const base = gkey(h).replace(/\?$/, ""),
          entry = DICT[base];
        if (!entry || ci === 0) return;
        e.r.forEach(row => {
          const g = tabGap(row[ci]);
          const per = tabGap(row[0]) ? tabGap(row[0])[0] : row[0];
          if (g) g.forEach(f => forms.push({ f, per, base, de: entry.de, q: /\?/.test(h) }));
        });
      });
    })
  );
  // sprachabhängige Zusatzformen (Finnisch: Verneinungsform = minä-Form ohne -n)
  if (SP.derive) SP.derive(forms, add);
  forms.forEach(x => add(x.f, { de: x.de, base: x.base, note: (x.q ? "Frageform" : "Form") + " für „" + x.per + "“" }));
  return DICT;
}
// Redewendung aus dem Wortschatz, die im Satz rund um das Wort vorkommt (z. B. „ole hyvä“ in „Ole hyvä!“)
function glossPhrase(k, ctx) {
  if (!ctx) return null;
  const ws =
    " " +
    gkey(ctx)
      .replace(/[^a-zäöåüß' -]+/g, " ")
      .replace(/\s+/g, " ") +
    " ";
  return PHRASES.find(p => p.parts.includes(k) && ws.includes(" " + p.parts.join(" ") + " ")) || null;
}
function glossLocal(w, ctx) {
  const d = buildDict(),
    k = gkey(w);
  if (!k) return null;
  const ph = glossPhrase(k, ctx);
  const withPh = g => (g && ph ? { ...g, phrase: ph } : g);
  if (d[k]) return withPh({ ...d[k], w: k });
  const g = S.gloss && S.gloss[k];
  if (g) return withPh({ ...g, w: k, ai: 1 });
  const num = SP.number && SP.number(k, d);
  if (num) return withPh({ ...num, w: k });
  for (const [e, note] of SP.ends) {
    if (!k.endsWith(e) || k.length - e.length < 3) continue;
    const r = k.slice(0, -e.length);
    const hit = Object.keys(d).find(
      x => x === r || (x.length > 3 && x.slice(0, -1) === r) || (x.startsWith(r) && x.length - r.length <= 1)
    );
    if (hit) {
      const h = d[hit];
      return withPh({ ...h, base: h.base || hit, note: [note, h.note].filter(Boolean).join(" · "), w: k, guess: 1 });
    }
  }
  const pl = SP.place && SP.place(w);
  if (pl) return withPh({ ...pl, w: k });
  if (ph) return { de: "Teil der Wendung „" + ph.fi + "“", phrase: ph, w: k };
  return null;
}
function glossWords(text, onlyKnown) {
  return String(text)
    .split(/([A-Za-zÄÖÅäöåÜüß][A-Za-zÄÖÅäöåÜüß'’-]*)/)
    .map((p, i) => {
      if (i % 2 === 0 || p.length < 2) return esc(p);
      if (onlyKnown && !glossLocal(p)) return esc(p);
      return `<span class="gw" data-act="gloss" data-id="${esc(p)}">${esc(p)}</span>`;
    })
    .join("");
}
function glossQuoted(text) {
  return esc(text).replace(
    /„([^“]+)“/g,
    (m, x) => "„" + glossWords(x.replace(/&#39;/g, "'").replace(/&amp;/g, "&")) + "“"
  );
}
function closeGloss() {
  const g = $("#gloss");
  if (g) g.remove();
  document.querySelectorAll(".gw.on").forEach(x => x.classList.remove("on"));
}
async function showGloss(w, el) {
  closeGloss();
  el.classList.add("on");
  const box = document.createElement("div");
  box.id = "gloss";
  document.body.appendChild(box);
  const place = () => {
    const r = el.getBoundingClientRect(),
      bw = box.offsetWidth,
      bh = box.offsetHeight;
    let x = Math.min(Math.max(16, r.left + r.width / 2 - bw / 2), innerWidth - bw - 16),
      y = r.bottom + 8;
    if (y + bh > innerHeight - 80) y = r.top - bh - 8;
    box.style.left = x + "px";
    box.style.top = Math.max(8, y) + "px";
  };
  const show = g => {
    if (!document.body.contains(box)) return;
    box.innerHTML = `<b>${esc(w)}</b> ${spk(w)}<div>${esc(g.de)}</div>${g.base && g.base !== gkey(w) ? `<small>${g.guess ? "vermutlich von" : "von"} <b>${esc(g.base)}</b>${g.note ? " · " + esc(g.note) : ""}</small>` : g.note ? `<small>${esc(g.note)}</small>` : ""}${g.phrase ? `<small>In „${esc(g.phrase.fi)}“ = ${esc(g.phrase.de)}</small>` : ""}${g.ai ? `<small>Erklärt von ${APP.teacher}</small>` : ""}${g.ai ? flagLink(g.aid) : ""}`;
    place();
  };
  const sent = (el.closest(".q,.fb,td,.opt") || el).textContent.slice(0, 200);
  const loc = glossLocal(w, sent);
  if (loc) return show(loc);
  if (!aiReady()) {
    box.innerHTML = `<b>${esc(w)}</b><div class="muted">Noch nicht in deinem Wortschatz.</div>`;
    place();
    return;
  }
  box.innerHTML = `<b>${esc(w)}</b><div class="muted">${APP.teacher} schaut nach ${dots()}</div>`;
  place();
  try {
    const meta = { k: "wort" };
    const j = await aiJSON(
      `${ucFirst(APP.target.adj)}es Wort: "${w}" im Satz: "${sent}". Gib die ${APP.base.adj}e Bedeutung in diesem Satz, die Grundform und – falls gebeugt – kurz die Form an.
JSON: {"de":"${APP.base.adj}e Bedeutung, max. 6 Wörter","base":"Grundform (Wörterbuchform)","note":"z. B. ‚ich-Form‘ oder ‚in …‘ (‚-ssa‘), max. 6 Wörter, sonst leer"}`,
      meta
    );
    const g = {
      de: String(j.de || "?").slice(0, 80),
      base: gkey(j.base || ""),
      note: String(j.note || "").slice(0, 60)
    };
    g.aid = aiAudit("wort", meta, {
      q: `„${w}“ in: ${sent}`,
      r: `${g.de} | Grundform ${g.base}${g.note ? " | " + g.note : ""}`
    });
    S.gloss = S.gloss || {};
    S.gloss[gkey(w)] = g;
    save();
    show({ ...g, ai: 1, phrase: glossPhrase(gkey(w), sent) });
  } catch (e) {
    if (document.body.contains(box)) {
      box.innerHTML = `<b>${esc(w)}</b><div class="muted">${APP.teacher} nicht erreichbar: ${esc(aiErrShort())}</div>`;
      place();
    }
  }
}
document.addEventListener(
  "click",
  e => {
    if (!e.target.closest("#gloss,.gw")) closeGloss();
  },
  true
);
addEventListener("scroll", closeGloss, { passive: true });

/* ---------- Vokabelhilfe (Übersetzung in die Lernsprache) ----------
   Zeigt die GRUNDFORMEN der Wörter aus der Musterlösung (nur aus dem eigenen Wortschatz, ohne KI),
   alphabetisch – beugen/konjugieren müssen Lernende selbst. Wertung: Übung zählt normal, Vermerk „mit Vokabelhilfe“,
   und die Karte Basissprache → Lernsprache des Wortes kommt früher wieder (wie „Schwer“, höchstens einmal am Tag). */
/* Wortschatz-Index; Einträge des aktuellen Themas haben Vorrang (z. B. „ei“ = Verneinung statt „nein“) */
function vocabIndex(tid) {
  const m = {},
    add = t =>
      t.v.forEach((w, i) => {
        const k = gkey(w[0]);
        if (k && !m[k]) m[k] = { fi: w[0], de: w[1], id: t.id + "-" + i };
      });
  const own = tid && T(tid);
  if (own) add(own);
  TOPICS.forEach(add);
  return m;
}
function vocabHint(ex, tid) {
  if (!tid && SESSION && SESSION.kind === "topic") {
    const a = S.active;
    tid = a && a.gsrc ? (srcOf(a, SESSION.idx) || {}).tid : SESSION.id;
  }
  const sol = String(ex.a[0] || ""),
    idx = vocabIndex(tid),
    out = new Map();
  let rest = " " + norm(sol) + " ";
  // feste Wendungen aus mehreren Wörtern zuerst (z. B. „hyvää huomenta“)
  Object.keys(idx)
    .filter(k => k.includes(" "))
    .sort((a, b) => b.length - a.length)
    .forEach(k => {
      if (rest.includes(" " + k + " ")) {
        out.set(k, idx[k]);
        rest = rest.replace(" " + k + " ", " ");
      }
    });
  const negV = SP.neg && Object.values(idx).find(e => SP.neg.base.test(e.fi));
  rest
    .trim()
    .split(" ")
    .filter(Boolean)
    .forEach(wd => {
      /* Verneinungsverb: immer die Grundform „ei (Verb)“ zeigen – die Personalform (en, et …) bildet Matthias selbst */
      if (negV && SP.neg.words.includes(wd)) {
        out.set(SP.neg.key, { ...negV, de: SP.neg.de });
        return;
      }
      const irr = SP.irregular[wd];
      if (irr && idx[irr]) {
        out.set(irr, idx[irr]);
        return;
      }
      if (idx[wd]) {
        out.set(wd, idx[wd]);
        return;
      }
      const g = glossLocal(wd);
      const b = g && (g.base || g.w);
      if (b && idx[b]) {
        out.set(b, idx[b]);
        return;
      }
      /* Verbstamm ohne Endung (asu → asua, puhu → puhua) */
      if (wd.length >= 3) {
        const k = Object.keys(idx).find(x => !x.includes(" ") && x.startsWith(wd) && x.length - wd.length === 1);
        if (k) out.set(k, idx[k]);
      }
    });
  const L = [...out.values()].sort((a, b) => a.fi.localeCompare(b.fi, SP.sort));
  /* Keine Hilfe, wenn sie die Lösung unverändert verraten würde (z. B. „danke → kiitos“) */
  const given = new Set(L.flatMap(e => norm(e.fi).split(" ")));
  if (
    norm(sol)
      .split(" ")
      .every(w => given.has(w))
  )
    return [];
  return L;
}
function vhintPenalty(e) {
  const rid = e.id + "-r",
    c = S.cards[rid];
  if (!c || c.isNew || c.hintd === todayKey()) return;
  c.hintd = todayKey();
  const left = (c.due || Date.now()) - Date.now();
  if (left > 0) {
    c.due = Math.min(c.due, addDays(Math.max(1, Math.ceil(left / DAY / 2))));
    c.interval = Math.max(1, Math.round((c.interval || 1) / 2));
  }
  c.ease = Math.max(1.3, (c.ease || 2.5) - 0.15);
}
function showVocabHint() {
  const se = SESSION;
  if (!se || se.kind !== "topic") return;
  const ex = se.items[se.idx];
  if (ex.t !== "tr" || ex.dir !== "de") return;
  const L = vocabHint(ex),
    box = $("#vhint");
  if (!box) return;
  box.innerHTML = L.length
    ? `<div class="vhint"><div class="label">💡 Vokabelhilfe – Grundformen, selbst anpassen</div>${L.map(e => `<div><b>${esc(e.fi)}</b> – ${esc(e.de)}</div>`).join("")}</div>`
    : `<p class="muted" style="font-size:13px">Für diesen Satz gibt es keine Vokabelhilfe – die Wörter sind nicht in deinem Wortschatz.</p>`;
  if (!L.length) return;
  if (!se.hint) {
    se.hint = L.map(e => e.fi);
    L.forEach(vhintPenalty);
    const src = S.active ? srcOf(S.active, se.idx) : { tid: se.id };
    S.vhelp = [{ d: Date.now(), topic: src.tid, q: promptText(ex), words: se.hint }, ...(S.vhelp || [])].slice(0, 60);
    save();
  }
}

/* Tabellen-Übung: Zellen in [eckigen Klammern] sind Lücken, Alternativen mit | trennen */
function tabGap(c) {
  const m = /^\[(.*)\]$/.exec(String(c).trim());
  return m
    ? m[1]
        .split("|")
        .map(x => x.trim())
        .filter(Boolean)
    : null;
}
function tabGaps(ex) {
  const g = [];
  ex.r.forEach(row =>
    row.forEach(c => {
      const a = tabGap(c);
      if (a) g.push(a);
    })
  );
  return g;
}
function promptText(ex) {
  if (FMT[ex.t]) return FMT[ex.t].prompt(ex);
  if (ex.t === "tab") return ex.q;
  return ex.t === "mc" ? ex.q : ex.t === "gap" ? ex.q + (ex.h ? ` (${ex.h})` : "") : ex.t === "ord" ? ex.de : ex.q;
}
function expectedText(ex) {
  if (FMT[ex.t]) return FMT[ex.t].expected(ex);
  if (ex.t === "tab")
    return tabGaps(ex)
      .map(a => a[0])
      .join(", ");
  return ex.t === "mc" ? ex.o[ex.a] : ex.t === "gap" ? ex.q.replace("___", ex.a[0]) : ex.t === "ord" ? ex.a : ex.a[0];
}
/* Fehler-Training: offene Fehler, die sich einer Übung zuordnen lassen */
function errKey(e) {
  return e.ei != null && e.ei >= 0 ? e.topic + ":" + e.ei : "q:" + e.topic + ":" + e.q;
}
function errEx(e) {
  if (e.gx && validEx(e.gx)) return e.gx;
  const t = T(e.topic);
  if (!t) return null;
  if (e.ei != null && e.ei >= 0) return t.ex[e.ei] || null;
  const i = t.ex.findIndex(x => promptText(x) === e.q);
  if (i >= 0) {
    e.ei = i;
    return t.ex[i];
  }
  return null;
}
function openErrors() {
  const seen = new Set(),
    out = [];
  (S.errors || []).forEach(e => {
    if (e.ok) return;
    const ex = errEx(e);
    if (!ex) return;
    const k = errKey(e);
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ e, ex });
  });
  const solved = new Set((S.errors || []).filter(e => e.ok).map(errKey));
  return out.filter(o => !solved.has(errKey(o.e)));
}
function startErrors() {
  const list = openErrors().slice(0, 10);
  if (!list.length) {
    toast("Keine offenen Fehler – super!");
    return;
  }
  const gen = list.map(o => o.ex),
    gsrc = list.map(o => ({ tid: o.e.topic, ei: o.e.ei != null ? o.e.ei : -1 }));
  const idxs = shuffle(gen.map((_, i) => i));
  S.active = {
    id: "__err",
    mode: "errors",
    title: "Fehler-Training",
    gen,
    gsrc,
    idxs,
    rt: idxs.map(() => 0),
    idx: 0,
    results: [],
    d: Date.now()
  };
  save();
  openSession();
}
function exDoneToday() {
  if (!S.exToday || S.exToday.d !== todayKey()) S.exToday = { d: todayKey(), k: [] };
  return S.exToday;
}
/* Nur eine Runde kann pausiert sein: vor dem Start einer anderen Runde nachfragen, statt sie stillschweigend zu verwerfen */
let PENDING_START = null;
function guardActive(fn) {
  return (...args) => {
    const a = S.active;
    if (!a || !(a.gen || T(a.id))) return fn(...args);
    PENDING_START = () => fn(...args);
    SESSION = null;
    app().innerHTML = `<div class="card" style="border:2px solid var(--puolukka)"><div class="label">Pausierte Runde</div><p>Deine pausierte Runde <b>${esc(activeTitle(a))}</b> (Aufgabe ${Math.min(a.idx + 1, a.idxs.length)} von ${a.idxs.length}) geht verloren, wenn du jetzt eine neue Runde startest. Die einzelnen Antworten bleiben gespeichert, nur das Ergebnis der Runde fehlt dann.</p><div class="btnrow"><button class="btn ghost" data-act="startanyway">Trotzdem neu starten</button><button class="btn" data-act="resume">Pausierte Runde fortsetzen</button></div></div>`;
    scrollTo(0, 0);
  };
}
function startSession(id, mode) {
  const t = T(id),
    done = exDoneToday().k;
  let all = shuffle(t.ex.map((_, i) => i));
  if (mode !== "learn") {
    const fresh = all.filter(i => !done.includes(id + ":" + i));
    all = [...fresh, ...all.filter(i => done.includes(id + ":" + i))];
  }
  const idxs = mode === "learn" || mode === "unlock" ? all : all.slice(0, Math.min(8, all.length));
  S.active = { id, mode, idxs, rt: idxs.map(() => 0), idx: 0, results: [], d: Date.now() };
  if (mode === "unlock") S.active.title = t.title + " · Freischaltversuch";
  save();
  openSession();
}
/* Freie Sitzungen (Fehler-Training, neue Übungen) tragen ihre Übungen selbst in a.gen */
function exOf(a, j) {
  const v = a.idxs[j];
  if (a.gen) return a.gen[v] || null;
  const t = T(a.id);
  return t ? t.ex[v] || null : null;
}
function srcOf(a, j) {
  const v = a.idxs[j];
  return a.gsrc ? a.gsrc[v] || { tid: a.id, ei: -1 } : { tid: a.id, ei: v };
}
function activeTitle(a) {
  return a.title || (T(a.id) || {}).title || "Übung";
}
function isFree(mode) {
  return mode === "extra" || mode === "errors" || mode === "gen";
}
function openSession() {
  const a = S.active;
  if (!a || (!a.gen && !T(a.id))) {
    S.active = null;
    save();
    return render();
  }
  if (!a.rt || a.rt.length !== a.idxs.length) a.rt = a.idxs.map(() => 0);
  if (a.idxs.some((_, j) => !exOf(a, j))) {
    const keep = a.idxs.map((_, j) => (exOf(a, j) ? j : -1)).filter(j => j >= 0);
    a.idx = keep.filter(j => j < a.idx).length;
    a.idxs = keep.map(j => a.idxs[j]);
    a.rt = keep.map(j => a.rt[j]);
  }
  if (!a.idxs.length) {
    S.active = null;
    save();
    return render();
  }
  SESSION = {
    kind: "topic",
    id: a.id,
    mode: a.mode,
    title: activeTitle(a),
    items: a.idxs.map((_, j) => exOf(a, j)),
    idx: Math.min(a.idx, a.idxs.length),
    results: (a.results || []).slice(),
    locked: false,
    cur: null
  };
  CUR = a.mode === "errors" ? { tab: "today", arg: null } : { tab: "topics", arg: a.id };
  setTab(CUR.tab);
  scrollTo(0, 0);
  if (SESSION.idx >= SESSION.items.length) finishTopic();
  else renderEx();
}
function renderEx() {
  const se = SESSION,
    ex = se.items[se.idx];
  se.locked = false;
  se.hint = null;
  const isRetry = !!(S.active && S.active.rt && S.active.rt[se.idx]);
  let h = `<div class="sbar"><div class="prog"><i style="width:${(se.idx / se.items.length) * 100}%"></i></div><small>${se.idx + 1}/${se.items.length}</small><button class="xbtn" data-act="abort">Pause</button></div><div class="card">${isRetry ? '<span class="badge" style="margin-bottom:8px;display:inline-block">Nochmal üben</span> ' : ""}${ex.gid ? genBadge(ex.gid) : ""}`;
  if (FMT[ex.t]) h += FMT[ex.t].render(ex, se);
  else if (ex.t === "mc") {
    se.cur = { opts: shuffle(ex.o.map((o, i) => ({ o, ok: i === ex.a }))) };
    h += `<div class="ask">Wähle die richtige Antwort</div><div class="q">${glossQuoted(ex.q)}</div>${ex.h ? `<div class="hint">${esc(ex.h)}</div>` : ""}<div class="opts">${se.cur.opts.map((o, i) => `<button class="opt" data-act="mc" data-id="${i}">${esc(o.o)}</button>`).join("")}</div><div class="btnrow"><button class="btn ghost" data-act="dunno">Weiß ich nicht</button></div>`;
  } else if (ex.t === "gap") {
    h += `<div class="ask">Ergänze die Lücke</div><div class="q">${ex.q
      .split("___")
      .map(x => glossWords(x))
      .join(
        '<span class="gap">&nbsp;?&nbsp;</span>'
      )}</div>${ex.h ? `<div class="hint">${esc(ex.h)}</div>` : ""}${charKeys()}<input id="ans" class="inp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Deine Antwort"><div class="btnrow"><button class="btn ghost" data-act="dunno">Weiß ich nicht</button><button class="btn" data-act="check">Prüfen</button></div>`;
  } else if (ex.t === "tr") {
    h += `<div class="ask">${ex.dir === "de" ? "Übersetze " + APP.target.ins : "Übersetze " + APP.base.ins}</div><div class="q">${ex.dir === "fi" ? spk(ex.q) + glossWords(ex.q) : esc(ex.q)}</div>${ex.h ? `<div class="hint">${esc(ex.h)}</div>` : ""}${ex.dir === "de" ? charKeys() : ""}<input id="ans" class="inp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${ex.dir === "de" ? "Auf " + APP.target.name + " …" : "Auf Deutsch …"}">${ex.dir === "de" && vocabHint(ex).length ? `<div id="vhint"><p class="aiflagp"><a href="#" class="aiflag" data-act="vhint">💡 Vokabelhilfe</a></p></div>` : ""}<div class="btnrow"><button class="btn ghost" data-act="dunno">Weiß ich nicht</button><button class="btn" data-act="check">Prüfen</button></div>`;
  } else if (ex.t === "tab") {
    let k = 0;
    h += `<div class="ask">Fülle die Tabelle aus</div><div class="q">${esc(ex.q)}</div>${ex.h ? `<div class="hint">${esc(ex.h)}</div>` : ""}${charKeys()}<table class="tabex">${ex.head ? `<tr>${ex.head.map(x => `<th>${esc(x)}</th>`).join("")}</tr>` : ""}${ex.r.map(row => `<tr>${row.map(c => (tabGap(c) ? `<td><input class="tcell" data-k="${k++}" autocomplete="off" autocapitalize="off" spellcheck="false"></td>` : `<td class="fix">${glossWords(c, true)}</td>`)).join("")}</tr>`).join("")}</table><div class="btnrow"><button class="btn ghost" data-act="dunno">Weiß ich nicht</button><button class="btn" data-act="check">Prüfen</button></div>`;
  } else if (ex.t === "ord") {
    se.cur = { chips: shuffle(ex.w), picked: [] };
    h += `<div class="ask">Bilde den ${APP.target.adj}en Satz</div><div class="q">${esc(ex.de)}</div>${ex.h ? `<div class="hint">${esc(ex.h)}</div>` : ""}<div id="ordarea"></div><div class="btnrow"><button class="btn ghost" data-act="dunno">Weiß ich nicht</button><button class="btn" data-act="check">Prüfen</button></div>`;
  }
  h += `<div id="fb"></div><div id="askex"><p class="aiflagp"><a href="#" class="aiflag" data-act="askex">❓ Frag ${APP.teacher}</a></p></div></div>`;
  app().innerHTML = h;
  if (ex.t === "ord") renderOrd();
  const a = $("#ans") || document.querySelector(".tcell") || document.querySelector(".dcell");
  if (a) a.focus();
}
function renderOrd() {
  const c = SESSION.cur,
    box = $("#ordarea");
  if (!box) return;
  const lock = SESSION.locked;
  box.innerHTML = `<div class="ordline">${c.picked.length ? c.picked.map((ci, pi) => `<button class="chip on" ${lock ? "disabled" : `data-act="unpick" data-id="${pi}"`}>${esc(c.chips[ci])}</button>`).join("") : '<span class="ph">Tippe die Wörter in der richtigen Reihenfolge an</span>'}</div><div class="chips">${c.chips.map((w, i) => (c.picked.includes(i) ? `<span class="chip ghost">${esc(w)}</span>` : `<button class="chip" ${lock ? "disabled" : `data-act="pick" data-id="${i}"`}>${esc(w)}</button>`)).join("")}</div>`;
}

function localCheck(user, acc, strict) {
  const u = norm(user);
  if (acc.some(a => norm(a) === u)) return { correct: true };
  if (!strict && acc.some(a => loose(a) === loose(user)))
    return { correct: true, note: "Fast perfekt – " + SP.charNote + ". Richtig: " + acc[0] };
  return { correct: false };
}
function answerMC(i) {
  const se = SESSION;
  if (se.locked) return;
  se.locked = true;
  const ex = se.items[se.idx],
    o = se.cur.opts[i];
  document.querySelectorAll('[data-act="dunno"]').forEach(b => (b.style.display = "none"));
  document.querySelectorAll(".opt").forEach((b, j) => {
    b.disabled = true;
    if (se.cur.opts[j].ok) b.classList.add("right");
    else if (j === i) b.classList.add("wrong");
  });
  const res = { correct: o.ok, note: ex.x || "" };
  record(ex, o.o, res);
  showFb(res, ex);
}
async function checkAnswer() {
  const se = SESSION;
  if (!se || se.locked) return;
  const ex = se.items[se.idx];
  if (ex.t === "tab") return checkTable(se, ex);
  if (FMT[ex.t]) return FMT[ex.t].check(se, ex);
  let user, acc;
  if (ex.t === "ord") {
    if (!se.cur.picked.length) return;
    user = se.cur.picked.map(i => se.cur.chips[i]).join(" ");
    acc = [ex.a];
  } else {
    user = ($("#ans").value || "").trim();
    if (!user) return;
    acc = ex.t === "gap" ? [...ex.a, ...ex.a.map(a => ex.q.replace("___", a))] : ex.a;
  }
  se.locked = true;
  const inp = $("#ans");
  if (inp) inp.disabled = true;
  if (ex.t === "ord") renderOrd();
  document.querySelectorAll('[data-act="check"],[data-act="dunno"]').forEach(b => (b.style.display = "none"));
  let res = localCheck(user, acc, !!ex.s);
  if (!res.correct && ex.t !== "ord" && aiReady()) {
    $("#fb").innerHTML = `<div class="fb wait">${APP.teacher} prüft deine Antwort ${dots()}</div>`;
    try {
      const j = await aiJudge(ex, user);
      res = { correct: !!j.correct, ai: j.feedback, correction: j.correction, aid: j._aid };
    } catch (e) {
      res = { correct: false, offline: true };
    }
  }
  if (SESSION !== se) return;
  record(ex, user, res);
  showFb(res, ex);
}
function tabMark(ex, user, showAll) {
  const gaps = tabGaps(ex);
  let allOk = true,
    near = false;
  document.querySelectorAll(".tcell").forEach((inp, k) => {
    inp.disabled = true;
    const r = user[k] ? localCheck(user[k], gaps[k], !!ex.s) : { correct: false };
    if (r.note) near = true;
    if (!r.correct) allOk = false;
    if (showAll && !user[k]) {
      inp.value = "";
      inp.placeholder = "";
    }
    inp.classList.add(r.correct ? "ok" : "no");
    if (!r.correct || r.note) inp.insertAdjacentHTML("afterend", `<span class="sol">${esc(gaps[k][0])}</span>`);
  });
  return { allOk, near };
}
function checkTable(se, ex) {
  const cells = [...document.querySelectorAll(".tcell")],
    user = cells.map(i => i.value.trim());
  if (!user.some(Boolean)) return;
  se.locked = true;
  document.querySelectorAll('[data-act="check"],[data-act="dunno"]').forEach(b => (b.style.display = "none"));
  const m = tabMark(ex, user),
    n = user.length,
    ok = cells.filter(c => c.classList.contains("ok")).length;
  const res = {
    correct: m.allOk,
    note:
      (m.allOk ? "" : `${ok} von ${n} Feldern richtig – die Lösungen stehen grün unter den falschen Feldern.`) +
      (m.near ? " Achte auf ä und ö." : "") +
      (ex.x ? " " + ex.x : "")
  };
  record(ex, user.map(x => x || "–").join(", "), res);
  showFb(res, ex);
}
function dunno() {
  const se = SESSION;
  if (!se || se.kind !== "topic" || se.locked) return;
  se.locked = true;
  const ex = se.items[se.idx];
  const inp = $("#ans");
  if (inp) inp.disabled = true;
  if (ex.t === "mc")
    document.querySelectorAll(".opt").forEach((b, j) => {
      b.disabled = true;
      if (se.cur.opts[j].ok) b.classList.add("right");
    });
  if (ex.t === "ord") renderOrd();
  if (FMT[ex.t]) FMT[ex.t].dunno(se, ex);
  if (ex.t === "tab")
    tabMark(
      ex,
      [...document.querySelectorAll(".tcell")].map(() => ""),
      true
    );
  document.querySelectorAll('[data-act="check"],[data-act="dunno"]').forEach(b => (b.style.display = "none"));
  const res = { correct: false, dunno: true, note: ex.x || "" };
  record(ex, "(weiß ich nicht)", res);
  showFb(res, ex);
}
/* Schild an KI-Übungen: ungeprüft / von Claude geprüft / fehlerhaft */
function genBadge(gid) {
  const v = genVerdictOf(gid);
  if (!v)
    return (
      '<span class="badge" style="margin-bottom:8px;display:inline-block;background:var(--lakka-bg);color:var(--lakka-ink)">Neue Übung von ' +
      APP.teacher +
      " – noch nicht von Claude geprüft</span>"
    );
  return v.ok
    ? '<span class="badge" style="margin-bottom:8px;display:inline-block;background:var(--kuusi-bg);color:var(--kuusi)">✓ von Claude geprüft</span>'
    : `<span class="badge" style="margin-bottom:8px;display:inline-block;background:var(--puolukka-bg);color:var(--puolukka)">✗ laut Claude fehlerhaft${v.korrektur ? " – richtig: " + esc(v.korrektur) : ""}</span>`;
}
function record(ex, user, res) {
  const se = SESSION,
    q = promptText(ex),
    exp = res.correction || expectedText(ex);
  const a = S.active && S.active.id === se.id ? S.active : null,
    retry = !!(a && a.rt && a.rt[se.idx]);
  const src = a ? srcOf(a, se.idx) : { tid: se.id, ei: -1 };
  se.results.push({ q, user, exp, correct: res.correct, retry, hint: se.hint || null });
  if (ex.gid && !retry) {
    const set = (S.genReview || []).find(x => ex.gid.startsWith(x.id + "-"));
    if (set) (set.res = set.res || {})[ex.gid] = !!res.correct;
  }
  if (!res.correct && !retry) {
    const e = { d: Date.now(), topic: src.tid, ei: src.ei, q, user, exp };
    if (src.ei < 0) e.gx = ex;
    S.errors.unshift(e);
    S.errors = S.errors.slice(0, 80);
  }
  if (se.mode === "errors" && res.correct && !retry) {
    const k = errKey({ topic: src.tid, ei: src.ei, q });
    S.errors.forEach(e => {
      if (errKey(e) === k) e.ok = 1;
    });
  }
  if (a) {
    const exi = a.idxs[se.idx];
    if (res.correct && src.ei >= 0) {
      const dt = exDoneToday();
      const k = src.tid + ":" + src.ei;
      if (!dt.k.includes(k)) dt.k.push(k);
    } else {
      const pos = Math.min(se.idx + 4, a.idxs.length);
      a.idxs.splice(pos, 0, exi);
      a.rt.splice(pos, 0, 1);
      se.items.splice(pos, 0, ex);
      res.requeue = true;
    }
    a.idx = se.idx + 1;
    a.results = se.results.slice();
  }
  save();
}
function showFb(res, ex) {
  const exp = res.correction || expectedText(ex);
  let h = `<div class="fb ${res.correct ? "ok" : res.dunno ? "dunno" : "bad"}"><b class="t">${res.correct ? "Oikein! Richtig." : res.dunno ? "Kein Problem – hier ist die Lösung." : "Väärin – leider falsch."}</b>`;
  const fin =
    ex.t === "gap" || ex.t === "ord" || (ex.t === "tr" && ex.dir === "de") || !!(FMT[ex.t] && FMT[ex.t].target);
  if (!res.correct && ex.t !== "tab" && !(FMT[ex.t] && FMT[ex.t].inline))
    h += `<p>${ex.t === "sch" ? (res.correction ? "Korrigiert:" : "Musterlösung:") : "Richtig ist:"} ${fin ? spk(exp) : ""}<b>${fin ? glossWords(exp) : esc(exp)}</b></p>`;
  else if (fin) h += `<p>${spk(exp)}${glossWords(exp)}</p>`;
  if (ex.t === "sch" && ex.a.length && norm(exp) !== norm(ex.a[0]))
    h += `<p class="muted">Musterlösung: ${spk(ex.a[0])}${glossWords(ex.a[0])}</p>`;
  if (res.note) h += `<p>${esc(res.note)}</p>`;
  if (res.ai) h += `<p>${esc(res.ai)}</p>${flagLink(res.aid)}`;
  if (SESSION && SESSION.mode === "gen" && S.active && S.active.genAid)
    h += flagLink(S.active.genAid, "Übung fehlerhaft?");
  if (res.offline)
    h += `<p class="muted">${APP.teacher} war nicht erreichbar (${esc(aiErrShort())}), daher nur der Vergleich mit der Musterlösung. <a href="#" data-act="aidiag">Verbindung prüfen</a></p>`;
  if (res.requeue) h += `<p class="muted">↻ Diese Übung kommt gleich nochmal – bis du sie richtig hast.</p>`;
  h += `</div><div class="btnrow"><button class="btn" data-act="next" id="nextbtn">Weiter</button></div>`;
  $("#fb").innerHTML = h;
  if (fin && S.settings.autoplay) speak(exp);
  const n = $("#nextbtn");
  if (n) n.focus();
}
function nextEx() {
  const se = SESSION;
  se.idx++;
  if (se.idx >= se.items.length) finishTopic();
  else {
    renderEx();
    scrollTo(0, 0);
  }
}

function finishTopic() {
  const se = SESSION,
    t = T(se.id) || { id: se.id, title: se.title },
    res = se.results.filter(r => !r.retry),
    ok = res.filter(r => r.correct).length,
    score = res.length ? ok / res.length : 1;
  se.score = score;
  const retries = se.results.length - res.length;
  const wrong = res.filter(r => !r.correct);
  let h = `<div class="card center"><div class="label">${esc(se.title || t.title)}</div><div class="ring" style="--p:${Math.round(score * 100)}"><span>${Math.round(score * 100)}%</span></div><p>${ok} von ${res.length} beim ersten Versuch richtig</p>${retries ? `<p class="muted">${retries}× nochmal geübt – am Ende hattest du alles richtig ✓</p>` : ""}</div>`;
  const helped = res.filter(r => r.hint && r.correct);
  if (helped.length)
    h += `<div class="card"><h3 style="margin-top:0">Mit Vokabelhilfe gelöst</h3><p class="muted">Die Grammatik hast du selbst gebildet – diese Wörter kommen in deinen Vokabeln (${APP.base.name} → ${APP.target.name}) früher wieder:</p>${helped.map(r => `<div class="err"><div>${esc(r.q)}</div><div class="u">💡 ${esc(r.hint.join(", "))}</div></div>`).join("")}</div>`;
  if (wrong.length)
    h += `<div class="card"><h3 style="margin-top:0">Das ging daneben</h3>${wrong.map(r => `<div class="err"><div>${esc(r.q)}</div><div class="u">Deine Antwort: ${esc(r.user)}</div><div class="r">Richtig: ${esc(r.exp)}</div></div>`).join("")}</div>`;
  if (isFree(se.mode)) {
    bumpStreak();
    S.stats.sessions++;
    S.active = null;
    save();
    SESSION = null;
    if (se.mode === "errors") {
      const left = openErrors().length;
      h += `<div class="card center"><p>${left ? `Noch ${left} offene Fehler – richtig beim ersten Versuch gilt als gelöst.` : "Alle Fehler gelöst – stark!"}</p></div><div class="btnrow">${left ? `<button class="btn" data-act="errtrain">Nächste Runde</button>` : ""}<button class="btn ${left ? "ghost" : ""}" data-act="tab" data-id="today">Zurück zu Heute</button></div>`;
    } else {
      if (se.mode === "gen")
        h += `<div class="card" style="border-color:var(--lakka)"><b>Diese Übungen hat ${APP.teacher} erzeugt.</b><p class="muted" style="margin:4px 0 0">Schick Claude deinen Bericht (${APP.tabs[3][0]} → Bericht für Claude), damit er sie auf Richtigkeit prüft. Fehlerhafte Übungen werden danach aus deinem Fehler-Training entfernt.</p></div>`;
      h += `<button class="btn" data-act="topic" data-id="${t.id}">Zurück zum Thema</button>`;
    }
  } else
    h += `<div class="card" id="ratebox"><h3 style="margin-top:0">Wie sicher fühlst du dich?</h3><p class="muted">Deine Einschätzung und dein Ergebnis fließen in den Plan ein. Danach prüft ${APP.teacher}, wann das Thema wiederkommt.</p><div class="rates">${RATINGS.map(r => `<button class="rate ${r.k}" data-act="rate" data-id="${r.k}"><b>${r.l}</b><small>${r.fi}</small></button>`).join("")}</div></div>`;
  app().innerHTML = h;
  scrollTo(0, 0);
}
async function rateTopic(k) {
  const se = SESSION;
  if (!se || se.rated) return;
  se.rated = true;
  const t = T(se.id),
    s = S.topics[se.id],
    score = se.score;
  let q = RQ[k];
  if (score < 0.6) q = Math.min(q, 2);
  else if (score < 0.8) q = Math.min(q, 3);
  const base = sm2Next(s, q),
    baseDays = Math.max(1, base.interval);
  s.ease = base.ease;
  s.reps = base.reps;
  s.lapses = base.lapses;
  s.last = score;
  s.best = Math.max(s.best || 0, score);
  s.hist.push({ d: Date.now(), sc: Math.round(score * 100), r: k });
  s.hist = s.hist.slice(-30);
  const wasNew = s.status === "new";
  if (wasNew) {
    s.status = "learning";
    addCards(t);
    S.daily.newTopics++;
  }
  s.interval = baseDays;
  s.due = addDays(baseDays);
  s.ai = { ...(s.ai || {}), reason: "Plan nach Algorithmus" };
  bumpStreak();
  S.stats.sessions++;
  S.sinceGlobal++;
  S.active = null;
  const opened = refreshUnlocks();
  save();
  const unl = opened.length
    ? `<div class="card" style="border-color:var(--kuusi)"><b style="color:var(--kuusi)">Neu freigeschaltet:</b> ${opened.map(o => esc(o.title)).join(", ")}</div>`
    : "";
  const words = wasNew ? `<p class="muted">${t.v.length} neue Wörter warten im Bereich Vokabeln.</p>` : "";
  const box = $("#ratebox");
  const miss =
    se.mode === "unlock" && score < 0.8
      ? `<div class="card" style="border-color:var(--lakka)"><b>Noch nicht 80 %</b> – du kannst jederzeit einen neuen Freischaltversuch starten. Tipp: zuerst die Fehler oben ansehen und das Fehler-Training machen.</div>`
      : "";
  const tail = `${miss}${unl}<div class="btnrow"><button class="btn" data-act="tab" data-id="today">Weiter</button></div>`;
  if (!aiReady()) {
    box.innerHTML = `<div class="plan" style="border:0;margin:0;padding:0">Nächste Wiederholung: <b>${relDays(s.due)}</b> (${fmtDate(s.due)})</div>${words}`;
    box.insertAdjacentHTML("afterend", tail);
    SESSION = null;
    return;
  }
  box.innerHTML = `<p class="muted">${APP.teacher} wertet deine Runde aus ${dots()}</p>`;
  try {
    const j = await aiSessionReview(
      t,
      s,
      se.results.filter(r => !r.retry),
      score,
      k,
      baseDays
    );
    const d = clampInt(j.intervalDays, 1, 180) || baseDays;
    s.interval = d;
    s.due = addDays(d);
    s.ai = { feedback: j.feedback, tips: j.tips || [], reason: j.reason || "", date: Date.now() };
    save();
    box.classList.add("aibox");
    box.innerHTML = `<div class="label">${APP.teacher}</div>${flagLink(j._aid)}<p>${esc(j.feedback)}</p>${(j.tips || []).length ? `<ul>${j.tips.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}<div class="plan">Nächste Wiederholung: <b>${relDays(s.due)}</b> (${fmtDate(s.due)})<br><small>${esc(j.reason || "")}</small></div>${words}`;
  } catch (e) {
    box.innerHTML = `<div class="plan" style="border:0;margin:0;padding:0">Nächste Wiederholung: <b>${relDays(s.due)}</b> (${fmtDate(s.due)})<br><small>${APP.teacher} war nicht erreichbar (${esc(aiErrShort())}), daher gilt der Standardplan.</small></div>${words}`;
  }
  box.insertAdjacentHTML("afterend", tail);
  SESSION = null;
}

/* Gemeinsamer Abschlussbildschirm für Vokabel- und Hörrunden */
function doneScreen(msg, extra) {
  app().innerHTML = `<div class="card center"><p class="ftitle">Hienoa!</p><p style="margin-top:8px">${msg}</p>${extra || ""}</div>`;
}
function againRow(act) {
  return `<div class="btnrow"><button class="btn" data-act="${act}">Noch eine Runde</button><button class="btn ghost" data-act="tab" data-id="vocab">Fertig</button></div>`;
}
/* ---------- Vokabeln ---------- */
/* ---------- Neues Thema: zuerst die Wörter (Wunsch von Matthias) ----------
   Beide Richtungen, falsche Karten kommen in der Runde wieder. Jede Karte, die einmal mit Schwer/Gut/Einfach
   bewertet wurde, bekommt c.tv = 1. Sind alle Karten des Themas so markiert, gilt S.topics[id].vocabDone und die
   Übungen werden frei. Diese Wörter zählen nicht gegen „Neue Wörter pro Tag“. */
function topicVocabIds(id) {
  const t = T(id);
  return t ? t.v.flatMap((w, i) => [id + "-" + i, id + "-" + i + "-r"]) : [];
}
function vocabReady(id) {
  const s = S.topics[id],
    t = T(id);
  return !t || !t.v.length || !s || s.status !== "new" || !!s.vocabDone || !!(S.active && S.active.id === id);
}
function topicVocabProgress(id) {
  const ids = topicVocabIds(id);
  return { ok: ids.filter(x => S.cards[x] && S.cards[x].tv).length, all: ids.length };
}
function startTopicVocab(id) {
  const t = T(id);
  if (!t) return;
  addCards(t);
  const open = x => !(S.cards[x] && S.cards[x].tv),
    fwd = t.v.map((w, i) => id + "-" + i);
  /* erst alle Finnisch → Deutsch, dann alle Deutsch → Finnisch – so stehen die beiden Richtungen eines Wortes nie direkt hintereinander */
  const q = [...shuffle(fwd.filter(open)), ...shuffle(fwd.map(x => x + "-r").filter(open))];
  if (!q.length) {
    S.topics[id].vocabDone = Date.now();
    save();
    return render();
  }
  save();
  SESSION = { kind: "vocab", queue: q, done: 0, again: 0, shown: false, topicVocab: id };
  CUR = { tab: "topics", arg: id };
  setTab("topics");
  renderCard();
  scrollTo(0, 0);
}
function startVocab() {
  const q = onePerWord([...shuffle(dueCards()), ...newCardsAvail()]);
  if (!q.length) {
    toast("Gerade keine Karten fällig");
    return;
  }
  SESSION = { kind: "vocab", queue: q, done: 0, again: 0, shown: false };
  CUR = { tab: "vocab", arg: null };
  setTab("vocab");
  renderCard();
}
function extraNewCards() {
  return onePerWord([...newFwdIds(), ...newRevIds()]);
}
/* Was „Zusätzlich Vokabeln lernen“ als Nächstes bringt (Heute + Rundenende) */
function allPracticedToday() {
  const L = learnedCardIds(),
    sod = startOfDay();
  return L.length > 0 && L.every(id => (S.cards[id].xp || 0) >= sod);
}
function extraVocabText() {
  const nx = extraNewCards().length,
    n = S.settings.extraCards;
  if (!nx && allPracticedToday())
    return `Alle ${learnedWords()} gelernten Wörter hast du heute schon extra geübt – jetzt kommen Wiederholungen. Tipp: Morgen weiterüben bringt mehr, oder lerne ein neues Thema für neue Wörter.`;
  return nx
    ? nx < n
      ? `${nx} weitere neue ${nx === 1 ? "Wort" : "Wörter"} (mehr gibt es gerade nicht) – über dein Tageslimit hinaus.`
      : `${n} weitere neue Wörter – über dein Tageslimit hinaus.`
    : `${Math.min(n, onePerWord(learnedCardIds()).length)} gelernte Wörter extra üben – vergessene Wörter kommen früher wieder.`;
}
function learnedCardIds() {
  return Object.keys(S.cards).filter(id => !S.cards[id].isNew && cardWord(id));
}
function startExtraVocab() {
  const nw = extraNewCards().slice(0, S.settings.extraCards);
  if (nw.length) SESSION = { kind: "vocab", queue: nw, done: 0, again: 0, shown: false, extra: "new" };
  else {
    const sod = startOfDay(),
      xpToday = id => (S.cards[id].xp || 0) >= sod;
    /* heute schon extra Geübtes erst, wenn alle anderen dran waren */
    const pool = shuffle(learnedCardIds()),
      learned = onePerWord([...pool.filter(id => !xpToday(id)), ...pool.filter(xpToday)]).slice(
        0,
        S.settings.extraCards
      );
    if (!learned.length) {
      toast("Lerne zuerst ein Thema");
      return;
    }
    SESSION = { kind: "vocab", queue: learned, done: 0, again: 0, shown: false, extra: "practice" };
  }
  CUR = { tab: "vocab", arg: null };
  setTab("vocab");
  renderCard();
  scrollTo(0, 0);
}
function renderCard() {
  const se = SESSION;
  if (!se.queue.length) return finishVocab();
  const id = se.queue[0],
    w = cardWord(id),
    c = S.cards[id];
  if (!w) {
    se.queue.shift();
    return renderCard();
  }
  se.dir = cardDir(id);
  se.shown = false;
  app().innerHTML = `<div class="sbar"><small>${se.queue.length} übrig</small><span style="flex:1"></span>${se.hist && se.hist.length ? `<button class="xbtn" data-act="cundo">↶ Zurück</button>` : ""}${se.topicVocab ? `<button class="xbtn" data-act="topic" data-id="${se.topicVocab}">Später</button>` : `<button class="xbtn" data-act="tab" data-id="vocab">Beenden</button>`}</div>
  <div class="card flash"><div class="ask">${se.topicVocab ? `<span class="badge">${esc((T(se.topicVocab) || {}).title || "")}</span> ` : ""}${se.extra ? '<span class="badge">Extra</span> ' : ""}${se.extra === "practice" && c.xpd === todayKey() && c.xpn ? `<span class="badge" style="background:var(--lakka-bg);color:var(--lakka-ink)">heute schon ${c.xpn}× geübt</span> ` : ""}${c.isNew ? '<span class="badge new">Neues Wort</span> ' : ""}${se.dir === "fi" ? "Was heißt das auf " + APP.base.name + "?" : "Wie heißt das auf " + APP.target.name + "?"}</div>
  <div class="front">${esc(se.dir === "fi" ? w[0] : w[1])}</div>${se.dir === "fi" ? `<div class="center" style="margin-bottom:14px">${spk(w[0], true)}</div>` : ""}<div id="back"></div>
  <div id="cact">${se.dir === "de" ? charKeys() : ""}<input id="ans" class="inp" placeholder="Antwort tippen (optional)" autocomplete="off" autocapitalize="off" spellcheck="false"><div class="btnrow"><button class="btn" data-act="flip">Aufdecken</button></div></div></div>`;
  if (se.dir === "fi" && S.settings.autoplay) speak(w[0]);
}
const VOC_AI = {};
async function vocabJudge(w, dir, typed) {
  const k = dir + "|" + w[0] + "|" + norm(typed);
  if (VOC_AI[k]) return VOC_AI[k];
  const p = `Vokabelkarte (${dir === "fi" ? APP.target.name + " → " + APP.base.name : APP.base.name + " → " + APP.target.name})
${APP.target.name}: ${w[0]}
${APP.base.name}: ${w[1]}
Gefragt war: ${dir === "fi" ? "die " + APP.base.adj + "e Bedeutung von „" + w[0] + "“" : "das " + APP.target.adj + "e Wort/den " + APP.target.adj + "en Ausdruck für „" + w[1] + "“"}
Antwort des Schülers: "${typed}"

Bewerte, ob der Schüler die Vokabel kann. Es geht um die Bedeutung, nicht um den exakten Wortlaut.${dir === "fi" ? " Auf " + APP.base.name + " zählt jede gleichwertige Formulierung als richtig: Kurz- und Langformen (z. B. „wie geht's“ = „wie geht es dir“ = „wie geht es“), Synonyme, andere Wortstellung, mit oder ohne Artikel/Pronomen, Umgangssprache, Groß-/Kleinschreibung, Tippfehler. Falsch nur, wenn die Bedeutung nicht stimmt." : " Auf " + APP.target.name + " zählen gleichwertige Alternativen (Umgangs-/Standardform, weggelassenes Personalpronomen, Groß-/Kleinschreibung, Satzzeichen) und kleine Tippfehler, die kein anderes Wort ergeben, als richtig. Ein anderes Wort, eine falsche Endung oder eine falsche Form ist falsch."}
JSON: {"correct": true oder false, "feedback": "1 kurzer Satz auf ${APP.explain}"}`;
  const meta = { k: "vokabel" },
    j = await aiJSON(p, meta);
  j._aid = aiAudit("vokabel", meta, {
    q: `${dir === "fi" ? "fi→de" : "de→fi"}: ${w[0]} = ${w[1]}`,
    u: typed,
    ok: !!j.correct,
    r: `${j.correct ? "richtig" : "falsch"} – ${j.feedback || ""}`
  });
  VOC_AI[k] = j;
  return j;
}
/* Eigene Eingabe mit der Lösung vergleichen: Buchstaben, die nicht zur Lösung passen, werden markiert */
function charDiff(typed, ref) {
  const a = [...typed],
    b = [...ref],
    L = x => x.toLowerCase();
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      dp[i][j] = L(a[i]) === L(b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  let i = 0,
    j = 0,
    out = "";
  while (i < a.length) {
    if (j < b.length && L(a[i]) === L(b[j])) {
      out += esc(a[i]);
      i++;
      j++;
    } else if (j < b.length && dp[i][j + 1] >= dp[i + 1][j]) j++;
    else out += `<b class="dx">${esc(a[i++])}</b>`;
  }
  return out;
}
function closest(typed, list) {
  const n = s => norm(s).replace(/\s+/g, "");
  let best = list[0] || "",
    sc = -1;
  list.forEach(x => {
    const a = n(typed),
      b = n(x);
    let m = 0;
    for (const ch of a) if (b.includes(ch)) m++;
    const s = m - Math.abs(a.length - b.length);
    if (s > sc) {
      sc = s;
      best = x;
    }
  });
  return best;
}
function flipCard() {
  const se = SESSION;
  if (se.shown) return;
  se.shown = true;
  const id = se.queue[0],
    w = cardWord(id),
    c = S.cards[id];
  const typed = ($("#ans")?.value || "").trim();
  const dir = se.dir;
  let cmp = "",
    askAI = false;
  if (typed) {
    const acc =
      dir === "de"
        ? [w[0]]
        : [
            w[1],
            ...w[1].replace(/\(.*?\)/g, "").split(/[,/;]/),
            ...(w[1].match(/\((.*?)\)/g) || [])
              .flatMap(x => x.slice(1, -1).split(/[,;]/))
              .map(x => x.replace(/^\s*auch:\s*/, ""))
          ]
            .map(x => x.trim())
            .filter(Boolean);
    const r = localCheck(typed, acc, false);
    se.typed = typed;
    const mine = `<div class="cmp typed">Deine Eingabe: <span class="mine">${r.correct ? esc(typed) : charDiff(typed, closest(typed, acc))}</span></div>`;
    if (r.correct)
      cmp = `${mine}<div class="cmp" style="color:var(--kuusi)">✓ Richtig getippt${r.note ? " – " + SP.charNote : ""}</div>`;
    else if (aiReady()) {
      askAI = true;
      cmp = `${mine}<div class="cmp muted" id="vjudge">${APP.teacher} prüft ${dots()}</div>`;
    } else cmp = `${mine}<div class="cmp" style="color:var(--puolukka)">✗ Stimmt nicht mit der Lösung überein</div>`;
  } else se.typed = "";
  $("#back").innerHTML =
    `<div class="backside">${esc(dir === "fi" ? w[1] : w[0])}<small>${esc(dir === "fi" ? w[0] : w[1])}</small></div>${dir === "de" ? `<div class="center" style="margin-bottom:12px">${spk(w[0], true)}</div>` : ""}${cmp}<div id="askex"><p class="aiflagp"><a href="#" class="aiflag" data-act="askex">❓ Frag ${esc(APP.teacher)}</a></p></div>`;
  if (askAI)
    vocabJudge(w, dir, typed)
      .then(j => {
        const el = $("#vjudge");
        if (!el || SESSION !== se) return;
        el.classList.remove("muted");
        el.style.color = j.correct ? "var(--kuusi)" : "var(--puolukka)";
        el.innerHTML = (j.correct ? "✓ Richtig – " : "✗ Nicht ganz – ") + esc(j.feedback || "") + flagLink(j._aid);
      })
      .catch(() => {
        const el = $("#vjudge");
        if (!el || SESSION !== se) return;
        el.classList.remove("muted");
        el.style.color = "var(--puolukka)";
        el.innerHTML = `✗ Stimmt nicht mit der Lösung überein <small class="muted">(${APP.teacher} nicht erreichbar: ${esc(aiErrShort())})</small>`;
      });
  if (se.dir === "de" && S.settings.autoplay) speak(w[0]);
  $("#cact").innerHTML = `<div class="rates">${RATINGS.map(r => {
    const n = sm2Next(c, r.q);
    return `<button class="rate ${r.k}" data-act="crate" data-id="${r.k}"><b>${r.l}</b><small>${se.extra === "practice" ? r.fi : ivLabel(n.interval)}</small></button>`;
  }).join("")}</div>`;
}
/* Gelernte Wörter extra üben: wirkt vorsichtig auf den Plan der Karte.
   Nochmal = wie ein Fehler (morgen wieder, Abstand von vorn); Schwer = Termin rückt auf die halbe Restzeit;
   Gut/Einfach = bei Fälligkeit in ≤ 2 Tagen eine normale Wiederholung; sonst Anrechnung nach der echten Pause seit der
   letzten Wiederholung (wie Anki bei vorgezogenen Wiederholungen): neuer Abstand = Pause × Ease (Einfach × 1,3),
   nur wenn das später liegt als der bisherige Termin. Am selben Tag keine Verlängerung (Kurzzeitgedächtnis).
   c.xp = zuletzt extra geübt (damit heute Geübtes nicht in Dauerschleife kommt). */
function practiceRate(c, q) {
  if (!c) return;
  const now = Date.now();
  c.xp = now;
  if (c.xpd !== todayKey()) {
    c.xpd = todayKey();
    c.xpn = 0;
  }
  c.xpn++;
  if (q < 3) {
    Object.assign(c, sm2Next(c, q));
    c.due = addDays(1);
    c.last = now;
    S.stats.reviews++;
    return;
  }
  const left = (c.due || now) - now;
  if (q === 3) {
    if (left > 0) {
      const d = Math.max(1, Math.ceil(left / DAY / 2));
      c.due = Math.min(c.due, addDays(d));
      c.interval = Math.max(1, Math.round((c.interval || 1) / 2));
    }
    c.ease = Math.max(1.3, (c.ease || 2.5) - 0.15);
    c.last = now;
    S.stats.reviews++;
    return;
  }
  if (left <= 2 * DAY) {
    const n = sm2Next(c, q);
    Object.assign(c, n);
    c.due = addDays(n.interval);
    c.last = now;
    S.stats.reviews++;
    return;
  }
  const lastRev = c.last || (c.due || now) - (c.interval || 0) * DAY,
    pause = Math.floor((startOfDay(now) - startOfDay(lastRev)) / DAY);
  if (pause < 1) return;
  const iv = Math.round(pause * (c.ease || 2.5) * (q === 5 ? 1.3 : 1));
  if (addDays(iv) > c.due) {
    c.due = addDays(iv);
    c.interval = iv;
    c.reps = (c.reps || 0) + 1;
    c.last = now;
    S.stats.reviews++;
  }
}
function rateCard(k) {
  const se = SESSION;
  if (!se || !se.shown) return;
  /* Schnappschuss für „↶ Zurück“: Karte, Zähler und Rundenstand vor dieser Bewertung */
  {
    const id = se.queue[0];
    (se.hist = se.hist || []).push({
      id,
      card: JSON.stringify(S.cards[id]),
      newCards: S.daily.newCards,
      newRev: S.daily.newRev || 0,
      reviews: S.stats.reviews,
      queue: se.queue.slice(),
      done: se.done,
      again: se.again,
      seen: { ...(se.seen || {}) }
    });
  }
  if (se.extra === "practice") {
    const id = se.queue.shift(),
      q = RQ[k];
    se.seen = se.seen || {};
    if (!se.seen[id]) {
      se.seen[id] = 1;
      practiceRate(S.cards[id], q);
    } /* nur die erste Antwort je Karte zählt */
    if (q < 3) {
      se.queue.push(id);
      se.again++;
    } else se.done++;
    save();
    return renderCard();
  }
  const id = se.queue.shift(),
    c = S.cards[id],
    q = RQ[k],
    n = sm2Next(c, q);
  if (c.isNew) {
    c.isNew = false;
    if (!se.topicVocab) {
      if (cardParse(id).rev) S.daily.newRev = (S.daily.newRev || 0) + 1;
      else S.daily.newCards++;
    }
  }
  if (se.topicVocab && q >= 3) c.tv = 1;
  Object.assign(c, n);
  c.last = Date.now();
  if (q < 3) {
    c.due = Date.now() + 60000;
    se.queue.push(id);
    se.again++;
  } else {
    c.due = addDays(n.interval);
    se.done++;
  }
  S.stats.reviews++;
  save();
  renderCard();
}
/* „↶ Zurück“: letzte Bewertung vollständig rückgängig machen und die Karte aufgedeckt wieder zeigen */
let VOCAB_DONE = null;
function undoCard() {
  if (!SESSION && VOCAB_DONE) {
    SESSION = VOCAB_DONE;
    CUR = { tab: "vocab", arg: null };
    setTab("vocab");
  }
  VOCAB_DONE = null;
  const se = SESSION;
  if (!se || se.kind !== "vocab" || !se.hist || !se.hist.length) return;
  const x = se.hist.pop();
  S.cards[x.id] = JSON.parse(x.card);
  if (se.topicVocab && S.topics[se.topicVocab]) S.topics[se.topicVocab].vocabDone = null;
  S.daily.newCards = x.newCards;
  S.daily.newRev = x.newRev;
  S.stats.reviews = x.reviews;
  se.queue = x.queue;
  se.done = x.done;
  se.again = x.again;
  se.seen = x.seen;
  save();
  renderCard();
  flipCard();
  toast("Letzte Bewertung zurückgenommen – wähle neu");
}
function finishVocab() {
  const se = SESSION;
  bumpStreak();
  save();
  SESSION = null;
  VOCAB_DONE = se;
  if (se.topicVocab) {
    const id = se.topicVocab,
      pr = topicVocabProgress(id);
    if (pr.ok === pr.all) S.topics[id].vocabDone = Date.now();
    save();
    return doneScreen(
      pr.ok === pr.all
        ? `Alle ${pr.all / 2} Wörter in beiden Richtungen gewusst – die Übungen sind jetzt frei.`
        : `${pr.ok} von ${pr.all} Karten geschafft.`,
      `<div class="btnrow">${pr.ok === pr.all ? `<button class="btn" data-act="learn" data-id="${id}">Weiter zu den Übungen</button>` : `<button class="btn" data-act="tvocab" data-id="${id}">Weiterlernen</button>`}</div><div class="btnrow">${se.hist && se.hist.length ? `<button class="btn ghost" data-act="cundo">↶ Letzte Bewertung ändern</button>` : ""}<button class="btn ghost" data-act="topic" data-id="${id}">Zum Thema</button></div>`
    );
  }
  doneScreen(
    `${se.done} ${se.done === 1 ? "Karte" : "Karten"} geschafft${se.again ? `, ${se.again}× wiederholt` : ""}.`,
    (learnedCardIds().length || extraNewCards().length
      ? `<div class="btnrow"><button class="btn" data-act="extravocab">${se.extra ? "Weitere Vokabeln lernen" : "Zusätzlich Vokabeln lernen"}</button></div><p class="muted" style="margin:6px 0 0">${esc(extraVocabText())}</p>`
      : "") +
      `<div class="btnrow">${se.hist && se.hist.length ? `<button class="btn ghost" data-act="cundo">↶ Letzte Bewertung ändern</button>` : ""}<button class="btn ghost" data-act="tab" data-id="today">Zurück zu Heute</button></div>`
  );
}
function renderVocab() {
  const dc = dueCards().length,
    nc = newCardsAvail().length;
  let h = `<h2>Vokabeln</h2><div class="next"><div class="label">Heute</div><h2>${dc} fällig, ${nc} neu</h2>${dc + nc ? `<button class="btn" data-act="vocab">Jetzt lernen</button>` : `<p>${Object.keys(S.cards).length ? "Für den Moment ist alles wiederholt." : "Lerne dein erstes Thema – dann landen die Wörter hier."}</p>`}</div>`;
  if (listenSentences().length >= 3)
    h += `<div class="card"><div class="label">Hörverstehen: ganze Sätze</div><p class="muted">Du hörst einen Satz aus deinen gelernten Themen und schreibst auf ${APP.base.name}, was er bedeutet. Der Wortlaut ist egal – ${APP.teacher} prüft die Bedeutung.</p><button class="btn ghost" data-act="listens">Sätze hören</button></div>`;
  if (learnedWords() >= 3)
    h += `<div class="card"><div class="label">Hörtraining</div><p class="muted">Du hörst ein gelerntes Wort und schreibst es auf ${APP.target.name}. Trainiert Ohr und Rechtschreibung, ohne deinen Lernplan zu verändern.</p><button class="btn ghost" data-act="listen">Hörtraining starten</button></div>`;
  if (Object.keys(S.cards).length)
    h += `<p class="muted" style="font-size:13px;margin:4px 2px 10px">${STATE_LEGEND}</p>`;
  TOPICS.forEach(t => {
    const ids = t.v.map((w, i) => t.id + "-" + i).filter(id => S.cards[id]);
    if (!ids.length) return;
    const stl = (id, lbl) => {
      const c = S.cards[id];
      if (!c) return "";
      const st = cardState(c);
      return `<span class="st ${st}">${lbl} ${STATE_L[st]}${c.isNew ? "" : " · " + relDays(c.due)}</span>`;
    };
    h += `<div class="card"><div class="label">${esc(t.title)}</div>${ids
      .map(id => {
        const w = cardWord(id);
        return `<div class="vrow" style="align-items:center">${spk(w[0])}<div class="vbody"><div><span class="w">${esc(w[0])}</span> <span class="d">${esc(w[1])}</span></div><div class="sts">${stl(id, "fi→de")}${stl(id + "-r", "de→fi")}</div></div></div>`;
      })
      .join("")}</div>`;
  });
  app().innerHTML = h;
}

/* ---------- Hörverstehen: ganze Sätze ---------- */
function listenSentences() {
  const out = [];
  TOPICS.forEach(t => {
    if (S.topics[t.id].status !== "learning") return;
    t.ex.forEach(e => {
      if (e.t === "tr" && e.dir === "fi") out.push({ fi: e.q, de: e.a });
      else if (e.t === "tr" && e.dir === "de") out.push({ fi: e.a[0], de: [e.q] });
      else if (e.t === "ord") out.push({ fi: e.a, de: [e.de] });
    });
  });
  const seen = new Set();
  return out.filter(x => {
    const k = norm(x.fi);
    if (seen.has(k) || x.fi.split(" ").length < 2) return false;
    seen.add(k);
    return true;
  });
}
function startListenS() {
  const q = shuffle(listenSentences()).slice(0, 8);
  if (!q.length) return;
  SESSION = { kind: "listenS", queue: q, idx: 0, ok: 0, shown: false };
  CUR = { tab: "vocab", arg: null };
  setTab("vocab");
  renderListenS();
}
function renderListenS() {
  const se = SESSION;
  if (se.idx >= se.queue.length) {
    const n = se.queue.length,
      ok = se.ok;
    SESSION = null;
    bumpStreak();
    save();
    doneScreen(`${ok} von ${n} Sätzen verstanden.`, againRow("listens"));
    return;
  }
  const x = se.queue[se.idx];
  se.shown = false;
  app().innerHTML = `<div class="sbar"><div class="prog"><i style="width:${(se.idx / se.queue.length) * 100}%"></i></div><small>${se.idx + 1}/${se.queue.length}</small><button class="xbtn" data-act="tab" data-id="vocab">Beenden</button></div>
  <div class="card flash"><div class="ask">Was bedeutet der Satz? Schreib ihn auf ${APP.base.name}.</div><div class="center" style="padding:22px 0">${spk(x.fi, true)}</div>
  <input id="ans" class="inp" autocomplete="off" spellcheck="false" placeholder="Auf ${APP.base.name} …"><div class="btnrow"><button class="btn ghost" data-act="lsreveal">Text zeigen</button><button class="btn" data-act="lscheck">Prüfen</button></div><div id="fb"></div></div>`;
  speak(x.fi);
}
async function checkListenS(reveal) {
  const se = SESSION;
  if (!se || se.shown) return;
  const u = ($("#ans").value || "").trim();
  if (!u && !reveal) return;
  se.shown = true;
  const x = se.queue[se.idx];
  $("#ans").disabled = true;
  document.querySelectorAll('[data-act="lscheck"],[data-act="lsreveal"]').forEach(b => (b.style.display = "none"));
  let r = u ? localCheck(u, x.de, false) : { correct: false },
    fb = "";
  if (u && !r.correct && aiReady()) {
    $("#fb").innerHTML = `<div class="fb wait">${APP.teacher} prüft ${dots()}</div>`;
    try {
      const meta = { k: "hoeren" };
      const j = await aiJSON(
        `Hörverstehen. ${ucFirst(APP.target.adj)}er Satz: "${x.fi}". Bedeutung: ${x.de.join(" / ")}. Der Schüler hat verstanden: "${u}". Stimmt die Bedeutung im Wesentlichen (Wortlaut egal)?\nJSON: {"correct": true oder false, "feedback": "1 kurzer Satz auf ${APP.explain}"}`,
        meta
      );
      r = { correct: !!j.correct };
      fb = j.feedback || "";
      r.aid = aiAudit("hoeren", meta, {
        q: x.fi,
        sol: x.de.join(" / "),
        u,
        ok: !!j.correct,
        r: `${j.correct ? "richtig" : "falsch"} – ${fb}`
      });
    } catch (e) {}
  }
  if (SESSION !== se) return;
  if (r.correct) se.ok++;
  $("#fb").innerHTML =
    `<div class="fb ${r.correct ? "ok" : reveal && !u ? "dunno" : "bad"}"><b class="t">${r.correct ? "Oikein!" : reveal && !u ? "So lautet der Satz:" : "Nicht ganz."}</b><p>${spk(x.fi)}<b>${glossWords(x.fi)}</b></p><p>${esc(x.de[0])}</p>${fb ? `<p class="muted">${esc(fb)}</p>${flagLink(r.aid)}` : ""}${u && !r.correct ? `<p class="muted">Du hast verstanden: ${esc(u)}</p>` : ""}</div><div class="btnrow"><button class="btn" data-act="lsnext" id="nextbtn">Weiter</button></div>`;
  $("#nextbtn").focus();
}
/* ---------- Hörtraining ---------- */
function startListen() {
  const ids = onePerWord(shuffle(learnedCardIds())).slice(0, 10);
  if (!ids.length) return;
  SESSION = { kind: "listen", queue: ids, idx: 0, ok: 0, shown: false };
  CUR = { tab: "vocab", arg: null };
  setTab("vocab");
  renderListen();
}
function renderListen() {
  const se = SESSION;
  if (se.idx >= se.queue.length) {
    const n = se.queue.length,
      ok = se.ok;
    SESSION = null;
    bumpStreak();
    save();
    doneScreen(`${ok} von ${n} richtig erkannt.`, againRow("listen"));
    return;
  }
  const w = cardWord(se.queue[se.idx]);
  se.shown = false;
  app().innerHTML = `<div class="sbar"><div class="prog"><i style="width:${(se.idx / se.queue.length) * 100}%"></i></div><small>${se.idx + 1}/${se.queue.length}</small><button class="xbtn" data-act="tab" data-id="vocab">Beenden</button></div>
  <div class="card flash"><div class="ask">Was hörst du? Schreib es auf ${APP.target.name}.</div><div class="center" style="padding:22px 0">${spk(w[0], true)}</div>
  ${charKeys()}<input id="ans" class="inp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Auf ${APP.target.name} …"><div class="btnrow"><button class="btn" data-act="lcheck">Prüfen</button></div><div id="fb"></div></div>`;
  speak(w[0]);
}
function checkListen() {
  const se = SESSION;
  if (se.shown) return;
  const u = ($("#ans").value || "").trim();
  if (!u) return;
  se.shown = true;
  const w = cardWord(se.queue[se.idx]),
    r = localCheck(u, [w[0]], false);
  if (r.correct) se.ok++;
  $("#ans").disabled = true;
  document.querySelector('[data-act="lcheck"]').style.display = "none";
  $("#fb").innerHTML =
    `<div class="fb ${r.correct ? "ok" : "bad"}"><b class="t">${r.correct ? "Oikein!" : "Nicht ganz."}</b><p>${spk(w[0])}<b>${esc(w[0])}</b> – ${esc(w[1])}</p>${r.note ? `<p>${esc(r.note)}</p>` : ""}${!r.correct ? `<p class="muted">Du hast geschrieben: ${esc(u)}</p>` : ""}</div><div class="btnrow"><button class="btn" data-act="lnext" id="nextbtn">Weiter</button></div>`;
  $("#nextbtn").focus();
}
