import { AlertCircle, CheckCircle2, ChevronDown, type LucideIcon } from 'lucide-react'
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import { useId, useState, type ReactNode } from 'react'
import { Link } from 'react-router'

import { PHOTOS, type PhotoKey } from '../content'
import { cx } from '../lib/cx'
import { LongArrow } from './Button'

/** Label over a value, with an optional link and sub line: the hero's meta row. */
export function Meta({ label, value, sub, to, className }: { label: string; value: ReactNode; sub?: string; to?: string; className?: string }) {
  const body = (
    <>
      <span className="label block">{label}</span>
      <span className="mt-0.5 inline-flex items-center gap-2 text-[0.9375rem] leading-tight font-semibold tracking-[0.01em] text-ink">
        {value}
        {to && <LongArrow className="transition-transform duration-[var(--duration-base)] group-hover/meta:translate-x-1 rtl:group-hover/meta:-translate-x-1" />}
      </span>
      {sub && <span className="mt-0.5 block text-[0.8125rem] text-faint">{sub}</span>}
    </>
  )
  return to ? (
    <Link to={to} className={cx('group/meta block w-fit', className)}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  )
}

/** Every photo goes through PHOTOS in content.ts, so swapping photography is one edit. */
export function Photo({
  photo,
  alt,
  className,
  imgClassName,
  priority,
  ratio,
}: {
  photo: PhotoKey
  alt: string
  className?: string
  imgClassName?: string
  priority?: boolean
  ratio?: string
}) {
  return (
    <div className={cx('relative overflow-hidden rounded-[var(--radius-md)] bg-cream', className)} style={ratio ? { aspectRatio: ratio } : undefined}>
      <img
        src={PHOTOS[photo]}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cx('absolute inset-0 size-full object-cover', imgClassName)}
      />
    </div>
  )
}

/** Serif title with the reference's italic aside, e.g. "Menu (autumn)". */
export function PageHeader({ title, aside, intro, children }: { title: string; aside?: string; intro?: ReactNode; children?: ReactNode }) {
  return (
    <header className="container-page pt-10 pb-10 md:pt-16 md:pb-14">
      <h1 className="font-display text-center text-display text-balance">
        <span className="inline-block animate-rise">{title}</span>
        {aside && (
          <span className="mt-1 block animate-rise text-[0.62em] text-ink-2 italic [animation-delay:120ms]" style={{ fontWeight: 400 }}>
            {aside}
          </span>
        )}
      </h1>
      {intro && <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-center text-[1.0625rem] text-pretty text-muted [animation-delay:200ms]">{intro}</p>}
      {children}
    </header>
  )
}

export function SectionHeading({ title, aside, action, className, id }: { title: string; aside?: string; action?: ReactNode; className?: string; id?: string }) {
  return (
    <div className={cx('flex flex-wrap items-end justify-between gap-x-6 gap-y-3', className)}>
      <h2 id={id} className="font-display text-[clamp(2.25rem,1.6rem+2.4vw,3.75rem)]">
        {title}
        {aside && <span className="ms-3 align-[0.12em] text-[0.55em] font-normal text-ink-2 italic">{aside}</span>}
      </h2>
      {action}
    </div>
  )
}

const badgeTones = {
  neutral: 'bg-sand text-ink-2',
  outline: 'border border-line-strong text-ink-2',
  ember: 'bg-ember-soft text-ember-deep',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  ink: 'bg-ink text-paper',
} as const

export function Badge({ tone = 'neutral', children, className, title }: { tone?: keyof typeof badgeTones; children: ReactNode; className?: string; title?: string }) {
  return (
    <span title={title} className={cx('round inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-medium whitespace-nowrap', badgeTones[tone], className)}>
      {children}
    </span>
  )
}

/** Live open/closed indicator; the dot flickers like a coal while open. */
export function OpenDot({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="round relative inline-flex size-2">
      {open && <span className="round absolute inset-0 animate-flicker rounded-full bg-success/60" />}
      <span className={cx('round relative size-2 rounded-full', open ? 'bg-success' : 'bg-faint')} />
    </span>
  )
}

export function EmptyState({ title, body, action, icon: Icon }: { title: string; body: string; action?: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="flex flex-col items-center rounded-[var(--radius-md)] border border-dashed border-line-strong px-6 py-14 text-center">
      {Icon && <Icon aria-hidden className="mb-4 size-6 text-muted" strokeWidth={1.5} />}
      <p className="font-display text-3xl">{title}</p>
      <p className="mt-2 max-w-sm text-[0.9375rem] text-muted">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

/** Form-level message. Errors are assertive; successes polite. */
export function Notice({ tone, children, className }: { tone: 'error' | 'success' | 'info'; children: ReactNode; className?: string }) {
  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx(
        'flex items-start gap-3 rounded-[var(--radius-sm)] px-4 py-3 text-sm',
        tone === 'error' && 'bg-danger-soft text-danger',
        tone === 'success' && 'bg-success-soft text-success',
        tone === 'info' && 'bg-sand text-ink-2',
        className,
      )}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  )
}

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ delay = 0, y = 18, ...rest }: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    />
  )
}

export function Accordion({ items, className }: { items: { q: string; a: ReactNode }[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0)
  const id = useId()
  return (
    <div className={cx('divide-y border-y', className)}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                id={`${id}-${i}-btn`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-14 w-full items-center justify-between gap-6 py-4 text-start text-[1.0625rem] font-medium focus-visible:outline-offset-0"
              >
                {item.q}
                <ChevronDown aria-hidden className={cx('size-5 shrink-0 text-muted transition-transform duration-[var(--duration-base)]', isOpen && 'rotate-180')} />
              </button>
            </h3>
            <div id={`${id}-${i}`} role="region" aria-labelledby={`${id}-${i}-btn`} hidden={!isOpen} className="pb-5 text-[0.9375rem] text-muted">
              {item.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="مراحل رزرو">
      {steps.map((s, i) => (
        <li key={s} aria-current={i === current ? 'step' : undefined} className={cx('flex items-center gap-2 text-sm', i <= current ? 'text-ink' : 'text-faint')}>
          <span
            className={cx(
              'round flex size-6 items-center justify-center rounded-full border text-xs font-semibold',
              i < current && 'border-ink bg-ink text-paper',
              i === current && 'border-ink',
              i > current && 'border-line-strong',
            )}
          >
            {i + 1}
          </span>
          <span className={cx(i === current && 'font-medium')}>{s}</span>
        </li>
      ))}
    </ol>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cx('skeleton rounded-[var(--radius-sm)]', className)} />
}
