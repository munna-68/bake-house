import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { BRAND, DEMO_BANNER, TICKER } from '../lib/data';
import { money } from '../lib/format';
import { useShop } from '../lib/store';
import { ArrowRight } from 'lucide-react';
const NAV = [
    { label: 'Build a box', href: '#build' },
    { label: 'Pickup and delivery', href: '#pickup' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Questions', href: '#faq' },
];
export function Wordmark({ className = '' }) {
    return (_jsxs("a", { href: "#top", className: `inline-flex min-h-11 items-center font-['Anton',sans-serif] text-[26px] leading-none tracking-[-0.02em] uppercase sm:min-h-0 ${className}`, "aria-label": `${BRAND.name} — back to top`, children: [_jsx("span", { className: "text-ink", children: BRAND.wordmark[0] }), _jsx("span", { className: "text-brick", children: BRAND.wordmark[1] })] }));
}
export function AnnouncementBar() {
    return (_jsx("div", { className: "no-print bg-cocoa text-cream", children: _jsxs("div", { className: "container-page flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2", children: [_jsx("p", { className: "label-caps text-[10px] leading-snug text-cream/80 sm:text-[11px]", children: DEMO_BANNER }), _jsx("a", { href: "#pricing", className: "label-caps shrink-0 text-[10px] text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold sm:text-[11px]", children: "$29/mo or $750 all in \u2192" })] }) }));
}
export function Ticker() {
    const items = [...TICKER, ...TICKER];
    return (_jsx("div", { className: "no-print overflow-hidden border-b border-line bg-cream-deep py-2.5", "aria-hidden": "true", children: _jsx("div", { className: "ticker-track", children: items.map((item, i) => (_jsxs("span", { className: "flex items-center", children: [_jsx("span", { className: `label-caps px-5 whitespace-nowrap ${i % 3 === 1 ? 'text-gold' : 'text-ink/70'}`, children: item }), _jsx("span", { className: "text-ink/25", children: "\u2022" })] }, i))) }) }));
}
export function Header() {
    const { totalCookies, openCheckout } = useShop();
    const [navOpen, setNavOpen] = useState(false);
    const [bump, setBump] = useState(0);
    const prev = useRef(totalCookies);
    useEffect(() => {
        if (prev.current !== totalCookies) {
            prev.current = totalCookies;
            setBump((b) => b + 1);
        }
    }, [totalCookies]);
    useEffect(() => {
        if (!navOpen)
            return;
        const onKey = (e) => {
            if (e.key === 'Escape')
                setNavOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [navOpen]);
    return (_jsxs("header", { className: "no-print sticky top-0 z-40 border-b border-line bg-cream/92 backdrop-blur-md", children: [_jsxs("div", { className: "container-page flex items-center gap-4 py-2.5 sm:py-3.5", children: [_jsx(Wordmark, {}), _jsx("nav", { "aria-label": "Shop sections", className: "mx-auto hidden items-center gap-7 lg:flex", children: NAV.map((item) => (_jsx("a", { href: item.href, className: "label-caps text-[11px] text-ink/75 transition-colors hover:text-brick", children: item.label }, item.href))) }), _jsxs("div", { className: "ml-auto flex items-center gap-2 lg:ml-0", children: [_jsxs("button", { type: "button", onClick: () => openCheckout(1), "aria-label": `Your order: ${totalCookies} ${totalCookies === 1 ? 'cookie' : 'cookies'}`, className: "flex min-h-11 press-apple items-center gap-2 rounded-full bg-cocoa px-4 py-2 text-cream shadow-sm transition-all hover:bg-cocoa-soft active:scale-95 sm:min-h-0 sm:px-5 sm:py-2.5", children: [_jsx("span", { className: "label-caps text-[11px] text-cream", children: "Your order" }), _jsx("span", { className: `grid h-[22px] min-w-[22px] place-items-center rounded-full px-1.5 text-[10.5px] font-bold ${totalCookies > 0 ? 'count-pop bg-brick text-white' : 'bg-cream/15 text-cream/70'}`, children: totalCookies }, bump)] }), _jsx("button", { type: "button", className: "grid h-11 w-11 place-items-center rounded-full border border-line bg-shell lg:hidden", "aria-expanded": navOpen, "aria-controls": "mobile-nav", "aria-label": navOpen ? 'Close menu' : 'Open menu', onClick: () => setNavOpen((v) => !v), children: _jsxs("span", { className: "relative block h-3 w-4", children: [_jsx("span", { className: `absolute left-0 block h-[2px] w-4 rounded bg-ink transition-transform duration-200 ${navOpen ? 'top-[5px] rotate-45' : 'top-0'}` }), _jsx("span", { className: `absolute left-0 block h-[2px] w-4 rounded bg-ink transition-transform duration-200 ${navOpen ? 'top-[5px] -rotate-45' : 'top-[10px]'}` })] }) })] })] }), _jsx("div", { id: "mobile-nav", className: `overflow-hidden border-t border-line bg-cream transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${navOpen ? 'grid grid-rows-[1fr]' : 'grid grid-rows-[0fr] border-t-0'}`, children: _jsx("div", { className: "min-h-0 overflow-hidden", children: _jsx("nav", { "aria-label": "Shop sections", className: `flex flex-col px-4 py-2 sm:px-8 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${navOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`, children: NAV.map((item) => (_jsx("a", { href: item.href, onClick: () => setNavOpen(false), className: "label-caps border-b border-line-soft py-4 text-[12px] text-ink/80 last:border-b-0", children: item.label }, item.href))) }) }) })] }));
}
export function Toasts() {
    const { toasts, dismissToast } = useShop();
    return (_jsx("div", { className: "pointer-events-none fixed inset-x-0 bottom-[92px] z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-8", "aria-hidden": "true", children: toasts.map((t) => (_jsx("button", { type: "button", onClick: () => dismissToast(t.id), className: `toast-enter pointer-events-auto max-w-[min(92vw,440px)] rounded-full px-5 py-3 text-center text-[13px] font-semibold shadow-lift ${t.tone === 'full'
                ? 'bg-gold text-cocoa'
                : t.tone === 'noted'
                    ? 'bg-cocoa text-gold'
                    : 'bg-cocoa text-cream'}`, children: t.message }, t.id))) }));
}
export function LiveRegions() {
    const { toasts, cookiesLeftToday, totalCookies } = useShop();
    const last = toasts[toasts.length - 1];
    return (_jsxs("div", { className: "sr-only", "aria-live": "polite", "aria-atomic": "true", children: [_jsx("p", { children: last ? last.message : '' }), _jsxs("p", { children: [cookiesLeftToday, " cookies left today. ", totalCookies, " in your order."] })] }));
}
export function MobileOrderBar() {
    const { totalCookies, boxes, activeBox, boxCount, orderTotal, openReview } = useShop();
    const isVisible = totalCookies > 0;
    const count = boxCount(activeBox);
    const segments = Array.from({ length: activeBox.size });
    return (_jsx("div", { className: `no-print fixed inset-x-0 bottom-0 z-50 border-t border-line/15 bg-cocoa text-cream px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden shadow-[0_-8px_32px_rgba(0,0,0,0.35)] transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`, "aria-hidden": !isVisible, children: _jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("p", { className: "label-caps truncate text-[10.5px] font-bold tracking-wider text-cream/95 uppercase", children: [totalCookies, " ", totalCookies === 1 ? 'COOKIE' : 'COOKIES', " \u00B7 ", boxes.length, ' ', boxes.length === 1 ? 'BOX' : 'BOXES', " \u00B7 ", money(orderTotal)] }), _jsx("div", { className: "mt-1.5 flex gap-1 max-w-[170px]", "aria-hidden": "true", children: segments.map((_, i) => (_jsx("div", { className: `h-1.5 flex-1 rounded-full transition-colors duration-250 ${i < count ? 'bg-gold' : 'bg-white/20'}` }, i))) })] }), _jsxs("button", { type: "button", onClick: openReview, className: "inline-flex min-h-11 press-apple shrink-0 items-center justify-center gap-1.5 rounded-full bg-brick px-5 py-2.5 text-[11px] font-bold tracking-[0.09em] text-white uppercase shadow-sm transition-all hover:bg-brick-dark active:scale-95", children: [_jsx("span", { children: "Review order" }), _jsx(ArrowRight, { className: "h-3.5 w-3.5", "aria-hidden": "true" })] })] }) }));
}
