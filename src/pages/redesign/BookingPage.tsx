import { useState } from "react";
import { Navbar } from "@/components/redesign/Navbar";
import { Footer } from "@/components/redesign/Footer";
import { type SiteLang, detectSiteLang, st } from "@/lib/site-i18n";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

const COASTAL_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBAh4BzcZ7eIzugN7AB2ZNNPP4FaAMXxx7_s5t3K3qag6O2Tn0AUGmeclh70iJwjEeegdQ6xU1Bd6ZMWSPrcGpsYEKQ_7kwSvOZF7dXJNiA27nFE0gJyLgyMjLDj3qutgQ-sUQ6m8lbBXf0opq-QxyoZsJ5RAu3yPUhQAZIMhrRK5lLtvOSRkANqz1MJ64rWbyr34335ks44xG6Sy4QXa2fxJdOcEcnoP0C1H_cwdkXhqGRx3NRqJUlsiobMPY-6sblmDKiGF7jQim6";

const DAYS = { nl: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"], en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], es: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] };
const MONTHS = { nl: ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"], en: ["January","February","March","April","May","June","July","August","September","October","November","December"], es: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"] };

export default function BookingPage() {
  const [lang, setLang] = useState<SiteLang>(detectSiteLang);
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const cells: (number | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
  };

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
              {cells.map((day, i) => (
                <div key={i} className={`bg-white h-20 md:h-28 p-3 ${day ? "text-on-surface-variant hover:bg-primary/5 cursor-pointer transition-colors" : "text-transparent"}`}>
                  {day || ""}
                </div>
              ))}
            </div>
            <div className="flex gap-6 mt-6 text-xs text-on-surface-variant">
              <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-white border border-outline-variant/30" /> {st("book.available", lang)}</span>
              <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-outline-variant/30" /> {st("book.booked", lang)}</span>
              <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-primary/20" /> {st("book.selected", lang)}</span>
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low p-8 rounded-xl">
              <h3 className="font-headline text-2xl mb-6">{st("book.seasonalRates", lang)}</h3>
              <div className="space-y-6">
                {[
                  { label: st("rooms.lowSeason", lang), dates: st("rooms.lowDates", lang), price: "€120" },
                  { label: st("rooms.midSeason", lang), dates: st("rooms.midDates", lang), price: "€165" },
                  { label: st("rooms.highSeason", lang), dates: st("rooms.highDates", lang), price: "€210" },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between items-start">
                    <div>
                      <p className="text-primary font-body font-bold tracking-[0.2em] uppercase text-[10px]">{s.label}</p>
                      <p className="text-xs text-on-surface-variant italic">{s.dates}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-headline">{s.price}</span>
                      <span className="text-xs text-on-surface-variant">/{lang === "nl" ? "nacht" : lang === "es" ? "noche" : "night"}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-surface-container-high/50 rounded-lg text-xs text-on-surface-variant leading-relaxed">
                {st("book.minStay", lang)}
              </div>
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
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("book.fullName", lang)}</label>
                  <input className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" placeholder="Mateo Hernandez" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("book.email", lang)}</label>
                  <input type="email" className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" placeholder="mateo@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("book.checkInOut", lang)}</label>
                  <input type="date" className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("book.numGuests", lang)}</label>
                  <select className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none">
                    <option>1</option>
                    <option selected>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("book.specialRequests", lang)}</label>
                <textarea className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none resize-none" rows={3} placeholder={st("book.specialPlaceholder", lang)} />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  {st("book.secure", lang)}
                </div>
                <button type="submit" className="bg-primary text-white px-10 py-4 rounded-xl font-headline tracking-wide hover:translate-y-[-2px] transition-all duration-300 shadow-lg shadow-primary/10">
                  {st("book.confirm", lang)}
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
