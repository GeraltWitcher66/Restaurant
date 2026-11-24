// Every string, every price and all seed data for the site lives here.
// Edit this file to make the site yours: brand, branches, menu, events,
// roles and copy. Photos are routed through `PHOTOS` so real photography can
// be swapped in by changing one path each.

export const PHOTOS = {
  hero: '/images/hero.webp',
  joojeh: '/images/hero.webp',
  skewers: '/images/skewers.webp',
  nan: '/images/flatbread.webp',
  dessert: '/images/cheesecake.webp',
  vegetables: '/images/leeks.webp',
  chef: '/images/chef.webp',
  privateRoom: '/images/private-room.webp',
  tajrish: '/images/loc-east-village.webp',
  jordan: '/images/loc-williamsburg.webp',
  saadatabad: '/images/loc-west-loop.webp',
  qeytarieh: '/images/loc-silver-lake.webp',
  karimkhan: '/images/loc-capitol-hill.webp',
  tehranpars: '/images/loc-east-austin.webp',
} as const

export type PhotoKey = keyof typeof PHOTOS

export const BRAND = {
  name: 'آتش و نمک',
  first: 'آتش و',
  second: 'نمک',
  founded: '۱۳۹۱',
  founder: 'نگار کیانی',
  service: 'آشپزخانهٔ چوب‌سوز',
  email: 'hello@atashonamak.ir',
  phone: '۰۲۱-۲۲۶۵۴۱۷۸',
  tagline: 'شش شعبه در تهران، یک آتش. بشقاب‌های فصلی روی چوب بلوط، با نمک دریا.',
}

export const NAV = [
  { to: '/', label: 'خانه' },
  { to: '/about', label: 'دربارهٔ ما' },
  { to: '/menu', label: 'منو' },
  { to: '/locations', label: 'شعبه‌ها' },
  { to: '/events', label: 'رویدادها' },
  { to: '/reservations', label: 'رزرو میز' },
  { to: '/contact', label: 'تماس' },
] as const

export const FOOTER = {
  columns: [
    {
      title: 'دیدن',
      links: [
        { to: '/locations', label: 'همهٔ شعبه‌ها' },
        { to: '/reservations', label: 'رزرو میز' },
        { to: '/bookings', label: 'رزروهای من' },
        { to: '/menu', label: 'منو' },
      ],
    },
    {
      title: 'دور هم',
      links: [
        { to: '/events', label: 'رویدادها' },
        { to: '/events#private-dining', label: 'مهمانی خصوصی' },
        { to: '/gift-cards', label: 'کارت هدیه' },
      ],
    },
    {
      title: 'خانه',
      links: [
        { to: '/about', label: 'داستان ما' },
        { to: '/careers', label: 'همکاری با ما' },
        { to: '/contact', label: 'تماس' },
        { to: '/styleguide', label: 'راهنمای طراحی' },
      ],
    },
  ],
  newsletterTitle: 'نامه‌هایی از کنار آتش',
  newsletterBody: 'ماهی یک ایمیل: منوی تازه، سرآشپز مهمان و گاهی یک دستور پخت. بی‌سر و صدا.',
  legal: `© ${new Date().getFullYear()} آتش و نمک. این سایت نمونه است: رزروها و سفارش‌ها فقط در مرورگر شما ذخیره می‌شوند.`,
}

/* ------------------------------------------------------------------ */
/* Locations                                                           */
/* ------------------------------------------------------------------ */

/** Opening hours by weekday (0 = Sunday) as [open, close] in minutes after midnight, or null when closed. */
export type Hours = ([number, number] | null)[]

export type Location = {
  slug: string
  name: string
  city: string
  region: string
  address: string
  postcode: string
  phone: string
  email: string
  opened: string
  chef: string
  seats: number
  lon: number
  lat: number
  photo: PhotoKey
  hours: Hours
  features: string[]
  privateRoom?: { name: string; seated: number; standing: number }
  blurb: string
  transit: string
}

const h = (open: string, close: string): [number, number] => {
  const m = (t: string) => {
    const [hh, mm] = t.split(':').map(Number)
    return hh * 60 + mm
  }
  return [m(open), m(close)]
}

export const LOCATIONS: Location[] = [
  {
    slug: 'tajrish',
    name: 'تجریش',
    city: 'تهران',
    region: 'منطقه ۱',
    address: 'خیابان ولیعصر، بالاتر از میدان تجریش، پلاک ۲۱۲',
    postcode: 'کد پستی ۱۹۶۸۷۴۳۱۱۲',
    phone: '۰۲۱-۲۲۶۵۴۱۷۸',
    email: 'tajrish@atashonamak.ir',
    opened: '۱۳۹۱',
    chef: 'نگار کیانی',
    seats: 64,
    lon: 51.434,
    lat: 35.805,
    photo: 'tajrish',
    hours: [h('12:00', '23:00'), h('12:00', '23:00'), h('12:00', '23:00'), h('12:00', '23:00'), h('12:00', '24:00'), h('12:00', '24:00'), h('12:00', '24:00')],
    features: ['میز روبه‌روی آتش', 'حیاط کوچک', 'ناهار کاری', 'دسترسی بدون پله'],
    privateRoom: { name: 'اتاق بلوط', seated: 18, standing: 30 },
    blurb: 'جایی که شروع کردیم: دوازده صندلی دور یک آتش در تجریش. همان میز هنوز اولین مهمان‌های شب را می‌نشاند.',
    transit: 'مترو تجریش (خط ۱)، سه دقیقه پیاده. ایستگاه اتوبوس تندرو میدان تجریش روبه‌روی در.',
  },
  {
    slug: 'jordan',
    name: 'جردن',
    city: 'تهران',
    region: 'منطقه ۳',
    address: 'خیابان جردن (نلسون ماندلا)، نبش کوچهٔ یاسمن، پلاک ۸۸',
    postcode: 'کد پستی ۱۹۶۸۶۵۴۳۲۱',
    phone: '۰۲۱-۸۸۶۵۹۲۴۰',
    email: 'jordan@atashonamak.ir',
    opened: '۱۳۹۴',
    chef: 'سهیل رستمی',
    seats: 110,
    lon: 51.41,
    lat: 35.757,
    photo: 'jordan',
    hours: [h('12:00', '24:00'), h('12:00', '24:00'), h('12:00', '24:00'), h('12:00', '24:00'), h('12:00', '24:00'), h('12:00', '24:00'), h('12:00', '24:00')],
    features: ['حیاط و تراس', 'موسیقی زنده پنجشنبه‌ها', 'پارکینگ اختصاصی', 'دسترسی بدون پله'],
    privateRoom: { name: 'اتاق دود', seated: 28, standing: 45 },
    blurb: 'یک خانهٔ قاجاری بازسازی‌شده در جردن، با حیاطی که به‌محض گرم شدن هوا باز می‌شود و چای بعد از شام را طولانی می‌کند.',
    transit: 'ایستگاه اتوبوس تندرو ونک، پنج دقیقه پیاده. پارکینگ اختصاصی از کوچهٔ یاسمن.',
  },
  {
    slug: 'saadatabad',
    name: 'سعادت‌آباد',
    city: 'تهران',
    region: 'منطقه ۲',
    address: 'بلوار دریا، نبش کوچهٔ مطهری، پلاک ۳۲',
    postcode: 'کد پستی ۱۹۹۸۷۱۴۴۵۶',
    phone: '۰۲۱-۲۲۱۴۵۶۷۸',
    email: 'saadatabad@atashonamak.ir',
    opened: '۱۳۹۶',
    chef: 'مریم بهرامی',
    seats: 96,
    lon: 51.372,
    lat: 35.78,
    photo: 'saadatabad',
    hours: [h('12:00', '23:00'), null, h('12:00', '23:00'), h('12:00', '23:00'), h('12:00', '24:00'), h('12:00', '24:00'), h('12:00', '23:30')],
    features: ['کورهٔ روباز', 'دیوار ادویه', 'ناهار آخر هفته', 'پارکینگ اختصاصی'],
    privateRoom: { name: 'بالکن غرب', seated: 24, standing: 40 },
    blurb: 'سالن بزرگ غرب تهران با کوره‌ای تمام‌قد و دیوار ادویه‌ای که برای رسیدن به قفسهٔ بالایی به نردبان نیاز دارید. دوشنبه‌ها تعطیل است.',
    transit: 'مترو صادقیه (خط ۲) و ده دقیقه تاکسی؛ پارکینگ اختصاصی در بلوار دریا.',
  },
  {
    slug: 'qeytarieh',
    name: 'قیطریه',
    city: 'تهران',
    region: 'منطقه ۳',
    address: 'خیابان شریعتی، بالاتر از پارک قیطریه، پلاک ۱۵۰۸',
    postcode: 'کد پستی ۱۹۳۹۵۴۳۲۱۸',
    phone: '۰۲۱-۲۲۲۸۴۱۹۵',
    email: 'qeytarieh@atashonamak.ir',
    opened: '۱۳۹۸',
    chef: 'آرش نیکو',
    seats: 72,
    lon: 51.448,
    lat: 35.77,
    photo: 'qeytarieh',
    hours: [h('12:30', '23:00'), h('12:30', '23:00'), h('12:30', '23:00'), h('12:30', '23:00'), h('12:30', '24:00'), h('12:30', '24:00'), h('12:30', '23:30')],
    features: ['تراس روبه‌روی پارک', 'دم‌کرده‌های گیاهی', 'منوی کودکان', 'دسترسی بدون پله'],
    blurb: 'روبه‌روی پارک قیطریه، با تراسی که تا آخر شب باز است و منویی که بیشترش از بازار روز محل پر می‌شود.',
    transit: 'مترو قیطریه (خط ۱)، دو دقیقه پیاده؛ کنار درِ جنوبی پارک قیطریه.',
  },
  {
    slug: 'karimkhan',
    name: 'کریم‌خان',
    city: 'تهران',
    region: 'منطقه ۶',
    address: 'خیابان کریم‌خان زند، بین ایرانشهر و ماهشهر، پلاک ۱۰۱',
    postcode: 'کد پستی ۱۵۹۴۸۳۳۱۱۷',
    phone: '۰۲۱-۸۸۳۰۶۲۷۴',
    email: 'karimkhan@atashonamak.ir',
    opened: '۱۴۰۰',
    chef: 'حسین صبوری',
    seats: 58,
    lon: 51.418,
    lat: 35.724,
    photo: 'karimkhan',
    hours: [h('12:00', '23:00'), h('12:00', '23:00'), h('12:00', '23:00'), h('12:00', '23:00'), h('12:00', '23:30'), h('12:00', '23:30'), h('12:00', '23:00')],
    features: ['میز روبه‌روی آتش', 'ناهار کاری', 'شام دیرهنگام', 'نزدیک به مترو'],
    privateRoom: { name: 'اتاق آتش', seated: 12, standing: 20 },
    blurb: 'شعبهٔ مرکز شهر؛ ناهار کاری سریع، شام دیرهنگام و کوتاه‌ترین فاصله از مترو. میز روبه‌روی آتش را از قبل بخواهید.',
    transit: 'مترو هفت‌تیر (خط ۱)، هفت دقیقه پیاده تا خیابان کریم‌خان.',
  },
  {
    slug: 'tehranpars',
    name: 'تهرانپارس',
    city: 'تهران',
    region: 'منطقه ۴',
    address: 'فلکهٔ سوم تهرانپارس، بلوار پروین، پلاک ۴۵',
    postcode: 'کد پستی ۱۶۵۴۷۸۹۲۱۳',
    phone: '۰۲۱-۷۷۸۹۳۲۶۱',
    email: 'tehranpars@atashonamak.ir',
    opened: '۱۴۰۳',
    chef: 'لیلا موسوی',
    seats: 140,
    lon: 51.545,
    lat: 35.735,
    photo: 'tehranpars',
    hours: [h('12:00', '23:30'), h('12:00', '23:30'), h('12:00', '23:30'), h('12:00', '23:30'), h('12:00', '24:00'), h('12:00', '24:00'), h('12:00', '23:30')],
    features: ['بزرگ‌ترین حیاط', 'موسیقی زنده پنجشنبه‌ها', 'منوی کودکان', 'دسترسی بدون پله'],
    privateRoom: { name: 'حیاط شرق', seated: 40, standing: 70 },
    blurb: 'بزرگ‌ترین آتش و بزرگ‌ترین حیاط ما در شرق تهران. پنجشنبه‌ها موسیقی زنده و میزهای بلند برای خانواده‌های بزرگ.',
    transit: 'مترو تهرانپارس (خط ۴)، پنج دقیقه پیاده تا فلکهٔ سوم.',
  },
]

export const LOCATIONS_COPY = {
  title: 'شعبه‌ها',
  aside: '(شش شعبه در تهران)',
  intro: 'هر شعبه با چوب محلی می‌سوزد و از باغ‌ها و بازارهای همان منطقه خرید می‌کند، پس منوی هر شعبه کمی با بقیه فرق دارد.',
  searchLabel: 'جست‌وجو بر اساس محله یا نشانی',
  openNow: 'همین حالا باز است',
  allCities: 'همهٔ مناطق',
  empty: { title: 'شعبه‌ای با این نشانی پیدا نشد', body: 'محلهٔ دیگری را امتحان کنید یا فیلترها را پاک کنید تا هر شش شعبه را ببینید.' },
  mapLabel: 'نقشهٔ شعبه‌های آتش و نمک در تهران',
}

/* ------------------------------------------------------------------ */
/* Menu                                                                */
/* ------------------------------------------------------------------ */

export type Diet = 'v' | 'vg' | 'gf' | 'spicy'

export const DIETS: Record<Diet, { label: string; short: string }> = {
  v: { label: 'گیاهی', short: 'گیاهی' },
  vg: { label: 'وگان', short: 'وگان' },
  gf: { label: 'بدون گلوتن', short: 'بدون گلوتن' },
  spicy: { label: 'تند', short: 'تند' },
}

export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  diets: Diet[]
  signature?: boolean
  photo?: PhotoKey
  /** Location slugs that do not serve this dish. */
  notAt?: string[]
}

export type MenuSection = { id: string; title: string; note?: string; items: MenuItem[] }

export const MENU: MenuSection[] = [
  {
    id: 'start',
    title: 'برای شروع',
    note: 'نان هر صبح در تنور سنگی پخته می‌شود و با کرهٔ حیوانی و نمک دودی سر سفره می‌آید.',
    items: [
      { id: 'nan', name: 'نان سنگک تنوری', description: 'سنگک داغ، کرهٔ حیوانی، نمک دودی', price: 95000, diets: ['v'], signature: true, photo: 'nan' },
      { id: 'mirza', name: 'میرزا قاسمی', description: 'بادمجان دودی، گوجه، سیر، تخم‌مرغ محلی', price: 185000, diets: ['v', 'gf'] },
      { id: 'olives', name: 'زیتون گرم', description: 'پوست پرتقال، دانهٔ رازیانه، رزماری', price: 120000, diets: ['vg', 'gf'] },
      { id: 'kashk', name: 'کشک بادمجان', description: 'بادمجان کبابی، کشک، نعناع داغ، پیاز داغ', price: 165000, diets: ['v', 'gf'], signature: true, photo: 'vegetables' },
      { id: 'ash', name: 'آش رشته', description: 'سبزی معطر، لوبیا، پیاز داغ، کشک', price: 155000, diets: ['v'] },
    ],
  },
  {
    id: 'small',
    title: 'پیش‌غذا',
    items: [
      { id: 'salad', name: 'سالاد شیرازی', description: 'خیار، گوجه، پیاز، آبغوره، نعناع خشک', price: 110000, diets: ['vg', 'gf'] },
      { id: 'mast', name: 'ماست موسیر', description: 'ماست چکیدهٔ محلی، موسیر، نعناع', price: 95000, diets: ['v', 'gf'] },
      { id: 'borani', name: 'بورانی اسفناج', description: 'اسفناج، ماست، گردو، زعفران', price: 135000, diets: ['v', 'gf'] },
      { id: 'dolmeh', name: 'دلمهٔ برگ مو', description: 'برگ مو، برنج، سبزی، آلوچه', price: 175000, diets: ['vg', 'gf'] },
      { id: 'koobideh', name: 'کباب کوبیده، یک سیخ', description: 'گوشت گوسفند و گوساله، پیاز، زعفران', price: 280000, diets: ['gf'] },
      { id: 'soup', name: 'سوپ جو', description: 'جو پرک، هویج، خامه، نعناع', price: 125000, diets: ['v'] },
    ],
  },
  {
    id: 'fire',
    title: 'از دل آتش',
    note: 'روی چوب بلوط پخته و با نمک دریایی درشت تمام می‌شود. برش‌های بزرگ برای شریک شدن است.',
    items: [
      { id: 'joojeh', name: 'جوجه کباب زعفرانی', description: 'زعفران، ماست، گوجهٔ کبابی، نان سنگک', price: 480000, diets: ['gf'], signature: true, photo: 'joojeh' },
      { id: 'barg', name: 'کباب برگ', description: 'راستهٔ گوسفندی، زعفران، کره، سماق', price: 760000, diets: ['gf'], signature: true, photo: 'skewers' },
      { id: 'soltani', name: 'چلوکباب سلطانی', description: 'یک سیخ برگ، یک سیخ کوبیده، برنج ایرانی', price: 980000, diets: ['gf'] },
      { id: 'mahi', name: 'قزل‌آلای دودی', description: 'ماهی تازهٔ رودخانه، لیموی سوخته، سبزی کوهی', price: 620000, diets: ['gf'], notAt: ['tehranpars'] },
      { id: 'rib', name: 'دندهٔ بره', description: 'ده ساعت روی آتش، کرهٔ سیر، سیب‌زمینی تنوری', price: 1150000, diets: ['gf'], notAt: ['karimkhan', 'qeytarieh'] },
      { id: 'eggplant', name: 'بادمجان تنوری', description: 'کشک، گردو، پیاز داغ، نان سنگک', price: 320000, diets: ['v'] },
    ],
  },
  {
    id: 'sides',
    title: 'کنار غذا',
    items: [
      { id: 'rice', name: 'برنج ایرانی', description: 'دم‌کشیده، کره، زعفران', price: 140000, diets: ['v', 'gf'] },
      { id: 'sabzi', name: 'سبزی کبابی', description: 'تره، جعفری، ریحان، لیمو', price: 115000, diets: ['vg', 'gf'] },
      { id: 'potato', name: 'سیب‌زمینی تنوری', description: 'پوست‌برشته، کرهٔ حیوانی، نمک دودی', price: 125000, diets: ['v', 'gf'] },
      { id: 'sangak', name: 'نان سنگک', description: 'تازه از تنور، کنجد', price: 60000, diets: ['v'] },
    ],
  },
  {
    id: 'sweet',
    title: 'دسر',
    items: [
      { id: 'sholeh', name: 'شله‌زرد زعفرانی', description: 'برنج، زعفران، دارچین، خلال بادام', price: 185000, diets: ['v', 'gf'], signature: true, photo: 'dessert' },
      { id: 'faloodeh', name: 'فالودهٔ شیرازی', description: 'رشتهٔ فالوده، آب لیمو، شربت گل', price: 195000, diets: ['v', 'gf'] },
      { id: 'bastani', name: 'بستنی سنتی', description: 'زعفران، خلال پسته، تکه‌های خامه', price: 210000, diets: ['v', 'gf'] },
      { id: 'halva', name: 'حلوا', description: 'آرد گندم، زعفران، گلاب، پسته', price: 160000, diets: ['v'] },
    ],
  },
  {
    id: 'drinks',
    title: 'نوشیدنی',
    note: 'منوی کامل چای و دم‌کرده‌ها در هر شعبه هست. قهوهٔ ترک با هل، آخر شب.',
    items: [
      { id: 'doogh', name: 'دوغ خانگی', description: 'ماست، نعناع خشک، گاز طبیعی', price: 90000, diets: ['v', 'gf'] },
      { id: 'saffron', name: 'شربت زعفران و بیدمشک', description: 'زعفران، بیدمشک، آب لیمو', price: 110000, diets: ['vg', 'gf'] },
      { id: 'tea', name: 'چای سیاه با نبات', description: 'چای لاهیجان، نبات زعفرانی، هل', price: 75000, diets: ['vg', 'gf'] },
      { id: 'coffee', name: 'قهوهٔ ترک', description: 'قهوهٔ آسیاب‌شده، هل', price: 95000, diets: ['vg', 'gf'] },
    ],
  },
]

export const MENU_COPY = {
  title: 'منو',
  aside: '(پاییز)',
  intro: 'منوی فصلی، پخته روی چوب بلوط. قیمت‌ها به تومان است و برای گروه‌های شش‌نفره و بیشتر ۱۰٪ حق سرویس اضافه می‌شود.',
  location: 'نمایش منوی',
  allLocations: 'همهٔ شعبه‌ها',
  search: 'جست‌وجو در منو',
  filters: 'رژیم غذایی',
  notHere: 'در این شعبه سرو نمی‌شود:',
  allergens: 'پیش از سفارش، حساسیت‌های غذایی‌تان را به گارسون بگویید. آشپزخانه‌های ما با مغزها، گلوتن، لبنیات و ماهی کار می‌کنند و نمی‌توانیم تضمین کنیم هیچ بشقابی کاملاً بدون اثر این مواد است.',
  empty: { title: 'چیزی در منو پیدا نشد', body: 'یک فیلتر را بردارید یا کلمهٔ دیگری بنویسید، مثل «آتش» یا «بادمجان».' },
  signatures: 'امضای سرآشپز',
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

export const HOME = {
  meta: {
    service: { label: 'خدمات', value: 'آشپزخانهٔ چوب‌سوز' },
    location: { label: 'شعبه', value: 'تجریش', sub: 'تهران، خیابان ولیعصر، پلاک ۲۱۲', to: '/locations/tajrish' },
    founder: { label: 'بنیان‌گذار', value: 'نگار کیانی' },
  },
  heroAlt: 'جوجه کباب زعفرانی با کنجد روی کاغذ، بشقاب سس کنارش',
  intro: {
    eyebrow: 'از سال ۱۳۹۱',
    text: 'با دوازده صندلی دور یک آتش شروع کردیم. امروز شش شعبه در تهران داریم و همه‌شان هنوز با چوب می‌پزند، با دست نمک می‌زنند و وقتی آتش خوابید، آشپزخانه را می‌بندند.',
    stats: [
      { value: '۶', label: 'شعبه' },
      { value: '۵۴۰', label: 'صندلی در هر شب' },
      { value: '۴۱', label: 'باغ و کشاورز طرف قرارداد' },
      { value: '۱', label: 'آتش در هر شعبه' },
    ],
  },
  signatures: { title: 'از دل آتش', aside: '(امضای سرآشپز)', cta: 'دیدن منوی کامل' },
  locations: { title: 'شش شعبه', aside: '(یک آتش)', cta: 'همهٔ شعبه‌ها' },
  chef: {
    eyebrow: 'بنیان‌گذار و سرآشپز',
    quote: '«آتش صادق است. هرچه پیشش بگذارید، همان را نشان می‌دهد؛ پس ما فقط چیزهای خوب پیشش می‌گذاریم.»',
    name: 'نگار کیانی',
    role: 'بنیان‌گذار، سرآشپز اجرایی',
    cta: 'خواندن داستان ما',
  },
  events: { title: 'دور یک سفره', aside: '(رویدادها)', cta: 'همهٔ رویدادها' },
  privateDining: {
    title: 'مهمانی خصوصی',
    body: 'چهار شعبه اتاقی خصوصی برای ۱۲ تا ۷۰ مهمان دارند: تولد، شام خانوادگی، یا همان شام کاری که مدام عقب می‌افتند.',
    cta: 'برنامه‌ریزی مهمانی',
  },
  reserve: {
    title: 'یک صندلی برایتان هست',
    body: 'تا ۶۰ روز بعد می‌توانید رزرو کنید. چند صندلی کنار آتش هم همیشه برای مهمان‌های سرزده نگه داشته می‌شود.',
    cta: 'رزرو میز',
  },
}

/* ------------------------------------------------------------------ */
/* Reservations                                                        */
/* ------------------------------------------------------------------ */

export const RESERVATIONS = {
  title: 'رزرو میز',
  aside: '(تا ۶۰ روز بعد)',
  intro: 'شعبه، تاریخ و تعداد مهمان‌ها را انتخاب کنید، بعد ساعت را. برای گروه‌های نُه‌نفره و بیشتر، لطفاً مهمانی خصوصی را انتخاب کنید.',
  steps: ['شعبه و زمان', 'انتخاب ساعت', 'اطلاعات شما'],
  location: 'شعبه',
  party: 'مهمان‌ها',
  date: 'تاریخ',
  findTimes: 'دیدن ساعت‌های خالی',
  loadingTimes: 'در حال بررسی دفتر رزرو',
  noTimes: { title: 'ظرفیت تکمیل است', body: 'همهٔ میزهای آن روز رزرو شده. تاریخ دیگری را امتحان کنید یا درِ شعبه برای لیست افراد سرزده ثبت‌نام کنید.' },
  closed: { title: 'آن روز تعطیل است', body: 'این شعبه در آن روز هفته تعطیل است. تاریخ یا شعبهٔ دیگری انتخاب کنید.' },
  timesTitle: 'ساعت‌های خالی',
  seating: 'نوع نشستن',
  seatingOptions: [
    { value: 'dining', label: 'سالن اصلی' },
    { value: 'counter', label: 'میز روبه‌روی آتش' },
    { value: 'patio', label: 'حیاط و تراس' },
  ],
  occasion: 'مناسبت',
  occasions: ['مناسبتی نیست', 'تولد', 'سالگرد', 'قرار دو نفره', 'کاری', 'جشن'],
  name: 'نام و نام خانوادگی',
  email: 'ایمیل',
  phone: 'شمارهٔ موبایل',
  notes: 'چیزی هست که باید بدانیم؟',
  notesHint: 'حساسیت غذایی، دسترسی، صندلی کودک. تا ۳۰۰ نویسه.',
  policy: 'می‌دانم میز ۱۵ دقیقه نگه داشته می‌شود و لغو رزرو باید تا ۲۴ ساعت قبل اطلاع داده شود.',
  submit: 'تأیید رزرو',
  back: 'بازگشت',
  next: 'ادامه',
  confirmed: {
    title: 'میزتان رزرو شد',
    body: 'این رزرو در همین مرورگر ذخیره شد. در سایت واقعی، همین حالا ایمیل تأیید برایتان می‌رفت.',
    reference: 'کد رزرو',
    manage: 'دیدن رزروهای من',
    another: 'رزرو دیگر',
  },
  conflict: 'همین الان کسی آن ساعت را رزرو کرد. ساعت دیگری انتخاب کنید.',
  genericError: 'دفتر رزرو در دسترس نبود. اتصال اینترنت را بررسی و دوباره تلاش کنید.',
}

export const BOOKINGS = {
  title: 'رزروهای من',
  aside: '(همین مرورگر)',
  intro: 'رزروهایی که با این دستگاه ثبت کرده‌اید. تا ۲۴ ساعت قبل قابل لغو است.',
  upcoming: 'پیش رو',
  past: 'گذشته و لغوشده',
  empty: { title: 'هنوز رزروی ثبت نشده', body: 'وقتی میز یا صندلی رویدادی رزرو کنید، اینجا نمایش داده می‌شود.', cta: 'رزرو میز' },
  cancel: 'لغو رزرو',
  cancelTitle: 'این رزرو لغو شود؟',
  cancelBody: 'میز به دفتر برمی‌گردد و اگر بعداً پشیمان شوید، نمی‌توانیم آن را نگه داریم.',
  keep: 'نگهش دار',
  confirmCancel: 'بله، لغو کن',
  cancelled: 'لغوشده',
  cancelledToast: 'رزرو لغو شد',
}

/* ------------------------------------------------------------------ */
/* Events and private dining                                           */
/* ------------------------------------------------------------------ */

export type EventItem = {
  id: string
  title: string
  date: string // ISO date
  time: string
  location: string // slug
  price: number
  seats: number
  seatsLeft: number
  kind: 'شام ویژه' | 'کلاس' | 'چشایی' | 'موسیقی'
  description: string
  photo: PhotoKey
}

export const EVENTS: EventItem[] = [
  { id: 'lamb-feast', title: 'شام برهٔ کامل', date: '2026-11-27', time: '19:30', location: 'tehranpars', price: 1450000, seats: 40, seatsLeft: 12, kind: 'شام ویژه', description: 'یک برهٔ کامل، هشت بشقاب، از سر تا دم. میزهای بلند، بشقاب‌های مشترک و دوغ خانگی بی‌حساب.', photo: 'tehranpars' },
  { id: 'fire-class', title: 'آشپزی روی آتش', date: '2026-12-04', time: '11:00', location: 'saadatabad', price: 2200000, seats: 12, seatsLeft: 4, kind: 'کلاس', description: 'سه ساعت کنار کوره با سرآشپز مریم بهرامی: روشن کردن آتش، خواندن زغال و پختن یک ناهار کامل که آخرش می‌خورید.', photo: 'chef' },
  { id: 'music-night', title: 'شب موسیقی سنتی', date: '2026-12-11', time: '20:00', location: 'karimkhan', price: 650000, seats: 30, seatsLeft: 0, kind: 'موسیقی', description: 'سه‌نوازی تار، کمانچه و تنبک در سالن مرکز شهر، همراه با دسر و چای.', photo: 'karimkhan' },
  { id: 'yalda', title: 'شب یلدا در حیاط', date: '2026-12-21', time: '19:00', location: 'jordan', price: 1750000, seats: 64, seatsLeft: 22, kind: 'شام ویژه', description: 'بلندترین شب سال با انار، هندوانه، آجیل و منوی ویژهٔ یلدا در حیاط خانهٔ جردن.', photo: 'jordan' },
  { id: 'hafez', title: 'شب حافظ و فال', date: '2027-01-08', time: '18:30', location: 'tajrish', price: 850000, seats: 24, seatsLeft: 9, kind: 'چشایی', description: 'فال حافظ با صدای بلند، چهار دم‌کردهٔ گیاهی و بشقاب‌های کوچک از منوی زمستان.', photo: 'tajrish' },
  { id: 'courtyard', title: 'کنسرت حیاط', date: '2027-01-15', time: '20:00', location: 'qeytarieh', price: 0, seats: 120, seatsLeft: 64, kind: 'موسیقی', description: 'موسیقی زندهٔ رایگان در حیاط، هر پنجشنبه. این هفته: یک گروه شش‌نفرهٔ محلی. برای تضمین صندلی، میز رزرو کنید.', photo: 'qeytarieh' },
]

export const EVENTS_COPY = {
  title: 'رویدادها',
  aside: '(و مهمانی خصوصی)',
  intro: 'شام‌های ویژه، کلاس و شب‌های موسیقی در شش شعبه. صندلی‌ها محدودند و به اولین رزروکننده‌ها می‌رسد.',
  filterAll: 'همهٔ شعبه‌ها',
  book: 'رزرو صندلی',
  soldOut: 'تکمیل',
  free: 'رایگان',
  left: (n: number) => (n === 1 ? '۱ صندلی باقی مانده' : `${n.toLocaleString('fa-IR')} صندلی باقی مانده`),
  perGuest: 'برای هر نفر',
  empty: { title: 'فعلاً برنامه‌ای در این شعبه نیست', body: 'این شعبه رویدادی در تقویم ندارد. شعبهٔ دیگری را انتخاب کنید یا در نامهٔ ما عضو شوید تا اول از همه باخبر شوید.' },
  modal: {
    title: 'رزرو صندلی',
    seats: 'تعداد صندلی',
    name: 'نام و نام خانوادگی',
    email: 'ایمیل',
    total: 'مجموع',
    note: 'نمونه: هیچ پرداختی انجام نمی‌شود. سایت واقعی اینجا شما را به درگاه پرداخت می‌فرستد.',
    submit: 'رزرو صندلی‌ها',
    done: 'صندلی‌ها رزرو شد',
    doneBody: 'در رزروهای همین مرورگر ذخیره شد.',
  },
}

export const PRIVATE_DINING = {
  title: 'مهمانی خصوصی',
  intro: 'بگویید تقریباً چه در ذهن دارید؛ مسئول رویدادهای همان شعبه تا یک روز کاری با منو و قیمت پاسخ می‌دهد.',
  location: 'شعبهٔ دلخواه',
  date: 'تاریخ دلخواه',
  guests: 'تعداد مهمان',
  format: 'شکل پذیرایی',
  formats: ['شام نشسته', 'پذیرایی ایستاده', 'ناهار', 'اجارهٔ کامل سالن'],
  budget: 'بودجهٔ هر نفر',
  budgets: ['تا ۸۰۰ هزار تومان', '۸۰۰ هزار تا ۱٫۲ میلیون', '۱٫۲ تا ۲ میلیون', 'بیش از ۲ میلیون'],
  name: 'نام و نام خانوادگی',
  email: 'ایمیل',
  company: 'شرکت (اختیاری)',
  message: 'دربارهٔ مهمانی بگویید',
  submit: 'ارسال درخواست',
  done: { title: 'درخواست ارسال شد', body: 'ممنون. تا یک روز کاری پاسخ می‌دهیم. کد پیگیری شما:' },
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export const ABOUT = {
  title: 'دربارهٔ ما',
  aside: '(از ۱۳۹۱)',
  meta: [
    { label: 'تأسیس', value: '۱۳۹۱، تهران' },
    { label: 'شعبه‌ها', value: 'شش شعبه در تهران' },
    { label: 'تیم', value: '۲۴۰ نفر' },
  ],
  story: [
    'نگار کیانی اولین آتش و نمک را با یک کورهٔ قرضی، اجارهٔ مغازهٔ یک قفل‌ساز و دوازده صندلی باز کرد. منو هر شب همان چیزی بود که می‌شد روی چوب بلوط پخت، با نمکی که از سفری به بوشهر آورده بود.',
    'مردم برای جوجه برگشتند. بعد برای بادمجان. بعد برای حسِ غذا خوردن جایی که آشپزخانه همان اتاق است. هر شعبهٔ بعدی هم همین‌طور ساخته شد: یک آتش در مرکز، چوب محلی، باغ‌های نزدیک و سرآشپزی که منوی خودش را دور منوی ما می‌نویسد.',
  ],
  timeline: [
    { year: '۱۳۹۱', text: 'تجریش با دوازده صندلی و یک آتش باز شد.' },
    { year: '۱۳۹۴', text: 'جردن، در یک خانهٔ قاجاری بازسازی‌شده.' },
    { year: '۱۳۹۶', text: 'سعادت‌آباد و اولین بالکن خصوصی.' },
    { year: '۱۳۹۸', text: 'قیطریه، روبه‌روی پارک و با تراس تابستانی.' },
    { year: '۱۴۰۰', text: 'کریم‌خان، شعبهٔ مرکز شهر و ناهار کاری.' },
    { year: '۱۴۰۳', text: 'تهرانپارس، بزرگ‌ترین آتش و بزرگ‌ترین حیاط ما.' },
  ],
  values: [
    { title: 'یک آتش', body: 'هر شعبه با چوب می‌پزد. وقتی آتش خوابید، آشپزخانه بسته است.' },
    { title: 'نزدیک به باغ‌ها', body: 'از ۴۱ باغ و کشاورز می‌خریم؛ هر کدام در فاصلهٔ چند ساعت از آشپزخانه‌ای که تغذیه می‌کند.' },
    { title: 'کار منصفانه', body: 'حق سرویس در حقوق حساب می‌شود، همه از روز اول بیمه دارند و آشپزخانه‌ها دو شب در هفته تعطیل‌اند.' },
  ],
  chef: {
    title: 'سرآشپز',
    name: 'نگار کیانی',
    body: 'بین تهران و رشت بزرگ شد، در اصفهان و لندن آشپزی کرد و بعد به تهران برگشت تا رستورانی باز کند که آن‌قدر کوچک باشد که خودش بتواند اداره‌اش کند. جمعه‌ها هنوز پاس تجریش را خودش می‌زند.',
  },
  press: [
    { quote: 'محکم‌ترین استدلال برای پختن روی آتش در این شهر.', source: 'مجلهٔ چاشنی' },
    { quote: 'جوجه را دو بار سفارش دهید. خودتان هم همین کار را می‌کنید.', source: 'هفته‌نامهٔ تهران' },
    { quote: 'زنجیره است فقط به اسم: هر شعبه حس اولی را دارد.', source: 'سفر و طعام' },
  ],
}

/* ------------------------------------------------------------------ */
/* Gift cards                                                          */
/* ------------------------------------------------------------------ */

export const GIFT_CARDS = {
  title: 'کارت هدیه',
  aside: '(در همهٔ شعبه‌ها)',
  intro: 'کارت هدیه را امروز یا در تاریخی که انتخاب می‌کنید با ایمیل بفرستید. تاریخ انقضا ندارد و در هر شش شعبه پذیرفته می‌شود.',
  amount: 'مبلغ',
  amounts: [500000, 1000000, 2000000, 3000000],
  custom: 'مبلغ دیگر',
  customHint: 'بین ۲۰۰ هزار و ۱۰ میلیون تومان',
  design: 'طرح',
  designs: [
    { id: 'ember', label: 'آتش', bg: '#b23a1a', fg: '#fff7ef' },
    { id: 'salt', label: 'نمک', bg: '#f2ead9', fg: '#111111' },
    { id: 'char', label: 'ذغال', bg: '#1b1a18', fg: '#f2ead9' },
  ],
  to: 'نام دریافت‌کننده',
  toEmail: 'ایمیل دریافت‌کننده',
  from: 'نام شما',
  fromEmail: 'ایمیل شما',
  message: 'پیام (اختیاری)',
  sendOn: 'تاریخ ارسال',
  submit: 'ارسال کارت هدیه',
  note: 'نمونه: هیچ پرداختی انجام نمی‌شود. پیش از راه‌اندازی، درگاه پرداخت را در Worker وصل کنید.',
  done: { title: 'کارت هدیه در راه است', body: 'در تاریخ انتخاب‌شده ایمیل می‌شود. کد کارت هدیه:' },
  previewTo: 'برای',
  previewFrom: 'از',
}

/* ------------------------------------------------------------------ */
/* Careers                                                             */
/* ------------------------------------------------------------------ */

export type Role = { id: string; title: string; team: 'آشپزخانه' | 'سالن' | 'نوشیدنی' | 'پشتیبانی'; location: string; type: string; pay: string; summary: string }
export const CAREERS = {
  title: 'همکاری با ما',
  aside: '(به آتش ما بپیوندید)',
  intro: 'کسی را استخدام می‌کنیم که از غذا دادن به مردم لذت می‌برد. حق سرویس در حقوق حساب می‌شود، آشپزخانه‌ها دو شب در هفته تعطیل‌اند و همه از روز اول بیمه دارند.',
  perks: [
    { title: 'هفتهٔ چهارروزه', body: 'آشپزخانه‌ها دو شب تعطیل‌اند، پس بیشتر نقش‌ها چهار شیفت در هفته است.' },
    { title: 'غذای خانوادگی', body: 'پیش از هر سرویس، یک وعدهٔ نشسته و واقعی دور هم.' },
    { title: 'بیمه از روز اول', body: 'بیمهٔ درمان و تکمیلی، بدون دورهٔ انتظار.' },
    { title: 'یک هفته در شعبهٔ دیگر', body: 'هر سال یک هفتهٔ با حقوق در یکی دیگر از آشپزخانه‌های ما.' },
  ],
  filterTeam: 'بخش',
  filterLocation: 'شعبه',
  all: 'همه',
  apply: 'درخواست',
  empty: { title: 'فعلاً موقعیت خالی نداریم', body: 'با این حال برایمان بنویسید. نامه‌های خوب را نگه می‌داریم.' },
  modal: {
    title: 'درخواست همکاری',
    name: 'نام و نام خانوادگی',
    email: 'ایمیل',
    phone: 'شمارهٔ تماس (اختیاری)',
    link: 'پیوند رزومه یا نمونه‌کار (اختیاری)',
    message: 'چرا این نقش؟',
    submit: 'ارسال درخواست',
    done: 'درخواست ارسال شد',
    doneBody: 'ممنون. سرآشپز یا مدیر شعبه تا یک هفته پاسخ می‌دهد.',
  },
  roles: [
    { id: 'sous-tajrish', title: 'سوشف', team: 'آشپزخانه', location: 'tajrish', type: 'تمام‌وقت', pay: '۵۵ تا ۶۵ میلیون تومان', summary: 'سه شب در هفته پاس را اداره کنید و مسئول آماده‌سازی و سفارش بخش آتش باشید.' },
    { id: 'grill-jordan', title: 'آشپز کوره', team: 'آشپزخانه', location: 'jordan', type: 'تمام‌وقت', pay: '۳۵ تا ۴۲ میلیون تومان', summary: 'در سرویس شام روی کوره کار کنید. دو سال تجربه در خط گرم، ترجیحاً با آتش زنده.' },
    { id: 'server-saadatabad', title: 'گارسون', team: 'سالن', location: 'saadatabad', type: 'تمام‌وقت یا پاره‌وقت', pay: '۲۸ تا ۳۴ میلیون تومان', summary: 'مسئول هشت میز و بالکن خصوصی در شب‌های رویداد باشید.' },
    { id: 'bar-tehranpars', title: 'مسئول چای و نوشیدنی', team: 'نوشیدنی', location: 'tehranpars', type: 'تمام‌وقت', pay: '۳۰ تا ۳۶ میلیون تومان', summary: 'پرحجم‌ترین نوشیدنی‌خانهٔ ما. دم‌کرده، شربت و دوغ برای ۱۴۰ پرس و حیاط.' },
    { id: 'host-qeytarieh', title: 'مسئول پذیرش', team: 'سالن', location: 'qeytarieh', type: 'پاره‌وقت', pay: '۲۴ میلیون تومان', summary: 'اولین و آخرین چهرهٔ شب: دفتر رزرو، در و لیست انتظار تراس.' },
    { id: 'pastry-karimkhan', title: 'آشپز دسر', team: 'آشپزخانه', location: 'karimkhan', type: 'تمام‌وقت', pay: '۳۰ تا ۳۵ میلیون تومان', summary: 'نان صبح، دسر تا سرویس. تجربهٔ شیرینی‌پزی خشک و سنتی امتیاز است.' },
    { id: 'events-jordan', title: 'مدیر رویدادها', team: 'پشتیبانی', location: 'jordan', type: 'تمام‌وقت', pay: '۶۵ تا ۷۵ میلیون تومان', summary: 'مهمانی‌های خصوصی شعبه‌های تهران را از اولین تماس تا آخرین مهمان برنامه‌ریزی و اجرا کنید.' },
  ] satisfies Role[],
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const CONTACT = {
  title: 'تماس',
  aside: '(همه را می‌خوانیم)',
  intro: 'برای پرسش دربارهٔ رزرو، مستقیم با شعبه تماس بگیرید. برای بقیه، بنویسید؛ تا دو روز کاری پاسخ می‌دهیم.',
  channels: [
    { label: 'عمومی', value: 'hello@atashonamak.ir', href: 'mailto:hello@atashonamak.ir' },
    { label: 'رویدادها و مهمانی خصوصی', value: 'events@atashonamak.ir', href: 'mailto:events@atashonamak.ir' },
    { label: 'رسانه', value: 'press@atashonamak.ir', href: 'mailto:press@atashonamak.ir' },
  ],
  topic: 'موضوع',
  topics: ['پرسش عمومی', 'نظر دربارهٔ یک بازدید', 'اشیای جامانده', 'رسانه', 'تأمین‌کنندگان'],
  location: 'شعبه (اختیاری)',
  noLocation: 'دربارهٔ هیچ شعبه‌ای نیست',
  name: 'نام و نام خانوادگی',
  email: 'ایمیل',
  message: 'پیام',
  submit: 'ارسال پیام',
  done: { title: 'پیام ارسال شد', body: 'ممنون که نوشتید. تا دو روز کاری پاسخ می‌دهیم.' },
  faqTitle: 'پرسش‌هایی که زیاد می‌شنویم',
  faq: [
    { q: 'بدون رزرو هم می‌شود آمد؟', a: 'بله. هر شعبه هر شب چند صندلی کنار آتش و بار برای مهمان‌های سرزده نگه می‌دارد. آخر هفته‌ها زودتر بیایید.' },
    { q: 'برای حساسیت غذایی چه می‌کنید؟', a: 'هنگام رزرو و دوباره سر میز بگویید. بیشتر بشقاب‌ها را می‌توانیم تغییر دهیم، اما آشپزخانه‌های ما با همهٔ حساسیت‌های رایج کار می‌کنند.' },
    { q: 'لباس خاصی لازم است؟', a: 'نه. همان‌طور که هستید بیایید.' },
    { q: 'حق سرویس می‌گیرید؟', a: 'حق سرویس در قیمت‌ها حساب شده. برای گروه‌های شش‌نفره و بیشتر ۱۰٪ اضافه می‌شود که تمامش به تیم می‌رسد.' },
    { q: 'می‌توانم کیک بیاورم؟', a: 'البته. ما آن را سرو می‌کنیم و برای تولد هزینهٔ کیک‌بری نمی‌گیریم.' },
  ],
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

export const NOT_FOUND = {
  title: 'صفحه پیدا نشد',
  aside: '(۴۰۴)',
  body: 'آتش این صفحه خاموش شده. ممکن است صفحه جابه‌جا شده باشد یا نشانی اشتباه تایپ شده باشد.',
  home: 'بازگشت به خانه',
  menu: 'دیدن منو',
}

export const COMMON = {
  reserve: 'رزرو میز',
  skip: 'رفتن به محتوا',
  menuOpen: 'باز کردن منو',
  menuClose: 'بستن منو',
  newsletterLabel: 'نشانی ایمیل',
  newsletterSubmit: 'عضویت',
  newsletterDone: 'عضو شدید. به‌زودی در صندوق ایمیل‌تان می‌بینیدمان.',
  openNow: 'همین حالا باز است',
  closedNow: 'بسته است',
  opensAt: (t: string) => `از ${t} باز می‌شود`,
  closesAt: (t: string) => `باز است تا ${t}`,
  directions: 'مسیریابی',
  call: 'تماس',
  reserveHere: 'رزرو در این شعبه',
  hours: 'ساعات کاری',
  details: 'جزئیات',
  features: 'در این شعبه',
  privateRoom: 'اتاق خصوصی',
  gettingHere: 'چطور بیایید',
  upcoming: 'رویدادهای پیش رو',
  required: 'الزامی',
}

export const DAYS = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']
