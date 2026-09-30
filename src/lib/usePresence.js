import { useEffect, useState } from 'react';
/**
 * Manages entering and exiting state for overlays/drawers/modals
 * so exit animations can complete smoothly before DOM unmount.
 * Respects prefers-reduced-motion by unmounting immediately without delay.
 */
export function usePresence(open, exitDuration = 260) {
    const [mounted, setMounted] = useState(open);
    const [isClosing, setIsClosing] = useState(false);
    const effectiveDuration = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 0
        : exitDuration;
    useEffect(() => {
        if (open) {
            setMounted(true);
            setIsClosing(false);
        }
        else if (mounted) {
            if (effectiveDuration === 0) {
                setMounted(false);
                setIsClosing(false);
                return;
            }
            setIsClosing(true);
            const t = setTimeout(() => {
                setMounted(false);
                setIsClosing(false);
            }, effectiveDuration);
            return () => clearTimeout(t);
        }
    }, [open, effectiveDuration, mounted]);
    return { mounted, isClosing };
}
