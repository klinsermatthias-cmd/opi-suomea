/* Lern-Engine – wortschatz.js: eigene Wörter, Problemwörter, Paare zuordnen (Tab Vokabeln).
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */

/* ---------- Eigene Wörter ----------
   S.own["<n>"] = {fi, de, d: angelegt, u: zuletzt geändert, del?: gelöscht}. n ist eine eindeutige Zahl (Zeitstempel),
   damit zwei Geräte nie dieselbe Nummer vergeben. Karten: "own-<n>" (Lernsprache → Basissprache) und "own-<n>-r".
   Gelöschte Wörter bleiben als {del} erhalten, damit der Abgleich sie nicht wiederbelebt; ihre Karten werden ignoriert. */
const OWN = "own";
function ownWord(n) {
  const w = S.own && S.own[n];
  return w && !w.del ? [w.fi, w.de] : null;
}
function ownKeys() {
  return Object.keys(S.own || {})
    .filter(n => !S.own[n].del)
    .sort((a, b) => S.own[a].d - S.own[b].d);
}
function addOwnCards() {
  ownKeys().forEach(n => ensureCardPair(OWN + "-" + n));
  /* Karten gelöschter Wörter entfernen (können über den Abgleich zurückkommen) */
  Object.keys(S.own || {})
    .filter(n => S.own[n].del)
    .forEach(n => {
      delete S.cards[OWN + "-" + n];
      delete S.cards[OWN + "-" + n + "-r"];
    });
}
/* Zusammenführen: je Wort gewinnt die zuletzt geänderte Fassung (auch eine Löschung) */
function mergeOwn(L, R) {
  const M = { ...(R || {}) };
  for (const n in L || {}) if (!M[n] || (L[n].u || 0) > (M[n].u || 0)) M[n] = L[n];
  return M;
}
function ownSave(n) {
  const fi = ($("#ownfi").value || "").trim(),
    de = ($("#ownde").value || "").trim();
  if (!fi || !de) {
    toast(`Bitte beide Felder ausfüllen (${APP.target.name} und ${APP.base.name})`);
    return;
  }
  const dup = ownKeys().find(k => k !== n && norm(S.own[k].fi) === norm(fi));
  if (dup) {
    toast("Dieses Wort hast du schon");
    return;
  }
  const now = Date.now();
  if (n && S.own[n]) Object.assign(S.own[n], { fi, de, u: now });
  else {
    let k = now;
    while (S.own[k]) k++;
    S.own[k] = { fi, de, d: now, u: now };
  }
  addOwnCards();
  DICT = null;
  save();
  CUR = { tab: "vocab", arg: null };
  render();
  toast(n ? "Geändert ✓" : "Gespeichert ✓ – das Wort kommt in deine Vokabeln");
}
function ownDelete(n, b) {
  if (!b.dataset.sure) {
    b.dataset.sure = "1";
    b.textContent = "Wirklich löschen?";
    return;
  }
  S.own[n] = { ...S.own[n], del: 1, u: Date.now() };
  addOwnCards();
  DICT = null;
  save();
  render();
  toast("Gelöscht");
}
function ownForm(n) {
  const w = n ? S.own[n] : null;
  return `<div class="ownform"><input id="ownfi" class="inp" placeholder="${esc(APP.target.name)}" autocomplete="off" autocapitalize="off" spellcheck="false" autocorrect="off" value="${w ? esc(w.fi) : ""}"><input id="ownde" class="inp" placeholder="${esc(APP.base.name)}" autocomplete="off" spellcheck="false" autocorrect="off" value="${w ? esc(w.de) : ""}">${charKeys()}<div class="btnrow">${aiReady() ? `<button class="btn ghost" data-act="ownai">✨ ${APP.teacher} fragen</button>` : ""}<button class="btn" data-act="ownsave" data-id="${n || ""}">${n ? "Ändern" : "Speichern"}</button></div><div id="ownaires"></div></div>`;
}
/* KI ergänzt das fehlende Feld bzw. prüft Schreibweise und Bedeutung (Grundform) */
async function ownAsk() {
  const fi = ($("#ownfi").value || "").trim(),
    de = ($("#ownde").value || "").trim(),
    box = $("#ownaires");
  if (!fi && !de) {
    toast("Zuerst ein Wort eintippen");
    return;
  }
  box.innerHTML = `<p class="muted">${APP.teacher} schaut nach ${dots()}</p>`;
  const p = `${APP.learner} möchte eine eigene Vokabel lernen.
${APP.target.name}: ${fi || "(leer)"}
${APP.base.name}: ${de || "(leer)"}

Ergänze das leere Feld bzw. prüfe beide Felder. ${APP.target.name}: die Grundform (Nomen im Nominativ Singular, Verb im Infinitiv), korrekt geschrieben; feste Wendungen bleiben ganz. ${APP.base.name}: kurze, gängige Bedeutung (bei Nomen mit Artikel, falls üblich). Ist etwas falsch geschrieben oder keine Grundform, korrigiere es und sag kurz warum. Ist es kein (bekanntes) Wort auf ${APP.target.name}, sag das in "note", statt zu raten.
JSON: {"fi": "...", "de": "...", "note": "höchstens 1 kurzer Satz auf ${APP.explain}, leer wenn alles stimmt"}`;
  try {
    const meta = { k: "wort" },
      j = await aiJSON(p, meta);
    const aid = aiAudit("wort", meta, {
      q: `Eigenes Wort: ${fi || "?"} = ${de || "?"}`,
      r: `${j.fi} = ${j.de}${j.note ? " – " + j.note : ""}`
    });
    if (!$("#ownfi")) return;
    if (j.fi) $("#ownfi").value = j.fi;
    if (j.de) $("#ownde").value = j.de;
    box.innerHTML = `<p class="muted">${j.note ? esc(j.note) : "Passt so ✓"} Prüf die Felder und tippe dann auf Speichern.</p>${flagLink(aid)}`;
  } catch (e) {
    box.innerHTML = `<p class="muted">${APP.teacher} nicht erreichbar: ${esc(aiErrShort())}.</p>`;
  }
}
function ownCardHTML() {
  const ks = ownKeys(),
    edit = CUR.view === "ownEdit" ? String(CUR.arg) : null;
  const st = (id, lbl) => {
    const c = S.cards[id];
    if (!c) return "";
    const s = cardState(c);
    return `<span class="st ${s}">${lbl} ${STATE_L[s]}${c.isNew ? "" : " · " + relDays(c.due)}</span>`;
  };
  return `<div class="card" id="ownbox"><div class="label">Eigene Wörter</div><p class="muted">Wörter aus deinem Alltag, die du lernen möchtest. Jedes Wort wird zu zwei Karten (beide Richtungen) und kommt wie die anderen neuen Wörter in deine Vokabeln.</p>${edit ? "" : ownForm(null)}${ks
    .slice()
    .reverse()
    .map(n => {
      const w = S.own[n],
        id = OWN + "-" + n;
      if (n === edit) return `<div class="vrow ownedit">${ownForm(n)}</div>`;
      return `<div class="vrow" style="align-items:center">${spk(w.fi)}<div class="vbody"><div><span class="w">${esc(w.fi)}</span> <span class="d">${esc(w.de)}</span>${leechMark(id)}</div><div class="sts">${st(id, DIRL(id))}${st(id + "-r", DIRL(id + "-r"))}</div><div class="ownact"><a href="#" class="aiflag" data-act="ownedit" data-id="${n}">Ändern</a> · <a href="#" class="aiflag" data-act="owndel" data-id="${n}">Löschen</a></div></div></div>`;
    })
    .join("")}</div>`;
}
function ownReport() {
  const ks = ownKeys();
  return ks.length
    ? `\n\nEIGENE WÖRTER (${ks.length}, von ${APP.learner} selbst angelegt): ${ks.map(n => `${S.own[n].fi} = ${S.own[n].de}`).join("; ")}`
    : "";
}

/* ---------- Problemwörter (wie „Leech“ bei Anki): oft vergessen oder schwer ---------- */
function leechMark(id) {
  const L = [id, sibling(id)].filter(isLeech);
  if (!L.length) return "";
  const p = Math.min(...L.map(x => leechProgress(S.cards[x])));
  return ` <span class="leech" title="Problemwort – verschwindet, wenn du es an ${LEECH_OK} verschiedenen Tagen richtig weißt">⚠ ${p}/${LEECH_OK}</span>`;
}
function startLeech() {
  /* je Wort eine Richtung pro Runde – zuerst die, die heute noch nicht gezählt wurde (so kommen beide Richtungen dran) */
  const tk = todayKey(),
    ids = shuffle(weakCards().map(([id]) => id)).sort((a, b) => (S.cards[a].lkd === tk) - (S.cards[b].lkd === tk));
  const q = onePerWord(ids).slice(0, S.settings.extraCards);
  if (!q.length) {
    toast("Gerade keine Problemwörter – super!");
    return;
  }
  SESSION = { kind: "vocab", queue: q, done: 0, again: 0, shown: false, extra: "practice", leech: 1 };
  CUR = { tab: "vocab", arg: null };
  setTab("vocab");
  renderCard();
  scrollTo(0, 0);
}

/* ---------- Paare zuordnen (Spiel, ändert den Lernplan nicht) ---------- */
/* Bis zu max gelernte Wörter mit eindeutigem Wort und eindeutiger Bedeutung (sonst wäre die Zuordnung mehrdeutig) */
function pairWords(max) {
  const seen = new Set(),
    used = new Set(),
    out = [];
  for (const b of shuffle(learnedCardIds().map(id => cardParse(id).base))) {
    if (out.length >= max) break;
    if (seen.has(b)) continue;
    seen.add(b);
    const w = cardWord(b),
      k0 = w && "L" + norm(w[0]),
      k1 = w && "R" + norm(w[1]);
    if (!w || used.has(k0) || used.has(k1)) continue;
    used.add(k0);
    used.add(k1);
    out.push(w);
  }
  return out;
}
function startPairs() {
  const ws = pairWords(5);
  if (ws.length < 3) {
    toast("Lerne zuerst ein paar Wörter");
    return;
  }
  SESSION = {
    kind: "pairs",
    ws,
    L: shuffle(ws.map((_, i) => i)),
    R: shuffle(ws.map((_, i) => i)),
    done: [],
    sel: null,
    miss: 0,
    t0: Date.now()
  };
  CUR = { tab: "vocab", arg: null };
  setTab("vocab");
  renderPairs();
  scrollTo(0, 0);
}
function renderPairs() {
  const se = SESSION;
  if (se.done.length === se.ws.length) {
    const sec = Math.round((Date.now() - se.t0) / 1000);
    SESSION = null;
    bumpStreak();
    save();
    return doneScreen(
      `${se.ws.length} Paare in ${sec} Sekunden${se.miss ? `, ${se.miss}× daneben` : " – ohne Fehler"}.`,
      againRow("pairs")
    );
  }
  const btn = (side, i) => {
    const w = se.ws[i],
      done = se.done.includes(i),
      on = se.sel && se.sel.side === side && se.sel.i === i;
    return `<button class="pair${done ? " ok" : ""}${on ? " on" : ""}" ${done ? "disabled" : `data-act="pair" data-id="${side}:${i}"`}>${esc(side === "L" ? w[0] : w[1])}</button>`;
  };
  app().innerHTML = `<div class="sbar"><div class="prog"><i style="width:${(se.done.length / se.ws.length) * 100}%"></i></div><small>${se.done.length}/${se.ws.length}</small><button class="xbtn" data-act="tab" data-id="vocab">Beenden</button></div>
  <div class="card"><div class="ask">Tippe ein Wort und seine Bedeutung an</div><div class="pairs"><div>${se.L.map(i => btn("L", i)).join("")}</div><div>${se.R.map(i => btn("R", i)).join("")}</div></div></div>`;
}
function pickPair(id) {
  const se = SESSION;
  if (!se || se.kind !== "pairs") return;
  const [side, s] = id.split(":"),
    i = +s;
  if (!se.sel || se.sel.side === side) {
    se.sel = { side, i };
    if (side === "L" && S.settings.autoplay) speak(se.ws[i][0]);
    return renderPairs();
  }
  const a = se.sel;
  se.sel = null;
  if (a.i === i) {
    se.done.push(i);
    return renderPairs();
  }
  se.miss++;
  renderPairs();
  document
    .querySelectorAll(`[data-id="${side}:${i}"],[data-id="${a.side}:${a.i}"]`)
    .forEach(b => b.classList.add("no"));
}

/* ---------- Karten auf dem Tab Vokabeln ---------- */
function vocabExtrasHTML(learned) {
  let h = "";
  let weak = 0;
  for (const id in S.cards) if (isLeech(id) && cardWord(id)) weak++;
  if (weak)
    h += `<div class="card"><div class="row" style="padding:0"><div><b>Problemwörter üben</b><small>${weak} ${weak === 1 ? "Karte geht" : "Karten gehen"} oft daneben (⚠). Weißt du ein Wort an 3 verschiedenen Tagen richtig, ist es kein Problemwort mehr – „⚠ 2/3“ zeigt, wie weit du bist.</small></div><button class="btn sm" data-act="leech">Üben</button></div></div>`;
  if (learned >= 3)
    h += `<div class="card"><div class="row" style="padding:0"><div><b>Paare zuordnen</b><small>Schnelles Spiel mit gelernten Wörtern – ändert deinen Lernplan nicht.</small></div><button class="btn sm ghost" data-act="pairs">Spielen</button></div></div>`;
  return h;
}
