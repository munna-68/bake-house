import { useEffect, useMemo, useRef, useState } from 'react'
import { PAY_HANDLES, PAY_LABELS } from '../lib/data'
import { copyText, dayLabel, money } from '../lib/format'
import { useShop, type CheckoutStep } from '../lib/store'
import { BOX_PRICES, DELIVERY_FEE, DELIVERY_ZIPS, type PaymentMethod } from '../lib/types'
import { useDialog } from '../lib/useDialog'
import { usePresence } from '../lib/usePresence'
import { SmoothCollapse } from './SmoothCollapse'
import { Check, Copy, Landmark, X } from 'lucide-react'

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

export function CheckoutModal() {
  const { checkoutOpen, checkoutStep, closeCheckout, setCheckoutStep, ensureRef } = useShop()
  const { ref } = useDialog(checkoutOpen, closeCheckout)
  const { mounted, isClosing } = usePresence(checkoutOpen, 240)
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

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6 ${
        isClosing ? 'pointer-events-none' : ''
      }`}
    >
      <button
        type="button"
        aria-label="Close checkout"
        onClick={closeCheckout}
        className={`${
          isClosing ? 'fade-exit' : 'fade-enter'
        } absolute inset-0 bg-cocoa/45 backdrop-blur-sm`}
      />

      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        className={`${
          isClosing ? 'modal-exit' : 'modal-enter'
        } relative flex h-[calc(100dvh-24px)] w-full flex-col overflow-hidden rounded-t-[30px] bg-cream shadow-lift md:h-auto md:max-h-[88dvh] md:w-[460px] md:rounded-[30px]`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-4 pb-3 md:px-6 md:pt-6">
          <div>
            <h2 className="font-display text-[28px] sm:text-[32px] leading-none text-ink">
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
      <SmoothCollapse open={Boolean(error)}>
        <p id={`${id}-err`} className="pt-2 text-[12px] font-semibold text-brick">
          {error}
        </p>
      </SmoothCollapse>
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
      className="inline-flex w-full press-apple items-center justify-center gap-2 rounded-full bg-brick px-6 py-4 text-[12px] font-bold tracking-[0.09em] text-white uppercase shadow-sm transition-all hover:bg-brick-dark active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint"
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
      className="inline-flex min-h-11 press-apple w-full items-center justify-center gap-2 rounded-full border border-line bg-shell px-6 py-3.5 text-[11px] font-bold tracking-[0.09em] text-ink uppercase transition-all hover:border-ink/45 active:scale-[0.97]"
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
        <SmoothCollapse open={shown.mode === 'delivery'}>
          <p className="pt-1 flex items-baseline justify-between gap-3 text-[13px] text-ink-soft">
            <span>Delivery fee</span>
            <span>{money(DELIVERY_FEE)}</span>
          </p>
        </SmoothCollapse>
        {paymentLabel ? <p className="mt-1 text-[13px] text-ink-soft">{paymentLabel} · {money(orderTotal)}</p> : null}
      </div>

      <div className="mt-3.5 flex items-baseline justify-between gap-3 border-t border-line-soft pt-3.5">
        <span className="label-caps text-[10px] text-ink-soft">Total</span>
        <span key={lastOrder?.payment.total ?? orderTotal} className="count-pop font-display text-[30px] leading-none text-ink">
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

      <SmoothCollapse open={delivery}>
        <div className="pt-4">
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
      </SmoothCollapse>

      <GroupLabel>Choose a day</GroupLabel>
      <div className="grid grid-cols-4 gap-2" role="group" aria-label="Choose a day">
        {days.map((d) => (
          <button
            key={d.iso}
            type="button"
            aria-pressed={fulfilment.day === d.iso}
            onClick={() => patchFulfilment({ day: d.iso, window: null })}
            className={`min-h-11 press-apple rounded-[16px] border px-1 py-2.5 transition-all duration-200 ${
              fulfilment.day === d.iso
                ? 'border-ink bg-ink text-cream shadow-xs'
                : 'border-line bg-shell text-ink hover:border-ink/35'
            }`}
          >
            <span className="block font-display text-[19px] leading-none">{d.num}</span>
            <span
              className={`label-caps mt-1.5 block text-[8px] transition-colors duration-200 ${
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
              className={`min-h-11 press-apple rounded-full border px-3 py-3 text-[12px] font-semibold transition-all duration-200 ${
                w.full
                  ? 'cursor-not-allowed border-line bg-cream-deep text-ink-faint line-through'
                  : pressed
                    ? 'border-ink bg-ink text-cream shadow-xs'
                    : 'border-line bg-shell text-ink hover:border-ink/35'
              }`}
            >
              {w.label}
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-ink-soft transition-opacity duration-200">
        {delivery
          ? 'Three runs a day between 10am and 5pm. A driver texts you when they are two stops away.'
          : 'Grey windows are already full. Boxes are made up at the start of your window, so the earlier you come the warmer they are.'}
      </p>

      <SmoothCollapse open={Boolean(error)}>
        <p role="alert" className="pt-3 text-[12px] font-semibold text-brick">
          {error}
        </p>
      </SmoothCollapse>

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
      className={`min-h-11 press-apple rounded-[18px] border px-4 py-3.5 text-left transition-all duration-200 ${
        pressed ? 'border-ink bg-ink text-cream shadow-xs' : 'border-line bg-shell text-ink hover:border-ink/35'
      }`}
    >
      <span className="block font-display text-[20px] leading-none">{title}</span>
      <span className={`label-caps mt-1.5 block text-[9px] transition-colors duration-200 ${pressed ? 'text-cream/65' : 'text-ink-soft'}`}>
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


function CreditCardIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
      <line x1="6" x2="7" y1="15" y2="15" />
      <line x1="9.5" x2="10.5" y1="15" y2="15" />
    </svg>
  )
}

function CashAppIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M31.453 4.625c-0.688-1.891-2.177-3.375-4.068-4.063-1.745-0.563-3.333-0.563-6.557-0.563h-9.682c-3.198 0-4.813 0-6.531 0.531-1.896 0.693-3.385 2.188-4.068 4.083-0.547 1.734-0.547 3.333-0.547 6.531v9.693c0 3.214 0 4.802 0.531 6.536 0.688 1.891 2.177 3.375 4.068 4.063 1.734 0.547 3.333 0.547 6.536 0.547h9.703c3.214 0 4.813 0 6.536-0.531 1.896-0.688 3.391-2.182 4.078-4.078 0.547-1.734 0.547-3.333 0.547-6.536v-9.667c0-3.214 0-4.813-0.547-6.547zM23.229 10.802l-1.245 1.24c-0.25 0.229-0.635 0.234-0.891 0.010-1.203-1.010-2.724-1.568-4.292-1.573-1.297 0-2.589 0.427-2.589 1.615 0 1.198 1.385 1.599 2.984 2.198 2.802 0.938 5.12 2.109 5.12 4.854 0 2.99-2.318 5.042-6.104 5.266l-0.349 1.604c-0.063 0.302-0.328 0.516-0.635 0.516h-2.391l-0.12-0.010c-0.354-0.078-0.578-0.432-0.505-0.786l0.375-1.693c-1.438-0.359-2.76-1.083-3.844-2.094v-0.016c-0.25-0.25-0.25-0.656 0-0.906l1.333-1.292c0.255-0.234 0.646-0.234 0.896 0 1.214 1.146 2.839 1.786 4.521 1.76 1.734 0 2.891-0.734 2.891-1.896s-1.172-1.464-3.385-2.292c-2.349-0.839-4.573-2.026-4.573-4.802 0-3.224 2.677-4.797 5.854-4.943l0.333-1.641c0.063-0.302 0.333-0.516 0.641-0.51h2.37l0.135 0.016c0.344 0.078 0.573 0.411 0.495 0.76l-0.359 1.828c1.198 0.396 2.333 1.026 3.302 1.849l0.031 0.031c0.25 0.266 0.25 0.667 0 0.906z" />
    </svg>
  )
}

function VenmoIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M40.25 4.45a14.26 14.26 0 0 1 2.06 7.8c0 9.72-8.3 22.34-15 31.2H11.91L5.74 6.58l13.47-1.28 3.27 26.24c3.05-5 6.81-12.76 6.81-18.08a14.51 14.51 0 0 0-1.29-6.52Z" />
    </svg>
  )
}

function BankIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return <Landmark className={className} strokeWidth={1.8} aria-hidden="true" />
}

function VisaLogo({ className = 'h-3 w-auto' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 12" fill="currentColor" aria-label="Visa">
      <path d="M14.07 0.3L9.2 11.7H6.01L3.66 2.52C3.52 1.97 3.4 1.77 2.97 1.54C2.26 1.16 1.06 0.8 0 0.57L0.06 0.3H5.16C5.82 0.3 6.41 0.74 6.55 1.52L7.79 8.08L10.96 0.3H14.07ZM26.4 7.91C26.42 4.89 22.21 4.73 22.24 3.38C22.25 2.97 22.64 2.53 23.53 2.41C23.97 2.35 25.18 2.3 26.44 2.88L26.96 0.45C26.25 0.19 25.33 0 24.18 0C21.24 0 19.18 1.56 19.16 3.79C19.14 5.44 20.64 6.36 21.76 6.91C22.92 7.47 23.31 7.84 23.3 8.35C23.29 9.13 22.35 9.48 21.48 9.48C19.98 9.48 19.11 9.06 18.42 8.74L17.88 11.26C18.66 11.62 20.1 11.93 21.58 11.95C24.68 11.95 26.68 10.42 26.7 8.13L26.4 7.91ZM34.24 11.7H36.96L34.64 0.3H32.12C31.54 0.3 31.05 0.64 30.83 1.17L26.35 11.7H29.62L30.27 9.91H34.27L34.61 11.7H34.24ZM31.17 7.45L32.48 3.84L33.24 7.45H31.17ZM18.43 0.3L15.91 11.7H12.79L15.31 0.3H18.43Z" />
    </svg>
  )
}

function MastercardLogo({ className = 'h-3.5 w-auto' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 17" fill="none" aria-label="Mastercard">
      <circle cx="8.5" cy="8.5" r="8.5" fill="currentColor" />
      <path
        d="M17 0a8.5 8.5 0 0 0-3.23.64A8.47 8.47 0 0 1 17 8.5a8.47 8.47 0 0 1-3.23 7.86A8.5 8.5 0 1 0 17 0z"
        fill="currentColor"
      />
    </svg>
  )
}

const PAYMENT_METHODS: Array<{
  id: PaymentMethod
  title: string
  Icon: (props: { className?: string }) => JSX.Element
}> = [
  { id: 'card', title: 'Card', Icon: CreditCardIcon },
  { id: 'cashapp', title: 'Cash App', Icon: CashAppIcon },
  { id: 'venmo', title: 'Venmo', Icon: VenmoIcon },
  { id: 'bank', title: 'Bank Transfer', Icon: BankIcon },
]

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
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5" role="group" aria-label="Payment method">
        {PAYMENT_METHODS.map(({ id, title, Icon }) => {
          const on = paymentMethod === id
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              onClick={() => setPaymentMethod(id)}
              className={`press-apple flex h-[88px] sm:h-[94px] flex-col items-start justify-between rounded-[18px] sm:rounded-[20px] p-3 sm:p-3.5 text-left transition-all ${
                on
                  ? 'border-ink bg-ink text-white shadow-sm'
                  : 'border border-line bg-[#faf6f0] text-ink hover:border-ink/40'
              }`}
            >
              <Icon className="h-6 w-6 shrink-0" />
              <span className="text-[12px] sm:text-[13.5px] font-semibold leading-tight">{title}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-5">
        <div key={paymentMethod} className="tab-fade-enter">
          {paymentMethod === 'card' ? (
            <CardTab total={orderTotal} onPlace={place} placing={placing} />
          ) : (
            <TransferTab method={paymentMethod} total={orderTotal} reference={reference} onPlace={place} placing={placing} />
          )}
        </div>
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
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [nameOnCard, setNameOnCard] = useState('')

  const handleCardNumberChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16)
    const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? digits
    setCardNumber(formatted)
  }

  const handleExpiryChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) {
      setExpiry(`${digits.slice(0, 2)} / ${digits.slice(2)}`)
    } else {
      setExpiry(digits)
    }
  }

  const handleCvcChange = (raw: string) => {
    setCvc(raw.replace(/\D/g, '').slice(0, 4))
  }

  return (
    <div>
      <h3 className="font-display text-[22px] leading-none text-ink">Send by Card</h3>

      <div className="mt-3.5 rounded-[22px] border border-line bg-[#faf6f0] p-4.5 sm:p-5 shadow-xs">
        <p className="label-caps mb-3.5 text-[10px] sm:text-[11px] font-bold tracking-wider text-ink-soft">
          CARD DETAILS
        </p>

        <div>
          <label htmlFor="card-number-input" className="mb-1.5 block text-[13px] font-medium text-ink">
            Card number
          </label>
          <div className="relative flex items-center">
            <input
              id="card-number-input"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full rounded-[14px] border border-line bg-[#faf7f2] py-3 pl-4 pr-24 text-[14px] text-ink placeholder:text-ink-faint/60 focus:border-ink/50 focus:outline-none transition-colors"
            />
            <div className="pointer-events-none absolute right-3.5 flex items-center gap-2 text-ink-soft/70">
              <VisaLogo className="h-3 w-auto opacity-75" />
              <MastercardLogo className="h-3.5 w-auto opacity-75" />
            </div>
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="expiry-input" className="mb-1.5 block text-[13px] font-medium text-ink">
              Expiry date
            </label>
            <input
              id="expiry-input"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={expiry}
              onChange={(e) => handleExpiryChange(e.target.value)}
              placeholder="MM / YY"
              className="w-full rounded-[14px] border border-line bg-[#faf7f2] px-4 py-3 text-[14px] text-ink placeholder:text-ink-faint/60 focus:border-ink/50 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="cvc-input" className="mb-1.5 block text-[13px] font-medium text-ink">
              CVC
            </label>
            <input
              id="cvc-input"
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={cvc}
              onChange={(e) => handleCvcChange(e.target.value)}
              placeholder="123"
              className="w-full rounded-[14px] border border-line bg-[#faf7f2] px-4 py-3 text-[14px] text-ink placeholder:text-ink-faint/60 focus:border-ink/50 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="mt-3.5">
          <label htmlFor="name-input" className="mb-1.5 block text-[13px] font-medium text-ink">
            Name on card
          </label>
          <input
            id="name-input"
            type="text"
            autoComplete="cc-name"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-[14px] border border-line bg-[#faf7f2] px-4 py-3 text-[14px] text-ink placeholder:text-ink-faint/60 focus:border-ink/50 focus:outline-none transition-colors"
          />
        </div>
      </div>

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
  const sendBy = method === 'cashapp' ? 'Cash App' : method === 'venmo' ? 'Venmo' : 'Bank Transfer'

  return (
    <div>
      <h3 className="font-display text-[22px] leading-none text-ink">Send by {sendBy}</h3>

      <div className="mt-3.5 rounded-[22px] border border-line bg-[#faf6f0] px-4 shadow-xs">
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
