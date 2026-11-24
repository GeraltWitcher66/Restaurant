import { Inbox, RotateCcw } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

import { CAREERS, EVENTS, LOCATIONS, MENU } from '../content'
import { ArrowLink, Button, IconButton, type ButtonVariant, type Force } from '../components/Button'
import { DishCard, EventCard, LocationCard, MenuRow, RoleRow } from '../components/Cards'
import { Chip, Segmented } from '../components/Chip'
import { CityMap } from '../components/CityMap'
import { Accordion, Badge, EmptyState, Meta, Notice, OpenDot, PageHeader, Skeleton, Stepper } from '../components/Display'
import { Checkbox, SelectField, TextArea, TextField } from '../components/Field'
import { NewsletterForm } from '../components/NewsletterForm'
import { Modal, useToast } from '../components/Overlay'
import { Spinner } from '../components/Spinner'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { GiftCardPreview } from './GiftCards'

const COLORS = [
  ['paper', 'پس‌زمینهٔ صفحه'],
  ['cream', 'زمینهٔ عکس و کارت'],
  ['sand', 'پرکننده‌های آرام'],
  ['line', 'خطوط مو'],
  ['line-strong', 'حاشیهٔ کنترل‌ها'],
  ['ink', 'متن و دکمهٔ اصلی'],
  ['ink-2', 'متن ثانویه'],
  ['muted', 'متن پاراگراف، پیوند منو'],
  ['faint', 'زیرنویس، جانگهدار'],
  ['ember', 'لهجه، حلقهٔ فوکوس'],
  ['ember-deep', 'لهجهٔ فشرده'],
  ['ember-soft', 'رنگ کم‌رنگ لهجه'],
  ['success', 'باز، موفق'],
  ['danger', 'خطاها'],
] as const

const TYPE = [
  { name: 'نشانه', cls: 'font-display text-wordmark', sample: 'آتش و نمک' },
  { name: 'تیتر بزرگ', cls: 'font-display text-display', sample: 'رزرو میز' },
  { name: 'زیرنویس', cls: 'font-display text-5xl font-normal', sample: '(از ۱۳۹۱)' },
  { name: 'سرتیتر', cls: 'font-display text-[3rem]', sample: 'از دل آتش' },
  { name: 'عنوان', cls: 'font-display text-[1.75rem]', sample: 'جوجه کباب زعفرانی' },
  { name: 'لید', cls: 'text-[1.0625rem] text-muted', sample: 'بشقاب‌های فصلی روی چوب بلوط، با نمک دریا.' },
  { name: 'متن', cls: 'text-[0.9375rem]', sample: 'زعفران، ماست، گوجهٔ کبابی، نان سنگک.' },
  { name: 'برچسب', cls: 'label', sample: 'شعبه' },
  { name: 'منو', cls: 'text-sm text-muted', sample: 'رزرو میز' },
]

const SPACE = [4, 8, 12, 16, 24, 32, 48, 64, 96, 144]
const RADII = ['xs', 'sm', 'md', 'lg']
const SHADOWS = ['card', 'float', 'focus']
const MOTION = [
  { name: 'rise', anim: 'animate-rise', note: 'حروف هیرو، ۱۱۰۰ میلی‌ثانیه' },
  { name: 'fade-up', anim: 'animate-fade-up', note: 'ردیف اطلاعات و مقدمه‌ها، ۷۰۰ میلی‌ثانیه' },
  { name: 'settle', anim: 'animate-settle', note: 'عکس هیرو، ۱۶۰۰ میلی‌ثانیه' },
  { name: 'flicker', anim: 'animate-flicker', note: 'نقطهٔ «باز است»، حلقهٔ ۲٫۴ ثانیه' },
  { name: 'shimmer', anim: 'skeleton', note: 'اسکلت بارگذاری، حلقهٔ ۱٫۴ ثانیه' },
]
const STATES: { label: string; force?: Force; disabled?: boolean; loading?: boolean }[] = [
  { label: 'عادی' },
  { label: 'هاور', force: 'hover' },
  { label: 'فوکوس', force: 'focus' },
  { label: 'فشرده', force: 'pressed' },
  { label: 'غیرفعال', disabled: true },
  { label: 'بارگذاری', loading: true },
]

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="border-t pt-10 pb-16">
      <h2 id={`${id}-t`} className="font-display mb-8 text-[2.5rem]">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Swatch({ name, role }: { name: string; role: string }) {
  const [hex, setHex] = useState('')
  useEffect(() => setHex(getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim()), [name])
  return (
    <div>
      <div className="h-20 rounded-[var(--radius-sm)] border" style={{ background: `var(--color-${name})` }} />
      <p className="mt-2 text-sm font-medium">{name}</p>
      <p className="text-[0.8125rem] text-muted">
        <span className="font-mono">{hex}</span> {role}
      </p>
    </div>
  )
}

export function Styleguide() {
  useDocumentTitle('راهنمای طراحی')
  const toast = useToast()
  const [replay, setReplay] = useState(0)
  const [modal, setModal] = useState(false)
  const [chips, setChips] = useState(['gf'])
  const [seg, setSeg] = useState('2')
  const [check, setCheck] = useState(true)
  const dishes = MENU.flatMap((s) => s.items)
  const variants: ButtonVariant[] = ['primary', 'ember', 'secondary', 'ghost']

  return (
    <>
      <PageHeader title="راهنمای طراحی" aside="(سیستم)" intro="توکن‌ها در src/styles.css هستند؛ هر نمونهٔ زیر همان کامپوننت واقعی است، در حالتی که نامش نوشته شده." />
      <div className="container-page">
        <nav aria-label="بخش‌های راهنما" className="mb-10 flex flex-wrap gap-x-5">
          {[
            ['colour', 'رنگ'],
            ['type', 'تایپوگرافی'],
            ['space', 'فاصله'],
            ['radii', 'گردی گوشه'],
            ['shadows', 'سایه'],
            ['motion', 'حرکت'],
            ['buttons', 'دکمه و پیوند'],
            ['forms', 'فرم'],
            ['filters', 'فیلترها'],
            ['feedback', 'بازخورد'],
            ['cards', 'کارت‌ها'],
            ['overlays', 'لایه‌ها'],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="inline-flex min-h-10 min-w-10 items-center justify-center text-sm text-muted hover:text-ink">
              {label}
            </a>
          ))}
        </nav>

        <Section id="colour" title="رنگ">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
            {COLORS.map(([n, r]) => (
              <Swatch key={n} name={n} role={r} />
            ))}
          </div>
        </Section>

        <Section id="type" title="تایپوگرافی">
          <p className="mb-6 text-sm text-muted">وزیرمتن برای متن، برچسب و کنترل‌ها؛ نسخ عربی برای تیترها و نشانهٔ برند. اعداد فارسی و تاریخ هجری شمسی.</p>
          <div className="divide-y">
            {TYPE.map((t) => (
              <div key={t.name} className="grid gap-2 py-5 md:grid-cols-[160px_1fr] md:items-baseline">
                <p className="text-sm text-muted">{t.name}</p>
                <p className={`${t.cls} min-w-0 truncate`}>{t.sample}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="space" title="فاصله">
          <div className="flex flex-wrap items-end gap-6">
            {SPACE.map((s) => (
              <div key={s} className="text-center">
                <div className="bg-ember-soft" style={{ width: s, height: s }} />
                <p className="mt-2 text-[0.8125rem] text-muted tabular-nums">{s.toLocaleString('fa-IR')}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">حاشیهٔ صفحه ۳۰ پیکسل (روی موبایل ۱۶). بخش‌ها ۹۶ تا ۱۴۴ پیکسل از هم فاصله دارند.</p>
        </Section>

        <Section id="radii" title="گردی گوشه">
          <div className="flex flex-wrap gap-6">
            {RADII.map((r) => (
              <div key={r} className="text-center">
                <div className="size-24 border border-line-strong bg-sand" style={{ borderRadius: `var(--radius-${r})` }} />
                <p className="mt-2 text-sm">{r}</p>
              </div>
            ))}
            <div className="text-center">
              <div className="round size-24 rounded-full border border-line-strong bg-sand" />
              <p className="mt-2 text-sm">کامل</p>
            </div>
          </div>
        </Section>

        <Section id="shadows" title="سایه">
          <div className="flex flex-wrap gap-8">
            {SHADOWS.map((s) => (
              <div key={s} className="text-center">
                <div className="size-32 rounded-[var(--radius-md)] bg-paper" style={{ boxShadow: `var(--shadow-${s})` }} />
                <p className="mt-3 text-sm">{s}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="motion" title="حرکت">
          <Button variant="secondary" size="sm" onClick={() => setReplay((n) => n + 1)}>
            <RotateCcw aria-hidden className="size-4" /> پخش دوباره
          </Button>
          <div key={replay} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {MOTION.map((m) => (
              <div key={m.name} className="overflow-hidden rounded-[var(--radius-md)] border p-5">
                <div className="flex h-20 items-center justify-center">
                  {m.name === 'rise' && <span className={`font-display text-5xl ${m.anim}`}>نمک</span>}
                  {m.name === 'fade-up' && <span className={`text-sm font-semibold ${m.anim}`}>تجریش</span>}
                  {m.name === 'settle' && <div className={`size-16 rounded-[var(--radius-sm)] bg-cream ${m.anim}`} />}
                  {m.name === 'flicker' && <OpenDot open />}
                  {m.name === 'shimmer' && <Skeleton className="h-6 w-full" />}
                </div>
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-[0.8125rem] text-muted">{m.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">منحنی ease-out-soft برابر cubic-bezier(0.22, 1, 0.36, 1)؛ زمان‌ها: سریع ۱۶۰، پایه ۲۸۰ و کند ۷۰۰ میلی‌ثانیه. با کاهش حرکت، خاموش می‌شوند.</p>
        </Section>

        <Section id="buttons" title="دکمه‌ها و پیوندها">
          <div className="space-y-6">
            {variants.map((v) => (
              <div key={v}>
                <p className="mb-3 text-sm text-muted">{v}</p>
                <div className="flex flex-wrap gap-3">
                  {STATES.map((s) => (
                    <Button key={s.label} variant={v} force={s.force} disabled={s.disabled} loading={s.loading}>
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <p className="mb-3 text-sm text-muted">اندازه‌ها، فلش، آیکون</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">کوچک</Button>
                <Button>متوسط</Button>
                <Button size="lg" arrow>
                  بزرگ با فلش
                </Button>
                <IconButton aria-label="صندوق" variant="secondary">
                  <Inbox className="size-4" />
                </IconButton>
                <IconButton aria-label="صندوق، هاور" force="hover">
                  <Inbox className="size-4" />
                </IconButton>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm text-muted">پیوند فلش‌دار</p>
              <div className="flex flex-wrap gap-6">
                <ArrowLink to="/reservations">عادی</ArrowLink>
                <ArrowLink to="/reservations" force="hover">
                  هاور
                </ArrowLink>
                <ArrowLink to="/reservations" force="focus">
                  فوکوس
                </ArrowLink>
                <ArrowLink to="/reservations" muted>
                  کم‌رنگ
                </ArrowLink>
              </div>
            </div>
          </div>
        </Section>

        <Section id="forms" title="کنترل‌های فرم">
          <div className="grid gap-8 md:grid-cols-3">
            <TextField label="عادی" name="sg1" placeholder="نام شما" />
            <TextField label="هاور" name="sg2" placeholder="نام شما" force="hover" />
            <TextField label="فوکوس" name="sg3" defaultValue="نگار کیانی" force="focus" />
            <TextField label="با راهنما" name="sg4" hint="روز رزرو پیام می‌دهیم." placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷" />
            <TextField label="خطا" name="sg5" defaultValue="neg.ar@" error="ایمیل را به شکل name@example.com بنویسید." />
            <TextField label="غیرفعال" name="sg6" defaultValue="قابل ویرایش نیست" disabled />
            <SelectField label="انتخاب" name="sg7" options={LOCATIONS.map((l) => ({ value: l.slug, label: l.name }))} />
            <SelectField label="انتخاب با خطا" name="sg8" error="یک شعبه انتخاب کنید." options={[{ value: '', label: 'انتخاب کنید…' }]} />
            <TextArea label="ناحیهٔ متن" name="sg9" placeholder="حساسیت غذایی، دسترسی، صندلی کودک" />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Checkbox name="c1" label="تعاملی" checked={check} onChange={setCheck} />
            <Checkbox name="c2" label="انتخاب‌نشده" checked={false} onChange={() => {}} />
            <Checkbox name="c3" label="هاور" checked={false} onChange={() => {}} force="hover" />
            <Checkbox name="c4" label="فوکوس" checked onChange={() => {}} force="focus" />
            <Checkbox name="c5" label="خطا" checked={false} onChange={() => {}} error="لطفاً قواعد رزرو را تأیید کنید." />
            <Checkbox name="c6" label="غیرفعال" checked onChange={() => {}} disabled />
          </div>
        </Section>

        <Section id="filters" title="فیلترها و انتخاب‌ها">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {['v', 'vg', 'gf', 'spicy'].map((d) => (
                <Chip key={d} pressed={chips.includes(d)} onClick={() => setChips((c) => (c.includes(d) ? c.filter((x) => x !== d) : [...c, d]))}>
                  فیلتر {d}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip pressed={false}>خاموش</Chip>
              <Chip pressed>روشن</Chip>
              <Chip pressed={false} force="hover">
                هاور
              </Chip>
              <Chip pressed={false} force="focus">
                فوکوس
              </Chip>
              <Chip pressed={false} force="pressed">
                فشرده
              </Chip>
              <Chip pressed={false} disabled>
                غیرفعال
              </Chip>
            </div>
            <Segmented
              label="مهمان‌ها"
              name="sg-seg"
              value={seg}
              onChange={setSeg}
              options={[...['1', '2', '3', '4'].map((v) => ({ value: v, label: v })), { value: '5', label: '5', disabled: true }]}
            />
            <Stepper steps={['شعبه و زمان', 'انتخاب ساعت', 'اطلاعات شما']} current={1} />
          </div>
        </Section>

        <Section id="feedback" title="وضعیت و بازخورد">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>خنثی</Badge>
                <Badge tone="outline">دور‌خط</Badge>
                <Badge tone="ember">آتش</Badge>
                <Badge tone="success">موفق</Badge>
                <Badge tone="danger">خطر</Badge>
                <Badge tone="ink">امضای سرآشپز</Badge>
              </div>
              <p className="inline-flex items-center gap-2 text-sm">
                <OpenDot open /> باز است تا ۲۳:۰۰
              </p>
              <p className="ms-6 inline-flex items-center gap-2 text-sm">
                <OpenDot open={false} /> فردا ۱۲:۰۰ باز می‌شود
              </p>
              <Notice tone="error">به سرور وصل نشدیم. اتصال اینترنت را بررسی و دوباره تلاش کنید.</Notice>
              <Notice tone="success">عضو شدید. به‌زودی در صندوق ایمیل‌تان می‌بینیدمان.</Notice>
              <Notice tone="info">پیش از سفارش، حساسیت‌های غذایی‌تان را به گارسون بگویید.</Notice>
              <div className="flex items-center gap-6">
                <Spinner label="در حال بررسی دفتر رزرو" />
                <Skeleton className="h-11 w-24" />
                <Skeleton className="h-11 w-24" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Meta label="خدمات" value="آشپزخانهٔ چوب‌سوز" />
                <Meta label="شعبه" value="تجریش" sub="تهران، خیابان ولیعصر، پلاک ۲۱۲" to="/locations/tajrish" />
                <Meta label="بنیان‌گذار" value="نگار کیانی" />
              </div>
              <NewsletterForm />
            </div>
            <div className="space-y-6">
              <EmptyState icon={Inbox} title="هنوز رزروی ثبت نشده" body="وقتی میزی رزرو کنید، اینجا نمایش داده می‌شود." action={<Button variant="secondary">رزرو میز</Button>} />
              <Accordion items={[{ q: 'بدون رزرو هم می‌شود آمد؟', a: 'بله، هر شب چند صندلی کنار آتش.' }, { q: 'لباس خاصی لازم است؟', a: 'نه.' }]} />
            </div>
          </div>
        </Section>

        <Section id="cards" title="کارت‌ها و ردیف‌ها">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <DishCard item={dishes.find((d) => d.id === 'kashk')!} />
            <LocationCard loc={LOCATIONS[1]} />
            <div className="sm:col-span-2">
              <GiftCardPreview design="char" amount={1500000} to="سامان" from="نگار" message="شام مهمان من." />
              <div className="mt-6 rounded-[var(--radius-md)] border p-4">
                <CityMap active="jordan" />
              </div>
            </div>
          </div>
          <ul className="mt-10 divide-y border-y">
            <MenuRow item={dishes.find((d) => d.id === 'joojeh')!} />
            <MenuRow item={dishes.find((d) => d.id === 'mahi')!} unavailableAt="تهرانپارس" />
          </ul>
          <div className="mt-10 border-b">
            <EventCard event={EVENTS[0]} onBook={() => toast('رزرو صندلی پنجرهٔ رویداد را باز می‌کند')} />
            <EventCard event={EVENTS.find((e) => e.seatsLeft === 0)!} onBook={() => {}} />
          </div>
          <ul className="mt-10 border-b">
            <RoleRow role={CAREERS.roles[0]} onApply={() => toast('درخواست، پنجرهٔ همکاری را باز می‌کند')} />
          </ul>
        </Section>

        <Section id="overlays" title="لایه‌ها">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setModal(true)}>باز کردن مودال</Button>
            <Button variant="secondary" onClick={() => toast('رزرو لغو شد')}>
              نمایش پیام کوتاه
            </Button>
          </div>
        </Section>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="این رزرو لغو شود؟" description="Esc می‌بندد، فوکوس داخل می‌ماند و به دکمهٔ اصلی برمی‌گردد.">
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setModal(false)}>
            نگهش دار
          </Button>
          <Button variant="ember" onClick={() => setModal(false)}>
            بله، لغو کن
          </Button>
        </div>
      </Modal>
    </>
  )
}
