import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Dashboard } from './dashboard/Dashboard';
import { Shop } from './pages/Shop';
export function App() {
    const location = useLocation();
    // Strip trailing slashes so routes and active tabs match consistently
    if (location.pathname.length > 1 && location.pathname.endsWith('/')) {
        return (_jsx(Navigate, { to: `${location.pathname.replace(/\/+$/, '')}${location.search}${location.hash}`, replace: true }));
    }
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Shop, {}) }), _jsx(Route, { path: "/dashboard/*", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }));
}
