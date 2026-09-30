import { useEffect, useRef } from 'react';
/**
 * Apple-style progressive scroll reveal.
 * Respects prefers-reduced-motion and gracefully degrades without JS.
 * Checks whether the element is already in viewport on mount to avoid initial flash.
 */
export function useScrollReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        if (typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.classList.add('reveal-visible');
            return;
        }
        if (typeof IntersectionObserver === 'undefined') {
            el.classList.add('reveal-visible');
            return;
        }
        // If the element is already inside the viewport on mount, reveal it immediately
        // to prevent jarring flash of content disappearing and reappearing.
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (inViewport) {
            el.classList.add('reveal-visible');
            return;
        }
        el.classList.add('reveal-init');
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    el.classList.add('reveal-visible');
                    observer.unobserve(el);
                }
            }
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px',
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}
