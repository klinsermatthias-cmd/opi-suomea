// GitHub-Prüfläufe zu einem Commit kurz anzeigen (T-1012-13): eine Zeile je Lauf statt ~16 KB JSON.
// Aufruf: node tools/ci-status.mjs [--warten] [--repo besitzer/name] [commit]
//   commit   Standard: HEAD (lokaler Stand)
//   --repo   Standard: aus `git remote get-url origin`
//   --warten fragt alle 20 s nach, bis alle Läufe fertig sind (höchstens 15 min); gibt nur das Ergebnis aus
// Exit-Code 1, wenn ein Lauf fehlschlägt oder keiner gefunden wird. Fragt öffentlich (Repos sind öffentlich), nur bei
// Ablehnung mit GH_TOKEN/GITHUB_TOKEN. Gibt nie Schlüssel aus.
import { execSync, execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const warten = args.includes("--warten");
const ri = args.indexOf("--repo");
const repo =
  ri >= 0
    ? args[ri + 1]
    : execSync("git remote get-url origin")
        .toString()
        .trim()
        .replace(/^.*github\.com[/:]|\.git$/g, "")
        .replace(/^.*\/git\//, "");
const rest = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--repo");
const sha = execSync(`git rev-parse ${rest[0] || "HEAD"}`)
  .toString()
  .trim();
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

// Abfrage per curl: nutzt den Proxy der Cloud-Umgebung von selbst (Node-fetch tut das nicht).
function laeufe() {
  const url = `https://api.github.com/repos/${repo}/actions/runs?head_sha=${sha}&per_page=20`;
  const hol = mitToken => {
    const h = [
      "-H",
      "Accept: application/vnd.github+json",
      ...(mitToken ? ["-H", "Authorization: Bearer " + token] : [])
    ];
    try {
      return JSON.parse(
        execFileSync("curl", ["-sS", "--fail-with-body", ...h, url], { stdio: ["ignore", "pipe", "pipe"] }).toString()
      );
    } catch (e) {
      return null;
    }
  };
  const j = hol(false) || (token ? hol(true) : null);
  if (!j) {
    console.log(`${repo}: GitHub nicht erreichbar oder Abfragegrenze erreicht`);
    process.exit(1);
  }
  return j.workflow_runs || [];
}

const ende = Date.now() + 15 * 60 * 1000;
let runs = laeufe();
while (warten && (!runs.length || runs.some(l => l.status !== "completed")) && Date.now() < ende) {
  await new Promise(res => setTimeout(res, 20000));
  runs = laeufe();
}
if (!runs.length) {
  console.log(`${repo} ${sha.slice(0, 7)}: kein Prüflauf gefunden`);
  process.exit(1);
}
for (const l of runs) console.log(`${l.name}: ${l.status}${l.conclusion ? "/" + l.conclusion : ""} (Lauf ${l.id})`);
process.exit(runs.some(l => l.conclusion && !["success", "skipped"].includes(l.conclusion)) ? 1 : 0);
