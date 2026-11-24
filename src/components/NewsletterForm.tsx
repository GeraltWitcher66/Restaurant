import { useId } from 'react'

import { COMMON } from '../content'
import { cx } from '../lib/cx'
import { useStoredState } from '../lib/bookings'
import { useForm } from '../lib/useForm'
import { validateSubscribe } from '../shared/validation'
import { Button } from './Button'

export function NewsletterForm({ dark }: { dark?: boolean }) {
  const id = useId()
  const [subscribed, setSubscribed] = useStoredState('atashonamak:subscribed', false)
  const form = useForm({ email: '' }, '/api/subscribe', validateSubscribe)
  if (subscribed || form.status === 'success')
    return (
      <p role="status" className={cx('text-[0.9375rem]', dark ? 'text-cream' : 'text-success')}>
        {COMMON.newsletterDone}
      </p>
    )
  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault()
        if (await form.submit()) setSubscribed(true)
      }}
    >
      <div data-field="email" className="flex gap-2">
        <label htmlFor={id} className="sr-only">
          {COMMON.newsletterLabel}
        </label>
        <input
          id={id}
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={form.values.email}
          onChange={(e) => form.set('email', e.target.value)}
          aria-invalid={form.errors.email ? true : undefined}
          aria-describedby={form.errors.email ? `${id}-err` : undefined}
          className={cx(
            'h-12 min-w-0 flex-1 rounded-[var(--radius-sm)] border px-4 text-[0.9375rem] focus:outline-none focus-visible:shadow-[var(--shadow-focus)]',
            dark ? 'border-cream/30 bg-transparent text-cream placeholder:text-cream/60 focus-visible:border-cream' : 'border-line-strong bg-paper focus-visible:border-ink',
            form.errors.email && (dark ? 'border-[#f2a48f]' : 'border-danger'),
          )}
        />
        <Button type="submit" variant={dark ? 'secondary' : 'primary'} loading={form.status === 'submitting'}>
          {COMMON.newsletterSubmit}
        </Button>
      </div>
      {(form.errors.email || (form.status === 'error' && form.message)) && (
        <p id={`${id}-err`} role="alert" className={cx('mt-2 text-[0.8125rem] font-medium', dark ? 'text-[#f6b8a6]' : 'text-danger')}>
          {form.errors.email ?? form.message}
        </p>
      )}
    </form>
  )
}
