#!/usr/bin/env bash
set -euo pipefail
REPO='https://github.com/salvatoresinatra0001-ux/mylenefarmer-italia.git'
TARGET="${1:-$HOME/Projects/mylene-farmer-italia}"
command -v git >/dev/null || { echo 'Git non installato'; exit 1; }
if [ -e "$TARGET/.git" ]; then
  echo "Repository esistente: $TARGET"
elif [ -e "$TARGET" ]; then
  echo "Percorso occupato, non sovrascrivo: $TARGET" >&2; exit 1
else
  mkdir -p "$(dirname "$TARGET")"
  git clone "$REPO" "$TARGET"
fi
cd "$TARGET"
echo '=== Stato repository ==='
git status --short
git remote -v
git branch --show-current
if [ -f package.json ] && command -v node >/dev/null; then
  echo "Node: $(node --version)"
  if command -v npm >/dev/null; then echo "npm: $(npm --version)"; fi
fi
echo 'Bootstrap completato senza push o deploy.'
