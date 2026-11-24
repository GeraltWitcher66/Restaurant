import { Phone } from 'lucide-react'
import { useParams } from 'react-router'

import { COMMON, DAYS, EVENTS, LOCATIONS, NOT_FOUND } from '../content'
import { ArrowLink, ButtonLink, buttonClass } from '../components/Button'
import { LocationCard } from '../components/Cards'
import { CityMap } from '../components/CityMap'
import { Badge, Meta, OpenDot, Photo, Reveal, SectionHeading } from '../components/Display'
import { cx } from '../lib/cx'
import { faNum, hoursLabel, money, openState, shortDate, telHref } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { NotFound } from './NotFound'

export function LocationPage() {
  const { slug } = useParams()
  const loc = LOCATIONS.find((l) => l.slug === slug)
  useDocumentTitle(loc ? `${loc.name}، ${loc.city}` : NOT_FOUND.title)
  if (!loc) return <NotFound />
  const state = openState(loc)
  const today = new Date().getDay()
  const events = EVENTS.filter((e) => e.location === loc.slug)
  const others = LOCATIONS.filter((l) => l.slug !== loc.slug).slice(0, 3)
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.address}, ${loc.postcode}`)}`

  return (
    <>
      <section className="container-page">
        <h1 className="font-display pt-10 text-center text-wordmark md:pt-[58px]">
          <span className="block animate-rise">{loc.name}</span>
          <span className="mt-[0.06em] block animate-rise font-normal italic [animation-delay:120ms] [font-feature-settings:'onum'_1]" style={{ fontWeight: 400 }}>
            ({loc.opened})
          </span>
        </h1>
        <div className="mt-10 grid animate-fade-up grid-cols-2 gap-6 [animation-delay:300ms] md:mt-[62px] md:grid-cols-[52fr_30fr_18fr] md:gap-0">
          <Meta label="منطقه" value={`${loc.region}، ${loc.city}`} />
          <Meta label="نشانی" value={loc.address} sub={loc.postcode} />
          <Meta label="سرآشپز" value={loc.chef} />
        </div>
        <Photo photo={loc.photo} alt={`سالن غذاخوری شعبهٔ ${loc.name}`} priority imgClassName="animate-settle" className="mt-5 aspect-[4/3] md:mt-[14px] md:aspect-[1380/640]" />
      </section>

      <section className="container-page mt-16 grid gap-12 md:mt-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="font-display text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] leading-[1.15]" style={{ fontWeight: 400 }}>
            {loc.blurb}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink to={`/reservations?location=${loc.slug}`} arrow size="lg">
              {COMMON.reserveHere}
            </ButtonLink>
            <a href={telHref(loc.phone)} className={buttonClass('secondary', 'lg')}>
              <Phone aria-hidden className="size-4" /> {loc.phone}
            </a>
          </div>
          <h2 className="mt-14 text-sm font-medium">{COMMON.features}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {loc.features.map((f) => (
              <li key={f}>
                <Badge tone="outline" className="h-8 px-3 text-sm">
                  {f}
                </Badge>
              </li>
            ))}
          </ul>
          {loc.privateRoom && (
            <div className="mt-10 rounded-[var(--radius-md)] bg-sand p-6">
              <p className="label">{COMMON.privateRoom}</p>
              <p className="font-display mt-1 text-3xl">{loc.privateRoom.name}</p>
              <p className="mt-1 text-[0.9375rem] text-muted">
                {faNum(loc.privateRoom.seated)} نفر نشسته، {faNum(loc.privateRoom.standing)} نفر ایستاده
              </p>
              <ArrowLink to="/events#private-dining" className="mt-3">
                برنامه‌ریزی مهمانی
              </ArrowLink>
            </div>
          )}
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl">{COMMON.hours}</h2>
            <span className="inline-flex items-center gap-2 text-sm">
              <OpenDot open={state.open} /> {state.label}
            </span>
          </div>
          <table className="mt-4 w-full text-[0.9375rem]">
            <caption className="sr-only">ساعات کاری</caption>
            <tbody>
              {[6, 0, 1, 2, 3, 4, 5].map((d) => (
                <tr key={d} className={cx('border-t', d === today && 'font-semibold')}>
                  <th scope="row" className="py-3 text-start font-[inherit]">
                    {DAYS[d]}
                    {d === today && <span className="sr-only"> (امروز)</span>}
                  </th>
                  <td className={cx('py-3 text-end tabular-nums', !loc.hours[d] && 'text-faint')}>{hoursLabel(loc.hours[d])}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="font-display mt-12 text-3xl">{COMMON.gettingHere}</h2>
          <p className="mt-3 text-[0.9375rem] text-muted">{loc.transit}</p>
          <div className="mt-4 rounded-[var(--radius-md)] border p-4">
            <CityMap active={loc.slug} compact />
          </div>
          <a href={mapsHref} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center text-sm font-medium link-underline">
            {COMMON.directions} (در تب جدید باز می‌شود)
          </a>
        </div>
      </section>

      {events.length > 0 && (
        <section className="container-page mt-20 md:mt-28">
          <SectionHeading title={COMMON.upcoming} action={<ArrowLink to="/events">همهٔ رویدادها</ArrowLink>} />
          <ul className="mt-8 border-b">
            {events.map((e) => (
              <li key={e.id} className="grid grid-cols-[1fr_auto] gap-4 border-t py-5 md:grid-cols-[200px_1fr_auto]">
                <span className="text-sm text-ink-2">{shortDate(e.date, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                <span className="font-display text-2xl md:order-none">{e.title}</span>
                <span className="text-[0.9375rem] font-medium tabular-nums">{money(e.price)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="container-page mt-20 md:mt-28">
        <SectionHeading title="شعبه‌های دیگر" action={<ArrowLink to="/locations">همهٔ شعبه‌ها</ArrowLink>} />
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((l, i) => (
            <Reveal key={l.slug} delay={i * 0.05}>
              <LocationCard loc={l} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
