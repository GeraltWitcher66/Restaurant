import { Menu as MenuIcon, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'

import { BRAND, COMMON, FOOTER, LOCATIONS, NAV } from '../content'
import { cx } from '../lib/cx'
import { ArrowLink, IconButton } from './Button'
import { NewsletterForm } from './NewsletterForm'
import { Drawer } from './Overlay'

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" aria-label={`${BRAND.name}، صفحهٔ خانه`} className={cx('inline-flex min-h-10 items-center font-serif text-[1.625rem] leading-none tracking-[-0.01em] text-ink', className)}>
      <span className="font-medium">{BRAND.first}</span>
      <span className="ms-[0.22em] italic">{BRAND.second}</span>
    </Link>
  )
}

/** Nav link: the current page is set in italic serif, the rest in small grey sans, as in the reference. */
function NavItem({ to, label, onClick, large }: { to: string; label: string; onClick?: () => void; large?: boolean }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        cx(
          'inline-flex min-h-10 items-center transition-colors duration-[var(--duration-fast)]',
          large ? 'text-[2rem] font-serif' : 'px-[7px] text-[0.875rem]',
          isActive ? 'font-serif text-ink italic' : large ? 'text-ink hover:italic' : 'text-muted hover:text-ink',
          isActive && !large && 'text-[0.9375rem]',
        )
      }
    >
      {label}
    </NavLink>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className={cx('sticky top-0 z-50 bg-paper/95 backdrop-blur transition-shadow duration-[var(--duration-base)]', scrolled && 'shadow-[0_1px_0_var(--color-line)]')}>
      <div className="container-page grid h-[72px] grid-cols-[1fr_auto] items-center lg:h-[88px] lg:grid-cols-[1fr_auto_1fr]">
        <Logo className="justify-self-start" />
        <nav aria-label="منوی اصلی" className="hidden lg:block">
          <ul className="flex items-center gap-[5px]">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavItem {...n} />
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center justify-self-end gap-2">
          <ArrowLink to="/reservations" className="hidden sm:inline-flex">
            {COMMON.reserve}
          </ArrowLink>
          <IconButton aria-label={COMMON.menuOpen} aria-expanded={open} onClick={() => setOpen(true)} className="-me-2 lg:hidden">
            <MenuIcon className="size-5" />
          </IconButton>
        </div>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} label="منو">
        <div className="flex items-center justify-between">
          <Logo />
          <IconButton aria-label={COMMON.menuClose} onClick={() => setOpen(false)} className="-me-2">
            <X className="size-5" />
          </IconButton>
        </div>
        <nav aria-label="منوی موبایل" className="mt-8 flex-1">
          <ul className="flex flex-col gap-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavItem {...n} large onClick={() => setOpen(false)} />
              </li>
            ))}
          </ul>
        </nav>
        <ArrowLink to="/reservations" className="mt-6 text-base">
          {COMMON.reserve}
        </ArrowLink>
      </Drawer>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-cream md:mt-32 on-dark">
      <div className="container-page grid gap-12 pt-16 pb-10 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-5">
          <p className="font-serif text-[2.5rem] leading-none">
            <span className="font-medium">{BRAND.first}</span> <span className="italic">{BRAND.second}</span>
          </p>
          <p className="mt-4 max-w-sm text-[0.9375rem] text-cream/80">{BRAND.tagline}</p>
          <div className="mt-8 max-w-md">
            <p className="font-serif text-2xl italic">{FOOTER.newsletterTitle}</p>
            <p className="mt-1 mb-4 text-sm text-cream/80">{FOOTER.newsletterBody}</p>
            <NewsletterForm dark />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 md:grid-cols-4">
          {FOOTER.columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm text-cream/70">{col.title}</p>
              <ul className="mt-3 space-y-0.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="inline-flex min-h-10 min-w-10 items-center text-[0.9375rem] text-cream hover:italic">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-sm text-cream/70">شعبه‌ها</p>
            <ul className="mt-3 space-y-0.5">
              {LOCATIONS.map((l) => (
                <li key={l.slug}>
                  <Link to={`/locations/${l.slug}`} className="inline-flex min-h-10 min-w-10 items-center text-[0.9375rem] text-cream hover:italic">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-cream/15 py-6 text-[0.8125rem] text-cream/70 md:flex-row md:justify-between">
        <p>{FOOTER.legal}</p>
        <p>
          <a href={`mailto:${BRAND.email}`} className="inline-flex min-h-10 items-center hover:text-cream">
            {BRAND.email}
          </a>
        </p>
      </div>
    </footer>
  )
}
