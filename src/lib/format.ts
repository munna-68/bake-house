export function money(n: number): string {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

export function money2(n: number): string {
  return `$${n.toFixed(2)}`
}

export function isoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export interface DayOption {
  iso: string
  num: string
  label: string
}

const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

/** The next four collection days, starting today. */
export function dayOptions(count = 4, from = new Date()): DayOption[] {
  const out: DayOption[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date(from)
    d.setDate(d.getDate() + i)
    out.push({
      iso: isoDate(d),
      num: String(d.getDate()).padStart(2, '0'),
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : WEEKDAY[d.getDay()],
    })
  }
  return out
}

export function longDate(d = new Date()): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function dayLabel(iso: string): string {
  const today = isoDate(new Date())
  if (iso === today) return 'today'
  const t = new Date()
  t.setDate(t.getDate() + 1)
  if (iso === isoDate(t)) return 'tomorrow'
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
}

/** BH-4821 — four digits, unique for the day. */
export function makeRef(taken: Set<string>): string {
  for (let i = 0; i < 60; i++) {
    const n = 1000 + Math.floor(Math.random() * 9000)
    const ref = `BH-${n}`
    if (!taken.has(ref)) return ref
  }
  return `BH-${1000 + Math.floor(Math.random() * 9000)}`
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function trays(cookies: number, perTray = 12): number {
  return Math.ceil(cookies / perTray)
}

export function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value).catch(() => fallbackCopy(value))
  }
  return Promise.resolve(fallbackCopy(value))
}

function fallbackCopy(value: string) {
  const el = document.createElement('textarea')
  el.value = value
  el.setAttribute('readonly', '')
  el.style.position = 'fixed'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.select()
  try {
    document.execCommand('copy')
  } catch {
    /* clipboard unavailable — the value is visible on screen anyway */
  }
  document.body.removeChild(el)
}
