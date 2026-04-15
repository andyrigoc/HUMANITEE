# HUMANITEE - Deploy su Netlify


## File necessari per il deploy:
- index.html (pagina principale)
- style.css (stili)
- script.js (JavaScript principale)
- order.html, order.css, order.js (pagina ordini)
- ORIGIN.png (immagine prodotto)
- paypal.png, opayo.png, card.png (icone metodi di pagamento)
- data/users.json (dati utenti)
- netlify.toml (configurazione Netlify)

## Istruzioni:
1. Crea un nuovo sito su Netlify
2. Collega il repository GitHub oppure carica la cartella tramite drag & drop
3. Build settings: lascia vuoto (sito statico)
4. Publish directory: . (root)
5. Deploy!

## Note:
- Il sito è completamente statico (HTML, CSS, JS)
- server.js non è necessario per il deploy su Netlify
- I dati utenti sono salvati in data/users.json
