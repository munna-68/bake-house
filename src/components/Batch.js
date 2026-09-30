import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { resolveCookiePhoto } from '../lib/data';
import { useShop } from '../lib/store';
import { BoxBuilderPanel, MobileBoxControls } from './BoxBuilder';
import { CookieArtSvg } from './Cookie';
import { SmoothCollapse } from './SmoothCollapse';
import { Minus, Plus } from 'lucide-react';
export function BatchGrid() {
    const { flavours } = useShop();
    return (_jsxs("section", { id: "build", className: "container-page scroll-mt-24 pt-4 pb-12 sm:pt-8", children: [_jsxs("header", { className: "max-w-[58ch]", children: [_jsx("h2", { className: "font-display text-[28px] sm:text-[44px] lg:text-[50px] leading-[1.05] tracking-[-0.015em] text-ink", children: "Fresh cookies. Your way." }), _jsx("p", { className: "mt-1.5 text-[13.5px] sm:text-[16.5px] leading-relaxed text-ink-soft", children: "Every number below is a real count of what is left on the rack right now. When a flavour runs out we do not bake it again until tomorrow." })] }), _jsx("div", { className: "sticky top-[58px] sm:top-[64px] z-30 -mx-4 px-4 py-1.5 bg-cream/95 backdrop-blur-md border-y border-line/70 lg:hidden my-2.5", children: _jsx(MobileBoxControls, {}) }), _jsxs("div", { className: "mt-5 grid gap-5 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:items-start lg:gap-8", children: [_jsx("div", { className: "hidden lg:sticky lg:top-[92px] lg:block", children: _jsx(BoxBuilderPanel, {}) }), _jsx("div", { className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3 sm:gap-4", children: flavours.map((f, i) => (_jsx(ProductCard, { flavour: f, index: i + 1 }, f.id))) })] })] }));
}
function ProductCard({ flavour, index }) {
    const { qtyInOrder, available, canAdd, add, remove, vote, activeBox } = useShop();
    const resolvedPhoto = resolveCookiePhoto(flavour.photo);
    const [brokenSrc, setBrokenSrc] = useState(null);
    const qty = qtyInOrder(flavour.id);
    const left = available(flavour.id);
    const soldOut = left === 0 && qty === 0;
    const boxFull = !canAdd(flavour.id) && !soldOut && qty === 0;
    const showPhoto = Boolean(resolvedPhoto) && brokenSrc !== resolvedPhoto;
    const stockLine = soldOut
        ? 'Sold out today'
        : left === 0
            ? 'All in your order'
            : qty > 0
                ? `${left} left`
                : left === 1
                    ? 'Only 1 left'
                    : left <= 4
                        ? `Only ${left} left`
                        : `${left} left today`;
    return (_jsxs("article", { className: `group cookie-card-hover relative flex flex-col justify-between rounded-[20px] border bg-shell p-3 sm:p-5 text-left shadow-xs transition-all duration-200 ${qty > 0
            ? 'border-brick/75 ring-1 ring-brick/25 shadow-sm'
            : 'border-line hover:border-[#dbcbb9] hover:shadow-sm'} ${soldOut ? 'bg-shell/70' : ''}`, children: [_jsx("span", { className: "label-caps absolute top-2.5 left-3 text-[9.5px] text-ink-soft/50 sm:top-3 sm:left-5", children: String(index).padStart(2, '0') }), _jsxs("div", { className: "flex flex-1 items-start gap-3 pt-3.5 sm:flex-col sm:items-center sm:gap-2 sm:pt-4", children: [_jsx("div", { className: "h-[96px] w-[96px] shrink-0 sm:my-2 sm:h-auto sm:w-[78%] sm:max-w-[185px] sm:aspect-square flex items-center justify-center", children: showPhoto ? (_jsx("img", { src: resolvedPhoto, alt: flavour.name, loading: "lazy", decoding: "async", onError: () => setBrokenSrc(resolvedPhoto ?? null), className: `cookie-spin h-full w-full object-contain drop-shadow-[0_6px_12px_rgba(43,29,19,0.14)] ${soldOut ? 'opacity-55 saturate-[0.35]' : ''}` })) : (_jsx(CookieArtSvg, { art: flavour.art, seedKey: flavour.id, title: flavour.name, className: `cookie-spin h-full w-full drop-shadow-[0_6px_12px_rgba(43,29,19,0.14)] ${soldOut ? 'opacity-55 saturate-[0.35]' : ''}` })) }), _jsxs("div", { className: "min-w-0 flex-1 sm:w-full", children: [_jsx("h3", { className: "font-display text-[17px] sm:text-[21px] font-bold leading-tight text-ink", children: flavour.name }), _jsx("p", { className: "mt-0.5 text-[12px] sm:text-[13px] leading-snug text-ink-soft line-clamp-2 sm:line-clamp-none", children: flavour.desc }), _jsx("ul", { className: "mt-1.5 flex flex-wrap gap-1", "aria-label": "Allergens", children: flavour.allergens.map((a) => (_jsx("li", { className: "label-caps rounded-full border border-line bg-shell/80 px-1.5 py-0.5 text-[8px] font-semibold tracking-wider text-ink-soft/90", children: a }, a))) })] })] }), _jsxs("div", { className: "mt-2.5 flex items-center justify-between gap-2 border-t border-line-soft pt-2 sm:mt-3.5 sm:pt-3", children: [_jsxs("span", { className: "flex min-w-0 items-center gap-1.5", children: [_jsx("span", { className: `h-1.5 w-1.5 shrink-0 rounded-full ${soldOut
                                    ? 'bg-ink/25'
                                    : left <= 2
                                        ? 'bg-brick'
                                        : 'bg-[#4a8a56]'}`, "aria-hidden": "true" }), _jsx("span", { className: "label-caps truncate text-[9.5px] text-ink-soft font-semibold", children: stockLine })] }), soldOut ? (_jsx("button", { type: "button", onClick: () => vote(flavour.id), "aria-label": `${flavour.name}, sold out today. Tap to tell us you wanted it.`, className: "min-h-11 press-apple shrink-0 rounded-full border border-line bg-cream/50 px-3.5 py-1.5 text-[9.5px] font-bold tracking-[0.08em] text-ink-soft uppercase transition-colors hover:border-ink/40 active:scale-95", children: "Tell us" })) : qty > 0 ? (_jsxs("div", { className: "flex shrink-0 items-center gap-1 rounded-full border border-line bg-shell px-1 py-0.5", children: [_jsx("button", { type: "button", onClick: () => remove(flavour.id), "aria-label": `Remove one ${flavour.name}`, className: "grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-cream-deep active:scale-90 sm:h-8 sm:w-8", children: _jsx(Minus, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) }), _jsx("span", { className: "min-w-[20px] count-pop text-center text-[13px] font-bold text-ink", "aria-hidden": "true", children: qty }, qty), _jsx("button", { type: "button", onClick: () => add(flavour.id), disabled: !canAdd(flavour.id), "aria-label": `Add another ${flavour.name}`, className: "grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-cream-deep active:scale-90 disabled:cursor-not-allowed disabled:text-ink-faint/50 sm:h-8 sm:w-8", children: _jsx(Plus, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) })] })) : (_jsx("button", { type: "button", onClick: () => add(flavour.id), disabled: boxFull, "aria-label": `Add ${flavour.name} to your box`, className: "min-h-11 press-apple shrink-0 rounded-full border border-ink/25 px-5 py-2.5 text-[10.5px] font-bold tracking-[0.09em] text-ink uppercase transition-all hover:border-ink hover:bg-cream-deep active:scale-95 disabled:cursor-not-allowed disabled:border-line disabled:text-ink-faint/50", children: "Add" }))] }), _jsx(SmoothCollapse, { open: boxFull && !soldOut, children: _jsxs("p", { className: "label-caps pt-2 text-[8.5px] text-ink-faint", children: ["Box ", activeBox.size, " is full \u2014 remove one to swap"] }) })] }));
}
