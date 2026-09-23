import { WINDOWS } from '../lib/data'
import { money } from '../lib/format'
import type { DashboardOrder } from '../lib/types'
import { useDialog } from '../lib/useDialog'
import { Check, CheckCircle2, ChefHat, X } from 'lucide-react'

interface Props {
  open: boolean
  orders: DashboardOrder[]
  onClose: () => void
  onReady: (id: string) => void
}

/** Bench view: big type, one window at a time, for the tablet on the pass. */
export function KitchenMode({ open, orders, onClose, onReady }: Props) {
  const { ref } = useDialog(open, onClose)
  if (!open) return null

  const open_ = orders.filter((o) => o.stage !== 'collected')

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-cream" ref={ref} role="dialog" aria-modal="true" aria-label="Kitchen mode">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-cream/95 px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-cocoa text-gold shadow-xs">
            <ChefHat className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-[26px] sm:text-[28px] leading-none text-ink">Kitchen mode</h1>
            <p className="mt-1 text-[13px] text-ink-soft">
              {open_.length} orders still to make up
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-cocoa px-5 py-2.5 text-[11px] font-bold tracking-[0.09em] text-cream uppercase shadow-xs transition-all hover:bg-cocoa-soft active:scale-95"
        >
          <X className="h-4 w-4" />
          <span>Close</span>
        </button>
      </div>

      <div className="mx-auto max-w-[900px] px-5 py-8">
        <div>
          {WINDOWS.map((w) => {
            const rows = orders.filter((o) => o.window === w.key)
            if (rows.length === 0) return null
            return (
              <section key={w.key} className="mb-10">
                <h2 className="font-display text-[30px] sm:text-[34px] leading-none text-ink">{w.label}</h2>
                <ul className="mt-5 space-y-3.5">
                  {rows.map((o) => (
                    <li
                      key={o.id}
                      className={`flex flex-wrap items-center gap-4 rounded-[24px] border p-5 sm:p-6 shadow-xs transition-all ${
                        o.stage === 'collected'
                          ? 'border-line bg-cream-deep/60 opacity-60'
                          : o.payment === 'pending'
                            ? 'border-brick/40 bg-[#faf6f0]'
                            : 'border-line bg-[#faf6f0]'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-3">
                          <p className="font-display text-[26px] sm:text-[28px] leading-none text-ink">{o.customer}</p>
                          <span className="label-caps text-[10px] text-ink-soft">{o.number}</span>
                        </div>
                        <p className="mt-2 text-[15px] text-ink-soft">
                          {o.boxes} · {o.payment === 'paid' ? 'Paid' : `Unpaid ${money(o.total)}`}
                        </p>
                        {o.note ? (
                          <p className="mt-1.5 text-[14px] font-semibold text-brick">⚠️ {o.note}</p>
                        ) : null}
                      </div>
                      {o.stage === 'collected' ? (
                        <span className="inline-flex items-center gap-1.5 label-caps rounded-full bg-cream-deep px-4 py-2 text-[11px] text-ink-faint">
                          <CheckCircle2 className="h-4 w-4 text-leaf" />
                          <span>Collected</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onReady(o.id)}
                          className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[11.5px] font-bold tracking-[0.09em] uppercase shadow-xs transition-all active:scale-95 ${
                            o.stage === 'ready'
                              ? 'bg-leaf text-white hover:bg-leaf/90'
                              : 'bg-cocoa text-cream hover:bg-cocoa-soft'
                          }`}
                        >
                          <Check className="h-4 w-4" strokeWidth={2.5} />
                          <span>{o.stage === 'ready' ? 'Hand over' : 'Mark ready'}</span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
