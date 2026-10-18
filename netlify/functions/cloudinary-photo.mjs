import crypto from 'node:crypto';

const jsonError=(status,msg)=>({statusCode:status,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow'},body:msg});
const decryptId=(token,cloud,secret)=>{
  if(!/^[A-Za-z0-9_-]{32,512}$/.test(token))return null;
  let data;try{data=Buffer.from(token,'base64url')}catch{return null}
  if(data.length<29)return null;
  try{
    const key=crypto.createHash('sha256').update('mf-cloudinary-proxy-v1:'+cloud+':'+secret).digest();
    const iv=data.subarray(0,12),tag=data.subarray(12,28),cipher=data.subarray(28);
    const decipher=crypto.createDecipheriv('aes-256-gcm',key,iv);decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(cipher),decipher.final()]).toString('utf8');
  }catch{return null}
};
export const handler=async(event)=>{
  if(event.httpMethod!=='GET'&&event.httpMethod!=='HEAD')return jsonError(405,'Method not allowed');
  const cloud=String(process.env.CLOUDINARY_CLOUD_NAME||''),key=String(process.env.CLOUDINARY_API_KEY||''),secret=String(process.env.CLOUDINARY_API_SECRET||'');
  if(!/^[a-z0-9-]{2,80}$/i.test(cloud)||!key||!secret)return jsonError(503,'Image service unavailable');
  const publicId=decryptId(String(event.queryStringParameters?.id||''),cloud,secret);
  if(!publicId||!publicId.startsWith('MYLENE_FARMER/')||publicId.includes('..')||publicId.includes('\\'))return jsonError(404,'Not found');
  const mode=event.queryStringParameters?.size==='large'?'large':'thumb';
  try{
    const encoded=publicId.split('/').map(encodeURIComponent).join('/');
    const api='https://api.cloudinary.com/v1_1/'+encodeURIComponent(cloud)+'/resources/image/upload/'+encoded;
    const auth=Buffer.from(key+':'+secret).toString('base64');
    const metaResp=await fetch(api,{headers:{Authorization:'Basic '+auth,Accept:'application/json'},signal:AbortSignal.timeout(10000)});
    if(!metaResp.ok)return jsonError(404,'Not found');
    const meta=await metaResp.json();
    if(meta.resource_type!=='image'||meta.type!=='upload'||!Array.isArray(meta.tags)||!meta.tags.includes('MYLENE_FARMER')||!/^https:\/\/res\.cloudinary\.com\//.test(meta.secure_url||''))return jsonError(404,'Not found');
    const original=new URL(meta.secure_url);
    const transformations=mode==='large'?'c_limit,w_1800,h_1800,q_auto,f_auto':'c_limit,w_720,h_900,q_auto,f_auto';
    original.pathname=original.pathname.replace('/image/upload/','/image/upload/'+transformations+'/');
    const imgResp=await fetch(original,{signal:AbortSignal.timeout(20000)});
    if(!imgResp.ok)return jsonError(502,'Image unavailable');
    const mime=imgResp.headers.get('content-type')||'';
    if(!/^image\/(jpeg|png|webp|avif|gif)$/i.test(mime))return jsonError(502,'Invalid image type');
    const content=Buffer.from(await imgResp.arrayBuffer());
    if(content.length>5*1024*1024)return jsonError(413,'Image too large');
    return {statusCode:200,isBase64Encoded:true,body:event.httpMethod==='HEAD'?'':content.toString('base64'),headers:{'Content-Type':mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':'inline','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow','Cross-Origin-Resource-Policy':'same-site'}};
  }catch{return jsonError(502,'Image temporarily unavailable')}
};
