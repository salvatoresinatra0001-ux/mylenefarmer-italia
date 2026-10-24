(()=>{'use strict';
if(window.__mfSiteFinish)return;window.__mfSiteFinish=true;
const root=document.documentElement;
const icon=document.querySelector('link[rel~="icon"]');if(icon&&!icon.href.includes('v=mf-photo-20261018'))icon.href+=(icon.href.includes('?')?'&':'?')+'v=mf-photo-20261018';
root.dataset.themeMode='dark';root.dataset.theme='dark';root.style.colorScheme='dark';try{localStorage.removeItem('mf-theme')}catch{}
function setup(){
 document.querySelectorAll('.mf-theme-switcher').forEach(el=>el.remove());
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