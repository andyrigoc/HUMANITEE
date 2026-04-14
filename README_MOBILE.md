# HUMANITEE — Mobile-First Landing Page

## 🎯 Overview
Premium minimal landing page per brand fashion/apparel, progettato con approccio **mobile-first**.

## 📱 Design Philosophy
- **Mobile-first**: il design parte da mobile (375px-430px) e scala verso l'alto
- **Single HTML**: un'unica struttura HTML per tutti i dispositivi
- **Semantic**: HTML5 semantico e accessibile
- **Performance**: CSS e JS ottimizzati, zero framework
- **Touch-optimized**: tap target minimo 48px, spacing ottimizzato per thumb

## 🗂️ File Structure
```
HUMANITEE/
├── index.html              ← Nuova versione mobile-first
├── style.css               ← CSS mobile-first completo
├── script.js               ← JavaScript minimale
├── index_backup.html       ← Backup versione precedente
├── style_backup.css        ← Backup CSS precedente
├── script_backup.js        ← Backup JS precedente
├── VALIDATION.md           ← Checklist validazione
└── ORIGIN.png              ← Immagine prodotto
```

## 📐 Breakpoints
```css
Mobile:     0px - 767px      (base styles)
Tablet:     768px+           (@media min-width: 48rem)
Desktop:    1024px+          (@media min-width: 64rem)
Large:      1440px+          (@media min-width: 90rem)
```

## 🎨 Design Tokens
```css
/* Colors */
--color-bg:      #ffffff
--color-text:    #0a0a0a
--color-muted:   #6f6f6f
--color-border:  #e9e9e9
--color-soft:    #f6f6f6

/* Spacing Scale */
--spacing-xs:    0.5rem    (8px)
--spacing-sm:    1rem      (16px)
--spacing-md:    1.5rem    (24px)
--spacing-lg:    2rem      (32px)
--spacing-xl:    3rem      (48px)
--spacing-2xl:   4rem      (64px)

/* Border Radius */
--radius-sm:     0.5rem    (8px)
--radius-md:     1rem      (16px)
--radius-lg:     1.5rem    (24px)
--radius-full:   999px
```

## 📄 Page Sections

### 1. Header
- Sticky positioning
- Logo + nav links
- Hamburger menu su mobile
- Backdrop blur effect

### 2. Hero
- Titolo principale
- Descrizione
- 2 CTA buttons
- Meta tags
- Immagine prodotto con drop-shadow

### 3. Featured Categories
- 2 card (T-Shirts, Heavy Tees)
- Hover effect su desktop
- Active state su mobile

### 4. Products Grid
- 4 prodotti
- Immagine + info
- Badge opzionali
- Add to cart button

### 5. Brand Statement
- Headline
- Descrizione brand

### 6. Newsletter
- Form email
- Submit button
- Success message

### 7. Footer
- 4 colonne info
- Social links
- Copyright

## 🚀 Features

### Mobile
- ✅ Hamburger menu animato
- ✅ Layout single column
- ✅ Touch-optimized buttons
- ✅ Full-width CTA
- ✅ Easy thumb reach

### Desktop
- ✅ Horizontal navigation
- ✅ Multi-column grids
- ✅ Hover effects (solo su dispositivi hover)
- ✅ Wider container (1280px max)

### JavaScript
- ✅ Mobile menu toggle
- ✅ Smooth scroll
- ✅ Active nav highlighting
- ✅ Newsletter form
- ✅ Add to cart feedback
- ✅ Auto-close menu

## ✨ Best Practices

### CSS
- CSS Variables per theming
- Mobile-first approach
- Solo min-width queries
- No fixed heights
- Flexbox e Grid
- Hardware-accelerated transforms

### HTML
- Semantic tags
- Proper heading hierarchy
- ARIA labels
- Form accessibility

### Performance
- Minimal, organized CSS
- Lightweight JS (IIFE pattern)
- No external dependencies
- Content-visibility per images
- Lazy load ready

## 🔧 Customization

### Cambiare colori
Modifica le variabili in `:root` nel file `style.css`:
```css
:root {
  --color-bg: #ffffff;
  --color-text: #0a0a0a;
  /* etc... */
}
```

### Aggiungere prodotti
Duplica un `.product-card` in `index.html` e modifica contenuto.

### Modificare spacing
Usa le variabili spacing esistenti:
```css
padding: var(--spacing-md);
margin-bottom: var(--spacing-lg);
```

## ✅ Validation
Vedi [VALIDATION.md](VALIDATION.md) per la checklist completa.

## 🌐 Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 📝 Notes
- Nessun JavaScript framework richiesto
- Nessun preprocessore CSS richiesto
- Pure HTML/CSS/JS vanilla
- Production-ready code

---

**Version:** 1.0.0 Mobile-First  
**Date:** April 14, 2026  
**Status:** ✅ Production Ready
