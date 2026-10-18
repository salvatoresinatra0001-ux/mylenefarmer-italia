// Read-only Cloudinary folder taxonomy. Returns folder labels only, never asset IDs or credentials.
// Public taxonomy is deliberately restricted to the MYLENE_FARMER/ archive.
let memo=null, expires=0;
const MAX_FOLDERS=180, MAX_DEPTH=4;
const response=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':status===200?'public, max-age=300, s-maxage=1800':'no-store',
  'Access-Control-Allow-Origin':'*',
  'X-Content-Type-Options':'nosniff'
}});
const sanitize=(value)=>String(value||'').normalize('NFC').replace(/[\u0000-\u001f\u007f<>]/g,'').trim().slice(0,110);
const detectYear=(value)=>{
  const s=String(value||'');
  const match=s.match(/(?:^|[^0-9])((?:19|20)\d{2})(?![0-9])/);
  return match?match[1]:'';
};
const detectPeriod=(path,year)=>{
  const names=path.split('/').filter(Boolean).slice(1);
  const range=names.find(s=>/(?:19|20)\d{2}\s*[-–_]\s*(?:19|20)\d{2}/.test(s));
  if(range)return sanitize(range.replace(/_/g,'–'));
  const decade=names.find(s=>/(?:19|20)\d0(?:s|ies)?\b/i.test(s));
  if(decade)return sanitize(decade);
  return year?String(Math.floor(Number(year)/10)*10)+'–'+String(Math.floor(Number(year)/10)*10+9):'Periodo non datato';
};
export default async function handler(request){
  if(request.method!=='GET')return response({error:'Method not allowed'},405);
  const cloud=process.env.CLOUDINARY_CLOUD_NAME;
  const key=process.env.CLOUDINARY_API_KEY;
  const secret=process.env.CLOUDINARY_API_SECRET;
  if(!cloud||!key||!secret)return response({error:'Catalogo periodi non configurato'},503);
  if(memo&&Date.now()<expires)return response(memo);
  const auth='Basic '+Buffer.from(key+':'+secret).toString('base64');
  const folders=[];
  const seen=new Set();
  const queue=[{path:'MYLENE_FARMER',depth:0}];
  let partial=false;
  try{
    while(queue.length&&folders.length<MAX_FOLDERS){
      const node=queue.shift();
      if(seen.has(node.path)||node.depth>MAX_DEPTH)continue;
      seen.add(node.path);
      let cursor;
      do{
        const url=new URL('https://api.cloudinary.com/v1_1/'+encodeURIComponent(cloud)+'/folders/'+node.path.split('/').map(encodeURIComponent).join('/'));
        url.searchParams.set('max_results','100');
        if(cursor)url.searchParams.set('next_cursor',cursor);
        const res=await fetch(url,{headers:{Authorization:auth,Accept:'application/json'},signal:AbortSignal.timeout(10000)});
        if(!res.ok){if(node.depth===0)return response({error:'Archivio Cloudinary non disponibile',status:res.status},502);partial=true;break;}
        const payload=await res.json();
        for(const folder of payload.folders||[]){
          if(folders.length>=MAX_FOLDERS){partial=true;break;}
          const raw=String(folder.path||'');
          if(!raw.startsWith('MYLENE_FARMER/'))continue;
          const components=raw.split('/');
          if(components.length>MAX_DEPTH+2)continue;
          const label=sanitize(folder.name||components.at(-1));
          const year=detectYear(raw);
          folders.push({label,year,period:detectPeriod(raw,year),depth:node.depth+1});
          if(node.depth+1<MAX_DEPTH)queue.push({path:raw,depth:node.depth+1});
        }
        cursor=payload.next_cursor;
      }while(cursor&&folders.length<MAX_FOLDERS);
    }
    if(queue.length)partial=true;
    const unique=[...new Map(folders.map(x=>[x.label+'|'+x.year+'|'+x.period,x])).values()];
    let sourceMode='folder-tree', assetsScanned=0, inferredFromFilenames=false;
    // Some Cloudinary accounts use dynamic folders or a flat MYLENE_FARMER folder.
    // When there are no subfolders, derive a chronology from verified asset metadata only;
    // never expose private IDs, file names, CDN URLs, tags or raw context values.
    if(!unique.length){
      sourceMode='resource-metadata';
      const periods=new Map();
      let cursor,rounds=0;
      do{
        const url=new URL('https://api.cloudinary.com/v1_1/'+encodeURIComponent(cloud)+'/resources/image/upload');
        url.searchParams.set('prefix','MYLENE_FARMER/');
        url.searchParams.set('max_results','500');
        if(cursor)url.searchParams.set('next_cursor',cursor);
        const res=await fetch(url,{headers:{Authorization:auth,Accept:'application/json'},signal:AbortSignal.timeout(15000)});
        if(!res.ok){partial=true;break;}
        const payload=await res.json();
        for(const asset of payload.resources||[]){
          assetsScanned++;
          const id=String(asset.public_id||'');
          const folder=String(asset.asset_folder||id.split('/').slice(0,-1).join('/'));
          const folderYear=detectYear(folder);
          const contextYear=detectYear(asset.context?.custom?.year);
          // Numeric fragments in uploaded filenames are NOT reliable historical dates.
          const year=contextYear||folderYear;
          const period=detectPeriod(folder,year);
          const label=year||'Non datato';
          const k=label+'|'+period;
          if(!periods.has(k))periods.set(k,{label,year,period,depth:1,source:folderYear?'folder':contextYear?'context':'undated'});
        }
        cursor=payload.next_cursor;
        rounds++;
      }while(cursor&&rounds<12&&assetsScanned<6000);
      if(cursor)partial=true;
      unique.push(...periods.values());
    }
    const data={schema:2,source:'Cloudinary MYLENE_FARMER/',sourceMode,folders:unique,partial,scannedFolders:seen.size,assetsScanned,inferredFromFilenames};
    memo=data;expires=Date.now()+15*60*1000;
    return response(data);
  }catch{
    return response({error:'Inventario dei periodi temporaneamente non disponibile'},502);
  }
}
