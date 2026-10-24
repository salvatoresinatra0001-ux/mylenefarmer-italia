/* Unified editorial navigation; no analytics, no generated images, no autoplay. */
(()=>{'use strict';
 const ready=()=>{const btn=document.querySelector('.mf-header-menu'),nav=document.getElementById('mf-unified-nav');
 if(!btn||!nav)return;
 const toggle=open=>{nav.classList.toggle('is-open',open);btn.setAttribute('aria-expanded',String(open));btn.textContent=open?'Chiudi':'Menu'};
 btn.addEventListener('click',()=>toggle(btn.getAttribute('aria-expanded')!=='true'));
 nav.addEventListener('click',e=>{if(e.target.closest('a'))toggle(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')){toggle(false);btn.focus()}});
 document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!btn.contains(e.target)&&nav.classList.contains('is-open'))toggle(false)});
 window.addEventListener('resize',()=>{if(window.innerWidth>1110)toggle(false)},{passive:true});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();