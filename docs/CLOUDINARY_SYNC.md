# Cloudinary → GitHub → Netlify: photographic archive sync

This repository contains the **public gallery implementation**, not a public copy of the private Cloudinary archive.

## Architecture
- Cloudinary Media Library stores images, including content not cleared for publication.
- The live public-list function includes only assets with a short edge of **at least 800 px**, explicit `quality_reviewed=true` and `publish=true`, `rights_verified=true`, photographer/license, and HTTPS source/evidence URLs. It sorts the largest pixel area first. The evidence URL is validated but never returned to the browser.
- `data/cloudinary-approved.json` is an explicit, human-reviewed allowlist. Empty means **publish none**.
- `scripts/sync_cloudinary_catalog.py` uses the Cloudinary Admin API to enumerate **MYLENE_FARMER/**, validates approved public IDs and produces `assets/data/cloudinary-gallery.json`.
- `archivio-visivo.html` is the **single public photographic archive**, merging the verified Wikimedia/Drive public manifest with individually approved Cloudinary photos; it provides years, periods, categories, search, sorting and an accessible lightbox.
- `netlify/functions/cloudinary-periods.mjs` reads only folder labels and year/period metadata under `MYLENE_FARMER/` through the Cloudinary Admin API, without exposing credentials, private public IDs or original image URLs.
- Legacy photo pages remain available for historical bookmarks but link and canonicalize to the unified gallery.
- GitHub Pages serves committed files; Netlify serves the `dist/` build from `main`.

## One-time setup
1. In GitHub repository Settings → Secrets and variables → Actions, configure **CLOUDINARY_CLOUD_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET**. Never enter these in HTML, JSON, commits or chat.
2. Populate `data/cloudinary-approved.json` ONLY with photograph identifiers and documented author, rights holder/license, reliable source URL and evidence URL. Year and period are inferred from the actual Cloudinary asset folder where possible; the curator may supply a verified year/period. Valid categories: `portraits`, `live`, `discography`, `visual`, `appearances`.
3. GitHub Actions → **Cloudinary gallery catalog sync** → Run workflow. The script reads the archive but does **not** upload, overwrite or delete assets.
4. Verify successful build and the resulting `assets/data/cloudinary-gallery.json` changes in `main`.
5. In Netlify verify that **mylenefarmer-italia** deploys automatically from the same GitHub repo and `main`. Build command: `node scripts/build-site.mjs`; publish dir: `dist`.
6. Check both URLs: `https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/archivio-visivo.html` and `https://mylenefarmer.it/archivio-visivo.html`.

## Example approved entry
```json
{
  "public_id": "MYLENE_FARMER/replace-with-actual-public-id",
  "title": "Verified title",
  "category": "live",
  "year": "2013",
  "period": "Timeless 2013",
  "photographer": "Verified credit",
  "license": "Documented license / explicit permission",
  "source_url": "https://example.org/source",
  "rights_evidence": "https://example.org/license-or-permission-record"
}
```
No such record is included by default. Merely possessing images or finding them on third-party sites is not publication permission.

For the optional tagged-asset list, store these custom metadata fields on each Cloudinary image only after review: `publish=true`, `rights_verified=true`, `quality_reviewed=true`, `photographer`, `license`, `alt`, `source_url` (HTTPS), and `rights_evidence` (HTTPS). Optional fields: `title`, `year`, and `license_url`. Assets without the complete review record are omitted even when their resolution is high.

## Scope of synchronization
Synchronizes **metadata and approved imagery references**, not duplicate binary image storage. The legacy photographic catalog remains unchanged. Cloudinary may hold identical-byte duplicates; choose one approved public ID per photograph. Re-run the workflow after manual changes to Cloudinary or the approval list.

**Netlify publishing is contingent on an active Git integration.** This repository does not contain an automatic Netlify deployment token or credentials.

## Protected delivery mode (18 October 2026)
The public gallery uses opaque image IDs and the Netlify function `/.netlify/functions/cloudinary-photo?id=<opaque-id>&size=thumb|large`. Browser markup and the generated `assets/data/cloudinary-gallery.json` no longer include per-image Cloudinary CDN URLs.
The function checks the curated `data/cloudinary-approved.json` allowlist and fetches the image server-side. GitHub Pages consumes the image proxy on `https://mylenefarmer.it`; this creates a deliberate dependency on Netlify being operational.
The public website build excludes `data/cloudinary-approved.json`. **However, this file is still visible in the public GitHub source repository.** It contains public IDs and rights documentation, not credentials.
Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the **Netlify site environment** with Functions/runtime scope, as well as GitHub Actions secrets for inventory generation. Never commit any secret.
The proxy URL itself remains retrievable by visitors and images can be saved or captured. It hides the Cloudinary delivery URL from the rendered page but **does not provide DRM, prevent copying, or revoke an existing publicly accessible Cloudinary origin URL**. Strong origin restrictions require moving selected assets to Cloudinary authenticated delivery, carefully testing signed delivery first; do not change existing asset access control in bulk.
Netlify automatically bundles `netlify/functions/cloudinary-photo.mjs` during a successful deploy from `main`. Verify the function, actual image output, build and displayed gallery on both destinations before marking synchronization complete.

## Unified chronology (18 October 2026)

- Main public gallery: `/archivio-visivo.html`. It includes the existing 19 rights-documented Wikimedia photos (2012, 2013, 2019, 2023) and **zero** Cloudinary photos until explicit rights approval is recorded.
- Cloudinary taxonomy endpoint: `/.netlify/functions/cloudinary-periods`. The function lists folders and periods but **never** publishes images by itself. Folder discovery can be incomplete when the API is unavailable or a folder is outside the supported depth.
- Year/period labels in the public Cloudinary photo catalog are derived from `asset_folder` (or its public ID folder fallback) only for individually approved photos.
- `rights_evidence` is required for approval validation but is intentionally **excluded** from the public gallery JSON. The approval file itself remains in the public GitHub source and should not contain private tokens, passwords, internal URLs or confidential evidence.
- The gallery's chronological filters also show years available in the folder taxonomy, even if those folders contain no public photos. This is a cataloguing view, not a grant of publication rights.
- The prior `archivio-drive.html`, `galleria-hq.html`, `archivio-fotografico.html` and ALFA previews are retained for backwards compatibility and source documentation. The homepage, visual edition, footer and primary navigation link to the single `archivio-visivo.html` gallery.
- Netlify may inject its own HUD script after the HTML. The synchronization audit preserves raw SHA-256 hashes and separately reports exact content equality after stripping **only** the known HUD suffix; it never treats unrelated differences as equivalent.
