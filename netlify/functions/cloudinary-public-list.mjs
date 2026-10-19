import crypto from 'node:crypto';

const json=(statusCode,body,cache='no-store')=>({statusCode,headers:{'Access-Control-Allow-Origin':'https://salvatoresinatra0001-ux.github.io','Content-Type':'application/json; charset=utf-8','Cache-Control':cache,'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow'},body:JSON.stringify(body)});
const tokenFor=(publicId,cloud,secret)=>{
  const key=crypto.createHash('sha256').update('mf-cloudinary-proxy-v1:'+cloud+':'+secret).digest();
  const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key,iv);
  const encrypted=Buffer.concat([cipher.update(publicId,'utf8'),cipher.final()]);
  return Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString('base64url');
};
const eligible=(p)=>{
  const width=Number(p?.width)||0,height=Number(p?.height)||0,custom=p?.context?.custom||{};
  const yes=value=>String(value||'').toLowerCase()==='true';
  const httpsUrl=value=>{try{const u=new URL(String(value||''));return u.protocol==='https:'&&!u.username&&!u.password}catch{return false}};
  return p&&p.resource_type==='image'&&p.type==='upload'&&typeof p.public_id==='string'&&
    Math.min(width,height)>=800&&yes(custom.publish)&&yes(custom.rights_verified)&&yes(custom.quality_reviewed)&&
    String(custom.photographer||'').trim()&&String(custom.license||'').trim()&&String(custom.alt||'').trim()&&
    httpsUrl(custom.source_url)&&httpsUrl(custom.rights_evidence);
};
export const handler=async(event)=>{
  if(event.httpMethod!=='GET'&&event.httpMethod!=='HEAD')return {statusCode:405,headers:{Allow:'GET, HEAD','Cache-Control':'no-store'},body:''};
  const cloud=String(process.env.CLOUDINARY_CLOUD_NAME||''),key=String(process.env.CLOUDINARY_API_KEY||''),secret=String(process.env.CLOUDINARY_API_SECRET||'');
  if(!/^[a-z0-9-]{2,80}$/i.test(cloud)||!key||!secret)return json(503,{error:'Image catalog unavailable'});
  try{
    const url=new URL('https://api.cloudinary.com/v1_1/'+encodeURIComponent(cloud)+'/resources/image/tags/MYLENE_FARMER');
    url.searchParams.set('max_results','500');
    url.searchParams.set('context','true');
    url.searchParams.set('tags','true');
    const cursor=String(event.queryStringParameters?.cursor||'');
    if(cursor){if(cursor.length>300||!/^[a-zA-Z0-9_-]+$/.test(cursor))return json(400,{error:'Invalid cursor'});url.searchParams.set('next_cursor',cursor)}
    const auth=Buffer.from(key+':'+secret).toString('base64');
    const response=await fetch(url,{headers:{Authorization:'Basic '+auth,Accept:'application/json'},signal:AbortSignal.timeout(15000)});
    if(!response.ok)return json(response.status===401?503:502,{error:'Image catalog unavailable'});
    const data=await response.json();
    if(!Array.isArray(data.resources))return json(502,{error:'Invalid image catalog'});
    const resources=data.resources.filter(eligible).map(p=>{
      const custom=p.context?.custom||{},year=/^(?:19|20)\d{2}$/.test(String(custom.year||''))?String(custom.year):'';
      const safeTitle=String(custom.title||'').slice(0,120);
      const secureUrl=String(p.secure_url||'');
      let validUrl=false;try{const u=new URL(secureUrl);validUrl=u.protocol==='https:'&&u.hostname==='res.cloudinary.com'&&u.pathname.startsWith('/'+cloud+'/image/upload/')}catch{}
      if(!validUrl)return null;
      return {id:tokenFor(secureUrl,cloud,secret),title:safeTitle||'Fotografia HQ',alt:String(custom.alt).slice(0,240),year,width:Number(p.width)||0,height:Number(p.height)||0,format:String(p.format||'jpg'),photographer:String(custom.photographer).slice(0,120),license:String(custom.license).slice(0,120),source_url:String(custom.source_url),license_url:String(custom.license_url||'')};
    });
    const safeResources=resources.filter(Boolean);
    safeResources.sort((a,b)=>(b.width*b.height)-(a.width*a.height));
    const body=JSON.stringify({resources:safeResources,next_cursor:typeof data.next_cursor==='string'?data.next_cursor:null});
    if(body.length>2*1024*1024)return json(502,{error:'Image catalog page too large'});
    return {statusCode:200,headers:{'Access-Control-Allow-Origin':'https://salvatoresinatra0001-ux.github.io','Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=120, s-maxage=600','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow'},body:event.httpMethod==='HEAD'?'':body};
  }catch{return json(502,{error:'Image catalog unavailable'})}
};
