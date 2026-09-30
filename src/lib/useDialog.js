import { useEffect, useRef } from 'react';
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
/**
 * Dialog plumbing: locks the page behind the overlay, moves focus in on open,
 * traps Tab inside, closes on Escape, and hands focus back to the trigger.
 *
 * Both keys are handled on `document` rather than on the overlay element. An
 * element-level handler only fires while focus is inside the dialog, so a click
 * on a non-focusable part of the panel — which drops focus to `<body>` — would
 * silently kill Escape.
 */
export function useDialog(open, onClose) {
    const ref = useRef(null);
    const restore = useRef(null);
    const closeRef = useRef(onClose);
    closeRef.current = onClose;
    useEffect(() => {
        if (!open)
            return;
        restore.current = document.activeElement;
        document.body.dataset.locked = 'true';
        const node = ref.current;
        const first = Array.from(node?.querySelectorAll(FOCUSABLE) ?? []).find((el) => el.offsetParent !== null && !el.closest('[inert]') && !el.closest('[aria-hidden="true"]'));
        (first ?? node)?.focus({ preventScroll: true });
        const onKey = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeRef.current();
                return;
            }
            if (e.key !== 'Tab')
                return;
            const host = ref.current;
            if (!host)
                return;
            const items = Array.from(host.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null && !el.closest('[inert]') && !el.closest('[aria-hidden="true"]'));
            if (items.length === 0)
                return;
            const firstItem = items[0];
            const lastItem = items[items.length - 1];
            const active = document.activeElement;
            if (!active || !host.contains(active)) {
                e.preventDefault();
                firstItem.focus();
                return;
            }
            if (!e.shiftKey && active === lastItem) {
                e.preventDefault();
                firstItem.focus();
            }
            else if (e.shiftKey && active === firstItem) {
                e.preventDefault();
                lastItem.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            delete document.body.dataset.locked;
            restore.current?.focus?.({ preventScroll: true });
        };
    }, [open]);
    return { ref };
}
