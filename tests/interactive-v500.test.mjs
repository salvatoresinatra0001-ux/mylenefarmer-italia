import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const index=JSON.parse(readFileSync('assets/data/search-index.json','utf8'));
test('V500 search data has albums, chapters and unique local destinations',()=>{
 assert.equal(index.version,'500.0');
 assert.ok(index.items.filter(x=>x.type==='Album').length>=12);
 assert.ok(index.items.filter(x=>x.type==='Capitolo').length>=30);
 const distinct=new Set(index.items.map(x=>x.title+'|'+x.url));
 assert.equal(distinct.size,index.items.length,'duplicate search results');
 for(const x of index.items){
  assert.ok(!x.url.startsWith('http')&&!x.url.includes('..'),'local routes only');
  assert.ok(x.title&&x.summary,'complete index item');
 }
});
test('Égrégore remains unverified, no fabricated streaming links',()=>{
 const eg=index.items.find(x=>x.title.includes('Égrégore'));
 assert.ok(eg&&eg.type==='Da verificare'&&eg.summary.toLowerCase().includes('conferm'));
});
test('progressive interface and no external media hosts added',()=>{
 const js=readFileSync('assets/js/interactive-v500.js','utf8');
 const css=readFileSync('assets/css/interactive-v500.css','utf8');
 assert.match(js,/aria-live/);
 assert.match(js,/prefers-reduced-motion/);
 assert.match(js,/localStorage/);
 assert.match(css,/#[0]{3}/i);
 assert.doesNotMatch(js,/(?:\.autoplay\s*=\s*true|\.play\s*\(|gtag\s*\()/i);
});