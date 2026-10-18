#!/usr/bin/env node
// Diagnostic only: determine why CDN-served HTML differs from the deterministic build.
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const local=readFileSync('dist/index.html');
const expectedCommit=process.env.GITHUB_SHA||process.env.COMMIT_REF||'';
const hosts=[
  ['netlify-domain','https://mylenefarmer.it/index.html'],
  ['netlify-app','https://mylenefarmer-italia.netlify.app/index.html'],
  ['github-pages','https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/index.html']
];
const hash=b=>createHash('sha256').update(b).digest('hex');
const excerpt=(b,pos)=>b.subarray(Math.max(0,pos-140),Math.min(b.length,pos+280)).toString('utf8').replace(/[\r\n\t]+/g,' ').slice(0,450);
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const results=[];
for(const [name,url] of hosts){
  let output={name,url,expectedCommit,error:null};
  for(let attempt=0;attempt<12;attempt++){
    try{
      const response=await fetch(url+(url.includes('?')?'&':'?')+'diagnose='+encodeURIComponent(expectedCommit)+'-'+attempt,{redirect:'follow',headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});
      if(!response.ok){output.error='HTTP '+response.status;break;}
      const actual=Buffer.from(await response.arrayBuffer());
      const html=actual.toString('utf8');
      const remoteCommit=html.match(/<meta\s+name=["']mf-build-commit["']\s+content=["']([^"']+)/i)?.[1]||'not-found';
      if(expectedCommit && remoteCommit!==expectedCommit && attempt<11){await sleep(6000);continue;}
      const min=Math.min(local.length,actual.length);
      let diff=0;while(diff<min&&local[diff]===actual[diff])diff++;
      const equal=diff===min&&local.length===actual.length;
      output={name,url,httpStatus:response.status,remoteCommit,equal,expectedBytes:local.length,actualBytes:actual.length,expectedSha256:hash(local),actualSha256:hash(actual),firstDifferentByte:equal?null:diff,expectedExcerpt:equal?'':excerpt(local,diff),actualExcerpt:equal?'':excerpt(actual,diff)};
      break;
    }catch(e){output.error=String(e.message);if(attempt===11)break;await sleep(3000);}
  }
  results.push(output);
  console.log(JSON.stringify(output));
}
mkdirSync('reports',{recursive:true});
writeFileSync('reports/html-diff.json',JSON.stringify({expectedCommit,results},null,2)+'\n');
// This is intentionally diagnostic; preserve the existing strict audit as the release gate.
