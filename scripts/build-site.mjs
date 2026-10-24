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
const excludedPages=new Set(['fonti.html','riferimenti.html']);
const photoPages=new Set(['galleria-hq.html','archivio-fotografico.html','archivio-drive.html','archivio-visivo.html','fotografie.html','edizione-visiva.html','galleria.html','galleria-fotografica.html','galleria-interattiva.html','galleria-2026.html','archivio-testuale.html']);
const selectedCoverFiles=new Set(["gallerie/copertine-medium/assets/covers/01-53a73cfd0319.jpg","gallerie/copertine-medium/assets/covers/02-d6ccb71a2c7c.jpg","gallerie/copertine-medium/assets/covers/03-38b4e61febdf.jpg","gallerie/copertine-medium/assets/covers/04-ead9bc8034a1.jpg","gallerie/copertine-medium/assets/covers/05-c5e031b5caa5.jpg","gallerie/copertine-medium/assets/covers/06-de9163480962.jpg","gallerie/copertine-medium/assets/covers/07-5d1741d2ec86.jpg","gallerie/copertine-medium/assets/covers/08-886e052b6499.jpg","gallerie/copertine-medium/assets/covers/09-f6f3babf79c7.jpg","gallerie/copertine-medium/assets/covers/10-814a6acf619a.jpg","gallerie/copertine-medium/assets/covers/11-690dc72c227c.jpg","gallerie/copertine-medium/assets/covers/12-d3ce7ed1b0ef.jpg","gallerie/copertine-medium/assets/covers/13-dfa20735cf0c.jpg","gallerie/copertine-medium/assets/covers/14-2b12b350539d.jpg","gallerie/copertine-medium/assets/covers/15-902862c1c1d7.jpg","gallerie/copertine-medium/assets/covers/16-5d3aafceeb5e.jpg","gallerie/copertine-medium/assets/covers/17-6fa58079d210.jpg","gallerie/copertine-medium/assets/covers/18-305fe3cf443d.jpg"]);
const selectedBannerFiles=new Set(['assets/banners-photo/biografia-8k.webp','assets/banners-photo/discografia-8k.webp','assets/banners-photo/ascolta-8k.webp','assets/banners-photo/archivio-8k.webp','assets/banners-photo/approfondimento-8k.webp','assets/banners-photo/news-8k.webp']);
const permittedAsset=p=>!privateRe.test(p)&&(selectedBannerFiles.has(p)||selectedCoverFiles.has(p)||(!photographRe.test(p)&&!(/\.svg$/i.test(p)&&!/^assets\/(?:icons|banners)\//.test(p))));
for(const entry of readdirSync(root,{withFileTypes:true})){
 if(entry.isSymbolicLink())continue;
 if(entry.isFile()&&excludedPages.has(entry.name))continue;
 if(entry.isDirectory()&&!['assets','data','V500,0'].includes(entry.name))continue;
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
const coverTarget=path.join(out,'assets/covers-originali');mkdirSync(coverTarget,{recursive:true});
for(const file of selectedCoverFiles){const src=path.join(root,file);if(!existsSync(src))throw Error('Missing discographic cover '+file);cpSync(src,path.join(coverTarget,path.basename(file)));}
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base='https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/';
const archiveContent=`<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Registro testuale — Mylène Farmer Italia</title><meta name="description" content="Registro testuale dei riferimenti storici, discografici e dei diritti delle immagini. Banner editoriali selezionati; le fotografie d'archivio sono soggette a diritti e attribuzioni."><link rel="canonical" href="${base}archivio-testuale.html"><link rel="stylesheet" href="./assets/css/style.css"><link rel="stylesheet" href="./assets/css/site-finish.css"><link rel="stylesheet" href="./assets/css/portal-v11.css"></head><body><header class="site-head"><div class="wrap head-row"><a class="brand" href="./index.html">Mylène Farmer · Italia</a><nav aria-label="Sezioni"><ul><li><a href="./index.html">Home</a></li><li><a href="./biografia.html">Biografia</a></li><li><a href="./discografia.html">Discografia</a></li><li><a href="./ascolta.html">Ascolta</a></li></ul></nav></div></header><main id="main"><section class="mf-official-section"><div class="wrap"><p class="kicker">Registro storico e documentale</p><h1>Archivio testuale</h1><p class="mf-resource-intro">La pubblicazione privilegia l'archivio editoriale e alcuni banner selezionati; non importa la raccolta fotografica integrale. Le precedenti sezioni fotografiche sono state ricondotte a un registro testuale che indica ambiti, documentazione e criteri di provenienza.</p><div class="mf-archive-text"><article><h2>01 · Cronologia</h2><p>Contesto biografico e cronologia delle pubblicazioni, dall'esordio del 1984 agli annunci più recenti. <a href="./biografia.html">Consulta la biografia.</a></p></article><article><h2>02 · Discografia</h2><p>Album, singoli, raccolte, edizioni e crediti organizzati in ordine cronologico, senza miniature. <a href="./discografia.html">Apri il catalogo.</a></p></article><article><h2>03 · Scena e linguaggio</h2><p>Concerti, produzione audiovisiva, regia e repertorio descritti attraverso schede e riferimenti. <a href="./concerti.html">Vai ai concerti.</a></p></article><article><h2>04 · Diritti e attribuzioni</h2><p>Le immagini rimangono attribuite ai rispettivi titolari; il sito utilizza soltanto banner editoriali selezionati. <a href="./crediti-foto.html">Consulta la politica editoriale.</a></p></article></div></div></section></main><footer class="site-foot"><div class="wrap"><p>Mylène Farmer Italia · Progetto culturale indipendente a cura di Salvatore Sinatra · <strong class="mf-author-signature"><em>Salvatore Sinatra</em></strong>.</p></div></footer></body></html>`;
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
 if(name.endsWith('.html')){let old=readFileSync(file,'utf8');let cleaned=name==='discografia-streaming.html'?old:sanitizeHtml(old);
  if(photoPages.has(name)&&path.dirname(file)===out)cleaned=cleaned.replace('</head>','<link rel="stylesheet" href="./assets/css/banners-v14.css">\n<link rel="stylesheet" href="./assets/css/amoled-v16.css">\n</head>').replace('</header>','</header><div class="mf-page-banner mf-page-banner--archivio" role="img" aria-label="Archivio — banner editoriale panoramico"><span class="mf-page-banner__mobile"><strong>Archivio</strong><small>Selezione fotografica e contenuti HD</small></span></div>');
  if(/<img\b|<picture\b|og:image|twitter:image/i.test(cleaned))throw Error('Unapproved photo reference remains: '+file);
  if(cleaned.includes('</head>')&&!/(?:href=["'](?:\.\/|\.\.\/)?assets\/icons\/favicon\.svg["'])/i.test(cleaned))cleaned=cleaned.replace('</head>','<link rel="icon" href="./assets/icons/favicon.svg" type="image/svg+xml">\n</head>');
  if(!cleaned.includes('portal-v11.css')&&cleaned.includes('</head>'))cleaned=cleaned.replace('</head>','<link rel="stylesheet" href="./assets/css/portal-v11.css">\n</head>');
  if(banner&&/<main\b/i.test(cleaned))cleaned=cleaned.replace(/(<main\b[^>]*>)/i,'$1'+banner);
  if(cleaned!==old)removed++;writeFileSync(file,cleaned);pageCount++;}
 if(name.endsWith('.css')){let s=readFileSync(file,'utf8');if(name==='banners-v15.css'||name==='editorial-unified-v501.css'){
   const urls=[...s.matchAll(/url\([\"']?([^\"')]+)[\"']?\)/g)].map(m=>m[1]);
   for(const u of urls)if(!/^\.\.\/banners-photo\/(?:biografia|discografia|ascolta|archivio|approfondimento|news)-8k\.webp$/.test(u))throw Error('Unapproved banner URL '+u);
  }else{s=s.replace(/url\(([\"']?)[^)]*\.(?:png|jpe?g|gif|webp|avif)(?:\?[^)]*)?\1\)/gi,'none');}writeFileSync(file,s);}
});
let commit=process.env.COMMIT_REF||process.env.GITHUB_SHA||'';
if(!commit)try{commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();}catch{commit='local-preview';}
walk(out,(file,name)=>{if(!name.endsWith('.html'))return;let s=readFileSync(file,'utf8');if(!s.includes('</head>'))throw Error('No head in '+file);
 const canonicalUrl=base+(name==='index.html'?'':name);
 s=s.replace(/<link\s+rel="canonical"\s+href="[^"]*"[^>]*>/i,'<link rel="canonical" href="'+canonicalUrl+'">');
 s=s.replace(/<meta\s+property="og:url"\s+content="[^"]*"[^>]*>/i,'<meta property="og:url" content="'+canonicalUrl+'">');
 s=s.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/gi,(_,a,b,c)=>a+b.replaceAll('https://www.mylenefarmer.it/',base).replaceAll('https://mylenefarmer.it/',base)+c);
 s=s.replace(/<iframe\b(?![^>]*\bloading\s*=)/gi,'<iframe loading="lazy"');
 if(!s.includes('interactive-v500.js'))s=s.replace('</head>','<link rel="stylesheet" href="./assets/css/interactive-v500.css">\n<script src="./assets/js/interactive-v500.js" defer></script>\n<meta name="mf-edition" content="Interactive Edition V500.0">\n</head>');

 const relative=path.relative(path.dirname(file),path.join(out,'assets')).split(path.sep).join('/');
 const prefix=(relative.startsWith('.')?relative:'./'+relative);
 const leaf=name.replace(/\.html$/i,'');
 const bannerMap={
  'index':['Mylène Farmer','L’opera, la musica, l’immaginario','biografia','Archivio italiano indipendente'],
  'biografia':['Biografia','Una voce, molte metamorfosi','biografia','Dall’esordio al linguaggio personale'],
  'discografia':['Discografia','Quarant’anni di musica e ricerca','discografia','Album, raccolte e ascolto ufficiale'],
  'ascolta':['Ascolta','La musica al centro','ascolta','Spotify, Apple Music e piattaforme'],
  'approfondimento':['Approfondimenti','La parola oltre la musica','approfondimento','Tre dossier, trenta capitoli'],
  'news':['News','Il presente dell’opera','news','Cronache e aggiornamenti editoriali'],
  'concerti':['Concerti','La scena e la memoria','archivio','Tournée, spettacoli e linguaggio dal vivo'],
  'media':['Media','Il linguaggio dell’immagine','news','Videoclip, cinema e interpretazione'],
  'cerca':['Cerca','Esplora tutto l’archivio','approfondimento','Ricerca tra album e dossier'],
  'speciale-egregore-2026':['Ultimo album','Dossier e verifiche','news','Informazioni preliminari, senza anticipazioni non verificate'],
  'dossier-storia-poetica':['Storia e poetica','La parola, l’identità, la memoria','biografia','Dieci capitoli di lettura critica'],
  'dossier-discografia':['Discografia ragionata','Produzione e trasformazioni','discografia','Dieci capitoli sul repertorio'],
  'dossier-scena':['Linguaggio scenico','La scena come opera','archivio','Dieci capitoli su concerti e audiovisivo'],
  'note-legali':['Note legali','Diritti, trasparenza e responsabilità','archivio','Progetto indipendente, non ufficiale'],
  'crediti-foto':['Crediti fotografici','Le immagini e i loro autori','biografia','Utilizzi e attribuzioni'],
  'archivio-testuale':['Archivio testuale','Memoria documentata','archivio','Cronologie e contenuti editoriali'],
  'archivio-drive':['Archivio testuale','Memoria documentata','archivio','Selezione editoriale'],
  'archivio-visivo':['Archivio testuale','Memoria documentata','archivio','Selezione editoriale'],
  'archivio-fotografico':['Archivio testuale','Memoria documentata','archivio','Selezione editoriale'],
  'galleria-hq':['Archivio testuale','Memoria documentata','archivio','Selezione editoriale'],
  'fotografie':['Archivio testuale','Memoria documentata','archivio','Selezione editoriale'],
  'edizione-visiva':['Archivio testuale','Memoria documentata','archivio','Selezione editoriale'],
  '404':['Pagina non trovata','Il percorso continua','archivio','Torna all’archivio principale']
 };
 const [title,subtitle,photo,eyebrow]=bannerMap[leaf]||['Mylène Farmer','Archivio editoriale','archivio','Edizione italiana'];
 const current='index.html';
 const navItems=[['index.html','Home'],['biografia.html','Biografia'],['discografia.html','Discografia'],['ascolta.html','Ascolta'],['approfondimento.html','Dossier'],['concerti.html','Concerti'],['media.html','Media'],['news.html','News']];
 const nav=navItems.map(([url,label])=>'<a href="./'+url+'"'+(name===url?' aria-current="page"':'')+'>'+label+'</a>').join('');
 const navHeader='<header class="mf-unified-header"><div class="mf-header-inner"><a class="mf-header-brand" href="./index.html" aria-label="Mylène Farmer Italia - homepage"><strong>Mylène Farmer</strong><small>Archivio Italia / 1984–2026</small></a><nav id="mf-unified-nav" class="mf-header-nav" aria-label="Navigazione principale">'+nav+'</nav><div class="mf-header-tools"><a href="./cerca.html" class="mf-header-search">Cerca</a><button class="mf-header-menu" type="button" aria-controls="mf-unified-nav" aria-expanded="false">Menu</button></div></div></header>';
 const bannerSection='<section class="mf-editorial-banner" data-photo="'+photo+'" aria-label="Banner panoramico fotografico Mylène Farmer, proporzione 21:7"><div class="mf-editorial-banner-copy"><p class="mf-editorial-banner-index">'+esc(eyebrow)+'</p><h2>'+esc(title)+'</h2><p class="mf-editorial-banner-sub">'+esc(subtitle)+'</p></div><span class="mf-editorial-banner-mark">MYLÈNE FARMER · ITALIA</span></section>';
 const oldHead=/<header\b[^>]*class=["'][^"']*(?:site-head|dp-top|egr-header)[^"']*["'][^>]*>[\s\S]*?<\/header>/i;
 if(oldHead.test(s))s=s.replace(oldHead,navHeader);
 else s=s.replace(/(<main\b)/i,navHeader+'$1');
 const oldBanner=/<div\s+class=["'][^"']*\bmf-page-banner\b[^"']*["'][^>]*>[\s\S]*?<\/div>/i;
 if(oldBanner.test(s))s=s.replace(oldBanner,bannerSection);
 else s=s.replace(/(<main\b)/i,bannerSection+'$1');
 const relatedLinks=navItems.filter(([url])=>url!==name).slice(Math.max(0,navItems.findIndex(([url])=>url===name)),Math.max(0,navItems.findIndex(([url])=>url===name))+3);
 if(relatedLinks.length<3)relatedLinks.push(...navItems.filter(([url])=>url!==name).slice(0,3-relatedLinks.length));
 const related='<aside class="mf-unified-related" aria-label="Continua la visita"><p class="mf-unified-kicker">Percorsi dell’archivio</p><h2>Continua a esplorare</h2><nav class="mf-unified-related-nav">'+relatedLinks.map(([url,label])=>'<a href="./'+url+'">'+label+' ↗</a>').join('')+'</nav></aside>';
 s=s.replace(/<\/main>/i,related+'</main>');
 const footer='<footer class="mf-unified-footer"><p>© 2026 · A cura di Salvatore Sinatra · Archivio culturale indipendente e non ufficiale.</p><nav aria-label="Informazioni e crediti"><a href="./note-legali.html">Note legali</a><a href="./crediti-foto.html">Crediti fotografici</a><a href="./index.html">Torna alla home</a></nav></footer>';
 if(/<footer\b[^>]*>[\s\S]*?<\/footer>/i.test(s))s=s.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/i,footer);
 else s=s.replace(/<\/body>/i,footer+'</body>');
 if(!s.includes('editorial-unified-v501.css'))s=s.replace('</head>','<link rel="stylesheet" href="'+prefix+'/css/editorial-unified-v501.css">\n<script src="'+prefix+'/js/editorial-unified-v501.js" defer></script>\n<meta name="mf-unified-edition" content="V501.0 — 21:7 original-photo layout">\n</head>');
 
s=s.replace('</head>','<meta name="mf-build-commit" content="'+esc(commit)+'">\n</head>');writeFileSync(file,s);});
writeFileSync(path.join(out,'build-info.json'),JSON.stringify({schema:2,commit,artifact:'mylene-farmer-italia-github-pages-interactive-v500',htmlPages:pageCount,imagesPublished:selectedBannerFiles.size+(featureActive?1:0),photoReferencesSanitized:removed},null,2)+'\n');
const files=[];walk(out,(file,name)=>{if(['_headers','_redirects','.nojekyll','site-manifest.json'].includes(name))return;const data=readFileSync(file);files.push({path:path.relative(out,file).split(path.sep).join('/'),bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});});
files.sort((a,b)=>a.path.localeCompare(b.path,'en'));
writeFileSync(path.join(out,'site-manifest.json'),JSON.stringify({schema:2,commit,files},null,2)+'\n');
console.log(JSON.stringify({commit,htmlPages:pageCount,publicFiles:files.length,imagesPublished:selectedBannerFiles.size+(featureActive?1:0),photoReferencesSanitized:removed},null,2));
