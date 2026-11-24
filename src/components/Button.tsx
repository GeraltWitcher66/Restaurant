import { ArrowRight } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

import { cx } from '../lib/cx'
import { Spinner } from './Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ember'
export type ButtonSize = 'sm' | 'md' | 'lg'
/** Pins a visual state for the style guide. */
export type Force = 'hover' | 'focus' | 'pressed'

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] font-medium transition-[background-color,color,border-color,transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-soft)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] data-[force=focus]:shadow-[var(--shadow-focus)] active:scale-[0.98] data-[force=pressed]:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100 aria-busy:cursor-progress'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink-2 data-[force=hover]:bg-ink-2 data-[force=pressed]:bg-black',
  ember: 'bg-ember text-paper hover:bg-ember-deep data-[force=hover]:bg-ember-deep data-[force=pressed]:bg-ember-deep',
  secondary: 'border border-line-strong bg-paper text-ink hover:border-ink data-[force=hover]:border-ink data-[force=pressed]:bg-sand',
  ghost: 'text-ink hover:bg-sand data-[force=hover]:bg-sand data-[force=pressed]:bg-line',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-[0.9375rem]',
  lg: 'h-14 px-7 text-base',
}

export const buttonClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) =>
  cx(base, variants[variant], sizes[size], className)

type Common = { variant?: ButtonVariant; size?: ButtonSize; force?: Force; arrow?: boolean; children: ReactNode }

export function Button({
  variant,
  size,
  force,
  loading,
  arrow,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      type={type}
      data-force={force}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, size, className)}
      {...rest}
    >
      {loading && <Spinner className="size-4" />}
      <span className={cx('inline-flex items-center gap-2', loading && 'opacity-80')}>{children}</span>
      {arrow && !loading && <ArrowRight aria-hidden className="size-4 transition-transform duration-[var(--duration-base)] group-hover/btn:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover/btn:-translate-x-0.5" />}
    </button>
  )
}

export function ButtonLink({ variant, size, force, arrow, className, children, ...rest }: Common & LinkProps) {
  return (
    <Link data-force={force} className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {arrow && <ArrowRight aria-hidden className="size-4 transition-transform duration-[var(--duration-base)] group-hover/btn:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover/btn:-translate-x-0.5" />}
    </Link>
  )
}

export function IconButton({
  className,
  size = 'md',
  force,
  variant = 'ghost',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'sm' | 'md'; force?: Force; variant?: 'ghost' | 'secondary'; 'aria-label': string }) {
  return (
    <button
      type="button"
      data-force={force}
      className={cx(
        base,
        variant === 'ghost' ? variants.ghost : variants.secondary,
        size === 'sm' ? 'size-10' : 'size-11',
        'round rounded-full p-0',
        className,
      )}
      {...rest}
    />
  )
}

/** The reference's text link with a long arrow: "Reserve a Table →". */
export function ArrowLink({ className, children, force, muted, ...rest }: LinkProps & { force?: Force; muted?: boolean }) {
  return (
    <Link
      data-force={force}
      className={cx(
        'group/arrow inline-flex min-h-10 items-center gap-1.5 text-sm font-medium focus-visible:outline-offset-2 data-[force=focus]:outline-2 data-[force=focus]:outline-ember',
        muted ? 'text-muted hover:text-ink data-[force=hover]:text-ink' : 'text-ink',
        className,
      )}
      {...rest}
    >
      <span className="link-underline" data-force={force === 'hover' ? 'hover' : undefined}>
        {children}
      </span>
      <LongArrow className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-soft)] group-hover/arrow:translate-x-1 group-data-[force=hover]/arrow:translate-x-1 rtl:-scale-x-100 rtl:group-hover/arrow:-translate-x-1" />
    </Link>
  )
}

export function LongArrow({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 18 10" className={cx('h-2.5 w-[18px] shrink-0 rtl:-scale-x-100', className)} fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M0 5h16.5M12.5 1l4 4-4 4" />
    </svg>
  )
}
