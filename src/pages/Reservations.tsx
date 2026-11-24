import { CalendarX2, Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'

import { LOCATIONS, RESERVATIONS } from '../content'
import { Button, ButtonLink } from '../components/Button'
import { Segmented } from '../components/Chip'
import { EmptyState, Meta, Notice, PageHeader, Photo, Skeleton, Stepper } from '../components/Display'
import { Checkbox, SelectField, TextArea, TextField } from '../components/Field'
import { ApiError, getJSON } from '../lib/api'
import { useBookings } from '../lib/bookings'
import { cx } from '../lib/cx'
import { faNum, longDate, timeLabel } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useForm } from '../lib/useForm'
import type { Availability } from '../shared/availability'
import { addDaysISO, BOOKING_WINDOW_DAYS, MAX_PARTY, todayISO, validateAvailability, validateReservation, type Errors } from '../shared/validation'

type Values = {
  location: string
  party: number
  date: string
  time: string
  seating: string
  name: string
  email: string
  phone: string
  occasion: string
  notes: string
  policy: boolean
}

export function Reservations() {
  useDocumentTitle(RESERVATIONS.title)
  const [params] = useSearchParams()
  const { add } = useBookings()
  const today = todayISO()
  const preset = LOCATIONS.some((l) => l.slug === params.get('location')) ? params.get('location')! : LOCATIONS[0].slug
  const initial: Values = {
    location: preset,
    party: 2,
    date: addDaysISO(today, 1),
    time: '',
    seating: 'dining',
    name: '',
    email: '',
    phone: '',
    occasion: RESERVATIONS.occasions[0],
    notes: '',
    policy: false,
  }
  const form = useForm<Values, { reference: string }>(initial, '/api/reservations', (v) => validateReservation(v, todayISO()))
  const [step, setStep] = useState(0)
  const [book, setBook] = useState<Availability | null>(null)
  const [loading, setLoading] = useState(false)
  const [stepErrors, setStepErrors] = useState<Errors>({})
  const [loadError, setLoadError] = useState('')
  const [conflict, setConflict] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const v = form.values
  const loc = LOCATIONS.find((l) => l.slug === v.location)!

  const goto = (n: number) => {
    setStep(n)
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ block: 'start' })
      topRef.current?.querySelector<HTMLElement>('[data-step-heading]')?.focus()
    })
  }

  const findTimes = async () => {
    const errs = validateAvailability(v, todayISO())
    setStepErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    setLoadError('')
    setBook(null)
    goto(1)
    try {
      const now = new Date()
      const after = v.date === todayISO() ? `&after=${now.getHours() * 60 + now.getMinutes()}` : ''
      const res = await getJSON<Availability>(`/api/availability?location=${v.location}&date=${v.date}&party=${v.party}${after}`)
      setBook(res)
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : RESERVATIONS.genericError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (form.status === 'error' && Object.keys(form.errors).includes('time')) {
      // The time was taken (409) or became invalid: go back and refresh the book.
      setConflict(true)
      form.set('time', '')
      void findTimes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.status, form.errors])

  const submit = async () => {
    setConflict(false)
    const res = await form.submit()
    if (res) {
      add({
        reference: res.reference,
        kind: 'table',
        location: v.location,
        date: v.date,
        time: v.time,
        party: v.party,
        name: v.name.trim(),
        email: v.email.trim(),
        seating: v.seating,
        occasion: v.occasion,
        createdAt: Date.now(),
        status: 'confirmed',
      })
      requestAnimationFrame(() => topRef.current?.scrollIntoView({ block: 'start' }))
    }
  }

  if (form.status === 'success' && form.result) {
    return (
      <>
        <PageHeader title={RESERVATIONS.confirmed.title} aside={`(${form.result.reference})`} intro={RESERVATIONS.confirmed.body} />
        <div ref={topRef} className="container-page">
          <div className="mx-auto max-w-3xl rounded-[var(--radius-md)] border p-6 md:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <Meta label={RESERVATIONS.confirmed.reference} value={form.result.reference} />
              <Meta label={RESERVATIONS.location} value={`${loc.name}، ${loc.city}`} sub={loc.address} />
              <Meta label={RESERVATIONS.date} value={longDate(v.date)} sub={timeLabel(v.time)} />
              <Meta label={RESERVATIONS.party} value={`${faNum(v.party)} مهمان`} sub={RESERVATIONS.seatingOptions.find((s) => s.value === v.seating)?.label} />
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/bookings" arrow>
                {RESERVATIONS.confirmed.manage}
              </ButtonLink>
              <Button
                variant="secondary"
                onClick={() => {
                  form.reset({ ...initial, name: v.name, email: v.email, phone: v.phone })
                  setBook(null)
                  setStep(0)
                }}
              >
                {RESERVATIONS.confirmed.another}
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const err = (k: string) => stepErrors[k] ?? form.errors[k]

  return (
    <>
      <PageHeader title={RESERVATIONS.title} aside={RESERVATIONS.aside} intro={RESERVATIONS.intro} />
      <div ref={topRef} className="container-page grid scroll-mt-28 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Stepper steps={RESERVATIONS.steps} current={step} />
          <form
            noValidate
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault()
              if (step === 0) void findTimes()
              else if (step === 1) {
                if (!v.time) setStepErrors({ time: 'یک ساعت انتخاب کنید.' })
                else goto(2)
              } else void submit()
            }}
          >
            {step === 0 && (
              <fieldset className="space-y-6">
                <legend data-step-heading tabIndex={-1} className="font-display mb-6 text-[2.25rem] focus:outline-none">
                  {RESERVATIONS.steps[0]}
                </legend>
                <SelectField
                  label={RESERVATIONS.location}
                  name="location"
                  value={v.location}
                  error={err('location')}
                  onChange={(e) => form.set('location', e.target.value)}
                  options={LOCATIONS.map((l) => ({ value: l.slug, label: l.name }))}
                />
                <div data-field="party" className="flex flex-col gap-1.5">
                  <span id="party-label" className="text-sm font-medium">
                    {RESERVATIONS.party}
                  </span>
                  <Segmented
                    label={RESERVATIONS.party}
                    name="party"
                    value={String(v.party)}
                    onChange={(p) => form.set('party', Number(p))}
                    options={Array.from({ length: MAX_PARTY }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))}
                  />
                  <p className="text-[0.8125rem] text-muted">
                    بیش از {faNum(MAX_PARTY)} نفر؟ <Link to="/events#private-dining" className="font-medium text-ink underline underline-offset-2">مهمانی خصوصی</Link> را انتخاب کنید.
                  </p>
                </div>
                <TextField
                  label={RESERVATIONS.date}
                  name="date"
                  type="date"
                  min={today}
                  max={addDaysISO(today, BOOKING_WINDOW_DAYS)}
                  value={v.date}
                  error={err('date')}
                  onChange={(e) => {
                    form.set('date', e.target.value)
                    setStepErrors({})
                  }}
                  className="sm:max-w-xs"
                />
                <Button type="submit" size="lg" arrow>
                  {RESERVATIONS.findTimes}
                </Button>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset>
                <legend data-step-heading tabIndex={-1} className="font-display mb-2 text-[2.25rem] focus:outline-none">
                  {RESERVATIONS.timesTitle}
                </legend>
                <p className="mb-6 text-[0.9375rem] text-muted">
                  {loc.name}، {longDate(v.date)}، {faNum(v.party)} مهمان
                </p>
                {conflict && (
                  <Notice tone="error" className="mb-6">
                    {RESERVATIONS.conflict}
                  </Notice>
                )}
                {loading && (
                  <div aria-busy="true" aria-live="polite">
                    <span className="sr-only">{RESERVATIONS.loadingTimes}</span>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {Array.from({ length: 10 }, (_, i) => (
                        <Skeleton key={i} className="h-11" />
                      ))}
                    </div>
                  </div>
                )}
                {loadError && (
                  <Notice tone="error">
                    {loadError}{' '}
                    <button type="button" onClick={findTimes} className="font-medium underline">
                      تلاش دوباره
                    </button>
                  </Notice>
                )}
                {book?.status === 'closed' && <EmptyState icon={CalendarX2} title={RESERVATIONS.closed.title} body={RESERVATIONS.closed.body} />}
                {book?.status === 'full' && <EmptyState icon={CalendarX2} title={RESERVATIONS.noTimes.title} body={RESERVATIONS.noTimes.body} />}
                {book?.status === 'open' && (
                  <div className="space-y-8">
                    <div data-field="time">
                      <div role="radiogroup" aria-label={RESERVATIONS.timesTitle} className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {book.slots.map((s) => {
                          const checked = v.time === s.time
                          return (
                            <button
                              key={s.time}
                              type="button"
                              role="radio"
                              aria-checked={checked}
                              disabled={!s.available}
                              aria-label={`${timeLabel(s.time)}${s.available ? '' : '، ناموجود'}`}
                              onClick={() => {
                                form.set('time', s.time)
                                setStepErrors({})
                              }}
                              className={cx(
                                'inline-flex h-11 items-center justify-center gap-1 rounded-[var(--radius-sm)] border text-sm font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:cursor-not-allowed disabled:border-line disabled:bg-sand disabled:text-faint disabled:line-through',
                                checked ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink',
                              )}
                            >
                              {checked && <Check aria-hidden className="size-3.5" />}
                              {timeLabel(s.time)}
                            </button>
                          )
                        })}
                      </div>
                      {err('time') && <p className="mt-2 text-[0.8125rem] font-medium text-danger">{err('time')}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium">{RESERVATIONS.seating}</span>
                      <Segmented
                        label={RESERVATIONS.seating}
                        name="seating"
                        value={v.seating}
                        onChange={(s) => form.set('seating', s)}
                        options={RESERVATIONS.seatingOptions}
                      />
                    </div>
                  </div>
                )}
                <div className="mt-10 flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => goto(0)}>
                    {RESERVATIONS.back}
                  </Button>
                  {book?.status === 'open' && (
                    <Button type="submit" arrow>
                      {RESERVATIONS.next}
                    </Button>
                  )}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="space-y-6">
                <legend data-step-heading tabIndex={-1} className="font-display mb-6 text-[2.25rem] focus:outline-none">
                  {RESERVATIONS.steps[2]}
                </legend>
                {form.status === 'error' && form.message && <Notice tone="error">{form.message}</Notice>}
                <TextField label={RESERVATIONS.name} name="name" autoComplete="name" value={v.name} error={form.errors.name} onChange={(e) => form.set('name', e.target.value)} />
                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField label={RESERVATIONS.email} name="email" type="email" autoComplete="email" value={v.email} error={form.errors.email} onChange={(e) => form.set('email', e.target.value)} />
                  <TextField label={RESERVATIONS.phone} name="phone" type="tel" autoComplete="tel" value={v.phone} error={form.errors.phone} onChange={(e) => form.set('phone', e.target.value)} />
                </div>
                <SelectField
                  label={RESERVATIONS.occasion}
                  name="occasion"
                  value={v.occasion}
                  onChange={(e) => form.set('occasion', e.target.value)}
                  options={RESERVATIONS.occasions.map((o) => ({ value: o, label: o }))}
                  className="sm:max-w-xs"
                />
                <TextArea
                  label={RESERVATIONS.notes}
                  name="notes"
                  hint={RESERVATIONS.notesHint}
                  maxLength={300}
                  value={v.notes}
                  error={form.errors.notes}
                  onChange={(e) => form.set('notes', e.target.value)}
                />
                <Checkbox name="policy" label={RESERVATIONS.policy} checked={v.policy} error={form.errors.policy} onChange={(c) => form.set('policy', c)} />
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button variant="secondary" onClick={() => goto(1)}>
                    {RESERVATIONS.back}
                  </Button>
                  <Button type="submit" size="lg" loading={form.status === 'submitting'}>
                    {RESERVATIONS.submit}
                  </Button>
                </div>
              </fieldset>
            )}
          </form>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="sticky top-28 space-y-5">
            <Photo photo={loc.photo} alt={`سالن غذاخوری شعبهٔ ${loc.name}`} ratio="4 / 3" />
            <div className="grid grid-cols-2 gap-5">
              <Meta label={RESERVATIONS.location} value={loc.name} sub={loc.address} to={`/locations/${loc.slug}`} />
              <Meta label={RESERVATIONS.date} value={v.date ? longDate(v.date) : '—'} sub={v.time ? timeLabel(v.time) : undefined} />
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
