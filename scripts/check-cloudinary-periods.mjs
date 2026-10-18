#!/usr/bin/env node
// Read-only production diagnostic: verify Cloudinary folder taxonomy via Netlify.
import {mkdirSync,writeFileSync} from 'node:fs';
const endpoint='https://mylenefarmer.it/.netlify/functions/cloudinary-periods';
const expected=process.env.GITHUB_SHA||process.env.EXPECTED_COMMIT||'';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let report={endpoint,expectedCommit:expected,ok:false,folders:[],error:null};
for(let attempt=0;attempt<14;attempt++){
  try{
    if(expected){
      const build=await fetch('https://mylenefarmer.it/build-info.json?probe='+encodeURIComponent(expected)+'-'+attempt,{signal:AbortSignal.timeout(10000)});
      const data=build.ok?await build.json():null;
      if(data?.commit!==expected){await sleep(6000);continue;}
    }
    const r=await fetch(endpoint+'?probe='+attempt,{signal:AbortSignal.timeout(25000),headers:{Accept:'application/json'}});
    const j=await r.json();
    if(!r.ok)throw Error('HTTP '+r.status+' '+String(j.error||''));
    if(!Array.isArray(j.folders))throw Error('Folder list missing');
    report={...report,ok:true,folders:j.folders,partial:!!j.partial,scannedFolders:j.scannedFolders||0,sourceMode:j.sourceMode||null,assetsScanned:j.assetsScanned||0,error:null};
    break;
  }catch(e){report.error=String(e.message);if(attempt<13)await sleep(4000)}
}
mkdirSync('reports',{recursive:true});
writeFileSync('reports/cloudinary-periods.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({ok:report.ok,folderCount:report.folders.length,sourceMode:report.sourceMode||null,assetsScanned:report.assetsScanned||0,partial:report.partial||false,examples:report.folders.slice(0,20),error:report.error},null,2));
if(!report.ok)process.exitCode=1;
