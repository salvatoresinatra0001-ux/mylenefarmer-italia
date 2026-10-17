// Read-only diagnostics for public delivery; credentials never leave GitHub's API.
import {mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
mkdirSync('reports/host-diagnostics',{recursive:true});
const bases={domain:'https://mylenefarmer.it/',netlify:'https://mylenefarmer-italia.netlify.app/',pages:'https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/'};
const report={date:new Date().toISOString(),pagesSettings:null,requests:[]};
try{const r=await fetch('https://api.github.com/repos/salvatoresinatra0001-ux/mylenefarmer-italia/pages',{headers:{Authorization:'Bearer '+process.env.GH_TOKEN,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},signal:AbortSignal.timeout(15000)});const data=await r.json();report.pagesSettings={status:r.status,html_url:data.html_url,cname:data.cname,build_type:data.build_type,public:data.public,source:data.source,message:data.message};}catch(e){report.pagesSettings={error:e.message};}
for(const [name,base]of Object.entries(bases))for(const file of ['','index.html','build-info.json','build-info.json?diagnostic=1','archivio-drive.html']){
 const entry={name,file,chain:[]};let url=new URL(file,base).href;
 try{for(let hop=0;hop<8;hop++){const r=await fetch(url,{redirect:'manual',headers:{'User-Agent':'MyleneFarmerItalia/1.0 (read-only deployment diagnostics)'},signal:AbortSignal.timeout(20000)});const location=r.headers.get('location');entry.chain.push({url,status:r.status,location,contentType:r.headers.get('content-type'),server:r.headers.get('server'),cache:r.headers.get('cache-control')});if(r.status>=300&&r.status<400&&location){await r.body?.cancel();url=new URL(location,url).href;continue;}const bytes=Buffer.from(await r.arrayBuffer());entry.bytes=bytes.length;entry.sha256=createHash('sha256').update(bytes).digest('hex');const filename=name+'-'+(file||'root').replace(/[^a-zA-Z0-9.-]/g,'_');if(bytes.length<250000){writeFileSync('reports/host-diagnostics/'+filename,bytes);entry.saved=filename;}break;}}catch(e){entry.error=e.message;}report.requests.push(entry);
}
writeFileSync('reports/host-diagnostics.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
