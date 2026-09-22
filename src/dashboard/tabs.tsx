import { useState } from 'react'
import {
  BAKE_SHEET,
  CUSTOMERS,
  INSIGHTS_MISSED,
  INSIGHTS_PAY,
  INSIGHTS_RANKED,
  INSIGHTS_WINDOWS,
  WINDOWS,
} from '../lib/data'
import { initials as toInitials, money, trays } from '../lib/format'
import { useShop } from '../lib/store'
import type { DashboardOrder } from '../lib/types'

export interface OrderActions {
  markReady: (id: string) => void
  markCollected: (id: string) => void
  markReceived: (id: string) => void
}

const STAGE_LABEL: Record<DashboardOrder['stage'], string> = {
  'to-make': 'To make up',
  ready: 'Ready',
  collected: 'Collected',
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-[22px] border p-5 ${
        highlight ? 'border-transparent bg-cream-deep' : 'border-line bg-shell'
      }`}
    >
      <p className="label-caps text-[10px] text-ink-soft">{label}</p>
      <p className="mt-2.5 font-display text-[34px] leading-none text-ink">{value}</p>
      {sub ? <p className="mt-2 text-[13px] text-ink-soft">{sub}</p> : null}
    </div>
  )
}

export function Avatar({ name }: { name: string }) {
  return (
    <span className="label-caps grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream-deep text-[11px] text-ink-soft">
      {toInitials(name)}
    </span>
  )
}

export function PaymentChip({ order }: { order: DashboardOrder }) {
  if (order.payment === 'pending') {
    return <span className="label-caps rounded-full bg-brick/12 px-2.5 py-1 text-[9px] text-brick">Unpaid</span>
  }
  return <span className="label-caps rounded-full bg-leaf-soft px-2.5 py-1 text-[9px] text-leaf">Paid</span>
}

function ReadyButton({
  order,
  actions,
  onDark,
}: {
  order: DashboardOrder
  actions: OrderActions
  onDark?: boolean
}) {
  const base = onDark
    ? 'rounded-full bg-cream px-4 py-2.5 text-[10px] font-bold tracking-[0.09em] text-cocoa uppercase transition-colors hover:bg-white'
    : 'rounded-full border border-ink/20 px-4 py-2 text-[10px] font-bold tracking-[0.09em] text-ink uppercase transition-colors hover:border-ink/50'

  if (order.stage === 'collected') {
    return <span className={`label-caps text-[9px] ${onDark ? 'text-cream/50' : 'text-ink-faint'}`}>Collected</span>
  }
  if (order.stage === 'ready') {
    return (
      <button type="button" onClick={() => actions.markCollected(order.id)} className={base}>
        Mark collected
      </button>
    )
  }
  return (
    <button type="button" onClick={() => actions.markReady(order.id)} className={base}>
      Mark ready
    </button>
  )
}

/* -------------------------------------------------------------------------- */

export function TodayTab({
  orders,
  actions,
  onKitchen,
}: {
  orders: DashboardOrder[]
  actions: OrderActions
  onKitchen: () => void
}) {
  const { restockAll, toast } = useShop()
  const open = orders.filter((o) => o.stage !== 'collected')
  const next = open[0]
  const taken = orders.filter((o) => o.payment === 'paid').reduce((a, o) => a + o.total, 0)
  const outstanding = orders.filter((o) => o.payment === 'pending').reduce((a, o) => a + o.total, 0)
  const handedOver = orders.filter((o) => o.stage === 'collected').length
  const cookies = orders.reduce((a, o) => a + o.cookies, 0)

  return (
    <div className="space-y-5">
      {next ? (
        <section className="rounded-[26px] bg-cocoa p-6 text-cream">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="label-caps text-[10px] text-cream/50">Next out the door</p>
              <h2 className="mt-3 font-display text-[36px] leading-none text-cream">{next.customer}</h2>
              <p className="mt-2.5 text-[14px] text-cream/70">
                {next.boxes} · {next.number}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="label-caps rounded-full bg-cream/12 px-3 py-1.5 text-[9px] text-cream/80">
                  Pickup, {next.windowLabel}
                </span>
                <span className="label-caps rounded-full bg-cream/12 px-3 py-1.5 text-[9px] text-cream/80">
                  {next.source}
                </span>
                <span className="label-caps rounded-full bg-cream/12 px-3 py-1.5 text-[9px] text-cream/80">
                  {next.payment === 'paid' ? `Paid ${money(next.total)}` : `Unpaid ${money(next.total)}`}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-[44px] leading-none text-cream">{open.length}</p>
              <p className="label-caps mt-1 text-[9px] text-cream/50">Still open</p>
            </div>
          </div>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            <ReadyButton order={next} actions={actions} onDark />
            <button
              type="button"
              onClick={onKitchen}
              className="rounded-full border border-cream/25 px-4 py-2.5 text-[10px] font-bold tracking-[0.09em] text-cream uppercase transition-colors hover:border-cream/60"
            >
              Kitchen mode
            </button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Taken today" value={money(taken)} sub={`${orders.length} orders`} highlight />
        <StatCard label="Cookies to bake" value={String(cookies)} sub="9 flavours on" />
        <StatCard
          label="Handed over"
          value={`${handedOver} of ${orders.length}`}
          sub={`${orders.length - handedOver} still to make up`}
        />
        <StatCard label="Waiting on payment" value={money(outstanding)} sub="Chase these" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section className="rounded-[22px] border border-line bg-shell p-5">
          <h2 className="font-display text-[22px] leading-none text-ink">The day, window by window</h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">Who is coming and when</p>

          <div className="mt-5 space-y-6">
            {WINDOWS.map((w) => {
              const rows = orders.filter((o) => o.window === w.key)
              const collected = rows.filter((o) => o.stage === 'collected').length
              const cookiesInWindow = rows.reduce((a, o) => a + o.cookies, 0)
              return (
                <div key={w.key}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-[15px] font-bold text-ink">{w.label}</h3>
                    <p className="label-caps text-[9px] text-ink-faint">
                      {rows.length} orders · {cookiesInWindow} cookies
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-cream-deep">
                      <div
                        className="h-full rounded-full bg-cocoa"
                        style={{ width: `${rows.length ? (collected / rows.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="label-caps shrink-0 text-[9px] text-ink-faint">
                      {collected} of {rows.length} collected
                    </span>
                  </div>

                  <ul className="mt-3 space-y-2">
                    {rows.map((o) => (
                      <li
                        key={o.id}
                        className="flex flex-wrap items-center gap-3 rounded-[16px] border border-line-soft px-3 py-2.5"
                      >
                        <Avatar name={o.customer} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold text-ink">{o.customer}</p>
                          <p className="text-[12px] text-ink-soft">
                            {o.boxes} · {o.number}
                          </p>
                        </div>
                        <PaymentChip order={o} />
                        <ReadyButton order={o} actions={actions} />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-[22px] border border-line bg-shell p-5">
          <h2 className="font-display text-[22px] leading-none text-ink">Needs attention</h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">Only what will not sort itself out</p>

          <ul className="mt-5 space-y-3">
            {orders
              .filter((o) => o.payment === 'pending')
              .map((o) => (
                <li key={o.id} className="rounded-[16px] border-l-[3px] border-brick bg-cream px-4 py-3.5">
                  <p className="text-[14px] font-semibold text-ink">{o.customer} has not paid</p>
                  <p className="mt-1 text-[12px] text-ink-soft">
                    {o.number} · {money(o.total)} · Pickup, {o.windowLabel}
                  </p>
                  <button
                    type="button"
                    onClick={() => actions.markReceived(o.id)}
                    className="mt-2.5 rounded-full border border-ink/20 px-4 py-1.5 text-[10px] font-bold tracking-[0.09em] text-ink uppercase"
                  >
                    Mark received
                  </button>
                </li>
              ))}

            <li className="rounded-[16px] border-l-[3px] border-gold bg-cream px-4 py-3.5">
              <p className="text-[14px] font-semibold text-ink">Note from Sarah Mendez</p>
              <p className="mt-1 text-[12px] text-ink-soft">Nut allergy, please keep separate</p>
              <button
                type="button"
                onClick={() => toast('Order note opened')}
                className="mt-2.5 rounded-full border border-ink/20 px-4 py-1.5 text-[10px] font-bold tracking-[0.09em] text-ink uppercase"
              >
                Open
              </button>
            </li>

            <li className="rounded-[16px] border-l-[3px] border-gold bg-cream px-4 py-3.5">
              <p className="text-[14px] font-semibold text-ink">2 flavours are sold out</p>
              <p className="mt-1 text-[12px] text-ink-soft">
                Ceremonial matcha, Oat and cinnamon. The shop is still taking the rest.
              </p>
              <button
                type="button"
                onClick={() => {
                  restockAll()
                  toast('Sold-out flavours restocked')
                }}
                className="mt-2.5 rounded-full border border-ink/20 px-4 py-1.5 text-[10px] font-bold tracking-[0.09em] text-ink uppercase"
              >
                Restock
              </button>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

const FILTERS = ['All', 'To make up', 'Ready', 'Unpaid', 'Collected'] as const
type Filter = (typeof FILTERS)[number]

export function OrdersTab({ orders, actions }: { orders: DashboardOrder[]; actions: OrderActions }) {
  const [state, setState] = useState<Filter>('All')

  const rows = orders.filter((o) => {
    if (state === 'All') return true
    if (state === 'Unpaid') return o.payment === 'pending'
    return STAGE_LABEL[o.stage] === state
  })

  return (
    <section className="rounded-[22px] border border-line bg-shell p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px] leading-none text-ink">All orders</h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">
            {rows.length} of {orders.length} shown
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={state === f}
              onClick={() => setState(f)}
              className={`label-caps rounded-full px-3.5 py-2 text-[10px] transition-colors ${
                state === f ? 'bg-cocoa text-cream' : 'border border-line text-ink-soft hover:border-ink/35'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {rows.map((o) => (
          <li
            key={o.id}
            className="flex flex-wrap items-center gap-3 rounded-[16px] border border-line-soft px-3.5 py-3"
          >
            <Avatar name={o.customer} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-ink">{o.customer}</p>
              <p className="text-[12px] text-ink-soft">
                {o.boxes} · {o.number} · Pickup {o.windowLabel}
              </p>
            </div>
            <PaymentChip order={o} />
            <span className="label-caps hidden text-[9px] text-ink-faint sm:block">{money(o.total)}</span>
            <ReadyButton order={o} actions={actions} />
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="rounded-[16px] border border-dashed border-line px-4 py-8 text-center text-[13px] text-ink-soft">
            Nothing in this filter right now.
          </li>
        ) : null}
      </ul>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

export function BakeSheetTab() {
  const total = BAKE_SHEET.reduce((a, r) => a + r.cookies, 0)

  return (
    <section className="rounded-[22px] border border-line bg-shell p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px] leading-none text-ink">Bake sheet</h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">
            Every cookie ordered for today, counted into trays
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full border border-ink/20 px-5 py-2.5 text-[10px] font-bold tracking-[0.09em] text-ink uppercase transition-colors hover:border-ink/50"
        >
          Print
        </button>
      </div>

      <ul className="mt-5 space-y-2">
        {BAKE_SHEET.map((row) => (
          <li
            key={row.name}
            className="flex flex-wrap items-center gap-4 rounded-[16px] border border-line-soft px-4 py-3.5"
          >
            <div className="w-[86px] shrink-0">
              <p className="font-display text-[30px] leading-none text-ink">{row.cookies}</p>
              <p className="label-caps mt-1 text-[9px] text-ink-faint">Cookies</p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-ink">{row.name}</p>
              <p className="text-[12px] text-ink-soft">{trays(row.cookies)} trays at 12 a tray</p>
              {row.note ? <p className="mt-1 text-[12px] font-semibold text-gold">{row.note}</p> : null}
            </div>
            <div className="shrink-0 rounded-[14px] bg-cream-deep px-3.5 py-2 text-center">
              <p className="font-display text-[18px] leading-none text-ink">{trays(row.cookies)}</p>
              <p className="label-caps mt-0.5 text-[8px] text-ink-soft">Trays</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t-2 border-ink pt-4">
        <span className="label-caps text-[10px] text-ink-soft">Total to bake</span>
        <span className="font-display text-[36px] leading-none text-ink">{total}</span>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

export function InsightsTab() {
  const missedTotal = INSIGHTS_MISSED.reduce((a, m) => a + m.value, 0)
  const missedPeople = INSIGHTS_MISSED.reduce((a, m) => a + m.people, 0)
  const busiest = INSIGHTS_WINDOWS.reduce((a, w) => (w.count > a.count ? w : a), INSIGHTS_WINDOWS[0])

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Cookies sold" value="316" sub="in the last 7 days" highlight />
        <StatCard label="Best seller" value="Salted butter chip" sub="68 of them" />
        <StatCard label="Typical box" value="4 cookies" sub="across 88 boxes" />
        <StatCard label="Repeat customers" value="38%" sub="had ordered before" />
      </section>

      <section className="rounded-[22px] border border-line bg-shell p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-[22px] leading-none text-ink">What sold this week</h2>
            <p className="mt-1.5 text-[13px] text-ink-soft">Every flavour, ranked</p>
          </div>
          <span className="label-caps rounded-full bg-cream-deep px-3 py-1.5 text-[9px] text-ink-soft">
            316 cookies
          </span>
        </div>

        <ul className="mt-5 space-y-3.5">
          {INSIGHTS_RANKED.map((row, i) => (
            <li key={row.name}>
              <div className="flex items-center gap-3">
                <span className="label-caps grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cream-deep text-[10px] text-ink-soft">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink">{row.name}</span>
                <span className="shrink-0 text-[13px] font-bold text-ink">{row.sold}</span>
                <span className="label-caps w-[38px] shrink-0 text-right text-[9px] text-ink-faint">
                  {row.pct}%
                </span>
              </div>
              <div className="mt-2 ml-9 h-[3px] overflow-hidden rounded-full bg-cream-deep">
                <div
                  className={`h-full rounded-full ${i === 0 ? 'bg-cocoa' : 'bg-gold'}`}
                  style={{ width: `${row.pct * 4}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-[22px] border border-line bg-shell p-5">
          <h2 className="font-display text-[22px] leading-none text-ink">Demand you missed</h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">People who hit a sold-out flavour</p>
          <p className="mt-4 text-[14px] leading-relaxed text-ink">
            <span className="font-display text-[28px] leading-none">{money(missedTotal)}</span> walked out of the shop,{' '}
            {missedPeople} people in total.
          </p>
          <ul className="mt-4 space-y-2">
            {INSIGHTS_MISSED.map((m) => (
              <li key={m.name} className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="text-ink-soft">
                  {m.people} {m.name}
                </span>
                <span className="font-semibold text-ink">{money(m.value)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-[14px] bg-cream-deep px-4 py-3 text-[12px] leading-relaxed text-ink-soft">
            Bake more oat and marshmallow before noon — that is where the walkouts are.
          </p>
        </section>

        <section className="rounded-[22px] border border-line bg-shell p-5">
          <h2 className="font-display text-[22px] leading-none text-ink">Busiest windows</h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">Where to put staff</p>
          <ul className="mt-5 space-y-3">
            {INSIGHTS_WINDOWS.map((w) => (
              <li key={w.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px] font-semibold text-ink">{w.label}</span>
                  <span className="text-[13px] text-ink-soft">{w.count} orders</span>
                </div>
                <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-cream-deep">
                  <div
                    className="h-full rounded-full bg-cocoa"
                    style={{ width: `${(w.count / 60) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-[14px] bg-cream-deep px-4 py-3 text-[12px] leading-relaxed text-ink-soft">
            The afternoon does more than the morning. Two people from 2pm, one from 5pm.
          </p>
        </section>

        <section className="rounded-[22px] border border-line bg-shell p-5">
          <h2 className="font-display text-[22px] leading-none text-ink">How they pay</h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">Split across the week</p>
          <ul className="mt-5 space-y-3">
            {INSIGHTS_PAY.map((p) => (
              <li key={p.method}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px] font-semibold text-ink">{p.method}</span>
                  <span className="text-[13px] text-ink-soft">{p.pct}%</span>
                </div>
                <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-cream-deep">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${p.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-[14px] bg-cream-deep px-4 py-3 text-[12px] leading-relaxed text-ink-soft">
            50% of orders now arrive by transfer, which saves roughly $40 a week in card fees.
          </p>
        </section>
      </div>

      <p className="text-[12px] text-ink-faint">
        Busiest window this week: {busiest.label} with {busiest.count} orders.
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

export function CustomersTab() {
  return (
    <section className="rounded-[22px] border border-line bg-shell p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[24px] leading-none text-ink">Customers</h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">7 this week</p>
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {CUSTOMERS.map((c) => (
          <li
            key={c.name}
            className="flex flex-wrap items-center gap-3 rounded-[16px] border border-line-soft px-3.5 py-3"
          >
            <Avatar name={c.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-ink">{c.name}</p>
              <p className="text-[12px] text-ink-soft">
                {c.orders} · {c.window}
              </p>
            </div>
            <span className="text-[14px] font-semibold text-ink">{money(c.value)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

export function MoneyTab({ orders, actions }: { orders: DashboardOrder[]; actions: OrderActions }) {
  const settled = orders.filter((o) => o.payment === 'paid').reduce((a, o) => a + o.total, 0)
  const outstanding = orders.filter((o) => o.payment === 'pending').reduce((a, o) => a + o.total, 0)
  const paidCount = orders.filter((o) => o.payment === 'paid').length
  const pendingCount = orders.filter((o) => o.payment === 'pending').length
  const total = settled + outstanding
  const average = orders.length ? total / orders.length : 0

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Settled" value={money(settled)} sub={`${paidCount} orders`} highlight />
        <StatCard label="Outstanding" value={money(outstanding)} sub={`${pendingCount} orders`} />
        <StatCard label="Card fees saved" value="$3" sub="on transfers" />
        <StatCard label="Average order" value={`$${average.toFixed(2)}`} sub="this week" />
      </section>

      <section className="rounded-[22px] border border-line bg-shell p-5">
        <h2 className="font-display text-[22px] leading-none text-ink">Waiting on payment</h2>
        <p className="mt-1.5 text-[13px] text-ink-soft">Transfers that have not landed yet</p>

        <ul className="mt-5 space-y-2">
          {orders
            .filter((o) => o.payment === 'pending')
            .map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center gap-3 rounded-[16px] border border-line-soft px-3.5 py-3"
              >
                <Avatar name={o.customer} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink">{o.customer}</p>
                  <p className="text-[12px] text-ink-soft">
                    {o.number} · {o.paymentMethod} · Pickup, {o.windowLabel}
                  </p>
                </div>
                <span className="label-caps rounded-full bg-brick/12 px-2.5 py-1 text-[9px] text-brick">
                  {money(o.total)}
                </span>
                <button
                  type="button"
                  onClick={() => actions.markReceived(o.id)}
                  className="rounded-full border border-ink/20 px-4 py-2 text-[10px] font-bold tracking-[0.09em] text-ink uppercase transition-colors hover:border-ink/50"
                >
                  Mark received
                </button>
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}
