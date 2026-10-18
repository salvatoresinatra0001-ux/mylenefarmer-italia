// Navigazione mobile. Nessuna dipendenza.
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'Chiudi' : 'Menu';
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && window.matchMedia('(max-width: 920px)').matches) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Menu';
    }
  });
  window.addEventListener('resize', function () {
    if (!window.matchMedia('(max-width: 920px)').matches) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Menu';
    }
  });
})();

// Preserve existing album artwork during a third-party delivery outage.
(function () {
  'use strict';
  var images = Array.from(document.querySelectorAll('.covers img'));
  var script = document.currentScript;
  if (!images.length || !script || !script.src) return;
  var catalogueURL = new URL('../../gallerie/copertine-medium/catalogo-medium.json', script.src);
  var allowed = new URL('./assets/covers/', catalogueURL).href;
  function key(value) { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  var catalogue = fetch(catalogueURL, {cache: 'no-cache'}).then(function (response) {
    if (!response.ok) throw new Error('Artwork catalogue unavailable');
    return response.json();
  }).catch(function () { return []; });
  images.forEach(function (image) {
    var card = image.closest('.cover');
    var title = card && card.querySelector('.cover-title');
    if (!card || !title) return;
    var attempted = false, busy = false, notice = null;
    var original = image.currentSrc || image.src;
    function unavailable() {
      image.dataset.deliveryUnavailable = 'true';
      image.hidden = true;
      if (!notice) {
        notice = document.createElement('span');
        notice.className = 'cover-unavailable';
        notice.dataset.unavailableArtwork = title.textContent;
        notice.style.cssText = 'display:flex;align-items:center;justify-content:center;aspect-ratio:1/1;padding:20px;border:1px solid currentColor;font-size:13px;text-align:center;';
        notice.textContent = 'Copertina temporaneamente non disponibile';
        image.after(notice);
      }
      // Keep the failed image URL in the DOM so the audit still records the outage.
    }
    function failed() {
      if (busy) return;
      busy = true;
      catalogue.then(function (entries) {
        var item = Array.isArray(entries) && entries.find(function (entry) { return key(entry.release) === key(title.textContent); });
        var fallback = item && new URL(item.site_asset_url, catalogueURL).href;
        if (!attempted && fallback && fallback.startsWith(allowed)) {
          attempted = true; busy = false;
          image.dataset.originalSource = original;
          image.removeAttribute('srcset'); image.removeAttribute('sizes');
          image.src = fallback;
          return;
        }
        busy = false; unavailable();
      }).catch(function () { busy = false; unavailable(); });
    }
    image.addEventListener('error', failed);
    image.addEventListener('load', function () {
      busy = false; image.hidden = false;
      delete image.dataset.deliveryUnavailable;
      if (notice) { notice.remove(); notice = null; }
    });
    if (image.complete && !image.naturalWidth && image.getAttribute('src')) failed();
  });
})();

/* Adaptive visual system: loaded on every legacy page without changing page content. */
(function(){var css='assets/css/theme.css';if(!document.querySelector('link[data-mf-theme]')){var l=document.createElement('link');l.rel='stylesheet';l.href=css;l.dataset.mfTheme='true';document.head.appendChild(l)}if(!document.querySelector('script[data-mf-theme]')){var s=document.createElement('script');s.src='assets/js/theme.js';s.defer=true;s.dataset.mfTheme='true';document.head.appendChild(s)}})();

/* Riferimenti musicali e blocco crediti globale */
(function () {
  'use strict';
  var platforms = [
    {name:'Spotify', cls:'mf-spotify', mark:'S', url:'https://open.spotify.com/search/Mylene%20Farmer'},
    {name:'Apple Music', cls:'mf-apple', mark:'♪', url:'https://music.apple.com/it/search?term=Myl%C3%A8ne%20Farmer'},
    {name:'Qobuz', cls:'mf-qobuz', mark:'Q', url:'https://www.qobuz.com/it-it/search?q=Myl%C3%A8ne%20Farmer'},
    {name:'Deezer', cls:'mf-deezer', mark:'D', url:'https://www.deezer.com/search/Mylene%20Farmer'},
    {name:'YouTube Music', cls:'mf-youtube', mark:'▶', url:'https://music.youtube.com/search?q=Myl%C3%A8ne%20Farmer'}
  ];
  if (!document.querySelector('link[data-mf-reference-bar]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = 'assets/css/reference-bar.css'; link.dataset.mfReferenceBar = 'true';
    document.head.appendChild(link);
  }
  if (!document.querySelector('.mf-reference-bar')) {
    var bar = document.createElement('div');
    bar.className = 'mf-reference-bar';
    bar.setAttribute('aria-label', 'Riferimenti musicali esterni');
    var links = platforms.map(function (p) {
      return '<li><a href="' + p.url + '" target="_blank" rel="noopener noreferrer" title="Cerca Mylène Farmer su ' + p.name + '"><span class="mf-ref-icon ' + p.cls + '" aria-hidden="true">' + p.mark + '</span><span>' + p.name + '</span></a></li>';
    }).join('');
    bar.innerHTML = '<div class="mf-ref-inner"><span class="mf-ref-label">Riferimenti musicali</span><ul class="mf-ref-links">' + links + '</ul></div>';
    var header = document.querySelector('.site-head');
    if (header) header.parentNode.insertBefore(bar, header);
  }
  var foot = document.querySelector('.site-foot');
  if (foot && !foot.querySelector('.mf-foot-meta')) {
    var wrap = foot.querySelector('.wrap');
    if (wrap) {
      var meta = document.createElement('div');
      meta.className = 'mf-foot-meta';
      meta.innerHTML = '<div><strong>Progetto editoriale:</strong> Mylène Farmer · Italia — archivio italiano indipendente.</div><div class="mf-foot-legal"><strong>Disclaimer:</strong> sito non ufficiale, non affiliato a Mylène Farmer, al management, alle case discografiche o alle piattaforme musicali citate. I nomi, i marchi, le fotografie, le copertine e le registrazioni appartengono ai rispettivi titolari.</div><div><strong>Crediti e direzione:</strong> ideazione, redazione, direzione visiva e sviluppo a cura di Salvatore Sinatra · <strong>Anno:</strong> 2026.</div>';
      var bottom = wrap.querySelector('.foot-bottom');
      if (bottom) wrap.insertBefore(meta, bottom); else wrap.appendChild(meta);
    }
  }
})();

/* Sistema visivo comune: progressione editoriale e galleria Claude Gassian */
(function(){
  var link=document.createElement('link');link.rel='stylesheet';link.href='assets/css/approfondimento-system.css';link.dataset.mfEditorial='true';document.head.appendChild(link);
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('mf-visible');io.unobserve(e.target)}})},{threshold:.08});
    document.querySelectorAll('main section').forEach(function(s){io.observe(s)});
  } else {document.querySelectorAll('main section').forEach(function(s){s.classList.add('mf-visible')})}
})();

/* Favicon editoriale Claude Gassian 2008 / Cloudinary */
(function(){var href='https://res.cloudinary.com/rxhqteak/image/upload/f_auto,q_auto,w_96,h_96,c_fill,g_face,fl_awebp/MYLENE_FARMER/00082beab8f5da27a5cd9b76f058137738d1df0346fe2fc1341ee8d9ad0ee9fa.jpg';var old=document.querySelector('link[rel="icon"]');if(old)old.href=href;else{var l=document.createElement('link');l.rel='icon';l.href=href;document.head.appendChild(l)}})();
