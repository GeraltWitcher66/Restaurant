import { MapPinOff, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { LOCATIONS, LOCATIONS_COPY } from '../content'
import { Button } from '../components/Button'
import { LocationCard } from '../components/Cards'
import { Chip } from '../components/Chip'
import { CityMap } from '../components/CityMap'
import { EmptyState, PageHeader, Reveal } from '../components/Display'
import { faNum, openState } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const AREAS = Array.from(new Set(LOCATIONS.map((l) => l.region)))

export function Locations() {
  useDocumentTitle(LOCATIONS_COPY.title)
  const [city, setCity] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [openOnly, setOpenOnly] = useState(false)
  const [hover, setHover] = useState<string | null>(null)

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return LOCATIONS.filter(
      (l) =>
        (!city || l.region === city) &&
        (!openOnly || openState(l).open) &&
        (!needle || `${l.name} ${l.city} ${l.region} ${l.address}`.toLowerCase().includes(needle)),
    )
  }, [city, q, openOnly])

  const clear = () => {
    setCity(null)
    setQ('')
    setOpenOnly(false)
  }

  return (
    <>
      <PageHeader title={LOCATIONS_COPY.title} aside={LOCATIONS_COPY.aside} intro={LOCATIONS_COPY.intro} />
      <div className="container-page">
        <div className="mx-auto max-w-4xl">
          <CityMap locations={list} active={hover} onHover={setHover} />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-y py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="فیلتر بر اساس منطقه">
            <Chip pressed={city === null} onClick={() => setCity(null)}>
              {LOCATIONS_COPY.allCities}
            </Chip>
            {AREAS.map((c) => (
              <Chip key={c} pressed={city === c} onClick={() => setCity(city === c ? null : c)}>
                {c}
              </Chip>
            ))}
            <Chip pressed={openOnly} onClick={() => setOpenOnly(!openOnly)}>
              {LOCATIONS_COPY.openNow}
            </Chip>
          </div>
          <div className="relative w-full lg:w-80">
            <label htmlFor="loc-search" className="sr-only">
              {LOCATIONS_COPY.searchLabel}
            </label>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 start-4 size-4 -translate-y-1/2 text-muted" />
            <input
              id="loc-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={LOCATIONS_COPY.searchLabel}
              className="h-12 w-full rounded-[var(--radius-sm)] border border-line-strong bg-paper pe-4 ps-11 text-[0.9375rem] placeholder:text-faint hover:border-ink/60 focus:outline-none focus-visible:border-ink focus-visible:shadow-[var(--shadow-focus)]"
            />
          </div>
        </div>
        <p className="sr-only" role="status">
          {faNum(list.length)} شعبه نمایش داده شد
        </p>

        {list.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={MapPinOff}
              title={LOCATIONS_COPY.empty.title}
              body={LOCATIONS_COPY.empty.body}
              action={
                <Button variant="secondary" onClick={clear}>
                  پاک کردن فیلترها
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((loc, i) => (
              <Reveal key={loc.slug} delay={(i % 3) * 0.05} onMouseEnter={() => setHover(loc.slug)} onMouseLeave={() => setHover(null)}>
                <LocationCard loc={loc} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
