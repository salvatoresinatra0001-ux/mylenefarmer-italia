import {test} from 'node:test';
import assert from 'node:assert/strict';
import {handler} from '../netlify/functions/cloudinary-public-list.mjs';

const approved=(public_id,width,height,overrides={})=>({
  public_id,resource_type:'image',type:'upload',width,height,
  secure_url:`https://res.cloudinary.com/demo/image/upload/${public_id}.jpg`,
  context:{custom:{title:public_id,alt:'Documented Mylène Farmer photograph',publish:'true',rights_verified:'true',quality_reviewed:'true',photographer:'Photographer',license:'CC BY 4.0',source_url:'https://example.org/source',rights_evidence:'https://example.org/permission',...overrides}}
});

test('Cloudinary list requires 800px short edge, quality review, credits and documented publication rights',async t=>{
  const old={cloud:process.env.CLOUDINARY_CLOUD_NAME,key:process.env.CLOUDINARY_API_KEY,secret:process.env.CLOUDINARY_API_SECRET,fetch:globalThis.fetch};
  t.after(()=>{for(const [key,value] of Object.entries({CLOUDINARY_CLOUD_NAME:old.cloud,CLOUDINARY_API_KEY:old.key,CLOUDINARY_API_SECRET:old.secret})){if(value===undefined)delete process.env[key];else process.env[key]=value}globalThis.fetch=old.fetch});
  process.env.CLOUDINARY_CLOUD_NAME='demo';process.env.CLOUDINARY_API_KEY='test-key';process.env.CLOUDINARY_API_SECRET='test-secret';
  const resources=[
    approved('portrait-800',800,1300),
    approved('landscape-1200',1600,1200),
    approved('below-floor',799,1600),
    approved('unreviewed',1200,1600,{quality_reviewed:'false'}),
    approved('not-approved',1200,1600,{publish:'false'}),
    approved('missing-proof',1200,1600,{rights_evidence:'not-a-url'}),
    approved('missing-credit',1200,1600,{photographer:''})
  ];
  globalThis.fetch=async()=>new Response(JSON.stringify({resources}),{status:200,headers:{'Content-Type':'application/json'}});
  const response=await handler({httpMethod:'GET',queryStringParameters:{}});
  assert.equal(response.statusCode,200);
  assert.equal(response.headers['Access-Control-Allow-Origin'],'https://salvatoresinatra0001-ux.github.io');
  const body=JSON.parse(response.body);
  assert.deepEqual(body.resources.map(p=>p.title),['landscape-1200','portrait-800']);
  assert.ok(body.resources.every(p=>Math.min(p.width,p.height)>=800));
  assert.ok(body.resources.every(p=>p.id&&p.photographer&&p.license&&p.source_url));
  assert.equal(body.resources[0].width,1600);
  assert.equal(body.resources[1].width,800);
  assert.ok(!('rights_evidence' in body.resources[0]),'private evidence URL is not exposed publicly');
});

 test('unavailable catalog remains readable by the GitHub Pages client',async t=>{
 const saved=process.env.CLOUDINARY_CLOUD_NAME;
 t.after(()=>{if(saved===undefined)delete process.env.CLOUDINARY_CLOUD_NAME;else process.env.CLOUDINARY_CLOUD_NAME=saved});
 delete process.env.CLOUDINARY_CLOUD_NAME;
 const response=await handler({httpMethod:'GET'});
 assert.equal(response.statusCode,503);
 assert.equal(response.headers['Access-Control-Allow-Origin'],'https://salvatoresinatra0001-ux.github.io');
 assert.deepEqual(JSON.parse(response.body),{error:'Image catalog unavailable'});
});
