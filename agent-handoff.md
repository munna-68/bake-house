# Agent Handoff Guide — Design System & Animation Rollout

This guide instructs subsequent coding agents on how to expand the newly established **artisan bakery design system** and **animation framework** across the remaining sections of the website and back-office dashboard.

---

## 1. Context & What Was Already Implemented

The following components and styles have already been redesigned and are live:
1. **Typography**: Google Fonts `DM Serif Display` and `Fraunces` loaded in `index.html` and configured as `--font-display` in `src/index.css`. `Anton` preserved for the brand wordmark.
2. **Global Theme**: Warm card tokens (`--color-card-warm: #FAF6F0`, `--color-card-border: #E8DED2`), gentle cookie hover tilt (`.cookie-spin`), and card lift utilities (`.cookie-card-hover`).
3. **Icon Library**: Standardized on **`lucide-react`** across all components (`Leaf`, `Clock`, `Truck`, `ShieldCheck`, `Wheat`, `ChevronLeft`, `ChevronRight`, `ArrowRight`, `Minus`, `Plus`, `X`).
4. **Global Chrome (`src/components/Chrome.tsx`)**:
   - `Wordmark`: The original iconic `BAKEHOUSE` wordmark (`BAKE` in ink, `HOUSE` in brick in bold `Anton`).
   - `Header`: Terracotta pill button `Order · {count}` with Lucide `ArrowRight`.
5. **Hero Section (`src/components/Hero.tsx`)**:
   - `FlavourCarousel`: Redesigned into a warm ivory card with slide counter (`02 / 08`), round oven badge (`FRESH TODAY / OUT OF THE OVEN DAILY`) with Lucide's `Wheat`, centered cookie with slow gentle tilt, serif title, live stock dot, terracotta `ADD TO BOX` button, and thumbnail slider with Lucide `ChevronLeft` and `ChevronRight`.
   - `Hero` text: Eyebrow, two-tone serif heading (`Big cookies. / Soft middles.`), primary terracotta CTA, and stock/reviews row.
   - `TrustStrip`: 4 light bordered cards with Lucide icons (`Leaf`, `Clock`, `Truck`, `ShieldCheck`).
6. **Make Your Own Box Section (`src/components/Batch.tsx` & `src/components/BoxBuilder.tsx`)**:
   - Header: Clean title **"Fresh cookies. Your way."** without hyphens or badges.
   - Grid: **3 columns on desktop** (`grid gap-4 sm:grid-cols-2 xl:grid-cols-3`).
   - `ProductCard`: Light warm cards, index numbers (`01`, `02`), centered cookies with slow gentle tilt on hover, bold serif names, allergen pill chips, and outline `ADD` / stepper buttons with Lucide icons.
   - `BoxBuilderPanel`: Warm light sidebar with 3 size options (`4 / $22`, `6 / $30` active in terracotta, `12 / $54`), 3x2 dashed slot grid with slot numbers and Lucide `X` remove buttons, and pinned checkout footer.

---

## 2. Outstanding Scope for Next Agents

The next agent should apply this design language and interactive animation patterns to the remaining components:

### 2.1 Reviews Section (`src/components/Sections.tsx` -> `Reviews`)
- **Current State**: Uses dark shadow and basic cards.
- **Target Changes**:
  - Update card containers to `rounded-[22px] border border-line bg-shell p-6 shadow-xs transition-all hover:border-[#dbcbb9] hover:shadow-sm`.
  - Add decorative serif quote styling: e.g. `<span className="font-display text-[32px] text-brick/40 leading-none">“</span>`.
  - Display verified order checkmark with `text-leaf` and subtle pill badge.
  - Heading: Use `font-display` with serif styling matching `Fresh cookies. Your way.`.

### 2.2 Pickup and Delivery Explainer (`src/components/Sections.tsx` -> `Explainer`)
- **Current State**: 3-step numbered cards.
- **Target Changes**:
  - Step numbers `01`, `02`, `03` in `font-display text-[44px] text-brick italic leading-none`.
  - Step title in bold serif (`font-display text-[22px] text-ink`).
  - Cards in `rounded-[22px] border border-line bg-shell p-6 shadow-xs`.
  - Add subtle icons corresponding to each step (e.g. Box, Clock, Van).

### 2.3 FAQ Accordion (`src/components/Sections.tsx` -> `Faq`)
- **Current State**: Accordion with basic border and plus/minus icons.
- **Target Changes**:
  - Question trigger: `font-display text-[20px] sm:text-[22px] text-ink` with a circular chevron button that rotates 180° when expanded (`transition-transform duration-250`).
  - Active item highlight: Subtle background tint (`bg-shell`) and warm border.
  - Answers in `text-[15px] text-ink-soft leading-relaxed`.

### 2.4 Pricing / Commercial Block (`src/components/Sections.tsx` -> `Pricing`)
- **Current State**: Dark cocoa block with large price.
- **Target Changes**:
  - Transform from heavy dark cocoa box into a warm, premium card container:
    - Background: `bg-[#faf6f0]` with `border border-line rounded-[26px] p-8 shadow-sm`.
    - Price: `$2,500` in `font-display text-[54px] sm:text-[64px] text-brick font-bold`.
    - Feature checklist: Rounded checkmark pills (`✓`) in terracotta or forest olive.
    - CTAs: Primary terracotta pill button + secondary light outline pill button.

### 2.5 Footer (`src/components/Sections.tsx` -> `Footer`)
- **Target Changes**:
  - Use `Wordmark` with the wheat sprig SVG icon.
  - Column links in `label-caps text-[11px] text-ink/75 hover:text-brick`.
  - Large background watermark in muted cream or terracotta tint.

### 2.6 Checkout Modal & Multi-Step Flow (`src/components/Checkout.tsx`)
- **Current State**: 3-step modal (Time Slot -> Details -> Payment).
- **Target Changes**:
  - Modal container: `rounded-[28px] border border-line bg-shell p-6 sm:p-8 shadow-lift`.
  - Step indicators: Terracotta filled circles for completed/active steps (`bg-brick text-white`), clean connecting line.
  - Headings: Serif display font (`font-display text-[24px] sm:text-[28px] text-ink`).
  - Input fields: Warm background (`bg-cream/40 border border-line focus:border-brick focus:ring-1 focus:ring-brick`).
  - Cookie summary thumbnails: Small circular cookie previews with subtle spin or hover bounce.

### 2.7 Mobile Review Sheet (`src/components/ReviewSheet.tsx` & `MobileOrderBar`)
- **Target Changes**:
  - Bottom sheet: `rounded-t-[28px] border-t border-line bg-shell p-5 shadow-lift`.
  - Sticky bottom bar: Terracotta pill with order totals, rounded badge indicator.

---

## 3. Back-Office Dashboard Redesign (`src/dashboard/*`)

The dashboard currently lives at `/dashboard/` with 7 tabs:
1. `Today.tsx`: Daily overview, live orders, pickup windows.
2. `Orders.tsx`: Orders table and filter tabs.
3. `BakeSheet.tsx`: Tray breakdown (12 per tray).
4. `Menu.tsx`: Live stock steppers, descriptions, allergen toggles, and photo URLs.
5. `Insights.tsx`: Daily revenue, best sellers, payment splits.
6. `Customers.tsx`: Customer directory with initials avatars and order history.
7. `Money.tsx`: Settled vs. outstanding revenue, payment method breakdowns.

### Dashboard Design Guidelines
- **Typography**: Page titles and stat numbers in `font-display text-ink`. Table headers and small labels in `label-caps`.
- **Stat Cards**: Replace dark cocoa cards with warm ivory cards (`rounded-[20px] border border-line bg-shell p-5 shadow-xs`).
- **Tables**: Clean alternating rows with subtle warm borders (`border-line-soft`), round stock badges (`bg-brick/15 text-brick` or `bg-leaf-soft text-leaf`).
- **Interactive Steppers**: Rounded buttons with smooth hover feedback.

---

## 4. Animation Guidelines & Code Patterns

When adding interactions, adhere to the following principles:

1. **Gentle Cookie Hover Tilt**:
   - Always apply the `cookie-spin` class to cookie images:
     ```tsx
     <img src={cookie.photo} alt={cookie.name} className="cookie-spin h-full w-full object-contain" />
     ```
   - Enclosing card must have the `group` class so hovering anywhere on the card initiates a slow, gentle tilt (`rotate(7deg) scale(1.03)`) with smooth `0.65s cubic-bezier(0.25, 1, 0.5, 1)` easing.

2. **Card Hover Elevation**:
   - Use `cookie-card-hover` on interactive cards:
     ```tsx
     <article className="group cookie-card-hover rounded-[22px] border border-line bg-shell p-5">
     ```
   - This smoothly lifts the card by `-3px`, deepens the shadow, and warms the border.

3. **CTA Button Interactions**:
   - Always include `active:scale-95` on pill buttons.
   - For primary buttons: `bg-brick hover:bg-brick-dark text-white rounded-full transition-all shadow-xs`.

4. **Reduced Motion**:
   - `src/index.css` has a global `@media (prefers-reduced-motion: reduce)` block that resets all transitions and animations to `0.001ms`. Ensure any custom JavaScript animations check `window.matchMedia('(prefers-reduced-motion: reduce)')`.

---

## 5. Verification Checklist for the Next Agent

Before concluding your work:
- [ ] Run `npm run build` (`tsc -b && vite build`) — must pass with 0 errors.
- [ ] Check console in browser (`/` and `/dashboard/`) for any React or layout warnings.
- [ ] Verify keyboard navigation (tab navigation, arrow keys for carousel, enter/space for buttons).
- [ ] Verify mobile responsiveness at 390px width and desktop at 1440px width.
