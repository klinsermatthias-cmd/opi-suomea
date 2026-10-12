// Formen in einer Quelle kompakt nachschlagen (T-1012-20, E-1009-22): statt ganzer Seiten nur das, was für die
// Prüfung zählt – je Wort höchstens ~8 Zeilen: Wortart, Kopf- und Beugungsvorlagen, die ersten Bedeutungen.
// Aufruf: node tools/quellen.mjs [--sprache fi|de] [--quelle en|fi|de] <wort> [<wort> …]
//         node tools/quellen.mjs --datei <rohtext.txt> [--sprache fi]   (gespeicherter Wiktionary-Rohtext, z. B. zum Testen)
//   --sprache  Lernsprache (Standard: fi = Finnisch, de = Deutsch)
//   --quelle   Wiktionary-Ausgabe (Standard: en; fi = fi.wiktionary.org, de = de.wiktionary.org)
// Abruf über curl (nutzt den Proxy der Cloud-Umgebung). In der Meldung an Matthias die Quelle nennen, z. B.
// „Wiktionary (en): talo – {{fi-decl-valo|…}}“. Ist eine Seite nicht erreichbar, steht das in der Ausgabe – dann nicht so
// tun, als wäre geprüft worden. Kielitoimiston sanakirja braucht weiterhin den Browser (siehe lektionen/pruefliste.md).
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : d;
};
const sprache = opt("--sprache", "fi");
const quelle = opt("--quelle", "en");
const datei = opt("--datei", null);
const woerter = args.filter(
  (a, i) => !a.startsWith("--") && !["--sprache", "--quelle", "--datei"].includes(args[i - 1])
);

// Name des Sprachabschnitts je Wiktionary-Ausgabe
const ABSCHNITT = {
  en: { fi: "Finnish", de: "German" },
  fi: { fi: "suomi", de: "saksa" },
  de: { fi: "Finnisch", de: "Deutsch" }
};

/* Aus dem Rohtext den Abschnitt der Lernsprache holen und kürzen. Erkennt Abschnitte in en/fi (==Finnish==) und de
   (== talo ({{Sprache|Finnisch}}) ==). Ergebnis: Zeilen für die Ausgabe. */
export function kurz(roh, sprache = "fi", quelle = "en") {
  const name = ABSCHNITT[quelle]?.[sprache] || ABSCHNITT.en[sprache];
  const zeilen = String(roh).split("\n");
  const start = zeilen.findIndex(
    z =>
      /^==[^=]/.test(z) &&
      (z.includes(`==${name}==`) || z.includes(`|${name}}}`) || z.replace(/\s/g, "") === `==${name}==`)
  );
  if (start < 0) return [`kein Abschnitt „${name}“`];
  let ende = zeilen.findIndex((z, i) => i > start && /^==[^=]/.test(z));
  if (ende < 0) ende = zeilen.length;
  const teil = zeilen.slice(start + 1, ende);
  const out = [];
  let art = "";
  let bedeutungen = 0;
  for (const z of teil) {
    const h = z.match(/^===+\s*([^=]+?)\s*===+$/);
    if (h) {
      art = h[1];
      bedeutungen = 0;
      continue;
    }
    // Kopf- und Beugungsvorlagen der Lernsprache (z. B. {{fi-noun}}, {{fi-decl-valo|…}}, {{fi-conj-sanoa|…}}, {{de-noun|…}})
    const vorlagen = z.match(
      new RegExp(`\\{\\{(${sprache}-[a-z-]+|Deutsch [^|}]+Übersicht|fi-[a-z-]+)[^{}]*\\}\\}`, "g")
    );
    if (vorlagen) vorlagen.forEach(v => out.push(`${art ? art + ": " : ""}${v}`));
    // Bedeutungen: die ersten zwei Zeilen „# …“ je Wortart, ohne Wiki-Klammern
    if (/^#[^#*:]/.test(z) && bedeutungen < 2) {
      bedeutungen++;
      const t = z
        .replace(/^#\s*/, "")
        .replace(/\{\{[^{}]*\}\}/g, "")
        .replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, "$1")
        .replace(/'''?/g, "")
        .trim();
      if (t) out.push(`  ${art ? art + " – " : ""}${t.slice(0, 120)}`);
    }
  }
  return out.length ? out.slice(0, 8) : ["Abschnitt gefunden, aber keine Vorlagen/Bedeutungen"];
}

function hole(wort) {
  const url = `https://${quelle}.wiktionary.org/w/index.php?title=${encodeURIComponent(wort)}&action=raw`;
  try {
    return execFileSync("curl", ["-sS", "--fail", "--max-time", "20", url], {
      stdio: ["ignore", "pipe", "pipe"]
    }).toString();
  } catch (e) {
    return null;
  }
}

if (process.argv[1] && process.argv[1].endsWith("quellen.mjs")) {
  if (datei) {
    console.log(`== ${datei}`);
    kurz(fs.readFileSync(datei, "utf8"), sprache, quelle).forEach(z => console.log(z));
  } else if (!woerter.length) {
    console.log("Aufruf: node tools/quellen.mjs [--sprache fi|de] [--quelle en|fi|de] <wort> …");
    process.exit(1);
  }
  let fehlt = 0;
  for (const w of woerter) {
    const roh = hole(w);
    console.log(`== ${w} (Wiktionary ${quelle})`);
    if (roh === null) {
      fehlt++;
      console.log("nicht erreichbar oder keine Seite – NICHT geprüft");
      continue;
    }
    kurz(roh, sprache, quelle).forEach(z => console.log(z));
  }
  process.exit(fehlt ? 1 : 0);
}
