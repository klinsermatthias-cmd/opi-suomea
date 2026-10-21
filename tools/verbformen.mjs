// Verbformen-Prüfung (D-1021-12): vergleicht alle Verbkarten mit voller Tabelle (Format D-1020-29: Wortkarte mit
// {f: ["Präsens: ich … · du … · …", "Präteritum: …", "Perfekt: …"], s: "…", k: "regelmäßig · trennbar · …"})
// mit den Flexionstabellen von DWDS (www.dwds.de/lemma/flexion/<Verb>). Nur für Apps mit Deutsch als Lernsprache.
// Braucht Netz (curl über den Proxy) und läuft daher NICHT bei jedem Push, sondern auf Abruf:
//   node tools/verbformen.mjs [themenId…] [--lektionen pfad] [--cache ordner]
// Cache: DWDS-Seiten werden im Ordner --cache (Standard: <tmp>/dwds) gespeichert und wiederverwendet.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const PR = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"],
  REFL = new Set(["mich", "dich", "sich", "uns", "euch", "mir", "dir"]),
  AT = new Set([
    "sitzen",
    "stehen",
    "liegen",
    "hängen",
    "knien",
    "hocken",
    "schweben",
    "schwimmen"
  ]) /* österr. Perfekt mit sein */,
  MODAL = new Set(["dürfen", "sollen", "wollen", "können", "müssen", "mögen"]),
  CAPS = [
    ["Präsens", "Präsens"],
    ["Präteritum", "Präteritum"],
    ["Perfekt", "Präsensperfekt (Perfekt)"]
  ],
  HAB = { bin: "habe", bist: "hast", ist: "hat", sind: "haben", seid: "habt" };

const unesc = s =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

function holen(lemma, cache) {
  const f = path.join(cache, `flexion-${lemma}.html`);
  if (fs.existsSync(f) && fs.statSync(f).size > 8000) return fs.readFileSync(f, "utf8");
  let code = "";
  try {
    code = execFileSync(
      "curl",
      [
        "-sL",
        "--max-time",
        "30",
        "-A",
        "Mozilla/5.0 (Lernapp-Pruefung)",
        "-o",
        f,
        "-w",
        "%{http_code}",
        "https://www.dwds.de/lemma/flexion/" + encodeURIComponent(lemma)
      ],
      { encoding: "utf8" }
    );
  } catch (e) {}
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1200) /* DWDS schonen */;
  return code === "200" ? fs.readFileSync(f, "utf8") : null;
}

/* Tabelle „<lemma>: <cap>, Indikativ“ → 6 Mengen von Formen in Personenreihenfolge */
function tabelle(s, lemma, cap) {
  const i = s.indexOf(`${lemma}: ${cap}, Indikativ`);
  if (i < 0) return null;
  const body = s.slice(i, s.indexOf("</table>", i)),
    cells = [...body.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m =>
      m[1].split("<br/>").map(x =>
        unesc(x.replace(/<[^>]+>/g, ""))
          .replace("(ugs.)", "")
          .trim()
      )
    );
  return [0, 2, 4, 1, 3, 5].map(
    k =>
      new Set(
        (cells[k] || [])
          .flatMap(x => x.split(", "))
          .map(y => y.trim().replace(/\s+/g, " "))
          .filter(Boolean)
      )
  );
}

const ohneRefl = s =>
  s
    .split(" ")
    .filter(t => t && !REFL.has(t))
    .join(" ");
const norm = f => ohneRefl(f.replace(/\(.*?\)/g, "").trim());

export function verbformen({
  lektionen = "lektionen/lektionen.json",
  cache = path.join(os.tmpdir(), "dwds"),
  ids = []
} = {}) {
  fs.mkdirSync(cache, { recursive: true });
  const L = JSON.parse(fs.readFileSync(lektionen, "utf8")),
    out = [];
  let n = 0;
  for (const t of L) {
    if (ids.length && !ids.includes(t.id)) continue;
    (t.v || []).forEach((v, i) => {
      const d = v[2] && typeof v[2] === "object" ? v[2] : {};
      if (!Array.isArray(d.f)) return;
      n++;
      const w = v[0],
        toks = w.split(/\s+/),
        refl = toks[0] === "sich",
        rest = refl ? toks.slice(1) : toks,
        lemma = rest[rest.length - 1],
        obj = new Set(rest.slice(0, -1)),
        tag = `${t.id}-${i} ${w}`,
        s = holen(lemma, cache);
      if (!s) return out.push(`${tag}: DWDS nicht abrufbar`);
      if (d.f.length !== 3) out.push(`${tag}: ${d.f.length} Zeilen statt 3`);
      const m2 = /Perfekt mit (haben oder sein|sein oder haben|haben|sein)/.exec(s),
        hv = m2 ? m2[1] : "haben",
        auxs = new Set([
          ...(hv.includes("sein") ? ["bin", "bist", "ist", "sind", "seid"] : []),
          ...(hv.includes("haben") ? ["habe", "hast", "hat", "haben", "habt"] : [])
        ]);
      CAPS.forEach(([lab, cap], li) => {
        const tb = tabelle(s, lemma, cap);
        if (!tb) return out.push(`${tag}: Tabelle ${cap} fehlt bei DWDS`);
        const line = d.f[li] || "";
        if (!line.startsWith(lab + ":")) return out.push(`${tag}: Zeile ${li + 1} beginnt nicht mit ${lab}`);
        const parts = line
          .slice(lab.length + 1)
          .split(" · ")
          .map(p => p.trim());
        if (parts.length !== 6) return out.push(`${tag}: ${lab} hat ${parts.length} Personen`);
        parts.forEach((p, j) => {
          if (!p.startsWith(PR[j] + " ")) return out.push(`${tag}: ${lab} Person ${j + 1} Pronomen „${p}“`);
          p.slice(PR[j].length + 1)
            .split(", ")
            .map(norm)
            .forEach(vv => {
              const v2 = vv
                .split(" ")
                .filter(x => !obj.has(x))
                .join(" ");
              let ok = tb[j].has(v2);
              if (!ok && lab === "Perfekt") {
                const [a0, ...r0] = v2.split(" "),
                  tbp = new Set([...tb[j]].map(x => x.split(" ").slice(1).join(" ")));
                ok = tbp.has(r0.join(" ")) && auxs.has(a0);
                if (!ok && AT.has(lemma)) ok = tb[j].has(v2.replace(/^(bin|bist|ist|sind|seid)\b/, x => HAB[x]));
              }
              if (!ok) out.push(`${tag}: ${lab} ${PR[j]}: Karte „${vv}“ ≠ DWDS ${[...tb[j]].sort().join(" | ")}`);
            });
        });
      });
      /* s = er-Formen der drei Zeilen */
      try {
        const er = [0, 1, 2].map(k =>
            ohneRefl(
              d.f[k]
                .split(": ")[1]
                .split(" · ")[2]
                .replace(/^er\/sie\/es /, "")
                .split(", ")[0]
            )
          ),
          sp = String(d.s || "")
            .replace(/\(.*?\)/g, "")
            .split(" · ")
            .map(x => ohneRefl(x.trim()));
        if (sp.join("|") !== er.join("|")) out.push(`${tag}: s „${d.s}“ ≠ er-Formen ${er.join(" · ")}`);
      } catch (e) {
        out.push(`${tag}: s/f nicht lesbar`);
      }
      /* k: regelmäßig / trennbar / reflexiv */
      const kk = String(d.k || "").split(" · "),
        pt = tabelle(s, lemma, "Präteritum"),
        erPt = pt ? [...pt[2]].sort()[0] || "" : "",
        m = /Partizip II ([^;"]+?)[;"]/.exec(s),
        p2 = m ? m[1].split(",")[0].trim() : "",
        sep = erPt.split(" ").length > 1,
        base = sep ? lemma.slice(erPt.split(" ")[1].length) : lemma,
        stem = /(eln|ern)$/.test(base) ? base.slice(0, -1) : base.replace(/e?n$/, ""),
        fin = erPt.split(" ")[0],
        reg = (fin === stem + "te" || fin === stem + "ete") && p2.endsWith("t");
      if (!MODAL.has(lemma) && kk.includes("regelmäßig") !== reg)
        out.push(`${tag}: k „${d.k}“, aber DWDS Prät ${fin}, Part ${p2} → ${reg ? "regelmäßig" : "unregelmäßig"}`);
      if (kk.includes("trennbar") !== sep) out.push(`${tag}: k „${d.k}“ trennbar? DWDS ${erPt}`);
      if (kk.includes("reflexiv") !== refl) out.push(`${tag}: k „${d.k}“ reflexiv? Karte ${w}`);
    });
  }
  return { n, out };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const args = process.argv.slice(2),
    o = { ids: [] };
  for (let i = 0; i < args.length; i++) {
    const m = /^--(lektionen|cache)$/.exec(args[i]);
    if (m) o[m[1]] = args[++i];
    else o.ids.push(args[i]);
  }
  const { n, out } = verbformen(o);
  out.forEach(x => console.log(x));
  console.log(
    n
      ? `${n} Verbkarten mit DWDS verglichen, ${out.length} Funde`
      : "Keine Verbkarten mit voller Tabelle – nichts zu prüfen"
  );
}
