# Cronologia recuperata dell'archivio MYLENE_FARMER

## Origine dei dati

La cronologia proviene dai nomi delle cartelle originali presenti nei registri di importazione `upload_state.json` e `recovery_state_v4.json`. I record sono stati collegati al `catalogo_completo.csv` dell'Audit 6.0 tramite identificativo dell'asset e poi raggruppati per SHA-256. Tutti i 3794 asset dell'audit hanno una corrispondenza; nessun gruppo binario presenta anni discordanti.

Il risultato riguarda il campione verificato il **18 ottobre 2026 alle 10:24:58 UTC**: 3794 asset, 1906 contenuti binari distinti, 1888 copie ridondanti, 25 anni di catalogazione dal 1984 al 2008. Non sono date di scatto certificate. I decenni sono raggruppamenti di navigazione, non nomi di tournée o album inventati.

## Pubblicazione

`assets/data/archive-periods.json` contiene esclusivamente conteggi aggregati e anni. Non contiene URL Cloudinary, public ID, asset ID, hash individuali, credenziali, nomi di file o percorsi privati. La galleria legge lo stesso file statico su GitHub Pages e Netlify, senza chiamate Admin API ad ogni visita.

La funzione `cloudinary-periods` conserva un endpoint compatibile che restituisce la stessa istantanea aggregata. Non è più presentata come scansione in tempo reale delle sottocartelle Cloudinary: l'importazione originale le aveva appiattite.

La fotografia pubblicata e il contenuto archiviato restano distinti. Questi dati non modificano il registro delle autorizzazioni, non creano upload e non eliminano duplicati. La galleria continua a richiedere l'approvazione delle singole fotografie Cloudinary.

## Limiti

Il checkpoint Full Sync 7.1 consultato successivamente contiene trasferimenti aggiuntivi, ma non è un report finale. Tali trasferimenti non sono inclusi nei conteggi di questa istantanea. Il completamento dell'intero archivio Drive e la pubblicazione delle sue fotografie non sono certificati da questo documento.
