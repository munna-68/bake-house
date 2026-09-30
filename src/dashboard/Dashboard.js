import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { BRAND, DASHBOARD_ORDERS } from '../lib/data';
import { longDate } from '../lib/format';
import { useShop } from '../lib/store';
import { KitchenMode } from './KitchenMode';
import { MenuTab } from './MenuTab';
import { OrderDetailModal } from './OrderDetailModal';
import { RestockModal } from './RestockModal';
import { SmoothCollapse } from '../components/SmoothCollapse';
import { BakeSheetTab, CustomersTab, InsightsTab, MoneyTab, OrdersTab, TodayTab } from './tabs';
import { ChefHat, DollarSign, LayoutDashboard, Printer, ShoppingBag, Store, TrendingUp, Users, UtensilsCrossed, X, } from 'lucide-react';
const TABS = [
    { to: '/dashboard', label: 'Today', icon: LayoutDashboard, end: true },
    { to: '/dashboard/orders', label: 'Orders', icon: ShoppingBag, badge: true },
    { to: '/dashboard/bake', label: 'Bake sheet', icon: ChefHat },
    { to: '/dashboard/menu', label: 'Menu', icon: UtensilsCrossed },
    { to: '/dashboard/insights', label: 'Insights', icon: TrendingUp },
    { to: '/dashboard/customers', label: 'Customers', icon: Users },
    { to: '/dashboard/money', label: 'Money', icon: DollarSign },
];
const TITLES = {
    '/dashboard': 'Today',
    '/dashboard/orders': 'Orders',
    '/dashboard/bake': 'Bake sheet',
    '/dashboard/menu': 'Menu',
    '/dashboard/insights': 'Insights',
    '/dashboard/customers': 'Customers',
    '/dashboard/money': 'Money',
};
export function Dashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState(DASHBOARD_ORDERS);
    const [kitchen, setKitchen] = useState(false);
    const [kitchenCardDismissed, setKitchenCardDismissed] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [restockOpen, setRestockOpen] = useState(false);
    const [acknowledgedNotes, setAcknowledgedNotes] = useState(new Set());
    const { toast } = useShop();
    const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;
    const actions = useMemo(() => ({
        markReady: (id) => {
            setOrders((list) => list.map((o) => (o.id === id ? { ...o, stage: 'ready' } : o)));
            toast('Marked ready');
        },
        markCollected: (id) => {
            setOrders((list) => list.map((o) => (o.id === id ? { ...o, stage: 'collected' } : o)));
            toast('Marked collected');
        },
        markReceived: (id) => {
            setOrders((list) => list.map((o) => (o.id === id ? { ...o, payment: 'paid' } : o)));
            toast('Payment marked received');
        },
    }), [toast]);
    const openCount = orders.filter((o) => o.stage !== 'collected').length;
    const onPrint = useCallback(() => {
        navigate('/dashboard/bake');
        window.setTimeout(() => window.print(), 120);
    }, [navigate]);
    const location = useLocation();
    const path = location.pathname.replace(/\/+$/, '') || '/dashboard';
    const title = TITLES[path] ?? 'Today';
    const isTabActive = (tabTo, end) => end ? path === tabTo : path.startsWith(tabTo);
    return (_jsxs("div", { className: "min-h-dvh bg-cream text-ink lg:flex lg:h-dvh lg:overflow-hidden print:h-auto print:overflow-visible", children: [_jsxs("aside", { className: "no-print hidden w-[256px] shrink-0 border-r border-line bg-cream lg:flex lg:h-full lg:flex-col lg:justify-between lg:overflow-y-auto", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-5 border-b border-line-soft", children: [_jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-cocoa shadow-xs", children: _jsx(ChefHat, { className: "h-5 w-5 text-gold" }) }), _jsxs("div", { children: [_jsxs("span", { className: "block font-display text-[20px] leading-none", children: [_jsx("span", { className: "text-ink", children: "Bake" }), _jsx("span", { className: "text-brick", children: "House" })] }), _jsx("span", { className: "mt-1 block text-[11px] text-ink-soft", children: BRAND.address })] })] }), _jsx("nav", { "aria-label": "Dashboard", className: "mt-4 px-3", children: _jsx("ul", { className: "space-y-1", children: TABS.map((tab) => {
                                        const Icon = tab.icon;
                                        return (_jsx("li", { children: _jsx(NavLink, { to: tab.to, end: 'end' in tab ? tab.end : false, className: ({ isActive }) => {
                                                    const active = isActive || isTabActive(tab.to, 'end' in tab ? tab.end : false);
                                                    return `flex items-center justify-between gap-3 rounded-full px-4 py-2.5 text-[13.5px] font-medium transition-all ${active
                                                        ? 'bg-cocoa text-cream shadow-xs'
                                                        : 'text-ink-soft hover:bg-cream-deep hover:text-ink active:scale-95'}`;
                                                }, children: ({ isActive }) => {
                                                    const active = isActive || isTabActive(tab.to, 'end' in tab ? tab.end : false);
                                                    return (_jsxs(_Fragment, { children: [_jsxs("span", { className: "flex items-center gap-2.5", children: [_jsx(Icon, { className: `h-4 w-4 ${active ? 'text-gold' : 'text-ink-soft/75'}` }), _jsx("span", { children: tab.label })] }), 'badge' in tab && tab.badge ? (_jsx("span", { className: "grid h-[20px] min-w-[20px] place-items-center rounded-full bg-brick px-1.5 text-[10.5px] font-bold text-white", children: openCount })) : null] }));
                                                } }) }, tab.to));
                                    }) }) })] }), _jsxs("div", { className: "px-4 pb-5 pt-4 space-y-3 shrink-0", children: [_jsx(SmoothCollapse, { open: !kitchenCardDismissed, children: _jsxs("div", { className: "rounded-[20px] border border-line bg-[#faf6f0] p-4 shadow-xs", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ChefHat, { className: "h-4 w-4 text-brick" }), _jsx("p", { className: "text-[13.5px] font-bold text-ink", children: "Kitchen mode" })] }), _jsx("button", { type: "button", onClick: () => setKitchenCardDismissed(true), "aria-label": "Dismiss kitchen mode card", className: "press-apple grid h-6 w-6 place-items-center rounded-full text-ink-soft transition-all hover:bg-cream-deep hover:text-ink active:scale-95", children: _jsx(X, { className: "h-3.5 w-3.5" }) })] }), _jsx("p", { className: "mt-1.5 text-[12px] leading-relaxed text-ink-soft", children: "Put today\u2019s orders on a tablet in big type, for the bench." }), _jsx("button", { type: "button", onClick: () => setKitchen(true), className: "press-apple mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cocoa px-4 py-2.5 text-[11px] font-bold tracking-[0.09em] text-cream uppercase shadow-xs transition-all hover:bg-cocoa-soft active:scale-95", children: _jsx("span", { children: "Open bench mode" }) })] }) }), _jsxs(Link, { to: "/", className: "press-apple inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-shell px-4 py-2.5 text-[12px] font-medium text-ink transition-all hover:border-ink/40 active:scale-95", children: [_jsx(Store, { className: "h-3.5 w-3.5 text-brick" }), _jsx("span", { children: "View the shop" })] })] })] }), _jsxs("div", { className: "min-w-0 flex-1 lg:flex lg:h-full lg:flex-col lg:overflow-y-auto print:h-auto print:overflow-visible", children: [_jsxs("div", { className: "no-print sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur-md shrink-0", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-display text-[26px] leading-none text-ink", children: title }), _jsx("p", { className: "mt-1 text-[12.5px] text-ink-soft", children: longDate() })] }), _jsxs("div", { className: "flex flex-wrap gap-2.5", children: [_jsxs(Link, { to: "/", className: "inline-flex lg:hidden items-center gap-1.5 rounded-full border border-ink/20 bg-shell px-3 py-2 text-[10.5px] font-bold tracking-[0.08em] text-ink uppercase transition-all hover:border-ink/50 active:scale-95", children: [_jsx(Store, { className: "h-3.5 w-3.5 text-brick" }), _jsx("span", { children: "Shop" })] }), _jsxs("button", { type: "button", onClick: onPrint, className: "inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-shell px-4 py-2 text-[10.5px] font-bold tracking-[0.08em] text-ink uppercase transition-all hover:border-ink/50 active:scale-95", children: [_jsx(Printer, { className: "h-3.5 w-3.5 text-ink-soft" }), _jsx("span", { children: "Print bake sheet" })] }), _jsxs("button", { type: "button", onClick: () => setKitchen(true), className: "inline-flex items-center gap-1.5 rounded-full bg-cocoa px-4 py-2 text-[10.5px] font-bold tracking-[0.08em] text-cream uppercase transition-all hover:bg-cocoa-soft active:scale-95", children: [_jsx(ChefHat, { className: "h-3.5 w-3.5 text-gold" }), _jsx("span", { children: "Kitchen mode" })] })] })] }), _jsx("nav", { "aria-label": "Dashboard", className: "no-scrollbar overflow-x-auto px-4 pb-3 sm:px-6 lg:hidden", children: _jsx("ul", { className: "flex gap-2", children: TABS.map((tab) => {
                                        const Icon = tab.icon;
                                        return (_jsx("li", { children: _jsxs(NavLink, { to: tab.to, end: 'end' in tab ? tab.end : false, className: ({ isActive }) => {
                                                    const active = isActive || isTabActive(tab.to, 'end' in tab ? tab.end : false);
                                                    return `inline-flex items-center gap-1.5 label-caps rounded-full px-3.5 py-2 text-[10px] whitespace-nowrap transition-all active:scale-95 ${active
                                                        ? 'bg-cocoa text-cream shadow-xs'
                                                        : 'border border-line bg-[#faf6f0] text-ink-soft'}`;
                                                }, children: [_jsx(Icon, { className: "h-3.5 w-3.5" }), _jsx("span", { children: tab.label }), 'badge' in tab && tab.badge ? ` (${openCount})` : ''] }) }, tab.to));
                                    }) }) })] }), _jsx("main", { className: "tab-fade-enter flex-1 px-4 py-5 sm:px-6 sm:py-6", children: _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(TodayTab, { orders: orders, actions: actions, onKitchen: () => setKitchen(true), onSelectOrder: (id) => setSelectedOrderId(id), onOpenRestock: () => setRestockOpen(true), acknowledgedNotes: acknowledgedNotes }) }), _jsx(Route, { path: "orders", element: _jsx(OrdersTab, { orders: orders, actions: actions, onSelectOrder: (id) => setSelectedOrderId(id) }) }), _jsx(Route, { path: "bake", element: _jsx(BakeSheetTab, {}) }), _jsx(Route, { path: "menu", element: _jsx(MenuTab, {}) }), _jsx(Route, { path: "insights", element: _jsx(InsightsTab, {}) }), _jsx(Route, { path: "customers", element: _jsx(CustomersTab, {}) }), _jsx(Route, { path: "money", element: _jsx(MoneyTab, { orders: orders, actions: actions }) })] }) }, path)] }), _jsx(KitchenMode, { open: kitchen, orders: orders, onClose: () => setKitchen(false), onReady: (id) => {
                    setOrders((list) => list.map((o) => o.id === id ? { ...o, stage: o.stage === 'ready' ? 'collected' : 'ready' } : o));
                } }), _jsx(OrderDetailModal, { open: !!selectedOrder, order: selectedOrder, onClose: () => setSelectedOrderId(null), actions: actions, onAcknowledgeNote: (id) => {
                    setAcknowledgedNotes((prev) => {
                        const next = new Set(prev);
                        if (next.has(id))
                            next.delete(id);
                        else
                            next.add(id);
                        return next;
                    });
                    toast('Order note acknowledged');
                }, isNoteAcknowledged: selectedOrderId ? acknowledgedNotes.has(selectedOrderId) : false }), _jsx(RestockModal, { open: restockOpen, onClose: () => setRestockOpen(false) })] }));
}
