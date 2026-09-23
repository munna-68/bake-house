import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useShop } from '../lib/store'
import { CookieArtSvg, CookieTile } from './Cookie'
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Leaf, ShieldCheck, Truck, Wheat } from 'lucide-react'

export function Hero() {
  const { cookiesLeftToday } = useShop()

  return (
    <section id="top" className="container-page pt-6 pb-4 sm:pt-10">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-14">
        {/* Left column: Flavour carousel card */}
        <div className="order-2 lg:order-1">
          <FlavourCarousel />
        </div>

        {/* Right column: Hero headline and narrative */}
        <div className="order-1 lg:order-2">
          <p className="label-caps text-[11px] tracking-[0.18em] text-ink-soft">
            Artisan cookies &nbsp;/&nbsp; Baked fresh daily
          </p>

          <h1 className="mt-3 font-display text-[44px] leading-[1.02] tracking-[-0.015em] text-ink sm:text-[58px] lg:text-[66px]">
            Big cookies.
            <br />
            <span className="text-brick">Soft middles.</span>
          </h1>

          <p className="mt-5 max-w-[48ch] text-[16px] leading-relaxed text-ink-soft sm:text-[17.5px]">
            Nine flavours, one batch a morning, and we stop when the rack is empty. Build a box of four, six or
            twelve, then collect it warm from the counter or take an evening delivery slot.
          </p>

          <div className="mt-7 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <a
              href="#build"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brick px-8 py-3.5 text-center text-[12px] font-bold tracking-[0.09em] text-white uppercase shadow-sm transition-all hover:bg-brick-dark active:scale-95 sm:w-auto"
            >
              <span>Build your box</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <a
              href="#pickup"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/22 bg-shell/70 px-7 py-3.5 text-center text-[12px] font-bold tracking-[0.09em] text-ink uppercase transition-all hover:border-ink hover:bg-shell active:scale-95 sm:w-auto"
            >
              How pickup works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex items-center gap-2.5 rounded-full border border-line bg-shell/80 px-4 py-2 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-brick" aria-hidden="true" />
              <span className="label-caps text-[10px] text-ink">
                {cookiesLeftToday} cookies left today
              </span>
            </div>
            <div className="h-4 w-px bg-line hidden sm:block" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <span className="text-[13px] tracking-[0.16em] text-gold" aria-hidden="true">
                ★★★★★
              </span>
              <span className="label-caps text-[10.5px] text-ink-soft">4.9 from 1,284 orders</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FlavourCarousel() {
  const { flavours, add, canAdd, qtyInOrder, available } = useShop()
  const [index, setIndex] = useState(0)
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null)
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
        className="group relative overflow-hidden rounded-[26px] border border-line bg-[#faf6f0] p-5 pb-5 sm:p-6 sm:pb-6 shadow-[0_4px_24px_-6px_rgba(43,29,19,0.06)]"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Today's flavours"
        onKeyDown={onKey}
      >
        {/* Top bar inside card: index and round fresh badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-baseline">
            <span className="font-display italic text-[36px] leading-none text-ink sm:text-[42px]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="ml-1 text-[13px] font-medium text-ink-soft/60 tracking-wider">
              / {String(total).padStart(2, '0')}
            </span>
          </div>

          {/* Fresh badge */}
          <div
            className="grid h-[74px] w-[74px] sm:h-[80px] sm:w-[80px] shrink-0 -rotate-6 place-items-center rounded-full bg-[#f3d489] text-center p-2 shadow-xs transition-transform hover:rotate-0"
            aria-hidden="true"
          >
            <div className="flex flex-col items-center">
              <span className="label-caps text-[8px] sm:text-[8.5px] font-black leading-tight text-cocoa tracking-wider">
                Fresh
                <br />
                today
              </span>
              <span className="label-caps text-[6.5px] leading-tight text-cocoa/75 mt-0.5">
                Out of the
                <br />
                oven daily
              </span>
              <Wheat className="h-3 w-3 text-cocoa/75 mt-0.5" strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* Center cookie image with gentle hover tilt */}
        <div key={flavour.id} className="fade-enter mt-1">
          <div className="mx-auto aspect-square w-[72%] max-w-[270px] sm:max-w-[290px] py-1">
            {flavour.photo && brokenSrc !== flavour.photo ? (
              <img
                src={flavour.photo}
                alt={flavour.name}
                decoding="async"
                onError={() => setBrokenSrc(flavour.photo ?? null)}
                className={`cookie-spin h-full w-full object-contain drop-shadow-[0_14px_24px_rgba(43,29,19,0.2)] ${
                  soldOut ? 'opacity-55 saturate-[0.35]' : ''
                }`}
              />
            ) : (
              <CookieArtSvg
                art={flavour.art}
                seedKey={flavour.id}
                title={flavour.name}
                className={`cookie-spin h-full w-full drop-shadow-[0_14px_24px_rgba(43,29,19,0.2)] ${
                  soldOut ? 'opacity-55 saturate-[0.35]' : ''
                }`}
              />
            )}
          </div>

          {/* Cookie title and description */}
          <p className="mt-3 text-center font-display text-[26px] leading-tight text-ink sm:text-[30px]">
            {flavour.name}
          </p>
          <p className="mx-auto mt-1.5 max-w-[34ch] text-center text-[13.5px] leading-relaxed text-ink-soft">
            {flavour.desc}
          </p>

          {/* Status and CTA inside card */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {soldOut ? (
              <>
                <span className="label-caps text-[10px] text-ink-faint">Sold out, back at 7am</span>
                <span className="label-caps rounded-full bg-brick/15 px-3 py-1.5 text-[10px] text-brick font-semibold">
                  Gone for today
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" />
                  <span className="label-caps text-[10px] text-ink-soft">
                    {stockLabel}
                    {left > 0 && inOrder > 0 ? ` · ${inOrder} in order` : ''}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={onAdd}
                  disabled={!addable}
                  className="min-h-10 rounded-full bg-brick px-5 py-2 text-[11px] font-bold tracking-[0.09em] text-white uppercase shadow-xs transition-all hover:bg-brick-dark active:scale-95 disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint sm:min-h-0"
                >
                  Add to box
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom thumbnail slider with Lucide Chevron controls */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous flavour"
            className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-cream-deep active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
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
                  className={`h-9 w-9 sm:h-8 sm:w-8 shrink-0 overflow-hidden rounded-full transition-all ${
                    i === index
                      ? 'ring-2 ring-brick ring-offset-2 ring-offset-[#faf6f0] scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <CookieTile
                    art={f.art}
                    seedKey={f.id}
                    photo={f.photo}
                    className="h-full w-full"
                    inset={3}
                    dim={gone}
                  />
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next flavour"
            className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-cream-deep active:scale-95"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div ref={liveRef} className="sr-only" aria-live="polite" />
      </div>
    </div>
  )
}

export function TrustStrip() {
  const TRUST_ITEMS = [
    {
      icon: Leaf,
      value: '4.9',
      stars: true,
      label: '1,284 REVIEWS',
    },
    {
      icon: Clock,
      value: '19 min',
      label: 'AVERAGE WAIT FOR A PICKUP BOX AT THE COUNTER',
    },
    {
      icon: Truck,
      value: 'Same day',
      label: 'DELIVERY ON EVERY ORDER PLACED BEFORE 9AM',
    },
    {
      icon: ShieldCheck,
      value: 'Licensed',
      label: 'COMMERCIAL KITCHEN, ALLERGENS ON EVERY FLAVOUR',
    },
  ]

  return (
    <section className="container-page py-6 sm:py-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="rounded-[20px] border border-line bg-shell p-4 sm:p-5 text-ink shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="mb-2.5 sm:mb-3">
                  <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-leaf" strokeWidth={1.8} />
                </div>
                <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                  <p className="font-display text-[22px] leading-none text-ink sm:text-[28px] lg:text-[30px]">{item.value}</p>
                  {item.stars ? (
                    <span className="text-[10px] sm:text-[12px] tracking-[0.12em] text-gold" aria-hidden="true">
                      ★★★★★
                    </span>
                  ) : null}
                </div>
              </div>
              <p className="label-caps mt-2 text-[8.5px] sm:text-[9.5px] leading-relaxed text-ink-soft">{item.label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
