/* Opi suomea – woerterbuch.js: Wörter antippen (Wörterbuch aus Wortschatz, Tabellen, Endungen, KI) und Vokabelhilfe.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
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
  const sig = TOPICS.length + "|" + Object.values(S.own || {}).reduce((s, w) => s + (w.u || 0), 0);
  if (DICT && DICT_N === sig) return DICT;
  DICT = {};
  DICT_N = sig;
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
  // eigene Wörter (Tab Vokabeln)
  ownKeys().forEach(n => add(S.own[n].fi, { de: S.own[n].de }));
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
