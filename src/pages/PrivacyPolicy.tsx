import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  MessageSquare,
  Cookie,
  Lock,
  Eye,
  FileText,
  Users,
  Clock,
  Scale,
  Database,
  Bell,
  Mail,
  ChevronUp,
  Menu,
  X,
  Home,
  ChevronRight,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LegalFooter } from "@/components/LegalFooter";

// ═══════════════════════════════════════════════════════════════
// TYPES & DATA
// ═══════════════════════════════════════════════════════════════

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const sections: Section[] = [
  { id: "verwerkingsverantwoordelijke", title: "Verwerkingsverantwoordelijke", icon: <Shield className="w-5 h-5" /> },
  { id: "persoonsgegevens", title: "Persoonsgegevens", icon: <Database className="w-5 h-5" /> },
  { id: "doeleinden", title: "Doeleinden verwerking", icon: <FileText className="w-5 h-5" /> },
  { id: "rechtsgronden", title: "Rechtsgronden", icon: <Scale className="w-5 h-5" /> },
  { id: "whatsapp", title: "WhatsApp Business API", icon: <MessageSquare className="w-5 h-5" /> },
  { id: "derden", title: "Delen met derden", icon: <Users className="w-5 h-5" /> },
  { id: "bewaartermijnen", title: "Bewaartermijnen", icon: <Clock className="w-5 h-5" /> },
  { id: "rechten", title: "Uw rechten", icon: <Eye className="w-5 h-5" /> },
  { id: "cookies", title: "Cookies & tracking", icon: <Cookie className="w-5 h-5" /> },
  { id: "beveiliging", title: "Beveiliging", icon: <Lock className="w-5 h-5" /> },
  { id: "wijzigingen", title: "Wijzigingen", icon: <Bell className="w-5 h-5" /> },
  { id: "contact", title: "Contactgegevens", icon: <Mail className="w-5 h-5" /> },
];

const LAST_UPDATED = "20 maart 2025";

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [tocOpen, setTocOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    document.title = "Privacybeleid | Casita Valencia";
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute("content") || "";
    if (metaDesc)
      metaDesc.setAttribute(
        "content",
        "Lees het privacybeleid van Casita Valencia. Informatie over gegevensverwerking, WhatsApp Business API, cookies en uw rechten onder de AVG/GDPR.",
      );
    return () => {
      document.title = "Casa Valencia — Jouw eigen plek in Valencia";
      if (metaDesc) metaDesc.setAttribute("content", originalDesc);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      // Determine active section
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
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setTocOpen(false);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <div className="min-h-screen bg-background" lang="nl">
      {/* Skip to content */}
      <a
        href="#privacy-content"
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
          {/* Breadcrumb */}
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
              <li className="text-foreground font-medium">Privacybeleid</li>
            </ol>
          </nav>

          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary/10 items-center justify-center flex-shrink-0 mt-1">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-foreground leading-tight">Privacybeleid</h1>
              <p className="mt-2 text-muted-foreground">Laatst bijgewerkt: {LAST_UPDATED}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── MAIN CONTENT ─── */}
      <div id="privacy-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex gap-10 lg:gap-14">
          {/* ─── SIDEBAR TOC (desktop) ─── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="sticky top-24" aria-label="Inhoudsopgave">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Inhoudsopgave</p>
              <ul className="space-y-0.5">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <button
                      onClick={() => scrollToSection(s.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2.5 group",
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
            {/* Introductie */}
            <motion.p
              className="text-muted-foreground leading-relaxed mb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              Casita Valencia B.V., hecht grote waarde aan de bescherming van uw persoonsgegevens. In dit privacybeleid
              leggen wij uit welke gegevens wij verzamelen, waarom wij dit doen, hoe wij uw gegevens beschermen en welke
              rechten u heeft. Dit beleid is van toepassing op het gebruik van onze website casitavalencia.nl en alle
              communicatie via WhatsApp, e-mail en ons contactformulier.
            </motion.p>

            {/* ─── SECTIE 1 ─── */}
            <PolicySection
              ref={setSectionRef("verwerkingsverantwoordelijke")}
              id="verwerkingsverantwoordelijke"
              number={1}
              title="Verwerkingsverantwoordelijke"
              icon={sections[0].icon}
            >
              <p>De verantwoordelijke voor de verwerking van uw persoonsgegevens is:</p>
              <div className="bg-muted/50 rounded-xl p-5 mt-4 space-y-1.5 text-sm">
                <p className="font-semibold text-foreground">Casita Valencia B.V.</p>
                <p>[STRAATNAAM EN HUISNUMMER]</p>
                <p>[POSTCODE EN PLAATSNAAM]</p>
                <p>KvK-nummer: [KVK-NUMMER]</p>
                <p>
                  E-mail:{" "}
                  <a href="mailto:privacy@casitavalencia.nl" className="text-primary hover:underline">
                    privacy@casitavalencia.nl
                  </a>
                </p>
              </div>
              <p className="mt-4">
                Voor vragen over dit privacybeleid of de verwerking van uw persoonsgegevens kunt u contact opnemen via
                bovenstaand e-mailadres.
              </p>
            </PolicySection>

            {/* ─── SECTIE 2 ─── */}
            <PolicySection
              ref={setSectionRef("persoonsgegevens")}
              id="persoonsgegevens"
              number={2}
              title="Welke persoonsgegevens worden verzameld"
              icon={sections[1].icon}
            >
              <p>Wij verzamelen de volgende categorieën persoonsgegevens:</p>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Boekingsgegevens</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Voor- en achternaam</li>
                <li>E-mailadres</li>
                <li>Telefoonnummer</li>
                <li>Reisdata (check-in en check-out)</li>
                <li>Aantal gasten</li>
                <li>Gewenste aankomsttijd</li>
                <li>Eventuele opmerkingen of speciale wensen</li>
                <li>Betaalgegevens (verwerkt door onze externe betaalprovider; wij slaan geen betaalgegevens op)</li>
              </ul>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">WhatsApp-communicatie</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Telefoonnummer</li>
                <li>Inhoud van chatberichten</li>
                <li>Tijdstempels van verzonden en ontvangen berichten</li>
                <li>Leesbevestigingen</li>
              </ul>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Websitegebruik</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>IP-adres</li>
                <li>Browsertype en -versie</li>
                <li>Apparaatinformatie (besturingssysteem, schermresolutie)</li>
                <li>Bezochte pagina's en klikgedrag</li>
                <li>Cookies (zie sectie 9)</li>
              </ul>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Contactformulier</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Naam</li>
                <li>Telefoonnummer</li>
                <li>Berichtinhoud</li>
              </ul>
            </PolicySection>

            {/* ─── SECTIE 3 ─── */}
            <PolicySection
              ref={setSectionRef("doeleinden")}
              id="doeleinden"
              number={3}
              title="Doeleinden van de verwerking"
              icon={sections[2].icon}
            >
              <p>Wij verwerken uw persoonsgegevens voor de volgende doeleinden:</p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>
                  <strong>Verwerken en beheren van boekingen</strong> — het bevestigen, wijzigen of annuleren van uw
                  boeking, en het versturen van relevante informatie over uw verblijf.
                </li>
                <li>
                  <strong>Communicatie via WhatsApp Business API</strong> — het verzenden van boekingsbevestigingen,
                  herinneringen, check-in informatie en andere berichten die direct verband houden met uw boeking.
                </li>
                <li>
                  <strong>Beantwoorden van vragen</strong> — het afhandelen van vragen die u stelt via ons
                  contactformulier, e-mail of WhatsApp.
                </li>
                <li>
                  <strong>Verbetering van onze dienstverlening</strong> — het analyseren van websitegebruik om onze
                  website en service te verbeteren.
                </li>
                <li>
                  <strong>Wettelijke verplichtingen</strong> — het voldoen aan belasting- en boekhoudverplichtingen.
                </li>
                <li>
                  <strong>Beveiliging</strong> — het beschermen van onze website tegen misbruik en ongeautoriseerde
                  toegang.
                </li>
              </ul>
            </PolicySection>

            {/* ─── SECTIE 4 ─── */}
            <PolicySection
              ref={setSectionRef("rechtsgronden")}
              id="rechtsgronden"
              number={4}
              title="Rechtsgronden voor verwerking"
              icon={sections[3].icon}
            >
              <p>
                Wij verwerken uw persoonsgegevens op basis van de volgende rechtsgronden uit de Algemene Verordening
                Gegevensbescherming (AVG/GDPR, Artikel 6):
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                        Rechtsgrond
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                        Toepassing
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground align-top">Uitvoering overeenkomst</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Verwerking van boekingen, communicatie over uw verblijf, facturering
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground align-top">Toestemming</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Marketing via WhatsApp, plaatsen van niet-functionele cookies
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground align-top">Gerechtvaardigd belang</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Websitebeveiliging, verbetering van dienstverlening, fraudepreventie
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground align-top">Wettelijke verplichting</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Belastingadministratie, boekhoudkundige bewaarplicht
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4">
                Wanneer de verwerking is gebaseerd op uw toestemming, heeft u te allen tijde het recht om deze
                toestemming in te trekken. Het intrekken van toestemming heeft geen invloed op de rechtmatigheid van de
                verwerking vóór de intrekking.
              </p>
            </PolicySection>

            {/* ─── SECTIE 5 ─── */}
            <PolicySection
              ref={setSectionRef("whatsapp")}
              id="whatsapp"
              number={5}
              title="WhatsApp Business API"
              icon={sections[4].icon}
            >
              <p>
                Casita Valencia maakt gebruik van de <strong>WhatsApp Business API (Cloud API)</strong> van Meta
                Platforms, Inc. voor zakelijke communicatie met gasten. Hieronder vindt u gedetailleerde informatie over
                hoe wij WhatsApp gebruiken en hoe uw gegevens daarbij worden verwerkt.
              </p>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Gebruik van WhatsApp</h3>
              <p>Wij gebruiken WhatsApp uitsluitend voor:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Het verzenden van boekingsbevestigingen</li>
                <li>Het delen van check-in instructies en praktische informatie</li>
                <li>Het beantwoorden van vragen over uw verblijf</li>
                <li>Het versturen van herinneringen gerelateerd aan uw boeking</li>
              </ul>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Gegevensverwerking door Meta</h3>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  Berichten via WhatsApp zijn <strong>end-to-end versleuteld</strong> tijdens transport met het
                  Signal-protocol.
                </li>
                <li>
                  Meta treedt op als <strong>dataverwerker</strong> en gebruikt de inhoud van berichten niet voor
                  advertentiedoeleinden.
                </li>
                <li>
                  Berichten worden na <strong>maximaal 30 dagen automatisch verwijderd</strong> van Meta's servers,
                  tenzij een bericht niet kon worden afgeleverd.
                </li>
                <li>
                  Meta kan metadata verwerken (zoals telefoonnummers en tijdstempels) voor het functioneren van de
                  dienst.
                </li>
              </ul>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Opt-in en opt-out</h3>
              <p>
                U ontvangt alleen WhatsApp-berichten van ons als u hier <strong>expliciet toestemming</strong> voor
                heeft gegeven, bijvoorbeeld door:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  Uw telefoonnummer op te geven bij het boekingsformulier met het verzoek om via WhatsApp te
                  communiceren
                </li>
                <li>Zelf een gesprek te starten via onze WhatsApp Business link</li>
              </ul>
              <p className="mt-3">
                U kunt zich op elk moment <strong>afmelden</strong> voor WhatsApp-berichten door:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>In het WhatsApp-gesprek "STOP" te sturen</li>
                <li>
                  Een e-mail te sturen naar{" "}
                  <a href="mailto:privacy@casitavalencia.nl" className="text-primary hover:underline">
                    privacy@casitavalencia.nl
                  </a>
                </li>
              </ul>

              <div className="bg-muted/50 rounded-xl p-5 mt-6 text-sm">
                <p>
                  Voor meer informatie over hoe Meta/WhatsApp uw gegevens verwerkt, verwijzen wij u naar het{" "}
                  <a
                    href="https://www.whatsapp.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    privacybeleid van WhatsApp
                  </a>
                  .
                </p>
              </div>
            </PolicySection>

            {/* ─── SECTIE 6 ─── */}
            <PolicySection
              ref={setSectionRef("derden")}
              id="derden"
              number={6}
              title="Delen van gegevens met derden"
              icon={sections[5].icon}
            >
              <p>
                Wij delen uw persoonsgegevens uitsluitend met derden wanneer dit noodzakelijk is voor de hierboven
                genoemde doeleinden. Wij verkopen uw gegevens <strong>nooit</strong> aan derden.
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                        Partij
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">Doel</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                        Locatie
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Meta Platforms, Inc.</td>
                      <td className="px-4 py-3 text-muted-foreground">WhatsApp Business API — berichtverwerking</td>
                      <td className="px-4 py-3 text-muted-foreground">VS (EU-US DPF)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">[BETAALPROVIDER]</td>
                      <td className="px-4 py-3 text-muted-foreground">Verwerking van betalingen</td>
                      <td className="px-4 py-3 text-muted-foreground">[LOCATIE]</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">[HOSTINGPROVIDER]</td>
                      <td className="px-4 py-3 text-muted-foreground">Hosting van de website</td>
                      <td className="px-4 py-3 text-muted-foreground">[LOCATIE]</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Doorgifte buiten de EU/EER</h3>
              <p>
                Sommige van onze dienstverleners, waaronder Meta Platforms, Inc. (WhatsApp), zijn gevestigd in de
                Verenigde Staten. Voor de doorgifte van persoonsgegevens naar de VS zijn passende waarborgen getroffen:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  <strong>EU-US Data Privacy Framework (DPF)</strong> — Meta is gecertificeerd onder het DPF, erkend
                  door de Europese Commissie als adequaat beschermingsniveau.
                </li>
                <li>
                  <strong>Standard Contractual Clauses (SCC's)</strong> — waar het DPF niet van toepassing is, maken wij
                  gebruik van door de Europese Commissie goedgekeurde standaardcontractbepalingen.
                </li>
              </ul>
            </PolicySection>

            {/* ─── SECTIE 7 ─── */}
            <PolicySection
              ref={setSectionRef("bewaartermijnen")}
              id="bewaartermijnen"
              number={7}
              title="Bewaartermijnen"
              icon={sections[6].icon}
            >
              <p>
                Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk voor de doeleinden waarvoor zij zijn
                verzameld:
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                        Categorie
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                        Bewaartermijn
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Boekingsgegevens</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        7 jaar na afronden boeking (wettelijke bewaarplicht boekhouding)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">WhatsApp-berichten (Meta-servers)</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Maximaal 30 dagen, daarna automatisch verwijderd
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">WhatsApp-berichten (lokaal)</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Tot 12 maanden na laatste contact, tenzij langer noodzakelijk
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Website-analytics</td>
                      <td className="px-4 py-3 text-muted-foreground">[X maanden]</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Contactformulier</td>
                      <td className="px-4 py-3 text-muted-foreground">Tot afhandeling + 6 maanden</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4">
                Na het verstrijken van de bewaartermijn worden uw gegevens veilig verwijderd of geanonimiseerd.
              </p>
            </PolicySection>

            {/* ─── SECTIE 8 ─── */}
            <PolicySection
              ref={setSectionRef("rechten")}
              id="rechten"
              number={8}
              title="Uw rechten"
              icon={sections[7].icon}
            >
              <p>
                Op grond van de AVG/GDPR (Artikelen 15–22) heeft u de volgende rechten met betrekking tot uw
                persoonsgegevens:
              </p>

              <div className="mt-4 space-y-4">
                <RightItem title="Recht op inzage" desc="U kunt opvragen welke persoonsgegevens wij van u verwerken." />
                <RightItem
                  title="Recht op rectificatie"
                  desc="U kunt verzoeken om onjuiste of onvolledige gegevens te laten corrigeren."
                />
                <RightItem
                  title="Recht op gegevenswissing"
                  desc="U kunt verzoeken om verwijdering van uw persoonsgegevens ('recht op vergetelheid')."
                />
                <RightItem
                  title="Recht op beperking"
                  desc="U kunt verzoeken om beperking van de verwerking van uw gegevens."
                />
                <RightItem
                  title="Recht op overdraagbaarheid"
                  desc="U kunt verzoeken uw gegevens in een gestructureerd, gangbaar formaat te ontvangen."
                />
                <RightItem
                  title="Recht van bezwaar"
                  desc="U kunt bezwaar maken tegen de verwerking van uw gegevens op basis van gerechtvaardigd belang."
                />
                <RightItem
                  title="Recht op intrekking toestemming"
                  desc="Waar verwerking gebaseerd is op toestemming, kunt u deze te allen tijde intrekken."
                />
              </div>

              <h3 className="font-serif text-lg text-foreground mt-8 mb-2">Hoe kunt u uw rechten uitoefenen?</h3>
              <p>U kunt een verzoek indienen door:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  Een e-mail te sturen naar{" "}
                  <a href="mailto:privacy@casitavalencia.nl" className="text-primary hover:underline">
                    privacy@casitavalencia.nl
                  </a>
                </li>
                <li>Het contactformulier op onze website te gebruiken</li>
              </ul>
              <p className="mt-3">
                Wij reageren binnen <strong>30 dagen</strong> op uw verzoek. Om uw identiteit te verifiëren, kunnen wij
                u vragen om een kopie van een geldig identiteitsbewijs mee te sturen (u mag hierbij uw pasfoto en BSN
                onherkenbaar maken).
              </p>

              <h3 className="font-serif text-lg text-foreground mt-8 mb-2">Klacht indienen</h3>
              <p>
                Bent u niet tevreden over hoe wij met uw gegevens omgaan? Dan heeft u het recht een klacht in te dienen
                bij:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  <strong>Autoriteit Persoonsgegevens</strong> (Nederland) —{" "}
                  <a
                    href="https://autoriteitpersoonsgegevens.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    autoriteitpersoonsgegevens.nl
                  </a>
                </li>
                <li>
                  <strong>Agencia Española de Protección de Datos (AEPD)</strong> (Spanje) —{" "}
                  <a
                    href="https://www.aepd.es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    aepd.es
                  </a>
                </li>
              </ul>
            </PolicySection>

            {/* ─── SECTIE 9 ─── */}
            <PolicySection
              ref={setSectionRef("cookies")}
              id="cookies"
              number={9}
              title="Cookies en tracking"
              icon={sections[8].icon}
            >
              <p>
                Onze website maakt gebruik van cookies. Cookies zijn kleine tekstbestanden die op uw apparaat worden
                opgeslagen wanneer u onze website bezoekt.
              </p>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Soorten cookies</h3>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">Doel</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                        Toestemming
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Functioneel</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Noodzakelijk voor werking van de website (sessie, taalvoorkeur)
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">Niet vereist</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Analytisch</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Inzicht in websitegebruik en bezoekersstatistieken
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">Vereist</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Marketing</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Gepersonaliseerde advertenties en social media
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">Vereist</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4">
                <strong>Analytische en marketing-cookies worden pas geplaatst na uw expliciete toestemming</strong> via
                onze cookie-banner.
              </p>

              <h3 className="font-serif text-lg text-foreground mt-6 mb-2">Cookies beheren</h3>
              <p>
                U kunt uw cookievoorkeuren op elk moment wijzigen via de cookie-instellingen op onze website, of via de
                instellingen van uw browser. Het blokkeren van functionele cookies kan de werking van de website
                beïnvloeden.
              </p>
            </PolicySection>

            {/* ─── SECTIE 10 ─── */}
            <PolicySection
              ref={setSectionRef("beveiliging")}
              id="beveiliging"
              number={10}
              title="Beveiliging van gegevens"
              icon={sections[9].icon}
            >
              <p>
                Wij nemen de bescherming van uw gegevens serieus en treffen passende technische en organisatorische
                maatregelen om misbruik, verlies, onbevoegde toegang en ongewenste openbaarmaking te voorkomen:
              </p>

              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>
                  <strong>SSL/TLS-versleuteling</strong> — alle gegevens worden versleuteld verzonden via HTTPS.
                </li>
                <li>
                  <strong>Toegangscontrole</strong> — alleen geautoriseerde medewerkers hebben toegang tot
                  persoonsgegevens, op basis van het need-to-know principe.
                </li>
                <li>
                  <strong>Versleutelde opslag</strong> — gevoelige gegevens worden versleuteld opgeslagen.
                </li>
                <li>
                  <strong>Regelmatige updates</strong> — onze systemen en software worden regelmatig bijgewerkt om
                  beveiligingslekken te voorkomen.
                </li>
                <li>
                  <strong>End-to-end encryptie</strong> — WhatsApp-berichten zijn end-to-end versleuteld via het
                  Signal-protocol.
                </li>
              </ul>
            </PolicySection>

            {/* ─── SECTIE 11 ─── */}
            <PolicySection
              ref={setSectionRef("wijzigingen")}
              id="wijzigingen"
              number={11}
              title="Wijzigingen in dit privacybeleid"
              icon={sections[10].icon}
            >
              <p>
                Wij behouden ons het recht voor om dit privacybeleid te wijzigen. Wijzigingen worden op deze pagina
                gepubliceerd met een bijgewerkte datum bovenaan.
              </p>
              <p className="mt-3">
                Bij belangrijke wijzigingen die van invloed zijn op de manier waarop wij uw gegevens verwerken, stellen
                wij u hiervan op de hoogte via:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Een melding op onze website</li>
                <li>Een bericht via e-mail of WhatsApp (indien u deze communicatiekanalen met ons gebruikt)</li>
              </ul>
              <p className="mt-3">Wij raden u aan dit privacybeleid regelmatig te raadplegen.</p>
              <div className="bg-muted/50 rounded-xl p-5 mt-4 text-sm">
                <p>
                  <strong>Huidige versie:</strong> {LAST_UPDATED}
                </p>
              </div>
            </PolicySection>

            {/* ─── SECTIE 12 ─── */}
            <PolicySection
              ref={setSectionRef("contact")}
              id="contact"
              number={12}
              title="Contactgegevens voor privacyvragen"
              icon={sections[11].icon}
            >
              <p>
                Heeft u vragen, opmerkingen of verzoeken met betrekking tot dit privacybeleid of de verwerking van uw
                persoonsgegevens? Neem dan contact met ons op:
              </p>

              <div className="bg-muted/50 rounded-xl p-5 mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href="mailto:privacy@casitavalencia.nl" className="text-primary hover:underline">
                    privacy@casitavalencia.nl
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    Via ons{" "}
                    <Link to="/#contact" className="text-primary hover:underline">
                      contactformulier
                    </Link>
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
              <h2 className="font-serif text-2xl text-foreground mb-3">Heeft u vragen over uw privacy?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Wij staan voor u klaar. Neem gerust contact met ons op voor vragen over uw persoonsgegevens of dit
                privacybeleid.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:privacy@casitavalencia.nl"
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

import { forwardRef } from "react";

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
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
      },
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

const RightItem = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex gap-3">
    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
    <div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm">{desc}</p>
    </div>
  </div>
);

export default PrivacyPolicy;
