/* TEST-EINSTELLUNGEN für tools/pruefen.mjs (Engine-Tests, in allen Apps gleich). Kopie der Opi-suomea-Einstellungen
   mit eingeschaltetem Einstufungstest. Nicht für die echte App – die steht in js/app.js.
   Alles, was Opi suomea vom Deutsch-Trainer unterscheidet, steht hier, in farben.css, js/inhalte.js, lektionen/,
   manifest.webmanifest und den Icons. Alle anderen Dateien sind die gemeinsame Lern-Engine und in beiden Apps gleich
   (siehe docs/engine.md). Diese Datei wird beim Übernehmen der Engine NICHT überschrieben. */
const APP = {
  id: "opi-suomea", // Speicherschlüssel im Browser, Datei- und Datenbanknamen – nie ändern (sonst ist der Fortschritt weg)
  name: "Opi suomea",
  tagline: "Dein Finnischkurs mit Opettaja",
  color: "#0a3a7e", // Farbe der Statusleiste am Handy
  learner: "Matthias",
  teacher: "Opettaja",
  teacherRole: "KI-Lehrerin",
  teacherKind: "Finnischlehrerin", // „Analysiere wie eine erfahrene …“
  /* Grundhaltung der KI (Systemanweisung) */
  persona:
    "Du bist „Opettaja“, eine geduldige, ehrliche und motivierende Finnischlehrerin. Dein Schüler heißt Matthias, ist Anfänger und spricht Deutsch. Du erklärst einfach und präzise auf Deutsch. Finnische Beispiele müssen immer korrekt sein.",
  explain: "Deutsch", // Sprache der KI-Erklärungen
  levelHint: "„A0“, „A0+“, „A1-“", // Beispiele für die Niveau-Schätzung
  /* Lernsprache (target) und Sprache der Übersetzungen (base) */
  target: {
    code: "fi",
    name: "Finnisch",
    adj: "finnisch",
    ins: "ins Finnische",
    tts: "fi-FI",
    sample: "Hei! Opitaan suomea.",
    keys: ["ä", "ö"] // Sonderzeichen-Tasten unter Eingabefeldern (z. B. ["ä", "ö", "ü", "ß"]); leer = keine
  },
  base: { name: "Deutsch", adj: "deutsch", ins: "ins Deutsche" },
  locale: "de-AT",
  /* Tabs unten: [groß, klein] */
  tabs: [
    ["Tänään", "Heute"],
    ["Aiheet", "Themen"],
    ["Sanat", "Vokabeln"],
    ["Fortschritt", "Edistys"]
  ],
  greeting(h) {
    return h < 10 ? "Hyvää huomenta" : h < 17 ? "Hyvää päivää" : h < 22 ? "Hyvää iltaa" : "Hyvää yötä";
  },
  doneTitle: "Hyvää työtä!",
  askPlaceholder: "z. B. Warum heißt es „en puhu“?",
  /* Beispiele im Auftrag „Neue Übungen von Opettaja“ (dir "de" = Übersetzung in die Lernsprache) */
  genExamples: `{"t":"gap","q":"Minä ___ kotona.","h":"olla","a":["olen"]}
{"t":"tr","dir":"de","q":"Ich wohne in Linz.","a":["Asun Linzissä","Minä asun Linzissä"]}
{"t":"tr","dir":"fi","q":"Hän ei ole täällä.","a":["Er ist nicht hier","Sie ist nicht hier"]}
{"t":"tab","q":"Konjugiere …","head":["Person","Verb"],"r":[["minä","[form]"],["sinä","[form]"]]}`,
  /* Funktionen, die nicht jede App braucht */
  features: { placement: true },
  /* Einstufungstest (nur mit features.placement): Angaben für die KI-Auswertung */
  placement: { level: "B1", goal: "B2", weak: "Fälle", intro: "Testlauf", askPlaceholder: "Frage …" },
  /* Logo im Kopf (finnische Flagge) */
  logo: '<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#fff"/><rect x="9.5" y="0" width="6" height="32" fill="#0a3a7e"/><rect x="0" y="13" width="32" height="6" fill="#0a3a7e"/></svg>',
  /* Landschaft im Kopf: Wald mit Spiegelung im See */
  landscape(svg) {
    let seed = 11;
    const r = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    let d = "M0 30",
      m = "M0 30",
      x = -6;
    while (x < 1206) {
      const w = 8 + r() * 10,
        h = 8 + r() * 20;
      d += ` L${x.toFixed(1)} 30 L${(x + w / 2).toFixed(1)} ${(30 - h).toFixed(1)} L${(x + w).toFixed(1)} 30`;
      m += ` L${x.toFixed(1)} 30 L${(x + w / 2).toFixed(1)} ${(30 + h * 0.45).toFixed(1)} L${(x + w).toFixed(1)} 30`;
      x += w * 0.82;
    }
    svg.innerHTML = `<path style="fill:var(--head-forest)" d="${d} L1206 30 Z"/><rect x="0" y="30" width="1200" height="14" style="fill:var(--lumi)"/><path style="fill:var(--mirror)" d="${m} L1206 30 Z"/>`;
  }
};
