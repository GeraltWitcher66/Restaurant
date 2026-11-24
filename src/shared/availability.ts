// Demo reservation book. Slots are generated deterministically from the
// location, date and party size, so the browser and the Worker agree without a
// database. Replace `slotsFor` with a call to your booking system (or a D1
// table) when going live.

import type { Hours } from '../content'
import { weekday } from './validation'

export type Slot = { time: string; available: boolean }
export type Availability = { status: 'open'; slots: Slot[] } | { status: 'closed' } | { status: 'full' }

const LAST_SEATING_BEFORE_CLOSE = 90
const STEP = 15

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export const fmtTime = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

export function slotsFor(hours: Hours, location: string, date: string, party: number, nowMinutes?: number): Availability {
  const day = hours[weekday(date)]
  if (!day) return { status: 'closed' }
  // One date in every eleven is fully booked, so the empty state is reachable.
  if (hash(`${location}:${date}`) % 11 === 0) return { status: 'full' }
  const [open, close] = day
  const slots: Slot[] = []
  for (let m = open; m <= close - LAST_SEATING_BEFORE_CLOSE; m += STEP) {
    if (nowMinutes !== undefined && m < nowMinutes + 30) continue
    const roll = hash(`${location}:${date}:${m}`) % 100
    // Larger parties find fewer tables.
    const threshold = 38 + party * 6
    slots.push({ time: fmtTime(m), available: roll >= threshold })
  }
  if (!slots.some((s) => s.available)) return { status: 'full' }
  return { status: 'open', slots }
}
