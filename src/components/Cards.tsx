import { MapPin } from 'lucide-react'
import { Link } from 'react-router'

import { CAREERS, DIETS, EVENTS_COPY, LOCATIONS, MENU_COPY, type EventItem, type Location, type MenuItem, type Role } from '../content'
import { cx } from '../lib/cx'
import { money, openState, shortDate, timeLabel, weekdayMonth } from '../lib/format'
import { Button, LongArrow } from './Button'
import { Badge, OpenDot, Photo } from './Display'

export function DietBadges({ item }: { item: MenuItem }) {
  if (!item.diets.length) return null
  return (
    <span className="inline-flex flex-wrap gap-1">
      {item.diets.map((d) => (
        <Badge key={d} tone={d === 'spicy' ? 'ember' : 'outline'} title={DIETS[d].label} className="h-5 px-2 text-[0.6875rem]">
          <span aria-hidden>{DIETS[d].short}</span>
          <span className="sr-only">{DIETS[d].label}</span>
        </Badge>
      ))}
    </span>
  )
}

/** A signature dish with its photo. */
export function DishCard({ item, className }: { item: MenuItem; className?: string }) {
  return (
    <article className={cx('group', className)}>
      {item.photo && (
        <Photo
          photo={item.photo}
          alt={`${item.name}، ${item.description}`}
          ratio="4 / 5"
          imgClassName="transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
      )}
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[1.625rem] leading-tight">{item.name}</h3>
        <span className="text-[0.9375rem] font-medium tabular-nums">{money(item.price)}</span>
      </div>
      <p className="mt-1 text-[0.9375rem] text-muted">{item.description}</p>
      <div className="mt-2">
        <DietBadges item={item} />
      </div>
    </article>
  )
}

/** One line of the printed-style menu. */
export function MenuRow({ item, unavailableAt }: { item: MenuItem; unavailableAt?: string }) {
  return (
    <li className="flex gap-4 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-display text-[1.4375rem] leading-tight">{item.name}</h3>
          {item.signature && <Badge tone="ink">{MENU_COPY.signatures}</Badge>}
          <DietBadges item={item} />
        </div>
        <p className="mt-0.5 text-[0.9375rem] text-muted">{item.description}</p>
        {unavailableAt && (
          <p className="mt-1.5">
            <Badge tone="danger">
              {MENU_COPY.notHere} {unavailableAt}
            </Badge>
          </p>
        )}
      </div>
      <span className="pt-1 text-[0.9375rem] font-medium tabular-nums">{money(item.price)}</span>
    </li>
  )
}

export function LocationCard({ loc, className, now }: { loc: Location; className?: string; now?: Date }) {
  const state = openState(loc, now)
  return (
    <article className={cx('group relative', className)}>
      <Photo
        photo={loc.photo}
        alt={`سالن غذاخوری شعبهٔ ${loc.name}`}
        ratio="4 / 3"
        imgClassName="transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
      />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="label">{loc.city}</p>
          <h3 className="font-display mt-0.5 text-[1.75rem] leading-tight">
            <Link to={`/locations/${loc.slug}`} className="stretched after:absolute after:inset-0 focus-visible:outline-none after:rounded-[var(--radius-md)] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-ember">
              {loc.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-faint">{loc.address}</p>
        </div>
        <LongArrow className="mt-8 transition-transform duration-[var(--duration-base)] group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </div>
      <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-2">
        <OpenDot open={state.open} />
        {state.label}
      </p>
    </article>
  )
}

export function EventCard({ event, onBook }: { event: EventItem; onBook: (e: EventItem) => void }) {
  const loc = LOCATIONS.find((l) => l.slug === event.location)!
  const soldOut = event.seatsLeft === 0
  return (
    <article className="grid gap-5 border-t py-8 md:grid-cols-[180px_1fr_240px] md:gap-8">
      <div className="flex items-baseline gap-3 md:block">
        <p className="font-display text-[3.25rem] leading-none tabular-nums">{shortDate(event.date, { day: 'numeric' })}</p>
        <p className="text-sm text-ink-2 md:mt-2">
          {weekdayMonth(event.date, 'short')}، ساعت {timeLabel(event.time)}
        </p>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="outline">{event.kind}</Badge>
          <span className="inline-flex items-center gap-1 text-sm text-muted">
            <MapPin aria-hidden className="size-3.5" /> {loc.name}, {loc.city}
          </span>
        </div>
        <h3 className="font-display mt-3 text-[2rem] leading-tight">{event.title}</h3>
        <p className="mt-2 max-w-xl text-[0.9375rem] text-muted">{event.description}</p>
      </div>
      <div className="flex flex-row items-center justify-between gap-4 md:flex-col md:items-end md:justify-start">
        <div className="md:text-end">
          <p className="text-lg font-semibold tabular-nums">
            {event.price ? money(event.price) : EVENTS_COPY.free}
            {event.price > 0 && <span className="ms-1 text-sm font-normal text-muted">{EVENTS_COPY.perGuest}</span>}
          </p>
          <p className={cx('text-sm', soldOut ? 'text-danger' : event.seatsLeft < 10 ? 'text-ember' : 'text-muted')}>
            {soldOut ? EVENTS_COPY.soldOut : EVENTS_COPY.left(event.seatsLeft)}
          </p>
        </div>
        <Button variant={soldOut ? 'secondary' : 'primary'} disabled={soldOut} onClick={() => onBook(event)} aria-label={`${EVENTS_COPY.book}: ${event.title}`}>
          {soldOut ? EVENTS_COPY.soldOut : EVENTS_COPY.book}
        </Button>
      </div>
    </article>
  )
}

export function RoleRow({ role, onApply }: { role: Role; onApply: (r: Role) => void }) {
  const loc = LOCATIONS.find((l) => l.slug === role.location)!
  return (
    <li className="grid gap-3 border-t py-6 md:grid-cols-[1.3fr_1fr_auto] md:items-center md:gap-8">
      <div>
        <h3 className="font-display text-[1.75rem] leading-tight">{role.title}</h3>
        <p className="mt-1 text-[0.9375rem] text-muted">{role.summary}</p>
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <Badge tone="outline">{role.team}</Badge>
        <Badge tone="neutral">
          {loc.name}, {loc.city}
        </Badge>
        <Badge tone="neutral">{role.type}</Badge>
        <Badge tone="ember">{role.pay}</Badge>
      </div>
      <Button variant="secondary" arrow onClick={() => onApply(role)} aria-label={`درخواست برای ${role.title}، ${loc.name}`}>
        {CAREERS.apply}
      </Button>
    </li>
  )
}
