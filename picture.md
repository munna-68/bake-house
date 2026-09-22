# picture.md — cookie photo prompts

Nine prompts, one per flavour, written to be pasted into an AI image generator
**one at a time, in a fresh context**. Every prompt is fully self-contained: it
repeats the same camera, lighting and background language word for word. That
repetition is the whole trick — paraphrase it once and that cookie will not match
the other eight.

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

## Dropping them into the site

The shop already supports real photos and falls back to the drawn cookie when one
is missing, so you can add them one at a time.

1. Save the PNGs to `public/cookies/` — Vite serves that folder from the site root,
   so `public/cookies/salted-butter-chip.png` is reachable at
   `/cookies/salted-butter-chip.png`.
2. Wire them up either way:
   - **Dashboard → Menu → Photo URL** — paste `/cookies/salted-butter-chip.png`,
     then **Save and update the shop**. Fastest, and it is live immediately.
     Note this saves to the browser only, so it is a preview rather than a deploy.
   - **Or commit them** in `src/lib/data.ts` by adding a `photo` line to each
     flavour:
     ```ts
     {
       id: 'salted-butter-chip',
       name: 'Salted butter chip',
       // ...
       photo: '/cookies/salted-butter-chip.png',
     }
     ```
3. Leave `photo` out and that flavour keeps its generated SVG cookie — useful
   while you are still shooting the set.

The filenames above are already the flavour `id`s, so they drop straight in with
no renaming.
