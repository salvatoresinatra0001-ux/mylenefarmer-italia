/* Mylène Farmer Italia — accessible mobile navigation. No photo galleries,
 * external reference bar, additional theme or injected image content. */
(()=>{'use strict';
 const btn=document.querySelector('.nav-toggle'),nav=document.getElementById('nav');
 if(!btn||!nav)return;
 const set=open=>{nav.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open));btn.textContent=open?'Chiudi':'Menu';};
 btn.addEventListener('click',()=>set(!nav.classList.contains('open')));
 nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
 addEventListener('resize',()=>{if(!matchMedia('(max-width:920px)').matches)set(false)},{passive:true});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){set(false);btn.focus()}});
})();
