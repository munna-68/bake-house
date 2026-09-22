# Bake House — project notes

Functional clone of `freshbakes.store`, built from `docs/freshbakes-clone/CLONE-SPEC.md`.
Source of truth for what to build is that spec plus the 35 screenshots beside it.

## Conventions

- **Vite 6 + React 18 + TS + Tailwind v4.** Tokens live in `src/index.css` under
  `@theme` (cream / cocoa / brick / gold / leaf). Use those, not raw hex.
- **One store.** `src/lib/store.tsx` owns all shop state and persists to
  `localStorage` (`bakehouse.v1`). The dashboard reads the same store, which is why
  the Menu tab can update the storefront.
- **Copy is ours.** The spec forbids reusing the reference brand, flavour names,
  review quotes, photos or marketing copy. Match the *structure and behaviour*, write
  new words.
- **Cookies are generated SVG** (`src/components/Cookie.tsx`), seeded per flavour.
  Don't add stock photography; set `Flavour.photo` if a real image is ever wanted.
- **Config knobs are in `src/lib/types.ts`**: `BOX_PRICES`, `DELIVERY_FEE`,
  `DELIVERY_ZIPS`. Change them there, not in components.
- Prices, windows and day options are hardcoded demo data by design — there is no
  backend. `src/lib/data.ts` holds every piece of seed content.

## Verification

`npm run build` must pass, then drive the real app in a browser — the checks live in
`/tmp/qa-bakehouse.mjs` (CDP over WebSocket, no Playwright). Run it in both modes:

```bash
NODE_OPTIONS= node /tmp/qa-bakehouse.mjs                  # dev  (StrictMode on)
QA_MODE=preview NODE_OPTIONS= node /tmp/qa-bakehouse.mjs  # production dist
```

Both must be 48/48 with no console errors before calling anything done.

## Deployment

Static build → any host, but it needs an **SPA rewrite** (all unknown paths →
`index.html`) because `/dashboard/*` is a real route.
