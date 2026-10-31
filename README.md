# VOLT.MAG — Electron Hardware Magazine & Storefront

A serverless, 100% static-exportable Next.js application combining long-form electronics journalism with an interactive hardware storefront.

## Features
- **Zero-Server Architecture**: Configured with `output: 'export'` in [next.config.mjs](file:///d:/Lobar/test/antigravity/next.config.mjs) so the entire application builds to static HTML/CSS/JS and runs without any backend or external APIs.
- **Rich Mock Hardware Database**: 10 flagship electronic devices across Laptops, Smartphones, Audio, Cameras, Wearables, and Accessories, plus 3 long-form editorial articles in [mockData.ts](file:///d:/Lobar/test/antigravity/src/data/mockData.ts).
- **Offline-Ready SVG Illustrations**: Custom schematic & gradient illustrations in [ProductIllustration.tsx](file:///d:/Lobar/test/antigravity/src/components/ProductIllustration.tsx) that load with zero external network requests.
- **Persistent Browser Storage (`localStorage`)**:
  - Shopping Bag (`volt_cart_v1`) with promo code support (`VOLT10` for 10% off)
  - Saved Wishlist (`volt_wishlist_v1`)
  - Side-by-Side 3-Device Spec Comparison (`volt_compare_v1`)
  - Local Express Checkout & Order Receipts (`volt_orders_v1`)

## Commands

```bash
# Start development environment
npm.cmd run dev

# Generate static serverless export into /out folder
npm.cmd run build
```

