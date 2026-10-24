/* One theme only: cream / white / red. Interactive dossiers opt out. */
(()=>{'use strict';
 const root=document.documentElement;
 if(!root.hasAttribute('data-theme-exempt')){root.dataset.theme='light';root.dataset.themeMode='light';root.style.colorScheme='light';}
 try{localStorage.removeItem('mf-theme')}catch{}
 const ico=document.querySelector('link[rel~="icon"]');if(ico)ico.setAttribute('href','./assets/icons/favicon.svg');
 function setup(){document.querySelectorAll('.mf-theme-switcher,.mf-reference-bar,.reference-rail').forEach(el=>el.remove());}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
