import { useId } from 'react'
import { useNavigate } from 'react-router'

import { LOCATIONS, LOCATIONS_COPY, type Location } from '../content'
import { cx } from '../lib/cx'

// A dotted outline of Tehran, drawn from a coarse lon/lat polygon of the city
// boundary. Simple projection: 1100 units per degree, north at the top.
const OUTLINE: [number, number][] = [
  [51.1, 35.74], [51.13, 35.78], [51.19, 35.805], [51.28, 35.83], [51.37, 35.835], [51.44, 35.82], [51.5, 35.79],
  [51.55, 35.75], [51.56, 35.7], [51.5, 35.645], [51.42, 35.6], [51.33, 35.575], [51.25, 35.585], [51.17, 35.62],
  [51.12, 35.67],
]
const project = (lon: number, lat: number) => [(lon - 51.06) * 1100, (35.86 - lat) * 1100] as const
const PATH = `M${OUTLINE.map(([lo, la]) => project(lo, la).join(' ')).join('L')}Z`
const W = 594
const H = 341

// Main arteries, so the drawing reads as a city rather than a blob.
const ROADS = ['M0 190H594', 'M396 0V341']

// Label offsets so the northern branches don't collide.
const LABEL: Record<string, { dx: number; dy: number; anchor: 'start' | 'end' | 'middle' }> = {
  tajrish: { dx: 0, dy: -13, anchor: 'middle' },
  jordan: { dx: 10, dy: 15, anchor: 'start' },
  saadatabad: { dx: -10, dy: 0, anchor: 'end' },
  qeytarieh: { dx: 10, dy: 0, anchor: 'start' },
  karimkhan: { dx: 0, dy: 17, anchor: 'middle' },
  tehranpars: { dx: -9, dy: -12, anchor: 'end' },
}

export function CityMap({
  locations = LOCATIONS,
  active,
  onHover,
  className,
  compact,
}: {
  locations?: Location[]
  active?: string | null
  onHover?: (slug: string | null) => void
  className?: string
  compact?: boolean
}) {
  const id = useId()
  const navigate = useNavigate()
  const shown = new Set(locations.map((l) => l.slug))
  return (
    <svg viewBox={`-16 -12 ${W + 32} ${H + 24}`} role="img" aria-labelledby={`${id}-t`} className={cx('h-auto w-full', className)}>
      <title id={`${id}-t`}>{LOCATIONS_COPY.mapLabel}</title>
      <defs>
        <pattern id={`${id}-dots`} width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1.25" fill="var(--color-line-strong)" />
        </pattern>
        <clipPath id={`${id}-clip`}>
          <path d={PATH} />
        </clipPath>
      </defs>
      <path d={PATH} fill="var(--color-sand)" />
      <rect x="-16" y="-12" width={W + 32} height={H + 24} fill={`url(#${id}-dots)`} clipPath={`url(#${id}-clip)`} />
      <g clipPath={`url(#${id}-clip)`} stroke="var(--color-line-strong)" strokeWidth="1" strokeDasharray="3 6" opacity="0.9">
        {ROADS.map((d) => (
          <path key={d} d={d} fill="none" />
        ))}
      </g>
      <path d={PATH} fill="none" stroke="var(--color-line-strong)" strokeWidth="1.2" />
      {LOCATIONS.map((l) => {
        const [x, y] = project(l.lon, l.lat)
        const on = shown.has(l.slug)
        const isActive = active === l.slug
        const lab = LABEL[l.slug]
        return (
          <g
            key={l.slug}
            className={cx('transition-opacity duration-[var(--duration-base)]', on ? 'cursor-pointer' : 'opacity-25')}
            onMouseEnter={() => onHover?.(l.slug)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => on && navigate(`/locations/${l.slug}`)}
            aria-hidden
          >
            <circle cx={x} cy={y} r={isActive ? 14 : 9} fill="var(--color-ember)" opacity={0.16} className="transition-all duration-[var(--duration-base)]" />
            <circle cx={x} cy={y} r={isActive ? 5.5 : 4} fill={isActive ? 'var(--color-ember)' : 'var(--color-ink)'} className="transition-all duration-[var(--duration-base)]" />
            {!compact && (
              <text
                x={x + lab.dx}
                y={y + lab.dy}
                textAnchor={lab.anchor}
                className="font-sans"
                fontSize="12"
                fontWeight={isActive ? 700 : 500}
                fill="var(--color-ink)"
              >
                {l.name}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
