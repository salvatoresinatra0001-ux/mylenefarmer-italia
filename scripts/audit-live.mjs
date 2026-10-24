#!/usr/bin/env node
/* GitHub Pages-only public artifact audit. No photo-library or Netlify probes. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const expected=process.env.EXPECTED_COMMIT||process.env.GITHUB_SHA||process.env.COMMIT_REF||'';
const base='https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/';
const manifest=JSON.parse(readFileSync('dist/site-manifest.json','utf8'));
const report={host:'GitHub Pages',base,expectedCommit:expected,checkedAt:new Date().toISOString(),files:[],status:'pending'};
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function request(file){return fetch(new URL(file,base),{headers:{'Cache-Control':'no-cache','User-Agent':'Mylene-Farmer-Italia-GitHub-Audit'},redirect:'follow',signal:AbortSignal.timeout(20000)});}
let published=false;
for(let i=0;i<32;i++){
 try{const res=await request('build-info.json?audit='+encodeURIComponent(expected));
  if(res.ok){const data=await res.json();report.observedCommit=data.commit;if(data.commit===expected){published=true;break;}}
 }catch(e){report.lastError=String(e.message);}
 await delay(5000);
}
async function check(f){
 const item={path:f.path,ok:false};
 try{const res=await request(f.path+'?audit='+encodeURIComponent(expected));item.status=res.status;if(!res.ok)throw Error('HTTP '+res.status);
 const bytes=Buffer.from(await res.arrayBuffer());item.sha256=createHash('sha256').update(bytes).digest('hex');item.ok=item.sha256===f.sha256;
 if(!item.ok)item.error='SHA-256 mismatch';
 }catch(e){item.error=String(e.message)}return item;
}
if(published){let offset=0;const tasks=Array.from({length:Math.min(6,manifest.files.length)},async()=>{while(offset<manifest.files.length){const i=offset++;report.files[i]=await check(manifest.files[i]);}});await Promise.all(tasks);}
report.status=published&&report.files.length===manifest.files.length&&report.files.every(x=>x.ok)?'passed':'failed';
report.filesChecked=report.files.length;report.expectedFiles=manifest.files.length;report.failedFiles=report.files.filter(x=>!x.ok).map(x=>({path:x.path,error:x.error}));
mkdirSync('reports',{recursive:true});
writeFileSync('reports/live-audit.json',JSON.stringify(report,null,2)+'\n');
writeFileSync('reports/live-audit.md',`# GitHub Pages integrity\n\nCommit: ${expected}\nObserved: ${report.observedCommit||'none'}\nStatus: ${report.status}\nFiles: ${report.filesChecked}/${report.expectedFiles}\n`);
console.log(JSON.stringify({status:report.status,expected,observed:report.observedCommit,filesChecked:report.filesChecked,expectedFiles:report.expectedFiles,failed:report.failedFiles.slice(0,8)},null,2));
if(report.status!=='passed')process.exitCode=1;
