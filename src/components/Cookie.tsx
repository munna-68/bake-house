import { useMemo } from 'react'
import type { CookieArt } from '../lib/types'

function mulberry32(seed: number) {
  let a = seed >>> 0
  return function next() {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mix(hex: string, target: string, amount: number): string {
  const parse = (h: string) => {
    const v = h.replace('#', '')
    const full = v.length === 3 ? v.split('').map((c) => c + c).join('') : v
    return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)]
  }
  const a = parse(hex)
  const b = parse(target)
  const out = a.map((v, i) => Math.round(v + (b[i] - v) * amount))
  return `#${out.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

export const lighten = (hex: string, amount: number) => mix(hex, '#ffffff', amount)
export const darken = (hex: string, amount: number) => mix(hex, '#000000', amount)

interface Chunk {
  x: number
  y: number
  rx: number
  ry: number
  rot: number
  fill: string
  highlight: string
}

interface Crumb {
  x: number
  y: number
  r: number
  o: number
}

function build(art: CookieArt, seedKey: string) {
  const rand = mulberry32(hash(seedKey))
  const chunks: Chunk[] = []
  const count = 8 + Math.floor(rand() * 4)

  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2
    const dist = Math.sqrt(rand()) * 33
    const x = 60 + Math.cos(angle) * dist
    const y = 58 + Math.sin(angle) * dist * 0.94
    const rx = 5 + rand() * 6
    const ry = rx * (0.62 + rand() * 0.3)
    const fill = art.chips[Math.floor(rand() * art.chips.length)]
    chunks.push({
      x,
      y,
      rx,
      ry,
      rot: rand() * 180,
      fill,
      highlight: lighten(fill, 0.42),
    })
  }

  const crumbs: Crumb[] = []
  for (let i = 0; i < 26; i++) {
    const angle = rand() * Math.PI * 2
    const dist = Math.sqrt(rand()) * 44
    crumbs.push({
      x: 60 + Math.cos(angle) * dist,
      y: 58 + Math.sin(angle) * dist * 0.95,
      r: 0.7 + rand() * 1.5,
      o: 0.18 + rand() * 0.4,
    })
  }

  return { chunks, crumbs }
}

interface Props {
  art: CookieArt
  seedKey: string
  className?: string
  title?: string
}

/** A deterministic, drawn-from-scratch cookie. Same seed always renders the same bake. */
export function CookieArtSvg({ art, seedKey, className, title }: Props) {
  const { chunks, crumbs } = useMemo(() => build(art, seedKey), [art, seedKey])
  const uid = `ck-${seedKey.replace(/[^a-z0-9]/gi, '')}`
  const rim = darken(art.edge, 0.12)

  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={title ?? 'Cookie'} focusable="false">
      <defs>
        <radialGradient id={`${uid}-body`} cx="34%" cy="26%" r="82%">
          <stop offset="0%" stopColor={lighten(art.base, 0.2)} />
          <stop offset="52%" stopColor={art.base} />
          <stop offset="100%" stopColor={art.edge} />
        </radialGradient>
        <radialGradient id={`${uid}-shade`} cx="72%" cy="82%" r="66%">
          <stop offset="0%" stopColor={darken(art.edge, 0.3)} stopOpacity="0.5" />
          <stop offset="100%" stopColor={darken(art.edge, 0.3)} stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <circle cx="60" cy="58" r="49.2" />
        </clipPath>
      </defs>

      <ellipse cx="60" cy="108" rx="36" ry="5.5" fill="rgba(43,29,19,0.16)" />

      <circle cx="60" cy="58" r="50" fill={`url(#${uid}-body)`} />
      <circle cx="60" cy="58" r="50" fill={`url(#${uid}-shade)`} />

      <g clipPath={`url(#${uid}-clip)`}>
        {crumbs.map((c, i) => (
          <circle key={`c${i}`} cx={c.x} cy={c.y} r={c.r} fill={art.crumb} opacity={c.o} />
        ))}

        {chunks.map((c, i) => (
          <g key={`k${i}`} transform={`translate(${c.x} ${c.y}) rotate(${c.rot})`}>
            <ellipse rx={c.rx} ry={c.ry} fill={c.fill} />
            <ellipse
              cx={-c.rx * 0.22}
              cy={-c.ry * 0.28}
              rx={c.rx * 0.42}
              ry={c.ry * 0.34}
              fill={c.highlight}
              opacity="0.5"
            />
          </g>
        ))}

        <ellipse cx="41" cy="32" rx="21" ry="13" fill="#ffffff" opacity="0.13" transform="rotate(-26 41 32)" />
      </g>

      <circle cx="60" cy="58" r="49.2" fill="none" stroke={rim} strokeWidth="1.3" opacity="0.55" />
      <circle cx="60" cy="58" r="45" fill="none" stroke={lighten(art.base, 0.3)} strokeWidth="0.8" opacity="0.35" />
    </svg>
  )
}

interface TileProps {
  art: CookieArt
  seedKey: string
  className?: string
  /** inner padding as a percentage of the tile */
  inset?: number
  title?: string
  dim?: boolean
  /** when set, the real photo wins over the drawn cookie */
  photo?: string
}

/** The cookie sat on a warm tile, the way the product cards and carousel show it. */
export function CookieTile({ art, seedKey, className = '', inset = 9, title, dim, photo }: TileProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 120% at 30% 18%, ${lighten(art.base, 0.82)} 0%, ${lighten(
          art.edge,
          0.7,
        )} 100%)`,
      }}
    >
      {photo ? (
        <img src={photo} alt={title ?? ''} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="absolute inset-0" style={{ padding: `${inset}%` }}>
          <CookieArtSvg art={art} seedKey={seedKey} title={title} className="h-full w-full" />
        </div>
      )}
      {dim ? <div className="absolute inset-0 bg-cream/55" /> : null}
    </div>
  )
}
