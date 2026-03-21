import { useState } from "react";
import { Navbar } from "@/components/redesign/Navbar";
import { Footer } from "@/components/redesign/Footer";
import { type SiteLang, detectSiteLang, st } from "@/lib/site-i18n";
import { Train, Car, Plane, Heart, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const HERO_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCBnuHvDvp9GJcWu5tk0U1DJKzipF5N1dQAXim6BKWRYCcs7UuTPh0OEWxfVrpavZXuZKR5tdW4GN6U2dw9qH4fMA1QEr-_Y8rEyuSyY5hOGtKCJOZ6LyNhWg6T1iDF5K_cjqT4HwC1tO3TpJiJvg_JrXhBuOolPGF5qWopRB_6d-Ty1xIKQ5ydvt8-OqEiyzRa-g035UsZctH7AN0nOuCpwIy3gXZehPkAkM8xWsjH1ee4ih-Hf_Nn25i2yyPEcW9rTqN_ql-egmzJ";
const CENTER_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuClMprIlHmAxY0IvpD3ctbvG-KpPEFcmNcT2_pkcDiyph4oDRc3RZisb-rSBoNWumGvc8y8uGbp1CQvnr6R_FrvI5WU7kOEQ-CxCDT5Sjs3RlztIFI0TJnMFcCst1NUXDhFLPoRUZSPNiXoxORBgFQqkAmjUrvalyqXDeeyuMl8B1ueV3yx74ljC3sub_a6J3c-qU63g4MB2om8Cq2CQ_GlQnpOyq_eJfChI-Sr51_RoxGto21T1a3ge84AjkA75MRItZXXCBaLybVD";
const BEACH_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBhma1EKR3htCLNmpVJDTbyo1SBad1jBkHlGh9O0ZapEb2WDzH57D1tb9Y9nElaf0ezcM-eLbFmURRWuwHMbazBnA_nCB1dROF27skXPqLyQ5qf1quv7_d7hQRfB0Gas8TM6Yf9Hxcea69g2aHhLKTbMfvO778sCyj7OAn1j8lS3r0gkC22vuQ83GVjFFmm1qjlWFAQ6DoPtQBvkxGxUDP61apcPceSB_aIw2MN4wIVwBIL6x-5spqZQIbGQmX4VKMmqxt-DUZQRs1-";
const AIRPORT_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBAh4BzcZ7eIzugN7AB2ZNNPP4FaAMXxx7_s5t3K3qag6O2Tn0AUGmeclh70iJwjEeegdQ6xU1Bd6ZMWSPrcGpsYEKQ_7kwSvOZF7dXJNiA27nFE0gJyLgyMjLDj3qutgQ-sUQ6m8lbBXf0opq-QxyoZsJ5RAu3yPUhQAZIMhrRK5lLtvOSRkANqz1MJ64rWbyr34335ks44xG6Sy4QXa2fxJdOcEcnoP0C1H_cwdkXhqGRx3NRqJUlsiobMPY-6sblmDKiGF7jQim6";

const TIPS = [
  { category: { nl: "Restaurants", en: "Restaurants", es: "Restaurantes" }, name: "Casa Carmela", desc: { nl: "De beste traditionele paella, gebakken op houtvuur. Reserveren is een must!", en: "The best traditional paella, cooked over wood fire. Reservations are a must!", es: "La mejor paella tradicional, cocinada a leña. ¡Es imprescindible reservar!" } },
  { category: { nl: "Markten", en: "Markets", es: "Mercados" }, name: "Mercado Central", desc: { nl: "Een architectonisch hoogstandje vol verse lokale producten. Ga vroeg voor de lekkerste churros.", en: "An architectural masterpiece full of fresh local produce. Go early for the best churros.", es: "Una obra maestra arquitectónica llena de productos locales frescos. Ve temprano para los mejores churros." } },
  { category: { nl: "Verborgen Plekken", en: "Hidden Gems", es: "Joyas Ocultas" }, name: "Plaza de la Virgen", desc: { nl: "Bezoek dit plein bij zonsondergang voor een magische sfeer en prachtige verlichting.", en: "Visit this square at sunset for a magical atmosphere and beautiful lighting.", es: "Visita esta plaza al atardecer para una atmósfera mágica e iluminación preciosa." } },
  { category: { nl: "Drankjes", en: "Drinks", es: "Bebidas" }, name: "Café de las Horas", desc: { nl: "Beroemd om hun 'Agua de Valencia', een heerlijk neo-barok interieur.", en: "Famous for their 'Agua de Valencia', a delightful neo-baroque interior.", es: "Famoso por su 'Agua de Valencia', un encantador interior neobarroco." } },
];

export default function SurroundingsPage() {
  const [lang, setLang] = useState<SiteLang>(detectSiteLang);

  const destinations = [
    { img: CENTER_IMG, title: st("surr.center", lang), desc: st("surr.centerDesc", lang), time: st("surr.centerTime", lang), icon: Train },
    { img: BEACH_IMG, title: st("surr.beach", lang), desc: st("surr.beachDesc", lang), time: st("surr.beachTime", lang), icon: Car },
    { img: AIRPORT_IMG, title: st("surr.airport", lang), desc: st("surr.airportDesc", lang), time: st("surr.airportTime", lang), icon: Plane },
  ];

  return (
    <div className="bg-surface text-foreground font-body">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="relative h-[600px] flex items-center px-8 md:px-20 overflow-hidden mb-24">
          <div className="absolute inset-0 z-0">
            <img src={HERO_IMG} alt="Valencia panorama" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="text-primary font-headline italic text-xl mb-4 block">{st("surr.heroLabel", lang)}</span>
            <h1 className="text-6xl md:text-8xl font-headline font-bold leading-tight tracking-tight mb-6">
              {st("surr.title", lang)}
            </h1>
            <p className="text-lg text-on-surface-variant max-w-lg leading-relaxed">{st("surr.heroDesc", lang)}</p>
          </div>
        </section>

        {/* Destinations */}
        <section className="max-w-screen-2xl mx-auto px-8 md:px-20 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {destinations.map((d, i) => (
              <div key={d.title} className={`group ${i === 1 ? "md:mt-16" : ""}`}>
                <div className="aspect-[4/5] overflow-hidden rounded-xl mb-6 relative">
                  <img src={d.img} alt={d.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/30 backdrop-blur-lg rounded-lg">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <d.icon className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-widest">{d.time}</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-headline font-bold mb-3">{d.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Local Tips */}
        <section className="bg-surface-container-low py-24 mb-32">
          <div className="max-w-screen-xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <span className="text-primary font-body font-bold tracking-[0.3em] uppercase text-xs mb-4 block">{st("surr.tipsLabel", lang)}</span>
              <h2 className="font-headline text-4xl mb-6">{st("surr.tipsTitle", lang)}</h2>
              <p className="text-on-surface-variant leading-relaxed mb-8">{st("surr.tipsDesc", lang)}</p>
              <div className="flex items-center gap-3 text-primary">
                <Heart className="w-5 h-5" />
                <span className="font-medium">{st("surr.hiddenGems", lang)}</span>
              </div>
              <p className="text-sm text-on-surface-variant mt-2">{st("surr.hiddenGemsDesc", lang)}</p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {TIPS.map((tip) => (
                <div key={tip.name} className="bg-surface rounded-xl p-6">
                  <span className="text-primary font-body font-bold tracking-[0.2em] uppercase text-[10px] mb-2 block">{tip.category[lang]}</span>
                  <h3 className="font-headline text-xl mb-2">{tip.name}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{tip.desc[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Find Us */}
        <section className="max-w-screen-xl mx-auto px-8 mb-20">
          <div className="bg-primary rounded-2xl p-12 md:p-16 text-white grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-headline text-4xl mb-4">{st("surr.findUs", lang)}</h2>
              <p className="opacity-90 leading-relaxed mb-8">{st("surr.findUsDesc", lang)}</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">Urbanización Tancat de L'Alter, Picassent</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+34 000 000 000</span>
                </div>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-8 border-2 border-white px-8 py-3 rounded-full font-body font-semibold text-sm uppercase tracking-wide hover:bg-white hover:text-primary transition-colors"
              >
                {st("surr.viewRoute", lang)}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
