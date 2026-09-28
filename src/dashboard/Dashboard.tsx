import { useCallback, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { BRAND, DASHBOARD_ORDERS } from '../lib/data'
import { longDate } from '../lib/format'
import { useShop } from '../lib/store'
import type { DashboardOrder } from '../lib/types'
import { KitchenMode } from './KitchenMode'
import { MenuTab } from './MenuTab'
import { OrderDetailModal } from './OrderDetailModal'
import { RestockModal } from './RestockModal'
import { BakeSheetTab, CustomersTab, InsightsTab, MoneyTab, OrdersTab, TodayTab, type OrderActions } from './tabs'
import {
  ChefHat,
  DollarSign,
  LayoutDashboard,
  Printer,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
  UtensilsCrossed,
  X,
} from 'lucide-react'

const TABS = [
  { to: '/dashboard', label: 'Today', icon: LayoutDashboard, end: true },
  { to: '/dashboard/orders', label: 'Orders', icon: ShoppingBag, badge: true },
  { to: '/dashboard/bake', label: 'Bake sheet', icon: ChefHat },
  { to: '/dashboard/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/dashboard/insights', label: 'Insights', icon: TrendingUp },
  { to: '/dashboard/customers', label: 'Customers', icon: Users },
  { to: '/dashboard/money', label: 'Money', icon: DollarSign },
] as const

const TITLES: Record<string, string> = {
  '/dashboard': 'Today',
  '/dashboard/orders': 'Orders',
  '/dashboard/bake': 'Bake sheet',
  '/dashboard/menu': 'Menu',
  '/dashboard/insights': 'Insights',
  '/dashboard/customers': 'Customers',
  '/dashboard/money': 'Money',
}

export function Dashboard() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<DashboardOrder[]>(DASHBOARD_ORDERS)
  const [kitchen, setKitchen] = useState(false)
  const [kitchenCardDismissed, setKitchenCardDismissed] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [restockOpen, setRestockOpen] = useState(false)
  const [acknowledgedNotes, setAcknowledgedNotes] = useState<Set<string>>(new Set())
  const { toast } = useShop()

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null

  const actions: OrderActions = useMemo(
    () => ({
      markReady: (id) => {
        setOrders((list) => list.map((o) => (o.id === id ? { ...o, stage: 'ready' } : o)))
        toast('Marked ready')
      },
      markCollected: (id) => {
        setOrders((list) => list.map((o) => (o.id === id ? { ...o, stage: 'collected' } : o)))
        toast('Marked collected')
      },
      markReceived: (id) => {
        setOrders((list) => list.map((o) => (o.id === id ? { ...o, payment: 'paid' } : o)))
        toast('Payment marked received')
      },
    }),
    [toast],
  )

  const openCount = orders.filter((o) => o.stage !== 'collected').length

  const onPrint = useCallback(() => {
    navigate('/dashboard/bake')
    window.setTimeout(() => window.print(), 120)
  }, [navigate])

  const location = useLocation()
  const path = location.pathname.replace(/\/+$/, '') || '/dashboard'
  const title = TITLES[path] ?? 'Today'

  const isTabActive = (tabTo: string, end?: boolean) =>
    end ? path === tabTo : path.startsWith(tabTo)

  return (
    <div className="min-h-dvh bg-cream text-ink lg:flex lg:h-dvh lg:overflow-hidden print:h-auto print:overflow-visible">
      <aside className="no-print hidden w-[256px] shrink-0 border-r border-line bg-cream lg:flex lg:h-full lg:flex-col lg:justify-between lg:overflow-y-auto">
        <div>
          <div className="flex items-center gap-3 px-5 py-5 border-b border-line-soft">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-cocoa shadow-xs">
              <ChefHat className="h-5 w-5 text-gold" />
            </span>
            <div>
              <span className="block font-display text-[20px] leading-none">
                <span className="text-ink">Bake</span>
                <span className="text-brick">House</span>
              </span>
              <span className="mt-1 block text-[11px] text-ink-soft">{BRAND.address}</span>
            </div>
          </div>

          <nav aria-label="Dashboard" className="mt-4 px-3">
            <ul className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon
                return (
                  <li key={tab.to}>
                    <NavLink
                      to={tab.to}
                      end={'end' in tab ? tab.end : false}
                      className={({ isActive }) => {
                        const active = isActive || isTabActive(tab.to, 'end' in tab ? tab.end : false)
                        return `flex items-center justify-between gap-3 rounded-full px-4 py-2.5 text-[13.5px] font-medium transition-all ${
                          active
                            ? 'bg-cocoa text-cream shadow-xs'
                            : 'text-ink-soft hover:bg-cream-deep hover:text-ink active:scale-95'
                        }`
                      }}
                    >
                      {({ isActive }) => {
                        const active = isActive || isTabActive(tab.to, 'end' in tab ? tab.end : false)
                        return (
                          <>
                            <span className="flex items-center gap-2.5">
                              <Icon className={`h-4 w-4 ${active ? 'text-gold' : 'text-ink-soft/75'}`} />
                              <span>{tab.label}</span>
                            </span>
                            {'badge' in tab && tab.badge ? (
                              <span
                                className="grid h-[20px] min-w-[20px] place-items-center rounded-full bg-brick px-1.5 text-[10.5px] font-bold text-white"
                              >
                                {openCount}
                              </span>
                            ) : null}
                          </>
                        )
                      }}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <div className="px-4 pb-5 pt-4 space-y-3 shrink-0">
          {!kitchenCardDismissed && (
          <div className="rounded-[20px] border border-line bg-[#faf6f0] p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-brick" />
                <p className="text-[13.5px] font-bold text-ink">Kitchen mode</p>
              </div>
              <button
                type="button"
                onClick={() => setKitchenCardDismissed(true)}
                aria-label="Dismiss kitchen mode card"
                className="grid h-6 w-6 place-items-center rounded-full text-ink-soft transition-all hover:bg-cream-deep hover:text-ink active:scale-95"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">
              Put today&rsquo;s orders on a tablet in big type, for the bench.
            </p>
            <button
              type="button"
              onClick={() => setKitchen(true)}
              className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cocoa px-4 py-2.5 text-[11px] font-bold tracking-[0.09em] text-cream uppercase shadow-xs transition-all hover:bg-cocoa-soft active:scale-95"
            >
              <span>Open bench mode</span>
            </button>
          </div>
          )}
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-shell px-4 py-2.5 text-[12px] font-medium text-ink transition-all hover:border-ink/40 active:scale-95"
          >
            <Store className="h-3.5 w-3.5 text-brick" />
            <span>View the shop</span>
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1 lg:flex lg:h-full lg:flex-col lg:overflow-y-auto print:h-auto print:overflow-visible">
        <div className="no-print sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur-md shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
            <div>
              <h1 className="font-display text-[26px] leading-none text-ink">{title}</h1>
              <p className="mt-1 text-[12.5px] text-ink-soft">{longDate()}</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                to="/"
                className="inline-flex lg:hidden items-center gap-1.5 rounded-full border border-ink/20 bg-shell px-3 py-2 text-[10.5px] font-bold tracking-[0.08em] text-ink uppercase transition-all hover:border-ink/50 active:scale-95"
              >
                <Store className="h-3.5 w-3.5 text-brick" />
                <span>Shop</span>
              </Link>
              <button
                type="button"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-shell px-4 py-2 text-[10.5px] font-bold tracking-[0.08em] text-ink uppercase transition-all hover:border-ink/50 active:scale-95"
              >
                <Printer className="h-3.5 w-3.5 text-ink-soft" />
                <span>Print bake sheet</span>
              </button>
              <button
                type="button"
                onClick={() => setKitchen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-cocoa px-4 py-2 text-[10.5px] font-bold tracking-[0.08em] text-cream uppercase transition-all hover:bg-cocoa-soft active:scale-95"
              >
                <ChefHat className="h-3.5 w-3.5 text-gold" />
                <span>Kitchen mode</span>
              </button>
            </div>
          </div>

          <nav aria-label="Dashboard" className="no-scrollbar overflow-x-auto px-4 pb-3 sm:px-6 lg:hidden">
            <ul className="flex gap-2">
              {TABS.map((tab) => {
                const Icon = tab.icon
                return (
                  <li key={tab.to}>
                    <NavLink
                      to={tab.to}
                      end={'end' in tab ? tab.end : false}
                      className={({ isActive }) => {
                        const active = isActive || isTabActive(tab.to, 'end' in tab ? tab.end : false)
                        return `inline-flex items-center gap-1.5 label-caps rounded-full px-3.5 py-2 text-[10px] whitespace-nowrap transition-all active:scale-95 ${
                          active
                            ? 'bg-cocoa text-cream shadow-xs'
                            : 'border border-line bg-[#faf6f0] text-ink-soft'
                        }`
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                      {'badge' in tab && tab.badge ? ` (${openCount})` : ''}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <Routes>
            <Route
              index
              element={
                <TodayTab
                  orders={orders}
                  actions={actions}
                  onKitchen={() => setKitchen(true)}
                  onSelectOrder={(id) => setSelectedOrderId(id)}
                  onOpenRestock={() => setRestockOpen(true)}
                  acknowledgedNotes={acknowledgedNotes}
                />
              }
            />
            <Route
              path="orders"
              element={
                <OrdersTab
                  orders={orders}
                  actions={actions}
                  onSelectOrder={(id) => setSelectedOrderId(id)}
                />
              }
            />
            <Route path="bake" element={<BakeSheetTab />} />
            <Route path="menu" element={<MenuTab />} />
            <Route path="insights" element={<InsightsTab />} />
            <Route path="customers" element={<CustomersTab />} />
            <Route path="money" element={<MoneyTab orders={orders} actions={actions} />} />
          </Routes>
        </main>
      </div>

      <KitchenMode
        open={kitchen}
        orders={orders}
        onClose={() => setKitchen(false)}
        onReady={(id) => {
          setOrders((list) =>
            list.map((o) =>
              o.id === id ? { ...o, stage: o.stage === 'ready' ? 'collected' : 'ready' } : o,
            ),
          )
        }}
      />

      <OrderDetailModal
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrderId(null)}
        actions={actions}
        onAcknowledgeNote={(id) => {
          setAcknowledgedNotes((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
          })
          toast('Order note acknowledged')
        }}
        isNoteAcknowledged={selectedOrderId ? acknowledgedNotes.has(selectedOrderId) : false}
      />

      <RestockModal
        open={restockOpen}
        onClose={() => setRestockOpen(false)}
      />
    </div>
  )
}
