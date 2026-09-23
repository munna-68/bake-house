import { BOX_PRICES, type Box } from '../lib/types'
import { money } from '../lib/format'
import { useShop } from '../lib/store'
import { useDialog } from '../lib/useDialog'
import { CookieTile } from './Cookie'
import { ArrowRight, Minus, Plus, X } from 'lucide-react'

function ReviewSlotRow({ box }: { box: Box }) {
  const { flavours, remove } = useShop()
  const filled: string[] = []
  for (const f of flavours) {
    const n = box.items[f.id] ?? 0
    for (let i = 0; i < n; i++) filled.push(f.id)
  }
  const cols = box.size === 4 ? 'grid-cols-4 max-w-[200px]' : 'grid-cols-6'

  return (
    <ul className={`grid w-full ${cols} gap-1.5`}>
      {Array.from({ length: box.size }).map((_, i) => {
        const flavourId = filled[i]
        const flavour = flavourId ? flavours.find((f) => f.id === flavourId) : undefined
        return (
          <li
            key={i}
            className={`relative aspect-square rounded-full flex items-center justify-center transition-all ${
              flavour
                ? 'bg-shell shadow-xs border border-line-soft'
                : 'border border-dashed border-[#d8cdbf] bg-cream/50'
            }`}
          >
            {flavour ? (
              <>
                <div className="h-full w-full overflow-hidden rounded-full p-0.5">
                  <CookieTile
                    art={flavour.art}
                    seedKey={`rev-slot-${box.id}-${flavour.id}-${i}`}
                    photo={flavour.photo}
                    className="h-full w-full"
                    inset={2}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(flavour.id)}
                  aria-label={`Remove one ${flavour.name}`}
                  className="absolute -top-1 -right-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-brick text-white shadow-xs transition-transform active:scale-90"
                >
                  <X className="h-2 w-2" strokeWidth={3} aria-hidden="true" />
                </button>
              </>
            ) : (
              <span className="text-[10px] font-bold text-ink-faint/50" aria-hidden="true">
                {i + 1}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function ReviewSheet() {
  const {
    reviewOpen,
    closeReview,
    boxes,
    boxCount,
    orderTotal,
    flavours,
    add,
    remove,
    addBox,
    openCheckout,
    totalCookies,
    canAdd,
  } = useShop()
  const { ref } = useDialog(reviewOpen, closeReview)

  if (!reviewOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center">
      <button
        type="button"
        aria-label="Close your order"
        onClick={closeReview}
        className="fade-enter absolute inset-0 bg-cocoa/45 backdrop-blur-[2px]"
      />

      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className="sheet-enter relative max-h-[88dvh] w-full overflow-y-auto rounded-t-[30px] bg-cream px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))] shadow-lift md:max-w-[460px] md:rounded-[30px] md:pb-6"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/15 md:hidden" aria-hidden="true" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label-caps text-[10px] text-ink-soft">Review your box</p>
            <h2 className="font-display text-[26px] leading-tight text-ink">Your order</h2>
          </div>
          <button
            type="button"
            onClick={closeReview}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-shell text-ink transition-transform hover:scale-105 active:scale-95"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {boxes.map((b, i) => {
            const count = boxCount(b)
            const items = flavours.filter((f) => (b.items[f.id] ?? 0) > 0)
            return (
              <section
                key={b.id}
                className="rounded-[22px] border border-line bg-[#faf6f0] p-4 sm:p-5 shadow-xs transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="label-caps rounded-full bg-brick px-3 py-1.5 text-[10px] font-bold text-white">
                    Box {i + 1} · {b.size} cookies
                  </span>
                  <span className="label-caps text-[10px] font-semibold text-ink-soft">
                    {count} of {b.size} filled
                  </span>
                </div>

                {/* Visual slot circles preview with cookie images */}
                <div className="mt-3.5 rounded-[16px] border border-line-soft bg-shell/80 p-2.5">
                  <ReviewSlotRow box={b} />
                </div>

                {/* Flavour items list with images and quantity controls */}
                <ul className="mt-3.5 space-y-2.5 divide-y divide-line-soft">
                  {items.length === 0 ? (
                    <li className="py-2 text-[13.5px] text-ink-soft text-center">
                      Nothing in this box yet. Select flavours to fill.
                    </li>
                  ) : (
                    items.map((f) => (
                      <li key={f.id} className="flex items-center justify-between gap-3 pt-2.5 first:pt-0">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-line-soft bg-shell">
                            <CookieTile
                              art={f.art}
                              seedKey={`rev-item-${b.id}-${f.id}`}
                              photo={f.photo}
                              className="h-full w-full"
                              inset={2}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13.5px] font-semibold text-ink">{f.name}</p>
                            <p className="text-[11px] text-ink-soft/75">{f.allergens.join(', ')}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => remove(f.id)}
                            aria-label={`Remove one ${f.name}`}
                            className="grid h-7 w-7 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 active:scale-95"
                          >
                            <Minus className="h-3 w-3" aria-hidden="true" />
                          </button>
                          <span className="w-5 text-center text-[13px] font-bold text-ink">
                            {b.items[f.id]}
                          </span>
                          <button
                            type="button"
                            onClick={() => add(f.id)}
                            disabled={!canAdd(f.id)}
                            aria-label={`Add one ${f.name}`}
                            className="grid h-7 w-7 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    ))
                  )}
                </ul>

                <div className="mt-3.5 flex items-baseline justify-between gap-3 border-t border-line-soft pt-3">
                  <span className="text-[13px] text-ink-soft">Box of {b.size}</span>
                  <span className="font-display text-[18px] font-bold text-ink">{money(BOX_PRICES[b.size])}</span>
                </div>
              </section>
            )
          })}
        </div>

        {boxes.length < 4 ? (
          <button
            type="button"
            onClick={addBox}
            className="mt-4 w-full rounded-full border border-line bg-shell py-3 text-[11px] font-bold tracking-[0.09em] text-ink uppercase transition-all hover:border-ink/40 active:scale-95"
          >
            + Add another box
          </button>
        ) : null}

        <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-line pt-4">
          <span className="label-caps text-[11px] text-ink-soft">Total</span>
          <span className="font-display text-[32px] sm:text-[36px] font-bold leading-none text-ink">
            {money(orderTotal)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            closeReview()
            openCheckout(1)
          }}
          disabled={totalCookies === 0}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brick px-6 py-4 text-[12px] font-bold tracking-[0.09em] text-white uppercase shadow-sm transition-all hover:bg-brick-dark active:scale-95 disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint"
        >
          <span>Checkout · {money(orderTotal)}</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
