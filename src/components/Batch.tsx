import { FLAVOURS } from '../lib/data'
import { useShop } from '../lib/store'
import type { Flavour } from '../lib/types'
import { BoxBuilderPanel, MobileBoxControls } from './BoxBuilder'
import { CookieTile } from './Cookie'

export function BatchGrid() {
  return (
    <section id="build" className="container-page scroll-mt-24 pb-4">
      <header className="max-w-[52ch]">
        <h2 className="heading-lg text-ink">Today&rsquo;s batch</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">
          Every number below is a real count of what is left on the rack right now. When a flavour runs out we do not
          bake it again until tomorrow.
        </p>
      </header>

      <div className="mt-7 lg:hidden">
        <MobileBoxControls />
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start lg:gap-7">
        <div className="hidden lg:sticky lg:top-[92px] lg:block">
          <BoxBuilderPanel />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {FLAVOURS.map((f, i) => (
            <ProductCard key={f.id} flavour={f} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ flavour, index }: { flavour: Flavour; index: number }) {
  const { qtyInOrder, available, canAdd, add, remove, vote, activeBox } = useShop()
  const qty = qtyInOrder(flavour.id)
  const left = available(flavour.id)
  const soldOut = left === 0 && qty === 0
  const boxFull = !canAdd(flavour.id) && !soldOut && qty === 0

  const stockLine =
    left === 0 ? 'All in your order' : left === 1 ? 'Only 1 left' : left <= 4 ? `Only ${left} left` : `${left} left today`

  if (soldOut) {
    return (
      <button
        type="button"
        onClick={() => vote(flavour.id)}
        aria-label={`${flavour.name}, sold out today. Tap to tell us you wanted it.`}
        className="group relative flex min-h-[210px] flex-col rounded-[22px] border border-dashed border-ink/20 bg-transparent p-4 pt-3 text-left transition-colors hover:border-ink/40 sm:p-5 sm:pt-4"
      >
        <span className="label-caps absolute top-3 left-4 text-ink-faint sm:left-5">
          {String(index).padStart(2, '0')}
        </span>
        <div className="flex flex-1 items-start gap-4 pt-6 sm:flex-col sm:gap-3">
          <CookieTile
            art={flavour.art}
            seedKey={flavour.id}
            photo={flavour.photo}
            dim
            inset={5}
            title={`${flavour.name}, sold out`}
            className="h-[92px] w-[92px] shrink-0 rounded-[16px] sm:h-14 sm:w-14 sm:rounded-[12px]"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[20px] leading-tight text-ink/55 sm:text-[19px]">{flavour.name}</h3>
            <p className="mt-1.5 text-[14px] leading-snug text-ink-soft/80">
              Sold out today. Tap to tell us you wanted it.
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-ink/25" aria-hidden="true" />
            <span className="label-caps text-[10px] text-ink-faint">Sold out today</span>
          </span>
          <span className="label-caps text-[10px] text-ink-faint">Back at 7am</span>
        </div>
      </button>
    )
  }

  return (
    <article className="relative flex flex-col rounded-[22px] border border-line bg-shell p-4 pt-3 shadow-card sm:p-5 sm:pt-4">
      <span className="label-caps absolute top-3 left-4 text-ink-faint sm:left-5">
        {String(index).padStart(2, '0')}
      </span>

      <div className="flex flex-1 items-start gap-4 pt-6 sm:flex-col sm:gap-3">
        <CookieTile
          art={flavour.art}
          seedKey={flavour.id}
          title={flavour.name}
          photo={flavour.photo}
          inset={5}
          className="h-[92px] w-[92px] shrink-0 rounded-[16px] sm:h-14 sm:w-14 sm:rounded-[12px]"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[21px] leading-tight text-ink sm:text-[20px]">{flavour.name}</h3>
          <p className="mt-1.5 text-[14px] leading-snug text-ink-soft">{flavour.desc}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {flavour.allergens.map((a) => (
              <li
                key={a}
                className="label-caps rounded-full border border-line px-2.5 py-1 text-[9px] text-ink-soft"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
          <span className="label-caps truncate text-[10px] text-ink-soft">{stockLine}</span>
        </span>

        {qty > 0 ? (
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-line px-1 py-1">
            <button
              type="button"
              onClick={() => remove(flavour.id)}
              aria-label={`Remove one ${flavour.name}`}
              className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-cream-deep"
            >
              <span aria-hidden="true">−</span>
            </button>
            <span className="min-w-[20px] text-center text-[14px] font-bold text-ink" aria-hidden="true">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => add(flavour.id)}
              disabled={!canAdd(flavour.id)}
              aria-label={`Add another ${flavour.name}`}
              className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-cream-deep disabled:cursor-not-allowed disabled:text-ink-faint"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => add(flavour.id)}
            disabled={boxFull}
            aria-label={`Add ${flavour.name} to your box`}
            className="shrink-0 rounded-full border border-ink/25 px-5 py-2 text-[11px] font-bold tracking-[0.09em] text-ink uppercase transition-colors hover:border-ink hover:bg-cream-deep disabled:cursor-not-allowed disabled:border-line disabled:text-ink-faint"
          >
            Add
          </button>
        )}
      </div>

      {boxFull ? (
        <p className="label-caps mt-2 text-[9px] text-ink-faint">
          Box {activeBox.size} is full — remove one to swap
        </p>
      ) : null}
    </article>
  )
}
