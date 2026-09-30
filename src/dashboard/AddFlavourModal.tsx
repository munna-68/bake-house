import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { CookieTile } from '../components/Cookie'
import { FLAVOURS } from '../lib/data'
import {
  loadImageFromUrl,
  readFileAsImage,
  removeBackground,
  resizeImage,
} from '../lib/imageUtils'
import { useShop } from '../lib/store'
import type { CookieArt } from '../lib/types'
import { useDialog } from '../lib/useDialog'
import { usePresence } from '../lib/usePresence'
import { SmoothCollapse } from '../components/SmoothCollapse'
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Minus,
  Plus,
  RefreshCw,
  Sliders,
  Sparkles,
  Upload,
  Wand2,
  X,
} from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onCreated?: (id: string) => void
}

const COMMON_ALLERGENS = [
  'Wheat',
  'Milk',
  'Egg',
  'Soy',
  'Peanuts',
  'Tree Nuts',
  'Oats',
  'Sesame',
]

const PALETTE_OPTIONS: Array<{ name: string; art: CookieArt }> = [
  {
    name: 'Warm Butter',
    art: { base: '#d9b47c', edge: '#b9914f', chips: ['#5a3a1c', '#3a2412'], crumb: '#a37c46' },
  },
  {
    name: 'Rich Cocoa',
    art: { base: '#4a2e1d', edge: '#341f11', chips: ['#6b4226', '#2a1608'], crumb: '#2a1608' },
  },
  {
    name: 'Spiced Amber',
    art: { base: '#c98f4e', edge: '#a96f32', chips: ['#7a3f1c', '#e0b072'], crumb: '#8a5423' },
  },
  {
    name: 'Matcha Green',
    art: { base: '#93a96a', edge: '#76894f', chips: ['#f2f0e4', '#6e8049'], crumb: '#7d9155' },
  },
  {
    name: 'Red Velvet',
    art: { base: '#8e3b34', edge: '#6e2a25', chips: ['#f0e6dc', '#5a211c'], crumb: '#6e2a25' },
  },
  {
    name: 'Toasted Oat',
    art: { base: '#c7a97c', edge: '#a98a5c', chips: ['#8a6a3e', '#e6d6b4'], crumb: '#9a7c4e' },
  },
]

export function AddFlavourModal({ open, onClose, onCreated }: Props) {
  const { ref } = useDialog(open, onClose)
  const { addFlavour, toast } = useShop()

  // Form state
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [stock, setStock] = useState(12)
  const [allergensList, setAllergensList] = useState<string[]>(['Wheat', 'Milk'])
  const [customAllergens, setCustomAllergens] = useState('')
  const [selectedPaletteIdx, setSelectedPaletteIdx] = useState(0)

  // Photo state
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null)
  const [processedPhoto, setProcessedPhoto] = useState<string | null>(null)
  const [isCutoutActive, setIsCutoutActive] = useState(false)
  const [tolerance, setTolerance] = useState(22)
  const [showGuidelines, setShowGuidelines] = useState(true)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [previewMode, setPreviewMode] = useState<'tile' | 'checkerboard'>('tile')
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (!open) return
    setName('')
    setDesc('')
    setStock(12)
    setAllergensList(['Wheat', 'Milk'])
    setCustomAllergens('')
    setSelectedPaletteIdx(0)
    setOriginalPhoto(null)
    setProcessedPhoto(null)
    setIsCutoutActive(false)
    setTolerance(22)
    setUrlInput('')
    setShowUrlInput(false)
    setErrorMsg(null)
  }, [open])

  const { mounted, isClosing } = usePresence(open, 240)
  if (!mounted) return null

  const activePhoto = isCutoutActive ? processedPhoto : originalPhoto
  const activeArt = PALETTE_OPTIONS[selectedPaletteIdx].art

  const toggleAllergen = (allergen: string) => {
    setAllergensList((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen],
    )
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, WebP, or JPG).')
      return
    }
    setErrorMsg(null)
    setIsProcessing(true)
    try {
      const img = await readFileAsImage(file)
      const resized = resizeImage(img, 600)
      setOriginalPhoto(resized)
      setProcessedPhoto(null)
      setIsCutoutActive(false)
    } catch {
      setErrorMsg('Could not process this image. Please try another one.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleApplyCutout = async (customTolerance?: number) => {
    if (!originalPhoto) return
    const tol = customTolerance ?? tolerance
    setIsProcessing(true)
    try {
      const img = await loadImageFromUrl(originalPhoto)
      const cutout = removeBackground(img, tol)
      setProcessedPhoto(cutout)
      setIsCutoutActive(true)
      toast('Magic cutout applied: background removed')
    } catch {
      toast('Failed to process cutout', 'full')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLoadUrl = async () => {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    setIsProcessing(true)
    setErrorMsg(null)
    try {
      const img = await loadImageFromUrl(trimmed)
      const resized = resizeImage(img, 600)
      setOriginalPhoto(resized)
      setProcessedPhoto(null)
      setIsCutoutActive(false)
      setShowUrlInput(false)
      setUrlInput('')
    } catch {
      setErrorMsg('Could not load image from URL. Make sure the link is accessible.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSelectSample = (sampleUrl: string) => {
    setOriginalPhoto(sampleUrl)
    setProcessedPhoto(null)
    setIsCutoutActive(false)
    setErrorMsg(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setErrorMsg('Please enter a flavour name.')
      return
    }

    const finalAllergens = [
      ...allergensList,
      ...customAllergens
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ].filter((val, idx, arr) => arr.indexOf(val) === idx)

    const finalPhoto = activePhoto || undefined

    const newId = addFlavour({
      name: trimmedName,
      desc: desc.trim() || 'Freshly baked today at the counter.',
      stock: Math.max(0, Math.round(stock)),
      allergens: finalAllergens.length > 0 ? finalAllergens : ['Wheat', 'Milk'],
      art: activeArt,
      photo: finalPhoto,
    })

    toast(`Added "${trimmedName}" to the menu!`)
    onCreated?.(newId)
    onClose()
  }

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6 ${
        isClosing ? 'pointer-events-none' : ''
      }`}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className={`${
          isClosing ? 'fade-exit' : 'fade-enter'
        } absolute inset-0 bg-cocoa/45 backdrop-blur-sm`}
      />

      {/* Modal Dialog */}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Add new flavour"
        className={`${
          isClosing ? 'modal-exit' : 'modal-enter'
        } relative flex h-[calc(100dvh-20px)] w-full flex-col overflow-hidden rounded-t-[30px] bg-cream shadow-lift md:h-auto md:max-h-[92dvh] md:w-[680px] md:rounded-[30px]`}
      >
        {/* Mobile drag handle indicator */}
        <div className="pt-2.5 pb-1 flex justify-center md:hidden">
          <div className="h-1.5 w-12 rounded-full bg-ink/20" />
        </div>

        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line bg-cream px-5 pt-3 pb-4 sm:px-7 sm:pt-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/20 text-gold border border-gold/30">
              <Sparkles className="h-5 w-5 text-cocoa" />
            </span>
            <div>
              <h2 className="font-display text-[24px] sm:text-[27px] leading-tight text-ink">
                Add a new flavour
              </h2>
              <p className="text-[12.5px] text-ink-soft">
                Create a new cookie flavour with photo, stock, and recipe notes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-shell text-ink transition-transform hover:scale-105 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="add-flavour-form" onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 space-y-6">
          <SmoothCollapse open={Boolean(errorMsg)}>
            <div className="flex items-center gap-2.5 rounded-[14px] border border-brick/30 bg-brick/10 p-3 text-[13px] text-brick font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          </SmoothCollapse>

          {/* Section 1: Flavour Basics */}
          <div className="space-y-4">
            <h3 className="label-caps text-[10px] text-ink-soft tracking-wider">
              1. Flavour details
            </h3>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                Flavour name <span className="text-brick">*</span>
              </span>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Brown Butter Pecan & Toffee"
                className="w-full rounded-[14px] border border-line bg-shell px-4 py-2.5 text-[14.5px] text-ink placeholder:text-ink-faint focus:border-ink/50 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                Description &amp; tasting notes
              </span>
              <textarea
                rows={2}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Crisp golden edges, chewy brown butter crumb, packed with toasted pecans and Maldon sea salt."
                className="w-full resize-none rounded-[14px] border border-line bg-shell px-4 py-2.5 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-ink/50 focus:outline-none"
              />
            </label>

            {/* Stepper for Initial Stock */}
            <div>
              <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                Initial rack stock (today&rsquo;s count)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStock((s) => Math.max(0, s - 1))}
                    aria-label="Decrease stock"
                    className="grid h-9 w-9 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 active:scale-95"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Math.max(0, Number(e.target.value) || 0))}
                    aria-label="Stock count"
                    className="h-9 w-[54px] rounded-[12px] border border-line bg-shell p-0 text-center text-[15px] font-bold tabular-nums text-ink leading-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-ink/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setStock((s) => s + 1)}
                    aria-label="Increase stock"
                    className="grid h-9 w-9 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 active:scale-95"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStock(6)}
                    className={`rounded-full px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider transition-all ${
                      stock === 6 ? 'bg-cocoa text-cream' : 'border border-line bg-shell text-ink-soft hover:text-ink'
                    }`}
                  >
                    6 (Half)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStock(12)}
                    className={`rounded-full px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider transition-all ${
                      stock === 12 ? 'bg-cocoa text-cream' : 'border border-line bg-shell text-ink-soft hover:text-ink'
                    }`}
                  >
                    12 (1 Tray)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStock(24)}
                    className={`rounded-full px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider transition-all ${
                      stock === 24 ? 'bg-cocoa text-cream' : 'border border-line bg-shell text-ink-soft hover:text-ink'
                    }`}
                  >
                    24 (2 Trays)
                  </button>
                </div>
              </div>
            </div>

            {/* Allergens selection */}
            <div>
              <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                Allergens (tap to toggle)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_ALLERGENS.map((a) => {
                  const active = allergensList.includes(a)
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAllergen(a)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11.5px] font-medium transition-all ${
                        active
                          ? 'border border-cocoa bg-cocoa text-cream shadow-xs'
                          : 'border border-line bg-shell text-ink-soft hover:border-ink/40'
                      }`}
                    >
                      {active ? <Check className="h-3 w-3 text-gold" /> : null}
                      <span>{a}</span>
                    </button>
                  )
                })}
              </div>

              <input
                type="text"
                value={customAllergens}
                onChange={(e) => setCustomAllergens(e.target.value)}
                placeholder="Other allergens, comma separated (e.g. Pistachio, Honey)"
                className="mt-2 w-full rounded-[12px] border border-line bg-shell px-3.5 py-1.5 text-[12.5px] text-ink placeholder:text-ink-faint focus:border-ink/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-line-soft pt-5 space-y-4">
            {/* Section 2: Cookie Photography & Image Upload */}
            <div className="flex items-center justify-between">
              <h3 className="label-caps text-[10px] text-ink-soft tracking-wider">
                2. Cookie photo &amp; cutout
              </h3>
              <button
                type="button"
                onClick={() => setShowGuidelines((v) => !v)}
                className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-ink-soft hover:text-ink"
              >
                <Info className="h-3.5 w-3.5 text-brick" />
                <span>{showGuidelines ? 'Hide guidelines' : 'Image guidelines'}</span>
                {showGuidelines ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>

            {/* Guidelines Card */}
            <SmoothCollapse open={showGuidelines}>
              <div className="rounded-[18px] border border-line bg-[#faf6f0] p-4 text-[12.5px] leading-relaxed text-ink-soft shadow-xs">
                <div className="flex items-start gap-2.5">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/30 text-ink">
                    <Info className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="font-bold text-ink text-[13px]">
                      Photography &amp; Format Guidelines
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[12px]">
                      <li>
                        <strong>Transparent PNG or WebP:</strong> Highly recommended so the cookie sits seamlessly on BakeHouse&rsquo;s warm radial tile without a boxy white border.
                      </li>
                      <li>
                        <strong>Square aspect ratio (1:1):</strong> 400×400px up to 720×720px centered shot.
                      </li>
                      <li>
                        <strong>Clean cutout:</strong> If your photo has a white or plain background, use our built-in <strong>Magic Cutout</strong> below or upload an already transparent PNG.
                      </li>
                      <li>
                        <strong>Mobile Tip:</strong> On iOS, tap &amp; hold the cookie in Photos to &ldquo;Copy Subject&rdquo; with transparency, then save or drop it!
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </SmoothCollapse>

            {/* Dual Preview & Image Upload Area */}
            <div className="rounded-[22px] border border-line bg-shell p-4 sm:p-5">
              <div className="grid gap-5 sm:grid-cols-[140px_1fr] items-center">
                {/* Live Preview Tile */}
                <div className="flex flex-col items-center">
                  <div
                    className={`relative h-28 w-28 overflow-hidden rounded-[20px] border border-line shadow-xs ${
                      previewMode === 'checkerboard' ? 'bg-[#222]' : ''
                    }`}
                    style={
                      previewMode === 'checkerboard'
                        ? {
                            backgroundImage:
                              'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)',
                            backgroundSize: '16px 16px',
                            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                          }
                        : undefined
                    }
                  >
                    <CookieTile
                      art={activeArt}
                      seedKey="new-flavour-preview"
                      photo={activePhoto || undefined}
                      className="h-full w-full"
                      inset={previewMode === 'checkerboard' ? 6 : 7}
                    />
                  </div>

                  {/* Toggle Preview background */}
                  {activePhoto && (
                    <div className="mt-2.5 flex rounded-full border border-line bg-cream p-0.5 text-[10px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setPreviewMode('tile')}
                        className={`rounded-full px-2 py-0.5 transition-all ${
                          previewMode === 'tile' ? 'bg-cocoa text-cream' : 'text-ink-soft hover:text-ink'
                        }`}
                      >
                        Shop tile
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode('checkerboard')}
                        className={`rounded-full px-2 py-0.5 transition-all ${
                          previewMode === 'checkerboard' ? 'bg-cocoa text-cream' : 'text-ink-soft hover:text-ink'
                        }`}
                      >
                        Transparency
                      </button>
                    </div>
                  )}
                  <span className="mt-1 text-[11px] font-medium text-ink-soft">
                    {activePhoto ? 'Live preview' : 'Fallback drawn art'}
                  </span>
                </div>

                {/* Upload or Dropzone */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/webp,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0])
                      }
                    }}
                  />

                  {!originalPhoto ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragActive(true)
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center rounded-[18px] border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                        dragActive
                          ? 'border-cocoa bg-gold/10'
                          : 'border-line hover:border-ink/40 bg-cream/30'
                      }`}
                    >
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink-soft mb-2 shadow-xs">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-[13.5px] font-bold text-ink">
                        Drop cookie image here, or <span className="text-brick underline">browse</span>
                      </p>
                      <p className="mt-1 text-[11.5px] text-ink-soft">
                        Supports transparent PNG, WebP or JPEG (Auto-compressed)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-shell px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-ink/50 active:scale-95"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Replace photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOriginalPhoto(null)
                            setProcessedPhoto(null)
                            setIsCutoutActive(false)
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-brick/30 bg-brick/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brick hover:bg-brick/20 active:scale-95"
                        >
                          <X className="h-3 w-3" />
                          <span>Remove</span>
                        </button>
                      </div>

                      {/* Magic Background Removal Controls */}
                      <div className="rounded-[16px] border border-line bg-[#faf6f0] p-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Wand2 className="h-4 w-4 text-gold" />
                            <span className="text-[12.5px] font-bold text-ink">
                              Magic Background Removal
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {processedPhoto && (
                              <button
                                type="button"
                                onClick={() => setIsCutoutActive((v) => !v)}
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                                  isCutoutActive
                                    ? 'bg-cocoa text-cream'
                                    : 'border border-line bg-shell text-ink-soft'
                                }`}
                              >
                                {isCutoutActive ? 'Cutout Active' : 'Show Cutout'}
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleApplyCutout()}
                              className="inline-flex items-center gap-1 rounded-full bg-gold/30 px-3 py-1 text-[11px] font-bold text-cocoa transition-all hover:bg-gold/45 active:scale-95 disabled:opacity-50"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>{processedPhoto ? 'Re-run cutout' : 'Remove background'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Cutout sensitivity slider */}
                        <div className="mt-3 pt-2.5 border-t border-line-soft">
                          <div className="flex items-center justify-between text-[11.5px] text-ink-soft mb-1">
                            <span className="flex items-center gap-1">
                              <Sliders className="h-3 w-3" />
                              <span>Cutout sensitivity (tolerance)</span>
                            </span>
                            <span className="font-bold text-ink">{tolerance}%</span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={50}
                            value={tolerance}
                            onChange={(e) => {
                              const val = Number(e.target.value)
                              setTolerance(val)
                              if (processedPhoto) {
                                handleApplyCutout(val)
                              }
                            }}
                            className="w-full accent-cocoa"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Alternative: Link sample or URL */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-line-soft">
                    <button
                      type="button"
                      onClick={() => setShowUrlInput((v) => !v)}
                      className="text-[11.5px] text-ink-soft hover:text-ink underline"
                    >
                      {showUrlInput ? 'Cancel image URL' : 'Or paste an image URL'}
                    </button>
                    <span className="text-ink-faint text-[11px]">·</span>
                    <span className="text-[11.5px] text-ink-soft">Test with sample:</span>
                    <div className="flex gap-1.5">
                      {FLAVOURS.slice(0, 3).map((sf) => (
                        <button
                          key={sf.id}
                          type="button"
                          onClick={() => handleSelectSample(sf.photo ?? '')}
                          className="rounded-full border border-line bg-cream px-2 py-0.5 text-[10px] font-medium text-ink hover:border-ink/40"
                        >
                          {sf.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <SmoothCollapse open={showUrlInput}>
                    <div className="pt-2 flex gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://... or /cookies/name.webp"
                        className="flex-1 rounded-[12px] border border-line bg-shell px-3 py-1.5 text-[12.5px] text-ink focus:border-ink/40 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleLoadUrl}
                        className="rounded-full bg-cocoa px-3.5 py-1 text-[11px] font-bold text-cream active:scale-95"
                      >
                        Load
                      </button>
                    </div>
                  </SmoothCollapse>
                </div>
              </div>
            </div>

            {/* Section 3: Fallback Dough Palette */}
            <div>
              <span className="mb-2 block text-[13px] font-semibold text-ink">
                Cookie dough palette (fallback art &amp; tile glow)
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PALETTE_OPTIONS.map((pal, idx) => {
                  const active = selectedPaletteIdx === idx
                  return (
                    <button
                      key={pal.name}
                      type="button"
                      onClick={() => setSelectedPaletteIdx(idx)}
                      className={`flex flex-col items-center gap-1 rounded-[16px] border p-2 text-center transition-all ${
                        active
                          ? 'border-cocoa bg-gold/15 shadow-xs'
                          : 'border-line bg-shell hover:border-ink/30'
                      }`}
                    >
                      <div
                        className="h-7 w-7 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: pal.art.base }}
                      />
                      <span className="text-[10.5px] font-semibold text-ink leading-tight">
                        {pal.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="shrink-0 border-t border-line bg-cream px-5 py-3.5 sm:px-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-ink/20 bg-shell px-4 py-2 text-[10.5px] font-bold tracking-[0.09em] text-ink uppercase transition-all hover:border-ink/50 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-flavour-form"
            className="inline-flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2.5 text-[11px] font-bold tracking-[0.09em] text-cream uppercase shadow-xs transition-all hover:bg-cocoa-soft active:scale-95"
          >
            <Check className="h-4 w-4 text-gold" strokeWidth={2.5} />
            <span>Add flavour to menu</span>
          </button>
        </div>
      </div>
    </div>
  )
}
