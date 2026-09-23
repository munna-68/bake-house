import { useState } from 'react'
import { BASE_BUILD_CHECKLIST, BRAND, EXPLAINER, FAQS, REVIEWS } from '../lib/data'
import { useShop } from '../lib/store'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  PackageOpen,
  RotateCcw,
  Sparkles,
  Star,
  Wallet,
} from 'lucide-react'

export function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-24 border-t border-line bg-cream py-14 sm:py-20">
      <div className="container-page">
        <header className="max-w-[48ch]">
          <p className="label-caps text-[11px] tracking-[0.18em] text-ink-soft">Customer feedback</p>
          <h2 className="heading-lg mt-2 text-ink">
            What people say once
            <br />
            they have eaten one
          </h2>
          <p className="mt-3.5 text-[15.5px] leading-relaxed text-ink-soft sm:text-[17px]">
            Pulled from Google and from order follow ups. We do not edit them and we do not pay for them.
          </p>
        </header>

        <ul className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {REVIEWS.map((r) => (
            <li
              key={r.id}
              className="group flex flex-col justify-between w-[85vw] shrink-0 snap-start rounded-[24px] border border-line bg-[#faf6f0] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 hover:shadow-sm sm:w-[62vw] lg:w-auto"
            >
              <div>
                <div className="flex items-center gap-1 text-gold mb-3.5" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="text-[15.5px] sm:text-[16.5px] leading-relaxed text-ink font-medium">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line-soft pt-3.5">
                <span className="text-[12.5px] font-semibold text-ink">{r.name}</span>
                <span className="text-ink-soft/40" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-leaf-soft px-2 py-0.5 text-[10.5px] font-semibold text-leaf">
                  <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                  Verified
                </span>
                <span className="text-ink-soft/40" aria-hidden="true">·</span>
                <span className="label-caps text-[10px] text-ink-soft/75">{r.ago}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Explainer() {
  const ICONS = [PackageOpen, Clock, Wallet]

  return (
    <section id="pickup" className="scroll-mt-24 border-t border-line bg-cream-deep py-14 sm:py-20">
      <div className="container-page">
        <header className="max-w-[48ch]">
          <p className="label-caps text-[11px] tracking-[0.18em] text-ink-soft">How it works</p>
          <h2 className="heading-lg mt-2 text-ink">
            Warm at the counter, or
            <br />
            at your door
          </h2>
          <p className="mt-3.5 text-[15.5px] leading-relaxed text-ink-soft sm:text-[17px]">
            Pickup is free and you choose a three hour window, so nothing sits under a heat lamp waiting for you.
            Delivery runs across nine postcodes on three runs a day.
          </p>
        </header>

        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {EXPLAINER.map((step, idx) => {
            const Icon = ICONS[idx] ?? PackageOpen
            return (
              <li
                key={step.n}
                className="group relative flex flex-col justify-between rounded-[24px] border border-line bg-[#faf6f0] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[44px] leading-none text-brick">
                      0{step.n}
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-shell border border-line text-ink shadow-xs transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5 text-cocoa" strokeWidth={1.8} />
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[22px] leading-tight text-ink sm:text-[24px]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </div>
              </li>
            )
          })}
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
        <header className="max-w-[48ch]">
          <p className="label-caps text-[11px] tracking-[0.18em] text-ink-soft">Frequently asked</p>
          <h2 className="heading-lg mt-2 text-ink">
            Questions people
            <br />
            actually ask
          </h2>
        </header>

        <div className="mt-8 space-y-3">
          {FAQS.map((item) => {
            const isOpen = !!open[item.id]
            return (
              <div
                key={item.id}
                className={`rounded-[22px] border transition-all duration-200 ${
                  isOpen
                    ? 'border-ink/30 bg-[#faf6f0] shadow-xs'
                    : 'border-line bg-[#faf6f0]/70 hover:border-ink/20 hover:bg-[#faf6f0]'
                }`}
              >
                <h3>
                  <button
                    id={`${item.id}-button`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${item.id}-panel`}
                    onClick={() => setOpen((s) => ({ ...s, [item.id]: !s[item.id] }))}
                    className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left"
                  >
                    <span className="font-display text-[19px] leading-tight text-ink sm:text-[22px]">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-200 ${
                        isOpen
                          ? 'rotate-180 border-brick bg-brick text-white shadow-xs'
                          : 'border-line bg-shell text-ink hover:border-ink/35'
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${item.id}-panel`}
                  role="region"
                  aria-labelledby={`${item.id}-button`}
                  className="accordion-body"
                  data-open={isOpen}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                      <p className="max-w-[62ch] border-t border-line-soft pt-3.5 text-[15px] leading-relaxed text-ink-soft">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'onetime'>('monthly')

  return (
    <section id="pricing" className="scroll-mt-24 border-t border-line bg-cream-deep py-14 sm:py-20">
      <div className="container-page">
        <header className="max-w-[56ch]">
          <div className="flex items-center gap-2">
            <span className="label-caps rounded-full bg-brick px-3 py-1 text-[9.5px] font-bold text-white tracking-widest uppercase">
              sitekeep.studio
            </span>
            <span className="label-caps text-[11px] tracking-[0.16em] text-ink-soft">E-Commerce Solution</span>
          </div>
          <h2 className="heading-lg mt-3 text-ink">
            What a shop like this
            <br />
            costs
          </h2>
          <p className="mt-3.5 text-[15.5px] leading-relaxed text-ink-soft sm:text-[17px]">
            Designed and engineered by <strong className="text-ink font-semibold">sitekeep.studio</strong>.
            Zero platform fees skimmed off your orders, and you choose between low-commitment monthly hosting or full codebase ownership.
          </p>
        </header>

        {/* Pricing selector */}
        <div className="mt-8 flex items-center gap-2 rounded-full border border-line bg-shell/80 p-1.5 w-fit shadow-xs">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={`rounded-full px-5 py-2 text-[11.5px] font-bold tracking-[0.08em] uppercase transition-all active:scale-95 ${
              billing === 'monthly' ? 'bg-brick text-white shadow-xs' : 'text-ink-soft hover:text-ink'
            }`}
          >
            Monthly · $29/mo
          </button>
          <button
            type="button"
            onClick={() => setBilling('onetime')}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-[11.5px] font-bold tracking-[0.08em] uppercase transition-all active:scale-95 ${
              billing === 'onetime' ? 'bg-brick text-white shadow-xs' : 'text-ink-soft hover:text-ink'
            }`}
          >
            <span>One payment · $750</span>
            <span className="rounded-full bg-gold/30 px-2 py-0.5 text-[9px] text-ink font-extrabold">Save</span>
          </button>
        </div>

        {/* Dual pricing / comparison card */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          {/* Main pricing showcase card */}
          <div className="rounded-[26px] bg-cocoa p-6 text-cream sm:p-9 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <span className="label-caps text-[10px] text-gold tracking-widest uppercase">
                    {billing === 'monthly' ? 'Subscription plan' : 'Complete ownership'}
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-[52px] leading-none text-gold sm:text-[66px]">
                      {billing === 'monthly' ? '$29' : '$750'}
                    </span>
                    <span className="text-[16px] text-cream/75 font-medium">
                      {billing === 'monthly' ? '/ month' : 'one-time'}
                    </span>
                  </div>
                </div>

                <div className="rounded-[16px] border border-cream/15 bg-white/5 px-3.5 py-2 text-right">
                  <span className="label-caps text-[9px] text-cream/60 block">Platform cut</span>
                  <span className="font-display text-[20px] text-cream font-bold leading-tight">0% fee</span>
                </div>
              </div>

              <p className="mt-4 max-w-[42ch] text-[14.5px] leading-relaxed text-cream/80">
                {billing === 'monthly'
                  ? 'Get your shop live immediately for $29/month. High-speed hosting, automatic stock management, full kitchen dashboard, and ongoing maintenance included. Cancel anytime.'
                  : 'Pay $750 once and own everything outright. Full source code, complete commercial deployment on your domain, zero ongoing fees, and zero platform cuts forever.'}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#build"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brick px-6 py-3.5 text-center text-[11.5px] font-bold tracking-[0.09em] text-white uppercase shadow-xs transition-all hover:bg-brick-dark active:scale-95"
                >
                  <span>Try the ordering flow</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <a
                  href="/dashboard/"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-cream px-6 py-3.5 text-center text-[11.5px] font-bold tracking-[0.09em] text-cocoa uppercase shadow-xs transition-all hover:bg-white active:scale-95"
                >
                  See kitchen dashboard
                </a>
              </div>
            </div>

            <div className="mt-8 border-t border-cream/15 pt-5 flex items-center justify-between text-[12.5px] text-cream/65">
              <span>Ready in 48-72 hours</span>
              <span className="flex items-center gap-1.5 text-gold font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                By sitekeep.studio
              </span>
            </div>
          </div>

          {/* Feature checklist card */}
          <div className="rounded-[26px] border border-line bg-[#faf6f0] p-6 sm:p-9 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-display text-[24px] leading-tight text-ink">
                Everything in the build
              </h3>
              <p className="mt-1.5 text-[13.5px] text-ink-soft">
                Fully functional e-commerce web app engineered for bakeries and artisan food shops.
              </p>

              <ul className="mt-5 space-y-3">
                {BASE_BUILD_CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-ink">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf-soft text-leaf">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <a
                href="https://sitekeep.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-[12px] font-bold tracking-[0.08em] text-brick uppercase transition-colors hover:text-brick-dark"
              >
                <span>Learn more at sitekeep.studio</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Agency callout */}
        <div className="mt-12 rounded-[24px] border border-line bg-shell p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[54ch]">
              <span className="label-caps text-[10px] tracking-widest text-brick font-bold uppercase">
                Custom Engineering
              </span>
              <h3 className="mt-1 font-display text-[26px] leading-tight text-ink sm:text-[30px]">
                Need something customized for your bakery?
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">
                This demo is a live, functional portfolio piece built by <strong className="text-ink">sitekeep.studio</strong>.
                We can adapt the inventory logic, slot windows, multi-location logistics, and brand styling for your brand.
              </p>
            </div>
            <a
              href="#build"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-cocoa px-8 py-3.5 text-center text-[12px] font-bold tracking-[0.09em] text-cream uppercase transition-all hover:bg-cocoa-soft active:scale-95"
            >
              Start a project
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { hardReset, toast } = useShop()

  return (
    <footer className="border-t border-line bg-cocoa pt-14 pb-28 text-cream md:pb-14">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <h2 className="label-caps text-[11px] text-cream/50 tracking-wider">The counter</h2>
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
            <h2 className="label-caps text-[11px] text-cream/50 tracking-wider">Orders</h2>
            <ul className="mt-4 space-y-2 text-[14px] text-cream/80">
              <li>
                <a href="#build" className="hover:text-cream transition-colors">
                  Build a box
                </a>
              </li>
              <li>
                <a href="#pickup" className="hover:text-cream transition-colors">
                  Pickup and delivery
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-cream transition-colors">
                  Pricing & licensing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="label-caps text-[11px] text-cream/50 tracking-wider">Studio & Links</h2>
            <ul className="mt-4 space-y-2 text-[14px] text-cream/80">
              <li>
                <a
                  href="https://sitekeep.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-gold hover:text-white transition-colors"
                >
                  <span>sitekeep.studio</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="/dashboard/" className="hover:text-cream transition-colors">
                  Kitchen dashboard
                </a>
              </li>
              <li>
                <a href={BRAND.allergenSheet} className="hover:text-cream transition-colors">
                  Allergen sheet
                </a>
              </li>
              <li>
                <a href={BRAND.instagram} className="hover:text-cream transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p
          className="mt-12 font-['Anton',sans-serif] leading-[0.82] tracking-[-0.02em] text-cream uppercase"
          style={{ fontSize: 'clamp(3.5rem, 15.5vw, 13rem)' }}
          aria-hidden="true"
        >
          {BRAND.wordmark[0]}
          <span className="text-brick">{BRAND.wordmark[1]}</span>
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-cream/15 pt-6">
          <p className="label-caps text-[10px] text-cream/55">
            © {new Date().getFullYear()} {BRAND.name} · Designed & built by{' '}
            <a
              href="https://sitekeep.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline underline-offset-4 hover:text-white"
            >
              sitekeep.studio
            </a>
          </p>
          <button
            type="button"
            onClick={() => {
              hardReset()
              toast('Demo reset. Stock, boxes and menu are back to the start.')
            }}
            className="label-caps inline-flex min-h-11 items-center gap-1.5 rounded-full border border-cream/20 px-4 py-2.5 text-[10px] text-cream/65 transition-all hover:border-cream/50 hover:text-cream active:scale-95"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset this demo</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

