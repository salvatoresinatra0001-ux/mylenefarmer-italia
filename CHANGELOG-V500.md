# Interactive Edition V500.0 — Changelog
Data: 24 ottobre 2026. Stato: **proposta di Pull Request, non release in produzione**.

## Migliorie
- Ricerca globale in dialog accessibile con scorciatoie / e Ctrl/⌘+K; indice locale ampliato (12 album verificati, 30 capitoli, pagine editoriali) e ricerca senza distinzione di accenti.
- Filtri discografia per tipologia e decennio, contatore in tempo reale, preservando le tabelle e i player esistenti.
- Navigazione verso capitolo successivo e ripresa lettura nel browser mediante localStorage; nessuna sincronizzazione remota.
- Caricamento lazy degli iframe, rispetto del movimento ridotto e layout responsive AMOLED Black.
- Canonical e Open Graph dell'artefatto statico coerenti con GitHub Pages, senza modificare DNS o dominio.
- Pulizia di due riferimenti editoriali incompleti/non pubblicati in Home e Cerca.
- Test Node per integrità di build e indice; smoke browser Playwright per ricerca, filtri e navigazione.

## Limiti e confini
- Nessun contenuto audiovisivo aggiunto e nessun embed musicale non autorizzato. I servizi musicali decidono disponibilità e riproduzione.
- Égrégore rimane classificato come dossier preliminare, non pubblicazione confermata.
- Non eseguire alcun deploy Netlify. Pubblicazione GitHub Pages solo dopo merge revisionato su main.
- Il dominio www.mylenefarmer.it richiede verifica indipendente: non è attestata la corrispondenza con GitHub Pages.
