import { CalendarDays } from 'lucide-react'
import { useState } from 'react'

import { BOOKINGS, LOCATIONS, RESERVATIONS } from '../content'
import { Button, ButtonLink } from '../components/Button'
import { Badge, EmptyState, PageHeader } from '../components/Display'
import { Modal, useToast } from '../components/Overlay'
import { useBookings, type Booking } from '../lib/bookings'
import { cx } from '../lib/cx'
import { faNum, longDate, money, timeLabel } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { todayISO } from '../shared/validation'

function BookingRow({ b, onCancel }: { b: Booking; onCancel?: (b: Booking) => void }) {
  const loc = LOCATIONS.find((l) => l.slug === b.location)
  const cancelled = b.status === 'cancelled'
  return (
    <li className={cx('grid gap-4 border-t py-6 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center md:gap-8', cancelled && 'text-faint')}>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={b.kind === 'event' ? 'ember' : 'neutral'}>{b.kind === 'event' ? 'رویداد' : 'میز'}</Badge>
          {cancelled && <Badge tone="danger">{BOOKINGS.cancelled}</Badge>}
        </div>
        <p className={cx('font-display mt-2 text-[1.75rem] leading-tight', cancelled && 'line-through')}>{b.title ?? `${loc?.name ?? b.location}`}</p>
        <p className="text-sm text-muted">کد رزرو: {b.reference}</p>
      </div>
      <div className="text-[0.9375rem]">
        <p className="font-medium">{longDate(b.date)}</p>
        <p className="text-muted">ساعت {timeLabel(b.time)}</p>
      </div>
      <div className="text-[0.9375rem]">
        <p className="font-medium">
          {faNum(b.party)} {b.kind === 'event' ? 'صندلی' : 'مهمان'}
        </p>
        <p className="text-muted">
          {b.kind === 'event' && b.total !== undefined ? money(b.total) : RESERVATIONS.seatingOptions.find((s) => s.value === b.seating)?.label}
          {loc && b.kind === 'event' ? `، ${loc.name}` : ''}
        </p>
      </div>
      {onCancel && !cancelled ? (
        <Button variant="secondary" size="sm" onClick={() => onCancel(b)} aria-label={`${BOOKINGS.cancel} ${b.reference}`}>
          {BOOKINGS.cancel}
        </Button>
      ) : (
        <span />
      )}
    </li>
  )
}

export function Bookings() {
  useDocumentTitle(BOOKINGS.title)
  const { bookings, cancel } = useBookings()
  const toast = useToast()
  const [pending, setPending] = useState<Booking | null>(null)
  const today = todayISO()
  const upcoming = bookings.filter((b) => b.status === 'confirmed' && b.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const past = bookings.filter((b) => !upcoming.includes(b))

  return (
    <>
      <PageHeader title={BOOKINGS.title} aside={BOOKINGS.aside} intro={BOOKINGS.intro} />
      <div className="container-page">
        {bookings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={BOOKINGS.empty.title}
            body={BOOKINGS.empty.body}
            action={
              <ButtonLink to="/reservations" arrow>
                {BOOKINGS.empty.cta}
              </ButtonLink>
            }
          />
        ) : (
          <>
            <section aria-labelledby="up">
              <h2 id="up" className="font-display text-[2.5rem]">
                {BOOKINGS.upcoming} <span className="text-[0.55em] font-normal text-muted italic">({upcoming.length})</span>
              </h2>
              {upcoming.length ? (
                <ul className="mt-4 border-b">
                  {upcoming.map((b) => (
                    <BookingRow key={b.reference} b={b} onCancel={setPending} />
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-muted">رزروی در پیش رو نیست.</p>
              )}
            </section>
            {past.length > 0 && (
              <section aria-labelledby="past" className="mt-16">
                <h2 id="past" className="font-display text-[2.5rem]">
                  {BOOKINGS.past}
                </h2>
                <ul className="mt-4 border-b">
                  {past.map((b) => (
                    <BookingRow key={b.reference} b={b} />
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
      <Modal open={!!pending} onClose={() => setPending(null)} title={BOOKINGS.cancelTitle} description={BOOKINGS.cancelBody}>
        {pending && (
          <p className="mb-6 text-[0.9375rem]">
            <strong>{pending.title ?? LOCATIONS.find((l) => l.slug === pending.location)?.name}</strong>، {longDate(pending.date)}، ساعت {timeLabel(pending.time)}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={() => setPending(null)} data-autofocus>
            {BOOKINGS.keep}
          </Button>
          <Button
            variant="ember"
            onClick={() => {
              if (pending) cancel(pending.reference)
              setPending(null)
              toast(BOOKINGS.cancelledToast)
            }}
          >
            {BOOKINGS.confirmCancel}
          </Button>
        </div>
      </Modal>
    </>
  )
}
