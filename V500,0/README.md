# Mylène Farmer Italia — Interactive Edition V500.0

Questa cartella nella branch `main` contiene la **versione HTML multipagina navigabile** V500.0.

**URL pubblico GitHub Pages:** https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/V500,0/

## Struttura editoriale

- `index.html` — homepage V500.0
- `biografia.html`, `discografia.html`, `ascolta.html`, `concerti.html`, `media.html`, `news.html`
- `approfondimento.html` e tre dossier (30 capitoli)
- `cerca.html` e `assets/data/search-index.json` per la ricerca locale (58 voci)
- `archivio-testuale.html` e collegamenti di compatibilità delle precedenti sezioni fotografiche
- `note-legali.html`, `crediti-foto.html`, `404.html`, `speciale-egregore-2026.html`

Le risorse CSS, JavaScript, icone SVG e **sei banner editoriali** restano nella directory principale `assets/`, referenziata con il percorso `../assets/`. Nessuna duplicazione dell'archivio fotografico integrale o delle registrazioni musicali. I player utilizzano embed ufficiali Apple Music e Spotify.

## Pubblicazione

La pipeline `scripts/build-site.mjs` copia e controlla questa cartella nell'artefatto `dist/V500,0/`. La versione è navigabile senza Netlify e mantiene la root originale. Le pagine V500.0 usano `noindex,follow` e canonical alla rispettiva pagina principale per evitare duplicazioni SEO.

Validazioni automatiche:
- `node scripts/build-site.mjs`
- `node scripts/verify-v500.mjs`
- `python scripts/browser-v500.py --base http://127.0.0.1:8000/`

**Versione culturale fan indipendente** a cura di Salvatore Sinatra. Non affiliata all'artista, al management o alle etichette.

© 2026 Salvatore Sinatra.

## Unified Editorial Design V501.0
L'intero sottosito eredita header, tipografia, schede e banner fotografici 21:7 tramite la build condivisa. Le sei immagini WebP originarie restano intatte; nessuna IA sui soggetti. 
