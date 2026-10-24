# Mylène Farmer Italia · GitHub Pages — AMOLED V16

Progetto culturale indipendente rivolto al pubblico italiano, dedicato alla discografia e alla ricerca artistica su Mylène Farmer. Non affiliato all'artista, al management o alle etichette.

**Sito pubblico GitHub Pages:** https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/

**Pubblicazione attiva per questa revisione:** soltanto GitHub Pages. Non eseguire aggiornamenti manuali o deploy di questa revisione su Netlify. La configurazione Netlify preesistente è conservata ma non è un obiettivo operativo.

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
La pipeline `.github/workflows/deploy-pages.yml` costruisce `dist/` tramite Node.js 22 e `scripts/build-site.mjs`; GitHub Pages pubblica il risultato. Le modifiche alla presente versione usano `[skip netlify]` nei commit affinché non attivino la vecchia pipeline Netlify.

Gli ascolti sono incorporamenti di servizi terzi: anteprime, disponibilità e riproduzione completa possono variare per territorio e abbonamento. Le immagini e i diritti delle opere rimangono dei rispettivi titolari.

© 2026 — progetto indipendente, a cura di Salvatore Sinatra.
