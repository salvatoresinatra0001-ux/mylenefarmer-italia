(()=>{'use strict';
if(window.__mfSiteFinish)return;window.__mfSiteFinish=true;
const root=document.documentElement,key='mf-theme',media=window.matchMedia('(prefers-color-scheme: light)');
const icon=document.querySelector('link[rel~="icon"]');if(icon&&!icon.href.includes('v=mf-photo-20261018'))icon.href+=(icon.href.includes('?')?'&':'?')+'v=mf-photo-20261018';
let mode='system';try{const v=localStorage.getItem(key);if(['system','light','dark'].includes(v))mode=v}catch{}
function apply(){root.dataset.themeMode=mode;root.dataset.theme=mode==='system'?(media.matches?'light':'dark'):mode}
apply();
function setup(){
 let box=document.querySelector('.mf-theme-switcher');
 if(!box){box=document.createElement('div');box.className='mf-theme-switcher';}
 box.setAttribute('aria-label','Modalità visiva del sito');
 let select=box.querySelector('select');
 if(!select){box.innerHTML='<label for="mf-theme-select">Tema</label><select id="mf-theme-select" aria-label="Seleziona tema visivo" title="Seleziona tema visivo"><option value="light">Modern Light</option><option value="dark">Modern Dark</option><option value="system">Sistema</option></select>';select=box.querySelector('select')}
 if(!select.dataset.mfBound){select.dataset.mfBound='true';select.value=mode;select.addEventListener('change',()=>{mode=select.value;try{localStorage.setItem(key,mode)}catch{}apply()})}
 const slot=document.querySelector('.site-head .head-row,.vg-top-inner,.top-inner,header.top');
 if(slot){
  box.classList.add('mf-theme-switcher--header');
  const nav=slot.querySelector(':scope > nav');
  if(nav)nav.insertAdjacentElement('afterend',box);else slot.append(box);
 }else{
  box.classList.remove('mf-theme-switcher--header');
  document.body.append(box);
 }
 if(!document.querySelector('.mf-reference-bar')){
  const platforms=[['Spotify','S','mf-spotify','https://open.spotify.com/search/Mylene%20Farmer'],['Apple Music','♪','mf-apple','https://music.apple.com/it/search?term=Myl%C3%A8ne%20Farmer'],['Qobuz','Q','mf-qobuz','https://www.qobuz.com/it-it/search?q=Myl%C3%A8ne%20Farmer'],['Deezer','D','mf-deezer','https://www.deezer.com/search/Mylene%20Farmer'],['YouTube Music','▶','mf-youtube','https://music.youtube.com/search?q=Myl%C3%A8ne%20Farmer']];
  const bar=document.createElement('div');bar.className='mf-reference-bar';bar.setAttribute('role','navigation');bar.setAttribute('aria-label','Riferimenti musicali');
  const links=platforms.map(([n,m,c,u])=>'<li><a href="'+u+'" target="_blank" rel="noopener noreferrer" title="Cerca Mylène Farmer su '+n+'"><span class="mf-ref-icon '+c+'" aria-hidden="true">'+m+'</span><span>'+n+'</span></a></li>').join('');
  bar.innerHTML='<div class="mf-ref-inner"><span class="mf-ref-label">Riferimenti musicali</span><ul class="mf-ref-links">'+links+'</ul></div>';
  const h=document.querySelector('.site-head,.vg-top,header.top,header');if(h&&h.parentNode)h.parentNode.insertBefore(bar,h);else document.body.prepend(bar);
 }
 const footer=document.querySelector('footer');
 if(footer&&!footer.textContent.includes('Salvatore Sinatra')){
  const credit=document.createElement('p');credit.className='mf-global-credit';credit.textContent='Progetto editoriale indipendente, non ufficiale e non affiliato a Mylène Farmer o ai suoi aventi diritto. Ideazione e cura: Salvatore Sinatra · © 2026.';footer.append(credit)
 }
}
if(media.addEventListener)media.addEventListener('change',()=>{if(mode==='system')apply()});else if(media.addListener)media.addListener(()=>{if(mode==='system')apply()});
window.addEventListener('storage',e=>{if(e.key===key){mode=['system','light','dark'].includes(e.newValue)?e.newValue:'system';const s=document.querySelector('.mf-theme-switcher select');if(s)s.value=mode;apply()}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();