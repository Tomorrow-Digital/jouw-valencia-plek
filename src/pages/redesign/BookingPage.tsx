import { useState, useEffect, useMemo, useCallback, useRef, FormEvent } from "react";
import { Navbar } from "@/components/redesign/Navbar";
import { Footer } from "@/components/redesign/Footer";
import { type SiteLang, detectSiteLang, st } from "@/lib/site-i18n";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isSameDay, isWithinInterval, isBefore, isAfter, differenceInCalendarDays,
  parseISO, startOfDay, addDays
} from "date-fns";
import { nl as nlLocale, enUS, es as esLocale } from "date-fns/locale";
import { tr, resolveImage } from "@/components/blocks/types";
import type { PageBlock } from "@/components/blocks/types";
import { BookingCtaBlock } from "@/components/blocks/BookingCtaBlock";

const COASTAL_IMG_FALLBACK = "https://lh3.googleusercontent.com/aida-public/AB6AXuBAh4BzcZ7eIzugN7AB2ZNNPP4FaAMXxx7_s5t3K3qag6O2Tn0AUGmeclh70iJwjEeegdQ6xU1Bd6ZMWSPrcGpsYEKQ_7kwSvOZF7dXJNiA27nFE0gJyLgyMjLDj3qutgQ-sUQ6m8lbBXf0opq-QxyoZsJ5RAu3yPUhQAZIMhrRK5lLtvOSRkANqz1MJ64rWbyr34335ks44xG6Sy4QXa2fxJdOcEcnoP0C1H_cwdkXhqGRx3NRqJUlsiobMPY-6sblmDKiGF7jQim6";

const BOOKING_PAGE_ID = "a1000000-0000-0000-0000-000000000004";

const DAY_LABELS: Record<SiteLang, string[]> = {
  nl: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  es: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
};

type BlockedDate = { start_date: string; end_date: string };
type SeasonalPrice = { id: string; label: string; label_en: string; start_date: string; end_date: string; price_per_night: number };
type CustomPrice = { start_date: string; end_date: string; price_per_night: number; label: string };
type PricingConfigDB = {
  default_price_per_night: number;
  cleaning_fee: number;
  minimum_stay: number;
  maximum_stay: number;
  weekly_discount: number;
  monthly_discount: number;
};

function isDateBlocked(date: Date, blocked: BlockedDate[]): boolean {
  return blocked.some(b =>
    isWithinInterval(date, { start: parseISO(b.start_date), end: parseISO(b.end_date) })
  );
}

function hasBlockedInRange(start: Date, end: Date, blocked: BlockedDate[]): boolean {
  const days = eachDayOfInterval({ start, end: addDays(end, -1) });
  return days.some(d => isDateBlocked(d, blocked));
}

function getPriceForDate(date: Date, seasons: SeasonalPrice[], custom: CustomPrice[], defaultPrice: number): number {
  for (const cp of custom) {
    if (isWithinInterval(date, { start: parseISO(cp.start_date), end: parseISO(cp.end_date) }))
      return cp.price_per_night;
  }
  for (const sp of seasons) {
    if (isWithinInterval(date, { start: parseISO(sp.start_date), end: parseISO(sp.end_date) }))
      return sp.price_per_night;
  }
  return defaultPrice;
}

function calculatePricing(
  checkIn: Date, checkOut: Date,
  seasons: SeasonalPrice[], custom: CustomPrice[],
  config: PricingConfigDB
) {
  const nights = differenceInCalendarDays(checkOut, checkIn);
  const nightPrices: { date: Date; price: number }[] = [];
  for (let i = 0; i < nights; i++) {
    const d = addDays(checkIn, i);
    nightPrices.push({ date: d, price: getPriceForDate(d, seasons, custom, config.default_price_per_night) });
  }

  const groups: { price: number; count: number }[] = [];
  for (const np of nightPrices) {
    if (groups.length > 0 && groups[groups.length - 1].price === np.price) {
      groups[groups.length - 1].count++;
    } else {
      groups.push({ price: np.price, count: 1 });
    }
  }

  const subtotal = nightPrices.reduce((s, np) => s + np.price, 0);
  let discountPct = 0;
  if (nights >= 21) discountPct = config.monthly_discount;
  else if (nights >= 7) discountPct = config.weekly_discount;

  const discountAmount = Math.round(subtotal * discountPct / 100);
  const total = subtotal - discountAmount + config.cleaning_fee;

  return { nights, groups, subtotal, discountPct, discountAmount, cleaningFee: config.cleaning_fee, total };
}

export default function BookingPage() {
  const [lang, setLang] = useState<SiteLang>(detectSiteLang);
  const dateFnsLocale = lang === "nl" ? nlLocale : lang === "es" ? esLocale : enUS;

  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [seasons, setSeasons] = useState<SeasonalPrice[]>([]);
  const [custom, setCustom] = useState<CustomPrice[]>([]);
  const [config, setConfig] = useState<PricingConfigDB | null>(null);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);

  const [calMonth, setCalMonth] = useState(startOfMonth(new Date()));
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    supabase.from("blocked_dates").select("*").order("start_date", { ascending: true }).then(({ data }) => { if (data) setBlocked(data); });
    supabase.from("seasonal_pricing").select("*").order("start_date", { ascending: true }).then(({ data }) => { if (data) setSeasons(data); });
    supabase.from("custom_pricing").select("*").order("start_date", { ascending: true }).then(({ data }) => { if (data) setCustom(data); });
    supabase.from("pricing_config").select("*").limit(1).single().then(({ data }) => { if (data) setConfig(data); });
    supabase.from("page_blocks").select("*").eq("page_id", BOOKING_PAGE_ID).order("position", { ascending: true }).then(({ data }) => { if (data) setBlocks(data as unknown as PageBlock[]); });
  }, []);

  const heroBlock = blocks.find(b => b.type === "hero");
  const ctaBlock = blocks.find(b => b.type === "booking_cta" && b.is_visible);

  const heroData = heroBlock?.data;
  const headerHeading = heroData ? tr(heroData.heading, lang) : st("book.title1", lang) + " " + st("book.title2", lang);
  const headerSubtitle = heroData ? tr(heroData.subtitle, lang) : st("book.description", lang);
  const sidebarImage = heroData ? resolveImage(heroData.backgroundImage) : COASTAL_IMG_FALLBACK;



  const handleDateClick = useCallback((date: Date) => {
    if (isDateBlocked(date, blocked)) return;
    if (isBefore(startOfDay(date), startOfDay(new Date()))) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else {
      if (isBefore(date, checkIn)) {
        setCheckIn(date);
        setCheckOut(null);
      } else if (isSameDay(date, checkIn)) {
        return;
      } else {
        if (hasBlockedInRange(checkIn, date, blocked)) {
          setCheckIn(date);
          setCheckOut(null);
        } else {
          setCheckOut(date);
        }
      }
    }
  }, [checkIn, checkOut, blocked]);

  const pricing = useMemo(() => {
    if (checkIn && checkOut && config) return calculatePricing(checkIn, checkOut, seasons, custom, config);
    return null;
  }, [checkIn, checkOut, config, seasons, custom]);

  const nightCount = pricing?.nights ?? 0;
  const belowMinimum = nightCount > 0 && config ? nightCount < config.minimum_stay : false;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form || !checkIn || !checkOut || !pricing || belowMinimum) return;

    const data = new FormData(form);
    const firstName = data.get("firstName") as string;
    const lastName = data.get("lastName") as string;
    const email = data.get("email") as string;

    if (!firstName || !lastName || !email) {
      toast.error(lang === "nl" ? "Vul alle verplichte velden in" : lang === "es" ? "Completa todos los campos obligatorios" : "Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone: (data.get("phone") as string) || null,
      check_in: format(checkIn, "yyyy-MM-dd"),
      check_out: format(checkOut, "yyyy-MM-dd"),
      guests: Number(data.get("guests")) || 2,
      message: (data.get("message") as string) || null,
      total_price: pricing.total,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast.error(lang === "nl" ? "Er ging iets mis. Probeer opnieuw." : lang === "es" ? "Algo salió mal. Inténtalo de nuevo." : "Something went wrong. Please try again.");
    } else {
      toast.success(lang === "nl" ? "Boekingsaanvraag verzonden! We nemen contact op." : lang === "es" ? "¡Solicitud de reserva enviada!" : "Booking request sent! We'll be in touch.");
      setCheckIn(null);
      setCheckOut(null);
      form.reset();
    }
  };

  const statusText = useMemo(() => {
    if (!checkIn) return lang === "nl" ? "Selecteer je check-in datum" : lang === "es" ? "Selecciona tu fecha de check-in" : "Select your check-in date";
    if (!checkOut) return lang === "nl" ? "Selecteer je check-out datum" : lang === "es" ? "Selecciona tu fecha de check-out" : "Select your check-out date";
    if (belowMinimum) return lang === "nl" ? `Minimum verblijf van ${config?.minimum_stay} nachten` : lang === "es" ? `Estancia mínima de ${config?.minimum_stay} noches` : `Minimum stay of ${config?.minimum_stay} nights`;
    return `${format(checkIn, "d MMM", { locale: dateFnsLocale })} → ${format(checkOut, "d MMM yyyy", { locale: dateFnsLocale })}`;
  }, [checkIn, checkOut, belowMinimum, config, lang, dateFnsLocale]);

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
                {headerHeading}
              </h1>
            </div>
            <div className="md:col-span-5 pb-2">
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">{headerSubtitle}</p>
            </div>
          </div>
        </header>

        {/* Calendar + Rates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <section className="lg:col-span-8 bg-surface-container-low p-4 sm:p-8 md:p-12 rounded-xl">
            <h2 className="text-3xl font-headline mb-8">{st("book.calendarTitle", lang)}</h2>

            {/* Calendar navigation */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="p-2 rounded-lg hover:bg-surface-container-high transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-4 sm:gap-12 text-center">
                <span className="font-headline text-lg capitalize">{format(calMonth, "MMMM yyyy", { locale: dateFnsLocale })}</span>
                <span className="font-headline text-lg capitalize hidden sm:block">{format(addMonths(calMonth, 1), "MMMM yyyy", { locale: dateFnsLocale })}</span>
              </div>
              <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="p-2 rounded-lg hover:bg-surface-container-high transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Dual month calendar grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[0, 1].map(offset => {
                const month = addMonths(calMonth, offset);
                const monthStart = startOfMonth(month);
                const monthEnd = endOfMonth(month);
                const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
                const startPad = getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1;

                return (
                  <div key={offset} className={offset === 1 ? "hidden sm:block" : ""}>
                    <div className="sm:hidden mb-2 text-center font-headline text-lg capitalize">
                      {format(month, "MMMM yyyy", { locale: dateFnsLocale })}
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {DAY_LABELS[lang].map(d => (
                        <div key={d} className="text-center text-xs text-on-surface-variant font-medium py-1">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
                      {days.map(day => {
                        const today = startOfDay(new Date());
                        const isToday = isSameDay(day, today);
                        const isPast = isBefore(day, today);
                        const blockedDay = isDateBlocked(day, blocked);
                        const isStart = checkIn && isSameDay(day, checkIn);
                        const isEnd = checkOut && isSameDay(day, checkOut);
                        const inRange = checkIn && checkOut && isAfter(day, checkIn) && isBefore(day, checkOut);
                        const inHoverRange = checkIn && !checkOut && hoverDate && isAfter(hoverDate, checkIn) && isAfter(day, checkIn) && !isAfter(day, hoverDate) && !blockedDay && !isPast;
                        const disabled = isPast || blockedDay;

                        return (
                          <button
                            key={day.toISOString()}
                            disabled={disabled}
                            onClick={() => handleDateClick(day)}
                            onMouseEnter={() => !disabled && setHoverDate(day)}
                            onMouseLeave={() => setHoverDate(null)}
                            className={`
                              relative aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-150
                              ${disabled ? "text-muted-foreground/40 cursor-not-allowed line-through" : "hover:bg-primary/10 cursor-pointer"}
                              ${isStart || isEnd ? "bg-primary text-white font-semibold" : ""}
                              ${inRange ? "bg-primary/20" : ""}
                              ${inHoverRange ? "bg-primary/10" : ""}
                              ${isToday && !isStart && !isEnd ? "ring-1 ring-primary/40" : ""}
                            `}
                          >
                            {format(day, "d")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status text */}
            <div className={`mt-6 text-center text-sm ${belowMinimum ? "text-destructive font-medium" : "text-on-surface-variant"}`}>
              {statusText}
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-6">
            {/* Pricing breakdown */}
            {pricing && !belowMinimum ? (
              <div className="bg-surface-container-low p-8 rounded-xl">
                <h3 className="font-headline text-2xl mb-6">{lang === "nl" ? "Prijsoverzicht" : lang === "es" ? "Resumen de precios" : "Price Summary"}</h3>
                <div className="space-y-3 text-sm">
                  {pricing.groups.map((g, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{g.count} {g.count === 1 ? (lang === "nl" ? "nacht" : lang === "es" ? "noche" : "night") : (lang === "nl" ? "nachten" : lang === "es" ? "noches" : "nights")} × €{g.price}</span>
                      <span>€{g.count * g.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span>{lang === "nl" ? "Schoonmaakkosten" : lang === "es" ? "Tarifa de limpieza" : "Cleaning fee"}</span>
                    <span>€{pricing.cleaningFee}</span>
                  </div>
                  {pricing.discountPct > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{pricing.discountPct}% {lang === "nl" ? "korting" : lang === "es" ? "descuento" : "discount"}</span>
                      <span>−€{pricing.discountAmount}</span>
                    </div>
                  )}
                  <div className="border-t border-outline-variant/30 pt-3 mt-3 flex justify-between font-semibold text-base">
                    <span>{lang === "nl" ? "Totaal" : "Total"}</span>
                    <span>€{pricing.total}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-low p-8 rounded-xl">
                <h3 className="font-headline text-2xl mb-6">{st("book.seasonalRates", lang)}</h3>
                <div className="space-y-6">
                  {seasons.map((s) => (
                    <div key={s.id} className="flex justify-between items-start">
                      <div>
                        <p className="text-primary font-body font-bold tracking-[0.2em] uppercase text-[10px]">{lang === "en" ? (s.label_en || s.label) : s.label}</p>
                        <p className="text-xs text-on-surface-variant italic">
                          {format(parseISO(s.start_date), "MMM", { locale: dateFnsLocale })} – {format(parseISO(s.end_date), "MMM", { locale: dateFnsLocale })}
                        </p>
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
                    {lang === "nl" ? `* Min. ${config.minimum_stay} nachten · Schoonmaak: €${config.cleaning_fee}` :
                     lang === "es" ? `* Mín. ${config.minimum_stay} noches · Limpieza: €${config.cleaning_fee}` :
                     `* Min. ${config.minimum_stay} nights · Cleaning: €${config.cleaning_fee}`}
                  </div>
                )}
              </div>
            )}
            <div className="rounded-xl overflow-hidden aspect-video">
              <img src={sidebarImage} alt="Valencia coast" className="w-full h-full object-cover" />
            </div>
          </aside>
        </div>

        {/* Reservation Form — only shown when dates are selected */}
        {pricing && !belowMinimum && (
          <section className="mb-20">
            <h2 className="text-4xl font-headline text-center mb-2">{st("book.formTitle", lang)}</h2>
            <div className="w-12 h-1 bg-primary mx-auto mb-12 rounded-full" />
            <div className="max-w-3xl mx-auto bg-surface-container-low p-10 rounded-xl">
              <form ref={formRef} className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{lang === "nl" ? "Voornaam" : lang === "es" ? "Nombre" : "First Name"} *</label>
                    <input name="firstName" required className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{lang === "nl" ? "Achternaam" : lang === "es" ? "Apellido" : "Last Name"} *</label>
                    <input name="lastName" required className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("book.email", lang)} *</label>
                    <input name="email" type="email" required className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{lang === "nl" ? "Telefoonnummer" : lang === "es" ? "Teléfono" : "Phone"}</label>
                    <input name="phone" type="tel" className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("book.numGuests", lang)}</label>
                    <select name="guests" defaultValue="2" className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Check-in → Check-out</label>
                    <p className="py-2 font-medium">
                      {format(checkIn!, "d MMM", { locale: dateFnsLocale })} → {format(checkOut!, "d MMM yyyy", { locale: dateFnsLocale })}
                      <span className="text-on-surface-variant text-sm ml-2">({pricing.nights} {pricing.nights === 1 ? "night" : lang === "nl" ? "nachten" : lang === "es" ? "noches" : "nights"})</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("book.specialRequests", lang)}</label>
                  <textarea name="message" className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none resize-none" rows={3} placeholder={st("book.specialPlaceholder", lang)} />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                    <ShieldCheck className="w-5 h-5 text-secondary" />
                    {st("book.secure", lang)}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant mb-1">{lang === "nl" ? "Totaal" : "Total"}: <span className="text-foreground font-headline text-xl">€{pricing.total}</span></p>
                    <button type="submit" disabled={submitting} className="bg-primary text-white px-10 py-4 rounded-xl font-headline tracking-wide hover:translate-y-[-2px] transition-all duration-300 shadow-lg shadow-primary/10 disabled:opacity-50">
                      {submitting ? "..." : st("book.confirm", lang)}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* CTA block from editor */}
        {ctaBlock && ctaBlock.is_visible && (
          <BookingCtaBlock data={ctaBlock.data} lang={lang} />
        )}
      </main>

      <Footer lang={lang} />
    </div>
  );
}
