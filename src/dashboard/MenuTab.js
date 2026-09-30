import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { CookieTile } from '../components/Cookie';
import { readFileAsImage, resizeImage } from '../lib/imageUtils';
import { useShop } from '../lib/store';
import { AddFlavourModal } from './AddFlavourModal';
import { ConfirmDeleteFlavourModal } from './ConfirmDeleteFlavourModal';
import { SmoothCollapse } from '../components/SmoothCollapse';
import { Check, Minus, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
function toDraft(flavours) {
    return flavours.map((f) => ({
        id: f.id,
        name: f.name,
        desc: f.desc,
        allergens: f.allergens.join(', '),
        stock: f.stock,
        photo: f.photo ?? '',
    }));
}
export function MenuTab() {
    const { flavours, updateFlavour, removeFlavour, resetFlavours, toast } = useShop();
    const [draft, setDraft] = useState(() => toDraft(flavours));
    const [dirty, setDirty] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [flavourToDelete, setFlavourToDelete] = useState(null);
    // Card-specific file upload ref map
    const cardFileInputRefs = useRef({});
    useEffect(() => {
        setDraft(toDraft(flavours));
        setDirty(false);
    }, [flavours]);
    const patch = (id, next) => {
        setDraft((list) => list.map((d) => (d.id === id ? { ...d, ...next } : d)));
        setDirty(true);
    };
    const handleCardPhotoUpload = async (id, file) => {
        if (!file.type.startsWith('image/')) {
            toast('Please upload an image file (PNG, WebP, or JPG)', 'full');
            return;
        }
        try {
            const img = await readFileAsImage(file);
            const compressed = resizeImage(img, 600);
            patch(id, { photo: compressed });
            toast('Cookie photo updated');
        }
        catch {
            toast('Failed to load image', 'full');
        }
    };
    const save = () => {
        draft.forEach((d) => {
            updateFlavour(d.id, {
                name: d.name.trim() || 'Untitled flavour',
                desc: d.desc.trim(),
                allergens: d.allergens
                    .split(',')
                    .map((a) => a.trim())
                    .filter(Boolean),
                stock: Math.max(0, Math.round(Number.isFinite(d.stock) ? d.stock : 0)),
                photo: d.photo.trim(),
            });
        });
        toast('Menu saved. The shop is updated.');
    };
    const handleConfirmDelete = () => {
        if (!flavourToDelete)
            return;
        removeFlavour(flavourToDelete.id);
        setDraft((list) => list.filter((d) => d.id !== flavourToDelete.id));
        toast(`Removed "${flavourToDelete.name}" from the menu`);
        setFlavourToDelete(null);
    };
    return (_jsxs("div", { className: "pb-24", children: [_jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-display text-[24px] leading-none text-ink", children: "Shop menu and stock" }), _jsx("p", { className: "mt-1.5 text-[13px] text-ink-soft", children: "Change it here and the shop updates when you save" })] }), _jsxs("button", { type: "button", onClick: () => setAddModalOpen(true), className: "press-apple inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-shell px-5 py-2.5 text-[10px] font-bold tracking-[0.09em] text-ink uppercase shadow-xs transition-all hover:border-ink/50 active:scale-95", children: [_jsx(Plus, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Add a flavour" })] })] }), _jsx("ul", { className: "mt-5 grid gap-4 xl:grid-cols-3", children: draft.map((d, i) => {
                    const source = flavours.find((f) => f.id === d.id);
                    const soldOut = d.stock <= 0;
                    return (_jsxs("li", { className: "rounded-[24px] border border-line bg-[#faf6f0] p-5 shadow-xs transition-all hover:border-ink/25", children: [_jsxs("div", { className: "flex items-center gap-3.5", children: [source ? (_jsx(CookieTile, { art: source.art, seedKey: source.id, photo: d.photo || undefined, className: "h-14 w-14 shrink-0 rounded-[14px] shadow-xs", inset: 5 })) : null, _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "label-caps text-[9px] text-ink-soft font-semibold", children: "On the rack today" }), _jsxs("div", { className: "mt-2 flex items-center gap-2", children: [_jsx("button", { type: "button", "aria-label": `Remove one ${d.name}`, onClick: () => patch(d.id, { stock: Math.max(0, d.stock - 1) }), className: "press-apple grid h-9 w-9 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 active:scale-95", children: _jsx(Minus, { className: "h-3 w-3" }) }), _jsx("input", { type: "number", min: 0, value: d.stock, "aria-label": `${d.name} stock on the rack`, onChange: (e) => {
                                                            const n = Number(e.target.value);
                                                            patch(d.id, { stock: Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0 });
                                                        }, className: "h-9 w-[54px] rounded-[12px] border border-line bg-shell p-0 text-center text-[15px] font-bold tabular-nums text-ink leading-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-ink/40 focus:outline-none" }), _jsx("button", { type: "button", "aria-label": `Add one ${d.name}`, onClick: () => patch(d.id, { stock: d.stock + 1 }), className: "press-apple grid h-9 w-9 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 active:scale-95", children: _jsx(Plus, { className: "h-3 w-3" }) })] }), _jsx(SmoothCollapse, { open: soldOut, children: _jsx("p", { className: "label-caps pt-2 text-[9px] font-bold text-brick", children: "Sold out on the shop" }) })] })] }), _jsxs("label", { className: "mt-5 block", children: [_jsx("span", { className: "label-caps mb-2 block text-[9.5px] text-ink-soft", children: "Name" }), _jsx("input", { value: d.name, onChange: (e) => patch(d.id, { name: e.target.value }), className: "w-full rounded-[14px] border border-line bg-shell px-3.5 py-2.5 text-[14px] text-ink focus:border-ink/40 focus:outline-none" })] }), _jsxs("label", { className: "mt-3.5 block", children: [_jsx("span", { className: "label-caps mb-2 block text-[9.5px] text-ink-soft", children: "Description" }), _jsx("textarea", { rows: 2, value: d.desc, onChange: (e) => patch(d.id, { desc: e.target.value }), className: "w-full resize-none rounded-[14px] border border-line bg-shell px-3.5 py-2.5 text-[13.5px] text-ink focus:border-ink/40 focus:outline-none" })] }), _jsxs("label", { className: "mt-3.5 block", children: [_jsx("span", { className: "label-caps mb-2 block text-[9.5px] text-ink-soft", children: "Allergens, comma separated" }), _jsx("input", { value: d.allergens, onChange: (e) => patch(d.id, { allergens: e.target.value }), className: "w-full rounded-[14px] border border-line bg-shell px-3.5 py-2 text-[13.5px] text-ink focus:border-ink/40 focus:outline-none" })] }), _jsxs("div", { className: "mt-3.5", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "label-caps block text-[9.5px] text-ink-soft", children: "Photo URL or Upload" }), _jsxs("button", { type: "button", onClick: () => cardFileInputRefs.current[d.id]?.click(), className: "inline-flex items-center gap-1 text-[11px] font-semibold text-ink-soft hover:text-ink active:scale-95", children: [_jsx(Upload, { className: "h-3 w-3 text-brick" }), _jsx("span", { children: "Upload image" })] })] }), _jsx("input", { type: "file", accept: "image/png,image/webp,image/jpeg,image/jpg", className: "hidden", ref: (el) => {
                                            cardFileInputRefs.current[d.id] = el;
                                        }, onChange: (e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                handleCardPhotoUpload(d.id, e.target.files[0]);
                                            }
                                        } }), _jsx("input", { value: d.photo, placeholder: "Leave blank to use drawn cookie or paste URL", onChange: (e) => patch(d.id, { photo: e.target.value }), className: "w-full rounded-[14px] border border-line bg-shell px-3.5 py-2 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-ink/40 focus:outline-none" })] }), _jsxs("div", { className: "mt-4 flex items-center justify-between gap-3 border-t border-line-soft pt-3", children: [_jsxs("span", { className: "label-caps text-[9px] text-ink-faint font-semibold", children: ["Flavour ", i + 1] }), _jsxs("button", { type: "button", onClick: () => setFlavourToDelete({
                                            id: d.id,
                                            name: d.name,
                                            desc: d.desc,
                                            photo: d.photo,
                                            art: source?.art,
                                            stock: d.stock,
                                        }), disabled: draft.length <= 1, className: "inline-flex items-center gap-1 rounded-full border border-ink/20 bg-shell px-3.5 py-1 text-[9.5px] font-bold tracking-[0.09em] text-ink uppercase transition-all hover:border-ink/40 active:scale-95 disabled:opacity-40", children: [_jsx(Trash2, { className: "h-3 w-3 text-brick" }), _jsx("span", { children: "Remove" })] })] })] }, d.id));
                }) }), _jsx("div", { className: "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-[#faf6f0]/96 px-4 py-3 backdrop-blur-md lg:left-[256px] shadow-[0_-4px_20px_rgba(43,29,19,0.06)]", children: _jsxs("div", { className: "mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-3", children: [_jsxs("p", { className: "text-[12px] text-ink-soft font-medium", children: ["This is a demo, so changes save to your own browser only.", dirty ? ' (You have unsaved changes)' : ''] }), _jsxs("div", { className: "flex gap-2.5", children: [_jsxs("button", { type: "button", onClick: resetFlavours, className: "press-apple inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-shell px-4 py-2 text-[10.5px] font-bold tracking-[0.09em] text-ink uppercase shadow-xs transition-all hover:border-ink/40 active:scale-95", children: [_jsx(RotateCcw, { className: "h-3 w-3" }), _jsx("span", { children: "Reset" })] }), _jsxs("button", { type: "button", onClick: save, className: "press-apple inline-flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2 text-[10.5px] font-bold tracking-[0.09em] text-cream uppercase shadow-xs transition-all hover:bg-cocoa-soft active:scale-95", children: [_jsx(Check, { className: "h-3.5 w-3.5 text-gold", strokeWidth: 2.5 }), _jsx("span", { children: "Save and update the shop" })] })] })] }) }), _jsx(AddFlavourModal, { open: addModalOpen, onClose: () => setAddModalOpen(false) }), _jsx(ConfirmDeleteFlavourModal, { open: !!flavourToDelete, flavour: flavourToDelete, onClose: () => setFlavourToDelete(null), onConfirm: handleConfirmDelete })] }));
}
