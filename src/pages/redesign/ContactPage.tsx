import { useState } from "react";
import { Navbar } from "@/components/redesign/Navbar";
import { Footer } from "@/components/redesign/Footer";
import { type SiteLang, detectSiteLang, st } from "@/lib/site-i18n";
import { Clock, Ban, PartyPopper, PawPrint, ChevronRight } from "lucide-react";

const HERO_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDBaPVLrJgO1c9FsbILwfgB-WqaTJP6s_lxX72YNyNvkQvTWgKmW76_ImOCBNTvLKLzZrxF8rVzW121GJGWUN63v-VdY95lomzTdnbJgpso71RtilTPHOhqAnaKuCDkkYRyiZVrsj7Ou9ZtCfclCCeEfeq-Z6EVIwDIMaqwQEoLWDa5Th4gbx63zoZlw8zjMVtwT2hsLLyExh-mwppnWgka-I8_MCJMjVcKCOO7WTSkjMhaaa1-JGkoIPONAu4GTe6oWYv_kYOuI3Ys";
const HOST_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuB7-BNqsd_AqCx8ESuvy6NE-dkdQ2D-7zdRK6DamA0Nz1UfyqdE4WJXZGRa1UEEArpKnuUmwMYsVYJYoC8HHoTFa1hQqoFJWZnnn2K1O9dPVULN-gKod16RIHsQ8CdTclZB1pDVVd0EukONuMWTZ7Ocno0Vn4yc8OZrgdK0sR52FjVMguY3c7Jgur5fOUylXUbjqTzyZ9d-7aqNYdZ1DxM8l3fQ0WKzufkKekLuwpYg5cLpHaDOOgIspvCnbQEz0umzNc63wvMTafDl";

const rules = [
  { icon: Clock, titleKey: "contact.checkTimes", descKey: "contact.checkTimesDesc" },
  { icon: Ban, titleKey: "contact.noSmoking", descKey: "contact.noSmokingDesc" },
  { icon: PartyPopper, titleKey: "contact.noParties", descKey: "contact.noPartiesDesc" },
  { icon: PawPrint, titleKey: "contact.pets", descKey: "contact.petsDesc" },
];

const faqKeys = ["faq1", "faq2", "faq3", "faq4"] as const;

export default function ContactPage() {
  const [lang, setLang] = useState<SiteLang>(detectSiteLang);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-surface text-foreground font-body">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="pt-32 pb-24">
        {/* Hero */}
        <section className="px-8 max-w-screen-xl mx-auto mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-primary font-medium tracking-widest uppercase text-xs mb-4 block">{st("contact.label", lang)}</span>
              <h1 className="text-5xl md:text-7xl font-headline leading-tight mb-8">
                {st("contact.title1", lang)} <span className="italic">{st("contact.title2", lang)}</span>
              </h1>
              <div className="flex items-start gap-6 bg-surface-container-low p-8 rounded-xl max-w-2xl">
                <img src={HOST_IMG} alt="Charmaine" className="w-20 h-20 rounded-full object-cover shadow-sm" />
                <div>
                  <h3 className="font-headline text-xl mb-2">{st("contact.hostTitle", lang)}</h3>
                  <p className="text-on-surface-variant leading-relaxed text-sm">{st("contact.hostMsg", lang)}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl rotate-2">
                <img src={HERO_IMG} alt="Mediterranean villa" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-container/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </section>

        {/* Form + Rules */}
        <section className="px-8 max-w-screen-xl mx-auto mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white p-10 rounded-xl shadow-sm border border-outline-variant/10">
              <h2 className="font-headline text-3xl mb-8">{st("contact.formTitle", lang)}</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("contact.name", lang)}</label>
                    <input className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("contact.email", lang)}</label>
                    <input type="email" className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("contact.subject", lang)}</label>
                  <input className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">{st("contact.message", lang)}</label>
                  <textarea className="w-full bg-transparent border-b border-outline-variant/30 focus:border-secondary focus:ring-0 px-0 py-2 transition-colors outline-none resize-none" rows={4} />
                </div>
                <button type="submit" className="bg-primary text-white px-10 py-4 rounded-xl font-headline tracking-wide hover:translate-y-[-2px] transition-all duration-300 shadow-lg shadow-primary/10">
                  {st("contact.send", lang)}
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 bg-surface-container-low p-10 rounded-xl">
              <h2 className="font-headline text-3xl mb-8">{st("contact.rulesTitle", lang)}</h2>
              <div className="space-y-8">
                {rules.map((r) => (
                  <div key={r.titleKey} className="flex items-center gap-4">
                    <r.icon className="w-7 h-7 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">{st(r.titleKey, lang)}</p>
                      <p className="text-sm text-on-surface-variant">{st(r.descKey, lang)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-surface-container-high/50 rounded-lg text-xs text-on-surface-variant leading-relaxed">
                {st("contact.rulesNote", lang)}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-8 max-w-screen-xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl mb-2">{st("contact.faqTitle", lang)}</h2>
            <p className="text-on-surface-variant">{st("contact.faqSub", lang)}</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqKeys.map((key, i) => (
              <div key={key} className="bg-surface-container-low rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left font-medium"
                >
                  <span>{st(`contact.${key}q`, lang)}</span>
                  <ChevronRight className={`w-5 h-5 text-primary transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-sm text-on-surface-variant leading-relaxed">
                    {st(`contact.${key}a`, lang)}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-on-surface-variant text-sm mb-2">{st("contact.moreQ", lang)}</p>
            <a href="mailto:info@casitavalencia.com" className="text-primary font-semibold hover:underline">{st("contact.emailUs", lang)}</a>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
