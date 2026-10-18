/* Mylène Farmer Italia: one rights-reviewed photographic archive.
   Public Wikimedia records and individually approved Cloudinary records only. */
(()=>{'use strict';
  const $=id=>document.getElementById(id);
  const gallery=$('vg-gallery'),timeline=$('vg-timeline'),years=$('vg-year'),periods=$('vg-period'),category=$('vg-category');
  const query=$('vg-query'),sort=$('vg-sort'),count=$('vg-count'),notice=$('vg-notice'),more=$('vg-more');
  const dialog=$('vg-dialog'),large=$('vg-large'),caption=$('vg-caption'),source=$('vg-source'),licenseLink=$('vg-license');
  const close=$('vg-close'),prev=$('vg-prev'),next=$('vg-next'),position=$('vg-position'),imageStatus=$('vg-image-status');
  const folderGrid=$('vg-folders'),folderStatus=$('vg-folder-status');
  const limitPerPage=48;
  // Editorial chronology: these are navigational eras, NOT Cloudinary folder claims.
  const editorialPeriods=['1984–1989','1990–1999','2000–2009','2010–2019','2020–2026'];
  const editorialDecades=['1980–1989','1990–1999','2000–2009','2010–2019','2020–2029'];
  let all=[],filtered=[],folderData=[],taxonomyMode='folder-tree',taxonomyScanned=0,taxonomyInferred=false,taxonomyUnique=0,taxonomyUndated=0,taxonomySnapshot='',limit=limitPerPage,active=-1,returnFocus=null,selectedDecade='all',imageSerial=0;
  const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('it');
  const validYear=v=>/^(?:19|20)\d{2}$/.test(String(v||''))?String(v):'';
  const decade=v=>{const y=validYear(v);return y?String(Math.floor(Number(y)/10)*10)+'–'+String(Math.floor(Number(y)/10)*10+9):'Non datato'};
  const https=v=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}};
  const proxy=(id,size)=>{if(!/^[a-f0-9]{24}$/.test(String(id||'')))return null;const base=location.hostname.endsWith('github.io')?'https://mylenefarmer.it':'';return base+'/.netlify/functions/cloudinary-photo?id='+id+'&size='+size};
  const node=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n};
  const range=s=>{const m=String(s||'').match(/((?:19|20)\d{2})\s*[-–_]\s*((?:19|20)\d{2})/);return m?[Number(m[1]),Number(m[2])]:null};
  const periodMatch=(photo,value)=>{
    if(!value)return true;
    if(normalize(photo.period)===normalize(value))return true;
    const r=range(value);
    return !!(r&&photo.year&&Number(photo.year)>=r[0]&&Number(photo.year)<=r[1]);
  };
  const fetchJson=async(url)=>{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);try{const r=await fetch(url,{cache:'no-cache',signal:controller.signal});if(!r.ok)throw Error('HTTP '+r.status);return await r.json()}finally{clearTimeout(timer)}};
  const commons=data=>(Array.isArray(data.items)?data.items:[]).filter(p=>p&&p.id&&https(p.src)).map(p=>{
    const year=validYear(p.year);
    return {id:'commons:'+p.id,title:String(p.title||p.alt||'Fotografia'),year,period:decade(year),decade:decade(year),
      category:'documentary',author:String(p.author||'Autore non indicato'),license:String(p.license||''),source:String(p.source||'Archivio documentato'),
      sourceUrl:https(p.sourceUrl),licenseUrl:https(p.licenseUrl),thumb:https(p.src),large:https(p.original)||https(p.src),
      fallback:https(p.fallback),alt:String(p.alt||p.title||'Mylène Farmer'),width:p.width,height:p.height,origin:'commons'};
  });
  const cloudinary=data=>(Array.isArray(data.images)?data.images:[]).filter(p=>{const publicAsset=p&&(p.public===true||p.visibility==='public'||p.access_mode==='public'||p.type==='upload');const hd=p&&(String(p.quality||p.resolution||'').toLowerCase().match(/hd|uhd|4k|high/)||((Number(p.width)||0)>=1280&&(Number(p.height)||0)>=720));return p&&p.publish===true&&p.rights_verified===true&&publicAsset&&hd&&/^[a-f0-9]{24}$/.test(p.image_id||'')}).map(p=>{
    const year=validYear(p.year),id=String(p.image_id);
    return {id:'cloudinary:'+id,title:String(p.title||'Fotografia'),year,period:String(p.period||decade(year)),
      decade:decade(year),category:String(p.category||'visual'),author:String(p.photographer||'Autore non indicato'),
      license:String(p.license||''),source:'Cloudinary · scheda autorizzata',sourceUrl:https(p.source_url),licenseUrl:null,
      thumb:proxy(id,'thumb'),large:proxy(id,'large'),fallback:null,alt:String(p.alt||p.title||'Mylène Farmer'),
      width:p.width,height:p.height,origin:'cloudinary'};
  });
  const cloudinaryPublicList=data=>(Array.isArray(data.resources)?data.resources:[]).filter(p=>p&&p.type==='upload'&&p.public_id&&Math.max(Number(p.width)||0,Number(p.height)||0)>=1280&&Math.min(Number(p.width)||0,Number(p.height)||0)>=720).map(p=>{
    const year=validYear(p.year),publicId=String(p.public_id),format=String(p.format||'jpg');
    const delivery=(width)=>'https://res.cloudinary.com/rxhqteak/image/upload/f_auto,q_auto,w_'+width+'/'+publicId+'.'+format;
    return {id:'cloudinary-public:'+p.asset_id,title:publicId.split('/').pop(),year,period:decade(year),decade:decade(year),category:'visual',author:'Cloudinary · archivio pubblico',license:'Verifica editoriale in corso',source:'Cloudinary · MYLENE_FARMER',sourceUrl:'https://console.cloudinary.com/app/c-59f776cc3edb265311a3ac475b525f6/assets/media_library/search?q=&view_mode=grid&sortDirection=asc&sortField=publicId',licenseUrl:null,thumb:delivery(900),large:delivery(2200),fallback:null,alt:'Mylène Farmer · archivio Cloudinary pubblico',width:p.width,height:p.height,origin:'cloudinary'};
  });
  function options(select,values,firstLabel){
    const old=select.value;select.replaceChildren();
    const first=node('option','',firstLabel);first.value='';select.append(first);
    for(const value of values){const o=node('option','',value==='undated'?'Senza anno':value);o.value=value;select.append(o)}
    if(values.includes(old))select.value=old;
  }
  function updateSelectors(){
    const y=[...new Set([...all.map(p=>p.year),...folderData.map(f=>validYear(f.year))].filter(Boolean))].sort((a,b)=>Number(b)-Number(a));
    if(taxonomyUndated>0||all.some(p=>!p.year))y.push('undated');
    options(years,y,'Tutti gli anni');
    const p=[...new Set([...editorialPeriods,...all.map(x=>x.period),...folderData.map(f=>String(f.period||''))].filter(Boolean))].sort((a,b)=>b.localeCompare(a,'it'));
    options(periods,p,'Tutti i periodi');
    const cats=[...new Set(all.map(p=>p.category))].sort();
    const labels={documentary:'Documentazione',portraits:'Ritratti',live:'Live e tournée',discography:'Discografia',visual:'Universo visivo',appearances:'Apparizioni'};
    const old=category.value;category.replaceChildren();const first=node('option','','Tutte le categorie');first.value='';category.append(first);
    for(const cat of cats){const opt=node('option','',labels[cat]||cat);opt.value=cat;category.append(opt)}
    if(cats.includes(old))category.value=old;
    renderTimeline();
  }
  function renderTimeline(){
    timeline.replaceChildren();
    const yearsInArchive=[...all.map(p=>p.year),...folderData.map(f=>validYear(f.year))].filter(Boolean);
    const decades=[...new Set([...editorialDecades,...yearsInArchive.map(decade)])].sort((a,b)=>Number(b.slice(0,4))-Number(a.slice(0,4)));
    if(selectedDecade!=='all'&&!decades.includes(selectedDecade))selectedDecade='all';
    for(const d of ['all',...decades]){
      const b=node('button','',d==='all'?'Tutti i decenni':d);
      b.type='button';b.setAttribute('aria-pressed',String(d===selectedDecade));
      b.addEventListener('click',()=>{selectedDecade=d;years.value='';limit=limitPerPage;renderTimeline();render()});
      timeline.append(b);
    }
  }
  function renderFolders(){
    folderGrid.replaceChildren();
    if(!folderData.length){folderStatus.textContent='La struttura delle cartelle Cloudinary non è al momento disponibile. Gli anni delle fotografie pubblicate rimangono consultabili.';return;}
    folderStatus.textContent=taxonomyMode==='import-ledger'
      ?folderData.length+' anni di catalogazione recuperati dai registri del Full Sync 7.1: '+taxonomyUnique.toLocaleString('it-IT')+' contenuti binari distinti, '+taxonomyScanned.toLocaleString('it-IT')+' asset e '+taxonomyUndated+' contenuti senza anno. Istantanea: '+taxonomySnapshot+'. Sono conteggi dell’archivio, non delle fotografie pubblicate; gli anni delle cartelle non certificano le date di scatto.'
      :taxonomyMode==='resource-metadata'
      ?folderData.length+' periodi ricavati dai metadati di '+taxonomyScanned+' risorse Cloudinary. '+(taxonomyInferred?'Alcuni anni sono inferiti dai nomi dei file e richiedono verifica. ':'')+'Questi non sono necessariamente nomi di sottocartelle.'
      :folderData.length+' cartelle o sottocartelle rilevate in MYLENE_FARMER/. La catalogazione non autorizza automaticamente la pubblicazione delle immagini.';
    for(const f of folderData.slice(0,120)){
      const b=node('button','',String(f.label||f.period||'Cartella'));
      b.type='button';b.title='Filtra le fotografie pubblicate per questo periodo';
      const meta=node('small','',[f.period,Number.isInteger(f.unique_contents)?f.unique_contents+' contenuti in archivio':''].filter(Boolean).join(' · '));
      b.append(meta);
      b.addEventListener('click',()=>{selectedDecade='all';years.value=validYear(f.year)||'';periods.value=[...periods.options].some(o=>o.value===f.period)?f.period:'';limit=limitPerPage;renderTimeline();render();$('vg-gallery-section').scrollIntoView({behavior:'smooth',block:'start'})});
      folderGrid.append(b);
    }
    if(taxonomyUndated>0){
      const b=node('button','','Senza anno');b.type='button';
      b.append(node('small','',taxonomyUndated+' contenuti non datati nei registri'));
      b.addEventListener('click',()=>{selectedDecade='all';years.value='undated';periods.value='';limit=limitPerPage;renderTimeline();render();$('vg-gallery-section').scrollIntoView({behavior:'smooth',block:'start'})});
      folderGrid.append(b);
    }
    for(const [id,value] of [['vg-archive-total',taxonomyUnique],['vg-archive-assets',taxonomyScanned],['vg-archive-undated',taxonomyUndated]]){
      if($(id))$(id).textContent=value.toLocaleString('it-IT');
    }
    if(folderData.length>120)folderGrid.append(node('p','',String(folderData.length-120)+' ulteriori cartelle censite; usa i filtri per periodo.'));
  }
  function filteredItems(){
    const q=normalize(query.value.trim()),y=years.value,p=periods.value,c=category.value;
    const result=all.filter(x=>(!y||(y==='undated'?!x.year:x.year===y))&&(selectedDecade==='all'||x.decade===selectedDecade)&&periodMatch(x,p)&&(!c||x.category===c)&&(!q||normalize([x.title,x.year,x.period,x.author,x.source,x.category].join(' ')).includes(q)));
    result.sort((a,b)=>sort.value==='title'?a.title.localeCompare(b.title,'it'):sort.value==='old'?Number(a.year||0)-Number(b.year||0)||a.title.localeCompare(b.title,'it'):Number(b.year||0)-Number(a.year||0)||a.title.localeCompare(b.title,'it'));
    return result;
  }
  function render(){
    filtered=filteredItems();
    const shown=filtered.slice(0,limit);
    gallery.replaceChildren();
    const groups=new Map();
    for(let i=0;i<shown.length;i++){const p=shown[i],key=p.year||'Non datato';if(!groups.has(key))groups.set(key,[]);groups.get(key).push({p,i})}
    for(const [year,photos] of groups){
      const section=node('section','vg-year-group');
      const head=node('div','vg-year-head'),title=node('h3','',year),small=node('small','',photos.length+' in questa visualizzazione');
      head.append(title,small);section.append(head);
      const grid=node('div','vg-grid');
      for(const {p,i} of photos){
        const card=node('article','vg-card'),open=node('button','vg-open');
        open.type='button';open.setAttribute('aria-label','Ingrandisci '+p.title);open.dataset.index=String(i);
        const img=node('img');img.src=p.thumb;img.alt=p.alt;img.loading='lazy';img.decoding='async';
        if(p.width&&p.height){img.width=p.width;img.height=p.height}
        img.addEventListener('error',()=>{if(p.fallback&&img.src!==p.fallback){img.src=p.fallback;return}const placeholder=node('div','vg-notice','Immagine temporaneamente non disponibile');img.replaceWith(placeholder)});
        open.append(img);open.addEventListener('click',()=>show(i,open));
        const info=node('div','vg-card-info');
        info.append(node('div','vg-meta',[p.year||'Data non indicata',p.period].filter(Boolean).join(' / ')),node('h4','',p.title),node('p','',p.author+' · '+p.license));
        if(p.sourceUrl){const a=node('a','', 'Fonte e attribuzione ↗');a.href=p.sourceUrl;a.target='_blank';a.rel='noopener noreferrer';info.append(a)}
        card.append(open,info);grid.append(card);
      }
      section.append(grid);gallery.append(section);
    }
    count.textContent=filtered.length+' fotografie trovate · '+shown.length+' visualizzate';
    more.hidden=shown.length>=filtered.length;
    if(!filtered.length){notice.hidden=false;notice.textContent=all.length?'Nessuna fotografia pubblicata corrisponde ai filtri selezionati. Alcuni periodi Cloudinary contengono materiale ancora in revisione dei diritti.':'Nessuna fotografia attualmente pubblicabile.'}
    else notice.hidden=true;
    const cloudCount=all.filter(x=>x.origin==='cloudinary').length;
    $('vg-total').textContent=String(all.length);
    $('vg-cloudinary-count').textContent=String(cloudCount);
    $('vg-year-count').textContent=String(new Set(all.map(x=>x.year).filter(Boolean)).size);
  }
  function show(i,trigger){
    const p=filtered[i];if(!p)return;
    active=i;returnFocus=trigger||document.activeElement;
    const ticket=++imageSerial;
    large.removeAttribute('src');large.alt=p.alt;
    imageStatus.textContent='Caricamento fotografia…';
    large.onload=()=>{if(ticket===imageSerial)imageStatus.textContent=''};
    large.onerror=()=>{if(ticket===imageSerial){imageStatus.textContent='Immagine temporaneamente non disponibile';if(p.fallback&&large.src!==p.fallback)large.src=p.fallback}};
    large.src=p.large||p.thumb;
    $('vg-title').textContent=p.title;
    caption.textContent=[p.year,p.period,p.author,p.license,p.source].filter(Boolean).join(' · ');
    position.textContent=(i+1)+' / '+filtered.length;
    source.hidden=!p.sourceUrl;if(p.sourceUrl)source.href=p.sourceUrl;
    licenseLink.hidden=!p.licenseUrl;if(p.licenseUrl)licenseLink.href=p.licenseUrl;
    prev.disabled=next.disabled=filtered.length<2;
    if(!dialog.open)dialog.showModal();
    close.focus();
  }
  function move(step){if(active<0||!filtered.length)return;show((active+step+filtered.length)%filtered.length,returnFocus)}
  close.addEventListener('click',()=>dialog.close());
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  dialog.addEventListener('close',()=>{imageSerial++;large.removeAttribute('src');active=-1;if(returnFocus?.isConnected)returnFocus.focus()});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}});
  more.addEventListener('click',()=>{limit+=limitPerPage;render()});
  $('vg-reset').addEventListener('click',()=>{query.value='';years.value='';periods.value='';category.value='';sort.value='new';selectedDecade='all';limit=limitPerPage;renderTimeline();render()});
  for(const el of [query,years,periods,category,sort])el.addEventListener(el===query?'input':'change',()=>{limit=limitPerPage;if(el===years&&years.value)selectedDecade='all';renderTimeline();render()});
  async function init(){
    const periodUrl='./assets/data/archive-periods.json';
    const results=await Promise.allSettled([fetchJson('./data/gallery-public.json'),fetchJson('./assets/data/cloudinary-gallery.json'),fetchJson('https://res.cloudinary.com/rxhqteak/image/list/MYLENE_FARMER.json')]);
    const old=results[0].status==='fulfilled'?commons(results[0].value):[];
    const newer=results[1].status==='fulfilled'?cloudinary(results[1].value):[];
    const publicList=results[2].status==='fulfilled'?cloudinaryPublicList(results[2].value):[];
    const unique=new Map();for(const p of [...old,...newer,...publicList])if(!unique.has(p.id))unique.set(p.id,p);
    all=[...unique.values()];
    // Render approved photographs immediately; folder inventory may take longer.
    updateSelectors();render();
    // Preserve historical deep links from the documentary gallery (e.g. #MF-2026-001).
    let hash='';try{hash=decodeURIComponent(location.hash.slice(1))}catch{hash=''}
    if(hash && !['main','vg-gallery-section','vg-period-section'].includes(hash)){
      const i=filtered.findIndex(p=>p.id===hash||p.id.endsWith(':'+hash));
      if(i>=0)show(i,document.querySelector('.vg-brand'));
    }
    if(results[0].status==='rejected'&&results[1].status==='rejected'){notice.hidden=false;notice.textContent='Impossibile caricare i cataloghi fotografici. Riprova più tardi.'}
    else if(results[1].status==='rejected'){$('vg-catalog-status').textContent='Catalogo Cloudinary temporaneamente non disponibile; la selezione documentata rimane consultabile.'}
    else if(!newer.length){$('vg-catalog-status').textContent='Le fotografie dell’archivio Cloudinary sono in revisione dei diritti: nessun file viene pubblicato automaticamente.'}
    else {$('vg-catalog-status').textContent='Selezione Cloudinary autorizzata integrata nella galleria.'}
    try{
      const taxonomy=await fetchJson(periodUrl);
      folderData=Array.isArray(taxonomy.folders)?taxonomy.folders.filter(f=>f&&typeof f.label==='string'):[];
      taxonomyMode=taxonomy.sourceMode||'folder-tree';taxonomyScanned=Number(taxonomy.assetsScanned||0);taxonomyInferred=!!taxonomy.inferredFromFilenames;taxonomyUnique=Number(taxonomy.unique_contents||0);taxonomyUndated=Number(taxonomy.undated_contents||0);
      const snapshot=new Date(taxonomy.snapshot_utc||'');
      taxonomySnapshot=Number.isNaN(snapshot.getTime())?'data non disponibile':snapshot.toLocaleString('it-IT',{timeZone:'Europe/Rome'})+' (ora italiana)';
      updateSelectors();renderFolders();if(!dialog.open)render();
    }catch{renderFolders()}
  }
  init().catch(()=>{notice.hidden=false;notice.textContent='Errore temporaneo di caricamento della galleria.'});
})();
/* Adaptive visual system: loaded on every legacy page without changing page content. */
(function(){var css='../assets/css/theme.css';if(!document.querySelector('link[data-mf-theme]')){var l=document.createElement('link');l.rel='stylesheet';l.href=css;l.dataset.mfTheme='true';document.head.appendChild(l)}if(!document.querySelector('script[data-mf-theme]')){var s=document.createElement('script');s.src='../assets/js/theme.js';s.defer=true;s.dataset.mfTheme='true';document.head.appendChild(s)}})();
