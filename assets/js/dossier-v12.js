/* Mylène Farmer Italia / dossiers — accessible enhancement; all text exists without JS. */
(()=>{'use strict';
function ready(){
 const root=document.querySelector('[data-dossier]');if(!root)return;
 const articles=[...root.querySelectorAll('.dp-article')],input=root.querySelector('[data-search]'),results=root.querySelector('[data-results]'),buttons=[...root.querySelectorAll('[data-filter]')];
 let active='all',term='';
 const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 function update(){
  let visible=0;
  articles.forEach(el=>{const matches=(active==='all'||(el.dataset.topic||'')===active)&&norm(el.textContent).includes(norm(term));el.hidden=!matches;if(matches)visible++});
  results.textContent=visible+' capitoli su '+articles.length+' visibili';
 }
 if(input)input.addEventListener('input',()=>{term=input.value;update()});
 buttons.forEach(btn=>btn.addEventListener('click',()=>{active=btn.dataset.filter;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));update()}));
 const expand=root.querySelector('[data-expand]'),collapse=root.querySelector('[data-collapse]');
 if(expand)expand.addEventListener('click',()=>articles.filter(a=>!a.hidden).forEach(a=>a.querySelector('details').open=true));
 if(collapse)collapse.addEventListener('click',()=>articles.filter(a=>!a.hidden).forEach(a=>a.querySelector('details').open=false));
 update();
 const bar=document.querySelector('.dp-progress'),jump=document.querySelector('.dp-jump');
 let pending=false;
 function progress(){if(pending)return;pending=true;requestAnimationFrame(()=>{const d=document.documentElement.scrollHeight-innerHeight;if(bar)bar.style.width=(d>0?Math.min(100,Math.max(0,100*scrollY/d)):0)+'%';if(jump)jump.hidden=scrollY<650;pending=false})}
 addEventListener('scroll',progress,{passive:true});addEventListener('resize',progress,{passive:true});progress();
 if(jump)jump.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));
 const allHash=location.hash.slice(1);if(allHash){const target=document.getElementById(allHash);if(target&&target.matches('.dp-article')){const det=target.querySelector('details');if(det)det.open=true}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
