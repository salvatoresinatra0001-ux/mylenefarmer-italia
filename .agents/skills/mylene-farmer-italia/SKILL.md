---
name: mylene-farmer-italia
description: Gestire e sviluppare il progetto web editoriale Mylène Farmer Italia con Codex, GitHub, Netlify e archivio Cloudinary. Usare per inizializzazione, audit, sviluppo HTML/CSS/JS, revisione accessibilità, gallerie fotografiche, controllo deploy e sincronizzazione verificata dei siti.
---
# Mylène Farmer Italia — Codex Operating Skill

## Identità
- Progetto: Mylène Farmer Italia, archivio editoriale indipendente non ufficiale.
- Repository previsto: `salvatoresinatra0001-ux/mylenefarmer-italia`.
- Preview GitHub Pages: `https://salvatoresinatra0001-ux.github.io/mylenefarmer-italia/`.
- Netlify: `https://mylenefarmer-italia.netlify.app`.
- Dominio da verificare: `www.mylenefarmer.it`.
- Cloudinary: cartella logica `MYLENE_FARMER/`; cloud name e credenziali solo da ambiente.
- Responsabile editoriale: Salvatore Sinatra.

## Avvio obbligatorio
1. Leggere `AGENTS.md`, `README.md`, `package.json`, configurazioni di build, Netlify e GitHub Actions se presenti.
2. Eseguire `git status --short`, `git remote -v`, `git branch --show-current`, inventario dei file e verifica delle dipendenze.
3. Non assumere che un deploy sia riuscito; distinguere codice locale, commit, push, deploy e dominio live.
4. Produrre piano sintetico e implementare in modo incrementale, mantenendo le modifiche pregresse.
5. Prima di pubblicare, eseguire build, test e controllo dei collegamenti, accessibilità, responsività e performance.

## Direzione creativa
- Layout editoriale minimale e museale, griglia rigorosa, tipografia elegante e leggibile.
- Tema Light e tema AMOLED Dark (#000000), selettore visibile dalla home, persistente, accessibile e rispettoso di `prefers-color-scheme`.
- Non introdurre sigilli geometrici decorativi o watermark invasivi.
- Fotografie originali mai alterate; usare derivati solo per visualizzazione e mantenere originale intatto.
- Archivio fotografico unico con filtri per anno, periodo, serie, didascalia, metadata e disclaimer per immagine.
- Lazy loading, `srcset`, dimensioni dichiarate, lightbox con tastiera e chiusura Escape.
- Nessuna immagine fittizia o URL Cloudinary inventato. Non pubblicare foto senza autorizzazione e provenienza documentata.

## Contenuti e qualità
- Distinguere dati verificati, interpretazioni editoriali e informazioni mancanti.
- Evitare biografie, date, crediti, tracklist o diritti d'autore inventati.
- Separare contenuti originali da materiali di terzi; usare attribuzioni e link a fonti autorizzate.
- Integrare discografia e servizi musicali solo tramite embed ufficiali consentiti e verificati.
- HTML semantico, WCAG 2.2 AA come obiettivo, SEO, Open Graph, sitemap, robots, CSP compatibile.
- Non inserire segreti, token o chiavi private nel frontend o nel repository.

## Workflow di rilascio
1. Creare branch di lavoro se appropriato; salvare lo stato iniziale.
2. Modificare file minimi necessari e verificare diff.
3. Eseguire script di test esistenti; se assenti, aggiungere controlli non distruttivi.
4. Verificare configurazione GitHub/Netlify prima di push o deploy.
5. Richiedere autorizzazione esplicita per pubblicazione se non già concessa nella richiesta.
6. Dopo deploy, confrontare commit SHA, URL live, status HTTP e contenuto effettivamente servito.
7. Riportare tabella stato: locale, GitHub, Netlify, dominio, Cloudinary, test; usare `non verificato` quando mancano prove.

## Comandi di avvio
Eseguire dalla radice del repository. Gli script sono inclusi nella cartella della skill, non nella cartella `scripts/` del sito. Il bootstrap riceve esplicitamente il repository esistente per evitare cloni involontari.

- `bash .agents/skills/mylene-farmer-italia/scripts/audit.sh` per un audit locale senza modifiche.
- `bash .agents/skills/mylene-farmer-italia/scripts/bootstrap.sh "$PWD"` per predisporre un clone sicuro o aprire il repository esistente.

## Limiti
Non eliminare archivi, riscrivere la storia Git, forzare push, sovrascrivere `.env`, modificare DNS o pubblicare automaticamente senza conferma. In caso di accesso mancante, fornire istruzioni precise e dichiarare ciò che non è stato eseguito.
