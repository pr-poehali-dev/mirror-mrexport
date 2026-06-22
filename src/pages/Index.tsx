import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import func2url from '../../backend/func2url.json';

const HERO_IMG = 'https://cdn.poehali.dev/projects/211c54d5-224f-427e-b237-3b6461f67a2b/files/11b4d4a6-2af8-4f00-bfaa-1d0ae540f46d.jpg';
const MAP_IMG = 'https://cdn.poehali.dev/projects/211c54d5-224f-427e-b237-3b6461f67a2b/files/2eec3a18-6cb4-4748-82e0-fcd8bc0c975f.jpg';

const NAV = [
  { label: 'Главная', href: '#hero' },
  { label: 'Каталог', href: '#catalog' },
  { label: 'Партнёры', href: '#partners' },
  { label: 'Предложения', href: '#offers' },
  { label: 'Статьи', href: '#blog' },
  { label: 'О платформе', href: '#about' },
  { label: 'Контакты', href: '#contacts' },
];

const STATS = [
  { value: '12 400+', label: 'товаров и услуг' },
  { value: '3 800+', label: 'проверенных партнёров' },
  { value: '76', label: 'стран присутствия' },
  { value: '$2.1 млрд', label: 'оборот сделок' },
];

const CATEGORIES = [
  { icon: 'Wheat', title: 'Агропродукция', count: 2140, color: 'from-emerald-500 to-teal-600' },
  { icon: 'Factory', title: 'Промышленность', count: 1860, color: 'from-blue-500 to-indigo-600' },
  { icon: 'Gem', title: 'Сырьё и металлы', count: 970, color: 'from-amber-500 to-orange-600' },
  { icon: 'FlaskConical', title: 'Химия и сырьё', count: 640, color: 'from-cyan-500 to-blue-600' },
  { icon: 'Shirt', title: 'Текстиль', count: 1230, color: 'from-rose-500 to-pink-600' },
  { icon: 'Cpu', title: 'Электроника', count: 880, color: 'from-violet-500 to-purple-600' },
  { icon: 'Truck', title: 'Логистика', count: 540, color: 'from-sky-500 to-cyan-600' },
  { icon: 'Apple', title: 'Продукты питания', count: 1610, color: 'from-lime-500 to-green-600' },
];

const PARTNERS = [
  { name: 'AgroGlobal Trade', country: 'Казахстан', city: 'Алматы', cat: 'Зерновые культуры', rating: 4.9, deals: 312, verified: true, logo: 'AG' },
  { name: 'Ural Metal Export', country: 'Россия', city: 'Екатеринбург', cat: 'Чёрный металл', rating: 4.8, deals: 187, verified: true, logo: 'UM' },
  { name: 'Silk Road Textiles', country: 'Узбекистан', city: 'Ташкент', cat: 'Хлопок, ткани', rating: 4.7, deals: 256, verified: true, logo: 'SR' },
  { name: 'Caspian Oil Group', country: 'Азербайджан', city: 'Баку', cat: 'Нефтепродукты', rating: 5.0, deals: 98, verified: true, logo: 'CO' },
  { name: 'Baltic Timber Co', country: 'Беларусь', city: 'Минск', cat: 'Лесоматериалы', rating: 4.6, deals: 143, verified: false, logo: 'BT' },
  { name: 'EastTech Electronics', country: 'Китай', city: 'Шэньчжэнь', cat: 'Электроника', rating: 4.9, deals: 421, verified: true, logo: 'ET' },
];

const OFFERS = [
  { type: 'Продажа', title: 'Пшеница 3 класс, протеин 12.5%', volume: '50 000 тонн', price: 'от $245 / т', geo: 'FOB Новороссийск', hot: true },
  { type: 'Закупка', title: 'Алюминиевый прокат А5 — А7', volume: '1 200 тонн', price: 'договорная', geo: 'CIF Стамбул', hot: false },
  { type: 'Продажа', title: 'Подсолнечное масло наливом', volume: '8 000 тонн', price: 'от $980 / т', geo: 'FOB Тамань', hot: true },
  { type: 'Закупка', title: 'Хлопок-волокно 1-2 сорт', volume: '3 500 тонн', price: 'до $1 750 / т', geo: 'DAP Ташкент', hot: false },
];

const VERIFY_STEPS = [
  { icon: 'FileText', title: 'Подача документов', desc: 'Партнёр загружает учредительные документы, лицензии и сертификаты.' },
  { icon: 'ScanSearch', title: 'Проверка данных', desc: 'Сверяем реквизиты с государственными реестрами и санкционными списками.' },
  { icon: 'ShieldCheck', title: 'Подтверждение', desc: 'Эксперт проводит интервью и выдаёт статус «Проверенный экспортёр».' },
  { icon: 'BadgeCheck', title: 'Бейдж доверия', desc: 'Компания получает верификационный бейдж и попадает в топ выдачи.' },
];

const ARTICLES = [
  { tag: 'Экспорт', title: 'Как выйти на рынок Юго-Восточной Азии в 2026 году', read: '8 мин', date: '18 июня' },
  { tag: 'Логистика', title: 'Инкотермс 2020: разбираем FOB, CIF и DAP на примерах', read: '12 мин', date: '11 июня' },
  { tag: 'Финансы', title: 'Аккредитив против эскроу: как обезопасить сделку', read: '6 мин', date: '4 июня' },
];

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sending, setSending] = useState(false);
  const [offerModal, setOfferModal] = useState<string | null>(null);
  const [offerForm, setOfferForm] = useState({ name: '', email: '', comment: '' });
  const [offerSending, setOfferSending] = useState(false);

  const onField = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.name.trim() || !offerForm.email.trim()) {
      toast({ title: 'Заполните имя и email', variant: 'destructive' });
      return;
    }
    setOfferSending(true);
    try {
      const res = await fetch(func2url['send-contact'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: offerForm.name,
          email: offerForm.email,
          company: '',
          message: `Отклик на торговое предложение: «${offerModal}»\n\n${offerForm.comment}`,
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Отклик отправлен!', description: 'Менеджер свяжется с вами в ближайшее время.' });
      setOfferModal(null);
      setOfferForm({ name: '', email: '', comment: '' });
    } catch {
      toast({ title: 'Не удалось отправить', description: 'Попробуйте позже или напишите на hello@mrexport.ru', variant: 'destructive' });
    } finally {
      setOfferSending(false);
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast({ title: 'Заполните имя и email', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const res = await fetch(func2url['send-contact'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Заявка отправлена!', description: 'Менеджер свяжется с вами в ближайшее время.' });
      setForm({ name: '', email: '', company: '', message: '' });
    } catch {
      toast({ title: 'Не удалось отправить', description: 'Попробуйте позже или напишите на hello@mrexport.ru', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="container">
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-[hsl(211_45%_12%/0.7)] px-5 py-3 backdrop-blur-xl">
            <a href="#hero" className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-accent text-[hsl(211_80%_18%)]">
                <Icon name="Globe2" size={22} />
              </div>
              <span className="font-display text-xl font-bold tracking-wide text-white">
                Mr<span className="text-gradient">Export</span>
              </span>
            </a>

            <nav className="hidden items-center gap-1 lg:flex">
              {NAV.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Войти</Button>
              <Button className="gradient-accent font-semibold text-[hsl(211_80%_18%)] hover:opacity-90">
                Регистрация
              </Button>
            </div>

            <button className="lg:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name={menuOpen ? 'X' : 'Menu'} size={26} />
            </button>
          </div>

          {menuOpen && (
            <div className="mt-2 rounded-2xl border border-white/10 bg-[hsl(211_45%_12%/0.95)] p-3 backdrop-blur-xl lg:hidden animate-fade-in">
              {NAV.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-white/80 hover:bg-white/10"
                >
                  {n.label}
                </a>
              ))}
              <Button className="mt-2 w-full gradient-accent font-semibold text-[hsl(211_80%_18%)]">Регистрация</Button>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden gradient-export pt-36 pb-28">
        <div className="absolute inset-0 opacity-25">
          <img src={HERO_IMG} alt="Порт" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 mesh-bg" />
        <div className="container relative">
          <div className="max-w-3xl">
            <Badge className="mb-6 animate-float-up border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur" style={{ animationDelay: '0.05s' }}>
              <Icon name="ShieldCheck" size={15} className="mr-1.5 text-[hsl(38_95%_60%)]" />
              Все партнёры проходят верификацию
            </Badge>
            <h1 className="animate-float-up font-display text-5xl font-bold leading-[1.05] text-white md:text-7xl" style={{ animationDelay: '0.12s' }}>
              Оптовая торговля<br />
              <span className="text-gradient">без границ</span>
            </h1>
            <p className="mt-6 max-w-xl animate-float-up text-lg text-white/75" style={{ animationDelay: '0.2s' }}>
              MrExport объединяет производителей, поставщиков и экспортёров. Находите проверенных партнёров и заключайте сделки по всему миру.
            </p>

            {/* SEARCH */}
            <div className="mt-9 animate-float-up" style={{ animationDelay: '0.28s' }}>
              <div className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl sm:flex-row">
                <div className="flex flex-1 items-center gap-2 px-3">
                  <Icon name="Search" size={20} className="text-white/60" />
                  <Input
                    placeholder="Товар, услуга или компания…"
                    className="border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0"
                  />
                </div>
                <Button className="gradient-accent h-12 px-8 font-semibold text-[hsl(211_80%_18%)] hover:opacity-90">
                  Найти партнёра
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/60">
                <span>Популярное:</span>
                {['Зерно', 'Металл', 'Нефтепродукты', 'Текстиль'].map((t) => (
                  <a key={t} href="#catalog" className="rounded-full bg-white/10 px-3 py-0.5 hover:bg-white/20">{t}</a>
                ))}
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.label} className="animate-float-up rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur" style={{ animationDelay: `${0.35 + i * 0.07}s` }}>
                <div className="font-display text-3xl font-bold text-white md:text-4xl">{s.value}</div>
                <div className="mt-1 text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES / CATALOG */}
      <section id="catalog" className="py-24">
        <div className="container">
          <SectionHead eyebrow="Каталог" title="Товары и услуги по категориям" sub="Более 12 000 позиций от поставщиков из 76 стран" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {CATEGORIES.map((c) => (
              <a key={c.title} href="#offers" className="hover-lift group rounded-2xl border bg-card p-6">
                <div className={`mb-4 grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br ${c.color} text-white`}>
                  <Icon name={c.icon} size={26} />
                </div>
                <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.count.toLocaleString('ru-RU')} предложений</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                  Смотреть <Icon name="ArrowRight" size={15} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners" className="py-24 bg-muted/40">
        <div className="container">
          <SectionHead eyebrow="Партнёры" title="Проверенные экспортные партнёры" sub="Каждая компания прошла верификацию документов и репутации" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PARTNERS.map((p) => (
              <div key={p.name} className="hover-lift rounded-2xl border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl gradient-export font-display font-bold text-white">
                      {p.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold leading-tight">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">{p.city}, {p.country}</p>
                    </div>
                  </div>
                  {p.verified ? (
                    <Badge className="gap-1 bg-secondary text-secondary-foreground">
                      <Icon name="BadgeCheck" size={14} /> Проверен
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-muted-foreground">
                      <Icon name="Clock" size={14} /> На проверке
                    </Badge>
                  )}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{p.cat}</p>
                <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm">
                  <span className="flex items-center gap-1 font-medium">
                    <Icon name="Star" size={15} className="text-accent" />
                    {p.rating}
                  </span>
                  <span className="text-muted-foreground">{p.deals} сделок</span>
                  <a href="#contacts" className="font-medium text-primary hover:underline">Профиль</a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" className="font-medium">
              Все партнёры <Icon name="ArrowRight" size={18} className="ml-1.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* VERIFICATION */}
      <section className="relative overflow-hidden gradient-export py-24">
        <div className="absolute inset-0 mesh-bg" />
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 border-white/20 bg-white/10 text-white backdrop-blur">Безопасность сделок</Badge>
            <h2 className="font-display text-4xl font-bold text-white md:text-5xl">Как работает верификация партнёров</h2>
            <p className="mt-4 text-white/70">Мы подтверждаем подлинность данных каждой компании, чтобы вы заключали сделки без рисков.</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {VERIFY_STEPS.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl gradient-accent text-[hsl(211_80%_18%)]">
                    <Icon name={s.icon} size={24} />
                  </div>
                  <span className="font-display text-4xl font-bold text-white/15">0{i + 1}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-white/65">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section id="offers" className="py-24">
        <div className="container">
          <SectionHead eyebrow="Торговая площадка" title="Актуальные торговые предложения" sub="Свежие заявки на продажу и закупку оптовых партий" />
          <div className="grid gap-5 md:grid-cols-2">
            {OFFERS.map((o) => (
              <div key={o.title} className="hover-lift rounded-2xl border bg-card p-6">
                <div className="flex items-center justify-between">
                  <Badge className={o.type === 'Продажа' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}>
                    {o.type}
                  </Badge>
                  {o.hot && (
                    <span className="flex items-center gap-1 text-sm font-medium text-accent-foreground">
                      <Icon name="Flame" size={15} className="text-accent" /> Горячее
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{o.title}</h3>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <Field icon="Package" label="Объём" value={o.volume} />
                  <Field icon="Tag" label="Цена" value={o.price} />
                  <Field icon="MapPin" label="Условия" value={o.geo} />
                </div>
                <Button className="mt-5 w-full" variant="outline" onClick={() => setOfferModal(o.title)}>
                  <Icon name="Send" size={16} className="mr-2" /> Откликнуться на заявку
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-muted/40">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge className="mb-4 bg-secondary text-secondary-foreground">О платформе</Badge>
            <h2 className="font-display text-4xl font-bold md:text-5xl">Соединяем мир<br />оптовой торговли</h2>
            <p className="mt-5 text-muted-foreground">
              MrExport — это цифровая экосистема для международной B2B-торговли. Мы помогаем компаниям находить надёжных партнёров, проверять контрагентов и заключать сделки на прозрачных условиях.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Команда из 40+ экспертов по ВЭД и логистике',
                'Юридическое сопровождение каждой сделки',
                'Интеграция с реестрами 76 стран',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Icon name="CheckCircle2" size={22} className="mt-0.5 shrink-0 text-secondary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="mt-8 bg-primary font-semibold">Узнать о команде</Button>
          </div>
          <div className="relative">
            <img src={MAP_IMG} alt="Глобальная сеть" className="rounded-3xl border shadow-2xl" />
            <div className="absolute -bottom-6 -left-6 rounded-2xl border bg-card p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl gradient-accent text-[hsl(211_80%_18%)]">
                  <Icon name="TrendingUp" size={24} />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold">+38%</div>
                  <div className="text-sm text-muted-foreground">рост сделок за год</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="py-24">
        <div className="container">
          <SectionHead eyebrow="Знания" title="Статьи про экспорт и торговлю" sub="Гайды, аналитика и кейсы для участников ВЭД" />
          <div className="grid gap-6 md:grid-cols-3">
            {ARTICLES.map((a) => (
              <article key={a.title} className="hover-lift group cursor-pointer overflow-hidden rounded-2xl border bg-card">
                <div className="relative h-40 gradient-export">
                  <div className="absolute inset-0 mesh-bg" />
                  <Badge className="absolute left-4 top-4 bg-white/15 text-white backdrop-blur">{a.tag}</Badge>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{a.date}</span><span>•</span><span>{a.read}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug transition group-hover:text-primary">{a.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Читать <Icon name="ArrowRight" size={15} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS / CTA */}
      <section id="contacts" className="py-24 bg-muted/40">
        <div className="container">
          <div className="grid gap-10 rounded-3xl border bg-card p-8 md:p-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Свяжитесь с нами</h2>
              <p className="mt-3 text-muted-foreground">Оставьте заявку — менеджер поможет подобрать партнёра или разместить предложение.</p>
              <div className="mt-8 space-y-4">
                <Contact icon="Mail" label="Email" value="hello@mrexport.ru" />
                <Contact icon="Phone" label="Телефон" value="+7 (495) 120-45-67" />
                <Contact icon="MapPin" label="Офис" value="Москва, Пресненская наб., 12" />
              </div>
            </div>
            <form className="space-y-4" onSubmit={submitForm}>
              <Input placeholder="Ваше имя" className="h-12" value={form.name} onChange={onField('name')} />
              <Input type="email" placeholder="Email" className="h-12" value={form.email} onChange={onField('email')} />
              <Input placeholder="Компания" className="h-12" value={form.company} onChange={onField('company')} />
              <textarea
                placeholder="Сообщение"
                rows={4}
                value={form.message}
                onChange={onField('message')}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit" disabled={sending} className="w-full gradient-export font-semibold text-white" size="lg">
                {sending ? 'Отправляем…' : 'Отправить заявку'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="gradient-export pt-16 pb-8">
        <div className="container">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <a href="#hero" className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-accent text-[hsl(211_80%_18%)]">
                  <Icon name="Globe2" size={22} />
                </div>
                <span className="font-display text-xl font-bold text-white">Mr<span className="text-gradient">Export</span></span>
              </a>
              <p className="mt-4 text-sm text-white/60">Маркетплейс оптовой торговли и поиска экспортных партнёров.</p>
            </div>
            <FooterCol title="Платформа" links={['Каталог', 'Партнёры', 'Предложения', 'Тарифы']} />
            <FooterCol title="Компания" links={['О нас', 'Команда', 'Карьера', 'Контакты']} />
            <FooterCol title="Поддержка" links={['Помощь', 'Верификация', 'Документы', 'Безопасность']} />
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/50 md:flex-row">
            <span>© 2026 MrExport. Все права защищены.</span>
            <div className="flex gap-4">
              {['Send', 'Mail', 'Linkedin'].map((s) => (
                <a key={s} href="#contacts" className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-white/20">
                  <Icon name={s} size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      {/* OFFER MODAL */}
      <Dialog open={!!offerModal} onOpenChange={(o) => !o && setOfferModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Отклик на предложение</DialogTitle>
          </DialogHeader>
          <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">«{offerModal}»</p>
          <form className="mt-2 space-y-3" onSubmit={submitOffer}>
            <Input
              placeholder="Ваше имя *"
              value={offerForm.name}
              onChange={(e) => setOfferForm((f) => ({ ...f, name: e.target.value }))}
              className="h-11"
            />
            <Input
              type="email"
              placeholder="Email *"
              value={offerForm.email}
              onChange={(e) => setOfferForm((f) => ({ ...f, email: e.target.value }))}
              className="h-11"
            />
            <textarea
              placeholder="Комментарий (необязательно)"
              rows={3}
              value={offerForm.comment}
              onChange={(e) => setOfferForm((f) => ({ ...f, comment: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" disabled={offerSending} className="w-full gradient-export font-semibold text-white" size="lg">
              {offerSending ? 'Отправляем…' : 'Отправить отклик'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SectionHead = ({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) => (
  <div className="mb-12 max-w-2xl">
    <span className="font-display text-sm font-semibold uppercase tracking-widest text-secondary">{eyebrow}</span>
    <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">{title}</h2>
    <p className="mt-3 text-muted-foreground">{sub}</p>
  </div>
);

const Field = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div>
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Icon name={icon} size={13} /> {label}
    </div>
    <div className="mt-0.5 font-medium">{value}</div>
  </div>
);

const Contact = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-primary">
      <Icon name={icon} size={20} />
    </div>
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  </div>
);

const FooterCol = ({ title, links }: { title: string; links: string[] }) => (
  <div>
    <h4 className="font-display font-semibold text-white">{title}</h4>
    <ul className="mt-4 space-y-2.5">
      {links.map((l) => (
        <li key={l}>
          <a href="#" className="text-sm text-white/60 transition hover:text-white">{l}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default Index;