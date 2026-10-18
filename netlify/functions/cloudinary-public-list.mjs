const json=(statusCode,body,cache='no-store')=>({statusCode,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':cache,'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'},body:JSON.stringify(body)});
export const handler=async(event)=>{
  if(event.httpMethod!=='GET'&&event.httpMethod!=='HEAD')return {statusCode:405,headers:{Allow:'GET, HEAD','Cache-Control':'no-store'},body:''};
  const cloud=String(process.env.CLOUDINARY_CLOUD_NAME||'');
  if(!/^[a-z0-9-]{2,80}$/i.test(cloud))return json(503,{error:'Image catalog unavailable'});
  try{
    const endpoint='https://res.cloudinary.com/'+encodeURIComponent(cloud)+'/image/list/MYLENE_FARMER.json';
    const response=await fetch(endpoint,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(10000)});
    if(!response.ok)return json(502,{error:'Image catalog unavailable'});
    const data=await response.json();
    if(!Array.isArray(data.resources))return json(502,{error:'Invalid image catalog'});
    const resources=data.resources.slice(0,5000).filter(p=>p&&typeof p.public_id==='string'&&p.public_id.startsWith('MYLENE_FARMER/')&&p.type==='upload').map(p=>{
      const id=p.public_id.split('/').map(part=>encodeURIComponent(part)).join('/');
      const format=String(p.format||'jpg').replace(/[^a-z0-9]/gi,'');
      if(!format)return null;
      const base='https://res.cloudinary.com/'+encodeURIComponent(cloud)+'/image/upload/f_auto,q_auto,w_';
      return {asset_id:String(p.asset_id||''),public_id:p.public_id,type:'upload',format,width:Number(p.width)||0,height:Number(p.height)||0,year:String(p.year||''),delivery_900:base+'900/'+id+'.'+format,delivery_2200:base+'2200/'+id+'.'+format};
    }).filter(Boolean);
    const body=JSON.stringify({resources});
    if(body.length>4*1024*1024)return json(502,{error:'Image catalog too large'});
    return {statusCode:200,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=300, s-maxage=1800','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'},body:event.httpMethod==='HEAD'?'':body};
  }catch{return json(502,{error:'Image catalog unavailable'});}
};
