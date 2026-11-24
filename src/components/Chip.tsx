import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'
import type { Force } from './Button'

/** A toggle filter. `pressed` is announced with aria-pressed. */
export function Chip({
  pressed,
  force,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { pressed: boolean; force?: Force; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      data-force={force}
      className={cx(
        'round inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm whitespace-nowrap transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-ember active:scale-[0.98] data-[force=pressed]:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45',
        pressed
          ? 'border-ink bg-ink text-paper'
          : 'border-line-strong bg-paper text-ink-2 hover:border-ink data-[force=hover]:border-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

/** Single-choice row of options (radio group semantics). */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
  name,
}: {
  label: string
  value: T
  options: { value: T; label: string; disabled?: boolean }[]
  onChange: (v: T) => void
  className?: string
  name?: string
}) {
  const move = (dir: 1 | -1) => {
    const enabled = options.filter((o) => !o.disabled)
    const i = enabled.findIndex((o) => o.value === value)
    const next = enabled[(i + dir + enabled.length) % enabled.length]
    onChange(next.value)
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-seg="${name ?? label}"] [data-value="${next.value}"]`)?.focus())
  }
  return (
    <div
      role="radiogroup"
      aria-label={label}
      data-seg={name ?? label}
      data-field={name}
      className={cx('flex flex-wrap gap-2', className)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          move(1)
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          move(-1)
        }
      }}
    >
      {options.map((o) => {
        const checked = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={checked}
            data-value={o.value}
            disabled={o.disabled}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cx(
              'inline-flex h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] border px-4 text-sm font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:cursor-not-allowed disabled:border-line disabled:text-faint disabled:line-through',
              checked ? 'border-ink bg-ink text-paper' : 'border-line-strong bg-paper text-ink hover:border-ink',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
