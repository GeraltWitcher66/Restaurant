import { EVENTS, LOCATIONS } from '../content'
import { slotsFor } from '../shared/availability'
import {
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

// Browsers-only fallback for static hosting (GitHub Pages), where no Worker is
// running. It mirrors src/worker/index.ts route for route: same validators,
// same demo slot book, same response shapes, so the forms behave identically.
// Nothing is stored: wire the real routes when the site has a server.

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

const invalid = (errors: Errors) => json({ error: 'فیلدهای مشخص‌شده را بررسی کنید.', errors }, 400)

const reference = (prefix: string) => `${prefix}-${crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()}`

export async function staticFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  const url = new URL(raw, window.location.origin)
  const method = (init.method ?? 'GET').toUpperCase()
  const body: Record<string, unknown> =
    typeof init.body === 'string' ? ((JSON.parse(init.body) as Record<string, unknown>) ?? {}) : {}
  const today = todayISO()

  if (url.pathname === '/api/health') return json({ ok: true })

  if (method === 'GET' && url.pathname === '/api/availability') {
    const q = {
      location: url.searchParams.get('location') ?? '',
      date: url.searchParams.get('date') ?? '',
      party: url.searchParams.get('party') ?? '',
    }
    const errors = validateAvailability(q, today)
    if (Object.keys(errors).length) return invalid(errors)
    const loc = LOCATIONS.find((l) => l.slug === q.location)!
    const after = Number(url.searchParams.get('after'))
    const nowMinutes = Number.isInteger(after) && after >= 0 && after < 1440 ? after : undefined
    return json(slotsFor(loc.hours, loc.slug, q.date, Number(q.party), nowMinutes))
  }

  if (method !== 'POST') return json({ error: 'پیدا نشد' }, 404)

  switch (url.pathname) {
    case '/api/reservations': {
      const errors = validateReservation(body, today)
      if (Object.keys(errors).length) return invalid(errors)
      const loc = LOCATIONS.find((l) => l.slug === body.location)!
      const book = slotsFor(loc.hours, loc.slug, String(body.date), Number(body.party))
      const slot = book.status === 'open' ? book.slots.find((s) => s.time === body.time) : undefined
      if (!slot?.available) return json({ error: 'این ساعت دیگر خالی نیست.', errors: { time: 'ساعت دیگری انتخاب کنید.' } }, 409)
      return json({ ok: true, reference: reference('AN') }, 201)
    }
    case '/api/event-bookings': {
      const errors = validateEventBooking(body)
      if (Object.keys(errors).length) return invalid(errors)
      const event = EVENTS.find((e) => e.id === body.event)
      if (!event) return invalid({ event: 'این رویداد وجود ندارد.' })
      if (Number(body.seats) > event.seatsLeft)
        return json(
          {
            error: event.seatsLeft ? `فقط ${event.seatsLeft.toLocaleString('fa-IR')} صندلی مانده است.` : 'این رویداد تکمیل شده.',
            errors: { seats: 'صندلی کمتری انتخاب کنید.' },
          },
          409,
        )
      return json({ ok: true, reference: reference('EV'), total: event.price * Number(body.seats) }, 201)
    }
    case '/api/private-dining': {
      const errors = validateEnquiry(body, today)
      if (Object.keys(errors).length) return invalid(errors)
      return json({ ok: true, reference: reference('PD') }, 201)
    }
    case '/api/gift-cards': {
      const errors = validateGiftCard(body, today)
      if (Object.keys(errors).length) return invalid(errors)
      const code = Array.from({ length: 3 }, () => crypto.randomUUID().slice(0, 4).toUpperCase()).join('-')
      return json({ ok: true, code }, 201)
    }
    case '/api/applications': {
      const errors = validateApplication(body)
      if (Object.keys(errors).length) return invalid(errors)
      return json({ ok: true, reference: reference('JB') }, 201)
    }
    case '/api/contact': {
      const errors = validateContact(body)
      if (Object.keys(errors).length) return invalid(errors)
      return json({ ok: true }, 201)
    }
    case '/api/subscribe': {
      const errors = validateSubscribe(body)
      if (Object.keys(errors).length) return invalid(errors)
      return json({ ok: true })
    }
    default:
      return json({ error: 'پیدا نشد' }, 404)
  }
}

