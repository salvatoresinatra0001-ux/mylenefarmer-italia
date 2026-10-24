#!/usr/bin/env node
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const dir='dist', base='https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/';
const html=readdirSync(dir).filter(n=>n.endsWith('.html'));
assert.ok(html.length>=12,'expected public pages');
for(const filename of html){
 const s=readFileSync(path.join(dir,filename),'utf8');
 assert.ok(s.includes('interactive-v500.css'),'V500 CSS missing: '+filename);
 assert.ok(s.includes('interactive-v500.js'),'V500 JS missing: '+filename);
 assert.ok(s.includes('mf-edition'),'V500 edition marker missing: '+filename);
if(filename==='discografia.html'){
 const covers=[...s.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/gi)].map(m=>m[1]);
 assert.equal(covers.length,18,'18 cataloged archive covers required');
 for(const src of covers){
  assert.match(src,/^\.\/assets\/covers-originali\/[0-9]{2}-[a-f0-9]{12}\.jpg$/,'unapproved music-cover path');
  assert.ok(existsSync(path.join(dir,src)),'unpublished cover: '+src);
 }
} else assert.ok(!/<img\b|<picture\b|og:image|twitter:image/i.test(s),'unapproved image: '+filename);
 const canonical=s.match(/<link rel="canonical" href="([^"]+)"/i);
 if(canonical)assert.ok(canonical[1].startsWith(base),'canonical host not GitHub Pages: '+filename);
}
const data=JSON.parse(readFileSync('dist/assets/data/search-index.json','utf8'));
assert.ok(data.items.length>=40,'search index needs pages, albums, chapters');
assert.ok(data.items.some(x=>x.type==='Capitolo'),'no indexed chapters');
assert.ok(data.items.some(x=>x.type==='Album'),'no indexed albums');
for(const item of data.items){
 assert.ok(typeof item.url==='string'&&!/^https?:\/\//.test(item.url),'unsafe or external index URL');
 const file=item.url.split('#')[0];
 assert.ok(existsSync(path.join(dir,file)),'missing indexed target: '+file);
}
const dis=readFileSync(path.join(dir,'discografia.html'),'utf8');
const ascolta=readFileSync(path.join(dir,'ascolta.html'),'utf8');
assert.ok(dis.includes('embed.music.apple.com'),'Apple Music absent');
assert.ok(ascolta.includes('open.spotify.com/embed/artist'),'Spotify absent');
const b=JSON.parse(readFileSync(path.join(dir,'build-info.json'),'utf8'));
assert.equal(b.artifact,'mylene-farmer-italia-github-pages-interactive-v500');
const folder=path.join(dir,'V500,0');
assert.ok(existsSync(path.join(folder,'index.html')),'V500.0 homepage missing in deployed site');
const editionPages=readdirSync(folder).filter(n=>n.endsWith('.html'));
assert.equal(editionPages.length,html.length,'V500.0 must mirror all public HTML entries');
for(const filename of editionPages){
 const content=readFileSync(path.join(folder,filename),'utf8');
 assert.ok(/noindex\s*,\s*follow/i.test(content),'duplicate indexing is disabled: '+filename);
 assert.ok(content.includes('interactive-v500.js'),'V500.0 JS absent: '+filename);
 assert.ok(content.includes('amoled-v16.css'),'AMOLED CSS absent: '+filename);
 assert.ok(!/(?:href|src)=["']\.\/assets\//i.test(content),'assets incorrectly relative: '+filename);
 assert.ok(!/<img\b|<picture\b|og:image|twitter:image/i.test(content),'unapproved image in '+filename);
 const resourceRefs=[...content.matchAll(/(?:href|src)=["'](\.\.\/assets\/[^"']+)["']/g)].map(m=>m[1]);
 for(const ref of resourceRefs){
  const target=path.resolve(folder,ref.split('?')[0].split('#')[0]);
  assert.ok(existsSync(target),'broken versioned asset: '+filename+' -> '+ref);
 }
}
const localIndex=path.join(folder,'assets/data/search-index.json');
assert.ok(existsSync(localIndex),'V500.0 local search catalog missing');
const editionData=JSON.parse(readFileSync(localIndex,'utf8'));
assert.equal(editionData.items.length,data.items.length,'V500.0 search catalog mismatch');
for(const item of editionData.items){
 const localFile=item.url.split('#')[0];
 assert.ok(existsSync(path.join(folder,localFile)),'broken V500.0 search result: '+localFile);
}
assert.ok(readFileSync(path.join(dir,'index.html'),'utf8').includes('href="./V500,0/"'),'root navigation missing V500.0');
console.log(JSON.stringify({ok:true,pages:html.length,indexed:data.items.length,edition:'V500.0'}));