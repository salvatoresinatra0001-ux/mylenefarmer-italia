# Mylène Farmer Italia · GitHub Pages — Unified Editorial V501

## Unified Editorial Design V501.0
Tutte le pagine della root e del sottosito V500,0 usano ora un design unificato, con navigazione identica, tipografia editoriale AMOLED Black e banner fotografici in rapporto 21:7. Sei fotografie composite WebP già approvate a 7680x3291 vengono **solo visualizzate** tramite CSS: originali invariati, nessun ritocco IA, nessuna alterazione dei volti. La UI è generata staticamente durante la build, conservando il contenuto editoriale e i player musicali ufficiali.


## Interactive Edition V500.0 — pubblicata e preservata
La V500.0 conserva la base V16 e aggiunge ricerca rapida globale (Ctrl/⌘+K o /), indice esteso a 12 album accertati e 30 capitoli, filtri per tipologia e decennio nella discografia, avanzamento tra capitoli e ripresa della lettura locale. Moduli nuovi: `assets/js/interactive-v500.js` e `assets/css/interactive-v500.css`. Le funzioni sono progressive: i contenuti restano consultabili senza JavaScript.

**Stato:** V500.0 e sottosito `/V500,0/` pubblicati su GitHub Pages. La stessa build statica `dist/` deve essere pubblicata su Netlify per `www.mylenefarmer.it`; l'allineamento del deploy va verificato sul commit di `main`.

**Privacy:** il segnalibro di lettura usa esclusivamente `localStorage` nel browser del visitatore; non trasmette cronologie, non introduce cookie di tracciamento o registrazioni. **Streaming:** riproduzione, accesso territoriale e autenticazione sono gestiti dai fornitori ufficiali; nessun autoplay. **Diritti:** resta attivo il filtro dei sei banner consentiti; nessuna importazione delle fotografie d'archivio.

**Verifica:** `node scripts/build-site.mjs`, `node --test tests/*.test.mjs`, `node scripts/verify-v500.mjs`, `python scripts/browser-v500.py --base http://127.0.0.1:8000/` (dopo aver avviato un server HTTP locale in `dist/`).

Progetto culturale indipendente rivolto al pubblico italiano, dedicato alla discografia e alla ricerca artistica su Mylène Farmer. Non affiliato all'artista, al management o alle etichette.

**Sito pubblico GitHub Pages:** https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/

**Pubblicazione prevista per questa revisione:** GitHub Pages e Netlify condividono lo stesso artefatto statico, generato con `node scripts/build-site.mjs` e pubblicato dalla cartella `dist/`. Il sito GitHub Pages è il riferimento visivo e funzionale; Netlify pubblica la stessa revisione per il dominio personalizzato `www.mylenefarmer.it`. Non modificare contenuti, temi o asset specificamente per un host.

## Architettura e navigazione
- **Home** — introduzione all'archivio e collegamenti ai principali percorsi
- **Biografia** — cronologia e identità artistica
- **Discografia** — album in studio, live, raccolte, singoli e **13 player Apple Music**, con possibilità di selezionare brani e anteprime
- **Ascolta** — Spotify in pagina e collegamenti Apple Music, Qobuz, Deezer e YouTube Music
- **Approfondimenti** — hub di tre dossier interattivi e trenta capitoli
- **Concerti**, **Media**, **News**, **Ultimo album**, **Cerca**, **Note legali**
- **Archivio testuale** — riferimenti e cronologie senza caricamento massivo dell'archivio fotografico

Le pagine dedicate alle fonti e ai riferimenti bibliografici restano conservate nel codice storico ma **non sono pubblicate** nella build GitHub Pages e sono escluse dalla navigazione. Le piattaforme musicali si consultano tramite **Ascolta**.

## Aspetto grafico
Tema **AMOLED Black totale**, senza interruttore Light/Dark:
- fondo #000, contenuti e lettori in superfici scure
- contrasto leggibile, dettagli bordeaux, tipografia editoriale, navigazione Compact Mac
- banner di sezione originali; sei WebP selezionati 21:9 (7680 × 3291) e alternative SVG scure
- nessun caricamento integrale dell'archivio fotografico: il materiale di origine non viene importato in produzione

## Pubblicazione
La pipeline `.github/workflows/deploy-pages.yml` costruisce `dist/` tramite Node.js 22 e `scripts/build-site.mjs`; GitHub Pages pubblica il risultato. Le nuove modifiche devono attivare la pipeline Netlify associata al branch `main` (senza direttive di esclusione nei messaggi di commit). La configurazione `netlify.toml` utilizza la medesima build `node scripts/build-site.mjs` e pubblica `dist/`; i deployment vanno confrontati tramite commit SHA.

Gli ascolti sono incorporamenti di servizi terzi: anteprime, disponibilità e riproduzione completa possono variare per territorio e abbonamento. Le immagini e i diritti delle opere rimangono dei rispettivi titolari.

© 2026 — progetto indipendente, a cura di Salvatore Sinatra.
