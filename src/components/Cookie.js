import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { resolveCookiePhoto } from '../lib/data';
function mulberry32(seed) {
    let a = seed >>> 0;
    return function next() {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}
function mix(hex, target, amount) {
    const parse = (h) => {
        const v = h.replace('#', '');
        const full = v.length === 3 ? v.split('').map((c) => c + c).join('') : v;
        return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
    };
    const a = parse(hex);
    const b = parse(target);
    const out = a.map((v, i) => Math.round(v + (b[i] - v) * amount));
    return `#${out.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
export const lighten = (hex, amount) => mix(hex, '#ffffff', amount);
export const darken = (hex, amount) => mix(hex, '#000000', amount);
function build(art, seedKey) {
    const rand = mulberry32(hash(seedKey));
    // Wobbly outline — a real bake is never a perfect circle.
    const POINTS = 30;
    const pts = [];
    for (let i = 0; i < POINTS; i++) {
        const a = (i / POINTS) * Math.PI * 2;
        const r = 49 * (1 + (rand() - 0.5) * 0.075);
        pts.push([60 + Math.cos(a) * r, 58 + Math.sin(a) * r * 0.97]);
    }
    const mid = (a, b) => `${((a[0] + b[0]) / 2).toFixed(2)} ${((a[1] + b[1]) / 2).toFixed(2)}`;
    let outline = `M ${mid(pts[POINTS - 1], pts[0])}`;
    for (let i = 0; i < POINTS; i++) {
        const p = pts[i];
        const next = pts[(i + 1) % POINTS];
        outline += ` Q ${p[0].toFixed(2)} ${p[1].toFixed(2)} ${mid(p, next)}`;
    }
    outline += ' Z';
    const chunks = [];
    const count = 12 + Math.floor(rand() * 5);
    for (let i = 0; i < count; i++) {
        const angle = rand() * Math.PI * 2;
        const dist = Math.sqrt(rand()) * 34;
        const x = 60 + Math.cos(angle) * dist;
        const y = 58 + Math.sin(angle) * dist * 0.94;
        const rx = 4 + rand() * 5;
        const ry = rx * (0.58 + rand() * 0.34);
        const fill = art.chips[Math.floor(rand() * art.chips.length)];
        chunks.push({
            x,
            y,
            rx,
            ry,
            rot: rand() * 180,
            fill,
            highlight: lighten(fill, 0.42),
        });
    }
    const crumbs = [];
    for (let i = 0; i < 34; i++) {
        const angle = rand() * Math.PI * 2;
        const dist = Math.sqrt(rand()) * 44;
        crumbs.push({
            x: 60 + Math.cos(angle) * dist,
            y: 58 + Math.sin(angle) * dist * 0.95,
            r: 0.6 + rand() * 1.6,
            o: 0.16 + rand() * 0.4,
        });
    }
    return { chunks, crumbs, outline };
}
/** A deterministic, drawn-from-scratch cookie. Same seed always renders the same bake. */
export function CookieArtSvg({ art, seedKey, className, title }) {
    const { chunks, crumbs, outline } = useMemo(() => build(art, seedKey), [art, seedKey]);
    const uid = `ck-${seedKey.replace(/[^a-z0-9]/gi, '')}`;
    const rim = darken(art.edge, 0.16);
    return (_jsxs("svg", { viewBox: "0 0 120 120", className: className, role: "img", "aria-label": title ?? 'Cookie', focusable: "false", children: [_jsxs("defs", { children: [_jsxs("radialGradient", { id: `${uid}-body`, cx: "34%", cy: "26%", r: "84%", children: [_jsx("stop", { offset: "0%", stopColor: lighten(art.base, 0.24) }), _jsx("stop", { offset: "46%", stopColor: art.base }), _jsx("stop", { offset: "88%", stopColor: art.edge }), _jsx("stop", { offset: "100%", stopColor: darken(art.edge, 0.14) })] }), _jsxs("radialGradient", { id: `${uid}-shade`, cx: "74%", cy: "84%", r: "64%", children: [_jsx("stop", { offset: "0%", stopColor: darken(art.edge, 0.34), stopOpacity: "0.45" }), _jsx("stop", { offset: "100%", stopColor: darken(art.edge, 0.34), stopOpacity: "0" })] }), _jsx("clipPath", { id: `${uid}-clip`, children: _jsx("path", { d: outline }) })] }), _jsx("ellipse", { cx: "60", cy: "108", rx: "35", ry: "5", fill: "rgba(43,29,19,0.15)" }), _jsx("path", { d: outline, fill: `url(#${uid}-body)` }), _jsx("path", { d: outline, fill: `url(#${uid}-shade)` }), _jsxs("g", { clipPath: `url(#${uid}-clip)`, children: [crumbs.map((c, i) => (_jsx("circle", { cx: c.x, cy: c.y, r: c.r, fill: art.crumb, opacity: c.o }, `c${i}`))), chunks.map((c, i) => (_jsxs("g", { transform: `translate(${c.x} ${c.y}) rotate(${c.rot})`, children: [_jsx("ellipse", { rx: c.rx, ry: c.ry, fill: c.fill }), _jsx("ellipse", { cx: -c.rx * 0.2, cy: -c.ry * 0.3, rx: c.rx * 0.4, ry: c.ry * 0.32, fill: c.highlight, opacity: "0.45" })] }, `k${i}`))), _jsx("ellipse", { cx: "40", cy: "31", rx: "22", ry: "13", fill: "#ffffff", opacity: "0.12", transform: "rotate(-26 40 31)" })] }), _jsx("path", { d: outline, fill: "none", stroke: rim, strokeWidth: "1.4", opacity: "0.5" }), _jsx("path", { d: outline, fill: "none", stroke: lighten(art.base, 0.34), strokeWidth: "4", opacity: "0.18", transform: "translate(60 58) scale(0.9) translate(-60 -58)" })] }));
}
/** The cookie sat on a warm tile, the way the product cards and carousel show it. */
export function CookieTile({ art, seedKey, className = '', inset = 9, title, dim, photo, fit = 'contain', }) {
    /* A renamed or missing file falls back to the drawn cookie instead of leaving a
       broken-image icon in the grid. Keyed on the URL so editing the Photo URL in
       the dashboard retries rather than staying stuck on the failed source. */
    const resolvedPhoto = resolveCookiePhoto(photo);
    const [brokenSrc, setBrokenSrc] = useState(null);
    const showPhoto = Boolean(resolvedPhoto) && brokenSrc !== resolvedPhoto;
    return (_jsxs("div", { className: `relative flex items-center justify-center overflow-hidden ${className}`, style: {
            background: `radial-gradient(120% 120% at 30% 18%, ${lighten(art.base, 0.82)} 0%, ${lighten(art.edge, 0.7)} 100%)`,
        }, children: [_jsx("div", { className: "absolute inset-0", style: inset > 0 ? { padding: `${inset}%` } : undefined, children: showPhoto ? (_jsx("img", { src: resolvedPhoto, alt: title ?? '', loading: "lazy", decoding: "async", onError: () => setBrokenSrc(resolvedPhoto ?? null), className: `h-full w-full ${fit === 'cover' ? 'object-cover scale-[1.08]' : 'object-contain'}` })) : (_jsx(CookieArtSvg, { art: art, seedKey: seedKey, title: title, className: "h-full w-full" })) }), dim ? _jsx("div", { className: "absolute inset-0 bg-cream/55" }) : null] }));
}
