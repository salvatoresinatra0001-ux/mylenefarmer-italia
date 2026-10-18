# Mylène Farmer Italia — pubblicazione unificata

**Fonte unica:** repository `salvatoresinatra0001-ux/mylenefarmer-italia`, branch `main`.
**Produzione Netlify:** site ID `16d15b68-e636-4c49-a6f0-b5f91c2b8d93`.
**GitHub Pages:** resta sul branch `main` con pubblicazione dalla radice.
**Dominio primario previsto:** `mylenefarmer.it` (configurato sul progetto Netlify).

## Architettura

Il sito HTML/CSS/JS resta a radice per GitHub Pages. Netlify esegue
`node scripts/build-site.mjs` e pubblica la cartella generata `dist/`.
Questo esclude repository internals, research e script dal sito, mantenendo
tutte le risorse web e il documento di qualità fotografica collegato dalla galleria.

**Attenzione:** un deploy Netlify autonomo (manuale/drag-and-drop) non diventa
automaticamente un deploy da GitHub. La connessione continuativa del repository
si abilita nel pannello Netlify in Project configuration / Build & deploy /
Continuous deployment, scegliendo il repository esatto e il branch `main`.
Impostazioni repository: base vuota, build command `node scripts/build-site.mjs`,
publish directory `dist` (oppure lasciare lettura di `netlify.toml`).
Verificare il diff prima di sostituire la produzione, conservare il deploy
precedente come punto di rollback.

## Comando macOS senza token nel sorgente

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/salvatoresinatra0001-ux/mylenefarmer-italia/main/scripts/deploy-netlify.sh)
```

Lo script crea solo una cartella temporanea, scarica GitHub, costruisce `dist`,
controlla i collegamenti e richiede il login Netlify quando serve. Non usa
`sudo`, non elimina cartelle dell'utente e non registra token nella repository.

## Controlli dopo il deploy

1. Verificare HTTPS e home sul dominio `mylenefarmer.it`.
2. Aprire `/galleria-hq.html`, `/archivio-fotografico.html`,
   `/speciale-egregore-2026.html`, `/biografia.html`, `/discografia.html`.
3. Confermare immagini, qualità e licenze delle sette fotografie pubblicate.
4. Verificare navigazione mobile, favicon, redirect www/apex (solo dopo audit DNS).
5. Confrontare sitemap, robots e URL canonici e leggere i log Netlify.

Non è stato aggiunto un file `CNAME` per GitHub Pages: il dominio principale
è già configurato sul progetto Netlify. Le immagini esterne restano soggette
a disponibilità di Wikimedia Commons o alle rispettive fonti autorizzate.

**Limiti di verifica:** questo file non è prova di deploy né di collegamento
automatico della build a GitHub; entrambi vanno verificati sul pannello Netlify.
