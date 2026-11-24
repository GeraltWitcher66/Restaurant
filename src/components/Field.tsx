import { Check, ChevronDown } from 'lucide-react'
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

import { cx } from '../lib/cx'
import type { Force } from './Button'

const control =
  'w-full rounded-[var(--radius-sm)] border bg-paper px-4 text-[0.9375rem] text-ink placeholder:text-faint transition-[border-color,box-shadow] duration-[var(--duration-fast)] hover:border-ink/60 data-[force=hover]:border-ink/60 focus:outline-none focus-visible:border-ink focus-visible:shadow-[var(--shadow-focus)] data-[force=focus]:border-ink data-[force=focus]:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed disabled:bg-sand disabled:text-faint'

const stateClass = (error?: string) => (error ? 'border-danger' : 'border-line-strong')

type FieldProps = { label: string; name: string; error?: string; hint?: string; optional?: boolean; className?: string; children: (ids: { id: string; describedBy?: string }) => ReactNode }

/** Label, control, hint and error message, wired together for screen readers. */
export function Field({ label, name, error, hint, className, children }: FieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  return (
    <div data-field={name} className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children({ id, describedBy })}
      {hint && !error && (
        <p id={hintId} className="text-[0.8125rem] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[0.8125rem] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

type Base = { label: string; name: string; error?: string; hint?: string; className?: string; force?: Force }

export function TextField({ label, name, error, hint, className, force, ...rest }: Base & Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>) {
  return (
    <Field {...{ label, name, error, hint, className }}>
      {({ id, describedBy }) => (
        <input
          id={id}
          name={name}
          data-force={force}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(control, stateClass(error), 'h-12')}
          {...rest}
        />
      )}
    </Field>
  )
}

export function TextArea({ label, name, error, hint, className, force, ...rest }: Base & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>) {
  return (
    <Field {...{ label, name, error, hint, className }}>
      {({ id, describedBy }) => (
        <textarea
          id={id}
          name={name}
          data-force={force}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(control, stateClass(error), 'min-h-32 resize-y py-3 leading-relaxed')}
          {...rest}
        />
      )}
    </Field>
  )
}

export function SelectField({
  label,
  name,
  error,
  hint,
  className,
  force,
  options,
  ...rest
}: Base & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> & { options: { value: string; label: string }[] }) {
  return (
    <Field {...{ label, name, error, hint, className }}>
      {({ id, describedBy }) => (
        <div className="relative">
          <select
            id={id}
            name={name}
            data-force={force}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cx(control, stateClass(error), 'h-12 appearance-none pe-10')}
            {...rest}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 end-3.5 size-4 -translate-y-1/2 text-muted" />
        </div>
      )}
    </Field>
  )
}

export function Checkbox({
  name,
  label,
  error,
  checked,
  onChange,
  force,
  disabled,
}: {
  name: string
  label: ReactNode
  error?: string
  checked: boolean
  onChange: (v: boolean) => void
  force?: Force
  disabled?: boolean
}) {
  const id = useId()
  return (
    <div data-field={name} className="flex flex-col gap-1.5">
      <label htmlFor={id} className={cx('group/cb flex min-h-10 cursor-pointer items-start gap-3 text-sm leading-snug text-ink-2', disabled && 'cursor-not-allowed opacity-50')}>
        <span className="relative mt-0.5 flex size-5 shrink-0">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            data-force={force}
            className={cx(
              'peer size-5 cursor-pointer appearance-none rounded-[var(--radius-xs)] border bg-paper transition-colors checked:border-ink checked:bg-ink hover:border-ink data-[force=hover]:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-ember disabled:cursor-not-allowed',
              error ? 'border-danger' : 'border-line-strong',
            )}
          />
          <Check aria-hidden strokeWidth={3} className="pointer-events-none absolute inset-0.5 size-4 text-paper opacity-0 peer-checked:opacity-100" />
        </span>
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="ps-8 text-[0.8125rem] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
