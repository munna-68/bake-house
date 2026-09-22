import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Dialog plumbing: locks the page behind the overlay, moves focus in on open,
 * traps Tab inside, closes on Escape, and hands focus back to the trigger.
 */
export function useDialog(open: boolean, onClose: () => void): {
  ref: RefObject<HTMLDivElement | null>
  onKeyDown: (e: React.KeyboardEvent) => void
} {
  const ref = useRef<HTMLDivElement | null>(null)
  const restore = useRef<HTMLElement | null>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    restore.current = document.activeElement as HTMLElement | null
    document.body.dataset.locked = 'true'

    const node = ref.current
    const first = node?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? node)?.focus({ preventScroll: true })

    return () => {
      delete document.body.dataset.locked
      restore.current?.focus?.({ preventScroll: true })
    }
  }, [open])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      closeRef.current()
      return
    }
    if (e.key !== 'Tab') return

    const node = ref.current
    if (!node) return
    const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    )
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement as HTMLElement | null

    if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    } else if (e.shiftKey && active === first) {
      e.preventDefault()
      last.focus()
    }
  }

  return { ref, onKeyDown }
}
