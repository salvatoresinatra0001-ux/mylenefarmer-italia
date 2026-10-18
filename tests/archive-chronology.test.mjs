import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import handler from '../netlify/functions/cloudinary-periods.mjs';
const data=JSON.parse(readFileSync(new URL('../assets/data/archive-periods.json',import.meta.url),'utf8'));
test('audited chronology has exactly 25 source years and reconciles all counts',()=>{
 assert.equal(data.folders.length,25);
 assert.deepEqual(data.folders.map(x=>x.year),Array.from({length:25},(_,i)=>String(1984+i)));
 assert.equal(data.folders.reduce((n,x)=>n+x.unique_contents,0),1906);
 assert.equal(data.unique_contents+data.redundant_copies,data.assetsScanned);
 assert.equal(data.live_inventory,false);
 assert.equal(data.sourceMode,'import-ledger');
});
test('aggregate public chronology contains no image origins, IDs, paths or tokens',()=>{
 const serialized=JSON.stringify(data);
 assert.doesNotMatch(serialized,/https?:\/\/|public_id|asset_id|api_secret|access_token|[a-f0-9]{32,}/i);
 for(const x of data.folders)assert.deepEqual(Object.keys(x).sort(),['label','year','period','depth','source','unique_contents'].sort());
});
test('compatible function returns the same snapshot and does not require credentials',async()=>{
 const response=await handler(new Request('https://example.test/.netlify/functions/cloudinary-periods'));
 assert.equal(response.status,200);
 assert.deepEqual(await response.json(),data);
 assert.equal((await handler(new Request('https://example.test/',{method:'HEAD'}))).body,null);
 assert.equal((await handler(new Request('https://example.test/',{method:'POST'}))).status,405);
});
