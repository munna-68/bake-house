import { useMemo } from 'react'
import { CookieTile } from '../components/Cookie'
import { BRAND, PAY_LABELS } from '../lib/data'
import { money } from '../lib/format'
import { useShop } from '../lib/store'
import type { DashboardOrder } from '../lib/types'
import { useDialog } from '../lib/useDialog'
import type { OrderActions } from './tabs'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  X,
} from 'lucide-react'

interface Props {
  order: DashboardOrder | null
  open: boolean
  onClose: () => void
  actions: OrderActions
  onAcknowledgeNote?: (orderId: string) => void
  isNoteAcknowledged?: boolean
}

export function OrderDetailModal({
  order,
  open,
  onClose,
  actions,
  onAcknowledgeNote,
  isNoteAcknowledged,
}: Props) {
  const { ref } = useDialog(open, onClose)
  const { flavours } = useShop()

  const flavourMap = useMemo(() => {
    return new Map(flavours.map((f) => [f.id, f]))
  }, [flavours])

  if (!open || !order) return null

  const isPaid = order.payment === 'paid'
  const isCollected = order.stage === 'collected'
  const isReady = order.stage === 'ready'

  const payLabel = PAY_LABELS[order.paymentMethod]?.title ?? order.paymentMethod

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        aria-label="Close order details"
        onClick={onClose}
        className="fade-enter absolute inset-0 bg-cocoa/45 backdrop-blur-sm"
      />

      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={`Order details for ${order.customer} ${order.number}`}
        className="modal-enter relative flex h-[calc(100dvh-20px)] w-full flex-col overflow-hidden rounded-t-[30px] bg-cream shadow-lift md:h-auto md:max-h-[90dvh] md:w-[560px] md:rounded-[30px]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line bg-cream px-5 pt-5 pb-4 md:px-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-caps rounded-full bg-cocoa px-2.5 py-1 text-[10px] font-bold text-cream">
                {order.number}
              </span>
              <span className="label-caps rounded-full bg-cream-deep px-2.5 py-1 text-[10px] text-ink-soft">
                {order.source}
              </span>
              {isPaid ? (
                <span className="inline-flex items-center gap-1 label-caps rounded-full bg-leaf-soft px-2.5 py-1 text-[9.5px] font-bold text-leaf">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Paid</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 label-caps rounded-full bg-brick/12 px-2.5 py-1 text-[9.5px] font-bold text-brick">
                  <Clock className="h-3 w-3" />
                  <span>Payment Pending</span>
                </span>
              )}
            </div>
            <h2 className="mt-2 font-display text-[28px] sm:text-[32px] leading-tight text-ink">
              {order.customer}
            </h2>
            <p className="text-[13px] text-ink-soft">
              {order.boxes} · {order.cookies} cookies total
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-shell text-ink transition-transform hover:scale-105 active:scale-95"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6 space-y-5">
          {/* Note from customer / allergy banner */}
          {order.note && (
            <div className="rounded-[20px] border-2 border-gold/70 bg-[#fff9ea] p-4.5 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="label-caps text-[10.5px] font-bold tracking-wide text-ink uppercase">
                      Special Kitchen Note &amp; Allergy Alert
                    </p>
                    <p className="mt-1 text-[15px] font-bold text-ink">
                      &ldquo;{order.note}&rdquo;
                    </p>
                    <p className="mt-1 text-[12px] text-ink-soft">
                      Take care when boxing. Ensure bench and tongs are sanitized.
                    </p>
                  </div>
                </div>
                {onAcknowledgeNote && (
                  <button
                    type="button"
                    onClick={() => onAcknowledgeNote(order.id)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[9.5px] font-bold tracking-wider uppercase transition-all ${
                      isNoteAcknowledged
                        ? 'bg-leaf-soft text-leaf border border-leaf/30'
                        : 'border border-ink/20 bg-shell text-ink hover:border-ink/50 active:scale-95'
                    }`}
                  >
                    {isNoteAcknowledged ? '✓ Noted' : 'Acknowledge'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Fulfillment & Customer Details */}
          <div className="rounded-[22px] border border-line bg-[#faf6f0] p-4.5">
            <h3 className="label-caps text-[10px] font-bold text-ink-soft">Pickup details</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 text-[13px]">
              <div className="flex items-center gap-2 text-ink">
                <Clock className="h-4 w-4 text-ink-soft shrink-0" />
                <span>Window: <strong>{order.windowLabel}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-ink">
                <MapPin className="h-4 w-4 text-ink-soft shrink-0" />
                <span>{BRAND.address} (Counter)</span>
              </div>
              {order.phone && (
                <div className="flex items-center gap-2 text-ink">
                  <Phone className="h-4 w-4 text-ink-soft shrink-0" />
                  <a href={`tel:${order.phone}`} className="hover:underline">{order.phone}</a>
                </div>
              )}
              {order.email && (
                <div className="flex items-center gap-2 text-ink truncate">
                  <Mail className="h-4 w-4 text-ink-soft shrink-0" />
                  <span className="truncate">{order.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* What was ordered (Boxes & Flavours) */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-display text-[20px] text-ink">Order items</h3>
              <span className="label-caps text-[10px] font-semibold text-ink-soft">
                {order.cookies} cookies
              </span>
            </div>

            {order.orderBoxes && order.orderBoxes.length > 0 ? (
              <div className="space-y-3.5">
                {order.orderBoxes.map((box, idx) => (
                  <div
                    key={idx}
                    className="rounded-[20px] border border-line bg-shell p-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between border-b border-line-soft pb-2.5 mb-3">
                      <span className="label-caps rounded-full bg-brick px-3 py-1 text-[9.5px] font-bold text-white">
                        Box {idx + 1} · {box.size} cookies
                      </span>
                      <span className="text-[12px] text-ink-soft font-medium">
                        {box.items.reduce((s, it) => s + it.qty, 0)} cookies chosen
                      </span>
                    </div>

                    <ul className="space-y-2.5">
                      {box.items.map((item) => {
                        const flavour = flavourMap.get(item.flavourId)
                        const art = flavour?.art ?? {
                          base: '#d8a968',
                          edge: '#bd8946',
                          chips: ['#4a2c17'],
                          crumb: '#b8874a',
                        }
                        const photo = flavour?.photo
                        const allergens = flavour?.allergens?.join(', ')

                        return (
                          <li
                            key={item.flavourId}
                            className="flex items-center justify-between gap-3 text-[13.5px]"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-[10px] border border-line-soft bg-cream-deep">
                                <CookieTile
                                  art={art}
                                  seedKey={`order-${order.id}-${item.flavourId}`}
                                  photo={photo}
                                  className="h-full w-full"
                                  inset={2}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-ink truncate">{item.name}</p>
                                {allergens && (
                                  <p className="text-[11px] text-ink-soft truncate">{allergens}</p>
                                )}
                              </div>
                            </div>
                            <span className="shrink-0 rounded-full bg-cream-deep px-2.5 py-1 text-[12px] font-bold text-ink">
                              {item.qty}×
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-line bg-shell p-4 text-[13.5px] text-ink-soft">
                {order.boxes} · {order.cookies} cookies
              </div>
            )}
          </div>

          {/* Payment & Total breakdown */}
          <div className="rounded-[20px] border border-line bg-[#faf6f0] p-4.5">
            <h3 className="label-caps text-[10px] font-bold text-ink-soft mb-3">Payment summary</h3>
            <div className="space-y-2 text-[13.5px]">
              <div className="flex justify-between text-ink-soft">
                <span>Items ({order.cookies} cookies)</span>
                <span>{money(order.total + (order.discount ?? 0))}</span>
              </div>
              {order.discount ? (
                <div className="flex justify-between text-leaf font-medium">
                  <span>Multi-box bundle discount</span>
                  <span>-{money(order.discount)}</span>
                </div>
              ) : null}
              <div className="flex items-baseline justify-between border-t border-line pt-2 text-ink">
                <span className="font-bold">Total amount</span>
                <span className="font-display text-[24px] leading-none text-ink">
                  {money(order.total)}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-[14px] bg-shell p-3 border border-line-soft flex flex-wrap items-center justify-between gap-2.5">
              <div>
                <p className="text-[12px] text-ink-soft">Payment method</p>
                <p className="text-[13.5px] font-semibold text-ink">
                  {payLabel} {order.paymentMethod === 'bank' ? `(Ref: ${order.number})` : ''}
                </p>
              </div>
              {!isPaid ? (
                <button
                  type="button"
                  onClick={() => {
                    actions.markReceived(order.id)
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-shell px-3.5 py-1.5 text-[10px] font-bold tracking-[0.08em] text-ink uppercase shadow-xs transition-all hover:border-ink/50 active:scale-95"
                >
                  <Check className="h-3 w-3 text-leaf" strokeWidth={2.5} />
                  <span>Mark received</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 label-caps text-[10px] font-bold text-leaf">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Payment settled</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 border-t border-line bg-cream px-5 py-4 md:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="label-caps text-[10px] text-ink-soft font-semibold">Stage:</span>
            <span className={`label-caps rounded-full px-2.5 py-1 text-[9.5px] font-bold ${
              isCollected
                ? 'bg-cream-deep text-ink-faint'
                : isReady
                ? 'bg-leaf-soft text-leaf'
                : 'bg-gold/15 text-gold'
            }`}>
              {isCollected ? 'Collected' : isReady ? 'Ready for pickup' : 'To make up'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {!isCollected && (
              <button
                type="button"
                onClick={() => {
                  if (isReady) {
                    actions.markCollected(order.id)
                  } else {
                    actions.markReady(order.id)
                  }
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[10.5px] font-bold tracking-[0.09em] uppercase shadow-xs transition-all active:scale-95 ${
                  isReady
                    ? 'bg-leaf text-white hover:bg-leaf/90'
                    : 'bg-cocoa text-cream hover:bg-cocoa-soft'
                }`}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>{isReady ? 'Mark collected' : 'Mark ready'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-ink/20 bg-shell px-4 py-2 text-[10.5px] font-bold tracking-[0.09em] text-ink uppercase shadow-xs transition-all hover:border-ink/50 active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
