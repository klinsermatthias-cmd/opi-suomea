/* Lern-Engine – sprache.js: Eigenheiten der Lernsprache (APP.target.code) für Wörter antippen, Vokabelhilfe
   und KI-Prüfung. Gehört zur gemeinsamen Engine; neue Lernsprachen hier ergänzen. */
const SPRACHEN = {
  fi: {
    sort: "fi",
    /* Endungen, die beim Antippen abgeschnitten werden, um die Grundform zu finden (längste zuerst), mit Vermerk */
    ends: [
      ["issa", "-ssa = in …"],
      ["issä", "-ssä = in …"],
      ["ssa", "-ssa = in …"],
      ["ssä", "-ssä = in …"],
      ["sta", "-sta = aus …"],
      ["stä", "-stä = aus …"],
      ["lla", "-lla = auf / bei …"],
      ["llä", "-llä = auf / bei …"],
      ["lle", "-lle = auf / zu …"],
      ["ko", "Frage mit -ko"],
      ["kö", "Frage mit -kö"],
      ["na", "-na = am … / als …"],
      ["nä", "-nä = am … / als …"],
      ["ta", "Teilungsform (Partitiv)"],
      ["tä", "Teilungsform (Partitiv)"],
      ["mme", ""],
      ["tte", ""],
      ["vat", ""],
      ["vät", ""],
      ["n", ""],
      ["t", ""],
      ["a", "Teilungsform (Partitiv)"],
      ["ä", "Teilungsform (Partitiv)"]
    ],
    /* Zusätzliche Formen aus den Tabellen-Übungen: Verneinungsform = minä-Form ohne -n (olen → en ole) */
    derive(forms, add) {
      forms.forEach(x => {
        if (x.per === "minä" && !x.q && /n$/.test(x.f))
          add(x.f.slice(0, -1), {
            de: x.de,
            base: x.base,
            note: "Verneinungsform (en/et/ei … " + x.f.slice(0, -1) + ") · auch Befehlsform an „sinä“"
          });
      });
    },
    /* Zahlen 11–19 und Zehner: kaksi + toista = 12, kolme + kymmentä = 30 */
    number(k, d) {
      const nm = /^(.+?)(toista|kymmentä)$/.exec(k);
      const nb = nm && d[nm[1]] && /\((\d+)/.exec(d[nm[1]].de);
      if (!nb) return null;
      const n = +nb[1],
        v = nm[2] === "toista" ? n + 10 : n * 10;
      return { de: String(v), note: nm[1] + " (" + n + ") + " + nm[2] + (nm[2] === "toista" ? " (+10)" : " (×10)") };
    },
    /* Ortsnamen: Steyrissä = in Steyr */
    place(w) {
      const pl = /^([A-ZÄÖ][a-zäöå]+?)i?ss[aä]$/.exec(String(w).trim());
      return pl ? { de: "in " + pl[1], note: "Ort + -ssa/-ssä = „in …“" } : null;
    },
    /* Vokabelhilfe: unregelmäßige Formen → Grundform; Verneinungsverb immer als „ei (Verb)“ */
    irregular: { ole: "olla", on: "olla", ovat: "olla", olen: "olla", olet: "olla", olemme: "olla", olette: "olla" },
    neg: {
      words: ["en", "et", "ei", "emme", "ette", "eivät"],
      base: /^ei \(verb\)$/i,
      key: "ei (verb)",
      de: "nicht (Verneinungsverb)"
    },
    /* KI-Prüfung */
    judge:
      " Falsche Endungen, falsche Vokalharmonie oder falsche Verbformen sind falsch. Die Länge von Vokalen und Konsonanten unterscheidet Wörter (tuli/tuuli, kuka/kukka): Ein fehlender oder zusätzlicher Doppelbuchstabe ist kein Tippfehler, sondern falsch (z. B. „nähdän“ statt „nähdään“, „olkon“ statt „olkoon“).",
    strict: " In dieser Aufgabe wird gezielt a/ä bzw. o/ö geprüft – eine Verwechslung ist falsch.",
    charNote: "achte auf ä/ö",
    /* Was die lokale Prüfung als „fast richtig“ durchgehen lässt (E-1008-3): fehlende Punkte auf ä/ö (Tastatur) */
    loose: [
      ["ä", "a"],
      ["ö", "o"],
      ["ü", "u"],
      ["ß", "ss"]
    ],
    /* Beispiele in Erklärungen: das vermeiden (führt Anfänger auf falsche Formen) */
    explainAvoid: "Wörter mit Stufenwechsel (z. B. lukea → luen, kauppa → kaupassa)",
    /* Was beim Bewerten zusätzlich als richtig gilt (E-1007-51) */
    tolerance:
      "Ein weggelassenes Personalpronomen ist richtig (z. B. „Olen kotona.“ statt „Minä olen kotona.“). Kurze Antworten, wie man sie im Gespräch sagt (z. B. „Tee, kiitos.“), sind richtig, wenn die Aufgabe keinen ganzen Satz verlangt. Umgangssprache (mä, sä …) ist nicht falsch – nenne dann kurz die Schriftsprache.",
    explainTopic: /stufenwechsel|astevaihtelu/i
  },
  de: {
    sort: "de",
    ends: [
      ["sten", ""],
      ["est", ""],
      ["st", ""],
      ["en", ""],
      ["em", ""],
      ["er", ""],
      ["es", ""],
      ["et", ""],
      ["e", ""],
      ["n", ""],
      ["s", ""],
      ["t", ""]
    ],
    derive: null,
    number: null,
    place: null,
    irregular: {
      bin: "sein",
      bist: "sein",
      ist: "sein",
      sind: "sein",
      seid: "sein",
      war: "sein",
      waren: "sein",
      habe: "haben",
      hast: "haben",
      hat: "haben",
      habt: "haben"
    },
    neg: null,
    judge:
      " Falsche Artikel, falsche Endungen (Fälle, Adjektivendungen), falsche Wortstellung oder falsche Verbformen sind falsch.",
    strict:
      " In dieser Aufgabe werden Umlaute und ß gezielt geprüft – eine Verwechslung (a/ä, o/ö, u/ü, ss/ß) ist falsch.",
    charNote: "achte auf ß",
    /* Umlaute tragen im Deutschen Grammatik (Bruder/Brüder, wurde/würde) – nur ß/ss gilt als fast richtig (E-1008-3) */
    loose: [["ß", "ss"]],
    /* Groß-/Kleinschreibung trägt Bedeutung (Nomen, „Sie“/„sie“) – lokale Prüfung und KI achten darauf, nur der
       Satzanfang ist frei (E-1008-9) */
    caseMatters: true,
    caseRule:
      "Fehlende Satzzeichen zählen nicht. Groß-/Kleinschreibung zählt: Nomen und die Höflichkeitsform „Sie“ werden großgeschrieben; nur der erste Buchstabe am Satzanfang ist egal.",
    explainAvoid: "unregelmäßige Formen oder Sonderfälle, die nicht zum Thema gehören",
    tolerance:
      "Kurze Antworten, wie man sie im Gespräch sagt, sind richtig, wenn die Aufgabe keinen ganzen Satz verlangt. Österreichische und bundesdeutsche Varianten sind beide richtig. Ein fehlendes Subjektpronomen ist im Deutschen falsch.",
    explainTopic: null
  }
};
const SP = SPRACHEN[APP.target.code] || SPRACHEN.de;
