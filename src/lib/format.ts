import { DAYS, type Hours, type Location } from '../content'

/** Latin digits in the date/price inputs become Persian digits for display. */
export const faNum = (value: string | number) => String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

export const money = (n: number) => (n === 0 ? 'رایگان' : `${n.toLocaleString('fa-IR')} تومان`)

/** "19:30" or 1170 minutes → "۱۹:۳۰". Iran runs a 24-hour clock. */
export function timeLabel(t: string | number) {
  const m = typeof t === 'number' ? t : Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5))
  if (m >= 1440) return '۲۴:۰۰'
  const hh = Math.floor(m / 60) % 24
  const mm = m % 60
  return faNum(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`)
}

export function hoursLabel(day: Hours[number]) {
  return day ? `${timeLabel(day[0])} تا ${timeLabel(day[1])}` : 'تعطیل'
}

export type OpenState = { open: boolean; label: string }

export function openState(loc: Location, now = new Date()): OpenState {
  const day = now.getDay()
  const minutes = now.getHours() * 60 + now.getMinutes()
  const today = loc.hours[day]
  if (today && minutes >= today[0] && minutes < today[1]) return { open: true, label: `باز است تا ${timeLabel(today[1])}` }
  if (today && minutes < today[0]) return { open: false, label: `از ${timeLabel(today[0])} باز می‌شود` }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7
    const next = loc.hours[d]
    if (next) return { open: false, label: i === 1 ? `فردا ${timeLabel(next[0])} باز می‌شود` : `${DAYS[d]} ${timeLabel(next[0])} باز می‌شود` }
  }
  return { open: false, label: 'بسته است' }
}

/** A `tel:` link from a number written with Persian digits. */
export const telHref = (phone: string) => `tel:${phone.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[^\d+]/g, '')}`

/**
 * "2026-11-22" → "یکشنبه ۱ آذر" (Jalali, via the fa-IR locale).
 * Parts are assembled by hand so the order reads naturally in Persian.
 */
export function shortDate(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }) {
  const [y, m, d] = iso.split('-').map(Number)
  const parts = new Intl.DateTimeFormat('fa-IR', {
    weekday: opts.weekday,
    day: opts.day,
    month: opts.month,
    year: opts.year,
  }).formatToParts(new Date(y, m - 1, d))
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? ''
  return [opts.weekday && part('weekday'), opts.day && part('day'), opts.month && part('month'), opts.year && part('year')]
    .filter(Boolean)
    .join(' ')
}

export function longDate(iso: string) {
  return shortDate(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

/** "2026-11-22" → "یکشنبه، آذر". */
export function weekdayMonth(iso: string, weekday: 'long' | 'short' = 'long') {
  return `${shortDate(iso, { weekday })}، ${shortDate(iso, { month: 'long' })}`
}
