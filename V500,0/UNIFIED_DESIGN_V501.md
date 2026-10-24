# Unified Editorial Design V501.0 — October 24, 2026

One shared design system for both the canonical GitHub Pages site and the versioned V500,0 subsite.
- Responsive black editorial masthead and coherent navigation across every built HTML page.
- 21:7 UHD panoramic banner viewport using *existing* original 7680x3291 WebP images. CSS crops visually; it never resamples, retouches, synthesizes or overwrites original photography, including the subject's face.
- Six permitted photo sources; reused in content-appropriate banner categories. All other image assets remain excluded by the conservative build.
- Cross-page readability, cards, tables, embeds, typographic hierarchy, chapter navigation, breadcrumbs / related links.
- Original Apple Music and Spotify players retained; no autoplay or direct music/media hosting.
- GitHub Pages only. Netlify excluded.

Source: assets/css/editorial-unified-v501.css + assets/js/editorial-unified-v501.js.
Build: scripts/build-site.mjs. CI: node scripts/verify-unified-v501.mjs.
Copyright/licences of photography remain with their respective owners. Independent fan website edited by Salvatore Sinatra.
