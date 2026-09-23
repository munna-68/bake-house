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
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChefHat,
  Clock,
  DollarSign,
  PackageOpen,
  Printer,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from 'lucide-react'

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
  icon: Icon,
}: {
  label: string
  value: string
  sub?: string
  highlight?: boolean
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div
      className={`rounded-[22px] border p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
        highlight
          ? 'border-brick/30 bg-[#faf6f0] ring-1 ring-brick/20'
          : 'border-line bg-[#faf6f0]'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="label-caps text-[10px] text-ink-soft">{label}</p>
        {Icon ? <Icon className={`h-4 w-4 ${highlight ? 'text-brick' : 'text-ink-soft/60'}`} /> : null}
      </div>
      <p className="mt-2.5 font-display text-[32px] sm:text-[34px] leading-none text-ink">{value}</p>
      {sub ? <p className="mt-2 text-[12.5px] text-ink-soft">{sub}</p> : null}
    </div>
  )
}

export function Avatar({ name }: { name: string }) {
  return (
    <span className="label-caps grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream-deep text-[11px] font-bold text-ink-soft border border-line-soft">
      {toInitials(name)}
    </span>
  )
}

export function PaymentChip({ order }: { order: DashboardOrder }) {
  if (order.payment === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 label-caps rounded-full bg-brick/12 px-2.5 py-1 text-[9px] font-bold text-brick">
        <Clock className="h-2.5 w-2.5" />
        <span>Unpaid</span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 label-caps rounded-full bg-leaf-soft px-2.5 py-1 text-[9px] font-bold text-leaf">
      <CheckCircle2 className="h-2.5 w-2.5" />
      <span>Paid</span>
    </span>
  )
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
    ? 'inline-flex items-center justify-center gap-1.5 min-h-10 rounded-full bg-cream px-4 py-2 text-[10.5px] font-bold tracking-[0.09em] text-cocoa uppercase shadow-xs transition-all hover:bg-white active:scale-95'
    : 'inline-flex items-center justify-center gap-1.5 min-h-9 rounded-full border border-line bg-shell px-3.5 py-1.5 text-[10px] font-bold tracking-[0.08em] text-ink uppercase shadow-xs transition-all hover:border-ink/50 active:scale-95'

  if (order.stage === 'collected') {
    return (
      <span className={`inline-flex items-center gap-1 label-caps text-[9.5px] ${onDark ? 'text-cream/50' : 'text-ink-faint'}`}>
        <CheckCircle2 className="h-3 w-3 text-leaf" />
        <span>Collected</span>
      </span>
    )
  }
  if (order.stage === 'ready') {
    return (
      <button type="button" onClick={() => actions.markCollected(order.id)} className={base}>
        <Check className="h-3 w-3 text-leaf" strokeWidth={2.5} />
        <span>Mark collected</span>
      </button>
    )
  }
  return (
    <button type="button" onClick={() => actions.markReady(order.id)} className={base}>
      <span>Mark ready</span>
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
        <section className="rounded-[26px] bg-cocoa p-6 text-cream shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-gold" />
                <p className="label-caps text-[10px] text-cream/70">Next out the door</p>
              </div>
              <h2 className="mt-3 font-display text-[34px] sm:text-[38px] leading-none text-cream">{next.customer}</h2>
              <p className="mt-2 text-[14px] text-cream/75">
                {next.boxes} · {next.number}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="label-caps rounded-full bg-cream/12 px-3 py-1.5 text-[9px] text-cream/85">
                  Pickup, {next.windowLabel}
                </span>
                <span className="label-caps rounded-full bg-cream/12 px-3 py-1.5 text-[9px] text-cream/85">
                  {next.source}
                </span>
                <span className="label-caps rounded-full bg-cream/12 px-3 py-1.5 text-[9px] text-cream/85">
                  {next.payment === 'paid' ? `Paid ${money(next.total)}` : `Unpaid ${money(next.total)}`}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-[44px] leading-none text-gold">{open.length}</p>
              <p className="label-caps mt-1 text-[9px] text-cream/60">Still open</p>
            </div>
          </div>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            <ReadyButton order={next} actions={actions} onDark />
            <button
              type="button"
              onClick={onKitchen}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-cream/25 px-4 py-2 text-[10.5px] font-bold tracking-[0.09em] text-cream uppercase transition-all hover:border-cream/60 active:scale-95"
            >
              <ChefHat className="h-3.5 w-3.5 text-gold" />
              <span>Kitchen mode</span>
            </button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Taken today" value={money(taken)} sub={`${orders.length} orders`} highlight icon={DollarSign} />
        <StatCard label="Cookies to bake" value={String(cookies)} sub="9 flavours on" icon={UtensilsCrossed} />
        <StatCard
          label="Handed over"
          value={`${handedOver} of ${orders.length}`}
          sub={`${orders.length - handedOver} still to make up`}
          icon={CheckCircle2}
        />
        <StatCard label="Waiting on payment" value={money(outstanding)} sub="Chase these" icon={Clock} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section className="rounded-[22px] border border-line bg-[#faf6f0] p-5 shadow-xs">
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
                        className="h-full rounded-full bg-cocoa transition-all duration-300"
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
                        className="flex flex-wrap items-center gap-3 rounded-[16px] border border-line-soft bg-shell/80 px-3.5 py-2.5 shadow-xs transition-colors hover:border-line"
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

        <section className="rounded-[22px] border border-line bg-[#faf6f0] p-5 shadow-xs">
          <h2 className="font-display text-[22px] leading-none text-ink">Needs attention</h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">Only what will not sort itself out</p>

          <ul className="mt-5 space-y-3">
            {orders
              .filter((o) => o.payment === 'pending')
              .map((o) => (
                <li key={o.id} className="rounded-[16px] border-l-[3.5px] border-brick bg-shell p-4 shadow-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-brick shrink-0" />
                    <p className="text-[14px] font-semibold text-ink">{o.customer} has not paid</p>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-soft pl-6">
                    {o.number} · {money(o.total)} · Pickup, {o.windowLabel}
                  </p>
                  <div className="mt-3 pl-6">
                    <button
                      type="button"
                      onClick={() => actions.markReceived(o.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-ink/20 bg-shell px-3.5 py-1.5 text-[10px] font-bold tracking-[0.08em] text-ink uppercase shadow-xs transition-all hover:border-ink/50 active:scale-95"
                    >
                      <Check className="h-3 w-3 text-leaf" strokeWidth={2.5} />
                      <span>Mark received</span>
                    </button>
                  </div>
                </li>
              ))}

            <li className="rounded-[16px] border-l-[3.5px] border-gold bg-shell p-4 shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold shrink-0" />
                <p className="text-[14px] font-semibold text-ink">Note from Sarah Mendez</p>
              </div>
              <p className="mt-1 text-[12px] text-ink-soft pl-6">Nut allergy, please keep separate</p>
              <div className="mt-3 pl-6">
                <button
                  type="button"
                  onClick={() => toast('Order note opened')}
                  className="rounded-full border border-ink/20 bg-shell px-3.5 py-1.5 text-[10px] font-bold tracking-[0.08em] text-ink uppercase shadow-xs transition-all hover:border-ink/50 active:scale-95"
                >
                  Open
                </button>
              </div>
            </li>

            <li className="rounded-[16px] border-l-[3.5px] border-gold bg-shell p-4 shadow-xs">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-gold shrink-0" />
                <p className="text-[14px] font-semibold text-ink">2 flavours are sold out</p>
              </div>
              <p className="mt-1 text-[12px] text-ink-soft pl-6">
                Ceremonial matcha, Oat and cinnamon. The shop is still taking the rest.
              </p>
              <div className="mt-3 pl-6">
                <button
                  type="button"
                  onClick={() => {
                    restockAll()
                    toast('Sold-out flavours restocked')
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-shell px-3.5 py-1.5 text-[10px] font-bold tracking-[0.08em] text-ink uppercase shadow-xs transition-all hover:border-ink/50 active:scale-95"
                >
                  <RotateCcw className="h-3 w-3 text-ink-soft" />
                  <span>Restock</span>
                </button>
              </div>
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
    <section className="rounded-[22px] border border-line bg-[#faf6f0] p-5 shadow-xs">
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
              className={`label-caps rounded-full px-3.5 py-2 text-[10px] transition-all active:scale-95 ${
                state === f ? 'bg-cocoa text-cream shadow-xs' : 'border border-line bg-shell text-ink-soft hover:border-ink/35'
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
            className="flex flex-wrap items-center gap-3 rounded-[16px] border border-line-soft bg-shell px-3.5 py-3 shadow-xs transition-colors hover:border-line"
          >
            <Avatar name={o.customer} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-ink">{o.customer}</p>
              <p className="text-[12px] text-ink-soft">
                {o.boxes} · {o.number} · Pickup {o.windowLabel}
              </p>
            </div>
            <PaymentChip order={o} />
            <span className="label-caps hidden text-[11px] font-bold text-ink sm:block">{money(o.total)}</span>
            <ReadyButton order={o} actions={actions} />
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="rounded-[16px] border border-dashed border-line bg-shell/50 px-4 py-8 text-center text-[13px] text-ink-soft">
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
    <section className="rounded-[22px] border border-line bg-[#faf6f0] p-5 shadow-xs">
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
          className="no-print inline-flex items-center gap-1.5 min-h-11 rounded-full border border-ink/20 bg-shell px-5 py-2.5 text-[10px] font-bold tracking-[0.09em] text-ink uppercase shadow-xs transition-all hover:border-ink/50 active:scale-95"
        >
          <Printer className="h-3.5 w-3.5 text-ink-soft" />
          <span>Print bake sheet</span>
        </button>
      </div>

      <ul className="mt-5 space-y-2">
        {BAKE_SHEET.map((row) => (
          <li
            key={row.name}
            className="flex flex-wrap items-center gap-4 rounded-[16px] border border-line-soft bg-shell px-4 py-3.5 shadow-xs transition-colors hover:border-line"
          >
            <div className="w-[86px] shrink-0">
              <p className="font-display text-[30px] leading-none text-ink">{row.cookies}</p>
              <p className="label-caps mt-1 text-[9px] text-ink-faint">Cookies</p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-ink">{row.name}</p>
              <p className="text-[12px] text-ink-soft">
                {trays(row.cookies)} {trays(row.cookies) === 1 ? 'tray' : 'trays'} at 12 a tray
              </p>
              {row.note ? <p className="mt-1 text-[12px] font-semibold text-gold">{row.note}</p> : null}
            </div>
            <div className="shrink-0 rounded-[14px] bg-cream-deep px-3.5 py-2 text-center border border-line-soft">
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
        <StatCard label="Cookies sold" value="316" sub="in the last 7 days" highlight icon={TrendingUp} />
        <StatCard label="Best seller" value="Salted butter chip" sub="68 of them" icon={Sparkles} />
        <StatCard label="Typical box" value="4 cookies" sub="across 88 boxes" icon={PackageOpen} />
        <StatCard label="Repeat customers" value="38%" sub="had ordered before" icon={Users} />
      </section>

      <section className="rounded-[22px] border border-line bg-[#faf6f0] p-5 shadow-xs">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-[22px] leading-none text-ink">What sold this week</h2>
            <p className="mt-1.5 text-[13px] text-ink-soft">Every flavour, ranked</p>
          </div>
          <span className="label-caps rounded-full bg-cream-deep px-3 py-1.5 text-[9px] text-ink-soft font-bold">
            316 cookies
          </span>
        </div>

        <ul className="mt-5 space-y-3.5">
          {INSIGHTS_RANKED.map((row, i) => (
            <li key={row.name}>
              <div className="flex items-center gap-3">
                <span className="label-caps grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cream-deep text-[10px] font-bold text-ink-soft">
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
                  className={`h-full rounded-full transition-all duration-300 ${i === 0 ? 'bg-cocoa' : 'bg-gold'}`}
                  style={{ width: `${row.pct * 4}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-[22px] border border-line bg-[#faf6f0] p-5 shadow-xs">
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
          <p className="mt-4 rounded-[14px] bg-cream-deep px-4 py-3 text-[12px] leading-relaxed text-ink-soft border border-line-soft">
            Bake more oat and marshmallow before noon — that is where the walkouts are.
          </p>
        </section>

        <section className="rounded-[22px] border border-line bg-[#faf6f0] p-5 shadow-xs">
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
                    className="h-full rounded-full bg-cocoa transition-all duration-300"
                    style={{ width: `${(w.count / 60) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-[14px] bg-cream-deep px-4 py-3 text-[12px] leading-relaxed text-ink-soft border border-line-soft">
            The afternoon does more than the morning. Two people from 2pm, one from 5pm.
          </p>
        </section>

        <section className="rounded-[22px] border border-line bg-[#faf6f0] p-5 shadow-xs">
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
                  <div className="h-full rounded-full bg-gold transition-all duration-300" style={{ width: `${p.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-[14px] bg-cream-deep px-4 py-3 text-[12px] leading-relaxed text-ink-soft border border-line-soft">
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
    <section className="rounded-[22px] border border-line bg-[#faf6f0] p-5 shadow-xs">
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
            className="flex flex-wrap items-center gap-3 rounded-[16px] border border-line-soft bg-shell px-3.5 py-3 shadow-xs transition-colors hover:border-line"
          >
            <Avatar name={c.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-ink">{c.name}</p>
              <p className="text-[12px] text-ink-soft">
                {c.orders} · {c.window}
              </p>
            </div>
            <span className="font-display text-[17px] font-bold text-ink">{money(c.value)}</span>
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
        <StatCard label="Settled" value={money(settled)} sub={`${paidCount} orders`} highlight icon={DollarSign} />
        <StatCard label="Outstanding" value={money(outstanding)} sub={`${pendingCount} orders`} icon={Clock} />
        <StatCard label="Card fees saved" value="$3" sub="on transfers" icon={Sparkles} />
        <StatCard label="Average order" value={`$${average.toFixed(2)}`} sub="this week" icon={TrendingUp} />
      </section>

      <section className="rounded-[22px] border border-line bg-[#faf6f0] p-5 shadow-xs">
        <h2 className="font-display text-[22px] leading-none text-ink">Waiting on payment</h2>
        <p className="mt-1.5 text-[13px] text-ink-soft">Transfers that have not landed yet</p>

        <ul className="mt-5 space-y-2">
          {orders
            .filter((o) => o.payment === 'pending')
            .map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center gap-3 rounded-[16px] border border-line-soft bg-shell px-3.5 py-3 shadow-xs transition-colors hover:border-line"
              >
                <Avatar name={o.customer} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink">{o.customer}</p>
                  <p className="text-[12px] text-ink-soft">
                    {o.number} · {o.paymentMethod} · Pickup, {o.windowLabel}
                  </p>
                </div>
                <span className="label-caps rounded-full bg-brick/12 px-2.5 py-1 text-[9px] font-bold text-brick">
                  {money(o.total)}
                </span>
                <button
                  type="button"
                  onClick={() => actions.markReceived(o.id)}
                  className="inline-flex items-center gap-1 rounded-full border border-ink/20 bg-shell px-4 py-1.5 text-[10px] font-bold tracking-[0.09em] text-ink uppercase shadow-xs transition-all hover:border-ink/50 active:scale-95"
                >
                  <Check className="h-3 w-3 text-leaf" strokeWidth={2.5} />
                  <span>Mark received</span>
                </button>
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}
