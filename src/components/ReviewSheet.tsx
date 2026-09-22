import { BOX_PRICES } from '../lib/types'
import { money } from '../lib/format'
import { useShop } from '../lib/store'
import { useDialog } from '../lib/useDialog'

export function ReviewSheet() {
  const { reviewOpen, closeReview, boxes, boxCount, orderTotal, flavours, addBox, openCheckout, totalCookies } =
    useShop()
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
        className="sheet-enter relative max-h-[88dvh] w-full overflow-y-auto rounded-t-[30px] bg-cream px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))] shadow-lift md:max-w-[420px] md:rounded-[30px] md:pb-6"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/15 md:hidden" aria-hidden="true" />

        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-[26px] leading-none text-ink">Your order</h2>
          <button
            type="button"
            onClick={closeReview}
            aria-label="Close"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-shell text-[18px] text-ink"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {boxes.map((b, i) => {
            const items = flavours.filter((f) => (b.items[f.id] ?? 0) > 0)
            return (
              <section key={b.id} className="rounded-[22px] border border-line bg-shell p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="label-caps rounded-full bg-cocoa px-3 py-1.5 text-[10px] text-cream">
                    Box {i + 1} · {b.size}
                  </span>
                  <span className="label-caps text-[10px] text-ink-soft">
                    {boxCount(b)} of {b.size}
                  </span>
                </div>

                <ul className="mt-3.5 space-y-2">
                  {items.length === 0 ? (
                    <li className="text-[14px] text-ink-soft">Nothing in this box yet.</li>
                  ) : (
                    items.map((f) => (
                      <li key={f.id} className="flex items-baseline justify-between gap-3">
                        <span className="text-[14px] text-ink">
                          {f.name} <span className="text-ink-soft">× {b.items[f.id]}</span>
                        </span>
                      </li>
                    ))
                  )}
                </ul>

                <div className="mt-3.5 flex items-baseline justify-between gap-3 border-t border-line-soft pt-3">
                  <span className="text-[14px] text-ink-soft">Box of {b.size}</span>
                  <span className="text-[14px] font-semibold text-ink">{money(BOX_PRICES[b.size])}</span>
                </div>
              </section>
            )
          })}
        </div>

        {boxes.length < 4 ? (
          <button
            type="button"
            onClick={addBox}
            className="mt-4 w-full rounded-full border border-ink/20 px-6 py-3.5 text-[11px] font-bold tracking-[0.09em] text-ink uppercase"
          >
            + Add another box
          </button>
        ) : null}

        <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-line pt-4">
          <span className="label-caps text-[11px] text-ink-soft">Total</span>
          <span className="font-display text-[34px] leading-none text-ink">{money(orderTotal)}</span>
        </div>

        <button
          type="button"
          onClick={() => openCheckout(1)}
          disabled={totalCookies === 0}
          className="mt-4 w-full rounded-full bg-brick px-6 py-4 text-[12px] font-bold tracking-[0.09em] text-white uppercase disabled:bg-line disabled:text-ink-faint"
        >
          Checkout · {money(orderTotal)}
        </button>
      </div>
    </div>
  )
}
