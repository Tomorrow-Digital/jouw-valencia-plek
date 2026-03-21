import { useState } from "react";
import { Navbar } from "@/components/redesign/Navbar";
import { Footer } from "@/components/redesign/Footer";
import { type SiteLang, detectSiteLang, st } from "@/lib/site-i18n";
import { MapPin, UtensilsCrossed, Waves } from "lucide-react";

const HERO_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuD-02HO-ZlkJALVjmiNf1wshldT2OGK1RCu6uc6E1-LYiXDp68IjdB1xhiVD8EUEpS9ZcaADl2bcujZimaJtP3CkVVVUhAzQuCDOa-Tp_HBuBQN8gjZ9Z0z92Cc5x2hOzAjtyq0lzAkwA9DrFvWdxJgzohp6ffXCwvT3-qRct1qUXb4Gh-ymL-hrTJbsoeX6LGfWh7fqNka2F3TsOOU9ipgyN9loFozia5Pd2tJ4tgsQdFM7lpxQDRETcgpk1EOoKu0EC3U99IlZ0FF";
const ROOM_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuALT6D-di643WxcQt_QlwcY2NZPoURBc2eFdbbdpM5yWtDYU0_94xRW32anHU1IAaAmoKpJ3GnjMkzRKrYdvcwJqvptsIEUUYzseIxtld5C0jqftWy7vAyiHh-2u554hL59pg97wNmiZ1G8oWiMCsB2Ks938ZSN14y4I3FIdep_ImK4JPb1W1j6k5bo2Monvu0-i0NTxQlavoOR6pgEtamSpEc_SgcNvs9Res1441apqU5rYDIfH1HolkmvIeY7QAIcUJYidfLuhAW5";
const BATH_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBHjTjWnBK2MkDN-0AlB9UNBScz_p7OE-Ru_SvOQIaCntR119H93hO-SnfrQPeGJj8bdczCRXE8OqtIMvXbq124_yuqp9jwEnpvPZqwUGzNyq1boqGN7ulH1kQVHmW5dSn0zLgF9h8NXGQgG616k9lTdf2Z0y4G2eOZ3jRfh1nu64acNurDYE0KAvFaQNtXh1GhQkbkPtHmCrFY2iA52S36zHn1z0EuFSAidrrOE4Z1bmCjO6CaDzkS8lk1BAhIGSh55jerFKs8Keyw";
const OUTDOOR_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCvJx7ss4yH0KNB-2lDQd2DxTmM7jTxyG1MoyDBcvn5j-3X7mnqVbioh_u05arSDBa03Fp0hpStmcgdesHE3bHvp0KKbISVs-dIpnk40PCAZiL-84Ed_cErduilxGFpzPGCrIoVAIGGv3rHt_crfRp7JxO8fmH2FX53Jp3Csh3sHJcNQqZjBSSg7Onv44Z4NJzdO4uz_HkPOmxehmVpa1cWAuXfa3qnSnbI8UGJv_kkgPI1sTJeWL-KC0zkj7ERL17y3JxtAhJJh_U3";

export default function HomePage() {
  const [lang, setLang] = useState<SiteLang>(detectSiteLang);

  return (
    <div className="bg-surface text-foreground font-body">
      <Navbar lang={lang} onLangChange={setLang} />

      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Swimming pool at Casita Valencia" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/20" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tight leading-tight">
            {st("hero.line1", lang)} <br />
            <span className="italic">{st("hero.line2", lang)}</span>
          </h1>
          <div className="mt-12 bg-surface/90 backdrop-blur-md p-2 md:p-3 rounded-full inline-flex flex-wrap md:flex-nowrap items-center gap-2 shadow-2xl">
            <div className="flex items-center gap-3 px-6 py-3 border-r border-outline-variant/30">
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">{st("hero.arrival", lang)}</p>
                <p className="text-sm font-medium">{st("hero.chooseDate", lang)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 border-r border-outline-variant/30">
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">{st("hero.guests", lang)}</p>
                <p className="text-sm font-medium">{st("hero.guestsDefault", lang)}</p>
              </div>
            </div>
            <button className="bg-primary-container text-white px-8 py-4 rounded-full font-body font-bold text-sm tracking-widest uppercase hover:bg-primary transition-colors">
              {st("hero.cta", lang)}
            </button>
          </div>
        </div>
      </section>

      {/* De Ruimte */}
      <section className="py-24 px-8 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <span className="text-primary font-body font-bold tracking-[0.3em] uppercase text-xs mb-4 block">{st("space.label", lang)}</span>
            <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl leading-tight">{st("space.title", lang)}</h2>
          </div>
          <p className="text-on-surface-variant max-w-md text-lg leading-relaxed">
            {st("space.description", lang)}
          </p>
        </div>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7 aspect-[4/5] md:aspect-video relative rounded-xl overflow-hidden group">
            <img src={ROOM_IMG} alt="De Kamer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="font-headline text-3xl mb-1">{st("space.room", lang)}</h3>
              <p className="text-sm opacity-90 font-light tracking-wide">{st("space.roomSub", lang)}</p>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
            <div className="aspect-square relative rounded-xl overflow-hidden group">
              <img src={BATH_IMG} alt="De Badkamer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-headline text-2xl mb-1">{st("space.bathroom", lang)}</h3>
                <p className="text-xs opacity-90 uppercase tracking-widest">{st("space.bathroomSub", lang)}</p>
              </div>
            </div>
            <div className="aspect-video relative rounded-xl overflow-hidden group">
              <img src={OUTDOOR_IMG} alt="Het Buitenleven" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-headline text-2xl mb-1">{st("space.outdoor", lang)}</h3>
                <p className="text-xs opacity-90 uppercase tracking-widest">{st("space.outdoorSub", lang)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ontdek Valencia */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-screen-xl mx-auto px-8 text-center mb-16">
          <h2 className="font-headline text-4xl md:text-5xl mb-4">{st("discover.title", lang)}</h2>
        </div>
        <div className="max-w-screen-xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: MapPin, title: st("discover.center", lang), desc: st("discover.centerDesc", lang) },
            { icon: Waves, title: st("discover.beach", lang), desc: st("discover.beachDesc", lang) },
            { icon: UtensilsCrossed, title: st("discover.tips", lang), desc: st("discover.tipsDesc", lang) },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-headline text-xl mb-3">{item.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-8">
        <div className="max-w-screen-xl mx-auto bg-primary/5 rounded-2xl p-12 md:p-16 relative">
          <span className="text-primary font-body font-bold tracking-[0.3em] uppercase text-xs mb-6 block">{st("testimonial.label", lang)}</span>
          <blockquote className="font-headline text-2xl md:text-3xl leading-relaxed mb-8 max-w-3xl">
            {st("testimonial.quote", lang)}
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">S&M</span>
            </div>
            <div>
              <p className="font-semibold">{st("testimonial.author", lang)}</p>
              <p className="text-sm text-on-surface-variant">{st("testimonial.origin", lang)}</p>
            </div>
          </div>
          <div className="absolute top-8 right-12 text-primary/10 text-[120px] font-serif leading-none">"</div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 px-8 bg-surface-container-low">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="font-headline text-4xl mb-12">{st("faq.title", lang)}</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {["parking", "center", "children"].map((key) => (
              <details key={key} className="bg-white rounded-xl p-6 group">
                <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                  {st(`faq.${key}.q`, lang)}
                  <span className="text-primary transition-transform group-open:rotate-45 text-xl">+</span>
                </summary>
                <p className="mt-4 text-on-surface-variant text-sm leading-relaxed">{st(`faq.${key}.a`, lang)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
