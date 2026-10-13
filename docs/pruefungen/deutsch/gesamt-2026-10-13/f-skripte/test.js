const h = require("./harness"), C = h.load("de");
const ts = require("scratchpad/dtw/lektionen/lektionen.json");
const g = (id, i) => ts.find(t => t.id === id).ex[i];
const tabCell = (id, i, row, col) => { const e = g(id, i); const c = e.r[row][col]; return { ex: e, acc: c.slice(1, -1).split("|") }; };
const cases = [
  // [Kategorie, id, i, Eingabe, erwartet]
  ["Großschreibung", "d04", 33, "Die paradeiser sind heute sehr schön.", "falsch (Nomen klein)"],
  ["Großschreibung", "d04", 33, "die Paradeiser sind heute sehr schön", "richtig (Satzanfang frei)"],
  ["Großschreibung", "d06", 39, "Gehört dieser Schlüssel ihnen?", "falsch (Sie-Form)"],
  ["Großschreibung", "d03", 7, "während", "richtig (Lücke am Satzanfang)"],
  ["Großschreibung", "d04", 17, "stände", "falsch (Nomen)"],
  ["Engl. Antwort klein", "d02", 15, "unfortunately i have to postpone the appointment", "richtig"],
  ["Engl. Antwort klein", "d02", 46, "i have been on sick leave since monday", "richtig"],
  ["Engl. Antwort klein", "d07", 45, "do you have an umbrella? – no, i don't have one", "richtig"],
  ["ß/ss", "d05", 41, "Ich nehme diesen Blumenstrauss.", "richtig (Hinweis)"],
  ["ae/oe/ue", "d04", 33, "Die Paradeiser sind heute sehr schoen.", "richtig oder fast richtig (Ersatzschreibung)"],
  ["ae/oe/ue", "d06", 39, "Gehoert dieser Schluessel Ihnen?", "richtig oder fast richtig (Ersatzschreibung)"],
  ["ae/oe/ue", "d04", 18, "Erdaepfel", "fast richtig (Ersatzschreibung)"],
  ["Umlaut fehlt", "d04", 33, "Die Paradeiser sind heute sehr schon.", "falsch/KI (schon ≠ schön)"],
  ["Umlaut fehlt", "d04", 18, "Erdapfel", "falsch (Singular)"],
  ["Umlaut fehlt", "d06", 20, "gefallt", "falsch (Form)"],
  ["Satzzeichen", "d02", 13, "Ich bleibe heute zu Hause weil ich Fieber habe", "richtig"],
  ["Satzzeichen", "d06", 39, "Gehört dieser Schlüssel Ihnen.", "richtig (Satzzeichen zählen nicht)"],
  ["Satzzeichen", "d07", 45, "Do you have an umbrella? - No, I don't have one.", "richtig (Bindestrich statt Gedankenstrich)"],
  ["Satzzeichen", "d07", 45, "Do you have an umbrella? No, I don't have one.", "richtig (ohne Strich)"],
  ["Leerzeichen", "d02", 13, "Ich bleibe heute zu Hause ,  weil ich Fieber habe .", "richtig"],
  ["zu Hause", "d01", 52, "Ich bin zuhause geblieben und habe eingekauft.", "richtig"],
  ["zu Hause", "d01", 52, "Ich bin daheim geblieben und habe eingekauft.", "richtig (getrennt auch üblich)"],
  ["zu Hause", "d02", 13, "Weil ich Fieber habe, bleibe ich heute zuhause.", "richtig"],
  ["zu Hause", "d09", 24, "zuhause", "falsch? (Lücke verlangt Präposition)"],
  ["Apostroph", "d02", 46, "I’ve been on sick leave since Monday.", "richtig (typogr. Apostroph)"],
  ["Apostroph", "d02", 46, "I have been on sick leave since monday.", "richtig"],
  ["Apostroph", "d02", 48, "Nevertheless I am going to work today.", "richtig (I am = I'm)"],
  ["Apostroph", "d08", 46, "What is wrong?", "richtig (What is = What's)"],
  ["Apostroph", "d07", 44, "I will take that one.", "richtig (I will = I'll)"],
  ["Trennbar", "d08", 43, "Nehmen Sie dreimal täglich eine Tablette ein", "richtig"],
  ["Trennbar", "d01", 52, "Ich bin zu Hause geblieben und habe eingekauft", "richtig"],
  ["Trennbar", "d01", 52, "Ich bin zu Hause geblieben und habe ein gekauft.", "falsch/KI"],
  ["Tippfehler", "d05", 41, "Ich nehme diesen Blumenstruaß.", "„Nur vertippt?“"],
  ["Tippfehler", "d06", 39, "Gehört dieser Schlüssel Ihenn?", "„Nur vertippt?“ (Ende)"],
  ["Österr.", "d04", 33, "Die Tomaten sind heute sehr schön.", "richtig"],
  ["Österr.", "d04", 33, "Die Paradeisern sind heute sehr schön.", "falsch/KI"],
];
const out = [];
for (const [k, id, i, inp, exp] of cases) { const ex = g(id, i); out.push([k, `${id} ex[${i}] ${ex.t}${ex.dir ? "/" + ex.dir : ""}`, inp, exp, h.verdict(C, ex, inp)]); }
// Tabellen (caseFree = false)
const tcases = [
  ["Tabelle Satz", "d02", 1, 0, 1, "heute bleibe ich zu Hause.", "richtig (Satzanfang)"],
  ["Tabelle Satz", "d08", 3, 1, 1, "nimm die Tablette!", "richtig (Satzanfang)"],
  ["Tabelle Satz", "d06", 4, 0, 1, "ich gebe ihm das Paket.", "richtig (Satzanfang)"],
  ["Tabelle Fragewort", "d05", 6, 2, 1, "wem", "richtig (Fragewort)"],
  ["Tabelle Fall", "d09", 0, 0, 1, "dativ", "streitbar (Fachwort)"],
  ["Tabelle Sie", "d06", 1, 0, 1, "ihnen", "falsch (Sie-Form)"],
  ["Tabelle ß", "d02", 1, 0, 1, "Heute bleibe ich zuhause", "richtig"],
];
for (const [k, id, i, r, c, inp, exp] of tcases) { const e = g(id, i); const row = e.r.filter(x=>x.some(y=>/^\[.*\]$/.test(y)))[r] || e.r[r]; const cell=row.find(y=>/^\[.*\]$/.test(y)); const acc = cell.slice(1,-1).split("|"); const res = C.localCheck(inp, acc, C.exStrict(e), e); out.push([k, `${id} ex[${i}] tab „${acc[0]}“`, inp, exp, res.correct ? "richtig" + (res.note ? " (fast)" : "") : res.caseOnly ? "FALSCH (Groß/klein, ohne KI)" : "falsch"]); }
// Vokabelkarten (localCheck ohne ex)
const V = (id, i) => ts.find(t => t.id === id).v[i];
const vacc = w => [w[1], ...w[1].replace(/\(.*?\)/g, "").split(/[,/;]/), ...(w[1].match(/\((.*?)\)/g) || []).flatMap(x => x.slice(1, -1).split(/[,;]/)).map(x => x.replace(/^\s*auch:\s*/, ""))].map(x => x.trim()).filter(Boolean);
const vcases = [
  ["Karte EN→DE", "d04", 0, "de", "der Markt", "richtig (Grundform mit Artikel)"],
  ["Karte EN→DE", "d04", 0, "de", "der Markt, die Märkte", "richtig"],
  ["Karte EN→DE", "d04", 0, "de", "der Markt die Märkte", "richtig"],
  ["Karte EN→DE", "d04", 0, "de", "der markt, die märkte", "falsch (Nomen klein)"],
  ["Karte EN→DE", "d09", 2, "de", "die U-Bahn", "richtig"],
  ["Karte EN→DE", "d09", 2, "de", "die UBahn, die UBahnen", "fast richtig"],
  ["Karte EN→DE", "d05", 5, "de", "der Blumenstrauss, die Blumenstraeusse", "fast richtig"],
  ["Karte EN→DE", "d01", 1, "de", "wie war dein Wochenende", "richtig"],
  ["Karte DE→EN", "d04", 9, "fi", "bag", "richtig"],
  ["Karte DE→EN", "d01", 2, "fi", "to go on a trip", "richtig"],
  ["Karte DE→EN", "d01", 3, "fi", "hike", "richtig (ohne „to“)"],
  ["Karte DE→EN", "d01", 2, "fi", "machte", "falsch (deutsch, aus Klammer)"],
  ["Karte DE→EN", "d08", 3, "fi", "Gesundheitskarte", "falsch (deutsch)"],
];
for (const [k, id, i, dir, inp, exp] of vcases) { const w = V(id, i); const acc = dir === "de" ? [w[0]] : vacc(w); const res = C.localCheck(inp, acc, false); out.push([k, `${id} v[${i}] „${(dir==="de"?w[0]:w[1]).slice(0,40)}“`, inp, exp, res.correct ? "richtig" + (res.note ? " (fast)" : "") : res.caseOnly ? "FALSCH (Groß/klein, ohne KI)" : "→ KI (offline: falsch)"]); }
console.log("| Fall | Übung | Eingabe | erwartet | App-Urteil |\n|---|---|---|---|---|");
out.forEach(r => console.log("| " + r.map(x => String(x).replace(/\|/g, "\\|")).join(" | ") + " |"));
