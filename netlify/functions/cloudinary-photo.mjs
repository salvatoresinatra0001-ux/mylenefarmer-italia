import crypto from 'node:crypto';
import approvals from '../../data/cloudinary-approved.json' with {type:'json'};
const allowed = new Map();
for (const a of approvals.approved || []) {
  if (a.public_id?.startsWith('MYLENE_FARMER/') && a.rights_evidence && a.source_url) {
    allowed.set(crypto.createHash('sha256').update(a.public_id).digest('hex').slice(0,24), a.public_id);
  }
}
const jsonError=(status,msg)=>({statusCode:status,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'},body:msg});
export const handler=async(event)=>{
  if(event.httpMethod!=='GET' && event.httpMethod!=='HEAD')return jsonError(405,'Method not allowed');
  const id=String(event.queryStringParameters?.id||'');
  const mode=event.queryStringParameters?.size==='large'?'large':'thumb';
  if(!/^[a-f0-9]{24}$/.test(id)||!allowed.has(id))return jsonError(404,'Not found');
  const cloud=process.env.CLOUDINARY_CLOUD_NAME, key=process.env.CLOUDINARY_API_KEY, secret=process.env.CLOUDINARY_API_SECRET;
  if(!cloud||!key||!secret)return jsonError(503,'Image service not configured');
  const pid=allowed.get(id);
  try{
    const api='https://api.cloudinary.com/v1_1/'+encodeURIComponent(cloud)+'/resources/image/upload/'+pid.split('/').map(encodeURIComponent).join('/');
    const basic=Buffer.from(key+':'+secret).toString('base64');
    const metaResp=await fetch(api,{headers:{Authorization:'Basic '+basic},signal:AbortSignal.timeout(10000)});
    if(!metaResp.ok)return jsonError(502,'Image unavailable');
    const meta=await metaResp.json();
    const original=new URL(meta.secure_url);
    if(original.protocol!=='https:' || original.hostname!=='res.cloudinary.com' || !original.pathname.includes('/image/upload/'))return jsonError(502,'Invalid image origin');
    const transformations=mode==='large'?'c_limit,w_1800,h_1800,q_auto':'c_limit,w_750,h_900,q_auto';
    original.pathname=original.pathname.replace('/image/upload/','/image/upload/'+transformations+'/');
    const imgResp=await fetch(original,{signal:AbortSignal.timeout(20000)});
    if(!imgResp.ok)return jsonError(502,'Image delivery failed');
    const mime=imgResp.headers.get('content-type')||'';
    if(!/^image\/(jpeg|png|webp|avif|gif)$/i.test(mime))return jsonError(502,'Invalid image type');
    const content=Buffer.from(await imgResp.arrayBuffer());
    if(content.length>6*1024*1024)return jsonError(413,'Image too large');
    return {statusCode:200,isBase64Encoded:true,body:event.httpMethod==='HEAD'?'':content.toString('base64'),headers:{'Content-Type':mime,'Cache-Control':'public, max-age=180, s-maxage=900','X-Content-Type-Options':'nosniff','Content-Disposition':'inline','Referrer-Policy':'no-referrer'}};
  }catch{return jsonError(502,'Image temporarily unavailable')}
};
