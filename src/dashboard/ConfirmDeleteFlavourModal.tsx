import { useEffect, useState } from 'react'
import { CookieTile } from '../components/Cookie'
import type { CookieArt } from '../lib/types'
import { useDialog } from '../lib/useDialog'
import { usePresence } from '../lib/usePresence'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface Props {
  open: boolean
  flavour: { id: string; name: string; desc: string; photo?: string; art?: CookieArt; stock: number } | null
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmDeleteFlavourModal({ open, flavour: initialFlavour, onClose, onConfirm }: Props) {
  const { mounted, isClosing } = usePresence(open && !!initialFlavour, 240)
  const [cachedFlavour, setCachedFlavour] = useState(initialFlavour)

  useEffect(() => {
    if (initialFlavour) setCachedFlavour(initialFlavour)
  }, [initialFlavour])

  const flavour = initialFlavour ?? cachedFlavour

  const { ref } = useDialog(open, onClose)

  if (!mounted || !flavour) return null

  return (
    <div
      className={`fixed inset-0 z-[75] flex items-end justify-center md:items-center md:p-6 ${
        isClosing ? 'pointer-events-none' : ''
      }`}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close confirmation"
        onClick={onClose}
        className={`${
          isClosing ? 'fade-exit' : 'fade-enter'
        } absolute inset-0 bg-cocoa/45 backdrop-blur-sm`}
      />

      {/* Modal Dialog */}
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-desc"
        className={`${
          isClosing ? 'modal-exit' : 'modal-enter'
        } relative flex w-full flex-col overflow-hidden rounded-t-[28px] bg-cream shadow-lift md:w-[480px] md:rounded-[28px]`}
      >
        {/* Mobile drag handle indicator */}
        <div className="pt-2.5 pb-1 flex justify-center md:hidden">
          <div className="h-1.5 w-12 rounded-full bg-ink/20" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brick/12 text-brick border border-brick/20">
              <Trash2 className="h-5 w-5" />
            </span>
            <div>
              <h2 id="confirm-delete-title" className="font-display text-[22px] sm:text-[24px] text-ink leading-tight">
                Remove flavour?
              </h2>
              <p className="text-[12px] text-ink-soft">
                Confirm removing this item from the active menu
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-shell text-ink transition-transform hover:scale-105 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Flavour Card Preview */}
          <div className="flex items-center gap-3.5 rounded-[20px] border border-line bg-[#faf6f0] p-4 shadow-xs">
            {flavour.art ? (
              <CookieTile
                art={flavour.art}
                seedKey={`delete-${flavour.id}`}
                photo={flavour.photo}
                className="h-14 w-14 shrink-0 rounded-[14px] shadow-xs"
                inset={5}
              />
            ) : (
              <div className="h-14 w-14 shrink-0 rounded-[14px] bg-cream-deep border border-line" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-[15px] text-ink truncate">{flavour.name}</h3>
              <p className="text-[12px] text-ink-soft truncate">{flavour.desc || 'No description'}</p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-soft">
                <span className="label-caps font-semibold text-[9.5px]">Stock on rack:</span>
                <span className="font-bold text-ink">{flavour.stock} cookies</span>
              </div>
            </div>
          </div>

          {/* Warning notice */}
          <div className="flex items-start gap-2.5 rounded-[16px] border border-brick/20 bg-brick/5 p-3 text-[12.5px] leading-relaxed text-brick-dark">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-brick" />
            <p id="confirm-delete-desc">
              Removing <strong>&ldquo;{flavour.name}&rdquo;</strong> takes it off the customer storefront immediately and removes it from any customer box currently in progress.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-line bg-cream px-6 py-4 flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="press-apple rounded-full border border-ink/20 bg-shell px-4 py-2.5 text-[11px] font-bold tracking-[0.09em] text-ink uppercase transition-all hover:border-ink/50"
          >
            Keep flavour
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="press-apple inline-flex items-center gap-1.5 rounded-full bg-brick px-5 py-2.5 text-[11px] font-bold tracking-[0.09em] text-white uppercase shadow-xs transition-all hover:bg-brick-dark"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Remove flavour</span>
          </button>
        </div>
      </div>
    </div>
  )
}
