import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WINDOWS } from '../lib/data';
import { money } from '../lib/format';
import { useDialog } from '../lib/useDialog';
import { usePresence } from '../lib/usePresence';
import { Check, CheckCircle2, ChefHat, X } from 'lucide-react';
/** Bench view: big type, one window at a time, for the tablet on the pass. */
export function KitchenMode({ open, orders, onClose, onReady }) {
    const { ref } = useDialog(open, onClose);
    const { mounted, isClosing } = usePresence(open, 240);
    if (!mounted)
        return null;
    const open_ = orders.filter((o) => o.stage !== 'collected');
    return (_jsxs("div", { className: `fixed inset-0 z-[80] overflow-y-auto bg-cream ${isClosing ? 'fade-exit pointer-events-none' : 'fade-enter'}`, ref: ref, role: "dialog", "aria-modal": "true", "aria-label": "Kitchen mode", children: [_jsxs("div", { className: "sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-cream/95 px-5 py-4 backdrop-blur-md", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-cocoa text-gold shadow-xs", children: _jsx(ChefHat, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h1", { className: "font-display text-[26px] sm:text-[28px] leading-none text-ink", children: "Kitchen mode" }), _jsxs("p", { className: "mt-1 text-[13px] text-ink-soft", children: [open_.length, " orders still to make up"] })] })] }), _jsxs("button", { type: "button", onClick: onClose, className: "press-apple inline-flex min-h-11 items-center gap-1.5 rounded-full bg-cocoa px-5 py-2.5 text-[11px] font-bold tracking-[0.09em] text-cream uppercase shadow-xs transition-all hover:bg-cocoa-soft active:scale-95", children: [_jsx(X, { className: "h-4 w-4" }), _jsx("span", { children: "Close" })] })] }), _jsx("div", { className: "mx-auto max-w-[900px] px-5 py-8", children: _jsx("div", { children: WINDOWS.map((w) => {
                        const rows = orders.filter((o) => o.window === w.key);
                        if (rows.length === 0)
                            return null;
                        return (_jsxs("section", { className: "mb-10", children: [_jsx("h2", { className: "font-display text-[30px] sm:text-[34px] leading-none text-ink", children: w.label }), _jsx("ul", { className: "mt-5 space-y-3.5", children: rows.map((o) => (_jsxs("li", { className: `flex flex-wrap items-center gap-4 rounded-[24px] border p-5 sm:p-6 shadow-xs transition-all ${o.stage === 'collected'
                                            ? 'border-line bg-cream-deep/60 opacity-60'
                                            : o.payment === 'pending'
                                                ? 'border-brick/40 bg-[#faf6f0]'
                                                : 'border-line bg-[#faf6f0]'}`, children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-baseline gap-3", children: [_jsx("p", { className: "font-display text-[26px] sm:text-[28px] leading-none text-ink", children: o.customer }), _jsx("span", { className: "label-caps text-[10px] text-ink-soft", children: o.number })] }), _jsxs("p", { className: "mt-2 text-[15px] text-ink-soft", children: [o.boxes, " \u00B7 ", o.payment === 'paid' ? 'Paid' : `Unpaid ${money(o.total)}`] }), o.note ? (_jsxs("p", { className: "mt-1.5 text-[14px] font-semibold text-brick", children: ["\u26A0\uFE0F ", o.note] })) : null] }), o.stage === 'collected' ? (_jsxs("span", { className: "inline-flex items-center gap-1.5 label-caps rounded-full bg-cream-deep px-4 py-2 text-[11px] text-ink-faint", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-leaf" }), _jsx("span", { children: "Collected" })] })) : (_jsxs("button", { type: "button", onClick: () => onReady(o.id), className: `press-apple inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[11.5px] font-bold tracking-[0.09em] uppercase shadow-xs transition-all active:scale-95 ${o.stage === 'ready'
                                                    ? 'bg-leaf text-white hover:bg-leaf/90'
                                                    : 'bg-cocoa text-cream hover:bg-cocoa-soft'}`, children: [_jsx(Check, { className: "h-4 w-4", strokeWidth: 2.5 }), _jsx("span", { children: o.stage === 'ready' ? 'Hand over' : 'Mark ready' })] }))] }, o.id))) })] }, w.key));
                    }) }) })] }));
}
