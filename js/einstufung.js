/* Lern-Engine – einstufung.js: Einstufungstest (nur wenn APP.features.placement und die App Testinhalte hat).
   Inhalte: const PT (Teile → Abschnitte → Aufgaben) und PT_READING (Lesetext) in js/inhalte.js der App.
   Speicherung in S.placement = {a: Antworten, u: unsicher, c: geprüft/gesperrt, part, started, done, doneAt, analysis}.
   Aufgaben-IDs = Abschnitt + "." + Nummer (z. B. "A3.2") – nie ändern, sonst passen gespeicherte Antworten nicht mehr.
   Aufgabentypen (k): "b" Lücken (___, Lösungen s[i], Alternativen mit |), "r" Satz umformen/bilden (s = Lösungen,
   m = freie Antwort mit Musterlösung), "rf" richtig/falsch, "s" kurze freie Antwort, "w" längerer Text (min/max Wörter). */
function ptOn() {
  return !!(APP.features && APP.features.placement && typeof PT !== "undefined" && PT.length);
}
function defaultPlacement() {
  return { a: {}, u: {}, c: {}, part: "A", started: 0, done: false, doneAt: 0, analysis: null };
}
const PT_BUSY = new Set();
const PT_NOTES = {};
function ptBusy() {
  return PT_BUSY.size > 0;
}
const LETTER_END = /([A-Za-zÄÖÜäöüß]+)$/;
const EMPTY_MARKS = ["-", "–", "—", "0", "/", "x", "ø"];
const PT_RIGHT = ["ok", "self", "self-ok"];
function placementCount(x) {
  const p = x && x.placement;
  return p ? Object.keys(p.a || {}).length + Object.keys(p.c || {}).length : 0;
}
function ptAll() {
  const out = [];
  if (!ptOn()) return out;
  PT.forEach(part =>
    part.sections.forEach(sec =>
      sec.items.forEach((item, i) => out.push({ id: sec.id + "." + (i + 1), item, sec, part }))
    )
  );
  return out;
}
function ptFind(id) {
  return ptAll().find(x => x.id === id);
}
function ptSec(id) {
  for (const p of PT) for (const s of p.sections) if (s.id === id) return s;
  return null;
}
function gapStems(item) {
  return item.t
    .split("___")
    .slice(0, -1)
    .map(p => {
      const m = p.match(LETTER_END);
      return m ? m[1] : "";
    });
}
function gapCount(item) {
  return item.t.split("___").length - 1;
}
function normGap(v) {
  return (v || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,!?]+$/, "")
    .toLowerCase();
}
function normSent(v) {
  let x = (v || "")
    .replace(/[„“”"«»]/g, "")
    .replace(/…|\.\.\./g, "")
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.!?]+$/, "")
    .trim();
  return x ? x.charAt(0).toLowerCase() + x.slice(1) : x;
}
function gapOk(item, i, val) {
  const v = normGap(val);
  if (!v) return false;
  const stem = gapStems(item)[i].toLowerCase();
  return item.s[i].split("|").some(alt => {
    const a = alt.toLowerCase();
    if (stem) {
      if (a === "") return EMPTY_MARKS.includes(v) || v === stem;
      return v === a || v === stem + a;
    }
    if (v !== a) return false;
    /* Groß-/Kleinschreibung zählt im Deutschen (Nomen, „Sie“), außer am Satzanfang (E-1008-9) */
    if (!SP.caseMatters) return true;
    const pre = item.t.split("___")[i] || "",
      atStart = (i === 0 && !pre.trim()) || /[.!?:]\s*$/.test(pre),
      key = x =>
        String(x)
          .trim()
          .replace(/\s+/g, " ")
          .replace(/[.,!?]+$/, "");
    return atStart || key(val) === key(alt);
  });
}
function fullGapWord(item, i, val) {
  const stem = gapStems(item)[i],
    v = (val || "").trim();
  if (!stem) return v;
  if (EMPTY_MARKS.includes(v)) return stem;
  if (v.toLowerCase().startsWith(stem.toLowerCase())) return v;
  return stem + v;
}
function filledSentence(item, vals) {
  const parts = item.t.split("___"),
    stems = gapStems(item);
  let out = "";
  parts.forEach((txt, i) => {
    if (i < parts.length - 1)
      out += txt.slice(0, txt.length - stems[i].length) + "[" + fullGapWord(item, i, vals[i]) + "]";
    else out += txt;
  });
  return out;
}
function solutionSentence(item) {
  const parts = item.t.split("___");
  return parts.map((txt, i) => (i < parts.length - 1 ? txt + item.s[i].split("|")[0] : txt)).join("");
}
function sentOk(item, val) {
  const v = normSent(val);
  return !!v && item.s.some(alt => normSent(alt) === v);
}
function ptAnswered(item, id) {
  const v = S.placement.a[id];
  if (item.k === "b") {
    const n = gapCount(item);
    return Array.isArray(v) && v.length >= n && v.slice(0, n).every(x => x && String(x).trim());
  }
  return typeof v === "string" && v.trim().length > 0;
}
function fmtVal(item, v) {
  if (item.k === "b") {
    const arr = Array.isArray(v) ? v : [],
      out = [];
    for (let i = 0; i < gapCount(item); i++) out.push((arr[i] || "").trim() || "—");
    return out.join(" … ");
  }
  return typeof v === "string" && v.trim() ? v.trim() : "—";
}
function ptFmt(item, id) {
  return fmtVal(item, S.placement.a[id]);
}
function modelText(item) {
  if (item.m) return item.m;
  if (item.k === "rf") return item.s;
  if (item.k === "r") return item.s[0];
  if (item.k === "b") return solutionSentence(item);
  return "";
}
function isText(item) {
  return item.k === "r" || item.k === "s";
}
function ptStats() {
  let total = 0,
    answered = 0,
    checked = 0,
    right = 0,
    graded = 0;
  ptAll().forEach(({ id, item }) => {
    total++;
    if (ptAnswered(item, id)) answered++;
    const c = S.placement.c[id];
    if (c) {
      checked++;
      if (item.k !== "w" && c.r !== "pending") {
        graded++;
        if (PT_RIGHT.includes(c.r)) right++;
      }
    }
  });
  return { total, answered, checked, right, graded };
}

/* Wortvergleich für grün/rot */
function toks(s) {
  return (s || "").trim().split(/\s+/).filter(Boolean);
}
function wkey(w) {
  return w.replace(/[„“”"«».,!?;:()–]/g, "");
}
function lcsMask(a, b) {
  const n = a.length,
    m = b.length,
    dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = wkey(a[i]) === wkey(b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ma = new Array(n).fill(false),
    mb = new Array(m).fill(false);
  let i = 0,
    j = 0;
  while (i < n && j < m) {
    if (wkey(a[i]) === wkey(b[j])) {
      ma[i] = mb[j] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return { ma, mb, len: dp[0][0] };
}
function bestModel(item, ans) {
  const alts = item.m ? [item.m] : item.s || [];
  let best = alts[0] || "",
    sc = -1;
  alts.forEach(alt => {
    const l = lcsMask(toks(ans), toks(alt)).len;
    if (l > sc) {
      sc = l;
      best = alt;
    }
  });
  return best;
}
function markedHTML(text, ref, allOk) {
  const a = toks(text),
    mask = allOk ? a.map(() => true) : lcsMask(a, toks(ref)).ma;
  return a.map((w, i) => `<span class="pw ${mask[i] ? "ok" : "bad"}">${esc(w)}</span>`).join(" ");
}
function correctionHTML(corr, ans) {
  const b = toks(corr),
    mb = lcsMask(toks(ans), b).mb;
  return b.map((w, i) => (mb[i] ? esc(w) : `<b>${esc(w)}</b>`)).join(" ");
}
function localGrade(item, v) {
  if (item.k === "b") {
    const per = item.s.map((_, i) => gapOk(item, i, (Array.isArray(v) ? v[i] : "") || ""));
    return { res: per.every(Boolean) ? "ok" : "wrong", per };
  }
  if (item.k === "r" && !item.m) return { res: sentOk(item, v) ? "ok" : "wrong" };
  if (item.k === "rf") return { res: v === item.s ? "ok" : "wrong" };
  return { res: "pending" };
}

/* Abschnitt prüfen: lokal, was eindeutig ist; den Rest prüft die KI. Danach ist der Abschnitt gesperrt. */
async function ptCheckSection(secId) {
  const sec = ptSec(secId);
  if (!sec) return;
  const P = S.placement,
    toAI = [],
    toWrite = [];
  if (!P.started) P.started = Date.now();
  sec.items.forEach((item, i) => {
    const id = sec.id + "." + (i + 1);
    if (PT_BUSY.has(id)) return;
    let c = P.c[id];
    if (!c) {
      if (!ptAnswered(item, id)) return;
      const raw = JSON.parse(JSON.stringify(P.a[id]));
      c = P.c[id] = { first: ptFmt(item, id), raw, t: Date.now() };
      if (item.k === "w") {
        c.r = "fb";
        toWrite.push(id);
        return;
      }
      const g = localGrade(item, raw);
      c.r = g.res;
      if (item.k === "b") c.gaps = g.per;
      if (item.k === "rf" || g.res === "ok") c.g = true;
      else toAI.push(id);
    } else if (!c.g && item.k === "w") toWrite.push(id);
    else if (!c.g && c.r !== "ok" && item.k !== "rf") toAI.push(id);
  });
  save();
  if (!toAI.length && !toWrite.length) return ptRerender();
  if (!aiReady()) {
    PT_NOTES[secId] =
      toWrite.length && !toAI.length
        ? "Abgegeben. Claude korrigiert deinen Text, wenn du den Bericht schickst."
        : `${APP.teacher} ist nicht eingerichtet, daher wird nur mit der Musterlösung verglichen. Unter ${SET_NAME} → „Cloud & KI einrichten“ kannst du einen kostenlosen Gemini-Schlüssel eintragen.`;
    return ptRerender();
  }
  [...toAI, ...toWrite].forEach(id => PT_BUSY.add(id));
  PT_NOTES[secId] = "";
  ptRerender();
  try {
    if (toAI.length) await ptAIGrade(sec, toAI);
    for (const id of toWrite) await ptAIWriting(id);
  } catch (e) {
    PT_NOTES[secId] =
      `${APP.teacher} war nicht erreichbar. Tippe später nochmal auf „Abschnitt prüfen“ – deine Antworten sind gespeichert und gesperrt.`;
  }
  [...toAI, ...toWrite].forEach(id => PT_BUSY.delete(id));
  save();
  ptRerender();
}
function ptLearnerInfo() {
  const p = APP.placement || {};
  return `${APP.learner} (${APP.target.name}, ${p.level || "Niveau unbekannt"}${p.goal ? ", Ziel " + p.goal : ""})`;
}
async function ptAIGrade(sec, ids) {
  const P0 = S.placement;
  const tasks = ids.map(id => {
    const { item } = ptFind(id),
      c = P0.c[id];
    if (item.k === "b") {
      const vals = Array.isArray(c.raw) ? c.raw : P0.a[id] || [];
      return {
        id,
        type: "gap sentence",
        task: item.t + (item.tag ? " [" + item.tag + "]" : ""),
        answer: filledSentence(item, vals),
        model: solutionSentence(item)
      };
    }
    return {
      id,
      type: item.m ? "free answer" : "rewrite sentence",
      instruction: [sec.hint, item.tag].filter(Boolean).join(" – "),
      task: item.t,
      model: item.m || item.s.join(" | "),
      answer: c.first
    };
  });
  const prompt = `Prüfe die Antworten aus dem Einstufungstest von ${ptLearnerInfo()}. Bewerte fair:
- Eine Antwort ist richtig, wenn sie grammatisch korrekt ist, natürlich klingt und die Aufgabe erfüllt (z. B. verlangte Zeitform, gleicher Inhalt). Sie muss NICHT wörtlich der Musterlösung entsprechen. Andere korrekte Wortstellungen, Synonyme und regionale Varianten sind richtig.
- Rechtschreibung, Groß-/Kleinschreibung, Sonderzeichen und Endungen zählen. Ein fehlender Punkt am Ende und fehlende Kommas sind keine Fehler.
- "rewrite sentence": Hat der Lernende nur den Nebensatz / den neuen Teil geschrieben, ist das in Ordnung, wenn dieser Teil stimmt.
- "gap sentence": Die eingesetzten Wörter stehen in [eckigen Klammern]. Bewerte jede Lücke einzeln in "gaps" (true/false, gleiche Reihenfolge). Eine Lücke ist richtig, wenn der Satz damit korrekt ist und die Aufgabe erfüllt (Hinweise in Klammern beachten). "correction" ist der ganze korrigierte Satz ohne Klammern.
- "free answer": passender Inhalt und korrekte Sprache; kleine Stilfragen sind keine Fehler.
- "correction": die Antwort mit SO WENIG Änderungen wie möglich korrigiert – nicht einfach die Musterlösung kopieren. Wenn richtig: unverändert.
- "explanation": wenn falsch, auf ${APP.explain}, höchstens 2 kurze Sätze: was falsch ist und welche Regel gilt (Beispielwörter in der Lernsprache sind ok). Wenn richtig: "".
${sec.reading && typeof PT_READING !== "undefined" ? "\nLesetext:\n" + PT_READING.join("\n") + "\n" : ""}
Aufgaben:
${JSON.stringify(tasks, null, 1)}

JSON: {"results":[{"id":"…","correct":true,"gaps":[true],"correction":"…","explanation":""}]}`;
  const meta = { k: "einstufung" };
  const out = await aiJSON(prompt, meta);
  const list = out && Array.isArray(out.results) ? out.results : [];
  if (!list.length) throw new Error("leer");
  aiAudit("einstufung", meta, {
    q: `Abschnitt ${sec.id}: ${ids.join(", ")}`,
    r: list.map(r => `${r.id} ${r.correct ? "✓" : "✗"} ${r.correction || ""}`).join(" | ")
  });
  const P = S.placement; // nach dem Warten neu holen – der Stand kann inzwischen zusammengeführt worden sein
  list.forEach(r => {
    if (!r || !ids.includes(r.id) || !P.c[r.id]) return;
    const c = P.c[r.id],
      { item } = ptFind(r.id),
      right = r.correct === true;
    c.g = true;
    c.r = right ? "ok" : "wrong";
    c.corr = typeof r.correction === "string" ? r.correction.trim() : "";
    c.expl = right ? "" : typeof r.explanation === "string" ? r.explanation.trim() : "";
    if (item.k === "b") {
      const n = gapCount(item);
      if (right) c.gaps = new Array(n).fill(true);
      else if (Array.isArray(r.gaps) && r.gaps.length === n) c.gaps = r.gaps.map(x => x === true);
    }
  });
}
async function ptAIWriting(id) {
  const { item } = ptFind(id),
    first = S.placement.c[id].first;
  const prompt = `${ptLearnerInfo()} hat diesen Text für den Einstufungstest geschrieben.
Aufgabe: ${item.t}
${(item.points || []).map(p => "- " + p).join("\n")}
Ziellänge: ${item.min}–${item.max} Wörter.

Der Text:
"""${first}"""

Korrigiere wie eine unterstützende Lehrkraft. Behalte den Stil bei, verbessere nur echte Fehler.
JSON: {"corrected":"der ganze Text, mit so wenig Änderungen wie möglich korrigiert","mistakes":[{"wrong":"kurze falsche Stelle","right":"korrigierte Stelle","why":"kurze Erklärung auf ${APP.explain}, Regel nennen"}],"level":"geschätztes GER-Niveau dieses Textes, z. B. B1","comment":"2 Sätze auf ${APP.explain}: was gut gelingt und was am wichtigsten zu verbessern ist"}
Nenne höchstens die 8 wichtigsten Fehler.`;
  const meta = { k: "einstufung" };
  const j = await aiJSON(prompt, meta);
  aiAudit("einstufung", meta, { q: `Text ${id}`, r: `${j.level || ""} – ${j.comment || ""}` });
  const c = S.placement.c[id];
  if (!c) return;
  c.g = true;
  c.corr = typeof j.corrected === "string" ? j.corrected.trim() : "";
  c.mistakes = Array.isArray(j.mistakes) ? j.mistakes.slice(0, 8) : [];
  c.wlevel = j.level || "";
  c.comment = j.comment || "";
}

/* ---------- Ansicht ---------- */
function ptResultHTML(id, item, c) {
  if (PT_BUSY.has(id)) return `<div class="pres wait"><span class="lbl">Wird geprüft</span>${dots()}</div>`;
  if (item.k === "w") {
    if (!c.g)
      return `<div class="pres wait"><span class="lbl">Abgegeben.</span>Claude korrigiert diesen Text, wenn du deinen Bericht schickst${aiReady() ? ` – oder tippe nochmal auf „Text abgeben“ für das Feedback von ${APP.teacher}` : ""}.</div>`;
    return `<div class="pres ok"><div><span class="lbl">Korrigierte Fassung</span>${c.wlevel ? `<span class="badge">${esc(c.wlevel)}</span>` : ""}</div><div class="sol" style="margin-top:6px;line-height:1.7">${correctionHTML(c.corr || c.first, c.first)}</div>${(c.mistakes || []).length ? `<ul>${c.mistakes.map(m => `<li><span style="color:var(--puolukka)">${esc(m.wrong)}</span> → <b style="color:var(--kuusi)">${esc(m.right)}</b>. ${esc(m.why)}</li>`).join("")}</ul>` : ""}${c.comment ? `<p class="sub">${esc(c.comment)}</p>` : ""}</div>`;
  }
  if (PT_RIGHT.includes(c.r)) {
    let h = `<div class="pres ok"><span class="lbl">${c.r === "ok" ? "Richtig ✓" : "Richtig (selbst eingeschätzt)"}</span>`;
    if (isText(item) && !(item.k === "r" && !item.m && sentOk(item, c.first)))
      h += `<div class="sub">Musterlösung: ${esc(modelText(item))}</div>`;
    if (item.k === "b" && c.g && !localGrade(item, Array.isArray(c.raw) ? c.raw : S.placement.a[id]).per.every(Boolean))
      h += `<div class="sub">Auch möglich: ${esc(solutionSentence(item))}</div>`;
    return h + "</div>";
  }
  if (c.r === "pending")
    return `<div class="pres wait"><div><span class="lbl">Musterlösung:</span>${esc(modelText(item))}</div><div class="sub">Vergleiche selbst: Stimmt deine Fassung auch?</div><div class="selfrow"><button class="btn sm ghost" data-act="ptself" data-id="${id}|self-ok">Meine ist richtig</button><button class="btn sm ghost" data-act="ptself" data-id="${id}|self-bad">Ich habe Fehler gemacht</button></div></div>`;
  let h = `<div class="pres bad">`;
  if (item.k === "b") {
    const parts = item.t.split("___");
    h += `<div><span class="lbl">Lösung:</span><span class="sol">${parts.map((txt, i) => esc(txt) + (i < parts.length - 1 ? `<b>${esc(item.s[i].split("|")[0])}</b>` : "")).join("")}</span></div>`;
  } else if (item.k === "rf") h += `<div><span class="lbl">Lösung:</span>${esc(item.s)}</div>`;
  else if (c.g && c.corr) {
    h += `<div><span class="lbl">Korrektur:</span><span class="sol">${correctionHTML(c.corr, c.first)}</span></div>`;
    if (normSent(c.corr) !== normSent(modelText(item)))
      h += `<div class="sub">Musterlösung: ${esc(modelText(item))}</div>`;
  } else {
    h += `<div><span class="lbl">Lösung:</span><span class="sol">${esc(bestModel(item, c.first))}</span></div>`;
    if (item.k === "r" && !c.g)
      h += `<div class="selfrow"><button class="btn sm ghost" data-act="ptself" data-id="${id}|self">Meine Fassung stimmt auch</button></div>`;
  }
  if (c.expl) h += `<p class="sub" style="color:var(--yo)">${esc(c.expl)}</p>`;
  return h + "</div>";
}
function ptItemHTML(id, item, n) {
  const P = S.placement,
    c = P.c[id],
    v = P.a[id],
    busy = PT_BUSY.has(id),
    locked = !!c;
  let body = "";
  if (item.k === "b") {
    const parts = item.t.split("___"),
      vals = locked && Array.isArray(c.raw) ? c.raw : Array.isArray(v) ? v : [];
    const per = locked && !busy ? c.gaps || localGrade(item, vals).per : null;
    body = `<p class="psent gaps">${parts
      .map((txt, i) => {
        if (i >= parts.length - 1) return esc(txt);
        const base = LETTER_END.test(txt) ? 3.5 : 8,
          val = vals[i] || "";
        return (
          esc(txt) +
          `<input class="pgap${per ? (per[i] ? " ok" : " bad") : ""}" data-pid="${id}" data-gi="${i}" value="${esc(val)}" style="width:${Math.max(base, val.length + 1.5)}ch" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Lücke ${i + 1}" ${locked ? "readonly" : ""}>`
        );
      })
      .join("")}${item.tag ? `<span class="ptag">${esc(item.tag)}</span>` : ""}</p>`;
  } else if (item.k === "rf") {
    const right = locked && c.r === "ok";
    body = `<p class="psent">${esc(item.t)}</p><div class="rfrow">${["richtig", "falsch"].map(o => `<button class="${v === o ? (locked && !busy ? (right ? "ok" : "bad") : "on") : ""}" ${locked ? "disabled" : `data-act="ptrf" data-id="${id}|${o}"`}>${o}</button>`).join("")}</div>`;
  } else {
    body = `<p class="psent">${esc(item.t)}${item.tag ? `<span class="ptag">${esc(item.tag)}</span>` : ""}</p>`;
    if (item.points)
      body += `<ul style="margin:4px 0 10px;padding-left:20px">${item.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>`;
    if (locked) {
      const right = PT_RIGHT.includes(c.r);
      if (busy || item.k === "w" || c.r === "pending") body += `<div class="mine">${esc(c.first)}</div>`;
      else {
        const ref = c.g ? c.corr || c.first : bestModel(item, c.first);
        body += `<div class="mine">${markedHTML(c.first, ref, right)}</div>`;
      }
    } else if (item.k === "w") {
      const words = ((v || "").trim().match(/\S+/g) || []).length;
      body += `<textarea class="plong" data-pid="${id}" spellcheck="false" aria-label="Dein Text">${esc(v || "")}</textarea><div class="wc${words >= item.min && words <= item.max ? " ok" : ""}" id="wc-${id.replace(".", "-")}">${ptWords(words, item)}</div>`;
    } else
      body += `<textarea class="${item.k === "s" ? "plong pshort" : "pline"}" rows="1" data-pid="${id}" spellcheck="false" autocomplete="off" aria-label="Deine Antwort">${esc(v || "")}</textarea>`;
  }
  if (locked) body += ptResultHTML(id, item, c);
  const u =
    item.k === "w"
      ? "<span></span>"
      : `<button class="unsure${P.u[id] ? " on" : ""}" ${locked ? "disabled" : `data-act="ptu" data-id="${id}"`} title="Unsicher / geraten" aria-label="Als unsicher markieren">?</button>`;
  return `<div class="pitem"><span class="n">${n}</span><div>${body}</div>${u}</div>`;
}
function ptWords(n, item) {
  return `${n} ${n === 1 ? "Wort" : "Wörter"} (Ziel: ${item.min}–${item.max})`;
}
function ptPartCounts(part) {
  let t = 0,
    a = 0;
  part.sections.forEach(sec =>
    sec.items.forEach((it, i) => {
      t++;
      if (ptAnswered(it, sec.id + "." + (i + 1))) a++;
    })
  );
  return { t, a };
}
/* Sonderzeichen-Tasten (z. B. ä ö ü ß), wenn die App welche festlegt */
function charKeys() {
  const k = APP.target.keys || [];
  return k.length
    ? `<div class="keys" aria-label="Sonderzeichen einfügen">${k.map(c => `<button type="button" data-ch="${c}">${c}</button>`).join("")}</div>`
    : "";
}
function renderPlacement() {
  if (!ptOn()) return renderTopics();
  const P = S.placement,
    part = PT.find(p => p.id === P.part) || PT[0],
    st = ptStats();
  let h = `<button class="back" data-act="back">‹ Themen</button><h2 style="margin-top:6px">Einstufungstest</h2>`;
  if (P.done && P.analysis) {
    const a = P.analysis;
    h += `<div class="card"><div class="label">Dein Ergebnis · ${fmtDate(P.doneAt)}</div><p><span class="level">${esc(a.level || "–")}</span>${esc(a.summary || "")}</p>${(a.strengths || []).length ? `<h3>Das sitzt</h3><ul>${a.strengths.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${(a.weaknesses || []).length ? `<h3>Daran arbeiten wir</h3><ul>${a.weaknesses.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${a.focus ? `<p class="muted">${esc(a.focus)}</p>` : ""}<div class="btnrow"><button class="btn" data-act="ptreport">Bericht für Claude kopieren</button></div><div id="ptout"></div></div>`;
  } else if (P.done)
    h += `<div class="card"><p><b>Test abgeschlossen.</b> Kopiere deinen Bericht und füge ihn im Chat mit Claude ein – daraus entstehen deine ersten Themen.</p><div class="btnrow"><button class="btn" data-act="ptreport">Bericht für Claude kopieren</button></div><div id="ptout"></div></div>`;
  else if (!st.answered)
    h += `<div class="card"><p><b>So geht’s.</b> Ohne Wörterbuch und ohne andere Hilfe. Wenn du rätst, tippe neben der Aufgabe auf <b>?</b>. Nach jedem Abschnitt tippst du auf „Abschnitt prüfen“: Deine Antworten werden gesperrt, Richtiges wird grün, Falsches rot, und du siehst die Korrektur mit einer kurzen Erklärung.</p><p class="muted" style="margin:0">Alles wird beim Tippen gespeichert. Du kannst jederzeit aufhören und auf einem anderen Gerät weitermachen.</p>
    <details style="margin-top:10px"><summary class="muted">Schon auf dem Claude-Testblatt angefangen? Antworten übernehmen</summary><p class="muted" style="margin-top:8px">Auf dem Testblatt „Export“ antippen, den Text kopieren und hier einfügen.</p><textarea class="out" id="ptimp" placeholder="Export hier einfügen"></textarea><div class="btnrow"><button class="btn sm" data-act="ptimport">Antworten übernehmen</button></div></details></div>`;
  h += `<div class="ptabs">${PT.map(p => {
    const c = ptPartCounts(p);
    return `<button class="ptab${p.id === part.id ? " on" : ""}${c.a === c.t ? " full" : ""}" data-act="ptpart" data-id="${p.id}"><b>Teil ${p.id}</b><small>${esc(p.name)}</small><small style="display:block">${c.a}/${c.t}</small></button>`;
  }).join("")}</div>`;
  h += `<div class="card"><h2 style="margin:0">Teil ${part.id}: ${esc(part.name)}</h2><p class="muted" style="margin:2px 0 8px">${esc(part.time || "")}</p>${charKeys()}`;
  part.sections.forEach(sec => {
    h += `<div class="psec" style="margin-top:22px"><h3><span class="code">${sec.id}</span>${esc(sec.title)}</h3>${sec.hint ? `<p class="muted">${esc(sec.hint)}</p>` : ""}`;
    if (sec.reading && typeof PT_READING !== "undefined")
      h += `<div class="reading"><b>${esc(sec.title)}</b>${PT_READING.map(t => `<p>${esc(t)}</p>`).join("")}</div>`;
    if (sec.bank) h += `<div class="bank">${sec.bank.map(w => `<span>${esc(w)}</span>`).join("")}</div>`;
    sec.items.forEach((it, i) => (h += ptItemHTML(sec.id + "." + (i + 1), it, i + 1)));
    let checked = 0,
      right = 0;
    sec.items.forEach((it, i) => {
      const c = P.c[sec.id + "." + (i + 1)];
      if (!c || it.k === "w" || c.r === "pending") return;
      checked++;
      if (PT_RIGHT.includes(c.r)) right++;
    });
    const isW = sec.items.every(it => it.k === "w");
    h += `<div class="checkrow"><button class="btn ghost" data-act="ptcheck" data-id="${sec.id}">${isW ? "Text abgeben" : "Abschnitt prüfen"}</button>${checked ? `<span class="muted"><b style="color:var(--yo)">${right} von ${checked}</b> richtig</span>` : ""}</div>`;
    if (PT_NOTES[sec.id]) h += `<p class="muted" style="margin-top:8px">${esc(PT_NOTES[sec.id])}</p>`;
    h += `<p class="muted" style="font-size:13px;margin-top:6px">${isW ? "Nach dem Abgeben ist dein Text gesperrt." : "Nach dem Prüfen sind die Antworten in diesem Abschnitt gesperrt."}</p></div>`;
  });
  h += `</div>`;
  const idx = PT.indexOf(part);
  if (idx < PT.length - 1)
    h += `<div class="btnrow"><button class="btn ghost" data-act="ptpart" data-id="${PT[idx + 1].id}">Weiter zu Teil ${PT[idx + 1].id}</button></div>`;
  if (!P.done) {
    const open = st.total - st.checked;
    h += `<div class="card" style="margin-top:14px"><div class="label">Test abschließen</div><p class="muted">${open ? `${open} Aufgaben sind noch nicht geprüft. Du kannst trotzdem abschließen – offene Aufgaben zählen als nicht beantwortet.` : "Alle Aufgaben sind geprüft. Schließe den Test ab, um dein Ergebnis zu bekommen."}</p><div class="btnrow"><button class="btn${open ? " ghost" : ""}" data-act="ptfinish">${open ? "Trotzdem abschließen" : "Abschließen & Ergebnis ansehen"}</button></div></div>`;
  }
  h += `<div class="card"><div class="label">Frag ${APP.teacher}</div><p class="muted">Eine Grammatikfrage zu einer Korrektur? Frag einfach.</p><div style="display:flex;gap:8px"><input id="askq" class="inp" placeholder="${esc((APP.placement && APP.placement.askPlaceholder) || "Deine Frage …")}" autocomplete="off"><button class="btn sm" data-act="ask" data-id="pt">Fragen</button></div><div id="askres"></div></div>`;
  app().innerHTML = h;
  requestAnimationFrame(() => app().querySelectorAll("textarea.pline").forEach(ptAutosize));
}
function ptAutosize(t) {
  t.style.height = "auto";
  t.style.height = t.scrollHeight + "px";
}
function ptRerender() {
  if (CUR.tab === "topics" && CUR.arg === "pt" && !SESSION) {
    const y = scrollY;
    renderPlacement();
    scrollTo(0, y);
  }
}
/* Karte für „Heute“ (groß) bzw. die Themenliste */
function placementCard(big) {
  if (!ptOn()) return "";
  const P = S.placement,
    st = ptStats();
  if (P.done) return "";
  const started = st.answered > 0;
  if (big)
    return `<div class="next"><div class="label">Erster Schritt: Einstufungstest</div><h2>${started ? "Einstufungstest fortsetzen" : "Finde dein Niveau"}</h2><p>${started ? `${st.answered} von ${st.total} Aufgaben beantwortet, ${st.checked} geprüft. Alles ist gespeichert.` : esc((APP.placement && APP.placement.intro) || "Deine Themen werden auf deinem Ergebnis aufgebaut.")}</p><button class="btn" data-act="pt">${started ? "Weitermachen" : "Test starten"}</button></div>`;
  return `<div class="card"><div class="row" style="padding:0"><div><b>Einstufungstest</b><small>${st.answered}/${st.total} beantwortet</small></div><button class="btn sm" data-act="pt">Öffnen</button></div></div>`;
}
function placementTopicRow() {
  if (!ptOn()) return "";
  const P = S.placement,
    st = ptStats();
  return `<div class="card" style="padding:4px 14px"><button class="titem" data-act="pt"><span class="num">✓</span><span class="body"><b>Einstufungstest</b><div class="fi">${st.answered}/${st.total} beantwortet · ${st.checked} geprüft</div><div class="bar"><i style="width:${st.total ? Math.round((st.checked / st.total) * 100) : 0}%"></i></div></span>${P.done ? `<span class="badge new">${esc((P.analysis && P.analysis.level) || "Fertig")}</span>` : ""}</button></div>`;
}
function placementProgressCard() {
  if (!ptOn()) return "";
  const P = S.placement,
    st = ptStats();
  return `<div class="card"><div class="label">Einstufungstest</div><p>${P.done ? `Abgeschlossen am ${fmtDate(P.doneAt)}${P.analysis ? ` – Niveau <b>${esc(P.analysis.level)}</b>` : ""}.` : `${st.answered} von ${st.total} beantwortet, ${st.checked} geprüft.`}${st.graded ? ` Beim ersten Versuch richtig: <b>${st.right}/${st.graded}</b>.` : ""}</p><div class="btnrow"><button class="btn ghost" data-act="pt">Test öffnen</button></div></div>`;
}
async function ptFinish(b) {
  const st = ptStats();
  if (st.total - st.checked && !b.dataset.sure) {
    b.dataset.sure = "1";
    b.textContent = "Wirklich abschließen? Nochmal tippen";
    return;
  }
  S.placement.done = true;
  S.placement.doneAt = Date.now();
  save();
  if (aiReady()) {
    b.disabled = true;
    b.innerHTML = `${APP.teacher} wertet aus ${dots()}`;
    const p = APP.placement || {};
    try {
      const meta = { k: "einstufung" };
      const j = await aiJSON(
        `Hier sind die Ergebnisse des Einstufungstests von ${ptLearnerInfo()}${p.weak ? "; bekannte Schwächen: " + p.weak : ""}.

${ptReport()}

Analysiere wie eine erfahrene Lehrkraft. Schätze das GER-Niveau (z. B. ${APP.levelHint}) und nenne die Grammatikbereiche, die am dringendsten geübt werden müssen (konkret benannt, nicht allgemein wie „Grammatik“). Listen höchstens 4 Punkte mit je max. 12 Wörtern. Texte auf ${APP.explain}.
JSON: {"level":"…","summary":"2 Sätze","strengths":["…"],"weaknesses":["…"],"focus":"1 Satz: worauf sich die ersten Themen konzentrieren sollen"}`,
        meta
      );
      aiAudit("einstufung", meta, {
        q: "Gesamtauswertung Einstufungstest",
        r: `${j.level || ""} – ${j.summary || ""}`
      });
      S.placement.analysis = j;
      save();
    } catch (e) {
      toast(`${APP.teacher} konnte gerade nicht auswerten – dein Bericht enthält trotzdem alles`);
    }
  }
  CUR = { tab: "topics", arg: "pt" };
  render();
  scrollTo(0, 0);
  toast("Einstufungstest abgeschlossen ✓");
}
/* Abschnitt für den Bericht an Claude (Bezeichner bewusst stabil, Claude wertet sie aus) */
function ptReport() {
  if (!ptOn()) return "";
  const P = S.placement,
    st = ptStats(),
    L = [];
  L.push(
    `EINSTUFUNGSTEST – ${P.done ? "abgeschlossen am " + new Date(P.doneAt).toLocaleDateString(APP.locale) : "läuft noch"}`
  );
  L.push(
    `Beantwortet: ${st.answered}/${st.total} · geprüft: ${st.checked} · beim ersten Versuch richtig: ${st.right}/${st.graded}`
  );
  L.push("Zeichen: ✓ richtig · ✗ falsch · ☆ selbst eingeschätzt · (?) unsicher");
  PT.forEach(part => {
    L.push(`\n=== Teil ${part.id}: ${part.name} ===`);
    part.sections.forEach(sec =>
      sec.items.forEach((it, i) => {
        const id = sec.id + "." + (i + 1),
          c = P.c[id],
          mark = P.u[id] ? " (?)" : "";
        if (it.k === "w") {
          L.push(`\n${id}: ${c ? c.first : ptFmt(it, id)}`);
          if (c && c.g) {
            L.push(`→ Korrektur von ${APP.teacher}: ${c.corr}`);
            (c.mistakes || []).forEach(m => L.push(`  - ${m.wrong} → ${m.right}: ${m.why}`));
            if (c.wlevel) L.push(`  Geschätztes Niveau: ${c.wlevel}`);
          }
          return;
        }
        if (!c) return L.push(`${id}: ${ptFmt(it, id)} (nicht geprüft)${mark}`);
        const ans = it.k === "b" && Array.isArray(c.raw) ? fmtVal(it, c.raw) : c.first;
        let line = `${id}: ${ans}`;
        if (c.r === "pending") line += " (nicht bewertet)";
        else if (c.r === "ok") line += " ✓";
        else if (c.r === "self" || c.r === "self-ok")
          line += ` ☆ selbst als richtig eingeschätzt (Muster: ${modelText(it)})`;
        else if (c.r === "self-bad") line += ` ✗ selbst als falsch eingeschätzt (Muster: ${modelText(it)})`;
        else {
          line += " ✗";
          line +=
            isText(it) && c.corr
              ? ` → Korrektur: ${c.corr}`
              : ` → Lösung: ${isText(it) ? bestModel(it, c.first) : modelText(it)}`;
          if (c.expl) line += ` | ${c.expl}`;
        }
        L.push(line + mark);
      })
    );
  });
  if (P.analysis) {
    const a = P.analysis;
    L.push(
      `\nAUSWERTUNG VON ${APP.teacher.toUpperCase()}: Niveau ${a.level}. ${a.summary || ""}\nStärken: ${(a.strengths || []).join("; ")}\nSchwächen: ${(a.weaknesses || []).join("; ")}\nSchwerpunkt: ${a.focus || ""}`
    );
  }
  return L.join("\n");
}
/* Import aus dem Claude-Testblatt (gleiche IDs) – überschreibt nie vorhandene Antworten */
function isPlacementExport(d) {
  return !!(d && (d.type === "dt-placement" || (d.a && d.c && !d.topics)));
}
function ptImport(txt) {
  try {
    const src = JSON.parse(
      String(txt)
        .replace(/```json|```/g, "")
        .trim()
    );
    if (!src || typeof src.a !== "object") throw 0;
    const P = S.placement,
      valid = new Set(ptAll().map(x => x.id));
    /* nur passende Datentypen übernehmen (Text bzw. Liste von Texten bei Lücken) – sonst stürzt die Ansicht ab */
    const typeOk = (id, v) => {
      const k = ptFind(id).item.k;
      if (k === "w" || k === "r") return typeof v === "string";
      return (
        typeof v === "string" || typeof v === "number" || (Array.isArray(v) && v.every(x => typeof x === "string"))
      );
    };
    /* vor dem Import schon hier getippte Antworten (die nie überschrieben werden) */
    const typedHere = new Set([...valid].filter(id => !P.c[id] && ptAnswered(ptFind(id).item, id)));
    let n = 0;
    Object.keys(src.a || {}).forEach(id => {
      if (!valid.has(id) || P.c[id] || !typeOk(id, src.a[id])) return;
      if (!ptAnswered(ptFind(id).item, id)) {
        P.a[id] = src.a[id];
        n++;
      }
    });
    Object.keys(src.u || {}).forEach(id => {
      if (valid.has(id) && !P.c[id] && src.u[id]) P.u[id] = true;
    });
    Object.keys(src.c || {}).forEach(id => {
      /* nie eine hier schon getippte (noch nicht geprüfte) Antwort überschreiben */
      if (!valid.has(id) || P.c[id] || typedHere.has(id)) return;
      const c = src.c[id];
      /* first: Liste bei Lücken-Aufgaben (b), sonst Text – so wie die Ansicht sie erwartet */
      const firstOk =
        ptFind(id).item.k === "b"
          ? Array.isArray(c.first) && c.first.every(x => typeof x === "string")
          : typeof c.first === "string";
      if (!c || !c.first || !firstOk || (c.raw !== undefined && !typeOk(id, c.raw))) return;
      P.c[id] = {
        first: c.first,
        raw: c.raw !== undefined ? c.raw : typeOk(id, src.a[id]) ? src.a[id] : c.first,
        r: ["ok", "wrong", "self", "self-ok", "self-bad", "pending"].includes(c.r) ? c.r : "pending",
        g: !!c.g,
        corr: typeof c.corr === "string" ? c.corr : "",
        expl: typeof c.expl === "string" ? c.expl : "",
        gaps: Array.isArray(c.gaps) ? c.gaps : undefined,
        t: Date.now()
      };
      if (src.a[id] !== undefined && typeOk(id, src.a[id])) P.a[id] = src.a[id];
      n++;
    });
    if (!P.started) P.started = Date.now();
    save();
    renderPlacement();
    toast(n ? `${n} Antworten übernommen ✓` : "Nichts Neues zu übernehmen");
  } catch (e) {
    toast("Das sieht nicht nach einem Test-Export aus");
  }
}
/* Zusammenführen zweier Geräte: geprüfte (gesperrte) Antworten haben Vorrang, sonst der neuere Stand */
function mergePlacement(l, r, lNewer) {
  if (!l) return r;
  if (!r) return l;
  const M = JSON.parse(JSON.stringify(r));
  M.a = M.a || {};
  M.u = M.u || {};
  M.c = M.c || {};
  for (const id in l.c || {}) {
    const lc = l.c[id],
      rc = M.c[id];
    if (!rc || (lc.g && !rc.g)) {
      M.c[id] = lc;
      if (l.a && id in l.a) M.a[id] = l.a[id];
    }
  }
  for (const id in l.a || {}) if (!M.c[id] && (!(id in M.a) || lNewer)) M.a[id] = l.a[id];
  for (const id in l.u || {}) if (l.u[id]) M.u[id] = true;
  M.done = !!(l.done || M.done);
  M.doneAt = Math.max(l.doneAt || 0, M.doneAt || 0);
  if (!M.analysis && l.analysis) M.analysis = l.analysis;
  M.started = Math.min(...[l.started, M.started].filter(Boolean), Date.now());
  if (lNewer) M.part = l.part;
  return M;
}
/* Eingaben im Test: sofort speichern */
document.addEventListener("input", e => {
  const t = e.target,
    id = t.dataset && t.dataset.pid;
  if (!id || !S || !S.placement) return;
  const P = S.placement;
  if (P.c[id]) return;
  if (!P.started) P.started = Date.now();
  if (t.classList.contains("pgap")) {
    const i = +t.dataset.gi,
      arr = Array.isArray(P.a[id]) ? P.a[id] : [];
    arr[i] = t.value;
    P.a[id] = arr;
    t.style.width =
      Math.max(
        LETTER_END.test(t.previousSibling ? t.previousSibling.textContent || "" : "") ? 3.5 : 8,
        t.value.length + 1.5
      ) + "ch";
  } else {
    P.a[id] = t.value;
    if (t.classList.contains("pline")) ptAutosize(t);
    const wc = document.getElementById("wc-" + id.replace(".", "-"));
    if (wc) {
      const it = ptFind(id).item,
        n = (t.value.trim().match(/\S+/g) || []).length;
      wc.textContent = ptWords(n, it);
      wc.classList.toggle("ok", n >= it.min && n <= it.max);
    }
  }
  saveSoon();
});
/* Sonderzeichen-Tasten: fügen in das zuletzt benutzte Eingabefeld ein */
let LAST_FIELD = null;
document.addEventListener("focusin", e => {
  if (
    e.target.matches &&
    e.target.matches("input.inp,textarea.inp,input.pgap,textarea.pline,textarea.plong,input.tcell,input.dcell")
  )
    LAST_FIELD = e.target;
});
document.addEventListener("mousedown", e => {
  if (e.target.closest && e.target.closest("[data-ch]")) e.preventDefault();
});
function insertChar(ch) {
  const f =
    LAST_FIELD && document.body.contains(LAST_FIELD)
      ? LAST_FIELD
      : $("#ans") || document.querySelector(".dcell,.tcell");
  if (!f || f.readOnly || f.disabled) return;
  const s = f.selectionStart ?? f.value.length,
    en = f.selectionEnd ?? f.value.length;
  f.setRangeText(ch, s, en, "end");
  f.dispatchEvent(new Event("input", { bubbles: true }));
  f.focus();
}
window.addEventListener("resize", () => {
  if (app()) app().querySelectorAll("textarea.pline").forEach(ptAutosize);
});
