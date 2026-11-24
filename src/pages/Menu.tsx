import { Search, UtensilsCrossed } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { DIETS, LOCATIONS, MENU, MENU_COPY, type Diet } from '../content'
import { Button } from '../components/Button'
import { MenuRow } from '../components/Cards'
import { Chip } from '../components/Chip'
import { EmptyState, Notice, PageHeader, Photo } from '../components/Display'
import { SelectField } from '../components/Field'
import { useStoredState } from '../lib/bookings'
import { faNum } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function MenuPage() {
  useDocumentTitle(MENU_COPY.title)
  const [params, setParams] = useSearchParams()
  const [location, setLocation] = useStoredState('atashonamak:location', '')
  const q = params.get('q') ?? ''
  const diets = (params.get('diet')?.split(',').filter((d) => d in DIETS) ?? []) as Diet[]

  const update = (next: { q?: string; diet?: Diet[] }) => {
    const p = new URLSearchParams(params)
    const nq = next.q ?? q
    const nd = next.diet ?? diets
    if (nq) p.set('q', nq)
    else p.delete('q')
    if (nd.length) p.set('diet', nd.join(','))
    else p.delete('diet')
    setParams(p, { replace: true })
  }
  const toggleDiet = (d: Diet) => update({ diet: diets.includes(d) ? diets.filter((x) => x !== d) : [...diets, d] })

  const sections = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return MENU.map((s) => ({
      ...s,
      items: s.items.filter(
        (i) => diets.every((d) => i.diets.includes(d)) && (!needle || `${i.name} ${i.description} ${s.title}`.toLowerCase().includes(needle)),
      ),
    })).filter((s) => s.items.length)
  }, [q, diets])

  const loc = LOCATIONS.find((l) => l.slug === location)
  const total = sections.reduce((n, s) => n + s.items.length, 0)
  const filtered = q || diets.length

  return (
    <>
      <PageHeader title={MENU_COPY.title} aside={MENU_COPY.aside} intro={MENU_COPY.intro} />

      <div className="container-page">
        <div className="grid gap-4 border-y py-5 lg:grid-cols-[260px_1fr_auto] lg:items-end lg:gap-8">
          <SelectField
            label={MENU_COPY.location}
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            options={[{ value: '', label: MENU_COPY.allLocations }, ...LOCATIONS.map((l) => ({ value: l.slug, label: l.name }))]}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="menu-search" className="text-sm font-medium">
              {MENU_COPY.search}
            </label>
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute top-1/2 start-4 size-4 -translate-y-1/2 text-muted" />
              <input
                id="menu-search"
                type="search"
                value={q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="جوجه، بادمجان، آتش…"
                className="h-12 w-full rounded-[var(--radius-sm)] border border-line-strong bg-paper pe-4 ps-11 text-[0.9375rem] placeholder:text-faint hover:border-ink/60 focus:outline-none focus-visible:border-ink focus-visible:shadow-[var(--shadow-focus)]"
              />
            </div>
          </div>
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">{MENU_COPY.filters}</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DIETS) as Diet[]).map((d) => (
                <Chip key={d} pressed={diets.includes(d)} onClick={() => toggleDiet(d)}>
                  {DIETS[d].label}
                </Chip>
              ))}
            </div>
          </fieldset>
        </div>

        <nav aria-label="بخش‌های منو" className="scrollbar-none sticky top-[72px] z-10 -mx-4 flex gap-1 overflow-x-auto bg-paper/95 px-4 py-2 backdrop-blur lg:top-[88px] md:mx-0 md:px-0">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="inline-flex min-h-10 shrink-0 items-center px-3 text-sm text-muted first:ps-0 hover:text-ink">
              {s.title}
            </a>
          ))}
        </nav>

        <p className="sr-only" role="status">
          {faNum(total)} غذا نمایش داده شد
        </p>

        {total === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={UtensilsCrossed}
              title={MENU_COPY.empty.title}
              body={MENU_COPY.empty.body}
              action={
                <Button variant="secondary" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                  پاک کردن فیلترها
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-x-16 lg:grid-cols-[1fr_380px]">
            <div>
              {sections.map((s) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="pt-10 first:pt-4">
                  <div className="flex items-baseline justify-between gap-4 border-b pb-3">
                    <h2 id={`${s.id}-t`} className="font-display text-[2.5rem]">
                      {s.title}
                    </h2>
                    <span className="text-sm text-faint">{s.items.length}</span>
                  </div>
                  {s.note && !filtered && <p className="mt-3 text-sm text-muted italic">{s.note}</p>}
                  <ul className="divide-y">
                    {s.items.map((item) => (
                      <MenuRow key={item.id} item={item} unavailableAt={loc && item.notAt?.includes(loc.slug) ? loc.name : undefined} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <aside className="mt-10 hidden lg:block">
              <div className="sticky top-[150px] space-y-6">
                <Photo photo="skewers" alt="سیخ‌های جوجه با لعاب زعفران روی بشقاب تیره" ratio="4 / 5" />
                <Notice tone="info">{MENU_COPY.allergens}</Notice>
              </div>
            </aside>
          </div>
        )}
        <Notice tone="info" className="mt-10 lg:hidden">
          {MENU_COPY.allergens}
        </Notice>
      </div>
    </>
  )
}
