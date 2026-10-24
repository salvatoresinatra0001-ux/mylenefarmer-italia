#!/usr/bin/env node
/* Mylène Farmer Italia — deterministic static build.
   Seven explicitly selected editorial banners are allowed as WebP; all other photographic assets remain excluded.
*/
import {cpSync,existsSync,mkdirSync,readdirSync,rmSync,readFileSync,writeFileSync,lstatSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
if(!existsSync(path.join(root,'index.html')))throw Error('Missing index.html');
/* One licensed image shared across all pages, disabled until curator selects it. */
const featureConfig=path.join(root,'feature-wide.json');
const feature=existsSync(featureConfig)?JSON.parse(readFileSync(featureConfig,'utf8')):{};
const imagePath='assets/featured/hero-wide.webp';
const featureActive=feature.enabled===true&&feature.rightsConfirmed===true&&feature.asset===imagePath;
if(feature.enabled&&!featureActive)throw Error('Feature image requires explicit rights confirmation and approved asset path.');
if(featureActive&&(!existsSync(path.join(root,imagePath))||!String(feature.alt||'').trim()))throw Error('Approved panorama file or alt text missing.');

rmSync(out,{force:true,recursive:true});mkdirSync(out,{recursive:true});
const rootStatic=new Set(['.nojekyll','_headers','_redirects','robots.txt','sitemap.xml']);
const photographRe=/(?:\.(?:png|jpe?g|webp|avif|gif|bmp|tiff?|heic|ico|mp4|mov|webm)$|(?:^|\/)(?:gallerie|galleria-fotografica|covers|photos|photo|fotografie|images|img|cloudinary|gallery)(?:\/|$)|(?:photo|fotograf|galler|cloudinary|drive-gallery|gallery-public|catalogo-fotografie)\.(?:json|js)$)/i;
const privateRe=/(^|\/)(?:\.git|\.github|\.netlify|node_modules|dist|reports|tests|private|\.private)(\/|$)|(^|\/)\.env(?:\.|$)|\.(?:pem|key|p12|pfx|log|zip|tar|gz|sh)$/i;
const photoPages=new Set(['galleria-hq.html','archivio-fotografico.html','archivio-drive.html','archivio-visivo.html','fotografie.html','edizione-visiva.html','galleria.html','galleria-fotografica.html','galleria-interattiva.html','galleria-2026.html','archivio-testuale.html']);
const selectedBannerFiles=new Set(['assets/banners-photo/biografia-8k.webp','assets/banners-photo/discografia-8k.webp','assets/banners-photo/ascolta-8k.webp','assets/banners-photo/archivio-8k.webp','assets/banners-photo/fonti-8k.webp','assets/banners-photo/approfondimento-8k.webp','assets/banners-photo/news-8k.webp']);
const permittedAsset=p=>!privateRe.test(p)&&(selectedBannerFiles.has(p)||(!photographRe.test(p)&&!(/\.svg$/i.test(p)&&!/^assets\/(?:icons|banners)\//.test(p))));
for(const entry of readdirSync(root,{withFileTypes:true})){
 if(entry.isSymbolicLink())continue;
 if(entry.isDirectory()&&!['assets','data'].includes(entry.name))continue;
 if(!entry.isDirectory()&&!(/\.html$/i.test(entry.name)||rootStatic.has(entry.name)))continue;
 const source=path.join(root,entry.name),dest=path.join(out,entry.name);
 cpSync(source,dest,{recursive:true,filter:src=>{
  if(lstatSync(src).isSymbolicLink())return false;
  const p=path.relative(root,src).split(path.sep).join('/');
  if(!p)return true;
  if(src===source)return true;
  return permittedAsset(p);
 }});
}
if(featureActive){
 const dest=path.join(out,imagePath);mkdirSync(path.dirname(dest),{recursive:true});
 cpSync(path.join(root,imagePath),dest);
}
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base='https://www.mylenefarmer.it/';
const archiveContent=`<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Registro testuale — Mylène Farmer Italia</title><meta name="description" content="Registro testuale dei riferimenti storici, discografici e dei diritti delle immagini. Banner editoriali selezionati; le fotografie d'archivio sono soggette a diritti e attribuzioni."><link rel="canonical" href="${base}archivio-testuale.html"><link rel="stylesheet" href="./assets/css/style.css"><link rel="stylesheet" href="./assets/css/site-finish.css"><link rel="stylesheet" href="./assets/css/portal-v11.css"></head><body><header class="site-head"><div class="wrap head-row"><a class="brand" href="./index.html">Mylène Farmer · Italia</a><nav aria-label="Sezioni"><ul><li><a href="./index.html">Home</a></li><li><a href="./biografia.html">Biografia</a></li><li><a href="./discografia.html">Discografia</a></li><li><a href="./riferimenti.html">Riferimenti</a></li></ul></nav></div></header><main id="main"><section class="mf-official-section"><div class="wrap"><p class="kicker">Registro storico e documentale</p><h1>Archivio testuale</h1><p class="mf-resource-intro">Per scelta editoriale non sono pubblicate fotografie, gallerie, miniature o copertine. Le precedenti sezioni fotografiche sono state ricondotte a un registro testuale che indica ambiti, documentazione e criteri di provenienza.</p><div class="mf-archive-text"><article><h2>01 · Cronologia</h2><p>Contesto biografico e cronologia delle pubblicazioni, dall'esordio del 1984 agli annunci più recenti. <a href="./biografia.html">Consulta la biografia.</a></p></article><article><h2>02 · Discografia</h2><p>Album, singoli, raccolte, edizioni e crediti organizzati in ordine cronologico, senza miniature. <a href="./discografia.html">Apri il catalogo.</a></p></article><article><h2>03 · Scena e linguaggio</h2><p>Concerti, produzione audiovisiva, regia e repertorio descritti attraverso schede e riferimenti. <a href="./concerti.html">Vai ai concerti.</a></p></article><article><h2>04 · Diritti e attribuzioni</h2><p>Le fotografie di terzi restano sui siti dei rispettivi aventi diritto; non vengono ripubblicate né incorporate. <a href="./crediti-foto.html">Consulta la politica editoriale.</a></p></article></div></div></section></main><footer class="site-foot"><div class="wrap"><p>Mylène Farmer Italia · Progetto culturale indipendente a cura di Salvatore Sinatra · <strong class="mf-author-signature"><em>Salvatore Sinatra</em></strong>.</p></div></footer></body></html>`;
for(const page of photoPages){if(page==='archivio-testuale.html'||existsSync(path.join(out,page)))writeFileSync(path.join(out,page),archiveContent);}
const banner=featureActive?'<section class="mf-shared-banner" aria-label="Immagine panoramica editoriale"><div class="mf-shared-banner__inner"><img src="./'+imagePath+'" alt="'+esc(feature.alt)+'" width="2560" height="1080" loading="lazy" decoding="async"><p>Immagine selezionata · '+esc(feature.credit||'Crediti in verifica')+'</p></div></section>':'';
function sanitizeHtml(content){
 return content
  .replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi,'')
  .replace(/<img\b[^>]*>/gi,'')
  .replace(/<source\b[^>]*>/gi,'')
  .replace(/<meta\b[^>]*(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/gi,'')
  .replace(/<link\b[^>]*rel=["'](?:preload|prefetch)["'][^>]*(?:as=["']image["']|\.(?:png|jpe?g|webp))[^>]*>/gi,'')
  .replace(/\s(?:srcset|poster)=["'][^"']*["']/gi,'')
  .replace(/<figure\b[^>]*>\s*<figcaption\b[^>]*>[\s\S]*?<\/figcaption>\s*<\/figure>/gi,'')
  .replace(/(?:(?:https?:)?\/\/)[^"'\s>]+\.(?:jpg|jpeg|png|webp|avif|gif)(?:\?[^"'\s>]*)?/gi,'')
  .replace(/\b(?:background-image)\s*:\s*url\([^)]*\)\s*;?/gi,'background-image:none;');
}
function walk(dir,fn){for(const ent of readdirSync(dir,{withFileTypes:true})){const abs=path.join(dir,ent.name);if(ent.isDirectory())walk(abs,fn);else fn(abs,ent.name)}}
let pageCount=0,removed=0;
walk(out,(file,name)=>{
 if(name.endsWith('.html')){let old=readFileSync(file,'utf8');let cleaned=sanitizeHtml(old);
  if(name==='archivio-testuale.html')cleaned=cleaned.replace('</head>','<link rel="stylesheet" href="./assets/css/banners-v14.css">\n</head>').replace('</header>','</header><div class="mf-page-banner mf-page-banner--archivio" role="img" aria-label="Archivio — banner editoriale panoramico"><span class="mf-page-banner__mobile"><strong>Archivio</strong><small>Selezione fotografica e contenuti HD</small></span></div>');
  if(/<img\b|<picture\b|og:image|twitter:image/i.test(cleaned))throw Error('Unapproved photo reference remains: '+file);
  if(cleaned.includes('</head>')&&!cleaned.includes('href="./assets/icons/favicon.svg"'))cleaned=cleaned.replace('</head>','<link rel="icon" href="./assets/icons/favicon.svg" type="image/svg+xml">\n</head>');
  if(!cleaned.includes('portal-v11.css')&&cleaned.includes('</head>'))cleaned=cleaned.replace('</head>','<link rel="stylesheet" href="./assets/css/portal-v11.css">\n</head>');
  if(banner&&/<main\b/i.test(cleaned))cleaned=cleaned.replace(/(<main\b[^>]*>)/i,'$1'+banner);
  if(cleaned!==old)removed++;writeFileSync(file,cleaned);pageCount++;}
 if(name.endsWith('.css')){let s=readFileSync(file,'utf8');if(name==='banners-v15.css'){
   const urls=[...s.matchAll(/url\([\"']?([^\"')]+)[\"']?\)/g)].map(m=>m[1]);
   for(const u of urls)if(!/^\.\.\/banners-photo\/(?:biografia|discografia|ascolta|archivio|fonti|approfondimento|news)-8k\.webp$/.test(u))throw Error('Unapproved banner URL '+u);
  }else{s=s.replace(/url\(([\"']?)[^)]*\.(?:png|jpe?g|gif|webp|avif)(?:\?[^)]*)?\1\)/gi,'none');}writeFileSync(file,s);}
});
let commit=process.env.COMMIT_REF||process.env.GITHUB_SHA||'';
if(!commit)try{commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();}catch{commit='local-preview';}
walk(out,(file,name)=>{if(!name.endsWith('.html'))return;let s=readFileSync(file,'utf8');if(!s.includes('</head>'))throw Error('No head in '+file);s=s.replace('</head>','<meta name="mf-build-commit" content="'+esc(commit)+'">\n</head>');writeFileSync(file,s);});
writeFileSync(path.join(out,'build-info.json'),JSON.stringify({schema:2,commit,artifact:'mylene-farmer-italia-editorial-banners-v15',htmlPages:pageCount,imagesPublished:selectedBannerFiles.size+(featureActive?1:0),photoReferencesSanitized:removed},null,2)+'\n');
const files=[];walk(out,(file,name)=>{if(['_headers','_redirects','.nojekyll','site-manifest.json'].includes(name))return;const data=readFileSync(file);files.push({path:path.relative(out,file).split(path.sep).join('/'),bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});});
files.sort((a,b)=>a.path.localeCompare(b.path,'en'));
writeFileSync(path.join(out,'site-manifest.json'),JSON.stringify({schema:2,commit,files},null,2)+'\n');
console.log(JSON.stringify({commit,htmlPages:pageCount,publicFiles:files.length,imagesPublished:selectedBannerFiles.size+(featureActive?1:0),photoReferencesSanitized:removed},null,2));
