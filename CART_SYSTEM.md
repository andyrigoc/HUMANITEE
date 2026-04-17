# HUMANITEE - Shopping Cart Persistence System

## Overview
Sistema di carrello persistente implementato con localStorage che mantiene gli articoli quando l'utente lascia e ritorna sul sito.

## Features

### ✓ Persistenza Dati
- **localStorage**: Salva automaticamente il carrello nel browser
- **Auto-recovery**: Ripristina il carrello al caricamento della pagina
- **Cross-tab sync**: Sincronizza il carrello tra tab aperte
- **Version control**: Sistema di versioning per gestire aggiornamenti futuri

### ✓ Gestione Carrello
- **Aggiungi prodotti**: Click su "Add to Cart" per aggiungere al carrello
- **Quantità**: Gestisci quantità con +/- o input diretto
- **Rimozione**: Rimuovi singoli articoli con il pulsante ×
- **Svuota carrello**: Pulsante "Clear Cart" per svuotare completamente
- **Duplicati**: Prodotti identici incrementano automaticamente la quantità

### ✓ UI Components
- **Cart Badge**: Mostra il numero totale di articoli nell'header
- **Cart Modal**: Pannello laterale slide-in per visualizzare e gestire il carrello
- **Visual Feedback**: Animazioni e feedback visivi per tutte le azioni

### ✓ Error Handling
- Validazione dei dati del prodotto
- Gestione errori localStorage (quota exceeded)
- Protezione contro dati corrotti
- Gestione limiti quantità (max 99 per articolo)

## Struttura File

```
HUMANITEE/
├── cart.js           # Sistema di gestione carrello
├── script.js         # Script principale (esistente)
├── index.html        # Pagina principale (aggiornata)
└── style.css         # Stili (aggiornati con cart UI)
```

## Implementazione

### 1. cart.js
Modulo autonomo che gestisce:
- Stato del carrello (items array)
- Operazioni CRUD (add, remove, update, clear)
- Persistenza localStorage
- Aggiornamenti UI
- Event handling

### 2. HTML Structure
**Header con Cart Button:**
```html
<button class="cart-btn" id="cartBtn">
  <svg>...</svg>
  <span class="cart-badge" id="cartBadge">0</span>
</button>
```

**Cart Modal:**
```html
<div class="cart-modal" id="cartModal">
  <div class="cart-modal-content">
    <div class="cart-header">...</div>
    <div class="cart-empty">...</div>
    <div class="cart-content">
      <div class="cart-items">...</div>
      <div class="cart-footer">...</div>
    </div>
  </div>
</div>
```

**Product Cards con Data Attributes:**
```html
<article class="product-card" 
  data-product-id="tee-black-001"
  data-product-name="Essential Tee"
  data-product-price="45.00"
  data-product-color="Black"
  data-product-size="M"
  data-product-image="ORIGIN.webp">
  ...
  <button class="btn btn-small">Add to Cart</button>
</article>
```

### 3. CSS Styling
- **Mobile-first**: Design ottimizzato per mobile
- **Responsive**: Adattamento automatico per tablet/desktop
- **Animations**: Transizioni smooth per apertura/chiusura modal
- **Accessibility**: Contrasti adeguati e feedback visivi

## API / Metodi Pubblici

Il carrello è accessibile globalmente tramite `window.humaniteeCart`:

```javascript
// Aggiungi un articolo
humaniteeCart.addItem({
  id: 'product-id',
  name: 'Product Name',
  price: 34.00,
  color: 'Black',
  size: 'M',
  image: 'image.webp'
});

// Rimuovi articolo (per indice)
humaniteeCart.removeItem(0);

// Aggiorna quantità
humaniteeCart.updateQuantity(0, 3);

// Svuota carrello
humaniteeCart.clearCart();

// Ottieni info
humaniteeCart.getTotalItems();      // Numero totale articoli
humaniteeCart.getTotalPrice();      // Prezzo totale
humaniteeCart.getItems();           // Array di articoli
humaniteeCart.isEmpty();            // true/false

// Controllo UI
humaniteeCart.openCart();
humaniteeCart.closeCart();
```

## Eventi Custom

Il sistema emette eventi che possono essere ascoltati:

```javascript
window.addEventListener('cartUpdated', (e) => {
  console.log('Cart updated:', e.detail);
  // e.detail = { itemCount, totalPrice, items }
});
```

## localStorage Schema

```json
{
  "version": "1.0",
  "items": [
    {
      "id": "tee-black-001",
      "name": "Essential Tee",
      "price": 45.00,
      "color": "Black",
      "size": "M",
      "image": "ORIGIN.webp",
      "quantity": 2,
      "addedAt": 1713369600000
    }
  ],
  "timestamp": 1713369600000
}
```

## Integrazione con Order Flow

Il carrello si integra con il sistema di ordini esistente:
- Click su "Proceed to Checkout" → reindirizza a `order.html`
- Gli articoli del carrello sono accessibili tramite `humaniteeCart.getItems()`
- Il carrello può essere svuotato dopo il completamento dell'ordine

## Browser Compatibility

- **localStorage support**: Tutti i browser moderni (IE11+)
- **Storage limit**: ~5-10MB (sufficiente per centinaia di prodotti)
- **Fallback**: Se localStorage non disponibile, il carrello funziona solo in sessione

## Testing

Per testare il sistema:

1. **Aggiungi prodotti**: Click su "Add to Cart" su vari prodotti
2. **Verifica badge**: Il badge nell'header mostra il conteggio corretto
3. **Apri carrello**: Click sull'icona carrello nell'header
4. **Modifica quantità**: Usa +/- o input diretto
5. **Rimuovi articoli**: Click sul pulsante × 
6. **Persistenza**: Chiudi e riapri la pagina → il carrello è conservato
7. **Cross-tab**: Apri in un'altra tab → modifiche sincronizzate
8. **Clear cart**: Svuota completamente il carrello

## Performance

- **Minimo impatto**: Le operazioni sono istantanee
- **Lazy loading**: Il carrello si carica solo quando necessario
- **Efficient storage**: JSON compatto per ridurre spazio
- **Debouncing**: Aggiornamenti UI ottimizzati

## Security Notes

- **XSS Protection**: Usa `textContent` invece di `innerHTML` dove possibile
- **Data Validation**: Tutti i dati sono validati prima di essere salvati
- **No sensitive data**: Non salvare mai dati sensibili nel localStorage
- **Sanitization**: I prezzi sono convertiti in float per prevenire injection

## Future Enhancements

Possibili miglioramenti futuri:
- [ ] Wishlist separata
- [ ] Carrelli salvati (login utente)
- [ ] Codici sconto
- [ ] Spedizione calcolata
- [ ] Export carrello (condivisione)
- [ ] Notifiche push (articoli in scadenza)
- [ ] Analytics tracking

## Support

Per problemi o domande:
- Verifica console browser per errori
- Controlla che localStorage sia abilitato
- Assicurati che i data attributes siano corretti sui product cards
- Verifica che cart.js sia caricato prima di script.js

---

**Implementato**: 17 Aprile 2026  
**Versione**: 1.0  
**Status**: ✅ Production Ready
