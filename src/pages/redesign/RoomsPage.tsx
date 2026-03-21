import { useState } from "react";
import { Navbar } from "@/components/redesign/Navbar";
import { Footer } from "@/components/redesign/Footer";
import { type SiteLang, detectSiteLang, st } from "@/lib/site-i18n";
import { Wifi, Car, Bath, Snowflake, CookingPot, Waves, Coffee, Croissant } from "lucide-react";

const GALLERY_MAIN = "https://lh3.googleusercontent.com/aida-public/AB6AXuBcxvE3jnr5wh81HcBGod1X_U8OG0kXwE0FumvQC_CT-c_wU_rWnZmczAQmy4GQCSmKrUzc99ot2dVCYeRXCcBNXyJymF1rQnYGJF6rIU3lOtcVhX3A0kjbVCk5RM1rpFooSBCueFQJqngo_QsmYO2RS7fSWoktKXKWawXU-Cvl4yyKleBIz4vr9FlFq9EzHTqAg6CPjwGe86p2HDVXvsHdy6bihJRgieKH-vOpYezUcESGtRc2449ioca6Du7B2JZozlVK0-9IC2_a";
const GALLERY_BATH = "https://lh3.googleusercontent.com/aida-public/AB6AXuATbd7MgxcF-YLLcKxN2OSnR3__AApYKRIlzNl0dqrcgkAlhbFnqMpNsY0HRiRKdtR3go6zkVt5JQELNsrz_miL3goxDXveCfp0zDkOKmofKOflDI5oetSa0atcAzps2y73NAYN-mZaNxQBZhotdCtlFQqKU3b31bfS9zVi93hsuErfZGAbXjz5YobzTlT91e4KrKTQh6jZJesAH7bOTe8jjyYDB6zw6ClfndPTbVYX1KZ6VRhChujU7Bpjb_xlHA1DUJvu02g9q1fP";
const GALLERY_KITCHEN = "https://lh3.googleusercontent.com/aida-public/AB6AXuCUkK0FRnKD9Pq_6SjV7rc84jXVHAsAM-f2y3WEo_PSRsAyA76fd50jZI-XsCazqJkY2RFMVRgTgNB7DgAtBlb29yLBqm8DNt74hL5c5Kfv0uDs94lC_9bNqlJaE2em0fvCTWKexGEqyI7Nqj8KGsHYeVt3DplBro_i1zsumr1UpwuOoaAmojhCYDnEugwwTA3vtCKVUQafBPhZ3nbHk5PV8WlQibemMVnFf5rBZyTCT4pU-JCQA49t5BNsB2D-04bfWxnepm-n18jk";
const ROOM_DETAIL = "https://lh3.googleusercontent.com/aida-public/AB6AXuAu80Sy-9SCJwKaokBZXukclXbpLZ7aZlTHlsdKE6UkXCYK4vIpEY4gCRTE4BgmLV8T0DsB3UPfo5lygYDDE26KgdKT6BZvOpipnIZONSGHPq9-9jXoyXoT4V-Ihv5pkxeZI6EcImU8vvqDbe0oFuZarA3bITVnBlIyy5Sfa74YTt-adeygs34Q1Q-_vPxQC5RiFUVRdv2qyi-q6Bb-mk69VQoHTdrbELqKeKo9gTXG1I7cEHAyU4DguDBwl30w1c6vvtTVo8lslpGu";

const amenities = [
  { icon: Wifi, key: "rooms.wifi" },
  { icon: Car, key: "rooms.parking" },
  { icon: Bath, key: "rooms.privateBath" },
  { icon: Snowflake, key: "rooms.airco" },
  { icon: CookingPot, key: "rooms.kitchen" },
  { icon: Waves, key: "rooms.pool" },
  { icon: Coffee, key: "rooms.coffee" },
  { icon: Croissant, key: "rooms.breakfast" },
];

export default function RoomsPage() {
  const [lang, setLang] = useState<SiteLang>(detectSiteLang);

  return (
    <div className="bg-surface text-foreground font-body">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="pt-24 pb-20">
        {/* Gallery */}
        <section className="max-w-screen-2xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-4 h-auto md:h-[716px]">
            <div className="md:col-span-8 md:row-span-2 relative overflow-hidden rounded-xl">
              <img src={GALLERY_MAIN} alt="Guest room" className="w-full h-full object-cover" />
              <div className="absolute bottom-8 left-8">
                <h1 className="font-headline text-5xl md:text-7xl text-white drop-shadow-lg italic">{st("rooms.title", lang)}</h1>
              </div>
            </div>
            <div className="md:col-span-4 md:row-span-1 relative overflow-hidden rounded-xl">
              <img src={GALLERY_BATH} alt="Bathroom" className="w-full h-full object-cover" />
            </div>
            <div className="md:col-span-4 md:row-span-1 relative overflow-hidden rounded-xl">
              <img src={GALLERY_KITCHEN} alt="Kitchen" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Room Description */}
        <section className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 mb-32">
          <div className="md:col-span-5 flex flex-col justify-center">
            <span className="text-primary-container font-body tracking-widest uppercase text-xs mb-4 block">{st("rooms.experienceLabel", lang)}</span>
            <h2 className="font-headline text-4xl mb-6">{st("rooms.title", lang)}</h2>
            <p className="text-on-surface-variant leading-relaxed mb-8">{st("rooms.description", lang)}</p>
            <div className="flex gap-4 text-on-surface-variant text-sm">
              <span>📐 32m²</span>
              <span>👥 2 {st("hero.guests", lang)}</span>
            </div>
          </div>
          <div className="md:col-span-7 flex justify-end">
            <div className="bg-surface-container-low p-2 rounded-2xl w-full max-w-lg aspect-[4/5] overflow-hidden">
              <img src={ROOM_DETAIL} alt="Room detail" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="bg-surface-container-low py-24 mb-32">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="mb-16 text-center md:text-left">
              <h2 className="font-headline text-4xl mb-2">{st("rooms.comfortsTitle", lang)}</h2>
              <p className="text-on-surface-variant">{st("rooms.comfortsSub", lang)}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {amenities.map((a) => (
                <div key={a.key} className="bg-surface p-8 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col items-center text-center">
                  <a.icon className="w-8 h-8 text-primary-container mb-4" />
                  <span className="font-body font-medium text-sm">{st(a.key, lang)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outdoor Kitchen Feature */}
        <section className="max-w-screen-xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img src={GALLERY_KITCHEN} alt="Outdoor kitchen" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-headline text-3xl mb-6">{st("rooms.outdoorKitchen", lang)}</h2>
              <p className="text-on-surface-variant leading-relaxed">{st("rooms.outdoorKitchenDesc", lang)}</p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-screen-xl mx-auto px-6 mb-32 text-center">
          <h2 className="font-headline text-4xl mb-2">{st("rooms.pricingTitle", lang)}</h2>
          <p className="text-on-surface-variant mb-12">{st("rooms.pricingSub", lang)}</p>
          <div className="max-w-2xl mx-auto bg-surface-container-low rounded-xl overflow-hidden">
            <div className="grid grid-cols-2 p-6 font-semibold text-sm uppercase tracking-wider border-b border-outline-variant/20">
              <span className="text-left">{st("rooms.season", lang)}</span>
              <span className="text-right">{st("rooms.perNight", lang)}</span>
            </div>
            {[
              { name: st("rooms.lowSeason", lang), dates: st("rooms.lowDates", lang), price: "€95", color: "" },
              { name: st("rooms.midSeason", lang), dates: st("rooms.midDates", lang), price: "€125", color: "text-primary" },
              { name: st("rooms.highSeason", lang), dates: st("rooms.highDates", lang), price: "€160", color: "text-primary" },
            ].map((s) => (
              <div key={s.name} className="grid grid-cols-2 p-6 border-b border-outline-variant/10 last:border-0">
                <div className="text-left">
                  <p className={`font-semibold ${s.color}`}>{s.name}</p>
                  <p className="text-xs text-on-surface-variant italic">{s.dates}</p>
                </div>
                <p className={`text-right text-xl font-headline ${s.color}`}>{s.price}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant mt-4">{st("rooms.pricingNote", lang)}</p>
        </section>

        {/* CTA */}
        <section className="mx-6 mb-20">
          <div className="max-w-screen-xl mx-auto bg-primary rounded-2xl py-20 px-8 text-center text-white">
            <h2 className="font-headline text-4xl md:text-5xl mb-8 italic">{st("rooms.ctaTitle", lang)}</h2>
            <a href="/booking" className="inline-block bg-white text-primary px-10 py-4 rounded-full font-semibold text-sm tracking-wide hover:bg-white/90 transition-colors">
              {st("rooms.ctaButton", lang)}
            </a>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
