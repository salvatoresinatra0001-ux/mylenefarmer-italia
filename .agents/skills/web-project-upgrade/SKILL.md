---
name: web-project-upgrade
description: Master skill for analyzing, upgrading, maintaining, and preparing Salvatore Sinatra's existing or in-development websites for release. Use when a website needs a full or targeted improvement across HTML, CSS3, JavaScript, TypeScript, Python, PHP, frameworks, CMS platforms, APIs, databases, hosting, GitHub, Netlify, or other project systems; covers architecture, visual design, content structure, responsive behavior, accessibility, SEO, performance, security, testing, synchronization, deployment, and verification.
---
# Web Project Upgrade — Version 1.0

## Mission
Improve the user's websites as coherent, working systems. Work with the technologies already present, preserve valid content and functionality, and deliver verified changes rather than an untested proposal. Apply to portfolios, photography archives, editorial sites, landing pages, galleries, identity sites, and experimental web projects.

## Operating principles
- Inspect the actual project before choosing an implementation. Treat repository files and current configuration as the source of truth.
- Separate confirmed facts, assumptions, and unknowns. Never claim a deployment, synchronization, image upload, permission, or browser check succeeded without evidence.
- Preserve useful content, authentic media, attribution, existing working features, project history, secrets, and user configuration. Avoid destructive edits and broad rewrites without a task-based reason.
- Respect the user's requested scope and visual direction. Make pragmatic choices where details are unspecified; explain consequential assumptions briefly.
- Use available integrations and credentials only for their authorized purpose. Keep secrets out of source, logs, public assets, and client-side code.
- Prefer the smallest coherent set of changes that achieves the stated outcome. Match the project's established conventions and avoid unnecessary dependencies.

## Workflow

### 1. Establish project state
Inspect repository status before editing, identify the root, branches and remotes, recent changes, build scripts, dependencies, framework, routes, content sources, assets, environment configuration, hosting, and deployment context. Look for project-specific instructions such as `AGENTS.md`, README guidance, and existing tests. Do not overwrite uncommitted user changes. If the target project is not available, state what artifact or access is missing and proceed with any independent planning possible.

### 2. Translate the request into a concrete scope
Identify target pages, users, content, desired behavior, constraints, and release destination. Convert broad requests such as “improve everything” into a prioritized checklist: critical errors first, then structural and visual improvements, then quality and optimization. Do not invent pages, features, or content volume to make the work appear larger. When the user supplies a reference or prior version, inspect it and retain the beneficial parts.

### 3. Audit the current site
Review:
- **Structure and content:** information architecture, page hierarchy, navigation, internal links, completeness, duplication, and editorial clarity.
- **Visual system:** layout, spacing, typography, color, responsive behavior, consistency, brand identity, image treatment, and interaction states.
- **Function:** forms, menus, galleries, filters, sliders, search, media loading, routing, and browser-console errors.
- **Quality:** semantic HTML, keyboard access, focus visibility, contrast, reduced motion, alt text, metadata, canonical and social tags, performance, image weight, security basics, and cross-device behavior.
- **Delivery:** build command and output directory, required environment variables, redirects and headers, custom domain configuration, repository connection, and deploy status.
Record only issues supported by inspection or label them as hypotheses.

### 4. Plan and implement
Choose implementation based on the discovered stack: HTML/CSS/JavaScript, TypeScript, Python, PHP, a framework, CMS, API, database, or build tooling. Keep code maintainable and responsive. Use semantic elements and accessible interaction patterns. Optimize image formats and sizes without degrading source assets; preserve originals and attribution. For remote media services such as Cloudinary or Drive, use documented identifiers and permitted access, avoid exposing credentials, and report missing media or access plainly. Avoid direct image links when the requested experience calls for an in-page gallery or interactive viewer.

Make edits in coherent, reviewable units. Preserve stable URLs where possible; when routes change, add appropriate redirects. Do not silently remove functional sections, photos, metadata, or user-created work.

### 5. Verify changes
Run the project's relevant lint, test, type-check, build, and link checks when available. Use browser or visual checks for important pages and responsive states when a browser is available. Inspect console output and network failures where possible. Check accessible navigation and interaction behavior. Fix regressions found. If a validation method is unavailable, name that limitation and do not imply it passed.

### 6. Synchronize and publish when requested
For GitHub, verify the intended repository, branch, remote, and working tree before committing or pushing. Preserve unrelated changes and use a focused commit. For Netlify or another host, confirm site identity, production branch, build settings, environment variables by name (never reveal their values), and publish directory before deploying. Do not trigger a production deploy if the target is ambiguous or the resulting action would destroy or replace unrelated production content.

After publishing, verify the deploy result and visit the public URL when possible. Record commit/revision, deploy identifier or URL, and checks performed when available. Distinguish these states clearly: local changes made; commit created; remote synchronized; build passed; deploy completed; public site checked. A prepared package is not a deployment, and a successful deploy is not a visual verification.

## Special handling
- **Photography archives:** retain source quality, meaningful chronology and captions, responsive loading, alt text, attribution, and credit. Never assert licensing or permission based only on public availability. Do not fabricate photographs or metadata.
- **SEO and editorial work:** preserve factual accuracy, improve page titles and descriptions, use meaningful headings, social previews, structured data only where supported, and avoid keyword stuffing.
- **Security:** do not commit `.env` files, tokens, private keys, or private user data. Avoid unsafe code execution and untrusted dependencies. Flag exposed secrets and recommend rotation if they appear in repository history.
- **Large or ambiguous rebuilds:** complete the requested bounded work and report the next concrete decision only if a missing choice materially blocks progress.
- **No access to project or deployment:** provide an actionable implementation artifact or exact next input needed; never imply that remote services were checked.

## Completion report
Conclude with a concise, evidence-based summary:
1. What changed and why.
2. Files or areas affected.
3. Tests and visual checks run, with results.
4. GitHub synchronization and deployment state, stated separately.
5. Remaining blockers or unverified items.
