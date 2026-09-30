import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ShopProvider } from './lib/store';
import './index.css';
const root = document.getElementById('root');
if (!root)
    throw new Error('Missing #root');
const basename = window.location.pathname.startsWith('/bake-house')
    ? '/bake-house'
    : window.location.pathname.startsWith('/bakehouse')
        ? '/bakehouse'
        : undefined;
createRoot(root).render(_jsx(StrictMode, { children: _jsx(BrowserRouter, { basename: basename, children: _jsx(ShopProvider, { children: _jsx(App, {}) }) }) }));
