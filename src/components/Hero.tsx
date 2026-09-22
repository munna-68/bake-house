import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TRUST } from '../lib/data'
import { useShop } from '../lib/store'
import { CookieArtSvg, CookieTile } from './Cookie'

export function Hero() {
  const { cookiesLeftToday } = useShop()

  return (
    <section id="top" className="container-page pt-8 pb-4 sm:pt-12">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-14">
        <div className="order-2 lg:order-1">
          <FlavourCarousel />
        </div>

        <div className="order-1 lg:order-2">
          <h1 className="heading-xl text-ink">
            One batch.
            <br />
            <span className="text-brick">Nine flavours.</span>
          </h1>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-soft sm:text-[18px]">
            We bake once, at seven in the morning, and stop when the rack is empty. Build a box of four, six or
            twelve, then collect it warm from the counter or take an evening delivery slot.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#build"
              className="min-h-11 rounded-full bg-brick px-7 py-4 text-center text-[12px] font-bold tracking-[0.09em] text-white uppercase transition-colors hover:bg-brick-dark sm:w-auto"
            >
              Build your box
            </a>
            <a
              href="#pickup"
              className="min-h-11 rounded-full border border-ink/25 px-7 py-4 text-center text-[12px] font-bold tracking-[0.09em] text-ink uppercase transition-colors hover:border-ink hover:bg-shell sm:w-auto"
            >
              How pickup works
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
            <p className="flex items-center gap-2.5 rounded-full border border-line bg-shell px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-gold" aria-hidden="true" />
              <span className="label-caps text-[11px] text-ink">
                {cookiesLeftToday} cookies left today
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[13px] tracking-[0.16em] text-gold" aria-hidden="true">
                ★★★★★
              </span>
              <span className="label-caps text-[11px] text-ink-soft">4.8 from 1,047 orders</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FlavourCarousel() {
  const { flavours, add, canAdd, qtyInOrder, available } = useShop()
  const [index, setIndex] = useState(0)
  const liveRef = useRef<HTMLDivElement>(null)
  const total = flavours.length
  const flavour = flavours[Math.min(index, total - 1)]

  const inOrder = qtyInOrder(flavour.id)
  const left = available(flavour.id)
  const soldOut = left === 0 && inOrder === 0
  const addable = canAdd(flavour.id)

  const nextAvailable = useCallback(
    (from: number) => {
      for (let step = 1; step <= total; step++) {
        const i = (from + step) % total
        const f = flavours[i]
        if (f.stock - qtyInOrder(f.id) > 0) return i
      }
      return (from + 1) % total
    },
    [flavours, qtyInOrder, total],
  )

  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + total) % total), [total])

  const onAdd = useCallback(() => {
    if (!addable) return
    const current = index
    add(flavour.id)
    setIndex(nextAvailable(current))
  }, [add, addable, flavour.id, index, nextAvailable])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  useEffect(() => {
    if (!liveRef.current) return
    liveRef.current.textContent = `${flavour.name}. ${soldOut ? 'Sold out today' : `${left} left today`}.`
  }, [flavour.name, left, soldOut])

  const stockLabel = useMemo(() => {
    if (left === 0) return 'All in your order'
    if (left === 1) return 'Only 1 left'
    if (left <= 4) return `Only ${left} left`
    return `${left} left today`
  }, [left])

  return (
    <div className="relative">
      <div
        className="relative overflow-hidden rounded-[30px] bg-cocoa px-5 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-7"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Today's flavours"
        onKeyDown={onKey}
      >
        <span
          className="pointer-events-none absolute top-2 left-4 font-display text-[64px] leading-none text-cream/8 select-none sm:text-[80px]"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="relative flex flex-col items-end gap-2.5">
          <div
            className="grid h-[74px] w-[74px] shrink-0 -rotate-12 place-items-center rounded-full bg-gold text-center"
            aria-hidden="true"
          >
            <span className="label-caps text-[8px] leading-[1.25] text-cocoa">
              7am
              <br />
              out of the oven
              <br />
              daily
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="label-caps text-[11px] text-cream/60">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous flavour"
                className="grid h-11 w-11 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:border-cream/60 active:scale-95 sm:h-9 sm:w-9"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next flavour"
                className="grid h-11 w-11 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:border-cream/60 active:scale-95 sm:h-9 sm:w-9"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        <div key={flavour.id} className="fade-enter mt-2">
          <div className="mx-auto aspect-square w-[68%] max-w-[280px]">
            {flavour.photo ? (
              <img
                src={flavour.photo}
                alt={flavour.name}
                className={`h-full w-full rounded-full object-cover ${
                  soldOut ? 'opacity-60 saturate-[0.35]' : ''
                }`}
              />
            ) : (
              <CookieArtSvg
                art={flavour.art}
                seedKey={flavour.id}
                title={flavour.name}
                className={`h-full w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)] ${
                  soldOut ? 'opacity-60 saturate-[0.35]' : ''
                }`}
              />
            )}
          </div>

          <h2 className="mt-4 text-center font-display text-[30px] leading-none text-cream sm:text-[34px]">
            {flavour.name}
          </h2>
          <p className="mx-auto mt-2.5 max-w-[34ch] text-center text-[14px] leading-relaxed text-cream/70">
            {flavour.desc}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {soldOut ? (
              <>
                <span className="label-caps text-[10px] text-cream/50">Sold out, back at 7am</span>
                <span className="label-caps rounded-full bg-brick/25 px-3 py-1.5 text-[10px] text-[#f0b4a6]">
                  Gone for today, back at 7am
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                  <span className="label-caps text-[10px] text-gold">
                    {stockLabel}
                    {left > 0 && inOrder > 0 ? ` · ${inOrder} in your order` : ''}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={onAdd}
                  disabled={!addable}
                  className="min-h-11 rounded-full bg-cream px-4 py-2 text-[11px] font-bold tracking-[0.09em] text-cocoa uppercase transition-transform active:scale-95 disabled:cursor-not-allowed disabled:bg-cream/35 disabled:text-cocoa/50 sm:min-h-0"
                >
                  Add to box
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {flavours.map((f, i) => {
            const fLeft = f.stock - qtyInOrder(f.id)
            const gone = fLeft <= 0 && qtyInOrder(f.id) === 0
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                aria-label={`Show ${f.name}`}
                title={f.name}
                className={`h-11 w-11 shrink-0 overflow-hidden rounded-full transition-all sm:h-9 sm:w-9 ${
                  i === index
                    ? 'ring-2 ring-gold ring-offset-2 ring-offset-cocoa'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <CookieTile
                  art={f.art}
                  seedKey={f.id}
                  photo={f.photo}
                  className="h-full w-full"
                  inset={4}
                  dim={gone}
                />
              </button>
            )
          })}
        </div>

        <div ref={liveRef} className="sr-only" aria-live="polite" />
      </div>
    </div>
  )
}

export function TrustStrip() {
  return (
    <section className="container-page py-8 sm:py-12">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((item) => (
          <div key={item.value} className="rounded-[22px] bg-cocoa px-5 py-6 text-cream">
            <p className="font-display text-[30px] leading-none text-cream sm:text-[34px]">{item.value}</p>
            {item.stars ? (
              <p className="mt-2 text-[13px] tracking-[0.18em] text-gold" aria-hidden="true">
                ★★★★★
              </p>
            ) : null}
            <p className="label-caps mt-2 text-[10px] leading-[1.5] text-cream/60">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
