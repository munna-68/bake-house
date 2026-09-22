export type BoxSize = 4 | 6 | 12

export const BOX_PRICES: Record<BoxSize, number> = {
  4: 22,
  6: 30,
  12: 54,
}

export const BOX_SIZES: BoxSize[] = [4, 6, 12]

export const DELIVERY_FEE = 6

/** Postcodes the delivery run covers. Anything else is pickup only. */
export const DELIVERY_ZIPS = [
  'M4L',
  'M4M',
  'M4K',
  'M5A',
  'M5C',
  'M6G',
  'M6H',
  'M6J',
  'M6P',
] as const

export type FulfilmentMode = 'pickup' | 'delivery'

export type PaymentMethod = 'card' | 'cashapp' | 'venmo' | 'bank'

export interface CookieArt {
  /** dough body */
  base: string
  /** darker outer rim */
  edge: string
  /** chunk / inclusion colours, drawn largest first */
  chips: string[]
  /** crumb speckle colour */
  crumb: string
}

export interface Flavour {
  id: string
  name: string
  desc: string
  allergens: string[]
  /** cookies still on the rack at the start of the day */
  stock: number
  art: CookieArt
}

export interface Box {
  id: string
  size: BoxSize
  /** flavourId -> quantity */
  items: Record<string, number>
}

export interface Fulfilment {
  mode: FulfilmentMode
  /** ISO date, e.g. 2026-09-22 */
  day: string
  /** window label, e.g. "11.00 – 2.00pm" */
  window: string | null
  zip: string
  address: string
  note: string
}

export interface Customer {
  name: string
  mobile: string
  email: string
  kitchenNote: string
}

export interface PlacedOrder {
  ref: string
  placedAt: string
  boxes: Array<{ size: BoxSize; items: Array<{ flavourId: string; qty: number }> }>
  fulfilment: Fulfilment
  customer: Customer
  payment: { method: PaymentMethod; total: number; status: 'paid' | 'pending' }
}

export type PaymentStatus = 'paid' | 'pending'
export type OrderStage = 'to-make' | 'ready' | 'collected'

export interface DashboardOrder {
  id: string
  number: string
  customer: string
  boxes: string
  cookies: number
  window: '11-2' | '2-5' | '5-8'
  windowLabel: string
  source: string
  payment: PaymentStatus
  paymentMethod: PaymentMethod
  total: number
  stage: OrderStage
  note?: string
}

export interface Toast {
  id: number
  message: string
  tone: 'default' | 'full' | 'noted'
}
