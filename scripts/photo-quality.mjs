import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import path from 'node:path';

// Editorial exclusions are scoped to these existing records, not to Commons as a source.
export const retiredPhotoIds = new Set([
  'MF-2026-001','MF-2026-003','MF-2026-004','MF-2026-005',
  'MF-2026-006','MF-2026-007','MF-2026-010','MF-2026-013',
  'MF-2026-014','MF-2026-016','MF-2026-018','MF-2026-019'
]);
const norm=s=>String(s||'').normalize('NFC').replace(/ /g,'_');
const attribute=(tag,name)=>tag.match(new RegExp('\\b'+name+'\\s*=\\s*(["\x27])([\\s\\S]*?)\\1','i'))?.[2]||'';
const cssNotice='<style>.mf-retired-visual{display:block;min-height:200px;background:linear-gradient(130deg,#170f18,#321b29);border:1px solid #49303b}.hero-photo>.mf-retired-visual{position:absolute;inset:0;min-height:100%}.mf-quality-note{font:14px/1.7 system-ui,sans-serif;padding:16px 20px;border:1px solid #624251;color:#e3d2d9;background:#21161e}</style>';

export function applyPhotoQuality(out,records){
  const names=new Set(records.filter(p=>retiredPhotoIds.has(p.id)).map(p=>norm(p.file)));
  const retiredURL=raw=>{
    try{
      const u=new URL(raw.replace(/&amp;/g,'&'));
      if(!['upload.wikimedia.org','commons.wikimedia.org'].includes(u.hostname))return false;
      const p=decodeURIComponent(u.pathname).split('/');
      return p.some(segment=>names.has(norm(segment.replace(/^File:/,''))));
    }catch{return false;}
  };
  const hasRetiredURL=s=>[...s.matchAll(/https?:\/\/[^\s"'<>`]+/g)].some(m=>retiredURL(m[0]));
  let imagesRemoved=0,backgroundsRemoved=0,legacyCardsRemoved=0,changedFiles=0;
  const notes=[];
  function visit(dir){
    for(const e of readdirSync(dir,{withFileTypes:true})){
      const f=path.join(dir,e.name);
      if(e.isDirectory()){visit(f);continue;}
      const ext=path.extname(f);
      if(!['.html','.css','.json'].includes(ext))continue;
      let s=readFileSync(f,'utf8');const original=s;
      if(ext==='.json'){
        const j=JSON.parse(s);
        if(e.name==='catalogo-fotografie-2026.json'&&Array.isArray(j.records)){
          j.records=j.records.filter(p=>!retiredPhotoIds.has(p.id));
          j.editorial_quality_note='Dodici schede escluse dalla presentazione per revisione qualitativa; fonti conservate nel repository.';
          s=JSON.stringify(j,null,2)+'\n';
        }
      }else{
        if(ext==='.html'){
          s=s.replace(/<article\b[^>]*>[\s\S]*?<\/article>/gi,article=>{
            const tag=article.slice(0,article.indexOf('>')+1);
            if(!/\b(?:photo-card|mf-card)\b/.test(attribute(tag,'class')))return article;
            if([...retiredPhotoIds].some(id=>article.includes(id))||hasRetiredURL(article)){
              legacyCardsRemoved++;return '';
            }
            return article;
          });
          s=s.replace(/<meta\b[^>]*>/gi,tag=>retiredURL(attribute(tag,'content'))?'':tag);
          s=s.replace(/<img\b[^>]*>/gi,tag=>{
            if(!retiredURL(attribute(tag,'src')))return tag;
            imagesRemoved++;return '<span class="mf-retired-visual" aria-hidden="true"></span>';
          });
          s=s.replace(/const photoRaw\s*=\s*(\[[\s\S]*?\]);/,(_,json)=>{
            const rows=JSON.parse(json).filter(p=>!retiredPhotoIds.has(p[0]));
            return 'const photoRaw='+JSON.stringify(rows)+';';
          });
          s=s.replace(/<p\b[^>]*class="vg-hero-credit"[^>]*>[\s\S]*?<\/p>/gi,p=>hasRetiredURL(p)?'':p);
          s=s.replace(/<div\b[^>]*class="photo-credit"[^>]*>[\s\S]*?<\/div>/gi,p=>hasRetiredURL(p)?'':p);
          if(e.name==='galleria-hq.html'){
            s=s.replace('heroImg.addEventListener','if(heroImg)heroImg.addEventListener');
            s=s.replace(/<div class="hero-bottom">[\s\S]*?<\/div>/,'<div class="hero-bottom"><p>Copertina fotografica ritirata per revisione qualitativa.</p></div>');
            s=s.replace(/<div class="hero-index">[\s\S]*?<\/div>/,'');
            s=s.replaceAll('Cinque fotografie','Due fotografie').replaceAll('cinque fotografie','due fotografie').replaceAll('Cinque scatti','Due scatti').replaceAll('cinque scatti','due scatti');
          }
          if(e.name==='approfondimento.html')s=s.replace('5 fotografie selezionate','Selezione fotografica aggiornata');
          if(e.name==='archivio-fotografico.html'){
            s=s.replace(/(<main\b[^>]*>)/,'$1<p class="mf-quality-note">Selezione aggiornata: le fotografie escluse per qualit\u00e0 non sono pi\u00f9 mostrate. I riferimenti storici restano nel repository.</p>');
          }
        }
        s=s.replace(/url\(\s*(["']?)([^)"']+)\1\s*\)/gi,(whole,q,url)=>{
          if(!retiredURL(url))return whole;backgroundsRemoved++;return 'none';
        });
        if(ext==='.html'&&s!==original)s=s.replace(/<\/head>/i,cssNotice+'</head>');
      }
      if(s!==original){writeFileSync(f,s);changedFiles++;notes.push(path.relative(out,f));}
    }
  }
  visit(out);
  console.log(JSON.stringify({photoQuality:{excludedRecords:retiredPhotoIds.size,imagesRemoved,backgroundsRemoved,legacyCardsRemoved,changedFiles,files:notes}}));
}
