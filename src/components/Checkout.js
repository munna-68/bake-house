import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { PAY_HANDLES, PAY_LABELS } from '../lib/data';
import { copyText, dayLabel, money } from '../lib/format';
import { useShop } from '../lib/store';
import { BOX_PRICES, DELIVERY_FEE, DELIVERY_ZIPS } from '../lib/types';
import { useDialog } from '../lib/useDialog';
import { usePresence } from '../lib/usePresence';
import { SmoothCollapse } from './SmoothCollapse';
import { Check, Copy, Landmark, X } from 'lucide-react';
const PICKUP_WINDOWS = ['11.00 – 2.00pm', '2.00 – 5.00pm', '5.00 – 8.00pm'];
const DELIVERY_WINDOWS = [
    { label: '10.00 – 12.00', full: false },
    { label: '12.30 – 2.30pm', full: false },
    { label: '3.00 – 5.00pm', full: true },
];
/** Opening time for each window, used in the confirmation headline. */
const WINDOW_STARTS = {
    '11.00 – 2.00pm': '11.00am',
    '2.00 – 5.00pm': '2.00pm',
    '5.00 – 8.00pm': '5.00pm',
    '10.00 – 12.00': '10.00am',
    '12.30 – 2.30pm': '12.30pm',
    '3.00 – 5.00pm': '3.00pm',
};
export function CheckoutModal() {
    const { checkoutOpen, checkoutStep, closeCheckout, setCheckoutStep, ensureRef } = useShop();
    const { ref } = useDialog(checkoutOpen, closeCheckout);
    const { mounted, isClosing } = usePresence(checkoutOpen, 240);
    const [dir, setDir] = useState('forward');
    const prev = useRef(checkoutStep);
    useEffect(() => {
        if (checkoutOpen)
            prev.current = 1;
    }, [checkoutOpen]);
    useEffect(() => {
        if (checkoutStep === 3)
            ensureRef();
    }, [checkoutStep, ensureRef]);
    const go = (step) => {
        setDir(step >= prev.current ? 'forward' : 'back');
        prev.current = step;
        setCheckoutStep(step);
    };
    if (!mounted)
        return null;
    return (_jsxs("div", { className: `fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6 ${isClosing ? 'pointer-events-none' : ''}`, children: [_jsx("button", { type: "button", "aria-label": "Close checkout", onClick: closeCheckout, className: `${isClosing ? 'fade-exit' : 'fade-enter'} absolute inset-0 bg-cocoa/45 backdrop-blur-sm` }), _jsxs("div", { ref: ref, role: "dialog", "aria-modal": "true", "aria-label": "Checkout", className: `${isClosing ? 'modal-exit' : 'modal-enter'} relative flex h-[calc(100dvh-24px)] w-full flex-col overflow-hidden rounded-t-[30px] bg-cream shadow-lift md:h-auto md:max-h-[88dvh] md:w-[460px] md:rounded-[30px]`, children: [_jsxs("div", { className: "flex shrink-0 items-start justify-between gap-4 px-5 pt-4 pb-3 md:px-6 md:pt-6", children: [_jsx("div", { children: _jsx("h2", { className: "font-display text-[28px] sm:text-[32px] leading-none text-ink", children: checkoutStep === 4 ? 'Order confirmed' : 'Checkout' }) }), _jsx("button", { type: "button", onClick: closeCheckout, "aria-label": "Close", className: "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-shell text-ink transition-transform hover:scale-105 active:scale-95", children: _jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }) })] }), checkoutStep < 4 ? (_jsx("div", { className: "shrink-0 px-5 pb-4 md:px-6", children: _jsx("div", { className: "h-[3px] w-full overflow-hidden rounded-full bg-line", children: _jsx("div", { className: "h-full rounded-full bg-brick transition-[width] duration-300", style: { width: `${(checkoutStep / 3) * 100}%` } }) }) })) : null, _jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-5 pb-[max(24px,env(safe-area-inset-bottom))] md:px-6 md:pb-6", children: _jsxs("div", { className: dir === 'forward' ? 'step-forward' : 'step-back', children: [checkoutStep === 1 ? _jsx(StepOne, { onNext: () => go(2) }) : null, checkoutStep === 2 ? _jsx(StepTwo, { onNext: () => go(3), onBack: () => go(1) }) : null, checkoutStep === 3 ? _jsx(StepThree, { onBack: () => go(2), onDone: () => go(4) }) : null, checkoutStep === 4 ? _jsx(Confirmation, {}) : null] }, checkoutStep) })] })] }));
}
/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */
function StepLabel({ step, title }) {
    return (_jsxs("p", { className: "label-caps text-[10px] text-ink-soft", children: ["Step ", step, " of 3 \u00B7 ", title] }));
}
function GroupLabel({ children }) {
    return _jsx("p", { className: "label-caps mt-6 mb-2.5 text-[10px] text-ink-soft", children: children });
}
function Field({ label, value, onChange, error, hint, type = 'text', inputMode, autoComplete, textarea, placeholder, }) {
    const id = `f-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(' ') || undefined;
    const base = 'w-full rounded-[16px] border bg-shell px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none';
    const border = error ? 'border-brick' : 'border-line focus:border-ink/40';
    return (_jsxs("div", { className: "mt-4 first:mt-0", children: [_jsx("label", { htmlFor: id, className: "label-caps mb-2 block text-[10px] text-ink-soft", children: label }), textarea ? (_jsx("textarea", { id: id, rows: 3, value: value, placeholder: placeholder, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, onChange: (e) => onChange(e.target.value), className: `${base} ${border} resize-none` })) : (_jsx("input", { id: id, type: type, value: value, inputMode: inputMode, autoComplete: autoComplete, placeholder: placeholder, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, onChange: (e) => onChange(e.target.value), className: `${base} ${border}` })), hint && !error ? (_jsx("p", { id: `${id}-hint`, className: "mt-2 text-[12px] text-ink-soft", children: hint })) : null, _jsx(SmoothCollapse, { open: Boolean(error), children: _jsx("p", { id: `${id}-err`, className: "pt-2 text-[12px] font-semibold text-brick", children: error }) })] }));
}
function PrimaryButton({ children, onClick, disabled, type = 'button', }) {
    return (_jsx("button", { type: type, onClick: onClick, disabled: disabled, className: "inline-flex w-full press-apple items-center justify-center gap-2 rounded-full bg-brick px-6 py-4 text-[12px] font-bold tracking-[0.09em] text-white uppercase shadow-sm transition-all hover:bg-brick-dark active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint", children: children }));
}
function GhostButton({ children, onClick }) {
    return (_jsx("button", { type: "button", onClick: onClick, className: "inline-flex min-h-11 press-apple w-full items-center justify-center gap-2 rounded-full border border-line bg-shell px-6 py-3.5 text-[11px] font-bold tracking-[0.09em] text-ink uppercase transition-all hover:border-ink/45 active:scale-[0.97]", children: children }));
}
function CopyRow({ label, value }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);
    useEffect(() => () => {
        if (timer.current)
            window.clearTimeout(timer.current);
    }, []);
    return (_jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-line-soft py-3.5 last:border-b-0", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "label-caps text-[9px] text-ink-faint", children: label }), _jsx("p", { className: "truncate text-[15px] font-semibold text-ink", children: value })] }), _jsx("button", { type: "button", onClick: () => {
                    void copyText(value);
                    setCopied(true);
                    if (timer.current)
                        window.clearTimeout(timer.current);
                    timer.current = window.setTimeout(() => setCopied(false), 1500);
                }, "aria-label": `Copy ${label}`, className: "inline-flex items-center gap-1.5 min-h-10 shrink-0 rounded-full border border-line bg-shell px-3.5 py-1.5 text-[10px] font-bold tracking-[0.08em] text-ink uppercase transition-all hover:border-ink/50 active:scale-95 sm:min-h-0", children: copied ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "h-3 w-3 text-leaf", strokeWidth: 2.5 }), _jsx("span", { className: "text-leaf", children: "Copied" })] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { className: "h-3 w-3 text-ink-soft" }), _jsx("span", { children: "Copy" })] })) })] }));
}
function SummaryCard({ showRef }) {
    const { boxes, flavours, fulfilment, orderTotal, lastOrder } = useShop();
    const source = lastOrder ? lastOrder.boxes : null;
    const ref = lastOrder?.ref;
    /** Once the order is placed the builder is cleared, so the receipt reads from the order itself. */
    const shown = lastOrder?.fulfilment ?? fulfilment;
    const paymentLabel = lastOrder
        ? lastOrder.payment.method === 'card'
            ? 'Card'
            : PAY_LABELS[lastOrder.payment.method].title
        : null;
    return (_jsxs("div", { className: "rounded-[22px] border border-line bg-[#faf6f0] p-4.5 shadow-xs", children: [showRef && ref ? (_jsx("p", { className: "mb-3 font-display text-[24px] leading-none text-ink", children: ref })) : null, _jsx("div", { className: "space-y-3", children: source
                    ? source.map((b, i) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-baseline justify-between gap-3", children: [_jsxs("span", { className: "label-caps text-[10px] text-ink-soft", children: ["Box ", i + 1, " \u00B7 ", b.size] }), _jsx("span", { className: "text-[13px] font-semibold text-ink", children: money(BOX_PRICES[b.size]) })] }), _jsx("ul", { className: "mt-2 space-y-1.5", children: b.items.map((it) => (_jsxs("li", { className: "flex items-baseline justify-between gap-3", children: [_jsx("span", { className: "text-[13px] text-ink-soft", children: flavours.find((f) => f.id === it.flavourId)?.name ?? it.flavourId }), _jsxs("span", { className: "text-[13px] text-ink-faint", children: ["\u00D7 ", it.qty] })] }, it.flavourId))) })] }, i)))
                    : boxes.map((b, i) => {
                        const items = flavours.filter((f) => (b.items[f.id] ?? 0) > 0);
                        return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-baseline justify-between gap-3", children: [_jsxs("span", { className: "label-caps text-[10px] text-ink-soft", children: ["Box ", i + 1, " \u00B7 ", b.size] }), _jsx("span", { className: "text-[13px] font-semibold text-ink", children: money(BOX_PRICES[b.size]) })] }), _jsx("ul", { className: "mt-2 space-y-1.5", children: items.map((f) => (_jsxs("li", { className: "flex items-baseline justify-between gap-3", children: [_jsx("span", { className: "text-[13px] text-ink-soft", children: f.name }), _jsxs("span", { className: "text-[13px] text-ink-faint", children: ["\u00D7 ", b.items[f.id]] })] }, f.id))) })] }, b.id));
                    }) }), _jsxs("div", { className: "mt-4 border-t border-line-soft pt-3.5", children: [_jsx("p", { className: "text-[13px] text-ink-soft", children: shown.mode === 'pickup'
                            ? `Pickup ${dayLabel(shown.day)}, ${shown.window ?? 'window to choose'}`
                            : `Delivery ${dayLabel(shown.day)}, ${shown.window ?? 'window to choose'} · ${shown.address || 'address to confirm'}` }), _jsx(SmoothCollapse, { open: shown.mode === 'delivery', children: _jsxs("p", { className: "pt-1 flex items-baseline justify-between gap-3 text-[13px] text-ink-soft", children: [_jsx("span", { children: "Delivery fee" }), _jsx("span", { children: money(DELIVERY_FEE) })] }) }), paymentLabel ? _jsxs("p", { className: "mt-1 text-[13px] text-ink-soft", children: [paymentLabel, " \u00B7 ", money(orderTotal)] }) : null] }), _jsxs("div", { className: "mt-3.5 flex items-baseline justify-between gap-3 border-t border-line-soft pt-3.5", children: [_jsx("span", { className: "label-caps text-[10px] text-ink-soft", children: "Total" }), _jsx("span", { className: "count-pop font-display text-[30px] leading-none text-ink", children: money(lastOrder?.payment.total ?? orderTotal) }, lastOrder?.payment.total ?? orderTotal)] })] }));
}
/* -------------------------------------------------------------------------- */
/*  Step 1                                                                    */
/* -------------------------------------------------------------------------- */
function StepOne({ onNext }) {
    const { days, fulfilment, setMode, patchFulfilment } = useShop();
    const [error, setError] = useState(null);
    const delivery = fulfilment.mode === 'delivery';
    const postcodeOk = DELIVERY_ZIPS.some((z) => z.toLowerCase() === fulfilment.zip.trim().replace(/\s+/g, '').toLowerCase());
    const submit = () => {
        if (!fulfilment.window) {
            setError('Choose a window to carry on.');
            return;
        }
        if (delivery) {
            if (!fulfilment.zip.trim())
                return setError('We need a postcode to send a driver.');
            if (!postcodeOk)
                return setError(`We don't deliver to ${fulfilment.zip.trim()} yet — try pickup.`);
            if (!fulfilment.address.trim())
                return setError('We need a street address to deliver to.');
        }
        setError(null);
        onNext();
    };
    return (_jsxs("div", { children: [_jsx(StepLabel, { step: 1, title: "How do you want it" }), _jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3", role: "group", "aria-label": "Pickup or delivery", children: [_jsx(ModeCard, { title: "Pickup", sub: "Free \u00B7 3 hour window", pressed: !delivery, onClick: () => setMode('pickup') }), _jsx(ModeCard, { title: "Delivery", sub: `${money(DELIVERY_FEE)} · 3 runs a day`, pressed: delivery, onClick: () => setMode('delivery') })] }), _jsx(SmoothCollapse, { open: delivery, children: _jsxs("div", { className: "pt-4", children: [_jsx(Field, { label: "Your postcode", value: fulfilment.zip, onChange: (v) => patchFulfilment({ zip: v }), autoComplete: "postal-code", placeholder: "M6J" }), _jsx(Field, { label: "Street address", value: fulfilment.address, onChange: (v) => patchFulfilment({ address: v }), autoComplete: "street-address", placeholder: "Flat, street, buzzer" }), _jsx(Field, { label: "Drop note for the driver", value: fulfilment.note, onChange: (v) => patchFulfilment({ note: v }), placeholder: "Leave at the side door" })] }) }), _jsx(GroupLabel, { children: "Choose a day" }), _jsx("div", { className: "grid grid-cols-4 gap-2", role: "group", "aria-label": "Choose a day", children: days.map((d) => (_jsxs("button", { type: "button", "aria-pressed": fulfilment.day === d.iso, onClick: () => patchFulfilment({ day: d.iso, window: null }), className: `min-h-11 press-apple rounded-[16px] border px-1 py-2.5 transition-all duration-200 ${fulfilment.day === d.iso
                        ? 'border-ink bg-ink text-cream shadow-xs'
                        : 'border-line bg-shell text-ink hover:border-ink/35'}`, children: [_jsx("span", { className: "block font-display text-[19px] leading-none", children: d.num }), _jsx("span", { className: `label-caps mt-1.5 block text-[8px] transition-colors duration-200 ${fulfilment.day === d.iso ? 'text-cream/70' : 'text-ink-soft'}`, children: d.label })] }, d.iso))) }), _jsx(GroupLabel, { children: delivery ? 'Choose a delivery window' : 'Choose a 3 hour collection window' }), _jsx("div", { className: "grid gap-2 sm:grid-cols-3", children: (delivery ? DELIVERY_WINDOWS : PICKUP_WINDOWS.map((label) => ({ label, full: false }))).map((w) => {
                    const pressed = fulfilment.window === w.label;
                    return (_jsx("button", { type: "button", disabled: w.full, "aria-pressed": pressed, onClick: () => {
                            patchFulfilment({ window: w.label });
                            setError(null);
                        }, className: `min-h-11 press-apple rounded-full border px-3 py-3 text-[12px] font-semibold transition-all duration-200 ${w.full
                            ? 'cursor-not-allowed border-line bg-cream-deep text-ink-faint line-through'
                            : pressed
                                ? 'border-ink bg-ink text-cream shadow-xs'
                                : 'border-line bg-shell text-ink hover:border-ink/35'}`, children: w.label }, w.label));
                }) }), _jsx("p", { className: "mt-3 text-[12px] leading-relaxed text-ink-soft transition-opacity duration-200", children: delivery
                    ? 'Three runs a day between 10am and 5pm. A driver texts you when they are two stops away.'
                    : 'Grey windows are already full. Boxes are made up at the start of your window, so the earlier you come the warmer they are.' }), _jsx(SmoothCollapse, { open: Boolean(error), children: _jsx("p", { role: "alert", className: "pt-3 text-[12px] font-semibold text-brick", children: error }) }), _jsx("div", { className: "mt-5", children: _jsx(PrimaryButton, { onClick: submit, children: "Continue to your details" }) })] }));
}
function ModeCard({ title, sub, pressed, onClick, }) {
    return (_jsxs("button", { type: "button", "aria-pressed": pressed, onClick: onClick, className: `min-h-11 press-apple rounded-[18px] border px-4 py-3.5 text-left transition-all duration-200 ${pressed ? 'border-ink bg-ink text-cream shadow-xs' : 'border-line bg-shell text-ink hover:border-ink/35'}`, children: [_jsx("span", { className: "block font-display text-[20px] leading-none", children: title }), _jsx("span", { className: `label-caps mt-1.5 block text-[9px] transition-colors duration-200 ${pressed ? 'text-cream/65' : 'text-ink-soft'}`, children: sub })] }));
}
/* -------------------------------------------------------------------------- */
/*  Step 2                                                                    */
/* -------------------------------------------------------------------------- */
function StepTwo({ onNext, onBack }) {
    const { customer, patchCustomer } = useShop();
    const [errors, setErrors] = useState({});
    const submit = () => {
        const next = {};
        if (customer.name.trim().length < 2)
            next.name = 'We need a name for the counter.';
        const digits = customer.mobile.replace(/\D/g, '');
        if (digits.length < 10)
            next.mobile = 'A 10 digit mobile number, so we can text you.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email.trim()))
            next.email = 'That email does not look right.';
        setErrors(next);
        if (Object.keys(next).length === 0)
            onNext();
    };
    return (_jsxs("div", { children: [_jsx(StepLabel, { step: 2, title: "Who is it for" }), _jsxs("div", { className: "mt-5", children: [_jsx(Field, { label: "Name for the order", value: customer.name, onChange: (v) => patchCustomer({ name: v }), error: errors.name, autoComplete: "name", placeholder: "Test Customer" }), _jsx(Field, { label: "Mobile", value: customer.mobile, onChange: (v) => patchCustomer({ mobile: v }), error: errors.mobile, type: "tel", inputMode: "tel", autoComplete: "tel", hint: "Used for the pickup text and nothing else.", placeholder: "555 123 4567" }), _jsx(Field, { label: "Email", value: customer.email, onChange: (v) => patchCustomer({ email: v }), error: errors.email, type: "email", inputMode: "email", autoComplete: "email", placeholder: "you@example.com" }), _jsx(Field, { label: "Allergies or a note for the kitchen", value: customer.kitchenNote, onChange: (v) => patchCustomer({ kitchenNote: v }), textarea: true, placeholder: "No nuts, please keep separate" })] }), _jsxs("div", { className: "mt-6 space-y-2.5", children: [_jsx(PrimaryButton, { onClick: submit, children: "Continue to payment" }), _jsx(GhostButton, { onClick: onBack, children: "Back to time slots" })] })] }));
}
/* -------------------------------------------------------------------------- */
/*  Step 3                                                                    */
/* -------------------------------------------------------------------------- */
function CreditCardIcon({ className = 'h-6 w-6' }) {
    return (_jsxs("svg", { className: className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("rect", { width: "20", height: "14", x: "2", y: "5", rx: "2" }), _jsx("line", { x1: "2", x2: "22", y1: "10", y2: "10" }), _jsx("line", { x1: "6", x2: "7", y1: "15", y2: "15" }), _jsx("line", { x1: "9.5", x2: "10.5", y1: "15", y2: "15" })] }));
}
function CashAppIcon({ className = 'h-6 w-6' }) {
    return (_jsx("svg", { className: className, viewBox: "0 0 32 32", fill: "currentColor", "aria-hidden": "true", children: _jsx("path", { d: "M31.453 4.625c-0.688-1.891-2.177-3.375-4.068-4.063-1.745-0.563-3.333-0.563-6.557-0.563h-9.682c-3.198 0-4.813 0-6.531 0.531-1.896 0.693-3.385 2.188-4.068 4.083-0.547 1.734-0.547 3.333-0.547 6.531v9.693c0 3.214 0 4.802 0.531 6.536 0.688 1.891 2.177 3.375 4.068 4.063 1.734 0.547 3.333 0.547 6.536 0.547h9.703c3.214 0 4.813 0 6.536-0.531 1.896-0.688 3.391-2.182 4.078-4.078 0.547-1.734 0.547-3.333 0.547-6.536v-9.667c0-3.214 0-4.813-0.547-6.547zM23.229 10.802l-1.245 1.24c-0.25 0.229-0.635 0.234-0.891 0.010-1.203-1.010-2.724-1.568-4.292-1.573-1.297 0-2.589 0.427-2.589 1.615 0 1.198 1.385 1.599 2.984 2.198 2.802 0.938 5.12 2.109 5.12 4.854 0 2.99-2.318 5.042-6.104 5.266l-0.349 1.604c-0.063 0.302-0.328 0.516-0.635 0.516h-2.391l-0.12-0.010c-0.354-0.078-0.578-0.432-0.505-0.786l0.375-1.693c-1.438-0.359-2.76-1.083-3.844-2.094v-0.016c-0.25-0.25-0.25-0.656 0-0.906l1.333-1.292c0.255-0.234 0.646-0.234 0.896 0 1.214 1.146 2.839 1.786 4.521 1.76 1.734 0 2.891-0.734 2.891-1.896s-1.172-1.464-3.385-2.292c-2.349-0.839-4.573-2.026-4.573-4.802 0-3.224 2.677-4.797 5.854-4.943l0.333-1.641c0.063-0.302 0.333-0.516 0.641-0.51h2.37l0.135 0.016c0.344 0.078 0.573 0.411 0.495 0.76l-0.359 1.828c1.198 0.396 2.333 1.026 3.302 1.849l0.031 0.031c0.25 0.266 0.25 0.667 0 0.906z" }) }));
}
function VenmoIcon({ className = 'h-6 w-6' }) {
    return (_jsx("svg", { className: className, viewBox: "0 0 48 48", fill: "currentColor", "aria-hidden": "true", children: _jsx("path", { d: "M40.25 4.45a14.26 14.26 0 0 1 2.06 7.8c0 9.72-8.3 22.34-15 31.2H11.91L5.74 6.58l13.47-1.28 3.27 26.24c3.05-5 6.81-12.76 6.81-18.08a14.51 14.51 0 0 0-1.29-6.52Z" }) }));
}
function BankIcon({ className = 'h-6 w-6' }) {
    return _jsx(Landmark, { className: className, strokeWidth: 1.8, "aria-hidden": "true" });
}
function VisaLogo({ className = 'h-3 w-auto' }) {
    return (_jsx("svg", { className: className, viewBox: "0 0 36 12", fill: "currentColor", "aria-label": "Visa", children: _jsx("path", { d: "M14.07 0.3L9.2 11.7H6.01L3.66 2.52C3.52 1.97 3.4 1.77 2.97 1.54C2.26 1.16 1.06 0.8 0 0.57L0.06 0.3H5.16C5.82 0.3 6.41 0.74 6.55 1.52L7.79 8.08L10.96 0.3H14.07ZM26.4 7.91C26.42 4.89 22.21 4.73 22.24 3.38C22.25 2.97 22.64 2.53 23.53 2.41C23.97 2.35 25.18 2.3 26.44 2.88L26.96 0.45C26.25 0.19 25.33 0 24.18 0C21.24 0 19.18 1.56 19.16 3.79C19.14 5.44 20.64 6.36 21.76 6.91C22.92 7.47 23.31 7.84 23.3 8.35C23.29 9.13 22.35 9.48 21.48 9.48C19.98 9.48 19.11 9.06 18.42 8.74L17.88 11.26C18.66 11.62 20.1 11.93 21.58 11.95C24.68 11.95 26.68 10.42 26.7 8.13L26.4 7.91ZM34.24 11.7H36.96L34.64 0.3H32.12C31.54 0.3 31.05 0.64 30.83 1.17L26.35 11.7H29.62L30.27 9.91H34.27L34.61 11.7H34.24ZM31.17 7.45L32.48 3.84L33.24 7.45H31.17ZM18.43 0.3L15.91 11.7H12.79L15.31 0.3H18.43Z" }) }));
}
function MastercardLogo({ className = 'h-3.5 w-auto' }) {
    return (_jsxs("svg", { className: className, viewBox: "0 0 28 17", fill: "none", "aria-label": "Mastercard", children: [_jsx("circle", { cx: "8.5", cy: "8.5", r: "8.5", fill: "currentColor" }), _jsx("path", { d: "M17 0a8.5 8.5 0 0 0-3.23.64A8.47 8.47 0 0 1 17 8.5a8.47 8.47 0 0 1-3.23 7.86A8.5 8.5 0 1 0 17 0z", fill: "currentColor" })] }));
}
const PAYMENT_METHODS = [
    { id: 'card', title: 'Card', Icon: CreditCardIcon },
    { id: 'cashapp', title: 'Cash App', Icon: CashAppIcon },
    { id: 'venmo', title: 'Venmo', Icon: VenmoIcon },
    { id: 'bank', title: 'Bank Transfer', Icon: BankIcon },
];
function StepThree({ onBack, onDone }) {
    const { paymentMethod, setPaymentMethod, orderTotal, ref, ensureRef, placeOrder, fulfilment } = useShop();
    const [placing, setPlacing] = useState(false);
    useEffect(() => {
        ensureRef();
    }, [ensureRef]);
    const reference = ref ?? 'BH-0000';
    const place = () => {
        setPlacing(true);
        placeOrder();
        onDone();
    };
    return (_jsxs("div", { children: [_jsx(StepLabel, { step: 3, title: "Payment" }), _jsx("div", { className: "mt-4", children: _jsx(SummaryCard, {}) }), _jsx(GroupLabel, { children: "How do you want to pay" }), _jsx("div", { className: "grid grid-cols-4 gap-2 sm:gap-2.5", role: "group", "aria-label": "Payment method", children: PAYMENT_METHODS.map(({ id, title, Icon }) => {
                    const on = paymentMethod === id;
                    return (_jsxs("button", { type: "button", "aria-pressed": on, onClick: () => setPaymentMethod(id), className: `press-apple flex h-[88px] sm:h-[94px] flex-col items-start justify-between rounded-[18px] sm:rounded-[20px] p-3 sm:p-3.5 text-left transition-all ${on
                            ? 'border-ink bg-ink text-white shadow-sm'
                            : 'border border-line bg-[#faf6f0] text-ink hover:border-ink/40'}`, children: [_jsx(Icon, { className: "h-6 w-6 shrink-0" }), _jsx("span", { className: "text-[12px] sm:text-[13.5px] font-semibold leading-tight", children: title })] }, id));
                }) }), _jsx("div", { className: "mt-5", children: _jsx("div", { className: "tab-fade-enter", children: paymentMethod === 'card' ? (_jsx(CardTab, { total: orderTotal, onPlace: place, placing: placing })) : (_jsx(TransferTab, { method: paymentMethod, total: orderTotal, reference: reference, onPlace: place, placing: placing })) }, paymentMethod) }), _jsx("div", { className: "mt-3", children: _jsx(GhostButton, { onClick: onBack, children: "Back to your details" }) }), _jsx("p", { className: "mt-4 text-[12px] leading-relaxed text-ink-soft", children: fulfilment.mode === 'pickup'
                    ? 'Change or cancel free up to two hours before your collection window.'
                    : 'Change or cancel free up to two hours before your delivery run.' })] }));
}
function CardTab({ total, onPlace, placing }) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const handleCardNumberChange = (raw) => {
        const digits = raw.replace(/\D/g, '').slice(0, 16);
        const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? digits;
        setCardNumber(formatted);
    };
    const handleExpiryChange = (raw) => {
        const digits = raw.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) {
            setExpiry(`${digits.slice(0, 2)} / ${digits.slice(2)}`);
        }
        else {
            setExpiry(digits);
        }
    };
    const handleCvcChange = (raw) => {
        setCvc(raw.replace(/\D/g, '').slice(0, 4));
    };
    return (_jsxs("div", { children: [_jsx("h3", { className: "font-display text-[22px] leading-none text-ink", children: "Send by Card" }), _jsxs("div", { className: "mt-3.5 rounded-[22px] border border-line bg-[#faf6f0] p-4.5 sm:p-5 shadow-xs", children: [_jsx("p", { className: "label-caps mb-3.5 text-[10px] sm:text-[11px] font-bold tracking-wider text-ink-soft", children: "CARD DETAILS" }), _jsxs("div", { children: [_jsx("label", { htmlFor: "card-number-input", className: "mb-1.5 block text-[13px] font-medium text-ink", children: "Card number" }), _jsxs("div", { className: "relative flex items-center", children: [_jsx("input", { id: "card-number-input", type: "text", inputMode: "numeric", autoComplete: "cc-number", value: cardNumber, onChange: (e) => handleCardNumberChange(e.target.value), placeholder: "1234 5678 9012 3456", className: "w-full rounded-[14px] border border-line bg-[#faf7f2] py-3 pl-4 pr-24 text-[14px] text-ink placeholder:text-ink-faint/60 focus:border-ink/50 focus:outline-none transition-colors" }), _jsxs("div", { className: "pointer-events-none absolute right-3.5 flex items-center gap-2 text-ink-soft/70", children: [_jsx(VisaLogo, { className: "h-3 w-auto opacity-75" }), _jsx(MastercardLogo, { className: "h-3.5 w-auto opacity-75" })] })] })] }), _jsxs("div", { className: "mt-3.5 grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "expiry-input", className: "mb-1.5 block text-[13px] font-medium text-ink", children: "Expiry date" }), _jsx("input", { id: "expiry-input", type: "text", inputMode: "numeric", autoComplete: "cc-exp", value: expiry, onChange: (e) => handleExpiryChange(e.target.value), placeholder: "MM / YY", className: "w-full rounded-[14px] border border-line bg-[#faf7f2] px-4 py-3 text-[14px] text-ink placeholder:text-ink-faint/60 focus:border-ink/50 focus:outline-none transition-colors" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "cvc-input", className: "mb-1.5 block text-[13px] font-medium text-ink", children: "CVC" }), _jsx("input", { id: "cvc-input", type: "text", inputMode: "numeric", autoComplete: "cc-csc", value: cvc, onChange: (e) => handleCvcChange(e.target.value), placeholder: "123", className: "w-full rounded-[14px] border border-line bg-[#faf7f2] px-4 py-3 text-[14px] text-ink placeholder:text-ink-faint/60 focus:border-ink/50 focus:outline-none transition-colors" })] })] }), _jsxs("div", { className: "mt-3.5", children: [_jsx("label", { htmlFor: "name-input", className: "mb-1.5 block text-[13px] font-medium text-ink", children: "Name on card" }), _jsx("input", { id: "name-input", type: "text", autoComplete: "cc-name", value: nameOnCard, onChange: (e) => setNameOnCard(e.target.value), placeholder: "John Doe", className: "w-full rounded-[14px] border border-line bg-[#faf7f2] px-4 py-3 text-[14px] text-ink placeholder:text-ink-faint/60 focus:border-ink/50 focus:outline-none transition-colors" })] })] }), _jsx("div", { className: "mt-5", children: _jsxs(PrimaryButton, { onClick: onPlace, disabled: placing, children: ["Place order \u00B7 ", money(total)] }) })] }));
}
function TransferTab({ method, total, reference, onPlace, placing, }) {
    const handle = PAY_HANDLES[method];
    const sendBy = method === 'cashapp' ? 'Cash App' : method === 'venmo' ? 'Venmo' : 'Bank Transfer';
    return (_jsxs("div", { children: [_jsxs("h3", { className: "font-display text-[22px] leading-none text-ink", children: ["Send by ", sendBy] }), _jsxs("div", { className: "mt-3.5 rounded-[22px] border border-line bg-[#faf6f0] px-4 shadow-xs", children: [_jsx(CopyRow, { label: "Send to", value: handle }), _jsx(CopyRow, { label: "Amount", value: money(total) }), _jsx(CopyRow, { label: "Reference", value: reference })] }), _jsxs("p", { className: "mt-3 text-[12px] leading-relaxed text-ink-soft", children: ["On a live shop, the customer sends the amount with reference", ' ', _jsx("span", { className: "font-semibold text-ink", children: reference }), " in the payment note, and the kitchen matches it in seconds. These handles are placeholders, so do not send anything."] }), _jsx("div", { className: "mt-5", children: _jsx(PrimaryButton, { onClick: onPlace, disabled: placing, children: "Place order, pay by transfer" }) })] }));
}
/* -------------------------------------------------------------------------- */
/*  Confirmation                                                              */
/* -------------------------------------------------------------------------- */
function Confirmation() {
    const { lastOrder, resetBuilder, closeCheckout } = useShop();
    const windowStart = useMemo(() => {
        const w = lastOrder?.fulfilment.window ?? '';
        if (!w)
            return null;
        return WINDOW_STARTS[w] ?? w.split('–')[0]?.trim() ?? null;
    }, [lastOrder]);
    if (!lastOrder)
        return null;
    const byTransfer = lastOrder.payment.method !== 'card';
    const where = lastOrder.fulfilment.mode === 'pickup' ? 'at the counter' : 'to your door';
    return (_jsxs("div", { children: [_jsxs("h3", { className: "heading-lg mt-1 text-ink", children: ["See you", windowStart ? ` from ${windowStart}` : '', "."] }), _jsxs("p", { className: "mt-4 text-[14px] leading-relaxed text-ink-soft", children: [lastOrder.fulfilment.mode === 'pickup'
                        ? `Give your name ${where} on ${dayLabel(lastOrder.fulfilment.day)}. `
                        : `A driver will text you when they are two stops out on ${dayLabel(lastOrder.fulfilment.day)}. `, byTransfer
                        ? 'We will confirm by text as soon as the transfer lands, usually within a few minutes.'
                        : 'Your receipt is on its way by email.'] }), _jsx("div", { className: "mt-5", children: _jsx(SummaryCard, { showRef: true }) }), _jsxs("p", { className: "mt-4 rounded-[16px] bg-cream-deep px-4 py-3 text-[12px] leading-relaxed text-ink-soft", children: ["Change or cancel free up to two hours before your window. Bring the reference", ' ', _jsx("span", { className: "font-semibold text-ink", children: lastOrder.ref }), " if you need to ask us anything."] }), _jsxs("div", { className: "mt-5 space-y-2.5", children: [_jsx(PrimaryButton, { onClick: () => {
                            resetBuilder();
                            closeCheckout();
                            requestAnimationFrame(() => {
                                document.getElementById('build')?.scrollIntoView({ block: 'start' });
                            });
                        }, children: "Build another box" }), _jsx(GhostButton, { onClick: () => {
                            closeCheckout();
                            requestAnimationFrame(() => window.scrollTo({ top: 0 }));
                        }, children: "Back to the shop" })] })] }));
}
