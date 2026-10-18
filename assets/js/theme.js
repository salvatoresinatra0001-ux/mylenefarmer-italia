(()=>{'use strict';
if(window.__mfSiteFinish)return;window.__mfSiteFinish=true;
const root=document.documentElement,key='mf-theme',media=window.matchMedia('(prefers-color-scheme: light)');
let mode='system';try{const v=localStorage.getItem(key);if(['system','light','dark'].includes(v))mode=v}catch{}
function apply(){root.dataset.themeMode=mode;root.dataset.theme=mode==='system'?(media.matches?'light':'dark'):mode}
apply();
function setup(){
 if(!document.querySelector('.mf-theme-switcher')){
  const box=document.createElement('div');box.className='mf-theme-switcher';
  box.innerHTML='<label for="mf-theme-mode">Tema</label><select id="mf-theme-mode" aria-label="Modalità colore"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select>';
  document.body.append(box);const select=box.querySelector('select');select.value=mode;
  select.addEventListener('change',()=>{mode=select.value;try{localStorage.setItem(key,mode)}catch{}apply()});
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
  const credit=document.createElement('p');credit.className='mf-global-credit';credit.textContent='Progetto editoriale indipendente, non ufficiale e non affiliato a Mylène Farmer o ai suoi aventi diritto. Ideazione e cura: Salvatore Sinatra · © 2026.';
  footer.append(credit);
 }
}
if(media.addEventListener)media.addEventListener('change',()=>{if(mode==='system')apply()});else if(media.addListener)media.addListener(()=>{if(mode==='system')apply()});
window.addEventListener('storage',e=>{if(e.key===key){mode=['system','light','dark'].includes(e.newValue)?e.newValue:'system';const s=document.getElementById('mf-theme-mode');if(s)s.value=mode;apply()}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();