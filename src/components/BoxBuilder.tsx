import { BOX_PRICES, BOX_SIZES, type Box, type BoxSize } from '../lib/types'
import { money } from '../lib/format'
import { useShop } from '../lib/store'
import { CookieTile } from './Cookie'
import { ArrowRight, Minus, Plus, X } from 'lucide-react'

function useCta() {
  const { totalCookies, capacity, boxes, isBoxFull, orderTotal } = useShop()
  const allFull = boxes.every(isBoxFull)
  if (totalCookies === 0) {
    return { label: 'Fill the box to continue', disabled: true, tone: 'muted' as const }
  }
  if (allFull) {
    return { label: `Checkout · ${money(orderTotal)}`, disabled: false, tone: 'primary' as const }
  }
  const more = Math.max(0, capacity - totalCookies)
  return {
    label: `Checkout with ${totalCookies} (add ${more} more free)`,
    disabled: false,
    tone: 'primary' as const,
  }
}

function SlotGrid({ box }: { box: Box }) {
  const { flavours, remove } = useShop()
  const filled: string[] = []
  for (const f of flavours) {
    const n = box.items[f.id] ?? 0
    for (let i = 0; i < n; i++) filled.push(f.id)
  }
  const cols = box.size === 4 ? 'grid-cols-2 max-w-[160px]' : 'grid-cols-3 max-w-[240px]'

  return (
    <ul className={`mx-auto grid w-full ${cols} gap-2.5`}>
      {Array.from({ length: box.size }).map((_, i) => {
        const flavourId = filled[i]
        const flavour = flavourId ? flavours.find((f) => f.id === flavourId) : undefined
        return (
          <li
            key={i}
            className={`relative aspect-square rounded-[14px] flex items-center justify-center transition-all ${
              flavour
                ? 'bg-shell shadow-xs border border-line-soft'
                : 'border border-dashed border-[#d8cdbf] bg-cream/40'
            }`}
          >
            {flavour ? (
              <>
                <div className="h-full w-full overflow-hidden rounded-[14px] p-1">
                  <CookieTile
                    art={flavour.art}
                    seedKey={`slot-${box.id}-${flavour.id}-${i}`}
                    photo={flavour.photo}
                    className="h-full w-full"
                    inset={4}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(flavour.id)}
                  aria-label={`Remove one ${flavour.name}`}
                  className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-brick text-white shadow-xs transition-transform hover:scale-110 active:scale-95"
                >
                  <X className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </>
            ) : (
              <span className="text-[14px] font-semibold text-ink-faint/60" aria-hidden="true">
                {i + 1}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function SizePills() {
  const { activeBox, setSize } = useShop()
  return (
    <div role="group" aria-label="Box size" className="mt-3 grid grid-cols-3 gap-2">
      {BOX_SIZES.map((size: BoxSize) => {
        const on = activeBox.size === size
        return (
          <button
            key={size}
            type="button"
            aria-pressed={on}
            onClick={() => setSize(size)}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-[14px] transition-all active:scale-95 ${
              on
                ? 'bg-brick text-white shadow-xs'
                : 'border border-line bg-shell text-ink hover:border-ink/30'
            }`}
          >
            <span className="font-display text-[22px] leading-tight font-bold">{size}</span>
            <span className={`text-[11.5px] font-semibold mt-0.5 ${on ? 'text-white/85' : 'text-ink-soft'}`}>
              {money(BOX_PRICES[size])}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function BoxTabs() {
  const { boxes, activeBoxId, setActiveBox, addBox, boxCount } = useShop()
  if (boxes.length <= 1) return null

  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5 border-b border-line pb-3">
      {boxes.map((b, i) => {
        const on = b.id === activeBoxId
        return (
          <button
            key={b.id}
            type="button"
            aria-pressed={on}
            onClick={() => setActiveBox(b.id)}
            className={`label-caps rounded-full px-3 py-1.5 text-[9.5px] transition-colors ${
              on
                ? 'bg-brick text-white font-bold'
                : 'border border-line bg-shell text-ink-soft hover:border-ink/30'
            }`}
          >
            Box {i + 1} · {boxCount(b)}/{b.size}
          </button>
        )
      })}
      {boxes.length < 4 ? (
        <button
          type="button"
          onClick={addBox}
          className="label-caps rounded-full border border-line bg-shell px-2.5 py-1.5 text-[9.5px] text-ink-soft transition-colors hover:border-ink/30"
        >
          + Box
        </button>
      ) : null}
    </div>
  )
}

function CtaButton({ full = false }: { full?: boolean }) {
  const { openCheckout, totalCookies } = useShop()
  const cta = useCta()
  return (
    <button
      type="button"
      onClick={() => openCheckout(1)}
      disabled={cta.disabled || totalCookies === 0}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[12px] font-bold tracking-[0.09em] uppercase transition-all shadow-xs ${
        cta.tone === 'muted'
          ? 'bg-line text-ink-faint/70 cursor-not-allowed'
          : 'bg-brick text-white hover:bg-brick-dark active:scale-95'
      } ${full ? '' : 'mt-1'}`}
    >
      <span>{cta.label}</span>
      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  )
}

/** Desktop: the warm light sticky panel beside the grid matching image 3. */
export function BoxBuilderPanel() {
  const { activeBox, boxes, boxCount, orderTotal, flavours, add, remove, clearBox, canAdd, addBox, removeBox } =
    useShop()
  const index = boxes.findIndex((b) => b.id === activeBox.id)
  const items = flavours.filter((f) => (activeBox.items[f.id] ?? 0) > 0)
  const others = boxes.filter((b) => b.id !== activeBox.id)

  return (
    <div className="grid grid-rows-[minmax(0,1fr)_auto] rounded-[24px] border border-line bg-[#faf6f0] p-5 text-ink shadow-[0_4px_24px_-6px_rgba(43,29,19,0.06)] lg:max-h-[calc(100dvh-112px)]">
      {/* Scrollable: size selector, slot grid, and current box contents */}
      <div className="panel-scroll overflow-y-auto overscroll-contain pr-0.5">
        <BoxTabs />

        {/* Choose Box Size */}
        <div>
          <p className="label-caps text-[10px] tracking-[0.16em] text-ink-soft">
            Choose your box size
          </p>
          <SizePills />
        </div>

        {/* Add Cookies to Box (Slot Grid) */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-3">
            <p className="label-caps text-[10px] tracking-[0.16em] text-ink-soft">
              Add cookies to your box
            </p>
            <span className="label-caps text-[9.5px] text-ink-soft">
              {boxCount(activeBox)} of {activeBox.size} filled
            </span>
          </div>

          <SlotGrid box={activeBox} />
        </div>

        {/* Added cookies breakdown */}
        <div className="mt-5 border-t border-line pt-3.5">
          {others.map((b) => (
            <div key={b.id} className="mb-2.5 flex items-baseline justify-between gap-3 text-[12.5px] text-ink-soft">
              <span>
                Box {boxes.indexOf(b) + 1} · {boxCount(b)} {boxCount(b) === 1 ? 'cookie' : 'cookies'}
              </span>
              <span className="font-semibold text-ink">{money(BOX_PRICES[b.size])}</span>
            </div>
          ))}

          {items.length === 0 ? (
            <p className="text-[12.5px] leading-relaxed text-ink-soft/75 text-center py-1">
              Select any flavour from the rack to add cookies to this box.
            </p>
          ) : (
            <>
              <ul className="space-y-1.5">
                {items.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3 text-[13px]">
                    <span className="min-w-0 truncate text-ink font-medium">{f.name}</span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => remove(f.id)}
                        aria-label={`Remove one ${f.name} from the box`}
                        className="grid h-6 w-6 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40"
                      >
                        <Minus className="h-3 w-3" aria-hidden="true" />
                      </button>
                      <span className="w-4 text-center font-bold text-ink">{activeBox.items[f.id]}</span>
                      <button
                        type="button"
                        onClick={() => add(f.id)}
                        disabled={!canAdd(f.id)}
                        aria-label={`Add another ${f.name} to the box`}
                        className="grid h-6 w-6 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <Plus className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={clearBox}
                  className="text-[11px] text-ink-soft/70 underline underline-offset-4 transition-colors hover:text-ink"
                >
                  Empty box {index + 1}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pinned: Total, CTA button, and checkout subtext */}
      <div className="border-t border-line pt-4 mt-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="label-caps text-[11px] text-ink-soft tracking-wider">Total</span>
          <span className="font-display text-[32px] sm:text-[34px] leading-none font-bold text-ink">
            {money(orderTotal)}
          </span>
        </div>

        <div className="mt-3.5">
          <CtaButton />
        </div>

        <p className="label-caps mt-3 text-center text-[10px] text-ink-soft/60 tracking-wider">
          No account needed.
        </p>

        {boxes.length < 4 && (
          <button
            type="button"
            onClick={addBox}
            className="mt-3 min-h-10 w-full rounded-full border border-line bg-shell py-2.5 px-4 text-[10.5px] font-bold tracking-[0.09em] text-ink uppercase transition-colors hover:border-ink/40 active:scale-95"
          >
            + Add another box
          </button>
        )}

        {boxes.length > 1 && (
          <button
            type="button"
            onClick={() => removeBox(activeBox.id)}
            className="mt-2 w-full text-center text-[10.5px] text-ink-soft/60 underline underline-offset-4 hover:text-ink"
          >
            Remove box {index + 1}
          </button>
        )}
      </div>
    </div>
  )
}

function MobileSlotGrid({ box }: { box: Box }) {
  const { flavours, remove } = useShop()
  const filled: string[] = []
  for (const f of flavours) {
    const n = box.items[f.id] ?? 0
    for (let i = 0; i < n; i++) filled.push(f.id)
  }
  const cols = box.size === 4 ? 'grid-cols-4 max-w-[240px]' : 'grid-cols-6'

  return (
    <ul className={`mx-auto grid w-full ${cols} gap-1.5 sm:gap-2`}>
      {Array.from({ length: box.size }).map((_, i) => {
        const flavourId = filled[i]
        const flavour = flavourId ? flavours.find((f) => f.id === flavourId) : undefined
        return (
          <li
            key={i}
            className={`relative aspect-square rounded-full flex items-center justify-center transition-all ${
              flavour
                ? 'bg-shell shadow-xs border border-line-soft'
                : 'border border-dashed border-[#d8cdbf] bg-cream/40'
            }`}
          >
            {flavour ? (
              <>
                <div className="h-full w-full overflow-hidden rounded-full p-0.5">
                  <CookieTile
                    art={flavour.art}
                    seedKey={`m-slot-${box.id}-${flavour.id}-${i}`}
                    photo={flavour.photo}
                    className="h-full w-full"
                    inset={2}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(flavour.id)}
                  aria-label={`Remove one ${flavour.name}`}
                  className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-brick text-white shadow-xs transition-transform active:scale-90"
                >
                  <X className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </>
            ) : (
              <span className="text-[11px] font-bold text-ink-faint/50" aria-hidden="true">
                {i + 1}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/** Mobile: the compact strip that sticks below header while scrolling the grid, with live cookie slot images. */
export function MobileBoxControls() {
  const { activeBox, boxCount, orderTotal, cookiesLeftToday, flavours, isBoxFull } = useShop()
  const startOfDay = flavours.reduce((a, f) => a + f.stock, 0)
  const pct = startOfDay > 0 ? Math.round((cookiesLeftToday / startOfDay) * 100) : 0
  const count = boxCount(activeBox)
  const full = isBoxFull(activeBox)

  return (
    <div className="rounded-[20px] border border-line bg-[#faf6f0] p-3 sm:p-3.5 shadow-sm">
      <BoxTabs />

      <div className="flex items-center justify-between gap-2">
        <p className="label-caps text-[10px] tracking-[0.14em] text-ink-soft">
          Choose box size
        </p>
        <div className="flex items-center gap-2">
          <span className="label-caps rounded-full bg-brick px-2.5 py-1 text-[9.5px] text-white font-bold transition-transform">
            Box · {count}/{activeBox.size}
          </span>
          <span className="font-display text-[19px] sm:text-[21px] font-bold text-ink">
            {money(orderTotal)}
          </span>
        </div>
      </div>

      <div className="mt-2">
        <SizePills />
      </div>

      {/* Visual Slot filling for mobile with real cookie images */}
      <div className="mt-3 rounded-[16px] border border-line-soft bg-shell/70 p-2 sm:p-2.5">
        <div className="mb-2 flex items-center justify-between text-[9.5px]">
          <span className="label-caps text-ink-soft font-bold">
            Box slots · {count} of {activeBox.size} filled
          </span>
          <span className="text-ink-soft/80 font-medium">
            {full ? '✓ Box full' : `Add ${activeBox.size - count} more`}
          </span>
        </div>
        <MobileSlotGrid box={activeBox} />
      </div>

      <div className="mt-2.5 flex items-center gap-2.5">
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brick transition-all duration-300" style={{ width: `${Math.max(3, pct)}%` }} />
        </div>
        <span className="label-caps shrink-0 text-[9px] text-ink-soft font-semibold">{cookiesLeftToday} left today</span>
      </div>
    </div>
  )
}
