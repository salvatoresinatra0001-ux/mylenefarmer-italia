#!/usr/bin/env bash
set -euo pipefail
printf '\n=== MYLENE FARMER ITALIA / LOCAL AUDIT ===\n'
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo 'Non sei in un repository Git'; exit 1; }
printf '\nBranch e SHA:\n'
git branch --show-current
git rev-parse --short HEAD
printf '\nModifiche locali:\n'
git status --short
printf '\nRemote:\n'
git remote -v
printf '\nConfigurazioni:\n'
for f in package.json netlify.toml vite.config.js vite.config.ts next.config.js next.config.mjs; do
  if [ -f "$f" ]; then printf '%s\n' "$f"; fi
done
printf '\nAudit locale completato. Stato remoto e deploy NON verificati.\n'
