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
