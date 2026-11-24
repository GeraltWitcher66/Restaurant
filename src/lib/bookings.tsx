import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

// Bookings made on this device. The Worker validates and acknowledges each
// one; this store is what the "Your bookings" page reads. Swap it for an API
// call when bookings live in a real system.

export type Booking = {
  reference: string
  kind: 'table' | 'event'
  location: string
  date: string
  time: string
  party: number
  name: string
  email: string
  title?: string
  seating?: string
  occasion?: string
  total?: number
  createdAt: number
  status: 'confirmed' | 'cancelled'
}

const KEY = 'atashonamak:bookings'

function read(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? (parsed as Booking[]) : []
  } catch {
    return []
  }
}

type Ctx = { bookings: Booking[]; add: (b: Booking) => void; cancel: (reference: string) => void }
const BookingsContext = createContext<Ctx>({ bookings: [], add: () => {}, cancel: () => {} })

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(read)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(bookings))
    } catch {
      /* storage full or blocked: bookings stay for this visit */
    }
  }, [bookings])
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setBookings(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  const add = useCallback((b: Booking) => setBookings((list) => [b, ...list]), [])
  const cancel = useCallback(
    (reference: string) => setBookings((list) => list.map((b) => (b.reference === reference ? { ...b, status: 'cancelled' as const } : b))),
    [],
  )
  const value = useMemo(() => ({ bookings, add, cancel }), [bookings, add, cancel])
  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>
}

export const useBookings = () => useContext(BookingsContext)

/** A small persisted value (preferred location, menu filters). */
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignore */
    }
  }, [key, value])
  return [value, setValue] as const
}
