# Master V.20 — stato verificabile del progetto

Aggiornato il 18 ottobre 2026. Questo rapporto interpreta il documento `MYLENEFARMER_0_A.rtf` come specifica richiesta, non come prova di operazioni già eseguite. Il criterio di completamento resta quello del documento: ogni stato riflette evidenze disponibili in repository o nell'ambiente corrente.

## Stato delle aree

| Area | Stato | Evidenza / dipendenza residua |
|---|---|---|
| Repository GitHub | **VERIFICATO** | `origin/main` coincide con `7a7ff11`; commit contiene la build del sito e la skill di manutenzione. Il branch di lavoro locale è `work`. |
| Build statica | **VERIFICATO** | `node scripts/build-site.mjs` genera un artefatto `dist/` unico per Netlify e GitHub Pages, filtra file privati e controlla i link locali. |
| Navigazione e ricerca | **PARZIALE** | Pagine esistenti collegate dalla navigazione; aggiunto indice globale locale, con ricerca, filtro per sezione e query URL condivisibile. Non è un motore di ricerca full-text dell'intero testo di ogni pagina. |
| Biografia | **PARZIALE** | Percorso e capitoli presenti; restano verifiche editoriali annotate in README e `fonti.html`. |
| Discografia | **PARZIALE** | Archivio navigabile; date, edizioni, crediti e alcune attribuzioni richiedono ulteriori fonti indipendenti. |
| Fotografie pubbliche | **VERIFICATO** (catalogo build) | La build applica la revisione qualità e pubblica 7 immagini Commons attribuite; 12 schede restano escluse e 19 candidate non sono pubblicabili senza ulteriore revisione. Le immagini remote non sono state ricontrollate live in questo ambiente. |
| Cloudinary | **BLOCCATO** | Catalogo approvato vuoto; nessuna credenziale Cloudinary disponibile nell'ambiente. Nessun upload o asset viene autorizzato per deduzione. |
| Netlify / dominio | **BLOCCATO** | Il repository contiene configurazione `node scripts/build-site.mjs` → `dist/`, ma non è disponibile una credenziale Netlify per interrogare o distribuire il progetto. Dominio e produzione non verificati da questo ambiente. |
| Lingue FR/EN/DE/ES/RU | **NON ESEGUITO** | Nessuna traduzione revisionata disponibile. La sola lingua editoriale pubblicata è italiano; non vengono create traduzioni automatiche come se fossero definitive. |
| SEO tecnico | **PARZIALE** | Canonical, sitemap, robots e metadati presenti; hreflang non pertinente finché mancano versioni localizzate corrispondenti. |
| Accessibilità | **PARZIALE** | Navigazione tastiera, stati responsive e audit browser precedente documentati; il target WCAG 2.2 AA non è certificato da questo rapporto. |
| Prestazioni reali | **NON VERIFICATO** | Non sono disponibili misure Core Web Vitals sul dominio di produzione in questo ambiente. |
| Sicurezza | **PARZIALE** | La build esclude credenziali e dati approvativi dal pacchetto pubblico e sono presenti header essenziali; restano controlli di account, permessi e deploy fuori repository. |
| Backup e rollback | **VERIFICATO** | Sono presenti branch remoti di backup e preview; i deployment Netlify non sono stati ispezionati. |

## Modifiche di consolidamento

- `cerca.html` e `assets/js/search.js` forniscono una ricerca interna senza dipendenze esterne; `assets/data/search-index.json` elenca solo pagine esistenti.
- Le voci di ricerca sono condivisibili tramite parametri `q` e `tipo`.
- Il link Cerca è stato aggiunto alla navigazione delle pagine principali e la pagina è inclusa nella sitemap.
- Il conteggio fotografico pubblico si riferisce alla build che applica `scripts/photo-quality.mjs`: sette immagini. Il catalogo sorgente di 19 schede non equivale al numero di fotografie mostrate.

## Prossimi prerequisiti per il completamento totale

1. Collegare/verificare il progetto Netlify `mylenefarmer-italia` con deploy GitHub da `main`, build `node scripts/build-site.mjs`, publish `dist`; poi distribuire e verificare anteprima e dominio.
2. Aggiungere credenziali Cloudinary nei segreti GitHub Actions e nelle variabili runtime Netlify; approvare singolarmente soltanto asset con prova dei diritti.
3. Risolvere i punti fattuali in README e nelle pagine Fonti, usando fonti primarie o indipendenti.
4. Commissionare o fornire traduzioni editoriali revisionate; quindi creare URL localizzati, hreflang e metadati coerenti.
5. Eseguire audit live di browser, accessibilità e Core Web Vitals dopo il deploy.
