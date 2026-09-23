# Bakehouse / FreshBakes — Design System Specification

## 1. Overview & Brand Philosophy

Bakehouse (FreshBakes) is an artisan small-batch cookie bakery that bakes once daily at 7 AM and closes when the rack is empty. The design language reflects:
- **Artisan Warmth**: Soft cream, ivory, and warm linen surfaces replace harsh brutalist dark blocks.
- **Editorial Elegance**: High-contrast, warm editorial serif typography (`DM Serif Display` and `Fraunces`) paired with a modern sans (`Archivo`) for clear UI elements.
- **Tactile Feedback & Delight**: Interactive micro-interactions, smooth cookie rotation on hover, springy pill buttons, and live stock updates.
- **Visual Balance**: Balanced card heights, generous white space, and cohesive light card containers that allow the cookie photography to be the hero.

---

## 2. Color Palette System

All color tokens are declared in `src/index.css` under the `@theme` block.

| Token | Hex Value | Purpose & Usage |
|---|---|---|
| `--color-cream` | `#F7F1E7` | Primary page canvas background. Warm, soft, non-reflective. |
| `--color-cream-deep` | `#EFE5D5` | Deeper background for alternating sections (e.g. explainer). |
| `--color-card-warm` | `#FAF6F0` | Warm ivory background for hero carousel card & box builder sidebar. |
| `--color-shell` | `#FFFFFF` | Card surface for cookie cards, trust cards, and reviews. |
| `--color-ink` | `#241A12` | Primary text, titles, headlines, and prominent numbers. |
| `--color-ink-soft` | `#635647` | Secondary text, descriptions, and small caps metadata (>4.5:1 contrast). |
| `--color-ink-faint` | `#75685A` | Placeholder text, index numbers, and subtle hints. |
| `--color-brick` | `#C0452C` | Brand accent terracotta / rust. Used for primary CTAs, active pills, and headline highlight ("Soft middles."). |
| `--color-brick-dark` | `#A63A24` | Hover and active state for brick buttons. |
| `--color-gold` | `#E3A02C` | 5-star rating stars, highlight accents. |
| `--color-gold-badge` | `#F3D489` | Round "Fresh Today" oven badge background. |
| `--color-line` | `#E4D9C7` | Primary card borders and section dividers. |
| `--color-line-soft` | `#F0E8DA` | Subtle inner borders and slot dividers. |
| `--color-leaf` | `#4A8A56` | Live in-stock indicator dot, verified order badge, trust icons. |

---

## 3. Typography Scale & Hierarchy

### 3.1 Font Families
- **Display & Headings**: `'DM Serif Display', 'Fraunces', Georgia, serif`
  - High-contrast letterforms with bracketed serifs and soft terminals.
  - Used for page headlines (`h1`, `h2`), cookie names, slide numbers, and prominent price figures.
- **Body & UI**: `'Archivo', system-ui, -apple-system, sans-serif`
  - Clean, highly legible grotesque sans-serif.
  - Used for paragraphs, allergen chips, button labels, and small-caps metadata.

### 3.2 Type Scale
- **Hero Title (`h1`)**: `text-[44px] sm:text-[58px] lg:text-[66px] leading-[1.02] tracking-[-0.015em] font-normal`
  - Line 1 in `--color-ink`, Line 2 in `--color-brick`.
- **Section Heading (`h2`)**: `text-[38px] sm:text-[48px] lg:text-[54px] leading-[1.04] tracking-[-0.015em] font-normal text-ink`
- **Card Title (`h3`)**: `text-[21px] sm:text-[23px] font-bold leading-tight text-ink`
- **Slide & Stat Figures**: `text-[32px] sm:text-[42px] font-display italic text-ink`
- **Body Paragraphs**: `text-[15.5px] sm:text-[17px] leading-relaxed text-ink-soft`
- **Card Descriptions**: `text-[13px] sm:text-[13.5px] leading-snug text-ink-soft`
- **Small Caps Eyebrows (`label-caps`)**: `text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-ink-soft`

---

## 4. Component Library Specifications

### 4.1 Header & Wordmark
- **Wordmark**: The original iconic `BAKEHOUSE` logo in bold condensed `Anton` (`font-['Anton',sans-serif] text-[26px] leading-none tracking-[-0.02em] uppercase`), featuring `BAKE` in `--color-ink` and `HOUSE` in `--color-brick`. Clean, timeless, without clumsy hand-drawn icons.
- **Nav Links**: 5 navigation links (`Build a box`, `Pickup and delivery`, `Reviews`, `Pricing`, `Questions`) in `label-caps text-[11px] text-ink/75 hover:text-brick`.
- **Cart CTA Button**: Solid terracotta pill (`bg-brick hover:bg-brick-dark text-white rounded-full px-5 py-2.5 shadow-sm text-[11px] font-bold uppercase tracking-[0.09em]`) showing `Order · {count}` paired with Lucide's `ArrowRight`.

### 4.2 Iconography (Lucide React)
All icons across the application are standardized using **`lucide-react`** with consistent stroke width (`1.8px` or `2px`):
- `Leaf`: Reviews and ratings stat card.
- `Clock`: Wait time stat card.
- `Truck`: Delivery stat card.
- `ShieldCheck`: Commercial kitchen / license stat card.
- `Wheat`: Round oven badge sprig icon.
- `ChevronLeft` / `ChevronRight`: Flavour carousel thumbnail controls.
- `ArrowRight`: Action button prompts (`Build your box →`, `Order →`, `Checkout →`).
- `Minus` / `Plus`: Box builder quantity steppers.
- `X`: Slot remove buttons.

### 4.3 Hero Flavour Carousel Card
- **Container**: `rounded-[26px] border border-line bg-[#faf6f0] p-5 sm:p-6 shadow-[0_4px_24px_-6px_rgba(43,29,19,0.06)]`.
- **Top Row**:
  - Slide index on left: `02 / 08` (large italic serif number + muted sans total).
  - Round yellow badge on right: `h-[74px] w-[74px] sm:h-[80px] sm:w-[80px] rounded-full bg-[#f3d489] -rotate-6` containing `FRESH TODAY`, `OUT OF THE OVEN DAILY`, and Lucide's `Wheat` icon.
- **Center**: Direct top-down cutout cookie image (`aspect-square w-[72%] max-w-[270px] drop-shadow-[0_14px_24px_rgba(43,29,19,0.2)]`) with gentle slow hover tilt.
- **Content**: Cookie title in serif (`text-[26px] sm:text-[30px] font-bold text-ink text-center`) and narrative description.
- **Action Bar**: Live stock dot (`• 10 LEFT TODAY` in green) + terracotta rounded button (`ADD TO BOX`).
- **Thumbnail Slider**: Lucide `ChevronLeft` and `ChevronRight` buttons framing circular thumbnail pills; active thumbnail highlighted with `ring-2 ring-brick ring-offset-2 ring-offset-[#faf6f0]`.

### 4.4 Trust Strip
- **Grid**: 4 columns (`grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5`).
- **Card**: `rounded-[20px] border border-line bg-shell p-5 text-ink shadow-xs hover:border-ink/25 hover:shadow-sm`.
- **Anatomy**:
  1. Rating Card: Lucide `Leaf` icon, `4.9` + `★★★★★`, `1,284 REVIEWS`.
  2. Wait Time Card: Lucide `Clock` icon, `19 min`, `AVERAGE WAIT FOR A PICKUP BOX AT THE COUNTER`.
  3. Delivery Card: Lucide `Truck` icon, `Same day`, `DELIVERY ON EVERY ORDER PLACED BEFORE 9AM`.
  4. Kitchen Card: Lucide `ShieldCheck` icon, `Licensed`, `COMMERCIAL KITCHEN, ALLERGENS ON EVERY FLAVOUR`.

### 4.5 Make Your Own Box (Batch Grid)
- **Header**: Clean headline `Fresh cookies. Your way.` and subtitle. No "Today's batch" badge or hyphens.
- **Layout**: Sticky sidebar panel on desktop + **3-column cookie card grid** (`grid gap-4 sm:grid-cols-2 xl:grid-cols-3`).

### 4.6 Box Builder Panel (Sidebar)
- **Container**: `rounded-[24px] border border-line bg-[#faf6f0] p-5 shadow-xs`.
- **Size Selector**: 3 columns (`4 / $22`, `6 / $30`, `12 / $54`). Active size styled with solid terracotta `bg-brick text-white rounded-[14px]` and subtle shadow.
- **Dashed Slot Grid**:
  - Size 4: 2 cols × 2 rows.
  - Size 6: 3 cols × 2 rows.
  - Size 12: 3 cols × 4 rows.
  - Empty slots: `border border-dashed border-[#d8cdbf] rounded-[14px] bg-cream/40` displaying slot numbers `1`, `2`, `3`, etc.
  - Filled slots: Cookie preview image with Lucide `X` remove button (`bg-brick text-white rounded-full`).
- **Footer**:
  - `TOTAL` and large bold serif price (`text-[32px] sm:text-[34px] font-display font-bold text-ink`).
  - Terracotta action button: `FILL THE BOX TO CONTINUE →` / `CHECKOUT · $30 →`.
  - Muted subtext: `NO ACCOUNT NEEDED.`.

### 4.7 Cookie Product Card
- **Container**: `group cookie-card-hover relative flex flex-col justify-between rounded-[22px] border border-line bg-shell p-4 sm:p-5 pt-3.5 sm:pt-4 shadow-xs`.
- **Top Left**: Index number `01`, `02`, etc.
- **Center**: Cookie image with slow, gentle hover tilt (`.cookie-spin`).
- **Middle**: Bold serif title, description, and allergen pill chips (`WHEAT`, `MILK`, `SOY`, `EGG`).
- **Bottom Bar**:
  - Stock indicator: Green dot for available, brick dot for low stock (`Only 1 left`), muted dot for sold out.
  - Button: Outline pill button `ADD` (`rounded-full border border-ink/25 px-4 py-1 text-[10.5px] font-bold uppercase hover:border-ink hover:bg-cream-deep`).
  - Stepper: When added to box, transitions into Lucide `Minus` and `Plus` controls inside a rounded container.

---

## 5. Motion, Animation & Interactions

1. **Gentle Cookie Hover Tilt (`.cookie-spin`)**:
   ```css
   .cookie-spin {
     transition: transform 0.65s cubic-bezier(0.25, 1, 0.5, 1);
     will-change: transform;
   }
   .group:hover .cookie-spin,
   .cookie-spin:hover {
     transform: rotate(7deg) scale(1.03);
   }
   ```
2. **Card Hover Lift (`.cookie-card-hover`)**:
   ```css
   .cookie-card-hover {
     transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s ease, border-color 0.35s ease;
   }
   .cookie-card-hover:hover {
     transform: translateY(-3px);
     box-shadow: 0 12px 30px -8px rgba(43, 29, 19, 0.12);
     border-color: rgba(192, 69, 44, 0.3);
   }
   ```
3. **Cart Badge Pop (`.count-pop`)**:
   Spring scale keyframe when order count increments: `scale(1) -> scale(1.22) -> scale(1)`.
4. **Slide Navigation Transition**:
   Subtle fade/crossfade on slide changes (`fade-enter 220ms ease`).
5. **Accessibility**:
   All animations respect `@media (prefers-reduced-motion: reduce)`.
