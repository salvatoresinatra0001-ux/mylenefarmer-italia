# Verifica operativa — 19 ottobre 2026

Base della verifica: commit 757f9c620354dcbc20425f17a3dae1a6ac624037.
Architettura preservata: sito statico HTML/CSS/JavaScript, build Node, funzioni Netlify.

## Correzioni

- Catalogo Cloudinary: CORS limitato all'origine della preview GitHub Pages, sia per successo sia per errori JSON. Il catalogo mantiene i vincoli su autorizzazioni, crediti e lato corto minimo di 800 px.
- Tema AMOLED: fondo nero reale nei token condivisi e nel foglio finale che prevaleva sul tema; etichetta coerente nel selettore.
- Focus da tastiera visibile sul selettore tema.
- Pipeline di integrità: esecuzione dei test Node su archivio, diritti e catalogo prima della build.

## Evidenze locali

- Cinque test Node superati, comprese risposte CORS del catalogo disponibile e indisponibile.
- Build: 28 pagine HTML, 86 file pubblici, nessun collegamento locale mancante.
- Browser Chromium: 56 controlli pagina/viewport superati; ricerca, reset, lightbox e tastiera delle due gallerie funzionanti.
- Audit browser eseguito con immagini esterne simulate: non certifica disponibilità o qualità dei file remoti.
- Prove tema aggiuntive a 390 e 1440 px: preferenza sistema, passaggio al nero rgb(0,0,0), persistenza al reload e focus visibile superati dopo la correzione finale dei token.
- Sintassi JavaScript e diff verificati. Nessuna modifica agli originali fotografici.

## Stato degli ambienti e residui

| Ambiente | Evidenza / limite |
| --- | --- |
| Locale | Build e controlli sopra superati; nessuna certificazione completa WCAG o performance. |
| GitHub | Remote main verificato al commit base prima delle modifiche; SHA finale da riscontro del push. |
| GitHub Pages | Configurazione di pubblicazione presente; contenuto live non verificato in questa sessione. |
| Netlify | Configurazione build presente; nessun token disponibile nell'ambiente. Deploy e integrazione Git non verificati. |
| Dominio pubblico | Non verificato: rete gestita limitata, dominio non incluso nelle destinazioni consentite. |
| Cloudinary | Nessuna credenziale configurata; cartella MYLENE_FARMER e disponibilità degli asset non ispezionate. CORS testato localmente, non in produzione. |
| Drive | Nessun connettore disponibile; nessuna importazione eseguita. |

Il catalogo statico contiene sette fotografie Commons. Nessuna importazione delle oltre cento foto richieste è stata eseguita. Le autorizzazioni sulle immagini, l'accessibilità degli originali remoti e le fonti editoriali ancora aperte nel README restano da verificare. I test non risolvono tali requisiti editoriali.

Per completare la verifica esterna servono credenziali Cloudinary/Netlify nelle impostazioni protette e accesso di rete ai relativi servizi, al dominio pubblico e alla preview Pages. Non inserire segreti in chat o nel repository. Nessun DNS modificato.
