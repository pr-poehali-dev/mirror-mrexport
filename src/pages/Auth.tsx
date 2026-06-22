import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import func2url from '../../backend/func2url.json';

const COUNTRIES = [
  'Россия', 'Казахстан', 'Беларусь', 'Узбекистан', 'Азербайджан',
  'Китай', 'Германия', 'Турция', 'ОАЭ', 'Индия', 'Другая',
];

const Auth = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [login, setLogin] = useState({ email: '', password: '' });
  const [reg, setReg] = useState({ name: '', email: '', company: '', country: 'Россия', password: '', confirm: '' });

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.email || !login.password) {
      toast({ title: 'Заполните все поля', variant: 'destructive' }); return;
    }
    setSending(true);
    try {
      const res = await fetch(`${func2url['auth']}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка входа');
      localStorage.setItem('mx_token', data.token);
      localStorage.setItem('mx_partner', JSON.stringify(data.partner));
      toast({ title: `Добро пожаловать, ${data.partner.name}!` });
      navigate('/');
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : 'Ошибка входа', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg.name || !reg.email || !reg.company || !reg.password) {
      toast({ title: 'Заполните все обязательные поля', variant: 'destructive' }); return;
    }
    if (reg.password !== reg.confirm) {
      toast({ title: 'Пароли не совпадают', variant: 'destructive' }); return;
    }
    if (reg.password.length < 6) {
      toast({ title: 'Пароль — минимум 6 символов', variant: 'destructive' }); return;
    }
    setSending(true);
    try {
      const res = await fetch(`${func2url['auth']}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: reg.name, email: reg.email, company: reg.company, country: reg.country, password: reg.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');
      localStorage.setItem('mx_token', data.token);
      localStorage.setItem('mx_partner', JSON.stringify(data.partner));
      toast({ title: 'Аккаунт создан!', description: 'Добро пожаловать на платформу SD Trade.' });
      navigate('/');
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : 'Ошибка регистрации', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex gradient-export">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <a href="/" className="relative flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-accent text-[hsl(222_55%_12%)]">
            <Icon name="Globe2" size={22} />
          </div>
          <span className="font-display text-xl font-bold text-gradient">
            SD Trade
          </span>
        </a>

        <div className="relative space-y-8">
          <h2 className="font-display text-4xl font-bold text-white leading-tight">
            Глобальная торговля<br />начинается здесь
          </h2>
          <div className="space-y-4">
            {[
              { icon: 'ShieldCheck', text: 'Все партнёры проходят верификацию' },
              { icon: 'Globe2', text: 'Выход на рынки 76 стран мира' },
              { icon: 'TrendingUp', text: 'Оборот сделок свыше $2.1 млрд' },
              { icon: 'BadgeCheck', text: 'Юридическое сопровождение сделок' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10">
                  <Icon name={f.icon} size={18} className="text-[hsl(43_85%_48%)]" />
                </div>
                <span className="text-white/85 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-accent font-display font-bold text-[hsl(222_55%_12%)] text-sm">AG</div>
            <div>
              <div className="font-semibold text-white text-sm">AgroGlobal Trade</div>
              <div className="text-white/55 text-xs">Казахстан • Зерновые культуры</div>
            </div>
          </div>
          <p className="mt-3 text-white/70 text-sm italic">
            «Через SD Trade нашли надёжных покупателей в Египте и Иране. Теперь экспортируем 80 000 т/год.»
          </p>
          <div className="mt-2 flex gap-0.5">
            {[1,2,3,4,5].map(s => <Icon key={s} name="Star" size={13} className="text-[hsl(43_85%_48%)]" />)}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <a href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-export text-white">
              <Icon name="Globe2" size={19} />
            </div>
            <span className="font-display text-lg font-bold">SD Trade</span>
          </a>

          {/* TABS */}
          <div className="flex rounded-xl border bg-muted p-1 mb-8">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  tab === t ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'login' ? 'Войти' : 'Регистрация'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={onLogin} className="space-y-4">
              <div>
                <h1 className="font-display text-2xl font-bold">Вход в аккаунт</h1>
                <p className="text-muted-foreground text-sm mt-1">Войдите, чтобы управлять предложениями и партнёрами</p>
              </div>
              <div className="space-y-3 pt-2">
                <div className="relative">
                  <Icon name="Mail" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="h-12 pl-10"
                    value={login.email}
                    onChange={(e) => setLogin(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="relative">
                  <Icon name="Lock" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Пароль"
                    className="h-12 pl-10"
                    value={login.password}
                    onChange={(e) => setLogin(f => ({ ...f, password: e.target.value }))}
                  />
                </div>
              </div>
              <Button type="submit" disabled={sending} className="w-full h-12 gradient-export font-semibold text-white text-base">
                {sending ? 'Входим…' : 'Войти'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Нет аккаунта?{' '}
                <button type="button" onClick={() => setTab('register')} className="font-semibold text-primary hover:underline">
                  Зарегистрироваться
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={onRegister} className="space-y-4">
              <div>
                <h1 className="font-display text-2xl font-bold">Создать аккаунт</h1>
                <p className="text-muted-foreground text-sm mt-1">Присоединяйтесь к 3 800+ проверенным партнёрам</p>
              </div>
              <div className="space-y-3 pt-2">
                <div className="relative">
                  <Icon name="User" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Полное имя *" className="h-12 pl-10" value={reg.name}
                    onChange={(e) => setReg(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="relative">
                  <Icon name="Mail" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" placeholder="Email *" className="h-12 pl-10" value={reg.email}
                    onChange={(e) => setReg(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="relative">
                  <Icon name="Building2" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Название компании *" className="h-12 pl-10" value={reg.company}
                    onChange={(e) => setReg(f => ({ ...f, company: e.target.value }))} />
                </div>
                <select
                  value={reg.country}
                  onChange={(e) => setReg(f => ({ ...f, country: e.target.value }))}
                  className="w-full h-12 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <div className="relative">
                  <Icon name="Lock" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="password" placeholder="Пароль (мин. 6 символов) *" className="h-12 pl-10" value={reg.password}
                    onChange={(e) => setReg(f => ({ ...f, password: e.target.value }))} />
                </div>
                <div className="relative">
                  <Icon name="Lock" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="password" placeholder="Повторите пароль *" className="h-12 pl-10" value={reg.confirm}
                    onChange={(e) => setReg(f => ({ ...f, confirm: e.target.value }))} />
                </div>
              </div>
              <Button type="submit" disabled={sending} className="w-full h-12 gradient-export font-semibold text-white text-base">
                {sending ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <a href="#" className="underline">условиями использования</a>
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Уже есть аккаунт?{' '}
                <button type="button" onClick={() => setTab('login')} className="font-semibold text-primary hover:underline">
                  Войти
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;