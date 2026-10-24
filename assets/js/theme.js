(()=>{'use strict';
if(window.__mfSiteFinish)return;window.__mfSiteFinish=true;
const root=document.documentElement;
const icon=document.querySelector('link[rel~="icon"]');if(icon&&!icon.href.includes('v=mf-photo-20261018'))icon.href+=(icon.href.includes('?')?'&':'?')+'v=mf-photo-20261018';
root.dataset.themeMode='dark';root.dataset.theme='dark';root.style.colorScheme='dark';try{localStorage.removeItem('mf-theme')}catch{}
function setup(){
 document.querySelectorAll('.mf-theme-switcher').forEach(el=>el.remove());
 document.querySelectorAll('.mf-reference-bar').forEach(el=>el.remove());
 const footer=document.querySelector('footer');
 if(footer&&!footer.textContent.includes('Salvatore Sinatra')){
  const credit=document.createElement('p');credit.className='mf-global-credit';credit.textContent='Progetto editoriale indipendente, non ufficiale e non affiliato a Mylène Farmer o ai suoi aventi diritto. Ideazione e cura: Salvatore Sinatra · © 2026.';footer.append(credit)
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();