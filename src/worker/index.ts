import { Hono, type Context } from 'hono'

import { EVENTS, LOCATIONS } from '../content'
import { slotsFor } from '../shared/availability'
import {
  addDaysISO,
  todayISO,
  validateApplication,
  validateAvailability,
  validateContact,
  validateEnquiry,
  validateEventBooking,
  validateGiftCard,
  validateReservation,
  validateSubscribe,
  type Errors,
} from '../shared/validation'

// The Worker in front of the static site. Every form posts here and is
// validated with the same rules the browser uses (src/shared/validation.ts).
// Nothing is stored server-side yet: wire each route to email, a booking
// system or a D1 table when going live. Everything else falls through to the
// built assets (single-page-application mode).
type Env = { ASSETS: Fetcher }

const app = new Hono<{ Bindings: Env }>()

const reference = (prefix: string) => `${prefix}-${crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()}`

/** Reads a JSON object body, or returns null for anything else. */
async function readJson(c: Context): Promise<Record<string, unknown> | null> {
  if (!c.req.header('content-type')?.includes('application/json')) return null
  const body = await c.req.json().catch(() => null)
  return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null
}

const invalid = (c: Context, errors: Errors) => c.json({ error: 'فیلدهای مشخص‌شده را بررسی کنید.', errors }, 400)
const badBody = (c: Context) => c.json({ error: 'بدنهٔ JSON بفرستید.' }, 400)

/** The client's local date, so "today" matches the guest's calendar rather than UTC. */
function clientToday(c: Context) {
  const t = c.req.header('x-client-date') ?? ''
  const server = todayISO()
  // Accept the client's date only within a day of the server's.
  return /^\d{4}-\d{2}-\d{2}$/.test(t) && t >= addDaysISO(server, -1) && t <= addDaysISO(server, 1) ? t : server
}

app.get('/api/health', (c) => c.json({ ok: true }))

app.get('/api/availability', (c) => {
  const q = { location: c.req.query('location'), date: c.req.query('date'), party: c.req.query('party') }
  const errors = validateAvailability(q, clientToday(c))
  if (Object.keys(errors).length) return invalid(c, errors)
  const loc = LOCATIONS.find((l) => l.slug === q.location)!
  const after = Number(c.req.query('after'))
  const nowMinutes = Number.isInteger(after) && after >= 0 && after < 1440 ? after : undefined
  return c.json(slotsFor(loc.hours, loc.slug, q.date!, Number(q.party), nowMinutes))
})

app.post('/api/reservations', async (c) => {
  const body = await readJson(c)
  if (!body) return badBody(c)
  const errors = validateReservation(body, clientToday(c))
  if (Object.keys(errors).length) return invalid(c, errors)
  const loc = LOCATIONS.find((l) => l.slug === body.location)!
  const book = slotsFor(loc.hours, loc.slug, String(body.date), Number(body.party))
  const slot = book.status === 'open' ? book.slots.find((s) => s.time === body.time) : undefined
  if (!slot?.available) return c.json({ error: 'این ساعت دیگر خالی نیست.', errors: { time: 'ساعت دیگری انتخاب کنید.' } }, 409)
  return c.json({ ok: true, reference: reference('AN') }, 201)
})

app.post('/api/event-bookings', async (c) => {
  const body = await readJson(c)
  if (!body) return badBody(c)
  const errors = validateEventBooking(body)
  if (Object.keys(errors).length) return invalid(c, errors)
  const event = EVENTS.find((e) => e.id === body.event)
  if (!event) return invalid(c, { event: 'این رویداد وجود ندارد.' })
  if (Number(body.seats) > event.seatsLeft) return c.json({ error: event.seatsLeft ? `فقط ${event.seatsLeft.toLocaleString('fa-IR')} صندلی مانده است.` : 'این رویداد تکمیل شده.', errors: { seats: 'صندلی کمتری انتخاب کنید.' } }, 409)
  return c.json({ ok: true, reference: reference('EV'), total: event.price * Number(body.seats) }, 201)
})

app.post('/api/private-dining', async (c) => {
  const body = await readJson(c)
  if (!body) return badBody(c)
  const errors = validateEnquiry(body, clientToday(c))
  if (Object.keys(errors).length) return invalid(c, errors)
  return c.json({ ok: true, reference: reference('PD') }, 201)
})

app.post('/api/gift-cards', async (c) => {
  const body = await readJson(c)
  if (!body) return badBody(c)
  const errors = validateGiftCard(body, clientToday(c))
  if (Object.keys(errors).length) return invalid(c, errors)
  const code = Array.from({ length: 3 }, () => crypto.randomUUID().slice(0, 4).toUpperCase()).join('-')
  return c.json({ ok: true, code }, 201)
})

app.post('/api/applications', async (c) => {
  const body = await readJson(c)
  if (!body) return badBody(c)
  const errors = validateApplication(body)
  if (Object.keys(errors).length) return invalid(c, errors)
  return c.json({ ok: true, reference: reference('JB') }, 201)
})

app.post('/api/contact', async (c) => {
  const body = await readJson(c)
  if (!body) return badBody(c)
  const errors = validateContact(body)
  if (Object.keys(errors).length) return invalid(c, errors)
  return c.json({ ok: true }, 201)
})

app.post('/api/subscribe', async (c) => {
  const body = await readJson(c)
  if (!body) return badBody(c)
  const errors = validateSubscribe(body)
  if (Object.keys(errors).length) return invalid(c, errors)
  return c.json({ ok: true })
})

app.all('/api/*', (c) => c.json({ error: 'پیدا نشد' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
