import { ABOUT } from '../content'
import { ArrowLink, ButtonLink } from '../components/Button'
import { Meta, PageHeader, Photo, Reveal, SectionHeading } from '../components/Display'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function About() {
  useDocumentTitle(ABOUT.title)
  return (
    <>
      <PageHeader title={ABOUT.title} aside={ABOUT.aside}>
        <div className="mt-12 grid grid-cols-2 gap-6 md:mt-16 md:grid-cols-[52fr_30fr_18fr] md:gap-0">
          {ABOUT.meta.map((m) => (
            <Meta key={m.label} label={m.label} value={m.value} />
          ))}
        </div>
      </PageHeader>
      <div className="container-page">
        <Photo photo="tajrish" alt="میز روبه‌روی آتش در اولین شعبهٔ آتش و نمک، تجریش" priority imgClassName="animate-settle" className="aspect-[4/3] md:aspect-[1380/620]" />
      </div>

      <section className="container-page mt-20 grid gap-10 md:mt-28 md:grid-cols-12">
        <p className="label md:col-span-3">داستان ما</p>
        <div className="space-y-6 md:col-span-8">
          {ABOUT.story.map((p, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className={i === 0 ? 'font-display text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] leading-[1.15]' : 'max-w-2xl text-[1.0625rem] text-muted'} style={i === 0 ? { fontWeight: 400 } : undefined}>
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page mt-20 md:mt-28" aria-labelledby="tl">
        <SectionHeading id="tl" title="شش شعبه" aside="(پانزده سال)" />
        <ol className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-md)] border bg-line sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT.timeline.map((t) => (
            <li key={t.year} className="bg-paper p-6">
              <p className="font-display text-5xl italic [font-feature-settings:'onum'_1]" style={{ fontWeight: 400 }}>
                {t.year}
              </p>
              <p className="mt-3 text-[0.9375rem] text-ink-2">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <Photo photo="chef" alt="سرآشپز از پشت، در حال رسیدگی به آتش چوب" ratio="4 / 5" />
        </Reveal>
        <Reveal className="md:col-span-6 md:col-start-7" delay={0.06}>
          <p className="label">{ABOUT.chef.title}</p>
          <h2 className="font-display mt-2 text-display">{ABOUT.chef.name}</h2>
          <p className="mt-6 max-w-lg text-[1.0625rem] text-muted">{ABOUT.chef.body}</p>
          <ArrowLink to="/locations/tajrish" className="mt-6">
            سر زدن به تجریش
          </ArrowLink>
        </Reveal>
      </section>

      <section className="container-page mt-20 md:mt-28" aria-labelledby="vals">
        <SectionHeading id="vals" title="به چه چیزی پایبندیم" />
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {ABOUT.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.05} className="border-t pt-6">
              <h3 className="font-display text-3xl">{v.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-muted">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page mt-20 md:mt-28" aria-label="رسانه‌ها">
        <div className="grid gap-10 md:grid-cols-3">
          {ABOUT.press.map((p) => (
            <figure key={p.source}>
              <blockquote className="font-display text-[1.75rem] leading-tight italic" style={{ fontWeight: 400 }}>
                “{p.quote}”
              </blockquote>
              <figcaption className="mt-3 text-sm text-muted">{p.source}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/reservations" arrow size="lg">
            رزرو میز
          </ButtonLink>
          <ButtonLink to="/careers" variant="secondary" size="lg">
            همکاری با ما
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
