# Revisione editoriale della selezione Commons

Richiesta del curatore: rimuovere le fotografie di qualita insufficiente gia pubblicate prima di integrare il fondo Cloudinary.

## Ambito

Sono ritirate dalla presentazione 12 delle 19 fotografie Commons esistenti. La valutazione riguarda la resa visiva nella pagina (leggibilita del soggetto, distanza, riprese di schermi, grana evidente e scatti ridondanti meno puliti), non la liceita o il valore documentale delle opere. Non e una classificazione automatica della qualita di Wikimedia Commons e non equivale ad analisi forense dei file originali.

ID esclusi: MF-2026-001, MF-2026-003, MF-2026-004, MF-2026-005, MF-2026-006, MF-2026-007, MF-2026-010, MF-2026-013, MF-2026-014, MF-2026-016, MF-2026-018, MF-2026-019.

ID mantenuti: MF-2026-002, MF-2026-008, MF-2026-009, MF-2026-011, MF-2026-012, MF-2026-015, MF-2026-017.

La lista esplicita in scripts/photo-quality.mjs filtra il catalogo prima della generazione. La stessa procedura rimuove i riusi nelle pagine storiche, nelle copertine HTML, nei metadati social e negli sfondi CSS. La vecchia copertina viene sostituita dalla sola impaginazione grafica, non da una fotografia inventata.

## Conservazione

Nessun originale Cloudinary o Drive viene modificato, ricaricato o eliminato. Il catalogo sorgente con attribuzioni e licenze resta nel repository per tracciabilita. Solo il catalogo distribuito nel sito omette le schede ritirate. I sette scatti mantenuti conservano i crediti e la lightbox. L'elenco delle autorizzazioni Cloudinary non viene modificato.

La revisione e reversibile tramite la lista editoriale e viene applicata a ogni build condivisa da GitHub Pages e Netlify, affinche le fotografie ritirate non riappaiano al deploy successivo.
