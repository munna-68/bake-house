import { BOX_PRICES, BOX_SIZES, type Box, type BoxSize } from '../lib/types'
import { money } from '../lib/format'
import { useShop } from '../lib/store'
import { CookieTile } from './Cookie'

function useCta() {
  const { totalCookies, capacity, boxes, isBoxFull, orderTotal } = useShop()
  const allFull = boxes.every(isBoxFull)
  if (totalCookies === 0) {
    return { label: 'Fill the box to continue', disabled: true, tone: 'muted' as const }
  }
  if (allFull) {
    return { label: `Checkout · ${money(orderTotal)}`, disabled: false, tone: 'primary' as const }
  }
  /* Clamped: an over-filled box (only reachable from a hand-edited saved state)
     would otherwise read "add -2 more free". */
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
  const cols = box.size === 12 ? 'grid-cols-3' : 'grid-cols-2'
  const width = box.size === 12 ? 'max-w-[240px]' : 'max-w-[204px]'

  return (
    /* Not aria-hidden: a filled slot carries its own remove button, and that is
       the only way to take a cookie back out without scrolling to the grid. */
    <ul className={`mx-auto grid w-full ${cols} ${width} gap-2.5`}>
      {Array.from({ length: box.size }).map((_, i) => {
        const flavourId = filled[i]
        const flavour = flavourId ? flavours.find((f) => f.id === flavourId) : undefined
        return (
          <li
            key={i}
            className={`relative aspect-square rounded-[16px] ${
              flavour ? '' : 'border border-dashed border-cream/18'
            }`}
          >
            {flavour ? (
              <>
                <div className="h-full w-full overflow-hidden rounded-[16px]">
                  <CookieTile
                    art={flavour.art}
                    seedKey={`slot-${box.id}-${flavour.id}-${i}`}
                    photo={flavour.photo}
                    className="h-full w-full"
                    inset={6}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(flavour.id)}
                  aria-label={`Remove one ${flavour.name}`}
                  className="absolute -top-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full bg-cream text-[13px] leading-none text-cocoa transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

function SizePills({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const { activeBox, setSize } = useShop()
  const dark = tone === 'dark'
  return (
    <div role="group" aria-label="Box size" className="mt-4 grid grid-cols-3 gap-2">
      {BOX_SIZES.map((size: BoxSize) => {
        const on = activeBox.size === size
        const cls = dark
          ? on
            ? 'bg-cream text-cocoa'
            : 'border border-cream/22 text-cream hover:border-cream/45'
          : on
            ? 'bg-cocoa text-cream'
            : 'border border-line bg-shell text-ink hover:border-ink/35'
        return (
          <button
            key={size}
            type="button"
            aria-pressed={on}
            onClick={() => setSize(size)}
            className={`flex min-h-11 items-center justify-center gap-1.5 rounded-full px-3 py-3 transition-colors ${cls}`}
          >
            <span className="font-display text-[19px] leading-none">{size}</span>
            <span
              className={`text-[12px] font-semibold ${
                dark ? (on ? 'text-cocoa/70' : 'text-cream/60') : on ? 'text-cream/70' : 'text-ink-soft'
              }`}
            >
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
  return (
    <div className="flex flex-wrap items-center gap-2">
      {boxes.map((b, i) => {
        const on = b.id === activeBoxId
        return (
          <button
            key={b.id}
            type="button"
            aria-pressed={on}
            onClick={() => setActiveBox(b.id)}
            className={`label-caps min-h-11 rounded-full px-3.5 py-2 text-[10px] transition-colors ${
              on ? 'bg-gold text-cocoa' : 'border border-cream/22 text-cream/70 hover:border-cream/45'
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
          className="label-caps min-h-11 rounded-full border border-cream/22 px-3.5 py-2 text-[10px] text-cream/70 transition-colors hover:border-cream/45"
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
      className={`w-full rounded-full px-6 py-4 text-[12px] font-bold tracking-[0.09em] uppercase transition-colors ${
        cta.tone === 'muted'
          ? 'bg-cream/12 text-cream/45'
          : 'bg-brick text-white hover:bg-brick-dark'
      } ${full ? '' : 'mt-1'}`}
    >
      {cta.label}
    </button>
  )
}

/** Desktop: the dark sticky panel beside the grid. */
export function BoxBuilderPanel() {
  const { activeBox, boxes, boxCount, orderTotal, flavours, add, remove, clearBox, canAdd, addBox, removeBox } =
    useShop()
  const index = boxes.findIndex((b) => b.id === activeBox.id)
  const items = flavours.filter((f) => (activeBox.items[f.id] ?? 0) > 0)
  const others = boxes.filter((b) => b.id !== activeBox.id)

  return (
    <div className="grid grid-rows-[minmax(0,1fr)_auto] rounded-[26px] bg-cocoa p-5 text-cream lg:max-h-[calc(100dvh-112px)]">
      {/* Scrollable: everything the customer edits. */}
      <div className="panel-scroll overflow-y-auto overscroll-contain">
        <BoxTabs />

        <div className="mt-4 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[26px] leading-none text-cream">Box {index + 1}</h3>
          <span className="label-caps text-[10px] text-cream/55">
            {boxCount(activeBox)} of {activeBox.size}
          </span>
        </div>

        <SizePills />

        <div className="mt-4">
          <SlotGrid box={activeBox} />
        </div>

        <div className="mt-5 border-t border-cream/12 pt-4">
          {others.map((b) => (
            <div key={b.id} className="mb-3 flex items-baseline justify-between gap-3">
              <span className="text-[13px] text-cream/60">
                Box {boxes.indexOf(b) + 1} · {boxCount(b)} {boxCount(b) === 1 ? 'cookie' : 'cookies'}
              </span>
              <span className="text-[13px] text-cream/60">{money(BOX_PRICES[b.size])}</span>
            </div>
          ))}

          {items.length === 0 ? (
            <p className="text-[13px] leading-relaxed text-cream/50">
              Nothing in this box yet. Tap add on a flavour and it drops in.
            </p>
          ) : (
            <>
              <ul className="space-y-1.5">
                {items.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-[13px] text-cream/85">{f.name}</span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => remove(f.id)}
                        aria-label={`Remove one ${f.name} from the box`}
                        className="grid h-7 w-7 place-items-center rounded-full border border-cream/25 text-[15px] leading-none text-cream transition-colors hover:border-cream/55"
                      >
                        <span aria-hidden="true">−</span>
                      </button>
                      <span className="w-5 text-center text-[13px] text-cream/70">{activeBox.items[f.id]}</span>
                      <button
                        type="button"
                        onClick={() => add(f.id)}
                        disabled={!canAdd(f.id)}
                        aria-label={`Add another ${f.name} to the box`}
                        className="grid h-7 w-7 place-items-center rounded-full border border-cream/25 text-[15px] leading-none text-cream transition-colors hover:border-cream/55 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <span aria-hidden="true">+</span>
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={clearBox}
                className="mt-3 text-[11px] text-cream/45 underline underline-offset-4 transition-colors hover:text-cream/70"
              >
                Empty box {index + 1}
              </button>
            </>
          )}

          <div className="mt-4 flex items-baseline justify-between gap-3">
            <span className="text-[13px] text-cream/60">
              {items.length > 0 ? `Box of ${activeBox.size}` : '\u00a0'}
            </span>
            <span className="text-[13px] text-cream/60">
              {items.length > 0 ? money(BOX_PRICES[activeBox.size]) : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Pinned: the total and the primary action, always on screen. */}
      <div className="border-t border-cream/12 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="label-caps text-[11px] text-cream/60">Total</span>
          <span className="font-display text-[34px] leading-none text-cream">{money(orderTotal)}</span>
        </div>

        <div className="mt-4">
          <CtaButton />
        </div>

        <p className="mt-3 text-center text-[10px] tracking-[0.08em] text-cream/45 uppercase">
          No account needed
          <br />
          Change or cancel up to 2 hours before
        </p>

        <button
          type="button"
          onClick={addBox}
          disabled={boxes.length >= 4}
          className="mt-4 min-h-11 w-full rounded-full border border-cream/22 px-6 py-3.5 text-[11px] font-bold tracking-[0.09em] text-cream/80 uppercase transition-colors hover:border-cream/45 disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Add another box
        </button>

        {boxes.length > 1 ? (
          <button
            type="button"
            onClick={() => removeBox(activeBox.id)}
            className="mt-2 w-full text-center text-[11px] text-cream/45 underline underline-offset-4 hover:text-cream/70"
          >
            Remove box {index + 1}
          </button>
        ) : null}
      </div>
    </div>
  )
}

/** Mobile: the compact strip that sits directly above the grid. */
export function MobileBoxControls() {
  const { activeBox, boxCount, orderTotal, cookiesLeftToday, flavours } = useShop()
  const startOfDay = flavours.reduce((a, f) => a + f.stock, 0)
  const pct = startOfDay > 0 ? Math.round((cookiesLeftToday / startOfDay) * 100) : 0

  return (
    <div className="lg:hidden">
      <SizePills tone="light" />

      <div className="mt-3 flex items-center gap-3">
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brick" style={{ width: `${Math.max(3, pct)}%` }} />
        </div>
        <span className="label-caps shrink-0 text-[10px] text-ink-soft">{cookiesLeftToday} left today</span>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <span className="label-caps rounded-full bg-brick px-3.5 py-2 text-[10px] text-white">
          Box 1 · {boxCount(activeBox)}/{activeBox.size}
        </span>
        <AddBoxPill />
      </div>

      <div className="mt-3.5 flex items-center gap-3">
        <ul className="flex min-w-0 flex-1 gap-2" aria-hidden="true">
          {Array.from({ length: activeBox.size }).map((_, i) => {
            const filled: string[] = []
            for (const f of flavours) {
              for (let n = 0; n < (activeBox.items[f.id] ?? 0); n++) filled.push(f.id)
            }
            const flavour = filled[i] ? flavours.find((f) => f.id === filled[i]) : undefined
            return (
              <li
                key={i}
                className={`h-10 w-10 shrink-0 overflow-hidden rounded-full ${
                  flavour ? '' : 'border border-dashed border-line'
                }`}
              >
                {flavour ? (
                  <CookieTile
                    art={flavour.art}
                    seedKey={`m-slot-${activeBox.id}-${flavour.id}-${i}`}
                    photo={flavour.photo}
                    className="h-full w-full"
                    inset={4}
                  />
                ) : null}
              </li>
            )
          })}
        </ul>
        <span className="shrink-0 rounded-full bg-brick px-4 py-2.5 text-[12px] font-bold tracking-[0.06em] text-white">
          {money(orderTotal)}
        </span>
      </div>
    </div>
  )
}

function AddBoxPill() {
  const { addBox, boxes } = useShop()
  if (boxes.length >= 4) return null
  return (
    <button
      type="button"
      onClick={addBox}
      className="label-caps min-h-11 rounded-full border border-ink/20 px-3.5 py-2 text-[10px] text-ink-soft transition-colors hover:border-ink/40"
    >
      + Box
    </button>
  )
}
