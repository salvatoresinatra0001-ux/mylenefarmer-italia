# Cronologia dell'archivio MYLENE_FARMER - Full Sync 7.1

## Istantanea e perimetro

Il catalogo finale del **18 ottobre 2026 alle 13:04:54 UTC** sostituisce l'istantanea parziale dell'Audit 6.0. Il report registra 7599 asset Cloudinary e zero errori nel perimetro censito dall'esecuzione. I registri riconciliati contengono 5711 SHA-256 distinti e 1888 copie binarie ridondanti. Nessuna copia e' stata eliminata.

`final_report.json`, `catalog.csv` e `sync_state.json` del Full Sync 7.1 sono stati confrontati con il catalogo dell'Audit 6.0. I 5712 record di immagini Drive e i 5712 record di immagini dello ZIP rappresentano gli stessi insiemi di hash: non sono due fondi diversi. Questa riconciliazione confronta i registri; non esegue un nuovo download con ricalcolo degli hash delle immagini remote.

## Cronologia

Le cartelle originali, conservate nei registri di importazione, consentono di attribuire un anno di catalogazione a 5701 contenuti, distribuiti in 25 anni dal 1984 al 2008. Dieci contenuti restano senza anno. I nomi dei file e la data del nome ZIP non sono utilizzati per inventare date fotografiche.

| Periodo delle cartelle | Contenuti binari distinti |
|---|---:|
| 1984-1989 | 1528 |
| 1990-1999 | 2110 |
| 2000-2008 | 2063 |
| Senza anno | 10 |
| Totale | 5711 |

Gli anni di cartella non certificano la data di scatto. I decenni sono raggruppamenti di navigazione, non nomi di album, eventi o tour attribuiti automaticamente.

## Integrazione e riservatezza

`assets/data/archive-periods.json` contiene esclusivamente conteggi aggregati, anni e informazioni sul metodo. Non contiene URL di singole immagini, public ID, asset ID, hash individuali, credenziali, nomi di file o percorsi privati. Il frontend legge lo stesso file su GitHub Pages e Netlify; la funzione `cloudinary-periods` ne restituisce la medesima istantanea senza enumerare l'Admin API a ogni visita.

L'archivio fotografico unico mostra separatamente consistenza del fondo e fotografie pubblicate. La navigazione include una voce "Senza anno" per i contenuti non datati. Il proxy delle fotografie non viene modificato da questo aggiornamento.

## Pubblicazione delle immagini

Questo aggiornamento non cambia `data/cloudinary-approved.json` o `assets/data/cloudinary-gallery.json`, non certifica nuove licenze e non abilita automaticamente immagini alla distribuzione pubblica. Le fotografie gia' pubblicate restano disponibili. L'importazione e la pubblicazione sono operazioni distinte; il numero di asset non deve essere presentato come numero di fotografie visibili sul sito.
