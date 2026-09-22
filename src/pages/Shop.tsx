import { BatchGrid } from '../components/Batch'
import { CheckoutModal } from '../components/Checkout'
import { AnnouncementBar, Header, LiveRegions, MobileOrderBar, Ticker, Toasts } from '../components/Chrome'
import { Hero, TrustStrip } from '../components/Hero'
import { ReviewSheet } from '../components/ReviewSheet'
import { Explainer, Faq, Footer, Pricing, Reviews } from '../components/Sections'

export function Shop() {
  return (
    <div className="min-h-dvh bg-cream">
      <a
        href="#build"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[80] focus:rounded-full focus:bg-cocoa focus:px-5 focus:py-3 focus:text-[12px] focus:text-cream"
      >
        Skip to today&rsquo;s batch
      </a>

      <AnnouncementBar />
      <Ticker />
      <Header />

      <main className="pb-28 md:pb-0">
        <Hero />
        <TrustStrip />
        <BatchGrid />
        <Reviews />
        <Explainer />
        <Faq />
        <Pricing />
      </main>

      <Footer />

      <MobileOrderBar />
      <Toasts />
      <LiveRegions />
      <ReviewSheet />
      <CheckoutModal />
    </div>
  )
}
