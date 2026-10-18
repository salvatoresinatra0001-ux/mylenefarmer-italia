# Mylène Farmer · Italia

Archivio italiano indipendente dedicato all'opera di Mylène Farmer. Front end statico in italiano; il sito non richiede dipendenze applicative e genera l'artefatto di pubblicazione con Node.js 22.
Cura editoriale: **Salvatore Sinatra**. Stato dei dati: **18 ottobre 2026**.

> Progetto editoriale indipendente, non affiliato all'artista, al management o alle etichette.

## Pubblicazione unificata

La directory di lavoro GitHub (branch `main`, file HTML/CSS/JS in radice) è la
fonte unica per le due destinazioni:

- **GitHub Pages**: `https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/`
- **Netlify**: progetto `mylenefarmer-italia`, dominio primario configurato `https://mylenefarmer.it/`

La build Netlify usa `netlify.toml` e `scripts/build-site.mjs` per generare
`dist/`. Il **deploy Netlify esistente è indipendente** finché non viene
eseguito il deploy della nuova build o attivata la sincronizzazione GitHub nel
pannello Netlify. Guida: [DEPLOY_NETLIFY_GITHUB.md](docs/DEPLOY_NETLIFY_GITHUB.md).

Non impostare `mylenefarmer.it` come dominio personalizzato di GitHub Pages:
è assegnato alla produzione Netlify. Prima di modificare DNS o redirezioni www,
confermare le risoluzioni effettive.

## Stato Master V.20

Il rapporto operativo con gli stati verificati e i prerequisiti aperti è in [MASTER_V20_COMPLETION.md](docs/MASTER_V20_COMPLETION.md). La ricerca globale dell’archivio è disponibile in [Cerca](cerca.html).

## Struttura

- `index.html` — Home
- `cerca.html` — Ricerca locale nell’indice editoriale
- `biografia.html` — Biografia
- `discografia.html` — Discografia
- `ascolta.html` — Ascolta
- `concerti.html` — Concerti
- `media.html` — Media
- `fonti.html` — Fonti e metodo
- `crediti-foto.html` — Crediti foto

Asset: `assets/css/style.css`, `assets/js/site.js`, `assets/img/favicon.svg`.
`.nojekyll` disattiva l'elaborazione Jekyll; `robots.txt` e `sitemap.xml` sono inclusi.

## Metodo editoriale

Tre livelli di solidità su ogni dato:

| Livello | Significato |
|---|---|
| **Solido** | Almeno due fonti indipendenti, o fonti primarie coerenti (sito ufficiale, etichetta, distributore) |
| **Una fonte** | Un solo riscontro; pubblicato ma non presentato come definitivo |
| **Incerto** | Fonti in conflitto o dato dedotto; le date si pubblicano solo come mese e anno |

Le diverse edizioni linguistiche della stessa enciclopedia contano come **una sola fonte**.
I metadati dei negozi digitali non sono fonte per le etichette.
La precisione della data (giorno / mese / anno) è un campo distinto dalla solidità.

## Immagini

La galleria pubblica comprende attualmente **7 fotografie** collegate alle rispettive
schede Wikimedia Commons, con autore e licenza riportati. Altre 12 schede sono escluse
dalla presentazione dopo revisione editoriale; 19 risorse candidate restano in ulteriore
verifica. I file binari del catalogo non sono ospitati nella repository.
La galleria HQ è una sezione editoriale distinta: l'audit di provenienza e qualità è in
[QUALITY_AUDIT.md](docs/QUALITY_AUDIT.md). Copertine, foto stampa e fotogrammi di
videoclip non sono automaticamente immagini libere.

## Controlli ancora aperti

- **Date degli album dal 1986 al 2025** — Riconfermare su Discogs e MusicBrainz per passare da «Una fonte» a «Solido».
- **«C'est à qui le tour»** — Risolvere il conflitto fra il 19 giugno 2026 e l'annuncio di stampa del 29 maggio 2026.
- **Tracklist di Égrégore** — Pubblicare l'elenco completo delle 13 tracce dopo l'uscita del 30 ottobre 2026.
- **Ruoli in Ghostland e Dalloway** — Verificare il ruolo effettivo su fonte di produzione o distribuzione.
- **Canali ufficiali** — Individuare e verificare sito, canale video e profili ufficiali attivi; finché non sono verificati non vengono linkati.
- **Immagini** — Verificare file per file autore, licenza e risoluzione su archivi liberi prima di qualunque pubblicazione fotografica.

## Modifiche

I contenuti sono scritti direttamente nell'HTML: per aggiornare un dato si modifica la riga
della tabella e, se cambia il livello di verifica, il relativo indicatore di solidità
(`<span class="sol s-solid|s-one|s-weak">`).

<!-- GitHub Pages: richiesta nuova pubblicazione dal branch main, 2026-10-16. -->


## Archivio fotografico 2026

Galleria documentata: sette fotografie attualmente pubblicate e attribuite; le altre schede sono conservate per revisione. Il dataset è in `assets/data/catalogo-fotografie-2026.json`; crediti e fonti in `docs/CATALOGO_FOTOGRAFICO_2026.md`. Le anteprime sono servite da Commons: i file binari delle fotografie non sono stati scaricati né incorporati nella repository.

## Edizione editoriale del 17 ottobre 2026

- Dossier [Égrégore: tracklist e autori](speciale-egregore-2026.html), 13 brani e filtri accessibili.
- Navigazione della homepage aggiornata, archivio fotografico e galleria HQ conservati.
- Metadati e URL canonici allineati al dominio primario Netlify; favicon corretta.
- Configurazione di build riproducibile Netlify con report dei collegamenti statici.


## Adaptive visual system

The production site includes a persistent accessible light/dark theme toggle, responsive editorial layouts, interactive photographic archive navigation, and Cloudinary delivery through the existing rights-reviewed proxy.
