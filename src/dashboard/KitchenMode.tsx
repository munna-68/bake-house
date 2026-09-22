import { WINDOWS } from '../lib/data'
import { money } from '../lib/format'
import type { DashboardOrder } from '../lib/types'
import { useDialog } from '../lib/useDialog'

interface Props {
  open: boolean
  orders: DashboardOrder[]
  onClose: () => void
  onReady: (id: string) => void
}

/** Bench view: big type, one window at a time, for the tablet on the pass. */
export function KitchenMode({ open, orders, onClose, onReady }: Props) {
  const { ref, onKeyDown } = useDialog(open, onClose)
  if (!open) return null

  const open_ = orders.filter((o) => o.stage !== 'collected')

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-cream" ref={ref} role="dialog" aria-modal="true" aria-label="Kitchen mode">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-cream/95 px-5 py-4 backdrop-blur-md">
        <div>
          <h1 className="font-display text-[28px] leading-none text-ink">Kitchen mode</h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            {open_.length} orders still to make up
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-cocoa px-6 py-3 text-[11px] font-bold tracking-[0.09em] text-cream uppercase"
        >
          Close
        </button>
      </div>

      <div className="mx-auto max-w-[900px] px-5 py-8">
        <div onKeyDown={onKeyDown}>
          {WINDOWS.map((w) => {
            const rows = orders.filter((o) => o.window === w.key)
            if (rows.length === 0) return null
            return (
              <section key={w.key} className="mb-10">
                <h2 className="font-display text-[34px] leading-none text-ink">{w.label}</h2>
                <ul className="mt-5 space-y-3">
                  {rows.map((o) => (
                    <li
                      key={o.id}
                      className={`flex flex-wrap items-center gap-4 rounded-[22px] border px-5 py-4 ${
                        o.stage === 'collected'
                          ? 'border-line bg-cream-deep opacity-60'
                          : o.payment === 'pending'
                            ? 'border-brick/40 bg-shell'
                            : 'border-line bg-shell'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[26px] leading-none text-ink">{o.customer}</p>
                        <p className="mt-2 text-[15px] text-ink-soft">
                          {o.boxes} · {o.number} · {o.payment === 'paid' ? 'Paid' : `Unpaid ${money(o.total)}`}
                        </p>
                        {o.note ? (
                          <p className="mt-1.5 text-[14px] font-semibold text-brick">{o.note}</p>
                        ) : null}
                      </div>
                      {o.stage === 'collected' ? (
                        <span className="label-caps text-[11px] text-ink-faint">Collected</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onReady(o.id)}
                          className="rounded-full bg-cocoa px-7 py-4 text-[12px] font-bold tracking-[0.09em] text-cream uppercase"
                        >
                          {o.stage === 'ready' ? 'Hand over' : 'Mark ready'}
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
