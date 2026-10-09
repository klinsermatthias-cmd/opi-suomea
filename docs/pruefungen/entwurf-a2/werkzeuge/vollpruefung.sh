#!/bin/bash
# Kopie des Repos (Stand origin/main), Entwürfe an lektionen.json anhängen, tools/pruefen.mjs ausführen (nur lesend fürs Repo)
S=${S:-/tmp/vollpruefung}; mkdir -p "$S"   # Arbeitsordner (frei wählbar)
R=${R:-$(git rev-parse --show-toplevel)}
git -C $R worktree remove --force $S/kopie 2>/dev/null; rm -rf $S/kopie; git -C $R worktree prune; git -C $R worktree add -q --detach $S/kopie origin/main && cd $S/kopie || exit 1
node -e 'const fs=require("fs");const a=JSON.parse(fs.readFileSync("lektionen/lektionen.json","utf8"));const b=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));fs.writeFileSync("lektionen/lektionen.json",JSON.stringify(a.concat(b),null,1));console.log("angehängt:",b.length)' $R/docs/pruefungen/entwurf-a2/lektionen-a2.json
WORTCHECK=${WORTCHECK:-} BASIS=origin/main timeout 1500 node tools/pruefen.mjs > $S/vollpruefung.txt 2>&1; echo "Exit $?"
grep -vE "^\s*(✓|OK|ok)" $S/vollpruefung.txt | head -${ZEILEN:-80}
