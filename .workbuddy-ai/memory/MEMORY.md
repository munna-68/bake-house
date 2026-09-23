# Bake House — project notes

Functional clone of `freshbakes.store`, built from `docs/freshbakes-clone/CLONE-SPEC.md`.
Source of truth for what to build is that spec plus the 35 screenshots beside it.

## Conventions

- **Vite 6 + React 18 + TS + Tailwind v4.** Tokens live in `src/index.css` under
  `@theme` (cream / cocoa / brick / gold / leaf). Use those, not raw hex.
- **One store.** `src/lib/store.tsx` owns all shop state and persists to
  `localStorage` (`bakehouse.v1`). The dashboard reads the same store, which is why
  the Menu tab can update the storefront.
- **Never take persisted state wholesale.** `load()` reconciles saved flavours
  against the seed by `id` (`mergeSeedFlavours`). Reading the saved array as-is
  means every field added to `FLAVOURS` after a visitor's first load is missing for
  them forever, and no reload fixes it — that is exactly what hid the photos. The
  saved copy must win for keys it has, the seed only fills absent ones. A photo
  cleared in the dashboard is `''` (present), not absent, so it stays cleared.
  Any new persisted field inherits this rule.
- **Copy is ours.** The spec forbids reusing the reference brand, flavour names,
  review quotes, photos or marketing copy. Match the *structure and behaviour*, write
  new words.
- **Cookies are generated SVG** (`src/components/Cookie.tsx`), seeded per flavour.
  Don't add stock photography; set `Flavour.photo` if a real image is ever wanted.
- **Always read flavours from `useShop().flavours`, never from `FLAVOURS` in
  `lib/data.ts`.** The seed module is only for `initialState()` and `hardReset()`.
  Importing it into a component silently breaks the dashboard menu editor.
- **Accessibility floors, non-negotiable:** text ≥4.5:1 on cream (both `ink-soft`
  and `ink-faint` are tuned for this), and touch targets ≥44px on mobile — use
  `min-h-11 sm:min-h-0` / `h-11 w-11 sm:h-8 sm:w-8` so desktop density is kept.
- **Overlays handle Escape and Tab on `document`**, not via a React `onKeyDown` on
  the panel — element-level handlers die the moment focus lands outside.
- **Store mutations that read state go through `commit()`** in `src/lib/store.tsx`.
  It writes `stateRef` synchronously so consecutive clicks in one task see each
  other; plain `setState` batching let a box of six accept ten cookies. Never
  derive an order total or quantity from a render-time memo inside a mutation.
- **The desktop box panel is height-capped and its CTA is pinned.** It uses
  `lg:max-h-[calc(100dvh-112px)]` + `grid-rows-[minmax(0,1fr)_auto]`. Do not
  "simplify" this to `flex-col` + `flex-1` — that collapses the panel. Its scroll
  region carries `panel-scroll` (a slim cocoa-toned scrollbar) because a default
  browser scrollbar inside a dark rounded card reads as a stray page scrollbar.
- **Anything you can put in the box, you can take out of the box.** The panel's
  slot grid is not decorative: each filled slot carries a × (`Remove one {name}`)
  and the item rows carry a −/+ stepper, plus an "Empty box N" action. Do not put
  `aria-hidden` back on the slot grid — that × is the only way out without
  scrolling to the grid.
- **One deliberate a11y exception.** The `$2,500 all in` link in the announcement
  strip is 15px tall. Giving it a 44px target grows the strip ~15px on mobile,
  which is a visible design change, so it is allowlisted in the `a11y` suite
  rather than silently passed. Everything else meets 44px on mobile.
- **Config knobs are in `src/lib/types.ts`**: `BOX_PRICES`, `DELIVERY_FEE`,
  `DELIVERY_ZIPS`. Change them there, not in components.
- Prices, windows and day options are hardcoded demo data by design — there is no
  backend. `src/lib/data.ts` holds every piece of seed content.

## Verification

`npm run build` must pass, then drive the real app in a browser. The harness is
`qa/` and is plain CDP over WebSocket (no Playwright, no extra deps):

```bash
npm run dev                                                  # in one terminal
npm run qa                                                   # all suites
npm run qa -- state reset panel                              # named suites
npm run build && npm run preview -- --port 5191
QA_URL=http://127.0.0.1:5191 npm run qa                      # the shipped bundle
```

Suites: `state` (persisted state vs a newer seed), `reset` (menu reset),
`photos` (wiring + assets), `shop` (builder mechanics), `panel` (removing from
the box panel), `a11y` (floors and structure), `loading` (weight, lazy, CLS).
Expect **90 checks, zero console errors, zero failed requests** on both dev and
the production build.

These used to live in `/tmp` and were gone by the next session, which meant the
definition of done could not actually be checked. They live in the repo now —
keep them there. Use ports 5188-5204; a leaked dev server will collide, so check
with `lsof -nP -iTCP:<port> -sTCP:LISTEN`.

## Images

`public/cookies/<flavour-id>.webp`, 720² WebP q84, transparent, ~115KB each. Cut
out by flood-filling from the frame edge, **not** by keying out white — three
cookies have white chocolate chips that a white key would hollow out. Sources are
in `src/imgs/` (29MB, gitignored-free, never bundled). `picture.md` holds the
generation prompts and the source→flavour mapping. Both the tile and the carousel
fall back to the drawn SVG cookie if a file is missing.

## Deployment

Static build → any host, but it needs an **SPA rewrite** (all unknown paths →
`index.html`) because `/dashboard/*` is a real route.
