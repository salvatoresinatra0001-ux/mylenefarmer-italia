/* Text-only progressive enhancement: reading progress, accessible table of contents. */
(()=>{'use strict';
 function ready(){
  const main=document.querySelector('main');if(!main)return;
  const bar=document.createElement('div');bar.className='v10-progress';bar.setAttribute('aria-hidden','true');document.body.append(bar);
  const jump=document.createElement('button');jump.type='button';jump.className='v10-jump';jump.textContent='↑';jump.setAttribute('aria-label','Torna all’inizio');jump.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));document.body.append(jump);
  let queued=false;function update(){if(queued)return;queued=true;requestAnimationFrame(()=>{const range=document.documentElement.scrollHeight-innerHeight;bar.style.width=(range>0?Math.min(100,100*scrollY/range):0)+'%';jump.classList.toggle('is-visible',scrollY>550);queued=false})}
  addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();
  if(main.querySelector('.mf-longform-index'))return;
  const sections=[...main.querySelectorAll('section')].filter(el=>el.querySelector('h1,h2')).slice(0,20);
  if(sections.length>3){const toc=document.createElement('details');toc.className='v10-contents';const summary=document.createElement('summary');summary.textContent='Esplora le sezioni';toc.append(summary);const nav=document.createElement('nav');nav.setAttribute('aria-label','Indice dei contenuti');sections.forEach((section,i)=>{const h=section.querySelector('h1,h2');if(!section.id)section.id='v10-section-'+(i+1);const a=document.createElement('a');a.href='#'+section.id;a.textContent=h.textContent.trim().replace(/\s+/g,' ').slice(0,72);nav.append(a)});toc.append(nav);const hero=main.querySelector('.hero');if(hero)hero.after(toc);else main.prepend(toc)}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
