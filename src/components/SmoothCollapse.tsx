import { type ReactNode, useRef } from 'react'

interface SmoothCollapseProps {
  open: boolean
  children: ReactNode
  className?: string
  innerClassName?: string
}

/**
 * High-performance, layout-stable expand/collapse component.
 * Uses grid-template-rows: 0fr -> 1fr with opacity and subtle slide.
 * When collapsed, sets inert and aria-hidden to prevent hidden element focus.
 * Caches previous children so collapsing content does not abruptly disappear.
 */
export function SmoothCollapse({
  open,
  children,
  className = '',
  innerClassName = '',
}: SmoothCollapseProps) {
  const prevChildrenRef = useRef<ReactNode>(children)
  if (open && children) {
    prevChildrenRef.current = children
  }

  const renderedContent = open ? children : (prevChildrenRef.current ?? children)
  const inertProps = !open ? ({ inert: '' } as Record<string, string>) : {}

  return (
    <div
      className={`smooth-collapse ${className}`}
      data-open={open}
      aria-hidden={!open}
      {...inertProps}
    >
      <div className={`smooth-collapse-inner ${innerClassName}`}>{renderedContent}</div>
    </div>
  )
}
