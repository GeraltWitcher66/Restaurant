import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'

import { COMMON } from './content'
import { Footer, Nav } from './components/Layout'
import { ToastProvider } from './components/Overlay'
import { BookingsProvider } from './lib/bookings'
import { About } from './pages/About'
import { Bookings } from './pages/Bookings'
import { Careers } from './pages/Careers'
import { Contact } from './pages/Contact'
import { Events } from './pages/Events'
import { GiftCards } from './pages/GiftCards'
import { Home } from './pages/Home'
import { LocationPage } from './pages/Location'
import { Locations } from './pages/Locations'
import { MenuPage } from './pages/Menu'
import { NotFound } from './pages/NotFound'
import { Reservations } from './pages/Reservations'
import { Styleguide } from './pages/Styleguide'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Wait for the page transition to mount the target.
      const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }), 420)
      return () => window.clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

function Pages() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        id="main"
        tabIndex={-1}
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 focus:outline-none"
      >
        <Routes location={location}>
          <Route index element={<Home />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="locations" element={<Locations />} />
          <Route path="locations/:slug" element={<LocationPage />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="events" element={<Events />} />
          <Route path="about" element={<About />} />
          <Route path="gift-cards" element={<GiftCards />} />
          <Route path="careers" element={<Careers />} />
          <Route path="contact" element={<Contact />} />
          <Route path="styleguide" element={<Styleguide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  )
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <BookingsProvider>
          <ToastProvider>
            <ScrollManager />
            <a href="#main" className="sr-only z-[100] rounded-[var(--radius-sm)] bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
              {COMMON.skip}
            </a>
            <div className="flex min-h-svh flex-col">
              <Nav />
              <Pages />
              <Footer />
            </div>
          </ToastProvider>
        </BookingsProvider>
      </BrowserRouter>
    </MotionConfig>
  )
}
