import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router'

import { BRAND, EVENTS, HOME, LOCATIONS, MENU, PHOTOS } from '../content'
import { ArrowLink, ButtonLink } from '../components/Button'
import { DishCard, LocationCard } from '../components/Cards'
import { Meta, Photo, Reveal, SectionHeading } from '../components/Display'
import { money, shortDate, weekdayMonth } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const signatures = MENU.flatMap((s) => s.items).filter((i) => i.signature && i.photo && i.id !== 'joojeh')

function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%'])
  const words = `${BRAND.first} ${BRAND.second}`.split(' ')
  return (
    <section aria-labelledby="hero-title" className="container-page">
      <h1 id="hero-title" className="font-display pt-10 text-center text-wordmark tracking-[-0.005em] md:pt-[58px]" style={{ fontWeight: 500 }}>
        <span className="sr-only">{BRAND.name}، از سال {BRAND.founded}</span>
        <span aria-hidden className="block">
          {words.map((w, i) => (
            <span key={i} className="inline-block animate-rise" style={{ animationDelay: `${i * 90}ms` }}>
              {w}
              {i < words.length - 1 && ' '}
            </span>
          ))}
        </span>
        <span aria-hidden className="mt-[0.06em] block animate-rise font-normal italic [font-feature-settings:'onum'_1] [animation-delay:320ms]" style={{ fontWeight: 400 }}>
          ({BRAND.founded})
        </span>
      </h1>

      <div className="mt-10 grid animate-fade-up grid-cols-2 gap-x-6 gap-y-6 [animation-delay:450ms] md:mt-[62px] md:grid-cols-[52fr_30fr_18fr] md:gap-0">
        <Meta label={HOME.meta.service.label} value={HOME.meta.service.value} />
        <Meta label={HOME.meta.location.label} value={HOME.meta.location.value} sub={HOME.meta.location.sub} to={HOME.meta.location.to} />
        <Meta label={HOME.meta.founder.label} value={HOME.meta.founder.value} />
      </div>

      <div ref={ref} className="relative mt-5 aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-cream sm:aspect-[16/10] md:mt-[14px] md:aspect-[1380/700]">
        <motion.img
          src={PHOTOS.hero}
          alt={HOME.heroAlt}
          style={{ y }}
          className="absolute inset-[-7%_0] h-[114%] w-full animate-settle object-cover object-[22%_40%] md:object-[0%_12%]"
          fetchPriority="high"
        />
      </div>
    </section>
  )
}

export function Home() {
  useDocumentTitle()
  const nextEvents = EVENTS.slice(0, 3)
  return (
    <>
      <Hero />

      {/* Intro */}
      <section className="container-page mt-24 grid gap-10 md:mt-36 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <p className="label">{HOME.intro.eyebrow}</p>
        </Reveal>
        <Reveal className="md:col-span-9" delay={0.05}>
          <p className="font-display text-[clamp(1.75rem,1.1rem+2.2vw,3.25rem)] leading-[1.12] text-pretty" style={{ fontWeight: 400 }}>
            {HOME.intro.text}
          </p>
          <dl className="mt-12 grid grid-cols-2 gap-y-8 border-t pt-8 sm:grid-cols-4">
            {HOME.intro.stats.map((s) => (
              <div key={s.label}>
                <dt className="label">{s.label}</dt>
                <dd className="font-display mt-1 text-5xl tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Signatures */}
      <section className="container-page mt-24 md:mt-36" aria-labelledby="sig">
        <SectionHeading id="sig" title={HOME.signatures.title} aside={HOME.signatures.aside} action={<ArrowLink to="/menu">{HOME.signatures.cta}</ArrowLink>} />
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {signatures.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <DishCard item={item} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section className="container-page mt-24 md:mt-36" aria-labelledby="rooms">
        <SectionHeading id="rooms" title={HOME.locations.title} aside={HOME.locations.aside} action={<ArrowLink to="/locations">{HOME.locations.cta}</ArrowLink>} />
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((loc, i) => (
            <Reveal key={loc.slug} delay={(i % 3) * 0.06}>
              <LocationCard loc={loc} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Chef */}
      <section className="container-page mt-24 md:mt-36">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <Photo photo="chef" alt="سرآشپزی با پیش‌بند کنار آتش روباز" ratio="4 / 5" />
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7" delay={0.08}>
            <p className="label">{HOME.chef.eyebrow}</p>
            <blockquote className="font-display mt-4 text-[clamp(1.875rem,1.2rem+2.4vw,3.5rem)] leading-[1.1] italic" style={{ fontWeight: 400 }}>
              {HOME.chef.quote}
            </blockquote>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
              <Meta label={HOME.chef.role} value={HOME.chef.name} />
              <ArrowLink to="/about">{HOME.chef.cta}</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Events */}
      <section className="container-page mt-24 md:mt-36" aria-labelledby="ev">
        <SectionHeading id="ev" title={HOME.events.title} aside={HOME.events.aside} action={<ArrowLink to="/events">{HOME.events.cta}</ArrowLink>} />
        <ul className="mt-10 border-b">
          {nextEvents.map((e) => {
            const loc = LOCATIONS.find((l) => l.slug === e.location)!
            return (
              <li key={e.id}>
                <Link to="/events" className="group grid grid-cols-[72px_1fr_auto] items-center gap-4 border-t py-6 md:grid-cols-[160px_1fr_220px_120px] md:gap-8">
                  <span className="font-display text-[2.5rem] leading-none tabular-nums">{shortDate(e.date, { day: 'numeric' })}</span>
                  <span>
                    <span className="font-display block text-[1.75rem] leading-tight transition-[font-style] group-hover:italic">{e.title}</span>
                    <span className="text-sm text-muted md:hidden">
                      {shortDate(e.date, { month: 'short' })}، {loc.name}
                    </span>
                  </span>
                  <span className="hidden text-sm text-ink-2 md:block">
                    {weekdayMonth(e.date)}
                    <span className="block text-faint">
                      {loc.name}، {loc.city}
                    </span>
                  </span>
                  <span className="justify-self-end text-[0.9375rem] font-medium tabular-nums">{money(e.price)}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Private dining */}
      <section className="container-page mt-24 md:mt-36">
        <div className="relative overflow-hidden rounded-[var(--radius-md)]">
          <Photo photo="privateRoom" alt="میز بلند چیده‌شده برای یک شام خصوصی زیر چراغ‌های آویز" className="aspect-[4/5] rounded-none sm:aspect-[16/9] md:aspect-[1380/620]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="on-dark absolute inset-x-0 bottom-0 p-6 text-paper md:p-12">
            <h2 className="font-display text-[clamp(2.5rem,1.6rem+3vw,4.5rem)]">{HOME.privateDining.title}</h2>
            <p className="mt-3 max-w-lg text-[1.0625rem] text-paper/90">{HOME.privateDining.body}</p>
            <ButtonLink to="/events#private-dining" variant="secondary" arrow className="mt-6">
              {HOME.privateDining.cta}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Reserve */}
      <section className="container-page mt-24 text-center md:mt-36">
        <Reveal>
          <h2 className="font-display text-display">
            {HOME.reserve.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[1.0625rem] text-muted">{HOME.reserve.body}</p>
          <ButtonLink to="/reservations" size="lg" arrow className="mt-8">
            {HOME.reserve.cta}
          </ButtonLink>
        </Reveal>
      </section>
    </>
  )
}
