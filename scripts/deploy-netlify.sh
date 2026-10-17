#!/usr/bin/env bash
# Mylène Farmer Italia — one-shot Netlify deployment; no sudo, no token embedded.
set -euo pipefail
REPO_URL="https://github.com/salvatoresinatra0001-ux/mylenefarmer-italia.git"
BRANCH="${MF_BRANCH:-main}"
SITE_ID="${NETLIFY_SITE_ID:-16d15b68-e636-4c49-a6f0-b5f91c2b8d93}"
if ! command -v git >/dev/null 2>&1; then echo "Richiesto Git (installa Apple Command Line Tools)."; exit 1; fi
if ! command -v node >/dev/null 2>&1 || ! command -v npx >/dev/null 2>&1; then
 echo "Richiesti Node.js e npx. Installare Node LTS, poi ripetere."; exit 1
fi
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/mfi-deploy.XXXXXXXX")"
cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT
echo "Scaricamento repository (${BRANCH})..."
git clone --quiet --depth 1 --branch "$BRANCH" "$REPO_URL" "$TMP_DIR/repo"
cd "$TMP_DIR/repo"
node scripts/build-site.mjs
echo "Site ID: ${SITE_ID}"
echo "Richiesta autenticazione Netlify solo se non gia' disponibile."
if command -v netlify >/dev/null 2>&1; then
 CLI=(netlify)
else
 CLI=(npx --yes netlify-cli)
fi
# Netlify CLI can use a pre-existing login or NETLIFY_AUTH_TOKEN. Never print credentials.
if [[ -z "${NETLIFY_AUTH_TOKEN:-}" ]]; then
 if ! "${CLI[@]}" status >/dev/null 2>&1; then
  "${CLI[@]}" login
 fi
fi
"${CLI[@]}" deploy --prod --no-build --dir="$TMP_DIR/repo/dist" --site="$SITE_ID" \
 --message="Mylene Farmer Italia - GitHub ${BRANCH} unified static release"
echo "Deploy richiesto. Verificare l'URL e lo stato READY su Netlify."
