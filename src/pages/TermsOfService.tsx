import { useState, useEffect, useRef, forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  CreditCard,
  CalendarX,
  Home,
  Shield,
  Waves,
  AlertTriangle,
  MessageSquare,
  Scale,
  Clock,
  Pen,
  Users,
  Key,
  DoorOpen,
  Gavel,
  BookOpen,
  Mail,
  Globe,
  ChevronUp,
  Menu,
  X,
  ChevronRight,
  Briefcase,
  Ban,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// TYPES & DATA
// ═══════════════════════════════════════════════════════════════

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const sections: Section[] = [
  { id: "bedrijf", title: "Identificatie bedrijf", icon: <Briefcase className="w-5 h-5" /> },
  { id: "definities", title: "Definities", icon: <BookOpen className="w-5 h-5" /> },
  { id: "toepasselijkheid", title: "Toepasselijkheid", icon: <FileText className="w-5 h-5" /> },
  { id: "boeking", title: "Boeking & overeenkomst", icon: <Pen className="w-5 h-5" /> },
  { id: "prijzen", title: "Prijzen & betaling", icon: <CreditCard className="w-5 h-5" /> },
  { id: "annulering-gast", title: "Annulering door gast", icon: <CalendarX className="w-5 h-5" /> },
  { id: "annulering-cv", title: "Annulering door ons", icon: <Ban className="w-5 h-5" /> },
  { id: "checkin", title: "Check-in & check-out", icon: <DoorOpen className="w-5 h-5" /> },
  { id: "huisregels", title: "Huisregels", icon: <Home className="w-5 h-5" /> },
  { id: "schade", title: "Schade & aansprakelijkheid", icon: <AlertTriangle className="w-5 h-5" /> },
  { id: "zwembad", title: "Zwembad disclaimer", icon: <Waves className="w-5 h-5" /> },
  { id: "overmacht", title: "Overmacht", icon: <Shield className="w-5 h-5" /> },
  { id: "whatsapp", title: "WhatsApp Business", icon: <MessageSquare className="w-5 h-5" /> },
  { id: "eigendom", title: "Intellectueel eigendom", icon: <Key className="w-5 h-5" /> },
  { id: "klachten", title: "Klachtenprocedure", icon: <Users className="w-5 h-5" /> },
  { id: "recht", title: "Toepasselijk recht", icon: <Scale className="w-5 h-5" /> },
  { id: "wijzigingen", title: "Wijzigingen", icon: <Clock className="w-5 h-5" /> },
  { id: "contact", title: "Contactgegevens", icon: <Mail className="w-5 h-5" /> },
];

const LAST_UPDATED = "20 maart 2025";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [tocOpen, setTocOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    document.title = "Algemene Voorwaarden | Casita Valencia";
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute("content") || "";
    if (metaDesc)
      metaDesc.setAttribute(
        "content",
        "Lees de algemene voorwaarden voor het boeken van vakantiewoning Casita Valencia in Torrent, Valencia, Spanje.",
      );
    return () => {
      document.title = "Casa Valencia — Jouw eigen plek in Valencia";
      if (metaDesc) metaDesc.setAttribute("content", originalDesc);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
      const scrollPos = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[sections[i].id];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
    }
    setTocOpen(false);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="min-h-screen bg-background" lang="nl">
      <a
        href="#terms-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Ga naar inhoud
      </a>

      {/* ─── HEADER ─── */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-serif text-lg">Casita Valencia</span>
          </Link>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <motion.div className="bg-muted/40 border-b border-border" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" />
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li className="text-foreground font-medium">Algemene Voorwaarden</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary/10 items-center justify-center flex-shrink-0 mt-1">
              <Gavel className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-foreground leading-tight">Algemene Voorwaarden</h1>
              <p className="mt-2 text-muted-foreground">Laatst bijgewerkt: {LAST_UPDATED}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── MAIN ─── */}
      <div id="terms-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex gap-10 lg:gap-14">
          {/* ─── SIDEBAR TOC ─── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="sticky top-24" aria-label="Inhoudsopgave">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Inhoudsopgave</p>
              <ul className="space-y-0.5">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <button
                      onClick={() => scrollToSection(s.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2.5",
                        activeSection === s.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                      )}
                    >
                      <span className="text-xs font-mono opacity-50 w-5">{i + 1}.</span>
                      <span className="truncate">{s.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* ─── MOBILE TOC ─── */}
          <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="w-full flex items-center justify-between bg-foreground text-background px-4 py-3 rounded-xl shadow-lg active:scale-[0.98] transition-transform"
            >
              <span className="text-sm font-medium">Inhoudsopgave</span>
              {tocOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            {tocOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 bg-background border border-border rounded-xl shadow-xl p-3 max-h-[50vh] overflow-y-auto"
              >
                <ul className="space-y-0.5">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <button
                        onClick={() => scrollToSection(s.id)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2.5",
                          activeSection === s.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground",
                        )}
                      >
                        <span className="text-xs font-mono opacity-50 w-5">{i + 1}.</span>
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* ─── CONTENT ─── */}
          <article className="flex-1 min-w-0 max-w-[720px] pb-24 lg:pb-10">
            <motion.p
              className="text-muted-foreground leading-relaxed mb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              Welkom bij Casita Valencia. Deze Algemene Voorwaarden zijn van toepassing op alle boekingen van onze
              vakantiewoning in Torrent, Valencia, Spanje, via casitavalencia.nl. Lees deze voorwaarden zorgvuldig door
              voordat u een boeking plaatst. Door een boeking te plaatsen, verklaart u akkoord te gaan met deze
              voorwaarden.
            </motion.p>

            {/* ─── 1. BEDRIJF ─── */}
            <PolicySection
              ref={setSectionRef("bedrijf")}
              id="bedrijf"
              number={1}
              title="Identificatie van het bedrijf"
              icon={sections[0].icon}
            >
              <div className="bg-muted/50 rounded-xl p-5 space-y-1.5 text-sm">
                <p className="font-semibold text-foreground">Casita Valencia B.V.</p>
                <p>
                  <Placeholder>STRAATNAAM EN HUISNUMMER</Placeholder>
                </p>
                <p>
                  <Placeholder>POSTCODE</Placeholder> Torrent, Valencia, Spanje
                </p>
                <p>
                  KvK-nummer: <Placeholder>KVK-NUMMER</Placeholder>
                </p>
                <p>
                  Btw-nummer: <Placeholder>BTW-NUMMER</Placeholder>
                </p>
                <p>
                  Registro turístico: <Placeholder>REGISTRO TURÍSTICO NÚMERO</Placeholder>
                </p>
                <p>
                  E-mail:{" "}
                  <a href="mailto:info@casitavalencia.nl" className="text-primary hover:underline">
                    info@casitavalencia.nl
                  </a>
                </p>
                <p>
                  Telefoon: <Placeholder>TELEFOONNUMMER</Placeholder>
                </p>
              </div>
            </PolicySection>

            {/* ─── 2. DEFINITIES ─── */}
            <PolicySection
              ref={setSectionRef("definities")}
              id="definities"
              number={2}
              title="Definities"
              icon={sections[1].icon}
            >
              <ul className="space-y-3">
                <DefItem term='"Casita Valencia" / "wij" / "ons"' desc="De verhuurder, Casita Valencia B.V." />
                <DefItem term='"Gast" / "u"' desc="De persoon die een boeking plaatst via casitavalencia.nl." />
                <DefItem
                  term='"Woning"'
                  desc="De vakantiewoning gelegen te Torrent, Valencia, Spanje, inclusief tuin, zwembad en bijbehorende faciliteiten."
                />
                <DefItem
                  term='"Boeking"'
                  desc="De reservering van de woning voor een bepaalde periode via casitavalencia.nl."
                />
                <DefItem
                  term='"Boekingsbevestiging"'
                  desc="De schriftelijke bevestiging van de reservering per e-mail en/of WhatsApp."
                />
                <DefItem
                  term='"Verblijfsperiode"'
                  desc="De overeengekomen periode van check-in tot en met check-out."
                />
              </ul>
            </PolicySection>

            {/* ─── 3. TOEPASSELIJKHEID ─── */}
            <PolicySection
              ref={setSectionRef("toepasselijkheid")}
              id="toepasselijkheid"
              number={3}
              title="Toepasselijkheid"
              icon={sections[2].icon}
            >
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Deze Algemene Voorwaarden zijn van toepassing op alle boekingen die worden gedaan via
                  casitavalencia.nl en alle daaruit voortvloeiende overeenkomsten.
                </li>
                <li>
                  Door het plaatsen van een boeking verklaart de gast kennis te hebben genomen van en akkoord te gaan
                  met deze voorwaarden.
                </li>
                <li>
                  Casita Valencia behoudt zich het recht voor deze voorwaarden te wijzigen. De versie die geldt op het
                  moment van boeking is bindend voor die boeking.
                </li>
                <li>
                  Eventuele afwijkende voorwaarden van de gast zijn niet van toepassing, tenzij schriftelijk
                  overeengekomen.
                </li>
              </ul>
              <p className="mt-4">
                Voor informatie over hoe wij omgaan met uw persoonsgegevens verwijzen wij naar ons{" "}
                <Link to="/privacy-policy" className="text-primary hover:underline font-medium">
                  Privacybeleid
                </Link>
                .
              </p>
            </PolicySection>

            {/* ─── 4. BOEKING ─── */}
            <PolicySection
              ref={setSectionRef("boeking")}
              id="boeking"
              number={4}
              title="Boeking en totstandkoming overeenkomst"
              icon={sections[3].icon}
            >
              <h3 className="font-serif text-lg text-foreground mt-2 mb-2">Boekingsproces</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>De gast dient een boekingsaanvraag in via het boekingsformulier op casitavalencia.nl.</li>
                <li>
                  Casita Valencia beoordeelt de beschikbaarheid en stuurt een boekingsbevestiging per e-mail en/of
                  WhatsApp.
                </li>
                <li>
                  Na ontvangst van de (aan)betaling door de gast is de boeking definitief en ontstaat een bindende
                  overeenkomst.
                </li>
              </ol>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Voorwaarden</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  De hoofdboeker dient minimaal <strong>18 jaar</strong> oud te zijn.
                </li>
                <li>De hoofdboeker is verantwoordelijk voor het gedrag van alle gasten in het gezelschap.</li>
                <li>
                  Het maximale aantal gasten bedraagt <Placeholder>MAX GASTEN</Placeholder> personen.
                </li>
                <li>De gast is verantwoordelijk voor het verstrekken van correcte persoonsgegevens bij de boeking.</li>
              </ul>
            </PolicySection>

            {/* ─── 5. PRIJZEN ─── */}
            <PolicySection
              ref={setSectionRef("prijzen")}
              id="prijzen"
              number={5}
              title="Prijzen en betaling"
              icon={sections[4].icon}
            >
              <p>
                Alle prijzen op casitavalencia.nl zijn in <strong>euro's</strong> en inclusief btw, tenzij anders
                vermeld.
              </p>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Wat is inbegrepen</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Accommodatie voor de geboekte verblijfsperiode</li>
                <li>Gebruik van alle faciliteiten (zwembad, buitenkeuken, tuin)</li>
                <li>Basisvoorzieningen (beddengoed, handdoeken, toiletartikelen)</li>
                <li>Wi-Fi</li>
              </ul>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Wat is niet inbegrepen</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Schoonmaakkosten: vermeld bij de boeking</li>
                <li>Toeristenbelasting (indien van toepassing door de gemeente Torrent)</li>
                <li>Extra diensten (bijv. luchthaven transfer, boodschappenservice)</li>
              </ul>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Betalingsschema</h3>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                        Betaling
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                        Wanneer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">
                        Aanbetaling: <Placeholder>PERCENTAGE</Placeholder>% van de huursom
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">Bij boeking</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Restant betaling</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Uiterlijk <Placeholder>AANTAL</Placeholder> dagen voor aankomst
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">
                        Borgsom: <Placeholder>BEDRAG</Placeholder> euro
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Voor aankomst; terugstorting binnen <Placeholder>AANTAL</Placeholder> dagen na vertrek
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4">
                Geaccepteerde betaalmethoden: <Placeholder>BETAALMETHODEN</Placeholder> (bijv. bankoverschrijving,
                iDEAL, creditcard).
              </p>
              <HighlightBox>
                Bij niet-tijdige betaling stuurt Casita Valencia een herinnering. Indien de betaling uitblijft na de
                herinnering, wordt de boeking automatisch geannuleerd.
              </HighlightBox>
            </PolicySection>

            {/* ─── 6. ANNULERING GAST ─── */}
            <PolicySection
              ref={setSectionRef("annulering-gast")}
              id="annulering-gast"
              number={6}
              title="Annulering door de gast"
              icon={sections[5].icon}
            >
              <p>
                Annuleringen dienen schriftelijk te worden ingediend per e-mail naar{" "}
                <a href="mailto:info@casitavalencia.nl" className="text-primary hover:underline">
                  info@casitavalencia.nl
                </a>
                . De annuleringsdatum is de datum van ontvangst van de schriftelijke annulering.
              </p>

              <div className="overflow-x-auto mt-6">
                <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                        Moment van annulering
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                        Restitutie
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 text-foreground">
                        Tot <Placeholder>X</Placeholder> dagen voor aankomst
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Volledige restitutie minus <Placeholder>BEDRAG/PERCENTAGE</Placeholder> administratiekosten
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-foreground">
                        Tussen <Placeholder>X</Placeholder> en <Placeholder>Y</Placeholder> dagen voor aankomst
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <Placeholder>PERCENTAGE</Placeholder>% restitutie
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-foreground">
                        Minder dan <Placeholder>Y</Placeholder> dagen voor aankomst
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">Geen restitutie</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-foreground">No-show (zonder annulering)</td>
                      <td className="px-4 py-3 text-muted-foreground">Geen restitutie</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <HighlightBox>
                Wij raden u aan om bij het boeken van uw reis een reisverzekering met annuleringsdekking af te sluiten.
              </HighlightBox>
            </PolicySection>

            {/* ─── 7. ANNULERING CV ─── */}
            <PolicySection
              ref={setSectionRef("annulering-cv")}
              id="annulering-cv"
              number={7}
              title="Annulering of wijziging door Casita Valencia"
              icon={sections[6].icon}
            >
              <p>
                In uitzonderlijke gevallen kan Casita Valencia genoodzaakt zijn een boeking te annuleren of te wijzigen:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>
                  <strong>Overmacht</strong> — situaties buiten onze macht die het verblijf onmogelijk of onveilig maken
                  (zie sectie 12).
                </li>
                <li>
                  <strong>Veiligheidsrisico's</strong> — onvoorziene situaties die de veiligheid van de gast in gevaar
                  brengen (bijv. structurele schade aan de woning).
                </li>
                <li>
                  <strong>Onvoorziene omstandigheden</strong> — andere situaties waardoor de woning niet beschikbaar kan
                  worden gesteld.
                </li>
              </ul>
              <p className="mt-4">
                Bij annulering door Casita Valencia ontvangt de gast een <strong>volledige restitutie</strong> van alle
                reeds betaalde bedragen. Waar mogelijk bieden wij een alternatieve periode of oplossing aan, uitsluitend
                met instemming van de gast.
              </p>
              <p className="mt-3">Bij overmacht kan geen aanspraak worden gemaakt op aanvullende schadevergoeding.</p>
            </PolicySection>

            {/* ─── 8. CHECK-IN ─── */}
            <PolicySection
              ref={setSectionRef("checkin")}
              id="checkin"
              number={8}
              title="Check-in en check-out"
              icon={sections[7].icon}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Check-in</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Vanaf <Placeholder>TIJD</Placeholder> uur
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Check-out</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Uiterlijk <Placeholder>TIJD</Placeholder> uur
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Bij aankomst</h3>
              <p>
                U ontvangt vooraf per e-mail en/of WhatsApp de instructies voor toegang tot de woning. Bij aankomst
                treft u een schone woning aan, voorzien van beddengoed, handdoeken en basisvoorzieningen.
              </p>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Bij vertrek</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>De woning netjes achterlaten</li>
                <li>Afval verwijderen en in de daarvoor bestemde containers plaatsen</li>
                <li>Alle ramen en deuren sluiten en vergrendelen</li>
                <li>Sleutel(s) retourneren volgens de afgesproken procedure</li>
                <li>Eventuele schade melden bij Casita Valencia</li>
              </ul>
            </PolicySection>

            {/* ─── 9. HUISREGELS ─── */}
            <PolicySection
              ref={setSectionRef("huisregels")}
              id="huisregels"
              number={9}
              title="Huisregels"
              icon={sections[8].icon}
            >
              <p>
                Om het verblijf voor iedereen prettig te houden, vragen wij u de volgende huisregels in acht te nemen:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>
                  <strong>Maximaal aantal gasten:</strong> <Placeholder>MAX GASTEN</Placeholder> personen. Meer gasten
                  dan geboekt is niet toegestaan.
                </li>
                <li>
                  <strong>Roken:</strong> <Placeholder>ROKEN TOEGESTAAN / NIET TOEGESTAAN in de woning</Placeholder>.
                  Roken is uitsluitend buiten toegestaan; sigarettenpeuken dienen correct te worden afgevoerd.
                </li>
                <li>
                  <strong>Huisdieren:</strong> <Placeholder>WEL/NIET TOEGESTAAN</Placeholder>. Eventuele aanvullende
                  voorwaarden: <Placeholder>VOORWAARDEN HUISDIEREN</Placeholder>.
                </li>
                <li>
                  <strong>Geluid:</strong> Respecteer de buren. Overmatig lawaai is niet toegestaan, met name tussen
                  23:00 en 08:00 uur. Feesten of evenementen zijn uitsluitend toegestaan na voorafgaande schriftelijke
                  toestemming.
                </li>
                <li>
                  <strong>Zwembad:</strong> Gebruik op eigen risico. Zie sectie 11 voor de volledige zwembad-disclaimer.
                </li>
                <li>
                  <strong>Parkeren:</strong> <Placeholder>PARKEERINFO</Placeholder>.
                </li>
                <li>
                  <strong>Illegale activiteiten:</strong> Het is ten strengste verboden om illegale activiteiten te
                  ontplooien op het terrein.
                </li>
                <li>
                  <strong>Inventaris:</strong> Ga respectvol om met de woning, het meubilair en alle inventaris.
                </li>
              </ul>
            </PolicySection>

            {/* ─── 10. SCHADE ─── */}
            <PolicySection
              ref={setSectionRef("schade")}
              id="schade"
              number={10}
              title="Schade en aansprakelijkheid"
              icon={sections[9].icon}
            >
              <h3 className="font-serif text-lg text-foreground mb-2">Aansprakelijkheid van de gast</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  De gast is aansprakelijk voor alle schade aan de woning, inventaris, tuin en zwembad veroorzaakt door
                  de gast of diens gezelschap tijdens de verblijfsperiode.
                </li>
                <li>
                  Schade dient <strong>onmiddellijk</strong> te worden gemeld bij Casita Valencia.
                </li>
                <li>
                  Kosten voor schade worden verrekend met de borgsom. Bij hogere kosten dan de borgsom wordt de gast
                  apart aangesproken voor het resterende bedrag.
                </li>
              </ul>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Aansprakelijkheid van Casita Valencia</h3>
              <p>
                Casita Valencia is <strong>niet</strong> aansprakelijk voor:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Persoonlijk letsel, diefstal of verlies van eigendommen van de gast</li>
                <li>
                  Technische storingen (internet, elektriciteit, watervoorziening) die buiten de invloedssfeer van
                  Casita Valencia vallen
                </li>
                <li>Overlast door derden (buren, bouwwerkzaamheden, evenementen in de omgeving)</li>
              </ul>
              <p className="mt-4">
                De aansprakelijkheid van Casita Valencia is in alle gevallen beperkt tot het bedrag van de huursom voor
                de betreffende boeking.
              </p>
              <HighlightBox>
                Wij raden u aan een reis- en aansprakelijkheidsverzekering af te sluiten die schade, letsel en diefstal
                tijdens uw verblijf dekt.
              </HighlightBox>
            </PolicySection>

            {/* ─── 11. ZWEMBAD ─── */}
            <PolicySection
              ref={setSectionRef("zwembad")}
              id="zwembad"
              number={11}
              title="Zwembad disclaimer"
              icon={sections[10].icon}
            >
              <HighlightBox variant="warning">
                <strong>Belangrijk:</strong> De woning beschikt over een privézwembad. Het gebruik hiervan is geheel op
                eigen risico van de gast.
              </HighlightBox>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>
                  Kinderen dienen <strong>te allen tijde</strong> onder begeleiding van een volwassene te zwemmen.
                </li>
                <li>
                  <strong>Duiken</strong> in het zwembad is niet toegestaan.
                </li>
                <li>
                  <strong>Glazen voorwerpen</strong> zijn niet toegestaan in en rond het zwembad.
                </li>
                <li>
                  Casita Valencia is <strong>niet aansprakelijk</strong> voor ongevallen, letsel of verdrinking.
                </li>
                <li>
                  De gast is verantwoordelijk voor het toezicht op alle leden van het gezelschap bij het gebruik van het
                  zwembad.
                </li>
              </ul>
            </PolicySection>

            {/* ─── 12. OVERMACHT ─── */}
            <PolicySection
              ref={setSectionRef("overmacht")}
              id="overmacht"
              number={12}
              title="Overmacht (Force Majeure)"
              icon={sections[11].icon}
            >
              <p>
                Onder overmacht wordt verstaan: omstandigheden die de nakoming van de overeenkomst verhinderen en die
                niet aan Casita Valencia of de gast zijn toe te rekenen. Hieronder vallen onder meer:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-4">
                <li>Natuurrampen (aardbevingen, overstromingen, bosbranden)</li>
                <li>Epidemieën of pandemieën</li>
                <li>Oorlog of terrorisme</li>
                <li>Overheidsmaatregelen (reisbeperkingen, lockdowns)</li>
                <li>Stakingen</li>
                <li>Extreme weersomstandigheden</li>
              </ul>
              <p className="mt-4">
                Bij overmacht worden de verplichtingen van beide partijen opgeschort voor de duur van de overmacht.
                Indien de overmachtsituatie langer duurt dan <Placeholder>AANTAL</Placeholder> dagen, hebben beide
                partijen het recht de overeenkomst te ontbinden zonder aanvullende schadevergoeding.
              </p>
            </PolicySection>

            {/* ─── 13. WHATSAPP ─── */}
            <PolicySection
              ref={setSectionRef("whatsapp")}
              id="whatsapp"
              number={13}
              title="Communicatie via WhatsApp Business"
              icon={sections[12].icon}
            >
              <p>
                Casita Valencia maakt gebruik van de <strong>WhatsApp Business API</strong> voor communicatie met gasten
                over boekingen.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>
                  WhatsApp wordt gebruikt voor: boekingsbevestigingen, check-in informatie, herinneringen en het
                  beantwoorden van vragen.
                </li>
                <li>
                  Door een boeking te plaatsen en een telefoonnummer op te geven, stemt de gast in met het ontvangen van
                  WhatsApp-berichten die direct gerelateerd zijn aan de boeking (<strong>opt-in</strong>).
                </li>
                <li>
                  U kunt zich op elk moment afmelden voor WhatsApp-berichten door in het gesprek <strong>"STOP"</strong>{" "}
                  te sturen.
                </li>
                <li>WhatsApp-berichten zijn aanvullend op en geen vervanging van officiële e-mailcommunicatie.</li>
              </ul>
              <p className="mt-4">
                Voor informatie over hoe wij uw persoonsgegevens verwerken via WhatsApp, verwijzen wij naar ons{" "}
                <Link to="/privacy-policy" className="text-primary hover:underline font-medium">
                  Privacybeleid
                </Link>
                .
              </p>
              <div className="bg-muted/50 rounded-xl p-5 mt-4 text-sm space-y-1">
                <p>
                  <a
                    href="https://www.whatsapp.com/legal/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    WhatsApp gebruiksvoorwaarden →
                  </a>
                </p>
                <p>
                  <a
                    href="https://business.whatsapp.com/policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    WhatsApp Business beleid →
                  </a>
                </p>
              </div>
            </PolicySection>

            {/* ─── 14. EIGENDOM ─── */}
            <PolicySection
              ref={setSectionRef("eigendom")}
              id="eigendom"
              number={14}
              title="Intellectueel eigendom"
              icon={sections[13].icon}
            >
              <p>
                Alle content op casitavalencia.nl — waaronder teksten, foto's, afbeeldingen, logo's, iconen en het
                ontwerp van de website — is eigendom van Casita Valencia B.V. of wordt gebruikt met toestemming van de
                rechthebbende.
              </p>
              <p className="mt-3">
                Niets van deze website mag worden verveelvoudigd, opgeslagen in een geautomatiseerd gegevensbestand of
                openbaar gemaakt zonder voorafgaande schriftelijke toestemming van Casita Valencia.
              </p>
            </PolicySection>

            {/* ─── 15. KLACHTEN ─── */}
            <PolicySection
              ref={setSectionRef("klachten")}
              id="klachten"
              number={15}
              title="Klachtenprocedure"
              icon={sections[14].icon}
            >
              <h3 className="font-serif text-lg text-foreground mb-2">Tijdens het verblijf</h3>
              <p>
                Mocht u tijdens uw verblijf een klacht hebben, neem dan zo snel mogelijk contact met ons op zodat wij
                kunnen proberen het probleem ter plekke op te lossen.
              </p>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Na het verblijf</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Klachten dienen schriftelijk per e-mail te worden ingediend binnen <Placeholder>AANTAL</Placeholder>{" "}
                  dagen na vertrek.
                </li>
                <li>
                  Casita Valencia streeft ernaar klachten binnen <Placeholder>AANTAL</Placeholder> werkdagen te
                  beantwoorden.
                </li>
              </ul>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Externe geschillenbeslechting</h3>
              <p>Indien wij er samen niet uitkomen, kunt u gebruik maken van:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Europees ODR-platform</strong> (Online Dispute Resolution):{" "}
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    ec.europa.eu/consumers/odr
                  </a>
                </li>
                <li>
                  <strong>Europees Consumenten Centrum (ECC)</strong> voor grensoverschrijdende geschillen binnen de EU
                </li>
              </ul>
            </PolicySection>

            {/* ─── 16. RECHT ─── */}
            <PolicySection
              ref={setSectionRef("recht")}
              id="recht"
              number={16}
              title="Toepasselijk recht en geschillen"
              icon={sections[15].icon}
            >
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Op deze overeenkomst en deze Algemene Voorwaarden is <strong>Spaans recht</strong> van toepassing,
                  aangezien de woning zich in Spanje bevindt.
                </li>
                <li>
                  Conform de EU-verordening Rome I kan de gast als consument ook een beroep doen op het{" "}
                  <strong>consumentenrecht van zijn of haar thuisland</strong>, indien dat gunstiger is.
                </li>
                <li>Geschillen worden bij voorkeur in onderling overleg opgelost.</li>
                <li>
                  Indien noodzakelijk is de bevoegde rechtbank te <strong>Valencia, Spanje</strong> bevoegd, tenzij
                  dwingend consumentenrecht anders voorschrijft.
                </li>
              </ul>
            </PolicySection>

            {/* ─── 17. WIJZIGINGEN ─── */}
            <PolicySection
              ref={setSectionRef("wijzigingen")}
              id="wijzigingen"
              number={17}
              title="Wijzigingen in deze voorwaarden"
              icon={sections[16].icon}
            >
              <ul className="list-disc pl-5 space-y-2">
                <li>Casita Valencia behoudt zich het recht voor deze Algemene Voorwaarden te wijzigen.</li>
                <li>De datum van de laatste wijziging wordt bovenaan deze pagina vermeld.</li>
                <li>
                  Bij wezenlijke wijzigingen worden gasten met een lopende boeking hiervan per e-mail op de hoogte
                  gesteld.
                </li>
                <li>
                  De versie van de voorwaarden die gold op het moment van boeking blijft van toepassing op die boeking.
                </li>
              </ul>
              <div className="bg-muted/50 rounded-xl p-5 mt-4 text-sm">
                <p>
                  <strong>Huidige versie:</strong> {LAST_UPDATED}
                </p>
              </div>
            </PolicySection>

            {/* ─── 18. CONTACT ─── */}
            <PolicySection
              ref={setSectionRef("contact")}
              id="contact"
              number={18}
              title="Contactgegevens"
              icon={sections[17].icon}
            >
              <p>Heeft u vragen over deze Algemene Voorwaarden? Neem contact met ons op:</p>
              <div className="bg-muted/50 rounded-xl p-5 mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href="mailto:info@casitavalencia.nl" className="text-primary hover:underline">
                    info@casitavalencia.nl
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    <Placeholder>TELEFOONNUMMER</Placeholder>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    WhatsApp: <Placeholder>WHATSAPP NUMMER</Placeholder>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href="https://casitavalencia.nl" className="text-primary hover:underline">
                    casitavalencia.nl
                  </a>
                </div>
              </div>
            </PolicySection>

            {/* ─── CTA BLOK ─── */}
            <motion.div
              className="mt-16 bg-primary/5 border border-primary/15 rounded-2xl p-8 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <h2 className="font-serif text-2xl text-foreground mb-3">Heeft u vragen over onze voorwaarden?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Wij helpen u graag. Neem gerust contact met ons op voor vragen over uw boeking of deze voorwaarden.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:info@casitavalencia.nl"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors active:scale-[0.97]"
                >
                  <Mail className="w-4 h-4" />
                  E-mail ons
                </a>
                <Link
                  to="/#contact"
                  className="inline-flex items-center justify-center gap-2 bg-background border border-border text-foreground px-6 py-3 rounded-xl font-medium hover:bg-muted/60 transition-colors active:scale-[0.97]"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contactformulier
                </Link>
              </div>
            </motion.div>
          </article>
        </div>
      </div>

      <LegalFooter />

      {/* ─── BACK TO TOP ─── */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-20 lg:bottom-6 right-4 z-30 w-10 h-10 bg-foreground text-background rounded-full shadow-lg flex items-center justify-center hover:bg-foreground/90 transition-colors active:scale-[0.95]"
          aria-label="Terug naar boven"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

interface PolicySectionProps {
  id: string;
  number: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const PolicySection = forwardRef<HTMLElement, PolicySectionProps>(({ id, number, title, icon, children }, ref) => (
  <motion.section
    ref={ref}
    id={id}
    className="mb-14 scroll-mt-28"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    variants={{
      hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
    }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
        {icon}
      </div>
      <h2 className="font-serif text-xl md:text-2xl text-foreground leading-tight">
        <span className="text-primary/60 mr-1.5">{number}.</span>
        {title}
      </h2>
    </div>
    <div className="text-muted-foreground leading-relaxed [&_strong]:text-foreground [&_a]:transition-colors">
      {children}
    </div>
  </motion.section>
));
PolicySection.displayName = "PolicySection";

const DefItem = ({ term, desc }: { term: string; desc: string }) => (
  <li className="flex gap-3">
    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
    <div>
      <p className="font-semibold text-foreground">{term}</p>
      <p className="text-sm">{desc}</p>
    </div>
  </li>
);

const Placeholder = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-yellow-200/80 text-yellow-900 px-1.5 py-0.5 rounded text-sm font-mono">[{children}]</span>
);

const HighlightBox = ({ children, variant = "info" }: { children: React.ReactNode; variant?: "info" | "warning" }) => (
  <div
    className={cn(
      "rounded-xl p-5 mt-6 text-sm border",
      variant === "warning"
        ? "bg-destructive/5 border-destructive/20 text-foreground"
        : "bg-primary/5 border-primary/15 text-foreground",
    )}
  >
    {children}
  </div>
);

export default TermsOfService;
