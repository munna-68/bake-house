import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BatchGrid } from '../components/Batch';
import { CheckoutModal } from '../components/Checkout';
import { AnnouncementBar, Header, LiveRegions, MobileOrderBar, Ticker, Toasts } from '../components/Chrome';
import { Hero, TrustStrip } from '../components/Hero';
import { ReviewSheet } from '../components/ReviewSheet';
import { Explainer, Faq, Footer, Pricing, Reviews } from '../components/Sections';
export function Shop() {
    return (_jsxs("div", { className: "min-h-dvh bg-cream", children: [_jsx("a", { href: "#build", className: "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[80] focus:rounded-full focus:bg-cocoa focus:px-5 focus:py-3 focus:text-[12px] focus:text-cream", children: "Skip to today\u2019s batch" }), _jsx(AnnouncementBar, {}), _jsx(Ticker, {}), _jsx(Header, {}), _jsxs("main", { className: "pb-28 md:pb-0", children: [_jsx(Hero, {}), _jsx(TrustStrip, {}), _jsx(BatchGrid, {}), _jsx(Reviews, {}), _jsx(Explainer, {}), _jsx(Faq, {}), _jsx(Pricing, {})] }), _jsx(Footer, {}), _jsx(MobileOrderBar, {}), _jsx(Toasts, {}), _jsx(LiveRegions, {}), _jsx(ReviewSheet, {}), _jsx(CheckoutModal, {})] }));
}
