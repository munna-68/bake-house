import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { FLAVOURS } from './data'
import { dayOptions, isoDate, makeRef } from './format'
import {
  BOX_PRICES,
  DELIVERY_FEE,
  type Box,
  type BoxSize,
  type CookieArt,
  type Customer,
  type Flavour,
  type Fulfilment,
  type PaymentMethod,
  type PlacedOrder,
  type Toast,
} from './types'

const STORAGE_KEY = 'bakehouse.v1'
const MAX_BOXES = 4
const TOAST_MS = 3200

interface Persisted {
  flavours: Flavour[]
  boxes: Box[]
  activeBoxId: string
  boxSeq: number
  fulfilment: Fulfilment
  customer: Customer
  paymentMethod: PaymentMethod
  missedDemand: Record<string, number>
  lastOrder: PlacedOrder | null
  ref: string | null
  issuedRefs: string[]
}

export type CheckoutStep = 1 | 2 | 3 | 4

interface ShopValue {
  flavours: Flavour[]
  boxes: Box[]
  activeBox: Box
  activeBoxId: string
  boxSeq: number
  boxCount: (b: Box) => number
  totalCookies: number
  capacity: number
  orderTotal: number
  cookiesLeftToday: number
  qtyInOrder: (flavourId: string) => number
  available: (flavourId: string) => number
  isBoxFull: (b: Box) => boolean
  canAdd: (flavourId: string) => boolean
  fulfilment: Fulfilment
  customer: Customer
  paymentMethod: PaymentMethod
  missedDemand: Record<string, number>
  lastOrder: PlacedOrder | null
  ref: string | null
  days: ReturnType<typeof dayOptions>
  toasts: Toast[]
  checkoutOpen: boolean
  checkoutStep: CheckoutStep
  reviewOpen: boolean
  add: (flavourId: string) => void
  remove: (flavourId: string) => void
  setSize: (size: BoxSize) => void
  addBox: () => void
  setActiveBox: (id: string) => void
  removeBox: (id: string) => void
  vote: (flavourId: string) => void
  setMode: (mode: Fulfilment['mode']) => void
  patchFulfilment: (patch: Partial<Fulfilment>) => void
  patchCustomer: (patch: Partial<Customer>) => void
  setPaymentMethod: (m: PaymentMethod) => void
  ensureRef: () => string
  placeOrder: () => PlacedOrder
  resetBuilder: () => void
  openCheckout: (step?: CheckoutStep) => void
  setCheckoutStep: (step: CheckoutStep) => void
  closeCheckout: () => void
  openReview: () => void
  closeReview: () => void
  toast: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
  updateFlavour: (
    id: string,
    patch: Partial<Pick<Flavour, 'name' | 'desc' | 'allergens' | 'stock' | 'photo'>>,
  ) => void
  addFlavour: () => void
  removeFlavour: (id: string) => void
  resetFlavours: () => void
  restockAll: () => void
  hardReset: () => void
}

const ShopCtx = createContext<ShopValue | null>(null)

export function useShop(): ShopValue {
  const ctx = useContext(ShopCtx)
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>')
  return ctx
}

function cloneFlavours(): Flavour[] {
  return FLAVOURS.map((f) => ({ ...f, allergens: [...f.allergens], art: { ...f.art, chips: [...f.art.chips] } }))
}

function makeBox(seq: number, size: BoxSize = 6): Box {
  return { id: `box-${seq}`, size, items: {} }
}

function freshFulfilment(): Fulfilment {
  return { mode: 'pickup', day: isoDate(new Date()), window: null, zip: '', address: '', note: '' }
}

const EMPTY_CUSTOMER: Customer = { name: '', mobile: '', email: '', kitchenNote: '' }

/** Palettes handed to flavours added from the dashboard menu editor. */
const NEW_FLAVOUR_ART: CookieArt[] = [
  { base: '#d9b47c', edge: '#b9914f', chips: ['#5a3a1c', '#3a2412'], crumb: '#a37c46' },
  { base: '#b98a6a', edge: '#96694c', chips: ['#f2e6d6', '#6b3f24'], crumb: '#8a5f42' },
  { base: '#7d8f5a', edge: '#5f7042', chips: ['#f0f0e2', '#4f6033'], crumb: '#6a7a49' },
  { base: '#a35348', edge: '#7f3a31', chips: ['#f6ece2', '#5c2620'], crumb: '#7a3830' },
]

function initialState(): Persisted {
  return {
    flavours: cloneFlavours(),
    boxes: [makeBox(1)],
    activeBoxId: 'box-1',
    boxSeq: 1,
    fulfilment: freshFulfilment(),
    customer: { ...EMPTY_CUSTOMER },
    paymentMethod: 'card',
    missedDemand: {},
    lastOrder: null,
    ref: null,
    issuedRefs: [],
  }
}

function load(): Persisted {
  if (typeof window === 'undefined') return initialState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState()
    const parsed = JSON.parse(raw) as Partial<Persisted>
    const base = initialState()
    if (!Array.isArray(parsed.flavours) || parsed.flavours.length !== FLAVOURS.length) return base
    const boxes = Array.isArray(parsed.boxes) && parsed.boxes.length ? parsed.boxes : base.boxes
    return {
      ...base,
      ...parsed,
      flavours: parsed.flavours as Flavour[],
      boxes,
      activeBoxId: boxes.some((b) => b.id === parsed.activeBoxId) ? (parsed.activeBoxId as string) : boxes[0].id,
      fulfilment: { ...base.fulfilment, ...(parsed.fulfilment ?? {}) },
      customer: { ...base.customer, ...(parsed.customer ?? {}) },
      missedDemand: parsed.missedDemand ?? {},
      issuedRefs: parsed.issuedRefs ?? [],
    }
  } catch {
    return initialState()
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(load)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutStep, setStep] = useState<CheckoutStep>(1)
  const [reviewOpen, setReviewOpen] = useState(false)

  const stateRef = useRef(state)
  stateRef.current = state
  const toastSeq = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage full or blocked — the shop still works for this session */
    }
  }, [state])

  useEffect(() => {
    const list = timers.current
    return () => {
      list.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, tone: Toast['tone'] = 'default') => {
      const id = ++toastSeq.current
      setToasts((prev) => [...prev.slice(-1), { id, message, tone }])
      const t = window.setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id))
      }, TOAST_MS)
      timers.current.push(t)
    },
    [],
  )

  const boxCount = useCallback((b: Box) => Object.values(b.items).reduce((a, c) => a + c, 0), [])

  const qtyByFlavour = useMemo(() => {
    const m: Record<string, number> = {}
    for (const b of state.boxes) {
      for (const [k, v] of Object.entries(b.items)) m[k] = (m[k] ?? 0) + v
    }
    return m
  }, [state.boxes])

  const activeBox = useMemo(
    () => state.boxes.find((b) => b.id === state.activeBoxId) ?? state.boxes[0],
    [state.boxes, state.activeBoxId],
  )

  const totalCookies = useMemo(() => state.boxes.reduce((a, b) => a + boxCount(b), 0), [state.boxes, boxCount])
  const capacity = useMemo(() => state.boxes.reduce((a, b) => a + b.size, 0), [state.boxes])

  const orderTotal = useMemo(
    () =>
      state.boxes.reduce((a, b) => a + BOX_PRICES[b.size], 0) +
      (state.fulfilment.mode === 'delivery' ? DELIVERY_FEE : 0),
    [state.boxes, state.fulfilment.mode],
  )

  const qtyInOrder = useCallback((flavourId: string) => qtyByFlavour[flavourId] ?? 0, [qtyByFlavour])

  const available = useCallback(
    (flavourId: string) => {
      const f = state.flavours.find((x) => x.id === flavourId)
      if (!f) return 0
      return Math.max(0, f.stock - (qtyByFlavour[flavourId] ?? 0))
    },
    [state.flavours, qtyByFlavour],
  )

  const cookiesLeftToday = useMemo(
    () => state.flavours.reduce((a, f) => a + Math.max(0, f.stock - (qtyByFlavour[f.id] ?? 0)), 0),
    [state.flavours, qtyByFlavour],
  )

  const isBoxFull = useCallback((b: Box) => boxCount(b) >= b.size, [boxCount])

  const canAdd = useCallback(
    (flavourId: string) => {
      const box = stateRef.current.boxes.find((b) => b.id === stateRef.current.activeBoxId)
      if (!box) return false
      if (boxCount(box) >= box.size) return false
      return available(flavourId) > 0
    },
    [available, boxCount],
  )

  const add = useCallback(
    (flavourId: string) => {
      const cur = stateRef.current
      const f = cur.flavours.find((x) => x.id === flavourId)
      const box = cur.boxes.find((b) => b.id === cur.activeBoxId)
      if (!f || !box) return
      if (boxCount(box) >= box.size) return
      if (Math.max(0, f.stock - (qtyByFlavour[flavourId] ?? 0)) <= 0) return

      const nextCount = boxCount(box) + 1
      const boxIndex = cur.boxes.findIndex((b) => b.id === box.id) + 1

      setState((s) => ({
        ...s,
        boxes: s.boxes.map((b) =>
          b.id === box.id ? { ...b, items: { ...b.items, [flavourId]: (b.items[flavourId] ?? 0) + 1 } } : b,
        ),
      }))

      toast(`${f.name} added. ${nextCount} of ${box.size} in box ${boxIndex}.`)
      if (nextCount >= box.size) {
        window.setTimeout(() => toast('Box full. Ready when you are', 'full'), 260)
      }
    },
    [boxCount, qtyByFlavour, toast],
  )

  const remove = useCallback(
    (flavourId: string) => {
      const cur = stateRef.current
      const box = cur.boxes.find((b) => b.id === cur.activeBoxId)
      if (!box) return
      const current = box.items[flavourId] ?? 0
      if (current <= 0) return
      setState((s) => ({
        ...s,
        boxes: s.boxes.map((b) => {
          if (b.id !== box.id) return b
          const items = { ...b.items }
          if (current - 1 <= 0) delete items[flavourId]
          else items[flavourId] = current - 1
          return { ...b, items }
        }),
      }))
    },
    [],
  )

  const setSize = useCallback((size: BoxSize) => {
    setState((s) => ({
      ...s,
      boxes: s.boxes.map((b) => (b.id === s.activeBoxId ? { ...b, size, items: {} } : b)),
    }))
  }, [])

  const addBox = useCallback(() => {
    const cur = stateRef.current
    if (cur.boxes.length >= MAX_BOXES) return
    const seq = cur.boxSeq + 1
    const box = makeBox(seq)
    setState((s) => ({ ...s, boxes: [...s.boxes, box], activeBoxId: box.id, boxSeq: seq }))
    toast(`Box ${cur.boxes.length + 1} started`)
  }, [toast])

  const setActiveBox = useCallback((id: string) => {
    setState((s) => (s.boxes.some((b) => b.id === id) ? { ...s, activeBoxId: id } : s))
  }, [])

  const removeBox = useCallback(
    (id: string) => {
      setState((s) => {
        if (s.boxes.length <= 1) return s
        const boxes = s.boxes.filter((b) => b.id !== id)
        return { ...s, boxes, activeBoxId: s.activeBoxId === id ? boxes[0].id : s.activeBoxId }
      })
    },
    [],
  )

  const vote = useCallback(
    (flavourId: string) => {
      const f = stateRef.current.flavours.find((x) => x.id === flavourId)
      if (!f) return
      setState((s) => ({
        ...s,
        missedDemand: { ...s.missedDemand, [flavourId]: (s.missedDemand[flavourId] ?? 0) + 1 },
      }))
      toast(`Noted. We will bake more ${f.name}`, 'noted')
    },
    [toast],
  )

  const setMode = useCallback((mode: Fulfilment['mode']) => {
    setState((s) => ({ ...s, fulfilment: { ...s.fulfilment, mode, window: null } }))
  }, [])

  const patchFulfilment = useCallback((patch: Partial<Fulfilment>) => {
    setState((s) => ({ ...s, fulfilment: { ...s.fulfilment, ...patch } }))
  }, [])

  const patchCustomer = useCallback((patch: Partial<Customer>) => {
    setState((s) => ({ ...s, customer: { ...s.customer, ...patch } }))
  }, [])

  const setPaymentMethod = useCallback((m: PaymentMethod) => {
    setState((s) => ({ ...s, paymentMethod: m }))
  }, [])

  const ensureRef = useCallback((): string => {
    const cur = stateRef.current
    if (cur.ref) return cur.ref
    const ref = makeRef(new Set(cur.issuedRefs))
    stateRef.current = { ...cur, ref, issuedRefs: [...cur.issuedRefs, ref] }
    setState((s) => ({ ...s, ref, issuedRefs: s.issuedRefs.includes(ref) ? s.issuedRefs : [...s.issuedRefs, ref] }))
    return ref
  }, [])

  const placeOrder = useCallback((): PlacedOrder => {
    const cur = stateRef.current
    const ref = cur.ref ?? makeRef(new Set(cur.issuedRefs))
    const ordered = { ...qtyByFlavour }

    const order: PlacedOrder = {
      ref,
      placedAt: new Date().toISOString(),
      boxes: cur.boxes.map((b) => ({
        size: b.size,
        items: Object.entries(b.items).map(([flavourId, qty]) => ({ flavourId, qty })),
      })),
      fulfilment: { ...cur.fulfilment },
      customer: { ...cur.customer },
      payment: {
        method: cur.paymentMethod,
        total: orderTotal,
        status: cur.paymentMethod === 'card' ? 'paid' : 'pending',
      },
    }

    setState((s) => ({
      ...s,
      flavours: s.flavours.map((f) =>
        ordered[f.id] ? { ...f, stock: Math.max(0, f.stock - ordered[f.id]) } : f,
      ),
      boxes: [makeBox(s.boxSeq + 1)],
      activeBoxId: `box-${s.boxSeq + 1}`,
      boxSeq: s.boxSeq + 1,
      fulfilment: { ...s.fulfilment, window: null },
      paymentMethod: 'card',
      ref: null,
      issuedRefs: s.issuedRefs.includes(ref) ? s.issuedRefs : [...s.issuedRefs, ref],
      lastOrder: order,
    }))

    return order
  }, [orderTotal, qtyByFlavour])

  const resetBuilder = useCallback(() => {
    setState((s) => {
      const seq = s.boxSeq + 1
      return { ...s, boxes: [makeBox(seq)], activeBoxId: `box-${seq}`, boxSeq: seq, ref: null }
    })
  }, [])

  const openCheckout = useCallback((step: CheckoutStep = 1) => {
    setStep(step)
    setCheckoutOpen(true)
    setReviewOpen(false)
  }, [])

  const setCheckoutStep = useCallback((step: CheckoutStep) => setStep(step), [])

  const closeCheckout = useCallback(() => {
    setCheckoutOpen(false)
    setStep(1)
  }, [])

  const openReview = useCallback(() => setReviewOpen(true), [])
  const closeReview = useCallback(() => setReviewOpen(false), [])

  const hardReset = useCallback(() => {
    setState(initialState())
    setToasts([])
  }, [])

  const updateFlavour = useCallback<ShopValue['updateFlavour']>((id, patch) => {
    setState((s) => ({
      ...s,
      flavours: s.flavours.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }))
  }, [])

  const resetFlavours = useCallback(() => {
    setState((s) => ({ ...s, flavours: cloneFlavours() }))
  }, [])

  const addFlavour = useCallback(() => {
    setState((s) => {
      const n = s.flavours.length + 1
      const palette = NEW_FLAVOUR_ART[(n - 1) % NEW_FLAVOUR_ART.length]
      const id = `new-flavour-${Date.now().toString(36)}`
      return {
        ...s,
        flavours: [
          ...s.flavours,
          {
            id,
            name: `New flavour ${n}`,
            desc: 'Describe it the way you would to a customer at the counter.',
            allergens: ['Wheat', 'Milk'],
            stock: 12,
            art: palette,
          },
        ],
      }
    })
  }, [])

  const removeFlavour = useCallback((id: string) => {
    setState((s) => {
      if (s.flavours.length <= 1) return s
      return {
        ...s,
        flavours: s.flavours.filter((f) => f.id !== id),
        boxes: s.boxes.map((b) => {
          if (!b.items[id]) return b
          const items = { ...b.items }
          delete items[id]
          return { ...b, items }
        }),
      }
    })
  }, [])

  const restockAll = useCallback(() => {
    setState((s) => ({
      ...s,
      flavours: s.flavours.map((f) => (f.stock <= 0 ? { ...f, stock: 12 } : f)),
    }))
  }, [])

  const value: ShopValue = {
    flavours: state.flavours,
    boxes: state.boxes,
    activeBox,
    activeBoxId: state.activeBoxId,
    boxSeq: state.boxSeq,
    boxCount,
    totalCookies,
    capacity,
    orderTotal,
    cookiesLeftToday,
    qtyInOrder,
    available,
    isBoxFull,
    canAdd,
    fulfilment: state.fulfilment,
    customer: state.customer,
    paymentMethod: state.paymentMethod,
    missedDemand: state.missedDemand,
    lastOrder: state.lastOrder,
    ref: state.ref,
    days: dayOptions(4),
    toasts,
    checkoutOpen,
    checkoutStep,
    reviewOpen,
    add,
    remove,
    setSize,
    addBox,
    setActiveBox,
    removeBox,
    vote,
    setMode,
    patchFulfilment,
    patchCustomer,
    setPaymentMethod,
    ensureRef,
    placeOrder,
    resetBuilder,
    openCheckout,
    setCheckoutStep,
    closeCheckout,
    openReview,
    closeReview,
    toast,
    dismissToast,
    updateFlavour,
    addFlavour,
    removeFlavour,
    resetFlavours,
    restockAll,
    hardReset,
  }

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>
}
