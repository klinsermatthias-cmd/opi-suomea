/* Opi suomea – verwaltung.js: Sicherungen, Notfall-Version, Lektionspakete, Bericht, Einstellungen.
   Alle Dateien teilen sich den globalen Bereich und werden in der Reihenfolge aus index.html geladen. */
/* ---------- Sicherung ---------- */
function dl(text, name, type) {
  const b = new Blob([text], { type }),
    a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
function backupName() {
  return APP.id + "-sicherung-" + todayKey() + ".json";
}
function markBackup() {
  S.lastBackup = Date.now();
  save();
  CFG.lastDevBackup = Date.now();
  CFG.backupSnooze = 0;
  saveCfg();
}
function backupDue() {
  if (!S.stats.sessions || CFG.autoFile) return false;
  if ((CFG.backupSnooze || 0) > Date.now()) return false;
  return Date.now() - (CFG.lastDevBackup || 0) >= (cloudOn() ? 7 : 1) * DAY;
}
function CAN_SHARE_FILE() {
  try {
    return !!(
      navigator.canShare && navigator.canShare({ files: [new File(["{}"], "x.json", { type: "application/json" })] })
    );
  } catch (e) {
    return false;
  }
}
async function shareBackup() {
  const f = new File([JSON.stringify(S)], backupName(), { type: "application/json" });
  try {
    await navigator.share({ files: [f], title: APP.name + "-Sicherung" });
    markBackup();
    toast("Sicherung gespeichert ✓");
    render();
  } catch (e) {
    if (e && e.name === "AbortError") return;
    downloadBackup();
  }
}
function downloadBackup() {
  const txt = JSON.stringify(S);
  try {
    dl(txt, backupName(), "application/json");
    markBackup();
    toast("Sicherung heruntergeladen ✓");
    if (CUR.tab === "today" && !SESSION) render();
  } catch (e) {
    CUR = { tab: "progress", arg: null };
    render();
    showOut("#out2", txt, "Download nicht möglich – bitte kopieren und sicher ablegen");
  }
}
/* Notfall-Version: die App als EINE Datei (CSS und alle Skripte eingebettet), läuft ohne Internet und ohne GitHub */
async function buildOfflineHTML() {
  const get = async u => {
    const r = await fetch(u, { cache: "no-store" });
    if (!r.ok) throw new Error(u + ": HTTP " + r.status);
    return r.text();
  };
  const base = location.href.split("#")[0].replace(/[^/]*$/, "");
  let html = await get(base + "index.html");
  for (const m of [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)]) {
    const css = await get(base + m[1]);
    html = html.replace(m[0], () => "<style>\n" + css + "\n</style>");
  }
  for (const m of [...html.matchAll(/<script src="([^"]+)"><\/script>/g)]) {
    const js = (await get(base + m[1])).replace(/<\/script/gi, "<\\/script");
    html = html.replace(m[0], () => "<script>\n" + js + "\n</script>");
  }
  return html;
}
async function downloadOffline() {
  let html;
  try {
    html = await buildOfflineHTML();
  } catch (e) {
    toast("Notfall-Version nicht möglich – bitte online versuchen (" + e.message + ")");
    return;
  }
  try {
    dl(html, APP.id + "-notfall.html", "text/html");
    toast("Notfall-Version heruntergeladen ✓");
  } catch (e) {
    toast("Download nicht möglich");
  }
}
function importText(txt) {
  try {
    const d = JSON.parse(txt);
    if (ptOn() && isPlacementExport(d)) {
      CUR = { tab: "topics", arg: "pt" };
      render();
      return ptImport(txt);
    }
    if (!d || !d.topics || !d.cards) throw 0;
    safeCopy("-vor-import", S);
    S = d;
    migrate();
    applyTheme();
    save();
    CUR = { tab: "today", arg: null };
    render();
    toast("Sicherung eingespielt ✓");
  } catch (e) {
    toast("Das ist keine gültige Sicherung");
  }
}

/* ---------- Lektionspakete (neue Themen ohne neue App-Version) ---------- */
/* Theorie-HTML aus Lektionen: nur harmlose Elemente und Attribute (Allowlist), nie Scripts, Events oder Links nach außen */
const SAFE_TAGS = new Set([
  "P",
  "H3",
  "H4",
  "TABLE",
  "THEAD",
  "TBODY",
  "TR",
  "TD",
  "TH",
  "I",
  "B",
  "S",
  "DEL",
  "EM",
  "STRONG",
  "U",
  "SMALL",
  "BR",
  "UL",
  "OL",
  "LI",
  "SPAN",
  "DIV",
  "SUP",
  "SUB",
  "CODE"
]);
function sanitizeHTML(h) {
  const tpl = document.createElement("template");
  tpl.innerHTML = String(h || "");
  const walk = node => {
    [...node.children].forEach(el => {
      if (!SAFE_TAGS.has(el.tagName)) {
        if (/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|TEMPLATE|svg|math)$/i.test(el.tagName)) el.remove();
        else {
          walk(el);
          el.replaceWith(...el.childNodes);
        }
        return;
      }
      [...el.attributes].forEach(a => {
        if (!["class", "colspan", "rowspan"].includes(a.name)) el.removeAttribute(a.name);
      });
      walk(el);
    });
  };
  walk(tpl.content);
  return tpl.innerHTML;
}
function validEx(e) {
  if (!e || typeof e !== "object") return false;
  if (FMT[e.t]) return !!FMT[e.t].valid(e);
  if (e.t === "mc")
    return (
      typeof e.q === "string" &&
      Array.isArray(e.o) &&
      e.o.length > 1 &&
      Number.isInteger(e.a) &&
      e.a >= 0 &&
      e.a < e.o.length
    );
  if (e.t === "gap") return typeof e.q === "string" && e.q.includes("___") && Array.isArray(e.a) && e.a.length > 0;
  if (e.t === "tr")
    return typeof e.q === "string" && (e.dir === "de" || e.dir === "fi") && Array.isArray(e.a) && e.a.length > 0;
  if (e.t === "ord") return Array.isArray(e.w) && e.w.length > 1 && typeof e.a === "string" && typeof e.de === "string";
  if (e.t === "tab")
    return typeof e.q === "string" && Array.isArray(e.r) && e.r.every(Array.isArray) && tabGaps(e).length > 0;
  return false;
}
/* Streng: ein einziger fehlerhafter Eintrag macht das ganze Thema ungültig. Nie einzelne Einträge
   herausfiltern – Karten-IDs und Fehler hängen am Index, sonst rutschen sie auf falsche Wörter. */
function validTopic(t) {
  if (!(t && typeof t.id === "string" && /^[\w-]+$/.test(t.id) && t.title && Array.isArray(t.v) && Array.isArray(t.ex)))
    return false;
  return t.ex.length > 0 && t.ex.every(validEx) && t.v.every(w => Array.isArray(w) && w.length >= 2 && w[0] && w[1]);
}
/* Ein Update darf in einem bestehenden Thema nichts entfernen (nur hinten anhängen) */
function packUpdateOk(old, t) {
  return !old || (t.v.length >= old.v.length && t.ex.length >= old.ex.length);
}
function importPack(txt) {
  try {
    const d = JSON.parse(
      String(txt)
        .replace(/```json|```/g, "")
        .trim()
    );
    const list = Array.isArray(d) ? d : d.topics;
    if (!Array.isArray(list) || !list.length) throw 0;
    let n = 0;
    list.forEach(t => {
      if (!validTopic(t) || BASE_TOPICS.some(b => b.id === t.id)) return;
      t.th = sanitizeHTML(t.th);
      t.req = Array.isArray(t.req) ? t.req : [];
      t.fi = t.fi || "";
      t.lvl = t.lvl || "";
      const i = S.packs.findIndex(x => x.id === t.id);
      if (i >= 0 && !packUpdateOk(S.packs[i], t)) return;
      if (i >= 0) S.packs[i] = t;
      else S.packs.push(t);
      n++;
    });
    if (!n) throw 0;
    migrate();
    save();
    CUR = { tab: "topics", arg: null };
    render();
    toast(n + " Themen eingespielt ✓ – dein Fortschritt bleibt erhalten");
  } catch (e) {
    toast("Das ist kein gültiges Lektionspaket");
  }
}

/* Lektionen aus dem Repository (lektionen/lektionen.json) automatisch laden.
   Claude legt neue Themen dort ab – die App übernimmt sie beim Start, der Fortschritt bleibt erhalten. */
async function loadRepoLessons() {
  try {
    const r = await fetch("lektionen/lektionen.json", { cache: "no-store" });
    if (!r.ok) return;
    const d = await r.json();
    const list = Array.isArray(d) ? d : d.topics || [];
    let added = 0,
      updated = 0;
    const bad = [];
    list.forEach(t => {
      if (!t || BASE_TOPICS.some(b => b.id === t.id)) return;
      t = JSON.parse(JSON.stringify(t));
      const i = S.packs.findIndex(x => x.id === t.id);
      if (!validTopic(t) || (i >= 0 && !packUpdateOk(S.packs[i], t))) {
        bad.push(t.id || "?");
        return;
      }
      t.th = sanitizeHTML(t.th);
      t.req = Array.isArray(t.req) ? t.req : [];
      t.fi = t.fi || "";
      t.lvl = t.lvl || "";
      if (i < 0) {
        S.packs.push(t);
        added++;
      } else if (JSON.stringify(S.packs[i]) !== JSON.stringify(t)) {
        S.packs[i] = t;
        updated++;
      }
    });
    if (added || updated) {
      DICT = null;
      migrate();
      save();
      if (!SESSION) render();
      toast(
        added ? `${added} neue${added === 1 ? "s Thema" : " Themen"} von Claude geladen ✓` : "Lektionen aktualisiert ✓"
      );
    }
    if (bad.length) {
      console.warn("Fehlerhafte Lektionen übersprungen:", bad);
      if (!added && !updated)
        toast("Lektion " + bad.join(", ") + " ist fehlerhaft und wurde übersprungen – bitte Claude Bescheid geben");
    }
  } catch (e) {}
}

/* ---------- Fortschritt ---------- */
function buildReport() {
  const r = S.reports[0];
  let s =
    `${APP.name.toUpperCase()} – Fortschrittsbericht für Claude\nStand: ${new Date().toLocaleString(APP.locale)}\nInhaltspaket: ${TOPICS.length ? `Themen ${TOPICS[0].id}–${TOPICS[TOPICS.length - 1].id}` : "noch keine Themen"}\n\n` +
    progressSummary();
  if (r)
    s += `\n\nLETZTE KI-ANALYSE (${new Date(r.d).toLocaleDateString(APP.locale)}): Niveau ${r.level}. ${r.summary}\nSchwächen: ${(r.weaknesses || []).join("; ")}`;
  if (ptOn()) s += "\n\n" + ptReport();
  return s + ownReport() + practiceReport() + genReportSection() + aiReport();
}
/* KI-Protokoll für den Bericht: Token-Statistik je Funktion + die gespeicherten Antworten zur Qualitätsprüfung */
function aiReport() {
  const devs = Object.values(S.aiStats || {}),
    agg = {};
  let since = Infinity;
  devs.forEach(dv => {
    since = Math.min(since, dv.since || Infinity);
    for (const k in dv.k) {
      const s = dv.k[k],
        a = agg[k] || (agg[k] = { n: 0, err: 0, i: 0, o: 0, t: 0, ms: 0, m: {}, ek: {} });
      ["n", "err", "i", "o", "t", "ms"].forEach(f => (a[f] += s[f] || 0));
      for (const m in s.m) a.m[m] = (a.m[m] || 0) + s.m[m];
      for (const e in s.ek || {}) a.ek[e] = (a.ek[e] || 0) + s.ek[e];
    }
  });
  const au = S.aiAudit || [];
  if (!Object.keys(agg).length && !au.length) return "\n\nKI-PROTOKOLL: noch keine KI-Anfragen erfasst.";
  const days = Math.max(1, (Date.now() - since) / DAY);
  let s = `\n\nKI-PROTOKOLL (Anbieter: ${(CFG.ai && CFG.ai.provider) || "–"}; erfasst seit ${isFinite(since) ? new Date(since).toLocaleDateString(APP.locale) : "–"}, ${devs.length} Gerät(e))`;
  s += "\nFunktion: Aufrufe (Fehler) | Ø Token ein/aus/Denken | Ø Dauer | Modelle | Token pro Monat (hochgerechnet)";
  let tin = 0,
    tout = 0;
  Object.keys(agg).forEach(k => {
    const a = agg[k],
      n = Math.max(1, a.n);
    tin += a.i;
    tout += a.o + a.t;
    s += `\n- ${AI_KINDS[k] || k}: ${a.n} (${a.err}${
      a.err
        ? ": " +
          Object.entries(a.ek)
            .map(([e, c]) => e + "×" + c)
            .join(",")
        : ""
    }) | ${Math.round(a.i / n)}/${Math.round(a.o / n)}/${Math.round(a.t / n)} | ${(a.ms / n / 1000).toFixed(1)} s | ${
      Object.entries(a.m)
        .map(([m, c]) => m + "×" + c)
        .join(", ") || "–"
    } | ~${Math.round((((a.i + a.o + a.t) / days) * 30) / 1000)}k`;
  });
  s += `\nGesamt hochgerechnet: ~${Math.round(((tin / days) * 30) / 1000)}k Eingabe- und ~${Math.round(((tout / days) * 30) / 1000)}k Ausgabe-Token pro Monat.`;
  if (au.length) {
    const fl = au.filter(e => e.flag);
    s += `\n\nKI-ANTWORTEN zur Qualitätsprüfung (${au.length}${fl.length ? `, davon ${fl.length} von ${APP.learner} als falsch markiert ⚑` : ""}):`;
    Object.keys(AI_KINDS).forEach(k => {
      const L = au.filter(e => e.k === k).sort((a, b) => (b.flag ? 1 : 0) - (a.flag ? 1 : 0) || b.d - a.d);
      if (!L.length) return;
      s += `\n[${AI_KINDS[k]}]`;
      L.forEach(e => {
        s +=
          `\n${e.flag ? "⚑ " : "- "}${new Date(e.d).toLocaleDateString(APP.locale, { day: "numeric", month: "numeric" })} ${e.m || "?"}: ${e.q}` +
          (e.sol != null ? ` | Lösung: ${e.sol}` : "") +
          (e.u != null ? ` | Antwort: ${e.u}` : "") +
          ` → ${e.r}`;
      });
    });
  }
  return s;
}
function renderProgress() {
  const r = S.reports[0],
    seen = Object.values(S.cards).filter(c => !c.isNew),
    weak = weakCards().slice(0, 10);
  let h = `<h2>Einstellungen</h2><div class="grid2" style="margin-bottom:14px">
  <div class="stat"><b>${streakNow()}</b><span>Tage in Folge</span></div><div class="stat"><b>${masteredTopics()}/${TOPICS.length}</b><span>Themen sicher (≥ 80 %)</span></div>
  <div class="stat"><b>${seen.length}</b><span>Wörter gelernt</span></div><div class="stat"><b>${seen.filter(c => c.interval >= 21).length}</b><span>Wörter langfristig sicher</span></div></div>`;
  h += statsCardHTML() + placementProgressCard();
  h += `<div class="card" id="globalbox">`;
  if (r)
    h += `<div class="label">Analyse von ${APP.teacher} · ${fmtDate(r.d)}</div>${flagLink(r.aid)}<p><span class="level">${esc(r.level)}</span>${esc(r.summary)}</p>${(r.strengths || []).length ? `<h3>Das sitzt</h3><ul>${r.strengths.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${(r.weaknesses || []).length ? `<h3>Daran arbeiten wir</h3><ul>${r.weaknesses.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${(r.tips || []).length ? `<h3>Tipps</h3><ul>${r.tips.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${
      r.skills
        ? `<h3>Fertigkeiten</h3><ul>${[
            ["lesen", "Lesen"],
            ["schreiben", "Schreiben"],
            ["dialog", "Gespräch"]
          ]
            .filter(([k]) => r.skills[k])
            .map(([k, l]) => `<li><b>${l}:</b> ${esc(r.skills[k])}</li>`)
            .join("")}</ul>`
        : ""
    }`;
  else
    h += `<div class="label">Analyse von ${APP.teacher}</div><p class="muted">Nach ein paar Übungsrunden analysiert ${APP.teacher} automatisch dein Niveau, deine Fehlermuster und passt den Plan an.</p>`;
  h += `<div class="btnrow"><button class="btn ghost" data-act="global">Jetzt analysieren</button></div></div>`;
  {
    const b = basicsStatus();
    h += `<div class="card"><div class="label">Neue Übungen von ${APP.teacher}</div>${genUnlocked() ? `<p>✓ Freigeschaltet am ${fmtDate(S.genUnlock.d)}. ${esc(S.genUnlock.reason || "")}</p><p class="muted">In jedem gelernten Thema findest du jetzt „Neue Übungen von ${APP.teacher}“ – jedes Mal andere Sätze.</p>` : `<p class="muted">Noch gesperrt. Frei erzeugte Übungen kommen erst, wenn die Grundlagen sicher sitzen: alle ${b.total} Grundlagen-Themen mindestens zweimal wiederholt und zuletzt mit ≥ 80 % – <b>und</b> ${APP.teacher}s Analyse bestätigt das.</p><div class="bar"><i style="width:${Math.round((b.solid / b.total) * 100)}%"></i></div><p class="muted" style="margin-top:6px">${b.solid} von ${b.total} Grundlagen-Themen sicher${b.ok ? " – die nächste Analyse entscheidet." : ""}</p>`}</div>`;
  }
  h += `<div class="card"><div class="label">Themen im Überblick</div>${TOPICS.map(t => {
    const s = S.topics[t.id];
    return `<div class="row"><div style="flex:1;min-width:0"><b>${esc(t.title)}</b><small>${s.status === "learning" ? `Zuletzt ${pct(s.last)} · nächste Wiederholung ${relDays(s.due)}${s.ai && s.ai.reason ? ` – ${esc(s.ai.reason)}` : ""}` : s.status === "new" ? "Bereit zum Lernen" : "Noch gesperrt"}</small>${s.last != null ? `<div class="bar"><i style="width:${Math.round(s.last * 100)}%"></i></div>` : ""}</div></div>`;
  }).join("")}</div>`;
  if (weak.length)
    h += `<div class="card"><div class="label">Wörter, die oft danebengehen</div>${weak
      .map(([id, c]) => {
        const w = cardWord(id);
        return `<div class="vrow"><span class="w">${esc(w[0])}</span><span class="d">${esc(w[1])}</span><span class="st lernt">${DIRL(id)} · ${c.lapses}× vergessen</span></div>`;
      })
      .join("")}</div>`;
  h += `<div class="card"><div class="label">Neue Lektionen einspielen</div><p class="muted">Neue Themen legt Claude direkt im Repository ab – die App lädt sie beim Start automatisch. Falls du ein Lektionspaket als Text bekommst, kannst du es hier einfügen. Dein Fortschritt bleibt immer vollständig erhalten.${S.packs.length ? ` Bisher eingespielt: ${S.packs.length} Themen.` : ""}</p><textarea class="out" id="packta" placeholder="Lektionspaket hier einfügen"></textarea><div class="btnrow"><button class="btn" data-act="importpack">Lektionen einspielen</button></div></div>`;
  h += `<div class="card"><div class="label">Mit Claude teilen</div><p class="muted">Kopiere den Bericht und füge ihn im Chat mit Claude (Code) ein. Claude wertet ihn aus und legt passende neue Lektionen ab – beim nächsten Öffnen sind sie in der App.</p><div class="btnrow"><button class="btn" data-act="report">Bericht für Claude</button></div><div id="out"></div></div>`;
  h += `<div class="card"><div class="label">Daten & Einstellungen</div>
  <p class="muted">${cloudOn() ? `Angemeldet als <b>${esc(CFG.session.user.email || "")}</b>. Jede Antwort wird sofort auf diesem Gerät und in der Cloud gespeichert. Die Cloud hebt zusätzlich die letzten 30 Tagesstände auf.` : "Derzeit nur auf diesem Gerät gespeichert. Verbinde die Cloud, damit dein Fortschritt sicher ist und auf allen Geräten gleich bleibt."}</p>
  <div class="btnrow"><button class="btn ghost" data-act="setup">Cloud & KI einrichten</button>${cloudOn() ? `<button class="btn ghost" data-act="snaps">Älteren Stand laden</button>` : ""}</div><div id="snaplist"></div>
  ${HAS_FSA ? `<div class="setrow"><span>Automatische Sicherungsdatei (PC)${CFG.autoFile ? `<small style="display:block">aktiv${CFG.autoFileName ? " · " + esc(CFG.autoFileName) : ""}${CFG.lastFileWrite ? " · zuletzt " + fmtDate(CFG.lastFileWrite) : ""}</small>` : ""}</span>${CFG.autoFile ? `<span style="display:flex;gap:6px;flex-shrink:0"><button class="btn sm ghost" data-act="autofilechange">Ändern</button><button class="btn sm ghost" data-act="autofileoff">Aus</button></span>` : `<button class="btn sm ghost" data-act="autofile">Einrichten</button>`}</div>` : ""}
  <div class="setrow"><span>KI-Anbieter<small style="display:block">${aiReady() ? esc((CFG.ai.provider === "gemini" ? "Gemini" : "anderer Anbieter") + (CFG.ai.model ? " · " + CFG.ai.model : "")) : "nicht eingerichtet"}</small></span><button class="btn sm ghost" data-act="aidiag">Verbindung prüfen</button></div><div id="aidiagbox"></div>
  <div class="setrow"><span>Neue Wörter pro Tag</span><select id="newper" class="inp" style="width:auto">${[5, 10, 15, 20, 30, 40, 50].map(n => `<option ${n === S.settings.newCardsPerDay ? "selected" : ""}>${n}</option>`).join("")}</select></div>
  <div class="setrow"><span>Zusätzliche Vokabeln pro Runde<small style="display:block">„Zusätzlich Vokabeln lernen“ auf Heute</small></span><select id="extranum" class="inp" style="width:auto">${[5, 10, 15, 20, 30, 40, 50].map(n => `<option ${n === S.settings.extraCards ? "selected" : ""}>${n}</option>`).join("")}</select></div>
  <div class="setrow"><span>Neue Themen pro Tag</span><select id="newtop" class="inp" style="width:auto">${[1, 2, 3].map(n => `<option ${n === S.settings.newTopicsPerDay ? "selected" : ""}>${n}</option>`).join("")}</select></div>
  <div class="setrow"><span>KI-Lehrerin ${APP.teacher}</span><button class="btn sm ${S.settings.ai ? "" : "ghost"}" data-act="toggleai">${S.settings.ai ? "An" : "Aus"}</button></div>
  <div class="setrow"><span>Nachtmodus</span><span style="display:flex;gap:6px">${[
    ["auto", "Auto"],
    ["light", "Hell"],
    ["dark", "Dunkel"]
  ]
    .map(
      ([k, l]) =>
        `<button class="btn sm ${S.settings.theme === k ? "" : "ghost"}" data-act="theme" data-id="${k}">${l}</button>`
    )
    .join("")}</span></div>
  <div class="setrow"><span>Automatisch vorlesen</span><button class="btn sm ${S.settings.autoplay ? "" : "ghost"}" data-act="toggleauto">${S.settings.autoplay ? "An" : "Aus"}</button></div>
  <div class="setrow"><span>Langsam vorlesen</span><button class="btn sm ${S.settings.slow ? "" : "ghost"}" data-act="toggleslow">${S.settings.slow ? "An" : "Aus"}</button></div>
  <div class="setrow"><span>${ucFirst(APP.target.adj)}e Stimme</span><span style="display:flex;align-items:center;gap:6px"><small>${voiceStatus()}</small>${spk(APP.target.sample)}</span></div>
  ${HAS_TTS && !FI_VOICE ? `<p class="muted">Dein Gerät hat noch keine ${APP.target.adj}e Stimme. So installierst du sie (die Menüs heißen je nach Version leicht anders): <b>iPhone</b> Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → ${APP.target.name}. <b>Android</b> Einstellungen → Text-in-Sprache → Sprachdaten installieren → ${APP.target.name}. <b>Windows</b> Einstellungen → Zeit und Sprache → Sprache → ${APP.target.name} hinzufügen (mit Sprachausgabe). <b>Mac</b> Systemeinstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimme verwalten → ${APP.target.name}. Danach die App neu laden.</p>` : ""}
  <div class="btnrow"><button class="btn" data-act="download">Sicherung herunterladen</button><button class="btn ghost" data-act="offline">Notfall-Version herunterladen</button></div>
  <div class="btnrow"><button class="btn ghost" data-act="export">Backup kopieren</button><button class="btn ghost" data-act="importopen">Sicherung einspielen</button></div>
  <div id="out2"></div>
  ${!hasProgress(S) && deletedCopy() ? `<div class="card" style="border:2px solid var(--kuusi);margin-top:12px"><b>Gelöschter Stand vorhanden</b><p class="muted">Vom Löschen ist noch eine Kopie auf diesem Gerät.</p><div class="btnrow"><button class="btn" data-act="undodelete">Gelöschten Stand wiederherstellen</button></div></div>` : ""}
  <div id="delbox"><div class="btnrow"><button class="btn danger" data-act="reset">Fortschritt löschen</button></div></div></div>`;
  app().innerHTML = h;
}
function showOut(target, text, title) {
  $(target).innerHTML =
    `<p style="margin-top:14px"><b>${esc(title)}</b></p><textarea class="out" id="outta" readonly>${esc(text)}</textarea><div class="btnrow"><button class="btn sm" data-act="copy">Kopieren</button></div>`;
}
async function copyOut() {
  const ta = $("#outta");
  try {
    await navigator.clipboard.writeText(ta.value);
    toast("Kopiert ✓");
  } catch (e) {
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      toast("Kopiert ✓");
    } catch (e2) {
      toast("Bitte Text markieren und manuell kopieren");
    }
  }
}
