import { useEffect, useMemo, useRef, useState } from 'react'
import { PAY_HANDLES, PAY_LABELS } from '../lib/data'
import { copyText, dayLabel, money } from '../lib/format'
import { useShop, type CheckoutStep } from '../lib/store'
import { BOX_PRICES, DELIVERY_FEE, DELIVERY_ZIPS, type PaymentMethod } from '../lib/types'
import { useDialog } from '../lib/useDialog'
import { Check, Copy, X } from 'lucide-react'

const PICKUP_WINDOWS = ['11.00 – 2.00pm', '2.00 – 5.00pm', '5.00 – 8.00pm']
const DELIVERY_WINDOWS = [
  { label: '10.00 – 12.00', full: false },
  { label: '12.30 – 2.30pm', full: false },
  { label: '3.00 – 5.00pm', full: true },
]

/** Opening time for each window, used in the confirmation headline. */
const WINDOW_STARTS: Record<string, string> = {
  '11.00 – 2.00pm': '11.00am',
  '2.00 – 5.00pm': '2.00pm',
  '5.00 – 8.00pm': '5.00pm',
  '10.00 – 12.00': '10.00am',
  '12.30 – 2.30pm': '12.30pm',
  '3.00 – 5.00pm': '3.00pm',
}

const PAY_ORDER: PaymentMethod[] = ['card', 'cashapp', 'venmo', 'bank']

export function CheckoutModal() {
  const { checkoutOpen, checkoutStep, closeCheckout, setCheckoutStep, ensureRef } = useShop()
  const { ref } = useDialog(checkoutOpen, closeCheckout)
  const [dir, setDir] = useState<'forward' | 'back'>('forward')
  const prev = useRef<CheckoutStep>(checkoutStep)

  useEffect(() => {
    if (checkoutOpen) prev.current = 1
  }, [checkoutOpen])

  useEffect(() => {
    if (checkoutStep === 3) ensureRef()
  }, [checkoutStep, ensureRef])

  const go = (step: CheckoutStep) => {
    setDir(step >= prev.current ? 'forward' : 'back')
    prev.current = step
    setCheckoutStep(step)
  }

  if (!checkoutOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        aria-label="Close checkout"
        onClick={closeCheckout}
        className="fade-enter absolute inset-0 bg-cocoa/45 backdrop-blur-[2px]"
      />

      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        className="modal-enter relative flex h-[calc(100dvh-24px)] w-full flex-col overflow-hidden rounded-t-[30px] bg-cream shadow-lift md:h-auto md:max-h-[88dvh] md:w-[460px] md:rounded-[30px]"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-4 pb-3 md:px-6 md:pt-6">
          <div>
            <p className="label-caps text-[10px] text-ink-soft">Bakehouse checkout</p>
            <h2 className="font-display text-[26px] leading-none text-ink">
              {checkoutStep === 4 ? 'Order confirmed' : 'Checkout'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCheckout}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-shell text-ink transition-transform hover:scale-105 active:scale-95"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {checkoutStep < 4 ? (
          <div className="shrink-0 px-5 pb-4 md:px-6">
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-brick transition-[width] duration-300"
                style={{ width: `${(checkoutStep / 3) * 100}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(24px,env(safe-area-inset-bottom))] md:px-6 md:pb-6">
          <div key={checkoutStep} className={dir === 'forward' ? 'step-forward' : 'step-back'}>
            {checkoutStep === 1 ? <StepOne onNext={() => go(2)} /> : null}
            {checkoutStep === 2 ? <StepTwo onNext={() => go(3)} onBack={() => go(1)} /> : null}
            {checkoutStep === 3 ? <StepThree onBack={() => go(2)} onDone={() => go(4)} /> : null}
            {checkoutStep === 4 ? <Confirmation /> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */

function StepLabel({ step, title }: { step: number; title: string }) {
  return (
    <p className="label-caps text-[10px] text-ink-soft">
      Step {step} of 3 · {title}
    </p>
  )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="label-caps mt-6 mb-2.5 text-[10px] text-ink-soft">{children}</p>
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  hint?: string
  type?: string
  inputMode?: 'text' | 'tel' | 'email' | 'numeric'
  autoComplete?: string
  textarea?: boolean
  placeholder?: string
}

function Field({
  label,
  value,
  onChange,
  error,
  hint,
  type = 'text',
  inputMode,
  autoComplete,
  textarea,
  placeholder,
}: FieldProps) {
  const id = `f-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(' ') || undefined
  const base =
    'w-full rounded-[16px] border bg-shell px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none'
  const border = error ? 'border-brick' : 'border-line focus:border-ink/40'

  return (
    <div className="mt-4 first:mt-0">
      <label htmlFor={id} className="label-caps mb-2 block text-[10px] text-ink-soft">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} ${border} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} ${border}`}
        />
      )}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-2 text-[12px] text-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-err`} className="mt-2 text-[12px] font-semibold text-brick">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brick px-6 py-4 text-[12px] font-bold tracking-[0.09em] text-white uppercase shadow-sm transition-all hover:bg-brick-dark active:scale-95 disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint"
    >
      {children}
    </button>
  )
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-shell px-6 py-3.5 text-[11px] font-bold tracking-[0.09em] text-ink uppercase transition-all hover:border-ink/45 active:scale-95"
    >
      {children}
    </button>
  )
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  return (
    <div className="flex items-center justify-between gap-3 border-b border-line-soft py-3.5 last:border-b-0">
      <div className="min-w-0">
        <p className="label-caps text-[9px] text-ink-faint">{label}</p>
        <p className="truncate text-[15px] font-semibold text-ink">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          void copyText(value)
          setCopied(true)
          if (timer.current) window.clearTimeout(timer.current)
          timer.current = window.setTimeout(() => setCopied(false), 1500)
        }}
        aria-label={`Copy ${label}`}
        className="inline-flex items-center gap-1.5 min-h-10 shrink-0 rounded-full border border-line bg-shell px-3.5 py-1.5 text-[10px] font-bold tracking-[0.08em] text-ink uppercase transition-all hover:border-ink/50 active:scale-95 sm:min-h-0"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-leaf" strokeWidth={2.5} />
            <span className="text-leaf">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 text-ink-soft" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  )
}

function SummaryCard({ showRef }: { showRef?: boolean }) {
  const { boxes, flavours, fulfilment, orderTotal, lastOrder } = useShop()
  const source = lastOrder ? lastOrder.boxes : null
  const ref = lastOrder?.ref
  /** Once the order is placed the builder is cleared, so the receipt reads from the order itself. */
  const shown = lastOrder?.fulfilment ?? fulfilment

  const paymentLabel = lastOrder
    ? lastOrder.payment.method === 'card'
      ? 'Card'
      : PAY_LABELS[lastOrder.payment.method].title
    : null

  return (
    <div className="rounded-[22px] border border-line bg-[#faf6f0] p-4.5 shadow-xs">
      {showRef && ref ? (
        <p className="mb-3 font-display text-[24px] leading-none text-ink">{ref}</p>
      ) : null}

      <div className="space-y-3">
        {source
          ? source.map((b, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="label-caps text-[10px] text-ink-soft">
                    Box {i + 1} · {b.size}
                  </span>
                  <span className="text-[13px] font-semibold text-ink">{money(BOX_PRICES[b.size])}</span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {b.items.map((it) => (
                    <li key={it.flavourId} className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] text-ink-soft">
                        {flavours.find((f) => f.id === it.flavourId)?.name ?? it.flavourId}
                      </span>
                      <span className="text-[13px] text-ink-faint">× {it.qty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          : boxes.map((b, i) => {
              const items = flavours.filter((f) => (b.items[f.id] ?? 0) > 0)
              return (
                <div key={b.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="label-caps text-[10px] text-ink-soft">
                      Box {i + 1} · {b.size}
                    </span>
                    <span className="text-[13px] font-semibold text-ink">{money(BOX_PRICES[b.size])}</span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {items.map((f) => (
                      <li key={f.id} className="flex items-baseline justify-between gap-3">
                        <span className="text-[13px] text-ink-soft">{f.name}</span>
                        <span className="text-[13px] text-ink-faint">× {b.items[f.id]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
      </div>

      <div className="mt-4 border-t border-line-soft pt-3.5">
        <p className="text-[13px] text-ink-soft">
          {shown.mode === 'pickup'
            ? `Pickup ${dayLabel(shown.day)}, ${shown.window ?? 'window to choose'}`
            : `Delivery ${dayLabel(shown.day)}, ${shown.window ?? 'window to choose'} · ${shown.address || 'address to confirm'}`}
        </p>
        {shown.mode === 'delivery' ? (
          <p className="mt-1 flex items-baseline justify-between gap-3 text-[13px] text-ink-soft">
            <span>Delivery fee</span>
            <span>{money(DELIVERY_FEE)}</span>
          </p>
        ) : null}
        {paymentLabel ? <p className="mt-1 text-[13px] text-ink-soft">{paymentLabel} · {money(orderTotal)}</p> : null}
      </div>

      <div className="mt-3.5 flex items-baseline justify-between gap-3 border-t border-line-soft pt-3.5">
        <span className="label-caps text-[10px] text-ink-soft">Total</span>
        <span className="font-display text-[30px] leading-none text-ink">
          {money(lastOrder?.payment.total ?? orderTotal)}
        </span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Step 1                                                                    */
/* -------------------------------------------------------------------------- */

function StepOne({ onNext }: { onNext: () => void }) {
  const { days, fulfilment, setMode, patchFulfilment } = useShop()
  const [error, setError] = useState<string | null>(null)
  const delivery = fulfilment.mode === 'delivery'

  const postcodeOk = DELIVERY_ZIPS.some(
    (z) => z.toLowerCase() === fulfilment.zip.trim().replace(/\s+/g, '').toLowerCase(),
  )

  const submit = () => {
    if (!fulfilment.window) {
      setError('Choose a window to carry on.')
      return
    }
    if (delivery) {
      if (!fulfilment.zip.trim()) return setError('We need a postcode to send a driver.')
      if (!postcodeOk) return setError(`We don't deliver to ${fulfilment.zip.trim()} yet — try pickup.`)
      if (!fulfilment.address.trim()) return setError('We need a street address to deliver to.')
    }
    setError(null)
    onNext()
  }

  return (
    <div>
      <StepLabel step={1} title="How do you want it" />

      <div className="mt-4 grid grid-cols-2 gap-3" role="group" aria-label="Pickup or delivery">
        <ModeCard
          title="Pickup"
          sub="Free · 3 hour window"
          pressed={!delivery}
          onClick={() => setMode('pickup')}
        />
        <ModeCard
          title="Delivery"
          sub={`${money(DELIVERY_FEE)} · 3 runs a day`}
          pressed={delivery}
          onClick={() => setMode('delivery')}
        />
      </div>

      {delivery ? (
        <div className="mt-5">
          <Field
            label="Your postcode"
            value={fulfilment.zip}
            onChange={(v) => patchFulfilment({ zip: v })}
            autoComplete="postal-code"
            placeholder="M6J"
          />
          <Field
            label="Street address"
            value={fulfilment.address}
            onChange={(v) => patchFulfilment({ address: v })}
            autoComplete="street-address"
            placeholder="Flat, street, buzzer"
          />
          <Field
            label="Drop note for the driver"
            value={fulfilment.note}
            onChange={(v) => patchFulfilment({ note: v })}
            placeholder="Leave at the side door"
          />
        </div>
      ) : null}

      <GroupLabel>Choose a day</GroupLabel>
      <div className="grid grid-cols-4 gap-2" role="group" aria-label="Choose a day">
        {days.map((d) => (
          <button
            key={d.iso}
            type="button"
            aria-pressed={fulfilment.day === d.iso}
            onClick={() => patchFulfilment({ day: d.iso, window: null })}
            className={`min-h-11 rounded-[16px] border px-1 py-2.5 transition-colors ${
              fulfilment.day === d.iso
                ? 'border-ink bg-ink text-cream'
                : 'border-line bg-shell text-ink hover:border-ink/35'
            }`}
          >
            <span className="block font-display text-[19px] leading-none">{d.num}</span>
            <span
              className={`label-caps mt-1.5 block text-[8px] ${
                fulfilment.day === d.iso ? 'text-cream/70' : 'text-ink-soft'
              }`}
            >
              {d.label}
            </span>
          </button>
        ))}
      </div>

      <GroupLabel>{delivery ? 'Choose a delivery window' : 'Choose a 3 hour collection window'}</GroupLabel>
      <div className="grid gap-2 sm:grid-cols-3">
        {(delivery ? DELIVERY_WINDOWS : PICKUP_WINDOWS.map((label) => ({ label, full: false }))).map((w) => {
          const pressed = fulfilment.window === w.label
          return (
            <button
              key={w.label}
              type="button"
              disabled={w.full}
              aria-pressed={pressed}
              onClick={() => {
                patchFulfilment({ window: w.label })
                setError(null)
              }}
              className={`min-h-11 rounded-full border px-3 py-3 text-[12px] font-semibold transition-colors ${
                w.full
                  ? 'cursor-not-allowed border-line bg-cream-deep text-ink-faint line-through'
                  : pressed
                    ? 'border-ink bg-ink text-cream'
                    : 'border-line bg-shell text-ink hover:border-ink/35'
              }`}
            >
              {w.label}
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-ink-soft">
        {delivery
          ? 'Three runs a day between 10am and 5pm. A driver texts you when they are two stops away.'
          : 'Grey windows are already full. Boxes are made up at the start of your window, so the earlier you come the warmer they are.'}
      </p>

      {error ? (
        <p role="alert" className="mt-3 text-[12px] font-semibold text-brick">
          {error}
        </p>
      ) : null}

      <div className="mt-5">
        <PrimaryButton onClick={submit}>Continue to your details</PrimaryButton>
      </div>
    </div>
  )
}

function ModeCard({
  title,
  sub,
  pressed,
  onClick,
}: {
  title: string
  sub: string
  pressed: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 rounded-[18px] border px-4 py-3.5 text-left transition-colors ${
        pressed ? 'border-ink bg-ink text-cream' : 'border-line bg-shell text-ink hover:border-ink/35'
      }`}
    >
      <span className="block font-display text-[20px] leading-none">{title}</span>
      <span className={`label-caps mt-1.5 block text-[9px] ${pressed ? 'text-cream/65' : 'text-ink-soft'}`}>
        {sub}
      </span>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Step 2                                                                    */
/* -------------------------------------------------------------------------- */

function StepTwo({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { customer, patchCustomer } = useShop()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = () => {
    const next: Record<string, string> = {}
    if (customer.name.trim().length < 2) next.name = 'We need a name for the counter.'
    const digits = customer.mobile.replace(/\D/g, '')
    if (digits.length < 10) next.mobile = 'A 10 digit mobile number, so we can text you.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email.trim())) next.email = 'That email does not look right.'
    setErrors(next)
    if (Object.keys(next).length === 0) onNext()
  }

  return (
    <div>
      <StepLabel step={2} title="Who is it for" />

      <div className="mt-5">
        <Field
          label="Name for the order"
          value={customer.name}
          onChange={(v) => patchCustomer({ name: v })}
          error={errors.name}
          autoComplete="name"
          placeholder="Test Customer"
        />
        <Field
          label="Mobile"
          value={customer.mobile}
          onChange={(v) => patchCustomer({ mobile: v })}
          error={errors.mobile}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          hint="Used for the pickup text and nothing else."
          placeholder="555 123 4567"
        />
        <Field
          label="Email"
          value={customer.email}
          onChange={(v) => patchCustomer({ email: v })}
          error={errors.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <Field
          label="Allergies or a note for the kitchen"
          value={customer.kitchenNote}
          onChange={(v) => patchCustomer({ kitchenNote: v })}
          textarea
          placeholder="No nuts, please keep separate"
        />
      </div>

      <div className="mt-6 space-y-2.5">
        <PrimaryButton onClick={submit}>Continue to payment</PrimaryButton>
        <GhostButton onClick={onBack}>Back to time slots</GhostButton>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Step 3                                                                    */
/* -------------------------------------------------------------------------- */

function StepThree({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const { paymentMethod, setPaymentMethod, orderTotal, ref, ensureRef, placeOrder, fulfilment } = useShop()
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    ensureRef()
  }, [ensureRef])

  const reference = ref ?? 'BH-0000'

  const place = () => {
    setPlacing(true)
    placeOrder()
    onDone()
  }

  return (
    <div>
      <StepLabel step={3} title="Payment" />

      <div className="mt-4">
        <SummaryCard />
      </div>

      <GroupLabel>How do you want to pay</GroupLabel>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Payment method">
        {PAY_ORDER.map((m) => {
          const on = paymentMethod === m
          const meta = PAY_LABELS[m]
          return (
            <button
              key={m}
              type="button"
              aria-pressed={on}
              onClick={() => setPaymentMethod(m)}
              className={`min-h-11 rounded-[16px] border px-3 py-3 text-left transition-colors ${
                on ? 'border-ink bg-ink text-cream' : 'border-line bg-shell text-ink hover:border-ink/35'
              }`}
            >
              <span className="block text-[14px] font-bold">{meta.title}</span>
              <span className={`label-caps mt-1 block text-[8px] ${on ? 'text-cream/60' : 'text-ink-soft'}`}>
                {meta.sub}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5">
        {paymentMethod === 'card' ? (
          <CardTab total={orderTotal} onPlace={place} placing={placing} />
        ) : (
          <TransferTab method={paymentMethod} total={orderTotal} reference={reference} onPlace={place} placing={placing} />
        )}
      </div>

      <div className="mt-3">
        <GhostButton onClick={onBack}>Back to your details</GhostButton>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-ink-soft">
        {fulfilment.mode === 'pickup'
          ? 'Change or cancel free up to two hours before your collection window.'
          : 'Change or cancel free up to two hours before your delivery run.'}
      </p>
    </div>
  )
}

function CardTab({ total, onPlace, placing }: { total: number; onPlace: () => void; placing: boolean }) {
  return (
    <div>
      <p className="rounded-[16px] bg-cream-deep px-4 py-3 text-[12px] leading-relaxed text-ink-soft">
        Card entry is switched off in this demo. On a live shop these are Stripe fields and take a real payment.
      </p>

      <div className="mt-4 space-y-3" aria-hidden="true">
        <div>
          <p className="label-caps mb-2 text-[10px] text-ink-soft">Card number</p>
          <input
            disabled
            value="4242 4242 4242 4242"
            readOnly
            tabIndex={-1}
            className="w-full rounded-[16px] border border-dashed border-line bg-cream-deep px-4 py-3.5 text-[15px] text-ink-faint"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="label-caps mb-2 text-[10px] text-ink-soft">Expiry</p>
            <input
              disabled
              value="04 / 28"
              readOnly
              tabIndex={-1}
              className="w-full rounded-[16px] border border-dashed border-line bg-cream-deep px-4 py-3.5 text-[15px] text-ink-faint"
            />
          </div>
          <div>
            <p className="label-caps mb-2 text-[10px] text-ink-soft">CVC</p>
            <input
              disabled
              value="123"
              readOnly
              tabIndex={-1}
              className="w-full rounded-[16px] border border-dashed border-line bg-cream-deep px-4 py-3.5 text-[15px] text-ink-faint"
            />
          </div>
        </div>
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-ink-soft">
        Nothing is charged and no card details are collected or stored. Card details go straight to Stripe and never
        touch this site. Nothing is charged until the box is made up, and you can cancel free up to two hours before
        your window.
      </p>

      <div className="mt-5">
        <PrimaryButton onClick={onPlace} disabled={placing}>
          Place order · {money(total)}
        </PrimaryButton>
      </div>
    </div>
  )
}

function TransferTab({
  method,
  total,
  reference,
  onPlace,
  placing,
}: {
  method: Exclude<PaymentMethod, 'card'>
  total: number
  reference: string
  onPlace: () => void
  placing: boolean
}) {
  const handle = PAY_HANDLES[method]
  const sendBy = method === 'cashapp' ? 'Cash App' : method === 'venmo' ? 'Venmo' : 'bank transfer'

  return (
    <div>
      <h3 className="font-display text-[22px] leading-none text-ink">Send by {sendBy}</h3>

      <div className="mt-3.5 rounded-[22px] border border-line bg-shell px-4">
        <CopyRow label="Send to" value={handle} />
        <CopyRow label="Amount" value={money(total)} />
        <CopyRow label="Reference" value={reference} />
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-ink-soft">
        On a live shop, the customer sends the amount with reference{' '}
        <span className="font-semibold text-ink">{reference}</span> in the payment note, and the kitchen matches it in
        seconds. These handles are placeholders, so do not send anything.
      </p>

      <div className="mt-5">
        <PrimaryButton onClick={onPlace} disabled={placing}>
          Place order, pay by transfer
        </PrimaryButton>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Confirmation                                                              */
/* -------------------------------------------------------------------------- */

function Confirmation() {
  const { lastOrder, resetBuilder, closeCheckout } = useShop()

  const windowStart = useMemo(() => {
    const w = lastOrder?.fulfilment.window ?? ''
    if (!w) return null
    return WINDOW_STARTS[w] ?? w.split('–')[0]?.trim() ?? null
  }, [lastOrder])

  if (!lastOrder) return null

  const byTransfer = lastOrder.payment.method !== 'card'
  const where = lastOrder.fulfilment.mode === 'pickup' ? 'at the counter' : 'to your door'

  return (
    <div>
      <h3 className="heading-lg mt-1 text-ink">
        See you
        {windowStart ? ` from ${windowStart}` : ''}.
      </h3>

      <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
        {lastOrder.fulfilment.mode === 'pickup'
          ? `Give your name ${where} on ${dayLabel(lastOrder.fulfilment.day)}. `
          : `A driver will text you when they are two stops out on ${dayLabel(lastOrder.fulfilment.day)}. `}
        {byTransfer
          ? 'We will confirm by text as soon as the transfer lands, usually within a few minutes.'
          : 'Your receipt is on its way by email.'}
      </p>

      <div className="mt-5">
        <SummaryCard showRef />
      </div>

      <p className="mt-4 rounded-[16px] bg-cream-deep px-4 py-3 text-[12px] leading-relaxed text-ink-soft">
        Change or cancel free up to two hours before your window. Bring the reference{' '}
        <span className="font-semibold text-ink">{lastOrder.ref}</span> if you need to ask us anything.
      </p>

      <div className="mt-5 space-y-2.5">
        <PrimaryButton
          onClick={() => {
            resetBuilder()
            closeCheckout()
            requestAnimationFrame(() => {
              document.getElementById('build')?.scrollIntoView({ block: 'start' })
            })
          }}
        >
          Build another box
        </PrimaryButton>
        <GhostButton
          onClick={() => {
            closeCheckout()
            requestAnimationFrame(() => window.scrollTo({ top: 0 }))
          }}
        >
          Back to the shop
        </GhostButton>
      </div>
    </div>
  )
}
