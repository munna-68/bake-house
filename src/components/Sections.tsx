import { useState } from 'react'
import { BASE_BUILD_CHECKLIST, BRAND, EXPLAINER, FAQS, REVIEWS } from '../lib/data'
import { money } from '../lib/format'

export function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-24 border-t border-line bg-cream py-14 sm:py-20">
      <div className="container-page">
        <header className="max-w-[46ch]">
          <h2 className="heading-lg text-ink">
            What people say once
            <br />
            they have eaten one
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">
            Pulled from Google and from order follow ups. We do not edit them and we do not pay for them.
          </p>
        </header>

        <ul className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {REVIEWS.map((r) => (
            <li
              key={r.id}
              className="w-[85vw] shrink-0 snap-start rounded-[22px] border border-line bg-shell p-5 shadow-card sm:w-[62vw] lg:w-auto"
            >
              <blockquote className="text-[15px] leading-relaxed text-ink">{r.quote}</blockquote>
              <p className="label-caps mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-ink-faint">
                <span>{r.name}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-leaf">
                  <span aria-hidden="true">✓</span> Verified order
                </span>
                <span aria-hidden="true">·</span>
                <span>{r.ago}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Explainer() {
  return (
    <section id="pickup" className="scroll-mt-24 border-t border-line bg-cream-deep py-14 sm:py-20">
      <div className="container-page">
        <header className="max-w-[46ch]">
          <h2 className="heading-lg text-ink">
            Warm at the counter, or
            <br />
            at your door
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">
            Pickup is free and you choose a three hour window, so nothing sits under a heat lamp waiting for you.
            Delivery runs across nine postcodes on three runs a day.
          </p>
        </header>

        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {EXPLAINER.map((step) => (
            <li key={step.n} className="rounded-[22px] border border-line bg-shell p-5 shadow-card">
              <span className="font-display text-[40px] leading-none text-brick">{step.n}</span>
              <h3 className="mt-3 font-display text-[22px] leading-tight text-ink">{step.title}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Faq() {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  return (
    <section id="faq" className="scroll-mt-24 border-t border-line bg-cream py-14 sm:py-20">
      <div className="container-page">
        <header className="max-w-[46ch]">
          <h2 className="heading-lg text-ink">
            Questions people
            <br />
            actually ask
          </h2>
        </header>

        <ul className="mt-8 border-t border-line">
          {FAQS.map((item) => {
            const isOpen = !!open[item.id]
            return (
              <li key={item.id} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${item.id}-panel`}
                    onClick={() => setOpen((s) => ({ ...s, [item.id]: !s[item.id] }))}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="font-display text-[19px] leading-tight text-ink sm:text-[22px]">{item.q}</span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-[22px] leading-none text-ink transition-transform duration-250 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div id={`${item.id}-panel`} className="accordion-body" data-open={isOpen}>
                  <div>
                    <p className="max-w-[62ch] pb-5 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-line bg-cream-deep py-14 sm:py-20">
      <div className="container-page">
        <header className="max-w-[46ch]">
          <h2 className="heading-lg text-ink">
            What a shop like this
            <br />
            costs
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">
            One price for the whole thing, shop and dashboard together. No retainer, no platform fee skimmed off your
            orders, and you own all of it at the end.
          </p>
        </header>

        <div className="mt-8 grid gap-8 rounded-[26px] bg-cocoa p-6 text-cream sm:p-9 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="font-display text-[52px] leading-none text-gold sm:text-[64px]">{money(2500)}</p>
            <p className="mt-4 max-w-[38ch] text-[14px] leading-relaxed text-cream/70">
              One payment. First year of hosting included. No monthly fee, no cut of your orders.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:max-w-[320px]">
              <a
                href="#build"
                className="rounded-full bg-brick px-6 py-4 text-center text-[12px] font-bold tracking-[0.09em] text-white uppercase transition-colors hover:bg-brick-dark"
              >
                Try the ordering flow
              </a>
              <a
                href="/dashboard/"
                className="rounded-full bg-cream px-6 py-4 text-center text-[12px] font-bold tracking-[0.09em] text-cocoa uppercase transition-colors hover:bg-white"
              >
                See the dashboard
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-[22px] leading-none text-cream">Everything in the base build</h3>
            <ul className="mt-5">
              {BASE_BUILD_CHECKLIST.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-cream/12 py-3 text-[14px] leading-relaxed text-cream/80 last:border-b-0"
                >
                  <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 max-w-[62ch] border-t border-line pt-8">
          <h3 className="font-display text-[28px] leading-tight text-ink sm:text-[34px]">
            Let us build yours, and make it better than this
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            This demo is a working shop because that is what we sell. Yours gets built around your kitchen, your
            flavours and your pickup windows — and you keep the code.
          </p>
          <a
            href="#build"
            className="mt-6 inline-block rounded-full bg-cocoa px-7 py-4 text-[12px] font-bold tracking-[0.09em] text-cream uppercase transition-colors hover:bg-cocoa-soft"
          >
            Start a project
          </a>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-cocoa pt-14 pb-28 text-cream md:pb-14">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h2 className="label-caps text-[11px] text-cream/50">The counter</h2>
            <address className="mt-4 space-y-1 text-[14px] leading-relaxed text-cream/80 not-italic">
              <p>{BRAND.address}</p>
              <p>{BRAND.hours}</p>
              <p>
                <a href={BRAND.phoneHref} className="underline underline-offset-4 hover:text-cream">
                  {BRAND.phone}
                </a>
              </p>
            </address>
          </div>

          <div>
            <h2 className="label-caps text-[11px] text-cream/50">Orders</h2>
            <ul className="mt-4 space-y-2 text-[14px] text-cream/80">
              <li>
                <a href="#build" className="hover:text-cream">
                  Build a box
                </a>
              </li>
              <li>
                <a href="#pickup" className="hover:text-cream">
                  Pickup and delivery
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-cream">
                  Catering and large orders
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="label-caps text-[11px] text-cream/50">Elsewhere</h2>
            <ul className="mt-4 space-y-2 text-[14px] text-cream/80">
              <li>
                <a href={BRAND.instagram} className="hover:text-cream">
                  Instagram
                </a>
              </li>
              <li>
                <a href={BRAND.tiktok} className="hover:text-cream">
                  TikTok
                </a>
              </li>
              <li>
                <a href={BRAND.allergenSheet} className="hover:text-cream">
                  Allergen sheet
                </a>
              </li>
              <li>
                <a href="/dashboard/" className="hover:text-cream">
                  Kitchen dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p
          className="mt-12 font-display leading-[0.82] tracking-[-0.02em] text-cream"
          style={{ fontSize: 'clamp(3.5rem, 15.5vw, 13rem)' }}
          aria-hidden="true"
        >
          {BRAND.wordmark[0]}
          <span className="text-brick">{BRAND.wordmark[1]}</span>
        </p>

        <p className="label-caps mt-8 text-[10px] text-cream/40">
          © {new Date().getFullYear()} {BRAND.name} · Demo storefront
        </p>
      </div>
    </footer>
  )
}
