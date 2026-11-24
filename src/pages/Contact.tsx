import { CheckCircle2 } from 'lucide-react'

import { CONTACT, LOCATIONS } from '../content'
import { Button } from '../components/Button'
import { Accordion, Meta, Notice, PageHeader } from '../components/Display'
import { SelectField, TextArea, TextField } from '../components/Field'
import { telHref } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useForm } from '../lib/useForm'
import { validateContact } from '../shared/validation'

export function Contact() {
  useDocumentTitle(CONTACT.title)
  const form = useForm({ topic: CONTACT.topics[0], location: '', name: '', email: '', message: '' }, '/api/contact', validateContact)
  const v = form.values
  return (
    <>
      <PageHeader title={CONTACT.title} aside={CONTACT.aside} intro={CONTACT.intro} />
      <div className="container-page grid gap-14 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-4">
          <div className="space-y-5">
            {CONTACT.channels.map((c) => (
              <div key={c.label}>
                <span className="label block">{c.label}</span>
                <a href={c.href} className="inline-flex min-h-10 items-center text-[0.9375rem] font-semibold link-underline">
                  {c.value}
                </a>
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium">تماس با شعبه‌ها</p>
            <ul className="mt-3 divide-y border-y">
              {LOCATIONS.map((l) => (
                <li key={l.slug} className="flex items-center justify-between gap-4 py-2">
                  <Meta label={l.city} value={l.name} />
                  <a href={telHref(l.phone)} className="inline-flex min-h-10 items-center text-sm tabular-nums link-underline">
                    {l.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {form.status === 'success' ? (
            <div role="status" className="rounded-[var(--radius-md)] border p-8">
              <CheckCircle2 aria-hidden className="size-8 text-success" />
              <p className="font-display mt-3 text-[2.25rem]">{CONTACT.done.title}</p>
              <p className="mt-2 text-[0.9375rem] text-muted">{CONTACT.done.body}</p>
              <Button variant="secondary" className="mt-6" onClick={() => form.reset()}>
                نوشتن پیام دیگر
              </Button>
            </div>
          ) : (
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
                <SelectField label={CONTACT.topic} name="topic" value={v.topic} error={form.errors.topic} onChange={(e) => form.set('topic', e.target.value)} options={CONTACT.topics.map((t) => ({ value: t, label: t }))} />
                <SelectField
                  label={CONTACT.location}
                  name="location"
                  value={v.location}
                  error={form.errors.location}
                  onChange={(e) => form.set('location', e.target.value)}
                  options={[{ value: '', label: CONTACT.noLocation }, ...LOCATIONS.map((l) => ({ value: l.slug, label: l.name }))]}
                />
                <TextField label={CONTACT.name} name="name" autoComplete="name" value={v.name} error={form.errors.name} onChange={(e) => form.set('name', e.target.value)} />
                <TextField label={CONTACT.email} name="email" type="email" autoComplete="email" value={v.email} error={form.errors.email} onChange={(e) => form.set('email', e.target.value)} />
              </div>
              <TextArea label={CONTACT.message} name="message" maxLength={2000} value={v.message} error={form.errors.message} onChange={(e) => form.set('message', e.target.value)} />
              <Button type="submit" size="lg" arrow loading={form.status === 'submitting'}>
                {CONTACT.submit}
              </Button>
            </form>
          )}
          <h2 className="font-display mt-20 text-[2.5rem]">{CONTACT.faqTitle}</h2>
          <Accordion items={CONTACT.faq} className="mt-6" />
        </div>
      </div>
    </>
  )
}
