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
