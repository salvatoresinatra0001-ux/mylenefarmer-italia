# MASTER PROMPT — Google Drive × GitHub × Netlify | Mylène Farmer Italia

**Progetto:** https://mylenefarmer.it · Repository `salvatoresinatra0001-ux/mylenefarmer-italia` · Sito Netlify `mylenefarmer-italia`.

## Missione
Completa l'integrazione fotografica senza scaricare gli originali sul Mac, senza caricarli come asset permanenti su GitHub o Netlify e senza sostituire l'attuale sito. Mantieni **Google Drive come archivio sorgente privato** e pubblica solo contenuti per cui sono stati verificati i diritti. Fai apparire al visitatore una galleria nativa, integrata e accessibile, senza link esterni a Drive o pulsanti di download.

## Ambito e origini
Considera **esclusivamente** i rami Google Drive collegati all'archivio Mylène Farmer, non l'intero Drive personale:
1. `MYLENE_FARMER` (include l'albero `mylenefarmer`, il materiale importato da mylene.net.ru e un file ZIP non navigabile come cartella).
2. `Mylène Farmer` (ritratti, concerti/live, fotografia storica, editoriali, catalogazione e fonti).
Rileva ricorsivamente tutti i livelli delle sottocartelle, ordinandoli per anno/categoria/nome. Non inventare quantità di foto: la dicitura «5712» in un nome storico non è un conteggio certificato. Scarta ZIP e file non-immagine dalle griglie, annotando gli archivi ZIP per una possibile estrazione separata autorizzata.

## Architettura obbligatoria
- **GitHub = codice sorgente**, layout, componenti, test, documentazione. Non committare originali fotografici, credenziali, URL OAuth, token, JSON sensibili o inventari interni non approvati.
- **Netlify = frontend e gateway server-side** (`netlify/functions`), con segreti solo nelle variabili d'ambiente lato Functions.
- **Drive = origine degli originali.** Autenticazione server-to-server con account di servizio Google (permesso Reader esplicito **solo** sulle due directory radice; mai impostare i file come pubblici per comodità).
- **Indice cartelle on demand:** supportare paginazione e sottocartelle annidate per evitare timeout su migliaia di elementi; non scaricare l'intero archivio ad ogni visita. Gestire cartelle vuote, errori 401/403/429/5xx, retry con backoff, caching controllato e stati di caricamento.
- **Proxy immagini:** immagini veicolate da endpoint di prima parte, ad es. `/api/mylene/photo?ref=TOKEN_OPACO`; il browser non riceve URL `drive.google.com`, ID file Google, token OAuth o credenziali. I token sono cifrati e validati lato server; il proxy verifica *a ogni richiesta* il diritto di pubblicazione. Nessuna API aperta per enumerare file estranei ai rami autorizzati.
- **Diritti:** pubblicazione preclusa per default. Concedere l'accesso all'immagine solo se un catalogo dei diritti protetto (mantenuto su Drive, non pubblicato) contiene una voce esplicitamente APPROVED con autore, titolo, licenza/autorizzazione e tracciabilità. Una semplice copia su Drive, o un disclaimer, **non** costituisce licenza.
- **Interfaccia:** pagina `archivio-drive.html` con indice radici/categorie, breadcrumb, filtro per cartelle, griglia responsive, lazy loading, accessibilità tastiera, focus, lightbox, crediti fotografici e collegamento alle note legali. Zero pulsanti di download e zero link esterni per l'immagine. Una funzione che disabilita click destro/drag è solo deterrente cosmetico.
- **Integrità dei file:** non spostare, rinominare, cancellare, condividere pubblicamente o modificare Drive. Non richiedere la pubblicazione dell'intero Drive personale.
- **Qualità:** mantenere l'aspect ratio, evitare upscaling artificiale, distinguere originali oltre il limite di streaming (Netlify documenta 20 MB per risposta streamed). Offrire fallback e segnalarne i limiti; niente promessa di fedeltà full resolution senza test.
- **Privacy:** non raccogliere dati personali superflui; non inserire analytics o cookie di profilazione senza informativa e base giuridica appropriate; prevenire leak da log, HTML, script e messaggi di errore.
- **Prestazioni:** evitare chiamate Drive in massa; paginazione server-side con token validati, caching di breve durata per catalogo/diritti, immagini lazy, no duplicazione permanente in repository.
- **Distribuzione:** modifiche su branch di lavoro, PR, validazione build Netlify (`node scripts/build-site.mjs`), verifica che il codice Functions non sia copiato dentro `dist`, test API e immagini approvate, solo dopo merge in `main` e verifica deploy HTTPS su `mylenefarmer.it`.
- **Sicurezza:** utilizzare minimo privilegio, Content-Type e X-Content-Type-Options corretti, risposta fail-closed, chiavi private solo su Netlify, niente segreti nel client e niente redirect aperti. I token first-party rendono gli URL Google non visibili, **ma non rendono impossibile copiare le immagini dal browser**.

## Parametri di implementazione
Variabili server-side consigliate:
- `MF_DRIVE_SERVICE_ACCOUNT_JSON`: JSON completo delle credenziali Google Service Account, impostato in Netlify e non nel repo.
- `MF_DRIVE_ROOTS_JSON`: array di oggetti `{id,label}` con le due radici **di Mylène Farmer**.
- `MF_DRIVE_RIGHTS_MANIFEST_ID`: ID del file JSON privato su Drive con l'allowlist `{version:1,items:{FILE_ID:{status:"approved",author:"...",license:"...",title:"...",source:"...",authorization:"..."}}}`.

La struttura degli strumenti puo' essere raffinata se la quota API, i limiti Netlify e la sicurezza lo richiedono, a condizione di documentare scelte e prove.

## Procedura di completamento
1. Verificare le cartelle radice e gli accessi; enumerare le sottocartelle con paginazione e campionare formato, dimensioni, autorizzazioni.
2. Creare un account di servizio dedicato tramite Google Cloud; condividere manualmente con lui **solo** le due radici con permesso Viewer. Nessun permesso `anyoneWithLink`.
3. Creare e compilare su Drive il catalogo **privato** dei diritti; lasciare non pubblicate tutte le voci non approvate, incluse quelle prive di provenienza.
4. Inserire i segreti nell'ambiente Netlify (Functions). Verificare il collegamento con una richiesta metadata prima di tentare lo streaming.
5. Eseguire test automatizzati: radici autorizzate, pagina di risultati, paginazione, nested folders, 403 sui file non approvati, token falsi, limiti payload, trattamento retry.
6. Validare `archivio-drive.html` e l'integrazione con `galleria-hq.html`, `archivio-fotografico.html`, `crediti-foto.html`, `note-legali.html` senza perdere il patrimonio editoriale esistente.
7. Generare anteprima Netlify del branch; verificare su smartphone e desktop; non attivare produzione finché credenziali e rights manifest non sono operativi.
8. Unire la PR e confermare che `mylenefarmer.it` serva pagine, cartelle e almeno una fotografia **legittimamente approvata** dal gateway, senza esposizione dei link Drive.
9. Documentare conteggi **realmente misurati**, cartelle sincronizzate, foto approvate/pubblicate/non pubblicate, errori e limiti di banda/costo.

## Criteri di accettazione
- Tutte le sottocartelle **nell'ambito definito** sono esplorabili con pagina dopo pagina, senza copie fotografiche nel deploy.
- Le immagini con permesso approvato si vedono direttamente nell'interfaccia e in lightbox, con crediti corretti.
- Le immagini non approvate non sono servite, nemmeno indovinando URL o manipolando token.
- Nessun ID file o link diretto Drive compare nei dati pubblici e nessun segreto viene mai serializzato nel codice client.
- Il sito conserva il proprio impianto editoriale e la pubblicazione GitHub→Netlify continua a funzionare.
- Mancanza di credenziali o autorizzazioni = messaggio diagnostico sicuro e **nessuna fotografia privata esposta**.
- Spiegare esplicitamente che disabilitare il download nell'interfaccia non impedisce catture schermo o copie tramite strumenti del browser.

## Stato di partenza
È presente la bozza PR #3 `integration/legal-notice-2026-10`: `note-legali.html`, `archivio-drive.html`, `data/drive-gallery.json` e collegamento nella homepage. La vecchia `drive-gallery.json` è un *manifest vuoto provvisorio*, non una sincronizzazione reale. Sostituire l'approccio a URL pubblici con un gateway privato, preservando le pagine e le fotografie già legittimamente incluse nel resto del sito.

**Direzione editoriale:** minimale, museale, leggibile, alta qualità fotografica, colori neutri con accent red discreto. Curatela e direzione creativa: Salvatore Sinatra; URL professionale: https://www.salvatoresinatraphotography.it.
