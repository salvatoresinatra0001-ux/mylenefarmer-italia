#!/usr/bin/env node
// Read-only verification of the published artifact on all four public hosts.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const expected=process.env.EXPECTED_COMMIT||process.env.GITHUB_SHA||process.env.COMMIT_REF;
const manifest=JSON.parse(readFileSync('dist/site-manifest.json','utf8'));
const gallery=JSON.parse(readFileSync('dist/data/gallery-public.json','utf8'));
const report={expectedCommit:expected,startedAt:new Date().toISOString(),hosts:[],photos:[],commonsMetadata:null,limitations:['Private Google Drive originals are not publicly delivered.','Third-party embedded video and audio playback is not covered by this audit.','Netlify may append its HUD script to HTML; only this exact verified suffix is normalized, while raw hashes remain recorded.']};
const targets=[['Domain','https://mylenefarmer.it/'],['WWW','https://www.mylenefarmer.it/'],['Netlify','https://mylenefarmer-italia.netlify.app/'],['GitHub Pages','https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/']];
mkdirSync('reports',{recursive:true});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
// Netlify HUD is injected after the uploaded HTML by the hosting platform.
// Compare normalized content only when the exact known HUD suffix is present.
// Preserve raw SHA-256 in the report; never classify unrelated modifications as equal.
const normalizeNetlifyHud=bytes=>{
 const html=bytes.toString('utf8');
 const suffix=/<script\s+async\s+src="\/\.netlify\/scripts\/hud\?variant=public"\s+data-nf-variant="public"\s+data-netlify-site-id="[0-9a-f-]+"\s+data-app-host="app\.netlify\.com"\s+data-account-tier="[^"]+"\s*><\/script>\s*$/;
 if(!suffix.test(html))return null;
 return Buffer.from(html.replace(suffix,''));
};
async function request(url){let error;for(let n=0;n<2;n++){try{const r=await fetch(url,{redirect:'follow',headers:{'User-Agent':'MyleneFarmerItalia/1.0 (public website integrity audit)','Cache-Control':'no-cache'},signal:AbortSignal.timeout(25000)});if((r.status===429||r.status>=500)&&n===0){await pause(2500);continue;}return r;}catch(e){error=e;if(n===0)await pause(1200);}}throw error;}
async function pool(values,fn,concurrency=4){let index=0;const result=new Array(values.length);await Promise.all(Array.from({length:Math.min(concurrency,values.length)},async()=>{while(index<values.length){const i=index++;result[i]=await fn(values[i],i);}}));return result;}
async function auditHost([name,base]){const h={name,base,commit:null,files:[],error:null};let ready=false;const deadline=Date.now()+120000;while(Date.now()<deadline){try{const r=await request(new URL('build-info.json?audit='+expected,base));if(r.ok){h.commit=(await r.json()).commit;if(h.commit===expected){ready=true;break;}}}catch(e){h.error=String(e.message);}await pause(5000);}if(!ready){h.error='Expected commit not available; observed '+h.commit;return h;}h.error=null;h.files=await pool(manifest.files,async f=>{const result={path:f.path,ok:false};try{const r=await request(new URL(f.path+'?audit='+expected,base));result.status=r.status;result.finalUrl=r.url;if(!r.ok)throw Error('HTTP '+r.status);const bytes=Buffer.from(await r.arrayBuffer());result.sha256=createHash('sha256').update(bytes).digest('hex');result.bytes=bytes.length;result.ok=result.sha256===f.sha256;
 if(!result.ok&&f.path.endsWith('.html')&&name!=='GitHub Pages'){
  const normalized=normalizeNetlifyHud(bytes);
  if(normalized&&createHash('sha256').update(normalized).digest('hex')===f.sha256){
   result.ok=true;result.normalizedMatch=true;result.deliveryTransform='Netlify HUD injected after HTML';
  }
 }
 if(!result.ok)result.error='Content SHA-256 differs from build artifact';}catch(e){result.error=String(e.message);}return result;});h.ok=h.files.every(f=>f.ok);return h;}
report.hosts=await pool(targets,auditHost,2);
report.photos=await pool(gallery.items,async p=>{const result={id:p.id,source:p.source,url:p.src,ok:false};try{const r=await request(p.src);result.status=r.status;result.contentType=r.headers.get('content-type');if(!r.ok)throw Error('HTTP '+r.status);if(!result.contentType?.startsWith('image/'))throw Error('Response is not an image');const bytes=Buffer.from(await r.arrayBuffer());result.bytes=bytes.length;result.sha256=createHash('sha256').update(bytes).digest('hex');result.ok=bytes.length>100;}catch(e){result.error=String(e.message);}return result;},3);
// Independently re-read the Commons source metadata; this is not a licence grant.
try{const titles=gallery.items.filter(p=>p.source==='Wikimedia Commons').map(p=>'File:'+decodeURIComponent(new URL(p.sourceUrl).pathname.split('File:')[1]).replace(/_/g,' '));const url=new URL('https://commons.wikimedia.org/w/api.php');url.search=new URLSearchParams({action:'query',format:'json',formatversion:'2',prop:'imageinfo',iiprop:'url|size|extmetadata',titles:titles.join('|')});const r=await request(url);if(!r.ok)throw Error('HTTP '+r.status);report.commonsMetadata=await r.json();}catch(e){report.commonsMetadata={error:String(e.message)};}
report.finishedAt=new Date().toISOString();report.ok=report.hosts.every(h=>h.ok)&&report.photos.every(p=>p.ok);
writeFileSync('reports/live-audit.json',JSON.stringify(report,null,2)+'\n');
const text=['# Public deployment audit','',`Expected commit: ${expected}`,'',...report.hosts.map(h=>`- ${h.name}: ${h.ok?'PASS':'FAIL'}; commit ${h.commit}; ${h.files.filter(f=>f.ok).length}/${h.files.length} matching content files; ${h.files.filter(f=>f.normalizedMatch).length} HTML files match after stripping the verified Netlify HUD suffix${h.error?'; '+h.error:''}`),`- Photographic sources: ${report.photos.filter(p=>p.ok).length}/${report.photos.length} returned images`,`- Private Drive photos publicly delivered: ${gallery.counts.drive}`,'',...report.limitations.map(s=>'- '+s)].join('\n');
writeFileSync('reports/live-audit.md',text+'\n');console.log(text);
if(!report.ok)process.exitCode=1;
