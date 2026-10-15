# Mylène Farmer · Italia

Archivio italiano indipendente dedicato all'opera di Mylène Farmer. Sito statico in italiano, senza dipendenze, senza build step.
Cura editoriale: **Salvatore Sinatra**. Stato dei dati: **16 ottobre 2026**.

> Progetto editoriale indipendente, non affiliato all'artista, al management o alle etichette.

## Pubblicazione

Sito statico servito da GitHub Pages dal branch `main`, cartella radice.
Indirizzo: `https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/`

Per un dominio personalizzato (`mylenefarmer.it`): aggiungere un file `CNAME` con il dominio
e puntare il DNS a GitHub Pages. Non è stato aggiunto perché il DNS non è configurato.

## Struttura

- `index.html` — Home
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

Nessuna fotografia dell'artista è inclusa in questa versione: gli archivi a licenza libera non
erano raggiungibili in fase di compilazione. Gli spazi sono predisposti e dichiarati in
`crediti-foto.html`, che contiene anche le regole di inserimento e il formato della didascalia.
Copertine, foto stampa e fotogrammi di videoclip non sono immagini libere.

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
