import { useEffect, useRef, useState } from 'react'
import { BRAND, DEMO_BANNER, TICKER } from '../lib/data'
import { money } from '../lib/format'
import { useShop } from '../lib/store'
import { ArrowRight } from 'lucide-react'

const NAV = [
  { label: 'Build a box', href: '#build' },
  { label: 'Pickup and delivery', href: '#pickup' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Questions', href: '#faq' },
]

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <a
      href="#top"
      className={`inline-flex min-h-11 items-center font-['Anton',sans-serif] text-[26px] leading-none tracking-[-0.02em] uppercase sm:min-h-0 ${className}`}
      aria-label={`${BRAND.name} — back to top`}
    >
      <span className="text-ink">{BRAND.wordmark[0]}</span>
      <span className="text-brick">{BRAND.wordmark[1]}</span>
    </a>
  )
}

export function AnnouncementBar() {
  return (
    <div className="no-print bg-cocoa text-cream">
      <div className="container-page flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2">
        <p className="label-caps text-[10px] leading-snug text-cream/80 sm:text-[11px]">{DEMO_BANNER}</p>
        <a
          href="#pricing"
          className="label-caps shrink-0 text-[10px] text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold sm:text-[11px]"
        >
          $29/mo or $750 all in →
        </a>
      </div>
    </div>
  )
}

export function Ticker() {
  const items = [...TICKER, ...TICKER]
  return (
    <div className="no-print overflow-hidden border-b border-line bg-cream-deep py-2.5" aria-hidden="true">
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`label-caps px-5 whitespace-nowrap ${i % 3 === 1 ? 'text-gold' : 'text-ink/70'}`}
            >
              {item}
            </span>
            <span className="text-ink/25">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Header() {
  const { totalCookies, openCheckout } = useShop()
  const [navOpen, setNavOpen] = useState(false)
  const [bump, setBump] = useState(0)
  const prev = useRef(totalCookies)

  useEffect(() => {
    if (prev.current !== totalCookies) {
      prev.current = totalCookies
      setBump((b) => b + 1)
    }
  }, [totalCookies])

  useEffect(() => {
    if (!navOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-cream/92 backdrop-blur-md">
      <div className="container-page flex items-center gap-4 py-2.5 sm:py-3.5">
        <Wordmark />

        <nav aria-label="Shop sections" className="mx-auto hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="label-caps text-[11px] text-ink/75 transition-colors hover:text-brick"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            type="button"
            onClick={() => openCheckout(1)}
            className="flex min-h-11 items-center gap-2 rounded-full bg-brick px-5 py-2.5 text-white shadow-sm transition-all hover:bg-brick-dark active:scale-95 sm:min-h-0 sm:px-6"
          >
            <span
              key={bump}
              className={`label-caps text-[11px] text-white ${totalCookies > 0 ? 'count-pop' : ''}`}
            >
              {totalCookies > 0 ? `Order · ${totalCookies}` : 'Order'}
            </span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-shell lg:hidden"
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setNavOpen((v) => !v)}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-[2px] w-4 rounded bg-ink transition-transform duration-200 ${
                  navOpen ? 'top-[5px] rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 block h-[2px] w-4 rounded bg-ink transition-transform duration-200 ${
                  navOpen ? 'top-[5px] -rotate-45' : 'top-[10px]'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-line bg-cream transition-[grid-template-rows] duration-250 lg:hidden ${
          navOpen ? 'grid grid-rows-[1fr]' : 'grid grid-rows-[0fr] border-t-0'
        }`}
      >
        <div className="overflow-hidden">
          <nav aria-label="Shop sections" className="flex flex-col px-4 py-2 sm:px-8">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setNavOpen(false)}
                className="label-caps border-b border-line-soft py-4 text-[12px] text-ink/80 last:border-b-0"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export function Toasts() {
  const { toasts, dismissToast } = useShop()
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[92px] z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-8"
      aria-hidden="true"
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismissToast(t.id)}
          className={`toast-enter pointer-events-auto max-w-[min(92vw,440px)] rounded-full px-5 py-3 text-center text-[13px] font-semibold shadow-lift ${
            t.tone === 'full'
              ? 'bg-gold text-cocoa'
              : t.tone === 'noted'
                ? 'bg-cocoa text-gold'
                : 'bg-cocoa text-cream'
          }`}
        >
          {t.message}
        </button>
      ))}
    </div>
  )
}

export function LiveRegions() {
  const { toasts, cookiesLeftToday, totalCookies } = useShop()
  const last = toasts[toasts.length - 1]
  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      <p>{last ? last.message : ''}</p>
      <p>
        {cookiesLeftToday} cookies left today. {totalCookies} in your order.
      </p>
    </div>
  )
}

export function MobileOrderBar() {
  const { totalCookies, boxes, activeBox, boxCount, orderTotal, openReview } = useShop()
  if (totalCookies === 0) return null

  const count = boxCount(activeBox)
  const segments = Array.from({ length: activeBox.size })

  return (
    <div className="no-print sheet-enter fixed inset-x-0 bottom-0 z-50 border-t border-line/15 bg-cocoa text-cream px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden shadow-[0_-8px_32px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="label-caps truncate text-[10.5px] font-bold tracking-wider text-cream/95 uppercase">
            {totalCookies} {totalCookies === 1 ? 'COOKIE' : 'COOKIES'} · {boxes.length}{' '}
            {boxes.length === 1 ? 'BOX' : 'BOXES'} · {money(orderTotal)}
          </p>
          <div className="mt-1.5 flex gap-1 max-w-[170px]" aria-hidden="true">
            {segments.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
                  i < count ? 'bg-gold' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={openReview}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-brick px-5 py-2.5 text-[11px] font-bold tracking-[0.09em] text-white uppercase shadow-sm transition-all hover:bg-brick-dark active:scale-95"
        >
          <span>Review order</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
