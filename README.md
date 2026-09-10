# HARD2ACKRIGHT Landing Page

Standalone HTML/CSS/JS landing page, built to deploy on Vercel under a subdomain.
CTA buttons link out to the Shopify product page for checkout.

## Structure

```
hard2ackright-site/
├── index.html          Main page
├── css/
│   └── styles.css      All styles (brand tokens: Barlow Condensed, Open Sans, #EC6833 etc.)
├── js/
│   └── main.js         Nav scroll behavior, smooth scroll
└── assets/
    ├── video/          Hero background video (hero-loop.mp4)
    ├── img/            Photos, fallback/poster images
    ├── logo/           Logo files
    └── icons/          UI icons
```

## Current status

- Hero section: built, using placeholder gradient background until video/photo
  assets are ready (see assets/video/README.md)
- Price in the hero buy box: placeholder, needs real price
- Next sections (highlights/benefits, specs, FAQ): not yet built

## Deployment

Intended for Vercel, on a subdomain (e.g. hard2ackright.ackrighthands.com or
shop.ackrighthands.com), pointing checkout/CTA links to the Shopify product page.
