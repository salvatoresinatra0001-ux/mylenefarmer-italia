/* Internal gallery: real photographs, explicit source credits, no download controls. */
(function(){'use strict';
 const $=id=>document.getElementById(id),grid=$('mf-grid'),viewer=$('mf-viewer');
 if(!grid||!viewer)return;
 let items=[],visible=[],active=0,previousFocus=null,serial=0,fullImage=null,fullTimer=null;
 const img=$('mf-large'),loading=$('mf-loading'),retry=$('mf-retry');
 const normalized=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('it');
 function filter(){const query=normalized($('mf-search').value.trim()),year=$('mf-year').value;visible=items.filter(p=>(year==='all'||String(p.year)===year)&&(!query||normalized([p.id,p.title,p.year,p.author,p.source].join(' ')).includes(query)));const wanted=new Set(visible.map(p=>p.id));grid.querySelectorAll('.mf-card').forEach(card=>{card.hidden=!wanted.has(card.dataset.photoId)});$('mf-results').textContent=visible.length+' fotografie di '+items.length;$('mf-empty').hidden=visible.length>0;}
 function bindImage(p){const card=grid.querySelector('[data-photo-id="'+CSS.escape(p.id)+'"]');if(!card)return;const image=card.querySelector('img');let attempted=false;const failed=()=>{if(p.fallback&&!attempted){attempted=true;image.src=p.fallback;}else{card.querySelector('.mf-photo-error').hidden=false;image.dataset.delivery='error';}};image.addEventListener('error',failed);image.addEventListener('load',()=>{card.querySelector('.mf-photo-error').hidden=true;image.dataset.delivery='loaded';});if(image.complete){if(image.naturalWidth)image.dataset.delivery='loaded';else failed();}}
 function cancelFull(){clearTimeout(fullTimer);if(fullImage){fullImage.onload=fullImage.onerror=null;fullImage.src='';fullImage=null;}}
 function show(){const p=visible[active];if(!p)return;const ticket=++serial;cancelFull();let upgradeStarted=false;
  loading.hidden=false;loading.textContent='Caricamento della fotografia...';retry.hidden=true;img.hidden=true;
  $('mf-title').textContent=p.title;$('mf-credit').textContent=p.author+' \u00b7 '+p.license+' \u00b7 '+p.source;
  $('mf-size').textContent='Originale: '+p.width+' \u00d7 '+p.height+' px';$('mf-position').textContent=(active+1)+' / '+visible.length+' \u00b7 '+p.id;
  const describe=note=>{$('mf-size').textContent='Visualizzata: '+img.naturalWidth+' \u00d7 '+img.naturalHeight+' px. Originale: '+p.width+' \u00d7 '+p.height+' px. '+note;};
  const limited=()=>{if(ticket!==serial)return;describe('Anteprima disponibile; sorgente originale temporaneamente non raggiungibile.');retry.hidden=false;};
  img.onload=()=>{if(ticket!==serial)return;loading.hidden=true;img.hidden=false;describe(img.src===p.original?'Risoluzione originale.':'Anteprima ottimizzata.');
   if(!upgradeStarted&&p.original&&p.original!==p.src){upgradeStarted=true;fullImage=new Image();fullImage.onload=()=>{if(ticket!==serial)return;clearTimeout(fullTimer);img.src=p.original;retry.hidden=true;};fullImage.onerror=limited;fullImage.src=p.original;fullTimer=setTimeout(()=>{if(ticket===serial){cancelFull();limited();}},8000);}
  };
  img.onerror=()=>{if(ticket!==serial)return;loading.textContent='La sorgente non risponde. Puoi riprovare.';retry.hidden=false;};
  img.alt=p.alt;img.src=p.src;$('mf-prev').disabled=$('mf-next').disabled=visible.length<2;
 }
 function close(){if(viewer.open)viewer.close();}
 function open(id){const i=visible.findIndex(p=>p.id===id);if(i<0)return;active=i;previousFocus=document.activeElement;show();if(typeof viewer.showModal==='function'){viewer.showModal();document.body.classList.add('mf-modal-open');$('mf-close').focus();}else{$('mf-error').hidden=false;$('mf-error').textContent='Il browser non supporta il visualizzatore. Le fotografie rimangono consultabili nella pagina.';}}
 function move(step){if(visible.length){active=(active+step+visible.length)%visible.length;show();}}
 grid.addEventListener('click',e=>{const target=e.target.closest('[data-open-photo]');if(target)open(target.dataset.openPhoto);});
 $('mf-close').addEventListener('click',close);$('mf-prev').addEventListener('click',()=>move(-1));$('mf-next').addEventListener('click',()=>move(1));retry.addEventListener('click',show);
 viewer.addEventListener('close',()=>{serial++;cancelFull();document.body.classList.remove('mf-modal-open');img.onload=img.onerror=null;img.removeAttribute('src');if(previousFocus?.isConnected)previousFocus.focus();});
 viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
 viewer.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}});
 for(const type of ['contextmenu','dragstart'])document.addEventListener(type,e=>{if(e.target instanceof HTMLImageElement&&(grid.contains(e.target)||viewer.contains(e.target)))e.preventDefault();});
 $('mf-search').addEventListener('input',filter);$('mf-year').addEventListener('change',filter);$('mf-reset').addEventListener('click',()=>{$('mf-search').value='';$('mf-year').value='all';filter();});
 fetch('./data/gallery-public.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();}).then(data=>{if(!Array.isArray(data.items))throw Error('Catalogo non valido');items=data.items;for(const year of [...new Set(items.map(p=>String(p.year)))].sort()){const option=document.createElement('option');option.value=year;option.textContent=year;$('mf-year').append(option);}items.forEach(bindImage);filter();const hash=decodeURIComponent(location.hash.slice(1));if(hash)open(hash);}).catch(()=>{$('mf-error').hidden=false;$('mf-error').textContent='Il catalogo interattivo non risponde. Fotografie e crediti restano visibili; ricarica per riattivare il visualizzatore.';});
})();
