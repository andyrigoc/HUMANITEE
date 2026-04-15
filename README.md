# HUMANITEE — Essential Minimal Apparel

> A premium minimal t-shirt brand with a unique ordering experience.

**Live site:** [thehumanitee.com](https://www.thehumanitee.com)

## Overview
HUMANITEE is a mobile-first e-commerce landing page featuring:
- **Live world population counter** — real-time ticker fetched from Worldometers
- **Unique Human Number** — every customer gets a unique number from 1 to 8.2 billion
- **Inline order flow** — multi-step modal (weight → size → details → payment → confirmation)
- **Responsive design** — mobile fullscreen modal, desktop editorial grid layout

## Tech Stack
- Vanilla HTML, CSS, JavaScript (no frameworks)
- Node.js + Express (API: world population, order creation, user lookup)
- Deployed on Vercel

## Files
- `index.html` — main page
- `style.css` — mobile-first responsive styles
- `script.js` — client-side logic (modal flow, population ticker, order processing)
- `server.js` — Express API server
- `order.html / order.css / order.js` — standalone order page
- `data/users.json` — user data and assigned numbers
- `ORIGIN.png` — product image
- `paypal.png / opayo.png / card.png` — payment method icons

## Local Development
```bash
npm install
node server.js
# Open http://localhost:3000
```

## Deployment
Deployed via Vercel, connected to GitHub `main` branch. Every push triggers auto-deploy.
