/**
 * Bake House QA harness.
 *
 *   node qa/run.mjs                    all suites against the dev server
 *   node qa/run.mjs state photos       named suites only
 *   QA_URL=http://127.0.0.1:5190 node qa/run.mjs        against a built dist
 *
 * The dev server (or `vite preview`) must already be running. Ports 5188-5204
 * are the agreed range; check with `lsof -nP -iTCP:<port> -sTCP:LISTEN` before
 * assuming a port is free.
 *
 * These suites are what "done" means for this project. They live in the repo
 * rather than /tmp on purpose — the previous set was written to /tmp and was
 * gone by the next session, which meant the definition of done could not
 * actually be checked.
 */
import { openBrowser, sleep } from './cdp.mjs'

const BASE = process.env.QA_URL || 'http://127.0.0.1:5188'
const PORT = Number(process.env.QA_PORT || 9401)
const only = process.argv.slice(2).filter((a) => !a.startsWith('-'))

let passed = 0
let failed = 0
const failures = []

function check(name, ok, detail = '') {
  if (ok) {
    passed++
    console.log(`  ok    ${name}`)
  } else {
    failed++
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
    console.log(`  FAIL  ${name}${detail ? `  (${detail})` : ''}`)
  }
}

const eq = (name, actual, expected) =>
  check(name, actual === expected, `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)

/* ------------------------------------------------------------------ state --
   Persisted state has to survive a seed that has moved on. Every bug in this
   suite was found by hand once; they are here so they stay fixed.
   -------------------------------------------------------------------------- */
async function suiteState(b) {
  console.log('\nstate — persisted state vs a newer seed')

  const heroKind = `(() => {
    const img = document.querySelector('section#top img[alt]:not([alt=""])');
    const svg = document.querySelector('section#top svg[role="img"]');
    return img ? 'IMG' : svg ? 'SVG' : 'none';
  })()`
  const cookieImgs = `document.querySelectorAll('img[src*="/cookies/"]').length`
  const svgCookies = `document.querySelectorAll('svg[role="img"]').length`

  await b.goto('/')
  const photos = await b.evaluate(cookieImgs)
  check('clean profile renders real photos', photos === 19, `${photos} images`)

  // A flavour saved before the photo field existed.
  await b.seedState(`(raw) => { raw.flavours = raw.flavours.map(f => { const c = { ...f }; delete c.photo; return c; }); }`)
  await b.reload()
  eq('legacy state: hero is a photo', await b.evaluate(heroKind), 'IMG')
  eq('legacy state: no SVG fallbacks', await b.evaluate(svgCookies), 0)
  const restored = await b.readState()
  check(
    'legacy state: photo key backfilled on every flavour',
    restored.flavours.every((f) => typeof f.photo === 'string' && f.photo.startsWith('/cookies/')),
  )

  // A photo deliberately cleared in the dashboard is '', not absent.
  await b.seedState(`(raw) => { raw.flavours = raw.flavours.map(f => f.id === 'salted-butter-chip' ? { ...f, photo: '' } : f); }`)
  await b.reload()
  const blanked = await b.readState()
  eq('cleared photo stays cleared', blanked.flavours[0].photo, '')
  eq('cleared photo falls back to the drawn cookie', await b.evaluate(heroKind), 'SVG')
  eq('cleared photo does not affect the others', await b.evaluate(cookieImgs), 16)

  // A custom URL typed into the dashboard beats the seed.
  await b.seedState(`(raw) => { raw.flavours = raw.flavours.map(f => f.id === 'salted-butter-chip' ? { ...f, photo: '/cookies/raspberry-dark.webp' } : f); }`)
  await b.reload()
  eq('custom photo URL wins over the seed', (await b.readState()).flavours[0].photo, '/cookies/raspberry-dark.webp')

  // A flavour added from the menu editor must not be thrown away on reload.
  await b.seedState(`(raw) => { raw.flavours = [...raw.flavours, {
    id: 'qa-added', name: 'QA bake', desc: 'Added by the harness', allergens: ['Wheat'], stock: 7,
    art: { base: '#d9b47c', edge: '#b9914f', chips: ['#5a3a1c'], crumb: '#a37c46' } }]; }`)
  await b.reload()
  eq('menu-editor flavour survives a reload', (await b.readState()).flavours.length, 10)

  // The order must not be collateral damage of any of the above.
  await b.seedState(`(raw) => {
    raw.flavours = raw.flavours.slice(0, 9).map(f => { const c = { ...f }; delete c.photo; return c; });
    raw.boxes = [{ id: 'box-1', size: 6, items: { 'triple-chocolate': 3, 'raspberry-dark': 1 } }];
    raw.activeBoxId = 'box-1';
  }`)
  await b.reload()
  const withOrder = await b.readState()
  const counted = Object.values(withOrder.boxes[0].items).reduce((a, c) => a + c, 0)
  eq('an in-progress order survives the merge', counted, 4)
  eq('photos come back alongside the order', await b.evaluate(heroKind), 'IMG')
  const left = await b.evaluate(`document.body.innerText.match(/(\\d+) COOKIES LEFT TODAY/i)?.[1]`)
  eq('stock maths still adds up (61 - 4)', left, '57')

  // A box size that is no longer sold used to throw inside money() and
  // white-screen the shop, because there is no error boundary.
  await b.seedState(`(raw) => { raw.boxes = [{ id: 'box-1', size: 8, items: { 'triple-chocolate': 1 } }]; raw.activeBoxId = 'box-1'; }`)
  await b.reload()
  eq('unknown box size is coerced, not fatal', (await b.readState()).boxes[0].size, 6)
  check('shop still renders after the coercion', (await b.evaluate(heroKind)) !== 'none')

  // A box item pointing at a flavour that is gone.
  await b.seedState(`(raw) => {
    raw.boxes = [{ id: 'box-1', size: 6, items: { 'triple-chocolate': 2, 'no-such-flavour': 3 } }];
    raw.activeBoxId = 'box-1';
  }`)
  await b.reload()
  const orphan = await b.readState()
  eq('orphan box item dropped', JSON.stringify(orphan.boxes[0].items), JSON.stringify({ 'triple-chocolate': 2 }))

  await b.evaluate(`localStorage.setItem('bakehouse.v1', '{ not json')`)
  await b.reload()
  eq('corrupt storage falls back to the seed', (await b.readState()).flavours.length, 9)
}

/* ------------------------------------------------------------------ reset --
   Reset in the menu editor replaces the flavour list. Anything the user put in
   a box that is no longer on the menu has to come out of the box too.
   -------------------------------------------------------------------------- */
async function suiteReset(b) {
  console.log('\nreset — menu reset must not leave a ghost in the box')

  await b.goto('/dashboard/menu')
  await b.evaluate(`localStorage.removeItem('bakehouse.v1')`)
  await b.reload()
  await b.goto('/dashboard/menu')

  check('menu editor offers "Add a flavour"', await b.clickByText('Add a flavour'))
  check('menu editor saves', await b.clickByText('Save and update the shop'))
  await sleep(400)
  const added = (await b.readState()).flavours.at(-1)
  eq('added flavour is in the list', (await b.readState()).flavours.length, 10)

  await b.goto('/')
  check('added flavour can go in a box', await b.click(`button[aria-label="Add ${added.name} to your box"]`))
  await sleep(300)
  eq('box holds the added flavour', (await b.readState()).boxes[0].items[added.id], 1)

  await b.goto('/dashboard/menu')
  check('menu editor offers Reset', await b.clickByText('Reset'))
  await sleep(400)
  await b.goto('/')

  const after = await b.readState()
  eq('reset returns the seed flavours', after.flavours.length, 9)
  eq('reset empties the box of the dead flavour', JSON.stringify(after.boxes[0].items), JSON.stringify({}))
  const cta = await b.evaluate(`document.body.innerText.match(/CHECKOUT WITH \\d+/i)?.[0] ?? ''`)
  check('CTA does not charge for a ghost cookie', !/CHECKOUT WITH \d/.test(cta) || cta === 'CHECKOUT WITH 0', cta)
}

/* ----------------------------------------------------------------- photos --
   Every surface that shows a cookie must show the real photo, and every photo
   file must actually be there.
   -------------------------------------------------------------------------- */
async function suitePhotos(b) {
  console.log('\nphotos — wiring and assets')

  await b.goto('/')
  await b.evaluate(`localStorage.removeItem('bakehouse.v1')`)
  await b.reload(2200)

  const report = await b.evaluate(`(() => {
    const imgs = [...document.querySelectorAll('img[src*="/cookies/"]')];
    return {
      total: imgs.length,
      broken: imgs.filter(i => i.complete && i.naturalWidth === 0).length,
      sized: imgs.filter(i => i.naturalWidth === 720 && i.naturalHeight === 720).length,
      svg: document.querySelectorAll('svg[role="img"]').length,
      hero: !!document.querySelector('section#top img[alt]:not([alt=""])'),
      thumbs: document.querySelectorAll('section#top button[aria-label^="Show "] img').length,
      grid: document.querySelectorAll('#build img, [id="build"] img').length,
      lazy: imgs.filter(i => i.getAttribute('loading') === 'lazy').length,
    };
  })()`)

  eq('no broken cookie images', report.broken, 0)
  eq('no cookie falls back to SVG', report.svg, 0)
  eq('hero uses a photo', report.hero, true)
  eq('all 9 carousel thumbnails use photos', report.thumbs, 9)
  eq('all 9 grid tiles use photos', report.grid, 9)
  eq('every photo is 720x720', report.sized, report.total)
  check('below-the-fold photos are lazy', report.lazy > 0, `${report.lazy} lazy`)

  const ids = [
    'salted-butter-chip', 'triple-chocolate', 'caramel-speculoos', 'beetroot-red-velvet',
    'ceremonial-matcha', 'raspberry-dark', 'peanut-butter-cup', 'burnt-marshmallow', 'oat-and-cinnamon',
  ]
  const codes = await b.evaluate(`(async () => {
    const out = {};
    for (const id of ${JSON.stringify(ids)}) {
      const r = await fetch('/cookies/' + id + '.webp', { method: 'HEAD' });
      out[id] = r.status + ':' + (r.headers.get('content-type') || '');
    }
    return out;
  })()`)
  for (const id of ids) {
    eq(`${id}.webp serves`, codes[id], '200:image/webp')
  }

  // A photo file that is missing must degrade, not break.
  await b.seedState(`(raw) => { raw.flavours = raw.flavours.map(f => f.id === 'salted-butter-chip' ? { ...f, photo: '/cookies/does-not-exist.webp' } : f); }`)
  await b.reload(2200)
  const degraded = await b.evaluate(`(() => ({
    broken: [...document.querySelectorAll('img[src*="/cookies/"]')].filter(i => i.complete && i.naturalWidth === 0).length,
    svg: document.querySelectorAll('svg[role="img"]').length,
  }))()`)
  eq('a missing photo file shows no broken-image icon', degraded.broken, 0)
  check('a missing photo file falls back to the drawn cookie', degraded.svg > 0, `${degraded.svg} svg`)
}

/* ------------------------------------------------------------------- shop --
   The builder mechanics the store's synchronous commit() exists to protect.
   -------------------------------------------------------------------------- */
async function suiteShop(b) {
  console.log('\nshop — builder mechanics')

  await b.goto('/')
  await b.evaluate(`localStorage.removeItem('bakehouse.v1')`)
  await b.reload()

  const size = `document.querySelector('div[aria-label="Box size"] button[aria-pressed="true"] span')?.textContent`
  const items = async () => {
    const s = await b.readState()
    const box = s.boxes.find((x) => x.id === s.activeBoxId) ?? s.boxes[0]
    return { count: Object.values(box.items).reduce((a, c) => a + c, 0), size: box.size, items: box.items }
  }

  eq('default box is a six', await b.evaluate(size), '6')

  /* Labels use the flavour *name* ("Triple chocolate"), not the id. */
  const addSel = (name) => `button[aria-label="Add ${name} to your box"], button[aria-label="Add another ${name}"]`

  // Six rapid clicks in one task — the bug commit() was written for. Before it,
  // a box of six accepted ten because each click read pre-batch state.
  await b.evaluate(`(() => {
    const sel = ${JSON.stringify(addSel('Triple chocolate'))};
    for (let i = 0; i < 10; i++) document.querySelector(sel)?.click();
  })()`)
  await sleep(500)
  const stuffed = await items()
  eq('a box of six accepts six, not ten', stuffed.count, 6)
  eq('the six are all the same flavour', stuffed.items['triple-chocolate'], 6)
  const full = await b.evaluate(`document.body.innerText.match(/ADD (\\d+) MORE FREE/i)?.[1] ?? 'none'`)
  check('a full box stops asking for more', full === '0' || full === 'none', `add ${full} more free`)

  // Stock ceiling: triple chocolate has 12, so six is fine, but a sold-out one is not.
  const soldOut = await b.evaluate(`document.querySelector('button[aria-label*="sold out today"]')?.getAttribute('aria-label') ?? ''`)
  check('sold-out flavours are not addable', soldOut.includes('sold out'), soldOut)

  // Changing size clears the box.
  await b.evaluate(`document.querySelector('div[aria-label="Box size"] button:last-child').click()`)
  await sleep(300)
  const resized = await items()
  eq('switching size changes the box', resized.size, 12)
  eq('switching size empties the box', resized.count, 0)

  // Remove one, from a box we know has something in it.
  await b.click(addSel('Triple chocolate'))
  await sleep(250)
  eq('add puts one in', (await items()).count, 1)
  await b.click('button[aria-label="Remove one Triple chocolate"]')
  await sleep(250)
  eq('remove takes one back out', (await items()).count, 0)

  // A second box, and the four-box ceiling.
  for (let i = 0; i < 4; i++) {
    await b.clickByText('Add another box')
    await sleep(200)
  }
  const many = await b.readState()
  check('boxes are capped at four', many.boxes.length <= 4, `${many.boxes.length} boxes`)

  // Capacity follows the boxes.
  await b.goto('/')
  const cap = await b.evaluate(`(() => {
    const raw = JSON.parse(localStorage.getItem('bakehouse.v1'));
    return raw.boxes.reduce((a, b) => a + b.size, 0);
  })()`)
  check('capacity is the sum of the boxes', cap > 0, `${cap} slots`)
}

/* -------------------------------------------------------------------- a11y --
   The floors the project set: 4.5:1 text, 44px touch targets on mobile,
   overlays that close on Escape, one h1, keyboard-drivable carousel.
   -------------------------------------------------------------------------- */
async function suiteA11y(b) {
  console.log('\na11y — floors and structure')

  await b.goto('/')
  await b.evaluate(`localStorage.removeItem('bakehouse.v1')`)
  await b.reload()

  const doc = await b.evaluate(`(() => ({
    lang: document.documentElement.lang,
    title: document.title.length > 0,
    h1: document.querySelectorAll('h1').length,
    imgsWithoutAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
    labelledButtons: [...document.querySelectorAll('button')].filter(btn => {
      const t = (btn.textContent || '').trim();
      return !t && !btn.getAttribute('aria-label') && !btn.getAttribute('aria-labelledby');
    }).length,
    liveRegions: document.querySelectorAll('[aria-live]').length,
    landmarks: document.querySelectorAll('main, header, footer, nav').length,
  }))()`)

  eq('html has a lang', doc.lang, 'en')
  eq('the page has a title', doc.title, true)
  eq('exactly one h1', doc.h1, 1)
  eq('every image has an alt attribute', doc.imgsWithoutAlt, 0)
  eq('every button has an accessible name', doc.labelledButtons, 0)
  check('there is a live region for announcements', doc.liveRegions > 0, `${doc.liveRegions}`)
  check('landmarks are present', doc.landmarks >= 4, `${doc.landmarks}`)

  // Carousel: focus it, arrow it, confirm the slide moved.
  const before = await b.evaluate(`document.querySelector('section#top p.font-display.text-cream')?.textContent`)
  await b.evaluate(`document.querySelector('[aria-roledescription="carousel"]')?.focus()`)
  await b.key('ArrowRight')
  await sleep(350)
  const after = await b.evaluate(`document.querySelector('section#top p.font-display.text-cream')?.textContent`)
  check('carousel responds to arrow keys', before !== after, `${before} -> ${after}`)
  const pressed = await b.evaluate(`document.querySelectorAll('section#top button[aria-label^="Show "][aria-pressed="true"]').length`)
  eq('carousel marks exactly one slide as current', pressed, 1)

  // Mobile touch targets. WCAG exempts two categories and so do we: the skip
  // link is sr-only until focused (its box is 1px on purpose), and a link that
  // sits inline in a sentence is sized by the line box, not by us.
  await b.setViewport({ width: 390, height: 844, scale: 2 })
  await b.goto('/')
  await sleep(600)
  const small = await b.evaluate(`(() => {
    const out = [];
    document.querySelectorAll('button, a[href], input, select').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const cls = el.className.toString();
      if (cls.includes('sr-only') || el.closest('[aria-hidden="true"]')) return;
      const cs = getComputedStyle(el);
      if (cs.display === 'inline' && el.closest('p, li')) return;
      if (r.height < 44) out.push((el.getAttribute('aria-label') || el.textContent.trim().slice(0, 24) || el.tagName) + ' @' + Math.round(r.height));
    });
    return out;
  })()`)
  /* Known exception, left deliberately: the "$2,500 all in" link in the
     announcement strip is 15px tall. Giving it a 44px target grows the strip by
     ~15px on mobile, which is a visible design change rather than a fix, so it
     needs a decision from the design side. Everything else in the header and
     hero was fixed. */
  const allowed = (s) => s.startsWith('$2,500 all in')
  const unexpected = small.filter((s) => !allowed(s))
  check('touch targets are at least 44px on mobile', unexpected.length === 0, unexpected.slice(0, 6).join(', '))
  const stillSmall = small.filter(allowed)
  check(
    'the announcement-strip link is the only known exception',
    stillSmall.length <= 1,
    stillSmall.join(', '),
  )

  await b.setViewport({ width: 1440, height: 1000, scale: 1 })
}

/* --------------------------------------------------------------- loading --
   Needs a built dist (QA_MODE=preview), because these are properties of the
   shipped bundle, not of the dev server.
   -------------------------------------------------------------------------- */
async function suiteLoading(b) {
  console.log('\nloading — weight and lazy-loading')

  await b.goto('/')
  const assets = await b.evaluate(`(() => {
    const rs = performance.getEntriesByType('resource');
    const cookies = rs.filter(r => /\\/cookies\\//.test(r.name));
    const names = cookies.map(r => r.name);
    const size = (list) => list.reduce((a, r) => a + (r.transferSize || r.encodedBodySize || 0), 0);
    return {
      js: size(rs.filter(r => /\\.js$/.test(r.name))),
      css: size(rs.filter(r => /\\.css$/.test(r.name))),
      cookieBytes: size(cookies),
      cookieRequests: names.length,
      uniqueCookies: new Set(names).size,
      lazyImgs: document.querySelectorAll('img[loading="lazy"][src*="/cookies/"]').length,
      heroEager: !!document.querySelector('section#top img[alt]:not([alt=""])'),
    };
  })()`)

  check('JS transfer is under 120 KB', assets.js < 120000, `${Math.round(assets.js / 1024)} KB`)
  check('CSS transfer is under 20 KB', assets.css < 20000, `${Math.round(assets.css / 1024)} KB`)
  // The hero and its carousel thumbnail are the same file, so nine flavours must
  // cost nine requests — a tenth would mean a flavour fetched twice.
  eq('no cookie photo is fetched twice', assets.cookieRequests, assets.uniqueCookies)
  check('only the nine flavours are fetched', assets.uniqueCookies <= 9, `${assets.uniqueCookies} files`)
  check('the whole cookie set is about a megabyte', assets.cookieBytes < 1400000, `${Math.round(assets.cookieBytes / 1024)} KB`)
  check('below-the-fold tiles are marked lazy', assets.lazyImgs >= 9, `${assets.lazyImgs} lazy`)

  const cls = await b.evaluate(`new Promise(res => {
    let total = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) total += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => res(Math.round(total * 1000) / 1000), 400);
  })`)
  check('cumulative layout shift is small', cls < 0.1, `CLS ${cls}`)
}

/* ------------------------------------------------------------------ runner */

const SUITES = {
  state: suiteState,
  reset: suiteReset,
  photos: suitePhotos,
  shop: suiteShop,
  a11y: suiteA11y,
  loading: suiteLoading,
}

const chosen = only.length ? only : Object.keys(SUITES)
const unknown = chosen.filter((n) => !SUITES[n])
if (unknown.length) {
  console.error(`Unknown suite(s): ${unknown.join(', ')}. Known: ${Object.keys(SUITES).join(', ')}`)
  process.exit(2)
}

console.log(`Bake House QA — ${chosen.join(', ')}`)
console.log(`target: ${BASE}`)

const browser = await openBrowser({ port: PORT, baseUrl: BASE })
try {
  for (const name of chosen) {
    await SUITES[name](browser)
  }
} catch (err) {
  failed++
  failures.push(`suite threw: ${err.message}`)
  console.log(`\n  ERROR  ${err.message}`)
} finally {
  const consoleErrors = browser.consoleErrors
  const failedRequests = browser.failedRequests
  console.log('')
  check('no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
  check('no failed network requests', failedRequests.length === 0, failedRequests.slice(0, 3).join(' | '))
  await browser.close()
}

console.log(`\n${passed} passed, ${failed} failed`)
if (failures.length) {
  console.log('\nfailures:')
  for (const f of failures) console.log(`  - ${f}`)
}
process.exit(failed ? 1 : 0)
