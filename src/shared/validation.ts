// Validation shared by the browser forms and the Worker routes, so both give
// the same answer. Each validator returns field errors keyed by field name;
// an empty object means the input is good.

export type Errors = Record<string, string>

export const LOCATION_SLUGS = ['tajrish', 'jordan', 'saadatabad', 'qeytarieh', 'karimkhan', 'tehranpars'] as const
export const MAX_PARTY = 8
export const BOOKING_WINDOW_DAYS = 60

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+()\-.\s\d]{7,20}$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const num = (v: unknown) => (typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN)
const toman = (n: number) => n.toLocaleString('fa-IR')

export function isEmail(v: unknown) {
  return EMAIL.test(str(v))
}

export function todayISO(now = new Date()) {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDaysISO(iso: string, days: number) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d + days)
  return todayISO(date)
}

/** Day of week (0 = Sunday) for an ISO date, independent of timezone. */
export function weekday(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

function checkName(e: Errors, key: string, v: unknown, label = 'نام‌تان') {
  const s = str(v)
  if (s.length < 2) e[key] = `${label} را وارد کنید.`
  else if (s.length > 80) e[key] = 'کمتر از ۸۰ نویسه بنویسید.'
}

function checkEmail(e: Errors, key: string, v: unknown) {
  if (!str(v)) e[key] = 'نشانی ایمیل را وارد کنید.'
  else if (!isEmail(v)) e[key] = 'ایمیل را به شکل name@example.com بنویسید.'
}

function checkLocation(e: Errors, key: string, v: unknown, optional = false) {
  const s = str(v)
  if (!s && optional) return
  if (!(LOCATION_SLUGS as readonly string[]).includes(s)) e[key] = 'یک شعبه انتخاب کنید.'
}

function checkDate(e: Errors, key: string, v: unknown, today: string, windowDays = BOOKING_WINDOW_DAYS) {
  const s = str(v)
  if (!DATE.test(s)) {
    e[key] = 'تاریخ را انتخاب کنید.'
    return
  }
  if (s < today) e[key] = 'تاریخی از امروز به بعد انتخاب کنید.'
  else if (s > addDaysISO(today, windowDays)) e[key] = `رزرو تا ${windowDays.toLocaleString('fa-IR')} روز بعد پذیرفته می‌شود.`
}

function checkLength(e: Errors, key: string, v: unknown, max: number, min = 0, label = 'پیام') {
  const s = str(v)
  if (s.length < min) e[key] = min > 1 ? `دست‌کم ${min.toLocaleString('fa-IR')} نویسه بنویسید.` : `${label} را وارد کنید.`
  else if (s.length > max) e[key] = `کمتر از ${max.toLocaleString('fa-IR')} نویسه بنویسید.`
}

export type AvailabilityQuery = { location: string; date: string; party: number }

export function validateAvailability(q: Partial<Record<keyof AvailabilityQuery, unknown>>, today = todayISO()): Errors {
  const e: Errors = {}
  checkLocation(e, 'location', q.location)
  checkDate(e, 'date', q.date, today)
  const party = num(q.party)
  if (!Number.isInteger(party) || party < 1) e.party = 'تعداد مهمان‌ها را انتخاب کنید.'
  else if (party > MAX_PARTY) e.party = `برای بیش از ${MAX_PARTY.toLocaleString('fa-IR')} نفر، مهمانی خصوصی را انتخاب کنید.`
  return e
}

export type ReservationInput = {
  location: string
  date: string
  party: number
  time: string
  seating: string
  name: string
  email: string
  phone: string
  occasion?: string
  notes?: string
  policy: boolean
}

export function validateReservation(body: Partial<Record<keyof ReservationInput, unknown>>, today = todayISO()): Errors {
  const e = validateAvailability(body, today)
  if (!TIME.test(str(body.time))) e.time = 'یک ساعت انتخاب کنید.'
  if (!['dining', 'counter', 'patio'].includes(str(body.seating))) e.seating = 'محل نشستن را انتخاب کنید.'
  checkName(e, 'name', body.name)
  checkEmail(e, 'email', body.email)
  if (!PHONE.test(str(body.phone))) e.phone = 'شماره‌ای وارد کنید که روز رزرو در دسترس باشید.'
  checkLength(e, 'notes', body.notes, 300)
  if (body.policy !== true) e.policy = 'لطفاً قواعد رزرو را تأیید کنید.'
  return e
}

export function validateEventBooking(body: Record<string, unknown>): Errors {
  const e: Errors = {}
  if (!str(body.event)) e.event = 'یک رویداد انتخاب کنید.'
  const seats = num(body.seats)
  if (!Number.isInteger(seats) || seats < 1 || seats > 8) e.seats = 'بین ۱ تا ۸ صندلی انتخاب کنید.'
  checkName(e, 'name', body.name)
  checkEmail(e, 'email', body.email)
  return e
}

export function validateEnquiry(body: Record<string, unknown>, today = todayISO()): Errors {
  const e: Errors = {}
  checkLocation(e, 'location', body.location)
  checkDate(e, 'date', body.date, today, 365)
  const guests = num(body.guests)
  if (!Number.isInteger(guests) || guests < 8) e.guests = 'مهمانی خصوصی از ۸ مهمان شروع می‌شود.'
  else if (guests > 200) e.guests = 'برای بیش از ۲۰۰ مهمان، مستقیم به events@ بنویسید.'
  if (!str(body.format)) e.format = 'شکل پذیرایی را انتخاب کنید.'
  checkName(e, 'name', body.name)
  checkEmail(e, 'email', body.email)
  checkLength(e, 'company', body.company, 80)
  checkLength(e, 'message', body.message, 1000, 10)
  return e
}

export function validateContact(body: Record<string, unknown>): Errors {
  const e: Errors = {}
  if (!str(body.topic)) e.topic = 'موضوع را انتخاب کنید.'
  checkLocation(e, 'location', body.location, true)
  checkName(e, 'name', body.name)
  checkEmail(e, 'email', body.email)
  checkLength(e, 'message', body.message, 2000, 10)
  return e
}

export const GIFT_MIN = 200000
export const GIFT_MAX = 10000000

export function validateGiftCard(body: Record<string, unknown>, today = todayISO()): Errors {
  const e: Errors = {}
  const amount = num(body.amount)
  if (!Number.isFinite(amount) || amount < GIFT_MIN || amount > GIFT_MAX || Math.round(amount) !== amount)
    e.amount = `مبلغی درست بین ${toman(GIFT_MIN)} و ${toman(GIFT_MAX)} تومان انتخاب کنید.`
  if (!['ember', 'salt', 'char'].includes(str(body.design))) e.design = 'یک طرح انتخاب کنید.'
  checkName(e, 'to', body.to, 'نام دریافت‌کننده')
  checkEmail(e, 'toEmail', body.toEmail)
  checkName(e, 'from', body.from)
  checkEmail(e, 'fromEmail', body.fromEmail)
  checkLength(e, 'message', body.message, 240)
  checkDate(e, 'sendOn', body.sendOn, today, 365)
  return e
}

export function validateApplication(body: Record<string, unknown>): Errors {
  const e: Errors = {}
  if (!str(body.role)) e.role = 'یک موقعیت انتخاب کنید.'
  checkName(e, 'name', body.name)
  checkEmail(e, 'email', body.email)
  if (str(body.phone) && !PHONE.test(str(body.phone))) e.phone = 'شمارهٔ معتبر وارد کنید یا خالی بگذارید.'
  const link = str(body.link)
  if (link && !/^https?:\/\/\S+\.\S+/.test(link)) e.link = 'پیوند کامل با https:// وارد کنید یا خالی بگذارید.'
  checkLength(e, 'message', body.message, 1500, 20)
  return e
}

export function validateSubscribe(body: Record<string, unknown>): Errors {
  const e: Errors = {}
  checkEmail(e, 'email', body.email)
  return e
}
