#!/usr/bin/env node
/* Bericht für Claude aus der Cloud holen (E-1010-6) – nur lesen, nichts speichern.
   Die App legt den „Bericht für Claude“ (Einstellungen → „Bericht … automatisch in die Cloud“) in der Supabase-Tabelle
   berichte ab. Dieses Skript meldet sich mit einem eigenen Lese-Konto an, das nur Berichte lesen darf, und gibt den
   neuesten Bericht auf der Konsole aus.
   Zugangsdaten nur als Geheimnisse der Cloud-Umgebung, nie im Repo oder Chat:
     OPI_SB_URL, OPI_SB_KEY (anon-Schlüssel), OPI_BERICHT_EMAIL, OPI_BERICHT_PASSWORT
   Aufruf: node tools/bericht-holen.mjs            neuester Bericht
           node tools/bericht-holen.mjs --liste    vorhandene Tage mit Uhrzeit
           node tools/bericht-holen.mjs --tag 2026-10-10
           --app DT  → Variablen mit DT_ statt OPI_ (anderes Supabase-Projekt)
   curl statt fetch: curl nutzt den Proxy der Cloud-Umgebung; das Passwort geht über stdin, nicht über die Befehlszeile. */
import { execFileSync } from "node:child_process";

const arg = process.argv.slice(2),
  opt = k => {
    const i = arg.indexOf(k);
    return i >= 0 ? arg[i + 1] : null;
  };
const P = (opt("--app") || "OPI").toUpperCase() + "_";
const env = k => process.env[P + k] || "";
const url = env("SB_URL").replace(/\/+$/, ""),
  key = env("SB_KEY"),
  email = env("BERICHT_EMAIL"),
  pass = env("BERICHT_PASSWORT");
const missing = ["SB_URL", "SB_KEY", "BERICHT_EMAIL", "BERICHT_PASSWORT"].filter(k => !env(k));
if (missing.length) {
  console.error(`Fehlende Umgebungsvariablen: ${missing.map(k => P + k).join(", ")} (Geheimnisse der Cloud-Umgebung)`);
  process.exit(2);
}
function curl(path, { method = "GET", body, token } = {}) {
  const a = ["-sS", "-X", method, url + path, "-H", "apikey: " + key, "-H", "Content-Type: application/json", "-w", "\n%{http_code}"];
  if (token) a.push("-H", "Authorization: Bearer " + token);
  if (body !== undefined) a.push("--data-binary", "@-");
  let out;
  try {
    out = execFileSync("curl", a, { input: body, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch (e) {
    console.error("Cloud nicht erreichbar: " + String(e.stderr || e.message).trim() + "\n(Supabase-Adresse unter Network access der Cloud-Umgebung freigegeben?)");
    process.exit(3);
  }
  const i = out.lastIndexOf("\n"),
    code = Number(out.slice(i + 1)),
    txt = out.slice(0, i);
  let j = null;
  try {
    j = JSON.parse(txt);
  } catch (e) {}
  if (code >= 300) {
    console.error(`Cloud-Fehler HTTP ${code}: ${(j && (j.error_description || j.msg || j.message)) || txt.slice(0, 200)}`);
    process.exit(4);
  }
  return j;
}
const auth = curl("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password: pass }) });
const token = auth && auth.access_token;
if (!token) {
  console.error("Anmeldung des Lese-Kontos fehlgeschlagen");
  process.exit(4);
}
if (arg.includes("--liste")) {
  const rows = curl("/rest/v1/berichte?select=tag,updated_at&order=tag.desc&limit=60", { token }) || [];
  if (!rows.length) console.log("Keine Berichte in der Cloud.");
  rows.forEach(r => console.log(`${r.tag}  (zuletzt ${new Date(r.updated_at).toLocaleString("de-AT", { timeZone: "Europe/Vienna" })})`));
  process.exit(0);
}
const tag = opt("--tag");
const q = tag ? `&tag=eq.${encodeURIComponent(tag)}` : "";
const rows = curl(`/rest/v1/berichte?select=tag,updated_at,text${q}&order=tag.desc&limit=1`, { token }) || [];
if (!rows.length) {
  console.error(tag ? `Kein Bericht vom ${tag}.` : "Keine Berichte in der Cloud.");
  process.exit(1);
}
const r = rows[0];
console.log(`# Bericht vom ${r.tag} (hochgeladen ${new Date(r.updated_at).toLocaleString("de-AT", { timeZone: "Europe/Vienna" })})\n`);
console.log(r.text);
