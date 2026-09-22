import type { DashboardOrder, Flavour } from './types'

export const BRAND = {
  name: 'Bake House',
  wordmark: ['BAKE', 'HOUSE'] as const,
  address: '88 Kiln Street',
  hours: 'Open 7am – 8pm, Tuesday to Sunday',
  phone: '(555) 124 0188',
  phoneHref: 'tel:+15551240188',
  instagram: '#top',
  tiktok: '#top',
  allergenSheet: '#faq',
} as const

export const DEMO_BANNER =
  'DEMO STOREFRONT BY BAKE HOUSE STUDIO. BUILD A BOX AND CHECK OUT — NOTHING IS CHARGED AND NO CARD IS TAKEN.'

export const TICKER = [
  'FROM 7AM',
  'GONE BY NOON',
  'FREE DELIVERY OVER $45',
  'BAKED AT SEVEN',
  'NINE FLAVOURS ONLY',
  'WARM FROM SEVEN',
  'ONE BATCH A DAY',
  'PICKUP IS FREE',
]

export const FLAVOURS: Flavour[] = [
  {
    id: 'salted-butter-chip',
    name: 'Salted butter chip',
    desc: 'The house standard. Dark chocolate chunks, flaked sea salt on top.',
    allergens: ['Wheat', 'Milk', 'Soy'],
    stock: 1,
    art: {
      base: '#d8a968',
      edge: '#bd8946',
      chips: ['#4a2c17', '#3b2110', '#5d3a1f'],
      crumb: '#b8874a',
    },
  },
  {
    id: 'triple-chocolate',
    name: 'Triple chocolate',
    desc: 'Cocoa dough, three kinds of chocolate, still gooey in the middle.',
    allergens: ['Wheat', 'Milk', 'Egg'],
    stock: 12,
    art: {
      base: '#4a2e1d',
      edge: '#341f11',
      chips: ['#6b4226', '#2a1608', '#8a5a33'],
      crumb: '#2a1608',
    },
  },
  {
    id: 'caramel-speculoos',
    name: 'Caramel speculoos',
    desc: 'Spiced biscuit folded through the dough and a spoonful hidden inside.',
    allergens: ['Wheat', 'Milk', 'Soy'],
    stock: 15,
    art: {
      base: '#c98f4e',
      edge: '#a96f32',
      chips: ['#7a3f1c', '#e0b072', '#8f4f22'],
      crumb: '#8a5423',
    },
  },
  {
    id: 'beetroot-red-velvet',
    name: 'Beetroot red velvet',
    desc: 'Cream cheese centre, white chocolate, softer than it looks.',
    allergens: ['Wheat', 'Milk', 'Egg'],
    stock: 11,
    art: {
      base: '#8e3b34',
      edge: '#6e2a25',
      chips: ['#f0e6dc', '#5a211c', '#e8d5c6'],
      crumb: '#6e2a25',
    },
  },
  {
    id: 'ceremonial-matcha',
    name: 'Ceremonial matcha',
    desc: 'Stone-ground matcha and white chocolate. Grassy, not sweet.',
    allergens: ['Wheat', 'Milk', 'Soy'],
    stock: 0,
    art: {
      base: '#93a96a',
      edge: '#76894f',
      chips: ['#f2f0e4', '#6e8049', '#dfe0cc'],
      crumb: '#7d9155',
    },
  },
  {
    id: 'raspberry-dark',
    name: 'Raspberry dark',
    desc: 'Freeze dried raspberry against dark chocolate. Sharp on the finish.',
    allergens: ['Wheat', 'Milk', 'Soy'],
    stock: 7,
    art: {
      base: '#4a2a1e',
      edge: '#341a11',
      chips: ['#b22b44', '#7a1e30', '#6b3a22'],
      crumb: '#331a10',
    },
  },
  {
    id: 'peanut-butter-cup',
    name: 'Peanut butter cup',
    desc: 'A peanut butter cup pressed into the middle, salted on top.',
    allergens: ['Wheat', 'Milk', 'Peanuts'],
    stock: 6,
    art: {
      base: '#c48a4e',
      edge: '#a36c33',
      chips: ['#5a3617', '#efd79b', '#7d4a1e'],
      crumb: '#8a5a28',
    },
  },
  {
    id: 'burnt-marshmallow',
    name: 'Burnt marshmallow',
    desc: 'Torched marshmallow and graham crumb, caramelised at the edges.',
    allergens: ['Wheat', 'Milk', 'Egg'],
    stock: 9,
    art: {
      base: '#c09a6b',
      edge: '#9e7a4c',
      chips: ['#f5ebdc', '#7a4a22', '#b9834a'],
      crumb: '#8f6a3e',
    },
  },
  {
    id: 'oat-and-cinnamon',
    name: 'Oat and cinnamon',
    desc: 'Chewy oat dough, cinnamon sugar, raisins if you ask nicely.',
    allergens: ['Wheat', 'Oats', 'Milk'],
    stock: 0,
    art: {
      base: '#c7a97c',
      edge: '#a98a5c',
      chips: ['#8a6a3e', '#e6d6b4', '#6f5228'],
      crumb: '#9a7c4e',
    },
  },
]

export interface Review {
  id: string
  quote: string
  name: string
  ago: string
}

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    quote:
      'Ordered a box of twelve for the studio and had to hide two before anyone saw the lid open. The speculoos one is a problem.',
    name: 'Danielle R.',
    ago: '3 days ago',
  },
  {
    id: 'r2',
    quote:
      'Picked up at 5.30 and it was still warm. That has never once happened with a cookie I ordered online.',
    name: 'Marcus O.',
    ago: '1 week ago',
  },
  {
    id: 'r3',
    quote:
      'Paid by transfer with the reference and the text confirmation came through before I had put my phone down.',
    name: 'Priya S.',
    ago: '2 weeks ago',
  },
  {
    id: 'r4',
    quote:
      'The salted butter chip is the whole reason I walk past two other bakeries to get here. Worth the detour.',
    name: 'Tom W.',
    ago: '3 weeks ago',
  },
  {
    id: 'r5',
    quote:
      'We put a box of twelve out at 9am and it was gone by 9.20. The bake sheet in the back office is genuinely useful.',
    name: 'Jessica M.',
    ago: '1 month ago',
  },
  {
    id: 'r6',
    quote:
      'Delivery arrived inside the window with a text two stops out. Small thing, but it is the reason I reorder.',
    name: 'Sarah M.',
    ago: '1 month ago',
  },
]

export interface FaqItem {
  id: string
  q: string
  a: string
}

export const FAQS: FaqItem[] = [
  {
    id: 'f1',
    q: 'How long do they stay soft?',
    a: 'Three days in a sealed tin at room temperature, and eight seconds in the microwave brings the middle right back. Do not refrigerate them — cold dries the middle out.',
  },
  {
    id: 'f2',
    q: 'How does paying by transfer work?',
    a: 'Choose Cash App, Venmo or bank transfer at checkout and you get a handle and a reference code. Send the amount with that reference and the order is confirmed the moment it lands, usually inside a few minutes. Orders sent without a reference take longer to match.',
  },
  {
    id: 'f3',
    q: 'What are the allergens?',
    a: 'Every flavour carries its allergens on the card, and the full sheet is linked in the footer. Everything is baked in one kitchen that handles wheat, milk, egg, soy, peanuts and tree nuts, so we cannot promise a nut-free box.',
  },
  {
    id: 'f4',
    q: 'Can I order more than one box?',
    a: 'Yes. Fill a box, then tap add another box and build a second one at any size. Everything is collected or delivered together in one slot.',
  },
  {
    id: 'f5',
    q: 'What happens if a flavour sells out after I order?',
    a: 'The kitchen checks every order before it bakes. If a flavour has run out we swap it for another at the same value and text you before we start, or refund that cookie if you would rather.',
  },
  {
    id: 'f6',
    q: 'Do you deliver outside the nine postcodes?',
    a: 'No. Delivery runs across nine postcodes, three times a day. Outside those, choose pickup — the counter is open 7am to 8pm, Tuesday to Sunday.',
  },
]

export const EXPLAINER = [
  {
    n: 1,
    title: 'Build the box',
    body: "Choose four, six or twelve and fill it with any mix of today's nine flavours. Add a second box for a different size or a different person.",
  },
  {
    n: 2,
    title: 'Pick a time',
    body: 'Collect from the counter in a three hour window between 7am and 8pm, or take one of three delivery runs between 10am and 5pm.',
  },
  {
    n: 3,
    title: 'Pay how you like',
    body: 'Card, Cash App, Venmo or bank transfer. Transfers get a reference code so the kitchen can match your payment in seconds.',
  },
]

export const TRUST = [
  { value: '4.8', stars: true, label: '1,047 reviews' },
  { value: '22 min', stars: false, label: 'Average wait for a pickup box at the counter' },
  { value: 'Same day', stars: false, label: 'Delivery on every order placed before 9am' },
  { value: 'Licensed', stars: false, label: 'Commercial kitchen, allergens on every flavour' },
]

export const BASE_BUILD_CHECKLIST = [
  'The ordering page you are on, on your own domain',
  'Box builder with live stock counts that sell out in real time',
  'Pickup windows and delivery runs you control',
  'Card, Cash App, Venmo and bank transfer with reference codes',
  'The full back office dashboard: order board, bake list, customers, stock, money',
  'Order confirmations to you and to the customer',
  'Your photos, flavours and prices, set up for you',
  'One round of changes, then it is yours to keep',
]

export const PAY_HANDLES = {
  cashapp: '$bakehouse',
  venmo: '@bakehouse',
  bank: 'Add your account in the kitchen settings',
} as const

export const PAY_LABELS: Record<'card' | 'cashapp' | 'venmo' | 'bank', { title: string; sub: string }> = {
  card: { title: 'Card', sub: 'Instant' },
  cashapp: { title: 'Cash App', sub: 'Demo handle' },
  venmo: { title: 'Venmo', sub: '@bakehouse' },
  bank: { title: 'Bank', sub: 'Transfer' },
}

/* -------------------------------------------------------------------------- */
/*  Dashboard seed                                                            */
/* -------------------------------------------------------------------------- */

export const DASHBOARD_ORDERS: DashboardOrder[] = [
  {
    id: 'o1052',
    number: '#1052',
    customer: 'Emily Carter',
    boxes: 'Box of 6',
    cookies: 6,
    window: '11-2',
    windowLabel: '11.00 to 2.00pm',
    source: 'Website',
    payment: 'paid',
    paymentMethod: 'card',
    total: 30,
    stage: 'to-make',
  },
  {
    id: 'o1053',
    number: '#1053',
    customer: 'Marcus Obi',
    boxes: 'Box of 12',
    cookies: 12,
    window: '11-2',
    windowLabel: '11.00 to 2.00pm',
    source: 'Website',
    payment: 'paid',
    paymentMethod: 'card',
    total: 54,
    stage: 'to-make',
  },
  {
    id: 'o1054',
    number: '#1054',
    customer: 'Sarah Mendez',
    boxes: '2 boxes',
    cookies: 18,
    window: '2-5',
    windowLabel: '2.00 to 5.00pm',
    source: 'Website',
    payment: 'pending',
    paymentMethod: 'bank',
    total: 76,
    stage: 'to-make',
    note: 'Nut allergy, please keep separate',
  },
  {
    id: 'o1055',
    number: '#1055',
    customer: 'Jessica Moore',
    boxes: 'Box of 6',
    cookies: 6,
    window: '2-5',
    windowLabel: '2.00 to 5.00pm',
    source: 'Website',
    payment: 'paid',
    paymentMethod: 'cashapp',
    total: 30,
    stage: 'to-make',
  },
  {
    id: 'o1056',
    number: '#1056',
    customer: 'Tom Whelan',
    boxes: 'Box of 4',
    cookies: 4,
    window: '2-5',
    windowLabel: '2.00 to 5.00pm',
    source: 'Website',
    payment: 'paid',
    paymentMethod: 'venmo',
    total: 22,
    stage: 'to-make',
  },
  {
    id: 'o1057',
    number: '#1057',
    customer: 'Priya Shah',
    boxes: 'Box of 12',
    cookies: 12,
    window: '5-8',
    windowLabel: '5.00 to 8.00pm',
    source: 'Website',
    payment: 'pending',
    paymentMethod: 'cashapp',
    total: 54,
    stage: 'to-make',
  },
  {
    id: 'o1058',
    number: '#1058',
    customer: 'Dan Reyes',
    boxes: 'Box of 6',
    cookies: 6,
    window: '5-8',
    windowLabel: '5.00 to 8.00pm',
    source: 'Website',
    payment: 'paid',
    paymentMethod: 'card',
    total: 30,
    stage: 'to-make',
  },
]

export const WINDOWS = [
  { key: '11-2' as const, label: '11.00 to 2.00pm' },
  { key: '2-5' as const, label: '2.00 to 5.00pm' },
  { key: '5-8' as const, label: '5.00 to 8.00pm' },
]

export const BAKE_SHEET = [
  { name: 'Salted butter chip', cookies: 26, note: null as string | null },
  { name: 'Caramel speculoos', cookies: 18, note: null },
  { name: 'Triple chocolate', cookies: 16, note: null },
  { name: 'Burnt marshmallow', cookies: 12, note: null },
  { name: 'Beetroot red velvet', cookies: 10, note: null },
  { name: 'Ceremonial matcha', cookies: 9, note: '1 turned away, bake extra' },
  { name: 'Raspberry dark', cookies: 8, note: null },
  { name: 'Peanut butter cup', cookies: 6, note: null },
  { name: 'Oat and cinnamon', cookies: 5, note: null },
]

export const INSIGHTS_RANKED = [
  { name: 'Salted butter chip', sold: 68, pct: 22 },
  { name: 'Caramel speculoos', sold: 54, pct: 17 },
  { name: 'Triple chocolate', sold: 47, pct: 15 },
  { name: 'Burnt marshmallow', sold: 39, pct: 12 },
  { name: 'Beetroot red velvet', sold: 31, pct: 10 },
  { name: 'Raspberry dark', sold: 26, pct: 8 },
  { name: 'Peanut butter cup', sold: 22, pct: 7 },
  { name: 'Ceremonial matcha', sold: 18, pct: 6 },
  { name: 'Oat and cinnamon', sold: 11, pct: 3 },
]

export const INSIGHTS_MISSED = [
  { name: 'Oat and cinnamon', people: 23, value: 115 },
  { name: 'Burnt marshmallow', people: 14, value: 70 },
  { name: 'Ceremonial matcha', people: 10, value: 50 },
]

export const INSIGHTS_WINDOWS = [
  { label: '11 – 2', count: 34 },
  { label: '2 – 5', count: 58 },
  { label: '5 – 8', count: 41 },
]

export const INSIGHTS_PAY = [
  { method: 'Card', pct: 50 },
  { method: 'Cash App', pct: 25 },
  { method: 'Venmo', pct: 16 },
  { method: 'Bank', pct: 9 },
]

export const CUSTOMERS = [
  { name: 'Sarah Mendez', orders: '1 order', window: 'Pickup 2-5', value: 76 },
  { name: 'Emily Carter', orders: '1 order', window: 'Pickup 11-2', value: 30 },
  { name: 'Marcus Obi', orders: '1 order', window: 'Pickup 11-2', value: 54 },
  { name: 'Jessica Moore', orders: '1 order', window: 'Pickup 2-5', value: 30 },
  { name: 'Tom Whelan', orders: '1 order', window: 'Pickup 2-5', value: 22 },
  { name: 'Priya Shah', orders: '1 order', window: 'Pickup 5-8', value: 54 },
  { name: 'Dan Reyes', orders: '1 order', window: 'Pickup 5-8', value: 30 },
]
