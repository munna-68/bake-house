import { openBrowser, sleep } from './cdp.mjs'

const BASE = process.env.QA_URL || 'http://127.0.0.1:5188'
const PORT = 9405

console.log('Critic agent: Testing FAQ, micro-interactions, sticky controls, and typography in headless Chrome...')

const browser = await openBrowser({ port: PORT, baseUrl: BASE, width: 390, height: 844, scale: 2 })

let errors = []

try {
  await browser.goto('/')
  await sleep(1000)

  // 1. Verify typography
  console.log('\n[1/4] Checking Typography...')
  const fonts = await browser.evaluate(`(() => {
    const h1 = document.querySelector('h1');
    const h2 = document.querySelector('#pricing h2');
    const checkoutH2 = document.querySelector('h2');
    return {
      h1Font: h1 ? getComputedStyle(h1).fontFamily : '',
      h2Font: h2 ? getComputedStyle(h2).fontFamily : '',
    };
  })()`)
  console.log('  H1 font family:', fonts.h1Font)
  if (!fonts.h1Font.includes('Anton')) {
    errors.push(`H1 font should use Anton, got: ${fonts.h1Font}`)
  } else {
    console.log('  ok: H1 typography uses Anton')
  }

  // 2. Verify FAQ accordion behavior and overflow leak
  console.log('\n[2/4] Checking FAQ accordion open/close & overflow leakage...')
  const faqCheck = await browser.evaluate(`(() => {
    const panels = [...document.querySelectorAll('div[id$="-panel"]')];
    const results = panels.map(p => {
      const rect = p.getBoundingClientRect();
      const open = p.getAttribute('data-open') === 'true';
      const visibleHeight = rect.height;
      return { id: p.id, open, height: visibleHeight };
    });
    return results;
  })()`)
  console.log('  Initial FAQ panel states:', JSON.stringify(faqCheck))
  const initialOpen = faqCheck.find(f => f.open)
  const initialClosed = faqCheck.filter(f => !f.open)

  for (const c of initialClosed) {
    if (c.height > 1) {
      errors.push(`FAQ panel ${c.id} is closed but has visible height: ${c.height}px`)
    }
  }
  if (initialClosed.every(c => c.height <= 1)) {
    console.log('  ok: All closed FAQ panels have 0px height (no leakage)')
  }

  // Click closed FAQs and verify they expand
  const firstClosedBtn = await browser.evaluate(`(() => {
    const closed = document.querySelector('button[aria-expanded="false"][aria-controls$="-panel"]');
    if (!closed) return null;
    closed.click();
    return closed.getAttribute('aria-controls');
  })()`)
  await sleep(400)

  const expandedHeight = await browser.evaluate(`(() => {
    const p = document.getElementById('${firstClosedBtn}');
    return p ? p.getBoundingClientRect().height : 0;
  })()`)
  console.log(`  Expanded panel ${firstClosedBtn} height: ${expandedHeight}px`)
  if (expandedHeight < 20) {
    errors.push(`Clicked FAQ panel did not expand: height is ${expandedHeight}px`)
  } else {
    console.log('  ok: FAQ panel expands smoothly on click')
  }

  // Click it again to close and verify it collapses back to 0
  await browser.evaluate(`document.querySelector('button[aria-controls="${firstClosedBtn}"]').click()`)
  await sleep(400)
  const collapsedHeight = await browser.evaluate(`(() => {
    const p = document.getElementById('${firstClosedBtn}');
    return p ? p.getBoundingClientRect().height : 0;
  })()`)
  console.log(`  Collapsed panel ${firstClosedBtn} height: ${collapsedHeight}px`)
  if (collapsedHeight > 1) {
    errors.push(`FAQ panel did not collapse back to 0px: height is ${collapsedHeight}px`)
  } else {
    console.log('  ok: FAQ panel collapsed cleanly back to 0px')
  }

  // 3. Verify Mobile Sticky Box Controls and slot cookie images
  console.log('\n[3/4] Checking Mobile Sticky Controls & Cookie Slots...')
  // Add two cookies from different flavours
  await browser.evaluate(`document.querySelectorAll('button[aria-label^="Add "][aria-label$="to your box"]')[0]?.click()`)
  await sleep(300)
  await browser.evaluate(`document.querySelectorAll('button[aria-label^="Add "][aria-label$="to your box"]')[1]?.click()`)
  await sleep(300)

  // Scroll down
  await browser.evaluate(`window.scrollTo(0, 600)`)
  await sleep(300)

  const mobileControls = await browser.evaluate(`(() => {
    const stickyBox = document.querySelector('.sticky');
    const header = document.querySelector('header');
    const headerRect = header ? header.getBoundingClientRect() : null;
    const boxRect = stickyBox ? stickyBox.getBoundingClientRect() : null;
    const filledImgs = document.querySelectorAll('.sticky img');
    return {
      headerHeight: headerRect ? headerRect.height : 0,
      boxTop: boxRect ? boxRect.top : 0,
      isSticky: boxRect && boxRect.top <= (headerRect ? headerRect.height + 5 : 70) && boxRect.top >= 0,
      filledCookieThumbnails: filledImgs.length
    };
  })()`)
  console.log('  Mobile sticky status:', JSON.stringify(mobileControls))
  if (!mobileControls.isSticky) {
    errors.push(`Mobile box controls not sticking below header: boxTop=${mobileControls.boxTop}`)
  } else {
    console.log('  ok: Mobile box controls stick neatly below the header when scrolling')
  }
  if (mobileControls.filledCookieThumbnails < 2) {
    errors.push(`Expected at least 2 cookie thumbnails in sticky controls, found: ${mobileControls.filledCookieThumbnails}`)
  } else {
    console.log(`  ok: Sticky controls display ${mobileControls.filledCookieThumbnails} cookie thumbnail image(s) for filled slots`)
  }

  // 4. Verify Mobile Order Bar
  console.log('\n[4/4] Checking Mobile Order Bar...')
  const orderBar = await browser.evaluate(`(() => {
    const bar = document.querySelector('.sheet-enter');
    const reviewBtn = bar ? bar.querySelector('button') : null;
    const goldSegments = bar ? bar.querySelectorAll('.bg-gold').length : 0;
    return {
      present: !!bar,
      buttonText: reviewBtn ? reviewBtn.textContent.trim() : '',
      goldSegments
    };
  })()`)
  console.log('  Mobile order bar:', JSON.stringify(orderBar))
  if (!orderBar.present) {
    errors.push('Mobile order bar is not visible with items in order')
  } else {
    console.log(`  ok: Mobile order bar is visible with "${orderBar.buttonText}" and ${orderBar.goldSegments} gold segmented indicators`)
  }

} catch (err) {
  errors.push(`Critic script error: ${err.message}`)
} finally {
  await browser.close()
}

console.log('\n--- Critic Agent Verdict ---')
if (errors.length === 0) {
  console.log('ALL CRITIC VERIFICATIONS PASSED! 0 flaws found.')
  process.exit(0)
} else {
  console.error('Critic found the following issues:')
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
}
