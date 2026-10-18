# Cloudinary → GitHub → Netlify: photographic archive sync

This repository contains the **public gallery implementation**, not a public copy of the private Cloudinary archive.

## Architecture
- Cloudinary Media Library stores images, including content not cleared for publication.
- `data/cloudinary-approved.json` is an explicit, human-reviewed allowlist. Empty means **publish none**.
- `scripts/sync_cloudinary_catalog.py` uses the Cloudinary Admin API to enumerate **MYLENE_FARMER/**, validates approved public IDs and produces `assets/data/cloudinary-gallery.json`.
- `archivio-visivo.html` displays the JSON catalog with sections, search and enlarged images.
- GitHub Pages serves committed files; Netlify serves the `dist/` build from `main`.

## One-time setup
1. In GitHub repository Settings → Secrets and variables → Actions, configure **CLOUDINARY_CLOUD_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET**. Never enter these in HTML, JSON, commits or chat.
2. Populate `data/cloudinary-approved.json` ONLY with photograph identifiers and documented author, rights holder/license, reliable source URL and evidence URL. Valid categories: `portraits`, `live`, `discography`, `visual`, `appearances`.
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
  "photographer": "Verified credit",
  "license": "Documented license / explicit permission",
  "source_url": "https://example.org/source",
  "rights_evidence": "https://example.org/license-or-permission-record"
}
```
No such record is included by default. Merely possessing images or finding them on third-party sites is not publication permission.

## Scope of synchronization
Synchronizes **metadata and approved imagery references**, not duplicate binary image storage. The legacy photographic catalog remains unchanged. Cloudinary may hold identical-byte duplicates; choose one approved public ID per photograph. Re-run the workflow after manual changes to Cloudinary or the approval list.

**Netlify publishing is contingent on an active Git integration.** This repository does not contain an automatic Netlify deployment token or credentials.
