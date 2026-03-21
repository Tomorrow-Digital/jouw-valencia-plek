import { useState, useEffect, useMemo, useCallback, useRef, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isSameDay, isWithinInterval, isBefore, isAfter, differenceInCalendarDays,
  parseISO, startOfDay, addDays,
} from "date-fns";
import { nl as nlLocale, enUS, es as esLocale } from "date-fns/locale";
import { tr } from "./types";
import type { TranslatableString } from "./types";

/* ── Supabase types ── */
type BlockedDate = { start_date: string; end_date: string };
type SeasonalPrice = { id: string; label: string; label_en: string; start_date: string; end_date: string; price_per_night: number };
type CustomPrice = { start_date: string; end_date: string; price_per_night: number; label: string };
type PricingConfigDB = {
  default_price_per_night: number; cleaning_fee: number;
  minimum_stay: number; maximum_stay: number;
  weekly_discount: number; monthly_discount: number;
};

/* ── Helpers ── */
function isDateBlocked(date: Date, blocked: BlockedDate[]) {
  return blocked.some(b =>
    isWithinInterval(date, { start: parseISO(b.start_date), end: parseISO(b.end_date) })
  );
}
function hasBlockedInRange(start: Date, end: Date, blocked: BlockedDate[]) {
  return eachDayOfInterval({ start, end: addDays(end, -1) }).some(d => isDateBlocked(d, blocked));
}
function getPriceForDate(date: Date, seasons: SeasonalPrice[], custom: CustomPrice[], defaultPrice: number) {
  for (const cp of custom) {
    if (isWithinInterval(date, { start: parseISO(cp.start_date), end: parseISO(cp.end_date) })) return cp.price_per_night;
  }
  for (const sp of seasons) {
    if (isWithinInterval(date, { start: parseISO(sp.start_date), end: parseISO(sp.end_date) })) return sp.price_per_night;
  }
  return defaultPrice;
}
function calculatePricing(checkIn: Date, checkOut: Date, seasons: SeasonalPrice[], custom: CustomPrice[], config: PricingConfigDB) {
  const nights = differenceInCalendarDays(checkOut, checkIn);
  const nightPrices: { date: Date; price: number }[] = [];
  for (let i = 0; i < nights; i++) {
    const d = addDays(checkIn, i);
    nightPrices.push({ date: d, price: getPriceForDate(d, seasons, custom, config.default_price_per_night) });
  }
  const groups: { price: number; count: number }[] = [];
  for (const np of nightPrices) {
    if (groups.length > 0 && groups[groups.length - 1].price === np.price) groups[groups.length - 1].count++;
    else groups.push({ price: np.price, count: 1 });
  }
  const subtotal = nightPrices.reduce((s, np) => s + np.price, 0);
  let discountPct = 0;
  if (nights >= 21) discountPct = config.monthly_discount;
  else if (nights >= 7) discountPct = config.weekly_discount;
  const discountAmount = Math.round(subtotal * discountPct / 100);
  const total = subtotal - discountAmount + config.cleaning_fee;
  return { nights, groups, subtotal, discountPct, discountAmount, cleaningFee: config.cleaning_fee, total };
}

const DAY_LABELS: Record<string, string[]> = {
  nl: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  es: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
};

const LABELS = {
  calendarTitle: { nl: "Beschikbaarheid & prijzen", en: "Availability & rates", es: "Disponibilidad y tarifas" },
  selectCheckIn: { nl: "Selecteer je check-in datum", en: "Select your check-in date", es: "Selecciona tu fecha de check-in" },
  selectCheckOut: { nl: "Selecteer je check-out datum", en: "Select your check-out date", es: "Selecciona tu fecha de check-out" },
  priceSummary: { nl: "Prijsoverzicht", en: "Price Summary", es: "Resumen de precios" },
  seasonalRates: { nl: "Seizoenstarieven", en: "Seasonal rates", es: "Tarifas de temporada" },
  night: { nl: "nacht", en: "night", es: "noche" },
  nights: { nl: "nachten", en: "nights", es: "noches" },
  cleaningFee: { nl: "Schoonmaakkosten", en: "Cleaning fee", es: "Tarifa de limpieza" },
  discount: { nl: "korting", en: "discount", es: "descuento" },
  total: { nl: "Totaal", en: "Total", es: "Total" },
  formTitle: { nl: "Reservering afronden", en: "Complete your reservation", es: "Completa tu reserva" },
  firstName: { nl: "Voornaam", en: "First Name", es: "Nombre" },
  lastName: { nl: "Achternaam", en: "Last Name", es: "Apellido" },
  email: { nl: "E-mailadres", en: "Email", es: "Correo electrónico" },
  phone: { nl: "Telefoonnummer", en: "Phone", es: "Teléfono" },
  guests: { nl: "Aantal gasten", en: "Number of guests", es: "Número de huéspedes" },
  specialRequests: { nl: "Bijzondere wensen", en: "Special requests", es: "Peticiones especiales" },
  specialPlaceholder: { nl: "Bijv. allergieën, aankomsttijd...", en: "E.g. allergies, arrival time...", es: "Ej. alergias, hora de llegada..." },
  secure: { nl: "Veilig & versleuteld", en: "Safe & encrypted", es: "Seguro y encriptado" },
  confirm: { nl: "Boekingsaanvraag versturen", en: "Submit booking request", es: "Enviar solicitud" },
  fillAll: { nl: "Vul alle verplichte velden in", en: "Please fill in all required fields", es: "Completa todos los campos obligatorios" },
  success: { nl: "Boekingsaanvraag verzonden! We nemen contact op.", en: "Booking request sent! We'll be in touch.", es: "¡Solicitud de reserva enviada!" },
  error: { nl: "Er ging iets mis. Probeer opnieuw.", en: "Something went wrong. Please try again.", es: "Algo salió mal. Inténtalo de nuevo." },
};

function l(key: keyof typeof LABELS, lang: string) {
  return (LABELS[key] as any)[lang] || (LABELS[key] as any).en;
}

/* ── Block data interface ── */
export interface BookingBlockData {
  heading?: TranslatableString;
  subtitle?: TranslatableString;
}

/* ── Component ── */
export function BookingBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const dateFnsLocale = lang === "nl" ? nlLocale : lang === "es" ? esLocale : enUS;

  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [seasons, setSeasons] = useState<SeasonalPrice[]>([]);
  const [custom, setCustom] = useState<CustomPrice[]>([]);
  const [config, setConfig] = useState<PricingConfigDB | null>(null);

  const [calMonth, setCalMonth] = useState(startOfMonth(new Date()));
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    supabase.from("blocked_dates").select("*").order("start_date").then(({ data }) => { if (data) setBlocked(data); });
    supabase.from("seasonal_pricing").select("*").order("start_date").then(({ data }) => { if (data) setSeasons(data); });
    supabase.from("custom_pricing").select("*").order("start_date").then(({ data }) => { if (data) setCustom(data); });
    supabase.from("pricing_config").select("*").limit(1).single().then(({ data }) => { if (data) setConfig(data); });
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    if (isDateBlocked(date, blocked) || isBefore(startOfDay(date), startOfDay(new Date()))) return;
    if (!checkIn || (checkIn && checkOut)) { setCheckIn(date); setCheckOut(null); }
    else {
      if (isBefore(date, checkIn)) { setCheckIn(date); setCheckOut(null); }
      else if (isSameDay(date, checkIn)) return;
      else if (hasBlockedInRange(checkIn, date, blocked)) { setCheckIn(date); setCheckOut(null); }
      else setCheckOut(date);
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
    const fd = new FormData(form);
    const firstName = fd.get("firstName") as string;
    const lastName = fd.get("lastName") as string;
    const email = fd.get("email") as string;
    if (!firstName || !lastName || !email) { toast.error(l("fillAll", lang)); return; }
    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      first_name: firstName, last_name: lastName, email,
      phone: (fd.get("phone") as string) || null,
      check_in: format(checkIn, "yyyy-MM-dd"), check_out: format(checkOut, "yyyy-MM-dd"),
      guests: Number(fd.get("guests")) || 2,
      message: (fd.get("message") as string) || null,
      total_price: pricing.total, status: "pending",
    });
    setSubmitting(false);
    if (error) toast.error(l("error", lang));
    else { toast.success(l("success", lang)); setCheckIn(null); setCheckOut(null); form.reset(); }
  };

  const statusText = useMemo(() => {
    if (!checkIn) return l("selectCheckIn", lang);
    if (!checkOut) return l("selectCheckOut", lang);
    if (belowMinimum) return `${lang === "nl" ? "Minimum verblijf van" : lang === "es" ? "Estancia mínima de" : "Minimum stay of"} ${config?.minimum_stay} ${l("nights", lang)}`;
    return `${format(checkIn, "d MMM", { locale: dateFnsLocale })} → ${format(checkOut, "d MMM yyyy", { locale: dateFnsLocale })}`;
  }, [checkIn, checkOut, belowMinimum, config, lang, dateFnsLocale]);

  const heading = data.heading ? tr(data.heading, lang) : "";
  const subtitle = data.subtitle ? tr(data.subtitle, lang) : "";

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Optional heading */}
      {heading && (
        <header className="mb-16">
          <h2 className="text-4xl md:text-5xl font-headline leading-tight mb-4">{heading}</h2>
          {subtitle && <p className="text-on-surface-variant text-lg max-w-2xl">{subtitle}</p>}
        </header>
      )}

      {/* Calendar + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-8 bg-surface-container-low p-4 sm:p-8 md:p-12 rounded-xl">
          <h3 className="text-3xl font-headline mb-8">{l("calendarTitle", lang)}</h3>

          {/* Nav */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="p-2 rounded-lg hover:bg-surface-container-high transition-colors"><ChevronLeft size={20} /></button>
            <div className="flex gap-4 sm:gap-12 text-center">
              <span className="font-headline text-lg capitalize">{format(calMonth, "MMMM yyyy", { locale: dateFnsLocale })}</span>
              <span className="font-headline text-lg capitalize hidden sm:block">{format(addMonths(calMonth, 1), "MMMM yyyy", { locale: dateFnsLocale })}</span>
            </div>
            <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="p-2 rounded-lg hover:bg-surface-container-high transition-colors"><ChevronRight size={20} /></button>
          </div>

          {/* Dual calendar */}
          <div className="grid sm:grid-cols-2 gap-6">
            {[0, 1].map(offset => {
              const month = addMonths(calMonth, offset);
              const monthStart = startOfMonth(month);
              const monthEnd = endOfMonth(month);
              const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
              const startPad = getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1;
              return (
                <div key={offset} className={offset === 1 ? "hidden sm:block" : ""}>
                  <div className="sm:hidden mb-2 text-center font-headline text-lg capitalize">{format(month, "MMMM yyyy", { locale: dateFnsLocale })}</div>
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {(DAY_LABELS[lang] || DAY_LABELS.en).map(d => (
                      <div key={d} className="text-center text-xs text-on-surface-variant font-medium py-1">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
                    {days.map(day => {
                      const today = startOfDay(new Date());
                      const isPast = isBefore(day, today);
                      const blockedDay = isDateBlocked(day, blocked);
                      const isStart = checkIn && isSameDay(day, checkIn);
                      const isEnd = checkOut && isSameDay(day, checkOut);
                      const inRange = checkIn && checkOut && isAfter(day, checkIn) && isBefore(day, checkOut);
                      const inHoverRange = checkIn && !checkOut && hoverDate && isAfter(hoverDate, checkIn) && isAfter(day, checkIn) && !isAfter(day, hoverDate) && !blockedDay && !isPast;
                      const disabled = isPast || blockedDay;
                      const isToday = isSameDay(day, today);
                      return (
                        <button
                          key={day.toISOString()} disabled={disabled}
                          onClick={() => handleDateClick(day)}
                          onMouseEnter={() => !disabled && setHoverDate(day)}
                          onMouseLeave={() => setHoverDate(null)}
                          className={`
                            relative aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-150
                            ${disabled ? "text-muted-foreground/40 cursor-not-allowed line-through" : "hover:bg-primary/10 cursor-pointer"}
                            ${isStart || isEnd ? "bg-primary text-white font-semibold" : ""}
                            ${inRange ? "bg-primary/20" : ""} ${inHoverRange ? "bg-primary/10" : ""}
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

          <div className={`mt-6 text-center text-sm ${belowMinimum ? "text-destructive font-medium" : "text-on-surface-variant"}`}>{statusText}</div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {pricing && !belowMinimum ? (
            <div className="bg-surface-container-low p-8 rounded-xl">
              <h3 className="font-headline text-2xl mb-6">{l("priceSummary", lang)}</h3>
              <div className="space-y-3 text-sm">
                {pricing.groups.map((g, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{g.count} {g.count === 1 ? l("night", lang) : l("nights", lang)} × €{g.price}</span>
                    <span>€{g.count * g.price}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span>{l("cleaningFee", lang)}</span>
                  <span>€{pricing.cleaningFee}</span>
                </div>
                {pricing.discountPct > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{pricing.discountPct}% {l("discount", lang)}</span>
                    <span>−€{pricing.discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-outline-variant/30 pt-3 mt-3 flex justify-between font-semibold text-base">
                  <span>{l("total", lang)}</span>
                  <span>€{pricing.total}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-low p-8 rounded-xl">
              <h3 className="font-headline text-2xl mb-6">{l("seasonalRates", lang)}</h3>
              <div className="space-y-6">
                {seasons.map(s => (
                  <div key={s.id} className="flex justify-between items-start">
                    <div>
                      <p className="text-primary font-body font-bold tracking-[0.2em] uppercase text-[10px]">{lang === "en" ? (s.label_en || s.label) : s.label}</p>
                      <p className="text-xs text-on-surface-variant italic">
                        {format(parseISO(s.start_date), "MMM", { locale: dateFnsLocale })} – {format(parseISO(s.end_date), "MMM", { locale: dateFnsLocale })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-headline">€{s.price_per_night}</span>
                      <span className="text-xs text-on-surface-variant">/{l("night", lang)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {config && (
                <div className="mt-6 p-4 bg-surface-container-high/50 rounded-lg text-xs text-on-surface-variant leading-relaxed">
                  * Min. {config.minimum_stay} {l("nights", lang)} · {l("cleaningFee", lang)}: €{config.cleaning_fee}
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Form — shown when dates are valid */}
      {pricing && !belowMinimum && (
        <div className="mb-8">
          <h3 className="text-4xl font-headline text-center mb-2">{l("formTitle", lang)}</h3>
          <div className="w-12 h-1 bg-primary mx-auto mb-12 rounded-full" />
          <div className="max-w-3xl mx-auto bg-surface-container-low p-10 rounded-xl">
            <form ref={formRef} className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{l("firstName", lang)} *</label>
                  <input name="firstName" required className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{l("lastName", lang)} *</label>
                  <input name="lastName" required className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{l("email", lang)} *</label>
                  <input name="email" type="email" required className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{l("phone", lang)}</label>
                  <input name="phone" type="tel" className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{l("guests", lang)}</label>
                  <select name="guests" defaultValue="2" className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none">
                    <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Check-in → Check-out</label>
                  <p className="py-2 font-medium">
                    {format(checkIn!, "d MMM", { locale: dateFnsLocale })} → {format(checkOut!, "d MMM yyyy", { locale: dateFnsLocale })}
                    <span className="text-on-surface-variant text-sm ml-2">({pricing.nights} {pricing.nights === 1 ? l("night", lang) : l("nights", lang)})</span>
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{l("specialRequests", lang)}</label>
                <textarea name="message" className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none resize-none" rows={3} placeholder={l("specialPlaceholder", lang)} />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  {l("secure", lang)}
                </div>
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant mb-1">{l("total", lang)}: <span className="text-foreground font-headline text-xl">€{pricing.total}</span></p>
                  <button type="submit" disabled={submitting} className="bg-primary text-white px-10 py-4 rounded-xl font-headline tracking-wide hover:translate-y-[-2px] transition-all duration-300 shadow-lg shadow-primary/10 disabled:opacity-50">
                    {submitting ? "..." : l("confirm", lang)}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
