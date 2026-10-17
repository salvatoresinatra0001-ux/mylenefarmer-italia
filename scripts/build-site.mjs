#!/usr/bin/env node
// Build static site for Netlify from the complete GitHub source tree.
// No dependencies; avoids shipping source metadata, research files or credentials.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, copyFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const excluded = new Set(['.git', '.github', '.gitignore', '.DS_Store',
  '.netlify', '.env', '.env.local', 'node_modules', 'dist', 'scripts', 'research',
  'docs', 'README.md', 'README_NETLIFY.md', 'netlify.toml', 'package-lock.json']);
if (!existsSync(path.join(root, 'index.html'))) throw new Error('index.html mancante');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
let copied = 0;
for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (excluded.has(entry.name) || entry.name.startsWith('.env') ||
      /\.(zip|gz|tar|log|sh)$/i.test(entry.name)) continue;
  if (entry.isSymbolicLink()) continue; // no symlinks into unrelated directories
  if (entry.isDirectory() && entry.name.startsWith('.')) continue;
  cpSync(path.join(root, entry.name), path.join(out, entry.name),
    { recursive: true, dereference: false, filter: (src) =>
      !/\/(?:\.git|\.github|\.netlify|node_modules|dist)(?:\/|$)/.test(src) });
  copied++;
}
// The HQ gallery links to the public photographic quality audit.
const quality = path.join(root, 'docs', 'QUALITY_AUDIT.md');
if (existsSync(quality)) {
  mkdirSync(path.join(out, 'docs'), { recursive: true });
  copyFileSync(quality, path.join(out, 'docs', 'QUALITY_AUDIT.md'));
}
for (const page of ['index.html','galleria-hq.html','archivio-fotografico.html',
                    'speciale-egregore-2026.html','404.html']) {
  if (!existsSync(path.join(out, page))) throw new Error('Pagina essenziale mancante: '+page);
}
// Basic local link verification; the report is informational for legacy pages.
let scanned = 0, issues = [];
function walk(dir) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) { walk(abs); continue; }
    if (!ent.name.toLowerCase().endsWith('.html')) continue;
    scanned++;
    const html = readFileSync(abs, 'utf8');
    const links = [...html.matchAll(/\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi)];
    for (const [, raw] of links) {
      if (!raw || raw.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(raw) ||
          raw.includes('${') || raw.includes('{{')) continue;
      let pathname;
      try { pathname = decodeURIComponent(raw.split(/[?#]/)[0]); } catch { continue; }
      if (!pathname) continue;
      const dest = pathname.startsWith('/') ? path.join(out, pathname.replace(/^\/+/, '')) :
                   path.resolve(path.dirname(abs), pathname);
      if (!dest.startsWith(out + path.sep) && dest !== out) { issues.push(ent.name+': unsafe '+raw); continue; }
      if (!existsSync(dest) && !existsSync(path.join(dest,'index.html'))) issues.push(ent.name+': '+raw);
    }
  }
}
walk(out);
console.log('Mylène Farmer Italia | build Netlify');
console.log('Elementi radice copiati: '+copied+'; pagine HTML: '+scanned+'; collegamenti da verificare: '+issues.length);
if (issues.length) console.log(issues.slice(0,30).join('\n'));
if (issues.some(s=>s.includes('unsafe '))) process.exitCode=1;
