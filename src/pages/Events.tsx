import { CalendarX2, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

import { EVENTS, EVENTS_COPY, LOCATIONS, PRIVATE_DINING, type EventItem } from '../content'
import { Button, ButtonLink } from '../components/Button'
import { EventCard } from '../components/Cards'
import { Chip, Segmented } from '../components/Chip'
import { EmptyState, Notice, PageHeader, Photo } from '../components/Display'
import { SelectField, TextArea, TextField } from '../components/Field'
import { Modal } from '../components/Overlay'
import { useBookings } from '../lib/bookings'
import { longDate, money, timeLabel } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useForm } from '../lib/useForm'
import { addDaysISO, todayISO, validateEnquiry, validateEventBooking } from '../shared/validation'

function BookEvent({ event, onClose }: { event: EventItem; onClose: () => void }) {
  const { add } = useBookings()
  const max = Math.min(8, event.seatsLeft)
  const form = useForm<{ event: string; seats: number; name: string; email: string }, { reference: string; total: number }>(
    { event: event.id, seats: Math.min(2, max), name: '', email: '' },
    '/api/event-bookings',
    validateEventBooking,
  )
  const loc = LOCATIONS.find((l) => l.slug === event.location)!
  if (form.status === 'success' && form.result)
    return (
      <div role="status">
        <CheckCircle2 aria-hidden className="size-8 text-success" />
        <p className="font-display mt-3 text-3xl">{EVENTS_COPY.modal.done}</p>
        <p className="mt-1 text-[0.9375rem] text-muted">
          {EVENTS_COPY.modal.doneBody} کد پیگیری: <strong className="text-ink">{form.result.reference}</strong>
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <ButtonLink to="/bookings" variant="secondary">
            رزروهای من
          </ButtonLink>
          <Button onClick={onClose}>بستن</Button>
        </div>
      </div>
    )
  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault()
        const res = await form.submit()
        if (res)
          add({
            reference: res.reference,
            kind: 'event',
            title: event.title,
            location: event.location,
            date: event.date,
            time: event.time,
            party: form.values.seats,
            name: form.values.name.trim(),
            email: form.values.email.trim(),
            total: res.total,
            createdAt: Date.now(),
            status: 'confirmed',
          })
      }}
    >
      <p className="text-[0.9375rem] text-ink-2">
        {longDate(event.date)}، ساعت {timeLabel(event.time)}، {loc.name}
      </p>
      {form.status === 'error' && form.message && <Notice tone="error">{form.message}</Notice>}
      <div data-field="seats" className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">{EVENTS_COPY.modal.seats}</span>
        <Segmented
          label={EVENTS_COPY.modal.seats}
          name="seats"
          value={String(form.values.seats)}
          onChange={(s) => form.set('seats', Number(s))}
          options={Array.from({ length: max }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))}
        />
        {form.errors.seats && <p className="text-[0.8125rem] font-medium text-danger">{form.errors.seats}</p>}
      </div>
      <TextField label={EVENTS_COPY.modal.name} name="name" autoComplete="name" value={form.values.name} error={form.errors.name} onChange={(e) => form.set('name', e.target.value)} data-autofocus />
      <TextField label={EVENTS_COPY.modal.email} name="email" type="email" autoComplete="email" value={form.values.email} error={form.errors.email} onChange={(e) => form.set('email', e.target.value)} />
      <div className="flex items-baseline justify-between border-t pt-4">
        <span className="text-sm text-muted">{EVENTS_COPY.modal.total}</span>
        <span className="text-xl font-semibold tabular-nums">{money(event.price * form.values.seats)}</span>
      </div>
      {event.price > 0 && <p className="text-[0.8125rem] text-muted">{EVENTS_COPY.modal.note}</p>}
      <Button type="submit" className="w-full" size="lg" loading={form.status === 'submitting'}>
        {EVENTS_COPY.modal.submit}
      </Button>
    </form>
  )
}

function PrivateDiningForm() {
  const today = todayISO()
  const form = useForm<Record<string, unknown> & { location: string; date: string; guests: string; format: string; budget: string; name: string; email: string; company: string; message: string }, { reference: string }>(
    { location: 'jordan', date: addDaysISO(today, 30), guests: '20', format: PRIVATE_DINING.formats[0], budget: PRIVATE_DINING.budgets[1], name: '', email: '', company: '', message: '' },
    '/api/private-dining',
    (v) => validateEnquiry(v, todayISO()),
  )
  const v = form.values
  if (form.status === 'success' && form.result)
    return (
      <div role="status" className="rounded-[var(--radius-md)] border p-8">
        <CheckCircle2 aria-hidden className="size-8 text-success" />
        <p className="font-display mt-3 text-[2.25rem]">{PRIVATE_DINING.done.title}</p>
        <p className="mt-2 text-[0.9375rem] text-muted">
          {PRIVATE_DINING.done.body} <strong className="text-ink">{form.result.reference}</strong>.
        </p>
                  <Button variant="secondary" className="mt-6" onClick={() => form.reset()}>
            ارسال درخواست دیگر
          </Button>
      </div>
    )
  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        void form.submit()
      }}
    >
      {form.status === 'error' && form.message && <Notice tone="error">{form.message}</Notice>}
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          label={PRIVATE_DINING.location}
          name="location"
          value={v.location}
          error={form.errors.location}
          onChange={(e) => form.set('location', e.target.value)}
          options={LOCATIONS.map((l) => ({ value: l.slug, label: `${l.name}${l.privateRoom ? `، ${l.privateRoom.name} (تا ${l.privateRoom.seated} نفر نشسته)` : '، اجارهٔ کامل سالن'}` }))}
        />
        <TextField label={PRIVATE_DINING.date} name="date" type="date" min={today} value={v.date} error={form.errors.date} onChange={(e) => form.set('date', e.target.value)} />
        <TextField label={PRIVATE_DINING.guests} name="guests" type="number" inputMode="numeric" min={8} max={200} value={v.guests} error={form.errors.guests} onChange={(e) => form.set('guests', e.target.value)} />
        <SelectField label={PRIVATE_DINING.format} name="format" value={v.format} error={form.errors.format} onChange={(e) => form.set('format', e.target.value)} options={PRIVATE_DINING.formats.map((f) => ({ value: f, label: f }))} />
        <SelectField label={PRIVATE_DINING.budget} name="budget" value={v.budget} onChange={(e) => form.set('budget', e.target.value)} options={PRIVATE_DINING.budgets.map((f) => ({ value: f, label: f }))} />
        <TextField label={PRIVATE_DINING.company} name="company" autoComplete="organization" value={v.company} error={form.errors.company} onChange={(e) => form.set('company', e.target.value)} />
        <TextField label={PRIVATE_DINING.name} name="name" autoComplete="name" value={v.name} error={form.errors.name} onChange={(e) => form.set('name', e.target.value)} />
        <TextField label={PRIVATE_DINING.email} name="email" type="email" autoComplete="email" value={v.email} error={form.errors.email} onChange={(e) => form.set('email', e.target.value)} />
      </div>
      <TextArea label={PRIVATE_DINING.message} name="message" maxLength={1000} value={v.message} error={form.errors.message} onChange={(e) => form.set('message', e.target.value)} />
      <Button type="submit" size="lg" arrow loading={form.status === 'submitting'}>
        {PRIVATE_DINING.submit}
      </Button>
    </form>
  )
}

export function Events() {
  useDocumentTitle(EVENTS_COPY.title)
  const [where, setWhere] = useState<string | null>(null)
  const [booking, setBooking] = useState<EventItem | null>(null)
  const list = EVENTS.filter((e) => !where || e.location === where)
  return (
    <>
      <PageHeader title={EVENTS_COPY.title} aside={EVENTS_COPY.aside} intro={EVENTS_COPY.intro} />
      <div className="container-page">
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-6 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="فیلتر بر اساس شعبه">
          <Chip pressed={where === null} onClick={() => setWhere(null)}>
            {EVENTS_COPY.filterAll}
          </Chip>
          {LOCATIONS.map((l) => (
            <Chip key={l.slug} pressed={where === l.slug} onClick={() => setWhere(where === l.slug ? null : l.slug)}>
              {l.name}
            </Chip>
          ))}
        </div>
        {list.length ? (
          <div className="border-b">
            {list.map((e) => (
              <EventCard key={e.id} event={e} onBook={setBooking} />
            ))}
          </div>
        ) : (
          <EmptyState icon={CalendarX2} title={EVENTS_COPY.empty.title} body={EVENTS_COPY.empty.body} />
        )}
      </div>

      <section id="private-dining" aria-labelledby="pd" className="container-page mt-24 grid gap-12 md:mt-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="pd" className="font-display text-display">
            {PRIVATE_DINING.title}
          </h2>
          <p className="mt-5 max-w-md text-[1.0625rem] text-muted">{PRIVATE_DINING.intro}</p>
          <Photo photo="privateRoom" alt="میز بلند چیده‌شده برای یک شام خصوصی" ratio="4 / 3" className="mt-8" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
          <PrivateDiningForm />
        </div>
      </section>

      <Modal open={!!booking} onClose={() => setBooking(null)} title={booking?.title ?? EVENTS_COPY.modal.title}>
        {booking && <BookEvent event={booking} onClose={() => setBooking(null)} />}
      </Modal>
    </>
  )
}
