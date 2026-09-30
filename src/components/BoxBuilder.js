import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BOX_PRICES, BOX_SIZES } from '../lib/types';
import { resolveCookiePhoto } from '../lib/data';
import { money } from '../lib/format';
import { useShop } from '../lib/store';
import { CookieTile } from './Cookie';
import { ArrowRight, Minus, Plus, X } from 'lucide-react';
function useCta() {
    const { totalCookies, capacity, boxes, isBoxFull, orderTotal } = useShop();
    const allFull = boxes.every(isBoxFull);
    if (totalCookies === 0) {
        return {
            title: 'Fill the box to continue',
            subtitle: null,
            label: 'Fill the box to continue',
            disabled: true,
            tone: 'muted',
        };
    }
    if (allFull) {
        return {
            title: `Checkout · ${money(orderTotal)}`,
            subtitle: null,
            label: `Checkout · ${money(orderTotal)}`,
            disabled: false,
            tone: 'primary',
        };
    }
    const more = Math.max(0, capacity - totalCookies);
    return {
        title: `Checkout with ${totalCookies}`,
        subtitle: `(add ${more} more free)`,
        label: `Checkout with ${totalCookies} (add ${more} more free)`,
        disabled: false,
        tone: 'primary',
    };
}
function SlotGrid({ box }) {
    const { flavours, remove } = useShop();
    const filled = [];
    for (const f of flavours) {
        const n = box.items[f.id] ?? 0;
        for (let i = 0; i < n; i++)
            filled.push(f.id);
    }
    const cols = box.size === 4 ? 'grid-cols-2 max-w-[160px]' : 'grid-cols-3 max-w-[240px]';
    return (_jsx("ul", { className: `mx-auto grid w-full ${cols} gap-2.5`, children: Array.from({ length: box.size }).map((_, i) => {
            const flavourId = filled[i];
            const flavour = flavourId ? flavours.find((f) => f.id === flavourId) : undefined;
            return (_jsx("li", { className: `relative aspect-square rounded-[14px] flex items-center justify-center transition-all ${flavour
                    ? 'shadow-xs border border-line-soft'
                    : 'border border-dashed border-[#d8cdbf] bg-cream/40'}`, children: flavour ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "h-full w-full overflow-hidden rounded-[13px] slot-pop", children: _jsx(CookieTile, { art: flavour.art, seedKey: `slot-${box.id}-${flavour.id}-${i}`, photo: flavour.photo, className: "h-full w-full", inset: 0, fit: "cover" }) }), _jsx("button", { type: "button", onClick: () => remove(flavour.id), "aria-label": `Remove one ${flavour.name}`, className: "absolute -top-1.5 -right-1.5 z-10 grid h-5 w-5 place-items-center rounded-full bg-brick text-white shadow-xs transition-transform hover:scale-110 active:scale-95", children: _jsx(X, { className: "h-3 w-3", strokeWidth: 2.5, "aria-hidden": "true" }) })] })) : (_jsx("span", { className: "text-[14px] font-semibold text-ink-faint/60", "aria-hidden": "true", children: i + 1 })) }, i));
        }) }));
}
function SizePills() {
    const { activeBox, setSize } = useShop();
    return (_jsx("div", { role: "group", "aria-label": "Box size", className: "grid grid-cols-3 gap-1.5 sm:gap-2", children: BOX_SIZES.map((size) => {
            const on = activeBox.size === size;
            return (_jsxs("button", { type: "button", "aria-pressed": on, onClick: () => setSize(size), className: `min-h-11 press-apple flex items-center justify-center gap-1.5 rounded-full py-1.5 px-2 transition-all duration-200 active:scale-95 ${on
                    ? 'bg-cocoa text-cream shadow-xs'
                    : 'border border-line bg-shell text-ink hover:border-ink/30'}`, children: [_jsx("span", { className: "font-display text-[18px] leading-tight font-bold", children: size }), _jsx("span", { className: `text-[11.5px] font-semibold transition-colors duration-200 ${on ? 'text-cream/80' : 'text-ink-soft'}`, children: money(BOX_PRICES[size]) })] }, size));
        }) }));
}
function BoxTabs() {
    const { boxes, activeBoxId, setActiveBox, addBox, boxCount } = useShop();
    if (boxes.length <= 1)
        return null;
    return (_jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-1.5 border-b border-line pb-3", children: [boxes.map((b, i) => {
                const on = b.id === activeBoxId;
                return (_jsxs("button", { type: "button", "aria-pressed": on, onClick: () => setActiveBox(b.id), className: `label-caps rounded-full px-3 py-1.5 text-[9.5px] transition-colors ${on
                        ? 'bg-brick text-white font-bold'
                        : 'border border-line bg-shell text-ink-soft hover:border-ink/30'}`, children: ["Box ", i + 1, " \u00B7 ", boxCount(b), "/", b.size] }, b.id));
            }), boxes.length < 4 ? (_jsx("button", { type: "button", onClick: addBox, className: "label-caps rounded-full border border-line bg-shell px-2.5 py-1.5 text-[9.5px] text-ink-soft transition-colors hover:border-ink/30", children: "+ Box" })) : null] }));
}
function CtaButton({ full = false }) {
    const { openCheckout, totalCookies } = useShop();
    const cta = useCta();
    return (_jsxs("button", { type: "button", onClick: () => openCheckout(1), disabled: cta.disabled || totalCookies === 0, className: `group relative inline-flex min-h-[54px] w-full press-apple items-center justify-center rounded-full px-10 py-3 transition-all shadow-xs ${cta.tone === 'muted'
            ? 'bg-line text-ink-faint/70 cursor-not-allowed'
            : 'bg-brick text-white hover:bg-brick-dark active:scale-[0.98]'} ${full ? '' : 'mt-1'}`, children: [_jsxs("div", { className: "flex flex-col items-center justify-center text-center", children: [_jsx("span", { className: "text-[12px] font-bold tracking-[0.09em] uppercase leading-tight", children: cta.title }), cta.subtitle ? (_jsx("span", { className: "mt-1 text-[10.5px] font-semibold tracking-[0.08em] uppercase text-white/85 leading-tight", children: cta.subtitle })) : null] }), _jsx(ArrowRight, { className: "absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5", "aria-hidden": "true" })] }));
}
/** Desktop: the warm light sticky panel beside the grid matching image 3. */
export function BoxBuilderPanel() {
    const { activeBox, boxes, boxCount, orderTotal, flavours, add, remove, clearBox, canAdd, addBox, removeBox } = useShop();
    const index = boxes.findIndex((b) => b.id === activeBox.id);
    const items = flavours.filter((f) => (activeBox.items[f.id] ?? 0) > 0);
    const others = boxes.filter((b) => b.id !== activeBox.id);
    return (_jsxs("div", { className: "grid grid-rows-[minmax(0,1fr)_auto] rounded-[24px] border border-line bg-[#faf6f0] p-5 text-ink shadow-[0_4px_24px_-6px_rgba(43,29,19,0.06)] lg:max-h-[calc(100dvh-112px)]", children: [_jsxs("div", { className: "panel-scroll overflow-y-auto overscroll-contain pr-0.5", children: [_jsx(BoxTabs, {}), _jsxs("div", { children: [_jsx("p", { className: "label-caps text-[10px] tracking-[0.16em] text-ink-soft", children: "Choose your box size" }), _jsx(SizePills, {})] }), _jsxs("div", { className: "mt-5", children: [_jsxs("div", { className: "flex items-baseline justify-between mb-3", children: [_jsx("p", { className: "label-caps text-[10px] tracking-[0.16em] text-ink-soft", children: "Add cookies to your box" }), _jsxs("span", { className: "label-caps text-[9.5px] text-ink-soft", children: [boxCount(activeBox), " of ", activeBox.size, " filled"] })] }), _jsx(SlotGrid, { box: activeBox })] }), _jsxs("div", { className: "mt-5 border-t border-line pt-3.5", children: [others.map((b) => (_jsxs("div", { className: "mb-2.5 flex items-baseline justify-between gap-3 text-[12.5px] text-ink-soft", children: [_jsxs("span", { children: ["Box ", boxes.indexOf(b) + 1, " \u00B7 ", boxCount(b), " ", boxCount(b) === 1 ? 'cookie' : 'cookies'] }), _jsx("span", { className: "font-semibold text-ink", children: money(BOX_PRICES[b.size]) })] }, b.id))), items.length === 0 ? (_jsx("p", { className: "text-[12.5px] leading-relaxed text-ink-soft/75 text-center py-1", children: "Select any flavour from the rack to add cookies to this box." })) : (_jsxs(_Fragment, { children: [_jsx("ul", { className: "space-y-1.5", children: items.map((f) => (_jsxs("li", { className: "flex items-center justify-between gap-3 text-[13px]", children: [_jsx("span", { className: "min-w-0 truncate text-ink font-medium", children: f.name }), _jsxs("span", { className: "flex shrink-0 items-center gap-1.5", children: [_jsx("button", { type: "button", onClick: () => remove(f.id), "aria-label": `Remove one ${f.name} from the box`, className: "grid h-6 w-6 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 active:scale-90", children: _jsx(Minus, { className: "h-3 w-3", "aria-hidden": "true" }) }), _jsx("span", { className: "w-4 count-pop text-center font-bold text-ink", children: activeBox.items[f.id] }, activeBox.items[f.id]), _jsx("button", { type: "button", onClick: () => add(f.id), disabled: !canAdd(f.id), "aria-label": `Add another ${f.name} to the box`, className: "grid h-6 w-6 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 active:scale-90 disabled:cursor-not-allowed disabled:opacity-35", children: _jsx(Plus, { className: "h-3 w-3", "aria-hidden": "true" }) })] })] }, f.id))) }), _jsx("div", { className: "mt-2 text-right", children: _jsxs("button", { type: "button", onClick: clearBox, className: "text-[11px] text-ink-soft/70 underline underline-offset-4 transition-colors hover:text-ink", children: ["Empty box ", index + 1] }) })] }))] })] }), _jsxs("div", { className: "border-t border-line pt-4 mt-2", children: [_jsxs("div", { className: "flex items-baseline justify-between gap-3", children: [_jsx("span", { className: "label-caps text-[11px] text-ink-soft tracking-wider", children: "Total" }), _jsx("span", { className: "count-pop font-display text-[32px] sm:text-[34px] leading-none font-bold text-ink", children: money(orderTotal) }, orderTotal)] }), _jsx("div", { className: "mt-3.5", children: _jsx(CtaButton, {}) }), _jsx("p", { className: "label-caps mt-3 text-center text-[10px] text-ink-soft/60 tracking-wider", children: "No account needed." }), boxes.length < 4 && (_jsx("button", { type: "button", onClick: addBox, className: "press-apple mt-3 min-h-10 w-full rounded-full border border-line bg-shell py-2.5 px-4 text-[10.5px] font-bold tracking-[0.09em] text-ink uppercase transition-colors hover:border-ink/40 active:scale-95", children: "+ Add another box" })), boxes.length > 1 && (_jsxs("button", { type: "button", onClick: () => removeBox(activeBox.id), className: "mt-2 w-full text-center text-[10.5px] text-ink-soft/60 underline underline-offset-4 hover:text-ink", children: ["Remove box ", index + 1] }))] })] }));
}
/** Mobile: the compact strip that sticks below header while scrolling the grid, with live cookie slot images. */
export function MobileBoxControls() {
    const { activeBox, boxes, activeBoxId, setActiveBox, addBox, boxCount, orderTotal, cookiesLeftToday, flavours, remove, } = useShop();
    const startOfDay = flavours.reduce((a, f) => a + f.stock, 0);
    const pct = startOfDay > 0 ? Math.round((cookiesLeftToday / startOfDay) * 100) : 0;
    const filledFlavours = [];
    for (const f of flavours) {
        const n = activeBox.items[f.id] ?? 0;
        for (let i = 0; i < n; i++)
            filledFlavours.push(f);
    }
    return (_jsxs("div", { className: "rounded-[20px] border border-line bg-[#faf6f0] p-2.5 sm:p-3.5 shadow-xs", children: [_jsx(SizePills, {}), _jsxs("div", { className: "mt-2 flex items-center gap-2.5", children: [_jsx("div", { className: "h-[2.5px] flex-1 overflow-hidden rounded-full bg-line", children: _jsx("div", { className: "h-full rounded-full bg-brick transition-all duration-300", style: { width: `${Math.max(3, pct)}%` } }) }), _jsxs("span", { className: "label-caps shrink-0 text-[9px] font-bold text-ink-soft tracking-wider", children: [cookiesLeftToday, " LEFT TODAY"] })] }), _jsxs("div", { className: "mt-2 flex items-center gap-1.5", children: [boxes.map((b, i) => {
                        const on = b.id === activeBoxId;
                        return (_jsxs("button", { type: "button", "aria-pressed": on, onClick: () => setActiveBox(b.id), className: `min-h-11 inline-flex items-center label-caps rounded-full px-3 py-1 text-[9px] font-bold tracking-wider transition-colors ${on
                                ? 'bg-brick text-white shadow-xs'
                                : 'border border-line bg-shell text-ink-soft hover:border-ink/30'}`, children: ["BOX ", i + 1, " \u00B7 ", boxCount(b), "/", b.size] }, b.id));
                    }), boxes.length < 4 && (_jsx("button", { type: "button", onClick: addBox, className: "min-h-11 inline-flex items-center label-caps rounded-full border border-dashed border-line bg-transparent px-2.5 py-1 text-[9px] font-bold tracking-wider text-ink-soft hover:border-ink/40 active:scale-95", children: "+ BOX" }))] }), _jsxs("div", { className: "mt-2 flex items-center justify-between gap-2", children: [_jsx("div", { className: "flex flex-wrap items-center gap-1.5 sm:gap-2", children: Array.from({ length: activeBox.size }).map((_, i) => {
                            const flavour = filledFlavours[i];
                            return (_jsx("div", { className: `relative h-[34px] w-[34px] sm:h-9 sm:w-9 shrink-0 rounded-full flex items-center justify-center transition-all ${flavour
                                    ? 'border-[1.5px] border-cocoa shadow-xs overflow-hidden'
                                    : 'border border-dashed border-[#d8cdbf] bg-cream/50'}`, children: flavour ? (_jsx("button", { type: "button", onClick: () => remove(flavour.id), "aria-label": `Remove one ${flavour.name}`, className: "h-full w-full overflow-hidden rounded-full slot-pop active:scale-95", children: flavour.photo ? (_jsx("img", { src: resolveCookiePhoto(flavour.photo), alt: flavour.name, className: "h-full w-full rounded-full object-cover scale-[1.08]" })) : (_jsx("span", { className: "block h-full w-full rounded-full bg-amber-700/60" })) })) : null }, i));
                        }) }), _jsx("div", { className: "count-pop shrink-0 rounded-full bg-brick px-3 py-1 text-center font-display text-[15px] font-bold text-white shadow-xs", children: money(orderTotal) }, orderTotal)] })] }));
}
