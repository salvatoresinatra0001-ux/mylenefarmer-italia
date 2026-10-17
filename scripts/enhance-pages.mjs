import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function enhancePages(out,photos){
 const home=path.join(out,'index.html');let html=readFileSync(home,'utf8');
 html=html.replaceAll('>Archivio Drive</a>','>Fotografie</a>');
 if(!html.includes('assets/css/gallery.css'))html=html.replace('</head>','<link rel="stylesheet" href="./assets/css/gallery.css">\n</head>');
 if(!html.includes('class="mf-home-strip"')){
  const chosen=['MF-2026-001','MF-2026-012','MF-2026-009'].map(id=>photos.find(p=>p.id===id)).filter(Boolean);
  const strip='<section><div class="wrap"><p class="kicker">Fotografie / Archivio visivo</p><h2>Le immagini, dentro il sito.</h2><div class="mf-home-strip">'+chosen.map(p=>`<figure><a href="./archivio-drive.html#${esc(p.id)}"><img src="${esc(p.src)}" loading="lazy" decoding="async" alt="${esc(p.alt)}" draggable="false"></a><figcaption>${esc(p.author)} &middot; ${esc(p.license)} &middot; Crediti completi nella scheda.</figcaption></figure>`).join('')+'</div><p><a class="btn" href="./archivio-drive.html">Tutte le fotografie documentate</a></p></div></section>';
  html=html.replace('</main>',strip+'</main>');
 }
 writeFileSync(home,html);
 const archive=path.join(out,'archivio-fotografico.html');html=readFileSync(archive,'utf8');
 for(const p of photos.filter(p=>p.source==='Wikimedia Commons')){
  const key=p.id+' \u00b7';const index=html.indexOf(key);if(index<0)continue;
  const start=html.lastIndexOf('<article ',index),end=html.indexOf('</article>',index)+10;
  if(start<0||end<10)continue;
  let card=html.slice(start,end);
  card=card.replace(/<a\s[^>]*class="photo-image"[^>]*>/,'<a class="photo-image" href="./archivio-drive.html#'+esc(p.id)+'">');
  card=card.replace(/(<img[^>]*\bsrc=")[^"]+/,'$1'+esc(p.src));
  card=card.replace('Apri originale su Wikimedia Commons \u2197','Visualizza nel sito');
  html=html.slice(0,start)+card+html.slice(end);
 }
 writeFileSync(archive,html);
 // Replace contradictory legacy notices, retaining the established header/footer.
 const credits=path.join(out,'crediti-foto.html');html=readFileSync(credits,'utf8');
 const body=`<main id="main"><section><div class="wrap"><p class="kicker">Crediti e metodo</p><h1>Fotografie<br>e diritti.</h1><p class="sec-intro">Un archivio indipendente, con provenienza e stato editoriale dichiarati.</p><h2>La selezione fotografica pubblicata</h2><p>La <a href="./archivio-drive.html">galleria integrata</a> riunisce ${photos.length} schede fotografiche. Per le immagini di Wikimedia Commons sono indicati autore, licenza, dimensioni e scheda della fonte. I file sono distribuiti dalla sorgente esterna; la loro disponibilit\u00e0 viene controllata separatamente dalla pubblicazione del sito.</p><h2>Gli originali su Google Drive</h2><p>L\u2019archivio privato non \u00e8 automaticamente pubblico. Prima dell\u2019inserimento servono una base di utilizzo documentata, un\u2019attribuzione appropriata e un canale tecnico di distribuzione autorizzato. Nomi di cartelle, possesso di un file e disponibilit\u00e0 online non dimostrano da soli il diritto di pubblicazione.</p><h2>Licenze e attribuzioni</h2><p>I crediti individuali e i riferimenti alle licenze sono conservati nelle schede. Le fotografie sono mostrate senza modificare i file, adattandone soltanto la dimensione di visualizzazione. Le condizioni della licenza di ogni opera restano applicabili; il sito non attribuisce a Salvatore Sinatra diritti sulle opere altrui.</p><h2>Copertine e altre risorse</h2><p>Le gallerie di copertine e i materiali editoriali preesistenti sono distinti dal catalogo fotografico. I relativi diritti restano ai rispettivi titolari. L\u2019assenza di un pulsante di download non costituisce autorizzazione di utilizzo, n\u00e9 impedisce tecnicamente la copia.</p><h2>Segnalazioni</h2><p>Per attribuzioni, rettifiche o richieste documentate di rimozione, utilizzare i recapiti disponibili sul <a href="https://www.salvatoresinatraphotography.it" rel="noopener noreferrer">sito professionale di Salvatore Sinatra</a>. Specificare pagina, opera e motivo della richiesta.</p><p><a href="./note-legali.html">Note legali complete</a> &middot; <a href="./archivio-fotografico.html">Registro delle fonti</a></p></div></section></main>`;
 html=html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/,body);
 writeFileSync(credits,html);
 // Site-wide legal navigation, with paths correct also under the GitHub Pages base.
 function walk(dir){for(const ent of readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,ent.name);if(ent.isDirectory()){walk(file);continue;}if(!ent.name.endsWith('.html'))continue;let s=readFileSync(file,'utf8');if(!s.includes('<footer')||s.includes('class="mf-legal-links"'))continue;const base=path.relative(path.dirname(file),out).split(path.sep).join('/')||'.';const note=`<p class="mf-legal-links" style="font-size:12px;line-height:1.8;padding:12px 18px">Myl\u00e8ne Farmer Italia &middot; Progetto indipendente a cura di Salvatore Sinatra &middot; <a href="${base}/archivio-drive.html">Fotografie</a> &middot; <a href="${base}/note-legali.html">Note legali</a> &middot; <a href="${base}/crediti-foto.html">Crediti fotografici</a></p>`;s=s.replace('</footer>',note+'</footer>');writeFileSync(file,s);}}
 walk(out);
}
