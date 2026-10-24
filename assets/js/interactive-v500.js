/* Mylène Farmer Italia — Interactive Edition V500.0.
   Progressive enhancement, native JS, no tracking, no autoplay. */
(()=>{'use strict';
const reduce=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('it').trim();
const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
const button=(label,cls)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.className=cls;return b};
const safeStorage={get(key){try{return localStorage.getItem(key)}catch{return null}},set(key,value){try{localStorage.setItem(key,value)}catch{}}};
function quickSearch(){
 const header=document.querySelector('.mf-header-tools')||document.querySelector('.site-head .head-row');if(!header)return;const fallback=header.querySelector('.mf-header-search');if(fallback)fallback.remove();
 const trigger=button('Cerca  /','mf-v500-trigger');trigger.dataset.v500Search='';trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-keyshortcuts','Control+K Meta+K /');trigger.title='Cerca nell’archivio (Ctrl/⌘+K)';
 header.append(trigger);
 const dialog=document.createElement('dialog');dialog.className='mf-v500-dialog';dialog.setAttribute('aria-label','Ricerca rapida nell’archivio');
 const form=document.createElement('form');form.method='dialog';form.className='mf-v500-dialog-head';
 const label=document.createElement('label');label.htmlFor='mf-v500-query';label.textContent='Ricerca rapida';
 const field=document.createElement('input');field.id='mf-v500-query';field.type='search';field.placeholder='Album, concerti, dossier…';field.autocomplete='off';
 const close=button('Chiudi','mf-v500-close');close.setAttribute('aria-label','Chiudi ricerca');close.addEventListener('click',()=>dialog.close());
 form.append(label,field,close);
 const status=document.createElement('p');status.className='mf-v500-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.textContent='Inserisci una parola da cercare.';
 const results=document.createElement('div');results.className='mf-v500-results';results.id='mf-v500-results';
 const fallback=document.createElement('a');fallback.href='./cerca.html';fallback.className='mf-v500-full';fallback.textContent='Apri la ricerca completa →';
 dialog.append(form,status,results,fallback);document.body.append(dialog);
 let items=null;let load=null;
 function render(){
  results.replaceChildren();if(!items){status.textContent='Indice non disponibile. Usa la ricerca completa.';return}
  const term=normalize(field.value);
  const matched=items.filter(item=>normalize([item.title,item.summary,item.type,item.keywords].join(' ')).includes(term)).slice(0,12);
  status.textContent=term?(matched.length+' risultati mostrati (massimo 12)'):'Esplora i primi 12 contenuti';
  for(const item of matched){
   const link=document.createElement('a');link.className='mf-v500-hit';
   try{const u=new URL(item.url,document.baseURI);if(u.origin!==location.origin||!['http:','https:'].includes(u.protocol))continue;link.href=u.href}catch{continue}
   const tag=document.createElement('small');tag.textContent=item.type;
   const name=document.createElement('strong');name.textContent=item.title;
   const description=document.createElement('span');description.textContent=item.summary||'';
   link.append(tag,name,description);results.append(link);
  }
  if(!results.children.length)status.textContent='Nessun risultato. Prova una parola diversa.';
 }
 async function open(){
  if(typeof dialog.showModal!=='function'){location.href='./cerca.html';return}
  if(!dialog.open)dialog.showModal();field.focus();
  if(items){render();return}
  if(!load){
   load=fetch('./assets/data/search-index.json',{cache:'default'}).then(r=>{if(!r.ok)throw Error('Indice non disponibile');return r.json()})
    .then(data=>{items=Array.isArray(data.items)?data.items.filter(x=>x&&typeof x.url==='string'&&typeof x.title==='string'):[];render()})
    .catch(()=>{status.textContent='Indice non disponibile: apri la ricerca completa.'});
  }
  await load;
 }
 trigger.addEventListener('click',open);field.addEventListener('input',render);
 window.addEventListener('keydown',event=>{
  const target=event.target;
  const typing=target&&(target.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();open();return}
  if(event.key==='/'&&!typing&&!event.altKey&&!event.ctrlKey&&!event.metaKey&&!dialog.open){event.preventDefault();open()}
 });
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();dialog.close();trigger.focus()}});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
}
function discography(){
 if(!/discografia\.html$/i.test(location.pathname))return;
 const sections=[...document.querySelectorAll('main section')].filter(sec=>sec.querySelector('.tbl-wrap tbody'));
 const groups=sections.map(sec=>{
  const h=normalize(sec.querySelector('h2')?.textContent||'');
  const kind=h.includes('album in studio')?'studio':h.includes('album dal vivo')?'live':h.includes('raccolte e remix')?'raccolte':h.includes('singoli recenti')?'singoli':null;
  return kind?{kind,rows:[...sec.querySelectorAll('.tbl-wrap tbody tr')]}:null;
 }).filter(Boolean);
 if(!groups.length)return;
 const first=groups[0],container=first.rows[0]?.closest('section');if(!container)return;
 const panel=document.createElement('div');panel.className='mf-v500-filter';panel.setAttribute('aria-label','Filtri discografici');
 const heading=document.createElement('h3');heading.textContent='Esplora la discografia';panel.append(heading);
 const pills=document.createElement('div');pills.className='mf-v500-pills';pills.setAttribute('role','group');pills.setAttribute('aria-label','Tipologia pubblicazioni');
 const labels=[['all','Tutte'],['studio','Studio'],['live','Live'],['raccolte','Raccolte'],['singoli','Singoli']];
 let selected='all';const controls=[];
 for(const [value,label] of labels){const b=button(label,'mf-v500-pill');b.dataset.kind=value;b.setAttribute('aria-pressed',String(value==='all'));b.addEventListener('click',()=>{selected=value;update()});pills.append(b);controls.push(b)}
 const yrLabel=document.createElement('label');yrLabel.htmlFor='mf-v500-decade';yrLabel.textContent='Decennio ';
 const decade=document.createElement('select');decade.id='mf-v500-decade';
 for(const [value,label] of [['','Tutti gli anni'],['1980','Anni 80'],['1990','Anni 90'],['2000','Anni 2000'],['2010','Anni 2010'],['2020','Anni 2020']]){
  const opt=document.createElement('option');opt.value=value;opt.textContent=label;decade.append(opt);
 }
 yrLabel.append(decade);decade.addEventListener('change',update);
 const count=document.createElement('p');count.className='mf-v500-count';count.setAttribute('role','status');count.setAttribute('aria-live','polite');
 const note=document.createElement('p');note.className='mf-v500-note';note.textContent='I dati segnalati come preliminari restano da verificare. I filtri non modificano l’ordine cronologico originale.';
 panel.append(pills,yrLabel,count,note);
 const target=container.querySelector('.tbl-wrap');target.before(panel);
 function update(){
  let countVisible=0,total=0;
  controls.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.kind===selected)));
  for(const group of groups)for(const tr of group.rows){
   total++;const cell=tr.querySelector('td');const match=String(cell?.textContent||'').match(/\b(?:19|20)\d{2}\b/);
   const yr=match?Number(match[0]):0;
   const allowed=(selected==='all'||selected===group.kind)&&(!decade.value||(yr>=Number(decade.value)&&yr<Number(decade.value)+10));
   tr.hidden=!allowed;if(allowed)countVisible++;
  }
  count.textContent=countVisible+' pubblicazioni visualizzate su '+total;
 }
 update();
}
function reading(){
 const items=[...document.querySelectorAll('[data-dossier] .dp-article[id],.mf-longform-chapter[id]')];
 if(items.length<2)return;
 const key='mf-v500-reading:'+location.pathname;
 const toolbar=document.createElement('div');toolbar.className='mf-v500-reading';
 const description=document.createElement('p');description.textContent='Punto di lettura salvato soltanto in questo browser.';toolbar.append(description);
 const resume=button('Riprendi la lettura','mf-v500-resume');resume.hidden=true;toolbar.append(resume);
 const host=document.querySelector('[data-dossier]')||document.querySelector('.mf-longform-intro')||items[0];
 host.prepend(toolbar);
 const find=id=>items.find(el=>el.id===id);
 function jump(el){
  if(!el)return;el.hidden=false;const details=el.querySelector('details');if(details)details.open=true;
  el.scrollIntoView({behavior:reduce()?'instant':'smooth',block:'start'});safeStorage.set(key,el.id);
 }
 const saved=safeStorage.get(key);if(find(saved)){resume.hidden=false;resume.addEventListener('click',()=>jump(find(saved)))}
 items.forEach((article,index)=>{
  const next=items[index+1];if(next){
   const link=document.createElement('a');link.className='mf-v500-next';link.href='#'+next.id;link.textContent='Capitolo successivo →';link.addEventListener('click',()=>safeStorage.set(key,next.id));article.append(link);
  }
  article.addEventListener('focusin',()=>safeStorage.set(key,article.id));
  article.addEventListener('click',()=>safeStorage.set(key,article.id));
 });
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&entry.intersectionRatio>=.35)safeStorage.set(key,entry.target.id)}},{threshold:[.35],rootMargin:'-15% 0px -35% 0px'});
  items.forEach(el=>observer.observe(el));
 }
}
function embeds(){
 document.querySelectorAll('iframe[src]').forEach((frame,i)=>{
  if(!frame.hasAttribute('loading'))frame.loading='lazy';
  if(!frame.hasAttribute('title'))frame.title='Lettore musicale o video incorporato '+(i+1);
 });
}
ready(()=>{quickSearch();discography();reading();embeds();});
})();