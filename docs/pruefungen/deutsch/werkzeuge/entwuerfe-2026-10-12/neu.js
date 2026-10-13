  ,
  /* W16 (E-1008-58, E-1009-10, E-1010-5, E-1008-64/E-1009-3): Tippfehler-Frage umschaltbar bis „Weiter“, „Nur vertippt –
     trotzdem richtig“ nach einer knappen falschen Antwort, beides als Ausrutscher gezählt; „Noch nicht gelernt?“ an/aus/an
     und im Bericht; Antwortfelder ohne Autokorrektur (E-1008-57) */
  ["Nur vertippt und Noch nicht gelernt", async day => {
    const fit = ex => (ex.t === "tr" || ex.t === "gap") && !exStrict(ex) && !ex.gid && typeof (ex.a || [])[0] === "string";
    // zwei benachbarte Buchstaben tauschen – in einem Wort ab 5 Buchstaben, nicht in den letzten zwei (dort sitzen Endungen)
    const mkTypo = s => { for (const m of s.matchAll(/\p{L}{5,}/gu)) { const w = m[0]; for (let i = 0; i + 1 < w.length - 2; i++) if (w[i] !== w[i + 1]) { const p = m.index + i; return s.slice(0, p) + s[p + 1] + s[p] + s.slice(p + 2); } } return null; };
    // ein Vokal doppelt: kein Tippfehler im Sinn der App (Länge zählt), aber höchstens 2 Buchstaben daneben
    const mkLen = s => { const m = s.match(/\p{L}*?[aeiouyäö]/iu); return m ? s.slice(0, m.index + m[0].length) + m[0].slice(-1) + s.slice(m.index + m[0].length) : null; };
    const t = learningTopics().find(x => T(x.id).ex.filter(fit).length >= 2); if (!t || S.active || !aiReady() || geminiDownNow()) return "skip";
    A.tab("topics"); clk("topic", t.id); clk("extra", t.id); if (!SESSION || SESSION.kind !== "topic") return "skip";
    const E = [], slip0 = (S.slips || []).map(x => x.d + x.k + x.w).join("|"), st = { typo: 0, len: 0, unl: null, inp: 0 };
    await simRound(day, false, {
      answer: async (ex, info) => {
        if (!st.inp) { st.inp = 1; const i = document.querySelector("#ans"); if (i && (i.getAttribute("autocorrect") !== "off" || i.getAttribute("spellcheck") !== "false")) E.push("Antwortfeld mit Autokorrektur/Rechtschreibprüfung (E-1008-57)"); }
        if (info.retry || !fit(ex)) return null;
        if (!st.typo) { const x = mkTypo(ex.a[0]); if (!x) return null; st.typo = 1; return { text: x, self: true, mark: "typo" }; }
        if (!st.len) { const x = mkLen(ex.a[0]); if (!x) return null; st.len = 1; return { text: x, expect: false, mark: "len", why: "Vokal doppelt (Länge) als richtig gewertet" }; }
        return null;
      },
      after: async (ex, res, plan) => {
        if (plan && plan.mark === "typo") {
          if (!SESSION.typoPend) return E.push("Nach „Nur vertippt“ fehlt die umschaltbare Markierung (E-1010-5)");
          clk("typotoggle"); if (SESSION.typoPend.on) E.push("„Nur vertippt“ lässt sich nicht zurücknehmen");
          clk("typotoggle"); if (!SESSION.typoPend.on) E.push("„Nur vertippt“ lässt sich nicht wieder setzen");
          if (res) E.push("„Nur vertippt“ wurde schon vor „Weiter“ gezählt (E-1010-5)");
        }
        if (plan && plan.mark === "len") {
          if (SESSION.typoPend) E.push("Längenfehler als Tippfehler angeboten (E-1009-5)");
          if (!simHas("selftypo")) E.push("„Nur vertippt – trotzdem als richtig werten“ fehlt bei knapper falscher Antwort (E-1009-10)");
          else { clk("selftypo"); if (!(SESSION.undo && SESSION.undo.on)) E.push("„trotzdem richtig“ nicht vorgemerkt"); }
        }
        if (!st.unl && simHas("unlearned")) {
          const b = document.querySelector('#app [data-act="unlearned"]'), [tid, ei] = b.dataset.id.split("|");
          clk("unlearned", b.dataset.id); const on1 = unlearnedOn(tid, +ei);
          clk("unlearned", b.dataset.id); const off = unlearnedOn(tid, +ei);
          clk("unlearned", b.dataset.id); const on2 = unlearnedOn(tid, +ei);
          if (!on1 || off || !on2) E.push(`„Noch nicht gelernt?“ an/aus/an klappt nicht (${on1}/${off}/${on2})`);
          st.unl = { tid, ei: +ei };
        }
      }
    });
    const neu = (S.slips || []).filter(x => !slip0.includes(x.d + x.k + x.w));
    if (st.typo && !neu.some(x => x.k === "typo")) E.push("„Nur vertippt“ nicht als Ausrutscher gezählt");
    if (st.len && !neu.some(x => x.k === "self")) E.push("„trotzdem richtig“ nicht als Ausrutscher (selbst gewertet) gezählt");
    const rep = buildReport();
    if (neu.length && !/AUSRUTSCHER/.test(rep)) E.push("Bericht ohne Abschnitt AUSRUTSCHER");
    if (st.unl) {
      if (!rep.includes(`${st.unl.tid} ex[${st.unl.ei}]`)) E.push("„Noch nicht gelernt?“ fehlt im Bericht");
      unlearnedToggle(st.unl.tid, st.unl.ei, ""); save(); // zurücknehmen, damit die Simulation nicht verfälscht wird
    }
    if (!st.typo && !st.unl) return "skip";
    return E.length ? E.join("; ") : "ok";
  }],
  /* Vokabeln (E-1008-59, E-1009-6, E-1008-57): von der KI anerkannte Antwort wird gemerkt und steht im Bericht; Claudes
     „falsch“ (ki-pruefung.json) nimmt sie zurück; wegen Tippfehler anerkannt = Ausrutscher, nicht gemerkt; Rückwärts-Karte
     verrät die Lösung nicht */
  ["Vokabeln: anerkannte Antwort, Tippfehler, Rückwärts-Karte", async day => {
    if (!Object.keys(S.cards).length || S.active || !aiReady() || geminiDownNow()) return "skip";
    const E = [];
    (S.vocAlt || []).filter(x => x.v && !x.v.ok).forEach(x => { if (vocAltFor(x.id).length && vocAltFor(x.id).some(y => y.a === x.a)) E.push(`von Claude als falsch beurteilte Antwort gilt weiter: ${x.id} ${x.a}`); });
    A.tab("today"); if (!simHas("extravocab")) return E.length ? E.join("; ") : "skip";
    clk("extravocab"); let n = 0, alt = null, typo = null, rev = 0;
    while (SESSION && SESSION.kind === "vocab" && SESSION.queue.length && n++ < 12 && (!alt || !typo || !rev)) {
      const id = SESSION.queue[0], w = cardWord(id), inp = document.querySelector("#ans");
      if (SESSION.dir === "de") { rev++; const f = norm((document.querySelector(".front") || {}).textContent || ""), core = norm(w[1].replace(/\(.*?\)/g, "").split(":")[0]);
        if (norm(w[0]).length >= 3 && !core.includes(norm(w[0])) && f.includes(norm(w[0]))) E.push(`Rückwärts-Karte verrät die Lösung: ${w[1]} → ${w[0]} (E-1008-57)`); }
      if (inp && (inp.getAttribute("autocorrect") !== "off" || inp.getAttribute("spellcheck") !== "false")) E.push("Vokabel-Eingabe mit Autokorrektur (E-1008-57)");
      const mode = !alt ? "alt" : !typo ? "typo" : "";
      if (inp) inp.value = mode === "alt" ? "simsynonym" : mode === "typo" ? "simtypo" : SESSION.dir === "fi" ? w[1] : w[0];
      clk("flip");
      if (inp && document.querySelector("#vjudge")) await simWait(() => !/prüft/.test(document.querySelector("#vjudge").textContent), 20000);
      if (mode === "alt" && inp) { alt = id; if (!(S.vocAlt || []).some(x => x.id === id && x.a === "simsynonym")) E.push("anerkannte Vokabel-Antwort nicht gemerkt (E-1008-59)"); }
      if (mode === "typo" && inp) { typo = id; if ((S.vocAlt || []).some(x => x.id === id && x.a === "simtypo")) E.push("wegen Tippfehler anerkannte Antwort als Alternative gemerkt (E-1009-6)"); if (!(S.slips || []).some(x => x.k === "typo" && x.u === "simtypo")) E.push("Vokabel-Tippfehler nicht als Ausrutscher gezählt (E-1009-6)"); }
      clk("crate", "good");
    }
    if (SESSION && SESSION.kind === "vocab") SESSION = null;
    await simIdle();
    if (alt && !/VOKABEL-ANTWORTEN ZUR PRÜFUNG[\s\S]*simsynonym/.test(buildReport())) E.push("anerkannte Vokabel-Antwort fehlt im Bericht");
    if (!alt) return E.length ? E.join("; ") : "skip";
    return E.length ? E.join("; ") : "ok";
  }],
  /* W17 (E-1010-6): Schalter „Bericht für Claude automatisch in die Cloud“ – lädt sofort hoch; danach nach jedem Hochladen
     höchstens alle 30 min (Prüfung je Tag im Hauptablauf) */
  ["Bericht in die Cloud", async () => {
    if (!cloudOn()) return "skip";
    A.tab("settings"); if (!simHas("togglereport")) return "Schalter „Bericht in die Cloud“ fehlt (E-1010-6)";
    if (S.settings.cloudReport) { window.__simReportOn = 1; return "ok"; }
    const ok0 = CFG.reportOk || 0; clk("togglereport");
    await simWait(() => (CFG.reportOk || 0) > ok0 || CFG.reportErr, 8000);
    if (!((CFG.reportOk || 0) > ok0)) return "Bericht nicht hochgeladen: " + (CFG.reportErr || "keine Antwort");
    window.__simReportOn = 1; return "ok";
  }],
  /* W18 (E-1008-62, E-1008-51): Stimme wählen (mit Hörprobe, nur dieses Gerät); Vorlese-Knöpfe in Theorie-Tabellen, bei
     class="sayall" in jeder Spalte */
  ["Stimme, Vorlesen", async () => {
    const E = [];
    A.tab("settings"); const sel = document.getElementById("voicesel");
    if (!sel) return document.querySelector('[data-act="listen"]') ? "Stimmenwahl fehlt trotz mehrerer Stimmen der Lernsprache (E-1008-62)" : "skip";
    const opts = [...sel.options].map(o => o.value), keep = sel.value; window.__spoken = [];
    setSel("voicesel", opts.find(v => v !== keep)); if (CFG.voice === keep) E.push("gewählte Stimme nicht gespeichert"); if (!window.__spoken.length) E.push("keine Hörprobe nach Stimmenwahl");
    if (S.voice !== undefined) E.push("Stimme im synchronisierten Lernstand statt nur auf dem Gerät");
    setSel("voicesel", keep);
    const t = TOPICS.find(x => /class="sayall"/.test(x.th || "") && S.topics[x.id].status !== "locked") || TOPICS.find(x => S.topics[x.id].status !== "locked");
    if (t) {
      A.tab("topics"); clk("topic", t.id);
      const det = document.querySelector("#app details"); if (det && !det.open) det.open = true;
      if (/class="sayall"/.test(t.th || "") && !document.querySelector('#app table.sayall td:nth-child(2) [data-act="say"]')) E.push(`${t.id}: Theorie-Tabelle „sayall“ ohne Vorlese-Knopf in Spalte 2 (E-1008-51)`);
      const b = document.querySelector('#app [data-act="say"]'); window.__spoken = [];
      if (b) { b.click(); if (!window.__spoken.length) E.push("Vorlese-Knopf liest nichts vor"); }
      A.tab("today");
    }
    return E.length ? E.join("; ") : "ok";
  }]
