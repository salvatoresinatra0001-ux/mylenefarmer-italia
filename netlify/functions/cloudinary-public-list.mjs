import crypto from 'node:crypto';

const json=(statusCode,body,cache='no-store')=>({statusCode,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':cache,'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow'},body:JSON.stringify(body)});
const tokenFor=(publicId,cloud,secret)=>{
  const key=crypto.createHash('sha256').update('mf-cloudinary-proxy-v1:'+cloud+':'+secret).digest();
  const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key,iv);
  const encrypted=Buffer.concat([cipher.update(publicId,'utf8'),cipher.final()]);
  return Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString('base64url');
};
export const handler=async(event)=>{
  if(event.httpMethod!=='GET'&&event.httpMethod!=='HEAD')return {statusCode:405,headers:{Allow:'GET, HEAD','Cache-Control':'no-store'},body:''};
  const cloud=String(process.env.CLOUDINARY_CLOUD_NAME||''),key=String(process.env.CLOUDINARY_API_KEY||''),secret=String(process.env.CLOUDINARY_API_SECRET||'');
  if(!/^[a-z0-9-]{2,80}$/i.test(cloud)||!key||!secret)return json(503,{error:'Image catalog unavailable'});
  try{
    const url=new URL('https://api.cloudinary.com/v1_1/'+encodeURIComponent(cloud)+'/resources/search');
    url.searchParams.set('expression','tags=MYLENE_FARMER AND resource_type:image AND type:upload');
    url.searchParams.set('max_results','500');
    const cursor=String(event.queryStringParameters?.cursor||'');
    if(cursor){if(cursor.length>300||!/^[a-zA-Z0-9_-]+$/.test(cursor))return json(400,{error:'Invalid cursor'});url.searchParams.set('next_cursor',cursor)}
    url.searchParams.set('with_field','context');
    const auth=Buffer.from(key+':'+secret).toString('base64');
    const response=await fetch(url,{headers:{Authorization:'Basic '+auth,Accept:'application/json'},signal:AbortSignal.timeout(15000)});
    if(!response.ok)return json(response.status===401?503:502,{error:'Image catalog unavailable'});
    const data=await response.json();
    if(!Array.isArray(data.resources))return json(502,{error:'Invalid image catalog'});
    const resources=data.resources.filter(p=>p&&p.resource_type==='image'&&p.type==='upload'&&Array.isArray(p.tags)&&p.tags.includes('MYLENE_FARMER')&&typeof p.public_id==='string'&&p.public_id.startsWith('MYLENE_FARMER/')&&Math.max(Number(p.width)||0,Number(p.height)||0)>=1280&&Math.min(Number(p.width)||0,Number(p.height)||0)>=720).map((p,i)=>{
      const custom=p.context?.custom||{},year=/^(?:19|20)\d{2}$/.test(String(custom.year||''))?String(custom.year):'';
      const safeTitle=String(custom.title||'').slice(0,120);
      return {id:tokenFor(p.public_id,cloud,secret),title:safeTitle||'Fotografia HD',year,width:Number(p.width)||0,height:Number(p.height)||0,format:String(p.format||'jpg')};
    });
    const body=JSON.stringify({resources,next_cursor:typeof data.next_cursor==='string'?data.next_cursor:null});
    if(body.length>2*1024*1024)return json(502,{error:'Image catalog page too large'});
    return {statusCode:200,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=120, s-maxage=600','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow'},body:event.httpMethod==='HEAD'?'':body};
  }catch{return json(502,{error:'Image catalog unavailable'})}
};
