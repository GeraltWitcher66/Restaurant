import { CheckCircle2, Search } from 'lucide-react'
import { useState } from 'react'

import { CAREERS, LOCATIONS, type Role } from '../content'
import { Button, ButtonLink } from '../components/Button'
import { RoleRow } from '../components/Cards'
import { Chip } from '../components/Chip'
import { EmptyState, Notice, PageHeader, Reveal } from '../components/Display'
import { SelectField, TextArea, TextField } from '../components/Field'
import { Modal } from '../components/Overlay'
import { faNum } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useForm } from '../lib/useForm'
import { validateApplication } from '../shared/validation'

const TEAMS = Array.from(new Set(CAREERS.roles.map((r) => r.team)))

function Apply({ role, onClose }: { role: Role; onClose: () => void }) {
  const form = useForm<{ role: string; name: string; email: string; phone: string; link: string; message: string }, { reference: string }>(
    { role: role.id, name: '', email: '', phone: '', link: '', message: '' },
    '/api/applications',
    validateApplication,
  )
  const v = form.values
  if (form.status === 'success')
    return (
      <div role="status">
        <CheckCircle2 aria-hidden className="size-8 text-success" />
        <p className="font-display mt-3 text-3xl">{CAREERS.modal.done}</p>
        <p className="mt-1 text-[0.9375rem] text-muted">{CAREERS.modal.doneBody}</p>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>بستن</Button>
        </div>
      </div>
    )
  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        void form.submit()
      }}
    >
      {form.status === 'error' && form.message && <Notice tone="error">{form.message}</Notice>}
      <TextField label={CAREERS.modal.name} name="name" autoComplete="name" value={v.name} error={form.errors.name} onChange={(e) => form.set('name', e.target.value)} />
      <TextField label={CAREERS.modal.email} name="email" type="email" autoComplete="email" value={v.email} error={form.errors.email} onChange={(e) => form.set('email', e.target.value)} />
      <TextField label={CAREERS.modal.phone} name="phone" type="tel" autoComplete="tel" value={v.phone} error={form.errors.phone} onChange={(e) => form.set('phone', e.target.value)} />
      <TextField label={CAREERS.modal.link} name="link" type="url" placeholder="https://" value={v.link} error={form.errors.link} onChange={(e) => form.set('link', e.target.value)} />
      <TextArea label={CAREERS.modal.message} name="message" maxLength={1500} value={v.message} error={form.errors.message} onChange={(e) => form.set('message', e.target.value)} />
      <Button type="submit" size="lg" className="w-full" loading={form.status === 'submitting'}>
        {CAREERS.modal.submit}
      </Button>
    </form>
  )
}

export function Careers() {
  useDocumentTitle(CAREERS.title)
  const [team, setTeam] = useState<string | null>(null)
  const [where, setWhere] = useState('')
  const [q, setQ] = useState('')
  const [applying, setApplying] = useState<Role | null>(null)
  const needle = q.trim().toLowerCase()
  const roles = CAREERS.roles.filter((r) => (!team || r.team === team) && (!where || r.location === where) && (!needle || `${r.title} ${r.summary}`.toLowerCase().includes(needle)))
  return (
    <>
      <PageHeader title={CAREERS.title} aside={CAREERS.aside} intro={CAREERS.intro} />
      <section className="container-page grid gap-8 sm:grid-cols-2 lg:grid-cols-4" aria-label="مزایا">
        {CAREERS.perks.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05} className="border-t pt-5">
            <h2 className="font-display text-2xl">{p.title}</h2>
            <p className="mt-1 text-[0.9375rem] text-muted">{p.body}</p>
          </Reveal>
        ))}
      </section>

      <section className="container-page mt-20" aria-labelledby="roles">
        <h2 id="roles" className="font-display text-[clamp(2.25rem,1.6rem+2.4vw,3.75rem)]">
          موقعیت‌های شغلی باز <span className="text-[0.55em] font-normal text-ink-2 italic">({faNum(roles.length)})</span>
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_260px_280px] lg:items-end">
          <div className="flex flex-wrap gap-2" role="group" aria-label={CAREERS.filterTeam}>
            <Chip pressed={team === null} onClick={() => setTeam(null)}>
              {CAREERS.all}
            </Chip>
            {TEAMS.map((t) => (
              <Chip key={t} pressed={team === t} onClick={() => setTeam(team === t ? null : t)}>
                {t}
              </Chip>
            ))}
          </div>
          <SelectField
            label={CAREERS.filterLocation}
            name="where"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            options={[{ value: '', label: 'همهٔ شعبه‌ها' }, ...LOCATIONS.map((l) => ({ value: l.slug, label: l.name }))]}
          />
          <div className="relative">
            <label htmlFor="role-q" className="sr-only">
              جست‌وجوی موقعیت شغلی
            </label>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 start-4 size-4 -translate-y-1/2 text-muted" />
            <input
              id="role-q"
              type="search"
              placeholder="جست‌وجوی موقعیت شغلی"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-12 w-full rounded-[var(--radius-sm)] border border-line-strong bg-paper pe-4 ps-11 text-[0.9375rem] placeholder:text-faint hover:border-ink/60 focus:outline-none focus-visible:border-ink focus-visible:shadow-[var(--shadow-focus)]"
            />
          </div>
        </div>
        {roles.length ? (
          <ul className="mt-8 border-b">
            {roles.map((r) => (
              <RoleRow key={r.id} role={r} onApply={setApplying} />
            ))}
          </ul>
        ) : (
          <div className="mt-8">
            <EmptyState title={CAREERS.empty.title} body={CAREERS.empty.body} action={<ButtonLink to="/contact" variant="secondary">برایمان بنویسید</ButtonLink>} />
          </div>
        )}
      </section>

      <Modal
        open={!!applying}
        onClose={() => setApplying(null)}
        title={applying ? `${CAREERS.modal.title}: ${applying.title}` : CAREERS.modal.title}
        description={applying ? `${LOCATIONS.find((l) => l.slug === applying.location)?.name}، ${applying.type}، ${applying.pay}` : undefined}
      >
        {applying && <Apply role={applying} onClose={() => setApplying(null)} />}
      </Modal>
    </>
  )
}
