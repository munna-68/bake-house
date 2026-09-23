import { useState } from 'react'
import { useShop } from '../lib/store'
import type { Flavour } from '../lib/types'
import { BoxBuilderPanel, MobileBoxControls } from './BoxBuilder'
import { CookieArtSvg } from './Cookie'
import { Minus, Plus } from 'lucide-react'

export function BatchGrid() {
  const { flavours } = useShop()

  return (
    <section id="build" className="container-page scroll-mt-24 pt-6 pb-12 sm:pt-8">
      {/* Section Header: Clean title without any hyphen or badge */}
      <header className="max-w-[58ch]">
        <h2 className="font-display text-[38px] sm:text-[48px] lg:text-[54px] leading-[1.04] tracking-[-0.015em] text-ink">
          Fresh cookies. Your way.
        </h2>
        <p className="mt-3 text-[15.5px] sm:text-[17px] leading-relaxed text-ink-soft">
          Every number below is a real count of what is left on the rack right now. When a flavour runs out we do not
          bake it again until tomorrow.
        </p>
      </header>

      {/* Mobile box controls: Sticky below header when scrolling */}
      <div className="sticky top-[64px] sm:top-[68px] z-30 -mx-4 px-4 py-2 bg-cream/95 backdrop-blur-md border-y border-line/80 shadow-[0_4px_16px_-4px_rgba(43,29,19,0.06)] lg:hidden my-4">
        <MobileBoxControls />
      </div>

      {/* Main layout: Sidebar + 3-column Cookie Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="hidden lg:sticky lg:top-[92px] lg:block">
          <BoxBuilderPanel />
        </div>

        {/* 3 columns on desktop as requested */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {flavours.map((f, i) => (
            <ProductCard key={f.id} flavour={f} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ flavour, index }: { flavour: Flavour; index: number }) {
  const { qtyInOrder, available, canAdd, add, remove, vote, activeBox } = useShop()
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null)
  const qty = qtyInOrder(flavour.id)
  const left = available(flavour.id)
  const soldOut = left === 0 && qty === 0
  const boxFull = !canAdd(flavour.id) && !soldOut && qty === 0
  const showPhoto = Boolean(flavour.photo) && brokenSrc !== flavour.photo

  const stockLine =
    soldOut
      ? 'Sold out today'
      : left === 0
        ? 'All in your order'
        : qty > 0
          ? `${left} left`
          : left === 1
            ? 'Only 1 left'
            : left <= 4
              ? `Only ${left} left`
              : `${left} left today`

  return (
    <article
      className={`group cookie-card-hover relative flex flex-col justify-between rounded-[22px] border bg-shell p-4 sm:p-5 pt-3.5 sm:pt-4 text-left shadow-xs transition-all duration-200 ${
        qty > 0
          ? 'border-brick/75 ring-1 ring-brick/25 shadow-sm'
          : 'border-line hover:border-[#dbcbb9] hover:shadow-sm'
      } ${soldOut ? 'bg-shell/70' : ''}`}
    >
      {/* Top row: Index number */}
      <div className="flex items-center justify-between">
        <span className="label-caps text-[11px] text-ink-soft/60">
          {String(index).padStart(2, '0')}
        </span>
      </div>

      {/* Centered Cookie Image with smooth spin animation on hover */}
      <div className="my-2 flex items-center justify-center">
        <div className="aspect-square w-[68%] max-w-[160px] sm:max-w-[175px]">
          {showPhoto ? (
            <img
              src={flavour.photo}
              alt={flavour.name}
              decoding="async"
              onError={() => setBrokenSrc(flavour.photo ?? null)}
              className={`cookie-spin h-full w-full object-contain drop-shadow-[0_12px_20px_rgba(43,29,19,0.18)] ${
                soldOut ? 'opacity-55 saturate-[0.35]' : ''
              }`}
            />
          ) : (
            <CookieArtSvg
              art={flavour.art}
              seedKey={flavour.id}
              title={flavour.name}
              className={`cookie-spin h-full w-full drop-shadow-[0_12px_20px_rgba(43,29,19,0.18)] ${
                soldOut ? 'opacity-55 saturate-[0.35]' : ''
              }`}
            />
          )}
        </div>
      </div>

      {/* Details: Name, description, allergen chips */}
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-[21px] sm:text-[23px] font-bold leading-tight text-ink">
          {flavour.name}
        </h3>
        <p className="mt-1 text-[13px] leading-snug text-ink-soft">
          {flavour.desc}
        </p>

        <ul className="mt-2.5 flex flex-wrap gap-1" aria-label="Allergens">
          {flavour.allergens.map((a) => (
            <li
              key={a}
              className="label-caps rounded-full border border-line bg-shell/80 px-2 py-0.5 text-[8.5px] font-semibold tracking-wider text-ink-soft/90"
            >
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom row: Stock indicator and Add button / Stepper */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line-soft pt-3">
        <span className="flex min-w-0 items-center gap-1.5">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              soldOut
                ? 'bg-ink/25'
                : left <= 2
                  ? 'bg-brick'
                  : 'bg-[#4a8a56]'
            }`}
            aria-hidden="true"
          />
          <span className="label-caps truncate text-[10px] text-ink-soft font-semibold">
            {stockLine}
          </span>
        </span>

        {soldOut ? (
          <button
            type="button"
            onClick={() => vote(flavour.id)}
            aria-label={`${flavour.name}, sold out today. Tap to tell us you wanted it.`}
            className="min-h-11 shrink-0 rounded-full border border-line bg-cream/50 px-4 py-2.5 text-[10px] font-bold tracking-[0.08em] text-ink-soft uppercase transition-colors hover:border-ink/40 active:scale-95"
          >
            Add
          </button>
        ) : qty > 0 ? (
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-line bg-shell px-1.5 py-1">
            <button
              type="button"
              onClick={() => remove(flavour.id)}
              aria-label={`Remove one ${flavour.name}`}
              className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-cream-deep active:scale-95 sm:h-8 sm:w-8"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="min-w-[20px] text-center text-[13px] font-bold text-ink" aria-hidden="true">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => add(flavour.id)}
              disabled={!canAdd(flavour.id)}
              aria-label={`Add another ${flavour.name}`}
              className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-cream-deep active:scale-95 disabled:cursor-not-allowed disabled:text-ink-faint/50 sm:h-8 sm:w-8"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => add(flavour.id)}
            disabled={boxFull}
            aria-label={`Add ${flavour.name} to your box`}
            className="min-h-11 shrink-0 rounded-full border border-ink/25 px-5 py-2.5 text-[10.5px] font-bold tracking-[0.09em] text-ink uppercase transition-all hover:border-ink hover:bg-cream-deep active:scale-95 disabled:cursor-not-allowed disabled:border-line disabled:text-ink-faint/50"
          >
            Add
          </button>
        )}
      </div>

      {boxFull && !soldOut ? (
        <p className="label-caps mt-2 text-[8.5px] text-ink-faint">
          Box {activeBox.size} is full — remove one to swap
        </p>
      ) : null}
    </article>
  )
}
