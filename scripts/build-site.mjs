#!/usr/bin/env node
// One deterministic public artifact for Netlify and GitHub Pages.
import {cpSync,existsSync,mkdirSync,readdirSync,rmSync,copyFileSync,readFileSync,writeFileSync,lstatSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {enhancePages} from './enhance-pages.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const publicDirs=new Set(['assets','data','gallerie','galleria-fotografica']);
const publicFiles=new Set(['.nojekyll','_headers','_redirects','robots.txt','sitemap.xml']);
const blocked=/(^|\/)(?:\.git|\.github|\.netlify|node_modules|dist|reports|tests|private|\.private)(\/|$)|(^|\/)\.env(?:\.|$)|\.(?:pem|key|p12|pfx|log|zip|tar|gz|sh)$/i;
const readJSON=p=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const jsonWrite=(p,v)=>{mkdirSync(path.dirname(path.join(out,p)),{recursive:true});writeFileSync(path.join(out,p),JSON.stringify(v,null,2)+'\n');};
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const https=v=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}};
if(!existsSync(path.join(root,'index.html')))throw Error('index.html mancante');
rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});
for(const ent of readdirSync(root,{withFileTypes:true})){
  if(ent.isSymbolicLink())continue;
  if(!(ent.isDirectory()?publicDirs.has(ent.name):publicFiles.has(ent.name)||/\.html$/i.test(ent.name)))continue;
  cpSync(path.join(root,ent.name),path.join(out,ent.name),{recursive:true,filter:src=>!lstatSync(src).isSymbolicLink()&&!blocked.test(path.relative(root,src).split(path.sep).join('/'))});
}
for(const name of ['QUALITY_AUDIT.md','CATALOGO_FOTOGRAFICO_2026.md']){
  const src=path.join(root,'docs',name);if(existsSync(src)){mkdirSync(path.join(out,'docs'),{recursive:true});copyFileSync(src,path.join(out,'docs',name));}
}
// Private Drive IDs, OAuth credentials and catalogue drafts never enter the public manifest.
const source=readJSON('assets/data/catalogo-fotografie-2026.json');
const drive=readJSON('data/drive-gallery.json');
const commons=(source.records||[]).filter(p=>p.status==='licenza_indicata_sulla_scheda').map(p=>{
  if(!p.author||!https(p.source_url)||!https(p.license_url)||!https(p.preview_url)||!p.width||!p.height)throw Error('Credito incompleto: '+p.id);
  const filename=p.file.normalize('NFC').replace(/ /g,'_');
  const hash=createHash('md5').update(filename).digest('hex');
  const direct='https://upload.wikimedia.org/wikipedia/commons/'+hash[0]+'/'+hash.slice(0,2)+'/'+encodeURIComponent(filename);
  const original=p.preview_url.split('?')[0];
  return {id:p.id,year:p.year,title:p.event,alt:'Myl\u00e8ne Farmer - '+p.event+'; fotografia di '+p.author,author:p.author,license:p.license,licenseUrl:p.license_url,sourceUrl:p.source_url,source:'Wikimedia Commons',width:p.width,height:p.height,src:p.preview_url,fallback:direct,original,changes:'Nessuna modifica al file; visualizzazione ridimensionata.',rightsEvidence:p.status};
});
const approved=(drive.items||[]).filter(p=>p.approved===true).map(p=>{
  if(!p.id||!p.author||!p.alt||!p.license||!p.rightsEvidence||!https(p.publicUrl)||!p.width||!p.height)throw Error('Scheda Drive approvata ma incompleta: '+(p.id||'senza ID'));
  const u=new URL(p.publicUrl);
  if(/(?:^|\.)drive\.google\.com$/.test(u.hostname)||/(?:^|\.)googleusercontent\.com$/.test(u.hostname)||/[?&](?:access_token|token|signature|sig)=/i.test(p.publicUrl))throw Error('Usare una distribuzione stabile senza credenziali: '+p.id);
  return {id:p.id,year:p.year||'',title:p.title||p.alt,alt:p.alt,author:p.author,license:p.license,licenseUrl:https(p.licenseUrl)?p.licenseUrl:null,source:'Archivio editoriale',width:p.width,height:p.height,src:p.publicUrl,original:p.publicUrl,changes:p.changes||'Nessuna modifica dichiarata.',rightsEvidence:'Autorizzazione registrata dal curatore'};
});
const items=[...commons,...approved];
const ids=new Set();for(const p of items){if(ids.has(p.id))throw Error('ID duplicato: '+p.id);ids.add(p.id);}
const gallery={version:2,counts:{published:items.length,commons:commons.length,drive:approved.length},items};
jsonWrite('data/gallery-public.json',gallery);
jsonWrite('data/drive-gallery.json',{version:2,items:approved,note:'Catalogo pubblico: solo risorse esplicitamente approvate.'});
const page=path.join(out,'archivio-drive.html');
let template=readFileSync(page,'utf8');
if(!template.includes('<!-- PHOTO_CARDS -->'))throw Error('Segnaposto della galleria mancante');
const cards=items.map(p=>`<article class="mf-card" data-photo-id="${esc(p.id)}"><button class="mf-photo" type="button" data-open-photo="${esc(p.id)}" aria-label="Ingrandisci: ${esc(p.title)}"><img src="${esc(p.src)}" alt="${esc(p.alt)}" width="${p.width}" height="${p.height}" loading="lazy" decoding="async" draggable="false"><span class="mf-open">Ingrandisci</span></button><div class="mf-caption"><p class="mf-meta">${esc(p.year)} <span>${p.width} \u00d7 ${p.height} px</span></p><h2>${esc(p.title)}</h2><p>${esc(p.author)} <span class="mf-license">${esc(p.license)}</span></p><p class="mf-photo-error" hidden>Immagine non raggiungibile. Apri il visualizzatore per riprovare.</p><details><summary>Crediti e provenienza</summary><p>${esc(p.source)} \u00b7 ${esc(p.id)}</p><p>${esc(p.changes)}</p>${p.sourceUrl?`<a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">Scheda di attribuzione</a>`:''}${p.licenseUrl?` <a href="${esc(p.licenseUrl)}" target="_blank" rel="noopener noreferrer">Condizioni della licenza</a>`:''}</details></div></article>`).join('\n');
template=template.replace('<!-- PHOTO_CARDS -->',cards).replaceAll('<!-- PHOTO_COUNT -->',String(items.length)).replaceAll('<!-- DRIVE_COUNT -->',String(approved.length));
writeFileSync(page,template);
enhancePages(out,items);
function sanitize(value){if(Array.isArray(value))return value.map(sanitize);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>!['source_local_path','local_path','access_token','refresh_token','private_key','client_secret'].includes(key)).map(([k,v])=>[k,sanitize(v)]));return value;}
let pages=0;const problems=[];const files=[];
function walk(dir){for(const ent of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))){const abs=path.join(dir,ent.name);if(ent.isDirectory()){walk(abs);continue;}files.push(path.relative(out,abs).split(path.sep).join('/'));if(ent.name.endsWith('.json'))writeFileSync(abs,JSON.stringify(sanitize(JSON.parse(readFileSync(abs,'utf8'))),null,2)+'\n');if(!ent.name.endsWith('.html'))continue;pages++;const html=readFileSync(abs,'utf8').replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi,'').replace(/<code\b[^>]*>[\s\S]*?<\/code>/gi,'');for(const[,raw]of html.matchAll(/\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi)){if(!raw||raw.startsWith('#')||/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(raw)||raw.includes('${')||raw.includes('{{'))continue;let part;try{part=decodeURIComponent(raw.split(/[?#]/)[0]);}catch{problems.push('URL non valida: '+raw);continue;}if(!part)continue;const dest=part.startsWith('/')?path.join(out,part.slice(1)):path.resolve(path.dirname(abs),part);if(dest!==out&&!dest.startsWith(out+path.sep))problems.push('Percorso esterno: '+raw);else if(!existsSync(dest)&&!existsSync(path.join(dest,'index.html')))problems.push(path.relative(out,abs)+': '+raw);}}}
walk(out);
for(const p of ['index.html','galleria-hq.html','archivio-fotografico.html','archivio-drive.html','note-legali.html','speciale-egregore-2026.html','404.html','data/gallery-public.json'])if(!existsSync(path.join(out,p)))problems.push('File essenziale mancante: '+p);
if(problems.length)throw Error(problems.join('\n'));
let commit=process.env.COMMIT_REF||process.env.GITHUB_SHA||'';
if(!commit)try{commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();}catch{commit='local-preview';}
// Every HTML response carries the same revision as the manifest. This also gives
// deployment systems new content hashes after a processing configuration change.
for(const file of files.filter(p=>p.endsWith('.html'))){
  const absolute=path.join(out,file);
  const html=readFileSync(absolute,'utf8');
  if(!/<\/head>/i.test(html))throw Error('HTML privo di head: '+file);
  const marker='<meta name="mf-build-commit" content="'+esc(commit)+'">\n';
  writeFileSync(absolute,html.replace(/<\/head>/i,marker+'</head>'));
}
jsonWrite('build-info.json',{schema:1,commit,artifact:'mylene-farmer-italia-static',htmlPages:pages,photos:gallery.counts});
files.push('build-info.json');
const infrastructure=new Set(['_headers','_redirects','.nojekyll']);
const manifest={schema:1,commit,files:files.filter(p=>!infrastructure.has(p)).sort().map(p=>{const data=readFileSync(path.join(out,p));return {path:p,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')};})};
jsonWrite('site-manifest.json',manifest);
console.log(JSON.stringify({commit,htmlPages:pages,publicFiles:manifest.files.length,photos:gallery.counts,localLinkErrors:0},null,2));
