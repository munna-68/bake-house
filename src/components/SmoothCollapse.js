import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from 'react';
/**
 * High-performance, layout-stable expand/collapse component.
 * Uses grid-template-rows: 0fr -> 1fr with opacity and subtle slide.
 * When collapsed, sets inert and aria-hidden to prevent hidden element focus.
 * Caches previous children so collapsing content does not abruptly disappear.
 */
export function SmoothCollapse({ open, children, className = '', innerClassName = '', }) {
    const prevChildrenRef = useRef(children);
    if (open && children) {
        prevChildrenRef.current = children;
    }
    const renderedContent = open ? children : (prevChildrenRef.current ?? children);
    const inertProps = !open ? { inert: '' } : {};
    return (_jsx("div", { className: `smooth-collapse ${className}`, "data-open": open, "aria-hidden": !open, ...inertProps, children: _jsx("div", { className: `smooth-collapse-inner ${innerClassName}`, children: renderedContent }) }));
}
