/* Mylène Farmer Italia — client for first-party Netlify Drive gateway. */
(() => {
  'use strict';
  const grid = document.querySelector('#gallery');
  const status = document.querySelector('#drive-status');
  const empty = document.querySelector('#empty');
  const breadcrumbs = document.querySelector('#drive-breadcrumbs');
  const home = document.querySelector('#drive-home');
  const more = document.querySelector('#drive-more');
  const search = document.querySelector('#drive-search');
  const dialog = document.querySelector('#viewer');
  const large = document.querySelector('#large');
  const credit = document.querySelector('#credit');
  const close = document.querySelector('#close');
  let trail = [], nextPage = null, busy = false, currentFolder = null;
  const catalogUrl = '/api/mylene/catalog';

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function clear() {
    grid.replaceChildren();
    more.hidden = true;
    nextPage = null;
    search.value = '';
    empty.hidden = true;
  }
  function drawTrail() {
    breadcrumbs.replaceChildren(home);
    for (let i = 0; i < trail.length; i++) {
      breadcrumbs.append(element('span', '', ' / '));
      const part = trail[i];
      const btn = element('button', '', part.name);
      btn.type = 'button';
      btn.onclick = () => enterFolder(part, i);
      breadcrumbs.append(btn);
    }
  }
  function openPhoto(item) {
    large.onerror = () => {
      large.onerror = null;
      if (large.src !== new URL(item.preview, window.location.origin).href) large.src = item.preview;
    };
    large.src = item.full;
    large.alt = item.alt || item.title || 'Fotografia';
    credit.textContent = [item.title, item.author, item.license].filter(Boolean).join(' · ');
    dialog.showModal();
  }
  function card(item) {
    const btn = element('button', item.type === 'folder' ? 'folder' : 'photo-card');
    btn.type = 'button';
    const label = item.name || item.title || 'Senza titolo';
    btn.dataset.search = (label + ' ' + (item.author || '')).toLocaleLowerCase('it');
    if (item.type === 'folder') {
      const icon = element('div', '', '▣');
      icon.setAttribute('aria-hidden', 'true');
      icon.style.fontSize = '45px';
      btn.append(icon, element('p', '', label), element('small', '', 'Apri cartella'));
      btn.onclick = () => enterFolder(item);
    } else {
      const image = document.createElement('img');
      image.src = item.preview;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.alt = item.alt || label;
      image.draggable = false;
      image.onerror = () => { image.onerror = null; image.style.display = 'none'; btn.prepend(element('p', '', 'Anteprima non disponibile')); };
      btn.append(image, element('p', '', label));
      if (item.author) btn.append(element('small', '', item.author + ' · ' + item.license));
      btn.onclick = () => openPhoto(item);
    }
    grid.append(btn);
  }
  function applyFilter() {
    const term = search.value.trim().toLocaleLowerCase('it');
    for (const item of grid.children) item.hidden = Boolean(term) && !item.dataset.search?.includes(term);
  }
  async function readCatalog(params) {
    const url = new URL(catalogUrl, window.location.origin);
    for (const [key, value] of Object.entries(params || {})) if (value) url.searchParams.set(key, value);
    const response = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    if (!response.ok) throw new Error('API HTTP ' + response.status);
    const result = await response.json();
    if (!result.ok) throw new Error('Catalogo non disponibile');
    return result;
  }
  async function loadMore() {
    if (busy) return;
    busy = true;
    more.disabled = true;
    status.textContent = 'Caricamento delle cartelle…';
    try {
      const params = currentFolder ? { folder: currentFolder.token, page: nextPage } : {};
      const result = await readCatalog(params);
      const items = currentFolder ? (result.items || []) : (result.roots || []);
      for (const item of items) card(item);
      nextPage = result.nextPage || null;
      more.hidden = !nextPage;
      empty.hidden = grid.children.length > 0;
      if (!empty.hidden) empty.textContent = 'Nessuna cartella o fotografia approvata trovata in questa pagina.';
      if (currentFolder && result.approvalsConfigured === false) {
        status.textContent = 'Le cartelle sono consultabili. Le fotografie richiedono la verifica dei diritti e un catalogo di autorizzazioni.';
      } else {
        status.textContent = grid.children.length + ' elementi caricati' + (nextPage ? ' · Altri elementi disponibili' : '');
      }
      applyFilter();
    } catch (_error) {
      status.textContent = 'Archivio non disponibile: collegamento privato da configurare o ripristinare.';
      if (!grid.children.length) { empty.hidden = false; empty.textContent = 'Non è stato possibile caricare il catalogo.'; }
    } finally {
      busy = false;
      more.disabled = false;
    }
  }
  async function enterFolder(item, index = null) {
    if (Number.isInteger(index)) trail = trail.slice(0, index + 1);
    else trail.push(item);
    currentFolder = trail[trail.length - 1];
    clear(); drawTrail();
    await loadMore();
  }
  async function showRoots() {
    trail = [];
    currentFolder = null;
    clear(); drawTrail();
    await loadMore();
  }
  home.onclick = showRoots;
  more.onclick = loadMore;
  search.oninput = applyFilter;
  close.onclick = () => dialog.close();
  dialog.onclick = (event) => { if (event.target === dialog) dialog.close(); };
  document.addEventListener('dragstart', (event) => {
    if (event.target instanceof HTMLImageElement) event.preventDefault();
  });
  document.addEventListener('contextmenu', (event) => {
    if (event.target instanceof HTMLImageElement) event.preventDefault();
  });
  showRoots();
})();
