# picture.md — cookie photo prompts

Nine prompts, one per flavour, written to be pasted into an AI image generator
**one at a time, in a fresh context**. Every prompt is fully self-contained: it
repeats the same camera, lighting and background language word for word. That
repetition is the whole trick — paraphrase it once and that cookie will not match
the other eight.

---

## Status: done and wired in

The set has been generated and is live. Sources are in `src/imgs/`, and the
cut-out, resized results are in `public/cookies/` as `.webp`, already referenced
from `src/lib/data.ts`. The prompts below are kept so any flavour can be
re-shot to match.

Two generated files were **not** used, because nine were needed and eleven were
supplied. Both are kept as spares:

| Source (`src/imgs/`) | Became |
|---|---|
| `triple-chocolate.png` | `public/cookies/triple-chocolate.webp` |
| `ceremonial-matcha.png` | `public/cookies/ceremonial-matcha.webp` |
| `raspberry-dark.png` | `public/cookies/raspberry-dark.webp` |
| `oat-and-cinnamon.png` | `public/cookies/oat-and-cinnamon.webp` |
| `beetroot-red-velvet.png` | `public/cookies/beetroot-red-velvet.webp` |
| `burnt-marshmallow.png` | `public/cookies/burnt-marshmallow.webp` |
| `caramel-speculoos.png` | `public/cookies/caramel-speculoos.webp` |
| `peanut-butter-cup.png` | `public/cookies/peanut-butter-cup.webp` |
| `salted-butter-chip.png` | `public/cookies/salted-butter-chip.webp` |
| `raspberry-dark-spare.png` | *unused — second take on raspberry dark* |
| `chocolate-chip-spare.png` | *unused — plain choc chip, no sea salt* |

The sources are named after the flavour `id`, the same as the shipped `.webp`, so
a source and its output share a name and nothing needs a lookup table to go from
one to the other. They arrived from the generator as
`ChatGPT Image Sep 23, 2026, 02_04_29 AM.png` and were renamed; nothing in the
build ever referenced the original names, since `src/imgs/` is a source folder
and is never bundled.

**Why those two were left out.** `raspberry-dark-spare` is a second take on
raspberry dark, near-identical to `raspberry-dark`. `chocolate-chip-spare` is a
clean chocolate chip cookie but with small uniform chips and no sea salt, so it
does not match Salted butter chip's description — `salted-butter-chip` has the
big dark chunks and visible salt flakes. Keep them as spares if you ever want a
different look.

**How they were processed.** Background removed by flood-filling inwards from the
frame edge rather than keying out white — three of these cookies have white
chocolate chips, and a straight white-to-transparent key would have hollowed them
out. Then trimmed to the cookie's bounding box, re-centred square with a 7%
margin, resized to 720 × 720 and exported as WebP at quality 84. About 115 KB
each, 1.0 MB for all nine, down from 2.1 MB per source.

To regenerate: drop a new source into `src/imgs/`, re-run the cut-out, and it
lands on the same filename so nothing else needs changing.

---

## Read this first

**The rule.** Copy each prompt exactly as written. Do not shorten, reorder or
"improve" the shared part. The only line that changes between flavours is the
subject line at the end.

**Why it matters.** You are generating across separate sessions with no memory of
the previous image. The model has no idea what the last cookie looked like. The
only thing holding the set together is that the shared block is byte-identical
every time, so the model lands on the same camera, the same light and the same
white every run.

**The background.** Flat pure white `#FFFFFF`, nothing else in frame — no plate,
no surface, no shadow, no reflection, no gradient. That is deliberate: a cast
shadow or a soft gradient is the thing that makes background removal fail at the
edges. All the depth and shadow in the real site comes from CSS, not the photo.

**Output.** Square 1:1, minimum 2048 × 2048, PNG.

**Do not change between prompts:** camera height, focal length, light direction,
how much of the frame the cookie fills, and the white. If one comes out looking
like a different shoot, regenerate it — do not accept it and move on.

---

## The shared block

Paste this, then the subject line, as one continuous prompt.

```
Photorealistic food photography of a single cookie, shot from directly overhead in a perfect 90 degree top-down bird's-eye view, camera parallel to the cookie so there is no perspective distortion. The cookie is perfectly centred in a square 1:1 frame with even margins, filling roughly 82 percent of the frame width, with the whole circular top surface in sharp focus edge to edge. Soft, even, diffused daylight from the upper left, gentle natural modelling, no hot highlights, no harsh specular glare. True-to-life colour with no colour cast, natural crumb texture, visible cracks, and a slightly irregular hand-rolled edge. Shot on a 100mm macro lens at f/8, ISO 100, high resolution, tack sharp. The background is a completely flat, uniform, pure white studio sweep (#FFFFFF) with nothing else in the frame: no plate, no surface, no props, no loose crumbs, no hands, no text, no watermark, no border, no cast shadow, no reflection, no gradient, no vignette.
```

## The negative prompt

Add this to every generation too.

```
plate, bowl, napkin, table, wood, marble, slate, linen, props, cutlery, loose crumbs around the cookie, multiple cookies, stacked cookies, broken cookie, bite taken, hands, fingers, text, watermark, logo, signature, border, frame, drop shadow, cast shadow, contact shadow, reflection, mirror surface, gradient background, grey background, off-white background, beige background, coloured background, vignette, HDR halo, oversaturated, plastic, waxy, CGI, 3D render, illustration, cartoon, painting, airbrushed, heavy depth-of-field blur across the cookie, perspective distortion, tilted camera, top-lit glare, food styling props
```

---

## 1. Salted butter chip

**File:** `salted-butter-chip.png`

```
Photorealistic food photography of a single cookie, shot from directly overhead in a perfect 90 degree top-down bird's-eye view, camera parallel to the cookie so there is no perspective distortion. The cookie is perfectly centred in a square 1:1 frame with even margins, filling roughly 82 percent of the frame width, with the whole circular top surface in sharp focus edge to edge. Soft, even, diffused daylight from the upper left, gentle natural modelling, no hot highlights, no harsh specular glare. True-to-life colour with no colour cast, natural crumb texture, visible cracks, and a slightly irregular hand-rolled edge. Shot on a 100mm macro lens at f/8, ISO 100, high resolution, tack sharp. The background is a completely flat, uniform, pure white studio sweep (#FFFFFF) with nothing else in the frame: no plate, no surface, no props, no loose crumbs, no hands, no text, no watermark, no border, no cast shadow, no reflection, no gradient, no vignette. The subject is a thick golden-brown chocolate chip cookie with a soft, slightly underbaked centre, large dark chocolate chunks and pools of melted chocolate across the top, scattered flakes of sea salt, a few craggy cracks, and a slightly darker, crisper rim.
```

## 2. Triple chocolate

**File:** `triple-chocolate.png`

```
Photorealistic food photography of a single cookie, shot from directly overhead in a perfect 90 degree top-down bird's-eye view, camera parallel to the cookie so there is no perspective distortion. The cookie is perfectly centred in a square 1:1 frame with even margins, filling roughly 82 percent of the frame width, with the whole circular top surface in sharp focus edge to edge. Soft, even, diffused daylight from the upper left, gentle natural modelling, no hot highlights, no harsh specular glare. True-to-life colour with no colour cast, natural crumb texture, visible cracks, and a slightly irregular hand-rolled edge. Shot on a 100mm macro lens at f/8, ISO 100, high resolution, tack sharp. The background is a completely flat, uniform, pure white studio sweep (#FFFFFF) with nothing else in the frame: no plate, no surface, no props, no loose crumbs, no hands, no text, no watermark, no border, no cast shadow, no reflection, no gradient, no vignette. The subject is a deep, dark cocoa-brown double chocolate cookie with a matte, faintly crumbly top, studded with milk chocolate chunks, dark chocolate pieces and white chocolate flecks, with gooey molten chocolate showing in the cracks.
```

## 3. Caramel speculoos

**File:** `caramel-speculoos.png`

```
Photorealistic food photography of a single cookie, shot from directly overhead in a perfect 90 degree top-down bird's-eye view, camera parallel to the cookie so there is no perspective distortion. The cookie is perfectly centred in a square 1:1 frame with even margins, filling roughly 82 percent of the frame width, with the whole circular top surface in sharp focus edge to edge. Soft, even, diffused daylight from the upper left, gentle natural modelling, no hot highlights, no harsh specular glare. True-to-life colour with no colour cast, natural crumb texture, visible cracks, and a slightly irregular hand-rolled edge. Shot on a 100mm macro lens at f/8, ISO 100, high resolution, tack sharp. The background is a completely flat, uniform, pure white studio sweep (#FFFFFF) with nothing else in the frame: no plate, no surface, no props, no loose crumbs, no hands, no text, no watermark, no border, no cast shadow, no reflection, no gradient, no vignette. The subject is a warm caramel-brown cookie with a soft, slightly cracked top, spiced speculoos biscuit pieces folded through the surface, and a shallow well in the centre holding glossy caramel that is just starting to ooze.
```

## 4. Beetroot red velvet

**File:** `beetroot-red-velvet.png`

```
Photorealistic food photography of a single cookie, shot from directly overhead in a perfect 90 degree top-down bird's-eye view, camera parallel to the cookie so there is no perspective distortion. The cookie is perfectly centred in a square 1:1 frame with even margins, filling roughly 82 percent of the frame width, with the whole circular top surface in sharp focus edge to edge. Soft, even, diffused daylight from the upper left, gentle natural modelling, no hot highlights, no harsh specular glare. True-to-life colour with no colour cast, natural crumb texture, visible cracks, and a slightly irregular hand-rolled edge. Shot on a 100mm macro lens at f/8, ISO 100, high resolution, tack sharp. The background is a completely flat, uniform, pure white studio sweep (#FFFFFF) with nothing else in the frame: no plate, no surface, no props, no loose crumbs, no hands, no text, no watermark, no border, no cast shadow, no reflection, no gradient, no vignette. The subject is a deep beetroot-red cookie with a soft matte surface and a fine crackle top, a pale cream-cheese swirl visible at the centre, scattered white chocolate chips, and a slightly darker crimson rim.
```

## 5. Ceremonial matcha

**File:** `ceremonial-matcha.png`

```
Photorealistic food photography of a single cookie, shot from directly overhead in a perfect 90 degree top-down bird's-eye view, camera parallel to the cookie so there is no perspective distortion. The cookie is perfectly centred in a square 1:1 frame with even margins, filling roughly 82 percent of the frame width, with the whole circular top surface in sharp focus edge to edge. Soft, even, diffused daylight from the upper left, gentle natural modelling, no hot highlights, no harsh specular glare. True-to-life colour with no colour cast, natural crumb texture, visible cracks, and a slightly irregular hand-rolled edge. Shot on a 100mm macro lens at f/8, ISO 100, high resolution, tack sharp. The background is a completely flat, uniform, pure white studio sweep (#FFFFFF) with nothing else in the frame: no plate, no surface, no props, no loose crumbs, no hands, no text, no watermark, no border, no cast shadow, no reflection, no gradient, no vignette. The subject is a muted, natural green matcha cookie with a soft, slightly cracked surface, an even stone-ground matcha colour throughout, white chocolate chips and chunks scattered across the top, and a faintly darker green rim.
```

## 6. Raspberry dark

**File:** `raspberry-dark.png`

```
Photorealistic food photography of a single cookie, shot from directly overhead in a perfect 90 degree top-down bird's-eye view, camera parallel to the cookie so there is no perspective distortion. The cookie is perfectly centred in a square 1:1 frame with even margins, filling roughly 82 percent of the frame width, with the whole circular top surface in sharp focus edge to edge. Soft, even, diffused daylight from the upper left, gentle natural modelling, no hot highlights, no harsh specular glare. True-to-life colour with no colour cast, natural crumb texture, visible cracks, and a slightly irregular hand-rolled edge. Shot on a 100mm macro lens at f/8, ISO 100, high resolution, tack sharp. The background is a completely flat, uniform, pure white studio sweep (#FFFFFF) with nothing else in the frame: no plate, no surface, no props, no loose crumbs, no hands, no text, no watermark, no border, no cast shadow, no reflection, no gradient, no vignette. The subject is a dark chocolate cookie with a matte, slightly cracked top, deep ruby freeze-dried raspberry pieces and dark chocolate chunks scattered through it, a few raspberry-red crumbs, and a slightly darker rim.
```

## 7. Peanut butter cup

**File:** `peanut-butter-cup.png`

```
Photorealistic food photography of a single cookie, shot from directly overhead in a perfect 90 degree top-down bird's-eye view, camera parallel to the cookie so there is no perspective distortion. The cookie is perfectly centred in a square 1:1 frame with even margins, filling roughly 82 percent of the frame width, with the whole circular top surface in sharp focus edge to edge. Soft, even, diffused daylight from the upper left, gentle natural modelling, no hot highlights, no harsh specular glare. True-to-life colour with no colour cast, natural crumb texture, visible cracks, and a slightly irregular hand-rolled edge. Shot on a 100mm macro lens at f/8, ISO 100, high resolution, tack sharp. The background is a completely flat, uniform, pure white studio sweep (#FFFFFF) with nothing else in the frame: no plate, no surface, no props, no loose crumbs, no hands, no text, no watermark, no border, no cast shadow, no reflection, no gradient, no vignette. The subject is a warm tan peanut butter cookie with a soft craggy top, a whole peanut butter cup pressed into the centre so its ridged edge is visible, melted chocolate and peanut butter pooling at the centre, and flakes of sea salt on top.
```

## 8. Burnt marshmallow

**File:** `burnt-marshmallow.png`

```
Photorealistic food photography of a single cookie, shot from directly overhead in a perfect 90 degree top-down bird's-eye view, camera parallel to the cookie so there is no perspective distortion. The cookie is perfectly centred in a square 1:1 frame with even margins, filling roughly 82 percent of the frame width, with the whole circular top surface in sharp focus edge to edge. Soft, even, diffused daylight from the upper left, gentle natural modelling, no hot highlights, no harsh specular glare. True-to-life colour with no colour cast, natural crumb texture, visible cracks, and a slightly irregular hand-rolled edge. Shot on a 100mm macro lens at f/8, ISO 100, high resolution, tack sharp. The background is a completely flat, uniform, pure white studio sweep (#FFFFFF) with nothing else in the frame: no plate, no surface, no props, no loose crumbs, no hands, no text, no watermark, no border, no cast shadow, no reflection, no gradient, no vignette. The subject is a pale golden cookie with a soft irregular top, torched marshmallow melted across the surface in caramelised patches with a few darker charred spots, graham cracker crumb scattered over it, and glossy caramelised edges.
```

## 9. Oat and cinnamon

**File:** `oat-and-cinnamon.png`

```
Photorealistic food photography of a single cookie, shot from directly overhead in a perfect 90 degree top-down bird's-eye view, camera parallel to the cookie so there is no perspective distortion. The cookie is perfectly centred in a square 1:1 frame with even margins, filling roughly 82 percent of the frame width, with the whole circular top surface in sharp focus edge to edge. Soft, even, diffused daylight from the upper left, gentle natural modelling, no hot highlights, no harsh specular glare. True-to-life colour with no colour cast, natural crumb texture, visible cracks, and a slightly irregular hand-rolled edge. Shot on a 100mm macro lens at f/8, ISO 100, high resolution, tack sharp. The background is a completely flat, uniform, pure white studio sweep (#FFFFFF) with nothing else in the frame: no plate, no surface, no props, no loose crumbs, no hands, no text, no watermark, no border, no cast shadow, no reflection, no gradient, no vignette. The subject is a rustic chewy oat cookie in a warm sandy golden brown, with visible rolled oats, plump raisins and a cinnamon sugar speckle across the top, and a coarse, slightly irregular hand-rolled edge.
```

---

## After generating: cutting them out

1. Remove the white background. Because there is no shadow or gradient to fight,
   a straight cutout on flat `#FFFFFF` should come out clean — if an edge is
   ragged, the generator added a shadow, so regenerate that one rather than
   feathering it.
2. **Export PNG with transparency**, not white.
3. **Trim to the cookie's bounding box and re-centre**, leaving an even margin of
   about **7%** on all four sides. The site already insets the image inside its
   tile, so a tight trim plus 7% lands the cookie at the right size.
4. Keep all nine exports the **same pixel dimensions** — mismatched sizes will
   make some cookies look bigger than others in the grid.
5. If two cookies look different in size *on the plate*, that is the subject line,
   not the crop — a box of four and a box of twelve should show the same cookie at
   the same scale.

## Adding or swapping one later

The shop reads `Flavour.photo` and falls back to the drawn SVG cookie when it is
empty, so you can change one flavour without touching the rest.

1. Put the file in `public/cookies/` — Vite serves that folder from the site root,
   so `public/cookies/salted-butter-chip.webp` is reachable at
   `/cookies/salted-butter-chip.webp`.
2. Either:
   - **Dashboard → Menu → Photo URL** — paste `/cookies/salted-butter-chip.webp`,
     then **Save and update the shop**. Fastest for a look, but it saves to the
     browser only, so it is a preview rather than a deploy.
   - **Or commit it** in `src/lib/data.ts` — the `photo` line is already there for
     all nine flavours; point it at the new file.
3. Delete the `photo` line and that flavour goes back to its generated SVG cookie.

The filenames are the flavour `id`s, so a re-shoot drops in with no renaming as
long as it lands on the same name.
