import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

import { BRAND, GIFT_CARDS } from '../content'
import { Button } from '../components/Button'
import { Segmented } from '../components/Chip'
import { Notice, PageHeader } from '../components/Display'
import { TextArea, TextField } from '../components/Field'
import { cx } from '../lib/cx'
import { longDate, money } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useForm } from '../lib/useForm'
import { GIFT_MAX, GIFT_MIN, addDaysISO, todayISO, validateGiftCard } from '../shared/validation'

type Values = { amount: number; design: string; to: string; toEmail: string; from: string; fromEmail: string; message: string; sendOn: string }

export function GiftCardPreview({ design, amount, to, from, message }: { design: string; amount: number; to?: string; from?: string; message?: string }) {
  const d = GIFT_CARDS.designs.find((x) => x.id === design) ?? GIFT_CARDS.designs[0]
  return (
    <div
      className="relative flex aspect-[1.6] w-full flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-float)] transition-[background-color,color] duration-[var(--duration-slow)] sm:p-8"
      style={{ backgroundColor: d.bg, color: d.fg }}
    >
      <svg aria-hidden viewBox="0 0 200 200" className="absolute -right-10 -bottom-16 size-72 opacity-[0.12]">
        <path d="M100 10c18 40 60 55 60 105a60 60 0 1 1-120 0c0-30 20-45 30-70 8 20 20 28 30 30-6-30-12-45 0-65z" fill="currentColor" />
      </svg>
      <div className="flex items-start justify-between">
        <p className="font-serif text-2xl leading-none">
          <span className="font-medium">{BRAND.first}</span> <span className="italic">{BRAND.second}</span>
        </p>
        <p className="text-sm">کارت هدیه</p>
      </div>
      <div className="relative">
        <p className="font-display text-6xl tabular-nums sm:text-7xl">{money(amount || 0)}</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <span>
            {GIFT_CARDS.previewTo} {to?.trim() || '…'}
          </span>
          <span>
            {GIFT_CARDS.previewFrom} {from?.trim() || '…'}
          </span>
        </div>
        {message?.trim() && <p className="mt-2 line-clamp-2 max-w-sm font-serif text-lg italic">“{message.trim()}”</p>}
      </div>
    </div>
  )
}

export function GiftCards() {
  useDocumentTitle(GIFT_CARDS.title)
  const today = todayISO()
  const initial: Values = { amount: 100, design: 'ember', to: '', toEmail: '', from: '', fromEmail: '', message: '', sendOn: today }
  const form = useForm<Values, { code: string }>(initial, '/api/gift-cards', (v) => validateGiftCard(v, todayISO()))
  const [custom, setCustom] = useState(false)
  const v = form.values

  return (
    <>
      <PageHeader title={GIFT_CARDS.title} aside={GIFT_CARDS.aside} intro={GIFT_CARDS.intro} />
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:col-start-1">
          <div className="lg:sticky lg:top-28">
            <GiftCardPreview design={v.design} amount={v.amount} to={v.to} from={v.from} message={v.message} />
            <p className="mt-4 text-sm text-muted">{GIFT_CARDS.note}</p>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          {form.status === 'success' && form.result ? (
            <div role="status" className="rounded-[var(--radius-md)] border p-8">
              <CheckCircle2 aria-hidden className="size-8 text-success" />
              <p className="font-display mt-3 text-[2.25rem]">{GIFT_CARDS.done.title}</p>
              <p className="mt-2 text-[0.9375rem] text-muted">
                {GIFT_CARDS.done.body} <strong className="font-mono text-ink">{form.result.code}</strong>. ارسال در {longDate(v.sendOn)} به {v.toEmail}.
              </p>
              <Button variant="secondary" className="mt-6" onClick={() => form.reset({ ...initial, from: v.from, fromEmail: v.fromEmail })}>
                ارسال کارت دیگر
              </Button>
            </div>
          ) : (
            <form
              noValidate
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault()
                void form.submit()
              }}
            >
              {form.status === 'error' && form.message && <Notice tone="error">{form.message}</Notice>}
              <div data-field="amount" className="flex flex-col gap-2">
                <span className="text-sm font-medium">{GIFT_CARDS.amount}</span>
                <Segmented
                  label={GIFT_CARDS.amount}
                  name="amount-choice"
                  value={custom ? 'custom' : String(v.amount)}
                  onChange={(a) => {
                    if (a === 'custom') {
                      setCustom(true)
                      return
                    }
                    setCustom(false)
                    form.set('amount', Number(a))
                  }}
                  options={[...GIFT_CARDS.amounts.map((a) => ({ value: String(a), label: money(a) })), { value: 'custom', label: GIFT_CARDS.custom }]}
                />
                {custom && (
                  <TextField
                    label={GIFT_CARDS.custom}
                    name="amount"
                    type="number"
                    inputMode="numeric"
                    min={GIFT_MIN}
                    max={GIFT_MAX}
                    hint={GIFT_CARDS.customHint}
                    value={String(v.amount || '')}
                    error={form.errors.amount}
                    onChange={(e) => form.set('amount', Number(e.target.value))}
                    className="mt-2 sm:max-w-xs"
                  />
                )}
                {!custom && form.errors.amount && <p className="text-[0.8125rem] font-medium text-danger">{form.errors.amount}</p>}
              </div>
              <div data-field="design" className="flex flex-col gap-2">
                <span id="design-label" className="text-sm font-medium">
                  {GIFT_CARDS.design}
                </span>
                <div role="radiogroup" aria-labelledby="design-label" className="flex gap-3">
                  {GIFT_CARDS.designs.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      role="radio"
                      aria-checked={v.design === d.id}
                      onClick={() => form.set('design', d.id)}
                      className={cx(
                        'flex h-14 w-24 items-end rounded-[var(--radius-sm)] border-2 p-2 text-xs font-medium transition-[border-color,transform] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember active:scale-[0.98]',
                        v.design === d.id ? 'border-ink' : 'border-transparent',
                      )}
                      style={{ backgroundColor: d.bg, color: d.fg, boxShadow: d.id === 'salt' ? 'inset 0 0 0 1px var(--color-line-strong)' : undefined }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField label={GIFT_CARDS.to} name="to" value={v.to} error={form.errors.to} onChange={(e) => form.set('to', e.target.value)} />
                <TextField label={GIFT_CARDS.toEmail} name="toEmail" type="email" value={v.toEmail} error={form.errors.toEmail} onChange={(e) => form.set('toEmail', e.target.value)} />
                <TextField label={GIFT_CARDS.from} name="from" autoComplete="name" value={v.from} error={form.errors.from} onChange={(e) => form.set('from', e.target.value)} />
                <TextField label={GIFT_CARDS.fromEmail} name="fromEmail" type="email" autoComplete="email" value={v.fromEmail} error={form.errors.fromEmail} onChange={(e) => form.set('fromEmail', e.target.value)} />
              </div>
              <TextArea label={GIFT_CARDS.message} name="message" maxLength={240} value={v.message} error={form.errors.message} onChange={(e) => form.set('message', e.target.value)} className="[&_textarea]:min-h-24" />
              <TextField
                label={GIFT_CARDS.sendOn}
                name="sendOn"
                type="date"
                min={today}
                max={addDaysISO(today, 365)}
                value={v.sendOn}
                error={form.errors.sendOn}
                onChange={(e) => form.set('sendOn', e.target.value)}
                className="sm:max-w-xs"
              />
              <Button type="submit" size="lg" arrow loading={form.status === 'submitting'}>
                {GIFT_CARDS.submit} ({money(v.amount || 0)})
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
