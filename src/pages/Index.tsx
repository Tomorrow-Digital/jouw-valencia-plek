import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isSameDay, isWithinInterval, isBefore, isAfter, differenceInCalendarDays,
  parseISO, startOfDay, addDays
} from "date-fns";
import { nl, enUS } from "date-fns/locale";
import {
  Bath, ChefHat, Snowflake, Wifi, Bed, DoorOpen, Car, WashingMachine,
  Shirt, Wind, TreePalm, BookOpen, Menu, X, ChevronLeft, ChevronRight,
  Star, Mail, Phone, Instagram, MessageCircle, Clock, BanIcon, PartyPopper,
  Moon, PawPrint, Globe, MapPin, ShoppingBag, Waves
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Fallback images
import heroImgFallback from "@/assets/hero.jpg";
import roomImgFallback from "@/assets/room.jpg";
import bathroomImgFallback from "@/assets/bathroom.jpg";
import kitchenImgFallback from "@/assets/kitchen.jpg";
import hostImgFallback from "@/assets/host.jpg";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface PricingConfig {
  defaultPricePerNight: number;
  cleaningFee: number;
  minimumStay: number;
  maximumStay: number;
  seasonalPricing: { label: string; labelEn: string; startDate: string; endDate: string; pricePerNight: number }[];
  customPricing: { startDate: string; endDate: string; pricePerNight: number; label: string }[];
  blockedDates: { startDate: string; endDate: string; reason: string }[];
  discounts: { weeklyDiscount: number; monthlyDiscount: number };
}

// ═══════════════════════════════════════════════════════════════
// STATIC CONFIG — Reviews & translations (not in DB)
// ═══════════════════════════════════════════════════════════════

const REVIEWS = [
  { name: "Sophie", country: "🇳🇱", date: "2025-09", rating: 5, nl: "Wat een heerlijke plek! De buitenkeuken is fantastisch en de kamer is prachtig ingericht. We komen zeker terug.", en: "What a wonderful place! The outdoor kitchen is fantastic and the room is beautifully decorated. We'll definitely be back." },
  { name: "Thomas", country: "🇧🇪", date: "2025-08", rating: 5, nl: "Rustig, authentiek en precies wat we zochten. De host denkt echt aan alles. Perfecte uitvalsbasis voor Valencia.", en: "Quiet, authentic and exactly what we were looking for. The host really thinks of everything. Perfect base for Valencia." },
  { name: "Laura & Marc", country: "🇩🇪", date: "2025-07", rating: 4, nl: "Geweldige ervaring! De locatie is rustig maar goed bereikbaar. De buitenkeuken 's avonds gebruiken is magisch.", en: "Great experience! The location is quiet but easily accessible. Using the outdoor kitchen in the evening is magical." },
  { name: "Emma", country: "🇬🇧", date: "2025-10", rating: 5, nl: "Absoluut de mooiste plek waar we ooit gelogeerd hebben. Persoonlijk, warm en met zoveel aandacht voor detail.", en: "Absolutely the most beautiful place we've ever stayed. Personal, warm and with so much attention to detail." },
];

const getTranslations = (minimumStay: number) => ({
  nl: {
    nav: { space: "De Ruimte", amenities: "Voorzieningen", location: "Omgeving", pricing: "Prijzen & Boeken", reviews: "Reviews", contact: "Contact" },
    hero: { headline1: "Tapas in de stad.", headline2: "Relaxen aan het zwembad.", subtitle: "Eigen guesthouse met tuin en zwembad, een kwartiertje van Valencia.", cta: "Bekijk beschikbaarheid" },
    space: {
      title: "De Ruimte",
      room: { title: "De Kamer", desc: "Een rustige, lichte slaapkamer met comfortabel tweepersoonsbed, airconditioning en authentieke Spaanse sfeer." },
      bathroom: { title: "De Badkamer", desc: "Eigen badkamer met inloopdouche, verse handdoeken en alles wat je nodig hebt." },
      kitchen: { title: "De Buitenkeuken", desc: "Jouw eigen buitenkeuken met gasfornuis, koelkast en gootsteen onder een overdekt terras." },
      vibe: "Dit is geen hotel, geen Airbnb-fabriek. Dit is een plek met ziel — waar je 's ochtends wakker wordt met zonlicht door de luiken, koffie zet in je eigen keuken en de dag begint op jouw tempo.",
    },
    amenities: {
      title: "Voorzieningen",
      items: ["Privé badkamer", "Buitenkeuken met gasfornuis, koelkast, gootsteen", "Airconditioning", "Gratis WiFi", "Verse handdoeken & beddengoed", "Eigen ingang", "Parkeerplaats op het terrein", "Wasmachine (gedeeld)", "Strijkijzer", "Haardroger", "Buitenterras met tuinmeubelen", "Lokale tips & huisgids"],
    },
    location: {
      title: "De Omgeving",
      valencia: { title: "Valencia centrum", detail: "25 min met de auto · 35 min met metro" },
      beach: { title: "Strand", detail: "30 min met de auto · Malvarrosa & El Saler" },
      shops: { title: "Supermarkt & restaurants", detail: "5 min lopen" },
      desc: "Gelegen in Torrent, een authentiek Spaans dorp net buiten Valencia. Hier geen toeristenmassa's, maar échte bakkers, markten op zaterdag en buurvrouwen die 's avonds op hun terras zitten. Het echte Spanje.",
    },
    pricing: {
      title: "Prijzen & Beschikbaarheid",
      nights: "nachten",
      night: "nacht",
      perNight: "per nacht",
      subtotal: "Subtotaal",
      cleaningFee: "Schoonmaakkosten",
      discount: "korting",
      total: "Totaal",
      selectDates: "Selecteer je data",
      selectCheckIn: "Kies een incheckdatum",
      selectCheckOut: "Kies een uitcheckdatum",
      minStayWarning: `Minimaal verblijf is ${minimumStay} nachten`,
      season: "Seizoen",
      period: "Periode",
      pricePerNight: "Prijs per nacht",
      pricingOverview: "Prijsoverzicht",
    },
    booking: {
      title: "Boekingsverzoek",
      firstName: "Voornaam",
      lastName: "Achternaam",
      email: "E-mailadres",
      phone: "Telefoonnummer",
      guests: "Aantal gasten",
      arrival: "Geschatte aankomsttijd",
      message: "Bericht (optioneel)",
      submit: "Boekingsverzoek versturen",
      success: "Bedankt! We bevestigen je boeking binnen 24 uur.",
      required: "Dit veld is verplicht",
      invalidEmail: "Ongeldig e-mailadres",
      invalidPhone: "Ongeldig telefoonnummer",
    },
    reviews: { title: "Wat onze gasten zeggen", note: "Ook te vinden op Airbnb en Google" },
    faq: {
      title: "Veelgestelde Vragen",
      items: [
        { q: "Hoe laat kan ik inchecken / uitchecken?", a: "Inchecken kan vanaf 15:00 tot 20:00. Uitchecken vóór 11:00. Andere tijden in overleg mogelijk." },
        { q: "Is er parkeergelegenheid?", a: "Ja, er is een gratis parkeerplaats op het terrein beschikbaar voor gasten." },
        { q: "Zijn huisdieren toegestaan?", a: "In overleg. Neem contact met ons op om de mogelijkheden te bespreken." },
        { q: "Hoe bereik ik het centrum van Valencia?", a: "Met de auto ben je er in circa 25 minuten. Met het openbaar vervoer (metro) in ongeveer 35 minuten." },
        { q: "Kan ik de keuken volledig gebruiken?", a: "Absoluut! De buitenkeuken is volledig privé en uitgerust met gasfornuis, koelkast en gootsteen." },
        { q: "Is er een minimaal verblijf?", a: `Ja, het minimale verblijf is ${minimumStay} nachten.` },
        { q: "Hoe werkt betaling?", a: "Na bevestiging van je boeking ontvang je een betaalverzoek. We accepteren bankoverschrijving en de meeste gangbare betaalmethoden." },
        { q: "Wat als ik moet annuleren?", a: "Tot 14 dagen voor aankomst kun je kosteloos annuleren. Daarna wordt 50% van het totaalbedrag in rekening gebracht." },
      ],
    },
    rules: {
      title: "Huisregels",
      items: [
        { icon: "clock", text: "Inchecken: 15:00 – 20:00" },
        { icon: "clock", text: "Uitchecken: vóór 11:00" },
        { icon: "ban", text: "Niet roken" },
        { icon: "party", text: "Geen feesten" },
        { icon: "moon", text: "Stilte na 22:00" },
        { icon: "paw", text: "Huisdieren: in overleg" },
      ],
    },
    contact: {
      title: "Contact",
      hostedBy: "Gehost door Charmaine",
      hostDesc: "Ik ben Charmaine en woon zelf in Valencia. Ik heb vaak een borreltje te veel op. Samen paella eten is mijn droom. Ik hou van de was doen en stofzuigen.",
      whatsapp: "WhatsApp",
      footer: "Gemaakt met ♥ in Valencia",
    },
  },
  en: {
    nav: { space: "The Space", amenities: "Amenities", location: "Location", pricing: "Pricing & Booking", reviews: "Reviews", contact: "Contact" },
    hero: { headline1: "Tapas in the city.", headline2: "And relaxing by the pool.", subtitle: "Private guesthouse with garden and pool, fifteen minutes from Valencia.", cta: "Check availability" },
    space: {
      title: "The Space",
      room: { title: "The Room", desc: "A quiet, bright bedroom with comfortable double bed, air conditioning and authentic Spanish atmosphere." },
      bathroom: { title: "The Bathroom", desc: "Private bathroom with walk-in shower, fresh towels and everything you need." },
      kitchen: { title: "The Outdoor Kitchen", desc: "Your own outdoor kitchen with gas stove, fridge and sink under a covered terrace." },
      vibe: "This isn't a hotel, not an Airbnb factory. This is a place with soul — where you wake up with sunlight through the shutters, make coffee in your own kitchen and start the day at your own pace.",
    },
    amenities: {
      title: "Amenities",
      items: ["Private bathroom", "Outdoor kitchen with gas stove, fridge, sink", "Air conditioning", "Free WiFi", "Fresh towels & linens", "Private entrance", "On-site parking", "Washing machine (shared)", "Iron", "Hair dryer", "Outdoor terrace with garden furniture", "Local tips & house guide"],
    },
    location: {
      title: "The Surroundings",
      valencia: { title: "Valencia center", detail: "25 min by car · 35 min by metro" },
      beach: { title: "Beach", detail: "30 min by car · Malvarrosa & El Saler" },
      shops: { title: "Supermarket & restaurants", detail: "5 min walk" },
      desc: "Located in Torrent, an authentic Spanish village just outside Valencia. No tourist crowds here, but real bakeries, Saturday markets and neighbors sitting on their terraces in the evening. The real Spain.",
    },
    pricing: {
      title: "Pricing & Availability",
      nights: "nights",
      night: "night",
      perNight: "per night",
      subtotal: "Subtotal",
      cleaningFee: "Cleaning fee",
      discount: "discount",
      total: "Total",
      selectDates: "Select your dates",
      selectCheckIn: "Choose a check-in date",
      selectCheckOut: "Choose a check-out date",
      minStayWarning: `Minimum stay is ${minimumStay} nights`,
      season: "Season",
      period: "Period",
      pricePerNight: "Price per night",
      pricingOverview: "Pricing overview",
    },
    booking: {
      title: "Booking Request",
      firstName: "First name",
      lastName: "Last name",
      email: "Email address",
      phone: "Phone number",
      guests: "Number of guests",
      arrival: "Estimated arrival time",
      message: "Message (optional)",
      submit: "Send booking request",
      success: "Thank you! We'll confirm your booking within 24 hours.",
      required: "This field is required",
      invalidEmail: "Invalid email address",
      invalidPhone: "Invalid phone number",
    },
    reviews: { title: "What our guests say", note: "Also available on Airbnb and Google" },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        { q: "What are the check-in / check-out times?", a: "Check-in from 15:00 to 20:00. Check-out before 11:00. Other times possible by arrangement." },
        { q: "Is there parking available?", a: "Yes, free on-site parking is available for guests." },
        { q: "Are pets allowed?", a: "By arrangement. Contact us to discuss options." },
        { q: "How do I reach Valencia city center?", a: "By car in about 25 minutes. By public transport (metro) in approximately 35 minutes." },
        { q: "Can I fully use the kitchen?", a: "Absolutely! The outdoor kitchen is fully private with gas stove, fridge and sink." },
        { q: "Is there a minimum stay?", a: `Yes, the minimum stay is ${minimumStay} nights.` },
        { q: "How does payment work?", a: "After confirming your booking, you'll receive a payment request. We accept bank transfer and most common payment methods." },
        { q: "What if I need to cancel?", a: "Free cancellation up to 14 days before arrival. After that, 50% of the total amount will be charged." },
      ],
    },
    rules: {
      title: "House Rules",
      items: [
        { icon: "clock", text: "Check-in: 15:00 – 20:00" },
        { icon: "clock", text: "Check-out: before 11:00" },
        { icon: "ban", text: "No smoking" },
        { icon: "party", text: "No parties" },
        { icon: "moon", text: "Quiet after 22:00" },
        { icon: "paw", text: "Pets: by arrangement" },
      ],
    },
    contact: {
      title: "Contact",
      hostedBy: "Hosted by Charmaine",
      hostDesc: "I'm Charmaine and I live in Valencia. I often have one drink too many. Eating paella together is my dream. I love doing laundry and vacuuming.",
      whatsapp: "WhatsApp",
      footer: "Made with ♥ in Valencia",
    },
  },
});

type Lang = "nl" | "en";

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const amenityIcons = [Bath, ChefHat, Snowflake, Wifi, Bed, DoorOpen, Car, WashingMachine, Shirt, Wind, TreePalm, BookOpen];

const ruleIcons: Record<string, React.ElementType> = {
  clock: Clock, ban: BanIcon, party: PartyPopper, moon: Moon, paw: PawPrint,
};

function isDateBlockedWith(date: Date, blockedDates: PricingConfig["blockedDates"]): boolean {
  return blockedDates.some(b =>
    isWithinInterval(date, { start: parseISO(b.startDate), end: parseISO(b.endDate) })
  );
}

function getPriceForDateWith(date: Date, config: PricingConfig): number {
  for (const cp of config.customPricing) {
    if (isWithinInterval(date, { start: parseISO(cp.startDate), end: parseISO(cp.endDate) }))
      return cp.pricePerNight;
  }
  for (const sp of config.seasonalPricing) {
    if (isWithinInterval(date, { start: parseISO(sp.startDate), end: parseISO(sp.endDate) }))
      return sp.pricePerNight;
  }
  return config.defaultPricePerNight;
}

function calculatePricingWith(checkIn: Date, checkOut: Date, config: PricingConfig) {
  const nights = differenceInCalendarDays(checkOut, checkIn);
  const nightPrices: { date: Date; price: number }[] = [];
  for (let i = 0; i < nights; i++) {
    const d = addDays(checkIn, i);
    nightPrices.push({ date: d, price: getPriceForDateWith(d, config) });
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
  let discountLabel = "";
  if (nights >= 21) { discountPct = config.discounts.monthlyDiscount; discountLabel = "monthly"; }
  else if (nights >= 7) { discountPct = config.discounts.weeklyDiscount; discountLabel = "weekly"; }

  const discountAmount = Math.round(subtotal * discountPct / 100);
  const total = subtotal - discountAmount + config.cleaningFee;

  return { nights, groups, subtotal, discountPct, discountLabel, discountAmount, cleaningFee: config.cleaningFee, total };
}

function hasBlockedDateInRangeWith(start: Date, end: Date, blockedDates: PricingConfig["blockedDates"]): boolean {
  const days = eachDayOfInterval({ start, end: addDays(end, -1) });
  return days.some(d => isDateBlockedWith(d, blockedDates));
}

// ═══════════════════════════════════════════════════════════════
// SCROLL ANIMATION WRAPPER
// ═══════════════════════════════════════════════════════════════

function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function Index() {
  const [lang, setLang] = useState<Lang>("nl");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const [calMonth, setCalMonth] = useState(startOfMonth(new Date()));
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // ═══ DATABASE STATE ═══
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>({
    defaultPricePerNight: 65, cleaningFee: 35, minimumStay: 2, maximumStay: 28,
    seasonalPricing: [], customPricing: [], blockedDates: [],
    discounts: { weeklyDiscount: 10, monthlyDiscount: 20 },
  });
  const [photos, setPhotos] = useState<Record<string, { primary: string; gallery: string[] }>>({});
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch all data from DB
  useEffect(() => {
    async function fetchData() {
      const [
        { data: cfg },
        { data: seasonal },
        { data: custom },
        { data: blocked },
        { data: sitePhotos },
      ] = await Promise.all([
        supabase.from("pricing_config").select("*").limit(1).single(),
        supabase.from("seasonal_pricing").select("*").order("start_date"),
        supabase.from("custom_pricing").select("*").order("start_date"),
        supabase.from("blocked_dates").select("*").order("start_date"),
        supabase.from("site_photos").select("*").order("sort_order"),
      ]);

      if (cfg) {
        setPricingConfig({
          defaultPricePerNight: cfg.default_price_per_night,
          cleaningFee: cfg.cleaning_fee,
          minimumStay: cfg.minimum_stay,
          maximumStay: cfg.maximum_stay,
          seasonalPricing: (seasonal || []).map(s => ({
            label: s.label, labelEn: s.label_en, startDate: s.start_date, endDate: s.end_date, pricePerNight: s.price_per_night,
          })),
          customPricing: (custom || []).map(c => ({
            label: c.label, startDate: c.start_date, endDate: c.end_date, pricePerNight: c.price_per_night,
          })),
          blockedDates: (blocked || []).map(b => ({
            startDate: b.start_date, endDate: b.end_date, reason: b.reason || "",
          })),
          discounts: { weeklyDiscount: cfg.weekly_discount, monthlyDiscount: cfg.monthly_discount },
        });
      }

      // Process photos
      if (sitePhotos && sitePhotos.length > 0) {
        const photoMap: Record<string, { primary: string; gallery: string[] }> = {};
        for (const p of sitePhotos) {
          if (!photoMap[p.category]) photoMap[p.category] = { primary: "", gallery: [] };
          photoMap[p.category].gallery.push(p.url);
          if (p.is_primary) photoMap[p.category].primary = p.url;
        }
        // If no primary set, use first
        for (const cat of Object.keys(photoMap)) {
          if (!photoMap[cat].primary && photoMap[cat].gallery.length > 0) {
            photoMap[cat].primary = photoMap[cat].gallery[0];
          }
        }
        setPhotos(photoMap);
      }

      setDataLoaded(true);
    }
    fetchData();
  }, []);

  // Get image for category (DB or fallback)
  const getImg = useCallback((category: string, fallback: string) => {
    return photos[category]?.primary || fallback;
  }, [photos]);

  const getGallery = useCallback((category: string, fallback: string) => {
    if (photos[category]?.gallery.length > 0) return photos[category].gallery;
    return [fallback];
  }, [photos]);

  const heroImg = getImg("hero", heroImgFallback);
  const roomImg = getImg("room", roomImgFallback);
  const bathroomImg = getImg("bathroom", bathroomImgFallback);
  const kitchenImg = getImg("kitchen", kitchenImgFallback);
  const hostImg = getImg("host", hostImgFallback);

  const t = useMemo(() => getTranslations(pricingConfig.minimumStay)[lang], [lang, pricingConfig.minimumStay]);
  const dateFnsLocale = lang === "nl" ? nl : enUS;

  // Scroll listener for nav
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
      if (e.key === "ArrowLeft") setLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }, []);

  // Calendar date click
  const handleDateClick = useCallback((date: Date) => {
    if (isDateBlockedWith(date, pricingConfig.blockedDates)) return;
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
        if (hasBlockedDateInRangeWith(checkIn, date, pricingConfig.blockedDates)) {
          setCheckIn(date);
          setCheckOut(null);
        } else {
          setCheckOut(date);
        }
      }
    }
  }, [checkIn, checkOut, pricingConfig.blockedDates]);

  const pricing = useMemo(() => {
    if (checkIn && checkOut) return calculatePricingWith(checkIn, checkOut, pricingConfig);
    return null;
  }, [checkIn, checkOut, pricingConfig]);

  const nightCount = pricing?.nights ?? 0;
  const belowMinimum = nightCount > 0 && nightCount < pricingConfig.minimumStay;

  // Form submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const errors: Record<string, string> = {};
    if (!data.get("firstName")) errors.firstName = t.booking.required;
    if (!data.get("lastName")) errors.lastName = t.booking.required;
    const email = data.get("email") as string;
    if (!email) errors.email = t.booking.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = t.booking.invalidEmail;
    const phone = data.get("phone") as string;
    if (!phone) errors.phone = t.booking.required;
    else if (!/^[\d\s+\-()]{7,}$/.test(phone)) errors.phone = t.booking.invalidPhone;
    if (!data.get("guests")) errors.guests = t.booking.required;

    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormErrors({});
    setBookingSubmitted(true);
  };

  const navSections = [
    { id: "space", label: t.nav.space },
    { id: "amenities", label: t.nav.amenities },
    { id: "location", label: t.nav.location },
    { id: "pricing", label: t.nav.pricing },
    { id: "reviews", label: t.nav.reviews },
    { id: "contact", label: t.nav.contact },
  ];

  const spaceCards = [
    { img: roomImg, ...t.space.room, gallery: getGallery("room", roomImgFallback) },
    { img: bathroomImg, ...t.space.bathroom, gallery: getGallery("bathroom", bathroomImgFallback) },
    { img: kitchenImg, ...t.space.kitchen, gallery: getGallery("kitchen", kitchenImgFallback) },
  ];

  // ─── RENDER ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══ NAVIGATION ═══ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <button onClick={() => scrollTo("hero")} className="font-serif text-xl tracking-wide">
            Casa Valencia
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navSections.map(s => (
              <button key={s.id} onClick={() => scrollTo(s.id)} className="text-sm font-medium hover:text-primary transition-colors">
                {s.label}
              </button>
            ))}
            <button
              onClick={() => setLang(lang === "nl" ? "en" : "nl")}
              className="flex items-center gap-1 text-sm border border-border rounded-lg px-3 py-1.5 hover:bg-accent transition-colors"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              {lang === "nl" ? "EN" : "NL"}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setLang(lang === "nl" ? "en" : "nl")}
              className="text-sm border border-border rounded-lg px-2 py-1 hover:bg-accent transition-colors"
            >
              {lang === "nl" ? "EN" : "NL"}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-md overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {navSections.map(s => (
                  <button key={s.id} onClick={() => scrollTo(s.id)} className="text-left text-base font-medium py-2 hover:text-primary transition-colors">
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden grain-overlay">
        <img src={heroImg} alt="Mediterranean courtyard" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-foreground/30" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
        >
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-background mb-6 drop-shadow-lg leading-tight">
            {t.hero.headline1}<br />{t.hero.headline2}
          </h1>
          <p className="text-lg sm:text-xl text-background/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
          <button
            onClick={() => scrollTo("pricing")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-base font-medium hover:bg-primary/90 transition-colors shadow-lg"
          >
            {t.hero.cta}
          </button>
        </motion.div>
      </section>

      {/* ═══ DE RUIMTE ═══ */}
      <section id="space" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeInSection>
          <h2 className="font-serif text-3xl sm:text-4xl text-center mb-12">{t.space.title}</h2>
        </FadeInSection>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {spaceCards.map((card, i) => (
            <FadeInSection key={i}>
              <button
                onClick={() => setLightbox({ images: card.gallery, index: 0 })}
                className="group w-full text-left bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="overflow-hidden aspect-[4/3]">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                </div>
              </button>
            </FadeInSection>
          ))}
        </div>
        <FadeInSection>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto leading-relaxed italic">
            {t.space.vibe}
          </p>
        </FadeInSection>
      </section>

      {/* ═══ VOORZIENINGEN ═══ */}
      <section id="amenities" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <h2 className="font-serif text-3xl sm:text-4xl text-center mb-12">{t.amenities.title}</h2>
          </FadeInSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.amenities.items.map((item, i) => {
              const Icon = amenityIcons[i];
              return (
                <FadeInSection key={i}>
                  <div className="flex items-center gap-3 bg-card rounded-lg p-4 shadow-sm">
                    <Icon size={20} className="text-primary shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ DE OMGEVING ═══ */}
      <section id="location" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeInSection>
          <h2 className="font-serif text-3xl sm:text-4xl text-center mb-12">{t.location.title}</h2>
        </FadeInSection>
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <FadeInSection>
            <div className="rounded-xl overflow-hidden shadow-md aspect-[4/3] bg-muted">
              <iframe
                title="Google Maps - Torrent, Valencia"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49568.44976518!2d-0.4936!3d39.4367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6045f86b3b3b3b%3A0x1!2sTorrent%2C+Valencia!5e0!3m2!1sen!2ses!4v1"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeInSection>
          <div className="flex flex-col gap-4">
            {[
              { ...t.location.valencia, icon: MapPin },
              { ...t.location.beach, icon: Waves },
              { ...t.location.shops, icon: ShoppingBag },
            ].map((item, i) => (
              <FadeInSection key={i}>
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon size={20} className="text-primary" />
                    <h3 className="font-serif text-lg">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{item.detail}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
        <FadeInSection>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.location.desc}
          </p>
        </FadeInSection>
      </section>

      {/* ═══ PRIJZEN & BOEKEN ═══ */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <h2 className="font-serif text-3xl sm:text-4xl text-center mb-4">{t.pricing.title}</h2>
            <p className="text-center text-muted-foreground mb-10">{t.pricing.selectDates}</p>
          </FadeInSection>

          {/* Calendar */}
          <FadeInSection>
            <div className="bg-card rounded-xl shadow-md p-4 sm:p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="Previous month">
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-4 sm:gap-12 text-center">
                  <span className="font-serif text-lg capitalize">{format(calMonth, "MMMM yyyy", { locale: dateFnsLocale })}</span>
                  <span className="font-serif text-lg capitalize hidden sm:block">{format(addMonths(calMonth, 1), "MMMM yyyy", { locale: dateFnsLocale })}</span>
                </div>
                <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="Next month">
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[0, 1].map(offset => {
                  const month = addMonths(calMonth, offset);
                  const monthStart = startOfMonth(month);
                  const monthEnd = endOfMonth(month);
                  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
                  const startPad = getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1;
                  const dayLabels = lang === "nl" ? ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"] : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

                  return (
                    <div key={offset} className={offset === 1 ? "hidden sm:block" : ""}>
                      <div className="sm:hidden mb-2 text-center font-serif text-lg capitalize">
                        {format(month, "MMMM yyyy", { locale: dateFnsLocale })}
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-1">
                        {dayLabels.map(d => (
                          <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
                        {days.map(day => {
                          const today = startOfDay(new Date());
                          const isToday = isSameDay(day, today);
                          const isPast = isBefore(day, today);
                          const blocked = isDateBlockedWith(day, pricingConfig.blockedDates);
                          const isStart = checkIn && isSameDay(day, checkIn);
                          const isEnd = checkOut && isSameDay(day, checkOut);
                          const inRange = checkIn && checkOut && isAfter(day, checkIn) && isBefore(day, checkOut);
                          const inHoverRange = checkIn && !checkOut && hoverDate && isAfter(hoverDate, checkIn) && isAfter(day, checkIn) && !isAfter(day, hoverDate) && !blocked && !isPast;
                          const disabled = isPast || blocked;

                          return (
                            <button
                              key={day.toISOString()}
                              disabled={disabled}
                              onClick={() => handleDateClick(day)}
                              onMouseEnter={() => !disabled && setHoverDate(day)}
                              onMouseLeave={() => setHoverDate(null)}
                              className={`
                                relative aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-150
                                ${disabled ? "text-calendar-blocked cursor-not-allowed line-through" : "hover:bg-primary/10 cursor-pointer"}
                                ${isStart || isEnd ? "bg-primary text-primary-foreground font-semibold" : ""}
                                ${inRange ? "bg-primary/20" : ""}
                                ${inHoverRange ? "bg-primary/10" : ""}
                                ${isToday && !isStart && !isEnd ? "ring-1 ring-primary/40" : ""}
                              `}
                              aria-label={format(day, "d MMMM yyyy", { locale: dateFnsLocale })}
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
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {!checkIn && t.pricing.selectCheckIn}
                {checkIn && !checkOut && t.pricing.selectCheckOut}
                {checkIn && checkOut && !belowMinimum && `${format(checkIn, "d MMM", { locale: dateFnsLocale })} → ${format(checkOut, "d MMM yyyy", { locale: dateFnsLocale })}`}
                {belowMinimum && <span className="text-destructive">{t.pricing.minStayWarning}</span>}
              </div>
            </div>
          </FadeInSection>

          {/* Pricing breakdown */}
          {pricing && !belowMinimum && (
            <FadeInSection>
              <div className="bg-card rounded-xl shadow-md p-6 mb-8">
                <div className="space-y-2 text-sm">
                  {pricing.groups.map((g, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{g.count} {g.count === 1 ? t.pricing.night : t.pricing.nights} × €{g.price}</span>
                      <span>€{g.count * g.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span>{t.pricing.cleaningFee}</span>
                    <span>€{pricing.cleaningFee}</span>
                  </div>
                  {pricing.discountPct > 0 && (
                    <div className="flex justify-between text-success">
                      <span>{pricing.discountPct}% {t.pricing.discount} ({pricing.nights >= 21 ? "21+" : "7+"} {t.pricing.nights})</span>
                      <span>−€{pricing.discountAmount}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold text-base">
                    <span>{t.pricing.total}</span>
                    <span>€{pricing.total}</span>
                  </div>
                </div>
              </div>
            </FadeInSection>
          )}

          {/* Booking form */}
          {pricing && !belowMinimum && !bookingSubmitted && (
            <FadeInSection>
              <div className="bg-card rounded-xl shadow-md p-6 mb-8">
                <h3 className="font-serif text-2xl mb-6">{t.booking.title}</h3>
                <form ref={formRef} onSubmit={handleBookingSubmit} className="grid sm:grid-cols-2 gap-4" noValidate>
                  {[
                    { name: "firstName", label: t.booking.firstName, type: "text" },
                    { name: "lastName", label: t.booking.lastName, type: "text" },
                    { name: "email", label: t.booking.email, type: "email" },
                    { name: "phone", label: t.booking.phone, type: "tel" },
                  ].map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium mb-1">{field.label} *</label>
                      <input
                        name={field.name}
                        type={field.type}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                      {formErrors[field.name] && <p className="text-destructive text-xs mt-1">{formErrors[field.name]}</p>}
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.booking.guests} *</label>
                    <select name="guests" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required>
                      <option value="">—</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                    {formErrors.guests && <p className="text-destructive text-xs mt-1">{formErrors.guests}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.booking.arrival}</label>
                    <select name="arrival" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">—</option>
                      {["15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">{t.booking.message}</label>
                    <textarea name="message" rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <button type="submit" className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-medium hover:bg-primary/90 transition-colors">
                      {t.booking.submit}
                    </button>
                  </div>
                </form>
              </div>
            </FadeInSection>
          )}

          {/* Success state */}
          {bookingSubmitted && (
            <FadeInSection>
              <div className="bg-card rounded-xl shadow-md p-8 mb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-lg font-medium mb-2">{t.booking.success}</p>
                {checkIn && checkOut && pricing && (
                  <p className="text-muted-foreground text-sm">
                    {format(checkIn, "d MMM", { locale: dateFnsLocale })} → {format(checkOut, "d MMM yyyy", { locale: dateFnsLocale })} · {pricing.nights} {t.pricing.nights} · €{pricing.total}
                  </p>
                )}
              </div>
            </FadeInSection>
          )}

          {/* Pricing table */}
          <FadeInSection>
            <div className="bg-card rounded-xl shadow-md p-6">
              <h3 className="font-serif text-xl mb-4">{t.pricing.pricingOverview}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium">{t.pricing.season}</th>
                      <th className="text-left py-2 font-medium">{t.pricing.period}</th>
                      <th className="text-right py-2 font-medium">{t.pricing.pricePerNight}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingConfig.seasonalPricing.map((s, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2.5">{lang === "nl" ? s.label : s.labelEn}</td>
                        <td className="py-2.5 text-muted-foreground">
                          {format(parseISO(s.startDate), "d MMM", { locale: dateFnsLocale })} – {format(parseISO(s.endDate), "d MMM yyyy", { locale: dateFnsLocale })}
                        </td>
                        <td className="py-2.5 text-right font-medium">€{s.pricePerNight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeInSection>
          <h2 className="font-serif text-3xl sm:text-4xl text-center mb-12">{t.reviews.title}</h2>
        </FadeInSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {REVIEWS.map((r, i) => (
            <FadeInSection key={i}>
              <div className="bg-card rounded-xl p-6 shadow-sm h-full flex flex-col">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={16} className={s < r.rating ? "text-primary fill-primary" : "text-muted"} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 italic">"{lang === "nl" ? r.nl : r.en}"</p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{r.country}</span>
                  <span>{r.name}</span>
                  <span className="text-muted-foreground ml-auto">{r.date}</span>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">{t.reviews.note}</p>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-3xl mx-auto">
          <FadeInSection>
            <h2 className="font-serif text-3xl sm:text-4xl text-center mb-12">{t.faq.title}</h2>
          </FadeInSection>
          <div className="space-y-3">
            {t.faq.items.map((item, i) => (
              <FadeInSection key={i}>
                <div className="bg-card rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-medium text-sm hover:bg-accent/50 transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span>{item.q}</span>
                    <ChevronRight size={18} className={`shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HUISREGELS ═══ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <FadeInSection>
          <h2 className="font-serif text-3xl sm:text-4xl text-center mb-12">{t.rules.title}</h2>
        </FadeInSection>
        <div className="grid sm:grid-cols-2 gap-3">
          {t.rules.items.map((rule, i) => {
            const Icon = ruleIcons[rule.icon] || Clock;
            return (
              <FadeInSection key={i}>
                <div className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-sm">
                  <Icon size={18} className="text-primary shrink-0" />
                  <span className="text-sm">{rule.text}</span>
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </section>

      {/* ═══ CONTACT & FOOTER ═══ */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInSection>
            <h2 className="font-serif text-3xl sm:text-4xl mb-8">{t.contact.title}</h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <img src={hostImg} alt="Host" className="w-44 h-44 rounded-full object-cover shadow-md" loading="lazy" />
              <div className="text-left">
                <p className="font-serif text-lg">{t.contact.hostedBy}</p>
                <p className="text-sm text-muted-foreground">{t.contact.hostDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="mailto:hola@casavalencia.es" className="flex items-center gap-2 bg-card rounded-lg px-5 py-3 shadow-sm hover:shadow-md transition-shadow text-sm font-medium">
                <Mail size={18} className="text-primary" /> hola@casavalencia.es
              </a>
              <a
                href="https://wa.me/34600000000?text=Hola!%20Ik%20heb%20interesse%20in%20een%20verblijf%20bij%20Casa%20Valencia."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-secondary text-secondary-foreground rounded-lg px-5 py-3 shadow-sm hover:shadow-md transition-shadow text-sm font-medium"
              >
                <MessageCircle size={18} /> {t.contact.whatsapp}
              </a>
              <a href="https://instagram.com/casavalencia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-card rounded-lg px-5 py-3 shadow-sm hover:shadow-md transition-shadow text-sm font-medium">
                <Instagram size={18} className="text-primary" /> Instagram
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border">
        <p>© {new Date().getFullYear()} Casa Valencia · {t.contact.footer}</p>
      </footer>

      {/* ═══ LIGHTBOX ═══ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightbox.images[lightbox.index]}
                alt=""
                className="w-full rounded-xl object-contain max-h-[80vh]"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              {lightbox.images.length > 1 && (
                <>
                  <button
                    onClick={() => setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length })}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.images.length })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {lightbox.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox({ ...lightbox, index: i })}
                    className={`w-2 h-2 rounded-full transition-colors ${i === lightbox.index ? "bg-background" : "bg-background/40"}`}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
