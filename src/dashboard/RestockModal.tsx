import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CookieTile } from '../components/Cookie'
import { useShop } from '../lib/store'
import { useDialog } from '../lib/useDialog'
import { Check, ChevronDown, ChevronUp, Minus, Plus, RotateCcw, UtensilsCrossed, X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

export function RestockModal({ open, onClose }: Props) {
  const { ref } = useDialog(open, onClose)
  const { flavours, updateFlavour, toast } = useShop()

  // Track the number of cookies to ADD to each flavour
  const [restockAmounts, setRestockAmounts] = useState<Record<string, number>>({})
  const [showAllFlavours, setShowAllFlavours] = useState(false)

  // Initialize/reset restock amounts whenever modal opens or flavours change
  useEffect(() => {
    if (!open) return
    const initial: Record<string, number> = {}
    flavours.forEach((f) => {
      // Default to 12 cookies (1 standard baker tray) for sold-out flavours, 0 for in-stock
      initial[f.id] = f.stock <= 0 ? 12 : 0
    })
    setRestockAmounts(initial)
  }, [open, flavours])

  if (!open) return null

  const soldOutFlavours = flavours.filter((f) => f.stock <= 0)
  const otherFlavours = flavours.filter((f) => f.stock > 0)

  const setAmount = (id: string, qty: number) => {
    setRestockAmounts((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.round(Number.isFinite(qty) ? qty : 0)),
    }))
  }

  const addAmount = (id: string, delta: number) => {
    setRestockAmounts((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }))
  }

  const handleRestockAllStandard = () => {
    const updated: Record<string, number> = { ...restockAmounts }
    soldOutFlavours.forEach((f) => {
      updated[f.id] = 12
    })
    setRestockAmounts(updated)
  }

  const totalToAdd = Object.values(restockAmounts).reduce((sum, n) => sum + (n || 0), 0)
  const flavoursRestockedCount = Object.entries(restockAmounts).filter(([, qty]) => qty > 0).length

  const handleSave = () => {
    if (totalToAdd === 0) {
      onClose()
      return
    }

    const restockedNames: string[] = []
    flavours.forEach((f) => {
      const qtyToAdd = restockAmounts[f.id] ?? 0
      if (qtyToAdd > 0) {
        updateFlavour(f.id, {
          stock: Math.max(0, f.stock) + qtyToAdd,
        })
        restockedNames.push(f.name)
      }
    })

    if (restockedNames.length > 0) {
      toast(`Restocked ${restockedNames.length} ${restockedNames.length === 1 ? 'flavour' : 'flavours'} (+${totalToAdd} cookies)`)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        aria-label="Close restock modal"
        onClick={onClose}
        className="fade-enter absolute inset-0 bg-cocoa/45 backdrop-blur-sm"
      />

      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Restock rack"
        className="modal-enter relative flex h-[calc(100dvh-20px)] w-full flex-col overflow-hidden rounded-t-[30px] bg-cream shadow-lift md:h-auto md:max-h-[88dvh] md:w-[560px] md:rounded-[30px]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line bg-cream px-5 pt-5 pb-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/20 text-gold border border-gold/30">
              <RotateCcw className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-[26px] sm:text-[28px] leading-tight text-ink">
                Restock rack
              </h2>
              <p className="text-[12.5px] text-ink-soft">
                Add fresh trays to the rack to reopen flavours on the shop
              </p>
            </div>
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

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6 space-y-5">
          {/* Sold out section */}
          {soldOutFlavours.length > 0 ? (
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-[14px] font-bold text-ink">
                    Sold out flavours ({soldOutFlavours.length})
                  </h3>
                  <p className="text-[12px] text-ink-soft">
                    Currently disabled on customer storefront
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRestockAllStandard}
                  className="label-caps inline-flex items-center gap-1 rounded-full border border-ink/20 bg-shell px-3 py-1.5 text-[9.5px] font-bold text-ink hover:border-ink/50 active:scale-95"
                >
                  <RotateCcw className="h-3 w-3 text-gold" />
                  <span>Set all to 1 tray (+12)</span>
                </button>
              </div>

              <ul className="space-y-3">
                {soldOutFlavours.map((f) => {
                  const qty = restockAmounts[f.id] ?? 12
                  return (
                    <li
                      key={f.id}
                      className="rounded-[20px] border-2 border-gold/40 bg-[#fffdf9] p-4 shadow-xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[14px] border border-line-soft bg-cream-deep">
                          <CookieTile
                            art={f.art}
                            seedKey={`restock-${f.id}`}
                            photo={f.photo}
                            className="h-full w-full"
                            inset={4}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-[15px] text-ink truncate">{f.name}</h4>
                            <span className="label-caps shrink-0 rounded-full bg-brick/12 px-2 py-0.5 text-[9px] font-bold text-brick">
                              0 left
                            </span>
                          </div>
                          <p className="text-[11.5px] text-ink-soft truncate">{f.desc}</p>
                        </div>
                      </div>

                      <div className="mt-3.5 pt-3 border-t border-line-soft flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 text-[12px] text-ink-soft">
                          <span>Bake &amp; add:</span>
                          <span className="font-bold text-ink text-[13px]">
                            {qty} cookies ({Math.ceil(qty / 12)} {Math.ceil(qty / 12) === 1 ? 'tray' : 'trays'})
                          </span>
                        </div>

                        {/* Quantity picker */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Decrease restock for ${f.name}`}
                            onClick={() => addAmount(f.id, -6)}
                            className="grid h-8 w-8 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 active:scale-95"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <input
                            type="number"
                            min={0}
                            step={6}
                            value={qty}
                            onChange={(e) => setAmount(f.id, Number(e.target.value))}
                            className="h-8 w-[50px] rounded-[10px] border border-line bg-shell p-0 text-center text-[14px] font-bold tabular-nums text-ink leading-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-ink/40 focus:outline-none"
                          />
                          <button
                            type="button"
                            aria-label={`Increase restock for ${f.name}`}
                            onClick={() => addAmount(f.id, 6)}
                            className="grid h-8 w-8 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 active:scale-95"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <div className="flex gap-1 ml-1">
                            <button
                              type="button"
                              onClick={() => setAmount(f.id, 12)}
                              className={`rounded-full px-2.5 py-1 text-[9.5px] font-bold tracking-wider uppercase transition-all ${
                                qty === 12
                                  ? 'bg-cocoa text-cream'
                                  : 'border border-line bg-shell text-ink-soft hover:text-ink'
                              }`}
                            >
                              +12
                            </button>
                            <button
                              type="button"
                              onClick={() => setAmount(f.id, 24)}
                              className={`rounded-full px-2.5 py-1 text-[9.5px] font-bold tracking-wider uppercase transition-all ${
                                qty === 24
                                  ? 'bg-cocoa text-cream'
                                  : 'border border-line bg-shell text-ink-soft hover:text-ink'
                              }`}
                            >
                              +24
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <div className="rounded-[20px] border border-leaf/30 bg-leaf-soft/20 p-4.5 flex items-center gap-3">
              <Check className="h-5 w-5 text-leaf shrink-0" />
              <div>
                <p className="text-[14px] font-bold text-ink">All flavours currently in stock</p>
                <p className="text-[12px] text-ink-soft">
                  Every cookie flavour has available inventory on the rack.
                </p>
              </div>
            </div>
          )}

          {/* Other flavours (collapsible toggle) */}
          <div className="border-t border-line-soft pt-3">
            <button
              type="button"
              onClick={() => setShowAllFlavours((v) => !v)}
              className="flex w-full items-center justify-between py-2 text-left transition-colors text-ink hover:text-ink/80"
            >
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-bold">
                  {showAllFlavours ? 'Hide' : 'Add to'} other rack flavours ({otherFlavours.length})
                </span>
                <span className="text-[11.5px] text-ink-soft">
                  (Currently in stock)
                </span>
              </div>
              {showAllFlavours ? (
                <ChevronUp className="h-4 w-4 text-ink-soft" />
              ) : (
                <ChevronDown className="h-4 w-4 text-ink-soft" />
              )}
            </button>

            {showAllFlavours && (
              <ul className="mt-3 space-y-2.5">
                {otherFlavours.map((f) => {
                  const qty = restockAmounts[f.id] ?? 0
                  return (
                    <li
                      key={f.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-line-soft bg-shell/80 px-3.5 py-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-[8px] border border-line-soft bg-cream-deep">
                          <CookieTile
                            art={f.art}
                            seedKey={`other-${f.id}`}
                            photo={f.photo}
                            className="h-full w-full"
                            inset={2}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-semibold text-ink">{f.name}</p>
                          <p className="text-[11px] text-ink-soft">{f.stock} currently on rack</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11.5px] text-ink-soft">Add:</span>
                        <button
                          type="button"
                          onClick={() => addAmount(f.id, -6)}
                          disabled={qty <= 0}
                          className="grid h-7 w-7 place-items-center rounded-full border border-line bg-shell text-ink disabled:opacity-40 active:scale-95"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={qty}
                          onChange={(e) => setAmount(f.id, Number(e.target.value))}
                          className="h-7 w-[46px] rounded-[8px] border border-line bg-shell p-0 text-center text-[13px] font-bold tabular-nums text-ink leading-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => addAmount(f.id, 6)}
                          className="grid h-7 w-7 place-items-center rounded-full border border-line bg-shell text-ink active:scale-95"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 border-t border-line bg-cream px-5 py-4 md:px-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/dashboard/menu"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-soft hover:text-ink hover:underline"
          >
            <UtensilsCrossed className="h-3.5 w-3.5" />
            <span>Open full menu &amp; recipe editor</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-ink/20 bg-shell px-4 py-2 text-[10.5px] font-bold tracking-[0.09em] text-ink uppercase shadow-xs transition-all hover:border-ink/50 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2 text-[10.5px] font-bold tracking-[0.09em] text-cream uppercase shadow-xs transition-all hover:bg-cocoa-soft active:scale-95"
            >
              <Check className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
              <span>
                {totalToAdd > 0
                  ? `Restock ${flavoursRestockedCount} (${totalToAdd} cookies)`
                  : 'Done'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
