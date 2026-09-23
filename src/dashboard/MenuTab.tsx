import { useEffect, useState } from 'react'
import { CookieTile } from '../components/Cookie'
import { useShop } from '../lib/store'
import { Check, Minus, Plus, RotateCcw, Trash2 } from 'lucide-react'

interface Draft {
  id: string
  name: string
  desc: string
  allergens: string
  stock: number
  photo: string
}

function toDraft(flavours: ReturnType<typeof useShop>['flavours']): Draft[] {
  return flavours.map((f) => ({
    id: f.id,
    name: f.name,
    desc: f.desc,
    allergens: f.allergens.join(', '),
    stock: f.stock,
    photo: f.photo ?? '',
  }))
}

export function MenuTab() {
  const { flavours, updateFlavour, addFlavour, removeFlavour, resetFlavours, toast } = useShop()
  const [draft, setDraft] = useState<Draft[]>(() => toDraft(flavours))
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setDraft(toDraft(flavours))
    setDirty(false)
  }, [flavours])

  const patch = (id: string, next: Partial<Draft>) => {
    setDraft((list) => list.map((d) => (d.id === id ? { ...d, ...next } : d)))
    setDirty(true)
  }

  const save = () => {
    draft.forEach((d) => {
      updateFlavour(d.id, {
        name: d.name.trim() || 'Untitled flavour',
        desc: d.desc.trim(),
        allergens: d.allergens
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
        stock: Math.max(0, Math.round(Number.isFinite(d.stock) ? d.stock : 0)),
        photo: d.photo.trim(),
      })
    })
    toast('Menu saved. The shop is updated.')
  }

  return (
    <div className="pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px] leading-none text-ink">Shop menu and stock</h2>
          <p className="mt-1.5 text-[13px] text-ink-soft">Change it here and the shop updates when you save</p>
        </div>
        <button
          type="button"
          onClick={addFlavour}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-shell px-5 py-2.5 text-[10px] font-bold tracking-[0.09em] text-ink uppercase shadow-xs transition-all hover:border-ink/50 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add a flavour</span>
        </button>
      </div>

      <ul className="mt-5 grid gap-4 xl:grid-cols-3">
        {draft.map((d, i) => {
          const source = flavours.find((f) => f.id === d.id)
          const soldOut = d.stock <= 0
          return (
            <li key={d.id} className="rounded-[24px] border border-line bg-[#faf6f0] p-5 shadow-xs transition-all hover:border-ink/25">
              <div className="flex items-center gap-3.5">
                {source ? (
                  <CookieTile
                    art={source.art}
                    seedKey={source.id}
                    photo={d.photo || undefined}
                    className="h-14 w-14 shrink-0 rounded-[14px] shadow-xs"
                    inset={5}
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="label-caps text-[9px] text-ink-soft font-semibold">On the rack today</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Remove one ${d.name}`}
                      onClick={() => patch(d.id, { stock: Math.max(0, d.stock - 1) })}
                      className="grid h-9 w-9 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 active:scale-95"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={d.stock}
                      aria-label={`${d.name} stock on the rack`}
                      onChange={(e) => {
                        const n = Number(e.target.value)
                        patch(d.id, { stock: Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0 })
                      }}
                      className="w-[58px] rounded-[12px] border border-line bg-shell px-2 py-1.5 text-center text-[15px] font-bold text-ink focus:border-ink/40 focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label={`Add one ${d.name}`}
                      onClick={() => patch(d.id, { stock: d.stock + 1 })}
                      className="grid h-9 w-9 place-items-center rounded-full border border-line bg-shell text-ink transition-colors hover:border-ink/40 active:scale-95"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  {soldOut ? (
                    <p className="label-caps mt-2 text-[9px] font-bold text-brick">Sold out on the shop</p>
                  ) : null}
                </div>
              </div>

              <label className="mt-5 block">
                <span className="label-caps mb-2 block text-[9.5px] text-ink-soft">Name</span>
                <input
                  value={d.name}
                  onChange={(e) => patch(d.id, { name: e.target.value })}
                  className="w-full rounded-[14px] border border-line bg-shell px-3.5 py-2.5 text-[14px] text-ink focus:border-ink/40 focus:outline-none"
                />
              </label>

              <label className="mt-3.5 block">
                <span className="label-caps mb-2 block text-[9.5px] text-ink-soft">Description</span>
                <textarea
                  rows={2}
                  value={d.desc}
                  onChange={(e) => patch(d.id, { desc: e.target.value })}
                  className="w-full resize-none rounded-[14px] border border-line bg-shell px-3.5 py-2.5 text-[13.5px] text-ink focus:border-ink/40 focus:outline-none"
                />
              </label>

              <label className="mt-3.5 block">
                <span className="label-caps mb-2 block text-[9.5px] text-ink-soft">Allergens, comma separated</span>
                <input
                  value={d.allergens}
                  onChange={(e) => patch(d.id, { allergens: e.target.value })}
                  className="w-full rounded-[14px] border border-line bg-shell px-3.5 py-2 text-[13.5px] text-ink focus:border-ink/40 focus:outline-none"
                />
              </label>

              <label className="mt-3.5 block">
                <span className="label-caps mb-2 block text-[9.5px] text-ink-soft">Photo URL</span>
                <input
                  value={d.photo}
                  placeholder="Leave blank to use the drawn cookie"
                  onChange={(e) => patch(d.id, { photo: e.target.value })}
                  className="w-full rounded-[14px] border border-line bg-shell px-3.5 py-2 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-ink/40 focus:outline-none"
                />
              </label>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line-soft pt-3">
                <span className="label-caps text-[9px] text-ink-faint font-semibold">Flavour {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeFlavour(d.id)}
                  disabled={draft.length <= 1}
                  className="inline-flex items-center gap-1 rounded-full border border-ink/20 bg-shell px-3.5 py-1 text-[9.5px] font-bold tracking-[0.09em] text-ink uppercase transition-all hover:border-ink/40 active:scale-95 disabled:opacity-40"
                >
                  <Trash2 className="h-3 w-3 text-brick" />
                  <span>Remove</span>
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-[#faf6f0]/96 px-4 py-3 backdrop-blur-md lg:left-[256px] shadow-[0_-4px_20px_rgba(43,29,19,0.06)]">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] text-ink-soft font-medium">
            This is a demo, so changes save to your own browser only.{dirty ? ' (You have unsaved changes)' : ''}
          </p>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={resetFlavours}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-shell px-4 py-2 text-[10.5px] font-bold tracking-[0.09em] text-ink uppercase shadow-xs transition-all hover:border-ink/40 active:scale-95"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2 text-[10.5px] font-bold tracking-[0.09em] text-cream uppercase shadow-xs transition-all hover:bg-cocoa-soft active:scale-95"
            >
              <Check className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
              <span>Save and update shop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
