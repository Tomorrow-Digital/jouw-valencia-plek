import { useState, useEffect, FormEvent } from "react";
import { Navbar } from "@/components/redesign/Navbar";
import { Footer } from "@/components/redesign/Footer";
import { type SiteLang, detectSiteLang, st } from "@/lib/site-i18n";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const COASTAL_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBAh4BzcZ7eIzugN7AB2ZNNPP4FaAMXxx7_s5t3K3qag6O2Tn0AUGmeclh70iJwjEeegdQ6xU1Bd6ZMWSPrcGpsYEKQ_7kwSvOZF7dXJNiA27nFE0gJyLgyMjLDj3qutgQ-sUQ6m8lbBXf0opq-QxyoZsJ5RAu3yPUhQAZIMhrRK5lLtvOSRkANqz1MJ64rWbyr34335ks44xG6Sy4QXa2fxJdOcEcnoP0C1H_cwdkXhqGRx3NRqJUlsiobMPY-6sblmDKiGF7jQim6";

const DAYS: Record<string, string[]> = { nl: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"], en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], es: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] };
const MONTHS: Record<string, string[]> = { nl: ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"], en: ["January","February","March","April","May","June","July","August","September","October","November","December"], es: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"] };

type BlockedDate = { start_date: string; end_date: string };
type SeasonalPrice = { id: string; label: string; label_en: string; start_date: string; end_date: string; price_per_night: number };
type PricingConfig = { cleaning_fee: number; minimum_stay: number; maximum_stay: number; weekly_discount: number; monthly_discount: number };

function isDateBlocked(date: Date, blocked: BlockedDate[]): boolean {
  return blocked.some(b => {
    const s = new Date(b.start_date);
    const e = new Date(b.end_date);
    return date >= s && date <= e;
  });
}

export default function BookingPage() {
  const [lang, setLang] = useState<SiteLang>(detectSiteLang);
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [seasons, setSeasons] = useState<SeasonalPrice[]>([]);
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.from("blocked_dates").select("*").order("start_date", { ascending: true }).then(({ data }) => {
      if (data) setBlocked(data);
    });
    supabase.from("seasonal_pricing").select("*").order("start_date", { ascending: true }).then(({ data }) => {
      if (data) setSeasons(data);
    });
    supabase.from("pricing_config").select("*").limit(1).single().then(({ data }) => {
      if (data) setConfig(data);
    });
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells: (number | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !checkIn || !checkOut) {
      toast.error(lang === "nl" ? "Vul alle verplichte velden in" : lang === "es" ? "Completa todos los campos obligatorios" : "Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      message: message || null,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast.error(lang === "nl" ? "Er ging iets mis. Probeer opnieuw." : lang === "es" ? "Algo salió mal. Inténtalo de nuevo." : "Something went wrong. Please try again.");
    } else {
      toast.success(lang === "nl" ? "Boekingsaanvraag verzonden! We nemen contact op." : lang === "es" ? "¡Solicitud de reserva enviada! Nos pondremos en contacto." : "Booking request sent! We'll be in touch.");
      setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setCheckIn(""); setCheckOut(""); setGuests(2); setMessage("");
    }
  };

  function getSeasonLabel(s: SeasonalPrice): string {
    if (lang === "en") return s.label_en || s.label;
    return s.label;
  }

  function formatDateRange(start: string, end: string): string {
    const s = new Date(start);
    const e = new Date(end);
    const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"];
    return `${months[s.getMonth()]} – ${months[e.getMonth()]}`;
  }

  return (
    <div className="bg-surface text-foreground font-body">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <span className="text-primary font-medium tracking-widest uppercase text-xs mb-4 block">{st("book.label", lang)}</span>
              <h1 className="text-5xl md:text-7xl font-headline leading-tight mb-6">
                {st("book.title1", lang)} <br /><span className="italic">{st("book.title2", lang)}</span>
              </h1>
            </div>
            <div className="md:col-span-5 pb-2">
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">{st("book.description", lang)}</p>
            </div>
          </div>
        </header>

        {/* Calendar + Rates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <section className="lg:col-span-8 bg-surface-container-low p-8 md:p-12 rounded-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <h2 className="text-3xl font-headline">{st("book.calendarTitle", lang)}</h2>
              <div className="flex items-center gap-4">
                <button onClick={prevMonth} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-headline text-xl">{MONTHS[lang][month]} {year}</span>
                <button onClick={nextMonth} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-outline-variant/20 overflow-hidden rounded-lg">
              {DAYS[lang].map((d) => (
                <div key={d} className="bg-surface-container-low py-4 text-center text-xs font-bold text-on-surface-variant uppercase tracking-tighter">{d}</div>
              ))}
              {cells.map((day, i) => {
                const date = day ? new Date(year, month, day) : null;
                const blockedDay = date ? isDateBlocked(date, blocked) : false;
                return (
                  <div
                    key={i}
                    className={`h-20 md:h-28 p-3 ${
                      !day ? "bg-white text-transparent" :
                      blockedDay ? "bg-outline-variant/30 text-on-surface-variant/50 cursor-not-allowed" :
                      "bg-white text-on-surface-variant hover:bg-primary/5 cursor-pointer transition-colors"
                    }`}
                  >
                    {day || ""}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-6 mt-6 text-xs text-on-surface-variant">
              <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-white border border-outline-variant/30" /> {st("book.available", lang)}</span>
              <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-outline-variant/30" /> {st("book.booked", lang)}</span>
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low p-8 rounded-xl">
              <h3 className="font-headline text-2xl mb-6">{st("book.seasonalRates", lang)}</h3>
              <div className="space-y-6">
                {seasons.map((s) => (
                  <div key={s.id} className="flex justify-between items-start">
                    <div>
                      <p className="text-primary font-body font-bold tracking-[0.2em] uppercase text-[10px]">{getSeasonLabel(s)}</p>
                      <p className="text-xs text-on-surface-variant italic">{formatDateRange(s.start_date, s.end_date)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-headline">€{s.price_per_night}</span>
                      <span className="text-xs text-on-surface-variant">/{lang === "nl" ? "nacht" : lang === "es" ? "noche" : "night"}</span>
                    </div>
                  </div>
                ))}
              </div>
              {config && (
                <div className="mt-6 p-4 bg-surface-container-high/50 rounded-lg text-xs text-on-surface-variant leading-relaxed">
                  {lang === "nl" ? `* Minimum verblijf van ${config.minimum_stay} nachten. Schoonmaakkosten: €${config.cleaning_fee}.` :
                   lang === "es" ? `* Estancia mínima de ${config.minimum_stay} noches. Tarifa de limpieza: €${config.cleaning_fee}.` :
                   `* Minimum stay of ${config.minimum_stay} nights. Cleaning fee: €${config.cleaning_fee}.`}
                </div>
              )}
            </div>
            <div className="rounded-xl overflow-hidden aspect-video">
              <img src={COASTAL_IMG} alt="Valencia coast" className="w-full h-full object-cover" />
            </div>
          </aside>
        </div>

        {/* Reservation Form */}
        <section className="mb-20">
          <h2 className="text-4xl font-headline text-center mb-2">{st("book.formTitle", lang)}</h2>
          <div className="w-12 h-1 bg-primary mx-auto mb-12 rounded-full" />
          <div className="max-w-3xl mx-auto bg-surface-container-low p-10 rounded-xl">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{lang === "nl" ? "Voornaam" : lang === "es" ? "Nombre" : "First Name"} *</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{lang === "nl" ? "Achternaam" : lang === "es" ? "Apellido" : "Last Name"} *</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("book.email", lang)} *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{lang === "nl" ? "Telefoonnummer" : lang === "es" ? "Teléfono" : "Phone"}</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Check-in *</label>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Check-out *</label>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("book.numGuests", lang)}</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none">
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("book.specialRequests", lang)}</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none resize-none" rows={3} placeholder={st("book.specialPlaceholder", lang)} />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  {st("book.secure", lang)}
                </div>
                <button type="submit" disabled={submitting} className="bg-primary text-white px-10 py-4 rounded-xl font-headline tracking-wide hover:translate-y-[-2px] transition-all duration-300 shadow-lg shadow-primary/10 disabled:opacity-50">
                  {submitting ? "..." : st("book.confirm", lang)}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
