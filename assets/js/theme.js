(()=>{'use strict';
const root=document.documentElement,key='mf-theme';
let saved=null;try{saved=localStorage.getItem(key)}catch{}
const valid=['light','dark','system'];
const initial=valid.includes(saved)?saved:'system';
function apply(mode){root.dataset.theme=mode==='system'?(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'):mode;root.dataset.themeMode=mode}
apply(initial);
const media=matchMedia('(prefers-color-scheme:light)');
media.addEventListener?.('change',()=>{if((localStorage.getItem(key)||'system')==='system')apply('system')});
function mount(){if(document.querySelector('.mf-theme-switcher'))return;
const wrap=document.createElement('div');wrap.className='mf-theme-switcher';
wrap.innerHTML='<label for="mf-theme-select">Tema</label><select id="mf-theme-select" aria-label="Seleziona tema"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select>';
document.body.append(wrap);const select=wrap.querySelector('select');select.value=initial;
select.addEventListener('change',()=>{const mode=select.value;try{localStorage.setItem(key,mode)}catch{}apply(mode)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount()
})();