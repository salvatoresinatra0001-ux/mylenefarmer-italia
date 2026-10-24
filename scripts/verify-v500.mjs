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
 assert.ok(!/<img\b|<picture\b|og:image|twitter:image/i.test(s),'unapproved image: '+filename);
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
console.log(JSON.stringify({ok:true,pages:html.length,indexed:data.items.length,edition:'V500.0'}));