#!/usr/bin/env node
import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
const base='dist';
const valid=new Set(['biografia','discografia','ascolta','archivio','approfondimento','news']);
const pages=[];
for(const dir of [base,path.join(base,'V500,0')]){
 for(const name of readdirSync(dir).filter(n=>n.endsWith('.html'))){
  const html=readFileSync(path.join(dir,name),'utf8');pages.push(dir+'/'+name);
  if(name==='discografia-streaming.html'){
   assert.ok(html.includes('discografia.html#copertine-originali'),'legacy discography alias target missing');
   assert.ok(html.includes('http-equiv="refresh"'),'legacy discography alias redirect missing');
   continue;
  }
  assert.ok(html.includes('editorial-unified-v501.css'),name+' stylesheet missing');
  assert.ok(html.includes('editorial-unified-v501.js'),name+' script missing');
  assert.ok(html.includes('mf-unified-nav'),name+' navigation missing');
  assert.ok(html.includes('mf-editorial-banner'),name+' photographic banner missing');
  const p=html.match(/<section class="mf-editorial-banner" data-photo="([^"]+)"/);
  assert.ok(p&&valid.has(p[1]),name+' unauthorized photo key');
  assert.match(html,/aria-label="Navigazione principale"/,name+' nav label');
if(name==='discografia.html'&&dir===base){
  const covers=[...html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/gi)].map(m=>m[1]);
  assert.equal(covers.length,18,'approved original-cover catalog must have 18 images');
  for(const src of covers)assert.match(src,/^\.\/assets\/covers-originali\/[0-9]{2}-[a-f0-9]{12}\.jpg$/);
 }else assert.ok(!/<img\b|<picture\b|og:image|twitter:image/i.test(html),'unapproved image: '+name);
 }
}
const css=readFileSync(path.join(base,'assets/css/editorial-unified-v501.css'),'utf8');
assert.match(css,/aspect-ratio:21\/7/);
const src=[...css.matchAll(/url\(["']?\.\.\/banners-photo\/([^"')]+)["']?\)/g)].map(x=>x[1]);
assert.equal(src.length,6);
for(const file of src){assert.ok(/^(?:biografia|discografia|ascolta|archivio|approfondimento|news)-8k\.webp$/.test(file));assert.ok(existsSync(path.join(base,'assets/banners-photo',file)));assert.ok(statSync(path.join(base,'assets/banners-photo',file)).size>200000)}
const main=readFileSync(path.join(base,'index.html'),'utf8');
assert.ok(main.includes('V500,0/'));
console.log(JSON.stringify({ok:true,pages:pages.length,photoBannerSources:src.length,ratio:'21:7'}));
